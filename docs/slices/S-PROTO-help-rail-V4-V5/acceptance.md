# S-PROTO-help-rail-V4-V5

**Category:** prototype

## Purpose

Land the two Help Rail variants the parent slice (`S-PROTO-help-rail-desktop-variants`) deferred — V4 (RailHuman / "Talk to a human") and V5 (RailHybrid / tabbed). Replaces the `<RailDeferred>` placeholders in `HelpRailLayout.tsx` with live components so all five canvas variants are toggleable via the dev control surface for the team's "see them live before picking" evaluation.

## Canvas source

- `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html` (bundled)
- `docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html` (decoded readable form)

Canvas-as-source per CLAUDE.md §"Visual direction" §"Canvas-as-source" — 5-step light adapt; no `Linked canvas:` field; canvas-fidelity gate stays dormant; per-AC evidence cites the canvas path inline.

## In scope

- New rail components under `src/app/dev/proto/pre-signup-interview/components/rails/`:
  - `RailHuman.tsx` (V4 — three contact options + founder note + safety footer)
  - `RailHybrid.tsx` (V5 — tabbed wrapper switching between V1/V2/V3/V4)
- Refactor of V1/V2/V3 (`RailGlossary` / `RailCoach` / `RailWhy`) to expose `*Body` named exports alongside the existing `<aside>`-wrapped defaults (mechanical extraction; no behaviour change for direct consumers — `HelpRailLayout.tsx` continues to import the wrapped variants). This emerged as an impl detail of parent-slice D-7 (see D-8 below).
- Extensions to `rail-constants.tsx` (additive only, no rename/rearrange):
  - `MAGENTA` colour constant (canvas L1645)
  - `ChatIcon` / `PhoneIcon` / `HeartIcon` SVG components (canvas `Ico` set L1659-1673)
  - Shared option-row styles for V4: `optRowStyle`, `optIconStyle`, `optTitleStyle`, `optMetaStyle`, `optPillStyle`, `optPillGreyStyle`
  - Shared tab-row styles for V5: `tabRowStyle`, `tabButtonStyle`, `tabActiveButtonStyle`
  - `founderNoteStyle` for V4's dashed-border note card
- `HelpRailLayout.tsx` — replace `<RailDeferred label="Talk to a human" />` and `<RailDeferred label="Hybrid (tabbed)" />` with `<RailHuman />` and `<RailHybrid />`; remove the `RailDeferred` helper (no remaining consumers)
- Tests in `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx`:
  - V4 smoke render
  - V5 smoke render + tab-switch behaviour
  - HelpRailLayout v4 → RailHuman + v5 → RailHybrid routing

## Out of scope

- Mobile rails / variant analytics / per-step rail-content variation / copy-resolver wiring — carry from the parent slice's §Out of scope; unchanged
- Modifying V1/V2/V3 to support a "compact" rendering mode for V5 use — V5 imports them as-is per the locked design decision (see D-1)
- Promoting tab-row styles to a shared `Tabs` component — deferred until a second consumer needs them
- Per-prototype-slice 6-dim preview-deploy rubric exercises — deferred to system-wide accessibility + responsive + screen-reader pass once prototype journeys lock down (inherited deferral from the parent slice's `verification.md` §"Preview-deploy verification")

## Acceptance criteria

### AC-1 — RailHuman (V4) component

`RailHuman.tsx` renders the V4 canvas content faithfully (canvas L1925-1978):

- Eyebrow ("Need a person?") + heading ("We're here.") + sub-paragraph
- Three contact-option buttons:
  - "Chat with the team" — `ChatIcon`, meta `Mon–Fri, 9–6 · Avg. reply in 4 min`, pill `Online`
  - "Book a 30-min call" — `PhoneIcon`, meta `Free · with a Decouple guide, not a salesperson`, grey pill `Slots open`
  - "Decouple Listen" — `HeartIcon` (magenta-tinted background `#FCE7F3`), meta `Free emotional support line · run by Relate`, grey pill `24/7`
- Founder note card (dashed border): `A note from Sarah, founder. Decouple's team is small and we read every chat ourselves...`
- Safety footer (mono uppercase): `IF YOU'RE NOT SAFE · CALL 999 OR REFUGE 0808 2000 247`

Wrapper layout uses `railContainerStyle` from `rail-constants.tsx`.

**Evidence:** smoke test in `help-rail.test.tsx` renders `RailHuman` and asserts presence of `We're here.`, `Decouple Listen`, `999 OR REFUGE 0808 2000 247`, and `Sarah, founder`.

### AC-2 — RailHybrid (V5) component per locked D-7

`RailHybrid.tsx` provides its own outer `<aside style={railContainerStyle}>` (rail container) and composes the four child rails' `*Body` named exports inside a tabbed panel (per D-8). Per parent-slice D-7 (verbatim):

> *"Hybrid (V5) tabs the other 4 rails as-is, not re-renders. V5 imports `RailGlossary`/`RailCoach`/`RailWhy`/`RailHuman` and switches via tab state. Avoids duplication; lets V5 evolve as the four components evolve."*

Structure (canvas L1983-2086):
- Eyebrow (`Help · choose how`) + heading (`Stuck? Here.`)
- Tab row with four `role="tab"` buttons: `Ask Decouple` (active by default) / `What this means` / `Why we ask` / `Human` — wrapped in `role="tablist"` for assistive-tech identification
- Tab state via local `useState`; active tab gets visual treatment per canvas L1991-1996
- Active tab body renders the corresponding rail's `*Body` content (single rail container, no nesting):
  - `Ask Decouple` → `<RailCoachBody />`
  - `What this means` → `<RailGlossaryBody focused="relationship" />` (preserves V1's default-focus prop)
  - `Why we ask` → `<RailWhyBody />`
  - `Human` → `<RailHumanBody />`

**Evidence:** smoke test asserts initial render shows the `Ask Decouple` tab body (RailCoach text); clicking the `Human` tab reveals RailHuman content (`999 OR REFUGE`); clicking `What this means` reveals RailGlossary content.

### AC-3 — `rail-constants.tsx` additive extensions

Add to the existing module without renaming or rearranging current exports:

- `MAGENTA = '#BE185D'` (canvas L1645)
- `ChatIcon` / `PhoneIcon` / `HeartIcon` — canvas `Ico` ports (L1659-1673), `size = 16` default, line-only with `currentColor` strokes
- Option-row style objects: `optRowStyle`, `optIconStyle`, `optTitleStyle`, `optMetaStyle`, `optPillStyle`, `optPillGreyStyle`
- Tab-row style objects: `tabRowStyle`, `tabButtonStyle`, `tabActiveButtonStyle`
- `founderNoteStyle` for V4's dashed-border card

**Evidence:** existing V1/V2/V3 rail components still render unchanged (smoke tests on `help-rail.test.tsx` `Help Rail components — smoke` describe block stay green); new exports referenced by V4 + V5.

### AC-4 — HelpRailLayout routes V4 + V5 to live components

`HelpRailLayout.tsx` L52-53 today:

```tsx
if (variant === 'v4') return <RailDeferred label="Talk to a human" />;
if (variant === 'v5') return <RailDeferred label="Hybrid (tabbed)" />;
```

Becomes:

```tsx
if (variant === 'v4') return <RailHuman />;
if (variant === 'v5') return <RailHybrid />;
```

The `RailDeferred` helper function is removed from the file (no remaining consumers).

**Evidence:** integration tests in `help-rail.test.tsx` — the two existing `renders deferred placeholder when variant is v4/v5` tests change to `renders RailHuman when variant is v4` and `renders RailHybrid when variant is v5`.

### AC-5 — Tests

Updates to `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx`:

1. Add 3 tests in `describe('Help Rail components — smoke')`:
   - `RailHuman renders with safety footer text`
   - `RailHybrid renders with default Ask Decouple tab active`
   - `RailHybrid tab-switch reveals different rail bodies`
2. Amend the 2 `renders deferred placeholder` tests in `describe('HelpRailLayout — variant selection')` to positive assertions for the live components.

Net test delta: +3 new tests, 2 amended.

## Design decisions

- **D-1: Honor parent-slice D-7 verbatim.** V5 imports the other four rails as-is and tabs between them. The canvas-literal compact per-tab content (a 2-section glossary, 3 AI suggestions, abbreviated human options without founder note or safety footer) diverges from D-7 but is deliberately deferred — the locked D-7 trade-off (auto-tracks V1-V4 evolution, no duplication) holds.
- **D-2: Canvas-literal tension noted as deferred refinement.** If V5-live feels overloaded (the designer's own §Reading notes warned: *"tab fatigue + fewer of any single thing — we've effectively built four small panels instead of one strong one"*), the team can revisit and partition V5's tab bodies into compact variants. Out of scope this slice.
- **D-3: Faithful safety footer.** V4's safety line (`IF YOU'RE NOT SAFE · CALL 999 OR REFUGE 0808 2000 247`) and Relate attribution (`Free emotional support line · run by Relate`) are sensitive harm-reduction content; they carry verbatim from the canvas. The founder-note copy carries verbatim too.
- **D-4: Extend `rail-constants.tsx`, don't create a new module.** New constants/icons/styles slot into the existing module to keep all rail primitives in one place. Existing exports unchanged.
- **D-5: V5 tab state is local React `useState`.** Component-local; no persistence, no cross-component leakage, resets on remount. Storage-free by design — V5 doesn't expose a "remember my tab" affordance and the canvas doesn't include one.
- **D-6: No `Linked canvas:` field; canvas-fidelity gate stays dormant.** Per-AC evidence cites canvas line ranges inline; verbatim canvas-quote discipline is not invoked for prototype-category slices.
- **D-7: `RailHybrid` renders `RailGlossary` with `focused="relationship"`.** The canvas anchors O2 ("Your situation") whose first card is the relationship question; the explicit `focused="relationship"` prop encodes that anchor. If V5 ever surfaces from O-screens other than O2, the `focused` prop will need plumbing — deferred (per-step rail-content variation stays out of scope).
- **D-8: V1/V2/V3/V4 expose `*Body` sub-components for V5 composition (AC mid-impl amendment).** Parent-slice D-7's "imports the 4 rails as-is" framing didn't anticipate that each rail wraps its content in its own `<aside style={railContainerStyle}>` (480px width, padding 24, background tint, border-left). Naive nesting (V5's `<aside>` containing a child rail's `<aside>`) produces double padding, double background, width clipping. Three resolution paths surfaced at impl time: (a) `*Body` named-export extraction from V1-V4 — V5 composes the body content inside its own single `<aside>` (chosen); (b) reopen D-7, inline canvas-literal compact tab content — would touch the parent-slice's locked decision; (c) accept the double-wrap visual — would ship broken. The Body extraction is mechanical (the inner JSX moves to a `*Body` function that returns a fragment; the original `RailX` export becomes a thin `<aside>` wrapper around `<RailXBody {...props} />`); no behaviour change for `HelpRailLayout.tsx`'s direct consumers of `RailX`. Re-reading parent-slice D-7 ("V5 imports `RailGlossary`/`RailCoach`/`RailWhy`/`RailHuman` and switches via tab state. Avoids duplication; lets V5 evolve as the four components evolve") — the Body extraction preserves D-7's spirit (V5 composes rail content, no duplication, auto-tracks rail evolution) while resolving the container-nesting impl detail.

## Risk / blast radius

**Surface touched:**
- New: `src/app/dev/proto/pre-signup-interview/components/rails/RailHuman.tsx`, `RailHybrid.tsx`
- Edited:
  - `src/app/dev/proto/pre-signup-interview/components/rails/rail-constants.tsx` — extensions only
  - `src/app/dev/proto/pre-signup-interview/components/HelpRailLayout.tsx` — 4-line routing change + helper removal
  - `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx` — extend coverage

**Regression risk:**
- Existing 330/330 proto suite: zero — `rail-constants.tsx` extensions are additive; V1/V2/V3 unchanged.
- HelpRailLayout: 2 tests change from negative-state assertions to positive-state assertions; expected.
- Variant context infra: no changes to `src/lib/dev/variant-context.tsx` or related files.

**Recovery path:** If V4 or V5 ships visibly broken, the dev control toggle flips the active variant back to `off`. If routing breaks, revert the four-line change in `HelpRailLayout.tsx`; the new rail components stay intact but unconsumed.

## Spec sources

CLAUDE.md §"Visual direction" §"Canvas-as-source" §"Slice convention for canvas-as-source":

> *"acceptance.md does NOT carry the `Linked canvas:` field (so canvas-fidelity stays dormant per CLAUDE.md §'Hard controls'). Per-AC evidence cites the source canvas path inline without verbatim quoting requirements. `**Category:** prototype` declared as usual."*

CLAUDE.md §"Slice categories" §"Per-category behaviour summary":

> *"`prototype` — UI/UX rigour preserved (preview-deploy 6-dim runs in full · `reviewer-prototype-readiness` post-PR persona substitutes `reviewer-correctness`); code rigour relaxed (TDD-guard skips · coverage excludes · test-pain audit threshold raises from >2 to >5 mocks · DoD-14 short-form to items 1, 8, 12, 14 only)."*

`docs/slices/S-PROTO-help-rail-desktop-variants/acceptance.md` D-7:

> *"Hybrid (V5) tabs the other 4 rails as-is, not re-renders. V5 imports `RailGlossary`/`RailCoach`/`RailWhy`/`RailHuman` and switches via tab state. Avoids duplication; lets V5 evolve as the four components evolve."*

`docs/slices/S-PROTO-help-rail-desktop-variants/security.md` L46:

> *"Tab selection within `RailHybrid` is component-local React state (`useState`). No persistence, no cross-component leakage; resets on remount."*

## Status

- [ ] AC-1 — RailHuman (V4) component
- [ ] AC-2 — RailHybrid (V5) component per locked D-7
- [ ] AC-3 — `rail-constants.tsx` additive extensions
- [ ] AC-4 — HelpRailLayout routes V4 + V5 to live components
- [ ] AC-5 — Tests

Slice scaffolded; implementation pending.
