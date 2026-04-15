# Desk Research: Sharing & Collaboration in Divorce Financial Disclosure

**Date:** 15 April 2026
**Purpose:** Understand the problem space for Decouple's second feature area — sharing, collaboration, versioning, and negotiation of financial disclosure between parties, solicitors, and mediators.

## The core finding

**No one has built a shared financial workspace between divorcing parties.** The collaboration layer is the missing piece globally, not just in the UK. Every other part of the disclosure process has at least one tool addressing it — but the space between "I've gathered my data" and "we've agreed a settlement" is email, Word documents, and hope.

## 10 pain points (ranked by severity)

### 1. No shared source of truth
Each party has their own Form E. Comparing them is manual. There is no shared document showing "here's what we agree on, here's what's disputed." Proposals go back and forth as solicitor letters — a new letter, a new bill, a new wait.

> *"You don't redo the Form E; instead you produce updated documents covering the gap period."* — Mumsnet

### 2. Every communication costs money
Solicitors charge per email, letter, and phone call (6-minute units at £200-500/hr). A single letter can cascade into 5-6 chargeable communications costing £180+. Users report £24k-£100k total fees.

> *"£1,500 for solicitor letter!!!"* — Mumsnet thread title
> *"It's getting ridiculous and all for daft letters backwards and forwards."* — Mumsnet

### 3. The four-party chain adds weeks per round
Client → solicitor → other solicitor → other client. Each round takes 1-4 weeks. "A week is no time at all" for a solicitor response. Users feel powerless and invisible.

> *"Using solicitors adds extra steps in the chain of communication which means everything takes a lot longer."* — Mumsnet

### 4. No version control or change tracking
When a Form E is amended, there is no diff. Solicitors compare documents manually. Consent orders go back and forth as Word docs with tracked changes. No audit trail both parties can see.

### 5. One side can weaponise the process
Exes who "refuse disclosure for months," provide "half-arsed" information, or submit "a pack of lies" can drag proceedings out for years. There is no accountability mechanism short of court enforcement.

> *"My ex got away with hundreds of thousands by hiding money — you just have to do the best you can and make sure they don't break you in the process."* — Mumsnet

### 6. The process takes 1-3+ years
Typical contested case: 12-18 months. With stalling: 2-3.5+ years. One user reported reaching agreement in 2 years, then waiting 2 more years for the other side to complete D81.

### 7. Mediation disclosure is unverified
Mediators ask each party to bring documents but have no verification mechanism. One user: "My ex brought a list with totals and the mediator said nothing." Mediators are "not prepared to offer any view on the reasonableness of either claim."

### 8. Nobody knows what "fair" looks like
The Law Commission (Dec 2024) concluded the current law "promotes dispute rather than settlement" because outcomes are unpredictable. Users have no way to model likely outcomes before FDR.

### 9. Consent order iteration is its own nightmare
Even after agreement: solicitor drafts in Word → other side reviews → amendments → 3 weeks per round → submit to court → judge queries → loop back. Processing: 6-10 weeks.

### 10. The emotional toll is devastating
Panic attacks, sleeplessness, suicidal ideation. "My mental health was fine before the divorce process began." The adversarial nature amplifies stress at every step.

> *"I think the divorce process in the UK and legal matters generally need a huge rethink. It ruins lives."* — Mumsnet

## The current process (as-is)

```
Party A gathers docs (4-8 weeks)
    ↓
Solicitor A drafts Form E (£750-1,500)
    ↓
Simultaneous exchange (email/post) ←→ Party B does the same
    ↓
Each side reviews the other's Form E (manual)
    ↓
Questionnaires exchanged (4-8 weeks, £500+ per round)
    ↓
First Appointment hearing
    ↓
Proposals via solicitor letters (weeks per round, £200-1,500 per letter)
    ↓
FDR hearing (judge gives indication)
    ↓
More negotiation or Final Hearing
    ↓
Consent order drafted in Word (3 weeks per iteration)
    ↓
D81 prepared (23 pages)
    ↓
Submitted to court → judge reviews → approved or returned
    ↓
6-10 weeks to seal

Total: 12-18 months (cooperative) to 3.5+ years (contested)
Average cost: £14,561 per person
```

## What exists today

| Tool | What it does | What it doesn't do |
|---|---|---|
| **Quantum Cloud** | Form E drafting + cross-party collaboration for solicitors | No AI, no extraction, no consumer access |
| **Armalytix** | Open Banking transaction analysis for solicitors | No collaboration, no Form E, B2B only |
| **Amicable** | Fixed-price service, both parties use same platform | Joint-couple only, service not tool |
| **Splitifi** | AI disclosure + attorney dashboard (US-origin) | US-centric, UK adaptation newer |
| **adieu.ai** | AI paralegal, autonomous document sourcing (AU) | B2B, Australian origin |
| **OurFamilyWizard** | Co-parenting communication platform | Children-focused, no financial disclosure |
| **Email + Word** | The actual collaboration tool used by 95% of cases | No structure, no version control, no intelligence |

**The gap:** No platform spans from "here's my financial picture" through to "here's our agreed settlement" with both parties seeing the same structured data.

## Three product opportunities

### A. Transparency of facts → reduces conflict
Bank-connected disclosure means the data comes from the source, not from claims. The ex can't "refuse to disclose" what the bank API already shows. Cross-referencing Party A's bank data against Party B's claims becomes automatic, not a £500 questionnaire round.

### B. Shared visibility → reduces cost
A workspace where both parties (and optionally their solicitors/mediators) see the same financial picture, with an audit trail of what changed and when. Eliminates the bulk of "daft letters backwards and forwards."

### C. Guided resolution → reduces time
Show what's proved, what's still needed, what the disclosed data supports as a range of likely outcomes. Short-circuit months of positional bargaining with evidence-based guardrails.
