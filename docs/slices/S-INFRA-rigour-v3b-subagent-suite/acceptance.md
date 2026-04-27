# S-INFRA-rigour-v3b · Adversarial subagent suite

> **STATUS: deferred — full AC draft lands when this slice begins.**

**Slice ID:** `S-INFRA-rigour-v3b-subagent-suite`
**Predecessor:** `S-INFRA-rigour-v3a-foundation` (must merge first)
**Successor:** `S-INFRA-rigour-v3c-quality-and-rewrite`
**Single-concern:** *Adversarial subagent gates that fire on every relevant tool call to enforce CLAUDE.md principles in real time.*

**Scope marker (full ACs drafted at slice start):**
- Pair-programming PostToolUse hook (intent file + finding-response loop + persistent reviewer memory + reviewer-can-demand-Read)
- Commit-message accuracy review subagent (PreToolUse on `git commit`)
- Spec-quote enforcement subagent (any reference to a numbered spec triggers quote-presence check; broader than `per spec X` per F4 finding from v3a-v1 review)
- AskUserQuestion framing review subagent (PreToolUse on AskUserQuestion)
- Periodic on-track audit subagent (every N turns or M lines of churn)
- Documentation-honesty subagent (HANDOFF / verification.md / SESSION-CONTEXT writes diffed against git history)

**Estimated budget:** to be drafted bottom-up at slice start, but reviewer's session-36 estimate suggested ~1500 lines for the full subagent suite. To be revised against the actual implementation after v3a foundation lands.

**Carry-over from v3a (deferred concerns from S-37-6 / AC-7 + session-40 wrap):**
Per `docs/slices/S-INFRA-rigour-v3a-foundation/verification.md` § "Adversarial review — S-37-6 (DoD #3)" + session-40 commit `2c676d0` — concerns deferred at v3a ship-time, to be addressed in this slice's AC table when drafted:
1. **Flip plan-review subagent default-spawn.** v3a ships `EXIT_PLAN_REVIEW_SPAWN=1`-gated; full default-spawn pending ops sign-off on per-`ExitPlanMode` `claude -p` cost / latency. Plan-review is adjacent to the six during-work subagent gates above, so the cost-modelling work is shared.
2. **Extend AC-2 protection scope to three artefacts the L199 enumeration omits.** All three sit inside AC-3 / AC-7 chains and ARE in the `hooks-checksums.txt` baseline today, but neither L199 nor the `control-change-label.yml` path filter mention them — silent weakening would weaken the relevant gate. Either amend the L199 list in v3b's first commit OR rely on per-PR `control-change` label discipline (G18) until then.
   - `scripts/git-state-verifier.sh` — AC-7 plan-time-gate sub-script (called from `exit-plan-review.sh:55`).
   - `scripts/eslint-no-disable.sh` — AC-3 zero-disable check invoked from `eslint-no-disable.yml`.
   - `docs/eslint-baseline-allowlist.txt` — AC-3 disable allowlist read by `eslint-no-disable.sh`.
3. **`line-count.sh` session-base does NOT re-baseline on branch-resume.** Surfaced session 40: `.claude/hooks/session-start.sh:27-28` writes `/tmp/claude-base-$SESSION_ID.txt` only when absent. The "Branch-resume check" narrative (L45+) warns the human but doesn't update the file. Resyncing from harness-orphan to canonical mid-session keeps the obsolete base SHA, so subsequent line-count deltas include the cross-branch resync diff (~2,200 lines for v3a-foundation). One-off manual fix in session 40 (`echo $NEW_SHA > /tmp/claude-base-...`); proper fix is either auto-detect post-checkout via a separate `git checkout` pre/post hook or relax the absent-only guard. v3b should add a meta-test and the fix.
4. **AC-6 lcov parser ships without a shellspec meta-test.** Session 40 commit `95481e5` added the parser inline in `verify-slice.sh` Gate 5 but didn't ship a test — fixture would need fake-git-history + lcov.info, non-trivial in tmp isolation. v3b (or v3c) should add when subagent suite includes integration fixtures.
5. **`@vitest/coverage-v8` dev-dep + `ci.yml --coverage` wiring.** Required to *activate* AC-6 in CI; v3a ships the gate dormant-until-data-present. v3b's first commit should add the dep + wire the workflow.
6. **AC-6 F6 ".sh ≥ 80% line via shellspec" invariant is aspirational only.** kcov + shellspec integration not yet in the harness; surfaced as documented intent without a measuring tool. v3c may pull in kcov as part of broader tooling rationalisation.
7. **Pre-push gate to enforce DoD-7 temporal ordering.** v3a session 40 surfaced a procedural gap: DoD-7 (acceptance.md L180) mandates "Failing-meta-tests-first commit pushed AND CI-observed-failing **before** impl pushed", but nothing in the harness blocks pushing the impl commit before CI observes the prior RED. Author-intent is the only safeguard. Proposal: a `pre-push` hook (or PR-creation pre-flight) that queries the prior commit's CI status and blocks the push when the prior commit is a self-described RED-meta-tests commit AND CI hasn't reported on it yet. Adjacent to the subagent-suite scope; could be a 7th gate in the family.
8. **Adversarial-review-gate budget convention.** v3a session 40 surfaced that the DoD-3 single-turn adversarial-review pattern is structurally infeasible when the slice's authoritative source > ~300 lines: the reviewer hit the read-cap mid-pass (per `read-cap.sh`) and could only render a procedural `request-changes` verdict. Either (a) DoD-3 reviewers get an explicit multi-turn budget envelope; (b) the brief is partitioned into spec-side / impl-side / git-history sub-spawns each fitting one turn; or (c) a "review-budget-needed" pre-flight is added to the spec authoring stage. Worth specifying as a gate-design AC in this slice.

**Blocks:** S-INFRA-rigour-v3c (quality-and-rewrite predecessor)
**Blocked by:** S-INFRA-rigour-v3a-foundation merge to main

**Notes:**
- Each subagent gate must satisfy v3a's verify-slice.sh + every-commit TDD rule + coverage gate. v3a's safety net catches issues during v3b impl.
- Plan-time gate from v3a (AC-2) reviews this slice's full acceptance.md when drafted — independent fresh-context subagent must approve before any src/ work on v3b.
- Each gate's prompt-template is itself reviewed by an independent subagent before merge (recursion: subagent prompts that govern other subagents must themselves be vetted).

Full AC table, DoD, security.md, verification.md template all drafted when this slice begins, not before. Drafting them now would be premature given v3a's foundation is still pending and will surface real constraints (hook patterns, schema shapes, test fixtures) that should shape v3b's plan.
