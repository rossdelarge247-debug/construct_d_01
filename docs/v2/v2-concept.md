# V2 Concept — The Guided Picture Builder

## Design thesis

Building a financial picture should feel like a conversation with a brilliant assistant, not filling in a 28-page form. The system guides you through what to provide, does the heavy lifting of extraction and organisation, and builds the picture as you go. You always know where you are, what's done, and what's next.

---

## Three-layer structure

### Layer 1: Workspace home

The journey phases (from V1 iterated design). "Build your picture" is the active phase. Future phases visible as zero-data states.

### Layer 2: Build your picture — the hub

Inside the active phase. Shows:
- Current state of the financial picture
- Category progress
- Readiness tier
- Primary action (upload or continue guided flow)
- "What to do next"
- Live financial summary

### Layer 3: Category detail

Inside a specific category. Guided flow: upload → extract → review side-by-side → wizard fills gaps → confirm. Or manual entry if no documents.

---

## The guided priority flow

The system guides the user through categories in priority order — most value first:

| Priority | Category | Why first | Key documents |
|----------|----------|-----------|---------------|
| 1 | **Current account** | Income AND expenditure from one upload | 12 months bank statements |
| 2 | **Savings & accounts** | Liquid assets, usually straightforward | Savings statements, ISA |
| 3 | **Property** | Often the largest single asset | Valuation, mortgage statement |
| 4 | **Pensions** | Often the largest overlooked asset, takes months | CETV letters |
| 5 | **Debts** | Liabilities that offset assets | Loan/credit card statements |
| 6 | **Other income** | Benefits, rental, maintenance received | Evidence varies |
| 7 | **Other assets** | Vehicles, valuables, crypto, investments | Varies |
| 8 | **Business** (if relevant) | Self-employment adds complexity | Business accounts, SA302 |
| 9 | **Outgoings review** | Auto-generated from bank statements, review and categorise | Already extracted |
| 10 | **Post-separation budget** | Projected needs, prompted when picture is sufficient | Guided, no documents |
| 11 | **Children** (if relevant) | Arrangements, optional depth | Guided, no documents |

Current account is first because one upload produces two Form E sections (income + expenditure). Maximum value from minimum effort. This is the "wow" moment.

---

## First-time experience

### Empty state

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Build your ──→ Share & ──→ Work ──→ Reach ──→   │
│  picture ●      disclose    through   agreement  │
│                                                  │
│  ──────────────────────────────────────────────  │
│                                                  │
│  BUILD YOUR PICTURE                              │
│                                                  │
│  Let's start with the document that tells us     │
│  the most — your current account statement.      │
│                                                  │
│  This gives us your income and spending in one   │
│  go. We'll extract, categorise, and organise     │
│  everything automatically.                       │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │                                            │  │
│  │  📎 Drop your current account statement    │  │
│  │                                            │  │
│  │  12 months if you have it.                 │  │
│  │  Download as PDF from your online banking. │  │
│  │                                            │  │
│  │  [Choose files]                            │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  [I don't have this yet →]                       │
│  [I want to enter details manually →]            │
│                                                  │
│  ─── FROM YOUR PLAN ───────────────────────────  │
│  We already know:                                │
│  · Income: ~£3,200/mo (estimated from plan)      │
│  · Property: own jointly (value unknown)         │
│  · Pension: unknown                              │
│                                                  │
└──────────────────────────────────────────────────┘
```

### After first upload — extraction in progress

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  BUILD YOUR PICTURE                              │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  Reading your bank statement...            │  │
│  │  ████████████░░░░░░░░                      │  │
│  │                                            │  │
│  │  Found so far:                             │  │
│  │  · 2 accounts detected                     │  │
│  │  · 247 transactions over 11 months         │  │
│  │  · Categorising spending...                │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  You can leave and come back. We'll notify       │
│  you when it's ready.                            │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Extraction complete — review

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  BUILD YOUR PICTURE                              │
│                                                  │
│  We found 16 items from your statement.          │
│  Let's walk through them.                        │
│                                                  │
│  ─── INCOME (from your statement) ────────────── │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ Monthly salary       Yours    £3,218/mo    │  │
│  │ Detected from regular deposits              │  │
│  │ [✓ Confirm]  [✎ Edit]  [View in statement] │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ Child benefit        Yours    £96.25/mo    │  │
│  │ Detected from HMRC deposits                 │  │
│  │ [✓ Confirm]  [✎ Edit]  [View in statement] │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  💡 Is this your only income source? Any         │
│     bonuses, overtime, or rental income?         │
│     [Add another source]  [This is everything]   │
│                                                  │
│  ─── ACCOUNTS DETECTED ───────────────────────── │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │ Current account      Joint    Bal: £1,842  │  │
│  │ Barclays ****4521                           │  │
│  │ Ownership: Joint (50% = £921)               │  │
│  │ [✓ Confirm]  [✎ Edit ownership/split]      │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ─── SPENDING (auto-categorised) ─────────────── │
│                                                  │
│  Housing          £890/mo    Mortgage payment    │
│  Utilities        £185/mo    Gas, electric, water│
│  Groceries        £420/mo    Supermarkets        │
│  Transport        £165/mo    Fuel, car insurance │
│  Children         £280/mo    Childcare, school   │
│  Subscriptions    £85/mo     Netflix, gym, etc.  │
│  Personal         £120/mo    Clothing, health    │
│  Eating out       £95/mo     Restaurants, coffee │
│  Other            £210/mo    Uncategorised       │
│                                                  │
│  Total outgoings: £2,450/mo                      │
│  [Review categories in detail →]                 │
│                                                  │
│  [✓ Confirm all spending]  [✎ Review one by one] │
│                                                  │
│  ─────────────────────────────────────────────── │
│                                                  │
│  Section complete. You've captured income and     │
│  spending from one upload.                       │
│                                                  │
│  [Continue to savings →]                         │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Side-by-side extraction review (when user clicks "View in statement")

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to review                                               │
│                                                                 │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐ │
│  │                         │  │                              │ │
│  │  [PDF VIEWER]           │  │  EXTRACTED DATA              │ │
│  │                         │  │                              │ │
│  │  Statement page 1       │  │  Account: Barclays ****4521  │ │
│  │  with relevant          │  │  Type: Current account       │ │
│  │  section highlighted    │  │  Ownership: [Joint ▾]        │ │
│  │                         │  │                              │ │
│  │                         │  │  Balance: £ [1,842]          │ │
│  │                         │  │  As at: 15 Mar 2026          │ │
│  │                         │  │                              │ │
│  │                         │  │  Monthly salary: £ [3,218]   │ │
│  │                         │  │  Source: Regular deposit      │ │
│  │                         │  │  Frequency: [Monthly ▾]      │ │
│  │                         │  │                              │ │
│  │                         │  │  [✓ Confirm all]  [✎ Save]  │ │
│  └─────────────────────────┘  └──────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The hub after several sections complete

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  BUILD YOUR PICTURE                              │
│                                                  │
│  Your financial picture is building.             │
│  📎 [Upload more documents]                     │
│                                                  │
│  ─── LIVE SUMMARY ─────────────────────────────  │
│                                                  │
│  Assets         £347,400                         │
│  · Property     £320,000 (estimated)             │
│  · Savings      £12,400                          │
│  · Pension      ⏳ awaiting CETV                 │
│                                                  │
│  Liabilities    £199,200                         │
│  · Mortgage     £195,000                         │
│  · Debts        £4,200                           │
│                                                  │
│  Net position   £148,200 (incomplete)            │
│                                                  │
│  Income         £3,218/mo                        │
│  Outgoings      £2,450/mo                        │
│                                                  │
│  ─── CATEGORIES ───────────────────────────────  │
│                                                  │
│  ✓ Income          £3,218/mo    Confirmed        │
│  ✓ Spending        £2,450/mo    Confirmed        │
│  ✓ Savings         £12,400      Confirmed        │
│  ● Property        £320,000     Estimated        │
│  ● Debts           £4,200       Confirmed        │
│  ⏳ Pensions       —            CETV requested    │
│  ○ Other assets    —            Not started       │
│  ○ Children        —            Not started       │
│                                                  │
│  ─── READINESS ────────────────────────────────  │
│                                                  │
│  First draft     ████████████░  Almost there     │
│  Disclosure      █████░░░░░░░  Pensions needed   │
│                                                  │
│  ─── WHAT TO DO NEXT ──────────────────────────  │
│                                                  │
│  ⚠️ Chase pension CETV — requested 2 weeks ago  │
│  ? Get property valuation to confirm estimate    │
│  ○ Review other assets (vehicles, valuables)     │
│                                                  │
│  ─── WHAT DO I STILL NEED? ────────────────────  │
│                                                  │
│  ✓ Current account statements (12 months)        │
│  ✓ Savings statements                            │
│  ✓ Mortgage statement                            │
│  ⏳ Pension CETV (requested 14 Mar)              │
│  ✗ Property valuation                            │
│  ✗ Credit card statements (if any)               │
│  ✗ Partner's income evidence                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## "I don't have documents" path

At any point, user can enter manually. The wizard within each category asks the right questions based on what we already know:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  PENSIONS                                        │
│                                                  │
│  You don't have a pension document yet.           │
│  Let's capture what you know.                    │
│                                                  │
│  Do you have a workplace pension?                │
│  [Yes]  [No]  [I don't know]                     │
│                                                  │
│  Who is your pension provider?                   │
│  [                              ]  [I don't know]│
│                                                  │
│  Do you know the approximate value?              │
│  £ [          ]                                   │
│  [Known ○]  [Estimated ○]  [Unknown ○]           │
│                                                  │
│  💡 A pension valuation (CETV) takes up to 3     │
│     months. Request it now from your provider.   │
│     [Show me how to request a CETV →]            │
│                                                  │
│  [Save and track]                                │
│                                                  │
│  This item will show as "awaiting CETV."         │
│  We'll remind you to follow up.                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Key design patterns adopted from research

| Pattern | Source | How we use it |
|---------|--------|---------------|
| Side-by-side extraction review | Dext | Original document next to extracted values, inline editing |
| Confidence colouring | FreeAgent | Green = confirmed, amber = AI-suggested/needs review, grey = missing |
| Live financial summary | TurboTax | Running totals update as sections complete |
| Phased collection | Mortgage industry | Start with highest-value document, build momentum |
| One thing at a time | GOV.UK, TurboTax | Within each category, guided single questions |
| Three paths per document | ContentSnare | Upload now / provide later / doesn't apply |
| Checklist with per-item status | Floify | Literal document checklist with received/reviewing/confirmed/missing |
| Celebration moments | Fintech best practice | "Section complete" acknowledgements between categories |

---

## Workspace design principles (V2 specific)

All V1 workspace principles apply, plus:

1. **Guided priority** — the system suggests the next most valuable category, not random order
2. **One upload, maximum extraction** — current account yields income + expenditure + accounts in one go
3. **Side-by-side review** — always show source alongside extracted data
4. **Live summary builds as you go** — assets, liabilities, net position, income, outgoings update in real time
5. **Document checklist is always visible** — literal list of what's been provided, what's pending, what's missing
6. **Celebrate completions** — micro-moments between sections: "You've captured your income and spending in one upload"
7. **Three paths everywhere** — upload, enter manually, or skip. Never blocked.
8. **Come back anytime** — async processing, auto-save, "we'll notify you when ready"
