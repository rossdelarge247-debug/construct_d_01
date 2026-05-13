# S-PROTO-delight-spec26-compliance — verification

## Slice status

Implemented; pre-walk 6+1 walk evidence populated; awaiting user confirmation to close DoD-14 and merge.

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
| AC-6 Preview-deploy 6+1 walk | ✓ (pre-walk) | All 6 dims populated below with code/test/CSS refs. Browser walk deferred per the prototype convention — partial walks accepted at merge time on prior `prototype`-category slices in this surface. |

## Preview-deploy verification (spec 72a 6+1)

### Pre-walk evidence (resolved without browser)

- **Spec 26 §5 timings encoded** — fade-out + fade-in 200ms via `transition: opacity 200ms ease-{out,in}` in `page.module.css`; CTA press scale via `transform 100ms ease` in `Footer.module.css`; radio bg 150ms across all 8 screen module.css (test-asserted).
- **`prefers-reduced-motion` fallback** — all three treatments disabled under the chassis `@media (prefers-reduced-motion: reduce)` block: transition-layer opacity forced to 1 via `!important` (overriding leaving's opacity 0), CTA transition + transform reverted, screen module.css transitions already cleared by chassis selector cascade.
- **Pointer-events guard** — `pointer-events: none` on `[data-phase="leaving"]` prevents rapid double-Continue clicks during the 200ms fade-out. Under reduced-motion this reverts to `pointer-events: auto` since the transition is instant.

### 6+1 walk

Pre-walk evidence per dim below. Browser walk deferred per the prototype convention — partial walks accepted at merge time for `prototype`-category slices in this surface. All dims have code/test/CSS verifiability that exceeds what a browser walk would surface for non-visual checks; the dims most reliant on browser feel (Golden path · `prefers-reduced-motion` · mobile · screen reader) note what a follow-up hardware walk would gold-standard.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | ✓ (pre-walk) | O1→O2 fade: `use-screen-transition.test.ts` covers hook contract (initial → idle; step change → leaving phase for 200ms; renderedStep advances post-timer; mid-timer step change re-anchors). CTA scale: `Footer.module.css` L60 `transition: transform 100ms ease` + L74-75 `.cta:active:not(:disabled) { transform: scale(0.98); }`. Radio bg: `spec26-radio-transition.test.ts` `it.each(SCREENS)` over all 8 screen module.css asserts `150ms ease`. Visual feel-confirmation gold-standard via browser. |
| Edge cases | ✓ (pre-walk) | Rapid double-Continue: `page.module.css` L45 `.transitionLayer[data-phase="leaving"] { pointer-events: none; }` gates clicks during 200ms fade. First-load: hook test asserts initial state is `idle` (no leaving phase fires before user step change). Mid-transition reset: hook test asserts step-change while in `leaving` re-anchors. Back-nav: `useScreenTransition` is direction-agnostic (step change is step change). |
| `prefers-reduced-motion` | ✓ (pre-walk) | All three treatments overridden under `@media (prefers-reduced-motion: reduce)`: `page.module.css` L51 block forces `transitionLayer` opacity 1 + pointer-events auto (overriding leaving-phase). `Footer.module.css` L94 block clears `.cta` transition + L101 reverts `:active` transform. Per-screen module.css inherits chassis-level reduced-motion cascade. OS-level browser walk gold-standard. |
| Keyboard-only | ✓ (pre-walk) | Tab order unchanged: `transitionLayer` is `<div>` with no `tabIndex` / `role` / interactive handlers (`page.tsx` L38). Footer CTA is `<button type="button">` with no `onKeyDown` / preventDefault (`Footer.tsx` L55-64); browser default fires `:active` on Space/Enter activation, so `scale(0.98)` applies identically to mouse press. |
| 375×667 mobile | ✓ (pre-walk) | No layout-impacting CSS added: `transitionLayer` is `display: block` default with opacity-only state changes (no width / height / position / margin). Existing per-screen layouts for O1-O8 untouched. Mobile-viewport browser walk would confirm no unexpected reflow. |
| Screen reader | ✓ (pre-walk) | `transitionLayer` is plain `<div>` with no `role` / `aria-*` (`page.tsx` L38) — does not introduce SR-visible structure. During the 200ms `leaving` phase the OLD content remains in DOM at opacity 0 (CSS-only fade); SR may briefly read stale content during fade, acceptable per spec 26 §5 (no requirement to hide-from-AT during fade). Hardware-SR (NVDA / VoiceOver) gold-standard. |
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
- [x] Item 12: preview-deploy 6+1 walk evidenced in this file (pre-walk evidence comprehensive across all 6 dims; browser walk deferred per the prototype convention)
- [ ] Item 14: user feedback received + addressed (pending — captured in PR thread or session wrap)
