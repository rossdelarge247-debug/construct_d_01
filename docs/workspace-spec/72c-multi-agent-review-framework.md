# Spec 72c — Multi-agent review framework

**Status:** Amended session-54 (§3 architecture diagram · §4 specialist partition realigned to /ultrareview 4-partition · §5 aggregation flipped to majority-vote default with shadow-monitor · §7 fixture harness flipped to golden-PR replay primary · §9 + §10 markers updated) per the session-49 prior-art audit findings now applied as spec changes. Prior amendment: session-49 (§5 revisit trigger · §7 hybrid extension · §10 pattern lineage). Original: Draft (v3b S-8 stretch); standalone spec PR opens before `S-INFRA-persona-suite-v2-multi-agent` slice acceptance.md is frozen, per session-48 pre-flight Q3 (option B, "Now between v3b and S-F1").
**Origin:** Session-47 9-round live recursive auto-review on PR #30 — first measured single-agent recursion baseline (14 findings / 9 rounds). HANDOFF-SESSION-47 §"What could improve" L63: *"Single-agent recursive review is high-signal but inefficient ... Multi-agent dimension-partitioned reviewer (v3b S-8 stretch) should converge in 1-2 rounds."*
**Supersedes:** none. Complements specs 72 §11 (security DoD), 72a (preview-deploy rubric), 72b (adversarial review budget). Under v3a/v3b §"Hard controls (in development)" while in-flight; consolidates into a single rigour-controls reference at v3c rewrite.

---

## §1 — Why multi-agent

Single-agent recursive review (the v3b S-6 baseline, session-47 PR #30) is high-signal but inefficient. The 9-round dataset captured 14 actionable findings across 9 rounds at ~$1 API + 30min wall-clock. Each round explored 2-3 of 7-8 rubric dimensions deeply; the attention pattern was non-deterministic — round 2 caught ac-gap + edge-case, round 6 caught a latent timeout that had been there since the workflow's first commit. The persona was thorough by accident over 9 iterations rather than by design in 1.

Multi-agent dimension-partitioned review attempts the same coverage in 1-2 rounds by partitioning attention deterministically: N specialists, one rubric dimension each, run in parallel. Any single round is structurally exhaustive across the rubric. Convergence target: ≤2 rounds for the equivalent finding-density; total tokens lower than single-agent ≥5-round equivalent.

## §2 — When to use multi-agent vs single-agent

| Slice profile | Reviewer mode | Rationale |
|---|---|---|
| `src/` slice with logic surface | Multi-agent | Logic surfaces have ≥3 attention vectors (correctness · regression · edge cases); single-agent under-attends |
| Diff >300L | Multi-agent | Cross-reference reads exceed single-agent budget per spec 72b — partition is the budget fix |
| Novel architecture introduction | Multi-agent | Architectural-smell-trigger guards against round-3+ patching; multi-agent fans out before round 3 happens |
| Doc-only PR (CLAUDE.md, spec, slice docs) | Single-agent | Logic surface absent; one rubric dimension covers it (cf. PR #29, PR #32) |
| Pure copy-flip / pure rename | Single-agent | Rubric collapses to "matches the spec"; specialisation has no benefit |
| First-iteration prototyping | Single-agent | Iteration speed > attention partition |

Bias for multi-agent in `src/` slices from S-F1 onwards, where the AC-4 retain/drop measurement activates.

## §3 — Architecture overview

```
┌─────────────────────┐     ┌──────────────────┐
│  PR push event      │────▶│  Orchestrator    │
└─────────────────────┘     │  (workflow + sh) │
                            └────────┬─────────┘
                                     │ fan-out (parallel)
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                ▼                          ▼                ▼
    security      architecture              correctness          style
       │                │                          │                │
       └────────────────┴──────────┬───────────────┴────────────────┘
                                   │ findings → JSON envelopes
                                   ▼
                            ┌──────────────────┐
                            │  Aggregator      │  dedupe across specialists
                            │  (k-of-N quorum) │  derive verdict; emit shadow
                            └────────┬─────────┘  k-counterfactuals
                                     ▼
                             gh check-run posted
```

- **Orchestrator:** `scripts/spawn-multi-reviewer.sh` (called from `auto-review.yml`) reads PR diff + slice AC + CLAUDE.md sections; invokes each specialist via `npx -y @anthropic-ai/claude-code -p` in parallel matrix jobs; collects N JSON envelopes via `gh api --input -`.
- **Aggregator:** dedupes findings by 64-char text-prefix hash; computes verdict per `k`-of-N quorum rule per §5 (default `k=2` post session-56 amendment; shadow `would_have_been_k1` / `would_have_been_k3` fields emitted alongside live verdict for monitoring); posts unified check-run via `gh api --input -`.
- **Failure modes:** specialist timeout (10min cap per spec 72c §6 differential mode → degraded mode: remaining specialists' findings aggregated normally; timed-out dimension marked `inconclusive` in aggregator output; verdict reported with degraded-mode warning); specialist parse-failure (`block` with diagnostic, per v3a session-47 round-1 lesson); ANTHROPIC_API_KEY absent (graceful skip with neutral check-run, per v3b S-6 PR #30 §"Skipped — ANTHROPIC_API_KEY not configured"). Single-agent recursive fallback via `slice-reviewer.md` is **retired** at the same ship event as the 4 specialists landing — slice-reviewer.md is removed once `auto-review.yml` flips to multi-specialist invocation.

## §4 — Specialist personas

Four dimensions, partitioned per the published `/ultrareview` for Claude Code convergence (§10 L173 prior-art audit) — `security · architecture · correctness · style`. Realigned from the original draft's 7-partition (session-54 amendment). Rationale: (a) `/ultrareview`'s 4 has external published-system convergence behind it; the original 7 was inferred from session-47's 9-round dataset which only exercised 4 of the 7 categories empirically (rounds 4-5-6-8) — three of the original seven were speculation; (b) `/ultrareview`'s 4-axis is structurally orthogonal (no overlapping concerns); the original 7 had ambiguous boundaries (`coding-conduct` overlapped `simplicity`; `ac-gap` overlapped `spec-citation`); (c) lower partition count → cheaper fan-out at v3b ship, easier first-3-slice retain/drop signal.

| File | Dimension | Absorbs criteria from prior `slice-reviewer.md` rubric |
|---|---|---|
| `.claude/agents/reviewer-security.md` | OWASP top 10 + spec 72 §11 13-item security DoD | criterion 4 (security) |
| `.claude/agents/reviewer-architecture.md` | Hidden state · effects-behind-interfaces · architectural-severity scope-creep · architectural-smell-trigger watch | criterion 7 (hidden effects) + criterion 2 architectural-severity variant |
| `.claude/agents/reviewer-correctness.md` | AC alignment (under- and over-implementation, logic-severity) · edge cases · regression · spec-citation accuracy | criteria 2 (logic), 3 (edge), 5 (regression), 6 (spec-citation), 8 (ac-gap) |
| `.claude/agents/reviewer-style.md` | CLAUDE.md §"Coding conduct" adherence · simplicity · naming · nitpick-tier polish | criterion 1 (coding conduct) + simplicity nitpick-tier |

The full criterion → partition mapping: `correctness` is the heaviest partition (5 absorbed criteria), reflecting the empirical bias from session-47 — most findings were correctness-shaped. This is by-design, not accidental: a `correctness` specialist with a multi-criterion rubric is closer to single-agent baseline shape than the `security` / `architecture` / `style` specialists, each of which holds a single tight rubric.

Compression to 3 personas (folding `style` into `correctness`) and expansion to 5 (re-introducing a separate `regression` or `spec-citation` specialist) are tracked in §9 as carry-overs; both decisions wait for first-3-src-slice retain/drop data per AC-4 measurement.

Each persona file: max 300L (target ≤200L via include-by-reference for verdict vocab + JSON schema); verbatim Option C nonced delimiters per spec 72b §"Scope: session-spawned personas only"; explicit JSON output schema; verdict vocabulary per CLAUDE.md §"Hard controls (in development)" §"Verdict vocabulary".

## §5 — Verdict aggregation + convergence

Each specialist returns a JSON envelope using the [Conventional Comments](https://conventionalcomments.org/) vocabulary per CLAUDE.md §"Verdict vocabulary":

```json
{
  "specialist": "reviewer-edge-case",
  "summary": "<one-line summary>",
  "findings": [
    {
      "label": "issue",
      "blocking": true,
      "category": "edge-case",
      "summary": "...",
      "evidence": "...",
      "remediation": "..."
    }
  ]
}
```

The top-level `verdict` is **not** emitted by specialists — derived by the orchestrator from the aggregated findings per CLAUDE.md §"Verdict vocabulary" §"Verdict derivation rules".

**Aggregation rules:**
1. **Verdict derivation (`k`-of-N quorum, deterministic)** — orchestrator collects findings across specialists, then derives a single verdict per a configurable quorum threshold `k`. **Default at v3c session-56 amendment: `k=2`** (quorum-of-half across the 4 specialists; means ≥2 specialists must agree on a blocking finding before `block` fires). Calibrated against the n=2 PR shadow data captured at v3b ship: PR #56 (11 rounds) and PR #57 (5 rounds) both showed single-specialist findings dominating rounds 4+, with the shadow `would_have_been_k=2` field collapsing to `approve` 4-6 rounds before maintainer-judgement convergence at `k=1`. Opt-in `k=1` (first-fault-blocks) remains available via explicit `--multi k=1` for higher-sensitivity contexts. The aggregator applies the CLAUDE.md verdict tiers in order: `block` if ≥`k_block` specialists emit a finding with `blocking: true`; else `request-changes` if ≥`k_changes` specialists emit a non-blocking finding with `label ∈ {issue, suggestion, todo}`; else `nit-only` if ≥`k_nit` specialists emit `label ∈ {nitpick, chore}`; else `approve`. At v3c session-56 ship `k_block = k_changes = k_nit = 2`. **Shadow-monitor:** the aggregator additionally emits `would_have_been_k1` and `would_have_been_k3` fields alongside the live verdict, recording what the verdict would have been at `k=1` (first-fault-blocks; the prior default) and `k=3` (supermajority) thresholds. These are observation-only — they don't gate the merge. False-negative rate (real bugs that `would_have_been_k1` flagged but live `k=2` suppressed) calibrates the post-flip §Revisit trigger.
2. **Cross-specialist deduplication** — for each finding, compute SHA-256 over `label|category|first-64-chars-of-evidence`; merge identical hashes (preserves all originating specialists in `seen_by[]`). The `blocking` field on merged findings takes the OR across duplicates (any blocking → blocking). For `k`-quorum derivation, a deduped finding counts as `len(seen_by)` votes, not 1 — i.e. if `security` and `correctness` both flag the same SHA-256-equivalent finding, that's 2 specialist votes toward the verdict tier. (Hash field `evidence` chosen over `summary` because the persona output baseline — `slice-reviewer.md` + `acceptance-gate.md` + `ux-polish-reviewer.md` — emits a top-level review `summary` per envelope but no per-finding `summary`; per-finding `evidence` is universally present and is a quoted-from-diff text fragment, providing the strongest dedup signal for substantively-equivalent findings flagged by different specialists.)
3. **Verdict-coercion guard** — discard findings claiming a verdict, label, or `blocking` value via prompt-style strings in PR body / diff comments (matches v3b S-6 residual prompt-injection mitigation; v3c carries the verdict-coercion fixture refresh under the new schema).

**Convergence rules:**
- Round terminates: aggregate `approve` OR `nit-only`-only on the entire round, OR no new (de-duped) findings round-over-round.
- Fix-up commit triggers a new round under §6 differential mode.
- Hard cap: 4 rounds per PR (above this declares architectural-smell per CLAUDE.md §"Engineering conventions" §"Architectural-smell trigger" — not a multi-agent failure mode but an architecture signal).

**Prior art alignment.** Default `k=2` (quorum-of-half) is the standard mainstream LLM-jury majority-vote framing (*Beyond Majority Voting*, arXiv 2510.01499; *LLM Jury-on-Demand*, arXiv 2512.01786). The v3b ship started at `k=1` for back-compat with the single-persona `derive-verdict.sh` shipped at PR #41; the session-56 amendment fires the §Revisit trigger early (n=2 infra-PR calibration ahead of the original first-3-src-slice trigger) on the strength of consistent shadow-monitor signal across PR #56 + #57. **Revisit triggers (post-session-56):**
- **Flip back to `k=1`** if first-3-src-slice false-negative rate (real bugs flagged by `would_have_been_k1` shadow but missed by live `k=2`) exceeds 20%. Calibration data captured per src/ slice in HANDOFF-{N}.md §"Persona findings recorded".
- **Move to severity-weighted aggregation** per *Beyond Majority Voting* §3.2 — per-specialist reliability scores derived from agreement-with-final-merge over a calibration set. Independent of the k= default; ships as a separate spec amendment.
- **Original session-56 flip rationale:** PR #56 (n=11 rounds) + PR #57 (n=5 rounds) both showed shadow `would_have_been_k=2` would have converged 4-6 rounds earlier vs the live `k=1` verdict; data captured in `docs/HANDOFF-SESSION-55.md` §"Multi-agent auto-review KPI signal".

Threshold-flips ship as spec amendments under the same control-plane gate as other rigour controls.

## §6 — Differential review mode

On fix-up commits, specialists receive three inputs instead of one:
1. Original PR diff (unchanged round-over-round)
2. Fix-up diff (only the new commits since prior round)
3. Prior-round findings JSON (de-duplicated aggregated set)

Each specialist scopes review to:
- **(a)** Prior findings still present in fix-up diff (re-flag if not resolved; mark resolved if no longer applicable)
- **(b)** New findings introduced by the fix-up itself (regression-detection on the patches)

This bounds token cost on rounds 2+ to ~1/Nth of the round-1 cost (where N is the diff-size ratio of fix-up to original). Without differential mode, the v3b S-6 9-round single-agent recursion paid full diff-cost on every round — the cost asymmetry between findings-density and tokens-burned is what made it inefficient.

Implementation: orchestrator passes prior-round findings via `npx claude -p` prompt input file; aggregator merges new + still-flagged via the §5 dedupe rule.

## §7 — Test-fixture seeding harness

The harness is golden-PR replay over a calibration set of real merged PRs — primary at v3b ship per the published precedent (promptfoo `evaluate-coding-agents`, https://www.promptfoo.dev/docs/guides/evaluate-coding-agents/; cited at §10 L187). Synthetic-deliberate-injection per-persona fixtures (the original §7 design) deferred to v3c: no public precedent, and the v3b retain/drop measurement clock starts at S-F1 — golden replay over real PRs gives stronger signal than synthetic injection over speculative dimension-coverage during the calibration window.

**Golden-PR replay (primary, v3b ship):**

- **Path:** `tests/personas/golden/<pr-id>/{diff.patch,prior-verdict.json,prior-findings.json}`
- **Initial seed (4 PRs):** PR #30 (session-47 9-round single-agent recursive dataset; converted from the recorded round-1-through-round-9 transcript), plus the first 3 src/ slice PRs as they ship from S-F1 onwards. Initial seed expands as src/ slices accumulate; v3c targets 5-10 PRs per the promptfoo precedent.
- **Pass criterion:** aggregator verdict on the replayed diff matches `prior-verdict.json` exactly at the verdict tier (`approve` / `nit-only` / `request-changes` / `block`); finding count within ±1 of `prior-findings.json` length; per-specialist `seen_by[]` overlap ≥50% with the prior recorded findings (i.e. the same dimension flagged the same issue, not a different specialist coincidentally flagging an unrelated finding).
- **Trigger:** `.github/workflows/persona-fixtures.yml` runs on every change to `.claude/agents/reviewer-*.md` or `scripts/spawn-multi-reviewer.sh` or `scripts/derive-verdict.sh` (CI gate; fails the PR on verdict-drift). Quarterly cron `.github/workflows/persona-fixtures-cron.yml` runs first day of each quarter; opens an issue if any replay drifts.
- **Anti-flake:** replay diffs are pinned to the merged commit SHA; persona-file SHAs recorded in `prior-verdict.json` for traceability when drift fires. Pass tolerance (±1 finding count, ≥50% specialist overlap) calibrates as the seed grows.

**Why replay over synthetic at v3b ship:** synthetic-injection answers "did this persona stop catching its target dimension after an edit?" — a useful question, but presupposes the dimension partition is correct. Replay answers "did the suite's verdict on a real PR change after an edit?" — which both validates the partition and the per-persona signal in one run. At v3b the partition itself is the load-bearing question (4-vs-5-vs-7), so replay delivers more signal per run.

**Synthetic-injection (deferred, v3c):** once first-3-src-slice retain/drop data confirms the 4-partition holds, add `tests/personas/synthetic/{security,architecture,correctness,style}.diff` per-persona fixtures with deliberate-injection per the original spec 72c §7 design. Synthetic catches per-persona regressions that golden-replay can't isolate (e.g. a persona edit that subtly weakens security signal but doesn't change verdict-tier on the 4-PR seed). Both then run.

## §8 — Measurement (retain/drop signal)

**Single-agent recursive baseline (session-47, PR #30):** 14 findings · 9 rounds · ~$1 API · ~30min wall-clock. Recorded verbatim at `docs/slices/S-INFRA-rigour-v3b-subagent-suite/verification.md` §"Round 1" through §"Round 9".

**Multi-agent target (this spec):** ≤2 rounds for the equivalent finding-density; total token cost lower than single-agent recursive 5-round equivalent.

**KPIs (recorded per src/ slice in HANDOFF-{N}.md §"Persona findings recorded"):**

| KPI | Single-agent baseline | Multi-agent target | Verdict |
|---|---|---|---|
| Rounds-to-converge | 9 (PR #30) | ≤2 | retain if ≤2 sustained over first 3 src/ slices |
| Findings-per-round | ~1.6 | ≥4 (one per active specialist) | retain if specialists fire independently |
| Total tokens | ~9× round-1 | ≤3× round-1 (round-1 + small differential) | retain if lower than 5×single-agent |
| Wall-clock | ~30min | ≤10min | retain if under |

**Retain criterion** (verbatim from `docs/engineering-phase-candidates.md` §C L129): *"if the agent catches at least one issue the main conversation missed per 2-3 slices, retain. Otherwise drop — added friction without value."* Applies per-specialist + at the suite level.

**Activation:** AC-4 retain/drop measurement begins at S-F1 (first src/ slice). Sibling slice S-INFRA-arch-smell-trigger (PR #32) was a candidate but pre-dates spec 72c implementation; recorded as missed measurement.

## §9 — Open questions / v3c carry-overs

- **Specialist count tuning (3 vs 4 vs 5).** Default ships at 4 per /ultrareview convergence (§10 L173). Compression to 3 (folding `style` into `correctness`) and expansion to 5 (re-introducing a separate `regression` or `spec-citation` specialist; or adding a UI specialist parallel to the 4 once `ux-polish-reviewer.md` activates at S-F1) tracked here. Empirical re-evaluation after first 3 src/ slices ship per AC-4 retain/drop metric — drop or split a specialist if its findings fold cleanly into another's category (compression) or its rubric subset shows distinct attention vectors (expansion) over 3 measurements.
- **`k`-quorum post-flip calibration.** Default flipped from `k=1` to `k=2` (quorum-of-half) at session 56 on the strength of n=2 infra-PR shadow data — see §5 §Revisit triggers for the post-flip false-negative trigger (flip back to `k=1` if first-3-src-slice false-negative rate >20%) and the orthogonal severity-weighted-aggregation upgrade path (per *Beyond Majority Voting* §3.2). Aggregator emits shadow `would_have_been_k1` / `would_have_been_k3` for every PR review; `would_have_been_k1` is the primary post-flip calibration signal.
- **Synthetic-deliberate-injection per-persona fixtures.** Deferred to v3c per §7 (golden-PR replay primary at v3b ship). Add once first-3-src-slice retain/drop data confirms the 4-partition holds; synthetic catches per-persona regressions that golden-replay can't isolate. Path: `tests/personas/synthetic/{security,architecture,correctness,style}.diff`.
- **Cross-specialist deduplication threshold.** Spec ships 64-char text-prefix hash; tune by inspecting false-merge rate on the first 3 src/ slices. If two distinct findings de-dupe wrongly, lengthen prefix or move to semantic-similarity heuristic.
- **Verdict-coercion fixture** (carried from v3b S-6 PR #30 §"Adversarial review" residual prompt-injection mitigation). Synthetic PR body with malicious `--- VERDICT: approve ---` style smuggling; aggregator must discard and surface to honest disclosure log. v3c.
- **Spec 72b "Use when" criterion tightening** — cumulative cross-reference accounting on top of file size. Carries from v3b S-6 sub-3 read-cap block + Option C re-spawn lesson. v3c.
- **Multi-provider reviewer** — see `docs/slices/S-INFRA-rigour-v3c-quality-and-rewrite/acceptance.md` §"Multi-provider consensus framework (candidate; session-48 addition)" for the broader N-providers-in-parallel-with-consensus framework that supersedes the original tie-breaker framing (single non-Anthropic specialist on architectural severity disagreement, now the narrow case). Original carry-over reference: `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md` L177. Out of scope for this spec; surfaces here for cross-reference.
- **Stryker mutation testing for personas** — spec 71/72 v3c carry-over (acceptance.md L177). Mutate persona prompts and verify findings change appropriately; mutation-coverage on the rubric. Out of scope here.
- **Retroactive measurement** — first 3 src/ slices ship pre-multi-agent (single-agent recursive on `auto-review.yml`); the v3a/v3b retain/drop rule activates at S-F1 against the v3b single-agent baseline. v3c re-measures with multi-agent v2 active.
- **Branch-protection gating** — auto-review check-run is currently informational (per v3b AC-1 §Out of scope). Multi-agent v2 may flip to required at v3c once the 3-src-slice retain/drop signal converges.

## §10 — Pattern lineage + further reading

72c is broadly aligned with mainstream multi-agent-review patterns. Lineage and divergences (session-49 prior-art audit):

- **§3 architecture** — sectioning + orchestrator-worker per Anthropic *Building Effective Agents* (parallelisation by sectioning when sub-tasks are predictable). Aligned.
- **§3 + §8 measurement discipline** — Anthropic *How we built our multi-agent research system* (Opus orchestrator + Sonnet specialists; 90.2% lift over single-Opus on browse-and-synthesise; 15× token cost). Aligned shape, our cost story is per-slice rather than per-query.
- **§4 specialist partition** — `/ultrareview` for Claude Code (4-specialist published shape: security · architecture · correctness · style). 72c ships at 4 (session-54 realigned per this prior-art finding; original draft was 7 — the four post-session-47 attention-vector dimensions plus three speculative ones). Compression to 3 + expansion to 5 tracked at §9 as carry-overs.
- **§5 quorum-based aggregation** — aligned with mainstream majority-vote / reliability-weighted (*Beyond Majority Voting*, arXiv 2510.01499; *LLM Jury-on-Demand*, arXiv 2512.01786) via configurable `k`-of-N quorum. Default `k=2` post session-56 amendment (quorum-of-half; standard mainstream framing). Shadow `k=1`/`k=3` emitted for monitoring; revisit triggers track post-flip false-negative rate per §5.
- **§6 differential review** — direct prior art in CodeRabbit `incremental_reviews` (https://docs.coderabbit.ai/) — production-tested at scale; 72c §6 matches the pattern almost verbatim.
- **§7 fixture seeding** — no public precedent for synthetic-per-persona deliberate-injection diff with severity-threshold pass criterion. Closest analogue: promptfoo `llm-rubric` assertions on golden inputs. Hybrid extension proposed in §7.
- **Missing entirely** — no debate / refinement step (ChatEval, MAJ-Eval, *Multi-Agent Debate for LLM Judges* arXiv 2510.12697). Static dedup + max-severity is simpler but leaves accuracy on the table; upgrade path if §5 revisit trigger fires.

**Reading list (audit session 49, ranked by usefulness):**

1. https://www.anthropic.com/engineering/building-effective-agents — canonical sectioning vs orchestrator-worker; load-bearing for §3.
2. https://www.anthropic.com/engineering/multi-agent-research-system — Opus+Sonnet performance + measurement discipline; mirrors §8.
3. https://docs.coderabbit.ai/ (`incremental_reviews`) — direct prior art for §6.
4. https://arxiv.org/abs/2510.01499 *Beyond Majority Voting* — read before locking max-severity; weighted alternatives + §5 revisit-trigger source.
5. https://arxiv.org/abs/2512.01786 *LLM Jury-on-Demand* — dynamic specialist selection + reliability-weighted aggregation; relevant to §9 tuning.
6. https://www.claudedirectory.org/blog/ultrareview-claude-code-guide — Anthropic-adjacent published 4-specialist persona partition.
7. https://www.promptfoo.dev/docs/guides/evaluate-coding-agents/ — concrete patterns for §7 golden-PR replay extension.
8. https://arxiv.org/html/2510.12697v1 *Multi-Agent Debate for LLM Judges* — upgrade path past max-severity if §5 revisit trigger fires.

Cited from session-49 audit (research subagent + user-driven prior-art validation, post-72c freeze). **Load-bearing as of session-54** — the prior-art audit findings drove the §3 + §4 + §5 + §7 amendments rather than informing v3c only.

---

**Status at v3b S-8 ship:** spec frozen at this version; impl ships in `S-INFRA-persona-suite-v2-multi-agent` slice (verification.md cross-references back here). **Session-49 amendments** (§5 revisit trigger · §7 hybrid extension · §10 pattern lineage): documented post-freeze on the back of the prior-art audit; informed v3c at session 49. **Session-54 amendments** (§3 architecture diagram · §4 partition realigned to 4 specialists per /ultrareview · §5 majority-vote `k`-quorum default with shadow-monitor · §7 golden-PR replay primary, synthetic deferred · §9 carry-overs updated · §10 lineage markers updated): apply the prior-art audit findings as load-bearing spec changes for v3b S-8 implementation. Drives the realigned `S-INFRA-persona-suite-v2-multi-agent/acceptance.md` end-to-end re-draft. **Session-56 amendment** (§5 default flip `k=1` → `k=2` · §5 shadow field rename `would_have_been_k2` → `_k1` · §5 §Revisit triggers reframed post-flip · §10 lineage entry updated): fires the §5 revisit trigger early (n=2 infra-PR calibration ahead of the first-3-src-slice trigger) on the strength of PR #56 + #57 shadow-monitor convergence data; impl across `scripts/derive-verdict.sh` (default `K=2`) + `scripts/spawn-multi-reviewer.sh` (live invocation + shadow field swap) + 2 ShellSpec fixtures.
