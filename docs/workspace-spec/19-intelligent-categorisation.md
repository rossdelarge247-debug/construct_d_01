# Spec 19 — Intelligent Categorisation & Aggregation

**Status:** Draft
**Depends on:** Spec 13 (decision trees), pipeline working end-to-end
**Principle:** Reduce questions by being smarter before asking. Every question avoided is cognitive load saved.

---

## 1. Payment aggregation

Multiple payments from the same source should be grouped into a single line item, not presented as separate entries.

### Rules

| Signal | Aggregation | What the user sees |
|--------|------------|-------------------|
| 2+ credits from same source reference | Combine into one income item. Use average amount if amounts vary. | "Income from ACME LTD: ~£3,200/month (based on 3 deposits)" |
| 2+ debits to same payee | Combine into one payment. Sum if different amounts, average if similar. | "DVLA: £477/year (3 payments)" |
| Dividends from a company name | Combine, annualise. Infer limited company. | "Dividend income from ACME LTD: £X/year. Is this from your own limited company?" |
| Multiple card payments to same retailer | Don't aggregate — these are spending, categorised by the spending_categories array. | n/a (handled by spending categories) |

### Implementation

This should happen in the **result transformer**, not the AI prompt. The AI extracts individual payments; the transformer groups them:

```
1. Group regular_payments by normalised payee name (lowercase, strip LTD/PLC/DD/SO)
2. For groups with 2+ items:
   - Sum amounts if they're different (e.g. 3 DVLA payments)
   - Average amounts if they're similar (e.g. monthly mortgage)
   - Calculate annualised figure
3. Present as single aggregated item with count shown
```

### Dividend detection → limited company question

If income_deposits contain items with `type: 'other'` and the source contains "dividend" or the deposits are irregular amounts from a company name:

- Aggregate into one annual figure
- Ask: "You received £X in dividends from [Company Name] this year. Is this from your own limited company?"
- Options: "Yes, my company" / "No, investment dividends" / "Something else"
- If yes → link to business section, flag self-employment disclosure

---

## 2. Keyword lookup table

Before falling back to the generic "What is this?" question for unknown payments, check the payee name against a keyword lookup table. This eliminates questions for common vendors.

### Lookup table

| Keywords | Category | Form E | Confidence |
|----------|----------|--------|------------|
| therapy, counselling, physio, osteopath, chiropractor, psychologist, CBT | Healthcare | 3.1 | 0.90 |
| insurance, aviva, vitality, bupa, AXA, legal & general, admiral, direct line, AA | Insurance | 3.1 or 2.5 | 0.85 |
| DVLA, AA, RAC, Halfords, kwik fit, MOT | Vehicle costs | 3.1 | 0.92 |
| nursery, childminder, after school, breakfast club, holiday club | Childcare | 3.1 | 0.93 |
| gym, fitness, david lloyd, puregym, better, nuffield | Personal / leisure | 3.1 | 0.90 |
| dentist, dental, orthodont | Healthcare / dental | 3.1 | 0.92 |
| school, tuition, uniform | Children / education | 3.1 | 0.88 |
| solicitor, law, mediator, mediation, legal | Legal costs | 3.1 | 0.95 |
| Vodafone, O2, EE, Three, giffgaff, sky mobile | Phone / communications | 3.1 | 0.95 |
| BT, virgin media, sky, plusnet, talktalk | Broadband / TV | 3.1 | 0.93 |
| spotify, netflix, disney, apple, amazon prime | Subscriptions | 3.1 | 0.97 |
| pet, vet, veterinary | Pet costs | 3.1 | 0.90 |
| cleaner, gardener, window clean | Household maintenance | 3.1 | 0.88 |

### Implementation

In the result transformer, before generating a question for an `unknown` category payment:

```
1. Normalise payee name (lowercase)
2. Check against keyword table
3. If match found and confidence >= 0.90:
   → Auto-confirm with the matched category
4. If match found and confidence < 0.90:
   → Ask a targeted confirmation: "£X to [payee]. Is this [matched category]?"
5. If no match:
   → Fall through to progressive category dropdown (section 3)
```

### Example

"Sana Therapy Limit" → keyword "therapy" → Healthcare (0.90) → auto-confirm as:
*"Healthcare: £320/monthly to Sana Therapy"*

---

## 3. Progressive category dropdown for unknowns

When a payment can't be auto-categorised (no keyword match, AI classified as `unknown`), instead of the current generic options (Childcare / Rent / Maintenance / Loan / Something else), show a progressive dropdown mapped to Form E budget categories.

### Form E 3.1 spending categories

These are the actual budget line items from Form E section 3.1:

| Category | Examples |
|----------|---------|
| Housing (mortgage/rent) | Already handled by spec 13 |
| Council tax | Already handled by spec 13 |
| Gas | |
| Electricity | |
| Water | |
| Phone / mobile | |
| Broadband / TV | |
| Food / groceries | |
| Toiletries / cleaning | |
| Clothing — you | |
| Clothing — children | |
| Holidays | |
| Car — fuel | |
| Car — insurance | |
| Car — tax / MOT | |
| Car — maintenance | |
| Public transport | |
| Healthcare / prescriptions | |
| Dental | |
| Childcare | |
| School fees / activities | |
| Pet costs | |
| Subscriptions | |
| Eating out | |
| Personal (haircuts, etc.) | |
| Gifts | |
| Savings / investments | |
| Loan repayments | |
| Credit card payments | |
| Other | |

### Interaction design

Instead of radio buttons, use a **search-and-select dropdown**:

1. Show the question: "£320 goes to Sana Therapy each month. What is this?"
2. Below: a text input that filters the Form E categories as you type
3. Type "health" → shows "Healthcare / prescriptions", "Dental"
4. Tap to select → item categorised, next question
5. If nothing fits → "Other" with a free text field

This is faster than reading through 5 radio options and reduces "Something else" dead-ends.

### Implementation

New component: `CategorySelector` used inside the hero panel clarification state when the payment category is `unknown` and no keyword match was found. The component receives the Form E category list and returns the selected category.

---

## 4. Interaction between these features

The flow for an `unknown` payment goes:

```
AI returns: { payee: "Sana Therapy Limit", likely_category: "unknown", confidence: 0.5 }
     ↓
Step 1: Keyword lookup → "therapy" matches Healthcare (0.90)
     ↓
Result: Auto-confirm "Healthcare: £320/monthly to Sana Therapy"
     → No question needed
```

```
AI returns: { payee: "J SMITH SO", likely_category: "unknown", confidence: 0.4 }
     ↓
Step 1: Keyword lookup → No match
     ↓
Step 2: Progressive category dropdown
     → "£X goes to J Smith each month. What is this?"
     → Searchable Form E category list
```

```
AI returns: { payee: "HMRC", amount: 1200, likely_category: "unknown" }
AI also returns: { payee: "HMRC", amount: 800, likely_category: "unknown" }
     ↓
Step 1: Aggregation → "2 payments to HMRC: £2,000 total"
Step 2: Keyword lookup → "HMRC" not in table (could be tax, NI, student loan, penalty)
     ↓
Step 3: Targeted question → "You have 2 payments to HMRC totalling £2,000. What are these?"
     → Options: "Self-assessment tax" / "Student loan" / "Tax underpayment" / "Other"
```

---

## 5. Priority

| Feature | Complexity | Impact | Priority |
|---------|-----------|--------|----------|
| Keyword lookup table | Low (table + string matching) | High (eliminates many questions) | **P1** |
| Payment aggregation | Medium (grouping logic) | High (cleaner presentation) | **P1** |
| Progressive category dropdown | Medium (new component) | Medium (better UX for unknowns) | **P2** |
| Dividend → company detection | Low (specific signal) | Medium (self-employment disclosure) | **P2** |
