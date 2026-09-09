#!/usr/bin/env bash
# preflight-review.sh — local multi-agent review of pending changes
# against origin/main. Skips silently when ANTHROPIC_API_KEY is unset.
#
# Exit: 0 on approve / nit-only / request-changes / no-diff / skipped;
#       1 on block or parse-failed; 2 on usage error.

set -euo pipefail

BASE="${1:-origin/main}"
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT" || exit 2

if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  echo "preflight: ANTHROPIC_API_KEY not set; skipping (verdict: skipped)" >&2
  exit 0
fi

command -v jq >/dev/null 2>&1 || { echo "preflight: jq is required; skipping" >&2; exit 0; }

PREFLIGHT_DIR="$(mktemp -d -t preflight.XXXXXX)"
trap 'rm -rf "$PREFLIGHT_DIR"' EXIT
mkdir -p "$PREFLIGHT_DIR/briefs" "$PREFLIGHT_DIR/envelopes"

if ! git diff "${BASE}...HEAD" -- > "$PREFLIGHT_DIR/pr-diff.txt" 2>/dev/null; then
  echo "preflight: cannot diff against ${BASE}; ensure remote is fetched" >&2
  exit 0
fi
if [ ! -s "$PREFLIGHT_DIR/pr-diff.txt" ]; then
  echo "preflight: no diff between $BASE and HEAD; nothing to review" >&2
  exit 0
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
SLICE_AC=$(scripts/auto-review-slice-resolve.sh "$BRANCH" "" 2>/dev/null || true)

# Category-aware dimension list (mirrors auto-review.yml). Prototype slices
# substitute prototype-readiness for correctness per spec 76 §3.
# Canvas-fidelity (4th dimension) is CI-only — local preflight stays 3-dim
# because canvas content loading is wired in auto-review.yml's brief
# composition, not duplicated here.
CATEGORY="production"
if [ -n "${SLICE_AC:-}" ] && [ -f "$SLICE_AC" ]; then
  OVERRIDE=$(grep -E '^\*\*Category:\*\*[[:space:]]+(prototype|production|infrastructure)$' "$SLICE_AC" | head -1 || true)
  if [ -n "$OVERRIDE" ]; then
    CATEGORY=$(printf '%s' "$OVERRIDE" | sed -E 's/^\*\*Category:\*\*[[:space:]]+//; s/[[:space:]]*$//')
  fi
fi
case "$CATEGORY" in
  prototype) DIMS=(security prototype-readiness style) ;;
  *)         DIMS=(security correctness style) ;;
esac

for DIM in "${DIMS[@]}"; do
  NONCE=$(openssl rand -hex 16)
  {
    cat ".claude/agents/reviewer-${DIM}.md"
    echo
    echo "Your per-invocation nonce: $NONCE"
    echo
    printf '<pr-diff-%s>\n' "$NONCE"
    cat "$PREFLIGHT_DIR/pr-diff.txt"
    printf '</pr-diff-%s>\n\n' "$NONCE"
    if [ -n "${SLICE_AC:-}" ] && [ -f "$SLICE_AC" ]; then
      printf '<slice-ac-%s>\n' "$NONCE"
      cat "$SLICE_AC"
      printf '</slice-ac-%s>\n\n' "$NONCE"
    fi
    printf '<coding-conduct-%s>\n' "$NONCE"
    awk '/^## Coding conduct/,/^## Engineering conventions/' CLAUDE.md | head -n -1
    printf '</coding-conduct-%s>\n' "$NONCE"
  } > "$PREFLIGHT_DIR/briefs/${DIM}.txt"
done

echo "preflight: spawning ${#DIMS[@]} specialists in parallel ($CATEGORY category)..." >&2

for DIM in "${DIMS[@]}"; do
  (
    set +e
    npx -y @anthropic-ai/claude-code@2.1.126 -p --output-format=json \
      < "$PREFLIGHT_DIR/briefs/${DIM}.txt" > "$PREFLIGHT_DIR/raw-${DIM}.json" 2>"$PREFLIGHT_DIR/raw-${DIM}.stderr"
    scripts/auto-review-parse.sh < "$PREFLIGHT_DIR/raw-${DIM}.json" > "$PREFLIGHT_DIR/envelopes/${DIM}.json" 2>>"$PREFLIGHT_DIR/raw-${DIM}.stderr"
  ) &
done
wait

DIMS_CSV=$(IFS=,; echo "${DIMS[*]}")
AGGREGATE_JSON=$(scripts/spawn-multi-reviewer.sh aggregate "$PREFLIGHT_DIR/envelopes" --dimensions "$DIMS_CSV") || {
  echo "preflight: aggregator failed" >&2
  exit 1
}
VERDICT=$(printf '%s' "$AGGREGATE_JSON" | jq -r '.verdict')
FINDINGS_COUNT=$(printf '%s' "$AGGREGATE_JSON" | jq '.findings | length')

echo
case "$VERDICT" in
  approve)         echo "preflight verdict: approve ($FINDINGS_COUNT finding(s))" ;;
  nit-only)        echo "preflight verdict: nit-only ($FINDINGS_COUNT finding(s))" ;;
  request-changes) echo "preflight verdict: request-changes ($FINDINGS_COUNT finding(s); informational at v3b ship)" ;;
  block)           echo "preflight verdict: block ($FINDINGS_COUNT finding(s); merge gate)" ;;
  parse-failed)    echo "preflight verdict: parse-failed (all 3 specialists unparseable; merge gate)" ;;
  *)               echo "preflight verdict: $VERDICT" ;;
esac

if [ "$FINDINGS_COUNT" -gt 0 ]; then
  echo
  printf '%s' "$AGGREGATE_JSON" | jq -r '
    .findings[] |
    "  [\(.label)\(if .blocking then " (BLOCKING)" else "" end)] \(.category) (seen by \(.seen_by | join(", "))):\n    Evidence: \((.evidence // "") | gsub("\n"; " ") | .[0:200])\n    Fix: \((.remediation // "") | gsub("\n"; " ") | .[0:200])\n"
  '
fi

case "$VERDICT" in
  block|parse-failed) exit 1 ;;
  *)                  exit 0 ;;
esac
