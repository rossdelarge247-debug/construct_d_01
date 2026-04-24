#!/usr/bin/env bash
# PostToolUse hook: line-count display.
#
# Fires after every Write / Edit. Surfaces a cumulative session-churn
# figure (additions + deletions vs origin/main, plus untracked-file
# lines) and a delta-since-last-change. Warns at 1,000; harder warn at
# 1,500; stop message at 2,000. Non-blocking.
#
# Counters CLAUDE.md §"Session discipline" drift — the rule that says
# "maintain a running count of net lines added/modified" needs
# something that actually maintains the count. P0.1 of session 27's
# hook-enforcement sprint. See docs/HANDOFF-SESSION-25.md §"Session-26
# brief".

set -euo pipefail

INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | jq -r '.tool_name // ""')

# Only respond to file-write tools. Read / Bash / etc. exit silently.
if [ "$TOOL" != "Write" ] && [ "$TOOL" != "Edit" ]; then
  exit 0
fi

SESSION_ID=$(printf '%s' "$INPUT" | jq -r '.session_id // "unknown"')
STATE="/tmp/claude-lines-${SESSION_ID}.txt"

# Cumulative branch churn vs session base (origin/main).
# additions + deletions captures "lines touched" semantic; untracked
# files count as additions (wc -l of each file).
additions=$(git diff --numstat origin/main 2>/dev/null \
  | awk '{a+=$1} END{print a+0}')
deletions=$(git diff --numstat origin/main 2>/dev/null \
  | awk '{d+=$2} END{print d+0}')
untracked=$(git ls-files --others --exclude-standard 2>/dev/null \
  | xargs -r -I{} wc -l "{}" 2>/dev/null \
  | awk '{a+=$1} END{print a+0}')

total=$((additions + deletions + untracked))

prev=0
if [ -f "$STATE" ]; then
  prev=$(cat "$STATE" 2>/dev/null || echo 0)
fi
delta=$((total - prev))
printf '%s\n' "$total" > "$STATE"

# Thresholds from CLAUDE.md §"Session discipline":
#   ~1,500 → "approaching session scope limit"
#   ~2,000 → "stop writing code"
# Added 1,000 soft-warn so the first signal arrives before the hard cap.
if [ "$total" -ge 2000 ]; then
  level="STOP — 2,000-line threshold exceeded. CLAUDE.md: stop writing code and wrap."
  prefix="[STOP]"
elif [ "$total" -ge 1500 ]; then
  level="Approaching session scope limit (1,500). Recommend wrapping up soon."
  prefix="[WARN]"
elif [ "$total" -ge 1000 ]; then
  level="Over 1,000 session churn — halfway to the 1,500 wrap-up warn."
  prefix="[NOTE]"
else
  level=""
  prefix=""
fi

if [ "$delta" -ge 0 ]; then
  delta_str="+${delta}"
else
  delta_str="${delta}"
fi

if [ -n "$level" ]; then
  msg="${prefix} Lines: ${delta_str} this change · ${total} session churn (+${additions}/-${deletions} tracked, +${untracked} untracked) · ${level}"
else
  msg="Lines: ${delta_str} this change · ${total} session churn (+${additions}/-${deletions} tracked, +${untracked} untracked)"
fi

jq -n --arg msg "$msg" '{
  systemMessage: $msg,
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $msg
  }
}'
