# Session 73 Wrap Context Block (heading into session 74)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end. Three pillars: shared, not adversarial · evidenced, not asserted · end-to-end, not hand-off. **Tagline:** "Decouple — the complete picture." Spec 42 is authoritative.

## Stack

Next.js 16 + React 19 + Tailwind 4. Vercel preview deploys per branch; production at `construct-dev.vercel.app`. Anthropic SDK + Tink (bank data). Supabase for auth + storage (post-Phase-C). TypeScript strict.

## What sessions 41-73 accomplished (rolling window)

> **Session 73 (this wrap):** **1 substantive PR merged from `claude/decouple-session-73-xgvsb`.** **PR #121** (P0 ship C, squash `b0d2966`) — closes the B+C+D pre-impl rigour programme. Six touch points (~280L authored): NEW `.claude/agents/plan-architect.md` 102L (5-question rubric per spec 72d §5 verbatim: seams · hidden effects · coupling · test-pain forecast · hexagonal-invariant respect; Conventional Comments output; default-blocking categories `seam-boundary` + `hidden-effects` + `hexagonal-invariant`); migrated `.claude/subagent-prompts/exit-plan-review.md` from `verdict + severity` to Conventional Comments (5 categories: `planning-conduct`, `coding-conduct`, `slice-sizing`, `spec-citation`, `git-state`); extended `.claude/hooks/exit-plan-review.sh` for dual-template loading + `frame_prompt()` helper + spawn-or-stub block per persona + `jq -s` union aggregator + `BLOCKING_COUNT` gate + `EXIT_PLAN_REVIEW_DEBUG_VERDICT_*` env-var injection paths; spec 72d §5 atomic-migration amendment (collapsed L177 carve-out into single-format ship) + §Shipped marker; NEW shellspec Describe block "dual-persona orchestration" + 5 cases via `run_hook_dual()` helper + `DEBUG_FRAMING`-counts-both test; CLAUDE.md plan-time-review row extension (file path + AC + spec ref). 2 rounds (r1: 5 advisory findings — 3 style commenting/naming + 2 correctness spec-citation/edge-case; r1 fix-up cleared all + a real shellspec regression where `fake-nonce-injection` test had hardcoded count=1 that became 2 with dual-framing). **n=42 PRs cumulative; mean 1.68 rolling stable.** Atomic-migration scope decision validated — single-format hook simpler than dual-format-during-transition. No new constraints; #36 remains highest.

> **Session 72:** **3 substantive PRs merged sequentially from `claude/resume-decouple-session-72-5t7bZ`.** **PR #117** (P0 spec, squash `b0ca62e`) — new `docs/workspace-spec/72d-architecture-review-additions.md` (~209L) contracting 3 pre-implementation rigour additions (B fitness functions · C plan-architect persona · D test-pain gate) at three lifecycle stages, addressing the architecture-review gap acknowledged after session-70's `reviewer-architecture` drop; cross-refs to CLAUDE.md §"Key files" + 72c §9 first-bullet. 2 rounds clean. **PR #118** (P1 ship D, squash `cfca1a1`) — D test-pain gate operationalised: CLAUDE.md §"Engineering conventions" gains the `**Test-pain audit (per spec 72d §3).**` named convention + DoD-2 cross-ref; PR template DoD-2 carries the same cross-ref; spec 72d §3 §"Shipped" marker landed. 2 rounds (1 persistent advisory). **PR #119** (P2 ship B, squash `f6f751b`) — B fitness functions operationalised: 5 rules (domain ↛ UI ×2, slice ↛ supabase, env-var single-reader ×3 selectors closing dot/bracket/destructuring bypass, no circular deps in src/lib via madge) + new `.github/workflows/fitness-functions.yml` workflow with `permissions: contents: read` block + madge devDep + `madge:circular` npm script + spec 72d §4 §"Shipped" marker. 2 rounds (2 persistent advisory re-flags of documented V1 limitations). **n=41 PRs cumulative; mean 1.68 rolling.** Constraint #34 vindicated again on P2 (lockfile mechanical churn ~1500L from `npm install madge` wasn't in kickoff sizing model). New constraints #35 (lockfile churn) + #36 (AST-selector triplet) added. **B+D shipped; C plan-architect persona deferred to session 73 P0** per session-churn budget.

Sessions 41-69: rigour-suite v3a/v3b/v3c shipped progressively (CODEOWNERS · ESLint zero-new-disables · coverage ratchet · plan-time review · slice-verification PR-body gate · multi-agent suite at 4→3 specialists · Conventional Comments verdict vocabulary · synthetic-deliberate-injection gate · author-time comment review · k=2 default flip · differential review mode · architectural-smell-trigger reframe per Cunningham/Fowler). Logic-spec phase progressed through specs 42 (positioning), 60 (share-reconciliation), 65 (pre-signup interview), 67 (post-signup-profiling), and the spec 70 Build Map suite. Hero rotation shipped session 68+69; design-input audit doc shipped session 69 ext.

Session 70: spec 74 AI plan generation + spec 65a sign-up reconciliation logic specs landed; reviewer-architecture dropped at 0.143 catch-rate (well below 0.33 retain bar) reducing multi-agent suite to 3 specialists.

Session 71: spec 67a respondent state machine + spec 75 account administration V1 minimum landed (closing the final 2 of 4 audit gaps from session 69's design-input audit; logic-spec phase complete). 3-specialist suite drift cleanup PR #115 tightened enforcement across 12 files.

## Current state

### Locked (through session 73)

- Spec 42 positioning (5-phase amended session 22).
- Spec 60 share-reconciliation; spec 65 pre-signup interview; spec 65a sign-up reconciliation; spec 67 post-signup-profiling-progress; spec 67a respondent state machine; spec 74 AI plan generation; spec 75 account administration V1.
- Spec 70 Build Map suite (5 phase docs + slices catalogue + audit-integrated inventory).
- Spec 71 rebuild strategy + §4 hexagonal reference shape (S-F7 dev/prod abstraction pattern).
- Spec 72-suite engineering rigour: 72 (security DoD) · 72a (preview-deploy rubric) · 72b (adversarial review budget) · 72c (multi-agent review framework, 3 specialists post session-70) · **72d (architecture review additions B+C+D, session 72)**.
- Spec 73 copy patterns.
- Hard controls: CODEOWNERS · ESLint no-disable ratchet · coverage threshold ratchet · **dual-persona plan-time review (`.claude/subagent-prompts/exit-plan-review.md` + NEW `.claude/agents/plan-architect.md`; both Conventional Comments single-format post session-73 atomic migration)** · slice-verification PR-DoD · 3-specialist auto-review at k=2 default · synthetic-deliberate-injection gate (3 personas) · author-time comment review · D test-pain gate (CLAUDE.md DoD-2 sub-check) + B fitness functions (.github/workflows/fitness-functions.yml).
- Persona retain/drop verdicts: reviewer-correctness STRONG retain (22/10); reviewer-style STRONG retain (14+/10); reviewer-security STRONG-candidate (7/10, +2 first-time catches in session 72); reviewer-architecture DROPPED (session 70).

### Built (on main as of `b0d2966`; session 73 ships P0 via PR #121 — closes B+C+D programme)

- Hero rotation production (session 68+69).
- 9 hero variants + dev gallery (session 67).
- Cohesive Vercel preview (session 66).
- All logic specs from sessions 70+71.
- **Spec 72d B+C+D contracts (session 72 P0; PR #117).**
- **D test-pain gate operationalised in CLAUDE.md §"Engineering conventions" + DoD-2 + PR template (session 72 P1; PR #118).**
- **B fitness functions (5 rules) operational in eslint.config.mjs + new fitness-functions.yml workflow (session 72 P2; PR #119).**
- **C plan-architect persona operational in `.claude/agents/plan-architect.md` + extended `.claude/hooks/exit-plan-review.sh` dual-spawn (session 73 P0; PR #121). Atomic Conventional Comments migration of existing `exit-plan-review.md` shipped same PR. B+C+D rigour stack 3/3 OPERATIONAL.**

## Session 74 priorities

**B+C+D programme COMPLETE (session 73 P0 closed C).** The rigour stack is now operational. **The next cohort to fire is the first 3 src/ slices** — calibration moment per spec 72c §9.

### P0 — First src/ slice post-B+C+D = calibration moment

Spec 72c §9 trigger: *"expansion path tracked if cumulative correctness criterion-7 catch-rate falls below retain bar in first 3 src/ slices post-B+C+D"*. Session 74's first src/ slice is the start of that 3-slice cohort. Plan-architect persona (NEW session 73) participates from slice 1.

Candidates (priority order, dependent on canvas state at session start):

- **S-F7-beta unpark.** Rebase from `a3f67ec` against current main (8 ahead / 49+ behind per session 35 archive). Once landed: persistence + auth abstraction in dev mode goes live. Touches `src/lib/store/`, `src/lib/auth/`. Depends on no canvas — can ship anytime.
- **S-O1** if pre-signup canvas appears at `docs/design-source/pre-signup-interview/{slug}/`.
- **S-M1.0b** if mobile canvas appears at `docs/design-source/marketing-landing/{slug}/`.

### P1+ — Backlog from `docs/v2/v2-backlog.md` + cohesive-product trajectory

With logic-spec phase COMPLETE + B+C+D rigour stack OPERATIONAL, gating constraints on src/ work are mostly resolved. Phase C build slices unblock as canvas appears.

### Validation watch — first 3 src/ slices

Each src/ slice's HANDOFF gains a `## Persona findings recorded` section per active persona (4 active: reviewer-correctness, reviewer-style, reviewer-security, plan-architect). After 3 src/ slices, retain/drop verdicts re-evaluated per spec 72c §9. If correctness criterion-7 catch-rate falls below retain bar, the spec 72c §9 expansion path fires (re-introduce dedicated post-PR architecture specialist).

### Cohesive-product trajectory (post-session-72)

- ✅ First cohesive Vercel preview SHIPPED (session 66)
- ✅ 9 hero variants + dev gallery SHIPPED (session 67)
- ✅ Production hero rotation SHIPPED (session 68 + 69)
- ✅ Design-input audit doc SHIPPED (session 69 ext)
- ✅ AI plan generation spec LOCKED (session 70)
- ✅ Sign-up + orientation reconciliation LOCKED (session 70)
- ✅ Multi-agent suite reduced 4 → 3 specialists (session 70)
- ✅ Respondent state machine spec LOCKED (session 71)
- ✅ Account administration V1 spec LOCKED (session 71)
- ✅ Logic-spec phase COMPLETE (4/4 audit gaps closed)
- ✅ 3-specialist suite drift cleanup SHIPPED (session 71)
- ✅ **Spec 72d B+C+D contracts LOCKED (session 72 P0)**
- ✅ **D test-pain gate SHIPPED (session 72 P1)**
- ✅ **B fitness functions SHIPPED (session 72 P2)**
- ✅ **C plan-architect persona SHIPPED (session 73 P0; PR #121 atomic-migration)**
- ⏳ First src/ slice post-B+C+D — session 74 P0 (S-F7-beta unpark or canvas-gated)
- ⏳ Mobile-responsive marketing landing — gated on mobile canvas
- ⏳ Pre-signup interview build — gated on canvas
- 4-5 sessions to user-testable Build phase end-to-end (post-C)
- 9-12 sessions to all 5 phases minimally populated
- 17+ sessions to production-grade

### Synthetic-deliberate-injection gate POST SESSION-72

Live persona regression detection operational (PR #85, session 63). Fires for **3 personas** (security · correctness · style) post session-70 architecture drop. Every persona/orchestrator/synthetic-content change triggers 3× live `claude -p` invocations and asserts each persona flags its dimension's planted defect. Architecture fixture removed (session 70). PR #119 confirmed clean run on the 3-specialist seed.

## Scope ceiling

Session capacity limits per CLAUDE.md §"Track your progress actively": soft-note 1,000L · warn 1,500L · stop 2,000L combined session churn. **Note (Constraint #35):** lockfile mechanical churn (e.g. `npm install` regenerating `package-lock.json`) counts toward this tracker even though it isn't authored work. Pre-budget ~1000-1500L per new dep added.

## Negative constraints (preserve from session 36)

Constraints accumulated across sessions, anchored in HANDOFF retros:

- **#1-#28** (sessions 36-66): preserve — verification.md is final-state (#27); don't freeze AC text more ambitious than impl budget (#28); etc. Refer to per-session HANDOFFs for individual lineage.
- **#29** Pre-priority spec-gate verification — grep gating IF-clauses verbatim before treating "per spec X §Y" as authorized.
- **#30** Naming-rule consistency batch — when renaming or restructuring, batch all references in the same PR.
- **#31** Pre-priority carry-over framing verification — grep live state before treating multi-session carry-overs as deferred again.
- **#32** Transitive-bump trade-off matrix — when bumping a transitive dep, weigh upgrade-friction vs hold cost.
- **#33** Spec amendments claiming impl facts must update impl files in same PR.
- **#34** Control-plane changes have wider blast radius than initial estimate — estimate at catalogue level (grep ALL references) before sizing.
- **#35** **(NEW session 72)** Lockfile mechanical churn from `npm install`/`package-lock.json` regeneration counts toward `.claude/hooks/line-count.sh` session-churn tracking but isn't authored work. Pre-budget ~1000-1500L of mechanical churn per new dep added; factor into session capacity decisions when sequencing P-PRs.
- **#36** **(NEW session 72)** AST-selector ESLint rules (e.g. `no-restricted-syntax`) need triplet selectors to close bypass surfaces: dot access (`property.name`), bracket access (`property.value` with `computed=true`), and destructuring (`VariableDeclarator > ObjectPattern Property[key.name]`). Single dot-access selectors miss two real-world access patterns.

## Information tiers

- **Tier 1 (always loaded):** CLAUDE.md. North star, rules, startup checklist.
- **Tier 2 (read at session start):** This file. Current state and priorities.
- **Tier 3 (read when building a feature):** `docs/workspace-spec/{N}-*.md` — only the spec relevant to the current task.
- **Tier 4 (reference only):** `docs/HANDOFF-SESSION-*.md`, `docs/v2/v2-backlog.md`. Consult historically.

## Branch

Sequential single-branch pattern across sessions 54→73 (20 sessions in a row). Each session uses `claude/(resume-)decouple-session-{N}-{harness suffix}` across all P-PRs + wrap. After each squash-merge, GitHub auto-deletes head branch; resync via `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.

### Branch state at session-73 wrap (verified live)

- **Wrap branch:** `claude/decouple-session-73-xgvsb` (session-20-in-a-row of the sequential single-branch pattern).
- **`main` tip:** `b0d2966` (post-PR-#121 merge — C plan-architect persona ship).
- **Open PRs at session-73 wrap:** wrap PR opens after this commit. None other open at wrap.
- **Closed/merged this session:** PR #121 (P0 ship C) squash `b0d2966`.
- **Live rigour gates:** 3-specialist suite (security · correctness · style) + Fitness functions workflow + **dual-persona plan-time review** (`exit-plan-review.md` + NEW `plan-architect.md`; both Conventional Comments single-format post session-73 atomic migration). All gates pass clean against current src/ at wrap. Spec 72c + CLAUDE.md §"Hard controls" reflect the dual-persona orchestration.
- **Persona retain/drop measurement** cumulative through session 73: reviewer-correctness **24/10 STRONG retain** (+2 new findings session 73) · reviewer-style **17/10 STRONG retain** (+3 new findings session 73 — commenting WHAT-narration ×2 + naming nit) · reviewer-security 7/10 STRONG-candidate (no new findings session 73 — control-plane PR) · reviewer-architecture **DROPPED** session 70 · plan-architect **NEW** session 73 (no findings yet — fires from session 74 first src/ slice).
- **Architecture-review gap closure status** — **B+C+D 3/3 SHIPPED** (D session 72 PR #118; B session 72 PR #119; C session 73 PR #121). Full B+C+D pre-impl rigour stack is operational. First src/ slice post-stack is the calibration moment (spec 72c §9 watch).

### Next session (74) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. Wrap PR for session 73 should be merged at session-74 start; verify against live source.
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Sequential single-branch pattern continues — `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.
3. **Run `npm install` if `node_modules/` is empty.** TDD-guard DEGRADED detection emits a graceful skip note when vitest is absent. Madge installed in PR #119; verify `node_modules/.bin/madge` exists.
4. **Confirm priority with user.** P0 = **First src/ slice post-B+C+D = calibration moment** (S-F7-beta unpark OR canvas-gated S-O1 / S-M1.0b). P1+ = backlog from `docs/v2/v2-backlog.md`.
5. **If S-F7-beta unpark:** `git fetch origin claude/S-F7-beta-impl` and check current state vs `a3f67ec` (8 ahead / 49+ behind main per session 35 archive). Plan rebase strategy. Pre-flight read: `docs/slices/S-F7-beta-dev-surface/{acceptance,verification,security}.md`.
6. **If canvas-gated:** check `docs/design-source/marketing-landing/` + `docs/design-source/pre-signup-interview/` for new canvas slug subfolders; if present, S-O1 / S-M1.0b unblock. Otherwise, default to S-F7-beta unpark.
7. **CODEOWNERS solo-operator pattern (#25)** — src/ PRs may need admin-bypass merge if no other reviewers available.
8. **Constraint #29 (pre-priority spec-gate verification):** before treating any "per spec X §Y" priority as authorized, grep that section's gating IF-clauses verbatim.
9. **Constraint #31 (pre-priority carry-over framing verification):** before treating S-F7-beta as "still parked", grep live state and confirm kickoff framing matches reality.
10. **Constraint #33 (spec amendments claiming impl facts):** must update impl files in same PR.
11. **Constraint #34 (control-plane wider blast radius):** mostly N/A for src/ slices, but check if slice touches `.github/`, `.claude/`, or eslint/coverage config.
12. **Constraint #35 (lockfile churn):** if slice adds deps, pre-budget ~1000-1500L mechanical churn per dep.
13. **Constraint #36 (AST-selector triplet):** if any new ESLint AST-selector rules ship, use the triplet pattern (dot + bracket + destructuring).
14. **PR-DoD literal-regex requirement:** PR bodies must literal-cite `docs/slices/S-XX/verification.md` (no brace expansion).
15. **Source-of-truth precedence rule** — when user's Claude AI Design canvas conflicts with spec, design canvas wins for visual + section structure.
16. **First src/ slice post-B+C+D — calibration watch.** Track correctness criterion-7 hidden-effects catches across the first 3 src/ slices; if catch-rate falls below retain bar, spec 72c §9 expansion path fires (re-introduce dedicated post-PR architecture specialist). **Plan-architect persona (NEW session 73) participates from this slice forward.** Each src/ slice's HANDOFF gains a `## Persona findings recorded` section per active persona (4 active: reviewer-correctness, reviewer-style, reviewer-security, plan-architect).

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-73 additions:

```
.claude/agents/plan-architect.md                               — Plan-time architecture-review persona (NEW; PR #121; 102L; 5-question rubric per spec 72d §5)
docs/HANDOFF-SESSION-73.md                                     — session 73 retro (NEW)
```

Session-73 updates (no removals):

```
.claude/subagent-prompts/exit-plan-review.md                   — Migrated from `verdict + severity` to Conventional Comments single-format (PR #121)
.claude/hooks/exit-plan-review.sh                              — Dual-template loading + frame_prompt() helper + spawn-or-stub block per persona + jq -s union aggregator + BLOCKING_COUNT gate + EXIT_PLAN_REVIEW_DEBUG_VERDICT_* env-var injection (PR #121)
docs/workspace-spec/72d-architecture-review-additions.md       — §5 atomic-migration amendment (collapsed L177 carve-out) + §Shipped marker (PR #121)
tests/shellspec/exit-plan-review.spec.sh                       — NEW Describe block "dual-persona orchestration" + 5 cases via run_hook_dual() helper + DEBUG_FRAMING-counts-both test + fake-nonce-injection assertion update (PR #121)
CLAUDE.md                                                      — §"Hard controls" plan-time-review row extended with plan-architect.md + AC-7 + spec 72d §5 + Conventional Comments single-format note (PR #121)
```

## Rigour-suite completeness (layman summary)

| Programme | Status | Sessions | Key artefacts on main |
|---|---|---|---|
| **v3a-foundation** | ✅ SHIPPED | 33-41 (PR #24) | `verify-slice.sh`, `tdd-first-every-commit`, plan-time gate |
| **v3b subagent suite** | ✅ SHIPPED + REDUCED | 41-48 + 54-55 + 70 + 71 | Multi-agent suite live on main; 3 specialist personas post drop + acceptance-gate + ux-polish-reviewer + reviewer-comment; drift cleanup PR #115 |
| **v3c efficiency layer** | ✅ MOSTLY SHIPPED | 50-58 + 60 + 70 + 71 | k=2 default, anti-pattern catalogue, differential mode, per-specialist filter, schema validation, author-time comment review, plan-review default-spawn, synthetic-deliberate-injection per-persona fixtures (3 dimensions), drift cleanup |
| **v3c carry-overs** | 🔵 OUT OF SCOPE | — | Stryker mutation · property-based fuzz · multi-provider 3rd reviewer · live persona drift cron |
| **B+C+D pre-impl rigour** | ✅ **3/3 SHIPPED** (sessions 72+73) | 72-73 | **D test-pain gate SHIPPED PR #118** · **B fitness functions SHIPPED PR #119** · **C plan-architect persona SHIPPED PR #121 (atomic Conventional Comments migration)** |

**Net state at session-73 wrap:** logic-spec phase COMPLETE (sessions 70+71); B+C+D pre-impl rigour stack 3/3 OPERATIONAL (sessions 72+73); first src/ slice post-stack is the calibration moment per spec 72c §9 (criterion-7 catch-rate watch across first 3 src/ slices).

## Session 74 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD                                                   # local
git rev-parse --short origin/main                                            # expected: post-session-73-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm session-73 PRs all merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
ls node_modules/.bin/vitest                                                  # expect file; if absent, npm install
ls node_modules/.bin/madge                                                   # expect file post-PR-#119; if absent, npm install
ls docs/design-source/marketing-landing/                                     # check for new mobile canvas (S-M1.0b prerequisite)
ls docs/design-source/pre-signup-interview/                                  # check for new pre-signup canvas (S-O1 build prerequisite)
ls .claude/agents/                                                           # confirm 5-persona suite incl. NEW plan-architect.md (session 73 P0)
git log --grep="S-F7-beta" --oneline -5                                      # check S-F7-beta-impl branch state if pursuing unpark
grep -A2 "^## §" docs/workspace-spec/72c-multi-agent-review-framework.md     # spec 72c §9 calibration trigger verbatim for src/-slice grounding
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 74?** P0 = first src/ slice post-B+C+D (S-F7-beta unpark OR canvas-gated S-O1 / S-M1.0b). P1+ = backlog from `docs/v2/v2-backlog.md`.
2. **B+C+D rigour stack now operational.** Plan-architect persona spawns on every `ExitPlanMode`. D test-pain gate fires during TDD. B fitness functions fire on every PR + push. **Calibration watch begins now** — track correctness criterion-7 hidden-effects catches across first 3 src/ slices; if catch-rate falls below retain bar, spec 72c §9 expansion path fires.
3. **CODEOWNERS solo-operator pattern (#25).** src/ PRs may need admin-bypass merge if no other reviewers available.
4. **k=2 default + 3-specialist suite calibration.** n=42 PRs cumulative post session-73. Mean 1.68 rolling. First src/ slice (this session) is the next calibration point for the criterion-7 hidden-effects watch.
5. **Persona retain/drop measurement.** reviewer-correctness 24/10 STRONG retain · reviewer-style 17/10 STRONG retain · reviewer-security 7/10 STRONG-candidate (upgrade pending more security-relevant ships) · reviewer-architecture DROPPED · plan-architect NEW (no findings yet — fires from this slice forward). Real test of correctness's expanded rubric (criterion 7 hidden-effects + criterion 2 architectural-severity) on first src/ slice — if catch-rate falls, spec 72c §9 expansion path fires.
6. **Cohesive-product trajectory.** Logic-spec phase COMPLETE; **B+C+D pre-impl rigour 3/3 SHIPPED** (sessions 72+73). Next: 3 src/ slices to validate the rigour stack, then S-F7-beta unpark + canvas-gated work + Phase C build slices.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Quote, don't paraphrase, when invoking a spec.** Constraint #29 codified.
- **Pre-priority shipped-artifact verification.** `ls docs/slices/` + `git log --grep` before treating fresh-build framing as authorized.
- Live gates: `auto-review.yml` (k=2 + 3 specialists + differential mode + per-specialist filter + design-source path-ignore + diff-exclude) · `eslint-no-disable.yml` · `coverage-threshold.yml` · `pr-dod.yml` · `.github/CODEOWNERS` · `persona-fixtures.yml` + `persona-synthetic-fixtures.yml` (3 dimensions) · `shellspec.yml` · `comment-review.sh` PostToolUse advisory · `tdd-guard.sh` 4-state runner detection · `auto-review-parse.sh` schema validation · **NEW `fitness-functions.yml`** (rules 1-5 per spec 72d §4).
- **Verification.md is final-state** (constraint #27).
- **Don't freeze AC text more ambitious than impl budget** (constraint #28).
- **Pre-priority spec-gate verification** (constraint #29).
- **Naming-rule consistency batch** (constraint #30).
- **Carry-over framing verification** (constraint #31).
- **Transitive-bump trade-off matrix** (constraint #32).
- **Spec amendment claims impl facts** (constraint #33) — must update impl files in same PR.
- **Control-plane wider blast radius** (constraint #34) — estimate at catalogue level before sizing.
- **Lockfile mechanical churn** (constraint #35 — NEW session 72) — pre-budget ~1000-1500L per new dep.
- **AST-selector triplet** (constraint #36 — NEW session 72) — dot + bracket + destructuring selectors for env-var/property-access ESLint rules.
- Auto-review iteration stop-signal: at k=2 + 3 specialists + differential mode + per-specialist filter, expect 1-2 rounds per PR. Hard-cap at 4 rounds.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Verdict vocabulary:** Conventional Comments labels + `(blocking)`. Personas emit findings; orchestrator derives verdict via `scripts/derive-verdict.sh --multi k=2`.
