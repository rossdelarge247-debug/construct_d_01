# Session 21 Handoff

**Date:** 21 April 2026
**Branch:** `claude/decouple-financial-workspace-oXXQ7` (continued from session 20)
**Scope:** Design / specs only. No code changes.

---

## What happened

### Reconciled the wire batch into locked decisions

User shared Claude AI Design prototype work across Sarah's Picture (private), Reconcile V2 unified, Reconcile variants (quad / conflict card / AI queue / resolve-all), Settle (proposal draft + running split + option cards + AI coach right rail + counter-proposal + progress board + agreed artefact), and Finalise (document generation + pre-flight + solicitor fork + submit + post-submit tracker).

For each area we walked through design intent, tested against positioning (complete settlement workspace, not financial disclosure), reconciled against prior specs (42 / 44 / 67), and locked decisions or parked them in an open register.

### Produced the spec 68 synthesis suite

Originally attempted as a monolithic synthesis file — timed out twice on write. Split into seven small files (all committed, all <220 lines):

- **spec 68** — synthesis hub (196 lines). Frozen snapshot. Phase model reconciled 6→5 with Share-as-action. Four-document lifecycle articulated (Sarah's Picture → Our Household Picture → Settlement Proposal → Generated legal docs). Points to 68a-f.
- **spec 68a** — cross-cutting decisions (129 lines). Nav principle, trust badges, share modal / CTA, escape-hatch export, exit / safeguarding, AI coach card taxonomy, data freshness, user language.
- **spec 68b** — Build phase decisions (132 lines). Document shape, section editing + change log, private-doc versioning, share mechanics, to-do + dashboard-above-document, ES2 mapping, metrics, accessibility.
- **spec 68c** — Reconcile phase decisions (165 lines). Joint doc shape, status quad, conflict card pattern, AI deliberation queue, first-visit welcome + emotional pacing, Mark status machine, joint-doc versioning, unlock rules, recent-activity panel.
- **spec 68d** — Settle phase decisions (171 lines). Proposal document shape, running-split dashboard, proposal option cards, AI coach right rail, counter-proposal response, settlement progress board, unlock to Finalise, final agreement artefact.
- **spec 68e** — Finalise phase decisions (119 lines). Document generation set, pre-flight quality check, three-tier solicitor review fork, submit page, post-submit tracker (absorbs Move-on for V1).
- **spec 68f** — open decisions register LIVE (212 lines). 27 open decisions tagged by area (C / B / R / S / F / G7) with context, options, lean, target phase.

### Phase model reconciled

6 phases → 5 phases. Share collapsed from a phase to an action. Move-on folded into Finalise tracking for V1 (richer post-order guidance is V1.5+ per spec 42 + 46).

**Locked phases:** Start · Build · Reconcile · Settle · Finalise (with post-submit tracking).

### Document-as-spine fully articulated

Four documents, lineage preserved across phases:

1. **Sarah's Picture** (Build) — private doc, lightweight lifecycle, no version chip, last-updated stamp only.
2. **Our Household Picture** (Reconcile) — joint doc, full versioning on share (V1.0 / V2.0 / Vx.y), status quad + conflict cards.
3. **Settlement Proposal → Counter → Progress → Agreement** (Settle) — proposal doc with option cards, running-split dashboard, convergence chart, explicit sign to lock.
4. **Consent Order + D81 + Form P + Settlement Summary** (Finalise) — formal court artefacts auto-populated from agreed settlement, pre-flight gated, court-sealed state updates the agreement artefact post-approval.

### Positioning held throughout

At no point did Decouple get described as a "financial disclosure tool." Specs are consistent with: complete settlement workspace, shared-not-adversarial, evidenced-not-asserted, end-to-end-not-hand-off.

---

## What blocked us

### Image upload 2000px dimension limit

User attempted to share a new batch covering nav thoughts, Sarah's build → share-with-Mark journey, strawperson share modals, and enhanced first-time experience + dashboard (first-time / return / post-bank-connection states). Multiple images hit a dimension-limit failure on upload.

This batch would have closed several Phase A gaps at once — nav wireframe (68f C-N1), share modal fields (68f C-S1), dashboard detailed spec (68f B-3), first-time welcome tour. All deferred to session 22 instead.

### Ahead-of-ourselves moment

Mid-session I proposed code extraction pipeline before completing reconciliation and planning. User flagged — "where does our final reconciliation, spec alignment, and master planning sit?" Restructured into three explicit phases (A Reconciliation & Planning / B Build Map / C Execution) and placed code extraction correctly in Phase C. Kept from repeating the mistake after.

---

## Key decisions made (summary — full detail in 68a-e)

**Cross-cutting**
- Nav principle: in-doc left rail is doc TOC; app-level nav wireframe open (68f C-N1).
- Trust taxonomy: six levels — self-declared / bank-evidenced / credit-verified / document-evidenced / both-party-agreed / court-sealed. Visual treatment open (68f C-T1).
- Share modal: three party types (ex / solicitor / mediator), selective publish checkboxes, adaptive CTA states.
- Escape-hatch exports from stuck states (Form E / ES2). Thresholds open (68f C-E1).
- Exit-this-page safeguarding footer present. Instant redirect + clear local state lean (68f C-X1).

**Build**
- Sarah's Picture renders as a document, not a dashboard. Three-column layout.
- Read/Edit toggle DROPPED in favour of per-section inline controls.
- Dashboard sits ABOVE Sarah's Picture, not as Sarah's Picture itself. To-do focused.
- Children as §1 per spec 42 reframe.
- Private doc has no version chip — lightweight last-updated stamp + history log. Full versioning activates on joint doc only.

**Reconcile**
- Joint doc mirrors private doc shape (three-column). Terminology = sections, not chapters.
- Status quad is the phase header: Agreed by both / Values differ / New to you / Gap to address. Filterable.
- Conflict card pattern: side-by-side values + provenance + delta + non-judgemental CTA.
- AI deliberation queue in right rail, biggest-impact-first ordering.
- Mark status machine: not-invited / invited-not-opened / opened-not-started / building-N-M / shared.
- First-visit welcome banner dismissible; post-dismiss the attention banner takes its slot.
- Joint doc uses V1.0 / V2.0 / Vx.y versioning with AGREED suffix.

**Settle**
- Proposal renders as a document (same shell). Legal styling.
- Option cards per section: title + Sarah £ impact + Mark £ impact + descriptor + radio.
- AI coach right rail with four card types: Court reasonableness / Fairness check / Coaching / On this comment.
- Counter-proposal section view: split columns, three-button response row (Discuss / Counter / Accept).
- Progress board: convergence chart + version history timeline + still-open card + agreed list.
- Final agreement: both parties explicitly sign to lock. Retrospective convergence chart preserved.

**Finalise**
- Document generation: consent order + D81 + Form P (if PSO) + Settlement summary + optional statement of arrangements.
- Pre-flight is a validation gate. Eight initial checks. Print-report affordance.
- Three-tier solicitor fork: £0 direct / £250 pensions-only / £450 full. Recommended badge logic per case.
- Submit page: four confirmations required. Submission mechanism (MyHMCTS vs manual) open (68f F-4).
- Post-submit tracker absorbs Move-on for V1. Court-sealed state updates the agreement artefact.

---

## What went well

- **Splitting the spec file when it timed out** was the right call. Seven small files are more maintainable, each atomic, each addressable in downstream specs. Better than a 1,500-line monolith.
- **Live-register approach (68f)** captures 27 open decisions with full context so the next session can triage without losing state. No "what were we parking?" confusion.
- **Phase model reconciliation early** (6→5, Share-as-action) unblocked downstream locks across all four phase specs.
- **Positioning discipline held** — never described as disclosure tool, never shortcut to Form E, always settlement workspace.
- **User corrections integrated fast** — when user flagged the "ahead of ourselves" moment, pivoted within one exchange.

## What could improve

- **Image handling should be tested early** — first time we hit the 2000px limit was mid-walk-through. If we'd known earlier we could have asked user to export at 1500px from the start.
- **Don't propose execution steps (code extraction) until reconciliation is complete** — almost skipped planning phase. User flagged it.
- **Pre-pivot specs (03-06, 11, 12)** weren't read this session — correct per CLAUDE.md rule. Good discipline, worth noting so session 22 keeps it up.
- **Branch hygiene** — system prompt specified `claude/decouple-settlement-workspace-XGTHM` for this session but work continued on oXXQ7 from session 20. All spec 68 work lives on oXXQ7. Session 22 should adopt the new branch cleanly.

---

## Open loops → session 22

### Must-do before Phase B (Build Map)

1. **Walk through the blocked image batch in prose** — nav thoughts, Sarah's build → share journey, strawperson share modals, first-time experience, dashboard first-time / return / post-bank-connection states. Alternative: user re-exports at ≤1500px wide.
2. **Lock 68f register entries that are decidable now**:
   - C-N1 app nav wireframe (design pass needed)
   - C-S1 share modal fields per party type
   - B-3 dashboard detailed spec
   - G7-1 through G7-5 (Mark IS1 placement, priorities/worries, invitation expiry, correction treatment, AI plan output)
3. **Pressure-test dashboard spec 04** against 6-phase model + doc-as-spine. Output: spec 04 update or replacement.

### Phase B — Build Map

4. **Produce Complete Settlement Workspace Build Map**: single doc mapping every phase to components, data model, engine dependencies, design refs, MVP/V1.5/V2 scope. Covers distribution from spec 67 profiling too.

### Phase C — Execution (only after A+B complete)

5. Plan clean rebuild: same-repo restructure vs new top-level. Stable libs to preserve (engine, bank, AI, decision trees, test scenarios). Map new /app and /components around 5-phase model.
6. First deployable slice — which phase, which end-to-end flow, what "done" looks like.
7. Design system foundation — tokens, primitives, anchor components.
8. Code extraction from Claude AI Design prototypes for Sarah's Picture + Reconcile V2.0 anchor screens.

### Specs to write (downstream of 68 suite)

Human-readable names, not numbers:
- Sarah's Picture — private document view
- Our Household Picture — shared document view
- Reconciliation flow
- Settlement proposal flow
- Finalise flow
- Dashboard — workspace home
- Share modal pattern
- AI coach pattern
- Trust badge taxonomy
- Escape-hatch exports
- Mark status machine
- Joint-doc version model

### Specs to update

- Spec 42 — reflect 5-phase model, Share-as-action, Move-on fold-in
- Spec 44 — align document-as-spine articulation with 68 framing

---

## Files created this session

```
docs/workspace-spec/68-synthesis-hub.md                       — Wire reconciliation hub
docs/workspace-spec/68a-decisions-crosscutting.md             — Cross-cutting locked
docs/workspace-spec/68b-decisions-build.md                    — Build phase locked
docs/workspace-spec/68c-decisions-reconcile.md                — Reconcile phase locked
docs/workspace-spec/68d-decisions-settle.md                   — Settle phase locked
docs/workspace-spec/68e-decisions-finalise.md                 — Finalise phase locked
docs/workspace-spec/68f-open-decisions-register.md            — 27 open decisions LIVE
docs/HANDOFF-SESSION-21.md                                    — This file
docs/SESSION-CONTEXT.md                                       — Rewritten for session 22
```

## Commits (in order, all on `claude/decouple-financial-workspace-oXXQ7`)

```
c534178 spec 68: wire reconciliation synthesis hub
671b096 spec 68a: cross-cutting decisions locked
053e211 spec 68b: Build phase decisions locked
00ed59b spec 68c: Reconcile phase decisions locked
ae46fca spec 68d: Settle phase decisions locked
abd2aae spec 68e: Finalise phase decisions locked
298a860 spec 68f: open decisions register
```

Plus session 22 handoff commits (this file + SESSION-CONTEXT rewrite).
