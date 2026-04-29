# Session 50 Wrap Context Block (heading into session 51)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-50 accomplished (rolling window)

- **Sessions 41-46:** v3b S-1 through S-5 — 12/15 ACs landed via PRs #25-#27 across 6 sessions.
- **Session 47:** v3b S-6 (PR #30 9-round live recursive auto-review; 14 findings; v3b 12/15 → 15/15). Auto-review.yml + 3 personas live.
- **Session 48:** v3b S-7 sibling slice (PR #32 §Architectural-smell-trigger paragraph) + v3b S-8 setup (PR #33 spec 72c + 6-AC acceptance.md) + v3c stub (PR #34). Recursive-self-application 3-round dataset captured.
- **Session 49:** v3c rubric extension (criterion 2 §Exceptions a-d shipped on `claude/v3c-rubric-s8-impl-4kC9R`) + spec 72c §5/§7/§10 prior-art amendments + broader rigour-suite audit findings queued (5 enhancements + 3 simplifications + 4 citations across 15 controls A-O).
- **Session 50 (this wrap):** 6 PRs merged in one session — PR #36 (P2 carry-over, spec 72c §9 cross-ref), PR #37 (rubric extension §Exceptions a-d + 72c amendments), PR #38 (4 citations + "100% rule" rename — audit IDs A/D/E/F), PR #39 (auto-review slice-resolver fix), PR #40 (criterion 2 §Exception (e) for wrap docs), PR #41 (AC-5 Conventional Comments verbatim — schema cascade), PR #42 (1-line fix-up for lost commit `8827745`). 7 distinct auto-review invocations recorded; 4 caught real findings the main conversation missed; recursive self-application validated §Exceptions (a)-(e). Apparent-rollback bug surfaced + fixed (rebase-on-main as habit for multi-PR sessions). 5 v3c carry-overs queued (§Exceptions table extraction · resolver+parser script extraction · verdict-derivation script extraction · §Examples migration · verdict-coercion fixture refresh).

## Current state

### Locked (through session 50)

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
- **v3c partial — session-50 batch landed:** rubric extension §Exceptions (a)-(e) on slice-reviewer.md (PR #37 + PR #40); 4 citations + "100% rule" rename in CLAUDE.md (PR #38); slice-resolver fix in auto-review.yml (PR #39); Conventional Comments schema cascade across CLAUDE.md §Verdict vocabulary + spec 72c §5 + 3 personas + auto-review.yml parser (PR #41).

### Built (on main as of `a4c9c7e`)

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
```

**Parked branch:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-rigour-suite complete.

## Session 51 priorities

> **Numbering:** session 41-48 = v3b S-1 to S-8 setup. Session 49 = v3c rubric extension + spec 72c amendments. Session 50 = 6-PR rigour batch shipped (rubric §Exceptions (a)-(e), Conventional Comments schema, 4 citations, slice-resolver fix). Session 51 = **first src/ slice (S-F1) kickoff** OR remaining-rigour cleanup if user prefers tidiness first.

### P0 — S-F1 kickoff (first src/ slice; design-system tokens)

**The unblocking question for Phase C:** v3a + v3b are 100% on main; v3c spec-content is largely on main. Remaining v3c work is **structural extraction + housekeeping**, none of which BLOCKS S-F1. AC-4 retain/drop measurement activates after first 3 src/ slices ship — S-F1 is the dataset-seeder.

S-F1 scope (per spec 70 Build Map): design-system token extraction from Claude AI Design source outputs (`docs/design-source/`) → `src/lib/design-system/{tokens,components}/` with CSS↔TS structural-parity invariant tests. Probably 5-8 ACs; ~400-600L if executed cleanly.

S-F1 is the first PR that exercises the FULL rigour suite end-to-end on a real `src/` change: tdd-guard (vitest gate on Write/Edit), pre-push-dod7, auto-review (with new Conventional Comments schema), ux-polish-reviewer (activates on UI surface), acceptance-gate (activates at slice completion). Session 51 should expect the rigour suite to surface findings; budget for review iterations.

### P1 — §Examples migration (rigour cleanup; non-blocking for P0)

`S-INFRA-AC-5-examples-migration` slice. Mechanical migration of 3 persona files' §Examples JSON output blocks from old `{verdict, severity, findings[]}` schema to new `{summary, findings[]}` Conv Comments shape per PR #41. Now-unblocked since PR #37 + PR #40 + PR #41 all merged. ~80-150L diff. No design needed.

### P2 — v3b S-8 impl (multi-agent persona suite v2)

`S-INFRA-persona-suite-v2-multi-agent` per PR #33-merged acceptance.md (6 ACs; ~700-900L diff). Spec 72c §5/§7/§10 amendments now on main inform the impl — particularly §7 hybrid fixture seeding (synthetic ships now; golden-PR replay v3c). NOT blocking S-F1; recommended after S-F1 ships so multi-agent v2 has real-`src/`-slice traffic to seed.

### P3 — v3c structural carry-overs (3 extractions, all queued by session 50)

All non-blocking for P0/P1/P2. Pick when measurement signals justify the work:

- **§Exceptions table extraction** (`S-INFRA-criterion-2-exceptions-table-extraction`) — refactor slice-reviewer.md criterion 2 §Exceptions (5 sub-clauses now) to structured table/YAML + tested eligibility-check script.
- **auto-review.yml resolver+parser extraction** — `scripts/auto-review-{slice-resolve,parse}.sh` with shellspec coverage. Workflow has accrued ≥8 patch rounds; build-then-measure principle says extract at next finding cluster.
- **Verdict-derivation script extraction** — `scripts/derive-verdict.sh` with shellspec on the 8-row edge-case table from PR #41 verification.md (includes adversarial inputs).

### P4 — P0b-structural (3 simplifications carried from session 49)

`S-INFRA-rigour-v3c-prior-art-amendments-structural`: CODEOWNERS migration (replace hooks-checksums + control-change-label with `.github/CODEOWNERS`); pre-commit-verify deprecation question; arch-smell trigger reframe as prompt rule not gate. Each needs explicit design + rollback procedure. Big slice; pick fresh-context.

### P5 — Verdict-coercion fixture refresh under Conv Comments schema

Spec 72c §5 rule 3 references the fixture but it's not currently CI-gated. Test pattern is already documented (8-row edge-case table from PR #41 verification.md including adversarial inputs like `{label: "issue", blocking: "true"}` string-vs-bool).

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

### Branch state at session-50 wrap (verified live)

- **Wrap branch:** `claude/wrap-session-50` (this commit's branch).
- **`main` tip:** `a4c9c7e` (session-50 batch fully merged: PR #36, #37, #38, #39, #40, #41, #42).
- **Open PRs at wrap:** none from session 50.
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-rigour-suite complete.
- **Live rigour gates:**
  - `tdd-guard.sh` — Write/Edit on `src/**.{ts,tsx}` requires green vitest run (v3b AC-6).
  - `pre-push-dod7.sh` — pre-push gate enforces 7-item slice-DoD (v3b AC-7).
  - `tdd-first-every-commit.sh` — PreToolUse:Bash enforces TDD discipline.
  - `pre-commit-verify.sh` — slice-DoD verification before commit.
  - `exit-plan-review.sh` — plan-time review on ExitPlanMode.
  - `read-cap.sh` — Read tool turn-budget cap.
  - `auto-review.yml` — slice-reviewer persona on every PR (now Conv Comments schema).
  - `control-change-label.yml` — gates L199-protected paths.
  - `pr-dod.yml` — slice-verification reference required on `src/` PRs.
- **AC-2 acceptance-gate** + **AC-3 ux-polish-reviewer** shipped + dormant until S-F1.
- **AC-4 retain/drop measurement** activates after first 3 src/ slices ship.

### v3c trajectory + remaining rigour work

**The big picture (layman summary):** the rigour-suite programme is ~85% complete. v3a (foundation) + v3b (subagent suite) are 100% on main. v3c (quality + rewrite) shipped its main batch this session. Remaining v3c is **structural extraction + housekeeping + measurement-pending work**, none of which BLOCKS first-src/-slice (S-F1) work. The rigour suite is now the floor; new src/ work dogfoods it.

**Remaining work shape:**

| Piece | Size | Blocks S-F1? | Why |
|---|---|---|---|
| §Examples migration in 3 personas | small (~80-150L) | no | Mechanical post-PR-41 cleanup; pedagogical examples lag the schema-of-record. |
| Verdict-coercion fixture refresh | small (~50-80L) | no | Test fixtures for Conv Comments schema; spec already references the pattern. |
| §Exceptions table extraction | medium (~150-250L) | no | Refactor 5-clause prose to structured + tested. Build-then-measure deferred trigger. |
| auto-review.yml resolver+parser extraction | medium (~200-300L) | no | Extract to tested scripts. Workflow has accrued ≥8 patch rounds; smell-trigger queued. |
| Verdict-derivation script extraction | small-medium (~150L) | no | 8-row edge-case table from PR #41 verification.md is the test contract. |
| P0b-structural (CODEOWNERS · pre-commit deprecation · arch-smell reframe) | large (~400-600L) | no | Each needs design + rollback procedure. Pick fresh-context. |
| v3b S-8 multi-agent persona suite v2 | large (~700-900L) | no | 6 ACs already drafted. Better with src/-slice traffic to seed measurement. |
| AC-7 jest-axe + axe-playwright + Storybook | medium | yes-eventually | Activates AT S-F1 (a11y testing on UI surfaces). Couple with S-F1 if doing UI early. |

**Net: ~1 more session of optional cleanup + S-F1 can start now.** S-F1 is the dataset-seeder for AC-4 retain/drop measurement; subsequent src/ slices compound on its review iterations.

### Next session (51) FIRST ACTIONS

1. **Turn-0 PR + main verification.** `mcp__github__list_pull_requests state=closed perPage=10` to confirm session-50 PR-merge state. `git rev-parse --short HEAD origin/main` for current main tip. Distrust kickoff factual claims.
2. **Verify branch state + working tree clean.** SessionStart hook surfaces live state — read it; resync if BEHIND > 0.
3. **Confirm priority with user.** SESSION-CONTEXT §"Session 51 priorities" suggests P0 (S-F1 kickoff) but user may pick P1 (§Examples migration) or P2-P5 instead. The remaining-work table at §"v3c trajectory + remaining rigour work" is the layman-summary anchor.
4. **If P0 (S-F1):** read spec 70 Build Map S-F1 row + `docs/design-source/` (the Claude AI Design outputs); draft S-F1 acceptance.md (5-8 ACs); spawn pre-AC-freeze adversarial review per spec 72b §"Use when". Expect rigour suite to surface findings on the first real src/ commit; budget for review iterations.
5. **If P1 (§Examples migration):** draft slice on a fresh branch off main; mechanical migration of `{verdict, severity, findings[]}` JSON blocks in 3 persona files to `{summary, findings[]}` shape per PR #41. ~80-150L. No design needed.
6. **If P2-P5:** consult priorities §P2-P5 for scope; each is bigger and can absorb a full session.
7. **Live rigour gates** — every commit dogfoods them. Don't `--no-verify` unless explicit. Plan-time gate fires on ExitPlanMode.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-50 additions:

```
docs/HANDOFF-SESSION-50.md                                        — session 50 retro (NEW)
docs/slices/S-INFRA-v3c-rubric-extension/{acceptance,verification}.md — PR #37 + PR #42
docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-easy/{acceptance,verification,security}.md — PR #38
docs/slices/S-INFRA-auto-review-slice-resolver-fix/{acceptance,verification,security}.md — PR #39
docs/slices/S-INFRA-v3c-rubric-extension-2/{acceptance,verification,security}.md — PR #40
docs/slices/S-INFRA-AC-5-conventional-comments-impl/{acceptance,verification,security}.md — PR #41
.claude/agents/{slice-reviewer,acceptance-gate,ux-polish-reviewer}.md  — Conv Comments output schema (PR #41)
.github/workflows/auto-review.yml                                 — slice-resolver fix (PR #39) + verdict-derivation arithmetic (PR #41)
CLAUDE.md §"Verdict vocabulary"                                   — Conv Comments rewrite (PR #41)
CLAUDE.md §"Engineering conventions" §"100% rule (AC arithmetic)"  — renamed + cited (PR #38)
docs/workspace-spec/72c-multi-agent-review-framework.md §5         — verdict aggregation rewritten (PR #41)
```

## Session 51 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                  # confirm clean tree
git rev-parse --short HEAD origin/main                                      # current main tip
mcp__github__list_pull_requests state=closed base=main perPage=10           # confirm session-50 wrap-PR + any new merges
mcp__github__list_pull_requests state=open  base=main perPage=10            # what's currently open
```

**Pre-flight Qs (ask user before any code):**

1. **Priority for session 51?** Recommended P0 = S-F1 kickoff (first src/ slice; design-system tokens). Alternatives: P1 §Examples migration · P2 v3b S-8 multi-agent · P3 structural extractions · P4 P0b-structural · P5 verdict-coercion fixture.
2. **If S-F1: scope-cap?** Per spec 70 Build Map S-F1 row. Recommend 5-8 ACs. CSS↔TS structural-parity invariant tests + Claude AI Design source extraction. Expect ~400-600L.
3. **Multi-PR session?** If yes, **rebase-on-main as habit** before opening any 2nd+ PR (negative constraint #23 added this session). Avoid the apparent-rollback bug.
4. **Auto-review parse-failed handling?** PR #40 hit parse-failed; cause unverified. If it recurs, queue verdict-derivation extraction (P3 carry-over) sooner.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- Live gates: `tdd-guard` · `pre-push-dod7` · `tdd-first-every-commit` · `pre-commit-verify` · `exit-plan-review` · `read-cap` · `auto-review.yml` · `control-change-label.yml` · `pr-dod.yml`.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines (negative constraint #19).
- **Dogfood discipline:** every commit passes the gates. No `--no-verify` unless explicit user authorisation.
- **Architectural-smell-trigger:** ≥3 rounds of findings clustered in one file → step back + extract before patching round 4.
- **Verdict vocabulary** (post-PR-#41): Conventional Comments labels + `(blocking)`. Personas emit findings; workflow derives verdict deterministically.
- **AC-4 retain/drop** activates after first 3 src/ slices ship. S-F1 starts the dataset.
