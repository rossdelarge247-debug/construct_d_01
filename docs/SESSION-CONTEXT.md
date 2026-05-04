# Session 64 Wrap Context Block (heading into session 65)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-64 accomplished (rolling window)

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

### Built (on main as of `765f3b0`; session 64 ships #87 S-F2 document-shell on main; session-63 #85 S-INFRA-synthetic-fixtures + session-62 #83 S-F7-β rebase + session-61 #80 S-F4 trust chip + #81 plan-review default-flip + session-60 infra PRs #76/#77/#78 + session-59 #74 S-F3 phase nav + session-56-58 v3c efficiency layer + S-F1 + S-F7-α all on main)

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

## Session 65 priorities

> **Pivot framing:** session 64 shipped S-F2 document-shell (PR #87 merged at `765f3b0`; first cohesive primitive integrating PhaseStepper + TrustChip + Sarah's-Picture-shaped stub content under the three-column shell). The connective tissue is now in place; phase routes are navigable. Session 65 P1 = S-M1 marketing rewrite — public landing replacing the placeholder + demo grid. P1 + S-F2 together = first cohesive Vercel preview. Reviewer-architecture's first formal retain catch validated on PR #87 (page-wrapper scope-creep / `bodyAs` prop solution); session 65 (S-M1) is the second formal trigger for the retain/drop verdict.

### P1 — S-M1 marketing rewrite (highest-leverage cohesive-product slice)

Public landing page replacing the "Decouple — under active rebuild" placeholder + S-F1/S-F3/S-F4/S-F2 demo grid at `src/app/page.tsx`. Spec 71 §3 L314 + spec 42 positioning verbatim (5-phase journey · "complete settlement workspace" framing · NOT "financial disclosure tool"). The marketing surface is the user's first touch; landing the rewrite alongside the shipped S-F2 shell gives the first cohesive Vercel preview surface. M.

### P2 — TDD-guard auto-allow extension (carry-over from session 64 P2, not shipped)

`TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch + lint-fix-refactor case detection. Sextuple-confirmed bash-heredoc/sed/awk escape across sessions 61-64. Formalises the workaround into an audited env flag instead of ad-hoc bash workarounds. Wrap C-pick candidate. S — ~10-15L hook change + shellspec cases.

### P3 — Lockfile divergence fix (carry-over from session 64 P3, not shipped)

`package-lock.json` pins `eslint-plugin-react-hooks@7.0.1`; `pnpm-lock.yaml` pins `7.1.1`. CI uses npm ci → 7.0.1; local pnpm install → 7.1.1. Investigation-heavy — S-INFRA-1 dual-lockfile divergence guard didn't catch the version drift; figure out why + repair. S-M.

### P4 — AC-2 hooks-checksums + control-change-label decision (carry-over from session 64 P4, not shipped)

User-decision: ship the missing files (`hooks-checksums.txt` + `control-change-label.yml` + `generate-hooks-checksums.sh`) OR remove CLAUDE.md references. The mechanism remains aspirational across multiple sessions. XS.

### P5 — `COMMENT_REVIEW_SPAWN=1` opt-in trial (carry-over from session 64 P5, not shipped)

Provision local `ANTHROPIC_API_KEY` (already configured at repo level for CI) + opt-in for 1-2 src/ slices. Hypothesis: drops sextuple-confirmed ~3-per-PR commenting findings to ~0; also distinguishes HANDOFF-doc lineage (allowed) from verification.md provenance (forbidden) — would suppress the false positives session 64 surfaced on stub-mode HANDOFF writes. XS-S.

### P6 — S-F7-γ untested-UI tests (carry-over from session 64 P6, not shipped)

Component tests for env-banner + scenarios + reset + state-inspector + engine-workbench. Closes the untested-UI debt from S-F7-β cherry-pick rebase. Engine-workbench at 1481L is heavy; can split into multiple PRs. M-L. Could be deferred until a relevant src/ touch motivates the visit.

### Cohesive-product trajectory (re-cadenced post-S-F2 ship)

Session 64 advanced the trajectory by shipping the connective tissue (S-F2 = the document-shell primitive every workspace document renders into). Updated estimates: **2 sessions to first cohesive entry-point** (P1 lands → real landing → first pre-signup screen path); 5-7 sessions to a user-testable Build phase end-to-end; 11-14 sessions to all 5 phases minimally populated; 19+ sessions to production-grade. Cadence assumption: ~1 substantive src/ slice per session (sessions 51-64 empirics).

### Synthetic-deliberate-injection gate SHIPPED

Per spec 72c §7 first-3-src-slice gate (CONFIRMED at session-62 wrap; S-F3 + S-F4 + S-F7-β; 4-partition holds). Implementation shipped session 63 PR #85: `tests/personas/synthetic/{security,architecture,correctness,style}.diff` per-persona fixtures + expected-finding signature contracts + pure jq matcher + orchestrating runner + CI workflow. Live persona regression detection operational; 4/4 personas flag their planted defects against the signature predicates. Workflow path-filtered + skip-on-no-API-key (forks unaffected). Spec 72c §9 carry-over for live persona drift detection (quarterly cron) remains.

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

### Branch state at session-64 wrap (verified live)

- **Wrap branch:** `claude/decouple-session-64-fN1u5` (sequential single-branch pattern continued; 11 sessions in a row 54→55→56→57→58→59→60→61→62→63→64 on this pattern).
- **`main` tip:** `765f3b0` (PR #87 admin-bypass squash-merge of S-F2-document-shell). Prior: `7662b53` = session-63 wrap (PR #86). Prior: `3b17be8` = PR #85 S-INFRA-synthetic-fixtures.
- **Open PRs at session-64 wrap:** wrap PR (this branch) opens after this commit. **No carry-over open PRs** — PR #87 merged mid-session via admin-bypass per Constraint #25 (CODEOWNERS solo-operator).
- **Closed/merged this session:** PR #87 only (S-F2-document-shell; 3 rounds: R1 block · R2 approve · R3 approve on doc-only verification.md finalisation). 10 files · +485 / -13 net at merge.
- **Live rigour gates (post-session-63):**
  - `auto-review.yml` — multi-agent 4-specialist matrix at **k=2 default** + **differential mode LIVE** + **per-specialist prior-findings filter LIVE**.
  - **NEW post-session-63:** `persona-synthetic-fixtures.yml` — path-filtered live `claude -p` invocation per specialist against deliberate-injection fixtures; asserts each persona flags its dimension's planted defect (4/4 PASS gate). Skip-on-no-API-key.
  - `eslint-no-disable.yml` — count-based ratchet (HEAD vs origin/main).
  - `coverage-threshold.yml` — vitest threshold ratchet (HEAD vs origin/main).
  - `pr-dod.yml` — slice-verification reference required on `src/` PRs.
  - `persona-fixtures.yml` — path-filtered golden-PR replay CI (deterministic aggregator-only; complements live persona invocation in synthetic harness).
  - `.github/CODEOWNERS` — sole control-plane gate for protected paths.
  - `pre-push` hook (opt-in) — local pre-flight 4-specialist review.
  - `shellspec.yml` — auto-discovers `tests/shellspec/*.spec.sh`; covers 9 cases for synthetic-fixtures matcher post-session-63.
  - `comment-review.sh` PostToolUse hook — advisory; flags 4 of 5 catalogue items in stub mode; live mode opt-in via `COMMENT_REVIEW_SPAWN=1`. Skip-list extended (PR #85): `tests/personas/synthetic/*` excluded since synthetic fixtures BY DESIGN contain catalogue anti-pattern strings as planted defects.
  - `tdd-guard.sh` — first-creation auto-resolve; RED-on-existing-src case still blocks (TDD_GUARD_REDGREEN_OVERRIDE env hatch is P3 candidate for session 64).
  - `auto-review-parse.sh` — schema validation warn+accept.
  - `exit-plan-review.sh` — spawns by default; `EXIT_PLAN_REVIEW_SPAWN=0` opts out.
- **AC-2 hooks-checksums + control-change-label mechanism is ASPIRATIONAL** (HANDOFF-61 Lesson 3): `.claude/hooks-checksums.txt`, `.github/workflows/control-change-label.yml`, `scripts/generate-hooks-checksums.sh` — none exist on disk despite CLAUDE.md L155-L158 + v3a-foundation acceptance.md describing them. P5 candidate for session 62 (user-decision pick).
- **AC-2 acceptance-gate** + **AC-3 ux-polish-reviewer** still shipped + dormant until first src/ UI surface activates them.
- **AC-4 retain/drop measurement** TRIGGERED at session-62 wrap (3/3); cumulative through session 64: reviewer-style 5/5 STRONG retain · reviewer-correctness 5/5 STRONG retain · reviewer-security 2/5 MODERATE retain · reviewer-architecture 1/5 — **FIRST CATCH on PR #87** (page-wrapper scope-creep / `bodyAs` prop solution). Per CLAUDE.md retention criteria ("at least one issue per 2-3 slices"): 1/5 below threshold but the catch is significant. Session 65 (S-M1) is the second formal trigger — if architect catches there, retain (2/6 ≈ 1-per-3 cadence meets bar); if silent, formal drop verdict justified.

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

### Next session (65) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. List closed + open PRs; confirm PR #87 + session-64 wrap PR merged + no carry-over open.
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Sequential single-branch pattern continues — `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.
3. **Confirm priority with user.** Session 65 P1 recommended = **S-M1 marketing rewrite** (highest-leverage cohesive-product slice; replaces placeholder landing + demo grid). P2 = **TDD-guard auto-allow extension** (sextuple-confirmed bash escape; formalise into env hatch). P3-P6 = rigour queue-drain (lockfile divergence fix · AC-2 hooks-checksums decision · COMMENT_REVIEW_SPAWN trial · S-F7-γ untested-UI tests). User picks.
4. **If P1 (S-M1 marketing rewrite):** read spec 71 §3 L314 + spec 42 positioning verbatim (5-phase journey · "complete settlement workspace" framing · NOT "financial disclosure tool") · spec 73 copy patterns if relevant. Replace `src/app/page.tsx` placeholder + S-F1/S-F3/S-F4/S-F2 demo grid. May depend on S-F2 shell pieces or stand alone with marketing-specific layout. M.
5. **If P2 (TDD-guard env hatch):** edit `.claude/hooks/tdd-guard.sh` to detect `TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch + lint-fix-refactor case. Add shellspec cases. S — ~10-15L hook change + 2-3 fixture cases. Wrap C-pick candidate.
6. **If P3 (lockfile divergence fix):** investigate why S-INFRA-1 dual-lockfile divergence guard didn't catch the eslint-plugin-react-hooks 7.0.1-vs-7.1.1 drift. Re-sync the lockfiles + address engine-workbench:711 mutation pattern with immutable update. S-M; investigation-heavy.
7. **If P4 (AC-2 decision):** user-driven. Read CLAUDE.md L155-L158 + `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md` AC-2 description. Decide ship-the-missing-files OR remove-references. Don't auto-decide.
8. **If P5 (COMMENT_REVIEW_SPAWN trial):** export `ANTHROPIC_API_KEY` + set `COMMENT_REVIEW_SPAWN=1` in shell env before slice work. Live mode invokes `claude -p` per Write/Edit. Measure: round-1 commenting-category findings on the next 1-2 PRs vs the sextuple-confirmed ~3-per-PR baseline. Also test whether live mode distinguishes HANDOFF-doc lineage (allowed) from verification.md provenance (forbidden) — would suppress the session-64 false positives.
9. **If P6 (S-F7-γ untested-UI tests):** component tests for env-banner + scenarios + reset + state-inspector + engine-workbench. Engine-workbench at 1481L is heavy; can split. M-L.
10. **Live rigour gates** — every commit dogfoods them. Multi-agent auto-review at **k=2 default + differential mode + per-specialist filter + TDD-guard first-creation auto-resolve + parser schema validation + author-time comment review + plan-review default-spawn + synthetic-deliberate-injection per-persona regression detection**. Expect 1-2 rounds per PR.
11. **CODEOWNERS solo-operator pattern (#25)** — most candidates touch CODEOWNERS-protected paths; admin-bypass merge expected.
12. **k=2 default + post-flip §Revisit triggers** — per spec 72c §5: n=19 calibration data through session 64 (mean ~1.7 rounds across sessions 56-64; PR #87 was 3 rounds, addressing real findings each round). Continues collecting.
13. **Constraint #29 (pre-priority spec-gate verification):** before treating a kickoff/SESSION-CONTEXT priority labeled "per spec X §Y" as authorized, grep that section's gating IF-clauses verbatim. Session 64 honoured this for S-F2 — caught two kickoff drifts (path + framing) before AC freeze.
14. **Pre-priority shipped-artifact verification:** before treating any "first src/ slice" or fresh-build priority as authorized, grep `docs/slices/` and `git log --grep` for shipped-artifact evidence.
15. **Reviewer-architecture retain/drop second formal trigger** — session 65 (S-M1) is the second slice in the trigger window. PR #87 surfaced the first real architectural catch (1/5 cumulative). If architect catches on S-M1, retain (2/6 ≈ 1-per-3); if silent, formal drop verdict justified.

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

## Session 65 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD origin/main                                       # expected: post-session-64-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm PR #87 + session-64 wrap PR all merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 65?** Recommended P1 = **S-M1 marketing rewrite** (highest-leverage cohesive-product slice; replaces placeholder landing + S-F1/S-F3/S-F4/S-F2 demo grid; pairs with shipped S-F2 for first cohesive Vercel preview). P2 = **TDD-guard auto-allow extension** (sextuple-confirmed bash escape; formalise into env hatch). P3-P6 = rigour queue-drain (lockfile divergence fix · AC-2 hooks-checksums decision · COMMENT_REVIEW_SPAWN trial · S-F7-γ untested-UI tests). User picks.
2. **CODEOWNERS solo-operator pattern (#25).** Src/ slices touch `src/components/**` + `src/app/**` + `tests/**` + `docs/slices/**` (all CODEOWNERS-protected); admin-bypass merge expected. P2-P6 rigour picks also touch CODEOWNERS paths.
3. **Pre-flight + local API key.** `ANTHROPIC_API_KEY` configured at repo level (CI auto-review + synthetic-fixtures workflows both run live). Local provisioning still optional — (a) do nothing (CI catches what matters), (b) export `ANTHROPIC_API_KEY` + `COMMENT_REVIEW_SPAWN=1` for author-time live-mode subagent, (c) hybrid. P5 candidate explicitly tests live-mode value.
4. **k=2 default + §Revisit trigger calibration.** n=19 calibration data through session 64 (mean ~1.7 rounds across sessions 56-64; PR #87 was 3 rounds, real findings each round). Continues; flip-back-to-k=1 trigger only if first-3-src-slice false-negative rate >20%.
5. **Reviewer-architecture retain/drop second formal trigger.** PR #87 was the first formal trigger and surfaced the first real architectural catch in 5 slices (page-wrapper scope-creep / `bodyAs` prop solution; 1/5 cumulative). Session 65 (S-M1) is the second trigger. If architect catches → retain (2/6 ≈ 1-per-3 cadence meets the bar). If silent → formal drop verdict justified at 1/6.
6. **Cohesive-product trajectory.** Vercel preview at session-64 wrap shows the document-shell rendered with stub Sarah's-Picture-shaped content. P1 (S-M1) + shipped S-F2 = first cohesive Vercel preview. Estimates re-cadenced post-S-F2: 2 sessions to first cohesive entry-point; 5-7 to user-testable Build; 11-14 to all 5 phases; 19+ to production-grade.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Quote, don't paraphrase, when invoking a spec.** Sessions 57 + 58 had kickoff paraphrases shipping or attempting work against unmet preconditions. Constraint #29 + CLAUDE.md §Planning conduct §"Pre-priority spec-gate verification" codify this.
- **Pre-priority shipped-artifact verification** (CLAUDE.md §Planning conduct, codified session-60 wrap from HANDOFF-59 Lesson 3 + HANDOFF-60 §Lesson 4): grep `docs/slices/` and `git log --grep` for slice references before treating any priority as fresh-build. Kickoff omission of shipped state is empirically common.
- Live gates: `auto-review.yml` (k=2 + differential mode + per-specialist filter LIVE) · `eslint-no-disable.yml` · `coverage-threshold.yml` · `pr-dod.yml` · `.github/CODEOWNERS` · `persona-fixtures.yml` · `pre-push` hook (opt-in) · `shellspec.yml` · **`comment-review.sh` PostToolUse advisory (LIVE post-PR-#76)** · **`tdd-guard.sh` first-creation auto-resolve (LIVE post-PR-#77)** · **`auto-review-parse.sh` schema validation warn+accept (LIVE post-PR-#78)**.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines (constraint #19).
- **Comments anti-pattern catalogue** (PR #60): QUINTUPLE confirmed RECURRING (sessions 57+58+59+60+61). Stub-mode hook (PR #76) flags 4 of 5 catalogue items at write-time; live mode covers WHAT-narration. Mental rehearsal still helps for the WHAT class.
- **Verification.md is final-state** (constraint #27): assemble at slice ship, not running log.
- **Don't freeze AC text more ambitious than impl budget** (constraint #28).
- **Pre-priority spec-gate verification** (constraint #29 session 58): grep gating IF-clauses verbatim before treating priority as authorized.
- Auto-review iteration stop-signal: at k=2 + differential mode + per-specialist filter, expect 1-2 rounds per PR. Hard-cap at 4 rounds.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Architectural-smell-trigger:** qualitative judgement per CLAUDE.md.
- **Verdict vocabulary:** Conventional Comments labels + `(blocking)`. Personas emit findings; orchestrator derives verdict via `scripts/derive-verdict.sh --multi k=2` (default).
- **AC-4 retain/drop** activates after first 3 src/ slices ship through the full rigour pipeline. Currently 1/3.
- **TDD-guard first-creation auto-resolve** (PR #77): for new src module, write the test first via Write tool, then write the src file via Write tool — the hook now exits 0 with informational stderr when vitest emits a module-resolve error against a non-existent target. Bash-heredoc workaround still works as the manual escape.
- **Bare-assignment + `set -euo pipefail` pitfall** (HANDOFF-60 Lesson 3): in shell scripts, `err=$(failing-cmd); rc=$?` aborts under errexit even with pipefail because the assignment line is not a tested context. Use `err=$(cmd) || handler` form (where the `||` makes it tested) when capturing potentially-failing command-sub output under `set -e`.
