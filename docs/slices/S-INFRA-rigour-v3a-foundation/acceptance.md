# S-INFRA-rigour-v3a-foundation · Commit-time + plan-time safety net

> **STATUS: v2 review returned `request-changes` — 2 BLOCK-severity findings (G3 + G10 same issue: `control-change-label.yml` unprotected), single-concern STILL fails, ordering breaks AC-2 vs AC-4 protection (G7), verify-slice.sh excluded from protected scope (G12), DoD-2 may be unsatisfiable against α (G22), unverified SHAs in this very document (G14). Full findings in `acceptance.md.review-v2.json`.**
> Session 36 wrapping at warn (1502 churn). v3 revision DEFERRED to session 37 first action — rushing iteration at warn threshold contradicts the rigour-over-speed mandate.
> v1 review at `acceptance.md.review-v1.json` (historical); v2 at `acceptance.md.review-v2.json` (active).

**Slice ID:** `S-INFRA-rigour-v3a-foundation`
**Branch:** `claude/S-INFRA-rigour-v3` (will rename to `claude/S-INFRA-rigour-v3a-foundation` at first impl commit; deferred to keep current PR-URL stable across the planning iteration)
**Predecessor:** none — first slice in the rigour-v3 programme
**Successor:** `S-INFRA-rigour-v3b-subagent-suite`
**Single-concern:** *commit-time and plan-time gates that catch discipline failures before code or plans are committed.* Both gates fire BEFORE work is locked in: pre-commit verifies the slice DoD; plan-gate verifies the plan against CLAUDE.md before code starts. v3b's "during-work review" subagents are out of scope here.

If naming this concern requires "and", split it. The single noun phrase: **pre-commit and pre-plan safety net**. Two words bound by "and" — but they're the same shape (BEFORE-work gates), and reviewer F3c explicitly recommended bundling them as the v3a payload that unblocks β. Marking this acknowledged ambiguity rather than hand-waving past it.

**Blocks:** S-F7-β cleanup (parked at `claude/S-F7-beta-impl` HEAD `a3f67ec`) — β cleanup resumes only after v3a merges to main.
**Does NOT block:** v3b + v3c. Those slices' planning happens after v3a merges; their impl runs alongside β cleanup.

---

## Acceptance criteria

| AC | Concern | Mechanism | Carries reviewer-finding fix |
|---|---|---|---|
| AC-1 | Workhorse verify-slice script | `scripts/verify-slice.sh` running tsc + vitest + leak scan + verification.md/security.md presence + per-language coverage thresholds + spec 72 §11 13-item checklist presence in security.md | F1c (§11 binding); F6 (per-language coverage); F6c (must pass against this slice AND S-F7-α reference slice) |
| AC-2 | Hooks-checksums + integrity check | `.claude/hooks-checksums.txt` (SHA256 of every `.claude/hooks/*.sh` + `.claude/settings.json` hook-registration block) + integrity check in `session-start.sh` (warns on drift); `.github/workflows/control-change-label.yml` requiring the `control-change` label on any PR touching `.claude/hooks/**`, `.claude/settings.json`, or `hooks-checksums.txt`. Label requires user approval (label-protection branch rule, one-time settings change). | F4b (settings.json registration in checksum scope); F5 (label-gated PRs are the real bypass-prevention; full multi-provider gate lands in v3c) |
| AC-3 | ESLint function-size rule + allowlist | `max-lines-per-function: [error, { max: 40, IIFEs: true }]` with React-component override `[error, { max: 80 }]` for `*.tsx`; `docs/eslint-baseline-allowlist.txt` seeded empty (β offenders captured when β resumes); CI workflow denies new disable directives outside the allowlist | (none from v1; new rule per session-36 plan) |
| AC-4 | Pre-commit verify-slice hook | `.claude/hooks/pre-commit-verify.sh` (PreToolUse on Bash matching `git commit`) — runs verify-slice.sh; blocks the commit on red. Harness-level, not git-level — bypasses by `--no-verify` don't apply. | (none from v1; new mechanism per session-36 plan) |
| AC-5 | TDD-first-every-commit hook | `.claude/hooks/tdd-first-every-commit.sh` (PreToolUse on Bash matching `git commit -- src/`) — staged diff must touch `tests/` OR match a pure-rename / pure-config / pure-visual exemption pattern (whitelist of file globs); blocks otherwise. Every commit, not just first. | F2b (every-commit beats first-commit-only) |
| AC-6 | Coverage gate | vitest config: `coverage.thresholds.lines: 90` for `.ts/.tsx`; verify-slice.sh parses lcov for new-line coverage on staged diff; fails if new src/ lines uncovered ≥10%. Bash `.sh` hooks tested via `shellspec` at ≥80% line per F6. | F6 (per-language coverage); test-quality substantively, not just structurally |
| AC-7 | Plan-time gate | `.claude/hooks/exit-plan-review.sh` (PreToolUse on `ExitPlanMode`) spawns fresh-context subagent reviewing the plan against CLAUDE.md "Planning conduct" + spec 70 slice-sizing + simplicity-first; subagent verifies any branch / SHA / state assertion in the plan against actual git (per F4e). Blocks plan exit on `architectural` severity findings. | F4e (verify-before-planning enforcement); reviewer F3c (plan-gate in v3a payload) |
| AC-8 | CLAUDE.md "Hard controls" stub section | Add new top-level §"Hard controls (in development)" to CLAUDE.md cataloguing the gates this slice ships, each with: file path, fire-time, bypass procedure (concretely defined: PR carries `control-change` label + user approval). Section is a stub that v3b/v3c extend; full consolidation rewrite is v3c's AC. | F3b (incremental CLAUDE.md edits permitted) |

**Σ check:** 8 ACs in scope. Total in this table: 8. Match. *(F4c AC-arithmetic verifier deferred to v3b — automated this check then.)*

---

## Bottom-up budget

Per F-budget v1 finding ("estimate appears to be vibes, not bottom-up"):

| AC | Component | Lines |
|---|---|---|
| AC-1 | `scripts/verify-slice.sh` (gates + parsers) | 150 |
| AC-1 | meta-tests via `shellspec` (failing-tests-first commit, then impl commit, separate SHAs per F2) | 100 |
| AC-2 | `.claude/hooks-checksums.txt` + checksum-generator script | 30 |
| AC-2 | `session-start.sh` integrity-check addition | 40 |
| AC-2 | `.github/workflows/control-change-label.yml` | 40 |
| AC-3 | ESLint config addition + `eslint-baseline-allowlist.txt` (empty seed) + CI denial check | 80 |
| AC-4 | `pre-commit-verify.sh` hook | 40 |
| AC-5 | `tdd-first-every-commit.sh` hook | 60 |
| AC-6 | vitest config + lcov-parser in verify-slice.sh + `shellspec` config | 50 |
| AC-7 | `exit-plan-review.sh` hook + subagent prompt template + git-state-verifier sub-script | 100 |
| AC-8 | CLAUDE.md "Hard controls (in development)" §stub | 50 |
| docs | this `acceptance.md` (revisions) + `security.md` + `verification.md` template + v2 review JSON | 200 |
| **Total v3a** | | **~940 lines** |

Across 2 sessions (37 + 38) = ~470 each. Reviewer's 3500-5000 estimate was for the FULL programme (v3a + v3b + v3c); v3a alone at ~940 fits.

---

## Cross-session plan

**Session 37:** AC-1 (verify-slice.sh + meta-tests, with failing-meta-tests as a separate SHA before impl per F2/F2b) + AC-3 (ESLint config + allowlist) + AC-4 (pre-commit-verify hook) + AC-8 (CLAUDE.md "Hard controls" stub).  ~470 lines. End-of-session 37: branch's first impl commit must pass verify-slice.sh against itself AND against S-F7-α reference slice (per F6c).

**Session 38:** AC-2 (hooks-checksums + integrity + label workflow) + AC-5 (TDD-first-every-commit) + AC-6 (coverage gate) + AC-7 (plan-time gate). ~470 lines. End-of-session 38: full v3a foundation live, all 8 ACs landed, slice ready for PR + multi-provider review (which will be implemented in v3c — interim review gate is the user + the v2 acceptance reviewer extended for diff-review).

**Session 39:** v3a verification.md fill + adversarial run + security.md fill (13-item §72 §11 checklist evidenced) + open PR. β cleanup unblocks at v3a merge to main.

---

## In-scope

- `scripts/verify-slice.sh` + meta-tests under `tests/shellspec/`
- `.claude/hooks/{pre-commit-verify,tdd-first-every-commit,exit-plan-review}.sh` + checksum updates in `hooks-checksums.txt`
- `.claude/hooks-checksums.txt` (new) + checksum-generator script under `scripts/`
- `session-start.sh` integrity-check addition (incremental edit)
- `.github/workflows/control-change-label.yml` (new) + extension to existing `pr-dod.yml` to call verify-slice.sh
- ESLint config additions + `docs/eslint-baseline-allowlist.txt` (empty seed)
- vitest config additions for coverage thresholds
- `shellspec` dev-dependency + config
- Slice artefacts: this `acceptance.md` (revised), `security.md`, `verification.md`, `acceptance.md.review-v2.json` (next subagent run)
- CLAUDE.md `+§"Hard controls (in development)"` stub section (incremental, NOT consolidating rewrite)

## Out-of-scope (deferred to v3b / v3c)

- All five "during-work review" subagent gates (commit-msg, spec-quote, AskUserQuestion-framing, periodic on-track, doc-honesty) — v3b
- Pair-programming PostToolUse hook + intent file + finding-response loop — v3b
- AC-arithmetic verifier (F4c) — v3b
- Snapshot-before-refactor enforcement (F4d) — v3b
- Multi-provider 3rd-agent reviewer — v3c
- Structured-findings JSON Schema for `/security-review` + `/review` — v3c
- DoD-evidence-parser AC (F1) — v3c
- Deferral-reason-validation (F1b) — v3c
- Stryker mutation testing — v3c
- Origin/main-anchored ratchet (F5c) — v3c (full ratchet + bypass procedure)
- Time-bound + slice-bound allowlist parser — v3c
- PR auto-opener — v3c
- Cron audit GitHub Action — v3c
- CLAUDE.md "Hard controls" CONSOLIDATING rewrite (full §rewrite per AC-9-original) — v3c. v3a only adds an incremental stub section.
- Modifications to existing β-branch code — separate β-cleanup slice, post-v3a-merge
- Modifications to existing α `src/lib/**` — own future slice

## External preconditions (per F6d)

These must be satisfied before v3a slice-merge to main. They are NOT slice-author-verifiable; track separately in the prerequisites table below with timestamp on completion.

| Precondition | Owner | Status | Verifier |
|---|---|---|---|
| GitHub branch protection on `main` requires ≥1 human approval before merge | User | not yet | `scripts/audit-controls.sh` `gh` API call (lands in v3c; until then manual user confirmation) |
| GitHub branch protection on `main` requires `control-change` label for `.claude/hooks/**` PRs | User | not yet | same as above |
| Label `control-change` exists on the repo with restricted-applicability (only user can apply) | User | not yet | `gh label list` check |

Slice DoD does NOT depend on these (per F3 fix); slice MERGE does. PR description carries explicit "External preconditions confirmed by user: [signature]" line as the merge gate.

## Definition of Done (slice-level)

All 8 ACs landed across sessions 37–39 with:

1. Each AC's evidence captured in `verification.md` against actual commit SHA
2. `scripts/verify-slice.sh` passes against (a) this slice's own commits AND (b) the prior `S-F7-α` reference slice without modification (per F6c — catches "wrote tests to match my output" failure mode)
3. `.claude/hooks-checksums.txt` matches all current `.claude/hooks/*.sh` + the relevant block of `.claude/settings.json` (F4b)
4. ESLint zero-disable check passes (allowlist remains empty for v3a code; β offenders captured when β resumes)
5. Per-language coverage on this slice's own scripts: `.sh` ≥80% via shellspec, `.ts` ≥90% via vitest (per F6)
6. Adversarial subagent re-review on slice diff returns verdict `approve` or `nit-only` (full multi-provider review gate lands in v3c; until then the same subagent template used for plan-review extended for diff-review)
7. spec 72 §11 13-item security checklist evidenced in `security.md` for this slice — every box has either evidence or explicit deferral text per spec 72 §11 exemption pattern (per F6e)
8. PR opened with body explicitly listing: external preconditions confirmed (per the prerequisites table); single-concern statement; v2 review verdict reference
9. CLAUDE.md `+§"Hard controls (in development)"` stub section added incrementally with this slice's gates documented (full consolidating rewrite is v3c's AC, not this slice's)

External preconditions table (above) gates MERGE, not slice-completion.

## Notes

- **The slice DOGFOODS its own controls starting at session-37 first impl commit.** Once verify-slice.sh + pre-commit-verify hook are live mid-session-37, every subsequent commit on this branch must pass them. Session 36 itself is exempt (the planning artefacts predate the controls); commits ff1254c + 405badd carry that exemption explicitly. Session-37 onwards: no exemptions on this branch.
- **Bootstrapping is honour-system for AC-1's failing-meta-tests-first commit** (per F2). Mitigation: commit log is reviewed at slice end (manual user check + the v2 acceptance reviewer extended for diff-review). Two commit SHAs must exist in order — one with failing meta-tests, one with the impl that makes them pass. If the order is wrong, the v3a verification.md adversarial-run section flags it and the slice can't be merged.
- **A subagent reviews this revised acceptance.md (`acceptance.md.review-v2.json`) before the first src/ commit on this branch** — that's the very next action after this commit. v1 review (request-changes) is preserved at `acceptance.md.review-v1.json` as the reason this revision exists.
- **Self-modification protection scope.** AC-2 covers `.claude/hooks/**` + `.claude/settings.json` hook-registration block + `hooks-checksums.txt`. It does NOT yet cover `.eslintrc` thresholds, `vitest.config` coverage thresholds, or `verify-slice.sh` itself — full origin/main-anchored ratchet for those lands in v3c (per F5c). Until then, those config files carry a TODO comment referencing v3c and are tracked in the prerequisites table for v3c.
