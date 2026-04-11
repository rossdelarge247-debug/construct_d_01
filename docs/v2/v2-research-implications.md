# V2 Research Implications — What Changes

How the V2 desk research findings affect the design, priorities, and build of the Financial Picture workspace. This document should be read alongside the three research files:

- [`v2-desk-research-form-e.md`](./v2-desk-research-form-e.md) — Form E in practice and real user pain
- [`v2-desk-research-pensions-assets.md`](./v2-desk-research-pensions-assets.md) — Pensions, property, and complex assets
- [`v2-desk-research-technology.md`](./v2-desk-research-technology.md) — Technology, competitors, and regulatory landscape

---

## 1. Changes to the AI analysis pipeline

### Use Anthropic structured outputs to eliminate JSON truncation

**Finding:** Anthropic released structured outputs (November 2025) that compile JSON schemas into grammars constraining token generation. Mathematical certainty of schema compliance.

**Change:** Replace the current truncated-JSON-repair workaround (3-tier fallback: parse → repair brackets → extract partial items) with structured outputs. Define the extraction response as a JSON schema. This eliminates the truncation risk entirely and removes fragile repair code.

**Priority:** P0 — this is a foundation fix that makes everything downstream more reliable.

### Implement two-step extraction (Haiku reads → Sonnet analyses)

**Finding:** LLM benchmarks show 97–98% accuracy on text PDFs. Haiku alone produces shallow extraction with hallucination risk. The two-step approach (Haiku extracts text from PDF via `type: 'document'` → Sonnet analyses the extracted text with structured outputs) gives Sonnet-quality reasoning without the PDF format limitation.

**Change:** Already identified in HANDOFF.md as P1. Research confirms this is the right approach and provides confidence that Sonnet-quality extraction is achievable.

### Add document-type-specific extraction prompts

**Finding:** Form E requires fundamentally different data from different document types. A bank statement produces transactions, income patterns, and spending categories. A pension CETV letter produces a single value with scheme details. A payslip produces gross/net/tax/NI/pension. A mortgage statement produces balance/rate/term/ERC.

**Change:** Replace the generic extraction prompt with document-type-specific prompts. After classification, route to a prompt tailored for that document type. Each prompt should specify exactly what fields to extract, what format to return them in, and what confidence thresholds to apply.

**Map to Form E sections:**

| Document type | Key extractions | Maps to Form E |
|--------------|----------------|----------------|
| Bank statement | Accounts, balances, income deposits, transaction categories, spending totals | 2.3 (accounts), 2.15 (income), 3.1 (expenditure) |
| Payslip | Gross, net, tax, NI, pension contribution, student loan, employer, tax code | 2.15 (income) |
| P60 | Annual gross, tax paid, NI paid, employer | 2.15 (income) |
| Pension CETV letter | CETV value, scheme name, type (DB/DC), accrued annual income, membership dates | 2.13 (pensions) |
| Mortgage statement | Outstanding balance, rate, monthly payment, term end, ERC | 2.1/2.2 (property) |
| Property valuation | Estimated value, valuation date, valuator | 2.1/2.2 (property) |
| Savings/investment statement | Balance, account type, interest rate, provider | 2.3 (accounts), 2.4 (investments) |
| Tax return (SA302) | Total income, tax paid, self-employment profit | 2.15–2.16 (income) |
| Business accounts | Revenue, profit, assets, liabilities, DLA balance | 2.10 (business), 2.16 (business income) |
| Credit card statement | Balance, minimum payment, interest rate, provider | 2.14 (liabilities) |
| Loan statement | Outstanding balance, monthly payment, interest rate, term | 2.14 (liabilities) |

### Raise confidence thresholds

**Finding:** Production financial extraction systems use 0.95 for auto-accept, 0.80–0.95 for confirmation, and below 0.80 for manual entry. Financial documents in divorce carry high stakes — a hallucinated value could mislead court filings.

**Change:** Current thresholds (auto ≥0.9, confirm 0.7–0.9, question <0.7) are too aggressive. Raise to: auto ≥0.95, confirm 0.80–0.95, question <0.80. This means more items route through user confirmation, but in this domain, that's correct behaviour.

---

## 2. Changes to the category and data model

### Add explicit prompts for commonly omitted items

**Finding:** Director's loan accounts are the most commonly omitted Form E item. Crypto is not explicitly asked for on Form E. State pension implications are widely unknown. App-based bank accounts (Monzo, Revolut) are frequently forgotten.

**Changes to the first-time wizard and category prompts:**
- After selecting "Business" category: "Do you have a director's loan account with any company?"
- After completing bank accounts: "Do you have any app-based accounts? (Monzo, Revolut, Starling, etc.) These must be disclosed even if the balance is small."
- After any bank account: "Do you have any accounts you've closed in the last 12 months? These must also be disclosed."
- In pensions category: "Do you know your State Pension entitlement? The new State Pension cannot be shared on divorce — but it affects the overall picture."
- New explicit crypto/digital assets prompt: "Do you hold any cryptocurrency, NFTs, or other digital assets? These are legally recognised as property and must be disclosed."

### Add inheritance and pre-marital asset tracking

**Finding:** Standish v Standish [2025] UKSC 26 significantly strengthened the protection of non-matrimonial assets. Documenting provenance is now critical.

**Change:** Add to every financial item:
- "When was this acquired?" (pre-marriage / during marriage / inherited / gifted)
- "Has this been kept separate from joint finances?"
- "Has the value changed since acquisition?"

These fields feed into the Summary tab's Form E Part 4 narrative and into V3/V4 negotiation positioning.

### Track "as at" dates on all values

**Finding:** Form E requires values at specific dates. Crypto can fluctuate 30%+ between disclosure and hearing. Property valuations must be recent. CETV dates matter.

**Change:** Already in the vertical assessment design principles (principle 16) but not yet implemented. Every financial item must have an "as at" date. System should flag stale data: "This balance is from 6 months ago — do you have a more recent statement?"

---

## 3. Changes to the pension experience

### Pension education at point of need

**Finding:** "I don't understand pensions at all" — real user on Mumsnet. CETV values are consistently misunderstood. The difference between DB and DC pensions is not grasped. Users don't know they need to request CETVs months in advance.

**Changes:**
- When a user adds a pension item, show contextual education: "What is a CETV?" explainer, DB vs DC distinction, why CETV may not reflect true value for DB pensions
- When CETV exceeds £100,000 (the PAG2 threshold): surface a recommendation for a PODE report with cost estimate (£1,500–£3,000), what it covers, and why it matters
- When a DB pension is identified: show the income vs capital distinction — "A £300,000 CETV from a DB pension could provide £20,000/year for life. A £150,000 DC pot might generate only £6,000–£8,000/year. These are not equal even though they look like 50/50."
- MoneyHelper free pension appointment: signpost prominently in the pensions category

### Enhanced CETV tracking

**Finding:** NHS CETVs can take 9–12 months. Teachers' pensions had a backlog of 3,062 cases. Legal action was taken over delays. Users need active tracking, not just a status label.

**Changes:**
- Add provider-specific guidance: "NHS pensions: expect 3–6 months. Teachers: has been 12+ months due to backlog, check current status."
- Add chase reminders at 6 weeks, 3 months, and 6 months
- When scheme type is public sector DB: warn about potential McCloud remedy delays
- Track the PD1/PD2/PD3 form submission dates
- Surface the regulation: "Your scheme must provide a CETV within 3 months by law (6 weeks if for divorce proceedings)"

### State pension prompt

**Finding:** New State Pension cannot be shared on divorce. DWP only reassesses if you notify them. ~200,000 women owed ~£1 billion because substitution wasn't applied.

**Change:** Add a dedicated state pension section within the pensions category (not a full category, but a sub-section). Prompt:
- "Have you checked your State Pension forecast?" with link to GOV.UK check
- "The new State Pension (post-April 2016) cannot be shared on divorce. This affects how other assets are divided."
- "After your divorce is finalised, notify the DWP to reassess your entitlement."

---

## 4. Changes to the upload and review flow

### Build the Dext side-by-side pattern (spec 09)

**Finding:** The Dext pattern is proven and directly applicable. Users accept AI extraction when the original document remains visible alongside extracted data. This is what spec 09 already calls for.

**Change:** This was already identified as P2 in HANDOFF.md. Research elevates it to **high P1** — the side-by-side review is not just a nice feature, it's the trust mechanism that makes the entire AI pipeline credible. Without it, users have no way to verify extraction accuracy.

**Implementation priority:**
1. Store uploaded PDFs in Supabase Storage (prerequisite)
2. Build split-view modal: PDF viewer left, extracted data right
3. Inline editing of extracted fields with the source visible
4. "Confirm all" and "Something wrong?" actions

### Add document-specific processing messages

**Finding:** The current processing animation shows generic messages. The spec calls for content-aware messages but these aren't implemented.

**Change:** After classification (which happens quickly), update processing messages to reference what was found: "Reading your Barclays statement..." → "Found 247 transactions across 11 months..." → "Categorising your spending..."

### Data combination logic

**Finding:** The HANDOFF.md P0 priority correctly identifies that raw transactions need combining into clean financial items. Multiple salary credits → one "Employment income" line. Regular standing orders grouped by purpose.

**Research-informed rules:**
- Regular HMRC credits (monthly, consistent amount) → "Employment income (PAYE)" with high confidence
- Standing order to building society → "Mortgage payment" with medium confidence (could be savings — ask)
- Regular credits from same source, varying amounts → "Self-employment income" or "Variable income" — question
- Multiple supermarket debits → "Groceries: £X/month average" — auto-categorise
- Gambling transactions → Flag prominently (relevant to Form E Part 4 narrative and court assessment)
- Transfers between own accounts → Exclude from income/expenditure (but note for account completeness)

---

## 5. Changes to priorities and sequencing

### Revised priority order

The research changes the relative priority of features:

| # | Feature | Old priority | New priority | Why changed |
|---|---------|-------------|-------------|-------------|
| 1 | Structured outputs (JSON schema) | Not identified | **P0** | Eliminates truncation, enables reliable extraction |
| 2 | Two-step Sonnet extraction | P1 | **P0** | Foundation for extraction quality |
| 3 | Document-type-specific prompts | Not identified | **P0** | Research shows each doc type needs tailored extraction |
| 4 | Side-by-side PDF review | P2 | **P1** | The trust mechanism for the entire AI pipeline |
| 5 | Pension education & CETV tracking | Existing (basic) | **P1** | Research shows this is users' #1 confusion and bottleneck |
| 6 | Commonly omitted item prompts | Not identified | **P1** | DLA, crypto, app accounts, state pension |
| 7 | Confidence threshold adjustment | Not identified | **P1** | Current thresholds too aggressive for financial data |
| 8 | Processing animation & messages | P1 | P1 | Unchanged — still needed |
| 9 | Celebration pattern | P2 | P2 | Unchanged |
| 10 | "Something wrong?" correction | P2 | P2 | Unchanged |
| 11 | Cross-document intelligence | Not prioritised | **P2** | Income matching, payment verification |
| 12 | Inheritance/pre-marital tracking | Not identified | **P2** | Standish [2025] makes this important |
| 13 | Court-ready PDF export | P3 | **P2** | Express Pilot + digital submission mandate |

### Design work still needed before code

The HANDOFF.md P0 recommendation to do design before code is reinforced by this research. Specifically:

1. **Document-type-specific review flows** — A bank statement review looks completely different from a pension CETV review. The bank statement produces dozens of items across income and spending. The CETV letter produces one value with context. Each needs its own wireframe.

2. **Data combination and presentation hierarchy** — Research provides the rules (see Section 4 above). These need translating into visual designs showing how grouped items appear, how monthly averages are displayed, and how the user confirms categories vs individual transactions.

3. **Pension education UX** — How and when to show CETV vs income value comparisons, PODE recommendations, and state pension implications. These are educational moments that need careful design — too much information overwhelms, too little leaves users in the dark.

4. **The "What do I still need?" checklist** — Research shows this is one of users' top needs. The spec calls for a slide-out panel. Design should show exactly what documents are needed per category, why each is needed, and how to get it (with provider-specific guidance for CETVs).

---

## 6. Competitive positioning confirmed and sharpened

The research confirms and strengthens V2's competitive position:

1. **No consumer-first Form E tool exists.** Armalytix is B2B. LEAP is solicitor software. Splitifi is US-origin. Advicenow is guidance only. The gap is real and large.

2. **The squeezed middle is larger than assumed.** 96% increase in self-representation + costs of £5,000–£30,000+ = massive unserved market of people who need structured help but can't afford solicitor rates for administrative work.

3. **The regulatory environment is supportive.** NCDR mandate (April 2024), Express Pilot (April 2025), digital submission requirement, and the Data Use and Access Act 2025 all create tailwind for a digital disclosure tool.

4. **The pension complexity is a moat.** No competitor handles pension education, CETV tracking, PODE recommendations, and DB vs DC distinction in a consumer-friendly way. Getting this right is genuinely hard and genuinely valuable.

5. **Multi-document intelligence is the "magic" differentiator.** When the system says "Your payslip shows £3,218/month gross — we found matching deposits in your Barclays account on the 28th of each month", that's the moment users know this product is different from a form.

---

## 7. Flags for V3–V5

### V3 (Share & Disclose)

- The new D81 is 23 pages — needs the same guided treatment as Form E
- Section 10 (Reasons for Departure from Equality) is the most common rejection reason
- NFM Open Financial Statement is accepted as disclosure for out-of-court resolution
- Non-cooperative partner handling needs explicit design (escalation pathway, adverse inference education)
- Express Pilot front-loads disclosure — V3 must support compressed timelines

### V4 (Work Through It / Negotiate)

- Resolution Together model (one lawyer, two clients) — the product should support this workflow
- Pension offsetting risks need to be surfaced when users consider "keep the house, give up the pension"
- Disputed values (yours vs partner's) — data model already supports this per V2 assessment
- Standish [2025] precedent means pre-marital assets need careful handling in proposals

### V5 (Reach Agreement / Make It Official)

- Consent orders must be submitted via MyHMCTS as PDF
- D81 must accompany consent order — V2/V3 data feeds directly into D81 sections
- Court processing: 6–10 weeks from submission
- Quality of D81 Section 10 determines whether the order is sealed or returned
