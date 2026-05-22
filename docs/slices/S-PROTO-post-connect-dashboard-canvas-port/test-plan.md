# S-PROTO-post-connect-dashboard-canvas-port · Test plan

## Test surfaces

`Category: prototype`. TDD-guard skips for this slice; test-pain audit threshold raises from >2 mocks to >5 mocks. Manual visual review is the primary verification channel for canvas-as-source ports; unit tests cover state-bearing behaviour only.

## Tests authored

### `tests/unit/proto-post-connect-dashboard/dashboard.test.tsx`

Covers AC-12 (variant routing + ConnectedBanner toggle).

**Cases:**

1. **Variant default — no query param.** Render the page with no `?variant` query. Asserts page renders without crash; conservative variant indicators present (e.g. `bg: #FFF` on page wrapper, or `aria-current` JourneyRail item rendered without expressive accents). *Rationale: AC-1 default-to-conservative behaviour.*

2. **Variant explicit — `?variant=expressive`.** Render with `variant="expressive"` prop (URL→prop translation tested at integration; unit test feeds prop directly to avoid `useSearchParams` mocking). Asserts expressive accents present (e.g. expressive page background `#F5F1EB` applied to wrapper). *Rationale: AC-1 explicit-expressive path.*

3. **Variant fallback — invalid value.** Render with `variant="not-a-real-variant"` prop. Asserts conservative variant indicators (matches case 1 output). *Rationale: AC-1 fallback path.*

4. **ConnectedBanner toggle — initial state.** Render `ConnectedBanner` standalone with `variant="conservative"`, `expanded={false}`, `onToggle={vi.fn()}`. Asserts toggle button has `aria-expanded="false"`. *Rationale: AC-6 initial state.*

5. **ConnectedBanner toggle — expand on click.** Render with parent state managed via `useState`. Click the toggle button. Asserts `aria-expanded="true"` after click. *Rationale: AC-6 state transition.*

6. **ConnectedBanner toggle — collapse on second click.** Continue from case 5: click toggle again. Asserts `aria-expanded="false"`. *Rationale: AC-6 reverse transition.*

## Tests deferred

- **Visual regression / screenshot tests.** Not in scope; preview-deploy walk covers visual evidence per the 6-dim rubric.
- **JourneyRail / PhaseStrip / DisclosureCard / PrepTasksCard / LockedSection render tests.** All static-content components; no logic; not testing the canvas's literal output per CLAUDE.md §"Engineering conventions" §"Don't write file-content assertions for logic slices".
- **A11y axe-core scan.** Deferred to the system-wide a11y holistic pass.
- **Cross-browser checks.** Production-port concern; not enforced for `/dev/proto/` surfaces.

## Test-pain audit

Count mock setups per unit test (`prototype` threshold = 5 mocks).

- Case 1-3: 0 mocks (prop-driven render).
- Case 4: 1 mock (`vi.fn()` for `onToggle` callback).
- Cases 5-6: 0 dedicated mocks (parent test wrapper holds state via real `useState`).

All cases well under threshold. No architectural deferral needed.

## Status

Drafted session 114 alongside acceptance. Test file written + executed at impl time.
