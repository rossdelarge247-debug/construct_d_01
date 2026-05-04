# Session 63 — handoff retro

**Branch:** `claude/decouple-session-63-S5DU6`
**Started from:** `d25a9ae` (session-62 wrap)
**Wrap PR:** opens after this file commits
**`main` tip at wrap:** `3b17be8` (PR #85 admin-bypass squash-merge; +846 / -1 net)

## What shipped

**1 substantive PR merged** — single-PR session focused entirely on the spec 72c §7 deferred-to-v3c synthetic-deliberate-injection deliverable.

**PR #85 — `S-INFRA-synthetic-fixtures: deliberate-injection per-persona regression detection`** (admin-bypass squash-merge at `3b17be8`)

Surface (17 files · +846 / -1 net at first push):

- 4 unified-diff fixtures with planted defects targeting each persona dimension:
  - `tests/personas/synthetic/security.diff` — XSS via unsanitised `dangerouslySetInnerHTML` on server-fetched `comment.body`
  - `tests/personas/synthetic/architecture.diff` — UI button importing `pg.Pool` + executing `client.query` inline (mixed concerns; no test seam)
  - `tests/personas/synthetic/correctness.diff` — pagination loop `i < cursor + pageSize - 1` drops the last item of every page
  - `tests/personas/synthetic/style.diff` — JSDoc with PR/round/session/ticket/slice provenance (the rotting-lineage anti-pattern)
- 4 expected-finding signature contracts (`tests/personas/synthetic/expected/*.json`) — fuzzy-match predicates: label set, blocking set, category regex (matching actual persona enum values), evidence keyword any-of, remediation keyword any-of, min count
- `tests/personas/match-synthetic.sh` — pure jq predicate evaluator (testable in isolation)
- `tests/personas/run-synthetic.sh` — orchestrates 4 sequential `claude -p` invocations + envelope parsing + matcher delegation; skip-on-no-API-key
- `.github/workflows/persona-synthetic-fixtures.yml` — path-filtered CI gating on persona/orchestrator/synthetic-content changes
- `tests/shellspec/match-synthetic.spec.sh` (added round 2; extended round 3) — 9 cases covering 1 PASS + 6 per-predicate FAIL + 2 missing-input precondition exit-2
- `.claude/hooks/comment-review.sh` — skip-list extension for `tests/personas/synthetic/*` (fixtures BY DESIGN contain catalogue anti-pattern strings as planted defects)
- `CLAUDE.md` §"Not yet in scope" — synthetic-fixtures carry-over struck (now shipped)
- Slice docs at `docs/slices/S-INFRA-synthetic-fixtures/` (acceptance · security · verification)

**Live persona regression detection now operational.** The synthetic harness invokes each specialist via `claude -p` against its own deliberate-injection diff; asserts each persona flags the planted defect. 4/4 PASS at round 2 + round 3. CI workflow runs on every persona/orchestrator/synthetic-content change (path-filtered, ~30-60s per run, skip-on-no-API-key for forks).

## KPI signals

- **3 rounds on PR #85.** R1: block (6 valid findings, including 1 blocking REPO_ROOT path bug + 1 blocking security command-injection + 1 blocking ac-gap on missing ShellSpec). R2: request-changes (3 advisory non-blocking). R3: approve at all quorum levels (k=1 / k=2 / k=3 all approve).
- **Mean rounds slightly above ≤2-round target** (spec 72c §1) — but each round addressed real findings rather than churn; arch-smell-trigger qualitative judgement says "not gaming" since the iterations were principal-not-interest payments.
- **Cumulative auto-review at k=2 (sessions 56-63):** n=18 PRs, mean ~1.7 rounds (slight up-tick from session-62's ~1.6 driven by this session's outlier).
- **Spec 72c §7 first-3-src-slice gate SHIPPED.** Synthetic-deliberate-injection harness operational; closes the largest v3c carry-over.
- **Rigour pipeline structurally complete.** Remaining v3c carry-overs (queue-drain commit-msg / doc-honesty subagent · TDD-guard env hatch · AC-2 hooks-checksums decision · COMMENT_REVIEW_SPAWN trial · live persona drift detection cron · multi-provider 3rd-agent reviewer · Stryker mutation testing) are all queue-drain enhancements (XS-S sizing) — none structural.
- **Dogfooding self-validation:** PR #85 ran through the rigour pipeline that the slice itself extends. The persona-synthetic-fixtures workflow ran on its own slice's surface — caught the REPO_ROOT bug at round 1 (precondition fail), verified clean at round 2 + 3.

## Lessons

### Lesson 1 — Live-invocation surfaces author-time misses that smoke-test hides

The matcher was smoke-tested in `/tmp` with stub envelopes before the first push — three cases (PASS / FAIL-evidence / FAIL-empty) all produced the expected exit codes + diagnostics. That smoke test ran the matcher in isolation against handcrafted JSON; the runner was not exercised end-to-end (no `ANTHROPIC_API_KEY` locally). The first CI run failed in 5s because `REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"` from `tests/personas/` resolves to `tests/`, not the repo root. The matcher worked in isolation; the runner couldn't find its dependencies.

**Takeaway:** any new harness that orchestrates external dependencies needs an end-to-end smoke run, even if the inner units are pure-function-tested. A ShellSpec test for the runner's path-resolution logic (mock the `claude -p` invocation, assert PARSER + MATCHER paths resolve to existing files) would catch this class of error at author time. Not added in this slice; candidate for a future enhancement.

### Lesson 2 — Category-pattern enum cross-check is a pre-PR adversarial step

The first draft of the expected-signature `category_pattern` regexes used dimension-synonyms (e.g. `(?i)(xss|injection|input.?validation|...)` for security) rather than the persona's actual category enum values. A pre-commit adversarial pass via `grep '"category":' .claude/agents/reviewer-*.md` revealed the mismatch:

- `reviewer-security` emits `category: "security"` (single fixed value)
- `reviewer-architecture` emits `category: "hidden-effect" | "scope-creep"`
- `reviewer-correctness` emits `category: "scope-creep" | "edge-case" | "regression" | "spec-citation" | "ac-gap"`
- `reviewer-style` emits `category: "simplicity" | "naming" | "commenting"`

The security pattern was the broken case — `(?i)security` was needed; my draft had `(?i)(xss|injection|...)` which would never match. Caught + fixed before push. If shipped uncaught, the security persona would have flagged its planted defect correctly but the matcher would have rejected the finding on category mismatch — surfaced as round-1 "no finding matched expected signature" and required a second push.

**Takeaway:** when authoring fuzzy-match contracts against an enum-emitting LLM persona, grep the persona file's emit schema verbatim before authoring the matcher. Document this as a pre-PR adversarial step for future harness work.

### Lesson 3 — REPO_ROOT precondition failure was the actual cause of the round-1 synthetic workflow failure

The first CI run of `persona-synthetic-fixtures.yml` failed in 5s. Diagnosis chain: workflow ran the runner; runner's API-key check passed (key was configured); next step `[ -x "$PARSER" ] || exit 2` failed because `$PARSER` resolved to `tests/scripts/auto-review-parse.sh` instead of `scripts/auto-review-parse.sh`. The auto-review specialists' own findings (R1 F2 from reviewer-correctness) caught the bug independently, citing the same path resolution issue.

This validates the multi-agent suite's ability to catch integration bugs that author-time testing misses — the runner's path computation is local-syntactic-correct (`$SCRIPT_DIR/..` is what most repo-root callers do) but globally-wrong given the runner lives one level deeper than usual under `tests/personas/`.

**Takeaway:** path-construction in scripts that live under non-standard directory depths warrants explicit comment-at-author-time noting the depth — or better, derived programmatically (e.g. via `git rev-parse --show-toplevel`). Not refactored to git-rev-parse here since the static path is fine once correct; documented in `verification.md` for clarity.

### Lesson 4 — Synthetic harness is now operational and self-validates

After R2's REPO_ROOT fix, the workflow ran live: 4 sequential `claude -p` invocations against the 4 fixtures; each persona's envelope satisfied its expected signature; all 4 PASS in ~2m13s. The same outcome at R3.

What this proves end-to-end:
1. Briefing pipeline (persona body + nonce + fenced fixture) reaches `claude -p` correctly under non-standard input shape (no slice-AC, no coding-conduct fences)
2. `auto-review-parse.sh` extracts the envelope from the runner's raw output without modification
3. Each specialist's category enum + label vocabulary + finding-text language matches the matcher's predicates with non-zero margin
4. The harness gates the merge button on persona regression: any future persona-prompt edit that weakens its dimension's catch will surface as a CI failure

**Takeaway:** the v3c spec 72c §7 deferral was correctly justified — synthetic fixtures land *after* golden-replay establishes the partition holds, not before. The harness is now the per-persona regression gate; live persona drift detection (quarterly cron) remains as a complementary v3c carry-over for prompt-rot-over-time.

### Lesson 5 — User-facing cohesive-product trajectory came up explicitly at wrap

User asked at session-63 close: *"when will there be a discernible complete design coming together as we build out these slices?"* Honest answer required Vercel-state verification — the current `src/app/page.tsx` is a "Decouple — under active rebuild" placeholder + a demo grid of S-F3 + S-F4 primitives. No actual product flow.

Estimates surfaced (cadence assumption: ~1 substantive src/ slice per session, sessions 51-62 empirics):

- **First cohesive entry-point** (real landing → pre-signup interview start): ~3 sessions
- **A user-testable Build phase end-to-end:** ~6-8 sessions
- **All 5 phases minimally populated:** ~12-15 sessions
- **Production-grade end-to-end:** 20+ sessions

**Takeaway:** rigour-pivot is structurally complete; remaining v3c carry-overs are queue-drain (XS-S sizing). Pivoting session 64+ to user-facing src/ slices is appropriate. Session 64 P1 recommended = S-F2 document-shell (the connective tissue that makes phase routes navigable). User explicit pivot framing captured in SESSION-CONTEXT §"Session 64 priorities" + §"Cohesive-product trajectory".

## Persona findings recorded (CLAUDE.md retain/drop metric)

This is an INFRA slice (not src/), so it doesn't count toward AC-4 retain/drop measurement (already triggered at 3/3 prior). Reporting findings for completeness:

### PR #85 round 1 (block — 6 findings)

| Persona | Findings | Real catches main convo missed |
|---|---|---|
| `reviewer-correctness` | 3 (REPO_ROOT path bug `[issue/blocking/ac-gap]`; ShellSpec mandate not met `[issue/blocking/ac-gap]`; AC-4 YAML missing 2 paths `[suggestion/non-blocking/ac-gap]`) | Y · 3/3 (all real; REPO_ROOT was critical) |
| `reviewer-security` | 1 (CLI version interpolation command-injection `[issue/blocking/security]`) | Y · 1/1 (real; valid OWASP A03 catch) |
| `reviewer-style` | 2 (comment narrating WHAT in matcher `[issue/non-blocking/commenting]`; REPO_ROOT misnomer `[nitpick/non-blocking/naming]`) | Y · 1/2 (commenting catch real; naming is sibling of correctness's path-bug catch — partial duplication) |
| `reviewer-architecture` | 0 | N (zero findings; pattern continues from session-62) |

### PR #85 round 2 (request-changes — 3 advisory non-blocking)

| Persona | Findings | Real catches main convo missed |
|---|---|---|
| `reviewer-style` | 2 (fixture-narrating comment in shellspec setup `[issue/non-blocking/commenting]`; hardcoded count enumeration in header `[nitpick/non-blocking/simplicity]`) | Y · 2/2 (both real anti-pattern catches) |
| `reviewer-correctness` | 1 (header-claims-vs-test-coverage gap on blocking predicate `[suggestion/non-blocking/edge-case]`) | Y · 1/1 (real spec-vs-impl gap; led to adding 6th FAIL test case) |
| `reviewer-security` | 0 | — |
| `reviewer-architecture` | 0 | — |

### PR #85 round 3 (approve — 0 findings)

All quorum levels concur (k=1 / k=2 / k=3 all approve).

### Net retain/drop signal (cumulative through session 63)

- **reviewer-style: STRONG retain.** 4/4 src+infra slices catching anti-patterns missed by main convo (PR #74 + #80 + #83 + #85).
- **reviewer-correctness: STRONG retain.** 4/4 catching real logic + spec-vs-impl gaps (#74 + #80 + #83 + #85).
- **reviewer-security: MODERATE retain.** 2/4 with real blocking findings (#85 CLI injection + an earlier session); often praise/note tier.
- **reviewer-architecture: WEAK signal continues.** Still no real architectural finding caught that main convo missed. Per CLAUDE.md retention criteria ("at least one issue main convo missed per 2-3 slices"): pattern below the bar 4/4 slices in. **Recommendation:** session 64 + 65's slices (S-F2 + S-M1) are the formal trigger — if reviewer-architecture stays quiet on 2 more substantive slices, formal drop verdict is justified.

## Branch state at session-63 wrap

- **Wrap branch:** `claude/decouple-session-63-S5DU6` (sequential single-branch pattern continued; 10 sessions in a row)
- **`main` tip:** `3b17be8` (PR #85 admin-bypass squash-merge of S-INFRA-synthetic-fixtures)
- **Open PRs at wrap:** wrap PR (this branch) opens after this commit; no carry-over open PRs
- **Closed/merged this session:** PR #85 only (3 rounds; admin-bypass per Constraint #25)
- **Live rigour gates** — every commit dogfoods them. Multi-agent auto-review at k=2 default + differential mode + per-specialist filter + TDD-guard first-creation auto-resolve + parser schema validation + author-time comment review + plan-review default-spawn + **synthetic-deliberate-injection per-persona regression detection (NEW post-session-63)**.

## Next-session priority recommendations

User pivoted at session-63 close toward user-facing cohesion (Vercel preview shows only the design-system primitives demo grid). Rigour pipeline structurally complete; remaining v3c carry-overs are queue-drain (XS-S sizing).

| Priority | Slice / pick | Why | Sizing |
|---|---|---|---|
| 🥇 P1 | **S-F2 document-shell** (Phase C.1; spec 71 §3 L84) | Highest-leverage cohesive-product slice. Three-column dashboard scaffold = connective tissue that makes phase routes navigable. Without it, S-F3 phase-nav + S-F4 trust-chip + S-F5 coach-card etc. are stranded primitives. | M-L (~400-600L) |
| P2 | **S-M1 marketing rewrite** (spec 71 §3 L314 + spec 42 positioning) | Replaces `src/app/page.tsx` placeholder. Public landing = first user touch. P1 + P2 together = first cohesive Vercel preview. | M |
| P3 | **TDD-guard auto-allow extension** (`TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch + lint-fix-refactor case) | Formalises bash-heredoc escape used multiple times sessions 61-62. Wrap C-pick candidate. | S — ~10-15L |
| P4 | **Lockfile divergence fix** (eslint-plugin-react-hooks 7.0.1 vs 7.1.1) | Investigate why S-INFRA-1 dual-lockfile guard didn't catch; repair. | S-M; investigation-heavy |
| P5 | **AC-2 hooks-checksums + control-change-label decision** | User-decision: ship or strike. Aspirational across multiple sessions. | XS |
| P6 | **`COMMENT_REVIEW_SPAWN=1` opt-in trial** | Live-mode catch-rate measurement on 1-2 src/ slices. ROI: drops sextuple-confirmed ~3-per-PR commenting findings to ~0. | XS-S |
| P7 | **S-F7-γ untested-UI tests** | Component tests for env-banner + scenarios + reset + state-inspector + engine-workbench. Closes the cherry-pick rebase debt. | M-L |

**Cohesive-product trajectory** (per session-63 close discussion, session cadence ~1 substantive src/ slice):

- 3 sessions to first cohesive entry-point (P1 + P2 + first pre-signup screen)
- 6-8 sessions to user-testable Build phase end-to-end
- 12-15 sessions to all 5 phases minimally populated
- 20+ sessions to production-grade

**Persona retain/drop monitoring continues.** reviewer-architecture WEAK signal cumulative 0/4 src+infra slices catching real architectural finding main convo missed; session 64 + 65's slices (S-F2 + S-M1) are the formal trigger — 2 more without architecture catch → formal drop verdict justified.

