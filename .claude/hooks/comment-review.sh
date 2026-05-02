#!/usr/bin/env bash
# PostToolUse:Write|Edit — author-time review for comment anti-patterns.
#
# Reads JSON tool input from stdin. For Write/Edit on a code/text file
# outside the skip-list, runs the four-pattern stub-mode regex check
# against new content. On any match, emits a single JSON object with a
# systemMessage advisory listing the flagged catalogue items. Always
# exits 0 — advisory contract; no blocking. Live LLM mode is opt-in via
# COMMENT_REVIEW_SPAWN=1, falling back to stub on any spawn failure.
#
# Anti-pattern catalogue source: CLAUDE.md §Coding conduct §"Comments:
# WHY not WHAT, no temporal provenance" (L215-222). Persona prompt for
# live mode lives at .claude/agents/reviewer-comment.md.

set -uo pipefail

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""' 2>/dev/null || echo "")

if [ "$TOOL" != "Write" ] && [ "$TOOL" != "Edit" ]; then
  exit 0
fi

FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // ""' 2>/dev/null || echo "")
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Skip-list: paths and extensions where catalogue strings are legitimate
# fixtures, structural data, or binaries. Persona files quote catalogue
# examples by purpose; shellspec fixtures pass flagged strings as Data;
# JSON/YAML/lockfiles have no comment surface; binaries are non-text.
case "$FILE_PATH" in
  .claude/agents/*) exit 0 ;;
  .claude/subagent-prompts/*) exit 0 ;;
  tests/shellspec/*) exit 0 ;;
  tests/*/fixtures/*) exit 0 ;;
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

# Live mode (pluggable). Stub mode (default) covers four catalogue items
# below; live mode additionally covers WHAT-narration via the persona's
# rubric. On any spawn failure, fall through to stub.
if [ "${COMMENT_REVIEW_SPAWN:-0}" = "1" ] && command -v claude >/dev/null 2>&1; then
  PERSONA_PATH=".claude/agents/reviewer-comment.md"
  if [ -f "$PERSONA_PATH" ] && [ -r /dev/urandom ]; then
    NONCE=$(od -An -tx1 -N16 /dev/urandom | tr -d ' \n')
    if [ -n "$NONCE" ] && [ "${#NONCE}" -eq 32 ]; then
      PERSONA=$(cat "$PERSONA_PATH")
      FRAMED=$(cat <<EOF
${PERSONA}

Your per-invocation nonce: ${NONCE}

<file-path-${NONCE}>
${FILE_PATH}
</file-path-${NONCE}>

<new-content-${NONCE}>
${CONTENT}
</new-content-${NONCE}>
EOF
      )
      VERDICT=$(printf '%s' "$FRAMED" | timeout 20 claude -p --output-format text 2>/dev/null || echo "")
      if [ -n "$VERDICT" ]; then
        SUMMARY=$(printf '%s' "$VERDICT" | jq -r '.summary // empty' 2>/dev/null || echo "")
        if [ -n "$SUMMARY" ]; then
          MSG="[reviewer-comment / live] ${FILE_PATH}: ${SUMMARY}"
          jq -n --arg msg "$MSG" '{
            systemMessage: $msg,
            hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: $msg }
          }'
          exit 0
        fi
      fi
    fi
  fi
fi

# Stub mode — deterministic regex over the new content. Each pattern
# maps to one catalogue item label; matches accumulate into one message.
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

MSG="[reviewer-comment / stub] ${FILE_PATH}: ${HITS} — see CLAUDE.md §\"Comments: WHY not WHAT, no temporal provenance\" (L215-222)."
jq -n --arg msg "$MSG" '{
  systemMessage: $msg,
  hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: $msg }
}'
exit 0
