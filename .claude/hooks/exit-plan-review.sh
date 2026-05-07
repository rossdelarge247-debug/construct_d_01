#!/bin/bash
# exit-plan-review.sh — PreToolUse:ExitPlanMode plan-review gate.
# Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-7.
#
# Pipeline:
#   1. Generate NONCE from /dev/urandom (16 bytes → 128 bits, hex-encoded).
#      AS FIRST ACTION, before reading any author-influenced input — closes
#      H2 (random-nonce framing — BLOCK closure) per L52(a).
#   2. Read plan content from stdin (Claude Code passes JSON tool input).
#   3. Run scripts/git-state-verifier.sh against plan; record verifier output.
#   4. Frame plan + verifier output in heredoc with nonce-fenced separators.
#   5. Spawn fresh-context review subagent (PLUGGABLE: stub by default;
#      spawned by default when `claude` CLI is available;
#      `EXIT_PLAN_REVIEW_SPAWN=0` opts out (degrades to stub-mode verdict).
#   6. Block plan exit on architectural-severity findings (exit 2).

set -uo pipefail

# ── Step 1: NONCE FIRST. Hard-fail on /dev/urandom unavailable per L52(d).
# DO NOT EDIT THIS BLOCK without an approved control-change PR — it is
# checksummed via AC-2 specifically (L52: "the nonce-derivation snippet
# within .claude/hooks/exit-plan-review.sh ... checksummed via AC-2 so
# neither the template nor the entropy-source line can be silently
# weakened"). Whole-file checksum applies; any line edit triggers drift.
URANDOM_PATH="${EXIT_PLAN_REVIEW_URANDOM:-/dev/urandom}"
if [ ! -r "$URANDOM_PATH" ]; then
  echo "exit-plan-review.sh: $URANDOM_PATH unreadable; refusing to spawn plan-review subagent without entropy source" >&2
  exit 2
fi
# Spec L52(a) literal example: `head -c 16 /dev/urandom | xxd -p`. This
# implementation uses `od -An -tx1 -N16` instead for portability — `xxd`
# is not POSIX and absent from minimal sandboxes; `od` is POSIX. Same
# substantive guarantee per L52(c): 16 random bytes = 128 bits, hex-encoded
# to 32 chars; collision probability per session ~2^-64.
NONCE=$(od -An -tx1 -N16 "$URANDOM_PATH" | tr -d ' \n')
if [ -z "$NONCE" ] || [ "${#NONCE}" -ne 32 ]; then
  echo "exit-plan-review.sh: nonce derivation produced unexpected output (len=${#NONCE}); refusing to proceed" >&2
  exit 2
fi
# ── End nonce-derivation snippet.

if [ "${EXIT_PLAN_REVIEW_DEBUG_NONCE:-0}" = "1" ]; then
  printf '%s\n' "$NONCE"
  exit 0
fi

# ── Step 2: read plan from stdin JSON.
INPUT=$(cat || true)
PLAN_CONTENT=$(printf '%s' "$INPUT" | jq -r '.tool_input.plan // .tool_input.command // empty' 2>/dev/null || echo "")

if [ -z "$PLAN_CONTENT" ]; then
  exit 0
fi

# ── Step 3: git-state-verifier pre-pass.
VERIFIER_OUT=$(printf '%s' "$PLAN_CONTENT" | scripts/git-state-verifier.sh 2>&1)
VERIFIER_RC=$?

# ── Step 4: frame prompts for both personas. Heredoc + parameter
# expansion (NOT sed/awk on plan content) per L52(b).
EXIT_TEMPLATE_PATH=".claude/subagent-prompts/exit-plan-review.md"
PLAN_ARCH_TEMPLATE_PATH=".claude/agents/plan-architect.md"
if [ ! -f "$EXIT_TEMPLATE_PATH" ]; then
  echo "exit-plan-review.sh: template missing at $EXIT_TEMPLATE_PATH" >&2
  exit 2
fi
if [ ! -f "$PLAN_ARCH_TEMPLATE_PATH" ]; then
  echo "exit-plan-review.sh: persona missing at $PLAN_ARCH_TEMPLATE_PATH" >&2
  exit 2
fi
EXIT_TEMPLATE=$(cat "$EXIT_TEMPLATE_PATH")
PLAN_ARCH_TEMPLATE=$(cat "$PLAN_ARCH_TEMPLATE_PATH")

frame_prompt() {
  local template="$1"
  cat <<EOF
${template}

Your per-invocation nonce: ${NONCE}

<plan-from-author-${NONCE}>
${PLAN_CONTENT}
</plan-from-author-${NONCE}>

<git-state-verifier-${NONCE}>
${VERIFIER_OUT}
</git-state-verifier-${NONCE}>
EOF
}

EXIT_FRAMED=$(frame_prompt "$EXIT_TEMPLATE")
PLAN_ARCH_FRAMED=$(frame_prompt "$PLAN_ARCH_TEMPLATE")

if [ "${EXIT_PLAN_REVIEW_DEBUG_FRAMING:-0}" = "1" ]; then
  printf '%s\n' "$EXIT_FRAMED"
  printf '\n--- plan-architect framing ---\n\n'
  printf '%s\n' "$PLAN_ARCH_FRAMED"
  exit 0
fi

# ── Step 5: spawn review subagents (pluggable; both personas).
# Test-only injection paths: EXIT_PLAN_REVIEW_DEBUG_VERDICT_EXIT and
# EXIT_PLAN_REVIEW_DEBUG_VERDICT_PLAN_ARCH bypass spawn for shellspec
# coverage of the dual-persona orchestration without requiring claude CLI.
EMPTY_VERDICT='{"findings":[]}'
if [ -n "${EXIT_PLAN_REVIEW_DEBUG_VERDICT_EXIT:-}" ] || [ -n "${EXIT_PLAN_REVIEW_DEBUG_VERDICT_PLAN_ARCH:-}" ]; then
  EXIT_VERDICT="${EXIT_PLAN_REVIEW_DEBUG_VERDICT_EXIT:-$EMPTY_VERDICT}"
  PLAN_ARCH_VERDICT="${EXIT_PLAN_REVIEW_DEBUG_VERDICT_PLAN_ARCH:-$EMPTY_VERDICT}"
elif [ "${EXIT_PLAN_REVIEW_SPAWN:-1}" != "0" ] && command -v claude >/dev/null 2>&1; then
  EXIT_VERDICT=$(printf '%s' "$EXIT_FRAMED" | claude -p --output-format text 2>/dev/null || echo '{"findings":[{"label":"issue","blocking":true,"category":"infra","evidence":"exit-plan-review subagent invocation failed","remediation":"check claude CLI auth + retry"}]}')
  PLAN_ARCH_VERDICT=$(printf '%s' "$PLAN_ARCH_FRAMED" | claude -p --output-format text 2>/dev/null || echo '{"findings":[{"label":"issue","blocking":true,"category":"infra","evidence":"plan-architect subagent invocation failed","remediation":"check claude CLI auth + retry"}]}')
else
  # Stub mode: no real subagents. exit-plan-review owns git-state findings
  # (verifier output drives them); plan-architect emits empty in stub mode
  # (architectural reasoning needs the LLM).
  if [ "$VERIFIER_RC" -ne 0 ]; then
    EXIT_VERDICT='{"findings":[{"label":"issue","blocking":true,"category":"git-state","evidence":"git-state-verifier flagged discrepancies (see stderr above)","remediation":"verify the assertion against actual git before re-attempting"}]}'
  else
    EXIT_VERDICT='{"findings":[]}'
  fi
  PLAN_ARCH_VERDICT='{"findings":[]}'
fi

# ── Step 6: aggregate findings (union across both personas); block on any
# blocking finding. Single-format Conventional Comments per spec 72d §5.
AGGREGATED=$(jq -s '{findings: (map(.findings // []) | flatten)}' \
  <(printf '%s' "$EXIT_VERDICT") \
  <(printf '%s' "$PLAN_ARCH_VERDICT") \
  2>/dev/null || echo '{"findings":[{"label":"issue","blocking":true,"category":"infra","evidence":"verdict aggregation parse failure","remediation":"check persona output JSON schema"}]}')

BLOCKING_COUNT=$(printf '%s' "$AGGREGATED" | jq -r '[.findings[] | select(.blocking == true)] | length' 2>/dev/null || echo "1")

if [ "$BLOCKING_COUNT" -gt 0 ]; then
  {
    echo
    echo "BLOCKED: exit-plan-review.sh — plan-review personas returned blocking findings."
    echo
    if [ "$VERIFIER_RC" -ne 0 ]; then
      echo "git-state-verifier output:"
      printf '%s\n' "$VERIFIER_OUT" | sed 's/^/  /'
      echo
    fi
    echo "Aggregated findings (Conventional Comments):"
    printf '%s\n' "$AGGREGATED" | jq '.' 2>/dev/null | sed 's/^/  /' || printf '%s\n' "$AGGREGATED" | sed 's/^/  /'
    echo
    echo "Per acceptance.md AC-7 + spec 72d §5 + CLAUDE.md Planning conduct:"
    echo "  - Verify before planning — kickoffs / summaries rot; check git/spec/file."
    echo "  - Quote, don't paraphrase, when invoking a spec."
    echo "  - Plan-vs-spec cross-check before the first actionable step."
    echo "  - Architectural seams forecasted at plan time (spec 72d §5 plan-architect persona)."
    echo
    echo "Address findings, then re-attempt ExitPlanMode."
  } >&2
  exit 2
fi

exit 0
