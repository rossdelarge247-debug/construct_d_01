# Synthetic-deliberate-injection per-persona fixtures

Per-persona regression detection: each fixture under this directory is a unified
diff carrying a single planted defect targeting one specialist's dimension. The
runner invokes the actual persona via `claude -p` against its own fixture and
asserts the persona flags the planted defect.

## Why synthetic alongside golden replay

Golden-PR replay (`tests/personas/run-replay.sh`) is **deterministic
aggregator-only** — it covers aggregator-logic regression. Synthetic-injection
covers **per-persona signal regression**: a persona-prompt edit that subtly
weakens a dimension's catch-rate without flipping verdict-tier on the 4-PR
golden seed.

Both harnesses run side-by-side under separate workflows; each addresses a
distinct failure mode.

## File layout

```
tests/personas/synthetic/
├── README.md                            (this file)
├── security.diff                        (planted XSS defect)
├── architecture.diff                    (planted mixed-concerns / no-seam defect)
├── correctness.diff                     (planted off-by-one defect)
├── style.diff                           (planted PR/round provenance comment)
└── expected/
    ├── security.json                    (expected-finding signature)
    ├── architecture.json
    ├── correctness.json
    └── style.json
```

Each `expected/<dimension>.json` declares the predicates the persona's envelope
must satisfy: label set, blocking flag set, category regex, evidence keyword
set (any-of), remediation keyword set (any-of), and a minimum findings count.
Predicates are fuzzy-matched (case-insensitive substring for keywords; regex
for category) since LLM output is non-deterministic.

## How the runner works

`tests/personas/run-synthetic.sh` per dimension:

1. Reads the persona file body from `.claude/agents/reviewer-<dim>.md`
2. Composes a synthetic brief: persona body + per-invocation nonce + fenced
   `tests/personas/synthetic/<dim>.diff`. No slice-AC or coding-conduct fences
   are included — the persona evaluates the diff against its own rubric in
   isolation
3. Invokes `npx -y @anthropic-ai/claude-code@<pinned> -p --output-format=json`
   with the brief on stdin
4. Parses raw output via `scripts/auto-review-parse.sh` to envelope JSON
5. Runs the matcher against `expected/<dim>.json` predicates
6. PASS if at least one finding satisfies all predicates; FAIL otherwise

Exit 0 on all-pass; exit 1 with per-dimension diagnostic on first failure.
`ANTHROPIC_API_KEY` unset → exit 0 with `SKIP` to stderr (forks unaffected).

## How to run locally

```bash
export ANTHROPIC_API_KEY=sk-...
tests/personas/run-synthetic.sh
```

A run takes ~30-60s wall (4 sequential `claude -p` calls; one per persona).
Sequential rather than parallel because the matcher exits on first failure +
non-determinism is per-call rather than per-batch.

## When the runner regresses

Persona edit weakened the dimension catch → runner FAILs the offending
dimension(s). Inspect the diagnostic: actual envelope abridged, which predicate
did not match. Either the persona prompt needs strengthening, or the predicate
needs widening (e.g., the persona caught the defect but used a synonym not in
`*_must_contain_any_of`).

## CI integration

`.github/workflows/persona-synthetic-fixtures.yml` triggers the runner on
changes to: `.claude/agents/reviewer-*.md`, `scripts/spawn-multi-reviewer.sh`,
`scripts/derive-verdict.sh`, `scripts/auto-review-parse.sh`,
`tests/personas/synthetic/**`, `tests/personas/run-synthetic.sh`. The workflow
gates on `secrets.ANTHROPIC_API_KEY`; absent → neutral skip.

## Adding a new fixture

1. Author `tests/personas/synthetic/<dim>.diff` — one planted defect, ~20-30L
2. Author `tests/personas/synthetic/expected/<dim>.json` — the signature
3. Run the runner locally with `ANTHROPIC_API_KEY` set; iterate predicates
   until the matcher PASSes consistently across 2-3 invocations
4. Commit; CI then enforces stability on every persona/orchestrator change
