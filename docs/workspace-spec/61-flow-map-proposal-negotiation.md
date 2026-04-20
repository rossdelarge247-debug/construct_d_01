# Spec 61 — Flow Map 5: Proposal Builder, Counter-Proposals, Agreement

**Date:** 17 April 2026
**Purpose:** Phase 4 flows covering settlement proposal creation, counter-proposals, versioning, convergence, and agreement.

**Entry:** From 5.7 Facts agreed
**Exit:** To 7.1 Generate legal documents (settlement locked)

---

## Pre-proposal: private workspace

### Screen 6.0 — Proposal intro

**Content:** "Now let's discuss how to divide things. You or Mark can make the first proposal."

**Actions:**
- [I'll make the first proposal] → 6.0a Private prep option
- [Wait for Mark to propose first]
- [Let's work on this together] → 6.0b Joint proposal mode
- [Invite a mediator] → mediator flow

---

### Screen 6.0a — Private prep (optional fallback positions)

**Content:** "Before proposing publicly, some users find it helps to think through their positions privately first."

**Questions per major item:**
- Preferred position (ideally what I'd want)
- Fallback position (what I'd accept as compromise)
- Private reasoning (notes to self, never shared)

**Actions:**
- [Save positions privately] → 6.1 Proposal builder
- [Skip — go straight to proposal] → 6.1

---

## Proposal builder flow (7 steps)

### Screen 6.1 — Proposal builder: The home

**Layout:** 2-column (input left, system context right)

**Question:** "What do you propose for the home?"

**Options:**
- I keep the house (buy Mark out)
- Sell and split proceeds [adjustable %]
- Deferred sale when youngest turns 18
- Mark keeps the house

**Input:** Reasoning (required — "Why?")

**Right column:** Live-updating system context (equal division, affordability, primary care, typical range if available)

**Action:** [Save & next: Pensions →]

---

### Screen 6.2 — Proposal builder: Pensions

**Question:** "What do you propose for pensions?"

**Options:**
- No pension sharing
- Share pensions (slider: % of other's)
- Offset against property
- Both share equally

**Input:** Reasoning + slider values

**Right column:** CETV values, gap, transfer amount per % choice, running total

**Action:** [Save & next: Savings →]

---

### Screen 6.3 — Proposal builder: Savings & investments

**Options:**
- Each keeps own
- 50/50 split
- Custom split

**Action:** [Next: Vehicles →]

---

### Screen 6.4 — Proposal builder: Vehicles & other assets

**Options per asset:**
- Each keeps the one they drive
- Custom arrangement

**Action:** [Next: Debts →]

---

### Screen 6.5 — Proposal builder: Debts

**Options:**
- Each responsible for own debts
- Share equally
- Custom arrangement

**Action:** [Next: Children →]

---

### Screen 6.6 — Proposal builder: Children

**Questions:**
- Q: Living arrangements
- Q: Contact pattern (EOW / EOW + midweek / shared / custom)
- Q: Holidays (equal split / alternate / custom)
- Q: Child maintenance (CMS rate / custom / none)
- Q: School decisions (joint / primary carer / other)

**Right column:** CMS indicative rate calculation

**Action:** [Next: Spousal maintenance →]

---

### Screen 6.7 — Proposal builder: Spousal maintenance

**Options:**
- Clean break (no ongoing)
- Fixed-term (£X/mo for Y years)
- Open-ended (£X/mo no end)
- Other

**Right column:** Income vs spending gap, surplus, impact calculation

**Action:** [Save & review →] → 6.8

---

### Screen 6.8 — Review before sending

**Content:** Full proposal rendered as a document (exactly what Mark sees)

**Contents:** Every section with proposal + reasoning + system context

**Footer:**
- Running totals (split percentages)
- Fairness check
- "This is what Mark will see" reassurance

**Actions:**
- [← Back to edit] → back to any step
- [Send to Mark] → 6.9 Send confirmation
- [Save as draft — I want to think]

---

### Screen 6.9 — Send confirmation

**Modal:** "Send Proposal v1?"

**Actions:**
- [Yes, send] → 6.10 Proposal sent
- [Cancel]

---

### Screen 6.10 — Proposal sent

**Content:** "Proposal v1 sent to Mark. We'll email you when he responds."

**Actions:**
- [View your proposal] → read-only view
- [Wait and see]
- [Back to workspace]

---

## Counter-proposal flow (Mark's view)

### Screen M14 — Proposal received (notification)

**External:** Email notification

---

### Screen M15 — Review Sarah's proposal

**Layout:** Document-style, each section with [✓ Accept] and [↩ Counter] buttons

**Actions per item:**
- [Accept] → marks item as accepted (green)
- [Counter] → opens inline counter form (6.11)

**Bottom actions:**
- [Accept whole proposal] → skip to agreement (v5.0)
- [Send my counter-proposal] → when counters set → 6.12 Review counter

---

### Screen 6.11 — Inline counter form

**Per-item counter:**
- Q: What's your counter-proposal? (options mirror Sarah's original options)
- Q: Your reasoning (required)

**Live impact:** "This changes the overall split from X to Y"

**Actions:**
- [Save counter] → back to M15
- [Cancel]

---

### Screen 6.12 — Mark's counter review (before send)

**Content:** Summary of accepted items + countered items + unchanged items

**Actions:**
- [Send counter-proposal] → v2 sent
- [Back to edit]

---

## Iterative negotiation

### Screen 6.13 — Progress board (persistent)

Visible throughout. Shows:
- Versions exchanged (v1, v2, v3...)
- Items agreed, items remaining
- Gap narrowing over versions
- Convergence tracker

---

### Screen 6.14 — Narrowing support

**Triggered:** When 1-2 items remain and gap is small

**Options per unresolved item:**
- Accept other's position
- Offer compromise (e.g. split the difference)
- Offset against another item
- Get mediator help
- **Private nudge:** If fallback positions defined, surface "Your fallback would close this gap"

**Actions per option:**
- Select → send as v3/v4/...
- [Not ready to compromise yet]

---

### Screen 6.15 — Agreement reached (v5.0)

**Content:** "You've agreed on everything."

**Summary:**
- Per-item final agreement
- Overall split (%)
- Rounds exchanged
- Gap narrowed (from X to 0)

**Actions:**
- [View full document with reasoning trail] → document mode
- [Generate legal documents →] → 7.1 (Phase 5)
- [Download settlement summary PDF]

---

## Forks in this phase

| Fork point | Branches |
|---|---|
| 6.0 Proposal intro | I'll propose first / Wait for them / Joint mode / Mediator |
| 6.0a Private prep | Save positions / Skip |
| Per 6.1-6.7 step | Choose option / Reasoning / Continue |
| 6.8 Review | Send / Back to edit / Save as draft |
| M15 Mark's review | Accept each / Counter each / Accept all / Send counter |
| 6.14 Narrowing | Accept / Compromise / Offset / Mediator |

---

## Version pipeline through this phase

```
v3.0 FACTS AGREED  →  v4.1 PROPOSAL v1 (Sarah sends)
                   →  v4.2 COUNTER v1 (Mark counters)
                   →  v4.3 COUNTER v2 (Sarah adjusts)
                   →  ... (further rounds as needed)
                   →  v5.0 SETTLED (all items agreed)
```

Each version is an immutable snapshot accessible from the version history.

---

## Total screens in this phase: ~18-20

**Time estimate:** 2-4 weeks calendar (async between rounds), 30-60 min active per round per party.
