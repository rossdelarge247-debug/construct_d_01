# HANDOFF-SESSION-73

**Date:** 2026-05-07.
**Branch:** `claude/decouple-session-73-xgvsb` → 1 PR merged → wrap.
**Main tip at wrap:** `b0d2966` post-PR-#121 merge.

## Session 73 in brief

| PR | SHA | What |
|----|-----|------|
| #121 | `b0d2966` | P0 ship C plan-architect persona + atomic exit-plan-review Conventional Comments migration (~280L authored across 6 touch points: NEW `.claude/agents/plan-architect.md` 102L · migrated `.claude/subagent-prompts/exit-plan-review.md` to single-format · extended `.claude/hooks/exit-plan-review.sh` for dual-spawn + union aggregator + blocking gate · spec 72d §5 atomic-migration amendment + §Shipped marker · NEW shellspec Describe block "dual-persona orchestration" + 5 cases + framing-counts-both test · CLAUDE.md plan-time-review row extension); 2 rounds (r1: 5 advisory findings — 3 style commenting/naming + 2 correctness spec-citation/edge-case; r1 fix-up cleared all + a real shellspec regression caught in CI). Closes the B+C+D pre-impl rigour programme. |

**B+C+D programme COMPLETE.** Session 73 ships C plan-architect persona, closing the 3-piece pre-impl rigour suite contracted in spec 72d (sessions 72→73). D test-pain gate (PR #118), B fitness functions (PR #119), C plan-architect persona (PR #121) — all three operational on main. First src/ slice post-B+C+D becomes the calibration moment per spec 72c §9.

## KPI signals (cumulative through session 73)

- **n=42 PRs cumulative.** Session 73 averaged **2 rounds per PR** (within ≤2-rounds-per-PR target). Cumulative mean stable at ~1.68 (n=42).
- **Atomic-migration scope decision validated.** Original spec 72d §5 carved out the `exit-plan-review.md` Conventional Comments migration as out-of-scope at C ship (L177). Session-73 path-D scope decision collapsed the carve-out — single-format hook orchestrator vs dual-format-during-transition. Outcome: simpler hook, simpler test surface, no transitional drift to manage.
- **Local smoke caught 2 real bugs pre-commit.** Adversarial-review-as-I-go (per CLAUDE.md §"Adversarial review gate") surfaced (a) bash brace-parsing bug in DEBUG_VERDICT inline default — `${VAR:-{"findings":[]}}` parses inner `}` as terminator, leaving literal trailing `}`. Fix: temp `EMPTY_VERDICT='{"findings":[]}'` variable. (b) Line-anchored grep pattern in framing-counts test missed real matches because the BEGIN/END markers don't sit at line boundaries in piped output.
- **Round-1 CI failure was a pre-existing test assertion not the fix-up.** Shellspec regression was the `fake-nonce-injection` test (line 53-56) hard-coded `1 occurrence` of the real nonce in DEBUG_FRAMING; my dual-framing change made it 2. Test intent (nonce-injection containment) preserved; assertion updated.

## Persona findings recorded (cumulative through session 73)

| Persona | Score | New session 73 catches | Verdict |
|---|---|---|---|
| `reviewer-correctness` | **24/10** (+2) | PR #121 r1 spec-citation `add` vs `flatten` drift + edge-case question on synthetic-fixtures path filter (latter resolved as non-issue post verification) | **STRONG retain** |
| `reviewer-style` | 17/10 (+3) | PR #121 r1 commenting WHAT-narration ×2 (test + hook) + naming nit `ANY_BLOCKING` boolean-sounding integer | **STRONG retain** |
| `reviewer-security` | 7/10 (+0) | (no findings — no security-relevant surface in C ship) | STRONG-candidate (upgrade pending more security-relevant ships) |
| `reviewer-architecture` | 2/14 = 0.143 — **DROPPED** session 70 | — | — |

**Reviewer-correctness criterion-7 watch.** PR #121 was control-plane (no src/ logic); criterion 7 (hidden-effects) had nothing to bite on. Spec 72c §9 calibration trigger ("expansion path tracked if cumulative correctness criterion-7 catch-rate falls below retain bar in first 3 src/ slices post-B+C+D") **still UNPROVEN** because session 73 was control-plane. Carry to session 74 watch — first src/ slice (post-C ship) is the real test.

## Lessons (session 73)

1. **Atomic-migration trumps phased migration when carve-out scope is small.** Spec 72d §5 originally split the Conventional Comments migration off as a separate concern. The session-73 path-D scope decision collapsed it because the migration cost (~30L touching one prompt template + its 5-category default-blocking table) was less than the cost of a dual-format hook orchestrator handling both schemas during transition. Pattern: when a "transitional" carve-out's scope is comparable to or smaller than the transition machinery, ship atomically.

2. **Adversarial-review-as-I-go > review-then-commit.** Two real implementation bugs (bash brace-parsing, grep pattern) were caught at local smoke time before commit. Both were the kind of subtle bugs that would have shown up only when DEBUG_VERDICT or DEBUG_FRAMING was actually set in CI — which doesn't happen on every PR. Local smoke before commit is cheap insurance.

3. **Pre-existing test assertions break when scope expands.** The shellspec `fake-nonce-injection` test was authored when only one persona spawned. Adding a second persona (with the same per-invocation nonce) doubled the framing tag count. Pattern: when expanding scope on a unit, audit existing tests for hardcoded counts that scoped to the pre-expansion state.

4. **Conventional Comments single-format simplifies hook orchestration.** Pre-session-73 plan was to have `exit-plan-review.sh` aggregate findings across two formats. The atomic migration removes the format-detection branch entirely — `jq -s '[.[].findings[]] | flatten'` works identically across both personas because both emit `findings[]` shape now.

## New negative constraints

(no new constraints session 73; #36 remains the highest. Session 73 reinforced #29 + #33 + #34 patterns but didn't add new ones.)

## Branch state at session-73 wrap

- Wrap branch: `claude/decouple-session-73-xgvsb`. Sequential single-branch pattern (20 sessions in a row 54→…→73).
- main tip: `b0d2966` (post-PR-#121 merge).
- Open PRs at wrap: wrap PR opens after this commit. None other open.
- Closed/merged this session: PR #121 squash `b0d2966`.
- Live rigour gates: 3-specialist suite + Fitness functions + plan-time review (now dual-persona: exit-plan-review + plan-architect). All gates passed clean on PR #121.
- B+C+D pre-impl rigour stack: **3/3 SHIPPED** (D session 72 PR #118; B session 72 PR #119; C session 73 PR #121). Stack operational; first src/ slice post-stack is the calibration moment.

## Next session (74) priorities

1. **P0 — First src/ slice post-B+C+D = calibration moment.** Spec 72c §9 carries the trigger: *"expansion path tracked if cumulative correctness criterion-7 catch-rate falls below retain bar in first 3 src/ slices post-B+C+D"*. Session 74's first src/ slice is the start of that 3-slice cohort. Candidates: S-F7-beta unpark (rebase from `a3f67ec` against current main, 8 ahead / 49+ behind) OR canvas-gated S-O1 / S-M1.0b if design canvas appears at `docs/design-source/{pre-signup-interview,marketing-landing}/{slug}/`.

2. **P1+ — Backlog from `docs/v2/v2-backlog.md` + cohesive-product trajectory.** With logic-spec phase COMPLETE + B+C+D rigour stack OPERATIONAL, the gating constraints on src/ work are mostly resolved. Phase C build slices unblock as canvas appears.

3. **Validation watch — first 3 src/ slices.** Each slice's HANDOFF gains a `## Persona findings recorded` row per active persona. After 3 src/ slices, retain/drop verdicts re-evaluated per spec 72c §9. Plan-architect persona (NEW this session) participates from slice 1.
