# S-PROTO-header-standalone-consistency · verification

Prototype-category slice. DoD-14 short-form (items 1, 8, 12, 14); spec 76 §3 short-form mapping.

## AC-1 — Shared `BrandBar` component renders verbatim canvas treatment

Evidence: `src/app/dev/proto/pre-signup-interview/components/BrandBar.tsx` source. Renders one centred `<div className="flex items-center justify-center pt-1 pb-2">` containing a single `<span>` with inline style `{ fontFamily: tokens.font.sans, fontSize: 14, fontWeight: 700, color: tokens.color.ink, letterSpacing: '-0.02em' }` and text content `Decouple.`. Matches canvas L1047-1052 verbatim. Unit tests at `tests/unit/proto-pre-signup/brand-bar.test.tsx` assert (a) the literal text content `Decouple.`, (b) the rendered element is a `<span>` (non-interactive — not a button, not a link), (c) the four typography style properties (fontFamily contains `Inter`, fontSize `14px`, fontWeight `700`, letterSpacing `-0.02em`).

Status: TBD pending impl.

## AC-2 — ScreenShell.tsx renders BrandBar (O1, O3-O8 coverage)

Evidence: diff at `src/app/dev/proto/pre-signup-interview/components/ScreenShell.tsx`. `BrandBar` imported from `./BrandBar`; rendered as the first child of `<main>` before the existing `<header>` row. Existing chrome preserved verbatim: back button (with `useState(backFocused)` + focus-visible outline + 44×44 touch target + chevron SVG + "Back" label), `<ProgressPill step={step} />`, 36px spacer, header `paddingBottom: 12` + `borderBottom: 1px solid tokens.color.border`. Existing main styling preserved: `maxWidth: 480`, `padding: '64px 20px 48px'`, `gap: 28`, `display: flex`, `flexDirection: column`, `minHeight: '100vh'`, `boxSizing: 'border-box'`. Unit test in `brand-bar.test.tsx` renders `<ScreenShell step={1} heading="Test" ...>` and asserts the text `Decouple.` is present in the rendered DOM.

Status: TBD pending impl.

## AC-3 — O2.tsx renders BrandBar (canvas-as-source O2 coverage)

Evidence: diff at `src/app/dev/proto/pre-signup-interview/screens/O2.tsx`. `BrandBar` imported from `../components/BrandBar`; rendered as first child of outer `<div className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6">` (outer wrapper gains `pt-6` ≈ 24px so position-from-viewport-top matches ScreenShell's 24px top padding). Existing inline `TopBar`, `Hero`, four cards, and footer untouched. Width cap `max-w-[480px]` preserved (the 480px outer cap matching `ScreenShell.tsx:33` is unchanged). Unit test in `brand-bar.test.tsx` renders `<O2 />` (wrapped in the existing `ProtoProvider` test fixture) and asserts the text `Decouple.` is present in the rendered DOM.

Status: TBD pending impl.

## AC-4 — Cross-screen consistency (preview-deploy)

Evidence: preview-deploy walk-through. Navigate O1 → O2 → O3; brand bar appears visually identical (wordmark text, typography, alignment, position-from-viewport-top) on all three. Width cap 480 holds on desktop on both surfaces. No header chrome regression on either surface. Structural identity is enforced by the shared `BrandBar` component — any divergence between O2 and the ScreenShell-based screens at preview is necessarily an outer-wrapper / padding issue, not a brand-bar-styling issue.

Status: TBD pending preview-deploy.

## Preview-deploy verification

Spec 72a six-dimension rubric plus new cross-screen consistency dimension introduced this session.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | TBD | Navigate O1 → O2 → O3 → O4 → O5; brand bar visible on every screen |
| Edge cases | TBD | Skip-back O3 → O2 → O1: brand bar persists; CTA disabled / answered states do not affect brand bar |
| `prefers-reduced-motion` | TBD | No transitions on brand bar — N/A |
| Keyboard-only | TBD | Tab order: skip brand bar (non-interactive `<span>`); first focusable element remains the back button (or first chip on O1) |
| Mobile viewport (375×667) | TBD | Brand bar fits centred in 375px; no horizontal overflow; wordmark stays single-line |
| Screen-reader | TBD | "Decouple." announced as static text; not announced as link or button |
| **Cross-screen consistency (new)** | TBD | O1 (ScreenShell) → O2 (canvas-as-source) → O3 (ScreenShell) navigation shows visually identical brand bar — typography, position, alignment all match |

## Definition of Done — prototype short-form (items 1, 8, 12, 14)

- [ ] **1.** All ACs met with evidence above
- [ ] **8.** Slice-DoD reference in PR body (`Slice references: docs/slices/S-PROTO-header-standalone-consistency/verification.md`)
- [ ] **12.** Auto-review verdict: `approve` or `nit-only` on the impl PR
- [ ] **14.** Preview-deploy verified per 6-dim+1 rubric above; user feedback received + addressed (or explicitly deferred)

## Architectural deferrals

Position-from-viewport-top alignment: ScreenShell uses `<main padding: '24px 20px 48px'>` so the BrandBar starts ≈24px from the top of the viewport. O2 outer carries `pt-6` (Tailwind = 24px) so its BrandBar sits at the same ≈24px offset. The canvas L1041-1046 status-bar (`pt-3`) + L1047-1052 brand-bar (`pt-1 pb-2`) rhythm assumes a mobile-shell context with a fake 9:41 status row eating the first ~12px; in real-browser context without that row, 24px gives the wordmark comfortable breathing room above the back/progress TopBar without the airy gap that 64px left.

Test-pain audit cleared at impl: brand-bar tests use simple `render()` + `screen.getByText('Decouple.')` assertions and inline-style readouts via `getComputedStyle`; 0 mocks required. Well below the test-pain threshold — spec 72d §3 sets the mock-count rule; spec 76 §3 raises it from >2 to >5 for prototype category.

## Status

(Lineage appended at slice ship — final-state record only per CLAUDE.md §"Definition of Done" L1.)
