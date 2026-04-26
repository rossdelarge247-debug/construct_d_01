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

**Blocks:** S-INFRA-rigour-v3c (quality-and-rewrite predecessor)
**Blocked by:** S-INFRA-rigour-v3a-foundation merge to main

**Notes:**
- Each subagent gate must satisfy v3a's verify-slice.sh + every-commit TDD rule + coverage gate. v3a's safety net catches issues during v3b impl.
- Plan-time gate from v3a (AC-2) reviews this slice's full acceptance.md when drafted — independent fresh-context subagent must approve before any src/ work on v3b.
- Each gate's prompt-template is itself reviewed by an independent subagent before merge (recursion: subagent prompts that govern other subagents must themselves be vetted).

Full AC table, DoD, security.md, verification.md template all drafted when this slice begins, not before. Drafting them now would be premature given v3a's foundation is still pending and will surface real constraints (hook patterns, schema shapes, test fixtures) that should shape v3b's plan.
