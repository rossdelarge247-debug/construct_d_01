# Extraction & Clarification Decision Tree — Wizard-Driven Sections

**Companion to:** `13-extraction-decision-tree-documents.md`
**Purpose:** For sections where there is no primary document to upload, or where the user chose to enter estimates. These are guided question flows within the hero panel, one question per screen.

---

## Principle

Wizard-driven sections ask only what Form E requires. Every question maps to a field. Questions are skippable (marked "TBC" / "I don't know") — the user is never blocked. Estimates are always accepted and clearly labelled.

---

## 1. PROPERTY (when no valuation or mortgage statement uploaded)

**Form E sections:** 2.1 (Family home), 2.2 (Other property)

Triggered by: user indicated property ownership in discovery dialogue.

### Question flow — per property

| # | Question | Options | Form E field | Skip allowed? |
|---|----------|---------|-------------|--------------|
| 1 | "What's the address of this property?" | Text input (or "I'd rather not enter the address") | 2.1 | Yes — can describe as "Family home" |
| 2 | "What type of property is this?" | Family home · Buy-to-let · Holiday home · Land · Other | 2.1/2.2 | No — needed for categorisation |
| 3 | "Whose name is it in?" | Joint names · My name only · Partner's name only · Other arrangement | 2.1 | No — ownership is fundamental |
| 4 | "What do you think it's worth?" | £[input] + "How confident are you?" Known (recent valuation) · Estimated · No idea | 2.1 | Yes — "I don't know" → marked unknown |
| 5 | "Is there a mortgage on this property?" | Yes · No (owned outright) | 2.1 | No |
| 5a | If yes: "Roughly how much is the mortgage?" | £[input] | 2.1 | Yes — "I don't know" |
| 5b | If yes: "What's the monthly payment?" | £[input] | 2.1 + 3.1 | Yes |
| 5c | If yes: "Who is the lender?" | Text input | 2.1 | Yes |
| 6 | "Was this property owned before the marriage or inherited?" | Owned before marriage · Inherited during marriage · Acquired during marriage · Not sure | 2.1 + Part 4 narrative | Yes |
| 7 | If buy-to-let: "Does this property generate rental income?" | Yes, £[input]/month · Between tenants · No | 2.16 | Yes |

**Calculated and shown:** "Based on your estimates, the equity is roughly £[value – mortgage]."

**What we tell them next:** "Upload your mortgage statement and a property valuation when you have them. This will replace your estimates with evidenced figures."

---

## 2. PENSIONS (when no CETV letter uploaded)

**Form E sections:** 2.13

Triggered by: user indicated pension in discovery, or pension contributions detected on payslip.

### Question flow — per pension

| # | Question | Options | Form E field | Skip allowed? |
|---|----------|---------|-------------|--------------|
| 1 | "Who is your pension provider?" | Text input · I don't know · Search common providers | 2.13 | Yes — "I don't know" |
| 2 | "What type of pension is this?" | Workplace (employer) · Personal/private · SIPP · I don't know | 2.13 | Yes |
| 3 | "Do you know the value (CETV)?" | Yes, £[input] · I have a rough idea, roughly £[input] · No idea | 2.13 | Yes — all valid |
| 4 | "Have you requested a CETV from your provider?" | Yes, requested on [date input] · No · I don't know what a CETV is | 2.13 | No — tracking starts here |

**If "No" or "don't know what a CETV is":**

| # | Screen | Content |
|---|--------|---------|
| 4a | Education moment | "A CETV (Cash Equivalent Transfer Value) is how pensions are valued for divorce. You request it from your pension provider — it's free once per year. It typically takes 6 weeks to 3 months for private pensions, and up to 12 months for some public sector schemes (NHS, Teachers)." |
| 4b | "Would you like to request your CETV now?" | "We can show you how. Your provider is [X]." → Yes, show me · I'll do this later |

**If CETV provided:**

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 5 | "Is this a defined benefit (final salary) or defined contribution (money purchase) pension?" | Defined benefit · Defined contribution · I'm not sure | 2.13 |
| 5a | If DB and CETV > £100,000: | "For defined benefit pensions of this value, a specialist pension report (PODE) is usually recommended. CETVs often understate the true value of DB pensions. A PODE costs £1,500–£3,000, typically shared." | Tell me more · Noted |

**Repeat prompt:** "Do you have any other pensions? Most people who've changed jobs have more than one."

### State pension sub-section

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 1 | "Have you checked your State Pension forecast?" | Yes · No → link to gov.uk/check-state-pension | — |
| 2 | "The new State Pension (post-April 2016) cannot be shared on divorce. This is important context for how other assets are divided." | Noted · Tell me more | Advisory |

---

## 3. DEBTS & LIABILITIES (when no statements uploaded)

**Form E sections:** 2.14

Triggered by: user indicated debts in discovery.

### Question flow

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 1 | "What types of debt do you have?" | Multi-select: Credit cards · Personal loan · Car finance · Student loan · Overdraft · Money owed to family/friends · HMRC/tax debt · Other | 2.14 |

**Per debt selected:**

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 2 | "Who is the lender/who do you owe?" | Text input | 2.14 |
| 3 | "Roughly how much do you owe?" | £[input] | 2.14 |
| 4 | "Is this debt in your name, joint, or your partner's?" | Mine · Joint · Partner's | 2.14 |
| 5 | "What's the monthly payment?" | £[input] · I don't know · Minimum only | 2.14 + 3.1 |

**Repeat:** "Any other debts?" until the user says no.

**What we tell them:** "Upload your credit card and loan statements when you have them — this will give us exact balances and terms."

---

## 4. OTHER ASSETS (wizard-driven, no primary document)

**Form E sections:** 2.4 (Investments), 2.5 (Life insurance), 2.6 (Money owed to you), 2.8 (Personal belongings >£500), 2.9 (Assets abroad)

Triggered by: user indicated other assets in discovery (vehicles, crypto, valuables, overseas assets, etc.)

### Per asset type selected in discovery

**Vehicles:**

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 1 | "What vehicle do you own?" | Make, model (text) | 2.8 |
| 2 | "What's it worth roughly? (Second-hand value, not insurance value)" | £[input] | 2.8 |
| 3 | "Is there finance on it?" | Yes → how much outstanding £[input] · No · It's leased | 2.8 + 2.14 |
| 4 | "Whose name is it in?" | Mine · Joint · Partner's | 2.8 |

**Cryptocurrency:**

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 1 | "What cryptocurrency do you hold?" | Bitcoin · Ethereum · Multiple types · Other | 2.4/2.9 |
| 2 | "What's the approximate total value today?" | £[input] · I'm not sure — it changes a lot · Prefer not to say right now | 2.4/2.9 |
| 3 | "Where is it held?" | Coinbase · Binance · Hardware wallet · Multiple places · Other | 2.4/2.9 |

**Note to user:** "Cryptocurrency values change frequently. We'll ask you to update this closer to disclosure."

**Valuables (jewellery, art, collections):**

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 1 | "Describe the item" | Text input | 2.8 |
| 2 | "What's it worth at second-hand value? (Not insurance or replacement value)" | £[input] | 2.8 |
| 3 | "Was it inherited or a gift?" | Yes → from whom, roughly when · No | 2.8 + Part 4 |

**Repeat** for each item. Prompt: "Any other valuable items worth over £500?"

**Life insurance / endowments:**

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 1 | "Who is the provider?" | Text input | 2.5 |
| 2 | "What's the surrender value? (Not the death benefit or sum assured)" | £[input] · I don't know → "Check with your provider — it's the surrender value that counts for disclosure, not what it would pay out on death" | 2.5 |
| 3 | "Whose name is it in?" | Mine · Joint · Partner's | 2.5 |

**Assets abroad:**

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 1 | "What type of asset is it?" | Property · Bank account · Pension · Investment · Other | 2.9 |
| 2 | "Which country?" | Text or dropdown | 2.9 |
| 3 | "What's the approximate value in sterling?" | £[input] · I'll need to check the exchange rate | 2.9 |
| 4 | "Whose name is it in?" | Mine · Joint · Partner's · Family member | 2.9 |

---

## 5. BUSINESS (when self-employed / company director)

**Form E sections:** 2.10 (Business interests), 2.11 (Directorships), 2.16 (Business income)

Triggered by: user indicated self-employment or directorship in discovery.

### Question flow

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 1 | "What's your business called?" | Text input | 2.10 |
| 2 | "What does your business do?" | Text input (brief) | 2.10 |
| 3 | "What's the business structure?" | Sole trader · Limited company · Partnership · LLP | 2.10 |
| 4 | "What's your role?" | Owner · Director · Partner · Shareholder | 2.10/2.11 |
| 5 | "What do you take from the business annually?" | Salary £[input] · Dividends £[input] · Drawings £[input] · Combination | 2.16 |
| 6 | If limited company: "Do you have a director's loan account?" | Yes, the company owes me £[input] · Yes, I owe the company £[input] · No · I don't know | 2.10 |
| 7 | "Has the business been valued?" | Yes, approximately £[input] · No · I don't think it's worth much | 2.10 |
| 8 | "Is your partner involved in the business?" | Yes, they work in it · Yes, they're a shareholder · No | 2.10 |

**What we tell them:** "You'll need to upload your business accounts (last 2 years), SA302 tax calculations, and tax returns. For limited companies, your accountant can provide these."

**Flag if appropriate:** "If the business has significant value, a forensic accountant may be needed for a formal valuation. This typically costs £5,000–£15,000 and is usually shared between parties."

---

## 6. SPENDING (detailed review — after bank statement processing)

**Form E sections:** 3.1 (Expenditure / Income needs)

This isn't a wizard from scratch — it's a review of AI-categorised spending from bank statements. But if no bank statements are uploaded, it becomes a guided estimates flow.

### If bank statements have been processed

The AI has already categorised spending into groups. The user reviews totals, not transactions.

| Category | AI-generated average | Question | Options |
|----------|---------------------|----------|---------|
| Housing (mortgage/rent) | £[X]/month | Already confirmed during bank statement clarification | — |
| Council tax | £[X]/month | Auto-confirmed if detected | — |
| Utilities (gas, electric, water) | £[X]/month | "Does £[X]/month for utilities sound right?" | About right · Too high · Too low |
| Groceries | £[X]/month | "We calculated grocery spending at £[X]/month. Does that sound right?" | About right · I think it's different |
| Transport | £[X]/month | Shown for review | — |
| Childcare / school | £[X]/month | Already confirmed during bank statement clarification | — |
| Subscriptions | £[X]/month | Shown for review — auto-categorised | — |
| Insurance | £[X]/month | Shown for review | — |
| Dining / entertainment | £[X]/month | Shown for review | — |
| Clothing / personal | £[X]/month | Shown for review | — |
| Other | £[X]/month | Shown for review | — |
| **Total** | **£[X]/month** | "Your total monthly spending is approximately £[X]. Does this feel right?" | About right · Seems high · Seems low |

### If no bank statements — estimates from scratch

| # | Question | Form E category | Skip? |
|---|----------|----------------|-------|
| 1 | "How much is your mortgage or rent per month?" | Housing | Yes |
| 2 | "How much do you spend on council tax?" | Council tax | Yes |
| 3 | "Roughly how much on utilities (gas, electric, water)?" | Utilities | Yes |
| 4 | "How much on groceries per month?" | Food | Yes |
| 5 | "Transport costs (fuel, car insurance, public transport)?" | Transport | Yes |
| 6 | "Childcare or school costs?" | Children | Yes |
| 7 | "Any other regular costs you want to record?" | Other | Yes |

**Note:** "These are rough estimates. When you upload bank statements, we'll replace these with real figures."

---

## 7. LIFE AFTER SEPARATION (prompted at Draft fidelity)

**Form E sections:** Part 3 (Income needs), Part 4 (Standard of living narrative)

Only prompted when the user has at least a Draft-level picture. This is forward-looking.

### Standard of living (Part 4)

| # | Prompt | Response type | Form E field |
|---|--------|--------------|-------------|
| 1 | "Describe your housing during the marriage" | Text: "3-bed semi, owned jointly" | Part 4 |
| 2 | "How many holidays did you take per year?" | None · 1 UK · 1 abroad · 2+ abroad | Part 4 |
| 3 | "Did your children attend private school?" | Yes · No · N/A | Part 4 |
| 4 | "Did you have domestic help (cleaner, gardener, etc.)?" | Yes · No | Part 4 |
| 5 | "Any club memberships (gym, golf, social)?" | Yes → describe · No | Part 4 |
| 6 | "How would you describe your lifestyle during the marriage?" | Modest · Comfortable · Affluent · We lived beyond our means | Part 4 |

### Income needs (Part 3)

| # | Question | Options | Form E field |
|---|----------|---------|-------------|
| 1 | "Where do you plan to live after separation?" | Stay in family home · Rent locally · Buy somewhere · Move in with family · Not sure | Part 3 |
| 2 | "Do you expect your income to change?" | Stay the same · Increase (returning to work, promotion) · Decrease (reducing hours, retiring) · Not sure | Part 3 |
| 3 | "Are there any significant future expenses you're aware of?" | Children's university · Medical needs · Car replacement · None · Other | Part 3 |

---

## Common rules across all wizard flows

1. **Every question is skippable** unless marked otherwise. "I don't know" and "I'll come back to this" are always valid responses.
2. **Skipped questions are marked TBC** on the hub section cards with a count: "3 questions to revisit."
3. **Estimates are always labelled** — "(Your estimate)" appears next to every value not backed by evidence.
4. **The wizard remembers previous answers** — if the user comes back to a section, they see what they entered before and can update or continue from where they left off.
5. **No duplicate questions** — if a bank statement already told us mortgage is £1,150/month, the property wizard does not ask again. It shows: "Mortgage: £1,150/month (from your bank statements)" as pre-filled.
6. **Progressive disclosure within sections** — start with the essential questions. Follow-up questions only appear based on answers. A user who says "No mortgage" never sees mortgage follow-ups.
