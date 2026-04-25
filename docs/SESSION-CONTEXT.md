# Session 32 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a amended Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches (`claude/S-XX-{slug}` or `claude/session-{N}-{scope}`) → PR → main. Tink credentials in Vercel env.

## What sessions 29–32 accomplished (rolling window)

**Session 29 — S-F1 design-system token foundation.** **First `src/`-touching slice of Phase C.** Shipped: 65 `--ds-*` CSS tokens in `src/app/globals.css` + typed TS mirror at `src/styles/tokens.ts` + Button reskin + imagery convention + parity test. **68g register flipped 🟠→🟢** for **C-V1** (phase colour system) and **C-V13** (phase accent-tint card washes). **`pr-dod.yml` positive-path canary passed in 4 seconds on first activation.** Merged as PR #14 (main tip `cc6fc76`). See `docs/HANDOFF-SESSION-29.md`.

**Session 30 — S-B-1 confirmation-questions copy-flip.** **Second `src/`-touching slice + first non-foundation slice.** Shipped: 12 catalogued Cat-A copy-flips in `src/lib/bank/confirmation-questions.ts` per spec 73 §1 + §3. Cat-B preserved verbatim per §2.4 exception. 22 vitest tests + Cat-B baseline fixture; boolean-wrapper assertion idiom introduced. **`pr-dod.yml` twice-clean.** Merged as PR #16 (main tip `5fa81a2`). See `docs/HANDOFF-SESSION-30.md`.

**Session 31 — S-B-2 recommendations copy-flip.** **Third `src/`-touching slice.** Shipped: 4 catalogued Cat-A copy-flips (A17–A20) in `src/lib/recommendations.ts` per spec 73 §1 + §2.4 exception (A17 boundary case: `'thorough disclosure'` retained with one-word `'formal'` anchor; A19 amended post-freeze from `'stronger'` adjective to `'strengthens'` verb form to preserve "the more X, the more Y" parallel — audit-catalogue row A19 amended in standalone commit). 12 vitest tests + Cat-B baseline fixture. **Test-helper lifted** to `tests/helpers/source-assertions.ts` (HANDOFF-30 candidate #4, second-use lift). **`pr-dod.yml` thrice-clean — continued stability.** TDD discussion mid-session surfaced "TDD vs regression-harness honesty" point + 3 CLAUDE.md candidate lifts (Behavioural over content · AC arithmetic check · Visual-direction Source files repo-committed). Slice merged as PR #18 (main tip `1e1c558`); wrap PR adds CLAUDE.md edits + this file refresh + HANDOFF-31. See `docs/HANDOFF-SESSION-31.md`.

**Session 32 — S-F7-α scaffolded + RED.** **Foundation slice — first non-copy-flip src/ slice + first sub-sliced (α/β/γ/δ).** Strategic re-orientation from copy-flip backlog to foundation work via spec 71 §510 + §8 line 507 re-read (S-F7 is hard prereq for user-facing flows, not for F2/F3/F4/F6). Sub-sliced S-F7 four ways with arithmetic check; α scope = 3 interfaces (Session, AuthGate, WorkspaceStore) + dev-mode adapters + 2 fixture scenarios + scenario URL switch + spec-72-§7-verbatim runtime assertion. **3 CLAUDE.md rules lifted pre-scaffolding** (8d4e9bd): Names carry the design · Small single-purpose functions · Effects behind interfaces (with spec 71 §4 hexagonal-architecture reference shape). Slice docs scaffolded (e079610: 567 lines across acceptance/test-plan/verification/security). 6 RED test files committed at `tests/unit/auth-*` + `tests/unit/store-*` (57ad5a5: 481 lines, 30 assertions, all import-resolution-fail = compile-time RED). `pnpm-lock.yaml` tracked (4ee5334) — was untracked despite not being gitignored; latent project gap caught by stop-hook. Verify-before-planning catches: (1) test path discrepancy `tests/unit/` vs template's `src/lib/__tests__/` corrected before tests written; (2) F7 dependency surface reframed via direct spec re-read. Vitest 4.x dropped `--reporter=basic` — caught + resolved. Slice **NOT yet GREEN**; impl + DoD + PR is session 33 work. Branch `claude/S-F7-alpha-contracts-dev-mode` 5-6 commits ahead of main (depending on wrap follow-ups). See `docs/HANDOFF-SESSION-32.md`.

## Current state

### Locked (through session 32)

- **Sessions 19-22 foundational:** 5-phase model · four-document lifecycle · spec 68a-e phase locks · spec 68f register with session-22 locks applied · spec 68g trio.
- **Sessions 23-24:** spec 71 rebuild strategy · spec 72 engineering security · spec 70 hub + 33-slice catalogue · spec 67 slice-ownership · Option 4 single-branch-main · V1 wiped · CLAUDE.md Coding/Engineering/Planning conduct.
- **Session 25:** CI triage Track A · confidence-taxonomy C-CF (3 states `known`/`estimated`/`unknown`) · SessionStart hook.
- **Session 26:** CI green on main (PR #10 merged 9/9).
- **Session 27:** Four enforcement hooks + PR template + DoD CI gate live on main (PR #12 merged). CLAUDE.md pruned + Key-files-extended.
- **Session 28:** C-U4/U5/U6 locked via spec 73 · slice-template + DoD + security-checklist first full exercise · S-C-U4 slice artefacts as reference pattern for downstream slices.
- **Session 29:** **C-V1 + C-V13 locked** via S-F1 · first src/-touching slice through enforcement stack · `pr-dod.yml` positive-path validated.
- **Session 30:** S-B-1 shipped — first non-foundation src/ slice; 12 Cat-A copy-flips in `src/lib/bank/confirmation-questions.ts`; boolean-wrapper assertion idiom introduced; `pr-dod.yml` twice-clean.
- **Session 31:** **S-B-2 shipped** — third src/ slice; 4 Cat-A copy-flips (A17–A20) in `src/lib/recommendations.ts`; A19 amended post-freeze (verb form); test-helper lifted to `tests/helpers/source-assertions.ts`; `pr-dod.yml` thrice-clean. **3 CLAUDE.md additions** lifted in wrap PR: §"Engineering conventions" — Don't write file-content assertions for logic slices · AC arithmetic check; §"Visual direction" — Source files repo-committed, not URL-fetched.
- **Session 32:** **S-F7-α scaffolded + RED'd** (NOT yet shipped) — first foundation src/ slice (auth + persistence abstraction); first sub-sliced (α/β/γ/δ); branch `claude/S-F7-alpha-contracts-dev-mode` 5-6 commits ahead of main; 6 RED test files at `tests/unit/auth-*` + `store-*` (compile-time RED via import-resolution-fail); slice docs scaffolded with 11 AC frozen; `pnpm-lock.yaml` tracked (was untracked latently). **3 CLAUDE.md additions** lifted pre-scaffolding (8d4e9bd): §"Coding conduct" — Names carry the design · Small single-purpose functions · Effects behind interfaces (spec 71 §4 hexagonal architecture).

### Open (see spec 68f + 68g registers for full list)

- **68f:** 10 🟢 locked, 17 🟠 open (downstream — R-1..6, S-1..3, F-1..5, C-X1, C-N1b, C-S1b).
- **68g-visual-anchors:** 12 open (C-V2..C-V12, C-V14); **C-V1 + C-V13 locked session 29 via S-F1**. Resolved as slices encounter each remaining anchor.
- **68g-build-opens:** 10 open (B-5..B-14).
- **68g-copy-share-opens:** 2 open (C-S5, C-S6). C-U4/U5/U6 locked session 28.
- **Spec 73 downstream:** 20 Cat-A strings in `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md` Part 2 (src/-level). 16 closed across S-B-1 (A1-A12) and S-B-2 (A17-A20); **4 remaining: A13-A16** in `discovery-flow.tsx`, `constants/index.ts` (×2), `use-workspace.ts`. Plus 14 wire-level Cat-A rows in Part 1 (session-22 wireframes; close as each surface is built — Welcome carousel, dashboard, etc.).

### Specced but NOT built

Four slices shipped (to main): S-C-U4 (docs-only, session 28) + **S-F1** (first `src/`-touching, session 29) + **S-B-1** (session 30) + **S-B-2** (session 31). **S-F7-α in flight** at end of session 32 (RED on `claude/S-F7-alpha-contracts-dev-mode`, NOT yet GREEN, NOT yet merged) — fifth slice once shipped. The remainder of spec 68 + 70 + 71 + 72 + 67 + 73 is still design-only. **28 of 33 catalogued slices remain unshipped + unstarted; 1 in flight (S-F7-α).** Spec 73 audit-catalogue src/-level Cat-A queue (Part 2): 20 rows total; S-B-1 closed A1-A12 (12) and S-B-2 closed A17-A20 (4); **4 remaining (A13-A16)** parked at session 32 (S-CF-tail deferred to end-of-Phase-C cleanup sweep). Plus 14 wire-level Cat-A rows in Part 1 (close as each surface ships).

**Naming clash to watch.** Spec 70 catalogue uses `S-B1, S-B2, S-B3...` (no hyphen) for Build-phase slices (Bank connection, Sarah's Picture, Dashboard, etc.). Our shipped copy-flip slices used `S-B-1, S-B-2` (hyphen) for Build-phase library copy-flips. Different things. Future copy-flip slices should use a non-conflicting prefix (e.g. `S-CF-N` for "copy-flip N") to avoid confusion. S-B-1 + S-B-2 names are now historical; not worth retroactively renaming.

### Built (on main as of `f454f9a`)

- **Stable libs:** `src/lib/{bank,ai,supabase,stripe,analytics,documents,recommendations}/*` · API routes · `src/types/{hub,index,workspace}.ts` · `src/hooks/*` · `src/constants/index.ts` · `src/utils/cn.ts`.
- **Preserve-with-reskin UI:** `src/components/ui/{button,card,badge}.tsx` · `src/components/layout/{header,footer,env-banner}.tsx` · `src/components/hub/{category-selector,discovery-flow,evidence-lozenge,hero-panel,section-cards,fidelity-label}.tsx`. **Button now consumes `--ds-*` (S-F1); other PWR components still on V1/V2 `@theme` palette pending their own reskin slices.**
- **Design system foundation (NEW session 29):** 65 `--ds-*` CSS tokens in `src/app/globals.css` `:root` block + typed TS mirror at `src/styles/tokens.ts` (exports `tokens`, `Tokens`, `TokenName`, `TOKEN_NAMES`).
- **Imagery convention (NEW session 29):** `public/images/{component-slug}/` per-component pattern + `public/images/README.md`.
- **Test infra:** `tests/unit/{types,tokens,confirmation-questions-copy,session-context-typo,recommendations-copy}.test.ts` (NEW session 31: recommendations-copy) · `tests/unit/fixtures/{confirmation-questions,recommendations}-cat-b-baseline.txt` · **`tests/helpers/source-assertions.ts`** (NEW session 31: typed factory for file-content boolean assertions) · `vitest.config.ts` · `tests/setup.ts`.
- **Legal placeholders:** `/privacy /terms /cookies` (still V1, pending legal review).
- **Landing placeholder:** `src/app/page.tsx` (rebuilding message; updated when S-M1 lands).
- **Dev tools:** `src/app/workspace/engine-workbench/page.tsx` (moves to `/app/dev/` at S-F7).
- **Exception:** `src/types/interview.ts` (deprecated; full delete blocked on S-O1).
- **CI + enforcement:** `ci.yml`, `gitleaks.yml`, `pr-dod.yml` · PR template · four enforcement hooks (line-count · read-cap · session-start · wrap-check).

## Session 33 priorities

### P0 — ship S-F7-α GREEN through DoD + PR open

Resume on existing branch `claude/S-F7-alpha-contracts-dev-mode` (5-6 commits ahead of main, depending on session-32 wrap follow-ups). AC frozen; tests RED committed; impl is the work.

**Realistic finish line:** GREEN tests + spec-72-§11 13-item security checklist + adversarial review (`/security-review` skill required — first logic+auth slice, deferred-skill experiment binds) + verification.md evidence backfill + PR opened with pr-dod.yml four-clean.

**Stretch:** PR merged to main.

**Implementation order** (per session-33 kickoff prompt at end of HANDOFF-32):
1. `src/lib/auth/{types,dev-session,dev-auth-gate,index}.ts`
2. Run `pnpm test tests/unit/auth-*.test.ts` → GREEN; commit
3. `src/lib/store/{types,dev-store,index,scenario-loader}.ts` + 2 fixture JSONs
4. Run `pnpm test tests/unit/store-*.test.ts` → GREEN; commit
5. Full suite + typecheck: `pnpm test && pnpm typecheck`
6. Fill `security.md` 13-item checklist
7. Adversarial review (manual sweep + `/security-review` skill)
8. Fill `verification.md` evidence
9. Open PR; verify pr-dod.yml four-clean

**Estimated impl churn:** ~400 authored lines (small files: types ~25 lines, dev-session ~50, dev-auth-gate ~25, auth/index ~40, store types ~10, dev-store ~80, store/index ~30, scenario-loader ~80, 2 JSONs ~40). Plus ~50 verification + ~50 security fills + iterations. Total realistic: 500-700 authored.

### P1 — none. Single-P0 session.

Session 32's strategic conversation took 6 turns; session 33 should be focused execution. If S-F7-α ships fast and there's slack, the only candidate stretch is S-CF-tail (4-row drain). But the priority is closing α cleanly, not adding a second slice.

### P2 — surface-level housekeeping

Three CLAUDE.md candidates surfaced session 32 (#9 vitest version-quirks, #10 lockfile policy, #11 compile-time RED pattern). All parked; revisit at session-33 wrap if any naturally exercised by the impl work. Don't lift mid-slice.

Carry-forward parked candidates (still pending): AUX-3 PWR drift check (HANDOFF-31) · #3 line-count.sh refined model · #7 tdd-guard hook spec.

### Stretch

Run `/review` skill on PR #14 (S-F1) retroactively. Still parked since session 29; consistently deprioritised. Probably close as "won't review retro" at next wrap.

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
14. **CLAUDE.md moratorium partially lifted session 31.** 3 candidates lifted (Don't write file-content assertions for logic slices · AC arithmetic check · Source files repo-committed). 2 candidates remain parked: `line-count.sh` refined model (#3 — needs one more session's data) and `tdd-guard` hook spec (#7 — implementation slot at next infra session). Continue capturing new candidates as HANDOFF notes; don't lift ad hoc within a slice session.
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

Main is canonical. Session 31 slice work lived on `claude/S-B-2-recommendations-copy-flip` (5 commits: scaffold + AC freeze · A19 amendment · RED · GREEN · slice docs; merged via PR #18 → squash-commit `1e1c558`); session-31 wrap on `claude/session-31-wrap` (this branch — adds HANDOFF-31 + 3 CLAUDE.md lifts + this refresh). Session 30 history: `claude/S-B-1-confirmation-questions-copy-flip` slice → PR #16 → `5fa81a2`; wrap on `claude/session-30-wrap` → PR #17.

**Pre-session-33 prerequisite:** none. Session 33 resumes on existing `claude/S-F7-alpha-contracts-dev-mode` (already pushed at end of session 32; 5-6 commits ahead of main). Do NOT branch off main again — slice is mid-flight.

**Feature branch pattern (spec 71 §7a single-branch-main):**
- Off main: `git checkout main && git pull --ff-only && git checkout -b claude/S-XX-{slug}` (slice) or `claude/session-{N}-{scope}` (session-scoped).
- Work → commit → push → PR → review → merge to main → delete branch.
- Preview URL per branch: `construct-dev-git-{branch}-*.vercel.app`.
- Never direct-push to main (branch protection should enforce once configured).

**Session 33 pre-flight verify:** `git fetch origin && git log origin/main -1` (expect `f454f9a` unchanged); `git log -5 --oneline` on the slice branch (expect 5-6 commits visible above main); `pnpm test tests/unit/auth-*.test.ts tests/unit/store-*.test.ts` (expect 6 import-resolution failures = compile-time RED).

## Key files

```
Session orientation
CLAUDE.md                                          — Positioning + rules (Tier 1)
docs/SESSION-CONTEXT.md                            — THIS FILE (Tier 2)
docs/HANDOFF-SESSION-31.md                         — Latest retro (S-B-2 · TDD discussion · 3 CLAUDE.md lifts)
docs/HANDOFF-SESSION-30.md                         — S-B-1 confirmation-questions copy-flip retro
docs/HANDOFF-SESSION-29.md                         — S-F1 design tokens retro (first src/ slice)
docs/HANDOFF-SESSION-28.md                         — S-C-U4 disclosure-audit retro
docs/HANDOFF-SESSION-27.md                         — Hook-sprint retro

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
docs/slices/S-C-U4-disclosure-audit/               — Session 28 docs-only reference pattern
  acceptance.md · audit-catalogue.md · test-plan.md · security.md · verification.md
docs/slices/S-F1-design-tokens/                    — Session 29 first src/-touching reference pattern
  acceptance.md · test-plan.md · security.md · verification.md

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

Design system foundation (NEW session 29 — S-F1)
src/app/globals.css                                 — :root block of 65 --ds-* tokens (alongside V1/V2 @theme)
src/styles/tokens.ts                                — Typed mirror: tokens, Tokens, TokenName, TOKEN_NAMES
public/images/README.md                             — Imagery convention; per-component sub-folder pattern
tests/unit/tokens.test.ts                           — Parity test: globals.css ↔ tokens.ts

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
docs/HANDOFF-SESSION-{18,20,21,22,23,24,25,26,27,28,29}.md  — Prior retros (top-level)
docs/v2/v2-backlog.md                              — 98-item backlog
```

## Session 33 pre-flight

1. **SessionStart hook fires at turn 0** surfacing read-discipline + Planning conduct + live branch state. Verify it appears.
2. **Claude loads `CLAUDE.md` + this file.** CLAUDE.md gained 3 new rules in session 32's wrap commit `8d4e9bd` (Names carry the design · Small single-purpose functions · Effects behind interfaces). They are now load-bearing for S-F7-α impl — note them at session start.
3. **Verify branch state:**
   ```
   git fetch origin
   git log origin/main -1                                  # expect f454f9a
   git log -5 --oneline                                    # expect 5-6 commits ahead
   pnpm test tests/unit/auth-*.test.ts tests/unit/store-*.test.ts  # expect 6 RED via import-fail
   ```
   If main moved beyond `f454f9a`, may need rebase before impl. If branch is missing commits, check stop-hook history for an unpushed commit.
4. **Confirm with user (4 pre-flight Qs from session-32 kickoff prompt):**
   - Approve task order auth-then-store?
   - `/security-review` skill timing — end-of-slice or per-layer?
   - Lockfile keep tracked (committed at `4ee5334`) or revert + gitignore?
   - PR strategy — open mid-session after GREEN (review window) or open at end?
5. **Resume on existing branch** — do NOT re-branch off main. Slice is mid-flight at RED state.
6. **First actions:**
   - Read `docs/slices/S-F7-alpha-contracts-dev-mode/acceptance.md` in full (~185 lines) — the contract.
   - Read the 6 RED test files at `tests/unit/auth-*.test.ts` + `tests/unit/store-*.test.ts` — the functional contract.
   - Then implement in order: types → dev-session → dev-auth-gate → auth/index → run auth tests → commit; then types → dev-store → store/index → 2 scenarios → scenario-loader → run store tests → commit.

**Session discipline (hook-surfaced; restated):**
- Honour Planning conduct from turn 1. Brief-rot in this file is possible — live-verify factual claims.
- Target ~1,500 lines. Hook warns at 1,000 / 1,500 / 2,000. **Note from session 32:** lockfile commits inflate the count by 5,556 lines once tracked — that's already paid for; session 33 churn is authored impl + DoD docs only.
- **CLAUDE.md moratorium partially lifted sessions 31 + 32.** 6 new rules live across both; 5 candidates parked (#3 line-count refined model · #7 tdd-guard hook spec · #9 vitest version-quirks · #10 lockfile policy · #11 compile-time-RED documentation · AUX-3 PWR drift check). Continue capturing new candidates as HANDOFF notes; don't lift ad hoc within a slice session.
- **Honour the 6-item DoD + 13-item security checklist.** S-F7-α will be the **fourth** positive-path activation of `pr-dod.yml`.
- **Long-prose Writes: use skeleton + Edit-append.** Default for docs >~150 lines of structured prose. HANDOFF-32 used skeleton-then-7-Edits pattern after a stream-idle-timeout caught mid-write.
- **`line-count.sh` refined model (still not clean):** session 32 didn't generate clean data — most Writes targeted untracked files. Carries forward to session 33.
- **Behavioural-test discipline:** S-F7-α's 6 test files are all behavioural per the rule lifted session 31. Don't introduce file-content assertions during impl unless the unit is genuinely a pure-string slice.
