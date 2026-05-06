# Session 72 Wrap Context Block (heading into session 73)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end. Three pillars: shared, not adversarial · evidenced, not asserted · end-to-end, not hand-off. **Tagline:** "Decouple — the complete picture." Spec 42 is authoritative.

## Stack

Next.js 16 + React 19 + Tailwind 4. Vercel preview deploys per branch; production at `construct-dev.vercel.app`. Anthropic SDK + Tink (bank data). Supabase for auth + storage (post-Phase-C). TypeScript strict.

## What sessions 41-72 accomplished (rolling window)

> **Session 72 (this wrap):** **3 substantive PRs merged sequentially from `claude/resume-decouple-session-72-5t7bZ`.** **PR #117** (P0 spec, squash `b0ca62e`) — new `docs/workspace-spec/72d-architecture-review-additions.md` (~209L) contracting 3 pre-implementation rigour additions (B fitness functions · C plan-architect persona · D test-pain gate) at three lifecycle stages, addressing the architecture-review gap acknowledged after session-70's `reviewer-architecture` drop; cross-refs to CLAUDE.md §"Key files" + 72c §9 first-bullet. 2 rounds clean. **PR #118** (P1 ship D, squash `cfca1a1`) — D test-pain gate operationalised: CLAUDE.md §"Engineering conventions" gains the `**Test-pain audit (per spec 72d §3).**` named convention + DoD-2 cross-ref; PR template DoD-2 carries the same cross-ref; spec 72d §3 §"Shipped" marker landed. 2 rounds (1 persistent advisory). **PR #119** (P2 ship B, squash `f6f751b`) — B fitness functions operationalised: 5 rules (domain ↛ UI ×2, slice ↛ supabase, env-var single-reader ×3 selectors closing dot/bracket/destructuring bypass, no circular deps in src/lib via madge) + new `.github/workflows/fitness-functions.yml` workflow with `permissions: contents: read` block + madge devDep + `madge:circular` npm script + spec 72d §4 §"Shipped" marker. 2 rounds (2 persistent advisory re-flags of documented V1 limitations). **n=41 PRs cumulative; mean 1.68 rolling.** Constraint #34 vindicated again on P2 (lockfile mechanical churn ~1500L from `npm install madge` wasn't in kickoff sizing model). New constraints #35 (lockfile churn) + #36 (AST-selector triplet) added. **B+D shipped; C plan-architect persona deferred to session 73 P0** per session-churn budget.

Sessions 41-69: rigour-suite v3a/v3b/v3c shipped progressively (CODEOWNERS · ESLint zero-new-disables · coverage ratchet · plan-time review · slice-verification PR-body gate · multi-agent suite at 4→3 specialists · Conventional Comments verdict vocabulary · synthetic-deliberate-injection gate · author-time comment review · k=2 default flip · differential review mode · architectural-smell-trigger reframe per Cunningham/Fowler). Logic-spec phase progressed through specs 42 (positioning), 60 (share-reconciliation), 65 (pre-signup interview), 67 (post-signup-profiling), and the spec 70 Build Map suite. Hero rotation shipped session 68+69; design-input audit doc shipped session 69 ext.

Session 70: spec 74 AI plan generation + spec 65a sign-up reconciliation logic specs landed; reviewer-architecture dropped at 0.143 catch-rate (well below 0.33 retain bar) reducing multi-agent suite to 3 specialists.

Session 71: spec 67a respondent state machine + spec 75 account administration V1 minimum landed (closing the final 2 of 4 audit gaps from session 69's design-input audit; logic-spec phase complete). 3-specialist suite drift cleanup PR #115 tightened enforcement across 12 files.

## Current state

### Locked (through session 72)

- Spec 42 positioning (5-phase amended session 22).
- Spec 60 share-reconciliation; spec 65 pre-signup interview; spec 65a sign-up reconciliation; spec 67 post-signup-profiling-progress; spec 67a respondent state machine; spec 74 AI plan generation; spec 75 account administration V1.
- Spec 70 Build Map suite (5 phase docs + slices catalogue + audit-integrated inventory).
- Spec 71 rebuild strategy + §4 hexagonal reference shape (S-F7 dev/prod abstraction pattern).
- Spec 72-suite engineering rigour: 72 (security DoD) · 72a (preview-deploy rubric) · 72b (adversarial review budget) · 72c (multi-agent review framework, 3 specialists post session-70) · **72d (architecture review additions B+C+D, session 72)**.
- Spec 73 copy patterns.
- Hard controls: CODEOWNERS · ESLint no-disable ratchet · coverage threshold ratchet · plan-time review · slice-verification PR-DoD · 3-specialist auto-review at k=2 default · synthetic-deliberate-injection gate (3 personas) · author-time comment review · **NEW: D test-pain gate (CLAUDE.md DoD-2 sub-check) + B fitness functions (.github/workflows/fitness-functions.yml)**.
- Persona retain/drop verdicts: reviewer-correctness STRONG retain (22/10); reviewer-style STRONG retain (14+/10); reviewer-security STRONG-candidate (7/10, +2 first-time catches in session 72); reviewer-architecture DROPPED (session 70).

### Built (on main as of `f6f751b`; session 72 ships P0+P1+P2 sequentially via PRs #117 + #118 + #119)

- Hero rotation production (session 68+69).
- 9 hero variants + dev gallery (session 67).
- Cohesive Vercel preview (session 66).
- All logic specs from sessions 70+71.
- **Spec 72d B+C+D contracts (session 72 P0; PR #117).**
- **D test-pain gate operationalised in CLAUDE.md §"Engineering conventions" + DoD-2 + PR template (session 72 P1; PR #118).**
- **B fitness functions (5 rules) operational in eslint.config.mjs + new fitness-functions.yml workflow (session 72 P2; PR #119).**

## Session 73 priorities

Per the architecture-review gap closure trajectory: **C plan-architect persona is the final piece of the B+C+D programme.** After C ships, the rigour stack is fully ready for the first src/ slice — which is the calibration moment for D + B + C against actual implementation work.

### P0 — Ship C plan-architect persona (~200-280L authored)

Per spec 72d §5. Three touch points:

1. **NEW `.claude/agents/plan-architect.md`** — persona file with 5-question rubric (seams · hidden effects · coupling · test-pain forecast · hexagonal-invariant respect). Max 300L target ≤200L per spec 72c §4. Conventional Comments output format per CLAUDE.md §"Hard controls" §"Verdict vocabulary". Architectural-class concerns (categories `seam-boundary`, `hidden-effects`, `hexagonal-invariant`) default to `blocking: true`.
2. **Extend `.claude/hooks/exit-plan-review.sh`** — spawn plan-architect alongside the existing exit-plan-review template. Aggregate findings union; block plan exit if either persona produces a blocking finding. Document the dual-format hook orchestrator handling (plan-architect uses Conventional Comments; existing exit-plan-review.md uses older `verdict + severity` format pending separate migration).
3. **Spec 72d §5 §"Shipped (Session 73 P0)"** marker per the paired-spec invariant (Constraint #33).

### P1+ — Resume canvas-gated work + S-F7-beta unpark

Once C ships, the full B+C+D rigour stack is operational and validated against control-plane work. Then:

- **S-F7-beta rebase from `a3f67ec`** against current main (8 ahead / 49 behind main per session 35 archive). Once landed: persistence + auth abstraction in dev mode goes live.
- **S-O1** if pre-signup canvas appears at `docs/design-source/pre-signup-interview/{slug}/`.
- **S-M1.0b** if mobile canvas appears at `docs/design-source/marketing-landing/{slug}/`.

### First src/ slice post-B+C+D = calibration moment

D test-pain gate, B fitness functions, and (after P0 ships) plan-architect persona all need their first src/ slice firing to validate. Spec 72c §9 carries the trigger: *"expansion path tracked if cumulative correctness criterion-7 catch-rate falls below retain bar in first 3 src/ slices post-B+C+D"*. Session 73's first src/ slice is the start of that 3-slice cohort.

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
- ⏳ C plan-architect persona — session 73 P0
- ⏳ First src/ slice post-B+C+D — session 73 P1+ (S-F7-beta unpark or canvas-gated)
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

Sequential single-branch pattern across sessions 54→72 (19 sessions in a row). Each session uses `claude/resume-decouple-session-{N}-{harness suffix}` across all P-PRs + wrap. After each squash-merge, GitHub auto-deletes head branch; resync via `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.

### Branch state at session-72 wrap (verified live)

- **Wrap branch:** `claude/resume-decouple-session-72-5t7bZ` (session-19-in-a-row of the sequential single-branch pattern).
- **`main` tip:** `f6f751b` (post-PR-#119 merge — B fitness functions ship).
- **Open PRs at session-72 wrap:** wrap PR opens after this commit. None other open at wrap.
- **Closed/merged this session:** PR #117 (P0 spec 72d) squash `b0ca62e`; PR #118 (P1 ship D) squash `cfca1a1`; PR #119 (P2 ship B) squash `f6f751b`.
- **Live rigour gates:** 3-specialist suite (security · correctness · style) + **NEW `Fitness functions (spec 72d §4)` workflow** (rules 1-5; runs on PR + push to main). All gates pass clean against current src/ at wrap. Spec 72c + CLAUDE.md §"Hard controls" reflect the partition.
- **Persona retain/drop measurement** cumulative through session 72: reviewer-correctness 22/10 STRONG retain (+6 new findings session 72) · reviewer-style 14+/10 STRONG retain (no new findings) · reviewer-security 7/10 STRONG-candidate (+2 new findings — first session with security catches; both legitimate) · reviewer-architecture **DROPPED** session 70.
- **Architecture-review gap closure status** — B+D shipped (session 72); C remains (session 73 P0). After C ships, the full B+C+D pre-impl rigour stack is operational. First src/ slice post-C ship is the calibration moment (spec 72c §9 watch).

### Next session (73) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. Wrap PR for session 72 should be merged at session-73 start; verify against live source.
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Sequential single-branch pattern continues — `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.
3. **Run `npm install` if `node_modules/` is empty.** TDD-guard DEGRADED detection emits a graceful skip note when vitest is absent. Madge installed in PR #119; verify `node_modules/.bin/madge` exists.
4. **Confirm priority with user.** P0 = **Ship C plan-architect persona (~200-280L authored)**. P1+ = canvas-gated + S-F7-beta unpark.
5. **If P0 (ship C plan-architect persona):** new `.claude/agents/plan-architect.md` + extend `.claude/hooks/exit-plan-review.sh` + spec 72d §5 §"Shipped" marker. Pre-flight read: spec 72d §5 contract verbatim + existing reviewer-{security,correctness,style}.md persona for structure pattern + existing exit-plan-review.sh hook for spawn integration. Pre-priority spec-gate verification per Constraint #29.
6. **If P1 (canvas-gated + S-F7-beta):** check `docs/design-source/marketing-landing/` + `docs/design-source/pre-signup-interview/` for new canvas slug subfolders; if present, S-O1 / S-M1.0b unblock. Otherwise, S-F7-beta unpark (rebase from `a3f67ec` against current main).
7. **CODEOWNERS solo-operator pattern (#25)** — control-plane PRs touch protected paths; admin-bypass merge expected.
8. **Constraint #29 (pre-priority spec-gate verification):** before treating any "per spec X §Y" priority as authorized, grep that section's gating IF-clauses verbatim. Spec 72d §5 has explicit gating text — quote it.
9. **Constraint #31 (pre-priority carry-over framing verification):** before treating C as "deferred again", grep live state and confirm kickoff framing matches reality.
10. **Constraint #33 (spec amendments claiming impl facts):** must update impl files in same PR. C ship pairs spec 72d §5 §"Shipped" marker with the persona file + hook extension.
11. **Constraint #34 (control-plane wider blast radius):** C is control-plane (`.claude/agents/`, `.claude/hooks/`); estimate at catalogue level before sizing.
12. **Constraint #35 (lockfile churn):** C does NOT add new deps (persona file + hook script edit only); no lockfile churn expected. P1 work may add deps depending on slice.
13. **Constraint #36 (AST-selector triplet):** if any new ESLint AST-selector rules ship in P1+ (e.g. broadening B fitness functions), use the triplet pattern.
14. **PR-DoD literal-regex requirement:** PR bodies must literal-cite `docs/slices/S-XX/verification.md` (no brace expansion).
15. **Source-of-truth precedence rule** — when user's Claude AI Design canvas conflicts with spec, design canvas wins for visual + section structure.
16. **First src/ slice post-B+C+D — calibration watch.** Track correctness criterion-7 hidden-effects catches across the first 3 src/ slices; if catch-rate falls below retain bar, spec 72c §9 expansion path fires (re-introduce dedicated post-PR architecture specialist).

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-72 additions:

```
docs/workspace-spec/72d-architecture-review-additions.md       — B+C+D pre-impl rigour contracts (NEW; PR #117)
.github/workflows/fitness-functions.yml                        — Fitness-functions workflow (NEW; PR #119; rules 1-5)
docs/HANDOFF-SESSION-72.md                                     — session 72 retro (NEW)
```

Session-72 updates (no removals):

```
CLAUDE.md                                                      — §Key files entry for 72d (PR #117); §"Engineering conventions" new "Test-pain audit (per spec 72d §3)." convention + DoD-2 cross-ref (PR #118)
.github/PULL_REQUEST_TEMPLATE.md                               — DoD-2 checkbox cross-refs the test-pain audit (PR #118)
docs/workspace-spec/72c-multi-agent-review-framework.md        — §9 first-bullet "See also spec 72d" cross-ref (PR #117)
eslint.config.mjs                                              — 4 new flat-config blocks for fitness-function rules 1-4 (PR #119)
package.json                                                   — adds madge devDep + madge:circular npm script (PR #119)
package-lock.json                                              — regenerated by npm install madge --save-dev (PR #119; mechanical ~1500L)
docs/workspace-spec/72d-architecture-review-additions.md       — §3 + §4 §"Shipped" markers (PR #118 + PR #119)
```

## Rigour-suite completeness (layman summary)

| Programme | Status | Sessions | Key artefacts on main |
|---|---|---|---|
| **v3a-foundation** | ✅ SHIPPED | 33-41 (PR #24) | `verify-slice.sh`, `tdd-first-every-commit`, plan-time gate |
| **v3b subagent suite** | ✅ SHIPPED + REDUCED | 41-48 + 54-55 + 70 + 71 | Multi-agent suite live on main; 3 specialist personas post drop + acceptance-gate + ux-polish-reviewer + reviewer-comment; drift cleanup PR #115 |
| **v3c efficiency layer** | ✅ MOSTLY SHIPPED | 50-58 + 60 + 70 + 71 | k=2 default, anti-pattern catalogue, differential mode, per-specialist filter, schema validation, author-time comment review, plan-review default-spawn, synthetic-deliberate-injection per-persona fixtures (3 dimensions), drift cleanup |
| **v3c carry-overs** | 🔵 OUT OF SCOPE | — | Stryker mutation · property-based fuzz · multi-provider 3rd reviewer · live persona drift cron |
| **B+C+D pre-impl rigour** | 🟡 **2/3 SHIPPED** (session 72) | 72-73 | **D test-pain gate SHIPPED PR #118** · **B fitness functions SHIPPED PR #119** · C plan-architect persona QUEUED for session 73 P0 |

**Net state at session-72 wrap:** logic-spec phase COMPLETE (sessions 70+71); B+D pre-impl rigour SHIPPED (session 72); C plan-architect persona DEFERRED to session 73 P0; first src/ slice post-B+C+D will be the validation moment for D + B + C calibration.

## Session 73 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD origin/main                                       # expected: post-session-72-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm session-72 PRs all merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
ls node_modules/.bin/vitest                                                  # expect file; if absent, npm install
ls node_modules/.bin/madge                                                   # expect file post-PR-#119; if absent, npm install
ls docs/design-source/marketing-landing/                                     # check for new mobile canvas (S-M1.0b prerequisite)
ls docs/design-source/pre-signup-interview/                                  # check for new pre-signup canvas (S-O1 build prerequisite)
ls .claude/agents/                                                           # confirm session-72 persona suite (no plan-architect yet — that's the P0 ship)
grep -A2 "^## §5" docs/workspace-spec/72d-architecture-review-additions.md   # spec 72d §5 C contract verbatim for P0 grounding
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 73?** P0 = ship C plan-architect persona (~200-280L authored). P1+ = canvas-gated + S-F7-beta unpark.
2. **C plan-architect output-format drift handling.** Existing `exit-plan-review.md` uses old `verdict + severity` format; new plan-architect uses Conventional Comments per spec 72c §4. Hook orchestrator handles both during transition. Migration of `exit-plan-review.md` is **out of scope** per spec 72d §5; tracked as separate concern.
3. **CODEOWNERS solo-operator pattern (#25).** C ship is control-plane; admin-bypass merge expected.
4. **k=2 default + 3-specialist suite calibration.** n=41 PRs cumulative post session-72. Mean 1.68 rolling. First src/ slice (post-C) is the next calibration point for the criterion-7 hidden-effects watch.
5. **Persona retain/drop measurement.** reviewer-correctness 22/10 STRONG retain · reviewer-style 14+/10 STRONG retain · reviewer-security 7/10 STRONG-candidate (upgrade pending) · reviewer-architecture DROPPED. Real test of correctness's expanded rubric (criterion 7 hidden-effects + criterion 2 architectural-severity) on first src/ slice — if catch-rate falls, spec 72c §9 expansion path fires.
6. **Cohesive-product trajectory.** Logic-spec phase COMPLETE; B+D pre-impl rigour SHIPPED; C plan-architect persona is the final piece. After C, S-F7-beta unpark + canvas-gated work resumes.

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
