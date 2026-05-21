# S-PROTO-post-connect-dashboard-canvas-port

**Category:** prototype

## Intent

Port the post-connect dashboard canvas at `docs/design-source/post-connect-dashboard/decoded/Post-connect Dashboard - Standalone.html` (L1186–1727) to a Next.js prototype route at `src/app/dev/proto/post-connect-dashboard/`. Canvas-as-source pattern per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)". Desktop viewport only (canvas has no responsive breakpoints other than the `prefers-reduced-motion` carry-over from prior slices is absent here too); mobile reconciliation deferred per spec text *"Canvases ship for specific viewports; intermediate breakpoints are not wired in the canvases themselves. Reconcile at preview-deploy feedback time, not at build time."*

Source canvas authors a signed-in app shell with two visual variants (Conservative + Expressive). Variants are shipped side-by-side via `?variant=conservative|expressive` query routing; default is `conservative`. The dashboard's components share a single layout — variants are gated via an `isExpressive = variant === "expressive"` boolean threaded through each component's props, exactly as the canvas authors them.

The shared signed-in chrome (`SignedInHeader` at `src/components/layout/signed-in-header.tsx`) is consumed here as a real client — this slice validates its design against a complete page consumer.

Out of scope:
- Welcome-tour shell's bespoke TopBar refactor to use `SignedInHeader` — tour stays untouched (its TopBar is bespoke; reuse decision deferred).
- Real data wiring — all copy + state is canvas-literal; no auth, no bank API call, no task-status persistence.
- Mobile responsive breakpoint work (deferred per canvas-as-source pattern).
- A11y deep-pass (deferred to system-wide Phase 2/3 a11y pass; this slice ships canvas-as-is + the minimum-viable a11y already in the canvas — `aria-label`, `aria-expanded` on the expand button).
- Variant switcher UI in-page — variants surface via query param only; toggling in preview is URL-driven.

Linked canvas: not declared (canvas-as-source pattern — canvas-fidelity gate stays dormant per CLAUDE.md §"Hard controls").

## Acceptance criteria

### Route + variant routing

**AC-1.** Route `/dev/proto/post-connect-dashboard` resolves to a literal-slug subroute (not the `[slug]` stub). `page.tsx` exists with `'use client'` directive. Variant routing: `?variant=conservative` (default — also when no query) renders the Conservative configuration; `?variant=expressive` renders the Expressive configuration; any other value falls back to `conservative`. *Evidence:* in-browser load of both URL variants at `/dev/proto/post-connect-dashboard` and `?variant=expressive` matches canvas L1735–1738 (DCArtboard wrappers around `<Dashboard variant="conservative"/>` and `<Dashboard variant="expressive"/>`).

### Tokenisation (CLAUDE.md §"Canvas-as-source" Step 1)

**AC-2.** Canvas-top tokens at canvas L1186–1192 mapped against `src/styles/tokens.ts`:

| Canvas constant | Hex | `tokens.color` ref |
|---|---|---|
| `INK` | `#1A1A1A` | `color.ink` |
| `SUB` | `#57534E` | `color.text.sub` |
| `MUTE` | `#78716C` | `color.text.muted` |
| `LINE` | `#E5E3DC` | `color.border` |
| `CANVAS` | `#FAFAF7` | `color.surface.canvas` |
| `BG` | `#F5F5F4` | `color.surface.page` |

All six canonical canvas constants map cleanly to existing S-F1 tokens; no inlined-literal exceptions for canonical colours (contrast with marketing-landing's SOFT/WARM/etc which had no token map).

Per-category palette `CATS` (canvas L1195–1200) — task-chip colours for `legal` / `evidence` / `practical` / `inDecouple` (each `{ label, fg, bg }`) — stays inline as a canvas-local const. These are task-taxonomy colours specific to the dashboard's task-chip use; not promoting to tokens.ts unless a second slice surfaces a use.

Expressive-variant colours — `#F5F1EB` (page bg), `#4338CA` (Build phase ink), `#9D174D` (Reconcile phase ink), `#F3EEFE` (Build phase soft), `#FCE7F3` (Reconcile phase soft), `#7C3AED` (special task bg), `#0369A1` (Settle), `#166534` (Finalise), `#EEF2FF`/`#E0F2FE`/`#DCFCE7` (phase softs) — stay inline as canvas-local one-offs (variant-only; not promoting to tokens.ts unless a second slice surfaces a use, per marketing-landing precedent for SOFT/WARM).

Phase tints declared inline at the top of the page as `const PHASE = { build, reconcile, settle, finalise }` (the page declares colours per phase but does not depend on the workspace's `PHASE` object — kept inline). *Evidence:* no literal hex matches for the 4 canonical canvas constants in the screen file; variant-only literals retained inline.

### SignedInHeader integration

**AC-3.** Top of page renders `SignedInHeader` from `@/components/layout/signed-in-header` with `mode="app"`. Consumes the shared chrome at its default configuration (Wordmark + page-label + Help/Bell/Settings + avatar+name+status on desktop; collapses to Wordmark + avatar + hamburger button below 640px). Canvas's local `TopBar` (canvas L1232–1257) is NOT ported — `SignedInHeader` replaces it. *Evidence:* visual at `/dev/proto/post-connect-dashboard` renders `SignedInHeader` chrome above the dashboard body.

### Component ports (canvas L1186–1727)

**AC-4.** `JourneyRail` (canvas L1259–1325) renders as a left-side nav fixed to the dashboard layout, listing the 5-phase journey items per the `JOURNEY` const declared at canvas L1259. Each item shows a step number + label + state (current/locked/etc). *Evidence:* visual matches canvas at both variants.

**AC-5.** `PhaseStrip` (canvas L1327–1370) renders a horizontal 5-phase strip across the top of the dashboard body. Locked phases dimmed per canvas treatment. Receives `variant` prop. *Evidence:* visual matches canvas at both variants.

**AC-6.** `ConnectedBanner` (canvas L1371–1454) renders a bank-connected banner with expandable detail. Receives `variant`, `expanded`, `onToggle` props. Click on the toggle button switches `expanded` state via parent-managed `useState`; expanded view reveals additional content. Toggle button has `aria-expanded` reflecting state. Canvas authors the expressive variant with a `#F5F1EB` background and `#4338CA` accent on the indicator dot; conservative uses `#FFF` + `INK` respectively. *Evidence:* visual matches canvas; smoke test asserts state toggle (AC-12).

**AC-7.** `DisclosureCard` (canvas L1455–1485) renders the "Your private area" disclosure-preview card with three rows (canvas's "Pages built", "Disclosure", "Reconcile") and a progress indicator. Receives `variant`. Expressive variant uses `#9D174D` for accents; conservative uses `MUTE` + `INK`. *Evidence:* visual matches canvas at both variants.

**AC-8.** `PrepTasksCard` (canvas L1531–1552) renders the "Get these 3 done ASAP" preparation-tasks card. Uses the `PREP_TASKS` const (canvas L1521–1530) and the `TaskRow` primitive (canvas L1486–1520) to render each task. Receives `variant`. Special-task styling: expressive `#7C3AED` bg; conservative `INK` bg. Last row gets `last: true` flag (no bottom border). *Evidence:* visual matches canvas at both variants.

**AC-9.** Two `LockedSection` instances (canvas L1554–1614, used in Dashboard at canvas L1670 + L1694) render below the prep card. Each is parametric: `title`, `variant`, `phaseColor`, `subtitle`, `primary`, `tasks`, `unlockReason`. Primary kicker uses `phaseColor` when expressive, `MUTE` when conservative. Card 1: Disclosure & Reconcile (Reconcile phase). Card 2: Settle & Finalise (Settle phase). Both rendered locked (no interactive task rows). *Evidence:* visual matches canvas at both variants.

**AC-10.** `Dashboard` wrapper (canvas L1619–1727) composes the layout: page bg (conservative `#FFF`; expressive `#F5F1EB` per canvas L1623), `SignedInHeader`, `JourneyRail` + main content column, `PhaseStrip`, `ConnectedBanner` (with local `useState` for `expanded`), `DisclosureCard`, `PrepTasksCard`, two `LockedSection`s. Default `variant="conservative"`. *Evidence:* visual matches canvas at both variants on the full route.

### Variant gate (CLAUDE.md §"Canvas-as-source" Step 3)

**AC-11.** Variant is propagated from the route's `searchParams` to the `Dashboard` component via prop. Each component independently derives `const isExpressive = variant === "expressive"` (matches canvas pattern — variant flows down, no central switcher). Variant-conditioned style values stay inline (no token reshape required for prototype). *Evidence:* both `?variant=conservative` and `?variant=expressive` URLs visibly differ in the page background + accent colours.

### Tests

**AC-12.** Unit test for the smoke surfaces:
- Variant fallback: invalid `?variant=foo` renders Conservative (`Dashboard` default).
- `ConnectedBanner` toggle: initial `expanded=false`, click toggle button → `expanded=true`, click again → `expanded=false`. `aria-expanded` reflects state.

No tests for static section render (per CLAUDE.md §"Engineering conventions" §"Don't write file-content assertions for logic slices" — canvas-as-source ports are visual transcription, covered by preview-deploy).

## Plan-vs-spec cross-check

CLAUDE.md §"Visual direction" §"Canvas-as-source" 5-step:

1. **Tokenise hardcoded colours** — AC-2.
2. **Replace placeholder data** — N/A; canvas literals (task labels, copy, phase labels) ARE the prototype's display data; user iterates post-deploy.
3. **Wire state** — AC-11 (variant prop) + AC-6 (ConnectedBanner local `useState` for expand).
4. **Add Next.js wrapping** — AC-1 (`'use client'` + `page.tsx` + `searchParams` reading).
5. **Inline canvas-local helpers OR adapt** — JourneyRail/PhaseStrip/ConnectedBanner/DisclosureCard/TaskRow/PrepTasksCard/LockedSection/Dashboard all inline in the screen file as-canvas; `Wordmark` + `TopBar` NOT inlined (`SignedInHeader` consumed instead per session-113 design decision). `JOURNEY`, `CATS`, `PREP_TASKS` consts inline.

CLAUDE.md §"Slice convention for canvas-as-source": *"`acceptance.md` does NOT carry the `Linked canvas:` field (so canvas-fidelity stays dormant per CLAUDE.md §'Hard controls'). Per-AC evidence cites the source canvas path inline without verbatim quoting requirements. `**Category:** prototype` declared as usual."* — confirmed: no `Linked canvas:` field; line refs only in ACs above; `**Category:** prototype` at top.

## Definition of Done

1. All ACs met; evidence per AC in `verification.md`.
2. Tests written + passing (AC-12 only; rest is visual).
3. Adversarial review done (auto-review via 3 specialists at PR + manual sweep).
4. Preview deploy verified — user-confirmed (agent sandbox blocks Vercel preview URL host with `x-deny-reason: host_not_allowed`); both variants reviewed.
5. No regression in adjacent slices — `/dev/proto/marketing-landing` + `/dev/proto/welcome-tour` smoke walk after port.
6. SignedInHeader's design validated by the dashboard's consumer use; deferrals or follow-ups logged in `verification.md`.

14-item security checklist short-form per CLAUDE.md §"Slice categories" §"prototype": items 1, 8, 12, 14 in `security.md`.

## Status

Drafted session 114. Decoded canvas + SignedInHeader chrome shipped session 113 (commits `a273514` + `c80b070`). Route + components + tests + slice docs + PR target this session.
