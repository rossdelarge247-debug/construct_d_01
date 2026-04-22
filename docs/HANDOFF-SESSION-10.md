# Session 10 Handoff — Confirmation Flow + Financial Summary

**Date:** 2026-04-13
**Branch:** `claude/decouple-v2-financial-disclosure-EZACb`
**Lines changed:** ~1,550 net (10 files: 6 new, 4 modified)
**Deployment:** Vercel at `construct-dev.vercel.app`

## What happened

Session 10 wired real bank data through the entire journey and built the confirmation flow — the core interaction where the user confirms what the bank connection found. This was the big transition from "navigable skeleton with mock data" to "functional product with data-driven UI".

### What was built

| Component | File | Screens | Lines |
|---|---|---|---|
| Bank data utilities | `src/lib/bank/bank-data-utils.ts` | — | 174 |
| Question generator (spec 22) | `src/lib/bank/confirmation-questions.ts` | — | 488 |
| Progress stepper | `src/components/workspace/progress-stepper.tsx` | 2b–2i | 28 |
| Section mini-summary | `src/components/workspace/section-mini-summary.tsx` | 2d-a/b/c | 93 |
| Confirmation flow | `src/components/workspace/confirmation-flow.tsx` | 2b–2i | 480 |
| Financial summary page | `src/components/workspace/financial-summary-page.tsx` | 3a | 225 |

### Key changes

**P1 — Wire reveal to real Tink data:**
- Replaced hardcoded `MOCK_REVEAL_ITEMS` / `MOCK_ACCOUNTS` with `BankStatementExtraction`-driven reveal items
- Bank callback route now passes raw extraction data alongside transformed result
- Demo fallback generates realistic `BankStatementExtraction` through same pipeline
- Both real Tink and demo data flow through identical code paths

**P2-P4 — Confirmation flow with progress stepper + accordion:**
- Section-by-section Q&A: income → property → accounts → pensions → debts
- Questions generated from bank data signals per spec 22 decision tree
- Radio option selection with Airbnb-style interaction
- Input fields for property value and mortgage balance
- Conditional branching (e.g. "No" to salary → alternative income types)
- Progress stepper advances per section
- Accordion shows completed sections with slide-in animation
- Accordion stays open during mini-summary, slides shut on "This looks correct"

**P3 — Section mini-summaries:**
- Per-section tick list of confirmed facts
- Inline gap messages in blue info boxes ("you'll need payslips for finalisation")
- Calculated values (equity = property value − mortgage balance)
- "This looks correct" / "I need to go back" actions

**P5-P6 — Financial summary page:**
- Section cards: accounts, income, property, spending (TBC), debts (TBC)
- Green badges (bank connection) / orange badges (self disclosed)
- Equity calculation, joint ownership 50/50 note
- Empty sections ("No pensions disclosed") with + buttons
- Non-financial sections (children, needs after separation)
- Staggered card entry animation per spec 26

### Vercel build fix
- Removed impossible `credit_card` type comparison in `bank-data-utils.ts` that caused TypeScript build failure

## What went well

- **Architecture is clean** — question generation is pure data logic (no React), separated from UI components. Adding new question branches is ~15 lines per signal type.
- **Demo data is structurally identical to real data** — same types, same pipeline. No "mock mode" code paths.
- **User feedback loop worked** — accordion behaviour and mortgage balance question were refined mid-session based on live testing feedback.
- **Small focused files** — the largest is 488 lines (question generator). Everything else is under 250.

## What could improve

- **Spec 22 coverage is shallow** — only covers the wireframed happy path (employed homeowner). ~35+ signal patterns from spec 22 are not implemented yet. Planned as a fidelity pass in session 12+.
- **Spec 25/22 gap** — spec 22 listed mortgage balance as a document gap, but the wireframe shows it as a self-disclosed estimate. Had to reconcile this mid-session. Specs need a consistency review.
- **Transition animations between sections** — the fade-in/fade-out is functional but could be smoother. The `transitioning` phase was added late and could benefit from refinement.

## Key decisions

1. **Demo data over Tink sandbox for now** — Tink sandbox test bank connection deferred to session 12+ alongside decision tree fidelity. The demo data exercises the happy path; real test bank data will expose which branches are missing.

2. **Mortgage balance as user input** — Spec 22 listed this as a gap document, but spec 25 wireframe shows it with an orange "self-disclosed" badge. Added as an input question so equity calculation uses real user estimate rather than a payment-based heuristic.

3. **Bank connect → confirmation directly** — After bank connection completes, the user goes straight to the confirmation flow (not back to task list). This matches the wireframe intent where confirmation IS the preparation phase.

4. **Accordion stays open until user action** — Originally auto-closed after 800ms. Changed per user feedback: accordion opens when section completes, stays open during mini-summary review, closes when user clicks "This looks correct".

5. **Spending and debts panels are placeholders** — Wireframes marked "TBC I NEED TO DESIGN THIS PANEL". Placeholder cards with "+ Add" buttons are in place.

## Bugs found and fixed

1. **Vercel build failure** — `bank-data-utils.ts` compared `ext.account_type === 'credit_card'` but `BankStatementExtraction.account_type` doesn't include `'credit_card'`. TypeScript correctly flagged this as an impossible comparison. Fixed by simplifying to savings/current ternary.

2. **Accordion timing** — Initial implementation used `setAccordionOpen(false)` immediately on section confirm, so users never saw the completed tab appear. Added choreographed timing: open on complete → stay open during summary → close on next.

## Session 11 plan

| Priority | What | Notes |
|---|---|---|
| 1 | **Visual design pass** | The journey is functional but needs Airbnb-level polish. Typography, spacing, cards, buttons, colour refinement, animation easing. Touches every screen from sessions 9-10. Do this before building more screens. |
| 2 | **Post-connection task list (screen 2j)** | Dynamic task generation from confirmation answers — gap documents become upload tasks, CETV becomes an action. All three phases active. Fully specced. |
| 3 | **Edit flows from financial summary** | [Edit] links from section cards back to confirmation questions. |
| 4 | **Connect another bank account** | "+" button on accounts card — re-enters Tink flow. |

**Deferred (not session 11):**
- Spending panel + spending categorisation flow — blocked on user wireframe
- Decision tree fidelity pass (spec 22 full coverage) — session 12+, paired with Tink sandbox test bank connection
- Debts panel — blocked on user wireframe

## Files changed

```
NEW:
src/lib/bank/bank-data-utils.ts          — BankStatementExtraction → RevealItem/ConnectedAccount + demo factory
src/lib/bank/confirmation-questions.ts   — Spec 22 question generation + mini-summary generation
src/components/workspace/progress-stepper.tsx — Segmented progress bar
src/components/workspace/section-mini-summary.tsx — Per-section tick list + gap messages
src/components/workspace/confirmation-flow.tsx — Flow shell: state machine, frame, accordion
src/components/workspace/financial-summary-page.tsx — Screen 3a with source badges

MODIFIED:
src/app/api/bank/callback/route.ts       — Include raw extraction in results
src/app/workspace/page.tsx               — Add confirmation view, store extractions
src/components/workspace/bank-connection-flow.tsx — Replace mocks with real/demo data pipeline
```
