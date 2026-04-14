# Session 13 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 12 accomplished

**Decision tree fidelity pass across all 5 sections + Tink popup fix.**

- **Tink fixed**: iframe embedding blocked by Tink (`INVALID_STATE_EMBED_NOT_ALLOWED`). Switched to popup window with `window.open()` + `postMessage` callback. Client_id-only mode (no auth code needed). Full end-to-end Tink test bank connection now works.
- **Property decision tree**: government schemes (Help to Buy, shared ownership, Right to Buy) with correct equity calculations, sole/joint/other ownership, who lives there, property status, expanded no-signal path (5 housing situations), negative equity handling.
- **Income decision tree**: multiple employer detection, HMRC benefits auto-confirm, DWP classification (UC/PIP/ESA/Carer's/State Pension), self-employed follow-up (business structure), retired follow-up (pension status), 6 no-income paths.
- **Accounts decision tree**: joint account detection, investment platform pattern-matching (HL, Vanguard, AJ Bell etc.), crypto exchange detection (Coinbase, Binance etc.), top 3 transfer classification, premium bonds, catch-all for undisclosed accounts.
- **Pensions decision tree**: DB vs DC distinction, CETV status + education, multiple pension handling, already drawing path, "not sure" help text, count tracking.
- **Debts decision tree**: credit card provider detection + outstanding balance, BNPL detection, overdraft detection, loan purpose (home/car/consolidation/business), sole/joint per debt, car finance type (PCP/HP/lease — HP means car is asset), student loan type (SLC vs private), tax debts, informal debts.
- **Extended `showWhen` mechanism**: now supports `value: string | string[]` for multi-path branching.
- **TinkModal cleaned up**: developer placeholder replaced with clean demo prompt.

## Current state of the codebase

**What's working end-to-end:**
- Full flow: carousel → task list → bank connect (popup) → reveal → confirmation → financial summary → task list (2j)
- Tink test bank works via popup window on production URL
- Demo fallback with clean "Try the experience" prompt when Tink not configured
- Decision trees: all 5 sections have comprehensive branching matching Form E requirements
- Visual design: Airbnb/Emma/Habito direction on every screen
- Dynamic task generation from confirmation data

**What's placeholder/mock:**
- Spending panel: "Panel design pending" — **wireframes now delivered, ready to build**
- Children picture section: not built — **wireframes delivered, ready to build**
- Post-divorce life/needs section: not built — **wireframes delivered, ready to build**
- Mega footer: not built — **placeholder wireframe delivered**
- Edit flows: [Edit] links exist but not wired
- Connect another bank: not built
- Hamburger flyout: placeholder menu items
- No persistence (state resets on refresh)
- No test mode for decision tree validation

## Session 13 deliverables — priority order

### Tier 1: User's priorities (wireframes delivered)

1. **Spending panel + categorisation flow** — wireframes now delivered. Build the spending section with the "search for transaction" pattern for identifying and categorising bank transactions. Decision tree for spending follows the same ladder approach as other sections.

2. **Children picture section** — wireframes delivered. Build the children section with questions mapping to Form E Part 4. Cross-section: Child Benefit in Income infers child count.

3. **Post-divorce life / needs section** — wireframes delivered. Build the post-separation budgetary needs section mapping to Form E Part 3.1.

4. **Mega footer placeholder** — wireframes delivered. Implement the footer design.

### Tier 2: Infrastructure / quality

5. **Decision tree test mode** — a way to validate all decision tree branches work correctly. Could be a dev-only mode that lets you select a persona and auto-fill answers, or a unit test suite over `confirmation-questions.ts`.

6. **Celebration patterns (backlog #84)** — green flash on section complete, value count-up on financial summary cards. Spec 26 defines the animations.

7. **Demo data enrichment** — add edge case personas (renting, no pension, self-employed) to test the new decision tree branches.

8. **Copy/content tightening pass** — tighten copy across all screens.

### Tier 3: Good candidates

9. **AI pipeline: structured outputs (#45-47)**
10. **Test suite (#70)** — especially for confirmation question generation
11. **Structured summary export (#60)**

### Tier 4: Blocked / future

- Edit flows from financial summary
- Connect another bank account
- Supabase persistence (#65)
- Auth upgrade (#67)

## Negative constraints
1. **Do not apply old spec 18 colours** — superseded by spec 27
2. **Do not reference pre-pivot specs (03-06, 11, 12)**
3. **Red `#E5484D` is for primary CTAs only** — not status, not decoration
4. **Shadow-based card separation** — no borders on cards
5. **All filled buttons are red** — no black/ink filled buttons
6. **Tink uses popup, not iframe** — Tink blocks iframe embedding

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-12.md                 — Most recent session retro
docs/workspace-spec/27-visual-direction-session11.md — Visual direction
docs/workspace-spec/22-confirmation-flow-tree.md — Decision tree spec (reference)
docs/workspace-spec/26-transitions-animations.md — Transitions and animations
src/components/workspace/welcome-carousel.tsx  — Carousel
src/components/workspace/task-list-home.tsx     — Task list with dynamic screen 2j
src/components/workspace/bank-connection-flow.tsx — Bank connection (popup) + reveal
src/components/workspace/confirmation-flow.tsx  — Habito-style Q&A + showWhen filtering
src/components/workspace/section-mini-summary.tsx — Per-section summaries
src/components/workspace/progress-stepper.tsx   — Red progress bar with step counter
src/components/workspace/financial-summary-page.tsx — Financial summary with source badges
src/components/hub/title-bar.tsx               — Header: logo, hamburger flyout, bell/cog
src/lib/bank/bank-data-utils.ts               — Extraction → UI types + demo factory
src/lib/bank/confirmation-questions.ts         — Question + summary generation (ALL 5 sections)
src/lib/bank/tink-client.ts                   — Tink API client
src/app/workspace/page.tsx                     — Flow state machine
src/app/api/bank/connect/route.ts             — Tink Link URL (popup, client_id-only)
src/app/api/bank/callback/route.ts            — Tink callback (popup postMessage + redirect)
src/app/globals.css                            — Design tokens + animations
src/types/hub.ts                               — All types
```
