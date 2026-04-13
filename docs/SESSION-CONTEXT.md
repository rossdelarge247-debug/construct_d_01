# Session 12 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 11 accomplished

**Visual design pass + post-connection task list — ~822 net lines across 11 files.**

Transformed the entire UI from raw Tailwind to a cohesive fintech design language:
- New visual direction doc (`docs/workspace-spec/27-visual-direction-session11.md`) synthesised from Airbnb, Emma, and Habito references
- Decouple red accent `#E5484D` for primary CTAs and progress bars
- Shadow-based card separation (no borders), 12px border-radius throughout
- Page width widened from 720px to 1080px, 600px content column for forms
- Centred "Decouple" logo header with hamburger flyout nav + bell/cog icons
- Habito-style radio cards: near-black inversion on selection, explicit "Continue" button
- Progress stepper: red fill, "N of M" counter, bar matches counter
- Post-connection task list (screen 2j): dynamic tasks from confirmation data, all three phases active
- Multiple bug fixes: duplicate section list, missing Edit links, badge labels, stepper sync, header back/hamburger

## Current state of the codebase

**What's real:**
- Full navigation: carousel → task list → bank connect → reveal → confirmation → financial summary
- Visual design: Airbnb/Emma/Habito direction applied to every screen
- Bank data pipeline: Tink callback → transformer → extraction → reveal + confirmation
- Demo fallback through identical pipeline when Tink not configured
- Post-connection task list (screen 2j): dynamic preparation/sharing/finalisation tasks
- Habito-style Q&A with Decouple red CTAs and black-inversion radio cards
- Hamburger nav with Airbnb-style flyout placeholder

**What's mock/placeholder:**
- Demo `BankStatementExtraction` covers employed homeowner with pension and savings
- Spending panel: "Panel design pending" placeholder (blocked on user wireframe)
- Debts panel: placeholder (blocked on user wireframe)
- Edit flows from financial summary: [Edit] links exist but not wired (blocked on wireframe)
- Connect another bank account: not built (blocked on wireframe)
- Hamburger nav flyout: placeholder items (Help Centre, My profile, My cases, Sign out)
- Bell + cog icons: placeholder (no functionality)
- No persistence (state resets on refresh)

## Session 12 deliverables

### Priority order:

1. **Merge to main and verify Tink test bank** — branch needs merging so Tink iframe works on production URL. Verify the full flow with test bank credentials.

2. **Edit flows from financial summary** — [Edit] links back to confirmation questions. BLOCKED: needs wireframe from user.

3. **Connect another bank account** — "+" button re-enters Tink flow. BLOCKED: needs wireframe from user.

4. **Decision tree fidelity pass (spec 22)** — pair with Tink sandbox test bank for real signal coverage. Improve question branching and demo data.

5. **Celebration patterns (#84)** — green flash on section complete, value count-up on financial summary cards. Spec 26 already defines animations.

6. **Demo data enrichment** — richer persona coverage, edge cases.

### Candidates not blocked on wireframes:
- AI pipeline: structured outputs (#45-47), two-step extraction
- Test suite (#70): zero tests currently
- Structured summary export (#60): shareable with mediator
- Error retry on AI failure (#73)
- Copy/content pass: tighten remaining copy

### Still blocked on wireframes:
- Spending panel + categorisation flow
- Debts panel
- Edit flows from financial summary
- Connect another bank account

## Negative constraints
1. **Do not build spending panel** — wireframe not delivered yet
2. **Do not build debts flow** — wireframe not delivered yet
3. **Do not apply old spec 18 colours** — superseded by session 11 visual direction (spec 27)
4. **Do not reference pre-pivot specs (03-06, 11, 12)**
5. **Transitions are not optional** — spec 26 for every state change
6. **Red `#E5484D` is for CTAs only** — not for status, errors, or decoration
7. **Shadow-based card separation** — no borders on cards

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-11.md                 — Most recent session retro
docs/workspace-spec/27-visual-direction-session11.md — NEW: Visual direction (Airbnb/Emma/Habito synthesis)
docs/workspace-spec/24-wireframe-spec-part1.md — Wireframes: carousel, task list, bank connection, reveal
docs/workspace-spec/25-wireframe-spec-part2.md — Wireframes: confirmation flow, summaries, screen 2j
docs/workspace-spec/26-transitions-animations.md — Every transition, animation, and micro-interaction
docs/workspace-spec/22-confirmation-flow-tree.md — Complete decision tree for all Form E sections
src/components/workspace/welcome-carousel.tsx  — Carousel (visual pass done)
src/components/workspace/task-list-home.tsx     — Task list with dynamic screen 2j (visual pass done)
src/components/workspace/bank-connection-flow.tsx — Bank connection + reveal (visual pass done)
src/components/workspace/confirmation-flow.tsx  — Habito-style Q&A (visual pass done)
src/components/workspace/section-mini-summary.tsx — Per-section summaries (visual pass done)
src/components/workspace/progress-stepper.tsx   — Red progress bar with step counter (visual pass done)
src/components/workspace/financial-summary-page.tsx — Financial summary with source badges (visual pass done)
src/components/hub/title-bar.tsx               — Centred logo header with hamburger flyout + bell/cog
src/lib/bank/bank-data-utils.ts               — Extraction → UI types + demo factory
src/lib/bank/confirmation-questions.ts         — Spec 22 question + summary generation
src/app/workspace/page.tsx                     — Flow state machine orchestrator
src/app/globals.css                            — Design tokens (red accent, shadows, 12px radius, 1080px width)
src/types/hub.ts                               — All types
```
