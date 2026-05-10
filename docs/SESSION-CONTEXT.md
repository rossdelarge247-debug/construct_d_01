# Session 83 Pre-flight Context Block (carrying session 82 wrap delta)

## Session 82 wrap delta — read this first

Session 82 executed the SESSION-CONTEXT-recommended sequence in full: P3 cleanup ship → P1 canvas inspection → P2 scaffold ship → wrap. Two PRs open + one wrap PR:

- **PR #139** (P3 cleanup) — addresses the 5 advisory findings deferred at PR #137 ship: preflight arg-order fix (1L) + 3 comment trims (auto-review.yml + run-synthetic.sh) + verbatim-quote audit on 4 load-bearing slice doc spec-refs. Auto-review verdict: `request-changes` (advisory) with 2 findings; both verified non-actionable, replied with parser line-refs + grep evidence. CI: 22/22 ✓.
- **PR #140** (draft) — `S-PROTO-canvas-fidelity-rebuild` slice scaffold (acceptance + verification + security + test-plan). 4 ACs, one per calibration finding, each carrying verbatim Pre-signup Canvas L-refs per AC-as-canvas-quote discipline. **Canvas-fidelity gate fired live for first time** — 9 findings across 4 specialists; 5 addressed in `0f53cea`; 1 substantive bug deferred (orchestrator word-splits on spaces in canvas paths); 3 informational praise/note.
- **PR #X** (this wrap, opening at session close) — calibration-report `§Status` first-run append + SESSION-CONTEXT refresh + HANDOFF-82.

**Calibration takeaway from gate's first live run:** Persona-prompt design works (praise on AC-as-canvas-quote discipline, calibration-report mapping holds). Persona surfaced an orchestrator bug via a `question · missing-element` finding rather than a false positive — the kind of self-aware diagnostic we want during the calibration window. Findings 1-4 + speculative findings NOT surfaced because (a) scaffold PR has no `src/` to compare and (b) the empty `<linked-canvas-NONCE>` fence (orchestrator bug) prevented canvas-side comparison anyway. Meaningful calibration needs the impl PR + the workflow fix.

## Session 83 priorities

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Fix orchestrator bug — empty linked-canvas fence** | `.github/workflows/auto-review.yml` `brief.compose`: `for CANVAS_PATH in $CANVAS_PATHS` word-splits on spaces. Fix: split on newlines (set `IFS=$'\n'`) or use array assignment. Critical for impl PR's gate firing. ~5L workflow change + shellspec coverage if testable. | Light | No |
| 2 | **`S-PROTO-canvas-fidelity-rebuild` impl** | Consume PR #140 scaffold → implement `ScreenShell.tsx` (TitleShape + back-button + divider) · `SubQuestionCard.tsx` (serif label) · `ProgressPill.tsx` (rename + reshape from `ProgressChip.tsx`) · per-screen copy resolvers (structured-title support) · unit + integration tests. Preview-deploy 6-dim verification. Canvas-fidelity gate re-fires meaningfully once orchestrator bug is fixed. ~400-500L impl + tests. | Heavy | Yes — depends on P1 |
| 3 | **Merge backlog** | PR #139 (P3 cleanup) + PR #140 (rebuild scaffold, after marking ready-for-review) + session-82 wrap PR. CODEOWNERS solo-operator gate via admin-bypass. | Light | No |
| 4 | **(Stretch) Resolve spec 72c §7 divergence** | PR #139's audit surfaced: spec 72c §7 L130+L142 say synthetic-deliberate-injection is deferred to v3c, but synthetic shipped in v3b (`S-INFRA-synthetic-fixtures` then `S-INFRA-canvas-fidelity-gate`). Either amend §7 (synthetic flipped to v3b primary) OR add divergence-acknowledgement to the affected slice docs. ~15-30L. | Medium | No |

**Recommended sequence:** P1 (orchestrator fix) → P3 (merge backlog including session-82 PRs) → P2 (impl). P1 unblocks meaningful gate calibration on the impl PR's auto-review verdict.

## Authoritative reading order at session 83 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-82.md` (last session's retro including gate's first-run calibration analysis).
3. `docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` `§Status` (first-run append landing this wrap).
4. `docs/slices/S-PROTO-canvas-fidelity-rebuild/acceptance.md` (4 ACs to implement — verbatim canvas quotes).
5. `.github/workflows/auto-review.yml` lines around L181-L200 (brief.compose canvas-fidelity branch — the orchestrator bug location).

## Session 83 kickoff prompt (paste-ready)

```
Kick off session 83.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- 2 open PRs from session 82: #139 (P3 cleanup) +
  #140 draft (rebuild scaffold). Wrap PR opening at
  session-82 close.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-82.md.
3. docs/slices/S-PROTO-canvas-fidelity-rebuild/acceptance.md
   (the impl spec — 4 ACs with verbatim canvas quotes).

Confirm priority with user. SESSION-CONTEXT recommends
P1 (orchestrator fix ~5L) → P3 (merge backlog) → P2
(rebuild slice impl ~400-500L). User may pick different.

If P1 (orchestrator fix): the bug is in
.github/workflows/auto-review.yml brief.compose loop
`for CANVAS_PATH in $CANVAS_PATHS` — word-splits on
spaces. Canvas filenames contain spaces (e.g.
"Pre-signup Canvas - Standalone.html"). Fix: split on
newlines (IFS=$'\n') or array assignment. Verify by
running auto-review on a PR with the fixed workflow.

If P2 (rebuild impl): verify P1 has merged first
(impl gate firing depends on it). Then implement
the 4 ACs against Pre-signup Canvas verbatim
references documented in acceptance.md. Preview-deploy
6-dim verification per spec 72a rubric.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind via CSS variables · S-F1 token system at `src/styles/tokens.ts` (75 entries) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 83 branch: harness-suffixed off clean main. PRs #139 + #140 + session-82-wrap may still be open at session 83 start; resync per CLAUDE.md §"Branch-resume check" if landed on a different base.

## Negative constraints (preserve)

#1-#39 from prior sessions. **No new constraints session 82.**

## Scope ceiling

Session 83 is most likely P1 (orchestrator fix) + P3 (merge backlog) + start of P2 (rebuild impl scoping then begin TDD). Out of scope unless explicitly added: the public-pages nav-bar reconciliation (separate concern) · `Decouple.zip` unpacking · spec 65 amendments to capture quantitative profiling data · O7-O8 + Welcome Tour + Mobile/Desktop responsive variants + Help Rail + Landing Page (all deferred to follow-up slices per session-82 user-confirmed Scope-A).

## Current pre-signup prototype URL

- Production (after session-80 squash deployed): `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
