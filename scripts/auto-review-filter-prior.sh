#!/usr/bin/env bash
# auto-review-filter-prior.sh — per-specialist prior-findings filter.
#
# Reads a `{head_sha, findings}` envelope from stdin (the prior round's
# deduped aggregated findings extracted by `auto-review-extract-prior.sh`)
# and emits the same envelope shape with `findings` filtered to entries
# where `seen_by[]` contains the requested dimension.
#
# Per spec 72c §6: brief-job-side per-specialist filtering reduces
# round-2+ input token cost on the `<prior-findings-NONCE>` fence by
# scoping each specialist to findings within its own dimension. Findings
# with multi-dimension `seen_by[]` (e.g. a security finding also flagged
# by architecture) appear in both specialists' filtered sets, preserving
# the cross-dimension dedup-key semantics established by the aggregator
# (`scripts/spawn-multi-reviewer.sh` L141-156).
#
# Missing or non-array `seen_by` is treated as the empty set (graceful
# legacy handling); that finding is excluded from every specialist's
# filtered set.
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
  findings: [.findings[] | select((.seen_by // []) | any(. == $dim))]
}'
