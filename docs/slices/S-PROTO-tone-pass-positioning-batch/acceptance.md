# S-PROTO-tone-pass-positioning-batch

**Category:** prototype

## Why

Phase 3 batch 1 implementation of the audit register frozen in `docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` (Phase 2 amendment merged on main: all 14 findings STRONG). This batch lands the 3 positioning fixes — copy that, untouched, would risk readers framing Decouple as a financial-disclosure sub-product or being broken out of its analyst-by-your-side register.

CLAUDE.md anchors driving the batch:

> *"Decouple is the complete settlement workspace for separating couples — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. It is NOT a financial disclosure tool."*

> *"When drafting any user-facing copy, engine messaging, or session output: never frame Decouple as 'a financial disclosure tool.' The complete settlement workspace framing is load-bearing."*

> *"A warm hand on a cold day — compassionate, professional, never patronising."*

## In scope

Three surgical string edits across three files. No structural / schema / type changes; copy-only.

- F-TONE-01 fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts:48` — `'decided'` stage sub-copy.
- F-TONE-02 fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o2.ts:43` — O2 eyebrow.
- F-TONE-03 fix: `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:92` — `'ongoing-support'` priority-note's Decouple-explanation clause.

Audit-register status-table update (`docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md`): 3 rows (F-TONE-01/02/03) move from `ready for Phase 3 (positioning batch)` → `shipped` + slice column populated.

## Out of scope

- Other 11 audit findings (each owns its own Phase 3 batch per audit-register §Workflow).
- F-TONE-13 option-label update (Phase 3 batch 3 will land it; the `'ongoing-support'` priority-note lead-phrase `'Because future financial support matters most to you,'` stays as-is here until batch 3 updates option + lead together).
- Any tone-pass surface not surfaced in the Phase 1/2 audit.

## Acceptance criteria

### AC-1 — `'decided'` stage sub-copy no longer narrows Decouple to finances

`src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts:48` `'decided'` option's `sub` field changes from:

- BEFORE: `'You want to get the finances sorted.'`
- AFTER: `'You want to make a clear plan.'`

Rationale per audit F-TONE-01 (`docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md`): the BEFORE narrows Decouple to a financial-disclosure sub-product (the user has "decided to separate" and is told Decouple's value is "get the finances sorted" — financial disclosure framing). The AFTER preserves the personal anchor + plan framing without breaking the four-dimensional settlement workspace promise (children, housing, finances, future needs).

Sibling sub-copies (lines 49-50) are unchanged — `'thinking'` and `'in_process'` already use plan-framed wording.

### AC-2 — O2 eyebrow drops developer-facing screen identifier

`src/app/dev/proto/pre-signup-interview/lib/copy/o2.ts:43` `eyebrow` field changes from:

- BEFORE: `'O2 · Your situation'`
- AFTER: `'Your situation'`

Rationale per audit F-TONE-02: the BEFORE leaks the dev-internal screen ID (`'O2'`) into user-facing eyebrow text. No other screen in the pre-signup interview surfaces its dev ID this way (O1 eyebrow: `'To start your plan…'`; O3 eyebrow: `'Your ex'`; etc.). The AFTER is the user-facing label only.

### AC-3 — `'ongoing-support'` priority-note's Decouple-clause replaces analyst-systems jargon with plain language

`src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:92` line changes from:

- BEFORE: `'ongoing-support': 'Because future financial support matters most to you, Decouple helps you map maintenance scenarios against bank-evidenced income.',`
- AFTER: `'ongoing-support': 'Because future financial support matters most to you, Decouple maps what\'s coming in and going out for both of you — so you can see what\'s actually workable.',`

Rationale per audit F-TONE-03: the BEFORE Decouple-clause `'map maintenance scenarios against bank-evidenced income'` reads as analyst-writing-to-analyst (systems vocabulary: *map* / *scenarios* / *bank-evidenced income*). The AFTER uses plain language — concrete words for what Decouple does, grounded in the user's actual worry (whether the numbers will work for the supported side).

Lead phrase `'Because future financial support matters most to you,'` is unchanged in this batch. F-TONE-13 (Phase 3 batch 3) will re-align it when the option label updates.

### AC-4 — Audit-register status table reflects the ship

`docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` §Status table rows for F-TONE-01, F-TONE-02, F-TONE-03 update:

- BEFORE (each row): `Status = ready for Phase 3 (positioning batch)` · `Slice = —` · `Merge sha = —` · `PR = —`
- AFTER (each row): `Status = shipped` · `Slice = S-PROTO-tone-pass-positioning-batch` · `Merge sha = pending` · `PR = pending`

Post-merge follow-up: `Merge sha` + `PR` columns updated with actual values in next session's wrap or via direct amendment to main.

## Definition of Done

CLAUDE.md §"Engineering conventions" §"Definition of Done (per slice)". This slice is `**Category:** prototype` (path-default; no override per spec 76 §2).

Spec 76 §5 sets the prototype short-form DoD-14 verbatim:

> *"Spec 72 §11 specifies 14 checkbox items. For category=prototype, four items remain in scope:*
>
> *1. Item 1 — Data classification per AC. Prototypes declare T0 metadata explicitly; the declaration itself is the audit.*
> *2. Item 8 — Error handling. User-facing surface; generic errors with reference IDs apply even when the data is static. Prototype loveability includes graceful failure.*
> *3. Item 12 — Adversarial review. `/security-review` skill run on slice diff. Cheap; catches regressions in patterns the spec doesn't otherwise enforce.*
> *4. Item 14 — Secrets hygiene. `gitleaks` clean on slice branch. No exception for any category."*

Applied to this slice:

- DoD-1: All ACs (AC-1..AC-4) met with evidence in `verification.md`.
- DoD-8 (Item 8 from §5 above): Error handling — N/A (copy-only slice, no error paths touched).
- DoD-12 (Item 12 from §5 above): Adversarial review done — see §"Adversarial review budget" below.
- DoD-14 (Item 14 from §5 above): `gitleaks` clean on slice branch (covered by CI `Gitleaks scan` check run).
- Slice-DoD-14: Audit-register §Status table updated (covered by AC-4).

## Adversarial review budget

Spec 72b §"Decision criteria" row 1 sets the structure verbatim:

> *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."*

Slice acceptance.md is <300 lines (≈100L), 3 surgical copy edits + 1 doc table update, prototype category. Single-turn review applies (no partition, no multi-turn budget envelope, no inline file content).

## Pre-flight notes

- TDD doesn't apply per CLAUDE.md §"Engineering conventions" §"TDD where tractable": this is a pure-string slice. Falls under `pure-rename:` category in `docs/tdd-exemption-allowlist.txt`. Visual-regression covers via preview-deploy 6-dim verification.
- Per audit-register §Workflow §Phase 3: this is "Batch (positioning fixes)". Remaining 5 batches owe separate slices (CTA pass · plan-output warmth · chassis caption pass · eyebrow + referent consistency · O7 inline polish).
- Hold the lead-phrase coupling between F-TONE-03 (this slice) + F-TONE-13 (batch 3) explicit in §"Out of scope" — when batch 3 updates the option label, the lead phrase here must update together.
