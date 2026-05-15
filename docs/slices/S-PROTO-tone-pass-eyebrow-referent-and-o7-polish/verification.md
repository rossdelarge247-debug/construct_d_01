# S-PROTO-tone-pass-eyebrow-referent-and-o7-polish — Verification

## AC-1 — O4 eyebrow

**Status:** met. `o4.ts:30`:

```diff
-    eyebrow: { label: 'Money', accent: 'indigo' },
+    eyebrow: { label: 'Money · your side', accent: 'indigo' },
```

Test under `eyebrow + referent + O7 polish invariants` describe.

## AC-2 — O3 eyebrow + heading + sr-only legend

**Status:** met. `o3.ts:36-40` (3 literal changes; whyWeAsk preserved):

```diff
-    eyebrow: 'Your ex',
-    heading: 'How would you describe things between you and your ex?',
+    eyebrow: 'Your partner',
+    heading: 'How would you describe things between you and your partner?',
     ...
-      label: 'How would you describe things between you and your ex?',
+      label: 'How would you describe things between you and your partner?',
```

Three tests under same describe (one per surface).

## AC-3 — O4 `'ex'` option detail

**Status:** met. `o4.ts:37`:

```diff
-      { value: 'ex', primary: 'Yes', detail: 'my ex is' },
+      { value: 'ex', primary: 'Yes', detail: 'my partner is' },
```

`value: 'ex'` kept stable (internal discriminator, not user-facing). Test asserts both the `detail` change AND the value-key preservation.

## AC-4 — O7 eyebrow

**Status:** met. `screens/O7.tsx:505`:

```diff
-            <Eyebrow color={colors.violet}>Building your plan</Eyebrow>
+            <Eyebrow color={colors.violet}>Drawing it together</Eyebrow>
```

Tested via existing `o7-canvas-as-source.test.tsx:32-34` (assertion updated as part of this slice).

## AC-5 — O7 secondary actions

**Status:** met. `screens/O7.tsx:150`:

```diff
-              <span>Save as PDF</span>
+              <span>Download as PDF</span>
```

Aligns with `O7.tsx:630` (already `'Download as PDF'`) + O8's `'Download my plan'`.

**Test deferral noted:** the L150 `<span>` lives in a post-generation render state (not the `MobileGenerating` initial state covered by `o7-canvas-as-source.test.tsx`). Driving the state-machine to that render branch from the test setup is non-trivial and adds test scaffolding disproportionate to a pure-string copy edit. Per the `pure-visual-ui` rubric in `docs/tdd-exemption-allowlist.txt` header — visual-regression coverage is the test seam for this surface. Preview-deploy 6-dim §Golden path will catch it pre-merge.

## AC-6 — Audit-register §Status table sync

**Status:** met. `docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` diff:

- F-TONE-08/09/10: `pending` / `pending` → `9b8a522` / `#196` (housekeeping for batch 4).
- F-TONE-07/11/12/14: `ready for Phase 3 (...)` → `shipped`; slice column populated.

F-TONE-07/11/12/14 sha + PR remain `pending` due to no follow-up batch (final-batch limitation).

## Other test files updated (regression fixes)

- `tests/unit/proto-pre-signup/o3-canvas-as-source.test.tsx` — 3 assertions updated (eyebrow + 2 heading-text).
- `tests/unit/proto-pre-signup/o4-canvas-as-source.test.tsx` — 3 assertions updated (eyebrow + 2 self-employment-option-text).
- `tests/unit/proto-pre-signup/o7-canvas-as-source.test.tsx` — 1 assertion + 1 describe-text relaxed from temporal-state framing.

## Definition of Done

- [x] **DoD-1** — All 6 ACs met.
- [x] **DoD-8** — N/A.
- [x] **DoD-12** — single-turn review. Concerns:
  - Audit-extension scope (AC-3 O4 'my ex is' → 'my partner is'): same standardisation logic as AC-2; included for consistency rather than deferred.
  - Internal value-key stability: `value: 'ex'` discriminator preserved (changing it would break type unions + downstream switch cases unrelated to copy).
  - O7 dead-code consideration: F-TONE-12's BEFORE was at L150, AFTER at L630 — different render states but same conceptual action (PDF export). Standardising to one verb avoids user confusion if both states ever render simultaneously.
- [x] **DoD-14** — gitleaks CI verifies.
- [x] **Slice-DoD-14** — AC-6.

## Preview-deploy verification

Six-dimension contract: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport (375×667) · screen-reader.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | pending PR-review preview | Visual smoke: O3 eyebrow + heading, O4 eyebrow + self-employment option, O7 loading-state eyebrow + secondary action button. |
| Edge cases | pending PR-review preview | O3 with privacy-optional caption (referent unchanged at L49); O4 self-employment option order. |
| `prefers-reduced-motion` | N/A | No motion change. |
| Keyboard-only | N/A | No interactive surface change. |
| Mobile viewport (375×667) | pending PR-review preview | New strings shorter or same length as BEFORE. Low overflow risk. |
| Screen-reader | N/A | sr-only legend label updated alongside visible heading; no structural change. |

## Persona findings recorded

Prototype-category slice; canvas-as-source default; canvas-fidelity persona dormant.

| Persona | Findings | Issue main missed |
|---|---|---|
| `reviewer-security` | TBD | TBD |
| `reviewer-prototype-readiness` | TBD | TBD |
| `reviewer-style` | TBD | TBD |
