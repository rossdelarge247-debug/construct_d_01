# S-PROTO-sign-in — loop progress

Target: `acceptance.md` §OBJECTIVE. Base: `claude/trusting-brahmagupta-uFE21` @ `db162dc` + the S-F1 token extension `fd3a4ea`. Branch: `claude/session-126-kickoff-iioj8m`.

## Rounds

| Round | Change | Verifier evidence | Critic's largest gap | Next action |
|---|---|---|---|---|
| 0 | Bars authored (`tests/e2e/sign-in.{journey,visual-bar}.e2e.ts`); run 1's capture code extracted to `tests/e2e/helpers/canvas-capture.ts` and sign-up's visual bar re-pointed at it; unit suite + registry assertion written red | Unit + registry RED against the stub route (module missing; row `canvas-drafted`) | — | Build from `M_SignIn` under decision B |
| 1 | Built `/dev/proto/sign-in` from `M_SignIn` L3609–3666 under decision B: TopBar (back → marketing-landing, "Need an account?" → sign-up), Wordmark 20px, serif h1, lede, email (prefilled from `REMEMBERED`), password with Forgot? `role="status"` note, remember-device checkbox, "Sign in" → post-connect-dashboard, "New here? Start your case" → sign-up; per-field errors as sign-up | journey 8/8; axe pre+post submit clean; unit 5/5 + registry row; lint 0 errors; tsc clean; blind pick A=canvas correct, strongest reason = link underlines (deliberate a11y affordance, minor) | Material: checkbox 22px vs canvas 13px (+9px); heading 16px wider (app renders Source Serif 4, canvas only had Inter shared so fell to Georgia); inputs 4px taller (inherited line-height) and 44px remember row → button +38px | Round 2: rhythm + checkbox + share serif with the canvas |

## Failed approaches

(none yet)

## Escalations

- Serif on the canvas side: the app now loads Source Serif 4, the canvas still falls back to Georgia in headless Chromium. `canvas-capture.ts` shares Inter only; sharing the serif the same way is the harness fix if a blind pick lands on the heading face.

## Boundaries remaining

Rounds: 0/4 · Wall-clock: ~40 min · Same-gap-twice: 0/2
