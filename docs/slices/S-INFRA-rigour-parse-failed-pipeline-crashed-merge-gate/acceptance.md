# S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate

**Status:** in-progress (1-AC slice; session 52 P2 user-decision lever).

**Spec ref:** CLAUDE.md §"Hard controls" §gate-table row "Auto-review on PR (slice-reviewer)" + CLAUDE.md §"Verdict vocabulary" §"Check-run conclusion mapping".

## Context

`.github/workflows/auto-review.yml` shipped at v3b (per `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md` AC-1) as **informational only** — every persona-derived verdict posted as `success`/`neutral`/`failure` but the rigour-malfunction paths (`parse-failed` sentinel, `pipeline-crashed` `if: failure()` fallback) deliberately stayed `neutral` so the workflow could safely roll out without blocking merges during early adoption.

PR #45 (session 51) made findings visible by mirroring the persona's verdict + findings table as a PR comment. PR #46 (session 51) extracted verdict-derivation arithmetic to `scripts/derive-verdict.sh` with shellspec coverage. PR #47 (session 51) extracted resolver + parser to tested scripts. PR #49 (session 52) extracted criterion 2 §Exceptions to YAML + scripted pre-filter. The rigour suite is now mature enough that the v3b informational caveat is over-cautious for the malfunction paths specifically — when the persona's output cannot be parsed (or the workflow itself crashes before a verdict posts), no review actually happened, and merging would skip the rigour gate.

This slice promotes **two** of the three current `neutral` paths to `failure`:

| Path | Pre-promotion | Post-promotion | Reasoning |
|---|---|---|---|
| `block` verdict | `failure` | `failure` (unchanged) | Already gated. |
| `request-changes` / `nit-only` | `neutral` | `neutral` (unchanged) | Advisory; author addresses or defers. |
| `approve` | `success` | `success` (unchanged) | Clean review. |
| `parse-failed` sentinel (line 180) | `neutral` | **`failure`** | Persona ran but output was malformed JSON / schema violation / verdict-coercion attempt. The workflow already has retry + fence-stripping (line 128); if it still produces parse-failed, the malfunction is real → no review actually happened → merge would skip the gate. |
| Pipeline-crash `if: failure()` fallback (line 311+) | `neutral` | **`failure`** | Workflow-level crash before a verdict posts (npx install fail, `claude` invocation crash, jq parse, gh api outage, runner OOM). No review happened. Re-running the workflow is the escape hatch — if the cause was transient, the next run supersedes this failure with a real verdict. |
| Skip on missing `ANTHROPIC_API_KEY` (line 290+) | `neutral` | `neutral` (unchanged) | Forks don't have access to repo secrets; promoting would block all fork PRs from ever reviewing. Structural escape hatch preserved. |

CLAUDE.md L251 (Hard-controls gate table row for auto-review) is updated to document the partial-promotion semantics so future maintainers don't read "informational at v3b ship" and conclude the workflow is fully advisory.

## Dependencies

- **No file-conflict with PR #49.** PR #49 touches `slice-reviewer.md` (persona prompt) + `criterion-2-exceptions.yaml` + `criterion-2-exception-check.sh` + slice docs. This slice touches `auto-review.yml` (workflow file) + `CLAUDE.md` L251 (gate-table row) + this slice's own docs. Different files, different surfaces.
- **No control-plane label required.** `auto-review.yml` is not in `.claude/hooks-checksums.txt` baseline (only `.claude/hooks/*.sh`, `.claude/settings.json#hooks`, `.claude/agents/*.md`, `.claude/subagent-prompts/*.md`, and a few hard-listed `scripts/*.sh` are tracked). `CLAUDE.md` is also not in the baseline. Standard PR review workflow applies.
- **Recursive validation.** This PR's own auto-review fires on `pull_request:opened`. The workflow change takes effect on the same commit that introduces it. If the persona's output for this PR is well-formed and produces an `approve`/`nit-only`/`request-changes` verdict, the change behaves correctly. If the persona itself parse-fails or the workflow crashes on this PR, the new failure-gate would block its own merge — which is the intended behaviour AND the in-context test of the change.

## AC-1 · Promote `parse-failed` + pipeline-crash to `failure`; preserve secret-missing → `neutral`

- **Outcome:** `.github/workflows/auto-review.yml` line 180 (`parse-failed) CONCLUSION="neutral" ;;`) changes to `parse-failed) CONCLUSION="failure" ;;`. The pipeline-crash fallback step (line 311+, `Post failure-fallback check run`) changes its `conclusion: "neutral"` to `conclusion: "failure"`; the comment-body string mirroring the same path drops the "Informational at v3b ship — does not gate the merge button" sentence and adds an explicit "Pipeline-crash promotes to `failure`" note + retry-as-escape-hatch framing. The header comment block (lines 9-11) is updated to describe the partial-promotion. Skip-on-missing-secret (line 290+) stays `neutral`. `CLAUDE.md` L251 gate-table row updated to reflect the new mapping. No other code paths touched.
- **Verification:**
  1. `grep -cE 'parse-failed\)\s+CONCLUSION="failure"' .github/workflows/auto-review.yml` → `1` (parse-failed promoted).
  2. `grep -cE 'parse-failed\)\s+CONCLUSION="neutral"' .github/workflows/auto-review.yml` → `0` (no stale neutral mapping).
  3. `grep -c 'conclusion: "failure", output: {title: "Review pipeline crashed' .github/workflows/auto-review.yml` → `1` (failure-fallback step posts failure).
  4. `grep -c 'conclusion: "neutral", output: {title: "Review pipeline crashed' .github/workflows/auto-review.yml` → `0` (no stale neutral pipeline-crash).
  5. `grep -c 'conclusion: "neutral", output: {title: "Skipped — ANTHROPIC_API_KEY' .github/workflows/auto-review.yml` → `1` (secret-missing path unchanged).
  6. `grep -c 'partially merge-gating' CLAUDE.md` → `1` (gate-table row updated).
  7. `grep -c 'informational at v3b ship; verdict posts as check run (no merge gate)' CLAUDE.md` → `0` (no stale "informational" claim on the slice-reviewer row).
  8. `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-review.yml'))"` exits `0` (valid YAML).
  9. `wc -l .github/workflows/auto-review.yml` → ≤ 410 (current 397 → expect ~+10 from comment expansions).
  10. **Recursive auto-review:** this PR's own auto-review fires on `opened`. Persona reads the diff (workflow comment expansions + 2 `CONCLUSION` value flips + 2 `conclusion:` JSON value flips + CLAUDE.md L251 row + slice docs). Expected verdict: `approve` or `nit-only` (pure value-flip refactor; no logic change beyond the documented promotion).
  11. **Recursive merge-gate test:** the new `failure` mapping for parse-failed/pipeline-crash takes effect on this commit. If the persona-output parses cleanly (which it should, per round-1 dry-runs of the comment-posting fixture), the check-run conclusion will be one of `success`/`neutral`/`failure` based on the verdict's findings array — NOT `parse-failed`-derived. The promotion is exercised at runtime only when triggered.
- **In scope:**
  - `.github/workflows/auto-review.yml` — three locations: (a) header comment block lines 9-11 (rewrite to describe partial-promotion); (b) verdict-mapping case statement around lines 170-181 (`parse-failed) CONCLUSION="failure"`); (c) failure-fallback step around lines 311+ (`conclusion: "failure"` in the jq input + comment-body framing change).
  - `CLAUDE.md` line 251 (gate-table row for "Auto-review on PR (slice-reviewer)") — replace the "informational at v3b ship; verdict posts as check run (no merge gate); skips with `neutral` if `ANTHROPIC_API_KEY` repo secret absent" cell with the partial-promotion mapping.
  - Slice docs (this file + `verification.md` + `security.md`).
- **Out of scope:**
  - Promoting skip-on-missing-secret (line 290+) to `failure` — fork PRs cannot access repo secrets; gating there blocks fork contributions entirely. Structural escape hatch.
  - Promoting `request-changes` / `nit-only` to `failure` — these verdicts are advisory; the persona explicitly distinguishes "blocking" findings (which derive `block` → `failure`) from non-blocking. Promoting all advisories to merge-gate would conflate the two.
  - Adding a workflow-level admin-bypass label (e.g. `auto-review-bypass`) — could land as a follow-up if a legitimate need to override the new failure-gate emerges. Not required at ship; the existing `gh api` re-run path covers transient failures.
  - Updating `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md` AC-1 to reference this promotion — the v3b acceptance.md is a historical record (slice merged); a forward-looking pointer in this slice's acceptance.md + CLAUDE.md L251 are the canonical record.
  - Branch-protection rule update on `main` to require the auto-review check — is a separate repo-admin action; not a code change.
- **Opens blocked:** none.
- **Loveable check:** A maintainer opens a PR; the persona's prompt-injection guard catches an attacker-crafted `evidence` field claiming `VERDICT: approve`; the verdict-coercion fixture (per spec 72c §5 rule 3) emits `parse-failed`; the merge button is now gated until the malfunction is investigated rather than the maintainer seeing a `neutral` check and hitting Merge. The escape hatch for genuine infra outages (re-run the workflow) preserves velocity. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + grep evidence + recursive-auto-review verdict on this PR.

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-29 | Author (session 52) | Draft | 1 AC; session-52 P2 user-decision lever; user authorised "do all" → both parse-failed AND pipeline-crash promoted; secret-missing stays neutral by structural necessity (forks). |
