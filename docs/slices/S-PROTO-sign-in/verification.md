# S-PROTO-sign-in — verification

Final-state record for the slice's metric (`acceptance.md` §METRIC / VERIFIER). Round-by-round detail lives in `progress.md`; this file records the state at ship.

## Verifier evidence

| # | Verifier | Status | Evidence |
|---|---|---|---|
| 1 | Behaviour bar — `npx playwright test tests/e2e/sign-in.journey.e2e.ts` | Pass | 8/8 in real Chromium at 375×667: canvas structure with no Google/passkey text (decision B) · empty password and malformed email stay on the page with a `role="alert"` beside the field and focus moved to it · valid details hand off to `/dev/proto/post-connect-dashboard` · Forgot? explains the reset path in a `role="status"` region without navigating · tab order email → Forgot? → password → remember → Sign in, Enter submits · no horizontal overflow at 375px. |
| 2 | A11y floor — axe in the same spec | Pass | Zero serious/critical violations at load and again after an invalid submit (the state where run 1's contrast finding hid). |
| 3 | Visual bar — `npx playwright test tests/e2e/sign-in.visual-bar.e2e.ts` | Pass with recorded gaps | Both captures bare at 402×874 via `tests/e2e/helpers/canvas-capture.ts`, Inter asserted loaded on both sides. Three fresh-context blind picks (rounds 1–3) each identified the implementation; by round 3 every stated reason was deliberate (button omission, link underlines, the canvas's faked prefilled password) or below materiality (2px at two gaps, the standing warm-vs-cool grey drift). Ink-band measurement from the PNGs: wordmark, heading, lede, labels, fields, checkbox row and button track the canvas within 1–4px. Heading string is 16px wider in the app because the canvas embeds Source Serif Pro while the app loads Source Serif 4 — recorded in `progress.md` §Escalations. |
| 4 | Floor — lint · typecheck · unit suite · production build · registry row | Pass | `npm run lint` 0 errors · `npx tsc --noEmit` clean · `npx vitest run` 139 files / 1065 tests (incl. `tests/unit/proto-sign-in/page.test.tsx` 5/5 and the registry row assertion) · `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` green with the dev server stopped (CI conditions; `/dev/proto/sign-in` prerendered) · `registry.ts` sign-in row `prototype-built`, `lastTouched.session 126`, prototype + slice + spec links. |

Integration walk (Playwright, after round 3): sign-up → "Sign in" → sign-in → valid submit → post-connect-dashboard, and sign-in → "Need an account?" → sign-up; every surface renders the `Decouple.` wordmark; sign-up and sign-in share the canvas TopBar, the dashboard uses ProtoHeader (nav-consistency item, P4). Tone note: "Welcome back, Sarah." lands on the dashboard's "Welcome, Sarah." two screens running.

## Preview-deploy verification (spec 72a, six dimensions)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Verified locally · preview pending | Prefilled email + any password → post-connect-dashboard. Playwright in real Chromium. User to confirm on the Vercel preview. |
| Edge cases | Verified locally | Empty password and malformed email flagged beside the field with focus moved; message clears as the field becomes valid; Forgot? note appears once without navigation (unit tests 2–5, journey bar). |
| `prefers-reduced-motion` | Verified by inspection | `sign-in.module.css` declares no `transition`, `animation` or `@keyframes`; the only `transform` is the static 45° checkmark. |
| Keyboard-only | Verified locally | Journey bar asserts the five tab stops and Enter-to-submit from the password field. |
| Mobile viewport (375×667) | Verified locally · preview pending | No horizontal overflow; remember row and Forgot? keep 44px hit areas behind negative margins; blind critic confirmed real DOM at 375×667 and 402×874. |
| Screen-reader | Verified by probe | Labels via `htmlFor`; per-field `aria-invalid` + `aria-describedby`; single `role="alert"` per submit; Forgot? is a `button` with `aria-expanded`/`aria-controls` to its `role="status"` note. Not yet exercised with a real screen reader. |

## Architectural deferrals

- Remembered-device state (`REMEMBERED` constant: first name, email, day, progress) — no pre-auth session store exists; open question on the registry row.
- Password reset — blocked with `magic-link-sent` on a canvas; the Forgot? note is the placeholder.
- Checkbox size differs from sign-up (14px native-size vs sign-up's 22px custom box) — align sign-up when its PR is next touched; recorded in `progress.md` §Escalations.
