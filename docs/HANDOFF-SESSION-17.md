# Session 17 Handoff — Engine maturity Level 2, signal detection, Ntropy integration

**Date:** 14 April 2026
**Branch:** `claude/decouple-workspace-setup-qn5W5`
**Lines changed:** ~1,350 net across 10 files (4 modified, 6 new)

## What happened

### Phase 1 — Engine validation (P0)

1. **Ran all 5 synthetic scenarios** against the classification engine. Results were poor: 18-55% classified rate, 53-75% accuracy.

2. **Diagnosed two root causes:**
   - Test infrastructure bug: `expectedPayments` used location-based substrings (e.g. 'exeter') that matched unrelated transactions (Tesco in Exeter). Fixed with more specific substrings ('council tax', 'lb camden').
   - Missing categories: `DetectedPayment.likely_category` only had 11 categories. Groceries, dining, fuel, gambling, investment, credit card, etc. all fell to 'unknown'.

3. **Fixed both:** Expanded type from 11 to 20 categories. Added ~100 keywords. Fixed keyword gaps (bmw financial, legal and general, barclaycard, childminder truncation). Added 20 major UK letting agents.

4. **Result:** 95% classified, 100% accuracy across 75 test payments in 5 scenarios.

### Phase 2 — Level 2 engine improvements (P1)

5. **Amount-range guards** (`csv-parser.ts`): Plausibility bands for 13 categories. A "mortgage" at £25/month gets downgraded confidence (0.72 vs 0.92). Bands: mortgage £200-5000, council tax £50-500, subscription £3-300, etc.

6. **Fuzzy matching** (`csv-parser.ts`): Levenshtein distance for truncated BACS descriptions. UK BACS max 18 chars so "SAINSBURYS" often appears as "SAINSBUR". Handles single-word (threshold ≤2 edits) and multi-word (each keyword word must fuzzy-match a description word). Tested: 9/10 truncated descriptions matched correctly.

7. **User correction persistence** (`user-corrections.ts`): localStorage-backed JSON store. Each correction has normalisedPayee, rawDescription, autoCategory, correctedCategory, amount, timestamp. Wired into csv-parser: `lookupCorrection()` runs before `inferCategory()`. User corrections get confidence=1.0. Import/export for backup.

### Phase 3 — Ntropy integration

8. **Ntropy client** (`ntropy-client.ts`): Thin wrapper for Ntropy v2/transactions/sync API. Converts our DetectedPayment format to Ntropy input (description, entry_type, amount, iso_currency_code=GBP, country=GB, account_holder_type=consumer).

9. **API route** (`/api/ntropy/enrich`): Server-side proxy. Keeps API key in env var. Caps at 100 txns per request to preserve free tier credits.

10. **Workbench Ntropy tab**: "Compare with Ntropy" button sends grouped payments to Ntropy, shows side-by-side: raw description + our category + Ntropy merchant name + Ntropy labels.

11. **URL fix**: v3 endpoint expects single object, v2/transactions/sync accepts array. Fixed after user hit 400 error.

### Phase 4 — Signal detection engine

12. **Spec 30 written** (`30-signal-detection-engine.md`): Architecture for pattern recognition layer between classification and questions. Defines SignalRule interface, tiered accuracy model, salary vs dividend heuristics, workbench diagnostic tab design.

13. **11 signal rules implemented** across 3 rule files:
    - Income (5): regular-salary, benefits-hmrc, benefits-dwp, self-employment-signal, none-visible
    - Property (3): mortgage-detected, council-tax, no-housing
    - Debts/flags (3): credit-card, loan, gambling-flag

14. **Rules diagnostic tab** on workbench: Shows every rule with fired/not-fired status, determination text, reasoning bullets, evidence with metrics, cross-section impact badges. Colour-coded: green (high confidence), amber (medium), red (flag), grey (not triggered).

### Phase 5 — Workbench category reassignment

15. **Category dropdown** replaces static badge on each classification row. User selects a new category → saves UserCorrection → updates display immediately (green badge, "user" confidence). Persists across sessions.

### Phase 6 — Design discussions (no code)

16. **Tiered accuracy model agreed:** "Must nail" (PAYE, benefits, mortgage — 60% of users) vs "ask for help" (self-employed, dividends — 15%). Don't auto-classify everything. Detect signals, ask users, let them use search tool.

17. **V1→V2 data bridge designed:** V1 interview captures employment status, housing, children. V2 engine uses this to skip impossible signals, prioritise questions, gate sections. Not yet implemented.

18. **Ntropy vs Yapily analysis:** Yapily Data Plus IS Ntropy under the hood. Going direct to Ntropy is better for our architecture (we're on Tink, not Yapily). 2,000 free transactions, standalone API, any data source.

## What went well
- The classification fix was dramatic — 18-55% → 95% classified rate in one pass
- Fuzzy matching elegantly handles the BACS truncation problem without a massive keyword database
- The signal engine architecture cleanly separates "what is this?" from "what does it mean?"
- User testing with real CSV immediately found the rent detection gap — validation of the workbench approach
- The tiered accuracy model avoids over-engineering (don't auto-detect dividends, just ask)

## What could improve
- Should have tested with real CSV data earlier (synthetic data hides real-world gaps)
- Ntropy integration had a v2/v3 API mismatch — should have tested before deploying
- 736 classifications from real CSV is too many rows — need filtering/pagination
- Ntropy inline comparison (not separate tab) would be more useful
- No question trigger visibility yet

## Key decisions
- **20 categories, not 11**: Expanded to include spending categories (groceries, dining, fuel) for better classified rate. Spending categories return null from generatePaymentQuestion (auto-confirm, no question needed).
- **Housing associations removed from rent**: L&Q, Peabody etc. are ambiguous (rent vs shared ownership). Falls to 'unknown' and triggers mortgage/rent disambiguation question.
- **Fuzzy matching threshold 2**: Levenshtein ≤2 edits. Higher would cause false positives on short keywords.
- **Amount guards downgrade confidence, don't reclassify**: A "mortgage" at £25/month still shows as mortgage but at 0.72 confidence. The keyword match is still informative.
- **Signal rules are pure functions**: Each rule is independent, inspectable, and testable. No shared state between rules.
- **Tiered accuracy**: Must-nail vs ask-for-help. Engine adapts to user's declared complexity rather than trying to guess everything.
- **Ntropy direct over Yapily**: Same engine underneath, but Ntropy direct works with any data source (Tink, CSV, manual) without requiring Yapily's open banking.
