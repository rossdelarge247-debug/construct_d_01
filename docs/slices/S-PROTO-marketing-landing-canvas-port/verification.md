# S-PROTO-marketing-landing-canvas-port — verification

Per CLAUDE.md §"Engineering conventions" §"Definition of Done" item 1: *"All acceptance criteria met, with evidence per AC in `verification.md` (final-state record assembled at slice ship; round-by-round multi-agent audit detail belongs in HANDOFF or PR description, not in `verification.md` itself)."*

This file is the final-state record for the slice. Round-by-round audit history (auto-review iterations, etc.) goes in the wrap HANDOFF doc.

## AC evidence

### AC-1 · Hero section

**Source:** canvas L958-1149. **Target:** `src/app/dev/proto/marketing-landing/page.tsx` hero section.

Evidence: _pending impl + preview-deploy_. Hero renders at top of page with `<section id="hero" aria-labelledby="hero-h">`. H1 serif typography, sub-copy, primary CTA button, dot-pattern SVG background.

### AC-2 · Picture section

**Source:** canvas L1150-1222. Evidence: _pending impl + preview-deploy_.

### AC-3 · Journey section

**Source:** canvas L1223-1311. Evidence: _pending impl + preview-deploy_.

### AC-4 · Compare section

**Source:** canvas L1312-1428. Evidence: _pending impl + preview-deploy_.

### AC-5 · Trust section

**Source:** canvas L1429-1471. Evidence: _pending impl + preview-deploy_.

### AC-6 · Pricing section

**Source:** canvas L1472-1523. Evidence: _pending impl + preview-deploy_.

### AC-7 · FAQ section + accordion

**Source:** canvas L1524-1595. Evidence: _pending impl + preview-deploy + unit test_. Unit test `tests/unit/proto-marketing-landing/faq-accordion.test.tsx` asserts state transitions per test-plan.md §"Unit tests".

### AC-8 · Closing section

**Source:** canvas L1596-1632. Evidence: _pending impl + preview-deploy_.

### AC-9 · Header + nav + footer chrome

**Source:** canvas L906-957 (header/nav) + L1633+ (footer) + L1969 (`<main>`). Evidence: _pending impl + preview-deploy_.

### AC-10 · Token map

Evidence: post-port + post-patch grep on `src/app/dev/proto/marketing-landing/page.tsx`:

- 7 mapped constants (INK/SUB/MUTE/LINE/BG/PANEL/CANVAS) reference `tokens.color.*` — verified by absence of literal `#1A1A1A` / `#57534E` / `#78716C` / `#E5E3DC` / `#F5F5F4` / `#FFFFFF` / `#FAFAF7` outside the inline `PHASE` const at top.
- 2 originally unmapped constants (SOFT `#A8A29E`, WARM `#F5F3EE`) inlined as literals.
- 2 additional canvas colours surfaced beyond the original mapping: `#D6D3CC` (2 sites in Wordmark separator dots) + `#3F3F3F` (1 site in hero italic emphasis "together"). Inlined for the same rationale as SOFT/WARM (one-off canvas-local; promote if a second slice uses them).
- Phase-tint colours declared inline as `const PHASE = { start, build, reconcile, settle, finalise }` at file head (canvas L758-764 ported verbatim).
- Tailwind arbitrary-class refs (`hover:text-[#1A1A1A]` on nav links, x4) — acceptable per Tailwind v4's idiom (arbitrary classes can't resolve JS token paths at build time).

### AC-11 · FAQ accordion state

Evidence: `src/app/dev/proto/marketing-landing/page.tsx` L1193 declares `const [openIndex, setOpenIndex] = useState<number | null>(null);`. Each toggle wired with `aria-expanded={openIndex === i}`, `aria-controls={`faq-panel-${i}`}`, `onClick={() => setOpenIndex(open ? null : i)}` — single-open behaviour.

### AC-12 · Route resolves

Evidence: `src/app/dev/proto/marketing-landing/page.tsx` exists with default export `MarketingLandingPage`. Next.js literal-slug routing precedence over `[slug]/page.tsx` stub. URL `/dev/proto/marketing-landing` resolves to the new page. Preview-deploy verification deferred to user (sandbox can't reach Vercel preview hosts).

Registry: `src/app/dev/proto/registry.ts` `marketing-landing` row remains `status: 'canvas-drafted'`. Promotion to `live` deferred until user reviews the deployed page and confirms scope.

### AC-13 · FAQ accordion unit tests

Evidence: `tests/unit/proto-marketing-landing/faq-accordion.test.tsx` written — 4 test cases (initial-state-all-closed; click-opens; single-open-replacement; click-twice-closes). Test execution deferred: the agent sandbox can run `npx vitest` only after `npm install` (no committed node_modules in the container); test run pending user-side `npm test` or CI invocation on push.

## Architectural deferrals

- **Responsive mobile/tablet breakpoints.** Canvas has no responsive media queries other than `prefers-reduced-motion`. Per CLAUDE.md §"Canvas-as-source" §"Mobile-to-desktop responsiveness": *"Canvases ship for specific viewports; intermediate breakpoints are not wired in the canvases themselves. Reconcile at preview-deploy feedback time, not at build time."* Deferred to a follow-up slice driven by user feedback + answering the registry's `Mobile-first vs desktop-first authoring order?` open question.
- **Real CTA handlers.** CTAs are static buttons / hash anchors. Wiring to the pre-signup-interview entry, signup form, or any external destination is a separate slice (likely scoped together with marketing-funnel scaffolding).
- **A11y deep-pass.** This slice ports the canvas's existing a11y attributes verbatim (`aria-labelledby`, `sr-only`, `role="main"`). System-wide a11y rigour (focus-visible coverage, ARIA live regions, contrast verification, keyboard nav rigour) deferred to the next round of `S-PROTO-a11y-wcag-audit-phase-*` slices once more screens land.
- **Adjacent pre-auth-public routes** (`how-it-works`, `pricing`, `faq-trust`). Registry has them as separate `canvas-drafted` entries; canvas folds them into landing-page sections. Whether they ship as dedicated routes or stay as landing scroll sections is a product decision deferred.

## Preview-deploy verification

CLAUDE.md §"Hard controls" §"Preview-deploy verification rubric" gives the six dimensions verbatim: *"golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport (375×667) · screen-reader"*. Re-rendered here once user-confirmed.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | _pending user_ | All 8 sections visible in source order; nav anchors work; CTAs render. |
| Edge cases | _pending user_ | FAQ rapid-click + simultaneous-open attempts; layout at long-copy edge. |
| `prefers-reduced-motion` | _pending user_ | Canvas's reduced-motion block ported verbatim. |
| Keyboard-only | _pending user_ | Tab through nav → CTAs → FAQ toggles → footer; FAQ Enter + Space activate. |
| Mobile viewport (375×667) | deferred | Canvas has no mobile layout. Reconcile deferred per Architectural deferrals above. |
| Screen-reader | deferred | Deferred to Phase 3 a11y system-wide pass. Canvas a11y attributes preserved. |

## Status

Drafted. Awaiting impl + preview-deploy + tests. Final-state will be backfilled at slice ship.
