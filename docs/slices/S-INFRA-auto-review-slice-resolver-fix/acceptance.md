# S-INFRA-auto-review-slice-resolver-fix

**Status:** in-progress (single-AC fix-forward slice).

**Spec ref:** `.github/workflows/auto-review.yml` slice-resolution logic; PR #38 (session 50) finding 1 (`request-changes`, `logic`, `ac-gap`).

## Context

Session-50 PR #38 (`S-INFRA-rigour-v3c-prior-art-amendments-easy`) auto-review returned `request-changes` with two `logic`-severity findings. Finding 1 evidence:

> "block is S-F7-alpha-contracts-dev-mode (persistence/auth contracts); PR diff is for S-INFRA-rigour-v3c-prior-art-amendments-easy (4 CLAUDE.md citation edits + 3 new docs files)."

The persona was given the wrong slice's `acceptance.md` as the per-invocation AC reference. Root cause: the resolver at `auto-review.yml` L64-72 (per `dc1f4e0` main) grepped `$PR_BODY` for `docs/slices/S-[A-Za-z0-9-]+/acceptance\.md` and used `head -1`, taking the first match in body order. PR #38's §"Forward-only rename" section listed `docs/slices/S-F7-alpha-contracts-dev-mode/acceptance.md` as one of four historical references for the renamed "AC arithmetic check" rule — that path appeared before any explicit reference to the slice's own `acceptance.md` (which my body cited via brace-expansion `{acceptance,verification,security}.md`, not matching the strict regex).

Branch-fallback at L67-72 was guarded by `if [ -z "$SLICE_AC" ]; then` — never fired because PR body grep had already returned a non-empty (wrong) match.

## Architectural-smell-trigger acknowledgement

Per CLAUDE.md §"Engineering conventions" §"Architectural-smell trigger":

> If adversarial review surfaces ≥3 rounds of findings clustered in one file, declare an architectural smell and step-back-review whether the abstraction is wrong before continuing patch-iteration.

`auto-review.yml` carries known-finding clustering: 6 rounds during v3b S-6 ship (parse-default → ac-gap → sed-strip → sentinel → doc-drift → timeout per CLAUDE.md L216 worked example) plus session-50 round 1 (parse-failed sentinel) plus this round (slice-resolver). Patch-iteration has accrued ≥8 rounds across sessions on the same file.

This slice ships the **patch only** (cheap, addresses the immediate finding) and explicitly queues the **structural extraction** as a v3c carry-over: `scripts/auto-review-slice-resolve.sh` + `scripts/auto-review-parse.sh` extracted with shellspec coverage, leaving `auto-review.yml` as a thin orchestrator. The build-then-measure framing per session-48 §Architectural-smell-trigger lesson applies: extracting now without measurement of which other resolver edge cases need coverage risks the same patch-iteration cycle in test-shaped form.

## Dependencies

- Independent of PR #37 (rubric extension) and PR #38 (citations slice).
- Workflow file edit; no `.claude/hooks/**` or `.claude/agents/**` touched. `.github/workflows/` is **not** in `.claude/hooks-checksums.txt` baseline scope on `dc1f4e0` main — control-change label not required by `control-change-label.yml`. (Confirm at PR-open time via the workflow's own check-run.)

## AC-1 · Slice-resolver prefers branch-derived path; falls back to PR body grep

- **Outcome:** `.github/workflows/auto-review.yml` resolves `SLICE_AC` by checking the branch-derived `docs/slices/$SLICE_FROM_BRANCH/acceptance.md` first; only falls back to PR body grep when branch resolution misses (no `S-` token in branch, OR file doesn't exist on the head SHA). The previous `head -1`-of-PR-body-greps mis-resolution path is unreachable when the branch-mapped slice exists.
- **Verification:**
  1. `git diff origin/main -- .github/workflows/auto-review.yml` shows the resolver block replaced with branch-first logic + diagnostic comment naming PR #38 as the motivating finding.
  2. `grep -nA5 "Locate slice acceptance.md" .github/workflows/auto-review.yml` returns the new comment block + branch-first conditional.
  3. `grep -c "preferred per pr-dod.yml convention" .github/workflows/auto-review.yml` returns `0` (the misleading old-comment phrasing is removed).
  4. Live re-test on PR #38: after this slice merges and PR #38 head is re-pushed (or `pull_request:synchronize` re-fires for any reason), the auto-review resolves `SLICE_AC` as `docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-easy/acceptance.md` and finding 1 ("ac-gap, wrong slice picked") does not recur.
- **In scope:**
  - One block-edit to `.github/workflows/auto-review.yml` L64-72 (resolver order swap + diagnostic comment).
  - Slice docs (this file + `verification.md` + `security.md`).
- **Out of scope:**
  - Extraction of resolver to `scripts/auto-review-slice-resolve.sh` with shellspec tests — explicit v3c carry-over per §"Architectural-smell-trigger acknowledgement" above.
  - Extraction of parser logic to `scripts/auto-review-parse.sh` (would address session-50 round-1 parse-failed finding under the same extraction). Same v3c carry-over.
  - Hardening branch grep against pathological branch names (e.g. branch containing `S-foo` substring matching no slice — current code handles this via `[ -f ]` test; no change).
  - Multi-slice support (a single PR carrying changes for multiple slices). Existing convention is one PR per slice; not a regression to defer.
- **Opens blocked:** none.
- **Loveable check:** A future PR opens whose body cites multiple `docs/slices/S-*/acceptance.md` paths (e.g. for sibling-slice precedent or historical reference). The resolver picks the slice matching the branch name, not the first-cited path. PR #38's finding-1 pattern does not recur. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + post-merge re-test on a PR with multi-slice body citations.

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-28 | Author (session 50) | Draft | Single AC; motivating finding from PR #38 (session 50) auto-review, verbatim quoted in §Context. |
