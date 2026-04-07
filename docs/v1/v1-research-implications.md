# V1 Research Implications — What Changes

How the desk research findings affect V1 design, and flags for later verticals.

---

## Changes to V1 flow

### Step 2 (Situation snapshot) — additions needed

**Privacy screening question:**
Add: "Are you using a private device right now?" or similar. If concern flagged, surface digital safety guidance immediately (browser history, shared devices, safe email). This is grounded in Refuge finding that 72% of women accessing services report tech-facilitated abuse.

**Cohabiting vs married distinction:**
Add clear detection of cohabiting vs married/civil partnership. The legal rights are fundamentally different and the route explanation must reflect this. 79% of people believe "common law marriage" exists — it doesn't.

**Living situation:**
Add: "Are you currently living with your partner?" This is a major real-user pain point (multiple Mumsnet threads). It also affects safety and the practical journey ahead.

### Step 3 (Your route) — must include

**The three-process explanation:**
The route explanation must clearly communicate that divorce, financial settlement, and child arrangements are THREE SEPARATE but connected processes. This is the single biggest confusion in every source.

**Consent order / clean break warning:**
The route must explain that divorce alone does NOT end financial claims. You need a consent order or financial order. This is the most dangerous knowledge gap identified.

**Parallel timeline:**
Show that financial disclosure, MIAM, mediation, and child arrangements should happen DURING the 20-week divorce reflection period, not after. No existing source communicates this.

**Process options spectrum:**
Reference the Resolution spectrum (DIY → mediation → collaborative → solicitor → court) and help the user understand where they might sit. Not prescriptive, but informational.

**Pension early warning:**
Flag that CETV requests take up to 3 months and should be started early. This is consistently cited as a timing mistake by practitioners.

**MIAM and voucher scheme:**
Explain what a MIAM is (it's not mediation), that it's usually required before court, and that a £500 voucher exists (not means-tested). This is poorly known.

### Step 4 (Children) — additions

**Parenting plan reference:**
Reference Cafcass's "Our Child's Plan" tool. We should complement it, not duplicate it.

**Child maintenance vs child arrangements:**
Briefly distinguish these — they're separate systems. CMS handles maintenance; courts handle arrangements. Users consistently conflate them.

### Step 6 (Financial aims) — additions

**Pension prominence:**
Elevate pension awareness. "Pensions might be your biggest asset — often worth more than the home" (MoneyHelper). Add to the concerns/worries card options.

**Financial abuse awareness:**
Include a soft prompt about whether the user has full access to financial information, or whether access is restricted/controlled. This screens for economic abuse without clinical language.

### Step 7 (Confidence mapping) — no changes needed

The confidence mapping design already handles the reality that most users don't know their partner's finances. The research validates this as the right approach.

---

## Safeguarding changes (affects entire V1)

### "Exit this page" — mandatory

Implement the GOV.UK Design System "Exit this page" component on every page:
- Button in consistent position (top right recommended)
- Redirects to BBC Weather or similar neutral page
- Keyboard shortcut: press Shift key 3 times within 5 seconds
- Loading overlay to immediately clear content
- Secondary link for assistive technology users

### Safety content page

Before the guided journey begins (on /start or as an interstitial), include brief safety guidance:
- "If you're concerned about someone seeing this, use a private/incognito browser window"
- "You can leave this page quickly at any time using the Exit button or pressing Shift three times"
- Link to refugetechsafety.org for comprehensive digital safety guidance

### Notification safety

Design decisions for the auth/workspace:
- Never send emails with sensitive content in subject line or preview text
- Allow users to disable all notifications
- Never send to shared/family email without user confirming the address is private
- Consider neutral sender name that doesn't reveal service purpose

### Safeguarding screening — enhanced

The current design (Step 2, Option B) is validated by the research but needs these additions:

**Screen for coercive control, not just conflict level:**
Instead of just "How would you describe the relationship?" add:
- "Do you feel safe making decisions about your finances and children without your partner's permission?"
- "Has your partner ever controlled your access to money, documents, or bank accounts?"

These screen for financial abuse and coercive control — the forms most likely to be missed by simple conflict-level questions.

**If risk signals detected:**
- Suppress ALL collaboration language (already designed)
- Suppress mediation as a default recommendation (Women's Aid finding)
- Surface MIAM exemption information
- Show helpline numbers contextually, not just on a resources page
- Adjust route explanation to acknowledge that not all routes are safe for everyone
- Add: "If you're in immediate danger, call 999"

**Ongoing screening (V2+ implication):**
FMC standards require ongoing screening, not just initial. Flag for V2+ that soft check-ins should be woven into the workspace experience.

---

## Content and microcopy implications

### Language grounded in real user voice

The research provides actual user language. Key phrases to inform microcopy:

- "Where do I even start?" → Our welcome screen should answer this directly
- "I don't understand how it works" → Route explanation must be plain English
- "How the frig do I do the Form E?" → V3 must make this feel manageable
- "I had no idea" (about pensions) → Proactive education, not assumptions
- "It felt like grief" → Tone must acknowledge this emotional register

### Myth-busting woven into guidance

Don't create a separate "myths" section. Correct misconceptions in context:
- When explaining the route: "You might have heard of a 'quickie divorce'. In practice, the minimum timeline is 26 weeks..."
- When discussing finances: "There's no automatic 50/50 split. Courts consider many factors..."
- When discussing children: "The law doesn't use the word 'custody' any more..."

### Trust signals for the V1 output

The PDF download should include:
- Clear disclaimer: "This is a provisional plan, not legal advice"
- Suggestion to share with a Resolution-accredited solicitor
- Signpost to MoneyHelper's free pension appointment
- Signpost to Citizens Advice for free initial guidance

---

## V0 architecture implications

### Exit this page component
Must be in the design system from V0. Every page must include it.

### Safeguarding state model — expand
Add to the case model:
- `device_safety_flagged: boolean`
- `coercive_control_indicators: []`
- `financial_abuse_indicators: []`
- `notification_preferences: { email: boolean, content_in_email: boolean }`

### Notification service design
Build with safety as default:
- No sensitive content in email subjects/previews
- User-controllable notification preferences
- Neutral sender name

---

## Flags for later verticals

### V2 (Financial picture)
- Pension education and CETV guidance essential
- PODE (Pension on Divorce Expert) signposting needed
- Document checklist: 12 months bank statements, mortgage redemption, pension CETVs, payslips, P60s, tax returns
- Financial abuse screening should continue (ongoing)
- MoneyHelper free pension appointment should be signposted

### V3 (Disclosure + negotiation)
- Form E is 28+ pages — must be broken into guided sections, not presented as a monolith
- Non-cooperative partner handling: what to do when someone refuses disclosure
- D81 vs Form E distinction must be clear
- Court rejection reasons for consent orders (failure to explain departure from equality)

### V4 (Collaboration)
- Three mediation modes validated by research (inside, adjacent, outside platform)
- MIAM exemption workflow needed before recommending mediation
- Shuttle mediation considerations for DA cases
- Never create shared views accessible to both parties without safeguarding
- Activity logs: who accessed what, when (safety feature)

### V5 (Outputs)
- Consent order drafting: the gap between "we agree" and "court-sealed order" is massive
- D81 Section 10 (reasons for departure from equality) is the most common rejection reason
- Form A supporting data
- Adviser-ready bundles should include pension information prominently

---

## Competitor positioning confirmed

The research validates the Founder Pack's competitive gap analysis. Key differentiators:

1. **Applicant-first, not service-led** — Amicable is "pay people to do things." We are "do it yourself with intelligent guidance."
2. **Workspace, not portal** — SeparateSpace is informational. We are operational.
3. **The Form E gap** — No consumer-friendly digital Form E tool exists. V3 fills this.
4. **The unified journey** — Nobody joins up divorce + finances + children + mediation + formalisation. We do.
5. **The squeezed middle** — People who can't afford solicitors (£10k+) but need more than form-filing (£600). Our pricing sits here.
6. **Privacy-first, safety-aware** — No competitor has meaningful safeguarding built in.
