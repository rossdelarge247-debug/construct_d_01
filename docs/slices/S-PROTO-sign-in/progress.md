# S-PROTO-sign-in — loop progress

Target: `acceptance.md` §OBJECTIVE. Base: `claude/trusting-brahmagupta-uFE21` @ `db162dc` + the S-F1 token extension `fd3a4ea`. Branch: `claude/session-126-kickoff-iioj8m`.

## Rounds

| Round | Change | Verifier evidence | Critic's largest gap | Next action |
|---|---|---|---|---|
| 0 | Bars authored (`tests/e2e/sign-in.{journey,visual-bar}.e2e.ts`); run 1's capture code extracted to `tests/e2e/helpers/canvas-capture.ts` and sign-up's visual bar re-pointed at it; unit suite + registry assertion written red | Unit + registry RED against the stub route (module missing; row `canvas-drafted`) | — | Build from `M_SignIn` under decision B |
| 1 | Built `/dev/proto/sign-in` from `M_SignIn` L3609–3666 under decision B: TopBar (back → marketing-landing, "Need an account?" → sign-up), Wordmark 20px, serif h1, lede, email (prefilled from `REMEMBERED`), password with Forgot? `role="status"` note, remember-device checkbox, "Sign in" → post-connect-dashboard, "New here? Start your case" → sign-up; per-field errors as sign-up | journey 8/8; axe pre+post submit clean; unit 5/5 + registry row; lint 0 errors; tsc clean; blind pick A=canvas correct, strongest reason = link underlines (deliberate a11y affordance, minor) | Material: checkbox 22px vs canvas 13px (+9px); heading 16px wider (app renders Source Serif 4, canvas only had Inter shared so fell to Georgia); inputs 4px taller (inherited line-height) and 44px remember row → button +38px | Round 2: rhythm + checkbox + share serif with the canvas |
| 2 | Inputs `line-height: 1.2` (45px as canvas); remember row keeps its 44px hit area behind negative margins, box 14px like the native control; capture helper tried sharing the serif with the canvas | journey 8/8 + visual 2/2; unit 5/5; lint 0 errors; tsc clean; production build green; blind pick correct but its stated reason was the deliberate button omission (outside the shared region) | Shared-region: link underlines (deliberate a11y affordance, as sign-up); heading 16px wider; wordmark→h1 joint +6px; password label→input −5px | Round 3: the two measured gaps; diagnose the heading |
| 3 | Wordmark `display: block; line-height: 1.2` (the span inherited the page's 1.5 line box); `.labelRow` margin-bottom 5px as canvas. Heading diagnosed, not changed: both sides load the same font-size/weight/letter-spacing, but the canvas renders its own embedded *Source Serif Pro* faces (it never fell back to Georgia — the run-1 escalation was wrong), while the app loads *Source Serif 4* from next/font; the two versions differ in advance widths (249×33 vs 265×36 for the h1 string). Harness serif-sharing reverted as no-op | journey 8/8 + visual 2/2; ink bands now track the canvas within 1–4px from wordmark to button | Blind pick correct (high); strongest reason = password dots are muted placeholder in the build vs black prefilled value in the canvas (the canvas fakes a filled password — deliberate, not matched); material: 14px checkbox with the 4px radius token reads near-circular vs the canvas's squared native control; minor: warm-vs-cool muted greys (standing drift row), 2px at two gaps | Round 4: checkbox radius |
| 4 | Checkbox `border-radius: 2px` (native-control radius; the 4px token is circular at 14px) | journey 8/8 + visual 2/2; unit 5/5; lint 0 errors; tsc clean | Loop stops at the round boundary (4/4): every remaining pick reason is deliberate (button omission, underlines, faked password value) or below materiality (2px gaps, drift-table greys) | Wrap: verification.md, integration walk recorded, PR after the sign-up PR |

## Failed approaches

(none yet)

## Escalations

- **Serif version drift (design-system, unfixable in-app).** The canvas embeds *Source Serif Pro* faces; the app loads *Source Serif 4*, Google Fonts' current release of the same family. At the 26px h1 the string measures 16px wider in the app. Sharing the app's serif with the canvas cannot close this (the canvas's own faces win). Accept, or re-export the canvas against Source Serif 4.
- **Link underlines.** "Need an account?" and "Start your case" are underlined in the build (sign-up underlines its "Sign in" and legal links the same way); the canvas shows none. Deliberate affordance — a critic can always pick the build on it. User call whether both screens drop underlines in favour of weight-only cues.
- **Checkbox size across the pair.** Sign-in now uses a 14px box (canvas native size) with a 44px row target; sign-up still has the 22px custom box from its round 4. Align sign-up when its PR is next touched.

## Boundaries remaining

Rounds: 4/4 · Wall-clock: ~40 min · Same-gap-twice: 0/2
