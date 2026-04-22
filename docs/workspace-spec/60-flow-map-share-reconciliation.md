# Spec 60 — Flow Map 4: Share, Party B Journey, Reconciliation

**Date:** 17 April 2026
**Purpose:** Phase 3 flows covering sharing the document, Party B's onboarding, and reconciliation of the unified household picture.

**Entry:** From 4.17/4.18 Spending complete
**Exit:** To 6.1 Proposal intro (facts agreed)

---

## Screen 5.1 — Your picture is ready (v1.0 DRAFT)

**State:** Document in Draft (v0.8+). Sarah reviews.

**Content:** Summary of Sarah's picture — X items, Y evidence badges, Z gaps (if any)

**Actions:**
- [Review the document] → 5.2 Document mode
- [Share with Mark →] → 5.3 Invitation flow
- [Keep building — more to add] → back to section editing
- [Get a credit check first — optional] → 5.1a Credit check

---

## Screen 5.1a — Credit check (optional)

**Content:** "Strengthen your picture with a credit check. Free. Takes 2 minutes."

**Actions:**
- [Run credit check] → 5.1b Auth with Experian/Equifax
- [Upload own credit report] → 5.1c Upload
- [Skip for now] → 5.1

**After credit check:** 5.1d Results
- Items on credit file but NOT declared → flagged for user to confirm or add
- CCJs or other findings → flagged with guidance

---

## Screen 5.2 — Document mode view

**State:** Read-only presentation of full financial picture (ES2-style)

**Actions:**
- [Edit mode] → toggle to edit, section-level editing
- [Export PDF] → download
- [Print]
- [Share with Mark →] → 5.3
- [Back to workspace]

---

## Screen 5.3 — Invitation setup

**Content:** "This is what Mark will see." Full preview of outbound document.

**Questions:**
- Q: Mark's email
- Q: Optional personal message (e.g. "Looking forward to sorting this together")
- Q: Share everything, or select sections?

**Actions:**
- [Preview what Mark sees →] → 5.3a
- [Send invitation] → 5.3b Invitation sent
- [Cancel — not ready yet] → 5.1

---

## Screen 5.3a — Preview (Mark's view)

Shows Mark's landing page preview. User sees exactly what the invitation email and first screen will look like.

**Actions:**
- [Looks good — send] → 5.3b
- [Back to edit]

---

## Screen 5.3b — Invitation sent

**Content:** "Invitation sent to Mark. We'll email you when he opens it."

**Actions:**
- [Continue building while you wait] → back to own workspace
- [View your document] → 5.2

---

## Party B journey (Mark's side)

### Screen M1 — Invitation email

**External:** Mark receives email "Sarah has shared her financial picture with you"

**Actions:**
- [View Sarah's disclosure] → M2 Onboarding landing

---

### Screen M2 — Onboarding landing

**Content:** Explains what Decouple is, what he's being invited to, what he'll see.

**Actions:**
- [Create account — free] → M3 Sign up
- [Sign in — I have an account] → sign in
- [Learn more about Decouple]
- [I don't want to use this] → M2a Decline options

---

### Screen M2a — Decline options

**Content:** "Want to let Sarah know why?"

**Actions:**
- [I'd rather use a solicitor] / [I need time to think] / [I prefer something else]
- Sarah is notified neutrally

---

### Screen M3 — Sign up (Party B)

Same as 1.2 Sign up but with invitation context preserved.

After auth → M4

---

### Screen M4 — Welcome (Party B)

**Content:** "Welcome Mark. Here's what you'll do: review Sarah's picture, add your side, together you'll build the complete household picture."

**Actions:**
- [Start by reviewing Sarah's picture] → M5 Sarah's picture (read-only)
- [Or start with my own side first] → M7 Profiling (Party B)

---

### Screen M5 — Sarah's picture (read-only)

**Content:** Full document mode view of Sarah's picture — exactly what she shared.

Each item has evidence badges. Mark can tap any item to see source.

**Actions:**
- [Now add my side →] → M6 Wellbeing check + profiling intro
- [I have questions about something →] → M5a Add early comments
- [Leave for now]

---

### Screen M5a — Early comments (pre-own-disclosure)

**Content:** Mark can leave comments on Sarah's items BEFORE building his own side. These flag as "pre-disclosure queries."

Sarah is notified. Mark can continue to his own journey afterwards.

---

### Screen M6 — Mark's wellbeing check

Same as 2.1 but with awareness he's joining an existing context.

**Actions:**
- [I'm managing] → M7 Profiling
- [Finding this hard] → gentler pacing flag
- [Need safety support] → safety resources

---

### Screen M7 — Mark's profiling

Same as 3.1-3.6 (6 profiling questions). Mark answers independently of Sarah's declarations.

---

### Screen M8 — Mark's bank connection + confirmation + spending

Same as 4.1-4.17 — Mark builds his own side through the same journey.

Key design: Mark's side is INDEPENDENT — his profiling and disclosure happens without seeing Sarah's values for his items.

---

### Screen M9 — Mark's picture ready

Same as 5.1 — Mark's picture (v0.9 say) is built.

**Actions:**
- [Review] → document mode
- [Continue to reconciliation with Sarah's items →] → M10 Reconciliation pass

---

## Reconciliation Flow

### Screen M10 — Reconciliation intro

**Content:** "Now let's review Sarah's items. For each one, tell us what you know."

**Actions:**
- [Let's go →] → M11 First reconciliation item

---

### Screen M11 — Per-item reconciliation (Sarah's items)

For each Sarah item, Mark sees a card with 3 options:

**Options:**
- ✓ Yes, I know about this (agree) → confirms
- ⚠️ I'd value this differently → opens inline form for his value + reasoning
- ? I don't know about this → flags for discussion thread

**Action per item:** Select → next item OR save for later

---

### Screen M12 — Mark adds unique items

**Content:** "Now add anything Sarah didn't declare — things only you know about."

**Actions:**
- [Add an item] → item-type selector
- [I've added everything] → M13
- [Skip — nothing to add]

---

### Screen M13 — Mark's pass complete

**Content:** Summary: X confirmed, Y disputed, Z new additions

**Actions:**
- [Submit my side →] → 5.4 Unified picture (both parties see)

---

## Unified picture (both parties)

### Screen 5.4 — Unified household picture (v2.0)

**State:** Both sides merged. Both parties see this screen.

**Content:**
- Agreed items (green tick)
- Contested values (amber — both claims shown)
- Unique items (blue — new to one party)
- Gaps (grey — neither declared but expected)

**Top-level actions:**
- [Work through open items →] → 5.5 Resolution queue
- [View as document] → document mode
- [Activity & comments] → right column

---

### Screen 5.5 — Resolution queue

**Flow:** One open item at a time, in sequence.

Per item:
- **Contested value:** Both claims + evidence → discuss thread → "Agreed at £X" action
- **Unique (to other party):** Options [✓ Confirm I knew] / [⚠️ Query]
- **Gap:** [Add this] or [Not applicable]

Each resolution bumps version (v2.0 → v2.1 → v2.2 → ...)

**Action:**
- [Continue] → next item
- [Leave remaining for now] → 5.4 Unified picture

---

### Screen 5.6 — Item discussion thread

**Trigger:** [Discuss this] on contested item or [Query] on unique item

**Content:**
- Both parties' claims
- Threaded discussion
- Evidence attachments
- Resolution button when reached

**Actions:**
- [Reply] → message
- [Attach evidence]
- [Resolve as £X]
- [Mark as agreed]
- [Escalate to mediator] (stretch)

---

### Screen 5.7 — Facts agreed (v3.0 UNIFIED)

**Trigger:** All items resolved

**Content:** "All 22 items agreed. The facts are locked. Ready to discuss settlement."

**Actions:**
- [Start a proposal] → 6.1 Proposal intro
- [Review the household picture] → 5.4 unified view
- [Invite a mediator for the next phase] → 5.7a Mediator invitation
- [Come back later]

---

### Screen 5.7a — Mediator invitation (optional)

**Content:** "Want a mediator to help with the settlement discussions?"

**Actions:**
- Enter mediator email → invite as participant (they get view-only + comment access to the shared document)
- [Skip — we'll negotiate ourselves]

---

## Forks in this phase

| Fork point | Branches |
|---|---|
| 5.1 Your picture ready | Review / Share / Credit check / Keep building |
| 5.3 Invitation | Send / Preview / Cancel |
| M2 Invitation landing | Create account / Sign in / Learn more / Decline |
| M4 Party B welcome | Review Sarah first / Build own first |
| M11 Per-item reconciliation | Agree / Different value / Don't know |
| 5.5 Resolution queue | Resolve / Leave / Escalate |
| 5.7 Facts agreed | Propose / Invite mediator / Pause |

---

## Total screens in this phase: ~25

**Time estimate:** 1-2 weeks calendar (async between parties), a few hours active user time per party.
