#!/usr/bin/env bash
# scripts/spec-citation-patterns.sh — shared catalogue for the spec-citation gates.
#
# Drift between author-time hook and merge-time CI mirror would suppress real
# findings at one layer or fire false positives at the other. Sourcing the regex
# from this single file is the single point of truth.

# Citation trigger forms (claim, not doc-pointer):
#   - `per spec NN[a]` / `Per spec NN[a]`             — per-cite (any optional letter suffix: 72c, 72d, etc.)
#   - `spec NN[a] §"section"` / `Spec NN[a] §"..."`   — sectioned-with-quoted-name
#
# Numeric §-numbers (e.g. `spec 72d §5`) and bare `spec NN` are doc-pointers,
# not claims — they do NOT trigger.
#
# Case-insensitive in the anchor word ([Pp]er, [Ss]pec) because authors mix
# sentence-start capitalisation with mid-sentence lowercase.
SPEC_QUOTE_TRIGGER_REGEX='([Pp]er[[:space:]]+[Ss]pec[[:space:]]+[0-9]+[a-z]?|[Ss]pec[[:space:]]+[0-9]+[a-z]?[[:space:]]+§"[^"]+")'

# Proximity rule: a literal quote must appear within this many lines after the
# trigger, with at least this many characters between markers.
SPEC_QUOTE_PROXIMITY_LINES=5
SPEC_QUOTE_MIN_CHARS=20

# Path filter: only scan slice docs + workspace specs.
spec_citation_path_in_scope() {
  case "$1" in
    docs/slices/S-*/*.md)        return 0 ;;
    docs/workspace-spec/*.md)    return 0 ;;
    *)                           return 1 ;;
  esac
}

# Skip-list: lineage-purpose docs whose citation patterns are routinely
# informal because lineage IS the file's purpose.
spec_citation_path_in_skiplist() {
  case "$1" in
    docs/HANDOFF-SESSION-*.md)   return 0 ;;
    docs/SESSION-CONTEXT.md)     return 0 ;;
    *)                           return 1 ;;
  esac
}

# Strip §Status sections + blockquote lines + fenced-code lines from content
# (replace with empty lines so line-numbering survives for proximity checks).
# Stdin → stdout.
spec_citation_strip_for_trigger_scan() {
  awk '
    /^```/      { fence = !fence; print ""; next }
    fence       { print ""; next }
    /^## (§)?Status/ { in_status = 1; print ""; next }
    /^## / && in_status { in_status = 0 }
    in_status   { print ""; next }
    /^>/        { print ""; next }
    { print }
  '
}

# Returns 0 if a literal quote satisfying the rule exists within the next
# SPEC_QUOTE_PROXIMITY_LINES after the given trigger line.
# Args: $1 = trigger line number (1-indexed); content piped on stdin.
spec_citation_has_proximity_quote() {
  local trigger_line="$1"
  awk -v start="$trigger_line" -v window="$SPEC_QUOTE_PROXIMITY_LINES" -v min="$SPEC_QUOTE_MIN_CHARS" '
    {
      if (/^```/) { in_fence = !in_fence; if (NR > start && NR <= start + window) next; next }
      if (NR <= start) next
      if (NR > start + window) exit
      if (in_fence) {
        if (length($0) >= min) { found = 1; exit }
        next
      }
      if (/^>/) {
        line = $0
        sub(/^>[[:space:]]*/, "", line)
        gsub(/^[*_"]+|[*_"]+$/, "", line)
        if (length(line) >= min) { found = 1; exit }
      }
    }
    END { exit (found ? 0 : 1) }
  '
}
