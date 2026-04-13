# Claude Code — Decouple

## North star

The experience should feel like having a brilliant, patient financial analyst sitting beside you. You hand them your bank statements and they come back saying: "Here's what I found. Your salary is £3,218/month from ACME Ltd. You've got a mortgage at £1,150/month to Halifax. I noticed what looks like a pension contribution — is that right?" They do the heavy lifting. You confirm, correct, or fill gaps. In 15 minutes, not 15 hours.

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

Development branch: `claude/decouple-v2-workspace-fX7nK`

## Key files

```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-8.md                  — Most recent session retro
docs/workspace-spec/20-bank-first-journey.md   — Bank-first journey redesign
docs/workspace-spec/21-evidence-model.md       — Evidence model + gap analysis
docs/workspace-spec/22-confirmation-flow-tree.md — Complete decision tree for all Form E sections
docs/workspace-spec/23-post-confirm-gap-summary.md — What's proved vs gaps after bank connect
docs/workspace-spec/24-wireframe-spec-part1.md — Wireframes: carousel, task list, bank connection, reveal
docs/workspace-spec/25-wireframe-spec-part2.md — Wireframes: confirmation flow, summaries, financial hub
docs/workspace-spec/26-transitions-animations.md — Every transition, animation, and micro-interaction
src/lib/ai/pipeline.ts                     — Two-step AI extraction (Haiku→Sonnet)
src/lib/ai/result-transformer.ts           — Spec 13 decision trees + spec 19 keyword lookup
src/lib/ai/extraction-schemas.ts           — Structured output schemas (facts only)
src/lib/ai/extraction-prompts.ts           — Document-type-specific prompts
src/hooks/use-hub.ts                       — Hub state, hero panel, dedup, bank data pickup
src/components/hub/hero-panel.tsx           — 8-state hero panel, connect + upload
src/app/api/documents/extract/route.ts     — Upload API, 300s maxDuration, dry-run mock
src/lib/bank/tink-client.ts               — Tink Open Banking API client
src/lib/bank/tink-transformer.ts          — Tink → BankStatementExtraction
src/app/api/bank/connect/route.ts         — Generate Tink Link URL
src/app/api/bank/callback/route.ts        — Handle Tink redirect + transform
docs/workspace-spec/13-extraction-decision-tree-documents.md — Decision trees per document type
docs/workspace-spec/18-visual-design-system.md — Visual spec
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
