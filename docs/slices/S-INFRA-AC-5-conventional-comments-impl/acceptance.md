# S-INFRA-AC-5-conventional-comments-impl

**Status:** in-progress (single-AC structural slice; cascades through 5 files of touch surface).

**Spec ref:** [Conventional Comments](https://conventionalcomments.org/) verbatim adoption per session-49 prior-art audit (audit ID N) carried into PR #38 §AC-5 deferred scope-marker.

## Context

Session-49 prior-art audit recommended adopting the Conventional Comments vocabulary verbatim for the persona output schema, replacing the prior `verdict × severity` matrix (`approve / nit-only / request-changes / block × architectural / logic / style / none`). PR #38 (`S-INFRA-rigour-v3c-prior-art-amendments-easy`) carried this as AC-5 with a deferred scope-marker; session 50 P0b-easy → P0b-easy implementation lands here.

The audit framing: replace per-PR `verdict + severity` with per-finding `label + (blocking)`. Top-level verdict is **derived** from findings, not emitted by personas — aligns with Conventional Comments' per-comment-label convention (the standard does not have a PR-level verdict abstraction; the verdict is what we synthesise for GitHub check-run mapping).

## Dependencies

- **Independent of PR #37 + PR #40** (criterion 2 §Exceptions extension). Different region of `slice-reviewer.md` (this slice touches §Output format L30+; PR #37 touches criterion 2 §Exceptions L11+). Merge order does not matter; either can land first.
- **Conflict surface with PR #37 + PR #40 §Examples blocks.** PR #37 renumbers §Example 3 → 4 + adds §Example 3 (deferred-slice case). PR #40 adds §Example 5 (wrap-docs case). All §Example blocks contain JSON output blocks using the **prior** `{verdict, severity, findings[]}` schema. This slice does NOT update the §Examples blocks — they will be migrated to the new `{summary, findings[]}` shape in a follow-on PR after PR #37 + PR #40 merge. Documented as out-of-scope below.
- **Control-plane change.** All three persona files are L199-protected. Hash re-baselined: `acceptance-gate.md` `889374b6…` → `03dbb343…`; `slice-reviewer.md` `2e8f3c7e…` → `74968e93…`; `ux-polish-reviewer.md` `41cd40b8…` → `017fa224…`.

## Architectural-smell-trigger acknowledgement

This slice cascades through 5 files (CLAUDE.md, spec 72c, 3 personas, auto-review.yml). The schema-of-record is now defined at three layers (CLAUDE.md spec → spec 72c §5 aggregation rule → persona output formats) with consumer code in auto-review.yml. Per CLAUDE.md §"Architectural-smell trigger": adversarial review on this PR is the first round; if subsequent rounds surface schema-edge-case findings (e.g. unhandled label combinations, blocking-OR semantics in dedup), the cheaper move is to extract the verdict-derivation logic to a tested unit (`scripts/derive-verdict.sh` with shellspec coverage on representative findings JSON inputs). Queued as v3c carry-over.

## AC-1 · Conventional Comments vocabulary adopted across spec + personas + workflow parser

- **Outcome:** All review-emitting subagents output findings using the [Conventional Comments](https://conventionalcomments.org/) vocabulary (`praise / nitpick / suggestion / issue / todo / question / thought / chore / note`) with optional `(blocking)` decoration. Top-level `verdict` is derived deterministically by `auto-review.yml` from the `findings` array per CLAUDE.md §"Verdict vocabulary" §"Verdict derivation rules". The prior `verdict + severity` enum on persona output is removed; the workflow no longer reads `.severity` from persona JSON. Check-run conclusion mapping unchanged (`block` → failure; `request-changes`/`nit-only` → neutral; `approve` → success).
- **Verification:**
  1. `grep -nc "Conventional Comments" CLAUDE.md` ≥ 1 (in §"Verdict vocabulary").
  2. `grep -c "Verdict derivation rules" CLAUDE.md` ≥ 1.
  3. `grep -c "conventionalcomments.org" CLAUDE.md docs/workspace-spec/72c-multi-agent-review-framework.md .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md` ≥ 5 (all 5 files cite the standard).
  4. `grep -c '"label":' .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md` ≥ 3 (output schema in each persona).
  5. `grep -c '"blocking":' .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md` ≥ 3.
  6. `grep -c "max-severity" docs/workspace-spec/72c-multi-agent-review-framework.md` returns 0 (the prior aggregation rule is removed).
  7. `grep -c "BLOCKING_COUNT\|ACTION_COUNT\|NIT_COUNT" .github/workflows/auto-review.yml` ≥ 3 (verdict derivation arithmetic).
  8. `bash scripts/hooks-checksums.sh --verify` exits 0 (clean baseline; 20 entries; new SHAs for the 3 persona files).
  9. `wc -l .claude/agents/slice-reviewer.md` ≤ 300 (Option C threshold): post-edit ~155L.
  10. **Live re-test (post-merge):** A future auto-review fires on a PR; persona emits findings with `label` + `blocking` fields (no `verdict` / `severity`); workflow derives the verdict + posts the correct check-run conclusion. PR #37 + PR #38 + PR #40 verdicts replay correctly under the new schema (manual re-trigger or fresh PR).
- **In scope:**
  - `CLAUDE.md` §"Verdict vocabulary" rewrite — replace 4-verdict × 4-severity matrix with Conventional Comments labels + `(blocking)` decoration + verdict-derivation rules + check-run conclusion mapping.
  - `docs/workspace-spec/72c-multi-agent-review-framework.md` §5 verdict-aggregation rewrite — drop max-severity rule; add deterministic derivation rule referencing CLAUDE.md; update specialist envelope JSON example.
  - `.claude/agents/slice-reviewer.md` §Output format rewrite — new schema with `label` + `blocking` per finding; new label-assignment table mapping the 11 categories to default labels + blocking. §Examples 1-4 NOT updated (deferred to PR-#37+#40 merge follow-up; documented inline).
  - `.claude/agents/acceptance-gate.md` §Output format rewrite — same shape; label-assignment table for the 6 categories.
  - `.claude/agents/ux-polish-reviewer.md` §Output format rewrite — same shape; label-assignment table for the 7 categories. §Examples 1-N NOT updated (deferred).
  - `.github/workflows/auto-review.yml` parser rewrite — drop `.severity` extraction; replace `.verdict` extraction with deterministic derivation arithmetic over `.findings[]` (`BLOCKING_COUNT`, `ACTION_COUNT`, `NIT_COUNT` → verdict). Update post-check-run step to drop `SEVERITY` env-var.
  - `.claude/hooks-checksums.txt` re-baseline (3 persona file SHAs change).
  - Slice docs (this file + `verification.md` + `security.md`).
- **Out of scope:**
  - **§Examples block migration** — JSON output blocks in §Examples 1-N across all three persona files use the prior schema. They are NOT updated in this slice because:
    1. §Example renumbering is in flight on PR #37 (Example 3 → 4) + PR #40 (new Example 5 added); merging both before this slice migrates Examples avoids 3-way conflict.
    2. The §Output format section is the schema-of-record for runtime; §Examples are pedagogical. Personas read instructions top-down; the §Output format block precedes §Examples and takes precedence per the explicit "the schema-of-record for your output is this §Output format section" pointer in each persona's §Output format.
    3. Migration is mechanical (find `verdict` + `severity` fields in §Example JSON → replace with `summary` + `findings[].{label,blocking}`); will land as a separate PR (`S-INFRA-AC-5-examples-migration`) after PR #37 + PR #40 + this PR all merge.
  - **Verdict-coercion fixture refresh** under the new schema — `tests/shellspec/verdict-coercion-spec.sh` (or equivalent) is referenced in spec 72c §5 but not currently CI-gated. Refresh deferred to v3c carry-over.
  - **Verdict-derivation logic extraction** to `scripts/derive-verdict.sh` with shellspec coverage — flagged in §"Architectural-smell-trigger acknowledgement"; v3c carry-over per build-then-measure principle.
  - **Auto-review check-run summary field migration** — currently `SUMMARY=$(cat /tmp/findings.json)`; the findings JSON shape changes (label/blocking instead of verdict/severity) so the summary content evolves automatically. No additional rendering logic needed in this slice.
  - **Persona prompt rebalancing** — the new vocabulary may shift the persona's distribution of finding-labels (e.g. fewer `block` outputs because `architectural` mapped 1:1 to `block`, but `issue` + `blocking:true` is now the equivalent). Calibration via the AC-4 retain/drop measurement after first 3 src/ slices ship.
  - **GitHub PR review-comment posting** — Conventional Comments was originally designed for line-level PR review comments; this slice keeps the per-PR check-run rendering. Per-line CC comment posting is a separate v3c slice if/when valuable.
- **Opens blocked:** §Examples migration follow-on PR depends on PR #37 + PR #40 merging first.
- **Loveable check:** A future auto-review fires; the persona emits structured Conventional Comments findings (`{"label": "issue", "blocking": true, "category": "scope-creep", ...}`); the workflow derives the verdict + posts the right check-run; the author reads the finding and immediately understands "this is a blocking issue that needs fixing" vs "this is a non-blocking suggestion to consider" — the labels carry intent more clearly than the prior `severity: logic` did. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + post-merge live re-test on the next auto-review PR cycle.

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-28 | Author (session 50) | Draft | Single AC; cascades 5 files; structural schema change. §Examples migration deferred to follow-on. |
