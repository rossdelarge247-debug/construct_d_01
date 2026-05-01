#!/usr/bin/env bash
# auto-review-filter-prior.sh — per-specialist prior-findings filter.
#
# Per spec 72c §6: brief-job-side per-specialist filtering reduces
# round-2+ input token cost on the `<prior-findings-NONCE>` fence by
# scoping each specialist to findings within its own dimension. Findings
# with multi-dimension `seen_by[]` appear in each owning specialist's
# filtered set, preserving cross-dimension dedup semantics.
#
# Missing or non-array `seen_by` is treated as the empty set (graceful
# legacy handling): the `(.seen_by | arrays) // []` formulation handles
# null + non-array values uniformly across jq 1.6 + 1.7. A bare
# `(.seen_by // [])` would not — `//` only fires on null/false, so a
# string `seen_by` would fall through and `any(.[] == $dim)` would then
# runtime-error on jq 1.6 (Cannot iterate over string).
#
# Usage: scripts/auto-review-filter-prior.sh <dimension> < prior-findings.json
#   <dimension>    one of: security architecture correctness style
#
# Exit: 0 on success; 2 on usage error or invalid input shape.

set -euo pipefail

if [ $# -ne 1 ]; then
  printf 'usage: %s <dimension>\n' "$0" >&2
  exit 2
fi

DIM="$1"
case "$DIM" in
  security|architecture|correctness|style) ;;
  *)
    printf '%s: invalid dimension: %s (expected one of: security architecture correctness style)\n' "$0" "$DIM" >&2
    exit 2
    ;;
esac

INPUT=$(cat)

if ! printf '%s' "$INPUT" \
  | jq -e '(.head_sha | type == "string") and (.findings | type == "array")' >/dev/null 2>&1; then
  printf '%s: stdin must be a JSON object with `head_sha` (string) and `findings` (array)\n' "$0" >&2
  exit 2
fi

printf '%s' "$INPUT" | jq -c --arg dim "$DIM" '{
  head_sha: .head_sha,
  findings: [.findings[] | select(((.seen_by | arrays) // []) | any(. == $dim))]
}'
