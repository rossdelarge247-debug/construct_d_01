#!/usr/bin/env bash
# The aggregate envelope (with seen_by[] / was_in_prior decorations)
# has a looser shape and is out of scope; this validates ONE specialist's
# pre-aggregation output only.
#
# Usage: scripts/validate-finding-envelope.sh < envelope.json
#
# Exit: 0 on valid; 1 on invalid with descriptive error to stderr.

set -euo pipefail

INPUT=$(cat)

fail() {
  printf 'validate-finding-envelope: %s\n' "$1" >&2
  exit 1
}

printf '%s' "$INPUT" | jq -e . >/dev/null 2>&1 \
  || fail "stdin is not valid JSON"

printf '%s' "$INPUT" | jq -e 'type == "object"' >/dev/null \
  || fail "root must be a JSON object"

printf '%s' "$INPUT" | jq -e '(keys | sort) == ["findings", "specialist", "summary"]' >/dev/null \
  || fail "root keys must be exactly: specialist, summary, findings (no additional properties)"

printf '%s' "$INPUT" | jq -e '
  .specialist as $s |
  $s | (. == "reviewer-security" or . == "reviewer-correctness" or . == "reviewer-style")
' >/dev/null \
  || fail "specialist must be one of: reviewer-security, reviewer-correctness, reviewer-style"

printf '%s' "$INPUT" | jq -e '.summary | type == "string" and length > 0' >/dev/null \
  || fail "summary must be a non-empty string"

printf '%s' "$INPUT" | jq -e '.findings | type == "array"' >/dev/null \
  || fail "findings must be an array"

printf '%s' "$INPUT" | jq -e '
  .findings | all(
    type == "object"
    and ((keys | sort) == ["blocking", "category", "evidence", "label", "remediation"])
    and (.label | (
      . == "praise" or . == "nitpick" or . == "suggestion" or . == "issue"
      or . == "todo" or . == "question" or . == "thought" or . == "chore"
      or . == "note"
    ))
    and (.blocking | type == "boolean")
    and (.category | type == "string" and length > 0)
    and (.evidence | type == "string" and length > 0)
    and (.remediation | type == "string" and length > 0)
  )
' >/dev/null \
  || fail "one or more findings has invalid shape; required keys per finding: label, blocking, category, evidence, remediation. label must be a Conventional Comments value (praise/nitpick/suggestion/issue/todo/question/thought/chore/note); blocking must be boolean; category/evidence/remediation must be non-empty strings; no additional properties allowed"
