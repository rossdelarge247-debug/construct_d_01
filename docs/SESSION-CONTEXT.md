# Session 45 Wrap Context Block (heading into session 46)

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
- **Session 45 (this wrap):** v3b S-5 (10 ACs in one PR — AC-4/5/6/7/8/9/10/11/13 + AC-14 attribution fix). User pushed back on one-AC-per-session muscle memory; honest re-examination showed line-count budget + branch hygiene + adversarial review allow batching. Three commits on `claude/land-pr26-v3b-s5-5hFoW`: `b0148a0` (docs/rubrics) + `6f30870` (hooks/gates/meta-tests) + `e866240` (adversarial review evidence + line-citation fixes). 1204L additions / 33 deletions across 21 files. 8 new files: 2 hooks (`tdd-guard.sh` · `pre-push-dod7.sh`), 4 shellspec files (24+ examples; all dry-run-verified pre-commit), 4 lcov fixtures, 2 spec docs (`72a-preview-deploy-rubric.md` · `72b-adversarial-review-budget.md`). Adversarial review per spec 72b Option B (3 sub-spawns); sub-spawn 1 emitted 12 findings (#1+#2 verified false positives — bash `case` glob matches `src/lib/foo.ts` correctly; #3-#11 v3c improvements); sub-spawns 2+3 read-cap-blocked (captured as v3c carry-over: spec 72b should add 4th option = pre-load files inline in agent prompt for ~900L+ diffs). PR #27 opened as draft with `control-change` label required. **v3b 12/15.**

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

## Session 46 priorities

> **Numbering:** session 41 v3b S-1 (audit + AC redraft) · session 42 v3b S-2 (reviews + findings) · session 43 v3b S-3 (AC-14 vitest coverage; PR #25 merged) · session 44 v3b S-4 (AC-12 line-count re-baseline; PR #26 merged) · session 45 v3b S-5 (10 ACs; PR #27 draft pending merge). Session 46 = v3b S-6 (persona suite + AC-15 protocol).

### P0 — Merge PR #27 (v3b S-5) when control-change-label applied + your review complete

PR #27 opened as draft with `control-change` label required (touches `.claude/hooks/{tdd-guard,pre-push-dod7}.sh`, `.claude/settings.json`, `.claude/hooks-checksums.txt`, `scripts/verify-slice.sh`, `.github/workflows/control-change-label.yml`, `docs/eslint-baseline-allowlist.txt` transitively). Adversarial review per spec 72b Option B verdict: `request-changes` (downgraded from `block` after #1/#2 false-positive verification) + 4 deferred re-reviews to PR-time review where reviewer has full file access without read-cap.

**PR-time reviewer should re-do sub-spawns 2 + 3** (test surface + doc surface) — they were blocked by the 300L per-turn read-cap during S-5 ship. Expected re-review surfaces: 4 shellspec files (540L total) + 6 doc files. After PR review + label, merge.

### P1 — v3b S-6: persona suite (AC-1 + AC-2 + AC-3 paired ship)

Three remaining ACs in v3b are all "new persona file" surfaces:
- **AC-1** — `slice-reviewer.md` persona + auto-on-PR-open CI gate (`.github/workflows/auto-review.yml` runs `claude -p` on `pull_request:opened/synchronize`).
- **AC-2** — `acceptance-gate.md` persona (slice-completion-time AC pass/fail-with-narrative judgment).
- **AC-3** — `ux-polish-reviewer.md` persona (dormant at v3b ship; active from S-F1 onwards).

These pair because they all land in `.claude/agents/` (the location AC-5 just defined) and share the persona-file format. Better as one focused PR than three sequential PRs. AC-1's CI gate is the only one with a runtime surface; AC-2/AC-3 are persona files + invocation conventions in CLAUDE.md.

Pre-flight scope check per spec 72b: read AC-1/AC-2/AC-3 verbatim before planning; AC-1 specifically claims "Persona file `.claude/agents/slice-reviewer.md` exists + is integrity-protected via `hooks-checksums.txt`" — so AC-1 ships with hooks-checksums re-baseline. Plan branch as `claude/v3b-S-6-persona-suite-<5char>`.

### P1 — v3b S-7: AC-15 plan-review default-spawn flip

After persona suite ships + first 3 src/ slices ship (S-F1 onwards), AC-15 flips the `EXIT_PLAN_REVIEW_SPAWN=1` gate to default-on. Out of scope until measurement protocol per AC-4 retain/drop has data — defer to v3c.

### P2 — surface housekeeping

- **v3c carry-over: spec 72b 4th option.** Pre-load files inline in agent prompt for ~900L+ diffs where partition still exceeds 300L per-turn read-cap. Sub-spawns 2+3 of S-5 review hit this wall.
- **v3c carry-over: tdd-guard.sh improvements** from S-5 sub-spawn 1 findings #3-#11: orphan child-process cleanup on timeout (`setsid` + `kill -- -PID`), jq-missing fail-loud, dispatch-by-prefix consolidation for stacked PreToolUse:Bash hooks.
- **v3c carry-over: protected-path expansion.** `.claude/agents/`, `scripts/hooks-checksums.sh`, `docs/tdd-exemption-allowlist.txt` deferred from AC-11 §Scope.
- `docs/slices/S-INFRA-rigour-v3a-foundation/HANDOFF-SLICE-WRAP.md` (consolidating retro across sessions 37-43) still pending; defer to v3c kickoff.

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

### Branch state at session-43 wrap (verified live, not from kickoff memory)

- **Active:** `claude/audit-v3b-pr24-merge-YUwug` @ `2f4c6d2` · 9 ahead of `origin/main` `18c2a0c` · 0 behind · pushed. v3b S-1 + S-2 + S-3 (RED + GREEN + checksum-rebaseline + verification.md scaffold) shipped. **PR #25 open as draft with `control-change` label.**
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-v3b complete.
- **Orphans on origin (safe to delete):** `claude/security-review-v3b-Cb8KB` (4 cherry-pick commits = v3b S-1; abandoned session 42); `claude/activate-vitest-coverage-v8-uIaBF` (harness-created at session-43 turn 0; no commits beyond `18c2a0c`).
- **`main`** @ `18c2a0c` · PR #24 (S-INFRA-rigour-v3a-foundation) merged `2026-04-27T19:23:07Z`. PR #25 (v3b S-3) pending merge.

### Iteration trajectory of v3b-subagent-suite slice

- **S-1** (session 41, `25dc85f..d2da7e7`): one-time deliberate Tier-4 archive pass → `audit-findings.md` (130L) → `acceptance.md` redrafted top-down to 15 ACs grouped A-E.
- **S-2** (session 42, `b94cddf`): `/security-review` zero findings; `/review` 17 findings → user accepted all 5 recommended defaults for load-bearing logic findings → 11 addressed, 2 deferred, 4 approved unchanged. Verdict `request-changes` → `approve`. AC table frozen.
- **S-3** (session 43, `6b61073..2f4c6d2`): AC-14 `@vitest/coverage-v8` activation. RED `6b61073` (vitest meta-test asserting devDep + ci.yml --coverage); CI-observed-failing on PR #25 first run before GREEN pushed (H6 manual). GREEN `09e1de5` (deps + config + ci.yml + verify-slice.sh + threshold removal per AC-14 L109 OOS). Follow-up `2f4c6d2` (hooks-checksums re-baseline + verification.md scaffold). Adversarial review verdict `approve` (8 findings; 2 nit-only carry-overs; 0 architectural). PR #25 with `control-change` label per L199 self-protection.

### Next session (44) FIRST ACTIONS

1. Verify branch state per `.claude/hooks/session-start.sh`. Expected: HEAD `2f4c6d2` or further ahead (assumes PR #25 still open) OR `claude/audit-v3b-pr24-merge-YUwug` retired post-merge (then S-4 opens fresh branch from `main`). **Heads-up:** AC-12 still unshipped — manual `/tmp/claude-base-*.txt` rebaseline still required if cross-branch resync happens.
2. Confirm PR #25 status: `mcp__github__pull_request_read pullNumber=25 method=get`. If merged, retire branch + open S-4 from main. If still open, address review feedback.
3. **v3b S-4 = AC-12 `line-count.sh` re-baseline structural fix** per session-43 P1 kickoff. Read `acceptance.md` AC-12 (R-7 resolution: N=200 cumulative `git diff --shortstat`; once-per-hop semantics). RED-tests-first per H6 pattern; **manual DoD-7 discipline still required until v3b AC-7 ships** (pre-push gate).
4. **Optional — apply AC-14 doc-attribution carry-over** (A-1/A-2 from session-43 adversarial review): one-line edit to `acceptance.md:108` re-attributing "spec 72 F6" → v3a `acceptance.md` L51/L178. Cheap; can ship as part of S-4.
5. **Optional — delete orphan branches** (`origin/claude/security-review-v3b-Cb8KB` + `origin/claude/activate-vitest-coverage-v8-uIaBF`) once user confirms.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-41/42/43 additions for v3b:

```
docs/HANDOFF-SESSION-41.md                                          — session 41 retro (v3b S-1)
docs/HANDOFF-SESSION-42.md                                          — session 42 retro (v3b S-2)
docs/HANDOFF-SESSION-43.md                                          — session 43 retro (v3b S-3 AC-14; NEW)
docs/slices/S-INFRA-rigour-v3b-subagent-suite/
  ├─ acceptance.md                                                  — 15 ACs frozen session-42; reviews approve post-resolution
  ├─ audit-findings.md                                              — full audit trail; §5 = 15-AC inventory
  ├─ security.md                                                    — spec-72 §11 checklist; /security-review zero findings
  ├─ review-findings.md                                             — 17 /review findings; resolution log
  └─ verification.md                                                — 15-AC table; AC-14 PASS row + 14 PENDING; A-1/A-2 doc carry-overs (NEW session 43)
```

**For session 44 (v3b S-4 = AC-12 line-count rebaseline impl), primary reference paths:**

```
docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md       — THE PLAN; AC-12 at L82-96 (R-7 resolution: N=200, once-per-hop)
docs/slices/S-INFRA-rigour-v3b-subagent-suite/review-findings.md  — R-7 resolution; AC-12 testability pin
docs/slices/S-INFRA-rigour-v3b-subagent-suite/verification.md     — fill AC-12 row at S-4 wrap; A-1/A-2 carry-over for AC-14 attribution
.claude/hooks/line-count.sh                                       — extension target for AC-12 (rebaseline detection logic)
.claude/hooks/session-start.sh                                    — current rebaseline-write site (turn-0 SHA)
tests/shellspec/                                                  — meta-test target dir for AC-12 hook tests
```

## Session 46 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                  # confirm clean tree
git rev-parse --short HEAD origin/main                                      # current state vs main tip
mcp__github__pull_request_read pullNumber=27 method=get                     # PR #27 v3b S-5 status (open/merged)
mcp__github__list_pull_requests state=closed base=main perPage=5            # check recent merges
```

**Pre-flight Qs (ask user before any code):**

1. **PR #27 status:** if merged, retire `claude/land-pr26-v3b-s5-5hFoW` and open S-6 from main; if still open with `request-changes` (sub-spawns 2+3 deferred), do those re-reviews FIRST before S-6 to clear the gate honestly.
2. **Persona suite scope:** confirm AC-1 + AC-2 + AC-3 paired ship for S-6 (vs single-AC-per-PR muscle memory). All three land in `.claude/agents/` per AC-5; share format; cleaner as one PR.
3. **CI for AC-1's auto-review workflow:** AC-1 specifies `.github/workflows/auto-review.yml` running `claude -p` on PR open. This is a runtime-cost concern — needs `ANTHROPIC_API_KEY` secret in repo settings + budget for per-PR token spend. Confirm with user before shipping AC-1's CI gate.
3. **Apply AC-14 doc-attribution carry-over** as part of S-4? One-line edit to `acceptance.md:108` re-attributing "spec 72 F6" → v3a `acceptance.md` L51/L178. Cheap and load-bearing for spec-quote integrity. *Status: open.*

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **Heads-up — line-count.sh re-baseline bug.** Sixth evidence point at session 43 (would-have triggered if not for proactive manual workaround). v3b AC-12 (now P1 for S-4 group D priority bump) is the structural fix; manual `echo $(git rev-parse HEAD) > /tmp/claude-base-${SESSION_ID}.txt` until shipped.
- **H6 RED-tests-first pattern (manual until v3b AC-7 ships):** session 43 dogfooded this for AC-14: RED `6b61073` pushed → CI-observed-failing on PR #25 first run (job `73279289462`) → GREEN `09e1de5` pushed. Sequence held; ~5min gap. AC-7 (pre-push gate) closes the procedural gap structurally.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
- **Dogfood discipline (live now):** every commit passes `pre-commit-verify.sh` AND `tdd-first-every-commit.sh`. Plan-time gate (AC-7) fires on ExitPlanMode. v3a's gates dogfood themselves and v3b from day 1.
- **No bypass via `--no-verify`:** harness-level hooks intercept at the Bash tool layer, not git layer.
- **`control-change` label workflow live (PR #25 dogfooded session 43):** any PR touching L199-protected paths fails control-change-label.yml until label applied (admin-restricted). AC-14's GREEN commit touched `vitest.config.ts` + `scripts/verify-slice.sh`; user-authorised label application + ≥1 human approval on PR review surface satisfies the gate.
