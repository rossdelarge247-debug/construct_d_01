# S-PROTO-O7-quantitative-hooks

**Category:** prototype

Extend `build-plan.ts` with 3 numeric-derived adaptivity dimensions composing alongside the existing 4 categorical hooks. Logic-only slice; no UI surface; no canvas link.

## Spec sources (verbatim)

Spec 65b §"Plan-output usage (O7 adaptivity extension)" L259 reads:

> "The quantitative layer adds 3 numeric-derived dimensions that compose alongside, not in place of, the categorical hooks"

Spec 65b §"Plan-output usage (O7 adaptivity extension)" L261-265 defines D5:

> "Dimension 5 — Sharing-principle weighting (derived from `relationship_length` + ages):
>
> - `relationship_length` in `{'10-20y', '20+y'}` → `personalisedNotes` trigger `sharing-full-weight`: emphasis on courts treating assets as joint regardless of named ownership.
> - `relationship_length` in `{'<2y', '2-5y'}` → trigger `sharing-light-weight`: emphasis on contribution-based claims being more common in shorter relationships.
> - Both fields `null` → no sharing-weighting note (falls through to spec 65 categorical hooks only)."

Spec 65b §"Plan-output usage (O7 adaptivity extension)" L267-271 defines D6:

> "Dimension 6 — Consent-tier complexity (derived from `total_assets` + `pension_value` + `property_equity`):
>
> - `total_assets` in `{'500k-1M', '>1M'}` OR `pension_value = '300k+'` → trigger `consent-tier-complex`: emphasis on bespoke consent-order drafting + likely need for valuations.
> - `total_assets` in `{'<10k', '10-50k'}` AND `pension_value` in `{'none', '<25k'}` → trigger `consent-tier-light`: emphasis on streamlined consent path.
> - Mixed or `null` → trigger `consent-tier-standard` (fallback)."

Spec 65b §"Plan-output usage (O7 adaptivity extension)" L273-277 defines D7:

> "Dimension 7 — Timeline pressure framing (derived from `target_timeline` + `timeline_drivers`):
>
> - `target_timeline` in `{'asap', '3m'}` AND `'deadline' ∈ timeline_drivers` → trigger `timeline-deadline-pressure`: emphasis on court-deadline pathway, MIAM acceleration where lawful.
> - `target_timeline = 'asap'` AND `timeline_drivers` empty/null → trigger `timeline-unanchored-urgency`: emphasis on naming the real driver before chasing speed (compassionate reframe).
> - `target_timeline` in `{'18m+', 'unsure', null}` → trigger `timeline-patient`: emphasis on disclosure thoroughness over speed."

Cap + composition rule per spec 65b §"Plan-output usage (O7 adaptivity extension)" L279:

> "This layer adds a parallel cap — max 2 quantitative-derived notes per render — bringing total max notes per render to 8 (4 categorical + 2 anchor + 2 quantitative)."

Spec 65b §"Data captured (state extension)" L226-246 defines the `preSignupState.quantitative` shape verbatim below; AC-1 mirrors this field-by-field as the `Quantitative` interface.

```
preSignupState.quantitative = {
  // Demographics (O6.5)
  child_age_youngest:     '0-4' | '5-11' | '12-15' | '16-17' | '18+' | null
  child_age_oldest:       '0-4' | '5-11' | '12-15' | '16-17' | '18+' | null
  your_age:               '<30' | '30-39' | '40-49' | '50-59' | '60+' | null
  ex_age_relative:        'same' | 'older' | 'younger' | 'unknown' | null
  relationship_length:    '<2y' | '2-5y' | '5-10y' | '10-20y' | '20+y' | null

  // Financials (O6.6)
  combined_monthly_income: '<2k' | '2-4k' | '4-6k' | '6-10k' | '>10k' | null
  total_assets:           '<10k' | '10-50k' | '50-200k' | '200-500k' | '500k-1M' | '>1M' | null
  property_equity:        '<50k' | '50-150k' | '150-300k' | '300-500k' | '500k+' | null
  savings_cash:           '<5k' | '5-20k' | '20-50k' | '50-100k' | '100k+' | null
  debts_non_mortgage:     'none' | '<5k' | '5-15k' | '15-30k' | '30k+' | null
  pension_value:          'none' | '<25k' | '25-100k' | '100-300k' | '300k+' | null

  // Time-intent (O6.7)
  target_timeline:        'asap' | '3m' | '6m' | '12m' | '18m+' | 'unsure' | null
  timeline_drivers:       Array<'deadline' | 'new_relationship' | 'housing' |
                                'children' | 'financial' | 'emotional' | 'none'>
}
```

## Design decisions (named uncertainties)

D-1. **D5 trigger scope: `relationship_length` only.** Spec §"Plan-output usage" L261 header lists "`relationship_length` + ages" but the trigger rules only reference `relationship_length`. Implement the literal trigger spec; "+ ages" treated as draft artifact. `ex_age_relative` and `your_age` are captured-but-unused in plan-engine for this slice.

D-2. **`ex_age_relative` AI-coach claim correction.** A paired spec patch in this slice's PR amends spec 65b's AI-coach integration table — `ex_age_relative` row — to remove a promise-without-delivery: the current row text asserts plan-engine consumes this field for relative-age sharing-principle framing, but per D-1 no D5 trigger references it. The replacement row text states plan-engine does not consume the field; it is retained in state for a future trigger extension. See AC-9 for the precise before/after text.

D-3. **Tie-break on >2 quantitative triggers: first-firing in D5 → D6 → D7 order.** Spec caps at 2 but doesn't specify ordering. Iterate dimensions in spec order; first 2 firing triggers win; third dropped. Deterministic, simplest implementation.

D-4. **Type extension: `Quantitative` interface added to `lib/types.ts`; optional `quantitative?` field appended to `Answers`.** Lowest blast radius on existing call sites; backward-compatible with all current tests.

D-5. **New test file `build-plan-quantitative.test.ts`.** Existing `build-plan.test.ts` continues unchanged for categorical-hook coverage; quantitative-hook coverage isolated for readability.

## Acceptance criteria

**AC-1.** `Quantitative` interface added to `src/app/dev/proto/pre-signup-interview/lib/types.ts` mirroring the spec 65b state-extension shape reproduced in §"Spec sources" above (13 fields, all optional/nullable). `Answers` interface gains optional `quantitative?: Quantitative`. No changes to existing `Answers` field types.

**AC-2.** `deriveSharingWeight(answers: Answers): 'full' | 'light' | null` implemented per spec D5 triggers. Returns `'full'` when `quantitative.relationship_length ∈ {'10-20y', '20+y'}`; `'light'` when `quantitative.relationship_length ∈ {'<2y', '2-5y'}`; `null` otherwise (including `null` or `undefined` quantitative). Does NOT reference `your_age` or `ex_age_relative` (per D-1).

**AC-3.** `deriveConsentTier(answers: Answers): 'complex' | 'light' | 'standard' | null` implemented per spec D6 triggers. Returns `'complex'` when `total_assets ∈ {'500k-1M', '>1M'}` OR `pension_value = '300k+'`; `'light'` when `total_assets ∈ {'<10k', '10-50k'}` AND `pension_value ∈ {'none', '<25k'}`; `'standard'` for any other non-null combination; `null` only when both `total_assets` and `pension_value` are null (or quantitative is absent).

**AC-4.** `deriveTimelineFraming(answers: Answers): 'deadline-pressure' | 'unanchored-urgency' | 'patient' | null` implemented per spec D7 triggers. Returns `'deadline-pressure'` when `target_timeline ∈ {'asap', '3m'}` AND `timeline_drivers` includes `'deadline'`; `'unanchored-urgency'` when `target_timeline = 'asap'` AND `timeline_drivers` is empty or null; `'patient'` when `target_timeline ∈ {'18m+', 'unsure'}` or `target_timeline` is null; `null` when quantitative is absent OR when `target_timeline ∈ {'6m', '12m'}` with no `deadline` driver. Mid-range timeline values are not specced for D7 (spec L273-277 lists no rule for them); falling through to no D7 note is the documented behaviour.

**AC-5.** `composePersonalisedNotes(answers)` in `build-plan.ts` extended to append up to 2 quantitative-derived notes after the existing categorical/anchor notes. Iterate D5 → D6 → D7 in spec order; first 2 firing triggers added; third dropped (per D-3). `null` returns from the derive functions are skipped (no note added for that dimension).

**AC-6.** Quantitative notes use trigger strings verbatim per spec: `sharing-full-weight`, `sharing-light-weight`, `consent-tier-complex`, `consent-tier-light`, `consent-tier-standard`, `timeline-deadline-pressure`, `timeline-unanchored-urgency`, `timeline-patient`. Trigger string is the canonical key for note identity (test assertions match on trigger).

**AC-7.** Note body copy drafted in code per spec emphasis text. Each trigger's body uses the spec's "emphasis on X" phrase as the substantive content, framed in Decouple's "warm hand on a cold day" tone (CLAUDE.md §"Product rules"). Body text reviewed at AC sign-off; user may correct individual entries before code lands.

**AC-8.** New test file `tests/unit/proto-pre-signup/build-plan-quantitative.test.ts` covers:

- Per-dimension unit tests: each of 8 trigger conditions across D5/D6/D7 produces the expected trigger string + non-empty body.
- Null-tolerance: `answers.quantitative = undefined` and all-`null` field cases produce zero quantitative notes; existing categorical notes remain unaffected.
- Cap + ordering integration: when all 3 dimensions fire, first 2 in D5 → D6 → D7 order win; third dropped.
- Backward compat: existing `tests/unit/proto-pre-signup/build-plan.test.ts` runs unchanged and passes.

**AC-9. Paired spec patch.** Spec 65b §"AI-coach integration" `ex_age_relative` row patched per D-2 in same PR. The row's amended text reads:

> "Plan-engine does not consume this field; retained in state for future trigger extension when D5 rules are amended"

Replaces the prior row text "Used locally by plan-engine for relative-age sharing-principle framing only" (promise-without-delivery per slice D-1).

## Out of scope

- Free numeric input (spec 65b L335, "What this does NOT cover" section).
- Validation logic on bucket plausibility (spec 65b L339, same section).
- UI surface for O6.5 / O6.6 / O6.7 screens (separate P3 slice).
- `ex_age_relative` and `your_age` plan-engine usage (deferred per D-1).
- Severity-based note ordering (deferred per D-3).
- Spec 67 Bridge-from-pre-signup Replace-at-Moment-3 wiring (post-signup; this slice is pre-signup-only).
- AI-coach payload egress logic (separate slice; this slice is logic-only).
- Wireframes / visual treatment.

## References

- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` — primary spec.
- `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §"Adaptive plan shape" L149-203 — 4 categorical hooks this layer composes alongside.
- `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` — composition site.
- `src/app/dev/proto/pre-signup-interview/lib/types.ts` — type extension site.
- `tests/unit/proto-pre-signup/build-plan.test.ts` — existing test file (unchanged).
- `docs/slices/S-PROTO-O7-adaptive-hooks/acceptance.md` — precedent slice for the 4 categorical hooks.
