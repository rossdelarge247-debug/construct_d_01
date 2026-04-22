# Spec 64 — Flow Map 8: Gaps, Uncertainties, and Conflicts

**Date:** 17 April 2026
**Purpose:** Honest inventory of what's undesigned, uncertain, or conflicting across the flow specs. The to-do list for visualisation and prototype work.

---

## A. Genuine gaps — undesigned screens/flows

### A1. Account management

- Password / auth recovery flow (we have magic link — what about Google account issues?)
- Email change
- Account merge (user accidentally created two accounts)
- Couple changes mid-process (one party reconciles, they stop using it)

### A2. Payment & billing

- Stripe payment screens (at the "share" gate, "settle" gate, "generate" gate)
- Payment failure handling
- Refund flows (user cancels, reviewer declines to review, etc.)
- Receipts and invoicing
- Subscription vs one-off payment display

### A3. Help and support

- In-app help/chat widget
- FAQ contextual surfacing
- Tutorial/onboarding tooltips
- Support ticket creation
- Status page for service health

### A4. Notifications

- In-app notification centre
- Email digest preferences
- SMS preferences
- Notification during "waiting for ex" periods

### A5. Settings

- Profile settings (name, contact preferences)
- Privacy settings (who can see what)
- Data export flow
- Data deletion flow (GDPR)
- Accessibility settings (high contrast, large text, motion reduction)

### A6. Legal document edge cases

- What happens if the document mode editor lets a user break required legal language?
- How do we prevent critical clauses from being removed?
- What about jurisdictional variants (Scotland, NI)? Scotland has different law — how does the UI adapt?

### A7. Mediator/solicitor guest flows

Partially designed but incomplete:
- Mediator invitation flow (how they join)
- Mediator's view (what they see, what permissions)
- Mediator comments and their visibility
- Solicitor review flow (already specced for Phase 5, but what about ad-hoc advice?)
- Invoicing/billing for professionals

### A8. Empty states and zero-data states

- First-time dashboard when no data yet
- "No transactions detected" case
- "No pensions visible" path (we flag but what's the full flow?)
- "No spending detected" edge case

### A9. Error recovery

- Document generation failure
- Template mismatch (our templates don't cover the user's unusual arrangement)
- Data corruption / recovery from last known good state
- Third-party API failures (Tink down, Experian unavailable)

### A10. Return visits across months

- What does the dashboard look like after case completion?
- Archival view
- Re-opening a case (rare but possible)
- Data retention expiry warnings

---

## B. Uncertain design decisions

### B1. Document mode vs edit mode

**Question:** Is the primary experience document-led or app-led?

**Evidence:**
- Specs 42-46 argue document-first
- Specs 45 shows edit/doc toggle
- Prototype 6 (public site) implies app-led entry
- Users may genuinely prefer either

**Resolution:** Prototype both and A/B test.

### B2. How detailed is system context at launch?

**Question:** Arithmetic only vs published sources vs typical ranges?

**Evidence:**
- Risk 4e recommends arithmetic only
- Specs 36 and 46 show "typical range" context
- Cold-start data problem means ranges aren't defensible

**Resolution:** Launch with arithmetic only. Add ranges as V1.5 with sources.

### B3. Who makes the first proposal?

**Question:** Always the inviter? Either party? System-suggested?

**Evidence:**
- Spec 46 implies Sarah (the inviter) makes first proposal
- But Mark (invitee) might be more motivated to propose
- Or a "joint proposal" mode where neither takes the lead

**Resolution:** Allow both. Add "joint proposal mode" as option at 6.0.

### B4. Children arrangements: in consent order or separate?

**Question:** Consent order covers financial only, Statement of Arrangements separate?

**Evidence:**
- Specs 46, 48 show children as part of proposals
- But legally, child arrangements are separate (can be Child Arrangements Order, or just agreed between parents)
- Mixing them may confuse users

**Resolution:** Needs legal counsel to confirm structure. Placeholder: assume some children terms can be in consent order (maintenance yes, contact schedule less clearly).

### B5. How do we present "fairness"?

**Question:** Fairness guardrail (flagging extreme splits) — helpful or paternalistic?

**Evidence:**
- Specs 37, 46 mention fairness check
- Users might feel judged by the system
- Courts actually do check fairness, so it's not off-base

**Resolution:** Present as information, not judgment. "This split is unusual — courts typically query this. Consider adding reasoning, or get a review for reassurance." Never block.

### B6. Credit check — opt-in or default?

**Question:** Should credit check be strongly recommended or just available?

**Evidence:**
- Spec 49 says opt-in
- But spec 54 (Risk 4b) says credit check is key anti-gaming
- Some users will find credit check intrusive

**Resolution:** Opt-in with visible trust-badge benefit. Strongly encourage for transparency.

### B7. How do mediators price?

**Question:** Hourly? Fixed fee? Per session? Through us or direct?

**Evidence:**
- Spec 49 says mediator pays us per case licence
- But mediator also charges their client hourly
- Billing flow unclear

**Resolution:** MVP — mediator bills client directly, we don't intermediate. Track engagement, add marketplace later.

### B8. Post-agreement archival access

**Question:** How long do we keep the data? What do users see after sealing?

**Evidence:**
- Data retention policy says 90 days post-case (MVP)
- But user might want to retrieve their documents years later
- Legal documents have permanent retention norms

**Resolution:** Default purge 90 days post-completion, but users can opt-in to indefinite retention. Sealed documents downloadable indefinitely (user's own files).

### B9. Mobile vs desktop

**Question:** Mobile-first or mobile-responsive?

**Evidence:**
- Specs 45, 49 say mobile-first for Phases 1-2
- But document view really needs desktop
- Users will start on phone

**Resolution:** Mobile-first for onboarding and early phases. Desktop-recommended (with graceful mobile) for document view, proposal builder, and legal review.

### B10. Languages

**Question:** English only at launch or include Welsh?

**Evidence:**
- Welsh courts legally require Welsh support
- But Welsh speakers don't always use Welsh courts
- Adds cost

**Resolution:** English only at V1. Welsh V2. Research demand before committing.

---

## C. Conflicts between specs

### C1. Phases (V1/V2/V3) vs continuous journey

**Conflict:** Earlier specs talk about V1/V2/V3 as releases. Later specs (42, 43) argue one continuous product.

**Resolution:** Update older spec references. V1/V2/V3 refers to release stages of ONE product, not three separate products.

### C2. Profiling length

**Conflict:** Spec 34 says 6 questions in 3 minutes. Risk 4e and pressure test 50 say realistically 8-12 minutes. Spec 58 stays with "target 3 minutes."

**Resolution:** Set honest expectation. "3 minutes happy path, 5-6 minutes if you consider your answers carefully."

### C3. Consent order submission — Tier 1 or Tier 2 default?

**Conflict:** Spec 41 recommends Tier 1 (direct submission) as possible for 60%. Spec 54 says launch Tier 2 default. Spec 56 says Tier 2 default.

**Resolution:** MVP launches Tier 2 default. Tier 1 earned with data (95%+ approval rate).

### C4. Children section placement

**Conflict:** Spec 33 says children are "footnote" currently. Spec 42 says "central, Section 1." Specs 45, 48 vary on where children appear in the document.

**Resolution:** Children are Section 1 in the document. All specs referring to children positioning should align.

### C5. Commercial model

**Conflict:** Spec 52 mentions "free-to-build, pay-to-share." Spec 49 has 3 models evaluated. Spec 55 assumes pricing in place.

**Resolution:** Pricing not decided. Prototype should not imply fixed pricing. Test willingness-to-pay.

---

## D. Things we have NOT designed at all

### D1. Admin/internal tools
- Support dashboard for customer service
- Content management for legal templates
- Ops dashboard for monitoring KPIs
- Reviewer onboarding (solicitors joining the marketplace)

### D2. B2B surfaces
- Mediator partnership dashboard
- Solicitor reviewer dashboard
- Partner programme landing pages

### D3. Legal domain edge cases
- International divorce (one party abroad)
- Same-sex / civil partnership nuances
- Short marriage / long marriage weight differences
- Second marriages with existing maintenance obligations
- Pending litigation (criminal, civil) affecting settlement

### D4. Integration surfaces
- Property valuation API (Zoopla/Rightmove)
- Pension Dashboard (when available late 2026)
- MyHMCTS direct integration (currently user navigates manually)
- Document signing (DocuSign / similar) for consent order

### D5. Analytics and feedback
- In-product feedback mechanisms
- NPS surveys at key moments
- User testing recruitment flows
- Beta programme management

### D6. Marketing tech
- Referral programme flows
- Partner tracking
- Campaign landing pages
- Email automation flows (welcome, nudge, re-engagement)

---

## E. Summary: priorities for flow visualisation tool

### Must map (happy path, fully specced)
- Public + sign up (spec 57)
- Profiling (spec 58)
- Bank + confirmation + spending (spec 59)
- Share + reconciliation (spec 60)
- Proposals + negotiation (spec 61)
- Finalise + submit (spec 62)

### Should map (conditional overlays)
- Adaptive flows (spec 63) — overlay where triggers exist
- Party B journey forks (in spec 60) — clearly different path

### Could map (if time)
- Error and edge-case flows
- Long-running implementation

### Do not map yet (undesigned)
- Anything in section D above — these need design work first

---

## F. Recommendations

1. **Feed specs 57-62 into flow visualisation tool** — these are comprehensive enough for mapping
2. **Spec 63 as overlay** — show adaptive flows as conditional branches
3. **Keep spec 64 (this file) as a "design debt" register** — items to address before build
4. **Resolve uncertainties via prototype user testing** — don't over-design before validation
5. **Tackle the stubs (S1-S7 in spec 53) as they become pressing** — not all at once
