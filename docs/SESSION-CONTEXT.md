# Session 70 Wrap Context Block (heading into session 71)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-70 accomplished (rolling window)

> **Session 70 (this wrap):** **2 substantive PRs merged sequentially from `claude/resume-decouple-session-70-9QKfT`.** **PR #111** (P0+P1 combined, squash `cfe11e9`) — spec 74 AI plan generation (305L final after round-2 substantive-intent amendment adding §"Free-plan framing" + §"Output substance" + §"Bridge to post-signup" + flag split + canonical resource list correction + slice naming correction) + spec 65a sign-up + orientation reconciliation (90L). Both doc-only logic specs filling explicit "needs spec" gaps from session-69 design-input audit. 2 rounds (clean approve both). **PR #112** (P-ish, squash `256014c`) — drop `reviewer-architecture` (4→3 specialists). 4 commits across 4 rounds: round 1 load-bearing (workflow + scripts + persona + 2 synthetic fixture deletes); round 2 doc-drift cleanup (spec 72c + CLAUDE.md + slice acceptance + synthetic README); round 3 shellspec test alignment + reviewer-correctness rubric absorption (criterion 7 hidden-effects + criterion 2 architectural-severity variant per spec 72c §4 amendment); round 4 reviewer-style fix (temporal provenance in test comment). Post-pivot 3-specialist suite caught 2 substantive findings on PR #112 itself (correctness AC-gap + style provenance) — meta-bootstrap validates the framework reviews itself. **Reviewer-architecture DROPPED** at cumulative 2/14 = 0.143 (well below 0.33 retain bar). **n=2 calibration:** mean **3.0 rounds** (PR #111 mean 2.0; PR #112 mean 4.0 — control-plane wider blast radius than kickoff XS sizing). Lessons: spec amendments claiming impl facts must update impl files in same PR; meta-bootstrap reviewing-the-change-reviewing-itself works; drop verdict execution validates the measurement framework; control-plane changes have wider blast radius than initial estimate; two-commit structure (load-bearing first, doc-drift second) for control-plane PRs.

> **Session 69:** **2 substantive PRs merged sequentially from `claude/resume-decouple-session-69-uWwQ3` + P4 decision-doc + wrap PR + design-input audit ext.** **PR #106** (P0-alt) `'declarative' → 'typographic'` hero swap. **PR #107** (P1) workbench mutations refactored to immutable + lint exclusion drop. **P2 SKIPPED (path 3)** lockfile-divergence guard surfaced 60+ existing transitive divergences invalidating clean-baseline assumption. **P4 + wrap PR + audit ext** (#108-#110). **Session-69 ext:** post-wrap pivot to design-input audit (`docs/design-input-audit.md`); identified 4 logic-spec gaps + 5 canvas gaps; recommended hybrid 3-phase approach (logic specs + canvas + `/dev/proto/*` for complex patterns).

> **Session 68:** 5 substantive PRs (#100-#104). PR #100 hero swap to declarative. PR #101 TDD-guard runner-states. PR #102 react-hooks 7.0.1→7.1.1 dual-lockfile sync. PR #103 stale CLAUDE.md ref strike. PR #104 comment-review HANDOFF/SESSION-CONTEXT skip-list. n=5 mean 1.4 rounds.

> **Session 67:** S-M1.0a 9 hero variants closed on main (#96/#97/#98). PR #96 honest-framing on S-M1 AC-9 mobile-viewport observed-fail. n=3 mean 1.67 rounds.

> **Session 66:** S-M1 marketing landing closed (#92/#93/#94). First cohesive Vercel preview LIVE on main.

> **Session 65 (partial S-M1 ship):** PR #89 cherry-pick + Phase 1-3 shipped.

- **Sessions 41-46:** v3b S-1 through S-5 (PRs #25-#27).
- **Session 47:** v3b S-6 (PR #30; auto-review.yml + 3 personas live).
- **Session 48:** v3b S-7 + S-8 setup + v3c stub (PRs #32-#34).
- **Session 49:** v3c rubric extension + spec 72c §5/§7/§10 prior-art amendments.
- **Session 50:** 6 PRs (#36-#42); 72c §9 cross-ref, criterion 2 §Exceptions, citations, slice-resolver fix, §Exception (e), Conv Comments verbatim, fix-up.
- **Session 51:** Rigour-suite session 1 of 3 (PRs #44-#47).
- **Session 52:** PR #50 promoted parse-failed + pipeline-crash to `failure`; PR #49 §Exceptions extraction.
- **Session 53:** PR #52 P0b-structural — CODEOWNERS migration; pre-commit-verify deprecation.
- **Session 54:** PR #54 v3b S-8 design contract realigned. 4 specialist personas (since reduced to 3 at session 70) + `--multi k=N` quorum mode.
- **Session 55:** PRs #56 + #57 — AC-1 v6 fan-out + AC-5 retirement; AC-3 differential mode + AC-4 golden-PR replay seed.
- **Session 56:** 3 PRs — #59 k=2 default flip; #60 anti-pattern catalogue + DoD #1; #61 §"Not yet in scope" rewrite.
- **Session 57:** 3 PRs — #63 differential-mode loop; #64 F5c origin/main-anchored ratchet; #65 pre-flight self-review.
- **Session 58:** 5 PRs (#67-#71). n=5 mean 1.4 rounds.
- **Session 59:** PR #73 drift correction + PR #74 S-F3-phase-nav (4 rounds).
- **Session 60:** 3 infra PRs (#76 reviewer-comment; #77 tdd-guard-first-creation; #78 parse-pipeline-schema-validation). n=3 mean 3.33 rounds.
- **Session 61:** PR #80 S-F4 trust chip + #81 plan-review default-spawn flip.
- **Session 62:** PR #83 S-F7-β rebase via cherry-pick replay. AC-4 retain/drop dataset 3/3 → spec 72c §7 first-3-src-slice gate CONFIRMED.
- **Session 63:** PR #85 synthetic-deliberate-injection per-persona fixtures.
- **Session 64:** PR #87 S-F2-document-shell. First reviewer-architecture catch in 5 src+infra slices (page-wrapper scope-creep) — turned out to be the only substantive arch catch in the dataset that drove the session-70 drop verdict.

## Current state

### Locked (through session 70)

- 5-phase journey (Start · Build · Reconcile · Settle · Finalise) per spec 42.
- Document-as-spine (4-doc lifecycle) per spec 44.
- Hub + 68a-e locked decisions; 68f/g registers carry opens.
- Spec 70 Build Map: 33-slice catalogue + S-TOOL/S-INFRA families.
- Spec 71 §7a Option 4: single-branch-main; no integration branch; no cutover event.
- Spec 72: 13-item per-slice security checklist; CI gates.
- **Hook + CI enforcement (post-PR-52 simplified):** SessionStart · PostToolUse Write/Edit · PreToolUse Read · PreToolUse ExitPlanMode (exit-plan-review). `.github/CODEOWNERS` is sole control-plane gate for protected paths.
- Stripe SDK pinned `^22.1.0`. Both lockfiles aligned (bar 60+ pre-existing transitive divergences per session 69 P2 finding; v2-backlog #74b sized impl path).
- **v3a-foundation shipped** (PR #24 merged session 41).
- **v3b FULLY SHIPPED** — multi-agent suite is the live review path on main.
- **v3c shipped** — sessions 50+51+52+53 batch landed + session-54 spec amendment + session-55 multi-agent ship + session-56 k=2 default + session 70 drop verdict.
- **Spec 74 AI plan generation LOCKED** (session 70 PR #111). Logic contract for O7 personalised-plan output of pre-signup interview spec 65.
- **Spec 65a sign-up + orientation reconciliation LOCKED** (session 70 PR #111). Resolves spec 65's open supersedes claim against specs 57 + 58.
- **Multi-agent suite reduced 4 → 3 specialists** (session 70 PR #112): `[security, correctness, style]`. `reviewer-architecture` retired per CLAUDE.md retain/drop metric. `reviewer-correctness` absorbed criterion 7 (hidden-effects) + criterion 2 architectural-severity variant.

### Built (on main as of `256014c`; **session 70 ships 2 doc-only logic specs (74 + 65a) + reviewer-architecture drop with 3-specialist suite live + reviewer-correctness rubric absorption** via PR #111 + PR #112)

```
docs/workspace-spec/74-ai-plan-generation.md                      — AI plan generation logic spec (PR #111)
docs/workspace-spec/65a-signup-orientation-reconciliation.md      — Sign-up + orientation register against specs 57 + 58 (PR #111)
docs/workspace-spec/72c-multi-agent-review-framework.md           — §3-§9 + §Status amendments for 3-specialist partition (PR #112)
src/components/marketing/heroes/{editorial,declarative,typographic,atmospheric,diagrammatic,product-forward,outcome-led,two-column,empathetic,index}.tsx — 9 hero variants + barrel
src/app/dev/heroes/page.tsx                                       — 9-hero gallery
src/components/marketing/{atoms,sections}/                        — marketing atoms + sections (S-M1)
src/app/page.tsx + src/app/layout.tsx + src/app/start/{page,not-found}.tsx — marketing landing composition + /start HTTP 404
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts          — S-F7-α
src/lib/store/{dev-store,index,scenario-loader,types}.ts          — S-F7-α
src/app/globals.css + src/styles/tokens.ts + src/components/ui/button.tsx + tests/unit/tokens.test.ts  — S-F1 design tokens
src/components/phase-nav/{...} + tests                            — S-F3 phase nav
src/components/document-shell/{...} + tests                       — S-F2 document shell
src/lib/stripe/client.ts + package.json + lockfiles               — Stripe pin
.claude/hooks/{line-count,session-start,tdd-first-every-commit,exit-plan-review,read-cap,wrap-check,tdd-guard,pre-push-dod7,comment-review}.sh
.github/CODEOWNERS                                                — control-plane gate
.github/workflows/{eslint-no-disable,pr-dod,shellspec,auto-review,gitleaks,ci,persona-fixtures,persona-synthetic-fixtures,coverage-threshold,control-change-label-deprecated}.yml
.claude/agents/reviewer-{security,correctness,style,comment}.md + acceptance-gate.md + ux-polish-reviewer.md  — 3-specialist multi-agent suite (post session-70 drop)
docs/v2/v2-backlog.md                                             — backlog (Total 99 items; #74a feature flag SDK; #74b single-lockfile policy)
```

**Parked branches / queued slices:**
- `claude/S-F7-beta-impl` shipped via session 62 PR #83 cherry-pick replay.
- **S-M1.0b** (responsive design pass for marketing landing) — QUEUED. Mobile design canvas required first per CLAUDE.md "Source-of-truth precedence".
- **S-O1** (primary onboarding incl. pre-signup interview) — fully specced (spec 65 + 65a + 67 + 74); buildable when user-produced canvas at `docs/design-source/pre-signup-interview/{slug}/` lands.

## Session 71 priorities

### P0 — Respondent state machine spec (logic) — S (~100-150L new spec doc)

IS1-IS6 + IS-Plan + 14-day link-expiry rules per spec 67 §"Gap 7" (RESOLVED conceptually; detailed wireframes deferred). Defines state transitions for Mark's (invited respondent) journey. No canvas needed — pure logic. Output: new spec under `docs/workspace-spec/`. Was P2 in session-70 list; promoted to P0 now that the higher-leverage AI plan + sign-up reconciliation specs are locked.

### P1 — Thin V1 specs: settings / notifications / account profile (logic) — XS-S each

Per session-69 audit: NOT SPECCED. Three short specs (~50-100L each) defining V1 minimum behaviour. Settings = email-change + delete-account; Notifications = email-only delivery; Account profile = read-only. Defers billing surface to V1.5 per v2-backlog #72. Was P3 in session-70 list.

### P2 — Validator + filter scripts hardcoded list cleanup (XS, ~30-50L)

`scripts/validate-finding-envelope.sh` L29-32 + `scripts/auto-review-filter-prior.sh` L31 + 3 shellspec test files (`validate-finding-envelope.spec.sh`, `auto-review-filter-prior.spec.sh`, `derive-verdict.spec.sh` fixture data) retain dead-code references to "reviewer-architecture" / "architecture" dimension post session-70 drop. Permissive currently (don't cause failures); tighten to enforce 3-specialist suite to prevent silent drift. Quick follow-up to session 70 P-ish.

### P3 — Mobile canvas integration (S-M1.0b) — gated on user

Still gated on user producing mobile canvas in `docs/design-source/marketing-landing/{slug}/`. When canvas lands, ~300-500L breakpoint translation across 5 marketing components.

### P4 — Pre-signup interview canvases (S-O1 build) — gated on user

S-O1 logic now fully specced (spec 65 + 65a + 67 + 74 = LOCKED). Gated on user producing canvas at `docs/design-source/pre-signup-interview/{slug}/`. When canvas lands, S-O1 buildable end-to-end.

### Cohesive-product trajectory (post-session-70)

- ✅ First cohesive Vercel preview SHIPPED (session 66 — `/` renders marketing landing)
- ✅ 9 hero variants + dev gallery SHIPPED (session 67 — `/dev/heroes`)
- ✅ Production hero rotation SHIPPED (session 68 + 69)
- ✅ Design-input audit doc SHIPPED (session 69 ext)
- ✅ AI plan generation spec LOCKED (session 70 P0 PR #111)
- ✅ Spec 57 ↔ 65 sign-up reconciliation LOCKED (session 70 P1 PR #111)
- ✅ Multi-agent suite reduced 4 → 3 specialists (session 70 P-ish PR #112)
- ⏳ Respondent state machine spec — session 71 P0
- ⏳ Thin V1 specs (settings / notifications / account profile) — session 71 P1
- ⏳ Mobile-responsive marketing landing — gated on mobile canvas
- ⏳ Pre-signup interview build — gated on canvas
- 4-5 sessions to user-testable Build phase end-to-end
- 9-12 sessions to all 5 phases minimally populated
- 17+ sessions to production-grade

### Synthetic-deliberate-injection gate POST SESSION-70

Live persona regression detection operational (PR #85, session 63). Now fires for **3 personas** (security · correctness · style) post session-70 drop. Every persona/orchestrator/synthetic-content change triggers 3× live `claude -p` invocations and asserts each persona flags its dimension's planted defect. Architecture fixture removed.

## Scope ceiling

Single-P0 session. Don't add adjacent slice work; don't refactor; don't reskin. If session hits the 1500-line warn mid-impl, **stop and re-slice** — ship what's complete + carry rest. Don't push past 2000. Bias toward 2-3 substantive PRs + room for review iteration on `src/` work.

## Negative constraints (preserve from session 36)

1. Do NOT frame Decouple as a "financial disclosure tool." Spec 42 complete-settlement-workspace framing is load-bearing.
2. Phase-C-freeze model RETIRED (session 24 Option 4). Single-branch-main; no integration branch; no cutover event.
3. Do NOT re-introduce any file from the wiped V1 tree (`src/components/workspace/*` etc.).
4. Do NOT re-open 68a-e locked decisions unless new evidence surfaces. Same for 68g C-U4/U5/U6 (locked session 28).
5. Do NOT read pre-pivot specs (03-06, 11, 12). Active framing: 42, 44, 65, 65a, 67, 68, 68a-g, 70, 71, 72, 72a/b/c, 73, 74.
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
28. **(session 55): Don't freeze AC text more ambitious than the implementation budget.** Reaffirmed session 67 with S-M1 AC-9.
29. **(session 58): Pre-priority spec-gate verification.** Before treating "per spec X §Y" priority as authorized, grep that section's gating IF-clauses verbatim.
30. **(session 67): Naming-rule consistency must apply to all variants in one batch.** When a stylistic rule fires mid-slice, search-and-fix the rule across all related files before opening the next PR.
31. **(session 68): Pre-priority carry-over framing verification.** Before treating a multi-session carry-over as "deferred again", grep for the live state and confirm the kickoff framing matches reality.
32. **(session 68): Transitive-bump trade-off matrix.** When bumping a transitive lint dep, grep for the new rule's hits before committing to budget; surface trade-off matrix early.
33. **NEW (session 70): Spec amendments claiming impl facts MUST update impl files in the same PR.** When a spec amendment makes a claim of the form "implementation X absorbs Y" or "file X carries criterion Y", the implementation file change MUST land in the same PR — otherwise the post-pivot review suite catches it as an AC-gap (PR #112 round-2 correctness finding validated this rule).
34. **NEW (session 70): Control-plane changes (`.claude/agents/`, `.github/workflows/`, `scripts/`, `CLAUDE.md` Hard controls, spec 72c) have wider blast radius than initial estimate.** Estimate at the catalogue level (grep for ALL references) before sizing. PR #112 sized XS by kickoff but actual surface was M (~250-350L) — references cascade across persona files, workflow yamls, scripts, spec, CLAUDE.md, slice acceptance, README, and shellspec tests.

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct, Verdict vocabulary (Conventional Comments).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · spec 72a/b/c · spec 73 · spec 74 · `docs/slices/S-INFRA-rigour-v3{a,b}-*/acceptance.md`.
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 65 · spec 65a · spec 67 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`.

## Branch

### Branch state at session-70 wrap (verified live)

- **Wrap branch:** `claude/resume-decouple-session-70-9QKfT` (sequential single-branch pattern continues; 17 sessions in a row 54→…→70 on this pattern).
- **`main` tip:** `256014c` (post-PR-#112 merge — drop reviewer-architecture).
- **Open PRs at session-70 wrap:** wrap PR opens after this commit. None other open at wrap.
- **Closed/merged this session:** PR #111 (P0+P1 combined) squash `cfe11e9`; PR #112 (P-ish drop reviewer-architecture) squash `256014c`.
- **Live rigour gates** updated: auto-review matrix reduced to 3 specialists `[security, correctness, style]`; `reviewer-architecture` persona file removed; `reviewer-correctness` rubric absorbed criterion 7 (hidden-effects) + criterion 2 architectural-severity variant per spec 72c §4 amendment. Synthetic-deliberate-injection gate now fires for 3 personas. Spec 72c + CLAUDE.md §"Hard controls" reflect the new partition. Slice acceptance.md historical record + golden-replay seed retain 4-specialist references intentionally.
- **Persona retain/drop measurement** cumulative through session 70: reviewer-correctness 12/10 STRONG retain (+1 PR #112 r2 AC-gap) · reviewer-style 14+/10 STRONG retain (+1 PR #112 r3 commenting/temporal-provenance) · reviewer-security 5/10 MODERATE retain (no new findings session 70) · reviewer-architecture **DROPPED** at 2/14 = 0.143 (verdict executed via PR #112).
- **Validator + filter scripts dead-code drift carry-over:** `scripts/validate-finding-envelope.sh` + `scripts/auto-review-filter-prior.sh` + 3 shellspec test files retain hardcoded "architecture" references. Permissive (no test failure); deferred to session 71 P2.

### Next session (71) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. Wrap PR for session 70 should be merged at session-71 start; verify against live source.
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Sequential single-branch pattern continues — `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.
3. **Run `npm install` if `node_modules/` is empty.** TDD-guard DEGRADED detection emits a graceful skip note when vitest is absent; install to restore GREEN/RED gating.
4. **Confirm priority with user.** P0 = **Respondent state machine spec (~100-150L)**. P1 = thin V1 specs (settings / notifications / account profile). P2 = validator + filter scripts cleanup (XS). P3-P4 = canvas-gated work.
5. **If P0 (respondent state machine):** read spec 67 §"Gap 7: Invited party (Mark) profiling variant" + spec 60 §M1-M6 (start session at L880 of spec 67); draft new spec under `docs/workspace-spec/`; document IS1-IS6 state transitions + IS-Plan + 14-day link expiry.
6. **If P1 (thin V1 specs):** three small specs in sequence; settings / notifications / account profile; defer billing to V1.5 per v2-backlog #72.
7. **If P2 (validator + filter scripts cleanup):** drop "architecture" from `scripts/validate-finding-envelope.sh` L29-32 + `scripts/auto-review-filter-prior.sh` L31 + update 3 shellspec test files; tightens enforcement to 3-specialist suite.
8. **Live rigour gates** — every commit dogfoods them. Multi-agent auto-review at **k=2 default + 3 specialists post session-70 + differential mode + per-specialist filter + TDD-guard with 4 runner states + parser schema validation + author-time comment review with HANDOFF/SESSION-CONTEXT skip + plan-review default-spawn + synthetic-deliberate-injection per-persona regression detection (3 personas) + design-source path-ignore + design-source diff-exclude**.
9. **CODEOWNERS solo-operator pattern (#25)** — most candidates touch CODEOWNERS-protected paths; admin-bypass merge expected.
10. **Constraint #29 (pre-priority spec-gate verification):** before treating any "per spec X §Y" priority as authorized, grep that section's gating IF-clauses verbatim.
11. **Constraint #31 (pre-priority carry-over framing verification):** before treating a multi-session carry-over as "deferred again", grep for the live state and confirm the kickoff framing matches reality.
12. **Constraint #33 (NEW session 70):** spec amendments claiming impl facts must update impl files in the same PR.
13. **Constraint #34 (NEW session 70):** control-plane changes have wider blast radius than initial estimate; estimate at catalogue level (grep all references) before sizing.
14. **PR-DoD literal-regex requirement:** PR bodies must literal-cite `docs/slices/S-XX/verification.md` (no brace expansion).
15. **Source-of-truth precedence rule** — when user's Claude AI Design canvas conflicts with spec, design canvas wins for visual + section structure; spec stays as positioning copy backstop only.
16. **Section-name over line-number citations:** when citing CLAUDE.md or spec docs in code comments, prefer `§"Section Name"` over `LXXX-YYY`.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-70 additions:

```
docs/workspace-spec/74-ai-plan-generation.md                      — AI plan generation logic spec (NEW; PR #111)
docs/workspace-spec/65a-signup-orientation-reconciliation.md      — Sign-up + orientation reconciliation register (NEW; PR #111)
docs/workspace-spec/72c-multi-agent-review-framework.md           — §3-§9 + §Status amendments for 3-specialist partition (PR #112)
.claude/agents/reviewer-correctness.md                            — UPDATED rubric; criterion 7 hidden-effects + criterion 2 architectural-severity variant absorbed (PR #112)
docs/HANDOFF-SESSION-70.md                                        — session 70 retro (NEW)
```

Session-70 removals:

```
.claude/agents/reviewer-architecture.md                           — DELETED (drop verdict; PR #112)
tests/personas/synthetic/architecture.diff                        — DELETED (PR #112)
tests/personas/synthetic/expected/architecture.json               — DELETED (PR #112)
```

## Rigour-suite completeness (layman summary)

| Programme | Status | Sessions | Key artefacts on main |
|---|---|---|---|
| **v3a-foundation** | ✅ SHIPPED | 33-41 (PR #24) | `verify-slice.sh`, `tdd-first-every-commit`, plan-time gate |
| **v3b subagent suite** | ✅ SHIPPED + REDUCED | 41-48 + 54-55 + **70** | Multi-agent suite live on main; **3 specialist personas post session-70 drop** + acceptance-gate + ux-polish-reviewer + reviewer-comment |
| **v3c efficiency layer** | ✅ MOSTLY SHIPPED | 50-58 + 60 + **70** | k=2 default, anti-pattern catalogue, differential mode, per-specialist filter, schema validation, author-time comment review, plan-review default-spawn, synthetic-deliberate-injection per-persona fixtures (3 dimensions post session-70) |
| **v3c carry-overs** | 🔵 OUT OF SCOPE | — | Stryker mutation · property-based fuzz · multi-provider 3rd reviewer · live persona drift cron |

**Net state at session-70 wrap:** rigour-suite v3b complete + v3c efficiency layer substantially advanced; the live multi-agent path on main is mature + has dogfooded a drop verdict (validating the framework). Session 70 logic-spec output (2 specs locked: 74 + 65a) closes 2 of the 4 logic-spec gaps from session-69 audit. Session 71 picks up respondent state machine + thin V1 specs.

## Session 71 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD origin/main                                       # expected: post-session-70-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm session-70 PRs all merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
ls node_modules/.bin/vitest                                                  # expect file; if absent, npm install
ls docs/design-source/marketing-landing/                                     # check for new mobile canvas (S-M1.0b prerequisite)
ls docs/design-source/pre-signup-interview/                                  # check for new pre-signup canvas (S-O1 build prerequisite)
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 71?** P0 = respondent state machine spec (~100-150L; logic-only). P1 = thin V1 specs (settings/notifications/account-profile, ~50-100L each). P2 = validator + filter scripts cleanup (XS, ~30-50L). P3-P4 = canvas-gated.
2. **CODEOWNERS solo-operator pattern (#25).** Most session-71 candidates touch CODEOWNERS-protected paths; admin-bypass merge expected.
3. **k=2 default + 3-specialist suite calibration.** n=36 PRs cumulative (post session-70 PR #112); cohesive-product cohort 2 PRs at 3-specialist suite. Mean 1.7 rounds rolling. Flip-back-to-k=1 trigger only if first-3-src-slice false-negative rate >20%.
4. **Persona retain/drop measurement post drop verdict.** Reviewer-correctness 12/10 STRONG retain (+1 PR #112 r2). Reviewer-style 14+/10 STRONG retain (+1 PR #112 r3). Reviewer-security 5/10 MODERATE retain (no new findings session 70). **Reviewer-architecture DROPPED** at 2/14 = 0.143; persona file + workflow matrix entry + spec 72c + CLAUDE.md all updated.
5. **Cohesive-product trajectory.** Logic-spec gap closing in flight: session 70 closed 2 of 4 (P0 AI plan + P1 sign-up reconciliation); session 71 P0+P1 closes the remaining 2 (respondent state machine + thin V1 specs).

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Quote, don't paraphrase, when invoking a spec.** Constraint #29 codified.
- **Pre-priority shipped-artifact verification.** `ls docs/slices/` + `git log --grep` before treating fresh-build framing as authorized.
- Live gates: `auto-review.yml` (k=2 + 3 specialists post session 70 + differential mode + per-specialist filter + design-source path-ignore + diff-exclude) · `eslint-no-disable.yml` · `coverage-threshold.yml` · `pr-dod.yml` (literal-regex requirement) · `.github/CODEOWNERS` · `persona-fixtures.yml` + `persona-synthetic-fixtures.yml` (3 dimensions post session 70) · `pre-push` hook (opt-in) · `shellspec.yml` · `comment-review.sh` PostToolUse advisory · `tdd-guard.sh` 4-state runner detection · `auto-review-parse.sh` schema validation.
- **Verification.md is final-state** (constraint #27).
- **Don't freeze AC text more ambitious than impl budget** (constraint #28).
- **Pre-priority spec-gate verification** (constraint #29).
- **Naming-rule consistency batch** (constraint #30).
- **Carry-over framing verification** (constraint #31).
- **Transitive-bump trade-off matrix** (constraint #32).
- **NEW Spec amendment claims impl facts (constraint #33)** — must update impl files in same PR.
- **NEW Control-plane wider blast radius (constraint #34)** — estimate at catalogue level before sizing.
- Auto-review iteration stop-signal: at k=2 + 3 specialists + differential mode + per-specialist filter, expect 1-2 rounds per PR. Hard-cap at 4 rounds.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Verdict vocabulary:** Conventional Comments labels + `(blocking)`. Personas emit findings; orchestrator derives verdict via `scripts/derive-verdict.sh --multi k=2`.
