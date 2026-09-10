# Handoff — Session 128

**What a user can now do:** finish the welcome tour, press "Connect your bank", go through Tink Link (or pick a test scenario), and land on Your Picture showing the income, regular payments, outgoings, providers and statement period from the connected accounts. The data survives a reload.

**Decisions taken (user):** the welcome tour exits straight to bank-connect (Moment 1/2 stay built, off the path) · the Tink callback lands on Your Picture, not the dashboard.

**Built:** `bank-connect` launches Tink Link as a full-page redirect instead of a popup · `api/bank/callback` redirect target is `your-picture` · new `_context/bank-data-storage.ts` (sessionStorage behind `useSyncExternalStore`) hydrates the bank-data context · Your Picture gains income and regular-payment sections and a real statement period · unit test for the store.

**Verified in the sandbox** on the production build with Playwright: tour link · scenario path to Your Picture · reload · a callback payload seeded exactly as the route writes it · the 503 error state without Tink credentials. Floor green: lint, typecheck, 1070 unit tests, prod build.

**Not verified:** the real Tink sandbox click. Tink whitelists only the production callback URL and the connect route derives the redirect URI from the request origin, so the click works on `construct-dev.vercel.app` after merge, or on the preview once its callback URL is added in the Tink console.

**What broke:** nothing on the path. The react-hooks lint rule rejected the first hydrate-in-effect draft; replaced with `useSyncExternalStore`.

**Next:** merge; click the real Tink connection on production and fix what breaks; then carry the connected figures from Your Picture to the dashboard.
