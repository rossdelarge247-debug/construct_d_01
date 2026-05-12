# S-PROTO-batch-E-dead-code-cleanup

**Category:** prototype

Phase 3 Batch E of the homogenisation programme scoped in `docs/slices/S-PROTO-cross-screen-homogenisation-audit/acceptance.md`. Deletes 7 unused primitives from `src/app/dev/proto/pre-signup-interview/components/` (~557L of dead code) + 1 orphan test file + tidies 2 test-file references.

Per CLAUDE.md §"Canvas-as-source (prototype default)": no `Linked canvas:` — pure-deletion slice with no UI surface.

## Acceptance criteria

**AC-1: Delete 7 unused component files.**

- `src/app/dev/proto/pre-signup-interview/components/ScreenShell.tsx` (224L)
- `src/app/dev/proto/pre-signup-interview/components/RadioCard.tsx` (62L)
- `src/app/dev/proto/pre-signup-interview/components/RadioChips.tsx` (67L)
- `src/app/dev/proto/pre-signup-interview/components/CheckChips.tsx` (80L)
- `src/app/dev/proto/pre-signup-interview/components/SubQuestionCard.tsx` (38L)
- `src/app/dev/proto/pre-signup-interview/components/JourneyTimeline.tsx` (50L)
- `src/app/dev/proto/pre-signup-interview/components/PlanSection.tsx` (36L)

Total: **~557L removed** across 7 files.

Pre-deletion grep verified zero production importers in `src/app/`:
- O1's `function RadioCard` at `O1.tsx:73` is a screen-local helper (separate identity, not the deleted primitive).
- `src/lib/ai/plan-narrative.ts` references `AIPlanSection` type (unrelated naming overlap).
- Synthetic-fixture string mentions in `tests/personas/synthetic/` are persona-test data, not imports.

**AC-2: Clean up orphan test references.**

- Delete `tests/unit/proto-pre-signup/screen-shell-title.test.tsx` (tests the deleted `ScreenShell`).
- Edit `tests/unit/proto-pre-signup/brand-bar.test.tsx`:
  - Remove the `import { ScreenShell }` line (L4).
  - Remove the `describe('BrandBar via ScreenShell (covers O1, O3-O8)', ...)` block (L35-44). This block tested BrandBar rendering inside ScreenShell as a wrapper; with ScreenShell deleted, O3-O8's BrandBar coverage moves to the existing `BrandBar via O2` test pattern (extend to per-screen if needed; defer).
  - Other describe blocks (`BrandBar (component isolation)` + `BrandBar via O2`) stay — real coverage retained.
- Edit `tests/unit/proto-pre-signup/o2-canvas-as-source.test.tsx:111`: update stale `(matches ScreenShell convention)` comment to reference the 480px mobile-cap pattern directly.

**AC-3: Tests pass + typecheck clean.**

- `npx vitest run tests/unit/proto-pre-signup/` — full proto-prototype test suite passes after deletions.
- `npx tsc --noEmit` — clean compile.

## Out of scope

- Per-screen `function RadioCard` / `function Chip` / `function ChipRow` / `function CardPlate` / `function OptionCard` etc. local helpers stay in place. Consolidation of those is a separate pass.
- Hero / Footer / `<main>` sweep / Token promotion — Batches B / C / D / F respectively.

## Pre-flight

Adversarial-review budget: this acceptance.md ~50L. Trivial single sub-spawn. Auto-review at PR-open: 3 specialists per spec 72c §4 (security · correctness · style/prototype-readiness).

Linked canvas: **omitted** (pure-deletion slice; no UI surface; canvas-fidelity persona stays dormant).
