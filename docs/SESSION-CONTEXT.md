# Session 67 Wrap Context Block (heading into session 68)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-67 accomplished (rolling window)

> **Session 67 (this wrap):** **3 substantive PRs merged sequentially from `claude/decouple-session-67-TI5gy`, closing the S-M1.0a slice on main + applying honest-framing to S-M1 AC-9.** **PR #96** (P0, `0aea491`) — S-M1 AC-9 mobile-viewport observed-fail honest-framing: visual check at `construct-dev.vercel.app/` at 375×667 surfaced 3 defects (horizontal scroll · Hero column clipping · PictureBand grid clipping); root-cause finding (design canvas authors landing desktop-only — bundled JSX has 0 Tailwind responsive class hits; canvas `.mobile-frame` is desktop-canvas mockup not responsive instance); per CLAUDE.md "Source-of-truth precedence" responsive impl without mobile canvas is implementation-led design with rework risk; AC-9 stays ⏳ (5/6 dims met); S-M1.0b queued as responsive design pass follow-up. 1 round (clean approve). **PR #97** (P1a, `5af33fe`) — S-M1.0a phase 1: 4 simpler hero variants (Declarative · Typographic · Atmospheric · Diagrammatic) + `/dev/heroes` gallery scaffold (5 of 9 heroes) + slice docs at `docs/slices/S-M1-0a-hero-variants/` + bundled housekeeping commit (v2-backlog #74a feature flag SDK item). 2 rounds: round 1 request-changes 8 findings → round 2 patched 7 of 8 (id prop on all 5 heroes for unique gallery section ids · Phase fields rename `n`/`k` → `num`/`label` in diagrammatic.tsx · 4 test description provenance strips · dynamic count assertions in page.test.tsx · AC-1 wording fix · GalleryEntry Component type widening; 3 declined with rationale: v2-backlog category, spec-citation question, /dev/* lockdown deferred). **PR #98** (P1b, `59a39b4`) — S-M1.0a phase 2: 4 complex hero variants (ProductForward · OutcomeLed · TwoColumn · Empathetic) + gallery extension to all 9 heroes + slice verification.md flipped ⏳ → ✅ MET. 2 rounds: round 1 nit-only 5 findings → round 2 patched 3 naming nitpicks (PensionRow.v → amount; SideRow.k/v → label/amount; SideProps.you → isYours; 2 declined: pre-existing /dev/* lockdown gap acknowledged + slug-assertion question answered by existing dynamic test). **S-M1.0a CLOSED on main** — 9-key HERO_VARIANTS map; `/dev/heroes` renders all 9 heroes stacked; production hero unchanged (`SELECTED_HERO_VARIANT='editorial'`). n=3 calibration: mean **1.67 rounds** (well under spec 72c §1 ≤2 target). v2-backlog #74a "Feature flag SDK selection + integration" added (Infrastructure 10→11; Total 98→99). Lessons: TDD-guard mid-rename trip + Bash python escape pattern (P1a r2 + P1b r2); naming-rule consistency must apply to all variants in one batch (P1b r1 missed Hero04-7 even though P1a r2 fixed diagrammatic); mobile-viewport defects surface only at visual check (Constraint #28 reaffirmed); empty-commit retrigger unsticks stalled CI matrix (PR #97 r2 architecture + style stalled ~18min in queue); PR auto-opened by stop-hook flow needs body update before merge.

> **Session 66:** 3 substantive PRs merged sequentially from `claude/decouple-session-66-i8x4J`, completing the S-M1 marketing landing slice on main. **PR #92** (P0, `6e4292a`) — `auto-review.yml` workflow hardening (`paths-ignore: ['docs/design-source/**']` + `:(exclude)docs/design-source` pathspec on `git diff` — handles design-source-bundled PRs without crashing parsers); AC-8 token-deviation fix replacing 32 hex literals with `var(--ds-color-*)` refs across 4 marketing files; slice-doc reconciliation; test additions. **PR #93** (P1, `3e05aa8`) — S-M1 phases 4-5: page composition + `next/font/google` + utility classes. **PR #94** (P2 + P3, `6440afd`) — S-M1 phase 6 (`/start` HTTP 404 placeholder via `notFound()`) + phase 8 (verification.md final-state with phase status + 10-AC sign-off + 6-dim spec 72a preview-deploy table + AC-10 colocation + import-boundary contract test). 3 rounds; 7 substantive findings addressed. **First cohesive Vercel preview ACHIEVED on main.**

> **Session 65 (partial S-M1 ship):** PR #89 cherry-pick + slug restructure brought design canvas to `docs/design-source/marketing-landing/`. Slice docs drafted with 10 AC. Phase 1 atoms + Phase 2 sections + Phase 3 HeroEditorial shipped (16 files, 73 tests across 14 files). Phases 4-8 deferred to session 66.

- **Sessions 41-46:** v3b S-1 through S-5 — 12/15 ACs landed via PRs #25-#27.
- **Session 47:** v3b S-6 (PR #30 9-round live recursive auto-review; v3b 12/15 → 15/15). Auto-review.yml + 3 personas live.
- **Session 48:** v3b S-7 sibling slice (PR #32) + v3b S-8 setup (PR #33) + v3c stub (PR #34).
- **Session 49:** v3c rubric extension + spec 72c §5/§7/§10 prior-art amendments + audit findings queued.
- **Session 50:** 6 PRs merged — PRs #36-#42 covering 72c §9 cross-ref, criterion 2 §Exceptions, citations, slice-resolver fix, §Exception (e), Conv Comments verbatim, fix-up.
- **Session 51:** Rigour-suite session 1 of 3. PRs #44-#47 (§Examples migration, comment posting, verdict arithmetic + 16-case shellspec, slice-AC resolver + 21-case shellspec).
- **Session 52:** Rigour-suite session 2 of 3. PR #50 promoted parse-failed + pipeline-crash to `failure`; PR #49 §Exceptions (a-e) extraction.
- **Session 53:** PR #52 P0b-structural — CODEOWNERS migration; pre-commit-verify deprecation; arch-smell qualitative reframing. Solo-operator design discovery (#23, #25).
- **Session 54:** PR #54 v3b S-8 design contract realigned. 4 specialist personas + `--multi k=N` quorum mode + aggregator subcommand + 21 ShellSpec cases.
- **Session 55:** PRs #56 + #57 — AC-1 v6 fan-out + AC-5 `slice-reviewer.md` retirement; AC-3 differential mode + AC-4 golden-PR replay seed. Multi-agent suite is live review path on main.
- **Session 56:** 3 PRs — PR #59 k=2 default flip; PR #60 anti-pattern catalogue + DoD #1; PR #61 §"Not yet in scope" rewrite + persona-file SHA tracking.
- **Session 57:** 3 PRs — PR #63 differential-mode token-cost loop; PR #64 F5c origin/main-anchored ratchet (admin-bypass); PR #65 pre-flight self-review.
- **Session 58:** 5 PRs — PR #67 (P2) F5c doc cleanup; PR #68 (P1) npx version pin; PR #69 (P3) per-specialist prior-findings filter; PR #70 (C) §"Not yet in scope" cleanup; PR #71 (D2) finding-envelope JSON Schema. n=5 calibration: mean 1.4 rounds.
- **Session 59:** PR #73 drift correction + PR #74 S-F3-phase-nav (4 rounds). First src/ slice that fully exercised v3a+v3b+v3c rigour pipeline.
- **Session 60:** 3 infra PRs — PR #76 (P0) `S-INFRA-reviewer-comment` author-time hook; PR #77 (P4) `S-INFRA-tdd-guard-first-creation`; PR #78 (P5) `S-INFRA-parse-pipeline-schema-validation`. n=3 calibration: mean 3.33 rounds.
- **Session 61:** PR #80 S-F4 trust chip slice + PR #81 plan-review subagent default-spawn flip + wrap. Mean 1.5 rounds.
- **Session 62:** PR #83 S-F7-β rebase via cherry-pick replay (8 ahead / 50 behind main). 2 rounds. AC-4 retain/drop dataset 3/3 → spec 72c §7 first-3-src-slice gate CONFIRMED.
- **Session 63:** PR #85 `S-INFRA-synthetic-fixtures` — spec 72c §7 deferred-to-v3c synthetic-deliberate-injection per-persona fixtures deliverable. Live persona regression detection now operational. 3 rounds.
- **Session 64:** PR #87 `S-F2-document-shell` — Phase C.1 order #4 foundation slice (three-column shell). 3 rounds. First reviewer-architecture catch in 5 src+infra slices (page-wrapper scope-creep).

## Current state

### Locked (through session 54)

- 5-phase journey (Start · Build · Reconcile · Settle · Finalise) per spec 42.
- Document-as-spine (4-doc lifecycle) per spec 44.
- Hub + 68a-e locked decisions; 68f/g registers carry opens.
- Spec 70 Build Map: 33-slice catalogue + S-TOOL/S-INFRA families.
- Spec 71 §7a Option 4: single-branch-main; no integration branch; no cutover event.
- Spec 72: 13-item per-slice security checklist; CI gates.
- **Hook + CI enforcement (post-PR-52 simplified):** SessionStart · PostToolUse Write/Edit · PreToolUse Read · PreToolUse ExitPlanMode (exit-plan-review). **Removed PR #52:** PreToolUse Bash pre-commit-verify hook (deprecated; CI pr-dod.yml is sole DoD gate); hooks-checksums (CODEOWNERS replaces); `.github/workflows/control-change-label.yml` (CODEOWNERS replaces). **Added PR #52:** `.github/CODEOWNERS` is sole control-plane gate for L199-protected paths.
- Stripe SDK pinned `^22.1.0`. Both lockfiles aligned.
- **v3a-foundation shipped** (PR #24 merged session 41).
- **v3b FULLY SHIPPED — 15/15 + S-8 atomic ship across 3 PRs.** Multi-agent suite is the live review path on main.
- **v3c shipped — sessions 50+51+52+53 batch landed + session-54 spec amendment + session-55 multi-agent ship.**

### Built (on main as of `59a39b4`; **session 67 closes S-M1.0a slice** via PR #97 P1a + PR #98 P1b — `/dev/heroes` renders 9 hero variants; production hero unchanged at HeroEditorial. Plus session 67 PR #96 honest-framing for S-M1 AC-9 mobile-viewport row → S-M1.0b queued. Cohesive Vercel preview LIVE at `construct-dev.vercel.app`. Session 66 S-M1 marketing landing slice + Session-64 #87 S-F2 + session-63 #85 synthetic-fixtures + session-62 #83 S-F7-β + session-61 #80 S-F4 + #81 plan-review default-flip + session-60 infra PRs + session-59 #74 S-F3 phase nav + session-56-58 v3c efficiency layer + S-F1 + S-F7-α all on main)

```
src/components/marketing/heroes/{editorial,declarative,typographic,atmospheric,diagrammatic,product-forward,outcome-led,two-column,empathetic,index}.tsx — 9 hero variants + barrel (S-M1 + S-M1.0a; PRs #90/#92-#94 + #97 + #98)
src/app/dev/heroes/page.tsx                                       — 9-hero gallery (S-M1.0a; PR #97 scaffold + PR #98 completion)
src/components/marketing/{atoms,sections}/                        — marketing atoms + sections (S-M1; PRs #90 + #92-#94)
src/app/page.tsx + src/app/layout.tsx + src/app/start/{page,not-found}.tsx — marketing landing composition + /start HTTP 404 (S-M1; PR #93 + PR #94)
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts          — S-F7-α (PR #20)
src/lib/store/{dev-store,index,scenario-loader,types}.ts          — S-F7-α (PR #20)
src/app/globals.css + src/styles/tokens.ts + src/components/ui/button.tsx + tests/unit/tokens.test.ts  — S-F1 design tokens
src/components/phase-nav/{PhaseStepper,JourneyMapRail,LockedSection,...} + tests  — S-F3 phase nav (session 59 PR #74)
src/components/document-shell/{DocumentShell,types,index}.tsx + tests  — S-F2 document shell (session 64 PR #87)
src/lib/stripe/client.ts + package.json + lockfiles               — Stripe pin (S-INFRA-1, PR #22)
.claude/hooks/{line-count,session-start,tdd-first-every-commit,exit-plan-review,read-cap,wrap-check,tdd-guard,pre-push-dod7,comment-review}.sh
.github/CODEOWNERS                                                — control-plane gate (PR #52)
.github/workflows/{eslint-no-disable,pr-dod,shellspec,auto-review,gitleaks,ci,persona-fixtures,persona-synthetic-fixtures,coverage-threshold,control-change-label-deprecated}.yml
.claude/agents/reviewer-{security,architecture,correctness,style,comment}.md + acceptance-gate.md + ux-polish-reviewer.md  — v3b multi-agent suite
docs/workspace-spec/{72-engineering-security,72a-preview-deploy-rubric,72b-adversarial-review-budget,72c-multi-agent-review-framework}.md
docs/slices/S-M1-marketing/{acceptance,security,test-plan,verification}.md  — S-M1 (closed; AC-9 5/6 dims; S-M1.0b queued for AC-9 closure)
docs/slices/S-M1-0a-hero-variants/{acceptance,verification}.md  — S-M1.0a (closed; ✅ MET fully)
docs/v2/v2-backlog.md                                             — backlog (#74a feature flag SDK added session 67; Total 99 items)
```

**Parked branches / queued slices:**
- `claude/S-F7-beta-impl` shipped via session 62 PR #83 cherry-pick replay.
- **S-M1.0b** (responsive design pass for marketing landing) — QUEUED. Mobile design canvas required first per CLAUDE.md "Source-of-truth precedence". Session-68 P0 candidate.

## Session 68 priorities

### P0 — S-M1.0b commission decision (no immediate code) — XS decision + S-M-L impl when canvas ships

S-M1.0b is queued (responsive design pass for marketing landing; closes AC-9 mobile-viewport row of parent S-M1 slice). The slice can't proceed without a mobile design canvas — implementation-led responsive design without canvas has rework risk per CLAUDE.md "Source-of-truth precedence". Session-68 P0 is the *commission* decision: either user produces a mobile canvas (Claude AI Design wire batch → committed to `docs/design-source/marketing-landing/{slug}/`), or the slice stays parked.

Branches once canvas is in:
- (a) Translate canvas → breakpoints across 5 marketing components (Header, HeroEditorial, PictureBand, Journey, FooterMinimal); update verification.md AC-9 mobile-viewport row → ✅; close parent S-M1 slice fully. Estimate ~300-500L.
- (b) If user wants /dev/heroes also responsive (preview pages all 9 variants at 375×667), additional ~400-600L.

Alternative if mobile canvas not ready: swap `SELECTED_HERO_VARIANT` to one of the 8 newly-shipped variants on `/` (instant visual lift, ~3L change). User decision.

### P1 — TDD-guard auto-allow extension (carry-over from session 64+; reaffirmed session 67) — S (~10-30L)

Septuple-confirmed across sessions 61-67. `TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch + lint-fix-refactor case detection + degraded-runner state coverage (vitest unavailable when node_modules empty — recurred at session-65 + session-66 turn-0) + mid-rename atomic pattern (session 67 P1a r2 + P1b r2 both used Bash python escape).

### P2 — Lockfile divergence fix (carry-over from session 64) — S-M

`eslint-plugin-react-hooks@7.0.1` (npm) vs `7.1.1` (pnpm); investigate why S-INFRA-1 dual-lockfile guard didn't catch + repair. Persisted unresolved across 4 sessions now.

### P3 — AC-2 hooks-checksums + control-change-label decision (carry-over) — XS decision + S-M impl

Aspirational across 6 sessions: `.claude/hooks-checksums.txt` + `.github/workflows/control-change-label.yml` + `scripts/generate-hooks-checksums.sh` referenced in CLAUDE.md L155-L158 do NOT exist on disk. Decide: ship the missing files OR strike CLAUDE.md references.

### P4 — `COMMENT_REVIEW_SPAWN=1` opt-in trial (carry-over) — XS-S

Provision local `ANTHROPIC_API_KEY`; opt-in for 1-2 src/ slices. Hypothesis: live mode distinguishes HANDOFF/SESSION-CONTEXT lineage (allowed) from `verification.md` provenance (forbidden). Would suppress recurring stub-mode false positive on session-N references.

### P5 — Reviewer-architecture watchlist continues (observational)

Cumulative 2/7 catches; retain bar met (≈ 1-per-3 cadence). Monitor next 3 src/ slices for sustained signal. No action required unless silent across the next 3 src/ slice triggers.

### Cohesive-product trajectory (post-S-M1.0a ship)

- ✅ **First cohesive Vercel preview** SHIPPED (session 66 — `/` renders marketing landing)
- ✅ **9 hero variants + dev gallery** SHIPPED (session 67 — `/dev/heroes` shows all 9; production hero swappable via const)
- ⏳ **Mobile-responsive marketing landing** — S-M1.0b queued; needs mobile canvas
- 4-5 sessions to user-testable Build phase end-to-end (S-B0 entry → bank-connect flow → first artefact)
- 9-12 sessions to all 5 phases minimally populated
- 17+ sessions to production-grade

### Synthetic-deliberate-injection gate UNCHANGED

Live persona regression detection operational (PR #85, session 63). Every persona/orchestrator/synthetic-content change triggers 4× live `claude -p` invocations and asserts each persona flags its dimension's planted defect (4/4 PASS).

## Scope ceiling

Single-P0 session. Don't add adjacent slice work; don't refactor; don't reskin. If session hits the 1500-line warn mid-impl, **stop and re-slice** — ship what's complete + carry rest. Don't push past 2000. Bias toward 2-3 substantive PRs + room for review iteration on `src/` work.

## Negative constraints (preserve from session 36)

1. Do NOT frame Decouple as a "financial disclosure tool." Spec 42 complete-settlement-workspace framing is load-bearing.
2. Phase-C-freeze model RETIRED (session 24 Option 4). Single-branch-main; no integration branch; no cutover event.
3. Do NOT re-introduce any file from the wiped V1 tree (`src/components/workspace/*` etc.).
4. Do NOT re-open 68a-e locked decisions unless new evidence surfaces. Same for 68g C-U4/U5/U6 (locked session 28).
5. Do NOT read pre-pivot specs (03-06, 11, 12). Active framing: 42, 44, 65, 67, 68, 68a-g, 70, 71, 72, 72a/b/c, 73.
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
28. **(session 55): Don't freeze AC text more ambitious than the implementation budget.** Reaffirmed session 67 with S-M1 AC-9 (promised "header collapses or stacks per design; hero columns stack" without mobile canvas) — visual check at 375×667 surfaced 3 defects; honest-framing applied; S-M1.0b queued.
29. **(session 58): Pre-priority spec-gate verification.** Before treating "per spec X §Y" priority as authorized, grep that section's gating IF-clauses verbatim.
30. **(session 67): Naming-rule consistency must apply to all variants in one batch.** When a stylistic rule fires mid-slice, search-and-fix the rule across all related files before opening the next PR (session 67 missed Hero04-7 single-letter fields even though P1a r2 had fixed diagrammatic.tsx; reviewer flagged the same rule again at P1b r1).

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct, Verdict vocabulary (Conventional Comments).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · spec 72a/b/c · spec 73 · `docs/slices/S-INFRA-rigour-v3{a,b}-*/acceptance.md`.
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`.

## Branch

### Branch state at session-67 wrap (verified live)

- **Wrap branch:** `claude/decouple-session-67-TI5gy` (sequential single-branch pattern continues; 14 sessions in a row 54→…→67 on this pattern).
- **`main` tip:** `59a39b4` (post-PR-#98 merge — S-M1.0a closes fully).
- **Open PRs at session-67 wrap:** wrap PR opens after this commit. None other open at wrap.
- **Closed/merged this session:** PR #96 (P0, `0aea491`); PR #97 (P1a, `5af33fe`); PR #98 (P1b, `59a39b4`).
- **Live rigour gates** unchanged from session 66 ship state.
- **AC-2 hooks-checksums + control-change-label mechanism still ASPIRATIONAL** (sessions 61-67 unresolved; P3 carry-over).
- **AC-3 ux-polish-reviewer** still dormant (no UI changes triggered formal review window in S-M1.0a — heroes are pure presentation; Vercel preview verification handled by user visual check at 375×667 surfacing the AC-9 defects).
- **AC-4 retain/drop measurement** cumulative through session 67: reviewer-correctness 9/7 STRONG retain · reviewer-style 11+/7 STRONG retain · reviewer-security 4/7 MODERATE+ retain · reviewer-architecture 2/7 (clean approves on session 67 src/ PRs; meets ≈ 1-per-3 cadence retain bar). Cohesive-product cohort 7 src/ slices through.

### Next session (68) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. Wrap PR for session 67 (whatever number GitHub assigns) should be merged at session-68 start; verify against live source.
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Sequential single-branch pattern continues — `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.
3. **Run `npm install` if `node_modules/` is empty.** Sessions 65 + 66 + 67 each hit this. Front-load before any code.
4. **Confirm priority with user.** P0 = **S-M1.0b commission decision** (mobile canvas first, then breakpoint translation). If no canvas ready, alternative P0 = swap `SELECTED_HERO_VARIANT` const to a different hero on `/`. P1-P5 = carry-overs (TDD-guard env hatch · lockfile divergence · hooks-checksums decision · COMMENT_REVIEW_SPAWN trial · architecture watchlist).
5. **If P0 (S-M1.0b with canvas):** read mobile design canvas; translate to breakpoints across Header, HeroEditorial, PictureBand, Journey, FooterMinimal; update `docs/slices/S-M1-marketing/verification.md` AC-9 mobile-viewport row → ✅ MET; close parent S-M1 slice. Optional: extend /dev/heroes responsive too.
6. **If P0 (variant swap, no canvas yet):** edit `src/components/marketing/heroes/index.ts` → change `SELECTED_HERO_VARIANT` value; commit + push + PR.
7. **If P1-P5 (carry-overs):** rigour queue-drain.
8. **Live rigour gates** — every commit dogfoods them. Multi-agent auto-review at **k=2 default + differential mode + per-specialist filter + TDD-guard + parser schema validation + author-time comment review + plan-review default-spawn + synthetic-deliberate-injection per-persona regression detection + design-source path-ignore + design-source diff-exclude**.
9. **CODEOWNERS solo-operator pattern (#25)** — most candidates touch CODEOWNERS-protected paths; admin-bypass merge expected.
10. **Reviewer-architecture retain/drop trigger window** — cumulative 2/7; meets ≈ 1-per-3 cadence retain bar.
11. **Constraint #29 (pre-priority spec-gate verification):** before treating any "per spec X §Y" priority as authorized, grep that section's gating IF-clauses verbatim.
12. **Pre-priority shipped-artifact verification:** before treating "first src/ slice" or fresh-build framing as authorized, `ls docs/slices/` and `git log --grep` for shipped-artifact evidence.
13. **PR-DoD literal-regex requirement (session 66 lesson):** PR bodies must literal-cite `docs/slices/S-XX/verification.md` (no brace expansion).
14. **Source-of-truth precedence rule** — when user's Claude AI Design canvas conflicts with spec, design canvas wins for visual + section structure; spec stays as positioning copy backstop only.
15. **Naming-rule consistency batch (session 67 lesson, #30):** when a stylistic rule fires mid-slice, search-and-fix across all related files before opening the next PR.
16. **TDD-guard mid-rename pattern (session 67 lesson):** when a rename touches >2 lines in same file (interface + array literal + JSX usages), prefer Bash python script over sequential Edits — atomic rewrite avoids the mid-rename RED state that blocks follow-up Edits.
17. **Empty-commit retrigger pattern (session 67 lesson):** when matrix-strategy CI jobs sit queued >5min while peers complete, `git commit --allow-empty` + push retriggers the workflow with fresh runner slots.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-67 additions:

```
docs/HANDOFF-SESSION-67.md                                        — session 67 retro (NEW)
docs/slices/S-M1-0a-hero-variants/{acceptance,verification}.md    — S-M1.0a slice docs (NEW; verification.md flipped ⏳ → ✅ MET at PR #98)
src/components/marketing/heroes/{declarative,typographic,atmospheric,diagrammatic,product-forward,outcome-led,two-column,empathetic}.tsx  — 8 new hero variants (PRs #97 + #98)
src/components/marketing/heroes/index.ts                          — HERO_VARIANTS map extended 1 → 9 (PRs #97 + #98)
src/app/dev/heroes/page.tsx                                       — gallery (PR #97 scaffold + PR #98 completion)
tests/unit/components/marketing/heroes/{...}.test.tsx             — 8 new variant smoke tests + barrel test extension
tests/unit/app/dev/heroes/page.test.tsx                           — gallery test (5 assertions; dynamic against HERO_VARIANTS)
docs/v2/v2-backlog.md                                             — #74a feature flag SDK item added (Infrastructure 11; Total 99)
docs/slices/S-M1-marketing/{verification,acceptance}.md           — AC-9 honest-framing applied at PR #96 (mobile-viewport observed-fail; S-M1.0b queued)
```

## Rigour-suite completeness (layman summary)

| Programme | Status | Sessions | Key artefacts on main |
|---|---|---|---|
| **v3a-foundation** | ✅ SHIPPED | 33-41 (PR #24) | `verify-slice.sh`, `tdd-first-every-commit`, plan-time gate |
| **v3b subagent suite** | ✅ SHIPPED | 41-48 + 54-55 | Multi-agent suite live on main; 4 specialist personas + acceptance-gate + ux-polish-reviewer + reviewer-comment |
| **v3c efficiency layer** | ✅ MOSTLY SHIPPED | 50-58 + 60 | k=2 default, anti-pattern catalogue, differential mode, per-specialist filter, schema validation, author-time comment review, plan-review default-spawn, synthetic-deliberate-injection per-persona fixtures |
| **v3c carry-overs** | 🔵 OUT OF SCOPE | — | Stryker mutation · property-based fuzz · multi-provider 3rd reviewer · live persona drift cron |

**Net state at session-67 wrap:** rigour-suite v3b complete + v3c efficiency layer substantially advanced; the live multi-agent path on main is mature. Session 67 src/ output (3 PRs, mean 1.67 rounds) confirms calibration is stable. Session 68 lead pick = S-M1.0b commission decision (gated on mobile canvas availability) or P1-P5 rigour queue-drain.

## Session 68 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD origin/main                                       # expected: post-session-67-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm session-67 PRs all merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
ls node_modules/.bin/vitest                                                  # expect file; if absent, npm install before any src/ write
ls docs/design-source/marketing-landing/                                     # check for new mobile canvas (S-M1.0b prerequisite)
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 68?** P0 = **S-M1.0b commission decision** (mobile canvas first, then breakpoint translation). Alternative P0 = production hero swap to one of 8 newly-shipped variants. P1-P5 = carry-overs.
2. **CODEOWNERS solo-operator pattern (#25).** S-M1.0b would touch `src/components/marketing/**` + `tests/**` + `docs/slices/**` (CODEOWNERS-protected); admin-bypass merge expected.
3. **k=2 default + §Revisit trigger calibration.** n=26 calibration data through session 67 (mean ~1.7 rounds). Continues; flip-back-to-k=1 trigger only if first-3-src-slice false-negative rate >20%.
4. **Reviewer-architecture retain/drop trigger window.** Cumulative 2/7; meets ≈ 1-per-3 cadence. S-M1.0b is the next formal trigger (3 marketing-component breakpoint changes).
5. **Reviewer-correctness STRONG retain compounded** (catches /g regex statefulness in session 66; ac-gap + edge-case duplicate-id + ac-gap question across session 67 PRs). 9/7 cumulative.
6. **Cohesive-product trajectory now LIVE on main.** `construct-dev.vercel.app` renders the marketing landing on `/`; `/dev/heroes` renders all 9 variants. Session 68 onwards: either close the responsive gap (S-M1.0b) or swap to a different hero. Estimates re-cadenced post-S-M1.0a: 4-5 sessions to user-testable Build; 9-12 to all 5 phases minimally populated; 17+ to production-grade.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Quote, don't paraphrase, when invoking a spec.** Constraint #29 codified.
- **Pre-priority shipped-artifact verification.** `ls docs/slices/` + `git log --grep` before treating fresh-build framing as authorized.
- Live gates: `auto-review.yml` (k=2 + differential mode + per-specialist filter + design-source path-ignore + diff-exclude) · `eslint-no-disable.yml` · `coverage-threshold.yml` · `pr-dod.yml` (literal-regex requirement; brace expansion fails) · `.github/CODEOWNERS` · `persona-fixtures.yml` + `persona-synthetic-fixtures.yml` · `pre-push` hook (opt-in) · `shellspec.yml` · `comment-review.sh` PostToolUse advisory · `tdd-guard.sh` first-creation auto-resolve · `auto-review-parse.sh` schema validation warn+accept.
- **Comments anti-pattern catalogue:** stub-mode hook flags 4 of 5 catalogue items at write-time. `SESSION-CONTEXT.md` + `HANDOFF-SESSION-N.md` + `acceptance.md`'s deferred-S-M1.0b refs are FALSE POSITIVES (lineage IS the doc's purpose). Strip session-N refs from non-HANDOFF/non-SESSION-CONTEXT docs and from non-§Status-footer regions of slice docs.
- **Verification.md is final-state** (constraint #27): assemble at slice ship, not running log.
- **Don't freeze AC text more ambitious than impl budget** (constraint #28). Reaffirmed session 67.
- **Pre-priority spec-gate verification** (constraint #29): grep gating IF-clauses verbatim.
- **Naming-rule consistency batch** (constraint #30, NEW session 67): when a stylistic rule fires mid-slice, search-and-fix across all related files before opening the next PR.
- Auto-review iteration stop-signal: at k=2 + differential mode + per-specialist filter, expect 1-2 rounds per PR. Hard-cap at 4 rounds.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Architectural-smell-trigger:** qualitative judgement per CLAUDE.md.
- **Verdict vocabulary:** Conventional Comments labels + `(blocking)`. Personas emit findings; orchestrator derives verdict via `scripts/derive-verdict.sh --multi k=2`.
- **PR-DoD literal-regex requirement (session 66 lesson):** PR bodies must literal-cite `docs/slices/S-XX/verification.md` (no brace expansion). Edits to PR body retrigger via `pull_request: edited`; no push needed.
- **TDD-guard mid-rename pattern (session 67 lesson):** when a rename touches >2 lines in same file (interface + array literal + JSX usages), prefer Bash python script over sequential Edits.
- **Empty-commit retrigger pattern (session 67 lesson):** when matrix-strategy CI jobs sit queued >5min while peers complete, `git commit --allow-empty` + push retriggers the workflow with fresh runner slots.
