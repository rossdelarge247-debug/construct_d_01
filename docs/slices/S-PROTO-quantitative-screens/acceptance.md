# S-PROTO-quantitative-screens

**Category:** prototype

## Slice

UI for the 3 new pre-signup quantitative screens (O6.5 / O6.6 / O6.7) plus a transition bridge screen between O6 and O6.5, wiring the existing `Quantitative` state shape (already on main) to user-facing field inputs. Builds against spec 65b — the three new screens at L60-208, progressive expansion mechanics at L209-220, and placement in the existing 8 screens at L30-58. Canvas-as-source pattern with no canvases shipped for these screens; spec is the sole visual + structural source.

## Pre-flight notes

- Single combined slice (user-chosen at scoping; alternatives were 3 per-screen slices or 2-slice partition).
- No `Linked canvas:` field — `reviewer-canvas-fidelity` dimension stays dormant per CLAUDE.md §"Hard controls" matrix.
- AC arithmetic per CLAUDE.md §"100% rule": 11 ACs cover 4 new screens (bridge + O6.5 + O6.6 + O6.7). Spec 65b L340 declares the structural scope:

> "Wireframes. Visual treatment and exact component design TBD — Claude AI Design canvas pass to follow. Tone/copy in this spec is illustrative; structure and field set are definitive."
- Adversarial-review budget: single-pass at slice completion (`acceptance.md` <300L expected).

## Spec sources

Verbatim citations per CLAUDE.md §"Planning conduct" §"Quote, don't paraphrase, when invoking a spec":

**Spec 65b §"Placement in the existing 8 screens" L42-54** (transition copy after O6):

> "You've shared what matters. Now a few optional questions
> that help us tailor the numbers in your plan —
> sharing-principle weighting, consent-order complexity,
> and your timeline.
>
> Every question is optional. You can skip any field or
> skip the whole section."

**Spec 65b §"Progressive expansion mechanics" L211-217:**

> "Per-screen, not global. The user makes an independent disclosure decision per theme."
>
> "Default collapsed. Expansion toggles are collapsed by default. The rationale strapline is always visible so the user understands the trade-off without opening the toggle."
>
> "Toggling open and then closing without answering leaves the expansion fields empty (equivalent to 'Prefer not to say'). No coercion to fill what was opened."
>
> "Skip-screen vs skip-fields. 'Skip this screen' sets all that screen's fields to empty and advances. 'Prefer not to say' on a single field leaves the rest answerable. Both are equivalent for plan-engine consumption."

**Spec 65b §"The 3 new screens" L66-71** (O6.5 children's age bands):

> "Your children's age bands"  (skipped entirely if O2 has_children=false)
>
> Youngest child:    ○ 0-4   ○ 5-11   ○ 12-15   ○ 16-17   ○ 18+   ○ Prefer not to say
> Oldest child:      ○ 0-4   ○ 5-11   ○ 12-15   ○ 16-17   ○ 18+   ○ Prefer not to say

**Spec 65b §"The 3 new screens" L108-111** (O6.6 preamble):

> "None of this is exact — bucket ranges only. After you sign up
> and connect your bank, we'll work from the real figures. These
> buckets just help your plan land closer to your actual situation."

**Spec 65b §"What this does NOT cover" L335:**

> "Free numeric input. Reserved for post-signup bank-confirmation flows where the figure is bank-evidenced. Pre-signup remains bucket-only."

## Acceptance criteria

**AC-1 — Infrastructure: dispatcher + step constants.**
`SCREEN_COUNT = 12` constant added to `src/app/dev/proto/pre-signup-interview/lib/types.ts`. `TOTAL_STEPS = 8` preserved as pill-display max (existing screens unchanged). `proto-context.tsx` `next`/`back`/`goTo` clamps use `SCREEN_COUNT`. `page.tsx` `renderScreen` switch extended: case 7 → `QuantBridge`, case 8 → `O6_5`, case 9 → `O6_6`, case 10 → `O6_7`, case 11 → `O7`, case 12 → `O8`. Existing cases 1-6 unchanged.

**AC-2 — Q-bridge transition screen (step 7) with dual CTAs.**
New `QuantBridge.tsx` screen renders headline + subhead verbatim from spec 65b L45-51 (transition copy block above). Two CTAs: "Continue →" advances `proto-context.step` from 7 to 8 (→ O6.5); "Skip the quantitative section →" jumps directly from step 7 to step 11 (→ O7) via `goTo(11)`, leaving `answers.quantitative` undefined entirely (per D-8). TopBar renders with `step={6} total={8}` (frozen, per D-1).

**AC-3 — O6.5 children's age section (step 8, conditional).**
`O6_5.tsx` renders children's age bands section iff `answers.situation?.hasChildren === 'yes'` (strict, per D-5). When `answers.situation?.childrenCount === 1`, single picker labelled "Your child" is shown (per D-6 fallback: undefined OR ≥2 → Youngest+Oldest pair). Each picker presents 5 age-band radios per spec L69-70 (`0-4` / `5-11` / `12-15` / `16-17` / `18+`) plus a 6th "Prefer not to say" radio. Selecting an age-band writes the matching `ChildAge` literal to `quantitative.child_age_youngest` (or `_oldest`); "Prefer not to say" writes `null` per spec L217 equivalence.

**AC-4 — O6.5 expansion toggle + 3 fields.**
Default-collapsed toggle button labelled (spec L78 verbatim): *"+ Add ages and relationship length — unlocks pension and sharing-principle weighting"*. Rationale paragraph from spec L91-93 always visible beside the toggle (per spec L213 *"The rationale strapline is always visible"*). When toggled open, 3 pickers render: `your_age` (5 bands per spec L84), `ex_age_relative` (4 options per spec L85 — *Same age as you* / *Older* / *Younger* / *Don't know*), `relationship_length` (5 bands per spec L86). Each picker has a "Prefer not to say" radio writing `null`. Toggling closed without selecting leaves fields untouched (per D-11 / spec L215 *"No coercion to fill what was opened"*).

**AC-5 — O6.6 preamble + 2 core financial fields (step 9).**
`O6_6.tsx` always shows the preamble from spec L108-111 verbatim above any field. Core fields: `combined_monthly_income` picker (5 bands per spec L118 plus "Prefer not to say") and `total_assets` picker (6 bands per spec L121 plus "Prefer not to say"). Each writes to the corresponding `Quantitative` field on selection.

**AC-6 — O6.6 expansion toggle + 4 fields (with `property_equity` conditional).**
Default-collapsed toggle labelled (spec L127 verbatim): *"+ Add property, savings, debts and pension — unlocks consent-order complexity tier"*. Rationale strapline from spec L148-150 always visible. When toggled open, 4 pickers render in spec order: `property_equity` (5 bands per spec L134), `savings_cash` (5 bands per spec L137), `debts_non_mortgage` (5 options per spec L140 including `None`), `pension_value` (5 options per spec L143 including `None`). `property_equity` picker is skipped entirely when `answers.situation?.home === 'rent'` (per D-7 — spec L133 *"property_status=rent"* maps to the `home` field on `SituationAnswers`).

**AC-7 — O6.7 timeline core + final CTA (step 10).**
`O6_7.tsx` renders a single-select radio group with 6 options per spec L167-172 + "Prefer not to say" (`asap` / `3m` / `6m` / `12m` / `18m+` / `unsure`). Final screen-action CTA reads "Continue to your plan →" per spec L204 (not "Continue →" — spec is explicit here). Continue advances step from 10 to 11 (→ O7).

**AC-8 — O6.7 expansion multi-select drivers.**
Default-collapsed toggle labelled (spec L179 verbatim): *"+ Add what's driving the timeline — helps your plan address the real pressure"*. Rationale strapline from spec L196-199 always visible. When toggled open, a checkbox group renders with 7 options per spec L187-193 (mapped to the `TimelineDriver` literals: `deadline` / `new_relationship` / `housing` / `children` / `financial` / `emotional` / `none`). Checked state writes a `ReadonlyArray<TimelineDriver>` to `quantitative.timeline_drivers`; unchecking all options writes `[]`. Multi-select behaviour preserves the spec's *"pick any that apply"* framing (L185).

**AC-9 — Per-screen Skip + per-field "Prefer not to say" semantics.**
Each new screen (O6.5, O6.6, O6.7) has a footer "Skip this screen →" affordance that advances to the next step WITHOUT writing the screen's quantitative fields (per D-9). "Prefer not to say" on any single field writes `null` to that field (per spec L217 equivalence). Both shapes are equivalent for plan-engine consumption — verified by the regression check in AC-11.

**AC-10 — Frozen-pill behavior + back-button navigation.**
Bridge + O6.5 + O6.6 + O6.7 all render `<TopBar step={6} total={8} />` (frozen at 6/8 per D-1). O7 renders with its existing step value (verified at impl by reading `O7.tsx`); SCREEN_COUNT bump must not regress O7's pill display. Back arrow on the bridge returns to O6 (step 6); back arrow on O6.5/O6.6/O6.7 returns to the previous quant screen.

**AC-11 — Regression check + state-wire unit tests.**
All 71 existing `tests/unit/proto-pre-signup/build-plan*.test.ts` cases still pass — no edits to `build-plan.ts` or `types.ts`'s `Quantitative` shape (TOTAL_STEPS / SCREEN_COUNT touches only). New unit test file `tests/unit/proto-pre-signup/quantitative-screens-state-wire.test.ts` covers: "Prefer not to say" on each field type writes `null`; Skip-screen on O6.5 does not write to `answers.quantitative` (state-wire semantics only — DOM-level component testing deferred). Test descriptions are behavioural, not AC-numbered (anti-pattern per CLAUDE.md §"Coding conduct" §"Comments: WHY not WHAT, no temporal provenance").

## Design decisions (named uncertainties)

**D-1.** Progress-pill behavior across the 4 new screens: frozen at `step=6 total=8` through bridge + O6.5 + O6.6 + O6.7, advances to 7/8 at O7. Spec 65b is silent on pill semantics; user-decided at scoping (alternatives were renumber to /12 or hide pill).

**D-2.** Internal step counter decoupled from pill-display total: `SCREEN_COUNT = 12` controls dispatcher + clamps; `TOTAL_STEPS = 8` preserved as the pill `total` default. Avoids touching all existing O1-O8 screens which currently rely on `TOTAL_STEPS` for default pill behavior.

**D-3.** Transition screen between O6 and O6.5: a new dedicated screen (user-decided at scoping; alternatives were modifying O6's footer or embedding as O6.5 preamble). Filename: `QuantBridge.tsx`. Dispatched at numeric step 7.

**D-4.** Partition: 1 combined slice (user-decided at scoping; alternatives were 3 per-screen or 2-slice partition). Justification: shared chassis primitives, shared bucket-picker abstraction, shared expansion-toggle pattern, single coherent user-facing feature.

**D-5.** Children age section trigger: `answers.situation?.hasChildren === 'yes'` strict (spec L67 *"skipped entirely if O2 has_children=false"*). Undefined (O2 partially answered or skipped) treated as no-children path; do not show the section. Conservative reading; sibling-spec-discrepancy resolution.

**D-6.** Single-child relabel trigger: `answers.situation?.childrenCount === 1` shows single picker labelled "Your child" (spec L73). Undefined OR ≥2 → render Youngest + Oldest pair (dominant case). Sibling-spec-discrepancy resolution.

**D-7.** Spec L133 `O2 property_status=rent` maps to `answers.situation?.home === 'rent'`. `types.ts` is authoritative (no `property_status` field exists); spec uses higher-level naming. Sibling-spec-discrepancy resolution.

**D-8.** "Skip the quantitative section" from Q-bridge: `goTo(11)` directly; `answers.quantitative` stays `undefined` entirely. Existing plan-engine derive functions degrade gracefully on undefined input (verified by the 71 build-plan tests on main).

**D-9.** "Skip this screen" from O6.5 / O6.6 / O6.7: advance step without writing the screen's `Quantitative` fields (leave `undefined`). Per spec L217 *"both are equivalent for plan-engine consumption"* — `undefined` = `null` = "Prefer not to say" for plan-engine purposes. Avoids per-field initialisation noise.

## Out of scope (this slice)

- Free numeric input fields (spec 65b L335; verbatim block in §Spec sources above).
- Individual asset / debt / savings breakdowns (spec L336).
- CETV (pension transfer value) collection (spec L337).
- Partner-disclosed quantitative data (spec L338).
- Validation logic on bucket plausibility (spec L339).
- Visual treatment via Claude AI Design canvases (spec L340 — canvas-as-source pattern; defer to future canvas pass).
- A/B testing of expansion uptake (spec L342).
- Plan-engine consumption changes (already on main; `build-plan.ts` derive functions consume `Quantitative` shape unchanged).
- Per-field rationale tooltips beyond the spec-defined toggle-strapline pattern (spec L74-79 + L146-150 are screen-level rationale; no per-field tooltips specced).
- DOM-level component testing (e.g. `@testing-library/react` snapshot/render tests) — deferred per `category: prototype` short-form DoD; state-wire unit tests in AC-11 cover the testable surface for this category.

## Definition of Done (per `category: prototype`, short-form from CLAUDE.md §"Slice categories")

DoD items 1, 8, 12, 14 of the 14-item security checklist (spec 72 §11 short-form for prototype):

1. **AC met with evidence per AC in `verification.md`** — final-state record assembled at slice ship; round-by-round audit detail in HANDOFF / PR description, not in verification.md itself.
8. **No secrets in src or commit messages** — verified by `git diff` review pre-push + CI secret-scanning check.
12. **No console errors in browser dev console** — verified at preview-deploy review.
14. **Preview-deploy verification rubric** — 6-dimension review covering golden path + edge cases + prefers-reduced-motion + keyboard-only + mobile viewport + screen-reader (rubric file: `docs/workspace-spec/72a-preview-deploy-rubric.md`); reviewed by `ux-polish-reviewer` persona at slice completion. Section `## Preview-deploy verification` in `verification.md` covers all 6 rows.

Plus the per-slice DoD (CLAUDE.md §"Engineering conventions"):

- Tests written and passing (existing 71 + new state-wire tests per AC-11).
- Adversarial review done (`/review` skill or persona spawn) at slice completion.
- Preview deploy verified in-browser (golden path + edge cases + reduced-motion).
- No regression in adjacent slices — existing O1-O8 screens still render with their natural step values; pill behavior preserved.
- Slice's open 68f/g entries: none applicable (not in 68f/g register).

## §Status

Slice scaffold scoped session 105. User decisions captured at scoping (3 explicit AskUserQuestion rounds):

- Priority: P1 over P2 (desktop graceful enhancement; spec ref blocked).
- Partition: 1 combined slice over 3 per-screen or 2-slice mix.
- Transition copy location: new bridge screen between O6 and O6.5 (alternative was modifying O6 footer or O6.5 preamble).
- Progress-pill behavior: frozen at 6/8 through new screens (alternatives were renumber to /12 or hide pill).

Sibling-spec-discrepancies silently resolved at scoping (per session-104 retro on sibling-batching):

- D-5 `hasChildren=undefined` → strict 'yes' trigger; treat undefined as no-children path.
- D-6 `childrenCount=undefined` when hasChildren='yes' → fall through to Youngest+Oldest pair.
- D-7 Spec L133 `property_status=rent` → `situation.home === 'rent'`.
- D-8 / D-9 Skip-section + Skip-screen semantics: leave fields `undefined` (equivalent to `null` per spec L217).

| Round | Action | Date |
|---|---|---|
| Scaffold | acceptance.md drafted; 11 ACs + 9 design decisions; user sign-off pending | 2026-05-18 |
