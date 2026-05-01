# Session 58 Wrap Context Block (heading into session 59)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-58 accomplished (rolling window)

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
- **Session 58 (this wrap):** **5 PRs merged** sequentially from `claude/decouple-session-58-ghiWv`. **PR #67** (P2) F5c doc cleanup in v3a-foundation slice. **PR #68** (P1) npx version pin to `2.1.126` (both invocation sites; OWASP A08:2021). **PR #69** (P3) per-specialist prior-findings filtering — NEW `scripts/auto-review-filter-prior.sh` (jq filter on `seen_by[]` containment) + brief-job wire + 11-case shellspec; round 1 caught real jq 1.6 portability bug + WHAT-narration anti-pattern; round 2 dogfooded the new filter end-to-end. **PR #70** (C) CLAUDE.md §"Not yet in scope" cleanup post-P3 (3 shipped removals + synthetic-fixtures gating reword). **PR #71** (D2) finding-envelope JSON Schema + `scripts/validate-finding-envelope.sh` jq validator + 17-case shellspec. P0 (synthetic-deliberate-injection per-persona fixtures) DEFERRED at turn-0 via plan-vs-spec cross-check — spec 72c §7 explicit gating: "first-3-src-slice retain/drop confirms the 4-partition holds" precondition unmet (zero src/ slices shipped). n=5 calibration: mean 1.4 rounds. WHAT-narration anti-pattern surfaced on PR #69 + PR #71 (RECURRING — author-time blindspot despite shipping the catalogue at PR #60). Differential mode + per-specialist filter end-to-end self-validated for the first time on PR #69 round 2 + repeated on PR #71 round 2.

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

### Built (on main as of `b4d7e6c`; PR #52 + PR #54 merged through session 54)

```
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts          — S-F7-α (PR #20)
src/lib/store/{dev-store,index,scenario-loader,types}.ts          — S-F7-α (PR #20)
src/lib/store/scenarios/{cold-sarah,sarah-mid-build}.json         — S-F7-α (PR #20)
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

**Parked branch:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-rigour-suite complete.

## Session 59 priorities

> **Numbering:** session 58 shipped 5 substantive PRs — P2 F5c doc cleanup (PR #67, 1 round), P1 npx version pin (PR #68, 1 round), P3 per-specialist prior-findings filtering (PR #69, 2 rounds), C CLAUDE.md cleanup (PR #70, 1 round), D2 finding-envelope JSON Schema (PR #71, 2 rounds). Mean 1.4 rounds across 5 PRs. P0 (synthetic fixtures) DEFERRED at turn-0 plan-vs-spec cross-check — spec 72c §7 gating ("first-3-src-slice retain/drop confirms the 4-partition holds") precondition unmet. Session 59 picks up from session-58 carry-overs (see HANDOFF-SESSION-58 §"Next-session priority recommendations" + §"v3c carry-overs").

### P0 — S-F1 first src/ slice (UNBLOCKING)

Multiple v3c carry-overs are downstream of S-F1: synthetic-fixtures gating (spec 72c §7) requires first-3-src-slice retain/drop data; ux-polish-reviewer activates here; AC-4 retain/drop measurement clock starts here. Until S-F1 (and 2 more src/ slices) ship, those items stay deferred. ~400-600L · 5-8 ACs.

### P1 — JSON Schema integration into auto-review-parse.sh

D2 follow-up (PR #71 shipped schema + standalone validator). Wires the validator into the parse pipeline so brief-job specialist invocations are gated on schema validity. Choices to make: parse-failed cascade vs warn + accept on schema mismatch. S-M (~50-100L) · 1-2 rounds.

### P2 — During-work review subagent for WHY-vs-WHAT comment lint

Empirical mitigation for HANDOFF-58 lesson 2 (recurring author-time anti-pattern blindness; PR #69 + PR #71 both surfaced WHAT-narration in script headers post-push). PostToolUse Write/Edit hook spawns a lightweight subagent that flags WHAT-narration before commit. M (~150L) · 2-3 rounds.

### P3 — Plan-review subagent default-spawn flip

Flip `EXIT_PLAN_REVIEW_SPAWN=1` gate to default-on. Touches `.claude/hooks/exit-plan-review.sh` + CLAUDE.md hard-controls table. S-M (~50-100L) · careful CODEOWNERS bypass + rationale needed.

### P4 — Synthetic-deliberate-injection per-persona fixtures (STILL GATED)

Spec 72c §7 precondition: "first-3-src-slice retain/drop confirms the 4-partition holds" — unmet (zero src/ slices shipped). Stays deferred until S-F1 + 2 more src/ slices ship. M (~200L).

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

### Branch state at session-58 wrap (verified live)

- **Wrap branch:** `claude/decouple-session-58-ghiWv` (sequential single-branch pattern continued).
- **`main` tip:** `4b71b34` (PR #71 D2 merge). Prior: `cded969` = PR #70 (C), `981fd6a` = PR #69 (P3), `cc79da9` = PR #68 (P1), `2115229` = PR #67 (P2), `8e9d22b` = session-57 wrap (PR #66).
- **Open PRs at session-58 wrap:** wrap PR (this branch) opens after this commit. **No carry-over open PRs** — PR #67, #68, #69, #70, #71 all merged mid-session.
- **Closed/merged this session:** PR #67 (P2 F5c doc cleanup, 1 round) · PR #68 (P1 npx version pin, 1 round) · PR #69 (P3 per-specialist prior-findings filter, 2 rounds) · PR #70 (C CLAUDE.md §"Not yet in scope" cleanup, 1 round) · PR #71 (D2 finding-envelope JSON Schema, 2 rounds). Mean 1.4 rounds.
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Unblocked since session 55; deferred again at session 58. Resumption is a session-59+ user call.
- **Live rigour gates (post-session-58):**
  - `auto-review.yml` — multi-agent 4-specialist matrix at **k=2 default** + **differential mode LIVE** + **per-specialist prior-findings filter LIVE** (post-PR-#69 P3: `scripts/auto-review-filter-prior.sh` filters `<prior-findings-NONCE>` per specialist via `seen_by[]` containment; reduces round-2+ input tokens ~4x).
  - `eslint-no-disable.yml` — count-based ratchet (HEAD vs origin/main).
  - `coverage-threshold.yml` — vitest threshold ratchet (HEAD vs origin/main).
  - `pr-dod.yml` — slice-verification reference required on `src/` PRs.
  - `persona-fixtures.yml` — path-filtered golden-PR replay CI.
  - `.github/CODEOWNERS` — sole control-plane gate for protected paths.
  - `pre-push` hook (opt-in) — local pre-flight 4-specialist review. `/preflight` slash command available.
  - `shellspec.yml` — auto-discovers `tests/shellspec/*.spec.sh` (D2 added 17 cases · P3 added 11 cases this session).
- **NEW canonical artifacts post-session-58:**
  - `scripts/auto-review-filter-prior.sh` + `tests/shellspec/auto-review-filter-prior.spec.sh` (PR #69 P3)
  - `schemas/finding-envelope.schema.json` + `scripts/validate-finding-envelope.sh` + `tests/shellspec/validate-finding-envelope.spec.sh` (PR #71 D2 — NEW top-level `schemas/` directory)
- **Retired session 55:** `slice-reviewer.md` persona (PR #56 atomic flip).
- **AC-2 acceptance-gate** + **AC-3 ux-polish-reviewer** still shipped + dormant until S-F1.
- **AC-4 retain/drop measurement** activates after first 3 src/ slices ship (S-F1 onwards).

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

### Next session (59) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. `mcp__github__list_pull_requests state=open base=main perPage=10` — expect empty post-wrap (PR #67-#71 + session-58 wrap all merged at session 59 turn 0).
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Sequential single-branch pattern continues — `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main`.
3. **Confirm priority with user.** Session 59 P0 recommended = **S-F1 first src/ slice (UNBLOCKING)**. P1 = JSON Schema integration into auto-review-parse.sh (D2 follow-up). P2 = During-work WHY-vs-WHAT comment-lint subagent (HANDOFF-58 lesson 2 mitigation). P3 = Plan-review subagent default-spawn flip. P4 = Synthetic-deliberate-injection per-persona fixtures (STILL gated on S-F1 + 2 more src/ slices). User picks.
4. **If P0 (S-F1):** read spec 71 §5 + spec 70 build-map for slice scope; run `docs/workspace-spec/72-engineering-security.md` 13-item security checklist; design AC + verification + security docs. ~400-600L · 5-8 ACs.
5. **If P1 (JSON Schema integration):** read `scripts/auto-review-parse.sh` + `schemas/finding-envelope.schema.json` (NEW post-D2) + `scripts/validate-finding-envelope.sh` (NEW). Wire validator into parse pipeline; choose parse-failed cascade vs warn-and-accept on schema mismatch. S-M (~50-100L) · 1-2 rounds.
6. **If P2 (WHY-vs-WHAT subagent):** new `.claude/agents/reviewer-comment.md` + PostToolUse Write/Edit hook spawning the subagent. Targets: WHAT-narration in code/spec/doc headers (HANDOFF-58 lesson 2). M (~150L) · 2-3 rounds.
7. **Pre-flight ROI test.** Pre-flight gated on local `ANTHROPIC_API_KEY` (skipped silently otherwise). HANDOFF-58 lesson 5: if no key provisioned, pre-flight is no-op; default (a) is fine — auto-review at PR open catches what matters.
8. **Live rigour gates** — every commit dogfoods them. Multi-agent auto-review at **k=2 default + differential mode LIVE + per-specialist filter LIVE** (post-PR-#69). Expect 1-2 rounds per PR.
9. **CODEOWNERS solo-operator pattern (#25)** — most session-59 candidates touch CODEOWNERS-protected paths; admin-bypass merge expected.
10. **k=2 default + post-flip §Revisit triggers** — per spec 72c §5: n=8 calibration data accumulated through session 58 (mean ~1.3 rounds across sessions 56-58). Continues collecting on S-F1 + onwards.
11. **Constraint #29 (NEW session 58):** before treating a kickoff/SESSION-CONTEXT priority labeled "per spec X §Y" as authorized, grep that section's gating IF-clauses verbatim. Quote the gating, not the conclusion.

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

## Session 59 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD origin/main                                       # expected: post-session-58-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm PR #67-#71 + session-58 wrap PR all merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 59?** Recommended P0 = **S-F1 first src/ slice (UNBLOCKING)**. P1 = JSON Schema integration into auto-review-parse.sh (D2 follow-up; PR #71 shipped schema + standalone validator, this wires it into the parse pipeline). P2 = During-work WHY-vs-WHAT comment-lint subagent (HANDOFF-58 lesson 2 mitigation — recurring author-time anti-pattern blindness). P3 = Plan-review subagent default-spawn flip. P4 = Synthetic-deliberate-injection per-persona fixtures (STILL gated on first-3-src-slice retain/drop confirmation per spec 72c §7). User picks.
2. **S-F1 scope choice (if P0).** Which slice from spec 70 build map? Phase A vs Phase B vs Phase C? User picks.
3. **CODEOWNERS solo-operator pattern (#25).** Most session-59 candidates touch CODEOWNERS-protected paths. Admin-bypass merge expected; surface upfront.
4. **Pre-flight + local API key (HANDOFF-58 lesson 5).** Pre-flight gated on local `ANTHROPIC_API_KEY` (skipped silently otherwise). Default (a) — do nothing — is fine; auto-review at PR open catches what matters. (b) provision key for local pre-flight; (c) hybrid (key only for major PRs).
5. **k=2 default + §Revisit trigger calibration.** n=8 calibration data accumulated through session 58 (mean ~1.3 rounds across sessions 56-58). Continues; target flip-back-to-k=1 trigger only if first-3-src-slice false-negative rate >20% (post-S-F1).

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Quote, don't paraphrase, when invoking a spec.** Sessions 57 + 58 both had kickoff paraphrases shipping or attempting work against unmet preconditions. Constraint #29 + CLAUDE.md §Planning conduct §"Pre-priority spec-gate verification" codify this.
- Live gates: `auto-review.yml` (k=2 + differential mode + **per-specialist filter LIVE post-PR-#69**) · `eslint-no-disable.yml` · `coverage-threshold.yml` · `pr-dod.yml` · `.github/CODEOWNERS` · `persona-fixtures.yml` · `pre-push` hook (opt-in) · `shellspec.yml`.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines (constraint #19).
- **Comments anti-pattern catalogue** (PR #60): catalogue is harder to apply at AUTHOR time than REVIEW time (lesson #4 of session 57 + lesson #2 of session 58). Mental rehearsal before each persistent header; or wait for session-59 P2 (WHY-vs-WHAT subagent) to ship.
- **Verification.md is final-state** (constraint #27): assemble at slice ship, not running log.
- **Don't freeze AC text more ambitious than impl budget** (constraint #28).
- **Pre-priority spec-gate verification** (constraint #29 NEW session 58): grep gating IF-clauses verbatim before treating priority as authorized.
- Auto-review iteration stop-signal: at k=2 + differential mode + per-specialist filter, expect 1-2 rounds per PR. Hard-cap at 4 rounds.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Architectural-smell-trigger:** qualitative judgement per CLAUDE.md.
- **Verdict vocabulary:** Conventional Comments labels + `(blocking)`. Personas emit findings; orchestrator derives verdict via `scripts/derive-verdict.sh --multi k=2` (default).
- **AC-4 retain/drop** activates after first 3 src/ slices ship. S-F1 (P0 of session 59) starts the dataset.
