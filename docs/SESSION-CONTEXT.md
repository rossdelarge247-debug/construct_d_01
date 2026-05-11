# Session 85 Pre-flight Context Block (carrying session 84 wrap delta)

## Session 84 wrap delta — read this first

Session 84 shipped two PRs against the carrying-forward problem from session 83 (canvas-fidelity persona's first calibration cycle).

**PR #145 — `fix(auto-review): tolerate claude -p non-zero + capture exit code for step warning`** — merged at `56475b4`. Round-1 added `|| true` so the diagnostic group + parse below run when `claude -p` exits non-zero (transient API errors). Round-2 (addressing auto-review correctness + style findings) replaced `|| true` with `|| CLAUDE_EXIT=$?` + a `::warning::` annotation when non-zero, so persistent failures (e.g. brief-size regression) surface distinctly from one-off rate-limits at job granularity. Parse-script tolerates empty stdin via `{}` sentinel; aggregator handles inconclusive dim per spec 72c §3 degraded-mode rules. Auto-review verdict: `approve`, 0 findings, all 3 specialists healthy. Shadow monitor: k=1 + k=3 both would-have-been approve.

**PR #140 update (3 commits) — `S-PROTO-canvas-fidelity-rebuild · swap Linked canvas to per-screen JSX + re-quote ACs at JSX line numbers`** — open + approved at session wrap (still draft per session-82 choice to defer impl). Discovery during P2-prep: the kickoff/HANDOFF-83 claim that "per-screen decoded HTML files exist alongside the combined canvas" was misleading — those parent-level HTML files are React-SPA wrappers with meta-framing (`color: MAGENTA`, "screen N of 8" captions), NOT the canonical visual treatment. The canon source is `docs/design-source/pre-signup-interview/jsx/o{2..6}-frames.jsx` — already labelled `**Canvas (canon)**` verbatim by `S-INFRA-canvas-fidelity-gate/calibration-report.md`. The slice's existing AC quote blocks were JSX content but mislabelled "Pre-signup Canvas Lxxxx" (combined-canvas line numbers). Relabel was tighter than re-finding the same content in HTML.

Round-1 (`959d930`) swapped `Linked canvas:` to 5 comma-separated JSX paths (~91KB total), re-quoted 4 ACs at JSX line refs (AC-1 L171-172, AC-2 L89, AC-3 L154-158, AC-4 L40-42), added cross-screen pattern repeats for AC-3 + AC-4, marked the empty-fence architectural deferral RESOLVED. Round-2 (`8dfe2a2`) fixed spec-citation-quote-check failure by rephrasing "per spec 72c §3" to drop the trigger phrase while preserving the spec link.

**Auto-review on PR #140 round-2 push:** approve — 4 findings, all non-blocking. Canvas-fidelity persona's first real fire against JSX canon ran in ~46s (vs 11s crash on the 10.8MB combined). 1 note (header-affordances `<a href="#">` wrapper observation), 2 praise (spec-citation alignment, security guard), 1 question (cross-screen L39 verification — confirmed accurate at P2-prep).

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-84.md`** — read for the HTML-vs-JSX discovery, the round-1/round-2 evolutions, and the calibration-status framing (findings 1-4 deferred to impl PR per persona design).

## Session 85 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Impl session for S-PROTO-canvas-fidelity-rebuild** | The impl PR that lands the 4 calibration findings against actual `src/` changes. Scope per acceptance.md: `TitleShape` discriminated union + ScreenShell title rendering (bold pre-segment + italic non-bold accent + optional full stop) · SubQuestionCard label serif (14px 600 INK lh 1.2) · ScreenShell header chrome (top-left back-button + chevron + `borderBottom 1px solid #E5E3DC` divider) · ProgressChip → ProgressPill (96×3 geometry, INK fill on #E5E3DC). Plus the 4 calibration-report findings surface for the first time against actual diff. Per AC-as-canvas-quote discipline; preview-deploy 6-dim rubric per spec 72a. | Heavy (~700-800L est per acceptance.md §Pre-flight) | No |
| 2 | **spec-citation-quote-check author-time hook (optional)** | Mirror `.claude/hooks/comment-review.sh` pattern (PostToolUse Write\|Edit, advisory exit-0). Catches "per spec X" without proximity quote at edit time, before the CI cycle. Small standalone PR. | Light (~50L of bash + a shellspec) | No |
| 3 | **Comment-review hook §Status exemption fix (optional)** | Stub-mode hook flagged "session 82 P2" and "session 84 P2" provenance inside `## Status` sections of session-84 acceptance.md and verification.md edits, where CLAUDE.md `^## (§)?Status` exemption should apply. Investigate + repair. Stub-mode advisory only at v3b ship; not urgent. | Light (~20-30L bash) | No |
| 4 | **(Inherited) Spec 65 amendment to capture quantitative profiling data** | Still parked from earlier sessions. Out of scope unless explicitly added. | Heavy | No |

**Recommended sequence:** P1 alone (impl session is the calibration moment for findings 1-4 + the loveable visual fidelity rebuild). P2 + P3 are tractable side-quests but not on the critical path. Session 84's P4 (diagnostic-gate fix) shipped + landed cleanly, so the gate is reliably observable for P1's auto-review cycles.

## Authoritative reading order at session 85 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-84.md` (last session's retro — HTML-vs-JSX discovery, calibration design framing).
3. `docs/slices/S-PROTO-canvas-fidelity-rebuild/acceptance.md` (4 ACs with JSX line refs; locked at PR #140's `8dfe2a2`).
4. `docs/slices/S-PROTO-canvas-fidelity-rebuild/{verification,security,test-plan}.md` (scoping + DoD pending).
5. `docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` (durable user-feedback record + speculative findings list — the persona is expected to surface 1-4 and possibly 5-10 on the impl PR).
6. **Per-screen JSX source files** (when implementing): grep first for cited patterns (StepRail at L36-45 · SubLabel at L83-94 · TopBar at L152-164 · Hero at L167-176 in jsx/o2-frames.jsx), then targeted reads. Files are 15-22KB each so full reads are within budget but grep-first is still cheaper.

## Session 85 kickoff prompt (paste-ready)

```
Kick off session 85.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state (current branch +
  HEAD vs origin/main + ahead/behind + tree state).
- Branch convention: harness-suffixed (claude/<scope>-XXXXX).
  Session 84 shipped PR #145 (merged at 56475b4) + PR #140 update
  (3 commits; PR open + draft + approved at session wrap).
  Session 85 starts from clean main if the wrap PR has merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-84.md.
3. docs/slices/S-PROTO-canvas-fidelity-rebuild/acceptance.md.
4. docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md.

Confirm priority with user. SESSION-CONTEXT recommends P1 (impl
session for S-PROTO-canvas-fidelity-rebuild) alone — the calibration
moment for findings 1-4 against actual src/ changes. P2/P3 are
tractable side-quests but not on the critical path.

Definition of Done for the chosen priority:
- All 4 ACs met with evidence per AC in verification.md.
- Tests written + passing where tractable (TitleShape parser/renderer
  + ProgressPill width-fill including (0, 0) boundary; visual-only
  changes verified via preview-deploy 6-dim rubric).
- Auto-review verdict: approve / nit-only on the impl PR.
- Preview-deploy verified in-browser against spec 72a 6-dim rubric:
  golden path · edge cases · prefers-reduced-motion · keyboard-only ·
  mobile viewport (375×667) · screen-reader.
- security.md item 12 stays Pending at PR open; closes Done
  post-verdict.

If P1 (impl session) is the pick: read the acceptance.md ACs and
the relevant JSX line refs (jsx/o2-frames.jsx L40-42 for AC-4 pill,
L89 for AC-2 sub-Q label, L154-158 for AC-3 TopBar header chrome,
L171-172 for AC-1 Hero title). Implement on a new slice-impl branch
off main; PR #140 stays as the locked-AC scaffold.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind via CSS variables · S-F1 token system at `src/styles/tokens.ts` (75 entries) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 85 branch: harness-suffixed off clean main. Session 84 shipped PR #145 (merged at `56475b4`); the wrap PR + PR #140 update landing TBD at session 85 start. Session 84 working branches deletable post-merge.

## Negative constraints (preserve)

#1-#39 from prior sessions. No new constraints session 84.

## Scope ceiling

Session 85 is most likely P1 (impl session for S-PROTO-canvas-fidelity-rebuild) alone. Out of scope unless explicitly added: P2 (spec-citation-quote-check author-time hook) · P3 (comment-review §Status exemption fix) · public-pages nav-bar reconciliation (separate concern flagged session 81) · `Decouple.zip` unpacking · spec 65 amendments to capture quantitative profiling data · O7-O8 fidelity rebuild (PR #140's slice scopes O2-O6 only per session-82 user-confirmed Scope-A) · Welcome Tour · Mobile/Desktop responsive variants · Help Rail desktop.

## Current pre-signup prototype URL

- Production (after session-80 squash deployed): `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
