# S-PROTO-how-it-works-shell

**Category:** prototype

## Intent

Ship a placeholder shell page at `/dev/proto/how-it-works` so the hub link resolves to a tailored route rather than the `[slug]` stub. Light scaffold: title + sub + 4 numbered-step placeholders + back-to-hub link. Real content lands in a subsequent canvas-port slice when the source canvas exists at `docs/design-source/how-it-works/`.

Out of scope:
- Canvas-port content (deferred to follow-up slice).
- Mobile responsive breakpoints.
- A11y deep-pass (folded into the system-wide holistic pass).
- Registry status promotion (the row stays `canvas-drafted` — placeholder shell is not canvas-built content).

## Acceptance criteria

**AC-1.** Route `/dev/proto/how-it-works` resolves to a literal-slug subroute at `src/app/dev/proto/how-it-works/page.tsx` (precedence over the `[slug]` stub). *Evidence:* file exists; `'use client'` declared; default-exports `HowItWorksPage`.

**AC-2.** Page renders title `"How it works"` (serif H1) and sub `"Decouple — the complete picture, end-to-end."`. *Evidence:* `<h1>` + sub-`<p>` in `page.tsx`.

**AC-3.** Four numbered-step placeholders render (Disclose · Reconcile · Settle · Finalise), each with a 2-digit number, kicker, title, and body. *Evidence:* `STEPS` const + `<ol>` map in `page.tsx`.

**AC-4.** Back-to-hub `<Link href="/dev/proto">` renders at the top of the page. *Evidence:* `<nav>` + `<Link>` in `page.tsx`.

**AC-5.** Footer placeholder note acknowledges the shell is provisional and content will be replaced via a future slice. *Evidence:* `<footer>` element at the bottom of `page.tsx`.

**AC-6.** Token references only (no bare-hex). Uses `tokens.color.*`, `tokens.font.*`, `tokens.type.*`, `tokens.weight.*`, `tokens.letterSpacing.*`, `tokens.color.border` per `src/styles/tokens.ts`. *Evidence:* `import { tokens } from '@/styles/tokens'` + token refs throughout.

**AC-7.** Unit smoke test asserts:
- Title text renders.
- Sub text renders.
- All 4 step kickers render (Disclose / Reconcile / Settle / Finalise).
- Back-to-hub link renders with `href="/dev/proto"`.

## Definition of Done

1. All ACs met; per-AC evidence in `verification.md`.
2. Tests written + passing (smoke test for AC-7).
3. Adversarial review done (or explicitly waived: shell-only, no logic surface).
4. Preview deploy verified — pending user walk.
5. No regression in adjacent slices.
6. No open registry questions in scope.

`security.md` short-form items 1, 8, 12, 14 per `prototype` category.

## Status

Drafted.
