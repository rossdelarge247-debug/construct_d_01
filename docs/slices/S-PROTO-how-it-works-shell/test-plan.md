# S-PROTO-how-it-works-shell — test plan

## Approach

Static placeholder shell. One smoke test asserting structural anchors render. No state machine, no async work, no edge cases.

## Test

`tests/unit/proto-how-it-works/shell.test.tsx`:

| Assertion | Evidence |
|---|---|
| Title `"How it works"` renders as H1 | `screen.getByRole('heading', { level: 1, name: 'How it works' })` |
| Sub text renders | `screen.getByText(/Decouple — the complete picture/)` |
| 4 step kickers render | each of Disclose / Reconcile / Settle / Finalise present |
| Back-to-hub link with `href="/dev/proto"` | `screen.getByRole('link', { name: /back to hub/i })` |

## Test pain audit

Spec 72d §3 L39 verbatim: *"Test-pain audit. If any unit test in this slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."*

Zero mocks — static page, no collaborators.

## Run

```bash
npm test -- tests/unit/proto-how-it-works/shell.test.tsx
```
