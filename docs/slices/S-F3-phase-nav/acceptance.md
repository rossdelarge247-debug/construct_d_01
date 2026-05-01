# S-F3 · Phase nav / journey map — Acceptance criteria

**Slice:** S-F3-phase-nav
**Spec ref:** `docs/workspace-spec/70-build-map-slices.md` L41-L46 (S-F3 slice card) · `docs/workspace-spec/68g-visual-anchors.md` L56-L59 (C-V6 dashboard horizontal stepper) · L96-L99 (C-V12 locked-section inline treatment) · `docs/workspace-spec/68f-open-decisions-register.md` L13-L17 (C-N1a contextual journey-map LOCKED) · L24-L30 (C-N1c unlock-when copy LOCKED) · L32-L33 (C-N1d locked-phase preview depth LOCKED) · `docs/workspace-spec/71-rebuild-strategy.md` §7 Phase C.1 (sequencing — order #3 after S-F1 + S-F7)
**Phase(s):** Foundation (Phase C, Step 1) — used by every phase surface downstream (dashboard + every workspace document)
**Status:** Approved · In implementation

---

## Context

S-F3 is the **phase navigation foundation** consumed by every dashboard + in-doc surface in the rebuild. It ships two distinct components rendering the same 5-phase journey-map data: `<PhaseStepper>` (dashboard horizontal pill bar per C-V6) and `<JourneyMapRail>` (in-doc vertical rail per C-N1 amended). Both honour C-N1a's contextual structure rule: all five phases always visible; current phase expanded; locked phases dimmed with one-level sub-item preview + unlock-when hint. Plus `<LockedSection>` primitive (C-V12) for in-section locked treatment + the locked unlock-when copy from C-N1c. Visual smoke verifies on the placeholder landing page (`src/app/page.tsx`) per the option-1a verification surface decision; downstream `/dev/*` routes (S-F7-β) absorb the demo when that slice rebases. Tokens consumed via existing S-F1 `--ds-*` system (Tailwind arbitrary-value syntax per S-F1 AC-1 amendment).

## Dependencies

- **Upstream slices:** S-F1 design-tokens (provides `--ds-color-phase-{build,reconcile,settle,finalise}` + soft variants + typography + spacing + shadow tokens consumed by both components).
- **Open decisions resolved by this slice:**
  - 68g **C-V6** (5-phase horizontal stepper, dashboard) — locked by AC-1.
  - 68g **C-V12** (locked-section inline treatment) — locked by AC-3.
- **Open decisions referenced but NOT resolved here:**
  - 68f C-N1b (phase + document label pass) — copy reconciliation deferred to dedicated copy-flip slice (per slice card "Opens" + 68f L21 lean).
  - 68g C-N5 (two-nav-surfaces parent pattern spec) — informational only; this slice ships the two surfaces, the parent pattern doc is a downstream artefact.
- **Re-use / Preserve-with-reskin paths touched:**
  - `src/app/page.tsx` — extended to demo all three S-F3 components (placeholder landing per option 1a).
  - New: `src/components/phase-nav/{PhaseStepper,JourneyMapRail,LockedSection}.tsx` + `{copy,state,types,index}.ts`.
- **Discarded paths deleted at DoD:** none.

## MLP framing

The loveable floor is **two surfaces of the same 5-phase journey rendered from one data source, with locked-state treatment that respects users' progress + previews what comes next**. Cuts happen by deferring the C-V3 welcome-tour stepper (different slice) and C-N1b copy reconciliation (different slice). This slice does not invent label conventions; it consumes spec 42's 5-phase model verbatim (Start · Build · Reconcile · Settle · Finalise) and the locked unlock-when copy from C-N1c verbatim. Downstream slices that need a different stepper variant (welcome tour, pre-flight) build their own.

---

## AC-1 · `<PhaseStepper>` component (C-V6, dashboard horizontal)

- **Outcome:** Full-width pill-bar component at `src/components/phase-nav/PhaseStepper.tsx`. Renders the 5-phase journey horizontally: numbered badges (1–5) + phase label + status sub-label ("In progress" / "Locked" / "Complete"). Visual states: filled/inked for current, outlined for pending, outlined-dimmed for locked. Current phase carries the matching S-F1 `--ds-color-phase-*` accent.
- **Verification:** Component import resolves; renders all 5 phases in spec-42 order (Start · Build · Reconcile · Settle · Finalise); each badge has accessible label `aria-label="Phase N: {name} — {status}"`; current phase is `aria-current="step"`; computed-style on current-phase badge spot-checks against `--ds-color-phase-{currentPhase}`. Visual smoke from preview-deploy on placeholder landing.
- **In scope:** Single component file (~80–120 lines TSX). Props: `currentPhase: PhaseName`, `phases: PhasesData` (status per phase from AC-4 derivation). Consumes S-F1 tokens via Tailwind `bg-[var(--ds-color-phase-build)]`-style arbitrary-value syntax (per S-F1 AC-1 amendment — `--ds-*` tokens sit outside `@theme`). Full-width responsive down to 375px viewport.
- **Out of scope:** Click-to-navigate behaviour (downstream — owning surface decides routing); animations/transitions (spec 26; dedicated motion slice); mid-stepper task-groups expansion (that's the rail surface per C-N1a, not the stepper).
- **Opens blocked:** 68g **C-V6** — pattern locked by this AC.
- **Loveable check:** A dashboard author drops `<PhaseStepper currentPhase="build" phases={derivedFromState} />` at the top of any dashboard page and the user instantly knows where they are. Yes — delight, foundational always-visible chrome.
- **Evidence at wrap:** `git diff src/components/phase-nav/PhaseStepper.tsx`; preview-deploy screenshot showing all 5 visual states across 1+ scenarios; dev-tools computed-style spot-check on current-phase badge resolving to the phase token value.

## AC-2 · `<JourneyMapRail>` component (C-N1 amended, in-doc vertical)

- **Outcome:** Vertical rail component at `src/components/phase-nav/JourneyMapRail.tsx` rendering the same 5-phase data as AC-1 but in left-rail orientation. Per C-N1a verbatim: *"Both surfaces show all five phases always; current phase expands to doc TOC (rail) or task groups (dashboard); locked phases dimmed with one-level sub-item preview + 'Unlocks when…' hint."* Current phase shows expanded sub-items (passed via prop); locked phases show one-level dimmed preview per C-N1d locked.
- **Verification:** Component import resolves; renders 5 phases vertically in spec-42 order; current phase expanded with sub-items list; locked phases show one dimmed preview row per C-N1d + the C-N1c unlock-when string from AC-3 copy constants; computed-style spot-check on current phase resolves to phase-coloured accent. Visual smoke from preview-deploy.
- **In scope:** Single component file (~100–150 lines TSX). Props: `currentPhase: PhaseName`, `phases: PhasesData`, `currentSubitems?: SubItem[]` (TOC entries injected by host doc). Reuses AC-4 state derivation. Same token-consumption pattern as AC-1.
- **Out of scope:** Sub-item click handlers (host doc owns); collapse/expand animation (spec 26); rail width/sticky behaviour (host layout owns); the dashboard-specific task-groups expansion (lives on stepper-host surface, separate slice).
- **Opens blocked:** none — C-N1a + C-N1d are already LOCKED in 68f; this AC implements them.
- **Loveable check:** A document author drops `<JourneyMapRail currentPhase="build" phases={...} currentSubitems={tocEntries} />` in their layout's left rail and users always see the journey shape, not just the current section. Yes — delight, "you are here" without losing context.
- **Evidence at wrap:** `git diff src/components/phase-nav/JourneyMapRail.tsx`; preview-deploy screenshot showing rail with current expanded + locked-phase preview rows + unlock-when hint visible; dev-tools computed-style spot-check.

## AC-3 · `<LockedSection>` primitive + unlock-when copy constants (C-V12 + C-N1c LOCKED)

- **Outcome:** Two artefacts:
  - `src/components/phase-nav/LockedSection.tsx` — wraps a section with C-V12 treatment: header reads `🔒 LOCKED · Unlocks when {gate}` (dimmed, small caps); all children rendered through a dim wrapper; CTAs replaced with `Locked` outlined pills via a render-prop or context.
  - `src/components/phase-nav/copy.ts` — exports the LOCKED unlock-when strings from C-N1c verbatim: `UNLOCK_WHEN.reconcile` = `"Unlocks when you share your picture with Mark"`, `.settle` = `"Unlocks when you and Mark agree on your shared picture"`, `.finalise` = `"Unlocks when your settlement is signed by both of you"`, plus `UNLOCK_WHEN_DASHBOARD.preparation` = `"Unlocks when preparation is complete"` + `.reconciliation` = `"Unlocks when reconciliation is complete"`. Build phase: implicit (no string per C-N1c L26).
- **Verification:** Strings match 68f L26-L30 byte-for-byte (parity test in AC-5 enforces this); component renders header with `🔒` + lock-up + dimmed children + outlined `Locked` pill on a sample CTA; `aria-disabled="true"` on the section root.
- **In scope:** Two files. The component is intentionally minimal (~50–80 lines TSX); copy.ts is a small typed constant module (~20 lines TS).
- **Out of scope:** Tooltip surface (C-N2 dimmed+tooltipped — separate concern); animation when unlock fires (spec 26); the partner-name resolution ("Mark" is hardcoded per C-N1c LOCKED text — partner-aware substitution is a downstream copy slice).
- **Opens blocked:** 68g **C-V12** — pattern locked by this AC.
- **Loveable check:** A section author wraps `<LockedSection gate="reconcile">{cards}</LockedSection>` and the entire surface dims with the right unlock-when copy automatically. Yes — delight, no per-section unlock copy authoring.
- **Evidence at wrap:** `git diff` for both files; parity test output (string-equality assertion against 68f source); preview-deploy screenshot on placeholder landing showing locked section with `🔒` header + dimmed children + outlined pill.

## AC-4 · Phase-status state derivation

- **Outcome:** Pure function `derivePhaseStatus(phase: PhaseName, current: PhaseName, completed: PhaseName[]): PhaseStatus` exported from `src/components/phase-nav/state.ts`. `PhaseStatus = 'complete' | 'current' | 'locked'` (3 states). Logic: phase ∈ completed → 'complete'; phase === current → 'current'; else → 'locked' (per C-N1a verbatim: *"locked phases dimmed with one-level sub-item preview + 'Unlocks when…' hint"*). Plus `PHASES: readonly PhaseName[]` exported in spec-42 order.
- **Verification:** Unit tests in `tests/unit/phase-nav-state.test.ts` covering: complete-phases-array honoured · current-phase derivation · default-locked · 5-phase order constant · function does not mutate inputs (frozen-input pass-through). `npx tsc --noEmit` clean.
- **In scope:** ~30–50 lines TS in `state.ts` + types co-located in `types.ts` (`PhaseName`, `PhaseStatus`, `PhasesData`). Pure function (no effects).
- **Out of scope:** Pending-vs-locked refinement (C-V6 L57 mentions "outlined pending" but C-N1a collapses non-current/non-complete to "locked"; 3-state MLP — refinement deferred to first slice that finds the distinction load-bearing). Per-phase sub-item content (host-supplied via `currentSubitems` prop in AC-2; not derivation responsibility).
- **Opens blocked:** none.
- **Loveable check:** A host can pass `derivePhaseStatus(phase, journeyState.currentPhase, journeyState.completedPhases)` and trust the result without per-call branching. Yes — delight, single source of truth for nav status.
- **Evidence at wrap:** vitest output for `phase-nav-state.test.ts`; TS exports consumable in PhaseStepper + JourneyMapRail call sites.

## AC-5 · Tests pass

- **Outcome:** Three test categories pass: (a) state-derivation unit tests (per AC-4); (b) component-render smoke tests for `PhaseStepper` + `JourneyMapRail` + `LockedSection` rendering with sample inputs; (c) copy-parity test enforcing `UNLOCK_WHEN.*` string-equality with 68f L26-L30 verbatim.
- **Verification:**
  - `npx vitest run` — all new tests pass; pre-existing tests unbroken (S-F1 token-parity test continues to pass).
  - `npx tsc --noEmit` — passes; new types resolve.
  - `npm run lint` — 0 errors (pre-existing warnings allowed).
  - `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` — passes; placeholder landing builds with new components.
  - Preview deploy: placeholder landing renders all three S-F3 components in a demo block; dev-tools computed-style spot-check on current-phase badge resolves to `var(--ds-color-phase-{currentPhase})`.
- **In scope:** unit tests for `state.ts`; component-render smoke tests using whichever testing-library is already in `package.json` devDependencies (verified during impl — `@testing-library/react` if present, plain `render` otherwise); copy-parity test reading `docs/workspace-spec/68f-open-decisions-register.md` at test time and asserting equality against `UNLOCK_WHEN` constants.
- **Out of scope:** Playwright integration tests (no full user flow yet); full a11y audit (covered when dashboard slice consumes nav in real surface); visual regression snapshots (preview-deploy spot-check sufficient at foundation-component scale).
- **Opens blocked:** none.
- **Loveable check:** N/A — tests are infra, not user-facing.
- **Evidence at wrap:** vitest output; tsc/lint/build clean exit codes; preview-deploy URL + screenshot of demo block on placeholder landing.

## AC-6 · Slice documentation complete

- **Outcome:** All four DoD documents in `docs/slices/S-F3-phase-nav/` populated with slice-specific content (not template placeholders): `acceptance.md` (this file, frozen), `test-plan.md`, `security.md`, `verification.md`. 68g register flips applied for C-V6 + C-V12 from 🟠 to 🟢 with citation to this slice. 68f C-N1a / C-N1c / C-N1d already 🟢; security.md notes which were *implemented* by this slice (verbatim copy consumption + structure rendering).
- **Verification:** `grep -L '{S-XX' docs/slices/S-F3-phase-nav/*.md | wc -l` returns 4 (no template placeholders). `verification.md` records all six DoD items completed. 13-item security checklist exercised in `security.md` — most items N/A for a foundation-component slice (no API routes, no T3+ data, no third-party flows); each N/A carries explicit reasoning per spec 72 §11 exemption pattern.
- **In scope:** All four slice docs populated; 68g register flips for C-V6 + C-V12.
- **Out of scope:** updating downstream slice docs (their authors do that); HANDOFF-59 retro (separate end-of-session step).
- **Opens blocked:** none.
- **Loveable check:** A future engineer reading the slice can understand what shipped, why, and what was deferred — including which 68f LOCKED entries this slice *implements* vs merely cites. Yes — delight for the reader.
- **Evidence at wrap:** all four slice docs present + populated; 68g C-V6 + C-V12 status flips visible in diff hunks.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-05-01 | User (informal) | Pre-AC scope locked | Scope: (1a) extend placeholder landing for visual smoke · (2i) single PR all 6 ACs · (3i) separate `<PhaseStepper>` + `<JourneyMapRail>` components. |
| 2026-05-01 | User | **AC frozen** | Implementation may begin. Change requests roll into re-drafted AC + re-slicing, not mid-slice scope shifts. |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
