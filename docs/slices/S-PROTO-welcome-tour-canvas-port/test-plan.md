# S-PROTO-welcome-tour-canvas-port — test plan

## Approach

Canvas-as-source slice with non-trivial state (step machine + localStorage + keyboard). Test unit-of-behaviour is the step state machine and its CTAs; visual regression is covered by user-confirmed preview-deploy walk (DoD item 4). Per CLAUDE.md §"Engineering conventions" §"TDD where tractable" the state machine warrants a unit test; the visual layout does not.

## Tests

### `tests/unit/proto-welcome-tour/step-state.test.tsx`

Exercises AC-11. Renders the default-exported `WelcomeTourPage` and asserts state-machine transitions via DOM markers + `localStorage` reads.

| Test | Assertion |
|---|---|
| Initial render shows intro CTAs | `"Take the tour"` button + `"Skip to dashboard"` CTA visible; `localStorage.getItem('decouple_tour_step') === '0'` after mount |
| `ArrowRight` keydown advances step | After fireEvent.keyDown(window, ArrowRight): `localStorage` → `'1'`; phase 1 kicker `"Phase 1 · Disclose"` visible |
| Repeated `ArrowRight` advances to dashboard | After 5× ArrowRight: `localStorage` → `'5'` (= DASH_STEP); dashboard marker visible |
| `ArrowRight` at DASH_STEP is no-op | Handler returns early per L844; further ArrowRight does NOT increment |
| `ArrowLeft` from step 1 retreats to intro | After ArrowRight then ArrowLeft: `localStorage` → `'0'`; intro CTAs re-visible |
| `ArrowLeft` at step 0 is capped | ArrowLeft from intro: `localStorage` stays `'0'` |
| `"Skip to dashboard"` click jumps to DASH_STEP | After click: `localStorage` → `'5'`; dashboard marker visible |

## Test pain audit

Spec 72d §3 L39 quoted verbatim:

> "Test-pain audit. If any unit test in this slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation. The pain is the signal. Address by extracting effects behind interfaces (per CLAUDE.md §"Coding conduct" §"Effects behind interfaces") OR explicitly defer with reasoning recorded in `verification.md` §"Architectural deferrals"."

Mocks expected per unit test:
- No collaborators to mock — `WelcomeTourPage` is a self-contained client component. `localStorage` is provided by jsdom; `window.addEventListener` is jsdom-native; `useState` / `useEffect` are React.
- Zero `vi.mock(...)` setups required.

Threshold cleared at zero mocks; prototype-category raise per CLAUDE.md §"Slice categories" (*"test-pain audit threshold raises from >2 to >5 mocks"*) would also clear.

## Other tests not in this slice

- **Visual regression** — covered by user-confirmed preview-deploy walk per `verification.md` §"Preview-deploy verification".
- **A11y** — deferred to the system-wide holistic a11y pass per parent slices `S-PROTO-a11y-wcag-audit-phase-1` / `-phase-2`.
- **PHASES content snapshot** — out of scope; the array is a static literal whose drift would be visible in PR diff review.

## Run

```bash
npm test -- tests/unit/proto-welcome-tour/step-state.test.tsx
```

Expected: ≥7 specs passing.
