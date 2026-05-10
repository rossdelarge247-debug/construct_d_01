# S-PROTO-canvas-fidelity-rebuild · test plan

## Scope

Visual-treatment fidelity work; pure-visual changes are not strictly TDD-tractable per CLAUDE.md §"Engineering conventions" (*"Not mandatory for pure-visual UI (visual regression covers that), but preferred wherever state or branching logic exists."*). The structured-title shape introduces one logic seam — `TitleShape` discriminated union — which IS tested unit-first.

## Test surface

| Surface | Test type | Where | Fixtures |
|---|---|---|---|
| `TitleShape` parser/renderer | Unit | `src/app/dev/proto/pre-signup-interview/components/__tests__/ScreenShell.title.test.tsx` | Inline TitleShape fixtures (plain, split, split-with-period) |
| Copy resolver structured-title support | Unit | `src/app/dev/proto/pre-signup-interview/copy/__tests__/copy-resolver.test.ts` | O2-O6 copy fixtures w/ structured shape |
| ScreenShell render integration | RTL | `src/app/dev/proto/pre-signup-interview/components/__tests__/ScreenShell.integration.test.tsx` | Full screen render with title shape + back-button + step pill |
| ProgressPill geometry | Unit | `src/app/dev/proto/pre-signup-interview/components/__tests__/ProgressPill.test.tsx` | Width-fill computation across (current, total) cases |
| SubQuestionCard label serif | Snapshot/visual | preview-deploy 6-dim (spec 72a rubric) | Visual diff against canvas reference |
| Header chrome (back-button + divider) | RTL + visual | `ScreenShell.integration.test.tsx` + preview-deploy | Tab-order tested in RTL; visual treatment via preview-deploy |

## Test-pain audit (spec 72d §3)

Target: ≤2 mock setups per unit test. Current expectation:

- `ScreenShell.title.test.tsx` — pure-render test with TitleShape props; 0 mocks.
- `copy-resolver.test.ts` — pure-function test on resolver output; 0 mocks.
- `ProgressPill.test.tsx` — pure-render test with (current, total) props; 0 mocks.
- `ScreenShell.integration.test.tsx` — may need to mock the stage-router context for back-button click; ≤1 mock.

If mock count exceeds 2 on any unit test during impl, step back per CLAUDE.md §"Engineering conventions" §"Test-pain audit": *"the discipline is to NOTICE proliferating mocks and react. Address by extracting effects behind interfaces or explicitly defer with reasoning recorded in `verification.md` §'Architectural deferrals'."*

## Visual regression

- Side-by-side screenshot vs `Pre-signup Canvas` O2 section (canvas L880-1200 area) for AC-1 + AC-3 + AC-4.
- Side-by-side vs canvas L990 sub-Q label for AC-2.
- Captured at preview-deploy time; no automated visual-regression harness on this slice.

## Out of scope

- Storybook / component library visual tests (no Storybook in repo).
- Cross-browser testing beyond Chrome + Safari (Vercel preview default).
- Accessibility audit beyond the `aria-label` + tab-order checks named above (spec 72a 6-dim screen-reader dimension covers the per-screen audit).

## Status

- 2026-05-10: skeleton authored at slice setup; test surfaces scoped per AC; impl + actual test files land in follow-up session.
