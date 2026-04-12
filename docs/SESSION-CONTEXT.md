# Session 6 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Branch: `claude/new-session-GUZLb`

## Product Vision
Decouple replaces the 28-page Form E paper process with an intelligent, document-led workspace. Users going through separation in England & Wales upload financial documents — or connect their bank directly — and AI + Open Banking extracts, organises, and structures everything into court-ready disclosure.

## Principles
- **"A warm hand on a cold day"** — compassionate, professional, never patronising
- **Quality first, rigour always** — design before code
- **Upload-first, review-by-exception** — AI does 90%, user confirms 10% via 3-5 taps
- **One thing at a time** — one question per screen, one decision per moment
- **Every question maps to Form E** — no wasted user effort
- **Diagnose before fixing** — read logs before changing code

## What Session 5 Accomplished
The AI pipeline that was blocked since Session 3 now works end-to-end with real PDFs. 504 root causes fixed (3 separate issues), performance halved (70s→33s), section cards populate, visual quality pass started. See `docs/HANDOFF-SESSION-5.md` for full details.

## Current State: V2 (Prepare)
- **AI pipeline:** Two-step Haiku→Sonnet with structured outputs. Working on Vercel with real PDFs. ~80s total.
- **Open Banking:** Not yet integrated. Tink (Visa) selected as provider. Sandbox credentials being set up.
- **Hub components:** title-bar, hero-panel, discovery-flow, section-cards, evidence-lozenge, fidelity-label
- **Question generation:** Deterministic spec 13 decision trees in app code (not AI)
- **Section cards:** Populate with income, accounts, payments, spending after Q&A
- **State:** localStorage only. Supabase schema ready but not wired

## Two data paths — same downstream pipeline

```
Path A (instant):  Bank connection → Tink API → tink-transformer.ts ─┐
                                                                      ├→ TransformedResult → hero panel → section cards
Path B (80s):      PDF upload → Haiku → Sonnet → result-transformer.ts┘
```

Both paths produce the same `TransformedResult` type (auto-confirms, questions, financial items). The hero panel, section cards, and Q&A flow are shared. Path B remains essential for pensions, payslips, mortgage letters — documents that don't live in a bank API.

## Session 6 Deliverables (in order)

### 1. Spec 19: Keyword lookup table (~100 lines)
Before asking "What is this?" for unknown payments, check payee against a keyword table. "therapy" → Healthcare, "DVLA" → Vehicle costs. This benefits BOTH the Tink path and the PDF path — the same categorisation logic is used by both transformers.
- File: `src/lib/ai/result-transformer.ts` (add lookup function + table)

### 2. Spec 19: Payment aggregation (~150 lines)
Group multiple payments from the same source. 3x DVLA → "Vehicle costs: £477/year". Dividends → annualised company income question. Again, shared by both paths.
- File: `src/lib/ai/result-transformer.ts` (add grouping logic)

### 3. Tink Open Banking integration (~250 lines)
Connect bank accounts via Tink Link. Fetch 12 months of enriched transactions. Map Tink's ~150 categories → Form E line items using the keyword/categorisation layer from steps 1-2.
- Prerequisites: Tink sandbox `client_id` and `client_secret` in Vercel env vars (`TINK_CLIENT_ID`, `TINK_CLIENT_SECRET`)
- New files:
  - `src/app/api/bank/connect/route.ts` — generates Tink Link URL (market=GB, scopes)
  - `src/app/api/bank/callback/route.ts` — exchanges auth code, fetches accounts + transactions
  - `src/lib/bank/tink-transformer.ts` — maps Tink data → TransformedResult
- Hero panel: add "Connect your bank" alongside upload drop zone

### 4. Answered questions → financial items (~80 lines)
When user answers a clarification question (e.g. "Yes, it's my mortgage"), create a financial item in the correct section card. Currently only auto-confirmed items flow through.
- File: `src/hooks/use-hub.ts` (enhance `answerQuestion` callback)

### 5. If time permits: Progressive category dropdown
For truly unknown payments, show searchable Form E budget categories instead of generic radio buttons.
- New component: `src/components/hub/category-selector.tsx`

**Estimated total: ~580 lines. Within session limits.**

## Tink Integration Notes

- **Sandbox:** Free at console.tink.com, no sales call needed
- **Production:** Commercial agreement with Visa/Tink required. They provide FCA AISP licence coverage.
- **Tink Link:** URL-based redirect/iframe (no React component). Generate URL server-side with market=GB.
- **Auth flow:** OAuth2. Exchange auth code for access token. Bearer token for API calls.
- **Data Enrichment:** ~150 transaction categories + merchant names + logos. Available in sandbox.
- **90-day re-consent:** PSD2 requirement. Non-issue for Form E (point-in-time disclosure).
- **Key insight:** Tink handles 80% of categorisation. Your code handles the divorce-specific 20% (pension vs insurance, maintenance vs rent, company dividends). That 20% IS the product differentiator.

## Negative Constraints
1. **Do not use `response_format`** — Anthropic SDK uses `output_config.format`
2. **Do not reference pre-pivot specs (03-06, 11, 12)** — architecture changed
3. **Structured output schemas require `additionalProperties: false` on all objects**
4. **SDK timeout is 90s per call, route maxDuration is 300s** — don't reduce these
5. **Tink env vars:** `TINK_CLIENT_ID`, `TINK_CLIENT_SECRET` — check these exist before building Tink routes

## Session Discipline
- Track lines of code changed. Flag at ~1,500, stop at ~2,000
- Before generating handoff: commit all work, write `docs/HANDOFF-SESSION-{N}.md`
- Then write `docs/SESSION-CONTEXT.md` for the next session

## Key Files
```
src/lib/ai/pipeline.ts                     — Two-step extraction, output_config
src/lib/ai/extraction-schemas.ts           — Slimmed schemas (facts only, no reasoning)
src/lib/ai/extraction-prompts.ts           — Document-type-specific prompts
src/lib/ai/result-transformer.ts           — Spec 13 decision trees + financial items + keyword lookup
src/app/api/documents/extract/route.ts     — Upload API, 300s maxDuration
src/app/api/test-pipeline/route.ts         — Isolation test endpoint
src/hooks/use-hub.ts                       — Hub state, hero panel, item management
src/components/hub/hero-panel.tsx           — 8-state hero panel UI
docs/workspace-spec/19-intelligent-categorisation.md — Keyword lookup, aggregation, dropdown spec
docs/workspace-spec/13-extraction-decision-tree-documents.md — Decision trees per document type
docs/workspace-spec/18-visual-design-system.md — Visual spec
```
