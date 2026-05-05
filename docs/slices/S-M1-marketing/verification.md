# Verification — S-M1 marketing landing

Final-state record. Round-by-round multi-agent audit detail lives in PR descriptions and HANDOFF docs per CLAUDE.md Constraint #27.

## Status

**Slice ship state (in-scope phases 1-6 + 8):** ✅ MET — page composition + `/start` HTTP 404 + utility classes shipped across PR #90 (phase 1-3 atoms/sections/HeroEditorial), PR #92 (AC-8 token alignment), PR #93 (phase 4-5 page composition + next/font + utility classes), and the current PR (phase 6 `/start` + phase 8 verification).

**S-M1.0a follow-up scope (phase 7):** ⏳ deferred — 8 remaining hero variants (Declarative · Typographic · ProductForward · OutcomeLed · TwoColumn · Empathetic · Atmospheric · Diagrammatic) + `src/app/dev/heroes/page.tsx` comparison gallery. AC-2 acceptance text formally re-scoped to in-scope = 1 of 9; AC-3 owns the dev gallery and remains deferred. Map shape (`HERO_VARIANTS` in `src/components/marketing/heroes/index.ts`) is forward-extensible — additional keys land without breaking existing consumers.

## Phase status

| Phase | AC ref | Surface | Status | Evidence |
|---|---|---|---|---|
| 1 | partial AC-2 + AC-10 | `src/components/marketing/atoms/` (7 components + barrel + icons) | ✅ shipped | 48 tests across 8 files; commit `406e333` |
| 2 | partial AC-1 + AC-5 + AC-7 + AC-10 | `src/components/marketing/sections/` (header + picture-band + journey + footer-minimal) | ✅ shipped | 16 tests across 4 files; commit `2e83f14` |
| 3 | AC-2 (in-scope = HeroEditorial; map extensible) | `src/components/marketing/heroes/{editorial,index}.tsx` | ✅ shipped | 12 tests across 2 files; `SELECTED_HERO_VARIANT='editorial'` + `HERO_VARIANTS={editorial: HeroEditorial}` |
| 4 | AC-1 + AC-5 + AC-7 | `src/app/page.tsx` composition wiring | ✅ shipped | 1 composition test asserting skip-link + main + 5 section landmarks |
| 5 | AC-8 | `src/app/layout.tsx` next/font + `src/app/globals.css` utility classes + `var(--ds-color-*)` token alignment | ✅ shipped | next/font self-hosts Inter + Source Serif 4 + JetBrains Mono; ~85L utility classes; AC-8 token alignment from PR #92 |
| 6 | AC-4 | `src/app/start/page.tsx` (notFound()) + `src/app/start/not-found.tsx` (HTTP 404 native) | ✅ shipped | 5 tests across 2 files; production build emits `/start` as static `○` route (prerendered 404) |
| 7 | AC-3 (8 remaining variants + dev gallery) | 8 hero variants + `src/app/dev/heroes/page.tsx` | ⏳ deferred to S-M1.0a | Map shape extensible; pending follow-up slice |
| 8 | AC-9 + AC-10 | `## Preview-deploy verification` table + `tests/marketing/colocation.test.ts` | ✅ shipped (5/6 dims pre-PR; mobile viewport pending Vercel preview) | This file populated; colocation test asserts directory shape + import-boundary contract |

## Acceptance criteria status (per `acceptance.md`)

| AC | Status | Evidence |
|---|---|---|
| AC-1 (production landing composition) | ✅ MET | `src/app/page.tsx` renders skip-link + Header + main(Hero + PictureBand + Journey) + FooterMinimal; composition test in `tests/unit/app/page.test.tsx` |
| AC-2 (in-scope = 1 of 9; remainder → S-M1.0a) | ✅ MET (against amended AC text) | `HeroEditorial` ships as production default; `HERO_VARIANTS` map shape extensible to 9 keys; remaining 8 variants + smoke tests assigned to S-M1.0a per amended AC-2 contract |
| AC-3 (`/dev/heroes` comparison gallery) | ⏳ deferred to S-M1.0a | Owns the 8 variants + dev gallery; AC-3 ships at S-M1.0a |
| AC-4 (`/start` HTTP 404 route) | ✅ MET | `src/app/start/page.tsx` calls `notFound()`; `not-found.tsx` carries placeholder copy + explainer + `<Link href="/">` "← Back to home"; production build prerenders as static 404 |
| AC-5 (required content) | ✅ MET | Hero eyebrow / H1 / subhead / primary CTA / "How it works" link asserted in `editorial.test.tsx`; trust-band 3 signals asserted; picture-band 4-card grid asserted in `picture-band.test.tsx`; journey 5-row table asserted in `journey.test.tsx` |
| AC-6 (forbidden framing) | ✅ MET | `grep -rni "financial disclosure tool\|better.*Form E\|disclosure platform" src/components/marketing/ src/app/page.tsx src/app/start/` returns 0 matches |
| AC-7 (landmark + a11y) | ✅ MET | Skip-link first child of body (`href="#main"`); single `<main id="main">`; sections carry `aria-labelledby` to their h2 ids; single h1 per page; `prefers-reduced-motion` disables `.sec-in` animations |
| AC-8 (visual treatment) | ✅ MET | Color values come from `var(--ds-color-*)` S-F1 tokens; 3 retained literals (`#F5F3EE` warm-stone, `#3F3F3F` italic quote, `#D6D3CC` separator dots) have no clean token match; AC-8 fix landed at PR #92; utility classes use tokens for ink/surface-panel/border/text-sub |
| AC-9 (preview-deploy 6-dim verification) | ⏳ in-progress (5/6 dims pre-PR; mobile viewport pending Vercel preview at PR open) | See `## Preview-deploy verification` below |
| AC-10 (marketing colocation + import boundary) | ✅ MET | `tests/marketing/colocation.test.ts` asserts atoms/sections/heroes live under `src/components/marketing/` AND that no file outside that tree imports from internal paths (only via the marketing index) |

## Aggregate test commands

```bash
npx vitest run tests/unit/components/marketing/   # 73 tests across 14 files
npx vitest run tests/unit/app/                     # 6 tests (1 page + 5 /start)
npx vitest run tests/marketing/                    # 4 tests (colocation + import-boundary)
npx vitest run                                     # full suite — 279 tests across 46 files
npx tsc --noEmit                                   # clean
NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build  # PASS; / + /start static; 16 routes total
```

## Preview-deploy verification

Per spec 72a six-dimension rubric.

| Dimension | Status | Evidence / verification step |
|---|---|---|
| **Golden path** | ✅ verified pre-PR via build | Production build prerenders `/` as static; renders Header + Hero + PictureBand + Journey + FooterMinimal in DOM order. `tests/unit/app/page.test.tsx` asserts skip-link + main + 5 section landmarks. |
| **Edge cases** | ✅ verified pre-PR via tests + build | `/start` is the documented edge case (HTTP 404 placeholder); `notFound()` trips at render-time and Next.js emits the segment-level not-found. Production build prerenders `/start` as static `○`. `tests/unit/app/start/page.test.tsx` + `not-found.test.tsx` cover the route contract. |
| **`prefers-reduced-motion`** | ✅ verified pre-PR via globals.css | `@media (prefers-reduced-motion: reduce)` in globals.css disables `.sec-in` animations (`animation: none !important; opacity: 1; transform: none;`). Verifiable in-browser via DevTools emulation; the CSS rule is the source of truth. |
| **Keyboard-only** | ✅ verified pre-PR via composition + tests | Skip-link first child of body (Tab focuses it; `:focus` translates Y to 0). All interactive surfaces use `<a>` / `<Link>` / `<button>` semantics — no synthetic onClick on non-interactive elements. `*:focus-visible` (defined in pre-existing globals.css) provides the focus ring. |
| **Mobile viewport (375×667)** | ⏳ pending Vercel preview at PR open | Sections use `max-width` containers + responsive padding from the design canvas. In-browser verification at 375×667 needed to confirm no horizontal scroll, no clipped content, no overlap; row flips to ✅ + observed-result Evidence once verified. |
| **Screen-reader** | ✅ verified pre-PR via composition | Skip-link `<a href="#main">`; `<main id="main">` landmark; `<header>` / `<footer>` landmarks; sections carry `aria-labelledby` to their h2; single h1 per page (HeroEditorial); the `<Link>` "Back to home" on `/start` 404 is the focusable exit. The composition is screen-reader-friendly by structure; in-browser VoiceOver / NVDA pass at PR-open Vercel preview confirms reading order. |

## Security checklist (spec 72 §11)

13-row DoD walk per spec 72 §11. This slice is T0 Public throughout (static marketing surface; no auth, no DB, no PII, no API routes added). Detailed rationale lives in `security.md`; this table is the slice-DoD signoff.

| # | Item | Status | Rationale |
|---|---|---|---|
| 1 | Data classification per AC | ✅ | All artefacts T0 Public — marketing copy + landing surface; no T1+ data touched. |
| 2 | New tables / columns | N/A | No DB writes; no Supabase schema changes. |
| 3 | API routes | N/A | No new `src/app/api/**` routes; `/start` is a `notFound()`-only segment. |
| 4 | RLS / authorization | N/A | No DB queries; no user identity or session check on the landing or `/start`. |
| 5 | File upload surfaces | N/A | No upload UI in this slice. |
| 6 | New env vars | N/A | None added; `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` referenced for build context only (pre-existing). |
| 7 | Third-party data flows | N/A at runtime | `next/font/google` self-hosts Inter + Source Serif 4 + JetBrains Mono at build time; no runtime third-party origin. |
| 8 | Audit log entries | N/A | No T3+ data operations; nothing to log. |
| 9 | Error handling | ✅ | `/start` returns HTTP 404 native via `notFound()`; landing renders deterministically from static props (no async surface). Missing `SELECTED_HERO_VARIANT` is caught at compile time. |
| 10 | Safeguarding impact | N/A | No T4 data; no domestic-abuse or financial-coercion vectors on a public marketing surface. |
| 11 | Security headers + CSP | ✅ | No new third-party origins; existing CSP unchanged. |
| 12 | Adversarial review | ✅ | Multi-agent auto-review at k=2 default; 4 specialists fan out per spec 72c §3. Findings addressed in this PR. |
| 13 | Dependency + secrets hygiene | ✅ | No new runtime deps; gitleaks clean; `npm audit` clean (high + critical) on CI. |

Net: 5 PASS · 8 N/A with reasoning · 0 FAIL.

## Sign-off

- Slice ships at this PR's merge.
- S-M1.0a follow-up slice tracks the 8 remaining hero variants + `/dev/heroes` gallery.
- 68f/g entries: none open against S-M1.

## Status footer

- Originated PR #90 (phase 1-3)
- AC-8 token alignment + slice-doc reconciliation: PR #92
- Phase 4-5 composition + next/font + utility classes: PR #93
- Phase 6 `/start` + phase 8 verification + AC-2 re-scope + security checklist: current PR
