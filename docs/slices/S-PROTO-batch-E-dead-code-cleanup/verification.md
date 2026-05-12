# S-PROTO-batch-E-dead-code-cleanup — verification

## Per-AC evidence

**AC-1 — 7 unused component files deleted.**

Verified deleted via `ls src/app/dev/proto/pre-signup-interview/components/`:
- ScreenShell.tsx
- RadioCard.tsx
- RadioChips.tsx
- CheckChips.tsx
- SubQuestionCard.tsx
- JourneyTimeline.tsx
- PlanSection.tsx

components/ directory now contains 5 used primitives + the new shared TopBar:
- `Arrow.tsx` · `BackgroundShell.tsx` · `BgToggle.tsx` · `BrandBar.tsx` · `ProgressPill.tsx` · `TopBar.tsx` + `TopBar.module.css`

Net deletion: ~557L removed across 7 .tsx files.

**AC-2 — Orphan test references cleaned.**

- Deleted `tests/unit/proto-pre-signup/screen-shell-title.test.tsx` (tested the deleted `ScreenShell`).
- Edited `tests/unit/proto-pre-signup/brand-bar.test.tsx`:
  - Removed `import { ScreenShell }` line.
  - Removed `describe('BrandBar via ScreenShell ...')` block (had 1 test wrapper using ScreenShell).
  - Kept `BrandBar (component isolation)` block (3 tests) + `BrandBar via O2` block (1 test) — real coverage retained.
- Edited `tests/unit/proto-pre-signup/o2-canvas-as-source.test.tsx:111`: updated stale `(matches ScreenShell convention)` comment to `(canonical mobile-cap pattern)`.

**AC-3 — Tests pass + typecheck clean.**

- `npx vitest run tests/unit/proto-pre-signup/` → **110/110 pass** across 12 test files (down from 116/13 due to deleted `screen-shell-title.test.tsx` + 1 removed `via ScreenShell` test in `brand-bar.test.tsx`).
- `npx tsc --noEmit` → clean (no output).

## Smoke checks

- No production source code touched (deletions only); preview-deploy verification trivial — surfaces don't change.
- Synthetic-fixture string references in `tests/personas/synthetic/canvas-fidelity.*` + `plan-architect.plan` are persona-test reference data, not imports. No edits required; persona tests continue to pass.

## DoD-prototype-short-form

1. ACs met with evidence ✓ (AC-1 + AC-2 + AC-3 above).
2. Tests written + passing: no new tests required; existing suite passes ✓.
3. Adversarial review: pending PR-open multi-agent fan-out.
4. Preview-deploy: no UI surface change; trivially passes.
