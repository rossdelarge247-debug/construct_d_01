# Spec 68g — Visual Anchor Register (session 22)

**Date:** 22 April 2026
**Parent:** spec 68 (synthesis hub) · sibling to 68f (open decisions register).
**Status:** LIVE. Catalogues visual anchor components surfaced by session 22 Claude AI Design prototype wires. These are the extraction targets for Phase C — exact visual treatments to preserve and rebuild in-product.

**Convention:** Same as 68f — `C-V{N}` identifier, status glyph (🟠 open · 🟢 locked · 🔵 deferred V1.5+ · ⚫ dropped), entries include evidence (source wire), target (when spec + extraction happen).

**Scope rule:** Copy in wires is NOT final and may drift from phase-model language. Visual treatment IS the target. Label reconciliation handled separately under 68f C-N1b + C-U4.

---

## Welcome tour anchors (first-time journey)

### 🟠 C-V1 · Phase colour system
**Pattern:** Each phase carries a signature accent + full-canvas gradient wash.
- Build → indigo
- Reconcile → pink / magenta
- Settle → teal / blue
- Finalise → green
Used on phase chip ("PHASE N · X"), step numeral, demo-card details, page background gradient. Sets emotional arc across the journey (calm → work-it-out → settle → done).
**Evidence:** Session 22 welcome tour (5 screens) + dashboard (phase-accent card washes).
**Target:** Token spec before Phase C. Define hex values, gradient stops, application rules per surface.

### 🟠 C-V2 · Welcome carousel shell
**Pattern:** Full-bleed page. Serif display headline with italic accent word. Italic subhead. Body paragraph. Hero demo card offset right. Persistent bottom stepper (C-V3). Back/Next bottom corners. Skip-tour upper-right. Identity chip upper-right with status sub-label.
**Evidence:** Session 22 welcome tour screens (Intro + 4 phase steps).
**Target:** Anchor-candidate for Phase C extraction. First deployable slice signpost.

### 🟠 C-V3 · Persistent stepper component
**Pattern:** Pill-shaped, horizontal, numbered badges. Ticks on completed steps, outlined box on current, dot on pending. Separator bars between. Keyboard-driven ("Press → to continue").
**Evidence:** Session 22 welcome tour.
**Open:** Reuse scope — tour-only vs any multi-step flow (confirmation flow, share modal, pre-flight)?
**Lean:** reusable pattern with config (step count, labels, completion model).
**Target:** Pattern spec during Build Map.

### 🟠 C-V4 · Keyboard affordance pattern
**Pattern:** Typographic hint near primary CTA: "Press → to continue". Light weight, inline arrow glyph. Sets the calm, considered tone.
**Evidence:** Session 22 welcome tour (all four phase steps).
**Target:** Lock convention during Phase C — arrow glyph notation, "Press X to Y" template, surfaces it appears on (tours, long forms, multi-step flows).

### 🟠 C-V5 · Phase demo-card pattern
**Pattern:** Hero card offset right in each tour step. Shows *actual product structure* previewing the phase's real interface, not marketing decoration. Rounded, subtle elevation, phase-accented details.
- Build demo → transaction list with sync indicator + "1,284 classified · 3 need review · AI categorised"
- Reconcile demo → two-party status card (Sarah 100% / Mark 76%) + Differences-found detail with £ deltas
- Settle demo → proposal capital-split slider (50/50 ↔ 70/30 reasonable band) + AI Legal-check card with citations
- Finalise demo → Court-ready package (Consent Order / Form D81 / Disclosure bundle) + Solicitor review / Submit digitally
**Evidence:** Session 22 welcome tour.
**Target:** Anchor-candidate per phase. Preserves the "trailer-for-the-real-thing" cohesion device.

---

## Dashboard anchors

### 🟠 C-V6 · 5-phase horizontal stepper (dashboard)
**Pattern:** Full-width pill bar at top of dashboard. Numbered phase badges (1–5), phase label, status sub-label ("In progress / Locked / Complete"). Black/filled current, outlined pending, outlined-dimmed locked. Related to C-V3 but distinct — dashboard version is always-visible nav, not a tour progress indicator.
**Evidence:** Session 22 dashboard wires (3 states).
**Target:** Pattern spec with C-V3 as a family. See 68f C-N5 for two-nav-surfaces parent.

### 🟠 C-V7 · Task taxonomy chip system
**Pattern:** Small pill chips on every task row tagging its nature:
- `Evidence` — light blue
- `Practical` — pink / rose
- `Legal` — lavender / purple
Rendered leftmost on task row before label.
**Evidence:** Session 22 dashboard refined wire (3rd state).
**Open:** See 68f B-11 — is 3 categories enough? Emotional / Welfare missing? Where does "Outline spending needs" fit (Evidence + Practical)?
**Target:** Audit all task types across 5 phases, then lock taxonomy.

### 🟠 C-V8 · Task row component
**Pattern:** `[taxonomy chip] [task label with optional inline link] [status CTA right-aligned]`. CTA variants:
- `Done` — outlined grey pill (past-tense confirm)
- `Outline now` — black pill (action due)
- `Upload now` — indigo pill with upload glyph (evidence due)
- `Locked` — outlined dimmed pill (phase not yet unlocked)
Bottom of list: `+ Add a task` link (scope open — see 68f B-14).
**Evidence:** Session 22 dashboard wires.
**Target:** Anchor component for any task-list surface (dashboard, right-rail Needs-your-attention, per-section task callouts).

### 🟠 C-V9 · Connected-data-source card
**Pattern:** Rounded card, peach/warm tint when active. Collapsed state: brand letter-mark + "Connected to {bank}" + "{N} accounts · {M} transactions classified · Synced {time}" + `Add another bank` CTA + expand chevron. Expanded state reveals account list with masked account numbers (`20-00-00 ****4821`), balances (negative in red), footer row `🔄 Auto-syncs daily · read-only via TrueLayer` + `Manage connection` link.
**Evidence:** Session 22 dashboard refined wire (3rd state).
**Target:** Anchor component for the data-sources right-rail panel (68b B-D4) + dashboard source-confirmation card.

### 🟠 C-V10 · Bank picker grid
**Pattern:** 2 × 4 bank cards, each: coloured letter-mark icon (brand colour) + bank name + "Open banking" sub-label + `+` add affordance. Under grid: "Don't see your bank? Search all 40+ providers" (link). Sibling card below: manual-entry fallback strip with upload glyph + body + `Enter manually` CTA.
**Evidence:** Session 22 first-time dashboard wire.
**Target:** Anchor component for bank-connection entry point. Canonical UI.

### 🟠 C-V11 · Trust band component
**Pattern:** Horizontal row of three trust signals with dot separators, centre-aligned under body copy of a step. Example: `🛡 FCA regulated via TrueLayer · 🔒 Read-only — we can't move money · Disconnect anytime`. Reusable on any step needing trust reassurance (bank connect, share action, submit to court).
**Evidence:** Session 22 first-time dashboard wire.
**Target:** Anchor component. Define slot model (icon + short phrase).

### 🟠 C-V12 · Locked-section inline treatment
**Pattern:** Section H2 with `🔒 LOCKED · Unlocks when {gate} is complete` inline hint (dimmed, small caps). All child cards and task rows dimmed. CTAs replaced with `Locked` outlined pills. Entire section remains visible but non-interactive.
**Evidence:** Session 22 dashboard refined wire ("Disclosure & reconcile" and "Settle & finalise" sections).
**Target:** Anchor pattern. Ties to 68a C-N2 (dimmed+tooltipped locked phases) and 68f C-N1c (unlock copy locked).

### 🟠 C-V13 · Phase accent-tint card washes
**Pattern:** Cards within each phase section carry a subtle background wash tinted toward the phase's accent (C-V1). Peach/rose for Preparation active cards, deeper pink for private-area cards, light blue for Settle cards, etc. Extends the phase colour system into UI surfaces beyond tour backgrounds.
**Evidence:** Session 22 dashboard refined wire (3rd state).
**Target:** Token spec with C-V1. Define tint opacity and application rules.

### 🟠 C-V14 · Time-estimate affordance
**Pattern:** Large display typography, right-aligned on a step card, format `Est. time ~Ns` or `~{N}s` / `~{N} min`. Sets expectation before the user commits to a task.
**Evidence:** Session 22 first-time dashboard (bank-connect card: `Est. time ~60s`).
**Target:** Pattern spec. Lock format, typography, application rules (any step that has a knowable duration).

---

## Maintenance

These entries feed directly into the Build Map (Phase B) as Anchor / Derived / Variant / Re-use tags, and into Phase C execution planning as the extraction shortlist. When an anchor is specced + extracted, move it here to 🟢 with a link to its component spec + code commit.

Related session 22 register changes live in:
- `68g-build-opens.md` — build-phase new opens
- `68g-copy-share-opens.md` — copy audit + share mechanics opens
- `68f-open-decisions-register.md` — locked entries from session 22 (C-N1 splits, C-T1, C-S1a, B-3)
