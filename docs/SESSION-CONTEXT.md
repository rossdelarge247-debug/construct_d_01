# Session 29 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a amended Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches (`claude/S-XX-{slug}` or `claude/session-{N}-{scope}`) → PR → main. Tink credentials in Vercel env.

## What sessions 26–28 accomplished (rolling window)

**Session 26 — CI triage mini-session.** Fixed the two remaining red jobs (Gitleaks, Dev-mode leak scan) directly on PR #10's branch via rebase; PR #10 merged `2026-04-24T08:15:28Z` with 9/9 checks green (main tip at the time `1df3678`). No separate PR number. Retro backfilled in session 27.

**Session 27 — hook-based enforcement sprint.** Four enforcement hooks + PR template + CI gate shipped: `line-count.sh` (P0.1 cumulative churn warns), `read-cap.sh` (P0.2 Read gate), `/wrap` + `wrap-check.sh` (P0.3), `PULL_REQUEST_TEMPLATE.md` + `pr-dod.yml` (P0.4 6-item DoD + 13-item security + src/-verification CI gate). CLAUDE.md pruned + Key-files-extended. Merged as PR #12 (main tip `589845d`). See `docs/HANDOFF-SESSION-27.md`.

**Session 28 — S-C-U4 disclosure-language audit slice.** First slice under the new enforcement stack. Docs-only by design per 68g C-U4 line 29. Shipped: `docs/workspace-spec/73-copy-patterns.md` (344 lines — §1 vocabulary, §2 banned words + exception policy, §3 empty-state verb family, §4 tone templates), `docs/slices/S-C-U4-disclosure-audit/` (5 populated docs, 593 lines), 68g-copy-share-opens.md C-U4/U5/U6 flipped 🟠→🟢. Full 6-item DoD walked; 13-item security checklist exercised; 6 adversarial findings (Minor → Amendment 1, Informational deferred with reasoning). Six hook-calibration observations logged — see `docs/HANDOFF-SESSION-28.md`. Branch `claude/S-C-U4-disclosure-audit` at `97aaa51` (3 commits); this wrap branch extends it. **Pending merge to main.**

## Current state

### Locked (through session 28)

- **Sessions 19-22 foundational:** 5-phase model · four-document lifecycle · spec 68a-e phase locks · spec 68f register with session-22 locks applied · spec 68g trio.
- **Sessions 23-24:** spec 71 rebuild strategy · spec 72 engineering security · spec 70 hub + 33-slice catalogue · spec 67 slice-ownership · Option 4 single-branch-main · V1 wiped · CLAUDE.md Coding/Engineering/Planning conduct.
- **Session 25:** CI triage Track A · confidence-taxonomy C-CF (3 states `known`/`estimated`/`unknown`) · SessionStart hook.
- **Session 26:** CI green on main (PR #10 merged 9/9).
- **Session 27:** Four enforcement hooks + PR template + DoD CI gate live on main (PR #12 merged). CLAUDE.md pruned + Key-files-extended.
- **Session 28:** C-U4/U5/U6 locked via spec 73 · slice-template + DoD + security-checklist first full exercise · S-C-U4 slice artefacts as reference pattern for downstream slices.

### Open (see spec 68f + 68g registers for full list)

- **68f:** 10 🟢 locked, 17 🟠 open (downstream — R-1..6, S-1..3, F-1..5, C-X1, C-N1b, C-S1b).
- **68g-visual-anchors:** 14 open (C-V1..C-V14) — resolved as slices encounter each anchor.
- **68g-build-opens:** 10 open (B-5..B-14).
- **68g-copy-share-opens:** 2 open (C-S5, C-S6). C-U4/U5/U6 locked session 28.
- **Spec 73 downstream:** 35 Cat-A strings in `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md` queued for per-surface copy-flip slices.

### Specced but NOT built

Everything in spec 68 + 70 + 71 + 72 + 67 + 73 is design-only. No slices have shipped to `src/`. S-C-U4 shipped docs-only. **S-F1 design tokens is the session-29 P0** — unblocked at end of session 28 (Claude AI Design source files confirmed available).

### Built (on main + on this wrap branch pending merge)

- **Main (as of `589845d`):** Stable libs (`src/lib/*`) · API routes · Preserve-with-reskin UI (`src/components/ui/*`, `src/components/hub/*` except title-bar) · legal placeholders · landing placeholder · CI workflows (`ci.yml`, `gitleaks.yml`, `pr-dod.yml`) · PR template · four enforcement hooks · `src/types/interview.ts` with deprecation header.
- **This wrap branch (pending merge):** `docs/workspace-spec/73-copy-patterns.md` · `docs/slices/S-C-U4-disclosure-audit/` (5 docs) · 68g-copy-share-opens.md flips · `docs/HANDOFF-SESSION-28.md` · this file.

## Session 29 priorities

### P0 — S-F1 design system tokens

Unblocked at end of session 28. User confirmed both prerequisites: psychological readiness + Claude AI Design source files available. Extracts the design-system foundation (spec 68g C-V1..C-V14 anchor components) from the session-22 Claude AI Design outputs — colour system, typography scale, shadow tokens, component design references. Per spec 71 §7a single-branch-main: open `claude/S-F1-design-tokens` off main (after merging this wrap branch first). **First `src/`-touching slice of the project** — exercises the `pr-dod.yml` CI gate end-to-end for the first time, and is the canary for the six hook-calibration observations from session 28.

### P1 — First downstream copy-flip slice (parallel or sequential to S-F1)

Candidate: `S-B-1-confirmation-questions-copy-flip` — 12 clustered Cat-A rows in `src/lib/ai/recommendations.ts` per `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md`. Ships spec 73 vocabulary into live code. Scope small; good next candidate once S-F1 design tokens provide the visual/tone context for any visible strings.

### P2 — Continued hook-calibration observation

Watch whether the six observations from HANDOFF-28 §"Hook calibration" reproduce on first src/-touching work (S-F1): (1) line-count.sh over-reports on new-file Writes, (2) read-cap.sh clean, (3) pr-dod.yml positive-path first real exercise, (4) /wrap stdout-capture quirk, (5) SessionStart nomenclature, (6) write-size silent-timeout pattern (confirmed again during session-28 wrap — see this session's notes). No pre-emptive tuning per moratorium; observe, then decide post-S-F1.

### Stretch

Merge this wrap branch to main via PR before session 29 opens, to keep main canonical. Not required per session 28 kickoff (which permitted "no PR unless user asks"); would let session 29 branch cleanly off main per spec 71 §7a.

## Scope ceiling

Target ≤1,500 lines session churn (hook-surfaced). S-F1 is design-system foundation work; churn is likely in `src/app/globals.css`, a new `src/styles/tokens.ts` or equivalent, and token-referencing component updates in Preserve-with-reskin UI. Hook warns at 1,000 / 1,500 / 2,000; relay warns to user.

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
14. **No new CLAUDE.md rules** — moratorium holds until S-F1 ships under new enforcement (per session-25 reboot decision + session-27 hook sprint + session-28 first-slice validation). Capture needed rules as HANDOFF notes or hook specs.
15. **Don't treat failing tests as spec.** A test that disagrees with shipped code is a signal, not a mandate. Verify which represents the current design decision.
16. **Don't trust kickoff-prompt factual claims without live verification.** SessionStart hook surfaces live branch state; use it. Session 28 reinforced this: a kickoff described artefacts on a branch the harness hadn't fetched locally — `git branch -a` missed it; `git ls-remote origin 'refs/heads/claude/*'` confirmed. When branch state disagrees with the kickoff, probe origin directly before concluding the work doesn't exist.
17. **DoD CI gate enforces slice-verification on src/ PRs** (session 27 P0.4). Any PR touching `src/` without a `docs/slices/S-*/verification.md` reference fails. Escape hatch: `no-slice-required` label, for truly trivial src/ touches only.
18. **Spec 73 copy patterns are mandatory for user-facing strings.** §1 replacement vocabulary + §2 banned-words (with §2.4 solicitor/judge-test exception for legal-process contexts) + §3 empty-state verb family + §4 tone templates. Downstream slices that touch user-visible strings reference spec 73 as a DoD input.

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct.
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · **spec 73 copy patterns** · `docs/engineering-phase-candidates.md` (§E/§F/§G still relevant).
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md` · `docs/slices/S-*/` as slice-pattern reference. Consult before proposing new work.

## Branch

Main is canonical. Session 28 work lives on `claude/S-C-U4-disclosure-audit` at `97aaa51` (3 commits), extended in this wrap sub-session on `claude/session-28-wrap-m7p50` (which tracks S-C-U4 locally but pushes to its own remote branch per the session branch mandate).

**Pre-session-29 prerequisite:** merge this wrap branch to main. Open PR with `gh pr create` or GitHub MCP tools. Once merged, session 29 branches off the updated main per spec 71 §7a single-branch-main.

**Feature branch pattern (spec 71 §7a single-branch-main):**
- Off main: `git checkout main && git pull --ff-only && git checkout -b claude/S-XX-{slug}` (slice) or `claude/session-{N}-{scope}` (session-scoped).
- Work → commit → push → PR → review → merge to main → delete branch.
- Preview URL per branch: `construct-dev-git-{branch}-*.vercel.app`.
- Never direct-push to main (branch protection should enforce once configured).

**Session 29 pre-flight verify:** `git fetch origin main && git log origin/main -1`. Confirm session-28 wrap PR is merged (tip should be ahead of `589845d`).

## Key files

```
Session orientation
CLAUDE.md                                          — Positioning + rules (Tier 1)
docs/SESSION-CONTEXT.md                            — THIS FILE (Tier 2)
docs/HANDOFF-SESSION-28.md                         — Latest retro (S-C-U4 slice)
docs/HANDOFF-SESSION-27.md                         — Hook-sprint retro
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
docs/workspace-spec/68g-visual-anchors.md          — C-V1..C-V14 (S-F1 extraction shortlist)
docs/workspace-spec/68g-build-opens.md             — B-5..B-14
docs/workspace-spec/68g-copy-share-opens.md        — C-U4/U5/U6 locked session 28; C-S5/S6 open
docs/workspace-spec/73-copy-patterns.md            — NEW session 28: vocabulary + banned words + empty-state + tone templates

Build Map (Tier 3)
docs/workspace-spec/70-build-map.md                — Hub + audit-integrated inventory
docs/workspace-spec/70-build-map-{start,build,reconcile,settle,finalise}.md
docs/workspace-spec/70-build-map-slices.md         — 33-slice catalogue

Phase C execution (Tier 3)
docs/workspace-spec/71-rebuild-strategy.md         — §5+§7a amended (Option 4)
docs/workspace-spec/72-engineering-security.md     — Engineering security principles
docs/engineering-phase-candidates.md               — §A/§B applied; §C/§D embodied in docs/slices/_template/

Per-slice scaffolding + first slice as reference
docs/slices/README.md                              — Convention + workflow
docs/slices/_template/{acceptance,test-plan,security,verification}.md
docs/slices/S-C-U4-disclosure-audit/               — FIRST SHIPPED SLICE (session 28 reference pattern)
  acceptance.md · audit-catalogue.md · test-plan.md · security.md · verification.md

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
docs/HANDOFF-SESSION-{18,20,21,22,23,24,25,26,27,28}.md  — Prior retros (top-level)
docs/v2/v2-backlog.md                              — 98-item backlog
```

## Session 29 pre-flight

1. **SessionStart hook fires at turn 0** surfacing read-discipline + Planning conduct + live branch state. Verify it appears.
2. **Claude loads `CLAUDE.md` + this file.** Don't batch-read Tier 3 specs — read-cap hook enforces.
3. **Verify main is ahead of `589845d`** — session-28 wrap PR should be merged:
   ```
   git fetch origin main
   git log origin/main -1
   ```
   If main is still at `589845d`, the wrap PR is unmerged — merge first, or note the miss.
4. **Confirm with user:**
   - Manual actions from HANDOFF-28 hook-calibration observations? (None required; all parked.)
   - S-F1 still P0, or reshuffle?
   - Parallel vs sequential ordering for P1 (`S-B-1-confirmation-questions-copy-flip`) vs S-F1?
5. **Open feature branch off main:** `claude/S-F1-design-tokens` per spec 71 §7a.
6. **First actions on S-F1:**
   - Read `docs/workspace-spec/68g-visual-anchors.md` with offset+limit — target the C-V1..C-V14 shortlist (source of extraction work).
   - Read `docs/workspace-spec/71-rebuild-strategy.md` §5 + §7a (offset+limit) — Phase C sequencing context for S-F1.
   - Scaffold `docs/slices/S-F1-design-tokens/` from `docs/slices/_template/` + draft AC before any `src/` edit.
   - Confirm Claude AI Design source files accessible before committing to extraction.

**Session discipline (hook-surfaced; restated):**
- Honour Planning conduct from turn 1. Brief-rot in this file is possible — live-verify factual claims.
- Target ~1,500 lines. Hook warns at 1,000 / 1,500 / 2,000.
- **No new CLAUDE.md rules** — moratorium holds until S-F1 ships under new enforcement. Capture needed rules as HANDOFF notes or hook specs.
- **Honour the 6-item DoD + 13-item security checklist.** PR template mandatory; CI gate fails `src/`-touching PRs without slice-verification reference. S-F1 is the first real exercise of the positive path — watch for gate behaviour.
- **Long-prose Writes: use skeleton + Edit-append.** Stream-idle-timeout pattern confirmed twice in session 28 (spec 73 mid-slice, SESSION-CONTEXT rewrite during wrap). Default to skeleton for docs >~200 lines of structured prose.
