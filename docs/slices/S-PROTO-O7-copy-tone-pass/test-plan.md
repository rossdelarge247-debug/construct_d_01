# S-PROTO-O7-copy-tone-pass — test plan

## Test surfaces

This slice is pure-copy: 5 string-literal edits in `build-plan.ts` + 2 regex assertion updates in the existing test file. No new test surface is needed.

## Existing test coverage (unchanged, re-runs in CI)

- `tests/unit/proto-pre-signup/build-plan.test.ts` (42 cases across 7 describe blocks: baseline + Dimension 1 · Dimension 2 · Dimension 3 · Dimension 4 + cross-dimension scenarios)
- Full suite: 84 test files / 592 cases. Re-run locally: green pre-edit + green post-edit.

## Regex assertion updates (2)

Both updates are in `tests/unit/proto-pre-signup/build-plan.test.ts`:

| Line | Before | After |
|---|---|---|
| L232 (inside `it('priorities=[protect-pension] → pensions lead phrase, no whatNeedsToHappen reorder')`) | `expect(plan.whatNeedsToHappen[1]).toMatch(/Each of you opens up/)` | `expect(plan.whatNeedsToHappen[1]).toMatch(/Each of you shares/)` |
| L289 (inside `it('children lead with hasChildren=no does not reorder')`) | `expect(plan.whatNeedsToHappen[1]).toMatch(/Each of you opens up/)` | `expect(plan.whatNeedsToHappen[1]).toMatch(/Each of you shares/)` |

Both assertions exist to verify the `whatNeedsToHappen[1]` slot contains the substantive[0] item (i.e., that the lead-ordering reorder logic doesn't fire when no matching step exists). The fragment-regex character is unchanged — verb is the only word being asserted, and the new verb is sufficient to disambiguate the substantive[0] step from the other 5 substantive items in the array.

## What the tests DO NOT assert

The 8 PRIORITY_NOTES + 8 WORRY_NOTES body strings are not directly asserted against verbatim text in any test — tests assert trigger keys + that the relevant note is added, not the body content. The 3 personalised-note edits (protect-pension / losing-pension / self-employed) therefore don't need test updates. This is good test hygiene per CLAUDE.md §"Engineering conventions" §"Don't write file-content assertions for logic slices" — copy strings flow through pure functions; tests exercise the function, not the rendered prose.

## What's NOT in scope for testing

- Visual-regression / preview-deploy walks: pure-copy slice with no render-surface change; pre-walk evidence in `verification.md` §"Preview-deploy verification" is comprehensive.
- Tone-fitness automated assertion: tone-checking is a manual review surface (acceptance.md §"Design decisions") + a reviewer-prototype-readiness persona surface at PR review. Not test-tractable.
