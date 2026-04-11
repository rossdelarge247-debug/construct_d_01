# Discovery & Configuration Flow

**Purpose:** The first-time experience that personalises the hub. Asks what the user has, tells them what they need, and generates the evidence checklist and section cards.
**Pattern:** One question per screen with inline progressive disclosure for follow-ups. No separate sub-flow screens — follow-ups expand within the current question.
**Duration:** ~90 seconds (8 core screens, inline expansions add a few seconds for complex answers).

---

## Persistent UI elements during configuration

### Progress bar

A stepper/progress bar appears at the top of the config card on every screen. It shows:
- Current position within the overall flow (filled segments)
- Remaining steps (unfilled segments)

The bar advances with each primary question. Inline progressive disclosure (estimates, counts) does NOT advance the bar — they're part of the same step.

### Title bar

During config, the title bar shows:
- "Overview" (left) — page identity
- "Configuring the service" (centre/right) — mode indicator

### Section labels

Each question screen has a section label above the question text that categorises the topic:
- "Basics: Recap" (V1 playback)
- "Income: Employment" (employment question)
- "Assets: Property" (property question)
- "Assets: Pensions" (pension question)
- "Assets: Savings" (savings question)
- "Liabilities: Debts" (debts question)
- "Assets: Other" (other assets question)
- "End of the beginning" (summary)

These labels hint at the Form E structure without showing Form E section numbers.

### Navigation

Every question screen has:
- **[Next]** — primary button, advances to next question
- **Back** — link, returns to previous question

---

## Flow overview

```
1a. First-time hub (Get started — single CTA, nothing else)
    ↓
1b. V1 replay (if V1 data exists)
    ↓
1c. Discovery questions (Employment → Property → Pensions → Savings → Debts → Other)
    ↓  ↑ (inline progressive disclosure: estimates, counts, follow-ups)
1d. Config summary (lozenges showing what's needed)
    ↓
→ Hub (personalised, estimates pre-populated, hero panel ready)
```

---

## Screen 1a: First-time hub — pre-configuration

**Title bar:** "Overview" (left), [TITLE BAR] (right). Nav bar with hamburger, bell (notifications), cog (settings).

**Page content: a single card on an otherwise empty page.**

> **[Progress bar — start position]**
>
> **Start building your financial picture now**
>
> Start with rough estimates, or a recent current account bank statement, it takes seconds to begin preparing your disclosure picture. We will guide you through exactly what is needed, and you can come back as many times as needed.
>
> **[Get started]**

**Nothing else on the page.** No section cards, no hero panel, no financial summary. The hub page exists but is intentionally empty until configuration generates its content.

**Design principles:**
- Hyper-focused first-time dashboard — wizard only, nothing else
- Very clean page title
- Single purpose, single CTA
- The copy sets expectations: fast ("seconds"), flexible ("come back as many times"), two valid paths ("rough estimates, or a bank statement")

---

## Screen 1b: V1 playback

**Title bar:** "Overview" (left), "Configuring the service" (centre-right)

**Progress bar:** Advanced to first segment.

**Section label:** "Basics: Recap"

**Content:**

> Here's what we know from your plan
>
> - You're married, separating
> - You have children
> - You own your home jointly
> - You have a mortgage

**CTAs:** **[This looks right]** · Not quite right

**If "Not quite right":** Opens relevant items for inline correction on the same screen. Does not restart the flow.

**If no V1 data exists:** This screen is skipped. The flow advances directly from 1a to the first discovery question.

---

## Screen 1c: Discovery questions

All discovery questions follow the same layout pattern:

```
┌─────────────────────────────────────────────┐
│  [Progress bar]                              │
│                                              │
│  [Section label]                             │
│  [Question text]                             │
│                                              │
│  ○ Option 1                                  │
│  ○ Option 2                                  │
│     ↳ [inline expansion if selected]         │
│  ○ Option 3                                  │
│  ○ Option 4                                  │
│                                              │
│  [Next]  Back                                │
└─────────────────────────────────────────────┘
```

### Question: Employment

**Section label:** "Income : Employment"

**Question:** "How do you earn your income?"

**Options (radio):**
- ○ Employed (salary/wages)
- ○ Self-employed or company director
- ○ Both
- ○ Not currently working
- ○ Retired

**Inline progressive disclosure:** If "Self-employed or company director" selected:
> ↳ "What's your business structure?"
> ○ Sole trader · ○ Limited company · ○ Partnership · ○ LLP

**Triggers:**
- Employed → Income section, payslip in evidence lozenges
- Self-employed/director → Income + Business sections, SA302/tax returns/business accounts in evidence lozenges
- Both → Income + Business, all employment and business evidence
- Not currently working → Income section (benefits focus)
- Retired → Income section (pension income focus)

### Question: Property

**Section label:** "Assets : Property"

**Question:** "Do you own a property"

**Options (radio):**
- ○ Yes — I own (or jointly own) my home
- ○ Yes — I own other property too (buy-to-let, abroad, land)
- ○ Both
- ○ No — I rent
- ○ It's complicated

**Inline progressive disclosure — property count:** If "other property too" or "Both" selected:
> ↳ Numbered selector appears: **[1] [2] [3] [4]** — how many additional properties?

**Inline progressive disclosure — estimates:** If "own my home" or "Both" selected:
> ↳ "Do you know the estimated value?" **[Please select ▾]** (dropdown with ranges or free input)

**Triggers:**
- Own home → Your Home section, mortgage statement + property valuation in evidence lozenges
- Other property → Your Home + Other Property sections, evidence per property
- Rent → No property section (rent captured from bank statements in Spending)
- It's complicated → inline clarifier (beneficial interest, trust, living with family)

### Question: Pensions

**Section label:** "Assets : Pensions"

**Question:** "Do you have any pensions?"

**Options (radio):**
- ○ Yes — workplace pension
- ○ Yes — private/personal pension
- ○ Yes — more than one
- ○ I'm not sure
- ○ No

**Inline progressive disclosure — estimates:** If any "Yes" selected:
> ↳ "Do you have any idea what it might be worth?" £[input] / No idea
> ↳ "Have you requested a CETV?" Yes / No / I don't know what that is

If "don't know what that is" → inline education: "A CETV is how pensions are valued for divorce. We'll help you request one — it's free but takes months, so starting early is important."

**Triggers:**
- Any Yes → Pensions section, CETV letter in evidence lozenges
- I'm not sure → Pensions section shown with guidance. Evidence lozenges include pension tracing.
- No → No pensions section (addable later via "+ More to disclose")

### Question: Savings and investments

**Section label:** "Assets : Savings"

**Question:** "Do you have any savings, ISAs, or investments?"

**Options (radio):**
- ○ Yes — savings accounts
- ○ Yes — ISAs, shares, bonds, or investment funds
- ○ Yes — both
- ○ No

**Inline progressive disclosure — estimates:** If any "Yes":
> ↳ "Roughly how much across all accounts?" £[input] / I'm not sure

**Triggers:**
- Any Yes → Accounts section expanded, savings/investment statements in evidence lozenges
- No → Accounts section shows only current accounts

### Question: Debts

**Section label:** "Liabilities : Debts"

**Question:** "Do you have any debts, loans, or credit cards?"

**Options (radio):**
- ○ Yes — credit cards
- ○ Yes — loans (personal, car, student)
- ○ Yes — both
- ○ No

**Inline progressive disclosure — estimates:** If any "Yes":
> ↳ "Roughly, how much do you owe in total?" £[input] / I'm not sure

**Triggers:**
- Any Yes → "What you owe" section, credit card/loan statements in evidence lozenges
- No → No debts section

### Question: Other assets

**Section label:** "Assets : Other"

**Question:** "Do you have any of these?"

**Options (multi-select):**
- ☐ Cryptocurrency or digital assets
- ☐ A vehicle worth over £500
- ☐ Valuables (jewellery, art, collections) worth over £500
- ☐ Life insurance or endowment policies
- ☐ Assets in another country
- ☐ None of these

**Triggers:**
- Any selection → Other Assets section with relevant sub-categories
- None → No other assets section

---

## Screen 1d: Configuration summary

**Progress bar:** Final segment — nearly complete.

**Section label:** "End of the beginning"

**Content:**

> **We now know everything you need to prepare**
>
> [Evidence lozenges — personalised from answers:]
> - Income
> - 1 Mortgage
> - 2 Accounts
> - Pensions
> - Spending
> - 2 Other assets

**CTAs:** **[Next]** · Back

**Design note:** These lozenges are the SAME component that appears in the hero panel on the hub. The user sees them generated here and then immediately recognises them on the hub. Visual continuity between config output and hub input.

**"End of the beginning"** acknowledges this is setup, not the work itself. The real work starts on the hub.

---

## Transition to hub

After the user clicks [Next] on the summary screen, the page transitions to the post-config hub:

- Hero panel appears with the evidence lozenges from the summary
- Section cards appear below, personalised from config
- Estimates entered during inline progressive disclosure are pre-populated in relevant section cards
- Fidelity label shows "Not yet ready for first mediation conversation"

---

## What the config flow does NOT include (change from previous spec)

The following screens from the earlier spec version have been **removed** to keep the flow short:

- ~~Document checklist screen~~ — The config summary (1d) shows the lozenges which serve as the evidence checklist. A separate detailed checklist screen is unnecessary.
- ~~"What do you have today?" screen~~ — The hero panel's drag-and-drop zone on the hub handles this. The user uploads what they have; the system classifies it. No need to pre-declare.
- ~~"Estimates?" yes/no screen~~ — Estimates are captured inline during discovery questions (progressive disclosure). No separate gate needed.
- ~~"Plan for today" screen~~ — The hero panel's ready state on the hub effectively shows this. Removing it gets the user to the hub faster.

**Result:** The config flow is now 4 screens (1a → 1b → 1c questions → 1d summary) instead of 11. The core discovery questions (1c) may involve 6-7 question screens depending on the user's situation, but each is fast (5-10 seconds with inline expansions).

---

## Output of configuration

The configuration flow produces:

1. **Personalised section cards** for the hub — only sections relevant to this user
2. **Evidence lozenges** in the hero panel — showing what documents are expected (same lozenges shown in summary)
3. **Pre-populated estimates** in relevant section cards (from inline progressive disclosure)
4. **Fidelity level** — "Not yet ready for first mediation conversation" (Sketch if estimates entered, otherwise pre-Sketch)

---

## Return visit handling

On return, the user lands directly on the hub — **not** the configuration flow. The hub shows:
- Hero panel with remaining evidence lozenges and drag-and-drop zone
- Section cards with cumulative data from all previous sessions
- Fidelity level reflecting current state

The configuration is a **one-time setup**. It can be re-entered via settings/profile if the user's situation changes.
