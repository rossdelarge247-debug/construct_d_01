# Session 13 Handoff — Spending Flow

**Date:** 14 April 2026
**Branch:** `claude/decouple-v2-financial-disclosure-Xr4V4`
**Lines changed:** ~1,815 across 11 files (5 new, 6 modified)

## What happened

### Research: Transaction enrichment (Bud vs Tink)
- Evaluated Bud Financial's transaction enrichment service for spending categorisation
- Bud offers 210+ categories, merchant logos, regularity detection, <5ms, >98% accuracy
- Our Tink integration only calls `/data/v2/transactions` — not using Tink's dedicated enrichment API (`/enrichment/v1/`) or Merchant Information product
- User checked Tink Console — Data Enrichment and Merchant Information not enabled (likely paid add-ons)
- **Decision D16:** Build with Tink's existing PFM categories, design types with optional enrichment fields for later upgrade
- **Decision D17:** Log that we're not utilising Tink's enrichment API — check if it can be enabled

### Built: Complete spending flow (screens S1a–S2f, S1c-1, S1c-2, 3a)

**Architecture — 5 small focused files:**
- `spending-fork.tsx` (84 lines) — S1a: "Do it now" vs "Provide estimates"
- `spending-estimates.tsx` (216 lines) — S1b: 6 category inputs + S1c-1: amber summary with upgrade nudge
- `spending-search.tsx` (232 lines) — S2d: Transaction search with typeahead, payee grouping, frequency inference, monthly calculation
- `spending-categorise.tsx` (557 lines) — S2a-S2f: Per sub-category confirmation loop (show found → gap question → checkboxes → search → mini summary)
- `spending-flow.tsx` (249 lines) — Thin orchestrator + S1c-2: Full summary with green badges

**Two paths through the flow:**
1. **Estimates** (quick): 6 Form E category inputs → amber summary → task list todo for later upgrade
2. **Bank data** (thorough): Per-category walk through Housing → Utilities → Personal → Transport → Children → Leisure, each with detected items, gap questions, transaction search, smart calculations (annual→monthly)

**Sub-category breadcrumb bar:** New UI pattern — current category bold, upcoming fade progressively, clipped at edge. Not clickable — information scent only.

**Wired upgrade path:** Both the task list ("Complete now" button) and financial summary ("Complete your spending disclosure" CTA) launch the full bank data flow with `startInCategorise` prop, skipping the fork.

### Modified files:
- `hub.ts` — SpendingSubCategory, SpendingItem, SpendingCategoryResult, SpendingFlowResult types + SPENDING_CATEGORIES with Form E sub-sub-categories
- `bank-data-utils.ts` — Transaction search, frequency inference, monthly calculation helpers, demo transactions
- `confirmation-flow.tsx` — Spending as 6th section after debts, progress stepper updated to 6 segments
- `financial-summary-page.tsx` — Spending card with estimated (amber) vs confirmed (green) states
- `task-list-home.tsx` — Spending upgrade task when estimates used
- `page.tsx` — `spending_upgrade` view state, SpendingFlow re-entry
- `progress-stepper.tsx` — Widened type to accept `string[]`
- `v2-decisions.md` — D16, D17

## What went well
- Wireframe analysis before coding was thorough — no guesswork during build
- Splitting into 5 small files instead of one mega component kept each file focused and readable
- The transaction search pattern (S2d) is a genuinely new interaction — typeahead + payee grouping + frequency inference

## What could improve
- No browser testing this session — need to verify all transitions and states visually
- The `useState(() => { ... })` pattern in spending-categorise.tsx for initialising category items is non-standard — should be replaced with a proper useEffect or initialiser
- Demo transactions are hardcoded — should be derived from bank extractions for consistency

## Key decisions
- **D16:** Tink first, Bud as upgrade path for enrichment
- **D17:** We're not using Tink's enrichment API — action to investigate
- Split spending flow into 5 files rather than one (user request for smaller files)
- Spending is the 6th and final section in the confirmation flow, after debts
- Sub-category sequence: Housing → Utilities → Personal → Transport → Children → Leisure (Form E Section 5 order)
- Children category conditional on V1 data / child benefit detection

## Bugs / issues to note
- TypeScript: `SectionSummaryData.sectionKey` type is `ConfirmationSectionKey` which doesn't include `'spending'` — used `as` cast as workaround. Should widen the type properly.
- `WorkspaceView` type was redefined locally in page.tsx to add `'spending_upgrade'` — should update the type in hub.ts instead
- Edit links throughout spending flow are placeholder only — no handlers wired
