# S-F3 · Phase nav / journey map — Test plan

**Slice:** S-F3-phase-nav
**AC doc:** `./acceptance.md`
**Framework:** `vitest` (state-derivation unit + component-render smoke + copy-parity assertion) · manual + preview-deploy in-browser for visual smoke on the placeholder landing demo

---

## Test inventory

One or more tests per AC. State + component + copy-parity tests live alongside in `tests/unit/`. Manual visual smoke runs against the placeholder landing demo on Vercel preview deploy.

## T-1 · references AC-1 — `<PhaseStepper>` component

- **Given:** `<PhaseStepper currentPhase="build" phases={sampleData} />` rendered into a test container, where `sampleData` carries one of each `PhaseStatus` (`'complete'`, `'current'`, `'locked'`).
- **When:** Render via vitest + the available DOM testing library (verified during impl — `@testing-library/react` if in `package.json`, otherwise `react-dom/server.renderToString` for HTML-shape assertions).
- **Then:** All 5 phases rendered in spec-42 order (Start · Build · Reconcile · Settle · Finalise); current phase has `aria-current="step"`; current-phase badge resolves to phase token (CSS variable name spot-check via class/style attribute); locked phases dimmed treatment present.
- **Type:** unit (component render)
- **Automated:** yes (vitest)
- **Fixture:** in-test `PhasesData` literal
- **Evidence at wrap:** vitest output for `tests/unit/components/phase-nav/PhaseStepper.test.tsx`; preview-deploy screenshot of placeholder landing demo block.

## T-2 · references AC-2 — `<JourneyMapRail>` component

- **Given:** `<JourneyMapRail currentPhase="build" phases={sampleData} currentSubitems={tocSample} />` rendered into a test container.
- **When:** Render via vitest + DOM testing library.
- **Then:** All 5 phases rendered vertically; current phase shows the `currentSubitems` list expanded; locked phases show one-level dimmed sub-item preview row + the matching `UNLOCK_WHEN.{phase}` string from copy constants.
- **Type:** unit (component render)
- **Automated:** yes (vitest)
- **Fixture:** in-test `PhasesData` literal + `tocSample` array of `{ label, href }` items
- **Evidence at wrap:** vitest output for `tests/unit/components/phase-nav/JourneyMapRail.test.tsx`; preview-deploy screenshot showing current expanded + locked dimmed preview + unlock-when hint.

## T-3 · references AC-3 — `<LockedSection>` + copy constants (parity)

- **Given:** Two assertions:
  - Component: `<LockedSection gate="reconcile">{sampleChildren}</LockedSection>` renders with `🔒 LOCKED · Unlocks when you share your picture with Mark` header + dimmed children.
  - Copy parity: `UNLOCK_WHEN.{reconcile,settle,finalise}` + `UNLOCK_WHEN_DASHBOARD.{preparation,reconciliation}` strings byte-equal the LOCKED text in `docs/workspace-spec/68f-open-decisions-register.md` L26-L30.
- **When:** Component test renders via DOM testing library; parity test reads the spec file at runtime + asserts string equality.
- **Then:** Header text matches; children render under dimmed wrapper; `aria-disabled="true"` on section root; copy constants byte-equal spec source.
- **Type:** unit (component render + file-content parity assertion)
- **Automated:** yes (vitest)
- **Fixture:** in-test `sampleChildren` JSX + spec file at `docs/workspace-spec/68f-open-decisions-register.md`
- **Evidence at wrap:** vitest output for `tests/unit/components/phase-nav/LockedSection.test.tsx` + `tests/unit/components/phase-nav/copy.test.ts`; preview-deploy screenshot of locked section demo on placeholder landing.

## T-4 · references AC-4 — Phase-status state derivation

- **Given:** `derivePhaseStatus(phase, current, completed)` exported from `src/components/phase-nav/state.ts`.
- **When:** Run vitest cases covering: phase ∈ completed → 'complete' · phase === current → 'current' · default → 'locked' · `PHASES` order constant matches spec-42 5-phase order · function does not mutate frozen inputs (pass `Object.freeze` arrays + verify no error).
- **Then:** All cases pass; `npx tsc --noEmit` clean on the new types (`PhaseName`, `PhaseStatus`, `PhasesData`).
- **Type:** unit (pure-function)
- **Automated:** yes (vitest)
- **Fixture:** none — pure-function inputs constructed in-test.
- **Evidence at wrap:** vitest output for `tests/unit/components/phase-nav/state.test.ts` (≥5 cases pass).

## T-5 · references AC-5 — Aggregate test commands pass

- **Given:** All AC-1 through AC-4 implemented + tests added.
- **When:** Run the AC-5 commands in order against the slice branch HEAD.
- **Then:**
  - `npx vitest run` → all tests pass (S-F1 token parity + 4 new S-F3 unit + component test files).
  - `npx tsc --noEmit` → exit 0, no diagnostics.
  - `npm run lint` → 0 errors; up to 23 pre-existing warnings allowed.
  - `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` → success; placeholder landing builds with new components.
  - Preview deploy: opening landing page, `getComputedStyle(document.querySelector('[data-phase-stepper-current]')).getPropertyValue('background-color')` resolves to the phase-coloured token value (per S-F1 `--ds-color-phase-{currentPhase}`).
- **Type:** integration (CI command harness) + manual (preview deploy spot-check)
- **Automated:** four commands yes; preview spot-check no.
- **Fixture:** repo at slice HEAD commit.
- **Evidence at wrap:** all four commands captured in `verification.md` + spot-check screenshot.

## T-6 · references AC-6 — Slice docs complete

- **Given:** All four files in `docs/slices/S-F3-phase-nav/` populated.
- **When:** Run `grep -L '{S-XX' docs/slices/S-F3-phase-nav/*.md | wc -l` + read each file for slice-specific content.
- **Then:** Returns 4 (no template placeholders left). Each file has S-F3-specific content (no copy-paste placeholders from `_template/` or other slice folders). 68g register flips applied for C-V6 + C-V12 from 🟠 to 🟢. `verification.md` records all six DoD items completed + final-state evidence per AC.
- **Type:** unit (grep) + manual (content review)
- **Automated:** grep yes
- **Fixture:** `docs/slices/S-F3-phase-nav/*.md` + `docs/workspace-spec/68g-visual-anchors.md`
- **Evidence at wrap:** grep result + 68g diff hunk in commit history.

---

## Fixture + scenario references

S-F3 ships no scenarios + no real user flow. Test fixtures = sample `PhasesData` literals constructed in-test. The copy-parity test reads `docs/workspace-spec/68f-open-decisions-register.md` at runtime; no static fixture file.

## Visual regression placeholder

Visual verification = manual in-browser check against the placeholder landing demo on Vercel preview. The demo block on `src/app/page.tsx` renders all three components with sample state covering all PhaseStatus values (`'complete'`, `'current'`, `'locked'`). Computed-style spot-check on current-phase badge resolves to `var(--ds-color-phase-{currentPhase})` — evidenced via screenshot in `verification.md` golden path.

## Manual test discipline

- Visual smoke (T-1 + T-2 + T-3 + T-5 spot-check): run against Vercel preview deploy URL after PR opens; record screenshot + commit SHA in `verification.md`.
- All other tests fully automated.

Untested surfaces are not shipped — confirmed at AC-6 wrap.
