# Session 19 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 18 accomplished

**Signal rules expansion + workbench analytics. ~1,020 net lines across 8 files.**

### Signal rules: 11 → 17
- Rent detection (2-path: keyword + pattern-based)
- Pension contribution + absence rule
- Investment platform (with crypto sub-detection)
- BNPL detection (Klarna/Clearpay prefix, instalment grouping)

### Workbench analytics (driven by real CSV data analysis)
- Ntropy inline on classifications (merchant + labels columns)
- Question trigger visibility (which signal/classification fires each question)
- Ntropy batch chunking (>100 transactions)
- Amount distribution histogram (bucketed, filterable, with category breakdown)
- Payee grouping with true rawTotal + rawTxCount (expandable)
- Ntropy reconciliation ("Use: label" button + "Set all..." group override)

### Classification engine fixes
- Frequency: single payments now `one_off` not `monthly`
- Date normalisation: strips `DD MON` with space (merges Klarna date variants)
- Transaction dates column in workbench
- rawTotal field (true sum, not averaged amount)

### Spec 31: Large payment detection
- Tiered thresholds (≥£3k full fork, £1k-3k categorise)
- Asset vs expense question tree
- Signal linking concept (vehicle → loan → insurance)
- Vehicle_maintenance category proposal
- V1 interview upfront asset questions

## Current state of the codebase

**What works end-to-end:**
- V1 public site: landing → features → pricing → interview → choose/save
- V2 workspace: carousel → task list → bank connect → dev chooser → reveal → confirmation (7 sections) → spending → financial summary → task list
- Decisioning engine: CSV/Tink → classification (20 categories, ~200 keywords, fuzzy matching, amount guards, user corrections) → signals (17 rules) → questions/auto-confirms → gap detection
- Engine workbench: scenarios + CSV → classification table (with category reassignment, Ntropy inline, payee grouping, amount analysis) → income → questions (with trigger visibility) → Ntropy comparison → rules diagnostic (17 rules)

**What needs attention next:**
- **Persona-based scenario validation** — test engine against PAYE/renter/self-employed/retired personas
- **Upfront interview questions** — placement in journey (after plan, before bank connection)
- **V1→V2 data bridge** — pipe interview answers into signal engine
- **Spec 31 implementation** — large payment detection, asset/expense fork, signal linking
- **Category expansion** — vehicle_maintenance, entertainment from Ntropy analysis
- **Workbench component split** — page.tsx is ~1,100 lines, should be decomposed
- **Vitest snapshot tests** for signal rules (deferred from P3)

## Session 19 deliverables, priority order

### P0: Persona-based scenario review + upfront interview design
1. Define 5 user personas (PAYE owner, PAYE renter, self-employed, retired, benefits)
2. Create test scenarios for each persona
3. Run through workbench — validate signal coverage, identify gaps
4. Design upfront interview questions (placement: after plan, before bank connect)
5. Design the question flow — what questions, what order, what gates

### P1: Spec 31 implementation (if time after P0)
6. Add `vehicle_maintenance` category + keywords
7. Implement `flag.large-one-off` signal rule
8. Build forking question flow for large payments
9. Signal linking data model (stretch)

### P2: V1→V2 data bridge
10. Define bridge data shape
11. Wire interview answers into signal engine
12. Gate sections based on declared situation

### P3: Externalise and test
13. Move keyword tables to JSON config
14. Vitest snapshot tests for signal rules
15. Track classified rate + signal coverage metrics

## Negative constraints
1. V1 legacy palette is gone — do not reintroduce warmth/cream/sage colours
2. Red #E5484D is for primary CTAs only
3. Shadow-based card separation — no borders on cards
4. Do not reference pre-pivot specs (03-06, 11, 12)
5. Edit flows are placeholder — do not wire up without wireframes
6. Workbench is dev-only — do not link from production navigation
7. Don't try to auto-classify self-employment/dividends — detect the signal, ask the user
8. Large payment detection needs spec 31 implementation — don't build without the signal linking model
9. Upfront questions should NOT delay the "connect and see" moment — keep them fast and focused

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-18.md                 — Most recent session retro
docs/HANDOFF-SESSION-17.md                 — Previous session retro
docs/workspace-spec/30-signal-detection-engine.md — Signal detection spec
docs/workspace-spec/31-large-payment-detection.md — Large payment spec (NEW)
src/lib/bank/csv-parser.ts                 — CSV import + classification (IMPROVED)
src/lib/bank/signal-rules/                 — Signal detection engine
  types.ts                                 — Signal + rule types
  income-rules.ts                          — 5 income signal rules
  property-rules.ts                        — 4 property signal rules (IMPROVED: +rent)
  pension-rules.ts                         — 2 pension signal rules (NEW)
  accounts-rules.ts                        — 1 accounts signal rule (NEW)
  debt-rules.ts                            — 4 debt + flag rules (IMPROVED: +BNPL)
  engine.ts                                — Rule runner (17 rules total)
src/app/workspace/engine-workbench/page.tsx — Engine workbench (IMPROVED: grouping, analysis, reconciliation)
src/app/api/ntropy/enrich/route.ts         — Ntropy proxy route
src/lib/bank/ntropy-client.ts              — Ntropy API client
src/lib/bank/user-corrections.ts           — User correction persistence
src/lib/bank/test-scenarios.ts             — 5 synthetic test scenarios
src/lib/ai/extraction-schemas.ts           — 20 payment categories
src/lib/bank/confirmation-questions.ts     — Question + summary generation
src/types/hub.ts                           — All types
```
