# S-F4 · Trust taxonomy + trust chip — Acceptance criteria

**Slice:** S-F4-trust-chip
**Spec ref:** `docs/workspace-spec/70-build-map-slices.md` L48-L53 (S-F4 slice card) · `docs/workspace-spec/68a-decisions-crosscutting.md` L33-L34 (C-T1 inline-badge placement LOCKED) · L36-L37 (C-T2 6-level taxonomy LOCKED) · `docs/workspace-spec/68f-open-decisions-register.md` L41-L46 (C-T1 visual treatment LOCKED — colour-by-level + label-by-source pattern) · `docs/workspace-spec/71-rebuild-strategy.md` L380 (Phase C.1 sequencing — order #5 after S-F1 + S-F7 + S-F3 + S-F2)
**Phase(s):** Foundation (Phase C, Step 1) — used by every document surface (private, joint, proposal, finalise) on every evidenceable line item
**Status:** Approved · In implementation

---

## Context

S-F4 is the **trust taxonomy + chip pattern** consumed by every evidenceable line item across every document surface in the rebuild. It ships one component (`<TrustChip>`) plus the typed 6-level taxonomy + colour/label primitives that downstream document slices pin every assertion to. Two of six levels carry fully-specified visuals (amber self-declared + green bank-evidenced per 68f L42-L46 wire evidence); four remain visually open per 68f L45 ("visual treatment to be finalised during Phase C anchor extraction but pattern is locked"). The chip is intentionally inline-only per C-T1 placement LOCKED — no callout treatment, no prose embedding. Visual smoke verifies on the placeholder landing (`src/app/page.tsx`) per the option-1a verification surface decision; downstream slices consume the chip in real surfaces.

## Dependencies

- **Upstream slices:** S-F1 design tokens (extended in this slice with `--ds-color-trust-self-declared` + `-soft` + `--ds-color-trust-bank-evidenced` + `-soft` for the two LOCKED visual treatments; four OPEN levels render via neutral utility classes pending Phase C anchor extraction).
- **Open decisions resolved by this slice:** none (the slice implements LOCKED entries; opens 68g C-T1 register entry for the four OPEN visual treatments).
- **Open decisions referenced but NOT resolved here:**
  - 68g C-T1 — per-level visual detail for credit-verified / document-evidenced / both-party-agreed / court-sealed (this slice opens the entry; resolution waits on Phase C anchor extraction).
- **Re-use / Preserve-with-reskin paths touched:**
  - `src/app/globals.css` + `src/styles/tokens.ts` — extended with 4 new trust-level CSS custom properties (2 base + 2 soft) + corresponding TS string-literal entries; S-F1 token-parity test updated to reflect new count.
  - `src/app/page.tsx` — extended with S-F4 demo block rendering all 6 chips (2 styled, 4 placeholder) per option 1a.
  - New: `src/components/trust/{TrustChip,types,levels,index}.{tsx,ts}`.
- **Discarded paths deleted at DoD:** none.

## MLP framing

The loveable floor is **a typed, inline chip carrying a trust level visible on every evidenceable line, with the two LOCKED visual treatments rendered exactly per 68f wire evidence and the four OPEN treatments rendered as neutral placeholders that don't pretend to be final**. Cuts happen by deferring the four OPEN visual treatments to a downstream Phase C anchor-extraction slice — the render path is in place; only the colour palette + label conventions for those four levels wait on design extraction. This slice does not invent visual treatments; it consumes 68f C-T1's locked pattern verbatim and stops short where the spec stops short.

---

## AC-1 · `<TrustChip>` component (C-T1 + C-T2 LOCKED)

- **Outcome:** Inline chip component at `src/components/trust/TrustChip.tsx`. Renders a small inline span carrying trust level visually + source label as text. Props: `level: TrustLevel` (one of six per AC-2), `sourceLabel?: string` (optional override). Visual states: amber bg + amber text for self-declared (per 68f L43); green bg + green text for bank-evidenced (per 68f L44); neutral grey bg + neutral text for the four OPEN levels (placeholder pending Phase C anchor extraction per 68f L45). Inline-only per C-T1 placement LOCKED — no block treatment, no callout.
- **Verification:** Component import resolves; renders with correct level → visual treatment for all 6 levels; computed-style spot-check on amber/green chips resolves to `var(--ds-color-trust-self-declared)` / `var(--ds-color-trust-bank-evidenced)`; `aria-label="Trust: {humanised level} — {sourceLabel}"` present; renders inline (display: inline / inline-flex). Visual smoke from preview-deploy on placeholder landing.
- **In scope:** Single component file (~50-80 lines TSX). Two new tokens (each with base + soft variant) in `globals.css` + `tokens.ts` for the LOCKED visual treatments (4 token additions total). Default-source-label resolution: self-declared → `'Estimated'`; bank-evidenced → `'Bank'` if no source provided; four OPEN levels → humanised level name. Source label override via `sourceLabel` prop (e.g. `'Verified from Barclays xxxx2323'`).
- **Out of scope:** Tooltip on hover with full provenance (separate concern); animation when level upgrades (spec 26; dedicated motion slice); the four OPEN visual treatments (deferred to downstream Phase C anchor extraction); inline-vs-end-of-line positioning rules within document text (consumer surface owns).
- **Opens blocked:** none — opens 68g C-T1 register entry with annotation that the chip pattern + 2 of 6 visual treatments are LOCKED; the 4 OPEN treatments remain pending anchor extraction.
- **Loveable check:** A document author renders `<TrustChip level="bank-evidenced" sourceLabel="Verified from Barclays xxxx2323" />` next to a value and the user instantly sees the value is bank-sourced and from where. Yes — delight, foundational always-visible trust signal.
- **Evidence at wrap:** `git diff src/components/trust/TrustChip.tsx`; preview-deploy screenshot showing all 6 chips on placeholder landing (2 styled per wire evidence, 4 neutral); dev-tools computed-style spot-check on amber + green chips.

## AC-2 · Trust taxonomy types + constants (C-T2 LOCKED)

- **Outcome:** Two artefacts:
  - `src/components/trust/types.ts` — exports `TrustLevel = 'self-declared' | 'bank-evidenced' | 'credit-verified' | 'document-evidenced' | 'both-party-agreed' | 'court-sealed'` (string union; six values per C-T2 LOCKED ordering).
  - `src/components/trust/levels.ts` — exports `TRUST_LEVELS: readonly TrustLevel[]` (frozen array in C-T2 ascending order); `DEFAULT_LEVEL: TrustLevel = 'self-declared'` (per C-T2 "Default for new items = Self-declared"); helper `humaniseLevel(level: TrustLevel): string` for default labels on the four OPEN levels.
- **Verification:** Unit tests covering: each of 6 `TrustLevel` values type-narrows; `TRUST_LEVELS.length === 6`; ordering matches C-T2 verbatim; `DEFAULT_LEVEL === 'self-declared'`; `humaniseLevel('credit-verified')` returns expected string; function does not mutate inputs (frozen-input pass-through).
- **In scope:** Two TS files (~30 lines combined). Pure data + one pure helper (no effects).
- **Out of scope:** Level-upgrade transition logic (downstream — owning consumer surface decides upgrade rules); per-level icon assignment (no icons in C-T1 wire evidence — pattern is "colour + label", not "icon + colour").
- **Opens blocked:** none.
- **Loveable check:** A consumer imports `import { type TrustLevel, TRUST_LEVELS, DEFAULT_LEVEL } from '@/components/trust'` and TS narrows assertions correctly across all 6 levels. Yes — delight, single source of truth for the taxonomy.
- **Evidence at wrap:** vitest output for `tests/unit/components/trust/levels.test.ts`; TS exports consumable from `<TrustChip>` call sites.

## AC-3 · Two locked visual treatments match wire evidence (amber self-declared + green bank-evidenced)

- **Outcome:** Parity test asserts the rendered classNames + computed token values for the two LOCKED levels match 68f C-T1 wire evidence:
  - Self-declared: amber background + amber text, default label `'Estimated'`, computed-style resolves to `var(--ds-color-trust-self-declared)` family.
  - Bank-evidenced: green background + green text, default label `'Bank'` (when no source supplied) or `${sourceLabel}` (when supplied — e.g. `'Verified from Barclays xxxx2323'`), computed-style resolves to `var(--ds-color-trust-bank-evidenced)` family.
- **Verification:** `tests/unit/components/trust/parity.test.ts` reads 68f L42-L46 at test time + asserts default label for self-declared === `'Estimated'`; asserts the two LOCKED levels carry their dedicated trust tokens (not phase tokens, not Tailwind utilities); asserts the four OPEN levels do NOT carry trust tokens (they consume neutral utilities pending anchor extraction).
- **In scope:** One parity test file (~40 lines).
- **Out of scope:** Visual regression snapshots (preview-deploy spot-check sufficient); accessibility contrast audit (covered by general a11y pass on consumer surfaces); pixel-perfect colour-hex assertion (token-name equality is the parity contract, not specific hex values).
- **Opens blocked:** none.
- **Loveable check:** N/A — parity test is infra.
- **Evidence at wrap:** vitest output for parity test; computed-style spot-check screenshots from preview-deploy.

## AC-4 · Tests pass

- **Outcome:** Three test categories pass: (a) taxonomy unit tests (per AC-2); (b) component-render smoke for `TrustChip` rendering all 6 levels; (c) parity test enforcing 68f L42-L46 values (per AC-3).
- **Verification:**
  - `npx vitest run` — all new tests pass; pre-existing tests unbroken (S-F1 token-parity test updated to reflect 4 new trust tokens; S-F3 phase-nav tests untouched).
  - `npx tsc --noEmit` — passes; new types resolve; consumers can import `TrustLevel` + `TrustChip` without ambient errors.
  - `npm run lint` — 0 errors (pre-existing warnings allowed).
  - `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` — passes; placeholder landing builds with new component.
  - Preview deploy: placeholder landing renders all 6 chips in a demo block; dev-tools computed-style spot-check on amber + green chips resolves to the new trust tokens.
- **In scope:** unit tests for `levels.ts`; component-render smoke tests using whatever testing-library is in `package.json` devDependencies (matches S-F3 pattern); parity test reading 68f at test time. S-F1 token-parity test updated to reflect 4 new trust tokens (count constant bump + new entries in expected token list).
- **Out of scope:** Playwright integration tests (no full user flow yet); full a11y audit (covered when consumer slices wire chip into real surfaces); cross-browser computed-style verification (preview-deploy spot-check sufficient).
- **Opens blocked:** none.
- **Loveable check:** N/A — tests are infra.
- **Evidence at wrap:** vitest output; tsc/lint/build clean exit codes; preview-deploy URL + screenshot of demo block on placeholder landing.

## AC-5 · Slice documentation complete

- **Outcome:** All four DoD documents in `docs/slices/S-F4-trust-chip/` populated with slice-specific content (not template placeholders): `acceptance.md` (this file, frozen), `test-plan.md`, `security.md`, `verification.md`. 68g C-T1 register entry added with annotation: pattern + 2 of 6 visual treatments LOCKED by this slice; 4 OPEN visual treatments (credit-verified / document-evidenced / both-party-agreed / court-sealed) remain pending Phase C anchor extraction.
- **Verification:** `grep -L '{S-XX' docs/slices/S-F4-trust-chip/*.md | wc -l` returns 4 (no template placeholders). `verification.md` records all six DoD items completed. 13-item security checklist exercised in `security.md` — most items N/A for a foundation-component slice (no API routes, no T3+ data, no third-party flows); each N/A carries explicit reasoning per spec 72 §11 exemption pattern.
- **In scope:** All four slice docs populated; 68g C-T1 register annotation added.
- **Out of scope:** updating downstream slice docs (their authors do that); session HANDOFF retro (separate end-of-session step).
- **Opens blocked:** none.
- **Loveable check:** A future engineer reading the slice can understand what shipped, why, and what was deferred — including which visual treatments are LOCKED vs which await anchor extraction. Yes — delight for the reader.
- **Evidence at wrap:** all four slice docs present + populated; 68g C-T1 annotation visible in diff hunk.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-05-02 | User (informal) | Pre-AC scope locked | Scope: (1a) extend placeholder landing for visual smoke · (2i) single PR all 5 ACs · (3i) single `<TrustChip>` component (no per-level subcomponents) · (4i) neutral grey placeholder for 4 OPEN levels · (5i) 68g C-T1 stays 🟠 with annotation (pattern + 2 of 6 levels LOCKED). |
| 2026-05-02 | User | **AC frozen** | Implementation may begin. Change requests roll into re-drafted AC + re-slicing, not mid-slice scope shifts. |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
