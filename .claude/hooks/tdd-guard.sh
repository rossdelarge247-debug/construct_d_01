#!/bin/bash
# tdd-guard.sh — PreToolUse:Write + PreToolUse:Edit gate.
#
# Per docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-6:
#   "Any Write or Edit to src/<path> triggers the affected test file
#   (tests/unit/<path>.test.ts mapping per repo convention) to run via
#   `npx vitest run`; the tool call is refused on RED with a G17-style
#   explanatory message. Gates BEHAVIOUR (test passes), complementing
#   v3a's discipline-only AC-5 (tdd-first-every-commit.sh) which only
#   gates PAPERWORK (test file is staged)."
#
# Source attribution: external TDD-workflow article (claude-world.com),
# HANDOFF-SESSION-31 §7 L92.
#
# Logic:
#   1. Read PreToolUse hook input JSON from stdin.
#   2. Extract tool_input.file_path (Write + Edit share this field).
#   3. Bail out when path doesn't match src/**.{ts,tsx} (out of scope).
#   4. Filter via docs/tdd-exemption-allowlist.txt (reuse v3a AC-5 file).
#   5. Map src/<path>.{ts,tsx} → tests/unit/<path>.test.{ts,tsx}.
#   6. If test file missing: block with "missing test" message
#      (distinct from RED — author hasn't authored a test yet).
#   7. Run `npx vitest run <test-file>` with budget cap:
#      - warn on stderr at 60s elapsed (still running).
#      - abort with non-zero exit at 90s elapsed (fail-loud).
#   8. RED → exit 2 with G17 message naming the failing assertion.
#   9. GREEN → exit 0 (tool call proceeds).
#
# Bypass: add path-glob to docs/tdd-exemption-allowlist.txt under
# 'control-change' label (path is L199-protected via v3a AC-5 scope
# extension — re-baseline hooks-checksums.txt + ship under label).
#
# Out of scope (per AC-6 §Scope): cross-language test-file mapping
# beyond .ts/.tsx/.test.ts (defer to v3c if needed).

set -uo pipefail

INPUT=$(cat || true)
[ -z "$INPUT" ] && exit 0

TOOL_NAME=$(printf '%s' "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null || echo "")
FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")

# Out-of-band tools: pass through silently.
case "$TOOL_NAME" in
  Write|Edit) ;;
  *) exit 0 ;;
esac

[ -z "$FILE_PATH" ] && exit 0

# Strip leading ./ and any cwd prefix so allowlist globs match consistently.
RELPATH="${FILE_PATH#./}"
case "$RELPATH" in
  /*)
    # Absolute path: try to make it repo-relative.
    REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "")"
    [ -n "$REPO_ROOT" ] && RELPATH="${RELPATH#"$REPO_ROOT"/}"
    ;;
esac

# Out-of-scope paths: only src/**.{ts,tsx} are gated.
case "$RELPATH" in
  src/*.ts|src/*.tsx) ;;
  *) exit 0 ;;
esac

# Allowlist filter: reuse v3a AC-5 file (path-glob match).
ALLOWLIST_FILE="docs/tdd-exemption-allowlist.txt"
if [ -f "$ALLOWLIST_FILE" ]; then
  while IFS= read -r line; do
    line="${line%%#*}"
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    [ -z "$line" ] && continue
    # Strip optional category tag (v3b AC-8): "category:glob" → "glob".
    case "$line" in
      *:*) glob="${line#*:}" ;;
      *) glob="$line" ;;
    esac
    # shellcheck disable=SC2254  # intentional glob match
    case "$RELPATH" in
      $glob) exit 0 ;;
    esac
  done < "$ALLOWLIST_FILE"
fi

# Map src/<path>.{ts,tsx} → tests/unit/<path>.test.{ts,tsx}.
# Preserve extension; replace leading 'src/' with 'tests/unit/';
# insert '.test' before extension.
case "$RELPATH" in
  src/*.tsx) ext="tsx"; stem="${RELPATH#src/}"; stem="${stem%.tsx}" ;;
  src/*.ts)  ext="ts";  stem="${RELPATH#src/}"; stem="${stem%.ts}"  ;;
  *) exit 0 ;;
esac
TEST_FILE="tests/unit/${stem}.test.${ext}"

if [ ! -f "$TEST_FILE" ]; then
  {
    echo "BLOCKED: tdd-guard — test file missing for $RELPATH."
    echo
    echo "  Expected test path (deterministic mapping):"
    echo "    $TEST_FILE"
    echo
    echo "  Per docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-6"
    echo "  + CLAUDE.md Engineering conventions: TDD where tractable. Write the"
    echo "  test first, then the code to pass it."
    echo
    echo "Actionable alternatives:"
    echo "  - Author $TEST_FILE before authoring/editing $RELPATH."
    echo "  - For genuine exemptions (pure-rename / pure-config / pure-visual),"
    echo "    add a tagged path-glob to $ALLOWLIST_FILE (per v3b AC-8 rubric)"
    echo "    and ship in a PR carrying 'control-change'."
  } >&2
  exit 2
fi

# Run vitest with budget cap. Background + timer pattern lets us emit a
# 60s-elapsed warning while the run is still in flight (per AC-6 literal).
TMP_OUT="$(mktemp -t tdd-guard-vitest.XXXXXX)"
trap 'rm -f "$TMP_OUT"' EXIT

# Test seams (per CLAUDE.md "Effects behind interfaces"):
#   TDD_GUARD_VITEST_CMD — override vitest invocation (default: `npx --no vitest run`)
#   TDD_GUARD_TIMEOUT    — hard-cap budget seconds (default: 90)
#   TDD_GUARD_WARN_AT    — soft-warn threshold seconds (default: 60)
# Production callers leave these unset; shellspec sets them to make the
# RED/GREEN/timeout fixtures fast + dependency-free.
VITEST_CMD="${TDD_GUARD_VITEST_CMD:-npx --no vitest run}"
TIMEOUT_BUDGET="${TDD_GUARD_TIMEOUT:-90}"
WARN_AT="${TDD_GUARD_WARN_AT:-60}"

if [ -z "${TDD_GUARD_VITEST_CMD:-}" ] && ! command -v npx >/dev/null 2>&1; then
  # No npx available (e.g. local pre-deps state) — pass through with a
  # one-line note. CI always has npx; pre-commit-verify.sh covers that path.
  echo "tdd-guard: npx not on PATH; skipping vitest run for $RELPATH" >&2
  exit 0
fi

# shellcheck disable=SC2086  # word-splitting required: $VITEST_CMD may carry args.
$VITEST_CMD "$TEST_FILE" >"$TMP_OUT" 2>&1 &
VITEST_PID=$!

ELAPSED=0
WARNED=0
while kill -0 "$VITEST_PID" 2>/dev/null; do
  sleep 1
  ELAPSED=$((ELAPSED + 1))
  if [ "$WARNED" -eq 0 ] && [ "$ELAPSED" -ge "$WARN_AT" ]; then
    echo "tdd-guard: vitest run for $TEST_FILE has elapsed ${WARN_AT}s; will abort at ${TIMEOUT_BUDGET}s" >&2
    WARNED=1
  fi
  if [ "$ELAPSED" -ge "$TIMEOUT_BUDGET" ]; then
    kill "$VITEST_PID" 2>/dev/null
    sleep 1
    kill -9 "$VITEST_PID" 2>/dev/null || true
    {
      echo "BLOCKED: tdd-guard — vitest run for $TEST_FILE timed out after ${TIMEOUT_BUDGET}s."
      echo
      echo "  The test file took longer than the budget cap. Either the test"
      echo "  is genuinely slow (split it) or it hangs on a pending promise."
      echo
      echo "Last 20 lines of vitest output:"
      tail -n 20 "$TMP_OUT" | sed 's/^/    /'
    } >&2
    exit 2
  fi
done
wait "$VITEST_PID"
RC=$?

if [ "$RC" -ne 0 ]; then
  {
    echo "BLOCKED: tdd-guard — RED test for $RELPATH."
    echo
    echo "  Test file: $TEST_FILE"
    echo "  Per AC-6 (v3b) + CLAUDE.md Engineering conventions: GREEN before"
    echo "  edit. Make the test pass before re-editing the src file."
    echo
    echo "Failing assertions / output:"
    tail -n 40 "$TMP_OUT" | sed 's/^/    /'
    echo
    echo "Actionable alternatives:"
    echo "  - Run \`npx vitest run $TEST_FILE\` interactively + fix the failure."
    echo "  - If the assertion is wrong (not the impl), update the test."
    echo "  - DOD7_OVERRIDE-style env override is NOT provided for tdd-guard;"
    echo "    bypass requires explicit allowlist entry under 'control-change'."
  } >&2
  exit 2
fi

# GREEN — pass through.
exit 0
