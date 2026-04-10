# Extraction & Clarification Decision Tree — Document-Driven

**Supersedes:** `workspace-spec/11-ai-question-mapping.md` (retained for reference)
**Principle:** Every question must map to a Form E field. If the answer doesn't fill a disclosure value or change a disclosure decision, don't ask it.
**Context:** This spec drives the hero panel behaviour during upload → processing → clarification → playback.

---

## How this spec works

For each document type:
1. **What to extract** — the specific data points the AI must find
2. **What to auto-confirm** — items with enough confidence to show without asking (≥0.95)
3. **What to clarify** — questions the user must answer, mapped to Form E fields
4. **What to flag** — things the AI notices that need attention but aren't questions
5. **What gaps to surface** — things the AI expected but didn't find
6. **Form E field mapping** — every extraction maps to a specific section

---

## 1. BANK STATEMENTS (Current Account)

**Form E sections filled:** 2.3 (Accounts), 2.15–2.20 (Income), 3.1 (Expenditure)
**The most valuable single upload.** One bank statement can populate income, spending, and account details.

### Extract

| Data point | How detected | Form E field |
|-----------|-------------|-------------|
| Account holder name(s) | Statement header | 2.3 |
| Account number (last 4 digits) | Statement header | 2.3 |
| Account type (sole/joint) | One or two names on statement | 2.3 |
| Current balance (most recent) | Final closing balance | 2.3 |
| Statement period covered | First and last dates | Evidence completeness |
| Regular income deposits | Same source, consistent timing, consistent or similar amount | 2.15 |
| Income amount (net monthly) | Average or consistent deposit amount | 2.15 |
| Income source name | Deposit reference / originator | 2.15 |
| Government payments | HMRC, DWP, council references | 2.15–2.20 |
| Housing payment | Largest regular outgoing, monthly, to building society/landlord | 3.1 + 2.1 link |
| Regular commitments | Standing orders, direct debits | 3.1 |
| Spending by category | Grouped: groceries, transport, utilities, childcare, subscriptions, dining, personal | 3.1 |
| Monthly spending total | Sum of all outgoing categories | 3.1 |
| Transfers to other accounts | Regular transfers out to named accounts | 2.3 (other accounts exist) |

### Auto-confirm (show, don't ask)

These appear as "We found these" in the hero panel — the user sees them but taps nothing unless something is wrong.

| Item | Condition for auto-confirm | What user sees |
|------|---------------------------|----------------|
| Employment income | Same source, ≥3 months consistent, named employer | "Salary: £X/month from [Employer]" |
| Child Benefit | HMRC reference, matches known CB amounts (£25.60/£16.95 per child per week) | "Child Benefit: £X/month" |
| Account details | Clearly stated on statement | "[Bank] account ****[last 4], balance £X" |

### Clarify (one question per screen)

| Signal detected | Question | Options | Form E field | Why we ask |
|----------------|----------|---------|-------------|-----------|
| Large regular payment to building society/lender, 1st of month | "£X goes to [Halifax] each month. Is this your mortgage?" | Mortgage · Rent · Something else | 3.1 (expenditure) + link to 2.1 (property) | Distinguishes largest outgoing; if mortgage, links to property section |
| Regular payment to insurance/pension provider | "£X/month to [Aviva]. Is this a pension contribution or insurance?" | Pension · Life insurance · Home insurance · Car insurance · Other | 2.13 or 2.5 or 3.1 | Pension contributions are assets; insurance is expenditure |
| Joint account detected (two names) | "This account has two names. Is this a joint account with your partner?" | Yes, joint with partner · No, it's sole | 2.3 (ownership) | Joint accounts must declare ownership share |
| Regular payment to a person (standing order) | "£X goes to [J Smith] on the [15th] each month. What is this?" | Childcare · Rent to landlord · Maintenance payment · Loan repayment · Other: ___ | 3.1 or context-dependent | Standing orders to individuals could be many things — only a human knows |
| Varying income from same source | "Your income from [source] varies between £X and £Y. Is this commission, variable hours, or something else?" | Commission/bonus · Variable hours · Seasonal · Other | 2.15 (income type) | Variable income needs explanation for Form E — courts need to understand the pattern |
| Monthly spending categories generated | "We've categorised your monthly spending as roughly £X. Does this feel about right?" | That sounds right · Let me review the categories | 3.1 (total expenditure) | Spending total is a key Form E figure — user should sanity-check |
| Payments to crypto exchange (Coinbase, Binance, Kraken) | "We found payments to [Coinbase]. Do you hold cryptocurrency?" | Yes · No, I've sold it all · I'd rather not say right now | 2.4/2.9 (investments/other assets) | Crypto must be disclosed; Form E doesn't explicitly ask for it |

### Flag (no question, but surface to user)

| Signal | What user sees | Why |
|--------|---------------|-----|
| Payments to solicitor/mediator | "We noticed payments to [firm name]. It looks like you may already have legal support." | Context — don't ask, just note |
| Gambling transactions | "We noticed transactions with [betting company]." Handled with care — no judgement. | Relevant to Form E Part 4 (standard of living) and court assessment, but sensitive |
| Very high cash withdrawals | "Cash withdrawals averaging £X/month." | May indicate hidden spending or cash-based lifestyle — relevant to expenditure accuracy |
| School fees detected | "Payments to [school name]: £X/term" → auto-categorise as children/education | Children's expenditure for Form E 3.1 |
| Council tax detected | "Council tax: £X/month" → auto-categorise | Expenditure for Form E 3.1 |

### Gaps (expected but not found)

| What's missing | Question | Options | Why we ask |
|---------------|----------|---------|-----------|
| No pension contributions visible | "We didn't find pension contributions in this account. Are they deducted from your salary before it reaches your bank?" | Yes, deducted at source · No pension · Paid from another account · Don't know | Most workplace pensions are deducted pre-net-pay and won't show on bank statements |
| No council tax detected | "We didn't find council tax payments. Do you pay this from a different account?" | Different account · Included in rent · Don't pay council tax · Partner pays | Council tax is a standard expenditure item |
| No childcare payments (but user has children from V1) | "You have children but we didn't find childcare costs. Is childcare paid from another account or not applicable?" | Different account · Partner pays · No childcare costs · Children are older | Childcare is significant expenditure if applicable |
| Only 1–3 months provided | "You've provided [X] months of statements. For formal disclosure you'll need 12 months. This is enough for a first draft." | Upload more now · I'll add more later | Form E requires 12 months; partial is fine for draft fidelity |

### Statement completeness tracking

| Months provided | Fidelity | What we tell the user |
|----------------|----------|----------------------|
| 1–3 months | Sketch | "Enough for rough income and spending estimates. Patterns may not be accurate." |
| 4–6 months | Draft | "Good basis for mediation. Spending averages becoming reliable." |
| 7–11 months | Evidenced (partial) | "Strong picture. Close to disclosure-ready." |
| 12 months | Evidenced (complete) | "Full 12 months — meets Form E requirements for this account." |

---

## 2. PAYSLIP

**Form E sections filled:** 2.15 (Employment income — detailed breakdown)
**Quick, structured extraction.** 6–8 fields, all clearly formatted on every UK payslip.

### Extract

| Data point | Form E field |
|-----------|-------------|
| Employer name | 2.15 |
| Gross pay (this period) | 2.15 |
| Net pay (this period) | 2.15 |
| Tax deducted (this period) | 2.15 |
| Tax code | 2.15 |
| National Insurance (this period) | 2.15 |
| Pension contribution (employee) | 2.13 link |
| Student loan deduction | 2.14 (liability) |
| YTD gross | 2.15 (annual income calculation) |
| YTD tax | 2.15 |
| Pay period / date | Evidence dating |

### Auto-confirm

| Item | What user sees |
|------|---------------|
| All extracted fields | "From your [Employer] payslip: Gross £X, Net £X, Tax £X, NI £X, Pension £X" — shown as a clean summary card |

### Clarify

| Signal | Question | Options | Form E field |
|--------|----------|---------|-------------|
| Pension contribution detected | "Your payslip shows pension contributions of £X/month. Is this a workplace pension?" | Yes, workplace pension · Yes, personal pension · I'm not sure | 2.13 |
| If bank statement also uploaded | "Your payslip shows net pay of £X. This matches the deposits in your [Bank] account." | No question — just confirmation | Cross-document validation |
| If payslip net ≠ bank deposit (significant variance) | "Your payslip shows £X net, but your bank deposit is £Y. Is some of your pay going elsewhere?" | Savings deduction · Salary sacrifice · Payroll error · Other | 2.15 |
| Overtime/commission visible | "Your payslip includes £X in overtime/commission. Is this regular?" | Yes, most months · Sometimes · This was unusual | 2.15 (helps determine maintainable income) |

### Flag

| Signal | What user sees |
|--------|---------------|
| Benefits in kind (P11D items) | "Your payslip shows benefits in kind. These count as income for disclosure." |
| Salary sacrifice | "Salary sacrifice of £X detected. This reduces your gross pay but the benefit still counts as income." |

---

## 3. P60 / TAX RETURN (SA302)

**Form E sections filled:** 2.15–2.16 (Annual income confirmation)
**Validates annual income.** Cross-references with payslips and bank statements.

### Extract

| Data point | Form E field |
|-----------|-------------|
| Total pay / total income | 2.15 |
| Tax deducted | 2.15 |
| NI contributions | 2.15 |
| Employer name | 2.15 |
| Tax year | Evidence dating |
| Self-employment profit (SA302) | 2.16 |
| Dividend income (SA302) | 2.16 |
| Rental income (SA302) | 2.16 |

### Clarify

| Signal | Question | Options | Form E field |
|--------|----------|---------|-------------|
| Self-employment income on SA302 | "Your tax return shows self-employment profit of £X. Is this still your current income level?" | Yes, roughly the same · It's increased · It's decreased · I've stopped self-employment | 2.16 |
| Multiple income sources on SA302 | "Your tax return shows income from [X sources]. Are all of these current?" | Yes · Some have changed → which ones? | 2.15–2.16 |
| Dividend income | "Your tax return shows dividend income of £X. Is this from your own company?" | Yes, my company · No, investments · Both | 2.16 or 2.4 |

---

## 4. MORTGAGE STATEMENT

**Form E sections filled:** 2.1 (Property — mortgage details)
**Key property data.** Balance, payment, rate, term, early repayment charges.

### Extract

| Data point | Form E field |
|-----------|-------------|
| Lender name | 2.1 |
| Outstanding balance | 2.1 |
| Monthly payment | 2.1 + 3.1 |
| Interest rate(s) | 2.1 |
| Mortgage type (repayment/interest-only) | 2.1 |
| Term end date | 2.1 |
| Early repayment charge (if shown) | 2.1 |
| Property address | 2.1 |
| Account holder name(s) | 2.1 (joint/sole) |

### Auto-confirm

All fields above shown as summary card — mortgage statements are typically unambiguous.

### Clarify

| Signal | Question | Options | Form E field |
|--------|----------|---------|-------------|
| Joint mortgage detected | "This mortgage is in joint names. Is this correct?" | Yes · No, it's in my name only | 2.1 (ownership) |
| Multiple parts (fixed + variable) | "Your mortgage has [X] parts with different rates. We've captured all of them." | No question — show for review | 2.1 |
| If property value known from config | "Your mortgage balance is £X. You estimated the property at £Y. That suggests equity of roughly £Z." | That sounds right · The value might be different | 2.1 (equity calculation) |
| ERC detected | "There's an early repayment charge of £X until [date]. This is relevant if the property might be sold or remortgaged." | Noted | 2.1 |

### Flag

| Signal | What user sees |
|--------|---------------|
| Interest-only mortgage | "This is an interest-only mortgage. The balance won't reduce over time — only interest is being paid." |
| Mortgage in arrears | "The statement shows arrears of £X. This is a liability that needs to be disclosed." |

---

## 5. PENSION CETV LETTER

**Form E sections filled:** 2.13 (Pensions)
**Single high-value extraction.** One number, but with critical context.

### Extract

| Data point | Form E field |
|-----------|-------------|
| Pension scheme name | 2.13 |
| CETV value | 2.13 |
| CETV date | 2.13 |
| Pension type (DB/DC if stated) | 2.13 |
| Accrued annual pension (if DB) | 2.13 |
| Retirement age | 2.13 |
| Scheme membership dates | 2.13 |

### Clarify

| Signal | Question | Options | Form E field |
|--------|----------|---------|-------------|
| DB pension detected | "This is a defined benefit pension with a CETV of £X. The annual pension at retirement would be £Y/year. CETVs often understate the true value of DB pensions — would you like to understand why?" | Tell me more · I understand · Skip for now | 2.13 + education |
| DC pension detected | "This is a defined contribution pension valued at £X." | No question needed — straightforward | 2.13 |
| CETV over 12 months old | "This CETV is from [date] — over 12 months ago. You'll need an updated one for formal disclosure." | I'll request a new one · I have a newer one | 2.13 |
| CETV exceeds £100,000 | "Your pension CETV is £X. For pensions of this value, a specialist pension report (PODE) is usually recommended to ensure fair treatment in settlement. Cost is typically £1,500–£3,000, shared between parties." | Tell me more · I'll consider this · Not now | Advisory |
| Pension from payslip matches | "This pension matches the contributions we found on your payslip from [Employer]." | No question — confirmation | Cross-document |

### Flag

| Signal | What user sees |
|--------|---------------|
| NHS / Teachers / Police / Armed Forces scheme | "Public sector pensions often have longer CETV processing times. NHS can take 3–6 months, Teachers' has experienced 12+ month delays." |
| Pre-marital membership dates | "You joined this scheme before your marriage. The pre-marital portion may be treated differently in settlement." |

---

## 6. SAVINGS / INVESTMENT STATEMENT

**Form E sections filled:** 2.3 (Bank accounts), 2.4 (Investments)

### Extract

| Data point | Form E field |
|-----------|-------------|
| Provider name | 2.3 or 2.4 |
| Account type (savings/ISA/investment) | 2.3 or 2.4 |
| Current balance / value | 2.3 or 2.4 |
| Account holder(s) | 2.3 or 2.4 |
| Interest rate (if savings) | 2.3 |

### Clarify

| Signal | Question | Options | Form E field |
|--------|----------|---------|-------------|
| Account ownership unclear | "Is this [account type] in your name, joint, or your partner's?" | Mine · Joint · Partner's | 2.3/2.4 |
| ISA type unclear | "Is this a Cash ISA or Stocks & Shares ISA?" | Cash · Stocks & Shares · Lifetime · Not sure | 2.4 |
| Large recent withdrawal | "There's been a withdrawal of £X recently. Has this been spent or moved to another account?" | Spent · Moved to another account · Separation costs · Other | 2.3/2.4 (current value accuracy) |

---

## 7. CREDIT CARD STATEMENT

**Form E sections filled:** 2.14 (Liabilities)

### Extract

| Data point | Form E field |
|-----------|-------------|
| Provider | 2.14 |
| Outstanding balance | 2.14 |
| Credit limit | 2.14 |
| Minimum payment | 2.14 |
| Interest rate (APR) | 2.14 |
| Account holder | 2.14 |

### Clarify

| Signal | Question | Options | Form E field |
|--------|----------|---------|-------------|
| Card ownership | "Is this credit card in your name or joint?" | Mine · Joint · Partner's | 2.14 |
| Balance above £5,000 | "This card has a balance of £X. Is this typical, or has spending increased recently?" | Normal for me · Increased due to separation · Increased for other reasons | 2.14 |

---

## Cross-document intelligence

After multiple documents are processed, the system checks for patterns:

| Pattern | What it means | What user sees |
|---------|-------------|---------------|
| Payslip net = bank deposit amount | Income verified across sources | "Your payslip and bank statements agree — income confirmed at £X/month" |
| Payslip net ≠ bank deposit | Income discrepancy | Question about where the difference goes |
| Mortgage payment on bank = mortgage statement | Housing cost verified | "Mortgage payment of £X/month confirmed from both sources" |
| Pension contribution on payslip = pension scheme detected | Pension linked | "Pension contributions of £X/month going to [Scheme name]" |
| Income on SA302 ≠ income on bank statements | Possible undisclosed income or different tax year | "Your tax return shows £X annual income but your bank shows £Y. Which is more current?" |
| Spending > income significantly | Living beyond means | "Your spending exceeds your income by £X/month. Are you drawing on savings, borrowing, or receiving support?" |
| Transfers to unrecognised accounts | Possible undisclosed accounts | "Regular transfers to an account we haven't seen. Do you have another account you haven't uploaded yet?" |

---

## The "don't ask" list

These should NEVER be asked — they add no Form E value and waste the user's time:

| Don't ask | Why |
|-----------|-----|
| Starting/ending balances per statement period | Only the current/most recent balance matters for Form E 2.3 |
| Individual transaction confirmations | Confirm categories and totals, not line items |
| Arithmetic the system can calculate | If income is £3,218 × 12 = £38,616 annual, don't ask the user to confirm this |
| Things already answered in config | If they said "employed" in discovery, don't ask "are you employed?" again when processing a payslip |
| Spending on specific dates | "You spent £47.50 at Tesco on March 3rd" — irrelevant |
| Obvious categorisations | Tesco = groceries, Shell = transport, Netflix = subscriptions — auto-categorise, don't ask |
| Anything that requires financial expertise | "What's your mortgage LTV?" — calculate it, don't ask |
