# Spec 65 — Pre-Signup Interview: Reconciled Design (V1 + Session 19)

**Date:** 20 April 2026
**Status:** Agreed. Reconciled from V1 work (spec 28) + session 19 strategic design.
**Supersedes:** Relevant sections of specs 57, 58 (these will be updated once post-signup is locked)

---

## Context

The pre-signup interview is the FREE public-facing experience. No sign-up required. Generates a personalised plan that's useful whether or not the user goes further. This reconciles:
- V1's "Gentle Interview" (5 phases, ~28 screens, 5-10 min)
- Spec 57-58's lightweight orientation (3 screens, ~2 min)

The reconciled version: **8 screens, ~3 minutes, with a substantial AI plan output.**

---

## Principles

1. ~3 minutes, 8 screens max
2. Surfaces what the AI plan needs — situation, complexity, partner dynamics
3. Weaves safeguarding naturally — not a separate blunt gate
4. Shows the real divorce journey — grounded in desk research
5. Useful regardless of Decouple — conventional path shown honestly
6. Different framing for "decided" vs "thinking about it" — same data, different tone
7. Output: personalised plan + journey map + downloadable PDF

---

## The 8 screens

### O1 — Where are you?

```
"Tell us where you're at"

○ We've decided to separate — I want to get the finances sorted
○ I'm thinking about separating — I want to understand what's involved
○ We're already in the process — I want to get things moving faster
```

Determines tone. "Decided" = action language. "Thinking" = softer/exploratory. "In process" = faster pace.

---

### O2 — Your situation

```
Relationship:      ○ Married  ○ Civil partnership  ○ Cohabiting  ○ Other
Living together:   ○ Yes  ○ No  ○ Complicated
Children under 18: ○ No  ○ Yes → [How many? 1/2/3/4+]
Your home:         ○ Own with mortgage  ○ Own outright  ○ Rent  ○ Other
```

4 sub-questions on one screen. Fast radios.

---

### O3 — Your ex and safety

```
"How would you describe things between you and your ex?"

○ Amicable — we want to sort this out together
○ Difficult — but manageable
○ High conflict — communication is very hard
○ I have safety concerns

"Is this device private to you?"
○ Yes  ○ Not sure
```

Safety woven naturally. Flags set silently if safety_concerns or device not private.

---

### O4 — Employment complexity

```
"Are either of you self-employed or a company director?"

○ No — both employed or not working
○ Yes — I am
○ Yes — my ex is
○ Yes — we both are
```

Gates complexity messaging in the plan.

---

### O5 — What you know about your partner's finances

```
"How much do you know about your partner's financial situation?"

○ I have a good idea of everything
○ I know some things but not all
○ Very little — they managed the money
○ I suspect they may be hiding things
```

Gates Tier 2 messaging, hidden-assets pathway, credit check emphasis.

---

### O6 — What matters to you

```
"What's most important to you right now?" (pick up to 3)

□ A fair split of everything
□ Keeping the family home
□ Protecting my pension
□ Stability for the children
□ A clean break — no ongoing ties
□ Getting this done quickly
□ Keeping costs low
□ Ongoing financial support

"What worries you most?" (pick up to 3)

□ Not having enough to live on
□ Hidden assets or dishonesty
□ Losing my pension
□ Not being able to afford the mortgage alone
□ The cost of the process itself
□ The emotional toll
□ My ex not cooperating
□ Not knowing what's fair
```

Two multi-select groups, capped at 3 each.

---

### O7 — Your plan (AI generated output)

Contains:
- Situation summary (reflecting O1-O6)
- The divorce journey (visual timeline — filing, disclosure, negotiation, agreement, court, implementation)
- What needs to happen (plain language steps)
- The conventional path (costs + timeline + next steps — helpful standalone)
- How Decouple helps (soft introduction, time/cost comparison)
- Personalised notes (based on their specific situation)
- Links: find out more → pricing

---

### O8 — What's next

```
○ Create a free account and start building my picture → sign up
○ Download my plan and come back later → PDF + optional email
○ I want to go the conventional route → helpful links (GOV.UK, MIAM, mediators, solicitors)
○ I need to talk to someone first → support resources
```

---

## Data captured (pre-signup state)

```
preSignupState = {
  stage: 'decided' | 'thinking' | 'in_process'
  relationship_status: 'married' | 'civil_partnership' | 'cohabiting' | 'other'
  living_together: 'yes' | 'no' | 'complicated'
  has_children: boolean
  children_count: 0 | 1 | 2 | 3 | 4
  property_status: 'mortgage' | 'own_outright' | 'rent' | 'other'
  relationship_quality: 'amicable' | 'difficult' | 'high_conflict' | 'safety_concerns'
  device_private: 'yes' | 'not_sure'
  self_employment: 'neither' | 'me' | 'ex' | 'both'
  partner_awareness: 'good_idea' | 'some_things' | 'very_little' | 'hiding'
  priorities: string[] (max 3)
  worries: string[] (max 3)
}
```

This data must bridge to post-signup without re-asking.

---

## What this does NOT cover

- Post-signup profiling (next spec — 66)
- Bank connection flow (spec 59)
- The AI plan generation logic (needs own spec)
- The Claude Design wireframes for this section (Action 2)
