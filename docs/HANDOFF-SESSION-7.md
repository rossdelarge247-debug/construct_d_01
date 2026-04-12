# Session 7 Handoff

**Date:** 2026-04-12
**Branch:** `claude/decouple-v2-workspace-1cX72`
**Final commit:** `fd237fd`
**Lines changed:** 1,226 (src only, excludes docs)
**Deployed:** Pushed to branch, Vercel auto-deploys

---

## What happened

### Deliverables completed

1. **P0: Statement deduplication** — When the same bank account is uploaded twice (same provider + last4 digits), only the most recent closing balance is kept. Added `getAccountKey()` to extract a normalised account identifier from labels, and `mergeItemsDeduped()` to replace older statements. Applied to all 5 item-merge paths in `use-hub.ts`.

2. **P1: Dry-run mock data** — The extract route now returns a realistic `BankStatementExtraction` mock through the real `transformExtractionResult` pipeline when no API key is set (instead of 503). Mock includes 2 income sources, 8 regular payments (with keyword-matchable payees), 3 spending categories. Exercises the full downstream: keyword lookup, aggregation, Q&A, section cards, category grouping.

3. **P2: Tink Open Banking integration** — Full server-side infrastructure plus UI wiring:
   - `src/lib/bank/tink-client.ts` — Tink API wrapper (OAuth, user creation, Tink Link URL, token exchange, paginated data fetch)
   - `src/lib/bank/tink-transformer.ts` — Transforms Tink accounts + transactions → `BankStatementExtraction` (same shape as AI pipeline output)
   - `src/app/api/bank/connect/route.ts` — Generates Tink Link URL
   - `src/app/api/bank/callback/route.ts` — Handles Tink redirect, fetches data, stores in sessionStorage, redirects to workspace
   - `src/app/api/bank/test/route.ts` — Tests Tink credentials (diagnostic endpoint)
   - `src/components/hub/tink-debug-panel.tsx` — Debug panel with credential test, connect flow test, bank data diagnostics. Visibility persists in localStorage.
   - Hero panel updated with "Connect your bank" button alongside drag-drop upload zone
   - `use-hub.ts` updated with `handleBankConnect` callback and sessionStorage pickup for returning bank data

### Tink integration status

- **Full flow working end-to-end.** Tink Link → sandbox bank auth → callback → tink-transformer → BankStatementExtraction → transformExtractionResult → Q&A pipeline.
- **Redirect URI:** Must use stable Vercel production domain (`construct-dev.vercel.app`), not preview URLs.
- **Sandbox:** Test bank at `demobank.production.global.tink.se` works with sandbox credentials.

### Tink API lessons learned

| Issue | Cause | Fix |
|-------|-------|-----|
| 415 on delegation endpoint | JSON content type | Changed to `application/x-www-form-urlencoded` |
| 400 missing actor_client_id | Missing required param | Added `actor_client_id` to delegation request |
| REQUEST_FAILED_FETCH_EXISTING_USER | User creation + delegation flow unreliable | Switched to no-auth-code Tink Link flow |
| 415 on user creation | Form-encoded content type | Reverted to JSON (this endpoint requires JSON) |
| INVALID_STATE_REDIRECT_URI | Callback URL not whitelisted in Tink Console | Needs manual configuration in Tink Console |

---

## What went well

- Debug panel made iterating on Tink API issues fast — could test credentials, generate URLs, and see responses without leaving the workspace
- The architectural decision to transform Tink data → `BankStatementExtraction` is clean — the entire downstream pipeline works unchanged
- Statement deduplication and dry-run mock were straightforward wins
- Live debugging on Vercel with real Tink sandbox caught API issues that local dev wouldn't

## What could improve

- Tink API documentation is inconsistent about content types and required parameters — cost us several iterations
- The user creation + delegation flow should be revisited once the redirect URI is sorted. The no-auth-code flow might not return enough data for user identification.
- Should consider using a stable Vercel production URL or custom domain to avoid redirect URI changes on each deployment

## Key decisions

1. **No-auth-code Tink Link flow** — Simpler and avoids the user creation issues. Tink Link manages user lifecycle internally.
2. **Tink data → BankStatementExtraction** — All Open Banking data normalised into the same shape as AI pipeline output. One transformer pipeline for both.
3. **SessionStorage for callback data** — The Tink callback stores results in sessionStorage and redirects to workspace. Hub picks up data on mount. Works without server-side sessions.
4. **Debug panel with localStorage toggle** — Persistent visibility state. Can be hidden once testing is done.

## Bugs found and fixed

| Bug | Cause | Fix |
|-----|-------|-----|
| Tink auth grant 415 | OAuth endpoint expected form-encoded | Changed content type |
| Missing actor_client_id | Tink API requires it for delegation | Added parameter |
| User not found in Tink Link | Separate user creation unreliable | Switched to no-auth-code flow |
