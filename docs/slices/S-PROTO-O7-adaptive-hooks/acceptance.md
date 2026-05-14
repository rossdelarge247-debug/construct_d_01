# S-PROTO-O7-adaptive-hooks

**Category:** prototype

Stage 4 (impl) of `docs/slices/S-65-amendment-F-OUT-01-02/` downstream landing plan. Implements the 4 adaptivity dimensions locked in that slice's AC-3 and shipped into spec 65 §O7 *"Adaptive plan shape"* at `docs/workspace-spec/65-pre-signup-interview-reconciled.md` L149-201. Closes F-OUT-01 + F-OUT-02 of `docs/slices/S-PROTO-pre-signup-density-delight-audit/`; both audit-slice §Status rows flip inline with this PR per `S-65-amendment-F-OUT-01-02` AC-7.

## Spec sources (verbatim)

**Spec 65 §O7 *"Adaptive plan shape"* (L151, verbatim):** *"The 7 elements above compose adaptively from pre-signup-available state via 4 adaptivity dimensions (categorical hooks, not confidence-grading; not Tier-class quantitative scoring). Schema grounded in `src/app/dev/proto/pre-signup-interview/lib/types.ts`; composition logic in `lib/build-plan.ts`."*

**Spec 65 §O7 *"Adaptive plan shape"* Dimension 1 — Stage (L153, verbatim):** *"`situationSummary` opening — existing 3-branch composition at `build-plan.ts` L29-31 (thinking → exploratory; decided → action-oriented; in_process → progress-oriented). `whatNeedsToHappen` intro/framing — per-stage prepended phrase: ... `links.primaryCTA` — copy iteration follows the same stage signal; final strings drafted at impl time."*

**Spec 65 §O7 *"Adaptive plan shape"* Dimension 2 — Partner-finances awareness (L162-166, verbatim):** *"`personalisedNotes` for `little` || `suspect` — existing `partner-finance-unknown` trigger at `build-plan.ts` L81-87 (retained). `personalisedNotes` for `full` — new trigger `partner-finance-full`: joint-prep language emphasising head-start advantage + bank-evidenced verification. `personalisedNotes` for `some` — new trigger `partner-finance-some`: caveated joint-prep emphasising partial picture + bank-evidenced fill-in."*

**Spec 65 §O7 *"Adaptive plan shape"* Dimension 3 — Example anchoring (L170-174, verbatim):** *"`situation.childrenCount` (1-4) → `situationSummary` extension: *"You have <N> children together."* `situation.home` (mortgage | own-outright | rent | other) → `situationSummary` new sentence: *"Your home is mortgaged."* / *"You own your home outright."* / *"You rent your home."* (skip if `other`). `whatMatters.priorities` → `personalisedNotes` trigger pattern `priority-{value}` (e.g., `priority-keep-home`). Cap: max 1 priority-driven note (first selected proxy). `whatMatters.worries` → `personalisedNotes` trigger pattern `worry-{value}` (e.g., `worry-hidden-assets`). Cap: max 1 worry-driven note (first selected proxy). Combined note cap: max 2 new anchor-driven notes per render; existing 4 trigger notes unaffected."*

**Spec 65 §O7 *"Adaptive plan shape"* Dimension 4 — Lead-ordering (L178-185, verbatim):** *"Lead category derived from selected priorities + worries + situational signals (coverage-weighted; tied → hardcoded fallback `children > housing > pensions > general`): `children` if `situation.hasChildren=yes` OR `whatMatters.priorities` includes `children-stability`; `housing` if `situation.home != rent` OR `whatMatters.priorities` includes `keep-home`; `pensions` if `whatMatters.priorities` includes `protect-pension` OR `whatMatters.worries` includes `losing-pension`; `general` (default fallback). Effect: lead phrase prepended to `situationSummary` BEFORE the stage-conditional opening (`build-plan.ts` L29-32 sits AFTER the new lead phrase); `whatNeedsToHappen` items reorder so the lead-relevant step appears at position 0."*

**Spec 65 §O7 *"Boundary"* (L189, verbatim):** *"This amendment governs pre-signup O7 only. Spec 67 §"Gap 1: Data bridge from pre-signup — RESOLVED" (L84-86) post-signup routing-not-grading architecture is unchanged — pre-signup `PlanContent` adaptivity is composed from pre-signup state only and does not introduce confidence-scoring vocabulary that would conflict with post-signup section-by-section confirmation at Moment 3."*

## Design decisions (named uncertainties, not silent-decided)

**1. Dim 1 + Dim 4 collision on `whatNeedsToHappen` array head.** Spec 65 amendment Dim 1 (L156-159) prescribes a per-stage intro phrase *prepended* to `whatNeedsToHappen`. Spec 65 amendment Dim 4 (L185) prescribes the lead-relevant step at *position 0* of `whatNeedsToHappen`. Both target the same array head.

Resolved per AC-3 of `S-65-amendment-F-OUT-01-02`: *"NO PlanContent shape change."* The stage intro is a framing line; the lead-step is the first substantive step. Items array convention: `[stageIntro, leadStep, ...remaining]` — intro at index 0 (framing), substantive steps from index 1 (with lead-relevant step first when one exists). Pensions lead has no corresponding substantive item in v1 `whatNeedsToHappen`; default substantive order preserved in that case (lead phrase still applies to `situationSummary`).

**2. Housing-score conservatism for `home === 'other'` + `home === undefined`.** Spec 65 §O7 L181 + parent slice AC-3 Dim 4 read literally: *"`housing` if `situation.home != rent` OR `whatMatters.priorities` includes `keep-home`"*. JS evaluation of `undefined !== 'rent'` is `true`, which would score housing=1 for empty answers (empty answers should plainly yield `lead='general'`, not `'housing'`). The `'other'` case is similarly ambiguous (no clear equity stake; semantics include "living with parents", "hostel", "non-standard"). Impl scores housing only on `home === 'mortgage' || home === 'own-outright'` (concrete equity) — narrower than the literal spec wording, broader than no-rule. Surfaced here rather than silent-decided per CLAUDE.md §"Coding conduct" §"Think before coding". A spec amendment to widen the rule (or add `lead-when-undefined`/`lead-when-other` semantics) is a follow-up if user feedback says the conservative interpretation is wrong.

## Acceptance criteria

**AC-1: Dimension 1 (Stage) wired.**

- `composeWhatNeedsToHappen` prepends a per-stage intro phrase at items[0] per spec 65 §O7 L156-159 (verbatim above). Three branches + default fallback.
- `primaryCTA` returns a per-stage string per spec 65 §O7 L160 (verbatim above). Three branches + `'Continue'` default fallback (matches pre-amendment behaviour).
- Existing `composeSituationSummary` 3-branch opening at build-plan.ts L29-31 retained verbatim (spec 65 §O7 L153-155).

**AC-2: Dimension 2 (Partner-finances awareness) wired.**

- Existing `partner-finance-unknown` trigger for `little | suspect` at build-plan.ts L81-87 retained verbatim (spec 65 §O7 L164).
- New `partner-finance-full` trigger for `awareness === 'full'`: joint-prep language emphasising head-start advantage + bank-evidenced verification (spec 65 §O7 L165).
- New `partner-finance-some` trigger for `awareness === 'some'`: caveated joint-prep emphasising partial picture + bank-evidenced fill-in (spec 65 §O7 L166).
- The 3 branches are mutually exclusive on `awareness` (one note max from this dimension per render).

**AC-3: Dimension 3 (Example anchoring) wired.**

- `composeSituationSummary` children sentence uses `childrenCount` when present: *"You have <N> children together."* (or *"You have 1 child together."* for the singular case). Falls back to current *"You have children together."* when `childrenCount` is absent (spec 65 §O7 L170).
- `composeSituationSummary` appends a home-description sentence per `situation.home`: mortgage / own-outright / rent → fixed strings per spec 65 §O7 L171 verbatim; `other` skipped.
- `composePersonalisedNotes` adds one `priority-{value}` trigger for `priorities[0]` when `priorities` is non-empty (spec 65 §O7 L172). Cap: max 1.
- `composePersonalisedNotes` adds one `worry-{value}` trigger for `worries[0]` when `worries` is non-empty (spec 65 §O7 L173). Cap: max 1.
- Combined anchor-driven cap: max 2 new notes (1 priority + 1 worry) per render; existing 4 trigger notes unaffected (spec 65 §O7 L174).

**AC-4: Dimension 4 (Lead-ordering) wired.**

- New `deriveLeadCategory(answers)` helper returns `'children' | 'housing' | 'pensions' | 'general'` per spec 65 §O7 L178-183 coverage-weighted scoring with hardcoded fallback `children > housing > pensions > general` on ties.
- `composeSituationSummary` prepends a per-lead-category phrase BEFORE the stage-conditional opening per spec 65 §O7 L185. `general` case adds no phrase (default fallback).
- `composeWhatNeedsToHappen` reorders so the lead-relevant substantive step appears at position 1 (after the stage intro at position 0; see §"Design decision" above) per spec 65 §O7 L185. `children` lead → moves children-arrangements item if `hasChildren=yes`; `housing` lead → moves housing-decisions item if `living=yes`; `pensions` + `general` → default substantive order.

**AC-5: Unit tests cover all 4 dimensions + key interactions.**

`tests/unit/proto-pre-signup/build-plan.test.ts` exercises `buildPlanFromAnswers` with input objects covering:

- Per-stage situationSummary opening (3 branches + undefined fallback).
- Per-stage whatNeedsToHappen intro at items[0] (3 branches + undefined fallback).
- Per-stage primaryCTA string (3 branches + undefined fallback).
- Per-awareness partner-finances trigger present in personalisedNotes (`full` / `some` / `little` / `suspect` / undefined).
- `childrenCount` in summary (singular + plural).
- `home` description in summary (mortgage / own-outright / rent / other / undefined).
- `priority-{value}` + `worry-{value}` triggers present + capped at 1 each.
- `deriveLeadCategory` over coverage-weighted scoring (single signal, multiple signals same category, tied across categories, no signal).
- Lead phrase in situationSummary for `children` / `housing` / `pensions` (not for `general`).
- `whatNeedsToHappen` reorder: children lead moves children-step to position 1 (when present); housing lead moves housing-step to position 1 (when present); pensions + general default order.

**AC-6: No regression in adjacent slices.**

- `npm test -- --run` green (post-slice count = pre-slice count + new tests).
- `npx tsc --noEmit` clean.
- `npm run lint` 0 errors; pre-existing warnings unchanged.

**AC-7: Preview-deploy 6+1 walk evidenced in `verification.md`.**

Per spec 72a 6-dim rubric (golden path · edge cases · `prefers-reduced-motion` · keyboard-only · 375×667 mobile · screen reader). O7 renders different `situationSummary` / `whatNeedsToHappen` / `personalisedNotes` / `primaryCTA` content per dimension state — the walk confirms visual fitness across the most common input combinations.

**AC-8: Audit-slice + S-65-amendment cross-references closed inline.**

Per `S-65-amendment-F-OUT-01-02` AC-7 (audit-slice §Status flip lands inline with the implementing PR, not as a separate docs PR):

- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-01 §Effect paragraph: "blocked pending spec amendment work" phrase replaced with explicit resolution-link to amended spec 65 §O7 + verbatim quote.
- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-02 §Effect paragraph: sibling treatment.
- §Status table F-OUT-01 + F-OUT-02 rows flip from `blocked` to `✓` with implementing slice + commit + PR refs.
- §References paragraph at L125 of audit slice updated to reflect resolution.

Per `S-65-amendment-F-OUT-01-02` AC-6 + AC-7 ship-state closure:

- That slice's AC-6 flips from PROVISIONAL → ✓ once impl + audit-flip land.
- That slice's AC-7 flips from OPEN → ✓ once impl + audit-flip land.
- §Status footer of that slice updated to reflect full ship.

## Out of scope

- **V1.5 reservations** per spec 65 §O7 *"Out of scope"* L191-199: complexity dimension · vocab calibration · safety/conflict beyond `suspect` hook · additional anchor surfaces · additional lead categories (`clean-break`, `ongoing-support`, `low-cost`, `speed`, `fair-split`). Deferred per spec 67 §Gap 11 L788 progressive-disclosure pattern.
- **No PlanContent shape change.** Per `S-65-amendment-F-OUT-01-02` AC-3 Q2 lock for Dim 4 Approach B. `links.primaryCTA` swaps from a constant `'Continue'` to a function-derived string but the type signature is unchanged.
- **No new pre-signup data collection.** Per `S-65-amendment-F-OUT-01-02` AC-3 Q4 lock.
- **No changes to O7.tsx rendering surface.** All adaptivity flows through `buildPlanFromAnswers` outputs; UI consumption is unchanged.
- **Visual-treatment iteration beyond initial draft** — captured via preview-deploy walk + iteration per the established prototype convention.

## References

- `docs/slices/S-65-amendment-F-OUT-01-02/acceptance.md` — parent slice (Stages 1-3 shipped; this slice = Stage 4)
- `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §O7 *"Adaptive plan shape"* L149-201 — amendment text (parent slice's AC-5 deliverable)
- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-01 + §F-OUT-02 — audit findings closed inline with this PR
- `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` — composition logic (impl target)
- `src/app/dev/proto/pre-signup-interview/lib/types.ts` — schema (Stage / Priority / Worry / Home / PartnerAwareness / ChildrenCount enums)
- CLAUDE.md §"Engineering conventions" §"Definition of Done" (prototype short-form per spec 76 §3 items 1, 8, 12, 14)
