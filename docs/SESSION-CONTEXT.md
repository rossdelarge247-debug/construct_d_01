# Session 32 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a amended Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches (`claude/S-XX-{slug}` or `claude/session-{N}-{scope}`) → PR → main. Tink credentials in Vercel env.

## What sessions 28–31 accomplished (rolling window)

**Session 28 — S-C-U4 disclosure-language audit slice.** First slice under the new enforcement stack. Docs-only by design per 68g C-U4 line 29. Shipped: `docs/workspace-spec/73-copy-patterns.md` (344 lines), `docs/slices/S-C-U4-disclosure-audit/`, 68g-copy-share-opens.md C-U4/U5/U6 flipped 🟠→🟢. Merged as PR #13 (main tip `30beb16`). See `docs/HANDOFF-SESSION-28.md`.

**Session 29 — S-F1 design-system token foundation.** **First `src/`-touching slice of Phase C.** Shipped: 65 `--ds-*` CSS tokens in `src/app/globals.css` + typed TS mirror at `src/styles/tokens.ts` + Button reskin + imagery convention + parity test. **68g register flipped 🟠→🟢** for **C-V1** (phase colour system) and **C-V13** (phase accent-tint card washes). **`pr-dod.yml` positive-path canary passed in 4 seconds on first activation.** Merged as PR #14 (main tip `cc6fc76`). See `docs/HANDOFF-SESSION-29.md`.

**Session 30 — S-B-1 confirmation-questions copy-flip.** **Second `src/`-touching slice + first non-foundation slice.** Shipped: 12 catalogued Cat-A copy-flips in `src/lib/bank/confirmation-questions.ts` per spec 73 §1 + §3. Cat-B preserved verbatim per §2.4 exception. 22 vitest tests + Cat-B baseline fixture; boolean-wrapper assertion idiom introduced. **`pr-dod.yml` twice-clean.** Merged as PR #16 (main tip `5fa81a2`). See `docs/HANDOFF-SESSION-30.md`.

**Session 31 — S-B-2 recommendations copy-flip.** **Third `src/`-touching slice.** Shipped: 4 catalogued Cat-A copy-flips (A17–A20) in `src/lib/recommendations.ts` per spec 73 §1 + §2.4 exception (A17 boundary case: `'thorough disclosure'` retained with one-word `'formal'` anchor; A19 amended post-freeze from `'stronger'` adjective to `'strengthens'` verb form to preserve "the more X, the more Y" parallel — audit-catalogue row A19 amended in standalone commit). 12 vitest tests + Cat-B baseline fixture. **Test-helper lifted** to `tests/helpers/source-assertions.ts` (HANDOFF-30 candidate #4, second-use lift). **`pr-dod.yml` thrice-clean — continued stability.** TDD discussion mid-session surfaced "TDD vs regression-harness honesty" point + 3 CLAUDE.md candidate lifts (Behavioural over content · AC arithmetic check · Visual-direction Source files repo-committed). Slice merged as PR #18 (main tip `1e1c558`); wrap PR adds CLAUDE.md edits + this file refresh + HANDOFF-31. See `docs/HANDOFF-SESSION-31.md`.

## Current state

### Locked (through session 31)

- **Sessions 19-22 foundational:** 5-phase model · four-document lifecycle · spec 68a-e phase locks · spec 68f register with session-22 locks applied · spec 68g trio.
- **Sessions 23-24:** spec 71 rebuild strategy · spec 72 engineering security · spec 70 hub + 33-slice catalogue · spec 67 slice-ownership · Option 4 single-branch-main · V1 wiped · CLAUDE.md Coding/Engineering/Planning conduct.
- **Session 25:** CI triage Track A · confidence-taxonomy C-CF (3 states `known`/`estimated`/`unknown`) · SessionStart hook.
- **Session 26:** CI green on main (PR #10 merged 9/9).
- **Session 27:** Four enforcement hooks + PR template + DoD CI gate live on main (PR #12 merged). CLAUDE.md pruned + Key-files-extended.
- **Session 28:** C-U4/U5/U6 locked via spec 73 · slice-template + DoD + security-checklist first full exercise · S-C-U4 slice artefacts as reference pattern for downstream slices.
- **Session 29:** **C-V1 + C-V13 locked** via S-F1 · first src/-touching slice through enforcement stack · `pr-dod.yml` positive-path validated.
- **Session 30:** S-B-1 shipped — first non-foundation src/ slice; 12 Cat-A copy-flips in `src/lib/bank/confirmation-questions.ts`; boolean-wrapper assertion idiom introduced; `pr-dod.yml` twice-clean.
- **Session 31:** **S-B-2 shipped** — third src/ slice; 4 Cat-A copy-flips (A17–A20) in `src/lib/recommendations.ts`; A19 amended post-freeze (verb form); test-helper lifted to `tests/helpers/source-assertions.ts`; `pr-dod.yml` thrice-clean. **3 CLAUDE.md additions** lifted in wrap PR: §"Engineering conventions" — Don't write file-content assertions for logic slices · AC arithmetic check; §"Visual direction" — Source files repo-committed, not URL-fetched.

### Open (see spec 68f + 68g registers for full list)

- **68f:** 10 🟢 locked, 17 🟠 open (downstream — R-1..6, S-1..3, F-1..5, C-X1, C-N1b, C-S1b).
- **68g-visual-anchors:** 12 open (C-V2..C-V12, C-V14); **C-V1 + C-V13 locked session 29 via S-F1**. Resolved as slices encounter each remaining anchor.
- **68g-build-opens:** 10 open (B-5..B-14).
- **68g-copy-share-opens:** 2 open (C-S5, C-S6). C-U4/U5/U6 locked session 28.
- **Spec 73 downstream:** 35 Cat-A strings in `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md` queued for per-surface copy-flip slices.

### Specced but NOT built

Four slices shipped: S-C-U4 (docs-only, session 28) + **S-F1** (first `src/`-touching, session 29) + **S-B-1** (first non-foundation `src/`, session 30) + **S-B-2** (session 31). The remainder of spec 68 + 70 + 71 + 72 + 67 + 73 is still design-only. **29 of 33 catalogued slices remain unshipped.** Spec 73 audit-catalogue Cat-A queue: 35 rows total; S-B-1 closed 12, S-B-2 closed 4, **19 Cat-A rows remaining** distributed across `discovery-flow.tsx` (A13), `constants/index.ts` (A14, A15), `use-workspace.ts` (A16), and `result-transformer.ts` (multiple). Session 32 P0 candidate: `S-B-3-result-transformer-copy-flip` — largest remaining cluster; first slice to test the new "Don't write file-content assertions for logic slices" rule (result-transformer is computational, so behavioural tests required).

### Built (on main as of `1e1c558`)

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

## Session 32 priorities

### P0 — S-B-3 result-transformer copy-flip (suggested)

`src/lib/ai/result-transformer.ts` carries the largest remaining Cat-A cluster (audit-catalogue Cat-B section explicitly lists 5+ legal-process retentions in this file at lines 31, 337, 1362, 430, 921, 1021 — Cat-A rows are interspersed). Ships spec 73 vocabulary into a third logic file. **First slice that tests the new "Don't write file-content assertions for logic slices" CLAUDE.md rule** — `result-transformer.ts` is computational (spec 13 decision trees + spec 19 keyword lookup), so the slice should mix **behavioural tests** (invoke transformer with synthetic inputs, assert on returned objects) with **file-content tests** for the pure-string Cat-A rows. Pre-flight: enumerate Cat-A rows in this file from audit-catalogue Part 2 before AC freeze. Confirm priority at session-32 kickoff.

### P1 — Welcome carousel slice (parallel candidate, unchanged from session 31)

Still unblocked by S-F1 tokens. Consumes `--ds-color-phase-*`, `--ds-shadow-phase-*`, `--ds-font-serif`, `--ds-type-{62,72}` (hero display sizes). Ships actual prototype copy + imagery (user explicitly wanted preserved per session-29 design-source conversation). Image extraction: the welcome-tour HTML at `docs/design-source/welcome-tour/Welcome Tour - Standalone.html` has inline base64 images embeddable; carousel slice's AC drafts to specific image filenames + alt text per slide before extraction. Slot in spec 70 catalogue (candidate ID: `S-O-3-welcome-carousel`).

### P2 — Calibration completion + tdd-guard hook spec

Two threads carried forward from HANDOFF-31 §"CLAUDE.md candidate additions status":

1. **`line-count.sh` refined-model confirmation.** Session 31 data was inconsistent — first-Write anomaly fired on `acceptance.md` (92 → +398, 4.3×) but did NOT fire on `source-assertions.ts` (24 → +23) or `HANDOFF-SESSION-31.md` (107 → +107). Need another session to isolate the trigger. If still inconsistent, close candidate #3 as "intentional inconsistency we live with".
2. **`tdd-guard` hook spec.** Parked as candidate #7 from session 31 (sourced from external TDD reading). PreToolUse hook on Write/Edit to `src/` that runs the affected test file and refuses on RED. Implementation slot at next infra session — analogous to session-27 hook sprint. Spec inputs needed: src→test-file mapping; full-suite-vs-scoped; failure UX. Don't implement ad hoc within a slice session.

### Stretch

Run `/review` skill on PR #14 (S-F1) retroactively as a backfill second-opinion. Still parked since session 29; closing the loop on the adversarial gate.

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

**Pre-session-32 prerequisite:** merge this wrap branch to main. Open PR. Once merged, session 32 branches off the updated main per spec 71 §7a single-branch-main.

**Feature branch pattern (spec 71 §7a single-branch-main):**
- Off main: `git checkout main && git pull --ff-only && git checkout -b claude/S-XX-{slug}` (slice) or `claude/session-{N}-{scope}` (session-scoped).
- Work → commit → push → PR → review → merge to main → delete branch.
- Preview URL per branch: `construct-dev-git-{branch}-*.vercel.app`.
- Never direct-push to main (branch protection should enforce once configured).

**Session 32 pre-flight verify:** `git fetch origin main && git log origin/main -1`. Confirm session-31 wrap PR is merged (tip should be ahead of `1e1c558`).

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

## Session 32 pre-flight

1. **SessionStart hook fires at turn 0** surfacing read-discipline + Planning conduct + live branch state. Verify it appears.
2. **Claude loads `CLAUDE.md` + this file.** Don't batch-read Tier 3 specs — read-cap hook enforces. CLAUDE.md gained 3 new rules in session 31's wrap PR — read them at session-start.
3. **Verify main is ahead of `1e1c558`** — session-31 wrap PR should be merged:
   ```
   git fetch origin main
   git log origin/main -1
   ```
   If main is still at `1e1c558`, the wrap PR is unmerged — merge first, or note the miss.
4. **Confirm with user:**
   - S-B-3 result-transformer copy-flip P0 confirmed, or reshuffle to welcome carousel (P1)?
   - `tdd-guard` hook implementation (parked candidate #7): this session, or hold for next dedicated infra slot?
   - `line-count.sh` calibration: if data still inconsistent after this session, close candidate #3 as "intentional" or hold?
   - Run `/review` skill on PR #14 (S-F1) retroactively — still parked since session 29; still skip, or run now?
5. **Open feature branch off main:** `claude/S-B-3-result-transformer-copy-flip` (or whatever slice the user picks) per spec 71 §7a.
6. **First actions on S-B-3 (if confirmed P0):**
   - Enumerate Cat-A rows in `src/lib/ai/result-transformer.ts` from audit-catalogue Part 2 before AC freeze — count was not pre-catalogued in audit-catalogue summary (Cat-B side has 5+ rows in this file; Cat-A side needs a fresh grep).
   - Re-read `docs/workspace-spec/73-copy-patterns.md` §1 + §2.4 exception policy.
   - Scaffold `docs/slices/S-B-3-result-transformer-copy-flip/` from `docs/slices/_template/` + draft AC before any `src/` edit.
   - **First slice testing the new "Don't write file-content assertions for logic slices" rule.** Result-transformer is computational (spec 13 trees + spec 19 keyword lookup), so the slice should mix behavioural tests (invoke transformer with synthetic inputs, assert on returned objects) with file-content tests for the pure-string Cat-A rows. Use `tests/helpers/source-assertions.ts` for the file-content portion; design synthetic-input fixtures for the behavioural portion.
   - `wc -l src/lib/ai/result-transformer.ts` first; use targeted Reads with offset+limit per audit-catalogue line numbers.

**Session discipline (hook-surfaced; restated):**
- Honour Planning conduct from turn 1. Brief-rot in this file is possible — live-verify factual claims.
- Target ~1,500 lines. Hook warns at 1,000 / 1,500 / 2,000.
- **CLAUDE.md moratorium partially lifted session 31.** 3 new rules live; 2 candidates parked (#3 line-count refined model · #7 tdd-guard hook spec). Continue capturing new candidates as HANDOFF notes; don't lift ad hoc within a slice session.
- **Honour the 6-item DoD + 13-item security checklist.** S-B-3 will be the **fourth** positive-path activation of `pr-dod.yml`.
- **Long-prose Writes: use skeleton + Edit-append.** Default for docs >~150 lines of structured prose. HANDOFF-31 (107 lines) shipped via single Write without skeleton — under threshold.
- **`line-count.sh` refined model (still not clean):** modified-line × 2 per single-line tracked Edit confirmed; first-Write-on-newly-tracked-file anomaly fires inconsistently across session 31 data points. Use `git diff --numstat` for net delta.
