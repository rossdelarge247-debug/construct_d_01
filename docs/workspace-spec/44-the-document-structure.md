# Spec 44 — The Document: Structure, ES2 Alignment, Versioning

**Date:** 17 April 2026 · **Amended:** 22 April 2026 (session 22)
**Purpose:** Define what the document actually IS. Its structure, its sections, how it aligns with ES2 and Form E, and how versioning works. This is the spine of the product — every screen is an interface onto this.

**Session 22 amendment:** The original "one document with ten sections" framing is superseded by the four-document lifecycle locked in spec 68 (hub) + 68a-e. See the "Four-document lifecycle" section below (rewritten). Versioning, read/edit toggle, and collaboration mechanics are now governed by the 68 suite — this spec retains the section structure (ES2 mapping) and trust-system framing that still hold. Operational framing: spec 68.

## Four-document lifecycle (session 22)

The "spine" is not one document — it's a lineage of four documents, one per phase, each a live artefact with evidence trails, trust badges, and §-numbered sections. Together they produce everything needed for a consent order.

| Document | Phase | Owned by | Versioning | Created when |
|---|---|---|---|---|
| **Sarah's Picture** | Build | Sarah (private) | Last-updated timestamp + per-section history log. **No version chip** (68b B-V1). | Signup + first profiling |
| **Our Household Picture** | Reconcile | Both | **V1.0 → V2.0 → Vx.y → AGREED** on reconciliation complete (68c) | First Share action from Build |
| **Settlement Proposal** | Settle | Drafted by one, countered by the other | **V1 → V2 counter → V3 response → Vn → SIGNED** (68d) | All reconcile items resolved |
| **Generated legal docs** | Finalise | Auto-produced | **V5 AGREED basis → court-ready artefacts** (68e) | Settlement signed by both |

**It is the ES2, Form E, Statement of Arrangements, and draft consent order — unified across four document artefacts that share a common §-structure, evidence model, and trust taxonomy.**

Each document renders in the same three-column shape: left-rail chapter TOC with completion iconography, middle prose body with inline structured data, right-rail contextual panel (Snapshot / Data sources / Needs your attention in Build; Status quad / Deliberation queue in Reconcile; AI coach in Settle; Pre-flight / Activity log in Finalise). See 68b-e for per-phase detail.

## The document structure

The document has 10 sections, shared across all four documents in the lifecycle above. Sections activate based on profiling (skip what's not relevant).

**Section ordering amended session 22:** Children is now §1 per 68b B-D6 ("most settlements pivot around children; the document should lead with them"). Parties & context is absorbed into the document header metadata rather than a separate §.

### Section 1 — The children
Living arrangements, primary care, contact pattern, school, health, special needs, Child Benefit recipient, agreements on future.

Maps to: Statement of Arrangements for Children + child-related clauses in consent order.

### Section 3 — The home
Current home: address, value, mortgage, net equity, who lives there.
Future: who stays, transition plan, any second property.

Maps to: Form E 2.1-2.2, consent order property clauses.

### Section 4 — Other property & valuables
Buy-to-let, inherited property, vehicles (with finance), jewellery, art, valuables >£500.

Maps to: Form E 2.6, 2.7, 2.8.

### Section 5 — Pensions
Every pension scheme, CETV, type (DB/DC), age drawing.

Maps to: Form E 2.13, pension sharing annex.

### Section 6 — Savings & investments
All accounts, ISAs, investments, crypto. Per-account with ownership tag.

Maps to: Form E 2.3, 2.4.

### Section 7 — Debts
Mortgages (reference Section 3), credit cards, loans, car finance, BNPL, student loans, money owed to others.

Maps to: Form E 2.14.

### Section 8 — Income
Employment, self-employment, benefits, pension income, rental income, maintenance received.

Maps to: Form E 2.15-2.20, payslips, SA302.

### Section 9 — Monthly spending
Housing, utilities, children, transport, personal, leisure. 6 categories × many items.

Maps to: Form E 3.1.

### Section 10 — The settlement
Activated in Phase 4. Covers proposals, counter-proposals, final agreement per item. Reasoning per item.

Maps to: Consent order clauses, D81 Section 10.

## Section ownership map

Each section has items. Each item has metadata:

```
Section ──► Item ──► Claim(s)
                ├─ From Party A: value, basis, notes
                ├─ From Party B: value, basis, notes
                ├─ Ownership tag: joint / sole-A / sole-B / pre-marital / inherited / disputed
                ├─ Matrimonial: yes / no / disputed
                ├─ Trust level: self-declared / bank-evidenced / credit-verified / 
                │              document-evidenced / both-agreed / court-sealed
                ├─ Status: confirmed / contested / unique-to-A / unique-to-B / missing
                └─ Discussion thread (optional)
```

This is the HouseholdItem type from spec 35, enriched to cover non-financial items too (children, housing arrangements).

## Versioning (session 22 amendment)

The original v0.x → v7.0 single-pipeline model is superseded. Each of the four documents in the lifecycle has its own versioning per its phase spec:

- **Sarah's Picture (Build):** No version chip (68b B-V1). Last-updated timestamp with clickable history log. Per-section change log preserved for legal auditability.
- **Our Household Picture (Reconcile):** V1.0 on first Share, V2.0 on Mark's first share back, Vx.y on each re-share, **AGREED** suffix appended when reconciliation completes (68c).
- **Settlement Proposal (Settle):** V1 (Sarah's opening) → V2 (Mark's counter) → V3 (Sarah's response) → Vn until both accept. Both parties **explicitly sign** to lock agreement — not per-edit (68d S-G2).
- **Generated legal docs (Finalise):** V5 AGREED basis → court-ready artefacts (Consent Order, D81 + Section 10, Form P pension annex, Settlement Summary PDF, optional Statement of Arrangements). Court-sealed state updates the agreement artefact post-approval (68e).

### Common rules across all four documents

- Every version is an immutable snapshot; past versions always viewable.
- Diffs between versions show who changed what, when.
- One live version per document is "current" — what both parties see by default.
- Signing off is a deliberate per-party action, not per-edit (specifically applies to Our Household Picture AGREED and Settlement Proposal SIGNED states).

## The trust system (per-item)

Every item carries a trust level. Multiple badges possible.

| Badge | Meaning | When it's shown |
|---|---|---|
| 📝 **Self-declared** | User typed it in | Default if nothing else applies |
| 📎 **Bank-evidenced** | Pulled from Open Banking | When transaction pattern matches |
| ✓ **Credit-verified** | Cross-referenced against credit file | When credit check run and item not flagged |
| 📄 **Document-evidenced** | Supporting document uploaded (statement, CETV letter, valuation) | When user uploads evidence |
| 🤝 **Both-party-agreed** | Both Sarah and Mark confirmed the value | After reconciliation |
| ⚖️ **Court-sealed** | Court-approved | After v7.0 |

Higher trust → higher auto-generation capability. A document where all items are 🤝 both-party-agreed + most items are 📎 bank-evidenced can auto-generate a Tier 1 submittable consent order.

## Document interaction model (session 22 amendment)

The original **edit mode vs document mode toggle is DROPPED** per 68b B-E1. There is no top-bar Read/Edit toggle.

The document always renders as a document — §-numbered sections, legal-doc styling, prose body with inline structured data, trust chips on every evidenceable line. Editing happens **per-section, inline**, via section-level controls (68b B-E2):

- **Edit** — opens a section editor
- **Upload evidence** — attaches documents, bumps trust level
- **Delete** — with confirmation (removes inferred items too)
- **Plus per-section extensions:** Re-categorise for spending, Add transaction for manual additions, Add valuation for property, etc.

Every edit, upload, deletion, and auto-classification override is timestamped into a section-level change log (68b B-E3). This supports the legal requirement to show how the picture evolved without needing a mode toggle.

Export / print / share affordances are always available via document-level menus (see 68a C-E3 escape-hatch export + 68a C-S share modal). The document IS printable / exportable / shareable at any point — no mode flip required.

## How collaboration works on the document

Inspired by Juro's redlining model:

1. **Before share** — only Party A sees the document. Full edit mode.
2. **After invite** — Party B sees the document in view mode with their blanks interactive.
3. **During reconciliation** — both parties can edit their own claims, comment on the other's.
4. **During proposal phase** — the settlement section becomes the negotiation surface. Item-level redlining.
5. **After settlement** — document is sealed for final review. Only the proposer can propose changes.
6. **After court sealing** — document is immutable. Implementation section is the only active area.

## What this spec does NOT cover

- Specific screens (see 45, 46)
- Technical data model code (see spec 34 UserProfile and spec 35 HouseholdItem)
- Legal template library for order generation (future spec)
- Workflow for professional guests (mediator/solicitor access — future spec)
