# S-PROTO-pricing-shell

**Category:** prototype

## Intent

Ship a placeholder shell page at `/dev/proto/pricing` so the hub link resolves to a tailored route rather than the `[slug]` stub. Light scaffold: title + sub + 2 tier-card placeholders ("Start" free / "Complete" from £800) + back-to-hub link. Real content lands in a subsequent canvas-port slice once the pricing decision is unblocked — the registry tracks this as an open question against `docs/workspace-spec/56-launch-readiness.md`.

Out of scope:
- Final pricing copy (registry-deferred).
- Canvas-port content (deferred to follow-up slice).
- Mobile responsive deep-pass.
- CTA wiring — buttons render disabled.
- A11y deep-pass (folded into the system-wide holistic pass).

## Acceptance criteria

**AC-1.** Route `/dev/proto/pricing` resolves to a literal-slug subroute at `src/app/dev/proto/pricing/page.tsx`. *Evidence:* file exists; `'use client'`; default-exports `PricingPage`.

**AC-2.** Page renders title `"One settlement. Two paths."` (serif H1) and sub referencing the £14,561 solicitor-led baseline (positioning anchor per CLAUDE.md §"Product positioning"). *Evidence:* `<h1>` + sub-`<p>` in `page.tsx`.

**AC-3.** Two tier cards render side by side at ≥560px viewport (CSS Grid `auto-fit, minmax(280px, 1fr)`); stack on narrower viewports. Tier 1 ("Start") and Tier 2 ("Complete"). *Evidence:* `TIERS` const + `<div>` grid + 2× `<article>` cards.

**AC-4.** Each tier card carries: tier name (H2), price + cadence, 3–4 bullet placeholders, primary/secondary-styled CTA button. CTA buttons render with `disabled` + `aria-disabled` styling (placeholder; wiring deferred). *Evidence:* per-card structure in `page.tsx`.

**AC-5.** Back-to-hub `<Link href="/dev/proto">` renders at the top of the page.

**AC-6.** Footer placeholder note acknowledges the registry's pricing-decision deferral.

**AC-7.** Token references only (no bare-hex). Uses `tokens.color.*`, `tokens.font.*`, `tokens.type.*`, `tokens.radius.*`.

**AC-8.** Unit smoke test asserts:
- Title text renders.
- Sub text renders.
- Both tier names render.
- Both tier prices render.
- Back-to-hub link renders with `href="/dev/proto"`.
- Both CTA buttons render with `disabled` attribute.

## Definition of Done

1. All ACs met; per-AC evidence in `verification.md`.
2. Tests written + passing (smoke test for AC-8).
3. Adversarial review done (or explicitly waived: shell-only, no logic surface).
4. Preview deploy verified — pending user walk.
5. No regression in adjacent slices.
6. Pricing-decision deferral noted in page footer + `verification.md`.

`security.md` short-form items 1, 8, 12, 14 per `prototype` category.

## Status

Drafted.
