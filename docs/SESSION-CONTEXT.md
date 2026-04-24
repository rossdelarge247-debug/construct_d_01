# Session 28 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a amended Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches (`claude/S-XX-{slug}` or `claude/session-{N}-{scope}`) → PR → main. Tink credentials in Vercel env.

## What sessions 25–27 accomplished (rolling window)

**Session 25 — CI triage + confidence-taxonomy lock + SessionStart hook + reboot decision.** CI workflow fixes applied but 2 reds deferred. `.claude/hooks/session-start.sh` shipped — turn-0 branch state + read-discipline reminder. Mid-session audit found chronic rule-drift ("adding more rules has been the failure mode") and pivoted the plan from more rules to automation.

**Session 26 — CI triage mini-session (no handoff at the time; retro backfilled session 27).** Fixed the two remaining red jobs (Gitleaks, Dev-mode leak scan) directly on PR #10's branch via rebase; PR #10 merged `2026-04-24T08:15:28Z` with all 9 checks green (main tip `1df3678`). No separate PR number. No retro or SESSION-CONTEXT refresh done at the time.

**Session 27 — hook-based enforcement sprint.** Four enforcement hooks + PR template + CI gate shipped:
- **P0.1** `.claude/hooks/line-count.sh` (PostToolUse Write/Edit) — cumulative session churn via `git diff --numstat origin/main` + untracked `wc -l`. Warns at 1,000 / 1,500 / 2,000. Commit `5409a71`.
- **P0.2** `.claude/hooks/read-cap.sh` (PreToolUse Read) — blocks full-file Reads of >400-line files without offset+limit; blocks Reads that would push turn-total past 300. 45s gap heuristic for turn boundaries. Commit `524b2d9`.
- **P0.3** `/wrap` slash command + `.claude/hooks/wrap-check.sh` — interactive wrap-protocol checklist. Commit `73709db`.
- **P0.4** `.github/PULL_REQUEST_TEMPLATE.md` + `.github/workflows/pr-dod.yml` — 6-item DoD + 13-item security checklist on every PR; CI fails `src/`-touching PRs without `docs/slices/S-*/verification.md` reference. Commit `a7ce9e4`.
- **P1 CLAUDE.md pruning** — 5 section commits (`a70a276` → `b9dcf73`): line-count + read-discipline sub-rules collapsed to hook pointers; wrap + DoD sections gained enforcement pointers; session-startup tightened. Net -5 lines on pruned sections. Plus Key files extension (`daa3bed`) +10 lines for hook/CI discoverability → CLAUDE.md net **231 → 236** (+5).

See `docs/HANDOFF-SESSION-27.md` for full retro. Session 27 did NOT ship a slice — deferred per kickoff's "hooks before slices" constraint.

## Current state

### Locked (through session 27)

- **Sessions 19-22 foundational:** 5-phase model · four-document lifecycle · spec 68a-e phase locks · spec 68f register with session-22 locks applied · spec 68g trio.
- **Sessions 23-24:** spec 71 rebuild strategy · spec 72 engineering security · spec 70 hub + 33-slice catalogue · spec 67 slice-ownership · Option 4 single-branch-main · V1 wiped · CLAUDE.md Coding/Engineering/Planning conduct.
- **Session 25:** CI triage Track A · confidence-taxonomy C-CF (3 states `known`/`estimated`/`unknown`) · SessionStart hook.
- **Session 26:** CI green on main (PR #10 merged with 9/9 checks).
- **Session 27:** Four enforcement hooks + PR template + DoD CI gate live on branch. CLAUDE.md pruned + Key-files-extended.

### Open (see spec 68f + 68g registers for full list)

- **68f:** 10 🟢 locked, 17 🟠 open (downstream — R-1..6, S-1..3, F-1..5, C-X1, C-N1b, C-S1b).
- **68g-visual-anchors:** 14 open (C-V1..C-V14) — resolved as slices encounter each anchor.
- **68g-build-opens:** 10 open (B-5..B-14).
- **68g-copy-share-opens:** 5 open. **C-U4 disclosure-language audit is session 28 P0** (blocks anchor extraction copy).

### Specced but NOT built

Everything in spec 68 + 70 + 71 + 72 + 67 is design-only. No slices shipped. S-F1 design tokens is the first engineering slice once Claude AI Design source files are released; C-U4 copy audit is the first session-28 target (no asset dependency).

### Built (on main + on session-27 branch pending merge)

- **Main (pre-session-27):** Stable libs (`src/lib/*`) · API routes · Preserve-with-reskin UI (`src/components/ui/*`, `src/components/hub/*` except title-bar) · legal placeholders · landing placeholder · CI workflows (`ci.yml`, `gitleaks.yml`) · `src/types/interview.ts` with deprecation header.
- **Session 27 branch (pending merge):** four enforcement hooks + `/wrap` command + PR template + DoD CI gate + CLAUDE.md prune/extend + HANDOFF-26 stub + HANDOFF-27 retro.

## Session 28 priorities

### P0 — C-U4 disclosure-language audit

No asset dependency; first slice exercised under new enforcement. First real test of: PR template · pr-dod.yml gate · `/wrap` live invocation · 6-item DoD · adversarial review output in PR body · 13-item security checklist. See `docs/workspace-spec/68g-copy-share-opens.md` for C-U4 scope.

### P1 — S-F1 design system tokens (unblock-dependent)

Gated on user releasing Claude AI Design tool source files from session 22. Per session-27 kickoff user statement: "I'm not going anywhere near that until I feel it is safe to do so." No action on S-F1 until user signals unblock.

### P2 — Hook calibration pass

Observe live behaviour of session 27 P0.1-P0.4 during real slice work (C-U4). If `read-cap.sh` 45s gap heuristic misfires, if `line-count.sh` misses an edge case, if `pr-dod.yml` false-flags — tune. Not expected to need changes; flagged for attention.

### Stretch

Adversarial review (`/security-review` skill) on the four enforcement hooks themselves in their first real-use context. Not required; nice-to-have.

## Scope ceiling

Target ≤1,500 lines session churn (hook-surfaced). C-U4 is a copy-audit slice; the churn will be heavier in docs than code, but honour the cap. Hook warns at 1,000 / 1,500 / 2,000; relay warns to user.

## Negative constraints

1. **Do NOT** frame Decouple as a "financial disclosure tool." Spec 42 complete-settlement-workspace framing is load-bearing.
2. **Phase-C-freeze model RETIRED** (session 24 Option 4). Single-branch-main; no integration branch; no cutover event. If user traffic arrives before Phase C completes, re-introduce freeze via new spec 71 §7a amendment — don't retrofit from pre-Option-4 strikethrough text.
3. **Do NOT** re-introduce any file from the wiped V1 tree (`src/components/workspace/*`, `src/components/interview/*`, etc.). If a slice needs a V1 pattern, extract as a design doc and rebuild — don't copy-paste.
4. **Do NOT** re-open 68a-e locked decisions unless new evidence surfaces.
5. **Do NOT** read pre-pivot specs (03-06, 11, 12). Active framing: 42, 44, 65, 67, 68, 68a-g, 70, 71, 72.
6. **`NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` mandatory in Production** (spec 72 §2 + §7). CI gate enforces; runtime assertion throws on mismatch; `/app/dev/*` returns 404 in prod.
7. **Read discipline enforced by `.claude/hooks/read-cap.sh`** (session 27 P0.2): full-file Reads of >400-line files blocked without offset+limit; per-turn total >300 blocked. Deny messages quote the rule + suggest alternatives. Grep/ls/wc-l before Read remains habit-level; the hook catches the forgotten case.
8. **V1 legacy palette gone.** Visual canonical = Claude AI Design tool outputs (session 22 wire batches). Airbnb / Emma / Habito + spec 18 palette + spec 27 all superseded.
9. **Safeguarding V1 = signposting + baseline** (spec 67 Gap 11, spec 72 §9). Detection / decoy / adaptive pacing = V1.5.
10. **Identity verification waits until consent-order stage** — not signup, not Settle signature (V1 = explicit attestation per 68f S-3).
11. **MLP not MVP** — scope decisions per slice framed as "what the *loveable* version requires vs what can iterate post-launch." Users are in crisis; loveable is the floor.
12. **AI extracts facts, app generates questions** — never put reasoning / clarification / gap analysis in AI extraction schemas. result-transformer.ts generates these via spec 13 trees.
13. **Anthropic SDK uses `output_config.format`** (not `response_format`). All JSON schemas need `additionalProperties: false`. SDK timeout 90s; route maxDuration 300s.
14. **No new CLAUDE.md rules** — moratorium holds until S-F1 ships under new enforcement (per session-25 reboot decision + session-27 hook sprint). Capture needed rules as HANDOFF notes or hook specs. The reboot is automation, not more rules.
15. **Don't treat failing tests as spec.** A test that disagrees with shipped code is a signal, not a mandate. Verify which represents the current design decision (spec + user confirmation); the stale side is the artefact.
16. **Don't trust kickoff-prompt factual claims without live verification.** SessionStart hook surfaces live branch state; use it. Session 25 caught 3 brief-rot errors via verification; session 27 caught 2 more (kickoff's "P0.0 closed" + "session 27" framing needed user confirmation because SESSION-CONTEXT was still session-26-framed at the time).
17. **DoD CI gate enforces slice-verification on src/ PRs** (session 27 P0.4). Any PR touching `src/` without a `docs/slices/S-*/verification.md` reference fails. Escape hatch: `no-slice-required` label, for truly trivial src/ touches only (use sparingly).

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct.
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · `docs/engineering-phase-candidates.md` (§E/§F/§G still relevant).
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`. Consult before proposing new work.

## Branch

Main is canonical. Session 27 PR merging into main will bring four enforcement hooks + DoD CI gate + PR template to main — once merged, they apply to every subsequent PR repo-wide.

**Feature branch pattern (spec 71 §7a single-branch-main):**
- Off main: `git checkout main && git pull --ff-only && git checkout -b claude/S-XX-{slug}` (slice) or `claude/session-{N}-{scope}` (session-scoped).
- Work → commit → push → PR → review → merge to main → delete branch.
- Preview URL per branch: `construct-dev-git-{branch}-*.vercel.app`.
- Never direct-push to main (branch protection should enforce once configured).

**Session 28 pre-flight verify:** `git fetch origin main && git log origin/main -1`. Confirm session-27 wrap PR is merged (tip should be ahead of `1df3678`).

## Key files

```
Session orientation
CLAUDE.md                                          — Positioning + rules (Tier 1)
docs/SESSION-CONTEXT.md                            — THIS FILE (Tier 2)
docs/HANDOFF-SESSION-27.md                         — Latest retro (session 27 hook sprint)
docs/HANDOFF-SESSION-26.md                         — CI-triage mini-session backfill stub
docs/HANDOFF-SESSION-25.md                         — Reboot-decision retro

Reconciled framing (Tier 3)
docs/workspace-spec/42-strategic-synthesis.md      — Authoritative positioning
docs/workspace-spec/44-the-document-structure.md   — Four-document lifecycle
docs/workspace-spec/68-synthesis-hub.md            — Wire reconciliation hub
docs/workspace-spec/68a-decisions-crosscutting.md  — Cross-cutting locks
docs/workspace-spec/68b-decisions-build.md         — Build locks
docs/workspace-spec/68c-decisions-reconcile.md     — Reconcile locks
docs/workspace-spec/68d-decisions-settle.md        — Settle locks
docs/workspace-spec/68e-decisions-finalise.md      — Finalise locks
docs/workspace-spec/68f-open-decisions-register.md — Session-21 register + session-22 locks
docs/workspace-spec/68g-visual-anchors.md          — C-V1..C-V14
docs/workspace-spec/68g-build-opens.md             — B-5..B-14
docs/workspace-spec/68g-copy-share-opens.md        — C-U4..U6 + C-S5..S6 (C-U4 = session 28 P0)

Build Map (Tier 3)
docs/workspace-spec/70-build-map.md                — Hub + audit-integrated inventory
docs/workspace-spec/70-build-map-{start,build,reconcile,settle,finalise}.md
docs/workspace-spec/70-build-map-slices.md         — 33-slice catalogue

Phase C execution (Tier 3)
docs/workspace-spec/71-rebuild-strategy.md         — §5+§7a amended (Option 4)
docs/workspace-spec/72-engineering-security.md     — Engineering security principles
docs/engineering-phase-candidates.md               — §A/§B applied; §C/§D embodied in docs/slices/_template/

Per-slice scaffolding
docs/slices/README.md                              — Convention + workflow
docs/slices/_template/{acceptance,test-plan,security,verification}.md

Flow model (Tier 4 reference)
docs/workspace-spec/65-pre-signup-interview-reconciled.md  — → S-O1
docs/workspace-spec/67-post-signup-profiling-progress.md   — Slice-ownership map at end

Hook + CI enforcement (sessions 25 + 27) — full paths in CLAUDE.md Key files
.claude/settings.json · .claude/hooks/{session-start,line-count,read-cap,wrap-check}.sh
.claude/commands/wrap.md
.github/workflows/{ci,gitleaks,pr-dod}.yml
.github/PULL_REQUEST_TEMPLATE.md

Stable libs (Re-use per spec 70 hub — on main now)
src/lib/{bank,ai,supabase,stripe,analytics,documents,recommendations}/*
src/app/api/{bank,documents,ntropy,plan,health}/*
src/types/{hub,index,workspace}.ts
src/hooks/{use-count-up,use-hub,use-staggered-reveal,use-interview,use-workspace}.ts
src/constants/index.ts · src/utils/cn.ts

Preserve-with-reskin (Re-use logic; UI rebuild at S-F1)
src/components/ui/{button,card,badge}.tsx
src/components/layout/{header,footer,env-banner}.tsx
src/components/hub/{category-selector,discovery-flow,evidence-lozenge,hero-panel,section-cards,fidelity-label}.tsx
src/app/{privacy,terms,cookies}/page.tsx           — Pending legal review

Dev-only (moves to /app/dev/ at S-F7)
src/app/workspace/engine-workbench/page.tsx
src/components/hub/{debug-panel,tink-debug-panel}.tsx
src/app/api/{test-pipeline,bank/test}/route.ts

Exception (deprecated; full delete blocked on S-O1)
src/types/interview.ts                             — 4 Re-use/PWR consumers

Placeholder
src/app/page.tsx                                   — "Rebuilding" landing until S-M1 + S-F1

Archive (Tier 4)
docs/handoffs-archive/                             — HANDOFFs 2-17
docs/HANDOFF-SESSION-{18,20,21,22,23,24,25,26,27}.md  — Prior retros (top-level)
docs/v2/v2-backlog.md                              — 98-item backlog
```

## Session 28 pre-flight

1. **SessionStart hook fires at turn 0** surfacing read-discipline + Planning conduct + live branch state. Verify it appears.
2. **Claude loads `CLAUDE.md` + this file.** Don't batch-read Tier 3 specs — read-cap hook enforces.
3. **Verify branch base:**
   ```
   git fetch origin main
   git log origin/main -1
   ```
   Confirm session-27 wrap PR is merged.
4. **Confirm with user:**
   - Manual actions from HANDOFF-27 status? (Branch protection status checks; `/hooks` reload if needed.)
   - C-U4 copy audit still P0, or reshuffle?
   - Claude AI Design source files now available? (Unblocks S-F1.)
5. **Open feature branch off main:** `claude/S-C-U4-disclosure-audit` (or similar) per spec 71 §7a.
6. **First action on C-U4:** read `docs/workspace-spec/68g-copy-share-opens.md` §C-U4 with offset+limit for scope; don't read the whole file if it's >400 lines (hook will block).

**Session discipline (hook-surfaced; restated):**
- Honour Planning conduct from turn 1. Brief-rot in this file is possible — live-verify factual claims.
- Target ~1,500 lines. Hook warns at 1,000 / 1,500 / 2,000.
- **No new CLAUDE.md rules** — moratorium holds until S-F1 ships under new enforcement (per session-25 reboot). Capture needed rules as HANDOFF notes or hook specs.
- **Honour the 6-item DoD + 13-item security checklist.** PR template is mandatory; CI gate fails PRs that touch `src/` without slice-verification reference.
