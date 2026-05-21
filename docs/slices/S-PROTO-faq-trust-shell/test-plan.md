# S-PROTO-faq-trust-shell — test plan

## Approach

Static placeholder shell with FAQ + trust-signals sections. One smoke test with 7 assertions. No state machine, no async, no edge cases.

## Test

`tests/unit/proto-faq-trust/shell.test.tsx`:

| Assertion |
|---|
| Title `"Questions answered."` renders as H1 |
| Sub `"Trust through transparency."` renders |
| 3 FAQ question texts render |
| 3 trust-signal labels render (mono-styled, uppercase) |
| Back-to-hub link with `href="/dev/proto"` renders |
| FAQ section has `aria-labelledby="faq-heading"` |
| Trust section has `aria-labelledby="trust-heading"` |

## Test pain audit

Spec 72d §3 L39 verbatim: *"Test-pain audit. If any unit test in this slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."*

Zero mocks — static page, no collaborators.

## Run

```bash
npm test -- tests/unit/proto-faq-trust/shell.test.tsx
```
