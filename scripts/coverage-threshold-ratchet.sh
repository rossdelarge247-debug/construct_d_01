#!/usr/bin/env bash
# coverage-threshold-ratchet.sh — fail when any vitest coverage threshold
# at HEAD is lower than at the comparison ref. Origin/main-anchored ratchet
# per F5c (docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md.review-v1
# .json L46). Coverage thresholds in vitest.config.ts can only go UP.
#
# Threshold keys checked: lines, branches, functions, statements (the
# vitest standard set). Absent threshold treated as 0 — removing a
# threshold counts as lowering it from N to 0.
#
# Override: ship via CODEOWNERS admin-bypass.
# Exit: 0 clean / 1 violations found / 2 usage error.

set -euo pipefail

BASE="${1:-origin/main}"
ROOT="${2:-.}"
CONFIG="vitest.config.ts"
KEYS=(lines branches functions statements)

cd "$ROOT" || exit 2

extract_threshold() {
  local content="$1"
  local key="$2"
  # Vitest threshold keys (lines, branches, functions, statements) only
  # legitimately appear inside coverage.thresholds in vitest.config.ts;
  # a flat regex avoids the brittleness of bracket-balancing across the
  # one-line `thresholds: { lines: 80 }` and multi-line forms.
  printf '%s' "$content" \
    | grep -oE "${key}[[:space:]]*:[[:space:]]*[0-9]+" \
    | head -n 1 \
    | grep -oE '[0-9]+' \
    | head -n 1 \
    || true
}

read_config() {
  local ref="$1"
  if [ "$ref" = "HEAD" ]; then
    [ -f "$CONFIG" ] && cat "$CONFIG" || printf ''
  else
    git show "${ref}:${CONFIG}" 2>/dev/null || printf ''
  fi
}

HEAD_CONFIG=$(read_config HEAD)
BASE_CONFIG=$(read_config "$BASE")

VIOLATIONS=()
for KEY in "${KEYS[@]}"; do
  HEAD_VAL=$(extract_threshold "$HEAD_CONFIG" "$KEY")
  BASE_VAL=$(extract_threshold "$BASE_CONFIG" "$KEY")
  HEAD_VAL="${HEAD_VAL:-0}"
  BASE_VAL="${BASE_VAL:-0}"
  if [ "$HEAD_VAL" -lt "$BASE_VAL" ]; then
    VIOLATIONS+=("$KEY: HEAD=$HEAD_VAL < $BASE=$BASE_VAL")
  fi
done

if [ "${#VIOLATIONS[@]}" -eq 0 ]; then
  exit 0
fi

{
  printf 'coverage-threshold-ratchet: %s threshold(s) lowered vs %s:\n' "${#VIOLATIONS[@]}" "$BASE"
  for v in "${VIOLATIONS[@]}"; do
    printf '  - %s\n' "$v"
  done
  printf '\nThresholds in vitest.config.ts coverage.thresholds can only go UP.\n'
  printf 'Override: ship via CODEOWNERS admin-bypass for a control-tightening reversal.\n'
} >&2

exit 1
