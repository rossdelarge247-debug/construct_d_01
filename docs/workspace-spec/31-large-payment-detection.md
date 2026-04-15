# Spec 31 — Large payment detection and asset/expense fork

## Problem

The classification engine handles recurring payments well (mortgage, rent, utilities) but has a blind spot for **large one-off payments**. These are critical for Form E:

- **Vehicle purchases** (Form E 2.6) — a £23,200 payment to a private seller
- **Property deposits** (Form E 2.1) — a £15,000 deposit to a solicitor
- **Gifts/disposals** (Form E 2.9) — a £5,000 gift to a family member
- **Large bills** (Form E 3.1) — building work, private surgery, legal fees

Real example from user's bank data: `STEPHEN BOOKER RWILLIAMS FT £23,200` — a private car purchase. Classified as "unknown" because no keyword matches a person's name. The engine needs to detect the *pattern* (large + one-off + unknown payee) and ask the user what it was.

### Secondary gap: vehicle-related spending

Smaller but significant unknowns like car repairs and parts also fall through:
- `VOLKS AUTOS £1,146` — garage repair bill (Ntropy correctly labels "vehicle_maintenance")
- `PAYPAL *VOID.CARBO £1,652` — alloy wheels via PayPal (Ntropy mislabels "home maintenance")

These aren't assets but are relevant to Form E 3.1 (spending needs — vehicle maintenance costs).

## Architecture

### Signal rule: `flag.large-one-off`

A new signal rule that detects large unknown payments and triggers a forking question flow.

```typescript
const largeOneOff: SignalRule = {
  id: 'flag.large-one-off',
  name: 'Large one-off payment',
  section: 'flags',
  tier: 'must_nail',
  formEField: 'multiple',  // Routes to 2.1, 2.6, 2.7, 2.9, or 3.1 based on user answer
  detect: (input) => {
    // Find unknown payments above threshold with few occurrences
    // Threshold TBD — use workbench amount analysis to determine
    // Likely £3,000 for full fork, £1,000 for "what was this?"
  }
}
```

### Detection criteria

| Criterion | Value |
|---|---|
| Category | `unknown` (not already classified) |
| Amount | Above threshold (see tiered approach below) |
| Occurrences | ≤2 payments to same payee (one-off, not recurring) |
| Exclude | Payments already linked to known categories via other signals |

### Tiered thresholds

| Tier | Amount | Behaviour | Form E relevance |
|---|---|---|---|
| **Large** | ≥ £3,000 | Full asset/expense fork — must answer | 2.1, 2.6, 2.7, 2.9 |
| **Significant** | £1,000-3,000 | "What was this payment?" — categorise | 3.1 (spending needs) |
| **Below threshold** | < £1,000 | No question — stays unknown | Not individually material |

**Note:** The £3,000 threshold is provisional. The workbench amount distribution analysis (built in session 18) should be used to validate against real data before finalising.

## The fork: asset vs expense

When a large one-off payment is detected, the user sees a forking question flow:

```
"We found a payment of £23,200 to Stephen Booker. What was this?"
│
├─ Purchase of an asset
│   ├─ Vehicle → capture: reg, make, model, current value → Form E 2.6
│   ├─ Property or land → Form E 2.1
│   ├─ Jewellery, art, or valuables → Form E 2.7
│   └─ Other asset → describe, estimate value
│
├─ A bill or expense
│   ├─ Building work / home improvement → Form E 3.1 (but note: may increase property value → 2.1)
│   ├─ Holiday → Form E 3.1
│   ├─ Private medical treatment → Form E 3.1
│   ├─ Legal fees → Form E 3.1 (and relevant to divorce costs)
│   └─ Other bill → describe
│
├─ Gift or transfer to someone → Form E 2.9 (disposals)
│   └─ Gifts >£500 in last 12 months are disclosable
│
├─ Deposit with finance/loan attached
│   └─ Links to existing loan_repayment signals (see signal linking below)
│
└─ Something else → describe
```

### For "significant" tier (£1,000-3,000)

Simpler question — no full fork, just categorisation:

```
"We noticed a payment of £1,652 via PayPal. What was this for?"
│
├─ Vehicle purchase or parts → Form E 2.6 or 3.1
├─ Home improvement → Form E 3.1
├─ One-off bill (medical, legal, etc.) → Form E 3.1
├─ Gift → Form E 2.9
└─ Other → describe
```

## Signal linking (new concept)

When the user confirms "vehicle purchase" for a large payment, the engine should check for **connected signals** — other payments that relate to the same asset.

### Example: car purchase with finance

| Transaction | Category | Form E | Connection |
|---|---|---|---|
| £5,000 deposit to dealer | unknown → vehicle deposit | 2.6 (asset) | Primary |
| £350/mo to BMW Financial | `loan_repayment` | 2.14 (debt) | Linked: "Is this loan for your vehicle?" |
| £85/mo to Admiral | `insurance` | 3.1 (spending) | Linked: "Is this insurance for your vehicle?" |
| £150 to Halfords Autocentre | `vehicle_maintenance` | 3.1 (spending) | Auto-linked by category |

### Example: outright purchase (no linked signals)

| Transaction | Category | Form E | Connection |
|---|---|---|---|
| £23,200 to Stephen Booker | unknown → vehicle purchase | 2.6 (asset) | Primary — no linked loan |

### How linking works

1. User confirms "vehicle purchase" for the large payment
2. Engine scans for existing `loan_repayment` signals → asks: "Is this loan related to your vehicle?"
3. Engine scans for existing `insurance` signals → asks: "Is this insurance for your vehicle?"
4. If confirmed, the loan becomes a **secured debt against the asset** (Form E 2.14 references 2.6)
5. Vehicle maintenance payments are auto-linked by category

This is the first case of **cross-signal linking** — where a user answer about one signal changes the interpretation of other signals.

### Implementation approach

```typescript
interface SignalLink {
  fromSignalId: string    // "flag.large-one-off.stephen-booker"
  toSignalId: string      // "debt.loan.bmw-financial"
  relationship: string    // "secured-against" | "insurance-for" | "maintenance-of"
  confirmedByUser: boolean
}
```

Signal links are stored alongside user corrections. When the engine runs, linked signals get additional context in their determination and reasoning.

## New category: `vehicle_maintenance`

Add to the 20 → 21 categories in `extraction-schemas.ts`:

```typescript
likely_category: '...' | 'vehicle_maintenance' | '...'
```

### Keywords

```
vehicle_maintenance: [
  // Garages and mechanics
  'kwik fit', 'halfords', 'halfords autocentre', 'mr clutch', 'ats euromaster',
  'national tyres', 'formula one autocentres', 'mot centre',
  // Generic terms
  'auto', 'autos', 'motor', 'motors', 'garage', 'car service', 'car repair',
  'tyres', 'exhaust', 'bodyshop', 'panel beaters',
  // Specific brands in user's data
  'volks autos',
]
```

### Amount range

```
vehicle_maintenance: { min: 20, max: 5000 }
```

## Upfront questions (V1 interview or workspace onboarding)

Rather than detecting vehicles purely from bank data, we should ask upfront:

### V1 interview additions

```
"Do you own any vehicles?"
├─ Yes → "How many?" → capture for each: make, model, approximate value
│   └─ "Is there any finance on this vehicle?"
│       ├─ Yes → "Who is the finance with?" → pre-populates loan linking
│       └─ No → outright owner
└─ No
```

This gives the engine a head start:
- If user declares 1 car, and we see a large payment + a loan, we can pre-link them
- If user declares 0 cars, we can still flag the £23,200 payment but not assume "vehicle"
- If user declares 2 cars but we only see 1 loan, we know to ask about the other

### Other asset upfront questions

```
"Do you have any of the following?"
□ Valuable jewellery, watches, or art (>£500)
□ Cryptocurrency
□ Shares or investments outside ISAs
□ Business ownership or partnership
□ Money owed to you by others
□ Inheritance expected
```

These gate the engine's focus areas — skip sections where the user declares nothing.

## Workbench enhancements

### Amount distribution analysis (already built — session 18)

Visual histogram showing transactions by amount bucket with category breakdown. Click a bucket to filter. Use this to validate the £3,000 threshold against real data.

### Future: "What was this?" inline prompt

On the classifications table, unknown payments above threshold should show a "What was this?" button that opens the forking question inline in the workbench. This lets the user categorise unknowns without leaving the analysis view.

## What this does NOT cover

- Automated vehicle identification from bank data (Level 3+ — needs ML)
- DVLA integration for registration lookup
- Property deposit detection from mortgage applications
- The full signal linking persistence layer (needs Supabase auth)

## Implementation priority

1. **`vehicle_maintenance` category** — keywords + amount range (quick win)
2. **`flag.large-one-off` signal rule** — detection + tiered thresholds
3. **Forking question flow** — multi-step question triggered by signal
4. **Signal linking data model** — SignalLink type + persistence
5. **Cross-signal linking logic** — "Is this loan for your vehicle?"
6. **V1 interview additions** — upfront asset questions
7. **Workbench inline categorisation** — "What was this?" button
