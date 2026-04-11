> **SUPERSEDED** — This domain-by-domain analysis approach was refined into the tiered confidence model in `10b-ai-tiered-questions.md`. The domain intelligence from this spec and `11-ai-question-mapping.md` should drive the server-side AI prompt, but the user-facing UI follows 10b's simpler tiered pattern. Retained for design context.

# Workspace Design Spec — 10: AI-Led Analysis Flow (ARCHIVED)

## What this replaces

The current extraction review: upload → generic spinner → flat list of items → confirm/reject each.

This spec defines the replacement: an intelligent, domain-by-domain analysis that reasons about what it finds, asks targeted questions, and builds a confirmed financial picture through guided conversation.

---

## The core concept

When a user uploads a document, the system doesn't just extract numbers — it **analyses** what those numbers mean, **identifies** what needs clarification, and **asks** the right questions to resolve ambiguity.

The user experience should feel like handing a document to a brilliant, empathetic financial analyst who reads it, thinks about it, then talks you through what they found.

---

## Flow overview

```
UPLOAD
  ↓
AI THINKING (visual: intelligence at work, 3-5 seconds)
  ↓
DOMAIN ANALYSIS (staggered reveal, one domain at a time)
  ├── Income analysis → questions → resolved
  ├── Account structure → questions → resolved
  ├── Spending patterns → questions → resolved
  ├── Anomalies/flags → questions → resolved
  └── Gaps identified → guidance given
  ↓
SUMMARY + CONFIRMATION
  ↓
ITEMS ADDED TO PICTURE
```

---

## Phase 1: AI Thinking

### Duration
3-8 seconds (real processing time, not artificial delay).

### Visual treatment
NOT a spinner. NOT a progress bar. Something that communicates **thought**.

Possible approaches (to be refined with wireframes):
- Pulsing nodes/connections that suggest neural processing
- The document thumbnail with scanning lines moving across it
- Abstract shapes that coalesce into structured data
- Text that types out in real-time: "Reading your Barclays statement... Found 247 transactions across 11 months... Analysing income patterns..."

### Key requirements
- Must feel alive and intelligent, not mechanical
- Must give the impression of depth — "this is doing real work"
- Should surface real signals as they're detected (document type, provider, date range)
- Should transition smoothly into the domain analysis phase

---

## Phase 2: Domain Analysis

### Structure

The analysis is broken into **domains** — each representing a category of findings. Domains appear one at a time in priority order, with a staggered reveal animation.

### Domain priority order (for a current account statement)

| Priority | Domain | What it analyses | Key questions |
|----------|--------|-----------------|---------------|
| 1 | **Income** | Regular deposits, salary, benefits, other income | Employment type? Primary source? Fluctuating? |
| 2 | **Account structure** | Joint/sole, multiple accounts referenced | Confirm joint? Other accounts detected? |
| 3 | **Spending overview** | Category breakdown, monthly averages, trends | Housing = rent or mortgage? Any categories wrong? |
| 4 | **Commitments** | Regular outgoing payments (insurance, subscriptions, loans) | Any of these shared? Any ending soon? |
| 5 | **Anomalies** | Large unusual transactions, transfers, patterns | What was this transfer? Expected or concerning? |
| 6 | **Gaps** | What the statement DOESN'T show | Any other accounts? Pension contributions? Savings? |

### Different documents trigger different domains

**Payslip:**
1. Employment details (employer, role, full/part-time)
2. Income breakdown (gross, net, tax, NI)
3. Pension contribution (% and amount)
4. Benefits/allowances

**Pension letter:**
1. Pension type (DB/DC/SIPP)
2. Value assessment (CETV vs retirement income)
3. Provider and scheme details
4. Timing (retirement date, transfer options)

**Mortgage statement:**
1. Liability details (balance, rate, term)
2. Monthly payment assessment
3. Property linkage (which property?)
4. Joint/sole names

---

## Domain card design

Each domain is a card that appears with a staggered animation. A domain card has:

### Header
- Domain icon/label (e.g., "💰 Income analysis")
- Status: Analysing → Questions → Resolved

### Findings
Bullet points of what the AI detected, written in natural language:
- "Regular monthly deposit of £3,218 from ACME CORP detected"
- "This appears to be employment income (consistent amount, regular timing)"
- "No other significant income sources found in this period"

### Questions (if any)
Inline questions with simple answer options:

```
Is this your primary employment income?
[Yes, this is my main job]  [No, I have other income too]  [I'm not sure]
```

Questions should be:
- One at a time within each domain
- Plain language, not legal/financial jargon
- 2-4 answer options maximum
- Answering reveals the next question (if any) or resolves the domain

### Branching logic

Answers can trigger different paths:

```
"Is this your primary employment income?"
  → "No, I have other income too"
    → "What other income do you receive?"
    → [Self-employment] [Second job] [Benefits] [Rental income] [Other]
      → "Self-employment"
        → Flag: "Self-employment detected. We'll need business accounts and tax returns for the full picture."
        → Category adjusted from "employment" to "mixed income"
```

### Resolution
When all questions in a domain are answered:
- Domain card transitions to "resolved" state (sage left border, checkmark)
- Findings update to reflect the answers
- The confirmed items are shown clearly
- Next domain appears below

---

## Phase 3: Summary + Confirmation

After all domains are resolved, a summary appears:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ✓ Analysis complete                                │
│                                                     │
│  From your Barclays statement, we've built:         │
│                                                     │
│  · Income: £3,218/mo (employment, confirmed)        │
│  · 1 joint current account (balance: £1,842)        │
│  · Monthly outgoings: £2,450 across 6 categories    │
│  · 1 item flagged for follow-up                     │
│                                                     │
│  [Add all to your picture]  [Review again]          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

"Add all to your picture" → items flow into the financial picture below. Category tab status updates. Progress bar adjusts.

---

## AI Prompt design

The extraction API needs to return a structured analysis, not just raw items.

### Response structure

```json
{
  "document_summary": "Barclays joint current account statement, 11 months (Apr 2025 - Mar 2026)",

  "domains": [
    {
      "domain": "income",
      "icon": "💰",
      "label": "Income analysis",
      "findings": [
        "Regular monthly deposit of £3,218 from ACME CORP",
        "Consistent amount suggests stable employment income",
        "Child benefit payments of £96.25/mo from HMRC detected"
      ],
      "assessment": "stable_employment",
      "items": [
        { "label": "Employment income", "value": 3218, "period": "monthly", ... },
        { "label": "Child benefit", "value": 96.25, "period": "monthly", ... }
      ],
      "questions": [
        {
          "id": "income_primary",
          "text": "Is this your main employment income?",
          "options": [
            { "value": "yes", "label": "Yes, this is my main job" },
            { "value": "other_income", "label": "No, I have other income too" },
            { "value": "unsure", "label": "I'm not sure" }
          ],
          "follow_ups": {
            "other_income": {
              "text": "What other income do you receive?",
              "options": [
                { "value": "self_employed", "label": "Self-employment" },
                { "value": "second_job", "label": "Second job" },
                { "value": "benefits", "label": "Benefits" },
                { "value": "rental", "label": "Rental income" }
              ]
            }
          }
        }
      ]
    },
    {
      "domain": "account_structure",
      "icon": "🏦",
      "label": "Account structure",
      "findings": [
        "Joint account detected (two names on statement)",
        "Sort code: 20-XX-XX, Account: ****4521"
      ],
      "items": [
        { "label": "Joint current account", "value": 1842, "period": "total", "ownership_hint": "joint", ... }
      ],
      "questions": [
        {
          "id": "joint_confirm",
          "text": "We detected this is a joint account. Is that correct?",
          "options": [
            { "value": "yes", "label": "Yes, it's joint" },
            { "value": "no", "label": "No, it's in my name only" }
          ]
        }
      ]
    },
    {
      "domain": "spending",
      "icon": "📊",
      "label": "Spending patterns",
      "findings": [
        "Monthly outgoings average £2,450",
        "Largest category: Housing (£2,150/mo)",
        "6 spending categories identified"
      ],
      "categories": [
        { "category": "Housing", "monthly_average": 2150, "transaction_count": 1 },
        { "category": "Insurance", "monthly_average": 232, "transaction_count": 4 },
        ...
      ],
      "questions": [
        {
          "id": "housing_type",
          "text": "Your largest outgoing is £2,150/mo for housing. Is this your mortgage or rent?",
          "options": [
            { "value": "mortgage", "label": "Mortgage payment" },
            { "value": "rent", "label": "Rent" },
            { "value": "other", "label": "Something else" }
          ]
        }
      ]
    },
    {
      "domain": "anomalies",
      "icon": "⚠️",
      "label": "Things to check",
      "findings": [
        "Large transfer of £5,000 to account ****8832 on 15 March",
        "This is unusual compared to regular transaction patterns"
      ],
      "questions": [
        {
          "id": "large_transfer",
          "text": "We noticed a £5,000 transfer on 15 March. Do you know what this was?",
          "options": [
            { "value": "savings", "label": "Transfer to my savings" },
            { "value": "payment", "label": "Payment to someone" },
            { "value": "dont_know", "label": "I don't know" },
            { "value": "private", "label": "I'd rather not say" }
          ]
        }
      ]
    },
    {
      "domain": "gaps",
      "icon": "🔍",
      "label": "What we didn't find",
      "findings": [
        "No pension contributions visible in this account",
        "No savings account transfers detected",
        "No child maintenance payments visible"
      ],
      "questions": [
        {
          "id": "other_accounts",
          "text": "Do you have other bank accounts, savings accounts, or ISAs not shown in this statement?",
          "options": [
            { "value": "yes", "label": "Yes, I have other accounts" },
            { "value": "no", "label": "No, this is my main account" },
            { "value": "partner_manages", "label": "My partner manages other accounts" }
          ]
        }
      ]
    }
  ]
}
```

---

## Question UX principles

1. **One question at a time per domain.** Don't overwhelm. Show the first question, resolve it, then show the next if there is one.
2. **2-4 options maximum.** Not free text for the primary response. Free text only as a follow-up if needed.
3. **Every question has an "I don't know" or escape option.** Never force false certainty.
4. **Answers are non-destructive.** You can always go back and change. They inform the analysis, they don't lock anything.
5. **The system explains WHY it's asking.** Not just "Is this joint?" but "We detected two names on this statement. Is this a joint account?"
6. **Answers that trigger flags are handled with care.** Self-employment detection, large unexplained transfers, hidden accounts — these are flagged gently, not alarmingly.

---

## Visual treatment requirements

### Domain cards
- Each domain is a substantial card (surface background, 2px border, generous padding)
- Staggered entrance animation (slide up + fade, 300ms between domains)
- Active domain: warmth left border
- Resolved domain: sage left border, subtle green state, checkmark
- Questions appear within the domain card, below the findings
- Answer buttons are bold, tappable, clear selected state

### "AI thinking" state
- Must feel premium and intelligent
- The document being "read" should be visually represented
- Real-time text feedback as signals are detected
- Smooth transition into the first domain card

### Question interaction
- Selected answer: warmth fill, white text (like the Mojo pattern)
- Unselected: cream-dark background
- Follow-up questions slide in below the answered question
- Domain resolves with a brief success animation when all questions answered

---

## How this changes the current extraction API

The current API returns:
```json
{ "classification": {...}, "extraction": { "items": [...], "spending_categories": [...] } }
```

The new API needs to return:
```json
{ "classification": {...}, "analysis": { "document_summary": "...", "domains": [...] } }
```

This requires a different AI prompt — one that analyses and reasons, not just extracts. The prompt needs to:
1. Identify what domains are relevant for this document type
2. Extract findings per domain in natural language
3. Generate targeted questions with branching options
4. Assess patterns (stable income, self-employment signals, anomalies)
5. Identify gaps (what's NOT in the document that should be asked about)

---

## Scope

This replaces:
- The current extraction review component
- The current processing messages
- The flat "confirm all" pattern

This does NOT replace:
- The upload zone itself (drag/drop stays the same)
- The category tab structure
- The financial picture below
- The manual entry modal

---

## Next steps

1. Wireframes from founder for: AI thinking visual, domain card, question interaction, staggered reveal
2. Refine this spec based on wireframes
3. Build the new AI prompt (analysis, not just extraction)
4. Build the domain card component
5. Build the question flow component
6. Replace the extraction review with the new analysis flow
