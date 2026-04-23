# Session 26 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 is authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a amended Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.

**Single-branch-main workflow** (spec 71 §7a amended session 24, Option 4): no `phase-c` integration branch, no cutover event. Slice work on short-lived feature branches (`claude/S-XX-{slug}`) → PR → main. Vercel prod rebuilds on every main merge; may show placeholder / partially-built state during rebuild — acceptable given no users. Tink credentials in Vercel env.

## What session 25 accomplished

**CI triage + confidence-taxonomy lock + mid-session meta-audit + partial reboot.**

- **Track A CI triage complete** (6 commits on branch). All 8 CI jobs now pass locally: lint (0 errors / 23 warnings left in preserved code per agreed plan), typecheck, tests (4/4), build, env-var regex ban, dev-mode leak scan, npm audit, gitleaks. Details in `docs/HANDOFF-SESSION-25.md`.
- **Confidence-state taxonomy corrected.** Shipped code has always been 3 states (`known` / `estimated` / `unknown`); a stale test expected 4. Reverted my initial "fix" that added `unsure` to match the test; instead corrected the test. Locked decision in new `C-CF Confidence taxonomy` section of spec 68a.
- **Mid-session meta-audit of rule-drift** (agent-delegated). Found chronic pattern across sessions 21-24: rules codified at wrap, broken next session. Adding more rules has been the failure mode. Full findings in HANDOFF-25.
- **Reboot initiated — one concrete automation piece shipped.** SessionStart hook wired at `.claude/hooks/session-start.sh` + `.claude/settings.json`. On session start: injects read-discipline caps, Planning conduct rules, and **live** branch-state verification (branch, HEAD vs origin/main, ahead/behind, clean/dirty). Counter to Tier-1-CLAUDE.md-rules-not-enough pattern. **Hook needs user `/hooks` reload or restart** to activate — settings watcher doesn't see `.claude/` created mid-session.
- **Brief-rot caught 3 times** in the session-25 kickoff (WORKSPACE_PHASES, CONFIDENCE_STATES count, gitleaks flag — all wrong). Reinforces the SessionStart-hook live-branch-state value.
- **Reboot completion deferred to session 26** by explicit decision. Full audit + session-26 implementation brief in HANDOFF-25. No new CLAUDE.md rules this session.

See `docs/HANDOFF-SESSION-25.md` for detailed retro + session-26 brief.

## Current state

### Locked (through session 24)

- **Sessions 19-22 foundational:** 5-phase model · four-document lifecycle · spec 68a-e phase locks · spec 68f session-21 register with session-22 locks applied · spec 68g trio (visual anchors, build opens, copy/share opens).
- **Session 23:** spec 71 rebuild strategy · spec 72 engineering security · spec 70 hub audit · spec 70 slices catalogue (S-F7 + S-M1 = 33 slices) · spec 67 slice-ownership map · engineering-phase-candidates (§A/§B applied, §C/§D embodied in slice templates, §E/§F/§G parked).
- **Session 24:** Phase C foundation merged to main · Phase-C-freeze retired (Option 4) · V1 wiped · CLAUDE.md has Coding conduct + Engineering conventions + Planning conduct + read-discipline rules · slice template scaffolding ready · CI drafts ready · HANDOFFs archived.
- **Session 25:** CI triage complete (all 8 jobs pass) · confidence-taxonomy locked in spec 68a as new C-CF section (3 states: `known`/`estimated`/`unknown`) · SessionStart hook wired at `.claude/hooks/session-start.sh` · mid-session audit captured rule-drift pattern · reboot-completion deferred to session 26.

### Open (see spec 68f + 68g trio registers for full list)

- **68f:** 10 🟢 locked, 17 🟠 open (mostly downstream — R-1..6, S-1..3, F-1..5, C-X1, C-N1b, C-S1b).
- **68g-visual-anchors:** 14 open (C-V1..C-V14) — resolved as slices encounter each anchor.
- **68g-build-opens:** 10 open (B-5..B-14).
- **68g-copy-share-opens:** 5 open. **C-U4 disclosure-language audit = session 25 P1** (blocks anchor extraction copy).

### Specced but NOT built

Everything in spec 68 + 70 + 71 + 72 + 67 is design-only. No implementation yet. S-F1 design tokens is the first engineering slice; blocked pending Claude AI Design tool source files from session 22 wire batches.

### Built (on main post-Option-4)

- **Re-use (unchanged):** `src/lib/{bank,ai,supabase,stripe,analytics,documents,recommendations}/*` · `src/app/api/{bank,documents,ntropy,plan,health,test-pipeline}/` · `src/app/workspace/engine-workbench/` (moves to `/app/dev/` at S-F7) · most hooks · `src/utils/cn.ts` · `src/types/{hub,index}.ts`.
- **Preserve-with-reskin:** `src/components/ui/{button,card,badge}.tsx` · `src/components/layout/{header,footer,env-banner}.tsx` · `src/components/hub/fidelity-label.tsx` · `src/lib/bank/confirmation-questions.ts` · `src/lib/supabase/workspace-store.ts` · `src/types/workspace.ts` · `src/hooks/{use-interview,use-workspace}.ts` · `src/constants/index.ts` · legal placeholders (`/privacy`, `/terms`, `/cookies`).
- **Deprecated exception:** `src/types/interview.ts` — restored with deprecation header; full delete blocked on spec-65 refactor at S-O1.
- **Placeholder:** `src/app/page.tsx` — minimal "rebuilding" landing.

## Session 26 priorities

**Sole objective: hook-based enforcement sprint.** No new CLAUDE.md rule-writing. See `docs/HANDOFF-SESSION-25.md` §"Session-26 brief" for full spec. Summary:

### P0 — Build four enforcement hooks / automations in order

1. **Line-count display hook** — `PostToolUse` on `Write|Edit`. Maintains session-local running total; surfaces delta + cumulative after each change. Warns at 1,000, harder warn at 1,500. No blocking.
2. **Read-cap hook** — `PreToolUse` on `Read`. Blocks full-file reads >400 lines without offset/limit; blocks when batched turn-total >300 lines. Deny with pointer to CLAUDE.md Planning conduct §.
3. **`/wrap` slash command** — enforces wrap protocol (CLAUDE.md:49-64). Interactive checklist: clean tree · HANDOFF written · SESSION-CONTEXT updated · PR opened.
4. **DoD CI gate + PR template** — `.github/PULL_REQUEST_TEMPLATE.md` with 6-item DoD checklist; CI check that blocks slice PRs without corresponding `docs/slices/S-*/verification.md` updates.

### P1 — CLAUDE.md pruning

Rule-by-rule review: what's enforced by hook/CI (keep), what's genuinely held (keep), what's been broken more than held (remove or demote). **Moratorium on new rules** until S-F1 ships under new enforcement.

### P2 — First slice (if time + assets)

S-F1 design system tokens becomes the test slice once hooks are in. Must ship with full 6-item DoD + 13-item spec 72 §11 security DoD visibly checked + adversarial review output in PR description. **If Claude AI Design tool source files still blocked**, use C-U4 copy audit as hook-enforcement test target instead.

### Scope ceiling

Target ≤1,500 lines this session (hook infrastructure is denser than slice code). Don't over-pack: hook quality > feature velocity for this session. Read discipline: hooks surface the caps at turn 0; honour them.

## Negative constraints

1. **Do NOT** frame Decouple as a "financial disclosure tool." Spec 42 complete-settlement-workspace framing is load-bearing.
2. **Phase-C-freeze model RETIRED** (session 24, Option 4). No `phase-c` integration branch, no frozen main, no cutover event. Slice work on short-lived feature branches → PR → main. If user traffic arrives before Phase C completes, re-introduce freeze via new spec 71 §7a amendment; do not retrofit from pre-Option-4 strikethrough text.
3. **Do NOT** re-introduce any file from the wiped V1 tree (`src/components/workspace/*`, `src/components/interview/*`, etc.). If a slice believes it needs a V1 pattern, extract the pattern as a design doc and rebuild — don't copy-paste.
4. **Do NOT** re-open 68a-e locked decisions unless new evidence surfaces.
5. **Do NOT** read pre-pivot specs (03-06, 11, 12). Active framing: 42, 44, 65, 67, 68, 68a-g, 70, 71, 72.
6. **`NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` mandatory in Production** (spec 72 §2 + §7). CI gate enforces; runtime assertion throws on mismatch; `/app/dev/*` returns 404 in prod.
7. **Read discipline (honour on turn 1):** 300-line cap per turn · 3-Read cap per turn · offset/limit for specs >400 lines · grep/ls before Read · announce size before parallel batch.
8. **V1 legacy palette is gone.** Visual canonical = Claude AI Design tool outputs (session 22 wire batches). Airbnb / Emma / Habito + spec 18 palette + spec 27 all superseded.
9. **Safeguarding V1 = signposting + baseline** (spec 67 Gap 11, spec 72 §9). Detection / decoy / adaptive pacing = V1.5.
10. **Identity verification waits until consent-order stage** — not signup, not Settle signature (V1 = explicit attestation per 68f S-3).
11. **MLP not MVP** — scope decisions per slice framed as "what the *loveable* version requires vs what can iterate post-launch." Users are in crisis; loveable is the floor.
12. **AI extracts facts, app generates questions** — never put reasoning / clarification / gap analysis in AI extraction schemas. result-transformer.ts generates these via spec 13 trees.
13. **Anthropic SDK uses `output_config.format`** (not `response_format`). All JSON schemas need `additionalProperties: false`. SDK timeout 90s; route maxDuration 300s.
14. **No new CLAUDE.md rules in session 26** (per session-25 audit + reboot decision). The reboot is automation, not more rules. If a rule feels needed, capture as a handoff note or a hook spec — do not add to CLAUDE.md until S-F1 ships under new enforcement.
15. **Don't treat failing tests as spec.** A test that disagrees with shipped code is a signal, not a mandate. Verify which represents the current design decision (spec + user confirmation); the stale side is the artefact.
16. **Don't trust kickoff-prompt factual claims without live verification.** SessionStart hook surfaces live branch state; use it. Session 25 caught 3 brief-rot errors via verification.
17. **No slice work in session 26 until hooks land.** Shipping a slice under old enforcement would not be a clean test of the reboot.

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct.
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section — not full file — when building in that area):** spec 42 (positioning) · spec 44 (document-as-spine) · spec 68 hub + 68a-e phase locks · spec 70 Build Map suite · spec 71 rebuild strategy (§5/§7a amended) · spec 72 engineering security · `docs/engineering-phase-candidates.md` (§E/§F/§G still relevant).
- **Tier 4 (reference only, don't read proactively):** 68f / 68g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-{18,20-24}.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`. Consult before proposing new work to verify it's not already planned / deprioritised.

## Branch

Main is canonical (session 24 merged via PR #6 as squash `321fce8`; session 24 wrap PR merging this rewrite pending).

**Feature branch pattern (spec 71 §7a single-branch-main):**
- Off main: `git checkout main && git pull --ff-only && git checkout -b claude/S-XX-{slug}`
- Work → commit → push → PR → review → merge to main → delete feature branch
- Preview URL per branch: `construct-dev-git-{branch}-*.vercel.app`
- Never push direct to main (branch protection should enforce once configured).

**Pre-flight verify before starting slice work:** `git fetch origin main && git log origin/main -1`. Confirm tip is session 24 wrap merge (or later).

## Key files

```
Session orientation
CLAUDE.md                                          — Positioning + rules (Tier 1)
docs/SESSION-CONTEXT.md                            — THIS FILE (Tier 2)
docs/HANDOFF-SESSION-25.md                         — Latest retro (includes session-26 brief)
docs/HANDOFF-SESSION-24.md                         — Prior retro

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
docs/workspace-spec/68g-copy-share-opens.md        — C-U4..U6 + C-S5..S6 (C-U4 = session 25 P1)

Build Map (Tier 3)
docs/workspace-spec/70-build-map.md                — Hub + audit-integrated inventory
docs/workspace-spec/70-build-map-{start,build,reconcile,settle,finalise}.md
docs/workspace-spec/70-build-map-slices.md         — 33-slice catalogue

Phase C execution (Tier 3)
docs/workspace-spec/71-rebuild-strategy.md         — §5+§7a amended (Option 4: single-branch-main, V1 wiped)
docs/workspace-spec/72-engineering-security.md     — Engineering security principles
docs/engineering-phase-candidates.md               — §A/§B applied; §C/§D embodied in docs/slices/_template/

Per-slice scaffolding
docs/slices/README.md                              — Convention + workflow
docs/slices/_template/{acceptance,test-plan,security,verification}.md

Flow model (Tier 4 reference)
docs/workspace-spec/65-pre-signup-interview-reconciled.md  — → S-O1
docs/workspace-spec/67-post-signup-profiling-progress.md   — Slice-ownership map at end

CI + ops
.github/workflows/{ci,gitleaks}.yml                — 7-job CI + secrets scan (drafted; active on next PR)
.github/workflows/README.md                        — Spec refs + not-yet-wired + troubleshooting

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
docs/HANDOFF-SESSION-{18,20,21,22,23}.md           — Prior retros (top-level)
docs/v2/v2-backlog.md                              — 98-item backlog
```

## Session 26 pre-flight

1. **SessionStart hook should surface at turn 0** with read-discipline caps + live branch state. If it doesn't, user needs to open `/hooks` or restart Claude Code once to activate `.claude/settings.json` (created session 25). Verify hook output first.
2. **Claude loads `CLAUDE.md` + this file.** Do NOT batch-read Tier 3 specs — honour read discipline caps.
3. **Verify branch base** (redundant with hook, do anyway):
   ```
   git fetch origin main
   git log origin/main -1
   ```
   Confirm session-25 PR merge is present.
4. **Confirm with user:**
   - Did manual actions from session-25 HANDOFF get done? (Branch protection status checks 3.14; `/hooks` reload for settings watcher)
   - Any new rules added to CLAUDE.md since session 25? (Expected: no — moratorium applies.)
   - Still prioritising hook-based enforcement sprint, or reshuffle?
5. Open feature branch off main: `claude/session-26-hook-enforcement` (or split per-hook slices).
6. **Start P0.1 line-count hook.** Build → pipe-test → validate JSON → proof-it-fires via Edit. One hook at a time, fully verified.

**Session discipline reminders (automatically surfaced by hook; restated for belt-and-braces):**
- Honour Planning conduct rules from turn 1. Brief-rot in this file or in kickoff is possible — verify any factual claim against live source before building on it.
- Target ~1,500 lines. Earlier wrap trigger than session 24's ~2,700, slightly higher than session 25's ~120 because hook infrastructure is denser.
- **No new CLAUDE.md rules.** If a rule feels needed, capture as a handoff note; don't add to Tier 1.
- **No slice work before hooks land.** The reboot's test is shipping S-F1 (or C-U4 as fallback) under the new enforcement. Anything else muddies the signal.
- If hooks take longer than expected: ship what works, defer what doesn't, document the remainder. Hook quality > quantity.
