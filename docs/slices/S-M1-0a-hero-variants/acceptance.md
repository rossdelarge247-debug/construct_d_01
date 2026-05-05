# Acceptance — S-M1.0a hero variants + dev gallery

Follow-up slice to S-M1 (the marketing landing). S-M1 shipped HeroEditorial as production default + a forward-extensible `HERO_VARIANTS` map keyed by variant slug. This slice translates the remaining 8 hero designs from the design canvas (`docs/design-source/marketing-landing/Decouple.zip` → `/tmp/decouple-design/hero-explore/heroes_a.jsx` + `heroes_b.jsx`) and adds a `/dev/heroes` comparison gallery.

## In scope

- 8 new hero variant components at `src/components/marketing/heroes/<slug>.tsx`:
  - HeroDeclarative · HeroTypographic · HeroProductForward · HeroOutcomeLed
  - HeroTwoColumn · HeroEmpathetic · HeroAtmospheric · HeroDiagrammatic
- 8 per-variant smoke tests (signature element + landmark contract)
- `HERO_VARIANTS` map shape extension 1 → 9 keys
- `src/app/dev/heroes/page.tsx` rendering all 9 stacked with h2 labels (variant slug + design subtitle)
- Dev gallery page test (label coverage + section count)

## Acceptance criteria

**AC-1 · 8 hero variant components.** Each variant exists at `src/components/marketing/heroes/<slug>.tsx` as a named-exported function component (with optional `id?: string` prop, default `'hero'`, allowing the dev gallery to pass unique section IDs while preserving the production landing's hardcoded `id="hero"` contract), renders without throwing under jsdom, and contains its variant-distinguishing signature element (per-variant: declarative big serif H1; typographic centered H1; product-forward UI fragment; outcome-led consent-order doc; two-column reconciliation table; empathetic testimonial card; atmospheric dark backdrop; diagrammatic 5-phase pill diagram).

**AC-2 · 8 per-variant smoke tests.** Each variant has a sibling test at `tests/unit/components/marketing/heroes/<slug>.test.tsx` asserting: eyebrow + H1 + subhead text verbatim; primary CTA reachable; signature visual element present; section landmark contract (`id="hero"` + `aria-labelledby` pointing to the hero's H1).

**AC-3 · `HERO_VARIANTS` map shape (9 keys).** `src/components/marketing/heroes/index.ts` exports each variant as a named export and registers each under its kebab-case slug in `HERO_VARIANTS`. Map shape preserves the type-keyed `as const` pattern so `HERO_VARIANTS[SELECTED_HERO_VARIANT]` resolves at compile time.

**AC-4 · Dev gallery page.** `src/app/dev/heroes/page.tsx` is a default-exported function component that renders all 9 heroes stacked, each preceded by an `<h2>` carrying the variant slug + the design's authored subtitle (from the design source comments). Each hero variant is wrapped in an `aria-label`-decorated `<section>` for screen-reader navigation. Mounted under EnvBanner via `src/app/layout.tsx` (global; no per-page wrap). Lockdown of `/dev/*` in production deferred to S-F7-beta-impl follow-up.

**AC-5 · Dev gallery page test.** `tests/unit/app/dev/heroes/page.test.tsx` asserts: each variant slug renders as text; each design subtitle renders as text; one h1 per variant; each variant wrapped in an `aria-label`-decorated section.

## Out of scope

- Mobile-responsive design pass — owned by S-M1.0b (mobile canvas first, then implementation)
- Production hero swap (this slice does NOT change `SELECTED_HERO_VARIANT`; production landing continues to render HeroEditorial)
- Lockdown of `/dev/heroes` in production — deferred to S-F7-beta-impl rebase + ship
- Runtime hero rotation (per-environment / A/B / phased rollout) — requires feature flag SDK; tracked at v2-backlog #74a
- Custom design tokens for HX_PHASE.start (no `--ds-color-phase-start` token exists; HeroDiagrammatic uses INK token + literal `#F5F3EE` for the start-phase soft fill, matching S-M1's retained-literals convention)

## Status

**Created:** session 67 (2026-05-05)
**Author:** Claude (under user direction)
**Slicing:** P1a + P1b (split for line-budget management)
- P1a: 4 simpler variants (Declarative, Typographic, Atmospheric, Diagrammatic) + gallery scaffold (5 of 9)
- P1b: 4 complex variants (ProductForward, OutcomeLed, TwoColumn, Empathetic) + gallery completion (9 of 9)
