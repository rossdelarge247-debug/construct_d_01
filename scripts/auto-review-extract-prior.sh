#!/usr/bin/env bash
# auto-review-extract-prior.sh — extract prior-round findings JSON
# from a multi-agent auto-review marker comment body. Reads body from
# stdin; emits the JSON envelope to stdout when a valid
# `{head_sha, findings}` block is present, empty otherwise.
#
# Empty stdout is the round-1 path (spec 72c §6); JSON stdout is round
# N+1. Exit 0 on both paths — failure to find a prior round is not an
# error.

set -euo pipefail

PRIOR_JSON=$(awk '
  /^<!-- BEGIN-prior-findings-json -->$/ { capture = 1; next }
  capture && /^<!-- END-prior-findings-json -->$/ { exit }
  capture                                { print }
' || true)

[ -n "${PRIOR_JSON:-}" ] || exit 0

if printf '%s' "$PRIOR_JSON" | jq -e '(.head_sha | type == "string") and (.findings | type == "array")' >/dev/null 2>&1; then
  printf '%s' "$PRIOR_JSON"
fi
