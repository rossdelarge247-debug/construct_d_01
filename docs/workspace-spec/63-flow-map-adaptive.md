# Spec 63 — Flow Map 7: Adaptive Flows (Non-Engagement, Safety, Complexity)

**Date:** 17 April 2026
**Purpose:** Flows that deviate from happy path — when the ex won't engage, when safety concerns arise, when complexity routes users to Tier 2/3.

**Entry:** From various points throughout the journey
**Exit:** Back to main flow OR to professional handoff

---

## A. Non-engagement escalation

### A1. Ex hasn't responded to invitation

**Signal:** 7 days since invite, no account creation

**Screen N1 — Gentle nudge option**

**Content:** "Mark hasn't opened the invitation yet."

**Actions:**
- [Send a reminder] → triggers gentle reminder email
- [Try a different contact method] → add phone number
- [Continue building your picture alone]

---

### A2. Still no response at 14 days

**Screen N2 — Options expand**

**Content:** "Mark still hasn't engaged."

**Actions:**
- [Send another reminder with personal message] → 1:1 message opens
- [Try phone number] → nudge via SMS
- [Understand your options] → N2a Information
- [Continue building alone]

---

### Screen N2a — Information for non-engagement

**Content:** "Some people need time. Here's what you can do..."

**Options explained:**
- Keep waiting
- Use your picture for mediation
- Apply to court (Form A) to compel disclosure
- Share with a solicitor

**Actions:**
- [Download my picture as standalone document]
- [Learn about mediation]
- [Learn about Form A]
- [Back]

---

### A3. 30 days — timeline as evidence

**Screen N3 — Court evidence mode**

**Content:** "It's been a month. If you need to apply to court, your timeline shows a clear pattern of non-engagement."

**Actions:**
- [Generate court-ready timeline document] → compiled evidence PDF
- [Find a solicitor to issue Form A]
- [Keep waiting]
- [Try mediation with Mark not present]

---

## B. Partial engagement

### B1. Mark started but stalled mid-journey

**Signal:** Mark logged in, began profiling, hasn't completed in 14+ days

**Screen N4 — Stall detection (Sarah's view)**

**Content:** "Mark started but hasn't finished. He's confirmed 8 of 18 items."

**Actions:**
- [Send a gentle nudge] → reminder to Mark
- [Set a soft deadline together] → "Can you complete by [date]?"
- [Continue with what he's confirmed] → proceed with partial reconciliation

---

### B2. Mark refuses bank connection

**Signal:** Mark skipped bank connection, chose manual entry

**Effect:** Mark's items show 📝 self-declared badges. Sarah's items retain 📎 bank-evidenced. Asymmetric trust displayed.

**Optional prompt to Sarah:** "Mark hasn't connected a bank. Would you like to request a credit check instead?" (alternative verification)

---

## C. Safety escalation

### C1. Entry safety indicator

**Trigger:** Q at 2.1 "Need safety support right now" selected

**Screen S1 — Safety resources (immediate)**

**Content:** Women's Aid, Men's Advice Line, Samaritans, discreet-use options, Quick Exit button

**Actions:**
- [Contact Women's Aid] → external
- [Use discreetly] → S1a setup discreet mode
- [Quick Exit] → immediately close, clear from history
- [I'm safe, continue] → back to main flow

---

### C2. Mid-journey coercive control signals detected

**Signal patterns (6):**
- Sudden acceptance of all proposals
- Extreme split acceptance (90/10)
- Erratic position changes
- Rapid response pressure (replies within minutes consistently)
- Same IP/device accessing both accounts
- Copy-pasted or formal-shifted language

**3-level response:**

**Screen S2 — Level 1: Soft prompt (private)**

**Content:** "You've accepted everything without changes. That's fine if you're comfortable — but no rush."

**Actions:**
- [I'm happy with this] → dismiss, log response
- [Let me review again] → return to review
- [I need support] → S3

---

**Screen S3 — Level 2: Stronger nudge (private)**

**Content:** "The settlement you've accepted gives you 15% of assets. Typical range for your circumstances is 45-55%. We recommend independent advice before finalising."

**Actions:**
- [Get free consultation]
- [I understand, proceed anyway] → confirm with second prompt
- [I need help] → S4

---

**Screen S4 — Level 3: Safety intervention**

**Content:** "We've noticed patterns that concern us. Your safety matters more than this settlement."

**Actions:**
- [Talk to Women's Aid now] → external helpline
- [Talk to Men's Advice Line now] → external helpline
- [I'm safe, continue] → flagged for follow-up
- [Pause my account — lock everything] → S5

---

### Screen S5 — Account pause/lockdown

**Content:** "Your account is now paused. Mark can no longer see changes. Your data is preserved."

**Effect:**
- Document frozen at current state
- Ex's access revoked
- No notifications to ex
- User can unpause at any time

**Actions:**
- [Reach out for support]
- [Unpause when ready]
- [Delete my data entirely] → confirmation flow

---

## D. Complexity routing (Tier 2/3)

### D1. Complexity detected at profiling

**Signals:**
- Self-employed with business structure questions
- Multiple properties
- Overseas property declared
- Pre-marital or inherited assets flagged
- Trust structures mentioned

**Screen X1 — Complexity flag**

**Content:** "Your situation has some complexity. Here's what that means for your journey..."

**Explained per complexity type:**
- Business valuations
- Overseas tax implications
- Pre-marital separation
- Trust structures

**Actions:**
- [I want a solicitor's involvement from the start] → route to Tier 3 partner referral
- [Let me build what I can, route complex items to Tier 2 review] → continue with Tier 2 flags
- [Continue — I'll decide later]

---

### D2. Complexity detected by signals (bank data)

**Signals:**
- Mixed business/personal expenses
- Unusual payment patterns suggesting hidden income
- Payments consistent with self-employment not declared

**Screen X2 — Signal-level complexity prompt**

**Content:** "Your bank data suggests [X — e.g. business expenses]. Help us understand."

**Options per signal:**
- Classify/explain
- Route to professional review
- Flag for discussion with ex

---

### D3. Tier 2 routing at Phase 5

Already covered in 7.5 Review decision. Tier 2 is the "review recommended" default path.

---

### D4. Tier 3 — too complex for the product

**Trigger:** Multiple Tier 2 flags + explicit user request for professional handling + certain combinations (trusts + overseas + business)

**Screen X3 — Handoff to professional**

**Content:** "Your situation includes [trusts, overseas assets, and business valuations]. We recommend a solicitor handles the consent order."

**Actions:**
- [Export my disclosure for my solicitor] → structured data package download
- [Find a family law firm] → partner referral directory
- [I'll continue anyway (with Tier 2 review)] → continue

---

## E. Pause and resume

### E1. User pauses voluntarily

Can happen from any screen.

**Screen P1 — Save and return later**

**Content:** "Take a break. Come back when you're ready."

**Actions:**
- [Save and log out]
- [Cancel — stay]

---

### E2. Returning user (days/weeks later)

**Screen P2 — Welcome back**

**Content:** "Welcome back. You left off at [step]. X items may need updating if data has changed."

**Actions:**
- [Continue from where I left off]
- [Review what's changed]
- [Start over]

---

## F. Dispute escalation mid-negotiation

### F1. User wants mediator mid-process

**Screen M-esc — Escalate to mediator**

**Content:** "Add a mediator as a participant. They can see the document and help resolve disputes."

**Actions:**
- [Invite a mediator] → mediator invitation flow
- [Find one in our directory] → directory
- [Continue without]

---

### F2. Both parties stuck — product detects no progress

**Signal:** No document activity for 21+ days after an unresolved dispute

**Screen F2 — Product-initiated prompt**

**Content:** "You've been stuck on [X items] for 3 weeks. Want some help?"

**Actions:**
- [Get a mediator] → mediator flow
- [We're still working on it]
- [Pause the case]

---

## G. Data lifecycle

### G1. Consent expired

**Signal:** 90-day Open Banking consent about to expire

**Screen G1 — Consent renewal prompt**

**Content:** "Your Open Banking consent expires in 7 days. Refresh to keep your data current."

**Actions:**
- [Refresh consent now] → Tink OAuth
- [Remind me closer to expiry]
- [Skip — use current data (frozen)]

---

### G2. Consent expired, user hasn't renewed

**Effect:** Bank data is frozen at last refresh. Document shows "as of [date]" staleness.

---

### G3. Account deletion

**Screen G3 — Delete my account**

**Content:** Warning: data loss implications, shared document considerations

**Actions:**
- [Confirm deletion] → GDPR-compliant purge
- [Export first]
- [Cancel]

---

## Adaptive flow summary

| Flow | Trigger | Outcome |
|---|---|---|
| A. Non-engagement | 7/14/30 days silence | Escalation + solo mode |
| B. Partial engagement | Stalled Party B | Continue with partial or nudge |
| C. Safety | Entry question OR mid-journey signals | Resources, support, lockdown |
| D. Complexity | Profile or signal indicators | Route to Tier 2/3 |
| E. Pause/resume | User-initiated or absence | State preserved |
| F. Escalation | Mediator request or stalled | Mediator invitation |
| G. Data lifecycle | Consent expiry or deletion | Renewal or purge |

---

## Total adaptive screens: ~20+ conditional on triggers

These don't appear in a linear happy path — they overlay and branch from the main journey based on user state and behaviour.
