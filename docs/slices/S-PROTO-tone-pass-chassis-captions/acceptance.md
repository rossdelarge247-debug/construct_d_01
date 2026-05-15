# S-PROTO-tone-pass-chassis-captions

**Category:** prototype

## Why

Phase 3 batch 4 of the Phase-1 audit register. Closes F-TONE-08 (`'Answer recorded — continue when ready.'` form-system register on O4/O5), F-TONE-09 (O3 `pickToContinue` form-instructional), F-TONE-10 (O3 `bothAnswered` flat).

CLAUDE.md anchor:

> *"A warm hand on a cold day — compassionate, professional, never patronising."*

Chassis captions are the bottom-of-screen status text that tells the user the system has registered their input — high-frequency text that establishes register tone across the flow.

## In scope

Five surgical caption-string edits across three files; copy-only.

- F-TONE-08a fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o4.ts:42` — `oneAnswered`.
- F-TONE-08b fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o5.ts:41` — `oneAnswered`.
- F-TONE-09a fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o3.ts:57` — `pickToContinue`.
- F-TONE-09b fix (audit-extension): `src/app/dev/proto/pre-signup-interview/lib/copy/o4.ts:41` — `pickToContinue`. Same form-instructional anti-pattern as O3's variant; audit walked O3 first but the discovery during batch implementation extends the fix to maintain cross-screen consistency.
- F-TONE-10 fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o3.ts:59` — `bothAnswered`.

Plus audit-register §Status table sync:
- F-TONE-05/06/13 rows (previous batch): `Merge sha = a6401eb` · `PR = #195`.
- F-TONE-08/09/10 rows (this batch): `Status = shipped` · `Slice = S-PROTO-tone-pass-chassis-captions` · `Merge sha = pending` · `PR = pending`.

## Out of scope

- Other 4 audit findings (each owns its own Phase 3 batch).
- O5's `pickToContinue` (`"Pick the answer closest to what's true today."`) — already the warmer reframe model per audit observation; no change needed.

## Acceptance criteria

### AC-1 — O4 `oneAnswered` drops form-system register

`o4.ts:42` changes from:

- BEFORE: `oneAnswered: 'Answer recorded — continue when ready.',`
- AFTER: `oneAnswered: 'Noted — keep going when you\'re ready.',`

Rationale per F-TONE-08: BEFORE uses admin-panel feedback vocabulary (`'Answer recorded'`). AFTER uses conversational acknowledgement matching the warm chassis-caption register.

### AC-2 — O5 `oneAnswered` drops form-system register

`o5.ts:41` changes from:

- BEFORE: `oneAnswered: 'Answer recorded — continue when ready.',`
- AFTER: `oneAnswered: 'Noted — keep going when you\'re ready.',`

Same change as AC-1; O5 carries an identical literal value, so the same edit applies to maintain cross-screen consistency.

### AC-3 — O3 `pickToContinue` drops form-instructional register

`o3.ts:57` changes from:

- BEFORE: `pickToContinue: 'Pick the option that fits best to continue.',`
- AFTER: `pickToContinue: 'Pick the one closest to how things feel right now.',`

Rationale per F-TONE-09: BEFORE is instructional ("Pick the option that fits best"). AFTER anchors in the user's actual experience (how things feel right now) and respects judgement.

### AC-4 — O4 `pickToContinue` drops form-instructional register

`o4.ts:41` changes from:

- BEFORE: `pickToContinue: 'Pick the option that fits to continue.',`
- AFTER: `pickToContinue: 'Pick the one closest to how things feel right now.',`

Audit-extension for cross-screen consistency. Same anti-pattern as AC-3; not flagged separately in Phase 1 but surfaced at batch implementation.

### AC-5 — O3 `bothAnswered` drops bare system-state

`o3.ts:59` changes from:

- BEFORE: `bothAnswered: 'Both answered.',`
- AFTER: `bothAnswered: 'Both noted — ready when you are.',`

Rationale per F-TONE-10: BEFORE is bare two-word system-state. AFTER uses warm acknowledgement + readiness handover, matching the chassis-caption pattern.

### AC-6 — Audit-register §Status table sync

`docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` §Status table updates:

- F-TONE-05/06/13 rows (previous batch): `Merge sha` `pending` → `a6401eb`; `PR` `pending` → `#195`.
- F-TONE-08/09/10 rows: `Status = ready for Phase 3 (...)` → `shipped`; slice column populated; merge sha + PR `pending`.

## Definition of Done

Spec 76 §5 verbatim:

> *"Spec 72 §11 specifies 14 checkbox items. For category=prototype, four items remain in scope:*
>
> *1. Item 1 — Data classification per AC. Prototypes declare T0 metadata explicitly; the declaration itself is the audit.*
> *2. Item 8 — Error handling. User-facing surface; generic errors with reference IDs apply even when the data is static. Prototype loveability includes graceful failure.*
> *3. Item 12 — Adversarial review. `/security-review` skill run on slice diff. Cheap; catches regressions in patterns the spec doesn't otherwise enforce.*
> *4. Item 14 — Secrets hygiene. `gitleaks` clean on slice branch. No exception for any category."*

Applied:

- DoD-1: All ACs (AC-1..AC-6) met with evidence in `verification.md`.
- DoD-8: N/A (copy-only).
- DoD-12: single-turn review (criterion in §"Adversarial review budget").
- DoD-14: `gitleaks` CI check verifies.

## Adversarial review budget

Spec 72b §"Decision criteria" row 1 verbatim:

> *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."*

Slice <300L; 5 surgical copy edits + 1 doc table update.

## Pre-flight notes

- TDD: pure-string copy edits.
- F-TONE-09 audit-extension to O4: documented in AC-4 rationale; cross-screen consistency preferred over surgical-scope-only treatment.
- 5 pre-existing screen test assertions reference the BEFORE strings; updated in this slice.
- Remaining batches owe separate slices: eyebrow + referent consistency (F-TONE-07 + F-TONE-14) · O7 inline polish (F-TONE-11 + F-TONE-12). Plan to bundle as one final PR.
