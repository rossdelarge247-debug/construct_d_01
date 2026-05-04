#!/usr/bin/env bash
# run-synthetic.sh — synthetic-deliberate-injection per-persona regression
# detection.
#
# For each dimension {security, architecture, correctness, style}: composes a
# brief from the persona file + per-invocation nonce + the synthetic .diff;
# invokes `claude -p --output-format=json`; parses the raw output via
# `scripts/auto-review-parse.sh`; runs `match-synthetic.sh` against the
# expected signature.
#
# Exit 0 on all-pass (or skip-on-no-API-key); exit 1 on any matcher failure.
#
# See tests/personas/synthetic/README.md for the design rationale.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SYNTHETIC_DIR="$SCRIPT_DIR/synthetic"
EXPECTED_DIR="$SYNTHETIC_DIR/expected"
PARSER="$REPO_ROOT/scripts/auto-review-parse.sh"
MATCHER="$SCRIPT_DIR/match-synthetic.sh"

# CLI version pinned in lockstep with `.github/workflows/auto-review.yml`. Drift
# between the two pins makes synthetic-injection signal incomparable to the
# production review path; bump both together when upgrading.
CLAUDE_CLI_VERSION="${CLAUDE_CLI_VERSION:-2.1.126}"

# Skip-on-no-API-key: forks and contributors without secret access exit
# neutrally rather than fail the workflow. The same skip-with-neutral
# semantic governs every API-key-dependent gate in the rigour pipeline.
if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  printf 'run-synthetic.sh: SKIP — ANTHROPIC_API_KEY not set\n' >&2
  exit 0
fi

[ -d "$SYNTHETIC_DIR" ] || { printf 'run-synthetic.sh: synthetic dir not found: %s\n' "$SYNTHETIC_DIR" >&2; exit 2; }
[ -x "$PARSER" ] || { printf 'run-synthetic.sh: parser not executable: %s\n' "$PARSER" >&2; exit 2; }
[ -x "$MATCHER" ] || { printf 'run-synthetic.sh: matcher not executable: %s\n' "$MATCHER" >&2; exit 2; }

WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT

FAIL=0
TOTAL=0

for DIM in security architecture correctness style; do
  TOTAL=$((TOTAL + 1))
  printf '\n=== Synthetic [%s] ===\n' "$DIM"

  PERSONA_FILE="$REPO_ROOT/.claude/agents/reviewer-${DIM}.md"
  FIXTURE="$SYNTHETIC_DIR/${DIM}.diff"
  EXPECTED="$EXPECTED_DIR/${DIM}.json"
  BRIEF="$WORKDIR/brief-${DIM}.txt"
  RAW="$WORKDIR/raw-${DIM}.json"
  ENVELOPE="$WORKDIR/envelope-${DIM}.json"

  if [ ! -f "$PERSONA_FILE" ] || [ ! -f "$FIXTURE" ] || [ ! -f "$EXPECTED" ]; then
    printf 'run-synthetic.sh [%s]: FAIL — missing input file(s)\n' "$DIM" >&2
    [ -f "$PERSONA_FILE" ] || printf '  missing: %s\n' "$PERSONA_FILE" >&2
    [ -f "$FIXTURE" ] || printf '  missing: %s\n' "$FIXTURE" >&2
    [ -f "$EXPECTED" ] || printf '  missing: %s\n' "$EXPECTED" >&2
    FAIL=$((FAIL + 1))
    continue
  fi

  NONCE=$(openssl rand -hex 16 2>/dev/null || head -c 32 /dev/urandom | xxd -p)

  # Compose synthetic brief: persona body + nonce + fenced .diff. No slice-AC
  # or coding-conduct fences — synthetic context evaluates the diff against
  # the persona's own rubric in isolation, without external anchoring.
  {
    cat "$PERSONA_FILE"
    printf '\nYour per-invocation nonce: %s\n\n' "$NONCE"
    printf '<pr-diff-%s>\n' "$NONCE"
    cat "$FIXTURE"
    printf '</pr-diff-%s>\n' "$NONCE"
  } > "$BRIEF"

  printf 'run-synthetic.sh [%s]: invoking claude -p (CLI %s)...\n' "$DIM" "$CLAUDE_CLI_VERSION"

  if ! npx -y "@anthropic-ai/claude-code@${CLAUDE_CLI_VERSION}" -p --output-format=json \
        < "$BRIEF" > "$RAW" 2>"$WORKDIR/err-${DIM}.txt"; then
    printf 'run-synthetic.sh [%s]: FAIL — claude -p invocation failed\n' "$DIM" >&2
    sed 's/^/  stderr: /' "$WORKDIR/err-${DIM}.txt" >&2 || true
    FAIL=$((FAIL + 1))
    continue
  fi

  if ! "$PARSER" < "$RAW" > "$ENVELOPE" 2>"$WORKDIR/parse-err-${DIM}.txt"; then
    printf 'run-synthetic.sh [%s]: FAIL — parser failed\n' "$DIM" >&2
    sed 's/^/  parse-stderr: /' "$WORKDIR/parse-err-${DIM}.txt" >&2 || true
    FAIL=$((FAIL + 1))
    continue
  fi

  if ! "$MATCHER" "$ENVELOPE" "$EXPECTED"; then
    FAIL=$((FAIL + 1))
  fi
done

printf '\n=== Synthetic summary: %d dimension(s); %d failure(s) ===\n' "$TOTAL" "$FAIL"
[ "$FAIL" -eq 0 ] || exit 1
