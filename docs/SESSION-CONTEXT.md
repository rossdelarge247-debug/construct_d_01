# Session 40 Wrap Context Block (heading into session 41)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 35-39 accomplished (rolling window)

- **Session 35:** PR #22 (S-INFRA-1 Stripe pin) merged + PR #21 (S-TOOL-1) merged + S-F7-β AC frozen + scaffold pushed.
- **Session 36:** S-F7-β implementation (8 commits on `claude/S-F7-beta-impl`; PR not opened — β cleanup parked pending v3a-foundation merge). Self-audit triggered the rigour-pivot programme.
- **Session 37:** v3a-foundation slice planning COMPLETE through 5 adversarial review iterations → v5 nit-only verdict → v5.1 polish.
- **Session 38 (multi-attempt; uncaptured handoff):** Session-38a crashed after `a898393` (S-37-0 shellspec install). Subsequent recovery sessions landed `S-37-1` (RED meta-tests) → `S-37-2` (verify-slice skeleton) → `S-37-3` (hooks-checksums baseline) → `S-37-4` + `S-37-4a` (ESLint function-size + scoped fix) → `S-37-5` (pre-commit verify hook) on `claude/S-INFRA-rigour-v3a-foundation` (G1 branch rename actioned). PR #24 opened as draft for CI visibility. No formal session-38 HANDOFF was generated.
- **Session 39:** Closed AC-7 (`S-37-6` exit-plan-review hook + nonce framing + `git-state-verifier.sh`), AC-2 part 2 (`S-37-7/7a` control-change-label workflow), AC-8 (`S-37-8` CLAUDE.md "Hard controls" stub). PR #24 GREEN at `8bf866f`. Session-37-budgeted v3a items all PASS.
- **Session 40 (this wrap):** Session-38 budget closed — S-38-2 RED (`31be543`) + S-38-1 GREEN (`e45152b`) for verify-slice.sh full-mode impl; S-38-4 (`95481e5`) for vitest coverage config + lcov parser (AC-6); S-38-3 RED (`9862158`) + GREEN (`2c676d0`) for `.claude/hooks/tdd-first-every-commit.sh` + exemption allowlist (AC-5). Plus a parallel-session CI fix `5adec84` (shellspec install pin to 0.28.1). verification.md AC-1/4/5/6 PASS rows added; 6 new v3b carry-over items captured. PR #24 body refreshed to DoD-11 final form (L184). **DoD-3 adversarial review hit per-turn 300-line read-cap and rendered procedural `request-changes` verdict; one real finding (DoD-7 temporal gap on S-38-2 → S-38-1 push timing) addressed honestly in verification.md as `PASS-with-DoD-7-gap`.** PR remains DRAFT pending user decision on three merge paths (see § Session 41 priorities). 8/8 ACs PASS in `verification.md`; slice content shipped, slice-discipline gate state surfaced for human-reviewer judgment.

## Current state

### Locked (through session 39)

- 5-phase journey (Start · Build · Reconcile · Settle · Finalise) per spec 42.
- Document-as-spine (4-doc lifecycle) per spec 44.
- Hub + 68a-e: navigation, trust, share, exit, AI coach (cross-cutting); Sarah's Picture mechanics (Build); joint doc + conflict card + queue (Reconcile); proposal + AI coach + counter (Settle); generation + pre-flight + fork + submit (Finalise).
- Spec 70 Build Map: 33-slice catalogue + S-TOOL-N tooling-slice family + S-INFRA-N infrastructure-slice family.
- Spec 71 §7a Option 4: single-branch-main; no integration branch; no cutover event.
- Spec 72: 13-item per-slice security checklist; CI gates.
- Hook + CI enforcement (session 27 + 39 additions): SessionStart · PostToolUse Write/Edit · PreToolUse Read · PreToolUse Bash (pre-commit-verify) · PreToolUse ExitPlanMode (exit-plan-review).
- Stripe SDK pinned `^22.1.0`. Both lockfiles aligned.
- **S-INFRA-rigour-v3a-foundation:** 8 ACs frozen + adversarial-review-approved (v5 nit-only). Bundle is multi-concern by-design with audit-trailed per-AC dependency table.
- **(session 39): v3a session-37-budget complete.** AC-1 skeleton + AC-2 (both parts) + AC-3 + AC-4 + AC-7 + AC-8 PASS per `verification.md`. Plan-time gate (AC-7) live with random-nonce framing. Control-change-label workflow live with step-level path detection (branch-protection-compatible).
- **NEW (session 40): v3a session-38-budget complete + slice content shipped.** AC-1 (full impl) + AC-5 + AC-6 added to PASS rows; AC-4 promoted from IN-PROGRESS to PASS (perf 0.024s incremental, well under G16 5s). `scripts/verify-slice.sh` is now the 7-gate workhorse (file-presence + §11 13-item checklist + leak-scan + ESLint denial check + tsc + vitest + per-language coverage), modes `incremental` (default; pre-commit) vs `--full` (CI). `.claude/hooks/tdd-first-every-commit.sh` is the AC-5 PreToolUse:Bash gate. `vitest.config.ts` carries `lines: 90` thresholds (gate dormant until `@vitest/coverage-v8` + `--coverage` wiring; v3b activates). 48/48 shellspec GREEN at `2c676d0`. AC-2 protected scope extended (`vitest.config.ts`, `docs/tdd-exemption-allowlist.txt`). DoD-3 verdict is procedural `request-changes` (reviewer hit read-cap); DoD-7 honest gap on S-38-2/S-38-1 timing. 8/8 ACs PASS; 8 v3b carry-over items recorded.

### Built (on main as of `18c2a0c`)

```
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts          — S-F7-α (PR #20, session 34)
src/lib/store/{dev-store,index,scenario-loader,types}.ts          — S-F7-α (PR #20, session 34)
src/lib/store/scenarios/{cold-sarah,sarah-mid-build}.json         — S-F7-α (PR #20, session 34)
src/lib/stripe/client.ts                                          — apiVersion aligned (S-INFRA-1, PR #22, session 35)
package.json + lockfiles                                          — stripe@22.1.0 pinned
.claude/hooks/{line-count,session-start}.sh                       — S-TOOL-1 (PR #21, session 35)
.claude/hooks/{pre-commit-verify,tdd-first-every-commit,exit-plan-review,read-cap,wrap-check}.sh  — v3a-foundation (PR #24, session 41)
.claude/hooks-checksums.txt + scripts/hooks-checksums.sh          — v3a-foundation integrity baseline (PR #24)
.github/workflows/{control-change-label,eslint-no-disable,pr-dod,shellspec}.yml  — v3a-foundation CI gates (PR #24)
scripts/{verify-slice,git-state-verifier,eslint-no-disable}.sh    — v3a-foundation control plane (PR #24)
docs/eslint-baseline-allowlist.txt + docs/tdd-exemption-allowlist.txt  — v3a-foundation allowlists (PR #24)
vitest.config.ts                                                  — coverage threshold + lcov reporter (v3a AC-6, PR #24)
tests/unit/hooks-{line-count,session-start}.test.ts               — S-TOOL-1 hook tests
tests/shellspec/                                                  — v3a meta-tests (PR #24)
docs/slices/{S-F1,S-B-1,S-B-2,S-C-U4,S-F7-alpha,S-INFRA-1,S-TOOL-1,S-F7-beta,S-INFRA-rigour-v3a-foundation}/  — slice docs
CLAUDE.md §{Planning conduct, Coding conduct, Engineering conventions, Hard controls (in development)}  — sessions 34, 37, 41
```

**On `claude/S-F7-beta-impl` (8 ahead, parked):** S-F7-β impl (session 36); PR not opened; cleanup parked pending v3b complete.

**On `claude/audit-v3b-pr24-merge-YUwug` @ `b94cddf` (5 ahead, pushed):** v3b S-1 (audit + acceptance.md redraft) + S-2 (`/security-review` + `/review` + 11 findings addressed). AC table frozen at session-42 wrap; impl phase opens at session 43. No PR yet (deferred per session-42 P1).

**Ghost: `claude/security-review-v3b-Cb8KB`** — 4 cherry-pick commits identical to v3b S-1 (session 42 reconciliation; abandoned per pivot to canonical). Safe to delete on origin.

## Session 43 priorities

> **Numbering:** session 41 = v3b S-1 (audit + acceptance.md redraft) wrapped as `HANDOFF-SESSION-41.md`. Session 42 = v3b S-2 (`/security-review` + `/review` + 11 findings addressed) wrapped as `HANDOFF-SESSION-42.md`. Session 43 = v3b S-3 onwards (impl phase opens with AC-14 `@vitest/coverage-v8` activation).

### P0 — v3b S-3: `@vitest/coverage-v8` activation (AC-14)

First impl commit. Activates v3a's dormant coverage gate. Per `acceptance.md` AC-14 (L106-110, post-S-2 edits): add `@vitest/coverage-v8` devDep + wire `vitest.config.ts` for `lcov` reporter + update `.github/workflows/ci.yml` to run `pnpm vitest --coverage` + verify-slice.sh Gate 5 enforces ≥**90%** threshold per spec 72 F6 (matches v3a `acceptance.md` L178; v3b inherits, does not regress — finalised at S-2 per R-8 resolution). RED-tests-first per H6 pattern; manual DoD-7 discipline until v3b AC-7 (pre-push gate) ships at S-N.

### P1 — v3b S-4 onwards: ACs by group order (A → B → C → D → E)

After AC-14 lands. AC-12 (`line-count.sh` re-baseline fix, group D) is high-priority — fixes the bug that has fired false-positive STOPs across sessions 32, 40, 41, 42. After AC-12 ships, the manual `/tmp/claude-base-*.txt` workaround can retire. Then group A personas (AC-1..5: `slice-reviewer`, `acceptance-gate`, `ux-polish-reviewer`, retain/drop metric, `.claude/agents/` vs `subagent-prompts/` reconciliation) → group B hooks (AC-6 `tdd-guard`, AC-7 pre-push DoD-7 gate) → group C doc/convention (AC-8 TDD bail-out rubric, AC-9 preview-deploy checklist, AC-10 adversarial-review budget) → remaining group D (AC-11 L199 amendment, AC-13 lcov parser meta-test) → group E (AC-15 plan-review default-spawn flip after measurement).

### P1 — Optional: open draft PR for v3b commits (`origin/main..HEAD`, currently 5)

Defer to S-3 ship if slice-verification scaffolding lands then. pr-dod.yml requires `verification.md` reference OR `no-slice-required` label — neither exists yet. Opening a PR now adds CI cycles without unblocking impl.

### P2 — `line-count.sh` re-baseline bug (carry-over #3 / v3b AC-12)

**Fifth evidence point** (sessions 32 lockfile, 40 cross-branch resync, 41 cross-branch resync, 41-followup post-merge rebase, 42 cross-branch pivot from `claude/security-review-v3b-Cb8KB` to `claude/audit-v3b-pr24-merge-YUwug`). Manual workaround re-applied at session-42 start (re-baselined `/tmp/claude-base-*.txt` to current HEAD post-pivot). v3b AC-12 (now P1 as part of S-4 group D priority bump) is the structural fix.

### P2 — surface housekeeping

- **Ghost branch cleanup:** `origin/claude/security-review-v3b-Cb8KB` exists with 4 cherry-pick commits identical to v3b S-1 (no unique work) — abandoned mid-session-42 per pivot to canonical. Safe to delete; left for user to call.
- `docs/slices/S-INFRA-rigour-v3a-foundation/HANDOFF-SLICE-WRAP.md` (consolidating retro across sessions 37–42) still pending; defer to v3b mid-impl or v3c kickoff.

## Scope ceiling

Single-P0 session. v3a foundation is the unblocking slice. Don't add adjacent slice work; don't refactor; don't reskin. If session 40 hits the 1500-line warn mid-impl, **stop and re-slice** — ship what's complete + carry rest to session 41. Don't push past 2000.

## Negative constraints (preserve from session 36)

1. Do NOT frame Decouple as a "financial disclosure tool." Spec 42 complete-settlement-workspace framing is load-bearing.
2. Phase-C-freeze model RETIRED (session 24 Option 4). Single-branch-main; no integration branch; no cutover event.
3. Do NOT re-introduce any file from the wiped V1 tree (`src/components/workspace/*` etc.).
4. Do NOT re-open 68a-e locked decisions unless new evidence surfaces. Same for 68g C-U4/U5/U6 (locked session 28).
5. Do NOT read pre-pivot specs (03-06, 11, 12). Active framing: 42, 44, 65, 67, 68, 68a-g, 70, 71, 72, 73.
6. `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` mandatory in Production (spec 72 §2 + §7). CI gate enforces.
7. Read discipline enforced by `.claude/hooks/read-cap.sh`: full-file Reads of >400-line files blocked without offset+limit; per-turn total >300 blocked.
8. V1 legacy palette gone. Visual canonical = Claude AI Design tool outputs (session 22).
9. Safeguarding V1 = signposting + baseline (spec 67 Gap 11, spec 72 §9).
10. Identity verification waits until consent-order stage.
11. **MLP not MVP** — scope decisions per slice framed as "what the *loveable* version requires". Users in crisis.
12. AI extracts facts, app generates questions — never put reasoning in AI extraction schemas.
13. Anthropic SDK uses `output_config.format` (not `response_format`). All JSON schemas need `additionalProperties: false`. SDK timeout 90s; route maxDuration 300s.
14. CLAUDE.md moratorium: 6 candidates lifted total. 8 currently parked (AUX-3 · #3 · #7 · #9 · #10 · #11 · #13 · #14). Lift after 2 clean uses.
15. Don't treat failing tests as spec.
16. Don't trust kickoff-prompt factual claims without live verification. SessionStart hook surfaces live branch state; use it.
17. DoD CI gate enforces slice-verification on src/ PRs.
18. Spec 73 copy patterns are mandatory for user-facing strings.
19. Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
20. Dual-lockfile divergence guard (S-INFRA-1 session 35).
21. **NEW (session 37): Rigour > speed.** Adversarial subagent reviews used at relevant points. v3a-foundation slice exists specifically to fix TDD-skipped + monolithic-functions + DoD-drift discipline lapses surfaced in session 36 self-audit. Once v3a-foundation merges, every commit dogfoods the rigour controls. **No checkbox theatre** — every adversarial finding addressed or explicitly deferred with reasoning.
22. **NEW (session 37): Rigour-pivot programme has 3 sub-slices** (v3a-foundation NOW; v3b-subagent-suite NEXT; v3c-quality-and-rewrite LAST). v3b + v3c stubs in `docs/slices/S-INFRA-rigour-v3{b,c}-*/acceptance.md` with scope markers; full ACs drafted per slice when each begins.

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct.
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · spec 73 · `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md` (the slice plan) · `docs/engineering-phase-candidates.md`.
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`.

## Branch

### Branch state at session-42 wrap (verified live, not from kickoff memory)

- **Active:** `claude/audit-v3b-pr24-merge-YUwug` @ `b94cddf` · 5 ahead of `origin/main` `18c2a0c` · 0 behind · pushed · no PR yet (deferred). v3b S-1 + S-2 shipped; AC table frozen; reviews `approve` post-resolution.
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-v3b complete.
- **Ghost on origin (safe to delete):** `claude/security-review-v3b-Cb8KB` · 4 cherry-pick commits = v3b S-1; abandoned mid-session-42 per pivot to canonical.
- **`main`** @ `18c2a0c` · PR #24 (S-INFRA-rigour-v3a-foundation) merged at `2026-04-27T19:23:07Z`.

### Iteration trajectory of v3b-subagent-suite slice (planning)

S-1 (session 41, `25dc85f` + `6a488e8` + `d2da7e7`): one-time deliberate pass over Tier-4 archive sources → `audit-findings.md` (130L; full inventory) → `acceptance.md` redrafted top-down to 15 ACs grouped A–E.
S-2 (session 42, `b94cddf`): `/security-review` zero findings (per FP rule 16); `/review` 17 findings, 7 logic-severity. User accepted all 5 recommended defaults for load-bearing logic findings. 11 in-scope findings addressed; 2 deferred with reasoning; 4 approved unchanged. Verdict shifted `request-changes` → `approve`. AC table frozen.

### Next session (43) FIRST ACTIONS

1. Verify branch state per `.claude/hooks/session-start.sh`. Expected: HEAD `b94cddf` or further ahead. **Heads-up:** line-count hook may show inflated baseline if cross-branch resync happens — manual fix is `echo $(git rev-parse HEAD) > /tmp/claude-base-${SESSION_ID}.txt` until v3b AC-12 ships.
2. Confirm PR #24 still merged + main tip is still `18c2a0c` (or newer if other PRs merged): `mcp__github__pull_request_read pullNumber=24` returns `state: closed, merged: true`.
3. **v3b S-3 = AC-14 `@vitest/coverage-v8` activation** per kickoff §P0. Read `acceptance.md` AC-14 (post-S-2 edits — coverage floor is now ≥**90%** matching v3a). RED-tests-first per H6 pattern; manual DoD-7 discipline until v3b AC-7 ships.
4. **Optional — open draft PR for the 5 v3b commits.** Defer if S-3 also adds `verification.md` scaffolding.
5. **Optional — delete ghost branch** (`origin/claude/security-review-v3b-Cb8KB`) once user confirms.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-41 + session-42 additions for v3b:

```
docs/HANDOFF-SESSION-41.md                                                          — session 41 retro (v3b S-1)
docs/HANDOFF-SESSION-42.md                                                          — session 42 retro (v3b S-2 + reconciliation; NEW)
docs/slices/S-INFRA-rigour-v3b-subagent-suite/
  ├─ acceptance.md                                                                  — 15 ACs frozen at session-42; reviews approve post-resolution
  ├─ audit-findings.md                                                              — full audit trail; §5 = 15-AC inventory; §7 = gap-closure verification
  ├─ security.md                                                                    — spec-72 §11 checklist; /security-review zero findings (NEW session 42)
  └─ review-findings.md                                                             — 17 /review findings; resolution log; verdict request-changes → approve (NEW session 42)
```

**For session 43 (v3b S-3 = AC-14 impl), primary reference paths:**

```
docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md       — THE PLAN (15 ACs; DoD L170+; protection scope per AC-11)
docs/slices/S-INFRA-rigour-v3b-subagent-suite/review-findings.md  — resolution log; what was pinned at S-2 (regex, timeouts, thresholds)
docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md           — v3a (merged); inherited 12-item DoD L170-186; F6/F6c coverage threshold
package.json + vitest.config.ts                                   — extension targets for AC-14 (devDep + coverage config)
.github/workflows/ci.yml                                          — extension target for AC-14 (--coverage flag)
scripts/verify-slice.sh                                           — Gate 5 reads coverage/lcov.info per AC-14 spec
```

## Session 43 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                        # confirm clean tree
git rev-parse --short HEAD                                        # expect b94cddf (or further ahead)
git log --oneline origin/main..HEAD | wc -l                       # expect 5 (or +N from interim commits)
mcp__github__pull_request_read pullNumber=24                      # confirm state: closed, merged: true
```

**Pre-flight Qs (ask user before any code):**

1. **Open draft PR for the 5 v3b commits?** Defer if S-3 ships `verification.md` scaffolding (which can ship with PR open). Default recommendation: open after AC-14 lands. *Status: open.*
2. **Delete ghost branch `claude/security-review-v3b-Cb8KB` on origin?** No unique work; safe to delete. *Status: open.*

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Heads-up — line-count.sh re-baseline bug.** Fifth evidence point at session 42. If session lands on a harness-orphan and resyncs to canonical, the cumulative count will be inflated by the canonical-branch diff. Manual one-off fix: `echo $(git rev-parse HEAD) > /tmp/claude-base-${SESSION_ID}.txt`. Structural fix = v3b AC-12 (now P1 priority for S-4 group D).
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
- **Dogfood discipline (live now):** every commit passes `pre-commit-verify.sh` AND `tdd-first-every-commit.sh`. Plan-time gate (AC-7) fires on ExitPlanMode. v3a's gates dogfood themselves and v3b from day 1.
- **No bypass via `--no-verify`:** harness-level hooks intercept at the Bash tool layer, not git layer.
- **H6 RED-tests-first pattern (manual until v3b AC-7 ships):** RED commit pushed AND CI-observed-failing BEFORE GREEN impl pushed. AC-14 is the first impl commit to dogfood this.
