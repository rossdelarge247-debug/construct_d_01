# Session 84 Pre-flight Context Block (carrying session 83 wrap delta)

## Session 83 wrap delta — read this first

Session 83 shipped two PRs addressing the canvas-fidelity orchestrator's first live exercise + downstream sizing constraint. Both originated from the same source: PR #140's `Linked canvas:` field declaring `Pre-signup Canvas - Standalone.html` (path with 3 spaces), surfacing a word-split bug at session 81's ship + a follow-on canvas-too-large rejection on Anthropic API.

**PR #142 — `fix(auto-review): canvas-fidelity orchestrator handles paths-with-spaces`** — merged at `2f8bc48`. Single-canvas-per-slice convention. Drops the loop in `auto-review.yml` `brief.compose` step; renames `CANVAS_PATHS` → `CANVAS_PATH`; quotes at every consumer site. Aligned across 3 surfaces (workflow + CLAUDE.md + persona file).

**PR #143 — `fix(auto-review): restore multi-canvas support with comma-separator`** — open + approved at session wrap (CI 25/25 success, auto-review round-2 verdict `approve`). Same-session reversal of PR #142's single-canvas convention after data-driven recalibration. PR #140's re-fire on post-#142 main proved the orchestrator fix worked but surfaced a new failure mode: canvas-fidelity persona crashed at 11s with no diagnostic output (claude -p exit code 1; stderr empty because `--output-format=json` mode writes errors to stdout which gets redirected; the diagnostic block at workflow L290-292 is gated behind `set -e` and never runs). Root cause: 10.8MB combined `Pre-signup Canvas - Standalone.html` exceeds Anthropic API per-request limits. Per-screen decoded HTML files (10-30KB each) fit comfortably; comma-separator multi-path syntax restored to support them.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-83.md`** — read for the full retro including the empty-runtime-stream signature that pinned down the failure mode and the route-2 trade-off matrix that informed the multi-canvas restoration.

## Session 84 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Verify PR #143 + handoff PR merge state** | If PR #143 still open, surface for user to merge — it's the multi-canvas workflow restoration that unblocks P2. The handoff PR (this session's wrap docs) similarly needs landing. Quick state check; 2 minutes. | Trivial | No |
| 2 | **Update PR #140's `Linked canvas:` to per-screen comma-separated files** | Replace single 10.8MB combined canvas with `o2-your-situation-expressive.html, o3-your-ex-and-safety-expressive.html, o4-employment-complexity-expressive.html, o5-partner-finances-expressive.html, o6-what-matters-to-you-expressive.html` (covers AC scope O2-O6). Re-quote the 4 ACs against per-screen line numbers — currently citing combined-canvas L941, L990, L1063-1066, L1079-1080. | Medium (read-heavy: locate the same elements in each per-screen file; line numbers differ) | Yes — depends on P1 |
| 3 | **Re-fire PR #140 auto-review post-update** | Capture canvas-fidelity persona's first real verdict against per-screen content. The 4 ACs map to S-INFRA-canvas-fidelity-gate's calibration findings 1-4; this is the calibration moment session 81 promised. Also informs persona's category × default-label/blocking matrix tuning. | Light (re-fire is mechanical; reading the verdict is the substantive step) | Yes — depends on P2 |
| 4 | **Workflow diagnostic-gate fix (small standalone PR)** | When `claude -p` fails the canvas-fidelity specialist job, the diagnostic block at L290-292 (`head -50 "/tmp/raw-${DIM}.json"`) never runs because `set -e` kills the shell first. Either (a) `|| true` on the npx call so the diagnostic always runs, or (b) also upload `/tmp/raw-${DIM}.json` as a debug artifact regardless of envelope status. Without this, the next failure is a black box. | Light (~10L workflow change) | No |
| 5 | **(Inherited) Spec 65 amendment to capture quantitative profiling data** | Still parked from earlier sessions. Out of scope unless explicitly added. | Heavy | No |

**Recommended sequence:** P1 (state-check) → P2 (slice update) → P3 (re-fire + verdict review) → P4 (diagnostic-gate fix opportunistically). P3 is the calibration moment that spec 81 has been pointing at since the gate slice merged.

## Authoritative reading order at session 84 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-83.md` (last session's retro — full diagnosis trail + decision rationale for the convention reversal).
3. `docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` (durable record of user feedback feeding the rebuild AC list — 4 structured findings + 6 speculative findings the gate's first-run is expected to surface).
4. `docs/slices/S-PROTO-canvas-fidelity-rebuild/acceptance.md` (PR #140's slice ACs that need re-quoting at per-screen line numbers — current line numbers cite combined-canvas).
5. **Per-screen decoded canvases** (when re-quoting ACs in P2): grep first for the cited element patterns (`<title>`, `<h1>`, italic `<span>`, header chrome, step-pill geometry), then targeted reads only. Per-screen files are 10-26KB so full reads are within budget but grep-first is still cheaper.

## Session 84 kickoff prompt (paste-ready)

```
Kick off session 84.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state (current branch +
  HEAD vs origin/main + ahead/behind + tree state).
- Branch convention: harness-suffixed (claude/<scope>-XXXXX). PR #142
  merged at 2f8bc48; PR #143 + handoff PR may or may not be merged at
  session 84 start — verify via mcp__github__list_pull_requests.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-83.md.
3. docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md.
4. docs/slices/S-PROTO-canvas-fidelity-rebuild/acceptance.md.

Confirm priority with user. SESSION-CONTEXT recommends sequence
P1 (state-check) → P2 (PR #140 slice update) → P3 (re-fire + verdict)
→ P4 (diagnostic-gate fix opportunistically). User may pick different
scope.

Definition of Done for the chosen priority:
- All ACs met with evidence per AC in verification.md.
- Tests written + passing where tractable.
- Auto-review verdict: approve / nit-only on the new PR.
- Preview-deploy verified in-browser if UI work.
- security.md item 12 stays Pending at PR open; closes Done
  post-verdict.

If P2 (PR #140 slice update) is the pick: this is the slice-author
work that completes the canvas-fidelity gate's first calibration
cycle. The persona's verdict on per-screen content becomes the
authoritative signal for whether the calibration-report's 4 findings
are correctly captured.

If P4 (diagnostic-gate fix) is the pick: small standalone PR. The
fix unblocks future canvas-fidelity job-failure diagnosis. Worth
shipping before the next persona's per-screen run so any new failure
mode is observable from the start.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind via CSS variables · S-F1 token system at `src/styles/tokens.ts` (75 entries) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 84 branch: harness-suffixed off clean main. PR #142 merged at `2f8bc48`; PR #143 + handoff PR landing TBD at session 84 start. Session 83 working branches deletable post-merge.

## Negative constraints (preserve)

#1-#39 from prior sessions. No new constraints session 83.

## Scope ceiling

Session 84 is most likely P1 (state-check) + P2 (PR #140 slice update) + P3 (re-fire + verdict capture) + P4 (diagnostic-gate fix opportunistically). Out of scope unless explicitly added: the public-pages nav-bar reconciliation (separate concern flagged session 81 turn 3) · `Decouple.zip` unpacking · spec 65 amendments to capture quantitative profiling data · O7-O8 fidelity rebuild (PR #140's slice scopes O2-O6 only per session 82 user-confirmed Scope-A).

## Current pre-signup prototype URL

- Production (after session-80 squash deployed): `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
