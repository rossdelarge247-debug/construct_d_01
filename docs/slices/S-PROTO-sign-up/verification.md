# S-PROTO-sign-up — verification

Final-state record for the slice's metric (`acceptance.md` §METRIC / VERIFIER). Round-by-round detail lives in `progress.md`; this file records the state at ship.

## Verifier evidence

| # | Verifier | Status | Evidence |
|---|---|---|---|
| 1 | Behaviour bar — `npx playwright test tests/e2e/sign-up.journey.e2e.ts` | Pass | 7/7 in real Chromium at 375×667: canvas structure · empty and short-password submits stay on the page with `role="alert"` · valid details hand off to `/dev/proto/welcome-tour` · tab order name → email → password → terms → button, Enter submits · no horizontal overflow at 375px. Re-run independently on `8f7a82f`. |
| 2 | A11y floor — axe in the same spec | Pass | Zero serious/critical violations at load. The after-submit state (site of an earlier 3.54:1 contrast failure) is covered by the unit test's error assertions and was re-scanned by the final a11y critic. |
| 3 | Visual bar — `npx playwright test tests/e2e/sign-up.visual-bar.e2e.ts` | Pass with recorded gap | Both captures produced bare at 402×874 with Inter asserted loaded on both sides. The blind critic identified the implementation in every comparison (the reference always won). Largest remaining gap (rated material by the final blind critic): a redundant "Read the Terms and Privacy Policy." line beneath the button that the canvas does not have; secondary: looser vertical rhythm, stepper centring. Carried to session 126 before the PR. |
| 4 | Floor — lint · typecheck · unit suite · production build · registry row | Pass | `npm run lint` 0 errors · `npx tsc --noEmit` clean · `npx vitest run` 138 files / 1057 tests · `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` green with the dev server stopped (CI conditions) · `registry.ts` sign-up row `prototype-built`, `lastTouched.session 125`, spec link corrected. |

Integration critic (fresh context, after round 4): journey walk green end-to-end; registry confirmed; one commit per round (`8c865bf`, `78a9a84`, `c7b9a10`, `8f7a82f`); wordmark text "Decouple." on sign-up, welcome-tour and moment-1-ack, treatment not yet unified (nav-consistency item, session 126 P4).

## Preview-deploy verification (spec 72a, six dimensions)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Verified locally · preview pending | Fill name/email/password ≥12/terms → welcome-tour slide 1. Playwright + integration critic in real Chromium. User to confirm on the Vercel preview. |
| Edge cases | Verified locally | Empty submit flags all four fields, focuses the first invalid, one live alert; short password rejected; malformed email rejected; errors clear as fields become valid; untouched fields not validated before first submit (unit tests 4–10). |
| `prefers-reduced-motion` | Verified by inspection | `sign-up.module.css` declares no `transition`, `animation` or `@keyframes`; the only `transform` is a static 45° rotation on the stepper glyph, so there is no motion to reduce. |
| Keyboard-only | Verified locally | Journey bar tab-order test; unit test asserts the five tab stops; Enter submits from the password field. |
| Mobile viewport (375×667) | Verified locally · preview pending | No horizontal overflow at 320/360/375 (a11y critic probe); consent row ≥44px tall after round 4. User to confirm on a device via the preview. |
| Screen-reader | Verified by probe | Labels associated via `htmlFor`; per-field `aria-invalid` + `aria-describedby` to the error (password also to its hint); single `role="alert"`; `next-route-announcer` no longer suppressed. Not yet exercised with a real screen reader. |

## Architectural deferrals

- Colour tokens: brand accent, AI trust-card family, text-safe danger — sign-up uses phase-colour stand-ins and a `color-mix()` border until the tokens slice lands (session 126 P1). Recorded in `progress.md` §Escalations.
- `--ds-font-serif` names a family next/font does not load; Inter registered at weight 400 only — same slice.
- Sign-in, magic-link-sent (spec 57 §1.2a), desktop variants: out of scope; sign-in and legal links point at the parametric stub routes.
