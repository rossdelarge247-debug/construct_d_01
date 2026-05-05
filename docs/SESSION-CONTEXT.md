# Session 66 Wrap Context Block (heading into session 67)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-66 accomplished (rolling window)

> **Session 66 (this wrap):** **3 substantive PRs merged sequentially from `claude/decouple-session-66-i8x4J`, completing the S-M1 marketing landing slice on main.** **PR #92** (P0, `6e4292a`) — 5 sub-items in one commit: `auto-review.yml` workflow hardening (`paths-ignore: ['docs/design-source/**']` on the `pull_request` trigger + `:(exclude)docs/design-source` pathspec on both `git diff` invocations in `brief-compose` — handles the 2.1MB design-source HTML that crashed PR #90's auto-review parsers, empirically validated by clean parse on PR #91 + this session's 3 PRs); AC-8 token-deviation fix replacing 32 hex literals with `var(--ds-color-*)` refs across 4 marketing files (3 literals retained where no clean S-F1 token match); slice-doc reconciliation (`security.md` HTTP 200→404; `acceptance.md` ChildrenIcon clarification); test additions extending editorial signature with §1-§4 prefixes + Area 01-04 orbit-card labels + 3-signal trust band + cta-primary/eyebrow fragility tightening. **PR #93** (P1, `3e05aa8`) — S-M1 phases 4-5: `src/app/page.tsx` rewritten as marketing composition (skip-link + Header + main(Hero + PictureBand + Journey) + FooterMinimal); `src/app/layout.tsx` migrated to `next/font/google` for Source Serif 4 + JetBrains Mono + Inter (3 vestigial `<link>` tags removed; `--font-sans/-heading/-body` wired to `var(--font-inter)`); ~85L marketing utility classes appended to `globals.css` verbatim from design canvas (`docs/design-source/marketing-landing/landing-source-bundled.html` L14-109). PR-DoD CI required PR-body literal `verification.md` path (no brace expansion). **PR #94** (P2 + P3, `6440afd`) — S-M1 phase 6 (`/start` HTTP 404 placeholder via `notFound()` from `next/navigation` + segment-level `not-found.tsx` with placeholder copy + `<Link href="/">` back-home — production build prerenders `/start` as static `○` route) and phase 8 (verification.md final-state with phase status + 10-AC sign-off + 6-dim spec 72a preview-deploy table + 13-row spec 72 §11 security checklist + AC-2 formal re-scope to in-scope=HeroEditorial; AC-10 colocation + import-boundary contract test that caught a real coupling violation in `src/app/page.tsx`, fixed by adding `src/components/marketing/index.ts` barrel). 3 rounds (block → request-changes → approve); 7 substantive findings addressed (2 blocking + 5 advisory). **First cohesive Vercel preview ACHIEVED on main** — `construct-dev.vercel.app` now renders the marketing landing on `/`. n=3 calibration: mean 1.7 rounds across the 3 PRs (matches spec 72c §1 ≤2 target). Lessons: PR-DoD literal-regex requirement; regex `/g` with `.test()` in loops has `lastIndex` statefulness bug (real correctness catch); AC text scope must be honest before claiming met (verification cannot widen AC outcome — Constraint #28 in action); adversarial-review tests catch real coupling (the new import-boundary test caught `page.tsx` violation immediately on first run); mobile-viewport verification genuinely not automatable from CI (AC-9 honest framing as in-progress wins over fake-met). Reviewer-architecture cumulative now 2/6 (≈ 1-per-3 cadence holds retain bar); reviewer-correctness STRONG retain compounded (4 substantive catches on PR #94 alone); reviewer-security MODERATE+ retain bumped (first formal security catch on a marketing slice — 13-item checklist gap). PR #91 (session-65 follow-up) merged at session-66 turn-0; PR #89 closed as superseded.

> **Session 65 (partial S-M1 ship):** PR #89 cherry-pick + slug restructure brought the user's Claude AI Design canvas (`Decouple.zip` + `Landing Page - Standalone.html`) to `docs/design-source/marketing-landing/`. Slice docs (`docs/slices/S-M1-marketing/{acceptance,security,test-plan}.md`) drafted with 10 AC + audit reconciliation against the design's 9 page modules + 13-item security walk + 12-test plan. Phase 1 atoms shipped + Phase 2 sections shipped + Phase 3 HeroEditorial shipped (16 files, 73 tests passing across 14 files). Phases 4-8 deferred to session 66 — Vercel preview still showed the prior placeholder until session 66 P1 wired it up.

- **Sessions 41-46:** v3b S-1 through S-5 — 12/15 ACs landed via PRs #25-#27 across 6 sessions.
- **Session 47:** v3b S-6 (PR #30 9-round live recursive auto-review; 14 findings; v3b 12/15 → 15/15). Auto-review.yml + 3 personas live.
- **Session 48:** v3b S-7 sibling slice (PR #32 §Architectural-smell-trigger) + v3b S-8 setup (PR #33 spec 72c + 6-AC acceptance.md) + v3c stub (PR #34).
- **Session 49:** v3c rubric extension (criterion 2 §Exceptions a-d) + spec 72c §5/§7/§10 prior-art amendments + audit findings queued.
- **Session 50:** 6 PRs merged — PR #36 (72c §9 cross-ref), #37 (criterion 2 §Exceptions a-d), #38 (citations + 100%-rule rename), #39 (slice-resolver fix), #40 (§Exception (e) wrap docs), #41 (Conv Comments verbatim), #42 (fix-up).
- **Session 51:** Rigour-suite delivery push, session 1 of 3. 4 substantial PRs merged: PR #44 (§Examples migration to Conv Comments schema), PR #45 (auto-review findings posted as PR comment with markdown table — visibility fix), PR #46 (verdict-derivation arithmetic extracted to `scripts/derive-verdict.sh` + 16-case shellspec; verdict-coercion fixture per spec 72c §5 rule 3 NOW CI-GATED), PR #47 (slice-AC resolver + persona-JSON parser extracted to `scripts/auto-review-{slice-resolve,parse}.sh` + 21-case shellspec; latent empty-stdin edge case fixed). All non-trivial logic now in tested scripts under `tests/shellspec/`.
- **Session 52:** Rigour-suite delivery push, session 2 of 3. Two substantial PRs merged. **PR #50** promoted both `parse-failed` AND pipeline-crash paths in `auto-review.yml` from `neutral` to `failure` (rigour-malfunction blocks merge; secret-missing skip stays `neutral` for fork-PR compatibility). **PR #49** extracted criterion 2 §Exceptions sub-clauses (a-e) from `slice-reviewer.md` prose to a structured YAML + deterministic file-glob pre-filter (15-case shellspec) + 5-row markdown table inline. PR #49 went through 6 rounds of auto-review iteration; refined stop-signal distinguishes polish from correctness.
- **Session 53:** **PR #52** (`S-INFRA-rigour-v3c-prior-art-amendments-structural`, merged @ `495e473`) — P0b-structural 3 simplifications: CODEOWNERS migration replacing 3 legacy controls (hooks-checksums + control-change-label + path-protected-list); pre-commit-verify hook deprecation (CI's pr-dod.yml is sole DoD gate); arch-smell trigger reframed from numeric round-count to qualitative judgement per Cunningham/Fowler. Net diff −440 / +50 across 9 commits + 4 auto-review rounds. **Solo-operator design discovery:** GitHub author-cannot-self-approve hard rule means CODEOWNERS gate self-deadlocks for solo; admin-bypass-per-merge becomes the conscious-act rigour layer (negative constraint #23). **AC-drafting style smell** captured (negative constraint #24): don't draft AC verification as literal grep checks; use semantic checks. Session-53 wrap PR #53 (`claude/wrap-session-53` @ `948837334`) opened with HANDOFF-SESSION-53 + framing fix but **was never merged**.
- **Session 54:** **PR #54** (`S-INFRA-persona-suite-v2-multi-agent`, merged @ `b4d7e6c` via solo-operator admin-bypass) — **v3b S-8 design contract realigned to /ultrareview prior-art audit findings (4-partition + majority-vote `k`-quorum + golden-PR replay primary) + AC-1 partial impl + AC-2 full impl.** Spec 72c session-54 amendment + 4 specialist personas + `scripts/derive-verdict.sh --multi k=N` quorum mode + `scripts/spawn-multi-reviewer.sh aggregate` subcommand + 21 ShellSpec cases. 5 rounds of auto-review iteration with stop at round 5 per qualitative arch-smell trigger judgement.
- **Session 55:** v3b S-8 atomic ship complete. **PR #56** (`80ba85b`): AC-1 v6 fan-out + AC-5 `slice-reviewer.md` retirement (auto-review.yml flipped to 4-specialist matrix-strategy). 11 rounds, 5 real bugs caught. **PR #57** (`83421c8`): AC-3 differential mode + AC-4 golden-PR replay seed (PR #30 baseline) + DoD-13 4 fresh-context persona reviews. 5 rounds. **Multi-agent suite is the live review path on main from session 55 onwards.**
- **Session 56:** 3 PRs merged. **PR #59** k=2 default flip; **PR #60** anti-pattern catalogue + DoD #1 final-state framing; **PR #61** §"Not yet in scope" categorised rewrite + persona-file SHA tracking. First round-1 clean approve under k=2 default (PR #60).
- **Session 57:** 3 PRs merged. **PR #63** (P0) differential-mode token-cost loop (4 rounds); **PR #64** (P1) F5c origin/main-anchored ratchet (admin-bypass override on Path A scope conflict); **PR #65** (P2) pre-flight self-review with `/preflight` slash command + opt-in pre-push hook. P3 (synthetic fixtures) deferred. n=3 calibration data: mean 2.7 rounds.
- **Session 58:** **5 PRs merged** sequentially from `claude/decouple-session-58-ghiWv`. **PR #67** (P2) F5c doc cleanup in v3a-foundation slice. **PR #68** (P1) npx version pin to `2.1.126` (both invocation sites; OWASP A08:2021). **PR #69** (P3) per-specialist prior-findings filtering — NEW `scripts/auto-review-filter-prior.sh` (jq filter on `seen_by[]` containment) + brief-job wire + 11-case shellspec; round 1 caught real jq 1.6 portability bug + WHAT-narration anti-pattern; round 2 dogfooded the new filter end-to-end. **PR #70** (C) CLAUDE.md §"Not yet in scope" cleanup post-P3 (3 shipped removals + synthetic-fixtures gating reword). **PR #71** (D2) finding-envelope JSON Schema + `scripts/validate-finding-envelope.sh` jq validator + 17-case shellspec. P0 (synthetic-deliberate-injection per-persona fixtures) DEFERRED at turn-0 via plan-vs-spec cross-check — spec 72c §7 explicit gating: "first-3-src-slice retain/drop confirms the 4-partition holds" precondition unmet (zero src/ slices shipped). n=5 calibration: mean 1.4 rounds. WHAT-narration anti-pattern surfaced on PR #69 + PR #71 (RECURRING — author-time blindspot despite shipping the catalogue at PR #60). Differential mode + per-specialist filter end-to-end self-validated for the first time on PR #69 round 2 + repeated on PR #71 round 2.
- **Session 59:** **2 PRs merged** sequentially from `claude/decouple-session-59-bk9Wy`. **PR #73** (drift correction, round-1 clean) — CLAUDE.md key files + SESSION-CONTEXT Built — Phase C foundation slices section reflecting S-F1 ship state (session 29 + session-35 wrap PR #23 `92f77d7`) + S-F7-α (PR #20) + S-F7-β parked-branch staleness (8 ahead / 49 behind main). **PR #74** S-F3-phase-nav (4 rounds: lint fix · anti-pattern strip · AC-gap closure · self-inflicted anti-pattern strip → APPROVE) — PhaseStepper + JourneyMapRail + LockedSection components + `state.ts` derivation + LOCKED-copy constants + landing-page demo + 6 phase-nav test files (35 unit/component) + landing-page smoke test (3); 68g register flips C-V6 + C-V13 🟠→🟢. n=2 calibration: mean 2.5 rounds. **First src/ slice that fully exercised v3a+v3b+v3c rigour pipeline.** Lessons: TDD-guard chicken-and-egg for new module first-creation (bash heredoc workaround); anti-pattern self-application RECURRING (session 57+58+59 confirmation; round-3 self-inflicted recurrence); pre-priority discovery surfaced S-F1 already-shipped (Constraint-#29-adjacent omission of shipped artifact); S-F7-β staleness analysis (49-behind = rebase-and-validate, not small carry-forward).
- **Session 60 (this wrap):** **3 substantive infra PRs merged** sequentially from `claude/decouple-session-60-TT3BF`. **PR #76** (P0) `S-INFRA-reviewer-comment` — author-time WHY-vs-WHAT subagent (PostToolUse hook + `.claude/agents/reviewer-comment.md` persona; stub mode covers 4 of 5 catalogue items via regex; live mode opt-in via `COMMENT_REVIEW_SPAWN=1`). 3 rounds. **PR #77** (P4) `S-INFRA-tdd-guard-first-creation` — tdd-guard distinguishes module-not-found-on-Write-of-non-existent-src from real RED; chicken-and-egg auto-resolves so the bash-heredoc workaround becomes optional. 3 rounds. **PR #78** (P5) `S-INFRA-parse-pipeline-schema-validation` — `auto-review-parse.sh` now schema-validates each persona envelope via `validate-finding-envelope.sh`, warn + accept on schema-invalidity (parse-failed cascade preserved exactly for the existing JSON-extraction failure modes). 4 rounds. n=3 calibration: mean 3.33 rounds. Lessons: anti-pattern self-application QUADRUPLE confirmed (session 57+58+59+60); fixture drift surfaced when bolting strict-mode onto pre-existing pipeline (P5 round 2); bare-assignment + `set -euo pipefail` + command-sub failure breaks errexit-suppression (P5 round 4 round-trip canonical lesson); P0 hook self-fire dogfood worked end-to-end including the round-2 absolute-path skip-list fix.
- **Session 61 (this wrap):** **2 substantive PRs merged + wrap C-pick** sequentially from `claude/decouple-session-61-R5p05`. **PR #80** S-F4 trust chip slice (Phase C.1 order #5) — `<TrustChip>` + 6-level taxonomy + 2 LOCKED visual treatments + 4 OPEN levels rendered as neutral placeholders + 4 new `--ds-color-trust-*` tokens (S-F1 token-parity test extended 65→69) + landing-page demo + 5 new test files; 68g register C-T1 entry created (🟠 with annotation). 2 rounds (R1: 8 findings; R2: approve + 1 nitpick). **PR #81** Enhancement #1 plan-review subagent default-spawn flip — `EXIT_PLAN_REVIEW_SPAWN=0` opt-out replaces `=1` opt-in; CLAUDE.md §Hard controls gate row updated + §Not yet in scope item struck. 1 round (approve + 1 informational `note`). **Wrap PR** JSON Schema list-strike (shipped at PR #71 + PR #78; struck from §Not yet in scope §Other) + HANDOFF-61 + SESSION-CONTEXT refresh. Mean 1.5 rounds; queue-drain Path A · N=1 cadence validated. Lessons: TDD-guard chicken-and-egg variant for RED-on-existing-src (used `sed` via Bash workaround); anti-pattern self-application QUINTUPLE confirmed (sessions 57+58+59+60+61 — describe/it test descriptions are author-time stub-hook blindspot); AC-2 hooks-checksums + control-change-label mechanism is aspirational (3 expected files do not exist on disk).
- **Session 62:** **1 substantive PR merged** sequentially from `claude/decouple-session-62-urIHk`. **PR #83** S-F7-β rebase via cherry-pick replay (HANDOFF-59 Lesson 4 Strategy a; parked branch `claude/S-F7-beta-impl @ a3f67ec` 8 ahead / 50 behind main replayed onto session-62 branch + ridden through current rigour pipeline). 14 commits squash-merged at `23a35a1`: 8 cherry-picks + 1 lint-fix + 1 verification.md refresh + 1 fix-up addressing 6 of 8 round-1 findings + 3 empty Vercel-retrigger commits. 2 rounds. AC-4 retain/drop dataset NOW 3/3 (S-F3 + S-F4 + S-F7-β) → **spec 72c §7 first-3-src-slice gate CONFIRMED** (every slice's findings cluster cleanly into the 4 categories with no catalogue gaps requiring a 5th specialist) → synthetic-deliberate-injection per-persona fixtures unblocked. Lessons: architectural-smell-trigger fired on cherry-picks (lint pipeline raised 13 errors; 12 mechanically fixable); lockfile divergence between `package-lock.json` (eslint-plugin-react-hooks@7.0.1) and `pnpm-lock.yaml` (7.1.1) surfaced rule drift on engine-workbench:711; sextuple-confirmed anti-pattern catalogue items 5/8 of round-1 findings (cherry-pick replays are write-time-hook gap); Vercel preview env-var scope matters (Preview ≠ Production); TDD-guard chicken-and-egg variant for lint-fix-on-existing-untested-src.
- **Session 63:** **1 substantive PR merged** sequentially from `claude/decouple-session-63-S5DU6`. **PR #85** `S-INFRA-synthetic-fixtures` (`3b17be8`, admin-bypass squash-merge) — spec 72c §7 deferred-to-v3c synthetic-deliberate-injection per-persona fixtures deliverable. Surface: 4 unified-diff fixtures with planted defects (security XSS · architecture UI-DB coupling · correctness off-by-one · style PR/round provenance) + 4 expected-finding signature contracts + pure jq matcher (`tests/personas/match-synthetic.sh`) + orchestrating runner (`tests/personas/run-synthetic.sh`) + CI workflow (`.github/workflows/persona-synthetic-fixtures.yml`) + slice docs + comment-review hook skip-list extension + CLAUDE.md §"Not yet in scope" carry-over strike. **Live persona regression detection now operational** — every persona/orchestrator/synthetic-content change triggers 4× live `claude -p` invocations and asserts each persona flags its dimension's planted defect (4/4 PASS on round 2 + round 3). 3 rounds. R1: block — 6 valid findings, including a critical REPO_ROOT path bug. R2: request-changes — 3 advisory non-blocking. R3: approve. Lessons: REPO_ROOT bug + missing ShellSpec gap + CLI-version command-injection were all author-time misses; category-pattern enum mismatch caught pre-PR via cross-check.
- **Session 64 (this wrap):** **1 substantive PR merged** sequentially from `claude/decouple-session-64-fN1u5`. **PR #87** `S-F2-document-shell` (`765f3b0`, admin-bypass squash-merge) — Phase C.1 order #4 foundation slice; three-column shell every workspace document renders into per spec 68b B-D1..D4 + spec 68d S-D1. Surface: `src/components/document-shell/{DocumentShell.tsx, types.ts, index.ts}` (~190L) + 3 test files with 28 unit tests + landing-page demo extension on `src/app/page.tsx` with Sarah's-Picture-shaped stub content + slice docs at `docs/slices/S-F2-document-shell/`. Implements 68b B-D1..D4 + B-T1 + B-T3 + 68d S-D1 + S-D2 + S-D4. 3 rounds. R1: block — 9 findings (2 blocking on focus-management ac-gap + page-wrapper scope-creep architecture; 7 advisory). R2: approve — 2 advisory (drop index.test.ts nitpick, userEvent vs fireEvent suggestion). R3: approve — same 2 advisory after doc-only verification.md finalisation. **First reviewer-architecture catch** in 5 src+infra slices: page-wrapper `<main>` → `<div>` was unscoped mutation; round 2 added `bodyAs?: 'main' | 'section'` prop (default `'main'`), demo passes `'section'`, page outer `<main>` restored. Lessons: architecture's first formal retain catch validated; pre-priority spec-quote check caught two kickoff drifts (path + framing) before AC freeze; TDD-guard chicken-and-egg recurred on lint-fix variant + new-tests-coupling (sed/awk/heredoc escape); auto-review k=2 quorum interprets two specialists with separate blocking findings as block; Constraint #27 hook flagged round-by-round narrative in verification.md.

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
- **v3a-foundation shipped** (PR #24 merged session 41) — 8 ACs PASS; verify-slice.sh 7-gate workhorse; tdd-first-every-commit + plan-time gate live (control-change-label retired PR #52, replaced by CODEOWNERS).
- **v3b FULLY SHIPPED — 15/15 + S-8 atomic ship across 3 PRs.** PRs #25-#27 + #30 + #32 + #33 (sessions 41-48) for the 15 ACs; **PR #54 session-54** for v3b S-8 design + AC-1 partial + AC-2; **PR #56 session-55** for AC-1 v6 fan-out + AC-5 `slice-reviewer.md` retirement (auto-review.yml flipped to 4-specialist matrix-strategy fan-out); **PR #57 session-55** for AC-3 differential mode + AC-4 golden-PR replay + DoD-13 4 fresh-context persona reviews + verification.md final population. Multi-agent suite is the live review path on main.
- **v3c shipped — sessions 50+51+52+53 batch landed + session-54 spec amendment + session-55 multi-agent ship.** Sessions 50-52 batch (PRs #36-#42 + #44-#47 + #49 + #50). Session 53 PR #52 P0b-structural (CODEOWNERS migration; pre-commit-verify deprecation; arch-smell qualitative reframing). Session 54 PR #54 spec 72c amendments per /ultrareview prior-art audit application. Session 55 PR #56 + #57 closed v3b S-8 atomically. **v3c efficiency layer remaining for session 56+:** k=2 default flip (highest single-lever); anti-pattern catalogue; verification.md final-state convention; AC-3 persona-side prompt-input wiring; live persona drift detection; multi-provider 3rd-agent reviewer; Stryker mutation testing; etc. (see HANDOFF-SESSION-55 §"v3c carry-overs" for full list).

### Built (on main as of `6440afd`; **session 66 ships S-M1 marketing landing slice fully on main** via PR #92 P0 hardening + PR #93 P1 page composition / next/font / utility classes + PR #94 P2+P3 `/start` HTTP 404 + verification.md final-state. Cohesive Vercel preview LIVE at `construct-dev.vercel.app`. Session-64 #87 S-F2 document-shell + session-63 #85 S-INFRA-synthetic-fixtures + session-62 #83 S-F7-β rebase + session-61 #80 S-F4 trust chip + #81 plan-review default-flip + session-60 infra PRs #76/#77/#78 + session-59 #74 S-F3 phase nav + session-56-58 v3c efficiency layer + S-F1 + S-F7-α all on main)

```
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts          — S-F7-α (PR #20)
src/lib/store/{dev-store,index,scenario-loader,types}.ts          — S-F7-α (PR #20)
src/lib/store/scenarios/{cold-sarah,sarah-mid-build}.json         — S-F7-α (PR #20)
src/app/globals.css + src/styles/tokens.ts + src/components/ui/button.tsx + public/images/README.md + tests/unit/tokens.test.ts  — S-F1 design tokens (session 29 + session-35 wrap PR #23 `92f77d7`; 65 `--ds-*` tokens; CSS↔TS parity test; 68g C-V1 + C-V13 🟢)
src/components/phase-nav/{PhaseStepper,JourneyMapRail,LockedSection,state,copy,types,index} + tests/unit/components/phase-nav/* + tests/unit/app/page.test.tsx + src/app/page.tsx demo  — S-F3 phase nav (session 59 PR #74 `ed4300f`; 6 phase-nav test files / 35 unit + 3 landing-demo smoke; 68g C-V6 + C-V12 🟢)
src/lib/stripe/client.ts + package.json + lockfiles               — Stripe pin (S-INFRA-1, PR #22)
.claude/hooks/{line-count,session-start,tdd-first-every-commit,exit-plan-review,read-cap,wrap-check,tdd-guard,pre-push-dod7}.sh  — v3a + v3b (pre-commit-verify removed PR #52)
.github/CODEOWNERS                                                — control-plane gate (PR #52; replaced hooks-checksums + control-change-label)
.github/workflows/{eslint-no-disable,pr-dod,shellspec,auto-review,gitleaks,ci}.yml  — v3a + v3b CI gates (control-change-label.yml removed PR #52)
scripts/{verify-slice,git-state-verifier,eslint-no-disable}.sh    — v3a control plane
docs/eslint-baseline-allowlist.txt + docs/tdd-exemption-allowlist.txt  — v3a allowlists
vitest.config.ts                                                  — coverage threshold + lcov reporter
tests/shellspec/                                                  — v3a + v3b meta-tests
.claude/agents/{slice-reviewer,acceptance-gate,ux-polish-reviewer}.md  — v3b S-6 personas (PR #30 + amended PR #37 / PR #40 / PR #41 / PR #49). slice-reviewer.md retires at session-55 atomic flip with the multi-agent suite (per session-54 PR #54 AC-5).
.claude/agents/criterion-2-exceptions.yaml                         — structured §Exceptions catalogue (PR #49)
.claude/agents/reviewer-{security,architecture,correctness,style}.md — v3b S-8 4 specialist personas (PR #54; ≤200L target; include-by-reference for verdict vocab + JSON envelope; orchestrator wiring deferred to session 55)
docs/workspace-spec/{72-engineering-security,72a-preview-deploy-rubric,72b-adversarial-review-budget,72c-multi-agent-review-framework}.md  — engineering-security spec suite (72c amended PR #36 + PR #37 + PR #41)
CLAUDE.md §"Verdict vocabulary" rewritten for Conventional Comments — PR #41
CLAUDE.md citations: Hillel Wayne TDD, Mikado, PMI WBS, Cline + Plan Mode — PR #38
CLAUDE.md §"AC arithmetic check" → §"100% rule (AC arithmetic)" — PR #38
docs/slices/S-INFRA-rigour-v3a-foundation/                        — v3a slice docs
docs/slices/S-INFRA-rigour-v3b-subagent-suite/                    — v3b slice docs
docs/slices/S-INFRA-arch-smell-trigger/{acceptance,verification}.md — v3b S-7 (PR #32)
docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md    — v3b S-8 setup (PR #33)
docs/slices/S-INFRA-v3c-rubric-extension/{acceptance,verification}.md — v3c rubric ext (PR #37 + #42)
docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-easy/{acceptance,verification,security}.md — v3c citations slice (PR #38)
docs/slices/S-INFRA-auto-review-slice-resolver-fix/{acceptance,verification,security}.md — workflow fix (PR #39)
docs/slices/S-INFRA-v3c-rubric-extension-2/{acceptance,verification,security}.md — §Exception (e) (PR #40)
docs/slices/S-INFRA-AC-5-conventional-comments-impl/{acceptance,verification,security}.md — Conv Comments schema (PR #41)
docs/slices/S-INFRA-auto-review-findings-comment/{acceptance,verification,security}.md — comment posting (PR #45 MERGED)
docs/slices/S-INFRA-AC-5-examples-migration/{acceptance,verification,security}.md — §Examples migration (PR #44 OPEN)
docs/slices/S-INFRA-derive-verdict-script-extract/{acceptance,verification,security}.md — verdict arithmetic extraction (PR #46 OPEN)
docs/slices/S-INFRA-auto-review-resolver-parser-extract/{acceptance,verification,security}.md — resolver+parser extraction (PR #47 OPEN)
scripts/derive-verdict.sh + tests/shellspec/derive-verdict.spec.sh         — verdict arithmetic + 28 cases (PR #46 + PR #54 `--multi` extension; 16 single-mode + 12 multi-mode)
scripts/auto-review-slice-resolve.sh + tests/shellspec/auto-review-slice-resolve.spec.sh — resolver + 8 cases (PR #47)
scripts/auto-review-parse.sh + tests/shellspec/auto-review-parse.spec.sh   — parser + 13 cases (PR #47)
scripts/spawn-multi-reviewer.sh + tests/shellspec/spawn-multi-reviewer.spec.sh — multi-agent aggregator + 9 cases (PR #54; aggregate subcommand only at v3b ship; fan-out side deferred to session 55)
scripts/criterion-2-exception-check.sh + tests/shellspec/criterion-2-exception-check.spec.sh — file-glob pre-filter + 15 cases (PR #49)
.github/workflows/auto-review.yml — comment-posting steps (PR #45); resolver/parser/verdict wiring (PR #46/#47); parse-failed/pipeline-crash → failure merge-gating (PR #50). **Session-55 will rewire to matrix-strategy fan-out across the 4 specialists per AC-1 verification 6.**
```

**Parked branch:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead / 53 behind main · pushed. Per HANDOFF-SESSION-59 §"Lesson 4 — S-F7-β staleness analysis": resume = rebase-and-validate (rigour-suite landed in the gap; +4 commits drift accumulated in session 60 from PRs #76/#77/#78 + wrap); recommended strategy = (a) cherry-pick replay onto fresh branch. Session 61+ candidate (P2).

**Session-60 infra ships (`.claude/**` + `scripts/**` + `tests/shellspec/**`; not src/):**
```
.claude/agents/reviewer-comment.md                                — P0 PR #76 author-time persona (110L)
.claude/hooks/comment-review.sh                                   — P0 PR #76 PostToolUse:Write|Edit hook (stub-mode 4-pattern regex + pluggable live mode + abs-path skip-list normalisation)
.claude/settings.json                                             — P0 PR #76 hook registration
tests/shellspec/comment-review.spec.sh                            — P0 PR #76 17 It-blocks across 5 Describe groups
tests/shellspec/tdd-guard.spec.sh                                 — P4 PR #77 +3 fixtures (chicken-and-egg auto-resolve · Edit-still-blocks · assertion-still-blocks)
.claude/hooks/tdd-guard.sh                                        — P4 PR #77 module-not-found distinguished from real RED (Write-only auto-allow when target file absent + module-resolve signal in vitest output)
scripts/auto-review-parse.sh                                      — P5 PR #78 validate_warn helper; warn + accept on schema-invalidity; '{}' sentinel preserved
tests/shellspec/auto-review-parse.spec.sh                         — P5 PR #78 +3 schema-validation cases; 6 pre-existing fixtures realigned to schema-valid envelopes
docs/slices/S-INFRA-reviewer-comment/{acceptance,verification}.md — P0 PR #76 slice docs
docs/slices/S-INFRA-tdd-guard-first-creation/{acceptance,verification}.md — P4 PR #77 slice docs
docs/slices/S-INFRA-parse-pipeline-schema-validation/{acceptance,verification}.md — P5 PR #78 slice docs
```

## Session 67 priorities

### P0 — AC-9 mobile-viewport closure (XS)
S-M1 ships with AC-9 in-progress (5/6 dims pre-PR verified; mobile viewport pending). Open the Vercel preview at 375×667; verify no horizontal scroll / clipped content / overlap; update `docs/slices/S-M1-marketing/verification.md` AC-9 row from in-progress → ✅ MET with observed result. Closes the open AC on a freshly-shipped slice. ~5L admin.

### P1 — S-M1.0a (8 remaining hero variants + `/dev/heroes` gallery) — L (~700L)
Path-B follow-up. Translate `/tmp/decouple-design/hero-explore/heroes_a.jsx` (302L) + `heroes_b.jsx` (334L) — over read-cap; do in 3 turns of reads. Add `HeroDeclarative` · `HeroTypographic` · `HeroProductForward` · `HeroOutcomeLed` · `HeroTwoColumn` · `HeroEmpathetic` · `HeroAtmospheric` · `HeroDiagrammatic` to `src/components/marketing/heroes/`; extend `HERO_VARIANTS` map (1 → 9 keys); add per-variant smoke tests (signature element each). Add `src/app/dev/heroes/page.tsx` rendering all 9 stacked. Closes AC-3 + completes AC-2 amended scope (in-scope at S-M1.0a = all 9). Mounts under `EnvBanner` (dev-only marker; spec 72 §9 lockdown deferred to S-F7 follow-up).

### P2 — TDD-guard auto-allow extension (carry-over from session 64 P2; reaffirmed session 66) — S (~10-20L)
Septuple-confirmed bash-heredoc/sed/awk escape across sessions 61-66. `TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch + lint-fix-refactor case detection. Would also cover degraded runner state (vitest unavailable when node_modules empty — recurred at session-65 + session-66 turn-0).

### P3 — Lockfile divergence fix (carry-over from session 64 P3) — S-M
`eslint-plugin-react-hooks@7.0.1` (npm) vs `7.1.1` (pnpm); investigate why S-INFRA-1 dual-lockfile guard didn't catch + repair. Persisted unresolved across 3 sessions.

### P4 — AC-2 hooks-checksums + control-change-label decision (carry-over from session 64 P4) — XS decision + S-M impl
Aspirational across 5 sessions: `.claude/hooks-checksums.txt` + `.github/workflows/control-change-label.yml` + `scripts/generate-hooks-checksums.sh` referenced in CLAUDE.md L155-L158 do NOT exist on disk. Decide: ship the missing files OR strike CLAUDE.md references.

### P5 — `COMMENT_REVIEW_SPAWN=1` opt-in trial (carry-over from session 64 P5) — XS-S
Provision local `ANTHROPIC_API_KEY`; opt-in for 1-2 src/ slices. Hypothesis: live mode distinguishes HANDOFF-doc lineage (allowed) from `verification.md` provenance (forbidden) — would suppress the false positive that fired on `SESSION-CONTEXT.md` "Session N" headers (recurred 4 times this session) and `HANDOFF-SESSION-N.md` lineage.

### P6 — Reviewer-architecture watchlist continues (observational)
Cumulative 2/6 catches; retain bar met (≈ 1-per-3 cadence). Monitor next 3 src/ slices for sustained signal. No action required unless silent across the next 3 src/ slice triggers.

### Cohesive-product trajectory (re-cadenced post-S-M1 ship)

- ✅ **First cohesive Vercel preview SHIPPED** (session 66 — `/` renders the marketing landing)
- 4-5 sessions to user-testable Build phase end-to-end (S-B0 entry → bank-connect flow → first artefact)
- 9-12 sessions to all 5 phases minimally populated
- 17+ sessions to production-grade

### Synthetic-deliberate-injection gate UNCHANGED
Live persona regression detection operational (PR #85, session 63). Every persona/orchestrator/synthetic-content change triggers 4× live `claude -p` invocations and asserts each persona flags its dimension's planted defect (4/4 PASS).


## Scope ceiling

Single-P0 session. S-F1 (or whichever priority you pick) is THE unblocking work. Don't add adjacent slice work; don't refactor; don't reskin. If session 51 hits the 1500-line warn mid-impl, **stop and re-slice** — ship what's complete + carry rest. Don't push past 2000. Multi-PR ambition (session 50 shipped 6 PRs) was right at the ceiling; bias toward 2-3 substantive PRs + room for review iteration on `src/` work.

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
14. CLAUDE.md moratorium: 6 candidates lifted total. 8 currently parked. Lift after 2 clean uses.
15. Don't treat failing tests as spec.
16. Don't trust kickoff-prompt factual claims without live verification. SessionStart hook surfaces live branch state; use it.
17. DoD CI gate enforces slice-verification on src/ PRs.
18. Spec 73 copy patterns are mandatory for user-facing strings.
19. Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
20. Dual-lockfile divergence guard (S-INFRA-1 session 35).
21. **Rigour > speed.** Adversarial subagent reviews used at relevant points. v3a + v3b + most of v3c on main; every commit dogfoods the rigour controls. **No checkbox theatre** — every adversarial finding addressed or explicitly deferred with reasoning.
22. Rigour-pivot programme: v3a-foundation SHIPPED · v3b-subagent-suite SHIPPED · v3c-quality-and-rewrite SHIPPING (session 50 batch landed; structural extractions + §Examples migration + verdict-coercion fixture remain).
23. **(session 50): Rebase-on-main as habit before opening any 2nd+ PR in a multi-PR session.** PR #39 + PR #40 + PR #41 all needed retroactive rebase to clear apparent-rollback findings. Make rebase the default first action.
24. **(session 50): Don't cite forward-looking schema/labels/SHAs.** PR #38 §Exception (b) citation referenced labels that didn't exist on the branch's base yet — reviewer correctly flagged. Cite current-main state only; reframe as "in-scope by declaration" if forward state is needed.
25. **(session 53): Solo-operator code-owner dynamic.** CODEOWNERS gate self-deadlocks for solo operator (GitHub author-cannot-self-approve hard rule); branch-protection `require_code_owner_reviews=true` is ON; merge of any control-plane PR requires conscious admin-bypass click ("Merge without waiting for required review"). By design, not a bug. Surface this expectation upfront when opening any control-plane PR. Honoured in session 54 (PR #54 admin-bypass merge).
26. **(session 53): AC-drafting style smell.** Don't draft AC verification steps as literal grep checks (`grep -c "X"` → 0); use semantic checks ("the active rule no longer uses X as a trigger; rationale-mention OK"). PR #52 took 4 rounds of doc-drift iteration on this exact pattern. Honoured in session 54 acceptance.md re-draft.
27. **(session 55): `verification.md` is final-state, not a running log.** Append-as-you-go creates round-N+1 internal-consistency findings — PR #56 rounds 5/8/11 each surfaced an inconsistency caused by the prior round's appended row (DoD count stale; "rounds 1-3 below" pointing at a now 7-round log; convergence-call vs DoD-3 ✅ contradiction). Round-by-round multi-agent log lives in HANDOFF-{N}.md or the PR description; `verification.md` captures the ship state, assembled at slice wrap. Codified at CLAUDE.md §Engineering conventions §Definition of Done #1 (session 56).
28. **(session 55): Don't freeze AC text more ambitious than the implementation budget.** Session-54 AC for AC-3 + AC-4 promised live-replay tolerances + persona-side prompt-input wiring + quarterly cron + persona-file SHA tracking; none landed at v3b ship and 5 of PR #57's first 12 findings were ac-gap on this drift. PR-B doubled as an AC-amendment vehicle. When freezing AC at design-only PRs, anchor §In scope / §Out of scope to a concrete implementation budget for the next session, not aspirational scope; defer the rest to v3c carry-overs explicitly.
29. **(session 58): Pre-priority spec-gate verification.** Before treating a kickoff or SESSION-CONTEXT priority labeled "per spec X §Y" as authorized, grep that section's gating IF-clauses verbatim. Paraphrases routinely collapse gating IF-clauses with post-trigger conclusions; quote the gating, not the conclusion. Sessions 57 (F5c → v3a-foundation OOS, caught at PR review post-push, admin-bypass override needed) and 58 (spec 72c §7 synthetic-fixtures "first-3-src-slice retain/drop" precondition, caught pre-code at plan-vs-spec cross-check) each had kickoff paraphrases shipping or attempting work against unmet preconditions. Codified at CLAUDE.md §Planning conduct (PR #72 session-58 wrap addition).

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct, Verdict vocabulary (Conventional Comments).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · spec 72a/b/c · spec 73 · `docs/slices/S-INFRA-rigour-v3{a,b}-*/acceptance.md`.
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`.

## Branch

### Branch state at session-66 wrap (verified live)

- **Wrap branch:** `claude/decouple-session-66-i8x4J` (sequential single-branch pattern continues; 13 sessions in a row 54→…→66 on this pattern).
- **`main` tip:** `6440afd` (post-PR-#94 merge — S-M1 ships fully).
- **Open PRs at session-66 wrap:** wrap PR opens after this commit. None other open at wrap.
- **Closed/merged this session:** PR #91 (session-65 follow-up wrap docs, `bae0751`); PR #92 (P0 hardening + AC-8 + slice-doc + tests, `6e4292a`); PR #93 (P1 page composition + next/font + utility classes, `3e05aa8`); PR #94 (P2+P3 `/start` + verification.md final-state, `6440afd`); PR #89 closed as superseded.
- **Live rigour gates** updated this session: `auto-review.yml` gains `paths-ignore: ['docs/design-source/**']` + `:(exclude)docs/design-source` pathspec on both `git diff` invocations in `brief-compose` (handles design-source-bundled PRs without crashing parsers — empirically validated by clean parse on PR #91 + 3 session PRs vs PR #90's parse-failed). All other gates unchanged.
- **AC-2 hooks-checksums + control-change-label mechanism is ASPIRATIONAL** (sessions 61-66 unresolved; P4 carry-over).
- **AC-2 acceptance-gate** + **AC-3 ux-polish-reviewer** still shipped + dormant. **AC-3 ux-polish-reviewer first formal trigger window** is the S-M1.0a PR (next src/ UI surface).
- **AC-4 retain/drop measurement** cumulative through session 66: reviewer-correctness 8/6 STRONG retain · reviewer-style 8+/6 STRONG retain · reviewer-security 3/6 MODERATE+ retain (FIRST MARKETING-SLICE CATCH on PR #94 round 1: 13-item §11 checklist gap) · reviewer-architecture 2/6 (PR #87 page-wrapper + PR #90 retroactive AC-8 token bypass — meets ≈ 1-per-3 cadence retain bar). Cohesive-product cohort 6 src/ slices through.


### v3c / v3b trajectory + remaining rigour work

**The big picture (layman summary):** rigour-suite v3b programme **canonically complete on main**; v3c efficiency layer **substantially advanced**. Session 57 shipped 3 PRs delivering the differential-mode token-cost loop (PR #63), F5c origin/main-anchored ratchets for ESLint + coverage thresholds (PR #64; admin-bypass override on Path A vs v3a-foundation-slice scope-creep concern), and the local pre-flight self-review with slash command + pre-push hook (PR #65). Multi-agent suite at **k=2 default**: n=3 calibration data points collected this session (mean 2.7 rounds, target 2; PR #63 outlier driven by a real CRITICAL protocol bug). Differential mode FIRST FIRED in the wild on PR #65 round 2 (4 fixes cleanly omitted, 3 deferred re-emitted, 1 new caught — spec 72c §6 token-cost loop closed end-to-end). k=2 quorum FIRST FIRED on PR #64 round 2 (architecture + correctness on F5c scope-creep → block).

**Remaining work shape (v3c efficiency layer + post-v3b carry-overs ranked):**

| Piece | Size | Status | Why |
|---|---|---|---|
| **Synthetic-deliberate-injection per-persona fixtures** (P3 deferred from session 57 → P1 session 58) | M (~200L) | v3c carry-over per spec 72c §7 + §9 | Per-specialist tests-of-prompt: deliberately-broken diff each specialist SHOULD catch. Closes per-persona regression-detection that golden-replay can't isolate. |
| **npx version pin (auto-review.yml + preflight-review.sh)** (P2 session 58) | S (~30L) | session-57 carry-over (P2 round-1 deferred F4) | OWASP A08:2021 supply-chain hardening. Both invocation sites should pin together. |
| **F5c follow-up: v3a-foundation slice "Out of scope" cleanup** (P3 session 58) | S (~10L) | session-57 carry-over (P1 admin-bypass loose end) | Doc consistency with the now-shipped session-57 P1 work. Resolves the documented scope-conflict from the Path A override. |
| **AC-3 per-specialist post-round prompt-side wiring** | M (~150L) | session-57 partial — brief-job + aggregator sides shipped; per-specialist post-round-N filter still mechanically separate | Continues v3c efficiency layer; would reduce specialist output cost on round 2+ further by scoping per-specialist `was_in_prior` filtering. |
| **S-F1 first src/ slice** | L (~400-600L) | strategically still deferred | Activates AC-4 retain/drop measurement clock + ux-polish-reviewer; n>=3 calibration data on real `src/` workload |
| **Live persona drift detection (quarterly cron)** | M | spec 72c §9 | Recurring API budget; out-of-scope of session-58 P1-P3 picks |
| **Multi-provider 3rd-agent reviewer (GPT/Gemini)** | L | spec 72c §"Out of scope" | Cross-provider diversity; future session |
| **S-F1 first src/ slice** (P4 session 58+) | medium (~400-600L) | strategically deferred | Lead picks above improve the auto-review pipeline ahead of S-F1; S-F1 ships into a more efficient pipeline + collects the n=3 src/ calibration data point. Activates AC-4 retain/drop measurement clock + first exercise of `ux-polish-reviewer` persona on real UI surface. |
| **Live persona drift detection** | medium (live `claude -p` per replay seed) | gated on API budget | Quarterly cron drift workflow per spec 72c §9. Pairs with persona-file SHA tracking (already shipped at PR #61). |
| **Comment-posting extraction** | medium (~100-150L) | architectural-smell-trigger; deferred | No clustered findings yet through PR #61. Build-then-measure. |
| **Multi-provider 3rd-agent reviewer** | large | v3c carry-over per spec 72c §9 | Claude + GPT + Gemini cross-check. Defer until k=2 false-negative rate calibrates per §Revisit trigger. |
| **Stryker mutation testing on persona prompts** | medium | v3c carry-over | |
| **Structured-findings JSON Schema validation** | small-medium | v3c carry-over per spec 72c §9 | |

**Net: v3b shipped; v3c efficiency layer 4 PRs in (sessions 50-56); session 57 picks from the ranked queue above (P0-P3) with AC-3 persona-side wiring as the highest-ROI carry-over remaining.**

### Next session (67) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. Wrap PR for session 66 (whatever number GitHub assigns) should be merged at session 67 start; verify against live source. If not yet merged, decide whether to merge first or branch from session-66 wrap branch HEAD.
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Sequential single-branch pattern continues — `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.
3. **Run `npm install` if `node_modules/` is empty.** Sessions 65 + 66 each hit this on first impl write — vitest unavailable → TDD-guard couldn't determine RED/GREEN → all writes blocked until `npm install` ran. Front-load this before any code.
4. **AC-9 mobile-viewport closure first.** Open the Vercel preview at 375×667 (production: `construct-dev.vercel.app`); verify no horizontal scroll / clipped content / overlap; update `docs/slices/S-M1-marketing/verification.md` AC-9 row from in-progress → ✅ MET with the observed result. ~5L admin. Closes the open AC on the just-shipped slice.
5. **Confirm priority with user.** P1 recommended = **S-M1.0a — 8 remaining hero variants + `/dev/heroes` gallery** (path-B follow-up; ~700L). P2-P5 = carry-overs. User picks.
6. **If P1 (S-M1.0a):** read `/tmp/decouple-design/hero-explore/heroes_a.jsx` (302L) + `heroes_b.jsx` (334L) — over read-cap; do in 3 turns of reads. Translate each variant to TS; extend `HERO_VARIANTS` map; add per-variant smoke tests. Add `src/app/dev/heroes/page.tsx` rendering all 9 stacked. Bash heredoc/sed escape for layout if TDD-guard blocks (septuple-confirmed workaround). After this lands, AC-2 amended (in-scope = 9) and AC-3 both MET; S-M1.0a ships and S-M1 slice closes fully.
7. **If P2-P5 (carry-overs):** rigour queue-drain. P2 TDD-guard env hatch · P3 lockfile divergence · P4 AC-2 hooks-checksums decision · P5 COMMENT_REVIEW_SPAWN trial.
8. **Live rigour gates** — every commit dogfoods them. Multi-agent auto-review at **k=2 default + differential mode + per-specialist filter + TDD-guard + parser schema validation + author-time comment review + plan-review default-spawn + synthetic-deliberate-injection per-persona regression detection + design-source path-ignore + design-source diff-exclude (NEW session 66)**. Expect 1-2 rounds per PR.
9. **CODEOWNERS solo-operator pattern (#25)** — most candidates touch CODEOWNERS-protected paths; admin-bypass merge expected.
10. **Reviewer-architecture retain/drop trigger window** — cumulative 2/6; meets ≈ 1-per-3 cadence retain bar. S-M1.0a is the next formal trigger window. No drop verdict justified at current cadence.
11. **Constraint #29 (pre-priority spec-gate verification):** before treating any "per spec X §Y" priority as authorized, grep that section's gating IF-clauses verbatim.
12. **Pre-priority shipped-artifact verification:** before treating "first src/ slice" or fresh-build framing as authorized, `ls docs/slices/` and `git log --grep` for shipped-artifact evidence.
13. **PR-DoD literal-regex requirement (NEW session 66):** when authoring multi-doc PR bodies that touch `src/`, repeat the canonical `docs/slices/S-XX/verification.md` path as a literal string (not brace-expanded `{a,s,t,v}.md`) — `pr-dod.yml` greps for the literal regex `docs/slices/S-[A-Za-z0-9-]+/verification\.md` and brace expansion fails the match.
14. **Source-of-truth precedence rule** — when the user's Claude AI Design canvas (committed at `docs/design-source/{slug}/`) conflicts with the spec, the design canvas wins for visual treatment + section structure; the spec stays as positioning copy backstop only.


## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-55 additions (atop session-54):

```
docs/HANDOFF-SESSION-55.md                                        — session 55 retro (NEW)
docs/slices/S-INFRA-persona-suite-v2-multi-agent/verification.md  — final-state evidence for AC-1 + AC-2 + AC-3 + AC-4 + AC-5 (PR #57 ship)
docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md    — multiple session-55 amendments (AC-3 §Outcome / §In scope / §Out of scope; AC-4 §Outcome / §Verifications 2/3/4/5; AC-5 §In scope) reflecting the v3b deterministic-replay ship vs the session-54 aspirational scope
.github/workflows/auto-review.yml                                 — REWRITTEN as 3-job matrix-strategy fan-out (brief → specialist matrix → aggregate); new comment marker `auto-review-comment:multi-agent` (PR #56 MERGED @ 80ba85b)
.github/workflows/persona-fixtures.yml                            — NEW path-filtered golden-PR replay CI; `actions/checkout@SHA` pinned (PR #57 MERGED @ 83421c8)
.claude/agents/slice-reviewer.md                                  — DELETED (-205L; retired session 55 atomic with PR #56 workflow flip per AC-5)
scripts/spawn-multi-reviewer.sh                                   — extended with `--differential --prior-findings <path>` flag (PR #57); annotates `was_in_prior` + emits `prior_findings_resolved` + `token_metrics` count summary
tests/shellspec/spawn-multi-reviewer.spec.sh                      — 13 cases (9 prior + 4 new for AC-3 verifications 2/3 + 2 validation)
tests/personas/run-replay.sh                                      — NEW deterministic aggregator-only replay harness (PR #57)
tests/personas/golden/pr-30/{README.md,diff.patch,prior-findings.json,prior-verdict.json}  — NEW seed-of-1 fixture pinned to PR #30 merge SHA `792b73ef40dfad90b7db05c3d01d18559183e3ae` (PR #57)
.claude/agents/reviewer-correctness.md                            — minor fix at PR #57 round 0 (DoD-13): redirect dangling `slice-reviewer.md §Output format` reference to in-file label-assignment defaults
.claude/agents/reviewer-style.md                                  — minor extensions at PR #57 round 0 (DoD-13): "no PR provenance in persistent comments" added to anti-pattern catalogue at criterion 5; `severity` added to verdict-coercion discard list
.claude/agents/acceptance-gate.md                                 — delegation-reference update (slice-reviewer → multi-agent reviewer suite; PR #56)
.claude/agents/ux-polish-reviewer.md                              — delegation-reference update (same; PR #56)
scripts/{auto-review-parse,derive-verdict,criterion-2-exception-check,auto-review-slice-resolve}.sh — header-comment cleanup (provenance trim + slice-reviewer dangling-ref redirect; PR #56 + #57)
CLAUDE.md                                                         — §Hard controls Gates-this-slice-ships table updated to multi-agent row; §Subagent file locations + §Invocation conventions rewritten to 4-specialist matrix-strategy narrative (PR #56)
```

## Rigour-suite completeness (layman summary)

| Programme | Status | Sessions | Key artefacts on main |
|---|---|---|---|
| **v3a-foundation** | ✅ SHIPPED | 33-41 (PR #24) | `verify-slice.sh`, `tdd-first-every-commit`, plan-time gate |
| **v3b subagent suite (S-1 to S-7)** | ✅ SHIPPED | 41-48 | `auto-review.yml`, slice-reviewer + acceptance-gate + ux-polish-reviewer personas, arch-smell trigger |
| **v3b S-8 multi-agent persona suite v2 (full ship: design + AC-1 + AC-2 + AC-3 + AC-4 + AC-5 + DoD-13)** | ✅ FULLY SHIPPED | 54 (PR #54) + 55 (PR #56 + #57) | spec 72c amended; 4 specialist personas; orchestrator + aggregator + `--differential --prior-findings`; auto-review.yml 3-job matrix-strategy fan-out; `slice-reviewer.md` retired; golden-PR replay seed-of-1 + `run-replay.sh` + path-filtered CI; DoD-13 4 fresh-context persona reviews; 13 ShellSpec cases on aggregator |
| **v3c rubric extension §Exceptions (a)-(e)** | ✅ SHIPPED | 49-52 | `slice-reviewer.md` §Exceptions extracted to `criterion-2-exceptions.yaml` + scripted pre-filter |
| **v3c citations + 100%-rule rename** | ✅ SHIPPED | 50 (PR #38) | CLAUDE.md citations: Hillel Wayne TDD, Mikado, PMI WBS, Cline + Plan Mode |
| **v3c slice-resolver fix** | ✅ SHIPPED | 50 (PR #39) | `auto-review.yml` resolver |
| **v3c Conventional Comments schema** | ✅ SHIPPED | 50-51 (PR #41 + #44) | CLAUDE.md §Verdict vocabulary; persona files emit Conv Comments labels |
| **v3c auto-review findings as PR comment** | ✅ SHIPPED | 51 (PR #45) | `auto-review.yml` comment-posting steps |
| **v3c verdict-derivation script extract** | ✅ SHIPPED | 51 (PR #46) | `scripts/derive-verdict.sh` + 28-case shellspec (16 single-mode + 12 multi-mode session 54) |
| **v3c resolver + parser script extract** | ✅ SHIPPED | 51 (PR #47) | `scripts/auto-review-{slice-resolve,parse}.sh` + 21-case shellspec |
| **v3c criterion 2 §Exceptions extraction** | ✅ SHIPPED | 52 (PR #49) | YAML + scripted pre-filter |
| **v3c parse-failed + pipeline-crash → failure merge-gating** | ✅ SHIPPED | 52 (PR #50) | `auto-review.yml` rigour-malfunction gate |
| **v3c P0b-structural (CODEOWNERS · pre-commit-verify drop · arch-smell qualitative)** | ✅ SHIPPED | 53 (PR #52) | `.github/CODEOWNERS`, hooks deleted, CLAUDE.md rewrites |
| **v3c spec 72c session-54 prior-art audit application** | ✅ SHIPPED | 54 (PR #54 spec amendment) | spec 72c §3 + §4 + §5 + §7 + §9 + §10 + Status amended (4-partition + majority-vote + golden-replay) |
| **v3c k=2 default flip (spec 72c §5 §Revisit trigger fired early at n=2 infra calibration)** | ✅ SHIPPED | 56 (PR #59) | spec 72c §5 + §10 + Status amended; `derive-verdict.sh` default `K=2`; `spawn-multi-reviewer.sh` live invocation flipped; shadow rename `_k2` → `_k1`; CLAUDE.md gates table + invocation conventions updated |
| **v3c anti-pattern catalogue + DoD #1 final-state convention + #27/#28 promotion** | ✅ SHIPPED | 56 (PR #60) | CLAUDE.md §Coding conduct 5-bullet catalogue (PR/session/slice provenance · sibling-step refs · narration of WHAT · hard-coded counts · code lineage); DoD #1 amended; SESSION-CONTEXT register +#27 +#28 |
| **v3c §"Not yet in scope" rewrite + persona-file SHA tracking** | ✅ SHIPPED | 56 (PR #61) | CLAUDE.md §"Not yet in scope" categorised; `prior-verdict.json` `personas_sha256` field; `run-replay.sh` cross-platform drift check (sha256sum/shasum/SKIP triple) |
| **v3c comment-posting extraction** | 🟡 DEFERRED (smell-trigger build-then-measure) | — | Defer until findings cluster on `auto-review-post-comment.sh` block |
| **v3c synthetic-deliberate-injection per-persona fixtures** | 🔵 v3c CARRY-OVER | — | Per spec 72c §7 + §9 (golden-replay primary at v3b ship; synthetic adds when 4-partition validated) |
| **v3c carry-overs (Stryker mutation · property-based fuzz · multi-provider 3rd reviewer · structured-findings JSON Schema · multi-provider consensus framework full spec 72d)** | 🔵 OUT OF SCOPE | — | Per spec 72c §9; not blocking S-F1 or main programme |

**Net state at session-57 wrap:** **rigour-suite v3b programme canonically complete + v3c efficiency layer substantially advanced.** Session 57 shipped 3 PRs: P0 differential-mode token-cost loop (PR #63 — closes spec 72c §6 brief-job side; FIRST FIRED in the wild on PR #65 round 2); P1 F5c origin/main-anchored ratchet for ESLint count + coverage thresholds (PR #64 — admin-bypass override on Path A; doc cleanup deferred to session 58 P2); P2 pre-flight self-review with `/preflight` slash command + opt-in pre-push hook (PR #65 — author-time review compounding with k=2 default + anti-pattern catalogue). **Session 58 lead pick = synthetic-deliberate-injection per-persona fixtures** (deferred from session 57 P3 per budget call). See §"Session 58 priorities" for the ranked roadmap and HANDOFF-SESSION-57 §"v3c carry-overs (still pending after session 57)" for the full deferred list.

## Session 67 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD origin/main                                       # expected: post-session-66-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm session-66 PRs all merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
ls node_modules/.bin/vitest                                                  # expect file; if absent, npm install before any src/ write
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 67?** Recommended P0 = **AC-9 mobile-viewport closure** (~5L admin to verify Vercel preview at 375×667 + update verification.md). P1 = **S-M1.0a — 8 hero variants + `/dev/heroes` gallery** (~700L; closes AC-3 + AC-2 amended scope). P2-P5 = carry-overs (TDD-guard env hatch · lockfile divergence · hooks-checksums decision · COMMENT_REVIEW_SPAWN trial). User picks.
2. **CODEOWNERS solo-operator pattern (#25).** S-M1.0a touches `src/components/marketing/heroes/**` + `src/app/dev/heroes/**` + `tests/**` + `docs/slices/**` (all CODEOWNERS-protected); admin-bypass merge expected.
3. **k=2 default + §Revisit trigger calibration.** n=23 calibration data through session 66 (mean ~1.7 rounds; PR #94 was 3 rounds with substantive findings each round). Continues; flip-back-to-k=1 trigger only if first-3-src-slice false-negative rate >20%.
4. **Reviewer-architecture retain/drop trigger window.** Cumulative 2/6 (PR #87 + PR #90 retroactive); meets ≈ 1-per-3 cadence. S-M1.0a is the next formal trigger; if architect catches → 3/7. If silent across the next 3 src/ slice triggers → re-evaluate.
5. **Reviewer-security upgrade signal.** PR #94 round 1 was the first formal security catch on a marketing slice (13-item §11 checklist gap in verification.md). Cumulative 3/6 MODERATE+. Next 3 src/ slices = whether MODERATE+ becomes STRONG.
6. **Cohesive-product trajectory now ACHIEVED on main.** `construct-dev.vercel.app` renders the marketing landing on `/`. Session 67 onwards builds out the journey end-to-end (Build phase entry first; spec 68b B-T1..D4). Estimates re-cadenced post-S-M1: 4-5 sessions to user-testable Build; 9-12 to all 5 phases minimally populated; 17+ to production-grade.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Quote, don't paraphrase, when invoking a spec.** Constraint #29 codified.
- **Pre-priority shipped-artifact verification.** `ls docs/slices/` + `git log --grep` before treating fresh-build framing as authorized.
- Live gates: `auto-review.yml` (k=2 + differential mode + per-specialist filter + design-source path-ignore + diff-exclude LIVE post-PR-#92) · `eslint-no-disable.yml` · `coverage-threshold.yml` · `pr-dod.yml` (literal-regex requirement; brace expansion fails) · `.github/CODEOWNERS` · `persona-fixtures.yml` · `pre-push` hook (opt-in) · `shellspec.yml` · `comment-review.sh` PostToolUse advisory · `tdd-guard.sh` first-creation auto-resolve · `auto-review-parse.sh` schema validation warn+accept.
- **Comments anti-pattern catalogue:** stub-mode hook flags 4 of 5 catalogue items at write-time; live mode would cover WHAT-narration. Note: `SESSION-CONTEXT.md` + `HANDOFF-SESSION-N.md` + `acceptance.md`'s deferred-S-M1.0a refs are FALSE POSITIVES (lineage IS the doc's purpose for SESSION-CONTEXT/HANDOFF; AC-deferred refs in slice docs ARE legitimate provenance for cross-slice references). Strip session-N refs from non-HANDOFF/non-SESSION-CONTEXT docs.
- **Verification.md is final-state** (constraint #27): assemble at slice ship, not running log.
- **Don't freeze AC text more ambitious than impl budget** (constraint #28). Reaffirmed session 66 with S-M1 AC-2 amendment to formally split in-scope (1 hero) vs deferred (8 hero + gallery → S-M1.0a).
- **Pre-priority spec-gate verification** (constraint #29): grep gating IF-clauses verbatim.
- Auto-review iteration stop-signal: at k=2 + differential mode + per-specialist filter, expect 1-2 rounds per PR. Hard-cap at 4 rounds.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Architectural-smell-trigger:** qualitative judgement per CLAUDE.md.
- **Verdict vocabulary:** Conventional Comments labels + `(blocking)`. Personas emit findings; orchestrator derives verdict via `scripts/derive-verdict.sh --multi k=2`.
- **PR-DoD literal-regex requirement (session 66 lesson):** PR bodies must literal-cite `docs/slices/S-XX/verification.md` (no brace expansion). Edits to PR body retrigger via `pull_request: edited`; no push needed.
- **Regex `/g` + `.test()` in loops is unsafe** (session 66 lesson): `lastIndex` statefulness causes false negatives. Drop `/g` for boolean existence checks.
