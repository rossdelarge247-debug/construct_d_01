# S-PROTO-a11y-wcag-audit-phase-1 — Audit register

WCAG 2.1 AA audit walk across the pre-signup-interview prototype surfaces (12 screens · 20 shared components · 5 Help Rails). Findings catalogued by WCAG success criterion + severity + disposition.

**Severity tiers:** A = blocking (Level A) · AA = blocking (Level AA) · AAA = recommended (Level AAA)

**Dispositions:** `fix-this-slice` · `defer-phase-2-responsive` · `defer-phase-3-sr` · `defer-phase-4-rubric` · `defer-out-of-scope`

## Findings

| ID | WCAG | File · L | Severity | Disposition | Pattern |
|---|---|---|---|---|---|
| F-A11Y-01 | 2.4.7 Focus Visible | `screens/O3.tsx` L51-56 · L139-143 | AA | fix-this-slice | Chip-card + chip-button inline-styled with `cursor: 'pointer'` — no `:focus-visible` outline. Element is `<button>` (semantics OK); default browser outline removed by inline reset. |
| F-A11Y-02 | 2.4.7 Focus Visible | `screens/O4.tsx` L49-53 | AA | fix-this-slice | Chip-card inline-styled; same pattern as F-A11Y-01. |
| F-A11Y-03 | 2.4.7 Focus Visible | `screens/O5.tsx` L48-52 | AA | fix-this-slice | Chip-card inline-styled; same pattern as F-A11Y-01. |
| F-A11Y-04 | 2.4.7 Focus Visible | `screens/O7.tsx` L148 · L637 | AA | fix-this-slice | Two inline-styled `cursor: 'pointer'` sites; require `:focus-visible` outline. |
| F-A11Y-05 | 2.4.7 Focus Visible | `screens/O8.tsx` L157 | AA | fix-this-slice | Inline-styled `cursor: 'pointer'` site; require `:focus-visible` outline. |
| F-A11Y-06 | 2.4.7 Focus Visible | `screens/QuantBridge.tsx` L87 | AA | fix-this-slice | Inline-styled `cursor: 'pointer'` site. |
| F-A11Y-07 | 2.4.7 Focus Visible | `components/rails/RailCoach.tsx` L46-50 (suggestionButtonStyle) · L77-83 (sendButtonStyle) | AA | fix-this-slice | Two inline-styled rail buttons; require `:focus-visible` outline. |
| F-A11Y-08 | 2.4.7 Focus Visible | `components/rails/rail-constants.tsx` L62-72 (optRowStyle) · L142-149 (tabButtonStyle) | AA | fix-this-slice | Rail shared-style buttons; require `:focus-visible` outline. Used by `RailHuman` V4 + `RailHybrid` V5 tabs. |
| F-A11Y-09 | 4.1.3 Status Messages (live regions) | `components/HelpRailLayout.tsx` L30-31 | AA | fix-this-slice | `aria-live="polite"` region nested inside `{showRail ? ... : null}` ternary. When `showRail` toggles true, the region mounts already-populated — screen-reader has no "change event" to announce. Refactor: mount region unconditionally; nest the conditional child. |
| F-A11Y-10 | 4.1.3 Status Messages (live regions) | `components/Footer.tsx` L43-53 | AA | fix-this-slice | `aria-live="polite"` region inside `{caption && (...)}` conditional. Same pattern as F-A11Y-09. |
| F-A11Y-11 | 4.1.3 Status Messages (live regions) | `screens/O7.tsx` L540-542 | AA | fix-this-slice | `aria-live="polite"` region rendering pattern — verify region is mounted before caption appears. |
| F-A11Y-12 | 1.4.3 Contrast (Minimum) | `components/rails/RailGlossary.tsx` L133 | AA | fix-this-slice | `MUTE` (`#78716C`) text "NOT LEGAL ADVICE" on white at small size; contrast ratio 4.61:1 — passes minimum, but at the boundary. Bump to a darker variant (`SUB`) or verify rendered size ≥ 14px. |
| F-A11Y-13 | 1.4.3 Contrast (Minimum) | `components/rails/rail-constants.tsx` L31-37 (eyebrow) · L54-60 (subheading) · L99-103 (mono-footer) · L116-122 · L143-149 | AA | fix-this-slice | `MUTE` colour used across several rail-internal small-text sites; verify each is ≥14px or shift to `SUB`. Source deferral at `docs/slices/S-PROTO-help-rail-desktop-variants/verification.md` L97: *"MUTE colour at 10.5px borderline against WCAG 4.5:1"*. |
| F-A11Y-14 | 1.4.3 Contrast (Minimum) | `components/rails/RailCoach.tsx` L125-131 · L155-159 | AA | fix-this-slice | `MUTE` colour on small captions; same review pattern as F-A11Y-13. |
| F-A11Y-15 | 1.4.3 Contrast (Minimum) | `components/rails/RailWhy.tsx` L49-53 | AA | fix-this-slice | `MUTE` colour caption; same review pattern as F-A11Y-13. |
| F-A11Y-16 | 4.1.2 Name, Role, Value | `components/rails/RailCoach.tsx` L46-50 (suggestionButtonStyle) | AA | fix-this-slice | Source deferral at `docs/slices/S-PROTO-help-rail-desktop-variants/verification.md` L97: *"suggested-buttons in `RailCoach` carry `cursor: 'pointer'` without an `onClick` handler"*. Resolution: add `aria-disabled="true"` + remove `cursor: 'pointer'`, OR wire a no-op onClick. Decision logged in fix diff. |
| F-A11Y-17 | 2.1.1 Keyboard | `components/rails/rail-constants.tsx` L62-72 (optRowStyle) | AA | fix-this-slice | Source deferral at `docs/slices/S-PROTO-help-rail-V4-V5/verification.md` L97: *"`opt-row` hover state. The canvas CSS rule `.opt-row:hover { border-color: var(--ink); }` (canvas L966) is not implemented — inline `style` props don't carry `:hover` pseudo-states"*. Resolution: migrate `optRowStyle` to a CSS module so `:hover` + `:focus-visible` can attach declaratively. |
| F-A11Y-18 | 2.1.1 Keyboard · WAI-ARIA Tabs | `components/rails/RailHybrid.tsx` L37-50 | AA | fix-this-slice | Source deferral at `docs/slices/S-PROTO-help-rail-V4-V5/verification.md` L98: *"V5 tab keyboard arrow navigation. Per the WAI-ARIA authoring practices for tabs, left/right arrow keys should move focus between tab buttons. The current impl supports Tab-key navigation but not arrow-key focus shift"*. Resolution: add `onKeyDown` to the `tablist` div capturing `ArrowLeft`/`ArrowRight` and shifting focus + active state. |
| F-A11Y-19 | 4.1.2 Name, Role, Value | `components/rails/RailHuman.tsx` L59-91 | n/a (feature-work) | defer-out-of-scope | Source deferral at `docs/slices/S-PROTO-help-rail-V4-V5/verification.md` L99: *"V4 option-row `onClick` handlers. The three contact rows render as buttons styled to look interactive but have no click handlers"*. Not WCAG — buttons are semantically correct (`<button type="button">`) and accessible to assistive tech; the wiring is feature work that lands when a variant graduates. |
| F-A11Y-20 | n/a (design decision) | `components/rails/RailHybrid.tsx` (V5 tab content composition) | n/a (design) | defer-out-of-scope | Source deferral at `docs/slices/S-PROTO-help-rail-V4-V5/verification.md` L100: *"D-2 canvas-literal compact tab content for V5"*. Design decision held open for post-deploy team review. |

## Findings summary

| Category | Count | Disposition |
|---|---|---|
| Focus-visible (WCAG 2.4.7) | F-A11Y-01..08 (8 sites) | follow-up → `S-PROTO-a11y-focus-visible-sweep` |
| ARIA live regions (WCAG 4.1.3) | F-A11Y-09..11 (3 sites) | follow-up → `S-PROTO-a11y-aria-live-regions` |
| Colour contrast (WCAG 1.4.3) | F-A11Y-12..15 (4 sites · multiple lines each) | follow-up → `S-PROTO-a11y-contrast-mute` |
| Rail-component specific (WCAG 4.1.2 · 2.1.1 · Tabs APG) | F-A11Y-16..18 (3 fixes) | follow-up → `S-PROTO-a11y-rail-specifics` |
| Non-a11y deferrals | F-A11Y-19..20 (2 items) | defer-out-of-scope |

## Walk coverage notes

- All 8 known deferrals from the two parent Help Rail slices mapped to register entries (F-A11Y-09..18 cover 6 actionable a11y items; F-A11Y-19..20 cover 2 non-a11y items with explicit defer-out-of-scope disposition).
- Screen-by-screen walk on O1, O2, O6 surfaced no new findings (O6 chip-card uses CSS-module focus-visible at `screens/O6.module.css` L26 — already covered; O1 + O2 use chassis primitives covered by existing focus-visible patterns).
- Q-bridge (`QuantBridge.tsx`) walked at L87 only — surface is small.
- 3 quantitative screens (O6.5/O6.6/O6.7) inherit focus-visible coverage via the shared `components/focus-visible.module.css` module (`SkipScreenButton` + `useQuantitativeUpdate` + `BucketPicker` + `MultiPicker` + `ExpansionToggle` all import it).
- Chassis primitives (`TopBar` + `Hero` + `Footer`) covered: `TopBar.module.css` has `.backButton:focus-visible` + `.homeLink:focus-visible`; `Footer.module.css` has `.cta:focus-visible`. Hero has no interactive elements.
- Shared interactive primitives (`BucketPicker` + `MultiPicker` + `ExpansionToggle` + `SkipScreenButton`) all import `components/focus-visible.module.css`.

## Out-of-scope confirmations

The 2 non-a11y items (F-A11Y-19 V4 onClick · F-A11Y-20 D-2 V5 compact) match the §"Out of scope" frame in `acceptance.md` and are explicitly carried to the same destinations recorded in their source deferral entries.
