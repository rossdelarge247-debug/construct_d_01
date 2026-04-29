# Session 53 Wrap Context Block (heading into session 54)

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. Divorce process disrupter: £800–1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):** Shared, not adversarial · Evidenced, not asserted · End-to-end, not hand-off. **Tagline:** "Decouple — the complete picture."

Spec 42 authoritative for positioning. Spec 68 suite (hub + 68a-e locked + 68f/g opens) carries reconciled wire-level framing. Spec 70 Build Map is the Phase C input. Spec 71 (rebuild strategy, §7a Option 4) + spec 72 (engineering security) + spec 72a/b/c (preview-deploy rubric · adversarial review budget · multi-agent review framework) are the execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro. Single-branch-main workflow (spec 71 §7a Option 4): no `phase-c` integration, no cutover event. Slice work on short-lived feature branches → PR → main. Tink credentials in Vercel env. Stripe SDK pinned at `^22.1.0`.

## What sessions 41-53 accomplished (rolling window)

- **Sessions 41-46:** v3b S-1 through S-5 — 12/15 ACs landed via PRs #25-#27.
- **Session 47:** v3b S-6 (PR #30; 9-round live recursive auto-review; 14 findings; 15/15 ACs). Auto-review.yml + 3 personas live.
- **Session 48:** v3b S-7 (PR #32 §Architectural-smell-trigger) + v3b S-8 setup (PR #33; 6-AC acceptance.md drafted).
- **Session 49:** v3c rubric extension (criterion 2 §Exceptions a-d) + spec 72c §5/§7/§10 prior-art amendments + audit findings queued (5 enhancements + 3 simplifications + 4 citations).
- **Session 50:** 6 PRs merged (PR #36 §9 cross-ref, #37 §Exceptions a-d, #38 citations + 100%-rule rename, #39 slice-resolver fix, #40 §Exception (e), #41 Conv Comments verbatim).
- **Session 51:** Rigour-suite delivery 1/3 — PR #44 (§Examples migration), PR #45 (auto-review findings as PR comment), PR #46 (verdict-derivation extraction + 16-case shellspec), PR #47 (resolver+parser extraction + 21-case shellspec).
- **Session 52:** Rigour-suite delivery 2/3 — PR #50 (parse-failed/pipeline-crash → failure merge-gating) + PR #49 (criterion 2 §Exceptions extracted to YAML + scripted pre-filter; 6 rounds of auto-review iteration).
- **Session 53 (this wrap):** Rigour-suite delivery 3/3 — **PR #52** (`S-INFRA-rigour-v3c-prior-art-amendments-structural`, merged @ `495e473`) shipped the 3 P0b-structural simplifications from session-49 audit: (1) `.github/CODEOWNERS` replaces hooks-checksums + control-change-label workflow; (2) `pre-commit-verify.sh` deprecated (CI-only DoD enforcement); (3) arch-smell trigger rewritten from numeric round-count to qualitative judgement per Cunningham/Fowler. **9 commits + 4 auto-review rounds + 1 design discovery (solo-operator code-owner dynamic).** v3b S-8 (multi-agent persona suite v2) **deferred to session 54** for design conversation first (5 open Qs surfaced from spec 72c §4/§9/§10 + HANDOFF-48 multi-provider question; AC-6 retain-drop threshold idiosyncrasy flagged for defer).

## Current state

### Locked (through session 53)

- 5-phase journey, document-as-spine, 68a-e locks, spec 70 Build Map, spec 71 §7a Option 4 (single-branch-main), spec 72 13-item security checklist + CI gates.
- v3a-foundation SHIPPED (PR #24, session 41); v3b SHIPPED 15/15 (PRs #25-#27 + #30 + #32 + #33).
- v3c near-complete: rubric extension §Exceptions (a)-(e); 4 citations + 100%-rule rename; Conventional Comments schema cascade; comment-posting in auto-review.yml; verdict-derivation + resolver + parser all extracted to tested scripts; rigour-malfunction → failure merge-gating; **P0b-structural** (CODEOWNERS migration · pre-commit-verify drop · arch-smell qualitative reframe) shipped session 53 PR #52.
- **Live rigour gates after PR #52:** `tdd-guard.sh`, `pre-push-dod7.sh`, `tdd-first-every-commit.sh`, `exit-plan-review.sh`, `read-cap.sh`, `auto-review.yml` (parse-failed + pipeline-crash → failure; request-changes/nit-only → neutral), `pr-dod.yml`, `.github/CODEOWNERS` + branch-protection `require_code_owner_reviews=true`. **REMOVED PR #52:** `pre-commit-verify.sh`, `hooks-checksums.txt`, `scripts/hooks-checksums.sh`, `.github/workflows/control-change-label.yml`, session-start.sh §Hooks-checksums block.

### Built (on main as of `495e473`)

Canonical inventory in `CLAUDE.md` §"Key files". PR #52 net diff: **−440 / +50** (control-plane simplification). Session-53 NEW additions:

```
.github/CODEOWNERS                                                — sole control-plane gate (PR #52)
docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-structural/{acceptance,verification,security}.md — P0b-structural slice (PR #52)
docs/HANDOFF-SESSION-53.md                                        — session 53 retro
```

Session-53 NEW removals (deleted; use git history to recover if needed):

```
.claude/hooks-checksums.txt
.claude/hooks/pre-commit-verify.sh
scripts/hooks-checksums.sh
.github/workflows/control-change-label.yml
tests/shellspec/{hooks-checksums,pre-commit-verify}.spec.sh
```

**Parked branch:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead. Resumes post-S-8.

## Session 54 priorities

> **Numbering:** session 53 was rigour-suite session 3 of 3 — but ONLY P0b-structural shipped; v3b S-8 (multi-agent persona suite v2) was deferred to session 54 for design-conversation-first per session-53 discovery (5 open Qs + AC-6 idiosyncrasy). Session 54 = **S-8 design conversation + (likely) impl kickoff**. After S-8 lands, rigour suite is canonically complete and S-F1 (first `src/` slice) is the next priority.

### P0 — v3b S-8 design conversation + AC re-draft

Resolve the 5 open design questions (Q1-Q5) surfaced in session 53 BEFORE any code or AC freeze:
- **Q1 specialist count** — 5 vs 7 vs 4 (per spec 72c §4 L69 + §10 L173: published systems converge 4-5; we drafted 7; compression path documented but un-debated)
- **Q2 partition axis** — single (dimension) vs two (dimension × provider); HANDOFF-48 multi-provider question parked to v3c stub but affects AC-1 orchestrator JSON envelope shape
- **Q3 slice-reviewer.md v2 role** — keep as exhaustive single-agent fallback OR drop fallback entirely (rely on multi-agent + degraded mode)
- **Q4 shared-vs-duplicated persona content** — verdict vocab + JSON schema + Conv Comments lookup duplicated 7× vs include-by-reference vs template interpolation
- **Q5 dimension boundaries** — session-47 dataset only exercised 4 of 7 categories; pressure-test the 7-partition empirically before freezing

**AC-6 retain/drop threshold:** session-53 user decision = DEFER entirely; revisit after first 3 src/ slices give real data.

After Qs resolved → re-draft `docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md` → execute. Estimated ~700-900L; may absorb most of session 54.

### P1 — S-F1 kickoff (first src/ slice; design-system tokens)

**Unblocked once S-8 lands.** AC-4 retain/drop measurement activates after first 3 src/ slices ship; S-F1 starts the dataset. Per spec 70: design-system token extraction from `docs/design-source/` → `src/lib/design-system/{tokens,components}/` with CSS↔TS structural-parity invariant tests. ~400-600L; 5-8 ACs. Session 55 candidate if S-8 absorbs all of session 54.

### P2 — Comment-posting extraction (deferred per smell-trigger build-then-measure)

`scripts/auto-review-post-comment.sh` extraction if PR #45's comment-posting accrues findings rounds. PR #49 + #50 + #52 surfaced no clustered findings on the comment-posting block. Defer until cluster appears.

## Scope ceiling

Single-P0 session. **S-8 design conversation comes first this session — no AC freeze + no code until Q1-Q5 resolved on-record.** If session 54 hits the 1500-line warn mid-impl, stop and re-slice. Don't push past 2000.

## Negative constraints

Constraints 1-22 unchanged from session-52 SESSION-CONTEXT (positioning, branch model, V1 wipe, lockfile guards, MLP framing, AI-extracts-facts, Anthropic SDK shape, CLAUDE.md moratorium, dogfood discipline, etc.). Reference: `git show 4ad8f9f:docs/SESSION-CONTEXT.md` §"Negative constraints" L105-128.

**Session-53 additions:**

23. **Solo-operator code-owner dynamic.** CODEOWNERS gate self-deadlocks for solo: PR author cannot approve own PR (GitHub hard rule); branch-protection `require_code_owner_reviews=true` therefore requires conscious admin-bypass click ("Merge without waiting for required review") at every control-plane PR merge. The admin-click IS the rigour gate; preserves the legacy `control-change` label's "conscious act required" property; loses the "different reviewer" property (unrecoverable in solo until collaborators join). Auto-review.yml + slice-reviewer persona is the substantive review. **Future Claude sessions:** when opening control-plane PRs, expect the merge button to require admin-bypass; this is intentional, not a bug.
24. **AC-drafting style smell — use semantic checks, not literal greps.** PR #52 hit 4 rounds of doc-vs-impl drift findings, all same shape: AC verification steps drafted as literal `grep -c "X" → 0` checks; impl produced richer text containing those literals as historical/rationale references. Each round persona caught another instance. Future control-plane slices: draft AC verification as semantic checks ("the active rule no longer uses X as a trigger; rationale-mention OK") rather than literal-string greps. The arch-smell rule itself (rewritten in PR #52 AC-3) applies — but to AC-DRAFTING STYLE, not to slice code. Pattern smell ≠ code smell.

## Information tiers

- **Tier 1:** `CLAUDE.md` (positioning, conduct rules, Verdict vocabulary).
- **Tier 2:** this file at session start.
- **Tier 3:** spec 42, 44, 68 hub + 68a-e, 70 Build Map, 71, 72, 72a/b/c, 73, slice acceptance.md when building in that area.
- **Tier 4:** 68f/g, 67, 65, HANDOFF-SESSION-*.md, handoffs-archive, v2-backlog.

## Branch

### State at session-53 wrap (verified live)

- **Wrap branch:** `claude/wrap-session-53`.
- **`main` tip:** `495e473` (PR #52 squash-merge; admin-bypass click confirmed solo-operator gate works as designed).
- **Open PRs at wrap:** none. Wrap PR opens after this commit.
- **Closed/merged this session:** PR #51 (session-52 wrap, merged @ `4ad8f9f`); PR #52 (P0b-structural, merged @ `495e473`).
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead. Resumes post-S-8.

### v3c trajectory + remaining rigour work (LAYMAN-SUMMARY TABLE)

See §"Rigour-suite completeness" table at end of this file.

### Next session (54) FIRST ACTIONS

1. **Turn-0 verification.** SessionStart hook output. `git status` for clean tree. `mcp__github__list_pull_requests state=open` for open PRs (should be empty post-wrap merge).
2. **Confirm priority with user.** Recommended P0 = **S-8 design conversation (Q1-Q5 + AC-6 defer-confirmation)**. NOT direct impl — design conversation FIRST.
3. **Read S-8 design inputs:** `docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md` (155L; current draft) + `docs/workspace-spec/72c-multi-agent-review-framework.md` §4/§5/§7/§9/§10 (~85L) + `docs/HANDOFF-SESSION-48.md` L35 multi-provider question. Combined ~280L — within 300L turn-cap if no other reads.
4. **Solo-operator note.** Any control-plane PR opened in session 54 will require admin-bypass click at merge; this is by design.

## Key files

Canonical list lives in `CLAUDE.md` §"Key files". Session-53 NEW (PR #52):

```
.github/CODEOWNERS                                                — sole control-plane gate
docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-structural/{acceptance,verification,security}.md
docs/HANDOFF-SESSION-53.md                                        — session 53 retro
```

Session-53 REMOVED (deleted in PR #52):

```
.claude/hooks-checksums.txt
.claude/hooks/pre-commit-verify.sh
scripts/hooks-checksums.sh
.github/workflows/control-change-label.yml
tests/shellspec/{hooks-checksums,pre-commit-verify}.spec.sh
```

CLAUDE.md edits in PR #52: §"Hard controls" table (2 rows removed + CODEOWNERS row added + pre-commit row removed); §"Engineering conventions" §"Architectural-smell trigger" full rewrite (numeric → qualitative).

## Session 54 pre-flight

**Verify (do this first):**

```
git fetch origin
git status                                                          # confirm clean tree
git rev-parse --short HEAD origin/main                              # confirm 495e473
mcp__github__list_pull_requests state=open base=main perPage=10     # should be empty post-wrap merge
```

**Pre-flight Qs (ask user before any code):**

1. **Wrap PR (session 53) merged?** If still open, merge it first or work around.
2. **Priority for session 54?** Recommended P0 = S-8 **design conversation** (NOT direct impl). Alternatives: P1 S-F1 kickoff (if user wants to skip S-8 entirely or defer further) · P2 comment-posting extraction (if cluster appears).
3. **Multi-PR session?** Same rebase-on-main discipline as before.
4. **Solo-operator merge expectation:** any control-plane PR will require admin-bypass click at merge. Surface this expectation upfront so it doesn't surprise mid-PR.

**Session discipline (hook-surfaced; restated):**

- Honour Planning conduct from turn 1; SessionStart hook surfaces live branch state.
- Live gates (post-PR-#52): `tdd-guard` · `pre-push-dod7` · `tdd-first-every-commit` · `exit-plan-review` · `read-cap` · `auto-review.yml` (parse-failed/pipeline-crash → failure) · `pr-dod.yml` · `.github/CODEOWNERS` + branch-protection.
- **No more `pre-commit-verify.sh`** (deprecated PR #52 AC-2). DoD enforcement is CI-only via `pr-dod.yml`.
- **No more hooks-checksums** (deprecated PR #52 AC-1). CODEOWNERS is the sole control-plane gate.
- **Arch-smell trigger is qualitative** (rewritten PR #52 AC-3). No round-counting; reviewer's judgement is the gate.
- **Verdict vocabulary** (post-PR-#41): Conventional Comments labels + `(blocking)`.
- **AC-4 retain/drop** activates after first 3 src/ slices ship; S-F1 starts the dataset.
- **AC-drafting smell (NEW from session 53):** semantic verification checks > literal-grep checks. Avoid 4-round doc-drift iterations.

## Rigour-suite completeness (layman summary)

| Programme | Status | Sessions | Key artefacts on main |
|---|---|---|---|
| **v3a-foundation** | ✅ SHIPPED | 33-41 (PR #24) | `verify-slice.sh`, `tdd-first-every-commit`, plan-time gate |
| **v3b subagent suite (S-1 to S-7)** | ✅ SHIPPED | 41-48 | `auto-review.yml`, slice-reviewer + acceptance-gate + ux-polish-reviewer personas, arch-smell trigger, hooks-checksums (now superseded) |
| **v3b S-8 multi-agent persona suite v2** | 🟡 ACCEPTANCE DRAFTED, IMPL DEFERRED | 48 (acceptance) → 54 (design + impl) | PR #33 acceptance.md (6 ACs); 5 design Qs surfaced session 53 require resolution before impl |
| **v3c rubric extension §Exceptions (a)-(e)** | ✅ SHIPPED | 49-52 | `slice-reviewer.md` §Exceptions extracted to `criterion-2-exceptions.yaml` + scripted pre-filter |
| **v3c citations + 100%-rule rename** | ✅ SHIPPED | 50 (PR #38) | CLAUDE.md citations: Hillel Wayne TDD, Mikado, PMI WBS, Cline + Plan Mode |
| **v3c slice-resolver fix** | ✅ SHIPPED | 50 (PR #39) | `auto-review.yml` resolver |
| **v3c Conventional Comments schema** | ✅ SHIPPED | 50-51 (PR #41 + #44) | CLAUDE.md §Verdict vocabulary; persona files emit Conv Comments labels |
| **v3c auto-review findings as PR comment** | ✅ SHIPPED | 51 (PR #45) | `auto-review.yml` comment-posting steps |
| **v3c verdict-derivation script extract** | ✅ SHIPPED | 51 (PR #46) | `scripts/derive-verdict.sh` + 16-case shellspec |
| **v3c resolver + parser script extract** | ✅ SHIPPED | 51 (PR #47) | `scripts/auto-review-{slice-resolve,parse}.sh` + 21-case shellspec |
| **v3c criterion 2 §Exceptions extraction** | ✅ SHIPPED | 52 (PR #49) | YAML + scripted pre-filter |
| **v3c parse-failed + pipeline-crash → failure merge-gating** | ✅ SHIPPED | 52 (PR #50) | `auto-review.yml` rigour-malfunction gate |
| **v3c P0b-structural (CODEOWNERS · pre-commit-verify drop · arch-smell qualitative)** | ✅ SHIPPED | 53 (PR #52) | `.github/CODEOWNERS`, hooks deleted, CLAUDE.md rewrites |
| **v3c comment-posting extraction** | 🟡 DEFERRED (smell-trigger build-then-measure) | — | Defer until findings cluster on `auto-review-post-comment.sh` block |
| **v3c carry-overs (Stryker mutation · property-based fuzz · golden-PR replay · multi-provider 3rd reviewer · structured-findings JSON Schema)** | 🔵 OUT OF SCOPE | — | Per spec 72c §9; not blocking S-F1 or main programme |

**Net state at session-53 wrap:** rigour-suite programme is ~99% complete by surface area (only S-8 impl + comment-posting extraction outstanding from "in-scope" work). S-8 ships in session 54 (design first, then impl). After that, S-F1 (first src/ slice) becomes the canonical priority and the AC-4 retain/drop measurement clock starts.
