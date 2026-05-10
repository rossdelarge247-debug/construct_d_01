# S-INFRA-canvas-fidelity-gate — Test plan

## Test surface

| Surface | Test type | Location |
|---|---|---|
| Persona file content | None (pure-prose under `pure-config:.claude/agents/*` allowlist) | N/A |
| `auto-review.yml` matrix routing | YAML lint + ShellSpec fixture mocking `acceptance.md` with/without `Linked canvas:` field | `tests/shellspec/auto-review-dimensions.spec.sh` |
| `scripts/preflight-review.sh` dimension acceptance | ShellSpec — positive cases for `canvas-fidelity` + `prototype-readiness`; negative case (unknown dimension) preserved | `tests/shellspec/preflight-review.spec.sh` |
| `scripts/validate-finding-envelope.sh` dimension acceptance | ShellSpec — positive cases for both new dimensions | `tests/shellspec/validate-finding-envelope.spec.sh` |
| `scripts/spawn-multi-reviewer.sh DIMENSIONS` validation | ShellSpec — positive cases for both new dimensions | `tests/shellspec/spawn-multi-reviewer.spec.sh` |
| `scripts/auto-review-filter-prior.sh` dimension acceptance | ShellSpec — positive case for `canvas-fidelity` (extends prior coverage of `prototype-readiness` already in fixture) | `tests/shellspec/auto-review-filter-prior.spec.sh` |
| Synthetic fixture canvas-fidelity diff + expected JSON | Persona run + matcher (when `ANTHROPIC_API_KEY` set) | `tests/personas/run-synthetic.sh canvas-fidelity` + `tests/personas/match-synthetic.sh canvas-fidelity` |
| Synthetic-fixture workflow path-filter | Workflow YAML lint + path-filter dry-run | `.github/workflows/persona-synthetic-fixtures.yml` |

## Test counts

- **ShellSpec assertions:** 8 positive (4 scripts × 2 dimensions) + dimension routing fixture (1 with-field + 1 without-field) = 10 minimum.
- **Synthetic fixture:** 1 diff + 1 expected JSON envelope; persona run-and-match counts as 1 regression test that fires on path changes (per workflow path-filter).
- **Visual regression:** N/A — no UI surface in this slice.

## Pre-merge gates

1. **Lint clean.** `npm run lint` passes (eslint + yaml).
2. **Typecheck clean.** `npm run typecheck` passes (no TS surface in this slice but harness-wide check still runs).
3. **Tests passing.** Full vitest suite green (no regression on the existing 402 tests).
4. **ShellSpec fixtures passing.** `tests/shellspec/run-all.sh` (or per-fixture invocation) green.
5. **Auto-review verdict.** `approve` or `nit-only` on the PR before merge.
6. **Synthetic-fixture workflow.** Green on PR (or skip-with-neutral when `ANTHROPIC_API_KEY` absent in fork-PR context).

## Test-pain audit (per spec 72d §3)

No new logic seams introduced beyond extending existing case-statement allowed-dimension lists. Mock-count not at risk; threshold (≤2 mocks per unit test for `infrastructure` category, ≤5 for prototype) easily under.

## TDD-applicable surface

- **`scripts/spawn-multi-reviewer.sh` DIMENSIONS validation extension** — RED ShellSpec test asserting `canvas-fidelity` accepted before touching the script. Bail-out criterion: case-statement extensions are pure-config but the validation logic IS logic; assertion-first order applies.
- **`scripts/auto-review-filter-prior.sh` extension** — same pattern.

## TDD bail-out

- **Persona prompt content** — pure-prose `category:pure-config:.claude/agents/*`. Per `docs/tdd-exemption-allowlist.txt` header rubric.
- **Synthetic fixture diff + expected JSON** — deterministic content `category:pure-config:tests/personas/synthetic/**/*`. Per allowlist.
- **Slice docs** — pure-prose. Allowlist exempt.
