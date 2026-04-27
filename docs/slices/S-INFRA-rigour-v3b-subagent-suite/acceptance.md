# S-INFRA-rigour-v3b · Adversarial subagent suite

> **STATUS: planning — full AC drafted top-down from `audit-findings.md` §5 (sessions 41/42).** Pre-impl: `/security-review` + `/review` gates pending against this file before any RED-tests-first impl per carry-over #10 drafting protocol.

**Slice ID:** `S-INFRA-rigour-v3b-subagent-suite`
**Predecessor:** `S-INFRA-rigour-v3a-foundation` (PR #24, ready-for-review at session 41/42 wrap)
**Successor:** `S-INFRA-rigour-v3c-quality-and-rewrite`
**Single-concern:** *Adversarial subagent gates that fire on every relevant tool call to enforce CLAUDE.md principles in real time.*

**Audit trail:** `audit-findings.md` (committed alongside this file as part of v3b's S-1 commit) captures the deliberate one-time pass over Tier-4 archive sources required by the predecessor `acceptance.md` carry-over #10. AC-1 through AC-15 below are drafted top-down from `audit-findings.md` §5; do NOT extend bottom-up from older carry-over items without first updating the audit trail.

**Total budget estimate:** ~1500 lines authoritative source — composition revised per audit (matches session-36 magnitude estimate). Re-validate at AC freeze.

---

## Acceptance criteria

15 ACs grouped per `audit-findings.md` §5. Field convention per `engineering-phase-candidates.md` §C, compressed: each AC has **Outcome · Verification · Scope · Loveable**. Full §C template (Out-of-scope / Opens-blocked / In-scope expansions) added inline for any AC where ambiguity surfaces during /review. "Loveable" rephrased for engineering-infra context: *does this AC make the engineer feel a valuable safety-net or annoying friction?*

### A. Subagent personas (canonical prompt files at `.claude/agents/*.md`)

#### AC-1 · `slice-reviewer.md` persona + auto-on-PR-open CI gate
- **Outcome:** Every PR that touches `src/` receives an automatic adversarial code review by a fresh-context subagent before the human reviewer arrives, surfacing edge cases / security concerns / regression risks / AC gaps / scope-creep findings within the diff.
- **Verification:** Persona file `.claude/agents/slice-reviewer.md` exists + is integrity-protected via `hooks-checksums.txt` baseline (per v3a AC-2). CI workflow `.github/workflows/auto-review.yml` runs `claude -p` (or wraps `/review`) on `pull_request` opened/synchronize against the diff + linked AC + CLAUDE.md "Coding conduct" rubric, posts a check run with one of the four verdicts per CLAUDE.md "Hard controls > Verdict vocabulary": *"`approve` — no findings; proceed. `nit-only` — minor findings (style / wording); author may proceed without fixing. `request-changes` — findings the author should address before proceeding; not blocking. `block` — architectural-severity findings; gate refuses to proceed until addressed."* (G23 vocabulary). Test fixture: synthetic PR with a known scope-creep finding; check run reports `request-changes` with the finding cited.
- **Scope:** AC-1 covers persona prompt + workflow + verdict-posting only. Out: integration with branch-protection (defer to v3c).
- **Loveable:** valuable safety-net — engineer gets a fresh-eyes second opinion without waiting for the human reviewer's window.

#### AC-2 · `acceptance-gate.md` persona
- **Outcome:** A subagent walks each slice's AC list at slice-completion time and renders a per-AC pass/fail-with-narrative judgment on whether the evidence in `verification.md` actually supports the AC claim — distinct from `verify-slice.sh`'s file-presence + tooling-runs check.
- **Verification:** Persona file `.claude/agents/acceptance-gate.md` exists. Persona prompt absorbs the engineering-phase-candidates §C template requirements — including verifying each AC has a *Loveable check* field (engineering-phase-candidates L86: *"Loveable check: [one sentence: does meeting this AC make the user feel delighted or merely served? If merely served, re-draft the AC.]"*) + AC-quantity is in 3–10 range (L89: *"Quantity guidance: minimum 3 AC per slice; ideally 5-7. More than 10 = slice is too big; reconsider the cut."*). Test fixture: synthetic slice with one AC missing the Loveable check + one AC with evidence text that doesn't match its claim; persona output flags both.
- **Scope:** AC-2 covers the persona file + prompt rubric + invocation convention (called by `/wrap` or slice-completion gate). Out: auto-blocking PR merge on persona output (defer to v3c if persona proves reliable).
- **Loveable:** valuable safety-net — catches papered-over evidence before merge.

#### AC-3 · `ux-polish-reviewer.md` persona (dormant at v3b, active from S-F1)
- **Outcome:** A subagent reviews every src/ slice's UI surface for micro-interaction / animation / `prefers-reduced-motion` / keyboard-only / screen-reader sanity, catching where the "polish floor" (CLAUDE.md North star) is missing.
- **Verification:** Persona file `.claude/agents/ux-polish-reviewer.md` exists with rubric covering all six dimensions. Invocation convention documented in CLAUDE.md "Hard controls" stub: spawn during slice-completion for any AC whose `In scope` mentions UI surface. Dormant at v3b ship (no UI surface in this infra slice); active from S-F1 onwards. Test fixture: synthetic component diff missing `prefers-reduced-motion` fallback; persona flags it.
- **Scope:** AC-3 covers persona file + invocation convention + dormant-at-v3b-active-from-S-F1 contract. Out: actual exercise on a UI slice (proves out at S-F1 ship).
- **Loveable:** load-bearing safety-net for the North star — without this, "polish floor" relies on whatever the engineer felt like checking.

#### AC-4 · Persona retain/drop metric
- **Outcome:** After the first 3 src/ slices (S-F1 onwards), each `.claude/agents/*.md` persona has a documented retain-or-drop decision based on whether it caught at least one issue per 2-3 slices that the main conversation missed (engineering-phase-candidates §E L130).
- **Verification:** CLAUDE.md "Hard controls" stub specifies the retain/drop metric verbatim. Per-slice handoff template (`HANDOFF-SESSION-N.md`) includes a "Persona findings recorded" section logging each persona's findings count for that slice. After 3 src/ slices, slice handoff renders explicit retain-or-drop verdict per persona; verdict is committed as part of the third slice's wrap docs.
- **Scope:** AC-4 covers the metric definition + handoff-template extension + recording protocol. Out: actual retain/drop verdict (decided at the third src/ slice, post-v3b).
- **Loveable:** valuable discipline — without it, personas accumulate without retention check; same drift risk that triggered this audit.

#### AC-5 · `.claude/agents/` vs `.claude/subagent-prompts/` location reconciliation
- **Outcome:** Repo has one canonical location convention for subagent prompt files; v3a's `.claude/subagent-prompts/exit-plan-review.md` is reconciled (moved or formal distinction documented) so future sessions don't drift.
- **Verification:** Either (i) `.claude/subagent-prompts/exit-plan-review.md` is moved under `.claude/agents/` with checksum baseline + L199 + path-filter updated to match (path migration pattern), OR (ii) CLAUDE.md "Hard controls" stub documents the formal distinction (`.claude/subagent-prompts/` for hook-spawned templates + `.claude/agents/` for review personas) with verbatim §E L132 reference: *"Storage: repo-level `.claude/agents/` (committed, travels with the project). Not user-home (`~/.claude/`) — those are personal and don't version with the codebase."* Decision recorded in slice's `verification.md` AC-5 row with cited reasoning.
- **Scope:** AC-5 covers the reconciliation + CLAUDE.md update. Out: any further refactor of v3a hook code (out-of-scope structural touch).
- **Loveable:** small safety-net — prevents future sessions inheriting an undocumented inconsistency.

### B. Hook-level gates (PreToolUse / pre-push)

#### AC-6 · `tdd-guard` PreToolUse hook
- **Outcome:** Any `Write` or `Edit` to `src/<path>` triggers the affected test file (`tests/<path>.test.ts` mapping per repo convention) to run via `npx vitest run`; the tool call is **refused on RED** with a G17-style explanatory message. Gates **behaviour** (test passes), complementing v3a's discipline-only AC-5 (`tdd-first-every-commit.sh`) which only gates **paperwork** (test file is staged).
- **Verification:** Hook `.claude/hooks/tdd-guard.sh` registered as `PreToolUse:Write` + `PreToolUse:Edit` in `.claude/settings.json` with matcher scoped to `src/**`. Hook (a) maps the target src path to its test file via deterministic rewrite rule: `src/<path>.{ts,tsx}` → `tests/unit/<path>.test.{ts,tsx}` (preserve extension; replace leading `src/` with `tests/unit/`; insert `.test` before extension); (b) runs `npx vitest run <test-file>` with budget cap (warn on stderr at 60s elapsed; abort with non-zero exit at 90s elapsed — both surface to the caller as fail-loud); (c) returns deny on RED with G17 message naming the failing assertion. Allowlist read from `docs/tdd-exemption-allowlist.txt` (reuse v3a AC-5 file). Shellspec meta-tests cover: green-path passes through · red-path blocks with correct message · allowlisted path passes through · missing-test-file blocks with "missing test" message (distinct from RED) · timeout fails fail-loud. Source attribution: external TDD-workflow article (claude-world.com), HANDOFF-SESSION-31 §7 L92.
- **Scope:** AC-6 covers the hook + tests + allowlist consumption + CLAUDE.md "Hard controls" stub addition. Out: cross-language test-file mapping beyond `.ts/.tsx`/`.test.ts` (defer to v3c if needed).
- **Loveable:** valuable safety-net — engineer gets immediate red-line on impl that breaks its own test, before commit attempt or CI cycle.

#### AC-7 · Pre-push gate for DoD-7 temporal ordering
- **Outcome:** A pre-push hook (or PR-creation pre-flight) blocks pushing an impl commit when the immediately prior commit is a self-described RED-meta-tests commit AND CI has not yet observed the prior commit's expected RED state. Closes the procedural gap surfaced at v3a session 40 (S-38-2 RED → S-38-1 GREEN pushed within 5 minutes).
- **Verification:** Hook `.claude/hooks/pre-push-dod7.sh` registered as `PreToolUse` on `Bash` matchers `git push*`. Hook (a) inspects last commit pair on current branch; (b) checks if the prior commit message matches the canonical RED-meta-test regex `^RED:` (case-sensitive, single canonical pattern — author prefixes `RED:` to declare intent; mirrors v3a TDD-guard convention); (c) if so, queries GitHub Actions API for the prior commit's CI run state; (d) blocks the push when ALL three hold: (i) prior commit msg matches `^RED:` AND (ii) the next commit msg does NOT match `^RED:` (i.e. is a candidate GREEN-impl) AND (iii) the prior commit's CI run for the RED meta-test does not yet exist OR is still in-progress. Override via env var `DOD7_OVERRIDE=1` for documented edge cases (recorded in slice's verification.md). Shellspec fixtures: RED-then-GREEN pair, prior-commit-still-pending → block · RED-then-unrelated-commit pair → pass-through · GREEN-then-GREEN pair → pass-through · override env present → warn-but-pass.
- **Scope:** AC-7 covers hook + tests + override convention + CLAUDE.md "Hard controls" stub addition. Out: server-side enforcement (this is a client-side hook; CI-side mirror enforcement is v3c).
- **Loveable:** valuable safety-net — engineer can't accidentally race RED past CI; the procedural gap that v3a session 40 self-flagged is structurally closed.

### C. Doc / convention gates

#### AC-8 · TDD bail-out criteria as documented rubric
- **Outcome:** The `tdd-exemption-allowlist.txt` allowlist (v3a AC-5) ships with a header rubric stating *exactly* which categories of work qualify for exemption, preventing ad-hoc accumulation. Engineering-phase-candidates §G L169 verbatim: *"Lean: pure-visual UI, visual-regression-only covered surfaces. Everything else: test first."*
- **Verification:** `docs/tdd-exemption-allowlist.txt` header amended (or sibling `tdd-exemption-rubric.md` created) with the literal §G L169 rubric + concrete examples + non-examples. CLAUDE.md "Engineering conventions" gets a one-line "TDD where tractable; bail-out criteria at `docs/tdd-exemption-allowlist.txt` header". `verify-slice.sh` Gate 4 (or new Gate) checks each allowlist entry has a category tag matching the rubric's allowed categories; entries without a category tag fail-loud. Test fixture: allowlist with `tagged-pure-visual-ui:src/foo.tsx` passes; untagged entry `src/bar.tsx` fails.
- **Scope:** AC-8 covers rubric authoring + allowlist format extension + verify-slice.sh enforcement + CLAUDE.md mention. Out: actual category disputes on existing allowlist entries (re-tag at v3b ship).
- **Loveable:** valuable discipline — the bail-out becomes a debate over rubric application, not a free-pass.

#### AC-9 · Preview-deploy verification checklist + per-slice recording location
- **Outcome:** DoD item 4's "Preview deploy verified in-browser if UI" gets a documented exact checklist (golden path / edge cases / `prefers-reduced-motion` / keyboard-only / mobile viewport / screen-reader) and per-slice recording location, replacing "verified means whatever the engineer felt like checking."
- **Verification:** Spec authored at `docs/workspace-spec/72a-preview-deploy-rubric.md` (or appended to spec 72) with the six-dimension checklist verbatim per engineering-phase-candidates §G L166. `verification.md` template adds `## Preview-deploy verification` section with one row per dimension + slice-specific Pass/Fail/N-A + brief evidence cell. CLAUDE.md "Hard controls" stub references the rubric. AC pairs with AC-3 `ux-polish-reviewer.md` persona (the persona reviews this section). Test fixture: synthetic verification.md with one dimension marked Pass without evidence text fails the acceptance-gate persona (AC-2).
- **Scope:** AC-9 covers rubric authoring + verification.md template extension + CLAUDE.md mention + persona-AC-3 cross-link. Out: visual-regression tooling decision (engineering-phase-candidates §G·2 — Phase C kickoff, separate item).
- **Loveable:** valuable safety-net — "verified" gains a meaningful contract.

#### AC-10 · Adversarial-review-gate budget convention
- **Outcome:** The DoD-3 adversarial-review pattern is structurally feasible for slices whose authoritative source exceeds ~300 lines (the read-cap). Convention either (a) grants reviewers an explicit multi-turn budget envelope, or (b) partitions the brief into spec-side / impl-side / git-history sub-spawns each fitting one turn. Closes the structural-infeasibility gap surfaced at v3a session 40.
- **Verification:** Convention authored at `docs/workspace-spec/72b-adversarial-review-budget.md` (or appended to spec 72 §11). Convention spec includes: (a) budget-envelope option — reviewer prompt declares "expected 2-3 turns; will surface read-cap deferrals as v3c carry-over"; (b) partition option — main session orchestrates 3 sub-spawns each receiving disjoint slice-of-the-source; (c) decision criteria — measured by `wc -l docs/slices/S-*/acceptance.md` (canonical source-of-truth; sibling docs are derivative): <300 lines use single-turn (status quo); 300-1000 lines use partition; >1000 lines use multi-turn budget. CLAUDE.md "Coding conduct" or "Engineering conventions" gains one-line ref. Pre-flight gate added to slice setup: when `wc -l docs/slices/S-*/acceptance.md` >300, slice setup notes which option applies.
- **Scope:** AC-10 covers the convention spec + decision-criteria + pre-flight integration + CLAUDE.md mention. Out: retroactive re-review of v3a using the new convention (v3a is shipped state; deferred).
- **Loveable:** valuable discipline — DoD-3 becomes consistently achievable; reviewers stop hitting structural walls.

### D. Tactical infra (small surface, must-ship)

#### AC-11 · L199 protected-path scope amendment for three v3a omissions
- **Outcome:** Three artefacts that sit inside v3a's AC-3 / AC-7 chains and are in `hooks-checksums.txt` baseline today, but are NOT named in the L199 enumeration or the `control-change-label.yml` path filter, get added — closing the silent-weakening hole.
- **Verification:** `docs/workspace-spec/72.md` L199 list (or wherever v3a anchored the protected-path enumeration) is amended to include verbatim: `scripts/git-state-verifier.sh`, `scripts/eslint-no-disable.sh`, `docs/eslint-baseline-allowlist.txt`. `.github/workflows/control-change-label.yml` path-filter step pattern is amended to match. `hooks-checksums.txt` baseline is regenerated and integrity-protected per v3a AC-2. CI test: opening a PR that touches one of the three paths without `control-change` label → check run fails with "control-change label required for control-plane paths"; same PR after label applied → passes.
- **Scope:** AC-11 covers the three named files only. Out: any further protected-path candidates surfaced during v3b impl (capture as v3c carry-over).
- **Loveable:** small must-ship safety-net — closes a known integrity hole.

#### AC-12 · `line-count.sh` session-base re-baseline on branch-resume + meta-test
- **Outcome:** When the user resyncs from harness-orphan to canonical branch mid-session (the case CLAUDE.md's "Branch-resume check" warns about), `line-count.sh` updates `/tmp/claude-base-$SESSION_ID.txt` so subsequent line-count deltas reflect authored-this-session work, not cross-branch resync diff. Closes the session-40 bug + session-32 lockfile-inflation cluster (HANDOFF-30 candidate #5 calibration data merges in).
- **Verification:** Either (a) extend `.claude/hooks/session-start.sh` to detect post-checkout state change vs prior session base and update the base file; OR (b) add separate hook `.claude/hooks/post-branch-resync.sh` registered as PostToolUse on `Bash` matchers that include `git checkout -B|git reset --hard origin/*`. The "absent-only" guard at session-start.sh:27-28 is relaxed to "absent OR HEAD-mismatched-by->=200 lines (cumulative `git diff --shortstat` insertions+deletions between cached base SHA and current HEAD; threshold 200 = generous absorption of normal session churn, tight enough to catch cross-branch hops). Rebaselining is once-per-hop: every checkout to a different branch SHA triggers rebaseline at the next hook fire; same-branch reset (no SHA change) does not. Shellspec fixtures: harness-orphan landing → canonical resync via documented recipe → next Edit on tracked file reports authored-only delta · same-branch reset (no SHA change) → no rebaseline · multi-branch hop → rebaseline once per hop. Documents calibration model from HANDOFF-30 §Calibration-data (the +N×2 replace-all pattern, +0 same-length pattern) in hook header comments.
- **Scope:** AC-12 covers the hook fix + meta-tests + comment-block calibration model. Out: the underlying decision of whether to gitignore vs annotate large auto-generated artifacts (HANDOFF-32 #57 — separate concern).
- **Loveable:** valuable safety-net — the very hook that fired falsely during this slice's drafting becomes reliable.

#### AC-13 · v3a AC-6 lcov parser shellspec meta-test
- **Outcome:** v3a session-40 commit `95481e5` added the lcov parser inline in `verify-slice.sh` Gate 5 without a shellspec test (acknowledged in carry-over #4 as elevated-to-v3b-BLOCKER). v3b ships the missing meta-test.
- **Verification:** Shellspec spec at `spec/verify-slice/lcov-parser_spec.sh` exercising parser with synthetic `lcov.info` fixtures: (a) all-files-100% → reports 100% · (b) one file <80% → exit non-zero with file:percentage cited · (c) malformed lcov → fail-loud with parse-error message · (d) empty lcov → no-coverage-data warning, exit 0 (dormant gate per F6e). Fixture lives at `spec/fixtures/lcov-{ok,under,malformed,empty}.info`. Existing 48-test shellspec suite grows to 52+; CI green.
- **Scope:** AC-13 covers parser tests only. Out: parser behaviour change (the parser is functionally working per session-40 evidence; tests document not modify).
- **Loveable:** valuable discipline — closes a "ships untested" gap that's been on the carry-over board.

#### AC-14 · `@vitest/coverage-v8` activation as first v3b commit
- **Outcome:** `@vitest/coverage-v8` is added as a dev-dep + `ci.yml` is wired to invoke `pnpm vitest --coverage`, **activating** v3a's AC-6 coverage gate (currently dormant-until-data-present). This is v3b's first commit so subsequent ACs benefit from active coverage signal.
- **Verification:** `package.json` devDependency `@vitest/coverage-v8` pinned to a specific minor (TBD by drafter at impl time). `vitest.config.ts` includes `coverage: { reporter: ['lcov'], reportsDirectory: './coverage' }` (or equivalent) producing `coverage/lcov.info`. `.github/workflows/ci.yml` test job runs `pnpm vitest --coverage` and uploads `coverage/` as artefact. Verify-slice.sh Gate 5 reads `coverage/lcov.info` and enforces ≥90% threshold per spec 72 F6 (matches v3a `acceptance.md` L178 — v3b inherits v3a's coverage floor; does not regress it). CI run on this commit shows non-zero coverage data (sanity floor).
- **Scope:** AC-14 covers dep install + config + CI wiring + verify-slice.sh Gate 5 sanity. Out: hitting the 90% floor (data-driven; reflects state of v3a tests + onwards).
- **Loveable:** valuable discipline — the dormant gate becomes live, every slice from this point gets coverage-checked.

### E. Process levers

#### AC-15 · Plan-review subagent default-spawn flip after measurement
- **Outcome:** v3a ships `EXIT_PLAN_REVIEW_SPAWN=1`-gated for cost/latency caution; v3b measures real `claude -p` cost + latency per `ExitPlanMode`, then flips default to spawn-by-default if metrics support it (with documented opt-out via env var).
- **Verification:** Measurement protocol authored: instrument `.claude/hooks/exit-plan-review.sh` to log spawn duration + token usage to `/tmp/claude-plan-review-metrics-$SESSION_ID.log` for N=10 plan invocations across 3 sessions (S-1, S-2, slice-completion). Aggregate analysis recorded in slice's `verification.md` AC-15 row: median latency · p95 latency · median tokens · p95 tokens. Decision criteria: if median <30s and p95 <60s and median tokens <5000, flip default to `EXIT_PLAN_REVIEW_SPAWN=1` (default-on); else maintain opt-in default with the metric data attached for future reconsideration. CLAUDE.md "Hard controls" stub updated with verdict. Test fixture: synthetic plan submission with measurement enabled produces correctly-formatted log line.
- **Scope:** AC-15 covers measurement protocol + decision criteria + actual flip-or-no-flip verdict at slice ship. Out: reducing the cost itself (different concern; out-of-scope optimisation).
- **Loveable:** valuable discipline — turns a deferred decision into a data-driven one; either way, the gate becomes well-grounded.


---

## Definition of Done

Inherit v3a's 12-item DoD verbatim (`docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md` L170-186) plus one v3b-specific addition (DoD-13 below = 13 items total).

> **DoD count history:** CLAUDE.md "Engineering conventions > Definition of Done" specifies a 6-item floor; v3a expanded it to 12 items at slice ship; v3b inherits the v3a expansion + adds DoD-13 = 13 items. The CLAUDE.md 6-item baseline is a *floor*, not a *ceiling*; slices may extend it.

**DoD-13 · Persona-prompt recursion lock** (v3b-introduced — no v3a precedent; reviewer-of-the-reviewer). Each `.claude/agents/*.md` persona file shipped by AC-1 / AC-2 / AC-3 must itself be reviewed by an independent fresh-context subagent before merge. The persona prompts that govern other subagents must themselves be vetted; otherwise prompt drift compounds across the suite.

Plus the 13-item security checklist per `spec 72 §11`, recorded in `security.md` per v3a's row-form convention.

---

## Blocks · Blocked by

- **Blocks:** `S-INFRA-rigour-v3c-quality-and-rewrite` (predecessor)
- **Blocked by:** `S-INFRA-rigour-v3a-foundation` merge to main (PR #24)

---

## Notes

- Each subagent gate must satisfy v3a's `verify-slice.sh` + every-commit TDD rule + coverage gate. v3a's safety net catches issues during v3b impl. The slice dogfoods its predecessor.
- Plan-time gate from v3a (AC-7) reviews this slice's full `acceptance.md` when drafted — independent fresh-context subagent must approve before any `src/` work on v3b. Per carry-over #10 drafting protocol, that review is `/security-review` + `/review` against this file at S-2.
- Recursion: per DoD-13, each persona's prompt-template is itself reviewed by an independent subagent before merge. The reviewer of the reviewer.

---

## Carry-over from v3b (to v3c)

Items deferred at v3b ship-time, captured here for v3c drafting (analogous to how v3a's carry-over seeded v3b):

*(Empty until v3b reaches ship state. Populated during v3b's verification.md fill-in if any AC defers concerns to v3c.)*

---

## Audit trail reference

Per session 41/42 audit (`audit-findings.md`), the following items are explicitly **dropped** from v3b scope (rationale per audit row):

- F6 ".sh ≥ 80% line via shellspec" (carry-over #6 from v3a — deferred to v3c per item self-text)
- AC doc reviewer policy (engineering-phase-candidates §G·6 — Phase C kickoff open question, not adversarial-subagent)
- Adjacent-slices definition for DoD regression check (engineering-phase-candidates §G·7 — open question, not subagent)
- Vitest version-quirk catalog entry (HANDOFF-32 candidate #9 — infra-docs)
- Lockfile policy clarification (HANDOFF-32 candidate #10 — settled)
- Compile-time-RED documentation pattern (HANDOFF-32 candidate #11 — doc convention)
- pnpm install session-start verify (HANDOFF-32 L52 — session-start orientation)
- verification.md "consumer-smoke" pattern (HANDOFF-32 L56 — template variant)
- Boolean-wrapper assertion idiom (HANDOFF-30 candidate #4 — test-craft helper)
- PWR drift check (HANDOFF-31 AUX-3 — UI/component-spec drift)

And **explicitly preserved as rejections** (per `engineering-phase-candidates.md` §F — DO NOT re-introduce):

- 4-phase-per-feature ritual · "4-Agent Architecture" labelling · mandatory `plan.md` at repo root · 60% context cap with mid-session clear-and-restart · backlog/project MCP tools · `/snapshot` as a distinct concept from `git`
