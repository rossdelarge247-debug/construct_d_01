#!/bin/bash
# pre-commit-verify.sh — PreToolUse:Bash gate on `git commit`.
# Runs scripts/verify-slice.sh against the slice referenced by the current
# branch name; blocks the commit on red. Per acceptance.md AC-4 + L49:
# "Harness-level, not git-level — bypasses by --no-verify don't apply."
#
# Slice derivation: branch name `claude/<slice>` (with optional 5-char harness
# suffix `-XXXXX`) → `docs/slices/<slice>/`. Branches not matching this shape
# skip-allow (the harness may run the hook on any commit).

set -uo pipefail

INPUT=$(cat || true)
COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || echo "")

# Match `git commit` precisely; reject `git commit-graph`, `git commit-tree`.
if ! [[ "$COMMAND" =~ (^|[[:space:]])git[[:space:]]+commit($|[[:space:]]) ]]; then
  exit 0
fi

BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "")
SLICE_NAME=$(printf '%s' "$BRANCH" | sed -E 's|^claude/||; s|-[A-Za-z0-9]{5}$||')

if [ -z "$SLICE_NAME" ] || [ ! -d "docs/slices/$SLICE_NAME" ]; then
  exit 0
fi

START=$(date +%s)
if scripts/verify-slice.sh "docs/slices/$SLICE_NAME" >&2; then
  ELAPSED=$(( $(date +%s) - START ))
  if [ "$ELAPSED" -gt 5 ]; then
    echo "warning: pre-commit-verify took ${ELAPSED}s (G16 budget 5s)" >&2
  fi
  exit 0
fi

{
  echo
  echo "BLOCKED: pre-commit-verify.sh — scripts/verify-slice.sh failed for"
  echo "         slice docs/slices/${SLICE_NAME}."
  echo
  echo "Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-4 + DoD:"
  echo "every git commit on a slice-named branch must pass slice verification."
  echo
  echo "Actionable alternatives:"
  echo "  - Add the missing slice artefact (acceptance.md / security.md / verification.md)"
  echo "    from docs/slices/_template/ as starting point."
  echo "  - If verify-slice.sh emitted other failure modes, address those first"
  echo "    and re-stage."
  echo "  - For genuinely exempt commits (rare; e.g. session-wrap docs), the bypass"
  echo "    is documented in CLAUDE.md §Hard controls (per AC-8)."
} >&2

exit 2
