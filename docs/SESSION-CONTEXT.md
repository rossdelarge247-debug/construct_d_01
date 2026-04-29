# Session 51 Wrap Context Block (heading into session 52)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-52 accomplished (rolling window)

- **Sessions 41-46:** v3b S-1 through S-5 — 12/15 ACs landed via PRs #25-#27 across 6 sessions.
- **Session 47:** v3b S-6 (PR #30 9-round live recursive auto-review; 14 findings; v3b 12/15 → 15/15). Auto-review.yml + 3 personas live.
- **Session 48:** v3b S-7 sibling slice (PR #32 §Architectural-smell-trigger) + v3b S-8 setup (PR #33 spec 72c + 6-AC acceptance.md) + v3c stub (PR #34).
- **Session 49:** v3c rubric extension (criterion 2 §Exceptions a-d) + spec 72c §5/§7/§10 prior-art amendments + audit findings queued.
- **Session 50:** 6 PRs merged — PR #36 (72c §9 cross-ref), #37 (criterion 2 §Exceptions a-d), #38 (citations + 100%-rule rename), #39 (slice-resolver fix), #40 (§Exception (e) wrap docs), #41 (Conv Comments verbatim), #42 (fix-up).
- **Session 51:** Rigour-suite delivery push, session 1 of 3. 4 substantial PRs merged: PR #44 (§Examples migration to Conv Comments schema), PR #45 (auto-review findings posted as PR comment with markdown table — visibility fix), PR #46 (verdict-derivation arithmetic extracted to `scripts/derive-verdict.sh` + 16-case shellspec; verdict-coercion fixture per spec 72c §5 rule 3 NOW CI-GATED), PR #47 (slice-AC resolver + persona-JSON parser extracted to `scripts/auto-review-{slice-resolve,parse}.sh` + 21-case shellspec; latent empty-stdin edge case fixed). All non-trivial logic now in tested scripts under `tests/shellspec/`.
- **Session 52 (this wrap):** **Rigour-suite delivery push, session 2 of 3.** Two substantial PRs opened, BOTH merged. **PR #50** (`S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate`, merged @ `68b752d`) promoted both `parse-failed` AND pipeline-crash failure-fallback paths in `auto-review.yml` from `neutral` to `failure`; secret-missing skip stays `neutral` for fork-PR compatibility; CLAUDE.md L251 gate-table row updated for partial-promotion semantics. **PR #49** (`S-INFRA-criterion-2-exceptions-extraction`, merged @ `7395949`) extracted criterion 2 §Exceptions sub-clauses (a-e) from prose paragraphs in `slice-reviewer.md` to a structured YAML (`.claude/agents/criterion-2-exceptions.yaml`) + deterministic file-glob pre-filter at `scripts/criterion-2-exception-check.sh` (15-case shellspec) + 5-row markdown summary table inline in the persona prompt; control-change label applied. PR #49 went through 6 rounds of auto-review iteration before last-iteration declared (each round caught real polish-level issues; refined stop signal in commit msgs to distinguish polish from correctness).

## Current state

### Locked (through session 52)

- 5-phase journey (Start · Build · Reconcile · Settle · Finalise) per spec 42.
- Document-as-spine (4-doc lifecycle) per spec 44.
- Hub + 68a-e locked decisions; 68f/g registers carry opens.
- Spec 70 Build Map: 33-slice catalogue + S-TOOL/S-INFRA families.
- Spec 71 §7a Option 4: single-branch-main; no integration branch; no cutover event.
- Spec 72: 13-item per-slice security checklist; CI gates.
- Hook + CI enforcement: SessionStart · PostToolUse Write/Edit · PreToolUse Read · PreToolUse Bash (pre-commit-verify) · PreToolUse ExitPlanMode (exit-plan-review).
- Stripe SDK pinned `^22.1.0`. Both lockfiles aligned.
- **v3a-foundation shipped** (PR #24 merged session 41) — 8 ACs PASS; verify-slice.sh 7-gate workhorse; tdd-first-every-commit, control-change-label, plan-time gate all live.
- **v3b shipped** — 15/15 ACs landed (PRs #25-#27 + #30 + #32 + #33 across sessions 41-48); auto-review.yml + 3 personas (slice-reviewer + acceptance-gate + ux-polish-reviewer) live on main.
- **v3c partial — sessions 50+51+52 batch landed:** rubric extension §Exceptions (a)-(e) on slice-reviewer.md (PR #37 + PR #40 + PR #49 still open); 4 citations + "100% rule" rename in CLAUDE.md (PR #38); slice-resolver fix in auto-review.yml (PR #39); Conventional Comments schema cascade (PR #41); §Examples migration to Conv Comments (PR #44); auto-review findings as PR comment (PR #45); verdict-derivation extraction with shellspec (PR #46); resolver + parser extraction (PR #47); rigour-malfunction paths promoted to merge-gating failure (PR #50). v3c programme **~98% complete** at session-52 wrap; remaining substantive items: v3b S-8 multi-agent persona suite v2 impl (P1; ~700-900L), P0b-structural (CODEOWNERS migration · pre-commit-verify deprecation · arch-smell reframe; ~400-600L), comment-posting extraction (deferred per smell-trigger build-then-measure).

### Built (on main as of `7395949`; both session-52 work PRs merged)

```
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts          — S-F7-α (PR #20)
src/lib/store/{dev-store,index,scenario-loader,types}.ts          — S-F7-α (PR #20)
src/lib/store/scenarios/{cold-sarah,sarah-mid-build}.json         — S-F7-α (PR #20)
src/lib/stripe/client.ts + package.json + lockfiles               — Stripe pin (S-INFRA-1, PR #22)
.claude/hooks/{line-count,session-start,pre-commit-verify,tdd-first-every-commit,exit-plan-review,read-cap,wrap-check,tdd-guard,pre-push-dod7}.sh  — v3a + v3b
.claude/hooks-checksums.txt + scripts/hooks-checksums.sh          — v3a integrity baseline
.github/workflows/{control-change-label,eslint-no-disable,pr-dod,shellspec,auto-review}.yml  — v3a + v3b CI gates
scripts/{verify-slice,git-state-verifier,eslint-no-disable}.sh    — v3a control plane
docs/eslint-baseline-allowlist.txt + docs/tdd-exemption-allowlist.txt  — v3a allowlists
vitest.config.ts                                                  — coverage threshold + lcov reporter
tests/shellspec/                                                  — v3a + v3b meta-tests
.claude/agents/{slice-reviewer,acceptance-gate,ux-polish-reviewer}.md  — v3b S-6 personas (PR #30 + amended this session in PR #37 / PR #40 / PR #41)
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
scripts/derive-verdict.sh + tests/shellspec/derive-verdict.spec.sh         — verdict arithmetic + 15 cases (PR #46 OPEN)
scripts/auto-review-slice-resolve.sh + tests/shellspec/auto-review-slice-resolve.spec.sh — resolver + 8 cases (PR #47 OPEN)
scripts/auto-review-parse.sh + tests/shellspec/auto-review-parse.spec.sh   — parser + 13 cases (PR #47 OPEN)
.github/workflows/auto-review.yml — comment-posting steps (PR #45 MERGED); resolver/parser/verdict script-call wiring (PR #46/#47 OPEN)
```

**Parked branch:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-rigour-suite complete.

## Session 53 priorities

> **Numbering:** session 52 was rigour-suite session 2 of 3 — shipped PR #50 (parse-failed/pipeline-crash → failure merge-gating); PR #49 (criterion 2 §Exceptions extraction) still open at wrap. Session 53 = **rigour-suite session 3 of 3**: closes the v3c programme by shipping v3b S-8 (multi-agent persona suite v2). After session 53, the rigour suite is ~100% complete and S-F1 (first `src/` slice) is the canonical next priority.

### P0 — v3b S-8 impl (multi-agent persona suite v2)

`S-INFRA-persona-suite-v2-multi-agent` per PR #33-merged acceptance.md (6 ACs already drafted; ~700-900L diff). Spec 72c §5/§7/§10 amendments inform the impl — particularly §7 hybrid fixture seeding (synthetic ships now; golden-PR replay v3c). This is the **last big rigour-suite piece**; absorbs most of session 53. Branch fresh off main; the slice file already exists at `docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md`. Pre-flight: re-read PR #33's 6 ACs + spec 72c §5/§7/§10 before any code.

### P1 — v3c P0b-structural (3 simplifications carried from session 49)

`S-INFRA-rigour-v3c-prior-art-amendments-structural`: CODEOWNERS migration (replace hooks-checksums + control-change-label with `.github/CODEOWNERS`); pre-commit-verify deprecation question; arch-smell trigger reframe as prompt rule not gate. Each needs explicit design + rollback procedure. Big slice; **pick fresh-context session 54** if S-8 absorbs all of session 53.

### P2 — S-F1 kickoff (first src/ slice; design-system tokens)

**Now unblocked** — rigour suite is ~98% complete; S-8 closes it. AC-4 retain/drop measurement activates after first 3 src/ slices ship; S-F1 is the dataset-seeder. Per spec 70 Build Map: design-system token extraction from `docs/design-source/` → `src/lib/design-system/{tokens,components}/` with CSS↔TS structural-parity invariant tests. ~400-600L; 5-8 ACs. **Session 54 or 55** if S-8 + P0b-structural land first; **session 53 second half** if S-8 finishes early.

### P3 — Comment-posting extraction (architectural-smell-trigger build-then-measure; deferred)

`scripts/auto-review-post-comment.sh` extraction if PR #45's comment-posting accrues findings rounds. PR #49 + #50 didn't surface any clustered findings on the comment-posting block. Defer extraction until round-3+ cluster per the trigger doctrine.

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
23. **NEW (session 50): Rebase-on-main as habit before opening any 2nd+ PR in a multi-PR session.** PR #39 + PR #40 + PR #41 all needed retroactive rebase to clear apparent-rollback findings. Make rebase the default first action.
24. **NEW (session 50): Don't cite forward-looking schema/labels/SHAs.** PR #38 §Exception (b) citation referenced labels that didn't exist on the branch's base yet — reviewer correctly flagged. Cite current-main state only; reframe as "in-scope by declaration" if forward state is needed.

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct, Verdict vocabulary (Conventional Comments).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · spec 72a/b/c · spec 73 · `docs/slices/S-INFRA-rigour-v3{a,b}-*/acceptance.md`.
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`.

## Branch

### Branch state at session-52 wrap (verified live)

- **Wrap branch:** `claude/wrap-session-52` (this commit's branch).
- **`main` tip:** `7395949` (PR #49 merged @ wrap-PR-write-time; prior was `68b752d` = PR #50 merge; prior was `f423322` = session-51 wrap).
- **Open PRs at wrap from session 52:** none. Wrap PR (`claude/wrap-session-52`) opens after this commit.
- **Closed/merged this session:** PR #50 (`S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate`) merged @ `68b752d`; PR #49 (`S-INFRA-criterion-2-exceptions-extraction`) merged @ `7395949` (during wrap-doc authoring; webhook delivered the merge event).
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-rigour-suite complete (i.e. after S-8 lands).
- **Live rigour gates:**
  - `tdd-guard.sh` — Write/Edit on `src/**.{ts,tsx}` requires green vitest run (v3b AC-6).
  - `pre-push-dod7.sh` — pre-push gate enforces 7-item slice-DoD (v3b AC-7).
  - `tdd-first-every-commit.sh` — PreToolUse:Bash enforces TDD discipline.
  - `pre-commit-verify.sh` — slice-DoD verification before commit.
  - `exit-plan-review.sh` — plan-time review on ExitPlanMode.
  - `read-cap.sh` — Read tool turn-budget cap.
  - `auto-review.yml` — slice-reviewer persona on every PR. **NEW (session 52 PR #50):** `parse-failed` + pipeline-crash now → `failure` (merge-gating); `request-changes`/`nit-only` → `neutral` (advisory); secret-missing skip → `neutral` (forks unaffected).
  - `control-change-label.yml` — gates L199-protected paths.
  - `pr-dod.yml` — slice-verification reference required on `src/` PRs.
- **AC-2 acceptance-gate** + **AC-3 ux-polish-reviewer** shipped + dormant until S-F1.
- **AC-4 retain/drop measurement** activates after first 3 src/ slices ship.

### v3c trajectory + remaining rigour work

**The big picture (layman summary):** rigour-suite programme is **~98% complete** (was 95% at session 51; session 52 closed criterion 2 §Exceptions extraction + parse-failed/pipeline-crash merge-gating promotion). Only **1 substantive item remains** before pure `src/` work: v3b S-8 multi-agent persona suite v2 (P0 session 53). Plus 1 cleanup slice (P0b-structural) and 1 deferred extraction (comment-posting).

**Remaining work shape:**

| Piece | Size | Status | Why |
|---|---|---|---|
| v3b S-8 multi-agent persona suite v2 (P0 session 53) | large (~700-900L) | queued | 6 ACs drafted in PR #33 acceptance.md. Spec 72c §5/§7/§10 amendments inform impl. Last big rigour-suite piece. |
| P0b-structural (CODEOWNERS · pre-commit-verify deprecation · arch-smell reframe) | large (~400-600L) | session-54 candidate | Each needs design + rollback procedure. Pick fresh-context. |
| S-F1 kickoff (first src/ slice; design-system tokens) | medium (~400-600L) | unblocked once S-8 lands | Dataset-seeder for AC-4 retain/drop. Session 54/55 candidate; or 53 if S-8 finishes early. |
| Comment-posting extraction | medium (~100-150L) | architectural-smell-trigger; deferred | PR #45 + PR #49 + PR #50 surfaced no findings clustering on the comment-posting block. Build-then-measure; defer until round-3+ cluster. |
| Mutation testing / Stryker · property-based / fuzz · golden-PR replay · multi-provider 3rd reviewer · structured-findings JSON Schema | various | v3c carry-over | Per spec 72c §"Out of scope". Not blocking. |

**Net: 1 more session (53) of rigour-suite cleanup, then `src/` work (S-F1) becomes the focus.** Session 52 closed 2 of the 3 remaining items the prior session had queued (only S-8 left).

### Next session (53) FIRST ACTIONS

1. **Turn-0 verification.** `git rev-parse --short HEAD origin/main` for current main tip. `mcp__github__list_pull_requests state=open base=main perPage=10` for currently open PRs (should be empty if all session-52 PRs merged including the wrap PR). Read SessionStart hook output.
2. **Verify branch state + working tree clean.** Resync if BEHIND > 0.
3. **Confirm priority with user.** Session 53 P0 recommended = **v3b S-8 multi-agent persona suite v2 impl**. Alternatives: P1 P0b-structural · P2 S-F1 kickoff.
4. **If P0 (v3b S-8):** read `docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md` (6 ACs drafted in PR #33 — already merged); read spec 72c §5/§7/§10 amendments; branch fresh off main as `claude/S-INFRA-persona-suite-v2-multi-agent` (or similar); design implementation around §7 hybrid fixture seeding (synthetic ships now; golden-PR replay v3c carry-over). ~700-900L; absorbs most of a session.
5. **If S-8 finishes mid-session:** consider whether to roll into S-F1 (per Coding conduct §Surgical changes — may stretch session budget) or wrap early.
6. **Live rigour gates** — every commit dogfoods them. Don't `--no-verify` unless explicit. Plan-time gate fires on ExitPlanMode. **Session 52 promotion in effect:** persona parse-failed or workflow crash now BLOCKS the merge button; re-running the workflow is the escape hatch.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-51 additions:

```
docs/HANDOFF-SESSION-51.md                                        — session 51 retro (NEW)
docs/slices/S-INFRA-AC-5-examples-migration/                      — PR #44 OPEN
docs/slices/S-INFRA-auto-review-findings-comment/                 — PR #45 MERGED
docs/slices/S-INFRA-derive-verdict-script-extract/                — PR #46 OPEN
docs/slices/S-INFRA-auto-review-resolver-parser-extract/          — PR #47 OPEN
scripts/derive-verdict.sh                                         — verdict arithmetic extraction (PR #46 OPEN); test contract: tests/shellspec/derive-verdict.spec.sh
scripts/auto-review-slice-resolve.sh                              — slice-AC resolver (PR #47 OPEN); test contract: tests/shellspec/auto-review-slice-resolve.spec.sh
scripts/auto-review-parse.sh                                      — persona-JSON parser; closes empty-stdin edge case (PR #47 OPEN); test contract: tests/shellspec/auto-review-parse.spec.sh
tests/shellspec/derive-verdict.spec.sh                            — 15 cases (8-row table + 7 adversarial / verdict-coercion-fixture)
tests/shellspec/auto-review-slice-resolve.spec.sh                 — 8 cases
tests/shellspec/auto-review-parse.spec.sh                         — 13 cases
.github/workflows/auto-review.yml                                 — comment-posting steps (PR #45); script-call wiring for resolver / parser / verdict (PR #46/#47 OPEN); permissions widened to pull-requests: write
.claude/agents/{slice-reviewer,acceptance-gate,ux-polish-reviewer}.md — §Examples migrated to Conv Comments shape (PR #44 OPEN)
```

## Session 52 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                  # confirm clean tree
git rev-parse --short HEAD origin/main                                      # current main tip
mcp__github__list_pull_requests state=closed base=main perPage=15           # confirm session-51 PRs (#44/#46/#47/wrap-PR) merged
mcp__github__list_pull_requests state=open  base=main perPage=10            # what's currently open
```

**Pre-flight Qs (ask user before any code):**

1. **Have PR #44, #46, #47 all merged?** P0 (§Exceptions table extraction) requires PR #44 merged on main — same file (`slice-reviewer.md`). If PR #44 is still open, either (a) rebase + merge it first, or (b) defer P0 to session 53 and run P1 (v3b S-8) or P2 (parse-failed→failure promotion) instead.
2. **Priority for session 52?** Recommended P0 = `S-INFRA-criterion-2-exceptions-table-extraction`. Alternatives: P1 v3b S-8 · P2 parse-failed→failure · P3 P0b-structural · P4 comment-posting extraction · P5 S-F1.
3. **Multi-PR session?** If yes, **rebase-on-main before opening any 2nd+ PR** (negative constraint #23 from session 50; honoured cleanly through session 51).
4. **Recursive validation expected?** If P0 ships criterion 2 §Exceptions extraction, the slice's own auto-review will exercise the new structured-table eligibility-check. Same recursive-validation pattern that worked cleanly through session-51 PRs #44-#47.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- Live gates: `tdd-guard` · `pre-push-dod7` · `tdd-first-every-commit` · `pre-commit-verify` · `exit-plan-review` · `read-cap` · `auto-review.yml` · `control-change-label.yml` · `pr-dod.yml`.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines (negative constraint #19).
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Architectural-smell-trigger:** ≥3 rounds of findings clustered in one file → step back + extract before patching round 4.
- **Verdict vocabulary** (post-PR-#41): Conventional Comments labels + `(blocking)`. Personas emit findings; workflow derives verdict deterministically.
- **AC-4 retain/drop** activates after first 3 src/ slices ship. S-F1 starts the dataset.
