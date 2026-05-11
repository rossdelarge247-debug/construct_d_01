# S-PROTO-o3-canvas-as-source

**Category:** prototype

Migrate the O3 screen ("Your ex & safety") from preserve-and-rebuild to canvas-as-source via the 5-step adapt pattern per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)". The page becomes the canvas: drops `ScreenShell` / `RadioCard` / `RadioChips`, inlines the mobile-frame visual structure from the O3 expressive canvas, and adopts native `<fieldset>` / `<legend>` / `<input type="radio">` semantics for both questions. Cross-screen chrome (shared `Arrow` + `ProgressPill` + footer chassis pattern) is consumed verbatim from the established cross-screen pattern shipped in S-PROTO-o1-canvas-as-source.

State model is unchanged: `ExAndSafetyAnswers` still has `relationshipQuality` + `devicePrivate`; `Stage` union already canvas-aligned. Copy file `lib/copy/o3.ts` is reshaped to match the canvas information model (per-option `primary` + optional `detail`; new 3-state caption block; `eyebrow` + plain `heading` text reflect canvas literals).

No `**Linked canvas:**` field is declared (canvas-fidelity persona stays dormant per CLAUDE.md §"Hard controls"). Per-AC evidence cites the source canvas inline. Source canvas (mobile-frame state): `docs/design-source/pre-signup-interview/o3-your-ex-and-safety-expressive.html` L149-253 (the `ResolvedFrame` component); option data at L64-69 (`REL_OPTIONS`); chip-card layout at L94-129 (`RelRow`); pill layout at L131-147 (`PrivPill`); 3-state caption logic at L226-234.

## Pre-flight

Adversarial review budget per CLAUDE.md §"Engineering conventions" §"Adversarial review gate": single pass on the impl PR via auto-review (`acceptance.md` ≤300L → no partitioning). Auto-review fans out 3 default specialists (security, prototype-readiness substituting correctness per the prototype-category persona substitution in CLAUDE.md §"Slice categories", style); canvas-fidelity stays dormant (field-absent).

## Acceptance criteria

### AC-1 — O3 page IS the canvas (no ScreenShell / RadioCard / RadioChips wrap)

`src/app/dev/proto/pre-signup-interview/screens/O3.tsx` renders the visual structure of the canvas `ResolvedFrame` directly: outer flex column with `max-w-[480px] mx-auto`, shared `<BrandBar>` at top, inline bespoke `TopBar` (Back link with `<Arrow dir="left" />` + `<ProgressPill step={step} total={8} />` + matched-width right spacer + bottom border), Hero block (eyebrow "Your ex" + serif H2 plain text, no italic accent), body with relationship-question section (4 stacked `<RelRow>` chip-cards) + privacy-question section (preamble + inline label + 2 `<PrivPill>` buttons aligned right), footer chassis (cream `rgba(245,245,244,0.85)` + `blur(8px)` + 3-state caption + dark pill button with right-arrow `strokeWidth={2}`). Component does NOT import `ScreenShell`, `RadioCard`, `RadioChips`, or `TitleShape`. Canvas reference: `docs/design-source/pre-signup-interview/o3-your-ex-and-safety-expressive.html` L149-253.

### AC-2 — 5-step adapt applied per CLAUDE.md §"Canvas-as-source"

- **Step 1 — Tokenise.** Canvas constants INK / SUB / MUTE / LINE / VIOLET mapped to `tokens.color.ink` / `tokens.color.text.sub` / `tokens.color.text.muted` / `tokens.color.border` / `tokens.color.accent.violet`. No raw hex literals in the page body beyond what tokens don't yet cover. Reference: canvas constants used inline at L86-88 (StepRail), L100-106 (RelRow), L135-137 (PrivPill), L171-176 (TopBar), L187 (Hero eyebrow color).
- **Step 2 — Copy resolver.** Canvas literals ("Your ex" eyebrow at L187, "How would you describe things between you and your ex?" heading at L189, REL_OPTIONS primary + detail at L64-69, privacy preamble at L205-207, privacy label at L209-211, privacy pill labels at L213-214, 3-state captions at L227-233) resolved via `getCopy(stage)` from `lib/copy/o3.ts`. Copy file reshaped: option entries gain `primary` + optional `detail` (replacing `label` + `helper` from prior shape); new `captions` block with `pickToContinue` + `privacyOptional` + `bothAnswered` keys.
- **Step 3 — State wiring.** Canvas demo state (`relAnswer`, `setRelAnswer`, `privAnswer`, `setPrivAnswer` as `useState`) replaced with real state from `useProto()`: `answers.exAndSafety.relationshipQuality` + `answers.exAndSafety.devicePrivate`; updates via `setAnswer('exAndSafety', { ...prev, ...patch })`. Continue CTA enable logic derives from `Boolean(exAndSafety.relationshipQuality)` (privacy optional per canvas L150 `enabled = relAnswer !== null`).
- **Step 4 — Next.js wrap.** `'use client'` directive preserved. Component export remains `export function O3()` at the existing path `src/app/dev/proto/pre-signup-interview/screens/O3.tsx`.
- **Step 5 — Inline canvas-local helpers OR adapt.** `RelRow` + `PrivPill` inlined as screen-local components (canvas-specific chip-card + pill treatments). `TopBar`, `Hero`, `Footer` inlined screen-local matching O1/O2 pattern. Shared `Arrow` + `BrandBar` + `ProgressPill` imported from `../components/` per the established cross-screen pattern. Canvas's `StepRail` local def is replaced by shared `ProgressPill`. Canvas's outer phone-bezel + "9:41" status bar are DROPPED (the page IS the viewport — phone-bezel mockup is canvas presentation chrome).

### AC-3 — Native form semantics for both questions

Two `<fieldset>` blocks, one per question:

- **Relationship fieldset:** `<fieldset aria-labelledby="o3-rel-legend">` wraps four real `<input type="radio" name="o3-relationship">` (one per `RelationshipQuality` value: `amicable` · `difficult` · `high-conflict` · `safety-concern`). `<legend id="o3-rel-legend" className="sr-only">` contains the question label "Your relationship right now" (sr-only, visible heading-style label rendered separately if canvas requires). Each radio is visually rendered as a `<RelRow>` chip-card (the actual radio input visually hidden via `sr-only`; custom 18×18 dot rendered alongside per canvas L108-116).
- **Privacy fieldset:** `<fieldset aria-labelledby="o3-priv-legend">` wraps two real `<input type="radio" name="o3-privacy">` (one per `DevicePrivate` value: `yes` · `not-sure`). `<legend id="o3-priv-legend" className="sr-only">` contains the canvas label "Is this device private to you?". Each radio visually rendered as a `<PrivPill>` (smaller inline pill per canvas L131-147).

Keyboard model: arrow keys move within each radio group, Space selects, Tab leaves the group (browser-default behaviour for native `<input type="radio">` sharing a `name`). Reference: canvas L196-200 (REL_OPTIONS map) + L213-214 (PrivPill inline render).

### AC-4 — Animations + reduced-motion fallback

`src/app/dev/proto/pre-signup-interview/screens/O3.module.css` ships the canvas's animation spec consistent with O1:

- **Chip-card hover:** 1px upward translate + border-colour transition 160ms ease (canvas RelRow L106 `transition: "background 120ms ease-out, border-color 120ms ease-out"` — 160ms aligns to O1's established cross-screen rhythm).
- **Chip-card selected:** INK fill + dot transitions inherited from canvas (border-color 160ms + dot-fill 120ms + background 160ms).
- **Pill hover/selected:** background + color + border transitions 120ms ease (canvas PrivPill inline state).
- **Chip-card focus-visible:** 2px INK outline at 2px offset on the native `<input>` parent label; pill focus-visible same offset treatment.
- **CTA enable:** opacity + saturation 240ms ease-out + single 1px upward keyframe bounce ≤320ms when the button transitions from disabled to enabled.
- **Page entry:** 8px upward translate + opacity 0→1, 320ms ease-out, 80ms stagger across hero block + 4 RelRow cards + privacy section via `animation-delay: calc(var(--stagger-index, 0) * 80ms)` driven by inline `--stagger-index` custom property (matches the unified stagger pattern in O1).
- **Reduced-motion override:** `@media (prefers-reduced-motion: reduce)` sets all `transition`/`animation` to `none`/`0.01ms` so the visual outcome is instant for users with the OS-level preference set.

## Out of scope

- **Phone bezel + "9:41" status bar.** Canvas L152-172 wraps the visual in a 375×760 phone-bezel mockup with status bar. The page IS the mobile viewport (canvas presentation chrome dropped — matches O1/O2 pattern).
- **Variant-label scaffolding "RESOLVED · A1 · B1 · C2"** (canvas L170). Design-exploration labels, not screen content.
- **Other O screens (O4-O8) migration.** Each is its own slice per session 88 batching decision (per-screen).
- **Sticky CTA mechanism** (true `position: sticky` + safe-area-inset + shorter-than-667 viewport hardening). Deferred to production graduation per the standing architectural deferral in `docs/slices/S-PROTO-o1-canvas-as-source/verification.md` §"Architectural deferrals".
- **44×44 touch target on Back link.** Deferred to production graduation per the standing architectural deferral in `docs/slices/S-PROTO-o1-canvas-as-source/verification.md` §"Architectural deferrals" (negative-margin or invisible hit-area extender).
- **Removing `ScreenShell` / `RadioCard` / `RadioChips` from `src/`.** Still consumed by O4-O8. Cleanup slice lands after all screens migrate.
- **Cross-canvas reconciliation with desktop variants.** Per constraint #41, desktop graceful enhancement is its own future slice.

## Verification

See `verification.md`. Prototype-category DoD-14 short-form (items 1, 8, 12, 14 only) — spec 76 §3 short-form mapping; CLAUDE.md §"Definition of Done" enumerates the items.
