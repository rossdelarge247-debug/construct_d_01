#!/usr/bin/env bash
# PostToolUse:Write|Edit — author-time review for comment anti-patterns.
#
# Catalogue source: CLAUDE.md §Coding conduct §"Comments: WHY not WHAT,
# no temporal provenance" (L215-222). Live-mode persona prompt at
# .claude/agents/reviewer-comment.md.
#
# Advisory contract: exits 0 in every observed path; emits JSON
# systemMessage only on findings. Live mode (COMMENT_REVIEW_SPAWN=1)
# falls through to stub on any spawn failure.

set -uo pipefail

run_live_review() {
  local file_path="$1" content="$2"
  local persona_path=".claude/agents/reviewer-comment.md"
  if [ ! -f "$persona_path" ] || [ ! -r /dev/urandom ]; then
    return 1
  fi
  local nonce
  nonce=$(od -An -tx1 -N16 /dev/urandom | tr -d ' \n')
  if [ -z "$nonce" ] || [ "${#nonce}" -ne 32 ]; then
    return 1
  fi
  local persona
  persona=$(cat "$persona_path")
  # printf-based framing (not heredoc) so that $content containing a
  # literal "EOF" line cannot terminate the envelope early.
  local framed
  framed=$(printf '%s\n\nYour per-invocation nonce: %s\n\n<file-path-%s>\n%s\n</file-path-%s>\n\n<new-content-%s>\n%s\n</new-content-%s>\n' \
    "$persona" "$nonce" "$nonce" "$file_path" "$nonce" "$nonce" "$content" "$nonce")
  local verdict
  verdict=$(printf '%s' "$framed" | timeout 20 claude -p --output-format text 2>/dev/null || echo "")
  if [ -z "$verdict" ]; then
    return 1
  fi
  local summary
  summary=$(printf '%s' "$verdict" | jq -r '.summary // empty' 2>/dev/null || echo "")
  if [ -z "$summary" ]; then
    return 1
  fi
  printf '%s' "$summary"
}

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
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Normalize absolute paths under cwd to relative so the skip-list patterns
# below match regardless of which form the agent passed.
FILE_PATH="${FILE_PATH#$PWD/}"

case "$FILE_PATH" in
  .claude/agents/*) exit 0 ;;
  .claude/subagent-prompts/*) exit 0 ;;
  tests/shellspec/*) exit 0 ;;
  tests/*/fixtures/*) exit 0 ;;
  tests/personas/synthetic/*) exit 0 ;;
  *.lock|*.json|*.yaml|*.yml) exit 0 ;;
  *.png|*.jpg|*.jpeg|*.gif|*.webp|*.ico|*.svg) exit 0 ;;
  *.woff|*.woff2|*.ttf|*.otf|*.eot|*.pdf|*.zip|*.tar|*.gz|*.bz2) exit 0 ;;
esac

if [ "$TOOL" = "Write" ]; then
  CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.content // ""' 2>/dev/null || echo "")
else
  CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.new_string // ""' 2>/dev/null || echo "")
fi

if [ -z "$CONTENT" ]; then
  exit 0
fi

if [ "${COMMENT_REVIEW_SPAWN:-0}" = "1" ] && command -v claude >/dev/null 2>&1; then
  if SUMMARY=$(run_live_review "$FILE_PATH" "$CONTENT"); then
    emit_advisory "[reviewer-comment / live] ${FILE_PATH}: ${SUMMARY}"
    exit 0
  fi
fi

HITS=""
add_hit() {
  if [ -n "$HITS" ]; then HITS="${HITS}; ${1}"; else HITS="$1"; fi
}

if printf '%s' "$CONTENT" | grep -qiE '(PR[[:space:]]*#[0-9]+|session[-[:space:]][0-9]+|slice[[:space:]]+S-[A-Za-z0-9-]+|round[[:space:]]+[0-9]+)'; then
  MATCH=$(printf '%s' "$CONTENT" | grep -iEo '(PR[[:space:]]*#[0-9]+|session[-[:space:]][0-9]+|slice[[:space:]]+S-[A-Za-z0-9-]+|round[[:space:]]+[0-9]+)' | head -1)
  add_hit "provenance — \"${MATCH}\""
fi

if printf '%s' "$CONTENT" | grep -qiE '(mirrors[[:space:]]+the[[:space:]]+|same[[:space:]]+as[[:space:]]+\w+[[:space:]]+(above|below)|see[[:space:]]+(above|below))'; then
  MATCH=$(printf '%s' "$CONTENT" | grep -iEo '(mirrors[[:space:]]+the[[:space:]]+\w+|same[[:space:]]+as[[:space:]]+\w+[[:space:]]+(above|below)|see[[:space:]]+(above|below))' | head -1)
  add_hit "sibling-step — \"${MATCH}\""
fi

if printf '%s' "$CONTENT" | grep -qiE '(added[[:space:]]+for[[:space:]]+|handles[[:space:]]+issue|used[[:space:]]+by[[:space:]]+|fix[[:space:]]+for[[:space:]]+)'; then
  MATCH=$(printf '%s' "$CONTENT" | grep -iEo '(added[[:space:]]+for[[:space:]]+\w+|handles[[:space:]]+issue[[:space:]]*#?[0-9]*|used[[:space:]]+by[[:space:]]+\w+|fix[[:space:]]+for[[:space:]]+\w+)' | head -1)
  add_hit "lineage — \"${MATCH}\""
fi

if printf '%s' "$CONTENT" | grep -qiE '\b[0-9]+[[:space:]]+findings?[[:space:]]+(action|across|over)'; then
  MATCH=$(printf '%s' "$CONTENT" | grep -iEo '[0-9]+[[:space:]]+findings?[[:space:]]+(action(ed)?|across|over)[[:space:]]*\w*' | head -1)
  add_hit "historical-count — \"${MATCH}\""
fi

if [ -z "$HITS" ]; then
  exit 0
fi

emit_advisory "[reviewer-comment / stub] ${FILE_PATH}: ${HITS} — see CLAUDE.md §\"Comments: WHY not WHAT, no temporal provenance\" (L215-222)."
