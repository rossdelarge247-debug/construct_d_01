# S-PROTO-o4-canvas-as-source

**Category:** prototype

Migrate the O4 screen ("Employment / self-employment") from preserve-and-rebuild to canvas-as-source via the 5-step adapt pattern per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)". The page becomes the canvas: drops `ScreenShell` / `RadioCard` / `TitleShape`, inlines the mobile-frame visual structure from the O4 expressive canvas, and adopts native `<fieldset>` / `<legend>` / `<input type="radio">` semantics for the single question. Cross-screen chrome (shared `Arrow` + `BrandBar` + `ProgressPill` + footer chassis pattern) is consumed verbatim from the established cross-screen pattern shipped in S-PROTO-o1-canvas-as-source.

State model is canvas-aligned via a small rename: `SelfEmployment` union member `'neither'` → `'no'` (matches canvas `OPTIONS_FULL[0].key = "no"` per `docs/design-source/pre-signup-interview/jsx/o4-frames.jsx` L99). Touch sites: `lib/types.ts` (union literal) + `lib/build-plan.ts:67` (branch comparison). Copy file `lib/copy/o4.ts` is reshaped to match the canvas information model (per-option `primary` + optional `detail`; `eyebrow` with accent colour reference; helper-text block; canvas-emphasised option flag).

No `**Linked canvas:**` field is declared (canvas-fidelity persona stays dormant per CLAUDE.md §"Hard controls"). Per-AC evidence cites the source canvas inline. Source canvas (mobile-frame state): `docs/design-source/pre-signup-interview/o4-employment-complexity-expressive.html` L125-220 (the `ResolvedFrame` component); option data + emphasis flag at `docs/design-source/pre-signup-interview/jsx/o4-frames.jsx` L98-103 (`OPTIONS_FULL`); chip-card layout at L106-122 (`OptionRow`); H2 title at L293 (`TITLES.B2`); helper text at L183 (`HELPER`).

## Pre-flight

Adversarial review budget per CLAUDE.md §"Engineering conventions" §"Adversarial review gate": single pass on the impl PR via auto-review (`acceptance.md` ≤300L → no partitioning). Auto-review fans out 3 default specialists (security, prototype-readiness substituting correctness per the prototype-category persona substitution in CLAUDE.md §"Slice categories", style); canvas-fidelity stays dormant (field-absent).

## Acceptance criteria

### AC-1 — O4 page IS the canvas (no ScreenShell / RadioCard wrap)

`src/app/dev/proto/pre-signup-interview/screens/O4.tsx` renders the visual structure of the canvas `ResolvedFrame` directly: outer flex column with `max-w-[480px] mx-auto`, shared `<BrandBar>` at top, inline bespoke `TopBar` (Back link with `<Arrow dir="left" />` + `<ProgressPill step={step} total={8} />` + matched-width right spacer + bottom border), Hero block (eyebrow "Money" with INDIGO 5×5 dot + serif H2 plain text + sub-stem helper paragraph), body with a single fieldset (4 stacked `<OptionRow>` chip-cards; the `'no'` option styled with bigger padding + larger font + soft box-shadow when unselected per canvas emphasis flag), footer chassis (cream `rgba(245,245,244,0.85)` + `blur(8px)` + 2-state caption + dark pill button with right-arrow `strokeWidth={2}`). Component does NOT import `ScreenShell`, `RadioCard`, or `TitleShape`. Canvas reference: `docs/design-source/pre-signup-interview/o4-employment-complexity-expressive.html` L125-220.

### AC-2 — 5-step adapt applied per CLAUDE.md §"Canvas-as-source"

- **Step 1 — Tokenise.** Canvas constants INK / SUB / MUTE / LINE / INDIGO mapped to `tokens.color.ink` / `tokens.color.text.sub` / `tokens.color.text.muted` / `tokens.color.border` / `tokens.color.accent.indigo`. No raw hex literals in the page body beyond what tokens don't yet cover. Reference: canvas constants used inline at `o4-employment-complexity-expressive.html` L86-100 (LiveOptionRow), L143-148 (status bar — dropped), L151-159 (TopBar), L163-172 (Hero eyebrow + sub-stem). Canvas's expressive-mode `EXPRESSIVE_BG` background tint is dropped at the page-level (page IS the viewport — chrome stays neutral); the inline cards still use canvas's white-on-cream contrast.
- **Step 2 — Copy resolver.** Canvas literals (eyebrow "Money" at `o4-employment-complexity-expressive.html` L165, H2 `TITLES.B2` at `jsx/o4-frames.jsx` L293 ("Does either of you work for yourself, or run a limited company?"), helper sub-stem `HELPER` at `jsx/o4-frames.jsx` L183 ("This affects how we handle income evidence later."), `OPTIONS_FULL` entries at `jsx/o4-frames.jsx` L99-102 with `key` + `primary` + `detail` shape) resolved via `getCopy(stage)` from `lib/copy/o4.ts`. Copy file reshaped: option entries gain `primary` + optional `detail` + `emphasised` boolean (replacing `label` + `helper` from prior shape); new `eyebrow` block carrying label + accent colour ref; new `helper` block; new `captions` block with `pickToContinue` + `oneAnswered` keys.
- **Step 3 — State wiring.** Canvas demo state (`answer`, `setAnswer` as `useState<string|null>`) replaced with real state from `useProto()`: `answers.employment.selfEmployment`; updates via `setAnswer('employment', { ...prev, selfEmployment: v })`. Continue CTA enable logic derives from `Boolean(employment.selfEmployment)` per canvas L126 `enabled = answer !== null`. Affected outside the screen file: `lib/types.ts` `SelfEmployment` union literal `'neither'` → `'no'` to match canvas key; `lib/build-plan.ts:67` branch comparison literal updated to match.
- **Step 4 — Next.js wrap.** `'use client'` directive preserved. Component export remains `export function O4()` at the existing path `src/app/dev/proto/pre-signup-interview/screens/O4.tsx`.
- **Step 5 — Inline canvas-local helpers OR adapt.** `OptionRow` inlined as a screen-local component (canvas-specific chip-card treatment with emphasis variant). `TopBar`, `Hero`, `Footer` inlined screen-local matching O1/O2/O3 pattern. Shared `Arrow` + `BrandBar` + `ProgressPill` imported from `../components/` per the established cross-screen pattern. Canvas's `StepRail` local def is replaced by shared `ProgressPill`. Canvas's outer phone-bezel + "9:41" status bar + `RESOLVED · A1 · B2 · C3` variant labels are DROPPED (the page IS the viewport; variant labels are design-exploration scaffolding).

### AC-3 — Native form semantics for the single question

One `<fieldset>` block:

- **Employment fieldset:** `<fieldset aria-labelledby="o4-emp-legend">` wraps four real `<input type="radio" name="o4-self-employment">` (one per `SelfEmployment` value: `no` · `me` · `ex` · `both`). `<legend id="o4-emp-legend" className="sr-only">` contains the canvas question label "Does either of you work for yourself, or run a limited company?" (sr-only, the visual heading-style label rendered separately as the H2 hero). Each radio is visually rendered as a `<OptionRow>` chip-card (the actual radio input visually hidden via `sr-only`; custom 18×18 dot rendered alongside per canvas L102-110); the `'no'` option carries `emphasised` styling.

Keyboard model: arrow keys move within the radio group, Space selects, Tab leaves the group (browser-default behaviour for native `<input type="radio">` sharing a `name`). Reference: canvas L178-185 (`OPTIONS_FULL.map` rendering inline in `ResolvedFrame`).

### AC-4 — Animations + reduced-motion fallback

`src/app/dev/proto/pre-signup-interview/screens/O4.module.css` ships the canvas's animation spec consistent with O1-O3:

- **Chip-card hover:** 1px upward translate + border-colour transition 160ms ease (canvas `LiveOptionRow` L99 `transition: "background 120ms ease-out, border-color 120ms ease-out, padding 160ms ease-out"` — 160ms aligns to O1-O3's established cross-screen rhythm).
- **Chip-card selected:** INK fill via `.cardSelected` (background-color 160ms + border-color 160ms). Inner radio dot is conditional-rendered (matches canvas `LiveOptionRow` L102-110 `{selected && <span ... />}`); the dot itself has no CSS transition — the canvas transition list at L99 covers `background, border-color, padding` only. Emphasised variant: padding transitions 160ms ease so the emphasised → selected transition stays smooth (matches canvas L99 `padding 160ms ease-out`).
- **Chip-card focus-visible:** 2px INK outline at 2px offset on the native `<input>` parent label.
- **CTA enable:** opacity + saturation 240ms ease-out + single 1px upward keyframe bounce ≤320ms when the button transitions from disabled to enabled.
- **Page entry:** 8px upward translate + opacity 0→1, 320ms ease-out, 80ms stagger across hero block + 4 OptionRow cards via `animation-delay: calc(var(--stagger-index, 0) * 80ms)` driven by inline `--stagger-index` custom property (matches the unified stagger pattern in O1-O3).
- **Reduced-motion override:** `@media (prefers-reduced-motion: reduce)` sets all `transition`/`animation` to `none`/`0.01ms` so the visual outcome is instant for users with the OS-level preference set.

## Out of scope

- **Phone bezel + "9:41" status bar + variant labels.** Canvas L128-148 wraps the visual in a 375×760 phone-bezel mockup with status bar + `RESOLVED · A1 · B2 · C3` variant label. The page IS the mobile viewport (canvas presentation chrome dropped — matches O1/O2/O3 pattern).
- **Variant-exploration sections (A1/A2/A3 helper-text treatments + B1/B2/B3 title-treatments + C1/C2/C3 emphasis-treatments).** Canvas L438-484 catalogues the design-exploration matrix; only the locked combination (B2 title + C3 emphasis) ships per canvas L146 `RESOLVED · A1 · B2 · C3`. The "Caption below" A1 helper-text treatment (sub-stem below H2 per L170-172) ships; the popover and reveal-on-select treatments do not.
- **Expressive page-level background tint.** Canvas L138 sets `EXPRESSIVE_BG` on the mobile viewport for design exploration; the live page keeps neutral chrome consistent with O1-O3.
- **Other O screens (O5-O8) migration.** Each is its own slice per session 88 batching decision (per-screen).
- **Sticky CTA mechanism** (true `position: sticky` + safe-area-inset + shorter-than-667 viewport hardening). Deferred to production graduation per the standing architectural deferral in `docs/slices/S-PROTO-o1-canvas-as-source/verification.md` §"Architectural deferrals".
- **44×44 touch target on Back link.** Deferred to production graduation per the standing architectural deferral in `docs/slices/S-PROTO-o1-canvas-as-source/verification.md` §"Architectural deferrals" (negative-margin or invisible hit-area extender).
- **Removing `ScreenShell` / `RadioCard` from `src/`.** Still consumed by O5-O8. Cleanup slice lands after all screens migrate.
- **Cross-canvas reconciliation with desktop variants.** Per constraint #41, desktop graceful enhancement is its own future slice.

## Verification

See `verification.md`. Prototype-category DoD-14 short-form (items 1, 8, 12, 14 only) — spec 76 §3 short-form mapping; CLAUDE.md §"Definition of Done" enumerates the items.
