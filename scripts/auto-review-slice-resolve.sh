#!/usr/bin/env bash
# auto-review-slice-resolve.sh BRANCH PR_BODY
#
# Resolves the auto-review slice acceptance.md path for the persona's
# linked-AC fence input. Branch-derived path preferred (deterministic;
# matches `claude/<slice-name>` naming); PR-body grep is the fallback
# when branch resolution misses.
#
# Outputs the slice acceptance.md path on stdout, or empty string.
# Always exit 0.
#
# Why branch-first: a PR body that incidentally cites an unrelated slice
# path (e.g. in §"References", §"Forward-only rename", or §"Sibling-
# slice precedent" sections) can mis-resolve to that slice. Observed in
# PR #38 (session 50) where §"Forward-only rename" listed
# S-F7-alpha-contracts-dev-mode/acceptance.md as one of four historical
# references; `grep -oE ... | head -1` grabbed it instead of the
# branch-mapped slice. Consequence: persona compared diff against wrong
# AC. PR #39 (session 50) fixed this with the branch-first preference.
#
# Test contract: tests/shellspec/auto-review-slice-resolve.spec.sh.

set -euo pipefail

BRANCH="${1:-}"
PR_BODY="${2:-}"

SLICE_FROM_BRANCH=$(printf '%s' "$BRANCH" | grep -oE 'S-[A-Za-z0-9-]+' | head -1 || true)
# Hidden constraint (per PR #47 review 4343099334): the relative `docs/slices/...`
# path requires CWD = repo root. auto-review.yml guarantees this via
# `actions/checkout@v4` running before this script invocation. Local callers
# must `cd` to repo root first.
if [ -n "$SLICE_FROM_BRANCH" ] && [ -f "docs/slices/$SLICE_FROM_BRANCH/acceptance.md" ]; then
  echo "docs/slices/$SLICE_FROM_BRANCH/acceptance.md"
else
  printf '%s' "$PR_BODY" | grep -oE 'docs/slices/S-[A-Za-z0-9-]+/acceptance\.md' | head -1 || true
fi
