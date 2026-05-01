#!/usr/bin/env bash
# Exit 0 on both paths; empty stdout signals round-1 (no prior found),
# not an error. Spec 72c §6.

set -euo pipefail

MAX_BYTES=524288

PRIOR_JSON=$(awk '
  /^<!-- BEGIN-prior-findings-json -->$/ { capture = 1; next }
  capture && /^<!-- END-prior-findings-json -->$/ { exit }
  capture                                { print }
' || true)

[ -n "${PRIOR_JSON:-}" ] || exit 0

PRIOR_SIZE=$(printf '%s' "$PRIOR_JSON" | wc -c | tr -d ' ')
if [ "$PRIOR_SIZE" -gt "$MAX_BYTES" ]; then
  printf 'auto-review-extract-prior: extracted %s bytes exceeds %s cap; rejecting payload\n' "$PRIOR_SIZE" "$MAX_BYTES" >&2
  exit 0
fi

if printf '%s' "$PRIOR_JSON" | jq -e '(.head_sha | type == "string") and (.findings | type == "array")' >/dev/null 2>&1; then
  printf '%s' "$PRIOR_JSON"
fi
