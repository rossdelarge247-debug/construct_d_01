# S-PROTO-o1-canvas-as-source · verification

Prototype-category slice. DoD-14 short-form (items 1, 8, 12, 14); spec 76 §3 short-form mapping.

## AC-1 — O1.tsx page IS the canvas

Evidence: `src/app/dev/proto/pre-signup-interview/screens/O1.tsx` after this slice imports neither `ScreenShell` nor `RadioCard` (verified by grep). Renders inline outer `<div className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6">` matching the cross-screen consistency pattern from the prior header slice, with `<BrandBar>` first child, inline `<TopBar>` second (Home link + step rail + 44px spacer + 1px border-bottom divider), `<Hero>` block third (eyebrow + serif H2 with italic accent + sub-stem), `<RadioGroup>` fourth (fieldset + native radios styled as cards), `<StickyCTA>` last (trust band + Continue button with backdrop-blur).

Status: TBD pending impl.

## AC-2 — 5-step adapt applied

Evidence: per-step file refs.

- **Step 1 (tokenise):** mapping at O1.tsx top: `colors.ink = tokens.color.ink`, `colors.sub = tokens.color.text.sub`, `colors.mute = tokens.color.text.muted`, `colors.line = tokens.color.border`, `colors.paper = tokens.color.background?` (or local `'#F5F5F4'` if token absent). No raw hex literals in the page body beyond what tokens don't cover.
- **Step 2 (copy resolver):** `getCopy(stage)` consumed; canvas literals (eyebrow "To start your plan…", heading split "Tell us *where* you're at.", sub-stem "Your answer shapes the rest of the plan. There's no wrong choice.") + three options (id/value/label/sub) backed by copy file fields. Copy file `lib/copy/o1.ts` rewritten to expose this shape.
- **Step 3 (state wiring):** `useProto()` consumed; `answers.stage` checked for selection; `setAnswer('stage', value)` on radio change; `next()` on CTA click. CTA enable logic: `disabled={!answers.stage}`.
- **Step 4 (Next.js wrap):** `'use client'` directive present; `export function O1()` at `screens/O1.tsx`.
- **Step 5 (inline / shared helpers):** `Arrow` inlined screen-locally; `BrandBar` + `ProgressPill` imported as shared components; `MobileFrame` outer wrap + `StageShell` desktop demo NOT inlined.

Status: TBD pending impl.

## AC-3 — State rename cascade

Evidence: diffs across:

- `lib/types.ts` — `export type Stage = 'thinking' | 'decided' | 'in_process'`.
- `lib/build-plan.ts` — three branch comparisons updated. `'considering'` → `'thinking'`, `'starting'` → `'decided'`, `'in-process'` → `'in_process'`. The user-facing summary text in each branch remains identical (the rename is keys-only; the conceptual mapping is preserved).
- `screens/O2.tsx` — `'considering'` fallback default at the top of the component body updated to `'thinking'`.
- `lib/copy/o{1,2,3,4,5,6}.ts` — only `o1.ts` rewritten for the new canvas copy shape. The other five files take `_stage: Stage` as an unused parameter (underscore-prefix convention) and need no changes; their re-typecheck against the new union is the verification.

Verified by `npm run typecheck` clean post-change. No `'considering'` / `'starting'` / `'in-process'` string literals remain in `src/app/dev/proto/pre-signup-interview/` (verified by grep).

Status: TBD pending impl.

## AC-4 — Native radio semantics + trust band

Evidence: O1.tsx renders:

- `<fieldset aria-labelledby="o1-legend">` containing `<legend id="o1-legend" className="sr-only">` with the literal text "Tell us where you're at.".
- Three `<label>` cards each containing a `<input type="radio" name="o1-stage" value={opt.value} checked={...} onChange={...}>` with the input visually hidden via `sr-only` class and a custom-rendered 18×18 dot alongside.
- All three inputs share the `name="o1-stage"` attribute so browser-native keyboard model applies (↑/↓ moves, Space selects, Tab leaves the group).
- Trust band block: `<div className="flex items-center justify-center gap-2 text-[10.5px] mb-2.5 flex-wrap" style={{ color: tokens.color.text.muted }}>` with three spans ("Free" / middle-dot / "Private until saved").

Unit tests assert (a) `screen.getByRole('radiogroup')` present, (b) `screen.getAllByRole('radio')` returns 3 elements, (c) each has the expected accessible name, (d) selecting one updates the controlled state, (e) trust-band literal text "Private until saved" is present, (f) Continue CTA `disabled` reflects `answers.stage` truthiness.

Status: TBD pending impl.

## AC-5 — Animations + reduced-motion

Evidence: `screens/O1.module.css` with named selector blocks for each animation class. Card selector receives `.card`, `.card-hover`, `.card-selected`, `.card-focus`; CTA receives `.cta-enabled` with keyframe animation; outer container + radio cards receive `.entry` with staggered `animation-delay`. `@media (prefers-reduced-motion: reduce)` block resets all `transition` and `animation` properties to negligible durations.

Visual verification at preview-deploy: load O1 with default motion preference, verify cards lift on hover + bounce on CTA enable + staggered entry on initial render. Then with `prefers-reduced-motion: reduce` (browser devtools emulation), verify instant outcomes with no motion.

Status: TBD pending preview-deploy.

## Preview-deploy verification

Spec 72a six-dimension rubric + the cross-screen consistency dimension introduced in the prior header slice.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | TBD | Load O1 → pick a stage → Continue → navigate to O2; back from O2 to O1 → previously-picked stage persists |
| Edge cases | TBD | (a) Continue stays disabled until a radio is selected; (b) selecting then selecting a different option flips the controlled state; (c) keyboard-only navigation: Tab into fieldset, ↓ to walk options, Space to select, Tab out to Continue |
| `prefers-reduced-motion` | TBD | With OS-level setting on, no page-entry stagger, no card hover-lift, no CTA bounce — all outcomes instant |
| Keyboard-only | TBD | Tab order: Home link → radio group (single tab stop) → Continue. ↑/↓ within group. Space selects. Focus-visible ring on every interactive surface. |
| Mobile viewport (375×667) | TBD | Layout fits 375px; cards stack vertically; sticky CTA region pinned to bottom; trust band readable |
| Screen-reader | TBD | Fieldset legend ("Tell us where you're at.") announced; each radio announced as "radio button" with label + sub; Continue CTA announces enable state |
| Cross-screen consistency | TBD | O1 (canvas-as-source) → O2 (canvas-as-source) → O3 (still rebuild via ScreenShell) navigation: shared BrandBar identical; outer width cap consistent at 480; top-padding rhythm consistent |

## Definition of Done — prototype short-form (items 1, 8, 12, 14)

- [ ] **1.** All ACs met with evidence above
- [ ] **8.** Slice-DoD reference in PR body (`Slice references: docs/slices/S-PROTO-o1-canvas-as-source/verification.md`)
- [ ] **12.** Auto-review verdict: `approve` or `nit-only` on the impl PR
- [ ] **14.** Preview-deploy verified per 6+1-dim rubric above; user feedback received + addressed (or explicitly deferred)

## Architectural deferrals

- **Stepper visual reconciliation.** Canvas defines a `Stepper compact current=1 total=8` helper (L770ish in canvas) distinct from the rebuild's `ProgressPill`. This slice reuses `ProgressPill` for cross-screen consistency. If the canvas's `Stepper` differs meaningfully on inspection (e.g. it omits the slash-divider label, or uses different stroke), reconcile in a follow-up slice — likely after all 8 screens migrate so the `Stepper` becomes the canvas-canonical component and `ProgressPill` retires.
- **Desktop StageShell + keyboard hint.** Canvas L845-999 spec; out of scope per constraint #41 (cross-canvas reconciliation deferred per-instance).

Test-pain audit cleared at impl: O1 tests use `render()` + `screen.getByRole('radio')` / `fireEvent.click()` patterns; no mocks needed for `useProto()` (provider wraps the render); 0 mocks total. Well below the prototype-category test-pain threshold (spec 72d §3 sets the mock-count rule; spec 76 §3 raises it from >2 to >5 for prototype category).

## Status

(Lineage appended at slice ship — final-state record only per CLAUDE.md §"Definition of Done" L1.)
