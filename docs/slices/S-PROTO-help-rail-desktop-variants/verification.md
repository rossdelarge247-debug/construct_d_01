# S-PROTO-help-rail-desktop-variants — Verification

## Final-state record per AC

### AC-1 — Variant manifest pattern

Files shipped:
- `src/lib/dev/variant-manifest.ts` — types + `findOption` + `isValidVariantId` helpers
- `src/app/dev/proto/pre-signup-interview/variants.ts` — `PRE_SIGNUP_INTERVIEW_VARIANTS` manifest (helpRail set: off + v1-v5; default off)

Type assertions: `tsc --noEmit` clean.

Tests: `tests/unit/lib/dev/variant-manifest.test.ts` — 6 tests covering `findOption` matched + unknown, `isValidVariantId` known + unknown + null + undefined + empty + missing-set. All green.

### AC-2 — Variant context + `useVariant` hook

Files shipped:
- `src/lib/dev/variant-context.tsx` — `VariantProvider`, `useVariant`, `useSetVariant`, `useResetVariant`, `useVariantRegistry`
- `src/lib/dev/variants-registry.ts` — `VARIANT_REGISTRY` aggregator

Resolution order: URL `?variant.<key>=<id>` searchParam → localStorage → manifest default. Hydration-safe (initial render = defaults; `useEffect` re-resolves after mount). Invalid ids fall back to default (closed-set resolution).

Tests: `tests/unit/lib/dev/variant-context.test.tsx` — 9 tests covering initial-default resolution, localStorage read, URL override, unknown-id fallback (storage + URL), setter persistence, invalid-id rejection, reset clears storage + reverts, provider-absent fallback. `tests/unit/lib/dev/variants-registry.test.ts` — 3 tests covering pre-signup-interview entry, helpRail 6 options, default = off.

### AC-3 — Dev control surface

Files shipped:
- `src/app/dev/control/page.dev.tsx` — variant control route
- `src/app/dev/proto/registry.ts` — new dev-tools row `dev-variant-control`

Mode-gated via `MODE !== 'dev'` early return. Each variant set renders as a radiogroup with per-option label + description + active/default indicator + reset button.

Tests: `tests/unit/app/dev/control/page.dev.test.tsx` — 5 tests covering render contents, initial-checked default, V2 selection persistence, reset clears + reverts, MODE gate.

### AC-4 — Three Help Rail components extracted from canvas (V4 + V5 deferred)

Files shipped:
- `src/app/dev/proto/pre-signup-interview/components/rails/rail-constants.tsx` — INK / SUB / MUTE / VIOLET / MAGENTA / LINE / PANEL_BG colour tokens; shared `railContainerStyle`, `railEyebrowStyle`, `railHeadingStyle`, `railSubStyle`, `monoFooterStyle`; SVG icon components (Arrow / Send / Chat / Phone / Heart / Sparkle / Lock).
- `src/app/dev/proto/pre-signup-interview/components/rails/RailGlossary.tsx` — V1 · contextual glossary with active-section highlight (focus-driven)
- `src/app/dev/proto/pre-signup-interview/components/rails/RailCoach.tsx` — V2 · AI coach chat affordance with user/bot bubbles + suggested questions + input + scope copy
- `src/app/dev/proto/pre-signup-interview/components/rails/RailWhy.tsx` — V3 · numbered transparency rows + privacy box

Pattern: 5-step canvas-as-source light adapt per CLAUDE.md §"Visual direction" §"Canvas-as-source". Canvas constants tokenised to typed exports; canvas's className-based CSS replaced with inline-style equivalents (prototype canvas-as-source — visual fidelity approximate, no canvas-fidelity gate). Source canvas: `docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html` (RailGlossary L1765-1824, RailCoach L1829-1871, RailWhy L1876-1920).

V4 (Talk to a human) and V5 (Hybrid tabbed) listed in the manifest but render `<RailDeferred>` placeholders when selected, with explanatory copy citing the canvas designer's "instrument before building the remaining two" framing. Follow-up slice will land V4 + V5 components.

### AC-5 — Integration with 1280px graceful enhancement

Files shipped/edited:
- `src/app/dev/proto/pre-signup-interview/components/HelpRailLayout.tsx` — layout wrapper; reads `useVariant`; renders `ActiveRail` (switch over variant id) alongside children; hides rail when variant is `off` or `''`
- `src/app/dev/proto/pre-signup-interview/page.tsx` — wraps `ProtoProvider` + `ScreenSwitch` in `VariantProvider` + `HelpRailLayout`
- `src/app/dev/proto/pre-signup-interview/page.module.css` — new `.helpRailWrapper` / `.helpRailContent` / `.helpRailColumn` classes; `.helpRailColumn { display: none }` below 1280px; `@media (min-width: 1280px)` flips wrapper to flex-row and shows the rail column.

CSS-only breakpoint: no JS-side viewport detection; no hydration mismatch surface.

### AC-6 — Tests

Total new tests: **34** (across 5 test files).

| Test file | Test count | Coverage |
|---|---|---|
| `tests/unit/lib/dev/variant-manifest.test.ts` | 6 | Manifest helpers |
| `tests/unit/lib/dev/variant-context.test.tsx` | 9 | Resolution precedence + hooks + reset + provider absence |
| `tests/unit/lib/dev/variants-registry.test.ts` | 3 | Aggregator shape |
| `tests/unit/app/dev/control/page.dev.test.tsx` | 5 | Control surface render + interaction + MODE gate |
| `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx` | 11 | Rail-component smoke + layout variant switching + URL override |

Existing proto suite regression: 82/82 green (post-registry-count update from 61 → 62 to absorb the new dev-tools row). Full suite: 758/758 green.

## Definition of Done (per CLAUDE.md §"Engineering conventions")

1. **All ACs met with evidence per AC** — yes (this file)
2. **Tests written and passing** — 34 new tests; full suite 758/758
3. **Adversarial review** — PENDING at PR auto-review (persona suite fires on PR open / first synchronize)
4. **Preview deploy verified in-browser if UI** — DEFERRED per the inherited SESSION-CONTEXT system-wide-a11y-pass deferral (see §"Preview-deploy verification" below)
5. **No regression in adjacent slices** — full suite green
6. **Slice's open 68f/g entries** — n/a (no open entries map to this slice)

Plus the security checklist short-form (items 1, 8, 12, 14 only per prototype category) — see `security.md`.

## Preview-deploy verification

Per the inherited deferral recorded in SESSION-CONTEXT (P1 scope decision — preview-deploy 6-dim rubric exercises pushed to a single system-wide pass once prototype journeys lock down — covering golden path · edge cases · prefers-reduced-motion · keyboard-only · mobile viewport · screen-reader). This slice ships under that inheritance — formal rubric exercises ship at the system-wide pass; preview-deploy URL surfaces via Vercel comment on PR.

## Spec sources

CLAUDE.md §"Visual direction" §"Canvas-as-source":
> *"Canvas-as-source (prototype default). Used for screens under `src/app/dev/proto/<slug>/**`. Canvas JSX is the page with light adaptation. No canvas-fidelity gate; no per-AC verbatim quoting. Feedback via preview-deploy + user iteration."*

CLAUDE.md §"Coding conduct" §"Effects behind interfaces":
> *"Pure logic doesn't import side-effecty modules; effects (storage, network, time, randomness) live behind interfaces consumers can swap."*

→ `localStorage` + `URL.searchParams` access are encapsulated in the `variant-context.tsx` provider/hooks; consumers (rail components, control surface, layout wrapper) call hooks only. The provider can swap the resolution layer in tests via the registry prop.

## Architectural deferrals

- **V4 (RailHuman) + V5 (RailHybrid) impl** — deferred to a follow-up slice. Rationale: AC scope renegotiation at the warn threshold favoured shipping three rails + integration + tests cleanly over hitting the stop threshold with five partially-tested rails. The canvas designer's own "Suggested next step" §Reading notes argument applies: see the three primary rail intents (reference / coach / trust) live before deciding which to expand.
- **`tokens.*` integration for rail constants** — `rail-constants.tsx` carries hex literals (INK / SUB / MUTE / VIOLET / MAGENTA) rather than referencing `@/styles/tokens`. Rationale: the canvas's brand-magenta + violet aren't in S-F1's 76 tokens; introducing them requires a token-design decision (semantic naming, contrast ratios, etc.) that's heavier than a prototype slice should bake. Follow-up: if any rail variant is chosen for production, tokenise the colour set at that point.
