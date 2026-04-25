# Session 30 — Handoff

**Branch shipped:** `main` · `5fa81a2` (S-B-1 squash-merge of #16) on top of `e9ca9a9` (session-29 wrap)
**PRs:** #16 merged
**Session date:** 2026-04-25
**Headline:** S-B-1 confirmation-questions copy-flip shipped — sole kickoff objective met. 22 src lines modified, 4 doc lines fixed, 22 vitest tests added (1 baseline fixture). TDD loop clean: 21 RED → 21 GREEN in one substitution batch. `pr-dod.yml` twice-clean — stable signal achieved.

---

## What shipped

### S-B-1 — confirmation-questions copy-flip (PR #16, merged at `5fa81a2`)

12 catalogued Cat-A rows in `src/lib/bank/confirmation-questions.ts` flipped to spec 73 §1 (`captured` / `ready to share`) + §3 (`add` empty-state) vocabulary. 19 unique substring substitutions covering 22 modified lines:

- §1 `captured / ready to share` accordion + status labels (rows A1, A2, A6 ×4, A7, A9, plus §1-portion of A3, A5, A10, A11, A12).
- §3 `add` empty-state list-section facts (rows A4 ×3, A8 ×3, plus §3-portion of A3, A5, A10, A11, A12).
- A6 catalogue↔file mismatch resolved: lines 1433–1435/1449 are `facts.push({ label: ... })` template-string entries, not literal accordion labels — applied §1.2 *as a substitution rule* (drop `disclosed`, use `captured`, preserve template structure, drop "ready to share" suffix where the original lacked it).

Cat-B preserved verbatim (5 disclos\* legal-process lines + 2 "starting position" MCA 1973 lines).

### Same-commit fix: `docs/SESSION-CONTEXT.md` 4-occurrence path-typo

Wrong path `src/lib/ai/recommendations.ts` (originated session 28, propagated through session-29 wrap) corrected to `src/lib/bank/confirmation-questions.ts` at lines 45, 64, 232, 235. Tracked in slice as AC-5 with its own vitest gate (T-5).

### TDD harness extended

`tests/unit/confirmation-questions-copy.test.ts` (114 lines, 22 tests across AC-1..AC-4) + `tests/unit/session-context-typo.test.ts` (26 lines, 2 tests for AC-5) + `tests/unit/fixtures/confirmation-questions-cat-b-baseline.txt` (7-line fixture, md5 `6ae2b0f218c663dfefab0b3912013ed2`). Boolean-wrapper assertion pattern (`expect(source.includes(needle)).toBe(true)`) introduced to keep vitest failure output terse — see Calibration data §.

### Slice docs frozen + filled

`docs/slices/S-B-1-confirmation-questions-copy-flip/` — acceptance.md (88L · 5 AC frozen 2026-04-25), test-plan.md (80L · 5 T entries), security.md (107L · 13-item checklist, §12 manual sweep findings recorded), verification.md (84L · DoD item 4 N/A documented).

## What went well

### TDD loop crisp from first try

Pre-edit: 21 RED + 1 GREEN (AC-3 Cat-B preservation, since fixture matched source pre-edit). Post-substitution-batch: 21 GREEN + 1 GREEN — no test churn, no flaky failures, no debugging round-trips. The boolean-wrapper assertion pattern (added after the first run hit a 1.3MB output dump) plus AC-3's fixture-driven preservation gate gave a clean signal throughout. First slice that ran TDD properly red-then-green; pattern is portable to the next copy-flip slice (A17–A20 in `recommendations.ts`).

### Kickoff verification caught a load-bearing typo before any `src/` touch

The kickoff said S-B-1's target file was `src/lib/ai/recommendations.ts`. A pre-scaffold grep against the audit-catalogue (line 137: *"`src/lib/bank/confirmation-questions.ts` holds 12 of the 20 `src/` Category-A rows"*) caught the wrong path. The kickoff had conflated the 12-row confirmation-questions cluster with the unrelated 4-row recommendations cluster (A17–A20). Without the verification, the slice would have either failed at "Read returns ENOENT" or — worse — touched the wrong cluster and shipped on the wrong file. **Quote-don't-paraphrase + verify-before-planning earned their keep here.**

### `pr-dod.yml` twice-clean — stable signal

S-F1 (PR #14) was the once-clean activation. S-B-1 (PR #16) is the twice-clean. Both produced clean check-runs on the slice-verification.md reference rule. The CI gate is now a reliable positive-path signal; subsequent `src/`-touching slices can rely on it without exception-flagging.

### Manual adversarial sweep was the right call for T0 Public copy

6 findings recorded in `security.md` §12 (diff surgical, Cat-B preserved, no injection vector, no banned terms introduced, no T4 surface, pre-existing `captured` uses audited). Zero concerns surfaced. Skill (`/security-review`) explicitly deferred — calibrated to UI/data/auth surfaces, manual fitter for copy slices. HANDOFF-29 obs continues to hold; lift to CLAUDE.md after a third confirmation in session 31.

## What could improve

### Planning-conduct lapse: typo carryover (resolved)

The wrong-path typo (`src/lib/ai/recommendations.ts`) originated in session 28's SESSION-CONTEXT P1-candidate line and I copy-paste-propagated it forward — through session-29's SESSION-CONTEXT-30 refresh and into session-30's kickoff prompt — without verifying against the audit-catalogue. *"Verify before planning"* + *"Quote, don't paraphrase"* both got skipped because the brief "felt right". Kickoff wasn't re-checked against source even though the audit-catalogue is the spec-of-truth for this slice. Distrust-own-summaries failure mode in real time.

The user surfaced this clearly mid-session. Logged here so session-31's wrap retro can capture the pattern: **kickoff prompts are a self-summary of a planning thought from N-1 sessions back; they rot exactly like everything else does.** AC-5's same-commit fix removed the typo from `SESSION-CONTEXT.md` so it doesn't re-propagate.

### Vitest dump-on-failure trap (resolved mid-session)

First test run produced 1.3 MB of console output because vitest's default reporter dumps the full received-value on `expect(haystack).toContain(needle)` failure — and the haystack was the 1998-line `confirmation-questions.ts`. Refactored to boolean-wrapper pattern (`expect(source.includes(needle)).toBe(true)`) so failure messages are *"expected false to be true"* — the test name carries the context. Pattern applies to any file-content assertion against a large source.

**Candidate CLAUDE.md or test-helper addition for session 31:** a tiny `tests/helpers/source-assertions.ts` module exporting `containsString(source, needle)` / `notContainsString(source, needle)` so the wrapper is reusable + discoverable. Or just a one-line CLAUDE.md note under Engineering conventions. Lift if S-B-2 (recommendations cluster) hits the same trap.

### `line-count.sh` hook calibration: still partially understood

Three patterns observed this session — `+N this change` reports modified-line count for in-place text changes (single Edits), `+0` for in-place same-length string Edits, `+N×2` for replace_all hitting N occurrences. The `+350` initial Edit-on-tracked-file reading from earlier in the session looks like a baseline-init artefact when the file transitions from untracked → tracked mid-session. **Not yet a clean model.** Need: another tracked-file-Edit-only session (no new untracked writes mid-session) to isolate the per-Edit accounting cleanly. Parking as candidate CLAUDE.md addition #5.

### Stream-idle-timeout struck on a planning text response

Mid-wrap, a single-Write attempt for the full HANDOFF (~250 lines target) timed out with *"Stream idle timeout - partial response received"*. Recovery: skeleton + Edit-append per HANDOFF-29's >150-line threshold. Discipline held; just consumed an extra round-trip. **No CLAUDE.md change needed** — the rule already says "default to skeleton for docs >~150 lines"; today was a discipline lapse, not a missing rule.

## Key decisions

- **Slice-named branch over harness-assigned name.** Harness landed me on `claude/fix-session-start-hook-XcyGN` — misleading for S-B-1 work. User granted explicit permission to branch off main as `claude/S-B-1-confirmation-questions-copy-flip` per spec 71 §7a. **Lesson: always check harness-assigned branch name against the work; ask before push if mismatched.**
- **5-AC structure (vs 4 or 6).** Splitting §1 (captured/share) and §3 (add) into separate AC made the substitution rules per-row traceable. AC-3 (Cat-B preservation) and AC-4 (banned-word audit) cross-validate each other via the fixture. AC-5 carved out the SESSION-CONTEXT typo as its own gate so the same-commit fix has a test gate, not just a manual diff.
- **4-occurrence SESSION-CONTEXT typo fix (not "one-line").** User originally framed the fix as "one-line"; pre-edit grep showed 4 occurrences (lines 45, 64, 232, 235). Surfaced the discrepancy + agreed to fix all 4 in AC-5. Half-fixing would have left the typo to re-propagate.
- **Manual adversarial sweep over `/security-review` skill.** Continued from HANDOFF-29 reasoning. T0 Public copy diff is small, fully reviewable inline (26 lines), and the skill is calibrated to UI/data/auth surfaces — manual sweep faster + more accurate.
- **Boolean-wrapper assertion pattern after the dump-on-failure trap.** Refactored mid-session rather than living with 1.3 MB output noise. Quick win: ~5 minutes of refactor saved every subsequent test cycle from being unreadable.
- **Skip retroactive `/review` on PR #14 (S-F1).** Stretch from session-29 retro. Deferred — value-time tradeoff unclear, and S-F1 already shipped clean. Park as session-32+ optional task; revisit if a foundation slice surfaces an issue traceable to S-F1.
- **Sequential P1 (welcome carousel) — not parallel.** User signal at session-30 pre-flight. Reduces context-switching cost and keeps each slice's TDD loop tight.
- **CLAUDE.md moratorium continues.** 3 candidates parked from HANDOFF-29 still parked. Session 30 surfaces 2 additional candidates (vitest boolean-wrapper helper + `line-count.sh` interpretation refinement). Total 5 parked. Revisit at session-31 wrap.
- **No slice-branch deletion.** `claude/S-B-1-confirmation-questions-copy-flip` exists locally + on origin post-merge. Destructive op — leaving for user's call. Convention TBD: delete at wrap, delete at next-slice-open, or never (let GitHub auto-delete).

## Bugs caught + fixed

1. **Kickoff target-file typo.** Wrong path `src/lib/ai/recommendations.ts` (recommendations cluster A17–A20) vs correct path `src/lib/bank/confirmation-questions.ts` (confirmation-questions cluster A1–A12). Caught via pre-scaffold grep against audit-catalogue. Fixed: scope locked to the correct cluster + AC-5 ships the SESSION-CONTEXT.md correction in the same commit so the typo doesn't survive past S-B-1 wrap.
2. **`src/lib/ai/recommendations.ts` does not exist.** Kickoff assumed it did. `ls src/lib/ai/` showed only `document-analysis.ts`, `extraction-prompts.ts`, `extraction-schemas.ts`, `pipeline.ts`, `plan-narrative.ts`, `provider.ts`, `result-transformer.ts`. The `recommendations.ts` file actually lives at `src/lib/recommendations.ts` (no `ai/` subdir). Caught immediately via diagnostic ls.
3. **Audit-catalogue A6 row classification mismatch.** Catalogue called lines 1433–1435/1449 *"accordion labels"* but the live code has them as `facts.push({ label: ... })` template-string entries with `${valueLabel}` / `${appLabel}` interpolations. Verbatim catalogue substitution would have broken the templates ("Savings account captured, ready to share£5,000" reads wrong). Resolution: applied §1.2 *as a substitution rule* — drop "disclosed", use "captured", preserve template structure, drop "ready to share" suffix where original lacked it. Documented in `acceptance.md` AC-1 implementation note.
4. **`node_modules/` not present at session start.** First `npm test` failed with `sh: 1: vitest: not found`. `npm ci` resolved (49 s, 512 packages, 2 moderate vulnerabilities pre-existing). Will recur on every fresh worktree — par for the course.
5. **Vitest dump-on-failure flooded console.** First test run produced 1.3 MB output because the default reporter dumps the full received-value on `.toContain()` failure. Refactored test files to boolean-wrapper pattern. ~5 minutes of refactor; output now ~50 lines per failed test instead of ~10,000.
6. **Initial Edit-on-tracked-file `+350` hook reading.** Misleading at the time (looked like the hook said "350 lines this change" for what was actually a 1-line Status edit). After more data points: looks like a baseline-init artefact when a file transitions untracked → tracked mid-session. Not a fix; a calibration learning. Logged for session-31 to confirm.

## Calibration data

### `line-count.sh` hook — refined model

Three accounting modes observed this session:

| Edit shape | Reported `+N this change` | Verified by |
|---|---|---|
| Single Edit, in-place text replacement (different content same line) | `+2` (1 add + 1 remove) | A1, A2, A3, A5, A7, A9, A10§1, A11§1, A12§1 (each +2) |
| Single Edit, in-place same-content same-line | `+0` | acceptance.md row updates (5 Edits, all +0) |
| `replace_all` Edit hitting N occurrences | `+N×2` | A4 ×4 (+8), A8 ×2 (+4), A10§3 ×2 (+4), A11§3 ×2 (+4), A12§3 ×2 (+4), SESSION-CONTEXT ×4 (+8) |
| First Edit-on-tracked-file in session, post-commit | anomalous `+350` (cumulative tracked-file delta) | acceptance.md status flip — likely a baseline-init artefact |

**Net interpretation:** the hook reports modified-line count for Edits (HANDOFF-29 obs #1 confirmed), with one known glitch on the first post-commit Edit-on-newly-tracked-file. **Action: parking as candidate CLAUDE.md addition #5 — revisit at session-31 wrap if pattern repeats once more for a clean refute or confirmation.**

### `pr-dod.yml` — twice-clean stable signal

| Activation | PR | Conclusion | Notes |
|---|---|---|---|
| First | #14 (S-F1) | success | Once-clean — provisional |
| **Second** | **#16 (S-B-1)** | **success** | **Stable: positive-path is reliable** |

Signal is now load-bearing for future `src/`-touching slices. CI gate can be relied on; reviewers don't need to manually check the slice-verification.md reference unless `pr-dod.yml` itself fails.

### TDD on logic-files via file-content assertions — viable pattern

Given a 1998-line logic library where decision-tree functions return objects with embedded copy strings, two test vectors were available:

1. **Functional invocation** — drive synthetic inputs through the decision-tree, inspect returned `accordionLabel` / `facts[].label`. More realistic; harder to set up; couples test to function signatures.
2. **File-content assertion** — read source file at test time, assert substring presence/absence. Decoupled from function signatures; easier to write; doesn't exercise actual code paths.

**Slice picked file-content assertion.** Rationale: AC outcomes are about file content correctness (per spec 73 §2 ban + §1 vocabulary substitution rules), not function-output correctness. Functional invocation would have added test surface without strengthening the AC gates. **Pattern is portable** to any future copy-flip slice; logged here so S-B-2 can pick the same shape immediately.

### Boolean-wrapper assertion idiom — adopt as default for file-content tests

```ts
const has = (needle: string): boolean => source.includes(needle)
expect(has('Income captured, ready to share')).toBe(true)
expect(has('disclosed, ready for sharing & collaboration')).toBe(false)
```

Vs the noisy form:

```ts
expect(source).toContain('Income captured, ready to share')  // dumps 1998 lines on failure
```

Both have identical AC coverage. Boolean wrapper produces *"expected false to be true"* on failure — test name carries the context. **Candidate for a `tests/helpers/source-assertions.ts` module if S-B-2 hits the same trap.**

## Forward-pointer for session 31

### CLAUDE.md candidate additions — now 5 parked

Moratorium continues. Parked candidates (lift only if pattern repeats):

1. **(from HANDOFF-29)** Claude Design URLs not WebFetch-able — note in CLAUDE.md visual-direction section so future sessions don't waste round-trips.
2. **(from HANDOFF-29)** AC arithmetic check — when slicing AC, verify `Σ in-scope rows = total rows` per audit-catalogue. Caught session-30's A6 mismatch but not as a discipline check.
3. **(from HANDOFF-29)** `line-count.sh` Edit-vs-net interpretation — captured this session as a refined model (see Calibration data §); needs one more session's data before lift.
4. **(NEW session 30)** Boolean-wrapper assertion idiom for file-content tests — see Calibration data §; lift if S-B-2 hits the same trap.
5. **(NEW session 30)** Kickoff prompts rot exactly like everything else — verify file paths, branch tips, and target identifiers against live source before scaffolding any slice. Caught session-30's typo, but the rule isn't yet codified.

### Next-slice candidates (in priority order)

| Rank | Slice | Cluster | Lines | Spec |
|---|---|---|---|---|
| **P0?** | **S-B-2 recommendations copy-flip** | A17–A20 in `src/lib/recommendations.ts` | ~4 rows | §73 §1 + §2.4 (A17 boundary case — retain "thorough disclosure" as legal-process; reframe narrative) |
| P1 | Welcome carousel slice | C-V2 anchor extraction | TBD (UI-touching, larger surface) | spec 68g C-V2 + Claude AI Design output |
| P2 | Other per-surface copy flips | 35 Cat-A rows queued in audit-catalogue | varies | spec 73 + audit-catalogue Part 2 |

Recommend session 31 start with P0 (S-B-2) — small, applies the same TDD pattern + boolean-wrapper helper, ships the third `src/`-touching slice (`pr-dod.yml` thrice-clean), and tackles the §2.4 boundary case (A17 retains "thorough disclosure" intentionally). Welcome carousel is a bigger ask — bigger UI surface, bigger AC set, real preview-deploy verification — and probably wants its own dedicated session.

### Branch hygiene

`claude/S-B-1-confirmation-questions-copy-flip` exists locally + on origin post-merge. Suggest deleting both at session-31 kickoff (or now, with explicit user OK). Same applies to any wrap-PR branches once merged.

### Pre-flight questions for session 31

1. Does S-B-2 (recommendations A17–A20) feel right as P0, or shuffle to welcome carousel (P1)?
2. Lift any of the 5 parked CLAUDE.md candidates now, or hold moratorium another session?
3. Run `/review` skill on PR #14 (S-F1) retroactively — still parked from session 29; still skip, or run now?
4. Delete merged slice branches (`claude/S-B-1-confirmation-questions-copy-flip`) — yes / no / let GitHub auto-delete?
5. Add a `tests/helpers/source-assertions.ts` module (lift candidate #4) — net-new helper or wait for second use?

## Numbers

| Metric | Value |
|---|---|
| Commits on slice branch | 3 (`fbc3678` scaffold · `229c3e2` AC freeze · `d8bcdd2` slice ship) |
| Squash-merge on main | `5fa81a2` (#16) |
| `src/` lines modified | 22 (in `src/lib/bank/confirmation-questions.ts`) |
| Doc lines fixed (typo) | 4 (in `docs/SESSION-CONTEXT.md`) |
| Slice doc lines | 359 (acceptance 88 · test-plan 80 · security 107 · verification 84) |
| New tests | 22 (across 2 files + 1 fixture) |
| Total vitest count post-slice | 30/30 green (8 pre-existing + 22 new) |
| CI checks on PR #16 | 10/10 green |
| `pr-dod.yml` activations | 2 (S-F1 once-clean · S-B-1 twice-clean) |
| Adversarial sweep findings | 6, all addressed (no concerns) |
| `npm audit` high+critical | 0 (2 moderate pre-existing) |
| Banned-word audit (`disclos*`) post-edit | 5 (all Cat-B legal-process, AC-3 fixture-locked) |
| Session churn (cumulative est.) | ~750 lines (slice ship + wrap docs combined) |
| Session length | Single chat, multi-hour wall |
