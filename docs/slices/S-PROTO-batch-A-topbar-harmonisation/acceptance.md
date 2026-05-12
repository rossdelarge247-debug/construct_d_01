# S-PROTO-batch-A-topbar-harmonisation

**Category:** prototype

Phase 3 Batch A of the homogenisation programme scoped in `docs/slices/S-PROTO-cross-screen-homogenisation-audit/acceptance.md`. Extracts one shared `TopBar` primitive replacing 8 local `function TopBar` / `MobileTopBar` declarations across O1-O8.

Resolves the following audit findings: F-CH-01 (TopBar duplication) · F-CH-02 (ProgressPill stays as child) · F-NM-04 (local `ArrowSvg` deletion in O7/O8) · F-SP-01 (canonical TopBar padding) · F-SP-02 (canonical 36px right-spacer) · F-SP-03 (canonical `<div>` spacer element) · F-SM-02 (TopBar wraps in `<header>` landmark) · F-SM-04 (Back action canonical element type) · F-SM-05 (focus-visible on Back) · F-CM-02 (`styles.backLink` consolidation) · F-FT-01 (border-token portion — TopBar's bottom-border via canonical token).

**Defers to Batch B / C / D / E / F:** Hero (B) · Footer (C) · `<main>` sweep (D) · dead-code cleanup (E) · token promotion at production graduation (F). The per-screen `colors` consts continue to exist after Batch A; their `line`/`border` keys become unused for the TopBar's bottom-border (which is owned by the shared primitive) but remain referenced by Hero/Footer until those batches land.

Per CLAUDE.md §"Canvas-as-source (prototype default)": no `Linked canvas:` field — canvas-fidelity persona stays dormant.

## Acceptance criteria

**AC-1: `components/TopBar.tsx` shared primitive.**

Create `src/app/dev/proto/pre-signup-interview/components/TopBar.tsx` with:

```tsx
interface TopBarProps {
  step: number;
  total?: number;        // forwarded to ProgressPill, defaults to TOTAL_STEPS
  onBack?: () => void;   // when provided → Back button; when omitted → Home link (O1 only)
}

export function TopBar({ step, total, onBack }: TopBarProps): JSX.Element;
```

Behaviour:
- Renders a `<header>` semantic landmark (resolves F-SM-02). NOT `<div>`.
- Padding `8px 20px 12px`, display flex, justify-content space-between, align-items center, border-bottom `1px solid tokens.color.border` (resolves F-SP-01 + F-FT-01).
- Left slot — `onBack` provided: `<button type="button" onClick={onBack}>` with `<Arrow dir="left" size={11} />` + `<span>Back</span>`. Font 11px sans, `color: tokens.color.text.sub`, padding 0, background transparent, border none, cursor pointer, `display: inline-flex`, `align-items: center`, `gap: 6px`, focus-visible 2px solid currentColor outline 2px offset (resolves F-SM-04 + F-SM-05).
- Left slot — `onBack` omitted (O1 only): `<a href="#">` with same Arrow + `<span>Home</span>` content but font 12px (matches O1 canvas) and `text-decoration: none`. Same focus-visible treatment.
- Centre slot: `<ProgressPill step={step} total={total} />` (resolves F-CH-02). No prop changes to `ProgressPill` itself.
- Right slot: `<div aria-hidden="true" style={{ width: 36 }} />` (resolves F-SP-02 + F-SP-03). 36px `<div>` only; no save link, no caption variant, no per-screen prop override.
- Uses shared `components/Arrow.tsx` for the left-arrow icon (resolves F-NM-04 portion — eliminates need for local `ArrowSvg` in O7/O8).

CSS-module convention: TopBar styling in `components/TopBar.module.css` (NEW file). Class names: `.topBar`, `.backButton`, `.homeLink`. The `backButton` class consolidates the prior `styles.backLink` pattern from O4/O5/O6 module CSS (resolves F-CM-02).

**AC-2: Replace local TopBar usage across all 8 screens.**

For each of `screens/O{1..8}.tsx`:
- Delete the local `function TopBar` (or `function MobileTopBar`) declaration entirely. Delete any local helpers used only by that function (e.g. inline arrow helpers, inline progress markup, the standalone `function StepRail` on O8.tsx:133, the standalone inline progress-bar markup in O7.tsx:152-162).
- Replace `<TopBar ... />` (or `<MobileTopBar ... />`) call-site with `<TopBar step={step} onBack={back} />` for O2-O8, `<TopBar step={step} />` for O1 (no `onBack`).
- Remove the now-unused `Arrow` import from O1-O6 (the shared TopBar owns Arrow); O7+O8 also drop their local `ArrowSvg` definition (resolves F-NM-04). If the screen body still uses `Arrow` for non-chassis purposes (e.g. the Continue CTA right-arrow), the import stays.
- Per-screen `colors.line` / `colors.border` reference for the old `borderBottom` on the deleted local TopBar is removed; the key may now be unused on some screens (where TopBar was the sole consumer) — leave the `colors` const as-is; Batch B / C / F handle the key-pruning.

Expected screen-level diff per screen: net negative (delete ~25-50 lines of local TopBar + helpers; add 1-line `<TopBar />` call).

**AC-3: Tests for the `TopBar` primitive.**

New file `components/__tests__/TopBar.test.tsx` (vitest + react-testing-library). Tests:
1. Renders `<header>` landmark. Assert `screen.getByRole('banner')` resolves (implicit role for `<header>` when not nested inside `<main>` / `<article>`).
2. With `onBack` provided: renders a `<button>` (not `<a>`) with accessible name "Back". `userEvent.click` calls the `onBack` callback exactly once. Asserts via `getByRole('button', { name: /back/i })`.
3. Without `onBack`: renders an `<a>` with accessible name "Home" and `href="#"`. No click handler asserted (prototype non-functional).
4. Renders `ProgressPill` with the passed `step` + `total` props (assert via `getByRole('progressbar')` + `aria-valuenow` / `aria-valuemax`).
5. Right slot: renders a 36px-wide `aria-hidden` div. Assert via `container.querySelector('[aria-hidden="true"]')` width.
6. focus-visible class: `userEvent.tab()` focuses the Back button; assert the focus-visible style applies via `:focus-visible` selector match.
7. `total` defaults to `TOTAL_STEPS` when omitted (assert progressbar `aria-valuemax === TOTAL_STEPS`).

No screen-level test rewrites required for Batch A — each screen's existing `__tests__/O{N}.test.tsx` (if present) should continue to pass once the local TopBar is replaced. If a screen's existing tests assert local TopBar internals (e.g. specific class names), they get updated to assert via the shared TopBar's stable selectors instead.

**AC-4: Visual + a11y verification on preview deploy.**

Per spec 72a 6-dimension rubric, captured in `verification.md` §"Preview-deploy verification". Manual checks:
- Golden path: walk all 8 screens, confirm TopBar renders identically across (modulo the Back/Home left-slot variant on O1).
- prefers-reduced-motion: TopBar has no motion of its own; passes trivially.
- Keyboard-only: Tab focus order through TopBar is Back/Home → ProgressPill (skipped, not focusable) → 36px spacer (skipped). Focus-visible ring renders on Back/Home only.
- Mobile viewport (375×667): TopBar fits the 480px-capped layout with no overflow.
- Screen reader: `<header>` announces as "banner landmark"; Back announces as "button"; Home announces as "link". ProgressPill announces as "progressbar, step X of Y".

**AC-5: No regression in screen-level chassis surfaces (Hero, Footer, content area).**

Batch A is TopBar-only. After the swap:
- All 8 screens' Hero regions render identically to pre-batch (no diff in Hero typography, padding, eyebrow treatment).
- All footers render identically to pre-batch (O8's lighter blur, O7's PlanFooter content-block, sticky-cream chassis on others — all preserved for Batch B / C).
- Content sections render identically.
- No CSS bleed from the new `TopBar.module.css` into screen modules.

Smoke check: visit O1-O8 on preview deploy, diff visual treatment against pre-batch screenshots (or memory if pre-batch screenshots not captured). Differences scoped to TopBar only.

## Out of scope (deferred to other batches)

- **Hero / Footer / `<main>` / Dead-code / Token-promotion:** Batches B / C / D / E / F respectively.
- **`colors` const centralisation** (F-NM-05): the per-screen `colors` const stays; key-pruning happens after Hero/Footer batches make those keys fully unused, then Batch F at production graduation centralises.
- **O7 `MobileSectionHeader` + `Eyebrow` helpers** in O7.tsx: these are NOT TopBar helpers — they're Hero/content-section helpers. Stay in place for Batch B.
- **O8's `PlanRecall` chip** between TopBar and Hero: NOT a TopBar concern. Stays in place; reconsidered in Batch C or its own micro-slice.
- **`100vh` → `100dvh` sweep** and **44×44 tap-target sweep**: production-graduation backlog, Batch F.
- **O7 visual issues** flagged at merge time but not enumerated: surface during Batch B/C preview-deploy iteration (per audit slice §"Still open").

## Pre-flight

Adversarial-review budget (CLAUDE.md §"Engineering conventions"): this acceptance.md ~150L. Single sub-spawn covers it. Auto-review at PR-open fans out 3 specialists (security · correctness · style); prototype-readiness substitutes correctness per spec 76 §3.

Linked canvas: **omitted** per canvas-as-source default policy. No verbatim canvas quoting required. Visual treatment of the shared TopBar inherits from the canonical sub-cluster decisions made in Phase 2 (O3-O6 modal values).

DoD per CLAUDE.md §"Definition of Done" prototype short-form (items 1, 8, 12, 14 from spec 72 §11):
1. All 5 ACs met with evidence per AC in `verification.md`.
2. Tests written + passing (AC-3).
3. Adversarial review at PR-open: 3-specialist auto-review verdict `approve` or `nit-only`.
4. Preview-deploy 6-dimension verified per spec 72a (AC-4).
