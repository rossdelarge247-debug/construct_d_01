#!/usr/bin/env bash
# eslint-no-disable.sh — fail if PR diff adds eslint-disable directive(s)
# in any file path NOT listed in docs/eslint-baseline-allowlist.txt.
#
# Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-3:
# "CI workflow denies new disable directives outside the allowlist."
#
# Usage: scripts/eslint-no-disable.sh [<base-ref>] [<root>]
#   base-ref defaults to origin/main; root defaults to '.'.
# Exit:  0 clean / 1 violations found / 2 usage error.

set -euo pipefail

BASE="${1:-origin/main}"
ROOT="${2:-.}"
ALLOWLIST_FILE="docs/eslint-baseline-allowlist.txt"

cd "$ROOT" || exit 2

if [ ! -f "$ALLOWLIST_FILE" ]; then
  echo "eslint-no-disable: allowlist not found at $ROOT/$ALLOWLIST_FILE" >&2
  exit 2
fi

ALLOWLIST=()
while IFS= read -r line; do
  line="${line%%#*}"
  line="${line#"${line%%[![:space:]]*}"}"
  line="${line%"${line##*[![:space:]]}"}"
  [ -n "$line" ] && ALLOWLIST+=("$line")
done < "$ALLOWLIST_FILE"

DIFF_OUT=$(git diff "${BASE}...HEAD" -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' 2>/dev/null || true)

VIOLATIONS=()
CURRENT_FILE=""
while IFS= read -r line; do
  if [[ "$line" =~ ^\+\+\+\ b/(.+)$ ]]; then
    CURRENT_FILE="${BASH_REMATCH[1]}"
    continue
  fi
  case "$line" in
    +++*) continue ;;
    +*eslint-disable*)
      EXEMPT=0
      for pat in "${ALLOWLIST[@]}"; do
        # shellcheck disable=SC2254  # intentional glob match
        case "$CURRENT_FILE" in
          $pat) EXEMPT=1; break ;;
        esac
      done
      [ "$EXEMPT" -eq 0 ] && VIOLATIONS+=("$CURRENT_FILE: ${line:1}")
      ;;
  esac
done <<< "$DIFF_OUT"

if [ "${#VIOLATIONS[@]}" -eq 0 ]; then
  exit 0
fi

{
  echo "DENIED: ${#VIOLATIONS[@]} new eslint-disable directive(s) added outside docs/eslint-baseline-allowlist.txt:"
  echo
  for v in "${VIOLATIONS[@]}"; do
    echo "  - $v"
  done
  echo
  echo "  Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-3 + Definition of Done:"
  echo "  v3a code may not introduce new eslint-disable directives. Allowlist remains empty"
  echo "  for v3a; β offenders captured when β resumes."
  echo
  echo "Actionable alternatives:"
  echo "  - Refactor the code so the rule passes without a disable comment."
  echo "  - If the disable is genuinely required, add the file path-glob to"
  echo "    docs/eslint-baseline-allowlist.txt AND ship in a PR carrying 'control-change'."
  echo "  - If the disable was added by mistake, remove it before re-pushing."
} >&2

exit 1
