# Spec 62 — Flow Map 6: Legal Generation, Pre-Flight, Submission, Sealing

**Date:** 17 April 2026
**Purpose:** Phase 5 and Phase 6 flows covering legal document generation, quality check, professional review decision, court submission, and post-order implementation.

**Entry:** From 6.15 Agreement reached (v5.0)
**Exit:** Post-implementation (case closed)

---

## Phase 5: Finalise

### Screen 7.1 — Generation hub

**Content:** "Generate your legal documents. Takes about 30 seconds."

**Documents listed:**
- ✓ Consent order
- ✓ D81 Statement of Information
- ✓ Pension sharing annex (Form P) — if applicable
- ✓ Settlement summary PDF
- ○ Statement of Arrangements (children) — optional

**Actions:**
- Check/uncheck optional items
- [Generate all documents →] → 7.2 Generation progress

---

### Screen 7.2 — Generation progress

**Content:** Animated progress:
- "Generating consent order... ✓"
- "Generating D81 and Section 10 narrative... ✓"
- "Generating pension sharing annex... ✓"
- "Running quality checks... ✓"

Duration ~3 seconds. Auto-advances to 7.3.

---

### Screen 7.3 — Document preview (consent order)

**Content:** Full consent order rendered as a legal document (paper style, serif font)

**Tabs above document:**
- [Consent Order] (default) / [D81] / [Pension Annex] / [Settlement Summary]

**Actions:**
- [Edit wording] → 7.3a Inline wording editor
- [Looks good — run pre-flight →] → 7.4
- [Print]
- [Download PDF]

---

### Screen 7.3a — Inline wording editor

**Content:** Minor wording adjustments (subject to legal template validation)

**Actions:**
- Save changes → regenerate with edits
- [Cancel]
- [Reset to default]

---

### Screen 7.4 — Pre-flight quality check

**Content:** Checklist of automated validations:
- ✓ All required clauses present
- ✓ Clean break wording correctly applied
- ✓ Pension sharing order per WRPA 1999
- ✓ D81 Section 10 completed
- ✓ Both parties' statements of truth
- ✓ Fairness check — within typical range
- ✓ No unusual terms flagged
- ✓ Court fee calculated (£593)

Each row expandable for detail.

**Outcomes:**
- All pass → 7.5 Review decision
- Some warnings → 7.4a Warnings review
- Any fail → 7.4b Blocking issues

---

### Screen 7.4a — Warnings review

**Content:** Items flagged as "passed with caveats" — e.g. "D81 Section 10 is brief (180 words) — courts prefer 300+"

**Actions per warning:**
- [Expand this section] → return to relevant edit point
- [Accept and continue]

→ 7.5 Review decision

---

### Screen 7.4b — Blocking issues

**Content:** Issues that prevent submission. E.g. "Pension sharing percentage exceeds scheme limit."

**Actions:**
- [Fix in editor] → return to relevant section
- [Get professional help]

---

### Screen 7.5 — Review decision (Tier 1 vs Tier 2)

**Content:** Two clear options side-by-side:

**Option A: Submit directly**
- £593 court fee
- Your pre-flight passed
- ~6-10 week court processing
- For confident, standard cases

**Option B: Get a review first**
- £250-500 fixed fee
- 48hr turnaround
- + £593 court fee + same court wait
- For reassurance, complex pensions, or overseas elements

**Actions:**
- [Submit directly →] → 7.6 Submission guidance
- [Get a professional review →] → 7.5a Marketplace
- [Not ready — come back later] → saved state

---

### Screen 7.5a — Professional review marketplace

**Content:** List of reviewers with name, credentials, years, specialisation, rating, price

**Actions:**
- [View profile]
- [Request review] → 7.5b Request confirmation
- [Back]

---

### Screen 7.5b — Review request confirmation

**Content:** "Mary Thompson will review your documents within 48 hours. £250."

**Actions:**
- [Pay and request] → payment flow (Stripe)
- [Cancel]

After payment: 7.5c Review in progress

---

### Screen 7.5c — Review in progress

**Content:** "Your review is with Mary. Expected response by [date]."

**Actions:**
- [View documents]
- [Message reviewer] (stretch)
- [Cancel review] (with refund terms)

---

### Screen 7.5d — Review complete

**Outcomes:**
- ✓ Approved no changes → return to 7.6 Submit
- ⚠ Approved with amendments → inline track changes to review
- ❌ Concerns raised → specific items flagged with explanation

**Actions (amendments case):**
- [View tracked changes]
- [Accept all changes] → regenerate → 7.6
- [Accept selectively]
- [Discuss with reviewer] (stretch)

---

### Screen 7.6 — Submission guidance

**Content:** Step-by-step guide for submitting via MyHMCTS portal

**Documents bundled for download:**
- Consent order
- D81
- Pension sharing annex
- Supporting evidence (optional)

**Steps shown:**
1. Log in to MyHMCTS
2. Start a new financial remedy application
3. Upload documents in order shown
4. Pay court fee £593
5. Submit

**Actions:**
- [Open MyHMCTS] → external link (with return guidance)
- [Mark as submitted] → 7.7 Submitted + tracking
- [I need help] → support

---

### Screen 7.7 — Submitted + waiting

**Status timeline:**
- ✓ Submitted [date]
- ● With the judge — in progress
- ○ Sealed — expected [date range]

**Content blocks:**
- "What happens next"
- "While you wait" (implementation preview)

**Actions:**
- [Preview implementation checklist →] → 8.1 preview
- [Update status — it was sealed] → 7.8
- [Update status — judge asked a question] → 7.7a

---

### Screen 7.7a — Judge query handling

**Content:** "What did the judge ask?"

**Path:** Capture query → guide user to response options → regenerate/adjust → resubmit

---

### Screen 7.8 — Order sealed

**Content:** "🎉 Your order has been sealed. This is the legal settlement."

**Documents to download:**
- Sealed consent order
- Sealed D81
- Sealed pension sharing annex

**Actions:**
- [Download all]
- [Start implementation →] → 8.1 Phase 6

---

## Phase 6: Move On (implementation)

### Screen 8.1 — Implementation checklist

**Content:** All agreed actions as tracked tasks. Example:

1. ☐ Market the property
2. ☐ Split joint savings (£11,200 → £5,600 each)
3. ☐ Share the pension (NHS — 20% to Mark)
4. ☐ Transfer Ford Escort to Sarah
5. ☐ Update Child Benefit recipient
6. ☐ Update your will
7. ☐ Update pension beneficiary
8. ☐ Close joint Barclays account

**Actions per task:**
- [Start] → 8.2 Task detail + template
- [Mark complete]
- [I've done this]

---

### Screen 8.2 — Task detail (per step)

**Content:** Guidance + template letter/form for that specific action

Example (pension share):
- "Contact NHS Pensions with your sealed order. Here's a template letter."
- Pre-filled letter with user details
- Expected timeline
- What to expect in reply

**Actions:**
- [Copy template] → copy letter to clipboard
- [Download PDF]
- [Mark as sent]
- [Done — confirmation received]

---

### Screen 8.3 — Long-running tracking (stretch)

**Content:** Property sale, pension sharing can take months

**Per long-running task:**
- Current status
- Next expected action
- Reminder cadence
- Notes

---

### Screen 8.4 — All done

**Content:** "Your settlement is fully implemented. Take care of yourself."

**Actions:**
- [Download complete archive]
- [Close case]

---

## Forks in this phase

| Fork point | Branches |
|---|---|
| 7.1 Generation hub | Include children statement / Skip |
| 7.2 Generation | Auto-advance |
| 7.3 Preview | Edit / Approve / Print / Download |
| 7.4 Pre-flight | All pass / Warnings / Blocking |
| 7.5 Review decision | Submit direct / Get review / Not ready |
| 7.5a Marketplace | Choose reviewer / Back |
| 7.5d Review outcome | No changes / Amendments / Concerns |
| 7.7 Waiting status | Sealed / Query / Update |
| 8.1 Implementation | Per task completion |

---

## Total screens in this phase: ~18

**Time estimate:**
- Phase 5 active time: 1-2 hours (generation + review + submission)
- Court wait: 6-10 weeks
- Phase 6 calendar time: weeks-to-months (long-running implementation)
