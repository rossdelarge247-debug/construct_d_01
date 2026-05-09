#!/usr/bin/env bash
# scripts/canvas-decode-check.sh — CI gate for AC-2 of
# docs/slices/S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates/acceptance.md.
#
# For each slice acceptance.md, scan for `docs/design-source/<slug>/<file>.html`
# references. If the file exists in the tree AND is bundled-format (carries
# `<script type="__bundler/template">`), require either:
#   - a sibling `docs/design-source/<slug>/decoded/<file>.html`, OR
#   - an explicit `^- canvas-decode-waiver: <path> — <reason>` line in the
#     slice's verification.md.
#
# Files absent from the tree are skipped (cross-branch references are not
# author claims of having read the bundled form on the current branch).

set -uo pipefail

SLICE_GLOB="${1:-docs/slices/S-*/acceptance.md}"
BASE_DIR="${2:-.}"

FAILURES=()

shopt -s nullglob
for acceptance in $SLICE_GLOB; do
  [ -f "$acceptance" ] || continue
  slice_dir=$(dirname "$acceptance")
  verification="$slice_dir/verification.md"

  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    [ -f "$BASE_DIR/$ref" ] || continue

    if ! grep -q '<script type="__bundler/template">' "$BASE_DIR/$ref"; then
      continue
    fi

    ref_dir=$(dirname "$ref")
    ref_base=$(basename "$ref")
    decoded="$ref_dir/decoded/$ref_base"

    [ -f "$BASE_DIR/$decoded" ] && continue

    if [ -f "$verification" ] && grep -qE "^- canvas-decode-waiver: ${ref} — " "$verification"; then
      continue
    fi

    FAILURES+=("$acceptance cites $ref (bundled-format) — no decoded sibling at $decoded and no waiver in $verification")
  done < <(grep -oE 'docs/design-source/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+\.html' "$acceptance" | sort -u)
done

if [ ${#FAILURES[@]} -gt 0 ]; then
  printf 'canvas-decode-check: %d violation(s)\n' "${#FAILURES[@]}" >&2
  for f in "${FAILURES[@]}"; do
    printf '  - %s\n' "$f" >&2
  done
  printf '\nResolve by either:\n' >&2
  printf '  (a) running scripts/decode-bundler-canvas.sh on each cited canvas + committing the sibling, or\n' >&2
  printf '  (b) adding `- canvas-decode-waiver: <path> — <reason>` to the slice verification.md.\n' >&2
  exit 1
fi
exit 0
