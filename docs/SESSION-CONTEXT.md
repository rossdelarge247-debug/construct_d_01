# Session 86 Pre-flight Context Block (carrying session 85 wrap delta)

## Session 85 wrap delta — read this first

Session 85 shipped two PRs that closed the canvas-fidelity calibration cycle + pivoted the visual-direction conduct.

**PR #146 + PR #147 — `S-PROTO-canvas-fidelity-rebuild · impl (AC-1..AC-4)`** — merged at `b023461`. PR #146 was round-1 impl scaffold (`TitleShape` discriminated union + ScreenShell title rendering + SubQuestionCard label serif + ScreenShell header chrome + ProgressChip → ProgressPill + 6 tests). PR #147 was rounds 2-5 iteration on auto-review findings: round-2 fixed 4 of 5 round-1 findings (focus-visible inline · describe rename · aria-valuenow guard · aria-hidden visual span); round-3 fixed the data-testid regression introduced by round-2's aria-hidden add; round-4 added §Status entry + diagnosed the canvas-fidelity miss (slice-resolve needed PR-body `Slice references:` paragraph, not just acceptance.md `Linked canvas:` field); round-5 added the explicit slice-reference paragraph that triggered all 4 specialists firing for the first time on actual src/ diff.

**Calibration moment achieved on round-5.** Canvas-fidelity persona's first src/-diff fire surfaced 2 issues (chevron-vs-arrow SVG · per-screen typography variance O3-O5/O6) — both genuinely missed by main conversation. Verdict: request-changes (4 findings, all non-blocking). Persona is calibrated against the rebuild flow.

**PR #148 — `docs(claude): canvas-as-source as prototype default; rebuild scoped to Phase C+`** — merged at `43dbf27`. The calibration findings (chevron-vs-arrow · typography variance) confirmed the gate's value AND the reconciliation overhead's cost: rebuilding from spec is harder than starting from the canvas. User-confirmed pivot: prototype-phase screens use canvas-as-source (5-step adapt pattern: tokenise colours · replace placeholder data · wire state · Next.js wrapping · inline-or-adapt helpers); Phase C+ production work continues to use preserve-and-rebuild. CLAUDE.md §"Visual direction" rewritten accordingly. The canvas-fidelity gate stays in the rig; its conditional firing on `Linked canvas:` field presence already supports both patterns. Auto-review on PR #148 ran clean (3 default specialists, canvas-fidelity correctly dormant on the docs-only diff — itself a worked example of the new convention).

**Cross-canvas reconciliation explicitly deferred to per-instance user decision** — variant (Pre-signup Standalone mobile vs Desktop Help Rail) + responsiveness (intermediate breakpoints) are out-of-scope until scoping a screen where it matters. Header for un-authenticated screens sources from Pre-signup Canvas Standalone (mobile) + Desktop Help Rail (desktop graceful enhancement). Authenticated screens have a separate logged-in header (already designed) — out of scope for this pivot.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-85.md`** — read for the round-by-round narrative, calibration findings detail, pivot reasoning, and the new constraints #40 + #41.

## Session 86 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Pilot canvas-as-source on a chosen screen** | First src/ slice demonstrating the new pattern. User to confirm screen: O1 stage router (recommended — entry screen + introduces new header across the prototype), O7 your plan (untouched), or refactored O2 with new header (revisits the rebuild). Build under `src/app/dev/proto/pre-signup-interview/screens/`. Apply 5-step adapt per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)". Header source: session-81 Pre-signup Canvas Standalone (mobile, for un-authenticated screens). Preview-deploy → user feedback → iterate. No `Linked canvas:` field in `acceptance.md`; canvas-fidelity stays dormant. | Medium-Heavy (~300-500L est) | No |
| 2 | **Spec 76 §3 matrix clarification (optional)** | Add explicit note that prototype-default is `Linked canvas:`-field-absent. Spec 72c §4 (canvas-fidelity dimension) similarly. Small doc PR; not blocking the pilot. | Light (~20-40L doc) | No |
| 3 | **(Inherited) spec-citation-quote-check author-time hook** | Mirror `.claude/hooks/comment-review.sh` pattern (PostToolUse Write\|Edit, advisory exit-0). Catches "per spec X" without proximity quote at edit time, before the CI cycle. Small standalone PR. | Light (~50L bash + shellspec) | No |
| 4 | **(Inherited) Comment-review hook §Status exemption fix** | Stub-mode hook flags "session X" provenance inside `## Status` blocks where CLAUDE.md `^## (§)?Status` exemption should apply. Investigate + repair. Stub-mode advisory only at v3b ship; not urgent. | Light (~20-30L bash) | No |
| 5 | **(Inherited) Spec 65 amendment for quantitative profiling data** | Still parked. Out of scope unless explicitly added. | Heavy | No |

**Recommended sequence:** P1 alone — the pilot is where the canvas-as-source pattern proves itself in src/. P2 + P3 + P4 are tractable side-quests but not on the critical path.

## Authoritative reading order at session 86 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-85.md` (last session's retro — rebuild calibration moment + canvas-as-source pivot reasoning).
3. `CLAUDE.md` §"Visual direction" (the new conduct — canvas-as-source default for prototype + preserve-and-rebuild for Phase C+; 5-step adapt pattern).
4. **For pilot screen scoping (when chosen):** the relevant canvas file under `docs/design-source/pre-signup-interview/jsx/` (per-screen JSX, ~15-22KB each) — grep first for header/component patterns, then targeted reads.

## Session 86 kickoff prompt (paste-ready)

```
Kick off session 86.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state (current branch +
  HEAD vs origin/main + ahead/behind + tree state).
- Branch convention: harness-suffixed (claude/<scope>-XXXXX).
  Session 85 shipped PR #147 (rebuild + calibration; merged at
  b023461) + PR #148 (canvas-as-source rule; merged at 43dbf27).
  Session 86 starts from clean main if the wrap PR has merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-85.md.
3. CLAUDE.md §"Visual direction" (new conduct — phase split +
   5-step canvas-as-source pattern).

Confirm priority with user. SESSION-CONTEXT recommends P1 (pilot
canvas-as-source on a chosen screen) alone. User picks which screen:
- O1 stage router (recommended — entry screen + introduces new header)
- O7 your plan (untouched, no rebuild artifact)
- Refactored O2 with new header (revisits the rebuild)

Definition of Done for the pilot (per CLAUDE.md §"Definition of Done"):
- Slice acceptance.md + verification.md per the prototype category
  (no Linked canvas: field; canvas-fidelity stays dormant).
- Tests written + passing where tractable (logic units; visual-only
  changes verified via preview-deploy).
- Auto-review verdict: approve / nit-only on the impl PR.
- Preview-deploy verified in-browser per spec 72a 6-dim rubric.
- User feedback received + addressed (or explicitly deferred).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind via CSS variables · S-F1 token system at `src/styles/tokens.ts` · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 86 branch: harness-suffixed off clean main. Session 85 shipped PR #147 (`b023461`) + PR #148 (`43dbf27`) + the wrap PR (TBD merge SHA). Session 85 working branches deletable post-merge.

## Negative constraints (preserve)

#1-#39 from prior sessions. **New session 85:**

- **#40 — No preserve-and-rebuild rigour for prototype-phase screens.** Use canvas-as-source per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)". Canvas-fidelity gate stays dormant on prototype slices by default (`Linked canvas:` field absent in `acceptance.md`). Phase C+ production work continues to use preserve-and-rebuild with the gate active.
- **#41 — Cross-canvas reconciliation (variant + responsive) deferred to per-instance user decision.** Not a build-time rule. Variant + responsive raise per-screen at scoping time.

## Scope ceiling

Session 86 is most likely P1 (pilot canvas-as-source on a chosen screen) alone. Out of scope unless explicitly added: P2 (spec 76 matrix clarification) · P3 (spec-citation-quote-check author-time hook) · P4 (comment-review §Status exemption fix) · spec 65 amendments · cross-canvas reconciliation (deferred per-instance) · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work (separate logged-in header out of scope for the canvas-as-source pivot).

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
