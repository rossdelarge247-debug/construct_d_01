#!/usr/bin/env bash
# auto-review-parse.sh
#
# Extracts a persona's strict-JSON output from the
# claude -p --output-format=json transcript envelope. Reads envelope
# from stdin; writes the persona JSON (or '{}' parse-failed sentinel)
# to stdout. Always exit 0.
#
# `claude -p --output-format=json` wraps the response in a transcript
# envelope: `{type, subtype, result, usage, session_id, ...}`. The
# persona's strict-JSON output lives in `.result` as a STRING — possibly
# wrapped in markdown code fences (model quirk). Parse robustly:
# extract `.result` (with .text / .content fallbacks); try direct
# JSON-parse; fall back to fence-stripped; fall back to '{}' so
# downstream defaults fire honestly.
#
# Three failure modes funnelled to the '{}' sentinel:
#   1. `.result` is missing / empty.
#   2. `.result` exists but neither direct nor fence-stripped jq parse
#      succeeds (malformed JSON in result body).
#   3. Envelope itself is invalid JSON.
#
# The grep-based fence strip is robust to trailing-newline edge cases
# the earlier `sed '1{...}'/'${...}'` form missed (round-3 finding #1:
# `printf '%s\n'` appends NL → closing fence not on last line for
# `sed '$'` → fence retained → jq fails silently).
#
# Test contract: tests/shellspec/auto-review-parse.spec.sh.

set -euo pipefail

INPUT=$(cat)

# Step 1: extract .result from the envelope (with .text / .content
# fallbacks for response-shape drift). If envelope is invalid JSON, jq
# exits non-zero — the `|| echo ""` clause normalises to empty.
RESULT=$(printf '%s' "$INPUT" | jq -r '.result // .text // .content // ""' 2>/dev/null || echo "")

# Step 2: empty result → parse-failed sentinel directly. Without this
# guard `jq -c '.'` on empty stdin exits 0 with empty stdout (jq's
# documented behaviour on no input), bypassing the `||` fallback chain
# below and leaving PERSONA_JSON as empty string instead of '{}'.
if [ -z "$RESULT" ]; then
  echo '{}'
  exit 0
fi

# Skipped for the '{}' sentinel — it would always fail validation by design.
# The `|| printf …` form makes the assignment a tested context, so a non-zero
# command-sub does not trigger `set -e` errexit; head -1 sanitises a multi-line
# validator message to one line so the advisory respects the single-line invariant.
validate_warn() {
  local json="$1" err
  [ "$json" = "{}" ] && return 0
  err=$(printf '%s' "$json" | scripts/validate-finding-envelope.sh 2>&1 >/dev/null) \
    || printf 'auto-review-parse: schema-invalid persona envelope (proceeding): %s\n' \
       "$(printf '%s' "$err" | head -1)" >&2
  return 0
}

# Step 3: try direct jq parse → fence-stripped jq parse → '{}'.
# Both branches require non-empty parsed output to count as success;
# otherwise fall through (handles the `'{}'` and trailing-fence edge
# cases that `||` alone can't catch).
if PERSONA_JSON=$(printf '%s' "$RESULT" | jq -c '.' 2>/dev/null) && [ -n "$PERSONA_JSON" ]; then
  echo "$PERSONA_JSON"
  validate_warn "$PERSONA_JSON"
elif PERSONA_JSON=$(printf '%s' "$RESULT" | grep -v '^[[:space:]]*```' | jq -c '.' 2>/dev/null) && [ -n "$PERSONA_JSON" ]; then
  echo "$PERSONA_JSON"
  validate_warn "$PERSONA_JSON"
else
  echo '{}'
fi
