# Session 80 Pre-flight Context Block (carrying session 79 wrap delta)

## Session 79 wrap delta — read this first

Session 79 fixed `scripts/decode-bundler-canvas.sh` (PR #132 merged, `dcfa1c8`). The session-78 misdiagnosis ("external script refs didn't survive export") was wrong; the actual bug was a missing manifest-substitution step in the decoder. All 3 decoded siblings under `docs/design-source/pre-signup-interview/decoded/` are now self-contained (UUID count = 0; React inlined for o7; data: URLs for fonts/images on all three).

**Plus:** authored `docs/slices/S-PROTO-pre-signup-interview/o2-to-o6-canvas-prompts.md` — 5 paste-ready Claude-AI-Design prompts for the still-missing O2-O6 screens. With the existing `o8-canvas-prompt.md`, that's 6 prompts ready for canvas generation.

**Session 80 priorities (in order):**

- **P1 · User generates 6 canvases** via Claude AI Design using `docs/slices/S-PROTO-pre-signup-interview/o2-to-o6-canvas-prompts.md` (5 paste-ready blocks) + `docs/slices/S-PROTO-pre-signup-interview/o8-canvas-prompt.md` (1 prompt). Upload exports to `docs/design-source/pre-signup-interview/` with naming `o{N}-{slug}-expressive.html`.
- **P2 · Decode + verify** via `scripts/decode-bundler-canvas.sh <path>`. Per-canvas: `wc -l decoded/o{N}-…` ≥ 1000L AND `grep -aEc '<div'` ≥ 50 AND UUID count = 0. Any failure = canvas re-introduced the v1 failure mode → regenerate.
- **P3 · Refactor `src/app/dev/proto/pre-signup-interview/`** against the complete canvas set (O1 hero + O2-O6 calmer + O7 hero + O8 hero). Per-screen sign-off before any src/ write.
- **P4 (parked nits from PR #131):** F1 — rename `a: Answers` → `answers: Answers` in `lib/build-plan.ts`. F2 — drop count enumeration from `security.md` item 12.

## What's ready to be decoded NOW

| File | State | Decoded sibling | Action |
|---|---|---|---|
| `docs/design-source/pre-signup-interview/o1-stage-router-expressive.html` | ✅ Decoded · 1295L · 73 data: URLs · React inlined | ✅ Present | Refactor reference (entry hero) |
| `docs/design-source/pre-signup-interview/o1-stage-router-standalone.html` | ✅ Decoded · 1272L · 73 data: URLs | ✅ Present | Refactor reference (alt-bg variant) |
| `docs/design-source/pre-signup-interview/o7-your-plan-expressive.html` | ✅ Decoded · 2011L · 79 data: URLs · 127 `<div>` · 2 inline babel scripts | ✅ Present | Refactor reference (exit hero) |

## What's MISSING (canvas gaps to be generated)

| Screen | Spec 65 §ref | Canvas-prompt path | Canvas exists? |
|---|---|---|---|
| O2 — Your situation | §O2 | `o2-to-o6-canvas-prompts.md` §O2 | ❌ |
| O3 — Your ex and safety | §O3 | `o2-to-o6-canvas-prompts.md` §O3 | ❌ |
| O4 — Employment complexity | §O4 | `o2-to-o6-canvas-prompts.md` §O4 | ❌ |
| O5 — Partner finances | §O5 | `o2-to-o6-canvas-prompts.md` §O5 | ❌ |
| O6 — What matters to you | §O6 | `o2-to-o6-canvas-prompts.md` §O6 | ❌ |
| O8 — What's next | §O8 | `o8-canvas-prompt.md` (full file is the prompt) | ❌ |

## Authoritative reading order at session 80 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-79.md` (last session's retro).
3. **Spec 65** `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §"The 8 screens" lines 31-160 — content scope per screen.
4. **Spec 76** `docs/workspace-spec/76-prototype-mode-rigour.md` §3 — prototype-category gate calibration.
5. **Spec 72a** `docs/workspace-spec/72a-preview-deploy-rubric.md` — 6-dim preview-deploy verification.
6. The 4 slice docs at `docs/slices/S-PROTO-pre-signup-interview/`: `acceptance.md` · `security.md` · `test-plan.md` · `verification.md`.
7. The 6 canvas prompts: `o2-to-o6-canvas-prompts.md` (5 sections) + `o8-canvas-prompt.md`.
8. The 3 working decoded canvases under `docs/design-source/pre-signup-interview/decoded/` — skim in sections per CLAUDE.md read-discipline.

## Session 80 kickoff prompt (paste-ready)

```
Kick off session 80.

P1 priorities: (a) generate the 6 missing canvases and upload them,
(b) decode + verify, (c) begin the src/ refactor against the complete
canvas set.

Turn-0 verification:
- SessionStart hook surfaces live branch state. Confirm origin/main tip
  is post-#132 (`dcfa1c8` or later wrap commits).
- ls docs/design-source/pre-signup-interview/ — note which o{N}-…html
  files exist now vs the SESSION-CONTEXT.md "What's MISSING" table. The
  user may have uploaded some/all between sessions.
- For any newly-uploaded canvas: run `scripts/decode-bundler-canvas.sh
  <path>` and verify the decoded sibling per thresholds (≥1000L · ≥50
  <div> · UUID = 0).

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-79.md.
3. docs/workspace-spec/65-pre-signup-interview-reconciled.md §"The 8
   screens" (lines 31-160).
4. docs/slices/S-PROTO-pre-signup-interview/{acceptance,security,
   test-plan,verification}.md.
5. docs/slices/S-PROTO-pre-signup-interview/o2-to-o6-canvas-prompts.md +
   o8-canvas-prompt.md — inspect for accuracy before user generates.
6. The 3 working decoded canvases under
   docs/design-source/pre-signup-interview/decoded/ (skim in sections).

Before src/ refactor begins, confirm with the user:
1. Are all 6 missing canvases uploaded? If yes, decode + verify all.
2. If only some are uploaded, refactor only those screens; document the
   gap for a future session.
3. If none are uploaded, the session pauses for the user to generate via
   Claude AI Design using the prompts in docs/slices/S-PROTO-pre-signup-
   interview/.

Refactor approach:
- Per-screen, in spec-65 order (O1 → O8). Each screen: read decoded
  sibling, identify visual treatment beats, propose the refactor diff,
  get user sign-off, then write src/.
- Inherit O1 canon for shared atoms (RadioCard, ScreenShell, ProgressChip,
  PrimaryCTA, BackgroundShell, BgToggle).
- Calmer EXPRESSIVE_BG for O2-O6 per the o1 canon footer.
- Token discipline: consume tokens.color.* from src/styles/tokens.ts
  (S-F1) where canvas hex matches; prototype-local CSS variables scoped
  to the page for expressive-only additions (slice acceptance.md §AC-3).

Prototype-category gates that fire on the refactor PR (spec 76 §3):
- TDD-guard skips for /dev/proto/<literal>/** paths.
- DoD-14 short-form: items 1, 8, 12, 14.
- Preview-deploy 6-dim runs in full per spec 72a.
- reviewer-prototype-readiness substitutes reviewer-correctness post-PR.

Definition of Done for the session:
- All 6 newly-generated canvases decoded + verified clean.
- src/ refactored against the complete 8-screen canvas set OR a deferral
  documented per partial-coverage scenario above.
- F1 + F2 nits from PR #131 addressed or explicitly deferred.
- verification.md §"Preview-deploy verification" populated for all 6 dims.
- Auto-review verdict on the new PR is `approve` or `nit-only`.

Branch convention: per CLAUDE.md §"Branch", harness lands on a suffixed
branch. If a non-suffixed canonical exists on origin, follow §"Branch-
resume check" recipe.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. The unique claim is "the only place where both parties build one evidence-backed, shared picture." Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind via CSS variables · S-F1 token system at `src/styles/tokens.ts` · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 80 branch: harness-suffixed (e.g. `claude/session-80-…`). Confirm at turn-0 via SessionStart hook.

## Negative constraints (preserve)

#1-#39 from prior sessions. No new constraints session 79.

**Future-add candidate** (logged session 78, deferred session 79): "After decoding any bundled-HTML canvas, verify decoded sibling carries layout-bearing JSX (≈1000+ lines + 50+ `<div>` elements) — not CSS only." Now embedded in `o2-to-o6-canvas-prompts.md` §"After Claude AI Design exports each canvas" as the verification step. Promote to CLAUDE.md constraint #40 if session 80+ shows the per-canvas verification is being missed.

## Scope ceiling

Session 80 is canvas generation + verification + refactor. Out of scope: spec changes · CLAUDE.md constraint additions · auto-review persona retain/drop verdicts (calibration cohort still at row 1 — `S-PROTO-hub` — until 3 src/ slices ship).
