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
#      `EXIT_PLAN_REVIEW_SPAWN=1` activates `claude -p` invocation).
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

# ── Step 4: frame the prompt for subagent. Heredoc + parameter expansion
# (NOT sed/awk on plan content) per L52(b).
TEMPLATE_PATH=".claude/subagent-prompts/exit-plan-review.md"
if [ ! -f "$TEMPLATE_PATH" ]; then
  echo "exit-plan-review.sh: template missing at $TEMPLATE_PATH" >&2
  exit 2
fi
TEMPLATE=$(cat "$TEMPLATE_PATH")
FRAMED=$(cat <<EOF
${TEMPLATE}

Your per-invocation nonce: ${NONCE}

<plan-from-author-${NONCE}>
${PLAN_CONTENT}
</plan-from-author-${NONCE}>

<git-state-verifier-${NONCE}>
${VERIFIER_OUT}
</git-state-verifier-${NONCE}>
EOF
)

if [ "${EXIT_PLAN_REVIEW_DEBUG_FRAMING:-0}" = "1" ]; then
  printf '%s\n' "$FRAMED"
  exit 0
fi

# ── Step 5: spawn review subagent (pluggable).
if [ "${EXIT_PLAN_REVIEW_SPAWN:-0}" = "1" ] && command -v claude >/dev/null 2>&1; then
  VERDICT=$(printf '%s' "$FRAMED" | claude -p --output-format text 2>/dev/null || echo '{"verdict":"block","severity":"architectural","findings":[{"category":"infra","evidence":"subagent invocation failed","remediation":"check claude CLI auth + retry"}]}')
else
  # Stub mode: no real subagent. Verdict derives from git-state-verifier only.
  if [ "$VERIFIER_RC" -ne 0 ]; then
    VERDICT='{"verdict":"block","severity":"architectural","findings":[{"category":"git-state","evidence":"git-state-verifier flagged discrepancies (see stderr above)","remediation":"verify the assertion against actual git before re-attempting"}]}'
  else
    VERDICT='{"verdict":"approve","severity":"none","findings":[]}'
  fi
fi

# ── Step 6: parse verdict; block on architectural.
SEVERITY=$(printf '%s' "$VERDICT" | jq -r '.severity // "none"' 2>/dev/null || echo "none")

if [ "$SEVERITY" = "architectural" ]; then
  {
    echo
    echo "BLOCKED: exit-plan-review.sh — plan-review subagent returned architectural-severity findings."
    echo
    if [ "$VERIFIER_RC" -ne 0 ]; then
      echo "git-state-verifier output:"
      printf '%s\n' "$VERIFIER_OUT" | sed 's/^/  /'
      echo
    fi
    echo "Subagent verdict:"
    printf '%s\n' "$VERDICT" | sed 's/^/  /'
    echo
    echo "Per acceptance.md AC-7 + CLAUDE.md Planning conduct:"
    echo "  - Verify before planning — kickoffs / summaries rot; check git/spec/file."
    echo "  - Quote, don't paraphrase, when invoking a spec."
    echo "  - Plan-vs-spec cross-check before the first actionable step."
    echo
    echo "Address findings, then re-attempt ExitPlanMode."
  } >&2
  exit 2
fi

exit 0
