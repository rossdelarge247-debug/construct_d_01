# Claude Code — Decouple

## Start here

1. **Read `docs/SESSION-CONTEXT.md`** — this is the rolling context block with product vision, current state, what was done last, and what to do next. Always start by reading this file.

2. **Read `docs/HANDOFF-SESSION-5.md`** — the most recent session retro with technical details.

## Branch

All development happens on `claude/new-session-GUZLb`. If you're not on this branch, switch to it or fetch it:

```
git fetch origin claude/new-session-GUZLb
git checkout claude/new-session-GUZLb
```

## Key files

```
docs/SESSION-CONTEXT.md                    — START HERE. Full context for the current session
docs/HANDOFF-SESSION-5.md                  — Most recent session retro
docs/workspace-spec/19-intelligent-categorisation.md — Next feature spec
src/lib/ai/pipeline.ts                     — Two-step AI extraction (Haiku→Sonnet)
src/lib/ai/result-transformer.ts           — Spec 13 decision trees + financial items
src/lib/ai/extraction-schemas.ts           — Structured output schemas
src/hooks/use-hub.ts                       — Hub state management
docs/README.md                             — Full documentation index
```

## Rules

- **Diagnose before fixing** — read logs/errors before changing code
- **Design before code** — check if there's a spec before building
- **AI extracts facts, app generates questions** — don't put reasoning or questions in AI schemas
- **Anthropic SDK uses `output_config.format`** — not `response_format` (that's OpenAI)
- **All JSON schema objects need `additionalProperties: false`** for structured outputs
- **Track lines changed** — flag at 1,500, stop at 2,000, write handoff
