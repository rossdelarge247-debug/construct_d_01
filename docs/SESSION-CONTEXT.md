# Session 6 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Branch: `claude/new-session-GUZLb`

## Product Vision
Decouple replaces the 28-page Form E paper process with an intelligent, document-led workspace. Users going through separation in England & Wales upload financial documents; AI extracts, organises, and structures everything into court-ready disclosure. The product serves the "squeezed middle" — the 96% increase in self-represented people who can't afford £5,000+ solicitor fees but need more than form-filing.

## Principles
- **"A warm hand on a cold day"** — compassionate, professional, never patronising, never clinical. The warmth lives in the words and guidance; the interface is sophisticated and empowering
- **Quality first, rigour always** — no shortcuts, no MVPs. Design before code. This should feel like it was built in 2026
- **Upload-first, review-by-exception** — AI does 90% of the work. The user confirms 10% via 3-5 taps. The appearance of magic
- **One thing at a time** — one question per screen, one decision per moment. Reduce cognitive load at every step. These users are stressed, often alone, often late at night
- **Every question maps to Form E** — if the answer doesn't fill a disclosure field, don't ask it. No wasted user effort
- **Safeguarding is not an add-on** — woven into every interaction. Exit This Page on every screen. Coercive control and financial abuse screening from V1 informs V2+ behaviour
- **Diagnose before fixing** — read logs before changing code. One targeted fix, not guessing

## V2 North Star: "The Brilliant Financial Analyst"
V2 (Prepare) is the foundation everything else builds on. V3 (Resolve) consumes V2 data for disclosure. V4/V5 (Formalise) consumes it for consent orders. If V2's data model or extraction quality is wrong, every downstream vertical breaks.

The experience should feel like having a brilliant, patient financial analyst sitting beside you. You hand them a stack of bank statements, payslips, and pension letters. They read everything, understand what they're looking at, and come back saying: "Here's what I found. Your salary is £3,218/month from ACME Ltd. You've got a mortgage at £1,150/month to Halifax. I noticed what looks like a pension contribution — is that right?" They do the heavy lifting. You confirm, correct, or fill gaps. In 15 minutes, not 15 hours.

## Current Vertical: V2 (Prepare)
- **Architecture:** Hub page + hero panel (8-state machine). Single page, one focal point. Section cards below show the emerging financial picture
- **AI pipeline:** Two-step Haiku→Sonnet with structured outputs (`output_config.format`). 7 doc types built. **504 fix deployed — needs end-to-end verification**
- **Hub components built:** title-bar, hero-panel, discovery-flow, section-cards, evidence-lozenge, fidelity-label
- **State:** localStorage only. Supabase schema ready (11 tables, RLS) but not wired
- **Visual pass started:** Processing animation, typography, button sizing per spec 18. More work needed

## What Session 5 Fixed
- **504 blocker resolved:** `response_format` (OpenAI pattern) → `output_config` (Anthropic SDK 0.85). All 3 pipeline paths fixed (PDF, image, text)
- **Isolation test endpoint added:** `/api/test-pipeline` tests Step 1 and Step 2 independently
- **Visual quality pass started:** Hero heading (24px), page title (28px), primary CTA padding (12px 24px), section card spacing (32px desktop), processing animation replaced (indeterminate progress line per spec 18 Option C)

## Latest Spec Delta / Gotchas
- Active specs are **13-18** (post-pivot). Specs 03, 04, 05, 05b, 11, 12 are **superseded** (see `docs/README.md` for full index)
- `pipeline.ts` has `[Pipeline]` console.log breadcrumbs at every step — read Vercel logs to verify the fix
- Models: `claude-haiku-4-5-20251001` + `claude-sonnet-4-6` (plain IDs only — date-suffixed IDs return 404)
- Structured outputs use `output_config: { format: { type: 'json_schema', schema } }` — NOT `response_format`
- SDK timeout: 45s per call. Route `maxDuration=120`. Vercel Pro allows 300s
- `use-hub.ts` has 3 TODO stubs: `openManualInput`, `openSectionReview`, `addSection`

## Negative Constraints
1. **Do not change model IDs without reading Vercel function logs first**
2. **Verify the 504 fix works end-to-end before building new features** — use `/api/test-pipeline` first
3. **Do not reference pre-pivot specs (03-06, 11, 12) for new work** — the architecture changed fundamentally
4. **Do not use `response_format`** — the Anthropic SDK uses `output_config.format`

## Session Discipline
- **Track lines of code changed.** After every file edit, maintain a running count of net lines added/modified
- **At ~1,500 lines, flag it.** Say: "Approaching session scope limit. Recommend wrapping up soon."
- **At ~2,000 lines, stop writing code.** Commit, push, and generate the next session's context block (same format as this document). Quality degrades past this point
- **Before generating the handoff:** commit all work, write `docs/HANDOFF-SESSION-{N}.md` with retro, then write `docs/SESSION-CONTEXT.md` for the next session

## Session 6 Deliverables
1. Deploy and verify pipeline fix: hit `/api/test-pipeline` on Vercel, then test full upload flow
2. Complete visual quality pass per spec 18: lozenges, discovery flow, drag-drop zone, info boxes, accessibility
3. If pipeline works: upload real documents and evaluate extraction quality
4. Wire section card actions: `openManualInput`, `openSectionReview`, `addSection` stubs
5. Begin spec 14 wizard flows for manual input (if time permits)

## Key Files
```
src/lib/ai/pipeline.ts                     — Two-step extraction, output_config structured outputs
src/app/api/documents/extract/route.ts     — API entry, 120s maxDuration
src/app/api/test-pipeline/route.ts         — Isolation test for Step 1 + Step 2
src/app/api/health/route.ts                — Model availability checker
src/hooks/use-hub.ts                       — Hub state, hero panel state machine
src/types/hub.ts                           — Full type system
src/components/hub/hero-panel.tsx          — 8-state hero panel with processing animation
src/components/hub/section-cards.tsx       — Financial picture cards
docs/HANDOFF-SESSION-5.md                  — Session 5 retro + 504 diagnosis
docs/workspace-spec/18-visual-design-system.md — Visual spec (the reference for all styling)
docs/workspace-spec/16-hero-panel-flow.md  — Core interaction spec
docs/workspace-spec/13-extraction-decision-tree-documents.md — AI decision trees
```
