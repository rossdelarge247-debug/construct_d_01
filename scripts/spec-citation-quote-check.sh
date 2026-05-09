#!/usr/bin/env bash
# scripts/spec-citation-quote-check.sh — AC-4 merge-time CI mirror.
#
# Per docs/slices/S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates/acceptance.md AC-4.
# Stricter than the AC-3 author-time hook: additionally fuzzy-matches the
# local quoted text against the cited spec file's content. Catches
# fabricated quotes (the failure mode behind the prototype-canvas regression).

set -uo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck disable=SC1091
. "$SCRIPT_DIR/spec-citation-patterns.sh"

BASE_DIR="${BASE_DIR:-.}"
if [ "$#" -gt 0 ]; then
  SCAN_GLOBS=("$@")
else
  SCAN_GLOBS=("docs/slices/S-*/*.md" "docs/workspace-spec/*.md")
fi

normalise_for_match() {
  tr '[:upper:]' '[:lower:]' \
    | tr -s '[:space:]' ' ' \
    | sed -E 's/[*_"`]+//g'
}

# Args: $1 = file, $2 = trigger line. stdout = literal quote text from the
# proximity window (first satisfying line); empty if none.
extract_local_quote() {
  local file="$1" trigger_line="$2"
  awk -v start="$trigger_line" -v window="$SPEC_QUOTE_PROXIMITY_LINES" -v min="$SPEC_QUOTE_MIN_CHARS" '
    {
      if (/^```/) { in_fence = !in_fence; next }
      if (NR <= start) next
      if (NR > start + window) exit
      if (in_fence && length($0) >= min) { print; exit }
      if (/^>/) {
        line = $0
        sub(/^>[[:space:]]*/, "", line)
        gsub(/^[*_"]+|[*_"]+$/, "", line)
        if (length(line) >= min) { print line; exit }
      }
    }
  ' "$file"
}

extract_spec_id() {
  printf '%s' "$1" | grep -oE '[Ss]pec[[:space:]]+[0-9]+[a-z]?' | head -1 | grep -oE '[0-9]+[a-z]?'
}

resolve_spec_file() {
  local spec_id="$1"
  local match=""
  for f in "$BASE_DIR/docs/workspace-spec/${spec_id}-"*.md; do
    [ -e "$f" ] || continue
    match="$f"
    break
  done
  [ -z "$match" ] && return 1
  printf '%s' "$match"
}

FAILURES=()

shopt -s nullglob
for glob in "${SCAN_GLOBS[@]}"; do
  for f in $glob; do
    [ -f "$f" ] || continue
    rel_path="${f#$BASE_DIR/}"
    rel_path="${rel_path#./}"

    if ! spec_citation_path_in_scope "$rel_path"; then
      continue
    fi
    if spec_citation_path_in_skiplist "$rel_path"; then
      continue
    fi

    scan_content=$(spec_citation_strip_for_trigger_scan < "$f")

    while IFS=: read -r line_num match_rest; do
      [ -z "$line_num" ] && continue

      local_quote=$(extract_local_quote "$f" "$line_num")
      if [ -z "$local_quote" ]; then
        FAILURES+=("$rel_path:L$line_num — citation has no proximity quote within $SPEC_QUOTE_PROXIMITY_LINES lines")
        continue
      fi

      spec_id=$(extract_spec_id "$match_rest")
      [ -z "$spec_id" ] && continue

      spec_file=$(resolve_spec_file "$spec_id") || {
        FAILURES+=("$rel_path:L$line_num — cited spec $spec_id has no file at $BASE_DIR/docs/workspace-spec/${spec_id}-*.md")
        continue
      }

      normalised_quote=$(printf '%s' "$local_quote" | normalise_for_match)
      if [ -z "$normalised_quote" ]; then
        continue
      fi

      if ! normalise_for_match < "$spec_file" | grep -qF "$normalised_quote"; then
        preview=$(printf '%s' "$local_quote" | head -c 60)
        FAILURES+=("$rel_path:L$line_num — local quote '${preview}...' not found in cited spec $spec_id (${spec_file#$BASE_DIR/})")
      fi
    done < <(printf '%s' "$scan_content" | grep -nE "$SPEC_QUOTE_TRIGGER_REGEX" || true)
  done
done

if [ ${#FAILURES[@]} -gt 0 ]; then
  printf 'spec-citation-quote-check: %d violation(s)\n' "${#FAILURES[@]}" >&2
  for failure in "${FAILURES[@]}"; do
    printf '  - %s\n' "$failure" >&2
  done
  printf '\nResolve by either:\n' >&2
  printf '  (a) replacing the local quote with verbatim text from the cited spec, or\n' >&2
  printf '  (b) reframing the citation as a doc-pointer (e.g. `spec 72d §5 amendment` rather than `per spec 72d`).\n' >&2
  exit 1
fi
exit 0
