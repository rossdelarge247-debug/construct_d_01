#!/usr/bin/env bash
# match-synthetic.sh — pure matcher: does an envelope satisfy a synthetic
# expected-signature?
#
# Usage: match-synthetic.sh <envelope.json> <expected.json>
# Exit 0 if at least one finding satisfies all predicates declared in
# expected.json; exit 1 with diagnostic on stderr otherwise.
#
# Pure logic — no network, no filesystem writes, no claude invocation.
# Suitable for unit-testing under shellspec with stub envelope inputs.

set -euo pipefail

ENVELOPE_PATH="${1:-}"
EXPECTED_PATH="${2:-}"

[ -f "$ENVELOPE_PATH" ] || { printf 'match-synthetic.sh: envelope not found: %s\n' "$ENVELOPE_PATH" >&2; exit 2; }
[ -f "$EXPECTED_PATH" ] || { printf 'match-synthetic.sh: expected not found: %s\n' "$EXPECTED_PATH" >&2; exit 2; }

ENVELOPE=$(cat "$ENVELOPE_PATH")
EXPECTED=$(cat "$EXPECTED_PATH")

ACTUAL_COUNT=$(printf '%s' "$ENVELOPE" | jq '.findings | length')
MIN_COUNT=$(printf '%s' "$EXPECTED" | jq -r '.min_findings_count // 1')
DIM=$(printf '%s' "$EXPECTED" | jq -r '.dimension')

if [ "$ACTUAL_COUNT" -lt "$MIN_COUNT" ]; then
  printf 'match-synthetic.sh [%s]: FAIL — envelope has %s finding(s), expected ≥%s\n' "$DIM" "$ACTUAL_COUNT" "$MIN_COUNT" >&2
  exit 1
fi

# Per-finding predicate evaluation. The matcher returns success if ANY
# finding in the envelope satisfies ALL predicates declared in
# expected.expected_finding. Predicates are encoded as a single jq
# expression so they evaluate atomically.
MATCH_COUNT=$(printf '%s' "$ENVELOPE" | jq --argjson exp "$EXPECTED" '
  [.findings[] | select(
    (.label as $l | $exp.expected_finding.label_in | index($l) != null)
    and (.blocking as $b | $exp.expected_finding.blocking_in | index($b) != null)
    and (.category | test($exp.expected_finding.category_pattern))
    and (
      .evidence as $e
      | $exp.expected_finding.evidence_must_contain_any_of
      | map(. as $needle | $e | ascii_downcase | contains($needle | ascii_downcase))
      | any
    )
    and (
      .remediation as $r
      | $exp.expected_finding.remediation_must_contain_any_of
      | map(. as $needle | $r | ascii_downcase | contains($needle | ascii_downcase))
      | any
    )
  )] | length
')

if [ "$MATCH_COUNT" -ge 1 ]; then
  printf 'match-synthetic.sh [%s]: PASS — %s/%s finding(s) match expected signature\n' "$DIM" "$MATCH_COUNT" "$ACTUAL_COUNT"
  exit 0
fi

printf 'match-synthetic.sh [%s]: FAIL — no finding matched expected signature\n' "$DIM" >&2
printf '  expected: ' >&2
printf '%s' "$EXPECTED" | jq -c '.expected_finding' >&2
printf '\n  actual findings:\n' >&2
printf '%s' "$ENVELOPE" | jq -c '.findings[]' >&2 || true
exit 1
