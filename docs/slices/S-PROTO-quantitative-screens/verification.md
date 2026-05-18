# Verification — S-PROTO-quantitative-screens

## AC evidence

**AC-1 — Infrastructure: dispatcher + step constants.** ✓
- `SCREEN_COUNT = 12` added at `src/app/dev/proto/pre-signup-interview/lib/types.ts:118`.
- `TOTAL_STEPS = 8` preserved at `types.ts:117` (existing screens unchanged).
- `proto-context.tsx` `next` / `back` / `goTo` clamps use `SCREEN_COUNT`.
- `page.tsx` switch extended: case 7 → `QuantBridge`, 8 → `O6_5`, 9 → `O6_6`, 10 → `O6_7`, 11 → `O7`, 12 → `O8`.

**AC-2 — Q-bridge transition screen (step 7).** ✓
- `screens/QuantBridge.tsx`: heading + 2 paragraphs verbatim from spec 65b L45-51.
- Primary CTA "Continue" → `next()` → step 8.
- Secondary "Skip the quantitative section" → `goTo(11)` → O7, leaving `answers.quantitative` undefined.
- `<TopBar step={6} total={8} onBack={back} />` (frozen pill).

**AC-3 — O6.5 children's age section (step 8, conditional).** ✓
- `screens/O6_5.tsx`: children section rendered iff `answers.situation?.hasChildren === 'yes'`.
- When `situation.childrenCount === 1`, single `BucketPicker` labelled "Your child".
- Otherwise, Youngest + Oldest pair rendered.
- 5 age-band options per spec L69-70 plus auto-included "Prefer not to say" via `BucketPicker`.
- Selection writes to `quantitative.child_age_youngest` / `_oldest`; "Prefer not to say" writes `null`.

**AC-4 — O6.5 expansion toggle + 3 fields.** ✓
- `ExpansionToggle` with spec L78 label verbatim.
- Rationale strapline (spec L91-93) always visible.
- Open-state reveals 3 pickers: `your_age` (5 bands), `ex_age_relative` (4 options, "Don't know" mapped to `unknown`), `relationship_length` (5 bands).
- Toggle closed without picking = no state write (state remains untouched).

**AC-5 — O6.6 preamble + 2 core fields (step 9).** ✓
- `screens/O6_6.tsx`: preamble paragraph verbatim from spec L108-111, always shown.
- `BucketPicker<IncomeBracket>` for `combined_monthly_income`; `BucketPicker<TotalAssetsBracket>` for `total_assets`.

**AC-6 — O6.6 expansion toggle + 4 fields with `property_equity` conditional.** ✓
- `ExpansionToggle` with spec L127 label verbatim; rationale from spec L148-150.
- `property_equity` picker rendered iff `answers.situation?.home !== 'rent'` (D-7 spec-vs-type mapping).
- `savings_cash` / `debts_non_mortgage` / `pension_value` always rendered when toggle open.

**AC-7 — O6.7 timeline core + final CTA (step 10).** ✓
- `screens/O6_7.tsx`: single-select picker with 6 options per spec L167-172 + "Prefer not to say".
- Final CTA reads "Continue to your plan" per spec L204 (NOT "Continue").

**AC-8 — O6.7 expansion multi-select drivers.** ✓
- `MultiPicker<TimelineDriver>` with 7 options per spec L187-193.
- Selection toggles in/out of the array; writes `quantitative.timeline_drivers` as `ReadonlyArray<TimelineDriver>`.

**AC-9 — Per-screen Skip + per-field "Prefer not to say" semantics.** ✓
- Each new screen's `Footer.secondaryActions` slot renders a "Skip this screen" button wired directly to `next()` (no state write).
- `BucketPicker` always renders an auto-included "Prefer not to say" radio that calls `onChange(null)`.

**AC-10 — Frozen-pill behavior + back-button navigation.** ✓
- Bridge + O6.5 + O6.6 + O6.7 all render `<TopBar step={6} total={8} onBack={back} />`.
- O7 still passes hardcoded `step={7}`, O8 still passes hardcoded `step={8} total={8}` — no edit to either file needed.
- Back arrow on bridge returns to step 6 (O6); back arrow on O6.5/O6.6/O6.7 returns to the previous quant screen.

**AC-11 — Regression check + state-wire unit tests.** ✓
- 71 existing build-plan tests unchanged. Full proto-pre-signup test run: **29 files / 318 tests pass**.
- New test file `tests/unit/proto-pre-signup/quantitative-screens-state-wire.test.tsx` adds 11 tests covering `BucketPicker` (5 tests), `MultiPicker` (3 tests), `ExpansionToggle` (3 tests).
- Test descriptions are behavioural (no AC-N references per CLAUDE.md §"Coding conduct" §"Comments: WHY not WHAT").

## Preview-deploy verification

Pending user review against the Vercel preview for this branch. Rubric file: `docs/workspace-spec/72a-preview-deploy-rubric.md`.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | PENDING | O6 → Q-bridge → O6.5 → O6.6 → O6.7 → O7 flow check |
| Edge cases | PENDING | hasChildren='no' skips children section; home='rent' hides property_equity; single-child labelling |
| `prefers-reduced-motion` | PENDING | No motion added in this slice (expansion toggle is instant show/hide); inherits parent prefs |
| Keyboard-only | PENDING | Tab through all radios and toggle button; aria-pressed / aria-expanded readback |
| Mobile viewport (375×667) | PENDING | All screens use max-width 480 with padding; should fit |
| Screen-reader | PENDING | Pickers have `role="radiogroup"` + `aria-labelledby`; MultiPicker uses `role="checkbox"`; ExpansionToggle uses `aria-expanded` + `aria-controls` |

## Definition of Done check (`category: prototype` short-form)

| Item | Status |
|---|---|
| 1. AC met with evidence | ✓ above |
| 8. No secrets in src or commit messages | ✓ |
| 12. No console errors in browser dev console | PENDING preview-deploy review |
| 14. Preview-deploy 6-dimension rubric | PENDING (table above) |

Per-slice DoD:
- Tests written + passing: ✓ (318/318)
- Adversarial review: PENDING (deferred to PR auto-review fan-out)
- Preview deploy: PENDING
- No regression in adjacent slices: ✓ (all 318 tests including 8 canvas-as-source tests for O1-O8 pass)
- 68f/g register entries: none applicable

## Architectural deferrals

None. State-wire logic stays inline in each screen's `update` closure (simple object-spread setter); not extracted to a separate module because the abstraction has no other consumers and the code is small enough to read at the call site.

## §Status

Slice impl shipped on branch `claude/session-105-O6-quantitative-screens` at `ecf2d43`.

| Round | Action | Date |
|---|---|---|
| Scaffold | acceptance.md drafted; 11 ACs + 9 design decisions; user sign-off received | 2026-05-18 |
| Impl | 4 screens + 3 shared components + dispatcher wire + 11 unit tests; 318/318 pass; typecheck clean; lint 0 new warnings | 2026-05-18 |
| Verification | verification.md drafted (this file); preview-deploy review + adversarial review pending | 2026-05-18 |
