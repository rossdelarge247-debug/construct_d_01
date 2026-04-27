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

### Built (on main as of `92f77d7`)

```
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts          — S-F7-α (PR #20, session 34)
src/lib/store/{dev-store,index,scenario-loader,types}.ts          — S-F7-α (PR #20, session 34)
src/lib/store/scenarios/{cold-sarah,sarah-mid-build}.json         — S-F7-α (PR #20, session 34)
src/lib/stripe/client.ts                                          — apiVersion aligned (S-INFRA-1, PR #22, session 35)
package.json + lockfiles                                          — stripe@22.1.0 pinned
.claude/hooks/{line-count,session-start}.sh                       — S-TOOL-1 (PR #21, session 35)
tests/unit/hooks-{line-count,session-start}.test.ts               — S-TOOL-1 hook tests
docs/slices/{S-F1,S-B-1,S-B-2,S-C-U4,S-F7-alpha,S-INFRA-1,S-TOOL-1,S-F7-beta}/  — slice docs
CLAUDE.md §Planning conduct                                        — #12 Branch-resume check (session 34)
```

**On `claude/S-F7-beta-impl` (8 ahead, parked):** S-F7-β impl (session 36); PR not opened; cleanup parked pending v3a merge.

**On `claude/S-INFRA-rigour-v3a-foundation` @ `71fc206` (29 ahead, in flight as PR #24 draft):** v3a-foundation slice content complete; 8/8 ACs PASS. DoD-11 final body refreshed at session 40 wrap (per acceptance.md L184). PR remains DRAFT pending user merge-path decision (see § Session 41 priorities). All session-37 + session-38 budget items landed.

## Session 41 priorities

### P0 — decide merge path for PR #24

DoD-3 strict-reading requires `approve` or `nit-only`. Current verdict is procedural `request-changes` (reviewer hit per-turn 300-line read-cap before completing impl-review surface). Three viable paths; user picks:

**(a) Accept procedural verdict + content state captured.** Flip PR draft → ready-for-review; user-review on GitHub; merge if reviewer satisfied. Honours the spec content; surfaces the gate-design gap (DoD-3 single-turn structural-infeasibility) as a v3b finding rather than blocking v3a. *My recommendation* — the slice's actual content was reviewed at spec-time across 5 iterations; impl is well-tested (48/48 shellspec) and verified against α reference; the procedural gap is a known v3b carry-over.

**(b) Re-spawn DoD-3 adversarial review with explicit multi-turn budget.** Partition into spec-side + impl-side + git-history sub-spawns; each fits one turn. ~30-60 min. If verdict is `approve` / `nit-only` → flip to ready-for-review. If `request-changes` on real findings → fix or carry to v3b.

**(c) Defer fuller analysis to v3b's adversarial-review-process work.** Merge PR #24 as-is with `request-changes` (procedural) + 8 carry-over items captured. Risk: v3b commits land on top of an unfully-reviewed v3a foundation; mitigated by (i) test coverage at slice-completion, (ii) the v3b adversarial-subagent-suite reviews v3b's own code with v3a's gates active.

### P0 (companion) — DoD-9 `/security-review` skill

Deferred from session 40 for budget. Run before merge if going path (a) or (c); during re-review if path (b). 5–10 min for control-plane-only diffs; output captured in `security.md`.

### P1 — v3b kickoff (post-merge)

After PR #24 merges to main, v3b begins:
- Full AC drafting from `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md` (currently 32-line stub + 8 carry-over items at §Carry-over from v3a).
- v3a's gates dogfood v3b's commits from the first one (`pre-commit-verify.sh` skeleton-mode → full mode; `tdd-first-every-commit.sh` enforcement on src/; AC-7 plan-time gate on any plan).
- First v3b commit could be activation of `@vitest/coverage-v8` + `ci.yml --coverage` per carry-over item 5.

### P2 — surface housekeeping

- `docs/HANDOFF-SESSION-40.md` is the retro wrap doc for session 40.
- `docs/slices/S-INFRA-rigour-v3a-foundation/HANDOFF-SLICE-WRAP.md` (consolidating retro across sessions 37–40) was scoped as session-40 stretch but did not land — fold session 40 retro into the slice-level wrap at v3b kickoff or merge-day, whichever is first.
- `line-count.sh` re-baselining bug surfaced live session 40 — manual one-off applied; v3b carry-over item 3.

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

### Branch state at session-40 wrap (verified live, not from kickoff memory)

- **Active:** `claude/S-INFRA-rigour-v3a-foundation` @ `71fc206` · 29 ahead of `origin/main` `92f77d7` · pushed · in flight as PR #24 (draft; DoD-11 body refreshed; awaiting merge-path decision). 8/8 ACs PASS in `verification.md`; DoD-3 verdict procedural `request-changes`; DoD-7 honest gap on S-38-2/S-38-1 timing.
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-v3a merge.
- **`main`** @ `92f77d7` · no new merges since PR #21 (S-TOOL-1, session 35).

### Iteration trajectory of v3a-foundation slice (planning + impl)

Spec planning: 5 adversarial review iterations converged at v5 nit-only (v1 → v2 → v3 → v4 → **v5** → v5.1 polish).
Impl: session 37 (S-37-0..5) skeleton + AC-3/4 → session 38 (recovered crash + AC-1 skeleton + AC-2 part 1) → session 39 (AC-7 + AC-2 part 2 + AC-8) → session 40 (S-38-1/2/3/4 → 8/8 ACs PASS).

### Next session (41) FIRST ACTIONS

1. Verify branch state per `.claude/hooks/session-start.sh`. Expected: HEAD `71fc206` or further ahead. **Heads-up:** line-count hook may show inflated baseline if cross-branch resync happens — see v3b carry-over item 3 (manual fix is `echo $NEW_SHA > /tmp/claude-base-${SESSION_ID}.txt`).
2. Re-fetch PR #24 CI status via `mcp__github__pull_request_read get_check_runs` — confirm runs at `71fc206` are GREEN.
3. **Decide merge path with user (P0):** (a) accept procedural request-changes + flip PR ready, (b) re-spawn DoD-3 review with multi-turn budget, (c) defer to v3b. Default recommendation: (a).
4. Run `/security-review` skill if path (a) or (c) — capture in `security.md`.
5. If merging: v3b kickoff per § Session 41 priorities P1.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-40-relevant additions:

```
docs/HANDOFF-SESSION-40.md                                        — session 40 retro (NEW)
docs/slices/S-INFRA-rigour-v3a-foundation/
  ├─ acceptance.md                                                — 8 ACs frozen, v5.1 adversarial-approved
  ├─ verification.md                                              — 8/8 ACs PASS + § Adversarial review — session 40 (procedural request-changes)
  └─ security.md                                                  — spec-72 §11 checklist (table-row form, all 13 boxes)
docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md       — stub + § Carry-over from v3a (8 items at session-40 wrap)

.claude/hooks/tdd-first-every-commit.sh                           — AC-5 PreToolUse:Bash gate (NEW session 40)
docs/tdd-exemption-allowlist.txt                                  — AC-5 file-glob allowlist (NEW; empty seed per L48 pattern)
tests/shellspec/tdd-first-every-commit.spec.sh                    — AC-5 meta-tests, 6 examples (NEW session 40)

scripts/verify-slice.sh                                           — AC-1 full-mode impl (replaced skeleton at session 40); modes incremental + --full
vitest.config.ts                                                  — AC-6 coverage thresholds + lcov reporter (NEW session 40; in AC-2 protected scope)
tests/shellspec/verify-slice.spec.sh                              — extended with 5 §11-checklist contract tests (10 examples total)

.claude/settings.json                                             — PreToolUse:Bash matcher now carries pre-commit-verify + tdd-first-every-commit (session 40)
.claude/hooks-checksums.txt                                       — 15 entries (session-40 baseline; was 12)
scripts/hooks-checksums.sh                                        — explicit-file list extended (vitest.config.ts + tdd-exemption-allowlist.txt)

.github/workflows/shellspec.yml                                   — pinned to shellspec 0.28.1 (session 40 parallel CI fix `5adec84`)
```

**For session 41 (merge-path decision + v3b kickoff), primary reference paths:**

```
docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md           — THE PLAN (AC table; DoD L170-186; protection scope L199; rollback L201; PR-body refresh L184)
docs/slices/S-INFRA-rigour-v3a-foundation/verification.md         — 8/8 PASS + adversarial-review state + DoD-7 honest gap
docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md       — 32-line stub + 8 carry-over items; full AC drafting starts at v3b kickoff
scripts/verify-slice.sh                                           — full-mode workhorse (incremental + --full)
.claude/hooks/{pre-commit-verify,tdd-first-every-commit}.sh       — both gates now live on PreToolUse:Bash
```

## Session 41 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                        # confirm clean tree
git rev-parse --short HEAD                                        # expect 71fc206 (or further ahead)
git log --oneline origin/main..HEAD | wc -l                       # expect 29 (or +N from interim commits)
```

Plus: `mcp__github__pull_request_read get_check_runs pullNumber=24` to confirm CI is GREEN at HEAD before any merge-path discussion.

**Pre-flight Qs (ask user before any code):**

1. **Merge path for PR #24?** DoD-3 verdict is procedural `request-changes` (reviewer hit read-cap). Three viable paths: (a) accept procedural verdict + flip ready-for-review → merge, (b) re-spawn DoD-3 with multi-turn budget → re-decide, (c) defer fuller review to v3b + merge with caveats. Default recommendation: (a). *Status: open.*
2. **Run `/security-review` skill before merge?** DoD-9 evidence; deferred from session 40 for budget. 5–10 min for control-plane-only diffs. *Status: open.*

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Heads-up — line-count.sh re-baseline bug.** v3b carry-over item 3. If session lands on a harness-orphan and resyncs to canonical, the cumulative count will be inflated by the canonical-branch diff. Manual one-off fix: `echo $(git rev-parse HEAD) > /tmp/claude-base-${SESSION_ID}.txt`.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
- **Dogfood discipline (live now):** every commit passes `pre-commit-verify.sh` (full-mode incremental) AND `tdd-first-every-commit.sh`. Plan-time gate (AC-7) fires on ExitPlanMode. v3a's gates dogfood themselves and v3b from day 1.
- **No bypass via `--no-verify`:** harness-level hooks intercept at the Bash tool layer, not git layer.
