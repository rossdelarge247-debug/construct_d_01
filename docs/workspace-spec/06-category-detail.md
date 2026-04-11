> **SUPERSEDED** — The `/workspace/build/{category}` detail page is no longer needed. Under the tabbed model (`05b` + `12`), all category work happens inline within component-level tabs. Retained for design history only.

# Workspace Design Spec — 06: Category Detail (ARCHIVED)

## URL: /workspace/build/{category}

## Purpose

Deep dive into one financial category. See all items, add more, upload documents specific to this category, track what's confirmed vs estimated vs missing.

---

## Layout

The sidebar shows this category as the active sub-item. The main content is focused on this one category.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ← Back to overview                                         │
│                                                             │
│  INCOME                                        ✓ Confirmed  │
│  Form E section 2.11                                        │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│                                                             │
│  ITEMS                                                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Employment income                    Yours  Known   │   │
│  │ £3,218/month                                        │   │
│  │ Source: payslip_march.pdf                           │   │
│  │ [Edit]  [View document]  [Remove]                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Child benefit                        Yours  Known   │   │
│  │ £96.25/month                                        │   │
│  │ Source: bank statement extraction                   │   │
│  │ [Edit]  [Remove]                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Partner's income                   Partner's  Est.  │   │
│  │ ~£2,800/month                                       │   │
│  │ No evidence linked                                  │   │
│  │ [Edit]  [Upload evidence]  [Remove]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│                                                             │
│  ACTIONS                                                    │
│                                                             │
│  [📎 Upload income document]  [✎ Add income item]          │
│                                                             │
│  💡 Do either of you receive bonuses, overtime, rental      │
│  income, or benefits beyond what's shown here?              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sections

### 1. Header

- "← Back to overview" text link (→ /workspace/build)
- Category name as h1 (bold, 28px)
- Form E section reference (small, muted)
- Status badge (right-aligned): Confirmed / Estimated / Needs detail

### 2. Items list

Each captured item is a card:
- Item label (h3, bold)
- Value (large, right-aligned)
- Period indicator (/month, /year, total)
- Ownership badge (Yours / Joint / Partner's)
- Confidence badge (Known / Estimated / Unknown)
- Source document link (if evidence linked)
- Actions: Edit, View document, Upload evidence, Remove

**Item card visual states:**
- Known with evidence: surface bg, sage left border
- Known without evidence: surface bg, amber left border ("needs evidence")
- Estimated: cream-dark bg, amber left border
- Partner's item: slightly different styling (muted, indicates "their" item)

### 3. Actions

Two buttons:
- Upload document (primary, if documents make sense for this category)
- Add item manually (secondary)

Both trigger **modals**, not page navigation.

### 4. AI prompt

A contextual question that helps the user think about what they might have missed:
- Income: "Any bonuses, overtime, rental income, or benefits?"
- Savings: "Any ISAs, premium bonds, or accounts you rarely use?"
- Pensions: "Any old workplace pensions from previous employers?"
- Debts: "Any store cards, buy-now-pay-later, or loans from family?"

---

## The Edit modal

When "Edit" is clicked on an item:

```
┌─────────────────────────────────────────┐
│                                         │
│  Edit: Employment income          ✕     │
│                                         │
│  Label                                  │
│  [Employment income              ]      │
│                                         │
│  Value                                  │
│  £ [3,218]  [Per month ▾]              │
│                                         │
│  Confidence                             │
│  [Known ●]  [Estimated ○]  [Unknown ○]  │
│                                         │
│  Ownership        Split                 │
│  [Yours ●]        [100%]               │
│  [Joint ○]                              │
│  [Partner's ○]                          │
│                                         │
│  ☐ This is inherited                    │
│  ☐ This is pre-marital                  │
│                                         │
│  Notes                                  │
│  [                              ]       │
│                                         │
│  [Save changes]  [Cancel]               │
│                                         │
└─────────────────────────────────────────┘
```

Modal: centred on desktop (max-width 480px), full-screen on mobile. Overlay backdrop.

### "Add item" modal

Same structure but empty fields. Category pre-selected.

### "Upload document" behaviour

When clicked from a category page, the upload zone appears as a modal or inline expansion. Not a page change.

Processing and review happen within this context. When confirmed, items are added to this category's list.

---

## Category-specific features

### Pensions (/workspace/build/pensions)

Includes the CETV tracker component between the items list and the actions:
- Track CETV requests per pension
- Status: Not requested → Requested → Chasing → Received
- Guidance on how to request
- Timing context ("requested 26 days ago — most respond within 6-8 weeks")

### Outgoings (/workspace/build/outgoings)

Shows auto-categorised spending from bank statement extraction:
- Category breakdown with monthly averages
- Expandable rows to see underlying transactions
- Ability to recategorise, flag, or add missing categories
- Total outgoings summary

### Children (/workspace/build/children)

Includes optional depth sections:
- Current arrangements (from V1)
- Typical week planner (visual)
- School & childcare details
- Holidays, birthdays, occasions
- Maintenance status

### Business (/workspace/build/business)

Self-employment specific:
- Business details (name, structure, years)
- Salary + dividends breakdown
- SIPP contributions flagged
- "Full picture needs business accounts and tax returns" guidance
- "Forensic accountant may be needed for valuation" signpost

---

## Key principles for this page

1. **Everything about this category, in one place.** Items, documents, actions, guidance.
2. **Edit and add via modals.** Never leave the page.
3. **Each item shows its evidence status.** Known with doc, known without doc, estimated.
4. **The AI prompt asks the right question** for this specific category.
5. **Sidebar sub-items let you jump between categories** without going back to the hub.
