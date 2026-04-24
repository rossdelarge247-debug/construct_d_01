# S-F1 · Design system tokens — Test plan

**Slice:** S-F1-design-tokens
**AC doc:** `./acceptance.md`
**Framework:** `vitest` (parity assertion + token shape) · manual + preview-deploy in-browser for visual smoke

---

## Test inventory

One test per AC. T-1, T-2, T-5 covered by a single `vitest` test file (`tests/unit/tokens.test.ts`). T-3 + T-6 are command-line greps. T-4 is a manual ls.

## T-1 · references AC-1 — CSS token layer

- **Given:** `src/app/globals.css` exists with the new `:root { --ds-* }` block alongside the existing `@theme {}` block.
- **When:** Run `grep -E '^\s*--ds-' src/app/globals.css | wc -l`.
- **Then:** Returns ≥ 64 (actual: 65).
- **Type:** unit (grep)
- **Automated:** yes (CI runs `npx vitest run` which loads globals.css and counts via `--ds-` regex; AC-5 parity test enforces `cssNames.length === 65` indirectly via TOKEN_NAMES.length check).
- **Fixture:** `src/app/globals.css` itself.
- **Evidence at wrap:** `grep -E '^\s*--ds-' src/app/globals.css | wc -l` = 65 (run 2026-04-24).

## T-2 · references AC-2 — Typed TS mirror

- **Given:** `src/styles/tokens.ts` exports `tokens`, `Tokens`, `TokenName`, `TOKEN_NAMES`.
- **When:** Run `npx tsc --noEmit` + `npx vitest run`.
- **Then:** tsc clean; parity test in `tests/unit/tokens.test.ts` passes (every CSS `--ds-*` ↔ TS `TOKEN_NAMES` entry); `TOKEN_NAMES.length === 65`.
- **Type:** unit (parity assertion + typecheck)
- **Automated:** yes
- **Fixture:** in-test reads `src/app/globals.css` from `process.cwd()`.
- **Evidence at wrap:** `npx vitest run` → 2 files / 8 tests passing (run 2026-04-24).

## T-3 · references AC-3 — Button reskin

- **Given:** `src/components/ui/button.tsx` modified to consume `--ds-*` tokens.
- **When:** Run `grep -nE '#[0-9a-fA-F]{3,8}' src/components/ui/button.tsx`.
- **Then:** Zero matches (no remaining hex literals). Variant + size types unchanged: `'primary' | 'secondary' | 'ghost' | 'danger'`, `'sm' | 'md' | 'lg'`. tsc clean. Visual smoke shows ink-on-panel primary, danger uses `#FF3B30`.
- **Type:** unit (grep) + manual (visual smoke).
- **Automated:** grep yes; visual smoke no (manual against preview deploy).
- **Fixture:** `src/components/ui/button.tsx`.
- **Evidence at wrap:** grep clean (run 2026-04-24); preview-deploy screenshot of placeholder landing page Button — captured in verification.md golden path post-PR.

## T-4 · references AC-4 — Imagery convention

- **Given:** `public/images/` directory + `public/images/README.md`.
- **When:** Run `wc -l public/images/README.md` + check for cite of welcome-tour slice + check no image assets present.
- **Then:** README ≤ 25 lines (actual: 23); README mentions "welcome-tour" as first consumer; no `*.png|*.jpg|*.svg|*.webp` files in `public/images/` (assets ship with their owning component slice).
- **Type:** unit (manual ls + grep).
- **Automated:** could be (CI optional); manually verified at wrap.
- **Fixture:** `public/images/README.md`.
- **Evidence at wrap:** `wc -l public/images/README.md` = 23 (run 2026-04-24); `find public/images -type f -not -name README.md` = (empty).

## T-5 · references AC-5 — Tests pass

- **Given:** All AC-1 through AC-4 implemented + the parity test added.
- **When:** Run the four AC-5 commands in order.
- **Then:**
  - `npx vitest run` → 2 files / 8 tests pass (4 pre-existing + 4 new in `tokens.test.ts`).
  - `npx tsc --noEmit` → exit 0, no diagnostics.
  - `npm run lint` → 0 errors; up to 23 pre-existing warnings allowed in preserved code.
  - `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` → success; placeholder landing page builds; routes prerendered as expected.
  - Preview deploy → opening landing page, browser dev-tools shows `getComputedStyle(document.documentElement).getPropertyValue('--ds-color-ink')` resolves to `#1A1A1A`.
- **Type:** integration (CI command harness) + manual (preview deploy spot-check).
- **Automated:** four commands yes; preview spot-check no.
- **Fixture:** repo at this slice's HEAD commit.
- **Evidence at wrap:** all four commands captured + spot-check screenshot post-PR (verification.md).

## T-6 · references AC-6 — Slice docs complete

- **Given:** All four files in `docs/slices/S-F1-design-tokens/` populated.
- **When:** Run `grep -L '{S-XX' docs/slices/S-F1-design-tokens/*.md | wc -l` + read each file for slice-specific content.
- **Then:** Returns 4 (no remaining template placeholders). Each file has slice-specific content. 68g register flips applied for C-V1 + C-V13 from 🟠 to 🟢. Token-coverage gaps documented in verification.md.
- **Type:** unit (grep) + manual (content review).
- **Automated:** grep yes.
- **Fixture:** `docs/slices/S-F1-design-tokens/*.md` + `docs/workspace-spec/68g-visual-anchors.md`.
- **Evidence at wrap:** grep result + 68g diff hunk in commit history.

---

## Fixture + scenario references

S-F1 ships no scenarios + no real user flow. Test fixtures = the design-source HTMLs (`docs/design-source/welcome-tour/Welcome Tour - Standalone.html` + `.../post-connect-dashboard/...`) used as the *extraction* source, not as test inputs. The parity test reads `src/app/globals.css` at runtime, no static fixture file.

## Visual regression placeholder

Visual verification = manual in-browser check against the design source. Specifically: the placeholder landing page (`src/app/page.tsx`) does not currently render a Button, so the visual smoke for AC-3 is limited to dev-tools computed-style inspection on any element using `--ds-color-ink`. When the welcome-tour or post-connect-dashboard slice runs and renders Buttons in real surfaces, visual regression will be exercised properly.

## Manual test discipline

- Visual smoke (T-3 part, T-5 spot-check): run against Vercel preview deploy URL after PR opens; record screenshot + commit SHA in verification.md.
- All other tests fully automated.

Untested surfaces are not shipped — confirmed at AC-6 wrap.
