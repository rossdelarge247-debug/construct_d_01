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

printf '\n## Full wrap-protocol (CLAUDE.md §"Wrapping up a session")\n'
printf '\n'
printf '  1. Commit + push all uncommitted work\n'
printf '  2. Update SESSION-CONTEXT.md for the NEXT session\n'
printf '  3. Write HANDOFF-SESSION-%s.md retro\n' "${SESSION_N:-N}"
printf '  4. Update CLAUDE.md if branch conventions, key files, or rules changed\n'
printf '  5. Commit + push handoff docs\n'
printf '  6. Open PR to main from session branch\n'

exit 0
