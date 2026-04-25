# Session 35 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a amended Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches (`claude/S-XX-{slug}` or `claude/session-{N}-{scope}`) → PR → main. Tink credentials in Vercel env.

## What sessions 31–34 accomplished (rolling window)

**Session 31 — S-B-2 recommendations copy-flip.** Third `src/`-touching slice; 4 Cat-A copy-flips (A17–A20) in `src/lib/recommendations.ts` per spec 73 §1 + §2.4. Test-helper lifted to `tests/helpers/source-assertions.ts` (HANDOFF-30 candidate #4, second-use). 3 CLAUDE.md lifts (Behavioural over content · AC arithmetic check · Source files repo-committed). Merged PR #18 (`1e1c558`). See `docs/HANDOFF-SESSION-31.md`.

**Session 32 — S-F7-α scaffolded + RED.** Foundation slice — first non-copy-flip src/ slice + first sub-sliced (α/β/γ/δ). Sub-sliced S-F7 with arithmetic check; α scope = 3 interfaces + dev-mode adapters + 2 fixture scenarios + scenario URL switch + spec-72-§7-verbatim runtime assertion. 3 CLAUDE.md lifts (Names carry the design · Small single-purpose functions · Effects behind interfaces). 6 RED test files; impl deferred to 33. See `docs/HANDOFF-SESSION-32.md`.

**Session 33 — S-F7-α shipped GREEN + PR opened.** Recovery from harness branch-create bug (orphan suffixed branch). Implemented 4 src/lib/auth/*.ts + 6 src/lib/store/* files. Per-layer `/security-review` caught 1 MEDIUM (`loadScenario("__proto__")` prototype-chain bypass) fixed in-slice with `Object.hasOwn` + `try/finally` + parametrised regressions. 81/81 GREEN. PR #20 opened with full DoD ticked. See `docs/HANDOFF-SESSION-33.md`.

**Session 34 — PR #20 merged + S-TOOL-1 shipped GREEN through PR.** Harness suffix-orphan recurred (occurrence 2). Resynced. Merged PR #20 → main tip `5d38f6d`. Branched off new main as `claude/S-TOOL-1-line-count-branch-resume`. **Tooling slice:** fixed `line-count.sh` measure-vs-main inflation (now reads session-base SHA written by `session-start.sh` at turn 0; falls back to `origin/main` gracefully); added harness branch-resume detection in `session-start.sh` (suffixed branch + canonical-on-origin → resync recipe surfaced at turn 0). 11 new vitest tests via `child_process.execSync` against synthetic git fixtures. **CLAUDE.md candidate #12 (Branch-resume check) lifted** into Planning conduct § after second clean use. 92/92 tests GREEN. PR #21 opened with full DoD ticked, 10/10 CI green. See `docs/HANDOFF-SESSION-34.md`.

## Current state

### Locked (through session 34)

- **Sessions 19-22 foundational:** 5-phase model · four-document lifecycle · spec 68a-e phase locks · spec 68f register with session-22 locks applied · spec 68g trio.
- **Sessions 23-24:** spec 71 rebuild strategy · spec 72 engineering security · spec 70 hub + 33-slice catalogue · spec 67 slice-ownership · Option 4 single-branch-main · V1 wiped · CLAUDE.md Coding/Engineering/Planning conduct.
- **Session 25:** CI triage Track A · confidence-taxonomy C-CF (3 states `known`/`estimated`/`unknown`) · SessionStart hook.
- **Session 26:** CI green on main (PR #10 merged 9/9).
- **Session 27:** Four enforcement hooks + PR template + DoD CI gate live on main (PR #12 merged). CLAUDE.md pruned + Key-files-extended.
- **Session 28:** C-U4/U5/U6 locked via spec 73 · slice-template + DoD + security-checklist first full exercise · S-C-U4 slice artefacts as reference pattern for downstream slices.
- **Session 29:** **C-V1 + C-V13 locked** via S-F1 · first src/-touching slice through enforcement stack · `pr-dod.yml` positive-path validated.
- **Session 30:** S-B-1 shipped — first non-foundation src/ slice; 12 Cat-A copy-flips in `src/lib/bank/confirmation-questions.ts`; boolean-wrapper assertion idiom introduced; `pr-dod.yml` twice-clean.
- **Session 31:** **S-B-2 shipped** — third src/ slice; 4 Cat-A copy-flips (A17–A20) in `src/lib/recommendations.ts`; A19 amended post-freeze (verb form); test-helper lifted to `tests/helpers/source-assertions.ts`; `pr-dod.yml` thrice-clean. **3 CLAUDE.md additions** lifted in wrap PR: §"Engineering conventions" — Don't write file-content assertions for logic slices · AC arithmetic check; §"Visual direction" — Source files repo-committed, not URL-fetched.
- **Session 32:** **S-F7-α scaffolded + RED'd** (NOT yet shipped) — first foundation src/ slice; first sub-sliced (α/β/γ/δ); 6 RED test files; 11 AC frozen. **3 CLAUDE.md additions** lifted pre-scaffolding (8d4e9bd): Names carry the design · Small single-purpose functions · Effects behind interfaces.
- **Session 33:** **S-F7-α shipped GREEN through DoD; PR #20 open** — 81/81 tests GREEN; per-layer `/security-review` caught 1 MEDIUM (`loadScenario("__proto__")` bypass) fixed in-slice; 13-item security checklist + verification.md filled at `ccc6e4f`. 3 new candidates flagged for second-use verification (#12 Branch-resume check · #13 PR-by-session-end-or-resume-doc · #14 origin/HEAD set as session-start prereq).
- **Session 34:** **PR #20 merged (main `5d38f6d`); S-TOOL-1 shipped + PR #21 open.** Harness suffix-orphan recurred (occurrence 2 of #12). Tooling slice fixed `line-count.sh` measure-vs-main inflation (session-base SHA captured at turn 0 by `session-start.sh`, line-count diffs against that with `origin/main` fallback) and added harness branch-resume detection (suffixed branch + canonical-on-origin → resync recipe surfaced at turn 0). 11 new vitest hook tests; full suite **92/92 GREEN**. **CLAUDE.md #12 (Branch-resume check) lifted** into Planning conduct § (second clean use). PR #21 OPEN at `413c547` with 10/10 CI green, 0 reviews/comments. **Vercel preview "Error" pre-existing** across PR #20 + #21 (Stripe SDK API mismatch in `src/lib/stripe/client.ts:25` per HANDOFF-33 — not blocking).

### Open (see spec 68f + 68g registers for full list)

- **68f:** 10 🟢 locked, 17 🟠 open (downstream — R-1..6, S-1..3, F-1..5, C-X1, C-N1b, C-S1b).
- **68g-visual-anchors:** 12 open (C-V2..C-V12, C-V14); **C-V1 + C-V13 locked session 29 via S-F1**. Resolved as slices encounter each remaining anchor.
- **68g-build-opens:** 10 open (B-5..B-14).
- **68g-copy-share-opens:** 2 open (C-S5, C-S6). C-U4/U5/U6 locked session 28.
- **Spec 73 downstream:** 20 Cat-A strings in `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md` Part 2 (src/-level). 16 closed across S-B-1 (A1-A12) and S-B-2 (A17-A20); **4 remaining: A13-A16** in `discovery-flow.tsx`, `constants/index.ts` (×2), `use-workspace.ts`. Plus 14 wire-level Cat-A rows in Part 1 (session-22 wireframes; close as each surface is built — Welcome carousel, dashboard, etc.).

### Specced but NOT built

Five slices shipped to main: S-C-U4 (docs-only, session 28) + **S-F1** (session 29) + **S-B-1** (session 30) + **S-B-2** (session 31) + **S-F7-α** (session 34, PR #20 squashed at `5d38f6d`). **S-TOOL-1 GREEN + DoD-complete in PR #21** at session-34 wrap (3 commits ahead of main on `claude/S-TOOL-1-line-count-branch-resume` after handoff commit; awaiting reviewer sign-off + merge) — sixth slice once merged. The remainder of spec 68 + 70 + 71 + 72 + 67 + 73 is still design-only. **28 of 33 catalogued slices remain unshipped + unstarted; 1 tooling slice in PR-review (S-TOOL-1, non-catalogue prefix).** Spec 73 audit-catalogue src/-level Cat-A queue (Part 2): 20 rows total; S-B-1 closed A1-A12 (12) and S-B-2 closed A17-A20 (4); **4 remaining (A13-A16)** parked (S-CF-tail deferred to end-of-Phase-C cleanup sweep). Plus 14 wire-level Cat-A rows in Part 1.

**Naming clash to watch.** Spec 70 catalogue uses `S-B1, S-B2, S-B3...` (no hyphen) for Build-phase slices (Bank connection, Sarah's Picture, Dashboard, etc.). Our shipped copy-flip slices used `S-B-1, S-B-2` (hyphen) for Build-phase library copy-flips. Different things. Future copy-flip slices should use a non-conflicting prefix (e.g. `S-CF-N` for "copy-flip N") to avoid confusion. S-B-1 + S-B-2 names are now historical; not worth retroactively renaming.

### Built (on main as of `5d38f6d`; **S-TOOL-1 additions are on branch `claude/S-TOOL-1-line-count-branch-resume` HEAD `413c547`, not yet on main pending PR #21 merge**)

- **Stable libs:** `src/lib/{bank,ai,supabase,stripe,analytics,documents,recommendations}/*` · API routes · `src/types/{hub,index,workspace}.ts` · `src/hooks/*` · `src/constants/index.ts` · `src/utils/cn.ts`.
- **Preserve-with-reskin UI:** `src/components/ui/{button,card,badge}.tsx` · `src/components/layout/{header,footer,env-banner}.tsx` · `src/components/hub/{category-selector,discovery-flow,evidence-lozenge,hero-panel,section-cards,fidelity-label}.tsx`. **Button now consumes `--ds-*` (S-F1); other PWR components still on V1/V2 `@theme` palette pending their own reskin slices.**
- **Design system foundation (NEW session 29):** 65 `--ds-*` CSS tokens in `src/app/globals.css` `:root` block + typed TS mirror at `src/styles/tokens.ts` (exports `tokens`, `Tokens`, `TokenName`, `TOKEN_NAMES`).
- **Imagery convention (NEW session 29):** `public/images/{component-slug}/` per-component pattern + `public/images/README.md`.
- **Test infra:** `tests/unit/{types,tokens,confirmation-questions-copy,session-context-typo,recommendations-copy}.test.ts` · `tests/unit/fixtures/{confirmation-questions,recommendations}-cat-b-baseline.txt` · **`tests/helpers/source-assertions.ts`** (session 31) · `vitest.config.ts` · `tests/setup.ts`. **Auth + store tests (now on main via S-F7-α):** `tests/unit/{auth-dev-auth-gate,auth-dev-session,auth-index,store-dev-store,store-index,store-scenario-loader}.test.ts` (40 tests). **NEW on branch (PR #21 pending merge):** `tests/unit/{hooks-line-count,hooks-session-start}.test.ts` (11 tests, child_process.execSync against synthetic git fixtures).
- **Auth + persistence abstraction (NEW on main via S-F7-α):** `src/lib/auth/{types,dev-session,dev-auth-gate,index}.ts` · `src/lib/store/{types,dev-store,index,scenario-loader}.ts` · `src/lib/store/scenarios/{cold-sarah,sarah-mid-build}.json`. Hexagonal architecture per spec 71 §4. β/γ/δ deferred per AC sub-slice table.
- **Hook self-correction (NEW on branch, PR #21 pending merge):** `.claude/hooks/line-count.sh` reads session-base SHA from `/tmp/claude-base-${SESSION_ID}.txt` (graceful fallback to `origin/main`); `.claude/hooks/session-start.sh` writes that file at turn 0 idempotently AND surfaces a `### Branch-resume check` warning when the current branch matches `^claude/.+-[A-Za-z0-9]{5}$` and the canonical non-suffixed branch exists on origin.
- **Legal placeholders:** `/privacy /terms /cookies` (still V1, pending legal review).
- **Landing placeholder:** `src/app/page.tsx` (rebuilding message; updated when S-M1 lands).
- **Dev tools:** `src/app/workspace/engine-workbench/page.tsx` (moves to `/app/dev/` at S-F7).
- **Exception:** `src/types/interview.ts` (deprecated; full delete blocked on S-O1).
- **CI + enforcement:** `ci.yml`, `gitleaks.yml`, `pr-dod.yml` · PR template · four enforcement hooks (line-count · read-cap · session-start · wrap-check).

## Session 35 priorities

### P0 candidates — user picks at kickoff

Pre-flight Q1 binds the rest. Five main paths:

**Path A — S-F7-β (dev surface routes + env banner reskin).** Builds directly on α (now merged). `/app/dev/*` route group, dev banner reskin, scenario picker UI, 6 more fixture scenarios. β unblocks visual verification of dev mode and lets future slices browser-test against fixtures. Recommended.

**Path B — S-F2 (or another F-series foundation slice).** Now α + tooling stable, F-series can build cleanly. User picks which F-slice next per spec 71 §8.

**Path C — S-CF-tail (4-row drain).** A13-A16 in `discovery-flow.tsx` / `constants/index.ts` ×2 / `use-workspace.ts`. Fast (1 short session). Drains spec 73 Cat-A queue.

**Path D — S-INFRA-1 (Stripe SDK pin or upgrade).** Fixes the Vercel preview-error pattern across PRs #20 + #21 (and now likely #21's successor PRs). Small slice (~50-100 lines), foundational stability. Surface area: `src/lib/stripe/client.ts:25`.

**Path E — CLAUDE.md candidate lift session.** #14 (origin/HEAD set in session-start.sh) is at occurrence 2 — lift trigger ready. Bundle with #3 re-evaluation (line-count refined model — now potentially redundant after S-TOOL-1) + #13 re-evaluation (PR-by-session-end — now potentially redundant after #12 lift). Tooling/discipline slice.

**Path F — S-TOOL-2 (long-prose Write protection + SESSION-CONTEXT refresh slash command).** Bundles three things, all surfaced session 34 on the streaming-idle-timeout diagnosis: (1) **PreToolUse hook on Write** (`.claude/hooks/long-prose-write-cap.sh`) — denies Write calls where `tool_input.content` exceeds ~200 lines for `.md` / `.txt` files (lower threshold than for code; the failure mode is prose-specific); deny message points to the skeleton + Edit-append pattern. ~40 lines bash + 4-6 vitest hook tests via the same `child_process.execSync` pattern used in S-TOOL-1. (2) **`/refresh-session-context` slash command** (`.claude/commands/refresh-session-context.md`) — encapsulates the section-by-section Edit flow used at session-34 wrap; deterministic protocol for the most-frequent long-prose-Write case. (3) **Lift the existing CLAUDE.md note** at SESSION-CONTEXT line 267 ("Long-prose Writes: use skeleton + Edit-append. Default for docs >~150 lines.") into CLAUDE.md §"Engineering conventions" with the threshold tightened to 200 (matching the hook); keep the rule visible at Tier 1, not buried in session-specific text. ~80 lines bash + ~30 lines md + 4-6 tests + slice docs.

**Recommended:** Path A (S-F7-β) — natural follow-up, builds on α + tooling foundation. Path D (S-INFRA-1) if the Vercel-preview noise is bothering you. Path F (S-TOOL-2) if you want to keep the tooling-track momentum and prevent the stream-timeout failure mode from recurring; sits naturally next to S-TOOL-1 and reuses the same test pattern.

### Pre-flight binding decision: PR #21

Merge PR #21 first or develop on top? Recommended: **merge first** — S-TOOL-1 is DoD-clean (10/10 CI green); review window can be pre-merge; session-35 then branches off the new main tip with the new hooks active.

### P1 — none. Single-P0 session per choice above.

### P2 — surface-level housekeeping

CLAUDE.md candidates after session-34 lift of #12:
- **#13 PR-by-session-end-or-resume-doc** — practised already; arguably redundant now that #12 hook auto-mitigates the underlying problem. Re-evaluate or close.
- **#14 origin/HEAD set as session-start prereq** — manual fix needed in sessions 33 + 34 (occurrence 2). Lift trigger ready; ~5-line patch to `session-start.sh` (`git remote set-head origin main 2>/dev/null || true`).
- **#3 line-count.sh refined model** — the deeper baseline bug that blocked it (measure-vs-main) is now fixed. Re-evaluate whether refined-model upgrade is still wanted; may be redundant.

Carry-forward parked candidates: AUX-3 PWR drift check · #7 tdd-guard hook spec · #9 vitest version-quirks · #10 lockfile policy · #11 compile-time RED pattern.

### Stretch

Run `/review` skill on PR #14 (S-F1) retroactively. Parked since session 29. Probably close as "won't review retro" at next wrap.

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

**Pre-session-35 prerequisite:** decide on PR #21 disposition (merge first, or develop on top). If merge first: session 35 branches off the new main tip with the new hooks active. If develop on top: continue on `claude/S-TOOL-1-line-count-branch-resume` — but watch PR-growth risk.

**Session 34 outcome:** S-TOOL-1 DoD-complete on `claude/S-TOOL-1-line-count-branch-resume` HEAD `413c547` (3 commits ahead of main after handoff commit); PR #21 OPEN with 10/10 CI green, 0 reviews/comments. All in-scope DoD items met or N/A-justified inline (security checklist N/A by tooling-scope rule). Plus PR #20 (S-F7-α) merged at `5d38f6d`.

**Feature branch pattern (spec 71 §7a single-branch-main):**
- Off main: `git checkout main && git pull --ff-only && git checkout -b claude/S-XX-{slug}` (slice) or `claude/session-{N}-{scope}` (session-scoped).
- Work → commit → push → PR → review → merge to main → delete branch.
- Preview URL per branch: `construct-dev-git-{branch}-*.vercel.app`.
- Never direct-push to main (branch protection should enforce once configured).

**Session 35 pre-flight verify:** `git fetch origin && git log origin/main -1` (expect `5d38f6d` if PR #21 not yet merged; ahead if merged); `mcp__github__pull_request_read --pullNumber=21` for PR status; `mcp__github__list_branches` to confirm slice branch state.

**If harness lands you on a suffixed branch (`claude/<slug>-<5-char-alphanumeric>$`):** the new `session-start.sh` (PR #21 once merged) auto-detects this AND surfaces the resync recipe at turn 0. If the warning appears, follow the literal three-command recipe (`git fetch origin <real-branch>` → `git checkout -B <real-branch> origin/<real-branch>` → `git branch -D <suffixed-branch>`). The hook only warns when the canonical non-suffixed branch exists on origin — false-positive risk is near-zero. Sessions 33 + 34 each hit this; documented in HANDOFF-33 + HANDOFF-34 + CLAUDE.md §Planning conduct (lifted session 34).

## Key files

```
Session orientation
CLAUDE.md                                          — Positioning + rules (Tier 1)
docs/SESSION-CONTEXT.md                            — THIS FILE (Tier 2)
docs/HANDOFF-SESSION-34.md                         — Latest retro (S-TOOL-1 · #12 lift · PR #20 merged · PR #21 open)
docs/HANDOFF-SESSION-33.md                         — S-F7-α DoD + PR open retro
docs/HANDOFF-SESSION-32.md                         — S-F7-α scaffold + RED retro
docs/HANDOFF-SESSION-31.md                         — S-B-2 · TDD discussion · 3 CLAUDE.md lifts
docs/HANDOFF-SESSION-30.md                         — S-B-1 confirmation-questions copy-flip retro
docs/HANDOFF-SESSION-29.md                         — S-F1 design tokens retro (first src/ slice)

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

## Session 35 pre-flight

1. **SessionStart hook fires at turn 0** surfacing read-discipline + Planning conduct + live branch state — and (post PR #21 merge) the new `### Branch-resume check` section if a suffix-orphan is detected. Verify it appears.
2. **Claude loads `CLAUDE.md` + this file.** CLAUDE.md updated session 34 with the #12 lift (Branch-resume check) under §Planning conduct. Session-32 lifts (Names · Small functions · Effects behind interfaces) remain prior anchors.
3. **Verify branch state:**
   ```
   git fetch origin
   git log origin/main -1                                  # 5d38f6d unless PR #21 merged
   mcp__github__pull_request_read --pullNumber=21          # PR status (open / merged / closed)
   git log -5 --oneline                                    # confirm session-34's commits visible
   mcp__github__list_branches                              # confirm branch state
   ```
   If `### Branch-resume check` warning appears in the SessionStart context, follow its literal recipe.
4. **Confirm with user (4 pre-flight Qs):**
   - Merge PR #21 first or develop on top?
   - Which session-35 P0: S-F7-β (Path A), S-F2 (Path B), S-CF-tail (Path C), S-INFRA-1 Stripe pin (Path D), candidate-lift session (Path E), or S-TOOL-2 long-prose-write hook + `/refresh-session-context` slash command (Path F)?
   - Slice-prefix decision: codify `S-TOOL-N` as non-catalogue prefix family, or keep tooling work as `claude/session-N-tooling` going forward?
   - CLAUDE.md candidate #14 (origin/HEAD set) — second occurrence this session = lift trigger. Bundle the lift + 5-line `session-start.sh` patch into the next slice, or defer?
5. **First actions** depend on chosen path. For Path A: scaffold S-F7-β slice docs per template; spec 71 §4 + 68b for dev surface routes; existing S-F7-α impl on main as reference contract. For Path B: identify which F-slice; read its slice card in spec 70-build-map-slices.md. For Path C: read `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md` Part 2 rows A13-A16. For Path D: read `src/lib/stripe/client.ts` + check Stripe SDK API version compatibility. For Path E: 30-minute scoping pass on which candidates lift cleanly.

**Session discipline (hook-surfaced; restated):**
- Honour Planning conduct from turn 1. Brief-rot in this file is possible — live-verify factual claims.
- Target ~1,500 lines. **Hook bug carries forward (session 33):** `line-count.sh` measures vs `origin/main`, so cumulative inheritance from prior session's branch commits inflates the count. Until the bug is fixed (Path A target), use `git diff <session-start-sha> --stat` to track session-authored churn manually.
- **CLAUDE.md moratorium partially lifted sessions 31 + 32; held in 33.** 6 lifted across all sessions; 8 candidates currently parked (#3 line-count refined model · #7 tdd-guard hook spec · #9 vitest version-quirks · #10 lockfile policy · #11 compile-time RED · #12 Branch-resume check · #13 PR-by-session-end · #14 origin/HEAD set · AUX-3 PWR drift check). Continue capturing new candidates as HANDOFF notes; don't lift ad hoc within a slice session.
- **Honour the 6-item DoD + 13-item security checklist.** S-F7-α will be `pr-dod.yml`'s fourth positive-path activation if PR #20 merges.
- **Long-prose Writes: use skeleton + Edit-append.** Default for docs >~200 lines (raised from 150 after session-34 evidence; HANDOFF-34 at 106 lines + hooks-session-start.test.ts at 183 lines wrote cleanly; SESSION-CONTEXT at 270 lines failed twice with stream idle timeout). Path F (S-TOOL-2) lands the hook-enforced version of this rule.
- **Behavioural-test discipline:** still binding per session-31 lift.
- **`/security-review` skill needs `origin/HEAD` set.** Session 33 hit `fatal: ambiguous argument 'origin/HEAD...'`. Quick fix: `git remote set-head origin main`. Worth checking at session start (CLAUDE.md candidate #14).
