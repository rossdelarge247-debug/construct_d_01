# Session 47 Wrap Context Block (heading into session 48)

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
- **Session 47 (this wrap):** v3b S-6 — persona suite (AC-1 + AC-2 + AC-3 + auto-review.yml CI gate) ships **v3b 12/15 → 15/15**. PR #29 amends spec 72b with Option C (atomic-file inline content >300L) + spec-validation-by-impl-break check; merged as `b4e29ae`. PR #30 (S-6) opens with 2 commits (`1a70883` initial + `f476d41` 4-sub-spawn-review fix-up addressing 20 logic findings); user sets `ANTHROPIC_API_KEY` repo secret; live recursive auto-review on the slice's own ship-PR runs **9 rounds** with commits `d3dedb9` → `ac2b986` → `8bfdfb4` → `1ef38b3` → `586f167` → `715a03e` → `007130b` → `5295364` → `31ebc51`; converges twice (rounds 7 + 9) with one block at round 8 caught by the persona on a CLAUDE.md scope-creep + spec 72b regression risk that we'd just introduced — recursive self-application of the rigour gate, in real-time. Total findings actioned: 9 logic + 2 architectural + 2 style + 1 workflow integration = 14 items. Strategic conversation: spec'd `S-INFRA-persona-suite-v2-multi-agent` as v3b S-8 stretch (option B) per session-47 9-round dataset showing single-agent recursion is high-signal but inefficient. PR #30 ready for user merge at session wrap. Sibling PR `S-INFRA-arch-smell-trigger` (carry-over) ships the §Architectural-smell paragraph that round 8 correctly flagged as scope-creep.
- **Session 46:** v3b S-5 review-driven fixes — three rounds. **Round 2 (file-per-spawn re-spawn):** sub-spawn 1-redux on `pre-push-dod7.sh` succeeded (workaround for read-cap structural issue), surfaced 6 actionable findings (2 architectural + 4 logic). Fixed in `fedaeed`: repo regex truncated `org/repo.js` (broke gh API for any repo with `.`); gh API failure was blocking every push (GitHub-incident-equals-blocked-pushes); jq-missing silent pass; push-regex over/under-match for `--dry-run`/`-d`/`:branch`; commit-msg escape rendering; tdd-guard `kill -9` orphan node procs (`setsid` + `kill -- -PGID` group-kill). **Round 3 (CI exposed two latent pre-existing bugs):** ShellSpec `When call CMD <<<"$INPUT"` does NOT pipe stdin → all 21 pre-existing fixtures (7 tdd-guard + 14 pre-push-dod7) were giving false signals since `6f30870`; converted to `Data:expand` blocks. Gate 3b `while read` dropped final allowlist entry without trailing NL; fixed via `|| [ -n "$line" ]` idiom. **Round 4 (Vercel unblock):** pnpm-lock missing `@vitest/coverage-v8` specifier since `ead649f` (PR #25) — every PR's Vercel deployment failing; regenerated via `pnpm install --lockfile-only` in `5e184b4`. PR #27 marked ready-for-review at `5e184b4`; merged to `main` as `189996f`. **v3b 12/15** (all S-5 ACs landed).

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

## Session 48 priorities

> **Numbering:** session 41 v3b S-1 · session 42 v3b S-2 · session 43 v3b S-3 · session 44 v3b S-4 · session 45 v3b S-5 ship · session 46 v3b S-5 review-fixes (PR #27 merged) · session 47 v3b S-6 persona suite (PR #29 merged + PR #30 ready-for-merge with 9-round live recursive auto-review). Session 48 = v3b S-7 sibling slice (Architectural-smell trigger codification) **+** v3b S-8 stretch (multi-agent reviewer v2).

### P0 — Sibling slice `S-INFRA-arch-smell-trigger`

Small slice. Ships the §Architectural-smell trigger paragraph that PR #30's round-8 auto-review correctly flagged as scope-creep + had reverted from PR #30 in `31ebc51`. Verbatim text already drafted (ships from session-47 commit `5295364` content; reverted from PR #30; preserved in `docs/HANDOFF-SESSION-47.md` §What happened Stage 4 row 8). Branch: `claude/arch-smell-trigger-<5char>` off main (post-PR-30-merge). Estimated 30-60min: ~50L acceptance.md + 2L CLAUDE.md addition + verification.md PASS row + small adversarial-review pass. **Triggers session-48 auto-review on PR open** — first non-S-6 slice to exercise the persona suite live; AC-4 retain/drop measurement begins (or starts measurement from S-F1 — TBD at slice setup).

### P0 — v3b S-8 stretch: multi-agent persona suite v2

`S-INFRA-persona-suite-v2-multi-agent` per session-47 strategic call (option B from "what's best?" → "B" decision). Six-AC shape drafted in v3b verification.md §v3c carry-over:

1. **Dimension-partitioned orchestrator** (`scripts/spawn-multi-reviewer.sh` or workflow that fans to 5-7 single-dimension specialists; aggregates findings; deduplicates; emits unified verdict).
2. **Per-dimension specialist personas** (`.claude/agents/reviewer-{coding-conduct,ac-gap,edge-case,security,regression,spec-citation,simplicity}.md`).
3. **Rubric-checklist v2 of `slice-reviewer.md`** (forces tick-through-all-dimensions in single-agent mode for differential reviews).
4. **Differential-review mode** (review delta only on fix-up commits).
5. **Test-fixture seeding harness** (synthetic-diff fixture with deliberately-injected findings; quarterly).
6. **AC-4 retain/drop measurement** (compare single-agent recursive — current; baseline = session-47's 9-round dataset = 14 findings / 9 rounds — vs multi-agent dimension-partitioned).

Spec candidate at `docs/workspace-spec/72c-multi-agent-review-framework.md` (TBD; ~100-150L; could ship in S-8 setup or as standalone spec PR before).

Builds between PR #30 merge and first src/ slice (S-F1). Session 48 budget: spec drafting + AC freezing realistic; impl probably session 49.

### P1 — Branch-protection adjust

Make `auto-review (slice-reviewer persona)` check informational-only (matches AC-1 §Out of scope: *"informational at v3b ship; auto-blocking PR merge deferred to v3c"*). Session 47 saw `mergeable_state: blocked` on PR #30 with stale auto-review check-run on a prior SHA. ~5min in repo settings; not Claude action.

### P2 — surface housekeeping (carry-over from session 46 + sharpened by session 47)

- **v3c carry-over: spec 72b "Use when" criterion tightening** — cumulative-cross-reference accounting on top of file size (carried; sub-3 of S-6 review needed Option C re-spawn despite persona <300L because cumulative cross-refs pushed cap exhaustion).
- **v3c carry-over: pnpm-lock drift CI gate** — `pnpm install --frozen-lockfile` on PRs touching `package.json` (carried from session 46).
- **v3c carry-over: verdict-coercion fixture for personas** — synthetic test injecting malicious-prompt-style verdict request into PR body; persona's belt-and-braces guard mitigates; needs automated test (carried + sharpened by S-6 round-8 lesson).
- **v3c carry-over: scaffolding-exemption rule deterministic codification** — currently author-judgement; codify (carried).
- **v3c carry-over: AC-4 persona retain/drop activation** — first 3 src/ slices onwards (or sibling-slice if it counts as a measurement point).
- **v3c carry-over: HANDOFF-SLICE-WRAP.md for v3a-foundation** — consolidating retro across sessions 37-43+46+47 (carried).
- **v3c carry-over: query Vercel via `get_status`** (carried from session 46; document in CLAUDE.md or wrap-check.sh).
- **v3c carry-over: protected-path expansion** (carried; `.claude/agents/`, `scripts/hooks-checksums.sh`, `docs/tdd-exemption-allowlist.txt`).

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

### Branch state at session-47 wrap (verified live, not from kickoff memory)

- **Active wrap:** `claude/session-47-wrap-S47W1` (this branch) — HANDOFF-SESSION-47 + SESSION-CONTEXT refresh; wrap PR opened from this branch.
- **Ready-for-merge:** `claude/persona-suite-ac-3TTf6` @ `31ebc51` (PR #30; S-6 persona suite; 11 commits ahead of main; 17/17 CI checks GREEN at session wrap including auto-review round-9 `success`; control-change label applied; ready for user merge).
- **Just-merged:** `claude/spec-72b-option-c-OptCx` → squashed to `main` as `b4e29ae` (PR #29; spec 72b Option C + impl-break). Branch retiring; safe to delete on origin if not auto-deleted.
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-v3b complete.
- **`main`** @ `b4e29ae` at session-47 wrap; will advance to PR-#30-merge SHA before session 48 starts.
- **v3b 15/15** ACs in PR #30 (pending merge); session 48 ships sibling slice + S-8 stretch.

### Iteration trajectory of v3b-subagent-suite slice

- **S-1 to S-5** (sessions 41-46): see SESSION-46 wrap for detail; 12/15 ACs landed via PRs #25-#27 across 6 sessions.
- **S-6** (session 47, `1a70883..31ebc51` on PR #30): 3 personas + auto-review.yml + DoD-13 4-sub-spawn pre-CI review (20 findings actioned in `f476d41`) + **9-round live recursive auto-review** post `ANTHROPIC_API_KEY` setup (rounds 1-9; converged at rounds 7 + 9 with one block at round 8 self-applied to scope-creep finding). 14 actionable findings actioned across 9 rounds. v3b 12/15 → 15/15.

### Next session (48) FIRST ACTIONS

1. **Verify branch state + PR #30 merge.** Expected: clean working tree; `main` @ S-6-merge-SHA (assuming user merged between sessions). Confirm via `mcp__github__list_pull_requests state=closed perPage=3`.
2. **Verify wrap PR (this session) merged.** `git log --oneline -5 origin/main` should show wrap commit + S-6 merge as latest.
3. **P0 — Sibling slice `S-INFRA-arch-smell-trigger`.** Branch: `claude/arch-smell-trigger-<5char>` off main. Recover the §Architectural-smell paragraph from `docs/HANDOFF-SESSION-47.md` Stage-4 row-8 (verbatim text); draft `docs/slices/S-INFRA-arch-smell-trigger/acceptance.md` (1-2 ACs); commit; open PR. Live auto-review fires on PR open — first non-S-6 PR to exercise the persona; AC-4 retain/drop measurement starts here OR at S-F1 (TBD at setup).
4. **P0 — v3b S-8 stretch `S-INFRA-persona-suite-v2-multi-agent` setup.** Draft `docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md` with the 6-AC shape from `HANDOFF-47.md`. May ship spec 72c first (`docs/workspace-spec/72c-multi-agent-review-framework.md`) as a standalone spec PR. Impl in session 49 likely.
5. **P1 — Adjust branch protection** (user action; ~5min) so `auto-review (slice-reviewer persona)` is informational-only.
6. **AC-7 pre-push gate is LIVE** (session-46 ship). H6 RED→GREEN structurally enforced.
7. **AC-12 `line-count.sh` rebaseline-on-resync is LIVE** (session-44 ship). Manual `/tmp/claude-base-*.txt` workaround retired.

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

**For session 48 (sibling slice + S-8 stretch), primary reference paths:**

```
docs/HANDOFF-SESSION-47.md                                        — session 47 retro; Stage-4 row-8 has the §Architectural-smell verbatim text
docs/slices/S-INFRA-rigour-v3b-subagent-suite/verification.md     — 9-round live recursive auto-review record (AC-1 evidence) + §v3c carry-over with v2 multi-agent shape
docs/workspace-spec/72b-adversarial-review-budget.md              — Option C + impl-break (locked at S-6); Use-when criterion tightening = v3c
docs/workspace-spec/72c-multi-agent-review-framework.md           — TBD draft for v3b S-8 stretch
.claude/agents/{slice-reviewer,acceptance-gate,ux-polish-reviewer}.md  — current personas (single-agent recursive baseline)
.github/workflows/auto-review.yml                                 — current single-agent workflow; v2 will fan out to N specialists
CLAUDE.md §"Engineering conventions"                              — sibling-slice target for §Architectural-smell paragraph (verbatim from HANDOFF-47 row-8)
```

## Session 48 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                  # confirm clean tree
git rev-parse --short HEAD origin/main                                      # expect S-6-merge-SHA (post-PR-#30)
mcp__github__list_pull_requests state=closed base=main perPage=3            # confirm PR #30 + wrap PR in recent merges
```

**Pre-flight Qs (ask user before any code):**

1. **PR #30 + wrap PR merge state.** Both expected merged before session 48 starts. If PR #30 didn't merge, address blocking reason first (likely branch-protection mismatch with AC-1 §Out of scope — adjust BP to make auto-review informational-only).
2. **Sibling-slice scope** — confirm `S-INFRA-arch-smell-trigger` ships in session 48 with 1-2 ACs (§Architectural-smell trigger paragraph in CLAUDE.md "Engineering conventions") OR fold into the v3b S-8 stretch slice setup (the smell-trigger paragraph is itself an artefact of the multi-agent v2 reasoning).
3. **v3b S-8 vs v3c**: confirm option-B-from-session-47 (build multi-agent v2 NOW, between v3b complete and S-F1) vs deferring to v3c kickoff. If S-8: spec 72c first (standalone spec PR), then `S-INFRA-persona-suite-v2-multi-agent` slice with 6 ACs.
4. **Branch-protection adjust** — user-side ~5min. Confirm done OR record as v3c carry-over if not.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **AC-12 is LIVE** — `line-count.sh` rebaseline-on-resync automatic.
- **AC-7 pre-push gate is LIVE** — H6 RED→GREEN structurally enforced.
- **AC-6 tdd-guard is LIVE** — Write/Edit on `src/**.{ts,tsx}` requires green vitest run.
- **Gate 3b is LIVE** — `tdd-exemption-allowlist.txt` entries must carry `category:glob` tag.
- **AC-1 auto-review.yml is LIVE** (post-PR-#30 merge) — every PR triggers `claude -p` slice-reviewer; verdict posts as check-run; informational-at-v3b-ship per AC-1 §Out of scope (NOT auto-blocking; adjust branch-protection accordingly).
- **AC-2 acceptance-gate is shipped** but invocation wiring deferred to S-F1 per AC-2 §Scope.
- **AC-3 ux-polish-reviewer is shipped** but dormant (no UI surface in v3b/S-8 infra slices); active from S-F1.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
- **Dogfood discipline (live):** every commit passes `pre-commit-verify.sh` + `tdd-first-every-commit.sh` + (src/) `tdd-guard.sh` + (push) `pre-push-dod7.sh`. Plan-time gate fires on ExitPlanMode.
- **`control-change` label workflow live:** any PR touching L199-protected paths fails until label applied.
- **Vercel deployment status invisible to `get_check_runs`** — query `pull_request_read get_status` for Vercel.
- **Architectural-smell awareness** (session-47 lesson; codified post-sibling-PR-merge in CLAUDE.md): if adversarial review surfaces ≥3 rounds of findings clustered in one file, declare a smell + step-back review the abstraction before patching round 4. Worked example: session-47 S-6's auto-review.yml took 6 rounds of patches that a round-3 step-back would have pre-caught by extracting parsing to a tested unit.
- **Spec-validation-by-impl-break** (locked in spec 72b): for meta-test slices, deliberately break impl + verify pass-path tests turn red. Catches spec-runner-vs-impl asymmetries.
- **Single-agent recursive review baseline** (session-47 9-round dataset): 14 findings / 9 rounds. v3b S-8 multi-agent v2 should beat this on rounds-to-converge AND total tokens — measurement is AC-4 retain/drop signal.
