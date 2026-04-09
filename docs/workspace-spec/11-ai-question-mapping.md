# AI Question Mapping — Domain by Domain

For each domain: what documents feed it, what the AI looks for, what signals trigger what questions, and what the branching logic is.

---

## 1. CURRENT ACCOUNT

### Documents
- 12 months bank statements (PDF)
- Multiple statements for same account acceptable

### What the AI extracts
- Account holder name(s)
- Account type (current, joint indicator)
- Sort code / account reference
- Opening and closing balances
- All transactions with dates, descriptions, amounts
- Regular deposits (income signals)
- Regular outgoings (commitment signals)
- Spending categorisation

### AI Analysis Domains

#### 1a. Income Detection

**Signals → Questions:**

| Signal | Finding text | Question | Options |
|--------|-------------|----------|---------|
| Regular deposit, same amount, monthly | "Regular deposit of £X from [EMPLOYER] — appears to be employment income" | "Is this your main employment income?" | Yes / No, I have other income / This isn't employment income |
| Regular deposit, same amount, labelled HMRC/DWP | "Government payment of £X detected — appears to be benefits" | "What type of benefit is this?" | Child benefit / Universal Credit / Tax credits / Other / I'm not sure |
| Regular deposit, varying amounts | "Income deposits vary between £X and £Y" | "Why does your income vary?" | Commission/bonus / Variable hours / Self-employment / Seasonal work / Multiple sources |
| Very low or no regular income (< £800/mo) | "We found limited regular income in this account" | "What's your employment situation?" | Employed (paid into different account) / Between jobs / Full-time parent / On benefits / Self-employed |
| Multiple regular deposits from different sources | "Multiple income sources detected" | "Tell us about these income sources" | Show each detected source → confirm/classify each |
| Large irregular deposits | "Occasional large deposits detected (e.g., £X on [date])" | "What are these?" | Bonus / Gift / Savings transfer / Sale proceeds / I don't know |
| No income detected at all | "No regular income deposits found" | "Is your income paid into a different account?" | Yes, different account / I'm not currently earning / My partner supports me / Benefits paid elsewhere |

**Branching:**
- "This isn't employment income" → "What is it?" → Rental / Investment / Maintenance received / Other
- "Self-employment" → FLAG: "Self-employment detected. We'll need business accounts and tax returns for a complete picture." → Add to checklist
- "I have other income too" → "What other income?" → Classify → "We'll look for this in other documents you upload"

#### 1b. Account Structure

| Signal | Finding | Question | Options |
|--------|---------|----------|---------|
| Two names on statement | "This appears to be a joint account" | "Is this a joint account?" | Yes / No, it's sole |
| Single name | "Account in your name only" | No question needed — auto-classify as "Yours" | — |
| Transfers to/from named accounts | "Regular transfers to account [ref]" | "What account is this transfer going to?" | My savings / Joint savings / Partner's account / Child's account / Other |
| Multiple sort codes referenced | "Transfers to accounts at [Bank1] and [Bank2] detected" | "Do you have accounts at these banks?" | Yes, they're mine / Some are mine, some are my partner's / I don't know |

#### 1c. Spending Analysis

| Signal | Finding | Question | Options |
|--------|---------|----------|---------|
| Large regular housing payment | "Monthly payment of £X to [payee] — likely housing" | "Is this your mortgage or rent?" | Mortgage / Rent / Board (living with family) / Something else |
| Childcare payments detected | "Regular payments to [nursery/childminder]" | "Is this for your children's childcare?" | Yes / No / Partially (shared cost) |
| School fee payments | "Payments to [school name] detected" | "Are these school fees for your children?" | Yes, private school / No / These are activity fees |
| Insurance payments (multiple) | "Multiple insurance payments detected" | "Can you confirm these are correct?" → Show list | Confirm each / Flag incorrect ones |
| Subscription services | "Subscriptions: £X/mo across Y services" | No question — auto-categorise. Show for review. | — |
| Very high discretionary spending | "Eating out and entertainment averaging £X/mo" | No question — note for Form E "standard of living" | — |
| Council tax detected | "Council tax payments of £X/mo" | No question — auto-categorise | — |

#### 1d. Commitments Detection

| Signal | Finding | Question | Options |
|--------|---------|----------|---------|
| Loan repayments | "Monthly payment of £X to [lender]" | "Is this a personal loan?" | Yes, my loan / Yes, joint loan / No, it's something else |
| Credit card payments | "Credit card payment of £X to [provider]" | "Do you have a balance on this card?" | Yes, approximately £[input] / No, I pay in full / I don't know |
| Car finance | "Vehicle finance payment of £X" | "Is this for your car?" | Yes, my car / Yes, joint car / It's for someone else |
| Child maintenance payments going OUT | "Regular payment of £X to [person] — possible maintenance" | "Is this a child maintenance payment?" | Yes / No / It's informal support |
| Spousal maintenance going OUT | "Regular payment to [person]" | "Is this maintenance to your ex/partner?" | Yes / No / It's a shared expense |

#### 1e. Anomalies

| Signal | Finding | Question | Options |
|--------|---------|----------|---------|
| Large one-off transfer (> £2,000) | "Unusual transfer of £X on [date]" | "Do you know what this was?" | Savings transfer / Paying for something specific / Gift / I don't know / I'd rather not say |
| Sudden drop in income | "Income dropped from £X to £Y in [month]" | "Did your income change?" | Job change / Reduced hours / Redundancy / Sick leave / Other |
| Sudden increase in spending | "Spending increased significantly in [month]" | "Did something change?" | Moving costs / Separation-related / Emergency / Normal variation |
| Payments to legal professionals | "Payment to [solicitor/mediator name]" | No question — note that process may be underway | — |
| Cash withdrawals significantly higher than average | "Cash withdrawals averaging £X/mo" | "Is this unusual for you?" | Normal for me / Higher than usual / I don't know |
| Transfers to unknown/new accounts starting recently | "New regular transfer of £X started [month]" | "What is this new regular payment?" | New account of mine / Payment to someone / I'd rather not say |

#### 1f. Gaps

| What's missing | Finding | Question | Options |
|----------------|---------|----------|---------|
| No pension contributions visible | "No pension contributions detected in this account" | "Do you have a workplace pension?" | Yes, deducted from salary / Yes, paid from another account / No / I don't know |
| No savings transfers | "No transfers to savings accounts detected" | "Do you have savings accounts?" | Yes, I'll upload those separately / No savings / Partner manages savings |
| No maintenance received | "No maintenance payments received" | "Are you receiving child or spousal maintenance?" | Yes, into another account / No / We haven't agreed this yet |
| Only one account visible | "We've only seen one account" | "Do you have any other accounts?" | Yes, I'll upload those / No, this is my only account / My partner manages others |
| No evidence of partner's income | "No information about your partner's income" | "Do you know your partner's income?" | Yes, approximately £[input]/mo / I have a rough idea / I don't know / They won't share |

---

## 2. SAVINGS & ACCOUNTS

### Documents
- Savings account statements
- ISA statements
- Premium bonds certificates
- Investment platform statements

### AI Analysis

| Signal | Finding | Question | Options |
|--------|---------|----------|---------|
| Account detected | "Savings account at [provider]: £X" | "Is this account in your name or joint?" | Mine / Joint / Partner's |
| Interest earned | "Interest earned: £X over period" | No question — auto-note | — |
| ISA detected | "ISA with balance of £X" | "Is this a Cash ISA or Stocks & Shares ISA?" | Cash / Stocks & Shares / Lifetime ISA / I'm not sure |
| Regular deposits into savings | "Regular deposits of £X/mo" | "Is this still being funded?" | Yes / No, I've stopped / It varies |
| Large withdrawal from savings | "Withdrawal of £X on [date]" | "What was this withdrawal for?" | Spent it / Transferred elsewhere / Separation-related costs / Other |
| Premium bonds | "Premium Bonds holding of £X" | "Are these in your name or joint?" | Mine / Joint / Partner's |
| Investment platform | "Investment portfolio valued at £X" | "Are these investments in your name?" | Yes / Joint / Mix of both |
| No savings found | — | "Do you have any savings or investment accounts?" | Yes, I'll upload / No / Partner manages this |

---

## 3. PROPERTY

### Documents
- Property valuation / estate agent appraisal
- Mortgage statement / redemption statement
- Land registry documents
- Rental income statements (if buy-to-let)

### AI Analysis (mostly wizard, less document-dependent)

| Signal/Question | Finding | Question | Options |
|-----------------|---------|----------|---------|
| From V1: owns property | "You mentioned owning property" | "How many properties do you own?" | 1 (family home) / 2 / 3+ |
| Per property | — | "What type of property is this?" | Family home / Buy-to-let / Holiday home / Inherited / Other |
| Ownership | — | "Whose name is this property in?" | Joint names / My name only / Partner's name only |
| Value | — | "What's the approximate value?" | £[input] + confidence (Known/Estimated/Unknown) |
| Value evidence | — | "Do you have a recent valuation?" | Yes, I'll upload it / I have estate agent estimates / No / I'll get one |
| Mortgage | — | "Is there a mortgage on this property?" | Yes / No (owned outright) |
| Mortgage details | — | "Mortgage balance?" | £[input] + "Monthly payment?" £[input] + "Lender?" [text] |
| Joint mortgage | — | "Is the mortgage in joint names?" | Yes / My name only / Partner's name only |
| Equity calculation | System calculates | "Based on your estimates, the equity is approximately £X" | Confirm / That doesn't seem right |
| Additional charges | — | "Are there any other charges on this property?" | No / Yes (e.g., second charge, charging order) |
| Rental income (if BTL) | — | "Does this property generate rental income?" | Yes, £[input]/mo / No / Between tenants |
| Inherited property | — | "Was this property inherited?" | Yes → FLAG: may be treated differently in settlement |
| Pre-marital property | — | "Did you own this before the marriage?" | Yes → FLAG: may be treated differently |

---

## 4. PENSIONS

### Documents
- CETV letter
- Annual pension statement
- State pension forecast
- PODE report (if obtained)

### AI Analysis

| Signal | Finding | Question | Options |
|--------|---------|----------|---------|
| Pension type detected | "Pension with [provider]" | "What type of pension is this?" | Workplace (employer) / Personal / SIPP / State pension / I don't know |
| DB vs DC | If DB detected | "This appears to be a defined benefit (final salary) pension" | Confirm / I'm not sure |
| CETV provided | "CETV: £X as at [date]" | "Is this the most recent CETV you have?" | Yes / No, I have a newer one / I'm waiting for an updated one |
| No CETV | "No CETV value found" | "Have you requested a CETV?" | Yes, waiting / No, I haven't / I don't know what a CETV is |
| CETV explanation | — | "A CETV is how pensions are valued for divorce. Would you like to know more?" | Yes → explain / I understand |
| DB pension warning | "Defined benefit pensions are often worth more than the CETV suggests" | "Would you like guidance on this?" | Yes → explain DB vs CETV / I already understand |
| Multiple pensions | "You may have pensions from previous employers" | "Do you have any other pensions?" | Yes, I'll add them / No / I'm not sure → guidance on tracing |
| Pension contributions from payslip | "Your payslip shows pension contributions of £X/mo" | "Is this going to the pension listed above?" | Yes / No, different pension / I don't know |
| Partner's pension | — | "Do you know about your partner's pension(s)?" | Yes, I know details / I know they have one but no details / I don't know / They won't share |
| State pension | — | "Have you checked your state pension forecast?" | Yes / No → link to gov.uk check |
| SIPP contributions | "SIPP contributions detected" | FLAG: "SIPP contributions reduce declared income but are considered in settlement" | Noted |

---

## 5. DEBTS & LIABILITIES

### Documents
- Credit card statements
- Loan agreements/statements
- Store card statements
- BNPL records

### AI Analysis

| Signal | Finding | Question | Options |
|--------|---------|----------|---------|
| Credit card detected | "Credit card with [provider]" | "What's the current balance?" | £[input] / I don't know / I'll upload a statement |
| Joint or sole | — | "Is this card in your name or joint?" | Mine / Joint / Authorised user on partner's card |
| Loan detected | "Loan with [provider]: £X outstanding" | "Is this a personal loan?" | Yes, mine / Joint loan / Partner's loan / Car finance / Other |
| BNPL detected | "Buy Now Pay Later payment detected" | "Do you have any outstanding BNPL balances?" | Yes, approximately £[input] / No, all paid / I'm not sure |
| Overdraft | "Account appears to be overdrawn by £X" | "Do you regularly use your overdraft?" | Yes / Sometimes / Rarely / This is unusual |
| Student loan | "Student loan repayment detected" | "Do you have an outstanding student loan?" | Yes / No, it's paid off / This is something else |
| Debt to family | — | "Do you owe money to family or friends?" | Yes, approximately £[input] / No |
| Tax debts | — | "Do you owe any tax (income tax, council tax arrears)?" | Yes / No / I'm not sure |
| Gambling transactions | If detected | Handled sensitively — no direct question. Note for awareness. | — |

---

## 6. OTHER INCOME

### Documents
- Benefit letters
- Rental income records
- Maintenance received records
- Freelance/side income evidence

### AI Analysis

| Signal | Finding | Question | Options |
|--------|---------|----------|---------|
| Benefits detected (from bank) | "Government payments detected" | "What benefits do you receive?" | Checklist: Universal Credit / Child Benefit / Tax Credits / PIP / ESA / Housing Benefit / Other |
| Rental income | "Rental income of £X/mo detected" | "Is this from a property you own?" | Yes → link to property section / No, other arrangement |
| Maintenance received | "Regular payment from [person]" | "Is this child or spousal maintenance?" | Child maintenance / Spousal maintenance / Both / Neither |
| Freelance income | Irregular deposits from multiple sources | "Do you do freelance or contract work?" | Yes / Occasionally / No |

---

## 7. OTHER ASSETS

### No primary document — wizard-driven

| Question flow | Options |
|--------------|---------|
| "Do you own a vehicle?" | Yes → Make, model, approximate value, finance? / No |
| "Do you have any valuable items? (jewellery, art, collections worth over £500)" | Yes → describe + approximate value / No |
| "Do you have any cryptocurrency?" | Yes → approximate value / No / I'm not sure of the value |
| "Do you have any other investments? (shares, bonds outside ISA)" | Yes → describe + approximate value / No |
| "Are there any other assets we haven't covered?" | Yes → describe / No, that's everything |

---

## 8. BUSINESS (if self-employed)

### Documents
- Business accounts (2-3 years)
- SA302 tax calculations
- Company accounts (if Ltd)
- Tax returns

### AI Analysis

| Signal | Finding | Question | Options |
|--------|---------|----------|---------|
| Business structure | — | "What's your business structure?" | Sole trader / Limited company / Partnership / LLP |
| Business income vs personal | "Business profit: £X, Personal drawings: £Y" | "Is this the full picture of what you take from the business?" | Yes / I also take dividends / It's complicated |
| SIPP contributions | "SIPP contributions of £X detected" | FLAG: "These reduce your declared income but courts consider them" | Noted |
| Director's loan | "Director's loan account detected" | "What's the current balance?" | I owe the company / The company owes me / It's roughly balanced |
| Business valuation | — | "Has the business been valued?" | Yes → £[input] / No → "A forensic accountant may be needed" |
| Multiple businesses | — | "Do you have interests in any other businesses?" | Yes → details / No |
| Partner involved in business | — | "Is your partner involved in the business?" | Yes, they work in it / Yes, they're a shareholder / No |

---

## Cross-domain intelligence

After all relevant domains are analysed, the AI should look for cross-domain patterns:

| Pattern | Trigger | Response |
|---------|---------|----------|
| Income vs spending mismatch | Outgoings > income by significant margin | "Your spending exceeds your detected income. Are there other income sources, or are you drawing on savings?" |
| No mortgage but housing payment | Housing payment detected but no mortgage in property section | "You have a housing payment but haven't listed a mortgage. Is this rent?" |
| Pension contributions but no pension listed | Payslip shows pension deduction but no pension in pensions tab | "Your payslip shows pension contributions but we don't have your pension details yet" |
| Child-related spending but no children section | Childcare/school payments but children tab empty | "We noticed childcare payments. Would you like to add children's arrangements?" |
| Self-employment signals but no business tab | Variable income, no employer name | "Your income pattern suggests possible self-employment. Should we add a business section?" |
