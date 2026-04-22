# Spec 36 — Collaboration Workspace: Task Flow (Wireframe-Ready)

**Date:** 15 April 2026
**Status:** Ready for wireframing
**Depends on:** Spec 35 (vision & architecture)

## Main workspace layout

```
┌─────────────────────────────────────────────────────────────┐
│  Version pipeline (horizontal, always visible)               │
│  [Your disclosure ✓] → [Their disclosure ✓] → [Combined ✓]  │
│  → [Proposal v1 - sent] → [Counter v1 - received] → ...     │
├──────────────────────────────────┬──────────────────────────┤
│                                  │                          │
│  Main content                    │  Sidebar                 │
│  (financial picture / proposal)  │  (comments, activity,    │
│                                  │  progress board)         │
│                                  │                          │
└──────────────────────────────────┴──────────────────────────┘
```

## Act 1: Complete and share

### A1. Person A completes disclosure (existing V2 flow)
System generates: Financial Summary

### A2. Review before sharing
**Screen: Your Financial Picture**
- Income, property, pensions, savings, debts, assets
- Each item shows evidence basis (bank-connected / self-declared)
- "This is what you'll share. Review before inviting."
- Actions: [Edit any item] [Continue to invite]

### A3. Invite Person B
**Screen: Invite to collaborate**
- Enter their email or phone
- Choose what to share: Full summary (recommended) / Selected sections
- Preview: see exactly what they'll see
- Action: [Send invitation]
- Timeline event: "You invited Mark to view your financial disclosure"

### A4. Person B receives invitation
**Screen (email/text):** "Sarah has shared her financial disclosure with you via Decouple. Review it and add your own."
- Action: [View Sarah's disclosure]

### A5. Person B views Person A's disclosure
**Screen: Sarah's Financial Picture (read-only)**
- Structured summary of everything Sarah disclosed
- Evidence badges per item: "bank-connected" / "self-declared"
- Per-item actions: [Confirm this matches my understanding] or [Query this item]
- Timeline event: "Mark viewed your disclosure" (Person A sees this)

### A6. Person B's disclosure — guided by Person A's

**Key architectural principle:** Party B doesn't start a blank Form E. They start by reviewing Party A's declared items. This is the reconciliation flow — building the unified household picture together, not maintaining two separate lists.

**Screen: Sarah listed these items. What do you know about each one?**

For each item Sarah declared, Mark sees a card with three options:

```
┌──────────────────────────────────────────────────┐
│  Family home — £450,000                           │
│  Sarah declared: joint ownership, £220k mortgage  │
│                                                   │
│  ○ Yes, I know about this                         │
│    ↳ "Is the value right?" [confirm £450k]        │
│  ○ I'd value this differently                     │
│    ↳ [enter your figure + why]                    │
│  ○ I don't know about this                        │
│    ↳ [ask Sarah to explain / flag]                │
└──────────────────────────────────────────────────┘
```

After reviewing Sarah's items, Mark is prompted:

**"Now add anything Sarah didn't declare — things only you know about."**

- Same V2 flow for adding: bank connect / manual input
- As Mark adds items, system auto-matches where possible ("You added Halifax mortgage — Sarah already declared this. We've combined them.")
- Timeline events: "Mark confirmed 14 items, queried 1, added 3 new items"

### A7. The reconciliation pass

**Screen: Building the household picture**

System shows the emerging unified picture in real-time as Mark works through it:

```
  Confirmed together  ✓  14 items
  Needs agreement     ⚠️  2 items (house value, savings balance)
  New to Sarah        •  3 items (Mark's ISA, Mark's Amex, Mark's pension)
  Gaps to address     ?  1 item (life insurance — neither declared)
```

Sarah gets notified that Mark has completed his pass. She reviews:

- **Items new to her** — each one: [Confirm I knew about this] [Query]
- **Items Mark valued differently** — [Accept his value] [Defend mine] [Discuss]
- **Gaps** — "Life insurance wasn't mentioned by either of you. Do either of you have policies?"

## Act 2: Align the picture

### B1. The unified household picture

**Screen: Our household picture**

ONE list of household items, not two side-by-side Form Es. Each item is a single row with ownership tags and status:

```
┌──────────────────────────────────────────────────┐
│  The family home                                  │
│  Value £450,000  ✓ agreed                         │
│  Mortgage £220,000 (Halifax, joint) — net £230k   │
│  Held: Jointly • Matrimonial                      │
│  Both declared ✓                                  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  Ford Escort                                      │
│  Value £8,000  ✓ agreed                           │
│  Finance £4,000 (VW Finance, Sarah's name)        │
│  Net value: £4,000                                │
│  Held: Sarah (sole) • Matrimonial                 │
│  Both declared ✓                                  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  HL ISA                                           │
│  Value £15,000                                    │
│  Held: Mark (sole) • Matrimonial (opened 2022)    │
│  ⚠️  New to Sarah — [Confirm] [Query]              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  Joint savings (Barclays)                         │
│  Sarah says £12,000                               │
│  Mark says £8,000                                 │
│  ⚠️  Values don't match — [Discuss] [Attach evidence] │
└──────────────────────────────────────────────────┘
```

Grouped by section (home, pensions, savings, investments, vehicles, other assets, debts, income, spending needs), following the standard household picture ordering. Each item shows:

- What it is + headline value
- Ownership metadata (who holds, matrimonial tag)
- Agreement status (✓ agreed / ⚠️ contested / • new / ? gap)
- Tap to open item detail

Progress board appears: "17 of 20 items agreed. 2 values disputed, 1 unique to Mark."

### B2. Resolve disagreements and unique items

**Screen: Item detail (e.g., Joint savings)**
- Sarah's claim: £12,000 (bank-evidenced, 15 April)
- Mark's claim: £8,000 (self-declared, 10 April)
- Structured query options: "Can you provide evidence?" / "Which account exactly?" / "Has the balance changed?"
- Threaded discussion on this item
- Evidence attachment (screenshot, statement)
- Outcome: Item moves to Agreed (value confirmed) or remains Disputed

**Screen: Item detail (e.g., Mark's ISA — new to Sarah)**
- Mark's claim: £15,000, opened 2022, matrimonial
- Sarah's options: [Confirm I knew about this] [I didn't know — query]
- If query: "When did you open this? Where did the funds come from?" — helps Sarah decide if it's matrimonial or pre-marital

### B3. Household picture confirmed
**Screen: Confirmed household picture**
- Every item: ✓ agreed or ⚠️ carries forward into proposal as disputed
- "You agree on 19 of 20 items. 1 value still being resolved — you can start a proposal and address it there."
- Action: [Start a proposal]
- Timeline event: "Household picture confirmed (95% agreed)"

## Act 2.5: Define your positions (private workspace)

Before proposing, the user privately defines their preferred and fallback positions. This happens in "my workspace" — the other party never sees it.

### B4. Position builder (private)
**Screen: Your positions**
- For each major item (property, pensions, savings, debts), the user defines:
  - **Preferred position:** What you'd ideally want
  - **Fallback position:** What you'd accept as a compromise
  - **Reasoning:** Why (private notes, not shared)
- System-generated context alongside each item helps inform positions:
  - "Net equity: £230k. Equal division = £115k each."
  - "Your pension CETV: £180k. Their CETV: £12k. Gap: £168k."
- This data stays private until the user chooses to offer a position
- When negotiation narrows, the system can prompt: "You're £8,400 apart. Your fallback position would close this gap — would you like to offer it?"

**Why this matters:** Juro's contract negotiation insight — playbooks define preferred, acceptable, and walk-away positions. Divorce settlement has the same structure. Defining positions privately before proposing leads to more considered, less emotional offers.

## Act 3: Propose and negotiate

### C1. Build a proposal
**Screen: Make a proposal**
- System shows equal division as starting point (arithmetic, not advice)
- Interactive: adjust items, see real-time impact on the split %
- Each adjustment prompts: "Brief reason?" with smart starters ("Primary carer" / "Pre-marriage asset" / "Can afford mortgage alone")
- **System-generated context per item** (visible to both parties when sent):

```
┌─────────────────────────────────────────────────┐
│  Property: You propose to keep the house         │
│                                                  │
│  Your reasoning: "I'm primary carer for the      │
│  children and need stability"                    │
│                                                  │
│  Context (auto-generated from disclosed data):   │
│  • Property value: £450k (3 agent valuations)    │
│  • Mortgage: £220k outstanding                   │
│  • Net equity: £230k                             │
│  • Your pension offset offered: £85k CETV        │
│  • Overall split with this proposal: 58/42       │
│  • Equal division baseline: 50/50 = £115k each   │
└─────────────────────────────────────────────────┘
```

- If user defined positions in B4, their preferred position pre-fills the proposal
- Action: [Preview] → see it as they will see it

### C2. Review before sending
**Screen: Review before sending**
- "You're about to send Proposal v1 to Mark"
- Summary of what you're proposing, per item
- Your reasoning alongside each item
- System context alongside each item
- How it compares to equal division
- **Fairness guardrail:** If proposal gives one party >85% of net assets, flag: "This split is unusual. A court would typically query this. Consider adjusting or adding reasoning."
- Actions: [← Back to edit] [Send to Mark]
- Timeline event: "Sarah sent Proposal v1"

### C3. Review received proposal
**Screen: Sarah's Proposal**
- Clear layout: what's proposed, per item, with their reasoning + system context
- Comparison to equal division
- **Copilot suggestions** (private, only you see): "They've proposed keeping the property. Your fallback position was a sale. Consider: accepting if pension offset is adequate, or countering with a deferred sale."
- Per-item: [Accept] [Counter this item]
- Whole proposal: [Accept all] [Counter-propose]

### C4. Counter-propose
**Screen: Counter-proposal**
- Pre-filled with their proposal
- Adjust only items you disagree with — unchanged items stay green
- Changed items highlighted amber, reasoning required
- **System highlights impact of changes:** "Changing pension share from 40% to 25% moves the overall split from 55/45 to 62/38"
- Action: [Send counter-proposal]
- Timeline event: "Mark counter-proposed (changed 2 of 8 items)"
- Progress board updates: "6 agreed, 2 remaining, gap: £8,400"

### C5. Narrowing
**Screen: Proposal comparison**
- Left: your position. Right: their position
- Green: agreed. Amber: close. Red: far apart
- "You're £8,400 apart. 2 proposals exchanged in 3 weeks."
- **Fallback prompt** (private): If you defined fallback positions and the gap is within range, the system gently suggests: "Your fallback position on pensions would close this gap."
- **Convergence pattern:** Show how the gap has narrowed over time (v1: £24k apart → v2: £8.4k apart)
- Actions: [Accept their position] [Adjust yours] [Suggest meeting in the middle] [Get help from a mediator]

### C6. Agreement
**Screen: Agreement reached**
- "You've agreed on all items"
- Full summary with both parties' reasoning + system context
- Every item shows: what was proposed, what was countered, what was agreed, and the reasoning trail
- Actions: [Download PDF] [Share with solicitor] [Start consent order process]
- Timeline event: "Agreement reached — all items resolved"
- Progress board: 100%

## Act 4: Make it official (V4/V5 — not V3 scope)

### D1. Share structured agreement with solicitor
### D2. Consent order generated from agreement data
### D3. D81 auto-populated (reasoning from proposals becomes Section 10)
### D4. Court submission tracking

## Screen inventory for wireframing

| Priority | Screen | Notes |
|---|---|---|
| **1** | Your Financial Picture (review before share) | Foundation — get this right first |
| **2** | Party B reconciliation pass (review A's items + add own) | The key architectural screen — building the unified picture, not starting a second Form E |
| **3** | Unified Household Picture | ONE list with ownership tags + status per item (matched / contested / unique / gap) |
| **4** | Proposal Builder (adjust + impact + reasoning) | The product magic — real-time recalculation |
| **5** | Review Before Send | Deliberate send moment — preview what they see |
| **6** | Proposal Comparison (side by side diff) | Left/right with green/amber/red |
| **7** | Progress Board | Could be persistent sidebar element, not separate screen |
| **8** | Invitation + Person B onboarding | Flow through with "you've been invited" context |
| **9** | Item Detail + Threaded Discussion | Query/response on specific household items |
| **10** | Timeline | Chronological activity feed |
| **11** | Agreement Summary | The finish line |
