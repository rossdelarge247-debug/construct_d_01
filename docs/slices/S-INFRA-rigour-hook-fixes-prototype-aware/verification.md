# S-INFRA-rigour-hook-fixes-prototype-aware — Verification

**Slice:** S-INFRA-rigour-hook-fixes-prototype-aware
**Spec ref:** `docs/workspace-spec/76-prototype-mode-rigour.md` §2 + `CLAUDE.md` §"Hard controls"

## Acceptance evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 — `tdd-first-every-commit.sh` honors prototype path-default | PENDING | `tests/shellspec/tdd-first-every-commit-category_spec.sh` — 3 scenarios |
| AC-2 — `comment-review.sh` §Status exemption matches both forms | PENDING | `tests/shellspec/comment-review-status-exemption_spec.sh` — 5 scenarios |
| AC-3 — Spec 76 §2 L41 implementation list updated | PENDING | Doc diff |
| AC-4 — CLAUDE.md §"Hard controls" gate-table parenthetical | PENDING | Doc diff |

## Definition of Done

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | All AC met with evidence per AC | PENDING | Filled at slice ship |
| 2 | Tests written + passing | PENDING | Shellspec runs green; test-pain audit cleared (regex-string tests, no mocks) |
| 3 | Adversarial review done | PENDING | Persona suite spawned at PR; verdicts archived |
| 4 | Preview deploy verified in-browser | N/A | Hook + doc slice; no UI surface |
| 5 | No regression in adjacent slices | PENDING | Full shellspec suite green; `auto-review.yml` workflow green on the diff |
| 6 | Open 68f/g entries resolved | N/A | Infrastructure slice; no 68f/g entries |

Plus the 14-item security checklist in `security.md`.

## Preview-deploy verification

N/A — infrastructure slice; no UI surface.

## §Status

| Date | Event |
|---|---|
| 2026-05-19 | Skeleton drafted; rows pending impl |
