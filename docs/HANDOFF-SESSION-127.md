# Handoff — Session 127

**What a user can now do:** sign up with a native-scale terms checkbox matching sign-in; see Source Serif 4 on the pre-signup help rails instead of the fallback serif. Nothing new is functional; the session's real output is the change of working mode.

**Decisions taken (user):** serif drift accepted, no canvas re-export · link underlines kept · sign-up checkbox aligned to 14px · Gauntlet experiment closed · repo enters product mode · Claude Design canvases are reference, not bar · no more specs; one-line decisions instead.

**Product mode shipped:** `CLAUDE.md` cut from 523 to ~90 lines (old file archived verbatim at `docs/archive/CLAUDE-rigour-mode.md`) · ten workflows parked to `.github/workflows-parked/` (auto-review, canvas-decode, coverage-threshold, eslint-no-disable, fitness-functions, persona-fixtures, persona-synthetic-fixtures, pr-dod, shellspec, spec-citation-quote) · hooks reduced to session-start, line-count, read-cap · PR template cut to four headings · SESSION-CONTEXT rewritten around one journey.

**Why:** after 127 sessions, ~40k lines of product code against ~60k of specs, slice docs and handoffs; two loop-built screens took three sessions and the reference won every blind pick. The critics and bars found real defects (contrast, aria-describedby, the serif token naming an unregistered face) but the loop shape did not pay. Details in the session-127 conversation and `docs/gauntlet-loop.md`.

**What broke:** `npm ci` from main's lockfile omitted Playwright (it lives only on the 125 branch's lockfile); reinstalled from the branch. The line-count hook counts the whole branch diff, so its STOP fired on inherited churn.

**Stepper decision (user):** the sign-up stepper stays; "About you" is the post-signup profiling already built (Moment 1/2), and "Pay" is designed when the journey reaches it.

**Next:** merge the PR from `claude/session-127-kickoff-doy9pk`; then session 128 builds "a user can connect the Tink sandbox bank from the welcome tour and see their real transactions on Your Picture."
