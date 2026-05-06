# Spec 74 — AI Plan Generation

**Date:** 6 May 2026
**Status:** Drafted. Logic spec for the AI-generated O7 plan output of the pre-signup interview (spec 65). Fills the "needs spec" gap flagged in spec 70-build-map-start.md §"Engine dependencies" (rows 1-2).
**Depends on:** spec 65 §"Data captured" (input contract) · spec 65 §"O7 — Your plan" (output shape) · spec 65 §"Principles" (tone + safeguarding gates) · spec 67 §"Gap 1" (post-signup data bridge) · spec 67 §"Gap 11" (safeguarding signposting V1) · spec 42 §"Three positioning pillars" · spec 72 §9 (safeguarding baseline) · spec 73 (copy patterns) · CLAUDE.md §"Technical rules" (Anthropic SDK contract) · CLAUDE.md §"Product rules" ("warm hand on a cold day", show don't ask)
**Supersedes:** None — new spec.
**Implements via:** S-O1 § Opens · "AI plan output visual format" (per spec 70-build-map-slices.md §"S-O1 · Primary onboarding"). The S-O3 safeguarding signposting screen is a separate slice — this spec's safety_message + privacy_message are softer in-plan acknowledgements that do not replace S-O3's full-resource flow.

---

## Context

The pre-signup interview (spec 65) is 8 screens, ~3 minutes, free + public. Screens O1-O6 collect 12 answers; screen O7 renders an AI-generated personalised plan. This spec defines the logic that turns the 12 answers into the O7 plan.

It does NOT cover rendering / copy / canvas — those are downstream of this spec (see §"What this does NOT cover").

Implementation is gated on this spec being locked AND on the user-produced canvas for O1-O8 (per the design-input audit at `docs/design-input-audit.md` §K).

## Principles

1. **Facts deterministic, prose generative.** The LLM never invents numbers, dates, costs, percentages, or statistics. The app provides facts as inputs; the LLM weaves prose around them.
2. **Compassionate, professional, never patronising.** "A warm hand on a cold day" (CLAUDE.md §"Product rules").
3. **Useful regardless of Decouple.** Conventional-path information shown honestly (spec 65 §"Principles" rule 5). See §"Free-plan framing".
4. **Tone gated by stage.** The `stage` answer (`'decided'` / `'thinking'` / `'in_process'`) drives a system-prompt preamble switch (spec 65 §"Principles" rule 6).
5. **Safety overrides tone.** Safeguarding signposting fires regardless of stage when triggered.
6. **Graceful degradation.** When the LLM call fails, a deterministic-only plan still renders.
7. **One LLM call per plan.** Composed in a single round-trip; no chaining.
8. **Narrow LLM schema.** The LLM returns only the strings it composes; the app merges with deterministic facts at render time.

## Free-plan framing

The pre-signup interview is a free, public, no-account-required experience. The plan it generates IS the product at this stage — not a marketing wrapper around an upsell. Spec 65 §"Principles" rule 5 is verbatim: *"Useful regardless of Decouple — conventional path shown honestly."* This spec inherits that as a load-bearing constraint, not an aspiration.

Three pillars from spec 42 govern the framing:

- **Shared, not adversarial.** Even though only one party is in pre-signup, the plan's tone is collaborative, not combative.
- **Evidenced, not asserted.** Every numeric claim comes from the deterministic facts module; the LLM cannot fabricate.
- **End-to-end, not hand-off.** Decouple's value is named factually, not as urgency or scarcity.

What this means in practice:

- The conventional path (solicitor / mediation / DIY) is shown as a real option with honest costs, timeline, and next steps. A user who reads the plan and chooses the conventional path has been genuinely served.
- Decouple is named as one option, not the answer. The `decouple_comparison_key_difference` field frames how Decouple's approach helps THIS user — it does not promise outcomes or create urgency.
- The plan is shareable + downloadable as a standalone artefact (per spec 65 O8 "Download my plan and come back later"). It is useful detached from the product.
- "A warm hand on a cold day" (CLAUDE.md §"North star") — the prose is compassionate, professional, never patronising. The user is stressed, often alone, often late at night. The plan is not the moment for marketing.

Anti-patterns the LLM (and the deterministic templates) MUST avoid:

- *"Don't go it alone — Decouple makes this easy."*
- *"Save thousands with Decouple."*
- *"Most couples spend £14,561 — you don't have to."* (the figure is real but the framing is wrong; Decouple's value is named, not weaponised)
- Urgency tactics, scarcity language, social proof framing.
- Implying the conventional path is bad / expensive / slow as a reason to use Decouple.

The plan succeeds when a user who chooses NOT to continue still feels they got something genuinely useful for free.

## Inputs (`preSignupState` contract)

The 12 fields are defined verbatim in spec 65 §"Data captured (pre-signup state)" — this spec does not duplicate the type. It MUST stay in sync with that source; if spec 65 amends, this spec follows.

Three app-side flags derived before the LLM call:

- `safety_concerns_flag = (relationship_quality === 'safety_concerns')`
- `device_not_private_flag = (device_private === 'not_sure')`
- `complexity_flag = (self_employment !== 'neither') || (partner_awareness === 'hiding')`

The two safeguarding flags are intentionally separate. They can co-exist; they trigger qualitatively different responses (specialist DA resources vs. privacy / safe-browsing guidance) consistent with spec 67 §"Gap 1" L100-101 which already differentiates them at Moment 1 level.

These drive branching in §"Safety + privacy branching" and the deterministic facts passed to the LLM in §"Pipeline architecture".

## Pipeline architecture

One round-trip per plan, three layers:

1. **Deterministic layer.** The app computes, before any LLM call:
   - The 6 journey-step labels: filing · disclosure · negotiation · agreement · court · implementation.
   - Cost-range strings + timeline-range strings for the conventional path — sourced from a versioned facts module (illustrative path: `src/lib/ai/plan-facts.ts`).
   - Resource lists for safety + privacy signposting (per spec 67 §"Gap 11") — UK-specific URLs + helpline numbers; different lists per flag.
   - The three derived flags above.
2. **LLM layer.** The app calls the Anthropic SDK once with system + user prompt + structured-output schema (see §"Output schema"). The LLM is told the deterministic facts and asked to weave prose around the user's specific situation.
3. **Composition layer.** The app receives the LLM-composed strings, validates against schema (defensive — SDK already enforces), and merges them with deterministic facts + safeguarding signposting into the final plan structure for O7 rendering and PDF generation.

## Output schema (LLM structured output)

Anthropic SDK request uses `output_config.format: { type: 'json_schema', schema: <below> }` per CLAUDE.md §"Technical rules". All `object` types specify `additionalProperties: false`.

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": [
    "situation_summary",
    "your_positions",
    "personalised_notes",
    "decouple_comparison_key_difference",
    "safety_message",
    "privacy_message"
  ],
  "properties": {
    "situation_summary": {
      "type": "string",
      "description": "1-2 short paragraphs reflecting O1-O6 in plain language"
    },
    "your_positions": {
      "type": "array",
      "minItems": 6,
      "maxItems": 6,
      "items": { "type": "string" },
      "description": "One personalised one-sentence note per journey step, in fixed order: filing, disclosure, negotiation, agreement, court, implementation"
    },
    "personalised_notes": {
      "type": "array",
      "minItems": 1,
      "maxItems": 3,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["title", "body"],
        "properties": {
          "title": { "type": "string" },
          "body": { "type": "string" }
        }
      }
    },
    "decouple_comparison_key_difference": {
      "type": "string",
      "description": "1-2 sentences framing how Decouple's approach helps this user specifically; references but does not invent figures"
    },
    "safety_message": {
      "type": ["string", "null"],
      "description": "Non-null only when safety_concerns_flag is true; tone-aware framing for the in-plan safety signposting block"
    },
    "privacy_message": {
      "type": ["string", "null"],
      "description": "Non-null only when device_not_private_flag is true; tone-aware framing for the in-plan privacy / safe-browsing block"
    }
  }
}
```

Everything else in the rendered plan (cost ranges, timeline, journey-step labels, resource URLs) comes from the deterministic layer — never from the LLM.

## Output substance

Per-field guidance for the 6 LLM-composed strings (4 always-present + 2 nullable). Implementation prompts (governed by spec 73 at copy-rendering time) inherit this contract.

### `situation_summary`

1-2 short paragraphs reflecting O1-O6 in plain language. Acknowledges the user's specific situation without over-personalising or projecting emotions. Observation language ("you mentioned X", "you said Y"), not interpretation ("you must be feeling Z"). Does NOT frame the situation as a problem Decouple solves.

### `your_positions`

Six strings — one per journey step (filing, disclosure, negotiation, agreement, court, implementation), in fixed order. Each string is one sentence describing what THIS user's position looks like at that step, given their `preSignupState`. Tone: matter-of-fact, neither bleak nor falsely cheerful. Does not skip steps the user must navigate; does not invent steps that don't apply.

### `personalised_notes`

1-3 short notes flagging the most relevant aspects of THIS user's situation. Picks from: complexity flags (self-employment, `partner_awareness='hiding'`), worries the user named in O6, priorities from O6, property status, children specifics. NOT a recap of `situation_summary`. Each note is one paragraph; title is concrete (e.g., *"Self-employment adds disclosure complexity"*); body explains what to expect or do.

### `decouple_comparison_key_difference`

1-2 sentences. Frames how Decouple's approach helps THIS user specifically — referencing one or two aspects of their situation. Factual + honest about trade-offs. NEVER promotional. The deterministic layer supplies any numeric comparison; the LLM only frames the relevance to this user.

- Right voice: *"Because you mentioned not being sure what your partner earns, building the picture together (rather than asserting it) means the figures are evidenced — which matters at agreement stage."*
- Wrong voice: *"Decouple saves you thousands and weeks of stress."*

### `safety_message` and `privacy_message`

Both nullable. Tone-aware in-plan signposting; see §"Safety + privacy branching" for tone, framing, and resource lists. Neither replaces the dedicated S-O3 signposting screen — they soften the lead-in for users whose flags are set.

## Prompt templates

System prompt structure (governed by spec 73 copy patterns at render time; literal strings deferred to spec 73 once implementation lands):

- Role framing: assistant helping someone understand their separation.
- Tone preamble: stage-conditional (see §"Tone gating").
- Free-plan framing: see §"Free-plan framing" — anti-patterns enumerated explicitly.
- Negative constraints: see §"Negative constraints".
- Output contract: emit only JSON matching the schema.

User prompt structure (per request):

- Deterministic facts block: cost ranges, timeline ranges, the 6 journey-step labels, safety resource list (when `safety_concerns_flag` is true), privacy resource list (when `device_not_private_flag` is true).
- `preSignupState` block: the 12 fields verbatim.
- Derived-flag block: `safety_concerns_flag`, `device_not_private_flag`, `complexity_flag`.
- Composition request: produce situation summary, the 6 your_positions, 1-3 personalised_notes, decouple_comparison_key_difference, plus safety_message (when flagged) and privacy_message (when flagged) — using ONLY facts from the deterministic block.

## Tone gating

`stage` drives a system-prompt preamble switch — one prompt with three preambles, not three prompts:

- `stage='decided'` → action-oriented framing ("here's what needs to happen next").
- `stage='thinking'` → exploratory framing ("here's what's involved if you do go ahead").
- `stage='in_process'` → pace-oriented framing ("let's identify what unblocks faster").

Tone gating affects only LLM-composed strings. Deterministic facts are tone-neutral. Safety + privacy branching overrides tone (see §"Safety + privacy branching").

## Safety + privacy branching

Two flags, two messages, two resource lists. They can co-exist (a user with both safety concerns AND a non-private device sees both messages).

The honest positioning is verbatim from spec 67 §"Gap 11" L798: *"Decouple is the complete settlement workspace for separating couples — finances, children, housing, legal documents. It is NOT a domestic abuse service. For V1, we signpost honestly and preserve autonomy rather than pretending capability we don't have."*

### `safety_concerns_flag = true` → `safety_message`

LLM composes a tone-aware in-plan acknowledgement. The deterministic layer attaches the canonical UK specialist DA resource list (verbatim from spec 67 §"Gap 11" L825-830):

- Women's Aid — 0808 2000 247 (24/7)
- National Domestic Abuse Helpline — 0808 2000 247 (24/7)
- Men's Advice Line — 0808 8010 327
- Refuge — refuge.org.uk
- Surviving Economic Abuse — survivingeconomicabuse.org
- Samaritans — 116 123 (24/7)
- *"If you're in immediate danger, call 999."*

Tone: "professional, never patronising; never alarming, never minimising" (per spec 72 §9 + CLAUDE.md §"Product rules"). Honest about Decouple's scope; preserves autonomy.

### `device_not_private_flag = true` → `privacy_message`

LLM composes a tone-aware in-plan acknowledgement. The deterministic layer attaches privacy / safe-browsing guidance:

- The "Exit this page" universal-baseline component is always available (per spec 67 §"Gap 11" L801) and redirects to BBC News.
- Suggestion to use private / incognito browsing if anyone might check the device.
- Suggestion to use a friend's device or a library computer for sensitive sessions.
- Reference to the dedicated S-O3 signposting screen which the user will see if they sign up.

Tone: matter-of-fact, not alarming. Acknowledges the user's situation without projecting fear.

### Rendering order

Both messages render ABOVE the conventional-path block in O7. If both fire, `safety_message` renders first (safety is more urgent than privacy). Each block carries its own resource list.

### Relationship to S-O3

The dedicated S-O3 signposting screen (spec 70-build-map-slices.md §"S-O3 · Safeguarding signposting") is a SEPARATE surface — it appears post-signup, before Moment 1, with the full resource list and "Exit to a safe site now" affordance. Spec 74's safety_message + privacy_message are pre-signup, in-plan, softer signposting. They lead toward S-O3 (or — depending on flag + user's choice — toward immediate exit-to-safe-site) but do not duplicate its dedicated-screen content.

When both flags are false, both message fields are `null` and no signposting blocks render.

## Engineering hooks

Route: `POST /api/ai/generate-pre-signup-plan` (illustrative path; final shape per the implementation slice).

Per CLAUDE.md §"Technical rules":
- SDK call timeout: **90s**.
- Route handler `maxDuration`: **300s** (gives headroom for retry + deterministic fallback).
- Anthropic SDK request: `output_config.format` (NOT `response_format` — that is OpenAI's API).

Failure modes:

- **LLM timeout / network error / 5xx.** The route returns a deterministic-only plan: `situation_summary` substituted with a stable templated string drawn from the facts module; `your_positions` filled with stable per-step descriptions; `personalised_notes` omitted; `safety_message` and `privacy_message` rendered from stable templates if the corresponding flags are set. Failure is logged with a correlation ID; no user-visible error state.
- **Schema validation failure.** Same fallback as above; logs the offending payload (PII-redacted) for prompt-quality regression review.
- **Either safeguarding flag with LLM failure.** Signposting MUST still render. Resources are deterministic; only the framing prose is LLM-composed. Fallback uses stable safety / privacy framing templates.

Graceful degradation is non-negotiable per CLAUDE.md §"North star" — users are stressed, often alone, often late at night; a broken O7 is worse than no O7.

## Bridge to post-signup

The pre-signup plan is a complete artefact for users who don't continue. For users who do, `preSignupState` persists across the boundary into post-signup profiling per spec 67 §"Gap 1: Data bridge from pre-signup — RESOLVED".

Spec 67 §"Gap 1" L86 verbatim: *"Moment 1 (immediate post-signup) acknowledges what we already know. Post-signup profiling skips what's answered and goes direct to follow-ups based on pre-signup state."*

Implications for spec 74:

- The plan's framing should not duplicate what Moment 1 will surface. Moment 1 is for post-signup acknowledgement; this spec's plan is for pre-signup orientation + standalone usefulness.
- The 12 `preSignupState` fields are both INPUTS to spec 74 and persisted state for spec 67 §"Gap 1". Anything spec 74 derives at runtime (the three flags, the deterministic facts) is recomputable from `preSignupState` post-signup; nothing about the LLM-composed plan itself is required to persist forward.
- The S-O3 safeguarding signposting screen (separate slice; spec 67 §"Gap 11") is the canonical full-resource signposting flow. Spec 74's safety_message + privacy_message lead the user toward S-O3 without duplicating it.

This bridge does not require any change to spec 67. It is a one-way reference: spec 74 → spec 67 (post-signup is downstream).

## Negative constraints

The LLM MUST NOT:

1. Fabricate numeric facts — costs, percentages, durations, statistics. It may only repeat what the deterministic facts block contains.
2. Give legal advice or recommend specific solicitors, firms, or mediation services.
3. Diagnose partner behaviour ("your partner is controlling / narcissistic / hiding"). Use observation language ("you mentioned you're not sure what they earn") instead of labels.
4. Engage with either safeguarding flag conversationally — `safety_message` and `privacy_message` are structured signposting messages, not back-and-forths.
5. Promise outcomes ("Decouple will save you £X" / "Y weeks faster"). Frame value as a range relevant to the user's situation, not a guarantee.
6. Produce markdown, HTML, or formatting characters — the output is plain text per field; rendering is the app's responsibility (per spec 73 patterns).
7. Use upsell / urgency / scarcity / social-proof language. See §"Free-plan framing" for the enumerated anti-patterns.

## What this does NOT cover

- **Implementation.** Downstream; not buildable until this spec is locked AND the canvas at `docs/design-source/pre-signup-interview/{slug}/` is produced (per spec 65 §"What this does NOT cover"). The implementing surface is the `Opens` line "AI plan output visual format" under spec 70-build-map-slices.md §"S-O1 · Primary onboarding".
- **Copy patterns.** Spec 73 governs the literal rendered strings (system-prompt copy, fallback templates, button labels, error states). This spec is logic only.
- **S-O3 signposting screen.** The dedicated full-resource signposting flow is a separate slice; spec 74 references but does not duplicate it.
- **Billing surfaces.** Spec 56 / `docs/v2/v2-backlog.md` #72 (V1.5).
- **Respondent flow.** Mark's invited-respondent journey is a separate state machine (spec 67 §"Gap 7"; tracked as a separate logic-spec priority).
- **PDF generation.** Server-side render of the same merged plan to PDF — toolchain TBD; deferred to V1.5 per the design-input audit §A.

## Open decisions

- **Model selection.** Claude Sonnet 4.6 as the V1 default (cost / latency / quality balance for the ~3-minute pre-signup flow). Opus 4.7 trial in V1.5 against a quality regression threshold to be defined.
- **Blocking vs streaming.** V1 blocking (simpler error handling + fallback path). V1.5 streaming (deterministic skeleton renders immediately, prose streams in).
- **Plan re-generation.** V1: plan generated once per session; not re-generated if the user navigates back. V1.5: TBD whether facts-module version bumps invalidate cached plans.
- **Localisation.** V1 UK-only (resources, statutory framing, currency). Non-UK deferred to V2.
- **Quality measurement.** How plan quality is measured against the rubric (LLM-as-judge? human spot-checks? regression seeds?) — deferred to V1.5; tracked in `docs/v2/v2-backlog.md`.
- **Facts-module sourcing.** This spec defers cost ranges + timeline ranges to a versioned facts module without naming the source. The desk research (`docs/v2/v2-desk-research-*.md`) is the candidate primary source for V1 figures; pinning the source + governance for the module is a follow-on (post-spec-lock).

---

## Status

Drafted at session 70 against spec 65 LOCKED + spec 67 §"Gap 11" RESOLVED + spec 67 §"Gap 1" RESOLVED. Implementation is an Open under spec 70-build-map-slices.md §"S-O1 · Primary onboarding" (`Opens` line "AI plan output visual format"); buildable once this spec locks AND the user-produced canvas at `docs/design-source/pre-signup-interview/{slug}/` is produced (per spec 65 §"What this does NOT cover"). This spec stands alone as the logic contract — it can be reviewed and locked independent of the canvas.

Amended in flight (same PR) to add: §"Free-plan framing" (load-bearing post-pivot positioning per spec 42 + spec 65 §"Principles" rule 5); §"Output substance" (per-field LLM voice guidance); §"Bridge to post-signup" (cross-reference to spec 67 §"Gap 1"); split safeguarding flag into separate `safety_concerns_flag` + `device_not_private_flag` with two messages + two resource lists (consistent with spec 67 §"Gap 1" L100-101); canonical UK resource list updated to match spec 67 §"Gap 11" L825-830 verbatim (added NDAH, Surviving Economic Abuse); slice naming updated to S-{Category}{N} convention (spec 70-build-map-slices.md L18) by referencing S-O1 §Opens directly.
