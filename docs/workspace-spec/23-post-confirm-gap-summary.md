# Post-Confirmation Gap Summary

**Purpose:** After bank connect + confirmations, this is what's been answered and what's still needed. Reference for wireframing the "picture + gaps" screen.

---

## What bank data + confirmations prove (no document needed)

| Form E section | What's confirmed | How |
|---|---|---|
| **2.3** Bank accounts | Connected account balance + 12-month history | Bank data direct |
| **2.15** Net income | Amount, frequency, source | Salary deposits confirmed |
| **2.20** Benefits | Type, amount | HMRC/DWP deposits confirmed |
| **3.1** Spending | Complete 12-month categorised budget | Bank transactions |
| **3.1** Housing cost | Mortgage or rent amount | Payment confirmed |
| **3.1** Council tax | Amount, borough | LA payment auto-confirmed |
| **3.1** Childcare | Provider, amount | Payment auto-confirmed |
| **2.14** Overdraft | Facility and usage | Balance history |
| **2.14** Student loan | Payment amount | SLC auto-confirmed |

## What's confirmed but needs a document for formal disclosure

| Form E section | What we know | What's missing | Document needed | Typical time to obtain |
|---|---|---|---|---|
| **2.15** Gross income | Net amount from bank | Gross, tax, NI, pension deductions | 3 recent payslips | To hand |
| **2.1** Mortgage | Lender + monthly payment | Balance, rate, terms, ERCs | Mortgage statement | 1-3 days (online) |
| **2.1** Property value | Existence confirmed | Market value | 3 estate agent valuations | 1-2 weeks |
| **2.13** Pensions | Provider + contribution amount | CETV (formal valuation) | CETV letter | 6 weeks–12 months |
| **2.14** Credit cards | Provider + monthly payment | Outstanding balance, rate | Credit card statement | 1-3 days (online) |
| **2.14** Loans | Provider + monthly payment | Outstanding total, rate, term | Loan agreement | 1-3 days |
| **2.3** Other accounts | Existence (from transfers) | Balance + history | Connect account or upload | Minutes (connect) |

## What bank data can't see at all (wizard needed if applicable)

| Form E section | Information | How we get it |
|---|---|---|
| **2.1** Ownership split | Sole vs joint, percentage | Confirmation question |
| **2.2** Other properties | Buy-to-let, land, abroad | Confirmation question if mortgage detected; wizard if owned outright |
| **2.5** Life insurance surrender value | Surrender value (not death benefit) | Wizard + document |
| **2.8** Valuables >£500 | Jewellery, art, collections | Wizard |
| **2.9** Assets abroad | Type, country, value | Wizard (triggered if overseas transfers detected) |
| **2.10** Business valuation | Goodwill, assets, DLA | Wizard + business accounts |
| **Part 4** Standard of living | Narrative description | Wizard (at Draft fidelity) |

---

## The typical gap list after bank connect

For a **standard employed homeowner with a pension**, the gap list is:

1. **Pension CETV** from [provider] — start now, takes 6-8 weeks
2. **Property valuation** — 3 estate agent quotes, takes 1-2 weeks
3. **Mortgage statement** from [lender] — download from online banking
4. **3 recent payslips** from [employer] — for gross pay breakdown

That's 4 documents. Compare to the current approach: 8-15 document types presented as a wall of lozenges.

For a **renting, employed, no pension** user: **1 document** (payslips only).

For a **self-employed homeowner with pension and business**: 4 above + business accounts (2 years) + tax returns (2 years) = **6 documents**.

---

## Confirmation count by user profile

| Profile | Bank signals | Confirmations needed | Time |
|---|---|---|---|
| Employed, renting, no pension | 4-6 | 2-3 yes/no | ~30 seconds |
| Employed, homeowner, pension | 8-12 | 4-6 yes/no | ~60 seconds |
| Self-employed, homeowner, pension, business | 12-18 | 6-8 (incl. business structure) | ~90 seconds |
| Complex (multiple properties, overseas, crypto) | 15-25 | 8-12 | ~2 minutes |

Even the complex case is faster than the current 6-7 config screens because every question has context ("we can see £X to Y") rather than cold-start discovery.

---

## What the "picture + gaps" screen shows

### Proved sections (green ticks)
- Income: £3,218/month net from ACME Ltd
- Spending: £3,450/month across 11 categories
- Accounts: Barclays current ending 4521, £1,842
- Debts: Amex £89/month, car finance £245/month

### Partially proved (amber, gap noted inline)
- Property: Mortgage £1,150/month to Halifax _(upload mortgage statement for full terms)_
- Pensions: £200/month to Aviva _(request CETV — takes 6-8 weeks)_
- Income: Net proved _(upload payslips for gross breakdown)_

### Not yet visible (grey, wizard available)
- Property value _(arrange 3 estate agent valuations)_
- Life insurance _(if detected, wizard)_
- Other assets _(if signals found)_
