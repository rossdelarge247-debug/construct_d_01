#!/usr/bin/env bash
# scripts/decode-bundler-canvas.sh — decode a bundled-HTML canvas export
# to its readable inner HTML+CSS form.
#
# A bundled-HTML canvas (~5MB) wraps the inner doc as a JSON-encoded string
# in `<script type="__bundler/template">"<!DOCTYPE html>..."</script>` and
# asset bytes (text/babel React source, fonts, images, CSS) keyed by UUID
# in `<script type="__bundler/manifest">{...}</script>`. The in-browser
# loader script (visible in any raw canvas) base64-decodes and gunzips
# manifest entries, converts them to blob URLs, and replaces UUID
# placeholders in the template. This script mirrors that loader for an
# offline-readable decoded sibling:
#
#   - text/babel|jsx scripts referenced as <script ... src="UUID"> are
#     inlined (manifest bytes become the script body; src attribute
#     dropped) so React source appears literally for grep on the decoded
#     sibling.
#   - All other UUIDs are replaced with self-contained `data:<mime>;base64`
#     URLs (assets the in-browser loader would have served from blob URLs).

set -uo pipefail

usage() {
  cat <<'EOF' >&2
usage: scripts/decode-bundler-canvas.sh <input.html | -> [--force] [--stdout]

Decode a bundled-HTML canvas export to its readable HTML+CSS form.

  <input.html>  path to bundled-HTML; - reads stdin (implies --stdout)
  --force       overwrite existing output if present
  --stdout      write decoded HTML to stdout instead of <dir>/decoded/<basename>
EOF
  exit 2
}

[ "$#" -eq 0 ] && usage

INPUT="$1"
shift

FORCE=0
STDOUT=0
for arg in "$@"; do
  case "$arg" in
    --force)  FORCE=1 ;;
    --stdout) STDOUT=1 ;;
    *) printf 'decode-bundler-canvas: unknown arg: %s\n' "$arg" >&2; exit 2 ;;
  esac
done

if [ "$INPUT" = "-" ]; then
  STDOUT=1
  HTML=$(cat)
else
  [ -f "$INPUT" ] || { printf 'decode-bundler-canvas: input not found: %s\n' "$INPUT" >&2; exit 1; }
  HTML=$(cat "$INPUT")
fi

# Extract `<script type="$marker">...</script>` body from $HTML.
# awk handles arbitrary line counts via state; typical exports keep the
# inner content on one line for template/manifest, multi-line for
# ext_resources. Empty stdout if the script tag is absent.
extract_block() {
  local marker="$1"
  printf '%s' "$HTML" | awk -v marker="<script type=\"$marker\">" '
    BEGIN { in_block = 0; ml = length(marker) }
    {
      if (in_block) {
        end = index($0, "</script>")
        if (end > 0) { printf "%s", substr($0, 1, end - 1); exit }
        printf "%s\n", $0
        next
      }
      start = index($0, marker)
      if (start > 0) {
        rest = substr($0, start + ml)
        end = index(rest, "</script>")
        if (end > 0) { printf "%s", substr(rest, 1, end - 1); exit }
        printf "%s\n", rest
        in_block = 1
      }
    }
  '
}

TEMPLATE=$(extract_block '__bundler/template')

if [ -z "$TEMPLATE" ]; then
  printf 'decode-bundler-canvas: no <script type="__bundler/template"> in input\n' >&2
  exit 1
fi

if ! DECODED=$(printf '%s' "$TEMPLATE" | jq -r . 2>/dev/null); then
  printf 'decode-bundler-canvas: failed to JSON-parse __bundler/template content\n' >&2
  exit 1
fi
if [ -z "$DECODED" ]; then
  printf 'decode-bundler-canvas: empty decoded content\n' >&2
  exit 1
fi

# ─── Manifest substitution ────────────────────────────────────────────────
# Skipped when manifest absent, empty, or carries no UUID-keyed entries —
# decoded output stays as the JSON-decoded template, matching the pre-fix
# behaviour for synthetic fixtures and shellspec test inputs.
MANIFEST=$(extract_block '__bundler/manifest')
MANIFEST_TRIMMED=$(printf '%s' "$MANIFEST" | tr -d ' \t\n\r')

UUIDS=""
if [ -n "$MANIFEST_TRIMMED" ]; then
  UUIDS=$(printf '%s' "$MANIFEST" | jq -r '
    keys_unsorted
    | map(select(test("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")))
    | .[]
  ' 2>/dev/null) || UUIDS=""
fi

if [ -n "$UUIDS" ]; then
  TMPDIR_DEC=$(mktemp -d)
  trap 'rm -rf "$TMPDIR_DEC"' EXIT INT TERM

  while IFS= read -r uuid; do
    [ -z "$uuid" ] && continue

    data=$(printf '%s' "$MANIFEST" | jq -r --arg u "$uuid" '.[$u].data // empty')
    mime=$(printf '%s' "$MANIFEST" | jq -r --arg u "$uuid" '.[$u].mime // "application/octet-stream"')
    compressed=$(printf '%s' "$MANIFEST" | jq -r --arg u "$uuid" '.[$u].compressed // false')

    [ -z "$data" ] && continue

    bin="$TMPDIR_DEC/$uuid.bin"

    if [ "$compressed" = "true" ]; then
      if ! printf '%s' "$data" | base64 -d 2>/dev/null | gunzip > "$bin" 2>/dev/null; then
        # Python3 fallback — base64 piped through gzip in pure bash can
        # mishandle binary at process boundaries on some environments;
        # python3's gzip module is the same algorithm and safer.
        if ! printf '%s' "$data" | python3 -c '
import sys, base64, gzip
sys.stdout.buffer.write(gzip.decompress(base64.b64decode(sys.stdin.read())))
' > "$bin" 2>/dev/null; then
          printf 'decode-bundler-canvas: failed to decode/gunzip asset %s\n' "$uuid" >&2
          continue
        fi
      fi
      final_b64=$(base64 -w0 < "$bin")
    else
      printf '%s' "$data" | base64 -d > "$bin"
      final_b64="$data"
    fi

    # Detect text/babel|jsx tag with src="UUID" (either attribute order).
    # Bundler output keeps script tags single-line, so grep -oE suffices.
    babel_tag=$(printf '%s' "$DECODED" \
      | grep -oE "<script[^>]*type=\"text/(babel|jsx)\"[^>]*src=\"$uuid\"[^>]*></script>|<script[^>]*src=\"$uuid\"[^>]*type=\"text/(babel|jsx)\"[^>]*></script>" \
      | head -1)

    if [ -n "$babel_tag" ]; then
      decoded_text=$(cat "$bin")
      replacement="<script type=\"text/babel\">${decoded_text}</script>"
      DECODED=${DECODED//"$babel_tag"/"$replacement"}
    fi

    DATA_URL="data:$mime;base64,$final_b64"
    DECODED=${DECODED//"$uuid"/"$DATA_URL"}
  done <<<"$UUIDS"

  # Strip integrity/crossorigin to mirror the loader: SRI was computed over
  # the manifest's pre-substitution bytes and would reject blob/data URLs
  # from a null origin.
  DECODED=$(printf '%s' "$DECODED" \
    | sed -E 's/[[:space:]]+integrity="[^"]*"//gI; s/[[:space:]]+crossorigin="[^"]*"//gI')
fi
# ──────────────────────────────────────────────────────────────────────────

if [ "$STDOUT" -eq 1 ]; then
  printf '%s' "$DECODED"
  exit 0
fi

DIR=$(dirname "$INPUT")
BASE=$(basename "$INPUT")
OUT="$DIR/decoded/$BASE"

if [ -e "$OUT" ] && [ "$FORCE" -eq 0 ]; then
  printf 'decode-bundler-canvas: output exists at %s; use --force to overwrite\n' "$OUT" >&2
  exit 1
fi

mkdir -p "$DIR/decoded"
printf '%s' "$DECODED" >| "$OUT"
printf 'decoded → %s\n' "$OUT" >&2
