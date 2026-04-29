# S-INFRA-AC-5-examples-migration

**Status:** in-progress (single-AC mechanical follow-on to PR #41).

**Spec ref:** [Conventional Comments](https://conventionalcomments.org/) verbatim adoption per PR #41 §Out of scope L47-L50:

> "JSON output blocks in §Examples 1-N across all three persona files use the prior schema. They are NOT updated in this slice because [...] §Example renumbering is in flight on PR #37 [...] migration is mechanical [...] will land as a separate PR (`S-INFRA-AC-5-examples-migration`) after PR #37 + PR #40 + this PR all merge."

PR #37, PR #40, PR #41, PR #42 all merged session 50. The conflict gating no longer applies; this slice ships the mechanical migration.

## Context

After PR #41 (Conventional Comments adoption), each persona's §Output format is the schema-of-record (`{summary, findings[].label,blocking}`) but the §Examples blocks still showed the prior `{verdict, severity, findings[]}` shape — pedagogical drift between schema-of-record and demonstrated examples. PR #41 explicitly carried a §Note in each persona disclaiming the lag.

This slice mechanically migrates the 9 §Example JSON output blocks (5 in `slice-reviewer.md`, 2 in `acceptance-gate.md`, 2 in `ux-polish-reviewer.md`) to the Conv Comments shape, and removes the §Note disclaimers. No logic change; no schema change; no spec change. Pure pedagogical-drift cleanup.

## Dependencies

- **All blocking PRs merged.** PR #37 (Example 3→4 renumber + new Example 3) + PR #40 (new Example 5) + PR #41 (schema-of-record rewrite) all on `main` at `ab893b1`.
- **Control-plane change.** All three persona files are L199-protected per `.claude/hooks-checksums.txt` lines 17-19. Hash re-baselined.

## AC-1 · §Example JSON output blocks migrated to Conv Comments schema

- **Outcome:** Each persona's §Examples section emits JSON shape consistent with that persona's §Output format. The pedagogical-drift §Note that announced the deferred migration is removed (no longer accurate). No remaining `"verdict":` / `"severity":` keys in §Example output blocks across the 3 persona files.
- **Verification:**
  1. `grep -c '"verdict":' .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md` → `0` per file (the schema-of-record removed `verdict` from persona output in PR #41; this slice removes it from §Examples too).
  2. `grep -c '"severity":' .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md` → `0` per file.
  3. `grep -c '"summary":' .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md` → ≥ 5, ≥ 2, ≥ 2 respectively (one per Example block + one in the §Output format).
  4. `grep -c '"label":' .claude/agents/slice-reviewer.md` → ≥ 3 (Examples 1, 4 have non-empty findings; Example 2/3/5 empty findings need no label rows; plus the §Output format definition).
  5. `grep -c "Note on §Examples below" .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md` → `0` per file (deferred-migration disclaimer removed).
  6. `grep -c "S-INFRA-AC-5 §Out of scope" .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md` → `0` per file (deferred-migration reference removed).
  7. `bash scripts/hooks-checksums.sh --verify` → exits 0 (clean baseline; 20 entries; new SHAs for the 3 persona files).
  8. `wc -l .claude/agents/slice-reviewer.md` → ≤ 300 (Option C threshold). Currently ~205L.
  9. **Live re-test (recursive):** this PR's own auto-review is the second consumer of the Conv Comments schema (after PR #43 wrap PR which lacked persona-output edges). Persona emits new-shape JSON under the new examples; workflow's parser consumes it; verdict derived; check-run posted.
- **In scope:**
  - `.claude/agents/slice-reviewer.md` §Examples 1-5: replace `{verdict, severity, findings[]}` with `{summary, findings[].label,blocking}`. Remove §Note announcing deferred migration.
  - `.claude/agents/acceptance-gate.md` §Examples 1-2: same transformation. Remove §Note.
  - `.claude/agents/ux-polish-reviewer.md` §Examples 1-2: same transformation (preserves `per_dimension` array). Remove §Note.
  - "Why this is `logic`-severity, not `architectural`" prose in `slice-reviewer.md` §Example 1 reframed as "Why `label: issue, blocking: false`" referencing the label-assignment table.
  - "Why approve" prose in `slice-reviewer.md` §Examples 3 + 5 updated: "false-positive flagged as undeclared scope (`architectural`)" → "(mapped to `issue` + `blocking: true`, deriving `block`)".
  - `.claude/hooks-checksums.txt` re-baseline (3 SHAs change).
  - Slice docs (this file + `verification.md` + `security.md`).
- **Out of scope:**
  - Verdict-coercion fixture refresh (separate slice; spec 72c §5 rule 3 reference but not currently CI-gated).
  - `scripts/derive-verdict.sh` extraction with shellspec coverage (separate slice; build-then-measure carry-over from PR #41 §"Architectural-smell-trigger acknowledgement").
  - Persona prompt rebalancing (calibration via AC-4 retain/drop measurement after first 3 src/ slices ship).
- **Opens blocked:** none.
- **Loveable check:** A new contributor reading `slice-reviewer.md` top-down sees the §Output format schema, then 5 §Examples that match it exactly. No mental gear-shift between "schema-of-record" and "what a real output looks like" — both are now in the Conv Comments shape. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + recursive live re-test in this PR's own auto-review.

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-29 | Author (session 51) | Draft | Single AC; mechanical migration of 9 Example blocks; pedagogical-drift cleanup; no schema change. |
