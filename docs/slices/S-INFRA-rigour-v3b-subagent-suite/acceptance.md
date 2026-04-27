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

**Carry-over from v3a (deferred concerns from S-37-6 / AC-7):**
Per `docs/slices/S-INFRA-rigour-v3a-foundation/verification.md` § "Adversarial review — S-37-6 (DoD #3)" — two concerns deferred at v3a ship-time, to be addressed in this slice's AC table when drafted:
1. **Flip plan-review subagent default-spawn.** v3a ships `EXIT_PLAN_REVIEW_SPAWN=1`-gated; full default-spawn pending ops sign-off on per-`ExitPlanMode` `claude -p` cost / latency. Plan-review is adjacent to the six during-work subagent gates above, so the cost-modelling work is shared.
2. **Extend AC-2 checksum scope to `scripts/git-state-verifier.sh`.** v3a's L199 enumeration does not currently include the AC-7 sub-script; silent weakening would weaken the AC-7 gate. Either amend the L199 list in v3b's first commit OR rely on per-PR `control-change` label discipline (G18) until then.

**Blocks:** S-INFRA-rigour-v3c (quality-and-rewrite predecessor)
**Blocked by:** S-INFRA-rigour-v3a-foundation merge to main

**Notes:**
- Each subagent gate must satisfy v3a's verify-slice.sh + every-commit TDD rule + coverage gate. v3a's safety net catches issues during v3b impl.
- Plan-time gate from v3a (AC-2) reviews this slice's full acceptance.md when drafted — independent fresh-context subagent must approve before any src/ work on v3b.
- Each gate's prompt-template is itself reviewed by an independent subagent before merge (recursion: subagent prompts that govern other subagents must themselves be vetted).

Full AC table, DoD, security.md, verification.md template all drafted when this slice begins, not before. Drafting them now would be premature given v3a's foundation is still pending and will surface real constraints (hook patterns, schema shapes, test fixtures) that should shape v3b's plan.
