# Session 16 Handoff — Decisioning engine audit, fixes, and test infrastructure

**Date:** 14 April 2026
**Branch:** `claude/decouple-v2-financial-disclosure-HGs4m`
**Lines changed:** ~1,450 net across 5 files (2 new, 3 modified)

## What happened

### Phase 1 — Critical bug fix

1. **Silent-drop bug** (`result-transformer.ts:593`): `generatePaymentQuestion()` had a `default: return null` case with a misleading comment saying "still auto-confirm". In practice, when it returned null the caller silently skipped the payment — no question, no auto-confirm. This affected 6 categories: `utilities`, `council_tax`, `subscription`, `childcare`, `loan_repayment`, `child_maintenance`. Fixed by adding explicit case handlers for every category.

2. **CSV confidence scoring** (`csv-parser.ts:214`): All payments had flat `confidence: 0.85` regardless of classification quality. Now category-aware: known-category matches get 0.92 base + recurrence boost (up to 0.96). Unknown payments get 0.75. This means correctly-classified payments are more likely to auto-confirm.

3. **Single-occurrence payments** (`csv-parser.ts:203`): Required `group.length >= 2` for all payments, dropping annual insurance, quarterly HMRC, and other infrequent-but-important payments. Now allows single occurrences for high-value (£100+) or known-category payments.

### Phase 2 — Keyword expansion

4. **csv-parser.ts `CATEGORY_KEYWORDS`**: Expanded from ~40 to ~150 keywords. Added real UK mortgage lenders (Santander, NatWest, Coventry BS, etc.), energy companies (SSE, OVO, Shell Energy), water companies (all 12 UK regions), pension providers (Scottish Widows, Standard Life, Royal London), broadband/mobile, childcare chains.

5. **csv-parser.ts payee normalisation**: New `normaliseDescription()` function strips bank prefixes (CARD PAYMENT TO, FASTER PAYMENT TO, DIRECT DEBIT), dates (12MAR26), reference numbers, GBP amounts, card numbers, common suffixes (Ltd, PLC, Services, Group). Dramatically improves grouping of recurring payments from real bank data.

6. **csv-parser.ts income detection**: Added specific benefit types (PIP, ESA, JSA, Housing Benefit, Carer's Allowance), pension income sources (Teachers, NHS, Civil Service, Armed Forces), self-employment indicators (Stripe, PayPal, Square, SumUp, Wise Business), maintenance received.

7. **csv-parser.ts BNPL separation**: Klarna/Clearpay no longer incorrectly merged into general `loan_repayment` keywords. Separate `BNPL_KEYWORDS` list checked first. Aviva disambiguated (pension vs insurance based on description).

8. **result-transformer.ts `KEYWORD_LOOKUP_TABLE`**: Expanded from 13 to 25 entries. Added groceries (supermarkets), dining (restaurants/takeaway), BNPL, gambling (red flag per spec 22 §10), crypto exchanges, investment platforms, public transport, parking, pharmacy.

9. **confirmation-questions.ts provider lists**: Credit cards +13, BNPL +3, investment platforms +11, crypto exchanges +4, business payees +10 (HMRC NDDS, Xero, QuickBooks, FreeAgent, etc.). Fixed BNPL/loan double-counting in debts section.

### Test infrastructure

10. **5 synthetic test scenarios** (`test-scenarios.ts`): Each persona generates 150-350 transactions with realistic UK bank formatting (DD prefixes, BACS truncation, card payment suffixes, reference numbers). Ground truth at every level: payment classifications, income types, expected questions, gap detection. Covers employed, self-employed, retired, part-time+benefits, high earner.

11. **Engine workbench** (`/workspace/engine-workbench`): Dev-only page for running scenarios or real CSVs through the full pipeline. Classification table with auto-category vs expected, confidence, match/mismatch. Income table. Questions table (which fire per section). Stats bar. Category filter pills. "Run all scenarios" regression button.

### Research

12. **Industry maturity assessment**: Mapped Level 1-5 maturity model (keyword → ML → foundation model). Identified quick wins for Level 2 (amount-range guards, fuzzy matching, Tink enrichment, user corrections). Recommended Ntropy free tier as oracle for testing.

## What went well
- The silent-drop bug was the single most impactful fix — 6 entire categories were invisible
- The synthetic scenarios with ground truth expectations give immediate regression testing capability
- The workbench concept of "see every decision the engine makes" is powerful for iterative improvement
- Keyword expansion was systematic — went through every UK utility, mortgage lender, etc.

## What could improve
- Should run the workbench against real data before closing the session to validate
- The workbench doesn't yet persist corrections (planned for session 17)
- Amount-range guards and fuzzy matching not yet implemented (planned for session 17)
- Tink enrichment API not yet investigated

## Key decisions
- Level 2 maturity (not ML) is the right next step — we lack labelled training data for ML
- Ntropy free tier recommended as "oracle" for comparing our engine's accuracy
- Tink enrichment API should be consumed as baseline — they have billions of data points
- User corrections are the single most important infrastructure investment for getting smarter over time
- Externalising rules to JSON is important for auditability and update-without-deploy

## Architecture direction agreed
Layered classification pipeline:
1. Tink enrichment (provider baseline)
2. Our keyword/rules layer (Form E domain overrides)
3. Amount/frequency heuristics (sanity check)
4. User corrections (highest authority, confidence = 1.0)
