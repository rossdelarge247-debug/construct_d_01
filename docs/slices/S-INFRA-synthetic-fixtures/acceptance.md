# S-INFRA-synthetic-fixtures — Acceptance criteria

**Slice:** S-INFRA-synthetic-fixtures
**Phase:** Rigour-pivot v3c (synthetic-deliberate-injection per-persona fixtures)
**Status:** Draft
**Spec:** spec 72c §7 — Test-fixture seeding harness

## Context

Spec 72c §7 L141 verbatim: *"once first-3-src-slice retain/drop data confirms the 4-partition holds, add `tests/personas/synthetic/{security,architecture,correctness,style}.diff` per-persona fixtures with deliberate-injection per the original spec 72c §7 design. Synthetic catches per-persona regressions that golden-replay can't isolate (e.g. a persona edit that subtly weakens security signal but doesn't change verdict-tier on the 4-PR seed). Both then run."*

The gating IF-clause's data prerequisite is met: 3 src/ slices have shipped through the 4-specialist suite, and findings from all three cluster cleanly into the 4 dimension categories with no catalogue gaps requiring a 5th specialist. The 4-partition holds; synthetic-injection is unblocked for implementation.

This slice complements the existing golden-PR replay harness at `tests/personas/run-replay.sh`, which is deterministic aggregator-only and covers aggregator-logic regression. Synthetic-injection adds **live `claude -p` invocation against deliberate-injection diffs** — catching per-persona regressions where a persona edit subtly weakens dimension catch-rate without flipping verdict-tier on the 4-PR seed.

## Dependencies

- `tests/personas/run-replay.sh` — golden-PR replay (parallel, separate harness; not modified here)
- `.claude/agents/reviewer-{security,architecture,correctness,style}.md` — persona prompts; load-bearing for brief composition
- `scripts/auto-review-parse.sh` — extracts JSON envelope from `claude -p --output-format=json` raw output (re-used)
- `.github/workflows/auto-review.yml` — reference invocation contract (per-specialist `claude -p` call + envelope parse pattern at L207-225)
- `ANTHROPIC_API_KEY` repo secret — required for live invocation; absent → skip with neutral exit (per existing pattern; forks unaffected)

## Pre-flight notes

- **Acceptance budget:** this file targets ≤120L. Standard adversarial review applies (no spec 72b Option A/B/C partition needed; well under 300L).
- **Implementation budget:** ~400-600L total (4 .diff fixtures + 4 expected signatures + runner + CI workflow + slice docs + README). Synthetic-injection requires live `claude -p` plumbing that the existing golden-replay harness defers (the latter is aggregator-only). AC text is scoped to this budget per CLAUDE.md §Engineering conventions Constraint #28; no aspirational AC text.
- **MLP framing:** synthetic-injection's value is "did this persona stop catching its target dimension?" That requires actual `claude -p` invocation. A structural-only stub would not deliver the intended regression signal — declared out of scope here.
- **Live-invocation cost:** ~4 `claude -p` calls per CI run, only when persona/orchestrator/synthetic-fixture files change (path-filtered trigger). API budget similar to `auto-review.yml` per PR.

## MLP framing

**In scope:**

1. 4 unified-diff fixtures with planted defects, one per persona dimension
2. 4 expected-finding signature files defining what each persona MUST flag
3. Live-invocation runner (`run-synthetic.sh`) — invokes the actual persona via `claude -p`, parses envelope, matches against signature
4. CI workflow gating on persona/orchestrator changes; skip on missing API key
5. README explaining the injection pattern + how-to-run

**Out of scope:**

- Persona-file SHA tracking in fixtures (the existing golden-replay seed at `prior-verdict.json` carries this; synthetic fixtures cite spec 72c §7 not specific persona-file SHAs)
- Severity-threshold pass criterion as a separate field (signature uses `label_in[]` + `blocking` directly per Conventional Comments)
- Cross-persona fixtures (where one diff plants defects spanning 2+ dimensions) — single-dimension fixtures are sufficient for v3c ship; cross-cutting catches deferred
- ShellSpec coverage of every matcher branch — the matcher is small enough that 1-2 stub-envelope tests are sufficient

## AC-1 · Synthetic deliberate-injection fixtures (4 unified-diff files)

**Surface:** `tests/personas/synthetic/{security,architecture,correctness,style}.diff`

Each is a unified diff (synthesised, not git-applied; representative source filename to anchor evidence quotes) carrying a single planted defect targeting that persona's dimension. Defects drawn from real-world catalogues:

- `security.diff` — XSS via unsanitised `dangerouslySetInnerHTML` on user-controlled input (OWASP A03:2021 Injection)
- `architecture.diff` — UI component directly importing DB-driver module + executing SQL inline (CLAUDE.md §"Effects behind interfaces" violation; testability-via-seam smell)
- `correctness.diff` — off-by-one in pagination loop bound (`<` vs `<=`) producing missing-last-record bug
- `style.diff` — a comment carrying PR/round/session provenance, the rotting-lineage pattern CLAUDE.md §"Comments: WHY not WHAT, no temporal provenance" calls out (the planted comment cites a PR identifier + round number as change-history narration in source)

Each fixture is ~20-30L unified-diff. Author the defect minimally — no surrounding noise.

**Verification:** 4 files exist at canonical path; each parses as a unified diff (`git apply --check` exits 0 against an empty index *or* the diff is structurally valid per `diff -u` output shape — the fixture isn't applied, only fed as evidence).

## AC-2 · Expected-finding signature contracts (4 JSON files)

**Surface:** `tests/personas/synthetic/expected/{security,architecture,correctness,style}.json`

Each file defines the planted finding's expected signature — keyword-fuzzy matching since LLM output is non-deterministic. Schema:

```json
{
  "dimension": "<security|architecture|correctness|style>",
  "fixture_path": "tests/personas/synthetic/<dimension>.diff",
  "planted_defect_summary": "<one-line description>",
  "expected_finding": {
    "label_in": ["<label1>", "<label2>"],
    "blocking_in": [true, false],
    "category_pattern": "<regex matching valid category names>",
    "evidence_must_contain_any_of": ["<keyword1>", "<keyword2>"],
    "remediation_must_contain_any_of": ["<keyword1>", "<keyword2>"]
  },
  "min_findings_count": 1
}
```

`label_in` / `blocking_in` are sets (persona has flexibility within the Conventional Comments vocabulary); `evidence_must_contain_any_of` / `remediation_must_contain_any_of` use case-insensitive substring match with ANY-of semantics (one keyword match suffices).

**Verification:** 4 files exist; each parseable as JSON; each consumed by `run-synthetic.sh` matcher.

## AC-3 · Live-invocation runner

**Surface:** `tests/personas/run-synthetic.sh`

Bash script following `tests/personas/run-replay.sh` structural conventions. Steps per dimension:

1. Compose synthetic brief: persona file body + per-invocation nonce + fenced synthetic .diff. Slice-AC + coding-conduct fences are omitted by design — synthetic context evaluates the diff against the persona's own rubric in isolation, without external slice or repo conduct anchoring
2. Invoke `npx -y @anthropic-ai/claude-code@<pinned-version> -p --output-format=json` with brief on stdin
3. Parse raw output via `scripts/auto-review-parse.sh` to envelope JSON
4. Run matcher against expected signature
5. PASS if ≥1 finding matches all signature predicates; FAIL otherwise

Matcher predicates (ALL-of):

- `finding.label ∈ expected.label_in`
- `finding.blocking ∈ expected.blocking_in`
- `finding.category =~ expected.category_pattern`
- ≥1 keyword from `expected.evidence_must_contain_any_of` is a case-insensitive substring of `finding.evidence`
- ≥1 keyword from `expected.remediation_must_contain_any_of` is a case-insensitive substring of `finding.remediation`

Behaviour:

- `ANTHROPIC_API_KEY` unset → exit 0 with `SKIP: ANTHROPIC_API_KEY not set` to stderr. Forks without secret access do not fail the workflow; the same skip-with-neutral semantic governs every API-key-dependent gate in the rigour pipeline
- All 4 dimensions PASS → exit 0 with summary
- Any dimension FAIL → exit 1 with per-dimension diagnostic (which predicate didn't match + actual envelope abridged)

The pinned `claude-code` CLI version matches the version pinned in `auto-review.yml`. Drift between the synthetic runner's pin and the auto-review workflow's pin is its own regression class — the two MUST stay in lockstep, otherwise a synthetic-injection signal under one CLI version against an auto-review under another is a meaningless comparison.

**Verification:** runner exists; running `bash -n` clean; matcher logic exercised with 1-2 stub-envelope ShellSpec cases; manual smoke run with `ANTHROPIC_API_KEY` confirms 4/4 PASS at ship.

## AC-4 · CI workflow integration

**Surface:** `.github/workflows/persona-synthetic-fixtures.yml`

Single-job workflow that invokes the runner under a path-filter trigger. The trigger fires when persona prompts, the orchestrator scripts, the parser, the synthetic fixtures, or the runner itself change — keeping CI cost proportional to the surface that could regress synthetic-injection signal:

```yaml
on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - '.claude/agents/reviewer-*.md'
      - 'scripts/spawn-multi-reviewer.sh'
      - 'scripts/derive-verdict.sh'
      - 'scripts/auto-review-parse.sh'
      - 'tests/personas/synthetic/**'
      - 'tests/personas/run-synthetic.sh'
  push:
    branches: [main]
    paths: [<same as above>]
```

Job steps:

1. `actions/checkout@v4`
2. Run `tests/personas/run-synthetic.sh`
3. Skip → neutral exit (forks unaffected); FAIL → workflow fails (CI gate)

`ANTHROPIC_API_KEY` env passed via `secrets.ANTHROPIC_API_KEY`. Path-filter prevents wasteful runs on unrelated changes.

**Verification:** workflow file lints (`actionlint` or `npx @action-validator/cli`); on this PR opening, the workflow either runs and passes (if API key configured) OR skips with neutral (if not).

## AC-5 · Documentation

**Surface:**

- `tests/personas/synthetic/README.md` — design rationale; how injection works; how-to-run locally; relationship to golden replay; persona-prompt-regression vs aggregator-logic-regression distinction (per spec 72c §7 L139)
- `docs/slices/S-INFRA-synthetic-fixtures/{acceptance,security,verification}.md` — slice docs per CLAUDE.md DoD
- `CLAUDE.md` §"Not yet in scope" — strike the synthetic-fixtures carry-over (now shipped)

**Verification:** README explains injection pattern + how-to-run; slice docs complete per CLAUDE.md DoD; CLAUDE.md strike removes the carry-over line cleanly.

## Review log

_Empty at draft._
