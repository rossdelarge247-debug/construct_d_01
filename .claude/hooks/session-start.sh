#!/usr/bin/env bash
# SessionStart hook for the Decouple project.
#
# Surfaces read-discipline + Planning-conduct caps + live branch-state
# verification at turn 0 so they hit fresh context every session,
# regardless of what CLAUDE.md currently says or how far those rules
# have drifted in session-to-session attention.
#
# Added session 25 in response to the audit finding that Tier-1
# CLAUDE.md rules don't reliably persist across sessions. See
# docs/HANDOFF-SESSION-25.md.

set -euo pipefail

# --- Branch state ---
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
HEAD_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Fetch origin/main quietly; tolerate offline
git fetch origin main --quiet 2>/dev/null || true

MAIN_SHA=$(git rev-parse --short origin/main 2>/dev/null || echo "unknown")
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "?")
BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "?")

if [ -z "$(git status --porcelain 2>/dev/null)" ]; then
  TREE_STATE="clean"
else
  DIRTY_COUNT=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  TREE_STATE="dirty (${DIRTY_COUNT} file(s) uncommitted)"
fi

# --- Compose the reminder injected into model context ---
CONTEXT=$(cat <<EOF
## Session-start reminder (project hook, loaded automatically)

### Read discipline (CLAUDE.md Planning conduct §)
- Max 300 lines combined tool-result content per turn
- Max 3 Read calls per turn
- Read sections not files for specs >400 lines — use Read with offset + limit
- grep / ls / wc -l before committing to a Read
- Announce expected combined line count before any parallel batch of reads

### Planning conduct (CLAUDE.md)
- Verify before planning — check git / GitHub / Vercel / the file itself before building on a stated fact
- Quote, don't paraphrase, when invoking a spec
- Plan-vs-spec cross-check before the first actionable step
- Path options carry spec refs
- Distrust your own summaries

### Branch state (verified now, not from kickoff memory)
- Current branch: ${BRANCH}
- HEAD: ${HEAD_SHA}
- origin/main tip: ${MAIN_SHA}
- Ahead of main: ${AHEAD} commit(s)
- Behind main: ${BEHIND} commit(s)
- Working tree: ${TREE_STATE}

If BEHIND > 0 or the working tree contains unexpected files, diagnose before any code changes. Per CLAUDE.md startup rule: "If the harness landed you on a different base, resync before doing anything else — \`git fetch origin <branch>\` then \`git checkout -B <branch> origin/<branch>\`."

Before accepting any factual claim in the kickoff prompt (branch tips, test states, file contents, CI status), verify against the live source. Kickoffs are plans written at a past moment; they rot.
EOF
)

# Output JSON for Claude Code
jq -n \
  --arg ctx "$CONTEXT" \
  --arg branch "$BRANCH" \
  --arg ahead "$AHEAD" \
  --arg behind "$BEHIND" \
  --arg tree "$TREE_STATE" \
  '{
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: $ctx
    },
    systemMessage: ("Session start: read discipline + branch-state reminder loaded. Branch: \($branch) | ahead \($ahead) / behind \($behind) | tree \($tree).")
  }'
