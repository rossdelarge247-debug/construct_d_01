# Session 126 Context Block

## Session 125 accomplishments

First session after a ~3-month pause. Main tip is `2e35ca3` (PR #231 merged). Work since lives on `claude/trusting-brahmagupta-uFE21`, unmerged — the user reviews the Vercel preview before a PR opens.

| Deliverable | Where |
|---|---|
| PR deck cleared: #231 merged (CI fixes + npm audit + wordmark + preflight fix); #139/#140/#141/#160 closed | main `2e35ca3` |
| `WORDMARK = 'Decouple.'` constant; every nav/brand mark uses it (ProtoHeader, BrandBar, marketing-landing, welcome-tour, your-picture breadcrumb) | `src/constants/index.ts`, `b874915` |
| Next 16 agent-rules block redirected to `AGENTS.md` (generator verified to skip CLAUDE.md) | `aa4cfda` |
| Gauntlet-loop harness: Playwright config, behaviour+a11y bar, bare visual-bar capture, Template-2 loop card, progress log | `playwright.config.ts`, `tests/e2e/`, `docs/slices/S-PROTO-sign-up/` |
| Sign-up screen built by the loop from canvas `#m-signup` — 3 rounds + a majors-targeted round 4; all bars green; production build verified under CI conditions | `src/app/dev/proto/sign-up/`, `tests/unit/proto-sign-up/page.test.tsx` |
| Doc drift fixed: registry `spec:` path, journey-sequence #9, spec 65a §Status records decision A (password per canvas) | `fbd80c3`, `78a9a84` |

Round-4 outcome: the majors-targeted round cut critic majors 18 → 11 (per-field errors with `aria-describedby`, first-invalid focus, all problems at once, 44px terms row, links to the sign-in and legal stubs; `8f7a82f`). The blind critic still identifies the implementation; its one material gap is a "Read the Terms and Privacy Policy." line beneath the button that the canvas lacks — added so the legal links live outside the checkbox label. `docs/slices/S-PROTO-sign-up/verification.md` written; production build verified under CI conditions.

## Current state

- `main` @ `2e35ca3`. Branch `claude/trusting-brahmagupta-uFE21` ahead by the commits above; **no PR yet**.
- Sign-up: prototype-built, wired O8 → sign-up → welcome-tour. Sign-in, magic-link-sent, desktop variants out of scope.
- Design-system escalations open (see P1). Top-bar treatment differs across sign-up / welcome-tour / moment-1-ack (see P4).
- Your Picture leftovers from session 124 still hardcoded: children (Emma/Jake), home address/value, outgoings "confirmed" provider name.
- Loop harness is reusable: the visual bar's canvas capture mounts any `window.M_*` screen component standalone; bars live in `tests/e2e/*.e2e.ts` (named so vitest ignores them).

## Prioritised deliverables for session 126

1. **P1: Design-system tokens slice.** Add parity-tested tokens (`tokens.ts` + `globals.css` + `tests/unit/styles/tokens.test.ts`) for: brand accent teal `#2F6D5F` (canvas `ACCENT`; sign-up currently borrows `--ds-color-phase-finalise`), AI trust-card family `#4C3FB8 / #F5F3FF / #E4DEFD` (currently `phase-build` + `accent-violet` + a `color-mix()` border), a text-safe danger colour (alert uses `color-mix` on `--ds-color-danger`), and fix `--ds-font-serif` to the family next/font actually loads (`Source Serif 4` — today every serif heading is Georgia) and Inter weights beyond 400. Then re-point `sign-up.module.css`. Note the TDD-guard parity chicken-and-egg from HANDOFF-124: update the parity test, CSS and TS in one coherent step.
2. **P2: Open the PR** for `claude/trusting-brahmagupta-uFE21` → main once the user has reviewed the preview. CI + 3-specialist auto-review is the post-loop gate. PR body must reference `docs/slices/S-PROTO-sign-up/verification.md` (`pr-dod.yml` checks for it). Journey-sequence row #7 is already DONE on the branch. Settle the round-4 residue first: the "Read the Terms and Privacy Policy." line beneath the button — keep it (a11y-safe legal links) or restyle to the canvas; and check the canvas `Wordmark` (decoded L1370–1376) for the dot's real colour — the round-4 critic saw purple, the drift table assumed the teal `ACCENT`.
3. **P3: Sign-in as loop run 2.** Canvas `#m-signin` (`window.M_SignIn`, decoded L3609). Its canvas carries "Continue with Google" and "Sign in with passkey" affordances that decision A removed from sign-up — decide consistency before setting the bar. Reuse the harness; write the bars first; include the unit suite in the floor; count majors in the stop rule from round 1.
4. **P4: Nav consistency** — the user is producing a new canvas; reconcile top-bar treatment (ProtoHeader vs sign-up TopBar vs welcome-tour header) from it, then apply across logged-in surfaces.
5. **P5:** Your Picture hardcoded sections (children model, property profiling, provider name) — carried from session 124.

## Authoritative reading order at session 126 start

1. This file.
2. `docs/HANDOFF-SESSION-125.md` (retro — long; read §Bugs and §What could improve at minimum).
3. `docs/slices/S-PROTO-sign-up/acceptance.md` + `progress.md` (the loop card and round log).
4. `tests/e2e/sign-up.visual-bar.e2e.ts` (how the canvas is captured — reuse for sign-in).

## Key files

```
Loop harness (session 125)
playwright.config.ts                                   — Chromium pinned to sandbox build; :3000 app + :3100 canvas servers
tests/e2e/sign-up.journey.e2e.ts                       — behaviour + a11y bar (Playwright + axe)
tests/e2e/sign-up.visual-bar.e2e.ts                    — bare 402×874 captures of canvas screen + app, fonts shared
docs/slices/S-PROTO-sign-up/acceptance.md              — Template-2 loop card (objective · metric · boundary) + drift table
docs/slices/S-PROTO-sign-up/progress.md                — round log + escalations
tests/unit/proto-sign-up/page.test.tsx                 — unit test (CI coverage; Playwright is not in CI)

Sign-up surface
src/app/dev/proto/sign-up/page.tsx                     — built from canvas M_SignUp; APP_NAME/WORDMARK; noValidate form
src/app/dev/proto/sign-up/sign-up.module.css           — tokens + var(--ds-*); phase-colour stand-ins pending P1

Canvas
docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2 - Standalone.html
                                                        — 7.4MB; screens are window.M_* globals (M_SignUp L3667, M_SignIn L3609);
                                                          constants L1351-1353; artboards render into [data-dc-slot]

Rules files
AGENTS.md                                              — hosts Next 16's managed agent-rules block (keeps CLAUDE.md clean)
```

## Branch

`claude/trusting-brahmagupta-uFE21` — PR pending user preview review.

## Negative constraints

#1–#42 from prior sessions, plus:

- **#43** Never pipe a long-running server through `head` or any bounded consumer — SIGPIPE kills it mid-run. Log to a file.
- **#44** `pkill -f <pattern>` must not appear literally in the invoking command line (use `[n]ext dev`); it will kill the calling shell.
- **#45** Playwright wipes `outputDir` on every run — never keep helper scripts or captures there (`tests/e2e/.bar/` is for captures and tools).
- **#46** Launch agent loops on a clean tree; a tidy builder will commit stray dirty docs into its round commit.
- **#47** Commit CSS-module and `registry.ts` changes with a `tests/` change alongside — the commit gate exempts only `.ts/.tsx` under a proto slug, and reads the index before the command runs.
- **#48** Don't run `next build` beside a running dev server in one checkout (`.next/types` vs `.next/dev/types` collide); the production build needs `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod`.
- **#49** A loop card's floor includes the unit suite; its stop rule counts majors, not only blocking findings.
- **#50** Comment-review's stub does not honour the `## Status` exemption — expect false positives on §Status lineage until the hook is fixed.
