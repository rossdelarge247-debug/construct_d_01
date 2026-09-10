# Session 128 Context Block

## Mode

Product mode, per `CLAUDE.md` §"Product mode". Session 127 ended the Gauntlet experiment (two screens, three sessions, reference won 8/8 blind picks), archived the rigour rulebook to `docs/archive/CLAUDE-rigour-mode.md`, parked ten workflows to `.github/workflows-parked/`, unregistered every hook except session-start, line-count and read-cap, and cut the PR template to four headings. CI is now lint · typecheck · unit tests · build · gitleaks · the two spec-72 scans.

## The journey

**One user, one path, real data:** pre-signup interview → sign-up → welcome tour → connect a bank (Tink sandbox) → Your Picture built from the connected transactions → dashboard.

Every session's outcome is a sentence of the form "a user can now … in the preview" on this path. Screens outside it wait.

## State at session 127 wrap

- `main` @ `2e35ca3`. Session branch `claude/session-127-kickoff-doy9pk` carries sessions 125–127 (sign-up, sign-in, token extension, rails serif fix, product mode). PR to main opens at wrap; the user merges after the preview.
- Built and wired: interview (O1–O8) → sign-up → welcome-tour → moment-1-ack → moment-2-profiling → post-connect-dashboard. Sign-in → dashboard. All on static data past the interview.
- Real engine: Tink connect + callback routes, transformer, 17 signal rules, extraction schemas, result transformer, 5 synthetic scenarios, engine workbench at `/workspace/engine-workbench`.
- Gaps on the journey: the sign-up stepper's "About you" step is the post-signup profiling (Moment 1/2), per user decision at session 127; "Pay" has no screen yet and is designed when the journey reaches it; no bank-connect screen on the proto path; Your Picture is hardcoded (children, home address/value, outgoings provider name).

## Next outcome (session 128)

**"A user can connect the Tink sandbox bank from the welcome tour and see their real transactions on Your Picture."** Steps: wire welcome-tour exit → bank connect (reuse `api/bank/connect`) · callback lands on Your Picture · Your Picture reads the transformer output instead of literals. Ugly is fine; working is the bar.

## Decisions on record

- Sign-up is password, not magic link (decision A, spec 65a §Status). Sign-in is password + Forgot? only (decision B).
- Serif drift between the canvas (Source Serif Pro) and the app (Source Serif 4) is accepted. Link underlines stay. Checkboxes are 14px native-scale in a 44px row.
- Claude Design canvases are reference, not bar. No new canvases until the journey works.
- Sign-up keeps its Account · About you · Pay stepper; "About you" is the post-signup profiling already built, "Pay" is designed when the journey reaches it.

## Lessons (one line each; this replaces new rules)

- Kickoffs and escalations rot: verify branch tips, "X not loaded" and "colour is Y" against git, `document.fonts` and the decoded canvas first.
- `npm ci` on main's lockfile omits Playwright; install from the branch that has it.
- Port 3000 can stay held after killing `next dev`; check before a Playwright run.
- A background agent can die silently to the account rate limit; check `ReadNotifications` before trusting a result.
- The main branch check "npm audit (high + critical)" is already red on `2e35ca3`; it is not a PR's failure.

## Branch

`claude/session-127-kickoff-doy9pk` until merged; session 128 starts its own branch from `main`.
