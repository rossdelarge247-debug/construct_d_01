# Spec 43 — The 2026 Workflow: Overview & UX Principles

**Date:** 17 April 2026
**Purpose:** High-level map of the hyper-focused 2026 workflow. One-page reference for the complete user journey. Companion specs (44-46) detail the document structure and screens.

## The artefact

**One document grows through six phases.** The document is the product's spine — it exists from the first answer and evolves until the court seals it. The app is how you edit it. The document is what you produce, share, and ultimately submit.

The document aligns with the legal system's mental model:
- **ES2** (Schedule of Assets and Liabilities) — the court's required unified schedule
- **Form E** (Financial Statement) — the individual financial disclosure
- **Statement of Arrangements** — children and housing
- **MoU / Consent Order** — the agreed settlement

Our document IS these documents, in a live, collaborative, evidence-linked format.

## The six phases

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ 1 START  │ 2 BUILD  │ 3 SHARE  │ 4 AGREE  │ 5 FINAL  │ 6 FORWARD│
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ 5 min    │ 30 min   │ 2 weeks  │ 2-4 weeks│ 1 week + │ ongoing  │
│          │          │ async    │ async    │ court    │          │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

Document states across phases:

  v0.1 DRAFT    v0.7 COMPLETE   v1.0 SHARED    v2.0 UNIFIED
  (my picture   (mine, ready    (ex invited,   (both sides
   forming)     to share)        they review)   reconciled)

                                 ↓

  v3.0 FACTS AGREED  →  v4.0 PROPOSAL  →  v4.n COUNTER  →  v5.0 SETTLED

                                 ↓

  v6.0 ORDER GENERATED  →  v6.1 SUBMITTED  →  v7.0 SEALED

                                 ↓

  v8.x IMPLEMENTED (step-by-step, ongoing)
```

## The five UX principles (refined for 2026)

### 1. The document is the truth
Not the app. Not the dashboard. The document. Every screen is a way of editing or viewing the document. No feature exists outside the document.

### 2. One thing at a time
From the existing spec 26 animation work. Never overwhelm. Every decision is isolated. Progressive disclosure throughout.

### 3. Show, don't ask
From the existing V2 principle. Bank data already shows what's there. We confirm by exception, never cold-start-question when a signal exists.

### 4. Evidence, not assertion
Every number links to its source. Every item carries a trust level. Self-declared is visibly different from bank-evidenced. The document's credibility is visible.

### 5. Warm hand on a cold day
From the north star. Every screen acknowledges the human. Every milestone gets a quiet celebration. Every moment of friction gets a reassurance. Safety is designed in, not bolted on.

## The three audiences per screen

Every screen is potentially seen by three audiences:
- **Me** (the user completing my half)
- **My ex** (when shared — different permissions, same document)
- **A professional** (mediator, solicitor — read-only guest, item-level comments)

Design choices that apply: evidence badges, trust levels, agreement status, comment threads per item. A mediator joining the document in Phase 4 should recognise it as a structured settlement schedule, not an app screen.

## The Juro mental model applied

| Juro concept | Decouple application |
|---|---|
| **The contract is the product** | The document is the product |
| **Internal/external split** | Private workspace (my notes, draft positions) vs shared document |
| **Version pipeline** | v0.1 draft → v1.0 shared → v2.0 unified → v4.x proposal → v7.0 sealed |
| **Item-level redlining** | Per-section accept/counter/discuss |
| **Threaded comments on clauses** | Discussion threads on disputed items |
| **Deliberate send** | Preview-before-send for every outbound action |
| **Playbook as engine** | Form E decision trees + disclosed data drive the proposal context |
| **Approve/Request changes** | Accept this item / Counter this item |

## The four co-existing content areas

The document covers the complete settlement, not just finances:

1. **Finances** (the traditional Form E 2.x + 3.1) — assets, debts, pensions, income, spending
2. **Children** — living arrangements, contact pattern, maintenance, school decisions
3. **Housing** — current home, transition plan, future needs
4. **Future** — post-separation budgets, career, retirement implications

Each area has its own section in the document. Each generates its own legal clauses in the final order.

## The two workspaces

**My workspace (private)**
- My draft edits
- My notes to self
- My fallback positions
- My solicitor's comments (if any)
- My research and saved questions

**Our document (shared)**
- The joint picture
- Proposals in flight
- Agreed items with audit trail
- Mediator's comments (if invited)
- Versioned history

Toggle between them. Clear boundary — nothing from My workspace leaks to Our document without a deliberate action.

## What a complete journey looks like

**Total time:** 2-3 months calendar (limited by CETV wait + court processing)
**Total user time:** 2-3 hours each (spread across sessions)
**Total cost:** £593 court fee + optional £200-500 professional review

Versus the current industry average: 12-18 months, 20-30 hours per person, £14,561 per person.

## What this overview does NOT cover

- Detailed screen-by-screen flows (see specs 45-46)
- The document's internal structure (see spec 44)
- Specific Juro patterns with Decouple wireframes (integrated into 45-46)
- Technical data model (see specs 34, 35)
- Legal template library for consent order generation (future spec)
