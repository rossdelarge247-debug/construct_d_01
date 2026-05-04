# S-F2 · Document shell — Test plan

**Slice:** S-F2-document-shell
**AC doc:** `./acceptance.md`
**Framework:** `vitest` (component-render smoke + responsive contract + keyboard traversal + reduced-motion assertion) · manual + preview-deploy in-browser for visual smoke at three breakpoints + spec 72a 6-dim verification.

---

## Test inventory

One or more tests per AC. Component tests live co-located at `src/components/document-shell/DocumentShell.test.tsx`. Manual visual smoke runs against the placeholder landing demo on Vercel preview deploy.

## T-1 · references AC-1 — `<DocumentShell>` slot rendering + DOM order

- **Given:** `<DocumentShell title="Sarah's Picture" state="draft" autosaveStamp="Autosaved · 2 min ago" leftRail={<div>TOC</div>} body={<div>BODY</div>} rightRail={<div>CONTEXT</div>} />` rendered into a test container.
- **When:** Render via vitest + `@testing-library/react` (verified during impl — mirrors S-F3/S-F4 pattern).
- **Then:** Top bar contains the title, a state-chip element with text matching `STATE_LABELS.draft`, and the autosave-stamp text. Left-rail cell contains `TOC`, body cell contains `BODY`, right-rail cell contains `CONTEXT`. DOM order: header → leftRail → body → rightRail (i.e. visual order matches DOM order for screen-reader linearization). When `leftRail` / `rightRail` props are omitted, those grid cells are absent from the DOM (or empty) without layout collapse on body.
- **Type:** unit (component render)
- **Automated:** yes (vitest)
- **Fixture:** in-test JSX literals
- **Evidence at wrap:** vitest output for `DocumentShell.test.tsx`; preview-deploy screenshot of demo block on landing page.

## T-2 · references AC-2 — Responsive contract (CSS-driven)

- **Given:** `<DocumentShell ... />` rendered once into a test container.
- **When:** Inspect DOM markup + Tailwind class composition.
- **Then:**
  - Both toggle buttons present in DOM (always rendered).
  - Left toggle carries `lg:hidden` class (CSS-hides at desktop ≥1024px).
  - Right toggle carries `md:hidden` class (CSS-hides at tablet/desktop ≥768px).
  - Each toggle has `aria-expanded="false"` (default closed state) + `aria-controls` referencing the rail's `id`.
  - Each rail has `data-state="closed"` (default).
  - Clicking a toggle flips `aria-expanded` to `"true"` and the rail's `data-state` to `"open"`.
  - CSS responsive verification — visual smoke at preview-deploy at 1280 / 800 / 375 confirms toggles + rails hide/show at the right widths (jsdom doesn't compute media queries).
- **Type:** unit (component render + DOM contract assertion) + manual (preview-deploy CSS verification)
- **Automated:** DOM contract yes (vitest); CSS responsive no (manual preview)
- **Fixture:** in-test JSX literals
- **Evidence at wrap:** vitest output; preview-deploy screenshots at 1280 / 800 / 375.

## T-3 · references AC-3 — Keyboard navigation + a11y + prefers-reduced-motion

- **Given:** Demo-shaped shell rendered with focusable children in left-rail / body / right-rail (e.g. anchor tags or buttons).
- **When:** Three sub-tests:
  - **Tab traversal:** `userEvent.tab()` repeatedly; assert focus order matches AC-3 (skip-link → header (skipped if non-interactive) → left-rail-toggle if present → left rail children → body children → right-rail-toggle if present → right rail children).
  - **Skip-link:** focus on skip-link, press Enter, assert focus moves to first focusable child of body slot.
  - **Reduced-motion:** mock `matchMedia('(prefers-reduced-motion: reduce)')` to return `matches: true`; render shell; assert computed `transition-duration` on rails resolves to `0s` (or document the assertion as manual-verification-only in `verification.md` if jsdom limitation prevents automated check).
- **Then:** Focus order matches AC-3; skip-link works; reduced-motion suppresses transitions.
- **Type:** unit (component render + userEvent + matchMedia mock)
- **Automated:** yes for tab + skip-link; reduced-motion may be manual depending on jsdom feasibility (documented in `verification.md`).
- **Fixture:** in-test JSX with focusable children
- **Evidence at wrap:** vitest output; preview-deploy keyboard-only walk-through screenshot capture; spec 72a 6-dim row evidence.

## T-4 · references AC-4 — Demo page wiring builds + renders

- **Given:** Demo block added to `src/app/page.tsx` per AC-4 spec.
- **When:** Run `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` + open preview-deploy URL.
- **Then:** Build succeeds with the new demo block. Demo block renders the `<PhaseStepper>` above the `<DocumentShell>`. Header slot shows "Sarah's Picture · Draft · Autosaved · 2 min ago"-shaped content. Left-rail stub shows 4 mock TOC entries with completion-icon glyphs. Body stub shows §1 heading + prose paragraph + a `<TrustChip>` on a sample line item. Right-rail stubs show three labelled boxes (Snapshot · Data sources · Needs your attention).
- **Type:** integration (build + preview-deploy)
- **Automated:** build yes; preview spot-check no (manual)
- **Fixture:** repo at slice HEAD commit
- **Evidence at wrap:** build exit code; preview-deploy URL + screenshots at 3 breakpoints captured in `verification.md`.

## T-5 · references AC-5 — Aggregate test commands pass

- **Given:** All AC-1 through AC-4 implemented + tests added.
- **When:** Run the AC-5 commands in order against the slice branch HEAD.
- **Then:**
  - `npx vitest run` → all tests pass (S-F1 token parity + S-F3 phase-nav + S-F4 trust-chip + S-F7-α/β + new S-F2 component test files).
  - `npx tsc --noEmit` → exit 0, no diagnostics.
  - `npm run lint` → 0 errors; pre-existing warnings allowed.
  - `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` → success; landing builds with new demo block.
  - Preview deploy: opening landing, demo block visible; resizing viewport flips layouts per AC-2 contract.
- **Type:** integration (CI command harness) + manual (preview deploy spot-check)
- **Automated:** four commands yes; preview spot-check no.
- **Fixture:** repo at slice HEAD commit.
- **Evidence at wrap:** all four commands captured in `verification.md` + spot-check screenshots.

## T-6 · references AC-6 — Slice docs complete

- **Given:** All four files in `docs/slices/S-F2-document-shell/` populated.
- **When:** Run `grep -L '{S-XX' docs/slices/S-F2-document-shell/*.md | wc -l` + read each file for slice-specific content.
- **Then:** Returns 4 (no template placeholders left). Each file has S-F2-specific content. No 68g register flip required (no C-V tag for document-shell). `verification.md` records all six DoD items completed + final-state evidence per AC.
- **Type:** unit (grep) + manual (content review)
- **Automated:** grep yes
- **Fixture:** `docs/slices/S-F2-document-shell/*.md`
- **Evidence at wrap:** grep result.

---

## Fixture + scenario references

S-F2 ships no scenarios + no real user flow. Test fixtures = in-test JSX literals. No spec file is read at test time — copy comes from `STATE_LABELS` typed constants and is implementation-internal (no parity test required because the spec is structural, not copy-driven).

## Visual regression placeholder

Visual verification = manual in-browser check against the placeholder landing demo on Vercel preview at three viewport widths (375 / 800 / 1280). The demo block on `src/app/page.tsx` renders the shell with stub Sarah's-Picture-shaped content. Spec 72a 6-dim verification table populated with screenshots in `verification.md`.

## Manual test discipline

- Visual smoke (T-1 + T-2 + T-4 + T-5 spot-check): run against Vercel preview deploy URL after PR opens; record screenshot + commit SHA in `verification.md`.
- Reduced-motion verification (T-3) may be manual if jsdom limitations prevent automated assertion; documented in `verification.md` if so.
- All other tests fully automated.

Untested surfaces are not shipped — confirmed at AC-6 wrap.
