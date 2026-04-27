# Session 39 Wrap Context Block (heading into session 40)

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
- **Session 39 (this wrap):** Closed AC-7 (`S-37-6` exit-plan-review hook + nonce framing + `git-state-verifier.sh`; `S-37-6 fix` hermetic git fixture for shallow-detached-HEAD CI), AC-2 part 2 (`S-37-7` control-change-label workflow pulled forward from session 38; `S-37-7a` step-level path detection refactor for branch-protection compatibility), AC-8 (`S-37-8` CLAUDE.md `## Hard controls (in development)` stub). PR #24 GREEN end-to-end at `8bf866f` (15 checks passing, including the new control-change gate verified in BOTH directions on PR #24's own CI history). v3b carry-over docs updated with three deferred concerns. **Session-37-budgeted v3a items now all PASS; session-38 budget remaining: AC-1 full impl + AC-5 + AC-6.**

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
- **NEW (session 39): v3a session-37-budget complete.** AC-1 skeleton + AC-2 (both parts) + AC-3 + AC-4 + AC-7 + AC-8 PASS per `verification.md`. Plan-time gate (AC-7) live with random-nonce framing + `git-state-verifier.sh` sub-script. Control-change-label workflow (AC-2 part 2) live with step-level path detection (branch-protection-compatible) and verified bidirectionally on PR #24's own CI history. CLAUDE.md `## Hard controls (in development)` stub catalogues the gates + verdict vocabulary (G23) + rollback procedure (G19). Three v3b carry-over concerns recorded.

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

**On `claude/S-INFRA-rigour-v3a-foundation` @ `8bf866f` (28 ahead, in flight as PR #24 draft):** v3a-foundation slice docs + S-37-0..S-37-8 landed. PR #24 [GREEN at `8bf866f` across 15 CI checks]. User has confirmed external preconditions (`control-change` label + branch protections). Mergeable when DoD-11 final body is refreshed at slice wrap (per acceptance.md L184). Session-38-budget items remaining: AC-1 full impl, AC-5 TDD-every-commit, AC-6 coverage gate.

## Session 40 priorities

### P0 — close v3a session-38-budget items + merge PR #24

External preconditions are confirmed by user (label + branch protections in place; control-change check verified bidirectionally on PR #24). The slice is now in "complete the spec" mode, not "establish discipline" mode.

**Sub-sequence (per acceptance.md L65–L77 budget table):**

1. **S-38-1 — `verify-slice.sh` full impl** replacing skeleton-mode file-presence-only check. Reads `verification.md` for AC-evidence presence; runs ESLint + the spec 72 §11 checklist; per-language coverage threshold lookup. Promotes the pre-commit gate from theatrical to real-enforcement. ~100 lines per L67. **Workhorse for AC-5 + AC-6.**
2. **S-38-2 — meta-tests full impl** covering full-mode `verify-slice.sh` paths (RED → GREEN cycle for the new behaviours added in S-38-1). Includes the AC-7 nonce-randomness test deferred from session 37. ~80 lines per L68.
3. **S-38-3 — TDD-every-commit gate (AC-5)** as a `.claude/hooks/tdd-first-every-commit.sh` PreToolUse:Bash hook that blocks `git commit` unless the staged diff includes a corresponding test file change. Skeleton-mode permissive on doc-only commits; full enforcement on src/ + scripts/. ~80 lines per L74.
4. **S-38-4 — coverage gate (AC-6)** wires `vitest.config.ts` thresholds into `verify-slice.sh` per-language; CI Unit-tests job already runs vitest, so the gate is the ratchet not the runner. ~80 lines per L75.

**Estimated session 40 churn:** ~340 lines + commit messages + verification.md evidence updates ≈ ~420. Well under the 1500 warn.

**Then:** refresh PR #24 body to DoD-11 final form (per acceptance.md L184): full commit enumeration + verification.md AC-evidence cross-references + v3 review verdict citation. Move PR from draft → ready-for-review. Merge unblocks v3b planning.

### Stretch (session 40 if early finish)

- v3b adversarial-subagent-suite full AC drafting (currently 32-line stub; v3b carry-over from v3a § "Carry-over from v3a" lists the deferred concerns to roll in).
- `docs/slices/S-INFRA-rigour-v3a-foundation/HANDOFF-SLICE-WRAP.md` consolidating the slice retro across sessions 37–40.

### P1 — none. Single-P0 session.

### P2 — surface housekeeping

- `docs/HANDOFF-SESSION-39.md` is the retro wrap doc for this session.
- `v3b/acceptance.md` "Carry-over from v3a" enumerates 2 deferred items (subagent default-spawn flip; three L199 protected-path omissions) — fold into v3b's full AC table at v3b kickoff.
- v3a's verification.md adversarial-review section records 3 deferred concerns. Concern 3 (inherent LLM-input-separation limit) stays in v3a only; not actionable as a slice item.

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

### Branch state at session-39 wrap (verified live, not from kickoff memory)

- **Active:** `claude/S-INFRA-rigour-v3a-foundation` @ `8bf866f` · 28 ahead of `origin/main` `92f77d7` · pushed · in flight as PR #24 (draft, GREEN). v3a session-37-budget complete; session-38-budget items remaining (AC-1 full + AC-5 + AC-6).
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-v3a merge.
- **`main`** @ `92f77d7` · no new merges since PR #21 (S-TOOL-1, session 35).

### Iteration trajectory of v3a-foundation slice planning

5 adversarial review iterations converged at v5 nit-only:
- v1 → v2 → v3 → v4 → **v5: `nit-only` (0 BLOCK + 0 RC + 2 nits J1+J2)** → v5.1 polish closed J1+J2.

### Next session (40) FIRST ACTIONS

1. Verify branch state per `.claude/hooks/session-start.sh`. Expected: `claude/S-INFRA-rigour-v3a-foundation` @ `8bf866f` (or further ahead if any commits landed in the interim). Live-verify against kickoff claims per Planning conduct.
2. Re-fetch PR #24 CI status via `mcp__github__pull_request_read get_check_runs` — confirm GREEN carries through.
3. Decide with user: (a) continue v3a session-38-budget work on the same branch (AC-1 full → AC-5 → AC-6 → DoD-11 PR-body refresh → merge), or (b) merge PR #24 now in skeleton-mode and defer AC-1 full / AC-5 / AC-6 to v3a-2.
4. If (a): begin S-38-1 per acceptance.md L67 (`verify-slice.sh` full impl) — workhorse for AC-5 + AC-6.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-39-relevant additions:

```
docs/HANDOFF-SESSION-39.md                                       — session 39 retro (NEW)
docs/slices/S-INFRA-rigour-v3a-foundation/                       — v3a-foundation slice docs (now session-37-budget complete)
  ├─ acceptance.md                                               — 8 ACs frozen, v5.1 adversarial-approved
  ├─ acceptance.md.review-v{1-5}.json                            — historical adversarial review chain
  ├─ verification.md                                              — AC-1 skeleton + AC-2 + AC-3 + AC-4 + AC-7 + AC-8 PASS rows
  └─ security.md                                                 — spec-72 §11 checklist + L52(g) addendum
docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md      — stub + § Carry-over from v3a (2 deferred concerns)
docs/slices/S-INFRA-rigour-v3c-quality-and-rewrite/acceptance.md — stub (full draft when v3c begins)

.claude/hooks/exit-plan-review.sh                                — AC-7 plan-time gate (NEW)
.claude/subagent-prompts/exit-plan-review.md                     — AC-7 review prompt template (NEW; AC-2 checksummed)
scripts/git-state-verifier.sh                                     — AC-7 verify-before-planning sub-script (NEW)
.github/workflows/control-change-label.yml                       — AC-2 part 2 label workflow (NEW; step-level path detection)

tests/shellspec/exit-plan-review.spec.sh                         — 10 meta-tests (NEW)
tests/shellspec/git-state-verifier.spec.sh                       — 7 meta-tests with hermetic git fixture (NEW)

CLAUDE.md §"Hard controls (in development)"                      — AC-8 stub (NEW: gates table + verdict vocab + rollback)
```

**For session 40 v3a-foundation completion, primary reference paths:**

```
docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md          — THE PLAN (AC table; budget L65–L77; protection scope L199; rollback L201; PR-body refresh L184)
docs/slices/S-INFRA-rigour-v3a-foundation/verification.md        — current PASS/PENDING evidence per AC; update as S-38-* lands
scripts/verify-slice.sh                                          — currently skeleton-mode; S-38-1 promotes to full impl
.claude/hooks/pre-commit-verify.sh                               — calls verify-slice.sh; effect of S-38-1 is real-enforcement
.github/workflows/control-change-label.yml                       — protected-path regex (must extend if v3b amends L199 scope)
```

## Session 40 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                       # confirm clean tree
git rev-parse --short HEAD                                       # expect 8bf866f (or further ahead)
git log --oneline origin/main..HEAD | wc -l                      # expect 28 (or +N from interim commits)
```

Plus: `mcp__github__pull_request_read get_check_runs` against PR #24 to confirm CI carries through.

**Pre-flight Qs (ask user before any code):**

1. **Continue v3a or merge in skeleton-mode?** Per L67/L74/L75 the session-38-budget items (AC-1 full + AC-5 + AC-6) complete the slice as specced. Skipping them ships a "discipline floor" without enforcement teeth. Default recommendation: continue. *Status: open.*

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- Target ≤500 lines session-40 churn (well under 1500 warn).
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
- **Dogfood discipline:** every src/ + scripts/ commit now passes through `verify-slice.sh` in skeleton-mode (file-presence-only) via `pre-commit-verify.sh`; once S-38-1 lands, full enforcement is live. The plan-time gate (AC-7) intercepts ExitPlanMode and runs `git-state-verifier.sh` against any plan content.
- **No bypass via `--no-verify`:** harness-level hooks intercept at the Bash tool layer, not git layer.
