# Session 68 — handoff

**Date:** 5 May 2026
**Branch:** `claude/decouple-session-68-PSNET`
**Wrap commit (this PR):** TBD on merge

## What shipped

Five substantive PRs on main, resolving four multi-session carry-overs and applying a production visual lift:

| PR | SHA on main | Description | Auto-review rounds |
|---|---|---|---|
| #100 | `69fd0d8` | P0-alt — `SELECTED_HERO_VARIANT` flip `'editorial'` → `'declarative'`; production hero on `/` is now HeroDeclarative (~3L src, ~5L test alignment) | 1 (clean approve, 1 question) |
| #101 | `a262897` | P1 — TDD-guard runner-states extension: DEGRADED detection (vitest binary missing → graceful skip) + `TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch. Resolves septuple-confirmed turn-0 friction carry-over | 1 (clean approve, 1 thought) |
| #102 | `3e7266d` | P2 — Lockfile sync: bump `eslint-plugin-react-hooks` 7.0.1 → 7.1.1 to align both lockfiles + `**/*.dev.tsx` eslint override for new `react-hooks/immutability` rule. Resolves 4-session lockfile-divergence carry-over | 2 (request-changes 2 → addressed → clean approve) |
| #103 | `321a475` | P3 — Strike stale `hooks-checksums.txt` + `pre-commit-verify.sh` references in CLAUDE.md L356 rollback procedure. Resolves 6-session aspirational carry-over (mechanism was decommissioned in P0b-structural; references missed at the time) | 1 (clean approve, 0 findings) |
| #104 | `d902cec` | P4 — Comment-review hook skip-list extension: add `docs/HANDOFF-SESSION-*.md` + `docs/SESSION-CONTEXT.md` to suppress recurring stub-mode false positive on lineage-purpose docs | 2 (clean approve nitpick → addressed → clean approve) |

**Slices closed on main this session:**
- `S-INFRA-tdd-guard-runner-states` — fully ✅ MET; AC-1 (DEGRADED) + AC-2 (OVERRIDE)
- `S-INFRA-react-hooks-71-sync` — fully ✅ MET; AC-1 (lockfile sync) + AC-2 (`.dev.tsx` lint exclusion)
- `S-INFRA-comment-review-lineage-skip` — fully ✅ MET; AC-1 (HANDOFF skip) + AC-2 (SESSION-CONTEXT skip)

## Persona findings recorded (cumulative through session 68)

| Persona | Cumulative catches / cohort | Verdict |
|---|---|---|
| `reviewer-correctness` | 11 / 10 | **STRONG retain** (P0-alt #100 r1: no-slice-ac question; P2 #102 r1: edge-case glob-vs-AC mismatch addressed in r2 with tightened comment) |
| `reviewer-style` | 13+ / 10 | **STRONG retain** (P2 #102 r1: WHAT-restating commenting issue; P4 #104 r1: line-number citation staleness nitpick — both addressed in round 2) |
| `reviewer-security` | 5 / 10 | **MODERATE retain** (P1 #101 r1: forward-looking thought about TDD_GUARD_REDGREEN_OVERRIDE in shared CI context — non-blocking advisory) |
| `reviewer-architecture` | 2 / 10 | retain bar drifting (was ≈ 1-per-3 cadence; now 0.20 — clean approves on all 5 session-68 PRs; **watchlist signal**) |

## KPI signals

- **Cumulative auto-review at k=2 (sessions 56-68):** n=31 PRs, mean ~1.6 rounds (rolling). Session 68's 5 PRs: 1 + 1 + 2 + 1 + 2 = mean **1.4 rounds** — well under spec 72c §1 ≤2 target.
- **Synthetic-deliberate-injection regression detection:** clean across session.
- **CI infrastructure:** auto-review path-ignore + diff-exclude held; degraded-mode case observed once (P1 #101 correctness specialist inconclusive on round 1) — verdict computed from remaining specialists per spec 72c §3, no fallback.

## Lessons

### Lesson 1 — Kickoff carry-over framings can be wrong on multiple axes

Session-68's P3 priority was framed as "ship the missing files OR strike CLAUDE.md L155-L158 references". Two issues with the framing:

1. **Wrong location.** L155-L158 is the Information-tiers section; the actual stale references were at L356 in the rollback procedure section.
2. **Wrong path.** The "ship the missing files" path was always unavailable — the `hooks-checksums.txt` + `control-change-label.yml` + `generate-hooks-checksums.sh` files were *intentionally decommissioned* in a prior session (P0b-structural full-removal). The references should have been swept then; they survived because the rollback section sat in a verbatim quote of the v3a-foundation slice.

The carry-over had been "deferred" across 6 sessions because the framing was always wrong. Resolution required ignoring the kickoff text and grepping for actual stale references, then choosing the only honest path (strike, not ship).

**Pattern correction:** before treating a multi-session carry-over as "deferred again", grep for the live state and confirm the framing matches reality. The CLAUDE.md "Verify before planning" rule applies to carry-overs as much as to fresh priorities.

### Lesson 2 — Transitive version bumps reveal hidden regressions; design for scope expansion

P2 set out to sync `eslint-plugin-react-hooks` 7.0.1 → 7.1.1 (a 4-line lockfile change). The 7.1.x release added `react-hooks/immutability` at error severity, which fired on existing in-place state mutations in `src/app/dev/engine-workbench/page.dev.tsx` (workbench shortcuts for immediate visual feedback). Suddenly the "S-M" carry-over had three sub-paths each with different scope:

- (a) Refactor the mutations to immutable updates (~30-50L)
- (b) Add a scoped eslint exclusion for `**/*.dev.tsx` (~10-15L)
- (c) Stay diverged

Path (b) was chosen as the smallest concrete-fix path that respected the dev/production boundary already encoded in the `.dev.tsx` suffix convention. The slice scope expanded to cover both lockfile sync + lint scope adjustment as a single deliverable.

**Pattern correction:** when bumping a transitive lint dep, grep for the new rule's hits before committing to "S-M" budget. Surface the trade-off matrix early; let the user pick a path before the work is in flight.

### Lesson 3 — Pivoting from kickoff path A to path B is fine when path B is durable

P4 was framed in the kickoff as `COMMENT_REVIEW_SPAWN=1` opt-in trial — requiring the user to provision `ANTHROPIC_API_KEY` locally and run a behavioral comparison between stub and live modes. Investigation revealed:

- The recurring false positive (HANDOFF + SESSION-CONTEXT lineage refs) wasn't a stub-vs-live discrimination problem — it was a *which files to invoke the hook on* problem
- The hook already had skip-list infrastructure (existing patterns: `.claude/agents/`, `tests/shellspec/`, structural data)
- Adding two new patterns (`docs/HANDOFF-SESSION-*.md` + `docs/SESSION-CONTEXT.md`) suppresses the false positive in both stub and live modes, no API key needed

The pivot was transparent (PR body explains the framing change). The path-A trial remains available for users who want to test live-mode on production code, but is no longer required to suppress this specific false positive.

**Pattern correction:** when the kickoff frames a decision as a trial, investigate whether the underlying problem is solvable without the trial. Trials are useful for genuine-uncertainty problems, but redundant when the answer is structural.

### Lesson 4 — Round-2 patches add up; line-number citations rot

PR #104 round-1 review found a nitpick (style): a comment block citing `CLAUDE.md L215-222` would rot when CLAUDE.md is edited. Switched to section-name citation (`CLAUDE.md §"Comments: WHY not WHAT"`). PR #102 round-1 review caught a similar pattern (WHAT-restating comment line). Both round-2 patches were 1-2 lines.

**Pattern correction:** at code-write time, prefer section-name citations over line-number citations. Line numbers are valid mid-PR (when the file is stable for the diff under review) but become stale once the cited file is edited. Section names survive renumbering.

### Lesson 5 — `reviewer-architecture` retain bar drifting; watchlist active

Through session 67: `reviewer-architecture` was at 2/7 = 0.29 catches per slice — meeting the ≈ 1-per-3 cadence retain bar. Session 68 added 3 src+infra slices with 0 architecture catches (clean approves on all 5 PRs). Cumulative: 2/10 = 0.20 — drifting below bar.

Per CLAUDE.md "Persona retain/drop metric" §retain criteria:

> Retain criteria: if the agent catches at least one issue the main conversation missed per 2-3 slices, retain. Otherwise drop — added friction without value.

Currently the persona is at *one issue per 5 slices*. If session 69 adds 2-3 more slices with 0 architecture catches, the retain bar formally fails and the persona becomes a candidate for drop.

**Pattern correction:** flag this in SESSION-CONTEXT as an active watchlist; don't pre-emptively drop. Three more slices of clean approves would be the formal trigger.

## Branch state at session-68 wrap

- Current branch: `claude/decouple-session-68-PSNET` (about to be deleted at this wrap PR's merge)
- main tip: `d902cec` (PR #104 — comment-review lineage skip)
- Working tree: clean before wrap commit
- All session-68 src+infra PRs merged (#100, #101, #102, #103, #104)
- One open PR at wrap-PR open: this PR

## Next session priorities

Detailed in SESSION-CONTEXT.md §"Session 69 priorities". Headlines:

- **P0 — S-M1.0b commission decision (no code).** Same as session-68 P0 (deferred when user couldn't access Claude AI Design to upload mobile canvas). Either user produces a mobile canvas (Claude AI Design wire batch → committed to `docs/design-source/marketing-landing/{slug}/`), or the slice stays parked. ~5L admin + slice scaffolding once the canvas is in.
- **P0-alt — Production hero swap to a different variant.** 7 of 8 newly-shipped variants remain unused on `/`. Cheap visual lift; current is `'declarative'` (post session 68).
- **P1 — Dev workbench mutation refactor.** Out-of-scope of session-68 P2; would let us remove the `react-hooks/immutability` eslint exclusion for `.dev.tsx`. ~30-50L across 2 mutation sites in `src/app/dev/engine-workbench/page.dev.tsx`.
- **P2 — Lockfile divergence CI guard.** Out-of-scope of session-68 P2; ~50-100L workflow that diffs npm-lock vs pnpm-lock for shared-package version drift. Catches future regressions.
- **P3 — Single-lockfile policy decision.** CLAUDE.md candidate #10; bigger architectural decision; deferred indefinitely. Move to backlog with explicit "deferred" marker.
- **P4 — `COMMENT_REVIEW_SPAWN=1` opt-in trial.** Path-A still available; the false-positive case it was originally framed against was solved structurally in session-68 P4 path-B. Trial remains useful for testing live-mode catch-rate on production code but is no longer the highest-recurrence carry-over.
- **P5 — Reviewer-architecture watchlist.** Cumulative 2/10 (drifting below 1-per-3 bar at 0.20). Formal drop trigger: 3 more slices of clean approves with 0 architecture catches.

If user wants to continue making `/` more cohesive without an immediate mobile canvas, alternative P0: another hero variant swap. Decision belongs to user.

## Status footer

- Created: session 68 (5 May 2026)
- Author: Claude (under user direction)
- Cumulative session-68 src+infra output: 5 PRs squash-merged on main; ~600 net new lines including 3 new slice doc pairs + hook + spec + lockfile + eslint + CLAUDE.md updates
