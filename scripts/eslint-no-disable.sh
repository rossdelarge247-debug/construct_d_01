#!/usr/bin/env bash
# eslint-no-disable.sh — fail when the count of `eslint-disable` directives
# at HEAD exceeds the count at the comparison ref. Origin/main-anchored
# ratchet: counts can only go DOWN.
#
# Override: ship via CODEOWNERS admin-bypass.
# Exit: 0 clean / 1 violations found / 2 usage error.

set -euo pipefail

BASE="${1:-origin/main}"
ROOT="${2:-.}"
PATHSPECS=('*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs')

cd "$ROOT" || exit 2

count_disables() {
  local ref="$1"
  { git grep -c 'eslint-disable' "$ref" -- "${PATHSPECS[@]}" 2>/dev/null || true; } \
    | awk -F: '{sum += $NF} END {print sum+0}'
}

HEAD_COUNT=$(count_disables HEAD)
BASE_COUNT=$(count_disables "$BASE")

if [ "$HEAD_COUNT" -le "$BASE_COUNT" ]; then
  exit 0
fi

DELTA=$((HEAD_COUNT - BASE_COUNT))

{
  printf 'eslint-no-disable: count regression — HEAD has %s disables, %s has %s (+%s)\n' \
    "$HEAD_COUNT" "$BASE" "$BASE_COUNT" "$DELTA"
  printf '\nNew or expanded disables in this PR:\n'
  git diff "${BASE}...HEAD" -- "${PATHSPECS[@]}" \
    | awk '
        /^\+\+\+ b\// { f = substr($0, 7); next }
        /^\+/ && !/^\+\+\+/ && /eslint-disable/ { print "  " f ": " substr($0, 2) }
      '
  printf '\nActionable alternatives:\n'
  printf '  - Refactor so the rule passes without a disable comment.\n'
  printf '  - Remove an existing disable elsewhere to keep net count <= origin/main.\n'
  printf '  - Ship via CODEOWNERS admin-bypass for a control-tightening reversal\n'
  printf '    (must include rationale; F5c override path).\n'
} >&2

exit 1
