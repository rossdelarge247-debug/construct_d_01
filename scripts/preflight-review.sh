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

WORK="$(mktemp -d -t preflight.XXXXXX)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$WORK/briefs" "$WORK/envelopes"

git diff "${BASE}...HEAD" -- > "$WORK/pr-diff.txt"
if [ ! -s "$WORK/pr-diff.txt" ]; then
  echo "preflight: no diff between $BASE and HEAD; nothing to review" >&2
  exit 0
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
SLICE_AC=$(scripts/auto-review-slice-resolve.sh "$BRANCH" "" 2>/dev/null || true)

for DIM in security architecture correctness style; do
  NONCE=$(openssl rand -hex 16)
  {
    cat ".claude/agents/reviewer-${DIM}.md"
    echo
    echo "Your per-invocation nonce: $NONCE"
    echo
    printf '<pr-diff-%s>\n' "$NONCE"
    cat "$WORK/pr-diff.txt"
    printf '</pr-diff-%s>\n\n' "$NONCE"
    if [ -n "${SLICE_AC:-}" ] && [ -f "$SLICE_AC" ]; then
      printf '<slice-ac-%s>\n' "$NONCE"
      cat "$SLICE_AC"
      printf '</slice-ac-%s>\n\n' "$NONCE"
    fi
    printf '<coding-conduct-%s>\n' "$NONCE"
    awk '/^## Coding conduct/,/^## Engineering conventions/' CLAUDE.md | head -n -1
    printf '</coding-conduct-%s>\n' "$NONCE"
  } > "$WORK/briefs/${DIM}.txt"
done

echo "preflight: spawning 4 specialists in parallel..." >&2

for DIM in security architecture correctness style; do
  (
    set +e
    npx -y @anthropic-ai/claude-code -p --output-format=json \
      < "$WORK/briefs/${DIM}.txt" > "$WORK/raw-${DIM}.json" 2>"$WORK/raw-${DIM}.stderr"
    scripts/auto-review-parse.sh < "$WORK/raw-${DIM}.json" > "$WORK/envelopes/${DIM}.json" 2>>"$WORK/raw-${DIM}.stderr"
  ) &
done
wait

AGGREGATE_JSON=$(scripts/spawn-multi-reviewer.sh aggregate "$WORK/envelopes")
VERDICT=$(printf '%s' "$AGGREGATE_JSON" | jq -r '.verdict')
FINDINGS_COUNT=$(printf '%s' "$AGGREGATE_JSON" | jq '.findings | length')

echo
case "$VERDICT" in
  approve)         echo "preflight verdict: approve ($FINDINGS_COUNT finding(s))" ;;
  nit-only)        echo "preflight verdict: nit-only ($FINDINGS_COUNT finding(s))" ;;
  request-changes) echo "preflight verdict: request-changes ($FINDINGS_COUNT finding(s); informational at v3b ship)" ;;
  block)           echo "preflight verdict: block ($FINDINGS_COUNT finding(s); merge gate)" ;;
  parse-failed)    echo "preflight verdict: parse-failed (all 4 specialists unparseable; merge gate)" ;;
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
