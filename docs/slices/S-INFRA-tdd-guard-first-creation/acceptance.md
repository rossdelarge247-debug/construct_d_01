# S-INFRA-tdd-guard-first-creation — Acceptance criteria

**Slice:** S-INFRA-tdd-guard-first-creation
**Spec ref:** `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md` AC-6 (tdd-guard contract) + `docs/HANDOFF-SESSION-59.md` §"Lesson 1 — TDD-guard chicken-and-egg for new module first-creation"
**Phase(s):** Infra (rigour-pivot programme; v3b AC-6 refinement)
**Status:** Draft

---

## Context

`docs/HANDOFF-SESSION-59.md` §"Lesson 1" verbatim:

> **Empirical observation.** When creating a new module's first src/+test pair, runtime-import tests fail to resolve until the src file exists. tdd-guard hook treats this as RED (test failing) and blocks src write. Result: chicken-and-egg.
>
> **Workaround used.** Bash heredoc (`cat > file << EOF`) bypasses Write/Edit hook (PreToolUse on Write/Edit only, not on Bash). Per system prompt allowance: "after you have verified that a dedicated tool cannot accomplish your task." Documented in PR #74 description + verification.md adversarial review section.
>
> **Recommended hook refinement (session 60+ candidate, P4).** tdd-guard could detect "module not found" as a distinct failure mode that's expected at first-creation and allow the write through. Distinguish "test fails because impl is wrong" from "test fails because impl doesn't exist yet". Lower priority — bash heredoc workaround works and is principled.

This slice ships that refinement.

## Dependencies

- **Upstream:** PR #76 (S-INFRA-reviewer-comment) merged. `claude/decouple-session-60-TT3BF` resynced to `origin/main` at `32da0a6`.
- **Open decisions required:** none.
- **Re-use / Preserve-with-reskin paths touched:** `.claude/hooks/tdd-guard.sh` (existing; v3b AC-6 contract — extending the RC-handling branch only) · `tests/shellspec/tdd-guard.spec.sh` (existing; adding 3 fixtures alongside the 5 v3b ones).
- **Discarded paths deleted at DoD:** none.

## Pre-flight notes

- **Adversarial review budget (per spec 72b).** acceptance.md `<300L` ⇒ Single-turn (status quo) per the spec 72b §"Decision criteria" table verbatim row: *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."* Live auto-review (4 specialists · k=2) fires on PR open.
- **TDD exemption.** Hook + shellspec are bash; tdd-guard scope is `src/**.{ts,tsx}` per its glob — its own changes do not self-trigger.
- **Conservative gate.** Auto-allow only fires when ALL three hold: tool is `Write` (Edit always implies file exists); target path does not yet exist on disk; vitest output contains a module-resolution error pattern. Real RED on existing files (and Write of non-existent paths with assertion failures) keeps blocking.
- **CODEOWNERS.** Touches `.claude/hooks/**` + `tests/shellspec/**` + `docs/slices/**` — admin-bypass merge expected per solo-operator pattern (CLAUDE.md negative constraint #25).

## MLP framing

The loveable floor: a future Claude session creating a new src+test pair can write the src first via the standard `Write` tool — tdd-guard sees "test exists, src absent, vitest emits 'Failed to resolve import' for that target path" and steps aside with an informational stderr advisory. The bash-heredoc workaround documented in HANDOFF-59 becomes optional rather than mandatory; type-only imports continue to work as before; runtime-import first-creation no longer needs an out-of-band escape.

---

## AC-1 · `tdd-guard.sh` distinguishes module-not-found from real RED

- **Outcome:** When `tool_name == "Write"` AND the target file does not yet exist on disk AND the captured vitest output (`$TMP_OUT`) matches one of the module-resolution error signatures (`Failed to resolve import` · `Failed to load url` · `Cannot find module` · `MODULE_NOT_FOUND`), the hook emits an informational stderr advisory and exits 0 (allowing the Write). Otherwise the existing block-on-RC-non-zero path runs unchanged. The check is gated to Write-only because Edit semantics require the target file to already exist.
- **Verification:**
  1. `grep -nE "module-not-found at first-creation" .claude/hooks/tdd-guard.sh` returns the new advisory line.
  2. The conditional placed before the existing `BLOCKED: tdd-guard — RED test` branch verifies tool/path/output; `git diff origin/main -- .claude/hooks/tdd-guard.sh` shows additions only inside the `if [ "$RC" -ne 0 ]; then` block.
  3. Out-of-scope behaviour preserved: green-path (RC=0) returns 0; missing-test-file branch returns 2 with the original message; Edit on RED returns 2 with `RED test`; allowlist short-circuit preserved; timeout path preserved.
- **In scope:** Detection branch + advisory message + Write-only / file-absent gating.
- **Out of scope:** Detecting module-not-found at the test file itself (e.g. an import in the test that points to a module unrelated to the Write target — author should still see RED); cross-language equivalents (Python/Go); changing the existing RED messaging.

## AC-2 · Shellspec fixtures (6) (7) (8)

- **Outcome:** `tests/shellspec/tdd-guard.spec.sh` gains three fixtures alongside the existing v3b AC-6 five:
  - **Fixture (6) — first-creation chicken-and-egg auto-resolves:** Write to a non-existent `src/lib/newmod.ts`, vitest stub emits `Failed to resolve import "./newmod"`, hook exits 0 with stderr `module-not-found at first-creation`.
  - **Fixture (7) — Edit on existing src still blocks on RED:** Edit `src/lib/existing.ts` (file exists); even when stub emits a `Failed to resolve import` error, hook exits 2 with `BLOCKED: tdd-guard — RED test`. Confirms the Edit-vs-Write disambiguation.
  - **Fixture (8) — Write of non-existent src with assertion failure still blocks:** Write to non-existent `src/lib/asserterr.ts`, stub emits `AssertionError`. Hook exits 2 with `BLOCKED: tdd-guard — RED test`. Confirms the module-resolve signal is required (not just "RC != 0 + non-existent file").
- **Verification:**
  1. `grep -cE "^[[:space:]]*Describe 'fixture \([0-9]+\)" tests/shellspec/tdd-guard.spec.sh` returns `8` (was `5` pre-slice).
  2. CI shellspec workflow runs all 8 fixtures plus the 2 out-of-scope cases; all pass.
  3. Manual smoke harness (4-case loop replicating fixtures 1, 6, 7, 8) passes 4/4 in this sandbox.
- **In scope:** Three new fixtures + a `make_stub_with_output` helper that lets fixtures supply both an exit code AND stdout content.
- **Out of scope:** Per-pattern unit fixtures for each module-resolve signature (one signature per fixture would 4x the case count without additional coverage; the regex collapses to one OR group).

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-05-02 | Author (session 60) | Draft | 2 ACs covering hook + shellspec |
| | User | | AC frozen — implementation may begin |
| | Live auto-review (4 specialists · k=2) | | Fires on PR open |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
