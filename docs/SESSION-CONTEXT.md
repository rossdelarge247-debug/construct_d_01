# Session 129 Context Block

## Mode

Product mode, per `CLAUDE.md` §"Product mode". CI is lint · typecheck · unit tests · build · gitleaks · the two spec-72 scans. One adversarial pass on the diff before commit; no loops, no new rules.

## The journey

**One user, one path, real data:** pre-signup interview → sign-up → welcome tour → connect a bank (Tink sandbox) → Your Picture built from the connected transactions → dashboard.

Every session's outcome is a sentence of the form "a user can now … in the preview" on this path. Screens outside it wait.

## State at session 128 wrap

- `main` @ `d818ea2`. Session branch `claude/session-128-kickoff-r3fm3l` carries session 128. PR to main opens at wrap; the user merges after the preview.
- Wired: interview (O1–O8) → sign-up → welcome-tour → bank-connect → Your Picture. Sign-in → dashboard. Moment 1/2 stay built but off the path.
- Bank-connect launches Tink Link as a full-page redirect. The callback (`api/bank/callback`) stores the transformer output in sessionStorage and lands on `your-picture`; `_context/bank-data-storage.ts` hydrates the context via `useSyncExternalStore` and survives reloads. Test scenarios follow the same path.
- Your Picture reads snapshot, outgoings, providers, transaction count, statement period, income and regular payments from the extractions. Still hardcoded: the name "Sarah", children, home address and home value.
- Verified in the sandbox on the production build: tour link · scenario path · reload · a seeded callback payload · the 503 error state without credentials. The live Tink click is not yet verified by a person.

## Next outcome (session 129)

Click the real Tink sandbox connection end to end and fix what breaks. Then: "a user can reach the dashboard from Your Picture with the connected figures carried through."

## Decisions on record

- Sign-up is password, not magic link (decision A, spec 65a §Status). Sign-in is password + Forgot? only (decision B).
- Serif drift between the canvas (Source Serif Pro) and the app (Source Serif 4) is accepted. Link underlines stay. Checkboxes are 14px native-scale in a 44px row.
- Claude Design canvases are reference, not bar. No new canvases until the journey works.
- Sign-up keeps its Account · About you · Pay stepper; "About you" is the post-signup profiling already built, "Pay" is designed when the journey reaches it.
- Session 128: the welcome tour exits straight to bank-connect; the Tink callback lands on Your Picture, not the dashboard.

## Lessons (one line each; this replaces new rules)

- Kickoffs and escalations rot: verify branch tips, "X not loaded" and "colour is Y" against git, `document.fonts` and the decoded canvas first.
- Port 3000 can stay held after killing `next dev`; check before a Playwright run.
- A background agent can die silently to the account rate limit; check `ReadNotifications` before trusting a result.
- The main branch check "npm audit (high + critical)" is already red on `2e35ca3`; it is not a PR's failure.
- Tink whitelists only `https://construct-dev.vercel.app/api/bank/callback`, and `api/bank/connect` derives the redirect URI from the request origin, so the real click works on production after merge, or on a preview only once its callback URL is added in the Tink console.
- The eslint react-hooks rule rejects setState inside an effect; hydrate from browser storage with `useSyncExternalStore` and a null server snapshot instead.
- The Playwright package in the lockfile expects a newer Chromium than `/opt/pw-browsers`; launch with `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`.

## Branch

`claude/session-128-kickoff-r3fm3l` until merged; session 129 starts its own branch from `main`.
