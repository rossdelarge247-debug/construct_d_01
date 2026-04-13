# Session 10 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 9 accomplished

**Foundation build — ~960 lines changed across 9 files.**

New components built:
- `WelcomeCarousel` (screens 1a-1c) — 3-slide onboarding with fade transitions (200ms) and segmented progress bar (300ms)
- `TaskListHome` (screen 2a) — three-phase task list with first-time and post-connection states
- `BankConnectionFlow` (screens 3, 3b-3e) — loader → dim overlay → Tink modal → progressive reveal → completion
- `TinkModal` — iframe-based Tink Link integration with postMessage callback; graceful fallback when credentials not configured

New types added to `src/types/hub.ts`:
- `Phase`, `WorkspaceView`, `BankConnectionPhase`, `ConnectedAccount`, `RevealItem`, `TaskItem`, `SectionConfirmation`, `WorkspaceState`

Workspace page rewritten:
- Flow state machine: carousel → task_list → bank_connection → financial_summary
- Old hub components (hero panel, discovery flow, etc.) bypassed but preserved

Tink integration fixed:
- Connect route now uses authorization grant (not delegate) with correct Tink Link scopes
- Callback route supports both iframe (postMessage) and redirect modes
- Tested live on Vercel — Tink Link iframe loads and connects to real bank data

CSS animations added per spec 26:
- fadeIn, slideInLeft, modalAppear, shimmer
- `prefers-reduced-motion` fallback: all animations instant

Mobile responsiveness pass:
- Stacked layouts on narrow viewports
- Responsive padding (p-5 mobile, p-8 desktop)
- Responsive graphic heights

**Quality checkpoint results (all passed):**
- [x] Can navigate: carousel → task list → bank connect → reveal → completion
- [x] Transitions match spec 26 timings
- [x] Tink opens in modal, not redirect (tested live on Vercel)
- [x] Responsive on mobile
- [x] `prefers-reduced-motion` fallbacks work

## Current state of the codebase

**What's real:**
- Full navigation skeleton end-to-end
- Tink iframe integration (real bank connections work)
- All spec 26 animations for carousel, bank connection, and reveal

**What's mock/placeholder:**
- Reveal tick items use hardcoded wireframe data — not wired to Tink transformer output yet
- Completion screen accounts are mock data
- Task list post-connection is a static placeholder
- Financial summary is a placeholder page
- Confirmation flow does not exist yet

**Old components still present but unused:**
- `src/components/hub/hero-panel.tsx` — bypassed, not imported
- `src/components/hub/discovery-flow.tsx` — bypassed
- `src/components/hub/evidence-lozenge.tsx` — bypassed
- `src/components/hub/fidelity-label.tsx` — bypassed
- `src/hooks/use-hub.ts` — not imported by new workspace page

## Session 10 deliverables

### Goal: Confirmation flow + financial summary with real data

**Priority order:**

1. **Wire reveal to real Tink data** — replace mock `MOCK_REVEAL_ITEMS` and `MOCK_ACCOUNTS` with data from `tink-transformer.ts`. The reveal should show what the bank connection actually found.

2. **ConfirmationFlow component** (screens 2b-2i) — section-by-section Q&A within the task list frame:
   - Persistent frame: bank connection row with accordion, progress stepper, locked phases
   - Income section: salary detection, yes/no branching, gap planting
   - Property section: strong signal / no signal / ambiguous signal variants
   - Accounts section: transfer detection
   - Pensions section: no-signal path
   - Debts section: no-signal path
   - Read spec 25 carefully before building

3. **SectionMiniSummary component** (screens 2d-a/b/c) — per-section summary:
   - Tick list of confirmed facts
   - Inline gap messages (info boxes)
   - Calculated values (e.g. equity = property value - mortgage)
   - "This looks correct" / "I need to go back" actions
   - Accordion expansion to show completed sub-tab

4. **Progress stepper** — advances per section, filled segments per spec 26 timing

5. **FinancialSummary page** (screen 3a) — replace placeholder:
   - Section cards stacked vertically with stagger animation
   - Source badges: green (bank connection) / orange (self disclosed)
   - Calculated values, contextual guidance inline
   - "+ Add" buttons per section
   - Back to dashboard link

6. **Placeholder cards** for spending and debts (TBC panels in wireframes)

### Quality checkpoint before ending session 10:
- [ ] Full flow: carousel → task list → connect → reveal → confirm all sections → summary → financial hub
- [ ] Source badges (green/orange) render correctly
- [ ] Accordion expand/collapse animations match spec 26
- [ ] Mini-summaries show calculated values (equity)
- [ ] Gap messages appear inline with correct copy
- [ ] Every "Skip for now" works without breaking the flow
- [ ] Reveal shows real data from Tink transformer (not mock)

## CRITICAL reads before any code

1. **Spec 25** (`docs/workspace-spec/25-wireframe-spec-part2.md`) — confirmation flow screens, mini-summaries, financial hub, post-connection task list. **This is the primary spec for session 10.**
2. **Spec 22** (`docs/workspace-spec/22-confirmation-flow-tree.md`) — decision logic for every Form E section. Drives the confirmation Q&A.
3. **Spec 26** (`docs/workspace-spec/26-transitions-animations.md`) — sections 5-8 cover confirmation flow, mini-summary, final summary, and financial hub transitions.
4. **Spec 23** (`docs/workspace-spec/23-post-confirm-gap-summary.md`) — what's proved vs gaps after bank connect. Drives gap messages.

## Wireframes still pending from user

| Wireframe | Priority | Blocks |
|-----------|----------|--------|
| Spending categorisation dialogue | **Urgent** | Session 10 spending section |
| Spending panel (financial summary) | Soon | Session 10 financial summary |
| Debts panel (financial summary) | Soon | Session 10 financial summary |
| Build children picture flow | Later | Session 11+ |
| Needs after separation flow | Later | Session 11+ |
| Share & collaborate screens | Later | Session 11+ |

## Negative constraints
1. **Do not use `response_format`** — Anthropic SDK uses `output_config.format`
2. **Do not reference pre-pivot specs (03-06, 11, 12)** — architecture changed
3. **Do not reinterpret wireframes** — implement specs 24-25 as written
4. **Transitions are not optional** — implement spec 26 for every state change
5. **Never show Form E codes to users** — human-readable labels always
6. **Tink redirect URIs must be whitelisted** — iframe mode uses postMessage callback
7. **Reveal mock data must be replaced** — don't ship wireframe placeholder copy as real data

## Key files
```
src/components/workspace/welcome-carousel.tsx  — Carousel (done)
src/components/workspace/task-list-home.tsx     — Task list home (done, needs post-connection dynamic state)
src/components/workspace/bank-connection-flow.tsx — Bank connection + TinkModal + reveal (done, needs real data)
src/app/workspace/page.tsx                      — Flow state machine orchestrator
src/app/api/bank/connect/route.ts               — Tink Link auth + URL generation
src/app/api/bank/callback/route.ts              — Tink callback (iframe postMessage + redirect)
src/lib/bank/tink-client.ts                     — Tink API client (createTinkLinkAuthCode is the key function)
src/lib/bank/tink-transformer.ts                — Tink → BankStatementExtraction (wire to reveal)
src/lib/ai/result-transformer.ts                — Decision trees (drives confirmation Q&A)
src/types/hub.ts                                — All types (workspace types at top, legacy below)
src/app/globals.css                             — Animations + prefers-reduced-motion
docs/workspace-spec/25-wireframe-spec-part2.md  — PRIMARY SPEC for session 10
docs/workspace-spec/22-confirmation-flow-tree.md — Decision logic
docs/workspace-spec/26-transitions-animations.md — Animation timings
```
