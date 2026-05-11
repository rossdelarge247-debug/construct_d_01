# S-PROTO-o2-canvas-as-source

**Category:** prototype

First src/ slice demonstrating the canvas-as-source pattern per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)". Re-does O2 ("Your situation") on top of the prior preserve-and-rebuild treatment, turning the page INTO the canvas via 5-step light adapt rather than rebuilding visual treatment from spec. The rebuild artefacts (`TitleShape` discriminated union, `ScreenShell` title rendering, `SubQuestionCard` label serif, `ScreenShell` header chrome, `ProgressPill`) remain in `src/` untouched — still serving O1, O3-O8 until those screens migrate to canvas-as-source. The slice's blast radius is `src/app/dev/proto/pre-signup-interview/screens/O2.tsx` and the copy file it consumes.

No `**Linked canvas:**` field is declared (canvas-fidelity persona stays dormant per CLAUDE.md §"Hard controls"). Per-AC evidence cites the source canvas path inline. Source canvas: `docs/design-source/pre-signup-interview/jsx/o2-frames.jsx` (frame A1 — "4 CARDS · stacked, one sub-question per card", L250-283).

## Pre-flight

Adversarial review budget per CLAUDE.md §"Engineering conventions" §"Adversarial review gate": single pass on the impl PR via auto-review (`acceptance.md` ≤300L → no partitioning). Auto-review fans out 3 default specialists (security, correctness, style); canvas-fidelity stays dormant (field-absent); `reviewer-prototype-readiness` substitutes `reviewer-correctness` per the prototype-category persona substitution in CLAUDE.md §"Slice categories".

## Acceptance criteria

### AC-1 — O2 page IS the canvas (no rebuild-component wrap)

`src/app/dev/proto/pre-signup-interview/screens/O2.tsx` renders the visual structure of canvas frame A1 directly: status-bar-less full viewport (the page is the page, not a phone bezel); top-of-screen `TopBar` with back link + step rail + spacer; `Hero` with eyebrow + serif H2 with italicised accent; 4 stacked cards each containing a `SubLabel` + `ChipRow`; bottom `Footer` with answered-count line + Continue CTA. The component does NOT import `ScreenShell`, `SubQuestionCard`, `ProgressPill`, or `TitleShape` from `../components/` (canvas IS the page). Canvas reference: `docs/design-source/pre-signup-interview/jsx/o2-frames.jsx` L250-283 (A1 frame).

### AC-2 — 5-step adapt applied per CLAUDE.md §"Canvas-as-source"

- **Step 1 — Tokenise hardcoded colours.** Canvas constants `INK`, `SUB`, `MUTE`, `LINE`, `DIS`, `VIOLET` mapped to `tokens.color.*` refs (existing S-F1 token system at `src/styles/tokens.ts`). No raw hex literals in the page body beyond what tokens don't yet cover.
- **Step 2 — Replace placeholder data.** Canvas literals ("Tell us about you", "Your situation.", "Relationship", "Married/Civil partnership/...", "X of 4 answered", "Continue") resolved via `getCopy(stage)` from `lib/copy/o2.ts`. Copy file is reshaped where needed to match the canvas's information model (eyebrow, heading with bold/italic structure, per-question label, per-question option list, child-count options, CTA caption).
- **Step 3 — Wire state.** Canvas's dummy `selectedIdx={0}` / `childCountVisible={false}` / `answered={4}` replaced with real state from `useProto()` (`answers.situation`, `setAnswer`, `next`, `back`, `step`). Chip clicks update the situation answer object; CTA enable logic derives from answered-count.
- **Step 4 — Next.js wrapping.** `'use client'` directive preserved (already present). Component export is `export function O2()`. Path unchanged at `src/app/dev/proto/pre-signup-interview/screens/O2.tsx`.
- **Step 5 — Inline canvas-local helpers OR adapt.** `Arrow`, `Chip`, `ChipRow`, `SubLabel`, `TopBar`, `Hero`, `Footer` inlined into the screen file (canvas-local, screen-specific treatment). `MobileFrame` and the "9:41" status bar are DROPPED (the page IS the viewport — the phone-bezel mockup is canvas presentation chrome, not screen content). `StepRail` inlined (do NOT substitute `ProgressPill` — canvas-as-source means the canvas's own rail wins).

### AC-3 — State continuity with existing prototype

The page consumes the same `useProto()` context and updates the same `answers.situation` shape as the prior O2. The 4 sub-question shapes preserved verbatim: `relationship` ∈ {Married, Civil partnership, Cohabiting, Other} · `living` ∈ {Yes, No, Complicated} · `hasChildren` ∈ {No, Yes} with conditional `childrenCount` reveal when `Yes` is picked · `home` ∈ {Own with mortgage, Own outright, Rent, Other}. CTA enables when all 4 are answered (matches canvas Footer variant `C1`). Back / Continue navigation calls existing `back()` / `next()` from context.

### AC-4 — Shared components untouched

`ScreenShell`, `ProgressPill`, `SubQuestionCard`, `TitleShape`, `RadioChips`, and the `lib/copy/o2.ts` consumers in `O3-O6` remain functionally intact. O1, O3-O8 still render via the existing `ScreenShell` wrapper. The copy file `lib/copy/o2.ts` may be re-shaped (its public API) to fit the canvas's information model, but if so, only O2 consumes its new shape — the change is self-contained.

## Out of scope

- Cross-canvas reconciliation with `docs/design-source/pre-signup-interview/Pre-signup Canvas - Standalone.html`. The canvas A1 frame's own `TopBar` is treated as the un-authenticated header for this slice (canvas IS the page; the canvas's own chrome wins). Diverging the header to match the Standalone canvas's treatment is preview-feedback iteration territory per CLAUDE.md §"Visual direction" §"Cross-canvas reconciliation (deferred per-instance to user)".
- O1, O3-O8 migration to canvas-as-source. Each will be its own slice. Shared components remain in `src/` until all consumers migrate.
- Removing shared components from `src/`. A separate cleanup slice can land after all screens migrate.
- Desktop graceful-enhancement header from the Desktop Help Rail canvas. Out of scope per constraint #41 (cross-canvas reconciliation deferred per-instance).

## Verification

See `verification.md`. Prototype-category DoD-14 short-form (items 1, 8, 12, 14 only) per spec 76 §3 + CLAUDE.md §"Definition of Done".
