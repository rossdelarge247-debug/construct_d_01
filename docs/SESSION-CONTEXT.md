# Session 22 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. A divorce process disrupter: £800-1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):**
- Shared, not adversarial
- Evidenced, not asserted
- End-to-end, not hand-off

**Tagline:** "Decouple — the complete picture."

Spec 42 is authoritative. Spec 68 (synthesis hub) + 68a-f (locked + open decisions) now carry the reconciled wire-level framing.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.
Tink credentials in Vercel env.

## What session 21 accomplished

**Design session — wire reconciliation + phase decisions locked. No code changes.**

- Claude AI Design prototype screens reconciled against specs across Sarah's Picture (Build), Reconcile V2 unified + four variants, Settle (proposal / option cards / AI coach / counter / progress board / agreement), Finalise (generation / pre-flight / solicitor fork / submit / post-submit tracker).
- Phase model reconciled 6 → 5: Start / Build / Reconcile / Settle / Finalise. Share collapsed to an action. Move-on folded into Finalise tracking for V1.
- Four-document lifecycle fully articulated: Sarah's Picture → Our Household Picture → Settlement Proposal → Generated legal docs.
- Spec 68 suite produced (7 files, all committed): synthesis hub + 5 locked phase-decision docs + LIVE open register (27 entries).
- Blocked on image-upload 2000px dimension limit during the final batch — nav thoughts, Sarah's build → share journey, strawperson share modals, first-time experience, dashboard (first-time / return / post-bank-connection). Deferred to session 22.

See `docs/HANDOFF-SESSION-21.md` for detailed retro.

## Current state

### Locked (session 21)
- **Phase model** — 5 phases (Start / Build / Reconcile / Settle / Finalise). Share-as-action. Move-on absorbed into Finalise tracking.
- **Document lifecycle** — four documents, lineage preserved across phases.
- **Build phase decisions** — 68b. Sarah's Picture as document; Read/Edit toggle dropped; dashboard sits above Sarah's Picture; children as §1; private doc no version chip; share mechanics.
- **Reconcile phase decisions** — 68c. Joint doc mirrors private; sections not chapters; status quad header; conflict card pattern; AI queue biggest-impact first; Mark status machine; joint-doc V1.0 / V2.0 / Vx.y versioning.
- **Settle phase decisions** — 68d. Proposal as document; running-split banner; option cards per section; AI coach four-card taxonomy; counter three-button response; progress board with convergence chart; explicit sign to lock agreement.
- **Finalise phase decisions** — 68e. Consent order + D81 + Form P + settlement summary generation; eight-check pre-flight gate; three-tier solicitor fork (£0 / £250 / £450); four-confirmation submit page; post-submit tracker absorbs Move-on.
- **Cross-cutting** — 68a. Six-level trust taxonomy; three party types for sharing; escape-hatch exports; exit-this-page safeguarding; AI coach card types; user language.

### Open (68f register — 27 entries)
See `docs/workspace-spec/68f-open-decisions-register.md` for full context, options, lean, target per entry. Highest priority for session 22:
- **C-N1** app-level nav wireframe (needs design pass)
- **C-S1** share modal fields per party type
- **B-3** dashboard detailed spec
- **G7-1 through G7-5** — five Gap 7 Mark decisions (IS1 placement, priorities/worries, invitation expiry, correction treatment, AI plan output)
- **C-E1** escape-hatch export triggers (thresholds)

### What's specced but NOT built
- Everything in spec 68 suite (design only, no code yet)
- Pre-signup interview (spec 65)
- Post-signup profiling distribution (spec 67, 12 gaps resolved — Gap 7 parked into 68f)
- Children / Housing transition / Business sections
- Reconciliation / Proposal / Finalise flows
- Consent order generation, D81 auto-population
- Document-as-spine architecture (spec 44 — needs update to align with 68)

### What's built (legacy, session 11-17 era)
- V1 public site, V2 workspace carousel + task list + bank connect + confirmation flow + spending flow + financial summary
- Decisioning engine (Tink/CSV → classification → signals → questions)
- Engine workbench
- Stock-take: built code reflects "financial disclosure" thinking; specs reflect "complete settlement workspace" thinking. Architectural drift real. Will be reconciled via Phase B Build Map.

## Session 22 priorities

### P0: Clear the image-blocked batch

1. User re-exports images at ≤1500px wide OR walks through in prose — nav thoughts, Sarah's build → share journey, strawperson share modals, first-time experience, dashboard (first-time / return / post-bank-connection).
2. Reconcile against 68a-f as we go. Update register inline when new opens surface.

### P1: Lock the decidable 68f entries

3. **Nav (C-N1)** — app-level nav wireframe design pass
4. **Share modal (C-S1)** — fields per party type
5. **Dashboard (B-3)** — detailed spec, pressure-test against spec 04
6. **Gap 7 Mark (G7-1 to G7-5)** — IS1 placement, priorities/worries, invitation expiry, correction treatment, AI plan output

### P2: Complete Settlement Workspace Build Map

7. Single document mapping each phase (Start / Build / Reconcile / Settle / Finalise) to:
   - Component list (anchor / derived / variant / re-use tags)
   - Data model
   - Engine dependencies
   - Design references (spec + Claude AI Design prototypes)
   - MVP vs V1.5 vs V2 scope
8. Covers distributed profiling per spec 67
9. Feeds directly into Phase C execution planning

### P3: Update positioning specs

10. Spec 42 — reflect 5-phase model + Share-as-action + Move-on fold-in
11. Spec 44 — align document-as-spine with 68 framing

### P4 (if time): Execution planning

12. Clean rebuild strategy — same-repo restructure vs new top-level. Stable libs to preserve (engine, bank, AI, decision trees, test scenarios). New /app and /components tree around 5-phase model.
13. First deployable slice scope.

## Negative constraints

1. **Do NOT** write "financial disclosure tool" or imply Decouple is scoped to finances.
2. **Do NOT** build more on the current /src/components/workspace tree without the Build Map in place.
3. **Do NOT** re-open 68a-e locked decisions unless new evidence surfaces — treat them as load-bearing.
4. **Do NOT** re-read pre-pivot specs (03-06, 11, 12). Active reconciled framing lives in 42 / 44 / 68 / 68a-f.
5. **Do NOT** let a "quick code extraction" jump ahead of reconciliation + Build Map. Phase A must complete before Phase C.
6. V1 legacy palette is gone — no warmth/cream/sage colours.
7. Red #E5484D is primary CTAs only.
8. Shadow-based card separation — no borders on cards.
9. Safeguarding for V1 is signposting + baseline. Detection / decoy / adaptive pacing = V1.5.
10. Identity verification waits until consent-order stage.

## Information tiers — what to read when

- **Tier 1 (always loaded):** CLAUDE.md (positioning, rules, startup).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read when relevant):** spec 42 (positioning) + spec 68 (synthesis hub) + 68a-f (phase decisions + open register). These are the reconciled source of truth.
- **Tier 4 (reference only):** individual older flow specs as needed (60-64), spec 67 (profiling), spec 65 (pre-signup).

## Branch

Session 21 work committed on `claude/decouple-financial-workspace-oXXQ7`. Session 22 should open a fresh branch (e.g. `claude/decouple-settlement-workspace-{N}`) if code changes start. If session 22 remains design-only, either branch is fine — prefer a new one if it simplifies PR hygiene.

## Key files

```
CLAUDE.md                                                      — Positioning + rules (preserve)
docs/SESSION-CONTEXT.md                                        — THIS FILE — start here
docs/HANDOFF-SESSION-21.md                                     — Session 21 retro (latest)
docs/HANDOFF-SESSION-20.md                                     — Session 20 retro

Reconciled framing (spec 68 suite — read these first)
docs/workspace-spec/68-synthesis-hub.md                        — Wire reconciliation hub
docs/workspace-spec/68a-decisions-crosscutting.md              — Cross-cutting locked
docs/workspace-spec/68b-decisions-build.md                     — Build phase locked
docs/workspace-spec/68c-decisions-reconcile.md                 — Reconcile phase locked
docs/workspace-spec/68d-decisions-settle.md                    — Settle phase locked
docs/workspace-spec/68e-decisions-finalise.md                  — Finalise phase locked
docs/workspace-spec/68f-open-decisions-register.md             — 27 open decisions LIVE

Key specs — positioning and architecture
docs/workspace-spec/42-strategic-synthesis.md                  — Authoritative positioning (needs 5-phase update)
docs/workspace-spec/44-the-document-structure.md               — Document-as-spine (needs 68 alignment)
docs/workspace-spec/51-product-vision.md
docs/workspace-spec/52-product-canvas.md

Key specs — flow model (session 20 and prior)
docs/workspace-spec/65-pre-signup-interview-reconciled.md      — Pre-signup locked
docs/workspace-spec/67-post-signup-profiling-progress.md       — 12 gaps resolved (Gap 7 parked in 68f)
docs/workspace-spec/45-screens-phase-1-to-3.md
docs/workspace-spec/46-screens-phase-4-to-6.md
docs/workspace-spec/60-flow-map-share-reconciliation.md
docs/workspace-spec/61-flow-map-proposal-negotiation.md
docs/workspace-spec/62-flow-map-finalise-submit.md

Specs — engine and legal
docs/workspace-spec/30-signal-detection-engine.md
docs/workspace-spec/31-large-payment-detection.md
docs/workspace-spec/32-engine-audit.md
docs/workspace-spec/41-consent-order-self-submission.md

Built code (legacy — reconcile via Build Map, do NOT extend without Map)
src/components/workspace/welcome-carousel.tsx
src/components/workspace/task-list-home.tsx
src/components/workspace/bank-connection-flow.tsx
src/components/workspace/confirmation-flow.tsx
src/components/workspace/spending-flow.tsx
src/app/workspace/page.tsx
src/app/workspace/engine-workbench/page.tsx

Stable libraries (preserve across rebuild)
src/lib/bank/bank-data-utils.ts
src/lib/bank/tink-client.ts
src/lib/bank/tink-transformer.ts
src/lib/bank/signal-rules/                                     — 17 rules
src/lib/bank/confirmation-questions.ts
src/lib/bank/test-scenarios.ts
src/lib/ai/result-transformer.ts
src/lib/ai/extraction-schemas.ts
src/types/hub.ts

v2 / legacy research (reference only)
docs/v1/v1-desk-research.md
docs/v2/v2-backlog.md
```

## Session 22 pre-flight

1. User exports blocked images at ≤1500px wide OR prepares prose walk-through
2. Claude loads CLAUDE.md + this file + spec 42 + spec 68 (hub) + spec 68f (open register)
3. Confirm with user: prose walk-through + 68f triage + Build Map is the focus
4. Begin
