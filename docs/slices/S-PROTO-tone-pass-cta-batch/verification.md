# S-PROTO-tone-pass-cta-batch — Verification

## AC-1 — O1 CTA names the destination

**Status:** met.

**Evidence:** `git diff` of `src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts:52`:

```diff
-    cta: 'Continue',
+    cta: 'Set up your situation',
```

Tests cover positive (`tests/unit/proto-pre-signup/tone-pass-cta-batch.test.ts` `'O1 CTA' › 'is "Set up your situation" — names the O2 destination'`) and negative (`'is not bare anodyne label'`).

## AC-2 — O4 CTA names the destination

**Status:** met.

**Evidence:** `git diff` of `src/app/dev/proto/pre-signup-interview/lib/copy/o4.ts:45`:

```diff
     cta: {
-      continue: 'Continue',
+      continue: 'Next: their side',
     },
```

Tests cover positive + negative under `'O4 CTA'` describe.

## AC-3 — O5 CTA names the destination

**Status:** met.

**Evidence:** `git diff` of `src/app/dev/proto/pre-signup-interview/lib/copy/o5.ts:44`:

```diff
     cta: {
-      continue: 'Continue',
+      continue: 'Next: what matters to you',
     },
```

Tests cover positive + negative under `'O5 CTA'` describe.

## AC-4 — `primaryCTAForStage('decided')` warmer

**Status:** met.

**Evidence:** `git diff` of `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:60`:

```diff
   switch (stage) {
     case 'thinking': return 'See what comes next';
-    case 'decided': return 'Continue';
+    case 'decided': return 'Begin the plan';
     case 'in_process': return 'Pick up from here';
     default: return 'Continue';
   }
```

`'default'` case left as `'Continue'` per slice §"Out of scope" (fallback for unknown stage). `'thinking'` and `'in_process'` regression covered by test under `"primaryCTA for 'decided' stage (build-plan)"` describe.

`primaryCTA` is currently dead code (computed in `links.primaryCTA` but not rendered by any screen) — fix preserves audit traceability for future O7 wiring.

## AC-5 — Audit-register §Status table sync

**Status:** met (pending-merge-sha precision for this batch).

**Evidence:** `git diff` of `docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` rows F-TONE-01..04:

```diff
-| F-TONE-01 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | pending | pending |
-| F-TONE-02 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | pending | pending |
-| F-TONE-03 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | pending | pending |
-| F-TONE-04 | STRONG | ready for Phase 3 (CTA pass) | — | — | — |
+| F-TONE-01 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | c3ee0cc | #193 |
+| F-TONE-02 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | c3ee0cc | #193 |
+| F-TONE-03 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | c3ee0cc | #193 |
+| F-TONE-04 | STRONG | shipped | S-PROTO-tone-pass-cta-batch | pending | pending |
```

F-TONE-04 row's `Merge sha` + `PR` columns marked `pending`; post-merge follow-up updates with actual values (next slice's batch can carry it).

## Definition of Done

- [x] **DoD-1** — All 5 ACs met with per-AC evidence above.
- [x] **DoD-8 (Item 8 — Error handling)** — N/A: copy-only slice, no error paths touched.
- [x] **DoD-12 (Item 12 — Adversarial review)** — single-turn review (slice acceptance.md <300 lines, fits in one read-cap window). Concerns considered:
  - **Audit-extension**: `primaryCTAForStage` `default` case (line 62) also bare `'Continue'`. Left as-is per slice §"Out of scope" — fallback for unknown stage; bareness is acceptable as a generic fallback.
  - **Dead-code cleanup deferral**: `primaryCTA` computed but unrendered. Per CLAUDE.md §"Coding conduct" §"Surgical changes" ("If you notice unrelated dead code, mention it — don't delete it"), noted for future cleanup, not removed here.
  - **Mixed CTA register**: `'Set up your situation'` (imperative) vs `'Next: <X>'` (form-system header) vs `'Begin the plan'` (first-person imperative) — three different patterns. Audit's verbatim suggestions used for traceability; user copy review at preview-deploy can iterate to a parallel structure if preferred.
- [x] **DoD-14 (Item 14 — Secrets hygiene)** — `gitleaks` clean (CI `Gitleaks scan` check run on PR will verify).
- [x] **Slice-DoD-14 (audit-register sync)** — see AC-5 above.

## Preview-deploy verification

Six-dimension contract: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport (375×667) · screen-reader.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | pending PR-review preview | Visual smoke on Vercel preview: O1 CTA, O4 CTA, O5 CTA each render the new wording. |
| Edge cases | pending PR-review preview | O7 plan-output `links.primaryCTA` is unrendered (dead code) — no edge-case visual to verify; tested at unit level. |
| `prefers-reduced-motion` | N/A this slice | No motion change. |
| Keyboard-only | N/A this slice | No interactive surface change; CTA buttons retain existing keyboard semantics. |
| Mobile viewport (375×667) | pending PR-review preview | Confirm new CTAs fit button width on 375px without truncation. `'Next: what matters to you'` (O5) at 26 chars is the longest of the four. |
| Screen-reader | N/A this slice | No structural change; existing aria semantics unchanged. |

Three dimensions (motion / keyboard / screen-reader) are N/A — pure-string CTA copy edits with zero structural or interactive change. Three dimensions (golden / edge / mobile) need preview-deploy visual confirmation pre-merge.

## Persona findings recorded

Prototype-category slice; canvas-as-source default per CLAUDE.md §"Canvas-as-source"; no `Linked canvas:` field; canvas-fidelity persona dormant. Three personas at PR review: `reviewer-security` · `reviewer-prototype-readiness` (substitutes `reviewer-correctness`) · `reviewer-style`.

| Persona | Findings | Issue main missed |
|---|---|---|
| `reviewer-security` | TBD | TBD |
| `reviewer-prototype-readiness` | TBD | TBD |
| `reviewer-style` | TBD | TBD |
