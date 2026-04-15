# Spec 34 — Upfront Profiling + Journey Layering Design

## Purpose

Design the upfront profiling questions (asked before bank connection) and map how they flow into the three processing layers: straightforward deduction, signal detection, and user-supplied gaps.

## Principle

**Context before detection.** 5-6 fast questions give the engine a head start. This isn't a full interview — it's profiling. The user should spend <2 minutes here and feel like they're making progress, not filling in a form.

**Placement in journey:** After the welcome carousel (screens 1a-1c), before bank connection (screen 3). Currently this slot is empty — the user goes straight from "here's what we'll do" to "connect your bank". The profiling sits in between.

---

## The 6 profiling questions

### Q1: Housing situation
```
"Do you own your home or rent?"

○ Own with a mortgage
○ Own outright (no mortgage)
○ Rent
○ Living with family or friends
○ Other
```

**What it gates:**
- Own → property section active, expect mortgage/council tax in bank data
- Rent → property section simplified, expect rent payment in bank data
- Family → property section minimal, no housing cost expected
- Boosts confidence on pattern-based rent detection (if user says "rent", ambiguous standing orders more likely rent)

### Q2: Employment
```
"What's your employment situation?"

○ Employed (PAYE)
○ Self-employed or company director
○ Part-time employed
○ Retired
○ Not currently working
○ Full-time parent or carer
```

**What it gates:**
- PAYE → income section expects salary, pension likely at source
- Self-employed → business section unlocked, DLA prompt, HMRC SA expected, tax return needed
- Retired → pension income expected (not contributions), no salary expected
- Not working → no income signal is normal, not a gap

### Q3: Vehicles
```
"Do you have any vehicles?"

○ Yes, one
○ Yes, more than one
○ No
```

If yes:
```
"Is there any finance on your vehicle?"

○ Yes — PCP, HP, or loan
○ No — owned outright
○ Not sure
```

**What it gates:**
- Yes + finance → pre-seeds loan-to-vehicle linking (spec 31). When engine detects BMW Financial, it already knows there's a financed car.
- Yes + outright → car is a pure asset (Form E 2.6), no linked debt
- No → skip vehicle questions entirely. Large unknown payments less likely to be car purchases.

### Q4: Children
```
"Do you have children?"

○ Yes
○ No
```

If yes:
```
"How many children under 18?"

○ 1  ○ 2  ○ 3  ○ 4+
```

**What it gates:**
- Validates Child Benefit inference (engine infers from amount, profiling confirms)
- Sets expectation for childcare costs
- Pre-populates children section (future)

### Q5: Pensions
```
"Do you have any pensions?"

○ Yes, workplace pension
○ Yes, private/personal pension
○ Yes, more than one
○ Already drawing a pension
○ Not sure
○ No
```

**What it gates:**
- Workplace → "no pension visible" signal becomes expected (at source), not a gap. Don't alarm the user.
- Private → expect visible pension contribution in bank data
- Drawing → pension is income, not just an asset. Different Form E treatment.
- Sets CETV nudge timing (earlier = better, 6-8 week lead time)

### Q6: Other assets (quick checklist)
```
"Do you have any of these? Tick all that apply."

□ Savings accounts or ISAs
□ Investments (stocks, funds)
□ Cryptocurrency
□ Valuable items worth >£500 (jewellery, watches, art)
□ Life insurance policies
□ Money someone owes you
□ None of these
```

**What it gates:**
- Each ticked item activates the relevant section in confirmation flow
- Unticked items → section skipped (less noise)
- Crypto ticked → even if not visible in bank data, we know to ask for details
- Life insurance ticked → insurance payments in bank data get "is this life insurance?" disambiguation

---

## How profiling flows into the three layers

### Layer flow diagram

```
UPFRONT PROFILING (2 min)          BANK CONNECTION + ENGINE            CONFIRMATION + GAPS
─────────────────────────          ──────────────────────────          ──────────────────
Q1: "Own with mortgage"    ──→     Engine expects mortgage payment     → "£1,150 to Halifax —
                                   Boosts mortgage classification        your mortgage?" (confirm)
                                   confidence                          → Property value? Balance?

Q2: "Employed PAYE"        ──→     Engine expects salary credit        → "£3,200 from ACME —
                                   "No pension visible" = normal         your salary?" (confirm)
                                                                       → Pension: asked separately

Q3: "1 car, on finance"   ──→     Engine knows to link BMW Financial  → "£485 BMW Financial —
                                   to vehicle asset                      car finance?" (pre-answered)
                                   Halfords = vehicle_maintenance      → Car details: make, model,
                                                                         value, reg

Q4: "2 children"           ──→     Validates £96 HMRC = 2 children    → Auto-confirmed
                                   Expects childcare costs              (no question needed)

Q5: "Workplace pension"    ──→     "No pension visible" signal fires  → "Most workplace pensions
                                   but determination says "expected"     are deducted at source.
                                   not "gap"                             Do you know your provider?"

Q6: "Life insurance ✓"     ──→     Admiral Insurance in bank data:    → "Is Admiral your car
                                   could be car or life                  insurance, or life insurance?"
                                   Profiling says life insurance
                                   exists → ask to disambiguate
```

---

## Processing summary by Form E section

### For the core persona (Emma — PAYE homeowner, car finance, 2 kids)

| Form E section | Profiling provides | Bank data provides | Signal provides | User gap |
|---|---|---|---|---|
| **2.1 Property** | "Own with mortgage" | Mortgage payment + amount | Mortgage signal | Value, balance, ownership type |
| **2.3 Bank accounts** | "Savings ✓" | Connected account details | Investment platform signal | Other account balances |
| **2.4 Investments** | "Investments ✓" or not | Payments to HL/Vanguard | Investment signal | Current values |
| **2.5 Life insurance** | "Life insurance ✓" | Insurance payment (ambiguous) | — | Provider, surrender value |
| **2.6 Vehicles** | "1 car, on finance" | BMW Financial payment | Loan signal + linking | Make, model, value, reg |
| **2.7 Valuables** | "Valuables ✓" or not | — | — | Description, value |
| **2.13 Pensions** | "Workplace pension" | Nothing (at source) | No-contribution (expected) | Provider, CETV value |
| **2.14 Debts** | — | CC, loan, BNPL payments | Debt signals | Outstanding balances |
| **2.15 Income** | "Employed PAYE" | Salary credit | Salary signal | Gross pay (from payslips) |
| **2.20 Benefits** | — | HMRC/DWP credits | Benefits signal | — |
| **3.1 Spending** | — | All categorised payments | — | Holidays, clothing (new categories) |

---

## Lower priority: self-employment tailoring

For Claire (self-employed/director), the upfront "self-employed or director" answer unlocks a different journey:

1. **Business section activated** — company name, structure, accountant
2. **DLA prompt** — "Do you have a director's loan account?" (backlog #55)
3. **Tax returns requested** — "We'll need your last 2 years' SA302s"
4. **Income treated differently** — Stripe/client payments not treated as salary
5. **HMRC SA payments contextualised** — "These are your self-assessment payments" (not flagged as unknown)
6. **Business expenses** — "Some of your transactions may be business expenses. We'll help you separate them."

This is a tailored path, not the default. Without profiling, the engine has to guess from bank patterns alone — which works for Stripe/HMRC but misses DLA, accountant details, and business structure.

---

## Implementation approach

### Phase 1: Data model + profiling UI
- New type: `UserProfile` with answers from the 6 questions
- New component: `upfront-profiling.tsx` (6 screens, one question each, progressive)
- Store in workspace state alongside bank extraction data

### Phase 2: Wire profiling into engine
- `SignalInput` gets a new optional field: `userProfile?: UserProfile`
- Signal rules use profile to adjust confidence and determination text
- Confirmation question generator uses profile to skip/add questions

### Phase 3: Gap detection uses profiling
- "You said you have a car on finance, but we didn't detect a loan payment" → different question than cold detection
- "You said you have a workplace pension" → CETV nudge, not "do you have a pension?"

---

## What this does NOT cover

- The V1 "Gentle Interview" (different flow, public site, pre-workspace)
- Supabase persistence of profile answers (needs auth — backlog #65-67)
- The full "other assets" confirmation flow (needs wireframes)
- Children arrangements section (future — not Form E financial data)
