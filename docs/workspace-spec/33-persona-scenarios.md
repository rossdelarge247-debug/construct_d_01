# Spec 33 — Persona Scenarios: Engine Validation

## Purpose

Five personas representing ~95% of users. For each: what they have, what signals should fire, what questions should be asked, what gaps remain. Validates the engine before building more.

---

## Persona 1: Emma — PAYE homeowner (~40% of users)

**Profile:** Employed full-time (PAYE), owns with mortgage (joint with partner), workplace pension (deducted at source), car on PCP finance, two children (ages 4 and 7), couple of holidays a year, Barclaycard credit card.

### What bank data shows
| Transaction pattern | Category | Confidence |
|---|---|---|
| £3,200/mo from ACME CORP SALARY | employment income | High |
| £96/4-weekly from HMRC CHILD BENEFIT | benefits income | High |
| £1,150/mo to HALIFAX MORTGAGE | mortgage | High |
| £185/mo to COUNCIL TAX | council_tax | High |
| £120/mo to BRITISH GAS | utilities | High |
| £48/mo to THAMES WATER | utilities | High |
| £42/mo to ADMIRAL INSURANCE | insurance | High |
| £485/mo to BMW FINANCIAL | loan_repayment | High |
| £600/mo to BRIGHT HORIZONS NURSERY | childcare | High |
| £85/mo to BARCLAYCARD | credit_card | High |
| £45/mo to SKY UK | subscription | High |
| £35/mo to VODAFONE | subscription | High |
| £16/mo to NETFLIX | subscription | High |
| ~£180/mo groceries (Tesco, Sainsbury) | groceries | High |
| ~£80/mo dining (Deliveroo, Costa) | dining | High |
| ~£55/mo fuel (Shell) | fuel | High |
| £1,800 to BOOKING.COM (one-off, July) | **unknown** | — |
| £2,400 to TUI HOLIDAYS (one-off, March) | **unknown** | — |
| £150 to HALFORDS (one-off) | **unknown** | — |

### Signals that should fire
| Signal | Fires? | Notes |
|---|---|---|
| `income.regular-salary` | **Yes** | SALARY keyword + consistent amount |
| `income.benefits-hmrc` | **Yes** | Infers 2 children from £96/4-weekly |
| `property.mortgage-detected` | **Yes** | Halifax = known lender |
| `property.council-tax` | **Yes** | Auto-confirms |
| `pension.no-contribution` | **Yes** | Workplace pension at source — correct absence signal |
| `debt.loan` | **Yes** | BMW Financial detected — asks "what type?" |
| `debt.credit-card` | **Yes** | Barclaycard detected |
| `flag.large-one-off` | **Should but doesn't exist yet** | £2,400 TUI, £1,800 Booking.com |

### Questions asked
| Question | Section | Exists? |
|---|---|---|
| "Is £3,200/mo from ACME your salary?" | income | Yes |
| "£96/mo HMRC confirmed" | income | Yes (auto-confirm) |
| "£1,150/mo to Halifax — your mortgage?" | property | Yes |
| Property value, mortgage balance, ownership, occupation | property | Yes |
| "Do you have a workplace pension?" | pensions | Yes (no-signal path) |
| Pension count, type (DB/DC), CETV status | pensions | Yes |
| "£485/mo to BMW Financial — what is this?" → car finance | debts | Yes |
| Car finance type (PCP/HP/lease) | debts | Yes |
| Credit card balance, sole/joint | debts | Yes |
| App-based accounts (Monzo, etc.)? | accounts | Yes |
| Closed accounts in 12 months? | accounts | Yes |

### Gaps for Emma
| Gap | Form E field | Priority |
|---|---|---|
| Car as asset (make, model, value, reg) | 2.6 | **P0** — finance detected but car not captured as asset |
| Holiday spending not categorised | 3.1 | **P1** — £4,200/yr invisible |
| Vehicle maintenance not categorised | 3.1 | **P1** — Halfords etc. |
| Insurance type (car vs home vs life?) | Multiple | **P2** — Admiral could be any |
| Personal belongings >£500 | 2.7 | **P2** — not asked |
| Life insurance | 2.5 | **P2** — not asked |
| Gifts/disposals in 12 months | 2.9 | **P2** — not asked |

---

## Persona 2: Tom — PAYE renter (~25% of users)

**Profile:** Employed, rents (letting agent), workplace pension at source, no car, one child, moderate lifestyle.

### Key differences from Emma
- Rent detected via keyword (Foxtons) or pattern (standing order, £400-4000, monthly)
- No car finance → no vehicle asset question needed
- Simpler property section (no equity calculation)
- Otherwise same signal coverage

### Signals that should fire
| Signal | Fires? |
|---|---|
| `income.regular-salary` | Yes |
| `property.rent-detected` | Yes (keyword or pattern path) |
| `property.council-tax` | Yes |
| `pension.no-contribution` | Yes |

### Gaps specific to Tom
- If rent is to a private landlord (not a letting agent), pattern-based detection fires at lower confidence. May need upfront "do you rent?" to boost.
- No vehicle questions asked — correct for Tom, but without upfront profiling we can't know he doesn't have one.

---

## Persona 3: Claire — Self-employed / director (~15% of users)

**Profile:** Limited company director, pays herself salary + dividends, HMRC Self Assessment, business expenses mixed with personal, rents, no children, crypto holdings.

### Key differences
- Variable income from Stripe/clients
- HMRC SA payments detected → self-employment signal fires
- Dividends look like irregular large credits from own company
- Business section triggered
- Crypto (Coinbase) detected → investment platform signal fires with crypto sub-detection

### Signals that should fire
| Signal | Fires? |
|---|---|
| `income.self-employment-signal` | Yes — Stripe + HMRC SA |
| `property.rent-detected` | Yes |
| `accounts.investment-platform` | Yes — Coinbase (crypto flag) |

### Gaps specific to Claire
| Gap | Priority |
|---|---|
| Director's loan account prompt | **P0** — most omitted Form E item for directors |
| Business valuation guidance | **P1** |
| Tax liability (outstanding HMRC) | **P1** — HMRC SA payments visible but balance unknown |
| Salary vs dividends separation | **P2** — engine sees both as self-employment income |

### Verdict
Claire needs **extra upfront questions** ("Are you self-employed or a director?") that unlock: business section, DLA prompt, tax return request, accountant contact prompt. Without profiling, the engine can only detect from bank patterns — which works for Stripe/HMRC but misses DLA entirely.

---

## Persona 4: Margaret — Retired (~10% of users)

**Profile:** State pension + Teachers pension + private pension (Aviva annuity), owns outright (no mortgage), ISA savings, life insurance, modest lifestyle.

### Signals that should fire
| Signal | Fires? |
|---|---|
| `income.benefits-dwp` | Yes — State Pension |
| Income from Teachers Pensions | Detected as pension_income type, but no specific signal rule for pension income (only contribution) |
| `property.no-housing` | Yes — no mortgage, no rent |
| `accounts.investment-platform` | Yes — HL ISA |
| `pension.no-contribution` | **Incorrectly fires** — she has pensions but receives them, doesn't contribute |

### Gaps specific to Margaret
| Gap | Priority |
|---|---|
| Pension income signal rule (receiving, not contributing) | **P1** — currently no rule for this |
| "Own outright" property path works but doesn't capture value | Works — asks property value in confirmation |
| Life insurance detection | **P2** — Legal & General could be life or other insurance |
| Pension as income vs pension as asset confusion | **P2** — she's drawing pensions (income) but they also have capital value (asset) |

---

## Persona 5: Aisha — Benefits recipient (~10% of users)

**Profile:** Part-time NHS (PAYE), Universal Credit, 3 children, shared ownership (housing association), NHS pension at source, Barclaycard, Klarna BNPL, joint account.

### Signals that should fire
| Signal | Fires? |
|---|---|
| `income.regular-salary` | Yes — NHS SALARY keyword |
| `income.benefits-hmrc` | Yes — infers 3 children |
| `income.benefits-dwp` | Yes — asks UC/PIP/ESA type |
| `property.mortgage-detected` | Depends — L&Q Housing Trust may classify as mortgage or unknown |
| `debt.credit-card` | Yes — Barclaycard |
| `debt.bnpl` | Yes — Klarna |
| `pension.no-contribution` | Yes — NHS pension at source |

### Gaps specific to Aisha
| Gap | Priority |
|---|---|
| Shared ownership detection | **P1** — L&Q may not match mortgage keywords. Property confirmation asks about scheme (shared ownership) but only if mortgage detected first. |
| Housing association ambiguity | **P1** — housing associations are deliberately excluded from rent keywords (could be shared ownership mortgage). Needs upfront "do you own or rent?" |
| Joint account handling | **P2** — detected by account type, but implications for disclosure (whose money?) not fully explored |

---

## Cross-persona summary: what fires for whom

| Signal rule | Emma | Tom | Claire | Margaret | Aisha |
|---|---|---|---|---|---|
| `income.regular-salary` | Yes | Yes | — | — | Yes |
| `income.benefits-hmrc` | Yes | Maybe | — | — | Yes |
| `income.benefits-dwp` | — | — | — | Yes | Yes |
| `income.self-employment-signal` | — | — | Yes | — | — |
| `income.none-visible` | — | — | — | — | — |
| `property.mortgage-detected` | Yes | — | — | — | Maybe |
| `property.rent-detected` | — | Yes | Yes | — | — |
| `property.council-tax` | Yes | Yes | Yes | Yes | Yes |
| `property.no-housing` | — | — | — | Yes | — |
| `pension.contribution-detected` | Maybe | — | — | — | — |
| `pension.no-contribution` | Likely | Likely | Likely | **Wrong** | Likely |
| `accounts.investment-platform` | — | — | Yes (crypto) | Yes (ISA) | — |
| `debt.credit-card` | Yes | — | — | — | Yes |
| `debt.loan` | Yes (car) | — | — | — | — |
| `debt.bnpl` | — | — | — | — | Yes |
| `flag.gambling` | — | — | — | — | — |
| **Rules firing** | **8-9** | **5-6** | **5-6** | **4-5** | **7-8** |

### Key insight
The core persona (Emma) gets 8-9 rules firing — good coverage. But the gaps (car as asset, holidays, insurance type, other assets) are all **Layer 4 user-supplied** items that need either upfront profiling or new confirmation questions.
