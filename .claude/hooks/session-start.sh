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
#
# --- Session-base re-baseline (AC-12, post-PR-#25) ---
# The cached base SHA at /tmp/claude-base-${SESSION_ID}.txt anchors
# line-count.sh's session-authored-churn measurement. The original
# absent-only guard left the cached SHA stale across mid-session
# `git checkout -B <branch> origin/<branch>` resyncs (the documented
# Branch-resume recipe in CLAUDE.md), so subsequent line-count deltas
# included the cross-branch resync diff (~2,200 lines for v3a-foundation
# in session 40; ~1,447 lines for PR-#25 resync in this session pre-fix).
#
# Per docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-12,
# the guard is relaxed to: rebaseline when the file is absent OR when
# `git diff --shortstat <cached-base> HEAD` insertions+deletions ≥ 200.
# Threshold 200 absorbs normal session churn while catching cross-branch
# hops (typical inheritance: 1k–5k lines). Same-SHA fires noop because
# diff = 0 < 200; this is the once-per-hop semantics the spec mandates.
#
# Calibration model (from docs/HANDOFF-SESSION-30.md §Calibration data,
# rebracketed against measured behaviour in sessions 32–43):
# - Single Edit, in-place modify-N-lines      → `+N this change`
# - Single Edit, same-length string swap      → `+0 this change`
# - Edit replace_all hitting N occurrences    → `+N×2 this change`
# - Edit on tracked file, first post-commit   → anomalous `+350` once
#                                                (baseline-init artefact)
# Cumulative session-churn = additions + deletions vs <DIFF_BASE> +
# untracked-file linecount. Untracked-file lines re-roll when the file
# is `git add`ed; tracked-file deltas are stable across re-edits.

set -euo pipefail

INPUT=$(cat 2>/dev/null || echo '{}')
SESSION_ID=$(printf '%s' "$INPUT" | jq -r '.session_id // "unknown"' 2>/dev/null || echo "unknown")

# --- Branch state ---
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
HEAD_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Capture the full HEAD SHA as this session's measurement base. Read by
# line-count.sh to compute session-authored churn (vs branch-inherited).
#
# Rebaseline conditions (per AC-12, header comment above):
#  (a) base file absent — first hook fire for this session_id;
#  (b) cumulative `git diff --shortstat` insertions+deletions between
#      cached base and current HEAD ≥ 200 — catches mid-session
#      branch-resyncs (harness-orphan → canonical recipe in CLAUDE.md);
#  (c) cached base SHA unreachable in object store — treat as absent.
# Same-SHA fires are noop (diff = 0 < 200) — once-per-hop semantics.
SESSION_BASE_FILE="/tmp/claude-base-${SESSION_ID}.txt"
if [ "$HEAD_SHA" != "unknown" ]; then
  should_rebaseline=0
  if [ ! -f "$SESSION_BASE_FILE" ]; then
    should_rebaseline=1
  else
    CACHED_BASE=$(cat "$SESSION_BASE_FILE" 2>/dev/null || echo "")
    CURRENT_HEAD_FULL=$(git rev-parse HEAD 2>/dev/null || echo "")
    if [ -n "$CACHED_BASE" ] && [ "$CACHED_BASE" != "$CURRENT_HEAD_FULL" ]; then
      if git cat-file -e "${CACHED_BASE}^{commit}" 2>/dev/null; then
        DIFF_TOTAL=$(git diff --shortstat "$CACHED_BASE" "$CURRENT_HEAD_FULL" 2>/dev/null \
          | awk '{
              ins=0; del=0
              for(i=1;i<=NF;i++){
                if($i ~ /insertion/) ins=$(i-1)
                if($i ~ /deletion/) del=$(i-1)
              }
              print ins+del+0
            }')
        [ "${DIFF_TOTAL:-0}" -ge 200 ] && should_rebaseline=1
      else
        should_rebaseline=1
      fi
    fi
  fi
  if [ "$should_rebaseline" -eq 1 ]; then
    git rev-parse HEAD > "$SESSION_BASE_FILE" 2>/dev/null || true
  fi
fi

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

# --- Branch-resume check (harness-suffix detection) ---
# Harness occasionally lands sessions on an auto-generated suffixed branch
# `claude/<slug>-<5alphanumeric>$` when a canonical non-suffixed branch
# already exists on origin. Detect + surface the resync recipe at turn 0
# instead of forcing manual `mcp__github__list_branches` diagnosis.
SUFFIX_WARNING=""
if [[ "$BRANCH" =~ ^claude/.+-[A-Za-z0-9]{5}$ ]]; then
  CANDIDATE_BASE="${BRANCH%-*}"
  if git ls-remote --exit-code --heads origin "$CANDIDATE_BASE" >/dev/null 2>&1; then
    SUFFIX_WARNING=$(cat <<EOF


### Branch-resume check (harness-suffix detected)

Current branch \`${BRANCH}\` matches the harness suffix pattern \`claude/<slug>-<5alphanumeric>\`. Canonical branch \`${CANDIDATE_BASE}\` exists on origin — the harness may have landed you on an orphan suffixed branch.

To resume the canonical branch:

\`\`\`
git fetch origin ${CANDIDATE_BASE}
git checkout -B ${CANDIDATE_BASE} origin/${CANDIDATE_BASE}
git branch -D ${BRANCH}
\`\`\`

Verify intent (\`mcp__github__list_branches\` for canonical-branch tip + state) before resync if the suffixed branch was deliberate.
EOF
)
  fi
fi

# --- Hooks-checksums integrity check (per acceptance.md AC-2 + G18) ---
# Surface drift at session start so it's visible at turn 0 rather than
# discovered later. Non-blocking — emit context regardless of result.
INTEGRITY_WARNING=""
if [ -x scripts/hooks-checksums.sh ] && [ -f .claude/hooks-checksums.txt ]; then
  if ! INTEGRITY_OUT=$(scripts/hooks-checksums.sh --verify 2>&1); then
    INTEGRITY_WARNING=$(cat <<EOF


### Hooks-checksums integrity warning

Drift detected against \`.claude/hooks-checksums.txt\` baseline. Diagnose before any code change — control-plane artefact(s) modified outside an approved control-change PR.

\`\`\`
$(printf '%s\n' "$INTEGRITY_OUT" | head -25)
\`\`\`
EOF
)
  fi
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

Before accepting any factual claim in the kickoff prompt (branch tips, test states, file contents, CI status), verify against the live source. Kickoffs are plans written at a past moment; they rot.${SUFFIX_WARNING}${INTEGRITY_WARNING}
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
