# Session 54 Wrap Context Block (heading into session 55)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-54 accomplished (rolling window)

- **Sessions 41-46:** v3b S-1 through S-5 — 12/15 ACs landed via PRs #25-#27 across 6 sessions.
- **Session 47:** v3b S-6 (PR #30 9-round live recursive auto-review; 14 findings; v3b 12/15 → 15/15). Auto-review.yml + 3 personas live.
- **Session 48:** v3b S-7 sibling slice (PR #32 §Architectural-smell-trigger) + v3b S-8 setup (PR #33 spec 72c + 6-AC acceptance.md) + v3c stub (PR #34).
- **Session 49:** v3c rubric extension (criterion 2 §Exceptions a-d) + spec 72c §5/§7/§10 prior-art amendments + audit findings queued.
- **Session 50:** 6 PRs merged — PR #36 (72c §9 cross-ref), #37 (criterion 2 §Exceptions a-d), #38 (citations + 100%-rule rename), #39 (slice-resolver fix), #40 (§Exception (e) wrap docs), #41 (Conv Comments verbatim), #42 (fix-up).
- **Session 51:** Rigour-suite delivery push, session 1 of 3. 4 substantial PRs merged: PR #44 (§Examples migration to Conv Comments schema), PR #45 (auto-review findings posted as PR comment with markdown table — visibility fix), PR #46 (verdict-derivation arithmetic extracted to `scripts/derive-verdict.sh` + 16-case shellspec; verdict-coercion fixture per spec 72c §5 rule 3 NOW CI-GATED), PR #47 (slice-AC resolver + persona-JSON parser extracted to `scripts/auto-review-{slice-resolve,parse}.sh` + 21-case shellspec; latent empty-stdin edge case fixed). All non-trivial logic now in tested scripts under `tests/shellspec/`.
- **Session 52:** Rigour-suite delivery push, session 2 of 3. Two substantial PRs merged. **PR #50** promoted both `parse-failed` AND pipeline-crash paths in `auto-review.yml` from `neutral` to `failure` (rigour-malfunction blocks merge; secret-missing skip stays `neutral` for fork-PR compatibility). **PR #49** extracted criterion 2 §Exceptions sub-clauses (a-e) from `slice-reviewer.md` prose to a structured YAML + deterministic file-glob pre-filter (15-case shellspec) + 5-row markdown table inline. PR #49 went through 6 rounds of auto-review iteration; refined stop-signal distinguishes polish from correctness.
- **Session 53:** **PR #52** (`S-INFRA-rigour-v3c-prior-art-amendments-structural`, merged @ `495e473`) — P0b-structural 3 simplifications: CODEOWNERS migration replacing 3 legacy controls (hooks-checksums + control-change-label + path-protected-list); pre-commit-verify hook deprecation (CI's pr-dod.yml is sole DoD gate); arch-smell trigger reframed from numeric round-count to qualitative judgement per Cunningham/Fowler. Net diff −440 / +50 across 9 commits + 4 auto-review rounds. **Solo-operator design discovery:** GitHub author-cannot-self-approve hard rule means CODEOWNERS gate self-deadlocks for solo; admin-bypass-per-merge becomes the conscious-act rigour layer (negative constraint #23). **AC-drafting style smell** captured (negative constraint #24): don't draft AC verification as literal grep checks; use semantic checks. Session-53 wrap PR #53 (`claude/wrap-session-53` @ `948837334`) opened with HANDOFF-SESSION-53 + framing fix but **was never merged**.
- **Session 54 (this wrap):** **PR #54** (`S-INFRA-persona-suite-v2-multi-agent`, merged @ `b4d7e6c` via solo-operator admin-bypass) — **v3b S-8 design contract realigned to /ultrareview prior-art audit findings (4-partition + majority-vote `k`-quorum + golden-PR replay primary) + AC-1 partial impl + AC-2 full impl.** Spec 72c session-54 amendment (§3 + §4 + §5 + §7 + §9 + §10 + Status). `acceptance.md` re-drafted end-to-end (5 ACs; was 6). `scripts/derive-verdict.sh --multi k=N` quorum mode (default `k=1` back-compat; spec lock-in: blocking findings count only toward block tier). `scripts/spawn-multi-reviewer.sh aggregate` subcommand (162L; tuple-based jq group_by dedup; emits shadow `would_have_been_k2`/`_k3`). 4 specialist personas under `.claude/agents/reviewer-{security,architecture,correctness,style}.md` (132/117/117/121L; ≤200L target via include-by-reference; `commenting` category added to `reviewer-style` schema). 21 ShellSpec cases added across `derive-verdict.spec.sh` + `spawn-multi-reviewer.spec.sh`. **5 rounds of auto-review iteration** (block → 3 → 3 → 2 → 2 → 2) with explicit stop-signal at round 5 per qualitative arch-smell trigger judgement (findings spread across files, not clustered; iterative refinement, not architectural smell). Round 1 finding 3 caught a real impl bug (per-finding `summary` schema mismatch causing dedup collapse); cascading fix across spec + acceptance.md + script + tests. **AC-3, AC-4, AC-5 deferred to session 55** (orchestrator fan-out + auto-review.yml matrix-strategy rewire + golden-PR replay seed + `slice-reviewer.md` retirement + DoD-13 4 sub-spawn reviews).

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
- **v3b shipped — 15/15 + S-8 partial.** PRs #25-#27 + #30 + #32 + #33 (sessions 41-48) for the 15 ACs; **PR #54 session-54** for v3b S-8 design contract + AC-1 partial (`derive-verdict.sh --multi` + `spawn-multi-reviewer.sh aggregate`) + AC-2 (4 specialist personas at `.claude/agents/reviewer-{security,architecture,correctness,style}.md`). auto-review.yml still invokes single-agent `slice-reviewer.md` at session-54 wrap; AC-3 differential + AC-4 golden-PR replay + AC-5 retirement deferred to session 55.
- **v3c shipped — sessions 50+51+52+53 batch landed + session-54 spec amendment.** Sessions 50-52 batch (PRs #36-#42 + #44-#47 + #49 + #50). Session 53 PR #52 P0b-structural (CODEOWNERS migration; pre-commit-verify deprecation; arch-smell qualitative reframing). Session 54 PR #54 spec 72c §3 + §4 + §5 + §7 + §9 + §10 amendments per /ultrareview prior-art audit application. v3c programme **~99% complete** at session-54 wrap; remaining: v3b S-8 session-55 completion (orchestrator fan-out + workflow rewire + golden-replay + slice-reviewer.md retirement); comment-posting extraction (still build-then-measure deferred; no clustered findings yet).

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

## Session 55 priorities

> **Numbering:** session 53 closed P0b-structural (PR #52); session 54 closed v3b S-8 design + AC-1 partial + AC-2 (PR #54). Session 55 = **complete v3b S-8 ship**: orchestrator fan-out + auto-review.yml matrix-strategy rewire + AC-3 differential mode + AC-4 golden-PR replay seed + AC-5 slice-reviewer.md retirement + DoD-13 4 sub-spawn persona reviews. After session 55, the rigour suite is canonically complete and S-F1 (first `src/` slice) is the priority + AC-4 retain/drop measurement clock starts.

### P0 — v3b S-8 completion (multi-agent persona suite v2 — orchestrator + workflow + harness + retirement)

Atomic ship event closing v3b S-8. Outstanding pieces per session-54 PR #54 acceptance.md `Out of scope` listings:

- **AC-1 verification 1 + 6 (orchestrator + workflow):** the fan-out side. Either extend `scripts/spawn-multi-reviewer.sh` with a `fan-out` subcommand (constructs per-specialist prompts with nonced fences from diff + slice AC + CLAUDE.md sections), or inline the prompt-template construction in `auto-review.yml` matrix-strategy steps. Design TBD at session-55 start; prefer the simpler of the two unless one provides material testability gain. Then `auto-review.yml` rewire: replace single-`claude -p`-against-`slice-reviewer.md` with matrix-strategy job spawning 4 parallel `claude -p` invocations (one per specialist), aggregator job runs `spawn-multi-reviewer.sh aggregate /tmp/envelopes/` and posts unified check-run + findings comment via existing posting steps. AC-1 verification 4 (ANTHROPIC_API_KEY-absent skip) lives at the workflow level — its ShellSpec equivalent sits in workflow-level integration testing, not the aggregator script's tests.
- **AC-3 differential-review mode:** `--differential --prior-findings <path>` flag on the orchestrator; per-specialist prompt-input wiring; 2 ShellSpec fixtures; `token_metrics` field instrumentation in output envelope. Direct CodeRabbit `incremental_reviews` prior art per spec 72c §10.
- **AC-4 golden-PR replay harness:** convert `docs/slices/S-INFRA-rigour-v3b-subagent-suite/verification.md` §Round-1 through §Round-9 into `tests/personas/golden/pr-30/{diff.patch,prior-verdict.json,prior-findings.json}`. `tests/personas/run-replay.sh` invokes the orchestrator, asserts verdict-tier match + finding-count tolerance + per-specialist `seen_by[]` overlap. CI workflow `.github/workflows/persona-fixtures.yml` triggers on persona-file or orchestrator-script changes. Quarterly cron workflow opens drift issue. Honest framing: seed-of-1 at v3b ship per spec 72c §7; expands as src/ slices accumulate.
- **AC-5 slice-reviewer.md retirement (atomic with AC-1 workflow rewire):** delete `.claude/agents/slice-reviewer.md`; update CLAUDE.md §"Subagent file locations" + §"Hard controls" §"Invocation conventions" to replace single-agent fallback narrative with 4-specialist matrix-strategy fan-out; `auto-review.yml` reference cleanup. Atomic single-commit OR same-PR change with the orchestrator rewire.
- **DoD-13 persona recursion lock:** 4 fresh-context subagent reviews of the 4 specialist personas (now exercisable post-orchestrator); record findings per-persona in slice `verification.md`.
- **Slice `verification.md`** at wrap with all 5 ACs evidenced.

Estimated total: ~700-1000L across orchestrator extension + workflow rewire + golden-replay harness + 2 CI workflows + slice-reviewer.md deletion + CLAUDE.md updates + verification.md. Single-PR session if achievable; otherwise split: PR-A orchestrator + workflow rewire + slice-reviewer.md retirement (atomic flip); PR-B golden-replay harness + AC-3 differential + AC-4 measurement framework.

### P1 — S-F1 kickoff (first src/ slice; design-system tokens)

**Unblocked once P0 lands.** Rigour-suite programme is canonically complete; AC-4 retain/drop measurement activates at S-F1 per spec 72c §8. Per spec 70 Build Map: design-system token extraction from `docs/design-source/` → `src/lib/design-system/{tokens,components}/` with CSS↔TS structural-parity invariant tests. ~400-600L; 5-8 ACs. **Session 55 second half** if P0 lands fast; otherwise **session 56**.

### P2 — Comment-posting extraction (architectural-smell-trigger build-then-measure; still deferred)

`scripts/auto-review-post-comment.sh` extraction if PR #45's comment-posting accrues clustered findings. PR #49 + #50 + #52 + #54 didn't surface any clustered findings on the comment-posting block. Defer until round-3+ cluster per the qualitative arch-smell-trigger doctrine.

### P3 — Session-53 wrap PR #53 (RESOLVED at session-54-wrap-rebase)

**Status: RESOLVED.** PR #53 (`claude/wrap-session-53` @ `948837334`) was OPEN at session-54 turn 0 and remained open through most of session 54. **User merged PR #53 mid-wrap** at `79805ce` after the session-54 wrap PR #55 had already opened against `b4d7e6c`. This created a SESSION-CONTEXT.md merge conflict on PR #55 (both PRs touched the same file from a common session-52 base).

**Conflict resolution (this rebase):** session-54 wrap PR #55 rebased on origin/main (now at `79805ce`); SESSION-CONTEXT.md conflict resolved by taking the session-54-wrap version (this file) as the base — it's a true superset of PR #53's session-53 content. Session-53 retro `HANDOFF-SESSION-53.md` preserved on main from PR #53 (untouched by this rebase). PR #53's §"Rigour-suite completeness (layman summary)" table merged into this file (see §"Rigour-suite completeness" below) with the v3b S-8 row updated for session-54 ship state. Negative constraints renumbering preserved with all four (#23 rebase-on-main, #24 don't-cite-forward, #25 solo-op, #26 AC-drafting smell) — PR #53's version had inadvertently overwritten #23 + #24 with the new constraints; this file restores the full sequence.

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

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct, Verdict vocabulary (Conventional Comments).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · spec 72a/b/c · spec 73 · `docs/slices/S-INFRA-rigour-v3{a,b}-*/acceptance.md`.
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`.

## Branch

### Branch state at session-54 wrap (verified live)

- **Wrap branch:** `claude/wrap-session-54` (this commit's branch).
- **`main` tip:** `b4d7e6c` (PR #54 squash-merged via solo-operator admin-bypass mid-session-54). Prior: `495e473` = PR #52 merge (session 53). Prior: `7395949` = session-52 wrap.
- **Open PRs at wrap from session 54:** wrap PR (this branch) opens after this commit. Plus the **carry-over open PR**: PR #53 (`claude/wrap-session-53` @ `948837334`) — session-53 wrap, never merged — surfaced in §Session 55 priorities P3 for user reconciliation.
- **Closed/merged this session:** PR #54 (`S-INFRA-persona-suite-v2-multi-agent`) merged @ `b4d7e6c`.
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-rigour-suite complete (i.e. after session-55 ships v3b S-8 completion).
- **Live rigour gates (post-session-54; CODEOWNERS as sole control-plane gate):**
  - `tdd-guard.sh` — Write/Edit on `src/**.{ts,tsx}` requires green vitest run (v3b AC-6).
  - `pre-push-dod7.sh` — pre-push gate enforces 7-item slice-DoD (v3b AC-7).
  - `tdd-first-every-commit.sh` — PreToolUse:Bash enforces TDD discipline.
  - `exit-plan-review.sh` — plan-time review on ExitPlanMode.
  - `read-cap.sh` — Read tool turn-budget cap.
  - `auto-review.yml` — slice-reviewer persona on every PR (until session-55 atomic flip to multi-agent matrix-strategy fan-out per AC-1 verification 6 + AC-5 retirement). Session-52 promotion in effect: `parse-failed` + pipeline-crash → `failure` (merge-gating); `request-changes` / `nit-only` → `neutral` (advisory); secret-missing skip → `neutral` (forks unaffected).
  - `pr-dod.yml` — slice-verification reference required on `src/` PRs (sole DoD gate per session-53 PR #52 pre-commit-verify deprecation).
  - `.github/CODEOWNERS` — sole control-plane gate for L199-protected paths (session-53 PR #52; replaced hooks-checksums + control-change-label.yml).
- **Removed PR #52:** `pre-commit-verify.sh` hook · `hooks-checksums.txt` + `scripts/hooks-checksums.sh` · `.github/workflows/control-change-label.yml`.
- **AC-2 acceptance-gate** + **AC-3 ux-polish-reviewer** still shipped + dormant until S-F1.
- **AC-4 retain/drop measurement** activates after first 3 src/ slices ship (S-F1 onwards).

### v3c / v3b trajectory + remaining rigour work

**The big picture (layman summary):** rigour-suite programme is **~99% complete** (was 98% at session 52; session 53 closed P0b-structural; session 54 closed v3b S-8 design contract + AC-1 partial + AC-2). Only **1 substantive item remains** before pure `src/` work: v3b S-8 completion (orchestrator fan-out + workflow rewire + AC-3 differential + AC-4 golden-replay + AC-5 retirement; P0 session 55).

**Remaining work shape:**

| Piece | Size | Status | Why |
|---|---|---|---|
| v3b S-8 completion (P0 session 55) | medium-large (~700-1000L) | queued | Orchestrator fan-out subcommand (or inline workflow YAML), `auto-review.yml` matrix rewire, AC-3 differential mode, AC-4 golden-PR replay seed + harness + 2 CI workflows, AC-5 slice-reviewer.md retirement (atomic with workflow rewire), DoD-13 4 sub-spawn persona reviews, slice verification.md. Last rigour-suite piece. |
| S-F1 kickoff (first src/ slice; design-system tokens) | medium (~400-600L) | unblocked once S-8 lands | Dataset-seeder for AC-4 retain/drop. Session 55 second half if S-8 lands fast; otherwise session 56. |
| Comment-posting extraction | medium (~100-150L) | architectural-smell-trigger; deferred | PR #45 + PR #49 + PR #50 + PR #52 + PR #54 surfaced no findings clustering on the comment-posting block. Build-then-measure; defer until round-3+ cluster. |
| Synthetic-deliberate-injection per-persona fixtures | medium (~200-300L) | v3c carry-over per spec 72c §7 + §9 | Adds once first-3-src-slice retain/drop data confirms 4-partition holds; complements golden-replay primary. |
| `k`-quorum threshold calibration | small (~30-50L spec amendment) | data-driven from S-F1+ shadow-monitor output | Flip default `k=1` → `k=2` if first-3-slice false-positive rate >30% per spec 72c §5 revisit trigger. |
| Mutation testing / Stryker · property-based / fuzz · multi-provider 3rd reviewer · structured-findings JSON Schema · multi-provider consensus framework full spec 72d | various | v3c carry-over | Per spec 72c §9 §"Out of scope". Not blocking. |

**Net: 1 more session (55) of rigour-suite cleanup, then `src/` work (S-F1) becomes the focus.** Session 53 closed P0b-structural; session 54 closed S-8 design + AC-1 partial + AC-2; session 55 closes the remaining S-8 ACs.

### Next session (55) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook surfaces live branch state. `mcp__github__list_pull_requests state=open base=main perPage=10` — should show wrap PR (this) + PR #53 (session-53 wrap, still open per §Session 55 priorities P3).
2. **Reconcile PR #53.** Per §Session 55 priorities P3: ask user (a) merge separately + resolve SESSION-CONTEXT conflict, (b) close unmerged, or (c) port to fresh commit. Recommend (a). Resolve before starting impl work.
3. **Verify branch state + working tree clean.** Resync if BEHIND > 0. Branch fresh off main for the impl PR.
4. **Confirm priority with user.** Session 55 P0 recommended = **v3b S-8 completion** (orchestrator + workflow + golden-replay + retirement + DoD-13). Alternatives: defer pieces (e.g. defer AC-4 golden-replay to session 56) if scope exceeds session budget.
5. **If P0 (v3b S-8 completion):** Re-read `docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md` AC-1 (`Out of scope`) + AC-3 + AC-4 + AC-5 + Pre-flight notes §"Session-54 PR scope" listing the deferred items. Re-read spec 72c §3 + §5 + §7 (session-54 amended). Branch fresh off main as `claude/S-INFRA-persona-suite-v2-multi-agent-impl-completion` (or similar). Sequence: orchestrator fan-out → workflow rewire (atomic with AC-5 slice-reviewer.md deletion + CLAUDE.md updates) → AC-3 differential → AC-4 golden-replay → DoD-13 4 sub-spawn reviews → verification.md.
6. **Live rigour gates** — every commit dogfoods them. Plan-time gate fires on ExitPlanMode. Auto-review still uses single-agent `slice-reviewer.md` until the atomic flip in this session's PR; expect 2-5 rounds of single-agent recursion before stop-signal per session-54 pattern.
7. **CODEOWNERS solo-operator pattern** — every control-plane PR (this session's PR will touch `.claude/agents/**`, `scripts/**`, `.github/workflows/**`) requires conscious admin-bypass click. Surface this expectation upfront with user.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-54 additions:

```
docs/HANDOFF-SESSION-54.md                                        — session 54 retro (NEW)
docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md    — re-drafted end-to-end session 54 (5 ACs; was 6; PR #54 MERGED @ b4d7e6c)
.claude/agents/reviewer-security.md                               — 132L; OWASP top 10 + spec 72 §11 (PR #54 MERGED)
.claude/agents/reviewer-architecture.md                           — 117L; hidden-effect + criterion 2 architectural variant (PR #54 MERGED)
.claude/agents/reviewer-correctness.md                            — 117L; criteria 2 logic / 3 / 5 / 6 / 8 (PR #54 MERGED; heaviest specialist by design)
.claude/agents/reviewer-style.md                                  — 121L; criterion 1 + commenting category (PR #54 MERGED)
scripts/spawn-multi-reviewer.sh                                   — 162L; aggregator subcommand; tuple-based jq group_by dedup; emits shadow k=2/k=3 (PR #54 MERGED); test contract: tests/shellspec/spawn-multi-reviewer.spec.sh
tests/shellspec/spawn-multi-reviewer.spec.sh                      — 9 cases (AC-1 verifications 2/3/5)
docs/workspace-spec/72c-multi-agent-review-framework.md           — session-54 amendments to §3 + §4 + §5 + §7 + §9 + §10 + Status (load-bearing prior-art audit application; PR #54 MERGED)
scripts/derive-verdict.sh                                         — `--multi k=N` quorum mode added session 54 (PR #54 MERGED); single-mode unchanged
tests/shellspec/derive-verdict.spec.sh                            — 28 cases (16 single-mode + 12 multi-mode session 54)
.github/workflows/auto-review.yml                                 — still single-agent against slice-reviewer.md at session-54 wrap; matrix-strategy fan-out lands at session-55 atomic flip per AC-1 verification 6 + AC-5
.claude/agents/slice-reviewer.md                                  — RETIRES at session-55 atomic flip with the multi-agent suite (per session-54 PR #54 AC-5)
```

## Rigour-suite completeness (layman summary)

| Programme | Status | Sessions | Key artefacts on main |
|---|---|---|---|
| **v3a-foundation** | ✅ SHIPPED | 33-41 (PR #24) | `verify-slice.sh`, `tdd-first-every-commit`, plan-time gate |
| **v3b subagent suite (S-1 to S-7)** | ✅ SHIPPED | 41-48 | `auto-review.yml`, slice-reviewer + acceptance-gate + ux-polish-reviewer personas, arch-smell trigger |
| **v3b S-8 multi-agent persona suite v2 (design + AC-1 partial + AC-2)** | ✅ SHIPPED | 54 (PR #54) | spec 72c session-54 amendment (4-partition + majority-vote + golden-replay primary); 5-AC re-draft acceptance.md; `derive-verdict.sh --multi k=N`; `spawn-multi-reviewer.sh aggregate`; 4 specialist personas (`reviewer-{security,architecture,correctness,style}.md`); 21 ShellSpec cases |
| **v3b S-8 completion (AC-1 fan-out + workflow rewire + AC-3 + AC-4 + AC-5 + DoD-13)** | 🟡 PENDING SESSION 55 | — | Orchestrator fan-out subcommand or inline workflow YAML; `auto-review.yml` matrix-strategy; differential-review mode; golden-PR replay seed (PR #30 transcript) + `run-replay.sh` + 2 CI workflows; `slice-reviewer.md` retirement atomic with workflow rewire; CLAUDE.md §"Subagent file locations" updates; 4 fresh-context persona reviews |
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
| **v3c comment-posting extraction** | 🟡 DEFERRED (smell-trigger build-then-measure) | — | Defer until findings cluster on `auto-review-post-comment.sh` block |
| **v3c synthetic-deliberate-injection per-persona fixtures** | 🔵 v3c CARRY-OVER | — | Per spec 72c §7 + §9 (golden-replay primary at v3b ship; synthetic adds when 4-partition validated) |
| **v3c carry-overs (Stryker mutation · property-based fuzz · multi-provider 3rd reviewer · structured-findings JSON Schema · multi-provider consensus framework full spec 72d)** | 🔵 OUT OF SCOPE | — | Per spec 72c §9; not blocking S-F1 or main programme |

**Net state at session-54 wrap:** **rigour-suite programme is ~99% complete** — control-plane simplification (sessions 50-53 batch + session-54 spec amendment) settled; v3b S-8 design contract + AC-1 partial + AC-2 shipped on main via PR #54. **Only 1 substantive item remains before pure `src/` work:** v3b S-8 completion (session 55 P0). After session 55 ships the orchestrator fan-out + workflow rewire + AC-3/4/5 + DoD-13, the rigour-suite programme is canonically complete and S-F1 (first src/ slice) becomes the priority + AC-4 retain/drop measurement clock starts.

## Session 55 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                   # confirm clean tree
git rev-parse --short HEAD origin/main                                       # current main tip (expected: post-wrap-PR-merged tip)
mcp__github__list_pull_requests state=closed base=main perPage=15            # confirm session-54 wrap PR + PR #54 merged
mcp__github__list_pull_requests state=open  base=main perPage=10             # what's currently open (PR #53 carry-over likely; resolve per §Session 55 priorities P3)
```

**Pre-flight Qs (ask user before any code):**

1. **PR #53 reconciliation.** Per §Session 55 priorities P3: merge separately, close unmerged, or port content. Recommend merge separately + take session-54 SESSION-CONTEXT version on conflict.
2. **Priority for session 55?** Recommended P0 = **v3b S-8 completion** per §Session 55 priorities (orchestrator + workflow + golden-replay + retirement + DoD-13). Alternatives: split P0 across 2 PRs if scope exceeds budget; P1 = S-F1 if S-8 lands fast.
3. **CODEOWNERS solo-operator pattern.** Confirm with user that the session-55 P0 PR will require admin-bypass click (touches `.claude/agents/**`, `scripts/**`, `.github/workflows/**`). By design per negative constraint #25.
4. **Recursive validation expected?** Session-55 P0 PR will atomically replace `slice-reviewer.md` with the 4-specialist suite. The very same PR that ships the new auto-review path will be reviewed by the OLD slice-reviewer (since the workflow rewire only takes effect on the next PR after merge). The atomic flip means session-55 PR review is single-agent; subsequent PRs are multi-agent. Surface this with user before starting impl.
5. **Spec 72c §1 + §8 KPI prediction.** Multi-agent target ≤2 rounds for the equivalent finding-density. First post-flip PR will measure this. Record per-specialist findings count + retain/drop framework per AC-4 + spec 72c §8 once first 3 src/ slices ship.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- Live gates (post-PR-52 simplified): `tdd-guard` · `pre-push-dod7` · `tdd-first-every-commit` · `exit-plan-review` · `read-cap` · `auto-review.yml` · `pr-dod.yml` · `.github/CODEOWNERS`.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines (negative constraint #19).
- Auto-review iteration stop-signal (session 54 lesson 4): convergence stalls at 2-finding polish-tier plateau with single-agent recursive; declare iteration stop at the 2-finding plateau if findings are demonstrably non-substantive. Multi-agent should compress this to ≤2 rounds total post-session-55 ship.
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Architectural-smell-trigger:** ≥3 rounds of findings clustered in one file → step back + extract before patching round 4.
- **Verdict vocabulary** (post-PR-#41): Conventional Comments labels + `(blocking)`. Personas emit findings; workflow derives verdict deterministically.
- **AC-4 retain/drop** activates after first 3 src/ slices ship. S-F1 starts the dataset.
