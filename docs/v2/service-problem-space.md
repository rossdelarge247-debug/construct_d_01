# Service Problem Space — V2 through V5

How the full service maps to the real-world journey people go through today.

---

## The as-is journey (what people do today)

### Stage 1: Gathering information
- Searching filing cabinets, emails, online portals for financial documents
- Requesting bank statements (12 months per account), mortgage statements, pension CETVs
- Guessing at partner's finances from fragments
- Everything ends up in a folder, a drawer, or scattered across emails

### Stage 2: Making sense of it
- Manually building a picture from gathered documents
- Entering numbers into spreadsheets or Word documents
- No standard structure — everyone invents their own
- Solicitors charge £200-500/hr to organise this
- No way to track confirmed vs estimated vs unknown

### Stage 3: Preparing for disclosure
- Attempting Form E (28+ pages) or equivalent
- Cross-referencing form sections with supporting documents
- Labelling attachments, ordering statements by date
- Getting stuck, not knowing when "enough" is done
- Or paying a solicitor £1,000+ to do this

### Stage 4: Sharing and exchanging
- Sending Form E via solicitor, email, or mediator
- Receiving the other party's disclosure
- Trying to compare two pictures
- Raising questions via email, solicitor letters, mediator notes
- No single source of truth

### Stage 5: Negotiating
- Proposals exchanged verbally in mediation or via solicitors
- Mediator produces Memorandum of Understanding
- Counter-proposals via email or next session
- Tracking what changed: impossible without manual comparison
- Children and finances discussed together, tracked separately

### Stage 6: Reaching agreement
- Positions converge (or go to court)
- Final agreement exists across: mediator notes, emails, solicitor letters, WhatsApp
- Nobody has a single clean record

### Stage 7: Formalising
- Solicitor drafts consent order (£400-1,500)
- D81 statement prepared
- Form A filed, court fee £60
- Judge can reject if unfair (D81 Section 10 blank is common rejection reason)

---

## Pain map

| Pain | Stages | Severity |
|------|--------|----------|
| Document chaos | 1-3 | Severe — universal |
| No standard structure | 2-3 | Severe — everyone reinvents |
| Form E complexity | 3 | Severe — 28 pages, no consumer tool |
| No single source of truth | 4-6 | Severe — scattered everywhere |
| Can't track what changed | 5 | Severe — proposals evolve invisibly |
| Solicitor cost for admin work | 2-3, 6-7 | High — premium rates for organisation |
| Unknown unknowns | 1-2 | High — gaps invisible until too late |
| Partner non-cooperation | 4-5 | High — can't force engagement |
| Mixed-process fragmentation | 4-6 | High — mediation, solicitor, email disconnected |
| Topics interleave in practice | 5 | Medium — children and finances same session |
| Formalisation gap | 7 | Medium — "agreed" to "court-sealed" is opaque |

---

## How our verticals map

| Stage | Vertical | Our promise |
|-------|----------|-------------|
| 1. Gathering | **V2** | Upload → we extract and organise |
| 2. Making sense | **V2** | Structured picture, confidence-tracked, evidence-linked |
| 3. Disclosure prep | **V3** | Form E-equivalent workspace, guided section by section |
| 4. Sharing | **V3 + V4** | Controlled sharing, role-based access, open questions |
| 5. Negotiating | **V4** | Proposal versioning, session tracking, reconciliation |
| 6. Agreement | **V4** | Agreed/disputed/outstanding capture |
| 7. Formalising | **V5** | Consent order data, D81, adviser bundles |

---

## Critical data flow

V2's data model is the foundation everything builds on.

```
V2 creates:
  Financial items (structured, categorised, valued, confidence-tagged)
  Evidence documents (classified, linked to items)
  Extracted fields (from documents, reviewed by user)
  Children's arrangement details
  The "full picture"
        │
        ▼
V3 consumes V2 to create:
  Form E-equivalent structured disclosure
  Open questions (gaps in other party's disclosure)
  Evidence chain (every claim backed by document)
        │
        ▼
V4 consumes V2 + V3 to create:
  Proposals built from structured items
  Position comparisons
  Mediation session records
  Agreement tracking per item
        │
        ▼
V5 consumes V2 + V3 + V4 to create:
  Consent order content
  D81 data
  Disclosure packs
  Adviser bundles
```

If V2's structure is wrong, every subsequent vertical inherits the problem.
