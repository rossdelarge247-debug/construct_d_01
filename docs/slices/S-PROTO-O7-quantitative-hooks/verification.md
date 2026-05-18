# S-PROTO-O7-quantitative-hooks — verification

## AC-1 — `Quantitative` interface + `Answers.quantitative?` field

- `Quantitative` interface at `src/app/dev/proto/pre-signup-interview/lib/types.ts` mirrors the spec 65b state-extension shape (L226-246) field-by-field.
- 12 new bucket type aliases (`ChildAge`, `AdultAge`, `ExAgeRelative`, `RelationshipLength`, `IncomeBracket`, `TotalAssetsBracket`, `PropertyEquityBracket`, `SavingsCashBracket`, `DebtsBracket`, `PensionValueBracket`, `TargetTimeline`, `TimelineDriver`) exported for downstream consumers (P3 UI slice).
- `Answers.quantitative?: Quantitative` appended; no changes to existing `Answers` field types.
- Backward compat: 42 existing tests in `tests/unit/proto-pre-signup/build-plan.test.ts` pass unchanged.

## AC-2 — `deriveSharingWeight()` (D5)

- `relationship_length ∈ {'10-20y', '20+y'}` → `'full'`. Test: `triggers(q({ relationship_length: '10-20y' }))` returns `['sharing-full-weight']`. Same assertion for `'20+y'`.
- `relationship_length ∈ {'<2y', '2-5y'}` → `'light'`. Test: `triggers(q({ relationship_length: '<2y' }))` returns `['sharing-light-weight']`. Same for `'2-5y'`.
- Middle bracket `'5-10y'` → `null`. Test: no `sharing-*` trigger emitted.
- `null` input → `null`. Test: no `sharing-*` trigger emitted.
- Does NOT reference `your_age` or `ex_age_relative` (per slice D-1).

## AC-3 — `deriveConsentTier()` (D6)

- `total_assets ∈ {'500k-1M', '>1M'}` OR `pension_value = '300k+'` → `'complex'`. 3 unit tests covering each trigger leg.
- `total_assets ∈ {'<10k', '10-50k'}` AND `pension_value ∈ {'none', '<25k'}` → `'light'`. 2 unit tests covering both `total_assets` brackets.
- Other non-null combinations → `'standard'`. Test: `(total_assets: '50-200k', pension_value: '100-300k')` → `'standard'`.
- Both `total_assets` and `pension_value` null → `null` (no D6 note).
- `property_equity` is captured but unused per the literal-trigger reading (same precedent as D-1).

## AC-4 — `deriveTimelineFraming()` (D7)

- `target_timeline ∈ {'asap', '3m'}` AND `timeline_drivers` includes `'deadline'` → `'deadline-pressure'`. 2 unit tests covering both `target_timeline` values.
- `target_timeline = 'asap'` AND `timeline_drivers` empty or undefined → `'unanchored-urgency'`. 2 unit tests covering both empty-array and missing-field cases.
- `target_timeline ∈ {'18m+', 'unsure'}` or null → `'patient'`. 3 unit tests covering each value.

## AC-5 — Notes composition (cap + ordering)

- `composeQuantitativeNotes` iterates D5 → D6 → D7 in spec order; first 2 firing triggers added; third dropped.
- `buildPlanFromAnswers.personalisedNotes` concats `composePersonalisedNotes` (categorical/anchor) + `composeQuantitativeNotes` (quantitative).
- Test "caps at 2 quantitative notes when all 3 dimensions fire" — input fires all 3; output has exactly 2 quantitative notes.
- Test "keeps first 2 in D5 → D6 → D7 order when all 3 fire" — output[0] = `'sharing-full-weight'`, output[1] = `'consent-tier-complex'`; no `timeline-*` trigger present.
- Test "falls through to D6 + D7 when D5 returns null" — middle-bracket `relationship_length` (D5 null) + active D6 + D7 → output is `['consent-tier-complex', 'timeline-deadline-pressure']`.

## AC-6 — Trigger strings verbatim per spec

- 8 trigger strings used in code: `sharing-full-weight`, `sharing-light-weight`, `consent-tier-complex`, `consent-tier-light`, `consent-tier-standard`, `timeline-deadline-pressure`, `timeline-unanchored-urgency`, `timeline-patient`.
- Test assertions match against each verbatim via `toContain(trigger-string)`.

## AC-7 — Body copy

- 8 body strings drafted at impl time per spec emphasis phrases; tone follows Decouple's "warm hand on a cold day" convention.
- D5 sharing: "courts treating assets as joint regardless of named ownership" emphasis preserved; framing-fits-facts framing for `light`.
- D6 consent-tier: "bespoke consent-order drafting + likely need for valuations" for `complex`; "streamlined consent path" for `light`; standard-shape narrative for `standard` (fallback; not specced).
- D7 timeline: "court-deadline pathway, MIAM acceleration" for `deadline-pressure`; "naming the real driver before chasing speed (compassionate reframe)" for `unanchored-urgency`; "disclosure thoroughness over speed" for `patient`.
- Test "every quantitative note has a non-empty body of substantive length" asserts body length > 40 chars per note (placeholder for editorial review at PR time).

## AC-8 — Test coverage

- New file: `tests/unit/proto-pre-signup/build-plan-quantitative.test.ts`.
- 26 new tests across 6 describe blocks (D5, D6, D7, null tolerance, cap + ordering, body copy).
- Backward compat: 42 existing tests in `tests/unit/proto-pre-signup/build-plan.test.ts` pass unchanged.
- Total: 68 tests pass across both files; duration ~24ms.
- Mock count per test: 0 (no module mocks; no `vi.fn()` for collaborators). Test-pain audit (spec 72d §3 calibration) well below the prototype threshold of 5.

## AC-9 — Paired spec patch

- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` L295 (§"AI-coach integration" `ex_age_relative` row) updated.
- Before: `"Used locally by plan-engine for relative-age sharing-principle framing only"`
- After: `"Plan-engine does not consume this field; retained in state for future trigger extension when D5 rules are amended"`
- `spec-citation-quote-check` gate passes locally on the patched spec.

## Definition of Done

Per CLAUDE.md §"Engineering conventions" §"Definition of Done"; prototype category short-form (spec 76 §5 calibration matrix).

- [x] **DoD-1.** All ACs met, evidence above per AC. AC-7 body copy substantive but user-reviewable; placeholder length-check in tests.
- [x] **DoD-2.** Tests written and passing (68 / 68 local). Test-pain audit clear.
- [x] **DoD-3.** Adversarial review: PR auto-review fan-out will fire on push.
- [n/a] **DoD-4.** Preview-deploy verification: logic-only slice, no UI surface. Spec 72a six-dim rubric N/A; standard `## Preview-deploy verification` section omitted by design.
- [x] **DoD-5.** No regression: 42 existing `build-plan.test.ts` tests pass unchanged; type-check + ESLint clean for changed files.
- [x] **DoD-6.** No open 68f/g entries gating this slice.

Short-form 14-item security checklist (prototype category):

- [x] **Item 1 — No secrets in code or commits.** Verified via `git diff` review.
- [x] **Item 8 — No new third-party dependencies.** No package.json change.
- [x] **Item 12 — No new user-data egress.** Logic is local; no API calls; no analytics events added.
- [x] **Item 14 — Type-safety preserved.** `tsc --noEmit` clean.

## Persona findings recorded

To be appended after PR auto-review fan-out completes. Two strands tracked:

- 3 specialist auto-review verdicts (security · correctness · style) + aggregated verdict.
- Per-persona findings: count + brief one-line summary; whether main session missed each finding (Y/N).

Retain/drop tracking: this is the **3rd `src/` slice** post-rigour-v3b ship (after S-F1 + S-PROTO-copy-resolver-sweep). Session wrap MUST render the retain/drop verdict per CLAUDE.md §"Persona retain/drop metric".
