# Session 14 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 13 accomplished

**Spending flow built end-to-end + transaction enrichment research.**

- **Bud vs Tink enrichment evaluated**: Bud offers 210+ categories, logos, regularity detection. Our Tink integration doesn't use their dedicated enrichment API. Decision: build with Tink's existing PFM categories, design for upgrade later (D16, D17).
- **Complete spending flow**: Fork (now vs estimates) → estimates path (6 Form E categories, amber badges, upgrade nudge) OR bank data path (per sub-category: show found → gap question → checkbox selection → transaction search with typeahead → sub-category summary with smart calcs).
- **5 small focused components**: spending-fork, spending-estimates, spending-search, spending-categorise, spending-flow orchestrator.
- **New UI pattern**: Sub-category breadcrumb bar (bold current, fading upcoming, not clickable).
- **Upgrade path wired**: Task list + financial summary both link to full bank data categorisation when estimates were used.
- **Financial summary**: Spending section with estimated (amber) vs confirmed (green) states.

## Current state of the codebase

**What's working end-to-end:**
- Full flow: carousel → task list → bank connect (popup) → reveal → confirmation (5 sections) → spending (6th section) → financial summary → task list (2j)
- Spending: both estimates and bank data paths complete
- Spending upgrade: task list and financial summary both route to full categorisation
- Decision trees: all 5 confirmation sections + spending have comprehensive branching
- Visual design: Airbnb/Emma/Habito direction on every screen

**What's placeholder/mock:**
- Edit flows: links exist across spending and financial summary but not wired
- Children picture section: not built — **wireframes needed from user**
- Post-divorce life/needs section: not built — **wireframes needed from user**
- Mega footer: not built — **wireframes delivered but not yet implemented**
- Connect another bank: not built
- Browser testing of spending flow: not done — needs visual QA
- TypeScript: `SectionSummaryData.sectionKey` type needs widening to include 'spending'
- `WorkspaceView` type defined locally in page.tsx — should move to hub.ts
- Demo transactions hardcoded — should derive from bank extractions

## Session 14 deliverables — priority order

### Tier 1: Visual QA + fixes
1. **Browser test the spending flow** — run dev server, walk through both paths, fix any visual/interaction issues
2. **Fix TypeScript issues** — widen SectionSummaryData type, move WorkspaceView to hub.ts

### Tier 2: User's next wireframes
3. **Children picture section** — wireframes needed, maps to Form E Part 4
4. **Post-divorce life / needs section** — wireframes needed, maps to Form E 3.1
5. **Mega footer** — wireframes delivered session 13, implement the 4-column layout

### Tier 3: Polish + infrastructure
6. **Edit flow pattern** — needs wireframe design for a consistent edit/update journey across app
7. **Decision tree test mode** — dev-only way to validate branching paths
8. **Celebration patterns (backlog #84)** — green flash + count-up
9. **Demo data enrichment** — edge case personas
10. **Copy/content tightening pass**

### Tier 4: Blocked / future
- Edit flows from financial summary (blocked on edit wireframe)
- Connect another bank account (blocked on wireframe)
- Supabase persistence (#65)
- Bud/Tink enrichment upgrade (blocked on Tink Console investigation)

## Negative constraints
1. **Do not apply old spec 18 colours** — superseded by spec 27
2. **Do not reference pre-pivot specs (03-06, 11, 12)**
3. **Red `#E5484D` is for primary CTAs only** — not status, not decoration
4. **Shadow-based card separation** — no borders on cards
5. **All filled buttons are red** — no black/ink filled buttons
6. **Tink uses popup, not iframe** — Tink blocks iframe embedding
7. **Edit flows are placeholder** — don't wire up without wireframes for the edit pattern

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-13.md                 — Most recent session retro
docs/workspace-spec/27-visual-direction-session11.md — Visual direction
docs/workspace-spec/22-confirmation-flow-tree.md — Decision tree spec
docs/workspace-spec/26-transitions-animations.md — Transitions and animations
src/components/workspace/welcome-carousel.tsx  — Carousel
src/components/workspace/task-list-home.tsx     — Task list with spending upgrade task
src/components/workspace/bank-connection-flow.tsx — Bank connection (popup) + reveal
src/components/workspace/confirmation-flow.tsx  — Habito-style Q&A + spending integration
src/components/workspace/spending-fork.tsx      — S1a: now vs estimates fork
src/components/workspace/spending-estimates.tsx — S1b/S1c-1: estimates form + summary
src/components/workspace/spending-search.tsx    — S2d: transaction search with typeahead
src/components/workspace/spending-categorise.tsx — S2a-S2f: per-category confirmation loop
src/components/workspace/spending-flow.tsx      — Thin orchestrator + S1c-2 full summary
src/components/workspace/section-mini-summary.tsx — Per-section summaries
src/components/workspace/progress-stepper.tsx   — Red progress bar (6 segments now)
src/components/workspace/financial-summary-page.tsx — Financial summary with spending card
src/lib/bank/bank-data-utils.ts               — Extraction utils + transaction search + demo data
src/lib/bank/confirmation-questions.ts         — Question + summary generation (5 sections)
src/app/workspace/page.tsx                     — Flow state machine (6 views)
src/types/hub.ts                               — All types including spending types
src/app/globals.css                            — Design tokens + animations
docs/v2/v2-decisions.md                        — Decisions register (D1-D17)
```
