# S-INFRA-rigour-v3 · Hard, programmatically-enforced engineering rigour controls

> **STATUS: DRAFT — REQUEST-CHANGES from independent subagent review (session 36, 2026-04-26).**
> Findings in `acceptance.md.review.json` (committed alongside this draft). Two block-severity findings (F3 unfalsifiable DoD-9; F5 self-modification protection bypassable in single commit) and a single-concern verdict of FAIL — reviewer recommends splitting into 3 sub-slices (foundation → subagent-suite → quality+rewrite) and unblocking β after the foundation slice rather than after the full programme.
> **Next session: address findings before any src/ work.** Decision pending from the user on whether to split the slice per reviewer recommendation. The text below remains the original draft for reference — do not treat as the agreed plan.

**Slice ID:** `S-INFRA-rigour-v3`
**Branch:** `claude/S-INFRA-rigour-v3` (cut from `origin/main` at `92f77d7`)
**Single-concern:** *Programmatically enforce CLAUDE.md engineering principles (TDD, simplicity, security, adversarial review, slice-sizing) so they bind even under session pressure — replace memory-dependent rules with hooks, scripts, CI checks, and subagent gates that cannot be bypassed without explicit, audited override.*

If naming this concern requires "and", split it. The single noun phrase: **enforced engineering rigour**. *(Reviewer flagged this as too broad; see review JSON.)*

**Max-diff-lines budget:** 2400 lines net across all sessions (slice-program total). Per-session sub-budgets in §"Cross-session plan" below; CI-enforced once the budget gate ships in AC-7.

**Blocks:** All feature work — including S-F7-β cleanup (currently parked at `claude/S-F7-beta-impl` HEAD `a3f67ec`, not yet PR'd). β cleanup resumes only after this slice merges to `main`.

**Why:** A session-36 self-audit revealed systematic discipline lapses despite Tier-1 CLAUDE.md rules being loaded every session: TDD skipped on 5/7 ACs; functions written as monolithic 80–230-line page components against the function-size rule; `/security-review` + `/review` skill runs deferred to PR-time across the whole slice; one slice (AC-2) discovered mid-impl to actually be 4 concerns. Root causes (commit `a3f67ec` self-audit thread): sunk-cost bias under debugging pressure, optimistic deferrals compounding, definition-of-done drift, default React-route-component shape being monolithic, slice-size too big. Mitigations relying on "remember to do X" failed. This slice replaces them with mechanisms that cannot be remembered or forgotten — they fire on every relevant tool call.

---

## Acceptance criteria

| AC | Concern | Mechanism | Session target |
|---|---|---|---|
| AC-1 | Foundational safety net | `scripts/verify-slice.sh` workhorse + `.claude/hooks/{pre-commit-verify,tdd-first-every-commit,session-integrity}.sh` + `eslint-baseline-allowlist.txt` + ESLint `max-lines-per-function` + coverage gate via vitest `--coverage` + `.claude/hooks-checksums.txt` for self-modification detection | **36 (this) + 37** |
| AC-2 | Plan-time gate | `.claude/hooks/exit-plan-review.sh` (PreToolUse on `ExitPlanMode`) spawns subagent with fresh context, reviews plan against CLAUDE.md "Planning conduct" + spec 70 slice-sizing + simplicity-first; blocks plan exit on `architectural` severity findings | 37 |
| AC-3 | Pair-programming hook | `.claude/hooks/pair-review.sh` (PostToolUse on Edit/Write) — pre-edit intent file (`.claude/edit-intent.txt`) + finding-response loop (`.claude/review-findings.json` with `severity ∈ {block, request-changes, nit}` + `disputed: reason` writer-response) + persistent reviewer memory across edits + reviewer-can-demand-Read | 38 |
| AC-4 | Adversarial subagent suite | Five PreToolUse subagent gates: (a) commit-message accuracy review on `git commit`; (b) spec-quote enforcement on text matching `per spec X`; (c) `AskUserQuestion` framing review on every question; (d) periodic on-track audit (every N turns or M lines); (e) documentation-honesty review on HANDOFF / verification.md / SESSION-CONTEXT writes | 38–39 |
| AC-5 | Multi-provider 3rd-agent PR reviewer | GitHub Action invoking a non-Anthropic LLM (OpenAI / Google) via API, anchor-free context (diff + CLAUDE.md only), adversarial role-prompt, severity-calibrated PR-blocking. Closes the cognitive-diversity gap that same-model self-review can't. Requires user to provision API key as repo secret. | 40 |
| AC-6 | Structured-findings schemas | JSON Schema for `/security-review` + `/review` skill outputs (severity, threat-model-category, fix-recommendation per finding); parser in `scripts/verify-slice.sh` that rejects narrative-blob output + verifies every finding addressed-or-deferred-with-reason | 40 |
| AC-7 | Quality controls | Stryker mutation testing per slice (≥75% mutants killed); control-tightening-only ratchet CI check (thresholds can only go UP, allowlist can only shrink); time-bound + slice-bound allowlist parser (every entry has `target-slice` + `expires`) | 41 |
| AC-8 | Tooling | `scripts/open-slice-pr.sh` auto-generates PR body from acceptance.md + verification.md + skill outputs (author can't phrase around concerns); cron-scheduled `scripts/audit-controls.sh` GitHub Action opens monthly state-of-rigour issue (catches silent control atrophy) | 42 |
| AC-9 | CLAUDE.md "Hard controls" rewrite | Promote rules from Tier-1 text to enforced-by-hook-X references; new top-level §"Hard controls" cataloguing every enforced gate with the script that enforces it, the file path, and the bypass procedure (which itself requires multi-key sign-off). Lands LAST so it documents the actual system rather than aspirations. | 42 |

**Sigma check:** 9 ACs. Each is a single concern. AC-1 + AC-4 are bundled because each AC is a *cohesive set of related controls* (foundation; subagent suite) with the same mechanism shape; splitting them further would fragment commits without changing outcomes. AC-2 / AC-3 / AC-5 / AC-7 / AC-8 are cleanly singular.

---

## Cross-session plan

**Session 36 (this):** AC-1a — slice planning artefacts (this `acceptance.md` + `security.md` + `verification.md` template) + meta-test fixtures for `verify-slice.sh` (test-first per the rule we're enforcing) + minimum-viable foundational pieces: `verify-slice.sh` skeleton (tsc + vitest + leak-scan + verification-presence), `.claude/hooks-checksums.txt` + integrity check in `session-start.sh`, ESLint `max-lines-per-function` config + initial allowlist seed (zero entries on main; β offenders captured when β resumes), pre-commit-verify hook registered in `settings.json`. Estimated 600 lines. **Does not yet ship: TDD-first-every-commit hook, coverage gate.** Those land session 37.

**Session 37:** AC-1b — finish foundational layer (TDD-first-every-commit hook + coverage gate via vitest --coverage + threshold enforcement) + AC-2 (plan-time `ExitPlanMode` gate with subagent review). Estimated 400 lines.

**Session 38:** AC-3 (pair-programming PostToolUse hook + intent-vs-diff cycle) + AC-4a (commit-message subagent) + AC-4b (spec-quote enforcement subagent). Estimated 350 lines.

**Session 39:** AC-4c (`AskUserQuestion` framing review subagent) + AC-4d (periodic on-track audit subagent) + AC-4e (documentation-honesty subagent). Estimated 300 lines.

**Session 40:** AC-5 (multi-provider 3rd-agent reviewer GitHub Action) + AC-6 (structured-findings JSON Schema + parser + skill-template updates). Estimated 350 lines.

**Session 41:** AC-7 (Stryker mutation testing config + threshold gate; control-tightening-only ratchet CI; time-bound + slice-bound allowlist parser). Estimated 300 lines.

**Session 42:** AC-8 (PR auto-opener + cron audit GitHub Action) + AC-9 (CLAUDE.md "Hard controls" rewrite) + slice merge. Estimated 250 lines.

**Total estimated:** ~2400 net new lines across 7 sessions. β cleanup resumes after merge.

---

## In-scope

- New scripts under `scripts/`
- New hooks under `.claude/hooks/` registered in `.claude/settings.json`
- New CI workflows under `.github/workflows/`
- New JSON Schemas under `schemas/`
- ESLint config additions in `.eslintrc.cjs` (or `eslint.config.mjs`)
- New baseline / allowlist files under `docs/eslint-baseline-allowlist.txt` (and similar)
- Vitest config additions for coverage threshold
- Stryker config (`stryker.conf.json`) for mutation testing
- CLAUDE.md updates (final session only) promoting rules to hard-control references
- Slice artefacts: this `acceptance.md`, `security.md`, `verification.md`, `acceptance.md.review.json` (subagent-generated this session)

## Out-of-scope

- Modifications to existing β-branch code (β remains parked; cleanup is a separate slice)
- Modifications to existing α `src/lib/**` code (legacy refactor is its own future slice)
- Per-existing-file enforcement of new ESLint rules (scoped to `src/app/**` + `src/components/**` initially per session-36 confirmation; α / lib refactor deferred)
- Branch protection rule changes on `main` (one-time GitHub repo-settings change the user makes; not a code commit)
- Anthropic-API-key provisioning for multi-provider reviewer (user provisions repo secret; AC-5 uses it)
- Anything that requires human review beyond the multi-provider 3rd-agent (canonical human reviewer is the user's branch-protection setting; this slice does not implement human-review tooling)

## Dependencies

- `vitest` ≥ 4 (already in pnpm deps)
- `@stryker-mutator/core` + `@stryker-mutator/vitest-runner` (new dep, AC-7)
- `eslint` config supporting `max-lines-per-function` (already in deps)
- `jq` (already in deps for hooks)
- GitHub Actions runners (already in `.github/workflows/ci.yml`)
- A non-Anthropic API key for AC-5 (user provisions)

## Definition of Done (slice-level)

All nine ACs landed across sessions 36–42 with:

1. Each AC's evidence captured in `verification.md` against actual commit SHA
2. `scripts/verify-slice.sh` itself passes against this slice (it dogfoods)
3. `.claude/hooks-checksums.txt` matches all current hooks
4. ESLint zero-disable check passes
5. Coverage on this slice's own scripts ≥ 90% (recursion: rigour infra meets its own quality bar)
6. Adversarial review skills run + outputs structured + addressed
7. Multi-provider 3rd-agent reviewer (AC-5) approves the merge
8. PR opened via `scripts/open-slice-pr.sh` (AC-8)
9. User branch-protection on `main` configured (one-time, captured in HANDOFF as completed external action)
10. CLAUDE.md updated (AC-9) describing the now-live system

## Notes

- The slice DOGFOODS its own controls. Once AC-1 lands, every subsequent commit on this branch must satisfy `verify-slice.sh`. Once AC-3 lands, every Edit on this branch fires pair-review. This forces the controls to be *usable* not just *implemented*.
- Bootstrapping order matters. AC-1's first commit must be the meta-test fixtures (test-first), THEN the implementation. The failing-tests-pass-after-impl pattern is what makes the rule real.
- A subagent reviews this `acceptance.md` itself before the first src/ commit on this branch. See `acceptance.md.review.json` (generated session 36 by independent-context Plan-agent invocation against CLAUDE.md slice-sizing + this acceptance.md text).
