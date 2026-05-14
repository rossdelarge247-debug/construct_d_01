# S-PROTO-O7-copy-tone-pass

**Category:** prototype

Copy-only tone pass on `build-plan.ts` strings. Five string fixes addressing three structural tone observations surfaced during a post-merge retro on the `S-PROTO-O7-adaptive-hooks` impl. No logic change; no schema change; no shape change.

## Spec sources

- CLAUDE.md §"North star (quality bar)": *"The experience should feel like having a brilliant, patient analyst sitting beside you through the whole separation"*.
- CLAUDE.md §"Product rules": *"'A warm hand on a cold day' — compassionate, professional, never patronising"*.
- CLAUDE.md §"Product positioning": Decouple-vs-solicitor framing is correct at positioning level, but user-facing personalised notes should lead with user benefit rather than comparative-with-others framing.

## Interpretation

Three tone observations from the post-merge retro mapped to five string edits:

1. **`clean-break` priority note listed children alongside financial ties.** The parenthetical `"(joint accounts, pensions, children)"` lumped children into a list framed as "ongoing ties [needing] definite resolution" — emotionally cold for a divorce product, since children aren't a tie to be dissolved. The `children-stability` priority + the `children` personalised note handle that surface separately and well.
2. **Solicitor-jab pattern repeated three times across personalised notes.** `protect-pension` ("DIY divorces"), `losing-pension` ("buried in solicitor jargon"), and the pre-existing `self-employed` note ("what solicitors charge most for") all leaned on comparative-with-others framing. Per CLAUDE.md §"North star" the analyst-companion tone is *"here's what Decouple does for you"* rather than *"here's why others fail you"*; the comparative work belongs at hero/landing-page level, not inside the personalised-note surface where the reader is mid-interview.
3. **`composeWhatNeedsToHappen` substantive[0] verb "open up" leaned informal.** Appropriate for emotional disclosure; mismatched for financial disclosure. Direct verb swap to `"shares"` preserves the warmth while fitting the disclosure-step register.

## Acceptance criteria

### AC-1 `clean-break` priority note speaks to financial ties only

`build-plan.ts` `PRIORITY_NOTES['clean-break']` rewritten so children no longer appear in the ongoing-ties parenthetical. New string: *"Because a clean break matters most to you, Decouple shows where ongoing financial ties — joint accounts, pensions, shared liabilities — need definite resolution."*

Children-related concerns continue to be addressed by:
- `PRIORITY_NOTES['children-stability']` (the priority-as-children note);
- the `'children'` personalised note in `composePersonalisedNotes` when `hasChildren === 'yes'`;
- the `'Keeping things steady for the children comes first in your plan.'` lead phrase via `leadPhrase('children')`.

### AC-2 Solicitor-jab framing removed from 3 personalised-note bodies

Three string edits remove "DIY divorces" / "buried in solicitor jargon" / "solicitors charge most for" comparative framing, replacing each with user-focused phrasing:

| Trigger | Before | After |
|---|---|---|
| `priority-protect-pension` (`PRIORITY_NOTES`) | *"often missed in DIY divorces"* | *"clearly, so nothing important slips past"* |
| `worry-losing-pension` (`WORRY_NOTES`) | *"not buried in solicitor jargon"* | *"so you can see them yourself"* |
| `self-employed` (literal note in `composePersonalisedNotes`) | *"often the part of disclosure that solicitors charge most for"* | *"often the part of disclosure that gets most easily overlooked"* |

Comparative Decouple-vs-solicitor framing remains correct at CLAUDE.md §"Product positioning" level (the pillar `"Shared, not adversarial"` + the `STANDARD_CONVENTIONAL_PATH` body which contrasts the solicitor journey with Decouple's) — that surface is not in scope.

### AC-3 `composeWhatNeedsToHappen` substantive[0] verb swap

`build-plan.ts` substantive array first item rewritten: *"Each of you opens up about what you own, owe, earn and spend."* → *"Each of you shares what you own, owe, earn and spend."*

Tests `'priorities=[protect-pension] → pensions lead phrase, no whatNeedsToHappen reorder'` (L228-233) + `'children lead with hasChildren=no does not reorder'` (L286-290) regex assertions updated from `/Each of you opens up/` to `/Each of you shares/`.

### AC-4 No logic or shape change; full suite green

- `composeXXX` function bodies unchanged in shape; only PRIORITY_NOTES / WORRY_NOTES / `composePersonalisedNotes` literal string + `composeWhatNeedsToHappen` substantive[0] literal string edited.
- `PlanContent` shape unchanged.
- `npm test`: 592/592 green (84 test files).
- `npm run typecheck`: clean.
- `npm run lint`: 0 errors, 48 pre-existing warnings unchanged.

## Design decisions

1. **Children dropped from `clean-break` parenthetical, not relocated.** The two alternatives considered: (a) keep children but reframe the surrounding sentence; (b) drop children and rebalance the list with `shared liabilities`. Picked (b) because (a) requires inventing a new copy frame for what happens to be a well-covered surface elsewhere (3 separate other surfaces handle children); whereas (b) reads as a precise financial-clean-break statement without competing with the children-stability surface.

2. **`self-employed` note edited despite being pre-existing.** The audit slice scope is tonal-fitness (does the string serve `"warm hand on a cold day"` + `"brilliant, patient analyst"`?), not authorship date. The pre-existing `self-employed` note repeats the same solicitor-jab pattern as `protect-pension` and `losing-pension` — fixing it inline with the pattern is cheaper than leaving it for a future tone-audit Phase 1 to surface again. `composePersonalisedNotes` itself wasn't extended in PR #184; only its conditional bodies were appended to. The literal-string edit doesn't change function shape.

3. **Lead-phrase + CTA + home-description mild findings deferred.** Four mild findings from the retro parked for the inherited tone audit Phase 1 priority: `primaryCTAForStage('decided') = 'Continue'` anodyne · `leadPhrase('housing'|'pensions')` flatter than `children` · `homeDescription('mortgage')` clinical · `ongoing-support` priority-note analyst-jargon. Bundling them into the same slice would push slice surface beyond a clean copy-fix patch; the tone audit Phase 1 work is the structured place for that broader pass.

## Out of scope

- Logic/shape changes to `build-plan.ts` (helper signatures, `composeXXX` returns, `PlanContent` schema).
- Tone work on screens other than O7 (which is the consumer of `PlanContent`).
- Tone work on chassis primitives (TopBar / Hero / Footer / EntryScaffold / WhyWeAsk / Reassurance) — owned by their respective slices.
- The 4 mild findings from the post-merge retro — parked for the inherited tone audit Phase 1 priority.

## Closes / cross-references

- No upstream audit-slice row to flip — this slice originated from a post-merge retro lens, not from an entry catalogued in `S-PROTO-pre-signup-density-delight-audit`.
- Tone-audit Phase 1 carries forward as an inherited priority in `docs/SESSION-CONTEXT.md` — this slice does not close it; tone-audit Phase 1 is a structural cross-screen lens, distinct from this copy-string patch.
