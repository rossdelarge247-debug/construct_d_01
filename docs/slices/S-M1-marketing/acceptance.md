# S-M1 · Marketing landing rewrite

## Pre-flight

**Phase:** C.2 (public surfaces)
**Trigger spec:** `docs/workspace-spec/42-strategic-synthesis.md` §"The value proposition" (positioning copy backstop) + `docs/design-source/marketing-landing/Decouple.zip` (visual treatment authoritative; copy authoritative for hero/picture/journey/footer-minimal where present)
**Sizing:** L (~1500L code + ~365L tests + ~400L slice docs ≈ 2265L)
**Adversarial review budget:** spec 72b — single review pass standard since acceptance.md projected <300L; partition only if it grows past that.

## Why this slice

The public landing at `src/app/page.tsx` is a placeholder + foundation-slice demo grid. S-M1 replaces it with the marketing landing per the Claude AI Design output committed at `docs/design-source/marketing-landing/`. Combined with the document-shell primitive that already ships, S-M1 delivers the **first cohesive Vercel preview surface**.

The Claude AI Design canvas supersedes spec 42's section list — design has compare/trust/pricing/FAQ/closing-footer/mobile beyond spec 42's positioning text. This slice ships **5 production sections** (header + hero + picture + journey + footer-minimal) — the cohesive above-fold-and-immediate-below band. Sections 5-11 (compare/trust-block/pricing-faq/closing-footer-full/mobile-preview) defer to S-M1.x follow-ups.

The design canvas includes 9 hero variants in `hero-explore/`. This slice ships them as named exports + a `/dev/heroes` comparison gallery; production landing imports the chosen variant (Editorial = variant 01) via a single-line `SELECTED_HERO_VARIANT` constant swap.

## In scope

**Production landing (`src/app/page.tsx`):**
1. **Header** — wordmark + nav (4 items: The picture / How it works / Why us / Pricing — anchor links to in-page sections)
2. **Hero** — section composing the SELECTED_HERO_VARIANT export from `@/components/marketing/heroes`; default = Editorial (variant 01, picture composition with central document spine + 4 orbiting cards)
3. **Picture band** — eyebrow "The complete picture" + h2 + 4-card grid (Finances/Children/Housing/Future needs)
4. **Journey** — eyebrow "How it works" + 5-phase navigator (Start/Build/Reconcile/Settle/Finalise)
5. **Footer-minimal** — wordmark + legal disclaimer + links to existing `/privacy` `/terms` `/cookies`

**Hero variant gallery:**
6. 9 hero variant components as named exports from `src/components/marketing/heroes/`: `HeroEditorial`, `HeroDeclarative`, `HeroTypographic`, `HeroProductForward`, `HeroOutcomeLed`, `HeroTwoColumn`, `HeroEmpathetic`, `HeroAtmospheric`, `HeroDiagrammatic` — translated faithfully from `hero-explore/heroes_a.jsx` + `heroes_b.jsx`
7. `SELECTED_HERO_VARIANT` constant in `heroes/index.ts` — single-line swap to change production default
8. `/dev/heroes` page — renders all 9 variants stacked under the existing dev banner, each with a label header, for visual comparison

**Shared atoms (`src/components/marketing/atoms/`):**
9. `CTAPrimary` — pill button with arrow + time-estimate sublabel + Enter keybind hint, default `href="/start"`, default label "Start your free plan", default time "~3 minutes · no account needed"
10. `TrustBand` — three dot-separated signals (FCA-regulated bank connection via TrueLayer · Read-only · Free until you choose to sign up)
11. `Eyebrow` — small uppercase label component
12. `Wordmark` — Decouple wordmark with letterform construction
13. `SectionHead` — section h2 with optional eyebrow
14. `PlaceholderTag` — annotation badge ("EDITORIAL · not a literal screenshot")
15. `Icons` module — 11 inline SVG icons (ArrowRight, ArrowDown, Plus, Shield, Lock, Check, Coins, Children, Home, Compass, ArrowUpRight) via shared `Ic` factory

**Placeholder route:**
16. `src/app/start/page.tsx` — NEW route returning a 404-styled "Pre-signup interview opens soon" page; CTAs from landing link here. Blocks signup flow until S-O1 ships.

**Layout + global CSS:**
17. `src/app/layout.tsx` — load Source Serif Pro + JetBrains Mono via `next/font/google` (Inter already loaded)
18. `src/app/globals.css` — add marketing utility classes: `.serif`, `.mono`, `.tabular`, `.label-xs`, `.kbd`, `.cta-primary`, `.sec-in*`, `.hairline`, `.skip` (skip-link), `.placeholder-stripe`

## Out of scope

- Sections 5-11 from design source (compare / trust-block / pricing-faq / closing-footer-full / mobile-preview) — deferred to S-M1.1 / S-M1.2
- A/B testing infrastructure, feature flag, runtime variant selector — `SELECTED_HERO_VARIANT` is compile-time only
- `/features` `/pricing` routes — not in current tree; not currently planned
- S-O1 pre-signup interview build — separate slice; CTAs land at `/start` placeholder until then
- Form submission, analytics, cookie banner
- Updates to existing `/privacy` `/terms` `/cookies` stub pages (footer links to them; pages stay as-is)
- New design tokens promoted to `--ds-*` namespace (S-F1) — SOFT and WARM marketing-scoped colours used inline / in marketing CSS only
- Image / illustration assets (Decouple.zip in `docs/design-source/` is design-time only; production has no static images at this slice)
- Animation refinement beyond the design's `secIn` 320ms section stagger + reduced-motion fallback

## Audit reconciliation

Design source has **9 page-rendering modules** (`landing/03_header` through `landing/11_mobile`). S-M1 ships 5 of them; 4 defer to follow-ups. 100%-rule arithmetic:

| # | Design module | S-M1 status |
|---|---|---|
| 1 | `03_header` | Ship (full) |
| 2 | `04_hero` | Ship (variant 01 = Editorial; 9 variants exported) |
| 3 | `05_picture` | Ship (full) |
| 4 | `06_journey` | Ship (full) |
| 5 | `07_compare` | Defer → S-M1.1 candidate |
| 6 | `08_trust` | Defer → S-M1.1 candidate |
| 7 | `09_pricing_faq` | Defer → S-M1.2 candidate |
| 8 | `10_closing_footer` | Ship as `footer-minimal` (legal + 3 stub-page links only); full version → S-M1.2 |
| 9 | `11_mobile` | Defer → S-M1.3 candidate (mobile-preview frame is a marketing device, not the responsive contract) |

Design tokens (`landing/01_tokens.jsx`) reconcile against S-F1 `--ds-color-*`: 11/13 exact matches (INK / SUB / MUTE / LINE / BG / PANEL / CANVAS + 4 phase pairs); SOFT (`#A8A29E`) and WARM (`#F5F3EE`) remain marketing-scoped (used inline in marketing components, not promoted to S-F1).

## Acceptance criteria

**AC-1 · Production landing composition.** `src/app/page.tsx` renders 5 sections in DOM order: `<header>` → hero `<section>` → picture-band `<section>` → journey `<section>` → `<footer>`. The hero section renders the component exported as `SELECTED_HERO_VARIANT` from `@/components/marketing/heroes`. Existing placeholder + S-F1/F3/F4/F2 demo grid is removed.

*Evidence:* `src/app/page.test.tsx` — DOM-order assertion (querySelector for the 5 landmarks); presence of `data-marketing-section` attributes on each section for stable querying; assertion that no `data-demo-grid="…"` markers from the prior placeholder remain.

**AC-2 · Hero variant set.** Nine hero variant components exist as named exports from `src/components/marketing/heroes/index.ts`: `HeroEditorial`, `HeroDeclarative`, `HeroTypographic`, `HeroProductForward`, `HeroOutcomeLed`, `HeroTwoColumn`, `HeroEmpathetic`, `HeroAtmospheric`, `HeroDiagrammatic`. The same module exports `SELECTED_HERO_VARIANT` (default value = `'editorial'`) and a `HERO_VARIANTS` map keyed by the kebab-case variant slug. Each variant renders without throwing under jsdom and contains its variant-distinguishing visual element (assertable per the design source — e.g. Editorial has the central document spine + 4 orbiting cards; Declarative has the oversize headline with no auxiliary furniture; Atmospheric has the dark-background ambient orb container).

*Evidence:* `src/components/marketing/heroes/index.test.ts` — exports contract (9 named exports + `SELECTED_HERO_VARIANT` + `HERO_VARIANTS` map with 9 keys + default value `'editorial'`); per-variant smoke test in `src/components/marketing/heroes/{variant}.test.tsx` asserting the variant's signature element.

**AC-3 · Hero comparison gallery.** `src/app/dev/heroes/page.tsx` renders all 9 variants stacked vertically, each preceded by an `<h2>` label naming the variant (variant name + the design's one-line subtitle). Page is mounted under the existing `EnvBanner` (dev-only surface). No production assertion that this page is reachable from the landing.

*Evidence:* `src/app/dev/heroes/page.test.tsx` — assertion that all 9 variant labels render + 9 distinct hero sections render; assertion that the `EnvBanner` ancestor is present.

**AC-4 · `/start` placeholder route (HTTP 404 by design).** `src/app/start/page.tsx` exists and calls `notFound()` from `next/navigation` immediately on render. `src/app/start/not-found.tsx` is the segment's custom 404 page and renders the copy "Pre-signup interview opens soon" + a brief explainer paragraph + a "← Back to home" link with `href="/"`. Returns HTTP 404 — honest signposting that the route is not yet built; CTAs from the landing's hero + footer link to `/start`.

*Evidence:* `src/app/start/page.test.tsx` — assertion that the page calls `notFound()` (use vitest mock of `next/navigation`); `src/app/start/not-found.test.tsx` — copy assertion + back-link presence; `src/app/page.test.tsx` — assertion that the primary CTA's `href` resolves to `/start`.

**AC-5 · Required content (positive assertions).** The following load-bearing copy is present verbatim on the landing as DOM text content:
- Page `<title>`: `Decouple — the complete picture` (from `Metadata.title`)
- Hero eyebrow: `The complete settlement workspace for separating couples`
- Hero h1: includes both `Sort out your complete separation` AND `together` (the italic accent)
- Hero subhead: includes both `for under £1,000 and in 3 months` AND `£15,000 and 18 months`
- Picture h2: includes `A divorce settlement covers four interdependent areas` AND `Decouple covers all of them`
- Picture cards: 4 labels — `Finances`, `Children`, `Housing`, `Future needs`
- Journey: 5 phase labels — `Start`, `Build`, `Reconcile`, `Settle`, `Finalise`
- Header nav: 4 items — `The picture`, `How it works`, `Why us`, `Pricing`
- TrustBand: includes `FCA-regulated bank connection via TrueLayer`, `Read-only`, `Free until you choose to sign up`
- Footer: includes the legal disclaimer `Decouple is not a law firm and does not provide legal advice`

*Evidence:* `src/app/page.test.tsx` — one assertion per item.

**AC-6 · Forbidden framing (negative assertion).** The string `"financial disclosure tool"` (case-insensitive, with or without preceding article) does NOT appear in the rendered DOM text of `/`, `/start`, or `/dev/heroes`. Spec 42 framing is load-bearing — Decouple is positioned as a complete settlement workspace, never a financial disclosure tool.

*Evidence:* `src/app/page.test.tsx`, `src/app/start/page.test.tsx`, `src/app/dev/heroes/page.test.tsx` — case-insensitive substring assertion against `document.body.textContent` per page.

**AC-7 · Landmark + a11y structure.** Per spec 72a screen-reader dimension and the design source's `.skip` skip-link: landing page contains exactly one `<h1>` (in the hero); semantic `<header role="banner">`, `<main>`, `<footer role="contentinfo">` landmarks; skip-link is the first focusable element, has `href="#main"` (where `#main` is the `<main>` element's id), and is visually-hidden until focus (per the design's `.skip` CSS); each section has an `aria-labelledby` pointing to its own heading. Header navigation links have visible `:focus-visible` outlines. The `<main>` element is the focus target after skip-link activation.

*Evidence:* `src/app/page.test.tsx` — landmark counts + skip-link presence + `aria-labelledby` wiring; manual screen-reader pass logged in `verification.md`.

**AC-8 · Visual treatment + token reconciliation.** `src/app/layout.tsx` loads `Source_Serif_4` (the Source Serif Pro successor; `next/font/google` exposes it under that name) and `JetBrains_Mono` via `next/font/google` (Inter is pre-existing); fonts expose `--font-serif` and `--font-mono` CSS variables on `<html>`. `src/app/globals.css` adds the marketing utility classes the design source uses: `.serif` (binds `--font-serif`), `.mono` (binds `--font-mono`), `.tabular` (`font-variant-numeric: tabular-nums`), `.label-xs` (10.5px uppercase 600 weight, 0.14em tracking), `.kbd` (the keyboard-affordance pill), `.cta-primary` (the primary CTA hover lift), `.sec-in` + `.sec-in-1..4` (the 320ms cubic-bezier section stagger with stagger-delays), `.skip` (skip link), `.placeholder-stripe` (the EDITORIAL annotation diagonal-stripe background), `.hairline` (`border: 1px solid var(--ds-color-border)`). All marketing components use existing S-F1 `--ds-color-*` tokens for colors that match (no new `--ds-*` tokens added). SOFT (`#A8A29E`) and WARM (`#F5F3EE`) marketing-scoped colours are used as inline `style` values in the components that need them, not as CSS variables.

*Evidence:* CSS↔TS parity test (extending S-F1's pattern) for the new utility classes; visual verification at preview deploy logged in `verification.md`.

**AC-9 · Spec 72a 6-dimension preview-deploy verification.** `verification.md` `## Preview-deploy verification` section contains one row per dimension with Status + Evidence:
- Golden path (desktop ≥1240px viewport · default Editorial hero · all 5 sections render · CTAs reachable · `/dev/heroes` shows all 9 variants)
- Edge cases (long-text overflow on hero h1; single-word screen reader pass on the EDITORIAL annotation; empty-state of `/start` placeholder)
- `prefers-reduced-motion: reduce` (all `.sec-in` animations disabled per the `@media` rule in `globals.css`; CTA hover transform disabled)
- Keyboard-only (Tab order: skip-link → wordmark → 4 nav items → primary CTA → "How it works" link → footer links + privacy/terms/cookies; Enter on CTA navigates to `/start`)
- Mobile viewport (375×667) — header collapses or stacks per design; hero columns stack; nav items remain reachable; no horizontal scroll
- Screen reader (one h1; landmark structure announced; CTAs read with their time-estimate sub-label; TrustBand signals separated by aria-hidden separators not announced)

*Evidence:* this verification section in `verification.md` (final-state at slice ship); ux-polish-reviewer persona spawn log (per AC-3 of v3b S-INFRA-persona-suite-v2-multi-agent — first formal trigger window opens at this slice since this is the first src/ slice with a substantive UI surface).

**AC-10 · Marketing colocation contract.** All marketing-only components live under `src/components/marketing/{atoms,heroes,sections}/`; nothing in this slice promotes a marketing-scoped concept (CTAPrimary, TrustBand, Eyebrow, etc.) into the top-level `src/components/` namespace. `src/components/marketing/index.ts` exports only the public-facing surface needed by `src/app/page.tsx` and `src/app/dev/heroes/page.tsx` (not internal sub-components). The 11 inline-SVG icons live in a single `atoms/icons.tsx` module (the design's `Ic` factory pattern preserved) — no icon library dependency added.

*Evidence:* `tests/marketing/colocation.test.ts` — assertion that no file outside `src/components/marketing/` imports from `marketing/atoms/*` private paths (only via `marketing` index); audit of new directories' contents matches the surface map in `## In scope`.

## Status

**Created:** session 65 (2026-05-04)
**Branch:** `claude/decouple-session-65-lT8VM`
**Author:** Claude (under user direction)
