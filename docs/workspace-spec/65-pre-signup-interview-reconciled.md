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

#### Adaptive plan shape

The 7 elements above compose adaptively from pre-signup-available state via 4 adaptivity dimensions (categorical hooks, not confidence-grading; not Tier-class quantitative scoring). Schema grounded in `src/app/dev/proto/pre-signup-interview/lib/types.ts`; composition logic in `lib/build-plan.ts`.

**Dimension 1 — Stage** (`Answers.stage` enum: `thinking` | `decided` | `in_process`):

- `situationSummary` opening — existing 3-branch composition at `build-plan.ts` L29-31 (thinking → exploratory; decided → action-oriented; in_process → progress-oriented).
- `whatNeedsToHappen` intro/framing — per-stage prepended phrase:
  - `thinking` → *"If you go ahead, here's what would need to happen"*
  - `decided` → *"Here's what needs to happen now"*
  - `in_process` → *"You're already in the process — here's what's coming next and where to focus"*
- `links.primaryCTA` — copy iteration follows the same stage signal; final strings drafted at impl time.

**Dimension 2 — Partner-finances awareness** (`Answers.partnerFinances.awareness` enum: `full` | `some` | `little` | `suspect`):

- `personalisedNotes` for `little` || `suspect` — existing `partner-finance-unknown` trigger at `build-plan.ts` L81-87 (retained).
- `personalisedNotes` for `full` — new trigger `partner-finance-full`: joint-prep language emphasising head-start advantage + bank-evidenced verification.
- `personalisedNotes` for `some` — new trigger `partner-finance-some`: caveated joint-prep emphasising partial picture + bank-evidenced fill-in.

**Dimension 3 — Example anchoring** (descriptive O1-O6 signals woven into plan body; not names — children's names + partner name are not collected pre-signup, per spec 65a §"Spec 58 — Profiling (Pre-Bank-Connection)" L61-67 ABSORBED-with-simplification table):

- `situation.childrenCount` (1-4) → `situationSummary` extension: *"You have <N> children together."*
- `situation.home` (mortgage | own-outright | rent | other) → `situationSummary` new sentence: *"Your home is mortgaged."* / *"You own your home outright."* / *"You rent your home."* (skip if `other`).
- `whatMatters.priorities` → `personalisedNotes` trigger pattern `priority-{value}` (e.g., `priority-keep-home`). Cap: max 1 priority-driven note (first selected proxy).
- `whatMatters.worries` → `personalisedNotes` trigger pattern `worry-{value}` (e.g., `worry-hidden-assets`). Cap: max 1 worry-driven note (first selected proxy).
- Combined note cap: max 2 new anchor-driven notes per render; existing 4 trigger notes unaffected.

**Dimension 4 — Lead-ordering** (which content focus appears first):

Lead category derived from selected priorities + worries + situational signals (coverage-weighted; tied → hardcoded fallback `children > housing > pensions > general`):

- `children` if `situation.hasChildren=yes` OR `whatMatters.priorities` includes `children-stability`
- `housing` if `situation.home != rent` OR `whatMatters.priorities` includes `keep-home`
- `pensions` if `whatMatters.priorities` includes `protect-pension` OR `whatMatters.worries` includes `losing-pension`
- `general` (default fallback)

Effect: lead phrase prepended to `situationSummary` BEFORE the stage-conditional opening (`build-plan.ts` L29-32 sits AFTER the new lead phrase); `whatNeedsToHappen` items reorder so the lead-relevant step appears at position 0.

#### Boundary

This amendment governs pre-signup O7 only. Spec 67 §"Gap 1: Data bridge from pre-signup — RESOLVED" (L84-86) post-signup routing-not-grading architecture is unchanged — pre-signup `PlanContent` adaptivity is composed from pre-signup state only and does not introduce confidence-scoring vocabulary that would conflict with post-signup section-by-section confirmation at Moment 3. Spec 34 §"Tier 1-3" (L188-250) transaction-matching framework is unchanged and uses "Tier" in a different sense from the vocabulary introduced here — the 4 adaptivity dimensions (stage, partner-finances-awareness, example anchoring, lead-ordering) and 4 lead categories (children, housing, pensions, general) are categorical hooks, not Tier-class quantitative grading.

#### Out of scope (V1.5 reservations)

Deferred to V1.5 per spec 67 §"Gap 11: Safeguarding carry-through" L788 progressive-disclosure pattern (*"Full adaptive safeguarding architecture (coercive control detection, mediator routing, decoy mode, adaptive pacing) deferred to V1.5 backlog"*):

- **Complexity** as a multi-factor adaptivity dimension (cross-cutting heuristic across O2 + O3 + O4 + O5).
- **Vocab calibration** (formal/casual tone derivation from O1-O6 overall signals).
- **Safety / conflict signals** beyond the `suspect` hook in Dimension 2 — bundled with the spec 67 L788 reservation above.
- **Additional anchor surfaces**: `situation.relationship` type (low practical impact); `exAndSafety.relationshipQuality` beyond `safety-concern` (sensitive tone work); `employment.selfEmployment` as `situationSummary` anchor (duplicative — already triggers note).
- **Additional lead categories**: `clean-break`, `ongoing-support`, `low-cost`, `speed`, `fair-split` (no obvious leading section in this spec's 7-element `PlanContent` structure).

Implementation slice: per `docs/slices/S-65-amendment-F-OUT-01-02/` AC-6 — `S-PROTO-O7-adaptive-hooks` ships impl (~75-120 LoC across `build-plan.ts`).

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
