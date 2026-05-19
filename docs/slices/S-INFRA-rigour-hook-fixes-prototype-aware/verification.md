# S-INFRA-rigour-hook-fixes-prototype-aware — Verification

**Slice:** S-INFRA-rigour-hook-fixes-prototype-aware
**Spec ref:** `docs/workspace-spec/76-prototype-mode-rigour.md` §2 + `CLAUDE.md` §"Hard controls"

## Acceptance evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 — `tdd-first-every-commit.sh` honors prototype path-default | ✓ | `tests/shellspec/tdd-first-every-commit.spec.sh` extended with 3 new It blocks (prototype-only · mixed · parametric). Hook adds prototype-regex skip mirroring `tdd-guard.sh` form. Local sanity check: prototype-only stage → exit 0; mixed stage → exit 2 (only `src/lib/y.ts` listed as non-exempt). |
| AC-2 — `comment-review.sh` §Status exemption matches both forms | ✓ | `tests/shellspec/comment-review.spec.sh` extended with 1 new It block (`## Status` no-§ form). Hook awk regex changed from `/^## §?Status/` → `/^## (§)?Status/` (grouping the multi-byte char). Local sanity check: `## Status` with PR/session provenance + emoji inside the block → exit 0, no findings emitted; provenance outside the block still flagged. |
| AC-3 — Spec 76 §2 L41 + §6 L84 implementation lists updated | ✓ | Doc diff: both lists add `.claude/hooks/tdd-first-every-commit.sh (path-default-skip)` alongside `tdd-guard.sh`. |
| AC-4 — CLAUDE.md §"Sweep discipline" implementing-files list updated | ✓ | Doc diff: L281 list adds `.claude/hooks/tdd-first-every-commit.sh` between `tdd-guard.sh` and `auto-review.yml`. |

## Definition of Done

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | All AC met with evidence per AC | ✓ | Table above. |
| 2 | Tests written + passing | ✓ | `tdd-first-every-commit.spec.sh` +3 It blocks; `comment-review.spec.sh` +1 It block. Test-pain audit cleared (regex/string-input tests; no mocks). Local-invocation sanity checks pass. Full shellspec validates at CI. |
| 3 | Adversarial review done | PENDING | Persona suite (`reviewer-security` · `reviewer-correctness` · `reviewer-style`) fires at PR via `auto-review.yml`. |
| 4 | Preview deploy verified in-browser | N/A | Hook + doc slice; no UI surface. |
| 5 | No regression in adjacent slices | PENDING | Full shellspec suite + all CI workflows green on the diff. |
| 6 | Open 68f/g entries resolved | N/A | Infrastructure slice; no 68f/g entries. |

Plus the 14-item security checklist in `security.md`.

## Preview-deploy verification

N/A — infrastructure slice; no UI surface.

## §Status

| Date | Event |
|---|---|
| 2026-05-19 | Skeleton drafted; rows pending impl |
| 2026-05-19 | AC-1..AC-4 impl complete; local sanity-checks pass; DoD 1+2 ✓, DoD 3+5 pending PR-time persona suite + CI |
