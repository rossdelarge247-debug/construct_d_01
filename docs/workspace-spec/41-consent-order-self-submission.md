# Spec 41 — Consent Order Self-Submission: Legal Research

**Date:** 17 April 2026
**Purpose:** Research whether a financial consent order can legally be generated and submitted without professional review. Informs whether Decouple can produce a directly-submittable order or whether professional review is mandatory.

## Bottom line

**There is no legal requirement for a solicitor to draft or review a consent order.** A litigant in person can draft their own consent order, complete their own D81, and submit it to the court for approval. The court must review and approve it regardless of who drafted it.

**BUT**: DIY orders are rejected more frequently than solicitor-drafted ones — not because of the drafter, but because of the drafting **quality**. Rejections are due to vague language, missing clauses, or unfair terms. These are technical/drafting issues, not authorisation issues.

**Implication for Decouple:** The product can legally produce a submittable consent order. Whether it SHOULD (vs recommending professional review) depends on whether we can meet the drafting quality bar. Given the structured nature of the data, the engineering problem is tractable.

## Key legal facts

### 1. No solicitor requirement
- The court does not require a solicitor for consent order submission
- Litigants in person can draft their own consent order
- Many mediation services (Mediate UK, amicable, NFM) offer consent order drafting at fixed fees — these are often paralegal or technology-generated, not bespoke solicitor work

### 2. What the court actually checks
The judge reviews:
- Whether the D81 is fully completed (especially Section 10 — the most common reason for rejection)
- Whether the agreement appears "fair and reasonable"
- Whether there are any red flags suggesting pressure, non-disclosure, or unconscionable terms
- Whether pension sharing annex is present if pensions are being shared
- Whether the order's wording is legally precise and enforceable

If the paperwork looks fair, the judge seals the order (typically 6-10 weeks). If concerns arise, the judge requests further information or schedules a hearing.

### 3. Litigant in person triggers mandatory review
- When at least one party is a litigant in person, the court MUST approve the order (rather than rubber-stamping)
- This is a safeguard — the judge's scrutiny is higher
- Practically: the court applies more care to DIY orders, which means the drafting quality matters MORE, not less

### 4. Typical reasons DIY orders get rejected
From the research:
- Vague or imprecise legal language ("Mark will give Sarah his share of the house" vs the precise legal wording needed)
- Missing clauses (no pension sharing annex when pensions are being shared)
- Section 10 of D81 left blank or inadequate (the "why the court should approve this" narrative)
- Unfair splits without explanation (90/10 without reasoning)
- Missing dismissal of future claims (clean break not properly worded)
- Incorrect court jurisdiction or party details
- Imprecise pension sharing percentages

All of these are **solvable through structured data + precise legal templates**. None require bespoke legal judgment for the standard case.

## What this means for Decouple

### The product can legally generate a submittable consent order

Given the structured agreement data from the negotiation flow, we can:
1. Map every agreed item to the correct legal clause template
2. Use precise, court-approved legal wording
3. Auto-populate D81 with full disclosure data
4. Auto-write D81 Section 10 from the proposal reasoning trails
5. Generate the pension sharing annex when applicable
6. Apply the correct clean break / dismissal clauses
7. Format to court submission standards

### The three-tier output model

**Tier 1: Submittable as-is (for 60% of cases)**
Standard cases: employed/self-employed PAYE, homeowner/renter, bank-evidenced disclosure both sides, no complex structures. Auto-generated consent order + D81 can be submitted directly. Court approval rates should match or exceed solicitor-drafted orders because the structured data eliminates human error.

**Tier 2: Review recommended (for 25% of cases)**
Moderate complexity: one business, pension sharing, joint mortgage with complex arrangements, children arrangements. Product generates a high-quality draft but flags items for professional review. On-demand solicitor review at fixed fee (£200-500). User can choose to submit anyway as litigant in person.

**Tier 3: Professional drafting required (for 15% of cases)**
High complexity: overseas assets, trusts, business valuations, significant spousal maintenance, offshore accounts. Product provides the data and structured agreement; solicitor drafts the final order. Standard solicitor consent order fee (£500-2,000).

### The quality safeguards to implement

To confidently offer Tier 1 (direct submission), the product needs:

1. **Legal template library** — each clause vetted by legal counsel, covering standard scenarios
2. **Pension sharing annex generation** — precise wording aligned with the Welfare Reform and Pensions Act
3. **D81 Section 10 auto-generation** — narrative built from proposal reasoning
4. **Fairness guardrails** — flag splits outside typical ranges (e.g. >80/20 without reasoning)
5. **Jurisdiction checks** — right court, right form of order
6. **Completeness validation** — no blank required fields, no missing annexes
7. **Pre-flight check** — the system reviews its own output against known rejection reasons before submission
8. **Optional professional review path** — always available as a paid add-on

### Precedent: who's already doing this

- **Amicable** generates consent orders from structured user input. Fixed-price service. High approval rates.
- **Mediate UK** drafts consent orders from mediation outputs. Paralegal-led, template-based. Commercially successful.
- **Divorce-online** offers DIY consent order packages with templates and guidance.

The precedent is strong: automated consent order generation is already commercially viable. Decouple's advantage is generating from structured disclosure data (vs user input), which should produce higher quality.

## Risks and how to mitigate

| Risk | Mitigation |
|---|---|
| Order rejected — user frustrated | Pre-flight check against rejection reasons. If flagged, recommend review before submission. |
| Order sealed but unfair — setaside later | Fairness guardrails. Clear warnings when splits are unusual. Statement of truth that both parties fully disclosed. |
| Order missing enforceability elements | Legal template library vetted by counsel. Regular updates as case law evolves. |
| Complex scenario misclassified as standard | Upfront profiling catches complexity (business, overseas, trusts). Auto-route to Tier 2/3. |
| Regulatory change | Monitor court rules and Express Financial Remedy Pilot updates. Quick template updates. |

## Regulatory context

- **SRA (Solicitors Regulation Authority)** does not regulate consent order drafting directly — it regulates solicitors. Anyone can draft a legal document in England and Wales; it's the giving of "reserved legal services" (representing a party in court) that's regulated.
- **The Legal Services Act 2007** defines reserved activities. Drafting a consent order is NOT a reserved activity. Representing at a hearing IS.
- **Express Financial Remedy Pilot** (33+ courts, April 2025-April 2026) accelerates disclosure requirements — good for structured-data products like Decouple.
- **Law Commission reform consultation** (Spring 2026) may move toward more formulaic financial settlements — this would favour structured data products.

## Recommendation

**Build Tier 1 (direct submission) as a core V3 feature.** The law allows it. The technology supports it. The market precedent exists. It's the biggest possible disruption to the current system.

**Offer Tier 2 (optional review) as a paid add-on** from the start. This captures users who want the reassurance and creates a natural upgrade path. Revenue opportunity: partner with family law firms for on-demand review.

**Route Tier 3 (professional drafting) to partner solicitors.** These cases generate referral revenue and establish Decouple as a trusted provider to the legal profession.

The legal research supports the most ambitious version of the product. The constraint is drafting quality, which is an engineering problem — not a legal one.
