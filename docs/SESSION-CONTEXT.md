# Session 75 Wrap Context Block (heading into session 76)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end. Three pillars: shared, not adversarial · evidenced, not asserted · end-to-end, not hand-off. **Tagline:** "Decouple — the complete picture." Spec 42 is authoritative.

## Stack

Next.js 16 + React 19 + Tailwind 4. Vercel preview deploys per branch; production at `construct-dev.vercel.app`. Anthropic SDK + Tink (bank data). Supabase for auth + storage (post-Phase-C). TypeScript strict.

## What sessions 41-75 accomplished (rolling window)

> **Session 75 (this wrap):** **1 substantive PR merged.** **PR #125** (P0, squash `9346963`) — `docs/workspace-spec/76-prototype-mode-rigour.md` NEW (canonical per-category gate-behaviour matrix in §3); CLAUDE.md NEW §"Slice categories" pointer + 13→14 base-count reconciliation across L136 + L255 + PR template; `.claude/agents/reviewer-prototype-readiness.md` NEW persona (UI/UX integration lens — interaction patterns · accessibility · state coverage · copy clarity · motion + `prefers-reduced-motion` · mobile viewport · AC-gap inherited from correctness rubric); wiring atomic per #38: `vitest.config.ts` `coverage.exclude` for literal-slug prototype paths · `.claude/hooks/tdd-guard.sh` path-default-skip block with `[slug]` regex disambiguation · 3 new shellspec fixtures (12-14: skip / enforce / enforce) · `auto-review.yml` brief-job category-detection emitting `dimensions` JSON output consumed by specialist matrix + aggregator via `fromJSON()` · PR template DoD-14 short-form rendering note · `S-PROTO-hub/acceptance.md` `**Category:** production` override (calibration cohort row 1 keeps production rigour). 9 files / +360/-9. **Path-C manual plan-time review** (harness still lacks plan-mode toggle): plan-architect 4 findings (1 issue + 1 suggestion + 1 question + 1 note; F-PA3 `[slug]` regex was a real technical catch) · exit-plan-review 4 (3 suggestions + 1 nitpick; F-EPR2 truncated quote + F-EPR3 13/14 drift + F-EPR4 file-existence equivocation all real catches). 2 user decisions surfaced via `AskUserQuestion`: F-PA1 substitute pattern · F-EPR3 reconcile in same PR. **Post-PR auto-review** caught 2 advisory findings on `4bc93d7` (style/commenting: dropped (F-PA3) suffix from shellspec describe — the very anti-pattern being amended in CLAUDE.md L215-222; security/note: defensive env-var pattern for aggregator step), both fixed in `69b6dd7`; second auto-review run approve 0 findings. Single fixup → green. **n=44 PRs cumulative; mean rolling stable.** New constraint #39: sweep your own diff for the anti-pattern you're amending. **Calibration cohort row 1 still locked at S-PROTO-hub** — this slice is infra+spec, not src/, so doesn't enter the cohort.
>
> **Session 74:** **2 substantive PRs merged.** **PR #122** (session-73 wrap with mid-PR Vercel-unblock fix bundled, squash `0497e7f`) — Vercel build was failing on stale `pnpm-lock.yaml` (last touched session 58, missing `madge@^8.0.0` from PR #119); fix: deleted lockfile + pinned `packageManager: "npm@10.9.7"` + addressed only outstanding auto-review advisory (stale persona-retain scores in §"Locked"). **PR #123** (Phase 3 P0, squash `b9d9467`) — `S-PROTO-hub` slice: 61-row TS+Zod design-uncertainty registry × 11 sections at `/dev/proto`; hub renderer + dynamic stub-route + 4 reusable components; 71 tests across 9 files. TDD-first across 5 steps. **Option A architectural pivot** dropped `.dev.tsx` infix so user's Vercel-preview-driven workflow can verify visually; trade-off: hub URL publicly addressable (T0 metadata, pre-launch). **Path-C plan-time review** (manual persona-spawn): plan-architect 0 findings · exit-plan-review 4 all addressed pre-impl. **Post-PR auto-review** caught 9 findings on `d06da0a` (1 blocking-by-security: stale `.dev.tsx` claim in security.md item 9; 3 ac-gaps; 2 commenting; 2 nitpicks; 1 regression-doc) — all resolved in `20a94ca`; aggregate flipped `neutral` → `success`. **n=43 PRs cumulative.** New constraints #37 (`.dev.tsx` invisibility on Vercel-preview-only workflows) + #38 (slice-doc drift after refactor). **Calibration cohort row 1 of 3 entered.**
>
> **Session 73:** **1 substantive PR merged.** **PR #121** (P0 ship C, squash `b0d2966`) — closes the B+C+D pre-impl rigour programme. Six touch points (~280L authored): NEW `.claude/agents/plan-architect.md` 102L (5-question rubric per spec 72d §5 verbatim: seams · hidden effects · coupling · test-pain forecast · hexagonal-invariant respect; Conventional Comments output; default-blocking categories `seam-boundary` + `hidden-effects` + `hexagonal-invariant`); migrated `.claude/subagent-prompts/exit-plan-review.md` from `verdict + severity` to Conventional Comments; extended `.claude/hooks/exit-plan-review.sh` for dual-template loading + `frame_prompt()` helper + spawn-or-stub block per persona + `jq -s` union aggregator + `BLOCKING_COUNT` gate + `EXIT_PLAN_REVIEW_DEBUG_VERDICT_*` env-var injection paths; spec 72d §5 atomic-migration amendment + §Shipped marker; NEW shellspec Describe block "dual-persona orchestration" + 5 cases via `run_hook_dual()` helper + `DEBUG_FRAMING`-counts-both test. **n=42 PRs cumulative.** Atomic-migration scope decision validated.
>
> **Session 72:** **3 substantive PRs merged.** **PR #117** (P0 spec, squash `b0ca62e`) — new `docs/workspace-spec/72d-architecture-review-additions.md` (~209L) contracting 3 pre-implementation rigour additions (B fitness functions · C plan-architect persona · D test-pain gate) at three lifecycle stages. **PR #118** (P1 ship D, squash `cfca1a1`) — D test-pain gate operationalised. **PR #119** (P2 ship B, squash `f6f751b`) — B fitness functions operationalised: 5 rules + new `.github/workflows/fitness-functions.yml` + madge devDep + `madge:circular` npm script. **n=41 PRs cumulative.** Constraints #35 (lockfile churn) + #36 (AST-selector triplet) added.

Sessions 41-69: rigour-suite v3a/v3b/v3c shipped progressively (CODEOWNERS · ESLint zero-new-disables · coverage ratchet · plan-time review · slice-verification PR-body gate · multi-agent suite at 4→3 specialists · Conventional Comments verdict vocabulary · synthetic-deliberate-injection gate · author-time comment review · k=2 default flip · differential review mode · architectural-smell-trigger reframe per Cunningham/Fowler). Logic-spec phase progressed through specs 42 (positioning), 60 (share-reconciliation), 65 (pre-signup interview), 67 (post-signup-profiling), and the spec 70 Build Map suite. Hero rotation shipped session 68+69; design-input audit doc shipped session 69 ext.

Session 70: spec 74 AI plan generation + spec 65a sign-up reconciliation logic specs landed; reviewer-architecture dropped at 0.143 catch-rate (well below 0.33 retain bar) reducing multi-agent suite to 3 specialists.

Session 71: spec 67a respondent state machine + spec 75 account administration V1 minimum landed (closing the final 2 of 4 audit gaps from session 69's design-input audit; logic-spec phase complete). 3-specialist suite drift cleanup PR #115 tightened enforcement across 12 files.

## Current state

### Locked (through session 75)

- Spec 42 positioning (5-phase amended session 22).
- Spec 60 share-reconciliation; spec 65 pre-signup interview; spec 65a sign-up reconciliation; spec 67 post-signup-profiling-progress; spec 67a respondent state machine; spec 74 AI plan generation; spec 75 account administration V1.
- Spec 70 Build Map suite (5 phase docs + slices catalogue + audit-integrated inventory).
- Spec 71 rebuild strategy + §4 hexagonal reference shape (S-F7 dev/prod abstraction pattern).
- Spec 72-suite engineering rigour: 72 (security DoD) · 72a (preview-deploy rubric) · 72b (adversarial review budget) · 72c (multi-agent review framework, 3 specialists post session-70) · 72d (architecture review additions B+C+D, session 72).
- **Spec 76 prototype-mode rigour (session 75 P0; PR #125; `9346963`).** Slice-category metadata (`production` · `prototype` · `infrastructure`); per-category gate-behaviour matrix; `reviewer-prototype-readiness` substitutes `reviewer-correctness` for prototype slices; DoD-14 short-form (items 1, 8, 12, 14); test-pain threshold raises >2 → >5 for prototype paths; vitest coverage.exclude + tdd-guard skip + auto-review.yml category-aware specialist routing operational.
- Spec 73 copy patterns.
- Hard controls: CODEOWNERS · ESLint no-disable ratchet · coverage threshold ratchet · dual-persona plan-time review (`exit-plan-review.md` + `plan-architect.md`; both Conventional Comments single-format) · slice-verification PR-DoD · 3-specialist auto-review at k=2 default · synthetic-deliberate-injection gate (3 personas) · author-time comment review · D test-pain gate (CLAUDE.md DoD-2 sub-check; category-aware threshold per spec 76 §3) + B fitness functions (.github/workflows/fitness-functions.yml).
- Persona retain/drop verdicts: reviewer-correctness STRONG retain (24/10) · reviewer-style STRONG retain (17/10) · reviewer-security STRONG-candidate (7/10) · reviewer-architecture DROPPED (session 70) · plan-architect NEW (session 73; gathered F-PA3 real catch session 75 plan-time) · **reviewer-prototype-readiness NEW (session 75; fires from first category=prototype slice forward — P1 pre-signup-interview onwards)**.

### Built (on main as of `9346963`; session 75 P0 ships spec 76 prototype-mode rigour)

- Hero rotation production (session 68+69).
- 9 hero variants + dev gallery (session 67).
- Cohesive Vercel preview (session 66).
- All logic specs from sessions 70+71.
- Spec 72d B+C+D contracts (session 72 P0; PR #117).
- D test-pain gate operationalised (session 72 P1; PR #118).
- B fitness functions (5 rules) operational (session 72 P2; PR #119).
- C plan-architect persona operational (session 73 P0; PR #121).
- `S-PROTO-hub` Phase 3 P0 — design-uncertainty registry hub at `src/app/dev/proto/` (session 74; PR #123). 61 rows × 11 sections; calibration cohort row 1 of 3 entered.
- **Spec 76 prototype-mode rigour (session 75 P0; PR #125; `9346963`).** Per-category gate-behaviour matrix; reviewer-prototype-readiness persona; tdd-guard + coverage + auto-review wiring; constraint #39 lessons captured.

## Session 76 priorities

### Plan-of-record: 3-phase post-audit programme (continuing from session 75)

| Phase | Goal | Status |
|---|---|---|
| **1 · Logic gaps** | Spec-writing | ✅ COMPLETE sessions 70-71 |
| **2 · Claude AI Design canvases** | Canonical visual source | ▶️ IN PROGRESS — mobile-screens-v2 shipped session 74; pre-signup-interview · bank-connect mid-flow · hub-state-variants pending |
| **3 · `/dev/proto/*` prototypes** | High-uncertainty interaction patterns | ▶️ IN PROGRESS — `S-PROTO-hub` shipped session 74; **prototype-mode rigour spec shipped session 75 (PR #125)**; P1 prototype slice next |

### Per-prototype workflow (4-step loop — unchanged)

Each Phase 3 prototype slice runs through:
1. **Dialogue** — what we're trying to learn / what's uncertain
2. **Canvas prompt(s)** — generate Claude AI Design prompts where static canvas helps before motion (layout, visual treatment, static states)
3. **Absorb** — wait for canvas output, incorporate as input
4. **Construct** — build clickable prototype to test what canvas can't show

Phase 2 (canvas) and Phase 3 (prototype) feed each other per prototype — not strictly sequential.

### Phase 3 sequence (refreshed)

| Order | Slice | Notes |
|---|---|---|
| ✅ Done | `S-PROTO-hub` | Phase 3 inception (session 74 PR #123). Calibration cohort row 1 (locked production rigour via override). |
| ✅ Done | **Prototype-mode rigour spec** | **session 75 P0 (PR #125; `9346963`).** Path B (slice-category metadata) + reviewer-prototype-readiness persona + atomic wiring. |
| **P1 (NEXT)** | `S-PROTO-pre-signup-interview` | 8 screens, real spec 74 AI plan integration. **First slice to exercise `category: prototype` path-default + reviewer-prototype-readiness.** Per per-prototype 4-step loop: session 76 = step 1 (dialogue) + step 2 (canvas-prompts); steps 3-4 land session 77+ once canvas absorbed. **Blocked on Claude AI Design canvas creation** (no `docs/design-source/pre-signup-interview/` yet at session-75 wrap — verified). |
| **P2** | `S-PROTO-section-confirm` | Per-section confirmation pattern (8 sections × multi-state). Less canvas-novel than pre-signup-interview; could potentially run in parallel if user wants src/ slice work session 76. |
| **P3** | `S-PROTO-ai-coach` | Settle phase coach interaction. |
| **P4** | `S-PROTO-share-flow` | Sarah/Mark joint reconciliation. |

Static surfaces (sign-up form, magic-link sent, settings) NOT prototyped — canvas-first is fine.

### Calibration cohort (3 src/ slices)

Spec 72c §9 retain/drop measurement window. Cohort entries (UNCHANGED — session 75 was infra+spec, not src/, so didn't enter):

| Slice | Status | Persona findings (issue main missed) |
|---|---|---|
| 1 · `S-PROTO-hub` | ✅ shipped session 74 | reviewer-security 1 (Y) · reviewer-correctness 4 (Y) · reviewer-style 4 (Y) · plan-architect 0 (ambiguous — pure-data slice) |
| 2 · `S-PROTO-pre-signup-interview` | ⏳ session 76+ P1 | TBD; first slice to also exercise reviewer-prototype-readiness |
| 3 · `S-PROTO-section-confirm` | ⏳ session 76+ P2 | TBD |

After 3 src/ slices, retain/drop verdicts re-evaluated. Plan-architect specifically: row 1's 0 findings is ambiguous data; rows 2-3 expected to give richer behaviour. **Reviewer-prototype-readiness retain/drop measurement** starts at first prototype slice (P1) — informational at V1 (mirrors `acceptance-gate.md` deferral pattern).

### Phase C real-product slices deferred

`S-F7-beta unpark` · `S-O1` (primary onboarding) · `S-M1.0b` (mobile marketing landing) — moved to Phase-3-mature-then-build. Patterns get de-risked in `/dev/proto/*` first; canonical canvases drawn in Claude AI Design after; real-product slices ship last.

### Cohesive-product trajectory (post-session-75)

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
- ✅ Spec 72d B+C+D contracts LOCKED (session 72 P0)
- ✅ D test-pain gate SHIPPED (session 72 P1)
- ✅ B fitness functions SHIPPED (session 72 P2)
- ✅ C plan-architect persona SHIPPED (session 73 P0)
- ✅ `S-PROTO-hub` Phase 3 P0 SHIPPED (session 74; calibration cohort row 1)
- ✅ **Spec 76 prototype-mode rigour SHIPPED (session 75 P0; PR #125)** — slice-category metadata + reviewer-prototype-readiness persona + atomic wiring
- ⏳ `S-PROTO-pre-signup-interview` (P1) — gated on Claude AI Design canvas
- ⏳ Mobile-responsive marketing landing — gated on mobile canvas
- 4-5 sessions to user-testable Build phase end-to-end (post-C)
- 9-12 sessions to all 5 phases minimally populated
- 17+ sessions to production-grade

### Synthetic-deliberate-injection gate POST SESSION-75

Live persona regression detection operational (PR #85, session 63). Fires for **3 personas** (security · correctness · style). Architecture fixture removed (session 70). PR #119 confirmed clean run on the 3-specialist seed. **Reviewer-prototype-readiness synthetic fixture deferred** per spec 76 §8 — wait for first prototype slice ship to gather signal on what defects the persona should reliably catch.

## Scope ceiling

Session capacity limits per CLAUDE.md §"Track your progress actively": soft-note 1,000L · warn 1,500L · stop 2,000L combined session churn. **Note (Constraint #35):** lockfile mechanical churn counts toward this tracker even though it isn't authored work. Pre-budget ~1000-1500L per new dep added.

## Negative constraints (preserve from session 36)

- **#1-#28** (sessions 36-66): preserve.
- **#29** Pre-priority spec-gate verification.
- **#30** Naming-rule consistency batch.
- **#31** Pre-priority carry-over framing verification.
- **#32** Transitive-bump trade-off matrix.
- **#33** Spec amendments claiming impl facts must update impl files in same PR.
- **#34** Control-plane wider blast radius — estimate at catalogue level before sizing.
- **#35** Lockfile mechanical churn counts toward session-churn tracking; pre-budget per new dep.
- **#36** AST-selector ESLint rules need triplet selectors (dot + bracket + destructuring).
- **#37** `.dev.tsx` invisibility on Vercel-preview-only workflows; default to `page.tsx` for slices the user verifies visually.
- **#38** Slice-doc drift after refactor — sweep `acceptance.md` + `verification.md` + `test-plan.md` + `security.md` in same commit.
- **#39 (NEW session 75)** **Sweep your own diff for the anti-pattern you're amending.** When a PR touches CLAUDE.md anti-pattern rules (or spec rules that propagate to enforcement), grep the same PR's diff for instances of the rule being amended. Session 75's `(F-PA3)` suffix in shellspec describe was an instance of the very CLAUDE.md L215-222 rule being reformulated in spec 76. Author-time `comment-review.sh` live-mode would catch; stub-mode regex did not flag the test-description case until post-PR. Mitigation: opt into live-mode `COMMENT_REVIEW_SPAWN=1` for control-plane PRs that touch the comment-rule surface itself.

## Information tiers

- **Tier 1 (always loaded):** CLAUDE.md. North star, rules, startup checklist, NEW §"Slice categories".
- **Tier 2 (read at session start):** This file. Current state and priorities.
- **Tier 3 (read when building a feature):** `docs/workspace-spec/{N}-*.md` — only the spec relevant to the current task.
- **Tier 4 (reference only):** `docs/HANDOFF-SESSION-*.md`, `docs/v2/v2-backlog.md`. Consult historically.

## Branch

Sequential single-branch pattern across sessions 54→75 (22 sessions in a row). Each session uses `claude/(resume-)decouple-session-{N}-{harness suffix}` across all P-PRs + wrap. After each squash-merge, GitHub auto-deletes head branch; resync via `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.

### Branch state at session-75 wrap (verified live)

- **Wrap branch:** `claude/decouple-session-75-ZRcSX` (session-22-in-a-row of the sequential single-branch pattern).
- **`main` tip:** `9346963` (post-PR-#125 merge — spec 76 prototype-mode rigour ship). Wrap PR opens after this commit.
- **Closed/merged this session:** PR #125 (P0 ship spec 76 + amendments + wiring + sweep) squash `9346963`.
- **Live rigour gates:** 3-specialist suite (security · correctness · style) + Fitness functions workflow + dual-persona plan-time review + **NEW category-aware specialist routing in `auto-review.yml`** (substitute prototype-readiness for correctness when slice resolves to `category: prototype`). All gates pass clean against current src/ at wrap.
- **Persona retain/drop measurement** cumulative through session 75: reviewer-correctness **24/10 STRONG retain** (no new findings session 75 — first run inconclusive; second run 0 findings on a control-plane PR is appropriate-silence) · reviewer-style **18/10 STRONG retain** (+1 session 75 — F-PA3 suffix in shellspec describe; real CLAUDE.md L215-222 anti-pattern catch in the very PR amending the rule) · reviewer-security **7/10 STRONG-candidate** (+1 session 75 advisory note re aggregator env-var defense; future-proofing not current vulnerability — debatable whether it counts as a catch) · reviewer-architecture **DROPPED** session 70 · plan-architect **gathered F-PA3 real catch session 75** (`[slug]` parametric-route disambiguation) · reviewer-prototype-readiness **NEW** session 75 (no findings yet — fires from session 76 P1 onwards).
- **Architecture-review gap closure status** — **B+C+D 3/3 SHIPPED + spec 76 SHIPPED.** Full pre-impl rigour stack + category-aware post-PR rigour both operational.

### Next session (76) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. Wrap PR for session 75 should be merged at session-76 start; verify against live source.
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0.
3. **Run `npm install` if `node_modules/` is empty.**
4. **Confirm priority with user.** Default P0 = `S-PROTO-pre-signup-interview` step 1 (dialogue) + step 2 (canvas-prompts). User may redirect to alternative work if canvas creation isn't tractable yet (e.g. `S-PROTO-section-confirm` P2 less canvas-dependent; OR tackle deferred F-PA2 matrix-consistency fitness function from spec 76 §8; OR live-mode opt-in for `comment-review.sh` per constraint #39).
5. **Per-prototype workflow** (4-step loop): each prototype = dialogue → canvas-prompt-if-needed → absorb canvas output → construct clickable prototype.
6. **Phase C real-product slices DEFERRED** until Phase 3 patterns mature.
7. **CODEOWNERS solo-operator pattern (#25)** — src/ PRs may need admin-bypass merge.
8. **Constraints #29-#39** apply (full list in §"Negative constraints" above).
9. **PR-DoD literal-regex requirement:** PR bodies must literal-cite `docs/slices/S-XX/verification.md` (no brace expansion).
10. **Source-of-truth precedence rule** — when user's Claude AI Design canvas conflicts with spec, design canvas wins for visual + section structure.
11. **First src/ slice exercising `category: prototype`** is the calibration moment for `reviewer-prototype-readiness`. Each src/ slice's HANDOFF gains a `## Persona findings recorded` section per active persona — at P1 the active set is 5 (correctness, style, security, plan-architect, prototype-readiness) since prototype-readiness substitutes for correctness when slice resolves to category=prototype.
12. **Constraint #39 mitigation candidate:** consider opting into `comment-review.sh` live-mode (`COMMENT_REVIEW_SPAWN=1`) for any PR that touches CLAUDE.md anti-pattern rules — would catch instance-of-rule-in-rule-amendment-PR at author-time.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-75 additions:

```
docs/workspace-spec/76-prototype-mode-rigour.md                — Spec 76 (NEW; canonical per-category gate-behaviour matrix in §3; PR #125)
.claude/agents/reviewer-prototype-readiness.md                 — Prototype-readiness persona (NEW; substitutes reviewer-correctness for category=prototype; PR #125)
docs/HANDOFF-SESSION-75.md                                     — session 75 retro (NEW)
```

Session-75 updates (no removals):

```
CLAUDE.md                                                      — NEW §"Slice categories" pointer to spec 76 §3 + 13→14 reconcile L136+L255 (PR #125)
.claude/hooks/tdd-guard.sh                                     — Path-default-skip block for category=prototype with [slug] disambiguation (PR #125)
tests/shellspec/tdd-guard.spec.sh                              — 3 new fixtures (12-14): skip / enforce parametric / enforce hub (PR #125)
.github/workflows/auto-review.yml                              — Brief job category-detection + dimensions JSON output + matrix fromJSON + aggregator env-var pattern (PR #125)
.github/PULL_REQUEST_TEMPLATE.md                               — 13→14 reconcile + DoD-14 short-form rendering note for category=prototype (PR #125)
vitest.config.ts                                               — coverage.exclude for literal-slug prototype paths (PR #125)
docs/slices/S-PROTO-hub/acceptance.md                          — **Category:** production override (PR #125; calibration cohort row 1 keeps production rigour)
```

## Rigour-suite completeness (layman summary)

| Programme | Status | Sessions | Key artefacts on main |
|---|---|---|---|
| **v3a-foundation** | ✅ SHIPPED | 33-41 (PR #24) | `verify-slice.sh`, `tdd-first-every-commit`, plan-time gate |
| **v3b subagent suite** | ✅ SHIPPED + REDUCED | 41-48 + 54-55 + 70 + 71 | Multi-agent suite live on main; 3 specialist personas + acceptance-gate + ux-polish-reviewer + reviewer-comment |
| **v3c efficiency layer** | ✅ MOSTLY SHIPPED | 50-58 + 60 + 70 + 71 | k=2 default, anti-pattern catalogue, differential mode, per-specialist filter, schema validation, author-time comment review, plan-review default-spawn, synthetic-deliberate-injection per-persona fixtures |
| **v3c carry-overs** | 🔵 OUT OF SCOPE | — | Stryker mutation · property-based fuzz · multi-provider 3rd reviewer · live persona drift cron |
| **B+C+D pre-impl rigour** | ✅ **3/3 SHIPPED** (sessions 72+73) | 72-73 | D test-pain gate · B fitness functions · C plan-architect persona |
| **Prototype-mode rigour (spec 76)** | ✅ **SHIPPED** (session 75) | 75 | Slice-category metadata + reviewer-prototype-readiness persona + atomic wiring (vitest, tdd-guard, auto-review.yml category routing, PR template). PR #125. |

**Net state at session-75 wrap:** logic-spec phase COMPLETE; B+C+D pre-impl rigour stack 3/3 OPERATIONAL; **prototype-mode rigour spec 76 OPERATIONAL** (calibration begins at first category=prototype slice ship — P1 pre-signup-interview).

## Session 76 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD                                                   # local
git rev-parse --short origin/main                                            # expected: post-session-75-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm session-75 PRs all merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
ls node_modules/.bin/vitest                                                  # expect file
ls node_modules/.bin/madge                                                   # expect file
ls docs/design-source/pre-signup-interview/                                  # check for new pre-signup canvas (P1 prerequisite)
ls .claude/agents/                                                           # confirm 6-persona suite incl. NEW reviewer-prototype-readiness.md
cat docs/workspace-spec/76-prototype-mode-rigour.md                          # spec 76 §3 canonical matrix (Tier 3 read when working on prototype)
grep -A2 "^## §" docs/workspace-spec/72c-multi-agent-review-framework.md     # spec 72c §9 calibration trigger verbatim
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 76?** Default P0 = `S-PROTO-pre-signup-interview` step 1+2 (dialogue + canvas-prompts). Alternatives: `S-PROTO-section-confirm` (P2; less canvas-dependent) · F-PA2 deferred matrix-consistency fitness function (spec 76 §8) · live-mode opt-in for `comment-review.sh` (constraint #39 mitigation).
2. **Has user uploaded `docs/design-source/pre-signup-interview/` canvas yet?** If no, P1 limited to step 1+2 (no construct yet); session 77+ for construct.
3. **CODEOWNERS solo-operator pattern (#25).** src/ PRs may need admin-bypass merge.
4. **k=2 default + 3-specialist suite calibration.** n=44 PRs cumulative. **Category-aware routing operational** as of session 75: prototype slices run security + prototype-readiness + style.
5. **Persona retain/drop measurement.** reviewer-correctness 24/10 STRONG retain · reviewer-style 18/10 STRONG retain (+1 session 75) · reviewer-security 7/10 STRONG-candidate · reviewer-architecture DROPPED · plan-architect (gathered F-PA3 real catch session 75) · reviewer-prototype-readiness NEW (fires from P1 forward).
6. **Cohesive-product trajectory.** Logic-spec phase COMPLETE; B+C+D + spec 76 OPERATIONAL. Next: P1 pre-signup-interview (canvas-blocked) → calibration cohort row 2.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Quote, don't paraphrase, when invoking a spec.** Constraint #29 codified.
- **Pre-priority shipped-artifact verification.** `ls docs/slices/` + `git log --grep` before treating fresh-build framing as authorized.
- Live gates: `auto-review.yml` (k=2 + 3 specialists + differential mode + per-specialist filter + design-source path-ignore + diff-exclude + **NEW category-aware specialist routing per spec 76 §3**) · `eslint-no-disable.yml` · `coverage-threshold.yml` · `pr-dod.yml` · `.github/CODEOWNERS` · `persona-fixtures.yml` + `persona-synthetic-fixtures.yml` (3 dimensions) · `shellspec.yml` · `comment-review.sh` PostToolUse advisory · `tdd-guard.sh` 4-state runner detection + **NEW path-default-skip for category=prototype** · `auto-review-parse.sh` schema validation · `fitness-functions.yml` (rules 1-5 per spec 72d §4).
- **Verification.md is final-state** (constraint #27).
- **Don't freeze AC text more ambitious than impl budget** (constraint #28).
- Constraints #29-#39 apply (see §"Negative constraints").
- Auto-review iteration stop-signal: at k=2 + 3 specialists + differential mode + per-specialist filter, expect 1-2 rounds per PR. Hard-cap at 4 rounds.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Verdict vocabulary:** Conventional Comments labels + `(blocking)`. Personas emit findings; orchestrator derives verdict via `scripts/derive-verdict.sh --multi k=2`.
- **Slice categories (NEW spec 76):** path-default OR explicit `**Category:** ...` override in `acceptance.md`; production rigour by default; prototype rigour relaxes code-rigour gates while preserving UI/UX rigour; infrastructure rigour mirrors production.
