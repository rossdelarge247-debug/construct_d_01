# Session 21 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. A divorce process disrupter: £800-1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):**
- Shared, not adversarial
- Evidenced, not asserted
- End-to-end, not hand-off

**Tagline:** "Decouple — the complete picture."

Every design decision, every screen, every piece of copy must honour this framing. Spec 42 is the authoritative source.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.
Tink credentials in Vercel env. Redirect URI whitelisted for `construct-dev.vercel.app/api/bank/callback`.

## What session 20 accomplished

**Design session — all 12 post-signup profiling gaps resolved or parked. No code changes.**

- Gaps 6, 8, 9, 10, 11, 12 fully resolved in spec 67
- Gap 7 (invited party Mark variant) specced with five decisions **parked** for return after Claude AI Design reconciliation
- CLAUDE.md updated with durable product positioning section
- Stock-take surfaced — the built code reflects session 11-17 "financial disclosure" thinking; specs reflect session 19+ "complete settlement workspace" thinking. Architectural drift is real.

See `docs/HANDOFF-SESSION-20.md` for detailed retro.

## Current state of the codebase

**What's built (session 11-17 era — financial disclosure V2):**
- V1 public site: landing, features, pricing, interview, choose/save
- V2 workspace: welcome carousel (1a-1c), task list home, bank connect, confirmation flow (7 sections per spec 22), spending flow (fork, estimates, search, categorise), financial summary
- Decisioning engine: Tink/CSV → classification (20 categories, ~200 keywords, fuzzy matching, amount guards, user corrections) → signals (17 rules) → questions / auto-confirms / gap detection
- Engine workbench with 5 test scenarios, Ntropy reconciliation, amount analysis, rule diagnostics
- Upfront profiling component (spec 34 era, pre-Moment 1/2/3 model)

**What's specced but NOT built (accumulated specs since session 17):**
- Pre-signup interview (spec 65, 8 screens, locked)
- Post-signup profiling distribution (spec 67, 3 moments, 12 gaps now resolved)
- Children section (C1-C5)
- Housing transition (HT1-HT2)
- Business section (B1-B5)
- Pre-share verification + completeness checklist
- Safeguarding signposting + baseline
- Reconciliation flow (spec 60)
- Proposal phase (spec 61)
- Finalise / submit (spec 62)
- Consent order generation, D81 auto-population
- Document-as-spine architecture (spec 44)
- Implementation phase (spec 46)

**What's in user hands (not yet shared with this repo):**
- Claude AI Design prototype work — screens, design thinking, high-fidelity wireframes for core journey areas

**What's in limbo:**
- Dashboard spec 04 (pre-pivot, needs pressure-test against 6-phase model)
- Upfront profiling in current code uses old spec 34 language, not new Moment 1/2/3 model
- Welcome carousel frames old financial-only scope

## Session 21 priorities

### P0: Reconcile Claude AI Design work with specs
1. User shares Claude AI Design prototype screens and thinking
2. Walk through each area — pre-signup, onboarding, profiling, data capture, reconciliation, proposals, finalise
3. Identify where design work supersedes specs, where specs supersede design, where both need revision
4. Flag new concepts / decisions surfaced in design work that need speccing

### P1: Produce the Complete Settlement Workspace Build Map
5. Single document mapping every phase (Start / Build / Share / Agree / Finalise / Move-on) to:
   - Component list
   - Data model
   - Engine dependencies
   - Design references (spec + Claude AI Design prototypes)
   - MVP vs V1.5 vs V2 scope
6. Covers the 6 phases of spec 42 + the distributed profiling of spec 67

### P2: Plan the clean rebuild
7. Decide: same repo restructure vs new top-level folder
8. Identify stable libs to preserve (engine, bank, AI, decision trees, test scenarios)
9. Map new /app and /components tree around the 6-phase model
10. First deployable slice — which phase, which end-to-end flow, what "done" looks like for the first milestone

### P3: Lock the parked decisions
11. Gap 7 open decisions (IS1 placement, priorities/worries, invitation expiry, correction treatment, AI plan output) — revisit with design reconciliation context
12. Spec 68 written as the definitive post-signup profiling spec (or spec 34 updated)
13. Dashboard spec 04 pressure-test

## Negative constraints

1. **Do NOT** write "financial disclosure tool" or imply Decouple is scoped to finances. It's the complete settlement workspace.
2. **Do NOT** build more on the current /src/components/workspace tree without the Build Map in place — avoid compounding drift.
3. **Do NOT** rewrite specs 65 or 67 gaps 1-12 resolutions — they are locked pending design reconciliation.
4. V1 legacy palette is gone — do not reintroduce warmth/cream/sage colours.
5. Red #E5484D is for primary CTAs only.
6. Shadow-based card separation — no borders on cards.
7. Do not reference pre-pivot specs (03-06, 11, 12).
8. Workbench is dev-only — no link from production navigation.
9. Safeguarding for V1 is signposting + baseline only. Coercive control detection, decoy mode, adaptive pacing = V1.5.
10. Identity verification is not offered at pre-share — waits until consent-order stage.

## Key files

```
docs/SESSION-CONTEXT.md                                    — START HERE every session
docs/HANDOFF-SESSION-20.md                                 — Most recent session retro
docs/HANDOFF-SESSION-19.md                                 — (May not exist — session 19 work captured in spec 65 + 67)
docs/HANDOFF-SESSION-18.md                                 — Engine / workbench session
CLAUDE.md                                                   — Positioning + rules (preserve)

Key specs — positioning and architecture
docs/workspace-spec/42-strategic-synthesis.md              — AUTHORITATIVE positioning + 6-phase journey
docs/workspace-spec/44-the-document-structure.md           — Document-as-spine
docs/workspace-spec/51-product-vision.md                   — Product vision
docs/workspace-spec/52-product-canvas.md                   — Product canvas
docs/workspace-spec/54-risk-register.md                    — Risk register
docs/workspace-spec/56-launch-readiness.md                 — Launch readiness

Key specs — current flow model
docs/workspace-spec/65-pre-signup-interview-reconciled.md  — Locked pre-signup
docs/workspace-spec/66-post-signup-profiling-gaps.md       — Original gap list (superseded by 67)
docs/workspace-spec/67-post-signup-profiling-progress.md   — ALL 12 GAPS RESOLVED/PARKED (latest)
docs/workspace-spec/34-upfront-profiling-design.md         — Matching architecture, self-employed path context
docs/workspace-spec/45-screens-phase-1-to-3.md             — Phase screens 1-3
docs/workspace-spec/46-screens-phase-4-to-6.md             — Phase screens 4-6
docs/workspace-spec/57-flow-map-public-signup-orientation.md
docs/workspace-spec/58-flow-map-profiling.md
docs/workspace-spec/59-flow-map-bank-confirm-spending.md
docs/workspace-spec/60-flow-map-share-reconciliation.md
docs/workspace-spec/61-flow-map-proposal-negotiation.md
docs/workspace-spec/62-flow-map-finalise-submit.md
docs/workspace-spec/63-flow-map-adaptive.md
docs/workspace-spec/64-flow-map-gaps-uncertainties.md

Specs — safeguarding, adaptive
docs/workspace-spec/47-adaptive-non-engagement-safety.md   — V1.5 adaptive safeguarding reference (not V1)

Specs — legal end-state
docs/workspace-spec/41-consent-order-self-submission.md    — Legal research on self-submission

Specs — engine
docs/workspace-spec/30-signal-detection-engine.md
docs/workspace-spec/31-large-payment-detection.md
docs/workspace-spec/32-engine-audit.md

Built code (legacy, session 11-17 era — will be reconciled with Build Map)
src/components/workspace/welcome-carousel.tsx
src/components/workspace/task-list-home.tsx
src/components/workspace/bank-connection-flow.tsx
src/components/workspace/confirmation-flow.tsx
src/components/workspace/spending-flow.tsx
src/app/workspace/page.tsx                                 — Flow state machine orchestrator
src/app/workspace/engine-workbench/page.tsx                — Dev workbench

Stable libraries (preserve across rebuild)
src/lib/bank/bank-data-utils.ts
src/lib/bank/tink-client.ts
src/lib/bank/tink-transformer.ts
src/lib/bank/signal-rules/                                 — 17 rules
src/lib/bank/confirmation-questions.ts
src/lib/bank/test-scenarios.ts
src/lib/ai/result-transformer.ts
src/lib/ai/extraction-schemas.ts
src/types/hub.ts

v2 / legacy research (reference only)
docs/v1/v1-desk-research.md                                — CITED for safeguarding decisions
docs/v2/v2-backlog.md                                      — V1.5/V2 nice-to-haves (will absorb Gap 11 deferrals)
```

## Information tiers — what to read when

- **Tier 1 (always loaded):** CLAUDE.md (positioning, rules, startup).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read when relevant):** spec 42 (positioning) + spec 67 (current profiling architecture) + spec 65 (pre-signup locked).
- **Tier 4 (reference only):** individual screen / flow specs as needed for specific task.

## Branch

Development: `claude/decouple-financial-workspace-oXXQ7` (session 20 branch — continue on this or open a new branch for session 21 depending on whether reconciliation work starts code changes).

## Session 21 pre-flight

1. User prepares Claude AI Design prototype materials to share (screens, narrative, design thinking, conceptual decisions)
2. Load CLAUDE.md + this file + spec 42 + spec 67
3. Confirm with user: reconciliation + build map is the focus
4. Begin
