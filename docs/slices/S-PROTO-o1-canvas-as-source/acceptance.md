# S-PROTO-o1-canvas-as-source

**Category:** prototype

Migrate the O1 entry screen ("Stage router") from preserve-and-rebuild to canvas-as-source via the 5-step adapt pattern. The page becomes the canvas: drops `ScreenShell`, inlines the mobile-frame visual structure from the O1 standalone canvas, and adopts the canvas's native `<fieldset>`/`<legend>`/`<input type="radio">` semantics with new affordances (trust band, sticky CTA, page-entry stagger, card-select transitions, CTA enable bounce, reduced-motion fallback).

State rename cascade: Stage union values flip from `'considering' | 'starting' | 'in-process'` to `'thinking' | 'decided' | 'in_process'` for canvas-aligned data model. Touches `lib/types.ts`, `lib/build-plan.ts` (only branching consumer), and O2's `'considering'` fallback default. Copy files `lib/copy/o{1,2,3,4,5,6}.ts` take `_stage: Stage` as an unused parameter (underscore prefix); only `lib/copy/o1.ts` is rewritten for the new canvas hero copy.

No `**Linked canvas:**` field declared (canvas-fidelity persona stays dormant per CLAUDE.md §"Hard controls"). Per-AC evidence cites the source canvas inline. Source canvas (mobile-frame state): `docs/design-source/pre-signup-interview/decoded/o1-stage-router-standalone.html` L1004-1081 (the `MobileFrame` component definition); option data at L833-843; trust-band copy at L1058-1062; animation spec annotations at L1209-1215.

## Pre-flight

Adversarial review budget per CLAUDE.md §"Engineering conventions" §"Adversarial review gate": single pass on the impl PR via auto-review (`acceptance.md` ≤300L → no partitioning). Auto-review fans out 3 default specialists (security, prototype-readiness substituting correctness per the prototype-category persona substitution in CLAUDE.md §"Slice categories", style); canvas-fidelity stays dormant (field-absent).

## Acceptance criteria

### AC-1 — O1.tsx page IS the canvas (no ScreenShell wrap)

`src/app/dev/proto/pre-signup-interview/screens/O1.tsx` renders the visual structure of the canvas `MobileFrame` directly: outer flex column with `max-w-[480px]` cap, shared `<BrandBar>` at top (consumed from `../components/BrandBar`, matches the cross-screen pattern established by the prior header-consistency slice), inline top bar with "Home" link + step rail + 44px spacer, hero block with eyebrow + serif H2 + italic sub-stem, native `<fieldset>` radio group, sticky bottom CTA region with trust band above button. The component does NOT import `ScreenShell` or `RadioCard`.

### AC-2 — 5-step adapt applied per CLAUDE.md §"Canvas-as-source"

- **Step 1 — Tokenise.** Canvas constants INK, SUB, MUTE, LINE, PAPER mapped to `tokens.color.*` refs. No raw hex literals in the page body beyond what tokens don't cover.
- **Step 2 — Copy resolver.** Canvas literals ("To start your plan…", "Tell us where you're at.", "Your answer shapes the rest of the plan. There's no wrong choice.", per-option label + sub) resolved via `getCopy(stage)` from `lib/copy/o1.ts`. Copy file rewritten to match the canvas information model (eyebrow, heading as `TitleShape` split for the italic "where" treatment, sub-stem, three options array with id/value/label/sub).
- **Step 3 — State wiring.** Canvas state demo (`selectedIdx`, `hoverIdx`, `focusIdx` props on `StageShell`) replaced with real state from `useProto()`: `answers.stage`, `setAnswer('stage', v)`, `next()`. Selection updates the native radio's checked attribute via controlled React state. Continue CTA enable logic derives from `Boolean(answers.stage)`.
- **Step 4 — Next.js wrap.** `'use client'` directive preserved. Component export remains `export function O1()` at the existing path.
- **Step 5 — Inline canvas-local helpers OR adapt.** `Arrow` helper inlined screen-locally for the "Home" link affordance. `ProgressPill` (the existing shared rebuild component) reused for the stepper — the canvas's `Stepper compact current={1} total={8}` and `ProgressPill` serve the same visual purpose (96×3 INK fill on E5E3DC ground), and reusing rather than duplicating keeps cross-screen consistency intact (Step 5's "replace with existing shared components" option). `BrandBar` imported from `../components/BrandBar`. The canvas's `MobileFrame` outer wrap and the wide-state `StageShell` demo are NOT inlined — the page IS the mobile viewport, not a phone-bezel mockup.

### AC-3 — State rename: canvas-aligned data model

`src/app/dev/proto/pre-signup-interview/lib/types.ts` Stage union flipped from `'considering' | 'starting' | 'in-process'` to `'thinking' | 'decided' | 'in_process'`. `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` three branch comparisons updated (functional-equivalent rename — same conceptual mapping, different keys; user-facing plan-summary text in the same branches remains accurate). `src/app/dev/proto/pre-signup-interview/screens/O2.tsx` `'considering'` fallback default updated to `'thinking'`. `src/app/dev/proto/pre-signup-interview/lib/copy/o{3,4,5,6}.ts` files unchanged — they take `_stage: Stage` as unused parameter (underscore prefix per existing convention).

### AC-4 — Native radio semantics + trust band per canvas spec

`<fieldset>` wraps three real `<input type="radio" name="o1-stage">` elements (one per Stage value). `<legend id="o1-legend" className="sr-only">` contains the literal text "Tell us where you're at." and is announced to screen readers via `aria-labelledby="o1-legend"` on the fieldset. Keyboard model: arrow keys move within the radio group, Space selects, Tab leaves the group (browser-default behaviour for native `<input type="radio">` with shared `name`). Each radio is visually rendered as a card (white background, LINE border, 14px border-radius, 14px padding, ≥68px min-height) with the actual radio input visually hidden via `sr-only` and a custom 18×18 dot rendered alongside. Trust band ("Free · Private until saved") sits above the sticky CTA, 10.5px MUTE colour, centered with middle-dot separator. The canvas's desktop-only keyboard hint (L967-974) is NOT in mobile scope — the mobile-frame canvas variant omits it.

### AC-5 — Animations + reduced-motion fallback

`src/app/dev/proto/pre-signup-interview/screens/O1.module.css` ships the canvas's animation spec (canvas annotations at L1209-1215):

- **Card hover:** 1px upward translate + border-colour transition 160ms ease.
- **Card selected:** 2px INK border + 6px-fill radio dot, border-color 160ms + dot-fill 120ms + shadow-elevation 200ms transitions.
- **Card focus-visible:** 2px INK outline at 2px offset on the native `<input>` parent label, no selection change.
- **CTA enable:** opacity + saturation 240ms ease-out + a single 1px upward keyframe bounce ≤320ms when the button transitions from disabled to enabled.
- **Page entry:** 8px upward translate + opacity 0→1, 320ms ease-out, 80ms stagger across hero stem + 3 cards via `animation-delay` custom-property indexing.
- **Reduced-motion override:** `@media (prefers-reduced-motion: reduce)` sets all `transition`/`animation` to `none`/`0.01ms` so the visual outcome is instant for users with the OS-level preference set.

## Out of scope

- **Desktop `StageShell` rendering with keyboard hint.** The canvas's desktop variant (L845-999) is wider with the keyboard-hint affordance to the left of the CTA. Mobile-canvas-as-source intentionally omits this — the canvas itself splits mobile (mobile-frame state) from desktop (StageShell states). Desktop graceful enhancement is constraint #41 territory (Help Rail + responsive variants).
- **Continue migrating O3-O8 to canvas-as-source.** Each is its own P2 slice.
- **Removing `ScreenShell` from `src/`.** Still consumed by O3-O8. Cleanup lands after all screens migrate.
- **`Stepper` component rewrite.** Canvas defines a separate `Stepper` helper; we reuse `ProgressPill` per Step 5's "replace with existing shared components" option. A future cleanup slice can reconcile if visual treatments diverge meaningfully.
- **C-V4 keyboard-hint visual chip (`<span className="kbd">↓</span>`).** Same rationale as desktop — mobile canvas omits it; not in scope for the mobile-first prototype.

## Verification

See `verification.md`. Prototype-category DoD-14 short-form (items 1, 8, 12, 14 only) — spec 76 §3 short-form mapping; CLAUDE.md §"Definition of Done" enumerates the items.
