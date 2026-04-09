# Workspace Design Spec — 09: Upload & Review Flow

## The most important interaction in the product

This flow is where the magic happens. User drops a document → AI reads it → structured data appears → user confirms. If this feels seamless and delightful, the product wins.

---

## The upload zone

### Visual design

The upload zone is a large, inviting area with strong visual affordance:

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                                         │
│                        📎                                │
│                                                         │
│            Drop any financial document here              │
│                                                         │
│     Bank statements · Payslips · Pension letters        │
│     Mortgage statements · Valuations                    │
│                                                         │
│              [Choose file]                              │
│                                                         │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

- **Border:** 3px dashed, warmth colour, generous dash spacing (8px dash, 6px gap)
- **Border radius:** 16px
- **Background:** cream with 50% opacity warmth-light tint
- **Minimum height:** 200px
- **Icon:** 32px, ink-light colour, centred
- **Primary text:** 16px, bold, ink colour
- **Secondary text:** 14px, ink-light
- **Button:** secondary variant, centred

### States

**Idle:**
- Dashed border, muted background
- Subtle pulse animation on the border (opacity cycles 0.4 → 0.7 over 3 seconds)
- On hover: border opacity increases, background tint strengthens

**Drag over:**
- Border goes SOLID warmth (not dashed)
- Background: warmth-light (solid)
- Scale up slightly (transform: scale 1.01)
- Text changes: "Drop it here" (larger, bolder)

**File selected (pre-upload):**
- Border stays solid
- File name and size shown
- "Processing..." text

**Processing:**
- Border: solid warmth
- Background: warmth-light
- Processing animation centred:
  - Large spinner (48px diameter, 2px warmth border, spinning)
  - Below spinner: conversational message text that changes over time
  - Below message: file name in small text
  - Below that: "You can leave and come back"

**Messages cycle:**
```
"Reading your document..."          (0-2s)
"Identifying document type..."      (2-4s)
"Found a bank statement from Barclays..."  (4-6s, includes detected type)
"Extracting financial details..."   (6-9s)
"Categorising transactions..."      (9-12s, if bank statement)
"Nearly there..."                   (12s+)
```

Messages should feel conversational and specific (include the detected document type and provider when known).

**Error:**
- Border: dashed, amber
- Background: amber-light
- Error message in ink text
- "Try again" button + "Enter manually" link
- Never just a generic error — always tell the user what happened and what to do

---

## The review flow

When extraction completes, a review panel appears BELOW the upload zone on the same page.

### Review panel structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  We found 14 items from your Barclays current account   │
│  ────────────────────────────────────────────────────── │
│                                                         │
│  ACCOUNTS                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Barclays ****4521     Joint     Balance: £1,842 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  INCOME                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ● Monthly salary      £3,218/mo    [Looks right]│   │
│  │   Regular deposit from EMPLOYER                 │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ● Child benefit       £96/mo       [Looks right]│   │
│  │   HMRC deposit                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  SPENDING (monthly averages)                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Housing        £2,150    ▸ 1 transaction        │   │
│  │ Insurance      £232      ▸ 4 transactions       │   │
│  │ Utilities      £15       ▸ 1 transaction        │   │
│  │ Subscriptions  £174      ▸ 11 transactions      │   │
│  │ Personal       £47       ▸ 3 transactions       │   │
│  │ ─────────────────────────────────────────────── │   │
│  │ Total          £2,618/mo                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Confirm all]           [Discard and try another]     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Review panel design

- **Entrance animation:** slides down from the upload zone, 300ms ease-out
- **Background:** surface (#FEFDFB) with 2px cream-dark border, shadow-md
- **Sections stagger in:** accounts → income items → spending (200ms between each)

### Item cards within review

Each extracted item is a row:
- Confidence dot (green = high, amber = medium)
- Label (bold)
- Value (right-aligned, bold)
- Source description (small, muted)
- Single action button: "Looks right" (sage background on hover)

When "Looks right" is clicked:
- Button transforms to "✓" with sage background
- Row gets a subtle sage left border
- Smooth transition (200ms)

For items the user wants to reject:
- Small "✕" or "Not this" link appears on hover at the far right
- Clicking it: row fades out (200ms), strikethrough animation

### Spending section

- Presented as a table with monthly averages
- Each row clickable → expands to show transaction examples
- Total row at bottom, bold
- "Confirm all spending" as a single action (not per-category)

### Bulk actions

- "Confirm all" — confirms every item + spending in one click
- "Discard and try another" — removes all extracted items, returns to upload zone

---

## After confirmation — the celebration

When all items are confirmed:

1. Review panel shows a brief success state (1.5s):
   - Green background flash
   - "✓ 14 items added to your picture"
   - Confetti-free — just a clean, satisfying green moment

2. Review panel collapses smoothly (300ms)

3. Upload zone returns to idle state

4. Category cards in the grid below update with new values (count-up animation on numbers)

5. Readiness bar adjusts if applicable

6. A toast notification: "14 items from Barclays added" (bottom-centre, 3s)

---

## Side-by-side document review

When a user clicks "View document" on any item (in category detail):

A split-view modal opens:

```
┌────────────────────────────────────────────────────────────┐
│  Document review                                      ✕    │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  ┌────────────────────┐  ┌─────────────────────────────┐  │
│  │                    │  │                             │  │
│  │  [PDF VIEWER]      │  │  EXTRACTED DATA             │  │
│  │                    │  │                             │  │
│  │  Statement page    │  │  Account: Barclays ****4521 │  │
│  │  with relevant     │  │  Type: Current account      │  │
│  │  area highlighted  │  │  Ownership: [Joint ▾]       │  │
│  │                    │  │                             │  │
│  │                    │  │  Balance: £ [1,842]         │  │
│  │                    │  │  As at: 15 Mar 2026         │  │
│  │                    │  │                             │  │
│  │                    │  │  Salary: £ [3,218] /mo      │  │
│  │                    │  │  Source: Regular deposit     │  │
│  │                    │  │                             │  │
│  │                    │  │  [Save changes] [Cancel]    │  │
│  └────────────────────┘  └─────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

- **Full-screen modal** (with escape)
- **50/50 split** on desktop
- **Stacked** (document above, data below) on mobile
- PDF viewer shows the actual uploaded document
- Extracted data is editable inline
- Changes save to the item

This is the Dext pattern — see the original, verify the extraction, correct if needed.

---

## Key principles

1. **Never leave the page to upload.** Upload zone is always present and inline.
2. **Processing feels conversational.** Not a spinner — a narrative.
3. **Review is clear and fast.** One-click confirm per item, or bulk confirm.
4. **Errors always have a next step.** Never a dead end.
5. **Celebration is brief but real.** Green flash, count updates, toast. Then back to work.
6. **Side-by-side is a modal.** Not a page. See the doc, see the data, fix if needed, close.
