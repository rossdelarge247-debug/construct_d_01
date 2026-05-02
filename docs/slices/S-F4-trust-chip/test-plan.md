# S-F4 · Trust taxonomy + trust chip — Test plan

**Slice:** S-F4-trust-chip
**AC doc:** `./acceptance.md`
**Framework:** `vitest` (taxonomy unit + component-render smoke + parity assertion) · manual + preview-deploy in-browser for visual smoke on the placeholder landing demo

---

## Test inventory

One or more tests per AC. Taxonomy + component + parity tests live in `tests/unit/components/trust/`. Manual visual smoke runs against the placeholder landing demo on Vercel preview deploy.

## T-1 · references AC-1 — `<TrustChip>` component renders all 6 levels

- **Given:** `<TrustChip level={level} sourceLabel?={...} />` rendered into a test container, iterated over each of the 6 `TrustLevel` values from `TRUST_LEVELS`.
- **When:** Render via vitest + the available DOM testing library (verified during impl — `@testing-library/react` if in `package.json`, otherwise `react-dom/server.renderToString` for HTML-shape assertions).
- **Then:** Each level renders an inline element (display: inline / inline-flex via class); `aria-label="Trust: {humanised level} — {label}"` present; class list for self-declared contains the amber trust-token class; class list for bank-evidenced contains the green trust-token class; class lists for the four OPEN levels contain neutral utility classes (no trust tokens).
- **Type:** unit (component render)
- **Automated:** yes (vitest)
- **Fixture:** `TRUST_LEVELS` constant + in-test sample source labels.
- **Evidence at wrap:** vitest output for `tests/unit/components/trust/TrustChip.test.tsx`; preview-deploy screenshot of placeholder landing showing all 6 chips.

## T-2 · references AC-2 — Trust taxonomy types + constants

- **Given:** `TrustLevel`, `TRUST_LEVELS`, `DEFAULT_LEVEL`, `humaniseLevel` exported from `src/components/trust/{types,levels}.ts`.
- **When:** Run vitest cases covering: each of 6 `TrustLevel` values type-narrows · `TRUST_LEVELS.length === 6` · ordering matches C-T2 verbatim (`['self-declared', 'bank-evidenced', 'credit-verified', 'document-evidenced', 'both-party-agreed', 'court-sealed']`) · `DEFAULT_LEVEL === 'self-declared'` · `humaniseLevel('credit-verified') === 'Credit-verified'` · function does not mutate inputs (frozen-input pass-through).
- **Then:** All cases pass; `npx tsc --noEmit` clean on the new types.
- **Type:** unit (pure-data + pure-function)
- **Automated:** yes (vitest)
- **Fixture:** none — pure imports.
- **Evidence at wrap:** vitest output for `tests/unit/components/trust/levels.test.ts` (≥6 cases pass).

## T-3 · references AC-3 — Parity vs 68f C-T1 wire evidence

- **Given:** Default labels per level + token mapping per level + 68f C-T1 LOCKED entry at `docs/workspace-spec/68f-open-decisions-register.md` L41-L46.
- **When:** Parity test reads the spec file at runtime + asserts: self-declared default label === `'Estimated'` (per 68f L43 "Amber 'Estimated' chip"); bank-evidenced default label === `'Bank'` when no source supplied (`${sourceLabel}` form when supplied — per 68f L44); the two LOCKED levels carry their dedicated `--ds-color-trust-*` tokens; the four OPEN levels do NOT carry trust tokens (neutral utilities only — pending Phase C anchor extraction per 68f L45).
- **Then:** All assertions pass; spec source unchanged.
- **Type:** unit (component render + file-content parity assertion)
- **Automated:** yes (vitest)
- **Fixture:** spec file at `docs/workspace-spec/68f-open-decisions-register.md` + in-test sample source labels.
- **Evidence at wrap:** vitest output for `tests/unit/components/trust/parity.test.ts`.

## T-4 · references AC-4 — Aggregate test commands pass

- **Given:** All AC-1 through AC-3 implemented + tests added.
- **When:** Run the AC-4 commands in order against the slice branch HEAD.
- **Then:**
  - `npx vitest run` → all tests pass (S-F1 token parity updated for 4 new trust tokens + 3 new S-F4 unit + component test files + S-F3 phase-nav untouched).
  - `npx tsc --noEmit` → exit 0, no diagnostics.
  - `npm run lint` → 0 errors; pre-existing warnings allowed.
  - `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` → success; placeholder landing builds with new component.
  - Preview deploy: opening landing page, `getComputedStyle(document.querySelector('[data-trust-chip-level="self-declared"]')).getPropertyValue('background-color')` resolves to the trust-token value (`var(--ds-color-trust-self-declared-soft)`).
- **Type:** integration (CI command harness) + manual (preview deploy spot-check)
- **Automated:** four commands yes; preview spot-check no.
- **Fixture:** repo at slice HEAD commit.
- **Evidence at wrap:** all four commands captured in `verification.md` + spot-check screenshot.

## T-5 · references AC-5 — Slice docs complete

- **Given:** All four files in `docs/slices/S-F4-trust-chip/` populated.
- **When:** Run `grep -L '{S-XX' docs/slices/S-F4-trust-chip/*.md | wc -l` + read each file for slice-specific content.
- **Then:** Returns 4 (no template placeholders left). Each file has S-F4-specific content. 68g C-T1 register annotation added: pattern + 2 of 6 visual treatments LOCKED by this slice; 4 OPEN treatments remain pending Phase C anchor extraction. `verification.md` records all six DoD items completed + final-state evidence per AC.
- **Type:** unit (grep) + manual (content review)
- **Automated:** grep yes
- **Fixture:** `docs/slices/S-F4-trust-chip/*.md` + `docs/workspace-spec/68g-visual-anchors.md`
- **Evidence at wrap:** grep result + 68g diff hunk in commit history.

---

## Fixture + scenario references

S-F4 ships no scenarios + no real user flow. Test fixtures = `TRUST_LEVELS` constant + in-test sample source labels. The parity test reads `docs/workspace-spec/68f-open-decisions-register.md` at runtime; no static fixture file.

## Visual regression placeholder

Visual verification = manual in-browser check against the placeholder landing demo on Vercel preview. The demo block on `src/app/page.tsx` renders all 6 chips (2 styled per wire evidence, 4 neutral placeholders). Computed-style spot-check on amber + green chips resolves to `var(--ds-color-trust-{level})` — evidenced via screenshot in `verification.md` golden path.

## Manual test discipline

- Visual smoke (T-1 + T-4 spot-check): run against Vercel preview deploy URL after PR opens; record screenshot + commit SHA in `verification.md`.
- All other tests fully automated.

Untested surfaces are not shipped — confirmed at AC-5 wrap.
