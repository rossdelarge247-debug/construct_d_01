#!/usr/bin/env bash
# .claude/hooks/journey-declared.sh — PostToolUse:Write|Edit advisory.
#
# Warns when a prototype slice's acceptance.md is authored/edited without
# the `**Journey:**` field. The field names inbound + outbound journey
# wiring per CLAUDE.md §"Visual direction" §"Journey wiring".
# Always exits 0 (advisory only); never blocks the tool call.

set -uo pipefail

emit_advisory() {
  jq -n --arg msg "$1" '{
    systemMessage: $msg,
    hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: $msg }
  }'
}

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""' 2>/dev/null || echo "")

if [ "$TOOL" != "Write" ] && [ "$TOOL" != "Edit" ]; then
  exit 0
fi

FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // ""' 2>/dev/null || echo "")
[ -z "$FILE_PATH" ] && exit 0

FILE_PATH="${FILE_PATH#$PWD/}"

# Scope: only prototype slice acceptance.md files.
case "$FILE_PATH" in
  docs/slices/S-PROTO-*/acceptance.md) ;;
  *) exit 0 ;;
esac

# Get content (Write or Edit).
if [ "$TOOL" = "Write" ]; then
  CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.content // ""' 2>/dev/null || echo "")
else
  # For Edit, scan the new_string only (the patch that's being applied).
  CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.new_string // ""' 2>/dev/null || echo "")
fi
[ -z "$CONTENT" ] && exit 0

# If the edit/write content carries the field, silent pass.
if printf '%s' "$CONTENT" | grep -qE '^\*\*Journey:\*\*[[:space:]]+'; then
  exit 0
fi

# For Edit: the field may already be in the file outside the patched window.
# Re-read from disk and check the full file.
if [ "$TOOL" = "Edit" ] && [ -f "$FILE_PATH" ]; then
  if grep -qE '^\*\*Journey:\*\*[[:space:]]+' "$FILE_PATH"; then
    exit 0
  fi
fi

MESSAGE="[journey-declared] ${FILE_PATH}: missing \`**Journey:**\` field — declare inbound + outbound wiring or mark orphan. Format: \`**Journey:** inbound from = <surface-id | \"external/marketing\"> · outbound to = <surface-id | \"completion-stub\">\`. Orphan: \`**Journey:** orphan — pending wiring in slice S-X\` with reason. See CLAUDE.md §\"Visual direction\" §\"Journey wiring\"."

emit_advisory "$MESSAGE"
exit 0
