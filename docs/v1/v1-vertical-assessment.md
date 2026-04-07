# V1 Vertical Planning Standard Assessment

Assessed against the vertical planning standard from the Founder Pack V3.3 §25.

---

## User problem

I need a calm, intelligent way to understand what path I'm on, shape a sensible first plan, and work out what I still need to know — without being forced into legalistic forms, false precision, or commitment before I trust the service.

**Status:** Well-defined. Grounded in the Founder Pack and V1 strategy docs.

---

## Desk research base

The V1 strategy doc (Doc 4) specifies that the vertical should be grounded in:

- Official guidance (GOV.UK on divorce, finances, child arrangements)
- Mediator guidance (FMC standards, MIAM process)
- Child-arrangement guidance (Cafcass, child-focused practice)
- Practitioner/solicitor guidance (resolution, law society)
- Impartial money/help content (MoneyHelper, Citizens Advice)
- Support content (Relate, domestic abuse services)
- Real-user discussion (forums, Mumsnet, Reddit, social)

**Status: NOT YET DONE.** We have the requirement but have not conducted the desk research. This is a gap.

**Recommendation:** Conduct focused desk research before or during V0 build. Key questions the research should answer:
1. What do people actually search for when separation begins?
2. What does GOV.UK tell them and where does it fall short?
3. What does the MIAM/mediation path actually look like from the user's perspective?
4. What recurring confusions appear in forum discussions?
5. What do practitioners say people most commonly get wrong early on?
6. What are the specific safeguarding screening approaches used by mediators (FMC standards)?

This research directly informs the route generation logic, the guided prompts, the microcopy, and the safeguarding screening design.

---

## As-is journey snapshot

Captured in Doc 4:

1. Privately realising separation/divorce may be coming
2. Not necessarily telling the partner yet
3. Searching for information and reassurance
4. Worrying about children, housing, finances, and process
5. Not knowing whether to gather documents, seek legal advice, consider MIAM/mediation, or think more clearly first
6. Trying to imagine a sensible first position
7. Discovering that divorce, finances, and children are different but connected tracks
8. Often still knowing only part of the financial picture

**Status:** Defined at a strategic level. Desk research would add specificity and real-user language.

---

## Pain points

From Doc 4, confirmed and expanded:

| Pain point | Description | How V1 addresses it |
|-----------|-------------|-------------------|
| Process confusion | Users don't know what the process involves or what order things happen in | Personalised route explanation (Step 3) — guaranteed deliverable |
| Blank-page planning | No framework for shaping a starting position | Guided prompts across children, housing, finances (Steps 4-6) |
| Incomplete information | Users know only part of the picture, especially partner's finances | Confidence model (Known/Estimated/Unsure/Unknown) normalises this |
| Route uncertainty | Users don't know if they need mediation, a solicitor, or both | Route generated from their specific situation, not generic advice |
| Emotional overload | The combined weight of emotional, financial, and admin stress | Calm UX, one thing at a time, micro-moments of reassurance |
| Cost anxiety | Fear of expensive legal process before understanding what's needed | Free V1 delivers real value; commercial bridge is clear and non-pressuring |
| Information fragmentation | Guidance is spread across GOV.UK, solicitor sites, forums, mediator sites | Single guided experience replaces scattered reading |
| False precision pressure | Existing tools/forms demand exact answers the user doesn't have | System explicitly supports estimates, unknowns, and "not sure yet" |

**Status:** Well-defined. Desk research may surface additional pain points.

**Potential gaps to investigate:**
- Privacy anxiety ("will my partner find out I'm doing this?")
- Trust in digital tools with sensitive family data
- Confusion about what's legally binding vs. advisory
- Fear of making a "wrong" first move

---

## Opportunities

| Opportunity | How V1 captures it |
|------------|-------------------|
| Confidential, low-friction entry | No sign-up, anonymous session, private by default |
| Guided preparation vs. generic reading | Personalised route and plan, not a blog or checklist |
| Proposal shaping before paperwork | User shapes a position before any formal process begins |
| Planning that tolerates incomplete information | Confidence model is a core feature, not an afterthought |
| Knowns/unknowns mapping as a product moment | Step 7 (confidence mapping) is designed as a signature UX moment |
| Intelligent identification of what matters next | Adaptive next steps derived from confidence and follow-up model |
| Calm bridge into deeper workflow | Commercial bridge screen + workspace entry |
| Premium first-run experience as competitive edge | The first 30 minutes should be the best in the category |
| Downloadable output as trust builder | PDF plan is tangible proof of value, shareable with advisers |

**Status:** Well-mapped. Each opportunity has a clear design response.

---

## Why this vertical exists

Without V1, everything downstream is weaker. If the product can't help someone move from overwhelm to clarity at the start, they won't trust it with their finances, evidence, or negotiation.

V1 is:
- The front door
- The trust builder
- The activation event
- The workspace foundation
- The commercial conversion moment

**Status:** Clear and well-justified.

---

## Downstream value

V1 produces the starting state for the entire persistent workspace:

- **Route card** → informs which journey phases are relevant
- **Children/housing/financial aims** → become the starting position cards that V2 deepens
- **Confidence map** → drives V2 task prioritisation (what to build detail on first)
- **Safeguarding flags** → inform V4 collaboration behaviour
- **Readiness tier** → determines the commercial bridge positioning
- **Next steps** → direct entry points into V2 workflow

**Status:** Well-defined. The vertical integration is explicit.

---

## User states

From Doc 4/5:

| State | Description | V1 handling |
|-------|-------------|-------------|
| A — Quiet preparation | Hasn't told partner, exploring privately | Maximum privacy, no collaboration language, gentle pace |
| B — Early active separation | Partner knows, early stages | Standard flow, mediation/MIAM context relevant |
| C — Partially underway | Some process already started | Route adjusted to show where they likely are, skip what's done |
| D — Highly uncertain financial picture | Knows very little about combined finances | Confidence model handles this gracefully, V2 is the resolution |
| E — Higher conflict / possible unsuitability | Safety concerns, coercive control risk | Safeguarding screening triggers adjusted route, suppressed collaboration, resources surfaced |

**Status:** Well-defined across all five states.

---

## Key user stories

From Doc 4:

1. As a person beginning mostly on my own, I want to understand the likely process so I do not feel lost
2. As someone with incomplete information, I want to work with estimates and unknowns rather than wait for perfect information
3. As a parent, I want help thinking through practical arrangements, not abstract doctrine
4. As someone worried about housing and finances, I want to test what I'm aiming for before reactive negotiation begins
5. As someone under stress, I want the service to tell me what matters next and why

**Additional stories identified during Sprint 0:**

6. As someone who doesn't know what they don't know, I want the service to show me where the gaps are
7. As someone worried about cost, I want to get real value before being asked to pay
8. As someone concerned about privacy, I want to explore without creating an account
9. As someone who may be at risk, I want the service to recognise this and adjust without alarming me

**Status:** Comprehensive. Story 9 (safeguarding) is particularly important.

---

## Key outcomes

By the end of V1, the user should have:

1. Process clarity — understand the likely route for their specific situation
2. A provisional plan (depth varies by tier) on children, housing, finances
3. A confidence map — what's known, estimated, unsure, unknown
4. A sense of plan strength — what's solid vs. tentative
5. A personalised next-step path
6. A clear understanding of what the service offers next (commercial bridge)
7. A saved workspace (if they convert)
8. A downloadable PDF (if plan tier warrants it)

**Status:** Well-defined. Adaptive output model ensures outcomes match input depth.

---

## North-star UX

A user arrives anxious and vague. Within one guided session, they feel materially calmer, clearer on the likely path, supported in shaping a sensible first position, and aware of the information gaps that matter most.

The reaction we want:
- "Someone finally laid this out clearly for me"
- "I can see what I'm dealing with"
- "I know what to do next"
- "It made something horrible feel manageable"

**Status:** Clear and emotionally grounded.

---

## Magic moments

1. "I understand the shape of this." (Step 3 — route explanation)
2. "I've started turning worries into a real plan." (Steps 4-6 — guided planning)
3. "I can see what I know and what I need to find out." (Step 7 — confidence mapping)
4. "I know exactly what to do next." (Step 9 — next steps + service overview)
5. "It felt like it was doing the heavy lifting." (Overall — system-generated summaries, adaptive plan)

**Status:** Defined and mapped to specific flow steps.

---

## Interaction model

**Gentle Interview** (Steps 1-10): Single-question-at-a-time, single-column, full-focus. Card selections, simple inputs, confidence toggles, expandable explainers. Progressive, calm, adaptive.

**Compass Workspace** (post-auth): Journey-phase sidebar + task-driven main area. V1 cards become starting position. Forward-looking, process-driven, extensible.

**Transition**: Interview generates the workspace. The commercial bridge sits between plan output and save/auth.

**Status:** Well-defined. Hybrid model agreed and specified.

---

## Technology opportunities

| Opportunity | Technology | V1 implementation |
|------------|-----------|------------------|
| Adaptive route generation | AI (Claude) | Generate personalised route from situation inputs |
| Plan summarisation | AI (Claude) | Generate confidence-aware plan summary |
| Intelligent next-step prioritisation | Rules + AI | Derive follow-up states from confidence model, generate ranked actions |
| Smart default suggestions | AI (Claude) | Suggest plausible arrangements based on situation (not legal advice) |
| Safeguarding signal detection | Rules + AI | Pattern detection in situation answers, adjust flow |
| PDF generation | Server-side | Branded, structured plan document |
| Anonymous-to-auth session linking | Supabase anonymous auth | Seamless upgrade with data preservation |

**Status:** Defined and technically feasible within the stack.

---

## Confidence/follow-up logic

**Confidence states** (user-assigned):
- Known / Estimated / Unsure / Unknown

**Follow-up states** (system-derived):
- Fine for now / Confirm later / Priority to confirm / Resolved

Applied to domains in Step 7: income, partner's income, savings, debts, property value, mortgage, pensions, partner's pensions, other assets, regular commitments.

Feeds into: adaptive output tier, next-step prioritisation, V2 task ordering, workspace confidence map.

**Status:** Well-defined. Separate concepts maintained as per Founder Pack.

---

## Launch implementation

The V1 launch includes:

1. Landing page with "Get started" CTA
2. Welcome screen with value proposition
3. 6-step Gentle Interview (situation, route, children, home, finances, confidence)
4. Adaptive plan output (4 tiers) with PDF download
5. Next steps roadmap
6. Commercial bridge screen (service overview + Standard/Enhanced tiers)
7. Save workspace / auth conversion
8. Compass Workspace with journey-phase sidebar and task-driven main area
9. Stubbed features, pricing, and legal pages

**Status:** Specified in detail across v1-flow-spec.md, v1-adaptive-output.md, v1-screen-map.md, v1-wireframes.md.

---

## Spike questions / unknowns

From Doc 4, plus additions from Sprint 0:

| Question | Impact | Status |
|----------|--------|--------|
| How sophisticated can plan-review logic be without sounding overconfident? | Affects AI prompt design and disclaimer framing | Open — test during build |
| How should uncertain information be represented visually? | Core UX decision for confidence chips/maps | Open — design system work |
| How much branching is too much in the interview? | Affects complexity and build time | Partially resolved — conditional steps are limited to children and home |
| How should safeguarding signals alter the route without alarming the user? | Critical for emotional safety | Open — needs desk research on FMC screening approaches |
| What is the most elegant save-workspace conversion moment? | Affects conversion rate | Resolved — after plan + commercial bridge |
| Will the adaptive output tiers feel right in practice? | Core value delivery | Open — test with test group |
| What pricing works for Standard vs. Enhanced? | Commercial model | Deferred — configurable stubs for now |
| How do we handle returning anonymous users (cleared cookies)? | Data loss risk | Open — technical spike needed |
| What is the right level of AI involvement in route generation vs. rules-based logic? | Build complexity, accuracy, cost | Open — prototype both approaches |

**Status:** Identified. Several need resolution during V0/V1 build.

---

## Trust/risk considerations

| Risk | Mitigation |
|------|-----------|
| Users interpret plan as legal advice | Clear framing throughout: "provisional", "starting position", "not legal advice". Disclaimer in PDF |
| Safeguarding missed or mishandled | Structured screening in Step 2, route adjustments, resource surfacing. Desk research on FMC standards |
| Overconfident AI-generated summaries | Confidence-aware language in prompts. Never state legal outcomes. Always frame as provisional |
| Data loss for anonymous users | Server-side sessions via Supabase anonymous auth. Clear save prompts |
| Users feel sold to too aggressively | Commercial bridge is informational, not pressuring. Free save always available. Tone adapts by readiness tier |
| Mediation assumed safe when it isn't | Safety screening suppresses mediation language when risk signals detected |
| User enters false information | Not a V1 problem — system works with what it's given. Evidence layer (V2) adds verification |

**Status:** Well-considered. Safeguarding desk research is the key gap.

---

## Auth/conversion/monetisation implications

| Moment | Design |
|--------|--------|
| Start of journey | No auth. Anonymous session. Zero friction |
| During interview | No auth prompts. No interruptions |
| After plan generated | Commercial bridge: show service overview + tiers |
| Save workspace | Auth conversion: magic link or Google |
| Workspace entry | Authenticated. Tier selected (or free save) |
| V2 entry | Paid tier required (Standard or Enhanced). Upgrade path available |

**Tier model:**
- Free: V1 guided journey + plan + PDF + workspace save
- Standard: Full picture + disclosure + sharing + negotiation + agreement
- Enhanced: Standard + court document drafting + additional support TBC

Configurable: features can be repackaged into different bundles.

**Status:** Defined. Pricing placeholder until validated.

---

## Enhancement path

| Enhancement | When | Dependency |
|------------|------|-----------|
| Richer route generation with more branching | Post-launch data | Usage patterns show which branches matter |
| Smarter plan feedback with scenario modelling | V2+ | Needs financial detail to be meaningful |
| Returning-user re-engagement flows | Post-V1 | Analytics on drop-off points |
| Content/SEO pages driving to V1 entry | Pre-public launch | Content strategy needed |
| Professional referral entry path | V4+ | Professional adoption model |
| Open banking pre-population of confidence map | V2+ | Regulated partner needed |
| Multi-language support | Post-launch | Market expansion decision |
| Richer safeguarding with professional triage | V4+ | Professional network needed |

**Status:** Identified. None block V1 launch.

---

## Success metrics

**Product metrics:**
- Guided-entry start rate (landing → /start)
- Interview completion rate (per step)
- Interview drop-off by step
- Plan generation rate (by tier)
- PDF download rate
- Commercial bridge engagement (tier selection rate)
- Save-workspace conversion rate
- Progression into workspace
- Progression into V2

**User-value metrics:**
- Self-reported clarity increase (post-plan micro-survey, optional)
- Self-reported usefulness of route explanation
- Plan tier distribution (proxy for how much users could provide)

**Strategic metrics:**
- Which acquisition source drives the most completions
- Which unknowns most commonly block planning (informs V2 priorities)
- Which next-step recommendations are most followed
- Standard vs. Enhanced tier selection ratio
- Time-to-value (start to plan generation)

**Status:** Comprehensive. PostHog instrumentation plan covers these.

---

## Overall assessment

| Planning standard item | Status |
|-----------------------|--------|
| User problem | ✅ Well-defined |
| Desk research base | ⚠️ Required but NOT YET DONE |
| As-is journey snapshot | ✅ Defined, would benefit from research depth |
| Pain points | ✅ Well-mapped with V1 responses |
| Opportunities | ✅ Each has a design response |
| Why this vertical exists | ✅ Clear |
| Downstream value | ✅ Explicit integration points |
| User states | ✅ All five defined with handling |
| Key user stories | ✅ Comprehensive |
| Key outcomes | ✅ Defined with adaptive model |
| North-star UX | ✅ Clear and emotionally grounded |
| Magic moments | ✅ Mapped to flow steps |
| Interaction model | ✅ Hybrid agreed and specified |
| Technology opportunities | ✅ Mapped to stack |
| Confidence/follow-up logic | ✅ Well-defined |
| Launch implementation | ✅ Specified in detail |
| Spike questions | ✅ Identified, several open |
| Trust/risk considerations | ✅ Mitigations defined |
| Auth/conversion/monetisation | ✅ Full model with tiers |
| Enhancement path | ✅ Identified, none blocking |
| Success metrics | ✅ Comprehensive |

**Key gap: desk research.** Everything else is well-covered. The desk research should be conducted to validate assumptions, inform microcopy, sharpen route logic, and ensure safeguarding screening is grounded in real practice standards.
