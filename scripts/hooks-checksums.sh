#!/usr/bin/env bash
# hooks-checksums.sh — manage .claude/hooks-checksums.txt baseline.
#
# Modes:
#   --generate [<root>]   Compute SHA256 over hook-related artefacts; write
#                         to <root>/.claude/hooks-checksums.txt.
#   --verify   [<root>]   Recompute and diff against the baseline; exit 0 on
#                         match, 1 on drift, 2 on missing baseline.
#
# Inputs covered (current scope; extends per acceptance.md AC-2 as
# subsequent slices land):
#   - .claude/hooks/*.sh
#   - .claude/settings.json   (hook-registration block via jq -Sc '.hooks')
#   - scripts/verify-slice.sh
# Future additions (per slice landing): .eslintrc thresholds, vitest.config.ts
# coverage thresholds, .claude/subagent-prompts/*.md.
#
# Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-2 + G18
# (baseline generated immediately at each artefact's landing commit).

set -euo pipefail

MODE="${1:-}"
case "$MODE" in
  --generate|--verify) shift ;;
  *) echo "usage: $0 --generate | --verify [<root>]" >&2; exit 2 ;;
esac

ROOT="${1:-.}"
BASELINE_REL=".claude/hooks-checksums.txt"
BASELINE="$ROOT/$BASELINE_REL"

compute() {
  ( cd "$ROOT" || exit 2
    while IFS= read -r f; do
      sha=$(sha256sum "$f" | awk '{print $1}')
      printf '%s  %s\n' "$sha" "$f"
    done < <(find .claude/hooks -name '*.sh' -type f 2>/dev/null | sort)

    for f in scripts/verify-slice.sh scripts/eslint-no-disable.sh \
             eslint.config.mjs docs/eslint-baseline-allowlist.txt \
             vitest.config.ts docs/tdd-exemption-allowlist.txt; do
      if [ -f "$f" ]; then
        sha=$(sha256sum "$f" | awk '{print $1}')
        printf '%s  %s\n' "$sha" "$f"
      fi
    done

    while IFS= read -r f; do
      sha=$(sha256sum "$f" | awk '{print $1}')
      printf '%s  %s\n' "$sha" "$f"
    done < <(find .claude/subagent-prompts -name '*.md' -type f 2>/dev/null | sort)

    while IFS= read -r f; do
      sha=$(sha256sum "$f" | awk '{print $1}')
      printf '%s  %s\n' "$sha" "$f"
    done < <(find .claude/agents -name '*.md' -type f 2>/dev/null | sort)

    if [ -f .claude/settings.json ]; then
      sha=$(jq -Sc '.hooks // {}' .claude/settings.json | sha256sum | awk '{print $1}')
      printf '%s  %s\n' "$sha" ".claude/settings.json#hooks"
    fi
  )
}

if [ "$MODE" = "--generate" ]; then
  mkdir -p "$ROOT/.claude"
  compute > "$BASELINE"
  echo "hooks-checksums: wrote $BASELINE ($(wc -l < "$BASELINE") entries)" >&2
  exit 0
fi

# --verify
if [ ! -f "$BASELINE" ]; then
  echo "hooks-checksums: baseline not found at $BASELINE — run with --generate first" >&2
  exit 2
fi

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
compute > "$TMP"

if diff -q "$BASELINE" "$TMP" >/dev/null 2>&1; then
  exit 0
fi

{
  echo "DENIED: hooks-checksums drift detected — control-plane artefact(s) modified outside an approved control-change PR."
  echo
  echo "  Baseline: $BASELINE"
  echo
  echo "  Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-2 + G18: every"
  echo "  control-plane change must (a) re-baseline via 'hooks-checksums.sh --generate'"
  echo "  AND (b) ship in a PR carrying the 'control-change' label."
  echo
  echo "Diff (baseline → current):"
  diff -u "$BASELINE" "$TMP" 2>&1 | sed 's/^/  /' || true
  echo
  echo "Actionable alternatives:"
  echo "  - If intentional: scripts/hooks-checksums.sh --generate, then commit + apply 'control-change' label."
  echo "  - If unintentional: git checkout -- <drifted-file> to restore."
} >&2

exit 1
