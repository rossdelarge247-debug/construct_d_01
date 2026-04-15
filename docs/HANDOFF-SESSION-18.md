# Session 18 Handoff — Signal rules expansion, workbench analytics, spec 31

**Date:** 15 April 2026
**Branch:** `claude/decouple-v2-financial-disclosure-azVFf`
**Lines changed:** ~1,020 net across 8 files (4 new, 4 modified)
**Commits:** 9

## What happened

### Phase 1 — P0: Signal rules expansion (5 new rules, 11 → 17 total)

1. **Rent detection** (`property-rules.ts`): 2-path rule. Path 1: keyword match (high confidence). Path 2: pattern-based — unknown payment + monthly frequency + £400-4000 range + consistent amount. Catches rent to landlords/agents without keyword match (e.g. `MARSH AND PARSONS TOL230019 STO £2,150`). Skips if mortgage already detected.

2. **Pension contribution** (`pension-rules.ts`): Surfaces `pension_contribution` payments for Form E 2.13. CETV cross-section impact. Absence rule notes workplace pensions are deducted at source (not a gap).

3. **Investment platform** (`accounts-rules.ts`): Surfaces `investment` payments for Form E 2.3. Sub-detects crypto platforms (Coinbase, Binance) with specific evidence needs.

4. **No pension visible** (`pension-rules.ts`): Absence signal — no pension payments detected. Notes this is normal for workplace pensions.

5. **BNPL detection** (`debt-rules.ts`): Detects Klarna, Clearpay, Laybuy, Zilch prefixes. Groups by merchant (strips BNPL prefix), identifies instalment plans (same amount repeated), calculates totals. Form E 2.14.

### Phase 2 — P1: Workbench improvements (3 features)

6. **Ntropy inline on classifications**: When enrichment data available, "Ntropy merchant" and "Ntropy labels" columns appear inline on the classifications table. No need to switch to Ntropy tab.

7. **Question trigger visibility**: "Triggered by" column on questions tab shows which classification or signal rule caused each question to fire. Clickable badge navigates to Rules tab.

8. **Ntropy batch chunking**: Classifications >100 split into batches of 100, sent sequentially, results combined. Button shows batch count for large datasets.

### Phase 3 — Workbench analytics (driven by real user data analysis)

9. **Amount distribution analysis**: Visual histogram showing transaction counts by amount bucket (< £500 through £10k+). Category breakdown and unknown count per bucket. Clickable to filter. Ntropy labels per bucket when enrichment available.

10. **Payee grouping with aggregated totals**: "Group by payee" toggle merges classifications with same normalised payee. Shows true rawTotal (sum of all raw transactions), rawTxCount, average per payment. Sorted by total descending. Expandable to show individual transactions. Ntropy merchant name used as group label when available.

11. **Ntropy reconciliation**: "Use: [label]" button applies Ntropy's suggestion as category override to all items in a payee group. "Set all..." dropdown for manual group override. Saves corrections persistently.

### Phase 4 — Classification engine fixes

12. **Frequency bug fix** (`csv-parser.ts`): Single-occurrence payments now correctly get `one_off` instead of defaulting to `monthly` (avgGap was 30 for groups of 1).

13. **Date normalisation fix** (`csv-parser.ts`): Now strips `DD MON` with space (e.g. `21 DEC`, `07 AUG`) and `ON DD` patterns. Klarna*Halfords date variants now merge correctly.

14. **Transaction dates in workbench**: New Dates column shows raw transaction dates. rawTotal field shows true sum of all transaction amounts (not the averaged classification amount).

### Phase 5 — Spec 31: Large payment detection

15. **Spec 31 written** (`31-large-payment-detection.md`): Covers tiered threshold detection (≥£3k full asset/expense fork, £1k-3k categorise), forking question tree mapping to Form E sections, signal linking (new concept — connecting vehicle purchase → loan → insurance), vehicle_maintenance category, V1 interview upfront asset questions.

## Key design discussions

### Large one-off payments and the asset/expense fork
User's real data showed a £23,200 car purchase classified as "unknown monthly". Led to a deep design discussion about:
- **Tiered thresholds**: ≥£3k full fork (asset/bill/gift?), £1k-3k softer categorise
- **Signal linking**: A car purchase may have connected loan repayment and insurance — these need to be linked as one asset with associated debts and costs
- **Upfront interview questions**: Rather than pure detection, ask about vehicles/assets early in the journey

### Normalisation gaps from real data
Real bank data exposed that `DD MON` date patterns (with space) survive normalisation, causing Klarna instalments to appear as separate one-off payments instead of one monthly. Fixed.

### Ntropy as oracle
Ntropy correctly identified "Volks Autos" as vehicle_maintenance and "TeamSport Karting" as entertainment — categories we don't have. The reconciliation feature lets the user apply Ntropy labels, and the `NTROPY_TO_CATEGORY` mapping provides a starting point for learning from Ntropy.

## What went well
- Real CSV data drove every workbench feature — not speculative, responding to actual gaps
- The grouped view immediately revealed insights: total vendor spend, BNPL instalment patterns, category clusters by amount range
- Frequency fix was a satisfying small bug with big impact (everything was "monthly")
- Spec 31 emerged organically from data analysis rather than upfront planning

## What could improve
- The workbench file is now ~1,100 lines — approaching the point where it should be split into components
- No automated tests for the new signal rules yet (P3 from session plan, deferred)
- The `NTROPY_TO_CATEGORY` mapping is hand-coded — should be configurable
- The payee grouping key function duplicates some normalisation logic — could be unified

## Further investigation needed

### Persona-based scenario review
The engine needs validating against common user personas:
- **PAYE employed, homeowner with mortgage** (~40% of users) — salary, mortgage, council tax, pension, insurance, utilities
- **PAYE employed, renting** (~25%) — salary, rent, council tax
- **Self-employed / director** (~15%) — dividends + salary, HMRC SA, variable income
- **Retired** (~10%) — pension income, investment drawdown
- **Benefits recipient** (~10%) — HMRC/DWP, housing benefit

Each persona needs: a test scenario, expected signal rules firing, expected questions, expected gaps. This validates coverage before building more rules.

### Upfront interview questions — placement in the journey
The current flow is: V1 interview → bank connection → classification → signals → questions. The user suggested inserting key questions **after the plan but before bank connection**:
- "Do you own any vehicles?" → pre-seeds vehicle detection
- "Do you own your home / rent / live with family?" → gates property signals
- "Are you employed / self-employed / retired?" → sets accuracy tier
- "Do you have valuable assets (jewellery, art, crypto)?" → gates other assets section

This is the **V1→V2 data bridge** from session plan P2. It changes the engine from "detect everything blind" to "detect with context" — significantly reducing false positives and unnecessary questions.

### Category expansion candidates
From Ntropy analysis of real data:
- `vehicle_maintenance` — garages, MOT, car parts (Ntropy identifies these well)
- `entertainment` — leisure activities (TeamSport Karting, cinemas)
- `personal_care` / `self_care` — Ntropy label for therapy, beauty etc.

These would improve classified rate for Form E spending section (3.1).

### Ntropy-derived keyword learning
Ntropy's clean merchant names could seed our keyword tables:
- "Volks Autos" → vehicle_maintenance keywords
- "Sana Therapy" → healthcare/self_care keywords
- "Halfords" → vehicle_maintenance (when behind Klarna prefix, it's BNPL for vehicle parts)

Could be automated: run Ntropy on unknowns, extract confident labels, add to keyword tables.

## Key decisions
- **Pattern-based rent detection over keyword-only**: Standing order pattern catches private landlords/agents not in keyword list
- **BNPL as signal rule, not category**: Klarna prefix detection is a pattern (signal) not a payee classification (category)
- **rawTotal over averaged amount in grouped view**: Users need to see actual total spend per vendor, not the monthly average
- **Spec 31 before implementation**: Large payment detection needs careful design (signal linking is architecturally new) — spec first, build next session
- **Upfront questions placement**: After plan, before bank connection — gives engine context without delaying the "connect and see" moment
