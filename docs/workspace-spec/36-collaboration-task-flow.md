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

### A6. Person B starts their own disclosure
**Screen: Add your financial information**
- Same V2 flow: bank connect / manual input / upload existing Form E
- Items auto-match where both declared the same thing
- Timeline event: "Mark started their disclosure"

## Act 2: Align the picture

### B1. Combined financial picture
**Screen: Our Financial Picture**
- Merged where same, side by side where different
- Auto-matched: "You both declared the property at £450k ✓"
- Discrepancies flagged: "Savings: Sarah says £12k, Mark says £8k"
- Missing: "Mark hasn't disclosed pension details yet"
- Progress board appears: X confirmed, Y queried, Z missing

### B2. Query and resolve discrepancies
**Screen: Item detail (e.g., Savings)**
- Sarah's figure: £12,000 (bank-evidenced)
- Mark's figure: £8,000 (self-declared)
- Structured query options: "Can you provide evidence?" / "Is this joint or individual?" / "Has the balance changed?"
- Threaded discussion on this item
- Item moves to Agreed or stays Disputed

### B3. Financial picture confirmed
**Screen: Confirmed Financial Picture**
- Every item: ✓ confirmed or ⚠️ disputed
- "You agree on the overall picture. 2 items still disputed — address in your proposal."
- Action: [Start a proposal]
- Timeline event: "Financial picture confirmed (92% agreed)"

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
| **2** | Combined Financial Picture (merged view) | Most complex — one-sided, both-sided, discrepancies, queries |
| **3** | Proposal Builder (adjust + impact + reasoning) | The product magic — real-time recalculation |
| **4** | Review Before Send | Deliberate send moment — preview what they see |
| **5** | Proposal Comparison (side by side diff) | Left/right with green/amber/red |
| **6** | Progress Board | Could be persistent sidebar element, not separate screen |
| **7** | Invitation + Person B onboarding | Flow through existing V2 with "you've been invited" context |
| **8** | Item Detail + Threaded Discussion | Query/response on specific financial items |
| **9** | Timeline | Chronological activity feed |
| **10** | Agreement Summary | The finish line |
