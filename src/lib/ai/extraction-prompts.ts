// Document-type-specific extraction prompts
// Grounded in spec 13 (extraction decision tree) and Form E field mapping
// Each prompt tells the AI exactly what to look for in that document type

export const CLASSIFICATION_PROMPT = `You are classifying a UK financial document for someone going through separation/divorce.

Determine the document type from its content. Common types:
- bank_statement: Monthly account statements showing transactions, balances
- payslip: Employment payslip showing gross/net pay, tax, NI, deductions
- mortgage_statement: Annual or periodic mortgage statement showing balance, payments, rate
- pension_cetv: Pension valuation letter showing Cash Equivalent Transfer Value
- savings_statement: Savings account or ISA statement
- credit_card_statement: Credit card statement showing balance, transactions
- tax_return: SA302 tax calculation or self-assessment return
- p60: End of year certificate showing annual pay and tax
- business_accounts: Company or sole trader accounts
- property_valuation: Estate agent or surveyor property valuation
- unknown: Cannot determine

Return the document type, your confidence (0-1), the provider/institution name if visible, and a one-sentence description.`

export const BANK_STATEMENT_PROMPT = `You are analysing a UK bank statement for someone going through separation/divorce. Your analysis directly feeds their financial disclosure (Form E).

EXTRACT THE FOLLOWING — only from what is explicitly in the document:

1. ACCOUNT DETAILS
   - Provider name (the bank)
   - Last 4 digits of account number (if visible)
   - Account type: current, savings, or joint (look for two names on the statement)
   - Joint holder name (if visible)
   - Statement period (start and end dates)
   - Closing balance (the final balance shown)

2. INCOME DEPOSITS (Form E section 2.15-2.20)
   For each regular deposit pattern detected:
   - Source name (from the deposit reference)
   - Amount
   - Whether it's monthly/weekly
   - Your confidence that this is income (0-1)
   - Your reasoning: "Regular credit of £X from [source] on [date pattern]"
   - Type: employment (regular salary), benefits (HMRC/DWP), rental, self_employment (irregular amounts from varying sources), pension_income, maintenance, other

3. REGULAR PAYMENTS OUT (Form E sections 2.1, 2.13, 2.14, 3.1)
   For each regular outgoing detected:
   - Payee name
   - Amount
   - Frequency
   - Your confidence (0-1)
   - What you think it is: mortgage, rent, insurance, pension_contribution, childcare, loan_repayment, child_maintenance, utilities, council_tax, subscription, unknown
   - Your reasoning: explain WHY you think it's that category
   - Whether it needs clarification from the user (true if confidence < 0.95 or the category is ambiguous)
   - If it needs clarification: the question to ask and the options to offer

   CLARIFICATION RULES:
   - Regular payment to a building society/bank for £800+/month → likely mortgage, but ASK: "£X goes to [payee] each month. Is this your mortgage?" Options: ["Yes, it's my mortgage", "No, it's something else"]
   - Payment to an insurance/pension company → ASK: "£X/month to [company]. Is this a pension contribution or insurance?" Options: ["Pension", "Insurance", "Something else"]
   - Standing order to a person → ASK: "£X goes to [name] each month. What is this?" Options: ["Childcare", "Rent", "Maintenance payment", "Loan repayment", "Something else"]
   - DO NOT ask about obvious items: Tesco = groceries, Shell = transport, Netflix = subscription, council tax = council tax

4. SPENDING CATEGORIES (Form E section 3.1)
   Group ALL outgoing transactions into categories with monthly averages:
   - housing, utilities, groceries, transport, childcare, insurance, subscriptions, dining_out, personal, other
   - Calculate from ACTUAL transactions. Do not estimate or extrapolate.
   - Show transaction count per category

5. GAPS — things you expected but didn't find (max 3):
   - No pension contributions visible → "We didn't find pension contributions in this account. Are they deducted from your salary before it reaches your bank?"
   - No council tax → "We didn't find council tax payments. Do you pay this from a different account?"
   - Only one account visible → "Do you have any other bank accounts?"
   Each gap must include the Form E field it relates to.

6. NOTABLE TRANSACTIONS — flag unusual items:
   - Large one-off transfers (> £2,000)
   - Payments to solicitors or mediators
   - Payments to crypto exchanges (Coinbase, Binance, Kraken)
   - Gambling transactions
   - Sudden changes in income or spending patterns

CRITICAL RULES:
- ONLY extract values EXPLICITLY STATED in the document. Never invent values.
- Source descriptions must reference the actual document content.
- If joint account detected, note this — the user will need to confirm.
- Spending categories should be calculated from real transactions, not estimated.
- DO NOT extract starting balances, individual transaction dates, or per-transaction amounts unless they're notable.
- DO NOT ask questions about things that are obvious from the document.`

export const PAYSLIP_PROMPT = `You are analysing a UK payslip for someone going through separation/divorce. Your analysis feeds their financial disclosure (Form E section 2.15).

EXTRACT ALL of the following — every field that is printed on the payslip:

1. EMPLOYER: Company name
2. PAY PERIOD: Month/week covered
3. PAY DATE: Date of payment
4. GROSS PAY: Total before deductions (this period)
5. NET PAY: Take-home after all deductions (this period)
6. TAX DEDUCTED: Income tax this period
7. TAX CODE: e.g. 1257L
8. NATIONAL INSURANCE: NI contribution this period
9. PENSION CONTRIBUTION: Employee pension deduction (if shown)
10. STUDENT LOAN: Student loan repayment (if shown)
11. OTHER DEDUCTIONS: Any other deductions with labels and amounts
12. YTD GROSS: Year-to-date gross pay (if shown)
13. YTD TAX: Year-to-date tax paid (if shown)
14. OVERTIME/COMMISSION: Any variable pay component (if shown)
15. IS OVERTIME REGULAR: Is the overtime/commission a regular occurrence based on any YTD pattern?

CRITICAL RULES:
- Extract ONLY values explicitly printed on the payslip
- Every value must come from the document — never estimate
- If a field is not on the payslip, return null for that field
- Payslips are structured documents — every field should be clearly identifiable`

export const MORTGAGE_STATEMENT_PROMPT = `You are analysing a UK mortgage statement for someone going through separation/divorce. Your analysis feeds Form E section 2.1 (Property).

EXTRACT:
1. LENDER: Name of the mortgage provider
2. PROPERTY ADDRESS: If shown on the statement
3. ACCOUNT HOLDERS: All names listed (determines joint/sole)
4. IS JOINT: Whether the mortgage is in joint names
5. OUTSTANDING BALANCE: Current amount owed
6. MONTHLY PAYMENT: Regular payment amount
7. INTEREST RATE: Current rate (may be multiple parts)
8. RATE TYPE: Fixed, variable, tracker, or unknown
9. MORTGAGE TYPE: Repayment, interest-only, part-and-part, or unknown
10. TERM END DATE: When the mortgage ends
11. EARLY REPAYMENT CHARGE: Amount or percentage if shown
12. ERC END DATE: When the ERC expires
13. ARREARS: Any arrears amount
14. MULTIPLE PARTS: Whether the mortgage has multiple tranches
15. PARTS: If multiple parts, list each with balance, rate, and type

CRITICAL RULES:
- Many UK mortgages have multiple parts (e.g., a fixed-rate tranche and a variable tranche). Capture ALL parts.
- The outstanding balance is the key Form E figure — it determines equity when combined with property value.
- Early repayment charges are relevant if the property might be sold or remortgaged.
- Extract ONLY values explicitly stated in the document.`

export const PENSION_CETV_PROMPT = `You are analysing a UK pension CETV (Cash Equivalent Transfer Value) letter for someone going through separation/divorce. This feeds Form E section 2.13 (Pensions).

EXTRACT:
1. SCHEME NAME: Full name of the pension scheme
2. PROVIDER: The pension provider or administrator
3. PENSION TYPE: defined_benefit (final salary/career average), defined_contribution (money purchase), sipp, or unknown
4. CETV VALUE: The Cash Equivalent Transfer Value figure
5. CETV DATE: The date the CETV was calculated
6. ANNUAL PENSION AT RETIREMENT: If stated (typically for defined benefit schemes) — the annual pension income at normal retirement age
7. RETIREMENT AGE: Normal retirement age for this scheme
8. MEMBERSHIP START DATE: When the member joined the scheme
9. MEMBERSHIP END DATE: When membership ended (if applicable)
10. IS PUBLIC SECTOR: Whether this is a public sector scheme (NHS, Teachers, Police, Armed Forces, Civil Service)
11. SCHEME TYPE NAME: Specific scheme name if public sector (e.g., "NHS Pension Scheme", "Teachers' Pension Scheme")

CRITICAL RULES:
- The CETV is the single most important number — extract it precisely
- For defined benefit pensions, the annual pension figure is equally important
- Note whether this is public sector — processing times and complexity differ significantly
- If the letter mentions the CESS discount rate or McCloud remedy, note this
- Extract ONLY values explicitly stated in the document`

export const SAVINGS_STATEMENT_PROMPT = `You are analysing a UK savings or investment statement for someone going through separation/divorce. This feeds Form E sections 2.3 (Bank accounts) and 2.4 (Investments).

EXTRACT:
1. Provider name
2. Account type: savings, cash_isa, stocks_and_shares_isa, lifetime_isa, investment_fund, premium_bonds, other
3. Current balance or value
4. Account holder(s) — determines ownership (sole/joint)
5. Interest rate (if shown)
6. Any recent large withdrawals (date and amount)

Return as a bank_statement type with is_joint, provider, closing_balance, and any notable transactions.

CRITICAL RULES:
- For ISAs, distinguish between Cash ISA and Stocks & Shares ISA — they're different asset classes
- For investments, the current market value is what matters, not the amount originally invested
- Premium Bonds: the holding amount is the value (not the face value of individual bonds)
- Extract ONLY values explicitly stated in the document`

export const CREDIT_CARD_PROMPT = `You are analysing a UK credit card statement for someone going through separation/divorce. This feeds Form E section 2.14 (Liabilities).

EXTRACT:
1. Provider name
2. Outstanding balance
3. Credit limit
4. Minimum payment
5. Interest rate (APR)
6. Account holder(s) — sole or joint
7. Any notable purchases or payments

Return as a simple extraction with the key liability figures.

CRITICAL RULES:
- The outstanding balance is the key Form E figure — this is a liability
- Note whether the card is in sole or joint names
- Do not list individual transactions unless they're notable (>£500 or unusual)
- Extract ONLY values explicitly stated in the document`

// ═══ Prompt routing ═══

export function getExtractionPrompt(documentType: string): string {
  switch (documentType) {
    case 'bank_statement': return BANK_STATEMENT_PROMPT
    case 'payslip': return PAYSLIP_PROMPT
    case 'mortgage_statement': return MORTGAGE_STATEMENT_PROMPT
    case 'pension_cetv': return PENSION_CETV_PROMPT
    case 'savings_statement': return SAVINGS_STATEMENT_PROMPT
    case 'credit_card_statement': return CREDIT_CARD_PROMPT
    default: return BANK_STATEMENT_PROMPT // fallback to most comprehensive prompt
  }
}

export function getExtractionSchema(documentType: string) {
  // Dynamic import to avoid circular deps
  const schemas = require('./extraction-schemas')
  switch (documentType) {
    case 'bank_statement': return schemas.BANK_STATEMENT_SCHEMA
    case 'payslip': return schemas.PAYSLIP_SCHEMA
    case 'mortgage_statement': return schemas.MORTGAGE_STATEMENT_SCHEMA
    case 'pension_cetv': return schemas.PENSION_CETV_SCHEMA
    default: return schemas.BANK_STATEMENT_SCHEMA
  }
}
