# S-INFRA-rigour-v3a-foundation · Foundational commit-time & plan-time gates

> **STATUS: v3 revision in progress (session 37).** v2 review returned `request-changes` with 2 BLOCK findings (G3+G10 — `control-change-label.yml` self-protection gap) and `single-concern still fails`. This revision addresses every BLOCK + every `request-changes` finding from v2, plus folds in the v2 reviewer's summary recommendations: bring AC-2 baseline forward to session 37; protect `control-change-label.yml` + `verify-slice.sh` in AC-2 scope; verify asserted SHAs inline; tighten budget to 1300–1800; rename single-concern honestly. Full v2 findings preserved at `acceptance.md.review-v2.json`; v1 historical at `acceptance.md.review-v1.json`. Next step after this revision lands: fresh-context v3 adversarial subagent run captured as `acceptance.md.review-v3.json`.

**Slice ID:** `S-INFRA-rigour-v3a-foundation`
**Branch:** `claude/S-INFRA-rigour-v3` (rename to `claude/S-INFRA-rigour-v3a-foundation` deferred to first impl commit per G1 — keeps current PR-URL stable across the planning-iteration churn; tracked as a v3a-internal carry-forward, not a precondition)
**Predecessor:** none — first slice in the rigour-v3 programme
**Successor:** `S-INFRA-rigour-v3b-subagent-suite`

**Single-concern (revised per v2 reviewer summary "rename single-concern honestly"):** *Foundational BEFORE-work gates that fire before any commit or plan is locked in — specifically: a verify-slice workhorse, a pre-commit hook running it, a TDD-every-commit hook, a coverage gate, an ESLint function-size rule, a plan-time subagent on `ExitPlanMode`, and the hooks-checksums + label-workflow protection covering all of the above.* This is multiple ACs bound by "BEFORE-work" + "foundation" — not a single atomic noun phrase. v1 reviewer mandated unbundling the original 9-AC slice into 3 single-concern slices; this is the foundational third. v2 reviewer's summary offered: *"either split further or rename single-concern honestly."* This revision takes the rename option because further splitting (e.g. plan-gate into v3a-2) creates circular dependencies — plan-gate needs verify-slice + pre-commit + ESLint already shipped to dogfood, exactly the order ACs already sit in. Acknowledged ambiguity: this slice is the *foundation layer* of a 3-slice rigour programme, not a single-concern atom.

**Blocks:** S-F7-β cleanup (parked at `claude/S-F7-beta-impl` HEAD `a3f67ec`) — β cleanup resumes only after v3a merges to main.
**Does NOT block:** v3b + v3c. Those slices' planning happens after v3a merges; their impl runs alongside β cleanup.

**Session-36 exemption SHAs verified (closes G14):** `git log --oneline` shows `ff1254c S-INFRA-rigour-v3: planning artefacts + adversarial subagent review (request-changes)` and `405badd S-INFRA-rigour-v3 split per session-36 reviewer recommendation` — both present at this branch tip. These two commits predate the controls this slice ships and are the only commits exempt from verify-slice.sh on this branch. Session-37 onwards: no exemptions.

---

## Acceptance criteria

| AC | Concern | Mechanism | Carries v1/v2 reviewer-finding fix |
|---|---|---|---|
| AC-1 | Workhorse verify-slice script | `scripts/verify-slice.sh` running tsc + vitest + leak scan + verification.md/security.md presence + per-language coverage thresholds + spec 72 §11 13-item checklist presence in security.md. **Useful-message exit pattern matching `read-cap.sh`**: failures quote the specific rule + suggest concrete remediation (G17). **Meta-tests run in tmp git repo per shellspec convention** — no real-repo writes (G15). | F1c (§11 binding); F6 (per-language coverage); F6c (must pass against this slice AND `docs/slices/S-F7-alpha-contracts-dev-mode/` reference slice); G15 (test isolation); G17 (useful-message exit) |
| AC-2 | Hooks-checksums + integrity check + label workflow | `.claude/hooks-checksums.txt` (SHA256 of every `.claude/hooks/*.sh` + `.claude/settings.json` hook-registration block + **`scripts/verify-slice.sh`** + **`.eslintrc` thresholds block** + **`vitest.config.ts` coverage thresholds block** + **`.claude/subagent-prompts/*.md`**) + integrity check in `session-start.sh` (warns on drift). `.github/workflows/control-change-label.yml` requires the `control-change` label on any PR touching paths in the protected list AND **the workflow file itself** + **`.github/workflows/pr-dod.yml` itself** (closes G3+G10 BLOCK recursion gap via path-filter self-inclusion). **Checksum baseline generated immediately at each hook's landing commit** — not deferred to a later session (closes G18 baseline-timing gap). | G3+G10 (BLOCK — path-filter self-inclusion); G12 (verify-slice.sh in scope); G4 (subagent prompt template checksummed); F4b (settings.json registration in scope); F5 (label-gated PRs are real bypass-prevention); G18 (baseline timing) |
| AC-3 | ESLint function-size rule + allowlist | `max-lines-per-function: [error, { max: 40, IIFEs: true }]` with React-component override `[error, { max: 80 }]` for `*.tsx`; `docs/eslint-baseline-allowlist.txt` seeded empty (β offenders captured when β resumes); CI workflow denies new disable directives outside the allowlist. | (none new) |
| AC-4 | Pre-commit verify-slice hook | `.claude/hooks/pre-commit-verify.sh` (PreToolUse on Bash matching `git commit`) — runs verify-slice.sh in **incremental mode** (staged-diff scope only); blocks the commit on red. Harness-level, not git-level — bypasses by `--no-verify` don't apply. **DoD-incremental-perf: completes in <5s on median commit on this repo** (G16). Full-mode verify-slice.sh runs in CI per AC-1; incremental mode is the pre-commit subset. | G16 (perf <5s incremental); G7 (ships session 37 alongside AC-2 baseline so no protected-hook-without-protection window) |
| AC-5 | TDD-first-every-commit hook | `.claude/hooks/tdd-first-every-commit.sh` (PreToolUse on Bash matching `git commit -- src/`) — staged diff must touch `tests/` OR match a pure-rename / pure-config / pure-visual exemption pattern (whitelist of file globs documented in `docs/eslint-baseline-allowlist.txt` adjacent allowlist); blocks otherwise. Every commit, not just first. | F2b (every-commit beats first-commit-only) |
| AC-6 | Coverage gate (per-language) | vitest config: `coverage.thresholds.lines: 90` for `.ts/.tsx`; verify-slice.sh parses lcov for new-line coverage on staged diff; fails if new src/ lines uncovered ≥10%. Bash `.sh` hooks tested via `shellspec` at ≥80% line per F6. **Per-language thresholds, not a single number** (closes "test-quality structurally not substantively"). | F6 (per-language coverage) |
| AC-7 | Plan-time gate | `.claude/hooks/exit-plan-review.sh` (PreToolUse on `ExitPlanMode`) spawns fresh-context subagent reviewing the plan against CLAUDE.md "Planning conduct" + spec 70 slice-sizing + simplicity-first; **subagent verifies any branch / SHA / state assertion in the plan against actual git** (per F4e). Blocks plan exit on `architectural` severity findings. **Subagent prompt template stored at `.claude/subagent-prompts/exit-plan-review.md` and checksummed via AC-2** (closes G4 — prompt template not freely modifiable). **Plan content passed as quoted/escaped argument with explicit framing `<plan-from-author>...</plan-from-author>` separator** (closes G4 prompt-injection risk). **Ships session 37, not 38** (closes G9 — AC-7 cannot govern its own session-38 plan if it doesn't exist until session 38; reviewer's option (b) preferred). | F4e (verify-before-planning); reviewer F3c (plan-gate in v3a payload); G4 (template checksummed + injection-safe framing); G9 (session 37 ship) |
| AC-8 | CLAUDE.md "Hard controls (in development)" stub | Add new top-level §"Hard controls (in development)" to CLAUDE.md cataloguing the gates this slice ships, each with: file path, fire-time, bypass procedure (concretely defined: PR carries `control-change` label + user approval). **Verdict vocabulary documented inline** (`approve` / `nit-only` / `request-changes` / `block` — G23). **Rollback procedure documented** (revert merge commit on main; `.claude/hooks/*` reset; PR carries `control-change` label — G19). Section is a stub that v3b/v3c extend; full consolidation rewrite is v3c's AC. | F3b (incremental edits permitted); G19 (rollback procedure); G23 (verdict vocabulary) |

**Σ check:** 8 ACs in scope. Total in this table: 8. Match. *(F4c AC-arithmetic verifier deferred to **v3b** — automated this check then. v3c stub will be edited in this same commit to remove the duplicate F4c reference and consolidate into v3b only.)*

---

## Bottom-up budget (revised per G6 + v2 summary "tighten budget to 1300-1800")

Per F-budget v1 finding ("estimate appears to be vibes, not bottom-up") + G6 ("docs budget 200 lines underestimates: acceptance.md alone 135+ pre-impl, plus security.md, verification.md") + v2 summary explicit target band:

| AC | Component | Lines |
|---|---|---|
| AC-1 | `scripts/verify-slice.sh` (gates + per-language coverage parsers + useful-message-exit + tmp-repo isolation helper) | 200 |
| AC-1 | meta-tests via `shellspec` in tmp git repo (failing-tests-first commit pushed + CI-observed-failing per G13, then impl commit, separate SHAs per F2) | 150 |
| AC-2 | `.claude/hooks-checksums.txt` + checksum-generator script (extended scope: hooks + settings.json block + verify-slice.sh + eslintrc + vitest.config + subagent prompts) | 60 |
| AC-2 | `session-start.sh` integrity-check addition (extended scope) | 60 |
| AC-2 | `.github/workflows/control-change-label.yml` (path-filter includes self + `pr-dod.yml` per G3+G10) | 80 |
| AC-3 | ESLint config addition + `eslint-baseline-allowlist.txt` (empty seed) + CI denial check | 100 |
| AC-4 | `pre-commit-verify.sh` hook (incremental-mode + perf budget assertion) | 60 |
| AC-5 | `tdd-first-every-commit.sh` hook + exemption whitelist | 80 |
| AC-6 | vitest config + lcov-parser in verify-slice.sh + `shellspec` config | 80 |
| AC-7 | `exit-plan-review.sh` hook + `.claude/subagent-prompts/exit-plan-review.md` template + git-state-verifier sub-script + injection-safe input framing | 150 |
| AC-8 | CLAUDE.md "Hard controls (in development)" §stub (gates table + verdict vocabulary + rollback procedure) | 80 |
| docs | this `acceptance.md` (revisions v1→v2→v3...) + `security.md` (with threat model per G11) + `verification.md` template (with multi-commit DoD-1 evidence schema per G21) + v2 + v3 review JSONs | 350 |
| **Total v3a** | | **~1450 lines** |

Within reviewer's 1300–1800 target band. Across 2 impl sessions + 1 wrap session (37 + 38 + 39).

---

## Cross-session plan (revised per G7 + G9 + G18)

**Pre-session-37 external precondition:** user provisions repo-level branch protection on `main` requiring `control-change` label for PRs touching protected paths (see External preconditions table below). Without this in place, AC-2's label workflow is theatrical (closes G11 — controls prevent Claude from silently weakening, NOT a malicious user).

**Session 37** (~720 lines): AC-1 verify-slice.sh + meta-tests (failing-meta-tests-first commit pushed, CI-observed-failing per G13, then impl commit — separate SHAs per F2/F2b) · AC-2 hooks-checksums baseline + integrity check (G7 — ships alongside the protected hooks, not a session later; G18 — checksums generated immediately at each hook's landing commit) · AC-3 ESLint config + allowlist · AC-4 pre-commit-verify hook · AC-7 plan-time gate (G9 — option (b): ship session 37 so AC-7 can govern session-38 plan) · AC-8 CLAUDE.md "Hard controls (in development)" stub. End-of-session 37: branch's first impl commit must pass verify-slice.sh against itself AND against `docs/slices/S-F7-alpha-contracts-dev-mode/` reference slice (per F6c — verified G22 path).

**Session 38** (~470 lines): AC-2 control-change-label.yml workflow with path-filter self-inclusion (G3+G10 BLOCK fix — workflow protects itself + `pr-dod.yml` + verify-slice.sh + .eslintrc + vitest.config + subagent prompts) · AC-5 TDD-first-every-commit hook · AC-6 coverage gate (vitest + shellspec). End-of-session 38: full v3a foundation live, all 8 ACs landed.

**Session 39** (~260 lines docs + adversarial run): v3a verification.md fill (multi-commit DoD-1 evidence schema per G21 — commit-range or final-SHA cited per AC) + adversarial run + security.md fill (13-item §72 §11 checklist evidenced + threat model section per G11) + open PR (or draft if external preconditions still pending per G24). β cleanup unblocks at v3a merge to main.

---

## In-scope

- `scripts/verify-slice.sh` + meta-tests under `tests/shellspec/` (run in tmp git repo per G15)
- `.claude/hooks/{pre-commit-verify,tdd-first-every-commit,exit-plan-review}.sh` + checksum updates in `hooks-checksums.txt`
- `.claude/subagent-prompts/exit-plan-review.md` (new — checksummed per AC-2 to close G4)
- `.claude/hooks-checksums.txt` (new) + checksum-generator script under `scripts/`
- `session-start.sh` integrity-check addition (incremental edit)
- `.github/workflows/control-change-label.yml` (new — path-filter includes self + `pr-dod.yml` per G3+G10) + extension to existing `pr-dod.yml` to call verify-slice.sh
- ESLint config additions + `docs/eslint-baseline-allowlist.txt` (empty seed)
- vitest config additions for coverage thresholds
- `shellspec` dev-dependency + config
- Slice artefacts: this `acceptance.md` (revised v1→v2→v3...), `security.md` (with explicit threat model per G11), `verification.md` (multi-commit DoD-1 evidence schema per G21), `acceptance.md.review-v3.json` (next subagent run)
- CLAUDE.md `+§"Hard controls (in development)"` stub section (incremental, NOT consolidating rewrite — full rewrite is v3c)

## Out-of-scope (deferred to v3b / v3c)

- All five "during-work review" subagent gates (commit-msg, spec-quote, AskUserQuestion-framing, periodic on-track, doc-honesty) — **v3b**
- Pair-programming PostToolUse hook + intent file + finding-response loop — **v3b**
- AC-arithmetic verifier (F4c) — **v3b** *(consolidated here; v3c stub edited in this same commit to remove duplicate reference)*
- Snapshot-before-refactor enforcement (F4d) — **v3b**
- Multi-provider 3rd-agent reviewer — **v3c**
- Structured-findings JSON Schema for `/security-review` + `/review` — **v3c**
- DoD-evidence-parser AC (F1) — **v3c**
- Deferral-reason-validation (F1b) — **v3c**
- Stryker mutation testing — **v3c**
- Origin/main-anchored ratchet (F5c) — **v3c** (full ratchet + bypass procedure; v3a includes config files in checksum scope but ratchet enforcement is v3c)
- Time-bound + slice-bound allowlist parser — **v3c**
- PR auto-opener — **v3c**
- Cron audit GitHub Action — **v3c**
- CLAUDE.md "Hard controls" CONSOLIDATING rewrite — **v3c** (v3a only adds incremental stub)
- Modifications to existing β-branch code — separate β-cleanup slice, post-v3a-merge
- Modifications to existing α `src/lib/**` — own future slice

---

## External preconditions (per F6d + G24)

These must be satisfied before v3a slice-merge to main. They are NOT slice-author-verifiable; tracked separately with timestamp on completion. **Per G24: PR may open as DRAFT pending preconditions; merge gate requires all rows confirmed. SLA: user owns; if any row remains `not yet` 7 days after PR opens as draft, escalate to user explicitly in PR comment.**

| Precondition | Owner | Status | Verifier | SLA |
|---|---|---|---|---|
| Label `control-change` exists on the repo with restricted-applicability (only user can apply) | User | not yet | `gh label list` | Day 0 of session 37 (blocks AC-2 workflow landing if absent) |
| GitHub branch protection on `main` requires `control-change` label for PRs touching protected paths (incl. workflow itself per G3+G10) | User | not yet | `scripts/audit-controls.sh` `gh` API call (lands in v3c; until then manual user confirmation) | Day 0 of session 37 |
| GitHub branch protection on `main` requires ≥1 human approval before merge | User | not yet | same as above | Pre-merge gate only (not pre-PR) |

Slice DoD does NOT depend on these (per F3 fix); slice MERGE does. PR description carries explicit "External preconditions confirmed by user: [signature + timestamp]" line as the merge gate. **Threat model honesty (per G11):** these preconditions prevent Claude from silently weakening the controls. They do NOT prevent a malicious user — on a one-user-one-Claude system the user is the same actor that would (in adversarial threat model) bypass controls. Document explicitly in `security.md`; do not pretend the label is more than it is.

---

## Definition of Done (slice-level)

All 8 ACs landed across sessions 37–39 with:

1. **Each AC's evidence captured in `verification.md` against actual commit SHA.** Evidence schema (per G21): for single-commit ACs, cite the FINAL SHA; for multi-commit ACs (e.g. AC-1 verify-slice.sh which spans failing-meta-tests SHA + impl SHA), cite the COMMIT-RANGE `<first>..<last>` plus the FINAL SHA where AC complete. Both forms are valid.
2. `scripts/verify-slice.sh` passes against (a) this slice's own commits AND (b) the prior `docs/slices/S-F7-alpha-contracts-dev-mode/` reference slice without modification (per F6c — closes G22 path-string verification; α confirmed to have `acceptance.md` + `security.md` + `verification.md` + `test-plan.md` + corresponding `tests/unit/{auth,store,scenario}-*.test.ts` covering the 8 ts modules. Coverage threshold satisfaction itself verified during AC-1 impl, not in this acceptance — DoD-2 may need exemption-with-reasoning if α coverage falls short of 90%.)
3. `.claude/hooks-checksums.txt` matches all current `.claude/hooks/*.sh` + relevant block of `.claude/settings.json` + `scripts/verify-slice.sh` + `.eslintrc` thresholds + `vitest.config.ts` thresholds + `.claude/subagent-prompts/*.md` (extended scope per G4 + G12).
4. ESLint zero-disable check passes (allowlist remains empty for v3a code; β offenders captured when β resumes).
5. Per-language coverage on this slice's own scripts: `.sh` ≥80% via shellspec, `.ts` ≥90% via vitest (per F6).
6. **`pre-commit-verify.sh` perf budget verified: <5s on median commit in incremental mode** (per G16). Verification run captured in `verification.md` AC-4 evidence section with timing data from 5 representative commits.
7. **Failing-meta-tests-first commit pushed to remote AND CI-observed-failing before impl pushed** (per G13). CI run ID captured in `verification.md` AC-1 evidence; closes "wrote both at once, split into two commits" loophole — external-system-verifiable.
8. Adversarial subagent re-review on slice diff returns verdict `approve` or `nit-only` (vocabulary documented inline in CLAUDE.md "Hard controls" stub per G23: `approve` = ship · `nit-only` = ship + open issue for nits · `request-changes` = revise + re-review · `block` = revise + re-review + re-spawn). Full multi-provider review gate lands in v3c; until then the same subagent template used for plan-review extended for diff-review.
9. **`/security-review` skill run on slice diff captured in `security.md`** (per G20). DoD-9 enumerates which §72 §11 boxes require positive evidence: items 5 (env vars) · 9 (dev/prod boundary) · 11 (adversarial review) · 13 (secrets hygiene) all REQUIRE positive evidence for an infrastructure slice; other items may be N/A with explicit justification.
10. spec 72 §11 13-item security checklist evidenced in `security.md` for this slice — every box has either evidence or explicit deferral text per spec 72 §11 exemption pattern (per F6e).
11. PR opened (draft permitted per G24 if external preconditions still pending) with body explicitly listing: external preconditions table state; single-concern statement; v3 review verdict reference.
12. CLAUDE.md `+§"Hard controls (in development)"` stub section added incrementally with this slice's gates documented (full consolidating rewrite is v3c's AC, not this slice's).

External preconditions table (above) gates MERGE, not slice-completion.

---

## Notes

- **The slice DOGFOODS its own controls starting at session-37 first impl commit.** Once verify-slice.sh + pre-commit-verify hook are live mid-session-37, every subsequent commit on this branch must pass them. Session 36 itself is exempt (the planning artefacts predate the controls); commits `ff1254c` + `405badd` carry that exemption explicitly. Session-37 onwards: no exemptions on this branch.
- **G14 closure (SHA verification inline):** `git log --oneline | grep -E 'ff1254c|405badd'` against this branch returns: `405badd S-INFRA-rigour-v3 split per session-36 reviewer recommendation` and `ff1254c S-INFRA-rigour-v3: planning artefacts + adversarial subagent review (request-changes)`. Both SHAs verified present at v3-revision drafting time. AC-7's `git-state-verifier` sub-script will perform this same check programmatically for any future plan citing SHAs.
- **Bootstrapping is honour-system for AC-1's failing-meta-tests-first commit only at the very first invocation** (per F2). Mitigation per G13: failing-meta-tests commit pushed to remote; CI-observed-failing (CI run ID captured in `verification.md`); impl commit pushed only after CI confirms RED. External-system-verifiable, not author-asserted.
- **A subagent reviews this revised acceptance.md (`acceptance.md.review-v3.json`) before the first src/ commit on this branch** — that's the very next action after this commit. v1 + v2 reviews preserved as `acceptance.md.review-v1.json` + `acceptance.md.review-v2.json`.
- **Self-modification protection scope (revised per G3+G10+G12+G4+F4b).** AC-2 covers: `.claude/hooks/**` + `.claude/settings.json` hook-registration block + `scripts/verify-slice.sh` + `.eslintrc` thresholds block + `vitest.config.ts` coverage thresholds block + `.claude/subagent-prompts/*.md` + `hooks-checksums.txt` + `.github/workflows/control-change-label.yml` (the workflow protects itself via path-filter self-inclusion) + `.github/workflows/pr-dod.yml`. Full origin/main-anchored ratchet for thresholds lands in v3c (per F5c); until then those config files carry a TODO comment referencing v3c and are tracked in v3c's prerequisites.
- **Threat model (per G11) — honest framing:** these controls prevent Claude from silently weakening the rigour infrastructure. They do NOT defend against a malicious user, because on this one-user-one-Claude system the user is the same actor that applies the `control-change` label. Documented explicitly in `security.md` rather than implied. F5b's "theatrical multi-key sign-off" anti-pattern explicitly avoided.
- **Rollback procedure (per G19):** if v3a infrastructure causes operational pain post-merge, rollback is: (a) revert merge commit on main via `git revert -m 1 <merge-sha>` in a new PR carrying the `control-change` label; (b) `.claude/hooks/{pre-commit-verify,tdd-first-every-commit,exit-plan-review}.sh` remain on disk locally but become inert because their `settings.json` registration is reverted; (c) `hooks-checksums.txt` is reverted; (d) the revert PR documents WHY in body so v3a-2 can address the root cause. **No `--no-verify` bypass needed** — harness-level hooks don't intercept `git revert` of unregistered settings.
- **AC-arithmetic-verifier (F4c) consolidated to v3b only.** v3c stub previously listed it; this revision edits the v3c stub in the same commit to remove the duplicate reference. Source of truth: v3a out-of-scope row above + v3b stub scope marker.
