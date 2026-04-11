# Session 5 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Branch: `claude/project-planning-sprint-zero-odNO5`

## Core Principles
- "A warm hand on a cold day" — compassionate, never clinical
- Upload-first, review-by-exception — AI does 90%, user confirms 10% (3-5 taps)
- Confidence states matter: Known/Estimated/Unsure/Unknown (code only has 2 — needs expanding)
- V2's data model is the foundation for V3-V5. If it's wrong, everything downstream breaks
- No features on a broken pipeline. Diagnose before fixing. Read logs before changing code
- Specs 05, 06, 10 are ARCHIVED. Active specs: 05b, 10b, 11, 12, 09

## Current Vertical: V2 (Build Your Picture)
- Critical path: Upload PDF → Haiku 4.5 extracts → tiered questions (10b) → items in workspace
- Pipeline works mechanically but has a **504 on Vercel** — undiagnosed
- Extraction quality is shallow (Haiku alone). Fix: two-step Haiku reads PDF → Sonnet analyses text
- AI prompt is generic. Spec 11 defines 8-domain signal→question mapping — not yet in code
- UI follows spec 10b (tiered confidence). Step-through dialogue works. Auto-advance bug fixed (`47c18ac`)
- State: localStorage only. Supabase schema ready (11 tables, RLS) but not wired

## Latest Spec Delta / Gotchas
- `route.ts` has 11 console.log breadcrumbs — read Vercel logs to find the 504 failure point
- Only `claude-haiku-4-5-20251001` works with PDF `type: 'document'`. Do not try other models for PDFs
- `maxDuration=120` in route.ts. Vercel Pro allows 300s. No SDK-level timeout set
- `AI_DRY_RUN` only activates when flag=true AND no API key. Won't mock on production
- "Something wrong?" button in `ai-analysis.tsx` exists but does nothing (stub)
- `max_tokens=4096` — truncation risk on complex docs. JSON repair logic exists as fallback

## Negative Constraints
1. **Do not change model IDs without reading Vercel function logs first** — Session 3 wasted 5 deploys guessing
2. **Do not build new features until the pipeline returns reliable results on Vercel** — fix the foundation first
3. **Do not persist to Supabase yet** — the confidence model in `types/workspace.ts` is incomplete (2 states, needs 4)

## Session 5 Deliverables
1. Read Vercel function logs for `/api/documents/extract` — identify exact failure line
2. Apply one targeted fix based on evidence
3. Add `timeout: 90000` to Anthropic SDK client in `provider.ts`
4. Verify end-to-end: upload a real PDF on Vercel → tiered UI → items appear in category tabs

## Key Files
```
src/app/api/documents/extract/route.ts     — API entry, 120s timeout, logging
src/lib/ai/document-analysis.ts            — AI prompt, JSON repair
src/lib/ai/provider.ts                     — Model routing, SDK client
src/app/workspace/build/page.tsx           — Page orchestrator, category mapping
src/types/workspace.ts                     — Data model (needs confidence expansion)
docs/workspace-spec/11-ai-question-mapping.md — 8-domain spec (not in code yet)
docs/HANDOFF.md                            — Master reference + session backlog
```
