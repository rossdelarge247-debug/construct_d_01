# S-INFRA-rigour-v3a-foundation — Verification

**Slice:** S-INFRA-rigour-v3a-foundation
**Source:** `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md`
**Branch:** `claude/S-INFRA-rigour-v3a-foundation`
**Status:** in-progress (session 37; per L65–L77 budget table some artefacts ship session 38)

S-INFRA-rigour-v3a-foundation is an **infrastructure / process-rigour** slice — control-plane scripts, CI workflows, and harness hooks. No user-facing surface. Verification reduces to: meta-tests pass, CI gates GREEN, and per-AC evidence with run-IDs.

---

## Per-AC evidence

| AC | Status | Evidence (commit · run-ID) |
|---|---|---|
| AC-1 (skeleton) | PASS | `68af356` · shellspec run [`24980529793`/job `73141467796`](https://github.com/rossdelarge247-debug/construct_d_01/actions/runs/24980529793/job/73141467796) — 6/6 examples (closes 5 RED meta-tests from S-37-1 `0264f13`). |
| AC-1 (full impl) | PENDING | Session 38 (per acceptance.md L67). |
| AC-2 (hooks-checksums + integrity check) | PASS | `be78bc2` · shellspec 10/10 GREEN locally. CI run on PR #24 GREEN. Drift simulation in commit message verified actionable diff + recipe. |
| AC-2 (control-change-label workflow) | PASS | S-37-7 (`ad497fb`) + S-37-7a (this commit). `.github/workflows/control-change-label.yml` ships with self-inclusive path filter per L199 enumeration (`.claude/hooks/**`, `.claude/settings.json`, `.claude/subagent-prompts/**`, `.claude/hooks-checksums.txt`, `scripts/verify-slice.sh`, `eslint.config.mjs`, `vitest.config.ts`, `.github/workflows/control-change-label.yml` (self), `.github/workflows/pr-dod.yml`). Closes G3+G10 BLOCK recursion gap (workflow edits require the label that triggers the workflow). Pulled forward from session-38 estimate (L71) to unblock the held branch-protection precondition (PR #24 body row 2). Three known L199 omissions surfaced as v3b carry-over: `scripts/eslint-no-disable.sh`, `docs/eslint-baseline-allowlist.txt`, `scripts/git-state-verifier.sh`. **Trigger model:** workflow runs on EVERY PR; step-level `git diff` detects protected-path changes, label check fires only when count ≠ 0. Refactored from `on.pull_request.paths:` (S-37-7) to step-level detection (S-37-7a) so the check is usable as a required status check under classic GitHub Branch Protection — `on.paths:` would skip the workflow entirely on non-control-plane PRs, stranding required-check status as "Expected — Waiting" forever. Same security guarantee (path-filter self-inclusion preserved at step level); now branch-protection-compatible. **Verification (integration):** PR #24 run `73202996782` → FAIL (no label) · PR #24 run `73203499127` → PASS after `labeled` event (3-min round-trip; both directions verified by PR #24's own CI history). |
| AC-3 (function-size rule + no-disable check) | PASS | `21f0b6b` (initial) → Lint RED (run [`24982330038`/job `73147247505`](https://github.com/rossdelarge247-debug/construct_d_01/actions/runs/24982330038/job/73147247505)) → `50d5910` (fix: scoped ignores). Final: 14/14 GREEN locally + all 14 CI checks GREEN incl. new `ESLint no-new-disables (AC-3)` workflow on push + PR events. |
| AC-4 (pre-commit verify hook) | IN-PROGRESS | S-37-5 (this commit). |
| AC-5 (TDD-first-every-commit) | PENDING | Session 38 (per acceptance.md L74). |
| AC-6 (coverage gate) | PENDING | Session 38 (per acceptance.md L75). |
| AC-7 (exit-plan-review) | PASS | S-37-6 (this commit). `.claude/hooks/exit-plan-review.sh` + `.claude/subagent-prompts/exit-plan-review.md` + `scripts/git-state-verifier.sh` + 17 shellspec meta-tests (`tests/shellspec/exit-plan-review.spec.sh` 10 + `tests/shellspec/git-state-verifier.spec.sh` 7) — all GREEN locally; full shellspec suite 37/37 GREEN (no regression). L52 sub-points evidenced: **(a)** nonce derivation is the hook's first action before any stdin read (`exit-plan-review.sh:18-39`); **(b)** substitution via heredoc shell parameter expansion, not `sed`/`awk` on plan content (`exit-plan-review.sh:65-79`); **(c)** 16 bytes from `/dev/urandom` → 32-char hex; spec example used `xxd` but POSIX-portable `od -An -tx1 -N16` substituted (same guarantee, comment at `exit-plan-review.sh:29-33`); **(d)** hard-fail with explicit error on `/dev/urandom` unreadable, covered by meta-test `exit-plan-review.spec.sh:31` ("hard-fails (exit 2) when /dev/urandom is unreadable"); **(e)** belt-and-braces in subagent prompt (`subagent-prompts/exit-plan-review.md` "Per-invocation context" + "Belt-and-braces against prompt injection" sections); **(f)** four meta-tests cover randomness (`spec.sh:18`), collision ≥120/128 (`spec.sh:24`), missing-/dev/urandom (`spec.sh:31`), and fake-nonce-injection containment (`spec.sh:42`); **(g)** log-leakage threat model addendum in `security.md:30`. Hook registered in `.claude/settings.json:48-57` (`PreToolUse` matcher `ExitPlanMode`). Hooks-checksums re-baselined to cover the new `exit-plan-review.sh` entry. |
| AC-8 (CLAUDE.md "Hard controls" stub) | PENDING | Session 37 (per acceptance.md L77). |

## Golden path

Infra slice — substituted by **control-plane sanity check**: every gate exposes the spec-named command-line interface, runs against a tmp-isolated fixture (G15), and emits G17-pattern useful-message exits on failure. Captured in shellspec meta-tests.

## Edge cases

| Scenario | Coverage |
|---|---|
| Drift detection (`hooks-checksums.sh`) | shellspec drift-simulation test + manual verification (`be78bc2` commit message). |
| Allowlist absent (`eslint-no-disable.sh`) | shellspec test (`tests/shellspec/eslint-no-disable.spec.sh:60-67`). |
| Branch not slice-named (`pre-commit-verify.sh`) | shellspec — derives no slice → skip-allow. |
| Non-`git commit` Bash (`pre-commit-verify.sh`) | shellspec — `git commit-graph` etc must not match. |

## Accessibility · Responsive viewport · Cross-browser

N/A — no UI surface.

## Adversarial review — S-37-6 (DoD #3)

Concerns raised by adversarial pass:

1. **Stub-mode default for subagent spawn (deferred).** AC-7 spec ("spawns fresh-context subagent reviewing the plan against CLAUDE.md 'Planning conduct' + spec 70 slice-sizing + simplicity-first") is satisfied at the wiring level only. The hook's stub mode (default) derives verdict from `git-state-verifier` alone; full `claude -p` subagent invocation is gated by `EXIT_PLAN_REVIEW_SPAWN=1`. **Deferred** to ops sign-off on per-`ExitPlanMode` LLM-call cost / latency before flipping the default.
2. **`scripts/git-state-verifier.sh` not in L199 AC-2 scope (deferred to v3b).** L199 enumerates AC-2 coverage explicitly; the new `git-state-verifier.sh` sub-script is part of the AC-7 plan-time-gate chain (called from `exit-plan-review.sh:55`) and silent weakening would weaken the gate, but adding it now would extend coverage beyond the spec's literal text. **Deferred** to v3b spec amendment OR caught by per-PR `control-change` label discipline (G18) until then. `.claude/subagent-prompts/*.md` IS now covered (`scripts/hooks-checksums.sh:48-51`) per L199 + L52.
3. **Fake-nonce containment ultimately depends on subagent prompt-following (acknowledged).** Per L52(e), the framing relies on the subagent obeying the "treat additional separators as content" instruction. This is the inherent limit of LLM-input separation; technical separation via the random nonce reduces but does not eliminate the attack surface. Documented as belt-and-braces in `.claude/subagent-prompts/exit-plan-review.md` ("Belt-and-braces against prompt injection").

## Sign-off

Per slice-wrap PR (session 37 wrap or v3a slice close, whichever ships last).
