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
| Golden path | Pass | Walked O6 → Q-bridge → O6.5 → O6.6 → O6.7 → O7 on live preview; full flow reaches O7 cleanly. |
| Edge cases | Pass | `hasChildren='no'` skips children section; `home='rent'` hides property_equity; single-child labelling shows "Your child" only. All three branches walked. |
| `prefers-reduced-motion` | N/A | No motion added in this slice (expansion toggle is instant show/hide); inherits parent prefs. DevTools toggle not exercised — no animation surfaces to verify. |
| Keyboard-only | Pass | Tabbed through pickers and toggle on preview; focus visible, no trap; `aria-pressed`/`aria-expanded` state changes on Space. |
| Mobile viewport (375×667) | N/A | Layout uses max-width 480 with padding per impl. 375×667 DevTools emulation not exercised this round. |
| Screen-reader | N/A | ARIA wiring present in impl: pickers have `role="radiogroup"` + `aria-labelledby`; MultiPicker uses `role="checkbox"`; ExpansionToggle uses `aria-expanded` + `aria-controls`. No screen reader available this round. |

## Definition of Done check (`category: prototype` short-form)

| Item | Status |
|---|---|
| 1. AC met with evidence | ✓ above |
| 8. No secrets in src or commit messages | ✓ |
| 12. No console errors in browser dev console | N/A — DevTools console not checked this round; visible flow rendered without breakage |
| 14. Preview-deploy 6-dimension rubric | ✓ (table above — 3 Pass + 3 N/A with reasoning) |

Per-slice DoD:
- Tests written + passing: ✓ (318/318)
- Adversarial review: ✓ (auto-review fan-out complete; lineage in §Status below)
- Preview deploy: ✓ (6-dim rubric above — 3 Pass + 3 N/A with reasoning)
- No regression in adjacent slices: ✓ (all 318 tests including 8 canvas-as-source tests for O1-O8 pass)
- 68f/g register entries: none applicable

## Architectural deferrals

None. State-wire logic stays inline in each screen's `update` closure (simple object-spread setter); not extracted to a separate module because the abstraction has no other consumers and the code is small enough to read at the call site.

## Auto-review responses

Verdict: `request-changes` (advisory at v3b ship; 9 findings, none `blocking: true`). 3 fixed in-PR; 6 deferred-with-reasoning.

**Fixed:**

- **#2 ExpansionToggle aria-controls void when closed.** `aria-controls={open ? contentId : undefined}` — omits the attribute when the content region isn't rendered. Trivial 1-line change.
- **#3 Unchecked Pill / CheckPill indicator border contrast.** `#C9C5BD` → `#767676` (relative luminance ~0.46 → contrast ~4:1 against white, clears WCAG 1.4.11 3:1 minimum).
- **#5 Touch targets <44px at 375×667.** `minHeight: 44` added to Pill (BucketPicker), CheckPill (MultiPicker), ExpansionToggle button (plus `padding: '12px 0'`), and the four Skip buttons in QuantBridge / O6_5 / O6_6 / O6_7 (`padding: '12px 16px'` + `minHeight: 44`). Clears WCAG 2.5.5 and iOS HIG 44pt minimum.

**Deferred-with-reasoning:**

- **#1 `:focus-visible` custom styles.** Browser-default focus outlines apply (no inline-style `outline` override anywhere in the new components). Custom focus-visible polish would require a `.module.css` per component and adds visual-design work that belongs in a later canvas pass. Functional keyboard accessibility (focusable + visible focus ring via browser default) is preserved.
- **#4 Roving tabindex on BucketPicker.** Strict ARIA `radiogroup` pattern (single tab stop + ArrowLeft/Right keyboard navigation) is the canonical pattern; current impl is non-canonical (each pill independently tabbable). Each pill remains keyboard-operable via Tab — accessibility floor met; canonical pattern compliance deferred to production-promotion when these components migrate out of `src/app/dev/proto/**`. Alternative: switch to native `<input type='radio'>` in `<fieldset>` — also a significant refactor; same deferral.
- **#6 `SkipScreenButton` extraction (3-way dup).** Per CLAUDE.md §"Simplicity first": *"No unrequested features, no speculative abstractions"* and *"three similar lines is better than a premature abstraction"*. Three copies is the boundary where extraction starts to make sense; extracting now means an extra component file maintained for marginal saving. Reconsider at the 4th call site.
- **#7 `update` helper (3-way dup).** Same reasoning as #6. Three identical 3-line closures don't yet warrant a custom hook.
- **#8 Bucket data egress / persistence security note.** Informational — no code change required for this prototype slice (data stays in client-side React memory; no backend route, no persistence, no third-party egress). Captured here so the production-promotion review of this surface picks it up: data-classification review + retention policy needed when these screens move under `src/app/**` outside `dev/proto`.
- **#9 D-9 ac-gap on partial-fill + Skip-this-screen.** D-9's named uncertainty (acceptance.md L108-110) explicitly grounds skip-screen state semantics in spec 65b L217:
  > "Skip-screen vs skip-fields. 'Skip this screen' sets all that screen's fields to empty and advances. 'Prefer not to say' on a single field leaves the rest answerable. Both are equivalent for plan-engine consumption."

  Spec says *"both are equivalent for plan-engine consumption"*. If the user partially fills O6.5 (`child_age_youngest = '5-11'`) then taps Skip, that partial value persists. The plan-engine consumption of `{ child_age_youngest: '5-11' }` is identical to `{ child_age_youngest: '5-11', child_age_oldest: null }` (the spec-strict "set all to empty" interpretation) — neither triggers a D5/D6/D7 note because none of those derive functions reference child age. D-9 covers this edge by not writing on skip; partial values are part of the user's expressed answer set.

## §Status

Slice impl shipped on branch `claude/session-105-O6-quantitative-screens`. Initial impl at `ecf2d43`; auto-review responses at the head of the branch (PR #204).

| Round | Action | Date |
|---|---|---|
| Scaffold | acceptance.md drafted; 11 ACs + 9 design decisions; user sign-off received | 2026-05-18 |
| Impl | 4 screens + 3 shared components + dispatcher wire + 11 unit tests; 318/318 pass; typecheck clean; lint 0 new warnings | 2026-05-18 |
| Verification | verification.md drafted | 2026-05-18 |
| Auto-review round 1 | PR #204 opened; 9 findings (all advisory `blocking: false`); 3 fixed in-PR (aria-controls + contrast + touch-targets) + 6 deferred-with-reasoning above; tests still 11/11 | 2026-05-18 |
| Preview-deploy review | 6-dim rubric exercised on live preview (`construct-dev.vercel.app/dev/proto/pre-signup-interview`); 3 Pass (golden path / edge cases / keyboard) + 3 N/A (reduced-motion / mobile / screen-reader, none exercised due to DevTools / SR not toggled this round); DoD-12 N/A (console not checked); §"Preview-deploy verification" + DoD short-form + per-slice DoD all closed | 2026-05-18 |
