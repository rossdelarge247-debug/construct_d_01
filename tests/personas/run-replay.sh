#!/usr/bin/env bash
# run-replay.sh — deterministic aggregator-only replay of golden-PR
# fixtures.
#
# Live persona re-invocation is intentionally not attempted: API budget
# per replay run + persona-prompt regression is an orthogonal failure
# mode to aggregator-logic regression (which is what this replay
# covers). See tests/personas/golden/<pr-id>/README.md for per-seed
# context.
#
# Exit 0 on pass; exit non-zero with diagnostic on first failure.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ORCHESTRATOR="$REPO_ROOT/scripts/spawn-multi-reviewer.sh"
GOLDEN_DIR="$SCRIPT_DIR/golden"

[ -x "$ORCHESTRATOR" ] || { printf 'run-replay.sh: orchestrator not executable: %s\n' "$ORCHESTRATOR" >&2; exit 2; }
[ -d "$GOLDEN_DIR" ] || { printf 'run-replay.sh: golden directory not found: %s\n' "$GOLDEN_DIR" >&2; exit 2; }

FAIL=0
TOTAL=0

for PR_DIR in "$GOLDEN_DIR"/*/; do
  PR_ID=$(basename "$PR_DIR")
  PRIOR_FINDINGS="$PR_DIR/prior-findings.json"
  PRIOR_VERDICT="$PR_DIR/prior-verdict.json"

  if [ ! -f "$PRIOR_FINDINGS" ] || [ ! -f "$PRIOR_VERDICT" ]; then
    printf 'run-replay.sh: skipping %s (missing fixtures)\n' "$PR_ID" >&2
    continue
  fi

  TOTAL=$((TOTAL + 1))
  printf '\n=== Replay %s ===\n' "$PR_ID"

  EXPECTED_VERDICT=$(jq -r '.verdict' "$PRIOR_VERDICT")
  EXPECTED_PRIOR_COUNT=$(jq -r '.findings_count' "$PRIOR_VERDICT")

  # Synthetic envelopes represent the seed's final-round state (all
  # prior findings resolved → empty). Replay then tests the trajectory:
  # starting from N findings to 0 findings → verdict converges to
  # prior-verdict.
  ENVELOPES_DIR=$(mktemp -d)
  PRIOR_TMP=$(mktemp)
  trap 'rm -rf "$ENVELOPES_DIR" "$PRIOR_TMP"' EXIT

  for DIM in security architecture correctness style; do
    jq -n --arg spec "reviewer-$DIM" '
      {specialist: $spec, summary: "final round replay", findings: []}
    ' > "$ENVELOPES_DIR/$DIM.json"
  done

  # Assertion 1: final-state aggregate verdict matches prior-verdict.json.
  AGGREGATE_OUT=$("$ORCHESTRATOR" aggregate "$ENVELOPES_DIR")
  ACTUAL_VERDICT=$(printf '%s' "$AGGREGATE_OUT" | jq -r '.verdict')
  ACTUAL_COUNT=$(printf '%s' "$AGGREGATE_OUT" | jq -r '.findings | length')

  if [ "$ACTUAL_VERDICT" != "$EXPECTED_VERDICT" ]; then
    printf 'FAIL: verdict mismatch — expected %s, got %s\n' "$EXPECTED_VERDICT" "$ACTUAL_VERDICT" >&2
    FAIL=$((FAIL + 1))
  else
    printf 'PASS: verdict (%s)\n' "$ACTUAL_VERDICT"
  fi

  if [ "$ACTUAL_COUNT" != "0" ]; then
    printf 'FAIL: final-round finding count — expected 0, got %s\n' "$ACTUAL_COUNT" >&2
    FAIL=$((FAIL + 1))
  else
    printf 'PASS: final-round finding count (0)\n'
  fi

  jq -c '[.[] | del(._round, ._session_47_persona_dimension)]' "$PRIOR_FINDINGS" > "$PRIOR_TMP"

  DIFF_OUT=$("$ORCHESTRATOR" aggregate "$ENVELOPES_DIR" --differential --prior-findings "$PRIOR_TMP")

  RESOLVED_COUNT=$(printf '%s' "$DIFF_OUT" | jq -r '.token_metrics.resolved_count')
  NEW_COUNT=$(printf '%s' "$DIFF_OUT" | jq -r '.token_metrics.new_count')

  if [ "$RESOLVED_COUNT" != "$EXPECTED_PRIOR_COUNT" ]; then
    printf 'FAIL: differential mode — expected resolved_count %s, got %s\n' "$EXPECTED_PRIOR_COUNT" "$RESOLVED_COUNT" >&2
    FAIL=$((FAIL + 1))
  else
    printf 'PASS: differential resolved_count (%s)\n' "$RESOLVED_COUNT"
  fi

  if [ "$NEW_COUNT" != "0" ]; then
    printf 'FAIL: differential mode — expected new_count 0, got %s\n' "$NEW_COUNT" >&2
    FAIL=$((FAIL + 1))
  else
    printf 'PASS: differential new_count (0)\n'
  fi

  rm -rf "$ENVELOPES_DIR" "$PRIOR_TMP"
  trap - EXIT
done

printf '\n=== Replay summary: %d seed(s) replayed; %d assertion failure(s) ===\n' "$TOTAL" "$FAIL"

if [ "$TOTAL" -eq 0 ]; then
  printf 'run-replay.sh: no golden seeds found under %s\n' "$GOLDEN_DIR" >&2
  exit 2
fi

[ "$FAIL" -eq 0 ] || exit 1
