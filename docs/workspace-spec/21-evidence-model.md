# Evidence Model — What Bank Data Proves

**Companion to:** Spec 20 (bank-first journey)
**Purpose:** Maps bank transaction data to Form E sections. Defines what bank data proves directly, what it infers, and what still requires documents. Drives the gap analysis system and revised fidelity thresholds.

---

## 1. Evidence strength tiers

| Tier | Meaning | Example |
|------|---------|---------|
| **Proved** | Bank data is direct evidence. No document needed. | Account balance, transaction history, net salary deposits |
| **Inferred** | Bank data strongly suggests but doesn't formally prove. Confirm with user, no document needed. | "£1,150/month to Halifax" → likely mortgage |
| **Gap** | Bank data signals existence but a specific document is needed for formal disclosure. | Pension contributions visible → CETV still required |
| **Invisible** | Bank data has no signal. Config or manual input required. | Property value, gross salary, ownership splits |

---

## 2. Form E section mapping

### Income (2.15–2.20)

| Signal | Tier | What bank shows | What's still needed |
|--------|------|-----------------|---------------------|
| Salary deposits | **Proved** | Net amount, frequency, employer name | Gross pay detail (payslips) |
| Benefits (Child Benefit, UC) | **Proved** | Amount, frequency, HMRC as source | Nothing — bank data is sufficient |
| Dividends | **Proved** | Amount, company name, frequency | Business accounts if self-employed |
| Rental income | **Inferred** | Regular deposits from individuals/agents | Tenancy agreement for formal disclosure |
| Self-employment income | **Inferred** | Irregular deposits, client payments | SA302, tax returns |

**Fidelity impact:** Bank data alone → Draft (net income proved). Payslips needed → Evidenced (gross/tax/NI detail).

### Accounts (2.3, 2.4)

| Signal | Tier | What bank shows | What's still needed |
|--------|------|-----------------|---------------------|
| Connected account | **Proved** | Balance, full 12-month history | Nothing |
| Transfers to savings | **Inferred** | Regular transfers to other accounts | Connect additional accounts or upload statements |
| ISA/investment platforms | **Inferred** | Payments to Hargreaves Lansdown, Vanguard, etc. | Latest valuation statement |

**Fidelity impact:** Connected accounts → Evidenced for those accounts. Other accounts revealed by transfer patterns → Gap (connect or upload).

### Spending (3.1)

| Signal | Tier | What bank shows | What's still needed |
|--------|------|-----------------|---------------------|
| All categories | **Proved** | 12-month categorised spend across all Form E 3.1 budget lines | Nothing — bank data is the gold standard for spending evidence |

**Fidelity impact:** Bank data alone → Evidenced. This is the single strongest section for bank-first. 12 months of categorised transactions is more comprehensive than any PDF statement.

### Property (2.1, 2.2)

| Signal | Tier | What bank shows | What's still needed |
|--------|------|-----------------|---------------------|
| Mortgage payments | **Inferred** | Lender, monthly amount | Mortgage redemption statement (balance, rate, terms, ERCs) |
| Council tax | **Inferred** | Borough/band (inferrable from amount) | Nothing for disclosure |
| Buildings insurance | **Inferred** | Provider, annual amount | Nothing for disclosure |
| Property value | **Invisible** | No signal | 3 estate agent valuations or RICS survey |
| Ownership split | **Invisible** | No signal | User confirmation (config or Q&A) |

**Fidelity impact:** Bank data → Draft (existence and monthly cost proved). Mortgage statement + valuation → Evidenced.

### Pensions (2.13)

| Signal | Tier | What bank shows | What's still needed |
|--------|------|-----------------|---------------------|
| Personal contributions | **Inferred** | Payments to pension providers (Aviva, Scottish Widows, etc.) | CETV letter — no alternative |
| Workplace pension | **Invisible** | Deducted at source, not visible in bank | Payslip (shows contribution) + CETV |

**Fidelity impact:** Bank data → Sketch (existence inferred). CETV → Evidenced. Pensions are the biggest gap in bank-first.

### Debts (2.14)

| Signal | Tier | What bank shows | What's still needed |
|--------|------|-----------------|---------------------|
| Credit card payments | **Proved** | Provider, monthly payment amount | Credit card statement for outstanding balance |
| Loan repayments | **Proved** | Provider, monthly amount | Loan agreement for total outstanding, rate, term |
| BNPL | **Proved** | Provider, amounts | Nothing for most |
| Overdraft | **Proved** | Overdraft usage visible in balance | Nothing |
| Student loan | **Proved** | SLC deductions visible | Nothing |

**Fidelity impact:** Bank data → Draft (regular payments proved). Statements for outstanding balances → Evidenced.

### Business (2.10, 2.11, 2.16)

| Signal | Tier | What bank shows | What's still needed |
|--------|------|-----------------|---------------------|
| Company dividends | **Inferred** | Payments from own company | Business accounts (2 years), company valuation |
| HMRC self-assessment | **Inferred** | Tax payments to HMRC | SA302, tax returns |
| Accountancy fees | **Inferred** | Payments to accounting firms | Nothing |

**Fidelity impact:** Bank data → Sketch (signals existence). Business accounts + tax returns → Evidenced.

### Other signals

| Signal | Tier | Section |
|--------|------|---------|
| Child benefit amount | **Proved** | Number of children inferrable from amount |
| Childcare payments | **Proved** | Nursery/childminder costs for 3.1 |
| School fees | **Proved** | Private education costs for 3.1 |
| Gambling transactions | **Inferred** | Red flag for disclosure |
| Large unexplained transfers | **Inferred** | Red flag — potential undisclosed assets |
| Crypto exchange deposits | **Inferred** | Other assets (2.4–2.9) |
| Car finance | **Proved** | Debts (2.14) |
| Overseas transfers | **Inferred** | Potential overseas assets (2.2) |

---

## 3. Revised fidelity thresholds

| Level | Current criteria (spec 17) | Revised criteria |
|-------|---------------------------|------------------|
| **Sketch** | Config only, no evidence | Config only, no bank connection, no documents |
| **Draft** | At least one document, core sections have data | Bank connected OR 1+ document processed. Income + spending + accounts have data. |
| **Evidenced** | Most sections evidenced, 6+ months statements, CETV requested | Bank connected + gap documents uploaded (pension CETV, property valuation, mortgage statement, payslips). All sections have direct evidence. |
| **Locked** | All complete | All sections confirmed and evidenced. No outstanding questions. |

**Key change:** Bank connection alone qualifies for **Draft**. A single bank connection provides income + spending + accounts in seconds — enough for a first mediation conversation. Previously this required uploading and processing multiple PDF statements.

---

## 4. Gap analysis engine

After bank data is processed, the system generates a specific gap list by comparing what bank data proved/inferred against what Form E requires for Evidenced fidelity.

### Gap detection rules

```
IF bank shows mortgage payments AND no mortgage statement uploaded
  → Gap: "Mortgage statement from {lender}" (reason: balance, rate, terms)

IF bank shows pension contributions AND no CETV uploaded
  → Gap: "Pension CETV from {provider}" (reason: formal valuation required)

IF employment is employed AND no payslips uploaded
  → Gap: "3 recent payslips from {employer}" (reason: gross pay, tax, NI)

IF config says owns property AND no valuation uploaded
  → Gap: "Property valuation" (reason: market value for disclosure)

IF bank shows credit card payments AND no credit card statement uploaded
  → Gap: "Credit card statement from {provider}" (reason: outstanding balance)

IF bank shows transfers to savings AND savings account not connected
  → Gap: "Connect {provider} savings account or upload statement"
```

### Gap priority

Gaps are ordered by disclosure importance:
1. Pension CETVs (months to obtain, start early)
2. Property valuations (weeks to arrange)
3. Mortgage statements (days to obtain)
4. Payslips (usually to hand)
5. Credit card / loan statements (days to obtain)
6. Additional account statements (connect or upload)

### Gap messaging

Each gap includes:
- **What:** the specific document
- **From whom:** the provider (inferred from bank data)
- **Why:** what it adds that bank data can't provide
- **How long:** typical time to obtain
- **Help:** link to guidance where relevant (especially CETV requests)

---

## 5. Section card evidence indicators

### New visual element: source badge

Each item in a section card shows its evidence source:

| Source | Badge | Colour |
|--------|-------|--------|
| Bank verified | `Bank verified` | `green-600` text, no background |
| Document uploaded | `From {document}` | `ink-tertiary` text |
| Your estimate | `Your estimate` | `amber-600` text |
| Inferred | `Confirm?` | `blue-600` text, clickable |

**Bank verified** items do not need the source badge on every line — a single "via Barclays Open Banking" note at the section level is sufficient. Individual items only need badges when mixing sources (e.g., income section has bank-verified salary + uploaded payslip gross detail).

### Section card after bank connection — example

```
Income                                    Manually input
£3,218 net/month from ACME Ltd            Bank verified
Child Benefit: £96.25/month from HMRC     Bank verified
                                          ──────────
                                          Upload payslips for
                                          gross pay breakdown
                                          Review details →
```

The gap prompt appears inline in the section card, specific to what's missing for that section.
