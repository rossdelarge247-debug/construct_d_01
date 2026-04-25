# S-TOOL-1 · line-count session-base + branch-resume guard — Acceptance criteria

**Slice:** S-TOOL-1-line-count-branch-resume
**Spec ref:** CLAUDE.md §"Session discipline" (line-count thresholds) + §"Branch" (resync recipe) + carry-forward CLAUDE.md candidates #3 (line-count refined model) + #12 (Branch-resume check)
**Phase(s):** Tooling / harness — no `src/` impact; touches `.claude/hooks/` + `CLAUDE.md` + `tests/unit/`
**Status:** Approved · In implementation

---

## Context

`line-count.sh` (session 27 P0.1) and `session-start.sh` (session 25) both leak across multi-session feature branches. Two concrete failures observed:

1. **line-count.sh measure-vs-main bug.** The hook computes `git diff --numstat origin/main`, which counts every commit on the working branch — including those inherited from prior sessions. Branch `claude/S-F7-alpha-contracts-dev-mode` ended session 33 at 7,262 additions / 47 deletions vs main; line-count reported that figure, not session-34 churn. Inflates the count, masks the wrap thresholds (1,000 / 1,500 / 2,000), and forces manual `git diff <session-start-sha> --stat` workaround (per SESSION-CONTEXT § Session discipline).

2. **session-start.sh branch-resume gap.** Harness occasionally lands on an auto-generated suffixed branch (`claude/<slug>-<5alphanumeric>$`) when the canonical non-suffixed branch already exists on origin. Sessions 33 and 34 both hit this (occurrence 1 + 2 of CLAUDE.md candidate #12). Recovery is mechanical and known, but the hook doesn't surface the warning at turn 0, so each session's first ~5 minutes goes to manual `mcp__github__list_branches` + diagnosis.

This slice fixes both, lifts CLAUDE.md candidate #12 to Planning conduct §, and adds vitest hook coverage so neither bug regresses silently.

## Dependencies

- **Upstream slices:** none (tooling layer; no slice prerequisites)
- **Open decisions required:** none
- **Re-use / Preserve-with-reskin paths touched:** none (hooks-only)
- **Discarded paths deleted at DoD:** none

## MLP framing

The loveable floor: a session can know within turn 0 whether its branch is canonical or orphaned, and within turn 1 whether its line-count is session-authored or branch-inherited — no manual diagnosis, no workaround commands, no surprise during wrap.

---

## AC-1 · Session-base SHA captured at turn 0

- **Outcome:** `session-start.sh` writes the current `HEAD` SHA to `/tmp/claude-base-${SESSION_ID}.txt` on first invocation per session. Idempotent — the file is preserved across `source=resume` and `source=clear` SessionStart re-invocations within the same `session_id` (via `[ ! -f ]` guard).
- **Verification:** `tests/unit/hooks-session-start.test.ts` exercises the hook against a synthetic git repo with a known HEAD; asserts the base file is written with the correct SHA on first run; asserts a second invocation does not overwrite a stale base.
- **In scope:** capture-on-first-run + resume/clear preservation + valid SHA written to the deterministic path.
- **Out of scope:** cleanup of stale base files (Claude Code does not currently expose a SessionEnd hook in this project; let `/tmp` rotation handle it).
- **Opens blocked:** none.
- **Loveable check:** the user never sees this AC directly — but the count they DO see (AC-3) becomes accurate because of it. Floor met.
- **Evidence at wrap:** test row + line refs.

## AC-2 · session-start.sh detects suffix-orphan + surfaces resync recipe

- **Outcome:** when `BRANCH` matches `^claude/.+-[A-Za-z0-9]{5}$` AND the non-suffixed canonical branch (last `-XXXXX` stripped) exists on origin, the SessionStart context block surfaces a "Branch-resume check" section with the literal three-command resync recipe. When the pattern doesn't match, or the canonical branch isn't on origin, the warning does not appear.
- **Verification:** `tests/unit/hooks-session-start.test.ts` covers four cases: (a) suffixed branch + canonical exists → warning present; (b) suffixed branch + canonical absent → no warning; (c) non-suffixed branch → no warning regardless of remote state; (d) suffix length 4 or 6 (off-pattern) → no warning.
- **In scope:** detection regex · canonical-branch lookup via `git ls-remote --exit-code --heads origin` · resync-recipe text inclusion.
- **Out of scope:** auto-resync (the hook only warns; resync is still a deliberate user/Claude action — keeps recovery audit-traceable).
- **Opens blocked:** none.
- **Loveable check:** turn-0 warning replaces a 5-minute diagnosis with a known recipe. Yes — delight.
- **Evidence at wrap:** test row + observed SessionStart output during session 35 first turn (deferred — verifies in next session naturally).

## AC-3 · line-count.sh measures vs session base, falls back gracefully

- **Outcome:** `line-count.sh` reads `/tmp/claude-base-${SESSION_ID}.txt`; if the file exists and contains a valid commit SHA reachable from HEAD, diff is computed against that SHA. Otherwise the hook falls back to the existing `origin/main` behaviour (preserves prior contract on first-run / unknown-session / file-missing edge cases). Fallback is silent — no error noise to user.
- **Verification:** `tests/unit/hooks-line-count.test.ts` covers three cases: (a) base file present with valid SHA on a branch ahead of base by N lines → reports N; (b) base file absent → falls back to `origin/main` diff (regression test, preserves session-30/31/32/33 behaviour); (c) base file present but containing an invalid / unreachable SHA → falls back gracefully (no crash, no error message in output).
- **In scope:** read base file · validate SHA via `git cat-file -e` · diff against base · fall back to `origin/main` on any failure.
- **Out of scope:** cumulative-counter refinements (CLAUDE.md candidate #3 — separate concern; deferred to a future tooling slice if it becomes salient).
- **Opens blocked:** none.
- **Loveable check:** the wrap threshold (1,500 / 2,000) starts firing at the right time again. Floor met.
- **Evidence at wrap:** test row + line refs.

## AC-4 · CLAUDE.md candidate #12 lifted into Planning conduct §

- **Outcome:** Two clean uses of "branch-resume check" discipline (sessions 33 and 34) clear the lift bar from CLAUDE.md §"Coding conduct" `Lift discipline` (paraphrased: capture as candidate, lift after 2 clean uses). The rule is added under §"Planning conduct" as a new bullet referring to the now-automated hook detection.
- **Verification:** `git diff CLAUDE.md` shows the addition; the rule explicitly references the hook so future sessions get the instinct + the tool.
- **In scope:** the lift commit; integration with adjacent Planning conduct rules.
- **Out of scope:** lifting candidates #13 (PR-by-session-end) or #14 (origin/HEAD set) — both still occurrence 1 only; defer.
- **Opens blocked:** none.
- **Loveable check:** the rule is now a habit + a guardrail, not just a habit. Floor met.
- **Evidence at wrap:** the diff line range.

## AC-5 · No regression in adjacent hooks; pre-existing tests stay green

- **Outcome:** `read-cap.sh` and `wrap-check.sh` are not touched. Existing 81 vitest tests stay green. The two new test files add coverage without any test-helper / setup mutation that affects others.
- **Verification:** `pnpm test` reports 81 + N (where N = new hook tests added) all GREEN. No diff to `tests/setup.ts`, `tests/helpers/*`, or `vitest.config.ts`.
- **In scope:** the regression sweep.
- **Out of scope:** test-helper refactors — explicitly avoided to keep the surgical-change discipline.
- **Opens blocked:** none.
- **Loveable check:** confidence floor — every adjacent slice's tests stay green. Floor met.
- **Evidence at wrap:** full vitest run output.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-25 | User (session 34 kickoff) | Approved | Path A picked at pre-flight Q2; lift #12 if cleanly exercised approved at Q3; bundle line-count.sh fix into this slice approved at Q4. AC frozen at this commit. |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
