#!/usr/bin/env bash
# PreToolUse hook: read-cap enforcement.
#
# Blocks Read operations that violate CLAUDE.md Planning conduct §
# Read discipline:
#
#   1. Full-file Read (no offset, no limit) of a file with >400 lines
#      — quoting the rule: "Read sections not files for specs >400
#      lines — use Read with offset + limit for the specific section.
#      Full-file Read for a 'get the flavour' purpose is banned for
#      large specs."
#
#   2. Read whose expected line count would bring this turn's Read
#      total over 300 — quoting the rule: "Max 300 lines of combined
#      tool-result content per turn."
#
# Deny reasons are actionable: name the violated rule verbatim and
# suggest offset/limit or grep-first alternatives.
#
# Per-turn inference: 45-second gap between PreToolUse events = new
# turn (counter reset). Heuristic but cheap and accurate enough in
# practice — parallel tool calls in a single turn cluster in time;
# cross-turn gaps include user response + model think and are always
# >>45s.
#
# P0.2 of session 27's hook-enforcement sprint.

set -euo pipefail

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')

# Matcher should only forward Read, but guard for safety.
if [ "$TOOL" != "Read" ]; then
  exit 0
fi

FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // ""')
OFFSET=$(printf '%s' "$INPUT" | jq -r '.tool_input.offset // empty')
LIMIT=$(printf '%s' "$INPUT" | jq -r '.tool_input.limit // empty')
SESSION_ID=$(printf '%s' "$INPUT" | jq -r '.session_id // "unknown"')

# If file doesn't exist / can't stat, don't block — let Read fail with
# its own actionable error.
if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

FILE_LINES=$(wc -l < "$FILE" 2>/dev/null | tr -d ' ' || echo 0)
: "${FILE_LINES:=0}"

emit_deny() {
  local reason="$1"
  jq -n --arg reason "$reason" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# --- Rule 1: full-file Read of >400-line file ---
if [ -z "$OFFSET" ] && [ -z "$LIMIT" ] && [ "$FILE_LINES" -gt 400 ]; then
  emit_deny "$(cat <<REOF
DENIED: Full-file Read of ${FILE} (${FILE_LINES} lines) violates CLAUDE.md Planning conduct § Read discipline:

  "Read sections not files for specs >400 lines — use Read with offset + limit for the specific section. Full-file Read for a 'get the flavour' purpose is banned for large specs."

Actionable alternatives:
  - grep -n <pattern> ${FILE}  → locate what you need, then Read with offset+limit around that line.
  - Read with offset+limit for a specific section (e.g. offset=100, limit=80).
  - If you need multiple sections, split across sequential turns.
REOF
)"
fi

# --- Rule 2: per-turn line budget ---
# Expected line count for this Read = min(limit || 2000, file_lines - (offset || 0)).
# 2000 is Read tool's default cap when limit is unspecified.
EFFECTIVE_OFFSET=${OFFSET:-0}
REMAINING=$((FILE_LINES - EFFECTIVE_OFFSET))
if [ "$REMAINING" -lt 0 ]; then REMAINING=0; fi

if [ -n "$LIMIT" ]; then
  EXPECTED=$(( LIMIT < REMAINING ? LIMIT : REMAINING ))
else
  EXPECTED=$(( 2000 < REMAINING ? 2000 : REMAINING ))
fi

STATE_DIR="/tmp/claude-read-turn-${SESSION_ID}"
mkdir -p "$STATE_DIR" 2>/dev/null || true
COUNTER="$STATE_DIR/count"
TS_FILE="$STATE_DIR/ts"

NOW=$(date +%s)
TURN_GAP=45

if [ -f "$TS_FILE" ]; then
  LAST=$(cat "$TS_FILE" 2>/dev/null || echo 0)
else
  LAST=0
fi

if [ $((NOW - LAST)) -gt "$TURN_GAP" ]; then
  printf '0\n' > "$COUNTER"
fi

CURRENT=$(cat "$COUNTER" 2>/dev/null || echo 0)
WOULD_BE=$((CURRENT + EXPECTED))

if [ "$WOULD_BE" -gt 300 ]; then
  MAX_ALLOWED=$((300 - CURRENT))
  if [ "$MAX_ALLOWED" -lt 0 ]; then MAX_ALLOWED=0; fi
  emit_deny "$(cat <<REOF
DENIED: This Read (~${EXPECTED} lines from ${FILE}) would bring this turn's Read total to ${WOULD_BE} — exceeds the 300-line cap in CLAUDE.md Planning conduct § Read discipline:

  "Max 300 lines of combined tool-result content per turn."

Used this turn so far: ${CURRENT} lines. This Read: ~${EXPECTED} lines. Cap: 300.

Actionable alternatives:
  - Split the Read across the next turn (respond to the user first, then continue).
  - Narrow offset/limit so this Read uses ≤${MAX_ALLOWED} lines.
  - grep / ls / wc -l first to scope what you need, then Read a tight window.
REOF
)"
fi

# Allowed — advance counter and timestamp, exit silent.
printf '%s\n' "$WOULD_BE" > "$COUNTER"
printf '%s\n' "$NOW" > "$TS_FILE"
exit 0
