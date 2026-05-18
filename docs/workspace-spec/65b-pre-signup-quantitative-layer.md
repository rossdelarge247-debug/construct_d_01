# Spec 65b — Pre-Signup Quantitative Layer

**Date:** 16 May 2026
**Status:** Agreed. Extends spec 65.
**Extends:** Spec 65 "Pre-Signup Interview: Reconciled Design"
**Bridges to:** Spec 67 "Post-Signup Profiling Progress" — see §"Bridge to spec 67" below for the verbatim citation.

---

## Context

Spec 65 ships 8 qualitative screens at ~3 minutes. The plan output at O7 personalises from categorical signals — stage, partner-finances awareness, situational anchors, lead-ordering — but has no quantitative hooks for sharing-principle weighting, consent-tier complexity, or timeline pressure.

This spec extends the pre-signup interview with a **quantitative layer** between O6 and O7. Three new themed screens (~2 minutes added) capture demographics, financials, and time-intent through bucket inputs. Every field is optional with explicit skip. Expansion fields are progressively disclosed per-screen with rationale-led toggles — users see what each tier of sharing unlocks in their plan output.

The total experience moves from 8 screens / 3 min to **11 screens / ~5 min**. Spec 65 §Principles L21 states: *"~3 minutes, 8 screens max"* — the architectural decision in §Status below relaxes that ceiling for this layer.

---

## Principles

1. **Optional everywhere.** Every quantitative field has "Prefer not to say". Every screen has "Skip this section". Skipping never blocks plan generation.
2. **Buckets, not figures.** Pre-defined 4-6 option buckets for every numeric field. Lower exposure feel; faster input; sufficient for plan-tier logic. Free numeric input is reserved for post-signup bank-confirmed values.
3. **Staggered expansion with rationale.** Each screen presents its core field(s) first. A rationale-led toggle ("Want a sharper plan? Add X — unlocks Y") reveals expansion fields. Users opt in per-theme; they can deepen demographics without deepening financials.
4. **Compassionate framing.** Sensitive fields (income, assets, debts) carry the "this is optional" reminder visibly. Tone: collaborative, never interrogating. Per CLAUDE.md §Product rules — "a warm hand on a cold day".
5. **Buckets are throwaway after bank connect.** Bank-extracted figures supersede the bucket selections at Moment 3 confirmation (see §"Bridge to spec 67" below for the verbatim approach). Pre-signup buckets exist to personalise the plan and seed AI-coach context; they do not persist as facts after Moment 3 bank confirmation.

---

## Placement in the existing 8 screens

The new section slots between O6 ("What matters to you") and O7 ("Your plan"). Sequence:

```
O1 → O2 → O3 → O4 → O5 → O6 → [ O6.5 → O6.6 → O6.7 ] → O7 → O8
                              ↑                       ↑
                              new                     new
                              quantitative            tail
                              layer
```

**Transition copy after O6:**

```
"You've shared what matters. Now a few optional questions
that help us tailor the numbers in your plan —
sharing-principle weighting, consent-order complexity,
and your timeline.

Every question is optional. You can skip any field or
skip the whole section."

[Continue →]   [Skip the quantitative section →]
```

The skip-whole-section affordance jumps the user directly to O7 with all quantitative state empty. Plan output gracefully degrades to qualitative-only personalisation.

---

## The 3 new screens

### O6.5 — About you and your relationship

**Core field (always shown):**

```
"Your children's age bands"  (skipped entirely if O2 has_children=false)

Youngest child:    ○ 0-4   ○ 5-11   ○ 12-15   ○ 16-17   ○ 18+   ○ Prefer not to say
Oldest child:      ○ 0-4   ○ 5-11   ○ 12-15   ○ 16-17   ○ 18+   ○ Prefer not to say
```

If `children_count = 1`, only "Youngest" shown (relabelled "Your child").

**Rationale-led expansion toggle:**

```
[+ Add ages and relationship length — unlocks pension and sharing-principle weighting]
```

When toggled open:

```
"Your age"                ○ <30   ○ 30-39   ○ 40-49   ○ 50-59   ○ 60+   ○ Prefer not to say
"Your ex's age (relative to yours)"   ○ Same age as you   ○ Older   ○ Younger   ○ Don't know   ○ Prefer not to say
"Length of relationship"  ○ <2y   ○ 2-5y    ○ 5-10y   ○ 10-20y  ○ 20+y  ○ Prefer not to say
```

**Why these matter (shown beside the toggle in plain language):**

- Your age + how your ex's age compares to yours shifts pension considerations into the foreground. The older partner's pension is often the central asset; relative age matters most for sharing-rights calculations.
- Length of relationship weights the sharing-principle calculation courts use.

**Note on ex's age framing.** Captured as a relative chip rather than an absolute band to minimise the collection of third-party personal data under UK GDPR. Sufficient for pension-relevance framing; not detailed enough to re-identify the ex-partner from this data alone.

**Screen actions:**

```
[Continue →]   [Skip this screen →]
```

---

### O6.6 — Your finances at a glance

**Preamble (always shown above the fields):**

```
"None of this is exact — bucket ranges only. After you sign up
and connect your bank, we'll work from the real figures. These
buckets just help your plan land closer to your actual situation."
```

**Core fields (always shown):**

```
"Combined monthly take-home"   (you and your ex)
○ <£2k   ○ £2-4k   ○ £4-6k   ○ £6-10k   ○ >£10k   ○ Prefer not to say

"Total assets you're aware of"  (savings + property equity + pensions + other)
○ <£10k   ○ £10-50k   ○ £50-200k   ○ £200-500k   ○ £500k-1M   ○ >£1M   ○ Prefer not to say
```

**Rationale-led expansion toggle:**

```
[+ Add property, savings, debts and pension — unlocks consent-order complexity tier]
```

When toggled open:

```
"Property equity"      (skipped entirely if O2 property_status=rent)
○ <£50k   ○ £50-150k   ○ £150-300k   ○ £300k-500k   ○ £500k+   ○ Prefer not to say

"Savings and cash"
○ <£5k   ○ £5-20k   ○ £20-50k   ○ £50-100k   ○ £100k+   ○ Prefer not to say

"Debts (excluding mortgage)"
○ None   ○ <£5k   ○ £5-15k   ○ £15-30k   ○ £30k+   ○ Prefer not to say

"Pension value (rough)"
○ None   ○ <£25k   ○ £25-100k   ○ £100-300k   ○ £300k+   ○ Prefer not to say
```

**Why these matter (shown beside the toggle):**

- Total assets above £500k typically need a more detailed consent order.
- Pension value drives whether pension sharing is in scope.
- Debts shape the "what to clear before settling" steps in your plan.

**Screen actions:**

```
[Continue →]   [Skip this screen →]
```

---

### O6.7 — Your timeline

**Core field (always shown):**

```
"When would you like this settled?"

○ As soon as possible
○ Within 3 months
○ Within 6 months
○ Within 12 months
○ 18+ months — no rush
○ Not sure yet
○ Prefer not to say
```

**Rationale-led expansion toggle:**

```
[+ Add what's driving the timeline — helps your plan address the real pressure]
```

When toggled open:

```
"What's driving your timeline?"  (pick any that apply)

□ Court or legal deadline
□ A new relationship
□ Housing — buying, renting, downsizing
□ Children's stability — school year, moves
□ Financial pressure
□ Emotional readiness
□ No specific driver
```

**Why this matters:**

- An ASAP timeline with a court deadline routes differently than ASAP with no driver.
- Children-stability driving the timeline emphasises the school-year framing in your plan.

**Screen actions:**

```
[Continue to your plan →]   [Skip this screen →]
```

---

## Progressive expansion mechanics

**Per-screen, not global.** The user makes an independent disclosure decision per theme. They can answer the full expansion on demographics, skip financials entirely, and accept the core-only on time-intent. No upfront global tier choice.

**Default collapsed.** Expansion toggles are collapsed by default. The rationale strapline is always visible so the user understands the trade-off without opening the toggle.

**State persistence.** Toggling open and then closing without answering leaves the expansion fields empty (equivalent to "Prefer not to say"). No coercion to fill what was opened.

**Skip-screen vs skip-fields.** "Skip this screen" sets all that screen's fields to empty and advances. "Prefer not to say" on a single field leaves the rest answerable. Both are equivalent for plan-engine consumption.

---

## Data captured (state extension)

Extends spec 65 `preSignupState` (L218-233):

```
preSignupState.quantitative = {
  // Demographics (O6.5)
  child_age_youngest:     '0-4' | '5-11' | '12-15' | '16-17' | '18+' | null
  child_age_oldest:       '0-4' | '5-11' | '12-15' | '16-17' | '18+' | null
  your_age:               '<30' | '30-39' | '40-49' | '50-59' | '60+' | null
  ex_age_relative:        'same' | 'older' | 'younger' | 'unknown' | null
  relationship_length:    '<2y' | '2-5y' | '5-10y' | '10-20y' | '20+y' | null

  // Financials (O6.6)
  combined_monthly_income: '<2k' | '2-4k' | '4-6k' | '6-10k' | '>10k' | null
  total_assets:           '<10k' | '10-50k' | '50-200k' | '200-500k' | '500k-1M' | '>1M' | null
  property_equity:        '<50k' | '50-150k' | '150-300k' | '300-500k' | '500k+' | null
  savings_cash:           '<5k' | '5-20k' | '20-50k' | '50-100k' | '100k+' | null
  debts_non_mortgage:     'none' | '<5k' | '5-15k' | '15-30k' | '30k+' | null
  pension_value:          'none' | '<25k' | '25-100k' | '100-300k' | '300k+' | null

  // Time-intent (O6.7)
  target_timeline:        'asap' | '3m' | '6m' | '12m' | '18m+' | 'unsure' | null
  timeline_drivers:       Array<'deadline' | 'new_relationship' | 'housing' |
                                'children' | 'financial' | 'emotional' | 'none'>
}
```

`null` means "Prefer not to say", "skipped", or "field not asked" (e.g., `property_equity` when O2 property_status=rent). Plan engine and AI coach MUST treat `null` as unknown, not zero.

---

## Plan-output usage (O7 adaptivity extension)

Spec 65 §"Adaptive plan shape" L151 states:

> "The 7 elements above compose adaptively from pre-signup-available state via 4 adaptivity dimensions (categorical hooks, not confidence-grading; not Tier-class quantitative scoring). Schema grounded in `src/app/dev/proto/pre-signup-interview/lib/types.ts`; composition logic in `lib/build-plan.ts`."

The quantitative layer adds 3 numeric-derived dimensions that compose alongside, not in place of, the categorical hooks:

**Dimension 5 — Sharing-principle weighting** (derived from `relationship_length` + ages):

- `relationship_length` in `{'10-20y', '20+y'}` → `personalisedNotes` trigger `sharing-full-weight`: emphasis on courts treating assets as joint regardless of named ownership.
- `relationship_length` in `{'<2y', '2-5y'}` → trigger `sharing-light-weight`: emphasis on contribution-based claims being more common in shorter relationships.
- Both fields `null` → no sharing-weighting note (falls through to spec 65 categorical hooks only).

**Dimension 6 — Consent-tier complexity** (derived from `total_assets` + `pension_value` + `property_equity`):

- `total_assets` in `{'500k-1M', '>1M'}` OR `pension_value = '300k+'` → trigger `consent-tier-complex`: emphasis on bespoke consent-order drafting + likely need for valuations.
- `total_assets` in `{'<10k', '10-50k'}` AND `pension_value` in `{'none', '<25k'}` → trigger `consent-tier-light`: emphasis on streamlined consent path.
- Mixed or `null` → trigger `consent-tier-standard` (fallback).

**Dimension 7 — Timeline pressure framing** (derived from `target_timeline` + `timeline_drivers`):

- `target_timeline` in `{'asap', '3m'}` AND `'deadline' ∈ timeline_drivers` → trigger `timeline-deadline-pressure`: emphasis on court-deadline pathway, MIAM acceleration where lawful.
- `target_timeline = 'asap'` AND `timeline_drivers` empty/null → trigger `timeline-unanchored-urgency`: emphasis on naming the real driver before chasing speed (compassionate reframe).
- `target_timeline` in `{'18m+', 'unsure', null}` → trigger `timeline-patient`: emphasis on disclosure thoroughness over speed.

Composition rules (cap, ordering, conflict resolution) extend spec 65 L174: *"Combined note cap: max 2 new anchor-driven notes per render; existing 4 trigger notes unaffected."* This layer adds a parallel cap — max 2 quantitative-derived notes per render — bringing total max notes per render to 8 (4 categorical + 2 anchor + 2 quantitative).

Implementation extends `lib/build-plan.ts`, the composition-logic location quoted from L151 above. Slice naming to follow — `S-PROTO-O7-quantitative-hooks` candidate.

---

## AI-coach integration

The AI coach (specs 68a §AI-coach cross-cutting + 68d §Settle-phase coach) receives a **per-field-scoped** subset of `preSignupState.quantitative` from session 1, applying a documented egress posture at the Anthropic API boundary. No additional opt-in toggle.

**Coach access scope (per-field policy):**

| Field family | Anthropic egress posture | Rationale |
|---|---|---|
| Own demographics (`your_age`, `relationship_length`) + own financials (`combined_monthly_income`, `savings_cash`, `debts_non_mortgage`, `pension_value`, `property_equity`, `total_assets`) + timeline (`target_timeline`, `timeline_drivers`) | Verbatim | Personalises coach tone and recommendations against the user's own data |
| Children's age bands (`child_age_youngest`, `child_age_oldest`) | Aggregated to a single band label (e.g. "youngest under 12") | Child-safety: avoid age-precise re-identification at the LLM boundary |
| Ex-partner-derived fields (`ex_age_relative`) | Omitted from egress payload entirely | Third-party personal data under UK GDPR — collected from user about ex without ex's consent; not sent to Anthropic. Plan-engine does not consume this field; retained in state for future trigger extension when D5 rules are amended. |

`null` values are treated as "not disclosed yet" and trigger no egress reference. Used for personalised recommendations, tone calibration, and prioritisation hints from the dashboard moment forward.

**Coach prompt convention (illustrative):**

The coach MUST disclose the pre-signup origin of any quantitative reference when speaking to the user — "Based on what you shared before signing up, your timeline of 6-12 months..." — rather than presenting bucket figures as confirmed facts. This preserves the trust-band distinction between self-reported buckets and bank-evidenced post-signup figures.

**Replacement at Moment 3.** Once bank-extracted figures replace buckets (see next section), the coach switches all references from "what you shared before" to the bank-confirmed source — "Your salary from ACME Ltd is £3,218/month...". The bucket version is no longer referenced.

---

## Bridge to spec 67 (Replace pattern)

Spec 67 §"Gap 1: Data bridge from pre-signup" L86 sets the approach:

> "Moment 1 (immediate post-signup) acknowledges what we already know. Post-signup profiling skips what's answered and goes direct to follow-ups based on pre-signup state."

The quantitative layer extends that bridge with a **Replace** semantics specifically for bucket fields, applied at Moment 3 bank-confirmation:

| Pre-signup quantitative field | Post-signup behaviour |
|---|---|
| `combined_monthly_income` bucket | At Moment 3 bank-confirm: bucket replaced by real net-pay-from-employer figures. Bucket no longer surfaced. |
| `savings_cash` bucket | At Moment 3 bank-confirm: bucket replaced by real account balances at point of connection. |
| `debts_non_mortgage` bucket | At Moment 3: replaced by bank-discovered credit-card balances + identified credit accounts. |
| `pension_value` bucket | At Moment 3 confirmation: bucket replaced if pension provider connects OR remains as self-reported anchor with explicit "you said" framing until valuation step. |
| `property_equity` bucket | At Moment 3: remains self-reported until valuation step (no bank source for equity); transitions to a confirmation-needed task in the post-bank task list. |
| `total_assets` bucket | Computed quantity, not asked again post-bank. Derived from bank-extracted facts at Moment 3. |
| `child_age_*`, `your_age`, `ex_age_relative`, `relationship_length`, `target_timeline`, `timeline_drivers` | Categorical/biographical — NOT replaced by bank data. Persist as user-confirmable facts; surfaced for edit-on-demand in profile settings. |

Spec 67 §Gap 1 bridge examples table (L90-102) is unchanged; this layer adds the bucket-replacement rows above without conflicting.

**Audit trail.** Until Moment 3, the bucket value is the source of truth for plan-output + coach. After Moment 3, the bucket value is archived (not deleted — kept for completeness audit) and the bank-extracted figure becomes the live source.

**Retention ceiling.** Archived bucket values persist for the lifetime of the user's account; deleted at account close. User-initiated erasure requests honour the UK GDPR right-to-erasure earlier than account close. No indefinite retention.

---

## What this does NOT cover

- **Free numeric input.** Reserved for post-signup bank-confirmation flows where the figure is bank-evidenced. Pre-signup remains bucket-only.
- **Individual debt or asset breakdowns.** No "list each credit card" or "list each savings account" — that's spec 67 Moment 2/3 territory.
- **CETV (pension transfer value) collection.** Pre-signup pension is rough bucket only. CETV depth (DB vs DC, valuation status) is owned by a separate post-signup gap in spec 67 — out of scope here.
- **Partner-disclosed quantitative.** This spec captures the user's own view of household figures. Partner-side disclosure is post-signup (spec 67 §Gap 12) once both parties have accounts.
- **Validation logic on bucket plausibility.** No "your assets bucket suggests X but your income bucket suggests Y — please reconcile" prompts. Trust the user's selection; reconcile at bank-connect.
- **Wireframes.** Visual treatment and exact component design TBD — Claude AI Design canvas pass to follow. Tone/copy in this spec is illustrative; structure and field set are definitive.
- **Slice mechanics.** Implementation slice to be specced separately — `S-PROTO-O7-quantitative-hooks` extends `build-plan.ts`; UI slice for the 3 new screens to be named at scoping time.
- **A/B testing of expansion uptake.** Tracking which expansion toggles get opened most often is post-launch instrumentation, not pre-signup spec scope.

---

## Status

Locked architectural decisions (session 103):

1. Length ceiling: loose — 5 min / 10-12 screens (this spec consumes 3 screens + ~2 min).
2. Framing: all fields optional with explicit per-field "Prefer not to say" and per-screen "Skip this section".
3. Placement: concentrated between O6 and O7.
4. Field scope: progressive opt-in expansion with rationale, staggered through to 11 total fields.
5. Screen partition: 3 themed screens (demographics / financials / time-intent).
6. Input granularity: buckets everywhere; free numeric reserved for post-signup bank-confirmed values.
7. Post-signup bridge: Replace pattern — bank data overwrites buckets at Moment 3.
8. AI-coach access: per-field policy from session 1 — own data verbatim, child ages aggregated to a band, ex-partner fields omitted from Anthropic egress; origin-disclosed phrasing convention applied to any reference.
9. O7 adaptivity model extended with 3 numeric-derived dimensions (sharing-principle weighting, consent-tier complexity, timeline pressure framing); max 2 quantitative-derived notes per render; total max 8 notes per render (4 categorical + 2 anchor + 2 quantitative).
10. Bucket retention: archived bucket values persist for the lifetime of the user's account and are deleted at account close; user-initiated erasure honours UK GDPR right-to-erasure earlier.
11. Ex-partner data minimisation: `ex_age_relative` captured as a relative chip (same / older / younger / unknown), not an absolute age band, to minimise third-party personal data collection under UK GDPR.
