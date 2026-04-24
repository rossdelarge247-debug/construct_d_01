# S-F1 · Design system tokens — Acceptance criteria

**Slice:** S-F1-design-tokens
**Spec ref:** `docs/workspace-spec/70-build-map-slices.md` (S-F1 slice card) · `docs/workspace-spec/68g-visual-anchors.md` (C-V1 phase colour system, C-V13 phase accent-tint washes) · `docs/workspace-spec/70-build-map.md` line 117 (Button as first Preserve-with-reskin target)
**Phase(s):** Foundation (Phase C, Step 1) — pre-phase token layer used by every phase surface downstream
**Status:** Approved · In implementation

---

## Context

S-F1 is the design-system token foundation, extracted from two hi-fidelity Claude AI Design prototypes shipped on this branch (`docs/design-source/welcome-tour/Welcome Tour - Standalone.html` + `docs/design-source/post-connect-dashboard/Post-connect Dashboard - Standalone.html`). It is the first `src/`-touching slice of the Phase C rebuild, ships under the full 6-item DoD + 13-item security checklist, and is the canary for the six hook-calibration observations parked in `docs/HANDOFF-SESSION-28.md`. Token coverage scoped to what the two prototypes evidence + what spec 68g C-V1/C-V13 lock — Start phase implicit (no `--color-phase-start` token). Component rebuilds (welcome carousel C-V2, dashboard stepper C-V6, etc.) live in downstream slices that consume these tokens. Imagery convention established in this slice; actual image assets land with their owning component slice.

## Dependencies

- **Upstream slices:** none — this is the foundation.
- **Open decisions resolved by this slice:**
  - 68g **C-V1** (phase colour system) — locked by AC-1 with the four phase accent + soft pairs extracted from prototype lines 654-691 (`{Build/Reconcile/Settle/Finalise}.{accent,accentSoft}`).
  - 68g **C-V13** (phase accent-tint card washes) — locked by AC-1 phase shadow tokens + AC-1 soft tints, both phase-correlated.
- **Open decisions referenced but NOT resolved here:**
  - 68g C-V2..C-V12, C-V14 — anchor *components* whose specs ship with their respective downstream slices.
  - Bank brand colour tokens — deferred to bank-picker slice (C-V10).
  - Peach/warm tints (`#FFEEE7`, `#E6F0FA`, etc.) — deferred to connected-data-source-card slice (C-V9).
- **Re-use / Preserve-with-reskin paths touched:**
  - `src/components/ui/button.tsx` — reskinned to consume tokens (per spec 70 line 117: "Variant logic valid; V1 palette (`#E5484D`, `--color-grey-100`) → new design-system tokens at S-F1").
  - `src/app/globals.css` — extended with `:root` token declarations.
  - New: `src/styles/tokens.ts` — typed TS mirror.
  - New: `public/images/` directory + README.
- **Discarded paths deleted at DoD:** none.

## MLP framing

The loveable floor is **a principled, semantically-named token vocabulary that every subsequent component slice consumes without re-inventing colour/type/shadow/spacing decisions**. Cuts happen by deferring un-evidenced tokens (e.g. bank brand colours) to the slice that needs them — not by shipping a half-named or partially-typed system. Naming is role-based, not surface-of-first-appearance, to minimise rename pressure as later slices land.

---

## AC-1 · CSS token layer in `src/app/globals.css`

- **Outcome:** The full token vocabulary (64 tokens) is declared as CSS custom properties under `:root` in `src/app/globals.css`, available globally without imports. Values match the design source verbatim.
- **Verification:** `grep -E '^\s*--color-|^\s*--font-|^\s*--type-|^\s*--weight-|^\s*--letter-|^\s*--radius-|^\s*--shadow-|^\s*--space-|^\s*--layout-' src/app/globals.css | wc -l` returns ≥64. Each phase token (`--color-phase-{build,reconcile,settle,finalise}` + `-soft` variants) matches the value in `docs/design-source/welcome-tour/Welcome Tour - Standalone.html` lines 654-691.
- **In scope:**
  - 15 colour tokens (7 neutral + 8 phase + 1 state).
  - 12 type-scale tokens (`--type-11` through `--type-72`, decimals as `-N`-suffix: `--type-14-5`, `--type-15-5`).
  - 3 font-family tokens (`--font-sans`, `--font-serif`, `--font-mono`).
  - 4 weight tokens (`--weight-regular/-medium/-semibold/-bold`).
  - 1 letter-spacing token (`--letter-spacing-wide`).
  - 3 radius tokens (`--radius-sm/-md/-lg`).
  - 7 shadow tokens (3 neutral + 4 phase-tinted).
  - 17 spacing tokens (`--space-1` through `--space-60`, preserved verbatim per user direction).
  - 2 layout-container tokens (`--layout-max-narrow: 760px`, `--layout-max-wide: 960px`).
- **Out of scope:** dark-mode variants; reduced-motion variants; print-specific tokens; Tailwind theme integration; bank brand tokens; un-evidenced state tokens (success / warning / info beyond `--color-danger`); spacing extensions beyond observed values.
- **Opens blocked:** none — all 68g C-V1/C-V13 inputs are present in design source.
- **Loveable check:** A downstream slice author opens `globals.css`, finds every primitive named by *role*, can ship a phase-coloured chip in two lines without inventing values. Yes — delight, not merely served.
- **Evidence at wrap:** diff hunk of `src/app/globals.css`; output of the `grep | wc -l` count above; preview-deploy URL with computed-styles smoke check on the placeholder landing page rendering through tokenised values.

## AC-2 · Typed TypeScript mirror in `src/styles/tokens.ts`

- **Outcome:** Every CSS custom property has a typed counterpart in `src/styles/tokens.ts` exporting a frozen `tokens` object + a discriminated `TokenName` union, importable by TS/TSX consumers (e.g. `import { tokens } from '@/styles/tokens'`).
- **Verification:** `npx tsc --noEmit` passes; `import { tokens } from '@/styles/tokens'` resolves and typechecks in any TSX file; the object's keys are exhaustive against the CSS layer (test in AC-5 enforces parity).
- **In scope:** the 64 tokens from AC-1, organised by family (`tokens.color.phase.build`, `tokens.type.scale[40]`, etc.). All values are literal strings matching the CSS values; all keys are typed.
- **Out of scope:** runtime style objects, CSS-in-JS adapters, Tailwind theme exports. The TS mirror is for *reference + lookup*, not as a styling engine — components style with CSS classes that reference the custom properties, not with inline `style={{...}}` everywhere.
- **Opens blocked:** none.
- **Loveable check:** A downstream slice author can autocomplete `tokens.color.phase.` in their editor and pick the right colour without leaving the file. Yes — delight.
- **Evidence at wrap:** `npx tsc --noEmit` output; sample import-and-use snippet; the parity test from AC-5 passing.

## AC-3 · Button reskin (Preserve-with-reskin)

- **Outcome:** `src/components/ui/button.tsx` is reskinned to consume tokens — every previously hardcoded colour / radius / shadow / type-size value is replaced with the corresponding token. Variant logic (`primary` / `secondary` / `ghost` / etc.) is preserved unchanged.
- **Verification:** `git diff src/components/ui/button.tsx` shows V1 palette removed, no remaining hardcoded `#` hex values, no remaining hardcoded `px` size values that have a token equivalent. The component still renders with the same variants and sizes; visual snapshot test passes (AC-5).
- **In scope:** Button only. Other Preserve-with-reskin components (Card, Badge, header, footer, env-banner, hub primitives) are *not* in scope — they reskin in their owning downstream slices.
- **Out of scope:** API surface changes (variant names, size names, prop signatures); behavioural changes (focus-ring logic, disabled state semantics); new variants.
- **Opens blocked:** none.
- **Loveable check:** Button used anywhere in the app inherits the new visual treatment automatically without per-call-site updates. Yes — delight.
- **Evidence at wrap:** before/after diff; visual snapshot; preview-deploy URL showing the placeholder landing page with the reskinned Button (any existing usage).

## AC-4 · Imagery convention

- **Outcome:** A `public/images/` directory exists with a sub-folder convention (`public/images/{component-slug}/`) and a `README.md` documenting (a) the convention, (b) the rationale (Next.js static serving, component-scoped), (c) where the welcome-tour imagery will land when its slice runs.
- **Verification:** `ls public/images/README.md` exists; the README is ≤25 lines; it cites the Welcome Tour slice as the first consumer.
- **In scope:** directory + README. No image assets shipped in this slice (they ship with their owning component slice per the option-B scoping decision).
- **Out of scope:** actual image files; image-optimisation config; CDN setup; favicon work.
- **Opens blocked:** none.
- **Loveable check:** When the Welcome Tour slice runs next, the author drops images into `public/images/welcome-tour/` without bikeshedding the location. Yes — delight.
- **Evidence at wrap:** `cat public/images/README.md`; tree listing of `public/images/`.

## AC-5 · Tests pass

- **Outcome:** Three test categories pass: (a) **TS parity** — `tokens` object keys ↔ CSS custom properties match exhaustively; (b) **typecheck** — `npx tsc --noEmit` clean; (c) **visual smoke** — Button reskin renders with token-derived computed styles in the placeholder landing page.
- **Verification:**
  - `npx vitest run` — passes; new test in `tests/unit/tokens.test.ts` enforces parity (every CSS `--name` in `globals.css` has a corresponding key in `tokens.ts`, and vice versa).
  - `npx tsc --noEmit` — passes.
  - `npm run lint` — passes (no new lint errors; pre-existing 23 warnings in preserved code allowed).
  - `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` — passes; placeholder landing page builds.
  - Preview deploy: opening the landing page, computed-styles for any element that uses `var(--color-ink)` resolves to `#1A1A1A` (browser dev-tools spot-check evidenced via screenshot).
- **In scope:** three test categories above. Visual regression snapshots optional — Button is the only component reskinned and visual smoke is sufficient evidence for a token-foundation slice.
- **Out of scope:** Playwright integration tests (no user-facing flow yet); accessibility audit of reskinned Button (covered when Button is *used* in a downstream slice's a11y AC).
- **Opens blocked:** none.
- **Loveable check:** N/A — tests are infra, not user-facing.
- **Evidence at wrap:** test-runner output for each command above; screenshot of dev-tools computed-style.

## AC-6 · Slice documentation complete

- **Outcome:** All four DoD documents in `docs/slices/S-F1-design-tokens/` are populated with slice-specific content (not template placeholders): `acceptance.md` (this file, frozen), `test-plan.md`, `security.md`, `verification.md`. Coverage notes explicitly state which 68g entries are locked here vs deferred + a "Token coverage gaps" section listing token families that downstream slices may need to extend (with the slice IDs that own the extension).
- **Verification:**
  - `grep -L '{S-XX' docs/slices/S-F1-design-tokens/*.md | wc -l` returns 4 (no template placeholders left).
  - `verification.md` records all six DoD items completed (AC met + tests pass + adversarial review done + preview-deploy verified + no regression in adjacent slices + 68g entries resolved-or-deferred).
  - 13-item security checklist exercised in `security.md`; any non-N/A items addressed.
- **In scope:** all four slice docs populated; 68g register flips for C-V1 + C-V13 from 🟠 to 🟢 with link back to this slice.
- **Out of scope:** updating downstream slice docs (their authors do that); HANDOFF-29 retro (separate end-of-session step).
- **Opens blocked:** none.
- **Loveable check:** A future engineer reading the slice can understand exactly what shipped, why, and what was deferred — including the token-coverage map. Yes — delight for the reader.
- **Evidence at wrap:** all four slice docs present + populated; 68g-visual-anchors.md C-V1 + C-V13 status flips visible in diff.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-24 | User (informal) | Pre-AC scope locked | Reading 1 / option B; phase-colour treatment (b); Start implicit; role-based neutral names; preserve-12 type scale; literal-pixel naming; danger = `#FF3B30`; explicit phase shadows; spacing fully preserved (17 values). |
| 2026-04-24 | User | **AC frozen** | Implementation may begin. Change requests roll into re-drafted AC + re-slicing, not mid-slice scope shifts. |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
