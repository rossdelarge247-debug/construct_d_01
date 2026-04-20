# Claude Code — Decouple

## Product positioning (preserve this across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. It is NOT a financial disclosure tool. Not a better Form E. It is a divorce process disrupter aiming to replace the £14,561-average-cost solicitor-led journey with a £800-1,100 consumer-first, bank-evidenced, collaborative alternative, end-to-end.

**Unique claim:** The only place where both parties build one evidence-backed, shared picture of their complete settlement — finances, children, housing, future needs — negotiate proposals on it, and generate legally binding documents from their agreement.

**Three positioning pillars (spec 42):**
- Shared, not adversarial
- Evidenced, not asserted
- End-to-end, not hand-off

**Tagline:** "Decouple — the complete picture."

When drafting any user-facing copy, engine messaging, or session output: never frame Decouple as "a financial disclosure tool." The complete settlement workspace framing is load-bearing — it shapes scope, tone, and what the product promises to do. Spec 42 is the authoritative source.

## North star (quality bar)

The experience should feel like having a brilliant, patient analyst sitting beside you through the whole separation — finances, children, housing, future needs. They come back saying: "Here's what I found. Your salary is £3,218/month from ACME Ltd. You've got a mortgage at £1,150/month to Halifax. Amelia and Jack are with you during the week. Here's the picture taking shape." They do the heavy lifting. You confirm, correct, or fill gaps. In 15 minutes, not 15 hours.

**Quality bar:** This should feel like it was built in 2026. No shortcuts, no MVPs. The users are stressed, often alone, often late at night. Every interaction must be compassionate, professional, and empowering.

## Session startup (do this FIRST)

1. **Fetch and checkout the development branch:**
   ```
   git fetch origin claude/new-session-GUZLb
   git checkout claude/new-session-GUZLb
   ```

2. **Read `docs/SESSION-CONTEXT.md`** — this is the rolling context block. It contains: product vision, principles, what the last session accomplished, current state of the codebase, prioritised deliverables for this session, negative constraints (things NOT to do), and key file paths. Always read this before doing anything else.

3. **Confirm with the user** what they'd like to focus on. The SESSION-CONTEXT.md has suggested deliverables but the user may have different priorities.

## Session discipline

### Track your progress actively

- After every file edit, maintain a **running count of net lines added/modified**.
- Use the TodoWrite tool to track tasks. Mark each done as you complete it.
- At **~1,500 lines changed**, proactively tell the user: "Approaching session scope limit (~1,500 lines). Recommend wrapping up soon."
- At **~2,000 lines changed**, **stop writing code**. Tell the user you need to wrap up.

### Context window freshness

- Keep responses concise. Don't repeat large blocks of code back to the user.
- When context is getting long, summarise what you've done so far rather than re-reading files you've already read.
- If you notice the conversation is very long, proactively suggest: "We've covered a lot of ground. Want me to generate the handoff and start a fresh session?"

### Wrapping up a session

When the session is ending (user says wrap up, or you hit ~2,000 lines), do these in order:

1. **Commit and push** all uncommitted work
2. **Update `docs/SESSION-CONTEXT.md`** — rewrite it for the NEXT session:
   - What was accomplished this session (brief)
   - Current state of the codebase
   - Prioritised deliverables for next session
   - Any new negative constraints discovered
   - Updated key files list
3. **Write `docs/HANDOFF-SESSION-{N}.md`** — detailed retro:
   - What happened (with specifics)
   - What went well / what could improve
   - Key decisions made
   - Bugs found and how they were fixed
4. **Update this file (`CLAUDE.md`)** if the branch name, key files, or rules changed
5. **Commit and push** the handoff docs

## Branch

Development branch: `claude/decouple-v2-financial-disclosure-azVFf` (session 18 — signal rules expansion, workbench analytics, spec 31)

## Deployment

Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.
Tink credentials (`TINK_CLIENT_ID`, `TINK_CLIENT_SECRET`) must be set in Vercel env vars.
Tink Console must whitelist `https://construct-dev.vercel.app/api/bank/callback` as redirect URI.

## Key files

```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-18.md                 — Most recent session retro
docs/HANDOFF-SESSION-17.md                 — Previous session retro
docs/workspace-spec/28-v1-public-site-overhaul.md — V1 overhaul spec (tier model, visual, interview)
docs/workspace-spec/29-v2-personalisation-opportunities.md — V2 personalisation backlog
docs/workspace-spec/27-visual-direction-session11.md — Visual direction (Airbnb/Emma/Habito)
docs/workspace-spec/24-wireframe-spec-part1.md — Wireframes: carousel, task list, bank connection, reveal
docs/workspace-spec/25-wireframe-spec-part2.md — Wireframes: confirmation flow, summaries, financial hub
docs/workspace-spec/26-transitions-animations.md — Every transition, animation, and micro-interaction
docs/workspace-spec/22-confirmation-flow-tree.md — Complete decision tree for all Form E sections
docs/workspace-spec/23-post-confirm-gap-summary.md — What's proved vs gaps after bank connect
src/components/workspace/welcome-carousel.tsx  — Carousel (screens 1a-1c)
src/components/workspace/task-list-home.tsx     — Task list home (screen 2a)
src/components/workspace/bank-connection-flow.tsx — Bank connection + TinkModal + reveal (screens 3-3e)
src/components/workspace/confirmation-flow.tsx  — Confirmation Q&A (screens 2b-2i)
src/components/workspace/section-mini-summary.tsx — Per-section summaries (screens 2d-a/b/c)
src/components/workspace/progress-stepper.tsx   — Progress bar
src/components/workspace/spending-fork.tsx      — S1a: now vs estimates fork
src/components/workspace/spending-estimates.tsx — S1b/S1c-1: estimates form + summary
src/components/workspace/spending-search.tsx    — S2d: transaction search with typeahead
src/components/workspace/spending-categorise.tsx — S2a-S2f: per-category confirmation loop
src/components/workspace/spending-flow.tsx      — Thin orchestrator + S1c-2 full summary
src/components/workspace/financial-summary-page.tsx — Financial summary with spending card (screen 3a)
src/lib/bank/bank-data-utils.ts               — Extraction → UI types + demo factory + transaction search
src/lib/bank/confirmation-questions.ts         — Spec 22 question + summary generation
src/lib/bank/test-scenarios.ts                — 5 synthetic test scenarios (session 16)
src/app/workspace/engine-workbench/page.tsx   — Engine workbench dev page (session 16)
src/app/workspace/page.tsx                     — Flow state machine orchestrator
src/app/api/bank/connect/route.ts              — Tink Link auth + URL generation
src/app/api/bank/callback/route.ts             — Tink callback (iframe postMessage + redirect)
src/lib/bank/tink-client.ts                    — Tink API client
src/lib/bank/tink-transformer.ts               — Tink → BankStatementExtraction
src/lib/ai/result-transformer.ts               — Spec 13 decision trees + spec 19 keyword lookup
src/lib/ai/extraction-schemas.ts               — Structured output schemas (facts only)
src/types/hub.ts                               — All types (workspace types at top, legacy below)
src/app/globals.css                            — Animations + prefers-reduced-motion
docs/workspace-spec/13-extraction-decision-tree-documents.md — Decision trees per document type
```

## Information tiers — what to read and when

- **Tier 1 (always loaded):** This file. North star, rules, startup checklist.
- **Tier 2 (read at session start):** `docs/SESSION-CONTEXT.md` — current state and priorities.
- **Tier 3 (read when building a feature):** `docs/workspace-spec/{N}-*.md` — only the spec relevant to the current task. Don't read all specs.
- **Tier 4 (reference only, don't read proactively):** `docs/HANDOFF-SESSION-*.md`, `docs/v2/v2-backlog.md`, `docs/v2/v2-desk-research-*.md`. Consult these only if you need historical context or are planning a large piece of work.

The backlog lives at `docs/v2/v2-backlog.md` (98 items, prioritised). Don't read it every session — but consult it before proposing new work to check it's not already planned or deprioritised.

## Technical rules

- **Diagnose before fixing** — read logs/errors before changing code. Don't guess.
- **Design before code** — check `docs/workspace-spec/` for a spec before building a feature
- **AI extracts facts, app generates questions** — never put reasoning, clarification questions, or gap analysis in AI extraction schemas. The result-transformer.ts generates these using spec 13 decision trees.
- **Anthropic SDK uses `output_config.format`** — NOT `response_format` (that's OpenAI's API)
- **All JSON schema objects need `additionalProperties: false`** — Anthropic structured outputs require this
- **SDK timeout: 90s per call. Route maxDuration: 300s** — real PDFs need this headroom. Don't reduce.
- **Do not reference pre-pivot specs (03-06, 11, 12)** — the architecture changed. Active specs are 13-26.
- **Wireframes are definitive** — implement screens 1a–3a and 2a–2j exactly as wireframed in specs 24-25. Do not reinterpret or simplify. When in doubt, re-read the spec or ask the user to reshare the wireframe.
- **Transitions and animations are specced** — see spec 26. Every state change must have the specified animation. Provide `prefers-reduced-motion` fallbacks.

## Visual direction

- **Colour palette & minimalism:** Airbnb — clean, white-forward, generous spacing, restrained colour use
- **Forms & IxD approach:** Emma app — the interaction patterns, radio groups, progressive disclosure, card layouts. NOT Emma's colour palette.
- **Spec 18 is partially superseded** — tokens (spacing, typography, shadows) still valid. The colour palette and component designs will be updated in a visual design pass. Do not apply spec 18 colours to new components.

## Product rules

- **"A warm hand on a cold day"** — compassionate, professional, never patronising
- **Every question must map to a Form E field** — if the answer doesn't fill a disclosure value, don't ask it
- **One thing at a time** — one question per screen, one decision per moment
- **Connect-first, confirm-by-exception** — bank data does 70%, user confirms the rest, uploads 3-4 specific gap documents
- **Show, don't ask** — never ask a cold-start question when a bank signal exists. Show what was found, ask for confirmation.
- **Delight matters** — transitions, animations, and micro-interactions are not optional. See spec 26.
