# S-PROTO-sign-in — Gauntlet loop card (run 2)
**Category:** prototype
**Journey:** inbound from = sign-up ("Have an account? Sign in", `sign-up/page.tsx` L176) and external/marketing (back arrow returns to marketing-landing) · outbound to = post-connect-dashboard (registry `hub-day-7-state-f` — the returning user's "Day 7" state the canvas lede names)

Bounded-loop card: objective · metric · boundary. `progress.md` beside this file is the durable state.

## OBJECTIVE

Ship `/dev/proto/sign-in` as a working mobile sign-in screen that a fresh critic — shown the rendered page and the canvas artboard side by side, unlabelled, and briefed on decision B — cannot reliably tell apart on structure, hierarchy, spacing and type in the region both share; and that carries a returning user with valid details through to `/dev/proto/post-connect-dashboard`.

**Auth model: password (decision B — see §Status).** The canvas `M_SignIn` (decoded Standalone.html L3609–3666) renders, beneath the *"Sign in"* button, an *"or"* divider, *"Continue with Google"* and *"Sign in with passkey"*. Decision A (spec 65a §Status) removed Google from sign-up; decision B removes both affordances and the divider from sign-in so the two auth surfaces agree. Everything above the button is built verbatim from the canvas.

## INPUTS AND STATE

- **Visual source (the bar):** `docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2 - Standalone.html` — `window.M_SignIn` L3609–3666; shared `Wordmark` L1370, `TopBar` L1377, `BackArrow` L1421; base constants L1351–1353. Read with offset+limit.
- **Reuse (brownfield):** `tests/e2e/helpers/canvas-capture.ts` (extracted from run 1's visual bar — mounts any `window.M_*` screen bare at 402×874 with the app's Inter shared), sign-up's validation shape (per-field `role="alert"`, `aria-describedby`, first-invalid focus), `--ds-*` tokens including run 1's additions (`accent-brand`, `danger-text`).
- **Placeholder data:** the canvas depicts a remembered device (*"Welcome back, Sarah."*, prefilled email, *"Day 7, 19 of 22 questions"*). Rendered from a `REMEMBERED` constant in `page.tsx`; where that state comes from pre-auth is an open question on the registry row, not a loop concern.
- **Registry:** row `sign-in` → `status: 'prototype-built'`, `lastTouched: { session: 126, date: '2026-09-09' }`, `links.prototype` + `links.slice`.
- **Token drift table** — as run 1 (`../S-PROTO-sign-up/acceptance.md`): SUB / MUTE / LINE cool-grey drift stands; ACCENT and the AI family now have tokens. `M_SignIn` introduces no new hex.

## METRIC / VERIFIER — all must pass

1. **Behaviour bar** — `npx playwright test tests/e2e/sign-in.journey.e2e.ts` green: canvas structure present with no Google/passkey text · empty password and malformed email stay on the page, announce a `role="alert"` and focus the field · valid details hand off to post-connect-dashboard · *"Forgot?"* explains the reset path in a `role="status"` region without navigating · tab order visits email → Forgot? → password → remember → Sign in and Enter submits · no horizontal overflow at 375px.
2. **A11y floor** — same spec: zero serious/critical axe violations at load AND after an invalid submit (run 1's colour-contrast finding only fired post-submit).
3. **Visual bar** — `npx playwright test tests/e2e/sign-in.visual-bar.e2e.ts` writes `tests/e2e/.bar/m-signin.{canvas,rendered}.png`. A fresh-context critic receives both images unlabelled plus one sentence: *"one side omits two social-login buttons and their divider by decision; judge the shared region."* The loop continues while it picks correctly with a stated, material reason inside the shared region.
4. **Floor** — `npm run lint` · `npm run typecheck` · `npm test` (whole vitest suite, including `tests/unit/proto-sign-in/page.test.tsx` and the registry row assertion) · `npm run build` green; registry row bumped.

Post-loop gate, outside the loop: full CI + 3-specialist auto-review on the PR.

## PROCESS

One builder owns the whole screen. Per round: inspect → take the critic's largest supported gap → one coherent change → run verifiers 1, 2 and 4 → capture 3. Stop rule counts **majors as well as blockers** from round 1 (run 1 lesson).

Critics: **visual** (blind pick) · **interaction/keyboard + a11y** (merged for run 2's budget) · **design-system** (token use against the drift table). Integration critic at the end walks sign-up → sign-in → post-connect-dashboard for wordmark, nav treatment and tone.

**Drift rule.** As run 1: no inline hex; drift-table gaps go to `progress.md` §Escalations for the user.

## BOUNDARIES

- **Allowed:** read the repo; edit `src/app/dev/proto/sign-in/**`, the `sign-in` row in `registry.ts`, `progress.md`, this file's §Status; add `tests/e2e/**` fixtures; add parity-tested tokens only after the user resolves an escalation.
- **Forbidden without approval:** push to `main`, any deploy, credentials, spending, new runtime dependencies, edits outside the paths above, editing the bar specs to make them pass.
- **Stop and report when:** all four verifiers pass and the blind critic's stated reason is below materiality or outside the shared region · the same largest-gap finding recurs two rounds running · 4 rounds or ~40 minutes wall-clock (run 2 is budgeted cheaper than run 1) · any blocker needs credentials or a product decision.

## Out of scope

Google OAuth · passkeys · password reset (blocked with `magic-link-sent` on a canvas — the Forgot? note is the honest placeholder) · desktop · real session / remembered-device storage.

## Status

Card written session 126 as loop run 2, after the user chose decision B (password + Forgot? only) over the canvas's Google + passkey affordances; recorded in spec 65a §Status. Bars authored before the build, unit suite in the floor, majors counted from round 1.
