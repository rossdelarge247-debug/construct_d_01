# Session 18 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 17 accomplished

**Engine maturity leap: Level 1 → Level 2. ~1,350 net lines across 10 files (4 modified, 6 new).**

### P0: Engine validation and classification fix
- Ran all 5 synthetic scenarios: classified rate was 18-55%, accuracy 53-75%
- Diagnosed two root causes: test infrastructure substring collisions + missing classification categories
- Expanded `DetectedPayment` from 11 to 20 categories (added credit_card, investment, gambling, groceries, dining, fuel, transport, education, healthcare)
- Added ~100 new keywords including 20 major UK letting agents
- Fixed keyword gaps (bmw financial, legal and general, barclaycard, childminder truncation)
- Result: **95% classified, 100% accuracy** (aggregate across 75 test payments)

### P1: Level 2 engine improvements
- **Amount-range guards**: Plausibility bands for 13 categories (mortgage £200-5000, council tax £50-500, etc.). Implausible amounts get downgraded confidence (0.72 vs 0.92).
- **Fuzzy matching**: Levenshtein distance (threshold ≤2) for truncated BACS descriptions. Handles single-word (SAINSBUR→Sainsbury) and multi-word (HARGREAV LANSDO→Hargreaves Lansdown).
- **User correction persistence**: localStorage-backed JSON store wired into classification pipeline as top-priority layer (confidence=1.0). Each correction is simultaneously an override, golden test data, and future ML training data.

### Ntropy integration
- New `ntropy-client.ts`: thin client for Ntropy Transaction Enrichment API (v2/transactions/sync)
- API route `/api/ntropy/enrich`: server-side proxy (keeps API key secure, caps at 100 txns)
- Workbench "Compare with Ntropy" button + comparison tab (side-by-side: our category vs Ntropy merchant + labels)
- Requires `NTROPY_API_KEY` env var

### Signal detection engine (new architecture layer)
- **Spec 30** written: pattern recognition layer between classification and questions
- **11 signal rules** implemented across income (5), property (3), debts/flags (3)
- Each rule has: tier (must_nail / ask_for_help), detect() function, human-readable reasoning, evidence, cross-section impacts
- **Rules diagnostic tab** on workbench: shows every rule, fired/not-fired, determination, reasoning bullets, evidence metrics, impact badges

### Workbench category reassignment
- Classification rows now have category dropdown (was static badge)
- Selecting a different category saves a UserCorrection and updates immediately
- Green "user" badge marks manual overrides
- Corrections persist and auto-apply on future loads

### Key design decisions
- **Tiered accuracy model**: "must nail" (PAYE salary, benefits, mortgage — ~60% of users) vs "ask for help" (self-employed, dividends — ~15%). Don't try to auto-classify everything. Detect the signal, ask the user, let them use the search tool.
- **V1 interview → V2 data bridge**: User declares complexity in V1 (employed/self-employed/retired), engine adapts in V2. Skip impossible signals, prioritise the right questions, gate sections.
- **Pattern-based rent detection**: Standing order + same amount + £400-4000 range can catch rent even without keyword match. Not yet implemented (session 18).

## Current state of the codebase

**What works end-to-end:**
- V1 public site: landing → features → pricing → interview → choose/save
- V2 workspace: carousel → task list → bank connect → dev chooser → reveal → confirmation (7 sections) → spending → financial summary → task list
- Decisioning engine: CSV/Tink → classification (20 categories, ~200 keywords, fuzzy matching, amount guards, user corrections) → signals (11 rules) → questions/auto-confirms → gap detection
- Engine workbench: scenarios + CSV → classification table (with category reassignment) → income → questions → Ntropy comparison → rules diagnostic

**What needs attention next:**
- **Pattern-based rent detection** — STO prefix + same amount + £400-4000 range
- **Ntropy inline comparison** — show Ntropy columns inline on classifications, not separate tab
- **Question trigger visibility** — link from questions tab back to classification/signal that generated it
- **V1→V2 data bridge** — pipe interview answers (employed/self-employed/retired) into engine
- **More signal rules** — pension detection, accounts/transfers, investment platforms
- **Workbench Ntropy batch fix** — handle >100 classifications by chunking

## Session 18 deliverables, priority order

### P0: Pattern-based signal rules
1. Rent detection rule (STO + consistent amount + £400-4000, no keyword needed)
2. Pension contribution detection (payments to pension providers)
3. Investment/savings detection (transfers to platforms/ISAs)
4. Expand signal rules to cover all Form E sections

### P1: Workbench improvements
5. Ntropy inline on classifications (extra columns, conflict picker)
6. Question trigger visibility (which signal/classification → which question)
7. Ntropy batch chunking (>100 transactions)

### P2: V1→V2 data bridge
8. Define the bridge data shape (what V1 passes to V2)
9. Wire interview answers into signal engine (gate sections, set tiers)
10. Skip impossible signals based on declared situation

### P3: Externalise and test
11. Move keyword tables to JSON config files
12. Vitest snapshot tests for signal rules
13. Track classified rate + signal coverage as health metrics

## Negative constraints
1. V1 legacy palette is gone — do not reintroduce warmth/cream/sage colours
2. Red #E5484D is for primary CTAs only
3. Shadow-based card separation — no borders on cards
4. Do not reference pre-pivot specs (03-06, 11, 12)
5. Edit flows are placeholder — do not wire up without wireframes
6. Workbench is dev-only — do not link from production navigation
7. Don't try to auto-classify self-employment/dividends — detect the signal, ask the user

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-17.md                 — Most recent session retro
docs/workspace-spec/30-signal-detection-engine.md — Signal detection spec
src/lib/ai/result-transformer.ts           — Decision trees + keyword lookup
src/lib/bank/csv-parser.ts                 — CSV import + classification (IMPROVED)
src/lib/bank/confirmation-questions.ts     — Question + summary generation
src/lib/bank/test-scenarios.ts             — 5 synthetic test scenarios (IMPROVED)
src/lib/bank/user-corrections.ts           — User correction persistence (NEW)
src/lib/bank/ntropy-client.ts              — Ntropy API client (NEW)
src/lib/bank/signal-rules/                 — Signal detection engine (NEW)
  types.ts                                 — Signal + rule types
  income-rules.ts                          — 5 income signal rules
  property-rules.ts                        — 3 property signal rules
  debt-rules.ts                            — 3 debt + flag rules
  engine.ts                                — Rule runner
src/app/workspace/engine-workbench/page.tsx — Engine workbench (IMPROVED)
src/app/api/ntropy/enrich/route.ts         — Ntropy proxy route (NEW)
src/lib/ai/extraction-schemas.ts           — 20 payment categories (IMPROVED)
src/types/hub.ts                           — All types
```
