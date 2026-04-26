# Session 37 Wrap Context Block (heading into session 38)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 33-37 accomplished (rolling window)

- **Session 33:** S-F7-α slice scaffold + Phase C kickoff prep. Persistence + auth abstraction contracts drafted.
- **Session 34:** S-TOOL-1 shipped + S-F7-α PR #20 merged (main `5d38f6d`). Tooling slice fixed `line-count.sh` measure-vs-main inflation + added harness branch-resume detection.
- **Session 35:** PR #22 (S-INFRA-1 Stripe pin) shipped + merged + PR #21 (S-TOOL-1) merged + S-F7-β AC frozen + scaffold pushed.
- **Session 36:** S-F7-β implementation (8 commits on `claude/S-F7-beta-impl` HEAD `a3f67ec`; PR not opened — β cleanup parked pending v3a-foundation merge). Self-audit revealed systemic discipline lapses (TDD skipped on 5/7 ACs; no `/security-review` per slice; monolithic page components against function-size rule). User explicitly chose **rigour > speed** and opened S-INFRA-rigour-v3 programme. v1 adversarial review of bundled 9-AC slice returned `request-changes` with single-concern FAIL; reviewer recommended split. v3 → v3a-foundation + v3b-subagent-suite + v3c-quality-and-rewrite. v2 review of revised v3a returned `request-changes` with 2 BLOCK + 16 RC + 6 nits.
- **Session 37 (this wrap):** **Slice planning phase for v3a-foundation COMPLETE.** Five adversarial review iterations converged at v5 verdict `nit-only`. Trajectory v1 (block + 6) → v2 (2 BLOCK + 24) → v3 (1 BLOCK + 8) → v4 (0 BLOCK + 4) → **v5 (0+0+2 nit-only)** → v5.1 polish (J1+J2 closed). 13 commits on `claude/S-INFRA-rigour-v3` (8 from session 36, 5 new this session: v3-revision · v3-review-capture · v4-revision · v4-review-capture · v5-revision · v5-review-capture · v5.1-polish). All pushed. **Slice unblocked for AC-1 impl in session 38.**

## Current state

### Locked (through session 37)

- 5-phase journey (Start · Build · Reconcile · Settle · Finalise) per spec 42.
- Document-as-spine (4-doc lifecycle) per spec 44.
- Hub + 68a-e: navigation, trust, share, exit, AI coach (cross-cutting); Sarah's Picture mechanics (Build); joint doc + conflict card + queue (Reconcile); proposal + AI coach + counter (Settle); generation + pre-flight + fork + submit (Finalise).
- Spec 70 Build Map: 33-slice catalogue + S-TOOL-N tooling-slice family + S-INFRA-N infrastructure-slice family.
- Spec 71 §7a Option 4: single-branch-main; no integration branch; no cutover event.
- Spec 72: 13-item per-slice security checklist; CI gates.
- Hook + CI enforcement: SessionStart (branch-resume detection + read-discipline reminder + session-base SHA capture) · PostToolUse Write/Edit (line-count tracking) · PreToolUse Read (read-cap blocks).
- Stripe SDK pinned `^22.1.0`. Both lockfiles aligned.
- **NEW (session 37): S-INFRA-rigour-v3a-foundation acceptance.md adversarial-review-approved at nit-only verdict.** 8 ACs frozen + budget 1560 lines across 3 sessions + cross-session H6 sub-sequence locked + external preconditions table + threat model documented. Bundle is multi-concern by-design with concrete per-AC dependency table; rationale audit-trailed across 5 iterations.

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

**On `claude/S-INFRA-rigour-v3` (14 ahead, in flight):** v3a-foundation slice docs (acceptance.md v5.1 adversarial-approved + v1-v5 review JSONs) PLUS S-37-0 (shellspec install + minimal CI workflow) landed at `a898393` from a session-38 attempt that subsequently crashed before S-37-1. AC-1 impl resumes at S-37-1.

## Session 38 priorities

### P0 — begin v3a-foundation AC-1 impl per H6 ordered sub-sequence

**Pre-flight blocker:** External preconditions (per acceptance.md §External preconditions table) must be at least partially in place before session 38 starts:

1. GitHub label `control-change` exists on the repo.
2. Branch protection on `main` requires the `control-change` label for PRs touching `.claude/hooks/**` + `scripts/verify-slice.sh` + `.eslintrc` + `vitest.config.ts` + `.claude/subagent-prompts/*.md` + `hooks-checksums.txt` + `.github/workflows/control-change-label.yml` + `.github/workflows/pr-dod.yml`.
3. Branch protection on `main` requires ≥1 human approval before merge.

If only (1) is in place, session 38 can proceed through S-37-5 (pre-commit-verify hook). (2) and (3) are merge gates not landing gates per the External preconditions table — slice MERGE depends on them, not slice-completion. Session 38 carries through HANDOFF-37 the explicit ask to user.

**H6 ordered sub-sequence (session 38):**

1. **S-37-0 — LANDED at `a898393`** (session-38 attempt, before crash). Adds `.github/workflows/shellspec.yml` (curl-install + run on every push/PR), `tests/shellspec/.shellspec` config, and a trivial `install_smoke.spec.sh` (passes by `When call true`). Documentation-and-CI-only; falls under pre-AC-1 exempt-commits rule. Decision recorded: **separate S-37-0 commit** (not folded into S-37-1) per session-38 pre-flight Q3.
2. **S-37-1 (NEXT — first action of fresh session):** `tests/shellspec/verify-slice.spec.sh` with deliberate failures (RED). Push. Wait for CI run on the new shellspec workflow. Capture `CI-observed-failing` run-ID into a working note (will be embedded in `verification.md` when AC-1 lands). ~50 lines.
3. **S-37-2:** `scripts/verify-slice.sh` skeleton (file-presence checks: verifies slice dir has `acceptance.md` + `security.md` + `verification.md`; useful-message exit per G17 matching `read-cap.sh` pattern; tmp-repo isolation helper per G15). Skeleton passes against itself AND against `docs/slices/S-F7-alpha-contracts-dev-mode/` reference slice. Failing meta-tests from S-37-1 turn GREEN. ~100 lines.
4. **S-37-3:** `.claude/hooks-checksums.txt` baseline + `scripts/generate-hooks-checksums.sh` + `session-start.sh` integrity-check addition. ~120 lines.
5. **S-37-4:** ESLint config addition + `docs/eslint-baseline-allowlist.txt` (empty seed) + CI denial-check workflow. ~100 lines.
6. **S-37-5:** `.claude/hooks/pre-commit-verify.sh` hook + checksum append. From this commit onwards, every commit on this branch passes through `verify-slice.sh` in incremental mode (skeleton-mode permissive — file-presence-only — until S-38-1's full impl). ~60 lines.
7. **S-37-6:** `.claude/hooks/exit-plan-review.sh` + `.claude/subagent-prompts/exit-plan-review.md` template (random-nonce-per-invocation framing per H2 BLOCK closure) + git-state-verifier sub-script. ~170 lines.
8. **S-37-7:** CLAUDE.md `+§"Hard controls (in development)"` stub section (gates table + verdict vocabulary + rollback procedure). ~80 lines.

**Estimated session 38 churn:** 30 + 50 + 100 + 120 + 100 + 60 + 170 + 80 = ~710 lines + commit messages + docs (acceptance.md update if drift) = ~810. Within 1500 warn; under 1000 soft-note. End-of-session 38: skeleton verify-slice.sh + all hook wiring landed; full rule enforcement (real coverage, real ESLint, real TDD blocking) lands in session 39 per S-38-1.

### Stretch (session 38 if early finish; OR session 39)

- S-38-1 verify-slice.sh full impl replacing skeleton (real coverage parser + ESLint check + spec-72-§11 checklist presence)
- S-38-2 meta-tests full impl
- S-38-3 control-change-label.yml workflow with path-filter self-inclusion (BLOCK closure for G3+G10)

### P1 — none. Single-P0 session.

### P2 — surface housekeeping

- HANDOFF-SESSION-37 retro is the wrap doc for this session (`docs/HANDOFF-SESSION-37.md`).
- The `claude/S-INFRA-rigour-v3` branch may be renamed to `claude/S-INFRA-rigour-v3a-foundation` at session 38 first impl commit per G1 (deferred from session 37 to keep PR-URL stable across planning iterations).

## Scope ceiling

Single-P0 session. v3a foundation is the unblocking slice. Don't add adjacent slice work; don't refactor; don't reskin. If session 38 hits the 1500-line warn mid-impl, **stop and re-slice** — ship what's complete + carry rest to session 39. Don't push past 2000.

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

> **SESSION 38a OUTCOME (CRASH RECOVERY, 2026-04-26):** A session-38 attempt was started after the wrap of session 37. It made decisions on the 3 pre-flight Qs (Q3: separate S-37-0 install commit), authored S-37-0 (`a898393`: shellspec install + minimal CI workflow + smoke test), pushed it to `origin/claude/S-INFRA-rigour-v3`, then crashed before authoring S-37-1. No uncommitted state; no S-37-1 attempt visible in reflog or remote. Crash diagnosed in a recovery session: local was 1 commit behind remote post-crash; fast-forwarded local to `a898393`. Pre-flight Q1 (GitHub external preconditions) and Q2 (branch rename) status: unknown — re-confirm with user at next session. CI status of S-37-0 push: not directly retrievable via available tools; smoke test is `When call true; The status should be success` so very low risk.
>
> **SESSION 37 OUTCOME (2026-04-26):** Three branches in flight; v3a-foundation slice planning phase COMPLETE.
>
> 1. **`claude/S-INFRA-rigour-v3` at HEAD `a898393` (14 ahead of `origin/main` `92f77d7`; was `d836a04`/13 at session 37 wrap)** — slice planning artefacts (acceptance.md v5.1 + 5 review JSONs + handoff docs) PLUS S-37-0 (shellspec install + minimal CI workflow + smoke test) landed at `a898393` from a session-38 attempt. v5.1 polish committed at `d836a04`; planning phase converged at v5 verdict `nit-only`. Branch may still be renamed to `claude/S-INFRA-rigour-v3a-foundation` per G1 (deferred decision still open).
> 2. **`claude/S-F7-beta-impl` at HEAD `a3f67ec` (8 ahead, parked)** — S-F7-β impl from session 36; PR not opened; cleanup pending v3a-foundation merge to main.
> 3. **`main` at `92f77d7`** — last merged: PR #21 (S-TOOL-1, session 35).
>
> **Iteration trajectory of v3a-foundation slice planning** (5 adversarial review iterations + 1 polish):
> - v1: `request-changes`, 6 findings (2 BLOCK F3+F5: DoD-9 unfalsifiable + hooks-checksums self-modification gap; single-concern FAIL on bundled 9-AC slice). → split into v3a + v3b + v3c.
> - v2: `request-changes`, 24 findings (2 BLOCK G3+G10: control-change-label.yml self-protection recursion gap; single-concern still fails).
> - v3: `request-changes`, 8 findings (1 BLOCK H2: plan-injection bypass via embedded `</plan-from-author>` tag).
> - v4: `request-changes`, 4 findings (0 BLOCK; I1 bundle rationale handwaves AC-3/6/8; I2 nonce mechanism under-specified).
> - **v5: `nit-only`, 2 findings (0 BLOCK + 0 RC + 2 nits J1+J2). Reviewer recommended "proceed-to-AC-1 impl per H6 sub-sequence".**
> - v5.1 polish: J1+J2 closed (no re-review needed per v5 reviewer's "PR-comment follow-up acceptable" framing).
>
> **Next session (38) FIRST ACTIONS:**
> 1. Verify branch state per session-start hook. Confirm **14 ahead at `a898393`** (post-crash recovery: local was 1 commit behind remote after the crashed session-38 attempt; resync via `git pull --ff-only origin claude/S-INFRA-rigour-v3` if hook reports 13/d836a04 instead of 14/a898393).
> 2. Confirm with user whether the GitHub external preconditions (label `control-change` + branch protection on main) are in place. If yes: full H6 sub-sequence proceeds. If no: S-37-1 + S-37-2 can still proceed (they don't touch protected paths until S-37-3 lands `hooks-checksums.txt`).
> 3. Decide whether to rename branch to `claude/S-INFRA-rigour-v3a-foundation` now (cleaner audit trail) or keep `claude/S-INFRA-rigour-v3` until PR opens.
> 4. Begin S-37-0 (shellspec install, if not folded into S-37-1) → S-37-1 (failing meta-tests RED, push, observe CI red, capture run-ID) → continue H6 sub-sequence.

### Branch state at recovery-session wrap (verified)

- Active: `claude/S-INFRA-rigour-v3` at HEAD `a898393` (14 ahead, pushed)
  - Session 37 wrap was at `d836a04` (13 ahead); session-38 attempt added `a898393` then crashed.
- Parked: `claude/S-F7-beta-impl` at HEAD `a3f67ec` (8 ahead, pushed; resumes post-v3a-merge)
- `main` at `92f77d7` (no new merges since session 35)

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-37-relevant additions:

```
docs/HANDOFF-SESSION-37.md                                       — session 37 retro (NEW)
docs/slices/S-INFRA-rigour-v3a-foundation/                       — v3a-foundation slice docs
  ├─ acceptance.md                                               — 8 ACs frozen, v5.1 adversarial-approved
  ├─ acceptance.md.review-v1.json                                — historical (request-changes; 6 findings)
  ├─ acceptance.md.review-v2.json                                — historical (request-changes; 24 findings)
  ├─ acceptance.md.review-v3.json                                — historical (request-changes; 8 findings)
  ├─ acceptance.md.review-v4.json                                — historical (request-changes; 4 findings)
  └─ acceptance.md.review-v5.json                                — current (nit-only; 2 nits J1+J2 closed)
docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md      — stub (full draft when v3b begins)
docs/slices/S-INFRA-rigour-v3c-quality-and-rewrite/acceptance.md — stub (full draft when v3c begins)
```

**For session 38 v3a-foundation impl, primary reference paths:**

```
docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md          — THE PLAN (203 lines; AC table at §Acceptance criteria; H6 sub-sequence at §Cross-session plan)
docs/slices/S-F7-alpha-contracts-dev-mode/                       — α reference slice for DoD-2 (verify-slice.sh must pass against this without modification per F6c)
.claude/hooks/{line-count,session-start}.sh                      — existing hooks (now subject to AC-2 protection scope when AC-2 lands)
.github/workflows/pr-dod.yml                                     — existing CI gate (subject to AC-2 protection per G3+G10)
CLAUDE.md                                                        — recipient of AC-8 "Hard controls (in development)" stub section
```

## Session 38 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                       # confirm clean tree
git rev-parse --short HEAD                                       # expect d836a04
git log --oneline origin/main..HEAD | wc -l                      # expect 13
ls docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md.review-v5.json  # confirm v5 review present
git remote set-head origin main                                  # required for /security-review skill
```

**Pre-flight Qs (ask user before any code):**

1. **External preconditions status** — has the user added the `control-change` label + branch protection on main per the External preconditions table? Affects which H6 commits can land (S-37-1 + S-37-2 are blocker-free; S-37-3 onward depends). *Status as of recovery-session wrap: not confirmed by user.*
2. **Branch rename** — rename `claude/S-INFRA-rigour-v3` → `claude/S-INFRA-rigour-v3a-foundation` at first impl commit (cleaner audit) OR keep stable until PR opens? *Status: not actioned in crashed session-38 attempt; still open.*
3. ~~Shellspec install positioning~~ — **ANSWERED** in crashed session-38 attempt: separate S-37-0 commit (landed at `a898393`). Not re-litigate.

**S-37-0 CI verification (session-38 attempt did not capture):** check that the shellspec workflow run on the `a898393` push went GREEN. If RED, S-37-0 needs a follow-up fix commit before S-37-1 (otherwise S-37-1's RED won't be distinguishable from S-37-0's RED). Use `mcp__github__list_commits` or visit `https://github.com/rossdelarge247-debug/construct_d_01/actions` to confirm.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. Brief-rot in this file is possible — live-verify factual claims.
- Target ≤1000 lines session-38 churn (well under 1500 warn). H6 sub-sequence's per-commit ordering naturally paces the work.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
- **Dogfood discipline**: once S-37-2 lands the verify-slice.sh skeleton + S-37-5 lands the pre-commit hook, every commit on this branch onwards passes through verify-slice.sh in incremental mode. Skeleton-mode permissive (file-presence only) until S-38-1's full impl lands.
- **G13 gate**: S-37-1 RED commit must be CI-observed-failing before S-37-2 (skeleton) is pushed. This is the externally-verifiable TDD discipline; capture the CI run-ID into `verification.md` AC-1 evidence section.
- **No bypass via `--no-verify`**: harness-level hooks intercept at the Bash tool layer, not git layer. `git commit --no-verify` doesn't help.
