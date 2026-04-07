# V1 Flow Specification — The Gentle Interview

## Design principles

- Calm first
- One thing at a time
- The system does the heavy lifting
- Planning with imperfect information
- Skip and defer always available
- Never shame, never pressure
- Acknowledge where the user is
- Trust through honesty

## Step-by-step flow

### Step 1 — Welcome and reassurance

**Route:** `/start`

**Goal:** Reduce anxiety, set expectations, make the user feel safe starting.

**Content:**
- Short, warm welcome message
- What you'll get from this session (the three deliverables):
  - See the likely process for your specific situation
  - Shape a starting plan for children, housing, and finances
  - Know exactly what to focus on next
- Time expectation: ~20-30 minutes
- Reassurance: no sign-up needed, private, take your time
- CTA: "Let's begin"

**System behaviour:**
- Anonymous session created on page load
- Case record created in database
- PostHog: session_started event

**Micro-moment:** "You don't need to know everything. You just need to start."

---

### Step 2 — Situation snapshot

**Route:** `/start/situation`

**Goal:** Gather just enough to tailor the journey. Includes woven safety screening.

**Inputs (card selections / simple inputs):**
- Relationship status (married / civil partnership / cohabiting / other)
- Are you currently living together? (yes / no / it's complicated)
- Children? (yes with ages / no)
- Do you own or rent your home? (own jointly / own in one name / rent / other)
- Has the separation process already started? (not yet / we've discussed it / formally underway)
- How would you describe the relationship with your partner right now? (amicable / difficult but manageable / high conflict / I have safety concerns)

**Safety screening (woven in, not a separate gate):**
- The "safety concerns" option on the relationship question triggers:
  - Warmer, more cautious tone in all subsequent steps
  - Collaboration language suppressed throughout
  - Support resources surfaced: National Domestic Abuse Helpline, relevant links
  - Mediation suitability flagged in route explanation
  - Internal safeguarding flag set on case record

**System behaviour:**
- Answers stored against case
- Journey branches determined (children steps shown/hidden, property steps shown/hidden)
- Safeguarding state set

**Micro-moment:** After completion: "That's a really helpful starting picture. Let's look at what the process is likely to involve for you."

---

### Step 3 — Your route (process clarity)

**Route:** `/start/route`

**Goal:** THE key value moment. Help the user understand what the process looks like for their specific situation.

**Output:** A generated, personalised, plain-English route overview.

**Content structure:**
- "Based on what you've told me, here's the likely shape of your journey"
- Visual route diagram (simple, not complex — think timeline with 4-6 labelled stages)
- Key stages explained in 1-2 sentences each
- Expandable sections for deeper context:
  - "What is MIAM?" (if relevant)
  - "What about mediation?" (if relevant, and if safeguarding allows)
  - "Do I need a solicitor?"
  - "What about finances — is that separate?"
  - "What about the children — is that separate?"

**Personalisation logic:**
- Children → child arrangements track shown
- Property/assets → financial remedy track shown
- Amicable → mediation-forward route
- High conflict → more cautious framing, legal advice signposted more prominently
- Safety concerns → mediation may not be suitable flagged, professional support emphasised
- Already underway → route adjusted to show where they likely are

**This is not generic legal information.** It's a tailored route generated from their inputs.

**System behaviour:**
- Route card generated and stored against case
- AI generates the personalised summary (Claude)
- Route stored as structured data for workspace

**Micro-moment:** "Most people find that just seeing the shape of the process makes it feel more manageable."

---

### Step 4 — Children and parenting (conditional)

**Route:** `/start/children`

**Shown if:** User indicated they have children.

**Goal:** Help shape a broad starting position on arrangements. Not legal advice. Practical, child-focused thinking.

**Guided prompts (card selections + optional free text):**
- What are the current day-to-day arrangements? (live with me / live with partner / roughly shared / other)
- What would you like the arrangements to look like? (broadly the same / more time with me / more time with partner / roughly equal / I'm not sure)
- Are there specific concerns about the children? (schooling / childcare / special needs / distance / other / none)
- What feels most important for the children right now? (open text, optional)
- Confidence: How sure are you about what you'd want? (Known / Estimated / Unsure)

**System behaviour:**
- Children cards created in workspace
- Confidence state captured per input

**Micro-moments:**
- "It's clear your children matter to you. Let's think about what would work best for them."
- On Unsure: "That's completely fine. Most parents find this becomes clearer over time."
- After completion: "You've shaped a thoughtful starting position."

---

### Step 5 — Housing and property (conditional)

**Route:** `/start/home`

**Shown if:** User indicated they own property.

**Goal:** Capture broad aims and concerns around the home.

**Guided prompts:**
- What's the current housing situation? (own jointly / own in one name / mortgage / owned outright)
- What would you like to happen with the home? (sell and split / one person stays / not sure yet)
- Do you know the approximate value? (yes with estimate / rough idea / no idea)
- Do you know the mortgage balance? (yes with estimate / rough idea / no idea / no mortgage)
- Any specific concerns? (affordability / children's stability / location / other)
- Confidence: How sure are you about your housing aims? (Known / Estimated / Unsure)

**System behaviour:**
- Housing cards created in workspace
- Confidence state captured
- Property value and mortgage flagged for V2 follow-up if Unknown or Unsure

**Micro-moments:**
- On "not sure yet": "That's one of the most common answers. The financial picture will help clarify this."
- On Unknown property value: "No problem. We'll help you work that out in the next stage."

---

### Step 6 — Financial aims and concerns

**Route:** `/start/finances`

**Goal:** Capture the emotional and practical shape of financial concerns. Not detailed numbers — that's V2.

**Guided prompts:**
- What matters most to you financially? (multi-select cards: fair split / keeping the home / pension protection / children's stability / clean break / ongoing support / other)
- What worries you most? (multi-select cards: not enough to live on / hidden assets / pension loss / mortgage affordability / cost of the process / other)
- Are you broadly aware of your combined financial position? (yes, pretty clear / I know my side but not theirs / I have a rough idea / I really don't know)
- Anything else about finances you want to capture? (open text, optional)

**System behaviour:**
- Financial aim cards created in workspace
- Combined financial awareness level captured (feeds into adaptive output tier)

**Micro-moments:**
- "This isn't about exact numbers yet. It's about understanding what matters to you."
- After completion: "You've captured the financial picture as you see it now. The next stage will help you build the detail."

---

### Step 7 — Knowns, estimates, and unknowns

**Route:** `/start/confidence`

**Goal:** The signature UX moment. Explicitly map what the user knows across key domains.

**Interaction:** Cards representing key financial/practical domains. User tags each:
- Known (I have this information)
- Estimated (I have a rough idea)
- Unsure (I think I know but I'm not confident)
- Unknown (I don't have this information)

**Domains presented:**
- My income
- Partner's income
- Savings and bank accounts
- Debts and loans
- Property value
- Mortgage details
- My pension(s)
- Partner's pension(s)
- Other assets
- Regular financial commitments

**Visual design:** Elegant card-based layout with confidence chips. Not a spreadsheet. Each card is tappable to select a confidence state. The overall view becomes a visual confidence map.

**System behaviour:**
- Confidence states stored per domain
- Follow-up states derived (Unknown + high importance = Priority to confirm)
- Feeds directly into adaptive output tier and next-steps generation

**Micro-moments:**
- "Most people have a mix of knowns and unknowns. That's completely normal."
- "You can see exactly where the gaps are — and that's powerful information in itself."
- After completion: "You now have a clearer picture of what you know than most people at this stage."

---

### Step 8 — Plan reflection and provisional feedback

**Route:** `/start/plan`

**Goal:** Reflect back a coherent, confidence-aware summary. This is where the adaptive output model applies (see v1-adaptive-output.md).

**Output depends on tier:**
- Full plan → rich summary across all areas with strength assessment
- Partial plan → covers what's there, explicitly flags gaps with encouragement
- Thin plan → honest starting point with gentle direction
- Not ready → process clarity reinforced, plan deferred to next steps

**All tiers include:**
- Route summary (always)
- Confidence map visualisation (always)
- Download as PDF button
- Edit option (go back and update any section)

**System behaviour:**
- Plan generated via AI (Claude) using structured inputs
- Plan stored as structured JSON against case
- PDF generated on request
- Readiness assessment calculated from chapter completion and confidence states

**Micro-moments:**
- Full plan: "You've built a strong starting position. Here's where you stand."
- Partial plan: "You've made real progress. Some areas need more detail — and that's exactly what comes next."
- Thin plan: "You've taken an important first step. Here's what you've captured so far."
- Not ready: "Understanding the process is a huge step forward. When you're ready, we're here to help you build your plan."

---

### Step 9 — Personalised next steps

**Route:** `/start/next-steps`

**Goal:** Convert insight into momentum. Content adapts based on output tier.

**Full/partial plan next steps:**
- Prioritised actions with "what" and "why"
- Primary CTA: "Build your financial picture" → V2
- Secondary actions: "Strengthen your plan" (return to skipped sections), "Explore mediation options", etc.

**Thin plan next steps:**
- Focus on returning to strengthen the plan
- Softer V2 signposting: "When you're ready, the financial picture will help make your plan concrete"

**Not ready next steps:**
- Gentle: "When you're ready, come back and tell us about your situation"
- Support resources if safeguarding flagged
- No commercial pressure

**System behaviour:**
- Next steps generated from confidence/follow-up model
- Actions stored and trackable in workspace
- Each action linked to the chapter or vertical that resolves it

---

### Step 10 — Save your workspace

**Route:** `/start/save` (modal or inline prompt)

**Goal:** Convert at the moment of highest perceived value.

**Trigger:** After plan and next steps are shown.

**Messaging adapts by tier:**
- Full/partial: "You've built something worth keeping. Save your workspace to continue."
- Thin: "Save your progress so you can pick up where you left off."
- Not ready: "Save your session so everything is here when you're ready."

**Auth options:**
- Email magic link
- Google sign-in

**System behaviour:**
- Supabase anonymous → authenticated upgrade
- All session data linked to new account
- Redirect to `/workspace` on completion

**Micro-moment:** "Your information stays private. Nothing is shared unless you choose to share it."

---

### Step 11 — Continue to workspace / V2

**Route:** `/workspace`

**Goal:** The user arrives in their persistent workspace with the Compass layout.

**What they see:**
- Route map sidebar (V1 chapters completed, V2+ chapters visible as "coming next")
- Workspace cards generated from their interview answers
- Plan summary card at the top
- Next steps card
- Primary CTA: "Build your financial picture" (V2 entry)

**This is the Compass Workspace.** From this point forward, the user lives here. V2 adds new chapters to the route map and new cards to the workspace.
