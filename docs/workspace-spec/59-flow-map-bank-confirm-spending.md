# Spec 59 — Flow Map 3: Bank Connection, Tier Confirmation, Spending Review

**Date:** 17 April 2026
**Purpose:** Post-profiling journey through to first complete picture. Covers bank connection, the reveal, tier-based confirmation, and spending review.

**Entry:** From 3.7 Profiling transition
**Exit:** To 5.1 "Your picture is ready" (enters Share phase)

---

## Bank connection flow

### Screen 4.1 — Bank selection

**Content:** Grid of bank logos + search
**Popular banks:** Barclays, HSBC, Lloyds, NatWest, Santander, Nationwide, Halifax, Monzo, Starling

**Actions:**
- [Select a bank] → 4.2 Tink OAuth
- [Search] → filter logos
- [My bank isn't here] → 4.3 CSV upload fallback
- [Enter manually instead] → 4.4 Manual entry

---

### Screen 4.2 — Tink OAuth (external)

**Flow:** Redirect to Tink → bank selection confirmation → bank login → transaction consent → redirect back

**Outcomes:**
- Success → 4.5 Processing
- Cancelled → 4.1 Bank selection (preserve state)
- Error (bank unavailable, timeout) → 4.2a Error recovery

---

### Screen 4.2a — Bank connection error

**Content:** "Something went wrong connecting to [Bank]. What would you like to do?"

**Actions:**
- [Try again] → 4.2
- [Try a different bank] → 4.1
- [Upload statements instead] → 4.3
- [Continue manually] → 4.4

---

### Screen 4.3 — CSV/PDF upload fallback

**Actions:**
- [Upload CSV] → 4.3a Parse and classify
- [Upload PDF statements] → 4.3a Parse and classify
- [Back to bank selection] → 4.1

---

### Screen 4.4 — Manual entry path

**Content:** "Build your picture manually. We'll walk you through each section."

**Path:** Skip to section-by-section manual entry (income, property, accounts, pensions, debts, spending)

---

### Screen 4.5 — Processing + reveal

**Content:** "Building your picture..." with staggered fade-in of discovered items:
- Salary
- Mortgage
- Car finance
- Child Benefit (validates profile count)
- Insurance payments (to be disambiguated)
- Council tax
- Utilities
- Transaction count

**Actions:** (at end)
- [Continue to review →] → 4.6 Confirmation intro
- [Add another bank account] → 4.1 (connect second bank)

---

### Screen 4.5a — Connect additional account (optional)

**Content:** "Your picture is stronger with all your accounts. Want to add another?"

**Actions:**
- [Add another bank] → 4.1
- [No, continue with current] → 4.6

---

## Phase A: Tier-based confirmation

### Screen 4.6 — Confirmation intro

**Content:** "We found 80% of your picture. A few things need your input."

**Breakdown shown:**
- X matched items (tier 1) — auto-confirmed
- Y disambiguations (tier 2) — need your input
- Z unknowns (tier 3) — "what is this?"

**Actions:**
- [Let's work through them →] → 4.7 First confirmation screen

---

### Screen 4.7 — Tier 1: Matched items (batch)

**Content:** Cards for items auto-matched from profile + bank data
Examples:
- ✓ Mortgage with Halifax — £1,150/mo
- ✓ Salary from NHS — £2,400/mo
- ✓ Car finance with BMW Financial — £485/mo

**Per-item actions:**
- Tap for detail / evidence
- [Not right?] → inline correction

**Screen-level action:**
- [Looks right — continue →] → 4.8 First Tier 2 or Tier 3

---

### Screen 4.8 — Tier 2: Disambiguation (e.g. insurance)

**Content:** "You have 3 insurance payments. Match them to the right type."
Per-row: inline radio with contextually filtered options (profile-aware)

**Actions:**
- Per row: select type
- [Continue] → next Tier 2 or Tier 3

---

### Screen 4.9 — Tier 2: Self-employed income disambiguation

**Shown only if self-employed path**

**Content:** "Which of these credits from [Company] are salary vs dividends vs client income?"
Per-row: inline radio (salary / dividends / client income / other)

**Actions:**
- [Continue] → 4.9a Business details follow-up

---

### Screen 4.9a — Self-employed business follow-up

**Questions:**
- Q: What's the approximate value of your business? (optional — "Skip if unsure")
- Q: Do you hold shares in the company? (radio: 100% / jointly with partner / with others)
- Q: Do you have a director's loan account? (radio: yes [amount] / no / not sure)
- Q: Do you have an accountant? (radio: yes / no)

---

### Screen 4.10 — Tier 3: Unknowns

**Content:** Per unknown payment
"We found regular payments to [X]. What is this?"

**Options:** Profile-informed dropdown (if Q6 said "investments", "investment account" rises; if "crypto", "crypto exchange" rises)

**Actions:**
- Classify → next Tier 3 or completion
- [Skip for now]
- [This isn't mine] → removed from picture

---

### Screen 4.11 — Section inputs (per section)

After tier confirmation, gather additional info per section:

**4.11a Property:** Value (estimate/valued) + mortgage balance
**4.11b Pension:** Count, type (DB/DC/multi), CETV status, provider
**4.11c Debts:** Outstanding balances, sole/joint for credit cards and loans
**4.11d Vehicles:** Make, model, rough value, reg
**4.11e Other assets (only if ticked in Q6):** Life insurance surrender value, valuables, crypto value, money owed
**4.11f Accounts (additional):** Monzo/Revolut/Starling not already connected, closed accounts in last 12 months

---

## New content areas (added in updated spec)

### Screen 4.12 — Children section

**Questions:**
- Names + ages
- Current living arrangement (primary care)
- Current contact pattern
- Childcare/school costs (auto-detected, confirm)

### Screen 4.13 — Housing section

**Questions:**
- Confirmed home details (from profile)
- Who currently lives there
- Future intent (sell / one stays / deferred / undecided)

### Screen 4.14 — Future needs section

**Questions:**
- Estimated post-separation monthly needs
- Career plans
- Housing plans if selling

---

## Phase B: Spending review

### Screen 4.15 — Spending fork

**Question:** "Spending categorisation takes a few extra minutes. How would you like to approach it?"

**Answers:**
- I'd like to do it now → 4.16 Per-category walkthrough
- I'll just provide estimates → 4.18 Estimates form
- Skip for now → 5.1 Picture ready (spending as estimate only)

---

### Screen 4.16 — Per-category walkthrough (6 categories)

For each of Housing / Utilities / Personal / Transport / Children / Leisure:

**4.16a:** Show found items in this category
**4.16b:** "Did we miss anything?" gap question
**4.16c:** Transaction search (if needed)
**4.16d:** Sub-category summary

**Actions per category:**
- [Looks right, next category →]
- [Let me adjust]

---

### Screen 4.17 — Full spending summary

All 6 categories + total monthly spending

**Actions:**
- [Save and continue →] → 5.1 Picture ready
- [Adjust a category] → back to specific category

---

### Screen 4.18 — Estimates-only form

Simpler input: monthly estimate per category (one screen)

**Actions:**
- [Save →] → 5.1 Picture ready

---

## Forks in this phase

| Fork point | Branches |
|---|---|
| 4.1 Bank selection | Bank (→ Tink) / Upload / Manual |
| 4.2 OAuth | Success / Cancel / Error |
| 4.5 Reveal | Continue / Add another bank |
| 4.15 Spending fork | Full walkthrough / Estimates / Skip |
| Per tier-2 / tier-3 question | User classifies / Skip / Not mine |

---

## Total screens in this phase: ~25-30

Dependencies on profile answers: section 4.11 is conditional per profile. 4.9 and 4.9a only shown if self-employed. 4.12-4.14 shown based on what's relevant.

**Time estimate:** 30-60 minutes across possibly multiple sessions.
