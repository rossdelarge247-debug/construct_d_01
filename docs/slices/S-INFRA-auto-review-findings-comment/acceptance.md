# S-INFRA-auto-review-findings-comment

**Status:** in-progress (3-AC visibility-fix slice; auto-review findings now post as PR comment).

**Spec ref:** CLAUDE.md §"Hard controls > Verdict vocabulary" + auto-review.yml workflow.

## Context

PR #44 (session 51) surfaced a visibility gap: the slice-reviewer persona's findings JSON IS posted by `auto-review.yml`, but it lives in the GitHub check-run's `output.summary` field — buried one click deep behind the Checks tab, rendered as raw JSON not markdown. The author's natural read surface is the PR conversation thread, not the Checks tab. PR #44's praise finding ("Verification point 9: ... closing the integration-test loop at zero extra overhead") was effectively invisible to the human author until manually clicked through.

This slice closes the gap: every auto-review run also posts a PR comment with the findings rendered as a markdown table. Idempotent across pushes via a hidden HTML marker — first push POSTs, subsequent pushes PATCH the same comment in place (no per-push noise accumulation).

Three failure-mode paths each post their own diagnostic comment too: `parse-failed` sentinel (persona output unparseable), pipeline crash (`if: failure()` fallback), and `ANTHROPIC_API_KEY`-absent skip. All three currently post `neutral` check-runs that a distracted reviewer can miss in the Checks list — the comment makes them visible in the PR thread instead.

## Dependencies

- **Independent of PR #44.** Different file surface (`auto-review.yml` vs the 3 persona files). No merge-order dependency.
- **No control-plane touch.** `.github/workflows/auto-review.yml` is not in `.claude/hooks-checksums.txt` (verified at session 50; `permissions:` block edit is workflow scope, not L199 protected scope). `control-change` label not required for this PR.
- **Permissions widening** — workflow's `permissions.pull-requests` goes from `read` → `write` to enable comment-posting. Limited to the GITHUB_TOKEN scoped to this workflow run only; does not affect other workflows or expand bot-account permissions outside this job.

## AC-1 · Auto-review findings posted as PR comment with markdown rendering

- **Outcome:** When the slice-reviewer persona returns a parseable findings array (any verdict — approve / nit-only / request-changes / block), `auto-review.yml` posts a PR comment containing: a verdict headline with emoji + label; the persona's `summary` field as a blockquote (when non-empty); a markdown table with one row per finding (Label, Blocking, Category, Evidence, Remediation); a footer linking to the workflow run + commit SHA + Conventional Comments doc. The author sees this in the PR conversation thread without clicking through to the Checks tab.
- **Verification:**
  1. `grep -nc 'Post findings PR comment (verdict path)' .github/workflows/auto-review.yml` → `1` (the new step exists).
  2. `grep -nc '<!-- auto-review-comment:slice-reviewer -->' .github/workflows/auto-review.yml` → `3` (one in each of the 3 outcome paths: verdict / skip / fallback).
  3. `grep -nc 'Label | Blocking | Category | Evidence | Remediation' .github/workflows/auto-review.yml` → `1` (the markdown-table header in the verdict-path step's jq script).
  4. `grep -nc 'pull-requests: write' .github/workflows/auto-review.yml` → `1` (permission widened from `read`).
  5. `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-review.yml'))"` exits 0 (valid YAML).
  6. **Live re-test (recursive):** this PR's own auto-review fires; the slice-reviewer persona returns findings; the workflow posts a comment to PR #N with the marker + table. Verified by inspection of the PR thread post-merge.
- **In scope:**
  - `.github/workflows/auto-review.yml` permissions block: `pull-requests: read` → `pull-requests: write`.
  - `.github/workflows/auto-review.yml` "Invoke slice-reviewer" step: persist full PERSONA_JSON to `/tmp/persona-output.json` (alongside the existing `/tmp/findings.json`) so the new comment step can read `.summary` + `.findings`.
  - `.github/workflows/auto-review.yml` new step "Post findings PR comment (verdict path)": ~75L; renders verdict headline + summary blockquote + findings table + footer; idempotent find-or-edit by marker.
  - Slice docs (this file + `verification.md` + `security.md`).
- **Out of scope:**
  - Per-line PR review comments (vs the single PR-level comment) — Conventional Comments was originally line-level, but per-line precision is a v3c+ slice if/when source-line context adds value.
  - Promoting `parse-failed` / `pipeline-crashed` to `failure` (merge-gating) — separate decision; this slice keeps the `neutral` check-run conclusion per CLAUDE.md L181 informational-at-v3b-ship contract.
  - Comment-rendering for the `acceptance-gate` + `ux-polish-reviewer` personas — they aren't currently spawned by `auto-review.yml` (acceptance-gate fires at slice completion via `/wrap`; ux-polish-reviewer activates at S-F1 onwards). Their comment-posting will be wired when those spawn paths are activated.
  - Auto-resolving / minimising the comment when verdict goes from `block` → `approve` across pushes — the PATCH-in-place flow already updates the body; resolving the GitHub "outdated comment" UI affordance requires the GraphQL API and isn't in scope.
  - Splitting the comment-posting logic to a dedicated script (`scripts/auto-review-post-comment.sh`) — architectural-smell-trigger queued: this is round 1 of comment-posting touch surface in `auto-review.yml`. If subsequent rounds cluster findings, extract to a tested unit per CLAUDE.md §"Architectural-smell trigger". For now, inline shell is bounded + readable.
- **Opens blocked:** none.
- **Loveable check:** A new author opens a PR; auto-review fires; within ~90 seconds they see a comment in the PR conversation thread: "✅ approve — 0 finding(s)" or a clean markdown table with each finding labelled (issue / suggestion / nitpick / praise) and concrete evidence cells. They never have to click into the Checks tab to discover what the persona thought. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + recursive live re-test in this PR's own auto-review (the comment-posting fires on this very PR).

## AC-2 · Comment is idempotent across pushes (single comment per PR, edited in place)

- **Outcome:** A PR receives one auto-review comment, not N (where N = push count). On `pull_request:synchronize` (every push to an open PR), the workflow finds the existing comment by hidden HTML marker (`<!-- auto-review-comment:slice-reviewer -->`) and PATCHes its body in place; only on the first push (no marker found) does it POST a new comment. Same single marker is used across all 3 outcome paths (verdict / skip / fallback) so a path-switch (e.g. parse-failed → next push succeeds with verdict) updates the same comment rather than orphaning the old.
- **Verification:**
  1. `grep -nc "MARKER='<!-- auto-review-comment:slice-reviewer -->'" .github/workflows/auto-review.yml` → `3` (same marker string in all 3 outcome paths).
  2. `grep -nc 'gh api "repos/\${REPO}/issues/comments/\${COMMENT_ID}" --method PATCH' .github/workflows/auto-review.yml` → `3` (PATCH-in-place branch in all 3 paths).
  3. `grep -nc 'gh api "repos/\${REPO}/issues/\${PR_NUMBER}/comments" --method POST' .github/workflows/auto-review.yml` → `3` (POST-new branch in all 3 paths).
  4. **Live re-test (deferred):** push a second commit to a test PR after this slice merges; verify the comment count remains 1 and the body content updates to reflect the second-push diff. Cannot be tested on this PR alone (single push at PR open).
- **In scope:**
  - Single shared marker string `<!-- auto-review-comment:slice-reviewer -->` across all 3 outcome paths (declared inline; intentional duplication for visibility).
  - `gh api ... | --jq '.[] | select(.body | contains(MARKER)) | .id' | head -n 1` find pattern — returns first match (paginated to handle PRs with >100 comments via `--paginate`).
  - `head -n 1 || true` guards against `set -euo pipefail` exiting on no-match (head's pipe-close on first match would otherwise SIGPIPE jq).
- **Out of scope:**
  - Multi-persona comment differentiation — `:slice-reviewer` suffix in the marker is forward-compatible with `:acceptance-gate` / `:ux-polish-reviewer` markers when those persona spawns are wired in future slices, but this slice only ships the slice-reviewer marker.
  - Comment-deletion on PR close — abandoned PRs leave the comment in place. Cleanup is GitHub UI's concern.
- **Opens blocked:** none.
- **Loveable check:** A reviewer scrolls down a PR and sees ONE auto-review comment with the latest verdict — not 5 comments from 5 pushes interleaved with their own review thread. The signal is preserved; the noise is suppressed. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-2 row + grep evidence; live multi-push test deferred to next session's first push-to-existing-PR.

## AC-3 · Diagnostic comments posted on parse-failed / pipeline-crashed / skip paths

- **Outcome:** When the persona output is unparseable (`parse-failed` sentinel), or the workflow crashes mid-execution (`if: failure()` fallback), or `ANTHROPIC_API_KEY` is absent (skip path), each path posts a PR comment with: an emoji-distinguished diagnostic headline (`⚠️ parse-failed` / `💥 pipeline-crashed` / `⏭️ skipped`); a brief explanation of what the path means; for `pipeline-crashed`, a link to the workflow run log + commit SHA so the author can inspect; a footer noting "informational at v3b ship — does not gate the merge button". Author sees the diagnostic in the PR thread without having to notice the buried `neutral` check-run.
- **Verification:**
  1. `grep -nc '⚠️ parse-failed' .github/workflows/auto-review.yml` → `1` (verdict-path step's case branch for parse-failed verdict).
  2. `grep -nc '💥 pipeline-crashed' .github/workflows/auto-review.yml` → `1` (failure-fallback step's body).
  3. `grep -nc '⏭️ skipped' .github/workflows/auto-review.yml` → `1` (skip-notice step's body).
  4. `grep -nc 'workflow log' .github/workflows/auto-review.yml` → `≥3` (each diagnostic body links the log; existing check-run summaries also link it).
  5. **Live re-test (deferred):** synthetic test PR with `ANTHROPIC_API_KEY` removed (skip path) + synthetic test PR forcing a jq parse failure (parse-failed path) — both require admin to set up; out of scope for this slice's PR but documented as v3c-test-pr fixtures.
- **In scope:**
  - Verdict-path step: when verdict is `parse-failed`, the `case "$VERDICT"` block falls through to the parse-failed headline. Same comment-posting code path; just different headline + summary content.
  - Skip-notice step: appended comment-posting block (~12L) after the existing check-run POST.
  - Failure-fallback step: appended comment-posting block (~14L) after the existing check-run POST.
- **Out of scope:**
  - Auto-retrying the workflow on transient failures (network blip during `npx`, etc.) — the failure-fallback comment surfaces the issue but the author has to manually re-run.
  - Distinguishing "transient" vs "structural" failures in the diagnostic — the comment body suggests "Re-running the workflow may succeed if the cause was transient" but does not auto-classify.
- **Opens blocked:** none.
- **Loveable check:** A workflow crashes mid-run on a PR; instead of the author wondering "did auto-review actually run?" while staring at a green merge button, they see a 💥 pipeline-crashed comment in the PR thread with a direct link to the failing workflow log. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-3 row + grep evidence; live re-test for synthetic crash/skip paths deferred to v3c-test-pr fixtures.

## Architectural-smell-trigger acknowledgement

`auto-review.yml` is now 389L (was 276L pre-PR). 3 outcome paths each with comment-posting logic = ~3 inline jq + gh-api blocks (the marker + find-or-edit pattern duplicated). Per CLAUDE.md §"Architectural-smell trigger": this is **round 1** of session-51 touches to `auto-review.yml`. If subsequent rounds (PR4 derive-verdict extraction; PR5 resolver+parser extraction; future comment-posting iteration) cluster findings, extract the comment-posting + verdict-derivation + parser logic together to `scripts/auto-review-{post-comment,derive-verdict,parse}.sh` with shellspec coverage. Build-then-measure: queued as v3c carry-over; do NOT pre-emptively extract.

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-29 | Author (session 51) | Draft | 3 ACs; visibility-fix; idempotent via marker; covers all 3 outcome paths; permissions widening from `pull-requests: read` to `write`. |
