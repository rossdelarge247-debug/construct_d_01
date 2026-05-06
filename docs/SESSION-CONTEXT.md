# Session 71 Wrap Context Block (heading into session 72)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-71 accomplished (rolling window)

> **Session 71 (this wrap):** **2 substantive PRs merged sequentially from `claude/resume-decouple-session-71-V8VF2`.** **PR #114** (P0+P1 combined, squash `7ecc749`) — spec 67a respondent state machine (145L) defining 23 states across 3 phases of Mark's invited-respondent journey per spec 67 §"Gap 7" locks G7-1..G7-5; spec 67 cross-refs (+3/-1) per Constraint #33; spec 75 account administration V1 minimum (130L) covering Settings + Notifications + Account profile sub-domains. 2 rounds clean. Closes 2 of 4 logic-spec gaps from session-69 audit (3rd and 4th — completing the logic-spec phase). **PR #115** (P2 control-plane drift, squash `150e03f`) — drop architecture from 3-specialist suite. 5 batched commits, 12 files: scripts (preflight-review · validate-finding-envelope · auto-review-filter-prior); 6 persona files (reviewer-{security,correctness,style,comment} + acceptance-gate + ux-polish-reviewer); schema (finding-envelope.schema.json); 3 shellspec tests. 1 round (single-specialist non-blocking; k=2 approve). Tightens 3-specialist suite enforcement; prevents silent drift. **n=38 PRs cumulative; mean 1.65 rolling.** Constraint #34 vindicated twice (P0 paired-spec amendment + P2 catalogue 3-4× wider than kickoff). **Architecture-review gap acknowledged + B+C+D plan agreed for session 72** (D test-pain gate; B fitness functions per Neal Ford *Building Evolutionary Architectures*; C plan-architect persona per aider `--architect` + Cline Plan/Act + pair-programming research).

> **Session 70:** **2 substantive PRs merged sequentially.** PR #111 (P0+P1) — spec 74 AI plan generation + spec 65a sign-up + orientation reconciliation. PR #112 (P-ish) — drop reviewer-architecture across 4 rounds. n=2 mean 3.0 rounds. Reviewer-architecture DROPPED at 2/14 = 0.143.

> **Session 69:** **2 substantive PRs.** PR #106 typographic hero swap; PR #107 workbench mutations refactor. P2 SKIPPED (lockfile-divergence guard). Session-69 ext design-input audit identified 4 logic-spec gaps + 5 canvas gaps.

> **Session 68:** 5 substantive PRs (#100-#104). n=5 mean 1.4 rounds.

> **Session 67:** S-M1.0a 9 hero variants closed on main. n=3 mean 1.67 rounds.

> **Session 66:** S-M1 marketing landing closed. First cohesive Vercel preview LIVE on main.

> **Session 65 (partial S-M1 ship):** PR #89 cherry-pick + Phase 1-3 shipped.

- **Sessions 41-46:** v3b S-1 through S-5 (PRs #25-#27).
- **Session 47:** v3b S-6 (PR #30; auto-review.yml + 3 personas live).
- **Session 48:** v3b S-7 + S-8 setup + v3c stub (PRs #32-#34).
- **Session 49:** v3c rubric extension + spec 72c §5/§7/§10 prior-art amendments.
- **Session 50:** 6 PRs (#36-#42).
- **Session 51:** Rigour-suite session 1 of 3 (PRs #44-#47).
- **Session 52:** PR #50 promoted parse-failed + pipeline-crash to `failure`; PR #49 §Exceptions extraction.
- **Session 53:** PR #52 P0b-structural — CODEOWNERS migration; pre-commit-verify deprecation.
- **Session 54:** PR #54 v3b S-8 design contract realigned. 4 specialist personas (since reduced to 3 at session 70) + `--multi k=N` quorum mode.
- **Session 55:** PRs #56 + #57 — AC-1 v6 fan-out + AC-5 retirement; AC-3 differential mode + AC-4 golden-PR replay seed.
- **Session 56:** 3 PRs — #59 k=2 default flip; #60 anti-pattern catalogue + DoD #1; #61 §"Not yet in scope" rewrite.
- **Session 57:** 3 PRs — #63 differential-mode loop; #64 F5c origin/main-anchored ratchet; #65 pre-flight self-review.
- **Session 58:** 5 PRs (#67-#71). n=5 mean 1.4 rounds.
- **Session 59:** PR #73 drift correction + PR #74 S-F3-phase-nav (4 rounds).
- **Session 60:** 3 infra PRs (#76 reviewer-comment; #77 tdd-guard-first-creation; #78 parse-pipeline-schema-validation).
- **Session 61:** PR #80 S-F4 trust chip + #81 plan-review default-spawn flip.
- **Session 62:** PR #83 S-F7-β rebase via cherry-pick replay. AC-4 retain/drop dataset 3/3.
- **Session 63:** PR #85 synthetic-deliberate-injection per-persona fixtures.
- **Session 64:** PR #87 S-F2-document-shell. First reviewer-architecture catch in 5 src+infra slices.

## Current state

### Locked (through session 71)

- 5-phase journey (Start · Build · Reconcile · Settle · Finalise) per spec 42.
- Document-as-spine (4-doc lifecycle) per spec 44.
- Hub + 68a-e locked decisions; 68f/g registers carry opens.
- Spec 70 Build Map: 33-slice catalogue + S-TOOL/S-INFRA families.
- Spec 71 §7a Option 4: single-branch-main; no integration branch; no cutover event.
- Spec 72: 13-item per-slice security checklist; CI gates.
- **Hook + CI enforcement (post-PR-52 simplified):** SessionStart · PostToolUse Write/Edit · PreToolUse Read · PreToolUse ExitPlanMode (exit-plan-review). `.github/CODEOWNERS` is sole control-plane gate for protected paths.
- Stripe SDK pinned `^22.1.0`. Both lockfiles aligned (bar 60+ pre-existing transitive divergences per session 69 P2 finding).
- **v3a-foundation shipped** (PR #24 merged session 41).
- **v3b FULLY SHIPPED** — multi-agent suite is the live review path on main.
- **v3c shipped** — sessions 50+51+52+53 batch landed + session-54 spec amendment + session-55 multi-agent ship + session-56 k=2 default + session 70 drop verdict.
- **Spec 74 AI plan generation LOCKED** (session 70).
- **Spec 65a sign-up + orientation reconciliation LOCKED** (session 70).
- **Multi-agent suite reduced 4 → 3 specialists** (session 70). `[security, correctness, style]`. `reviewer-architecture` retired.
- **Spec 67a respondent state machine LOCKED** (session 71 PR #114). 23 states across Phase 1 pre-account / Phase 2 Mark builds picture / Phase 3 reconciliation entry; G7-1..G7-5 verbatim; 14-day link-expiry rules; 8 edge cases.
- **Spec 75 account administration V1 LOCKED** (session 71 PR #114). §A Settings (email/password/delete) + §B Notifications (email-only V1; 11 transactional events) + §C Account profile (read-only V1).
- **Logic-spec phase COMPLETE** — all 4 audit gaps closed across sessions 70+71.
- **3-specialist suite drift cleanup SHIPPED** (session 71 PR #115). Validator + filter scripts now enforce 3-specialist suite; persona files no longer reference dropped reviewer-architecture; schema enum + sub-category default reflect 3 specialists; shellspec fixtures use real specialists only.

### Built (on main as of `150e03f`; **session 71 ships 2 doc-only logic specs (67a + 75) + 3-specialist suite drift cleanup** via PR #114 + PR #115)

```
docs/workspace-spec/67a-respondent-state-machine.md               — Respondent state machine logic spec (NEW; PR #114)
docs/workspace-spec/75-account-administration.md                  — Account administration V1 minimum (NEW; PR #114)
docs/workspace-spec/67-post-signup-profiling-progress.md          — Cross-refs updated (§step-2 supersession + §Downstream work; PR #114)
schemas/finding-envelope.schema.json                              — UPDATED enum + descriptions (PR #115)
.claude/agents/{reviewer-security,reviewer-correctness,reviewer-style,reviewer-comment,acceptance-gate,ux-polish-reviewer}.md — UPDATED to drop architecture references (PR #115)
scripts/{preflight-review,validate-finding-envelope,auto-review-filter-prior}.sh — UPDATED to enforce 3-specialist suite (PR #115)
tests/shellspec/{derive-verdict,validate-finding-envelope,auto-review-filter-prior}.spec.sh — UPDATED fixtures (PR #115)
src/components/marketing/heroes/{...} — 9 hero variants + barrel
src/app/dev/heroes/page.tsx — 9-hero gallery
src/components/marketing/{atoms,sections}/ — marketing atoms + sections (S-M1)
src/app/page.tsx + src/app/layout.tsx + src/app/start/{page,not-found}.tsx — marketing landing composition
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts — S-F7-α
src/lib/store/{dev-store,index,scenario-loader,types}.ts — S-F7-α
src/app/globals.css + src/styles/tokens.ts + src/components/ui/button.tsx + tests/unit/tokens.test.ts — S-F1 design tokens
src/components/phase-nav/{...} + tests — S-F3 phase nav
src/components/document-shell/{...} + tests — S-F2 document shell
src/lib/stripe/client.ts + package.json + lockfiles — Stripe pin
.claude/hooks/{line-count,session-start,tdd-first-every-commit,exit-plan-review,read-cap,wrap-check,tdd-guard,pre-push-dod7,comment-review}.sh
.github/CODEOWNERS — control-plane gate
.github/workflows/{eslint-no-disable,pr-dod,shellspec,auto-review,gitleaks,ci,persona-fixtures,persona-synthetic-fixtures,coverage-threshold}.yml
docs/v2/v2-backlog.md — backlog (Total 99 items)
```

**Parked branches / queued slices:**
- `claude/S-F7-beta-impl` parked at `a3f67ec` — needs rebase against current main; queued for post-B+C+D ship.
- **S-M1.0b** (responsive design pass for marketing landing) — QUEUED. Mobile design canvas required first.
- **S-O1** (primary onboarding incl. pre-signup interview) — fully specced (spec 65 + 65a + 67 + 67a + 74); buildable when user-produced canvas at `docs/design-source/pre-signup-interview/{slug}/` lands.

## Session 72 priorities

Per architecture-review gap conversation in session 71: ship pre-implementation rigour additions BEFORE resuming src/ slice work. Sequencing: spec → D (cheapest) → B (mechanical) → C (judgement).

### P0 — Spec the B+C+D contracts (~150-300L)

New spec or amendments. One combined spec is cleaner; alternative is amendments split across 72c (C persona contract), 71 §4 (B invariants), CLAUDE.md §"Engineering conventions" (D test-pain gate). Document the contract for D + B + C. Output likely `72d-architecture-review-additions.md` or amendments-only — verify next-available number.

### P1 — Ship D (test-pain gate; cheapest infra)

CLAUDE.md §"Engineering conventions" amendment + DoD checklist add. Zero new infra. Rule: when a unit test requires mocking the world, the seam is wrong; per-slice DoD gates "test-pain audit — >2 mock setups triggers architectural step-back." Aligned with classical TDD (Beck; Freeman + Pryce *GOOS*; Hillel Wayne). Pain-signal accumulates immediately as future src/ slices ship.

### P2 — Ship B (fitness functions)

ESLint custom rules + `madge` (or `dependency-cruiser`) CI step encoding spec 71 §4 hexagonal invariants. Examples: "`src/lib/bank` doesn't import `src/components`"; "`src/lib/ai` consumers go through interfaces". Mechanical floor; runnable assertions. Per Neal Ford *Building Evolutionary Architectures*.

### P3 — Ship C (`plan-architect` persona)

New `.claude/agents/plan-architect.md` persona + extend `.claude/hooks/exit-plan-review.sh` to spawn it. Pre-code architectural review: "what seams will this need? what hides effects? what coupling will we regret?" Highest ROI per pair-programming research (Williams + Kessler) + aider `--architect` + Cline Plan/Act prior art. Most cost (~£0.10-0.30 per spawn); ships last so it benefits from B+D already running.

### P4 — Resume canvas-gated + S-F7-beta unpark

Once B+C+D ship, rigour stack ready for src/. Then: S-F7-beta rebase from `a3f67ec` against current main (8 ahead / 49 behind main per kickoff archive); S-O1 if pre-signup canvas appears at `docs/design-source/pre-signup-interview/{slug}/`; S-M1.0b if mobile canvas appears at `docs/design-source/marketing-landing/{slug}/`.

### Cohesive-product trajectory (post-session-71)

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
- ⏳ Pre-implementation rigour additions B+C+D — session 72 P0-P3
- ⏳ Mobile-responsive marketing landing — gated on mobile canvas
- ⏳ Pre-signup interview build — gated on canvas
- 4-5 sessions to user-testable Build phase end-to-end (post-B+C+D)
- 9-12 sessions to all 5 phases minimally populated
- 17+ sessions to production-grade

### Synthetic-deliberate-injection gate POST SESSION-71

Live persona regression detection operational (PR #85, session 63). Fires for **3 personas** (security · correctness · style) post session-70 drop. Every persona/orchestrator/synthetic-content change triggers 3× live `claude -p` invocations and asserts each persona flags its dimension's planted defect. Architecture fixture removed (session 70). PR #115 confirmed clean run.

## Scope ceiling

Single-P0 session. Don't add adjacent slice work; don't refactor; don't reskin. If session hits the 1500-line warn mid-impl, **stop and re-slice** — ship what's complete + carry rest. Don't push past 2000. Bias toward 2-3 substantive PRs + room for review iteration on `src/` work.

## Negative constraints (preserve from session 36)

1. Do NOT frame Decouple as a "financial disclosure tool." Spec 42 complete-settlement-workspace framing is load-bearing.
2. Phase-C-freeze model RETIRED (session 24 Option 4). Single-branch-main; no integration branch; no cutover event.
3. Do NOT re-introduce any file from the wiped V1 tree (`src/components/workspace/*` etc.).
4. Do NOT re-open 68a-e locked decisions unless new evidence surfaces. Same for 68g C-U4/U5/U6 (locked session 28).
5. Do NOT read pre-pivot specs (03-06, 11, 12). Active framing: 42, 44, 65, 65a, 67, 67a, 68, 68a-g, 70, 71, 72, 72a/b/c, 73, 74, 75.
6. `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` mandatory in Production (spec 72 §2 + §7). CI gate enforces.
7. Read discipline enforced by `.claude/hooks/read-cap.sh`: full-file Reads of >400-line files blocked without offset+limit; per-turn total >300 blocked.
8. V1 legacy palette gone. Visual canonical = Claude AI Design tool outputs (session 22).
9. Safeguarding V1 = signposting + baseline (spec 67 Gap 11, spec 72 §9).
10. Identity verification waits until consent-order stage.
11. **MLP not MVP** — scope decisions per slice framed as "what the *loveable* version requires". Users in crisis.
12. AI extracts facts, app generates questions — never put reasoning in AI extraction schemas.
13. Anthropic SDK uses `output_config.format` (not `response_format`). All JSON schemas need `additionalProperties: false`. SDK timeout 90s; route maxDuration 300s.
14. CLAUDE.md moratorium: lift after 2 clean uses.
15. Don't treat failing tests as spec.
16. Don't trust kickoff-prompt factual claims without live verification. SessionStart hook surfaces live branch state; use it.
17. DoD CI gate enforces slice-verification on src/ PRs.
18. Spec 73 copy patterns are mandatory for user-facing strings.
19. Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
20. Dual-lockfile divergence guard (S-INFRA-1 session 35).
21. **Rigour > speed.** Adversarial subagent reviews used at relevant points. **No checkbox theatre** — every adversarial finding addressed or explicitly deferred with reasoning.
22. Rigour-pivot programme: v3a-foundation SHIPPED · v3b-subagent-suite SHIPPED · v3c-quality-and-rewrite SHIPPING.
23. **(session 50): Rebase-on-main as habit before opening any 2nd+ PR in a multi-PR session.**
24. **(session 50): Don't cite forward-looking schema/labels/SHAs.** Cite current-main state only.
25. **(session 53): Solo-operator code-owner dynamic.** CODEOWNERS gate self-deadlocks for solo operator. Admin-bypass per merge becomes the conscious-act rigour layer.
26. **(session 53): AC-drafting style smell.** Don't draft AC verification steps as literal grep checks; use semantic checks.
27. **(session 55): `verification.md` is final-state, not a running log.** Round-by-round multi-agent log lives in HANDOFF/PR-description.
28. **(session 55): Don't freeze AC text more ambitious than the implementation budget.** Reaffirmed session 67.
29. **(session 58): Pre-priority spec-gate verification.** Before treating "per spec X §Y" priority as authorized, grep that section's gating IF-clauses verbatim.
30. **(session 67): Naming-rule consistency must apply to all variants in one batch.**
31. **(session 68): Pre-priority carry-over framing verification.** Before treating a multi-session carry-over as "deferred again", grep for the live state and confirm the kickoff framing matches reality.
32. **(session 68): Transitive-bump trade-off matrix.**
33. **(session 70): Spec amendments claiming impl facts MUST update impl files in the same PR.** Validated again session 71 PR #114 (67a + spec 67 cross-refs paired in same PR; no round-2 finding).
34. **(session 70): Control-plane changes (`.claude/agents/`, `.github/workflows/`, `scripts/`, `CLAUDE.md` Hard controls, spec 72c) have wider blast radius than initial estimate.** Vindicated again session 71 PR #115 (kickoff scoped 5 files; actual catalogue 12 files).

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct, Verdict vocabulary (Conventional Comments).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · spec 72a/b/c · spec 73 · spec 74 · spec 75 · `docs/slices/S-INFRA-rigour-v3{a,b}-*/acceptance.md`.
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 65 · spec 65a · spec 67 · spec 67a · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`.

## Branch

### Branch state at session-71 wrap (verified live)

- **Wrap branch:** `claude/resume-decouple-session-71-V8VF2` (sequential single-branch pattern continues; 18 sessions in a row 54→…→71).
- **`main` tip:** `150e03f` (post-PR-#115 merge — 3-specialist suite drift cleanup).
- **Open PRs at session-71 wrap:** wrap PR opens after this commit. None other open at wrap.
- **Closed/merged this session:** PR #114 (P0+P1 combined) squash `7ecc749`; PR #115 (P2 control-plane drift cleanup) squash `150e03f`.
- **Live rigour gates:** 3-specialist suite tightened (validator + filter + schema + persona files + shellspec fixtures all enforce / reflect 3 specialists post PR #115). Synthetic-deliberate-injection gate fires for 3 personas. Spec 72c + CLAUDE.md §"Hard controls" reflect the partition. Historical golden fixtures + CLAUDE.md historical-lineage refs intentionally retained.
- **Persona retain/drop measurement** cumulative through session 71: reviewer-correctness 16/10 STRONG retain (+4 new findings session 71) · reviewer-style 14+/10 STRONG retain (no new findings session 71) · reviewer-security 5/10 MODERATE retain (no new findings session 71) · reviewer-architecture **DROPPED** session 70 at 2/14 = 0.143.
- **Architecture-review gap acknowledged** — distributed and partial post drop. Session 72 ships B+C+D pre-implementation rigour additions before src/.

### Next session (72) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. Wrap PR for session 71 should be merged at session-72 start; verify against live source.
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Sequential single-branch pattern continues — `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.
3. **Run `npm install` if `node_modules/` is empty.** TDD-guard DEGRADED detection emits a graceful skip note when vitest is absent.
4. **Confirm priority with user.** P0 = **Spec the B+C+D contracts (~150-300L)**. P1 = ship D (test-pain gate). P2 = ship B (fitness functions). P3 = ship C (plan-architect persona). P4 = resume canvas-gated work + S-F7-beta unpark.
5. **If P0 (B+C+D contracts spec):** decide structure (single new spec like `72d-architecture-review-additions.md` OR amendments split across 72c + 71 §4 + CLAUDE.md §"Engineering conventions"). Read the relevant sections before drafting. Pre-priority spec-gate verification per Constraint #29.
6. **If P1 (ship D test-pain gate):** CLAUDE.md §"Engineering conventions" amendment + DoD checklist add. Zero infra. Aligned with TDD ideals (Beck, GOOS, Wayne).
7. **If P2 (ship B fitness functions):** ESLint custom rules + `madge`/`dependency-cruiser` CI step encoding spec 71 §4 hexagonal invariants.
8. **If P3 (ship C plan-architect persona):** new `.claude/agents/plan-architect.md` + extend `.claude/hooks/exit-plan-review.sh`. Pair-programming + aider/Cline plan-mode prior art.
9. **CODEOWNERS solo-operator pattern (#25)** — control-plane PRs touch protected paths; admin-bypass merge expected.
10. **Constraint #29 (pre-priority spec-gate verification):** before treating any "per spec X §Y" priority as authorized, grep that section's gating IF-clauses verbatim.
11. **Constraint #31 (pre-priority carry-over framing verification):** before treating a multi-session carry-over as "deferred again", grep for the live state.
12. **Constraint #33 (spec amendments claiming impl facts):** must update impl files in same PR.
13. **Constraint #34 (control-plane wider blast radius):** B+C+D PRs are control-plane. Estimate at catalogue level (grep all references) before sizing.
14. **PR-DoD literal-regex requirement:** PR bodies must literal-cite `docs/slices/S-XX/verification.md` (no brace expansion).
15. **Source-of-truth precedence rule** — when user's Claude AI Design canvas conflicts with spec, design canvas wins for visual + section structure.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-71 additions:

```
docs/workspace-spec/67a-respondent-state-machine.md             — Respondent state machine logic spec (NEW; PR #114)
docs/workspace-spec/75-account-administration.md                — Account administration V1 minimum (NEW; PR #114)
docs/HANDOFF-SESSION-71.md                                      — session 71 retro (NEW)
```

Session-71 updates (no removals):

```
docs/workspace-spec/67-post-signup-profiling-progress.md        — Cross-refs (§step-2 supersession + §Downstream work; PR #114)
schemas/finding-envelope.schema.json                            — UPDATED enum + descriptions for 3-specialist suite (PR #115)
.claude/agents/{6 persona files}                                — UPDATED to drop architecture references (PR #115)
scripts/{preflight-review,validate-finding-envelope,auto-review-filter-prior}.sh — UPDATED enforcement (PR #115)
tests/shellspec/{derive-verdict,validate-finding-envelope,auto-review-filter-prior}.spec.sh — UPDATED fixtures (PR #115)
```

## Rigour-suite completeness (layman summary)

| Programme | Status | Sessions | Key artefacts on main |
|---|---|---|---|
| **v3a-foundation** | ✅ SHIPPED | 33-41 (PR #24) | `verify-slice.sh`, `tdd-first-every-commit`, plan-time gate |
| **v3b subagent suite** | ✅ SHIPPED + REDUCED | 41-48 + 54-55 + 70 + **71** | Multi-agent suite live on main; **3 specialist personas post drop** + acceptance-gate + ux-polish-reviewer + reviewer-comment; drift cleanup PR #115 |
| **v3c efficiency layer** | ✅ MOSTLY SHIPPED | 50-58 + 60 + 70 + **71** | k=2 default, anti-pattern catalogue, differential mode, per-specialist filter, schema validation, author-time comment review, plan-review default-spawn, synthetic-deliberate-injection per-persona fixtures (3 dimensions), drift cleanup |
| **v3c carry-overs** | 🔵 OUT OF SCOPE | — | Stryker mutation · property-based fuzz · multi-provider 3rd reviewer · live persona drift cron |
| **B+C+D pre-impl rigour** | ⏳ QUEUED for session 72 | 72+ | D test-pain gate · B fitness functions · C plan-architect persona |

**Net state at session-71 wrap:** logic-spec phase COMPLETE (4/4 audit gaps closed sessions 70+71); 3-specialist suite drift cleanup SHIPPED; rigour-suite v3b complete + v3c efficiency layer substantially advanced; architecture-review gap acknowledged + B+C+D plan agreed for session 72 before any src/ touch.

## Session 72 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD origin/main                                       # expected: post-session-71-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm session-71 PRs all merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
ls node_modules/.bin/vitest                                                  # expect file; if absent, npm install
ls docs/design-source/marketing-landing/                                     # check for new mobile canvas (S-M1.0b prerequisite)
ls docs/design-source/pre-signup-interview/                                  # check for new pre-signup canvas (S-O1 build prerequisite)
ls docs/workspace-spec/ | grep -E "^7[2-5]"                                  # confirm 67a + 75 on main; check next-available number for B+C+D spec
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 72?** P0 = spec B+C+D contracts (~150-300L). P1 = ship D test-pain gate. P2 = ship B fitness functions. P3 = ship C plan-architect persona. P4 = resume canvas-gated + S-F7-beta unpark.
2. **B+C+D structure decision.** One combined spec (`72d-architecture-review-additions.md`) OR amendments split (72c §C-persona, 71 §4 invariants, CLAUDE.md §"Engineering conventions" §test-pain).
3. **CODEOWNERS solo-operator pattern (#25).** B+C+D PRs are control-plane; admin-bypass merge expected.
4. **k=2 default + 3-specialist suite calibration.** n=38 PRs cumulative post session-71. Mean 1.65 rolling. Logic-spec PRs ran clean; first src/ slice (post-B+C+D) is the next calibration point.
5. **Persona retain/drop measurement.** Reviewer-correctness 16/10 STRONG retain. Reviewer-style 14+/10 STRONG retain. Reviewer-security 5/10 MODERATE retain. Reviewer-architecture DROPPED (session 70). Real test of correctness's expanded rubric (criterion 7 hidden-effects + criterion 2 architectural-severity) on first src/ slice — if catch-rate falls, spec 72c §9 expansion path fires.
6. **Cohesive-product trajectory.** Logic-spec phase COMPLETE. Pre-implementation rigour adds (B+C+D) before src/. Then S-F7-beta unpark + canvas-gated work resumes.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Quote, don't paraphrase, when invoking a spec.** Constraint #29 codified.
- **Pre-priority shipped-artifact verification.** `ls docs/slices/` + `git log --grep` before treating fresh-build framing as authorized.
- Live gates: `auto-review.yml` (k=2 + 3 specialists + differential mode + per-specialist filter + design-source path-ignore + diff-exclude) · `eslint-no-disable.yml` · `coverage-threshold.yml` · `pr-dod.yml` · `.github/CODEOWNERS` · `persona-fixtures.yml` + `persona-synthetic-fixtures.yml` (3 dimensions) · `shellspec.yml` · `comment-review.sh` PostToolUse advisory · `tdd-guard.sh` 4-state runner detection · `auto-review-parse.sh` schema validation.
- **Verification.md is final-state** (constraint #27).
- **Don't freeze AC text more ambitious than impl budget** (constraint #28).
- **Pre-priority spec-gate verification** (constraint #29).
- **Naming-rule consistency batch** (constraint #30).
- **Carry-over framing verification** (constraint #31).
- **Transitive-bump trade-off matrix** (constraint #32).
- **Spec amendment claims impl facts (constraint #33)** — must update impl files in same PR.
- **Control-plane wider blast radius (constraint #34)** — estimate at catalogue level before sizing. B+C+D PRs are control-plane.
- Auto-review iteration stop-signal: at k=2 + 3 specialists + differential mode + per-specialist filter, expect 1-2 rounds per PR. Hard-cap at 4 rounds.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Verdict vocabulary:** Conventional Comments labels + `(blocking)`. Personas emit findings; orchestrator derives verdict via `scripts/derive-verdict.sh --multi k=2`.
