# HANDOFF — Session 66

**Date:** 2026-05-05
**Branch:** `claude/decouple-session-66-i8x4J`
**Wrap state:** S-M1 marketing landing slice **shipped on main** across 3 substantive PRs + this wrap PR.

## What shipped

3 substantive PRs squash-merged to main this session, in sequence:

| # | PR | SHA | Description |
|---|---|---|---|
| 1 | #92 | `6e4292a` | session 66 P0 — AC-8 token fix + slice-doc reconciliation + auto-review path-ignore |
| 2 | #93 | `3e05aa8` | session 66 P1 — S-M1 phase 4-5: page composition + next/font + marketing utility classes |
| 3 | #94 | `6440afd` | session 66 P2 + P3 — S-M1 phase 6 (`/start` HTTP 404) + phase 8 (verification.md final-state) |

Plus the wrap PR (this commit) carrying HANDOFF-66 + SESSION-CONTEXT refresh.

**Cumulative ship state:** S-M1 marketing landing slice is **fully met against AC-1, AC-2 (in-scope = HeroEditorial), AC-4, AC-5, AC-6, AC-7, AC-8, AC-10**. AC-9 in-progress (5/6 dims pre-PR verified; mobile viewport pending Vercel preview at PR-open). AC-3 (`/dev/heroes` gallery + 8 remaining hero variants) deferred to S-M1.0a follow-up.

Also closed during turn-0 cleanup: PR #89 (`rossdelarge247-debug-patch-2`, superseded by session-65's slug-restructure cherry-pick); PR #91 (session-65 follow-up; carried HANDOFF-65 persona findings + SESSION-CONTEXT P0 block); both merged/closed per kickoff direction.

## KPI signals

- **Auto-review rounds:** PR #92 = 1 round (clean approve). PR #93 = 1 round (PR-body fix needed for `src/ changes reference slice verification` regex on synchronize, then clean). PR #94 = 3 rounds (block → request-changes → approve; 7 substantive findings addressed across iterations). Mean 1.7 rounds across the 3 substantive PRs — meets spec 72c §1 ≤2 target.
- **Cumulative auto-review at k=2 (sessions 56-66):** n=23 PRs through session 66 wrap; mean ~1.7 rounds. Stable.
- **Persona retain/drop on this slice (PR #94 round 1+2):**
  - `reviewer-correctness` — 4 substantive findings (3 ac-gap + 1 real `/g` regex statefulness bug). **STRONG retain holds (cumulative 8/6 catches across 6 src/ slices).**
  - `reviewer-security` — 1 substantive finding (verification.md missing 13-item spec 72 §11 checklist). **MODERATE+ retain (cumulative 3/6 catches; first formal security catch on a marketing slice).**
  - `reviewer-style` — 1 finding (slice AC ref in test description; recurrent author-time stub-hook blindspot). Retain holds.
  - `reviewer-architecture` — silent on this slice. The page→barrel coupling that landed as a real fix was caught by `correctness`, not `architecture`. Cumulative reviewer-architecture remains 2/6 (PR #87 page-wrapper + PR #90 retroactive AC-8 token bypass) — meets the CLAUDE.md "1 catch per 2-3 slices" retention bar.
- **Cohesive-product milestone:** `construct-dev.vercel.app` now renders the marketing landing on `/`. The "first cohesive Vercel preview" goal called out in session-63 onwards is **achieved on main**.

## Lessons

### Lesson 1 — PR-DoD CI uses a literal regex; brace expansion breaks the match

PR #93 first round failed the `src/ changes reference slice verification` check despite the PR body listing `docs/slices/S-M1-marketing/{acceptance,security,test-plan,verification}.md`. The CI workflow `pr-dod.yml` greps for `docs/slices/S-[A-Za-z0-9-]+/verification\.md` literal — brace expansion is shell shorthand, not regex syntax, and the literal `verification.md` string must appear unwrapped in the PR body for the check to pass. Fix: add an explicit `**Slice verification:** docs/slices/S-M1-marketing/verification.md` line near the top of the PR body. PR-body edits trigger `pull_request: edited` which is in `pr-dod.yml` trigger types — no push needed to retrigger.

Forward action: when authoring multi-doc PR bodies, repeat the canonical `verification.md` path as a literal string rather than collapsing into brace expansion.

### Lesson 2 — Regex `/g` flag with `.test()` in a loop is a real correctness bug

The first cut of `tests/marketing/colocation.test.ts` import-boundary test declared `importPattern = /from\s+...['"]/g` and called `.test(body)` in a per-file loop. The `/g` flag makes the regex stateful: after a successful `.test()` match, `lastIndex` advances; the next `.test()` call on a different file starts searching from that offset. For files shorter than the prior `lastIndex`, the regex returns `false` even when matches exist — a silent false negative. Reviewer-correctness specialist caught it on PR #94 round 2 (advisory but substantive). Fix: drop the `/g` flag — `.test()` is a boolean existence check, not iteration; non-global regex resets `lastIndex` to 0 each call.

This was a real bug shipped in author-time TDD-guard-cleared code. Per CLAUDE.md §"Engineering conventions" §TDD where tractable: TDD calibrates correctness, not full safety; adversarial review caught what TDD couldn't.

### Lesson 3 — AC text scope must be honest before claiming met; verification cannot widen the AC

PR #94 round 1 surfaced a blocking `correctness · ac-gap` finding: AC-2 outcome text said "Nine hero variant components exist as named exports" — verification.md re-scoped to "in-scope = 1 of 9". A verification claim cannot widen the AC's own outcome. Fix: amend `acceptance.md` AC-2 formally to split scope (HeroEditorial + map shape in-scope; 8 variants + per-variant smoke tests assigned to S-M1.0a). Verification then correctly marks AC-2 as MET against the amended text.

This is constraint #28 in action ("Don't freeze AC text more ambitious than the implementation budget") — the original AC was over-ambitious for path-B partial-ship; the honest landing required the AC contract itself to reflect the slice/follow-up split, not just the verification narrative.

### Lesson 4 — Adversarial-review tests catch real coupling violations

The newly-added import-boundary test (added per PR #94 round 1 advisory finding) immediately caught a genuine AC-10 violation in `src/app/page.tsx` (importing 4 sections + heroes barrel from sub-paths instead of a single `@/components/marketing` index). Fix: add `src/components/marketing/index.ts` barrel re-exporting the public surface; update `page.tsx` to import via the barrel.

The advisory finding wasn't just process discipline — running the test exposed a real coupling violation that would otherwise have rotted into pluralism. Both the new test and the new barrel ship together, and the test prevents regression.

### Lesson 5 — Mobile-viewport verification is genuinely not automatable from CI; AC-9 honest framing wins over fake-met

PR #94 round 2 flagged AC-9's mobile-viewport row as still phrased like future work. The honest answer: mobile viewport verification at 375×667 (no horizontal scroll, no clipped content, no overlap) requires a real browser at the target viewport — not automatable from CI. The fix wasn't to claim verified; the fix was to be explicit that AC-9 is in-progress (5/6 dims) until the user verifies the remaining dim at the PR-open Vercel preview. Slice DoD #1 reflects this honestly: 9 of 10 ACs MET, AC-3 deferred, AC-9 in-progress.

The verdict converged at round 3 (approve with 0 findings) once the wording stopped promising future state. Honest framing beats fake-met every time.

## Persona findings recorded (PR #94 — the only multi-round PR this session)

| Round | Verdict | Findings | Specialists |
|---|---|---|---|
| 1 | block | 2 blocking (`correctness · ac-gap` AC-2 scope; `security · 72-§11` checklist gap) + 3 advisory (`style · commenting` AC ref in describe; `correctness · ac-gap` AC-10 import boundary; `correctness · ac-gap` AC-9 mobile pending) | architecture · correctness · security · style |
| 2 | request-changes | 2 advisory (`correctness · edge-case` regex `/g` statefulness; `correctness · ac-gap` AC-9 mobile wording) | correctness only flagged new findings; others returned approve |
| 3 | approve | 0 | all 4 specialists clean |

Cumulative retain/drop tally through session 66:

- `reviewer-correctness`: STRONG retain (8 substantive catches across 6 src/ slices; consistent value)
- `reviewer-security`: MODERATE+ retain (3 substantive catches; first marketing-slice security catch landed)
- `reviewer-style`: retain holds (8+ catches; persistent author-time blindspot for AC refs in test descriptions)
- `reviewer-architecture`: retain (2/6 catches; meets ≈ 1-per-3 cadence)

## Branch state at session-66 wrap

- **Wrap branch:** `claude/decouple-session-66-i8x4J` (sequential single-branch pattern continues; 13 sessions in a row 54→…→66)
- **`main` tip:** `6440afd` (post-PR-#94 merge)
- **Open PRs at wrap:** wrap PR opens after this commit
- **Closed/merged this session:** PR #91 (session-65 follow-up, merged at `bae0751`), PR #92 (`6e4292a`), PR #93 (`3e05aa8`), PR #94 (`6440afd`); PR #89 closed as superseded
- **Live rigour gates** unchanged from session-65 plus session-66 P0 hardening: auto-review.yml `paths-ignore: ['docs/design-source/**']` + `:(exclude)docs/design-source` pathspec on both `git diff` invocations in `brief-compose` (handles design-source-bundled PRs without crashing parsers)

## Next-session priority recommendations

S-M1 ships; S-M1.0a is the natural follow-up. Recommended ordering for session 67:

| Priority | Pick | Why | Sizing |
|---|---|---|---|
| 🥇 P0 | **AC-9 mobile-viewport closure** | Open Vercel preview at 375×667; verify no horizontal scroll / clipped content / overlap; update `verification.md` AC-9 row from in-progress → MET. Closes the open AC on a freshly-shipped slice. | XS (~5L) |
| P1 | **S-M1.0a — 8 hero variants + `/dev/heroes` gallery** | Path-B follow-up: translate `hero-explore/heroes_a.jsx` (302L) + `heroes_b.jsx` (334L) — over read-cap; do in 3 turns. Extend `HERO_VARIANTS` map; add `src/app/dev/heroes/page.tsx` rendering all 9 stacked. | L (~700L) |
| P2 | **TDD-guard auto-allow extension** (carry-over from session 64 P2) | `TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch + lint-fix-refactor case detection. Sextuple-confirmed bash-heredoc/sed/awk escape. | S (~10-20L) |
| P3 | **Lockfile divergence fix** (carry-over from session 64 P3) | `eslint-plugin-react-hooks@7.0.1` (npm) vs `7.1.1` (pnpm); investigate why S-INFRA-1 dual-lockfile guard didn't catch. | S-M |
| P4 | **AC-2 hooks-checksums + control-change-label decision** (carry-over from session 64 P4) | Aspirational across 5 sessions; either ship the missing files or strike CLAUDE.md L155-L158 references. | XS (decision) + S-M (impl if shipped) |
| P5 | **`COMMENT_REVIEW_SPAWN=1` opt-in trial** (carry-over from session 64 P5) | Provision local `ANTHROPIC_API_KEY`; opt-in for 1-2 src/ slices. Hypothesis: live mode distinguishes HANDOFF-doc lineage (allowed) from `verification.md` provenance (forbidden). | XS-S |
| P6 | **Reviewer-architecture watchlist continues** | Cumulative 2/6 catches; retain bar met. Monitor next 3 src/ slices for sustained signal. | observational |

**Cohesive-product trajectory** (re-cadenced post-S-M1 ship):

- ✅ **First cohesive Vercel preview SHIPPED** (this session — `/` renders the marketing landing)
- 4-5 sessions to user-testable Build phase end-to-end (S-B0 entry → bank-connect flow → first artefact)
- 9-12 sessions to all 5 phases minimally populated
- 17+ sessions to production-grade

## Carryover open items

- **AC-9 mobile-viewport row** — pending Vercel preview verification at 375×667. Session-67 P0.
- **AC-3 / S-M1.0a** — 8 hero variants + `/dev/heroes` gallery deferred. Session-67 P1.
- **Carry-overs P2-P5** — TDD-guard env hatch · lockfile divergence · hooks-checksums decision · COMMENT_REVIEW_SPAWN trial.
- **No new 68f/g entries** opened this session.
