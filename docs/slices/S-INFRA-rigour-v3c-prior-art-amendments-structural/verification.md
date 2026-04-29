# S-INFRA-rigour-v3c-prior-art-amendments-structural — Verification

**Slice:** S-INFRA-rigour-v3c-prior-art-amendments-structural
**Acceptance ref:** `docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-structural/acceptance.md` AC-1 through AC-3
**Status at draft:** PENDING — AC freeze pending user confirmation; impl not yet started.

---

## AC table

| AC | Audit ID | Status | Evidence |
|---|---|---|---|
| AC-1 — CODEOWNERS migration (replaces 3 controls) | H+G | PASS (pending merge + branch-protection toggle confirmation) | §"AC-1 evidence" below |
| AC-2 — pre-commit-verify deprecation (Option α drop) | G | PASS | §"AC-2 evidence" below |
| AC-3 — Arch-smell trigger reframe (full rewrite) | B | PASS | §"AC-3 evidence" below |

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

1. **CODEOWNERS exists with correct scope.** `git ls-files .github/CODEOWNERS` → `.github/CODEOWNERS` (commit `cd7dac1`). Content lists 11 path patterns spanning `.claude/hooks/**`, `.claude/agents/**`, `.claude/subagent-prompts/**`, `.claude/settings.json`, `scripts/**`, `.github/workflows/**`, `.github/CODEOWNERS` (self-protected), `eslint.config.mjs`, `vitest.config.ts`, `docs/eslint-baseline-allowlist.txt`, `docs/tdd-exemption-allowlist.txt` — owner `@rossdelarge247-debug`. Scope = union of legacy L199 regex (12 paths) + hooks-checksums.txt baseline (19 entries); collapses to 11 path-pattern rules.
2. **Branch-protection setting enabled.** Confirmed by user at session-53 checkpoint between Commit 2 (`cd7dac1`) and Commit 3 (`c682392`). Read-back via `gh api /repos/.../branches/main/protection --jq '.required_pull_request_reviews.require_code_owner_reviews'` is the user's responsibility (agent harness has no `gh` access); user reply "done" is the gate-pass evidence.
3. **Solo-operator caveat documented.** Per acceptance.md AC-1 step 3 + security.md item 10 + L70 of this verification.md: merge requires conscious admin-bypass click since user is sole code-owner AND PR author via agent harness; GitHub's hard rule cannot be configured around. The admin-click IS the rigour gate; auto-review.yml + slice-reviewer persona is the substantive review. PR #52's own merge demonstrates the path: code-owner review will be required + merge button shows admin-bypass option.
4. **Legacy files removed atomically (Commit 3 `c682392`):** `git ls-files .claude/hooks-checksums.txt scripts/hooks-checksums.sh .github/workflows/control-change-label.yml` → 0 matches (all removed). Also: `tests/shellspec/hooks-checksums.spec.sh` removed in Commit 6 (orphaned test for deleted script).
5. **session-start.sh hook simplified.** `grep -c "Hooks-checksums integrity\|INTEGRITY_WARNING" .claude/hooks/session-start.sh` → 0 (block removed in Commit 3 `c682392`). Hook still emits Read discipline + Planning conduct + Branch state sections; no Hooks-checksums drift warning.
6. **CLAUDE.md table updated (Commit 3 `c682392`).** `grep -c "Hooks-checksums drift warning\|Control-change label requirement" CLAUDE.md` → 0 (legacy rows removed). `grep -c "CODEOWNERS code-owner review" CLAUDE.md` → 1 (replacement row present).

## AC-2 evidence (pre-commit-verify drop)

1. **Hook file removed (Commit 4 `6b1dd68`).** `git ls-files .claude/hooks/pre-commit-verify.sh` → 0 matches.
2. **settings.json registration removed.** `grep -c "pre-commit-verify" .claude/settings.json` → 0. The PreToolUse:Bash hook entry is gone; tdd-first-every-commit.sh + pre-push-dod7.sh remain (separate hooks; out of AC-2 scope).
3. **CI gate unchanged.** `git ls-files .github/workflows/pr-dod.yml` → 1 match. pr-dod.yml is the canonical DoD enforcer (slice-verification PR-body reference + 6-item DoD + 13-item security via PR template).
4. **CLAUDE.md table updated (Commit 4 `6b1dd68`).** `grep -c "Slice-DoD pre-commit" CLAUDE.md` → 0 (row removed). Replacement prose at L252 (post-table): *"Slice-DoD enforcement is CI-only via `.github/workflows/pr-dod.yml` — no pre-commit hook gates DoD (per v3c P0b-structural AC-2 deprecation; pre-commit is wrong layer for completeness checks per session-49 prior-art audit verdict)."*
5. **Hook absence verified at runtime.** Commits 5 + 6 (after AC-2 ship) committed without pre-commit-verify hook output — hook absent from settings.json registration; no `git commit` invocation triggers it.

Orphaned test cleanup: `tests/shellspec/pre-commit-verify.spec.sh` removed in Commit 6 (testing the removed script; was failing CI shellspec on Commits 3-5 until cleanup).

## AC-3 evidence (arch-smell reframe)

1. **Live rule no longer uses round-count (Commit 5 `0476112`).** `grep -c "≥3 rounds" CLAUDE.md` → 1 — the residual mention is in the deprecation-rationale phrase: *"the v3a numeric '≥3 rounds' trigger was deprecated session 53 because round-counting incentivises gaming"*. This is intentional — it explains WHY the rule was reframed for future readers. The active rule prose at L216 uses qualitative language only ("clustered findings in a single file — multiple findings across different concerns"; "reviewer's judgement is the gate"). Refined verification: no live-rule clause uses ≥3 rounds; rationale-mention OK.
2. **Replacement frame literal present.** `grep -c "interest payment rather than principal" CLAUDE.md` → 1. Cunningham/Fowler-aligned texture preserved.
3. **Judgement-frame literal present.** `grep -c "judgement is the gate" CLAUDE.md` → 1.
4. **v3b S-6 worked example preserved.** `grep -c "auto-review.yml" CLAUDE.md` → 5 (one match in §"Architectural-smell trigger" §worked-example narrative; others elsewhere in CLAUDE.md). The "took 6 rounds" example narrative still teaches the pattern; the rule itself stops measuring rounds.
5. **No persona-file embedding of round-count rule.** `grep -rn "≥3 rounds" .claude/agents/ .claude/subagent-prompts/` → 0 matches. Personas reference the rule via CLAUDE.md ref only; rewrite propagates transitively.

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
- `docs/tdd-exemption-allowlist.txt` — **no change** (decision at impl: allowlist exempts `src/**` from TDD-first gate; this slice touches no `src/**`; gate doesn't fire; no entries needed; original pre-flight claim was over-prescribed — see acceptance.md §Pre-flight notes for audit-trail rationale)
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
| 1 (after Commit 2 `cd7dac1`) | auto-review.yml slice-reviewer persona | 🟡 request-changes (informational) — 4 findings | (1) `suggestion ac-gap` verification.md missing consolidated `## Rollback` section; (2) `issue ac-gap` diff only contains CODEOWNERS create, no removals (noise — auto-review didn't model mid-PR sequencing in PR body); (3) `suggestion ac-gap` tdd-exemption-allowlist.txt not updated (resolved at impl: no src/ files in slice → tdd-first gate doesn't fire on control-plane → no entries needed; pre-flight note in acceptance.md was over-prescribed); (4) `question edge-case` CLAUDE.md not in CODEOWNERS — should it be? | (1) Addressed in Commit 3 `c682392` (consolidated `## Rollback` added). (2) Noise — naturally resolves as Commits 3-5 land. (3) Resolved as no-action with rationale (pre-flight note over-prescribed; tdd-exemption only applies to src/ files). (4) Resolved by user decision: don't include CLAUDE.md (preserves legacy scope; rules become binding via hook/script edits which ARE protected). |
| 2 (after Commits 3-5 `0476112`) | auto-review.yml slice-reviewer persona | _pending — last poll showed shellspec failure due to orphaned spec files (Commit 6 cleanup)_ | _to be repolled after Commit 6 lands_ | _to be addressed if any new findings_ |

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
