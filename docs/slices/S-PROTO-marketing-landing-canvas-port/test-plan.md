# S-PROTO-marketing-landing-canvas-port — test plan

## Scope

This slice is canvas-as-source category=prototype; per CLAUDE.md §"Engineering conventions" §"Don't write file-content assertions for logic slices" — pure visual transcription does NOT get unit tests. The only logic surface is the FAQ accordion state.

Coverage: `vitest.config.ts` `coverage.exclude` matches `src/app/dev/proto/[a-zA-Z0-9_-]*/**` (spec 76 §3 prototype category exclusion). The marketing-landing screen falls under this exclusion; PR-diff coverage gate won't fail on this slice.

## Unit tests

**File:** `tests/unit/proto-marketing-landing/faq-accordion.test.tsx`

Tests the FAQ accordion behaviour declared in AC-11 + asserted in AC-13.

### Test cases

1. **Initial state — all items closed.**
   - Render `MarketingLandingPage`.
   - Query all `<button>` elements with `aria-controls` (FAQ toggles).
   - Assert each has `aria-expanded="false"`.

2. **Click opens item.**
   - Render.
   - Click first FAQ toggle.
   - Assert that toggle's `aria-expanded` becomes `"true"`.
   - Assert the controlled panel is in the DOM (panel `id` matches toggle's `aria-controls`).

3. **Single-open behaviour.**
   - Render.
   - Click first toggle (open it).
   - Click second toggle.
   - Assert first toggle `aria-expanded="false"` (closed).
   - Assert second toggle `aria-expanded="true"` (open).

4. **Click twice closes.**
   - Render.
   - Click first toggle (open).
   - Click same toggle (close).
   - Assert `aria-expanded="false"`.

### Test fixtures

None. Uses Testing Library `render` + `screen.getByRole('button', { name: ... })` + `fireEvent.click`.

## Test-pain audit (per spec 72d §3)

Per spec 72d §3 mock-budget rule: *"If any unit test in a slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."*

The FAQ accordion test requires zero mocks — pure UI state. Pass.

## Visual regression / preview-deploy

DoD item 4 requires preview-deploy verification on UI slices. The agent sandbox blocks Vercel preview URLs (`x-deny-reason: host_not_allowed` from the container's outbound policy); preview-deploy verification ships as user-confirmed for this slice.

Six-dimension rubric (spec 72a) — recorded in `verification.md` after user confirms:

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | deferred-to-user | Landing page renders all 8 sections in canvas order. |
| Edge cases | deferred-to-user | FAQ accordion: multiple opens / rapid clicks / keyboard activation. |
| `prefers-reduced-motion` | passive | Canvas has one `@media (prefers-reduced-motion: reduce)` block — port preserves it. |
| Keyboard-only | deferred-to-user | Tab through nav → CTAs → FAQ toggles → footer. |
| Mobile viewport (375×667) | deferred-to-Phase-2 | Canvas has no responsive breakpoints. Mobile pass is a separate slice per the registry's open question *"Mobile-first vs desktop-first authoring order?"*. |
| Screen-reader | deferred-to-Phase-3-a11y | Out of scope this slice (Phase 3 a11y pass is system-wide). Canvas's existing `aria-labelledby` + `sr-only` + `role="main"` are preserved. |

## Out-of-scope tests

- Static section render assertions (per CLAUDE.md exclusion above).
- Snapshot tests on the full screen (refactor-fragile; CLAUDE.md §"Engineering conventions").
- Visual regression tooling integration (not wired in project; out of scope).
- Mobile responsiveness tests (no mobile viewport in canvas).

## Status

Drafted. Not yet shipped.
