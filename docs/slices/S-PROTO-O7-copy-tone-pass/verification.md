# S-PROTO-O7-copy-tone-pass — verification

## Slice status

Implemented; awaiting merge.

Net diff: `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` +5/-5 (5 string-literal edits, no shape change) · `tests/unit/proto-pre-signup/build-plan.test.ts` +2/-2 (2 regex assertion updates: `/Each of you opens up/` → `/Each of you shares/`).

## Per-AC evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 `clean-break` priority note speaks to financial ties only | ✓ | `PRIORITY_NOTES['clean-break']` rewritten in `build-plan.ts`; children removed from the ongoing-ties parenthetical; replaced with `joint accounts, pensions, shared liabilities`. Children-related surfaces (`children-stability` priority note · `children` personalised note · `leadPhrase('children')`) unchanged. |
| AC-2 Solicitor-jab framing removed from 3 personalised-note bodies | ✓ | Three literal-string edits in `build-plan.ts`: `PRIORITY_NOTES['protect-pension']` (L87) · `WORRY_NOTES['losing-pension']` (L98) · `composePersonalisedNotes` self-employed note body (L178). Each replaces a comparative-with-others framing with user-focused phrasing per acceptance.md AC-2 table. Comparative framing remains in `STANDARD_CONVENTIONAL_PATH` body (positioning-level surface; out of scope). |
| AC-3 `composeWhatNeedsToHappen` substantive[0] verb swap | ✓ | `build-plan.ts` substantive[0] literal: `"Each of you opens up about what you own, owe, earn and spend."` → `"Each of you shares what you own, owe, earn and spend."`. Tests at `tests/unit/proto-pre-signup/build-plan.test.ts:232` + `:289` regex assertions updated from `/Each of you opens up/` to `/Each of you shares/`. |
| AC-4 No logic or shape change; full suite green | ✓ | `npm test`: 592/592 green across 84 test files (matches pre-edit baseline). `npm run typecheck`: clean. `npm run lint`: 0 errors, 48 pre-existing warnings unchanged. `composeXXX` function bodies, helper signatures, `PlanContent` schema, and trigger keys all unchanged. |

## Preview-deploy verification (spec 72a 6+1)

### Pre-walk evidence (resolved without browser)

- **Slice is pure-copy** — 5 string-literal edits + 2 regex updates; no logic change, no shape change, no new render surface, no animations, no focusable elements, no layout-impacting CSS.
- **O7.tsx rendering surface unchanged** — same `situationSummary` / `whatNeedsToHappen` / `personalisedNotes` / `links.primaryCTA` consumers as the prior slice's verification. Only the body strings change.
- **Apostrophes preserved as typographic `’` (U+2019)** — none of the edited strings introduce or change apostrophes; pre-existing partner-finance bodies (which contain typographic apostrophes) are not touched by this slice.

### 6+1 walk

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | ✓ (pre-walk) | All 5 edited strings exercised by the existing 42 unit tests via `buildPlanFromAnswers` golden-path scenarios. Visual fitness of the new copy strings gold-standard at browser walk; pre-walk acceptable per `prototype`-category convention. |
| Edge cases | ✓ (pre-walk) | Empty answers / tied scoring / lead-no-step / cap-and-overflow cases all unchanged from the prior slice's verification — same code paths, just different string contents. The 42 tests covering these branches all pass. |
| `prefers-reduced-motion` | ✓ (pre-walk) | No motion change. |
| Keyboard-only | ✓ (pre-walk) | No new focusable elements. |
| 375×667 mobile | ✓ (pre-walk) | String-length deltas: `clean-break` body grew by ~10 chars (parenthetical reword); `protect-pension` body grew by ~5 chars; `losing-pension` body shrank by ~10 chars; `self-employed` body grew by ~5 chars; `opens up` → `shares` shrank substantive[0] by ~12 chars. All within the per-string envelope of existing note bodies (longest pre-existing body is `partner-finance-unknown` at ~190 chars); no new reflow risk introduced. |
| Screen reader | ✓ (pre-walk) | Plain paragraph text; no markup changes; reading order unchanged. |
| +1 visual diff | N/A | Project has no visual-regression baseline tooling. |

## Security checklist (prototype short-form)

- [x] Item 1: No secrets, credentials, or sensitive defaults committed (5 string-literal edits + 2 test regex updates only).
- [x] Item 8: No new third-party dependencies introduced.
- [x] Item 12: No new external surfaces. `buildPlanFromAnswers` remains a pure function.
- [x] Item 14: No PII handling changes; user-typed `Answers` flow into `PlanContent` strings through the unchanged `composeXXX` paths.

## Architectural deferrals

- **4 mild findings parked** for the inherited tone audit Phase 1 priority. See `acceptance.md` §"Design decisions" item 3 for the list and rationale.
- **No DoD-14 changes** — `prototype` category short-form (items 1, 8, 12, 14) applies per CLAUDE.md §"Slice categories"; no escalation to full 14-item form needed.

## Definition of Done (prototype short-form)

- [x] Item 1: acceptance.md + verification.md present and accurate
- [x] Item 8: tests written + passing (2 test regex updates land alongside the 5 string edits; full suite 592/592 green; typecheck clean; lint 0 errors)
- [x] Item 12: preview-deploy 6+1 walk evidenced in this file (pre-walk evidence comprehensive across all 6 dims for a pure-copy slice; browser walk deferred per the `prototype` convention)
- [ ] Item 14: user feedback received + addressed (pending — captured in PR thread or session wrap)
