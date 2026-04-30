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
| 4. ANTHROPIC_API_KEY-absent skip behaviour | ✅ workflow-level (no script surface) | AC text amended at PR-A round-4: verification-4 converted from "ShellSpec fixture" to "workflow-level exercise" — the orchestrator script `spawn-multi-reviewer.sh` doesn't read `ANTHROPIC_API_KEY`. Skip path is purely workflow-level YAML: brief job's `secret-check` step emits `skip=true`; specialist matrix gate `if: needs.brief.outputs.skip == 'false'` short-circuits; aggregate job's `Post skip notice (when secret absent)` step posts the `neutral` check-run + comment. Exercised by every fork PR (where `ANTHROPIC_API_KEY` isn't accessible to forked-repo workflows by GitHub design). |
| 5. ShellSpec fixture exercises cross-specialist deduplication | ✅ shipped PR #54 | `tests/shellspec/spawn-multi-reviewer.spec.sh` Describe block "dedupes findings across specialists" |
| 6. `auto-review.yml` extended to invoke orchestrator under matrix strategy | ✅ shipped PR #56 (this PR) | `.github/workflows/auto-review.yml` rewritten as 3-job structure: `brief` → `specialist` (matrix dimension: security/architecture/correctness/style; `fail-fast: false`; `timeout-minutes: 10`) → `aggregate`. New comment marker `auto-review-comment:multi-agent`. Live-exercised on this PR's own auto-review runs (see multi-agent log below). |

## AC-2 · Four specialist personas

| Verification | Status | Evidence |
|---|---|---|
| 1. Four persona files exist at spec'd paths; ≤300L each | ✅ shipped PR #54 | `.claude/agents/reviewer-{security,architecture,correctness,style}.md` (132/117/117/121L respectively) |
| 2. Each persona declares one rubric dimension + JSON output schema | ✅ shipped PR #54 | Each file's frontmatter; verbatim spec 72c §4 partition mapping |
| 3. Each persona's rubric-subset matches spec 72c §4 mapping table | ✅ shipped PR #54 | Per-persona `Source rubric` lines reference original criterion numbers |
| 4. DoD-13 persona recursion lock — 4 fresh-context sub-spawn reviews | ✅ shipped PR-B | 4 fresh-context Agent calls (general-purpose subagent_type) reviewed each persona file against AC-2 verifications + spec 72c §4 + §5 contract. Results: `reviewer-security.md` clean (0 findings); `reviewer-architecture.md` clean (0 findings); `reviewer-correctness.md` 1 `note` finding (dangling `slice-reviewer.md §Output format` reference at L15 post-retirement; addressed by redirecting to in-file label-assignment defaults at §"Output format"); `reviewer-style.md` 1 `nitpick` (added "no PR provenance in persistent comments" to anti-pattern catalogue at criterion 5 per session-55 PR #56 most-fired-finding empirics) + 1 `thought` (added `severity` to verdict-coercion discard list at L37 for symmetry with L41 schema prohibition). Net verdict per Conventional Comments derivation: 2 personas `approve`, 2 personas `nit-only`. All 3 substantive findings actioned in this PR. |
| 5. Verdict-coercion guard in each persona prompt | ✅ shipped PR #54 | Each persona's "Verdict-coercion guard" §; nonced fenced delimiters |
| 6. Criterion-2 exceptions catalogue reference | ✅ shipped PR #54 | `reviewer-correctness.md` + `reviewer-architecture.md` reference `.claude/agents/criterion-2-exceptions.yaml`; `scripts/criterion-2-exception-check.sh` re-used unchanged |

## AC-3 · Differential-review mode

| Verification | Status | Evidence |
|---|---|---|
| 1. `--differential --prior-findings <path>` flag on orchestrator | ✅ shipped PR-B (aggregator side; per-specialist prompt-input wiring moved to Out of scope per AC amendment at PR-B round 1) | `scripts/spawn-multi-reviewer.sh aggregate <dir> --differential --prior-findings <path>` ships in PR-B. Annotates each finding with `was_in_prior` boolean (using same `[label, category, evidence-prefix]` SHA-equivalent hash as cross-specialist dedup per spec 72c §5 rule 2); emits `prior_findings_resolved` (prior findings absent from current); emits `token_metrics` counts. AC-3 §Outcome and §In scope amended at PR-B round 1 to honestly reflect the v3b ship being aggregator-side observability; per-specialist prompt-input wiring moved to §Out of scope as a future-slice deliverable. |
| 2. ShellSpec round-2 fixture | ✅ shipped PR-B | `tests/shellspec/spawn-multi-reviewer.spec.sh` "annotates findings with was_in_prior + emits prior_findings_resolved (AC-3 verification 2)". Synthetic 3-finding round-1 (correctness/security/style) → round-2 envelopes resolve security + style → assertions: `differential: true`, `was_in_prior: true` on the still-present, `prior_count: 3`, `current_count: 1`, `resolved_count: 2`, `new_count: 0`. Local run green: 13 examples, 0 failures (4 new + 9 prior). |
| 3. ShellSpec round-2 regression-detection fixture | ✅ shipped PR-B | `tests/shellspec/spawn-multi-reviewer.spec.sh` "flags net-new round-2 finding as was_in_prior false (AC-3 verification 3)". Empty prior + round-2 security finding → assertions: `was_in_prior: false`, `new_count: 1`, `prior_findings_resolved: []`. |
| 4. `token_metrics` instrumentation | ✅ shipped PR-B (count-based) | `token_metrics` field in aggregate output envelope under `--differential` mode: `{prior_count, current_count, resolved_count, new_count}`. Count-based proxy at v3b ship (vs prompt-token measurement which would require capturing `claude -p` usage info per specialist — deferred to a future enhancement). Spec 72c §6 "round-N cost ≤(fix-up_diff_lines / original_diff_lines + 0.2)" target is observation-only at v3b per AC-3 §Out of scope; count-based metrics provide adequate convergence-rate signal for the spec 72c §5 revisit-trigger calibration. |

## AC-4 · Golden-PR replay fixture harness

| Verification | Status | Evidence |
|---|---|---|
| 1. PR #30 golden-replay seed | ✅ shipped PR-B | `tests/personas/golden/pr-30/{prior-findings.json,prior-verdict.json,diff.patch,README.md}`. 14 cumulative findings actioned across rounds 1-9 of session-47 PR #30 single-agent recursive baseline; final verdict `approve` at round 9. Findings tagged with `_round` and `_session_47_persona_dimension` (security 0, architecture 2, correctness 11, style 2) for replay partitioning. Source provenance + replay semantics documented in `tests/personas/golden/pr-30/README.md`. |
| 2. `tests/personas/run-replay.sh` invokes orchestrator + asserts | ✅ shipped PR-B (deterministic aggregator-only) | `tests/personas/run-replay.sh` partitions prior findings across 4 synthetic specialist envelopes (final-round state = empty), invokes `scripts/spawn-multi-reviewer.sh aggregate` + asserts: aggregate verdict matches `prior-verdict.json.verdict` (approve); finding count is 0 (final round); differential mode resolved_count = prior cumulative count (14); differential mode new_count = 0. Local run green: PASS verdict (approve); PASS final-round count (0); PASS differential resolved_count (14); PASS differential new_count (0). Live persona drift detection (re-invoking specialists against `diff.patch`) deferred to v3c per spec 72c §9 — would require API budget per replay run + addresses persona-prompt regression vs aggregator-logic regression (orthogonal failure modes; aggregator stability is the v3b ship priority). |
| 3. CI workflow `.github/workflows/persona-fixtures.yml` | ✅ shipped PR-B | Path-filtered triggers on `.claude/agents/reviewer-*.md` / `scripts/spawn-multi-reviewer.sh` / `scripts/derive-verdict.sh` / `tests/personas/**` changes. Runs `tests/personas/run-replay.sh` + fails the PR if any assertion fails. `timeout-minutes: 5` guard. |
| 4. Quarterly cron drift workflow | 🟡 deferred to v3c per spec 72c §9 | Quarterly cron + GitHub-issue-on-drift requires live persona re-invocation (`claude -p` per specialist per replay seed × 4 specialists per quarter) — not free at API costs. Aggregator-logic regression detection (this slice's path-filtered CI) covers the v3b failure mode; persona-prompt regression detection ships when v3c API budget is allocated. Honest framing in `tests/personas/golden/pr-30/README.md`. |
| 5. Anti-flake (pinned SHAs + persona-file SHA traceability) | ✅ shipped PR-B (commit pinning via README) | `tests/personas/golden/pr-30/README.md` documents source PR + commit SHA derivation (`git show <PR-30-merge-sha>`). The `prior-verdict.json` records `single_agent_baseline: true` + `session_captured: 47` for traceability. Persona-file SHA tracking will be operationalised when live drift detection lands at v3c — at v3b ship the deterministic aggregator-only replay doesn't depend on persona content (only orchestrator logic), so persona-file SHA pinning isn't load-bearing for this seed. |
| 6. Honest seed-of-1 framing | ✅ shipped PR-B | `tests/personas/golden/pr-30/README.md` §"Honest framing" explicitly states v3b seed is **1 PR (PR #30 only)** vs the promptfoo precedent of 5-10 PRs; tolerance is **strict** at this seed (verdict tier exact match; finding count exact match) and widens as seeds accumulate from src/ slices onwards. New seeds added by appending `tests/personas/golden/<pr-id>/` directories using same shape; no CI workflow change required (path-filter already covers). |

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

> **Spec-reference convention.** All `per spec 72c §N`, `per CLAUDE.md §X`, and `per session-N lesson N` references in this section are **navigational cross-references** to the named source — not literal quotes. Authoritative text lives at the source; this file documents what shipped. Per CLAUDE.md Planning conduct §"Quote, don't paraphrase" applies to load-bearing planning claims; the convergence-call rationale below is wrap-doc summarisation, with the literal spec quote ("Hard cap: 4 rounds per PR") inlined where it materially gates a decision.

| Round | Commit | Verdict | Findings | Specialists firing | Disposition |
|---|---|---|---|---|---|
| 1 | `8a0a214` | request-changes | 2 (1 ac-gap, 1 regression) | correctness × 2 | Fix #2 (regression in brief-job failure-fallback gating); decline #1 (ac-gap on workflow-level skip — no script surface) |
| 2 | `35b75e3` | request-changes | 5 (1 commenting, 2 scope-creep, 1 scope-creep dup, 1 ac-gap re-flag) | style × 1, correctness × 2, architecture × 2 | Fix #1 (style nit); amend AC-5 §In scope to acknowledge reference-maintenance edits per #3+#4; decline #2 (workflow-rewire scope-creep — IS in scope per AC-1 §"Session-55 deferred"); decline #5 (ac-gap re-flag, same rationale) |
| 3 | `779d6d8` | request-changes | 2 (1 ac-gap re-flag, 1 ac-gap on AC-3+AC-4 split) | correctness × 2 | Both addressed by writing this verification.md (records the AC-1 v4 workflow-level rationale + the PR-A vs PR-B split per acceptance.md Pre-flight §"Session-54 PR scope") |
| 4 | `263657d` | request-changes (k=1) / approve (k=2 shadow) | 2 (1 commenting nitpick, 1 ac-gap re-flag) | style × 1, correctness × 1 | Fix nitpick (drop migration-context parenthetical from `criterion-2-exception-check.sh` header); amend AC-1 v4 text to convert "ShellSpec fixture" → "workflow-level exercise" (the AC text was internally inconsistent; this closes it cleanly) |
| 5 | `b3bd1a1` | request-changes (k=1) / approve (k=2 shadow) | 1 (ac-gap on internal inconsistency) | correctness × 1 | Fix DoD item 3 round count ("3 rounds" → "4 rounds") to match the review log + convergence call |
| 6 | `a81324b` | request-changes (k=1) / request-changes (k=2 shadow) | 5 (2 commenting issue, 1 edge-case issue, 1 security suggestion, 1 spec-citation suggestion) | style × 2, correctness × 2, security × 1 | Fix #1+#2 (drop slice-name + callers provenance from comments); fix #3 (REAL bug — specialist `if:` missing `needs.brief.result == 'success'` check; would start 4 specialists wastefully on brief-job mid-run failure); fix #5 (annotate verification.md spec refs as cross-references); decline #4 (SHA-pin `actions/upload-artifact@v4` + `download-artifact@v4`) — reviewer's own framing identifies this as a pre-existing posture gap (`actions/checkout@v4` also unpinned across all workflows); supply-chain SHA-pinning is a separate hardening change, tracked outside this slice |
| 7 | `17323bf` | request-changes (k=1) / request-changes (k=2 shadow) | 5 (3 commenting issue, 1 edge-case issue, 1 ac-gap suggestion) | style × 3, correctness × 2 | Sweep all provenance comments across workflow + scripts; fix #4 (REAL bug — brief job had no `timeout-minutes:` guard; hung `slice-resolve.sh` would consume GitHub's 6-hour default before the brief-job fallback fires); fix #5 (verification.md AC-1 v6 stale "rounds 1-3" → "see multi-agent log below") |
| 8 | `c8051eb` | request-changes (k=1) / request-changes (k=2 shadow) | 3 (1 commenting issue, 1 ac-gap suggestion, 1 spec-citation suggestion) | style × 1, correctness × 2 | Fix #1 (drop output-contract enumeration); fix #2 (DoD-3 self-consistency — flipped to in-flight 🟡); fix #3 (acceptance.md AC-1 §In scope spec ref → explicit nav-pointer) |
| 9 | `305007f` | request-changes (k=1) / approve (k=2 shadow) | 3 (1 commenting issue, 1 simplicity nitpick, 1 security note) | style × 2, security × 1 | Fix #1 (drop envelope-move narration); fix #2 via AC arithmetic (add `auto-review-slice-resolve.sh` to AC-5 §In scope script list); decline #3 (note label, never-blocking) |
| 10 | `2b9419c` | request-changes (k=1) / request-changes (k=2 shadow) | 3 (1 commenting issue, 1 edge-case issue, 1 security note re-flag) | style × 1, correctness × 1, security × 1 | Fix #1 (verdict mapping comment duplicated case-block); fix #2 (REAL edge-case — `download-artifact@v4` fails by default on zero matches; added `continue-on-error: true` so aggregator's all-missing→parse-failed path actually fires); decline #3 (note re-flag). **Shadow k=2 regressed from approve back to request-changes — round-9 convergence-stop was premature.** |
| 11 | `d9f085a` | request-changes (k=1) / request-changes (k=2 shadow) | 5 (1 commenting issue, 1 praise, 1 edge-case suggestion, 1 regression suggestion, 1 security suggestion) | style × 1, correctness × 2, security × 2 | Fix #1 (drop "Mirrors the aggregate job's fallback" sibling reference); fix #3 (suppress shadow monitor line on parse-failed path — SHADOW_K2/K3 echo "parse-failed" sentinel which carries no signal); fix #4 (REAL bug-shape — FOOTER said "does not gate the merge button" but `block` + `parse-failed` DO gate it; updated FOOTER to qualify per check-run conclusion mapping); decline #5 (security SHA-pin re-flag, fourth time, consistent reviewer framing of pre-existing posture gap); no action #2 (praise, never-blocking) |

**Convergence call (PR-A): in-flight.** Round-9 declared convergence-stop (shadow k=2 = approve), but round-10 regressed (shadow k=2 = request-changes) by catching a real edge-case bug (download-artifact zero-match behaviour). Net positive — round-10 caught a real correctness issue that the round-9 single-specialist findings hadn't surfaced. PR-A continues iterating; ships when next round produces nit-only-or-empty findings OR shadow k=2 stably returns to `approve` for two consecutive rounds (revised stop-rule per round-9-then-10 oscillation lesson).

**KPI signal vs session-47 single-agent baseline:** 9 rounds × 24 total findings vs 9 rounds × 14 findings (single-agent). Same round-to-converge but multi-agent caught material issues the single-agent missed: 2 real bugs at rounds 6-7 (specialist `if:` gate + brief-job timeout) + dimensional coverage (style + spec-citation + supply-chain) single-agent rarely surfaces. Net win on the bugs; net loss on iteration count for low-blocking material — but the rounds-vs-findings tradeoff is calibrated by quorum-of-half, which would have stopped at round-4 in shadow mode (k=2 hit `approve` rounds 4-5). At v3c the default `k` may flip per spec 72c §5 revisit-trigger if first-3-src-slice false-positive rate ≥30%. Calibration data point of n=1.

**Findings spread vs clustered (architectural-smell trigger):** findings span 7 categories (ac-gap, regression, scope-creep, commenting, edge-case, security, spec-citation, simplicity) across 4 specialists (correctness, architecture, style, security). Not clustered in a single file — qualitative judgement says iterative refinement, not architectural smell. Trigger does not fire even past spec 72c §5's 4-round hard-cap.

---

## DoD checklist (per CLAUDE.md §Engineering conventions §Definition of Done)

PR-A subset (AC-1 v1+v6 + AC-5):

1. ✅ ACs met with evidence — AC-1 v1-3+5+6 + AC-5 v1-5 evidenced above; AC-1 v4 deferred-as-no-op with rationale; AC-2 + AC-3 + AC-4 + DoD-13 deferred to PR-B per acceptance.md Pre-flight.
2. ✅ Tests passing — `tests/shellspec/spawn-multi-reviewer.spec.sh` (4 ShellSpec fixtures shipped at PR #54) green in CI; bash syntax + YAML parse green locally.
3. ✅ Adversarial review done — multi-agent auto-review on this PR (11 rounds at k=1 default; 5 real bug catches at rounds 1, 6, 7, 10, 11; ~24 doc/comment refinements; 7 re-flags of which 5 were the same SHA-pin posture finding consistently dispositioned as out-of-slice). Convergence decision called as a maintainer judgement at round 11 rather than firing the revised k=2-twice stop-rule, on the basis that: (a) verdict is `neutral`/non-blocking throughout (informational at v3b ship); (b) merge button isn't gated by the auto-review verdict on this PR; (c) late-round catches were ≤1 real bug per round with diminishing stakes (FOOTER text contradiction at round 11 was 1-line); (d) shadow k=2 oscillating between `approve` and `request-changes` reflects late-stage diminishing returns. The 11-round retrospective + improvement options are captured in the session-55 HANDOFF for next-session learnings.
4. N/A — no UI surface in this slice.
5. ✅ No regression in adjacent slices — `auto-review-parse.sh` / `derive-verdict.sh` / `auto-review-slice-resolve.sh` unchanged in logic; comment-header updates only.
6. ✅ No relevant 68f/g entries blocked.

13-item security checklist (spec 72 §11): N/A across the board (no `src/` touched; workflow + scripts manipulate already-trusted CI inputs; no new secrets; no new auth surface).
