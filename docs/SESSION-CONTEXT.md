# Session 127 Context Block

## Session 126 accomplishments

Main tip is `2e35ca3`. Two branches carry the work, stacked: `claude/trusting-brahmagupta-uFE21` (session 125, sign-up; PR held until the user reviews the Vercel preview) and `claude/session-126-kickoff-iioj8m` on top of it (this session; 5 commits, pushed).

| Deliverable | Where |
|---|---|
| S-F1 token extension: `--ds-color-accent-brand` (canvas ACCENT teal), `--ds-color-ai` / `-text` / `-soft` / `-border` (canvas AI_PURPLE family), `--ds-color-danger-text`; `--ds-font-serif` → `'Source Serif 4'`, the face next/font registers (every serif heading was Georgia); parity test at 100 entries with CSS↔TS value assertions; `sign-up.module.css` off its phase-colour stand-ins and `color-mix()` | `fd3a4ea`; `docs/slices/S-F1-design-tokens/verification.md` §Extensions |
| Two session-125 escalations closed as non-defects: Inter 500–800 were always registered; the canvas Wordmark dot is teal, not purple | `docs/slices/S-PROTO-sign-up/progress.md` §Resolved |
| User decisions: keep the "Read the Terms…" line; two stacked PRs; sign-up PR held for preview review; sign-in = password + Forgot? only (decision B, spec 65a §Status) | spec 65a; this file |
| S-PROTO-sign-in loop run 2: bars first, `tests/e2e/helpers/canvas-capture.ts` extracted from run 1, screen built from canvas `M_SignIn`, 4 rounds with a fresh blind critic per round, loop stopped at the boundary with every remaining pick reason deliberate or below materiality | `da16a76` → `42175f3`; `docs/slices/S-PROTO-sign-in/{acceptance,progress,verification}.md` |
| Registry `sign-in` → `prototype-built`; journey-sequence #8 DONE | `src/app/dev/proto/registry.ts`, `docs/journey-sequence.md` |
| `docs/gauntlet-loop.md`: Shumer's rules kept verbatim, five earned deviations (materiality exit, verifier bars, one builder per screen, delta-briefed critic, escalation), card/ledger mechanics, recovery + promotion mapped from the viborc variant; both loop cards cite it | `908fd6e` |

Floor at wrap: vitest 139 files / 1065 tests; lint 0 errors; tsc clean; production build green under CI env with no dev server; Playwright 20/20 across both screens' bars.

## Current state

- `main` @ `2e35ca3`. `claude/trusting-brahmagupta-uFE21` @ `db162dc` (12 ahead of main, no PR). `claude/session-126-kickoff-iioj8m` @ `42175f3` (17 ahead of main, 5 ahead of the 125 branch, no PR).
- Sign-up and sign-in are built and wired both ways; sign-in hands off to post-connect-dashboard. Both share the canvas TopBar; the dashboard uses ProtoHeader (P2 below).
- Known, deliberate deviations from the sign-in canvas: no Google/passkey buttons or divider (decision B); text links underlined; password is an empty placeholder, not the canvas's faked filled value; heading string 16px wider because the canvas embeds Source Serif Pro while the app loads Source Serif 4.
- Sign-up still has its 22px custom checkbox; sign-in uses a 14px native-size box in a 44px row. Align when sign-up is next touched.
- Pre-signup rail components (`rails/rail-constants.tsx`, `RailCoach.tsx`, `RailHuman.tsx`) hardcode `"Source Serif Pro"` inline and still render the fallback serif — same bug class as the token, not yet fixed.
- Your Picture leftovers from session 124 still hardcoded: children, home address/value, outgoings provider name.

## Prioritised deliverables for session 127

| # | Deliverable | Sequence note |
|---|---|---|
| P1 | **Open the PRs.** After the user confirms the Vercel preview of the 125 branch: open `claude/trusting-brahmagupta-uFE21` → main (body references `docs/slices/S-PROTO-sign-up/verification.md`); once merged, open `claude/session-126-kickoff-iioj8m` → main (body references `docs/slices/S-F1-design-tokens/verification.md` and `docs/slices/S-PROTO-sign-in/verification.md`). CI + 3-specialist auto-review is the post-loop gate for both. | — |
| P2 | **Nav consistency** from the user's new canvas: reconcile canvas TopBar (sign-up, sign-in) vs welcome-tour header vs ProtoHeader (moment-1-ack, dashboard); also the "Welcome back" → "Welcome" tonal repeat across sign-in → dashboard. | OFF-SEQUENCE because §1/§3 surface polish precedes the sequence's next slice `S-PROTO-section-confirm` (§6 Build) — carried from session 125 P4 at the user's request. |
| P3 | **Your Picture leftovers** — children model, property profiling, outgoings provider name. | OFF-SEQUENCE because scope-add-on from session 124, carried at the user's request. |
| P4 | **Pair-consistency fixes on sign-up** when its PR is next touched: 14px checkbox as sign-in; user decision on link underlines across both screens (weight-only cue would match the canvas). | — |
| P5 | **Pre-signup rails serif**: replace the three inline `"Source Serif Pro"` literals with `tokens.font.serif` so O-screens' rails render Source Serif 4. | — |

`S-PROTO-section-confirm` remains the next slice per CLAUDE.md §"Phase 3 sequence"; every row above that is not it carries its OFF-SEQUENCE note.

## Authoritative reading order at session 127 start

1. This file.
2. `docs/HANDOFF-SESSION-126.md` — §Bugs found and §What could improve at minimum.
3. `docs/gauntlet-loop.md` — the loop method; every new loop card cites it.
4. `docs/slices/S-PROTO-sign-in/progress.md` §Escalations (three user-facing design calls).
5. `tests/e2e/helpers/canvas-capture.ts` — the reusable capture for any `window.M_*` screen.

## Key files

```
Loop harness (sessions 125–126)
playwright.config.ts                                   — Chromium pinned to the sandbox build; :3000 app + :3100 canvas servers
tests/e2e/helpers/canvas-capture.ts                    — mountCanvasScreen / captureRendered: bare 402×874 captures, Inter shared with the canvas
tests/e2e/sign-up.{journey,visual-bar}.e2e.ts          — run 1 bars
tests/e2e/sign-in.{journey,visual-bar}.e2e.ts          — run 2 bars (axe before + after invalid submit; checkbox metrics)
docs/slices/S-PROTO-sign-in/{acceptance,progress,verification}.md — run 2 loop card, round log, final record
tests/unit/proto-sign-in/page.test.tsx                 — unit floor for sign-in

Auth surfaces
src/app/dev/proto/sign-up/{page.tsx,sign-up.module.css}
src/app/dev/proto/sign-in/{page.tsx,sign-in.module.css} — built from canvas M_SignIn (Standalone.html L3609–3666) under decision B

Design system
src/styles/tokens.ts · src/app/globals.css · tests/unit/styles/tokens.test.ts — 100 tokens; value assertions for the session-126 additions
docs/slices/S-F1-design-tokens/verification.md         — §Extensions landed after S-F1

Canvas
docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2 - Standalone.html
                                                        — screens are window.M_* globals (M_SignUp L3667, M_SignIn L3609); constants L1351-1353;
                                                          AI_PURPLE family L2265-2268; the canvas embeds its own Inter (28) + Source Serif Pro (12) faces
```

## Branch

`claude/session-126-kickoff-iioj8m` — stacked on `claude/trusting-brahmagupta-uFE21`; both pushed, neither has a PR (P1).

## Negative constraints

#1–#50 from prior sessions, plus:

- **#51** A background `Agent` dies silently to the account's session rate limit; the adversarial-review gate then has to be run by hand. Keep critic spawns to one lightweight agent per round and check `ReadNotifications` before assuming a result.
- **#52** After killing `next dev`, port 3000 can stay held; Playwright's `webServer` then falls through to 3001 and times out. Check `ss -ltnp | grep 300` before a Playwright run and restart clean.
- **#53** `document.fonts` status `loaded` and `fonts.ready` do not prove a face is applied. Measure ink bands from the capture PNGs. The mobile canvas embeds its own Inter and Source Serif Pro faces, so sharing app fonts with it only matters for families it lacks.
- **#54** Token font strings stay plain family lists (no `var()`): pre-signup components build inline `font:` shorthands from `tokens.font.*`, and jsdom drops the whole shorthand when the family carries `var()`.
- **#55** Escalations rot like kickoffs: verify "font X not loaded" / "colour is Y" claims against `document.fonts` and the decoded canvas before adding tokens for them.
