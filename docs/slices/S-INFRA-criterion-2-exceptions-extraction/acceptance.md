# S-INFRA-criterion-2-exceptions-extraction

**Status:** in-progress (2-AC slice; deferred from session 51 P0 → session 52 P0).

**Spec ref:** CLAUDE.md §"Coding conduct" §"Architectural-smell trigger" + `.claude/agents/slice-reviewer.md` criterion 2 §Exceptions (5 sub-clauses a-e accrued through sessions 48-50).

## Context

`slice-reviewer.md` criterion 2 §Exceptions has accrued 5 sub-clauses (a-e), each shipped via its own slice + adversarial review iteration: (a) baseline scaffolding allowance (criterion 2 origin); (b) deferred-slice scope-marker, session-48 PR #34; (c) spec-design content, session-48 PR #33; (d) within-PR revert handling, session-48 PR #33 commit `5f74340`; (e) CLAUDE.md session-wrap docs, session-50 PR #37. Each landed as an additional indented sub-paragraph under criterion 2's main bullet — the section is now ~50 prose lines of nested rule text.

Per CLAUDE.md §"Coding conduct" §"Architectural-smell trigger":

> "If adversarial review surfaces ≥3 rounds of findings clustered in one file, declare an architectural smell and step-back-review whether the abstraction is wrong before continuing patch-iteration. Each round of patches on a smelly abstraction is interest payment, not principal — at round 3+, the cheaper move is usually to split the file (extract logic to a tested unit, leave the original as a thin orchestrator) rather than patch round 4."

§Exceptions has crossed that threshold (5 rounds across 3 files of finding-precedent). This slice ships the extraction:

1. `.claude/agents/criterion-2-exceptions.yaml` — structured source of truth with one entry per exception (id, name, deterministic flag, predicate, treatment, carve-outs, precedent).
2. `scripts/criterion-2-exception-check.sh` — deterministic file-glob pre-filter for ids `c` (spec-design content) and `e` (session-wrap docs); ids `a`/`b`/`d` pass through as `requires-judgement`. The persona makes the final call on judgement-required cases.
3. `tests/shellspec/criterion-2-exception-check.spec.sh` — 14 test cases covering each exception's positive + negative paths + multi-file diff + edge cases (empty stdin, blank lines, whitespace, anchored-glob non-match).
4. `slice-reviewer.md` criterion 2 paragraph — prose sub-clauses (a-e) replaced with a 5-row markdown summary table referencing the YAML; the verbatim treatment + carve-out text is preserved inline in the table cells so the LLM persona has full context without a separate `Read` call. References to `criterion 2 exception (b)` / `(e)` elsewhere in the file (lines 133, 152, 157, 180, 190, 195) keep their letter-id semantics.

## Dependencies

- **PR #44 (`S-INFRA-AC-5-examples-migration`) merged on main as required.** Verified at slice-branch open (HEAD `f423322` = origin/main = post-PR-#44 merge). No file-conflict risk on `slice-reviewer.md`.
- **L199-protected path touched.** `.claude/agents/slice-reviewer.md` is in the hooks-checksums baseline (auto-discovered via `find .claude/agents -name '*.md'`). Baseline re-generated as part of this slice; `control-change` label required at PR open.
- **No CI-script edits.** `auto-review.yml` is unchanged; the new pre-filter script is invokable but not wired into the workflow at this slice's ship — wiring is a follow-up if the LLM persona's judgement on `c`/`e` proves unreliable. The script ships as a tested utility ready for future invocation.

## AC-1 · §Exceptions extracted to structured YAML + persona-prompt summary table

- **Outcome:** `.claude/agents/criterion-2-exceptions.yaml` holds the canonical source of truth for the 5 exceptions: one `exceptions:` entry per id (a-e), each with `id`, `name`, `deterministic` (true/partial/false), `predicate` (kind + summary + paths_in or composite/judgement structure), `treatment`, `carve_outs`, `precedent`. `slice-reviewer.md` criterion 2 paragraph (line 11 in the pre-edit file) keeps the over-implementation + undeclared-scope framing verbatim and adds a one-line YAML reference + script reference; the 5 prose sub-clauses (lines 12-16 pre-edit) are replaced with a 5-row markdown table whose cells preserve the full treatment + carve-out + precedent text inline. Persona context length is preserved within ±5%.
- **Verification:**
  1. `[ -f .claude/agents/criterion-2-exceptions.yaml ]` — file exists.
  2. `python3 -c "import yaml; yaml.safe_load(open('.claude/agents/criterion-2-exceptions.yaml'))"` exits 0 — valid YAML.
  3. `grep -cE "^  - id: [abcde]$" .claude/agents/criterion-2-exceptions.yaml` → `5` — five entries with ids a/b/c/d/e.
  4. `grep -cE '^\s+\| \([abcde]\)' .claude/agents/slice-reviewer.md` → `5` — five table rows in the persona prompt, one per exception.
  5. `grep -c '\.claude/agents/criterion-2-exceptions.yaml' .claude/agents/slice-reviewer.md` → ≥ `1` — YAML referenced from the persona.
  6. `grep -c 'scripts/criterion-2-exception-check.sh' .claude/agents/slice-reviewer.md` → ≥ `1` — pre-filter script referenced from the persona.
  7. `grep -c 'criterion 2 exception' .claude/agents/slice-reviewer.md` → ≥ `5` — pre-existing references to `(b)`/`(e)` in §Examples preserved (lines 133, 152, 157, 180, 190, 195 keep their letter-id semantics).
  8. `sha256sum .claude/agents/slice-reviewer.md` matches `.claude/hooks-checksums.txt` baseline (verifies the re-baseline ran).
- **In scope:**
  - `.claude/agents/criterion-2-exceptions.yaml` — new file (~95L).
  - `.claude/agents/slice-reviewer.md` — replace lines 11-16 (criterion 2 paragraph + 5 sub-clauses) with new paragraph + 5-row markdown table. Net delta within ±5% line count.
  - `.claude/hooks-checksums.txt` — slice-reviewer.md SHA re-baselined.
  - Slice docs (this file + `verification.md` + `security.md`).
- **Out of scope:**
  - Changing the substantive rules of any exception (a)-(e) — this is pure extraction; the rules stay verbatim. Promotion of `c`/`e` from "by-design exception" to "auto-classified" is a separate decision (CI-wiring follow-up).
  - Parity-check script (`scripts/criterion-2-parity-check.sh`) enforcing YAML ↔ table ↔ script-globs alignment — deferred until first observed drift, per CLAUDE.md §"Don't add error handling for scenarios that can't happen". YAML's head-comment documents the alignment convention.
  - Wiring `criterion-2-exception-check.sh` into `auto-review.yml` — the script ships as a tested utility; integration awaits evidence the LLM persona mis-classifies `c`/`e` cases.
  - Extending `scripts/hooks-checksums.sh` to track `.claude/agents/*.yaml` (or `scripts/criterion-2-exception-check.sh`) — current pattern is `.md`-only; new YAML's head comment + slice docs serve as the maintenance record. Tracking expansion can land if drift is observed.
- **Opens blocked:** none.
- **Loveable check:** A new contributor reading the persona prompt sees the criterion 2 §Exceptions as a 5-row table with id/predicate/treatment/carve-outs columns instead of 5 nested prose sub-paragraphs. They can scan the rubric in 30 seconds, locate the relevant exception by id, and read its predicate + carve-outs without re-parsing prose nesting. If they need the canonical structured form (e.g. for a future tool that consumes the rubric), `.claude/agents/criterion-2-exceptions.yaml` is one file away. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + persona-line-count delta + YAML-parse exit code 0.

## AC-2 · Eligibility-check extracted to `scripts/criterion-2-exception-check.sh` with shellspec coverage

- **Outcome:** `scripts/criterion-2-exception-check.sh` reads a list of changed files (one per line) on stdin and emits one tab-separated line per file: `<path>\t<exception-id|none|requires-judgement>\t<reason>`. Hardcoded path globs cover ids `c` (`docs/workspace-spec/*` + `docs/design-source/*` — bash `[[ == ]]` `*` matches `/` so nested paths are covered without explicit `**`) and `e` (`docs/HANDOFF-SESSION-*.md` + `docs/SESSION-CONTEXT.md`); `docs/slices/<id>/{acceptance,verification,security}.md` pass through as `requires-judgement` (exception (b) candidate); other paths emit `none`. The script does not parse the YAML at runtime — globs are kept aligned with `predicate.paths_in` arrays in the YAML by the head-comment convention. `tests/shellspec/criterion-2-exception-check.spec.sh` exercises 14 cases including each exception's positive path, anchored-glob non-match (`docs/handoffs-archive/HANDOFF-SESSION-12.md` → `none`), multi-file order preservation, blank-line skipping, empty-stdin → empty-output, and space-bearing paths.
- **Verification:**
  1. `[ -x scripts/criterion-2-exception-check.sh ]` — file is executable.
  2. `head -1 scripts/criterion-2-exception-check.sh` → `#!/usr/bin/env bash` (matches existing `scripts/` convention).
  3. `wc -l scripts/criterion-2-exception-check.sh` → ≤ 100L (currently 80L).
  4. `printf 'docs/HANDOFF-SESSION-52.md\n' | scripts/criterion-2-exception-check.sh` → emits a line containing `\te\t`.
  5. `printf 'docs/SESSION-CONTEXT.md\n' | scripts/criterion-2-exception-check.sh` → emits a line containing `\te\t`.
  6. `printf 'docs/workspace-spec/72c-multi-agent-review-framework.md\n' | scripts/criterion-2-exception-check.sh` → emits a line containing `\tc\t`.
  7. `printf 'docs/design-source/welcome-carousel/foo.png\n' | scripts/criterion-2-exception-check.sh` → emits a line containing `\tc\t`.
  8. `printf 'src/lib/foo.ts\n' | scripts/criterion-2-exception-check.sh` → emits a line containing `\tnone\t`.
  9. `printf 'docs/slices/S-INFRA-foo/acceptance.md\n' | scripts/criterion-2-exception-check.sh` → emits a line containing `\trequires-judgement\t`.
  10. `printf 'docs/handoffs-archive/HANDOFF-SESSION-12.md\n' | scripts/criterion-2-exception-check.sh` → emits a line containing `\tnone\t` (anchored-glob non-match — does NOT match the `docs/HANDOFF-SESSION-*.md` glob outside `docs/` root).
  11. **Local shellspec run:** `shellspec tests/shellspec/criterion-2-exception-check.spec.sh` reports `14 examples, 0 failures` (verified locally pre-PR-open).
  12. **Full-suite regression:** `shellspec` (no args) reports `139 examples, 0 failures` (125 existing + 14 new; verified locally pre-PR-open).
  13. **CI gating:** `.github/workflows/shellspec.yml` runs `shellspec` (no args) which auto-discovers `tests/shellspec/*.spec.sh` per the `.shellspec --pattern` config — the new spec file ships CI-gated automatically without workflow edits.
- **In scope:**
  - `scripts/criterion-2-exception-check.sh` — new file. Hardcoded globs for ids `c` + `e`; pass-through for `b` candidates; `none` fallthrough.
  - `tests/shellspec/criterion-2-exception-check.spec.sh` — new file; 14 test cases.
- **Out of scope:**
  - Wiring the script into `.github/workflows/auto-review.yml` — see AC-1 §Out of scope.
  - Parsing the YAML at runtime — the YAML is documentation/structured-reference; the script's predicates are imperative copies. Parity convention documented in YAML head comment.
  - Extension to non-deterministic predicates (a)/(d) — `requires-judgement` pass-through is the contract.
- **Opens blocked:** none.
- **Loveable check:** A future maintainer wires this script into `auto-review.yml` to pre-classify diff files before invoking the persona. They run the existing 14-case shellspec contract first to confirm the script's behaviour, then add a workflow step like `git diff --name-only $BASE...HEAD | scripts/criterion-2-exception-check.sh > /tmp/exceptions-pre-check.txt` and inject the file into the persona's prompt. The script's stdin/stdout interface is testable and stable. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-2 row + commit SHA + local shellspec output (`14 examples, 0 failures`) + full-suite green (`139 examples, 0 failures`).

## Architectural-smell-trigger acknowledgement

This slice IS the architectural-smell-trigger response: 5 sub-clauses on one paragraph qualifies as the round-3+ extract-rather-than-patch threshold. The same doctrine that drove session-51 PR #46 (verdict-derivation extraction) and PR #47 (resolver+parser extraction). Future additions to §Exceptions land as new YAML entries + new shellspec cases + new table rows — no further prose-paragraph nesting. The next extraction pressure point if it accrues is `slice-reviewer.md` §Output format label-assignment table (currently 11 rows; flat structure scales further before extraction).

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-29 | Author (session 52) | Draft | 2 ACs; YAML + script + shellspec + persona-table edit; 14-case shellspec verified locally; full-suite 139 examples 0 failures; control-change label required (slice-reviewer.md L199-protected). |
