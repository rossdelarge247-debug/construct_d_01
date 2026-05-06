# Spec 74 — AI Plan Generation

**Date:** 6 May 2026
**Status:** Drafted. Logic spec for the AI-generated O7 plan output of the pre-signup interview (spec 65). Fills the "needs spec" gap flagged in spec 70-build-map-start.md §"Engine dependencies" (rows 1-2).
**Depends on:** spec 65 §"Data captured" (input contract) · spec 65 §"O7 — Your plan" (output shape) · spec 65 §"Principles" (tone + safeguarding gates) · spec 67 §"Gap 11" (safeguarding signposting V1) · spec 72 §9 (safeguarding baseline) · spec 73 (copy patterns) · CLAUDE.md §"Technical rules" (Anthropic SDK contract) · CLAUDE.md §"Product rules" ("warm hand on a cold day", show don't ask)
**Supersedes:** None — new spec.
**Implements via:** S-O1 (pre-signup interview build slice; see spec 70-build-map-start.md §"Slice membership"). Implementation deferred to a dedicated S-O1.0a sub-slice once this spec is locked.

---

## Context

The pre-signup interview (spec 65) is 8 screens, ~3 minutes, free + public. Screens O1-O6 collect 12 answers; screen O7 renders an AI-generated personalised plan. This spec defines the logic that turns the 12 answers into the O7 plan.

It does NOT cover rendering / copy / canvas — those are downstream of this spec (see §"What this does NOT cover").

Implementation is gated on this spec being locked AND on the user-produced canvas for O1-O8 (per the design-input audit at `docs/design-input-audit.md` §K).

## Principles

1. **Facts deterministic, prose generative.** The LLM never invents numbers, dates, costs, percentages, or statistics. The app provides facts as inputs; the LLM weaves prose around them.
2. **Compassionate, professional, never patronising.** "A warm hand on a cold day" (CLAUDE.md §"Product rules").
3. **Useful regardless of Decouple.** Conventional-path information shown honestly (spec 65 §"Principles" rule 5).
4. **Tone gated by stage.** The `stage` answer (`'decided'` / `'thinking'` / `'in_process'`) drives a system-prompt preamble switch (spec 65 §"Principles" rule 6).
5. **Safety overrides tone.** Safeguarding signposting fires regardless of stage when triggered.
6. **Graceful degradation.** When the LLM call fails, a deterministic-only plan still renders.
7. **One LLM call per plan.** Composed in a single round-trip; no chaining.
8. **Narrow LLM schema.** The LLM returns only the strings it composes; the app merges with deterministic facts at render time.

## Inputs (`preSignupState` contract)

The 12 fields are defined verbatim in spec 65 §"Data captured (pre-signup state)" — this spec does not duplicate the type. It MUST stay in sync with that source; if spec 65 amends, this spec follows.

Two app-side flags derived before the LLM call:

- `safeguarding_flag = (relationship_quality === 'safety_concerns') || (device_private === 'not_sure')`
- `complexity_flag = (self_employment !== 'neither') || (partner_awareness === 'hiding')`

These drive branching in §"Safety branching" and the deterministic facts passed to the LLM in §"Pipeline architecture".

## Pipeline architecture

One round-trip per plan, three layers:

1. **Deterministic layer.** The app computes, before any LLM call:
   - The 6 journey-step labels: filing · disclosure · negotiation · agreement · court · implementation.
   - Cost-range strings + timeline-range strings for the conventional path — sourced from a versioned facts module (illustrative path: `src/lib/ai/plan-facts.ts`).
   - Resource lists for safeguarding signposting (per spec 67 Gap 11) — UK-specific URLs + helpline numbers.
   - The two derived flags above.
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
    "safeguarding_message"
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
    "safeguarding_message": {
      "type": ["string", "null"],
      "description": "Non-null only when safeguarding_flag is true; tone-aware framing for the signposting block"
    }
  }
}
```

Everything else in the rendered plan (cost ranges, timeline, journey-step labels, resource URLs) comes from the deterministic layer — never from the LLM.

## Prompt templates

System prompt structure (governed by spec 73 copy patterns at render time; literal strings deferred to spec 73 once implementation lands):

- Role framing: assistant helping someone understand their separation.
- Tone preamble: stage-conditional (see §"Tone gating").
- Negative constraints: see §"Negative constraints".
- Output contract: emit only JSON matching the schema.

User prompt structure (per request):

- Deterministic facts block: cost ranges, timeline ranges, the 6 journey-step labels, resource list (when `safeguarding_flag` is true).
- `preSignupState` block: the 12 fields verbatim.
- Derived-flag block: `safeguarding_flag`, `complexity_flag`.
- Composition request: produce situation summary, the 6 your_positions, 1-3 personalised_notes, decouple_comparison_key_difference, and (when flagged) safeguarding_message — using ONLY facts from the deterministic block.

## Tone gating

`stage` drives a system-prompt preamble switch — one prompt with three preambles, not three prompts:

- `stage='decided'` → action-oriented framing ("here's what needs to happen next").
- `stage='thinking'` → exploratory framing ("here's what's involved if you do go ahead").
- `stage='in_process'` → pace-oriented framing ("let's identify what unblocks faster").

Tone gating affects only LLM-composed strings. Deterministic facts are tone-neutral. Safety branching overrides tone (see §"Safety branching").

## Safety branching

When `safeguarding_flag = true`, the LLM populates `safeguarding_message` with a tone-aware signposting framing. The deterministic layer attaches the resource list (helpline numbers + URLs) at composition time.

Resources are UK-specific per spec 67 Gap 11 (V1 signposting; detection deferred to V1.5):

- GOV.UK domestic abuse pages
- Refuge — 0808 2000 247
- Women's Aid live chat
- Men's Advice Line — 0808 8010 327
- Samaritans — 116 123 (for emotional-toll-led signposting)

Safety framing is universal across `stage` values: "professional, never patronising; never alarming, never minimising" (per spec 72 §9 + CLAUDE.md §"Product rules"). The signposting block renders ABOVE the conventional-path block in O7 — the user sees safety information first.

When `safeguarding_flag = false`, `safeguarding_message` is `null` and no signposting block renders.

## Engineering hooks

Route: `POST /api/ai/generate-pre-signup-plan` (illustrative path; final shape per the implementation slice).

Per CLAUDE.md §"Technical rules":
- SDK call timeout: **90s**.
- Route handler `maxDuration`: **300s** (gives headroom for retry + deterministic fallback).
- Anthropic SDK request: `output_config.format` (NOT `response_format` — that is OpenAI's API).

Failure modes:

- **LLM timeout / network error / 5xx.** The route returns a deterministic-only plan: `situation_summary` substituted with a stable templated string drawn from the facts module; `your_positions` filled with stable per-step descriptions; `personalised_notes` omitted; `safeguarding_message` rendered from a stable template if the flag is set. Failure is logged with a correlation ID; no user-visible error state.
- **Schema validation failure.** Same fallback as above; logs the offending payload (PII-redacted) for prompt-quality regression review.
- **`safeguarding_flag = true` with LLM failure.** Signposting MUST still render. Resources are deterministic; only the framing prose is LLM-composed. Fallback uses a stable safeguarding-framing template.

Graceful degradation is non-negotiable per CLAUDE.md §"North star" — users are stressed, often alone, often late at night; a broken O7 is worse than no O7.

## Negative constraints

The LLM MUST NOT:

1. Fabricate numeric facts — costs, percentages, durations, statistics. It may only repeat what the deterministic facts block contains.
2. Give legal advice or recommend specific solicitors, firms, or mediation services.
3. Diagnose partner behaviour ("your partner is controlling / narcissistic / hiding"). Use observation language ("you mentioned you're not sure what they earn") instead of labels.
4. Engage with the safeguarding flag conversationally — it is a structured signposting message, not a back-and-forth.
5. Promise outcomes ("Decouple will save you £X" / "Y weeks faster"). Frame value as a range relevant to the user's situation, not a guarantee.
6. Produce markdown, HTML, or formatting characters — the output is plain text per field; rendering is the app's responsibility (per spec 73 patterns).

## What this does NOT cover

- **Implementation.** Downstream; not buildable until this spec is locked AND the canvas at `docs/design-source/pre-signup-interview/{slug}/` is produced (per spec 65 §"What this does NOT cover").
- **Copy patterns.** Spec 73 governs the literal rendered strings (system-prompt copy, fallback templates, button labels, error states). This spec is logic only.
- **Billing surfaces.** Spec 56 / `docs/v2/v2-backlog.md` #72 (V1.5).
- **Respondent flow.** Mark's invited-respondent journey is a separate state machine (spec 67 Gap 7; tracked as a separate logic-spec priority).
- **Post-signup continuity.** How `preSignupState` bridges into post-signup profiling is spec 67's domain.
- **PDF generation.** Server-side render of the same merged plan to PDF — toolchain TBD; deferred to V1.5 per the design-input audit §A.

## Open decisions

- **Model selection.** Claude Sonnet 4.6 as the V1 default (cost / latency / quality balance for the ~3-minute pre-signup flow). Opus 4.7 trial in V1.5 against a quality regression threshold to be defined.
- **Blocking vs streaming.** V1 blocking (simpler error handling + fallback path). V1.5 streaming (deterministic skeleton renders immediately, prose streams in).
- **Plan re-generation.** V1: plan generated once per session; not re-generated if the user navigates back. V1.5: TBD whether facts-module version bumps invalidate cached plans.
- **Localisation.** V1 UK-only (resources, statutory framing, currency). Non-UK deferred to V2.
- **Quality measurement.** How plan quality is measured against the rubric (LLM-as-judge? human spot-checks? regression seeds?) — deferred to V1.5; tracked in `docs/v2/v2-backlog.md`.

---

## Status

Drafted at session 70 against spec 65 LOCKED + spec 67 Gap 11 RESOLVED. Implementation slice S-O1.0a will execute against this spec; the slice is gated on this spec being locked AND on the user-produced canvas at `docs/design-source/pre-signup-interview/{slug}/` for O1-O8 visual treatment (per spec 65 §"What this does NOT cover" L190 + session-69 design-input audit §K). This spec stands alone as the logic contract — it can be reviewed and locked independent of the canvas.
