# S-PROTO-tone-audit-phase-1

**Category:** prototype

Phase 1 scope-only audit slice. Catalogues tone deltas across the 8 canvas-as-source pre-signup-interview screens (O1-O8) + the dynamic copy in `build-plan.ts` + the chassis primitives, measured against CLAUDE.md §"North star" + §"Product rules" + §"Product positioning". Output is a structured findings register tagged by severity. **No implementation.** Phase 2 (user joint review) prunes / re-scopes / prioritises; Phase 3 ships fixes in dedicated batch slices.

This slice extends the post-merge tone retro on `build-plan.ts` carried by the precursor slice `S-PROTO-O7-copy-tone-pass` — broadening the lens from one component to the full pre-signup surface. The 4 mild findings parked from that retro feed in as concrete starting candidates and are re-evaluated here in cross-screen context.

Per CLAUDE.md §"Canvas-as-source (prototype default)": this audit slice doesn't carry `Linked canvas:`. It cites shipped source code at `src/app/dev/proto/pre-signup-interview/` + CLAUDE.md anchor quotes.

## Spec sources

- CLAUDE.md §"North star (quality bar)": *"The experience should feel like having a brilliant, patient analyst sitting beside you through the whole separation — finances, children, housing, future needs."*
- CLAUDE.md §"North star (quality bar)": *"This should feel like it was built in 2026. No shortcuts, no MVPs. The users are stressed, often alone, often late at night. Every interaction must be compassionate, professional, and empowering."*
- CLAUDE.md §"Product rules": *"'A warm hand on a cold day' — compassionate, professional, never patronising"*.
- CLAUDE.md §"Product positioning (preserve this across sessions)": *"Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs ... It is NOT a financial disclosure tool."*
- CLAUDE.md §"Product positioning (preserve this across sessions)": *"never frame Decouple as 'a financial disclosure tool.' The complete settlement workspace framing is load-bearing"*.
- CLAUDE.md §"Product positioning (preserve this across sessions)": three positioning pillars — *"Shared, not adversarial"* · *"Evidenced, not asserted"* · *"End-to-end, not hand-off"*.

## Severity ladder

- **STRONG** — actively misaligned with positioning; reader could feel framed-against, narrowed to a sub-product (e.g. financial-disclosure-only), or coldly handled. Should land in the next impl batch.
- **MILD** — flat / anodyne / clinical / form-system register; not actively wrong but a missed warm-moment. Address opportunistically; batch with adjacent strong findings where the surface overlaps.

**Phase 2 calibration result.** Joint user review upgraded all 11 initially-MILD findings to STRONG (verdicts captured in §Status table below). The CLAUDE.md North Star + Product Rules quality bar admits no "missed warm-moment" tier in practice — anything that fails the analyst-by-your-side test against an anchor quote is positioning-miss-level. Future audits should default to STRONG when in doubt; MILD survives only for surfaces that meet the bar but could be sharpened (none in this audit qualify).

## What this audit covers vs doesn't

**Covered:**
- Static copy in `lib/copy/o1.ts`-`lib/copy/o6.ts` (O1-O6 user-facing copy).
- Dynamic copy in `lib/build-plan.ts` (O7 plan-output composition; 4 mild findings carried from `S-PROTO-O7-copy-tone-pass` retro + cross-screen siblings).
- Hardcoded inline copy in `screens/O7.tsx` + `screens/O8.tsx` (the two screens that don't use a copy-file).
- Chassis primitive hardcoded labels (`components/WhyWeAsk.tsx` `'Why we ask'` callout label).

**NOT covered:**
- Visual treatment of copy (typography weight, italic accents, colour) — covered separately by spec 18 / canvas-as-source visual baseline.
- Motion-tone (animation timing/easing in response to copy events) — covered by spec 26 + `S-PROTO-delight-spec26-compliance`.
- Post-signup surfaces (welcome tour, dashboard, profile flow) — out of this slice's pre-signup-only scope.
- Marketing landing / pre-marketing pages — different audience + register.
- Form-validation / error-state copy — none currently rendered in pre-signup; future slices.
- Implementation of any finding — Phase 3+.

## Findings register

### F-TONE-01 [STRONG] — O1 stage option sub-copy narrows Decouple to finances.

- **Surface:** `src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts:48`.
- **Current copy:** `{ value: 'decided', label: 'We\'ve decided to separate', sub: 'You want to get the finances sorted.' }`.
- **Observation:** The sub-copy for `'decided'` users frames Decouple as a financial-disclosure tool ("get the finances sorted") — directly contradicting CLAUDE.md §"Product positioning": *"It is NOT a financial disclosure tool ... never frame Decouple as 'a financial disclosure tool.' The complete settlement workspace framing is load-bearing"*. The sibling subs `'thinking'` (*"You want to understand what's involved."*) and `'in_process'` (*"You want to get things moving faster."*) don't narrow the product; only `'decided'` does. Effect: the user most likely to convert (the one who's already decided) is greeted with the wrong product framing in the very first screen.
- **Direction (Phase 3 candidate):** rewrite the sub to anchor on the complete-picture framing, e.g. *"You want a clear plan you can act on."* — keeps the action register of the original but doesn't narrow scope to money. Or *"You want to see the full picture and move."*

### F-TONE-02 [STRONG] — O2 eyebrow exposes developer-facing screen identifier.

- **Surface:** `src/app/dev/proto/pre-signup-interview/lib/copy/o2.ts:43`.
- **Current copy:** `eyebrow: 'O2 · Your situation'`.
- **Observation:** The `'O2 · '` prefix is a screen identifier (the wire numbering from spec 65 §O1-O8) leaking into user-facing copy. No sibling screen carries this prefix in its eyebrow — O1 uses `'To start your plan…'`, O3 uses `'Your ex'`, O4 uses `'Money'`, O5 uses `'Money · their side'`, O6 uses `'What matters · last step before your plan'`. The dev-leak signals an unfinished surface to the user.
- **Direction (Phase 3 candidate):** drop the `'O2 · '` prefix; eyebrow becomes `'Your situation'` (matching the heading shape and the sibling-eyebrow conventions).

### F-TONE-03 [STRONG] — `'ongoing-support'` priority-note carries analyst-systems jargon.

- **Surface:** `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:92`.
- **Current copy:** `'Because future financial support matters most to you, Decouple helps you map maintenance scenarios against bank-evidenced income.'`
- **Observation:** The Decouple-half of the note uses systems-vocabulary — *"map maintenance scenarios against bank-evidenced income"* reads as analyst-writing-to-analyst, not analyst-speaking-to-user. The user asked an emotional question (will I be okay financially after separation?); the answer should speak to that anxiety in everyday language. Compare the sibling `'low-cost'` note (`build-plan.ts:91`): `'Because keeping costs low matters most to you, Decouple replaces the £14,561 average solicitor journey with a £800-1,100 collaborative path.'` — same template, plain numerals, no jargon. Carried from `S-PROTO-O7-copy-tone-pass` parked-findings list as mild; reclassified strong here because cross-screen comparison surfaces the register-mismatch sharpness.
- **Direction (Phase 3 candidate):** rewrite the Decouple-half in plain language anchored on the user's question, e.g. *"...Decouple maps what's coming in and going out for both of you — so you can see what's actually workable."* Or shorter: *"...Decouple shows you what's affordable for both of you, evidenced from real bank data."*

### F-TONE-04 [STRONG] — `'Continue'` CTA repeated bare across O1/O4/O5 + `primaryCTAForStage('decided')`.

- **Surfaces:**
  - `src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts:52` — `cta: 'Continue'`.
  - `src/app/dev/proto/pre-signup-interview/lib/copy/o4.ts:45` — `cta: { continue: 'Continue' }`.
  - `src/app/dev/proto/pre-signup-interview/lib/copy/o5.ts:44` — `cta: { continue: 'Continue' }`.
  - `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:60` — `primaryCTAForStage('decided') → 'Continue'`.
- **Current copy:** bare `'Continue'` across four CTAs.
- **Observation:** `'Continue'` is the system-anodyne label — it tells the user nothing about what they're moving toward. The sibling stage CTAs in `primaryCTAForStage` (`'thinking' → 'See what comes next'` · `'in_process' → 'Pick up from here'`) are warm + action-anchored; the `'decided'` case is bare. The screen CTAs on O2 (caption `'${n} of 4 answered'`), O6 (`'Build my plan'`), and O8 first-person CTAs (`'Create my account'`, `'Download my plan'`) all show what a meaningful CTA can be on this surface. Combines the parked `primaryCTAForStage('decided')` mild finding from the precursor tone-pass with the broader cross-screen pattern.
- **Direction (Phase 3 candidate):** per-screen specific verbs:
  - O1 (after stage answer): *"Set up your situation"* or *"Move on to your situation"*.
  - O4 (money question): *"Next: their side"* (since O5 is "Money · their side") or just *"Onwards"*.
  - O5 (their-side question): *"Next: what matters to you"* (since O6 is priorities/worries).
  - `primaryCTAForStage('decided')`: e.g. *"Begin the plan"* or *"Start building"* — matches sibling warmth + action anchoring.

### F-TONE-05 [STRONG] — `leadPhrase('housing')` + `leadPhrase('pensions')` flatter than `'children'`.

- **Surface:** `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:48-55`.
- **Current copy:**
  - `'children' → 'Keeping things steady for the children comes first in your plan.'` ← gold standard
  - `'housing' → 'Decisions about your home shape what comes next.'` ← flat, procedural
  - `'pensions' → 'Protecting pensions matters in this picture.'` ← flat, meta-phrasing
- **Observation:** `'children'` connects to user feeling ("steady" + "comes first" + emotional). `'housing'` uses procedural language ("decisions" + "shape what comes next" — what does that actually mean to me?). `'pensions'` is meta-phrasing about importance rather than speaking to the underlying concern. Carried from `S-PROTO-O7-copy-tone-pass` parked-findings.
- **Direction (Phase 3 candidate):** rewrite to match the children warmth — ground each in what the user actually cares about:
  - `'housing'`: *"Where each of you lives next sits at the heart of your plan."*
  - `'pensions'`: *"What you've each built up for later — your plan keeps that in view."*

### F-TONE-06 [STRONG] — `homeDescription('mortgage')` clinical.

- **Surface:** `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:77`.
- **Current copy:** `'mortgage' → 'Your home is mortgaged.'`
- **Observation:** Be-verb predicate frames the home as a financial label (`is mortgaged`). The sibling cases (`'own-outright' → 'You own your home outright.'`, `'rent' → 'You rent your home.'`) frame the user as the subject — *you own*, *you rent*. The mortgage case alone flips to the home as subject. Subtle register-mismatch. Carried from `S-PROTO-O7-copy-tone-pass` parked-findings.
- **Direction (Phase 3 candidate):** restructure to keep the user as subject, e.g. *"You're paying off a mortgage on your home."* — preserves the fact, restores the subject-verb register-match with siblings.

### F-TONE-07 [STRONG] — O4 eyebrow `'Money'` most clinical eyebrow across screens.

- **Surface:** `src/app/dev/proto/pre-signup-interview/lib/copy/o4.ts:30`.
- **Current copy:** `eyebrow: { label: 'Money', accent: 'indigo' }`.
- **Observation:** `'Money'` is a single-word category label. Compare warmer siblings: O1 `'To start your plan…'`, O3 `'Your ex'`, O5 `'Money · their side'`, O6 `'What matters · last step before your plan'`. O5's `'Money · their side'` shows the pattern that would warm O4 — anchor on the conversational frame ("your side" vs "their side").
- **Direction (Phase 3 candidate):** `eyebrow: { label: 'Money · your side', accent: 'indigo' }` — mirrors O5's frame and pre-announces the O4/O5 pairing.

### F-TONE-08 [STRONG] — O4/O5 `'Answer recorded — continue when ready.'` reads form-system.

- **Surfaces:**
  - `src/app/dev/proto/pre-signup-interview/lib/copy/o4.ts:42`.
  - `src/app/dev/proto/pre-signup-interview/lib/copy/o5.ts:41`.
- **Current copy:** `oneAnswered: 'Answer recorded — continue when ready.'`
- **Observation:** *"Answer recorded"* is system-feedback vocabulary (admin panels say that; an analyst-by-your-side doesn't). The companion `pickToContinue` captions on the same screens are conversational; this one breaks register.
- **Direction (Phase 3 candidate):** *"Noted — keep going when you're ready."* Or simpler: *"Got it — move on when you're ready."*

### F-TONE-09 [STRONG] — O3 `'Pick the option that fits best to continue.'` form-instructional.

- **Surface:** `src/app/dev/proto/pre-signup-interview/lib/copy/o3.ts:57`.
- **Current copy:** `pickToContinue: 'Pick the option that fits best to continue.'`
- **Observation:** Instruction-y register; reads as form-helper text. Compare O5's caption-pair which uses the warmer reframe `"Pick the answer closest to what's true today."` — same instructional purpose, but the phrasing acknowledges the user is making a judgement call rather than performing a procedural step.
- **Direction (Phase 3 candidate):** align O3's `pickToContinue` with O5's warmer reframe, e.g. *"Pick the one closest to how things feel right now."*

### F-TONE-10 [STRONG] — O3 `'Both answered.'` flat acknowledgement.

- **Surface:** `src/app/dev/proto/pre-signup-interview/lib/copy/o3.ts:59`.
- **Current copy:** `bothAnswered: 'Both answered.'`
- **Observation:** Bare two-word system-state. Compare O6's `notedSingular: '1 thing noted — your plan will weight these.'` — warmth + functional explanation. O3's caption misses the moment.
- **Direction (Phase 3 candidate):** *"Both noted — ready when you are."* Or *"Both done — continue when ready."*

### F-TONE-11 [STRONG] — O7 `'Building your plan'` eyebrow under-pairs with `'Take a breath.'` heading.

- **Surface:** `src/app/dev/proto/pre-signup-interview/screens/O7.tsx:505`.
- **Current copy:** `<Eyebrow color={colors.violet}>Building your plan</Eyebrow>`.
- **Observation:** The heading `'Take a breath.'` (L515) is the gold-standard warm-loading-copy moment on this surface — direct, embodied, permission-giving. The eyebrow that pairs with it is system-generic ("Building your plan"). Eyebrow + heading should share warmth-register; here they don't.
- **Direction (Phase 3 candidate):** e.g. *"Drawing it together"* or *"Almost there"* — matches the embodied register of `'Take a breath.'`

### F-TONE-12 [STRONG] — O7 secondary actions: `'Save as PDF'` vs `'Download as PDF'` inconsistency.

- **Surfaces:**
  - `src/app/dev/proto/pre-signup-interview/screens/O7.tsx:150` — `'Save as PDF'` (one render state).
  - `src/app/dev/proto/pre-signup-interview/screens/O7.tsx:630` — `'Download as PDF'` (other render state).
- **Observation:** Two button labels for what appears to be the same action (PDF export) in different render states of O7. Either both should say `'Download as PDF'` (the more accurate consumer-facing verb for "click → file appears in Downloads") or both `'Save as PDF'`; inconsistency reads as drift. Cross-reference: O8 has a sibling `'Download my plan'` CTA (`screens/O8.tsx:48`) using the same verb.
- **Direction (Phase 3 candidate):** standardise on `'Download as PDF'` to align with O8's `'Download my plan'`. If the two states genuinely need different verbs (e.g. one is pre-completion save-progress; one is post-completion final), name them distinctly enough that the difference reads.

### F-TONE-13 [STRONG] — O6 priority option `'Ongoing financial support'` register-flat next to siblings.

- **Surface:** `src/app/dev/proto/pre-signup-interview/lib/copy/o6.ts:56`.
- **Current copy:** `{ value: 'ongoing-support', label: 'Ongoing financial support' }`.
- **Observation:** *"Ongoing financial support"* is administrative-form vocabulary. The sibling priority options on O6 are warmer + grounded:
  - `'A fair split of everything'`
  - `'Keeping the family home'`
  - `'Stability for the children'`
  - `"A clean break — no ongoing ties"`
  - `'Getting this done quickly'`
  - `'Keeping costs low'`
- This option's clinical register cascades: F-TONE-03's priority-note inherits the same systems-vocabulary because the option label sets the frame.
- **Direction (Phase 3 candidate):** rewrite to plain-language equivalent, e.g. *"Maintenance going one way or the other"* or *"Knowing one of us will still need support"* — keeps the operational meaning (maintenance / ongoing support arrangements) but uses everyday phrasing matching the siblings. F-TONE-03's note rewrite should follow whatever this label settles on.

### F-TONE-14 [STRONG] — Inconsistent use of "ex" vs "partner" across O3/O5.

- **Surfaces:**
  - `src/app/dev/proto/pre-signup-interview/lib/copy/o3.ts:36-44` — "ex" used 4 times (`eyebrow: 'Your ex'`, `heading: 'How would you describe things between you and your ex?'`, `relationship.label: 'How would you describe things between you and your ex?'`, `whyWeAsk: 'How things stand between you...'`).
  - `src/app/dev/proto/pre-signup-interview/lib/copy/o5.ts:30` — "partner" used in heading: `"How much do you know about your partner's financial situation?"`.
- **Observation:** Inconsistent referent for the same person — "ex" on O3, "partner" on O5. Both are valid; the inconsistency is the issue. "Ex" carries a definiteness that may not match users at the `'thinking'` or `'in_process'` stage (they may not yet think of their partner as an "ex"); "partner" is stage-neutral and warmer. Consistency requires a stage-conditional choice or settling on one term.
- **Direction (Phase 3 candidate):** standardise on "partner" across O3/O5 (and audit other surfaces for cascading effects). "Ex" can remain in stage-specific lead phrasing or post-signup contexts where the user has explicitly indicated separation is final.

## Non-issues (good — anchor moments to preserve)

These are surfaces that already exemplify the analyst-by-your-side register. Logged so Phase 3 fixes don't accidentally regress them; also as reference patterns for the rewrites above.

- O1 entry block (`lib/copy/o1.ts:35-43`) — timeIntro + 3 outcome bullets + reassurance. Warm + concrete + permission-giving.
- O3 relationship options (`lib/copy/o3.ts:42-44`) — *"Difficult, but manageable"* / *"High conflict, communication is very hard"* softens hard fact with human framing.
- O5 helper (`lib/copy/o5.ts:31`) — *"There's no wrong answer. Many people don't know everything."* — gold-standard reassurance.
- O5 whyWeAsk (`lib/copy/o5.ts:32`) — *"This isn't about catching you out..."* — gold-standard analyst-honesty.
- O6 heading (`lib/copy/o6.ts:43`) — *"A few words on what matters to you, and what's worrying you."* — warm + conversational; sets the right register for a priority/worry-collection screen.
- O6 priority CTA (`lib/copy/o6.ts:79`) — `label: 'Build my plan'` — meaningful, action-anchored.
- O7 loading heading (`screens/O7.tsx:515`) — *"Take a breath."* — gold-standard embodied warmth.
- O8 OPTIONS (`screens/O8.tsx:37-62`) — first-person titles + CTAs (`'my picture'`, `'my plan'`, `'my account'`) anchor user agency; permission-giving helper *"There's no wrong answer. You can come back anytime."*
- `WhyWeAsk` chassis primitive (`components/WhyWeAsk.tsx:29`) — hardcoded `'Why we ask'` ALL-CAPS eyebrow above the per-question body text. Analyst-pattern callout consistent with the V1 educational-callout convention; passed the audit unchanged. Phase 3 batches should preserve the label verbatim when adjusting surrounding copy.

## Status

Phase 1 lands this register. Phase 2 user-review prunes / re-frames / prioritises before Phase 3 batches ship. Status table seeded; rows fill as fixes ship.

| Finding | Severity | Status | Slice | Merge sha | PR |
|---|---|---|---|---|---|
| F-TONE-01 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | c3ee0cc | #193 |
| F-TONE-02 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | c3ee0cc | #193 |
| F-TONE-03 | STRONG | shipped | S-PROTO-tone-pass-positioning-batch | c3ee0cc | #193 |
| F-TONE-04 | STRONG | shipped | S-PROTO-tone-pass-cta-batch | 917af25 | #194 |
| F-TONE-05 | STRONG | shipped | S-PROTO-tone-pass-plan-output-warmth | a6401eb | #195 |
| F-TONE-06 | STRONG | shipped | S-PROTO-tone-pass-plan-output-warmth | a6401eb | #195 |
| F-TONE-07 | STRONG | shipped | S-PROTO-tone-pass-eyebrow-referent-and-o7-polish | d9937e4 | #197 |
| F-TONE-08 | STRONG | shipped | S-PROTO-tone-pass-chassis-captions | 9b8a522 | #196 |
| F-TONE-09 | STRONG | shipped | S-PROTO-tone-pass-chassis-captions | 9b8a522 | #196 |
| F-TONE-10 | STRONG | shipped | S-PROTO-tone-pass-chassis-captions | 9b8a522 | #196 |
| F-TONE-11 | STRONG | shipped | S-PROTO-tone-pass-eyebrow-referent-and-o7-polish | d9937e4 | #197 |
| F-TONE-12 | STRONG | shipped | S-PROTO-tone-pass-eyebrow-referent-and-o7-polish | d9937e4 | #197 |
| F-TONE-13 | STRONG | shipped | S-PROTO-tone-pass-plan-output-warmth | a6401eb | #195 |
| F-TONE-14 | STRONG | shipped | S-PROTO-tone-pass-eyebrow-referent-and-o7-polish | d9937e4 | #197 |

## Workflow

**Phase 1 — this slice.** Claude-solo source-level audit. No implementation. Output: this `acceptance.md`.

**Phase 2 — next session.** User joint review of findings. Pruning / re-scoping / prioritisation. Decision per finding: address, defer, drop. Findings the user disagrees with get removed or re-framed in this `acceptance.md` before Phase 3.

**Phase 3 — subsequent sessions.** Batch implementation slices. Phase 2 calibration shows all 14 findings are positioning-priority; batching is by surface coherence, not severity. Likely shape (TBD at impl-scoping time):
- Batch (positioning fixes): F-TONE-01 + F-TONE-02 + F-TONE-03. Three quick string edits on three different files; could ship as one tone-positioning patch slice.
- Batch (CTA pass): F-TONE-04. Touches `lib/copy/o1.ts`, `o4.ts`, `o5.ts`, and `lib/build-plan.ts`. Coherent surface.
- Batch (build-plan.ts plan-output warmth): F-TONE-05 + F-TONE-06 + F-TONE-13. Adjacency in one file + cascade into F-TONE-03's note.
- Batch (chassis caption pass): F-TONE-08 + F-TONE-09 + F-TONE-10. O3-O5 caption surfaces.
- Batch (eyebrow + referent consistency): F-TONE-07 + F-TONE-14. Cross-screen consistency fixes.
- Batch (O7 inline polish): F-TONE-11 + F-TONE-12.

Each Phase 3 batch carries a structured copy/tone retro pass per CLAUDE.md §"Skip-walk + structured retro pattern" before declaring closure, applying the same lens this audit applies.

## Out of scope

- Implementation of any finding (Phase 3+).
- Visual treatment of copy (typography weight, italic accents, colour) — covered separately.
- Motion / animation tone — covered by spec 26 + delight-spec26-compliance slice.
- Post-signup surfaces (welcome tour, dashboard, profile flow).
- Marketing landing / pre-marketing pages.
- Form-validation / error-state copy (none currently rendered).
- Adaptivity-rule audit (covered by separate lens; e.g. housing-rule conservatism named in `S-PROTO-O7-adaptive-hooks/acceptance.md` §"Design decisions").
- Spec 65 literal-coverage audit (different lens).

## References

- CLAUDE.md §"North star (quality bar)" + §"Product rules" + §"Product positioning (preserve this across sessions)" (always-loaded).
- `docs/slices/S-PROTO-O7-copy-tone-pass/acceptance.md` — the precursor tone-pass on `build-plan.ts` that closed 3 strong findings + parked 4 mild ones (this slice surfaces them in cross-screen context as F-TONE-04..06 + F-TONE-03).
- `docs/slices/S-PROTO-O7-adaptive-hooks/acceptance.md` — the impl slice whose copy strings were the original retro surface.
- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` — sibling audit (density + delight lenses) that established the audit-slice prior-art pattern this slice mirrors.
- `src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts`-`o6.ts` (per-screen copy modules).
- `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` (dynamic O7 composition).
- `src/app/dev/proto/pre-signup-interview/screens/O7.tsx` + `O8.tsx` (screens with hardcoded inline copy).
- `src/app/dev/proto/pre-signup-interview/components/WhyWeAsk.tsx` (chassis primitive carrying the `'Why we ask'` hardcoded label).
