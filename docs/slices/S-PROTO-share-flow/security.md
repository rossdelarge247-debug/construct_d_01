# S-PROTO-share-flow — Security

**Category:** prototype → DoD-14 short-form per CLAUDE.md §"Slice categories" applies (items 1, 8, 12, 14 from spec 72 §11).

## Short-form items

### Item 1 · Threat model + data classification

- **Surface scope:** standalone preview at `/dev/proto/share-flow`. Static prototype with no backend wiring, no API call, no persistence, no external request.
- **Data class:** the modal collects `name` + `email` text input for the Ex party type. In prototype mode this is **in-memory only** (component state via `useState`); never persisted, never transmitted, never logged. On modal close / page navigation the values discard. No PII leaves the browser tab.
- **Threat surface:** the surface is a dev-route prototype. Production code paths do not call into this folder. The Selective-publish toggles do NOT actually filter any picture data — they're checkbox UI only.
- **Trust boundary:** the modal's inputs are not validated server-side because there is no server; HTML5 form validation (required + type=email) is the only constraint.

### Item 8 · Authentication, session, and CSRF

- **Auth scope:** `/dev/proto/*` is the dev-routes namespace and is unauthenticated by design (preview-deploy convenience; not a production access path).
- **CSRF:** no state-changing requests originate from this surface (no POST, no fetch). CSRF protection is N/A for the static prototype.

### Item 12 · Logging, observability, PII

- **Logging:** the prototype does not log to console, telemetry, or any analytics endpoint. No `console.log` statements in the shipped code. The Send-invite stub renders an in-DOM confirmation only.
- **PII:** the name + email values entered in the Ex panel never reach a logger or transport. They live in component state until the modal closes.

### Item 14 · Safeguarding (Decouple-specific)

- **Tone:** the surface is a settlement-context surface. Copy in state-1 ("nothing is locked, nothing is sent to him") and the soft-reminder ("You'll get a notification when Mark shares") preserve the user's sense of control + privacy — they explicitly communicate that nothing is leaked or committed without Sarah's explicit Share action.
- **Selective-publish framing:** per C-S3, the default-CHECKED behaviour assumes Sarah wants full share; the OPT-OUT pattern (uncheck to retain private) avoids the dark-pattern risk of an OPT-IN that nudges the user toward unintended disclosure.
- **Escape hatch:** R-M2 reinforces *"you can keep refining yours — nothing is locked"* — Sarah is never trapped in the share modal. Cancel + Escape close cleanly.
- **No safeguarding events triggered in scope:** the surface does not surface any of the spec 72 §11.14 trigger phrases (financial coercion, harm indicators, urgency-as-pressure). The "Share with Mark" CTA is opt-in and explicitly framed as Sarah's choice.

## Items deferred to host-page slice

Items 2-7, 9-11, 13 from spec 72 §11 apply when this surface is mounted in production by the host page (`S-PROTO-your-picture-private` Build container). Those gates fire on the host slice, not this prototype.
