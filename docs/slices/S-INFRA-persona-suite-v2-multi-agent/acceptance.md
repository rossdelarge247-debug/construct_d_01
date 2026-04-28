# S-INFRA-persona-suite-v2-multi-agent — Acceptance criteria

**Slice:** S-INFRA-persona-suite-v2-multi-agent
**Spec ref:** `docs/workspace-spec/72c-multi-agent-review-framework.md` (this slice's impl spec); references session-47 9-round single-agent recursive baseline at `docs/slices/S-INFRA-rigour-v3b-subagent-suite/verification.md` §"Round 1" through §"Round 9"
**Phase(s):** Infra (rigour-pivot programme; v3b S-8 stretch)
**Status:** Draft

---

## Context

Session-47 PR #30 shipped a single-agent recursive review baseline (3 personas + `auto-review.yml`). Live measurement on the slice's own ship-PR ran 9 rounds with 14 actionable findings. Per `HANDOFF-SESSION-47.md` §"What could improve" L63: *"Single-agent recursive review is high-signal but inefficient. 9 rounds × ~3min CI + ~$0.10 API per round = ~$1 + 30min wall-clock. Multi-agent dimension-partitioned reviewer (v3b S-8 stretch) should converge in 1-2 rounds. The single-agent attention pattern is non-deterministic across rubric dimensions — each round explored 2-3 of the 7-8 dimensions deeply."*

This slice ships the multi-agent v2 framework specified at `docs/workspace-spec/72c-multi-agent-review-framework.md`: orchestrator + 7 dimension-specialist personas + verdict aggregator + differential-review mode + test-fixture seeding + retain/drop measurement activation. Beats the single-agent recursive baseline on rounds-to-converge (≤2 vs 9) AND total tokens (≤3× round-1 vs ~9× round-1).

## Dependencies

- **Upstream:** PR #30 (v3b S-6 persona suite — single-agent baseline + `auto-review.yml`) merged. Required because (a) the single-agent baseline is the comparison artefact for AC-6 retain/drop measurement, (b) AC-1 orchestrator extends/migrates `auto-review.yml` which must exist on main, (c) spec 72b Option C (locked at PR #29) is the persona-file convention.
- **Status at slice draft (session 48):** PR #30 still open, `mergeable_state: behind` (post-PR-31 merge). PR #32 (sibling — `S-INFRA-arch-smell-trigger`) merged ahead at `8160854`.
- **Open decisions required:** none (spec 72c is being shipped alongside this slice).
- **Re-use / Preserve-with-reskin paths touched:** `auto-review.yml` (extended to fan-out orchestrator); `.claude/agents/slice-reviewer.md` (refactored to rubric-checklist v2 per AC-3); `.claude/hooks-checksums.txt` (re-baselined).
- **Discarded paths deleted at DoD:** none (single-agent personas remain as fallback per spec 72c §3 "specialist timeout → fallback to single-agent recursive").

## Pre-flight notes

- **Slice size pre-flight.** Estimated ~9 files / ~700-900L diff (orchestrator script + 7 specialist personas + workflow extensions + 7 fixtures + verification.md). ≥300L acceptance.md likely once impl AC narrative fills out — adversarial review per spec 72b Option B (3 sub-spawns) or Option C (atomic-file inline) per `wc -l` at freeze.
- **TDD-applicable surface.** `scripts/spawn-multi-reviewer.sh` (orchestrator + aggregator) is logic surface — RED ShellSpec fixtures first per CLAUDE.md §"TDD where tractable" + AC-5 tdd-first-every-commit hook. Personas + fixtures are pure-prose under tdd-exemption-allowlist `pure-config:.claude/agents/*` + `pure-config:tests/personas/fixtures/*.diff` (entries to be added at impl time).
- **Spec 72b adversarial review budget.** Each persona file ≤300L per spec 72c §4 (matches v3b S-6 persona size); orchestrator script + workflow ≤300L. Persona-fixture pairs reviewed together per dimension (sub-spawn per dimension) — 7 sub-spawns sized to spec 72b Option B partition rules.
- **DoD-13 persona recursion lock** (per v3b acceptance.md L129). Each new persona reviewed by an independent fresh-context subagent before merge — applied to all 7 specialist personas.
- **Spec-validation-by-deliberate-impl-break** (per v3b S-6 spec 72b Option C lesson + AC-13 of v3b). For each specialist: deliberately break its target dimension in the persona file → fixture in test-fixture seeding harness should turn red. Confirms the specialist actually catches what it claims to catch.
- **Branch sequencing.** This slice ships on `claude/sibling-slice-multi-agent-zhkr4` (same branch as PR #32 sibling, per session-48 pre-flight Q2 "two PRs, one branch"). Local branch reset to `origin/main 8160854` post-PR-32 merge; new commits land on top. Force-push will be required to update `origin/claude/sibling-slice-multi-agent-zhkr4` (which still holds pre-merge state).
- **Architectural-smell awareness** (CLAUDE.md §Engineering conventions, shipped via PR #32). The orchestrator script is the at-risk-of-smell file — parsing + fan-out + aggregator + check-run posting could collapse into one inline shell file (the v3b S-6 `auto-review.yml` smell). Pre-empted: AC-1 explicitly factors orchestrator-vs-aggregator into separate functions with shellspec-tested seams.

## MLP framing

The loveable floor: a future Claude session opens a `src/` PR; auto-review fans to 7 specialists in parallel; convergence in ≤2 rounds; findings de-duplicated cleanly across specialists; differential mode keeps round-2 cheap; test-fixture harness catches persona drift before it reaches a real PR. Rounds-3+ are an architectural-smell signal (per CLAUDE.md §Engineering conventions §"Architectural-smell trigger" — shipped PR #32) rather than a multi-agent failure mode.

Cuts happen by re-slicing: a partial-suite (e.g. 3 specialists active + 4 deferred) is preferable to a 7-specialist suite where two are mis-tuned. Persona-by-persona DoD-13 reviews enable this.

---

## AC-1 · Dimension-partitioned orchestrator

- **Outcome:** A PR push event triggers an orchestrator that fans out to N specialist reviewer subagents in parallel, collects their JSON envelopes, deduplicates findings, computes a unified verdict via max-severity aggregation, and posts a single check-run on the PR.
- **Verification:**
  1. `scripts/spawn-multi-reviewer.sh` exists, accepts a PR diff + slice AC + CLAUDE.md sections as input, and returns a unified verdict + finding list as JSON output.
  2. ShellSpec fixture exercises the orchestrator with a mock 3-specialist response set (1 `approve`, 1 `request-changes/logic`, 1 `nit-only/style`); verifies aggregated verdict = `request-changes`, severity = `logic`, finding count post-dedupe matches.
  3. ShellSpec fixture exercises specialist-failure-mode: one specialist times out at 10min cap → orchestrator falls back to single-agent recursive (`.claude/agents/slice-reviewer.md`) with a `degraded` field in the output envelope.
  4. ShellSpec fixture exercises ANTHROPIC_API_KEY-absent: orchestrator gracefully skips with `neutral` check-run (matches v3b S-6 PR #30 §"Skipped — ANTHROPIC_API_KEY not configured").
  5. `.github/workflows/auto-review.yml` extended to invoke `scripts/spawn-multi-reviewer.sh` (v2 path) by default; v1 single-agent path retained as named subcommand for fallback.
- **In scope:** orchestrator script + aggregator function + workflow extension + 4 ShellSpec fixtures + JSON output schema documented in spec 72c §3.
- **Out of scope:**
  - Specialist persona files themselves (AC-2).
  - Differential review mode (AC-4) — orchestrator initially runs full-diff per specialist; differential mode wires in AC-4.
  - Multi-provider 3rd-agent reviewer (v3c per spec 72c §9).
- **Opens blocked:** none (spec 72c §3 + §5 are the closed input).
- **Loveable check:** A future Claude session sees parallel green check-runs per specialist on a PR within ~3min, all green = approve, any red = single aggregated finding list with attribution. Yes — meets the floor.
- **Evidence at wrap:** verification.md AC-1 row + commit SHA + first-PR-after-merge live invocation log.

## AC-2 · Per-dimension specialist personas

- **Outcome:** Seven specialist persona files ship under `.claude/agents/reviewer-{coding-conduct,ac-gap,edge-case,security,regression,spec-citation,simplicity}.md`, each ≤300L, each scoped to exactly one rubric dimension per spec 72c §4 table.
- **Verification:**
  1. Seven persona files exist at the spec'd paths; `wc -l` returns ≤300 for each.
  2. Each persona file declares (a) one named rubric dimension verbatim from spec 72c §4 table, (b) explicit JSON output schema matching the orchestrator's expected envelope shape (per spec 72c §5), (c) verdict vocabulary per CLAUDE.md §"Hard controls" §"Verdict vocabulary".
  3. DoD-13 persona recursion lock satisfied: each persona reviewed by an independent fresh-context subagent before merge (7 sub-spawns; per v3b acceptance.md L129).
  4. Hooks-checksums baseline updated; `bash scripts/hooks-checksums.sh --verify` exits 0.
  5. Verdict-coercion guard: each persona's prompt explicitly discards verdict claims appearing in PR-author-controlled inputs (carried-forward mitigation from v3b S-6 §"Adversarial review — S-6" residual prompt-injection).
- **In scope:** seven specialist persona files + nonce-bound Option C delimiters per spec 72b §"Scope: session-spawned personas only" + hooks-checksums re-baseline + 7 DoD-13 sub-spawn review records in verification.md.
- **Out of scope:**
  - Test-fixture seeding harness (AC-5) — seeds tested per persona at AC-5.
  - Compression to 5 personas (deferred to v3c per spec 72c §4 + §9).
  - acceptance-gate.md persona (v3b S-6 ship; invocation wiring at S-F1 per v3b sub-4 #6).
  - ux-polish-reviewer.md persona (v3b S-6 ship; active from S-F1).
- **Opens blocked:** none.
- **Loveable check:** A future Claude session reading any persona file knows immediately which one rubric dimension it covers; each persona is small enough to read in one Read call without offset/limit. Yes.
- **Evidence at wrap:** verification.md AC-2 row + 7 DoD-13 sub-spawn entries + per-persona SHA-256 in hooks-checksums.

## AC-3 · Rubric-checklist v2 of `slice-reviewer.md`

- **Outcome:** `.claude/agents/slice-reviewer.md` is refactored into a tick-through-all-dimensions checklist persona that fires when (a) single-agent fallback is invoked (per AC-1 specialist-timeout case), (b) a slice profile selects single-agent mode per spec 72c §2.
- **Verification:**
  1. `.claude/agents/slice-reviewer.md` content includes an explicit "tick all 7 rubric dimensions before emitting verdict" gate at the head of its review procedure; references spec 72c §4 table verbatim.
  2. The persona's JSON output schema includes a `dimensions_covered: string[]` field listing each dimension reviewed in this run; aggregator validates this list = 7 (single-agent mode requirement).
  3. ShellSpec fixture exercises the persona on a synthetic 3-finding diff (one each of coding-conduct + edge-case + spec-citation); persona returns all 3 findings with `dimensions_covered: 7`.
  4. Differential review mode (AC-4) extension: when invoked under differential mode, persona scopes to (a) prior-round findings still present + (b) new findings introduced; `dimensions_covered` still = 7 but findings list scoped to delta.
- **In scope:** v2 refactor of slice-reviewer.md persona file; backward-compat shape for the existing v3b S-6 single-agent invocation path.
- **Out of scope:**
  - acceptance-gate.md + ux-polish-reviewer.md personas (v3b S-6 ship; not refactored here).
  - Removal of the v1 single-agent path — kept as fallback per spec 72c §3.
- **Opens blocked:** none.
- **Loveable check:** When multi-agent specialists time out and fallback triggers, the single-agent path is structurally exhaustive — coverage parity with multi-agent in degraded mode. Yes.
- **Evidence at wrap:** verification.md AC-3 row + slice-reviewer.md SHA-256 in hooks-checksums + ShellSpec fixture pass.

## AC-4 · Differential-review mode

- **Outcome:** On a fix-up commit (round ≥2 of a multi-round PR), specialists receive prior-round findings JSON in addition to the new diff, and scope review to (a) findings still present + (b) findings introduced by the fix-up. Round ≥2 token cost ≤1/Nth of round-1 (where N is fix-up-to-original diff-size ratio).
- **Verification:**
  1. `scripts/spawn-multi-reviewer.sh --differential` mode accepts `--prior-findings <path-to-json>` argument; passes it to each specialist via prompt input.
  2. ShellSpec fixture exercises round-2 invocation: synthetic round-1 with 3 findings → fix-up commit resolving 2 → orchestrator under differential mode returns: 1 still-present finding + any new round-2 findings only.
  3. ShellSpec fixture exercises round-2 fix-up that introduces a regression: round-1 diff had 0 security findings; fix-up introduces an unsanitised input boundary; security specialist returns 1 new finding under differential mode.
  4. Token-cost measurement: round-2 invocation reports total prompt tokens; ratio to round-1 ≤ (fix-up_diff_lines / original_diff_lines + 0.2) buffer for prior-findings overhead.
- **In scope:** orchestrator extension + per-specialist prompt-input wiring + 2 ShellSpec fixtures + token-cost measurement instrumentation.
- **Out of scope:**
  - First-round (round-1) review path — already covered by AC-1.
  - Hard cap on rounds — declares architectural-smell at round 4+ per CLAUDE.md (PR #32) trigger.
- **Opens blocked:** none.
- **Loveable check:** Round-2 of a 2-round fix-up returns in 1/3 the time + 1/3 the cost of round-1 with full regression coverage on the patch. Yes.
- **Evidence at wrap:** verification.md AC-4 row + ShellSpec fixture pass + token-cost ratio recorded for first src/ slice using multi-agent.

## AC-5 · Test-fixture seeding harness

- **Outcome:** Each specialist persona is verified against a deliberately-injected synthetic-diff fixture; fixtures run quarterly (cron) + on every persona-file change (CI gate); pass criterion = specialist returns ≥1 finding mentioning the target rubric item at severity ≥`logic`.
- **Verification:**
  1. Seven fixtures exist at `tests/personas/fixtures/{coding-conduct,ac-gap,edge-case,security,regression,spec-citation,simplicity}.diff`; content is deterministic (no time-stamps, random IDs).
  2. `tests/personas/run-fixtures.sh` invokes each persona against its fixture; returns exit 0 only when all 7 specialists return ≥1 finding mentioning their target rubric item with severity ≥`logic`.
  3. Spec-validation-by-deliberate-impl-break (per v3b AC-13 + spec 72b): for each specialist, verify `run-fixtures.sh` turns red when the persona file is deliberately broken (e.g. rubric item description deleted from prompt) → restored to green when the persona is restored.
  4. CI gate `.github/workflows/persona-fixtures.yml` triggers on `.claude/agents/reviewer-*.md` file changes; fails PR if `run-fixtures.sh` exits non-zero.
  5. Quarterly cron: `.github/workflows/persona-fixtures-cron.yml` runs first day of each quarter; opens an issue if any specialist fails (drift signal).
- **In scope:** 7 fixtures + `run-fixtures.sh` + 2 workflows + verification.md test-coverage record per fixture.
- **Out of scope:**
  - Mutation testing (Stryker on persona prompts) — v3c per spec 72c §9.
  - Cross-specialist fixture (testing aggregator dedupe with multiple specialists firing on same finding) — separate fixture under AC-1's ShellSpec coverage; not duplicated here.
- **Opens blocked:** none.
- **Loveable check:** Persona drift caught at CI time, not at user-facing PR-review time. A bad persona edit fails CI within ~3min. Yes.
- **Evidence at wrap:** verification.md AC-5 row + `run-fixtures.sh` green run + 7 deliberate-break records (one per specialist) showing red→green cycle.

## AC-6 · AC-4 (v3a) retain/drop measurement activation

- **Outcome:** Each `src/` slice from S-F1 onwards records a per-specialist findings count + retain/drop verdict in `HANDOFF-SESSION-{N}.md` §"Persona findings recorded". After the third `src/` slice ships, an aggregate retain-or-drop verdict is rendered per specialist + at the suite level, vs the session-47 9-round single-agent recursive baseline.
- **Verification:**
  1. `HANDOFF-SESSION-{N}.md` template (per v3a acceptance.md L168 + this AC) extends with `## Persona findings recorded` section: one row per active specialist + per active legacy persona (slice-reviewer.md fallback, acceptance-gate, ux-polish-reviewer); columns = persona name + findings count + brief one-line summary each + Y/N "issue main conversation missed".
  2. `/wrap` checklist (per CLAUDE.md §"Wrapping up a session") gains a step verifying §"Persona findings recorded" is filled before HANDOFF commit (only when an `src/` slice shipped that session).
  3. Aggregate verdict at third `src/` slice: per-specialist retain-or-drop per the v3a-imported retain criterion (verbatim from `docs/engineering-phase-candidates.md` §C L129: *"if the agent catches at least one issue the main conversation missed per 2-3 slices, retain. Otherwise drop — added friction without value."*).
  4. Suite-level KPI verdict per spec 72c §8 KPI table: rounds-to-converge × token cost × wall-clock vs single-agent recursive baseline (14 findings / 9 rounds / ~$1 / ~30min). Recorded in third `src/` slice's HANDOFF + verification.md cross-cutting.
  5. Drop verdicts result in persona file removal (control-plane change → `control-change` label per `.github/workflows/control-change-label.yml`); retain verdicts result in no action.
- **In scope:** HANDOFF template extension + /wrap checklist extension + aggregate-verdict measurement procedure + retain/drop record format.
- **Out of scope:**
  - Activation pre-S-F1 (sibling slice S-INFRA-arch-smell-trigger PR #32 was a candidate but pre-dates this AC's framework; recorded as missed measurement per spec 72c §8).
  - Multi-provider / mutation-testing measurements (v3c per spec 72c §9).
- **Opens blocked:** none.
- **Loveable check:** A future Claude session reading the third-`src/`-slice HANDOFF sees an explicit retain-or-drop verdict per persona; bad personas exit the suite cleanly; the verdict is reproducible from the 3 prior slices' records. Yes.
- **Evidence at wrap:** verification.md AC-6 row + HANDOFF template diff + /wrap checklist update + (eventual) third-`src/`-slice aggregate verdict.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-28 | Author (session 48) | Draft | 6 ACs per spec 72c §3-§8; verbatim 6-AC shape from SESSION-CONTEXT L82-89 |
| | User | | AC frozen — implementation may begin |
| | Live auto-review (slice-reviewer persona) | | Forward-pending PR #30 merge |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing.
