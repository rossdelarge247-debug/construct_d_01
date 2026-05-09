#!/usr/bin/env bash
# scripts/decode-bundler-canvas.sh — decode a bundled-HTML canvas export
# to its readable inner HTML+CSS form.
#
# Per docs/slices/S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates/acceptance.md AC-1.
# A bundled-HTML canvas (~5MB) wraps the real inner doc as a JSON-encoded
# string inside `<script type="__bundler/template">"<!DOCTYPE html>..."</script>`.
# Without decoding, grep-on-canvas reads the loader-shell CSS instead of the
# actual visual treatment — the failure mode this slice prevents.

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

# Extract `<script type="__bundler/template">JSON_STRING</script>` content.
# awk handles arbitrary line counts via state — content may span lines if
# pretty-printed, but typical exports keep the JSON-string on one line.
TEMPLATE=$(printf '%s' "$HTML" | awk '
  BEGIN { in_template = 0 }
  {
    if (in_template) {
      end = index($0, "</script>")
      if (end > 0) { printf "%s", substr($0, 1, end - 1); exit }
      printf "%s\n", $0
      next
    }
    start = index($0, "<script type=\"__bundler/template\">")
    if (start > 0) {
      rest = substr($0, start + length("<script type=\"__bundler/template\">"))
      end = index(rest, "</script>")
      if (end > 0) { printf "%s", substr(rest, 1, end - 1); exit }
      printf "%s\n", rest
      in_template = 1
    }
  }
')

if [ -z "$TEMPLATE" ]; then
  printf 'decode-bundler-canvas: no <script type="__bundler/template"> in input\n' >&2
  exit 1
fi

# `jq -r .` on a JSON-encoded string returns the unescaped content.
if ! DECODED=$(printf '%s' "$TEMPLATE" | jq -r . 2>/dev/null); then
  printf 'decode-bundler-canvas: failed to JSON-parse __bundler/template content\n' >&2
  exit 1
fi
if [ -z "$DECODED" ]; then
  printf 'decode-bundler-canvas: empty decoded content\n' >&2
  exit 1
fi

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
