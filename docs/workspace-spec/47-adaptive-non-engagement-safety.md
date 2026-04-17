# Spec 47 — Adaptive Design: Non-Engagement and Safety

**Date:** 17 April 2026
**Purpose:** Design proposals for when the other party won't engage, stalls, or when safety concerns arise. Each section: the scenario, the design response, and where it fits in the journey.

## 1. Ex won't respond to invitation

**Signal:** Invitation sent, no action after 7 days.

**Design response — graduated escalation:**

```
Day 0:    Invitation sent. "Mark has been invited."
Day 3:    Gentle reminder email to Mark. Sarah sees: "Reminder sent."
Day 7:    Sarah sees: "Mark hasn't responded yet."
          Options:
          ○ Send another reminder (with personal message this time)
          ○ Try a different contact method (phone number)
          ○ Continue building your picture alone
          ○ Understand your options if they won't engage

Day 14:   "Mark still hasn't engaged."
          The product shifts tone:
          "Some people need time. But you don't have to wait.
           Your financial picture is complete and can be used
           independently."
          Options:
          ○ Download your picture as a standalone document
          ○ Share with a mediator (who can contact Mark separately)
          ○ Learn about court-ordered disclosure (Form A)

Day 30:   "It's been a month."
          The timeline becomes evidence:
          "If you need to apply to court, your timeline shows:
           invitation sent [date], 3 reminders, no response.
           This is relevant evidence for a Form A application."
          Options:
          ○ Generate a court-ready timeline document
          ○ Find a solicitor to issue Form A
          ○ Keep waiting
```

**Where it fits:** Phase 3 (Share). The product doesn't dead-end — it adapts from collaborative mode to single-party mode with escalation options.

**Key principle:** The product is useful even if only one party engages. Your financial picture has value — for mediation, for a solicitor, for court. Don't make collaboration a prerequisite for value.

---

## 2. Ex engages but stalls during reconciliation

**Signal:** Mark started but hasn't completed in 14+ days. Activity has dropped off.

**Design response:**

```
Sarah sees:
"Mark started on [date] but hasn't finished.
 He's confirmed 8 of 18 items. 10 remaining."

Options:
○ Send a gentle nudge
  → "Hey Mark, just checking in. 10 items still need
     your input. Most people finish in one sitting."
○ Set a soft deadline
  → "Can you complete by [date]? We'd both like to
     move forward."
○ Continue without Mark's full input
  → Items Mark hasn't confirmed stay as "Sarah's claim,
     unconfirmed by Mark." The document is still shareable
     with a mediator or solicitor, just with lower trust
     on unconfirmed items.
```

**Where it fits:** Phase 3 (Share → Reconcile). The product handles partial reconciliation gracefully — items don't need both-party confirmation to exist in the document.

---

## 3. Ex refuses bank connection

**Signal:** Mark completes profiling but skips or refuses bank connection.

**Design response:**

Mark's journey still works — he can self-declare everything manually. But the document reflects this:

```
Sarah's items:
  Salary £2,400/mo  📎 bank-evidenced
  Mortgage £1,150/mo  📎 bank-evidenced

Mark's items:
  Salary £4,800/mo  📝 self-declared
  HSBC account £3,800  📝 self-declared
```

Both parties see the asymmetry. Sarah sees: "Mark hasn't connected a bank. His items are self-declared."

The product gently nudges Mark:
"Connecting your bank strengthens your disclosure. Self-declared items carry less weight in mediation and court."

But it's never blocked. Manual input is always possible.

**Optional credit check becomes more important here:** If Mark won't connect his bank, Sarah can request: "Ask Mark to verify with a credit check instead." This catches undisclosed debts without requiring full bank connection.

**Where it fits:** Phase 3 (Mark's Build journey). The product adapts trust badges, doesn't gate progress.

---

## 4. Coercive control — ongoing detection

**Signal:** Beyond the Phase 1 entry screening, ongoing behavioural patterns:

| Pattern | What the system watches for |
|---|---|
| **Sudden acceptance** | Party accepts all proposals within minutes, no counters, no reasoning |
| **Extreme split acceptance** | Accepts 90/10 split without question |
| **Erratic changes** | Frequently changes positions dramatically |
| **Rapid response pressure** | One party sends, other responds within minutes every time (suggesting they're being watched) |
| **Account access anomaly** | Same IP/device accessing both party accounts |
| **Language patterns** | Copy-pasted responses, formal tone shift suggesting someone else is typing |

**Design response — layered:**

```
Level 1 — Soft prompt (private, to the potentially vulnerable party):
"You've accepted all items without changes. That's completely fine
 if you're comfortable — but there's no rush. Take your time."
[I'm happy with this] [I'd like to review again] [I need support]

Level 2 — Stronger nudge:
"The settlement you've accepted gives you 15% of assets.
 The typical range for your circumstances is 45-55%.
 We recommend getting independent advice before finalising."
[Get a free consultation] [I understand, proceed] [I need help]

Level 3 — Safety intervention:
"We've noticed patterns that concern us. Your safety matters
 more than this settlement."
[Talk to someone now — Women's Aid / Men's Advice Line]
[I'm safe, continue]
[Pause my account — lock everything]
```

**Where it fits:** Throughout Phases 3-5. The system never blocks, never accuses, but always provides an exit ramp. The "pause my account" option immediately locks the document and prevents the other party from seeing any changes.

**Key principle:** Safety is not a one-time gate. It's a continuous signal system that adapts the experience.

---

## 5. Async collaboration fails — people ghost, rage, or refuse structure

**Signal:** Discussion threads go unresolved. Tone becomes hostile. Progress stalls.

**Design response — three modes:**

### Mode A: Collaborative (default)
Both parties see each other's items, discuss, propose, counter. The happy path.

### Mode B: Mediated
When collaboration stalls, either party can tap "Get help."
A mediator joins the document as a participant. They can:
- Comment on disputed items
- Suggest compromises
- Facilitate specific discussions
- Help unstick negotiations

The product handles mediator onboarding: "Sarah and Mark need help with 2 items. Here's their household picture. The dispute is on [pensions] and [spousal maintenance]."

### Mode C: Parallel (arms-length)
For higher-conflict cases. Both parties work independently:
- Each builds their own picture
- Each makes their own proposal
- A mediator (or the system) compares the two proposals
- Items are resolved one at a time through the mediator
- Parties never directly interact in the document

```
"Direct collaboration isn't working for you right now.
 That's OK — many couples find it easier to work separately
 and have someone help bring it together."

○ Continue together (Mode A)
○ Work with a mediator (Mode B)  
○ Work separately, compare later (Mode C)
```

**Where it fits:** Phase 4 (Propose and Negotiate), but the mode switch can happen at any point from Phase 3 onward.

---

## 6. One-sided completion — solo value

**The biggest design principle:** The product must be valuable even if only one party ever uses it.

Sarah completes her financial picture alone. Mark never joins. Sarah's document is still:
- A complete financial disclosure she can share with a solicitor
- A document she can bring to mediation
- A basis for her Form E (if going to court)
- Evidence for a Form A application (compelling disclosure)
- A personal record of her financial position at separation

The product should never make Sarah feel she's failed because Mark won't engage. Her work has standalone value.

**Design response — the solo path:**

After 30 days of non-engagement from Mark:

```
"You've built a complete financial picture. 
 Mark hasn't joined yet — but your picture is valuable on its own.

 You can:
 ○ Share with a mediator — they can invite Mark separately
 ○ Share with a solicitor — they can use this for your Form E
 ○ Download as a standalone document
 ○ Keep waiting for Mark

 Whatever happens, the work you've done here isn't wasted."
```

---

## Summary: the engagement spectrum

| Scenario | Product response | Journey impact |
|---|---|---|
| Both engage promptly | Happy path — Phases 1-6 as designed | 2-3 months |
| Ex is slow (2-4 weeks) | Gentle nudges, soft deadlines, continue-without-them option | 3-5 months |
| Ex engages partially | Partial reconciliation, unconfirmed items flagged, lower trust | 4-6 months |
| Ex refuses bank connection | Self-declare path, asymmetric trust badges, credit check nudge | Same timeline, lower trust |
| Ex won't engage at all | Solo mode, timeline as evidence, escalation to mediator/court | Variable |
| Coercive control detected | Layered safety responses, pause option, professional referral | Paused or redirected |
| Collaboration breaks down | Mode switch: collaborative → mediated → parallel | Adds 2-4 weeks |
