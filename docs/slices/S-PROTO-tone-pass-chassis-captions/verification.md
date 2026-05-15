# S-PROTO-tone-pass-chassis-captions — Verification

## AC-1 — O4 `oneAnswered`

**Status:** met. `o4.ts:42`:

```diff
-      oneAnswered: 'Answer recorded — continue when ready.',
+      oneAnswered: 'Noted — keep going when you\'re ready.',
```

Tests under `'O4 oneAnswered'` describe (positive + negative).

## AC-2 — O5 `oneAnswered`

**Status:** met. `o5.ts:41`: same diff as AC-1. Tests under `'O5 oneAnswered'` describe.

## AC-3 — O3 `pickToContinue`

**Status:** met. `o3.ts:57`:

```diff
-      pickToContinue: 'Pick the option that fits best to continue.',
+      pickToContinue: 'Pick the one closest to how things feel right now.',
```

Tests under `'O3 pickToContinue'` describe.

## AC-4 — O4 `pickToContinue` (audit-extension)

**Status:** met. `o4.ts:41`:

```diff
-      pickToContinue: 'Pick the option that fits to continue.',
+      pickToContinue: 'Pick the one closest to how things feel right now.',
```

Tests under `'O4 pickToContinue'` describe.

## AC-5 — O3 `bothAnswered`

**Status:** met. `o3.ts:59`:

```diff
-      bothAnswered: 'Both answered.',
+      bothAnswered: 'Both noted — ready when you are.',
```

Tests under `'O3 bothAnswered'` describe.

## AC-6 — Audit-register §Status table sync

**Status:** met. `docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` diff:

- F-TONE-05/06/13 rows: `pending` / `pending` → `a6401eb` / `#195`.
- F-TONE-08/09/10 rows: `ready for Phase 3 (...)` → `shipped`; slice column populated.

## Other test files updated (regression fixes)

- `tests/unit/proto-pre-signup/o3-canvas-as-source.test.tsx` — 2 assertions updated + 1 describe text relaxed from temporal-state framing.
- `tests/unit/proto-pre-signup/o4-canvas-as-source.test.tsx` — 2 assertions updated.
- `tests/unit/proto-pre-signup/o5-canvas-as-source.test.tsx` — 1 assertion updated.

## Definition of Done

- [x] **DoD-1** — All 6 ACs met.
- [x] **DoD-8 (Error handling)** — N/A (copy-only).
- [x] **DoD-12 (Adversarial review)** — single-turn (slice <300L). Concerns:
  - Audit-extension for O4 `pickToContinue`: same anti-pattern, scope extended in this slice (AC-4) rather than deferred for cross-screen consistency.
  - Apostrophe handling: AFTER strings use straight `\'` matching existing file convention.
  - Caption width at 375×667: AFTER strings (35-50 chars) are longer than BEFORE (~20-32 chars). Risk of caption wrapping on 375px viewport — needs preview-deploy spot check.
- [x] **DoD-14 (Secrets hygiene)** — `gitleaks` CI verifies.
- [x] **Slice-DoD-14 (audit-register sync)** — AC-6.

## Preview-deploy verification

Six-dimension contract: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport (375×667) · screen-reader.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | pending PR-review preview | Visual smoke: O3 / O4 / O5 chassis captions render new wording at each interaction state (no-answer / one-answered / both-answered). |
| Edge cases | pending PR-review preview | Caption transitions on click; no race conditions in state-machine transitions. |
| `prefers-reduced-motion` | N/A | No motion change. |
| Keyboard-only | N/A | No interactive surface change. |
| Mobile viewport (375×667) | pending PR-review preview | **Watch:** AFTER captions are 35-50 chars vs BEFORE 20-32. Risk of caption wrapping or layout shift at 375px. |
| Screen-reader | N/A | No structural change. |

## Persona findings recorded

Prototype-category slice; canvas-as-source default; no `Linked canvas:` field; canvas-fidelity persona dormant.

| Persona | Findings | Issue main missed |
|---|---|---|
| `reviewer-security` | TBD | TBD |
| `reviewer-prototype-readiness` | TBD | TBD |
| `reviewer-style` | TBD | TBD |
