# S-PROTO-tone-pass-plan-output-warmth

**Category:** prototype

## Why

Phase 3 batch 3 of the Phase-1 audit register. Closes three findings that all touch plan-output composition warmth: F-TONE-05 (leadPhrase housing + pensions flatness), F-TONE-06 (homeDescription mortgage clinical), F-TONE-13 (`'ongoing-support'` priority option label).

Plus the cascade deferred from batch 1: F-TONE-03's priority-note lead phrase needs realignment when the F-TONE-13 option label changes.

CLAUDE.md anchors driving the batch:

> *"A warm hand on a cold day — compassionate, professional, never patronising."*

> *"The experience should feel like having a brilliant, patient analyst sitting beside you through the whole separation."*

## In scope

Five surgical string edits across two files; copy-only.

- F-TONE-05a fix: `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:51` — `leadPhrase('housing')` return.
- F-TONE-05b fix: `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:52` — `leadPhrase('pensions')` return.
- F-TONE-06 fix: `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:77` — `homeDescription('mortgage')` return.
- F-TONE-13 fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o6.ts:56` — priority option `'ongoing-support'` `label`.
- F-TONE-03 cascade fix: `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:92` — priority-note `'ongoing-support'` lead phrase (Decouple-clause already shipped in batch 1).

Plus audit-register §Status table sync:
- F-TONE-04 row (previous batch): `Merge sha = 917af25` · `PR = #194`.
- F-TONE-05/06/13 rows (this batch): `Status = shipped` · `Slice = S-PROTO-tone-pass-plan-output-warmth` · `Merge sha = pending` · `PR = pending`.

## Out of scope

- Other 7 audit findings (each owns its own Phase 3 batch).
- `leadPhrase('finances')` and `leadPhrase('children')` — already warm + grounded per F-TONE-05 audit observation; no change needed.
- `homeDescription('own-outright')` and `homeDescription('rent')` — already subject-verb register-match (`'You own your home outright.'` / `'You rent your home.'`); no change needed.
- F-TONE-03 Decouple-clause (already shipped in batch 1, #193). Only the lead phrase remains here.

## Acceptance criteria

### AC-1 — `leadPhrase('housing')` warmer

`src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:51` switch case changes from:

- BEFORE: `case 'housing': return 'Decisions about your home shape what comes next.';`
- AFTER: `case 'housing': return 'Where each of you lives next sits at the heart of your plan.';`

Rationale per audit F-TONE-05: BEFORE is procedural ("Decisions about your home shape what comes next" reads as analyst description). AFTER grounds in the user's concrete concern (where each of you lives next) and matches the `'children'` case's warmth-register (`'Keeping things steady for the children comes first in your plan.'`).

### AC-2 — `leadPhrase('pensions')` warmer

`src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:52` switch case changes from:

- BEFORE: `case 'pensions': return 'Protecting pensions matters in this picture.';`
- AFTER: `case 'pensions': return 'What you\'ve each built up for later — your plan keeps that in view.';`

Rationale per audit F-TONE-05: BEFORE is meta-phrasing about importance ("Protecting pensions matters"); AFTER names what the pension actually is to the user (what you've each built up for later) and what the plan does with it (keeps that in view).

### AC-3 — `homeDescription('mortgage')` subject-verb match

`src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:77` switch case changes from:

- BEFORE: `case 'mortgage': return 'Your home is mortgaged.';`
- AFTER: `case 'mortgage': return 'You\'re paying off a mortgage on your home.';`

Rationale per audit F-TONE-06: BEFORE uses be-verb predicate framing home as financial label. AFTER restores subject-verb register-match with the sibling cases (`'You own your home outright.'` / `'You rent your home.'`).

### AC-4 — `'ongoing-support'` priority option label plain language

`src/app/dev/proto/pre-signup-interview/lib/copy/o6.ts:56` option `label` field changes from:

- BEFORE: `{ value: 'ongoing-support', label: 'Ongoing financial support' }`
- AFTER: `{ value: 'ongoing-support', label: 'Knowing one of us will still need support' }`

Rationale per audit F-TONE-13: BEFORE is administrative-form vocabulary; sibling option labels are warmer + grounded (`'A fair split of everything'`, `'Keeping the family home'`, `'Stability for the children'`). AFTER anchors in the user's emotional concern (the fact that one party will continue needing support).

### AC-5 — F-TONE-03 cascade: priority-note lead phrase realigns with new label

`src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:92` `'ongoing-support'` priority-note lead-phrase changes from:

- BEFORE (deferred from batch 1): `'ongoing-support': 'Because future financial support matters most to you, Decouple maps what\'s coming in and going out for both of you — so you can see what\'s actually workable.',`
- AFTER: `'ongoing-support': 'Because ongoing support matters most to you, Decouple maps what\'s coming in and going out for both of you — so you can see what\'s actually workable.',`

Rationale: batch 1 (#193) shipped the Decouple-clause plain-language rewrite while leaving the lead phrase per slice scope. This batch updates the lead phrase to mirror the new option label's emphasis on "ongoing support" (concept-aligned, short, matches the value key `'ongoing-support'`).

### AC-6 — Audit-register §Status table sync

`docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` §Status table updates:

- F-TONE-04 row (previous batch): `Merge sha` column `pending` → `917af25`; `PR` column `pending` → `#194`.
- F-TONE-05/06/13 rows: `Status = ready for Phase 3 (...)` → `shipped`; `Slice = —` → `S-PROTO-tone-pass-plan-output-warmth`; `Merge sha = —` → `pending`; `PR = —` → `pending`.

## Definition of Done

Spec 76 §5 verbatim sets the in-scope items:

> *"Spec 72 §11 specifies 14 checkbox items. For category=prototype, four items remain in scope:*
>
> *1. Item 1 — Data classification per AC. Prototypes declare T0 metadata explicitly; the declaration itself is the audit.*
> *2. Item 8 — Error handling. User-facing surface; generic errors with reference IDs apply even when the data is static. Prototype loveability includes graceful failure.*
> *3. Item 12 — Adversarial review. `/security-review` skill run on slice diff. Cheap; catches regressions in patterns the spec doesn't otherwise enforce.*
> *4. Item 14 — Secrets hygiene. `gitleaks` clean on slice branch. No exception for any category."*

Applied:

- DoD-1: All ACs (AC-1..AC-6) met with evidence in `verification.md`.
- DoD-8 (Item 8): N/A — copy-only slice, no error paths touched.
- DoD-12 (Item 12): single-turn review (full criterion in §"Adversarial review budget" below).
- DoD-14 (Item 14): `gitleaks` CI check verifies.

## Adversarial review budget

Spec 72b §"Decision criteria" row 1 verbatim:

> *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."*

Slice acceptance.md <300 lines, 5 surgical copy edits + 1 doc table update, prototype category.

## Pre-flight notes

- TDD: pure-string copy edits; tests added covering AC-1..AC-5 with positive + invariant cases.
- F-TONE-13 cascade-with-tests: existing tests asserting old `'Ongoing financial support'` option label will break; updated in this slice.
- Remaining batches owe separate slices (chassis caption pass · eyebrow + referent consistency · O7 inline polish).
