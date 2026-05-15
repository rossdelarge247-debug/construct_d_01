# S-PROTO-copy-resolver-sweep — Verification

## AC-1 — O2 `ctaLabel` resolver-sourced

**Status:** met.

**Evidence:** `git diff` of `lib/copy/o2.ts` (interface + return added `cta: { label: 'Continue' }`) and `screens/O2.tsx:205` (`ctaLabel="Continue"` → `ctaLabel={copy.cta.label}`). Per-screen render test `o2-canvas-as-source.test.tsx` continues passing (Footer renders the CTA literal `'Continue'` unchanged from the user's POV).

## AC-2 — O3 `ctaLabel` resolver-sourced

**Status:** met.

**Evidence:** `git diff` of `lib/copy/o3.ts` (interface + return added `cta: { label: 'Continue' }`) and `screens/O3.tsx:291` (`ctaLabel="Continue"` → `ctaLabel={copy.cta.label}`). Per-screen render test continues passing.

## AC-3 — O7 resolver authored; 20 strings moved

**Status:** met.

**Evidence:**

- NEW file `src/app/dev/proto/pre-signup-interview/lib/copy/o7.ts` (90 LoC): interface + `getCopy(stage)` function. Covers hero (4 fields), actions (3 fields), sections (6 entries: 4 with title + 2 eyebrow-only + notes with sub), reassurance (1 string), generating state (eyebrow + split heading + helper + ariaLabel + 5-step array + workingIndicator + quote).
- `screens/O7.tsx` `git diff`: 17 hardcoded string positions replaced with `copy.{path}` references. Component signatures updated to accept resolver-derived props:
  - `MobileHero` now takes `copy: O7Copy` (was no props)
  - `SituationSummary`, `DivorceJourney`, `WhatNeedsToHappen`, `ConventionalPath`, `DecoupleHelps`, `PersonalisedNotes` each take `headerCopy` prop with the matching section copy
  - `Reassurance` now takes `body: string` (was no props)
  - `MobileGeneratingView` now takes `copy: O7Copy['generating']`
  - `MobileReadyView` now takes `copy: O7Copy` (passed down to children)
  - Module-scope `DISCLOSURE_STEPS` constant deleted (moved to resolver as `generating.steps`)
  - Local `DisclosureState` type alias deleted (replaced by `LoadingStepState` exported from resolver)
- NEW test file `tests/unit/proto-pre-signup/copy-resolver-o7.test.ts` (22 tests): asserts each field value verbatim — hero × 4 · actions × 3 · sections × 6 · reassurance × 1 · generating × 7. Plus stage-invariance test.

## AC-4 — `primaryCTA` wired into O7

**Status:** met.

**Evidence:** `git diff` of `screens/O7.tsx`:

```diff
-      <Footer
-        ctaLabel="What's next"
+      <Footer
+        ctaLabel={plan.links.primaryCTA}
```

`plan` is in scope at the Footer render (already constructed at the top of `MobileReadyView` via `buildPlanFromAnswers(answers)`). The Footer CTA becomes stage-specific per `primaryCTAForStage`: `thinking` → `'See what comes next'` · `decided` → `'Begin the plan'` · `in_process` → `'Pick up from here'` · default → `'Continue'`. Existing test cascade in `o7-canvas-as-source.test.tsx:99` and `output-reassurance.test.tsx:44` updated to match the new default-stage CTA literal `'Continue'`.

## AC-5 — O8 resolver authored; 20 strings moved

**Status:** met.

**Evidence:**

- NEW file `src/app/dev/proto/pre-signup-interview/lib/copy/o8.ts` (75 LoC): types + interface + `getCopy(stage)` function. Covers planRecall (2 fields), hero (eyebrow + heading + split helper × 2), options (4 entries × 3 fields = 12 strings), footer fallbacks (caption + cta).
- `screens/O8.tsx` `git diff`: 18 hardcoded string positions replaced with `copy.{path}` references. Module-scope `OPTIONS` constant + `OptionId` type + `OptionDef` type all deleted (moved to resolver as `O8OptionId` + `O8Option` + the `getCopy` `options` field). `PlanRecall` becomes parameterised — takes `copy: O8Copy['planRecall']`.
- NEW test file `tests/unit/proto-pre-signup/copy-resolver-o8.test.ts` (13 tests): asserts each field value verbatim — planRecall × 2 · hero × 4 · options × 4 (each with id + title + sub + cta) · footer × 2. Plus stage-invariance test.

## AC-6 — Copy-resolver-invariant test passes

**Status:** met.

**Evidence:** NEW `tests/unit/proto-pre-signup/copy-resolver-invariant.test.ts`. Reads each `screens/O[1-8].tsx` file. Scans for:

- Family 1 — attribute hardcodes: `(eyebrow|heading|helper|title|caption|aria-label|ctaLabel|sub|placeholder)\s*=\s*"[A-Z][^"]+"` (and single-quoted equivalent).
- Family 2 — JSX text content: `>[A-Z][a-zA-Z][a-zA-Z'.,!?: \-]+<` plus `>[a-z]+\s[a-z]+\s[a-z]+[^<]*<`.

All 8 screen files pass. The slice ships with an empty allowlist; the regex covers the audit-walk gap surfaced at session-freeze + the mid-flight expansion.

## Definition of Done

- [x] **DoD-1** — All 6 ACs met with per-AC evidence above.
- [x] **DoD-8 (Item 8 — Error handling)** — N/A: pure-string structural move + one prop re-wire. `plan.links.primaryCTA` always populated by `primaryCTAForStage` (default case covers undefined stage).
- [x] **DoD-12 (Item 12 — Adversarial review)** — single-turn review (slice acceptance.md = 266 lines, under 300L threshold).
- [x] **DoD-14 (Item 14 — Secrets hygiene)** — `gitleaks` CI check verifies. No secrets in copy strings.

## Preview-deploy verification

Six-dimension contract: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport (375×667) · screen-reader.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | pending PR-review preview | Visual smoke on Vercel preview: O2 / O3 / O7 / O8 each render their copy unchanged (verbatim moves). O7's main CTA renders the stage-specific label from `plan.links.primaryCTA`. |
| Edge cases | pending PR-review preview | O7 with each `stage` value (thinking / decided / in_process / undefined) — CTA renders the expected label. O8 with selected option vs unselected — footer fallback renders correctly. |
| `prefers-reduced-motion` | N/A this slice | No motion change. |
| Keyboard-only | N/A this slice | No interactive surface change; identical CTA buttons + option cards. |
| Mobile viewport (375×667) | pending PR-review preview | Confirm stage-specific O7 CTAs fit button width on 375px. `'See what comes next'` (20 chars) is the longest of the four. |
| Screen-reader | N/A this slice | No structural change. O7 loading aria-label + O8 sr-only legend retain identical semantics (still single-source, now from resolver). |

Three dimensions (motion / keyboard / screen-reader) N/A — structural moves with zero render or interaction change. Three dimensions (golden / edge / mobile) need preview-deploy visual confirmation pre-merge.

## Persona findings recorded

Prototype-category slice; canvas-as-source default per CLAUDE.md §"Canvas-as-source"; no `Linked canvas:` field; canvas-fidelity persona dormant. Three personas at PR review: `reviewer-security` · `reviewer-prototype-readiness` (substitutes `reviewer-correctness`) · `reviewer-style`.

| Persona | Findings | Issue main missed |
|---|---|---|
| `reviewer-security` | TBD | TBD |
| `reviewer-prototype-readiness` | TBD | TBD |
| `reviewer-style` | TBD | TBD |
