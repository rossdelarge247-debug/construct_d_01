# S-PROTO-pre-signup-interview · test plan

Spec 76 §3 prototype-category gate calibration: TDD-guard skips, coverage excludes for `src/app/dev/proto/<literal-slug>/**`. Primary verification is preview-deploy 6-dim (spec 72a) (UI rigour preserved for prototype).

## Test exemption rationale

Per CLAUDE.md §Engineering conventions §TDD where tractable:

> *"Bail-out criteria are documented as the rubric in `docs/tdd-exemption-allowlist.txt` header (per v3b AC-8) — entries must carry a `category:glob` tag matching one of three categories (`pure-visual-ui`, `pure-rename`, `pure-config`)."*

This slice's exemption category: **`pure-visual-ui:src/app/dev/proto/pre-signup-interview/**`** — clickable prototype with templated content; visual-only verification via preview-deploy.

Allowlist entry to add (in this slice's PR if not already present):
```
pure-visual-ui:src/app/dev/proto/pre-signup-interview/**
```

## What is verified instead

| Surface | Verification mechanism | Evidence location |
|---|---|---|
| 8-screen flow renders end-to-end | Preview-deploy golden path | `verification.md` §Preview-deploy verification row 1 |
| Expressive bg primary + standalone toggle | Preview-deploy golden path + edge case (toggle mid-flow) | `verification.md` rows 1-2 |
| Token reuse from S-F1 | Static inspection of `page.tsx` imports + grep for hex literals (none expected outside the local var declarations) | `verification.md` §Design tokens |
| O7 plan templating | Preview-deploy golden path (visit O7 with answers populated; verify content reflects answers) | `verification.md` row 1 |
| Microcopy compliance | Reviewer-correctness substitute (spec 76 §3: `reviewer-prototype-readiness`) post-PR | Auto-review.yml output |
| Mobile-first 375x667 + desktop | Preview-deploy mobile viewport dim | `verification.md` row 4 |
| Keyboard navigation | Preview-deploy keyboard-only dim | `verification.md` row 5 |
| Screen reader | Preview-deploy SR dim | `verification.md` row 6 |
| `prefers-reduced-motion` | Preview-deploy reduced-motion dim | `verification.md` row 3 |

## Pure-logic carve-out

`buildPlanFromAnswers(answers): PlanContent` at `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` is **pure logic** — answers in, plan out, no side effects. Per CLAUDE.md §Engineering conventions §Don't write file-content assertions for logic slices:

> *"If the unit under test is a function with branching/computation, exercise it with inputs and assert outputs."*

This function has branching (which sub-elements activate based on which answers are present). It is the only unit in scope that warrants a test even under prototype calibration.

**Test scope (pure-logic carve-out):**
- `tests/unit/proto-pre-signup/build-plan.test.ts`
- 4-6 assertions exercising the branching paths:
  - All answers present → all 7 sub-elements populated
  - Only stage answer → minimum-viable plan (situation summary + journey + generic conventional path)
  - Children=true → personalised note about parenting plan
  - Self-employed=true → personalised note about business valuation
  - Safety-concern=true → soft framing on private-exchange
  - Empty answers → plan skips personalised notes, retains journey + conventional path

Test-pain audit (spec 72d §3): 0 mocks expected (pure function, no collaborators).

## Out of scope (deferred)

- Component-level tests for individual screens (visual-only; preview-deploy covers).
- Integration tests for state propagation across screens (preview-deploy golden path covers).
- Snapshot tests (refactor-fragile; preview-deploy screenshots in PR comment cover the visual contract).

If this prototype graduates to production (e.g. expressive treatment validated and slice promoted to `src/app/(public)/pre-signup-interview/`), full test coverage gets authored at that promotion slice — not retroactively here.
