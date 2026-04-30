#!/usr/bin/env bash
# spawn-multi-reviewer.sh — multi-agent persona suite orchestrator (aggregator).
#
# Subcommand: `aggregate <envelopes-dir>`
#
# Reads per-specialist envelope JSONs from `<envelopes-dir>/{security,
# architecture,correctness,style}.json` (one per specialist; produced
# upstream by the workflow's matrix-strategy `claude -p` invocations
# already piped through `auto-review-parse.sh`). Dedupes findings
# across specialists by tuple-based jq `group_by([.label, .category,
# (.evidence // "")[0:64]])` — equivalent to a SHA-256 hash over the
# same fields per spec 72c §5 rule 2; the impl uses jq's tuple
# group_by directly rather than computing a separate hash, so the
# output equality classes are identical to the spec's hash-based
# framing. Evidence chosen as the third tuple element (over summary)
# because personas don't emit per-finding summary per the established
# baseline; evidence is universally present and gives the strongest
# substantive-equivalence signal. Preserves originating specialists
# in `seen_by[]`; pipes the unified `{summary, findings[]}` envelope
# through `derive-verdict.sh --multi k=N` for the live verdict +
# shadow `would_have_been_k2` / `_k3` fields per spec 72c §5
# session-54 amendment.
#
# Output: a single unified JSON envelope to stdout, suitable as a
# drop-in replacement for the single-persona output that the existing
# `auto-review.yml` check-run + findings-comment steps already consume.
#
# Output shape:
#   {
#     summary: "multi-agent aggregate (k=1 default)",
#     findings: [{label, blocking, category, summary, evidence,
#                 remediation, seen_by: [specialist...]}, ...],
#     verdict: "block" | "request-changes" | "nit-only" | "approve" | "parse-failed",
#     would_have_been_k2: "<verdict>",
#     would_have_been_k3: "<verdict>",
#     degraded?: true,                       # present only when ≥1 specialist inconclusive
#     inconclusive_dimensions?: [string...]  # specialist names that failed to produce a valid envelope
#   }
#
# Failure modes:
#   - Specialist's envelope file missing OR file empty → that dimension marked `inconclusive`.
#   - Specialist's envelope file non-JSON or wrong shape (no `findings` array) → `inconclusive`.
#   - All four specialists inconclusive → verdict = `parse-failed` (sentinel; no specialist signal at all).
#   - Otherwise: aggregate the present specialists' findings; verdict computed via
#     `derive-verdict.sh --multi k=1`; degraded flag surfaces in output for
#     downstream visibility.
#
# Spec ref: docs/workspace-spec/72c-multi-agent-review-framework.md §3 + §5
#           (session-54 amendment); slice acceptance.md AC-1.
# Test contract: tests/shellspec/spawn-multi-reviewer.spec.sh.

set -euo pipefail

readonly DIMENSIONS=(security architecture correctness style)

usage() {
  printf 'usage: %s aggregate <envelopes-dir>\n' "$0" >&2
  exit 2
}

[ $# -ge 1 ] || usage

SUBCMD="$1"
shift

case "$SUBCMD" in
  aggregate)
    [ $# -eq 1 ] || usage
    DIR="$1"
    [ -d "$DIR" ] || { printf 'spawn-multi-reviewer.sh: directory not found: %s\n' "$DIR" >&2; exit 2; }
    ;;
  *)
    usage
    ;;
esac

PRESENT=()
INCONCLUSIVE=()
declare -A CONTENT

for DIM in "${DIMENSIONS[@]}"; do
  F="$DIR/$DIM.json"
  if [ ! -f "$F" ] || [ ! -s "$F" ]; then
    INCONCLUSIVE+=("$DIM")
    continue
  fi
  CONTENT[$DIM]=$(cat "$F")
  if printf '%s' "${CONTENT[$DIM]}" \
    | jq -e 'type == "object" and (.findings // null | type == "array")' >/dev/null 2>&1; then
    PRESENT+=("$DIM")
  else
    INCONCLUSIVE+=("$DIM")
    unset 'CONTENT[$DIM]'
  fi
done

# Dedup hash field is `evidence` (not `summary`) — personas don't emit
# per-finding summary per the established baseline (reviewer-{security,
# architecture,correctness,style}.md / acceptance-gate.md /
# ux-polish-reviewer.md output schemas); evidence
# is universally present and is a quoted-from-diff fragment that gives
# the strongest substantive-equivalence signal. Spec 72c §5 rule 2.
ALL_FINDINGS='[]'
for SPEC in "${PRESENT[@]}"; do
  ALL_FINDINGS=$(printf '%s\n%s' "$ALL_FINDINGS" "${CONTENT[$SPEC]}" | jq -cs --arg spec "$SPEC" '
    .[0] + ((.[1].findings // []) | map(. + {seen_by: [$spec]}))
  ')
done

DEDUPED_FINDINGS=$(printf '%s' "$ALL_FINDINGS" | jq -c '
  group_by([.label, .category, ((.evidence // "")[0:64])]) | map({
    label: .[0].label,
    blocking: any(.[]; .blocking == true),
    category: .[0].category,
    evidence: .[0].evidence,
    remediation: .[0].remediation,
    seen_by: (map(.seen_by[]) | unique)
  })
')

# All-inconclusive case short-circuits to parse-failed so an empty
# findings array isn't silently approved when the actual signal is
# "no specialist responded".
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DERIVE="$SCRIPT_DIR/derive-verdict.sh"

if [ ${#PRESENT[@]} -eq 0 ]; then
  VERDICT=parse-failed
  SHADOW_K2=parse-failed
  SHADOW_K3=parse-failed
else
  ENVELOPE=$(jq -cn --argjson f "$DEDUPED_FINDINGS" '{summary: "aggregate", findings: $f}')
  VERDICT=$(printf '%s' "$ENVELOPE" | "$DERIVE" --multi k=1)
  SHADOW_K2=$(printf '%s' "$ENVELOPE" | "$DERIVE" --multi k=2)
  SHADOW_K3=$(printf '%s' "$ENVELOPE" | "$DERIVE" --multi k=3)
fi

# `degraded` + `inconclusive_dimensions` surface only when ≥1
# specialist failed; preserves a clean output shape on the all-green
# path so downstream consumers don't render a misleading "degraded:
# false" marker on every successful aggregation.
INCONCLUSIVE_JSON='[]'
if [ ${#INCONCLUSIVE[@]} -gt 0 ]; then
  INCONCLUSIVE_JSON=$(printf '%s\n' "${INCONCLUSIVE[@]}" | jq -R -s 'split("\n") | map(select(length > 0))')
fi

DEGRADED=false
[ ${#INCONCLUSIVE[@]} -gt 0 ] && DEGRADED=true

jq -n \
  --argjson findings "$DEDUPED_FINDINGS" \
  --arg verdict "$VERDICT" \
  --arg shadow_k2 "$SHADOW_K2" \
  --arg shadow_k3 "$SHADOW_K3" \
  --argjson degraded "$DEGRADED" \
  --argjson inconclusive "$INCONCLUSIVE_JSON" \
  '{
    summary: "multi-agent aggregate (k=1 default)",
    findings: $findings,
    verdict: $verdict,
    would_have_been_k2: $shadow_k2,
    would_have_been_k3: $shadow_k3
  } + (if $degraded then {degraded: true, inconclusive_dimensions: $inconclusive} else {} end)'
