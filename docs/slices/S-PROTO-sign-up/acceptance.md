# S-PROTO-sign-up — Gauntlet loop card
**Category:** prototype
**Journey:** inbound from = pre-signup-interview (O8 "Create my account", `screens/O8.tsx:256`, pre-existing and unchanged) · outbound to = welcome-tour

Bounded-loop card: objective · metric · boundary. `progress.md` beside this file is the durable state; long chat history is not.

## OBJECTIVE

Ship `/dev/proto/sign-up` as a working mobile sign-up screen that a fresh critic — shown the rendered page and the canvas artboard side by side, unlabelled — cannot reliably tell apart on structure, hierarchy, spacing and type; and that carries a user with valid details through to `/dev/proto/welcome-tour`.

**Auth model: password (decision A — see §Status).** Spec 57 §1.2 as written is *"Email input → [Send magic link] → 1.2a"* and spec 65a L28 records *"Sign-up form (Google OAuth + email magic link)"*. This slice follows the canvas instead: full name · email · create password (hint *"Min 12 characters"*) · terms checkbox · *"Create account"*. Spec 65a carries the amendment of record in its §Status (its row 1.2 is marked superseded); spec 57 source stays intact, per 65a's own rule that *"those remain canonical for their post-pivot subset"*. Magic-link-sent (1.2a) leaves the slice.

## INPUTS AND STATE

- **Visual source (the bar):** `docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2 - Standalone.html` — `window.M_SignUp` L3667–3730; shared `Wordmark` L1370, `TopBar` L1377, `BackArrow` L1421, `AIBadge` L2293; base constants L1351–1353. Read with offset+limit — the file is 7.4MB and read-cap blocks whole-file reads.
- **Reuse (brownfield):** `@/styles/tokens`, `WORDMARK` from `@/constants`, `_components/ProtoHeader` or the canvas `TopBar` treatment (builder's call; critics judge), `_context/profiling-context` if name/email should persist into Moment 2.
- **Existing shell:** `src/app/dev/proto/sign-up/page.tsx` (49 lines, back-link only) — replace.
- **Registry:** `src/app/dev/proto/registry.ts` row `sign-up` → `status: 'prototype-built'`, `lastTouched: { session: 125, date: '2026-09-09' }`. The `pre-push-dod7` hook refuses the push without it.
- **Token drift table** (canvas hex → nearest token):

  | Canvas | Hex | Token | Hex | State |
  |---|---|---|---|---|
  | INK | `#1A1A1A` | `color.ink` | `#1A1A1A` | match |
  | PAPER / BG / WARM | `#FFFFFF` / `#F5F5F4` / `#FAFAF7` | `surface.panel` / `.page` / `.canvas` | same | match |
  | SUB | `#5F6368` | `text.sub` | `#57534E` | drift (cool vs warm) |
  | MUTE | `#9AA0A6` | `text.muted` | `#78716C` | drift |
  | LINE | `#EAECEF` | `border` | `#E5E3DC` | drift |
  | ACCENT | `#2F6D5F` | — | — | no token |
  | AI card | `#4C3FB8` / `#F5F3FF` / `#E4DEFD` | nearest `accent.violet` | `#7C3AED` | no token |

- **Durable state:** `progress.md` — one row per round: change · verifier evidence · critic's largest gap · next action.

## METRIC / VERIFIER — all must pass

1. **Behaviour bar** — `npx playwright test tests/e2e/sign-up.journey.e2e.ts` green: canvas structure present · empty and short-password submits stay on the page and announce a `role="alert"` · valid details hand off to welcome-tour · tab order visits every control and Enter submits · no horizontal overflow at 375px.
2. **A11y floor** — same spec: zero serious/critical axe violations.
3. **Visual bar** — `npx playwright test tests/e2e/sign-up.visual-bar.e2e.ts` writes `tests/e2e/.bar/m-signup.{canvas,rendered}.png`. A fresh-context critic receives both images with labels stripped and says which is the reference and why. The loop continues while it picks correctly with a stated, material reason. The critic must also confirm the rendered page is real DOM (resize it, tab through it, inspect it) — never an image.
4. **Floor** — `npm run lint` · `npm run typecheck` · `npm test` (the whole vitest suite — CI runs this, not Playwright; a shipped surface changes the registry snapshot test and retires any placeholder test) · `npm run build` green; registry row bumped.

Post-loop gate, outside the loop: full CI + 3-specialist auto-review on the PR. The rigour suite is the last critic, not a per-keystroke tax.

## PROCESS

One builder owns the whole screen — a coupled system gets sequential ownership, not fan-out. Per round: inspect the current state → take the critic's largest supported gap → make one coherent change → run verifiers 1, 2 and 4 → capture 3.

Four critics, each with fresh context and one lens: **visual** (blind pick) · **interaction/keyboard** · **a11y + mobile viewport** · **design-system** (token use against the drift table). A final fresh **integration critic** walks O8 → sign-up → welcome-tour for consistency: wordmark, nav treatment, tone.

**Drift rule.** If the visual critic's largest gap traces to the drift table, the builder does not inline hex. It is recorded in `progress.md` §Escalations as a design-system decision for the user — add cool-grey / green / purple tokens (parity-tested, per the PR #231 pattern) or accept warm stone — and the round ends there.

## BOUNDARIES

- **Allowed:** read the repo; edit `src/app/dev/proto/sign-up/**`, the `sign-up` row in `registry.ts`, `progress.md`, this file's §Status; add `tests/e2e/**` fixtures; add parity-tested tokens only after the user resolves an escalation.
- **Forbidden without approval:** push to `main`, any deploy, credentials, spending, new runtime dependencies, edits outside the paths above, editing the two bar specs to make them pass.
- **Stop and report when:** all four verifiers pass and the blind critic's stated reason is below materiality · the same largest-gap finding recurs two rounds running · 6 rounds or ~60 minutes wall-clock elapse, whichever first · any blocker needs credentials or a product decision.

## Out of scope

Sign-in (`#m-signin`, candidate for run 2) · magic-link-sent · desktop (no asset in repo) · Google OAuth · "Pay" step routing — render the stepper label faithfully, log it as an open question against the `pricing` registry row (which cites spec 56 L8.2 as the blocker).

## Status

Card written session 125, the first live run of the builder/critic loop experiment. Decision A (password, follow the canvas) taken session 125 against spec 57 §1.2's magic-link model. Bars authored before the builder existed. Loop not yet run.
