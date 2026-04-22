# Spec 68g — Build-phase Open Decisions (session 22)

**Date:** 22 April 2026
**Parent:** spec 68 (synthesis hub) · sibling to 68f (locked session-21 opens) + 68g-visual-anchors.md.
**Status:** LIVE. Open decisions surfaced by session 22 Build-phase wire walk-through (Sarah's Picture + dashboard states). Continuation of 68f "Build" section; new identifiers start at B-5 to avoid collision with 68f B-1 through B-4.

**Convention:** `B-{N}` identifier, status glyph (🟠 open · 🟢 locked · 🔵 deferred V1.5+ · ⚫ dropped), entries include context / options / lean / target.

---

### 🟠 B-5 · Private-doc default split assumption (50:50)
**Context:** Session 22 Sarah's Picture wire renders `Net equity £230,000 (£115,000 each @ 50:50)` on the family home — a pre-emptive 50:50 split shown as fact in Sarah's *private* picture.
**Risk:** Prejudges settlement framing. Contradicts spec 42 pillar "shared, not adversarial" by implicitly accepting a split before reconciliation. Users whose fair split is unequal (long marriage, children, pension imbalance) see their position pre-weakened.
**Options:** (a) no default split shown in private picture — only show gross values · (b) editable default with tooltip "change if you think a different share is fairer" · (c) hide split until Settle phase · (d) show range (e.g. "50:50 to 70:30") not a single point.
**Lean:** (b) — editable 50:50 default with tooltip. Preserves the starting-point convenience without smuggling a conclusion.
**Target:** Build anchor design.

### 🟠 B-6 · Post-bank-connection bank panel placement
**Context:** 68b B-D4 locks three right-rail panels (Snapshot / Data sources / Needs your attention). Session 22 wires render the connected-bank panel in the *middle column* as an always-visible expandable block, not in the right rail.
**Options:** (a) permanent middle-column fixture · (b) first-visit state only — collapses to right-rail Data sources card after session 1 · (c) user-dismissable · (d) move fully to right rail per 68b B-D4 lock.
**Lean:** (b) — first-visit emphasis, then collapses into right-rail Data sources. Balances "holy shit, it worked" moment with long-term real-estate efficiency.
**Target:** Build anchor design.

### 🟠 B-7 · Sidebar completion state derivation
**Context:** Session 22 wire shows Children (2) with partial green progress bar in sidebar while the §1 section reads "Nothing disclosed yet" — sidebar state drifted from section state. Wire artefact, but flags a real implementation rule.
**Decision:** Sidebar completion indicators must derive live from section data, never be set independently.
**Status:** Effectively locked as a principle; tracking here so the Build detail spec captures it.
**Target:** Build detail spec (downstream).

### 🟠 B-8 · Post-share unlock banner pattern
**Context:** Session 22 wire shows a dark banner at top of Sarah's Picture immediately after Share action: "You can now access your shared position" + `[Go to shared position]` CTA. Appears alongside the sidebar journey-map updating (Reconcile phase unlocks).
**Decision:** Pattern is a dismissable, one-time, post-action acknowledgement banner that links to the newly-unlocked phase. Not persistent — on dismiss, sidebar's unlocked state remains as the ongoing signal.
**Copy:** Per 68a C-U1, reframe to "You've shared your picture with Mark. Go to Our Household Picture to see his updates." with dismiss affordance.
**Target:** Lock pattern during Build anchor design.

### 🟠 B-9 · Section totals rendering
**Context:** Session 22 wire shows Outgoings with 5 categories (£300, £380, £560, £400, £250) but no section total. Total ties back to Monthly gap snapshot metric (68b B-M1).
**Options:** (a) no section total — sum implicit in Snapshot · (b) section-footer total line · (c) collapsible "Total outgoings: £1,890 p/m" summary row.
**Lean:** (b) — footer total line on any summable section (Outgoings, Debts, Assets subsections).
**Target:** Build detail spec.

### 🟠 B-10 · First-time tour scope
**Context:** Session 22 welcome tour is 4 content steps (Prepare / Share / Build / Finalise) plus Intro and Finish bookends. Our phase model has 5 phases; Start happens pre-signup so post-signup tour covers phases 2-5.
**Options:** (a) keep 4-step post-signup tour · (b) extend to 5 steps including a Start/Signup recap · (c) separate onboarding orientation for each phase (progressive onboarding) vs one upfront tour.
**Lean:** (a) — 4 post-signup steps matches user's "Just joined" state. Start phase is already completed by the time they see the tour.
**Target:** Lock scope during copy pass.

### 🟠 B-11 · Task taxonomy category completeness
**Context:** Session 22 dashboard wire introduces `Evidence` / `Practical` / `Legal` chip taxonomy on task rows (see 68g-visual-anchors C-V7). Three categories may not cover all task types.
**Examples to audit:** "Outline your spending needs" (Evidence? Practical?). "Book your MIAM and use your £500 voucher" (Legal? Practical?). Children welfare items (where do they sit — Practical, or a dedicated Welfare/Children category?).
**Options:** (a) 3 categories only · (b) add Welfare/Children · (c) add Financial (for spend/asset tasks distinct from pure Evidence) · (d) audit all task types across 5 phases and finalise set.
**Lean:** (d) — full audit, then lock. Preserve the simple three-colour visual if audit supports it.
**Target:** Before Build Map finalisation.

### 🟠 B-12 · Dashboard phase grouping (5 → 3 workbands)
**Context:** Session 22 dashboard renders phases as **Preparation** (phase 2) / **Disclosure & reconcile** (phase 2-3 grouped) / **Settle & finalise** (phase 4-5 grouped) in the section H2s — three work-bands below a 5-phase stepper. Reduces visual density.
**Options:** (a) accept 3-band grouping as canonical · (b) render each of 5 phases as its own section (more granular but heavier) · (c) only group adjacent phases when both are locked.
**Lean:** (a) — grouping reduces overwhelm, groups phases that happen in the same session of work. But make grouping logic explicit: "Preparation = Build; Disclosure & reconcile = Reconcile; Settle & finalise = Settle + Finalise post-agreement bundled".
**Target:** Lock grouping rationale in dashboard spec.

### 🟠 B-13 · Dashboard state machine
**Context:** Session 22 wires show three dashboard states (first-time zero / first-time return post-bank-connection / refined post-connection with taxonomy chips). More states probably exist (mid-phase with tasks complete, phase-completed-moving-on, waiting-for-Mark, stuck-reconciliation).
**Decision:** Define full state set + transitions + trigger events. Each state = one render configuration.
**Target:** Dashboard detail spec. Likely downstream of Build Map.

### 🟠 B-14 · User-added tasks
**Context:** Session 22 dashboard shows `+ Add a task` link at bottom of each task list. User can add their own items to the backlog.
**Options:** (a) V1 feature — user can add free-text tasks with optional taxonomy chip · (b) V1.5 feature — seeded tasks only for V1, user tasks later · (c) V1 but limited (name + due date, no taxonomy) · (d) dropped — too much scope creep for V1.
**Lean:** (b) — V1 ships seeded tasks (deterministic from engine state + user profile). User-added = V1.5. Keeps V1 tractable and predictable.
**Target:** Lock during Build Map.

---

## Maintenance

These sit alongside 68f's "Build" section (entries B-1 through B-4). When an entry locks, move the decision into 68b (Build phase locked spec) and flip status here to 🟢 with a commit reference.
