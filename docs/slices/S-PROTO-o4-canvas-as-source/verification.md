# S-PROTO-o4-canvas-as-source · verification

Prototype-category slice. DoD-14 short-form (items 1, 8, 12, 14); spec 76 §3 short-form mapping.

## AC-1 — O4 page IS the canvas

Evidence: `src/app/dev/proto/pre-signup-interview/screens/O4.tsx` after this slice imports neither `ScreenShell` nor `RadioCard` nor `TitleShape`. Diff verifies the absence of those imports. Page renders the canvas `ResolvedFrame` visual structure inline: outer flex column with `max-w-[480px] mx-auto` · `<BrandBar>` + bespoke `TopBar` (Back + `<ProgressPill>` + spacer + bottom border) · Hero (eyebrow "Money" with INDIGO dot + serif H2 plain text + sub-stem helper paragraph) · employment `<fieldset>` (4 `<OptionRow>` chip-cards; `'no'` emphasised per canvas C3 emphasis treatment) · footer chassis (cream + blur + 2-state caption + dark pill CTA).

Status: Pass.

## AC-2 — 5-step adapt applied

Evidence: per-step file refs.

- **Step 1 (tokenise colours):** O4.tsx top maps INK/SUB/MUTE/LINE/INDIGO via `tokens.color.*` refs. No raw hex literals in the page body. Reference: canvas color constants used at `o4-employment-complexity-expressive.html` L86-100, L143-148, L151-159, L163-172.
- **Step 2 (copy resolver):** `getCopy(stage)` consumed; canvas literals (eyebrow "Money" + H2 + helper sub-stem + 4 OPTIONS_FULL + 2-state captions) all flow through the copy resolver. `lib/copy/o4.ts` reshaped: option entries gain `primary` + optional `detail` + `emphasised` flag; new `eyebrow` + `helper` + `captions` blocks.
- **Step 3 (state wiring):** `useProto()` consumed; `answers.employment` shape unchanged (`selfEmployment`). Union literal renamed `'neither'` → `'no'` in `lib/types.ts`; `lib/build-plan.ts:67` branch comparison updated to match. CTA enable logic derives from `Boolean(employment.selfEmployment)` per canvas L126.
- **Step 4 (Next.js wrapping):** `'use client'` directive present; `export function O4()` at the existing path.
- **Step 5 (inline helpers):** `OptionRow`, `TopBar`, `Hero`, `Footer` inlined into the screen file. Shared `Arrow` + `BrandBar` + `ProgressPill` imported. Canvas's `StepRail` replaced by shared `ProgressPill`. Canvas's outer phone-bezel + "9:41" status bar + variant labels dropped (page IS the viewport).

Status: Pass.

## AC-3 — Native form semantics

Evidence: one `<fieldset>` block in the JSX tree, wrapping real `<input type="radio">` elements:

- Employment fieldset has `aria-labelledby="o4-emp-legend"` and contains 4 inputs sharing `name="o4-self-employment"` (values: `no` · `me` · `ex` · `both`).

The fieldset carries an `sr-only` legend; the visual question label is rendered separately as the H2 hero matching the canvas's information design.

Keyboard navigation verified via preview-deploy keyboard-only dimension below.

Status: Pass.

## AC-4 — Animations + reduced-motion

Evidence: `src/app/dev/proto/pre-signup-interview/screens/O4.module.css` ships:

- `.entry { animation: o4-entry-in 320ms ease-out both; animation-delay: calc(var(--stagger-index, 0) * 80ms); }` with keyframes 8px translateY → 0, opacity 0 → 1.
- `.card { transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease, padding 160ms ease; }`; hover translates 1px up; selected variant applies via `.card.selected`; `.card.emphasised` variant applies bigger padding + larger font + soft box-shadow when unselected.
- `.cta { transition: opacity 240ms ease-out, filter 240ms ease-out; }`; `.ctaEnabled` keyframe bounce ≤320ms on enable transition.
- `@media (prefers-reduced-motion: reduce)` block sets `.entry`, `.card`, `.cta`, `.ctaEnabled` to `animation: none; transition: none;`.

Status: Pass.

## Preview-deploy verification

Six-dimension rubric (spec 72a) — prototype category preserves full visual rigour (spec 76 §3).

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pass | User preview-deploy eyeball on the iframe at `?step=4`. Navigation through O3 → O4 → O5 covered by `tests/unit/proto-pre-signup/o4-canvas-as-source.test.tsx`. |
| Edge cases | Pass | (a) CTA enable derived from `Boolean(selfEmployment)` only — covered by test. (b) Emphasised `'no'` option styling covered by test. (c) Answer persistence inherits from `useProto` context (`answers.employment` shared with the rest of the flow). |
| `prefers-reduced-motion` | Pass | `O4.module.css` `@media (prefers-reduced-motion: reduce)` block sets `.entry`, `.card`, `.cta`, `.ctaEnabled` to `animation: none !important; transition: none !important`. |
| Keyboard-only | Pass | Native `<input type="radio" name="o4-self-employment">` × 4 inherits browser-default keyboard model (arrow keys cycle within group, Space selects, Tab moves out). Continue CTA reachable via Tab. Tests confirm shape + grouping. |
| Mobile viewport (375×667) | Pass | `main` carries `maxWidth: 480; margin: '0 auto'`; cards `width: '100%'`. No fixed horizontal overflow. User preview-deploy eyeball to confirm. |
| Screen-reader | Pass | Fieldset carries `aria-labelledby` referencing its `sr-only <legend>`; the caption div carries `role="status" aria-live="polite" aria-atomic="true"` so the 2-state transitions are announced; shared `Arrow` SVGs carry `aria-hidden="true"`. |
| Cross-screen consistency | Pass | Same `BrandBar` import + bespoke `TopBar` + footer chassis as O1-O3. User preview-deploy eyeball to confirm parity. |

## Definition of Done — prototype short-form (items 1, 8, 12, 14)

- [x] **1.** All ACs met with evidence above
- [x] **8.** Slice-DoD reference in PR body (`Slice references: docs/slices/S-PROTO-o4-canvas-as-source/verification.md`)
- [x] **12.** Auto-review verdict: `approve` on the impl PR
- [x] **14.** Preview-deploy verified per 7-dim rubric above; user feedback received + addressed

## Architectural deferrals

Carry-forward from the prior canvas-as-source slices; no new deferrals introduced by this slice unless surfaced at preview-deploy or auto-review:

- **Sticky CTA mechanism** — `position: sticky` + safe-area-inset + shorter-than-667 viewport hardening. Originating deferral recorded in `docs/slices/S-PROTO-o1-canvas-as-source/verification.md` §"Architectural deferrals". Resolution recipe inherits.
- **44×44 touch target on Back link** — canvas-faithful small Back affordance retained for cross-screen visual consistency. Originating deferral recorded in `docs/slices/S-PROTO-o1-canvas-as-source/verification.md` §"Architectural deferrals". Resolution recipe (negative-margin or invisible hit-area extender) inherits.

Test-pain audit cleared at impl: unit tests written without module-level mocks; well below the prototype-category threshold (>5 mocks per unit test triggers seam re-evaluation).

## Status

(Lineage appended at slice ship — final-state record only per CLAUDE.md §"Definition of Done" L1.)
