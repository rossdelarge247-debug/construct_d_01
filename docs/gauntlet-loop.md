# Gauntlet loop — how Decouple runs it

The method is Matt Shumer's (X, July 2026: one prompt, a lead that splits the goal, a builder and a fresh-context critic per piece, a blind pick against a real reference, loop until the work wins). This file records the rules we keep verbatim, the deviations we have earned with evidence, and the mechanics a new loop card copies. A loop card (`docs/slices/S-PROTO-<slug>/acceptance.md`) cites this file instead of re-deriving the shape from a handoff.

## Shumer's rules, kept as written

1. **The bar is a real thing.** It must be *Named* ("a specific thing, not a category"), *Fetchable* ("the critic can screenshot it, read it, run it, or open it") and *Comparable* ("both can sit side by side and a judge can pick one"). A vague bar is the leading failure: "the critic invents a comparison and approves everything."
2. **The critic is separate and fresh.** "The critic is a separate agent with fresh context." It "puts your work next to the bar with the labels stripped, and it says which one is better. Not a score out of 10, which drifts upward every round. A pick."
3. **Never soften the bar.** A gap the builder cannot close honestly is escalated, not approximated.
4. **The human is the brake.** "The loop will not finish on its own."

Our bar is the decoded Claude Design canvas: `docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2 - Standalone.html`, one `window.M_*` component per screen, mounted bare at 402×874 by `tests/e2e/helpers/canvas-capture.ts`. Named, fetchable, comparable.

## Deviations, with the evidence that earned them

**D1 — exit on materiality, not on winning.** Shumer: "The loop exits when your work wins the blind comparison, or when you stop the run. Never after a fixed number of rounds." In runs 1 (sign-up, session 125) and 2 (sign-in, session 126) the reference won every blind pick, eight of eight. For a port of a canvas that contains deliberate differences (a product decision removed two buttons; links carry an accessibility underline; the canvas fakes a filled password) the win condition is unreachable, and the same is true of any port whose fonts differ by release. So the loop exits when **every reason the critic states is either deliberate (listed in the card) or below materiality (about 3px, or no visible weight or colour step)**, or at the card's round cap. The cap exists because the human is the brake and the human is not always watching; run 2 stopped at 4/4 with the last material finding a 2px corner radius.

**D2 — verifier bars beside the critic.** Some packagings of the prompt say "no capture suites, state machines, or scoring scaffolding." Run 1 showed why we keep them: no critic caught the 3.54:1 error-text contrast or the missing `aria-describedby`; axe and the behaviour bar did. And no bar caught the 22px checkbox, the 6px wordmark joint or the near-circular radius; the critics did. Games can live on a critic's eye. A product for people in crisis has an accessibility floor that must be a test. Every card therefore carries: a behaviour + a11y bar (`tests/e2e/<slug>.journey.e2e.ts`, axe at load and after an invalid submit), a visual bar (`tests/e2e/<slug>.visual-bar.e2e.ts`), and the unit suite plus lint, typecheck and production build as the floor. Playwright is not in CI, so the unit test is what CI runs.

**D3 — one builder per coupled screen.** Shumer fans the goal out into "the smallest pieces that can be improved separately," each with its own builder and critic. A screen is one coupled piece; fanning its fields out to separate builders produced nothing in run 1 but merge friction. One builder owns a screen; fan-out is for independent screens.

**D4 — the brief enumerates the deliberate deltas.** Shumer's critic assumes the work is meant to be identical to the bar. Ours is not, and twice in run 2 the critic's "strongest reason" was a difference it had been told to ignore. The critic prompt must list every deliberate delta from the card and instruct the critic to judge the shared region only; a pick reason that names a listed delta is recorded, not acted on.

**D5 — escalate design-system gaps, never inline a value.** If the largest gap traces to a colour, face or metric the token system lacks, the builder records it in `progress.md` §Escalations and the round ends; tokens are added only after the user resolves it. Run 1 raised five such escalations; session 126 found two of them were misreadings (verify a "font X not loaded" claim against `document.fonts`, a "colour is Y" claim against the decoded canvas) and turned the rest into six parity-tested tokens.

## Mechanics a card copies

- **Card** (`acceptance.md`, Template 2): OBJECTIVE · INPUTS AND STATE (canvas line refs, reuse, placeholder data, registry row, drift table) · METRIC / VERIFIER (the four bars above) · PROCESS (round shape, critics, drift rule) · BOUNDARIES (allowed paths, forbidden actions, stop rules with a round cap) · Out of scope · Status. `**Category:**` and `**Journey:**` fields as any prototype slice.
- **Ledger** (`progress.md`): one row per round (change · verifier evidence · critic's largest gap · next action), §Failed approaches, §Escalations, §Boundaries remaining. It is the durable state; chat history is not.
- **Final record** (`verification.md`): the four verifiers at ship, the integration walk, the spec 72a six-dimension table, architectural deferrals.
- **Round shape:** inspect → take the critic's largest supported gap → one coherent change → run bars 1, 2 and 4 → capture 3 → blind pick → one commit per round with the evidence in the message. Stage and commit as separate commands: the commit gate reads the index before the command runs, and a CSS-module or registry change needs a `tests/` change beside it (constraint #47).
- **Blind pick:** copy the two captures to neutral names under the scratchpad, randomise which is A, keep the key in a file the critic is told not to open, brief the critic with the deliberate deltas, ask for a pick with confidence, the single strongest reason, and up to four further differences each rated material or minor with a pixel estimate. Have it confirm the rendered side is real DOM (resize, tab, computed font) at least once per run.
- **Measure, don't eyeball.** Ink-band analysis of the two PNGs (PIL, threshold 140) gives element-by-element vertical positions and extents; use it to confirm or refute a critic before changing anything. `document.fonts` "loaded" and `fonts.ready` do not prove a face is applied.
- **Budget shape for one person:** one fresh blind critic per round on a smaller model; the design-system critic (no hex, tokens only) and the interaction critic (the bars) run by hand; an integration walk at the end. Run 1's full fan-out cost about 32 live agents and 3.4M subagent tokens; run 2's shape cost three agents and about 285k for the same bar.

## Git state, recovery and promotion

A later variant of the loop (viborc.com, "Building apps with an autonomous Gauntlet Loop", read only through second-hand summaries from this sandbox) adds Git as the state store, a task ledger for the next job, branch boundaries, crash recovery and a promotion workflow with a human before production. Ours maps onto it as follows.

- **State:** one commit per round; the ledger is `progress.md`. Already in place.
- **Branch boundary:** the card forbids pushing to `main`; work lives on the session branch. Already in place.
- **Recovery:** on resuming a loop (a killed agent, a rate limit, a new session) re-read `progress.md`, re-run all four bars against the current head, and treat the last critic report as stale until a fresh pick is taken. Run 1 lost a round to agents dying on the rate limit and produced a false "bar met"; this rule is the fix.
- **Promotion:** PR to `main` with the slice's `verification.md` in the body, CI, the 3-specialist auto-review, and the user's Vercel preview review before merge. The human gate is the user's review, not the loop's own verdict.
- **Not adopted:** autonomous continuation from one screen to the next. Both runs needed a product decision before the bar could be set (decision A: password over magic-link; decision B: no Google or passkey on sign-in). Those are human steps by design.

## Status

Written session 126 after two runs. Run 1: sign-up, session 125, 4 rounds, full fan-out. Run 2: sign-in, session 126, 4 rounds, solo-budget shape. Sources: Shumer's post on X (July 2026) and the GitHub packagings that quote it (robonuggets/gauntlet-loop, duolahypercho/gauntlet-loop, TheLakeMan/gauntlet-prompts); the viborc article was egress-blocked and is summarised from search results.
