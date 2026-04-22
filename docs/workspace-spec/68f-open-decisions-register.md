# Spec 68f — Open Decisions Register (LIVE)

**Date:** 21 April 2026
**Parent:** spec 68 (synthesis hub)
**Status:** LIVE document. Entries tick through *open → locked / deferred / V1.5* as decisions are made. Add new entries when they surface; never silently.

**Convention:** `{AREA}-{N}` where AREA = C (cross-cutting) / B (build) / R (reconcile) / S (settle) / F (finalise) / G7 (Gap 7 / Mark). Status: 🟠 open · 🟢 locked · 🔵 deferred V1.5+ · ⚫ dropped.

---

## Cross-cutting

### 🟢 C-N1a · Contextual journey-map structure — LOCKED (session 22)
**Context:** In-doc left rail and dashboard horizontal stepper both render the same 5-phase journey map, context-adapted. Amended 68a C-N1.
**Resolution:** See amended 68a C-N1. Both surfaces show all five phases always; current phase expands to doc TOC (rail) or task groups (dashboard); locked phases dimmed with one-level sub-item preview + "Unlocks when…" hint.
**Evidence:** Session 22 Sarah's Picture wires + Dashboard wires.

### 🟠 C-N1b · Phase + document label pass
**Context:** Wire labels drift from phase model ("Prepare your disclosure" / "Your position" / "Shared position" / "Preparation" / "Disclose"). Must unify per 68a C-N3 + C-U1.
**Options:** Straight relabel (wires → phase-model labels) vs tour-stepper keeps verb labels (Prepare/Share/Build/Finalise) while nav uses phase labels.
**Lean:** unify everywhere — nav, stepper, breadcrumb, section H2s all use Start / Build / Reconcile / Settle / Finalise.
**Target:** Copy pass before Phase C anchor extraction.

### 🟢 C-N1c · Unlock-when copy — LOCKED (session 22)
**Resolution:** Inline hint + tooltip copy locked:
- Build → unlocks on signup completion (implicit, no hint needed)
- Reconcile → "Unlocks when you share your picture with Mark"
- Settle → "Unlocks when you and Mark agree on your shared picture"
- Finalise → "Unlocks when your settlement is signed by both of you"
- Dashboard-section variants (confirmed by wire): "Unlocks when preparation is complete" / "Unlocks when reconciliation is complete" — acceptable alternates for phase-group sections.

### 🟢 C-N1d · Locked-phase preview depth — LOCKED (session 22)
**Resolution:** Locked phases show one level of sub-items, dimmed. Reinforces "here's the whole journey" framing per user intent and session 22 wire evidence.

### 🟠 C-N5 · Two-nav-surfaces pattern specification
**Context:** Dashboard uses horizontal 5-phase stepper; in-doc uses vertical left-rail journey map. Same phase-set, different contexts.
**Options:** Pattern-spec the two surfaces as one component family with context props vs spec each independently.
**Lean:** one component family (phase-map) with two render modes (horizontal-stepper / vertical-rail).
**Target:** Before Phase C anchor extraction.

### 🟢 C-T1 · Trust badge visual treatment — LOCKED (session 22 wire evidence)
**Resolution:** Chip pattern — **colour = taxonomy level, label = specific source**. Confirmed by wires:
- Amber "Estimated" chip = self-declared (user-added / estimated values)
- Green "Barclays Bank" / "Verified from Barclays xxxx2323" chip = bank-evidenced (source named)
- Remaining four levels (credit-verified / document-evidenced / both-party-agreed / court-sealed) render with their own accent colour + source label, visual treatment to be finalised during Phase C anchor extraction but pattern is locked.
**Evidence:** Session 22 spending-estimates → bank-evidenced upgrade wires.

### 🟢 C-S1a · Ex-modal field set — LOCKED (session 22)
**Resolution:** First name + Last name + Email address. Minimal per lean. Confirmed by session 22 strawperson share-modal wires.

### 🟠 C-S1b · Solicitor + mediator modal field sets
**Context:** Ex locked (C-S1a). Solicitor + mediator party-type modals not yet wired.
**Options:** Solicitor = firm + ref + email + case number? Mediator = firm + case ref + email?
**Lean:** minimal for V1 (name + email), additional party-specific fields V1.5 when routed to specialists.
**Target:** When solicitor + mediator anchor variants designed.

### 🟢 C-E1 · Escape-hatch export trigger thresholds — LOCKED (session 22)
**Resolution:**
- Mark non-engagement (no account created or no activity after invite) → export-as-Form-E CTA surfaces at **4 weeks**
- Stuck reconciliation (rounds without forward progress) → export-as-ES2 CTA surfaces at **5 rounds**
Validate both thresholds against real usage telemetry post-V1 launch; treat as V1 defaults, subject to tuning.
**Target specs impacted:** 68a C-E2 behaviour spec (thresholds now filled in).

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

### 🟢 B-3 · Dashboard detailed spec — LOCKED for shape (session 22)
**Resolution:** Dashboard shape locked across three states (first-time zero / first-time return post-connection / refined post-connection with taxonomy chips). Visual anchors catalogued in 68g (session 22 additions) under C-V6–V14. Copy remains subject to the C-U4 disclosure-language audit and C-N1b label pass.
**Evidence:** Session 22 dashboard wires (3 states).
**Remaining opens split out:** B-11 (task taxonomy completeness), B-12 (phase grouping 5→3), B-13 (state machine transitions), B-14 (user-added tasks scope).

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

### 🟢 G7-1 · IS1 (shared context confirmation) placement — LOCKED (session 22)
**Resolution:** Pre-signup. Mark's IS1 sits before account creation, as part of a tailored signup flow for the respondent that leverages data already captured from Sarah. Shows value before commitment; respondent-specific signup path (not the same as Sarah's).
**Target specs impacted:** spec 67 Gap 7 section (move from parked to resolved).

### 🟢 G7-2 · Mark's priorities/worries (IS5/IS6) — LOCKED (session 22)
**Resolution:** Mark answers his own priorities/worries fresh. He is a builder, not a verifier. **Opt-in / opt-out** — he can choose to build his own full AI plan *or* skip straight into responding to Sarah's picture without generating his own. Default path = opt-in (full parallel); opt-out is available for respondents who only want to engage with Sarah's work.
**Target specs impacted:** spec 67 Gap 7, and the AI plan output spec for the respondent variant (see G7-5).

### 🟢 G7-3 · Invitation link expiry — LOCKED (session 22)
**Resolution:** 14 days default. Configurable by Sarah on resend.

### 🟢 G7-4 · "Mark corrects Sarah" treatment — LOCKED (session 22)
**Resolution:** No silent merges. **There is no such thing as trivial when details need to be accurate.** Mark's IS1 is a series of confirm-or-correct questions, one per inherited fact — not a data-preview with correction buttons. Pattern:
- Per non-financial attribute (kids' ages, postcodes, addresses, length of occupation, relationship length, employer names, etc.) we ask Mark: *"Sarah said {value} — is that correct?"*
- **Confirm** → item marked cross-confirmed (trust level increments per 68a C-T2 taxonomy)
- **Correct** → Mark enters the new value → **conflict raised** into Reconcile with both values side-by-side
- Financial figures (account balances, mortgage amount, pension CETV, etc.) are not part of this flow — they come from each party's own bank connection and reconcile naturally via the joint document's conflict-card pattern (68c R-C).

Mirrors Sarah's own post-bank confirmation flow (ask-don't-assume).
**Target specs impacted:** spec 67 Gap 7; downstream IS1 anchor design; 68c Reconcile phase detail.

### 🟢 G7-5 · AI plan output for Mark — LOCKED (session 22)
**Resolution:** Full parallel to Sarah's O7, with nuance for the respondent role. Structure and depth mirror Sarah's plan — Mark is a builder too. Tone and framing acknowledge he came in as the invited party (e.g. "You've been invited to respond — here's the picture taking shape, and here's your parallel journey"). Not a shrunk or watered-down version; same substance, context-adapted framing. Ties to G7-2 opt-in default.
**Target specs impacted:** spec 67 Gap 7; AI plan generation spec (respondent variant).

---

## Maintenance

Add new entries when a spec or design surfaces an unanswered question. Never park silently. Update status inline when locked; keep the decision trail visible.

When an entry locks, move the decision into the relevant phase-detail spec (68a-e) and update the status here to 🟢 with a link to the locking commit.
