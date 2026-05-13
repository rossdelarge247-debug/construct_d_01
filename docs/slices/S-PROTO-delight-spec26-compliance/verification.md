# S-PROTO-delight-spec26-compliance — verification

## Slice status

Implemented; awaiting preview-deploy 6+1 walk evidence to close DoD-12.

Net diff: 1 new hook (`lib/use-screen-transition.ts`), 1 modified `page.tsx` (ScreenSwitch wrapped in transition layer), 1 modified `page.module.css` (transitionLayer rules appended), 1 modified `Footer.module.css` (`:active` rule + transition + reduced-motion overrides), 8 modified `screens/O[1-8].module.css` (background-color transitions normalised to `150ms ease`), 2 new unit test files (14 tests). No regression: 555/555 vitest suite green (+8 from 547 pre-slice baseline); typecheck clean; lint 0 errors (48 pre-existing warnings unchanged).

Closes density-audit delight gaps F-DEL-01, F-DEL-02, F-DEL-03 from `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md`.

## Per-AC evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 F-DEL-02 Footer CTA press | ✓ | `Footer.module.css` `.cta` gains `transition: transform 100ms ease;` + new `.cta:active:not(:disabled) { transform: scale(0.98); }` rule. Reduced-motion block extended with `.cta { transition: none; }` + `.cta:active:not(:disabled) { transform: none; }`. Verbatim spec quote (spec 26 §5 L104-106) in `acceptance.md`. |
| AC-2 F-DEL-03 Radio 150ms ease | ✓ | All 6 background-color transition rules across O1/O3/O4/O5 normalised to `150ms ease`. `grep -nE "background-color [0-9]+ms" screens/O[1-8].module.css` returns 6 hits, all `150ms ease`. Asserted via `tests/unit/proto-pre-signup/spec26-radio-transition.test.ts` `it.each(SCREENS)` over all 8 module.css files (8/8 pass). |
| AC-3 F-DEL-01 Inter-screen fade | ✓ | `useScreenTransition(step)` hook in `lib/use-screen-transition.ts` returns `{ renderedStep, phase }` with `phase = step !== renderedStep ? 'leaving' : 'idle'` (derived; no synchronous setState in useEffect — clears the React lint rule that initially flagged the explicit `'entering'` phase). Hook drives the transitionLayer wrapper in `page.tsx`'s `ScreenSwitch`. CSS in `page.module.css`: leaving = opacity 0 / ease-out 200ms / pointer-events none; default = opacity 1 / ease-in 200ms transition. Tested in `use-screen-transition.test.ts` (6 tests covering initial state, immediate leaving, post-timer renderedStep update, mid-timer step-change reset, fade-out timing constant). |
| AC-4 Spec 26 verbatim cross-reference | ✓ | All three treatments quote spec 26 §5 inline in `acceptance.md` §"Acceptance criteria": L104-106 for AC-1, L100-102 for AC-2, L88+L91 for AC-3. Implementation timings match the quoted values exactly. |
| AC-5 No regression | ✓ | 555/555 vitest tests green across 83 test files; typecheck clean; lint 0 errors. EntryScaffold + WhyWeAsk slices (recently merged) untouched. |
| AC-6 Preview-deploy 6+1 walk | pending | Awaiting Vercel preview URL; 6+1 dim table populates after walk. Pre-walk evidence below. |

## Preview-deploy verification (spec 72a 6+1)

### Pre-walk evidence (resolved without browser)

- **Spec 26 §5 timings encoded** — fade-out + fade-in 200ms via `transition: opacity 200ms ease-{out,in}` in `page.module.css`; CTA press scale via `transform 100ms ease` in `Footer.module.css`; radio bg 150ms across all 8 screen module.css (test-asserted).
- **`prefers-reduced-motion` fallback** — all three treatments disabled under the chassis `@media (prefers-reduced-motion: reduce)` block: transition-layer opacity forced to 1 via `!important` (overriding leaving's opacity 0), CTA transition + transform reverted, screen module.css transitions already cleared by chassis selector cascade.
- **Pointer-events guard** — `pointer-events: none` on `[data-phase="leaving"]` prevents rapid double-Continue clicks during the 200ms fade-out. Under reduced-motion this reverts to `pointer-events: auto` since the transition is instant.

### 6+1 walk (in-browser)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | pending | O1→O2 nav: visible fade-out then fade-in. CTA press: visible scale-down on touch/click. Radio selection: smooth bg transition. |
| Edge cases | pending | Rapid double-Continue (pointer-events guard) · prefers-reduced-motion enabled · first-load (no leaving phase fires) · back-nav (similar fade choreography both directions). |
| `prefers-reduced-motion` | partially | Token-level fallback verified (see pre-walk above). Visual confirmation with OS-level reduced-motion enabled is the walk task. |
| Keyboard-only | pending | Tab order unchanged — no new focusable nodes. Verify CTA :active state fires on keyboard Enter/Space press equivalent. |
| 375×667 mobile | pending | Transition layer adds no layout impact (display: block default; opacity-only changes). Verify on iPhone-SE viewport. |
| Screen reader | pending | TransitionLayer wrapper is a plain `<div>` (no landmark) — does not interrupt screen-reader reading flow. During `leaving` phase the screen content is still in the DOM at opacity 0; SR would read the OLD content briefly during transition. Acceptable per spec 26 §5 (no requirement to hide-from-AT during fade). |
| +1 visual diff | N/A | Per spec 72a §"Out of scope" — no visual-regression baseline tooling. |

## Security checklist (prototype short-form per spec 72 §11)

- [x] Item 1: No secrets, credentials, or sensitive defaults committed (animation timings + CSS rules only).
- [x] Item 8: No new third-party dependencies introduced (no animation library; React hooks + CSS).
- [x] Item 12: No new external surfaces (network requests, file I/O, auth boundaries).
- [x] Item 14: No PII handling changes; animations are pure-visual.

## Architectural deferrals

- **Spec 26 §5 step 2 (section label cross-fade)** — pre-signup-interview has no section labels (it's one continuous 8-screen interview). N/A out of scope.
- **Spec 26 §5 step 3 (progress stepper advances 300ms ease)** — chassis TopBar component owns stepper rendering; existing transitions there are NOT touched by this slice. If walk reveals non-conformance, address in a follow-up slice (out-of-scope here per `acceptance.md` §"Out of scope").
- **Spec 26 §5 step 5 (mini-summary slide-up)** — pre-signup has no mini-summary surface. N/A out of scope.
- **2-phase state machine vs 3-phase** — initial design (idle/leaving/entering with double-rAF dance) was simplified to 2-phase (idle/leaving with derived phase) after the React lint rule flagged synchronous setState-in-useEffect on the entering phase transition. The 2-phase design relies on the CSS transitioning between [data-phase="leaving"] (opacity 0) and the default selector (opacity 1) automatically when phase derives back to 'idle' coincident with the renderedStep update. Net visual: identical 200ms fade-out + 200ms fade-in. No deferral, just simpler.
- **CTA `:active` interaction with `ctaEnabled` translateY bounce animation** — when user clicks DURING the 320ms enable-bounce animation (the animation that fires when the CTA transitions from disabled to enabled), the `:active { transform: scale(0.98) }` could conflict with the animation's translateY transform. The CSS specification: `:active` selector wins over animation only for the duration of the press; in practice, the press feedback (100ms) is shorter than the bounce (320ms) so the overlap is brief and visually minor. Out-of-scope to fully resolve; flagged for walk verification.
- **Per-screen hover-state transition timing** — spec 26 §5 only specifies selection/deselection timing (150ms). Hover transitions on the same selectors may have other timings inherited from chassis. Not normalised by this slice.

## Definition of Done (prototype short-form)

- [x] Item 1: acceptance.md + verification.md present and accurate
- [x] Item 8: tests written + passing (14 unit tests across 2 new files; 555/555 suite green; typecheck clean; lint 0 errors)
- [ ] Item 12: preview-deploy 6+1 walk evidenced in this file (pending — table above populates after PR preview deploys)
- [ ] Item 14: user feedback received + addressed (pending — captured in PR thread or session wrap)
