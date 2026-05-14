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
3. V1 wireframes L40-56 + L267-294 — the deliberately-dropped plan-output Tier framework + per-domain confidence indicators.
4. O7.tsx structural state — fixed 6 sections + single adaptive element (`DivorceJourney currentStageKey={answers.stage}` at O7.tsx:593) + negative-grep on adaptivity vocab.
5. Distinction from spec 34 §Tier 1-3 transaction-matching (L188-250) — unrelated post-bank machinery, explicitly not the F-OUT subject.

**Evidence:** §Context paragraphs above; each quote cites file:line.

### AC-2: Design question 1 framed — does pre-signup O7 need an adaptive tier framework at all?

Three resolution branches enumerated:

- **(a) No.** *"Personalised notes (based on their specific situation)"* (spec 65 §O7 L146, verbatim) is the adaptivity floor; any further per-domain grading conflicts with spec 67 §Gap 1's routing-not-grading post-signup commitment when O7 sits structurally just *before* the architecture spec 67 governs. Amendment: clarifying paragraph appended to spec 65 §O7 explaining the deliberate omission + linking to spec 67 §Gap 1 for the routing-not-grading downstream. F-OUT-01/02 close as out-of-scope-by-design; audit slice §Status rows flip from `blocked` to `closed-by-design` with link to amended spec 65 §O7.
- **(b) Yes — full Tier framework.** Adopt V1's Tier 1-4 plan-output framework (with or without V1's exact thresholds), augmented with per-domain confidence indicators + CONFIDENCE MAP summary card. Amendment: spec 65 §O7 gains new sub-section *"Adaptive output shape"* describing Tier framework + confidence-derivation source (per AC-3 resolution). F-OUT-01/02 unblock; new impl slice `S-PROTO-O7-adaptive-output` ships impl per AC-as-canvas-quote discipline.
- **(c) Partial.** Categorical adaptivity hooks (e.g., a relationship-quality switch that swaps one O7 paragraph; a partner-awareness switch that adds/removes one section; safety-concerns flag that softens framing) without numeric tiers or per-domain confidence grading. Amendment: spec 65 §O7 gains 2-3 specific adaptivity hooks named explicitly. F-OUT-01 unblocks at "partial fulfilment"; F-OUT-02 remains closed-by-design (no confidence-grading visual language).

**Resolution:** OPEN. Awaits user choice from (a) / (b) / (c). Reasoning must cite spec 65 §O7 and spec 67 §Gap 1 verbatim.

### AC-3: Design question 2 framed — if (b) or (c) above, what confidence-derivation source feeds the framework?

Three resolution branches enumerated, conditional on AC-2 resolving to (b) or (c):

- **(α) Pre-signup O1-O6 categorical answers.** Derive per-domain confidence from O1-O6 answer combinations via heuristic mapping (e.g., `partner_awareness = "hiding"` → finances confidence = "Gaps"; `has_children = true + relationship_quality = "amicable"` → children confidence = "Strong"). Requires explicit mapping table in spec 65 amendment. Pro: works pre-signup with data already captured. Con: introduces a per-domain coverage-score derivation language pre-signup that spec 67 §Gap 1 explicitly chose not to use post-signup.
- **(β) Pre-bank profiling P1-P6 (spec 67 Moment 2) backfeed.** Confidence derives post-bank profiling; O7 confidence indicators populate only after pre-bank profiling completes. Pro: aligns with spec 67's architecture. Con: O7 is pre-signup; post-signup data isn't available when O7 renders. Resolution path: defer O7 confidence rendering to post-signup re-display; OR drop confidence indicators from pre-signup O7 entirely and place them only on a post-signup re-display (collapsing back toward AC-2 → (a) or (c)).
- **(γ) Hybrid — pre-signup heuristic at O7, refined post-bank.** Pre-signup O7 shows initial heuristic-derived confidence per (α); post-bank re-display refines per actual disclosure coverage. Requires both: spec 65 amendment (initial state) + spec 67 amendment-NOT-ALLOWED-PER-AC-4 (refined state). Resolution path: only viable if AC-4 carve-out permits a sibling-note in spec 67 §Gap 1 acknowledging the refined-state hand-off without re-opening §Gap 1's RESOLVED commitment.

**Resolution:** OPEN. Awaits user choice from (α) / (β) / (γ), conditional on AC-2 resolving to (b) or (c). If AC-2 → (a), this AC closes as N/A.

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
- `docs/v1/v1-wireframes.md` L40-56 — V1's plan-output Tier 1-4 framework (deliberately dropped in reconciliation).
- `docs/v1/v1-wireframes.md` L267-294 — V1's per-domain confidence indicators + CONFIDENCE MAP card (deliberately dropped in reconciliation).
- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` — audit slice with §F-OUT-01 + §F-OUT-02 marking the conflict as blocked pending this amendment.
- `src/app/dev/proto/pre-signup-interview/screens/O7.tsx` — current impl (641 lines, 6 fixed sections, 1 adaptive element at L593).
- CLAUDE.md §"Quote, don't paraphrase, when invoking a spec" — verbatim discipline for amendment text.
- CLAUDE.md §"Slice categories" — `prototype` category declaration (sibling to audit slice).

## Status

- AC-1: drafted (§Context section above). Awaits AC-8 verifiability pass.
- AC-2: OPEN — awaits user resolution from (a) / (b) / (c).
- AC-3: OPEN — conditional on AC-2 → (b) or (c).
- AC-4: OPEN — boundary statement drafted at amendment-text stage.
- AC-5: OPEN — specific edits drafted once AC-2/3/4 resolve.
- AC-6: OPEN — downstream slice plan drafted once AC-2 resolves.
- AC-7: OPEN — audit slice §Status update plan drafted once AC-5 amendment text lands.
- AC-8: pending — first verifiability pass runs at scaffold-ship time.

Slice is **multi-stage**. Scaffold-ship state delivers acceptance.md only (cross-spec conflict statement + 8-AC frame). Resolution iterates across subsequent design conversations + amendment-text drafting + impl.
