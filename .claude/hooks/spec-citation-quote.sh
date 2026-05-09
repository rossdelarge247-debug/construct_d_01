#!/usr/bin/env bash
# .claude/hooks/spec-citation-quote.sh — PostToolUse:Write|Edit author-time
# advisory + opt-in enforcement for spec-citation quote discipline.
#
# Per docs/slices/S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates/acceptance.md AC-3.
# Catches `per spec NN` and `spec NN §"..."` claim citations that lack a
# literal-text quote within 5 lines after the citation. Runs against
# slice docs (`docs/slices/S-*/*.md`) and workspace specs (`docs/workspace-spec/*.md`).
# Stub-mode default: emit advisory + exit 0. Live-mode (`SPEC_QUOTE_ENFORCE=1`):
# emit advisory + exit 2 to block the Write/Edit.

set -uo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
# shellcheck disable=SC1091
. "$SCRIPT_DIR/scripts/spec-citation-patterns.sh"

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

# Normalise absolute → relative (matches comment-review.sh convention).
FILE_PATH="${FILE_PATH#$PWD/}"

if ! spec_citation_path_in_scope "$FILE_PATH"; then
  exit 0
fi

if spec_citation_path_in_skiplist "$FILE_PATH"; then
  exit 0
fi

# Get content (Write or Edit).
if [ "$TOOL" = "Write" ]; then
  CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.content // ""' 2>/dev/null || echo "")
else
  CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.new_string // ""' 2>/dev/null || echo "")
fi
[ -z "$CONTENT" ] && exit 0

# Trigger scan: strip §Status + blockquote + fenced-code lines (preserve line numbering).
SCAN_CONTENT=$(printf '%s' "$CONTENT" | spec_citation_strip_for_trigger_scan)

# For each trigger, check proximity quote in ORIGINAL content (so blockquoted
# verbatim quotes count as the satisfier).
HITS=()
while IFS=: read -r line_num match_rest; do
  [ -z "$line_num" ] && continue
  # Trim leading whitespace from match (just the citation text).
  match=$(printf '%s' "$match_rest" | sed -E 's/^[[:space:]]+//' | head -c 80)
  if ! printf '%s' "$CONTENT" | spec_citation_has_proximity_quote "$line_num" >/dev/null 2>&1; then
    HITS+=("L${line_num}: ${match}")
  fi
done < <(printf '%s' "$SCAN_CONTENT" | grep -nE "$SPEC_QUOTE_TRIGGER_REGEX" || true)

if [ ${#HITS[@]} -eq 0 ]; then
  exit 0
fi

# Compose advisory with all hits.
JOINED=$(printf '%s; ' "${HITS[@]}" | sed 's/; $//')
MODE="stub"
[ "${SPEC_QUOTE_ENFORCE:-0}" = "1" ] && MODE="enforce"

MESSAGE="[spec-citation-quote / ${MODE}] ${FILE_PATH}: ${JOINED} — see CLAUDE.md §\"Planning conduct\" §\"Quote, don't paraphrase, when invoking a spec\""

emit_advisory "$MESSAGE"

if [ "$MODE" = "enforce" ]; then
  exit 2
fi
exit 0
