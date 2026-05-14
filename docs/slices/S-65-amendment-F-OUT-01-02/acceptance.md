# S-65-amendment-F-OUT-01-02 — Spec 65 §O7 amendment scaffold for adaptive-output conflict resolution

**Category:** prototype

## Purpose

Resolve the cross-spec design conflict surfaced by `S-PROTO-pre-signup-density-delight-audit` §F-OUT-01 + §F-OUT-02 by amending spec 65 §O7 with explicit prose on whether pre-signup plan output adopts an adaptive tier framework + per-domain confidence indicators, and — if it does — what derivation source feeds them. The amendment must preserve spec 67 §Gap 1's locked routing-not-grading post-signup architecture (cannot be re-opened from a pre-signup amendment).

This slice scaffolds the amendment work; resolution iterates across multiple sessions through user-led design conversation. At scaffold ship, this acceptance.md frames the three design questions as ACs; AC resolution lands in subsequent slice updates.

## Context

**The dropped framework.** V1's plan-output adaptive framework is specified at `docs/v1/v1-wireframes.md` §"Adaptive output decision flow" (L40-56), a mermaid flow chart routing on two decision nodes — `Chapters completed?` and `Confidence distribution?` — to four output Tiers (literal labels at L50, L47, L53, L49 respectively): *"Tier 1: Full plan"* · *"Tier 2: Partial plan"* · *"Tier 3: Thin plan"* · *"Tier 4: Not ready"*. Per-domain confidence indicators follow at L267-294, with three category levels (Strong / Mixed / Gaps) rendered alongside each plan card and closing on a `CONFIDENCE MAP` summary card showing Known / Estimated / Unsure / Unknown counts with a progress-bar visual. This framework is NOT the same as spec 34 §Tier 1-3 transaction-matching model (L188-250) — that's a post-bank-connection matching machinery for resolved-vs-ambiguous transactions, not plan output, and is unrelated to the F-OUT findings.

**What spec 65 locks instead.** Spec 65 §O7 (L138-148, verbatim) lists 7 plan-output content elements:

> *"Contains:*
> *- Situation summary (reflecting O1-O6)*
> *- The divorce journey (visual timeline — filing, disclosure, negotiation, agreement, court, implementation)*
> *- What needs to happen (plain language steps)*
> *- The conventional path (costs + timeline + next steps — helpful standalone)*
> *- How Decouple helps (soft introduction, time/cost comparison)*
> *- Personalised notes (based on their specific situation)*
> *- Links: find out more → pricing"*

No Tier framework. No per-domain confidence column. No CONFIDENCE MAP card. *"Personalised notes (based on their specific situation)"* (L146, verbatim) is the only adaptivity hook spec 65 provides for O7.

**What spec 67 locks downstream.** Spec 67 §Gap 1 (L84-86, verbatim, RESOLVED) commits to a routing-not-grading architecture:

> *"Gap 1: Data bridge from pre-signup — RESOLVED*
>
> *Approach: Moment 1 (immediate post-signup) acknowledges what we already know. Post-signup profiling skips what's answered and goes direct to follow-ups based on pre-signup state."*

The post-signup architecture routes via state — `property_status = mortgage` → P1 asks who the mortgage is with; `has_children = true, count = N` → children section loops N times — and does not assign per-domain confidence scores. Spec 67 §Distribution map (L14-83, verbatim) places confidence-style consideration only at Moment 3 (section-by-section confirmation post-bank) via spec 34's transaction-matching tiers, which act on resolved transactions rather than pre-signup self-report.

**What spec 74 sets as the value bar.** Spec 74 §"Free-plan framing" (L30-55, verbatim) sets the standalone-artefact bar the amendment must clear:

> *"The pre-signup interview is a free, public, no-account-required experience. The plan it generates IS the product at this stage — not a marketing wrapper around an upsell."* (L32)
>
> *"A user who reads the plan and chooses the conventional path has been genuinely served."* (L42)
>
> *"The plan succeeds when a user who chooses NOT to continue still feels they got something genuinely useful for free."* (L55)

Spec 74 also explicitly REJECTS conversion-mechanic framings (L47-53 anti-patterns: *"Don't go it alone — Decouple makes this easy"* / urgency / scarcity / social-proof — all banned). The amendment cannot argue structural depth is for conversion; the argument must be value-delivery to a user who may never sign up. This bar is load-bearing for AC-2's resolution: current spec 65 §O7's 7 generic elements + single *"Personalised notes (based on their specific situation)"* (L146) adaptivity hook may not clear the L55 *"genuinely useful for free"* threshold.

**The current state.** O7.tsx (641 lines) renders 6 fixed sections with one adaptive element: `<DivorceJourney currentStageKey={answers.stage}/>` at O7.tsx:593 highlights the current divorce-journey stage from O1's `stage` answer. Negative grep on O7.tsx for `relationship_quality|safety_concerns|amicable|difficult|high_conflict|hiding|adaptive|tier` returns only generic `JourneyStage` matches — no branching by relationship-quality, partner-awareness, priorities, or worries. The audit slice §F-OUT-01 + §F-OUT-02 §Effect paragraphs (session-97-amended) capture this state and explicitly mark both findings as **blocked pending spec amendment**.

**Three design questions block resolution.** Each requires user-led design conversation; this slice frames them as ACs and ships resolution one at a time across sessions.

## In scope

- Cross-spec conflict statement landed in this acceptance.md (AC-1).
- Three design questions framed as ACs (AC-2, AC-3, AC-4) with option spaces enumerated, awaiting user resolution.
- Amendment landing target identified (AC-5) — which spec section(s), what edit type.
- Downstream slice plan (AC-6) — what implements F-OUT-01/02 once amendment lands.
- Audit slice §Status update plan (AC-7) — how `S-PROTO-pre-signup-density-delight-audit` §F-OUT-01 + §F-OUT-02 rows flip once amendment lands.
- Cross-spec citation verifiability (AC-8) — every quoted phrase resolves verbatim against current `main` at the cited file:line.

## Out of scope

- The amendment text itself — drafting waits until AC-2/3/4 are user-resolved.
- Implementation of F-OUT-01 + F-OUT-02 — future slice per AC-6's downstream plan.
- Spec 67 amendment — the post-signup architecture is RESOLVED per §Gap 1 L84; this slice must NOT re-open it. AC-4 explicitly polices the boundary.
- Spec 34 amendment — the transaction-matching Tier 1-3 framework at L188-250 is unrelated post-bank machinery; explicitly out of scope per the Context note.
- Re-evaluation of any other F-OUT or F-DEN/F-DEL finding — those are independently shipped or out-of-scope per audit slice §15.
- The audit slice's L25 scoping note + §F-OUT-01/02 §Effect paragraphs — these are session-97-amended baseline; not re-edited until amendment lands.

## Acceptance criteria

### AC-1: Cross-spec conflict statement landed

The §Context section above (this file) embeds verbatim quotes from:

1. Spec 65 §O7 L138-148 — the 7-element list lacking Tier framework + confidence column.
2. Spec 67 §Gap 1 L84-86 — the RESOLVED routing-not-grading commitment.
3. V1 wireframes L40-56 + L267-294 — the plan-output Tier framework + per-domain confidence indicators dropped in spec 65 reconciliation (architectural-fit reasons evident in V1's `chapters_completed × confidence_distribution` input requirements which pre-signup does not collect; no recorded decision-log entry — the "deliberate" framing is inferred from spec architecture, not from explicit deliberation).
4. O7.tsx structural state — fixed 6 sections + single adaptive element (`DivorceJourney currentStageKey={answers.stage}` at O7.tsx:593) + negative-grep on adaptivity vocab.
5. Distinction from spec 34 §Tier 1-3 transaction-matching (L188-250) — unrelated post-bank machinery, explicitly not the F-OUT subject.
6. Spec 74 §"Free-plan framing" L30-55 — the standalone-artefact value bar the amendment must clear; explicitly rejects conversion-mechanic framings at L47-53.

**Evidence:** §Context paragraphs above; each quote cites file:line.

### AC-2: Design question 1 framed — does pre-signup O7 need an adaptive tier framework at all?

Three resolution branches enumerated:

- **(a) No.** *"Personalised notes (based on their specific situation)"* (spec 65 §O7 L146, verbatim) is the adaptivity floor; any further per-domain grading conflicts with spec 67 §Gap 1's routing-not-grading post-signup commitment when O7 sits structurally just *before* the architecture spec 67 governs. Amendment: clarifying paragraph appended to spec 65 §O7 explaining the deliberate omission + linking to spec 67 §Gap 1 for the routing-not-grading downstream. F-OUT-01/02 close as out-of-scope-by-design; audit slice §Status rows flip from `blocked` to `closed-by-design` with link to amended spec 65 §O7. **Likely fails spec 74 L55 standalone-artefact bar — 7 generic elements + single *"Personalised notes"* hook may not clear *"genuinely useful for free"* threshold.**
- **(b) Yes — full Tier framework.** Adopt V1's Tier 1-4 plan-output framework (with or without V1's exact thresholds), augmented with per-domain confidence indicators + CONFIDENCE MAP summary card. Amendment: spec 65 §O7 gains new sub-section *"Adaptive output shape"* describing Tier framework + confidence-derivation source. F-OUT-01/02 unblock; new impl slice ships per AC-as-canvas-quote discipline. **Architecturally wrong: V1's Tier 1-4 mechanism requires `chapters_completed × confidence_distribution` inputs (V1 wireframes L40-56) — financial-domain depth that pre-signup, by design, does not collect (spec 65a L57 verbatim: *"defers depth to AFTER bank connection ... Spec 65 keeps only what's needed pre-bank"*). The mechanism's data shape does not exist pre-bank.**
- **(c) Pre-signup-specific adaptivity dimension.** Introduce adaptivity grounded in inputs that exist pre-signup (12 O1-O6 typed answers + derived signals: stage, complexity, safety, partner-awareness, vocab calibration, example anchoring, lead-ordering) rather than V1's `chapters_completed × confidence_distribution` mechanism. Amendment: spec 65 §O7 gains new sub-section *"Adaptive plan shape"* naming 2-4 adaptivity dimensions (specifics resolved in AC-3) + per-dimension mapping from pre-signup state to plan-output variation. F-OUT-01 closes via the new sub-section; F-OUT-02 closes-by-design (per-domain confidence grading is the wrong mechanism for pre-signup state shape — V1's CONFIDENCE MAP needed bank data the pre-signup surface does not have). **Aligns with spec 74 L55 standalone-artefact bar; respects spec 67 §Gap 1 post-signup scope; sits alongside V1.5 progressive-disclosure pattern per spec 67 L788.**

**Resolution:** RESOLVED → (c). Reasoning: V1's Tier 1-4 framework requires `chapters_completed × confidence_distribution` inputs (V1 wireframes L40-56) — financial-domain depth pre-signup does not collect (spec 65a L57, verbatim: *"defers depth to AFTER bank connection (Moment 3 per-section confirmation, where bank signals do most of the work — 'show, don't ask' per CLAUDE.md §'Product rules'). Spec 65 keeps only what's needed pre-bank to drive the AI plan + tone gating + safety branching."*). Spec 74 §"Free-plan framing" (L30-55, verbatim) sets a standalone-artefact value bar current spec 65 §O7's *"Personalised notes (based on their specific situation)"* (L146) alone may not clear: spec 74 L55 — *"The plan succeeds when a user who chooses NOT to continue still feels they got something genuinely useful for free."* (a) likely fails L55 bar; (b) mechanically wrong for pre-signup data shape; (c) introduces a different adaptivity dimension grounded in pre-signup-available signal. AC-3 names which dimensions specifically.

### AC-3: Design question 2 framed — what adaptivity dimensions does the new O7 actually need?

Per AC-2 → (c) RESOLVED, the next active question is which dimensions of pre-signup-available state drive plan-output adaptivity, and how each dimension maps to plan-output variation. Schema grounded against `src/app/dev/proto/pre-signup-interview/lib/types.ts`.

**Sub-questions Q1 + Q3 + Q4 RESOLVED; Q2 OPEN.**

**Q1 (v1 shortlist) RESOLVED — 4 dimensions ship in v1:**

1. **Stage** (top-level `stage`: 'thinking' | 'decided' | 'in_process') — already wired at O7.tsx:593 (DivorceJourney). Extend to opening summary + "what needs to happen" section tense + pacing:
   - `thinking` → exploratory tone (*"If you're still considering whether to separate, here's what to think about..."*)
   - `decided` → action-oriented tone (*"Now that you've decided, here's what comes next..."*)
   - `in_process` → progress-oriented tone (*"You're in the middle of this. Here's what's coming and where to focus..."*)
   **Low effort — extension of existing wire.**

2. **Partner finances awareness** (O5 `partnerFinances.awareness` enum: 'full' | 'some' | 'little' | 'suspect') — semantic: the USER's awareness of PARTNER's finances (NOT partner's awareness of user — different from V1's `partner_awareness` semantics). Gates plan-output around joint-action confidence. If `full` or `some`, plan includes joint-prep steps + transparency language. If `little` or `suspect`, plan emphasises solo prep + privacy + steps to surface partner-side finances safely. The `suspect` case hooks into safety-conscious framing without re-opening spec 67 L788's V1.5 adaptive safeguarding architecture. **Simple categorical switch.**

3. **Example anchoring** — plan body uses descriptive O1-O6 signals as anchors. NOT names — children's names + partner names are not collected (spec 65a L61-67 absorbed-with-simplification decisions are not re-opened by this slice; Q4 below). Available anchors:
   - Relationship + living state (O2 `situation.relationship` + `living`): *"As a cohabiting couple living apart..."*
   - Children count (O2 `situation.childrenCount` 1-4): *"...with 2 children..."*
   - Home situation (O2 `situation.home`: mortgage / own-outright / rent / other): *"...in your mortgaged home"*
   - Relationship quality (O3 `exAndSafety.relationshipQuality`: amicable / difficult / high-conflict / safety-concern): *"Given the [amicable/difficult] state of your relationship..."*
   - Self-employment (O4 `employment.selfEmployment`: no / me / ex / both): *"As a self-employed person, your finances..."*
   - Top priorities (O6 `whatMatters.priorities` array of `Priority`): *"Since fair-split and children-stability matter most to you..."*
   - Worries (O6 `whatMatters.worries` array of `Worry`): *"Your concern about hidden-assets means..."*
   **Highest user-perceived value per CLAUDE.md §"North star" quality bar** — plan feels deeply personal without requiring names.

4. **Lead-ordering** — first plan section after situation-summary adapts to selected priorities + worries + situational signals (NOT `priorities[0]` — `priorities` is unordered multi-select per types.ts L24). Coverage-based heuristic stub:
   - If `priorities` includes `children-stability` OR `situation.hasChildren = "yes"` → children's stability section leads
   - Else if `priorities` includes `keep-home` OR `situation.home != "rent"` → housing decisions section leads
   - Else if `priorities` includes `protect-pension` OR `worries` includes `losing-pension` → pensions section leads
   - Else → default situation-summary lead
   **Simple wire; coverage-based, not ranking-based.**

**Q3 (V1.5 deferrals) RESOLVED — 3 dimensions deferred:**

- **Complexity** (multi-factor heuristic across O2 + O3 + O4 + O5) — needs more design work; defer per spec 67 L788 progressive-disclosure pattern.
- **Vocab calibration** (formal/casual tone derivation from O1-O6 overall signals) — high effort, low per-unit-effort value; defer.
- **Safety / conflict signals beyond the `suspect` hook in dimension 2** — overlaps with spec 67 L788's existing *"Full adaptive safeguarding architecture (coercive control detection, mediator routing, decoy mode, adaptive pacing) deferred to V1.5 backlog"* reservation. Cleaner to bundle there. (Note: `partnerFinances.awareness = "suspect"` + `exAndSafety.relationshipQuality = "safety-concern"` + `exAndSafety.devicePrivate = "not-sure"` are minimum hooks shipped via dimension 2 + the existing `hasSafetyFlag` helper at types.ts L49 — without full safeguarding architecture.)

**Q4 (new pre-signup data collection) RESOLVED — NO new collection.** Every shortlisted dimension uses signal already in O1-O6 per types.ts. Reversing spec 65a L61-67 absorbed-with-simplification decisions is OUT-OF-SCOPE for this slice (would re-open the post-pivot collapse from V1's 28 screens → spec 65's 8 screens).

**Q2 (per-dimension mapping) PARTIALLY RESOLVED — Stage + Partner-finances locked; Example anchoring + Lead-ordering OPEN.**

**Stage mapping (locked):**
- `PlanContent.situationSummary` opening — EXISTS at build-plan.ts L29-31 (3-branch composition matching shortlisted `Stage` enum); retain verbatim.
- `PlanContent.whatNeedsToHappen` intro/framing — NEW. Per-stage intro phrase prepended to items array (or rendered as conditional section header):
  - `thinking` → conditional framing ("If you go ahead, here's what would need to happen")
  - `decided` → immediate framing ("Here's what needs to happen now")
  - `in_process` → progress framing ("Here's where you are and what's still ahead")
- `PlanContent.links.primaryCTA` — copy iteration deferred to AC-5 amendment-text drafting (minor decision; current hardcoded `'Continue'` is functional).
- Surfaces NOT adapted: `conventionalPath` (cost + timeline are facts), `howDecoupleHelps` (value-prop is constant), `journeyStages` (already adaptive via DivorceJourney render at O7.tsx:593).
- Impl scope: ~5-10 LoC extension to `composeWhatNeedsToHappen` in build-plan.ts.

**Partner-finances-awareness mapping (locked):**
- `personalisedNotes` for `little` || `suspect` — EXISTS at build-plan.ts L81-87 with `partner-finance-unknown` trigger; retain verbatim (tone-aware framing already established).
- `personalisedNotes` for `full` — NEW trigger e.g., `partner-finance-full`. Body: joint-prep language emphasising head-start advantage + bank-evidenced verification. Draft text lands in AC-5.
- `personalisedNotes` for `some` — NEW trigger e.g., `partner-finance-some`. Body: caveated joint-prep emphasising partial picture + bank-evidenced fill-in. Draft text lands in AC-5.
- Surfaces NOT adapted: `situationSummary` (surfacing awareness in summary risks feeling judgmental; note framing carries it more sensitively).
- Impl scope: ~10-15 LoC extension to `composePersonalisedNotes` in build-plan.ts (two new branches matching existing pattern).

**Combined Stage + Partner-finances impl scope: ~15-25 LoC across build-plan.ts; no new infrastructure (extensions of existing `composeXXX` functions).**

**Example anchoring + Lead-ordering mappings: OPEN — next active conversation.**

**Resolution:** Q1 + Q3 + Q4 RESOLVED. Q2 PARTIALLY RESOLVED (Stage + Partner-finances locked; Example anchoring + Lead-ordering OPEN).

### AC-4: Design question 3 framed — pre/post-signup vocab autonomy boundary

Amendment text MUST NOT:

1. Re-open spec 67 §Gap 1's RESOLVED routing-not-grading commitment (L84, verbatim header includes "RESOLVED").
2. Introduce vocabulary that implies spec 67 grades confidence (no per-domain confidence-score language in spec 67's surface).
3. Conflict with spec 67 §Distribution map's Moment 3 "section-by-section confirmation" (L41) by introducing pre-signup confidence-grading that would mechanically conflict with post-signup section-by-section flow.
4. Introduce vocabulary that bleeds into spec 34 §Tier 1-3's transaction-matching language (L188-250) — keep "Tier" reserved for spec 34's post-bank transaction machinery; use a distinct word for pre-signup adaptive plan output (e.g., "Plan shape", "Plan depth", or no Tier-class term at all).

**Boundary statement to land in amendment:**

> *(Stub — drafted at amendment-text stage per AC-5.)* "This amendment governs pre-signup O7 only. Spec 67 §Gap 1's routing-not-grading post-signup architecture (L84-86) is unchanged. Spec 34 §Tier 1-3's transaction-matching framework (L188-250) is unchanged and uses 'Tier' in a different sense from any vocabulary this amendment introduces."

**Resolution:** OPEN. Boundary statement drafted once AC-2 + AC-3 resolve; this AC verifies the drafted statement satisfies all four conditions above.

### AC-5: Amendment landing target identified

Primary landing: `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §O7 (currently L138-148). Edit type per AC-2 resolution:

- AC-2 → (a): Append clarifying paragraph at L148+ (post-existing-list) explaining the deliberate omission of Tier framework + linking to spec 67 §Gap 1.
- AC-2 → (b): Insert new sub-section *"Adaptive output shape"* between L148 and L149's `---` separator, describing Tier framework, derivation source (per AC-3), and adaptivity hooks. May extend §O7 from ~11 lines to ~30-50 lines.
- AC-2 → (c): Insert 2-3 named adaptivity hooks at L148+ (post-existing-list) with explicit conditional logic (e.g., "If `relationship_quality = high_conflict`, soften X tone").

Secondary landing (conditional on AC-2 → (b)/(c) + AC-3 → (γ)): `docs/workspace-spec/67-post-signup-profiling-progress.md` §Gap 1 sibling-note at L121 (immediately before the `---` separator) — added ONLY to acknowledge the pre-signup → post-bank refined-state hand-off without re-opening RESOLVED commitment. AC-4 polices the boundary.

Audit slice update target: `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-01 + §F-OUT-02 §Effect paragraphs + §Status table rows L121-122. Edit type per AC-2 resolution (flips `blocked` to `✓` with new slice ref, or `closed-by-design` with amendment link).

**Resolution:** OPEN. Specific edits drafted once AC-2/3/4 resolve.

### AC-6: Downstream slice plan defined

Conditional on AC-2 resolution:

- AC-2 → (a): No new impl slice required. Audit slice §Status update lands inline with the amendment PR (per session 97 recurrence-watch on post-batch §Status sweep). Single PR closes the loop.
- AC-2 → (b): New impl slice `S-PROTO-O7-adaptive-output-tier-framework` ships impl per AC-as-canvas-quote discipline if a linked canvas exists for the Tier framework; if no canvas, ACs cite spec 65 amended §O7 verbatim.
- AC-2 → (c): New impl slice `S-PROTO-O7-adaptive-hooks` ships impl per the 2-3 named hooks; smaller scope than (b) — likely 1 session shipping ~50-100 lines diff to O7.tsx.

**Resolution:** OPEN. Provisional slice name + scope drafted once AC-2 resolves.

### AC-7: Audit slice §F-OUT-01 + §F-OUT-02 §Status update plan

Once amendment lands (whichever AC-2 branch), `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` updates inline with the implementing PR (NOT a separate docs PR) per session 97 recurrence-watch:

- §F-OUT-01 §Effect paragraph: "blocked pending spec amendment work" phrase replaced with explicit resolution-link to amended spec 65 §O7 (with verbatim quote per CLAUDE.md §"Quote, don't paraphrase").
- §F-OUT-02 §Effect paragraph: sibling treatment per F-OUT-01.
- §Status table (currently L119-123): F-OUT-01 row + F-OUT-02 row Status column flips from `blocked` to `✓` (with implementing slice + commit + PR refs) or `closed-by-design` (with amendment link).
- §References section (L154+ in audit slice): if the amendment cites a new external source (e.g., new wireframe; new design doc), append to References.

**Resolution:** OPEN. Specific edits drafted once AC-5 amendment text lands.

### AC-8: Cross-spec citation verifiability

Every verbatim quote in §Context + every spec-citation in AC-1 through AC-7 resolves against current `main` at the cited `file:line`. Test surface:

- For each quote with `(L<N>-<M>, verbatim)` or `L<N>:` ref: `grep -nF "<quoted phrase>" <cited file>` returns a hit within the cited line range.
- For each AC option that references a future-state file (e.g., AC-5's "L121 of spec 67"): the cited line range exists in current `main`'s version of the file (the amendment will modify lines that exist; not lines that don't yet exist).
- Spec 34 §Tier 1-3 reference (L188-250): confirmed via grep that the section exists and the "Tier" word is used in transaction-matching sense distinct from V1 plan-output Tier sense.

**Evidence:** `grep`-based verifications run at scaffold-ship time + re-run at each AC resolution + at amendment-text drafting time.

## Downstream landing plan

Multi-stage sequence:

1. **Scaffold ship** (this slice's current shape): acceptance.md with cross-spec conflict statement + 8-AC frame. No amendment text yet. No impl. No spec edits.
2. **Design conversation stage**: user resolves AC-2 + AC-3 + AC-4 through iterative design conversation. AC list updated inline; verification.md begins accumulating per-AC evidence as design questions close.
3. **Amendment-text stage** (may coincide with stage 2 if light): amendment text drafted per AC-5; spec 65 §O7 amended; optional spec 67 §Gap 1 sibling-note added per AC-4 policed boundary. AC-1, AC-5, AC-8 evidence finalised.
4. **Impl stage** (conditional on AC-2 → (b) or (c)): new impl slice ships F-OUT-01/02 closure. Audit slice §Status updated inline per AC-7. If AC-2 → (a), this stage folds into stage 3.
5. **Slice ships** when all 8 ACs have evidence in verification.md + audit slice §Status rows reflect post-amendment state + amendment text is on `main`.

## References

- `docs/workspace-spec/65-pre-signup-interview-reconciled.md` — pre-signup interview spec, locked. §O7 at L138-148 is the primary amendment target.
- `docs/workspace-spec/67-post-signup-profiling-progress.md` — post-signup profiling progress, with §Gap 1 (L84-122) RESOLVED. Boundary policed by AC-4.
- `docs/workspace-spec/34-upfront-profiling-design.md` — upfront profiling spec, with §Tier 1-3 (L188-250) describing transaction-matching framework unrelated to F-OUT subject.
- `docs/workspace-spec/74-ai-plan-generation.md` — AI plan generation spec, with §"Free-plan framing" (L30-55) setting the standalone-artefact value bar the amendment must clear; anti-patterns at L47-53 ban conversion-mechanic framings.
- `docs/v1/v1-wireframes.md` L40-56 — V1's plan-output Tier 1-4 framework (dropped in spec 65 reconciliation).
- `docs/v1/v1-wireframes.md` L267-294 — V1's per-domain confidence indicators + CONFIDENCE MAP card (dropped in spec 65 reconciliation).
- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` — audit slice with §F-OUT-01 + §F-OUT-02 marking the conflict as blocked pending this amendment.
- `src/app/dev/proto/pre-signup-interview/screens/O7.tsx` — current impl (641 lines, 6 fixed sections, 1 adaptive element at L593).
- CLAUDE.md §"Quote, don't paraphrase, when invoking a spec" — verbatim discipline for amendment text.
- CLAUDE.md §"Slice categories" — `prototype` category declaration (sibling to audit slice).

## Status

- AC-1: drafted (§Context section above; 6 quoted sources including spec 74 §"Free-plan framing"). Awaits AC-8 verifiability pass.
- AC-2: RESOLVED → (c) — pre-signup-specific adaptivity dimension grounded in O1-O6 + derived signals. Reasoning: V1 Tier 1-4 mechanism requires inputs pre-signup does not collect (spec 65a L57); spec 74 L55 standalone-artefact value bar may not be met by current spec 65 §O7's single *"Personalised notes"* hook.
- AC-3: Q1 + Q3 + Q4 RESOLVED. Q2 PARTIALLY RESOLVED — Stage + Partner-finances mappings locked (extensions of existing build-plan.ts `composeXXX` wires; ~15-25 LoC combined impl scope). Example anchoring + Lead-ordering mappings OPEN (next active conversation). v1 shortlist + V1.5 deferrals + no-new-data-collection unchanged.
- AC-4: OPEN — boundary statement drafted at amendment-text stage.
- AC-5: OPEN — (c) branch active per AC-2; specific edits drafted once AC-3 resolves.
- AC-6: OPEN — (c) branch active per AC-2 (provisional slice `S-PROTO-O7-adaptive-hooks`); scope sharpened once AC-3 resolves.
- AC-7: OPEN — audit slice §Status update plan drafted once AC-5 amendment text lands.
- AC-8: pending — first verifiability pass runs at scaffold-tighten ship.

Slice is **multi-stage**. Scaffold-ship state delivers acceptance.md only (cross-spec conflict statement + 8-AC frame). Resolution iterates across subsequent design conversations + amendment-text drafting + impl.
