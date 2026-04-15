# Spec 34 — Upfront Profiling, Matching Architecture, and Journey Layering

## Purpose

Overhaul the engine philosophy from "infer everything from bank data" to "profile → match → disambiguate." This spec defines the profiling questions, how they feed the engine, the three-tier matching model, and the two-phase processing flow (assets/income then spending).

## Design decisions (agreed in session 19 design session)

1. **Medium-depth profiling** — gates + "who's it with?" follow-ups. Enough for matching, not so much it feels like filling in a form.
2. **Placement:** In workspace, after signup, before bank connection. Not part of the V1 interview.
3. **Insurance disambiguation in Phase A** (assets/debts review), not spending review.
4. **Self-employed path:** Enhanced, not totally different. Extra questions about company, salary vs dividends, business value, DLA.
5. **Matched items show clean confirmation** — "Salary from ACME Corp: £3,200/mo ✓" with detail on tap, not engine reasoning upfront.
6. **Spending flow is good** — needs better input data (holidays, clothing, vehicle maintenance categories as quick wins).

---

## Part 1: Profiling questions (~3 minutes)

Placement: after welcome carousel (1a-1c), before bank connection (screen 3). One question per screen, progressive.

### Q1: Housing

```
"Do you own your home or rent?"

○ Own with a mortgage
○ Own outright (no mortgage)
○ Rent
○ Living with family or friends
○ Other
```

**Follow-up if mortgage:**
```
"Who is your mortgage with?"

[Halifax          ▾]   ← dropdown of common UK lenders + free text
```

**Follow-up if rent:**
```
"Who do you pay rent to?"

[________________]   ← free text (letting agent or landlord name)
```

**What the engine does with this:**
- Mortgage + "Halifax" → when engine sees DD HALIFAX MORTGAGE, it's a confirmed match, not an inference
- Rent + "Foxtons" → pattern-based rent detection becomes a confirmed match
- Rent + private landlord name → engine looks for standing orders to that name
- Own outright → no mortgage expected, property section still asks value
- Family → housing section minimal, no housing payments expected

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

**Follow-up if self-employed/director (enhanced path):**
```
"Tell us a bit about your business"

Company name:    [________________]
Structure:       ○ Sole trader  ○ Limited company  ○ Partnership

"How do you pay yourself?"
□ Salary (PAYE through the company)
□ Dividends
□ Both salary and dividends
□ Drawings / ad hoc
```

**What the engine does with this:**
- PAYE → expect salary keyword in credits, "no pension visible" = normal (at source)
- Self-employed + company name → credits from that company are income, not unknown. If "both salary and dividends" selected, engine expects two credit patterns from same source
- Retired → pension income expected in credits, not contributions. No salary expected.
- Not working → no income signal is expected, not a gap

### Q3: Vehicles

```
"Do you have any vehicles?"

○ Yes, one
○ Yes, more than one
○ No
```

**Follow-up per vehicle:**
```
"Is there any finance on your vehicle?"

○ Yes
○ No — owned outright
○ Not sure
```

**If finance = yes:**
```
"Who is the finance with?"

[BMW Financial    ▾]   ← common providers + free text
```

**What the engine does with this:**
- "BMW Financial" in profile + DD BMW FINANCIAL in bank data → confirmed car finance match, auto-linked to vehicle asset
- "No finance" → car is pure asset (Form E 2.6), any loan payments are unrelated
- "No vehicles" → skip vehicle asset questions. Large unknown payments get standard "what was this?" not "was this a car purchase?"
- Multiple vehicles → engine knows to look for multiple finance/insurance matches

### Q4: Children

```
"Do you have children under 18?"

○ No
○ Yes — 1  ○ 2  ○ 3  ○ 4+
```

**What the engine does with this:**
- "2 children" + HMRC Child Benefit £96/4-weekly → exact match to 2-child rate, auto-confirmed
- "2 children" → childcare category expected in spending, children spending section active
- "No children" → skip children spending section, skip childcare detection

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

**Follow-up if workplace or personal:**
```
"Do you know who your pension is with?"

[________________]   ← free text (optional — "Skip if unsure")
```

**What the engine does with this:**
- "Workplace pension" → "no pension visible" signal fires but determination is "expected — workplace pensions are deducted at source" not "gap — no pension found"
- "Aviva" in profile + DD AVIVA in bank data → engine can resolve Aviva ambiguity (pension vs insurance) because profile says pension provider is Aviva
- "Drawing a pension" → pension credits are income, classified as pension_income not unknown
- "Not sure" → engine falls back to current behaviour (detect from bank data, ask if unsure)
- Sets CETV nudge timing (surface early — 6-8 week lead time)

### Q6: Other assets (quick checklist)

```
"Do you have any of these? Tick all that apply."

□ Savings accounts or ISAs
□ Investments (stocks, funds, bonds)
□ Cryptocurrency
□ Life insurance policies
□ Valuable items worth >£500 (jewellery, watches, art)
□ Money someone owes you
□ None of these
```

**What the engine does with this:**
- Each ticked item → section active in Phase A confirmation
- Unticked items → section skipped (no false-positive questions)
- "Life insurance ✓" → when engine sees insurance payments, disambiguation includes "Is this life insurance?" as a prominent option
- "Crypto ✓" → even if no Coinbase/Binance in bank data, confirmation flow asks for exchange and value
- "Valuables ✓" → other assets section prompts for description and estimated value

---

## Part 2: The three-tier matching model

After profiling + bank connection, the engine runs classification and signal detection as before — but now it has a `UserProfile` to match against.

### Tier 1: Matched (profile + bank data agree)

Engine has profiling data that matches a bank transaction. High confidence. Soft confirm only.

```
Profile says: "Mortgage with Halifax"
Bank shows:   DD HALIFAX MORTGAGE £1,150/mo
Result:       "Your mortgage with Halifax: £1,150/mo ✓"
              [Tap for details]
```

User just confirms. No ambiguity. Detail (12 credits, variation 0%, etc.) available on tap but not shown by default.

**Matched items:**
- Mortgage/rent where provider matches profile
- Car finance where provider matches profile
- Salary from known employer
- Child Benefit matching declared child count
- Pension contribution where provider matches profile

### Tier 2: Expected but not matched (profile says it exists, bank data ambiguous)

Engine knows something should be there (from profiling) but can't confidently match it to a specific payment. Contextual disambiguation.

```
Profile says: "Has car on finance" + "Has home"
Bank shows:   3 insurance payments (Admiral £42, L&G £65, Aviva £28)
Result:       "You have 3 insurance payments. Help us match them."

              £42/mo to Admiral       → [Car] [Home] [Life] [Other]
              £65/mo to Legal & General → [Car] [Home] [Life] [Other]
              £28/mo to Aviva          → [Car] [Home] [Life] [Other]
```

Options shown are informed by profile:
- Has car → show "Car insurance" option
- Owns home → show "Home/buildings insurance" option
- Ticked life insurance → show "Life insurance" option
- No car declared → don't show "Car" option

**Same pattern for loans:**
```
Profile says: "Car on finance with BMW Financial"
Bank shows:   2 loan payments (BMW Financial £485, Zopa £220)
Result:       BMW Financial auto-matched to car finance ✓
              "What is this £220/mo to Zopa?"
              → [Personal loan] [Student loan] [Other]
```

### Tier 3: Unknown (found in bank data, not in profile)

Engine found something the user didn't mention. Could be genuinely new or an oversight.

```
Profile says: nothing about investments
Bank shows:   £300/mo to Hargreaves Lansdown
Result:       "We found regular payments to Hargreaves Lansdown.
               Do you have an investment account?"
              → [Yes — ISA] [Yes — stocks & shares] [Yes — pension (SIPP)]
                [No — I've closed it] [Something else]
```

This is the current behaviour for unknown items — but now with better context because matched items are already accounted for. The user sees fewer of these because Tier 1 and 2 handled the expected items.

---

## Part 3: Two-phase processing

### Phase A: Assets, income, debts ("What you have" — Form E Part 2)

Runs after bank connection. Uses profiling + signals. The user reviews what was found.

**Flow:**

```
1. Income review
   Tier 1: "Salary from ACME Corp: £3,200/mo ✓"
   Tier 1: "Child Benefit (HMRC): £96/4-weekly ✓ — 2 children"
   Tier 3: "We also found £180/mo from [source] — what is this?"

2. Property review
   Tier 1: "Mortgage with Halifax: £1,150/mo ✓"
   → Property value? Mortgage balance? Sole/joint? (user inputs)
   Tier 1: "Council tax to Exeter CC: £185/mo ✓"

3. Accounts review
   Tier 3: "Payments to Hargreaves Lansdown — investment account?"
   → App-based accounts prompt (Monzo, Revolut, etc.)
   → Closed accounts in 12 months?

4. Pensions review
   Tier 2: "No pension contributions visible — expected (workplace at source)"
   → "Do you know your pension provider?"
   → Pension type (DB/DC), CETV status, nudge to request

5. Debts review
   Tier 1: "Car finance with BMW Financial: £485/mo ✓"
   Tier 1: "Barclaycard: £85/mo ✓" → balance?
   Tier 2: "What is £220/mo to Zopa?" → [Personal loan] [Student loan]
   → BNPL noted
   → Any other debts?

6. Other assets (only sections ticked in Q6)
   "Vehicle details" → make, model, value, reg (only if Q3 = yes)
   "Life insurance" → provider, surrender value (only if Q6 ticked)
   "Valuables" → description, value (only if Q6 ticked)
   "Crypto" → exchange, current value (only if Q6 ticked or detected)

7. Insurance disambiguation (in context)
   Tier 2: "Match your insurance payments" → car/home/life/other per payment
```

**Self-employed enhanced path (inserted into income review):**
```
Profile says: "Self-employed, limited company, salary + dividends"

1. Income review — enhanced
   "You told us you pay yourself salary and dividends from [Company Name]."
   
   Show detected credits from company:
   "£2,800/mo on 28th — consistent amount"  → [This is my salary]
   "£5,000 on varying dates — irregular"     → [These are dividends]
   "£1,200 from Stripe"                      → [Client/customer payments]
   
   → "What is the approximate value of the business?"
     [________________]  (optional — "Skip if unsure")
   
   → "Do you hold shares in the company?"
     ○ Yes, 100%  ○ Yes, jointly with partner  ○ Yes, with others
   
   → "Do you have a director's loan account?"
     ○ Yes → "Roughly, what is the balance?"
     ○ No
     ○ Not sure → "Check with your accountant — this is the most commonly
                    omitted item on Form E"
   
   → "Do you have an accountant?"
     ○ Yes → "We'll need your last 2 years' tax returns (SA302)"
     ○ No
```

### Phase B: Spending ("What you spend" — Form E Part 3)

Runs after Phase A. By this point, profiling + Phase A have classified and disambiguated most payments. The spending categories get cleaner input.

**Current spending flow is retained:**
1. Fork: "Do it now" vs "estimates for now"
2. Per-category walk-through (housing → utilities → personal → transport → children → leisure)
3. Each category: show found items → "did we miss anything?" → search → sub-summary
4. Full summary

**What changes with profiling context:**
- If user said "owns home" in Q1, housing category pre-populated with mortgage + council tax + matched home insurance
- If user said "has car" in Q3, transport category includes matched car insurance + detected fuel + vehicle maintenance
- If user said "2 children" in Q4, children category active with detected childcare
- Matched items from Phase A flow into correct spending categories automatically
- Fewer "unknown" items land in spending because disambiguation already happened

**New keyword categories needed (quick wins):**
- `holidays`: easyjet, ryanair, ba, british airways, jet2, tui, booking.com, airbnb, hotels.com, expedia, lastminute, on the beach, loveholidays, skyscanner
- `clothing`: primark, next, h&m, zara, asos, new look, marks spencer (non-food), john lewis, debenhams, tk maxx, uniqlo, gap
- `vehicle_maintenance`: kwik fit, halfords, volks autos, mot centre, national tyres, ats euromaster, formula one autocentres (from spec 31)

---

## Part 4: Data model

### UserProfile type

```typescript
interface UserProfile {
  // Q1: Housing
  housing: 'mortgage' | 'own_outright' | 'rent' | 'family' | 'other'
  housingProvider?: string        // "Halifax" or "Foxtons" or landlord name

  // Q2: Employment
  employment: 'paye' | 'self_employed' | 'part_time' | 'retired' | 'not_working' | 'carer'
  // Self-employed enhanced fields
  businessName?: string
  businessStructure?: 'sole_trader' | 'limited' | 'partnership'
  payMethod?: 'salary' | 'dividends' | 'both' | 'drawings'

  // Q3: Vehicles
  vehicleCount: 0 | 1 | 2        // 2 = "more than one"
  vehicles?: {
    hasFinance: boolean | null     // null = not sure
    financeProvider?: string       // "BMW Financial"
  }[]

  // Q4: Children
  childrenUnder18: 0 | 1 | 2 | 3 | 4  // 4 = "4+"

  // Q5: Pensions
  pensionSituation: 'workplace' | 'personal' | 'multiple' | 'drawing' | 'unsure' | 'none'
  pensionProvider?: string         // Optional free text

  // Q6: Other assets
  hasSavingsOrISA: boolean
  hasInvestments: boolean
  hasCrypto: boolean
  hasLifeInsurance: boolean
  hasValuables: boolean
  hasMoneyOwed: boolean
}
```

### SignalInput extension

```typescript
interface SignalInput {
  incomes: ExtractedIncome[]
  payments: DetectedPayment[]
  transactions: { date: string; description: string; amount: number }[]
  accountMeta: { provider: string; isJoint: boolean; type: string }
  userProfile?: UserProfile        // NEW — profiling data
}
```

### MatchResult type (new)

```typescript
interface MatchResult {
  tier: 1 | 2 | 3
  profileField?: string           // Which profile answer this relates to
  bankEvidence?: DetectedPayment | ExtractedIncome
  signalId?: string               // If a signal rule fired
  confidence: number
  displayText: string             // "Mortgage with Halifax: £1,150/mo"
  needsUserAction: boolean        // Tier 1 = false (soft confirm), Tier 2/3 = true
  disambiguationOptions?: string[] // For Tier 2: ["Car", "Home", "Life"]
}
```

---

## Part 5: Implementation plan

### Step 1: UserProfile type + profiling UI component
- Add `UserProfile` type to `hub.ts`
- New component: `upfront-profiling.tsx` — 6 screens, one question each
- Store in workspace state machine

### Step 2: Wire profile into engine
- Extend `SignalInput` with optional `userProfile`
- Update signal rules to use profile for confidence boosting (not breaking change — profile is optional)
- Add matching layer between signals and confirmation questions

### Step 3: Confirmation flow overhaul
- Replace current raw-bank-data question generation with tier-based matching
- Tier 1 items → soft confirm cards
- Tier 2 items → disambiguation screens (insurance, loans)
- Tier 3 items → current-style questions (what is this?)
- Self-employed enhanced path

### Step 4: New spending categories
- Add `holidays`, `clothing`, `vehicle_maintenance` keywords to csv-parser
- Add amount guards for each
- Wire into spending category mapping

### Step 5: Spending flow receives matched data
- Phase A matched items flow into correct spending categories
- Insurance payments labelled by type land in correct spending subcategory

---

## What this does NOT cover

- V1 Gentle Interview changes (separate product surface)
- Supabase persistence (needs auth — backlog #65-67)
- Full "other assets" wireframes (spec needed for vehicle details capture, valuable items input)
- Children arrangements section (future)
- Signal linking persistence (spec 31 — needs the matching model first)
- Workbench updates to test profiling (dev-only enhancement, build when needed)
