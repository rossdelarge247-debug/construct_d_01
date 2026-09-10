# Claude Code — Decouple

## What Decouple is

The **complete settlement workspace for separating couples**: finances, children, housing, future needs, through to consent order, court submission and post-order implementation. Not a financial disclosure tool, not a better Form E. It replaces the £14,561-average solicitor-led divorce with an £800–1,100 consumer-first, bank-evidenced, collaborative alternative, end to end. Three pillars: shared not adversarial · evidenced not asserted · end-to-end not hand-off. Tagline: "Decouple — the complete picture." Spec 42 is the authoritative positioning.

**North star.** It should feel like a brilliant, patient analyst sitting beside you: "Your salary is £3,218/month from ACME Ltd. Your mortgage is £1,150/month to Halifax. Amelia and Jack are with you during the week. Here's the picture taking shape." They do the heavy lifting; you confirm, correct or fill gaps. Users are stressed, often alone, often late at night. Every interaction is compassionate, professional and empowering.

## Product mode (from session 128)

After 127 sessions the repo held ~40k lines of product code and ~60k of specs, slice docs and handoffs, plus 11 hooks, 11 review personas and 13 workflows. Two loop-built screens cost three sessions. The process had become the product. Product mode is the correction; the rigour catalogue it replaces is archived verbatim at `docs/archive/CLAUDE-rigour-mode.md` and the parked workflows live in `.github/workflows-parked/`.

**Freeze.** Until a real person has used the product: no new hooks, personas, workflows, CI gates, CLAUDE.md rules, specs, loop cards or slice-doc templates. If a rule feels needed, write one line in `docs/SESSION-CONTEXT.md` §Lessons instead.

**Build vertically.** One journey a real user completes, on real data, before any breadth. The current journey is named in `docs/SESSION-CONTEXT.md`. Screens outside it wait.

**Definition of done per session:** a sentence of the form "a user can now … in the preview", verified by clicking it. Not an acceptance table.

**Floor, not gates.** CI runs lint, typecheck, unit tests, production build, secret scan and the two spec-72 scans. That is the whole floor. Review is one adversarial pass by the main session on the diff before commit. Subagents are for building independent pieces in parallel, never for review loops.

**Screens get one pass.** Claude Design canvases are reference, not bar: structure, tone, spacing, colour. Port with the five-step adapt (tokenise colours · replace placeholder data · wire state · add the Next.js wrapper · inline or adapt helpers), run the existing Playwright bars if the screen has them, fix what is visibly wrong, ship. No rounds, no blind picks, no ledgers. Polish happens once, against the whole journey, when the journey works.

**Decisions are the human's job.** When a build reaches a fork (auth model, which screen comes next, what a step means), ask with `AskUserQuestion`, record the answer in one line in SESSION-CONTEXT, and continue. Never invent product decisions and never write a spec to avoid asking.

**Docs per session:** update `docs/SESSION-CONTEXT.md` (under 60 lines) and write `docs/HANDOFF-SESSION-N.md` (under 25 lines: what a user can now do, decisions taken, what broke, next). Nothing else unless the user asks.

## Session startup

1. Verify the branch. `.claude/hooks/session-start.sh` prints branch state at turn 0; the canonical branch is in `docs/SESSION-CONTEXT.md` or the task description. Resync with `git fetch origin <branch> && git checkout -B <branch> origin/<branch>` if the harness landed elsewhere.
2. Read `docs/SESSION-CONTEXT.md`. Nothing else is required reading.
3. Run `npm ci` in a fresh container. Playwright bars need `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` unset and no dev server already on :3000.
4. Confirm the session's one outcome with the user, then build.

## Branch and deployment

Each session runs on its own branch (`claude/session-N-…`), named in SESSION-CONTEXT. Open a PR to `main` at wrap; the user merges after clicking the Vercel preview. Vercel deploys every branch; production is `construct-dev.vercel.app`. Tink credentials (`TINK_CLIENT_ID`, `TINK_CLIENT_SECRET`) are Vercel env vars and the callback `https://construct-dev.vercel.app/api/bank/callback` is whitelisted in the Tink console.

## Key files

```
docs/SESSION-CONTEXT.md                         — start here; journey, state, next outcome, lessons
docs/journey-sequence.md                        — every flow, its registry id and wiring state
src/app/dev/proto/registry.ts                   — prototype screen registry (ids, status, routes)
src/app/dev/proto/<slug>/                       — one folder per screen
src/styles/tokens.ts · src/app/globals.css      — design tokens (100; CSS↔TS parity test)
src/lib/bank/                                   — Tink client, transformer, signal rules, scenarios
src/lib/ai/                                     — extraction schemas, result transformer
src/app/api/bank/{connect,callback}/route.ts    — Tink Link + callback
tests/e2e/helpers/canvas-capture.ts             — Playwright capture of any window.M_* canvas screen
docs/design-source/<slug>/decoded/*.html        — decoded Claude Design canvases (reference)
docs/workspace-spec/                            — specs; 42 positioning · 65/65b interview · 67 post-signup · 68b build phase
docs/archive/CLAUDE-rigour-mode.md              — the pre-128 rulebook, for reference only
```

## Technical rules

- Diagnose before fixing: read the error, the log, the live DOM. Don't guess. `document.fonts` "loaded" does not prove a face is applied; measure.
- AI extracts facts, the app generates questions. Reasoning and gap analysis live in `result-transformer.ts`, never in extraction schemas.
- Anthropic SDK: `output_config.format`, not `response_format`; every JSON schema object carries `additionalProperties: false`; 90s SDK timeout, 300s route `maxDuration`.
- Token font strings are plain family lists, no `var()` (jsdom drops the shorthand).
- Pre-pivot specs 03–06, 11, 12 are dead. Don't cite them.
- Verify any stated repo fact (branch tips, PR state, "X is built") against git or the file before planning on it. Kickoffs rot.

## Coding conduct

Simplest code that solves the problem; no speculative abstraction, no unrequested features. Touch only what the task needs; mention adjacent problems, don't fix them unasked. Names carry the design. Effects (storage, network, time) sit behind interfaces so logic is testable without mocking the world. Tests where there is logic (engine, rules, transforms, routes); not for pure-visual UI. Comments say why, never what, and never carry session or PR provenance. Commit small and often on the session branch; push before ending.

## Product rules

- "A warm hand on a cold day": compassionate, professional, never patronising.
- Every question maps to a Form E field; if the answer fills nothing, don't ask it.
- One thing at a time: one question per screen, one decision per moment.
- Connect first, confirm by exception: bank data does 70%, the user confirms the rest.
- Show, don't ask: never cold-start a question when a bank signal exists.
- Delight matters: transitions and micro-interactions are specified in spec 26, with `prefers-reduced-motion` fallbacks.
