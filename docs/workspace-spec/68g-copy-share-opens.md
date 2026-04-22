# Spec 68g — Copy + Share Open Decisions (session 22)

**Date:** 22 April 2026
**Parent:** spec 68 (synthesis hub) · sibling to 68f + 68g-visual-anchors.md + 68g-build-opens.md.
**Status:** LIVE. Copy-pattern and share-mechanic open decisions surfaced by session 22 wire walk-through.

**Convention:** `C-U{N}` copy / `C-S{N}` share, continuing 68f's cross-cutting series. Status glyph (🟠 open · 🟢 locked · 🔵 deferred V1.5+ · ⚫ dropped).

---

## Copy audit + language patterns

### 🟠 C-U4 · Disclosure-language audit across surfaces
**Context:** 68a C-U1 locks "never 'financial disclosure tool' framing" as load-bearing positioning. Session 22 wires leaked disclosure-tool language back across ~12 surfaces:
- Primary CTA: "Disclose your position"
- Dropdown item: "Disclose your position"
- Sidebar heading: "Prepare your disclosure"
- Sidebar section: "Your position"
- Breadcrumb: "Prepare your picture (disclosure)"
- Empty-state: "Nothing disclosed yet" (repeated ×5 per screen)
- Empty-state CTA: "Complete your spending disclosure"
- Attention callout: "Complete your spending disclosure based on your real banking transaction data now"
- Carousel headline: "Prepare your disclosure"
- Dashboard stepper: "Disclose" (step 2 label)
- Dashboard H2: "Disclosure & reconcile"
- Dashboard card label: "View your disclosure picture" / "Next disclosure tasks"
- Footer column: "Sharing & Collaboation" [sic]
- Private-doc version chip: "V1 Last updated 21/04/2026" (also conflicts with 68b B-V1 which drops version chips)
**Decision:** Run a surface-by-surface copy audit before Phase C extraction. Produce a single copy pattern doc covering: (a) replacement vocabulary (picture / shared / build / reconcile / settle / finalise), (b) banned words (disclose / disclosure / position), (c) empty-state verb family (see C-U5), (d) confirmation / attention / success / error tone templates.
**Target:** Dedicated copy-audit pass before Build Map finalises.

### 🟠 C-U5 · Empty-state CTA copy pattern
**Context:** Session 22 wires use inconsistent empty-state CTA verbs: "Add your children information now" / "Complete your spending disclosure" / "Nothing disclosed yet" + "Add your children information now" (same card). No unified pattern.
**Options:** (a) "Tell us about X" — warm, declarative · (b) "Add X" — direct, action-oriented · (c) "Get started with X" — procedural · (d) mixed per context (tell-us for narrative sections, add for list sections).
**Lean:** (d) — narrative sections (Children / Home) use "Tell us about your {topic}"; list sections (Debts / Other assets / Pensions) use "Add {item}". Empty-state body stays light: "Nothing here yet" (per C-U4 audit, not "Nothing disclosed yet").
**Target:** Part of C-U4 audit output.

### 🟠 C-U6 · Stepper / section label unification across surfaces
**Context:** Session 22 uses three different labels for the same territory within one screen — "Prepare" (tour stepper), "Preparation" (dashboard section H2), "Disclose" (dashboard stepper step 2). And across screens: "Your position" (sidebar) vs "Sarah's Picture" (doc title) vs "private disclosure" (task label).
**Decision:** All nav surfaces + section H2s use the 5-phase labels from 68a C-N3 (Start / Build / Reconcile / Settle / Finalise). Tour stepper may use verb-action labels (Prepare / Share / Build / Finalise) only if separated clearly from nav — lean is to unify.
**Options:** (a) unify all — stepper + section + nav all use phase labels · (b) allow tour stepper to keep verb labels, unify everywhere else.
**Lean:** (a) — simplest, removes cognitive load. Tour stepper can render phase labels compactly; verbs can live in the tour body copy.
**Target:** Copy audit output (C-U4) and Build Map input.

---

## Share mechanics

### 🟠 C-S5 · Selective publish step in share modal
**Context:** 68a C-S3 + 68b B-S3 lock "selective publish checkboxes at share time" — Sarah checkboxes which sections / fields push into the shared view. Session 22 strawperson share modal has only name + email + send — no selective publish step.
**Decision:** Share modal must include a selective-publish step between Who (party details) and Confirmation.
**Shape:** Step 2 of modal = "What to share". Section checkbox list, all-ticked by default. Summary strip at bottom: "You're sharing {N} of {M} sections with Mark". Support deselecting sections with tooltip "You can share these later".
**Target:** Share modal anchor design. Likely before first deployable slice if Share is in the slice.

### 🟠 C-S6 · Share CTA adaptive-state visual rendering
**Context:** 68a C-S1 locks adaptive states (pre-share / shared / pending-update / sent / in-flight). Session 22 wires show only the pre-share state.
**Decision:** Design explicit visual treatment for each state:
- Pre-first-share: `Share with Mark ▾` (primary red)
- Post-share, no new edits: `Shared with Mark · 3 days ago ▾` (grey chip, dropdown still available for re-share to others)
- Post-share, new edits since: `Share update with Mark ▾` (amber nudge + optional dismissable banner on page)
- In-flight: spinner + disabled
- Error: red error chip + retry
**Target:** Build anchor design.

---

## Maintenance

These sit alongside 68f's cross-cutting series. When a copy pattern is locked, it moves into a downstream copy-spec doc (TBD); when a share-mechanic decision locks, it moves into 68a C-S section with a version bump.
