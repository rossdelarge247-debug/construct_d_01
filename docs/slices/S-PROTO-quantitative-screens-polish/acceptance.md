# S-PROTO-quantitative-screens-polish

**Category:** prototype

## Slice

Closes 4 polish items deferred from the prior `S-PROTO-quantitative-screens` slice: `SkipScreenButton` extraction, `useQuantitativeUpdate` hook, `:focus-visible` CSS modules, and roving tabindex on `BucketPicker`. Two refactors that collapse code duplication across the 3 quant screens (O6.5 / O6.6 / O6.7) plus two visible-accessibility polish items (keyboard focus rings + ARIA radio-group convention compliance). Visible user-flow behavior unchanged except where AC-3 + AC-4 explicitly add accessibility affordances. Canvas-as-source pattern; no canvases for the quant screens (spec 65b sole structural source, no visual spec).

## Pre-flight notes

- Single combined slice; user-chose "All 4 (full P3 bundle)" at scoping (alternatives were #3+#4-only or split into two slices).
- No `Linked canvas:` field — `reviewer-canvas-fidelity` dimension stays dormant per CLAUDE.md §"Hard controls" matrix.
- AC arithmetic per CLAUDE.md §"100% rule": 5 ACs cover the 4 deferred items (1 each) + 1 regression-test gate. Σ in-scope = 5 = total.
- Adversarial-review budget: single-pass at slice completion (`acceptance.md` <300L expected).
- DoD-4 + DoD-14 (preview-deploy rubric) inherit the in-session P1 deferral recorded in SESSION-CONTEXT — verification.md records the inheritance, no per-slice 6-dim exercise.

## Spec sources

Defect-driven slice closing deferred polish items from the prior quant-screens auto-review. Sources:

**CLAUDE.md §"Slice categories" §"prototype":**

> "TDD-guard skips · coverage excludes · test-pain audit threshold raises from >2 to >5 mocks · DoD-14 short-form to items 1, 8, 12, 14 only."

**CLAUDE.md §"Coding conduct" §"Simplicity first":**

> "Minimum code that solves the problem. No unrequested features, no speculative abstractions, no 'configurability' unless asked, no error handling for scenarios that can't happen."

**CLAUDE.md §"Coding conduct" §"Surgical changes":**

> "Touch only what the task requires. Don't improve adjacent code, don't refactor functioning code, don't reformat."

ARIA radio-group roving-tabindex convention from WAI-ARIA Authoring Practices (no in-repo spec).

## Acceptance criteria

**AC-1 — `SkipScreenButton` component extraction.**
New component at `src/app/dev/proto/pre-signup-interview/components/SkipScreenButton.tsx` with prop `onSkip: () => void`. Renders a button with hardcoded label "Skip this screen", `minHeight: 44` (WCAG 2.5.5), and the same inline-style object as the existing skip buttons in O6_5/O6_6/O6_7 (transparent background, `tokens.color.text.sub` colour, no border, 12/16 padding, 500 13.5px/1.3 sans-serif, underline, pointer cursor). Three call sites in `src/app/dev/proto/pre-signup-interview/screens/O6_5.tsx`, `O6_6.tsx`, `O6_7.tsx` replaced with `<SkipScreenButton onSkip={next} />`. Existing visible behavior preserved exactly.

**AC-2 — `useQuantitativeUpdate` hook extraction.**
New hook file at `src/app/dev/proto/pre-signup-interview/lib/use-quantitative-update.ts` exporting `useQuantitativeUpdate(): <K extends keyof Quantitative>(key: K, value: Quantitative[K]) => void`. Hook reads from `useProto()` once; returns the closure-bound update function. Three screens replace inline `const update = ...` declarations with `const update = useQuantitativeUpdate()`. Per-screen behavior identical; existing tests in `tests/unit/proto-pre-signup/quantitative-screens-state-wire.test.tsx` continue to pass without modification.

**AC-3 — `:focus-visible` CSS module for keyboard focus indication.**
New shared module at `src/app/dev/proto/pre-signup-interview/components/focus-visible.module.css` defining a `.focusable:focus-visible` rule with `outline: 2px solid var(--ds-color-ink, #1A1A1A)` + `outline-offset: 2px` for visible keyboard-only focus ring per WCAG 2.4.7. Matches the existing pattern at `Footer.module.css:69-72`. Four interactive components (`BucketPicker` pill, `MultiPicker` checkpill, `ExpansionToggle` button, `SkipScreenButton` button) import the shared module and add `className={styles.focusable}` alongside existing inline `style={{}}` — no migration of other styles per D-2. Pseudo-class indication is only expressible via CSS file (not inline CSS-in-JS). Shared single source of truth over 4 byte-identical per-component modules (anti-DRY).

**AC-4 — Roving tabindex on `BucketPicker` (ARIA radio-group convention).**
`BucketPicker` becomes single-tab-stop per WAI-ARIA Authoring Practices for `radiogroup`. The selected pill has `tabIndex={0}`; all other pills have `tabIndex={-1}`. When `selected === undefined`, the first pill is the tab-stop. Arrow keys (ArrowLeft / ArrowRight / ArrowUp / ArrowDown) move focus AND selection to the previous/next pill (wraps at ends). Home/End jump to first/last pill. Space/click selection behavior preserved. `MultiPicker` is NOT changed (checkboxes are independent-focusable per ARIA convention). `ExpansionToggle` is NOT changed (single-button element, naturally one Tab stop).

**AC-5 — Test regression + new unit tests.**
All 11 existing tests in `tests/unit/proto-pre-signup/quantitative-screens-state-wire.test.tsx` pass without modification — behaviour-preserving refactors per AC-1/AC-2 maintain the exercised contracts. New test files:

- `tests/unit/proto-pre-signup/skip-screen-button.test.tsx` — renders correct label, `onSkip` fires on click, `minHeight: 44` present.
- `tests/unit/proto-pre-signup/use-quantitative-update.test.ts` — returned function updates the store correctly across multiple `Quantitative` key/value types.

Roving tabindex tests added to existing `quantitative-screens-state-wire.test.tsx` under the BucketPicker describe block: arrow keys move focus and selection; Home/End boundary; selected pill is the sole tab-stop. Test descriptions are behavioural, not AC-numbered (anti-pattern per CLAUDE.md §"Coding conduct" §"Comments: WHY not WHAT, no temporal provenance").

## Design decisions (named uncertainties)

**D-1.** Roving tabindex impl path: hand-rolled (refs + keyboard handlers + tabIndex management) over native `<input type="radio">` migration. Native radio gives roving tabindex + screen-reader-announce for free, but requires a label-as-control CSS pattern (visually-hidden input + styled label) to preserve the current pill-button visual treatment — net larger diff and a visual regression risk. Hand-rolled keeps the existing markup and visual; only adds keyboard handlers + `tabIndex` prop wiring. Per CLAUDE.md §"Simplicity first" — minimum code that solves the problem.

**D-2.** `:focus-visible` CSS scope: minimal-touch (add `className` for focus-visible only; existing inline `style={{}}` stays unchanged) over full migration to CSS Modules. WCAG 2.4.7 needs only the focus-visible rule; migrating all per-pill styles to modules would expand the surface beyond the stated AC. Per CLAUDE.md §"Surgical changes".

**D-3.** `SkipScreenButton` component shape: hardcoded "Skip this screen" copy over generic-button-with-children-prop. All 3 call sites use the same copy; YAGNI on configurability per CLAUDE.md §"Simplicity first". If a future call site needs different copy, add an optional `label` prop at that point.

**D-4.** `useQuantitativeUpdate` return shape: returns the update function directly (closure over store setter) over returning a `{ update }` object. Matches the existing inline-function pattern in the 3 screens; reduces refactor diff. Per CLAUDE.md §"Simplicity first".

**D-5.** Focus-ring colour: `var(--ds-color-ink, #1A1A1A)` per the existing `Footer.module.css:69-72` pattern (S-F1 token system at `src/styles/tokens.ts` exposes `--ds-color-ink: #1A1A1A`). Ink clears WCAG 1.4.11 non-text contrast 3:1 against panel white (#FFFFFF: ~17:1), page cream (#F5F5F4: ~16:1), and pill backgrounds with wide margin. Consistent with the existing focus-ring convention rather than introducing a second accent token for the same purpose.

## Out of scope (this slice)

- Visible-quality polish beyond focus-visible + roving tabindex (pill styling refresh, hover-state transitions, selected-state animations).
- The 6-dim preview-deploy rubric exercises (deferred per SESSION-CONTEXT P1 deferral — DoD-4 + DoD-14 inherit the deferral).
- `MultiPicker` roving tabindex (`role="checkbox"` — independent-focusable per ARIA; no roving convention applies).
- `ExpansionToggle` keyboard polish beyond focus-visible (single-button element; one Tab stop is correct).
- Migrating non-focus inline styles to CSS Modules (`:focus-visible` is the only pseudo-class needed for this AC's scope).
- `:focus-within` polish on radiogroup wrapper containers (focus-visible on the radio itself satisfies WCAG 2.4.7).
- Native `<input type="radio">` migration (covered by D-1 rationale; production-grade move deferred).

## Definition of Done (per `category: prototype`, short-form from CLAUDE.md §"Slice categories")

Items 1, 8, 12, 14 of the 14-item security checklist (spec 72 §11 short-form for prototype):

1. **Data classification per AC** — T0 (static UI state; underlying `Quantitative` shape on main is T1 prototype and unchanged here).
8. **Error handling (no leaks)** — N/A (pure presentation + keyboard handling; no error surface added).
12. **Adversarial review** — auto-review fan-out on PR (3 specialists: prototype-readiness substitutes for correctness in prototype category, plus security + style).
14. **Secrets hygiene** — no secrets introduced; CI `Gitleaks scan` workflow gates independently.

Plus the per-slice 6-item DoD listed below.

Plus the per-slice DoD (CLAUDE.md §"Engineering conventions"):

- Tests written and passing — existing 11 quant tests + new unit tests per AC-5.
- Adversarial review done (auto-review fan-out on PR).
- Preview-deploy verified in-browser — **DEFERRED** per SESSION-CONTEXT P1 deferral note.
- No regression in adjacent slices — `quantitative-screens-state-wire.test.tsx` and `build-plan-quantitative.test.ts` both pass without modification.
- Slice's open 68f/g entries: none applicable.

## §Status

Slice scaffold scoped session 107. User decisions:

- Priority: P3 (quant-screens polish) over P1 (deferred to system-wide pass) and P2 (blocked on Help Rail spec).
- Scope: "All 4 (full P3 bundle)" over #3+#4-only or split-into-two-slices.

P1 deferred this session per SESSION-CONTEXT note — DoD-4 + DoD-14 inherit the deferral.
