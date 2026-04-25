# HANDOFF — Session 31

**Branch:** `claude/S-B-2-recommendations-copy-flip` (slice, merged) → `claude/session-31-wrap` (this branch)
**Slice shipped:** S-B-2 recommendations copy-flip (PR #18, merged as squash `1e1c558`)
**Wrap PR:** TBD (this branch's PR, opened at end of wrap)
**Date:** 2026-04-25

---

## What shipped

**S-B-2 recommendations copy-flip — third `src/`-touching slice.**

4 surgical Cat-A copy-flips in `src/lib/recommendations.ts` (rows A17–A20 per S-C-U4 audit-catalogue lines 82–85):

- **A17** (`:163`, §2.4 boundary) — `'thorough disclosure'` → `'thorough, formal disclosure'` (one-word `'formal'` insertion anchors the legal-process register; echoes Cat-B line 60 phrasing).
- **A18** (`:166`, §1) — `'stronger position for any negotiation or disclosure'` → `'stronger foundation for any negotiation or submission'`.
- **A19** (`:196`, §1, **amended this slice**) — `'the stronger your position in any discussion or mediation'` → `'the more it strengthens your picture going into any discussion or mediation'`. The amendment swapped the `'stronger'` adjective for a `'strengthens'` verb form to preserve the "the more X, the more Y" parallel construction. Audit-catalogue row A19 amended in standalone commit `05e87f1`.
- **A20** (`:215`, §2 exception) — `'organising your disclosure'` → `'organising your Form E submission'`.

Plus: `tests/helpers/source-assertions.ts` lifted (HANDOFF-30 candidate #4, second use); 12 vitest tests (4/4/1/3 across AC-1..AC-4); `tests/unit/fixtures/recommendations-cat-b-baseline.txt` for Cat-B line 60 byte-for-byte preserve.

Cat-B preserved verbatim: line 60 `'formal disclosure process'`. Cat-D unchanged: line 214 `serviceLink: 'share_and_disclose'` (per §2.4 condition 4).

**`pr-dod.yml` thrice-clean activation confirmed** (3-second pass on third positive-path activation). All 10 PR #18 CI checks green.

---

## What went well

1. **Pre-flight discipline held.** AskUserQuestion batched 4 pre-flight items at turn 0; all answered with recommended options; no scope drift.
2. **TDD loop crisp.** RED at commit `d47dfc7` (11 fail / 1 pass) → GREEN at commit `c0114a2` (12/12) — single test-side correction (the redundant `has('thorough disclosure')` assertion that broke against the comma in the frozen text). Implementation didn't need iteration.
3. **A19 amendment audit-trail clean.** Post-freeze copy change captured in three places: audit-catalogue row, acceptance.md review log, standalone commit `05e87f1`. No silent scope expansion.
4. **Helper lift on second use proved cheap.** `tests/helpers/source-assertions.ts` is 23 lines; introduces a small typed factory (`makeSourceAssertions`) that downstream copy-flip slices will pick up for free.
5. **Manual adversarial sweep continues to surface zero false positives** for T0 Public copy-only slices. Twice-deferred `/security-review` skill; if S-B-3 (next copy-flip) keeps the pattern, lift "manual sweep canonical for T0 copy-only" to CLAUDE.md.

## What could improve

1. **TDD vs regression-harness honesty.** The user-surfaced this on the back of external TDD reading. For copy-flip slices, our "TDD" is a regression-prevention assertion harness — the audit-catalogue + spec 73 drive design; tests verify the substitution landed. **This is fine for pure-string slices but is not test-driven design.** Captured by the new CLAUDE.md rule "Don't write file-content assertions for logic slices" + paired with this honesty in the wrap retro. The rule binds at S-F2 onward.
2. **A17 boundary judgment was a single point of human attention.** Disposition said "retain `'thorough disclosure'`"; my chosen reframe added a comma which broke the literal-substring preservation. Test-side caught it (the AC text in acceptance.md was correct; the test had a redundant assertion). Worth flagging that audit-catalogue dispositions phrased as "retain literal X" + a transformation that breaks literal X is a real failure mode worth watching.
3. **Line-count.sh first-Edit-on-newly-tracked-file anomaly is inconsistent.** Replicated the +398 anomaly on `acceptance.md` (92 lines actual → 398 reported, 4.3x factor) but DID NOT reproduce on `source-assertions.ts` (~24 lines → +23, 1.0x factor). One model isn't yet enough; need another session before locking the calibration. Candidate stays parked.

## Key decisions made

1. **A19 amend post-freeze.** User-surfaced after AC freeze that `'stronger'` adjective reads off with the `'picture'` metaphor. Three options offered; user chose "preserve `the more X, the more Y` shape" with verb `'strengthens'`. Captured as standalone commit + acceptance.md review log + audit-catalogue amendment.
2. **A17 reframe shape: minimal-touch one-word `'formal'` insertion.** User-frozen at AC freeze. Echoes the existing Cat-B legal-process phrasing at line 60 (`'formal disclosure process'`). Heavier alternatives (full rewrite, `'full and frank disclosure'`) considered and rejected as over-touching the disposition's "retain" instruction.
3. **Lift `tests/helpers/source-assertions.ts` net-new (HANDOFF-30 candidate #4).** Second use justified extraction; the inline boolean-wrapper pattern from S-B-1 became a typed factory. Downstream copy-flip slices import it for free.
4. **3 CLAUDE.md candidate additions lifted this session.** See "CLAUDE.md candidate additions status" below.
5. **Bundle CLAUDE.md lifts into wrap PR (not a separate small PR).** Keeps PR #18 tight to the slice surface; wrap PR is the natural slot per session-30 precedent.
6. **Merge PR #18 via MCP, then proceed with wrap.** User-authorised single uninterrupted run.

## Bugs found and how fixed

1. **Test had over-asserting `has('thorough disclosure')` after AC-2.** The frozen AC text is `'thorough, formal disclosure'`; the comma breaks the literal-substring assertion. Fix: drop the redundant assertion. The first assertion (`has('thorough, formal disclosure')`) already verifies the precise frozen text. Caught at GREEN-confirmation step (12/12 pass after the fix; 1-line trim).
2. **No other bugs.** TDD loop didn't surface any implementation errors; per-row Edits applied surgically.

## Calibration data

- **`pr-dod.yml` thrice-clean.** S-F1 (#14, once) → S-B-1 (#16, twice) → S-B-2 (#18, thrice). All passed in 3-4s. Stable signal achieved for the DoD CI gate.
- **`line-count.sh` observations:**
  - Single-line tracked Edits: `+2` per Edit (1 add + 1 delete = modified-line × 2). Confirmed.
  - Multi-Edit batch (4 sequential Edits to recommendations.ts): each reported `+2`, cumulative `+8` tracked. Consistent.
  - Edit on **untracked** file (newly created, post-`git add` but pre-commit): `+0`. New observation — was unclear in HANDOFF-30.
  - First Write to a newly-tracked file (acceptance.md, 92 lines actual): reported `+398`. Replicates the HANDOFF-30 `+350` anomaly. Anomaly factor ~4.3×.
  - First Write to a newly-created file in a different new directory (source-assertions.ts at `tests/helpers/`, ~24 lines): reported `+23`. **No anomaly fired here.** This contradicts a clean "first-Write inflates" model — anomaly is inconsistent. Need another session to isolate the trigger.
- **vitest first-time install via `npx`:** ephemeral copy doesn't see project's `vitest/config`; must run `npm install` once before `npm test` works in a fresh clone. Worth a note in any onboarding doc; not a CLAUDE.md rule yet.
- **Stream-idle-timeout:** zero triggers this session. Largest single Write was `acceptance.md` at 92 actual lines (well under the ~150-line skeleton threshold). Slice docs (security/verification/test-plan) at ~85-108 lines each — also fine.

---

## CLAUDE.md candidate additions status

Inheriting 5 from HANDOFF-29 + HANDOFF-30. Triaged this session:

| # | Candidate (verbatim from HANDOFF-30 §"5 parked") | Outcome |
|---|---|---|
| 1 | Claude Design URLs not WebFetch-able — note in CLAUDE.md visual-direction | **Lifted** as `**Source files repo-committed, not URL-fetched.**` paragraph in §"Visual direction" |
| 2 | AC arithmetic check (`Σ in-scope rows = total rows`) | **Lifted** as `**AC arithmetic check.**` paragraph in §"Engineering conventions" |
| 3 | `line-count.sh` Edit-vs-net interpretation refined model | **Deferred to session 32.** Session-31 data is inconsistent (anomaly fired on `acceptance.md`, did NOT fire on `source-assertions.ts`). One more session needed for clean refute or confirmation |
| 4 | Boolean-wrapper assertion idiom | **Closed.** Helper now exists at `tests/helpers/source-assertions.ts`; the artefact IS the rule |
| 5 | Kickoff prompts rot — verify paths/tips against live source | **Closed.** Already covered by existing Planning conduct § "Verify before planning" |
| 6 | **(NEW session 31)** Behavioural over content for logic slices | **Lifted** as `**Don't write file-content assertions for logic slices.**` paragraph in §"Engineering conventions" |

**New candidate parked from session 31:**

7. **`tdd-guard` hook spec.** PreToolUse hook on Write/Edit to `src/` that runs the affected test file and refuses on RED. Closes the "I forgot to run tests locally" gap (CI catches it eventually but local hook is faster signal). Implementation slot at the next infra session — analogous to session-27's 4-hook sprint. Spec inputs: which test file maps to which `src/` path; whether to gate on full suite or scoped; failure UX. Sourced from external TDD reading (claude-world.com TDD workflow article).

**Forward-pointer for session 32:** 2 candidates parked (#3 line-count refined model · #7 tdd-guard hook spec). #3 lifts after one more session's data; #7 implements at next infra session.

## Forward-pointer for session 32

**Default P0:** Next copy-flip slice if pattern continues — candidates per audit-catalogue Cat-A queue (35 rows total; S-B-1 closed 12, S-B-2 closed 4, **19 remaining** distributed across `discovery-flow.tsx`, `constants/index.ts`, `use-workspace.ts`, `result-transformer.ts`). Suggest **S-B-3 result-transformer copy-flip** as next P0 (the largest remaining cluster); confirm at session-32 kickoff.

**Default P1:** Welcome-carousel slice (still unblocked from S-F1 tokens; same as session 31's parallel candidate).

**Watch items for session 32:**

1. **`line-count.sh` calibration completion.** Need another tracked-file-Edit-only session to isolate the first-Write anomaly trigger. If pattern still inconsistent, candidate #3 stays parked or closes as "intentional inconsistency we live with".
2. **`pr-dod.yml` four-clean** if S-B-3 ships.
3. **Manual-vs-skill adversarial gate** for T0 Public copy slices. If S-B-3 keeps the pattern, lift "manual sweep canonical for T0 copy-only" to CLAUDE.md.
4. **First behavioural-test slice.** When the next non-copy-flip slice opens (S-F2 likely, depending on the slice catalogue), exercise the new CLAUDE.md rule "Don't write file-content assertions for logic slices" — it'll be its first real test.

## Open questions for next session's kickoff

1. S-B-3 P0 confirmed, or different priority?
2. tdd-guard hook implementation: this session, or batch with other infra at the next dedicated infra slot?
3. If `line-count.sh` calibration is still inconsistent after one more session, close candidate #3 as "intentional" or hold?
