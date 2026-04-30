#!/usr/bin/env bash
# derive-verdict.sh — derive auto-review verdict from persona JSON.
#
# Reads persona JSON from stdin and writes the derived verdict to stdout.
#
# Two modes:
#
#   1. SINGLE MODE (default; no flags) — input is a single persona's
#      output shape `{summary, findings[]}` (slice-reviewer / acceptance-
#      gate / ux-polish-reviewer). Each finding contributes 1 toward its
#      tier; verdict tier fires on first count > 0. Back-compat with the
#      PR #41 ship.
#
#   2. MULTI MODE (--multi k=N flag) — input is the orchestrator's
#      aggregated envelope `{summary, findings[]}` where each finding
#      may include `seen_by: [string, ...]` listing the specialists that
#      flagged it after dedupe (spec 72c §5 rule 2). A finding contributes
#      `len(seen_by)` votes (default 1 when absent/empty/non-array);
#      verdict tier fires when votes ≥ N for that tier. Per spec 72c §5
#      session-54 amendment: blocking findings count ONLY toward block
#      tier (filtered out of action-tier vote count) — block-quorum-unmet
#      does NOT cascade.
#
# Output values per CLAUDE.md §"Hard controls > Verdict vocabulary"
# §"Verdict derivation rules":
#
#   - block:           single: any finding has `blocking == true`.
#                      multi:  ≥ N votes with `blocking == true`.
#   - request-changes: single: any finding has `label ∈ {issue, suggestion, todo}`
#                      (elif catches non-blocking only via ordering).
#                      multi:  ≥ N votes with non-blocking finding in
#                              `label ∈ {issue, suggestion, todo}`.
#   - nit-only:        any finding (single) / ≥ N votes (multi) with
#                      `label ∈ {nitpick, chore}` and none of the above fire.
#   - approve:         empty findings, OR only findings/votes with
#                      `label ∈ {praise, question, thought, note}`,
#                      OR (multi only) tier vote totals all < N.
#   - parse-failed:    persona output was empty {} or unparseable
#                      (sentinel preserves auto-review.yml line-165
#                      semantics where upstream RESULT extraction
#                      exhausted both jq fallbacks).
#
# Exit code: 0 always for parse outcomes (callers check the output
# string). Exit 2 for invalid CLI args (unrecognised flag, non-positive-
# integer k value).
#
# Test contract: tests/shellspec/derive-verdict.spec.sh covers the
# 8-row edge-case table from PR #41 verification.md + adversarial
# inputs from the verdict-coercion fixture (spec 72c §5 rule 3) +
# 12-row --multi mode coverage from S-INFRA-persona-suite-v2-multi-
# agent AC-1 verification 2 + 5.

set -euo pipefail

MODE=single
K=1

while [ $# -gt 0 ]; do
  case "$1" in
    --multi)
      MODE=multi
      shift
      ;;
    k=*)
      K="${1#k=}"
      shift
      ;;
    *)
      printf 'derive-verdict.sh: unrecognised argument: %s\n' "$1" >&2
      exit 2
      ;;
  esac
done

if ! printf '%s' "$K" | grep -Eq '^[1-9][0-9]*$'; then
  printf 'derive-verdict.sh: invalid k value: %s (must be positive integer)\n' "$K" >&2
  exit 2
fi

INPUT=$(cat)

if [ "$INPUT" = '{}' ] || [ -z "$INPUT" ]; then
  echo "parse-failed"
  exit 0
fi

if ! printf '%s' "$INPUT" | jq -e 'type == "object"' >/dev/null 2>&1; then
  echo "parse-failed"
  exit 0
fi

# Guard: .findings present but not an array (e.g. `{"findings": "not-an-array"}`)
# would pass the object-type check above but cause the arithmetic jq invocations
# below to exit non-zero (`.[]` on a string is invalid). Per PR #46 review
# (slice-reviewer comment 4343354539). Treat as parse-failed.
if printf '%s' "$INPUT" | jq -e 'has("findings") and (.findings | type) != "array"' >/dev/null 2>&1; then
  echo "parse-failed"
  exit 0
fi

if [ "$MODE" = "multi" ]; then
  # seen_by length expression: default to 1 when seen_by is absent, null,
  # non-array, or empty array (per AC-1 verification: back-compat with
  # non-deduped findings whose persona output omits seen_by).
  SEEN_BY_VOTES='(.seen_by as $sb | if ($sb | type) == "array" and ($sb | length) > 0 then ($sb | length) else 1 end)'

  BLOCKING_VOTES=$(printf '%s' "$INPUT" | jq -r "[.findings // [] | .[] | select(.blocking == true) | $SEEN_BY_VOTES] | add // 0")
  # Action tier explicitly excludes blocking findings — single-mode relies
  # on elif ordering for this; multi-mode needs the filter because block-
  # quorum-unmet must not cascade to action tier per spec 72c §5.
  ACTION_VOTES=$(printf '%s' "$INPUT" | jq -r "[.findings // [] | .[] | select((.label == \"issue\" or .label == \"suggestion\" or .label == \"todo\") and .blocking != true) | $SEEN_BY_VOTES] | add // 0")
  NIT_VOTES=$(printf '%s' "$INPUT" | jq -r "[.findings // [] | .[] | select(.label == \"nitpick\" or .label == \"chore\") | $SEEN_BY_VOTES] | add // 0")

  if [ "$BLOCKING_VOTES" -ge "$K" ]; then
    echo "block"
  elif [ "$ACTION_VOTES" -ge "$K" ]; then
    echo "request-changes"
  elif [ "$NIT_VOTES" -ge "$K" ]; then
    echo "nit-only"
  else
    echo "approve"
  fi
  exit 0
fi

BLOCKING_COUNT=$(printf '%s' "$INPUT" | jq -r '[.findings // [] | .[] | select(.blocking == true)] | length')
ACTION_COUNT=$(printf '%s' "$INPUT" | jq -r '[.findings // [] | .[] | select(.label == "issue" or .label == "suggestion" or .label == "todo")] | length')
NIT_COUNT=$(printf '%s' "$INPUT" | jq -r '[.findings // [] | .[] | select(.label == "nitpick" or .label == "chore")] | length')

if [ "$BLOCKING_COUNT" -gt 0 ]; then
  echo "block"
elif [ "$ACTION_COUNT" -gt 0 ]; then
  echo "request-changes"
elif [ "$NIT_COUNT" -gt 0 ]; then
  echo "nit-only"
else
  echo "approve"
fi
