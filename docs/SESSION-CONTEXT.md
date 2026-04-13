# Session 11 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 10 accomplished

**Confirmation flow + financial summary — ~1,550 lines across 10 files.**

Built the core confirmation interaction:
- Wired real Tink bank data through entire journey (replaced all mock data)
- Confirmation flow: income → property → accounts → pensions → debts Q&A
- Section mini-summaries with confirmed facts, gap messages, equity calculation
- Progress stepper, accordion with completed section tabs
- Financial summary page (screen 3a) with green/orange source badges
- Mortgage balance question for proper equity calculation (value − balance)
- Accordion choreography: opens on section complete, stays open during review, closes on continue

**Quality checkpoint results:**
- [x] Full flow: carousel → task list → connect → reveal → confirm all sections → summary
- [x] Source badges (green/orange) render correctly
- [x] Accordion expand/collapse with completed section tabs
- [x] Mini-summaries show calculated equity value
- [x] Gap messages appear inline
- [x] "Skip for now" works without breaking flow
- [x] Reveal shows data from pipeline (demo extraction, same code path as real Tink)
- [ ] Post-connection task list (screen 2j) — not built yet
- [ ] Visual polish — functional but needs design pass

## Current state of the codebase

**What's real:**
- Full navigation: carousel → task list → bank connect → reveal → confirmation → financial summary
- Bank data pipeline: Tink callback → transformer → extraction → reveal items + confirmation questions
- Demo fallback through identical pipeline when Tink not configured
- Confirmation flow with branching logic (salary yes/no, mortgage detected/not, joint/sole ownership)
- Financial summary with source badges, equity calculations, section cards

**What's mock/placeholder:**
- Demo `BankStatementExtraction` covers employed homeowner only (session 12 fidelity pass)
- Spending panel: "Panel design pending" placeholder (blocked on user wireframe)
- Debts panel: placeholder (blocked on user wireframe)
- Post-connection task list (screen 2j): not yet dynamic
- No persistence (state resets on refresh)

**Old components still present but unused:**
- `src/components/hub/hero-panel.tsx`, `discovery-flow.tsx`, `evidence-lozenge.tsx`, `fidelity-label.tsx`
- `src/hooks/use-hub.ts`
- `src/components/workspace/financial-summary.tsx` (legacy v1 component, different from new `financial-summary-page.tsx`)

## Session 11 deliverables

### Goal: Visual design pass + post-connection task list

**Priority order:**

1. **Visual design pass** — the journey works end-to-end but looks like raw Tailwind. This is the priority:
   - Typography hierarchy (heading sizes, weights, letter-spacing across all screens)
   - Card styling (border treatment, shadows, corner radius consistency)
   - Button system (primary/secondary/ghost states, hover/active/disabled)
   - Spacing rhythm (consistent padding/margins across carousel, task list, confirmation, summary)
   - Colour refinement (green/orange badges, info boxes, progress bar, locked phases)
   - Mobile responsive polish
   - Animation easing curves refined to match spec 26 exactly
   - Reference: Airbnb minimalism for palette/spacing, Emma app for interaction patterns
   - Spec 18 tokens (spacing, typography, shadows) are still valid — colour palette superseded

2. **Post-connection task list (screen 2j)** — the home page after confirmation:
   - Dynamic tasks generated from confirmation answers
   - Gap documents become specific upload actions (payslips, mortgage statement, CETV)
   - All three phases active (Preparation, Sharing, Finalisation)
   - "View financial summary" link
   - Pension CETV action task
   - MIAM booking, divorce application tasks
   - "+ Add more tasks" per phase
   - Fully specced in `docs/workspace-spec/25-wireframe-spec-part2.md` screen 2j

3. **Edit flows from financial summary** — [Edit] links from section cards back to confirmation questions

4. **Connect another bank account** — "+" button on accounts card

### Quality checkpoint before ending session 11:
- [ ] Visual quality feels like a premium fintech product (Airbnb-level)
- [ ] Typography, spacing, and colour are consistent across ALL screens
- [ ] Post-connection task list shows dynamic tasks from confirmation answers
- [ ] Gap documents appear as specific upload tasks in Finalisation phase
- [ ] All three phases active on task list after confirmation
- [ ] "View financial summary" navigates to screen 3a
- [ ] Responsive on mobile — all screens
- [ ] prefers-reduced-motion fallbacks still work after visual pass

## CRITICAL reads before any code

1. **Spec 18** (`docs/workspace-spec/18-visual-design-system.md`) — spacing, typography, shadow tokens. Colour palette superseded but tokens valid.
2. **Spec 25** (`docs/workspace-spec/25-wireframe-spec-part2.md`) — screen 2j (post-connection task list) is the primary new build.
3. **Spec 26** (`docs/workspace-spec/26-transitions-animations.md`) — section 9: post-connection task list animations.

## Deferred work (NOT session 11)

| What | When | Why deferred |
|---|---|---|
| Spending panel + flow | When user delivers wireframe | Blocked on user design work |
| Debts panel | When user delivers wireframe | Blocked on user design work |
| Decision tree fidelity (spec 22) | Session 12+ | Pair with Tink sandbox test bank for real signal coverage |
| Tink sandbox test bank | Session 12+ | Pair with decision tree fidelity pass |
| Supabase persistence | Session 13+ | Backlog item #65, requires auth upgrade |

## Negative constraints
1. **Do not build spending panel** — wireframe not delivered yet, placeholder is fine
2. **Do not build debts flow** — wireframe not delivered yet
3. **Do not expand decision tree** — session 12 work, paired with test bank data
4. **Do not connect Tink sandbox** — deferred to session 12 alongside fidelity pass
5. **Do not apply spec 18 colours to new components** — colour palette superseded, will be updated in visual pass
6. **Do not reference pre-pivot specs (03-06, 11, 12)**
7. **Transitions are not optional** — spec 26 for every state change

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-10.md                 — Most recent session retro
docs/workspace-spec/18-visual-design-system.md — Token system (spacing, typography, shadows)
docs/workspace-spec/25-wireframe-spec-part2.md — Screen 2j post-connection task list + all confirmation screens
docs/workspace-spec/26-transitions-animations.md — Animation timings (section 9 for task list)
src/components/workspace/welcome-carousel.tsx  — Carousel (done)
src/components/workspace/task-list-home.tsx     — Task list home (needs 2j dynamic state)
src/components/workspace/bank-connection-flow.tsx — Bank connection + reveal (done)
src/components/workspace/confirmation-flow.tsx  — Confirmation Q&A (done)
src/components/workspace/section-mini-summary.tsx — Per-section summaries (done)
src/components/workspace/progress-stepper.tsx   — Progress bar (done)
src/components/workspace/financial-summary-page.tsx — Financial summary with badges (done)
src/lib/bank/bank-data-utils.ts               — Extraction → UI type converters + demo factory
src/lib/bank/confirmation-questions.ts         — Spec 22 question + summary generation
src/app/workspace/page.tsx                     — Flow state machine orchestrator
src/types/hub.ts                               — All types
src/app/globals.css                            — Animations + tokens
```
