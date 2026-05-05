# Session 67 — handoff

**Date:** 5 May 2026
**Branch:** `claude/decouple-session-67-TI5gy`
**Wrap commit (this PR):** TBD on merge

## What shipped

Three substantive src/-touching PRs + this wrap, completing two slices on main:

| PR | SHA on main | Description | Auto-review rounds |
|---|---|---|---|
| #96 | `0aea491` | P0 — S-M1 AC-9 mobile-viewport observed-fail honest-framing; S-M1.0b queued | 1 (clean approve) |
| #97 | `5af33fe` | P1a — S-M1.0a phase 1: 4 simpler hero variants (Declarative · Typographic · Atmospheric · Diagrammatic) + `/dev/heroes` gallery scaffold (5 of 9) + slice docs + housekeeping #74a feature flag SDK item | 2 (round 1: request-changes 8 findings → round 2: 3 declined / 5 patched) |
| #98 | `59a39b4` | P1b — S-M1.0a phase 2: 4 complex hero variants (ProductForward · OutcomeLed · TwoColumn · Empathetic) + gallery extension to 9 + slice verification.md final-state | 2 (round 1: nit-only 5 findings → round 2: clean approve) |

**Slices closed on main this session:**
- S-M1.0a (hero variants + dev gallery) — fully met across PR #97 + PR #98; verification.md flipped ⏳ → ✅ MET.
- S-M1 AC-9 mobile-viewport row — honest-framing closure: ⏳ in-progress (5/6 dims met); 6th dim (375×667) deferred to S-M1.0b once a mobile design canvas is commissioned.

**Backlog item added:**
- v2-backlog #74a "Feature flag SDK selection + integration" (Infrastructure 10 → 11; Total 98 → 99). Triggered by the S-M1.0a hero variant decision: compile-time `SELECTED_HERO_VARIANT` const swap is the only mechanism for hero rotation; runtime swap (per-environment, A/B test, phased rollout, kill-switch) needs a feature flag SDK + spec.

## Persona findings recorded (cumulative through session 67)

| Persona | Cumulative catches / src+infra slices | Verdict |
|---|---|---|
| `reviewer-correctness` | 9 / 7 | **STRONG retain** (PR #97 r1: 4 substantive incl. real `/g` regex statefulness was last session's catch; ac-gap + spec-citation question + edge-case duplicate-id in PR #97 r1; ac-gap question on PR #98 r1) |
| `reviewer-style` | 11+ / 7 | **STRONG retain** (recurrent author-time blindspot for naming nitpicks: P1a Phase fields `n`/`k`; P1b PensionRow `v`, SideRow `k`/`v`, SideProps `you`; 3 rounds of test-description provenance flags) |
| `reviewer-security` | 4 / 7 | **MODERATE+ retain** (re-flagged /dev/* lockdown as advisory note; pre-existing gap acknowledged) |
| `reviewer-architecture` | 2 / 7 | retain ≈ 1-per-3 cadence holds bar (no new substantive findings this session — clean approves on all 3 src/ PRs) |

## KPI signals

- **Cumulative auto-review at k=2 (sessions 56-67):** n=26 PRs, mean ~1.7 rounds. Stable. Session 67's 3 src/ PRs: 1 + 2 + 2 = mean **1.67 rounds** — well under spec 72c §1 ≤2 target.
- **Synthetic-deliberate-injection regression detection:** clean across session.
- **CI infrastructure:** auto-review path-ignore + diff-exclude (session 66 P0) held empirically across 3 PRs. One transient: PR #97 round 1 architecture + style specialists stalled in GitHub Actions queue ~18 minutes; empty-commit retrigger forced a fresh matrix dispatch and all 4 ran clean. Worth noting as a recurring pattern but no infrastructure change required (workaround is cheap).

## Lessons

### Lesson 1 — TDD-guard mid-rename trip; Bash python escape is the right pattern

When renaming a struct field across an interface + array literal + JSX usages, sequential Edit tool calls trip TDD-guard mid-flight: after the first Edit lands the interface change, the remaining JSX still references the old field name, tests go RED, and follow-up Edits get blocked. Hit twice this session (P1a round 2 diagrammatic Phase rename `n`/`k` → `num`/`label`; P1b round 2 PensionRow + SideRow + SideProps renames). The documented escape per kickoff "Bash-heredoc/sed/awk escape" works cleanly: a single python script that does all string replaces and writes the file atomically — no intermediate RED state, no TDD-guard trip. Pattern: when a rename touches >2 lines in the same file, prefer Bash python over sequential Edits.

### Lesson 2 — Naming consistency must apply to all variants in one batch

P1a round 2 fixed `n`/`k` field naming in diagrammatic.tsx. P1b shipped product-forward.tsx + two-column.tsx with the same single-letter pattern (PensionRow `v`, SideRow `k`/`v`, SideProps `you`) — the reviewer flagged the same rule again at P1b round 1. The lesson: when a stylistic rule is established mid-slice, search-and-fix the rule across all related files before opening the next PR. Mechanical rename pass should be part of the slice's pre-PR checklist for repeat-pattern slices.

### Lesson 3 — Mobile-viewport defects surface only at visual check; AC text shouldn't promise responsive without canvas

S-M1's AC-9 mobile-viewport row promised "header collapses or stacks per design; hero columns stack; nav items remain reachable; no horizontal scroll" — but the design canvas (`docs/design-source/marketing-landing/`) authors the landing desktop-only (zero Tailwind responsive class hits across the bundled JSX; the canvas `.mobile-frame` element is a desktop-canvas mockup, not a responsive instance). User visual check at 375×667 confirmed all four contract items failed. Constraint #28 violation that wasn't caught at AC freeze. Pattern correction: when AC text mentions "responsive" / "mobile viewport" / "stacks", verify the design canvas has matching breakpoint markers BEFORE freezing the AC. If not, defer to a follow-up slice that commissions the mobile canvas first.

### Lesson 4 — Empty-commit retrigger unsticks stalled CI matrix

PR #97 round 2: architecture + style specialists queued for ~18 minutes without dispatch (security + correctness ran in 52-73s on the same matrix trigger). GitHub Actions runner pool delay or schedule oddity. Empty commit (`git commit --allow-empty`) pushed onto the branch retriggered the workflow run with fresh matrix slots; all 4 specialists picked up immediately and completed in <2 min. Cheap workaround, no infrastructure change needed. Document this as the standard unstuck pattern when matrix jobs sit queued >5min while peers complete.

### Lesson 5 — PR auto-opened by stop-hook flow needs body update before merge

The session-66 stop-hook flow auto-committed and pushed a PR for a small housekeeping change. When subsequent P1a commits landed on the same branch, the PR head pointer auto-updated but the title + body still reflected only the housekeeping diff. Caught at PR #97 review time and updated via `mcp__github__update_pull_request` to reflect the full P1a + housekeeping scope. Pattern: when piggy-backing P-commits on a stop-hook-opened PR, update the PR title + body to match the cumulative scope before merge — the PR-DoD CI gate doesn't catch stale bodies, but the reviewer + future-you will.

## Branch state at session-67 wrap

- Current branch: `claude/decouple-session-67-TI5gy` (about to be deleted at this wrap PR's merge)
- main tip: `59a39b4` (PR #98 — S-M1.0a phase 2)
- Working tree: clean before wrap commit
- All session-67 src/ PRs merged (#96, #97, #98)
- One open PR at wrap-PR open: this PR

## Next session priorities

Detailed in SESSION-CONTEXT.md §"Session 68 priorities". Headlines:

- **P0 — S-M1.0b commission decision (no code).** S-M1.0b is queued (responsive design pass for the marketing landing). The slice can't proceed without a mobile design canvas — per CLAUDE.md "Source-of-truth precedence", responsive impl without a canvas is implementation-led design with rework risk. Session-68 P0 is the *commission* decision: either user produces a mobile canvas (Claude AI Design wire batch → committed to `docs/design-source/marketing-landing/`), or the slice stays parked. ~5L admin + slice scaffolding once the canvas is in.
- **P1 — TDD-guard auto-allow extension (carry-over from session 64+).** Septuple-confirmed across sessions 61-67. Kicks in for: lint-fix-refactor; degraded-runner state (vitest unavailable when node_modules empty — recurred at session-65 + session-66 turn-0); mid-rename atomic operations (this session's pattern). `TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch + better case detection. ~10-30L.
- **P2 — Lockfile divergence fix (carry-over).** `eslint-plugin-react-hooks@7.0.1` (npm) vs `7.1.1` (pnpm); investigate why S-INFRA-1 dual-lockfile guard didn't catch + repair. Persisted unresolved across 4 sessions now.
- **P3 — AC-2 hooks-checksums + control-change-label decision (carry-over).** Aspirational across 6 sessions: missing files referenced in CLAUDE.md L155-L158. Decide: ship the missing files OR strike CLAUDE.md references.
- **P4 — `COMMENT_REVIEW_SPAWN=1` opt-in trial (carry-over).** Provision local `ANTHROPIC_API_KEY`; opt-in for 1-2 src/ slices to validate live-mode fires correctly on session-N references in slice docs (the false-positive false-negative discriminator).
- **P5 — Reviewer-architecture watchlist (observational).** Cumulative 2/7 catches; meets ≈ 1-per-3 cadence retain bar. Monitor next 3 src/ slices for sustained signal.

If user wants to continue making `/` more cohesive without an immediate mobile canvas, alternative P0: swap `SELECTED_HERO_VARIANT` to one of the 8 new variants on `/dev/heroes` and ship that as the production landing — instant visual lift, ~3L change. Decision belongs to user.

## Status footer

- Created: session 67 (5 May 2026)
- Author: Claude (under user direction)
- Cumulative session-67 src/ output: 3 PRs squash-merged on main; ~2,000 net new lines including 8 new hero components + 9 new test files + slice docs + 3 modified surface files
