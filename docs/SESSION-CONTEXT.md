# Session 46 Wrap Context Block (heading into session 47)

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
- **Session 40:** Session-38 budget closed — S-38-2 RED (`31be543`) + S-38-1 GREEN (`e45152b`) for verify-slice.sh full-mode impl; S-38-4 (`95481e5`) for vitest coverage config + lcov parser (AC-6); S-38-3 RED (`9862158`) + GREEN (`2c676d0`) for `tdd-first-every-commit.sh` (AC-5). 8/8 ACs PASS in `verification.md`; PR #24 DoD-11-form refresh; DoD-3 procedural `request-changes` verdict (read-cap hit); DoD-7 temporal-gap surfaced as `PASS-with-DoD-7-gap` honestly. PR remained DRAFT pending merge-path decision.
- **Session 41:** PR #24 merged on `2026-04-27T19:23:07Z`. v3b S-1 (`25dc85f` + `6a488e8` + `d2da7e7`): one-time deliberate Tier-4 archive pass → `audit-findings.md` (130L; full inventory) → `acceptance.md` redrafted top-down to 15 ACs grouped A-E. Branch: `claude/audit-v3b-pr24-merge-YUwug`.
- **Session 42:** v3b S-2 (`b94cddf`). `/security-review` zero findings. `/review` 17 findings; 7 logic-severity. User accepted all 5 recommended defaults for load-bearing logic findings (R-4 timeout, R-5 regex, R-6 line-count source, R-7 N threshold, R-8 coverage threshold raised to ≥90% to match v3a). 11 in-scope findings addressed; 2 deferred; 4 approved unchanged. Verdict `request-changes` → `approve`. AC table frozen at b94cddf.
- **Session 43:** v3b S-3 (AC-14 `@vitest/coverage-v8` activation) — first impl commit of v3b. PR #25 opened + merged. AC-14 ships; 1/15 v3b ACs landed.
- **Session 44:** v3b S-4 (AC-12 `line-count.sh` re-baseline structural fix). PR #26 opened + merged with `control-change` label. AC-12 ships; 2/15 v3b ACs landed.
- **Session 45:** v3b S-5 ship (10 ACs in one PR — AC-4/5/6/7/8/9/10/11/13 + AC-14 attribution fix). Three lockstep commits: `b0148a0` + `6f30870` + `e866240`. Adversarial review per spec 72b Option B (3 sub-spawns); sub-spawn 1 emitted 12 findings (#1+#2 verified false positives); sub-spawns 2+3 read-cap-blocked. PR #27 opened as draft with `control-change` label required.
- **Session 46 (this wrap):** v3b S-5 review-driven fixes — three rounds. **Round 2 (file-per-spawn re-spawn):** sub-spawn 1-redux on `pre-push-dod7.sh` succeeded (workaround for read-cap structural issue), surfaced 6 actionable findings (2 architectural + 4 logic). Fixed in `fedaeed`: repo regex truncated `org/repo.js` (broke gh API for any repo with `.`); gh API failure was blocking every push (GitHub-incident-equals-blocked-pushes); jq-missing silent pass; push-regex over/under-match for `--dry-run`/`-d`/`:branch`; commit-msg escape rendering; tdd-guard `kill -9` orphan node procs (`setsid` + `kill -- -PGID` group-kill). **Round 3 (CI exposed two latent pre-existing bugs):** ShellSpec `When call CMD <<<"$INPUT"` does NOT pipe stdin → all 21 pre-existing fixtures (7 tdd-guard + 14 pre-push-dod7) were giving false signals since `6f30870`; converted to `Data:expand` blocks. Gate 3b `while read` dropped final allowlist entry without trailing NL; fixed via `|| [ -n "$line" ]` idiom. **Round 4 (Vercel unblock):** pnpm-lock missing `@vitest/coverage-v8` specifier since `ead649f` (PR #25) — every PR's Vercel deployment failing; regenerated via `pnpm install --lockfile-only` in `5e184b4`. PR #27 marked ready-for-review at `5e184b4`; merged to `main` as `189996f`. **v3b 12/15** (all S-5 ACs landed).

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

### Built (on main as of `189996f`)

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

**Retired (post-merge, safe to delete on origin):** `claude/audit-v3b-pr24-merge-YUwug` (S-1/2/3 merged via PR #25), `claude/land-pr26-v3b-s5-5hFoW` (S-5 merged via PR #27 as `189996f`), `claude/security-review-v3b-Cb8KB` (4 abandoned cherry-picks from session 42), `claude/activate-vitest-coverage-v8-uIaBF` (harness orphan from session 43).

## Session 47 priorities

> **Numbering:** session 41 v3b S-1 · session 42 v3b S-2 · session 43 v3b S-3 (PR #25 merged) · session 44 v3b S-4 (PR #26 merged) · session 45 v3b S-5 ship (PR #27 draft) · session 46 v3b S-5 review-fixes + Vercel unblock (PR #27 merged as `189996f`). Session 47 = v3b S-6 (persona suite).

### P0 — v3b S-6: persona suite (AC-1 + AC-2 + AC-3 paired ship)

Three remaining ACs in v3b are all "new persona file" surfaces:
- **AC-1** — `slice-reviewer.md` persona + auto-on-PR-open CI gate (`.github/workflows/auto-review.yml` runs `claude -p` on `pull_request:opened/synchronize`).
- **AC-2** — `acceptance-gate.md` persona (slice-completion-time AC pass/fail-with-narrative judgment).
- **AC-3** — `ux-polish-reviewer.md` persona (dormant at v3b ship; active from S-F1 onwards).

These pair because they all land in `.claude/agents/` (the location AC-5 just defined) and share the persona-file format. Better as one focused PR than three sequential PRs. AC-1's CI gate is the only one with a runtime surface; AC-2/AC-3 are persona files + invocation conventions in CLAUDE.md.

Pre-flight scope check per spec 72b: read AC-1/AC-2/AC-3 verbatim before planning; AC-1 specifically claims "Persona file `.claude/agents/slice-reviewer.md` exists + is integrity-protected via `hooks-checksums.txt`" — so AC-1 ships with hooks-checksums re-baseline. Plan branch as `claude/v3b-S-6-persona-suite-<5char>`.

### P1 — v3b S-7: AC-15 plan-review default-spawn flip

After persona suite ships + first 3 src/ slices ship (S-F1 onwards), AC-15 flips the `EXIT_PLAN_REVIEW_SPAWN=1` gate to default-on. Out of scope until measurement protocol per AC-4 retain/drop has data — defer to v3c.

### P2 — surface housekeeping

- **v3c carry-over: spec 72b Option C** — pre-load file content inline in subagent prompt for ≥900L diffs where partition still exceeds 300L per-turn read-cap. Concrete inline-content syntax + file-size accounting so prompt-budget vs read-cap ratio is computable upfront. Sub-spawns 2-6 of S-5 review hit this wall in both session 45 and session 46 round-2 re-spawn (file-per-spawn workaround helped sub-spawn 1 only).
- **v3c carry-over: spec 72b §"spec validation by deliberate impl-break"** — temporarily emit BLOCK from a passing path; if pass-path tests don't turn red, the spec is broken. Session-46 round-3 lesson: would have caught the ShellSpec stdin bug + Gate 3b trailing-NL bug in seconds. Author dryruns invoked the hook directly, never via the spec runner.
- **v3c carry-over: pnpm-lock drift CI gate** — run `pnpm install --frozen-lockfile` on PRs that touch `package.json`. Vercel was failing every PR's deployment since `ead649f` because of unrecorded specifier; needs to fail at PR time, not at Vercel deploy time.
- **v3c carry-over: query Vercel via `get_status`** — `pull_request_read get_check_runs` doesn't surface Vercel deployments (older Statuses API). Document in CLAUDE.md or wrap-check.sh.
- **v3c carry-over: protected-path expansion.** `.claude/agents/`, `scripts/hooks-checksums.sh`, `docs/tdd-exemption-allowlist.txt` deferred from AC-11 §Scope.
- **v3c carry-over: persona retain/drop metric (AC-4) activation** from S-F1 onwards — first 3 src/ slices.
- `docs/slices/S-INFRA-rigour-v3a-foundation/HANDOFF-SLICE-WRAP.md` (consolidating retro across sessions 37-43+46) still pending; defer to v3c kickoff.

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

### Branch state at session-46 wrap (verified live, not from kickoff memory)

- **Active wrap:** `claude/session-46-wrap-7b7f4` (this branch) — HANDOFF-SESSION-46 + SESSION-CONTEXT refresh; PR to be opened from this branch.
- **Just-merged:** `claude/land-pr26-v3b-s5-5hFoW` @ `5e184b4` → squashed to `main` as `189996f`. Branch retiring; safe to delete on origin.
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-v3b complete.
- **Orphans on origin (safe to delete):** `claude/security-review-v3b-Cb8KB`, `claude/activate-vitest-coverage-v8-uIaBF`, `claude/land-pr26-v3b-s5-5hFoW` (post-merge).
- **`main`** @ `189996f` · PR #27 (v3b S-5; 10 ACs in one ship) merged after 3 review rounds + Vercel unblock; **v3b 12/15** ACs landed.

### Iteration trajectory of v3b-subagent-suite slice

- **S-1** (session 41): audit + 15-AC acceptance.md.
- **S-2** (session 42): reviews + 11 findings addressed.
- **S-3** (session 43): AC-14 vitest coverage activation; PR #25 merged.
- **S-4** (session 44): AC-12 line-count.sh re-baseline structural fix; PR #26 merged.
- **S-5 ship** (session 45, `b0148a0..e866240`): 10 ACs in one PR (AC-4/5/6/7/8/9/10/11/13 + AC-14 attribution). Adversarial review per spec 72b Option B; sub-spawn 1 surfaced 12 findings (#1+#2 false positives).
- **S-5 review-fixes** (session 46, `fedaeed..5e184b4`): three rounds. Round-2 sub-spawn 1-redux (file-per-spawn) surfaced 6 actionable findings (2 architectural + 4 logic) → fixed in `fedaeed`. Round-3 CI exposed 2 latent pre-existing bugs (ShellSpec stdin handling across 21 fixtures since `6f30870`; Gate 3b trailing-NL) → fixed in `0b7e183`. Round-4 Vercel unblock (pnpm-lock missing `@vitest/coverage-v8` specifier since `ead649f`) → fixed in `5e184b4`. PR #27 merged as `189996f`.

### Next session (47) FIRST ACTIONS

1. **Verify branch state per `.claude/hooks/session-start.sh`.** Expected: clean working tree on `main` or fresh branch off main. AC-12 NOW SHIPPED — `line-count.sh` rebaseline-on-resync is automatic (no more manual `/tmp/claude-base-*.txt` workaround).
2. **Confirm PR #27 squash-merge state:** `git log --oneline -3` should show `189996f` as latest on main. `mcp__github__list_pull_requests state=closed perPage=5` to verify recent merges.
3. **v3b S-6 = persona suite (AC-1 + AC-2 + AC-3 paired ship).** Read `acceptance.md` AC-1/2/3 verbatim; pre-flight scope check per spec 72b. Plan branch as `claude/v3b-S-6-persona-suite-<5char>`. Three persona files in `.claude/agents/` + AC-1's `auto-review.yml` CI gate (runtime cost — needs `ANTHROPIC_API_KEY` repo secret + token-budget confirmation).
4. **Optional — delete merged + orphan branches on origin.** `claude/land-pr26-v3b-s5-5hFoW` (just-merged), `claude/security-review-v3b-Cb8KB`, `claude/activate-vitest-coverage-v8-uIaBF`.
5. **AC-7 pre-push gate is now LIVE.** Future RED→GREEN slices have structural enforcement. H6 manual discipline retired.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-41/42/43/44/45/46 additions for v3b:

```
docs/HANDOFF-SESSION-41.md                                          — session 41 retro (v3b S-1)
docs/HANDOFF-SESSION-42.md                                          — session 42 retro (v3b S-2)
docs/HANDOFF-SESSION-43.md                                          — session 43 retro (v3b S-3 AC-14)
docs/HANDOFF-SESSION-46.md                                          — session 46 retro (v3b S-5 review-fixes; NEW)
docs/slices/S-INFRA-rigour-v3b-subagent-suite/
  ├─ acceptance.md                                                  — 15 ACs frozen session-42 + amendments per AC-11 + AC-14 attribution
  ├─ audit-findings.md                                              — full audit trail; §5 = 15-AC inventory
  ├─ security.md                                                    — spec-72 §11 checklist; /security-review zero findings
  ├─ review-findings.md                                             — 17 /review findings; resolution log
  └─ verification.md                                                — 15-AC table; 12/15 PASS rows + S-5 round-2/3/4 retro
.claude/hooks/{tdd-guard,pre-push-dod7}.sh                          — v3b AC-6 + AC-7 (NEW session 45/46)
docs/workspace-spec/72a-preview-deploy-rubric.md                    — v3b AC-9 (NEW session 45)
docs/workspace-spec/72b-adversarial-review-budget.md                — v3b AC-10 (NEW session 45; v3c carry-over: Option C inline-files + spec-validation-by-impl-break)
tests/shellspec/{tdd-guard,pre-push-dod7,tdd-exemption-gate,lcov-parser}.spec.sh — v3b AC-6/7/8/13 meta-tests (88 examples / 0 failures)
```

**For session 47 (v3b S-6 = persona suite), primary reference paths:**

```
docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md       — THE PLAN; AC-1/AC-2/AC-3 verbatim
docs/slices/S-INFRA-rigour-v3b-subagent-suite/verification.md     — fill AC-1/2/3 rows at S-6 wrap
.claude/agents/                                                   — target dir for persona files (per AC-5 reconciliation)
.claude/subagent-prompts/exit-plan-review.md                      — existing template; persona format reference
.github/workflows/auto-review.yml                                 — AC-1's CI gate target (NEW; needs ANTHROPIC_API_KEY secret)
docs/engineering-phase-candidates.md                              — §E L129 + L132 + L133 verbatim source for retain/drop metric
CLAUDE.md §"Subagent file locations (per v3b AC-5)"               — extends with persona invocation conventions
```

## Session 47 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                  # confirm clean tree
git rev-parse --short HEAD origin/main                                      # expect 189996f or further
mcp__github__list_pull_requests state=closed base=main perPage=5            # confirm PR #27 in recent merges
```

**Pre-flight Qs (ask user before any code):**

1. **Persona suite scope:** confirm AC-1 + AC-2 + AC-3 paired ship for S-6. All three land in `.claude/agents/` per AC-5; share format; cleaner as one PR than three sequential PRs.
2. **CI for AC-1's auto-review workflow:** AC-1 specifies `.github/workflows/auto-review.yml` running `claude -p` on `pull_request:opened/synchronize`. **Runtime-cost concern** — needs `ANTHROPIC_API_KEY` repo secret + per-PR token-spend budget. Confirm with user before wiring the CI gate. Option to ship persona files first + auto-review workflow second (in a sub-PR) if budget needs sign-off.
3. **Spec 72b Option C (sharpened from session-46 round-3 lessons):** before S-6 spawns its own sub-spawn reviews, decide whether to draft Option C (inline file content in agent prompt) so sub-spawns 2-6 can actually run. Otherwise S-6 will hit the same read-cap structural issue.
4. **Orphan branch cleanup** — confirm OK to delete `claude/land-pr26-v3b-s5-5hFoW`, `claude/security-review-v3b-Cb8KB`, `claude/activate-vitest-coverage-v8-uIaBF` on origin.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **AC-12 is LIVE** — `line-count.sh` rebaseline-on-resync is automatic. Manual `/tmp/claude-base-*.txt` workaround retired.
- **AC-7 pre-push gate is LIVE** — H6 RED→GREEN temporal ordering structurally enforced. RED commit must be CI-observed-failing before GREEN ships; bypass via `DOD7_OVERRIDE=1` requires `verification.md` reasoning.
- **AC-6 tdd-guard is LIVE** — Write/Edit on `src/**.{ts,tsx}` requires green vitest run for the corresponding test file (or allowlisted exemption with category tag per AC-8).
- **Gate 3b is LIVE** — `tdd-exemption-allowlist.txt` entries must carry `category:glob` tag (`pure-visual-ui` / `pure-rename` / `pure-config`); untagged or unknown-category fails verify-slice.sh fail-loud.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
- **Dogfood discipline (live now):** every commit passes `pre-commit-verify.sh` AND `tdd-first-every-commit.sh` AND (for src/) `tdd-guard.sh` AND (for git push) `pre-push-dod7.sh`. Plan-time gate fires on ExitPlanMode.
- **No bypass via `--no-verify`:** harness-level hooks intercept at the Bash tool layer, not git layer.
- **`control-change` label workflow live:** any PR touching L199-protected paths (12 paths post AC-11 amendment) fails control-change-label.yml until label applied (admin-restricted). PR #27 dogfooded this through 3 review rounds.
- **Vercel deployment status invisible to `get_check_runs`** — query `pull_request_read get_status` for Vercel/legacy reporters. Session-46 round-4 lost ~5min diagnosing this.
- **Spec-validation-by-impl-break (v3c carry-over):** session-46 round-3 surfaced that author dryruns invoking the hook directly miss spec-runner stdin semantics. For meta-test slices, deliberately break the impl temporarily — pass-path tests should turn red. If they don't, the spec is broken.
