# S-INFRA-auto-review-resolver-parser-extract

**Status:** in-progress (3-AC extraction slice; second half of session-51 auto-review.yml extraction work after PR #46 derive-verdict.sh).

**Spec ref:** CLAUDE.md §"Engineering conventions" §"Architectural-smell trigger" + PR #39 (session 50) branch-derived resolver fix.

## Context

`auto-review.yml` accrued ≥8 patch rounds across sessions 47-50 (per CLAUDE.md §"Architectural-smell trigger" worked example: parse-default → ac-gap → sed-strip → sentinel → doc-drift → timeout, then session-50 round-1 parse-failed + PR #39 resolver fix). Build-then-measure principle says extract at next finding cluster — that's already triggered.

Session 51 ships the extraction in two parts:
- **PR #46** (`S-INFRA-derive-verdict-script-extract`) — verdict-derivation arithmetic → `scripts/derive-verdict.sh`.
- **This slice** — slice-AC resolver + parse-fallback → `scripts/auto-review-{slice-resolve,parse}.sh`.

After both merge, `auto-review.yml` is a thin orchestrator: secret-check + checkout + brief-compose (now calling slice-resolve.sh) + invoke-claude (now calling parse.sh + derive-verdict.sh) + post-check-run + post-comment + 2 fallback steps. All non-trivial logic lives in tested scripts under `tests/shellspec/`.

## Dependencies

- **PR #45 merged** at `d3dc103` (auto-review findings comment) — this slice branched off the post-PR-#45 main. No conflict.
- **PR #46 OPEN** (`S-INFRA-derive-verdict-script-extract`) — touches `auto-review.yml` lines 165-191 (verdict-derivation arithmetic). This slice touches lines 64-83 (resolver) + lines 138-150 (parser). **Different regions; clean rebase regardless of merge order.**
- **PR #44 OPEN** (`S-INFRA-AC-5-examples-migration`) — touches persona files only; no `auto-review.yml` overlap. Independent.
- **No control-plane touch.** Two new scripts (not L199-protected); two new test files; `auto-review.yml` is not in `.claude/hooks-checksums.txt` baseline. `control-change` label not required.

## AC-1 · Slice-AC resolver extracted to `scripts/auto-review-slice-resolve.sh`

- **Outcome:** `scripts/auto-review-slice-resolve.sh BRANCH PR_BODY` resolves the slice acceptance.md path with branch-first preference (deterministic; matches `claude/<slice-name>` naming convention) and PR-body grep as fallback. Output is the resolved path on stdout, or empty string if neither resolution succeeds. Always exit 0. PR #39's session-50 fix (branch-first preference) preserved verbatim.
- **Verification:**
  1. `wc -l scripts/auto-review-slice-resolve.sh` → ≤ 60L (currently 33L).
  2. `[ -x scripts/auto-review-slice-resolve.sh ]` (file is executable).
  3. `head -1 scripts/auto-review-slice-resolve.sh` → `#!/usr/bin/env bash`.
  4. `mkdir -p /tmp/test/docs/slices/S-FOO && touch /tmp/test/docs/slices/S-FOO/acceptance.md && cd /tmp/test && /path/to/scripts/auto-review-slice-resolve.sh "claude/S-FOO" ""` → `docs/slices/S-FOO/acceptance.md`.
  5. **Branch-first wins:** branch-derived path is preferred even when PR body cites another slice (PR #38 false-positive class — closes the regression class, not just the symptom).
  6. **Fallback fires:** when branch-derived slice file is missing, PR-body grep returns first-cited path.
  7. **Empty inputs:** both empty → empty output.
- **In scope:**
  - `scripts/auto-review-slice-resolve.sh` — new file. Preserves the inline logic from `auto-review.yml` lines 64-83 (current main pre-merge) verbatim. Comment-block headed with WHY (PR #38 false-positive context) preserved at the top of the script (was inline comment).
  - `tests/shellspec/auto-review-slice-resolve.spec.sh` — new file (~85L). 8 test cases covering: branch-derived match (3 cases including the PR #38 false-positive scenario), PR-body fallback (3 cases including multi-cite first-match), empty inputs, edge case (lowercase `s-` prefix doesn't match the case-sensitive regex).
  - `.github/workflows/auto-review.yml` "Compose review brief" step — replace 20L of inline resolver logic with `SLICE_AC=$(scripts/auto-review-slice-resolve.sh "$BRANCH" "$PR_BODY")` (1 line; +1 comment block referencing the script's test contract).
- **Out of scope:**
  - Lowercase `s-` branch-prefix matching — current behaviour is case-sensitive (uppercase `S-` only); changing this would be a feature, not an extraction. Documented as a test case capturing actual behaviour.
  - PR-body resolution from `## References` sections only (vs. body-wide grep) — would reduce false-positive surface further but PR #39 fix already closes the original regression class.
- **Opens blocked:** none.
- **Loveable check:** A contributor opens `auto-review.yml` to debug a "wrong slice picked" issue; instead of 20 lines of inline shell + a multi-paragraph WHY comment, they see one named call to `scripts/auto-review-slice-resolve.sh`. They follow the link, see the 33-line script with the WHY at the top + the 8-case test fixture (including the PR #38 false-positive scenario as a named case), and reproduce the issue locally. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + 8 shellspec cases green locally + recursive auto-review on this PR.

## AC-2 · Parse fallback extracted to `scripts/auto-review-parse.sh`

- **Outcome:** `scripts/auto-review-parse.sh` reads the `claude -p --output-format=json` envelope from stdin, extracts the persona's strict-JSON output (with `.result // .text // .content // ""` fallbacks), tries direct jq parse → fence-stripped jq parse → `'{}'` parse-failed sentinel. Output is the persona JSON or `'{}'` on stdout. Always exit 0. **Closes a latent edge case** the inline code had: `jq -c '.'` on empty stdin returns 0 with empty stdout — the inline code's `||` chain didn't catch this. The script's explicit `[ -z "$RESULT" ] → '{}'` guard does.
- **Verification:**
  1. `wc -l scripts/auto-review-parse.sh` → ≤ 80L (currently 58L).
  2. `[ -x scripts/auto-review-parse.sh ]`.
  3. `echo '{"result":"{\"a\":1}"}' | scripts/auto-review-parse.sh` → `{"a":1}`.
  4. `echo '{"result":"\`\`\`json\n{\"a\":1}\n\`\`\`"}' | scripts/auto-review-parse.sh` → `{"a":1}` (fence stripped).
  5. `echo '{}' | scripts/auto-review-parse.sh` → `{}` (empty .result → parse-failed sentinel).
  6. `printf '' | scripts/auto-review-parse.sh` → `{}` (empty stdin → parse-failed).
  7. `echo 'not json' | scripts/auto-review-parse.sh` → `{}` (invalid envelope → parse-failed).
  8. `echo '{"result":"not-json{{{"}' | scripts/auto-review-parse.sh` → `{}` (malformed result body → parse-failed).
- **In scope:**
  - `scripts/auto-review-parse.sh` — new file. Preserves the inline 2-stage extract-then-parse logic from `auto-review.yml` lines 138-150 (current main pre-merge) plus the **fixed** empty-result guard.
  - `tests/shellspec/auto-review-parse.spec.sh` — new file (~137L). 13 test cases covering 3 success-mode classes (plain JSON · fence-wrapped JSON · whitespace-prefixed fences · `.text` fallback · `.content` fallback · pretty-printed JSON compaction) and 3 failure-mode classes (missing/empty `.result` · malformed result body · invalid envelope).
  - `.github/workflows/auto-review.yml` "Invoke slice-reviewer" step — replace 13L of inline parse logic (`RESULT=...` + `PERSONA_JSON=...` chain) with `PERSONA_JSON=$(scripts/auto-review-parse.sh < /tmp/review-output.json)` (1 line; +1 comment block).
- **Out of scope:**
  - Multi-fence-pair stripping — current grep-based strip removes ALL fence lines; nested fence pairs would also be stripped (which is correct behaviour for the model's quirk).
  - `.result_text` / other field-name drift — `// .text // .content` covers known cases; if more emerge they can be added to the extraction chain.
- **Opens blocked:** none.
- **Loveable check:** A contributor wonders why a particular PR's auto-review returned `parse-failed`; instead of reading 13 lines of inline shell with `||` chains and fence-stripping awk, they see one named call to `scripts/auto-review-parse.sh`. They run the failing PR's claude envelope through the script locally, reproduce the parse failure, identify which of the 3 failure-mode classes it hit, and fix it. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-2 row + commit SHA + 13 shellspec cases green locally + recursive auto-review on this PR.

## AC-3 · `auto-review.yml` shrinks to a thin orchestrator (resolver + parser inlined → script-call)

- **Outcome:** Two inline logic blocks in `auto-review.yml` (resolver: lines 64-83, ~20L; parser: lines 138-150, ~13L) replaced with two single-line script calls. Net workflow shrinks ~21L (368L vs 389L pre-PR; would shrink further when PR #46 also merges). The "Compose review brief" + "Invoke slice-reviewer" steps now read top-to-bottom as a clear pipeline of named operations.
- **Verification:**
  1. `grep -c 'scripts/auto-review-slice-resolve.sh' .github/workflows/auto-review.yml` → ≥ 1 (resolver invoked).
  2. `grep -c 'scripts/auto-review-parse.sh' .github/workflows/auto-review.yml` → ≥ 1 (parser invoked).
  3. `grep -c 'SLICE_FROM_BRANCH=' .github/workflows/auto-review.yml` → 0 (inline resolver var removed).
  4. `grep -c 'RESULT=$(jq -r' .github/workflows/auto-review.yml` → 0 (inline parser stage 1 removed).
  5. `wc -l .github/workflows/auto-review.yml` → 368 (was 389; ≥ -15L net reduction).
  6. `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-review.yml'))"` exits 0.
  7. `shellspec` (full suite) reports `109 examples, 0 failures` (88 existing + 21 new from this slice; no regression).
  8. **Live re-test (recursive):** this PR's own auto-review fires; the workflow now uses `scripts/auto-review-slice-resolve.sh` to find this slice's `acceptance.md` (branch-derived: `claude/S-INFRA-auto-review-resolver-parser-extract` → `docs/slices/S-INFRA-auto-review-resolver-parser-extract/acceptance.md`); uses `scripts/auto-review-parse.sh` to extract the persona's findings; persona reviews + emits findings; verdict derived (still inline arithmetic; PR #46 will replace that too).
- **In scope:**
  - `.github/workflows/auto-review.yml` — replace lines 64-83 (resolver block) with 1 script call + 6L WHY comment; replace lines 138-150 (parser block) with 1 script call + 4L WHY comment. Net -21L.
- **Out of scope:**
  - Verdict-derivation extraction — separate slice (PR #46).
  - Comment-posting extraction — would be the next architectural-smell-trigger if PR #45's comment-posting accrues more rounds; v3c carry-over.
- **Opens blocked:** none.
- **Loveable check:** Open `auto-review.yml` and read it top-to-bottom. Each step is named; each non-trivial logic block is a script call; the workflow shape (secret-check → checkout → compose → invoke → post-check-run → post-comment → fallbacks) is clear in <30 seconds. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-3 row + commit SHA + recursive validation on this PR.

## Architectural-smell-trigger acknowledgement

Per CLAUDE.md §"Engineering conventions" §"Architectural-smell trigger" worked example: `auto-review.yml` accrued ≥8 patch rounds across sessions 47-50. Build-then-measure said extract — this slice + PR #46 ship the extraction together. After both merge, `auto-review.yml` is a thin orchestrator. The cluster of patches has been replaced by named script-calls + tested logic units.

Future iteration: if comment-posting accrues findings rounds, extract `scripts/auto-review-post-comment.sh` next. v3c carry-over.

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-29 | Author (session 51) | Draft | 3 ACs; 2 scripts (resolver + parser); 21 shellspec cases; auto-review.yml -21L net; recursive validation expected. |
