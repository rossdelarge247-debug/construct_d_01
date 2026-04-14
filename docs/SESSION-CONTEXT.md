# Session 17 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 16 accomplished

**Decisioning engine audit, bug fixes, and test infrastructure. ~1,450 net lines across 5 files.**

### Critical bug fix
- **Silent-drop bug in `generatePaymentQuestion()`**: 6 out of 11 payment categories (utilities, council_tax, subscription, childcare, loan_repayment, child_maintenance) returned `null` and were silently dropped — no auto-confirm, no question. Now every category produces a confirmation question or auto-confirm.

### Engine improvements
- **CSV confidence now category-aware**: Known-category matches get 0.92+ (was flat 0.85). Unknown payments get 0.75. Recurrence boost for 3+ months.
- **Keyword expansion**: ~40 → ~150 keywords in csv-parser, 13 → 25 entries in result-transformer keyword lookup. Added real UK mortgage lenders, energy/water companies, pension providers, broadband/mobile, childcare providers, BNPL, gambling, crypto, investment platforms.
- **Payee normalisation improved**: Strips bank prefixes (CARD PAYMENT TO, FASTER PAYMENT TO, DIRECT DEBIT), dates, reference numbers, GBP amounts, card numbers, common suffixes.
- **BNPL separated from loan repayments**: csv-parser now has separate BNPL detection. Aviva disambiguated (pension vs insurance). BNPL/loan double-counting fixed in confirmation-questions.ts.
- **Single occurrences no longer dropped**: High-value or known-category payments with 1 occurrence now detected (was requiring ≥2).
- **Income type detection expanded**: Added specific benefit types (PIP, ESA, JSA), pension income sources, self-employment indicators (Stripe, PayPal), maintenance received.

### Test infrastructure (new)
- **5 synthetic test scenarios** (`test-scenarios.ts`): Sarah (employed homeowner), Marcus (self-employed renter + crypto), Jean (retired, pensions), Aisha (part-time NHS, joint, BNPL), David (high earner, investments, gambling). Each produces 150-350 realistic UK bank transactions with ground truth expectations.
- **Engine workbench page** (`/workspace/engine-workbench`): Dev-only page to run scenarios or load CSVs through the full pipeline. Shows every classification, income detection, and question fired. Stats bar with classified rate, unknown rate, accuracy. Category filter pills. "Run all scenarios" regression button.

### Decisioning engine maturity research
- Mapped the industry maturity model (Level 1-5, from keyword matching to foundation models)
- Identified we're at Level 1, next step is Level 2 (expanded merchant DB, fuzzy matching, amount-range guards, user corrections)
- Researched Plaid, Tink, Bud, Ntropy approaches
- Identified 6 quick wins and a roadmap (now/next/later)
- Recommended Tink enrichment API (check existing tier) and Ntropy free tier as oracle

## Current state of the codebase

**What works end-to-end:**
- V1 public site: landing → features → pricing → interview → choose/save
- V2 workspace: carousel → task list → bank connect → dev chooser (4 personas + CSV) → reveal → confirmation (7 sections) → spending → financial summary → task list
- Decisioning engine: CSV/Tink → extraction → classification → questions/auto-confirms → gap detection
- Engine workbench: synthetic scenarios + CSV → pipeline → classification table + stats

**What needs attention next:**
- **Run the workbench against real CSV data** — validate the fixes actually improve accuracy
- **Tink enrichment API** — check if current Tink tier includes enrichment; if so, consume as baseline
- **Amount-range guards** — add plausibility bands (mortgage 300-3000, council tax 80-400, etc.)
- **Fuzzy matching** — Levenshtein distance for truncated payees (VODAFON → Vodafone)
- **User correction persistence** — store corrections as override table + future training data
- **Externalise rules to JSON** — make keyword tables configurable without code deploys
- Data bridge: V1 → V2 state not yet wired
- Children section: design pending
- Edit flows: links exist but not wired
- Auth + Supabase: not started

## Session 17 deliverables, priority order

### P0: Validate engine fixes with real data
1. Deploy or run dev server, load real CSV through workbench
2. Check classified rate, unknown rate, accuracy against scenarios
3. Fix any remaining classification failures found

### P1: Engine maturity — Level 2 improvements
4. Amount-range guards (plausibility bands per category)
5. Fuzzy matching (Levenshtein) for truncated payees
6. Tink enrichment API — investigate tier, pricing, integration
7. Ntropy free tier — sign up, run comparison as oracle
8. User correction persistence (JSON initially, Supabase later)

### P2: Externalise and harden
9. Move keyword tables to JSON config files
10. Add snapshot tests using golden scenarios
11. Track unknown rate as key health metric

### P3: Core product gaps
12. Data bridge: V1 → V2
13. Children section design
14. Edit/review flows

## Negative constraints
1. V1 legacy palette is gone — do not reintroduce warmth/cream/sage colours
2. Red #E5484D is for primary CTAs only
3. Shadow-based card separation — no borders on cards
4. Ink inversion for selection states (Habito pattern)
5. Do not reference pre-pivot specs (03-06, 11, 12)
6. Edit flows are placeholder — do not wire up without wireframes
7. Workbench is dev-only — do not link from production navigation

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-16.md                 — Most recent session retro
src/lib/ai/result-transformer.ts           — Decision trees + keyword lookup (IMPROVED)
src/lib/bank/confirmation-questions.ts     — Question + summary generation (IMPROVED)
src/lib/bank/csv-parser.ts                 — CSV import + classification (IMPROVED)
src/lib/bank/test-scenarios.ts             — 5 synthetic test scenarios (NEW)
src/app/workspace/engine-workbench/page.tsx — Engine workbench dev page (NEW)
src/lib/bank/bank-data-utils.ts            — Extraction utils + 4 demo personas
src/lib/bank/tink-transformer.ts           — Tink → BankStatementExtraction
src/components/workspace/confirmation-flow.tsx — Confirmation Q&A
src/app/workspace/page.tsx                 — Flow state machine
src/types/hub.ts                           — All types
docs/workspace-spec/22-confirmation-flow-tree.md — Decision tree spec
docs/workspace-spec/13-extraction-decision-tree-documents.md — Extraction decision trees
```
