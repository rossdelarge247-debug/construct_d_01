# S-INFRA-v3c-rubric-extension-2

**Status:** in-progress (single-AC sibling slice; stacks on PR #37).

**Spec ref:** `.claude/agents/slice-reviewer.md` criterion 2 (AC alignment — scope-creep); session-50 PR #37 false-positive (HANDOFF + SESSION-CONTEXT shipped without explicit AC §In scope listing); SESSION-CONTEXT L91-103 §"Session 50 priorities §P0a" + the auto-review block-finding evidence on PR #37.

## Context

Session-50 PR #37 (`S-INFRA-v3c-rubric-extension`) auto-review returned `block` with one `architectural`-severity finding:

> "docs/HANDOFF-SESSION-49.md and docs/SESSION-CONTEXT.md are not listed in AC-1 §In scope and no criterion 2 exception covers docs/ outside docs/workspace-spec/ or docs/design-source/; add both to AC-1 §In scope as 'session wrap protocol outputs required by CLAUDE.md §Wrapping up', or add exception (e) to slice-reviewer.md criterion 2 covering CLAUDE.md-mandated session wrap docs (HANDOFF-SESSION-{N}.md, SESSION-CONTEXT.md) — the same false-positive pattern this PR was written to fix for spec-design and deferred-slice diffs."

PR #37's in-place fix (`8827745`) declared HANDOFF + SESSION-CONTEXT in AC-1 §In scope per the reviewer's first remediation option. This slice ships **the structural fix** — adding §Exception (e) to criterion 2 — so future PRs that bundle wrap docs don't need per-slice §In scope declarations. Same false-positive class as (b) (deferred-slice scope-marker) and (c) (spec-design content).

Session 49 itself ran the rubric extension as its sole P0 and wrapped on the same branch (`claude/v3c-rubric-s8-impl-4kC9R`) — the wrap protocol per CLAUDE.md §"Wrapping up a session" §1-3 mandated `cf51b7c` (HANDOFF-49 + SESSION-CONTEXT refresh). This pattern is structural: every session that ships substantive work will produce wrap docs on the same branch. §Exception (e) recognises this as operational scope by declaration of CLAUDE.md, not slice scope.

## Dependencies

- **Stacked on PR #37.** Branch `claude/S-INFRA-v3c-rubric-extension-2-exception-e` is off `claude/v3c-rubric-s8-impl-4kC9R` head — `(a)`-`(d)` exception sub-clauses must exist before this slice can extend them with `(e)`. After PR #37 merges into main, this PR's base auto-rebases onto `dc1f4e0`-derived main; until then the diff shown on GitHub will include PR #37's commits.
- **Control-plane change.** `.claude/agents/slice-reviewer.md` is L199-protected (its SHA is at `.claude/hooks-checksums.txt` L18). The `control-change-label.yml` gate will fail until the `control-change` label is applied by an admin. Hash re-baselined: `6242a9a2…` → `10ccfc65…`.

## Architectural-smell-trigger acknowledgement

Per CLAUDE.md §"Engineering conventions" §"Architectural-smell trigger": `slice-reviewer.md` criterion 2 §Exceptions has now accrued 5 sub-clauses (a)/(b)/(c)/(d)/(e) — each shipped with its own slice + adversarial review iteration. The pattern recognised: every false-positive class surfaced by recursive self-application becomes a labelled sub-clause.

Continuing to patch criterion 2 incrementally is interest, not principal: each new sub-clause is one more edge case the persona must learn from a free-form prose definition. The cheaper move at the next finding (≥3rd sub-clause cluster after this) would be to refactor §Exceptions to a structured table or YAML block + extract the eligibility-check logic as a tested unit (`scripts/criterion-2-exception-check.sh` with shellspec coverage), leaving slice-reviewer.md as the prose contract. **This is queued as a v3c carry-over — `S-INFRA-criterion-2-exceptions-table-extraction`.**

This slice ships the inline (e) addition only — the immediate fix is cheap, the structural extraction is independent.

## AC-1 · slice-reviewer.md criterion 2 §Exceptions extended with sub-clause (e) + §Example 5 wrap-docs case

- **Outcome:** `.claude/agents/slice-reviewer.md` criterion 2 contains five numbered exception sub-clauses (a) Incidental scaffolding (b) Deferred-slice scope-marker update (c) Spec-design content (d) Revert commits within the same open PR (e) **CLAUDE.md-mandated session wrap docs** (new). §Example invocations contains a new Example 5 demonstrating exception (e) on a synthetic session-N wrap PR diff modelled on session-50 PR #37. Hooks-checksums.txt is re-baselined for the new slice-reviewer.md SHA.
- **Verification:**
  1. `grep -nc "CLAUDE.md-mandated session wrap docs" .claude/agents/slice-reviewer.md` returns `1` (in criterion 2 sub-clause e).
  2. `grep -nc "HANDOFF-SESSION-{N}.md" .claude/agents/slice-reviewer.md` returns `≥1` (wrap-doc reference in (e)).
  3. `grep -nc "Example 5 — CLAUDE.md-mandated session wrap docs" .claude/agents/slice-reviewer.md` returns `1`.
  4. `grep -E "^\s+e\. " .claude/agents/slice-reviewer.md | head -1` returns the new sub-clause (e) line, confirming numbered-list parity with (a)-(d).
  5. `bash scripts/hooks-checksums.sh --verify` exits 0 (clean baseline; 20 entries; new SHA `10ccfc658fd9f50295a8493a7aa4588a3b3bbae5705dbc667d5a6aa3b9430bd9` for `.claude/agents/slice-reviewer.md`).
  6. `wc -l .claude/agents/slice-reviewer.md` ≤300 (Option C threshold): post-edit 198L.
  7. **Live re-test (post-merge):** A future session-wrap PR that ships `docs/HANDOFF-SESSION-{N}.md` + `docs/SESSION-CONTEXT.md` modifications alongside substantive slice work resolves to `verdict=approve` or `verdict=nit-only` from auto-review's slice-reviewer persona. PR #37 round-1 false-positive pattern does not recur.
- **In scope:**
  - Insert one new sub-clause (e) into criterion 2 §Exceptions list (after (d), before "3. Edge cases.").
  - Append §Example 5 (synthetic session-N wrap PR diff, expected `approve`).
  - Re-baseline `.claude/hooks-checksums.txt` (slice-reviewer.md SHA changes).
  - Slice docs (this file + `verification.md` + `security.md`).
  - Session wrap protocol outputs (`docs/HANDOFF-SESSION-{N}.md` + `docs/SESSION-CONTEXT.md` refresh) when this session wraps — operational scope per CLAUDE.md §"Wrapping up a session" mandate (the very pattern this slice formalises).
- **Out of scope:**
  - Restructuring §Exceptions into a table or YAML block — explicit v3c carry-over per §"Architectural-smell-trigger acknowledgement" above.
  - Extraction of eligibility-check logic to `scripts/criterion-2-exception-check.sh` with shellspec coverage — same v3c carry-over.
  - Modifications to other personas (`acceptance-gate.md`, `ux-polish-reviewer.md`) — deferred to S-F1 measurement per the v3b S-7 sibling-slice precedent.
  - Spec 72c §4 specialist-persona partition cross-ref — multi-agent v2 specialist files must inherit (a)-(e) from this rubric; cross-ref deferred to v3c quality-and-rewrite slice (lands multi-agent v2 impl) per session-48 §Architectural-smell-trigger lesson "build-then-measure → cheaper than measure-then-build".
  - Hardening exception (e) detection against pathological wrap-doc filenames (e.g. `HANDOFF-SESSION-` followed by non-numeric suffix). The persona reads from prose; the regex shape `{N}` is a placeholder for session number, not a code-enforced match. Real-world wrap-doc filenames follow CLAUDE.md naming convention strictly.
- **Opens blocked:** PR #37 must merge first for this PR's diff to apply cleanly to main without conflict.
- **Loveable check:** A session ends; the wrap protocol fires; HANDOFF + SESSION-CONTEXT update on the same branch as the session's substantive work; the resulting PR auto-review fires once, picks up the substantive AC scope correctly, and treats wrap docs as operational scope. The session-50 PR #37 round-1 false-positive does not recur. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + post-merge re-test on the next session's wrap PR.

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-28 | Author (session 50) | Draft | Single AC; motivating finding from PR #37 (session 50) auto-review verdict `block / architectural` quoted verbatim in §Context. |
