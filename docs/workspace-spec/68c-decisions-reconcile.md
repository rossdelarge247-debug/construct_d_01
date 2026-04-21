# Spec 68c — Reconcile Phase Decisions Locked

**Date:** 21 April 2026
**Parent:** spec 68 (synthesis hub)
**Scope:** Decisions for the Reconcile phase — the joint document (Our Household Picture), conflict resolution, the Mark status machine, and the waiting states.

---

## R-D Joint document shape

**R-D1 Joint doc mirrors the private doc structure — LOCKED.**
Same three-column layout. Same §-numbered sections. Same left-rail TOC. Same right-rail shell (different internals). Consistency across phases is a feature.

**R-D2 Terminology = "sections" not "chapters" — LOCKED.**
Reconcile wires used "chapters." Private picture uses "sections." We normalise to **sections** across both. Matches §-notation and legal-document styling.

**R-D3 Doc sub-title — LOCKED.**
Template: *"Our Household Picture · {Sarah full name} & {Mark full name} · generated {DATE}"*. "Generated" rather than "created" — signals the auto-merge.

**R-D4 Left-rail resolve-count iconography — LOCKED.**
Per section: `N items to resolve` with a status dot. Cleaner than a progress percentage for this phase (the task is bounded, so counting is more useful than percentage).

**R-D5 Top-right avatars are joined (S|M) — LOCKED.**
Signals joint doc. Private doc shows single avatar.

---

## R-Q Status quad + reconciliation state

**R-Q1 Status quad is the phase header — LOCKED.**
Four tiles at the top of the document:
- **Agreed by both** (count)
- **Values differ** (count)
- **New to you** (count)
- **Gap to address** (count)

Each tile is colour-coded and clickable.

**R-Q2 Quad tiles filter the document — LOCKED.**
Clicking a tile scopes the document body to that category. Clicking again clears. Supports focused review without leaving the page.

**R-Q3 Taxonomy classification rules — LOCKED (principles) / OPEN on tolerances (see 68f R-1).**
- **Agreed by both** — both parties declared, values match within tolerance
- **Values differ** — both parties declared, values don't match within tolerance
- **New to you** — one party declared, other didn't mention (viewer-specific labelling — see R-V1)
- **Gap to address** — item incomplete or missing critical evidence either side

**R-Q4 Viewer-specific labelling (R-V1) — LOCKED.**
Joint doc content is the same; labels localise to the viewer. "Mark's Hargreaves Lansdown ISA" shows to Sarah as "New to you"; same item shows to Mark as "yours." No data asymmetry; only UI-perspective.

---

## R-C Conflict card pattern

**R-C1 Conflict card = side-by-side with provenance + delta — LOCKED.**
For every "Values differ" item:
- Left column: Sarah's avatar, value, self-declared provenance note (e.g. *"estimated, 31 March"*)
- Right column: Mark's avatar, value, self-declared provenance note (e.g. *"Recent valuation from agent"*)
- Corner annotation: the delta (*"Values differ by £30,000"*)
- Non-judgemental CTA: *"Resolve together — doesn't need to be a debate"* → "Discuss this →"

**R-C2 Resolution paths per conflict — LOCKED (set) / OPEN per action (see 68f R-2).**
Discuss (open thread) · AI-suggested midpoint · Get a Zoopla / independent check · Agree with partner's value · Defer for later. Exact interaction per path designed when the anchor screen is generated.

**R-C3 Discuss-this thread — LOCKED (shape) / OPEN on detail (see 68f R-3).**
Per-item async thread. Authored comments with timestamps and attribution. Quick-action chips alongside (e.g. "Split the difference?" · "Get Zoopla check" · "Accept Mark's figure").

---

## R-A AI deliberation queue

**R-A1 Right rail is the Deliberation panel — LOCKED.**
Replaces Build's "Needs your attention." Same shell, different internals.

**R-A2 Queue copy + structure — LOCKED.**
Header: "Reconciliation guide" + intro *"Click any card to focus it. You'll see actions and the conversation for that item here."* Queue: numbered list with section reference (§N), one-line identifier, one-line AI-generated suggestion.

**R-A3 Ordering = biggest-impact first — LOCKED (principle) / OPEN on weights (see 68f R-4).**
Primary dimension: £ impact on final split. Secondary: easiest confidence-builders first. Exact weighting / tie-break rules to be specced when the AI coach pattern doc is written.

**R-A4 AI suggestion copy pattern — LOCKED.**
Framed as *impact-forward* not instruction-forward. Good: *"A midpoint of £465,000 sits within both estimates. If agreed, closes 1 of 3 contested items."* Bad: *"You should agree on £465,000."* Influence through information, not directive.

**R-A5 "Resolve all →" walkthrough — LOCKED (affordance) / OPEN on flow (see 68f R-5).**
Banner CTA: *"N items need attention before you can start a proposal — Resolve all →"*. Opens a linear wizard through the queue. Each step shows the conflict + offers resolution paths.

---

## R-E First-visit welcome + emotional pacing

**R-E1 First-visit welcome banner is dismissible — LOCKED.**
Copy: *"This is the first time you've both seen the same picture."* Body: *"Take your time. There's no rush — and no judgement. You can come back to any item later."* One-time dismiss.

**R-E2 Post-dismiss replacement — LOCKED.**
The "N items need attention" banner moves up into that slot. Keeps the top-of-page actionable without losing the reassurance on first arrival.

**R-E3 Footer reassurance — LOCKED.**
Bottom-of-page note: *"Nothing here is final. Agreements only lock when you both sign off in the Settle phase."* Persistent (not dismissible) — removes anxiety about accidentally committing.

---

## R-M Mark status machine

**R-M1 Status machine states — LOCKED.**
Sarah sees Mark's status top-right of the Reconcile view:
- **Not invited** — Sarah hasn't pressed Share yet
- **Invited · hasn't opened** — email sent, not opened. Shows "Mark hasn't opened yet" + Nudge / Resend affordances.
- **Opened · hasn't started** — email opened, account not started. Copy: *"Mark has opened, hasn't started."*
- **Building · N / M sections** — account started, picture in progress. Shows Mark's progress fraction (e.g. "8 of 14 sections").
- **Shared · unified** — Mark has shared his picture. Reconciliation unlocks.

**R-M2 Waiting-state layout — LOCKED.**
While Mark's state is anything other than Shared, the middle column shows a waiting state: joined-avatars hero, headline per state, body copy per state (*"Reconciliation opens as soon as Mark shares his picture. Until then, you can keep refining yours — nothing is locked, nothing is sent to him."*), Mark's Status card with actions (Nudge Mark / Resend invite if applicable), soft reminder copy *"You'll get a notification when Mark shares."*

**R-M3 Right rail in waiting states — LOCKED.**
Still shows Reconciliation guide intro + any carried-over contested items from the last Mark-shared snapshot (if applicable) + Recent Activity timeline.

**R-M4 Mark's progress visibility is a privacy consideration — OPEN (see 68f R-6).**
Showing "8 of 14 sections" may leak behavioural data. Options: full visibility / bucketed ("Started" / "Over half" / "Near done") / minimal ("Building"). Needs a decision before V1 — default lean: bucketed.

---

## R-V Versioning (joint doc)

**R-V1 Version chip appears on the joint doc — LOCKED.**
Contrast with private doc (no chip). Values:
- **V1.0** — Sarah's first share (Mark hasn't shared yet; zero-Mark state)
- **V2.0** — Mark's first share (first fully unified state)
- **Vx.y** — each subsequent re-share from either party
- **Vx.y · AGREED** — all items resolved; Settle phase unlocks

**R-V2 Version history dropdown — LOCKED.**
Top-bar version chip is clickable → chronological list of versions with diff-of-change, authored-by, and timestamp. Legal lineage artefact.

**R-V3 Re-share triggers minor version bump — LOCKED.**
When Sarah updates her private picture and re-shares, creates new version (e.g. V2.0 → V2.1). Quad recomputes, previously-agreed items that have changed flag for re-confirmation.

---

## R-U Unlock to Settle

**R-U1 Settle unlocks when all reconciliation items resolved — LOCKED.**
The Reconcile-wire's disabled "Start a proposal →" CTA becomes active only when the quad shows 0 in Values differ + New to you + Gap to address. Matches the wire behaviour.

**R-U2 Exception path — escape-hatch export — LOCKED (per 68a C-E).**
If reconciliation stalls (threshold TBD — 68f E-1), the "Stuck? Export your picture and take to a mediator" CTA becomes prominent. User can exit to mediation without losing data.

**R-U3 Pre-reconciliation proposal drafting — DEFERRED (see 68f S-1).**
Whether Sarah can draft a proposal before reconciliation is complete was raised earlier and parked. Current lean: no — prevents proposal-built-on-stale-facts trap. Lock in 68f.

---

## R-L Recent activity panel

**R-L1 Recent activity lives in the right rail (below Deliberation) — LOCKED.**
Timeline entries: actor avatar + action phrase + timestamp. Examples: *"Mark · Updated home valuation to £560k · 2 hours ago"*, *"Sarah · Added 3 agent valuations for the home · 3 days ago"*.

**R-L2 Activity scope — LOCKED.**
Joint-doc-scoped only. No private-picture activity shown. Transparency between parties about joint work.

---

## Applicability

These decisions cover the Reconcile phase end-to-end. The downstream phase-detail spec (spec 71+ "Reconcile flow") will translate these into screen states, component interactions, and the Mark status machine integration.
