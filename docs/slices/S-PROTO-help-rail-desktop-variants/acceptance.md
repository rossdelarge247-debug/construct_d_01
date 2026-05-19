# S-PROTO-help-rail-desktop-variants

**Category:** prototype

## Purpose

Ship the desktop Help Rail as a graceful enhancement of the pre-signup-interview prototype, with all five canvas variants (Glossary / AI Coach / Why we ask / Talk to a human / Hybrid tabbed) live behind a dev-only variant toggle. The canvas designer presented five takes deliberately and recommended instrumenting before picking; the prototype-shipped-as-toggleable-variants pattern lets the team see them in live form context.

The slice introduces a reusable variant-control primitive (manifest + context + dev control surface) so future "let's try variations" work across the prototype has a place to plug in rather than re-inventing storage per surface.

## Canvas source

- `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html` (bundled)
- `docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html` (decoded readable form)

Canvas-as-source per CLAUDE.md §"Visual direction" §"Canvas-as-source" — 5-step light adapt; no `Linked canvas:` field; canvas-fidelity gate stays dormant; per-AC evidence cites the canvas path inline.

## In scope

- New variant manifest + React context primitive under `src/lib/dev/`
- New dev control route at `src/app/dev/control/page.dev.tsx` (sibling to existing dev tools)
- Five Help Rail components extracted from canvas (`RailGlossary`, `RailCoach`, `RailWhy`, `RailHuman`, `RailHybrid`)
- Integration into existing `src/app/dev/proto/pre-signup-interview/` — rail shown only at viewport ≥1280px
- Unit tests for variant context (storage + URL override + manifest default)
- Visual smoke tests for each rail variant
- Registry entry update (`src/app/dev/proto/registry.ts`) — new dev-tools row for the control surface

## Out of scope

- Mobile rail / smaller-viewport rail variants — graceful enhancement is desktop-only by design
- Cross-session / per-user persistence beyond localStorage
- Variant analytics / "stuck?" tap-out signal instrumentation (canvas's own §Reading notes recommends this as the *next* step after seeing variants live; out of scope this slice)
- Real glossary / coach / why-we-ask content beyond what the canvas embeds (canvas-content reused; copywriter work deferred)
- Mid-screen rail content adaptation per O-screen step — initial scope is the rail content shown on O2 (canvas's anchored screen); per-step variations deferred
- Public-site / marketing / policy pages — separate framework (out of scope this slice)
- Other prototype routes adopting variants — manifest is general but only Help Rail wires it this slice

## Acceptance criteria

### AC-1 — Variant manifest pattern

Create a typed manifest at `src/lib/dev/variant-manifest.ts` (or co-located). Each prototype declares its variants in a `variants.ts` adjacent to its route directory. Shape (illustrative):

```ts
type VariantOption = { id: string; label: string };
type VariantSet = { label: string; options: VariantOption[]; default: string };
type VariantManifest = Record<string, VariantSet>;
```

The pre-signup-interview prototype declares its `helpRail` variant at `src/app/dev/proto/pre-signup-interview/variants.ts` with options matching the canvas: `off` (default; mobile-only behaviour), `v1`, `v2`, `v3`, `v4`, `v5`.

**Evidence:** manifest module exports + a registry-level aggregator at `src/lib/dev/variants-registry.ts` listing all prototypes that opt in. Type assertions hold via `tsc --noEmit`.

### AC-2 — Variant context + `useVariant` hook

`src/lib/dev/variant-context.tsx` exposes:

- `<VariantProvider>` (client component; wraps the app or relevant subtree)
- `useVariant(prototypeId, variantKey)` — returns active variant id (string)
- `useSetVariant(prototypeId, variantKey)` — returns setter that persists to `localStorage[`dev:variant:${prototypeId}:${variantKey}`]`
- Resolution order: URL `?variant.<key>=<id>` searchParam → localStorage → manifest default
- Hydration-safe: on first SSR render, returns manifest default; client effect reads localStorage and updates if differs (no hydration mismatch)

**Evidence:** unit tests at `src/lib/dev/__tests__/variant-context.test.tsx` cover the three resolution paths + the hydration-safe initial render.

### AC-3 — Dev control surface

New route at `src/app/dev/control/page.dev.tsx`. Renders a list of prototypes with declared variants; per variant key, shows radio toggles for each option; selecting an option calls `useSetVariant`. A "Reset to default" button per variant set clears the localStorage key.

The control surface is dev-only — `.dev.tsx` extension follows the existing convention used by `src/app/dev/scenarios/page.dev.tsx`, `src/app/dev/state-inspector/page.dev.tsx`, etc.

A registry row at `src/app/dev/proto/registry.ts` records the new dev tool under §11 Dev tools with `status: 'shipped'`, `tags: ['dev-only']`, `links: { prototype: 'src/app/dev/control/' }`.

**Evidence:** `src/app/dev/control/page.dev.tsx` renders without error in dev mode; toggling a variant updates localStorage and triggers re-render of consumers; registry row appears in the proto hub at `/dev/proto`.

### AC-4 — Three Help Rail components extracted from canvas (V4 + V5 deferred)

Each rail is a standalone React component under `src/app/dev/proto/pre-signup-interview/components/rails/`:

| Component | Canvas reference | Description |
|---|---|---|
| `RailGlossary.tsx` | decoded canvas — `RailGlossary` (search by name) | Contextual glossary; current term highlighted; surrounding terms visible |
| `RailCoach.tsx` | decoded canvas — `RailCoach` | AI-coach chat affordance with scope-copy ("not legal advice") |
| `RailWhy.tsx` | decoded canvas — `RailWhy` | "Why we ask" trust panel; per-field rationale |

The manifest declares all five canvas variants (`v1`-`v5`) plus `off`; V4 (Talk to a human) and V5 (Hybrid tabbed) are listed but render a "Variant deferred to follow-up slice" placeholder when selected. This keeps the dev control surface honest about which canvas variants are live vs. parked.

Five-step light adapt per CLAUDE.md §"Canvas-as-source":
1. Tokenise canvas-top constants (e.g. `const INK = "#1A1A1A"` → `tokens.color.ink`)
2. Replace any placeholder literals with passed props or copy-resolver calls
3. Wire state (current step / focused card via context)
4. Add Next.js `'use client'` where needed
5. Inline canvas-local helpers OR adapt — judgement per component

**Evidence:** each component renders without error in a Jest smoke test; visual treatment cites canvas line ranges inline in component-top JSDoc.

### AC-5 — Integration with 1280px graceful enhancement

The pre-signup-interview prototype's screen layout shows the active rail variant only when viewport width is ≥1280px. Below the breakpoint, existing mobile flow renders unchanged. The integration touches the prototype's layout wrapper (existing `page.tsx` orchestrator or a new layout component) — minimum surgical change to the per-screen O1-O8/Q-bridge/O6.5-7 components.

Default variant: `off` — the rail does not appear until a developer selects a variant via the dev control surface, preserving the current "mobile-prototype" behaviour as the unsurprised default. Test scenarios for the control surface document this.

The breakpoint is implemented via CSS media query (`@media (min-width: 1280px)`) in the prototype's existing CSS-module layer — no JS-side viewport detection (avoids hydration mismatch + matches existing pattern in `src/app/dev/proto/pre-signup-interview/page.module.css`).

**Evidence:** integration renders the form column unchanged at <1280px; rail-column appears at ≥1280px alongside; smoke test asserts the rail's containing element has the correct `@media` rule applied (via class assertion or `getComputedStyle` in a jsdom-aware test).

### AC-6 — Tests

- Unit tests for variant context (AC-2 evidence): cover URL override > localStorage > default precedence; hydration-safe initial render.
- Per-component smoke tests: each of the five rail variants renders without throwing; passes minimal prop expectations.
- Integration smoke: the pre-signup-interview prototype's existing test suite (330/330 baseline on main at slice start) stays green; new tests added at `src/app/dev/proto/pre-signup-interview/__tests__/help-rail-integration.test.tsx` cover the rail-shows-at-1280 behaviour where tractable in jsdom (CSS-rule-presence assertion).
- Dev control surface smoke: variant selection updates localStorage; reset clears it.

Total expected new tests: ~12-18 across 4 files.

## Design decisions

- **D-1: Combined slice (infrastructure + Help Rail consumer).** Help Rail is the only consumer of variant control right now; YAGNI on partitioning into two slices until a second prototype needs variants.

- **D-2: Dev control at `src/app/dev/control/page.dev.tsx` (sibling to scenarios/state-inspector).** Matches existing dev-tools convention; avoids mixing planning registry hub (`src/app/dev/proto/page.tsx`) with runtime control. Path-default for that location is `production`; the slice's `**Category:** prototype` override (declared at the top of this file) covers it — the primary user-visible surface IS the prototype rail variants, and the dev control is the means to test them.

- **D-3: 1280px (xl) breakpoint.** Canvas designs at 1320×880 imply ≥1280px target. Form ~720px + rail ~480px = ~1200px content + padding ≈ 1280px minimum. Industry convention for desktop rails. Avoids cramping on iPad-landscape / small-laptop viewports (1024px).

- **D-4: CSS media query, not JS viewport detection.** Avoids hydration mismatch + SSR-vs-client divergence. Matches the existing pattern in `src/app/dev/proto/pre-signup-interview/page.module.css`. Trade-off: variant component is mounted but visually hidden below 1280px (no JS-side conditional render) — accepted, the rail components are small.

- **D-5: Default variant `off`.** New behaviour stays opt-in; existing prototype journey is the unsurprised default. Developers select a variant via the dev control to see the rail.

- **D-6: URL searchParam > localStorage > manifest default.** URL override enables shareable links (e.g. share `?variant.helpRail=v2` with a teammate). LocalStorage persists across reload for in-context testing. Manifest default is the fallback.

- **D-7: Hybrid (V5) tabs the other 4 rails as-is, not re-renders.** V5 imports `RailGlossary`/`RailCoach`/`RailWhy`/`RailHuman` and switches via tab state. Avoids duplication; lets V5 evolve as the four components evolve.

- **D-8: No `Linked canvas:` field in this acceptance.md.** Prototype slice; canvas-as-source pattern; canvas-fidelity persona stays dormant per CLAUDE.md §"Hard controls" §"Canvas-fidelity dimension". Per-AC evidence cites canvas paths inline without verbatim quoting requirements.

- **D-9: No copy-resolver wiring this slice.** Canvas literals carry through (per CLAUDE.md §"Canvas-as-source" step 2: "Replace placeholder data — Canvas literals → copy-resolver calls"). Deferred — the canvas-embedded copy is good enough for variant-comparison; replacing it with the existing copy-resolver pattern is a follow-up if a chosen variant graduates to a fuller surface.

## Risk / blast radius

**Surface touched:**
- New: `src/lib/dev/variant-context.tsx`, `src/lib/dev/variant-manifest.ts`, `src/lib/dev/variants-registry.ts`, `src/app/dev/control/page.dev.tsx`, `src/app/dev/proto/pre-signup-interview/variants.ts`, 5 rail components under `src/app/dev/proto/pre-signup-interview/components/rails/`
- Edited: `src/app/dev/proto/pre-signup-interview/page.tsx` (or layout wrapper) — minimum-surface layout change to render rail at ≥1280px; `src/app/dev/proto/registry.ts` — one new row
- Edited (CSS): `src/app/dev/proto/pre-signup-interview/page.module.css` — `@media (min-width: 1280px)` rule for rail column

**Regression risk:**
- Mobile / <1280px users: zero — the rail's containing element is `display: none` below 1280px; the form column layout is unchanged
- Existing 330/330 tests: should stay green; the prototype's layout test surface is mostly per-screen, not per-layout-wrapper
- TypeScript: variant-context generics + manifest types must compose cleanly with the existing tokens / dev-store types; `tsc --noEmit` is the gate

**Recovery path:**
- If a rail variant ships visibly broken: dev control toggle lets devs flip back to `off` immediately
- If integration breaks the form column: revert the `page.tsx` / layout-wrapper edit; rails and variant infrastructure remain intact but unconsumed
- If variant infrastructure has a runtime bug: it's behind `useVariant`; default fallback to manifest default protects the journey

## Spec sources

CLAUDE.md §"Visual direction" §"Canvas-as-source" §"Slice convention for canvas-as-source":
> *"acceptance.md does NOT carry the `Linked canvas:` field (so canvas-fidelity stays dormant per CLAUDE.md §'Hard controls'). Per-AC evidence cites the source canvas path inline without verbatim quoting requirements. `**Category:** prototype` declared as usual."*

CLAUDE.md §"Slice categories" §"Per-category behaviour summary":
> *"`prototype` — UI/UX rigour preserved (preview-deploy 6-dim runs in full · `reviewer-prototype-readiness` post-PR persona substitutes `reviewer-correctness`); code rigour relaxed (TDD-guard skips · coverage excludes · test-pain audit threshold raises from >2 to >5 mocks · DoD-14 short-form to items 1, 8, 12, 14 only)."*

CLAUDE.md §"Coding conduct" §"Effects behind interfaces":
> *"Pure logic doesn't import side-effecty modules; effects (storage, network, time, randomness) live behind interfaces consumers can swap."*

→ Variant context's localStorage access lives behind the `useVariant` hook; consumers don't touch `window.localStorage` directly. Tests can swap the storage layer via the provider.

## Status

- [x] AC-1 — Variant manifest pattern
- [x] AC-2 — Variant context + `useVariant` hook  
- [x] AC-3 — Dev control surface
- [x] AC-4 — Five Help Rail components extracted from canvas
- [x] AC-5 — Integration with 1280px graceful enhancement
- [x] AC-6 — Tests

Slice scaffolded; implementation in progress. Verification.md assembled at slice ship.
