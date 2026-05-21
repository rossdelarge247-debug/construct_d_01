# S-PROTO-faq-trust-shell — verification

## Per-AC evidence

**AC-1.** `src/app/dev/proto/faq-trust/page.tsx` exists. L1 `'use client'`; L21 `export default function FaqTrustPage()`.

**AC-2.** L43-58 `<header>` carries `<h1>Questions answered.</h1>` (serif, 40px, semibold) + `<p>Trust through transparency.</p>` (sub).

**AC-3.** L60-95 `<section aria-labelledby="faq-heading">` carries `<h2 id="faq-heading">Frequently asked</h2>` + `<dl>` with 3 `<div>` wrappers around `<dt>`/`<dd>` pairs from `FAQS` const (L6-10).

**AC-4.** L97-133 `<section aria-labelledby="trust-heading">` carries `<h2 id="trust-heading">Trust signals</h2>` + `<ul>` with 3 `<li>` from `TRUST_SIGNALS` const (L12-16). Labels render via mono-styled `<div>` with `textTransform: 'uppercase'`.

**AC-5.** L33-40 `<nav>` carries `<Link href="/dev/proto">← back to hub</Link>`.

**AC-6.** L135-146 `<footer>` carries the FAQ + trust-source TBD note.

**AC-7.** `grep -E "'#[0-9A-Fa-f]" src/app/dev/proto/faq-trust/page.tsx` returns zero matches.

**AC-8.** Verified inline in AC-3 + AC-4 evidence (both `<section>` elements carry the `aria-labelledby` attribute).

**AC-9.** `tests/unit/proto-faq-trust/shell.test.tsx` — 7 specs (title · sub · 3 FAQ questions · 3 trust-signal labels · back-to-hub link · FAQ aria-labelledby · trust aria-labelledby).

## Preview-deploy verification

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending user-walk | Sandbox can't reach Vercel preview. |
| Edge cases | N/A | No stateful UI. |
| `prefers-reduced-motion` | N/A | No motion. |
| Keyboard-only | Pending user-walk | Tab order: nav → no other focusables (FAQ/trust are content-only); semantic landmarks for SR navigation. |
| Mobile viewport | Pending user-walk | `max-w-3xl` constraint; no responsive breakpoints. |
| Screen-reader | Pending user-walk | `<dl>`/`<dt>`/`<dd>` for FAQs (semantic Q&A pairs); `<section aria-labelledby="...">` × 2; H1 → H2 hierarchy clean. |

## Adversarial review

Static markup shell; no logic surface; no inputs; no external calls. Adversarial review waived; real review fires when canvas content lands in the follow-up slice.

## Status

Shipped after tests pass + commit.
