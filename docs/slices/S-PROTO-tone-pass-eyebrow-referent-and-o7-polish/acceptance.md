# S-PROTO-tone-pass-eyebrow-referent-and-o7-polish

**Category:** prototype

## Why

Final Phase 3 batch — bundles the 4 remaining audit findings into one PR for efficiency. Closes:

- F-TONE-07 (O4 `'Money'` eyebrow most clinical eyebrow across screens)
- F-TONE-14 (Inconsistent `'ex'` vs `'partner'` referent across O3/O4)
- F-TONE-11 (O7 `'Building your plan'` eyebrow under-pairs with `'Take a breath.'` heading)
- F-TONE-12 (O7 `'Save as PDF'` vs `'Download as PDF'` inconsistency)

CLAUDE.md anchor:

> *"A warm hand on a cold day — compassionate, professional, never patronising."*

Bundling rationale: F-TONE-07 (1 line), F-TONE-11 (1 line), F-TONE-12 (1 line), F-TONE-14 (5 lines) — combined ≈ 8 surgical string edits. Two separate slices would carry 2× docs overhead for marginal traceability benefit.

## In scope

Eight surgical string edits across three files; copy-only.

- F-TONE-07 fix: `o4.ts:30` — eyebrow label.
- F-TONE-14a-d fix: `o3.ts:36, 37, 40` — eyebrow + heading + sr-only legend label (3 occurrences of `'ex'`).
- F-TONE-14e fix (audit-extension): `o4.ts:37` — option `detail: 'my ex is'` (5th occurrence of `'ex'` in the o3+o4 pair, not flagged separately by Phase 1 audit but surfaced at batch implementation).
- F-TONE-11 fix: `screens/O7.tsx:505` — `<Eyebrow>` content.
- F-TONE-12 fix: `screens/O7.tsx:150` — `<span>Save as PDF</span>` standardised to `'Download as PDF'`.

Plus audit-register §Status table sync:
- F-TONE-08/09/10 rows (previous batch): `Merge sha = 9b8a522` · `PR = #196`.
- F-TONE-07/11/12/14 rows (this batch): `Status = shipped` · `Slice = S-PROTO-tone-pass-eyebrow-referent-and-o7-polish` · `Merge sha = pending` · `PR = pending`.

## Out of scope

- `o3.ts:49` `'Some people read these screens with a partner nearby'` — already uses `'partner'`; no change.
- `o5.ts:30` `"How much do you know about your partner's financial situation?"` — already uses `'partner'`; no change.
- `o4.ts:37` `value: 'ex'` discriminator key — internal-only, not user-facing; keep the value-key stable to avoid breaking type unions + downstream switch cases.

## Acceptance criteria

### AC-1 — O4 eyebrow names the side

`o4.ts:30` changes from:

- BEFORE: `eyebrow: { label: 'Money', accent: 'indigo' },`
- AFTER: `eyebrow: { label: 'Money · your side', accent: 'indigo' },`

Rationale per F-TONE-07: BEFORE is a single-word category label. AFTER mirrors O5's existing pattern (`'Money · their side'`); pre-announces the O4/O5 pairing.

### AC-2 — O3 eyebrow + heading + legend use `partner` referent

`o3.ts:36-40` changes:

- BEFORE: `eyebrow: 'Your ex',` / `heading: 'How would you describe things between you and your ex?',` / `label: 'How would you describe things between you and your ex?',`
- AFTER: `eyebrow: 'Your partner',` / `heading: 'How would you describe things between you and your partner?',` / `label: 'How would you describe things between you and your partner?',`

Rationale per F-TONE-14: the audit standardises on `'partner'` for stage-neutral / pre-decision contexts; `'ex'` is reserved for stage-specific or post-signup contexts where separation is final.

### AC-3 — O4 self-employment option uses `partner` referent

`o4.ts:37` changes from:

- BEFORE: `{ value: 'ex', primary: 'Yes', detail: 'my ex is' },`
- AFTER: `{ value: 'ex', primary: 'Yes', detail: 'my partner is' },`

Audit-extension. Same standardisation as AC-2; `value: 'ex'` discriminator key kept stable (internal only, not user-facing).

### AC-4 — O7 eyebrow matches the `'Take a breath.'` heading register

`screens/O7.tsx:505` changes from:

- BEFORE: `<Eyebrow color={colors.violet}>Building your plan</Eyebrow>`
- AFTER: `<Eyebrow color={colors.violet}>Drawing it together</Eyebrow>`

Rationale per F-TONE-11: BEFORE is system-generic. AFTER is embodied + warm, matching the gold-standard heading `'Take a breath.'` (L515) at this loading moment.

### AC-5 — O7 secondary actions use one consistent verb

`screens/O7.tsx:150` changes from:

- BEFORE: `<span>Save as PDF</span>`
- AFTER: `<span>Download as PDF</span>`

Rationale per F-TONE-12: two labels for what appears to be the same action in different render states. AFTER aligns to the `O7.tsx:630` instance + O8's `'Download my plan'` verb-family.

### AC-6 — Audit-register §Status table sync

`docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` §Status table updates:

- F-TONE-08/09/10 rows (previous batch): `Merge sha` `pending` → `9b8a522`; `PR` `pending` → `#196`.
- F-TONE-07/11/12/14 rows: `Status = ready for Phase 3 (...)` → `shipped`; slice column populated; merge sha + PR `pending` (final-batch limitation — no follow-up to housekeep).

## Definition of Done

Spec 76 §5 verbatim:

> *"Spec 72 §11 specifies 14 checkbox items. For category=prototype, four items remain in scope:*
>
> *1. Item 1 — Data classification per AC. Prototypes declare T0 metadata explicitly; the declaration itself is the audit.*
> *2. Item 8 — Error handling. User-facing surface; generic errors with reference IDs apply even when the data is static. Prototype loveability includes graceful failure.*
> *3. Item 12 — Adversarial review. `/security-review` skill run on slice diff. Cheap; catches regressions in patterns the spec doesn't otherwise enforce.*
> *4. Item 14 — Secrets hygiene. `gitleaks` clean on slice branch. No exception for any category."*

Applied:

- DoD-1: All ACs met.
- DoD-8: N/A (copy-only).
- DoD-12: single-turn review (criterion in §"Adversarial review budget").
- DoD-14: `gitleaks` CI check verifies.

## Adversarial review budget

Spec 72b §"Decision criteria" row 1 verbatim:

> *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."*

Slice <300L; 8 surgical edits across 3 files + 1 doc table update.

## Pre-flight notes

- TDD: pure-string copy edits across both copy/ files and a screen JSX file.
- 6 pre-existing screen-test assertions reference the BEFORE strings; updated in this slice.
- Bundling 2 audit batches (5 + 6) into one slice — documented in §"Why" rationale.
- After this ships, the audit register's Phase 3 column reads 14/14 shipped (with F-TONE-07/11/12/14 sha + PR remaining `pending` due to no follow-up batch).
