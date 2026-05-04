# S-F2 · Document shell — Acceptance criteria

**Slice:** S-F2-document-shell
**Spec ref:** `docs/workspace-spec/71-rebuild-strategy.md` L84 (folder + "three-column shell" verbatim) · L379 ("The shape every document renders into") · L385 (Phase C.1 exit criterion) · `docs/workspace-spec/68b-decisions-build.md` L9-L32 (B-D1..D7 LOCKED — document-not-dashboard + three-column slot definitions) · L82-L91 (B-T1 dashboard separation + B-T3 right-rail filter) · `docs/workspace-spec/68d-decisions-settle.md` L9-L25 (S-D1..D4 LOCKED — same shell across documents + state machine + autosave) · `docs/workspace-spec/68g-visual-anchors.md` (no C-V tag for document-shell — structural anchor not visual; spec 68b/d are authoritative)
**Phase(s):** Foundation (Phase C.1, order #4) — three documents render through this shell (Sarah's Picture · Our Household Picture · Settlement Proposal)
**Status:** Approved · In implementation

---

## Context

S-F2 is the **document shell foundation** — the three-column layout primitive every document in the workspace renders into. Sarah's Picture (Build), Our Household Picture (Reconcile), and Settlement Proposal (Settle) all share one shell shape per spec 68b B-D1 LOCKED + spec 68d S-D1 LOCKED. This slice ships the shell + slot interface only; concrete document content (sections, snapshot data, real to-dos) ships in subsequent document slices (S-B2 onwards). Visual smoke verifies on the placeholder landing page (`src/app/page.tsx`) extending the existing S-F3/S-F4 demo grid — same option-1a pattern S-F3 used.

## Dependencies

- **Upstream slices:** S-F1 design-tokens (provides spacing · typography · shadow · color tokens for shell chrome). S-F3 phase-nav (PhaseStepper sits above shell as page chrome per spec 68b B-T1 separation; demo wiring imports `<PhaseStepper>`). S-F4 trust-chip (used inside body sections in demo wiring).
- **Specs implemented (LOCKED in 68b/d, materialised by this slice):**
  - 68b **B-D1** — Three-column layout + legal-document styling.
  - 68b **B-D2** — Left rail = chapter TOC + completion icons + "In this document" + title + % completion.
  - 68b **B-D3** — Middle = §-numbered sections, prose with inline data, section sub-titles, line-item icon-plus-amount.
  - 68b **B-D4** — Right rail = triple stack (Snapshot · Data sources · Needs your attention).
  - 68b **B-T1** — Dashboard sits ABOVE Sarah's Picture, separate view; phase nav is page chrome, not shell concern.
  - 68b **B-T3** — Right-rail "Needs your attention" is filtered view of global to-do, current-document scope.
  - 68d **S-D1** — Same three-column shell across all 3 documents.
  - 68d **S-D2** — Document title + state chip slot in top bar.
  - 68d **S-D4** — Autosave + last-saved stamp in top bar.
- **Open decisions referenced but NOT resolved here:**
  - Mobile breakpoint behaviour — not specced; AC-2 proposes pattern, locks for downstream consumers.
  - 68g visual-anchor register has no C-V tag for document-shell; structural primitives are tracked by spec 68b/d, not 68g (which is visual-anchor extraction). No 68g flip required.
- **Re-use / Preserve-with-reskin paths touched:**
  - `src/app/page.tsx` — extended to demo S-F2 (same option-1a pattern as S-F3).
  - New: `src/components/document-shell/{DocumentShell.tsx, types.ts, index.ts}`.
- **Discarded paths deleted at DoD:** none.

## MLP framing

The loveable floor is **one component, four named slots, three responsive layouts, full a11y**. Cuts happen by deferring stub-content sub-components (TocRail, ContextRail) — the shell takes raw `ReactNode` slots; document slices construct rail content. Concrete document content (Sarah's Picture sections, real Snapshot data, real to-dos) ships per-document downstream. Top-bar state machine (S-D2 5 states) ships as a typed prop here; rendering chrome only — state transitions are downstream responsibility. Children of the rails are the host's concern; the shell is a layout primitive, not a content authority.

---

## AC-1 · `<DocumentShell>` three-column structural layout + 4 named slots

- **Outcome:** Component at `src/components/document-shell/DocumentShell.tsx`. Renders a top-bar slot above a CSS-grid three-column body. Desktop column template: left rail ~240px · body 1fr · right rail ~280px. Top bar slot per spec 68d S-D2 + S-D4: `title: string`, `state: DocumentState` (`'draft' | 'ready-to-send' | 'counter-received' | 'in-progress' | 'agreed'`), `autosaveStamp?: string`. Body slot is required; left rail / right rail slots optional (a document can render without them — Settlement Progress board may not need a TOC). Slot interface uses flat React props (`header`, `leftRail`, `body`, `rightRail`) typed `ReactNode`. No content opinion at this layer — slot consumers own content shape.
- **Verification:** `import { DocumentShell } from '@/components/document-shell'` resolves; `<DocumentShell title="..." state="draft" body={...} />` renders top-bar + body in DOM order; all 4 slot props populate correct grid cells; TypeScript compiles (`npx tsc --noEmit` clean) with `DocumentShellProps` exported from `types.ts`. Component-render smoke test asserts: top bar contains title + state chip + autosave stamp when present; left rail cell contains supplied node; body cell contains supplied node; right rail cell contains supplied node.
- **In scope:** Three files. `DocumentShell.tsx` (~80-120 lines TSX — layout grid + top-bar markup + slot composition + className composition). `types.ts` (~25 lines — `DocumentShellProps`, `DocumentState`, `STATE_LABELS` const-mapping). `index.ts` (~5 lines — barrel exports). Token consumption via Tailwind arbitrary-value syntax against existing S-F1 `--ds-*` tokens (per S-F1 AC-1 amendment).
- **Out of scope:** Sub-component primitives (`<TocRail>`, `<ContextRail>`) — host slices construct rail content; shell does not pre-shape it. State-machine transitions (which state follows which) — owned by document-specific slices. Top-bar action buttons (e.g. Share, Export) — these live in document chrome, not shell. Section-renderer primitives (§-numbered headings, line-item icon-plus-amount per B-D3) — that's the next layer down, lives with document body content.
- **Opens blocked:** none — 68b B-D1..D4 + 68d S-D1..D2/D4 already 🟢 LOCKED; this AC implements them.
- **Loveable check:** A document author writes `<DocumentShell title="Sarah's Picture" state="draft" autosaveStamp="Autosaved · 2 min ago" leftRail={<MyToc />} body={<MySections />} rightRail={<MyContextStack />} />` and the layout is correct without fiddling with grid CSS. Yes — delight, document authors compose, shell handles layout.
- **Evidence at wrap:** `git diff src/components/document-shell/`; vitest output for component-render smoke tests; `npx tsc --noEmit` clean exit.

## AC-2 · Responsive collapse pattern

- **Outcome:** Three breakpoint behaviours, locked here as the canonical document-shell responsive contract for downstream consumers:
  - **Desktop ≥1024px** — full three-column grid; both rails visible; no toggle buttons rendered.
  - **Tablet 768-1023px** — two-column (body + right rail); left rail collapses behind a top toggle button labelled "Sections" (controls left-rail visibility via `aria-controls` + `aria-expanded`).
  - **Mobile <768px** — single-column body; left rail collapses behind "Sections" top toggle; right rail collapses behind a bottom toggle button labelled "Document context" (controls right-rail visibility).
- Toggle state lives in component-local `useState` (no host concern); rails render as drawers when toggled — left rail slides in from left, right rail slides in from bottom — but only when `prefers-reduced-motion: no-preference` (AC-3 cross-cutting). When a toggle is open, the focus ring lands on the first focusable child of the rail; closing returns focus to the toggle (focus-trap behaviour).
- **Verification:** Component test renders the shell at three viewport widths (375 · 800 · 1280) and asserts: desktop shows both rails inline with no toggle in DOM; tablet shows right rail inline + left toggle button + left rail hidden by default; mobile shows neither rail inline + both toggle buttons + both rails hidden by default. Toggle button props include `aria-expanded` reflecting state and `aria-controls` referencing the rail's `id`. Visual smoke from preview-deploy at the three breakpoints.
- **In scope:** Responsive grid CSS (Tailwind `lg:` / `md:` prefixes against shell column-template). Toggle buttons co-located in `DocumentShell.tsx`. `data-state="open" | "closed"` attributes on rails for CSS targeting. Focus-management on toggle open/close.
- **Out of scope:** Animation easing curves (spec 26 dedicated motion slice; this AC ships discrete `transform` transitions only when motion is allowed, no easing-spec). Persistent rail state across page loads (no localStorage; toggle resets on remount). Swipe gestures for rail open/close (touch-handler concern, deferred to first slice that needs it). Tablet-portrait-vs-landscape distinction (single 768-1023 band).
- **Opens blocked:** Mobile-breakpoint document-shell behaviour — locked here as the canonical pattern; downstream slices follow this contract or invoke a documented exception.
- **Loveable check:** A user on mobile sees the document body without sidebar clutter; taps "Sections" to navigate, taps "Document context" to peek at Snapshot. Reads naturally. Yes — delight, mobile-first feel without losing the desktop layout's depth.
- **Evidence at wrap:** preview-deploy screenshots at 375 · 800 · 1280; vitest output for breakpoint render-test; `aria-expanded` + `aria-controls` attributes verified in DOM snapshot.

## AC-3 · Keyboard navigation + a11y + prefers-reduced-motion

- **Outcome:** Shell is fully keyboard-navigable + screen-reader-friendly + respects motion preference:
  - **Skip-to-content link** as first focusable element — visually hidden until focused, jumps focus to body slot's first focusable child.
  - **Region landmarks** — top bar wrapped in `<header>` (banner role implicit); left rail wrapped in `<nav aria-label="Document sections">` when present; body wrapped in `<main>`; right rail wrapped in `<aside aria-label="Document context">` when present. One `<main>` per page (host owns; shell uses `<main>` only when not nested).
  - **Tab order** — skip-link → header (title focusable only if interactive — typically not; state chip not focusable) → left-rail-toggle (mobile/tablet only) → left rail children (DOM order) → body children (DOM order) → right-rail-toggle (mobile only) → right rail children (DOM order).
  - **Visible focus rings** on all interactive shell chrome (toggles, skip-link). Match S-F1 `--ds-color-focus-ring` token.
  - **`prefers-reduced-motion: reduce`** — no `transform` transitions on rail open/close; rails snap to open/closed state. Implementation via `@media (prefers-reduced-motion: reduce)` CSS rule overriding the transition properties.
- **Verification:** axe-core smoke test (`@axe-core/react` if present, else manual verification noted in `verification.md`) — 0 critical / 0 serious violations on demo page render. Keyboard-only traversal test: `userEvent.tab()` walks through expected focus order; `userEvent.keyboard('{Enter}')` on toggle opens rail and moves focus; `userEvent.keyboard('{Escape}')` closes rail and returns focus to toggle. CSS test (computed-style assertion via `getComputedStyle` in jsdom, OR manual preview-deploy verification): with `prefers-reduced-motion: reduce` simulated via `window.matchMedia` mock, transition-duration on rails resolves to `0s`.
- **In scope:** Skip-link markup. Landmark wrappers in `DocumentShell.tsx`. `aria-label` constants in `types.ts` (or co-located). Focus-management in toggle handlers. `@media (prefers-reduced-motion: reduce)` CSS in component scope (Tailwind `motion-safe:` / `motion-reduce:` modifiers).
- **Out of scope:** Full WCAG 2.2 AA audit (covered when first user-facing slice consumes shell in production context). Screen-reader-specific announcements on rail open/close (`aria-live` regions — out unless feedback shows it's needed). Custom focus-ring styles (uses S-F1 token; design-system-level changes are S-F1 scope). RTL support (deferred — no RTL document content yet).
- **Opens blocked:** none — a11y/motion concerns are derived from spec 72 §11 + spec 72a 6-dim rubric, both already locked.
- **Loveable check:** A keyboard-only user navigates the shell without a mouse, gets to the document body fast via skip-link, opens rails predictably with Enter, closes with Escape. A user with vestibular sensitivity sees rails open/close instantly without motion. Yes — delight, accessibility is a product feature, not a checkbox.
- **Evidence at wrap:** axe-core output (or manual verification log in `verification.md`); userEvent traversal test output; preview-deploy spec 72a 6-dim row for `prefers-reduced-motion` + `keyboard-only` + `screen-reader` populated with evidence.

## AC-4 · Demo page wiring (`src/app/page.tsx` extension)

- **Outcome:** Existing placeholder landing page (the S-F1/S-F3/S-F4 demo grid) extended with a "Document Shell" demo block. The block renders `<PhaseStepper currentPhase="build" phases={demoPhases} />` above a `<DocumentShell>` populated with Sarah's-Picture-shaped stub content:
  - **Header slot:** `title="Sarah's Picture"`, `state="draft"`, `autosaveStamp="Autosaved · 2 min ago"`.
  - **Left rail slot:** Inline JSX rendering 4 mock TOC entries with completion icons (✓ "The children" · ! "The home" · • "Pensions" · ○ "Income"), an "In this document" label, and a stub progress percentage ("25%"). Plain markup — no new component.
  - **Body slot:** One stub §1 section heading "The children — Amelia (8), Jack (5)", two short prose paragraphs with mocked content per spec 68b B-D5 provenance template, and one line-item with `<TrustChip level="bank-evidenced" source="Halifax" />` for spec-shape evidence.
  - **Right rail slot:** Three stacked panel stubs — "Snapshot" box (mock net position / assets / debts / monthly gap), "Data sources" box (mock "Halifax · 1 day ago", "NHS Pensions · Pending"), "Needs your attention" box (mock list of 2 placeholder to-do strings — task-row component is S-F6, not shipped).
- Demo block sits under existing demos; landing page remains the single Phase-C-level visual smoke surface.
- **Verification:** `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` passes; preview deploy URL renders the demo block; spec 72a 6-dim verification table in `verification.md` populated with evidence (golden path · edge cases · prefers-reduced-motion · keyboard-only · mobile viewport 375×667 · screen-reader). Demo content visible at desktop 1280 / tablet 800 / mobile 375 widths matching AC-2 layout contract.
- **In scope:** ~80-120 lines of markup added to `src/app/page.tsx` (under existing demos). Stub content inline (no fixture files — content is throwaway, lives at the demo site). Imports: `DocumentShell` (new), `PhaseStepper` (S-F3), `TrustChip` (S-F4).
- **Out of scope:** Real Sarah's Picture content (lives in S-B2). Real Snapshot / Data sources / Needs-your-attention components (lives in S-B-block slices). Task-row in right-rail (S-F6). Phase-route /app/build/sarahs-picture (lives in S-O1 + S-B2). Replacing the landing page (post-MLP / S-M1 marketing slice — separate Phase C.2 work).
- **Opens blocked:** none.
- **Loveable check:** A reviewer opens the preview-deploy URL and sees the document shell rendered with concrete-feeling stub content — three columns at desktop, drawers at mobile, document title + state + autosave stamp visible, TrustChip in the body proving foundation primitives integrate. The shape of every future document is now visible. Yes — delight, "this is what Decouple looks like."
- **Evidence at wrap:** preview-deploy URL; screenshots at 1280 · 800 · 375; spec 72a §"Preview-deploy verification" table populated in `verification.md`.

## AC-5 · Tests pass + lint/build clean

- **Outcome:** All four gates pass on the slice branch:
  - `npx vitest run` — new component tests pass; pre-existing tests (S-F1 token-parity, S-F3 phase-nav state, S-F4 trust-chip render, S-F7-α alpha-contracts, S-F7-β fixtures) remain GREEN.
  - `npx tsc --noEmit` — no errors; `DocumentShellProps` + `DocumentState` resolve at every consumer.
  - `npm run lint` — 0 errors; pre-existing warnings allowed.
  - `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` — passes; demo block builds into the prod-mode landing.
- **Verification:** Test categories executed: (a) component-render smoke for `<DocumentShell>` rendering all 4 slots in DOM order with title + state + autosave stamp visible in top bar; (b) responsive contract test at three viewports asserting AC-2 column-template + toggle-button visibility; (c) keyboard-traversal test asserting AC-3 tab order + skip-link + Enter/Escape on toggle; (d) prefers-reduced-motion test mocking `matchMedia` and asserting transitions resolve to `0s` (jsdom-feasible OR documented-as-manual in `verification.md`). Each test file lives co-located: `src/components/document-shell/DocumentShell.test.tsx`.
- **In scope:** Component-render smoke tests using whichever testing-library is already in `package.json` devDependencies (verified during impl — S-F3/S-F4 used `@testing-library/react`, mirror that). `userEvent` for kb traversal. `vi.mock` for `matchMedia` (or jsdom polyfill if present).
- **Out of scope:** Playwright integration tests (no full user flow yet). Visual regression snapshots (preview-deploy spot-check sufficient at foundation-component scale; spec 72a 6-dim covers it). Full a11y audit beyond axe-core smoke (covered when first user-facing slice consumes shell). Cross-browser test matrix (Chrome via preview-deploy is sufficient at this stage).
- **Opens blocked:** none.
- **Loveable check:** N/A — tests are infra, not user-facing.
- **Evidence at wrap:** vitest output; tsc/lint/build clean exit codes; preview-deploy URL + spec 72a 6-dim table populated.

## AC-6 · Slice documentation complete

- **Outcome:** All four DoD documents in `docs/slices/S-F2-document-shell/` populated with slice-specific content (no template placeholders): `acceptance.md` (this file, frozen), `test-plan.md`, `security.md`, `verification.md`. Spec 68b/d 🟢 LOCKED entries (B-D1..D4 + B-T1 + B-T3 + S-D1 + S-D2 + S-D4) carry citation as *implemented* by this slice in `verification.md`. No 68g register flip — document-shell has no C-V tag (structural primitive, not a visual anchor); spec 68b/d are authoritative.
- **Verification:** `grep -L '{S-XX' docs/slices/S-F2-document-shell/*.md | wc -l` returns 4 (no template placeholders). `verification.md` records all six DoD items completed with evidence. 13-item security checklist exercised in `security.md` — most items N/A for a foundation-layout slice (no API routes, no T3+ data, no third-party flows); each N/A carries explicit reasoning per spec 72 §11 exemption pattern. Spec 72a §"Preview-deploy verification" 6-dim row table populated in `verification.md`.
- **In scope:** All four slice docs populated.
- **Out of scope:** updating downstream slice docs (their authors do that when they consume shell); HANDOFF-64 retro (separate end-of-session step); CLAUDE.md updates (no new rules; this slice is straight implementation against locked spec).
- **Opens blocked:** none.
- **Loveable check:** A future engineer reading the slice can understand what shipped, why, and what was deferred — including which 68b/d LOCKED entries this slice *implements* vs merely cites. Yes — delight for the reader.
- **Evidence at wrap:** all four slice docs present + populated; PR body references `docs/slices/S-F2-document-shell/verification.md` per `pr-dod.yml` gate.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-05-04 | User (informal) | Pre-AC scope confirmed | P1 = S-F2; cohesive-product pivot. Drift surfaced: kickoff "components/(authed)/document-shell/" path wrong (route group not components folder; spec 71 L84 puts it under `components/anchors/` but shipped S-F3/S-F4 use concern folders → continue concern convention → `components/document-shell/`). Kickoff "dashboard scaffold" framing wrong (spec 68b B-D1 LOCKED: *"Sarah's Picture renders as a document, not a dashboard"*); shell hosts documents, dashboard sits above per B-T1. |
| 2026-05-04 | User | **AC frozen** | Implementation begins. Change requests roll into re-drafted AC + re-slicing, not mid-slice scope shifts. |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
