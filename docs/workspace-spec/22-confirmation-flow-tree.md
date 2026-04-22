# Confirm-Don't-Discover — Complete Flow Tree

**Purpose:** Every piece of information Form E needs, what the bank signal is, and the exact confirmation question to get from signal → confirmed fact. Replaces the 6-7 screen config flow with inline confirmations after bank connect.

**Pattern:** The system shows what it found. The user confirms, corrects, or fills blanks. Never a cold-start question when a signal exists.

---

## How to read this tree

```
SIGNAL: What bank data shows
  → CONFIRM: The question we ask (with options)
    → BRANCH: What happens based on the answer
      → RESULT: The confirmed Form E fact
      → GAP: What document is still needed
```

---

## 1. Income (Form E 2.15–2.20)

### Regular salary detected

```
SIGNAL: Same-amount deposit, same source, monthly, ≥3 months
  → AUTO-CONFIRM: "Salary: £3,218/month from ACME Ltd" (no question needed)
    → RESULT: Net income proved (Form E 2.15)
    → GAP: Payslips for gross/tax/NI breakdown
```

### Irregular employment income

```
SIGNAL: Deposits from employer vary month to month
  → CONFIRM: "Your income from ACME Ltd varies between £2,800 and £3,600. 
              Is this commission, variable hours, or something else?"
    → Commission/bonus → RESULT: Variable income, average calculated
    → Variable hours → RESULT: Variable income, average calculated
    → Seasonal → RESULT: Seasonal pattern noted
    → Other → free text
    → GAP: 12 months payslips (variable income needs more evidence)
```

### Benefits detected

```
SIGNAL: HMRC deposit matching known benefit amounts
  → AUTO-CONFIRM: "Child Benefit: £96.25/month from HMRC" (no question)
    → RESULT: Benefit income proved (Form E 2.20)
    → RESULT: 2 children inferred from amount (£25.60 + £16.95 × 4.33)
    → GAP: None — bank data is sufficient for benefits

SIGNAL: DWP deposit
  → CONFIRM: "£X/month from DWP — what benefit is this?"
    → Universal Credit / PIP / ESA / Other
    → RESULT: Benefit type and amount confirmed
```

### Dividend income

```
SIGNAL: Deposits from a limited company (especially matching user's surname)
  → CONFIRM: "£X from [Company Name] — is this dividend income from your own company?"
    → Yes, my company → RESULT: Self-employment dividend (Form E 2.16)
                       → triggers Business section
    → No, investment dividend → RESULT: Investment income (Form E 2.4)
    → Something else → free text
```

### Rental income

```
SIGNAL: Regular deposits from individuals or letting agents
  → CONFIRM: "£X/month from [name/agent] — is this rental income?"
    → Yes → RESULT: Rental income (Form E 2.16)
           → CONFIRM: "From which property?"
    → No → "What is this?" (maintenance received / family support / other)
```

### No employment income visible

```
SIGNAL: No regular employer deposits, only benefits
  → CONFIRM: "We can't see employment income. Are you currently..."
    → Not working → RESULT: No employment income
    → Retired → RESULT: Retired, pension income focus
    → Paid in cash → RESULT: Flag — needs payslips/tax returns
    → Income goes to a different account → RESULT: Connect that account
```

---

## 2. Property (Form E 2.1–2.2)

### Mortgage payment detected

```
SIGNAL: Regular payment to a building society/bank (Halifax, Nationwide, etc.)
  → CONFIRM: "£1,150/month to Halifax — is this your mortgage?"
    → Yes → CONFIRM: "Do you own this property..."
              → In my name only → RESULT: Sole ownership
              → Jointly with partner → RESULT: Joint ownership
              → Jointly with someone else → RESULT: Other joint
            → CONFIRM: "Do you know what the property is worth?"
              → Yes, roughly £X → RESULT: Estimated value
              → No idea → RESULT: Valuation needed
            → RESULT: Mortgage payment proved (Form E 2.1 + 3.1)
            → GAP: Mortgage statement (balance, rate, terms)
            → GAP: Property valuation (3 agents or RICS)
    → No, it's rent → RESULT: Housing cost = rent (Form E 3.1)
                     → No property section needed
    → Something else → "What is this?" (savings / loan / other)
```

### Council tax detected

```
SIGNAL: Payment to a local authority
  → AUTO-CONFIRM: "Council tax: £X/month to [Borough]" (no question)
    → RESULT: Council tax proved, borough identified (Form E 3.1)
    → INFER: Property location
```

### No mortgage or council tax visible

```
SIGNAL: No property-related payments
  → CONFIRM: "We didn't find mortgage or rent payments. Do you..."
    → Own outright (no mortgage) → triggers property questions above
    → Rent is paid from another account → connect that account
    → Partner pays the housing costs → RESULT: Noted
    → Living with family → RESULT: No housing cost
```

---

## 3. Accounts (Form E 2.3–2.4)

### Connected account

```
SIGNAL: The account itself — balance, full history
  → AUTO-CONFIRM: "Barclays current account ending 4521, balance £1,842"
    → RESULT: Account proved (Form E 2.3) — 12 months history
    → GAP: None for this account
```

### Joint account indicator

```
SIGNAL: Two names on account, or Tink joint account flag
  → CONFIRM: "This looks like a joint account. Is it with your partner?"
    → Yes, with partner → RESULT: Joint account (Form E 2.3)
    → No, it's sole → RESULT: Sole account
    → Joint with someone else → RESULT: Other joint
```

### Transfers to other accounts

```
SIGNAL: Regular transfers to accounts not connected
  → CONFIRM: "We can see transfers to a Nationwide account. Is this..."
    → A savings account → RESULT: Savings account exists (Form E 2.3)
                        → GAP: Connect it or upload statement
    → An ISA → RESULT: ISA exists (Form E 2.4)
             → GAP: Latest valuation
    → My partner's account → RESULT: Noted
    → A joint account → RESULT: Joint account exists
                      → GAP: Connect or upload
```

### Payments to investment platforms

```
SIGNAL: Payments to Hargreaves Lansdown, Vanguard, AJ Bell, etc.
  → CONFIRM: "You make payments to Hargreaves Lansdown. Do you have investments there?"
    → Yes → RESULT: Investment account exists (Form E 2.4)
           → GAP: Latest valuation statement
    → No, I closed it → RESULT: Noted
```

---

## 4. Pensions (Form E 2.13)

### Personal pension contributions detected

```
SIGNAL: Payments to Aviva, Scottish Widows, Standard Life, etc.
  → CONFIRM: "£200/month to Aviva — is this a pension contribution?"
    → Yes, pension → RESULT: Personal pension exists (Form E 2.13)
                   → CONFIRM: "Have you requested a CETV from Aviva?"
                     → Yes, requested [date] → RESULT: CETV pending
                     → No → EDUCATION + GAP: Request CETV (6-8 weeks)
                     → What's a CETV? → EDUCATION then above
                   → GAP: CETV letter (always required)
    → No, it's insurance → RESULT: Insurance payment (Form E 3.1)
    → Not sure → help text to check
```

### No pension contributions visible

```
SIGNAL: No pension-related payments (workplace pensions deducted at source)
  → CONFIRM: "We can't see pension contributions — they're often deducted 
              from your pay before it reaches your bank. Do you have a pension?"
    → Yes, workplace pension → RESULT: Pension exists
                             → GAP: CETV letter
    → Yes, more than one → RESULT: Multiple pensions
                         → wizard: "Tell us about each one"
    → I'm not sure → RESULT: Flag for pension tracing
    → No → RESULT: No pension (Form E 2.13 — "None")
```

---

## 5. Debts (Form E 2.14)

### Credit card payments detected

```
SIGNAL: Payments to Amex, Barclaycard, MBNA, etc.
  → AUTO-CONFIRM: "Credit card payment: £89/month to Amex"
    → RESULT: Credit card debt exists (Form E 2.14)
    → GAP: Credit card statement for outstanding balance + rate
```

### Loan repayments detected

```
SIGNAL: Fixed regular payments to finance companies
  → CONFIRM: "£245/month to [lender]. Is this..."
    → Personal loan → RESULT: Loan (Form E 2.14)
    → Car finance → RESULT: Car finance (Form E 2.14)
    → Student loan → RESULT: Student loan (Form E 2.14)
    → Something else → free text
    → GAP: Loan agreement for total outstanding + rate
```

### BNPL detected

```
SIGNAL: Payments to Klarna, Clearpay, etc.
  → AUTO-CONFIRM: "Buy now pay later: £X to Klarna"
    → RESULT: BNPL debt (Form E 2.14)
    → GAP: None if small amounts
```

### Overdraft usage

```
SIGNAL: Balance goes negative
  → AUTO-CONFIRM: "Overdraft used: up to £X"
    → RESULT: Overdraft facility (Form E 2.14)
    → GAP: None — visible from connected account
```

---

## 6. Spending (Form E 3.1)

### Full spending categorisation

```
SIGNAL: 12 months of categorised transactions (Tink PFM categories)
  → AUTO-CONFIRM: Show totals per category:
      Housing: £1,150/month
      Council tax: £185/month
      Utilities: £210/month
      Groceries: £480/month
      Transport: £175/month
      Childcare: £600/month
      Subscriptions: £85/month
      Dining/entertainment: £220/month
      Clothing: £95/month
      Insurance: £120/month
      Other: £130/month
      ─────────────
      Total: £3,450/month
  → CONFIRM: "Your monthly spending is roughly £3,450. Does this feel right?"
    → About right → RESULT: Spending proved (Form E 3.1)
    → Let me review categories → expand for per-category review
    → GAP: None — bank data is the gold standard for 3.1
```

---

## 7. Business (Form E 2.10–2.11, 2.16)

### Self-employment signals detected

```
SIGNAL: HMRC self-assessment payments + irregular income pattern
  → CONFIRM: "We can see HMRC self-assessment payments. Are you self-employed?"
    → Yes → CONFIRM: "What's your business structure?"
              → Sole trader / Limited company / Partnership / LLP
            → CONFIRM: "What's your business called?"
              → [text input]
            → RESULT: Business section created (Form E 2.10)
            → GAP: Business accounts (2 years)
            → GAP: Tax returns (2 years)
    → No, that's from a previous year → RESULT: No current business
```

### Company dividends detected (covered in Income §1 above)

---

## 8. Children

### Child Benefit detected

```
SIGNAL: HMRC deposit matching Child Benefit rates
  → AUTO-CONFIRM: "Child Benefit for 2 children: £96.25/month"
    → CONFIRM: "Is that right — 2 children?"
      → Yes → RESULT: 2 children confirmed
      → No, [X] children → RESULT: Corrected
```

### Childcare payments detected

```
SIGNAL: Payments to nurseries, childminders, after-school clubs
  → AUTO-CONFIRM: "Childcare: £600/month to [Bright Sparks Nursery]"
    → RESULT: Childcare cost proved (Form E 3.1)
```

### School fees detected

```
SIGNAL: Large termly payments to schools
  → AUTO-CONFIRM: "School fees: £X/term to [School Name]"
    → RESULT: Private education cost (Form E 3.1 + Part 4 standard of living)
```

### No child signals

```
SIGNAL: No Child Benefit, no childcare, no school payments
  → CONFIRM: "Do you have children?"
    → Yes → "How many?" → [number]
           → "Are they under 18?" → Yes/No
    → No → RESULT: No children section
```

---

## 9. Other assets (Form E 2.4–2.9)

### Crypto exchange detected

```
SIGNAL: Payments to Coinbase, Binance, Kraken, etc.
  → CONFIRM: "We see payments to Coinbase. Do you hold cryptocurrency?"
    → Yes → "Roughly how much is it worth today?" → £[input]
           → RESULT: Crypto asset (Form E 2.4/2.9)
    → No, I've sold it all → RESULT: Noted (no current asset)
    → I'd rather not say right now → RESULT: Flagged for follow-up
```

### Car finance detected

```
SIGNAL: Payments to car finance companies
  → CONFIRM: "£245/month to [BMW Finance]. Is this car finance?"
    → Yes → RESULT: Vehicle + finance (Form E 2.8 + 2.14)
    → No → "What is this?" options
```

### Overseas transfers detected

```
SIGNAL: International transfers or forex services
  → CONFIRM: "We see transfers to [country/service]. Do you have assets abroad?"
    → Yes → wizard: what type, value, which country
           → RESULT: Overseas asset (Form E 2.9)
    → No, just sending money to family → RESULT: Noted
```

### Life insurance detected

```
SIGNAL: Payments to insurance companies (not already categorised as home/car)
  → CONFIRM: "£X/month to [provider]. Is this life insurance?"
    → Yes → RESULT: Life insurance exists (Form E 2.5)
           → GAP: Surrender value statement
    → No → "What is this?" (health / income protection / other)
```

---

## 10. Red flags (no user question — system flags internally)

```
SIGNAL: Gambling transactions (Bet365, Paddy Power, etc.)
  → FLAG: Pattern noted for disclosure context

SIGNAL: Large unexplained cash withdrawals (>£500)
  → FLAG: Unusual cash pattern

SIGNAL: Sudden stop of regular payments
  → FLAG: Possible account changes or financial distress

SIGNAL: Payments to solicitors/mediators
  → FLAG: Legal proceedings context (do not surface to user)
```
