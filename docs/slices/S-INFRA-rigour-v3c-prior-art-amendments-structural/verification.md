# S-INFRA-rigour-v3c-prior-art-amendments-structural — Verification

**Slice:** S-INFRA-rigour-v3c-prior-art-amendments-structural
**Acceptance ref:** `docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-structural/acceptance.md` AC-1 through AC-3
**Status at draft:** PENDING — AC freeze pending user confirmation; impl not yet started.

---

## AC table

| AC | Audit ID | Status | Evidence |
|---|---|---|---|
| AC-1 — CODEOWNERS migration (replaces 3 controls) | H+G | PENDING | §"AC-1 evidence" below (populated at impl) |
| AC-2 — pre-commit-verify deprecation (Option α drop) | G | PENDING | §"AC-2 evidence" below (populated at impl) |
| AC-3 — Arch-smell trigger reframe (full rewrite) | B | PENDING | §"AC-3 evidence" below (populated at impl) |

## Pre-flight setup (one-time user action — required before AC-1 PASS)

User runs (once, before this slice's PR is merged):

```
gh api -X PATCH \
  /repos/rossdelarge247-debug/construct_d_01/branches/main/protection \
  -F required_pull_request_reviews.require_code_owner_reviews=true
```

Verification:

```
gh api /repos/rossdelarge247-debug/construct_d_01/branches/main/protection \
  --jq '.required_pull_request_reviews.require_code_owner_reviews'
```

Expected: `true`.

If this setting is not on at merge time, AC-1 is NOT satisfied — CODEOWNERS file would exist but enforce nothing. Slice ships in disabled state until the setting is enabled.

## AC-1 evidence (CODEOWNERS migration)

Populated post-impl. Expected verification points:

1. `git ls-files .github/CODEOWNERS` returns the path; file content lists union of L199 regex paths + hooks-checksums.txt paths with owner `@rossdelarge247-debug`.
2. `gh api .../branches/main/protection --jq '.required_pull_request_reviews.require_code_owner_reviews'` → `true`.
3. Test PR: synthetic PR (or this slice's own merge PR) touching `.claude/hooks/session-start.sh` shows "Code owner review required" in GitHub UI Reviewers panel. **Solo-operator caveat:** merge requires conscious admin-bypass click ("Merge without waiting for required review") because user is sole code-owner AND PR author via agent harness; GitHub's "author cannot approve own PR" rule cannot be bypassed by toggling settings. The admin-click IS the rigour gate. See `security.md` item 10 for full caveat + acceptance.md AC-1 step 3.
4. `git ls-files .claude/hooks-checksums.txt scripts/hooks-checksums.sh .github/workflows/control-change-label.yml` → 0 matches (all removed).
5. `bash .claude/hooks/session-start.sh` no longer emits the §"Hooks-checksums drift warning" section.
6. `grep -c "Hooks-checksums drift warning\|Control-change label requirement" CLAUDE.md` → 0 (rows removed); `grep -c "CODEOWNERS code-owner review" CLAUDE.md` → 1 (replacement row added).

## AC-2 evidence (pre-commit-verify drop)

Populated post-impl. Expected verification points:

1. `git ls-files .claude/hooks/pre-commit-verify.sh` → 0 matches (file removed).
2. `jq '.hooks.PreToolUse | map(select(.matcher | contains("git commit")))' .claude/settings.json` → no entry referencing `pre-commit-verify.sh`.
3. `git ls-files .github/workflows/pr-dod.yml` → 1 match (CI gate unchanged; remains canonical DoD enforcer).
4. `grep -c "Slice-DoD pre-commit" CLAUDE.md` → 0 (row removed); replacement prose note re-states CI-only enforcement.
5. Test commit: edit a `.claude/hooks/*.sh` file + `git commit` → no `pre-commit-verify.sh` output emitted (hook absent).

## AC-3 evidence (arch-smell reframe)

Populated post-impl. Expected verification points:

1. `grep -c "≥3 rounds\|three rounds\|round.counting" CLAUDE.md` → 0 in §"Architectural-smell trigger" section (legacy text removed).
2. `grep -c "interest payment rather than principal" CLAUDE.md` → 1 (replacement text contains literal Cunningham/Fowler-style frame).
3. `grep -c "judgement is the gate" CLAUDE.md` → 1 (qualitative-frame literal preserved).
4. v3b S-6 worked example (auto-review.yml 6-round case) preserved in CLAUDE.md as illustrative narrative — `grep -c "auto-review.yml" CLAUDE.md` → ≥1 in §"Architectural-smell trigger".
5. `grep -rn "≥3 rounds" .claude/agents/ .claude/subagent-prompts/` → 0 matches (rule lives only in CLAUDE.md; persona files reference by section ref only).

## Diff profile

Populated post-impl. Expected:

- `.github/CODEOWNERS` — new file (~15L)
- `.claude/hooks-checksums.txt` — removed (-19L)
- `scripts/hooks-checksums.sh` — removed (~-50L)
- `.github/workflows/control-change-label.yml` — removed (~-80L)
- `.claude/hooks/pre-commit-verify.sh` — removed (~-50L)
- `.claude/hooks/session-start.sh` — `-30L` (Hooks-checksums drift warning block removed)
- `.claude/settings.json` — `-3L` (PreToolUse hook entry removed)
- `CLAUDE.md` — net `~-50L` (two L199 rows removed + arch-smell paragraph rewrite +5L net)
- `docs/tdd-exemption-allowlist.txt` — `+3L` (slice-path exemption entries per Pre-flight notes)
- `docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-structural/{acceptance,verification,security}.md` — new files (~+250L combined)

**Net:** ~−300L production / +250L docs = ~−50L total.

## DoD trace (CLAUDE.md §"Engineering conventions" §"Definition of Done")

1. **AC met with evidence** — Populated at impl. AC-1/2/3 verification points above.
2. **Tests written and passing** — N/A. Pure config/control-plane removal; no logic surface; per CLAUDE.md §"Don't write file-content assertions for logic slices" the per-AC grep verifications above are the appropriate evidence form. Slice path added to `docs/tdd-exemption-allowlist.txt` under `pure-config:` category at impl time.
3. **Adversarial review done** — Live `auto-review.yml` (slice-reviewer persona) fires on PR open. Pre-PR-open author review per spec 72b §"Use when" Option C (acceptance.md <300L; single-spawn).
4. **Preview deploy verified in-browser** — N/A (no UI surface).
5. **No regression in adjacent slices** — Verified at impl. Expected: `pr-dod.yml` CI checks remain green (unchanged); `auto-review.yml` runs against the persona files (untouched in this slice); shellspec suite unchanged. The legacy `control-change-label.yml` workflow is removed atomically with the CODEOWNERS replacement so there is no enforcement-gap window.
6. **Slice's open 68f/g entries resolved or deferred** — none blocked.

Security checklist evidence: see `security.md` in this slice directory.

## Adversarial review status

- **Pre-PR-open:** Single-turn Option C inline-content per spec 72b §"Use when" (acceptance.md 132L < 300L threshold). Findings recorded inline in this verification.md §Adversarial review log at impl time.
- **Live auto-review (slice-reviewer.md):** Fires on PR open. This slice removes control-plane scaffolding; expect persona to scrutinise the rollback procedure, the union-of-paths CODEOWNERS scope, and the no-enforcement-gap claim. Convergence expected ≤2 rounds per the slice's own AC-3 (forward-applied: judgement-based clustering, not numeric round-count).
- **`control-change` label REQUIRED.** This is the LAST PR to honour `control-change-label.yml`; the workflow itself is removed in the same PR. Apply label before merge.

## Adversarial review log

| Round | Reviewer | Verdict | Findings | Resolution |
|---|---|---|---|---|
| _(populated at impl)_ | | | | |

## Rollback

Per the §Rollback procedure noted in each AC. Consolidated here:

**AC-1 (CODEOWNERS migration) rollback:**
1. `git revert -m 1 <merge-sha>` in a new PR — restores `.claude/hooks-checksums.txt`, `scripts/hooks-checksums.sh`, `.github/workflows/control-change-label.yml`, `.claude/hooks/session-start.sh` §Hooks-checksums block, `CLAUDE.md` L199 rows, and removes `.github/CODEOWNERS`.
2. User runs (one-time): `gh api -X PATCH /repos/rossdelarge247-debug/construct_d_01/branches/main/protection -F required_pull_request_reviews.require_code_owner_reviews=false` — disables the branch-protection setting.
3. Revert PR carries `control-change` label (legacy machinery is back in scope after revert).
4. Document WHY in revert PR body so future sessions can address root cause rather than re-attempt blindly.

**AC-2 (pre-commit-verify drop) rollback:**
1. `git revert -m 1 <merge-sha>` in a new PR — restores `.claude/hooks/pre-commit-verify.sh` + `.claude/settings.json` hook registration + `CLAUDE.md` L199 row.
2. No GitHub setting toggle required (hook is local-machine machinery only).
3. Document WHY in revert PR body.

**AC-3 (arch-smell rewrite) rollback:**
1. `git revert -m 1 <merge-sha>` in a new PR — restores numeric round-count rule in `CLAUDE.md` §"Architectural-smell trigger".
2. No tooling impact (qualitative-vs-numeric is documentation-only behaviour change).
3. Document WHY in revert PR body.

**Combined merge-revert (whole slice):** if all three need rollback simultaneously, single `git revert -m 1 <merge-sha>` PR with `control-change` label + the AC-1 `gh api` setting toggle. No `--no-verify` bypass needed — `git revert` doesn't trigger PreToolUse hooks (harness-level; intercept Bash invocations of `git commit`, not GitHub-side PR merges).

## Sign-off

- **Verified by:** {populated post-merge}
- **Date:** {populated post-merge}
- **Commit SHA:** {populated post-merge}
- **Outstanding issues:** {populated post-merge}
- **DoD item 4 status:** N/A (no UI surface).
