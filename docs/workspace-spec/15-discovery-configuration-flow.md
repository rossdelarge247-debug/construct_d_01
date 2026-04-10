# Discovery & Configuration Flow

**Purpose:** The first-time experience that personalises the hub. Asks what the user has, tells them what they need, and generates the evidence checklist and section cards.
**Pattern:** One question per screen, conversational, progressive disclosure for follow-ups.
**Duration:** ~90 seconds (10 screens core, sub-flows add time for complex cases).

---

## Flow overview

```
Welcome / V1 replay
    ↓
Employment → Property → Pensions → Savings → Debts → Other assets
    ↓              ↓
    (progressive disclosure sub-flows for complex answers)
    ↓
Document checklist (what you'll need and why)
    ↓
What do you have today? (select documents available)
    ↓
Estimates? (yes/no for gap-filling)
    ↓
Plan for today (confirmation + time estimate)
    ↓
→ Hub (personalised, estimates pre-populated, hero panel ready)
```

---

## Screen 1: Welcome / V1 replay

### If V1 data exists

**Page title:** Clean, bold, minimal.

**Content:**

> "Welcome to your workspace. Here's what we know from your plan:"
>
> - You're married, separating
> - You have 2 children (8 and 11)
> - You own your home jointly
> - You're employed (PAYE)
> - Your confidence: high on income, low on pensions
>
> "We're going to use this to set up your financial picture. We just need to check a few things."

**CTA:** [That looks right →] · [Some of this has changed →]

"Some has changed" opens the relevant items for inline correction — does not restart the interview.

### If no V1 data

**Content:**

> "Let's set up your financial picture. We'll ask a few quick questions to understand your situation, then show you exactly what you need to gather."

**CTA:** [Let's go →]

### Design notes

- Hyper-focused: one purpose per screen, nothing else
- Clean page title at top
- This is the first screen the user sees in the workspace — it must feel confident and purposeful, not tentative

---

## Screen 2: Employment

**Question:** "How do you earn your income?"

**Options:**
- Employed (salary/wages)
- Self-employed or company director
- Both
- Not currently working
- Retired

**Triggers:**
- "Employed" → Income section on hub, payslip in evidence checklist
- "Self-employed or company director" → Income section + Business section on hub, SA302/tax returns/business accounts in evidence checklist
- "Both" → Income + Business sections, all employment and business evidence
- "Not currently working" → Income section (benefits focus), no payslip in checklist
- "Retired" → Income section (pension income focus), pension section emphasised

**Progressive disclosure:** If "Self-employed or company director" → sub-flow:
> "What's your business structure?"
> Sole trader · Limited company · Partnership · LLP

This determines the depth of business section and which documents are needed (business accounts vs company accounts vs partnership accounts).

---

## Screen 3: Property

**Question:** "Do you own any property?"

**Options:**
- Yes — I own (or jointly own) my home
- Yes — I own other property too (buy-to-let, abroad, land)
- No — I rent
- It's complicated

**Triggers:**
- "Own my home" → Your Home section on hub, mortgage statement + property valuation in evidence checklist
- "Other property too" → Your Home + Other Property sections, evidence per property
- "Rent" → No property section, but rent will be captured in Spending from bank statements
- "It's complicated" → brief clarifier sub-flow (beneficial interest, trust, living with family, etc.)

**Progressive disclosure — estimates:** If property owned:
> "Roughly, what do you think your home is worth?"
> £[input] · I have no idea

> "Is there a mortgage?"
> Yes · No (owned outright)

> If yes: "Roughly how much is outstanding on the mortgage?"
> £[input] · I don't know

These populate the Property section card on the hub as estimates immediately.

---

## Screen 4: Pensions

**Question:** "Do you have any pensions?"

**Options:**
- Yes — workplace pension
- Yes — private/personal pension
- Yes — more than one
- I'm not sure
- No

**Triggers:**
- Any "Yes" → Pensions section on hub, pension CETV letter in evidence checklist
- "I'm not sure" → Pensions section still shown, with guidance: "Most people who've been employed have at least one. We'll help you find out." Evidence checklist includes pension tracing.
- "No" → No pensions section (but can be added later via "+ More to disclose")

**Progressive disclosure — estimates:** If pension exists:
> "Do you have any idea what it might be worth?"
> Yes, roughly £[input] · No idea

> "Have you requested a CETV (Cash Equivalent Transfer Value)?"
> Yes · No · I don't know what that is

If "don't know what that is" → brief education: "A CETV is how pensions are valued for divorce. We'll help you request one — it's free but takes months, so starting early is important."

---

## Screen 5: Savings and investments

**Question:** "Do you have any savings, ISAs, or investments?"

**Options:**
- Yes — savings accounts
- Yes — ISAs, shares, bonds, or investment funds
- Yes — both
- No

**Triggers:**
- Any "Yes" → Accounts section scope expanded, savings/investment statements in evidence checklist
- "No" → Accounts section shows only current accounts

**Progressive disclosure — estimates:** If savings exist:
> "Roughly how much do you have in savings across all accounts?"
> £[input] · I'm not sure

---

## Screen 6: Debts

**Question:** "Do you have any debts, loans, or credit cards?"

**Options:**
- Yes — credit cards
- Yes — loans (personal, car, student)
- Yes — both
- No

**Triggers:**
- Any "Yes" → "What you owe" section on hub, credit card/loan statements in evidence checklist
- "No" → No debts section

**Progressive disclosure — estimates:** If debts exist:
> "Roughly, how much do you owe in total?"
> £[input] · I'm not sure

---

## Screen 7: Other assets

**Question:** "Do you have any of these?"

**Options (multi-select):**
- ☐ Cryptocurrency or digital assets
- ☐ A vehicle worth over £500
- ☐ Valuables (jewellery, art, collections) worth over £500
- ☐ Life insurance or endowment policies
- ☐ Assets in another country
- ☐ None of these

**Triggers:**
- Any selection → Other Assets section on hub with relevant sub-categories
- Crypto selected → explicit prompt later for approximate value
- "None" → No other assets section

---

## Screen 8: Document checklist

**Heading:** "Based on what you've told us, here's what you'll eventually need for full disclosure. You don't need it all today."

The checklist is **personalised** based on discovery answers. Only relevant items shown.

| Document | What it fills | Shown if |
|----------|-------------|----------|
| Your current account statements (12 months) | Income, spending, accounts | Always |
| Your payslips (last 3 months) | Income details, tax, pension contributions | Employed |
| Your mortgage statement | Property debt, monthly payments | Owns property with mortgage |
| Your pension statement or CETV letter | Pension value — takes months to get | Has pension |
| Your savings/investment statements | Account balances | Has savings/investments |
| Your credit card / loan statements | Debt balances, terms | Has debts |
| Your SA302 / tax returns (2 years) | Self-employment income | Self-employed |
| Your business accounts (2 years) | Business value, income | Has business |

Each item shows a one-line explanation of what it fills and why it matters. Items with long lead times (pension CETV) are flagged: "This takes months — start now."

---

## Screen 9: What do you have today?

**Heading:** "Which of these do you have to hand today? Select all that apply."

Checkboxes matching the personalised checklist from Screen 8:
- ☐ Bank statements
- ☐ Payslips
- ☐ Mortgage statement
- ☐ Pension documents
- ☐ Savings/investment statements
- ☐ Credit card / loan statements
- ☐ Business documents
- ☐ Other documents
- ☐ I don't have any documents yet

Whatever is selected determines the guided upload sequence in the hero panel. Unselected items become the "still to be uploaded" lozenges.

---

## Screen 10: Estimates question

### If they have some documents but not all

> "For the areas where you don't have documents yet, would you like to enter rough estimates?"
>
> "Estimates help us build a first-draft picture faster. They'll be clearly marked as estimates and replaced when you upload evidence later."
>
> [Yes — I'll estimate what I can →] · [No — I'll just work with what I have today →]

### If they have no documents

> "No documents yet? No problem. We can build a sketch from what you know off the top of your head."
>
> "This won't be as accurate as working from documents, but it gives you a starting point — and shows you exactly what documents to gather."
>
> [Start with estimates →] · [I'd rather come back when I have documents →]

"Come back" still shows the personalised checklist: "Here's what to gather. We'll be here when you're ready."

---

## Screen 11: Plan for today (optional — may be cut for speed)

**Heading:** "Here's what we'll do:"

Summary of what's about to happen:

> **Upload & analyse:**
> ☑ Bank statements → fills income, spending, accounts
> ☑ Payslips → fills income details
>
> **Estimate:**
> ☑ Property value
> ☑ Rough pension value
>
> **Skip for now:**
> ○ Mortgage statement
> ○ Savings statements
>
> "This should take about 10–15 minutes."

**CTA:** [Let's go →]

**Design consideration:** This screen sets expectations and reduces anxiety ("I know what's about to happen and how long it will take"). But it adds one more screen before the user starts doing real work. Could be cut if the config flow feels too long — the hero panel's ready state effectively shows the same information.

---

## Output of configuration

The configuration flow produces:

1. **Personalised section cards** for the hub — only sections relevant to this user
2. **Evidence lozenges** in the hero panel — showing what documents are expected
3. **Pre-populated estimates** in relevant section cards (if user chose to estimate)
4. **The "still to upload" list** — documents the user said they have today become the guided upload sequence; everything else goes into "still to be uploaded" for return visits
5. **Fidelity level** — typically "Not yet ready for first mediation conversation" (Sketch if estimates entered, otherwise pre-Sketch)

The user arrives at the hub (Screen 1 of the upload flow) with everything personalised and ready.

---

## Return visit handling

On return, the user lands directly on the hub — **not** the configuration flow. The hub shows:
- Hero panel with "Still to be uploaded" title and remaining lozenges
- Section cards with cumulative data from all previous sessions
- Fidelity level reflecting current state

The configuration is a **one-time setup**. It can be re-entered via settings/profile if the user's situation changes (e.g., discovers they have a pension they didn't know about, or becomes self-employed).
