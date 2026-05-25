# S-PROTO-bank-connect

**Category:** prototype
**Journey:** inbound from = moment-2-profiling (P6 "Got it — let's connect") · outbound to = post-connect-dashboard / section-confirm

## Context

3,801 lines of existing Tink integration at `src/lib/bank/` provide the backend. This slice builds the prototype UI wrapper: scenario selection in dev mode, Tink Link popup launch in live mode, success/error states.

## Acceptance criteria

**AC-1: Dev-mode scenario selector.**
Page shows a card for each of 5 test scenarios from `getAllTestScenarios()` (`test-scenarios.ts`). Each card shows scenario name, description, provider, and account type. Clicking a card loads the scenario data and transitions to the success state.

**AC-2: Live-mode Tink Link launcher.**
When `TINK_CLIENT_ID` is configured (detected via a `/api/bank/connect` health check or feature flag), the page shows a "Connect with Open Banking" primary CTA that POSTs to `/api/bank/connect` and opens the returned URL in a popup. A loading state ("Connecting to your bank...") shows while the popup is open.

**AC-3: Success confirmation.**
After scenario load (dev) or Tink callback (live), the page shows: provider name, account type, transaction count, date range, and a "Continue to your dashboard" CTA linking to post-connect-dashboard.

**AC-4: Error state with retry.**
If `/api/bank/connect` returns an error or Tink callback fails, the page shows the error message and a "Try again" button that resets to the initial state.

**AC-5: PostMessage listener for Tink callback.**
Page listens for `window.message` events with `type: 'tink-complete'` (matching the existing callback route's contract at `src/app/api/bank/callback/route.ts` L89). Extracts results and transitions to success state.

**AC-6: Registry updated.**
`registry.ts` rows for `bank-picker`, `callback-success`, `callback-error-retry` updated to `prototype-built`.

## Out of scope

- Modifying existing `src/lib/bank/` code or API routes
- Manual entry fallback form (separate slice)
- Multi-account connection flow (single account per session for prototype)
- Real data persistence
