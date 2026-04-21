# Spec 68f — Open Decisions Register (LIVE)

**Date:** 21 April 2026
**Parent:** spec 68 (synthesis hub)
**Status:** LIVE document. Entries tick through *open → locked / deferred / V1.5* as decisions are made. Add new entries when they surface; never silently.

**Convention:** `{AREA}-{N}` where AREA = C (cross-cutting) / B (build) / R (reconcile) / S (settle) / F (finalise) / G7 (Gap 7 / Mark). Status: 🟠 open · 🟢 locked · 🔵 deferred V1.5+ · ⚫ dropped.

---

## Cross-cutting

### 🟠 C-N1 · App-level nav wireframe
**Context:** When inside a document, left rail is the doc TOC (68a C-N1 locked). But app-level phase nav needs its own home.
**Options:** (a) icon rail further-left (4-col effective) · (b) breadcrumb-as-nav with dropdowns · (c) collapsible three-layer (app → doc → section) · (d) top-tab bar
**Lean:** (a) or (c). Needs a dedicated nav wireframe design pass.
**Target:** Phase A step 1 — next session candidate.

### 🟠 C-T1 · Trust badge visual treatment
**Context:** Six-level trust taxonomy locked (68a C-T2). Visual not yet.
**Options:** Icon chip · dot + label · colour-banded pill · text-only inline
**Lean:** icon + tooltip, subdued. Decide when Sarah's Picture anchor extracted.
**Target:** Phase C step 1 (code extraction).

### 🟠 C-S1 · Share modal field sets per party type
**Context:** Three party types locked (ex / solicitor / mediator). Fields per type not yet.
**Options:** Ex = name + email. Solicitor = firm + ref + email + case number? Mediator = firm + case ref + email?
**Lean:** minimal for V1 — name + email for all; additional fields V1.5.
**Target:** When share modal anchor designed.

### 🟠 C-E1 · Escape-hatch export trigger thresholds
**Context:** Export CTA triggers on stuck states (68a C-E2). Thresholds open.
**Options:** Mark-not-engaged: 2 / 4 / 6 weeks. Stuck reconciliation: 3 / 5 / 7 rounds.
**Lean:** Mark 4 weeks, reconciliation 5 rounds. Validate against realistic timelines.
**Target:** Before first deployable slice.

### 🟠 C-X1 · Exit-this-page behaviour detail
**Context:** Footer exit present, redirects to BBC per GOV.UK pattern (68a C-X1).
**Options:** Instant redirect · confirm-first modal · clear local state on exit
**Lean:** instant redirect + clear local state (never confirm — defeats the safety purpose). Consult safeguarding specialist.
**Target:** Before V1 ship.

### 🟠 C-D1 · Data sources manual refresh
**Context:** Auto-refresh on login locked (68a C-D1). Manual refresh not yet decided.
**Options:** (a) always-visible refresh button · (b) hidden unless stale > 24h · (c) no manual refresh
**Lean:** (b) — surfaces only when useful.
**Target:** Build anchor design.

---

## Build

### 🟠 B-1 · Section-level control set per section type
**Context:** Per-section inline controls locked in principle (68b B-E2). Exact controls per section type open.
**Options:** Per section: Property needs Add valuation, Upload Zoopla, Edit narrative. Children needs Add child, Edit arrangements. Spending needs Re-categorise, Add transaction. etc.
**Lean:** define a base set (Edit / Upload / Delete) + per-section extensions. Spec per section.
**Target:** Build detail spec (downstream, Phase A step 5).

### 🔵 B-2 · To-do snooze
**Context:** In-place to-do actions locked for V1: dismiss / mark complete (68b B-T4). Snooze noted but deferred.
**Status:** V1.5 backlog.
**Target:** v2-backlog.md reference.

### 🟠 B-3 · Dashboard detailed spec
**Context:** Dashboard sits above Sarah's Picture, to-do focused (68b B-T1). Actual design not produced.
**Options:** Work from wires (no dashboard wire in this batch) vs from first principles vs combine with first-time welcome tour concept.
**Lean:** design fresh with spec 04 pressure-test as input.
**Target:** Phase A step 3 (next immediate work).

### 🟠 B-4 · Section list mapped to ES2 structure
**Context:** Section order in wire is indicative (68b B-C1). Definitive ES2 mapping open.
**Options:** Map each wire section to its ES2 counterpart. Decide conditional sections (Business, Housing transition).
**Lean:** follow ES2 section numbering + add conditional sections as sub-sections where relevant.
**Target:** Phase A step 5 (Build detail spec).

---

## Reconcile

### 🟠 R-1 · Status quad tolerance rules
**Context:** Four quad buckets locked (68c R-Q3). Tolerance for "agreed" not yet.
**Options:** Exact match · within £X · within X% · category-dependent (property = 5%, pension = exact, cash = £100).
**Lean:** category-dependent tolerance rules.
**Target:** Reconcile detail spec.

### 🟠 R-2 · Conflict card resolution actions
**Context:** Set locked (Discuss / AI midpoint / Zoopla / Agree / Defer per 68c R-C2). Per-action UI detail open.
**Options:** Each action opens a modal · inline expansion · separate view
**Lean:** inline expansion for Discuss + Defer; modal for Zoopla + Agree; full-screen for AI midpoint walkthrough.
**Target:** Reconcile anchor design.

### 🟠 R-3 · Discuss-this thread UI
**Context:** Per-item thread locked (68c R-C3). Mechanics open.
**Options:** Slack-like threaded chat · Juro-like linear comments · quick-actions + free-text hybrid
**Lean:** hybrid — quick-action chips at top, free comments below. Async by default; "typing" indicator optional.
**Target:** Reconcile anchor design.

### 🟠 R-4 · AI queue ordering weights
**Context:** Biggest-impact-first principle locked (68c R-A3). Weights open.
**Options:** £ impact only · £ impact × emotional stakes heuristic · easiest-first · mixed.
**Lean:** £ impact × settling-speed (easy wins early, hard fights later). AI-driven per case.
**Target:** AI coach pattern spec (spec 68g? — TBD).

### 🟠 R-5 · Resolve-all walkthrough flow
**Context:** Linear wizard affordance locked (68c R-A5). Per-step flow open.
**Options:** Full-screen wizard · modal chain · inline scroll-through
**Lean:** focused inline overlay, one item at a time, with "back to overview" affordance.
**Target:** Reconcile anchor design.

### 🟠 R-6 · Mark's progress visibility (privacy)
**Context:** Wire shows "8 of 14 sections" (68c R-M4). Privacy consideration.
**Options:** Full fraction · bucketed (Started / Halfway / Near done) · binary (Building / Shared)
**Lean:** bucketed. Respects Mark's work-in-progress state without over-surveillance.
**Target:** Before V1 ship.

---

## Settle

### 🟠 S-1 · Pre-reconciliation proposal drafting
**Context:** Raised early in session. Whether Sarah can draft a proposal before reconciliation is complete.
**Options:** (a) no — hard gated to resolve-all · (b) yes — but flagged "for mediation" mode if facts not locked · (c) yes — general
**Lean:** (a) for V1 — prevents proposal-built-on-stale-facts trap. (b) is an interesting V1.5 path if reconciliation stalls and user wants mediation prep.
**Target:** Lock this session or at latest before Phase B (Build Map).

### 🟠 S-2 · Custom / free-text proposal option
**Context:** Option cards are structured per section (68d S-P2). Free-text override open.
**Options:** No custom option · free-text with no AI coaching · free-text with AI coaching applied
**Lean:** free-text with AI coaching. Preserves user autonomy without losing the reasonableness check.
**Target:** Settle detail spec.

### 🟠 S-3 · Signature capture mechanism
**Context:** Explicit sign required to lock agreement (68d S-G2). Mechanism open.
**Options:** (a) in-product attestation checkbox + identity-verified account · (b) third-party e-sign (DocuSign / HelloSign) · (c) upload signed scan · (d) hybrid (attestation for V1, e-sign V1.5)
**Lean:** (d). V1 = identity-verified account + explicit attestation (legally sufficient per spec 41 research). V1.5 = e-sign integration.
**Target:** Before V1 ship.

---

## Finalise

### 🟠 F-1 · Document inclusion rules
**Context:** Core set locked (68e F-D2). Inclusion rules (when does Form P appear? Statement of arrangements?) open.
**Lean:** Form P auto-included if pension sharing order present. Statement of arrangements shown optional if children section exists.
**Target:** Finalise detail spec.

### 🟠 F-2 · Pre-flight check additions
**Context:** Eight-check set locked (68e F-P2). Potential additions: tax implications · CGT on property transfer · spousal maintenance Form A attached · occupation order (if needed).
**Lean:** start with eight for V1, add as edge cases surface.
**Target:** Post-V1 iteration.

### 🟠 F-3 · Solicitor tier pricing + partners
**Context:** £0 / £250 / £450 tiers locked in structure (68e F-R2). Actual pricing + partner firms open.
**Options:** Negotiate with panel firms · fix pricing with single partner · tiered pricing per case complexity
**Lean:** panel model with fixed fees per tier. Commercial negotiation needed.
**Target:** Before V1 launch.

### 🟠 F-4 · Submission mechanism (MyHMCTS vs manual)
**Context:** Direct submission is ambitious (68e F-S5). V1 fallback is guided manual.
**Options:** (a) MyHMCTS integration from day 1 · (b) manual with our prep · (c) MyHMCTS V1.5 after legal precedent
**Lean:** (b) V1 launch → (c) V1.5 expansion. Research MyHMCTS access model.
**Target:** Before V1 build.

### 🟠 F-5 · Post-submit tracker telemetry source
**Context:** Tracker states locked in principle (68e F-T2). Data source open.
**Options:** User-self-reports (manual update) · MyHMCTS status API · user uploads court letters for OCR-based status detection
**Lean:** V1 = user self-reports + email prompts. V1.5 = MyHMCTS API if available.
**Target:** V1 ship fallback is self-report.

---

## Gap 7 — Mark (invited party) from spec 67

Five decisions parked pending this session's wire reconciliation. Revisit now that we have clearer shared context.

### 🟠 G7-1 · IS1 (shared context confirmation) placement
**Context:** Mark's IS1 — "here's what we know so far" with correction rights. Placement open.
**Options:** Pre-signup screen vs inline on Moment 1
**Lean:** pre-signup — reduces friction by showing value before account creation.
**Target:** Lock this session or next.

### 🟠 G7-2 · Mark's priorities/worries (IS5/IS6)
**Context:** Whether Mark answers priorities fresh or inherits from Sarah.
**Options:** Fresh · inherit · skip
**Lean:** fresh. Generates his own AI plan. Preserves autonomy.
**Target:** Lock this session or next.

### 🟠 G7-3 · Invitation link expiry
**Context:** Default expiry for Mark's invitation link.
**Options:** 7 days · 14 days · 30 days · configurable by Sarah
**Lean:** 14 days default, configurable on resend.
**Target:** Lock this session or next.

### 🟠 G7-4 · "Mark corrects Sarah" treatment
**Context:** When Mark corrects inherited shared context, how it's captured.
**Options:** Full dispute on every correction · silent merge for trivial (misspelling, age off by 1) · dispute only material
**Lean:** dispute only material, with a threshold. Trivial corrections apply silently with an audit-log entry.
**Target:** Lock this session or next.

### 🟠 G7-5 · AI plan output for Mark
**Context:** Same O7 structure or lighter summary.
**Options:** Full parallel to Sarah's · lighter "you've been invited, here's what's ahead" · skip entirely
**Lean:** full parallel. Mark is a builder, not a verifier — he needs the same orientation.
**Target:** Lock this session or next.

---

## Maintenance

Add new entries when a spec or design surfaces an unanswered question. Never park silently. Update status inline when locked; keep the decision trail visible.

When an entry locks, move the decision into the relevant phase-detail spec (68a-e) and update the status here to 🟢 with a link to the locking commit.
