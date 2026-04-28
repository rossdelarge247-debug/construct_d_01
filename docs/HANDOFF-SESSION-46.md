# HANDOFF — Session 46

**Session focus:** v3b S-5 review-driven fixes — round 2 (sub-spawn re-spawn surfaced 6 hook bugs) → round 3 (CI exposed 2 latent bugs the entire prior review chain missed) → Vercel lockfile unblock. PR #27 merged.

**Branch:** `claude/land-pr26-v3b-s5-5hFoW` @ `5e184b4` → squash-merged to `main` as `189996f`. PR closed.
**PR:** [#27](https://github.com/rossdelarge247-debug/construct_d_01/pull/27) merged after marking ready-for-review at `5e184b4`.
**Predecessor (session 45):** `b88e7d8` (v3b S-5 ship + 6f30870 + e866240 lockstep).

---

## What happened

**Round 2 — sub-spawn re-spawn with file-per-spawn scope.** Session 45 deferred sub-spawns 2-6 (test + doc surfaces) due to the 300L per-turn read-cap. This session re-spawned six fresh agents (one file per spawn) per spec 72b 4th-option drafted in v3c carry-over. Sub-spawn 1-redux on `pre-push-dod7.sh` succeeded with full file access and surfaced **2 architectural blockers + 4 logic findings** the original review missed. Sub-spawns 2-6 hit the same read-cap structural issue (~298L of system-reminder prelude consumes the budget before file reads) — captured definitively as v3c need.

**Six findings actioned in `fedaeed`:**

| # | Severity | Fix |
|---|---|---|
| #3 | architectural | Repo regex `[^/.]+` truncated `org/repo.js` → broke gh API. New regex permits `.` + strips optional `.git` suffix + REPO shape validation. |
| #7 | architectural | gh API failure (rate-limit/5xx/network) was blocking every push. Distinguished gh-exit-non-zero (warn-pass) from gh-zero-with-empty-body (block); stderr captured separately. |
| #1 | logic | jq-missing fail-loud (`command -v jq` precondition + BLOCKED + exit 2) on both hooks. |
| #5 | logic | Push regex now skips `--dry-run` / `-d` / `:branch` colon-prefix deletes. |
| #11 | style | `printf '%q'` wrapping defangs terminal escapes in commit subjects. |
| Bonus | logic | tdd-guard `kill -9` left orphan node child processes vitest spawned. `setsid` + `kill -- -PGID` group-kill takes down the tree; fallback to plain background kill when setsid missing. |

**Round 3 — CI exposed two latent pre-existing bugs.** First push of `fedaeed` failed shellspec at 9-11s (early exit). Investigation surfaced two bugs that **the entire prior review chain had missed**:

1. **ShellSpec stdin bug (`When call CMD <<<"$INPUT"`).** ShellSpec's `When call` does NOT pass stdin from inline redirects — the redirect attaches to ShellSpec's interpreter, not the called command. Hooks received EMPTY stdin → silent rc=0 from `[ -z "$INPUT" ] && exit 0`. **All 21 pre-existing fixtures (7 tdd-guard + 14 pre-push-dod7) were giving false signals since `6f30870`** — blocking-path tests expecting rc=2 failed-loud (got rc=0); pass-path tests expecting rc=0 silently passed for the wrong reason. Fixed in `0b7e183` by converting all 21 fixtures to `Data:expand` blocks. Local run: 88 examples / 0 failures.

2. **Gate 3b trailing-newline bug (`verify-slice.sh` L156).** The `while IFS= read -r line; do ... done < $ALLOWLIST_FILE` loop silently dropped the final allowlist entry when the file had no trailing newline — single-entry untagged allowlists slipped past. Fixed in `0b7e183` via standard `|| [ -n "$line" ]` idiom.

**Round 4 — Vercel lockfile unblock.** Even after CI green, Vercel deployment failed with `ERR_PNPM_OUTDATED_LOCKFILE`: `@vitest/coverage-v8@^4.1.3` was added to `package.json` in `ead649f` (PR #25) but the corresponding specifier was never recorded in `pnpm-lock.yaml`'s importers section (only the resolved version `4.1.5` was). Pre-existing on `main`; `npm run build` CI check passes locally + in GitHub Actions, but Vercel uses pnpm with frozen-lockfile and rejected. Fixed in `5e184b4` via `pnpm install --lockfile-only` (no node_modules churn, +96/-2L diff). Vercel deployment then succeeded.

**Adversarial review verdict evolved across three rounds:** initial sub-spawn 1 `request-changes` (12 findings, #1+#2 false positives) → round-2 sub-spawn 1-redux `block` (6 findings) → after fixes + lessons documented `approve-with-deferred-review`. Sub-spawns 2-6 honestly deferred to PR-time review.

## Key decisions

- **Pivot to file-per-spawn re-spawn** over single-monolithic-spawn for sub-spawn 1 redux. Worked (returned 6 actionable findings vs the original 12 + 2 false positives). The structural read-cap still blocked sub-spawns 2-6 — captured as v3c carry-over.
- **Convert all 21 fixtures to `Data:expand`** rather than fix only the failing ones. The pattern-bug was systemic; piecemeal patching would leave other false positives in place.
- **`while read || [ -n "$line" ]` idiom for Gate 3b** rather than fixing the fixture. Production allowlists could be hand-edited without trailing newline; code should be robust.
- **Bundle pnpm-lock fix in this PR** rather than separate PR. Out-of-scope but Vercel was blocking deployment on every PR; fix is mechanical and isolated.
- **Mark ready-for-review only after Vercel green.** No partial-green handoffs.

## What went well

- **CI as adversarial reviewer.** When sub-spawns couldn't reach files, CI failures became the gate that caught the latent stdin + trailing-NL bugs. The shellspec workflow ran the broken specs in real conditions and surfaced the false-positive pattern by FAILING the assertions. Round 3 was discovered, not designed.
- **Honest gap recording.** Rather than ship "approve" prematurely, verification.md and PR body both documented "this slipped through every prior review because dryruns invoked the hook directly via `bash hook.sh <<<'$JSON'`; sub-spawn reviews focused on impl not spec-runner semantics; original CI on `6f30870` saw the same false-positive pattern and reported clean."
- **PR body refresh discipline.** Three full body refreshes across rounds 2, 3, 4 — final body accurately reflects the 9-commit reality + 3-round adversarial-review log + sharpened v3c carry-over.
- **PR-merge timing.** User merged PR #27 between "mark for review" and now — clean handoff to main.

## What could improve

- **Dryruns invoked the hook directly, never via the spec runner.** The author dryruns I did pre-commit confirmed the HOOK was correct but never confirmed the SPEC-RUNNER was correctly piping stdin to it. This is the root failure mode — caught only by CI. v3c carry-over: spec 72b should add "spec validation by deliberate impl-break" check (temporarily emit BLOCK from a passing path; if pass-path tests don't turn red, the spec is broken).
- **Sub-spawn read-cap remains structural.** The 4th-option ("pre-load files inline in agent prompt") drafted in v3c carry-over is still not implemented — Round 2's file-per-spawn workaround helped sub-spawn 1 but didn't help sub-spawns 2-6. Spec 72b needs concrete inline-content syntax + file-size accounting so the prompt-budget vs read-cap ratio is computable upfront.
- **Vercel deployment status is invisible to `pull_request_read get_check_runs`.** Comes via the older Statuses API instead of Checks API. Cost ~5 minutes diagnosing "all checks green but Vercel still blocking". Document in CLAUDE.md or wrap-check.sh: "always also query `get_status` for Vercel/legacy-status reporters."
- **pnpm-lock drift was pre-existing in main since `ead649f` (PR #25).** Every PR opened against main was Vercel-failing. Worth a CI gate that runs `pnpm install --frozen-lockfile` to catch lockfile drift at PR time rather than at Vercel deploy time.

## Bugs found / hooks fired

- **2 architectural hook bugs** in `pre-push-dod7.sh` (repo regex truncation; gh API failure → block-all). Both fixed in `fedaeed`.
- **4 logic bugs** (jq-missing silent pass; push-regex over/under-match; commit-msg escape rendering; orphan node procs on tdd-guard timeout). All fixed in `fedaeed`.
- **2 latent pre-existing bugs** (ShellSpec stdin handling across 21 fixtures; Gate 3b trailing-NL) the prior review chain missed. Fixed in `0b7e183`.
- **1 pre-existing dependency bug** (pnpm-lock missing specifier) blocking Vercel since `ead649f`. Fixed in `5e184b4`.
- **`pre-commit-verify.sh` skip-allows on this branch** (slice-name `land-pr26-v3b-s5` doesn't match `docs/slices/<slice>` dir). `tdd-first-every-commit.sh` skip-allows (no `src/**` touched).
- **`control-change-label.yml` fired correctly** — failed initially, passed after admin applied label. Same self-protection pattern as session 43.

## Carry-forward to session 47

1. **PR #27 merged as `189996f`** — `claude/land-pr26-v3b-s5-5hFoW` retired (squash merge means main has the squashed commit; the branch ref can be deleted on origin).
2. **v3b S-6: persona suite (AC-1 + AC-2 + AC-3 paired ship)** per existing P1. AC-1's `auto-review.yml` CI gate is the runtime-cost concern — needs `ANTHROPIC_API_KEY` secret + token-budget confirmation before shipping.
3. **v3c carry-over (sharpened by S-5 round-3 lessons):**
   - **Spec 72b Option C** — pre-load file content inline in subagent prompt for ≥900L diffs. Concrete syntax + file-size accounting. Sub-spawns 2-6 of S-5 should be re-runnable with this option.
   - **Spec 72b §"spec validation by deliberate impl-break"** — temporary BLOCK emission from a passing path → pass-path tests should turn red. Catches the stdin-handling class of bugs.
   - **CLAUDE.md or wrap-check.sh: query `get_status` for Vercel** — `get_check_runs` doesn't surface Vercel deployments.
   - **pnpm-lock drift CI gate** — run `pnpm install --frozen-lockfile` on PRs that touch `package.json`.
   - **Persona retain/drop metric (AC-4)** activates from S-F1 onwards — first 3 src/ slices.
4. **Sub-spawns 2-6 deferred test + doc surface review** still pending — PR #27 reviewer with full file access can re-do them, or v3c re-runs with Option C inline-files.
5. **AC-15 plan-review default-spawn flip** out-of-scope until persona suite + first 3 src/ slices ship + AC-4 retain/drop has data → defer to v3c.
6. **Orphan branch cleanup** — `origin/claude/security-review-v3b-Cb8KB` (4 abandoned cherry-picks from session 42) + `origin/claude/activate-vitest-coverage-v8-uIaBF` (session-43 harness orphan) + now `origin/claude/land-pr26-v3b-s5-5hFoW` (post-merge). User-action items.
7. **HANDOFF-SLICE-WRAP.md for v3a-foundation** still pending; consolidates sessions 37-43; defer to v3c kickoff.
