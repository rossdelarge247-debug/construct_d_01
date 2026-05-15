# S-PROTO-tone-pass-positioning-batch — Verification

## AC-1 — `'decided'` stage sub-copy no longer narrows Decouple to finances

**Status:** met.

**Evidence:** `git diff` of `src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts:48`:

```diff
-      { value: 'decided', label: 'We\'ve decided to separate', sub: 'You want to get the finances sorted.' },
+      { value: 'decided', label: 'We\'ve decided to separate', sub: 'You want to make a clear plan.' },
```

Only the `sub` field literal changes. `label`, `value`, sibling options (lines 49-50), and surrounding structure are unchanged.

## AC-2 — O2 eyebrow drops developer-facing screen identifier

**Status:** met.

**Evidence:** `git diff` of `src/app/dev/proto/pre-signup-interview/lib/copy/o2.ts:43`:

```diff
-    eyebrow: 'O2 · Your situation',
+    eyebrow: 'Your situation',
```

Only the `eyebrow` field literal changes. Surrounding `heading`, `whyWeAsk`, question groups are unchanged.

## AC-3 — `'ongoing-support'` priority-note Decouple-clause uses plain language

**Status:** met.

**Evidence:** `git diff` of `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:92`:

```diff
-  'ongoing-support': 'Because future financial support matters most to you, Decouple helps you map maintenance scenarios against bank-evidenced income.',
+  'ongoing-support': 'Because future financial support matters most to you, Decouple maps what\'s coming in and going out for both of you — so you can see what\'s actually workable.',
```

Lead phrase `'Because future financial support matters most to you,'` unchanged per slice's §"Out of scope" (F-TONE-13 cascade deferred to Phase 3 batch 3). Other 7 priority notes (lines 85-91) and `WORRY_NOTES` map (lines 95-104) untouched.

## AC-4 — Audit-register §Status table reflects the ship

**Status:** met (pending-merge-sha precision).

**Evidence:** `git diff` of `docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` §Status table rows for F-TONE-01, F-TONE-02, F-TONE-03:

```diff
-| F-TONE-01 | STRONG | ready for Phase 3 (positioning batch) | — | — | — |
-| F-TONE-02 | STRONG | ready for Phase 3 (positioning batch) | — | — | — |
-| F-TONE-03 | STRONG | ready for Phase 3 (positioning batch) | — | — | — |
+| F-TONE-01 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | pending | pending |
+| F-TONE-02 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | pending | pending |
+| F-TONE-03 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | pending | pending |
```

`Merge sha` + `PR` columns marked `pending`; post-merge follow-up updates with actual values. Other 11 rows unchanged.

## Definition of Done

Spec 76 §5 verbatim sets the in-scope items:

> *"Spec 72 §11 specifies 14 checkbox items. For category=prototype, four items remain in scope: 1. Item 1 — Data classification per AC; 2. Item 8 — Error handling; 3. Item 12 — Adversarial review; 4. Item 14 — Secrets hygiene."*

- [x] **DoD-1** — All 4 ACs met with per-AC evidence above.
- [x] **DoD-8 (Item 8 — Error handling)** — N/A: copy-only slice, no error paths touched.
- [x] **DoD-12 (Item 12 — Adversarial review)** — single-turn review (slice acceptance.md <300 lines, fits in one read-cap window, no orchestration overhead — acceptance.md §"Adversarial review budget" carries the verbatim spec quote). Concerns considered:
  - **Cascade risk** with F-TONE-13 (Phase 3 batch 3): lead phrase `'Because future financial support matters most to you,'` stays in AC-3 AFTER text; will need re-alignment when batch 3 updates option label. Tracked in acceptance.md §"Out of scope" + §AC-3 rationale.
  - **AC-1 phrase neutrality**: `'You want to make a clear plan.'` — verified against the four-dimensional settlement framing (children, housing, finances, future needs); no narrowing.
  - **AC-3 character handling**: em-dash `—` is a literal HTML em-dash; matches existing usage at line 102 (`Decouple addresses...`) and at AC-3 of `lib/copy/o6.ts` priority labels. No new character class introduced.
  - **AC-2 sweep**: O2 is the only screen in the pre-signup interview whose eyebrow leaked a dev ID. Verified via `grep -n "^.*eyebrow" src/app/dev/proto/pre-signup-interview/lib/copy/*.ts` (only O2 carried the `'O<N> · '` prefix).
- [x] **DoD-14 (Item 14 — Secrets hygiene)** — `gitleaks` clean (CI `Gitleaks scan` check run on PR will verify).
- [x] **Slice-DoD-14 (audit-register sync)** — see AC-4 above.

## Preview-deploy verification

Spec 76 §3 row 5 keeps preview-deploy 6-dim ON for `prototype` verbatim:

> *"Preview-deploy rubric (spec 72a) | Full 6-dim | Full 6-dim — UI/UX rigour preserved (this is the load-bearing piece for prototype loveability) | N/A"*

Six-dimension contract: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport (375×667) · screen-reader.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | pending PR-review preview | Visual smoke on Vercel preview: O1 `'decided'` card sub-copy, O2 eyebrow, O7 plan-output priority note (`'ongoing-support'` selected). |
| Edge cases | pending PR-review preview | O1: confirm `'thinking'` + `'in_process'` sub-copies still render correctly (sibling rows untouched). O2: confirm heading/helper/why-we-ask still render correctly without the dev-ID prefix. O7: confirm 7 other priority notes still render. |
| `prefers-reduced-motion` | N/A this slice | No motion change; existing transitions unchanged. |
| Keyboard-only | N/A this slice | No interactive surface change; keyboard flow unchanged. |
| Mobile viewport (375×667) | pending PR-review preview | Confirm new copy fits the option-card width on O1 and the eyebrow width on O2 without truncation. |
| Screen-reader | N/A this slice | No structural change; existing aria semantics unchanged. |

Three dimensions (motion / keyboard / screen-reader) are N/A — slice is pure-string copy edits with zero structural or interactive change. Three dimensions (golden / edge / mobile) need preview-deploy visual confirmation pre-merge.

## Persona findings recorded

Prototype-category slice; canvas-as-source default per CLAUDE.md §"Canvas-as-source"; no `Linked canvas:` field; canvas-fidelity persona stays dormant. Three personas at PR review per spec 76 §3 row 2 verbatim:

> *"Multi-agent specialists (`.github/workflows/auto-review.yml`) | `security` · `correctness` · `style` | `security` · `prototype-readiness` (substitutes correctness) · `style` | `security` · `correctness` · `style` (control-plane scrutiny)"*

For prototype: `reviewer-security` · `reviewer-prototype-readiness` (substitutes `reviewer-correctness` per the §3 row 2 quote above) · `reviewer-style`.

Persona findings post-PR-review:

| Persona | Findings | Issue main missed |
|---|---|---|
| `reviewer-security` | TBD | TBD |
| `reviewer-prototype-readiness` | TBD | TBD |
| `reviewer-style` | TBD | TBD |
