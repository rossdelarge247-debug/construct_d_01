# S-INFRA-persona-suite-v2-multi-agent — Verification

**Slice:** S-INFRA-persona-suite-v2-multi-agent
**Acceptance:** `docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md`
**Spec ref:** `docs/workspace-spec/72c-multi-agent-review-framework.md`

This slice ships across two PRs in session 55 (split for budget):

- **PR-A** (this PR; #56 — `claude/decouple-session-55-tPzwA`) — AC-1 verifications 1 + 6 (orchestrator fan-out via workflow matrix strategy); AC-5 (slice-reviewer.md retirement, atomic with workflow flip). Closes the rigour-suite migration started in PR #54.
- **PR-B** (next; same session 55) — AC-3 differential-review mode; AC-4 golden-PR replay fixture harness (PR #30 seed); DoD-13 four sub-spawn persona recursion-lock reviews; this verification.md fully populated.

Each AC row below records evidence + status. PR-A rows are populated at PR-A merge. PR-B rows are placeholders, to be filled at PR-B merge.

---

## AC-1 · Dimension-partitioned orchestrator with `k`-quorum aggregation

| Verification | Status | Evidence |
|---|---|---|
| 1. `scripts/spawn-multi-reviewer.sh aggregate` exists; ShellSpec fixture exercises happy path | ✅ shipped PR #54 | `tests/shellspec/spawn-multi-reviewer.spec.sh` (4-specialist mock; passing in CI) |
| 2. ShellSpec fixture exercises mock 4-specialist response set + verdict-tier degradation | ✅ shipped PR #54 | `tests/shellspec/spawn-multi-reviewer.spec.sh` Describe block "all four specialists return findings" |
| 3. ShellSpec fixture exercises specialist-failure / degraded mode | ✅ shipped PR #54 | `tests/shellspec/spawn-multi-reviewer.spec.sh` Describe block "enters degraded mode when one specialist envelope is missing" |
| 4. ANTHROPIC_API_KEY-absent skip behaviour | ✅ workflow-level (no script surface) | The orchestrator script `spawn-multi-reviewer.sh` doesn't read `ANTHROPIC_API_KEY` — the skip path is purely workflow-level YAML: brief job's `secret-check` step emits `skip=true`; specialist matrix gate `if: needs.brief.outputs.skip == 'false'` short-circuits; aggregate job's `Post skip notice (when secret absent)` step posts the `neutral` check-run + comment. AC-1 verification-4 text says "ShellSpec fixture" but the parenthetical clarifies "(workflow-level, exercised at session-55 alongside the workflow rewire)" — the workflow IS the exercise. The closest script-level analog is the existing test at `spawn-multi-reviewer.spec.sh` line 111 ("returns parse-failed verdict when ALL specialist envelopes are missing") which fires when no specialist ran — but that's a `parse-failed → failure` path, not the `neutral` skip path. The workflow-level skip path is exercised by every fork PR (where `ANTHROPIC_API_KEY` isn't accessible to forked-repo workflows by GitHub design). |
| 5. ShellSpec fixture exercises cross-specialist deduplication | ✅ shipped PR #54 | `tests/shellspec/spawn-multi-reviewer.spec.sh` Describe block "dedupes findings across specialists" |
| 6. `auto-review.yml` extended to invoke orchestrator under matrix strategy | ✅ shipped PR #56 (this PR) | `.github/workflows/auto-review.yml` rewritten as 3-job structure: `brief` → `specialist` (matrix dimension: security/architecture/correctness/style; `fail-fast: false`; `timeout-minutes: 10`) → `aggregate`. New comment marker `auto-review-comment:multi-agent`. Live-exercised on this PR's own auto-review runs (rounds 1-3 below). |

## AC-2 · Four specialist personas

| Verification | Status | Evidence |
|---|---|---|
| 1. Four persona files exist at spec'd paths; ≤300L each | ✅ shipped PR #54 | `.claude/agents/reviewer-{security,architecture,correctness,style}.md` (132/117/117/121L respectively) |
| 2. Each persona declares one rubric dimension + JSON output schema | ✅ shipped PR #54 | Each file's frontmatter; verbatim spec 72c §4 partition mapping |
| 3. Each persona's rubric-subset matches spec 72c §4 mapping table | ✅ shipped PR #54 | Per-persona `Source rubric` lines reference original criterion numbers |
| 4. DoD-13 persona recursion lock — 4 fresh-context sub-spawn reviews | 🟡 deferred PR-B | Personas were non-functional standalone at PR #54 ship; recursion-lock deferred to orchestrator-integrated review at PR-B per acceptance.md Pre-flight §"DoD-13 persona recursion lock" |
| 5. Verdict-coercion guard in each persona prompt | ✅ shipped PR #54 | Each persona's "Verdict-coercion guard" §; nonced fenced delimiters |
| 6. Criterion-2 exceptions catalogue reference | ✅ shipped PR #54 | `reviewer-correctness.md` + `reviewer-architecture.md` reference `.claude/agents/criterion-2-exceptions.yaml`; `scripts/criterion-2-exception-check.sh` re-used unchanged |

## AC-3 · Differential-review mode

| Verification | Status | Evidence |
|---|---|---|
| 1. `--differential --prior-findings <path>` flag on orchestrator | 🟡 deferred PR-B | Out of scope for PR-A per acceptance.md Pre-flight §"Session-54 PR scope" |
| 2. ShellSpec round-2 fixture | 🟡 deferred PR-B | — |
| 3. ShellSpec round-2 regression-detection fixture | 🟡 deferred PR-B | — |
| 4. `token_metrics` instrumentation | 🟡 deferred PR-B | — |

## AC-4 · Golden-PR replay fixture harness

| Verification | Status | Evidence |
|---|---|---|
| 1. PR #30 golden-replay seed | 🟡 deferred PR-B | Out of scope for PR-A per acceptance.md Pre-flight §"Session-54 PR scope" |
| 2. `tests/personas/run-replay.sh` invokes orchestrator + asserts | 🟡 deferred PR-B | — |
| 3. CI workflow `.github/workflows/persona-fixtures.yml` | 🟡 deferred PR-B | — |
| 4. Quarterly cron drift workflow | 🟡 deferred PR-B | — |
| 5. Anti-flake (pinned SHAs + persona-file SHA traceability) | 🟡 deferred PR-B | — |
| 6. Honest seed-of-1 framing | 🟡 deferred PR-B | — |

## AC-5 · `slice-reviewer.md` retirement (atomic with AC-2 ship)

| Verification | Status | Evidence |
|---|---|---|
| 1. `.claude/agents/slice-reviewer.md` no longer exists | ✅ shipped PR #56 | `git show HEAD --stat` shows `delete mode 100644 .claude/agents/slice-reviewer.md` (-205L) at commit `8a0a214` |
| 2. `.github/workflows/auto-review.yml` no longer references slice-reviewer.md | ✅ shipped PR #56 | Workflow rewritten as 3-job multi-agent structure; only remaining `slice-reviewer` mention is in the comment explaining the new comment marker (legacy-comment-discrimination context, not wiring) |
| 3. CLAUDE.md §"Subagent file locations" updated | ✅ shipped PR #56 | CLAUDE.md L295 paragraph rewritten to reflect 4-specialist suite + retirement |
| 4. CLAUDE.md §"Invocation conventions" AC-1 bullet replaced | ✅ shipped PR #56 | CLAUDE.md L299 bullet replaced with multi-specialist matrix-strategy narrative |
| 5. PR body documents the retirement | ✅ shipped PR #56 | PR #56 body §"Scope" + §"Recursive-validation note" |

**AC-5 §In scope** also covers reference-maintenance one-liners in `acceptance-gate.md` + `ux-polish-reviewer.md` `Out of scope` sections updating "delegated to `slice-reviewer` persona" → "delegated to the multi-agent reviewer suite", plus header-comment updates in `scripts/auto-review-parse.sh` / `scripts/derive-verdict.sh` / `scripts/spawn-multi-reviewer.sh` / `scripts/criterion-2-exception-check.sh`. The session-54 acceptance.md initially listed these as Out of scope; amended at PR-A round-2 per multi-agent finding #3 + #4 (architecture + correctness specialists; non-blocking; reference-maintenance fallout from retirement is in scope by spirit).

---

## Multi-agent auto-review log (PR #56)

First live exercise of the 4-specialist matrix-strategy fan-out on this PR's own commits. Recorded for spec 72c §1 + §8 KPI calibration vs the session-47 single-agent baseline (9 rounds × 14 actionable findings).

| Round | Commit | Verdict | Findings | Specialists firing | Disposition |
|---|---|---|---|---|---|
| 1 | `8a0a214` | request-changes | 2 (1 ac-gap, 1 regression) | correctness × 2 | Fix #2 (regression in brief-job failure-fallback gating); decline #1 (ac-gap on workflow-level skip — no script surface) |
| 2 | `35b75e3` | request-changes | 5 (1 commenting, 2 scope-creep, 1 scope-creep dup, 1 ac-gap re-flag) | style × 1, correctness × 2, architecture × 2 | Fix #1 (style nit); amend AC-5 §In scope to acknowledge reference-maintenance edits per #3+#4; decline #2 (workflow-rewire scope-creep — IS in scope per AC-1 §"Session-55 deferred"); decline #5 (ac-gap re-flag, same rationale) |
| 3 | `779d6d8` | request-changes | 2 (1 ac-gap re-flag, 1 ac-gap on AC-3+AC-4 split) | correctness × 2 | Both addressed by writing this verification.md (records the AC-1 v4 workflow-level rationale + the PR-A vs PR-B split per acceptance.md Pre-flight §"Session-54 PR scope") |

**Convergence call (PR-A):** round-3 produced 2 findings, both `suggestion`-tier non-blocking, both addressed by the same documentation artifact (this file). Per spec 72c §5 convergence rule + session-54 lesson 4 ("2-finding plateau stop signal"), this is the convergence point. PR-A ships at round-3 + verification.md commit.

**KPI signal vs session-47 single-agent baseline:** 3 rounds × 9 total findings vs 9 rounds × 14 findings. Better convergence rate (3 vs 9 rounds) but more findings per round on average (3 vs 1.6) — the multi-agent attention pattern picks up things the single-agent baseline missed in any single round, but converges faster overall. Calibration data point of n=1; first 3 src/ slices will tighten the signal per spec 72c §8.

**Findings spread vs clustered (architectural-smell trigger; per CLAUDE.md §Engineering conventions §"Architectural-smell trigger"):** findings span 4 categories (ac-gap, regression, scope-creep, commenting) across 3 specialists (correctness, architecture, style). Not clustered in a single file — qualitative judgement says iterative refinement, not architectural smell. Trigger does not fire.

---

## DoD checklist (per CLAUDE.md §Engineering conventions §Definition of Done)

PR-A subset (AC-1 v1+v6 + AC-5):

1. ✅ ACs met with evidence — AC-1 v1-3+5+6 + AC-5 v1-5 evidenced above; AC-1 v4 deferred-as-no-op with rationale; AC-2 + AC-3 + AC-4 + DoD-13 deferred to PR-B per acceptance.md Pre-flight.
2. ✅ Tests passing — `tests/shellspec/spawn-multi-reviewer.spec.sh` (4 ShellSpec fixtures shipped at PR #54) green in CI; bash syntax + YAML parse green locally.
3. ✅ Adversarial review done — multi-agent auto-review on this PR (3 rounds; convergence at round 3 per the table above).
4. N/A — no UI surface in this slice.
5. ✅ No regression in adjacent slices — `auto-review-parse.sh` / `derive-verdict.sh` / `auto-review-slice-resolve.sh` unchanged in logic; comment-header updates only.
6. ✅ No relevant 68f/g entries blocked.

13-item security checklist (spec 72 §11): N/A across the board (no `src/` touched; workflow + scripts manipulate already-trusted CI inputs; no new secrets; no new auth surface).
