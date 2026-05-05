# S-M1 · Marketing landing — Test plan

**Slice:** S-M1-marketing
**AC doc:** `./acceptance.md`
**Framework:** `vitest` + `@testing-library/react` (component render + content + landmark + accessibility) · manual + preview-deploy in-browser for visual smoke + spec 72a 6-dim verification.

---

## Test inventory

One or more tests per AC. Component tests live colocated under `src/components/marketing/`. Page tests colocated next to their routes. Manual visual smoke runs against the Vercel preview deploy URL.

## T-1 · references AC-1 — Production landing composition + DOM order

- **Given:** `src/app/page.tsx` rendered into a test container.
- **When:** Render via vitest + `@testing-library/react`.
- **Then:** `<header>`, `<main>` containing `<section data-marketing-section="hero">`, `<section data-marketing-section="picture">`, `<section data-marketing-section="journey">`, and `<footer>` are present in this DOM order. The hero section renders the component exported as `SELECTED_HERO_VARIANT`. No `data-demo-grid` markers from the prior placeholder remain.
- **Type:** unit (DOM structure)
- **Automated:** yes
- **Fixture:** none (renders the real page component)
- **Evidence at wrap:** vitest output + preview-deploy URL screenshot.

## T-2 · references AC-2 — Hero variant exports + per-variant smoke

- **Given:** `import * as HeroesModule from '@/components/marketing/heroes'`.
- **When:** Inspect named exports + render each variant in isolation.
- **Then:**
  - 9 named exports exist: `HeroEditorial`, `HeroDeclarative`, `HeroTypographic`, `HeroProductForward`, `HeroOutcomeLed`, `HeroTwoColumn`, `HeroEmpathetic`, `HeroAtmospheric`, `HeroDiagrammatic`.
  - `SELECTED_HERO_VARIANT` exported with default value `'editorial'`.
  - `HERO_VARIANTS` map exported with 9 entries keyed by kebab-case variant slug; `HERO_VARIANTS[SELECTED_HERO_VARIANT] === HeroEditorial`.
  - Each variant renders without throwing when mounted standalone.
  - Each variant renders its variant-distinguishing signature element (Editorial: central document spine; Declarative: oversize headline with no auxiliary furniture; Atmospheric: ambient orb; etc. — one assertion per variant).
- **Type:** unit (export contract + per-variant render smoke)
- **Automated:** yes
- **Fixture:** none
- **Evidence at wrap:** vitest output for `heroes/index.test.ts` + per-variant test files.

## T-3 · references AC-3 — `/dev/heroes` comparison gallery

- **Given:** `src/app/dev/heroes/page.tsx` rendered into a test container.
- **When:** Render via vitest.
- **Then:** All 9 variant labels present as `<h2>` headings; 9 distinct hero sections render below; the rendered tree is a descendant of an `EnvBanner`-marked layout (the existing dev banner from `src/app/layout.tsx`).
- **Type:** unit (DOM structure)
- **Automated:** yes
- **Fixture:** none
- **Evidence at wrap:** vitest output + preview-deploy URL screenshot of `/dev/heroes`.

## T-4 · references AC-4 — `/start` placeholder route (HTTP 404 native)

- **Given:** `src/app/start/page.tsx` and `src/app/start/not-found.tsx` exist.
- **When:** Two sub-tests:
  - **page.tsx behaviour:** mock `notFound` from `next/navigation`; render `<StartPage />`; assert `notFound` was called exactly once.
  - **not-found.tsx content:** render `<StartNotFound />` directly; assert "Pre-signup interview opens soon" copy is present, brief explainer paragraph is present, "← Back to home" link with `href="/"` is present.
- **Then:** Page triggers Next.js's 404 path; not-found segment renders the placeholder copy. HTTP response status at runtime is 404 (verified at preview deploy, not in jsdom).
- **Type:** unit (mocked `notFound` + DOM content) + manual (preview-deploy 404 status confirmation)
- **Automated:** mock + content assertions yes; HTTP status manual at preview.
- **Fixture:** none
- **Evidence at wrap:** vitest output + preview-deploy `/start` response status capture.

## T-5 · references AC-5 — Required content (positive assertions)

- **Given:** `src/app/page.tsx` rendered into a test container.
- **When:** Inspect `document.body.textContent` + `document.title` (via `<head>` metadata).
- **Then:** Each of the 11 required-content items in AC-5 is present verbatim (case-sensitive substring match against the appropriate scope: `<title>` for the page title, `body.textContent` for everything else).
- **Type:** unit (text content assertions, one per item)
- **Automated:** yes
- **Fixture:** none
- **Evidence at wrap:** vitest output.

## T-6 · references AC-6 — Forbidden framing (negative assertion)

- **Given:** `/`, `/start`, and `/dev/heroes` each rendered into a test container.
- **When:** Inspect `document.body.textContent` per page.
- **Then:** The substring `"financial disclosure tool"` is NOT present (case-insensitive) in any of the three rendered outputs.
- **Type:** unit (negative content assertion ×3)
- **Automated:** yes
- **Fixture:** none
- **Evidence at wrap:** vitest output.

## T-7 · references AC-7 — Landmark + a11y structure

- **Given:** `src/app/page.tsx` rendered into a test container with focusable children.
- **When:** Three sub-tests:
  - **Landmarks:** assert exactly one `<h1>`, one `<header role="banner">`, one `<main>`, one `<footer role="contentinfo">`. Each section has an `aria-labelledby` pointing to its own heading.
  - **Skip-link:** assert first focusable element is the skip-link with `href="#main"`; on `userEvent.tab()` once, focus lands on the skip-link; pressing Enter moves focus to `<main>`.
  - **Focus-visible:** Tab through nav items + CTA + footer links; assert each receives `:focus-visible` outline (verified by computed style or sentinel class — documented if jsdom limitation requires manual check).
- **Then:** All landmark + skip-link assertions pass. Focus-visible coverage logged in `verification.md` if jsdom can't compute `:focus-visible` styles.
- **Type:** unit (component render + userEvent + focus assertions)
- **Automated:** landmarks + skip-link yes; focus-visible may be manual.
- **Fixture:** none
- **Evidence at wrap:** vitest output + spec 72a 6-dim row evidence.

## T-8 · references AC-8 — Visual treatment + token reconciliation

- **Given:** Slice branch HEAD with `layout.tsx` + `globals.css` updated.
- **When:** Two sub-tests:
  - **Font wiring:** assert `next/font/google` `Source_Serif_4` and `JetBrains_Mono` imports are present in `layout.tsx`; assert `--font-serif` and `--font-mono` CSS variables are exposed on the `<html>` element via the font objects' `variable` property.
  - **Marketing CSS class parity:** assert each new utility class (`.serif`, `.mono`, `.tabular`, `.label-xs`, `.kbd`, `.cta-primary`, `.sec-in`, `.sec-in-1..4`, `.skip`, `.placeholder-stripe`, `.hairline`) is present in `globals.css`.
- **Then:** Both sub-tests pass. Visual fidelity (actual rendered fonts, animation timing, hover states) verified at preview deploy and logged in `verification.md`.
- **Type:** unit (file-content assertion for fonts + class presence; bail-out justified per `docs/tdd-exemption-allowlist.txt` `pure-visual-ui` category for the visual-rendering aspect)
- **Automated:** wiring + class presence yes; visual fidelity manual at preview.
- **Fixture:** the source files themselves
- **Evidence at wrap:** vitest output + preview-deploy screenshots.

## T-9 · references AC-9 — Spec 72a 6-dimension preview-deploy verification

- **Given:** PR opened + Vercel preview deploy URL live.
- **When:** Walk all 6 dimensions per spec 72a rubric (golden path · edge cases · `prefers-reduced-motion` · keyboard-only · 375×667 mobile · screen-reader).
- **Then:** Each dimension passes; `verification.md` `## Preview-deploy verification` section populated with one row per dimension (Status + Evidence) at slice wrap.
- **Type:** manual (preview deploy in-browser)
- **Automated:** no (browser-only)
- **Fixture:** preview deploy URL + 375×667 / 1280 viewport widths + browser dev-tools `prefers-reduced-motion` toggle + screen-reader pass (VoiceOver or NVDA)
- **Evidence at wrap:** populated 6-dim table in `verification.md` + screenshots referenced per row.

## T-10 · references AC-10 — Marketing colocation contract

- **Given:** Slice branch HEAD.
- **When:** Inspect file structure under `src/components/marketing/` + run `tests/marketing/colocation.test.ts`.
- **Then:**
  - All atom + hero variant + section components live under `src/components/marketing/{atoms,heroes,sections}/`.
  - No file outside `src/components/marketing/` imports from `marketing/atoms/*` private paths (only via the `marketing` index).
  - `src/components/marketing/index.ts` exports only the public-facing surface (no internal sub-component leakage).
  - 11 inline-SVG icons live in a single `atoms/icons.tsx` module.
  - No new icon library dependency in `package.json`.
- **Type:** unit (file structure + import graph)
- **Automated:** yes
- **Fixture:** repo file tree at HEAD
- **Evidence at wrap:** vitest output + `git diff package.json` empty for icon-library additions.

## T-11 · Aggregate test commands pass

- **Given:** All AC-1 through AC-10 implemented + tests added.
- **When:** Run the canonical command set on the slice branch HEAD.
- **Then:**
  - `npx vitest run` → all tests pass (S-F1 token parity + S-F3 phase-nav + S-F4 trust-chip + S-F7-α/β + S-F2 + new S-M1 component + page tests).
  - `npx tsc --noEmit` → exit 0, no diagnostics.
  - `npm run lint` → 0 errors; pre-existing warnings allowed.
  - `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` → success; landing builds with new components and routes.
  - Preview deploy: opening `/`, all 5 sections visible per AC-1; `/dev/heroes` shows 9 variants per AC-3; `/start` placeholder renders per AC-4.
- **Type:** integration (CI command harness) + manual (preview deploy spot-check)
- **Automated:** four commands yes; preview spot-check no.
- **Fixture:** repo at slice HEAD commit.
- **Evidence at wrap:** all commands captured in `verification.md` + spot-check screenshots.

## T-12 · Slice docs complete

- **Given:** All four files in `docs/slices/S-M1-marketing/` populated.
- **When:** `grep -L '<!--' docs/slices/S-M1-marketing/*.md` and read each file.
- **Then:** Returns 4 (no template placeholder comments remain). `verification.md` records all six DoD items completed + final-state evidence per AC.
- **Type:** unit (grep) + manual (content review)
- **Automated:** grep yes
- **Fixture:** `docs/slices/S-M1-marketing/*.md`
- **Evidence at wrap:** grep result + `verification.md` content review.

---

## Fixture + scenario references

S-M1 ships no scenarios + no real user data flow. Test fixtures = repo source files + in-test JSX (`render(<LandingPage />)` etc.). No scenario file is loaded at test time. Copy verbatim is asserted directly against component output (the marketing landing's copy IS the spec, per the design source authority decision).

## Visual regression placeholder

Visual verification = manual in-browser check against the Vercel preview deploy URL at three viewport widths (375 / 800 / 1280). Spec 72a 6-dim verification table populated with screenshots in `verification.md`. The `ux-polish-reviewer` persona (per v3b S-INFRA-persona-suite-v2-multi-agent AC-3) is spawned during slice-completion against the preview deploy + design source — first formal trigger of this persona since S-M1 is the first src/ slice with substantive UI surface.

## Manual test discipline

- Visual smoke (T-1, T-3, T-4, T-9, T-11 spot-check): run against Vercel preview deploy URL after PR opens; record screenshot + commit SHA in `verification.md`.
- `prefers-reduced-motion` (T-7) and focus-visible (T-7 sub-test) may be manual if jsdom limitations prevent automated assertion; documented in `verification.md` if so.
- 9-variant per-variant render smoke (T-2) is fully automated since each variant is a self-contained component.
- All other tests fully automated.

Untested surfaces are not shipped — confirmed at slice wrap.
