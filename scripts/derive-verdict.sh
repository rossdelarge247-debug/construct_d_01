#!/usr/bin/env bash
# derive-verdict.sh — derive auto-review verdict from persona JSON.
#
# Reads persona JSON (the slice-reviewer / acceptance-gate / ux-polish-
# reviewer output shape: `{summary, findings[]}`) from stdin; writes
# the derived verdict to stdout.
#
# Output values per CLAUDE.md §"Hard controls > Verdict vocabulary"
# §"Verdict derivation rules" (Conventional Comments adoption from
# AC-5; PR #41):
#
#   - block:           any finding has `blocking == true`
#   - request-changes: any finding has `label ∈ {issue, suggestion, todo}`
#                      (the elif order means blocking-issues are caught
#                      by `block` first, so this branch only fires for
#                      non-blocking action-labels)
#   - nit-only:        any finding has `label ∈ {nitpick, chore}`
#                      (and none of the above fire)
#   - approve:         empty findings, OR only findings with
#                      `label ∈ {praise, question, thought, note}`
#   - parse-failed:    persona output was empty {} or unparseable
#                      (sentinel preserves auto-review.yml line-165
#                      semantics where upstream RESULT extraction
#                      exhausted both jq fallbacks).
#
# Exit code: 0 always (callers check the output string).
#
# Test contract: tests/shellspec/derive-verdict.spec.sh covers the
# 8-row edge-case table from PR #41 verification.md + adversarial
# inputs from the verdict-coercion fixture (spec 72c §5 rule 3).

set -euo pipefail

INPUT=$(cat)

if [ "$INPUT" = '{}' ] || [ -z "$INPUT" ]; then
  echo "parse-failed"
  exit 0
fi

if ! printf '%s' "$INPUT" | jq -e 'type == "object"' >/dev/null 2>&1; then
  echo "parse-failed"
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
