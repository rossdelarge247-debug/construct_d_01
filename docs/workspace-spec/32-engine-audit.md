# Spec 32 — Engine Audit: Detection Capabilities vs Form E Requirements

## Purpose

Sanity check the signal detection engine against what a typical user actually needs disclosed on Form E. Map every Form E field to one of four layers: upfront profiling, straightforward bank deduction, signal detection + user confirmation, or user-supplied gap.

## Core go-to-market persona

**"Emma"** — employed (PAYE), homeowner with mortgage, workplace pension, car on finance, two children, goes on a couple of expensive holidays a year. This is ~40% of users and must be flawless.

**Variant: "Tom"** — same but renting instead of owning. ~25% of users.

---

## Layer 1: Upfront profiling (asked before bank connection)

Things we should ask early because they gate the engine's behaviour and reduce false positives. These are fast, multiple-choice, takes <2 minutes.

| Question | What it gates | Currently asked? |
|---|---|---|
| Housing: own with mortgage / own outright / rent / other | Property section depth, mortgage vs rent signal weighting | **No** — deduced from bank data only |
| Employment: employed / self-employed / retired / not working | Income section, business section visibility | **No** — deduced from bank data only |
| Vehicles: how many, any on finance? | Vehicle asset detection, loan linking | **No** — not asked anywhere |
| Children: how many, ages | Children section, childcare spend expectations | **No** — inferred from Child Benefit amount |
| Pensions: any you know about? | Pension section depth, CETV nudge timing | **No** — deduced from bank data only |
| Valuable assets: jewellery/art/crypto >£500? | Other assets section visibility | **No** — not asked |

**Verdict: We have zero upfront profiling.** The engine runs blind. This is the single biggest improvement we can make — context before detection.

---

## Layer 2: Straightforward bank deductions (auto-classified, high confidence)

Things the keyword engine already handles well with no signal rule needed.

| What | Category | Keywords working? | Amount guards? | Confidence |
|---|---|---|---|---|
| Mortgage payment | `mortgage` | Yes (Halifax, Nationwide, etc.) | Yes (£200-5k) | High |
| Rent payment | `rent` | Yes (Foxtons, OpenRent, etc.) | Yes (£150-4k) | High |
| Council tax | `council_tax` | Yes (borough/council names) | Yes (£50-500) | High |
| Utilities (gas/electric/water) | `utilities` | Yes (British Gas, Octopus, etc.) | Yes (£10-500) | High |
| Groceries | `groceries` | Yes (Tesco, Sainsbury, etc.) | No guard needed | High |
| Fuel | `fuel` | Yes (Shell, BP, etc.) | No guard needed | High |
| Dining | `dining` | Yes (Nandos, Deliveroo, etc.) | No guard needed | High |
| Subscriptions (Netflix, gym, mobile) | `subscription` | Yes (~30 keywords) | Yes (£3-300) | High |
| Credit card payments | `credit_card` | Yes (Barclaycard, Amex, etc.) | Yes (£10-5k) | High |
| Childcare | `childcare` | Yes (nursery, childminder, etc.) | Yes (£50-3k) | High |
| Insurance | `insurance` | Yes (Admiral, Direct Line, etc.) | Yes (£8-500) | High |
| Transport | `transport` | Yes (TfL, Trainline, etc.) | No guard needed | High |
| Education/school fees | `education` | Yes (school, academy, etc.) | Yes (£50-25k) | Medium |
| Healthcare | `healthcare` | Partial (pharmacy, dentist) | No guard needed | Medium |

**Verdict: Layer 2 is strong for the core persona.** 14 of 20 categories work well. The classified rate for "Emma" should be 85%+.

### Missing categories (quick wins)
| Category | Why needed | Status |
|---|---|---|
| `vehicle_maintenance` | Garages, MOT, car parts — common unknowns | Spec'd in 31, not implemented |
| `holidays` | Package holidays, flights, hotels — Form E 3.1 spending | Not in engine |
| `clothing` | Primark, Next, H&M — Form E 3.1 spending | Not in engine |

---

## Layer 3: Signal detection + user confirmation

Things where the engine detects a pattern and asks the user to confirm/clarify.

### Currently working (17 rules)

| Signal | Rule ID | For persona? | Working well? |
|---|---|---|---|
| Regular salary | `income.regular-salary` | Emma: yes | **Yes** — consistent amount + keyword |
| HMRC Child Benefit | `income.benefits-hmrc` | Emma: yes | **Yes** — infers child count |
| DWP benefits | `income.benefits-dwp` | Tom variant | **Yes** — asks type |
| Self-employment signal | `income.self-employment-signal` | Lower priority | **Yes** — Stripe/HMRC SA |
| No income visible | `income.none-visible` | Edge case | **Yes** |
| Mortgage detected | `property.mortgage-detected` | Emma: yes | **Yes** |
| Rent detected (keyword + pattern) | `property.rent-detected` | Tom: yes | **Yes** — 2-path |
| Council tax | `property.council-tax` | Both | **Yes** — auto-confirms |
| No housing costs | `property.no-housing` | Edge case | **Yes** |
| Pension contribution | `pension.contribution-detected` | Emma: maybe | **Yes** — but most are at source |
| No pension visible | `pension.no-contribution` | Emma: likely | **Yes** — notes workplace pensions |
| Investment platform | `accounts.investment-platform` | Optional | **Yes** — crypto sub-detect |
| Credit card | `debt.credit-card` | Emma: maybe | **Yes** |
| Loan repayment | `debt.loan` | Emma: car finance | **Yes** — asks type (personal/car/student) |
| BNPL | `debt.bnpl` | Optional | **Yes** — merchant grouping |
| Gambling flag | `flag.gambling` | Red flag | **Yes** — internal flag |

### Gaps: signals we need but don't have

| Signal needed | Why | Priority for core persona |
|---|---|---|
| Large one-off payment | £23k car purchase, £5k gift — spec 31 | **P1** — common for Emma |
| Holiday spending pattern | Multiple hotel/flight bookings — Form E 3.1 | **P2** — nice to detect |
| Insurance type disambiguation | Car vs home vs life vs pet — different Form E fields | **P2** — currently all lumped as "insurance" |
| Loan-to-asset linking | Car finance → which car? | **P2** — spec 31 concept |
| Savings transfer pattern | Regular transfers out = savings account | **P3** — already partially there |

---

## Layer 4: User-supplied gaps (things bank data can't tell us)

These must come from the user, either via upfront profiling or confirmation questions.

| Gap | Form E field | Currently asked? | How? |
|---|---|---|---|
| Property value | 2.1 | **Yes** — confirmation flow input | Works |
| Mortgage balance | 2.1 | **Yes** — confirmation flow input | Works |
| Pension provider details + CETV | 2.13 | **Partial** — asks count and type, no CETV value input | Needs improvement |
| Car details (make, model, value) | 2.6 | **No** — car finance detected but car as asset not captured | **Gap** |
| Savings/ISA balances | 2.3 | **Yes** — confirmation flow input | Works |
| Other accounts (Monzo, Revolut, etc.) | 2.3 | **Yes** — app-based accounts prompt exists | Works |
| Crypto holdings value | 2.4 | **Yes** — if detected, asks value | Works |
| Closed accounts in last 12 months | 2.3 | **Yes** — asked in accounts section | Works |
| Director's loan account | 2.10 | **No** — not asked | **Gap** (backlog #55) |
| Personal belongings >£500 | 2.7 | **No** — not asked | **Gap** |
| Money owed to you | 2.8 | **No** — not asked | **Gap** |
| Gifts/disposals in last 12 months | 2.9 | **No** — not asked | **Gap** |
| Life insurance surrender value | 2.5 | **No** — insurance detected but type not disambiguated | **Gap** |
| Housing situation (who lives where) | 2.1 | **Yes** — occupation question in property flow | Works |
| Children arrangements | Part 1 | **No** — not in engine scope yet | Future |

---

## Audit verdict: keep / change / improve

### Keep (working well)
- **Keyword classification engine** — 20 categories, ~200 keywords, fuzzy matching, amount guards. Solid.
- **Signal rule architecture** — clean separation (types → rules → engine → questions). Easy to extend.
- **Confirmation question flow** — 7 sections, conditional branching, summary generation. Comprehensive.
- **Test scenarios** — 5 personas with expected outcomes. Good coverage.
- **BNPL detection** — merchant grouping, instalment pattern detection. Sophisticated.
- **Pattern-based rent detection** — 2-path approach catches private landlords. Smart.

### Change (needs rethinking)
- **No upfront profiling** — engine runs blind. Add 5-6 fast questions before bank connection to gate sections and reduce false positives. This is the single biggest architectural improvement.
- **Insurance is one bucket** — car, home, life, pet, travel all classified as "insurance" but map to different Form E fields. Need sub-classification.
- **Car as asset vs car finance as debt** — these are currently disconnected. Loan detection doesn't know it's a car. Need spec 31 signal linking.
- **No "other assets" questions** — Form E 2.5-2.9 (life insurance, vehicles, valuables, money owed, gifts/disposals) have zero coverage. Big gap for the core persona.

### Improve (works but could be better)
- **Holiday detection** — no category for flights (BA, EasyJet, Ryanair), hotels (Booking.com, Airbnb), or package holidays. These are significant Form E 3.1 items and users with "a couple of expensive holidays a year" need this captured.
- **Clothing** — no category. Primark, Next, ASOS, H&M. Form E 3.1 spending.
- **Vehicle maintenance** — spec'd in 31, not implemented. Quick win.
- **Pension CETV capture** — we ask about pensions but don't capture the CETV value or provider details systematically. Need input fields.
- **Confirmation questions don't use signals** — questions are generated from raw bank data, not from DetectedSignal objects. The signal engine and question generator are not connected. This is the next architectural step.
