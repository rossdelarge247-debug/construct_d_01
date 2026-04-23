# Session 25 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 is authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a amended Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.

**Single-branch-main workflow** (spec 71 §7a amended session 24, Option 4): no `phase-c` integration branch, no cutover event. Slice work on short-lived feature branches (`claude/S-XX-{slug}`) → PR → main. Vercel prod rebuilds on every main merge; may show placeholder / partially-built state during rebuild — acceptable given no users. Tink credentials in Vercel env.

## What session 24 accomplished

**Design / engineering-foundation session. Ops scaffolding + V1 wipe. No functional slices shipped.**

- **PR #6 merged to main** (`321fce8`) — Phase C foundation: applied all session 23 + 24 content, retired Phase-C-freeze model (Option 4), wiped V1 wholesale, landed placeholder landing page. Net -7,700 LOC.
- **Spec 71 amended** — §5 bulk-removal replaces staged-per-slice; §7a Phase-C-freeze retired with rationale table (no-users = freeze has no purpose); original §7a retained as strikethrough for audit.
- **Spec 72 landed on main** — 11-section engineering security spec (T0-T5 classification, env vars, auth, RLS, validation, logging, dev/prod boundary, third-party, safeguarding, pen-test readiness, per-slice 13-item security DoD).
- **Spec 70 landed on main** — audit-integrated inventory (59-file classification); 33 slices including S-F7 dev-mode + S-M1 marketing.
- **Spec 67 slice-ownership map** landed on main — 6-layer profiling-question-to-slice table.
- **CLAUDE.md additions:** Coding conduct (think-before-code / simplicity / surgical / goal-driven) + Engineering conventions (TDD / adversarial review / snapshot / deterministic / 6-item DoD) + **Planning conduct** (verify before planning / quote don't paraphrase / plan-vs-spec cross-check / path options carry spec refs / distrust your summaries / read discipline — cadence rules).
- **`docs/slices/` scaffolding** — `_template/{acceptance,test-plan,security,verification}.md` + README. Slice kickoff becomes copy-paste.
- **`.github/workflows/`** drafts — `ci.yml` (7 jobs: lint/typecheck/test/build/env-var-regex-ban/dev-mode-leak/npm-audit), `gitleaks.yml`, README with spec refs + not-yet-wired + troubleshooting. Will run on first PR.
- **V1 wiped** — `src/components/workspace/*` (32 files), `src/components/interview/*`, `src/components/hub/title-bar.tsx`, `src/app/{features,pricing,start}/`, most of `src/app/workspace/`. Exceptions: `engine-workbench` (Re-use, moves at S-F7); `src/types/interview.ts` restored with deprecation note (4 Re-use/PWR consumers).
- **Planning conduct rules codified in real time** — derived from mid-session failure (endorsed Path A as "matching spec 71 §7a exactly" while actually contradicting it). Rule set is load-bearing meta-discipline for all future sessions.
- **Housekeeping:** HANDOFFs 2-17 archived to `docs/handoffs-archive/`; latest 5 remain top-level.
- **Post-wrap CI hotfix (PR #8, `979a254`)** — first CI run against PR #7 surfaced two false-positives in CI drafts I shipped. Env-var regex narrowed to drop `_KEY` (was catching legit public keys — `NEXT_PUBLIC_SUPABASE_ANON_KEY` RLS-gated, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` publishable, `NEXT_PUBLIC_POSTHOG_KEY` write-only — per spec 72 §2 inventory). Dev-mode leak scan narrowed to `@dev.decouple.local` + `decouple:dev:` only (dropped `dev-session|dev-store|dev-auth-gate` + scenario IDs — matched false positives in minified webpack paths). Spec 72 §2 hard rule 2 + §7 CI-gate text amended. Remaining CI failures (lint 13, unit test, npm audit 2, gitleaks) are pre-existing and land on session 25's P0.

See `docs/HANDOFF-SESSION-24.md` for detailed retro.

## Current state

### Locked (through session 24)

- **Sessions 19-22 foundational:** 5-phase model · four-document lifecycle · spec 68a-e phase locks · spec 68f session-21 register with session-22 locks applied · spec 68g trio (visual anchors, build opens, copy/share opens).
- **Session 23:** spec 71 rebuild strategy · spec 72 engineering security · spec 70 hub audit · spec 70 slices catalogue (S-F7 + S-M1 = 33 slices) · spec 67 slice-ownership map · engineering-phase-candidates (§A/§B applied, §C/§D embodied in slice templates, §E/§F/§G parked).
- **Session 24:** Phase C foundation merged to main · Phase-C-freeze retired (Option 4) · V1 wiped · CLAUDE.md has Coding conduct + Engineering conventions + Planning conduct + read-discipline rules · slice template scaffolding ready · CI drafts ready · HANDOFFs archived.

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

## Session 25 priorities

### P0 — Unblock + begin first slice

1. **Manual user actions** (confirm before first slice code work):
   - Vercel env-vars per spec 72 §2 (`NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` pinned in Production; audit Supabase naming — service role must NOT be `NEXT_PUBLIC_*`)
   - Supabase project with RLS default-deny
   - Branch protection on `main` (require CI checks pass)

2. **CI triage** (pre-existing failures exposed on first run of PR #7; PR #8 fixed the two I shipped):
   - `tests/unit/types.test.ts` expects 5-phase `WORKSPACE_PHASES` per spec 42; `src/constants/index.ts` still has 4-phase V1 keys. Update constants to five-phase (Start / Build / Reconcile / Settle / Finalise) — natural fix, unblocks the test.
   - `npm audit` — 2 high/critical; `npm audit fix` + review the criticals.
   - `lint` — 13 annotations across preserved code; triage (probably one rule hitting multiple files).
   - `gitleaks` — likely needs `GITLEAKS_LICENSE` secret or `.gitleaksignore`; diagnose first.

3. **S-F1 design system tokens** — first engineering slice. **Blocked pending Claude AI Design tool source files** from session 22 wire batches. User to share / confirm location. Once unblocked: feature branch `claude/S-F1-design-system` off main; slice kickoff copies `docs/slices/_template/` → `docs/slices/S-F1-design-system/` and fills in.

### P1 — Parallel doc work (not blocked)

**C-U4 disclosure-language copy audit.** ~12 surfaces in 68g-copy-share-opens. Output: single copy-pattern doc covering replacement vocabulary, banned words, empty-state verb family (resolves C-U5), stepper/nav unification (resolves C-U6), confirmation/attention/success/error tone templates. Blocks Phase C anchor extraction copy.

### P2 — Suggested infrastructure improvement

**SessionStart hook** for read-discipline reminder. Needs shell script + `settings.json` wiring via `session-start-hook` skill. Print at session start:
- Max 300 lines of combined tool-result content per turn
- Max 3 Read calls per turn
- Specs >400 lines: offset/limit always
- grep/ls for existence before Read

Deferred from session 24 (context pressure). Low effort, high durability.

### Scope ceiling

Target ≤1,000 lines changed this session (slice work is typically narrower than foundation work). Read-discipline rules in CLAUDE.md Planning conduct section are operational — honour on turn 1.

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
docs/HANDOFF-SESSION-24.md                         — Latest retro

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

## Session 25 pre-flight

1. Claude loads `CLAUDE.md` + this file. **Do NOT batch-read Tier 3 specs** — honour read discipline (cap 300 lines / 3 Reads per turn).
2. Verify branch base:
   ```
   git fetch origin main
   git log origin/main -1
   ```
   Confirm session 24 wrap merge is present.
3. **Confirm with user** what they want to focus on:
   - Did manual actions get done? (Vercel env vars, Supabase, branch protection, stale branch cleanup)
   - Are Claude AI Design tool source files available for S-F1?
   - Prefer P1 copy audit (no dependency) or wait for S-F1 unblock?
4. If S-F1 unblocked: create `claude/S-F1-design-system`, copy `docs/slices/_template/` into `docs/slices/S-F1-design-system/`, fill in AC with user review before implementation.
5. If S-F1 blocked: start P1 C-U4 disclosure-language copy audit.

**Session discipline reminders:**
- Honour Planning conduct rules from turn 1 (verify before planning · quote specs literally · plan-vs-spec cross-check · path options carry spec refs · distrust summaries · read discipline cadence).
- Target ~1,000 lines changed. Earlier wrap trigger than session 24's ~2,700.
- If major reframe surfaces early: diagnose, note, don't conflate "decide" with "execute" — sleep on big pivots.
