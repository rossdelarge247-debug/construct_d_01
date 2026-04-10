# V2 Desk Research — Pensions, Property, and Complex Assets

Research conducted April 2026 across pension regulators, practitioner sources, case law, HMRC guidance, and specialist legal commentary. This document covers the financial complexity that V2 must handle — pensions, property, self-employment, crypto, overseas assets, and inheritance.

---

## Sources researched

- NHS Business Services Authority (CETV suspension updates, PD forms)
- Teachers' Pensions (CETV backlog updates, McCloud remedy)
- The Pensions Regulator (transfer values guidance)
- Pensions Dashboards Programme (connection timeline, technical standards)
- MoneyHelper (pension splitting, state pension, free pension appointments)
- Pension Advisory Group (PAG2 report, January 2024)
- Family Justice Council (pension on divorce guidance)
- Financial Remedies Journal (PAG2 reflections, academic analysis)
- Galbraith Tables (Mathieson Consulting — pension offsetting multipliers)
- HMRC (SA302, CGT on separation, crypto treatment)
- Law Commission (Property (Digital Assets etc) Act 2025)
- Supreme Court (Standish v Standish [2025] UKSC 26)
- House of Lords (White v White [2000], Miller v Miller [2006])
- Family Court (Culligan v Culligan [2025], DH v RH [2024], Prest v Petrodel [2013])
- RICS (Red Book property valuation standards)
- Solicitor blogs (Stowe, Higgs, Brabners, Roythornes, Gulbenkian Andonian, Duncan Lewis, Stephens Scown)
- DWP (state pension through partner, LEAP correction exercise)

---

## 1. Pension complexity — the full picture

### CETV process

The member (or solicitor) submits a formal request to the pension scheme administrator. For NHS: PD1 form, plus PD2 from employer if active member, plus PD3 if a court order exists.

**Timelines:**
- **Regulation:** Schemes must provide within 3 months, or within 6 weeks if specifically for divorce
- **Private sector:** Typically 4–12 weeks
- **NHS:** 3 months typical, but temporary suspension following HM Treasury discount rate change (2.4% → 1.7%, March 2023). Suspension lifted, backlog target was 18 August 2024. McCloud remedy adds complexity.
- **Teachers' Pensions:** The worst delays. Backlog peaked at 3,062 cases (October 2024). 80% cleared by March 2025. Legal action by Leigh Day on behalf of teachers left "in limbo."
- **Police / Armed Forces:** Similar delays from discount rate change and McCloud, less publicly reported

**CETV letter contents:** The cash equivalent transfer value figure, date of calculation, pension benefits it represents (accrued annual income, lump sum entitlement), scheme membership dates, and charge schedule for implementing any pension sharing order. Arrives as paper letter or PDF; each scheme has its own format.

### CETV vs actual pension value

For defined benefit (DB) pensions, the CETV is often deeply misleading:

- **It does not reflect the income guarantee.** DB pensions provide guaranteed income for life, inflation-linked, often with survivor's pension. The CETV is a discounted present-value calculation.
- **It varies with interest rates.** When the Treasury discount rate changed, CETVs changed dramatically overnight — same pension benefits, completely different CETV.
- **Concrete example:** A DB pension with CETV of £300,000 might provide £20,000/year guaranteed, inflation-linked for life. If the non-pension spouse receives £150,000 into a DC pot, that might generate only £6,000–£8,000/year. On paper a "50/50 split"; in reality, the DB holder gets 2.5–3x the retirement income.

**The Galbraith Tables** (Mathieson Consulting) provide multipliers converting annual pension income into capital value for offsetting purposes. Endorsed by the PAG2 report (January 2024) as more realistic than raw CETVs.

**Scheme-specific notes:**
- **NHS:** Particularly valuable — inflation-linked, lifetime guarantee, survivor benefits. CETVs routinely understate value.
- **Teachers':** Same DB structure; CETVs similarly misleading, compounded by 12-month delays.
- **Armed Forces:** Early retirement (can retire in 40s with 22 years service). Income for potentially 40–50 years makes these pensions particularly valuable relative to CETV.
- **Police:** Similar early-retirement provisions.

### PODE reports (Pension on Divorce Expert)

A PODE is typically an actuary whose duty is to the court (not either party). Must be impartial.

**When needed:** Generally recommended when any pension CETV exceeds £100,000, or where DB pensions are involved, multiple pensions of different types exist, or parties are at different ages/retirement dates.

**Cost:** £1,500–£3,000+ VAT (£2,000–£4,000 for complex cases). Usually shared between parties.

**What the report contains:**
1. Pension valuation going beyond raw CETVs
2. Tax implications of different settlement structures
3. Pension sharing order vs offsetting analysis
4. Lifetime and annual allowance considerations
5. Impact of pension age and early retirement factors
6. The pension sharing percentage needed for either "equality of capital" or "equality of income"

**Timeline:** 3–6 months realistically (data gathering from schemes is the longest phase).

**PAG2 Guidance (January 2024):** Second edition by Pension Advisory Group, chaired by Mr Justice Francis and HHJ Edward Hess. Key findings: too few cases use pension sharing orders; PSOs are widely misunderstood; pension valuations not obtained often enough; approaches to pensions remain inconsistent. Endorsed by Family Justice Council.

### Three pension options on divorce

**Pension Sharing Order (PSO):** Divides pension by agreed percentage. Pension credit becomes a completely separate fund in the recipient's name. Enables clean break. Can only be made on or after final order.

**Pension Attachment Order (Earmarking):** Pension stays in member's name but scheme pays a percentage to ex-spouse when benefits come into payment. Does NOT provide clean break — parties remain financially linked. Stops if recipient remarries. Rarely used.

**Pension Offsetting:** One spouse keeps pension; other receives more of other assets (typically the home). Offers simplicity but carries major risk — £1 of pension is not equal to £1 of property. Galbraith Tables should be used for DB pensions, not raw CETVs.

### State pension

**Old State Pension (pre-6 April 2016):** Divorced people can substitute ex-spouse's NI contributions. Does not reduce ex-spouse's pension. Additional State Pension (SERPS/S2P) can be shared via PSO.

**New State Pension (post-6 April 2016):** Cannot be shared on divorce. This catches many people off guard.

**What people don't know:**
- DWP will only reassess if YOU notify them of divorce. Not backdated.
- Nearly 200,000 women owed approximately £1 billion because substitution was not automatically applied. LEAP correction exercise began January 2021, mostly completed by December 2024.
- The parent who stops receiving Child Benefit may lose automatic NI credits.
- State Pension is NOT disclosed on Form E in the same way as private pensions but SERPS/S2P should be disclosed. Often omitted.

### Pension Dashboards

The UK Pensions Dashboards Programme requires all schemes to connect by **31 October 2026**. Public launch expected **late 2026 or early 2027** on the MoneyHelper website. Commercial dashboards (FCA-regulated) may follow.

**No public API is currently planned** for third-party applications. Access will be mediated through regulated dashboard interfaces. Dashboards will show estimated values, not formal CETVs — formal requests to each scheme will still be required for Form E.

### DC pensions and SIPPs

For defined contribution pensions (including SIPPs), valuation equals fund market value minus exit charges. CETV = fund value — far more straightforward than DB. But:
- Market volatility between valuation and PSO implementation can be significant
- SIPPs can hold illiquid assets (commercial property, unquoted shares)
- No income guarantee — £100k in DC pot is worth less in retirement income than £100k CETV from DB
- Money purchase annual allowance complications if flexible benefits already accessed

---

## 2. Property in divorce

### Valuation methods

**Estate agent estimates:** Courts generally accept the average of three independent valuations. Not formal "valuations" in a legal sense — cannot alone constitute expert evidence. Free.

**RICS Red Book valuation:** Gold standard for court. Chartered surveyor report admissible as expert evidence. Cost: £750+ VAT. Courts often suggest a joint expert.

**When formal valuation needed:** When value is disputed, property is unusual/complex, case likely contested, or accuracy critical for consent order.

### Ownership and beneficial interests

All property must be disclosed regardless of whose name it is in. Form E asks about legal AND beneficial interest. Property acquired during marriage typically treated as matrimonial regardless of title. Land Registry confirms whether joint tenants or tenants in common.

Where legal ownership doesn't reflect reality (e.g., one party contributed deposit but isn't on title), beneficial interest must be disclosed via deeds of trust or resulting/constructive trusts.

### Trust property

Trust interests must be disclosed. Courts assess whether the trust is genuine or effectively under the party's control. Relevant factors: type (fixed vs discretionary), actual access to funds, distribution history, letter of wishes.

### Buy-to-let and investment properties

Treated as matrimonial assets. Both capital value and rental income must be disclosed. Net rental yield (after mortgage, maintenance, management, tax) is relevant. CGT relief between spouses ends at the end of the tax year of separation.

---

## 3. Self-employment and business assets

### Form E requirements

Section 2.10 (business interests) requires: company name, nature of business, your role, estimated current value with explanation. Section 2.16 (income from business) requires detail on salary, dividends, drawings, and benefits-in-kind.

**Required documents:**
- Business accounts (last 2 financial years)
- SA302 tax calculations from HMRC (last 4 years)
- Self-assessment tax returns
- Director's loan account statements
- Dividend vouchers
- Any business valuation

**Critical distinction:** Courts look at the totality of what a party extracts from or has available through their business, not just declared salary. Benefits-in-kind, retained profits, and dividends all count.

### Business valuation

**When needed:** Where value is disputed and business is significant. Court typically appoints a Single Joint Expert (one accountant for both sides).

**Methods:**
- Net asset-based — total assets minus liabilities (property companies, holding companies)
- Capitalised earnings — maintainable future earnings × appropriate multiplier (most trading businesses)
- Market-based — comparable sale prices
- Dividend yield — mainly for minority shareholdings

**Cost:** £5,000–£15,000 for straightforward; significantly more for complex structures. Typically shared. Timeline: a few weeks to a month+.

### Director's loan accounts

The most commonly omitted disclosure item. A DLA records money flowing between director and company. Debit balance = director owes company (a liability). Credit balance = company owes director (an asset). Failing to disclose can overstate or understate marital assets.

**Prest v Petrodel Resources Ltd [2013] UKSC 34:** Courts can pierce the corporate veil where company structures conceal personal assets, and can order transfer of company-owned property where the company holds it as nominee/trustee.

---

## 4. Crypto and digital assets

### Legal framework

**Property (Digital Assets etc) Act 2025** (Royal Assent 2 December 2025) formally recognises digital assets as a third category of personal property in E&W law. Form E does not explicitly ask about digital assets — a known gap.

### Key case law

**Culligan v Culligan [2025] EWFC 1:** £27 million case. Husband purchased 1,000+ Bitcoin in 2012 for £10,000, appreciated to £20 million. £371,000 in undisclosed Bitcoin revealed during proceedings. Court ruled litigation misconduct, imposed costs penalties, ordered equal division after 40-year marriage.

**DH v RH (No 3) [2024] EWFC 79:** Wife alleged £178 million in undisclosed crypto. True assets approximately £12 million. Legal costs staggering — husband £987,000; wife £1.9 million funded by litigation loan.

### Valuation challenges

Prices can fluctuate 30%+ between disclosure and hearing. Courts respond with: fixed valuation dates, averaged pricing, or settlement adjustments. Privacy coins, decentralised exchanges, and cross-chain transactions complicate tracing. Blockchain analysis tools and forensic specialists are increasingly used.

**HMRC treatment:** Crypto disposals subject to CGT. Spousal transfer relief ends at separation (grace period to end of tax year).

---

## 5. Overseas assets

Courts consider all assets worldwide. Form E requires disclosure regardless of location. Values must be converted to GBP using exchange rate on the valuation date.

**Enforcement challenges:** English courts can make orders covering overseas assets and issue freezing injunctions, but enforcement abroad can be difficult depending on jurisdiction. Common scenarios: holiday homes abroad, overseas bank accounts, foreign pensions (may not be shareable under UK PSOs), property in relatives' names.

**Sharland v Sharland [2015] UKSC 60:** Settlements can be set aside entirely where non-disclosure undermines fairness.

---

## 6. Inheritance and pre-marital assets

### The principle

Inherited and pre-marital assets are non-matrimonial property — not automatically subject to the sharing principle. But courts retain discretion to invade them where matrimonial assets are insufficient for needs.

### Key case law

**White v White [2000] UKHL 54:** Established distinction between non-matrimonial and matrimonial property. Inherited assets treated differently but only if both parties' needs can be met from matrimonial assets alone. Introduced "yardstick of equality."

**Miller v Miller; McFarlane v McFarlane [2006] UKHL 24:** Three principles: needs, compensation, sharing. Sharing applies only to matrimonial property. Non-matrimonial property accessible for needs.

**Standish v Standish [2025] UKSC 26:** The most significant recent authority. £77.8 million in pre-marital investment funds transferred between spouses for IHT planning did NOT matrimonialise them. 75% deemed non-marital. Wife's award reduced from £45 million to £25 million — described as the largest reduction on appeal in English legal history. Court held matrimonialisation should be applied narrowly; simply transferring assets into joint names is not sufficient.

### Documentation needed

To protect non-matrimonial status: date and source of inheritance/gift; proof kept separate; evidence not treated as shared resource; any pre/postnuptial agreement; bank statements showing ring-fencing.

---

## 7. Key findings — what V2 must handle

1. **Pension education is not optional.** Users literally don't understand what a CETV means. V2 must explain, not just capture.

2. **CETV tracking is a core feature, not a nice-to-have.** With 6-week to 12-month waits, the product that tracks, chases, and reminds is genuinely solving a real problem.

3. **The £100,000 CETV threshold** is a useful rule of thumb for recommending PODE reports. Build this into the product's intelligence.

4. **DB vs DC distinction matters enormously.** A 50/50 CETV split can produce wildly unequal income outcomes. The product should surface this.

5. **State pension is the hidden factor.** The new State Pension cannot be shared on divorce. Users need to know this, and to notify DWP.

6. **Crypto is a gap in Form E** that Decouple can fill by explicitly prompting where the official form does not.

7. **After Standish [2025]**, documenting non-matrimonial source is critical. The product should prompt for acquisition date, source, and whether assets were kept separate.

8. **Director's loan accounts are the most commonly omitted item.** Specific prompting required.

9. **Property valuation needs tiered guidance.** Three estate agents for most; RICS surveyor where disputed or heading to court.

10. **Standard of living is narrative.** Provide guided prompts (holidays, housing, schools, cars, memberships) rather than a blank text field.
