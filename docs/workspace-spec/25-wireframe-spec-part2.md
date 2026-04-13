# Wireframe Spec Part 2 — Confirmation Flow, Summaries, Financial Hub

**Source:** 30 wireframe screens reviewed in session 8. These wireframes are the definitive interaction design — implement as designed, do not reinterpret.

---

## Screen index (this file)

| Screen | Name | Description |
|--------|------|-------------|
| 2b | Confirmation flow — first question | Task list returns with bank connected, first clarification question |
| 2c-a | Income — salary detected | "We can see regular payments from Acne Ltd, is this your salary?" |
| 2c-b | Income — "No" branch | "If these payments are not your salary, are they..." |
| 2c-a (cont) | Income — salary confirmed response | "OK then so your employer is Acne Ltd, you'll need payslips for finalisation" |
| 2d-a | Income — section mini-summary | "That's it for income" with tick list |
| 2e-a | Property — mortgage detected | "£1,150 goes to Halifax on the 1st..." |
| 2e-b | Property — no signal | "We didn't detect anything that looked like a mortgage payment" |
| 2e-c | Property — ambiguous signal | "£2,150 goes to Parsons... mortgage or rent?" |
| 2f | Property — ownership split | "Do you jointly own your property?" |
| 2g | Property — market value | "What is the current market value?" with confidence qualifier |
| 2d-b | Property — section mini-summary | "That's it for property" with gap messages |
| 2h | Accounts — transfer detection | "What are the regular payments to HLSAVINGS?" |
| 2d-c | Accounts — section mini-summary | "That's it for Accounts" with multiple account types |
| 2g | Pension — no signal | "We didn't see any pension payments..." |
| 2h | Debts — no signal | "We didn't see any obvious loan or credit card payments..." |
| 2i | Final summary | All sections complete, "End of the beginning" |
| 3a | Financial summary hub | Full financial picture with source badges |
| 2j | Post-connection task list | Evolved task list with all three phases active |

---

## Confirmation flow — persistent frame

**Every confirmation screen shares this structure:**

```
[NAV BAR]
Let's go through what you just shared with us    [Share & collaborate]

┌─────────────────────────────────────────────────┐
│ Preparation                                     │
├─────────────────────────────────────────────────┤
│ ✓ 2 Barclays bank accounts ▾    [Connected]    │
│   This connection last for 90 days              │
│   (accordion: completed sections when expanded) │
├─────────────────────────────────────────────────┤
│ ■ □ □ □ □ □ □ □ □ □  (progress stepper)        │
│                                                 │
│ [Section label]                                 │
│ [Question text — large, bold]                   │
│                                                 │
│ ○ Option A                                      │
│ ○ Option B                                      │
│ ○ Option C (if applicable)                      │
│                                                 │
│ [Next]  Skip for now                            │
├─────────────────────────────────────────────────┤
│                                                 │
│ Sharing & collaboration  [locked label]         │
│ Finalisation             [locked label]         │
└─────────────────────────────────────────────────┘
```

**Persistent elements:**
- Title bar: "Let's go through what you just shared with us"
- Preparation header
- Bank connection row: "✓ 2 Barclays bank accounts" with [Connected] badge and "This connection last for 90 days" in red/warning text
- Chevron (▼/▲) on bank connection row — expands/collapses completed section sub-tabs
- Progress stepper — segmented bar, filled segments advance per section
- Locked phase labels at bottom (Sharing, Finalisation)

**Every question has:**
- Section label (grey, small): "Income", "Property", "Accounts", "Pension", "Debts", etc.
- Question text: large, bold — always references what bank data found
- Radio options (○) — typically 2-4 choices
- [Next] primary button + "Skip for now" link
- No back button shown — but the section mini-summary has "I need to go back and review these again"

---

## Section flow: Income (screens 2c-a, 2c-b)

**Question 1 — salary detection:**
- Section label: "Income"
- Question: "We can see regular payments from Acne Ltd, is this your salary?"
- Options: ○ Yes / ○ No

**If Yes — confirmation + gap planting:**
- "OK then so your employer is Acne Ltd, you'll need to share your payslips for finalisation"
- [OK, next]
- **Design note:** This immediately plants the gap (payslips needed) in context, at the moment it's relevant. Not deferred to a summary.

**If No — progressive disclosure:**
- "If these payments are not your salary, are they"
- Options: ○ Dividends from self employment / ○ Rental income / ○ Money from family or friends / ○ Other
- Each option routes to different Form E sections and generates different gap documents.

---

## Section flow: Property (screens 2e-a through 2g)

Three entry variants depending on bank signal:

**Strong signal (known lender):** "£1,150 goes to Halifax on the 1st of each month. Is this your mortgage?" — ○ Yes / ○ No

**No signal:** "We didn't detect anything that looked like a mortgage payment, do you own any property?" — ○ Yes / ○ No

**Ambiguous signal:** "£2,150 goes to Parsons on the 1st of each month. Is this your mortgage or rent?" — ○ Mortgage / ○ No, I rent

**Follow-up if mortgage confirmed:**
- Screen 2f: "Do you jointly own your property with your spouse/partner?" — ○ Yes / ○ No
- Screen 2g: "What is the current market value of your property?" — £[input] + confidence qualifier:
  - ○ This is an estimate
  - ○ I recently had my property valued by an estate agent

---

## Section flow: Accounts (screen 2h)

**Transfer detection:** "What are the regular payments to HLSAVINGS?"
- Options: ○ Savings account / ○ ISA / ○ Pension / ○ Other
- Triggered when bank data shows regular transfers to unconnected accounts.

---

## Section flow: Pensions (screen 2g)

**No signal path:** "We didn't see any pension payments, what's your pension situation?"
- Options: ○ I have at least one private pension / ○ No private pensions
- Note: Workplace pensions are deducted at source, invisible in bank data. The question acknowledges this implicitly.

---

## Section flow: Debts (screen 2h)

**No signal path:** "We didn't see any obvious loan or credit card payments, do you have any debts?"
- Options: ○ Yes / ○ No

---

## Per-section mini-summary pattern (screens 2d-a, 2d-b, 2d-c)

**After each section's questions are answered, a mini-summary appears:**

```
[Section label]
That's it for [section name]

✓ [Confirmed fact 1]
  ℹ [Gap message if applicable — "When we get to finalisation..."]
✓ [Confirmed fact 2]
  ℹ [Gap message if applicable]
✓ [Confirmed fact 3]
...

[This looks correct]  I need to go back and review these again
```

**Key behaviours:**
1. The bank connection accordion **expands** to show a new completed sub-item: "✓ [Section] disclosed, ready for sharing & collaboration"
2. Each confirmed fact gets a tick (✓)
3. **Inline gap messages** appear beneath relevant facts in info boxes:
   - "When we get to finalisation, we will need a mortgage statement balance, but this is fine for the mediation process. We will add an action to your task list."
   - "When we get to finalisation, we will need ideally 3 separate property valuations from different estate agents. This estimate is fine for mediation, we will add an action to your task list."
4. **Calculated values** appear where possible: "You have an estimated equity value of £180,000" (property value minus mortgage)
5. **[This looks correct]** — primary CTA, batch-approves the section
6. **"I need to go back and review these again"** — link, returns to the section's first question

**Accounts mini-summary specific details (2d-c):**
- Shows multiple account types: joint account, ISA, Monzo account
- Connection refresh reminder: "This account was connected to on 12th April 2026 via secure link and you will need to refresh this feed every 90 days"
- Unconnected account gaps: "we will need a yearly statement for this account or you can connect securely"

**Accordion behaviour:**
- When moving to a new section, the mini-summary sub-tabs slide away and the chevron closes
- Completed sections are hidden inside the accordion, keeping focus on the current question
- At any point the user can expand the accordion to see all completed sections

---

## 2i: Final summary — end of confirmation flow

**When:** All sections have been confirmed.

**The accordion is fully expanded showing all completed sections:**
```
✓ 2 Barclays bank accounts ▲                    [Connected]
  ✓ Income disclosed, ready for sharing & collaboration          [Edit]
  ✓ Property disclosed, ready for sharing & collaboration        [Edit]
  ✓ No private pensions to disclose                              [Edit]
  ✓ Debts disclosed: HSBC credit card, and a car loan            [Edit]
  ✓ Spending disclosed, full 12-month categorisation             [Edit]
  ✓ You have no businesses                                       [Edit]
  ✓ Other assets                                                 [Edit]
  ✓ No red flags                                                 [Edit]
```

**Progress bar fully filled.**

**Summary content:**
- Section label: "End of the beginning"
- Heading: "This is great progress"
- "We will now take you to your financial summary which can be shared with your spouse/partner and/or a third party such as a mediator or solicitor"
- **[Take me to my financial summary]** — primary CTA, navigates to screen 3a

**Key details:**
- Every completed section has an [Edit] link for going back
- "No red flags" is explicitly shown — system transparency
- Spending gets special status: "full 12-month categorisation, ready for sharing & collaboration, AND finalisation"
- Sharing & Finalisation phase labels no longer show locked status — they're unlocking

---

## 3a: Financial summary hub

**When:** User clicks "Take me to my financial summary" from 2i, or navigates via "View financial summary" from the task list.

**This is a sub-page, not the home page. The home page is the task list (2j).**

**Title bar:** "< Back to your dashboard" / [TITLE BAR] / [Share & collaborate]

**Page heading:** "Your financial picture"

**Structure — section cards stacked vertically:**

### Accounts card
```
Accounts
✓ 2 Barclays bank accounts          [Barclays Bank connection] (green badge)
  This connection last for 67 days
  12 months of transaction data from 9th April 2027

+ Connect another to another bank account
```

### Income card
```
Income                                           Source
✓ You are employed by Acne Ltd       [Barclays Bank connection] (green)
✓ You receive 3,400 net monthly      [Barclays Bank connection] (green)
  salary
✓ You also receive £120 in child     [Barclays Bank connection] (green)
  maintenance

+ Manually add another income not shown in connected
  Barclays current account xxxx2312
```

### Property card
```
Property                                         Source
✓ You jointly own a property         [Self disclosed] (orange)
  estimated value £500,000
✓ You have an estimated mortgage     [Self disclosed] (orange)
  balance of £320,000
  You share the ownership of this property, the starting
  position for marriage is 50/50
✓ Your property has an estimated     [Self disclosed] (orange)
  equity value of £180,000 -
  £90,000 each
✓ You have a mortgage with Halifax   [Barclays Bank connection] (green)
✓ You have no second property        [Self disclosed] (orange)

+ Declare further property interests
```

### Spending card
```
Spending
TBC I NEED TO DESIGN THIS PANEL

+
```

### Debts card
```
Debts
TBC I NEED TO DESIGN THIS PANEL

+
```

### Empty sections
```
No pensions disclosed               +
No businesses disclosed              +
No other assets disclosed            +
```

### Bottom sections (non-financial)
```
Build your children picture now      [Start outline now]
Your needs after separation          [Complete needs picture]
```

**Source badge system:**
| Badge | Colour | Meaning |
|-------|--------|---------|
| "Barclays Bank connection" | Green | Data verified from bank via Open Banking |
| "Self disclosed" | Orange | User estimate or confirmation — not bank-verified |

**Key design decisions:**
1. Every item shows its evidence source via coloured badges
2. Calculated values appear (equity, per-person split)
3. Contextual financial guidance inline ("starting position for marriage is 50/50")
4. Every section has a + button for adding items
5. Empty sections show "No [X] disclosed" with + to add
6. Children and needs are separated at the bottom — distinct from financial disclosure
7. This is a **sub-page** reached from the task list, not the home page itself

---

## 2j: Post-connection task list (home page)

**When:** This IS the home page after bank connection and confirmation flow are complete.

**Personalised:** "Welcome, Hannah" / "This is your task list of things to do"

### Preparation tasks
```
✓ 2 Barclays bank accounts ▾        [Barclays Bank connection]
  10 form E sections are now complete and ready for sharing!
                                     [View financial summary]

Have you applied for your pension    [Take action ▾]
CETV yet? (Don't forget it takes
a while)

Outline your children situation      [Start outline now]

Fill out your post separation        [Complete needs picture]
budgetary needs

Have you applied for your divorce    [Take action ▾]
online yet? for guidance click here

Book your MIAM and use your free     [Take action ▾]
£500 voucher

+ Add more tasks to track here
```

### Sharing & collaboration tasks
```
Invite your ex-partner to            [Invite now]
collaborate and share their
financial picture securely here

Invite your mediator to              [Invite now]
collaborate and share their
financial picture securely here

Invite your solicitor to             [Invite now]
collaborate and share their
financial picture securely here

+ Add more tasks to track here
```

### Finalisation
```
Final evidence gathering
XX supporting documents needed for court

① Upload property valuation           [Upload]
① Upload your mortgage statement      [Upload]
① Upload your pay slips and P60       [Upload]
① Upload your pension CETV            [Upload]

Generate final documentation
D81, Form E final, Consent Order,    [Create final docs]
Form A
```

**Key design decisions:**
1. **Task list is dynamically generated** from what the confirmation flow discovered — gap documents become specific upload tasks, CETV application becomes a preparation task
2. **All three phases are now active** — no longer locked
3. **Tasks go beyond financial data** — MIAM booking, divorce application, children outline. Full case management.
4. **"+ Add more tasks to track here"** — user can add custom tasks. The system is a tool, not a rigid workflow.
5. **Finalisation shows specific gap documents** with numbered priority indicators and [Upload] buttons
6. **"Generate final documentation"** shows the endgame: D81, Form E final, Consent Order, Form A. Visible from the start.
7. **"View financial summary"** links to screen 3a (the detail view)

---

## Screens still to be wireframed

The following are placeholdered in the current wireframes:

| Screen | Status | Notes |
|--------|--------|-------|
| Spending categorisation dialogue | **Urgent** — to be wireframed next | In-journey spending review |
| Spending panel (financial summary) | Pending | "TBC I NEED TO DESIGN THIS PANEL" |
| Debts panel (financial summary) | Pending | "TBC I NEED TO DESIGN THIS PANEL" |
| Build children picture flow | Pending | CTA exists: [Start outline now] |
| Needs after separation flow | Pending | CTA exists: [Complete needs picture] |
| Share & collaborate screens | Pending | CTAs exist: [Invite now] buttons |
| Upload flow (finalisation) | Pending | [Upload] buttons exist on task list |
