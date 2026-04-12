# Bank-First Journey Redesign

**Amends:** Specs 15 (discovery), 16 (hero panel), 17 (hub states)
**Context:** Tink Open Banking is working end-to-end. Bank data fills 60–70% of the financial picture in seconds. The golden path should lead with bank connection, not PDF upload.

---

## The shift

**Before:** Config → Upload PDFs → AI extracts → Q&A → repeat for each document type
**After:** Config → Connect bank → instant financial picture → upload 3–4 specific gap documents

Bank data is arguably superior evidence to PDFs: tamper-proof, FCA-regulated, digitally authenticated, no selective omission. A 12-month feed covers income, spending, accounts, debts, and regular commitments — the majority of Form E.

---

## Revised hero panel state machine

The existing 8-state machine (spec 16) expands to handle two entry paths: **connect** and **upload**. Both converge at the same review flow.

```
State 1: Connect or upload
    ├─→ (user connects bank) → State 2a: Bank connecting
    │       ↓
    │   State 2b: Bank data received — processing
    │       ↓
    │   State 3a: Auto-confirm (bank data)
    │       ↓
    │   States 3b–3n: Clarification questions
    │       ↓
    │   State 4: Summary + gap analysis
    │       ↓
    │   State 5: Upload gaps (targeted upload zone)
    │
    └─→ (user drops files) → existing States 2a–4 from spec 16
```

### State 1: Connect or upload

**Heading:** "Let's build your financial picture"

**Layout — two options, bank connect visually primary:**

```
┌────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────┐  │
│  │  🏦  Connect your bank                  │  │
│  │  Securely share 12 months of            │  │
│  │  transactions via Open Banking.         │  │
│  │  We'll do the rest.                     │  │
│  │                                         │  │
│  │  [Connect now]                          │  │
│  │                                         │  │
│  │  FCA regulated · Read-only · Revoke     │  │
│  │  any time                               │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ── or ──                                      │
│                                                │
│  ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐  │
│  ╎  Drag and drop your files in any order  ╎  │
│  ╎  and we'll do the rest.. (or upload)    ╎  │
│  └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘  │
└────────────────────────────────────────────────┘
```

**Bank connect card:** White background, 1px `grey-100` border, prominent. The trust line ("FCA regulated · Read-only · Revoke any time") addresses the top user concern.

**Upload zone:** Dashed border as today, visually secondary. Slightly smaller than current design to give the bank connect card visual priority.

**Return visit variant:** If bank already connected, heading becomes "Upload evidence to fill the remaining gaps". Bank connect card replaced with a summary: "✓ Barclays connected — 12 months of data". Upload zone is now the primary action.

### State 2a: Bank connecting

Tink Link opens in a new tab/popup. Hero panel shows:
- Heading: "Connecting to your bank..."
- Thin indeterminate progress bar (spec 18 Option C)
- Text: "Complete the secure login in the window that just opened"
- Fallback link: "Window didn't open? Click here"

### State 2b: Bank data received

Tink callback fires, data transforms via `tink-transformer.ts`. Hero panel shows:
- Heading: "Building your financial picture..."
- Progress messages cycle: "Reading your transactions..." → "Identifying income..." → "Categorising spending..."
- Duration: 2–5 seconds (transform is fast, no AI needed)

### States 3a–3n, 4: Unchanged

The existing auto-confirm → clarification → summary flow (spec 16 States 3a–4) works unchanged. Bank data produces the same `BankStatementExtraction` shape as AI upload, so the downstream pipeline is identical.

### State 5: Upload gaps (new)

After bank data review, the summary shows a **gap analysis** (see spec 21). The hero panel then transitions to a targeted upload state:

**Heading:** "3 documents to complete your picture"

```
┌────────────────────────────────────────────────┐
│  Your bank data filled most of your picture.   │
│  Upload these to reach full disclosure:        │
│                                                │
│  □ Pension CETV from Aviva                     │
│  □ Mortgage statement from Halifax             │
│  □ 3 recent payslips                           │
│                                                │
│  ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐  │
│  ╎  Drop any of these here (or upload)     ╎  │
│  └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘  │
│                                                │
│  [Finished for now — I'll do this later]       │
└────────────────────────────────────────────────┘
```

The gap list is **specific** — names the provider and document type based on what bank data revealed. "Pension CETV from Aviva" not "Upload pension details."

---

## Config flow amendments (spec 15)

### What stays

The discovery flow structure stays: one question per screen, progressive disclosure, ~90 seconds. Employment type and property ownership questions are essential — bank data can't tell us ownership splits or business structure.

### What changes

**Screen 1a** (first-time hub) copy update:
> "Start by connecting your bank, or upload a recent statement. It takes seconds to begin."

**Screen 1d** (config summary) adds a CTA:
> **[Connect your bank now]** · or upload documents manually

**New: Screen 1e** (post-config, pre-hub):
If user clicks "Connect your bank now," Tink Link opens immediately from the config summary. On return, the hub loads with bank data already processed. The user lands on a populated hub — not an empty one.

### What's removed from config

Nothing removed yet. Future optimisation: if bank data can infer savings/debts/other assets from transaction patterns, those config questions become confirmations rather than cold-start questions. This is a future iteration.

---

## Lozenge system changes

### New lozenge states

| State | Visual | Meaning |
|-------|--------|---------|
| **Empty** | Dark pill, white text | Evidence not yet provided |
| **Connected** | Dark pill, bank icon + tick | Bank account connected via Open Banking |
| **Uploading** | Dark pill, spinner | File being processed |
| **Uploaded** | Dark pill, tick + chevron | Document uploaded and processed |
| **Gap** | Outlined pill, amber border | Specific document still needed |

**Connected** is new. It replaces "Uploaded" for bank-sourced data and communicates that this evidence is live/verified, not a static PDF.

**Gap** is new. After bank data review, remaining evidence needs appear as outlined (not filled) lozenges with amber borders. They're visually distinct from "empty" — they represent known, specific gaps rather than generic placeholders.

### Lozenge generation after bank connect

Current: lozenges generated from config answers (static list).
New: lozenges generated from config + bank data analysis (dynamic).

After bank connection:
- "✓ Barclays current connected" (connected state)
- "✓ Income identified" (connected, derived from bank data)
- "✓ Spending — 12 months" (connected)
- "Pension CETV" (gap state, amber outline)
- "Mortgage statement" (gap state)
- "3 payslips" (gap state)

---

## Summary state changes (State 4)

### After bank connection

**Achievements:**
> ✓ Your income is visible — £3,218/month net from ACME Ltd (12 months of deposits)
> ✓ Your spending picture is ready — £2,450/month across 8 categories
> ✓ We can see your mortgage — £1,150/month to Halifax
> ✓ Your accounts and balances are up to date

**Framing:** "Your bank data is verified directly from your bank. No PDFs needed for accounts and spending."

**Gap analysis:**
> To reach full disclosure, you'll need:
> ! Your pension valuation (CETV) from Aviva — have you requested this yet? **Help with this**
> ! Your mortgage statement from Halifax — for interest rate, terms, and balance
> ! 3 recent payslips — for gross pay, tax, and pension contributions

**Key difference from current:** The todo list is short (3–4 items), specific (names providers), and contextualised (explains why each document is needed).
