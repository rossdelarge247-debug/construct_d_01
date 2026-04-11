# Session 5 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Branch: `claude/review-handoff-docs-ZovbO`

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

This is not generic extraction. Comprehensive planning and design has produced:
- **Decision tree logic** (specs 13+14) mapping every document type to specific signals, questions, and Form E fields
- **7 document-type-specific prompts** — bank statement extraction is fundamentally different from pension CETV extraction
- **Conservative confidence thresholds** (0.95/0.80) — financial data for court filings demands higher bars than generic AI
- **Two-step pipeline** (Haiku reads PDF → Sonnet analyses) combining fast document reading with deep financial reasoning
- **Structured outputs** eliminating JSON truncation risk entirely
- **Fidelity continuum** (Sketch→Draft→Evidenced→Locked) — users see value at every stage, not waiting for "done"

## Current Vertical: V2 (Prepare)
- **Architecture:** Hub page + hero panel (8-state machine). Single page, one focal point. Section cards below show the emerging financial picture
- **AI pipeline:** Two-step Haiku→Sonnet with structured outputs. 7 doc types built. **504s on Vercel — undiagnosed blocker**
- **Hub components built:** title-bar, hero-panel, discovery-flow, section-cards, evidence-lozenge, fidelity-label
- **State:** localStorage only. Supabase schema ready (11 tables, RLS) but not wired
- **Zero visual testing done** — components untested in browser

## Latest Spec Delta / Gotchas
- Active specs are **13-18** (post-pivot). Specs 03, 04, 05, 05b, 11, 12 are **superseded** (see `docs/README.md` for full index)
- `pipeline.ts` has `[Pipeline]` console.log breadcrumbs at every step — read Vercel logs to diagnose the 504
- Models: `claude-haiku-4-5-20251001` + `claude-sonnet-4-6` (plain IDs only — date-suffixed IDs return 404)
- SDK timeout: 45s per call. Route `maxDuration=120`. Vercel Pro allows 300s
- `use-hub.ts` has 3 TODO stubs: `openManualInput`, `openSectionReview`, `addSection`
- Session 3 burned 5 deploy cycles guessing model IDs. Health check (`/api/health`) was added late, not first

## Negative Constraints
1. **Do not change model IDs without reading Vercel function logs first**
2. **Do not build new features until the 504 is resolved and the pipeline tested end-to-end in browser**
3. **Do not reference pre-pivot specs (03-06, 11, 12) for new work** — the architecture changed fundamentally

## Session Discipline
- **Track lines of code changed.** After every file edit, maintain a running count of net lines added/modified
- **At ~1,500 lines, flag it.** Say: "Approaching session scope limit. Recommend wrapping up soon."
- **At ~2,000 lines, stop writing code.** Commit, push, and generate the next session's context block (same format as this document). Quality degrades past this point
- **Before generating the handoff:** commit all work, write `docs/HANDOFF-SESSION-{N}.md` with retro, then write `docs/SESSION-CONTEXT.md` for the next session

## Session 5 Deliverables
1. Read Vercel function logs for `/api/documents/extract` — find the `[Pipeline]` breadcrumb where it dies
2. Test Step 1 (Haiku PDF) and Step 2 (Sonnet structured outputs) in isolation
3. Apply one targeted fix based on evidence
4. Start dev server, test full flow in browser: discovery → upload → hero panel → section cards
5. Begin visual quality pass per spec 18

## Key Files
```
src/lib/ai/pipeline.ts                     — Two-step extraction, 45s timeouts
src/app/api/documents/extract/route.ts     — API entry, 120s maxDuration
src/app/api/health/route.ts                — Model availability checker
src/hooks/use-hub.ts                       — Hub state, hero panel state machine
src/types/hub.ts                           — Full type system
docs/HANDOFF-SESSION-3.md                  — Session 3 retro + 504 analysis
docs/README.md                             — Doc index + reading order
docs/workspace-spec/16-hero-panel-flow.md  — Core interaction spec
docs/workspace-spec/13-extraction-decision-tree-documents.md — AI decision trees
```
