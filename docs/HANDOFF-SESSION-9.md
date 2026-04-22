# Session 9 Handoff — Foundation Build

**Date:** 2026-04-13
**Branch:** `claude/decouple-v2-financial-disclosure-j9xdZ`
**Lines changed:** ~960 net (9 files)
**Deployment:** Vercel at `construct-dev.vercel.app`

## What happened

Session 9 was the first code session after the major session 8 design review (30 wireframes, 7 specs). The goal was to build the navigable skeleton: carousel → task list → bank connection → reveal → back to task list.

### Commits (5)

1. **Add workspace foundation** — New types, WelcomeCarousel, TaskListHome, BankConnectionFlow components. Rewrote workspace page with flow state machine. Added CSS animations per spec 26.

2. **Mobile responsiveness + Tink iframe/drop-in mode** — Stacked layouts on mobile, responsive padding, responsive graphic heights. Refactored Tink modal to TinkModal component with iframe support and postMessage callback.

3. **Clean up Tink modal** — Dev controls only shown when Tink credentials not configured. Loading state with shimmer. Production-appropriate copy ("Continue with demo data" not "Simulate connection").

4. **Fix Tink Link BAD_REQUEST** — Connect route was passing null for authorization_code. Added user creation + auth code generation before building the Tink Link URL.

5. **Fix Tink Link auth scopes** — Changed from delegate grant with data-access scopes to authorization grant with Tink Link scopes. Tink Link now loads the bank selector successfully.

### Components built

| Component | File | Screens |
|---|---|---|
| WelcomeCarousel | `src/components/workspace/welcome-carousel.tsx` | 1a, 1b, 1c |
| TaskListHome | `src/components/workspace/task-list-home.tsx` | 2a (first-time + post-connect) |
| BankConnectionFlow | `src/components/workspace/bank-connection-flow.tsx` | 3, 3b, 3c, 3d, 3e |
| TinkModal | (inside bank-connection-flow.tsx) | 3c |
| Page orchestrator | `src/app/workspace/page.tsx` | Full flow |

## What went well

- **Skeleton built quickly** — all 5 core screens navigable in the first commit (~810 lines)
- **Spec 26 animations implemented correctly** — stagger timing, easing curves, GPU acceleration, prefers-reduced-motion all per spec
- **Tink iframe integration works** — tested live on Vercel, loads the real Tink bank selector. Required debugging two auth issues but now working end-to-end.
- **Mobile responsive from the start** — caught and fixed layout issues before user testing
- **Clean separation** — new `src/components/workspace/` directory, old hub components preserved but bypassed

## What could improve

- **Tink auth took 3 commits to get right** — the original tink-client.ts had auth functions but the connect route wasn't using them properly. Should have read the existing code more carefully before the first attempt.
- **Mock data could be more clearly flagged** — the reveal uses hardcoded wireframe copy (£3,216/month from ACME Ltd) which confused the user briefly. Should have made it more obvious this was placeholder data, or wired to real transformer output from the start.
- **"Simulate connection" label slipped through** — the dev button had non-production copy that was visible on Vercel. Caught and fixed but should have been cleaner on first pass.

## Key decisions

1. **New component directory** — `src/components/workspace/` separate from `src/components/hub/`. Old hub components preserved but not imported. Clean break without deletion risk.

2. **View state machine** — `WorkspaceView` type (`carousel | task_list | bank_connection | confirmation | financial_summary`) manages navigation via React state. No router-based routing for the main flow — it's a single-page state machine. Financial summary is a sub-view, not a route.

3. **TinkModal with dual mode** — iframe loads Tink Link URL when credentials configured; graceful fallback with "Continue with demo data" when not. Callback route supports both postMessage (iframe) and redirect (legacy) modes.

4. **Authorization grant over delegate grant** — `/api/v1/oauth/authorization-grant` with `external_user_id` handles user creation automatically. Simpler than separate user creation + delegate grant, and uses the correct scopes for Tink Link.

## Bugs found and fixed

1. **Tink BAD_REQUEST** — Connect route was passing `null` for authorization_code. Tink Link requires a valid auth code. Fixed by adding user creation + auth code generation.

2. **REQUEST_FAILED_FETCH_EXISTING_USER** — Was using delegate grant (`/authorization-grant/delegate`) with data-access scopes (`accounts:read,transactions:read`). Tink Link needs its own scopes (`credentials:write,providers:read`, etc.) via the standard authorization grant endpoint. Fixed by adding `createTinkLinkAuthCode()`.

## Setup notes for new sessions

- **Vercel deployment**: The app deploys to Vercel. Preview deployments are created per branch. Production is at `construct-dev.vercel.app`.
- **Tink credentials**: `TINK_CLIENT_ID` and `TINK_CLIENT_SECRET` must be set in Vercel environment variables. The Tink Console must have `https://construct-dev.vercel.app/api/bank/callback` as a whitelisted redirect URI.
- **Testing without Tink**: If Tink credentials are not configured, the modal shows a fallback with "Continue with demo data" to test the rest of the flow.
