# Session 56 Wrap Context Block (heading into session 57)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-56 accomplished (rolling window)

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
- **Session 56 (this wrap):** 3 PRs merged sequentially from `claude/decouple-session-56-r47Ju`. **PR #59** (P0 k=2 flip @ `fcbb50a`): spec 72c §5 §Revisit trigger fired (n=2 infra-PR calibration ahead of original first-3-src-slice trigger); shadow rename `_k2` → `_k1`; `derive-verdict.sh` default `K=2`; `spawn-multi-reviewer.sh` live invocation flipped; 7 references in `auto-review.yml` workflow swapped (caught at round 1); CLAUDE.md gates table + invocation conventions reflect new default. 4 rounds, 2 real bugs caught round 1, merged via maintainer judgement at hard-cap. **PR #60** (P1+P2+#27+#28 @ `779a5f1`): CLAUDE.md §Coding conduct anti-pattern catalogue (5-bullet); §DoD #1 amended for `verification.md` final-state framing; SESSION-CONTEXT register +#27 +#28. **1 round, `approve` clean — first round-1 clean approve under k=2 default.** **PR #61** (P4-A+B @ `03f3297`): §"Not yet in scope" categorised rewrite (drops resolved L199 carry-over; adds HANDOFF-55 carry-overs); `tests/personas/golden/pr-30/prior-verdict.json` `personas_sha256` field; `run-replay.sh` drift-check loop with cross-platform sha256sum/shasum/SKIP triple. 4 rounds, converged via maintainer judgement at spec 72c §5 hard-cap against single-specialist edge-case-firing. **k=2 KPI signal at n=2: 0% false-negative rate vs `would_have_been_k1` shadow** (suite holds; flip-back trigger far from firing). P4-C (F5c origin/main-anchored ratchet) deferred to session 57 after scoping revealed it's ~200-250L not ~100-150L.

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

## Session 57 priorities

> **Numbering:** session 56 shipped P0 k=2 flip (PR #59), P1+P2+#27+#28 docs batch (PR #60), P4-A+B §"Not yet in scope" rewrite + persona SHA tracking (PR #61). Session 57 picks up from the value × effort matrix surfaced mid-session-56 (HANDOFF-SESSION-56 §"Session 57 priority recommendations"). Lead pick is AC-3 persona-side prompt-input wiring — highest ROI of the v3c queue. P4-C ESLint+coverage ratchet (F5c) is queued for session 57 after session-56 mid-session deferral.

### P0 — AC-3 persona-side prompt-input wiring (highest-value v3c carry-over)

Closes the differential-mode token-cost loop. PR #57 shipped the aggregator side (the orchestrator emits `was_in_prior` / `prior_findings_resolved`) but per-specialist tokens still pay full diff-cost on rounds 2+ because the prompt input is the same on every round. Workflow injects prior-round findings into each specialist's prompt → specialist scopes review to (a) prior unresolved findings (re-flag if still present) + (b) net-new findings introduced by fix-up diff (regression detection on the patches). Bounds rounds-2+ token cost to ~1/Nth of round-1 cost per spec 72c §6. **Design space:** comment-based extraction (parse PR comments for prior-round JSON envelope) vs hidden-JSON-marker (orchestrator embeds an HTML-comment-wrapped JSON in the PR body). M (~150-200L) + 2-3 auto-review rounds. Also addresses session-56 lesson #4 (reviewer doesn't track commit-message context across rounds — persona-side differential filters prior-round resolved-questions automatically via `was_in_prior`).

### P1 — P4-C origin/main-anchored ESLint + coverage ratchet (F5c carry-over)

Deferred from session 56 mid-session after scoping revealed real shape. Per the v3a slice review L46: "Ratchet check should compare against origin/main HEAD threshold values, not a configurable file." Both ESLint disable counts AND vitest coverage thresholds get the origin/main-anchored treatment. **Implementation shape:** modify `scripts/eslint-no-disable.sh` to compare current count against origin/main's count (replacing the static allowlist pattern); introduce coverage-threshold ratchet logic that reads `vitest.config.ts` thresholds at HEAD vs origin/main and fails CI if any went down. Override path: CODEOWNERS admin-bypass (post-PR-#52 simplification). M (~200-250L) + 2-3 auto-review rounds.

### P2 — Pre-flight self-review hook

Local pre-push hook OR `/preflight` slash command that runs all 4 specialists against staged diff. HANDOFF-55 lesson #6 estimates 4-6 rounds saved per PR (cost ~$0.40 + 3 min wall-clock per push). Compounds with k=2 default (which already collapsed PR #60 to 1 round) + anti-pattern catalogue (catches at authoring time): catalogue catches at authoring time, pre-flight at push time, auto-review at merge time. Defer until P0 + P1 have shipped if budget runs short — pre-flight value is mostly empirical (round-savings projection), and persona-side wiring (P0) addresses the same cost asymmetry from a different angle. L (~150L).

### P3 — Synthetic-deliberate-injection per-persona fixtures

Per-specialist tests-of-prompt: a deliberately-broken diff that each specialist SHOULD catch. Catches per-persona regressions golden-replay can't isolate (golden tests aggregator logic; synthetic tests prompt fidelity per dimension). Spec 72c §7 hybrid. Pairs with v3c persona drift cron. M (~200L). Useful single-issue pick if the larger picks all consume more budget than expected.

### P4 — S-F1 first src/ slice (deferred to session 58+ for n>=3 calibration)

**Still unblocked** but now strategically deferred. Rationale: the first-3-src-slice §Revisit trigger calibration data (per spec 72c §5) is much higher-quality once collected on real `src/` workload vs the n=2 infra-only data we have now. Session 57's lead picks (AC-3 persona-side wiring + F5c ratchet) directly improve the auto-review rigour suite ahead of S-F1 — meaning S-F1 ships into a more efficient review pipeline. ~400-600L; 5-8 ACs. Activates AC-4 retain/drop measurement clock + first exercise of `ux-polish-reviewer` persona on real UI surface.

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

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct, Verdict vocabulary (Conventional Comments).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · spec 72a/b/c · spec 73 · `docs/slices/S-INFRA-rigour-v3{a,b}-*/acceptance.md`.
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`.

## Branch

### Branch state at session-56 wrap (verified live)

- **Wrap branch:** `claude/decouple-session-56-r47Ju` (same branch reused across all 3 substantive PRs sequentially after each squash-merge cycle; this wrap commit lands on the same branch).
- **`main` tip:** `03f3297` (PR #61 squash-merged via solo-operator admin-bypass at session-56 maintainer-judgement convergence). Prior: `779a5f1` = PR #60 merge. Prior: `fcbb50a` = PR #59 merge. Prior: `7325cf9` = session-55 wrap (PR #58).
- **Open PRs at session-56 wrap:** wrap PR (this branch) opens after this commit. **No carry-over open PRs** — PR #59, #60, #61 all merged cleanly mid-session.
- **Closed/merged this session:** PR #59 (P0 k=2 flip) merged @ `fcbb50a` · PR #60 (P1+P2+#27+#28) merged @ `779a5f1` · PR #61 (P4-A+B) merged @ `03f3297`.
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Unblocked since session-55; deferred again at session-56 in favour of v3c efficiency-layer work. Resumption is a session-57+ user call.
- **Live rigour gates (post-session-55):**
  - `tdd-guard.sh` — Write/Edit on `src/**.{ts,tsx}` requires green vitest run (v3b AC-6).
  - `pre-push-dod7.sh` — pre-push gate enforces 7-item slice-DoD (v3b AC-7).
  - `tdd-first-every-commit.sh` — PreToolUse:Bash enforces TDD discipline.
  - `exit-plan-review.sh` — plan-time review on ExitPlanMode.
  - `read-cap.sh` — Read tool turn-budget cap.
  - `auto-review.yml` — **multi-agent 4-specialist matrix-strategy fan-out** (PR #56 ship): brief job composes per-specialist prompts → specialist matrix runs `claude -p` per dimension → aggregate job runs `spawn-multi-reviewer.sh aggregate` + posts unified check-run + comment. `block` + `parse-failed` + pipeline-crash → `failure` (merge-gating); `request-changes` + `nit-only` → `neutral` (advisory); secret-missing skip → `neutral` (forks unaffected).
  - `pr-dod.yml` — slice-verification reference required on `src/` PRs (sole DoD gate per session-53 PR #52).
  - `.github/CODEOWNERS` — sole control-plane gate for protected paths.
  - `persona-fixtures.yml` — path-filtered golden-PR replay CI (PR #57 ship): runs `tests/personas/run-replay.sh` on `reviewer-*.md` / orchestrator-script / fixture changes.
- **Retired session 55:** `slice-reviewer.md` persona (PR #56 atomic flip to 4-specialist suite per AC-5).
- **AC-2 acceptance-gate** + **AC-3 ux-polish-reviewer** still shipped + dormant until S-F1.
- **AC-4 retain/drop measurement** activates after first 3 src/ slices ship (S-F1 onwards).

### v3c / v3b trajectory + remaining rigour work

**The big picture (layman summary):** rigour-suite v3b programme **canonically complete on main**; v3c efficiency layer **making real progress**. Session 56 shipped 3 PRs: k=2 default flip (highest-leverage single-lever efficiency change), anti-pattern catalogue + DoD #1 final-state convention + #27/#28 promotion, §"Not yet in scope" categorised rewrite + persona-file SHA tracking. Multi-agent suite operating at k=2 default with **0% false-negative rate** at n=2 calibration. Session 57 picks up from the ranked v3c queue with **AC-3 persona-side prompt-input wiring** as lead — completes the differential-mode token-cost loop started at PR #57 aggregator-side.

**Remaining work shape (v3c efficiency layer + post-v3b carry-overs):**

| Piece | Size | Status | Why |
|---|---|---|---|
| **AC-3 persona-side prompt-input wiring** (P0 session 57) | medium (~150-200L) | v3c carry-over; highest ROI of remaining queue | Workflow-level injection of prior findings into per-specialist prompts; closes the round-N token-cost ≤1/Nth round-1 loveable-check from spec 72c §6. Aggregator-side already shipped at PR #57; persona-side closes the loop. |
| **Origin/main-anchored ESLint + coverage ratchet** (P1 session 57) | medium (~200-250L) | F5c carry-over from v3a; deferred from session 56 mid-session | Compare ESLint disable counts AND vitest coverage thresholds against origin/main HEAD (not configurable file). Override path: CODEOWNERS admin-bypass. |
| **Pre-flight self-review hook** (P2 session 57) | medium (~150L) | v3c carry-over; defer-after-P0+P1 if budget short | Locally spawning the 4 specialists before push. Estimated 4-6 rounds saved per PR per session-55 retrospective. Compounds with k=2 default + anti-pattern catalogue. |
| **Synthetic-deliberate-injection per-persona fixtures** (P3 session 57) | medium (~200L) | v3c carry-over per spec 72c §7 + §9 | Per-specialist tests-of-prompt: deliberately-broken diff each specialist SHOULD catch. Complements golden-replay primary. |
| **S-F1 first src/ slice** (P4 session 58+) | medium (~400-600L) | strategically deferred | Lead picks above improve the auto-review pipeline ahead of S-F1; S-F1 ships into a more efficient pipeline + collects the n=3 src/ calibration data point. Activates AC-4 retain/drop measurement clock + first exercise of `ux-polish-reviewer` persona on real UI surface. |
| **Live persona drift detection** | medium (live `claude -p` per replay seed) | gated on API budget | Quarterly cron drift workflow per spec 72c §9. Pairs with persona-file SHA tracking (already shipped at PR #61). |
| **Comment-posting extraction** | medium (~100-150L) | architectural-smell-trigger; deferred | No clustered findings yet through PR #61. Build-then-measure. |
| **Multi-provider 3rd-agent reviewer** | large | v3c carry-over per spec 72c §9 | Claude + GPT + Gemini cross-check. Defer until k=2 false-negative rate calibrates per §Revisit trigger. |
| **Stryker mutation testing on persona prompts** | medium | v3c carry-over | |
| **Structured-findings JSON Schema validation** | small-medium | v3c carry-over per spec 72c §9 | |

**Net: v3b shipped; v3c efficiency layer 4 PRs in (sessions 50-56); session 57 picks from the ranked queue above (P0-P3) with AC-3 persona-side wiring as the highest-ROI carry-over remaining.**

### Next session (57) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. `mcp__github__list_pull_requests state=open base=main perPage=10` — expect empty post-wrap (PR #59 + #60 + #61 all merged session 56; session-56 wrap PR merged at session 57 turn 0).
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Each PR opens fresh from main; sequential single-branch pattern (session 56 used same branch across 3 PRs after each squash-merge auto-deleted the head ref).
3. **Confirm priority with user.** Session 57 P0 recommended = **AC-3 persona-side prompt-input wiring** per HANDOFF-SESSION-56 §"Session 57 priority recommendations". P1 = P4-C origin/main-anchored ESLint+coverage ratchet (deferred from session 56 mid-session per scoping). P2 = pre-flight self-review hook. P3 = synthetic-deliberate-injection per-persona fixtures. P4 = S-F1 first src/ slice (deferred to session 58+ for n>=3 calibration via more efficient pipeline). User picks.
4. **If P0 (AC-3 persona-side wiring):** re-read spec 72c §6 (differential review mode) + `scripts/spawn-multi-reviewer.sh aggregate` (currently emits `was_in_prior` aggregator-side). Workflow injects prior-round findings into per-specialist prompts. Design space: comment-based extraction vs hidden-JSON-marker. M (~150-200L). Touches `.github/workflows/auto-review.yml` + 4 persona files + ShellSpec.
5. **If P1 (P4-C F5c ratchet):** re-read v3a slice review L46 + `scripts/eslint-no-disable.sh` (current static allowlist) + `vitest.config.ts` (current coverage thresholds). Origin/main-anchored comparison for both ESLint disable counts AND coverage thresholds. Override path: CODEOWNERS admin-bypass. M (~200-250L).
6. **If P2 (pre-flight hook):** local pre-push hook OR `/preflight` slash command. HANDOFF-55 lesson #6 estimates 4-6 rounds saved per PR. L (~150L). Defer until P0 + P1 ship if budget runs short.
7. **If P4 (S-F1 first src/ slice):** re-read spec 70 Build Map + draft `docs/slices/S-F1/acceptance.md`. Design-system token extraction; activates AC-4 retain/drop measurement clock + `ux-polish-reviewer` persona. **Multi-agent KPI calibration data point n=3 on real `src/` workload.** Strategically deferred to session 58+ unless session 57 picks finish early.
8. **Live rigour gates** — every commit dogfoods them. Multi-agent auto-review on main (`auto-review.yml` 3-job matrix-strategy fan-out at **k=2 default** post-session-56 PR #59). Expect 1-4 rounds per PR at k=2 (vs 5-11 at prior k=1 default; n=2 calibration data confirms).
9. **CODEOWNERS solo-operator pattern (#25)** — AC-3 wiring touches `.github/workflows/auto-review.yml` + `scripts/**` + `.claude/agents/**` (all CODEOWNERS-protected); admin-bypass merge required. F5c ratchet touches `scripts/**` + `eslint.config.mjs` + workflow file (same). Surface upfront.
10. **k=2 default + post-flip §Revisit triggers** — per spec 72c §5 (session-56 amendment): flip back to `k=1` if first-3-src-slice false-negative rate (`would_have_been_k1` shadow flagged real bugs missed by live `k=2`) > 20%. Currently 0% at n=2 (infra PRs only). S-F1 + onwards collects the real `src/` calibration data. Record per-specialist findings count in HANDOFF-{N}.md §"Persona findings recorded".

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

**Net state at session-56 wrap:** **rigour-suite v3b programme canonically complete + v3c efficiency layer making real progress.** Session 56 shipped 3 PRs: P0 k=2 default flip (the highest-leverage efficiency win — cleared at n=2 calibration with 0% false-negative rate vs `would_have_been_k1` shadow); P1+P2+#27+#28 catalogue + DoD #1 + 2 new constraints; P4-A+B §"Not yet in scope" rewrite + persona SHA tracking. **Session 57 lead pick = AC-3 persona-side prompt-input wiring** (highest-value remaining v3c carry-over per HANDOFF-SESSION-56). S-F1 (first src/ slice) deferred to session 58+ for n>=3 calibration via the now-more-efficient pipeline. See §"Session 57 priorities" for the ranked roadmap and HANDOFF-SESSION-56 §"v3c carry-overs (still pending after session 56)" for the full deferred list.

## Session 57 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD origin/main                                       # expected: post-session-56-wrap merge
mcp__github__list_pull_requests state=closed base=main perPage=10            # confirm PR #59 + #60 + #61 + session-56 wrap PR merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # expect empty post-wrap
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 57?** Recommended P0 = **AC-3 persona-side prompt-input wiring** per HANDOFF-SESSION-56 §"Session 57 priority recommendations" (highest ROI of the v3c queue; closes the differential-mode token-cost loop started at PR #57 aggregator-side). P1 = P4-C origin/main-anchored ESLint+coverage ratchet (F5c; deferred from session 56). P2 = pre-flight self-review hook. P3 = synthetic-deliberate-injection per-persona fixtures. P4 = S-F1 first src/ slice (deferred to session 58+ for n>=3 calibration via more efficient pipeline).
2. **AC-3 design choice.** Comment-based extraction (parse PR comments for prior-round JSON envelope) vs hidden-JSON-marker (orchestrator embeds an HTML-comment-wrapped JSON in PR body). Both are valid; user picks. Comment-based is simpler but couples to the comment template; hidden-JSON-marker is more robust but adds a marker-render path.
3. **F5c F5c override path.** Origin/main-anchored ratchet's escape hatch: CODEOWNERS admin-bypass per the post-PR-#52 simplification. No more `control-change-label` workflow (that was retired at session 53).
4. **CODEOWNERS solo-operator pattern (#25).** All session-57 candidates touch CODEOWNERS-protected paths: AC-3 wiring (`.github/workflows/**` + `scripts/**` + `.claude/agents/**`); F5c ratchet (`scripts/**` + `eslint.config.mjs`); pre-flight hook (`.claude/hooks/**` or new slash-command); synthetic-injection (`tests/personas/**`). Admin-bypass merge expected; surface upfront.
5. **k=2 default + §Revisit trigger calibration.** Currently 0% false-negative rate at n=2 (PR #60 + #61 infra calibration). Session 57 work continues collecting calibration data; target is to confirm or flip-back-to-k=1 when first-3-src-slice false-negative rate is known (post-S-F1 + S-F2 + S-F3 ship). Record per-specialist findings count in HANDOFF-SESSION-57 §"Persona findings recorded".

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- Live gates: `tdd-guard` · `pre-push-dod7` · `tdd-first-every-commit` · `exit-plan-review` · `read-cap` · `auto-review.yml` (multi-agent matrix-strategy fan-out at **k=2 default** post-PR-#59) · `pr-dod.yml` · `.github/CODEOWNERS` · `persona-fixtures.yml` (path-filtered golden-replay; persona-file SHA drift check post-PR-#61).
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines (negative constraint #19).
- **Comments anti-pattern catalogue** (PR #60): avoid PR/session/slice provenance · sibling-step refs · narration of WHAT · hard-coded counts · code lineage in persistent code/comments/tests.
- **Verification.md is final-state** (PR #60 amended DoD #1 + constraint #27): assemble at slice ship, not running log.
- **Don't freeze AC text more ambitious than impl budget** (constraint #28): anchor §In scope to next-session concrete impl budget; defer aspirational scope to v3c carry-overs.
- Auto-review iteration stop-signal: at k=2 default, expect 1-4 rounds per PR (vs 5-11 at prior k=1). Maintainer-judgement convergence at hard-cap (4 rounds) when single-specialist edge-case-firing dominates rounds 4+. Per session-56 PR #61 retrospective + session-55 PR #56.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Architectural-smell-trigger:** qualitative judgement per CLAUDE.md amended PR #52; reviewer's call when patches feel like interest payment vs principal across UNRELATED concerns.
- **Verdict vocabulary:** Conventional Comments labels + `(blocking)`. Personas emit findings; orchestrator derives verdict via `scripts/derive-verdict.sh --multi k=2` (default).
- **AC-4 retain/drop** activates after first 3 src/ slices ship. S-F1 starts the dataset (deferred to session 58+).
