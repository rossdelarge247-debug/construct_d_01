# Session 84 retro — diagnostic-gate fix · per-screen JSX swap · canvas-fidelity persona's first calibration cycle

## What happened

Session 84 opened on a clean main with three session-83 PRs merged (#142 orchestrator fix · #143 multi-canvas restoration · #144 wrap docs). PR #140 (S-PROTO-canvas-fidelity-rebuild scaffold) sat open as draft, with its `Linked canvas:` field still pointing at the 10.8MB combined `Pre-signup Canvas - Standalone.html` that crashed the canvas-fidelity specialist on session 83's first live fire. User picked sequence **P4 → P2+P3**: ship the diagnostic-gate fix first so any new failure mode is observable, then update PR #140's slice references and capture the persona's verdict.

### PR #145 — `fix(auto-review): tolerate claude -p non-zero + capture exit code for step warning`

Diagnostic-gate fix. Workflow L298-299 ran `npx ... claude -p` under `set -euo pipefail`; a non-zero exit killed the shell before the diagnostic group at L301-303 could emit raw output. Observed session 83 on the 10.8MB canvas: zero runtime bytes between `set -euo pipefail` and exit code 1.

**Round-1** (`01cf1af`): `|| true` on the npx redirect lets the shell continue. Parse-script tolerates empty stdin via the `{}` sentinel (auto-review-parse.sh L43-46 contract: always exit 0); aggregator marks the dim inconclusive per spec 72c §3 degraded-mode rules. Auto-review verdict: `request-changes` (2 non-blocking findings — style `commenting` for the inline narration; correctness `edge-case` suggesting exit-code capture for richer observability).

**Round-2** (`63ffa4b`): Dropped inline comment narration (style finding); captured exit code via `|| CLAUDE_EXIT=$?` and emitted `::warning::` annotation when non-zero (correctness finding). Auto-review verdict: ✅ `approve` — 0 findings, all 3 specialists healthy. Shadow monitor: k=1 / k=3 both would-have-been approve.

Squash-merged to main as `56475b4`.

### PR #140 update (slice author work) — `S-PROTO-canvas-fidelity-rebuild · swap Linked canvas to per-screen JSX + re-quote ACs at JSX line numbers`

The kickoff and HANDOFF-83 both stated "per-screen decoded HTML files exist alongside the combined canvas (~107KB total)." The HTML files exist at parent level (`docs/design-source/pre-signup-interview/o{2..6}-*.html`) — but on inspection they're React-SPA wrappers with meta-framing (`color: MAGENTA`, "screen N of 8" captions), not the rendered screen content. AC patterns mostly absent: AC-3 borderBottom only in o3/o4, AC-4 step pill only in o3/o4, AC-1 italic span is meta-framing not screen title.

The canon source is `docs/design-source/pre-signup-interview/jsx/o{2..6}-frames.jsx` — already labelled `**Canvas (canon)**` verbatim by `S-INFRA-canvas-fidelity-gate/calibration-report.md`. The slice's existing AC quote blocks were JSX content but mislabelled "Pre-signup Canvas Lxxxx" (combined-canvas line numbers). The relabel-to-JSX was a tighter fit than re-finding the same content in HTML.

Plan-vs-spec verification caught this before any wrong refs shipped. User confirmed JSX path strategy.

**Round-1** (`959d930`): Linked canvas swapped to comma-separated `jsx/o{2..6}-frames.jsx` (~91KB total). 4 ACs relabelled at JSX line numbers (AC-1 L171-172, AC-2 L89, AC-3 L154-158, AC-4 L40-42). Cross-screen pattern repeats noted for AC-3 (o3 L87, o4 L86, o5 L83, o6 L109) and AC-4 (o3 L47, o4 L39, o5 L39, o6 L69). INK constant ref updated to L6, LINE to L9. verification.md §Architectural deferrals marked RESOLVED with 3-bullet breakdown (`brief.compose` comma-split · specialist exit-code capture · slice `Linked canvas:` swap).

**Round-2** (`8dfe2a2`): spec-citation-quote-check failed on the round-1 push — "per spec 72c §3" triggered the proximity-quote rule. The script's `^>` regex only matches top-level blockquotes; my indented blockquote inside the architectural-deferral sub-bullet didn't qualify. Rephrase: "aggregator records inconclusive dim per spec 72c §3" → "aggregator marks the dim inconclusive and reports a degraded-mode warning (matches the specialist-failure response described in spec 72c §3 architecture overview)". Drops the "per spec" trigger phrase while preserving the spec link for navigation.

**Auto-review on round-2 push:** ✅ `approve` — 4 findings, all non-blocking. Canvas-fidelity persona's first real fire against JSX canon ran in ~46s (vs the 11s crash on the 10.8MB combined canvas). Findings:

1. `note · header-affordances` (canvas-fidelity) — confirms persona is reading jsx/o2-frames.jsx L156 (cites the `<a href="#">` wrapper enclosing the canvas's `<span>Back</span>`); standing note about AC-3 verification step 6's `<button>` substitution. Informational.
2. `praise · ac-gap` (prototype-readiness) — the spec-citation rephrase aligns with §3 degraded-mode language; prior finding closed.
3. `praise · security` (security) — per-iteration path-traversal guard preserved across the comma-split loop.
4. `question · ac-gap` (prototype-readiness) — "AC-4 cites jsx/o4-frames.jsx L39 AND jsx/o5-frames.jsx L39; confirm both." Grep at P2-prep already confirmed: both StepRail blocks genuinely start at L39 (identical template structure across screens). Cite accurate; no edit needed.

### Calibration status vs S-INFRA-canvas-fidelity-gate calibration-report's 4+6 expected findings

PR #140 is scaffold-only (no `src/` diff). The canvas-fidelity persona's design is to compare diff against canvas, so calibration findings 1-4 (title bold/italic split · sub-Q serif · header chrome · step pill) won't surface until the impl PR provides the comparison surface. What this PR proved:

- ✅ Persona reads JSX canon successfully (no crash on per-screen content)
- ✅ Cross-references AC line refs against actual canvas content
- ✅ Surfaces actionable line-ref questions
- ✅ Produces verdict aligned with content (approve, not false-positive)
- ⏸️ Calibration findings 1-4 deferred to impl PR

## What went well

- **Plan-vs-spec verification caught the HTML-vs-JSX discrepancy pre-push.** Kickoff and HANDOFF-83 both claimed "per-screen decoded HTML files exist alongside the combined canvas." Technically true, but the HTML files don't contain the canonical patterns — that's in `jsx/`. Catching this at AC re-quote planning (before pushing wrong refs) is exactly the planning-conduct discipline CLAUDE.md prescribes.
- **PR #145 round-2 captured both reviewer findings cleanly.** Style finding (drop inline narration) + correctness finding (exit-code capture + `::warning::` annotation) addressed in a single commit. Reviewer's enhancement raised the floor without scope creep.
- **PR #140 round-2 spec-citation fix was tractable.** The CI failure ("per spec 72c §3" without proximity quote) had a clean remediation: rephrase to drop the `[Pp]er[[:space:]]+[Ss]pec` trigger while preserving the spec link.
- **Diagnostic-gate fix proved itself in production.** First fire of canvas-fidelity post-#145 (against PR #140's pre-update 10.8MB canvas) emitted `inconclusive` with a degraded-mode warning + raw output visible in log — exactly the in-UI signal #145 designed for. The next round (post-JSX-swap) ran clean.

## What could improve

- **HANDOFF-83's per-screen-HTML claim was misleading.** "Per-screen decoded HTML files exist alongside the combined canvas: o2-your-situation-expressive.html (10KB) through o6-what-matters-to-you-expressive.html (24KB)" was a true statement that hid a critical detail (those files are React-SPA wrappers with meta-framing, not canonical visual treatment). Future handoffs that name files for downstream consumption should verify content fit-for-purpose, not just existence + size.
- **spec-citation-quote-check fires post-push, not pre-push.** The "per spec" trigger is regex-tractable; an author-time hook would catch this before the wasted CI cycle. Hook would mirror `.claude/hooks/comment-review.sh`'s advisory pattern.
- **Comment-review hook's `## §?Status` exemption appears buggy.** It flagged "session 82" and "session 84" provenance in `## Status` sections of acceptance.md and verification.md, where exemption should apply. Stub-mode advisory only (doesn't block), but worth investigating — the regex is `^## (§)?Status` per `spec-citation-patterns.sh`, but the comment-review hook lives at a different path with its own logic.
- **Per-screen HTML files at parent level vs `decoded/` subdirectory inconsistency.** CLAUDE.md §"Pre-priority canvas-fidelity verification" says decoded form lives at `docs/design-source/<slug>/decoded/<file>.html`. The o2-o6 files are at parent level. Either the convention is wrong or the files should move. Not in scope for session 84 but worth flagging.

## Key decisions

- **JSX source over HTML for `Linked canvas:` (session 84 P2 plan reversal vs kickoff).** Calibration-report's `**Canvas (canon)**` label cites JSX paths; AC quote blocks already match JSX content verbatim; HTML files don't carry the canonical patterns. User confirmed via "gp" after seeing the trade-off.
- **P4 before P2+P3 (user-picked sequence).** Diagnostic-gate fix lands in main before PR #140's re-fire, so any new canvas-fidelity failure mode is observable from the start. Worked as designed: the post-#145 fire of #140 showed `inconclusive` + raw output visible (where session 83's fire showed empty log).
- **Round-2 of P4 added exit-code-capture + `::warning::` annotation.** Minimum-change Option A (`|| true` alone) would have shipped, but the correctness reviewer's `|| CLAUDE_EXIT=$?` + `::warning::` enhancement was a clear improvement: distinguishes persistent failures (e.g. brief-size regression) from one-off rate-limits at job granularity in the Actions UI.
- **Squash-merge #145 with detailed body.** Preserves the round-1 / round-2 narrative in a single main-commit; consistent with session-83 PR #142/#143 squash pattern.
- **No reply to PR #140's `question · ac-gap` finding.** The persona asked to verify L39 in both jsx/o4 and jsx/o5; my grep at P2-prep already confirmed both. Verdict is `approve`, no action required. Per CLAUDE.md "Be frugal about posting replies on GitHub."

## Bugs found + how fixed

- **Empty-log diagnostic on canvas-fidelity crash** — `set -e` killed the shell before the diagnostic group could emit raw output. Fixed in `01cf1af` (round-1) + `63ffa4b` (round-2) of PR #145.
- **`Linked canvas:` pointed at HTML wrappers, not canonical JSX** — kickoff/HANDOFF-83 framing rotated the slice author's attention away from `jsx/`. Caught at P2-prep planning; corrected in `959d930` of PR #140.
- **"per spec X" without proximity quote tripped spec-citation gate** — my architectural-deferral entry used "per spec 72c §3" inside an indented blockquote, which the gate's `^>` regex doesn't match. Fixed in `8dfe2a2` by rephrasing to drop the "per spec" trigger phrase.

## Persona findings recorded

No `src/` slice shipped session 84 — both PRs were infrastructure / docs. The CLAUDE.md persona-retain/drop metric ("retain if ≥1 caught issue per 2-3 slices") doesn't apply here (no slice to count against). What did show on session-84 PR auto-reviews:

- **PR #145 round-1:** `style` (commenting anti-pattern, addressed), `correctness` (edge-case enhancement, addressed). Round-2: clean approve.
- **PR #140 round-2:** `canvas-fidelity` (note + question, both informational), `prototype-readiness` (praise + question, informational), `security` (praise, informational). Verdict: approve.

Canvas-fidelity persona's first real fire against JSX canon: 46-second runtime, clean parse, 1 note + 1 question (cross-screen line-ref discrepancy). Calibration findings 1-4 deferred to impl PR.

## Next session priorities (for session 85 kickoff in `SESSION-CONTEXT.md`)

1. **Impl session for S-PROTO-canvas-fidelity-rebuild.** PR #140's scaffold is locked + approved; impl PR is where the 4 calibration findings finally surface from the canvas-fidelity persona against actual src/ changes. Scope: `TitleShape` discriminated union + ScreenShell title rendering + SubQuestionCard label serif + ScreenShell header chrome (top-left back-button + chevron + borderBottom divider) + ProgressChip → ProgressPill (96×3 geometry). Per AC-as-canvas-quote discipline; preview-deploy 6-dim rubric per spec 72a.
2. **(Optional) spec-citation-quote-check author-time hook.** Mirror `.claude/hooks/comment-review.sh` pattern (PostToolUse Write|Edit, advisory). Catches "per spec X" without proximity quote at edit time, before the CI cycle. Small standalone PR if pursued.
3. **(Optional) Comment-review hook §Status exemption fix.** Confirm/repair the §Status block exemption that flagged session-82/84 provenance in `## Status` sections. Stub-mode advisory only at v3b ship — not urgent, but a known bug.
4. **(Inherited) Spec 65 amendment to capture quantitative profiling data.** Still parked. Out of scope unless explicitly added.

## Constraints

#1-#39 from prior sessions preserved. No new constraints introduced session 84.
