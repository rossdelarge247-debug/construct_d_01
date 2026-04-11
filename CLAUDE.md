# Claude Code — Decouple

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

Development branch: `claude/new-session-GUZLb`

## Key files

```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-5.md                  — Most recent session retro
docs/workspace-spec/19-intelligent-categorisation.md — Next feature spec (keyword lookup, aggregation)
docs/workspace-spec/13-extraction-decision-tree-documents.md — Decision trees per document type
docs/workspace-spec/18-visual-design-system.md — Visual spec
src/lib/ai/pipeline.ts                     — Two-step AI extraction (Haiku→Sonnet)
src/lib/ai/result-transformer.ts           — Spec 13 decision trees + financial items
src/lib/ai/extraction-schemas.ts           — Structured output schemas (facts only)
src/lib/ai/extraction-prompts.ts           — Document-type-specific prompts
src/hooks/use-hub.ts                       — Hub state, hero panel, item management
src/components/hub/hero-panel.tsx           — 8-state hero panel UI
src/app/api/documents/extract/route.ts     — Upload API, 300s maxDuration
src/app/api/test-pipeline/route.ts         — Isolation test for pipeline steps
docs/README.md                             — Full documentation index
```

## Technical rules

- **Diagnose before fixing** — read logs/errors before changing code. Don't guess.
- **Design before code** — check `docs/workspace-spec/` for a spec before building a feature
- **AI extracts facts, app generates questions** — never put reasoning, clarification questions, or gap analysis in AI extraction schemas. The result-transformer.ts generates these using spec 13 decision trees.
- **Anthropic SDK uses `output_config.format`** — NOT `response_format` (that's OpenAI's API)
- **All JSON schema objects need `additionalProperties: false`** — Anthropic structured outputs require this
- **SDK timeout: 90s per call. Route maxDuration: 300s** — real PDFs need this headroom. Don't reduce.
- **Do not reference pre-pivot specs (03-06, 11, 12)** — the architecture changed. Active specs are 13-19.

## Product rules

- **"A warm hand on a cold day"** — compassionate, professional, never patronising
- **Every question must map to a Form E field** — if the answer doesn't fill a disclosure value, don't ask it
- **One thing at a time** — one question per screen, one decision per moment
- **Upload-first, review-by-exception** — AI does 90%, user confirms 10%
