# S-PROTO-help-rail-V4-V5 — Security

**Category:** prototype → DoD-14 short-form: items 1, 8, 12, 14 (per CLAUDE.md §"Slice categories").

## Surface

- `src/app/dev/proto/pre-signup-interview/components/rails/RailHuman.tsx` (new)
- `src/app/dev/proto/pre-signup-interview/components/rails/RailHybrid.tsx` (new)
- `src/app/dev/proto/pre-signup-interview/components/rails/rail-constants.tsx` (additive extensions)
- `src/app/dev/proto/pre-signup-interview/components/HelpRailLayout.tsx` (routing edit; `RailDeferred` helper removal)

## DoD-14 short-form

### Item 1 — Threat model / attack surface

The new rail components are presentational. No user-input flow into rendering, no external content fetching, no `dangerouslySetInnerHTML`. The variant-control surface that gates these components is unchanged by this slice — no edits to `src/lib/dev/variant-context.tsx` or related infrastructure.

V4 (`RailHuman`) renders three buttons styled to look like contact-option rows. The buttons have no `onClick` handlers in this slice — they're visual placeholders for the variant-comparison evaluation. No navigation, no telemetry, no analytics. If a chosen variant graduates to a fuller surface, wiring will arrive in a follow-up slice with its own threat model.

V5 (`RailHybrid`) tab state is component-local React state (`useState`). No persistence, no cross-component leakage, resets on remount.

### Item 8 — Sensitive content rendering

V4 includes safety / harm-reduction content hardcoded as static strings:

- `999` (UK emergency)
- `REFUGE 0808 2000 247` (UK domestic-abuse helpline)
- `Relate` attribution for `Decouple Listen`

These are render-only strings; no template-injection vector. They MUST remain verbatim — the values are sensitive and any future copy change should be reviewed deliberately (a `data-testid="rail-human-safety"` attribute on the safety footer aids both test assertions and future copy-review traceability).

### Item 12 — Logging / data exposure

No logging in either component. No analytics. No telemetry. localStorage access is gated through the `useVariant` hook in `src/lib/dev/variant-context.tsx` (unchanged this slice); no direct `window.localStorage` reads in V4 or V5.

### Item 14 — Third-party / supply-chain

No new dependencies. V4 + V5 use only React + `rail-constants.tsx` (already-shipped local module). SVG icons port the canvas `Ico` set inline; no SVG-library dependency added.

## Disposition

No new attack surface introduced. V4 + V5 inherit the parent slice's variant-control security posture. Short-form DoD-14 cleared.
