# S-PROTO-output-reassurance-O7

**Category:** prototype

Closes density/delight audit finding **F-OUT-03** (reassurance copy on plan-output journey-completion moment). 1 of 3 audit F-OUT findings shipped this slice; F-OUT-01 (Tier 1-4 plan output framework) + F-OUT-02 (per-domain confidence indicators) deferred per cross-spec design conflict surfaced at scoping time.

## Scope-conflict context (informs Out of scope)

The audit catalogues F-OUT-01..03 as gaps vs V1 baseline (`docs/v1/v1-wireframes.md`). Cross-checked at scoping:

- **Spec 65 §O7 (L138-148, verbatim):** *"Contains: Situation summary (reflecting O1-O6) · The divorce journey (visual timeline...) · What needs to happen · The conventional path · How Decouple helps · Personalised notes (based on their specific situation) · Links: find out more → pricing"* — 7 sections, no tier framework, no confidence indicators, no CONFIDENCE MAP. "Personalised notes" is the only adaptivity hook.
- **Spec 67 §Gap 1 (L85-86, verbatim, "RESOLVED"):** *"Moment 1 (immediate post-signup) acknowledges what we already know. Post-signup profiling skips what's answered and goes direct to follow-ups based on pre-signup state."* — pre-signup state ROUTES post-signup BEHAVIOUR, not pre-signup confidence-grading.
- **Spec 34 §Tier 1/2/3 (L188-237):** item-level bank-data triage (matched/expected/unknown). Different concept from V1's plan-level Tier 1-4 (full/partial/thin/not-ready) — same word, different referent.
- **Known/Estimated/Unsure/Unknown vocab:** pre-pivot specs only (05b, 06, 11, 12). CLAUDE.md §"Technical rules": *"Do not reference pre-pivot specs (03-06, 11, 12) — the architecture changed."* Active spec 67 (post-signup) doesn't use this vocab.

F-OUT-03 (reassurance copy) is unaffected by the conflict — it's a copy add that doesn't touch any specced architecture. F-OUT-01 + F-OUT-02 require spec 65/67 amendment work before they're slice-ready.

## Acceptance criteria

**AC-1: Reassurance copy renders on O7 just before the Footer.**

Copy is V1 verbatim (`docs/v1/v1-wireframes.md` L301): *"You've built a strong starting position."*

Position: in `MobileReadyView` of `src/app/dev/proto/pre-signup-interview/screens/O7.tsx`, between the existing `PersonalisedNotes` section (current last section in document order) and the `Footer` component.

Audit framing (F-OUT-03): *"warm-hand-on-a-cold-day positioning loses its concrete expression at the journey-completion moment, sibling to F-DEN-04's gap at the entry moment."*

Treatment: a new `Reassurance` component as the closing section. Quiet warm tone: serif font (matching `FONT_SERIF` used by `MobileHero` / `SituationSummary` titles), centred text-align, modest size (smaller than section headers but larger than fine print), muted color tier (`colors.sub` or warmer equivalent), padding matching the existing `SECTION_PAD` constant. Visual iteration expected at preview-deploy per established pattern.

**AC-2: Reassurance uses the existing staggered entry animation.**

`staggerIndex={7}` extends the existing progression: Hero implicit → SituationSummary 1 → DivorceJourney 2 → WhatNeedsToHappen 3 → ConventionalPath 4 → DecoupleHelps 5 → PersonalisedNotes 6 → **Reassurance 7**. Uses existing `sectionEntryStyle(staggerIndex)` helper + `styles.entry` className for animation continuity with adjacent sections. No new animation rules; no new CSS keyframes.

**AC-3: `prefers-reduced-motion` honoured.**

Inherits chassis-level `@media (prefers-reduced-motion: reduce)` behaviour via the shared `sectionEntryStyle` helper + `styles.entry` className. No new motion to guard; no new reduced-motion override needed.

**AC-4: Unit test asserts copy renders + correct positioning.**

`tests/unit/proto-pre-signup/output-reassurance.test.tsx`:
1. Renders `<O7/>` (post-generating-state — uses scenario data that drives `MobileReadyView`).
2. Asserts the copy *"You've built a strong starting position."* is in the DOM.
3. Asserts document-order positioning: the reassurance element appears AFTER the `PersonalisedNotes` content but BEFORE the Footer's *"What's next"* CTA label.

**AC-5: No regression in adjacent slices.**

`npm test -- --run` → 555+/555+ green; `npx tsc --noEmit` → clean; `npm run lint` → 0 errors (pre-existing warnings unchanged). Existing F-DEN/F-DEL slices' tests pass.

**AC-6: Preview-deploy 6+1 walk evidenced in `verification.md`.**

Per spec 72a 6-dim rubric (golden path · edge cases · `prefers-reduced-motion` · keyboard-only · 375×667 mobile · screen reader). Light-touch — no new animations introduced beyond inheriting existing stagger.

## Out of scope

- **F-OUT-01 (Tier 1-4 plan output framework)** — deferred per the §Scope-conflict context above. Spec 65 §O7 reconciliation intentionally did not carry V1's tier framework forward; spec 67 §Gap 1 chose a routing-not-grading post-signup architecture. Requires spec 65 amendment slice before any AC drafting.
- **F-OUT-02 (per-domain confidence indicators ●◐○ + CONFIDENCE MAP)** — deferred per same. Vocab is pre-pivot; spec 67 (post-signup) hasn't shipped a confidence vocab yet; pre-signup adoption would risk vocab-collision with whatever post-signup eventually amends to.
- **Visual-treatment iteration beyond initial draft** — captured via preview-deploy walk + iteration per the established pattern.
- **O7 mid-screen content rendering checks beyond the new reassurance** — covered by adjacent-slice no-regression tests, not introduced here.
- **Audit-text amendment to reframe F-OUT-01..02 as spec-conflict rather than V1-gap** — small docs follow-up; deferred to session wrap or separate docs PR to keep this slice surgical.

## References

- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-03 — audit finding
- `docs/v1/v1-wireframes.md` L301 — verbatim copy source
- `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §O7 (L138-148) — spec 65 plan-output content list (silent on reassurance; copy add doesn't conflict)
- `docs/workspace-spec/67-post-signup-profiling-progress.md` §Gap 1 (L84-122) — post-signup pre-signup-data-bridge architecture
- `docs/workspace-spec/26-transitions-animations.md` §1 — section entry stagger (inherited; no new rules)
- CLAUDE.md §"Product rules" *"warm hand on a cold day"* + §"Coding conduct" surgical changes + §"Canvas-as-source (prototype default)" — visual iteration via preview-deploy
