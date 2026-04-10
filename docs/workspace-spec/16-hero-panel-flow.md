# Hero Panel — Upload, Processing & Review Flow

**Purpose:** The hero panel is a single, multi-purpose component at the top of the hub page. It guides users through the entire evidence upload cycle without navigating away from the hub.
**Pattern:** State machine — the panel transforms through states in place. Section cards below fade to 70% during active states and return to full opacity on completion.
**Spec references:** Extraction logic from `13-extraction-decision-tree-documents.md`, wizard logic from `14-extraction-decision-tree-wizard.md`.

---

## State machine overview

```
State 1: Ready for upload
    ↓ (user drops files or clicks upload)
State 2a: Uploading (initial — no context yet)
    ↓ (files received, classification begins)
State 2b: Uploading with context (file count, document type identified)
    ↓ (upload complete, analysis begins)
State 2c: Analysing (files uploaded, processing transactions)
    ↓ (analysis complete)
State 2d: Ready for review (decision point — review or upload more)
    ↓ (user clicks "Review uploads now")
State 3a: Auto-confirm (batch accept of high-confidence items)
    ↓ (user accepts)
State 3b–3n: Clarification questions (one per screen, driven by decision trees)
    ↓ (all questions answered or skipped)
State 4: Summary (achievements + todo list)
    ↓ (user clicks "Finished for now" or "Upload more")
State 1 (return): Ready for more uploads — OR → Hub returns to full state
```

---

## State 1: Ready for upload

### First visit (post-configuration)

**Hero panel heading:** "Upload evidence to complete your preparation"

**Evidence lozenges:** Personalised from config. Each is a rounded pill showing the expected evidence type:
- Current account
- Pensions
- Mortgage details
- Savings account
- 2 Other assets

Lozenges reflect what the user told us they need during config. Count prefix appears when multiple items exist ("2 Other assets").

**Drag-and-drop zone:** Large dotted border area.
- Text: *"Drag and drop your files in any order and we'll do the rest.. (or upload)"*
- "upload" is an underlined link triggering system file browser
- Zone accepts multiple files simultaneously

**Section cards below:** Full opacity, showing estimates from config or empty states.

### Return visit

**Hero panel heading:** "Upload more evidence to complete your preparation" (note: "more" added)

**Lozenges:** Updated to reflect cumulative state:
- Uploaded lozenges show tick + count ("✓ 1 Current account")
- Remaining lozenges still in default state ("Pensions", "Mortgage details")
- All lozenges have chevron for expandable flyout

**Section cards below:** Full opacity, showing cumulative data from all previous sessions.

**Additional element (after first upload session):** Info box below the upload zone if fidelity threshold reached:
> "There is enough information here to have a first conversation with a mediator or legal professional, we strongly recommend continuing to upload the remaining evidence highlighted above as soon as possible. You have enough to now share via the collaboration feature."

---

## State 2a: Uploading — initial

**Triggered by:** User drops files into the zone or selects files via upload link.

**Page behaviour:** Section cards fade to 70% opacity. Hero panel becomes the sole focus.

**Hero panel content:**
- Lozenges: unchanged
- AI loading animation replaces the drag-and-drop zone
- Animation: sparkle/processing icons (placeholder — final animation TBD, should feel sophisticated not whimsical)
- Text: "Generating suggestions..."

**Duration:** Brief — transitions to 2b as soon as file classification begins (typically 1–3 seconds).

---

## State 2b: Uploading with context

**Triggered by:** AI has classified the uploaded files and identified document types.

**Hero panel content:**
- **Lozenges update:** The relevant lozenge gets a spinner icon and count prefix. E.g., "Current account" becomes "⟳ 1 Current account" — spinner indicates active processing.
- **Contextual messaging:**
  - "You are uploading 42 files...."
  - "2 months of Barclays bank statements..."
- AI animation continues around the messaging.

**Lozenge state:** Empty → ⟳ Spinner (uploading/classifying this evidence type)

**What makes this state important:** The user immediately knows the system understood what they uploaded. "2 months of Barclays bank statements" is specific — not "processing your documents." This is the first "it knows what it's doing" signal.

---

## State 2c: Analysing

**Triggered by:** Files fully uploaded, AI now processing content (extracting transactions, identifying income, categorising spending, etc.).

**Hero panel content:**
- **Lozenges update:** Spinner stops, tick appears. "✓ 1 Current account" — upload received, now analysing content.
- **Messaging transitions:**
  - "You are uploading 2 files...."
  - "Files uploaded, processing the transactions..."
- AI animation continues.

**Lozenge state:** ⟳ Spinner → ✓ Tick (uploaded, analysis in progress)

---

## State 2d: Ready for review

**Triggered by:** AI analysis complete. Extraction results ready.

**Hero panel content:**
- **Lozenges:** "✓ 1 Current account" — tick confirmed
- **Central message:** "100% complete"
- **Two CTAs:**
  - **[Review uploads now]** — primary button, starts the Q&A flow
  - **"Upload more documents"** — link, returns to State 1 for additional files before review

**Section cards:** Still faded at 70%.

**Design note:** "100% complete" refers to upload processing, not the financial picture. Consider whether "Ready for review" or "Upload processed" is clearer to avoid confusion with picture completeness.

---

## State 3a: Auto-confirm — batch accept

**Triggered by:** User clicks "Review uploads now."

**Hero panel heading changes to:** "Let's go through what you just shared with us"

**New elements:**
- **Progress bar** appears beneath the lozenges — shows position within the review flow
- **Lozenge with dropdown:** The processed lozenge ("✓ 1 Current account") now has a chevron. Clicking it opens a flyout showing what was received:
  ```
  ✓ 1 Current account ▾
    June 2026 Barclays statement
    July 2026 Barclays statement
  ```

**Content — "Processed: Please confirm":**

> "We automatically found these easy ones.."
>
> ☐ Monthly salary: £3,218 net from ACME Ltd (2 deposits, same source, consistent amount)
> ☐ Child Benefit: £96.25/month from HMRC
>
> **[Accept]** · Cancel and start again

**Interaction:**
- Checkboxes allow selective acceptance — user can uncheck an item if it's wrong
- Unchecked items route to the clarification flow as questions
- "Cancel and start again" is a full escape — returns to pre-review state

**What drives this state:** Items from spec 13 with confidence ≥0.95, clear source identification, and unambiguous categorisation.

---

## States 3b–3n: Clarification questions — one per screen

**Triggered by:** User accepts auto-confirmed items. System transitions to the first clarification question.

**Hero panel heading:** Remains "Let's go through what you just shared with us"

**Progress bar:** Advances with each answered question.

**Content format — consistent across all questions:**

> **"Processed: Please confirm"**
>
> [Question text — describes what was found and asks for classification]
>
> [Explanation of reasoning — why the system thinks this]
>
> [Answer options — button primary + link secondary]

### Question types (from wireframes)

**Type 1: Binary with reasoning (Screen 3b pattern)**

> "£1,150 goes to Halifax on the 1st of each month. Is this your mortgage?"
>
> When we see a regular payment to a building society or bank for this sort of amount each month we assume that it might be a mortgage payment going out...
>
> **[Yes it is]** · No it's something else

If "No it's something else" → follow-up: "What is this payment?" with options (Rent, Savings, Loan repayment, Other: ___)

**Type 2: Radio options (Screen 3c pattern)**

> "£89/month to Aviva. Is this your pension contribution, or insurance?"
>
> ○ Pension
> ○ Insurance
>
> **[Pension]** · No it's something else

Primary CTA label matches selected radio option.

**Type 3: Joint account detection (Screen 3d pattern)**

> "We can see a joint account holder on this account. Is this a joint account with your partner?"
>
> Explanation as to why we made this assumption
>
> **[Yes it is]** · No it's something else

### Question flow rules

1. Questions are **driven by the extraction decision trees** (spec 13). Every question maps to a Form E field.
2. Questions appear **one at a time**. Answering advances to the next question.
3. **"No it's something else"** always routes to a follow-up with alternative options.
4. Questions can be **skipped** ("I'll answer this later") — marked as TBC on the hub.
5. **The user can go back and change a previous answer.** The flow is not one-way.
6. **No superfluous questions.** If it doesn't fill a Form E field, it isn't asked. See the "don't ask" list in spec 13.
7. **Typical question count:** 5–7 for a straightforward bank statement. Fewer for structured documents (payslip, mortgage statement).

---

## State 4: Summary

**Triggered by:** All clarification questions answered (or skipped).

**Hero panel heading changes to:** "Summary time"

**Content — two sections:**

### What's been achieved (tick items)

> ✓ Your monthly spending behaviours are ready for a first mediation chat or conversation
>
> ✓ We've got 2 month of your Barclays Bank current account statements, this is enough for a first mediation chat or conversation (10 more months for full disclosure)
>
> ✓ We've got a good understanding of your income, ready for a first mediation conversation

**Key principle:** Every achievement is framed in terms of **what the user can now DO** — "ready for a first mediation chat" — not data metrics ("8 items extracted").

### On the todo list for next time...

> ! Upload your pension details, we have your estimates, so this doesn't block your first mediation chat. But have you applied for the official valuation yet? **Help with this**
>
> ! Upload your mortgage statements
>
> ! Upload your payslips for 3 months

**Key principle:** Todo items are **specific and actionable** with context. The pension item includes proactive guidance ("Have you applied for the official valuation yet?") and a help link for CETV requests.

### Statement completeness

If partial months uploaded:
> "You've shared 2 months of Barclays statements. This is enough for a first draft, but you'll need 12 months total for formal disclosure."

### CTAs

**[Finished for now]** — primary. Transitions hero panel back to State 1 (return) and section cards return to full opacity with updated data.

**"Upload more documents now, I'm on a roll"** — link. Returns to State 1 for another upload cycle.

---

## State transitions: section card behaviour

| Hero panel state | Section cards |
|-----------------|---------------|
| State 1 (ready) | Full opacity |
| States 2a–2d (upload/processing) | Faded to 70% |
| States 3a–3n (Q&A) | Faded to 70% |
| State 4 (summary) | Faded to 70% (forces user to read summary before seeing updated picture) |
| After "Finished for now" | Full opacity — updated with confirmed data |

---

## Lozenge state machine

| Lozenge state | Visual | Interaction |
|--------------|--------|-------------|
| **Empty** | Dark pill, white text (e.g., "Pensions") | Not interactive |
| **Uploading** | Dark pill, spinner icon, count prefix (e.g., "⟳ 1 Current account") | Not interactive during upload |
| **Uploaded** | Dark pill, tick icon (e.g., "✓ 1 Current account") | Chevron → expandable flyout |
| **Flyout open** | Shows list of received documents (e.g., "June 2026 Barclays statement") | Click to collapse |

On return visits, uploaded lozenges retain their tick and flyout shows cumulative documents. Count updates (e.g., "✓ 1 Current account" → "✓ 2 Current accounts" if a second account is uploaded later).

---

## Multi-document upload handling

If the user uploads multiple document types simultaneously (e.g., bank statements + payslip + mortgage statement):

1. **Classification happens first.** AI identifies each document type and routes files to the correct lozenge. Multiple lozenges may show spinners simultaneously.
2. **Processing is parallel** but results are presented sequentially — bank statement items first, then payslip, then mortgage.
3. **Cross-document validation** happens after individual processing. If payslip confirms bank statement income, the summary notes: "Your payslip confirms your bank statement income — £3,218 net/month."
4. **The Q&A flow covers all documents in one pass.** The user doesn't do separate Q&A per document type — it's one continuous flow with questions grouped logically (all income questions, then spending, then property, etc.).

---

## Error handling

| Error | User sees | Recovery |
|-------|----------|---------|
| File too large | "This file is too large. Try splitting your bank statements into individual months." | Return to upload state |
| Unsupported format | "We can't read this file type. We accept PDF, JPG, and PNG." | Return to upload state |
| AI processing fails | "Something went wrong reading your document. Would you like to try again?" | [Try again] · [Upload a different file] · [Enter details manually] |
| AI returns no extractable data | "We couldn't find financial data in this document. Is it a financial document?" | [Try again] · [It's a different type of document] · [Skip this one] |
| Timeout (>120s) | "This is taking longer than expected. We'll keep working — you can wait or come back later." | [Keep waiting] · [Come back later] (auto-saves progress) |
