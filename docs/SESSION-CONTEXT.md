# Session 49 Wrap Context Block (heading into session 50)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 35-39 accomplished (rolling window)

- **Session 35:** PR #22 (S-INFRA-1 Stripe pin) merged + PR #21 (S-TOOL-1) merged + S-F7-β AC frozen + scaffold pushed.
- **Session 36:** S-F7-β implementation (8 commits on `claude/S-F7-beta-impl`; PR not opened — β cleanup parked pending v3a-foundation merge). Self-audit triggered the rigour-pivot programme.
- **Session 37:** v3a-foundation slice planning COMPLETE through 5 adversarial review iterations → v5 nit-only verdict → v5.1 polish.
- **Session 38 (multi-attempt; uncaptured handoff):** Session-38a crashed after `a898393` (S-37-0 shellspec install). Subsequent recovery sessions landed `S-37-1` (RED meta-tests) → `S-37-2` (verify-slice skeleton) → `S-37-3` (hooks-checksums baseline) → `S-37-4` + `S-37-4a` (ESLint function-size + scoped fix) → `S-37-5` (pre-commit verify hook) on `claude/S-INFRA-rigour-v3a-foundation` (G1 branch rename actioned). PR #24 opened as draft for CI visibility. No formal session-38 HANDOFF was generated.
- **Session 39:** Closed AC-7 (`S-37-6` exit-plan-review hook + nonce framing + `git-state-verifier.sh`), AC-2 part 2 (`S-37-7/7a` control-change-label workflow), AC-8 (`S-37-8` CLAUDE.md "Hard controls" stub). PR #24 GREEN at `8bf866f`. Session-37-budgeted v3a items all PASS.
- **Session 40:** Session-38 budget closed — S-38-2 RED (`31be543`) + S-38-1 GREEN (`e45152b`) for verify-slice.sh full-mode impl; S-38-4 (`95481e5`) for vitest coverage config + lcov parser (AC-6); S-38-3 RED (`9862158`) + GREEN (`2c676d0`) for `tdd-first-every-commit.sh` (AC-5). 8/8 ACs PASS in `verification.md`; PR #24 DoD-11-form refresh; DoD-3 procedural `request-changes` verdict (read-cap hit); DoD-7 temporal-gap surfaced as `PASS-with-DoD-7-gap` honestly. PR remained DRAFT pending merge-path decision.
- **Session 41:** PR #24 merged on `2026-04-27T19:23:07Z`. v3b S-1 (`25dc85f` + `6a488e8` + `d2da7e7`): one-time deliberate Tier-4 archive pass → `audit-findings.md` (130L; full inventory) → `acceptance.md` redrafted top-down to 15 ACs grouped A-E. Branch: `claude/audit-v3b-pr24-merge-YUwug`.
- **Session 42:** v3b S-2 (`b94cddf`). `/security-review` zero findings. `/review` 17 findings; 7 logic-severity. User accepted all 5 recommended defaults for load-bearing logic findings (R-4 timeout, R-5 regex, R-6 line-count source, R-7 N threshold, R-8 coverage threshold raised to ≥90% to match v3a). 11 in-scope findings addressed; 2 deferred; 4 approved unchanged. Verdict `request-changes` → `approve`. AC table frozen at b94cddf.
- **Session 43:** v3b S-3 (AC-14 `@vitest/coverage-v8` activation) — first impl commit of v3b. PR #25 opened + merged. AC-14 ships; 1/15 v3b ACs landed.
- **Session 44:** v3b S-4 (AC-12 `line-count.sh` re-baseline structural fix). PR #26 opened + merged with `control-change` label. AC-12 ships; 2/15 v3b ACs landed.
- **Session 45:** v3b S-5 ship (10 ACs in one PR — AC-4/5/6/7/8/9/10/11/13 + AC-14 attribution fix). Three lockstep commits: `b0148a0` + `6f30870` + `e866240`. Adversarial review per spec 72b Option B (3 sub-spawns); sub-spawn 1 emitted 12 findings (#1+#2 verified false positives); sub-spawns 2+3 read-cap-blocked. PR #27 opened as draft with `control-change` label required.
- **Session 47:** v3b S-6 — persona suite (AC-1 + AC-2 + AC-3 + auto-review.yml CI gate) ships **v3b 12/15 → 15/15**. PR #29 amends spec 72b with Option C (atomic-file inline content >300L) + spec-validation-by-impl-break check; merged as `b4e29ae`. PR #30 (S-6) opens with 2 commits (`1a70883` initial + `f476d41` 4-sub-spawn-review fix-up addressing 20 logic findings); user sets `ANTHROPIC_API_KEY` repo secret; live recursive auto-review on the slice's own ship-PR runs **9 rounds** with commits `d3dedb9` → `ac2b986` → `8bfdfb4` → `1ef38b3` → `586f167` → `715a03e` → `007130b` → `5295364` → `31ebc51`; converges twice (rounds 7 + 9) with one block at round 8 caught by the persona on a CLAUDE.md scope-creep + spec 72b regression risk that we'd just introduced — recursive self-application of the rigour gate, in real-time. Total findings actioned: 9 logic + 2 architectural + 2 style + 1 workflow integration = 14 items. Strategic conversation: spec'd `S-INFRA-persona-suite-v2-multi-agent` as v3b S-8 stretch (option B) per session-47 9-round dataset showing single-agent recursion is high-signal but inefficient. PR #30 ready for user merge at session wrap. Sibling PR `S-INFRA-arch-smell-trigger` (carry-over) ships the §Architectural-smell paragraph that round 8 correctly flagged as scope-creep.
- **Session 49 (this wrap):** v3c rubric extension shipped + spec 72c prior-art audit → 3 amendments + broader rigour-suite audit (queued, not actioned). Branch `claude/v3c-rubric-s8-impl-4kC9R`. **Commit 06dc404** (pre-conversation; P0 Option A from session-48): `slice-reviewer.md` criterion 2 §Exceptions extended with sub-clauses (a) incidental scaffolding (preserved), (b) deferred-slice scope-marker update, (c) spec-design content under `docs/workspace-spec/`/`docs/design-source/`, (d) revert commits within open PR. **Commit 79014a3** (this conversation): three 72c amendments from prior-art audit — §5 revisit trigger (>30% false-positive → severity-weighted per *Beyond Majority Voting* arXiv 2510.01499), §7 hybrid extension (synthetic + golden-PR replay v3c per promptfoo pattern), §10 (new) pattern lineage + 8-URL ranked reading list (Building Effective Agents · multi-agent research system · CodeRabbit incremental_reviews · etc.). **Broader audit unactioned:** rigour-suite agent reviewed 15 controls (A-O); strongest validations (F plan-mode = Cline + Claude Code; D snapshot-before-refactor = Mikado; J function-size = SonarQube/ESLint defaults); idiosyncrasies with no precedent (B arch-smell round-counting; M persona retain/drop; E AC arithmetic = PMI WBS 100% rule); top-5 enhancements + top-3 simplifications surfaced. Wrap triggered by user "are you cautious of our session context" recognition. No PR opened this session. 2 ahead of main, clean tree.
- **Session 48:** v3b S-7 sibling slice + v3b S-8 setup + v3c stub. **PR #32 (`S-INFRA-arch-smell-trigger`)** ships the §Architectural-smell-trigger paragraph to CLAUDE.md §Engineering conventions verbatim (recovered from `git show 31ebc51`); 3 files / +141; merged at `8160854` after fix-up commit `4688ffa` corrected verify-before-planning slip on persona-suite-liveness claims (kickoff said PR #30 had merged; live verification showed open + behind). **PR #30 merged during session** at `792b73e` via `mcp__github__update_pull_request_branch` after main advanced past base; v3b 12/15 → 15/15 ACs on main; auto-review.yml + 3 personas live. **PR #33 (`S-INFRA-persona-suite-v2-multi-agent` setup)** opens with `9ffd447`: spec 72c (157L; §1-§9 multi-agent review framework) + 6-AC acceptance.md (155L; verbatim 6-AC shape from SESSION-CONTEXT L82-89). v3c stub commit `54b7c66` added then reverted as `5f74340` after auto-review round 1 correctly flagged it as cross-slice scope-creep (real architectural finding; gate worked). **PR #34 (`v3c stub: multi-provider consensus framework`)** opens standalone off origin/main with `b8df8bb` (cherry-pick of `54b7c66` minus the spec 72c §9 cross-ref edit which is deferred to tiny follow-up PR after #33 + #34 merge). PR #33 round-2 + PR #34 round-1 both `block` (specifics not retrieved — pattern-guess: rubric over-strictness on doc-only/deferred-slice/spec-design diff profile). Architectural-smell-trigger applied recursively at round 3 → step back, record, wrap. PR #33 + PR #34 open at session wrap; v3c rubric extension surfaced as new v3c carry-over (3 categories: deferred-slice scope-marker · spec-design content · revert commits). Session-48 recursive-self-application dataset (3 rounds in 30min) joins session-47's 9-round single-agent dataset as v3c retain/drop measurement input.
- **Session 46:** v3b S-5 review-driven fixes — three rounds. **Round 2 (file-per-spawn re-spawn):** sub-spawn 1-redux on `pre-push-dod7.sh` succeeded (workaround for read-cap structural issue), surfaced 6 actionable findings (2 architectural + 4 logic). Fixed in `fedaeed`: repo regex truncated `org/repo.js` (broke gh API for any repo with `.`); gh API failure was blocking every push (GitHub-incident-equals-blocked-pushes); jq-missing silent pass; push-regex over/under-match for `--dry-run`/`-d`/`:branch`; commit-msg escape rendering; tdd-guard `kill -9` orphan node procs (`setsid` + `kill -- -PGID` group-kill). **Round 3 (CI exposed two latent pre-existing bugs):** ShellSpec `When call CMD <<<"$INPUT"` does NOT pipe stdin → all 21 pre-existing fixtures (7 tdd-guard + 14 pre-push-dod7) were giving false signals since `6f30870`; converted to `Data:expand` blocks. Gate 3b `while read` dropped final allowlist entry without trailing NL; fixed via `|| [ -n "$line" ]` idiom. **Round 4 (Vercel unblock):** pnpm-lock missing `@vitest/coverage-v8` specifier since `ead649f` (PR #25) — every PR's Vercel deployment failing; regenerated via `pnpm install --lockfile-only` in `5e184b4`. PR #27 marked ready-for-review at `5e184b4`; merged to `main` as `189996f`. **v3b 12/15** (all S-5 ACs landed).

## Current state

### Locked (through session 39)

- 5-phase journey (Start · Build · Reconcile · Settle · Finalise) per spec 42.
- Document-as-spine (4-doc lifecycle) per spec 44.
- Hub + 68a-e: navigation, trust, share, exit, AI coach (cross-cutting); Sarah's Picture mechanics (Build); joint doc + conflict card + queue (Reconcile); proposal + AI coach + counter (Settle); generation + pre-flight + fork + submit (Finalise).
- Spec 70 Build Map: 33-slice catalogue + S-TOOL-N tooling-slice family + S-INFRA-N infrastructure-slice family.
- Spec 71 §7a Option 4: single-branch-main; no integration branch; no cutover event.
- Spec 72: 13-item per-slice security checklist; CI gates.
- Hook + CI enforcement (session 27 + 39 additions): SessionStart · PostToolUse Write/Edit · PreToolUse Read · PreToolUse Bash (pre-commit-verify) · PreToolUse ExitPlanMode (exit-plan-review).
- Stripe SDK pinned `^22.1.0`. Both lockfiles aligned.
- **S-INFRA-rigour-v3a-foundation:** 8 ACs frozen + adversarial-review-approved (v5 nit-only). Bundle is multi-concern by-design with audit-trailed per-AC dependency table.
- **(session 39): v3a session-37-budget complete.** AC-1 skeleton + AC-2 (both parts) + AC-3 + AC-4 + AC-7 + AC-8 PASS per `verification.md`. Plan-time gate (AC-7) live with random-nonce framing. Control-change-label workflow live with step-level path detection (branch-protection-compatible).
- **NEW (session 40): v3a session-38-budget complete + slice content shipped.** AC-1 (full impl) + AC-5 + AC-6 added to PASS rows; AC-4 promoted from IN-PROGRESS to PASS (perf 0.024s incremental, well under G16 5s). `scripts/verify-slice.sh` is now the 7-gate workhorse (file-presence + §11 13-item checklist + leak-scan + ESLint denial check + tsc + vitest + per-language coverage), modes `incremental` (default; pre-commit) vs `--full` (CI). `.claude/hooks/tdd-first-every-commit.sh` is the AC-5 PreToolUse:Bash gate. `vitest.config.ts` carries `lines: 90` thresholds (gate dormant until `@vitest/coverage-v8` + `--coverage` wiring; v3b activates). 48/48 shellspec GREEN at `2c676d0`. AC-2 protected scope extended (`vitest.config.ts`, `docs/tdd-exemption-allowlist.txt`). DoD-3 verdict is procedural `request-changes` (reviewer hit read-cap); DoD-7 honest gap on S-38-2/S-38-1 timing. 8/8 ACs PASS; 8 v3b carry-over items recorded.

### Built (on main as of `5e09357`)

```
src/lib/auth/{dev-auth-gate,dev-session,index,types}.ts          — S-F7-α (PR #20, session 34)
src/lib/store/{dev-store,index,scenario-loader,types}.ts          — S-F7-α (PR #20, session 34)
src/lib/store/scenarios/{cold-sarah,sarah-mid-build}.json         — S-F7-α (PR #20, session 34)
src/lib/stripe/client.ts                                          — apiVersion aligned (S-INFRA-1, PR #22, session 35)
package.json + lockfiles                                          — stripe@22.1.0 pinned
.claude/hooks/{line-count,session-start}.sh                       — S-TOOL-1 (PR #21, session 35)
.claude/hooks/{pre-commit-verify,tdd-first-every-commit,exit-plan-review,read-cap,wrap-check}.sh  — v3a-foundation (PR #24, session 41)
.claude/hooks-checksums.txt + scripts/hooks-checksums.sh          — v3a-foundation integrity baseline (PR #24)
.github/workflows/{control-change-label,eslint-no-disable,pr-dod,shellspec}.yml  — v3a-foundation CI gates (PR #24)
scripts/{verify-slice,git-state-verifier,eslint-no-disable}.sh    — v3a-foundation control plane (PR #24)
docs/eslint-baseline-allowlist.txt + docs/tdd-exemption-allowlist.txt  — v3a-foundation allowlists (PR #24)
vitest.config.ts                                                  — coverage threshold + lcov reporter (v3a AC-6, PR #24)
tests/unit/hooks-{line-count,session-start}.test.ts               — S-TOOL-1 hook tests
tests/shellspec/                                                  — v3a meta-tests (PR #24)
docs/slices/{S-F1,S-B-1,S-B-2,S-C-U4,S-F7-alpha,S-INFRA-1,S-TOOL-1,S-F7-beta,S-INFRA-rigour-v3a-foundation}/  — slice docs
CLAUDE.md §{Planning conduct, Coding conduct, Engineering conventions, Hard controls (in development)}  — sessions 34, 37, 41
.claude/agents/{slice-reviewer,acceptance-gate,ux-polish-reviewer}.md  — v3b S-6 (PR #30, session 48 merge)
.github/workflows/auto-review.yml                                   — v3b S-6 (PR #30, session 48 merge)
CLAUDE.md §"Architectural-smell trigger" paragraph at L211             — v3b S-7 (PR #32 sibling slice, session 48)
docs/slices/S-INFRA-arch-smell-trigger/{acceptance,verification}.md — v3b S-7 (PR #32, session 48)
docs/workspace-spec/72c-multi-agent-review-framework.md             — v3b S-8 setup (PR #33, session 48 merge)
docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md      — v3b S-8 setup (PR #33, session 48 merge)
```

**On `claude/S-F7-beta-impl` (8 ahead, parked):** S-F7-β impl (session 36); PR not opened; cleanup parked pending v3b complete.

**Retired (post-merge, safe to delete on origin):** `claude/audit-v3b-pr24-merge-YUwug` (S-1/2/3 merged via PR #25), `claude/land-pr26-v3b-s5-5hFoW` (S-5 merged via PR #27 as `189996f`), `claude/security-review-v3b-Cb8KB` (4 abandoned cherry-picks from session 42), `claude/activate-vitest-coverage-v8-uIaBF` (harness orphan from session 43).

## Session 50 priorities

> **Numbering:** session 41-48 = v3b S-1 through S-8 setup. Session 49 = v3c rubric extension (criterion 2 §Exceptions a-d) shipped + spec 72c prior-art audit → §5/§7/§10 amendments shipped + broader rigour-suite audit findings queued (5 enhancements + 3 simplifications + 4 citations). Session 50 = PR-disposition for branch + audit-findings-to-v3c-slice conversion + (optional) v3b S-8 impl.

### P0a — Open PR for `claude/v3c-rubric-s8-impl-4kC9R` (2 commits)

Branch carries 06dc404 (rubric extension §Exceptions a-d) + 79014a3 (72c §5/§7/§10 amendments). Rubric extension touches `.claude/agents/slice-reviewer.md` → control-plane change → `control-change` label + DoD-13 fresh-context subagent review + hooks-checksums re-baseline required. 72c amendments are spec-content; ship clean. Auto-review.yml will fire on the rubric extension and exercise the new criterion 2 §Exceptions itself — natural validation of the extension. Expected: rubric extension may need control-change label workflow; spec amendments expected GREEN.

### P0b — Convert audit findings into v3c slice acceptance.md

Candidate slice name: `S-INFRA-rigour-v3c-prior-art-amendments`. Findings from session-49 broader rigour-suite audit (research subagent #2, 15 controls A-O):

**5 enhancement ACs:**
- (N) Adopt Conventional Comments verbatim (https://conventionalcomments.org/) — replace verdict vocabulary `approve/nit-only/request-changes/block × architectural/logic/style/none` with `praise/nitpick/suggestion/issue/question/thought × (blocking)`. Touches CLAUDE.md §"Verdict vocabulary" + 4 persona files + spec 72c §5.
- (I) Migrate ESLint baseline to native `--suppress-all` + `eslint-suppressions.json` (ESLint 9.x; shipped 2025). Replaces `scripts/eslint-no-disable.sh` + `docs/eslint-baseline-allowlist.txt`. Mechanical migration.
- (O) Add jest-axe + axe-playwright + Storybook test-runner to spec 72a 6-dim rubric. Currently checklist-only; Lighthouse + axe automate ~33-40% of WCAG.
- (E) Rename "AC arithmetic check" → "100% rule" + cite PMI WBS literature (https://www.workbreakdownstructure.com/100-percent-rule-work-breakdown-structure).
- (D) Cite Mikado method explicitly in CLAUDE.md §"Snapshot before refactor" (https://understandlegacycode.com/blog/a-process-to-do-safe-changes-in-a-complex-codebase/).

**3 simplification ACs (structural — needs careful design):**
- (H+G) Replace `hooks-checksums.txt` + session-start warn + `control-change-label.yml` with single CODEOWNERS file requiring `@admin` review on `.claude/hooks/**` + `scripts/**`. Three controls collapse to one. Audit verdict: we're re-implementing CODEOWNERS. Needs explicit rollback procedure.
- (G) Pre-commit-verify deprecation question — pre-commit is universally for fast checks (format, lint-staged); CI required-checks (`pr-dod.yml`) is the industry pattern for completeness. Decide: keep both layers (defensible: fail-fast local), CI-only (audit recommendation), or hybrid.
- (B) Reframe arch-smell trigger as prompt rule, not gate — round-counting incentivises gaming. Cunningham/Fowler treat as judgement, not metric. Touches CLAUDE.md §Engineering conventions §Architectural-smell-trigger.

**4 citation ACs (cheap; ~5L each):**
- (A) TDD bail-out — cite Hillel Wayne weak-TDD post (https://buttondown.com/hillelwayne/archive/i-have-complicated-feelings-about-tdd-8403/).
- (F) Plan-time review — cite Cline Plan/Act + Armin Ronacher Plan Mode (https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/).
- (E) AC arithmetic — cite PMI WBS 100% rule.
- (D) Snapshot-before-refactor — cite Mikado.

Decision at session-50 turn 0: ship P0a alone, P0a + P0b in parallel (separate branches), or P0b first (drives audit-findings into ACs before they decay).

### P1 — v3b S-8 impl (deferred from sessions 48 + 49)

`S-INFRA-persona-suite-v2-multi-agent`. 6 ACs + ~700-900L diff per acceptance.md §Pre-flight notes. Now has spec 72c §5/§7/§10 amendment context to inform impl — particularly §7 hybrid fixture seeding (synthetic ships now; golden-PR replay is v3c). Recommended sequence: P0b first (audit-driven amendments compound on impl); then P1 with the prior-art-amendments ACs informing implementation choices.

### P2 — Tiny spec 72c §9 cross-ref follow-up PR (carried from session 48)

~3L change rewriting §9 last bullet from "tie-breaker" to cross-ref the v3c slice §"Multi-provider consensus framework (candidate)" section. Standalone PR; expected GREEN. Ship together with P0a or independently.

### P3 — Carry-over surface housekeeping (sessions 46-48 + new session-49 entries)

Carried forward from session 48:
- Turn-0 PR-merge verification step (`mcp__github__list_pull_requests state=closed perPage=5`).
- Check-run output body retrievability (mcp `get_check_runs` returns `conclusion` only).
- Spec 72c S-8 contract status open question (re-evaluate with fresh framing).
- Architectural-smell-trigger threshold tuning (round 3 vs round 2 for spec/doc PRs).
- Smell-trigger paragraph worked-example update (CLAUDE.md L211 — add session-48 3-round example).
- Spec 72b "Use when" criterion tightening — cumulative cross-reference accounting.
- pnpm-lock drift CI gate.
- Verdict-coercion fixture for personas.
- Scaffolding-exemption rule deterministic codification.
- AC-4 persona retain/drop activation (first 3 src/ slices onwards).
- HANDOFF-SLICE-WRAP.md for v3a-foundation (consolidating retro across sessions 37-43+46+47+48+49).
- Vercel `get_status` query path documented in CLAUDE.md or wrap-check.sh.
- Protected-path expansion (`.claude/agents/`, `scripts/hooks-checksums.sh`, `docs/tdd-exemption-allowlist.txt`).

NEW (session 49):
- 72c §5 revisit trigger calibration once first-3-slice false-positive data exists.
- 72c §7 golden-PR replay seed corpus (PR #30 9-round dataset + first 3 src/ slice PRs).
- Two-research-agent workflow gate question — should background-research-subagent → spec-amendment workflow have its own gate? First-time use; un-audited.

## Scope ceiling

Single-P0 session. v3a foundation is the unblocking slice. Don't add adjacent slice work; don't refactor; don't reskin. If session 40 hits the 1500-line warn mid-impl, **stop and re-slice** — ship what's complete + carry rest to session 41. Don't push past 2000.

## Negative constraints (preserve from session 36)

1. Do NOT frame Decouple as a "financial disclosure tool." Spec 42 complete-settlement-workspace framing is load-bearing.
2. Phase-C-freeze model RETIRED (session 24 Option 4). Single-branch-main; no integration branch; no cutover event.
3. Do NOT re-introduce any file from the wiped V1 tree (`src/components/workspace/*` etc.).
4. Do NOT re-open 68a-e locked decisions unless new evidence surfaces. Same for 68g C-U4/U5/U6 (locked session 28).
5. Do NOT read pre-pivot specs (03-06, 11, 12). Active framing: 42, 44, 65, 67, 68, 68a-g, 70, 71, 72, 73.
6. `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` mandatory in Production (spec 72 §2 + §7). CI gate enforces.
7. Read discipline enforced by `.claude/hooks/read-cap.sh`: full-file Reads of >400-line files blocked without offset+limit; per-turn total >300 blocked.
8. V1 legacy palette gone. Visual canonical = Claude AI Design tool outputs (session 22).
9. Safeguarding V1 = signposting + baseline (spec 67 Gap 11, spec 72 §9).
10. Identity verification waits until consent-order stage.
11. **MLP not MVP** — scope decisions per slice framed as "what the *loveable* version requires". Users in crisis.
12. AI extracts facts, app generates questions — never put reasoning in AI extraction schemas.
13. Anthropic SDK uses `output_config.format` (not `response_format`). All JSON schemas need `additionalProperties: false`. SDK timeout 90s; route maxDuration 300s.
14. CLAUDE.md moratorium: 6 candidates lifted total. 8 currently parked (AUX-3 · #3 · #7 · #9 · #10 · #11 · #13 · #14). Lift after 2 clean uses.
15. Don't treat failing tests as spec.
16. Don't trust kickoff-prompt factual claims without live verification. SessionStart hook surfaces live branch state; use it.
17. DoD CI gate enforces slice-verification on src/ PRs.
18. Spec 73 copy patterns are mandatory for user-facing strings.
19. Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
20. Dual-lockfile divergence guard (S-INFRA-1 session 35).
21. **NEW (session 37): Rigour > speed.** Adversarial subagent reviews used at relevant points. v3a-foundation slice exists specifically to fix TDD-skipped + monolithic-functions + DoD-drift discipline lapses surfaced in session 36 self-audit. Once v3a-foundation merges, every commit dogfoods the rigour controls. **No checkbox theatre** — every adversarial finding addressed or explicitly deferred with reasoning.
22. **NEW (session 37): Rigour-pivot programme has 3 sub-slices** (v3a-foundation NOW; v3b-subagent-suite NEXT; v3c-quality-and-rewrite LAST). v3b + v3c stubs in `docs/slices/S-INFRA-rigour-v3{b,c}-*/acceptance.md` with scope markers; full ACs drafted per slice when each begins.

## Information tiers

- **Tier 1 (always loaded):** `CLAUDE.md` — positioning, rules, Coding/Engineering/Planning conduct.
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read section, not full file, when building in that area):** spec 42 · spec 44 · spec 68 hub + 68a-e · spec 70 Build Map suite · spec 71 · spec 72 · spec 73 · `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md` (the slice plan) · `docs/engineering-phase-candidates.md`.
- **Tier 4 (reference only, don't read proactively):** 68f/g open registers · spec 67 · spec 65 · `docs/HANDOFF-SESSION-*.md` · `docs/handoffs-archive/` · `docs/v2/v2-backlog.md`.

## Branch

### Branch state at session-49 wrap (verified live)

- **Active session branch:** `claude/v3c-rubric-s8-impl-4kC9R` — 2 ahead of main, clean tree, pushed. Carries 06dc404 (rubric extension §Exceptions a-d) + 79014a3 (72c §5/§7/§10 amendments). **No PR opened this session.** Wrap commit (HANDOFF-49 + SESSION-CONTEXT refresh) ships on this same branch.
- **`main`** @ `248c121` at session-49 wrap (unchanged from session-48 PR-#33 merge tip if PR #34 + wrap-PR not merged — verify at session-50 turn 0 via `mcp__github__list_pull_requests state=closed perPage=10`).
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead · pushed. Resumes post-v3b/v3c complete.
- **Open from session 48 (status unverified at session-49 wrap):** `claude/v3c-multi-provider-consensus-stub-dcf7a` (PR #34; v3c stub) + `claude/session-48-wrap-6c109` (session-48 wrap PR). Verify merge state at session-50 turn 0.
- **v3b 15/15** ACs landed (PR #27 + PR #30); v3b S-7 sibling landed (PR #32); v3b S-8 setup landed (PR #33). v3b S-8 impl still deferred to session 50.

### Iteration trajectory of v3b-subagent-suite slice

- **S-1 to S-5** (sessions 41-46): see SESSION-46 wrap for detail; 12/15 ACs landed via PRs #25-#27 across 6 sessions.
- **S-6** (session 47, `1a70883..31ebc51` on PR #30; merged session 48 at `792b73e`): 3 personas + auto-review.yml + DoD-13 4-sub-spawn pre-CI review + **9-round live recursive auto-review** (14 actionable findings; converged at rounds 7 + 9 with one block at round 8 self-applied to scope-creep finding). v3b 12/15 → 15/15. Auto-review.yml + 3 personas live on main since `792b73e` (session 48).
- **S-7 sibling** (session 48, PR #32 merged at `8160854`): §Architectural-smell-trigger paragraph to CLAUDE.md §Engineering conventions verbatim. Caught real scope-creep on PR #33 round 1 + flagged rubric over-strictness on rounds 2-3 (PR #33 round 2 + PR #34 round 1) — first live persona invocations on non-S-6 PRs.
- **S-8 setup** (session 48, PR #33 merged at `5e09357`): spec 72c (157L; §1-§9 multi-agent review framework) + 6-AC acceptance.md (155L). Contract frozen; impl deferred to session 49.

### Next session (50) FIRST ACTIONS

1. **Turn-0 PR-merge verification.** `mcp__github__list_pull_requests state=closed perPage=10` to confirm PR #34 + session-48-wrap-PR merge state (still pending verification at session-49 wrap). `git rev-parse HEAD origin/main` alone is NOT sufficient (session-48 lesson; v3c carry-over).
2. **Verify branch state + working tree clean.** Active branch is `claude/v3c-rubric-s8-impl-4kC9R` carrying 06dc404 + 79014a3 + session-49 wrap commit. If BEHIND > 0, resync per CLAUDE.md startup rule.
3. **P0a — Open PR for `claude/v3c-rubric-s8-impl-4kC9R`.** 06dc404 is control-plane → `control-change` label + DoD-13 review + hooks-checksums re-baseline. 79014a3 is spec-content. Auto-review.yml will exercise the new criterion 2 §Exceptions on the rubric extension itself — natural validation.
4. **P0b — Convert audit findings into v3c slice acceptance.md.** Candidate `S-INFRA-rigour-v3c-prior-art-amendments`: 5 enhancement ACs + 3 simplification ACs + 4 citation ACs (full inventory in Session 50 priorities §P0b above). Each AC carries spec-ref + prior-art URL.
5. **Decision at turn 0:** P0a alone, P0a + P0b in parallel (separate branches), or P0b first.
6. **P1 — v3b S-8 impl** (`S-INFRA-persona-suite-v2-multi-agent`) deferred from sessions 48 + 49. Now has spec 72c §5/§7/§10 amendment context.
7. **AC-12 line-count.sh** rebaseline-on-resync LIVE; **AC-1 auto-review.yml** LIVE (informational-at-v3b-ship); **AC-2 acceptance-gate** + **AC-3 ux-polish-reviewer** shipped + dormant until S-F1.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-41/42/43/44/45/46 additions for v3b:

```
docs/HANDOFF-SESSION-41.md                                          — session 41 retro (v3b S-1)
docs/HANDOFF-SESSION-42.md                                          — session 42 retro (v3b S-2)
docs/HANDOFF-SESSION-43.md                                          — session 43 retro (v3b S-3 AC-14)
docs/HANDOFF-SESSION-46.md                                          — session 46 retro (v3b S-5 review-fixes; NEW)
docs/slices/S-INFRA-rigour-v3b-subagent-suite/
  ├─ acceptance.md                                                  — 15 ACs frozen session-42 + amendments per AC-11 + AC-14 attribution
  ├─ audit-findings.md                                              — full audit trail; §5 = 15-AC inventory
  ├─ security.md                                                    — spec-72 §11 checklist; /security-review zero findings
  ├─ review-findings.md                                             — 17 /review findings; resolution log
  └─ verification.md                                                — 15-AC table; 12/15 PASS rows + S-5 round-2/3/4 retro
.claude/hooks/{tdd-guard,pre-push-dod7}.sh                          — v3b AC-6 + AC-7 (NEW session 45/46)
docs/workspace-spec/72a-preview-deploy-rubric.md                    — v3b AC-9 (NEW session 45)
docs/workspace-spec/72b-adversarial-review-budget.md                — v3b AC-10 (NEW session 45; v3c carry-over: Option C inline-files + spec-validation-by-impl-break)
tests/shellspec/{tdd-guard,pre-push-dod7,tdd-exemption-gate,lcov-parser}.spec.sh — v3b AC-6/7/8/13 meta-tests (88 examples / 0 failures)
```

**For session 48 (sibling slice + S-8 stretch), primary reference paths:**

```
docs/HANDOFF-SESSION-47.md                                        — session 47 retro; Stage-4 row-8 has the §Architectural-smell verbatim text
docs/slices/S-INFRA-rigour-v3b-subagent-suite/verification.md     — 9-round live recursive auto-review record (AC-1 evidence) + §v3c carry-over with v2 multi-agent shape
docs/workspace-spec/72b-adversarial-review-budget.md              — Option C + impl-break (locked at S-6); Use-when criterion tightening = v3c
docs/workspace-spec/72c-multi-agent-review-framework.md           — TBD draft for v3b S-8 stretch
.claude/agents/{slice-reviewer,acceptance-gate,ux-polish-reviewer}.md  — current personas (single-agent recursive baseline)
.github/workflows/auto-review.yml                                 — current single-agent workflow; v2 will fan out to N specialists
CLAUDE.md §"Engineering conventions"                              — sibling-slice target for §Architectural-smell paragraph (verbatim from HANDOFF-47 row-8)
```

## Session 50 pre-flight

**Verify (do this first, before any plan):**

```
git fetch origin
git status                                                                  # confirm clean tree
git rev-parse --short HEAD origin/main                                      # current main tip
mcp__github__list_pull_requests state=closed base=main perPage=10           # confirm session-48 PR #34 + wrap-PR merge state
mcp__github__list_pull_requests state=open  base=main perPage=10            # check what's currently open
```

**Pre-flight Qs (ask user before any code):**

1. **PR #34 + session-48-wrap-PR merge state.** Both opened session 48; status unverified at session-49 wrap. If still open, decide: merge-override, address-rubric-mismatch via session-49 rubric extension (now on `claude/v3c-rubric-s8-impl-4kC9R`), or close-as-superseded.
2. **P0a vs P0b sequencing.** Recommended P0a + P0b in parallel (separate branches; non-conflicting surfaces); or P0b first if you want audit-findings ACs to inform any inline edits during P0a review iterations.
3. **Audit-findings slice naming + scope-cap.** `S-INFRA-rigour-v3c-prior-art-amendments` candidate name. 12 total ACs (5 enhancements + 3 simplifications + 4 citations). Big slice — consider splitting into two: P0b-easy (4 citations + 5 enhancements; mostly mechanical) + P0b-structural (3 simplifications; CODEOWNERS migration, pre-commit-verify deprecation, arch-smell reframe; needs design + rollback procedure).
4. **Spec 72c §5 revisit-trigger calibration owner.** Once first-3-slice false-positive data exists, who measures + decides on weighted-aggregation migration? Add to AC-4 retain/drop measurement workflow.
5. **Two-research-agent workflow gate question** (NEW session 49): should background-research-subagent → spec-amendment workflow have its own gate? First-time use this session; un-audited. Carry-over candidate.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1. SessionStart hook surfaces live branch state — use it; distrust kickoff memory.
- **AC-12 is LIVE** — `line-count.sh` rebaseline-on-resync automatic.
- **AC-7 pre-push gate is LIVE** — H6 RED→GREEN structurally enforced.
- **AC-6 tdd-guard is LIVE** — Write/Edit on `src/**.{ts,tsx}` requires green vitest run.
- **Gate 3b is LIVE** — `tdd-exemption-allowlist.txt` entries must carry `category:glob` tag.
- **AC-1 auto-review.yml is LIVE** (post-PR-#30 merge) — every PR triggers `claude -p` slice-reviewer; verdict posts as check-run; informational-at-v3b-ship per AC-1 §Out of scope (NOT auto-blocking; adjust branch-protection accordingly).
- **AC-2 acceptance-gate is shipped** but invocation wiring deferred to S-F1 per AC-2 §Scope.
- **AC-3 ux-polish-reviewer is shipped** but dormant (no UI surface in v3b/S-8 infra slices); active from S-F1.
- Long-prose Writes: skeleton + Edit-append for any prose Write >~100 lines.
- **Dogfood discipline (live):** every commit passes `pre-commit-verify.sh` + `tdd-first-every-commit.sh` + (src/) `tdd-guard.sh` + (push) `pre-push-dod7.sh`. Plan-time gate fires on ExitPlanMode.
- **`control-change` label workflow live:** any PR touching L199-protected paths fails until label applied.
- **Vercel deployment status invisible to `get_check_runs`** — query `pull_request_read get_status` for Vercel.
- **Architectural-smell awareness** (session-47 lesson; codified post-sibling-PR-merge in CLAUDE.md): if adversarial review surfaces ≥3 rounds of findings clustered in one file, declare a smell + step-back review the abstraction before patching round 4. Worked example: session-47 S-6's auto-review.yml took 6 rounds of patches that a round-3 step-back would have pre-caught by extracting parsing to a tested unit.
- **Spec-validation-by-impl-break** (locked in spec 72b): for meta-test slices, deliberately break impl + verify pass-path tests turn red. Catches spec-runner-vs-impl asymmetries.
- **Single-agent recursive review baseline** (session-47 9-round dataset): 14 findings / 9 rounds. v3b S-8 multi-agent v2 should beat this on rounds-to-converge AND total tokens — measurement is AC-4 retain/drop signal.
