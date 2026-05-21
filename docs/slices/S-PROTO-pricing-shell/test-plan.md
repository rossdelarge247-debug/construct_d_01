# S-PROTO-pricing-shell — test plan

## Approach

Static placeholder shell with two tier cards. One smoke test with 6 assertions. No state machine, no async, no edge cases.

## Test

`tests/unit/proto-pricing/shell.test.tsx`:

| Assertion |
|---|
| Title `"One settlement. Two paths."` renders as H1 |
| Sub line referencing £14,561 baseline renders |
| Tier names `Start` and `Complete` render |
| Tier prices `Free` and `From £800` render |
| Back-to-hub link with `href="/dev/proto"` renders |
| Both CTA buttons render with `disabled` attribute |

## Test pain audit

Spec 72d §3 L39 verbatim: *"Test-pain audit. If any unit test in this slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."*

Zero mocks — static page, no collaborators.

## Run

```bash
npm test -- tests/unit/proto-pricing/shell.test.tsx
```
