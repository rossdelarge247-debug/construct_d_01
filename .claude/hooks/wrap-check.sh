#!/usr/bin/env bash
# /wrap slash command helper: emits the session wrap-protocol checklist
# per CLAUDE.md §"Wrapping up a session".
#
# Deterministic bash checks so the same state produces the same
# checklist. Invoked by .claude/commands/wrap.md. Non-blocking: this
# is a self-check at session end, not a gate.
#
# P0.3 of session 27's hook-enforcement sprint.

set -uo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

printf '## Wrap-protocol checklist\n\n'

# --- Step 1: Working tree ---
DIRTY=$(git status --porcelain 2>/dev/null)
if [ -z "$DIRTY" ]; then
  printf -- '- [x] **Working tree clean** — no uncommitted changes\n'
else
  COUNT=$(printf '%s\n' "$DIRTY" | wc -l | tr -d ' ')
  printf -- '- [ ] **Working tree dirty** — %s file(s) uncommitted. Commit or stash before wrap.\n' "$COUNT"
  printf '%s\n' "$DIRTY" | head -20 | sed 's/^/      /'
fi

# --- Branch & ahead/behind ---
BRANCH=$(git branch --show-current 2>/dev/null || echo unknown)
git fetch origin main --quiet 2>/dev/null || true
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo '?')
BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo '?')
printf -- '- Branch **%s** — %s ahead / %s behind origin/main\n' "$BRANCH" "$AHEAD" "$BEHIND"
if [ "$AHEAD" != "0" ] && [ "$AHEAD" != "?" ]; then
  printf '  commits ready to push / PR:\n'
  git log --oneline origin/main..HEAD 2>/dev/null | head -10 | sed 's/^/    /'
fi

# --- Session number inference ---
SESSION_N=""
if [[ "$BRANCH" =~ session-([0-9]+) ]]; then
  SESSION_N="${BASH_REMATCH[1]}"
fi
if [ -z "$SESSION_N" ] && [ -f "docs/SESSION-CONTEXT.md" ]; then
  SESSION_N=$(head -1 docs/SESSION-CONTEXT.md 2>/dev/null | grep -oE '[0-9]+' | head -1 || true)
fi

if [ -n "$SESSION_N" ]; then
  printf -- '- Inferred session number: **%s**\n' "$SESSION_N"
else
  printf -- '- [ ] Could not infer session number from branch or SESSION-CONTEXT.md header — confirm manually\n'
fi

# --- Step 3: HANDOFF-SESSION-N.md ---
if [ -n "$SESSION_N" ]; then
  HANDOFF="docs/HANDOFF-SESSION-${SESSION_N}.md"
  if [ -f "$HANDOFF" ]; then
    HANDOFF_LINES=$(wc -l < "$HANDOFF" 2>/dev/null | tr -d ' ')
    printf -- '- [x] **%s** exists (%s lines)\n' "$HANDOFF" "$HANDOFF_LINES"
  else
    printf -- '- [ ] **%s** missing — write retro before wrap\n' "$HANDOFF"
  fi
fi

# --- Step 2: SESSION-CONTEXT.md refresh ---
if [ -f "docs/SESSION-CONTEXT.md" ]; then
  HEADER=$(head -1 docs/SESSION-CONTEXT.md 2>/dev/null || echo '')
  if [ -n "$SESSION_N" ]; then
    NEXT_SESSION=$((SESSION_N + 1))
    if printf '%s' "$HEADER" | grep -q "Session ${NEXT_SESSION}"; then
      printf -- '- [x] SESSION-CONTEXT.md refreshed for next session (%s)\n' "$NEXT_SESSION"
    elif printf '%s' "$HEADER" | grep -q "Session ${SESSION_N}"; then
      printf -- '- [ ] SESSION-CONTEXT.md still headed "Session %s" — refresh for session %s before wrap\n' "$SESSION_N" "$NEXT_SESSION"
    else
      printf -- '- [ ] SESSION-CONTEXT.md header: "%s" — expected to reference session %s or %s\n' "$HEADER" "$SESSION_N" "$NEXT_SESSION"
    fi
  else
    printf -- '- SESSION-CONTEXT.md header: "%s"\n' "$HEADER"
  fi
else
  printf -- '- [ ] docs/SESSION-CONTEXT.md missing\n'
fi

# --- Step 6: PR status ---
printf -- '- PR status for branch: check via GitHub MCP (`mcp__github__list_pull_requests` head=%s) or gh CLI. Hook cannot call MCP tools directly.\n' "$BRANCH"

# --- Step 7: Emoji scan over persistent wrap prose ---
printf '\n## Emoji scan (persistent prose — system prompt rule)\n\n'
EMOJI_HITS=""
for f in "docs/HANDOFF-SESSION-${SESSION_N:-X}.md" docs/SESSION-CONTEXT.md; do
  [ -f "$f" ] || continue
  HIT=$(grep -onE '✅|❌|🟢|🔴|🟡|🚀|⚠️|✨|🎉|⏳|🔵' "$f" 2>/dev/null | head -3)
  if [ -n "$HIT" ]; then
    EMOJI_HITS="${EMOJI_HITS}  ${f}:\n${HIT}\n"
  fi
done
if [ -z "$EMOJI_HITS" ]; then
  printf -- '- [x] No emoji detected in HANDOFF / SESSION-CONTEXT.\n'
else
  printf -- '- [ ] Emoji detected — drop or replace with prose:\n'
  printf '%b' "$EMOJI_HITS" | sed 's/^/      /'
fi

# --- Step 8: Tone review (opt-in via WRAP_TONE_REVIEW_SPAWN=1) ---
if [ "${WRAP_TONE_REVIEW_SPAWN:-0}" = "1" ] && command -v claude >/dev/null 2>&1 && [ -f ".claude/agents/reviewer-tone.md" ]; then
  printf '\n## Tone review (`reviewer-tone.md`)\n\n'
  WRAP_DIFF=$(git diff origin/main...HEAD -- 'docs/workspace-spec/**.md' '.claude/agents/**.md' '.claude/subagent-prompts/**.md' 'docs/slices/**.md' 'docs/HANDOFF-SESSION-*.md' 'docs/SESSION-CONTEXT.md' 2>/dev/null)
  if [ -z "$WRAP_DIFF" ]; then
    printf -- '- [skip] No prose surface changes against origin/main.\n'
  else
    NONCE=$(od -An -tx1 -N16 /dev/urandom 2>/dev/null | tr -d ' \n')
    if [ -n "$NONCE" ] && [ "${#NONCE}" -eq 32 ]; then
      PERSONA=$(cat .claude/agents/reviewer-tone.md)
      RUBRIC=$(awk '/^\*\*Comments: WHY not WHAT, no temporal provenance\.\*\*/,/^## /' CLAUDE.md | head -n -1)
      FRAMED=$(printf '%s\n\nYour per-invocation nonce: %s\n\n<wrap-diff-%s>\n%s\n</wrap-diff-%s>\n\n<rubric-%s>\n%s\n</rubric-%s>\n' \
        "$PERSONA" "$NONCE" "$NONCE" "$WRAP_DIFF" "$NONCE" "$NONCE" "$RUBRIC" "$NONCE")
      VERDICT=$(printf '%s' "$FRAMED" | timeout 60 claude -p --output-format text 2>/dev/null || echo "")
      if [ -n "$VERDICT" ]; then
        SUMMARY=$(printf '%s' "$VERDICT" | jq -r '.summary // "no summary"' 2>/dev/null || echo "parse error")
        FCOUNT=$(printf '%s' "$VERDICT" | jq -r '(.findings // []) | length' 2>/dev/null || echo "?")
        printf -- '- summary: %s\n' "$SUMMARY"
        printf -- '- findings: %s\n' "$FCOUNT"
        if [ "$FCOUNT" != "0" ] && [ "$FCOUNT" != "?" ]; then
          printf '%s' "$VERDICT" | jq -r '(.findings // [])[] | "  - [" + .label + " / " + .category + "] " + .evidence + " — " + .remediation' 2>/dev/null
        fi
      else
        printf -- '- [error] Subagent invocation failed or timed out.\n'
      fi
    fi
  fi
fi

printf '\n## Full wrap-protocol (CLAUDE.md §"Wrapping up a session")\n'
printf '\n'
printf '  1. Commit + push all uncommitted work\n'
printf '  2. Update SESSION-CONTEXT.md for the NEXT session\n'
printf '  3. Write HANDOFF-SESSION-%s.md retro\n' "${SESSION_N:-N}"
printf '  4. Update CLAUDE.md if branch conventions, key files, or rules changed\n'
printf '  5. Commit + push handoff docs\n'
printf '  6. Open PR to main from session branch\n'

exit 0
