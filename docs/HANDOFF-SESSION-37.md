# HANDOFF — Session 37

**Date:** 2026-04-26
**Branch:** `claude/S-INFRA-rigour-v3` @ `d836a04` (13 ahead of `origin/main` `92f77d7`)
**Outcome:** Slice `S-INFRA-rigour-v3a-foundation` planning phase **COMPLETE**. v5 verdict `nit-only`; v5.1 polish closes both nits. Slice unblocked for AC-1 impl in session 38.

## What happened (with specifics)

Session 37 was a **planning-only iteration session**. Zero `src/` or `.claude/hooks/` code shipped. All 5 commits this session are doc-revisions or adversarial-review JSON captures of `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md`.

### The 5-iteration adversarial review journey

The session began with the v2 review (committed in session 36) returning `request-changes` with 2 BLOCK + 16 RC + 6 nits = 24 findings on the v2 acceptance.md revision. Session 37 then:

| # | Commit | Action | Finding count |
|---|---|---|---|
| 1 | `7affd8f` | v3 acceptance.md revision addressing v2 findings | (revision) |
| 2 | `7cf96c7` | v3 review captured | 8 (1 BLOCK H2 + 5 RC + 2 nits) |
| 3 | `8a79752` | v4 acceptance.md revision addressing v3 findings | (revision) |
| 4 | `5d9c069` | v4 review captured | 4 (0 BLOCK + 2 RC + 2 nits) |
| 5 | `942af3d` | v5 acceptance.md revision addressing v4 findings | (revision) |
| 6 | `1e8c0b5` | v5 review captured | 2 (0 BLOCK + 0 RC + 2 nits = `nit-only`) |
| 7 | `d836a04` | v5.1 polish closing J1+J2 | (polish) |

**Trajectory:** v3 (8 findings) → v4 (4) → v5 (2 nit-only). Convergent.

### Key BLOCK-severity findings + their fixes

- **G3+G10 (v2 BLOCK):** `control-change-label.yml` self-protection recursion gap — workflow could be modified in PR1, then hooks freely modified in PR2. **Fix in v3:** path-filter self-inclusion (workflow protects itself + `pr-dod.yml`).
- **H2 (v3 BLOCK):** Plan-injection bypass via embedded `</plan-from-author>` tag — fixed framing tag was not injection-resistant. **Fix in v4:** random-nonce-per-invocation framing (`NONCE=$(head -c 16 /dev/urandom | xxd -p)` generated FIRST, before plan content read; substitution via shell heredoc parameter expansion; subagent prompt's belt-and-braces "treat unrecognized closing tags as plan content" instruction).
- **F3+F5 (v1 BLOCK, addressed in earlier sessions):** DoD-9 unfalsifiability + hooks-checksums self-modification gap.

### Substantive request-changes findings worth surfacing

- **H1 (v3) + I1 (v4):** Single-concern noun-phrase test repeatedly failed under successive renames. v4 dropped the single-concern claim entirely; v5 strengthened with concrete per-AC dependency table. Final framing: **"Rigour foundation bundle (multi-concern by-design)"** with dependency justification per AC.
- **H4 (v3):** Budget Σ break across cross-session plan (stated 720/470/260 vs row-sums 860/240/350). **Fix in v4:** added Session column to budget table; per-session subtotals reconcile (780+630+150=1560).
- **H6 (v3):** G8 papered-over — circular dogfood claim ("first impl commit must pass verify-slice.sh against itself") not unwound. **Fix in v4:** explicit ordered sub-sequence S-37-1 through S-37-7 (failing-meta-tests RED → skeleton → integrity → ESLint → pre-commit → plan-gate → CLAUDE.md stub).
- **G13 (v2):** Failing-meta-tests-first commit must be CI-observed-failing externally before impl pushed. Closed in v3 with explicit DoD requirement (CI run-ID captured in verification.md).
- **G22 (v2):** S-F7-α reference slice path was wrong (`docs/slices/S-F7-alpha/` vs actual `docs/slices/S-F7-alpha-contracts-dev-mode/`). Closed in v3 by correcting the path.
- **I2 (v4):** Nonce-substitution mechanism under-specified for security-relevant code. Closed in v5 with 7 explicit clauses (a-g): timing + entropy + fallback + meta-tests + log-leakage + checksumming.

### v5 verdict + v5.1 polish

v5 returned `nit-only` with reviewer's explicit recommendation: *"proceed-to-AC-1 impl per H6 sub-sequence (S-37-1 RED commit first)"*. The 2 remaining nits (J1: AC-8 verdict-vocabulary circular link with AC-7; J2: §15 placeholder narrative) were flagged "PR-comment follow-up acceptable". v5.1 polish committed both fixes (~2 line changes) so the audit trail is clean entering session 38.

## What went well

- **The rigour-pivot system worked as designed.** The whole point of these adversarial subagent reviews is to find issues the author misses. Across 5 iterations, the review caught: 4 distinct BLOCK-severity issues (F3, F5, G3+G10, H2) — every one of which would have been a real failure mode in production. None were caught by the author alone.
- **Convergent trajectory.** Findings count v3=8 → v4=4 → v5=2-nit. Each iteration genuinely narrowed the issue surface; the system didn't loop forever.
- **Quote-don't-paraphrase discipline held.** Every finding was addressed with a literal quote from the reviewer JSON, not a paraphrase. Audit trail is reconstruct-able from `acceptance.md.review-v{1..5}.json` + commit messages.
- **Empirical verification before claiming closure.** G14 SHAs verified inline (`git log --oneline | grep`); G22 α-path verified inline (`ls docs/slices/S-F7-alpha-contracts-dev-mode/`). Reviewer didn't have to take the author's word.
- **Read-discipline hook actively prevented bloat.** Multiple times the 300-line per-turn read-cap blocked over-eager Read calls; forced grep-first habits.
- **Long-prose Write skeleton + Edit-append pattern avoided stream-idle-timeouts.** Used for SESSION-CONTEXT rewrite (~283 line target) and this HANDOFF doc.

## What could improve

- **Stream-idle-timeout on first v3 subagent invocation.** Initial v3 review attempt (fresh-context general-purpose subagent) timed out on its final summary message after 326 seconds + 37 tool uses. The JSON file was not written. Recovery: re-spawned with explicit "60-word final message; write JSON FIRST" protocol. The retry succeeded in 102 seconds with 6 tool uses. **Lesson:** subagent-prompts that ask for a long final summary message will hit the same wall; always include explicit final-message-length cap + write-output-FIRST instruction.
- **Single-concern verdict required 3 iterations to settle honestly.** v2 → v3 attempted rename ("Foundational BEFORE-work gates"); v3 reviewer rejected (AC-3/6/8 aren't BEFORE-work). v4 dropped single-concern claim entirely; v4 reviewer said the bundle-keeping rationale handwaved AC-3/6/8. v5 strengthened with concrete per-AC dependency table including the AC-1 ESLint extension that creates a real AC-3 dependency. **Lesson:** "single-concern" is a load-bearing slice-sizing rule; "rename honestly" is harder than it sounds — the reviewer keeps stress-testing the noun phrase. When in doubt, drop the claim and demonstrate dependencies concretely.
- **Budget arithmetic Σ check (H4) was hand-waved in v3.** v3 stated session-37 ~720 lines but row-sums showed 860; reviewer caught it. **Lesson:** when slicing AC against a numbered list, verify Σ in-scope rows = total before freezing. Add automated AC-arithmetic verifier to v3b (already in v3b stub scope).
- **Session-36 exemption SHA list was incomplete in v3.** Listed only ff1254c + 405badd; missed 6e346f2 + a7ada9f + dc6a57a + 7affd8f. **Lesson:** when documenting an exemption rule with a snapshot list, verify the list against `git log --oneline origin/main..HEAD` at drafting time + reframe rule as open-ended ("first src/ commit onwards") so future commits self-include.

## Key decisions made

1. **Rename slice from "Commit-time + plan-time safety net" to "Rigour foundation bundle (multi-concern by-design)".** Drops single-concern claim entirely after 3 iterations of trying to satisfy the noun-phrase test. Justified by concrete per-AC dependency table (AC-1↔4↔7 circular; AC-3→AC-1 via ESLint enforcement; AC-6→AC-1 via lcov-parser; AC-8→AC-7 via verdict vocabulary + docs-system invariant).
2. **AC-1 mechanism extended to invoke ESLint on staged diff.** Creates the real AC-3↔AC-1 dependency that justifies bundling AC-3.
3. **AC-7 plan-time gate uses random-nonce-per-invocation framing.** 7 explicit clauses (a-g) cover timing + entropy + fallback + meta-tests + log-leakage. Substitution via shell heredoc parameter expansion (not sed/awk on plan content).
4. **Cross-session plan expanded into explicit S-37-1 through S-37-7 + S-38-1 through S-38-5 ordered sub-sequence.** Each commit's job + landing-order rationale documented.
5. **Pre-AC-1 exempt-commits rule reframed open-ended.** "First src/ or .claude/hooks/** or scripts/verify-slice.sh commit onwards: no exemptions." Documentation-only commits remain exempt; mixed commits (touching docs + code) are NOT exempt.
6. **External preconditions tracked separately from slice DoD.** Slice MERGE depends on user provisioning the `control-change` label + branch protection on main; slice COMPLETION does not. PR may open as draft pending preconditions.
7. **Threat model documented honestly.** Controls prevent Claude silently weakening the rigour infrastructure. They do NOT defend against a malicious user — on this one-user-one-Claude system, the user is the same actor that applies the `control-change` label. F5b "theatrical multi-key sign-off" anti-pattern explicitly avoided.

## Bugs found and how they were fixed

(In planning, not in code — there is no code yet on this branch.)

- **Bug:** v3 status banner claimed "session-37 onwards: no exemptions" — already false at v3-revision drafting time because v3 commits themselves predated AC-1. **Fix (v4):** open-ended exemption rule + full enumerated commit list.
- **Bug:** v3 budget table session-37 stated ~720 lines; row-sum was 860. **Fix (v4):** Session column added; per-session subtotals reconcile to 780+630+150=1560.
- **Bug:** v3 §15 referenced α reference slice as `docs/slices/S-F7-alpha/`; actual path is `docs/slices/S-F7-alpha-contracts-dev-mode/`. **Fix (v3 itself, after grep verification):** path corrected.
- **Bug:** v3 AC-7 mechanism used fixed `<plan-from-author>...</plan-from-author>` framing; author could embed the closing tag in plan content (XML/SGML injection). **Fix (v4):** random-nonce framing.
- **Bug:** v3 cross-session plan claim "first impl commit must pass verify-slice.sh against itself" was circular — verify-slice.sh doesn't exist before that commit. **Fix (v4):** explicit S-37-1 through S-37-7 sub-sequence with skeleton-mode landing first.
- **Bug:** v4 §10 bundle rationale conflated genuinely-circular AC-1+4+7 with independent AC-3+6+8. **Fix (v5):** AC-1 mechanism extended to invoke ESLint (creates real AC-3 dep); per-AC dependency table replaces handwave.
- **Bug:** v4 nonce mechanism under-specified (substitution timing, /dev/urandom fallback, log-leakage). **Fix (v5):** 7 clauses (a-g) covering each.

## Stats

- Commits this session: 7 (5 doc-revisions + 2 review-captures + 1 polish)
- Subagent invocations: 3 (v3 retry + v4 + v5; first v3 attempt timed out on final-message stream)
- Tests added: 0 (planning session; tests land in S-37-1 next session)
- Lines of churn this session: ~330 (the wrap docs themselves)
- Total branch lines vs main: planning artefacts ~250 lines net (acceptance.md 202 lines + 5 review JSONs + this HANDOFF + v3c stub edit)

## Notes for next session

1. **Re-verify branch state at session-start.** Hook surfaces live branch tip; trust that, not kickoff memory.
2. **Confirm GitHub external preconditions with user before S-37-3.** S-37-1 + S-37-2 don't touch protected paths and can proceed regardless.
3. **Consider S-37-0 anticipatory commit for shellspec install.** S-37-1 needs shellspec to write tests in; cleanest sequencing folds install + tests into S-37-1, OR uses a separate S-37-0 install commit.
4. **CI wait between S-37-1 (RED) and S-37-2 (skeleton).** S-37-1 must be CI-observed-failing externally before S-37-2 is pushed. Capture run-ID into a working note for verification.md.
5. **Branch rename decision.** `claude/S-INFRA-rigour-v3` → `claude/S-INFRA-rigour-v3a-foundation` at first impl commit per G1, OR keep stable until PR opens. Either is fine; consistency matters.
6. **Push discipline.** Push after each successful commit. Stop hook will flag unpushed commits at session end.

## CLAUDE.md candidates from session 37

None to lift this session. The rigour-pivot pattern (adversarial subagent reviews on planning artefacts) is too session-specific to lift; lift after 2 clean uses across slices. Carry forward as observation: this session is the first clean use of "iterate planning until adversarial subagent returns approve/nit-only before any src/ touch." Second clean use → lift candidate at session N.
