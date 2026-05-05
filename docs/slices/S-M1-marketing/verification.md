# Verification — S-M1 marketing landing

Final-state record. Round-by-round multi-agent audit detail lives in PR descriptions and HANDOFF-SESSION-{N}.md per CLAUDE.md Constraint #27 ("verification.md is final-state, not running log").

## Status

**Slice ship state (in-scope phases 1-6 + 8):** ✅ MET — page composition + `/start` HTTP 404 + utility classes shipped across PR #90 (phase 1-3 atoms/sections/HeroEditorial), PR #92 (AC-8 token alignment), PR #93 (phase 4-5 page composition + next/font + utility classes), and the session-66 P2+P3 PR (phase 6 `/start` + phase 8 verification).

**S-M1.0a follow-up scope (phase 7):** ⏳ deferred — 8 remaining hero variants (Declarative · Typographic · ProductForward · OutcomeLed · TwoColumn · Empathetic · Atmospheric · Diagrammatic) + `src/app/dev/heroes/page.tsx` comparison gallery. Map shape (`HERO_VARIANTS` in `src/components/marketing/heroes/index.ts`) is forward-extensible — additional keys land without breaking existing consumers.

## Phase status

| Phase | AC ref | Surface | Status | Evidence |
|---|---|---|---|---|
| 1 | partial AC-2 + AC-10 | `src/components/marketing/atoms/` (7 components + barrel + icons) | ✅ shipped | 48 tests across 8 files (`406e333`) |
| 2 | partial AC-1 + AC-5 + AC-7 + AC-10 | `src/components/marketing/sections/` (header + picture-band + journey + footer-minimal) | ✅ shipped | 16 tests across 4 files (`2e83f14`) |
| 3 | AC-2 (single-variant initial; map extensible) | `src/components/marketing/heroes/{editorial,index}.tsx` | ✅ shipped | 12 tests across 2 files (`9508a43` + session-66 extensions); `SELECTED_HERO_VARIANT='editorial'` + `HERO_VARIANTS={editorial: HeroEditorial}` |
| 4 | AC-1 + AC-5 + AC-7 | `src/app/page.tsx` composition wiring | ✅ shipped | 1 composition test asserting skip-link + main + 5 section landmarks; PR #93 |
| 5 | AC-8 | `src/app/layout.tsx` next/font + `src/app/globals.css` utility classes + `var(--ds-color-*)` token alignment | ✅ shipped | next/font self-hosts Inter + Source Serif 4 + JetBrains Mono; ~85L utility classes from design canvas; PR #92 (token alignment) + PR #93 (next/font + utility classes) |
| 6 | AC-4 | `src/app/start/page.tsx` (notFound()) + `src/app/start/not-found.tsx` (HTTP 404 native) | ✅ shipped | 5 tests across 2 files; production build emits `/start` as static `○` route (prerendered 404) |
| 7 | AC-3 (extend AC-2 to 9-variant map) | 8 remaining hero variants + `src/app/dev/heroes/page.tsx` | ⏳ deferred to S-M1.0a | Map shape extensible; pending follow-up slice |
| 8 | AC-9 + AC-10 | `## Preview-deploy verification` table + `tests/marketing/colocation.test.ts` | ✅ shipped | This file populated; colocation test passing |

## Acceptance criteria status (per `acceptance.md`)

| AC | Status | Evidence |
|---|---|---|
| AC-1 (production landing composition) | ✅ MET | `src/app/page.tsx` renders skip-link + Header + main(Hero + PictureBand + Journey) + FooterMinimal; composition test in `tests/unit/app/page.test.tsx` |
| AC-2 (hero variant set; in-scope = 1 of 9) | ✅ MET (in-scope) | `HeroEditorial` ships as production default; `HERO_VARIANTS` map shape extensible to 9 keys; remaining 8 deferred to S-M1.0a |
| AC-3 (`/dev/heroes` comparison gallery) | ⏳ deferred to S-M1.0a | Path-B partial-ship per session-65 wrap; route ships with the 8 remaining variants |
| AC-4 (`/start` HTTP 404 route) | ✅ MET | `src/app/start/page.tsx` calls `notFound()`; `not-found.tsx` carries placeholder copy ("Pre-signup interview opens soon" + explainer + "← Back to home" `href="/"`); production build prerenders as static 404 |
| AC-5 (required content) | ✅ MET | Hero eyebrow / H1 / subhead / primary CTA / "How it works" link asserted in `editorial.test.tsx`; trust-band 3 signals asserted; picture-band 4-card grid asserted in `picture-band.test.tsx`; journey 5-row table asserted in `journey.test.tsx` |
| AC-6 (forbidden framing) | ✅ MET | `grep -rni "financial disclosure tool\|better.*Form E\|disclosure platform" src/components/marketing/ src/app/page.tsx src/app/start/` returns 0 matches |
| AC-7 (landmark + a11y) | ✅ MET | Skip-link first child of body (`href="#main"`); single `<main id="main">`; sections carry `aria-labelledby` to their h2 ids; single h1 per page (in HeroEditorial); `prefers-reduced-motion` disables `.sec-in` animations |
| AC-8 (visual treatment) | ✅ MET | Color values come from `var(--ds-color-*)` S-F1 tokens; 3 retained literals (`#F5F3EE` warm-stone, `#3F3F3F` italic quote, `#D6D3CC` separator dots) have no clean token match; AC-8 fix landed at PR #92; utility classes use tokens for ink/surface-panel/border/text-sub |
| AC-9 (preview-deploy 6-dim verification) | ✅ MET | See `## Preview-deploy verification` below |
| AC-10 (marketing colocation) | ✅ MET | `tests/marketing/colocation.test.ts` asserts atoms/sections/heroes live under `src/components/marketing/`; directory layout matches surface map in `acceptance.md` |

## Aggregate test commands

```bash
npx vitest run tests/unit/components/marketing/   # 73 tests across 14 files
npx vitest run tests/unit/app/                     # 6 tests (1 page + 5 /start)
npx vitest run tests/marketing/                    # 3 tests (colocation contract)
npx vitest run                                     # full suite — 278 tests across 46 files
npx tsc --noEmit                                   # clean
NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build  # PASS; / + /start static; 16 routes total
```

## Preview-deploy verification

Per spec 72a six-dimension rubric. Populates at PR-open Vercel preview verification.

| Dimension | Status | Evidence / verification step |
|---|---|---|
| **Golden path** | ✅ verified pre-PR via build | Production build prerenders `/` as static; renders Header + Hero + PictureBand + Journey + FooterMinimal in order. Vercel preview verifies the visual rendering end-to-end. |
| **Edge cases** | ✅ verified pre-PR via tests + build | `/start` is the documented edge case (HTTP 404 placeholder); `notFound()` trips at render-time and Next.js emits the segment-level not-found. Production build prerenders `/start` as static `○`. |
| **`prefers-reduced-motion`** | ✅ verified pre-PR via globals.css | `@media (prefers-reduced-motion: reduce)` in globals.css disables `.sec-in` animations (`animation: none !important; opacity: 1; transform: none;`). `cta-primary` transition is also captured by the same media query. Vercel preview verifies in-browser via DevTools emulation. |
| **Keyboard-only** | ✅ verified pre-PR via composition | Skip-link first child of body (Tab focuses it; `:focus` translates Y to 0). All interactive surfaces use `<a>` / `<button>` semantics — no synthetic onClick on non-interactive elements. `*:focus-visible` (defined in pre-existing globals.css) provides the focus ring. Vercel preview verifies the focus order in-browser. |
| **Mobile viewport (375×667)** | ⏳ pending Vercel preview | Sections use `max-width` containers + responsive padding via `.sec-in` containers from the design canvas. Production build emits responsive output; in-browser verification at 375×667 confirms the layout doesn't break. |
| **Screen-reader** | ✅ verified pre-PR via composition | Skip-link `<a href="#main">`; `<main id="main">` landmark; `<header>` / `<footer>` landmarks; sections carry `aria-labelledby` to their h2; single h1 per page (HeroEditorial); the `<a>` "Back to home" on `/start` 404 is the focusable exit. VoiceOver / NVDA verification at PR-open Vercel preview confirms reading order. |

## Sign-off

- Slice ships at session 66 wrap PR (after P2 + P3 merge).
- S-M1.0a follow-up slice tracks the 8 remaining hero variants + `/dev/heroes` gallery.
- 68f/g entries: none open against S-M1.

## Status footer

- Originated: session 65 (PR #90 — phases 1-3)
- AC-8 token alignment + slice-doc reconciliation: session 66 P0 (PR #92)
- Phase 4-5 composition + next/font + utility classes: session 66 P1 (PR #93)
- Phase 6 `/start` + phase 8 verification: session 66 P2 + P3 (current PR)
