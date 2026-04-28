# Spec 72c — Multi-agent review framework

**Status:** Amended session-49 (§5 revisit trigger, §7 hybrid extension, §10 pattern lineage) post prior-art audit. Original: Draft (v3b S-8 stretch); standalone spec PR opens before `S-INFRA-persona-suite-v2-multi-agent` slice acceptance.md is frozen, per session-48 pre-flight Q3 (option B, "Now between v3b and S-F1").
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
       ▼                ▼            ▼            ▼            ▼
   coding-conduct   ac-gap   edge-case   security    regression   …
       │                │            │            │            │
       └────────────────┴────┬───────┴────────────┴────────────┘
                             │ findings + verdicts → JSON envelopes
                             ▼
                      ┌──────────────────┐
                      │  Aggregator      │  dedupe across specialists
                      │  (max-severity)  │  unify verdict
                      └────────┬─────────┘
                               ▼
                       gh check-run posted
```

- **Orchestrator:** `scripts/spawn-multi-reviewer.sh` (called from `auto-review.yml`) reads PR diff + slice AC + CLAUDE.md sections; invokes each specialist via `npx -y @anthropic-ai/claude-code -p` in parallel matrix jobs; collects N JSON envelopes via `gh api --input -`.
- **Aggregator:** dedupes findings by 64-char text-prefix hash; computes verdict per max-severity rule (`block` > `request-changes` > `nit-only` > `approve`); posts unified check-run via `gh api --input -`.
- **Failure modes:** specialist timeout (10min cap per spec 72c §6 differential mode → fallback to single-agent recursive); specialist parse-failure (`block` with diagnostic, per v3a session-47 round-1 lesson); ANTHROPIC_API_KEY absent (graceful skip with neutral check-run, per v3b S-6 PR #30 §"Skipped — ANTHROPIC_API_KEY not configured").

## §4 — Specialist personas

Seven dimensions, partitioned from the v3b S-6 `slice-reviewer.md` 8-criterion rubric (criterion 7 "hidden effects" folds into edge-case + security):

| File | Dimension | Source rubric |
|---|---|---|
| `.claude/agents/reviewer-coding-conduct.md` | CLAUDE.md §"Coding conduct" adherence | Surgical changes · simplicity-first · no-unrequested-features · names-carry-the-design |
| `.claude/agents/reviewer-ac-gap.md` | AC under-implementation | each AC's verification points present + matched in evidence |
| `.claude/agents/reviewer-edge-case.md` | Edge cases + failure modes | empty inputs · race conditions · resource exhaustion · prefers-reduced-motion |
| `.claude/agents/reviewer-security.md` | OWASP top 10 + spec 72 §11 13-item | injection · auth · secrets · validation boundaries · safeguarding |
| `.claude/agents/reviewer-regression.md` | Adjacent-slice + adjacent-test regression | imports · types · test cross-references · API shape changes |
| `.claude/agents/reviewer-spec-citation.md` | Spec quoted vs paraphrased; verification points well-formed | per-spec source verbatim · verification.md citation accuracy |
| `.claude/agents/reviewer-simplicity.md` | Scope-creep + over-implementation | unrequested features · speculative abstraction · architectural-smell-trigger §3-round watch |

Compression alternative (5 personas) was considered: merge spec-citation into ac-gap, simplicity into coding-conduct. Session-47 dataset showed the four target signals are distinct attention vectors — rounds 4-5-6-8 each landed in a different one of the seven categories. **Default ships at 7; tuning to 5 deferred to v3c per §9.**

Each persona file: max 300L; verbatim Option C nonced delimiters per spec 72b §"Scope: session-spawned personas only"; explicit JSON output schema; verdict vocabulary per CLAUDE.md §"Hard controls (in development)" §"Verdict vocabulary".

## §5 — Verdict aggregation + convergence

Each specialist returns a JSON envelope:

```json
{
  "specialist": "reviewer-edge-case",
  "verdict": "request-changes",
  "severity": "logic",
  "findings": [
    {"category": "edge-case", "severity": "logic", "summary": "...", "evidence": "..."}
  ]
}
```

**Aggregation rules:**
1. **Max-severity verdict** — collect verdicts; promote to highest seen (`block` > `request-changes` > `nit-only` > `approve`). Severity field tracks `architectural` > `logic` > `style` > `none`.
2. **Cross-specialist deduplication** — for each finding, compute SHA-256 over `category|severity|first-64-chars-of-summary`; merge identical hashes (preserves all originating specialists in `seen_by[]`).
3. **Verdict-coercion guard** — discard findings claiming any verdict via prompt-style strings in PR body / diff comments (matches v3b S-6 residual prompt-injection mitigation; v3c carries the verdict-coercion fixture).

**Convergence rules:**
- Round terminates: aggregate `approve` OR `nit-only`-only on the entire round, OR no new (de-duped) findings round-over-round.
- Fix-up commit triggers a new round under §6 differential mode.
- Hard cap: 4 rounds per PR (above this declares architectural-smell per CLAUDE.md §"Engineering conventions" §"Architectural-smell trigger" — not a multi-agent failure mode but an architecture signal).

**Prior art and revisit trigger.** Max-severity diverges from the mainstream LLM-jury default of majority-vote / reliability-weighted aggregation (*Beyond Majority Voting*, arXiv 2510.01499; *LLM Jury-on-Demand*, arXiv 2512.01786). It is defensible for safety-critical gates (zero false negatives, brittle to a single noisy specialist). **Revisit trigger:** if first-3-slice specialist false-positive rate (`block`/`request-changes` on findings the author successfully argues away pre-merge) exceeds 30%, move to severity-weighted aggregation per *Beyond Majority Voting* §3.2 — per-specialist reliability scores derived from agreement-with-final-merge over a calibration set. Algorithm-change ships under `control-change` label. Measurement: false-positive rate captured per src/ slice in HANDOFF-{N}.md §"Persona findings recorded".

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

Each specialist persona is verified against a deliberately-injected synthetic-diff fixture:

- **Path:** `tests/personas/fixtures/{coding-conduct,ac-gap,edge-case,security,regression,spec-citation,simplicity}.diff`
- **Content:** synthetic diff with one finding deliberately inserted in the target dimension (e.g. coding-conduct fixture has an unrequested abstraction; security fixture has an unsanitised input boundary).
- **Pass criterion:** specialist returns ≥1 finding mentioning the target rubric item, severity ≥ `logic`.
- **Trigger:** quarterly cron (`tests/personas/run-fixtures.sh`) + on every `.claude/agents/reviewer-*.md` file change (CI gate).
- **Anti-flake:** synthetic diffs are deterministic content (no time-stamps, random IDs); each fixture pinned to a specific persona-file SHA to detect drift.

This is the multi-agent equivalent of v3b AC-13 spec-validation-by-deliberate-impl-break (per spec 72b): if a specialist stops catching its target dimension after a persona edit, the harness fails CI before the bad persona reaches a real PR.

**Hybrid extension (v3c).** Synthetic per-persona fixtures ship now (deterministic, fast, regression-canary speed). Public precedent for synthetic-deliberate-injection is thin; the published norm is golden-PR replay (promptfoo `evaluate-coding-agents`, https://www.promptfoo.dev/docs/guides/evaluate-coding-agents/). v3c adds a golden-PR replay calibration set: 5-10 real merged PRs (initial seed: PR #30 9-round dataset + first 3 src/ slice PRs) with their actual aggregator verdict; persona-file edits trigger replay; verdict-drift on the calibration set fails CI. Synthetic catches "did this persona stop firing on its rubric"; golden catches "is the persona's signal-to-noise drifting versus production." Both run; neither alone covers both questions.

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

- **Specialist count tuning (5 vs 7).** Default ships at 7. Empirical re-evaluation after first 3 src/ slices ship per AC-4 retain/drop metric — drop a specialist if its findings fold cleanly into another's category over 3 measurements.
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
- **§4 specialist partition** — `/ultrareview` for Claude Code (4-specialist published shape: security · architecture · correctness · style). 72c ships at 7; published systems converge on 4-5; tuning to 5 deferred per §9.
- **§5 max-severity** — divergent from mainstream majority-vote / reliability-weighted (*Beyond Majority Voting*, arXiv 2510.01499; *LLM Jury-on-Demand*, arXiv 2512.01786). Revisit trigger documented in §5.
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

Cited from session-49 audit (research subagent + user-driven prior-art validation, post-72c freeze). Not load-bearing for v3b S-8 implementation; informs v3c amendments per §9 carry-overs.

---

**Status at v3b S-8 ship:** spec frozen at this version; impl ships in `S-INFRA-persona-suite-v2-multi-agent` slice (verification.md cross-references back here). **Session-49 amendments** (§5 revisit trigger · §7 hybrid extension · §10 pattern lineage): documented post-freeze on the back of the prior-art audit; not load-bearing for v3b S-8 implementation, informs v3c per §9.
