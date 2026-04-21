# Spec 68b — Build Phase Decisions Locked

**Date:** 21 April 2026
**Parent:** spec 68 (synthesis hub)
**Scope:** Decisions for the Build phase — Sarah's Picture (private document view) and the dashboard that sits above it. Supersedes earlier spec 22 / 25 / 04 framing of this territory.

---

## B-D Document shape

**B-D1 Sarah's Picture renders as a document, not a dashboard — LOCKED.**
Three-column layout. Legal-document styling (§-numbered sections, prose body, inline values). This is the primary Build artefact — not the old financial-summary page, not a dashboard of cards.

**B-D2 Left rail is the chapter TOC — LOCKED.**
Shows each section with a completion icon (✓ complete / ! needs attention / • in progress / ○ empty). Doubles as progress tracker. "In this document" label. "Sarah's Picture" title with total % completion (section-count basis).

**B-D3 Middle column is the document body — LOCKED.**
§-numbered sections, rendered as prose with inline structured data. Section sub-titles (e.g. "The home — 12 Oak Road, Exeter"). Line items icon-plus-amount pattern (neutral icons; no emoji — the wire's emoji icons are cosmetic).

**B-D4 Right rail carries three stacked panels — LOCKED.**
- **Snapshot** — Net position / Assets / Debts / Monthly gap, live
- **Data sources** — connected institutions with freshness timestamps, pending states (e.g. "NHS Pensions · Pending" for in-flight CETV)
- **Needs your attention** — up to 3-5 most urgent items from global to-do, filtered to current-document scope

**B-D5 Provenance-first intro copy — LOCKED as pattern.**
Template: *"A structured record of what you own, owe, earn and spend, as of {DATE}. Based on {N} transactions across 12 months from your connected accounts, plus items you've added yourself."* Sets the frame every time the user opens the doc.

**B-D6 Children as §1 — LOCKED.**
Per spec 42 reframe. Most settlements pivot around children; the document should lead with them.

**B-D7 No Summary §9 block — LOCKED.**
Dropped. The document *is* the summary.

---

## B-E Section editing + change log

**B-E1 Read/Edit toggle DROPPED — LOCKED.**
The wire's Read/Edit toggle in the top bar is not shipped. Editing is per-section, inline.

**B-E2 Section-level controls — LOCKED (shape) / OPEN per section type (see 68f B-1).**
Each section carries controls appropriate to its content:
- Edit (opens the section editor)
- Upload evidence (adds document → trust level bump)
- Delete (with confirmation — removes inferred items too)
Plus any section-specific (e.g. Re-categorise for spending, Add transaction for manual additions).

**B-E3 Change log per section — LOCKED.**
Every edit, upload, deletion, auto-classification override is timestamped and stored against the section. Surfaced via a "History" affordance on the section header. Supports the legal requirement to show how the picture evolved.

**B-E4 "Property value is an estimate" style callout — LOCKED as pattern.**
Inline within the section where an item's trust level is below document-evidenced, with a one-click "Add information" CTA. Non-blocking.

---

## B-V Versioning (private picture)

**B-V1 No version chip on Sarah's Picture — LOCKED.**
The wire's "V0.8 · DRAFT" chip is dropped. Private picture uses a lightweight lifecycle.

**B-V2 Last-updated timestamp + history log — LOCKED.**
Format: "Last updated 21 Apr 2026 · 14:32" with the timestamp clickable → simple chronological history log (who, when, what changed). Per-section history lives in B-E3.

**B-V3 Proper versioning activates only on shared doc — LOCKED.**
The joint document (Our Household Picture) carries V1.0, V2.0 etc. because those snapshots matter legally. Private draft edits are ephemeral until shared.

---

## B-S Share from Sarah's Picture

**B-S1 "Share with Mark" top-right primary CTA — LOCKED.**
Always present. Adaptive states per 68a C-S1 (Share with Mark → Share update → sent).

**B-S2 Share CTA not gated by completion — LOCKED.**
The user can share at any completion level. The receiving side (Reconcile) shows completeness clearly. Not forcing 70%/100% before share — matches spec 42 progressive-sharing principle.

**B-S3 Selective publish checkboxes — LOCKED (in modal, per 68a C-S3).**
At share time, Sarah checkboxes which sections / fields push into the joint document. Default = all. Deselecting some is supported — those stay private. Can re-share with more later.

---

## B-T To-do list + dashboard-above-document

**B-T1 Dashboard sits above Sarah's Picture — LOCKED.**
It is NOT Sarah's Picture. It is a separate view (probably route `/workspace` or similar). The dashboard is to-do focused — gets the user to the next action fast.

**B-T2 Global to-do list = master — LOCKED.**
Single source of truth for actionable items across the workspace. Surfaces: SA302 upload, CETV request, business valuation, property valuation, commonly-missed items, credit check, spending category overrides, etc.

**B-T3 Right-rail "Needs your attention" is filtered view, not source — LOCKED.**
The right-rail card on Sarah's Picture shows the subset of global to-dos scoped to the current document. Clicking one → in-place action (dismiss / mark complete / open relevant section). Does NOT navigate away from the document.

**B-T4 In-place to-do actions — LOCKED.**
Dismiss-for-later (returns to backlog), mark-complete (disappears), snooze (future idea, 68f B-2).

**B-T5 Dashboard detailed spec deferred — NEXT.**
Pressure-test of dashboard spec 04 against 6-phase model + doc-as-spine produces the actual dashboard spec. Tracked in 68f B-3 and Phase A next-steps.

---

## B-C Sections map to ES2 structure

**B-C1 Document section order follows ES2 + prior design — LOCKED (principle).**
The left-rail TOC order in the wire ("The children, The home, Pensions, Savings & investments, Vehicles & other, Debts, Income, Monthly spending") is indicative. Final order maps to ES2 section structure so the document export is a legal artefact, not a translation.

**B-C2 Exact section list — OPEN (see 68f B-4).**
Needs: map ES2 sections to our section names, decide inclusion of Business (self-employed only — conditional visibility), decide Future needs placement (spec 67 Gap 5: proposal phase, not here).

---

## B-M Metrics

**B-M1 Monthly gap is a first-class snapshot metric — LOCKED.**
Defined as monthly net income minus monthly outgoings. Displayed in the right-rail Snapshot. Negative values rendered in parentheses + red per accounting convention. Doubles as proposal / future-needs input (spec 67 Gap 5).

**B-M2 Net position = assets minus debts — LOCKED.**
Snapshot primary metric. Debts render in parentheses + red. Assets flat. Net position flat (highlighted colour).

---

## B-A Accessibility + quality

**B-A1 Exit-this-page footer present — LOCKED (see 68a C-X1).**

**B-A2 prefers-reduced-motion honoured — LOCKED.**
Per CLAUDE.md visual direction. No motion on state changes for users with the setting.

---

## Applicability

These decisions are the Build-phase source of truth. The downstream phase-detail spec (spec 70+ "Document view — Build phase") will render these as interaction details, component breakdowns, and screen states. Reference this file rather than re-deriving.
