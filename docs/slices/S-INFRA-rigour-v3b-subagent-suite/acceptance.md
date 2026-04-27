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

9. **Auto-`/review`-on-PR-open as a CI status check (real code-quality gate).** Surfaced session 41: v3a + v3b + v3c collectively cover process discipline (TDD, spec-quote, doc-honesty, intent-vs-code drift, test mutation, reviewer-of-reviewer) but **none ships an automated line-by-line code-review subagent that reads the diff against acceptance criteria + CLAUDE.md "Coding conduct" (simplicity first, names carry the design, small single-purpose functions, effects behind interfaces, surgical changes) and emits findings before the human reviewer arrives.** Closest planned items: (a) pair-programming PostToolUse hook (v3b above) — but its framing is "diff vs declared intent", which catches drift not quality; (b) multi-provider 3rd-agent reviewer (v3c) — backstops a v3b reviewer that doesn't exist; (c) `/review` skill (already shipped) — manual user-invoked only, not gated. Proposed AC: a `pull_request` workflow that runs `claude -p` (or wraps `/review`) over the PR diff with a coding-conduct rubric prompt, posts structured findings as a check run with an `approve` / `nit-only` / `request-changes` / `block` verdict (G23 vocabulary). Same shape as `pr-dod.yml`. Without this, the human reviewer remains the only line-level eyeball, contradicting "rigour > speed".

10. **AUDIT PREREQUISITE — re-read prior parked-candidates before drafting v3b's full AC table.** Surfaced session 41 by user audit ("I'm a little worried some thinking has been lost"). Confirmed: significant TDD-workflow + agentic-checks thinking from earlier sessions and `docs/engineering-phase-candidates.md` was NOT propagated into v3b's stub or the carry-over items 1–9 above. **v3b AC drafting must NOT begin bottom-up from the current 9-item carry-over.** The drafter must first audit the sources below, then re-draft top-down from the full inventory. The session-36 ~1500-line budget estimate is probably right in magnitude but wrong in composition.

   **Specific lost-thinking items (named explicitly so they don't get dropped again):**

   - **(A) `tdd-guard` PreToolUse hook** — `HANDOFF-SESSION-31.md` § 7 (parked candidate, sourced from external TDD-workflow article). Hook fires on `Write`/`Edit` to `src/`, runs the affected test file scoped to the change, **refuses on RED**. *Strength delta:* this gates **behaviour** (tests pass), whereas v3a's shipped AC-5 (`tdd-first-every-commit.sh`) only gates **paperwork** (tests/ is staged alongside src/). The originally-parked stronger version was replaced by the weaker discipline-only check during v3a planning. **Both should ship; they're complementary.** Implementation: PreToolUse:Write/Edit matcher; map `src/<path>` to `tests/<path>.test.ts` (or scoped subset); `npx vitest run <test-file>` on affected test; block on RED with G17 message.

   - **(B) `.claude/agents/slice-reviewer.md` persona** — `docs/engineering-phase-candidates.md` § E (L126). Adversarial pre-commit review persona: takes a slice diff + AC doc + test plan; outputs edge cases missed, security concerns, regression risks, AC gaps, scope creep within the diff. *Strength delta vs item 9 above:* item 9 wraps `claude -p` ad-hoc; this is a **canonicalised persona prompt** repo-committed at `.claude/agents/*.md`. Stable across sessions, version-controlled, not subject to prompt drift. Item 9 should land **on top of** this persona, not instead of it.

   - **(C) `.claude/agents/acceptance-gate.md` persona** — `engineering-phase-candidates.md` § E (L127). Walks the slice's AC list, verifies evidence per AC (test result, screenshot, preview deploy URL), outputs pass/fail-per-AC with specific gap narrative if fail. *Strength delta:* `verify-slice.sh` does file-presence + tooling-runs (tsc / vitest / ESLint) but cannot **read verification.md and judge whether the evidence text actually supports the claim**. The persona does that judgment work. Distinct from anything currently planned.

   - **(D) `.claude/agents/ux-polish-reviewer.md` persona** — `engineering-phase-candidates.md` § E (L128). Reviews micro-interaction / animation / `prefers-reduced-motion` / keyboard-only / screen-reader. *Relevance:* not for v3a (infra slice, no UI surface) but **load-bearing for every src/ slice from S-F1 onwards**. North star demands polish; this is the agent that catches where it's missing.

   - **(E) TDD bail-out criteria** — `engineering-phase-candidates.md` L169. *"When is TDD not tractable and explicit-manual-test-after-code acceptable? Lean: pure-visual UI, visual-regression-only covered surfaces. Everything else: test first."* AC-5 ships an exemption-allowlist *mechanism* but no documented *criteria* for what qualifies. Without criteria, the allowlist will accumulate ad-hoc additions. v3b should land the criteria as a documented rubric (where: `docs/tdd-exemption-allowlist.txt` header? CLAUDE.md? Hard controls stub?).

   - **(F) Preview-deploy verification checklist** — `engineering-phase-candidates.md` L166. DoD item 4 mentions "Preview deploy verified in-browser if UI (golden path + edge cases + prefers-reduced-motion)" but the **exact checklist** (golden path / edge cases / prefers-reduced-motion / keyboard-only / mobile viewport / screen-reader) and **where it's recorded per slice** (`verification.md` § Preview-deploy?) is not formalised. Without the rubric, "verified in-browser" means whatever the engineer felt like checking. v3b should formalise.

   - **(G) `.claude/agents/` location convention** — `engineering-phase-candidates.md` § E L132. *"Repo-level `.claude/agents/` (committed, travels with the project). Not user-home (`~/.claude/`)."* v3a used `.claude/subagent-prompts/exit-plan-review.md` for the exit-plan-review template — close but **inconsistent** with the original convention. v3b should reconcile: either move existing prompt(s) under `.claude/agents/` or document the distinction (e.g. `.claude/subagent-prompts/` for hook-spawned templates vs `.claude/agents/` for review personas — but that's a post-hoc rationalisation, not the original design).

   **Audit scope before v3b AC drafting:**

   - `docs/HANDOFF-SESSION-{30,31,32}.md` — parked-candidates lists. Tier-4 archive per `CLAUDE.md` Information tiers; this audit is the explicit one-time exception per "deliberate audit pass" framing.
   - `docs/engineering-phase-candidates.md` (full, sections A–F) — the load-bearing source. Items A, B, F (above) are pulled from § E + L166 + L169; sections A–D and L100–L170 may have more.
   - `docs/v2/v2-backlog.md` (98 items) — `grep -nE 'review|TDD|test|hook|agent'` to surface review/test items that may have been missed.
   - All v3b carry-over items 1–9 above. Some may collapse into the items A–G; others may stand alone.

   **Drafting protocol:**

   1. Complete the audit. Capture findings in `docs/slices/S-INFRA-rigour-v3b-subagent-suite/audit-findings.md` (one sentence per source item with verdict: include / collapse-into-X / drop-with-reason).
   2. Re-draft the v3b AC table top-down from the audit-findings file, NOT bottom-up from the 9-item carry-over.
   3. Run `/security-review` and `/review` against the re-drafted acceptance.md before proceeding to RED-tests-first impl.
   4. The audit-findings file is committed as part of v3b's S-1 commit; preserved as audit trail.

   **Why this matters now:** v3a shipped a discipline-only AC-5 because session-36's stub-drafter didn't audit session-31's parked candidate; result is the **weaker** TDD gate is now the slice's de facto contract. If v3b drafts bottom-up from the 9-item carry-over, the same pattern repeats: items A–G (which are larger and more important than several of items 1–9) get dropped or under-specified again. **Audit before drafting; draft top-down from audit; ship the right scope.**

**Blocks:** S-INFRA-rigour-v3c (quality-and-rewrite predecessor)
**Blocked by:** S-INFRA-rigour-v3a-foundation merge to main

**Notes:**
- Each subagent gate must satisfy v3a's verify-slice.sh + every-commit TDD rule + coverage gate. v3a's safety net catches issues during v3b impl.
- Plan-time gate from v3a (AC-2) reviews this slice's full acceptance.md when drafted — independent fresh-context subagent must approve before any src/ work on v3b.
- Each gate's prompt-template is itself reviewed by an independent subagent before merge (recursion: subagent prompts that govern other subagents must themselves be vetted).

Full AC table, DoD, security.md, verification.md template all drafted when this slice begins, not before. Drafting them now would be premature given v3a's foundation is still pending and will surface real constraints (hook patterns, schema shapes, test fixtures) that should shape v3b's plan.
