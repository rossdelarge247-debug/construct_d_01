# S-PROTO-pricing-shell — verification

## Per-AC evidence

**AC-1.** `src/app/dev/proto/pricing/page.tsx` exists. L1 `'use client'`; L34 `export default function PricingPage()`.

**AC-2.** L57-71 `<header>` carries `<h1>One settlement. Two paths.</h1>` (serif, 40px, semibold, letter-spacing -0.02em) + `<p>` referencing the £14,561 solicitor-led baseline.

**AC-3.** L6-31 `TIERS` const declares 2 tier objects (`Start` / `Complete`); L73-77 `<div>` uses CSS Grid with `gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'` — 2-column at ≥560px viewport, stacked below.

**AC-4.** Per-tier: H2 (L84-92), price + cadence row (L93-104), bullet list (L105-119), CTA button with `disabled` attribute (L120-139). Primary tier (`Complete`) gets inverted button styling (ink background, panel text); secondary tier (`Start`) gets outline-only styling.

**AC-5.** L45-52 `<nav>` carries `<Link href="/dev/proto">← back to hub</Link>`.

**AC-6.** L142-152 `<footer>` carries the pricing-decision deferral note.

**AC-7.** `grep -E "'#[0-9A-Fa-f]" src/app/dev/proto/pricing/page.tsx` returns zero matches.

**AC-8.** `tests/unit/proto-pricing/shell.test.tsx` — 6 specs (title · sub · tier names · tier prices · back-to-hub link · CTA disabled state).

## Preview-deploy verification

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending user-walk | Sandbox can't reach Vercel preview. |
| Edge cases | N/A | No stateful UI. |
| `prefers-reduced-motion` | N/A | No motion. |
| Keyboard-only | Pending user-walk | Tab order: nav → tier 1 CTA (disabled) → tier 2 CTA (disabled) → footer. Disabled buttons skipped by default tab order. |
| Mobile viewport | Pending user-walk | Grid `auto-fit minmax(280px, 1fr)` stacks below 560px. |
| Screen-reader | Pending user-walk | Semantic markup (`<nav>` / `<header>` / `<h1>` / `<h2>` / `<article>` per tier / `<ul>` / `<button>` / `<footer>`). |

## Adversarial review

Static markup shell; no logic surface; no inputs; no external calls. CTAs render disabled with no behaviour. Adversarial review waived; real review fires when canvas content + CTA wiring land in the follow-up slice.

## Status

Shipped after tests pass + commit.
