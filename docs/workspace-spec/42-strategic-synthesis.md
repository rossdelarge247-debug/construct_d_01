# Spec 42 — Strategic Synthesis: The Complete Settlement Workspace

**Date:** 17 April 2026 · **Amended:** 22 April 2026 (session 22)
**Purpose:** Synthesise session 19's strategic work into one document. Value proposition, positioning, and end-to-end journey redesign. Captures the shift from "financial disclosure tool" to "complete settlement workspace."

**Session 22 amendment:** The original six-phase journey below is superseded by the five-phase model locked in spec 68 (synthesis hub) + 68a-e (phase-specific locked decisions). Share collapses from a phase into an action; Move-on folds into Finalise tracking. Document-as-spine articulated as four documents: Sarah's Picture (Build) → Our Household Picture (Reconcile) → Settlement Proposal (Settle) → Generated legal docs (Finalise). Operational framing lives in spec 68. This file retains the strategic rationale that still holds; the phase-journey section is rewritten below to reflect the five-phase model.

## The reframe

Decouple is not a financial disclosure product. It's the platform where divorcing couples sort out the complete picture of their separation — finances, children, housing, and future needs — and produce legally binding documents from their agreement.

Divorce isn't a financial exercise. It's a life reorganisation. Every decision is interdependent: "Sarah keeps the house" only makes sense given "Sarah has primary care of the children" which only makes sense given "Mark pays £576/mo child maintenance." The complete picture is the product.

## The value proposition

### The unique claim

**The only place where both parties build one evidence-backed, shared picture of their complete settlement — finances, children, housing, and future needs — negotiate proposals on it, and generate legally binding documents from their agreement.**

Consumer-first. Bank-evidenced. End-to-end. Available without lawyers until absolutely necessary.

### Three positioning pillars

| Pillar | What it means |
|---|---|
| **Shared, not adversarial** | One settlement picture built together. Not two Form Es compared. The collaboration itself reduces conflict. |
| **Evidenced, not asserted** | Bank data + credit check + document evidence. Trust through transparency, not trust through professionals. |
| **End-to-end, not hand-off** | Complete settlement: disclosure → agreement → court documents → implementation. No "now find a solicitor." |

### Three audience-specific value props

**For separating couples:**
*"Sort out your complete separation — finances, children, housing — for under £1,000 and in 3 months. Instead of £15,000 and 18 months."*

**For mediators:**
*"Your clients arrive with evidenced, structured settlement pictures. You facilitate the human conversations. We handle the admin. Run more cases, deliver better outcomes."*

**For solicitors:**
*"Your clients arrive with structured, verified disclosure and agreed positions. Skip the 20 hours of document wrangling. Focus on legal judgment and advocacy."*

### The tagline

**"Decouple — the complete picture."**

---

## The complete picture (not just finances)

A divorce settlement covers four interdependent areas. All must be in the product.

### 1. Finances
Assets, debts, pensions, income, spending. What we've been designing. The household financial picture.

### 2. Children
Living arrangements, contact schedule, holidays, school decisions, childcare, child maintenance. Currently treated as a footnote — should be central. Most settlements are determined by child arrangements.

### 3. Housing
Who stays, who leaves, when. Interim housing. Future housing needs. "Can I afford the mortgage alone?" "Where do I live if we sell?"

### 4. Future needs
Post-separation budgets. Income projections. Career restart costs. Retraining. Retirement implications. This informs maintenance, pension sharing, and asset distribution.

### Why they're inseparable

The consent order is a single legal instrument covering all of these. The judge reviews D81 looking at the whole picture. Mediators cover all of them in sessions. Solicitors advise across all of them. They can't be separate products.

**Example:** "Sarah keeps the house" requires:
- **Finances:** Buying out Mark's equity, affording the mortgage
- **Children:** Providing stability for primary carer
- **Housing:** Sarah stays, Mark finds new accommodation
- **Future:** Sarah's 10-year housing plan, Mark's post-separation deposit

Remove any one and the decision doesn't make sense.

---

## The five-phase journey

One workspace. Four documents. Five phases from first question to post-order implementation.

**Share is an action, not a phase.** The share action from Build triggers entry to Reconcile — see spec 68 and 68b B-S for mechanics. **Move-on is absorbed into Finalise tracking** for V1 (richer post-order implementation treatment may surface as V1.5+).

### Phase 1: Start — "I'm getting divorced"
Pre-signup orientation + account creation.
- Public site explains the product
- AI plan surfaces the user's likely journey from a few orienting questions
- Safety screening (coercive control indicators) → signposting for flagged users
- Signup + tier selection
- Welcome tour (four post-signup content steps: Build / Reconcile / Settle / Finalise)
- Moment 1 acknowledgement + Moment 2 pre-bank profiling (spec 67)

### Phase 2: Build — "Sarah's Picture" (private)
Working on your part of the complete settlement document.
- Bank connection → financial picture auto-populates (247 transactions across 12 months)
- Per-section confirmation: Children as §1, Home, Pensions, Assets, Debts, Income, Outgoings
- Children (count, ages, primary care, contact, schools, childcare)
- Housing (current home, future intentions)
- Future needs (budget projections, income needs — deferred to Settle per spec 67 Gap 5)
- Evidence gathering (documents, valuations, credit check)
- Dashboard above the document — task-focused, gets user to next action fast
- **Sarah's Picture renders as a document throughout — §-numbered sections, trust chips inline, snapshot right-rail**

### Phase 3: Reconcile — "Our Household Picture" (shared)
Triggered by Share action from Build.
- Mark receives invite → respondent signup flow (G7-1..G7-5 locked session 22)
- Mark builds his own picture; joint document mirrors both
- Status quad header: Agreed / Differ / New to you / Gap to address
- Conflict cards: side-by-side values with provenance + delta, non-judgemental framing
- AI-ordered deliberation queue (biggest-impact-first)
- Mark status machine: not-invited / invited-not-opened / opened / building / shared
- Joint-doc versioning: V1.0 → V2.0 → Vx.y → AGREED on reconciliation complete

### Phase 4: Settle — "The Settlement Proposal"
Proposals cover all four areas, not just money.
- **Financial:** Property, pensions, savings, debts, maintenance
- **Children:** Living arrangements, contact pattern, holidays, school costs
- **Housing:** Transition plan, interim arrangements
- **Future:** Spousal maintenance, pension sharing, career restart support
- Option cards per section (Sell / Sarah keeps / Mark keeps / Defer-until-18)
- Running-split banner tracks Sarah-vs-Mark percentage + £ figures
- AI coach right rail: Court reasonableness / Fairness check / Coaching / On-this-comment
- Counter-proposal three-button response: Discuss / Counter / Accept
- Progress board with convergence chart + version history timeline
- Explicit sign by both parties to lock agreement

### Phase 5: Finalise — "Court-ready package" + post-submit tracking
- Consent order generated from agreed settlement (includes child clauses)
- D81 auto-populated (Section 10 from reasoning trails)
- Pension sharing annex (Form P) if applicable
- Statement of Arrangements for Children if applicable
- Eight-check pre-flight quality gate
- Three-tier solicitor fork: £0 direct / £250 pensions-only / £450 full
- Four-confirmation submit page (MyHMCTS or guided-manual per 68f F-4)
- Post-submit tracker: 6-10 week judicial review + Court-sealed state updates the agreement artefact
- **Move-on implementation guidance folded in for V1** (transfer property, share pension, close joint accounts, update records, set up contact schedule). Richer treatment deferred to V1.5+.

---

## What needs reordering

### 1. Children become central
From secondary section to Section 1 of the settlement document. Every other decision references them. "2 children, ages 4 and 7, primary care with Sarah" is the single most important fact in most settlements.

### 2. The document is the spine from day one
Not "build an app experience, then generate a document at the end." The document begins forming from the first profiling answer. Users see it emerging. It's tangible, real, and motivating throughout.

### 3. Orientation is inside the product
V1 as a separate public site with an interview, then V2 as a workspace, creates two mental models. The landing page sells the vision. Clicking "get started" drops you into Phase 1 — orientation, safety, profiling — all one product. No handoff.

### 4. Sharing happens progressively, not as a gated event
Once your picture is 70%+ complete, you can invite your ex. The document grows in both hands simultaneously. No "finish then exchange" ceremony.

### 5. Collaboration is native, not V3
There's no V3 as a separate product. The document becomes shareable when meaningful. Invitation is a button in Phase 2. The collaboration is a property of the document, not a separate app.

### 6. Legal end-state is included
Consent order, D81, pension sharing annex, parenting plan — all generated by the product from agreed structured data. Not "here's your summary, now find a solicitor."

### 7. Implementation is the final phase
After the order is sealed, the product guides through implementation. Transfer property. Share pension. Set up the contact schedule. Update records. This is the bit nobody guides today — and it's where agreements go to die if not followed through.

---

## Key enhancements needed

### 1. Trust system as a first-class feature

Every item carries a trust level:
- Self-declared
- Bank-evidenced
- Credit-verified
- Document-evidenced
- Both-party-agreed
- Court-sealed

Trust levels drive what the system can auto-generate (high trust → Tier 1 consent order), what the other party sees (verification badges), and what gaps surface (low trust + high value = verification nudge).

### 2. Emotional layer throughout

Every screen acknowledges the human, not just the data. Check-ins ("This can be a lot — take a break"). Celebrations ("You've completed your disclosure — that takes courage"). Context-aware reassurance. Coercive control safeguards that adapt the experience.

### 3. On-demand professional review

Not "you'll eventually need a solicitor." Instead: "tap here for a fixed-fee review" at specific moments:
- Consent order pre-submission (£200-500)
- Complex asset valuation query
- Tax implications check
- Pension sharing order review

### 4. Integrations

- **Zoopla/Rightmove** for indicative property values
- **Experian/Equifax** for credit verification
- **Pension Dashboard** (when available, late 2026/2027)
- **MyHMCTS** for court submission
- **GOV.UK** for State Pension forecast

### 5. CETV tracking

Pensions are the biggest timeline bottleneck (6-12 week wait). Explicit tracking: "Requested 3 weeks ago, expected in 3-5 weeks." Guidance on how to request. Reminders if provider delays. McCloud warnings for public sector schemes.

### 6. Safeguarding by design

- Coercive control detection (from V1 signals and behavioural patterns)
- Safety-adapted experiences (disable direct interaction, route through mediator)
- "You can revoke access at any time" — always visible
- Emergency safeguarding resources (Women's Aid, Men's Advice Line)
- Time-limited access links
- Fairness guardrails flag extreme splits

---

## Repositioning summary

| From | To |
|---|---|
| Financial disclosure tool | Complete settlement workspace |
| V1 / V2 / V3 (three products) | Five phases, four documents, one workspace |
| Dashboard output | Document as the spine |
| Disclosure-only | End-to-end (disclosure → agreement → court → implementation) |
| Direct-to-consumer only | Consumer + mediator partnerships + solicitor infrastructure |
| "Replace solicitors" | "Eliminate the 80% that's administrative" |
| Product | Platform / category |

---

## The two framings

### Ambitious (recommended)

Decouple is the platform for divorcing couples. Legally binding consent orders generated directly. Professionals available on-demand for the 20% that's genuine judgment. Mediators partnered (we supercharge their practice). Consumer-led disruption of a £1bn+ UK legal services market.

**Why this is defensible:**
- Legal research supports consent order self-submission (spec 41)
- Bank-evidenced data is structurally more reliable than solicitor-prepared Form Es
- The cost gap (£800-1,100 vs £14,561) makes adoption inevitable
- The moat is data quality + collaborative architecture + unified document

### Conservative (fallback)

Decouple is the best disclosure tool on the market. Professional partnerships handle the legal end. Optional solicitor review standard. Mediator-first go-to-market.

**Why this is safer:**
- Avoids direct confrontation with the legal profession
- Smaller regulatory risk surface
- Easier to partner with solicitors who might otherwise oppose
- Proven category (disclosure tools exist)

### The recommendation

**Ambitious framing, conservative rollout.** Build toward the complete end-to-end vision. Launch with mediator partnerships first (they're natural allies). Enable consent order generation but default to optional professional review initially. As data and precedent accumulates, expand direct submission.

This lets us build the disruptive version while minimising early regulatory/reputational risk.

---

## What we've got right (strengths to preserve)

1. **Engine fundamentals** — classification, signals, profiling architecture, test scenarios
2. **Bank-first approach** — the moat
3. **Unified household picture concept** — the breakthrough data model
4. **Tier-based matching** — matched/expected-but-unmatched/unknown
5. **The document as collaboration surface** — the Juro principle applied correctly
6. **Evidence trails and trust badges** — the transparency mechanism
7. **Service blueprint showing 80% admin elimination** — quantified value
8. **Legal research showing consent order self-submission is viable** — the full-journey unlock

## What needs building (new or expanded)

1. **Children as a first-class section** — not just a profiling answer
2. **Housing as a first-class section** — transitions, future needs
3. **Future needs as a first-class section** — budgets, projections
4. **The document as the spine** — edit mode + view mode, live preview throughout
5. **Orientation inside the product** — Phase 1 as native onboarding, not V1 public site
6. **Progressive sharing** — invite-from-70%-complete
7. **Consent order generation** — with pre-flight quality checks
8. **D81 auto-population** — Section 10 from reasoning trails
9. **Implementation phase** — post-order guidance and tracking
10. **Trust system** — levels, badges, gap detection
11. **Emotional design layer** — check-ins, celebrations, reassurance
12. **Integrations** — Zoopla, Experian, MyHMCTS
13. **Mediator partnership product** — white-labelled or guest-access version
14. **Solicitor review marketplace** — on-demand fixed-fee review
15. **CETV tracking** — timeline visibility and reminders
16. **Safeguarding layer** — coercive control detection and adaptation

---

## Where this leaves us

V2 is partially built — the financial engine is strong. V3 (collaboration) is specced but not built. The complete settlement workspace vision requires:

- **Reframing V2** to be document-led (not dashboard-led)
- **Expanding V2** to include children, housing, future needs sections
- **Building V3** as a continuous extension of V2 (not a separate product)
- **Building V4** (consent order generation, D81, submission, implementation)

This is a 12-18 month product roadmap, not a one-session sprint. But the strategic direction is now clear: we're not building a better Form E. We're building the way people sort out their separation.
