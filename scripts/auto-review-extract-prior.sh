#!/usr/bin/env bash
# auto-review-extract-prior.sh — extract prior-round findings JSON
# from a multi-agent auto-review marker comment body. Reads the
# comment body from stdin; emits the JSON envelope to stdout when a
# valid `{head_sha, findings}` block is present, or empty otherwise.
#
# Used by `.github/workflows/auto-review.yml` brief job to enable
# differential review mode per spec 72c §6: round-1 detection is
# "stdout empty" (no prior comment, or comment has no embedded JSON);
# round N+1 means stdout has the JSON. The brief job feeds the JSON
# into per-specialist prompts as the `<prior-findings-NONCE>` fence
# alongside the `<fix-up-diff-NONCE>` fence.
#
# Exit 0 on the round-1 path (empty stdout) AND on the round-N+1 path
# (JSON to stdout) — failure to find a prior round is not an error.

set -euo pipefail

PRIOR_JSON=$(awk '
  /^<!-- prior-findings-json:$/ { capture = 1; next }
  capture && /^-->$/            { exit }
  capture                       { print }
' || true)

[ -n "${PRIOR_JSON:-}" ] || exit 0

if printf '%s' "$PRIOR_JSON" | jq -e '(.head_sha | type == "string") and (.findings | type == "array")' >/dev/null 2>&1; then
  printf '%s' "$PRIOR_JSON"
fi
