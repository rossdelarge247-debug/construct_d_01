#!/bin/bash
# pre-push-dod7.sh — PreToolUse:Bash gate on `git push`.
#
# Per docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-7:
#   "blocks pushing an impl commit when the immediately prior commit is
#   a self-described RED-meta-tests commit AND CI has not yet observed
#   the prior commit's expected RED state. Closes the procedural gap
#   surfaced at v3a session 40 (S-38-2 RED → S-38-1 GREEN pushed within
#   5 minutes)."
#
# Logic (AC-7 §Verification):
#   (a) Match `git push` (precisely; reject git push-tree, etc.).
#   (b) Inspect last commit pair on current branch (HEAD~1, HEAD).
#   (c) Check if HEAD~1 message matches `^RED:` (case-sensitive).
#   (d) Block when ALL three hold:
#       (i)  HEAD~1 msg matches `^RED:`
#       (ii) HEAD msg does NOT match `^RED:` (i.e. candidate GREEN-impl)
#       (iii) HEAD~1's CI run for the RED meta-test does not yet exist
#             OR is still in-progress.
#
# Override: DOD7_OVERRIDE=1 — warn but pass. Author MUST record the
# override + reasoning in the slice's verification.md.
#
# Test seams (per CLAUDE.md "Effects behind interfaces"):
#   DOD7_GH_CMD — override `gh` invocation. Default: `gh`.
#                 Stub returns JSON shaped like `gh api .../check-runs`.

set -uo pipefail

INPUT=$(cat || true)
[ -z "$INPUT" ] && exit 0

if ! command -v jq >/dev/null 2>&1; then
  {
    echo "BLOCKED: pre-push-dod7 — \`jq\` not on PATH."
    echo "  This hook parses tool_input via jq; without it the gate is inert."
    echo "  Install jq (e.g. \`apt install jq\`) or set DOD7_OVERRIDE=1 for"
    echo "  an audited bypass (record reason in slice verification.md)."
  } >&2
  exit 2
fi

COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')

# (a) Match `git push` precisely AND skip out-of-scope variants:
#   --dry-run        — no commits move; gating pointless
#   -d / --delete    — branch-deletion push; no impl racing
#   :branch (force-empty src) — same as --delete
if ! [[ "$COMMAND" =~ (^|[[:space:]])git[[:space:]]+push($|[[:space:]]) ]]; then
  exit 0
fi
if [[ "$COMMAND" =~ (^|[[:space:]])--dry-run($|[[:space:]]) ]]; then
  exit 0
fi
if [[ "$COMMAND" =~ (^|[[:space:]])(-d|--delete)($|[[:space:]]) ]]; then
  exit 0
fi
# `git push origin :foo` — colon-prefixed refspec is a delete in pre-receive
# parlance. `:foo` or `+:foo` patterns.
if [[ "$COMMAND" =~ [[:space:]]\+?:[A-Za-z0-9_/.-]+($|[[:space:]]) ]]; then
  exit 0
fi

# Override path: warn-but-pass.
if [ "${DOD7_OVERRIDE:-0}" = "1" ]; then
  {
    echo "pre-push-dod7: DOD7_OVERRIDE=1 set — bypass acknowledged."
    echo "  Record the reason in your slice's verification.md (per AC-7 §Verification)."
  } >&2
  exit 0
fi

# Need at least 2 commits to inspect a pair. Fresh-branch / first-push: pass.
if ! git rev-parse HEAD~1 >/dev/null 2>&1; then
  exit 0
fi

PRIOR_MSG=$(git log -1 --format=%s HEAD~1 2>/dev/null || echo "")
HEAD_MSG=$(git log -1 --format=%s HEAD 2>/dev/null || echo "")
PRIOR_SHA=$(git rev-parse HEAD~1 2>/dev/null || echo "")

# (c) Prior must be a RED commit. (b)+(c)+(d.ii): if not, pass.
if ! [[ "$PRIOR_MSG" =~ ^RED: ]]; then
  exit 0
fi

# (d.ii): if HEAD is also RED, the pair is RED→RED — pass through (multi-RED
# slices are legitimate; e.g. acceptance criteria with multiple meta-tests).
if [[ "$HEAD_MSG" =~ ^RED: ]]; then
  exit 0
fi

# (d.iii): query GitHub Actions API for PRIOR_SHA's CI run state.
GH_CMD="${DOD7_GH_CMD:-gh}"
if [ "$GH_CMD" = "gh" ] && ! command -v gh >/dev/null 2>&1; then
  # No gh CLI; can't verify. Warn-but-pass to avoid blocking on missing tool;
  # CI-side mirror enforcement (v3c) is the structural close.
  {
    echo "pre-push-dod7: \`gh\` CLI not on PATH — cannot query CI state for $PRIOR_SHA."
    echo "  Manually verify the RED commit was CI-observed-failing before pushing."
  } >&2
  exit 0
fi

# Query check-runs for the prior commit. Repo derived from origin remote.
# Regex permits `.` in repo names (org/repo.js) and strips optional .git suffix.
REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
REPO=$(printf '%s' "$REMOTE_URL" | sed -E 's#.*github\.com[:/]([^/[:space:]]+/[^/[:space:]]+)$#\1#; s#\.git$##')
if [ -z "$REPO" ] || [ "$REPO" = "$REMOTE_URL" ]; then
  echo "pre-push-dod7: could not parse owner/repo from remote ($REMOTE_URL); pass-through." >&2
  exit 0
fi
# Defensive validation: REPO must be `owner/repo` shape with safe chars only.
if ! [[ "$REPO" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  echo "pre-push-dod7: REPO ($REPO) failed shape validation; pass-through." >&2
  exit 0
fi

# `gh api repos/{repo}/commits/{sha}/check-runs` returns {"total_count":N,"check_runs":[...]}.
# Distinguish three outcomes per finding #7:
#   GH_RC=0           — API succeeded; parse JSON to decide block vs pass.
#   GH_RC=non-zero    — API unreachable (network / rate-limit / auth) → warn-pass.
#   gh missing on PATH — already handled above as warn-pass.
# This keeps the gate from blocking every push during a GitHub incident.
GH_STDERR=$(mktemp -t pre-push-dod7-gh-stderr.XXXXXX)
if RAW=$($GH_CMD api "repos/${REPO}/commits/${PRIOR_SHA}/check-runs" 2>"$GH_STDERR"); then
  GH_RC=0
else
  GH_RC=$?
fi
GH_ERR=$(cat "$GH_STDERR" 2>/dev/null || echo "")
rm -f "$GH_STDERR"
if [ "$GH_RC" -ne 0 ]; then
  {
    echo "pre-push-dod7: \`gh api\` failed (rc=$GH_RC) — API unreachable / rate-limited / auth expired."
    echo "  Could not verify CI state for $PRIOR_SHA. Pass-through (warn) per finding-#7 fix:"
    echo "  network failure should not block pushes during a GitHub incident."
    echo "  If you intended to gate on CI state, fix gh auth + retry, or set DOD7_OVERRIDE=1."
  } >&2
  exit 0
fi
if [ -z "$RAW" ]; then
  {
    echo "BLOCKED: pre-push-dod7 — gh succeeded but returned empty body for prior RED commit."
    echo
    echo "  Prior commit: $PRIOR_SHA"
    echo "  Prior msg:    $(printf '%q' "$PRIOR_MSG")"
    echo
    echo "  This shouldn't happen on a healthy API. Investigate before pushing."
    echo
    echo "Actionable alternatives:"
    echo "  - Wait for CI to start on the prior commit, then re-run push."
    echo "  - Set DOD7_OVERRIDE=1 + record reasoning in slice verification.md."
  } >&2
  exit 2
fi

TOTAL=$(printf '%s' "$RAW" | jq -r '.total_count // 0')
PENDING=$(printf '%s' "$RAW" | jq -r '[.check_runs[]? | select(.status != "completed")] | length')

if [ "$TOTAL" -eq 0 ] || [ "$PENDING" -gt 0 ]; then
  {
    echo "BLOCKED: pre-push-dod7 — prior RED commit's CI has not yet observed RED state."
    echo
    echo "  Prior commit: $PRIOR_SHA"
    echo "  Prior msg:    $(printf '%q' "$PRIOR_MSG")"
    echo "  HEAD msg:     $(printf '%q' "$HEAD_MSG")"
    echo "  CI total runs: $TOTAL"
    echo "  CI pending:    $PENDING (status != completed)"
    echo
    echo "  Per AC-7 (v3b) §Verification (d.iii): block when prior commit's"
    echo "  CI run does not yet exist OR is still in-progress. Closes the"
    echo "  v3a session-40 procedural gap (S-38-2 RED → S-38-1 GREEN within"
    echo "  5 minutes)."
    echo
    echo "Actionable alternatives:"
    echo "  - Wait for CI to complete (typically 1-3 min); re-run push."
    echo "  - Set DOD7_OVERRIDE=1 + record reasoning in slice verification.md."
  } >&2
  exit 2
fi

# Prior CI completed AND head is GREEN candidate — pass.
exit 0
