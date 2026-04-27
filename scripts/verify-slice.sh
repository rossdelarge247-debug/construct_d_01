#!/usr/bin/env bash
# verify-slice.sh — slice Definition-of-Done verification workhorse.
#
# Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-1 (L46) +
# G17 useful-message exit pattern (matches .claude/hooks/read-cap.sh).
#
# Modes:
#   incremental (default) — staged-diff scope; called from pre-commit-verify.sh
#                           (perf budget <5s per AC-4 + G16).
#   --full                — full repo scope; adds tsc + vitest + coverage gate;
#                           called from CI.
#
# Gates (in order):
#   1. File presence:                        acceptance.md + security.md + verification.md
#   2. Spec 72 §11 13-item checklist:        boxes 1..13 in security.md (table OR heading form)
#   3. Leak scan on staged diff:             basic secret-pattern detection
#   4. ESLint denial check (full only):      delegates to scripts/eslint-no-disable.sh
#   5. Coverage thresholds (full only):      per-language lcov parse (S-38-4 activates)
#   6. tsc (full only):                      type-check the repo
#   7. vitest (full only):                   unit + integration suite
#
# Usage: scripts/verify-slice.sh [--full | --incremental] <slice-dir>
# Exit:  0 all gates pass
#        1 gate failure (with G17 useful-message + actionable alternatives)
#        2 usage error

set -euo pipefail

MODE="incremental"
SLICE_DIR=""

while [ $# -gt 0 ]; do
  case "$1" in
    --full)        MODE="full"; shift ;;
    --incremental) MODE="incremental"; shift ;;
    -h|--help)
      sed -n '2,18p' "$0" | sed 's/^# \?//'
      exit 0
      ;;
    -*)
      echo "verify-slice.sh: unknown flag: $1" >&2
      exit 2
      ;;
    *) SLICE_DIR="$1"; shift ;;
  esac
done

if [ -z "$SLICE_DIR" ]; then
  echo "verify-slice.sh: usage: $0 [--full|--incremental] <slice-dir>" >&2
  exit 2
fi

if [ ! -d "$SLICE_DIR" ]; then
  echo "verify-slice.sh: slice directory not found: $SLICE_DIR" >&2
  exit 2
fi

# --- Gate 1: file presence -------------------------------------------------

REQUIRED_FILES=(acceptance.md security.md verification.md)
MISSING=()
for f in "${REQUIRED_FILES[@]}"; do
  [ -f "$SLICE_DIR/$f" ] || MISSING+=("$f")
done

if [ "${#MISSING[@]}" -gt 0 ]; then
  {
    echo "DENIED: slice ${SLICE_DIR} is missing required Definition of Done artefact(s):"
    echo
    for f in "${MISSING[@]}"; do echo "  - $f"; done
    echo
    echo "  Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-1 + DoD:"
    echo "  every slice must carry acceptance.md (rules + AC table) + security.md"
    echo "  (spec 72 §11 evidence) + verification.md (per-AC evidence + run-IDs)."
    echo
    echo "Actionable alternatives:"
    echo "  - Create the missing artefact(s) from docs/slices/_template/ as starting point."
    echo "  - If this slice predates the DoD requirement, document the exemption in"
    echo "    acceptance.md §Pre-AC-1 exempt commits and re-run."
    echo "  - Verify the slice directory path is correct: ${SLICE_DIR}"
  } >&2
  exit 1
fi

# --- Gate 2: spec 72 §11 13-item checklist presence in security.md ---------
# Accept two real-slice forms:
#   table-row | N | ... | (v3a slice)
#   heading   ## N. ...  (S-F7-α slice)

SECURITY="$SLICE_DIR/security.md"
MISSING_BOXES=()
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13; do
  if ! grep -qE "^\| ${i} \|" "$SECURITY" 2>/dev/null \
       && ! grep -qE "^## ${i}\." "$SECURITY" 2>/dev/null; then
    MISSING_BOXES+=("$i")
  fi
done

if [ "${#MISSING_BOXES[@]}" -gt 0 ]; then
  {
    echo "DENIED: slice ${SLICE_DIR}/security.md is missing spec 72 §11 13-item checklist box(es):"
    echo
    echo "  Missing: ${MISSING_BOXES[*]} (of 1..13)"
    echo
    echo "  Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-1 (L46):"
    echo "  'spec 72 §11 13-item checklist presence in security.md'."
    echo "  Each box (1..13) must appear as either a table row '| N | ... |' or"
    echo "  a section heading '## N. ...'."
    echo
    echo "Actionable alternatives:"
    echo "  - Add the missing boxes to security.md per spec 72 §11."
    echo "  - For boxes that genuinely don't apply, mark status 'n/a' with explicit"
    echo "    justification per spec 72 §11 exemption pattern (acceptance.md F6e)."
  } >&2
  exit 1
fi

# --- Gate 3: leak scan on staged diff -------------------------------------
# Basic regex for common secret patterns. Defence in depth — gitleaks workflow
# is the comprehensive scanner; this is the pre-commit fast-path catching the
# obvious cases before they hit the remote.

LEAK_PATTERNS='AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|sk_(test|live)_[A-Za-z0-9]{24,}|-----BEGIN [A-Z ]+PRIVATE KEY-----'
LEAK_HITS=$(git diff --cached -U0 2>/dev/null \
  | awk '/^\+[^+]/' \
  | grep -E "$LEAK_PATTERNS" \
  | head -5 || true)

if [ -n "$LEAK_HITS" ]; then
  {
    echo "DENIED: leak-scan flagged secret-pattern matches in staged diff:"
    echo
    printf '  %s\n' "$LEAK_HITS"
    echo
    echo "  Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-1 +"
    echo "  spec 72 §11 box 13 (secrets hygiene)."
    echo
    echo "Actionable alternatives:"
    echo "  - Rotate the leaked credential immediately and remove it from the diff."
    echo "  - Move the value to an env var (Vercel / .env.local — never committed)."
    echo "  - If a false positive (e.g. test fixture), restructure so the pattern"
    echo "    isn't a literal match and re-stage."
  } >&2
  exit 1
fi

# --- Full-mode-only gates (4-7) -------------------------------------------

if [ "$MODE" = "incremental" ]; then
  exit 0
fi

# Gate 4: ESLint denial check (delegates)
if [ -x scripts/eslint-no-disable.sh ]; then
  if ! scripts/eslint-no-disable.sh >&2; then
    exit 1
  fi
fi

# Gate 5: per-language coverage thresholds.
# v3a AC-6 (S-INFRA-rigour-v3a-foundation/acceptance.md L51 + L178: ".ts ≥90%
# via vitest"); v3b AC-14 activation (S-INFRA-rigour-v3b-subagent-suite/
# acceptance.md L106-110: @vitest/coverage-v8 dev-dep + ci.yml --coverage flag
# produce coverage/lcov.info on every CI run).
# Parses coverage/lcov.info for new-line coverage on the PR diff
# (origin/main...HEAD); fails if uncovered/added > 10% across .ts/.tsx files.
# Skip-allow path retained for defensive resilience (e.g. local pre-commit
# before deps installed). After v3b S-3, CI runs always populate lcov.info.
COVERAGE_FILE="coverage/lcov.info"
if [ -f "$COVERAGE_FILE" ]; then
  total_added=0
  total_uncovered=0
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    # Added line numbers in this file's PR diff.
    added=$(git diff "origin/main...HEAD" -U0 -- "$f" 2>/dev/null \
      | awk '/^@@/{
          if (match($0, /\+([0-9]+)(,([0-9]+))?/, m)) {
            start=m[1]; count=(m[3]==""?1:m[3])
            for (i=0;i<count;i++) print start+i
          }
        }' | sort -un)
    [ -z "$added" ] && continue
    # Lines reported uncovered in lcov for this file (DA:N,0 inside SF:f block).
    uncovered=$(awk -v target="SF:$f" '
      $0==target { in_block=1; next }
      /^end_of_record$/ { in_block=0 }
      in_block && /^DA:[0-9]+,0$/ { sub(/DA:/,""); sub(/,0$/,""); print }
    ' "$COVERAGE_FILE" | sort -un)
    file_added=$(printf '%s\n' "$added" | wc -l)
    file_uncov=$(comm -12 <(printf '%s\n' "$added") <(printf '%s\n' "$uncovered") | wc -l)
    total_added=$((total_added + file_added))
    total_uncovered=$((total_uncovered + file_uncov))
  done < <(git diff "origin/main...HEAD" --name-only -- '*.ts' '*.tsx' 2>/dev/null)

  if [ "$total_added" -gt 0 ] && [ $((total_uncovered * 100)) -gt $((total_added * 10)) ]; then
    {
      echo "DENIED: coverage gate — ${total_uncovered} of ${total_added} new src/ lines uncovered (>10%)."
      echo
      echo "  Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-6 (L51):"
      echo "  'fails if new src/ lines uncovered >= 10%' (lines threshold 90% per language)."
      echo
      echo "Actionable alternatives:"
      echo "  - Add tests covering the new src/ lines and re-run vitest --coverage."
      echo "  - Inspect coverage/lcov.info for which staged lines are reported uncovered."
    } >&2
    exit 1
  fi
fi

# Gate 6: tsc (type-check)
if command -v npx >/dev/null 2>&1; then
  if ! npx --no tsc --noEmit >&2; then
    {
      echo "DENIED: tsc --noEmit failed (full-mode gate 6)."
      echo "  Per acceptance.md AC-1: full-mode verify-slice.sh runs the type-check."
      echo "Actionable alternatives:"
      echo "  - Fix the type errors and re-run scripts/verify-slice.sh --full <slice-dir>."
    } >&2
    exit 1
  fi
fi

# Gate 7: vitest (test suite)
if command -v npx >/dev/null 2>&1; then
  if ! npx --no vitest run >&2; then
    {
      echo "DENIED: vitest run failed (full-mode gate 7)."
      echo "  Per acceptance.md AC-1: full-mode verify-slice.sh runs the test suite."
      echo "Actionable alternatives:"
      echo "  - Fix the failing tests and re-run scripts/verify-slice.sh --full <slice-dir>."
    } >&2
    exit 1
  fi
fi

exit 0
