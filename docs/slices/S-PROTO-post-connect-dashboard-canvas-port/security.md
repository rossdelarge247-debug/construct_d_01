# S-PROTO-post-connect-dashboard-canvas-port · Security

`Category: prototype` — DoD-14 short-form items 1, 8, 12, 14 per CLAUDE.md §"Slice categories" §"prototype" + spec 72 §11.

## Items (short-form, 4 of 14)

**1. Threat model / scope statement.** Slice is a UI-only prototype on `/dev/proto/post-connect-dashboard`. No auth check, no bank API call, no PII handling, no server-side state, no DB write. Canvas-literal copy + canvas-literal state defaults. Threat surface = static client-rendered React + URL `searchParams` read. Variant `searchParams` value is read as a string and compared against `"expressive"`; any other value (including injected) falls back to `conservative` — no code path renders based on attacker-controlled string.

**8. Input validation.** Variant query value `?variant=…` is a closed set — `conservative` or `expressive`. Implementation: `searchParams.variant === "expressive" ? "expressive" : "conservative"`. No regex, no eval, no dynamic component selection from string. Other inputs: none (no forms, no controlled bank-API calls).

**12. Logging + telemetry.** No telemetry instrumentation in slice. No `console.log` of any URL parameter or state value. Browser DevTools-visible `searchParams` is browser-default behaviour, not slice-added.

**14. Dependency / supply-chain check.** No new dependencies added by this slice — all imports are pre-existing: `react`, `next/navigation` (for `useSearchParams`), `@/styles/tokens`, `@/components/layout/signed-in-header`. `package.json` unchanged.

## Out-of-scope items (10 of 14) — documented for trace

Per `Category: prototype` short-form: items 2-7, 9-11, 13 not enforced at slice ship. Re-engagement at production-port (when this surface promotes from `/dev/proto/` to a real authenticated route) requires the full 14-item sweep including auth gate, RLS, audit logging, secrets handling, third-party config, safeguarding review, pen-test readiness, prod-config check, error-handling-no-leak, and CSP/HSTS verification.

## Status

Drafted session 114. Slice ships canvas-as-source prototype only; no production-port security work in scope.
