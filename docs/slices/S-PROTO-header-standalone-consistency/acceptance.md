# S-PROTO-header-standalone-consistency

**Category:** prototype

Apply the "Decouple." brand bar / wordmark from the Pre-signup Canvas Standalone header treatment across all 8 prototype screens (O1-O8), restoring the user-flagged gap from the prior O2 canvas-as-source pilot's preview-deploy review. Two integration surfaces: `ScreenShell.tsx` chromes O1, O3-O8 (rebuild pattern); `O2.tsx`'s outer wrapper hosts the canvas-as-source O2. The slice ships a shared `BrandBar` component consumed by both surfaces so visual cross-screen consistency is structural (one React component) rather than verified-by-eye twice.

No `**Linked canvas:**` field declared (canvas-fidelity persona stays dormant per CLAUDE.md §"Hard controls"). Per-AC evidence cites the source canvas path inline. Source canvas: `docs/design-source/pre-signup-interview/decoded/Pre-signup Canvas - Standalone.html` (per-screen brand bar at L1047-1052, verbatim).

## Pre-flight

Adversarial review budget per CLAUDE.md §"Engineering conventions" §"Adversarial review gate": single pass on the impl PR via auto-review (`acceptance.md` ≤300L → no partitioning). Auto-review fans out 3 default specialists (security, prototype-readiness substituting correctness per the prototype-category persona substitution in CLAUDE.md §"Slice categories", style); canvas-fidelity stays dormant (field-absent).

## Acceptance criteria

### AC-1 — Shared `BrandBar` component renders verbatim canvas treatment

`src/app/dev/proto/pre-signup-interview/components/BrandBar.tsx` exports a `BrandBar` component that renders a single centred row containing the wordmark "Decouple." as a non-interactive `<span>`. Typography matches canvas L1047-1052 verbatim: Inter family / `tokens.font.sans` stack, `fontSize: 14`, `fontWeight: 700`, `color: tokens.color.ink`, `letterSpacing: "-0.02em"`. Row uses `flex items-center justify-center` with `pt-1 pb-2` padding (canvas-verbatim). No interactivity — no `<a>`, no click handlers — canvas-faithful: the per-screen brand-bar at canvas L1047-1052 is a `<span>`, NOT the marketing-site `mk-wordmark` `<a>` chrome at canvas L880.

### AC-2 — `ScreenShell.tsx` renders BrandBar at top of `<main>` (covers O1, O3-O8)

`src/app/dev/proto/pre-signup-interview/components/ScreenShell.tsx` imports `BrandBar` and renders it as the first child of the existing `<main>` element, before the existing `<header>` row with back + progress + spacer. The `<main>` existing 20px / 48px horizontal+bottom padding is preserved; top padding becomes `24px` (was `64px`) so the BrandBar sits ~24px from the viewport top without the airy gap that 64px left when there was no longer a status-bar row above it. All other ScreenShell chrome decisions preserved: width cap `maxWidth: 480`, header divider `1px solid tokens.color.border`, eyebrow + serif H1 typography, `gap: 28` rhythm between sections, CTA placement with `marginTop: 'auto'`.

### AC-3 — `O2.tsx` renders BrandBar at top of outer wrapper (canvas-as-source O2)

`src/app/dev/proto/pre-signup-interview/screens/O2.tsx` imports `BrandBar` and renders it as the first child of the outer `<div className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto">`, before the existing inline `TopBar`. Outer wrapper gains `pt-6` (~24px) so position-from-viewport-top matches ScreenShell's new `24px` top padding. Width cap `max-w-[480px]` preserved (no regression to the existing 480px outer cap that matches `ScreenShell.tsx:33`'s `maxWidth: 480`). The inline `TopBar`, `Hero`, four cards, and footer remain untouched. The canvas-as-source rule (CLAUDE.md §"Visual direction" §"Canvas-as-source · Step 5") permits importing shared components in addition to inline / local helpers — `BrandBar` is the "replace with existing shared components" path applied to cross-screen chrome.

### AC-4 — Cross-screen consistency: O1 → O2 → O3 navigation shows visually identical brand bar

Verified at preview-deploy via a new cross-screen visual-consistency dimension extending the spec 72a 6-dim rubric. Sibling AC asserts that BrandBar typography, alignment, and position-from-viewport-top render visually identically across the three navigation surfaces (ScreenShell-based O1 → canvas-as-source O2 → ScreenShell-based O3). Width-cap 480 holds on desktop on both surfaces. No header chrome divergence introduced by the brand bar addition.

## Out of scope

- **Status bar (`9:41` / label / `●●●`) row from canvas L1041-1046**: scope decision (option "Brand bar only"). The status bar is a mobile-shell simulation rather than real browser chrome; the O2 canvas-as-source pilot's MobileFrame removal deliberately dropped it. Reintroducing is preview-feedback iteration territory if surfaced.
- **Cross-screen drift items beyond the brand bar** (audit hygiene — visually equivalent or intentional canvas-faithful divergence):
  - Focus-visible implementation: ScreenShell uses `useState(backFocused)` + conditional inline `outline` style; O2 TopBar uses Tailwind `focus-visible:outline focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2` utility classes. Visually equivalent on focus; structurally different. Unification is optional polish.
  - Chevron / back-arrow SVG: ScreenShell inlines `<svg><polyline points="7,2 3,5.5 7,9"/></svg>`; O2 uses `<Arrow dir="left" size={11} />` canvas helper. Visually equivalent (same polyline geometry, same stroke width).
  - Back button touch target: ScreenShell `minHeight: 44, minWidth: 44, padding: '12px 8px'`; O2 `padding: 0` (canvas-faithful ~13px height). Intentional canvas-faithful deferral documented in `docs/slices/S-PROTO-o2-canvas-as-source/verification.md` §"Architectural deferrals" — not drift to fix in this slice.
- **Progress component**: ScreenShell uses `<ProgressPill>` (rebuild pattern component); O2 uses inline `StepRail` (canvas-as-source helper). Different components, different visual treatment. Unifying falls under SESSION-CONTEXT P2 (continue migrating O1, O3-O8 to canvas-as-source) — not this slice.
- **Desktop graceful enhancement**: `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html` Help Rail integration + intermediate breakpoints + extra-space utilisation above the 480px mobile cap. Out of scope per constraint #41 (cross-canvas reconciliation deferred per-instance); SESSION-CONTEXT P3 territory.

## Verification

See `verification.md`. Prototype-category DoD-14 short-form (items 1, 8, 12, 14 only) — spec 76 §3 short-form mapping; CLAUDE.md §"Definition of Done" enumerates the items.
