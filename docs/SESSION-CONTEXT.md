# Session 6 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Branch: `claude/new-session-GUZLb`

## Product Vision
Decouple replaces the 28-page Form E paper process with an intelligent, document-led workspace. Users going through separation in England & Wales upload financial documents; AI extracts, organises, and structures everything into court-ready disclosure.

## Principles
- **"A warm hand on a cold day"** — compassionate, professional, never patronising
- **Quality first, rigour always** — design before code
- **Upload-first, review-by-exception** — AI does 90%, user confirms 10% via 3-5 taps
- **One thing at a time** — one question per screen, one decision per moment
- **Every question maps to Form E** — no wasted user effort
- **Diagnose before fixing** — read logs before changing code

## What Session 5 Accomplished
The pipeline that was blocked since Session 3 now works end-to-end with real PDFs:

1. **504 root cause found and fixed** — `response_format` (OpenAI) → `output_config` (Anthropic SDK 0.85)
2. **Structured output schemas fixed** — added `additionalProperties: false` to all object types
3. **Performance halved** — removed AI-generated reasoning/questions from schemas. 70s → 33s. App code generates questions via spec 13 decision trees instead
4. **Section cards now populate** — fixed ID matching bug + added missing financial items for payments/accounts
5. **Visual quality pass** — processing animation, typography, button sizing per spec 18
6. **Lozenge flyout cleaned up** — concise summary instead of raw AI description
7. **Response parsing fixed** — read text first to avoid stream-consumed bug

## Current State: V2 (Prepare)
- **Pipeline:** Two-step Haiku→Sonnet with structured outputs. **Working on Vercel with real PDFs.**
- **Timings:** Step 1 (Haiku PDF read): ~53s. Step 2 (Sonnet analysis): ~27s. Total: ~80s.
- **Hub components:** title-bar, hero-panel, discovery-flow, section-cards, evidence-lozenge, fidelity-label
- **Question generation:** Deterministic spec 13 decision trees in app code (not AI)
- **Section cards:** Now populate with income, accounts, payments, spending after Q&A
- **State:** localStorage only. Supabase schema ready but not wired

## What Needs Work Next

### P0 — Intelligent categorisation (spec 19, just written)

**Keyword lookup table** (P1 — low complexity, high impact):
- Before asking "What is this?" for unknown payments, check payee against keyword table
- "therapy" → Healthcare, "DVLA" → Vehicle costs, "gym" → Personal/leisure
- Eliminates many questions. Implementation: string matching in result-transformer.ts

**Payment aggregation** (P1 — medium complexity, high impact):
- Group multiple payments from same source into single items
- 3x DVLA → "Vehicle costs: £477/year (3 payments)"
- Dividends from company → "Is this from your limited company?" with annualised figure

**Progressive category dropdown** (P2 — new component):
- For truly unknown payments, show searchable Form E budget category list
- Not radio buttons — a search-and-select dropdown
- Categories map to Form E 3.1 spending line items

### P1 — Quality issues observed in real testing

- Sana Therapy showed generic "Childcare/Rent/Maintenance/Loan/Other" options — wrong. Should be healthcare or at minimum show Form E categories
- Two council tax entries (£32 and £70 to LB Lambeth) appeared separately — should aggregate
- Auto-confirm detail text was repetitive (now fixed with Form E references)
- Lozenge flyout showed raw AI description (now fixed with clean summary)

### P2 — Section card accuracy

- After Q&A completion, all confirmed/answered items should flow into correct sections
- Items from answered questions (not just auto-confirms) need financial item creation
- Spending categories from AI should populate the Spending section card
- Cross-reference: if mortgage detected in payments AND in discovery config, link them

### P3 — Other items

- Spec 14 wizard flows (manual input for property, pensions, debts)
- Wire `openManualInput`, `openSectionReview`, `addSection` stubs
- Visual quality pass completion (spec 18: lozenges, discovery flow, drag-drop zone, accessibility)

## Negative Constraints
1. **Do not use `response_format`** — Anthropic SDK uses `output_config.format`
2. **Do not reference pre-pivot specs (03-06, 11, 12)** — architecture changed
3. **Structured output schemas require `additionalProperties: false` on all objects**
4. **SDK timeout is 90s per call, route maxDuration is 300s** — don't reduce these

## Session Discipline
- Track lines of code changed. Flag at ~1,500, stop at ~2,000
- Before generating handoff: commit all work, write `docs/HANDOFF-SESSION-{N}.md`
- Then write `docs/SESSION-CONTEXT.md` for the next session

## Key Files
```
src/lib/ai/pipeline.ts                     — Two-step extraction, output_config
src/lib/ai/extraction-schemas.ts           — Slimmed schemas (facts only, no reasoning)
src/lib/ai/extraction-prompts.ts           — Document-type-specific prompts
src/lib/ai/result-transformer.ts           — Spec 13 decision trees + financial item creation
src/app/api/documents/extract/route.ts     — API entry, 300s maxDuration
src/app/api/test-pipeline/route.ts         — Isolation test endpoint
src/hooks/use-hub.ts                       — Hub state, hero panel, item management
src/components/hub/hero-panel.tsx           — 8-state hero panel
docs/workspace-spec/19-intelligent-categorisation.md — Aggregation, keywords, dropdown spec
docs/workspace-spec/13-extraction-decision-tree-documents.md — Decision trees
docs/workspace-spec/18-visual-design-system.md — Visual spec
```
