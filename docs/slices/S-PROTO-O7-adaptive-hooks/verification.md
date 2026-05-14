# S-PROTO-O7-adaptive-hooks — verification

## Slice status

Implemented; pre-walk 6+1 walk evidence populated; awaiting user confirmation to close DoD-14 and merge.

Net diff: `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` extended from 101 → 232 lines (+131; ~115 LoC of substantive new code, ~15 LoC of restructuring within existing functions). 6 new pure helpers + 2 new copy-string `Record<Priority|Worry, string>` constants; 3 existing `composeXXX` functions extended; `primaryCTA` swap from constant `'Continue'` to function-derived. Tests extended from 7 → 42 cases (+35 net). Net diff stays within the *"~75-120 LoC across `build-plan.ts`"* envelope from spec 65 §O7 amendment + parent slice AC-3 once copy-string tables are excluded — those are unavoidable per the new `priority-{value}` + `worry-{value}` per-value triggers.

Closes:
- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-01 + §F-OUT-02 (Status flips inline with this PR per `S-65-amendment-F-OUT-01-02` AC-7).
- `docs/slices/S-65-amendment-F-OUT-01-02/acceptance.md` AC-6 (PROVISIONAL → ✓) + AC-7 (OPEN → ✓) (Stage 4 of that slice's downstream landing plan).

## Per-AC evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 Dimension 1 (Stage) wired | ✓ | `composeWhatNeedsToHappen` in `build-plan.ts` calls `whatNeedsIntroForStage(answers.stage)` at function head; intro returned at items[0] of the result array (3 stage branches + default fallback). `primaryCTAForStage(answers.stage)` wired into `links.primaryCTA` in `buildPlanFromAnswers` (3 branches + `'Continue'` default). Existing 3-branch `composeSituationSummary` opening preserved verbatim. Tests: `Dimension 1 — Stage` describe block (8 cases) — all 4 stage-tuned intro/opening/CTA combinations exercised. |
| AC-2 Dimension 2 (Partner-finances awareness) wired | ✓ | `composePersonalisedNotes` extended with mutually-exclusive 3-branch switch on `answers.partnerFinances?.awareness`: `little`/`suspect` → existing `partner-finance-unknown` (preserved verbatim); `full` → new `partner-finance-full` (joint-prep + head-start framing); `some` → new `partner-finance-some` (caveated joint-prep + bank-evidenced fill-in framing). Tests: `Dimension 2 — Partner-finances awareness` describe block (4 cases) — including a mutual-exclusion assertion (only one `partner-finance-*` trigger per render). |
| AC-3 Dimension 3 (Example anchoring) wired | ✓ | `composeSituationSummary` extends children sentence with `childrenCount` (singular `1 child` / plural `N children` / fallback to existing copy when missing); appends a home-description sentence per `homeDescription(answers.situation?.home)` (mortgage / own-outright / rent strings; `other` → no sentence). `composePersonalisedNotes` adds capped `priority-{value}` + `worry-{value}` triggers from `priorities[0]` + `worries[0]` against `PRIORITY_NOTES` + `WORRY_NOTES` lookup tables (Record<Priority,string> + Record<Worry,string>; one entry per enum value). Tests: `Dimension 3 — Example anchoring` describe block (11 cases) — including singular/plural cardinality + cap assertions for both priority + worry. |
| AC-4 Dimension 4 (Lead-ordering) wired | ✓ | New `deriveLeadCategory(answers): 'children' \| 'housing' \| 'pensions' \| 'general'` helper applies coverage-weighted scoring per spec 65 §O7 L178-183; tied → hardcoded fallback children > housing > pensions > general. `composeSituationSummary` prepends `leadPhrase(category)` BEFORE the stage-conditional opening (`general` → empty string → no sentence prepended). `composeWhatNeedsToHappen` finds the lead-relevant substantive step (children-arrangements when `lead='children'` AND `hasChildren='yes'`; housing-decisions when `lead='housing'` AND `living='yes'`) and unshifts it to substantive position 0 (overall items[1] after the stage intro at items[0]). `pensions` + `general` → no reorder; lead phrase only applies to summary in those cases. Tests: `Dimension 4 — Lead-ordering` describe block (12 cases) — single-signal, multi-signal, tie-handling, no-signal, score-exclusion (rent/other don't contribute to housing), reorder-when-step-exists/skip-when-not. |
| AC-5 Unit tests cover all 4 dimensions + interactions | ✓ | `tests/unit/proto-pre-signup/build-plan.test.ts` extended from 7 → 42 cases (+35 net). 4 new describe blocks (one per dimension) each exercising the dimension's inputs and outputs against `buildPlanFromAnswers` directly — no mocks, no file-content assertions, pure input/output testing per CLAUDE.md §"Engineering conventions" §"Don't write file-content assertions for logic slices". Every existing test case still passes (the 7 baseline tests covered fall-through behaviour that the dimension-extensions are designed to preserve). |
| AC-6 No regression in adjacent slices | ✓ | `npm test -- --run` → 592/592 green across 84 test files. `npx tsc --noEmit` → clean (no output). `npm run lint` → 0 errors, 48 pre-existing warnings unchanged. EntryScaffold + WhyWeAsk + delight-spec26-compliance + output-reassurance slices (all merged) untouched. |
| AC-7 Preview-deploy 6+1 walk | ✓ (pre-walk) | All 6 dims populated below with code/test refs. Browser walk deferred per the prototype convention — partial walks accepted at merge time for `prototype`-category slices in this surface. |
| AC-8 Audit-slice + S-65-amendment cross-references closed inline | ✓ | `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-01 + §F-OUT-02 §Effect paragraphs + §Status table rows + §Workflow cross-link paragraph all updated in this PR. `docs/slices/S-65-amendment-F-OUT-01-02/acceptance.md` AC-6 (PROVISIONAL → ✓) + AC-7 (OPEN → ✓) + §Status footer updated in this PR. |

## Preview-deploy verification (spec 72a 6+1)

### Pre-walk evidence (resolved without browser)

- **The slice is pure logic** — `buildPlanFromAnswers` is a deterministic function from `Answers` → `PlanContent`. No DOM, no effects, no async. Logic correctness is validated by 42 unit tests; rendering correctness is bounded by what O7.tsx already does with the returned `PlanContent` (unchanged consumer surface).
- **No new render surface** — O7.tsx renders `situationSummary` (string) + `whatNeedsToHappen` (ReadonlyArray<string>) + `personalisedNotes` (ReadonlyArray<{trigger,body}>) + `links.primaryCTA` (string). All four shapes are unchanged; only their content varies.
- **No new animation rules** — adaptivity changes content text; section stagger / entry transitions / `prefers-reduced-motion` cascade all owned by O7.tsx and chassis layers, untouched.
- **No new focusable elements** — all new content is rendered as paragraph text inside existing section components.
- **Apostrophes preserved as typographic `’` (U+2019)** — partner-finance trigger note bodies match the pattern of the existing `partner-finance-unknown` body verbatim.

### 6+1 walk

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | ✓ (pre-walk) | Every `composeXXX` function exercised across stage / partner-finances / anchoring / lead permutations by 42 unit tests. Visual fitness of the per-state copy strings (priority + worry per-value bodies; lead phrases; intro phrases; per-stage primaryCTA) gold-standard at browser walk. |
| Edge cases | ✓ (pre-walk) | (a) Empty answers: `buildPlanFromAnswers({})` returns a fully-shaped plan (lead='general', no lead phrase, default stage opening + intro, no anchor notes, default `'Continue'` CTA). Asserted by the original `it('returns a fully-shaped plan even for empty answers')` test. (b) Tied scoring: hardcoded fallback children > housing > pensions > general — asserted by `it('genuine children-vs-housing tie → children fallback wins')`. (c) Lead category with no corresponding step (pensions; or children with hasChildren='no' but priorities=children-stability): lead phrase applies to summary; substantive items in default order — asserted by `it('priorities=[protect-pension] → pensions lead phrase, no whatNeedsToHappen reorder')` + `it('children lead with hasChildren=no does not reorder')`. (d) `home='other'` skips home sentence; `home='rent'` doesn't contribute to housing score — both asserted. (e) Combined anchor cap: max 1 priority + 1 worry note even when 3+ of each are selected — asserted. |
| `prefers-reduced-motion` | ✓ (pre-walk) | No motion introduced by this slice — content-only adaptivity. The chassis-level `@media (prefers-reduced-motion: reduce)` cascade owned by O7.tsx + section components is unchanged. OS-level browser walk gold-standard for the surrounding render. |
| Keyboard-only | ✓ (pre-walk) | Tab order unchanged — no new focusable elements added by this slice (content is rendered inside existing section components which are non-interactive paragraphs). Existing Footer CTA tab-order behaviour untouched; the new per-stage `primaryCTA` string flows through the same `<button>` consumed by O7.tsx unchanged. |
| 375×667 mobile | ✓ (pre-walk) | No layout-impacting CSS added: the slice is pure logic. New copy strings are short-to-medium sentences (longest priority/worry body is ~140 chars) that flow within existing paragraph containers; no fixed-pixel widths, no line-height overrides. Mobile-viewport browser walk would confirm no unexpected reflow with the longer combined `personalisedNotes` array (existing 4 + up-to-3 new from Dim 2 + Dim 3 = up to 7 notes vs prior max 4). |
| Screen reader | ✓ (pre-walk) | New content flows through the natural reading order of O7's `<section>` / `<p>` markup. No `role` / `aria-*` / `aria-hidden` introduced. `personalisedNotes` triggers are a logical ID (consumed by O7.tsx for note identity); their `trigger` field is not surfaced to the DOM. Hardware-SR (NVDA / VoiceOver) gold-standard for the longer note list. |
| +1 visual diff | N/A | Per spec 72a §"Out of scope" — no visual-regression baseline tooling. |

## Security checklist (prototype short-form per spec 72 §11)

- [x] Item 1: No secrets, credentials, or sensitive defaults committed (pure-logic extension + copy-string constants only).
- [x] Item 8: No new third-party dependencies introduced (TypeScript stdlib + local types only).
- [x] Item 12: No new external surfaces (network requests, file I/O, auth boundaries) — `buildPlanFromAnswers` is a pure function.
- [x] Item 14: No PII handling changes; user-typed `Answers` flow into `PlanContent` strings only via the existing `composeXXX` paths (no new fields read; no new sinks added).

## Architectural deferrals

- **V1.5 reservations** per spec 65 §O7 *"Out of scope"* L191-199: complexity dimension · vocab calibration · safety/conflict beyond `suspect` hook · additional anchor surfaces (`situation.relationship` / `relationshipQuality` beyond `safety-concern` / `selfEmployment` as summary anchor) · additional lead categories (`clean-break`, `ongoing-support`, `low-cost`, `speed`, `fair-split`). All deferred per spec 67 §Gap 11 L788 progressive-disclosure pattern; ship vehicle is the V1.5 backlog when the post-bank composition surface lands.
- **PlanContent shape change.** Out of scope per parent slice AC-3 Q2 lock for Dim 4 Approach B. Stage intro is rendered as items[0] of the existing `whatNeedsToHappen: ReadonlyArray<string>` field; future shape change to a separate framing-line slot is a render-side decision, not a build-plan one.
- **`whatNeedsToHappen` items[0] vs lead-step at "position 0" interpretation.** Resolved in slice acceptance.md §"Design decision": stage intro at items[0] is framing; lead-step at substantive position 0 (overall items[1]) when one exists. Documented inline so future readers (or a second amendment slice) can revisit if the framing line should move to its own field.

## Definition of Done (prototype short-form)

- [x] Item 1: acceptance.md + verification.md present and accurate
- [x] Item 8: tests written + passing (35 new tests; 592/592 suite green; typecheck clean; lint 0 errors)
- [x] Item 12: preview-deploy 6+1 walk evidenced in this file (pre-walk evidence comprehensive across all 6 dims; browser walk deferred per the prototype convention)
- [ ] Item 14: user feedback received + addressed (pending — captured in PR thread or session wrap)
