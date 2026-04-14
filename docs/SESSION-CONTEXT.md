# Session 15 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 14 accomplished

**Bug fixes, testing infrastructure, and two new confirmation sections.**

- **7 bug fixes**: Tink popup race condition (postMessage vs close poll), duplicate income in accordion (dedup guard), progress stepper off-by-one (use currentIndex not completedCount), spending upgrade missing back link (dynamic return tracking), spending fork missing selection feedback (select then Continue), badge text inconsistency ("Bank confirmed"), TypeScript issues (SectionSummaryData type, WorkspaceView location, useState anti-pattern).
- **sessionStorage persistence**: All workspace state survives page reloads. Bridge until Supabase (#65).
- **Mega footer**: 4-column layout (Support with 6 links, Preparation/Sharing/Finalisation placeholders), bottom bar with Privacy + Copyright.
- **Celebration patterns**: Green flash + tick bounce on section confirm, count-up animation on final summary, progress bar pulse on completion. All respect prefers-reduced-motion.
- **Disconnect and clear data**: Black button on financial summary, clears all state + sessionStorage.
- **Dev mode fork panel**: After Tink returns, interstitial shows data receipt + 4 test persona buttons. Works with and without Tink credentials.
- **4 test personas**: Sarah (employed homeowner), Marcus (self-employed renter + crypto), Jean (retired + pensions), Aisha (part-time + benefits + debts).
- **Business section**: Signal detection (Companies House, HMRC SA), structure/value/accountant questions.
- **Other assets section**: New checklist step type for multi-select. Vehicle, crypto, investments, life insurance, valuables, overseas. Per-item value follow-ups.
- **Progress stepper**: Now 8 confirmation sections + spending = 9 segments.

## Current state of the codebase

**What works end-to-end:**
- Full flow: carousel, task list, bank connect (popup), dev chooser, reveal, confirmation (7 sections), spending (8th), financial summary, task list
- 7 confirmation sections: income, property, accounts, pensions, debts, business, other assets
- Spending: both estimates and bank data paths complete
- State persists across page reloads (sessionStorage)
- 4 test personas for decision tree testing
- Celebration animations on section completion
- Disconnect and clear data from financial summary
- Mega footer on all workspace screens

**What is placeholder/mock:**
- Edit flows: links exist but not wired
- Children picture section: not built, wireframes needed
- Post-divorce life/needs section: not built, wireframes needed
- Mega footer: Support links populated, other 3 columns Coming soon
- Bank name shows as UUID with real Tink data (transformer uses provider ID)
- CSV import for own banking data: not built

## Session 15 deliverables, priority order

### Tier 1: User wireframes
1. **Children picture section** — wireframes needed, maps to Form E Part 4
2. **Post-divorce life / needs section** — wireframes needed, maps to Form E 3.1

### Tier 2: Core gaps
3. **Edit/review flow** — wireframe needed for consistent edit pattern across confirmed data
4. **Structured summary export** — plain language summary shareable with mediator
5. **Return visit experience** — what does the user see when they come back?

### Tier 3: Quality
6. **Tink provider name fix** — human-readable bank names from Tink API
7. **Commonly omitted prompts** — director's loan, app-based accounts, closed accounts
8. **CSV import for dev testing** — load own bank data for realistic testing

### Tier 4: Infrastructure
9. **Auth + Supabase persistence** — data survives beyond browser session
10. **Test suite** — Vitest, currently 0 tests

## Negative constraints
1. Do not apply old spec 18 colours — superseded by spec 27
2. Do not reference pre-pivot specs (03-06, 11, 12)
3. Red #E5484D is for primary CTAs only — not status, not decoration
4. Shadow-based card separation — no borders on cards
5. All filled buttons are red — no black/ink filled buttons (except disconnect/destructive)
6. Tink uses popup, not iframe — Tink blocks iframe embedding
7. Edit flows are placeholder — do not wire up without wireframes

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-14.md                 — Most recent session retro
docs/workspace-spec/27-visual-direction-session11.md — Visual direction
docs/workspace-spec/22-confirmation-flow-tree.md — Decision tree spec
docs/workspace-spec/26-transitions-animations.md — Transitions and animations
src/components/workspace/welcome-carousel.tsx  — Carousel
src/components/workspace/task-list-home.tsx     — Task list with spending upgrade task
src/components/workspace/bank-connection-flow.tsx — Bank connection (popup) + dev chooser + reveal
src/components/workspace/confirmation-flow.tsx  — Q&A (7 sections) + checklist step type
src/components/workspace/spending-fork.tsx      — S1a: now vs estimates fork
src/components/workspace/spending-estimates.tsx — S1b/S1c-1: estimates form + summary
src/components/workspace/spending-search.tsx    — S2d: transaction search with typeahead
src/components/workspace/spending-categorise.tsx — S2a-S2f: per-category confirmation loop
src/components/workspace/spending-flow.tsx      — Thin orchestrator + S1c-2 full summary
src/components/workspace/section-mini-summary.tsx — Per-section summaries
src/components/workspace/progress-stepper.tsx   — Red progress bar (9 segments)
src/components/workspace/financial-summary-page.tsx — Financial summary + disconnect button
src/components/workspace/mega-footer.tsx       — 4-column footer
src/lib/bank/bank-data-utils.ts               — Extraction utils + 4 test personas + transaction search
src/lib/bank/confirmation-questions.ts         — Question + summary generation (7 sections)
src/hooks/use-count-up.ts                      — Count-up animation hook
src/app/workspace/page.tsx                     — Flow state machine (sessionStorage persistence)
src/app/globals.css                            — Design tokens + animations + celebration keyframes
src/types/hub.ts                               — All types including spending + workspace view
```
