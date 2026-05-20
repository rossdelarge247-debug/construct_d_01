# S-PROTO-marketing-landing-canvas-port

**Category:** prototype

## Intent

Port the marketing landing canvas at `docs/design-source/marketing-landing/decoded/Landing Page - Standalone.html` to a Next.js prototype route at `src/app/dev/proto/marketing-landing/`. Canvas-as-source pattern per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)". Desktop viewport only (canvas has no responsive breakpoints other than `prefers-reduced-motion`); mobile reconciliation deferred per spec text *"Canvases ship for specific viewports; intermediate breakpoints are not wired in the canvases themselves. Reconcile at preview-deploy feedback time, not at build time."*

Source canvas is a single-page vertical scroll with 8 sections (`hero`, `picture`, `journey`, `compare`, `trust`, `pricing`, `faq`, `closing`) plus sticky header + footer. Canvas is already React JSX in shape (`className`, `style={{}}`, `aria-labelledby`) — adapt-to-Next.js is direct.

Out of scope:
- `how-it-works`, `pricing`, `faq-trust` as separate routes (registry §1 has separate entries; canvas folds these into landing-page sections — separate routes remain `canvas-drafted`).
- Form / signup flow wiring (CTAs are static; no real handlers).
- Mobile responsive breakpoint work (deferred per canvas-as-source pattern).
- A11y deep-pass (deferred to system-wide Phase 2/3 a11y pass; this slice ships canvas-as-is + the minimum-viable a11y already in the canvas — `aria-labelledby` on sections, `sr-only` headings where canvas declared them).

## Acceptance criteria

### Section ports (canvas L958–1632)

**AC-1.** Hero section (canvas L958–1149) renders at the top of the page. H1 with serif typeface; sub-copy below; primary CTA button. Dot-pattern SVG background as inline `<svg><pattern id="dots">`. Section element has `id="hero"` and `aria-labelledby="hero-h"`. *Evidence:* canvas section unchanged in DOM order + token swaps applied; in-browser visual at `/dev/proto/marketing-landing` matches canvas hero.

**AC-2.** Picture section (canvas L1150–1222) renders below hero. H2 "picture-h" + supporting copy + illustration block. Section `id="picture"`. *Evidence:* visual at `/dev/proto/marketing-landing#picture` matches canvas.

**AC-3.** Journey section (canvas L1223–1311) renders. H2 "journey-h" + numbered steps. Section `id="journey"`. *Evidence:* visual at `/dev/proto/marketing-landing#journey` matches canvas.

**AC-4.** Compare section (canvas L1312–1428) renders. H2 "compare-h" + comparison grid. Section `id="compare"`. *Evidence:* visual at `/dev/proto/marketing-landing#compare` matches canvas.

**AC-5.** Trust section (canvas L1429–1471) renders. `sr-only` H2 "trust-h" + trust signal grid. Section element. *Evidence:* visual matches canvas.

**AC-6.** Pricing section (canvas L1472–1523) renders. H2 "pricing-h" + tier card(s). Section `id="pricing"`. *Evidence:* visual at `/dev/proto/marketing-landing#pricing` matches canvas.

**AC-7.** FAQ section (canvas L1524–1595) renders with accordion behaviour. H2 "faq-h" + FAQS list. Each item: clickable button toggles open/close state; chevron icon rotates; `aria-expanded` reflects state; `aria-controls` references panel. Default state: all closed. *Evidence:* unit test asserts open/close state transitions on click; visual at `/dev/proto/marketing-landing#faq` matches canvas in both open + closed states.

**AC-8.** Closing section (canvas L1596–1632) renders. Final CTA section. *Evidence:* visual at `/dev/proto/marketing-landing#closing` matches canvas.

### Page chrome (canvas L906, L921, L1633+, L1969)

**AC-9.** Sticky header + primary nav + footer port from canvas. Header (canvas L906) is `position: sticky` at top with brand mark + nav links. Nav (canvas L921) hidden on small viewports — but since canvas has no responsive breakpoints, this AC ports the desktop layout verbatim. Footer (canvas L1633+) renders below the closing section. `<main id="main" role="main">` (canvas L1969) wraps section content per landmark accessibility convention. *Evidence:* visual at `/dev/proto/marketing-landing` matches canvas chrome.

### Tokenisation (CLAUDE.md §"Canvas-as-source" Step 1)

**AC-10.** Canvas-top colour constants tokenised against `src/styles/tokens.ts`:

| Canvas constant | Hex | `tokens.color` ref |
|---|---|---|
| `INK` | `#1A1A1A` | `color.ink` |
| `SUB` | `#57534E` | `color.text.sub` |
| `MUTE` | `#78716C` | `color.text.muted` |
| `LINE` | `#E5E3DC` | `color.border` |
| `BG` | `#F5F5F4` | `color.surface.page` |
| `PANEL` | `#FFFFFF` | `color.surface.panel` |
| `CANVAS` | `#FAFAF7` | `color.surface.canvas` |
| `SOFT` | `#A8A29E` | inlined (no matching token; literal in screen with `// canvas SOFT` rationale) |
| `WARM` | `#F5F3EE` | inlined (no matching token; literal in screen with `// canvas WARM` rationale) |

The 7 mapped constants reference `tokens.color.*` via `import { tokens } from '@/styles/tokens'`. The 2 unmapped constants (SOFT, WARM) are inlined with literal hex; rationale: marketing-landing-only colours not used elsewhere in the prototype — promoting to tokens.ts only justifies if a second slice surfaces a use. Two additional canvas colours surfaced beyond the original 9 — `#D6D3CC` (2 sites: small separator dots in the Wordmark) and `#3F3F3F` (1 site: italic emphasis word in hero) — inlined for the same reason.

Phase-tint colours are declared inline at top of `page.tsx` as `const PHASE = { start, build, reconcile, settle, finalise }` to preserve the canvas-local PHASE object shape (canvas L758-764). The four non-`start` phases also exist in `tokens.color.phase.*` and could be cross-referenced if the marketing landing's phase tints diverge from the workspace's. Kept inline for now.

Tailwind arbitrary-class colour references (e.g. `className="hover:text-[#1A1A1A]"` on nav links) are NOT tokenised — Tailwind v4 arbitrary values can't resolve JS `tokens.*` paths at build time. These literal-in-class references are acceptable per Tailwind v4's idiom. *Evidence:* no remaining literal hex matches for the 7 mapped tokens in the screen file; the 2 unmapped literals are documented inline. Font tokens (Inter / Source Serif Pro / JetBrains Mono) already exist in `tokens.font` and are referenced via `tokens.font.sans` / `.serif` / `.mono`.

### State + interaction (CLAUDE.md §"Canvas-as-source" Step 3)

**AC-11.** FAQ accordion state uses React `useState` for open-item tracking. Single-open behaviour (clicking a new item closes the previous one) OR multi-open (each independent) — picks single-open by default (cleaner mental model on scroll, matches typical landing-page FAQ pattern). Each toggle button has `aria-expanded` + `aria-controls`; panel has matching `id`. Keyboard activation via Enter + Space (browser default for `<button>`).

### Route + scaffold (CLAUDE.md §"Canvas-as-source" Step 4)

**AC-12.** Route `/dev/proto/marketing-landing` resolves to the new literal-slug subroute (not the `[slug]` stub). `page.tsx` exists with `'use client'` directive. *Evidence:* `curl http://localhost:3000/dev/proto/marketing-landing` returns the landing HTML (or equivalent local verification); registry `marketing-landing` row status remains `canvas-drafted` for now — promotion to `live` deferred until full slice verification completes (recorded as a §Post-merge step).

### Tests

**AC-13.** Unit test for FAQ accordion behaviour. Asserts:
- Initial state: all items closed (`aria-expanded="false"`).
- Click on item N opens item N (`aria-expanded="true"`).
- Click on item M (M ≠ N) closes N and opens M (single-open behaviour).
- Click on item N twice closes it.

No tests for static section render (per CLAUDE.md §"Engineering conventions" §"Don't write file-content assertions for logic slices" — the canvas-as-source sections are pure visual transcription, not logic; visual regression is covered by preview-deploy).

## Plan-vs-spec cross-check

CLAUDE.md §"Visual direction" §"Canvas-as-source" 5-step:

1. **Tokenise hardcoded colours** — AC-10.
2. **Replace placeholder data** — N/A for marketing copy; copy in canvas IS the final marketing copy (subject to user iteration post-deploy, not a placeholder swap). Recorded as explicit deferral.
3. **Wire state** — AC-11 (FAQ accordion only; CTAs static).
4. **Add Next.js wrapping** — AC-12 (`'use client'` + `page.tsx` route).
5. **Inline canvas-local helpers OR adapt** — Icon SVG constants (`ArrowRight`, `ArrowDown`, `Plus`, `Shield`, `Lock`, `Check`, `Coins`, `Children`, `Home`, `Compass`, `ArrowUpRight`) inline in the screen file by default; extract to a separate file ONLY if line count exceeds practical readability.

CLAUDE.md §"Slice convention for canvas-as-source": *"`acceptance.md` does NOT carry the `Linked canvas:` field (so canvas-fidelity stays dormant per CLAUDE.md §'Hard controls'). Per-AC evidence cites the source canvas path inline without verbatim quoting requirements. `**Category:** prototype` declared as usual."* — confirmed: no `Linked canvas:` field; line refs only in ACs above; `**Category:** prototype` at top.

## Definition of Done

1. All ACs met; evidence per AC in `verification.md`.
2. Tests written + passing (AC-13 only; rest is visual).
3. Adversarial review done (auto-review via 3 specialists at PR + manual sweep).
4. Preview deploy verified — user-confirmed (agent sandbox blocks Vercel preview URL host with `x-deny-reason: host_not_allowed`).
5. No regression in adjacent slices — `/dev/proto/pre-signup-interview` smoke walk after port.
6. Slice's open registry questions logged for follow-up; the canvas-`mobile-priority` tag + `Mobile-first vs desktop-first authoring order?` registry open question are explicitly noted as deferred to a follow-up slice once user-feedback drives a responsive scope.

14-item security checklist short-form per CLAUDE.md §"Slice categories" §"prototype": items 1, 8, 12, 14 in `security.md`.

## Status

Drafted. Not yet shipped.
