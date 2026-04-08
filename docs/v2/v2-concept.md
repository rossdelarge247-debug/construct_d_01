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

---

## User scenario analysis

Ten user scenarios tested against the concept. Fixes incorporated.

### Scenario adaptations

**Prepared users (have multiple documents ready):**
The empty state offers TWO entry points:
- "Let's start with your current account" (guided priority)
- "Got multiple documents? Drop them all here" (bulk upload)

Bulk upload classifies all documents, then presents a consolidated review across categories. Power users can batch-confirm high-confidence items without stepping through one category at a time.

**Users with no documents:**
"Start without documents" path is positioned as equally valid, not a fallback. Framed as: "Let's capture what you already know." Manual wizard pre-populates from V1 estimates. Document checklist provided as actionable homework: "When you're ready, here's what to gather."

**Safeguarding-flagged users:**
Empty state adapts entirely when V1 safeguarding flags are present:
- Lead with manual entry, not document upload
- "Let's capture what you know, even if it's rough estimates"
- Surface: "If you can't access financial documents, the disclosure process will require your partner to share. A solicitor can help if they won't."
- Frame readiness as "your side of the picture"
- Accept that this user may never reach full readiness independently — that's OK

**Simple finances (renting, no property, small pensions):**
Categories adapt based on V1 data. If no property, Property category hidden by default (available via "Add a category"). Simple case might show only: Income, Savings, Debts, Outgoings. Proportionate to complexity.

**Complex finances (multiple properties, business, trusts):**
Each category supports multiple items. "Add another" always available. Inherited and pre-marital flags on any item. Trust interests captured as free text with specialist referral prompt. System recognises complexity: "Your financial picture is more detailed than average — make sure every asset and liability is captured."

**Self-employed users:**
When self-employment detected, income section changes approach:
- Don't present a single income figure from bank statement alone
- Show: "Salary: £12,000. We also need dividend history, business accounts, and tax returns for the full picture."
- Readiness tiers adjusted: first-draft requires business accounts, not just personal statements
- Flag: "A forensic accountant may be needed for business valuation"

**Overwhelmed users (10 minutes at a time):**
- Show what's DONE as the primary message, not what's left
- "What to do next" shows ONE item, not a list
- Celebrate micro-progress: "You've added your income. That's a real step forward."
- Never show a long outstanding items list by default
- Auto-save everything, always

**Fast-moving organised users:**
Bulk upload → consolidated review → batch confirm high-confidence items → move on. The system stays out of their way. No forced category-by-category hand-holding.

### Spending review — summary not transactions

12 months of bank statements may produce hundreds of transactions. The system presents spending as **pre-categorised monthly averages**, not individual transactions:

"Groceries: £420/month · Transport: £165/month · Utilities: £185/month"

The user confirms CATEGORY totals. Individual transactions viewable by drilling in, but never the default review unit. This keeps the review manageable regardless of transaction volume.

### Partner's information

Primary flow focuses on the user's own finances. After each category, an optional prompt: "Do you know anything about your partner's [income/savings/pension]?"

Partner items are:
- Visually distinct (lighter styling, different section)
- Always marked "Partner's — to be confirmed in disclosure"
- Can be placeholders: "Partner's pension — unknown value, unknown provider"
- Become open questions in V3

### AI extraction errors

- Every extraction shows confidence level
- Low-confidence items flagged visually (amber)
- System states what it THINKS the document is before extraction: "We think this is a bank statement from Barclays. Is that right?"
- Side-by-side review for every extracted value
- Corrections logged to improve future extractions
- Never auto-finalise — always requires user confirmation

### Mobile experience

- Accept photos as well as PDFs (lower accuracy, flagged)
- Support share-to-upload from banking apps
- Category cards and review flow must work on mobile viewport
- One-column layout throughout

---

## Navigation and transitions

### Between layers

Breadcrumb navigation: `Build your picture > Income > Review`

Back button always visible. Tapping "Build your picture" in breadcrumb returns to the hub.

### Between categories

When a category is confirmed, an inline transition card appears:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ✓ Income complete                               │
│                                                  │
│  Salary: £3,218/mo · Benefits: £96/mo            │
│  1 account detected · 11 months of spending      │
│                                                  │
│  Next suggested: Savings & accounts              │
│  Upload your savings statements, or enter what   │
│  you know.                                       │
│                                                  │
│  [Continue to savings →]  [Back to hub]          │
│                                                  │
└──────────────────────────────────────────────────┘
```

Brief, celebrates what was captured, suggests next, always offers return to hub.

### Document checklist

Slide-out panel triggered by a persistent button: "What do I still need?"

Not inline with the hub. Accessible from any screen within V2. Shows:

```
✓ Current account statements (12 months)
✓ Savings statements
✓ Mortgage statement
⏳ Pension CETV (requested 14 Mar)
✗ Property valuation
✗ Credit card statements
✗ Partner's income evidence
? Payslips (optional — income confirmed from bank)
```

Each item has context: why it's needed, what to do to get it. Never just a bare checklist.

### Notifications

In-app only by default. When async extraction completes: badge on workspace icon, message on hub: "3 documents processed — ready for your review."

User can opt into email notifications in settings. Email uses neutral subject: "Your workspace has updates." No financial content in email body — just "Log in to see what's new." Respects safeguarding.

### Transition to V3

When first-draft readiness is reached, a gentle card appears in the hub:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Your picture is ready to share                  │
│                                                  │
│  You have enough to start a conversation with    │
│  a mediator or solicitor. When you're ready,     │
│  the next phase helps you prepare for formal     │
│  disclosure.                                     │
│                                                  │
│  [Prepare for disclosure →]                      │
│                                                  │
│  You can keep building your picture at any time. │
│                                                  │
└──────────────────────────────────────────────────┘
```

Not a gate. An invitation. The user can keep refining V2 even after entering V3.

### Readiness language

Plain language tied to what the user can DO:

| Internal tier | User sees |
|--------------|-----------|
| First draft | "Ready to share with a mediator for initial discussion" |
| Disclosure | "Ready for formal financial disclosure" |
| Final draft | "Substantively complete — minor items outstanding" |
| Formalisation | "Complete and locked — ready for consent order" |

### V1 to V2 transition

First visit to workspace includes a brief framing moment (not a tour — that's V1.5):

"Welcome to your workspace. This is where your plan becomes real. We've brought forward everything you told us — let's start building the detail."

Then the guided priority flow begins with the first upload prompt.
