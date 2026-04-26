# Session 36 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a amended Option 4) + spec 72 (engineering security) are the execution layer.
## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches (`claude/S-XX-{slug}` or `claude/session-{N}-{scope}`) → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0` per S-INFRA-1 (session 35); package.json + both lockfiles aligned.
## What sessions 32-35 accomplished (rolling window)

- **Session 32:** S-F1 design tokens (PR #14 merged) — first src/-touching slice; CI gate `pr-dod.yml` first positive activation.
- **Session 33:** S-F7-α slice scaffold + Phase C kickoff prep. Persistence + auth abstraction contracts drafted; AC frozen. Branch-resume occurrence #1 (manual recovery).
- **Session 34:** **S-TOOL-1 shipped + S-F7-α PR #20 merged** (main `5d38f6d`). Tooling slice fixed `line-count.sh` measure-vs-main inflation (session-base SHA captured at turn 0 by `session-start.sh`) and added harness branch-resume detection (suffixed branch + canonical-on-origin → resync recipe surfaced at turn 0). 11 new vitest hook tests; full suite **92/92 GREEN**. **CLAUDE.md #12 (Branch-resume check) lifted** into Planning conduct § (second clean use). PR #21 OPEN at `0d98393` with 10/10 GHA green, 0 reviews, **1 Vercel-preview-error pending**.
- **Session 35:** **PR #22 (S-INFRA-1) shipped + merged + PR #21 (S-TOOL-1) merged + S-F7-β AC frozen + scaffold pushed.** Diagnosed PR #21's Vercel red as dual-lockfile divergence (`package-lock.json` pinned `stripe@22.0.0`; `pnpm-lock.yaml` pinned `stripe@22.1.0`; CI used npm so Type-check passed; Vercel auto-detected pnpm-lock so `next build`'s post-compile typecheck failed). S-INFRA-1 synced both lockfiles to `stripe@22.1.0` + bumped package.json range to `^22.1.0` + updated apiVersion literal `'2025-03-31.basil'` → `'2026-04-22.dahlia'`. Squash-merged PR #22 (main → `ba8db5e`); `update_pull_request_branch` on PR #21 to merge new main into branch (head `0d98393` → `598e859`); 10/10 GHA + Vercel green; squash-merged PR #21 (main → `c43ca2f`). Branched `claude/S-F7-beta-dev-surface` off `c43ca2f`; drafted full S-F7-β slice (acceptance.md 7 ACs frozen + verification.md UI-template + security.md spec-72-§11-binding skeleton); committed at `0d4094f`. Branch-resume occurrence #3 (manual recovery again — hook from PR #21 not yet on main at session start).
## Current state

### Locked (through session 35)

- 5-phase journey (Start · Build · Reconcile · Settle · Finalise) per spec 42.
- Document-as-spine (4-doc lifecycle) per spec 44.
- Hub + 68a-e: navigation, trust, share, exit, AI coach (cross-cutting); Sarah's Picture mechanics (Build); joint doc + conflict card + queue (Reconcile); proposal + AI coach + counter (Settle); generation + pre-flight + fork + submit (Finalise).
- Spec 70 Build Map: 33-slice catalogue (Start/Build/Reconcile/Settle/Finalise + Foundation F1-F7 + Marketing + CF copy-flips). S-TOOL-N codified session 35 as non-catalogue prefix family for tooling slices (S-TOOL-1 done; S-TOOL-2 long-prose hook still parked as Path F).
- Spec 71 §7a Option 4: single-branch-main; no integration branch; no cutover event.
- Spec 72: 13-item per-slice security checklist; CI gates (gitleaks, env-var regex, dev-mode leak scan, npm audit, Type-check, Lint, unit tests, production build, slice-verification reference). 10 GHA check_runs total.
- Hook + CI enforcement: SessionStart (branch-resume detection + read-discipline reminder + session-base SHA capture) · PostToolUse Write/Edit (line-count tracking, accurate post-S-TOOL-1) · PreToolUse Read (read-cap blocks >400L full-file reads + >300L per-turn). `/wrap` + `/review` + `/security-review` + `/init` + `/simplify` skills available.
- CLAUDE.md candidates lifted: 6 across all sessions. Most recent (session 34): **#12 Branch-resume check** into Planning conduct §.
- **Stripe SDK pinned `^22.1.0` (S-INFRA-1, session 35).** Both lockfiles aligned. apiVersion literal `'2026-04-22.dahlia'` matches Stripe SDK 22.1.0's typed `LatestApiVersion`.

### Open (see spec 68f + 68g registers for full list)

- 68f session-21 register: live; updated through session 22 locks.
- 68g visual anchors C-V1..C-V14 (Phase C extraction shortlist).
- 68g build opens B-5..B-14.
- 68g copy-share opens C-U4-6 + C-S5-6.
- Spec 71 §4 "opens" within S-F7 lock: storage schema versioning, real-Supabase migration playbook, scenario JSON format, dev-only API route convention. Non-blocking S-F7-β; lock pragmatically as first concrete need surfaces during impl.

### Specced but NOT built

- Most slices in spec 70 catalogue. Phase C Step 1 set: S-F1 (built, session 32) → **S-F7 (α built session 34, β scaffolded session 35, β impl session 36)** → S-F3 → S-F2 → S-F4 → S-F6 → first user-facing slice.

### Built (on main as of `c43ca2f`)

```
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts          — S-F7-α (PR #20, session 34)
src/lib/store/{dev-store,index,scenario-loader,types}.ts          — S-F7-α (PR #20, session 34)
src/lib/store/scenarios/{cold-sarah,sarah-mid-build}.json         — S-F7-α (PR #20, session 34)
src/lib/stripe/client.ts                                          — apiVersion aligned (S-INFRA-1, PR #22, session 35)
package.json + lockfiles                                          — stripe@22.1.0 pinned (S-INFRA-1, session 35)
.claude/hooks/{line-count,session-start}.sh                       — S-TOOL-1 (PR #21, session 35)
tests/unit/hooks-{line-count,session-start}.test.ts               — S-TOOL-1 (PR #21, session 35)
docs/slices/{S-F1,S-B-1,S-B-2,S-C-U4,S-F7-alpha,S-INFRA-1,S-TOOL-1,S-F7-beta}/  — slice docs
CLAUDE.md §Planning conduct                                        — #12 Branch-resume check lifted (session 34)
```

**Branch `claude/S-F7-beta-dev-surface` (1 ahead, 0 behind)** holds the S-F7-β scaffold at `0d4094f`: acceptance.md (7 ACs frozen) + verification.md (UI-template skeleton) + security.md (13-item checklist skeleton). No `src/` changes yet.
## Session 36 priorities

### P0 — implement S-F7-β per frozen AC

AC contract is frozen at `docs/slices/S-F7-beta-dev-surface/acceptance.md` (session 35, all 7 ACs). No re-scoping at session start; AC is the contract. Implementation order, dependency-respecting:

1. **AC-7 (#14 lift, smallest, ~30 lines)** — patch `.claude/hooks/session-start.sh` near top with `git remote set-head origin main 2>/dev/null || true`; add CLAUDE.md bullet under §Planning conduct; extend `tests/unit/hooks-session-start.test.ts` with idempotency assertion. Standalone first commit; verifies S-TOOL-1's hook-test pattern still works post-merge.
2. **AC-1 (route group + dashboard, ~150 lines)** — `src/app/dev/layout.tsx` (notFound on prod) + `src/app/dev/page.tsx` (dashboard linking the tools below).
3. **AC-5 (env banner reskin, ~80 lines)** — `src/components/layout/env-banner.tsx` reskinned (Preserve-with-reskin per spec 71 §4 line 260) + integration into `(authed)` layout.
4. **AC-6 (6 fixture scenarios, ~200 lines)** — `src/lib/store/scenarios/{sarah-connected,sarah-complete,sarah-shared-mark-invited,sarah-reconcile-in-progress,sarah-settle,sarah-finalise}.json` + scenarioLoader extension if α used closed enum.
5. **AC-2 (scenario picker + reset, ~150 lines)** — `src/components/dev/scenario-picker.tsx`, `src/app/dev/scenarios/page.tsx`, `src/app/dev/reset/page.tsx`.
6. **AC-3 (state inspector, ~120 lines)** — `src/components/dev/state-inspector.tsx`, `src/app/dev/state-inspector/page.tsx`. Cut to read-only if mid-impl scope stress.
7. **AC-4 (engine workbench move, ~50 lines)** — `src/app/dev/engine-workbench/page.tsx` (preserve existing) + delete `src/app/workspace/engine-workbench/page.tsx`.

Total estimated impl churn: ~780 lines + tests + verification.md fills + adversarial review = ~1100 lines session 36 churn. Within 1500 warn.

### Pre-flight binding decisions

1. **Open PR for `claude/S-F7-beta-dev-surface` at session 35 wrap?** Recommended yes — surfaces frozen AC for review before code dilutes the diff. Title: "S-F7-β: dev surface routes + env banner reskin (scaffold — AC frozen)". Body calls out scaffold-only, AC frozen 2026-04-26.
2. **AC-7 lift bundling** — ship as standalone tooling commit ahead of β's main impl per recommended order, OR bundle inside β's first src/ commit per AC-7 wording? Recommended: standalone first commit (cleaner CI signal — hook test passing in isolation before any new src/ surface).

### P1 — none. Single-P0 session.

### P2 — surface-level housekeeping

- **CLAUDE.md candidate threshold update** — SESSION-CONTEXT line documenting prose-Write threshold should drop from `~200` to `~100` per session 35 evidence (HANDOFF-35 single Write at ~120 lines stream-idle-timed-out).
- **Provisional-close re-evaluations:** #3 (line-count refined model — fixed by S-TOOL-1 session-base SHA, may be redundant) · #13 (PR-by-session-end — practiced cleanly session 35, may be redundant after #12 lift). Worth a 5-min decision either way at next infra session.
- **Carry-forward parked:** AUX-3 PWR drift · #7 tdd-guard hook spec · #9 vitest version-quirks · #10 lockfile policy (partially addressed by S-INFRA-1 but full lift = single-lockfile pnpm-only adoption) · #11 compile-time RED · #14 (bundling into S-F7-β AC-7 session 36).

### Stretch

If S-F7-β impl finishes early:
- Path F (S-TOOL-2 long-prose Write hook) — would have prevented this session's stream-idle-timeout. ~80 lines bash + ~30 lines md + 4-6 vitest tests. Bundles `/refresh-session-context` slash command per session 34 design.
- S-F2 / S-F3 / S-F4 / S-F6 — next foundation slices in Phase C Step 1 set.
## Scope ceiling

Single-P0 session. S-F7-β is foundational and substantial (~1100 lines impl + tests). Don't add adjacent slice work; don't refactor; don't reskin beyond AC-5's spec-71-§4 banner; don't extend fixture realism beyond "deterministic + load-without-crash + spec-71-stage-name accurate" per AC-6 in-scope. If session 36 hits the 1500-line warn mid-impl, **stop and re-slice** — ship what's complete + carry the rest to S-F7-γ. Don't push past 2000.
## Negative constraints

1. **Do NOT** frame Decouple as a "financial disclosure tool." Spec 42 complete-settlement-workspace framing is load-bearing. Spec 73 is the operational definition of how user-facing copy expresses this — consult it before writing any new user-visible string.
2. **Phase-C-freeze model RETIRED** (session 24 Option 4). Single-branch-main; no integration branch; no cutover event. If user traffic arrives before Phase C completes, re-introduce freeze via new spec 71 §7a amendment — don't retrofit from pre-Option-4 strikethrough text.
3. **Do NOT** re-introduce any file from the wiped V1 tree (`src/components/workspace/*`, `src/components/interview/*`, etc.). If a slice needs a V1 pattern, extract as a design doc and rebuild — don't copy-paste.
4. **Do NOT** re-open 68a-e locked decisions unless new evidence surfaces. Same for 68g C-U4/U5/U6 (locked session 28 via spec 73).
5. **Do NOT** read pre-pivot specs (03-06, 11, 12). Active framing: 42, 44, 65, 67, 68, 68a-g, 70, 71, 72, 73.
6. **`NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` mandatory in Production** (spec 72 §2 + §7). CI gate enforces; runtime assertion throws on mismatch; `/app/dev/*` returns 404 in prod.
7. **Read discipline enforced by `.claude/hooks/read-cap.sh`** (session 27 P0.2): full-file Reads of >400-line files blocked without offset+limit; per-turn total >300 blocked. Grep/ls/wc-l before Read remains habit-level; the hook catches the forgotten case.
8. **V1 legacy palette gone.** Visual canonical = Claude AI Design tool outputs (session 22 wire batches). Airbnb / Emma / Habito + spec 18 palette + spec 27 all superseded.
9. **Safeguarding V1 = signposting + baseline** (spec 67 Gap 11, spec 72 §9). Detection / decoy / adaptive pacing = V1.5.
10. **Identity verification waits until consent-order stage** — not signup, not Settle signature (V1 = explicit attestation per 68f S-3).
11. **MLP not MVP** — scope decisions per slice framed as "what the *loveable* version requires vs what can iterate post-launch." Users are in crisis; loveable is the floor.
12. **AI extracts facts, app generates questions** — never put reasoning / clarification / gap analysis in AI extraction schemas. result-transformer.ts generates these via spec 13 trees.
13. **Anthropic SDK uses `output_config.format`** (not `response_format`). All JSON schemas need `additionalProperties: false`. SDK timeout 90s; route maxDuration 300s.
14. **CLAUDE.md moratorium partially lifted across sessions 31-34.** 6 candidates lifted total. 8 currently parked: AUX-3 · #3 · #7 · #9 · #10 · #11 · #13 · #14. Continue capturing new candidates as HANDOFF notes; don't lift ad hoc within a slice session. Lift after 2 clean uses.
15. **Don't treat failing tests as spec.** A test that disagrees with shipped code is a signal, not a mandate. Verify which represents the current design decision.
16. **Don't trust kickoff-prompt factual claims without live verification.** SessionStart hook surfaces live branch state; use it. Session 35 reinforced: kickoff said "10/10 CI green" but combined commit-status was `failure` (Vercel red, infra-pre-existing). Verify against `mcp__github__pull_request_read --method=get_status` + `--method=get_check_runs` separately before building plans on stated PR state.
17. **DoD CI gate enforces slice-verification on src/ PRs** (session 27 P0.4). Any PR touching `src/` without a `docs/slices/S-*/verification.md` reference fails. Escape hatch: `no-slice-required` label, for truly trivial src/ touches only.
18. **Spec 73 copy patterns are mandatory for user-facing strings.** §1 replacement vocabulary + §2 banned-words (with §2.4 solicitor/judge-test exception for legal-process contexts) + §3 empty-state verb family + §4 tone templates. Downstream slices that touch user-visible strings reference spec 73 as a DoD input.
19. **Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.** (Threshold lowered from 200 after session 35 evidence — HANDOFF-35 single-Write at ~120 lines stream-idle-timed-out. Until Path F / S-TOOL-2 lands a hook-enforced version, defensive default is skeleton-from-the-start, not 200L ceiling.)
20. **Dual-lockfile divergence guard.** S-INFRA-1 (session 35) aligned `package-lock.json` + `pnpm-lock.yaml` to `stripe@22.1.0`. Smoke test: `grep -c '22\.[0-9]\+\.[0-9]\+' pnpm-lock.yaml package-lock.json` should match. If divergence recurs, S-INFRA-2 lifts CLAUDE.md candidate #10 (single-lockfile pnpm-only policy).
## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct.
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · **spec 73 copy patterns** · `docs/engineering-phase-candidates.md` (§E/§F/§G still relevant).
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md` · `docs/slices/S-*/` as slice-pattern reference. Consult before proposing new work.
## Branch

> **SESSION 36 OUTCOME (2026-04-26):** Two branches in flight. ALL feature work paused until **S-INFRA-rigour-v3a-foundation** merges to main (split per session-36 v1 reviewer; v3a unblocks β, v3b + v3c run in parallel after).
>
> 1. **`claude/S-F7-beta-impl`** at HEAD `a3f67ec` — all 7 S-F7-β ACs shipped (28cc585 AC-7 · d8e2246 AC-1 · fcb5028 AC-5 · 2a2232f AC-6 · 857b958 AC-2/pageExtensions · c2abe62 AC-3 · 8166f89 AC-4 · a3f67ec verification.md). Branch pushed; PR NOT opened. β cleanup (security-review skill run, unit tests for handlers, component decomposition, 13-item §72 §11 checklist) parked pending v3a merge.
> 2. **`claude/S-INFRA-rigour-v3`** at HEAD `405badd` (post-split commit) — original single-slice plan rejected by adversarial subagent v1 review (verdict: request-changes; 2 block-severity findings F3 + F5; single-concern verdict FAIL). Split per reviewer into three slice directories:
>    - `docs/slices/S-INFRA-rigour-v3a-foundation/` — pre-commit + plan-time gates; **merges first → unblocks β**
>    - `docs/slices/S-INFRA-rigour-v3b-subagent-suite/` — pair-programming + 5 adversarial subagent gates (stub acceptance.md only; full ACs drafted at slice start)
>    - `docs/slices/S-INFRA-rigour-v3c-quality-and-rewrite/` — multi-provider 3rd-agent + structured findings + Stryker + ratchet + allowlist parser + PR auto-opener + cron audit + CLAUDE.md "Hard controls" consolidating rewrite (stub only)
>
>    v3a-foundation/acceptance.md REVISED in session 36 addressing v1 reviewer findings — reframed DoD-9 as External Preconditions (F3 fix), real self-mod protection via `control-change` PR label workflow (F5 fix), spec 72 §11 13-item checklist binding (F1c), per-language coverage spec (F6), verify-before-planning enforcement in plan-gate (F4e), settings.json hook-registration in checksum scope (F4b), every-commit TDD beats first-commit-only (F2b), bottom-up budget ~940 lines for v3a (F-budget), failing-meta-tests-first as separate SHA before impl (F2), CLAUDE.md "Hard controls (in development)" stub permitted incrementally (F3b), reference-slice dogfood requirement (F6c), clean external-preconditions table (F6d).
>
>    Adversarial subagent v2 review of revised acceptance.md spawned at session-36 wrap — running async at end of session. v2 verdict captured in `acceptance.md.review-v2.json` once complete; if any block-severity issues remain or v2 verdict is `request-changes`, next session iterates BEFORE any src/ work. If v2 verdict is `approve` or `nit-only`, next session begins AC-1 impl with failing-meta-tests-first commit.
>
> **Next session (37) FIRST ACTIONS:**
> 1. Check v2 review verdict at `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md.review-v2.json` (committed at session-36 wrap or session-37 startup if subagent hadn't returned yet).
> 2. If v2 verdict not yet `approve` / nit-only: address remaining findings, re-spawn for v3 review, iterate.
> 3. If clean: rename branch `claude/S-INFRA-rigour-v3` → `claude/S-INFRA-rigour-v3a-foundation` (open question; deferring rename until impl starts to keep current PR-URL stable).
> 4. Begin AC-1 impl: failing meta-tests for verify-slice.sh as a separate commit SHA, then verify-slice.sh impl commit. Two distinct commits (per F2/F2b).
> 5. Continue session-37 plan: AC-1 + AC-3 (ESLint config) + AC-4 (pre-commit-verify hook) + AC-8 (CLAUDE.md "Hard controls" stub). Estimated ~470 lines.

### Branch state at session 36 wrap (verified)

- Active branch: `claude/S-INFRA-rigour-v3` at HEAD `405badd` (post-split commit) — pushed
- v2 review subagent: spawned async; result captured in `acceptance.md.review-v2.json` and committed before session ends (or at session-37 startup if not returned in time)
- Parked branch: `claude/S-F7-beta-impl` at HEAD `a3f67ec` (8 ahead origin/main) — pushed
- Both branches pushed; both have unopened PRs. v3a slice merges to main FIRST; β PR opens after v3a merges + β cleanup completes.

**If session 36 lands on a suffixed orphan** (e.g. `claude/resume-S-F7-beta-dev-surface-XXXXX`): the now-merged `session-start.sh` from PR #21 should auto-surface a `### Branch-resume check` section in the turn-0 context block with the literal `git fetch / git checkout -B / git branch -D` resync recipe. **First natural test of automated detection** — if it doesn't fire, escalate (hook bug or harness behaviour change). Manual recovery still works if needed:

```
git fetch origin claude/S-F7-beta-dev-surface
git checkout -B claude/S-F7-beta-dev-surface origin/claude/S-F7-beta-dev-surface
git branch -D <orphan-suffixed-branch>
git remote set-head origin main
```
## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-36-relevant additions / changes since CLAUDE.md was last updated:

```
docs/HANDOFF-SESSION-35.md                                       — session 35 retro (NEW this wrap)
docs/slices/S-INFRA-1-stripe-sdk-pin/                            — Stripe SDK fix slice (PR #22, merged)
docs/slices/S-TOOL-1-line-count-branch-resume/                   — line-count + branch-resume hooks slice (PR #21, merged)
docs/slices/S-F7-beta-dev-surface/                               — S-F7-β scaffold (NEW; AC frozen 2026-04-26)
  ├─ acceptance.md                                               — 7 ACs frozen
  ├─ verification.md                                             — UI-template skeleton, AC sign-off table
  └─ security.md                                                 — spec 72 §11 13-item checklist skeleton
src/lib/stripe/client.ts                                         — apiVersion '2026-04-22.dahlia' (S-INFRA-1)
package.json + package-lock.json + pnpm-lock.yaml                — stripe@22.1.0 aligned across both lockfiles
.claude/hooks/{line-count,session-start}.sh                      — S-TOOL-1 (now on main)
tests/unit/hooks-{line-count,session-start}.test.ts              — S-TOOL-1 hook tests (now on main)
```

**For session 36 S-F7-β impl, primary reference paths:**

```
docs/workspace-spec/71-rebuild-strategy.md §4 (lines 174-301)    — Dev-mode pattern (3 abstractions · switch · routes · banner · fixtures)
docs/workspace-spec/71-rebuild-strategy.md §8 (lines 480-515)    — S-F7 slice card
docs/workspace-spec/70-build-map-slices.md (lines 69-94)          — S-F7 spec-70 slice card
docs/workspace-spec/72-engineering-security.md §3 + §7 + §11      — Session pattern + dev/prod boundary + 13-item checklist
src/lib/auth/* + src/lib/store/*                                  — S-F7-α contracts (consume from β; do not modify)
src/lib/store/scenarios/*.json                                    — α delivered 2 fixtures; β adds 6 more
src/lib/bank/test-scenarios.ts                                    — Re-use per spec 71 §4 line 283 (bank portions of fixtures)
src/components/layout/env-banner.tsx                              — Preserve-with-reskin per spec 71 §4 line 260
src/app/workspace/engine-workbench/page.tsx                       — Move target → src/app/dev/engine-workbench/page.tsx (AC-4)
```
## Session 36 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git log origin/main -1                                           # confirm c43ca2f stable (or beyond if other PRs landed)
git log -10 --oneline                                            # confirm session 35 commits visible
mcp__github__list_pull_requests --head=claude/S-F7-beta-dev-surface
mcp__github__list_branches                                       # confirm branch state, no orphans
git status                                                       # working tree clean
pnpm install                                                     # repo arrives without node_modules
pnpm test                                                        # confirm 92/92 baseline (S-TOOL-1 tests on main)
git remote set-head origin main                                  # required for /security-review skill
```

**Pre-flight Qs (ask user before any code):**

1. **Open scaffold PR confirmation** — was the PR opened at session 35 wrap? If no, open before starting impl. If yes, confirm AC contract still as-frozen (no review comments requesting changes).
2. **AC order confirmation** — implement in dependency order per §"Session 36 priorities" (AC-7 → AC-1 → AC-5 → AC-6 → AC-2 → AC-3 → AC-4), or re-prioritise (e.g. AC-1 + AC-5 first to get visible UI sooner)?
3. **AC carving requested?** — AC-3 (state inspector) read-only fallback to S-F7-γ if scope stress, or AC-4 (engine workbench move) deferred? Default: full β.
4. **AC-7 lift bundling** — standalone first commit ahead of β src/ work (recommended), OR bundle inside β's first src/ commit per AC-7 wording?

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. Brief-rot in this file is possible — live-verify factual claims.
- Target ~1500 lines session churn. Hook now reports accurately (S-TOOL-1 fix landed).
- **Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines** (lowered from 200 per session 35 evidence; HANDOFF-35 single-Write at ~120 lines stream-idle-timed-out). Path F (S-TOOL-2) lands the hook-enforced version when prioritised.
- **CLAUDE.md moratorium:** capture candidates as HANDOFF notes; lift after 2 clean uses; don't ad-hoc within a slice session. Bundle #14 lift into S-F7-β AC-7 first commit per session-35 decision.
- **Honour the 6-item DoD + 13-item security checklist.** S-F7-β is `pr-dod.yml`'s next positive-path activation. Spec 72 §11 13-item is binding (no N/A escape — slice IS the dev/prod boundary surface).
- **Behavioural-test discipline:** still binding per session-31 lift.
- **Branch-resume hook now on main** (PR #21 merged). First natural test of automated detection if harness orphans recur.
