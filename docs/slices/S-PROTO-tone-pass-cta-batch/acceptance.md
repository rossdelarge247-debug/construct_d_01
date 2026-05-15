# S-PROTO-tone-pass-cta-batch

**Category:** prototype

## Why

Phase 3 batch 2 of the Phase-1 audit register's positioning fixes (F-TONE-04 — `'Continue'` CTA repeated bare across O1/O4/O5 + `primaryCTAForStage('decided')`).

Per CLAUDE.md §"Product rules" §"A warm hand on a cold day": every CTA should tell the user where they're going. Bare `'Continue'` is anodyne — sibling stage CTAs in `primaryCTAForStage` (`'thinking' → 'See what comes next'` · `'in_process' → 'Pick up from here'`) already show what warm + action-anchored looks like; the `'decided'` case + 3 screen CTAs are bare.

Also: housekeeping for the previous batch — write the merge sha + PR number into the F-TONE-01/02/03 audit-register rows (currently `pending`).

## In scope

Four surgical CTA-string edits across three files; copy-only.

- F-TONE-04 fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts:52` — `cta` value.
- F-TONE-04 fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o4.ts:45` — `cta.continue` value.
- F-TONE-04 fix: `src/app/dev/proto/pre-signup-interview/lib/copy/o5.ts:44` — `cta.continue` value.
- F-TONE-04 fix: `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:60` — `primaryCTAForStage('decided')` return.

Plus audit-register §Status table sync:
- F-TONE-01/02/03 rows (previous batch): `Merge sha = c3ee0cc` · `PR = #193`.
- F-TONE-04 row (this batch): `Status = shipped` · `Slice = S-PROTO-tone-pass-cta-batch` · `Merge sha = pending` · `PR = pending`.

## Out of scope

- Other 10 audit findings (each owns its own Phase 3 batch).
- `primaryCTAForStage` `default` case (line 62) — also bare `'Continue'`, but it's the fallback for unknown / undefined stage; bareness here is acceptable as a generic fallback. Not a positioning miss.
- O6 CTA `'Build my plan'` and O8 first-person CTAs — already warm + action-anchored; no audit finding.
- **Discovery, follow-up needed**: `src/app/dev/proto/pre-signup-interview/screens/O2.tsx:205` hardcodes `ctaLabel="Continue"` directly in JSX (does not use copy resolver). Same anti-pattern as F-TONE-04 but escaped Phase 1 audit because audit walked `lib/copy/*.ts` files only. Owns a follow-up batch (likely batched with future copy-resolver-completeness sweep) — not patched here to keep scope surgical to the audit's listed surfaces.

## Acceptance criteria

### AC-1 — O1 CTA names the destination

`src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts:52` `cta` field changes from:

- BEFORE: `'Continue'`
- AFTER: `'Set up your situation'`

User clicking the O1 CTA advances to O2 (whose eyebrow is `'Your situation'` post-batch-1). The new CTA names the destination.

### AC-2 — O4 CTA names the destination

`src/app/dev/proto/pre-signup-interview/lib/copy/o4.ts:45` `cta.continue` field changes from:

- BEFORE: `'Continue'`
- AFTER: `'Next: their side'`

User clicking the O4 CTA advances to O5 (whose eyebrow is `'Money · their side'`). The new CTA names the destination.

### AC-3 — O5 CTA names the destination

`src/app/dev/proto/pre-signup-interview/lib/copy/o5.ts:44` `cta.continue` field changes from:

- BEFORE: `'Continue'`
- AFTER: `'Next: what matters to you'`

User clicking the O5 CTA advances to O6 (whose eyebrow is `'What matters · last step before your plan'`). The new CTA names the destination.

### AC-4 — `primaryCTAForStage('decided')` warmer

`src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:60` switch case changes from:

- BEFORE: `case 'decided': return 'Continue';`
- AFTER: `case 'decided': return 'Begin the plan';`

This puts the `'decided'`-stage user's primary CTA on equal warmth-footing with `'thinking'` (`'See what comes next'`) and `'in_process'` (`'Pick up from here'`).

Note: `primaryCTA` is currently computed and stored in `links.primaryCTA` but not rendered by any screen (`grep -rn primaryCTA src/app/dev/proto/pre-signup-interview/screens` returns no hits). The fix preserves audit traceability for when O7 wires it.

### AC-5 — Audit-register §Status table sync

`docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` §Status table updates:

- F-TONE-01/02/03 rows (previous batch): `Merge sha` column `pending` → `c3ee0cc`; `PR` column `pending` → `#193`.
- F-TONE-04 row: `Status = ready for Phase 3 (CTA pass)` → `shipped`; `Slice = —` → `S-PROTO-tone-pass-cta-batch`; `Merge sha = —` → `pending`; `PR = —` → `pending`.

Post-merge follow-up (next slice): F-TONE-04 row gets `Merge sha` + `PR` filled.

## Definition of Done

Spec 76 §5 verbatim sets the in-scope items:

> *"Spec 72 §11 specifies 14 checkbox items. For category=prototype, four items remain in scope:*
>
> *1. Item 1 — Data classification per AC. Prototypes declare T0 metadata explicitly; the declaration itself is the audit.*
> *2. Item 8 — Error handling. User-facing surface; generic errors with reference IDs apply even when the data is static. Prototype loveability includes graceful failure.*
> *3. Item 12 — Adversarial review. `/security-review` skill run on slice diff. Cheap; catches regressions in patterns the spec doesn't otherwise enforce.*
> *4. Item 14 — Secrets hygiene. `gitleaks` clean on slice branch. No exception for any category."*

Applied to this slice:

- DoD-1: All ACs (AC-1..AC-5) met with evidence in `verification.md`.
- DoD-8 (Item 8): N/A — copy-only slice, no error paths touched.
- DoD-12 (Item 12): single-turn review (slice <300 lines; full criterion in §"Adversarial review budget" below).
- DoD-14 (Item 14): `gitleaks` CI check verifies.

## Adversarial review budget

Spec 72b §"Decision criteria" row 1 verbatim:

> *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."*

Slice acceptance.md <300 lines, 4 surgical CTA edits + 1 doc table update, prototype category. Single-turn applies (no partition, no multi-turn budget envelope).

## Pre-flight notes

- TDD: pure-string copy edits; tests added covering AC-1..AC-4 (positive + invariant).
- O5's `cta.continue` test must exist alongside O4's because both have the same nested-shape; lift to a parameterised test if it grows further (out of scope here — only 2 surfaces share the shape).
- Per audit-register §Workflow: this is "Batch (CTA pass)". Remaining 4 batches owe separate slices (plan-output warmth · chassis caption pass · eyebrow + referent consistency · O7 inline polish).
