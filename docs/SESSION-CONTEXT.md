# Session 23 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. A divorce process disrupter: £800-1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):**
- Shared, not adversarial
- Evidenced, not asserted
- End-to-end, not hand-off

**Tagline:** "Decouple — the complete picture."

Spec 42 (amended session 22) is authoritative for positioning. Spec 68 (synthesis hub) + 68a-e (locked phase decisions) + 68f (session-21 register, session-22 locks applied) + 68g trio (visual anchors, build opens, copy/share opens) carry reconciled wire-level framing. Spec 70 (Build Map suite) is the Phase B deliverable and the input to Phase C.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.
Tink credentials in Vercel env.

## What session 22 accomplished

**Design session — wire reconciliation continuation + decision locks + spec alignment + Build Map. No code changes.**

- **P0 cleared** — walked 19 Claude AI Design prototype screens across 4 batches (Sarah's Picture post-connection + share; spending states; welcome tour; dashboard states). Reconciled against 68a-f inline; surfaced 29 new opens.
- **P1 locks** — C-N1 (amended to contextual journey map), C-S1a (ex-modal fields), C-T1 (trust chip colour+label pattern), B-3 (dashboard shape), G7-1..5 (Mark journey), C-E1 (escape-hatch thresholds).
- **P3 alignment** — spec 42 rewritten from 6-phase to 5-phase + four-document lifecycle; spec 44 rewritten as four-document lifecycle with per-doc versioning + edit-mode toggle dropped + Children as §1.
- **Visual direction canonical** — Claude AI Design outputs now named as canonical source in CLAUDE.md + SESSION-CONTEXT + spec 27 SUPERSEDED. Airbnb/Emma/Habito retired.
- **P2 complete — Build Map** — spec 70 suite (7 files: hub + 5 phase files + slice index). 31 slices catalogued. Tag system: Anchor / Derived / Variant / Re-use / Preserve-with-reskin / Known-unknown. Scope decisions deferred to engineering setup.
- **Strategic reframes locked** — "slice" as label for engineering work unit; MLP not MVP explicit in CLAUDE.md; PR-to-main added to wrap protocol.
- **P4 deferred** to session 23 — clean rebuild strategy + first deployable slice selection.

See `docs/HANDOFF-SESSION-22.md` for detailed retro.

## Current state

### Locked (through session 22)

**Session 21 (foundational):**
- **Phase model** — 5 phases (Start / Build / Reconcile / Settle / Finalise). Share-as-action. Move-on absorbed into Finalise tracking.
- **Document lifecycle** — four documents (Sarah's Picture → Our Household Picture → Settlement Proposal → Generated legal docs).
- **68a** Cross-cutting (trust taxonomy, exit/safeguarding, AI coach card types, user language).
- **68b** Build phase mechanics · **68c** Reconcile · **68d** Settle · **68e** Finalise.

**Session 22 additions / amendments:**
- **68a C-N1 amended** — contextual journey map (vertical rail + horizontal stepper, two surfaces).
- **68f C-T1 locked** — trust chip = colour-by-taxonomy-level + label-by-specific-source.
- **68f C-S1a locked** — ex-modal fields (First + Last name + Email).
- **68f B-3 locked** — dashboard shape across 3 states.
- **68f G7-1..G7-5 locked** — Mark journey: pre-signup IS1; fresh priorities with opt-in/out; 14-day invite; ask-and-confirm pattern (no silent merges); full parallel AI plan with respondent framing.
- **68f C-E1 locked** — escape-hatch triggers (4 weeks Mark non-engagement / 5 rounds stuck reconciliation).
- **Spec 42 amended** — 5-phase journey + four-document lifecycle.
- **Spec 44 amended** — four-document lifecycle; per-doc versioning; edit-mode toggle dropped; Children as §1.
- **Spec 67 Gap 7** — PARKED → RESOLVED.
- **Spec 70 Build Map** — 7 files, 31 slices, complete.
- **Visual direction** — Claude AI Design canonical; Airbnb/Emma/Habito retired.

### Open (see 68f + 68g trio for full register)

**Status summary as of session 22 close:**
- 68f: original 27 entries + session-22 splits. 10 now 🟢 locked (C-N1a/c/d, C-T1, C-S1a, B-3, G7-1..5, C-E1). 17 still 🟠 — mostly downstream design detail (R-1..6, S-1..3, F-1..5, C-X1, C-N1b, C-S1b, etc.).
- 68g-visual-anchors: 14 open (C-V1..C-V14) — resolved by Phase C anchor extraction.
- 68g-build-opens: 10 open (B-5..B-14).
- 68g-copy-share-opens: 5 open (C-U4..C-U6, C-S5, C-S6).

**None block session 23's P0** (execution planning + first slice pick). Most block specific slice work when that slice is picked up. C-U4 (disclosure-language audit) is session 23's P1 because it blocks Phase C anchor extraction.

### What's specced but NOT built
- Everything in spec 68 suite (design-only)
- Everything in spec 70 Build Map (design-only — the map, not the code)
- Pre-signup interview (spec 65 — Preserve-with-reskin: question set kept, UI rebuilds)
- Post-signup profiling distribution (spec 67 resolved)
- Children / Housing transition / Business sections
- Reconciliation / Proposal / Finalise flows
- Consent order generation, D81 auto-population, Form P
- Respondent journey detailed wireframes (spec 67 Gap 7 deferred to Phase C)
- New design system foundation (C-V1..C-V14 anchor extraction pending Phase C Step 1)

### What's built (legacy — reconciled via Build Map)
- **Re-use (preserve as-is per 70-build-map.md hub):** `src/lib/bank/*` (Tink client, transformer, signal rules 17, data-utils, test-scenarios, bank-connect + callback API routes), `src/lib/ai/*` (extraction-schemas, result-transformer), `src/types/hub.ts`, engine workbench.
- **Preserve-with-reskin (logic kept, UI rebuilds):** `src/lib/bank/confirmation-questions.ts` (spec 22 decision trees), spec 13 categorisation + spec 19 keyword lookup.
- **Discarded (do NOT port):** `src/components/workspace/*` (V2 components tied to spec-18 palette + pre-pivot flow) · `src/app/workspace/page.tsx` (V2 orchestrator — replaced by new architecture at Phase C).

## Session 23 priorities

### P0: Execution planning (deferred from session 22 P4)

1. **Clean rebuild strategy.** Same-repo restructure vs new top-level `/app` and `/components`. Map the 5-phase + four-document lifecycle to folder structure. Preserve stable libs in-place (`src/lib/bank/*`, `src/lib/ai/*`, `src/types/hub.ts`). Plan removal of discarded UI tree (`src/components/workspace/*`, `src/app/workspace/page.tsx`).
2. **First deployable slice pick.** From 31 slices in `70-build-map-slices.md`. Strongest candidates: S-F1+S-F2 foundation stack (unlocks everything); S-O1 primary onboarding (lowest deps, demonstrates welcome shell); S-B1 bank connection (big reuse, visible impact); S-B2 Sarah's Picture (most load-bearing but most complex).
3. **Design system foundation work.** Token extraction from Claude AI Design outputs (phase colour hex + gradients, typography scale, shadow model, base primitives).
4. **Engineering env preparation.** User to drop in performance + code-quality MD updates before Phase C code starts.

### P1: Disclosure-language copy audit (C-U4)

Blocks Phase C anchor extraction — every anchor will carry copy and wire language needs cleaning to phase-model labels. ~12 surfaces identified. Output: one copy-pattern doc covering replacement vocabulary, banned words, empty-state verb family (resolves C-U5), stepper/nav label unification (resolves C-U6), confirmation/attention/success/error templates.

### P2 (if time): Additional lock candidates

- **C-T1** per-level visual detail for 4 remaining trust levels (credit-verified / document-evidenced / both-party-agreed / court-sealed).
- **C-S1b** solicitor + mediator modal field sets — decide during share anchor design.
- **B-5** 50:50 default assumption — lock pattern.
- **B-10** first-time tour scope.

### P3 (if time): Respondent journey wireframes

Spec 67 Gap 7 detailed wireframes (IS1..IS6 + IS-Plan + Moment-1-Mark variant). Only needed if Mark-side slice is picked as first deployable slice.

## Negative constraints

1. **Do NOT** write "financial disclosure tool" or imply Decouple is scoped to finances.
2. **Do NOT** build more on the current /src/components/workspace tree without the Build Map in place.
3. **Do NOT** re-open 68a-e locked decisions unless new evidence surfaces — treat them as load-bearing.
4. **Do NOT** re-read pre-pivot specs (03-06, 11, 12). Active reconciled framing lives in 42 / 44 / 68 / 68a-g / 70.
5. **Do NOT** let a "quick code extraction" jump ahead of reconciliation. Build Map is complete (spec 70); Phase C begins only after session 23 locks first slice + clean rebuild strategy.
11. **MLP not MVP** — scope decisions per slice (in engineering setup) frame as "what the *loveable* version requires vs what can iterate post-launch." Not "minimum viable." Users are in crisis; loveable is the floor.
12. **Scope decisions defer to engineering setup per slice.** Build Map is the complete catalogue; cuts happen with engineering signal, not in the map.
13. **Large file writes time out** — use skeleton-first + Edit-per-section for any new file over ~150 lines. Proven in session 22.
6. V1 legacy palette is gone — no warmth/cream/sage colours.
7. **Visual direction canonical source is Claude AI Design tool outputs** (session 22 wire batches). Legacy reference points (Airbnb, Emma, Habito) and legacy in-house specs (spec 18 colour palette, spec 27 visual direction) are superseded. No new work references them. Anchor shortlist in `68g-visual-anchors.md` (C-V1..C-V14); extraction happens at Phase C Step 1.
8. Shadow-based card separation — no borders on cards.
9. Safeguarding for V1 is signposting + baseline. Detection / decoy / adaptive pacing = V1.5.
10. Identity verification waits until consent-order stage.

## Information tiers — what to read when

- **Tier 1 (always loaded):** CLAUDE.md (positioning, rules, startup).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read when relevant):** spec 42 (positioning) + spec 44 (document-as-spine) + spec 68 (hub) + 68a-e (phase locks) + 70 Build Map suite.
- **Tier 4 (reference only):** 68f / 68g trio (open registers — consult when working on a specific open), spec 67 (profiling), spec 65 (pre-signup), older flow specs 60-64.

## Branch

Session 22 work committed on `claude/session-22-design-planning-vkByL`. Session 23 to open a fresh branch for code changes if Phase C kickoff produces them (e.g. `claude/session-23-{scope}-{hash}` or slice-named branch per 70-build-map-slices.md naming). Design-only portions of session 23 can continue on session-22 branch if preferred.

## Key files

```
Session orientation
CLAUDE.md                                                      — Positioning + rules (preserve)
docs/SESSION-CONTEXT.md                                        — THIS FILE — start here
docs/HANDOFF-SESSION-22.md                                     — Session 22 retro (latest)
docs/HANDOFF-SESSION-21.md                                     — Session 21 retro

Reconciled framing (spec 68 suite)
docs/workspace-spec/68-synthesis-hub.md                        — Wire reconciliation hub
docs/workspace-spec/68a-decisions-crosscutting.md              — Cross-cutting locked (C-N1 amended session 22)
docs/workspace-spec/68b-decisions-build.md                     — Build phase locked
docs/workspace-spec/68c-decisions-reconcile.md                 — Reconcile phase locked
docs/workspace-spec/68d-decisions-settle.md                    — Settle phase locked
docs/workspace-spec/68e-decisions-finalise.md                  — Finalise phase locked
docs/workspace-spec/68f-open-decisions-register.md             — Session-21 register (session-22 locks applied)
docs/workspace-spec/68g-visual-anchors.md                      — C-V1..C-V14 extraction catalogue
docs/workspace-spec/68g-build-opens.md                         — B-5..B-14 build opens
docs/workspace-spec/68g-copy-share-opens.md                    — C-U4..U6 + C-S5..S6 opens

Build Map suite (spec 70 — Phase B deliverable)
docs/workspace-spec/70-build-map.md                            — Hub: tagging, preserved-legacy, how-to-read
docs/workspace-spec/70-build-map-start.md                      — Phase 1 map
docs/workspace-spec/70-build-map-build.md                      — Phase 2 map
docs/workspace-spec/70-build-map-reconcile.md                  — Phase 3 map
docs/workspace-spec/70-build-map-settle.md                     — Phase 4 map
docs/workspace-spec/70-build-map-finalise.md                   — Phase 5 map
docs/workspace-spec/70-build-map-slices.md                     — 31-slice catalogue

Key specs — positioning and architecture
docs/workspace-spec/42-strategic-synthesis.md                  — Authoritative positioning (5-phase, amended session 22)
docs/workspace-spec/44-the-document-structure.md               — Four-document lifecycle (amended session 22)
docs/workspace-spec/51-product-vision.md
docs/workspace-spec/52-product-canvas.md

Key specs — flow model
docs/workspace-spec/65-pre-signup-interview-reconciled.md      — Pre-signup locked
docs/workspace-spec/67-post-signup-profiling-progress.md       — All gaps resolved (Gap 7 resolved session 22)
docs/workspace-spec/45-screens-phase-1-to-3.md                 — Reference (partially superseded by 70)
docs/workspace-spec/46-screens-phase-4-to-6.md                 — Reference (partially superseded by 70)

Specs — engine and legal (relevant to Phase C Re-use tags)
docs/workspace-spec/13-extraction-decision-tree-documents.md
docs/workspace-spec/19-intelligent-categorisation.md
docs/workspace-spec/22-confirmation-flow-tree.md               — Preserve-with-reskin source
docs/workspace-spec/30-signal-detection-engine.md
docs/workspace-spec/31-large-payment-detection.md
docs/workspace-spec/32-engine-audit.md
docs/workspace-spec/41-consent-order-self-submission.md

Stable libraries (Re-use per 70-build-map.md)
src/lib/bank/tink-client.ts                                    — Tink API client
src/lib/bank/tink-transformer.ts                               — Tink → BankStatementExtraction
src/lib/bank/bank-data-utils.ts                                — Extraction → UI types + transaction search
src/lib/bank/signal-rules/                                     — 17 rules
src/lib/bank/confirmation-questions.ts                         — Preserve-with-reskin
src/lib/bank/test-scenarios.ts                                 — Dev scenarios
src/lib/ai/extraction-schemas.ts                               — Anthropic structured outputs
src/lib/ai/result-transformer.ts                               — Spec 13 trees + spec 19 lookup
src/types/hub.ts                                               — Types (prune legacy at rebuild)
src/app/api/bank/connect/route.ts                              — Tink Link URL gen
src/app/api/bank/callback/route.ts                             — Tink callback
src/app/workspace/engine-workbench/page.tsx                    — Engine workbench dev tool

Discarded — do NOT port (superseded by 68 + 70)
src/components/workspace/*                                     — V2 components (spec 18 palette / pre-pivot flow)
src/app/workspace/page.tsx                                     — V2 orchestrator (replaced by new architecture at Phase C)

v2 / legacy research (reference only)
docs/v1/v1-desk-research.md
docs/v2/v2-backlog.md
```

## Session 23 pre-flight

1. Claude loads CLAUDE.md + this file + spec 70 hub + 70-build-map-slices.md (31-slice catalogue).
2. Verify branch: should be on `claude/session-22-design-planning-vkByL` unless session 23 has opened a fresh branch. If Phase C code work starts, open a dedicated branch.
3. Confirm with user: P0 = clean rebuild strategy + first slice pick + design system foundation work. P1 = disclosure-language copy audit (C-U4). User may also drop engineering-phase MD file updates (perf + code quality) before Phase C code starts.
4. Begin.
