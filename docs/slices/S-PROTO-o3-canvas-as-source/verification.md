# S-PROTO-o3-canvas-as-source · verification

Prototype-category slice. DoD-14 short-form (items 1, 8, 12, 14); spec 76 §3 short-form mapping.

## AC-1 — O3 page IS the canvas

Evidence: `src/app/dev/proto/pre-signup-interview/screens/O3.tsx` after this slice imports neither `ScreenShell` nor `RadioCard` nor `RadioChips` nor `TitleShape`. Diff verifies the absence of those imports. Page renders the canvas `ResolvedFrame` visual structure inline: outer flex column with `max-w-[480px] mx-auto` · `<BrandBar>` + bespoke `TopBar` (Back + `<ProgressPill>` + spacer + bottom border) · Hero (eyebrow + serif H2 plain text) · relationship `<fieldset>` (4 `<RelRow>` chip-cards) · privacy section (preamble + label + 2 `<PrivPill>` inline) · footer chassis (cream + blur + 3-state caption + dark pill CTA).

Status: TBD pending impl.

## AC-2 — 5-step adapt applied

Evidence: per-step file refs.

- **Step 1 (tokenise colours):** O3.tsx top maps INK/SUB/MUTE/LINE/VIOLET via `tokens.color.*` refs. No raw hex literals in the page body. Reference: canvas color constants used at L86-88, L100-106, L135-137, L171-176, L187.
- **Step 2 (copy resolver):** `getCopy(stage)` consumed; canvas literals (eyebrow + heading + 4 REL_OPTIONS + privacy preamble + label + 2 PrivPill labels + 3-state captions) all flow through the copy resolver. `lib/copy/o3.ts` reshaped: option entries gain `primary` + optional `detail`; new `captions` block.
- **Step 3 (state wiring):** `useProto()` consumed; `answers.exAndSafety` shape unchanged (`relationshipQuality` + `devicePrivate`). CTA enable logic derives from `Boolean(exAndSafety.relationshipQuality)` per canvas L150.
- **Step 4 (Next.js wrapping):** `'use client'` directive present; `export function O3()` at the existing path.
- **Step 5 (inline helpers):** `RelRow`, `PrivPill`, `TopBar`, `Hero`, `Footer` inlined into the screen file. Shared `Arrow` + `BrandBar` + `ProgressPill` imported. Canvas's `StepRail` replaced by shared `ProgressPill`. Canvas's outer phone-bezel + "9:41" status bar dropped (page IS the viewport).

Status: TBD pending impl.

## AC-3 — Native form semantics

Evidence: two `<fieldset>` blocks in the JSX tree, each wrapping real `<input type="radio">` elements:

- Relationship fieldset has `aria-labelledby="o3-rel-legend"` and contains 4 inputs sharing `name="o3-relationship"` (values: `amicable` · `difficult` · `high-conflict` · `safety-concern`).
- Privacy fieldset has `aria-labelledby="o3-priv-legend"` and contains 2 inputs sharing `name="o3-privacy"` (values: `yes` · `not-sure`).

Both fieldsets have an `sr-only` legend; the visual question label is rendered separately matching the canvas's information design.

Keyboard navigation verified via preview-deploy keyboard-only dimension below.

Status: TBD pending impl.

## AC-4 — Animations + reduced-motion

Evidence: `src/app/dev/proto/pre-signup-interview/screens/O3.module.css` ships:

- `.entry { animation: o3-entry-in 320ms ease-out both; animation-delay: calc(var(--stagger-index, 0) * 80ms); }` with keyframes 8px translateY → 0, opacity 0 → 1.
- `.card { transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease; }`; hover translates 1px up; selected variant applies via `.card.selected`.
- `.pill { transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease; }`.
- `.cta { transition: opacity 240ms ease-out, filter 240ms ease-out; }`; `.ctaEnabled` keyframe bounce ≤320ms on enable transition.
- `@media (prefers-reduced-motion: reduce)` block sets `.entry`, `.card`, `.pill`, `.cta`, `.ctaEnabled` to `animation: none; transition: none;`.

Status: TBD pending impl.

## Preview-deploy verification

Six-dimension rubric (spec 72a) — prototype category preserves full visual rigour (spec 76 §3).

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | TBD | Navigate O2 → O3; pick a RelRow; observe CTA enable; pick a PrivPill (optional); Continue → O4 |
| Edge cases | TBD | (a) Skip privacy; CTA still enabled. (b) Pick `safety-concern`; visual style preserved. (c) Back to O2; answers persisted on return. |
| `prefers-reduced-motion` | TBD | OS-level toggle → page-entry stagger instant; card transitions instant; CTA enable bounce omitted |
| Keyboard-only | TBD | Tab into rel fieldset; arrow keys cycle radios; Space selects; Tab to priv fieldset; arrow keys cycle 2 radios; Space selects; Tab to Continue CTA |
| Mobile viewport (375×667) | TBD | Layout adapts; no horizontal scroll; 4 chip-cards stack vertically; pill question inline with right-aligned pills |
| Screen-reader | TBD | Rel fieldset legend announced via `aria-labelledby`; each radio announces label + checked state; priv fieldset similarly; CTA announces enable state |
| Cross-screen consistency | TBD | BrandBar + TopBar + footer chassis visually identical to O1 + O2; same width cap (480px); same `STEP X / Y` mono uppercase eyebrow |

## Definition of Done — prototype short-form (items 1, 8, 12, 14)

- [ ] **1.** All ACs met with evidence above
- [ ] **8.** Slice-DoD reference in PR body (`Slice references: docs/slices/S-PROTO-o3-canvas-as-source/verification.md`)
- [ ] **12.** Auto-review verdict: `approve` or `nit-only` on the impl PR
- [ ] **14.** Preview-deploy verified per 7-dim rubric above; user feedback received + addressed (or explicitly deferred)

## Architectural deferrals

Carry-forward from the prior canvas-as-source slices; no new deferrals introduced by this slice unless surfaced at preview-deploy or auto-review:

- **Sticky CTA mechanism** — `position: sticky` + safe-area-inset + shorter-than-667 viewport hardening. Originating deferral recorded in `docs/slices/S-PROTO-o1-canvas-as-source/verification.md` §"Architectural deferrals". Resolution recipe inherits.
- **44×44 touch target on Back link** — canvas-faithful small Back affordance retained for cross-screen visual consistency. Originating deferral recorded in `docs/slices/S-PROTO-o1-canvas-as-source/verification.md` §"Architectural deferrals". Resolution recipe (negative-margin or invisible hit-area extender) inherits.
- **44×44 touch target on PrivPill** — canvas-faithful pill rendered at ~31px height (canvas L131-147: `padding: '8px 16px', fontSize: 12.5`). WCAG 2.5.5 AAA expects ≥44×44 on touch surfaces. Canvas-fidelity wins for prototype category here on the same rationale as the Back-link deferral: preserving the canvas's inline pill treatment matters more than meeting AAA at prototype stage. Resolution recipe at production graduation: increase vertical padding to ~15px each side (yielding ~46px) or apply a negative-margin hit-area extender to keep the visual at 31px and the hit-area at 44×44.

Test-pain audit cleared at impl: unit tests written without module-level mocks; well below the prototype-category threshold (>5 mocks per unit test triggers seam re-evaluation).

## Status

(Lineage appended at slice ship — final-state record only per CLAUDE.md §"Definition of Done" L1.)
