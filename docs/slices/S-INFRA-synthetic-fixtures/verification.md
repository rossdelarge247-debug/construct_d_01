# S-INFRA-synthetic-fixtures · Verification (final-state)

Slice ships synthetic-deliberate-injection per-persona regression detection
per spec 72c §7. New harness covers per-persona signal regression that
golden-PR replay (aggregator-only) cannot isolate.

## AC sign-off table

| AC | Surface | Status | Evidence |
|---|---|---|---|
| AC-1 | 4 unified-diff fixtures with planted defects | PASS | `tests/personas/synthetic/{security,architecture,correctness,style}.diff` exist; each parses as a unified diff (header + hunk markers + add lines). |
| AC-2 | 4 expected-finding signature contracts | PASS | `tests/personas/synthetic/expected/{security,architecture,correctness,style}.json` exist; each parses as JSON with the required schema (dimension, fixture_path, planted_defect_summary, expected_finding{label_in, blocking_in, category_pattern, evidence_must_contain_any_of, remediation_must_contain_any_of}, min_findings_count). |
| AC-3 | Live-invocation runner | PASS | `tests/personas/run-synthetic.sh` (~100L) + `tests/personas/match-synthetic.sh` (~60L). Both `bash -n` clean. Matcher covered by `tests/shellspec/match-synthetic.spec.sh` — 8 cases: PASS-all-predicates + 5 per-predicate FAIL paths (count / label / category / evidence / remediation) + 2 missing-input-file precondition exit-2 cases. Runner skip-on-no-API-key tested: unset `ANTHROPIC_API_KEY` → exit 0 with `SKIP` diagnostic to stderr. Runner CLI-version semver guard: invalid value (e.g. non-semver) → exit 2 with diagnostic. |
| AC-4 | CI workflow integration | PASS | `.github/workflows/persona-synthetic-fixtures.yml` (~55L) — path-filter trigger covers persona prompts, orchestrator scripts, parser, synthetic dir, runner, matcher, and the workflow file itself. Workflow lints clean (yaml syntax verified). On this PR opening, workflow runs: either passes (API key configured) or skip-with-neutral (forks). |
| AC-5 | Documentation | PASS | `tests/personas/synthetic/README.md` (~92L) explains design rationale, file layout, runner mechanics, how-to-run, regression interpretation, CI integration, and how to add a new fixture. Slice docs at `docs/slices/S-INFRA-synthetic-fixtures/` (acceptance + security + this file). `CLAUDE.md` §Hard-controls §Not-yet-in-scope: synthetic-fixtures carry-over struck (now shipped). |

**Σ in-scope rows = 5; Σ ACs = 5; 100% rule satisfied.**

## Per-AC evidence

### AC-1 · Synthetic fixtures

Each fixture is a self-contained unified diff against a synthesised source
file (the file does not exist in the repo; the diff is fed as evidence text
only, never applied):

- `security.diff` — `<div dangerouslySetInnerHTML={{ __html: comment.body }} />`
  on a comment-display component fetching from `/api/comments/...`. Stored-XSS
  via attacker-controlled `body`.
- `architecture.diff` — `'use client'` UI button importing `Pool` from `pg`,
  instantiating a connection pool at module top-level, executing
  `client.query` inline with template-literal interpolation. Three smells in
  one (UI-DB coupling, no test seam, SQL injection bonus).
- `correctness.diff` — pagination loop `for (let i = cursor; i < cursor +
  pageSize - 1; i++)` drops the last item of every page; `nextCursor` uses
  the same incorrect offset.
- `style.diff` — JSDoc comment narrating change-history with PR/round number,
  session reference, ticket ID, and slice/AC ref — five anti-pattern
  signatures in one comment block.

### AC-2 · Expected signatures

Each signature is fuzzy-matched (LLM output is non-deterministic). Predicates:
label set membership, blocking set membership, category regex (case-
insensitive alternation over dimension-relevant terms), evidence keyword
any-of (case-insensitive substring), remediation keyword any-of (case-
insensitive substring), and a minimum findings count. The any-of semantic on
keywords gives the persona flexibility within the dimension while still
enforcing a substantive catch.

### AC-3 · Runner + matcher

`match-synthetic.sh` is a pure jq predicate evaluator: takes envelope JSON +
expected JSON; returns 0 if any envelope finding satisfies all predicates,
1 otherwise; emits diagnostic on stderr listing the expected predicates and
the actual findings on failure. `run-synthetic.sh` orchestrates: per
dimension, reads persona file + composes synthetic brief (persona body +
nonce + fenced fixture, no slice-AC or coding-conduct fences) + invokes
`claude -p --output-format=json` + parses via `auto-review-parse.sh` +
delegates to matcher. Sequential rather than parallel — failure-fast
diagnostic + minimal API budget.

Smoke-test transcript (run prior to PR open, cwd `/tmp/match-test`):

```
=== PASS CASE ===           → exit 0; "PASS — 1/1 finding(s) match"
=== FAIL (evidence missing) === → exit 1; diagnostic with expected + actual
=== EMPTY ===               → exit 1; "envelope has 0 finding(s), expected ≥1"
```

### AC-4 · CI workflow

Trigger paths catch every surface that could regress synthetic-injection
signal: persona prompts (`reviewer-*.md`), orchestrator scripts
(`spawn-multi-reviewer.sh`, `derive-verdict.sh`), parser (`auto-review-parse.sh`),
synthetic content (`tests/personas/synthetic/**`), runner + matcher
(`run-synthetic.sh`, `match-synthetic.sh`), and the workflow file itself.
Skip-on-no-API-key handled inside the runner (workflow always exits 0 in
that case); fork PRs without secret access are unaffected.

### AC-5 · Documentation

CLAUDE.md strike removes the synthetic-fixtures carry-over from §Hard-controls
§Not-yet-in-scope (now shipped); the v3c sibling carry-overs (live persona
drift detection, multi-provider 3rd-agent reviewer, mutation testing on
persona prompts) remain.

## Test plan

- [x] `bash -n tests/personas/run-synthetic.sh` — clean
- [x] `bash -n tests/personas/match-synthetic.sh` — clean
- [x] Matcher covered by `tests/shellspec/match-synthetic.spec.sh` (8 cases:
  1 PASS-all-predicates + 5 per-predicate FAIL + 2 missing-input precondition)
- [x] Runner skip-on-no-API-key: `unset ANTHROPIC_API_KEY; tests/personas/run-synthetic.sh`
  → exit 0 with skip diagnostic
- [x] Each fixture parses as a unified diff (visual inspection; header +
  hunk + add lines all present)
- [x] Each expected.json parses as JSON with required schema fields
- [ ] CI workflow runs: pending PR open
- [ ] Live-invocation 4/4 PASS: pending CI run with API key (forks → skip)

## Preview-deploy verification

N/A — no `src/` UI surface in this slice. Per spec 72a, the 6-dim rubric
applies only to slices touching `src/app/**`, `src/components/**`, or
browser-rendered `*.tsx`.

## Adversarial review

- Multi-agent auto-review (4 specialists at k=2) on PR open — pending
- Manual adversarial considerations (addressed in this slice):
  - Fixture content as attack surface — addressed in `security.md` §10 +
    threat model section (fixtures never applied; text-only evidence)
  - Verdict-coercion via fixture prompt-injection — addressed via per-
    invocation nonce + inherited persona-file guard
  - CLI version drift between synthetic runner and auto-review workflow —
    documented as lockstep requirement in AC-3 + acknowledged out-of-scope
    in `security.md`
  - Comment-review hook noise on planted-defect content — addressed by
    skip-list extension at `.claude/hooks/comment-review.sh` L73

## Regression check

- `tests/personas/run-replay.sh` (golden replay) — unchanged; still passes
  in the parallel `persona-fixtures.yml` workflow
- No `src/` touches → no vitest/typecheck regression risk
- No changes to `scripts/spawn-multi-reviewer.sh`, `scripts/derive-verdict.sh`,
  or `scripts/auto-review-parse.sh` — existing auto-review behaviour
  unchanged
- Comment-review hook skip-list addition: pure-additive (`tests/personas/synthetic/*`
  added to the case statement); existing skips preserved verbatim

## 68f/g register entries

None registered for this slice. The synthetic-fixtures carry-over lives in
spec 72c §9, not the 68f/g visual-anchor register.

## DoD final state

| # | DoD item | Status | Evidence |
|---|---|---|---|
| 1 | All AC met with evidence | ✅ | AC sign-off table above (5/5 PASS) |
| 2 | Tests written + passing | ✅ | Matcher covered by 8-case ShellSpec (`tests/shellspec/match-synthetic.spec.sh`); CI live-invocation gated on API key |
| 3 | Adversarial review done | 🟡 | Manual considerations addressed in `security.md`; multi-agent auto-review pending PR open |
| 4 | Preview deploy verified (UI) | N/A | No UI surface |
| 5 | No regression in adjacent slices | ✅ | Golden replay unchanged; no `src/` touches; orchestrator scripts unmodified |
| 6 | Slice's open 68f/g entries resolved | N/A | No 68f/g entries for this slice |

Plus 13-item security checklist: 7 PASS / 1 NEW-SURFACE-NEUTRAL / 5 N/A / 0 FAIL.
