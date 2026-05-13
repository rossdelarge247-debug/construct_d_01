# S-PROTO-delight-spec26-compliance — acceptance

**Category:** prototype

## Why

Pre-signup density/delight audit (`docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md`) flagged three delight gaps in the pre-signup-interview proto, all rooted in spec 26 §5 (`docs/workspace-spec/26-transitions-animations.md` L85-110) not being implemented:

- **F-DEL-01** — Inter-screen transition cross-fade absent. Spec 26 §5 step 1 + 4: *"Current question content fades out: `opacity 1→0, 200ms ease-out`"* + *"New question content fades in: `opacity 0→1, 200ms ease-in`"*.
- **F-DEL-02** — [Next] button press feedback absent. Spec 26 §5 *"[Next] button click — Brief press feedback: `scale 0.98, 100ms` then release. Content begins fading immediately — no artificial delay."*
- **F-DEL-03** — Radio option selection transition off-spec. Spec 26 §5 *"Selected option: background transitions to highlight colour `150ms ease`. Previously selected option: background returns to default `150ms ease`. No delay before [Next] becomes active."*

Density audit L117 recommends one batch: *"Batch (delight): F-DEL-01 + F-DEL-02 + F-DEL-03 likely ship together as a spec-26-compliance pass on Footer + screen-transition layers."* This slice is that batch.

## In scope

- New transition state in `pre-signup-interview/page.tsx`'s `ScreenSwitch` wrapping component: cross-fade on `useProto().step` change.
- `:active` press-feedback rule on Footer's primary CTA button.
- Background-color transition normalisation to `150ms ease` across each per-screen module.css `.card` / `.cardSelected` (and chip equivalents on multi-select screens) selectors.
- `prefers-reduced-motion` fallback on all three treatments.
- Unit tests for the transition state machine (deterministic phase progression) + a smoke test that the radio selection transition rule matches the spec timing across all 8 screens.

## Out of scope

- Spec 26 §5 step 2 (section label cross-fade) — pre-signup has no section labels (it's one continuous interview); N/A.
- Spec 26 §5 step 5 (mini-summary slide-up) — pre-signup has no mini-summary; N/A.
- Spec 26 §5 step 3 (progress stepper advances `300ms ease`) — already covered by chassis TopBar's existing transition; out-of-scope unless verified non-conformant during the walk.
- Per-screen hover-state transition timing (spec 26 §5 only specifies selection/deselection, not hover).
- O7 + O8 module.css transitions beyond radio-card background-color (other transitions there relate to plan-card reveal, not radio selection).
- F-OUT-01..03 (plan output gaps) — separate audit batch per density audit L118.

## Design decisions

- **Fade-out + fade-in on step change** — single CSS-driven transition layer in `ScreenSwitch`'s wrapping `<div>`. Phase state machine: `idle → leaving (200ms ease-out) → entering (snap opacity 0) → visible (200ms ease-in transition)`. Uses double-`requestAnimationFrame` to ensure browser applies opacity-0 before the entering→visible transition kicks.
- **Step-aware screen swap** — `renderedStep` state lags context's `step` by one transition cycle (200ms), so the OLD screen content stays mounted during fade-out. The screen's internal `useProto().step` continues to read the context value directly — TopBar (which renders within each screen) advances with the stepper at the start of the transition, which matches spec 26 §5 step 3's intent (stepper advances during fade, not after).
- **`scale(0.98) on :active` only when not disabled** — `cta:active:not(:disabled)` rule keeps disabled-state CTAs static.
- **150ms ease as the universal background-color rate** — applies to base `.card`, `.cardSelected`, hover, and any other state-transition involving background-color across O1-O8. Other properties (border-color, box-shadow, transform) keep their existing rates — spec 26 only specifies background-color timing.
- **prefers-reduced-motion reduces to instant** — all three treatments disabled under the chassis `@media (prefers-reduced-motion: reduce)` fallback (transitions: none; transforms: none; animations: none).

## Acceptance criteria

**AC-1 — F-DEL-02: Footer CTA press feedback.**
- `src/app/dev/proto/pre-signup-interview/components/Footer.module.css` `.cta` rule gains `transition: transform 100ms ease;` (combined with any other transitions on the same selector).
- New rule `.cta:active:not(:disabled) { transform: scale(0.98); }` applies the press feedback.
- `prefers-reduced-motion: reduce` block disables both the transition and the transform.
- Spec quote (verbatim, spec 26 §5 L104-106): *"[Next] button click — Brief press feedback: `scale 0.98, 100ms` then release."*

**AC-2 — F-DEL-03: Radio / chip selection transition at 150ms ease.**
- Every per-screen module.css under `screens/O[1-8].module.css` containing a `background-color [N]ms ease(-out|-in)?` transition rule normalises that rule to `background-color 150ms ease`. Other properties on the same rule keep their existing timing.
- Negative grep `grep -nE "background-color [0-9]+ms" src/app/dev/proto/pre-signup-interview/screens/O[1-8].module.css | grep -v "150ms ease$"` returns no matches (excluding zero — the prefers-reduced-motion override).
- Spec quote (verbatim, spec 26 §5 L100-102): *"Selected option: background transitions to highlight colour `150ms ease`. Previously selected option: background returns to default `150ms ease`. No delay before [Next] becomes active."*

**AC-3 — F-DEL-01: Inter-screen fade choreography.**
- `pre-signup-interview/page.tsx`'s `ScreenSwitch` wraps the rendered screen in a transition layer (`<div className={styles.transitionLayer} data-phase={phase}>`).
- A phase state machine drives the wrapper's opacity through `idle → leaving → entering → visible` on each `useProto().step` change, with timing per spec.
- New `page.module.css` (or co-located module CSS) defines:
  - `data-phase="leaving"` → `opacity: 0; transition: opacity 200ms ease-out;`
  - `data-phase="entering"` → `opacity: 0; transition: none;`
  - `data-phase="visible"` (or default) → `opacity: 1; transition: opacity 200ms ease-in;`
- `prefers-reduced-motion: reduce` fallback: all phases → `opacity: 1; transition: none;`.
- `renderedStep` lags `step` by exactly one transition cycle (200ms) so the outgoing screen stays mounted during fade-out.
- Spec quote (verbatim, spec 26 §5 L88, L91): *"Current question content fades out: `opacity 1→0, 200ms ease-out`"* and *"New question content fades in: `opacity 0→1, 200ms ease-in`"*.

**AC-4 — Spec 26 verbatim cross-reference.**
- All three treatments quote spec 26 §5 inline in `acceptance.md` (above). The implementation matches the quoted timings exactly: 100ms press, 150ms radio bg, 200ms fade-out + 200ms fade-in.

**AC-5 — No regression in adjacent slices.**
- Full vitest suite green (540/540 expected: 533 pre-merge + 7 WhyWeAsk landed in #174). New tests for the transition state machine + radio-bg grep assertion add to the count.
- Typecheck clean.
- Lint adds zero new warnings.

**AC-6 — Preview-deploy 6+1 walk.**
- Spec 72a 6+1 rubric on the Vercel preview, with explicit verification for:
  - O1→O2 nav: fade-out → fade-in visible, no jarring snap.
  - CTA press: visible scale-down briefly on `:active`, snaps back on release.
  - Radio selection: O1's stage card background transitions smoothly at 150ms, no flicker.
  - `prefers-reduced-motion`: with OS-level reduced-motion enabled, transitions snap (no fade, no scale).

## Pre-flight notes

- Adversarial review budget (per spec 72b): Option A (default single-spawn). Acceptance.md L1-L120 fits within 300-line budget.
- Test-pain audit (spec 72d §3): transition state machine uses pure React state + setTimeout; testable via fake timers without external mocks. Expect ≤2 mock setups per test.
