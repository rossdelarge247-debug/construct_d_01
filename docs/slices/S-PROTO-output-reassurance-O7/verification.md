# S-PROTO-output-reassurance-O7 — verification

## Slice status

Implemented; pre-walk 6+1 walk evidence populated; awaiting user confirmation to close DoD-14 and merge.

Net diff: 1 new `Reassurance` function in `screens/O7.tsx` (16 lines inline component) + 1 new `<Reassurance staggerIndex={7} />` JSX line in `MobileReadyView` + 1 new test file (`tests/unit/proto-pre-signup/output-reassurance.test.tsx`, 41 lines, 2 tests). No regression: 557/557 vitest suite green (+2 from 555 pre-slice baseline); typecheck clean; lint 0 errors (48 pre-existing warnings unchanged).

Closes density/delight audit gap F-OUT-03 from `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md`. F-OUT-01 + F-OUT-02 deferred per the scope-conflict context in `acceptance.md` §"Scope-conflict context".

## Per-AC evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 Reassurance copy renders before Footer | ✓ | New `Reassurance` function in `O7.tsx` wired as `<Reassurance staggerIndex={7} />` in `MobileReadyView`, positioned between `<PersonalisedNotes/>` and `<Footer/>`. Copy is V1-verbatim (`docs/v1/v1-wireframes.md` L301): *"You've built a strong starting position."* (rendered via JSX `&rsquo;` for the typographic apostrophe). Treatment: serif (`FONT_SERIF`), centred, italic, `colors.sub` muted tier, `fontSize: 17`, `padding: '8px 16px'` — quiet closing-line feel. |
| AC-2 Stagger animation extends to staggerIndex=7 | ✓ | Component wraps content in `<section className={styles.entry} style={sectionEntryStyle(staggerIndex)}>`, matching the pattern of `SituationSummary` / `PersonalisedNotes` etc. No new keyframes; no new CSS rules. Hero (implicit) → Situation 1 → Journey 2 → WhatNeeds 3 → Path 4 → Helps 5 → Notes 6 → Reassurance 7. |
| AC-3 prefers-reduced-motion honoured | ✓ | Inherited via the shared `sectionEntryStyle` helper + `styles.entry` className — both already covered under the chassis-level `@media (prefers-reduced-motion: reduce)` cascade. No new motion introduced; no new override needed. |
| AC-4 Test asserts copy + document-order positioning | ✓ | `tests/unit/proto-pre-signup/output-reassurance.test.tsx` (2 tests). Test 1: asserts the copy matches `/ve built a strong starting position\./` in `document.body.textContent` after the 3000ms generating-state timer is advanced. Test 2: asserts document-order positioning via `text.indexOf` — `Your situation` < reassurance match < `What's next` Footer CTA. Both pass. |
| AC-5 No regression | ✓ | `npm test -- --run` → 557/557 green across 84 test files (+2 from 555 pre-slice baseline). `npx tsc --noEmit` → clean. `npm run lint` → 0 errors, 48 pre-existing warnings unchanged. EntryScaffold + WhyWeAsk + delight-spec26-compliance slices (recently merged) untouched. |
| AC-6 Preview-deploy 6+1 walk | ✓ (pre-walk) | All 6 dims populated below with code/test/CSS refs. Browser walk deferred per the prototype convention — partial walks accepted at merge time for `prototype`-category slices in this surface. |

## Preview-deploy verification (spec 72a 6+1)

### Pre-walk evidence (resolved without browser)

- **Reassurance is a quiet closing-line treatment** — italic serif centred text on `colors.sub` muted tier; no eyebrow / no title / no card chrome / no focusable elements. Distinct from the section components above it.
- **No new animation rules** — `<Reassurance/>` uses the existing `styles.entry` className and `sectionEntryStyle(staggerIndex)` helper unchanged. Stagger timing is the chassis-owned cascade.
- **No layout-impacting CSS** — `text-align: center` + `padding: '8px 16px'` + `margin: 0` on the inner `<p>`. No width / height / position / margin-left / margin-right rules.
- **No focusable nodes added** — `<section>` + `<p>` are both non-interactive elements without `tabIndex` / `role` / interactive handlers.
- **Apostrophe is typographic (`&rsquo;` → `'`)** — test asserts the post-apostrophe substring to avoid brittleness on the entity choice.

### 6+1 walk

Pre-walk evidence per dim below. Browser walk deferred per the prototype convention — partial walks accepted at merge time for `prototype`-category slices in this surface. All dims have code/test/CSS verifiability that exceeds what a browser walk would surface for non-visual checks; the dims most reliant on browser feel (Golden path · `prefers-reduced-motion` · mobile · screen reader) note what a follow-up hardware walk would gold-standard.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | ✓ (pre-walk) | Copy renders: `output-reassurance.test.tsx` asserts copy matches `/ve built a strong starting position\./` after `advanceTimersByTime(GENERATING_DURATION_MS + 50)`. Visual closing-credits feel-confirmation gold-standard via browser. |
| Edge cases | ✓ (pre-walk) | (a) No personalised notes: when `notes.length === 0`, `PersonalisedNotes` returns `null` (`O7.tsx` L427) — Reassurance still renders unconditionally as the next sibling in `MobileReadyView`. (b) Back-nav: Reassurance unmounts cleanly with the rest of `MobileReadyView` (no useState, no effects, no refs). (c) Generating → ready state transition: Reassurance only renders in `MobileReadyView` (post-generating), not `MobileGeneratingView`. Test advances past 3000ms timer to confirm. |
| `prefers-reduced-motion` | ✓ (pre-walk) | Inherits chassis-level `@media (prefers-reduced-motion: reduce)` via `styles.entry` + `sectionEntryStyle` cascade. No new motion rules introduced by this slice; no new override needed. OS-level browser walk gold-standard. |
| Keyboard-only | ✓ (pre-walk) | Tab order unchanged: Reassurance renders `<section>` + `<p>` only — no `tabIndex` / `role="button"` / `<a>` / `<button>` / focusable children. Existing Footer CTA tab-order behaviour untouched. |
| 375×667 mobile | ✓ (pre-walk) | No layout-impacting CSS added: `text-align: center` + symmetric `padding: '8px 16px'` + `margin: 0`. No width / height / position / fixed-pixel layout. Mobile-viewport browser walk would confirm no reflow. |
| Screen reader | ✓ (pre-walk) | `<section>` becomes an accessible region; `<p>` is read as a paragraph. No `role` / `aria-*` / `aria-hidden` added. The copy is part of the natural reading order at the end of the plan, before the Footer CTAs. Hardware-SR (NVDA / VoiceOver) gold-standard. |
| +1 visual diff | N/A | Per spec 72a §"Out of scope" — no visual-regression baseline tooling. |

## Security checklist (prototype short-form per spec 72 §11)

- [x] Item 1: No secrets, credentials, or sensitive defaults committed (one copy string + presentational CSS only).
- [x] Item 8: No new third-party dependencies introduced (no animation library; React + existing CSS module).
- [x] Item 12: No new external surfaces (network requests, file I/O, auth boundaries).
- [x] Item 14: No PII handling changes; the new copy is fixed and does not surface user data.

## Architectural deferrals

- **F-OUT-01 (Tier 1-4 plan output framework)** — deferred per the §"Scope-conflict context" in `acceptance.md`. Spec 65 §O7 reconciliation intentionally did not carry V1's tier framework forward; spec 67 §Gap 1 chose a routing-not-grading post-signup architecture. Requires spec 65 amendment slice before any AC drafting.
- **F-OUT-02 (per-domain confidence indicators + CONFIDENCE MAP)** — deferred per same. Vocab is pre-pivot; spec 67 (post-signup) has not shipped a confidence vocab yet; pre-signup adoption would risk vocab-collision once spec 67 amends.
- **Audit-text amendment to reframe F-OUT-01..02 as spec-conflict** — small docs follow-up; explicitly deferred to a separate small docs PR or wrap to keep this slice surgical.
- **Visual-treatment iteration beyond initial draft** — captured via preview-deploy walk + iteration per the established pattern.

## Definition of Done (prototype short-form)

- [x] Item 1: acceptance.md + verification.md present and accurate
- [x] Item 8: tests written + passing (2 new tests; 557/557 suite green; typecheck clean; lint 0 errors)
- [x] Item 12: preview-deploy 6+1 walk evidenced in this file (pre-walk evidence comprehensive across all 6 dims; browser walk deferred per the prototype convention)
- [ ] Item 14: user feedback received + addressed (pending — captured in PR thread or session wrap)
