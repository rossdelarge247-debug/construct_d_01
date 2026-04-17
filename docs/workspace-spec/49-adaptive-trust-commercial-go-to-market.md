# Spec 49 — Adaptive Design: Trust, Verification, Commercial, and Go-to-Market

**Date:** 17 April 2026
**Purpose:** Design proposals for trust and verification challenges, commercial model, professional integration, and mobile experience. How the product adapts when assumptions don't hold.

## 1. Users won't connect their bank

**Signal:** User reaches bank connection step and hesitates or refuses.

**Design response — the trust ladder:**

Don't force it. Offer alternatives that still produce value:

```
"Connect your bank for the most accurate picture"
[Connect via Open Banking]

"Not comfortable connecting? You can still build your picture:"
○ Upload bank statements as PDF/CSV
   → We'll extract what we can (existing CSV parser)
○ Enter your information manually
   → Section-by-section guided input
○ I'll connect later — let me explore first
   → Continue to profiling + manual input, connect later
```

Each path produces the same document structure. Trust badges reflect the difference:

| Method | Trust badge | Document note |
|---|---|---|
| Open Banking | 📎 Bank-evidenced | "Connected account — live data" |
| CSV/PDF upload | 📄 Document-evidenced | "Statement uploaded — point-in-time" |
| Manual entry | 📝 Self-declared | "User-provided figures" |

**The product adapts:** More manual input = more confirmation questions (we can't auto-detect signals). The journey gets slightly longer but never breaks.

**Re-engagement:** At any point, the user can connect their bank to upgrade their items from 📝 to 📎. "Upgrade to bank-connected for stronger evidence."

**Where it fits:** Phase 2 (Build). Bank connection is the recommended path, not the only path.

---

## 2. The document model doesn't resonate

**Signal:** User testing reveals people don't connect with "building a document." They prefer the app/dashboard feel.

**Design response — test both, commit to the winner:**

### Hypothesis A: Document-first
The financial picture is presented as a structured report. Printable, formal, authoritative. Feels like something you'd hand to a solicitor.

### Hypothesis B: Dashboard-first with export
The financial picture is presented as interactive cards/sections. Feels like an app. But a "Generate document" button produces a clean PDF/document view at any time.

### Hypothesis C: Hybrid (likely winner)
**Edit in app mode, view in document mode.** The toggle is always available. Some users prefer cards while building; all users prefer document when sharing.

**How to test:** Build both views in the prototype. Same data, different presentation. Show users both. Ask: "Which would you share with your ex?" and "Which would you show a mediator?"

**Adaptation:** If Hypothesis B wins, the document concept doesn't disappear — it becomes the export/share format rather than the primary interface. The underlying data model stays the same.

**Where it fits:** Phase 2 output (the "your picture is ready" moment) and Phase 3 (sharing). Test in prototype v0.1.

---

## 3. System context feels prescriptive or patronising

**Signal:** Users react negatively to "typical range is 55-65% to the primary carer" — feels like the product is telling them what to do.

**Design response — progressive disclosure of context:**

### Level 1 (default): Minimal context
Just show the arithmetic:
```
Property equity: £230,000
Equal split: £115,000 each
```

### Level 2 (on request): Expanded context
User taps "See more context":
```
Equal split: £115,000 each
Your income covers mortgage alone: borderline
Primary care is with you (2 children)
```

### Level 3 (deep dive): Full context with typical ranges
User taps "What do courts typically do?":
```
Courts consider: income disparity, primary care of children,
housing needs, contributions during marriage, earning capacity.

In similar situations (primary carer, income disparity 1:2,
2 children under 10), settlements typically range from
55-65% to the primary carer.

This is information, not advice. Every case is unique.
A solicitor can advise on your specific circumstances.
```

**Key principle:** Context is opt-in, not forced. The product defaults to arithmetic. Users who want more can dig deeper. Users who find it patronising never see it.

**Where it fits:** Phase 4 (Proposals). The "Context" section in the proposal builder becomes expandable, not always-visible.

---

## 4. Users don't trust auto-generated legal documents

**Signal:** Users hesitate at "Submit directly" in Phase 5. They want reassurance.

**Design response — the confidence builder:**

### Show the provenance
```
"This consent order was generated from:
 • 20 items agreed by both parties ✓
 • 15 items bank-evidenced 📎
 • 3 proposals exchanged, all items accepted
 • Reasoning captured for every decision
 
 The legal wording uses court-approved templates
 vetted by [law firm name]."
```

### The pre-flight check as reassurance
Make the quality check visible and detailed — not just "no issues found" but showing what was checked:

```
✓ All required clauses present (property, pension, maintenance)
✓ Clean break wording applied correctly
✓ Pension sharing annex formatted per WRPA requirements
✓ D81 Section 10 completed (reasoning from your proposal trail)
✓ No unusual terms flagged
✓ Both parties' statements of truth included
✓ Court fee confirmed (£593)
```

### Always offer the professional review option
Never bury it. Always visible alongside "Submit directly":

```
[Submit directly — £593 court fee]

or

[Get a solicitor to review first — £250-400 fixed fee]
"A family law specialist checks everything in 48 hours.
 Most people feel more confident with a review."
```

### Social proof (when available)
"94% of Decouple-generated consent orders are approved by courts on first submission."
(Only show this when we have the data to back it up.)

**Where it fits:** Phase 5 (Finalise). The product never pressures users to skip professional review. Self-submission is an option, not the default.

---

## 5. Commercial model proposals

Three models evaluated:

### Model A: Per-couple flat fee
```
£299 per couple (both parties included)
Includes: full journey, document generation, consent order
Optional: professional review add-on (£250-400)
```

**Pros:** Simple, predictable, low barrier.
**Cons:** Doesn't capture value from high-asset cases. One price for £200k estate and £2M estate.

### Model B: Tiered by complexity
```
Standard (£199/couple): Employed, homeowner/renter, standard assets
Plus (£399/couple): Self-employed, multiple properties, complex pensions
Premium (£599/couple): Business valuations, overseas assets, trusts
```

**Pros:** Captures value from complexity. Funds the professional review marketplace.
**Cons:** Users self-select wrong tier. Complexity detected mid-journey → awkward upgrade prompt.

### Model C: Free-to-build, pay-to-share (recommended for testing)
```
Free: Build your financial picture. Full V2 journey. Your document.
£149: Share with your ex. Reconciliation. Household picture.
£299: Proposals + agreement. Full negotiation tools.
£99: Generate consent order + D81 (add-on)
```

**Pros:** Low barrier to start. Users experience value before paying. Natural upgrade points. Each payment unlocks a clear next capability.
**Cons:** More complex pricing. Users might build then screenshot/export before paying.

### Marketplace revenue (all models)
```
Professional review: Decouple takes 20% of review fee
  £250 review → Decouple gets £50, solicitor gets £200
Mediator partnerships: per-case licence fee
  £50/case for mediators using Decouple with their clients
```

**Recommendation:** Start with Model C for testing. The free-to-build model lets users experience value before commitment. Validate willingness-to-pay at each gate. Adjust pricing based on data.

---

## 6. Professional integration — the design

### Mediator as participant

```
"Invite a mediator"

Sarah or Mark can invite a mediator at any point from Phase 3 onward.
The mediator sees:
  • The shared household document (read-only)
  • Item-level discussion threads (can comment)
  • Proposal versions (can comment, suggest)
  • Progress board

The mediator cannot:
  • Edit values (only parties can)
  • Accept/reject proposals (only parties can)  
  • See private workspaces (only shared document)

Mediator billing: handled outside the product (mediator invoices
the couple directly at their hourly rate). Decouple doesn't
intermediate on mediator fees.
```

### Solicitor as reviewer

```
"Get a professional review"

The user requests a review at Phase 5.
A solicitor from the marketplace receives:
  • The consent order (generated)
  • The D81 (generated)
  • The household document (for reference)
  • Any flagged items ("we recommend you check the pension sharing clause")

The solicitor reviews and returns:
  • Approved (no changes needed)
  • Approved with minor amendments (tracked changes on the consent order)
  • Concerns raised (specific items flagged with reasoning)

Billing: fixed fee through Decouple. Solicitor sets their rate.
Decouple takes 20% platform fee.
```

### Solicitor as full representative (Tier 3)

```
For complex cases routed to Tier 3:

"Your situation needs a solicitor"

The user's complete disclosure document is packaged and shared
with a solicitor. The solicitor uses it as the basis for their
work — saving 15-20 hours of document gathering.

Decouple value to solicitor: structured, evidenced disclosure
that would otherwise take them weeks to compile.

Decouple value to user: the solicitor's fee is lower because
the grunt work is done.

No platform fee for Tier 3 referrals — the value is in
the relationship and the user retention.
```

**Where it fits:** Phase 3 onward (mediator), Phase 5 (solicitor review), Phase 2 (Tier 3 routing).

---

## 7. Mobile experience

**The reality:** 60-70% of initial sessions will be on mobile (late at night, on the sofa, on a break at work).

**Design response — mobile-first for Phases 1-2, responsive for Phases 3-5:**

### Mobile-optimised (Phases 1-2)
- Profiling: one question per screen → naturally mobile
- Bank connection: better on mobile (native bank app handoff for auth)
- Tier-1 confirmations: card-based → naturally mobile
- Tier-2 disambiguation: inline radios → works on mobile
- Spending review: per-category → works on mobile

### Responsive but desktop-recommended (Phases 3-5)
- Document view: needs horizontal space for the ES2-style table. On mobile → single-column card view with section expansion
- Reconciliation: per-item cards work on mobile
- Proposal builder: per-item works on mobile. Summary/impact calculation needs horizontal space → collapsible on mobile
- Consent order review: long document. On mobile → section-by-section view with navigation

### Implementation checklist (Phase 6)
- Checklist format → naturally mobile. This phase might be the most mobile-used.

**Design principle:** Never block a mobile user. Always functional. But for the detailed document review and proposal comparison, gently suggest: "This works best on a larger screen."

---

## 8. What if mediators see us as competition?

**Signal:** Mediators resist partnership because they think we replace them.

**Design response — the empowerment narrative:**

### What we tell mediators

"We don't replace you. We replace the spreadsheets, the document chasing, the scheduling, and the arithmetic. You do the human work.

**Without Decouple:** You spend 60% of session time on data gathering and admin. 3-5 sessions × 2 hours = 6-10 hours per case.

**With Decouple:** Clients arrive with evidenced financial pictures. You spend 100% of session time on facilitation. 2-3 sessions × 1 hour = 2-3 hours per case.

Same hourly rate. Half the hours per case. Double the cases per month. Better outcomes for clients."

### What we build for mediators

- **Mediator dashboard:** See all active cases, progress status, disputed items
- **Pre-session brief:** Auto-generated summary of where each case stands
- **Session focus list:** "These 3 items need your attention today"
- **Post-session update:** Capture what was agreed in session, update the document

### Partnership model

- Mediator pays £50/case to use Decouple with their clients
- Or: mediator offers Decouple as included in their service fee
- Mediator's branding on the document (white-label option)
- Mediator gets the document as their Open Financial Statement (saves them drafting time)

**Where it fits:** Go-to-market strategy. Mediators are the natural first professional partners — they're already collaborative, already frustrated with admin, and already underpaid for the admin work they do.

---

## Summary: the adaptive product across all dimensions

| Dimension | Happy path | Adaptation when it doesn't hold |
|---|---|---|
| Bank connection | User connects all banks | CSV upload / manual entry / connect later |
| Document model | Users love it | Dashboard-first with document export |
| System context | Feels helpful | Progressive disclosure — opt-in depth |
| Legal doc trust | Users submit directly | Always-visible professional review option |
| Pricing | Pay at share gate | Test willingness-to-pay, adjust gates |
| Mediator partnership | Eager adoption | Empowerment narrative, white-label, dashboard |
| Solicitor relationship | Supportive | Position as "your clients arrive prepared" |
| Mobile | Full journey works | Mobile-first for Phases 1-2, responsive for 3-5 |

The product isn't brittle. Every assumption has a designed fallback. The core value (structured, evidenced financial picture) delivers regardless of which adaptations are needed.
