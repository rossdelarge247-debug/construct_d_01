# S-PROTO-faq-trust-shell

**Category:** prototype

## Intent

Ship a placeholder shell page at `/dev/proto/faq-trust` so the hub link resolves to a tailored route rather than the `[slug]` stub. Light scaffold: title + sub + 3 FAQ placeholders + 3 trust-signal placeholders + back-to-hub link. Real content lands in a subsequent canvas-port slice when the source canvas exists.

Out of scope:
- Final FAQ copy.
- Trust-signal source citations (registry open question: *"Which questions surface; trust-signal sources?"*).
- Canvas-port content (deferred to follow-up slice).
- Mobile responsive deep-pass.
- A11y deep-pass (folded into the system-wide holistic pass).

## Acceptance criteria

**AC-1.** Route `/dev/proto/faq-trust` resolves to a literal-slug subroute at `src/app/dev/proto/faq-trust/page.tsx`. *Evidence:* file exists; `'use client'`; default-exports `FaqTrustPage`.

**AC-2.** Page renders title `"Questions answered."` (serif H1) and sub `"Trust through transparency."`.

**AC-3.** FAQ section renders with H2 `"Frequently asked"` and 3 question/answer pairs using `<dl>` / `<dt>` / `<dd>` semantics. Each `<dt>` carries a placeholder question; each `<dd>` carries a placeholder answer.

**AC-4.** Trust-signals section renders with H2 `"Trust signals"` and 3 mono-label-prefixed list items. Labels: `READ-ONLY BANK ACCESS` · `SOLICITOR-REVIEWABLE` · `UK-JURISDICTION FIRST`.

**AC-5.** Back-to-hub `<Link href="/dev/proto">` renders at the top of the page.

**AC-6.** Footer placeholder note acknowledges FAQ + trust-source TBD.

**AC-7.** Token references only (no bare-hex). Uses `tokens.color.*`, `tokens.font.*`, `tokens.type.*`, `tokens.weight.*`, `tokens.letterSpacing.*`.

**AC-8.** Both sections carry `aria-labelledby` referencing their H2 ids (`faq-heading` and `trust-heading`).

**AC-9.** Unit smoke test asserts:
- Title text renders.
- Sub text renders.
- All 3 FAQ questions render.
- All 3 trust-signal labels render.
- Back-to-hub link renders with `href="/dev/proto"`.
- FAQ section has `aria-labelledby="faq-heading"`.
- Trust section has `aria-labelledby="trust-heading"`.

## Definition of Done

1. All ACs met; per-AC evidence in `verification.md`.
2. Tests written + passing.
3. Adversarial review done (or explicitly waived: shell-only, no logic surface).
4. Preview deploy verified — pending user walk.
5. No regression in adjacent slices.
6. Registry open question logged in slice deferrals.

`security.md` short-form items 1, 8, 12, 14 per `prototype` category.

## Status

Drafted.
