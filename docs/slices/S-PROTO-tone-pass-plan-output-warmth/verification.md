# S-PROTO-tone-pass-plan-output-warmth — Verification

## AC-1 — `leadPhrase('housing')` warmer

**Status:** met. `build-plan.ts:51` switch case BEFORE/AFTER:

```diff
-    case 'housing': return 'Decisions about your home shape what comes next.';
+    case 'housing': return 'Where each of you lives next sits at the heart of your plan.';
```

Tests under `'leadPhrase for housing'` describe (positive + negative).

## AC-2 — `leadPhrase('pensions')` warmer

**Status:** met. `build-plan.ts:52`:

```diff
-    case 'pensions': return 'Protecting pensions matters in this picture.';
+    case 'pensions': return 'What you\'ve each built up for later — your plan keeps that in view.';
```

Tests under `'leadPhrase for pensions'` describe (positive + negative).

## AC-3 — `homeDescription('mortgage')` subject-verb match

**Status:** met. `build-plan.ts:77`:

```diff
-    case 'mortgage': return 'Your home is mortgaged.';
+    case 'mortgage': return 'You\'re paying off a mortgage on your home.';
```

Tests under `'homeDescription for mortgage'` describe (positive + negative).

## AC-4 — `'ongoing-support'` priority option label plain language

**Status:** met. `o6.ts:56`:

```diff
-        { value: 'ongoing-support', label: 'Ongoing financial support' },
+        { value: 'ongoing-support', label: 'Knowing one of us will still need support' },
```

Tests under `"O6 'ongoing-support' priority option label"` describe (positive + negative).

## AC-5 — F-TONE-03 cascade: priority-note lead phrase realigns

**Status:** met. `build-plan.ts:92` `'ongoing-support'` priority-note:

```diff
-  'ongoing-support': 'Because future financial support matters most to you, Decouple maps what's coming in and going out for both of you — so you can see what's actually workable.',
+  'ongoing-support': 'Because ongoing support matters most to you, Decouple maps what's coming in and going out for both of you — so you can see what's actually workable.',
```

Lead-phrase changes; Decouple-clause unchanged from batch 1. Tests under `"'ongoing-support' priority-note"` describe (positive + negative + Decouple-clause preservation).

Additionally: pre-existing assertions in `tests/unit/proto-pre-signup/tone-pass-positioning-batch.test.ts` (the batch 1 test file) updated to assert the new lead phrase. The describe-text "preserves the standard lead phrase" rewritten to "uses the priority-note lead-phrase pattern" — describes the invariant directly, not the deferred state.

## AC-6 — Audit-register §Status table sync

**Status:** met (pending-merge-sha precision).

`docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` §Status diff:

- F-TONE-04: `pending` / `pending` → `917af25` / `#194` (housekeeping).
- F-TONE-05: `ready for Phase 3 (plan-output warmth)` → `shipped`, slice column populated.
- F-TONE-06: same as F-TONE-05.
- F-TONE-13: same as F-TONE-05.

## Other test files updated (regression fixes)

- `tests/unit/proto-pre-signup/build-plan.test.ts` — 8 assertions updated:
  - L140: `'Your home is mortgaged.'` → `"You're paying off a mortgage on your home."`
  - L217 + L248: `'Decisions about your home'` → `'Where each of you lives next'`
  - L230 + L265 + L273 + L278: `'Protecting pensions'` → `"What you've each built up for later"`
- `tests/unit/proto-pre-signup/tone-pass-positioning-batch.test.ts` — 2 assertions updated:
  - L45 + L58 lead-phrase startsWith claim.
  - describe-text relaxed from temporal-state ("preserves the standard lead phrase") to invariant ("uses the priority-note lead-phrase pattern").

Local vitest run: 225 tests pass across 22 files in `tests/unit/proto-pre-signup/`.

## Definition of Done

- [x] **DoD-1** — All 6 ACs met.
- [x] **DoD-8 (Error handling)** — N/A (copy-only).
- [x] **DoD-12 (Adversarial review)** — single-turn (acceptance.md <300L). Concerns:
  - Cross-screen consistency: F-TONE-13 label change cascades to F-TONE-03 lead-phrase. Both updated together in this batch (AC-4 + AC-5).
  - Possessive/quote handling: AC-2 uses straight apostrophe `\'` in `'You've'` and `'what's'`; AC-3 likewise in `'You're'`. Pattern matches sibling strings already in file (no new character class).
  - O6 label length: `'Knowing one of us will still need support'` (40 chars) vs original `'Ongoing financial support'` (25 chars). Risk: option-row truncation in O6 layout at 375px viewport — needs preview-deploy spot check.
- [x] **DoD-14 (Secrets hygiene)** — `gitleaks` CI check verifies.
- [x] **Slice-DoD-14 (audit-register sync)** — AC-6 covers.

## Preview-deploy verification

Six-dimension contract: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport (375×667) · screen-reader.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | pending PR-review preview | Visual smoke on O6 (priority option list — new label) and O7 (situation summary — new leadPhrase + homeDescription strings + new priority-note for `ongoing-support` selected). |
| Edge cases | pending PR-review preview | O7 with no priorities selected (situation summary still renders), with multiple priorities (only first generates a priority trigger per existing test invariant). |
| `prefers-reduced-motion` | N/A this slice | No motion change. |
| Keyboard-only | N/A this slice | No interactive surface change. |
| Mobile viewport (375×667) | pending PR-review preview | **Watch:** O6 `'Knowing one of us will still need support'` (40 chars) is the longest sibling label; risk of option-row truncation. O7 leadPhrase strings are sentence-length, will wrap. |
| Screen-reader | N/A this slice | No structural change. |

## Persona findings recorded

Prototype-category slice; canvas-as-source default; no `Linked canvas:` field; canvas-fidelity persona dormant. Three personas at PR review: `reviewer-security` · `reviewer-prototype-readiness` · `reviewer-style`.

| Persona | Findings | Issue main missed |
|---|---|---|
| `reviewer-security` | TBD | TBD |
| `reviewer-prototype-readiness` | TBD | TBD |
| `reviewer-style` | TBD | TBD |
