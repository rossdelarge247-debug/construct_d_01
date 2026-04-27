#!/usr/bin/env bash
# git-state-verifier.sh — verify branch / SHA / state assertions in a plan
# against actual git. Per docs/slices/S-INFRA-rigour-v3a-foundation/
# acceptance.md AC-7 + L52 + F4e (verify-before-planning).
#
# Usage: scripts/git-state-verifier.sh < plan.txt
# Exit:  0 clean · 1 discrepancies · 2 usage error.
# Output (stderr): one finding per line, prefixed `discrepancy:`.

set -uo pipefail

PLAN=$(cat || true)

if [ -z "$PLAN" ]; then
  echo "git-state-verifier: empty plan on stdin" >&2
  exit 2
fi

DISCREPANCIES=0

# 1. SHA candidates: 7-40 char hex strings. Check each via git cat-file.
#    Skip the universally-valid 0000000... null tree.
while IFS= read -r sha; do
  [ -z "$sha" ] && continue
  [ "$sha" = "0000000" ] && continue
  if ! git cat-file -e "$sha" 2>/dev/null; then
    echo "discrepancy: SHA-like '$sha' not found in git object store" >&2
    DISCREPANCIES=$((DISCREPANCIES + 1))
  fi
done < <(echo "$PLAN" | grep -oE '\b[0-9a-f]{7,40}\b' | sort -u)

# 2. Branch refs: claude/<slug>, origin/<branch>, plain main/master.
#    Check each via git rev-parse.
while IFS= read -r ref; do
  [ -z "$ref" ] && continue
  if git rev-parse --verify "$ref" >/dev/null 2>&1; then
    continue
  fi
  # Fallback: bare 'main' / 'master' commonly means origin/<ref> in plans
  # (repos without a local tracking branch). Treat as resolved if upstream exists.
  if { [ "$ref" = "main" ] || [ "$ref" = "master" ]; } && \
     git rev-parse --verify "origin/$ref" >/dev/null 2>&1; then
    continue
  fi
  echo "discrepancy: branch/ref '$ref' not resolvable via git rev-parse" >&2
  DISCREPANCIES=$((DISCREPANCIES + 1))
done < <(echo "$PLAN" | grep -oE '\b(claude/[A-Za-z0-9._/-]+|origin/[A-Za-z0-9._/-]+|main|master)\b' | sort -u)

if [ "$DISCREPANCIES" -eq 0 ]; then
  exit 0
fi

echo "git-state-verifier: $DISCREPANCIES discrepanc(y/ies) found — see lines above" >&2
exit 1
