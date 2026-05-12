# S-PROTO-pre-signup-density-delight-audit

**Category:** prototype

Phase 1 scope-only audit slice. Catalogues density + delight deltas across the 8 canvas-as-source pre-signup-interview screens (O1-O8) currently shipped on main, measured against the V1 baseline (`docs/v1/v1-wireframes.md`) + the spec 26 micro-interaction canon (`docs/workspace-spec/26-transitions-animations.md`) + CLAUDE.md §"Product positioning" + §"North star". Output is a punch list of "feels basic" candidates. **No implementation.** Phase 2 (user joint review) re-prioritises this list; Phase 3 ships fixes in dedicated batch slices.

**Density** = signal-per-screen relative to V1's 28-screen interview. V1 ran ~5-10 min across 28 screens (~12-22 s per screen); reconciled spec 65 is ~3 min across 8 screens (~22 s per screen), so reconciled screens hold roughly comparable per-screen dwell time but must do ~3× more work per screen to deliver V1's total signal — or accept the trade-off explicitly.

**Delight** = micro-interactions / transitions per spec 26 — present in the shipped impl or specified-but-absent.

Other audit lenses are out of scope for this slice and may be covered separately: gentle-interview tone, adaptive output/decision flow as branching-structure question, spec 65 literal coverage.

Per CLAUDE.md §"Canvas-as-source (prototype default)": canvas-as-source slices don't carry `Linked canvas:`. This audit cites the shipped source code at `src/app/dev/proto/pre-signup-interview/` + V1 wireframes + spec 26 + spec 65.

## What this audit covers vs doesn't

**Covered (Claude-solo, source-level):**
- Entry-screen density gaps (O1): time-commitment cue, outcome scaffolding, reassurance copy
- Question-screen density gaps (O1-O6): "Why we ask" educational explainers per question
- Plan-output density gaps (O7): adaptive output framework, confidence indicators, reassurance footer
- Inter-screen + intra-screen micro-interaction gaps per spec 26 §1 + §5

**NOT covered:**
- Gentle-interview tone — different lens, candidate for a separate audit slice
- Adaptive output as branching-structure question — F-OUT-01 below catches the most visible symptom (O7 personalisation absent) but does not fully audit V1's Tier 1/2/3/4 framework; deeper adaptivity audit is a separate lens
- Spec 65 literal coverage (each O-screen vs spec 65 literal copy + question pattern + data captured) — structural lens, candidate for separate audit
- Per-screen module-CSS animation specifics beyond inter-screen + CTA — `.module.css` drift is its own audit; Batch F production-graduation backlog covers part of it
- O7 mid-screen content rendering on preview — visual rendering checks require user walk (out of Claude-solo scope)
- Implementation of any finding — Phase 3+

## Findings register

### Density gaps (DEN)

**F-DEN-01 — "Why we ask" callouts absent across O1-O6.**
- V1's interview-step pattern (`docs/v1/v1-wireframes.md` L196-203) includes a dashed-border educational callout under each question explaining WHY the question is being asked. Example for the situation question: *"Why we ask: This helps us show you the right process. Divorce and dissolution have specific legal steps."*
- Reconciled spec 65 (April 2026) did not carry the pattern forward; impl matches the thinner spec.
- Negative grep: `grep -niE "why we ask|why-we-ask|why ask" src/app/dev/proto/pre-signup-interview/screens/*.tsx` returns no matches.
- Effect: every question screen is a bare prompt + options + Continue with no learning-moment context. CLAUDE.md §"North star" frames the analyst-by-your-side experience; bare prompts read more like a form than an analyst conversation.

**F-DEN-02 — No outcome scaffolding on entry (O1).**
- V1 Welcome screen (`docs/v1/v1-wireframes.md` L158-168) opens with 3 concrete outcome bullets: *"In the next 20-30 minutes, you'll: ✓ See the likely process for your specific situation · ✓ Shape a starting plan for children, housing, and finances · ✓ Know exactly what to focus on next."*
- Spec 65 collapses Welcome into O1 ("Tell us where you're at" stage question); the outcome scaffolding is dropped.
- Negative grep: `grep -niE "you'll|in the next|next [0-9]" src/app/dev/proto/pre-signup-interview/screens/*.tsx` returns no matches.
- Effect: pre-signup user lands on a stage question with no preview of what they'll get out of the next 3 minutes. The "complete picture" tagline (CLAUDE.md §"Product positioning") loses its concrete promise at the entry moment.

**F-DEN-03 — No time-commitment cue surfaced to user.**
- Spec 65 internally states the principle "~3 minutes, 8 screens max" (L21).
- V1 Welcome (`docs/v1/v1-wireframes.md` L160) surfaced this as *"In the next 20-30 minutes..."*.
- Reconciled impl never tells the user how long this takes.
- Negative grep: `grep -niE "minute|3 min|takes about|approximately" src/app/dev/proto/pre-signup-interview/screens/*.tsx` returns no matches.
- Effect: temporal-grounding gap; user invests time without knowing how much is needed. Particularly costly given CLAUDE.md §"North star" calls out the user is "stressed, often alone, often late at night" — time-commitment uncertainty compounds anxiety.

**F-DEN-04 — No reassurance copy on entry.**
- V1 Welcome (`docs/v1/v1-wireframes.md` L170-171) closes with *"You don't need to know everything. You just need to start."* — directly addresses pre-signup-user anxiety per CLAUDE.md §"North star" (analyst-by-your-side framing).
- Spec 65 + impl drop this.
- Negative grep: `grep -niE "don't need|just start|just need" src/app/dev/proto/pre-signup-interview/screens/*.tsx` returns no matches.
- Effect: warm-hand-on-a-cold-day positioning (CLAUDE.md §"Product rules") loses its concrete copy expression at the first user-touchpoint.

### Delight gaps (DEL)

**F-DEL-01 — Inter-screen transition cross-fade absent.**
- Spec 26 §5 (`docs/workspace-spec/26-transitions-animations.md` L87-93) specifies a 5-step section-transition choreography for navigating between question screens:
  1. Current question content fades out: `opacity 1→0, 200ms ease-out`
  2. Section label cross-fade: `200ms`
  3. Progress stepper advances: `300ms ease`
  4. New question content fades in: `opacity 0→1, 200ms ease-in`
  5. If mini-summary was showing, it slides up into accordion: `max-height → 0, 300ms ease-out, opacity 1→0`
- Current impl uses Next.js page-level navigation between O1-O8; no inter-screen animation choreography wires up.
- Module.css surface: 76 transition/animation-related lines across the 8 per-screen module.css files. These are the Hero `.entry` stagger animation (Batch B) + Footer `.ctaEnabled` bounce (Batch C) + per-screen radio/option hover/selection states. None implements the spec 26 §5 inter-screen sequence.
- Effect: navigation feels mechanical rather than choreographed. Spec 26 calls these out as canonical, but the canvas-as-source build never wired them up because the canvases ship as single-screen exports.

**F-DEL-02 — [Next] button press feedback absent.**
- Spec 26 §5 (L104-106) specifies primary-CTA click feedback: *"Brief press feedback: `scale 0.98, 100ms` then release. Content begins fading immediately — no artificial delay."*
- Footer primitive (`src/app/dev/proto/pre-signup-interview/components/Footer.tsx` + `Footer.module.css`) implements the enable-transition bounce (force-reflow on `enabled: false → true`) but no press-feedback on `onClick` activation.
- Footer.module.css has the `footer-cta-bounce` keyframe but no `:active { transform: scale(0.98) }` rule on the primary CTA.
- Effect: CTA-click feedback gap; click feels like a regular button press rather than a deliberate moment.

**F-DEL-03 — Radio option selection transition: needs eyeball verification.**
- Spec 26 §5 (L99-102) specifies: *"Selected option: background transitions to highlight colour `150ms ease`. Previously selected option: background returns to default `150ms ease`. No delay before [Next] becomes active."*
- Per-screen module.css contains transition rules across the 8 screens — needs targeted inspection at preview deploy to confirm the 150ms spec is hit for option-selection on O1, O2 (4 sub-questions × radio groups), O3, O4, O5, O6 (multi-select chips), O8.
- Effect: unknown until verified. Could be conforming. Could be off-spec (e.g., snappier `100ms`, or instant snap without transition). Flagged for joint-review eyeball walk.

### Plan output gaps (OUT)

**F-OUT-01 — Adaptive output framework not implemented.**
- V1 §"Adaptive output decision flow" (`docs/v1/v1-wireframes.md` L40-56) specifies a Tier 1/2/3/4 plan output framework based on `chapters_completed × confidence_distribution`:
  - Tier 1: Full plan (most chapters + mostly Known/Estimated confidence)
  - Tier 2: Partial plan (some chapters, or mixed confidence)
  - Tier 3: Thin plan (few chapters with some substance)
  - Tier 4: Not ready (situation-only)
- Spec 65 O7 (L138-148) describes the plan output as *"Contains: Situation summary (reflecting O1-O6) · The divorce journey (visual timeline) · What needs to happen · The conventional path · How Decouple helps · Personalised notes (based on their specific situation)"* — promises personalisation but does not specify the Tier framework.
- Current O7.tsx (641 lines) renders 6 fixed sections. Only one element adapts to user input: `<DivorceJourney currentStageKey={answers.stage}/>` at O7.tsx:593 highlights the current divorce-journey stage from O1's `stage` answer.
- Negative grep: `grep -niE "relationship_quality|safety_concerns|amicable|difficult|high_conflict|hiding|adaptive|tier" src/app/dev/proto/pre-signup-interview/screens/O7.tsx` returns only generic `JourneyStage`-type matches; no branching by relationship-quality, partner-awareness, priorities, or worries.
- Effect: spec 65's "personalised notes" promise is structurally undelivered. V1's adaptive framework lost in reconciliation. Plan output feels static-prose-with-stage-highlight rather than tailored output.

**F-OUT-02 — Confidence indicators absent.**
- V1 plan output (`docs/v1/v1-wireframes.md` L267-294) shows per-domain confidence indicators alongside each plan card (`CHILDREN — Confidence: ● Strong` · `HOUSING — Confidence: ◐ Mixed` · `FINANCES — Confidence: ○ Gaps`) and closes with a `CONFIDENCE MAP` summary card (Known: 4 · Estimated: 2 · Unsure: 2 · Unknown: 2 + visual progress bar).
- Reconciled spec 65 O7 does not specify confidence-grading; impl matches.
- Effect: V1's confidence-mapping visual language — which honestly communicates uncertainty per CLAUDE.md §"Product positioning" pillar 2 (*"Evidenced, not asserted"*) — is structurally absent from the pre-signup plan output. The "complete picture" claim relies on honestly graded confidence, not just narrative coverage.

**F-OUT-03 — Reassurance footer copy absent on O7.**
- V1 plan output (`docs/v1/v1-wireframes.md` L298) closes with *"You've built a strong starting position."* just before the Continue CTA — affirms the user's effort at the end-of-journey moment.
- Spec 65 O7 description silent on this.
- Current O7 Footer (post-Batch-C-rebuild) shows Download-PDF + Email-link (secondary actions) + What's-next (primary); no reassurance text.
- Effect: warm-hand-on-a-cold-day positioning loses its concrete expression at the journey-completion moment, sibling to F-DEN-04's gap at the entry moment.

## Workflow

**Phase 1 — this slice.** Claude-solo source-level audit. No implementation. Output: this `acceptance.md`.

**Phase 2 — next session.** User joint review of findings. Pruning / re-scoping / prioritisation. Decision per finding: address, defer, drop. Findings the user disagrees with get removed or re-framed in this `acceptance.md` before Phase 3.

**Phase 3 — subsequent sessions.** Batch implementation slices. Likely shape (TBD at impl-scoping time):
- Batch (density-entry): F-DEN-02 + F-DEN-03 + F-DEN-04 likely share one shared `<EntryScaffold/>` primitive on O1.
- Batch (density-question): F-DEN-01 likely shares one shared `<WhyWeAsk/>` primitive across O1-O6 with per-screen copy.
- Batch (delight): F-DEL-01 + F-DEL-02 + F-DEL-03 likely ship together as a spec-26-compliance pass on Footer + screen-transition layers.
- Batch (output): F-OUT-01 + F-OUT-02 + F-OUT-03 likely ship together as an O7 adaptivity + confidence + reassurance pass.

Each Phase 3 batch will:
- Pick a subset of findings to address
- Specify design treatment per finding (canvas reference where applicable; new primitives + their AC contracts)
- Confirm with the user before impl
- Ship under canvas-as-source if visual treatment exists; preserve-and-rebuild if Phase C+ production graduation has happened

## Out of scope

- Implementation of any finding (Phase 3+)
- Tone audit (separate lens, separate audit candidate)
- Adaptivity audit beyond F-OUT-01's symptom-level finding (separate lens, separate audit candidate)
- Spec 65 literal coverage audit (separate lens, separate audit candidate)
- Per-screen module-CSS drift beyond inter-screen + CTA transition (separate audit; Batch F production-graduation backlog covers part of it)
- O7 mid-screen content rendering on preview — visual rendering checks require user walk

## References

- CLAUDE.md §"Product positioning" + §"North star" + §"Product rules" (always-loaded)
- `docs/workspace-spec/26-transitions-animations.md` §1 (welcome carousel) + §5 (confirmation flow)
- `docs/workspace-spec/65-pre-signup-interview-reconciled.md` (the 8-screen reconciled design)
- `docs/v1/v1-wireframes.md` (V1 baseline — Welcome screen L150-181 · Interview step L183-213 · Adaptive output decision flow L40-56 · Your Plan full tier L255-305)
- `src/app/dev/proto/pre-signup-interview/screens/O1.tsx`-`O8.tsx` (current implementation surface)
- `src/app/dev/proto/pre-signup-interview/components/Footer.tsx` (Batch C primitive)
