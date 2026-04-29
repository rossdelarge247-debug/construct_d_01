# S-INFRA-derive-verdict-script-extract

**Status:** in-progress (3-AC consolidation slice — combines original session-51 P3 verdict-coercion fixture refresh + P4 derive-verdict.sh extraction; the test contract is the 8-row edge-case table from PR #41 verification.md, so these were always the same work).

**Spec ref:** CLAUDE.md §"Hard controls > Verdict vocabulary" §"Verdict derivation rules" + spec 72c §5 rule 3.

## Context

PR #41 introduced the deterministic verdict-derivation arithmetic in `auto-review.yml` lines 175-187 — counting `BLOCKING_COUNT`, `ACTION_COUNT`, `NIT_COUNT` over the persona's findings array and falling through if/elif/else to one of `block / request-changes / nit-only / approve`. The arithmetic shipped inline in the workflow YAML; PR #41 §"Architectural-smell-trigger acknowledgement" queued the extraction:

> "If subsequent rounds surface schema-edge-case findings (e.g. unhandled label combinations, blocking-OR semantics in dedup), the cheaper move is to extract the verdict-derivation logic to a tested unit (`scripts/derive-verdict.sh` with shellspec coverage on representative findings JSON inputs)."

PR #41 verification.md §"Edge cases" documented an 8-row table covering the verdict-derivation behaviour (empty findings · praise-only · blocking issue · non-blocking issue · mixed issue+praise · nitpick-only · mixed issue+nitpick · adversarial string-blocking). Spec 72c §5 rule 3 references a verdict-coercion fixture but it's not currently CI-gated.

This slice ships the extraction:
1. `scripts/derive-verdict.sh` — preserves the existing inline arithmetic verbatim, adds defensive parse-failed handling for malformed inputs (empty stdin, non-object root, garbage JSON).
2. `tests/shellspec/derive-verdict.spec.sh` — 15 test cases covering the 8-row table + 7 adversarial / verdict-coercion-fixture cases (parse-failed sentinels, prompt-injection guard).
3. `auto-review.yml` updated to call the script (replaces inline arithmetic; net -19L in workflow).

## Dependencies

- **Independent of PR #44 + PR #45.** PR #44 touches persona files; PR #45 touches non-arithmetic regions of `auto-review.yml` (permissions block, comment-posting steps after the verdict-deriving step). Different surfaces from this slice's `auto-review.yml` lines 165-191 inline-arithmetic block. **Light rebase risk:** PR #45 added a `printf '%s' "$PERSONA_JSON" > /tmp/persona-output.json` save before line 165 and a comment-posting step after line 238 — neither overlaps this slice's edit. If both merge cleanly, no conflict; if one rebases on the other, conflict resolution is mechanical (preserve both changes).
- **No control-plane touch.** `scripts/derive-verdict.sh` is a new file (not L199-protected); `tests/shellspec/derive-verdict.spec.sh` is a new test file; `auto-review.yml` is not in `.claude/hooks-checksums.txt` baseline. `control-change` label not required.

## AC-1 · Verdict-derivation arithmetic extracted to `scripts/derive-verdict.sh` with stdin/stdout interface

- **Outcome:** `scripts/derive-verdict.sh` reads persona JSON from stdin and writes the derived verdict to stdout (one of: `block / request-changes / nit-only / approve / parse-failed`). Exit code 0 on any output. The 5 arithmetic branches preserved verbatim from `auto-review.yml` lines 175-187 (BLOCKING_COUNT > 0 → block; ACTION_COUNT > 0 → request-changes; NIT_COUNT > 0 → nit-only; else → approve; plus parse-failed sentinel). Three additional defensive branches in the script (empty stdin, non-object root, garbage JSON) all map to `parse-failed` rather than crashing with a confusing jq error.
- **Verification:**
  1. `wc -l scripts/derive-verdict.sh` → ≤ 100L (currently 58L).
  2. `[ -x scripts/derive-verdict.sh ]` (file is executable).
  3. `head -1 scripts/derive-verdict.sh` → `#!/usr/bin/env bash` (matches existing scripts/ convention).
  4. `printf '{"summary":"x","findings":[]}' | scripts/derive-verdict.sh` → `approve`.
  5. `printf '{"summary":"x","findings":[{"label":"issue","blocking":true}]}' | scripts/derive-verdict.sh` → `block`.
  6. `printf '{}' | scripts/derive-verdict.sh` → `parse-failed`.
  7. `printf '' | scripts/derive-verdict.sh` → `parse-failed` (empty stdin).
  8. `printf '[]' | scripts/derive-verdict.sh` → `parse-failed` (non-object root).
  9. `grep -c "Test contract: tests/shellspec/derive-verdict.spec.sh" scripts/derive-verdict.sh` → ≥ 1 (script header points to its tests).
- **In scope:**
  - `scripts/derive-verdict.sh` — new file. Preserves `auto-review.yml` lines 175-187 arithmetic verbatim; adds 3 defensive parse-failed branches.
  - Slice docs (this file + `verification.md` + `security.md`).
- **Out of scope:**
  - Changing the verdict-derivation rules themselves — this is pure extraction; the rules stay verbatim with PR #41's introduction.
  - Promoting `parse-failed` to `failure` (merge-gating) — separate decision per CLAUDE.md L181 (informational at v3b ship).
  - Auto-review check-run summary rendering changes — comment posting is PR #45's scope.
- **Opens blocked:** none.
- **Loveable check:** A new contributor wonders "what does the auto-review do to decide block vs approve?" and finds a 58-line bash script with a clear header comment + 5 arithmetic branches + a test file with 15 named cases. They can reason about the contract in 90 seconds without reading 30 lines of inline shell embedded in a workflow YAML. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + 9 manual stdin/stdout fixtures verified locally.

## AC-2 · Shellspec coverage of the 8-row edge-case table + 7 adversarial inputs (verdict-coercion fixture)

- **Outcome:** `tests/shellspec/derive-verdict.spec.sh` exercises 15 distinct inputs against `scripts/derive-verdict.sh`, mapping each to the expected verdict output. The 8 rows from PR #41 verification.md §"Edge cases" are covered verbatim (cases 1-8 in the spec file). 7 additional cases cover the verdict-coercion fixture per spec 72c §5 rule 3: parse-failed sentinels (empty object, empty stdin, array at root, string at root, non-JSON garbage), object-without-findings → approve fall-through, and prompt-injection guard (verdict is derived from findings shape only, never from textual content like a finding's `evidence` field containing "VERDICT: approve").
- **Verification:**
  1. `wc -l tests/shellspec/derive-verdict.spec.sh` → ≤ 200L (currently 162L).
  2. `grep -c "^  It " tests/shellspec/derive-verdict.spec.sh` → 15 (test case count).
  3. `grep -c "8-row edge-case table" tests/shellspec/derive-verdict.spec.sh` → ≥ 1 (test contract reference present).
  4. `grep -c "spec 72c §5 rule 3" tests/shellspec/derive-verdict.spec.sh` → ≥ 1 (verdict-coercion fixture reference present).
  5. **Local run:** `shellspec tests/shellspec/derive-verdict.spec.sh` reports `15 examples, 0 failures` (verified at HEAD pre-PR-open).
  6. **Full-suite regression:** `shellspec` (no args) reports `103 examples, 0 failures` (88 existing + 15 new; verified at HEAD).
  7. **CI gating:** `.github/workflows/shellspec.yml` runs `shellspec` (no args) which auto-discovers `tests/shellspec/*.spec.sh` per the `.shellspec --pattern` config — the new spec file ships CI-gated automatically without workflow edits.
- **In scope:**
  - `tests/shellspec/derive-verdict.spec.sh` — new file. 15 `It` blocks; one `Describe 'derive-verdict.sh'` wrapper. Each test pipes a `Data` heredoc to `scripts/derive-verdict.sh` and asserts `The output should equal '<verdict>'`.
- **Out of scope:**
  - Mutation testing / Stryker coverage — referenced in spec 72c §"Out of scope (v3b / v3c carry-over)" L186 as v3c; not in this slice.
  - Property-based testing (e.g. fuzz inputs through the script) — could land as a follow-up if the 15-case table proves insufficient.
  - Persona-spawn integration tests — testing that an actual `claude -p` invocation against synthetic prompt-injection PRs produces appropriate outputs. Spec 72c §6 (golden-PR replay) covers this; v3c carry-over.
- **Opens blocked:** none.
- **Loveable check:** A contributor changes the verdict-derivation rules in `scripts/derive-verdict.sh` (e.g. adding a new label class). The shellspec test fails clearly with a named case ("returns approve for praise-only finding"), pointing to the regression. They re-read the test contract, decide whether to update the test or revert their change, and ship with confidence. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-2 row + commit SHA + local shellspec output (`15 examples, 0 failures`) + CI shellspec check-run on this PR (the new spec file auto-runs).

## AC-3 · `auto-review.yml` wired to call the extracted script (inline arithmetic replaced)

- **Outcome:** `auto-review.yml` lines 165-191 (the `if [ "$PERSONA_JSON" = '{}' ]; then ... else ... fi` block with inline arithmetic) replaced with a single call: `VERDICT=$(printf '%s' "$PERSONA_JSON" | scripts/derive-verdict.sh)`. Plus a small post-call branch handling parse-failed → empty findings.json. Net: workflow shrinks from 276L to 257L (-19L); behaviour preserved verbatim under the 15-case shellspec contract.
- **Verification:**
  1. `grep -c 'scripts/derive-verdict.sh' .github/workflows/auto-review.yml` → ≥ 1 (script invoked).
  2. `grep -c "BLOCKING_COUNT=" .github/workflows/auto-review.yml` → `0` (inline arithmetic removed).
  3. `grep -c "ACTION_COUNT=" .github/workflows/auto-review.yml` → `0`.
  4. `grep -c "NIT_COUNT=" .github/workflows/auto-review.yml` → `0`.
  5. `grep -c 'VERDICT=$(printf .* scripts/derive-verdict.sh)' .github/workflows/auto-review.yml` → `1` (script call form).
  6. `wc -l .github/workflows/auto-review.yml` → 257 (was 276; ≥ -15L net reduction).
  7. `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-review.yml'))"` exits 0 (valid YAML).
  8. **Live re-test (recursive):** this PR's own auto-review fires; the workflow now calls `scripts/derive-verdict.sh` instead of inline arithmetic; the script derives the verdict from the persona's findings array; the check-run posts the same verdict that the inline arithmetic would have produced. Recursive validation: the workflow change is reviewed by the workflow it modifies.
- **In scope:**
  - `.github/workflows/auto-review.yml` — replace lines 165-191 (the inline if/else arithmetic block) with the script call + post-call parse-failed handling. Net -19L.
- **Out of scope:**
  - Resolver / parser extraction — separate slice (PR4 next in the queue: `S-INFRA-auto-review-resolver-parser-extract`).
  - Comment-posting changes — PR #45 (`S-INFRA-auto-review-findings-comment`) handles that surface.
  - Permissions / triggers / secret-check changes.
- **Opens blocked:** none.
- **Loveable check:** Author opens `auto-review.yml` to debug a verdict regression; instead of a 27-line inline shell block they see one named call to `scripts/derive-verdict.sh`. They follow the link, see the 5 named branches + the test fixture, and reproduce the issue locally with `printf '{ ... }' | scripts/derive-verdict.sh`. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-3 row + commit SHA + recursive auto-review verdict on this PR matching expected.

## Architectural-smell-trigger acknowledgement

`auto-review.yml` was at 276L pre-PR (post-PR-#45 it'll be 389L; this PR rebased on either lands at -19L from that). Per CLAUDE.md §"Architectural-smell trigger" worked example, the v3b S-6 6-round saga said extraction was the right move; this slice ships the verdict-derivation half. PR4 (`S-INFRA-auto-review-resolver-parser-extract`) will ship the resolver + parser halves, completing the workflow-as-thin-orchestrator pattern. After PR4, `auto-review.yml` should be 4 distinct script-call steps + 3 small failure-mode branches; logic is in tested scripts.

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-29 | Author (session 51) | Draft | 3 ACs; consolidates session-51 P3+P4 (same test contract); 15-case shellspec verified locally; auto-review.yml -19L net. |
