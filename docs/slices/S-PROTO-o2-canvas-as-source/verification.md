# S-PROTO-o2-canvas-as-source · verification

Prototype-category slice. DoD-14 short-form (items 1, 8, 12, 14); spec 76 §3 short-form mapping.

## AC-1 — O2 page IS the canvas

Evidence: `src/app/dev/proto/pre-signup-interview/screens/O2.tsx` after this slice imports neither `ScreenShell` nor `SubQuestionCard` nor `ProgressPill` nor `TitleShape`. Diff verifies the absence of those imports. Page renders the canvas A1 visual structure inline (TopBar with back link + step rail + spacer · Hero with eyebrow + italicised-accent H2 · 4 stacked cards each containing a SubLabel + ChipRow · Footer with answered-count + Continue CTA).

Status: TBD pending impl.

## AC-2 — 5-step adapt applied

Evidence: per-step file refs.

- **Step 1 (tokenise colours):** mapping table in O2.tsx top: `tokens.color.ink` for INK · `tokens.color.text.sub` (or equivalent) for SUB · etc. No raw hex literals in the page body. Reference: canvas color constants at `docs/design-source/pre-signup-interview/jsx/o2-frames.jsx` L6-14.
- **Step 2 (copy resolver):** `getCopy(stage)` consumed; literals from the canvas Q object (L97-118) backed by copy file fields. Eyebrow + heading + per-question label + option items all flow through the copy resolver.
- **Step 3 (state wiring):** `useProto()` consumed; `answers.situation` shape preserved; CTA enable logic derives from answered-count of 4 sub-questions.
- **Step 4 (Next.js wrapping):** `'use client'` directive present; `export function O2()` at the existing path.
- **Step 5 (inline helpers):** `Arrow`, `Chip`, `ChipRow`, `SubLabel`, `TopBar`, `Hero`, `Footer`, `StepRail` are inlined into the screen file (or co-located helpers). `MobileFrame` + status bar dropped (page IS the viewport).

Status: TBD pending impl.

## AC-3 — State continuity

Evidence: existing prototype regression check — navigate to `/dev/proto/pre-signup-interview?step=2` (or step through from O1), interact with each of the 4 sub-questions, observe answers persisted through navigation back/next, child-count reveal on `hasChildren=Yes`, CTA enabled iff all 4 answered. Check via preview-deploy + manual interaction.

Status: TBD pending preview-deploy.

## AC-4 — Shared components untouched

Evidence: diff scope is limited to O2.tsx + optional copy/o2.ts reshape + slice docs. ScreenShell.tsx, ProgressPill.tsx, SubQuestionCard.tsx, lib/types.ts (TitleShape type), and the copy files for O3-O6 are not modified. `grep -l ScreenShell src/app/dev/proto/pre-signup-interview/screens/` post-slice still finds O1, O3-O8.

Status: TBD pending impl.

## Preview-deploy verification

Six-dimension rubric (spec 72a) — prototype category preserves full visual rigour (spec 76 §3).

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | TBD | Navigate O1 → O2; answer all 4 sub-questions; child-count reveal; Continue → O3 |
| Edge cases | TBD | (a) skip-back from O2 → O1 with answers persisted; (b) toggle children Yes → No; (c) CTA stays disabled on partial answers |
| `prefers-reduced-motion` | TBD | Transitions on chip selection should respect `prefers-reduced-motion` (none required if canvas uses simple state transitions) |
| Keyboard-only | TBD | Tab through chips; Enter selects; Tab to Continue CTA; back arrow reachable |
| Mobile viewport (375×667) | TBD | Layout adapts; no horizontal scroll; cards stack vertically |
| Screen-reader | TBD | StepRail announces "Step 2 of 8"; chips announce label + pressed state; CTA announces enable state |

## Definition of Done — prototype short-form (items 1, 8, 12, 14)

- [ ] **1.** All ACs met with evidence above
- [ ] **8.** Slice-DoD reference in PR body (`Slice references: docs/slices/S-PROTO-o2-canvas-as-source/verification.md`)
- [ ] **12.** Auto-review verdict: `approve` or `nit-only` on the impl PR
- [ ] **14.** Preview-deploy verified per 6-dim rubric above; user feedback received + addressed (or explicitly deferred)

## Architectural deferrals

Two canvas-faithful visual choices flagged by `reviewer-prototype-readiness` at PR-time auto-review against spec 72a 6-dim rubric (mobile-viewport + accessibility-visual dimensions). Both deferred to per-instance user feedback at preview-deploy rather than divergent-from-canvas fix:

- **Footer caption font-size: 10px** — canvas A1 Footer renders `X of 4 answered` at `fontSize: 10`. WCAG AA prefers ≥12px for normal text contrast certainty. Canvas-as-source rule (CLAUDE.md §"Visual direction") makes the canvas the source; divergence raised to user at preview-deploy. Persona-flagged finding: `accessibility-visual` issue, non-blocking.
- **Chip touch target: ~32px height; back button: ~13px** — canvas A1 Chip uses `padding: '9px 13px', fontSize: 12.5` (~32px rendered height); back button has `padding: 0` (~13px). Spec 72a mobile-viewport dimension expects ≥44×44 touch targets. Canvas-faithful values raised to user at preview-deploy. Persona-flagged finding: `mobile-viewport` issue, non-blocking.

Two further canvas-source mobile-only constraints surfaced at preview-deploy:

- **Outer width cap = 480px** added in round-2 (`w-full max-w-[480px] mx-auto` on the outer flex column). Matches `ScreenShell.tsx:33` `maxWidth: 480` so O1 (capped) → O2 (capped) → O3 (capped) navigation is consistent on desktop. The canvas literal was 375px (inside `MobileFrame`), but 480 matches the rest of the prototype today; the canvas-vs-rebuild width-cap delta is also deferred to the desktop-enhanced slice below.
- **Desktop-enhanced treatment (extra-space utilisation)** — `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html` exists and was identified as the cross-canvas reconciliation target for the desktop graceful-enhancement. Out of scope for this prototype pilot slice; deferred per constraint #41 (cross-canvas reconciliation per-instance). Future slice introduces Help Rail integration, intermediate breakpoints, and any width-cap reconciliation between mobile and desktop variants.

Test-pain audit cleared at impl: 8 tests written, 0 mocks required, well below the prototype-category threshold (>5 mocks per unit test triggers seam re-evaluation).

## Status

(Lineage appended at slice ship — final-state record only per CLAUDE.md §"Definition of Done" L1.)
