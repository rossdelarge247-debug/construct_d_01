# Session 9 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.

## CRITICAL: Read before writing any code

**Session 8 was a major design session.** 30 wireframes were reviewed. The entire UX architecture has changed. Before writing code, you MUST read:

1. **Specs 24-25** (`docs/workspace-spec/24-wireframe-spec-part1.md` and `25-wireframe-spec-part2.md`) — screen-by-screen wireframe spec. Every interaction, every state, every copy pattern. **Implement these exactly.**
2. **Spec 26** (`docs/workspace-spec/26-transitions-animations.md`) — every transition, animation, and micro-interaction. **These are not optional.**
3. **Spec 22** (`docs/workspace-spec/22-confirmation-flow-tree.md`) — the decision logic for every Form E section.
4. **CLAUDE.md** — updated with visual direction (Airbnb + Emma), wireframe fidelity rules, new product rules.

**The user may reshare specific wireframe images** during the session for reference. Always defer to the wireframes over the text specs if there's any ambiguity.

## What session 8 accomplished

**Planning only — no code changes.**

7 new spec documents:
- Spec 20: Bank-first journey redesign (flow, hero panel revision)
- Spec 21: Evidence model (what bank data proves per Form E section)
- Spec 22: Confirmation flow tree (complete decision tree for all sections)
- Spec 23: Post-confirmation gap summary (what's proved vs what needs docs)
- Spec 24: Wireframe spec part 1 (carousel, task list, bank connection, reveal)
- Spec 25: Wireframe spec part 2 (confirmation flow, summaries, financial hub, task list)
- Spec 26: Transitions and animations (every state change, timing, easing)

Updated CLAUDE.md with:
- Visual direction: Airbnb colour palette/minimalism + Emma IxD/forms
- Wireframe fidelity rule: implement as designed, do not reinterpret
- "Connect-first, confirm-by-exception" replaces "Upload-first, review-by-exception"
- "Show, don't ask" principle
- "Delight matters" — transitions are not optional

## Architecture changes from wireframes

The wireframes introduce a fundamentally new page architecture:

| Old (sessions 1-7) | New (wireframes) |
|---|---|
| Hero panel as primary component | Task list as home page |
| 8-state hero panel state machine | Section-by-section confirmation within task list |
| Static lozenges from config | Dynamic task list from bank data analysis |
| Upload-first flow | Connect-first flow |
| Single hub page | Task list home + financial summary sub-page |
| Fidelity labels | Three-phase model (Preparation → Sharing → Finalisation) |

**Components to retire:** `hero-panel.tsx`, `evidence-lozenge.tsx`, `discovery-flow.tsx`, `fidelity-label.tsx`

**Components to build:**
- `TaskListHome` — three-phase task list (screens 2a, 2j)
- `WelcomeCarousel` — onboarding slides (screens 1a-1c)
- `BankConnectionFlow` — loader, dim, modal, reveal (screens 3, 3b-3e)
- `ConfirmationFlow` — section-by-section Q&A within task list frame (screens 2b-2i)
- `SectionMiniSummary` — per-section summary with gap messages (screens 2d-a/b/c)
- `FinancialSummary` — full financial picture with source badges (screen 3a)

**Types to update:**
- Retire `HeroPanelState` — replace with `ConfirmationSection` and `Phase`
- Add `evidenceSource: 'bank_connection' | 'self_disclosed' | 'document'` to `FinancialItem`
- Add `TaskItem`, `Phase`, `SectionConfirmation` types
- Update `HubState` with `completedSections`, `currentSection`, `phase`

## Three-session build plan

### Session 9 — Foundation (this session)
**Goal:** New page structure running with placeholders. The app navigates the full flow skeleton.

Tasks:
1. New types (`TaskItem`, `Phase`, `SectionConfirmation`, updated `FinancialItem`)
2. `WelcomeCarousel` component (screens 1a-1c)
3. `TaskListHome` component (screen 2a first-time state)
4. `BankConnectionFlow` component (screens 3, 3b-3e) — switch Tink to iframe/drop-in mode
5. Reveal animation (screen 3d) — progressive tick list
6. Page routing: task list as home, financial summary as sub-route

**Quality checkpoint before ending session 9:**
- [ ] Can navigate: carousel → task list → bank connect → reveal → completion
- [ ] Transitions match spec 26 timings
- [ ] Tink opens in modal, not redirect
- [ ] Responsive on mobile
- [ ] `prefers-reduced-motion` fallbacks work

### Session 10 — Confirmation flow + financial summary
**Goal:** Full confirmation flow working with bank data, financial summary populated.

Tasks:
1. `ConfirmationFlow` component — section-by-section Q&A (screens 2b-2i)
2. `SectionMiniSummary` component with gap messages (screens 2d-a/b/c)
3. Accordion expand/collapse behaviour
4. Progress stepper advancing per section
5. `FinancialSummary` page with source badges (screen 3a)
6. Wire confirmation answers to financial summary data
7. Placeholder cards for spending and debts panels

**Quality checkpoint before ending session 10:**
- [ ] Full flow: carousel → task list → connect → reveal → confirm all sections → summary → financial hub
- [ ] Source badges (green/orange) render correctly
- [ ] Accordion expand/collapse animations match spec 26
- [ ] Mini-summaries show calculated values (equity)
- [ ] Gap messages appear inline with correct copy
- [ ] Every "Skip for now" works without breaking the flow

### Session 11 — Task list evolution + visual polish
**Goal:** Post-connection task list fully dynamic. Visual design pass begins.

Tasks:
1. `TaskListHome` post-connection state (screen 2j) — dynamic task generation from confirmation data
2. Finalisation section with specific upload tasks
3. Sharing & collaboration section (placeholder CTAs)
4. Slot in spending categorisation wireframes (if available by then)
5. Begin visual design pass: Airbnb palette, Emma IxD patterns
6. Upload flow within finalisation (if wireframes available)

**Quality checkpoint before ending session 11:**
- [ ] Task list dynamically generates from bank data + confirmation answers
- [ ] Gap documents appear as specific upload tasks in Finalisation
- [ ] Visual design matches Airbnb/Emma direction
- [ ] All transitions from spec 26 implemented
- [ ] Mobile responsive throughout

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
6. **Tink redirect URIs must be whitelisted** — and now use iframe/drop-in mode

## Key files
```
docs/workspace-spec/24-wireframe-spec-part1.md — START HERE: screens 1a-3e
docs/workspace-spec/25-wireframe-spec-part2.md — Screens 2b-2j
docs/workspace-spec/26-transitions-animations.md — All animations
docs/workspace-spec/22-confirmation-flow-tree.md — Decision logic
docs/workspace-spec/23-post-confirm-gap-summary.md — Gap analysis reference
docs/workspace-spec/20-bank-first-journey.md    — Journey overview
docs/workspace-spec/21-evidence-model.md        — Evidence model
src/hooks/use-hub.ts                            — To be refactored (retire hero panel state)
src/components/hub/hero-panel.tsx                — To be retired
src/lib/bank/tink-client.ts                     — Tink API (needs iframe mode)
src/lib/bank/tink-transformer.ts                — Tink → BankStatementExtraction
src/lib/ai/result-transformer.ts                — Decision trees (still valid)
src/types/hub.ts                                — Types (needs major update)
```
