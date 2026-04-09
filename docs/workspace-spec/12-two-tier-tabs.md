# Workspace Design Spec — 12: Two-Tier Tab Structure (Revised Page Model)

## Replaces previous understanding of the Build Your Picture page

---

## The page structure

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to workspace                          [nav header]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  BUILD YOUR PICTURE                    ████░░░ 55%    │  │
│  │  Bring everything together...                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────┬──────────────┐                             │
│  │ Preparation  │   Summary    │    ← PAGE-LEVEL TABS        │
│  ├──────────────┴──────────────┤                             │
│  │                              │                             │
│  │  ┌────────────────────────┐  │                             │
│  │  │ Current  Property Debt │  │    ← COMPONENT-LEVEL TABS  │
│  │  │ account         [+ ⚙] │  │      (inside upload component)
│  │  ├────────────────────────┤  │                             │
│  │  │                        │  │                             │
│  │  │  Upload zone /         │  │                             │
│  │  │  AI analysis /         │  │                             │
│  │  │  Wizard Q&A            │  │                             │
│  │  │                        │  │                             │
│  │  └────────────────────────┘  │                             │
│  │                              │                             │
│  └──────────────────────────────┘                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Level 1: Page-level tabs

Two tabs that switch the entire content area between two modes.

### Preparation tab (default)

The working mode. Where you:
- Upload documents
- Work through AI analysis and questions
- Confirm and clarify findings
- Build the picture category by category

### Summary tab

The output mode. The Form E equivalent:
- Beautifully structured by Form E sections
- Read-only view of all confirmed data
- Rendered as a serious, professional document
- Gaps clearly shown as "not yet captured"
- Email to self / Download as PDF
- Always accessible — zero-data state when empty

### Tab design (page-level)

```
┌──────────────┬──────────────┐
│ Preparation  │   Summary    │
└──────────────┴──────────────┘
```

- Large, clear tab buttons — these are not subtle
- Active: solid fill (warmth for Preparation, teal for Summary) with white text
- Inactive: outlined, cream-dark background
- Full width of the content area
- Bold text, generous padding (py-3 px-6)

---

## Level 2: Component-level tabs (inside Preparation)

These sit INSIDE the upload/work component within the Preparation tab. They represent the financial categories being worked on.

### Which categories appear

Only categories confirmed as relevant. Determined by:
1. V1 data (owns property → Property tab appears)
2. First-time wizard (asks what's relevant)
3. User can add more via the [+] control

### Tab design (component-level)

```
┌────────────────────────────────────────────────────────────┐
│ Current account │ Property │ Debt │ Pensions │   [+ ⚙]    │
│     ✓ 3 items   │          │      │   ⏳     │            │
└────────────────────────────────────────────────────────────┘
```

- Smaller than page-level tabs — clearly nested, not competing
- Horizontal, scrollable on overflow
- Status indicators under each tab label
- Active: warmth bottom border (3px)
- [+] button: add a category
- [⚙] button: manage categories (show/hide, reorder)

### The [+ ⚙] control

A subtle, beautiful control at the end of the component tabs:

- **[+]** — opens a small popover/dropdown showing available categories not yet added
  - "Add a category"
  - List of unused categories with descriptions
  - Click to add → tab appears with smooth animation

- **[⚙]** — opens settings for the tabs
  - Show/hide categories
  - Reorder (drag or arrows)
  - "This doesn't apply to me" → hides a category

Design: small icon buttons, ink-faint colour, warmth on hover. Not intrusive but discoverable.

---

## Preparation tab — detailed content

### First visit flow

1. **V1 playback** — "From your plan, we know: [income, property, children]"
   - User confirms or corrects
   - This determines initial category tabs

2. **First-time wizard** — "What areas apply to your situation?"
   - Quick checklist: Current account, Savings, Property, Pensions, Debts, Other
   - Pre-checked based on V1 data
   - User adjusts → category tabs populate

3. **Upload guidance** — "Start with your current account — one document tells us the most"
   - Upload zone appears in the first category tab
   - "How this works" dismissable panel

### Returning visit

- Category tabs show with their current status
- Active tab shows upload zone + confirmed items + AI prompts
- Upload zone always available at top of each tab

### Content within each category tab

```
┌────────────────────────────────────────────┐
│                                            │
│  📎 Upload zone                            │
│  (contextual to this category)             │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│  AI analysis results                       │
│  (tiered: auto-confirmed, quick confirms,  │
│   genuine questions, gap prompts)          │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│  Confirmed items list                      │
│  (items already in the picture)            │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│  💡 AI prompt                              │
│  "Any other income sources?"               │
│  [Add another item]                        │
│                                            │
└────────────────────────────────────────────┘
```

---

## Summary tab — the Form E equivalent

### Design philosophy

This is a SERIOUS document. It should look and feel like a professional financial statement — not a dashboard, not a card grid. Clean, structured, printable.

### Structure (mapped to Form E sections)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  YOUR FINANCIAL DISCLOSURE                                 │
│  Prepared: 9 April 2026                                    │
│  Status: First draft — 55% complete                        │
│                                                            │
│  [Email to myself]  [Download PDF]                         │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  PART 1: BACKGROUND                                        │
│                                                            │
│  Full name: [from V1/auth]                                 │
│  Date of birth: [if captured]                              │
│  Date of marriage: [from V1]                               │
│  Children: [from V1/V2]                                    │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  PART 2: FINANCIAL DETAILS                                 │
│                                                            │
│  2.1 Property                                              │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Family home, 12 Oak Lane                          │     │
│  │ Ownership: Joint · Value: £320,000 (estimated)    │     │
│  │ Mortgage: £195,000 with Halifax                    │     │
│  │ Equity: ~£125,000                                 │     │
│  │ Evidence: valuation_2026.pdf                      │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
│  2.4 Bank accounts                                         │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Barclays current account ****4521 (Joint)         │     │
│  │ Balance: £1,842 as at 15 Mar 2026                 │     │
│  │ Evidence: barclays_statement_2026.pdf              │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
│  2.7 Pensions                                              │
│  ┌──────────────────────────────────────────────────┐     │
│  │ ⏳ Awaiting CETV — requested 14 Mar 2026         │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
│  2.10 Liabilities                                          │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Credit card (Barclaycard): £4,200                 │     │
│  │ Ownership: Yours                                  │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
│  2.11 Income                                               │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Employment: £3,218/mo (net) from ACME Corp       │     │
│  │ Child benefit: £96.25/mo                          │     │
│  │ Evidence: payslip_march.pdf, bank statement       │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
│  2.12 Expenditure                                          │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Housing: £2,150/mo                                │     │
│  │ Insurance: £232/mo                                │     │
│  │ Utilities: £185/mo                                │     │
│  │ Groceries: £420/mo                                │     │
│  │ Transport: £165/mo                                │     │
│  │ Children: £280/mo                                 │     │
│  │ Subscriptions: £174/mo                            │     │
│  │ Personal: £120/mo                                 │     │
│  │ ─────────────────────────────────────────────     │     │
│  │ Total: £2,450/mo                                  │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  GAPS — NOT YET CAPTURED                                   │
│                                                            │
│  ○ Pension CETV (awaiting)                                 │
│  ○ Partner's income                                        │
│  ○ Other assets (vehicles, valuables)                      │
│  ○ Investments / ISAs                                      │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  This is a working document. It updates as you add more    │
│  information in the Preparation tab.                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Zero-data state (Summary tab when empty)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  YOUR FINANCIAL DISCLOSURE                                 │
│                                                            │
│  This is where your complete financial picture will be     │
│  structured — equivalent to a Form E financial statement.  │
│                                                            │
│  As you upload documents and confirm details in the        │
│  Preparation tab, this summary builds automatically:       │
│                                                            │
│  · Property and valuations                                 │
│  · Bank accounts and savings                               │
│  · Pensions with CETV values                               │
│  · Debts and liabilities                                   │
│  · Income (employment, benefits, other)                    │
│  · Monthly expenditure breakdown                           │
│                                                            │
│  Each section links to evidence. Each value shows its      │
│  confidence level. Gaps are clearly marked.                │
│                                                            │
│  When ready, download as PDF or email to yourself, your    │
│  solicitor, or your mediator.                              │
│                                                            │
│  [Start in Preparation tab →]                              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Summary design principles

- **Typography:** Formal but warm. Slightly larger body text (16px). Clear section numbers referencing Form E.
- **Layout:** Single column, generous spacing. Each section is a card with subtle border.
- **Evidence links:** Every item shows which document supports it.
- **Confidence indicators:** Known items are solid. Estimated items are marked. Unknown/gaps are clear.
- **Gaps section:** at the bottom, clearly listing what's missing.
- **Actions:** "Email to myself" and "Download PDF" prominent at the top.
- **Footer:** "This is a working document" — clear that it updates as more data is added.

---

## How the two tab levels interact

| User action | What happens |
|-------------|-------------|
| Clicks Preparation tab | Shows the upload/work area with category tabs |
| Clicks Summary tab | Shows the Form E equivalent document |
| Uploads a doc in Preparation | Data appears in Summary when confirmed |
| Clicks "Edit" in Summary | Switches to Preparation tab, opens relevant category |
| Clicks "Start in Preparation" from empty Summary | Switches to Preparation tab |
| Downloads PDF from Summary | Generates PDF of current state with gaps noted |

---

## Updated spec summary

| Element | Previous design | Revised design |
|---------|----------------|----------------|
| Financial picture below tabs | Live summary at bottom of page | Moved to Summary tab — dedicated, structured |
| Category tabs | Page-level tabs | Component-level tabs nested inside Preparation |
| Form E output | Not designed | Summary tab — beautiful, printable, email-able |
| Upload + summary on same view | Competing for attention | Separated into two clear modes |
| Category management | Static based on V1 | [+ ⚙] control to add/manage categories |
