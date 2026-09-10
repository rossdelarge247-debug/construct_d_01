# HANDOFF — Session 125

**Branch:** `claude/trusting-brahmagupta-uFE21` (ahead of `main` @ `2e35ca3`; PR deferred to session 126 after the user reviews the Vercel preview)
**Dates:** 2026-08-25 → 2026-09-09 (first session after a ~3-month pause; the kickoff was written on 2026-05-25)

## What happened

Four workstreams, in order.

### 1. Re-entry audit + clearing the PR deck

- Verified the kickoff against live state: main at `14951ef`, PR #231 open with 4 CI failures (lint `<a>`-for-pages in welcome-tour and your-picture, proto registry gate, fitness functions, slice-verification body gate), plus 10 high-severity npm audit CVEs disclosed during the break (undici, vite, ws, transitives).
- Fixed all four CI failures, applied `npm audit fix` (non-breaking; one moderate `@anthropic-ai/sdk` finding deferred — needs a major bump), added the `no-slice-required` label, and merged #231 as `2e35ca3` (squash). Closed stale PRs #139 (its one real fix — `preflight-review.sh` aggregate arg order — cherry-picked), #140, #141, #160.
- Added `WORDMARK = 'Decouple.'` beside `APP_NAME = 'Decouple'` (test-first: `tests/unit/constants/index.test.ts`); ProtoHeader, BrandBar, marketing-landing switched to it. Two more lowercase marks (welcome-tour glyph, your-picture breadcrumb) were only caught later by the loop's integration critic — see §Bugs.
- Session audit for the user: 64 registry rows (22 prototype-built, 7 shipped, 4 shell, 6 canvas-drafted, 12 spec-only, 13 not-started); 80 journey rows (30 DONE, 6 SHELL, 15 READY, 28 BLOCKED). Stage 4 onboarding complete; Reconcile/Settle/Finalise mostly spec and canvas.

### 2. Strategy conversation (recorded because it changed the plan)

The user, returning after the pause, described the design→code workflow as "a facsimile of a facsimile" (Claude Design → nearly right → React port → nearly right, all through the rigour suite) and asked whether to start again. The reframe that landed: the canvas is the highest-fidelity artefact and should be *the bar*, not something to re-describe in prose; validate flows with users on paper/Mural first; use the Gauntlet Loop (Matt Shumer, July 2026 — builder + fresh-context critics + a fetchable reference bar + blind comparison) for the code step. The user opted in to a bounded experiment on the Sign-up slice: brownfield (reuse tokens/WORDMARK/providers), password model per the canvas (decision A over spec 57 §1.2's magic link), outbound → welcome-tour, 6 rounds / ~60 min.

### 3. Harness + loop card (before any builder existed)

- `playwright.config.ts` (Chromium pinned to the sandbox's build 1194 — Playwright 1.63 wants 1243 and cannot download here; second `webServer` entry serves the decoded canvas over http on :3100 because the canvas app fetches a state-JSON sidecar that Chromium's CORS policy blocks on `file://`).
- `tests/e2e/sign-up.journey.e2e.ts` — behaviour + a11y bar (structure, validation → `role="alert"`, hand-off, tab order, no 375px overflow, zero serious/critical axe). RED 6/7 against the placeholder shell before the loop.
- `tests/e2e/sign-up.visual-bar.e2e.ts` — captures both sides **bare** at the canvas frame size 402×874: the canvas's `window.M_SignUp` mounted standalone (the editor draws every artboard inside a device bezel in a pan/zoom viewport — a blind-pick tell; the artboard `id` never reaches the DOM, slots are `[data-dc-slot]`), Tailwind CDN stubbed, the app's Inter served to the canvas via route stub with an assertion that Inter loaded on both sides, EnvBanner and Next's `nextjs-portal` dev indicator hidden.
- `docs/slices/S-PROTO-sign-up/acceptance.md` — Template-2 loop card (OBJECTIVE · INPUTS AND STATE · METRIC/VERIFIER · PROCESS · BOUNDARIES) with a drift table (canvas hex → nearest token) and the drift rule: never inline hex; escalate. `progress.md` as the durable round log.
- Next 16's `next dev` was found writing a managed agent-rules block into `CLAUDE.md`; hosting it in `AGENTS.md` makes the generator skip `CLAUDE.md` (verified by invoking `generate-agent-files.js` directly: `{"agentsMd":"unchanged","claudeMd":"skipped"}`).

### 4. The loop (Workflow tool, one builder + verifier + four critics + scribe per round, integration critic at the end)

| Round | Builder | Bars | Blind pick | Largest gap → next round |
|---|---|---|---|---|
| 1 | Screen built from `M_SignUp` (`8c865bf`, page.tsx only — see §Bugs) | green | critic spotted the implementation (minor) | after-submit alert text `#FF3B30` on white = 3.54:1 (axe serious; load-state scan misses it) |
| 2 | Alert contrast fixed via `color-mix` on `--ds-color-danger` (not committed by the builder — gate) | green | spotted (minor) | hard-coded `Decouple's` literal → `APP_NAME` (blocking, design-system critic) |
| 3 | `APP_NAME` in terms copy and wordmark (`c7b9a10`) | green | spotted (minor: "About you" step ~25px off-centre, fields ~3px taller) | 18 restated majors — never targeted (stop rule counted only blocking) |
| 4 | Stop rule changed so majors block "done"; the majors cluster fed as one coherent change. Builder delivered per-field errors with `aria-describedby`, focus to the first invalid field, all problems reported at once and cleared on fix, a 44px terms row, and "Have an account? Sign in" + Terms/Privacy linked to the `[slug]` stubs; unit test extended to 11 cases (`8f7a82f` — the gate passed because a `tests/` change shipped alongside) | green | spotted — **material**: a "Read the Terms and Privacy Policy." line beneath the button that the canvas lacks, the builder's a11y-safe home for the legal links outside the checkbox label | majors 18 → 11; stopped at the round boundary. Residue for session 126: that line (fidelity vs a11y — a design call), vertical rhythm, stepper centring; the canvas wordmark's full stop is purple, not the teal the drift table assumed |

The reference won the blind comparison in every round, as in Shumer's own runs; the loop's value was that fresh critics kept finding real defects the bars didn't encode. Integration critic (after round 3): journey walk passes end-to-end in real Chromium; registry row confirmed; wordmark inconsistency found (welcome-tour lowercase glyph — fixed by hand, `b874915`); top-bar treatments differ across sign-up / welcome-tour / moment-1-ack (deferred to the user's canvas).

**Escalations (design-system decisions, not builder fixes):** canvas brand-accent teal `#2F6D5F` has no token (builder used `--ds-color-phase-finalise` — Finalise-phase semantics on a pre-auth brand mark); the AI trust-card purples `#4C3FB8/#F5F3FF/#E4DEFD` have no tokens (builder mixed `phase-build`, `accent-violet` and a `color-mix()` border — a computed off-palette colour); cool canvas greys vs warm-stone tokens (SUB/MUTE/LINE); `--ds-font-serif` names `'Source Serif Pro'` while next/font loads `Source_Serif_4`, so every serif heading renders in Georgia; Inter is registered at weight 400 only (all bolds are synthesised). User decision: queue a tokens slice as session 126 P1.

**Cost:** run 1 — 15 agents, 1.39M subagent tokens, 63 min (3 agents died on the account session limit, which produced a false "bar met in round 2"); resume — 22 agents, 1.02M tokens, 42 min (the missing round-2 design-system critic turned the stop into a round 3); round 4 — 7 live agents (22 replayed from cache), 0.96M tokens, 38 min. Whole experiment: ≈32 live agents, ≈3.4M subagent tokens, ≈2.4 h of loop wall-clock, plus the harness work.

## What went well

- Verify-before-planning paid off repeatedly: the kickoff's "PR #231 shipped", the "65a-sign-up-reconciliation-logic.md" path in the registry (file is `65a-signup-orientation-reconciliation.md`), journey-sequence's "magic-link-sent has no spec" (spec 57 §1.2a exists), CLAUDE.md "citing 65a" (it doesn't) — all checked, three corrected.
- Authoring the bars before the builder existed made the loop honest; an independent verifier re-ran them every round rather than trusting the builder's summary.
- The drift rule worked exactly as designed: no hex was ever inlined; every colour gap became a recorded decision.
- Reading the actual artefact settled every mystery that theorising couldn't: the canvas DOM dump (no `#m-signup` in the DOM), the dead server's 42-line log, the generator's L99–110, the hook's index-timing.

## What could improve

- The card's floor omitted the unit suite (CI runs vitest, not Playwright): the retired placeholder test and the registry snapshot test were both red until fixed by hand (`78a9a84`). Now in the card.
- The stop rule counted only blocking findings; ~18 consistent majors (error not associated via `aria-describedby`, focus not moved after an invalid submit, 13px consent target, `next-route-announcer` hidden in CSS) never became the gap until round 4.
- Harness self-inflicted wounds cost ~45 minutes: piping `next dev` through `head -40` (SIGPIPE killed it mid-loop), a waiter that fell through to :3001, `pkill -f "next dev"` matching its own command line, helper scripts placed in Playwright's `outputDir` (wiped every run).
- Agent count and token spend were well above the "under 15 agents" guideline; the user opted in, but a cheaper shape (verifier + critics only every other round) would suit a solo budget.

## Key decisions

1. Sign-up follows the canvas (password) over spec 57 §1.2 (Google OAuth + magic link); recorded in spec 65a §Status; spec 57 source untouched per 65a's own rule. Magic-link-sent leaves the slice.
2. Sign-up hands off to welcome-tour (journey-sequence and the built chain) rather than Moment 1 (65a, pre-dates the welcome-tour port).
3. Experiment on the designated branch, not an `experiment/` branch; isolation comes from the builder's single ownership, not worktrees.
4. Both captures bare at 402×874 with fonts shared — the device bezel, dev banner, dev indicator and font-family were all tells that would have rigged the blind pick.
5. AGENTS.md hosts Next's agent-rules block; CLAUDE.md stays a human-authored file.
6. Stale PRs closed rather than rebased; #139's one code fix cherry-picked.

## Bugs found and how they were fixed

- Lint: `<a href>` to internal pages in welcome-tour (`Link`) and the your-picture footer placeholder links (`span`).
- 10 high-severity CVEs: `npm audit fix`, lockfile only.
- `tests/unit/constants` TS2582 (missing vitest imports) — import `describe/test/expect`.
- Playwright launch: pinned `executablePath` to `/opt/pw-browsers/chromium` (symlink to build 1194).
- Canvas never mounting over `file://`: CORS-blocked `fetch('.design-canvas.state.json')`; served over http.
- `#m-signup` never visible: not a DOM id; artboards render into `[data-dc-slot]` inside a bezel → standalone mount of `window.M_SignUp`.
- Round 1 left `sign-up.module.css` and the registry row uncommitted (`tdd-first-every-commit` blocks non-`.ts/.tsx` proto files and `registry.ts` without a `tests/` change; it reads the index *before* the Bash command runs, so a same-command `git add && git commit` slips past it — a gate flaw, reported not exploited). Fixed by committing with real tests: `tests/unit/proto-sign-up/page.test.tsx` replaced the placeholder `shell.test.tsx`; registry snapshot updated.
- Round 1's push refused by `pre-push-dod7` (page.tsx touched without `registry.ts` in the pushed range) — resolved by the same commit.
- `tsc` red after `npm run build`: `tsconfig` includes both `.next/types/**` and `.next/dev/types/**`; a dev server plus a build in one checkout yields two conflicting `LayoutRoutes`. Environmental; CI never has both. Production build needs `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` (CI sets it; `DECOUPLE_AUTH_MODE` is not the name).
- Comment-review stub flags "session N" inside `## Status` blocks despite CLAUDE.md's exemption — hook bug, unfixed.
- Wordmark: welcome-tour glyph and your-picture breadcrumb rendered lowercase `decouple` → `WORDMARK` (`b874915`).

## Critic findings recorded (loop personas, for the retain/drop habit)

| Critic | Caught something the bars and I missed? |
|---|---|
| visual (blind pick) | Yes — vertical rhythm and stepper centring; confirmed real DOM every round |
| interaction | Yes — `aria-describedby` absent, focus stays on the button, one error per submit |
| a11y + mobile | Yes — after-submit contrast (serious), `next-route-announcer` suppressed, 13px consent target |
| design-system | Yes — `Decouple's` literal, `color-mix()` as a palette bypass, phase-colour misuse |
| integration | Yes — welcome-tour lowercase wordmark; top-bar inconsistency |

## Next session

See `docs/SESSION-CONTEXT.md`. Short form: tokens slice (P1) · PR for this branch after the user reviews the preview (P2) · sign-in as run 2 (P3) · nav consistency from the user's canvas (P4).
