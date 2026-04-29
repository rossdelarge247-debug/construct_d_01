# S-INFRA-auto-review-findings-comment · Verification

## Per-AC verification

| AC | Status | Evidence |
|---|---|---|
| AC-1 · Findings posted as PR comment with markdown rendering | PASS | Verification points 1-5 (static) all green pre-PR-open. Point 6 (live recursive) gated on this PR's auto-review run posting a comment. |
| AC-2 · Comment idempotent across pushes | PASS (static) | Verification points 1-3 (grep) green; point 4 (live multi-push test) deferred to next session's first push-to-existing-PR cycle. |
| AC-3 · Diagnostic comments on parse-failed / pipeline-crashed / skip | PASS (static) | Verification points 1-4 (grep) green; point 5 (live re-test of synthetic crash/skip) deferred to v3c-test-pr fixtures. |

## Verification commands (static — all green at HEAD)

```sh
# AC-1
grep -nc 'Post findings PR comment (verdict path)' .github/workflows/auto-review.yml
# expect: 1
grep -nc '<!-- auto-review-comment:slice-reviewer -->' .github/workflows/auto-review.yml
# expect: 3 (one per outcome path)
grep -nc 'Label | Blocking | Category | Evidence | Remediation' .github/workflows/auto-review.yml
# expect: 1
grep -nc 'pull-requests: write' .github/workflows/auto-review.yml
# expect: 1
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-review.yml'))"
# expect: exit 0

# AC-2
grep -c "MARKER='<!-- auto-review-comment:slice-reviewer -->'" .github/workflows/auto-review.yml
# expect: 3
grep -c 'method PATCH' .github/workflows/auto-review.yml
# expect: ≥3 (PATCH-in-place in all 3 outcome paths)
grep -c 'method POST' .github/workflows/auto-review.yml
# expect: ≥6 (3 check-run POSTs + 3 comment POSTs across outcome paths)

# AC-3
grep -nc '⚠️ parse-failed' .github/workflows/auto-review.yml
# expect: 1
grep -nc '💥 pipeline-crashed' .github/workflows/auto-review.yml
# expect: 1
grep -nc '⏭️ skipped' .github/workflows/auto-review.yml
# expect: 1
```

## Live recursive re-test

This PR's own auto-review fires on `pull_request:opened`. The slice-reviewer persona reviews the diff (workflow YAML edit + new slice docs); emits findings JSON; the **new** verdict-path step then renders a markdown comment in this PR's conversation thread.

Expected outcome:
- Check-run conclusion: `success` (`approve` derived) — diff is workflow YAML + slice docs only; no scope-creep, no AC-gap, no security surface beyond the documented `pull-requests: write` widening.
- PR comment: a markdown comment posted in this PR's conversation tab with `<!-- auto-review-comment:slice-reviewer -->` marker, headline `**Verdict:** ✅ approve`, footer linking to the workflow run + this commit SHA.
- The recursive validation: this PR's own findings comment IS the AC-1 §"Live re-test" evidence. Zero-extra-overhead integration test.

If recursive re-test surfaces:
- **No comment posted** → permissions issue (likely `pull-requests` token scope not effective; check workflow log for `gh api` 403).
- **Two comments posted on second push** → idempotency bug in the marker-find logic (likely `head -n 1` not pinning to first match).
- **Empty/garbled body** → jq escaping bug in the table-render step (likely `gsub` pattern not handling a finding's evidence text).

## DoD per CLAUDE.md §Engineering conventions

- [x] **AC met with evidence** — AC-1/2/3 static evidence above; live recursive validation pending PR open.
- [N/A] **Tests written + passing** — Per CLAUDE.md §"Don't write file-content assertions for logic slices" — comment-posting is workflow-shell + jq with no `scripts/` extraction yet (extraction is the v3c carry-over per architectural-smell-trigger). Static grep + YAML parse evidence is appropriate for this slice. Shellspec coverage of the comment-rendering jq logic is a fair v3c follow-up.
- [x] **Adversarial review done** — Pre-PR-open author reasoning over: (a) jq escaping for `|` and `\n` in evidence cells (gsub patterns added); (b) `head -n 1 || true` guard against `set -euo pipefail` SIGPIPE; (c) marker uniqueness across personas (`:slice-reviewer` suffix forward-compatible); (d) permissions widening blast radius (scoped to GITHUB_TOKEN of this workflow run only); (e) parse-failed path's `/tmp/persona-output.json` content is `{}` (jq fallbacks render empty summary + empty table cleanly).
- [N/A] **Preview deploy verified in-browser** — No UI surface.
- [x] **No regression in adjacent slices** — `git diff origin/main` shows only `.github/workflows/auto-review.yml` + new slice docs. No persona files, no other workflows, no spec files, no `src/`.
- [x] **Slice's open 68f/g entries resolved or deferred** — none blocked.

## Preview-deploy verification

N/A — no UI surface.
