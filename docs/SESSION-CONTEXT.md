# Session 12 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 11 accomplished

**Visual design pass + post-connection task list + bug fixes — merged to main.**

- New visual direction synthesised from Airbnb, Emma, Habito screenshots (spec 27)
- Decouple red accent `#E5484D` for ALL primary CTAs and progress bars
- Shadow-based card separation (no borders), 12px border-radius
- Page width 1080px, 600px form column
- Centred "Decouple" logo header, hamburger flyout nav, bell/cog placeholders
- Habito-style radio cards with black inversion + explicit red "Continue"
- Post-connection task list (screen 2j) with dynamic tasks from confirmations
- 7 bug fixes from user review (duplicates, badges, stepper, header, button colours)

## Current state of the codebase

**What's working end-to-end:**
- Full flow: carousel → task list → bank connect → reveal → confirmation → financial summary → task list (2j)
- Tink test bank works on production URL (`construct-dev.vercel.app`) — merged to main
- Demo fallback when Tink creds not set
- Visual design: Airbnb/Emma/Habito direction on every screen
- Dynamic task generation: preparation, sharing, finalisation tasks from confirmation data
- All buttons follow red accent hierarchy

**What's placeholder/mock:**
- Spending panel: "Panel design pending" (blocked on wireframe)
- Debts panel: placeholder (blocked on wireframe)
- Edit flows: [Edit] links in accordion exist but not wired (blocked on wireframe)
- Connect another bank: not built (blocked on wireframe)
- Hamburger flyout: placeholder menu items
- Bell + cog icons: no functionality
- No persistence (state resets on refresh)

## Session 12 deliverables — priority order

### Tier 1: Ready to build now (no wireframes needed)

1. **Verify Tink test bank on production** — branch is now on main. Walk through full flow with Tink sandbox to confirm iframe, callback, and data extraction work end-to-end with the new visual design.

2. **Decision tree fidelity pass (spec 22)** — improve question branching for edge cases. Pair with Tink sandbox test bank data to see what real signals look like vs demo data. The demo persona covers employed homeowner with pension + savings — test other profiles.

3. **Celebration patterns (backlog #84)** — green flash on section complete, value count-up on financial summary cards. Spec 26 already defines the animations. Quick visual polish.

4. **Demo data enrichment** — add edge case personas (renting, no pension, self-employed). Test the confirmation flow handles each correctly.

5. **Copy/content pass** — tighten remaining copy across all screens to match the brevity standard (Emma-style: if it can be said in 4 words, don't use 8).

### Tier 2: Good candidates, no wireframes needed

6. **AI pipeline: structured outputs (#45-47, #69)** — replace JSON parsing with Anthropic schema-constrained generation. Eliminates the most fragile part of the pipeline. Spec 13 defines everything needed.

7. **Test suite (#70)** — zero tests currently. Core extraction logic, confirmation question generation, and state management all need coverage.

8. **Structured summary export (#60)** — plain language summary at current fidelity level, shareable with mediator/solicitor. Data is all there, just needs a render.

9. **Error retry on AI failure (#73)** — automatic retry with backoff on extraction failures.

### Tier 3: Blocked on user wireframes

10. **Edit flows from financial summary** — [Edit] links back to confirmation questions
11. **Connect another bank account** — "+" button re-enters Tink flow
12. **Spending panel + categorisation flow**
13. **Debts panel**

### Tier 4: Larger initiatives (future sessions)

- Supabase persistence (#65) — requires auth upgrade
- Side-by-side PDF review modal (#38)
- Multi-document upload (#36)
- Auth upgrade: magic link + Google (#67)

## Negative constraints
1. **Do not build spending panel** — wireframe not delivered
2. **Do not build debts flow** — wireframe not delivered
3. **Do not apply old spec 18 colours** — superseded by spec 27
4. **Do not reference pre-pivot specs (03-06, 11, 12)**
5. **Red `#E5484D` is for primary CTAs only** — not status, not decoration
6. **Shadow-based card separation** — no borders on cards
7. **All filled buttons are red** — no black/ink filled buttons

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-11.md                 — Most recent session retro
docs/workspace-spec/27-visual-direction-session11.md — Visual direction (Airbnb/Emma/Habito)
docs/workspace-spec/25-wireframe-spec-part2.md — Wireframes: confirmation flow, summaries, screen 2j
docs/workspace-spec/26-transitions-animations.md — Transitions and animations
docs/workspace-spec/22-confirmation-flow-tree.md — Decision tree for all Form E sections
src/components/workspace/welcome-carousel.tsx  — Carousel
src/components/workspace/task-list-home.tsx     — Task list with dynamic screen 2j
src/components/workspace/bank-connection-flow.tsx — Bank connection + reveal
src/components/workspace/confirmation-flow.tsx  — Habito-style Q&A
src/components/workspace/section-mini-summary.tsx — Per-section summaries
src/components/workspace/progress-stepper.tsx   — Red progress bar with step counter
src/components/workspace/financial-summary-page.tsx — Financial summary with source badges
src/components/hub/title-bar.tsx               — Header: logo, hamburger flyout, bell/cog
src/lib/bank/bank-data-utils.ts               — Extraction → UI types + demo factory
src/lib/bank/confirmation-questions.ts         — Question + summary generation
src/app/workspace/page.tsx                     — Flow state machine
src/app/globals.css                            — Design tokens
src/types/hub.ts                               — All types
```
