# Spec 44 — The Document: Structure, ES2 Alignment, Versioning

**Date:** 17 April 2026
**Purpose:** Define what the document actually IS. Its structure, its sections, how it aligns with ES2 and Form E, and how versioning works. This is the spine of the product — every screen is an interface onto this.

## What is "the document"?

A live, collaborative, evidence-linked settlement document that contains everything needed to produce a consent order. It starts as one party's disclosure draft and grows into the unified household picture, then the agreed settlement, then the court-ready order.

**It is the ES2, Form E, Statement of Arrangements, MoU, and draft consent order — unified.**

## The document structure

The document has 10 sections. Sections activate based on profiling (skip what's not relevant).

### Section 1 — Parties & context
Names, ages, marriage dates, separation date, children count/ages, current living arrangements, date of document.

### Section 2 — The children
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

## The version pipeline (Juro-inspired)

```
┌────────┬────────┬────────┬────────┬────────┬────────┬────────┐
│ v0.x   │ v1.0   │ v2.0   │ v3.0   │ v4.x   │ v5.0   │ v7.0   │
│ DRAFT  │ SHARED │UNIFIED │ FACTS  │PROPOSAL│SETTLED │ SEALED │
│        │        │        │ AGREED │(counter│        │(court) │
│        │        │        │        │ rounds)│        │        │
└────────┴────────┴────────┴────────┴────────┴────────┴────────┘
  Party A     Ex         Reconcil-   Both       Back &     All       Court
  building    invited    iation      parties    forth     items     approved
  alone                  complete    confirmed  proposals  agreed
                                     facts
```

### Version rules

- **Every generation creates an immutable snapshot.** Past versions can always be viewed.
- **Diffs between versions** show exactly what changed, who changed it, when.
- **One live version** is the "current" — what both parties see by default.
- **Versions have states:** Draft / Shared / Signed-off / Sealed.
- **Signing off** is a deliberate action per party (not per edit) — you sign off on a version, locking your agreement to it.

### Typical version trail

```
v0.1   Sarah starts building (profiling complete)
v0.4   Sarah connects bank, picture grows
v0.8   Sarah adds children, housing, future sections
v0.9   Sarah adds spending review
v1.0   Sarah finalises — "ready to share" (generated)

  [Sarah invites Mark]

v1.1   Mark views, starts his side
v1.3   Mark connects bank
v1.6   Mark reviews Sarah's items, accepts most
v1.8   Mark adds his unique items
v2.0   Mark finalises his pass — unified draft (generated)

  [Reconciliation period — discussions on contested items]

v2.1   Joint savings value agreed (evidence resolved)
v2.2   Pension CETV received for Mark
v2.3   Property value agreed after valuations
v3.0   Both sign off on the facts — household picture complete

  [Proposal phase]

v4.1   Sarah's proposal v1 (sent)
v4.2   Mark's counter on 3 items (sent)
v4.3   Sarah's counter on 1 item (sent)
v5.0   Both accept all items — settlement agreed

  [Legal generation]

v6.0   Consent order + D81 generated
v6.1   Submitted to court
v7.0   Court sealed — immutable

  [Implementation]

v8.x   Each implementation step tracked (transfer property, share pension, etc.)
```

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

## Edit mode vs document mode

### Edit mode
App-like. This is where the user DOES things:
- Profiling questions
- Bank connection
- Phase A confirmation (tier-based matching)
- Phase B spending review
- Uploading evidence
- Responding to discussions
- Building proposals

Progressive, one-thing-at-a-time, animated transitions. The existing V2 patterns.

### Document mode
Document-like. This is where the user SEES what they've built:
- Structured report layout
- Tabular sections where appropriate
- Printable / exportable / shareable
- Evidence badges visible per item
- Agreement status visible per item
- Version selector

The toggle is always available. Users can flip to document mode at any point during the journey.

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
