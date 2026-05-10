# S-PROTO-canvas-fidelity-rebuild

**Category:** prototype

**Linked canvas:** docs/design-source/pre-signup-interview/decoded/Pre-signup Canvas - Standalone.html

## Why

The S-INFRA-canvas-fidelity-gate slice (merged at `ecbdf9d`) shipped the rigour gate. The gate's calibration-report captures 4 visual-fidelity gaps between the deployed pre-signup-interview prototype and the canonical canvas. This slice consumes the gate (which fires live for the first time on this PR) and rebuilds visual treatment on screens O2-O6 to match Pre-signup Canvas verbatim per the AC-as-canvas-quote discipline.

Scope: O2-O6 fidelity rebuild only. O7 + O8 + Welcome Tour + Mobile/Desktop responsive variants + Help Rail + Landing Page deferred to follow-up slices.

## Pre-flight notes

- **Slice category:** prototype (spec 76 §1 path-default for `src/app/dev/proto/<literal-slug>/**`; declared explicitly above for clarity). Canvas-fidelity gate fires conditionally on `Linked canvas:` field presence — see CLAUDE.md §"Hard controls" canvas-fidelity row.
- **Slice size pre-flight:** acceptance ~180L · verification + security + test-plan ~150L combined · impl ~400-500L (ScreenShell.tsx + SubQuestionCard.tsx + ProgressChip.tsx → ProgressPill.tsx + per-screen copy resolver structured-title support) · est total ~700-800L.
- **Adversarial review budget:** acceptance.md targeted ≤200L (under spec 72b's sub-spawn cap).
- **TDD-applicable surface:** visual-treatment changes are not strictly TDD-tractable (CLAUDE.md §"Engineering conventions" §"TDD where tractable" exempts pure-visual UI; visual regression covers it). Structured-title shape introduces a `TitleShape` type — unit-test the type's parser/renderer. Visual fixes themselves verified via the spec 72a preview-deploy 6-dim rubric.
- **Test-pain audit (spec 72d §3):** structured-title shape is a new logic seam; mock-count target ≤2 per unit test.
- **Architectural-smell awareness:** ScreenShell title-prop shape change risks prop sprawl. Pre-empted: define a single `TitleShape` discriminated union (`{kind: 'plain', text} | {kind: 'split', bold, accent, period}`) that the copy resolver supplies; ScreenShell switches on `kind`.

## MLP framing

What "loveable" requires: a user comparing the prototype to the canvas sees no visual gap on the 4 calibration findings. What can iterate post-launch: per-screen copy variants beyond O2-O6, animation polish, transition micro-interactions.

## AC-1 · Title bold/italic split (Finding 1)

- **Outcome:** ScreenShell renders the screen title with a structured shape: bold pre-segment + italic non-bold accent segment + optional terminal full stop. Treatment per canvas verbatim:

  > *Pre-signup Canvas L1079-1080:*
  > ```jsx
  > <h2 className="serif mt-2" style={{ fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}>
  >   Your <span className="italic" style={{ fontWeight: 400 }}>situation</span>.
  > ```

- **Verification:**
  1. ScreenShell title renders with: serif font · fontSize 26px · lineHeight 1.05 · letterSpacing -0.02em · fontWeight 600.
  2. Bold pre-segment renders at default fontWeight 600 (inherited from h-element).
  3. Accent segment renders as `<span class="italic">` with fontWeight 400.
  4. Terminal full stop renders after the accent span (when `period: true` in the title shape).
  5. Each O2-O6 screen's copy resolver supplies the structured title parts via `TitleShape` discriminated union.

- **In scope:** `ScreenShell.tsx` title rendering · `TitleShape` type · copy-resolver structured-title support · O2-O6 copy entries supply the structured shape.
- **Out of scope:** O7-O8 (deferred to follow-up); animation on title mount.

## AC-2 · Sub-question label serif (Finding 2)

- **Outcome:** SubQuestionCard label uses serif font at size 14px, fontWeight 600, INK color, lineHeight 1.2. Per canvas verbatim:

  > *Pre-signup Canvas L990:*
  > ```jsx
  > <div className="serif" style={{ fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.2 }}>
  > ```
  >
  > where the canvas declares `const INK = "#1A1A1A"` at L4721.

- **Verification:**
  1. SubQuestionCard label renders with: serif font · fontSize 14px · fontWeight 600 · color #1A1A1A (INK) · lineHeight 1.2.
  2. Sans-serif fallback removed from the label specifically (chips below may stay sans).

- **In scope:** `SubQuestionCard.tsx` label styling · token mapping if needed (`tokens.color.text.ink` should resolve to `#1A1A1A`).
- **Out of scope:** SubQuestionCard chrome (border, padding, border-radius — speculative finding from gate first run).

## AC-3 · Header chrome (Finding 3)

- **Outcome:** ScreenShell header has top-left back-button with chevron + "Back" label, with `borderBottom 1px solid LINE` divider beneath the top-bar zone. Per canvas verbatim:

  > *Pre-signup Canvas L1063-1066:*
  > ```jsx
  > <div ... style={{ borderBottom: `1px solid ${LINE}` }}>
  >   <span>Back</span>
  > ```
  >
  > where the canvas declares `const LINE = "#E5E3DC"` at L4724. Pattern repeats per screen at L1574-1577, L1977-1980, L2417-2420 (verified consistent across O2-O5 sections of the canvas).

- **Verification:**
  1. Back-button positioned top-left of header (current impl is right-side via `space-between` flex; flip required).
  2. Chevron icon (left-pointing arrow) precedes the "Back" label.
  3. Header has `borderBottom: 1px solid #E5E3DC` divider rule beneath the top-bar zone.
  4. Treatment applied consistently to all O2-O6 screens via shared ScreenShell.
  5. Back-button click navigation behaviour preserved (assumed already wired via stage router).
  6. Back-button rendered as `<button>` element (not `<span>` or `<div>`) — keyboard-reachable + activatable without ARIA augmentation. Canvas literal at L1066 shows `<span>Back</span>`; rebuild substitutes a `<button>` to satisfy semantic + a11y discipline.
  7. Back-button interactive area ≥ 44×44px on 375×667 viewport — confirm via DevTools touch-target simulation at preview-deploy.

- **In scope:** `ScreenShell.tsx` header layout (back-button positioning, chevron, divider).
- **Out of scope:** stage-router back-navigation logic (already wired); chevron icon authoring (use existing inline SVG pattern from elsewhere if available, else minimal new SVG).

## AC-4 · Step indicator pill geometry (Finding 4)

- **Outcome:** Step indicator is a 96×3px rounded pill with INK fill on `#E5E3DC` ground; fill width = `current/total`. aria-label preserved verbatim. Per canvas verbatim:

  > *Pre-signup Canvas L941:*
  > ```jsx
  > <div className="relative rounded-full overflow-hidden" style={{ width: 96, height: 3, background: "#E5E3DC" }}>
  >   <div className="absolute rounded-full" style={{ top: 0, bottom: 0, left: 0, width: `${(current / total) * 100}%`, background: INK }} />
  > </div>
  > ```
  >
  > with aria-label `Step ${current} of ${total}` (pattern repeats per screen at L1527, L1923, L2366, L2796, L3424).

- **Verification:**
  1. Step indicator renders as a horizontal pill (NOT a chip).
  2. Outer dimensions: width 96px · height 3px.
  3. Outer background: `#E5E3DC`.
  4. Inner fill: `width: (current/total)*100%` · background INK (`#1A1A1A`).
  5. `aria-label` exact format: `Step ${current} of ${total}` (verbatim).
  6. Existing `ProgressChip.tsx` repurposed or replaced (suggest rename to `ProgressPill.tsx` for clarity); ScreenShell integration updated.

- **In scope:** `ProgressChip.tsx` → `ProgressPill.tsx` (rename + reshape) · `ScreenShell.tsx` integration.
- **Out of scope:** transition animation between step changes (deferred unless the canvas shows it).

## Out of scope (slice-level)

- **O7 + O8 fidelity rebuild.** Pre-signup Canvas covers O2-O8; this slice scopes O2-O6 only. O7-O8 land in a follow-up slice.
- **Mobile + desktop responsive variants.** Mobile Screens v2 canvas (5233L) deferred to follow-up.
- **Welcome Tour pre-O1 onboarding.** Welcome Tour canvas (1497L) deferred to follow-up.
- **Help Rail desktop variant.** Desktop Enhanced - Help Rail canvas (2235L) deferred to follow-up.
- **Public-pages header reconciliation.** Explicitly user-flagged separate activity (calibration-report.md §"Finding 5").
- **Speculative findings (eyebrow treatment, sub-Q card border, CTA button typography, etc).** Captured in S-INFRA-canvas-fidelity-gate calibration-report.md §"Speculative findings". Gate's first live run on this slice's PR may surface them additively. Address inline if surfaced; otherwise carry over to follow-up.
- **Spec 65 amendments to capture quantitative profiling data.** Carried forward from gate slice's out-of-scope list — needs canon-author conversation.

## Definition of Done

Per CLAUDE.md §"Engineering conventions" §"Definition of Done":

1. All 4 ACs met with evidence per AC in `verification.md`.
2. Tests written + passing: structured-title `TitleShape` type tested at `__tests__/`; visual regression covers fixed surfaces; test-pain audit clear (≤2 mocks per unit test).
3. Adversarial review done; multi-agent auto-review verdict target: `approve` / `nit-only`. Canvas-fidelity persona's first live exercise — surprises expected per kickoff DoD note ("tune the persona prompt before merge if false-positive rate is high").
4. Preview-deploy verified in-browser against the spec 72a 6-dim rubric: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport · screen-reader. Each calibration finding visually resolved as confirmed by side-by-side comparison with Pre-signup Canvas O2 section.
5. No regression in adjacent slices: O1 stage-router (still wired); SubQuestionCard not breaking elsewhere if used in O3-O6.
6. Open 68f/g entries: N/A for this slice.

Plus 14-item security checklist in spec 72 §11 — short-form for `category: prototype` slices (spec 76 §3 calibration: items 1, 8, 12, 14 only). See `security.md`.

## Status

- 2026-05-10: scaffold authored at slice setup (session 82 P2); 4 ACs evidence-recipe scoped per AC-as-canvas-quote with verbatim Pre-signup Canvas L-refs; canvas-fidelity gate fires for first time live on this slice's PR (calibration data captured in PR auto-review verdict + carry-over to gate slice's calibration-report.md `## Status` post-merge entry).
