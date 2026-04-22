# Spec 30 — Signal Detection Engine

## Problem

The classification engine answers "what is this payee?" but not "what does this mean for Form E?" Pattern recognition — the layer that interprets classified data into disclosure signals — is currently buried across `confirmation-questions.ts`, `csv-parser.ts`, and `result-transformer.ts`. It's invisible, untestable, and not tweakable.

Real example from user's bank data: two credit streams from the same company. One is £3,200 on the 28th every month (salary). The other is £5,000 on irregular dates (dividends). The classification engine labels both "employment". But Form E treats them completely differently — salary is 2.15, dividends are 2.16 and trigger the business section.

## Architecture

```
Layer 1: Classification    "DD HALIFAX" → mortgage, £1,150
Layer 2: Signal detection   mortgage + £1,150 + 12 months → "mortgage detected, property section needed"
Layer 3: Questions          signal → "Is this your mortgage?" (only if ambiguous)
```

Layer 2 is what this spec covers.

## What is a signal?

A signal is a named pattern detected in the financial data, with visible reasoning.

```typescript
interface DetectedSignal {
  id: string
  name: string                    // "Regular salary detected"
  ruleId: string                  // "income.regular-salary"
  formEField: string              // "2.15"
  confidence: number              // 0-1
  evidence: SignalEvidence[]      // The transactions/patterns that matched
  reasoning: string               // Human-readable: "Same source, consistent amount ±2%, monthly, 12 occurrences"
  determination: string           // "Salary: £3,200/month from ACME Ltd"
  sectionKey: string              // "income" | "property" | etc.
  crossSectionImpacts: string[]   // ["triggers business section", "infer 2 children"]
  userOverride: string | null     // User's correction if they disagree
}

interface SignalEvidence {
  type: 'transaction' | 'pattern' | 'absence'
  description: string             // "12 credits from ACME LTD, avg £3,200"
  transactions?: { date: string; description: string; amount: number }[]
  metric?: { name: string; value: string }  // "variation: 2%", "frequency: monthly"
}
```

## Signal rules

Each rule is a named, inspectable function. Rules are grouped by Form E section.

### Income signals (Form E 2.15-2.20)

| Rule ID | Name | Pattern | Evidence needed |
|---|---|---|---|
| `income.regular-salary` | Regular salary | Same source, same amount ±5%, monthly, ≥3 months | Source, amount, count, variation % |
| `income.variable-salary` | Variable salary | Same source, varying amounts (>10% variation), monthly | Source, min/max/avg, count |
| `income.dividends` | Dividend income | Credits from a company, irregular timing OR round amounts (£1k, £5k), not matching salary pattern | Source, amounts, dates, regularity score |
| `income.own-company` | Own company income | Credits from company matching user's surname, OR both salary + irregular from same source | Source, surname match, dual-pattern |
| `income.benefits-hmrc` | HMRC benefits | Credits from HMRC, matches known benefit amounts (Child Benefit £25.60/£16.95 per child) | Source, amount, inferred children |
| `income.benefits-dwp` | DWP benefits | Credits from DWP | Source, amount |
| `income.pension-received` | Pension income | Credits from pension provider, regular | Source, amount |
| `income.rental` | Rental income | Regular credits from individual or letting agent | Source, amount, regularity |
| `income.maintenance` | Maintenance received | Regular credits from individual, consistent amount | Source, amount |
| `income.none-visible` | No income detected | Absence: no regular credits ≥£500/month | (absence signal) |

### Property signals (Form E 2.1-2.2)

| Rule ID | Name | Pattern |
|---|---|---|
| `property.mortgage-detected` | Mortgage payment | Payment to known lender, £200-5000/month, recurring |
| `property.rent-detected` | Rent payment | Payment to lettings agent or housing association |
| `property.council-tax` | Council tax | Payment to local authority, £50-500/month |
| `property.no-housing` | No housing costs | Absence: no mortgage, rent, or council tax |

### Accounts signals (Form E 2.3-2.4)

| Rule ID | Name | Pattern |
|---|---|---|
| `accounts.transfers-out` | Transfers to other accounts | Regular transfers to unknown payees (savings, ISAs) |
| `accounts.investment-platform` | Investment detected | Payments to HL, Vanguard, Trading 212, etc. |
| `accounts.crypto` | Crypto detected | Payments to Coinbase, Binance, etc. |

### Pension signals (Form E 2.13)

| Rule ID | Name | Pattern |
|---|---|---|
| `pension.contribution-detected` | Pension contribution | Payments to pension provider |
| `pension.no-contribution` | No pension visible | Absence: no pension payments (workplace pensions deducted at source) |

### Debt signals (Form E 2.14)

| Rule ID | Name | Pattern |
|---|---|---|
| `debt.credit-card` | Credit card | Payments to Amex, Barclaycard, etc. |
| `debt.loan` | Loan repayment | Fixed payments to finance company |
| `debt.bnpl` | BNPL | Payments to Klarna, Clearpay |
| `debt.overdraft` | Overdraft | Balance goes negative |

### Red flag signals (Form E context, spec 22 §10)

| Rule ID | Name | Pattern |
|---|---|---|
| `flag.gambling` | Gambling pattern | Multiple gambling payees, frequency/amount trend |
| `flag.large-cash` | Large cash withdrawals | ATM withdrawals >£500 |
| `flag.sudden-stop` | Payment stopped | Regular payment that stops mid-period |
| `flag.large-transfer` | Unexplained large transfer | >£1,000 to unknown payee, not recurring |

### Cross-section inference signals

| Rule ID | Name | Pattern |
|---|---|---|
| `cross.children-from-benefit` | Children inferred | Child Benefit amount → number of children |
| `cross.business-from-dividends` | Business inferred | Dividends or HMRC SA → business section needed |
| `cross.property-from-council-tax` | Location inferred | Council tax payee → borough → property location |

## How rules work

Each rule is a pure function:

```typescript
interface SignalRule {
  id: string
  name: string
  section: string
  formEField: string
  detect: (data: SignalInput) => DetectedSignal | null
}

interface SignalInput {
  incomes: ExtractedIncome[]
  payments: DetectedPayment[]
  transactions: ParsedTransaction[]  // Raw, for date/amount pattern analysis
  accountMeta: { provider: string; isJoint: boolean; type: string }
  userSurname?: string               // For own-company detection
}
```

Rules are registered in an array. The engine runs them all and returns every signal detected. Order doesn't matter — each rule is independent.

## Salary vs dividend detection (the hard case)

This is the user's real problem. Current logic: `inferIncomeType()` checks keywords in the source name. "STRIPE" → self_employment, "SALARY" → employment. But it can't distinguish salary from dividends when both come from the same company.

### Proposed heuristics

**Salary pattern:**
- Consistent amount (variation <5%)
- Regular timing (25th-31st of month, ±3 days)
- ≥3 consecutive months
- Source contains "SALARY", "WAGES", "BGC", "BACS"

**Dividend pattern:**
- Round amounts (multiples of £100 or £1,000)
- Irregular timing (not monthly, or monthly but different day)
- Amount varies significantly between payments
- Source contains company name but NOT "SALARY"
- Often quarterly or semi-annual

**Own company indicator:**
- Same source sends both salary-pattern AND dividend-pattern payments
- Company name matches user's surname
- HMRC self-assessment payments also present (cross-signal)

**Confidence scoring:**
- Salary: high if consistent + "SALARY" keyword, medium if consistent but no keyword
- Dividend: high if round amounts + irregular, medium if regular but high variation
- Own company: high if surname match + dual pattern, medium if dual pattern alone

## Workbench: Signals tab

The workbench gets a new "Signals" tab showing every detected signal.

### Layout

**Signal cards** (one per detected signal):
```
┌─────────────────────────────────────────────┐
│ 🟢 Regular salary detected          [2.15] │
│ Rule: income.regular-salary                  │
│                                              │
│ Determination: Salary £3,200/month from      │
│ ACME CORPORATION LTD                         │
│                                              │
│ Reasoning:                                   │
│  • Same source: 12 occurrences               │
│  • Consistent amount: £3,200 (variation 0%)  │
│  • Regular timing: 28th of month (±0 days)   │
│  • Contains "SALARY" keyword                 │
│                                              │
│ Evidence: [expand to see 12 transactions]    │
│                                              │
│ [✓ Agree]  [✗ Disagree]  [Edit rule]        │
└─────────────────────────────────────────────┘
```

**Colour coding:**
- Green: high confidence (≥0.85), likely auto-confirm
- Amber: medium confidence (0.6-0.84), will ask a question
- Red: low confidence or red flag
- Grey: absence signal (something expected but not found)

**Disagree flow:**
User clicks "Disagree" → dropdown of alternatives → correction saved → signal re-evaluated → stats update.

**Edit rule flow (stretch):**
User clicks "Edit rule" → sees the rule parameters (e.g. "variation threshold: 5%") → can tweak → re-runs → sees impact. This is the "make it a tool" part.

### Stats bar

```
Signals: 14 detected | 8 high confidence | 3 medium | 1 red flag | 2 gaps
```

## File structure

```
src/lib/bank/signal-rules/
  types.ts              — Signal, SignalRule, SignalEvidence types
  income-rules.ts       — Income signal rules
  property-rules.ts     — Property signal rules
  accounts-rules.ts     — Accounts signal rules
  pension-rules.ts      — Pension signal rules
  debt-rules.ts         — Debt signal rules
  flag-rules.ts         — Red flag rules
  cross-rules.ts        — Cross-section inference rules
  engine.ts             — Runs all rules, returns DetectedSignal[]
  index.ts              — Exports everything
```

## Relationship to existing code

- `confirmation-questions.ts` currently does signal detection AND question generation in one pass. The plan: extract the signal detection into the new engine, keep question generation as a consumer of signals.
- `result-transformer.ts` KEYWORD_LOOKUP_TABLE handles classification-level pattern matching. Stays as-is.
- `csv-parser.ts` inferIncomeType() is a primitive version of income signal rules. Will be superseded by the signal engine for pattern work, but stays for basic classification.

## What this does NOT cover

- ML/AI classification (Level 3+ maturity — needs labelled data first)
- Ntropy integration into signals (good idea but separate)
- Persisting signals to Supabase (needs auth first)
- The user-facing confirmation flow changes (separate wireframe needed)

## Implementation priority

1. **Types + engine scaffold** — the SignalRule interface and runner
2. **Income rules** — salary vs dividend is the most impactful (user's real problem)
3. **Workbench signals tab** — make it visible and testable
4. **Property + debt rules** — straightforward, existing logic to extract
5. **Red flag rules** — high value for disclosure
6. **Cross-section rules** — the inference magic
7. **Disagree/override flow** — closes the correction loop
8. **Edit rule UI** — stretch goal, makes it a true tool
