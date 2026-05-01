# HANDOFF-SESSION-58

## What shipped

5 substantive PRs merged sequentially from `claude/decouple-session-58-ghiWv` + 1 wrap PR:

- **PR #67 (P2)** @ `2115229` — F5c doc cleanup. Marked F5c as shipped in `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md` §"Out of scope" + L199 Self-modification protection bullet. 1 round, clean approve. Closes session-57 P1 admin-bypass loose end.
- **PR #68 (P1)** @ `cc79da9` — npx version pin. Pinned `@anthropic-ai/claude-code` to `2.1.126` in `auto-review.yml` specialist matrix step + `scripts/preflight-review.sh`. OWASP A08:2021 supply-chain hardening. 1 round, clean approve. Self-validating — PR's own auto-review used the pinned version end-to-end.
- **PR #69 (P3)** @ `981fd6a` — per-specialist prior-findings filtering. NEW `scripts/auto-review-filter-prior.sh` (jq filter on `seen_by[]` containment) + brief-job wire + 4 reviewer persona doc updates + 11-case shellspec. 2 rounds — round 1 caught a real jq 1.6 portability bug + WHAT-narration in script header. Round 2 dogfooded the new filter on its own prior findings.
- **PR #70 (C)** @ `cded969` — CLAUDE.md §"Not yet in scope" cleanup. Removed 3 shipped items (AC-3 persona-side wiring · pre-flight self-review · F5c ratchet) + reworded synthetic-fixtures gating to quote spec 72c §7 verbatim. 1 round, clean approve.
- **PR #71 (D2)** @ `4b71b34` — finding-envelope JSON Schema. NEW `schemas/finding-envelope.schema.json` (JSON Schema 2020-12) + `scripts/validate-finding-envelope.sh` (jq validator) + 17-case shellspec. 2 rounds — round 1 caught WHAT-narration in headers AGAIN + 2 misleading test names. Closes the "Structured-findings JSON Schema validation" v3c carry-over.

**P0 (synthetic-deliberate-injection per-persona fixtures): DEFERRED at session start via plan-vs-spec cross-check.** Spec 72c §7 explicitly gates synthetic on "first-3-src-slice retain/drop confirming the 4-partition holds" — precondition unmet (zero src/ slices shipped). Same anti-pattern as session-57 P1 F5c scope. Caught pre-code; saved a second admin-bypass override against documented spec gating.

## Multi-agent KPI signal — n=5 calibration data points under k=2 default + differential mode

| PR | Rounds | Verdict | Findings caught |
|---|---|---|---|
| #67 P2 | 1 | clean | — |
| #68 P1 | 1 | clean | — |
| #69 P3 | 2 | request-changes round 1 | jq 1.6 portability (correctness) · WHAT-narration (style) |
| #70 C | 1 | clean | — |
| #71 D2 | 2 | request-changes round 1 | WHAT-narration ×2 (style) · misleading test names ×2 (correctness) |

**Mean: 1.4 rounds across 5 session-58 PRs.** Spec 72c §1 target: ≤2. Hit.

**Cumulative session-56 + 57 + 58 (k=2 default + differential mode):** 9 PRs total; mean ~1.3 rounds; flip-back-to-k=1 trigger far from firing per shadow `would_have_been_k1` data. Differential mode + per-specialist filter end-to-end self-validated for the first time on PR #69 round 2 (and repeated on PR #71 round 2).

## Lessons learned

### Lesson 1 — Plan-vs-spec cross-check saves admin-bypass overrides (P0 spec-gating discovery)

Kickoff/SESSION-CONTEXT framed P0 as "spec 72c §7 hybrid". Spec §7 verbatim (L141): *"Synthetic-injection (deferred, v3c): once first-3-src-slice retain/drop data confirms the 4-partition holds, add..."*

The "hybrid" framing collapsed the gating IF-clause ("once first-3-src-slice retain/drop") with the post-trigger conclusion ("Both then run"). Same pattern as session-57 lesson #1 (F5c scope kickoff paraphrase). Caught at turn-0 plan-vs-spec cross-check before any code; saved a second admin-bypass override against documented spec gating. Pivoted to P3 instead (which had no spec-gating issue).

**Mitigation codified at CLAUDE.md §Planning conduct (B addition this wrap PR):** before treating a kickoff or SESSION-CONTEXT priority labeled "per spec X §Y" as authorized, grep that section's gating IF-clauses verbatim. Quote the gating, not the post-trigger conclusion.

### Lesson 2 — Anti-pattern catalogue self-application difficulty (RECURRING from session 57)

Session-57 lesson #4 (PR #61): catalogue is harder to apply at AUTHOR time than at REVIEW time. Session 58 empirically validated this twice over:
- PR #69 round 1: style specialist caught WHAT-narration in `auto-review-filter-prior.sh` header.
- PR #71 round 1: style specialist caught WHAT-narration AGAIN in BOTH `validate-finding-envelope.sh` + `validate-finding-envelope.spec.sh` headers.

Same author, same blindspot, despite shipping the catalogue myself. Mental rehearsal of the catalogue before each persistent header didn't help; auto-review caught it post-push each time.

**Possible mitigation (next-session candidate):** during-work review subagent specifically for code-comment WHY-vs-WHAT at PostToolUse Write/Edit time, before commit. Listed as v3c carry-over in §Next-session below.

### Lesson 3 — Differential mode + per-specialist filter end-to-end self-validation

PR #69 round 2 was the first in-the-wild self-validation of the per-specialist prior-findings filter (which P3 itself shipped). Round 2 brief job:
- Style specialist: saw its 1 prior finding (header narration). Comment trimmed in fix-up → resolved → omitted by persona.
- Correctness specialist: saw its 1 prior finding (jq 1.6 edge case). Fix applied → resolved → omitted.
- Security/architecture: empty prior findings, only reviewed fix-up diff.

Round 2 = clean approve. End-to-end loop closed: differential mode (PR #63 session 57) + per-specialist filter (PR #69 session 58) + persona resolution-detection logic (existing, from session 55) all working together.

PR #71 round 2 dogfooded the same path again with 4 prior findings (2 style + 2 correctness). Same outcome — all 4 resolved → omitted → clean approve.

### Lesson 4 — Correctness specialist real-bug catch (jq 1.6 vs 1.7 portability)

PR #69 round 1: correctness specialist read the jq filter `(.seen_by // []) | any(. == $dim)` and identified that `// []` only fires on null/false, so a string `seen_by` would fall through and `any(.[] == $dim)` would runtime-error on jq 1.6 (Cannot iterate over string).

Local 11-test shellspec passed on jq 1.7+ via accidental string-iteration semantics — would have failed on ubuntu-latest CI (jq 1.6). The specialist caught the version-specific edge case from reading the jq expression alone, without running the test on jq 1.6 itself. Strong rigour-layer signal for the suite.

Fix: `((.seen_by | arrays) // [])` — uniform handling across jq 1.6 + 1.7 via `arrays` selector emitting an empty stream for non-arrays.

### Lesson 5 — Pre-flight gated on local API key availability

`/preflight` skipped on every session-58 push (no local `ANTHROPIC_API_KEY`). Auto-review at PR open caught everything that mattered. Pre-flight value-add for this environment is currently zero unless an API key is provisioned locally.

**Path forward (user call):**
- (a) Do nothing — keep relying on PR-time auto-review (current state; works fine).
- (b) Provision local API key — costs API budget per push, catches issues before PR open.
- (c) Hybrid — set the key only for higher-value PRs.

Default: (a) is fine; pre-flight infrastructure (PR #65 session 57) remains in place for any future shift.

### Lesson 6 — 5-PR sequential single-branch pattern at scale

Sessions 50 + 56 + 57 each shipped 3 PRs. Session 58 shipped 5 + the wrap PR. Sequential single-branch pattern (resync between PRs) scaled cleanly:
- Each merge auto-deletes the head branch on remote
- `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main` is the canonical resync recipe (no force-push needed)
- Untracked files (e.g. D2's new schema files, prepped pre-resync after the C commit was pushed) survive the checkout cleanly
- `--force-with-lease` not needed in this session — fresh push to recreated branch each time

No friction observed. The pattern is robust at 5-6 PRs per session.

## v3c carry-overs (still pending after session 58)

Per CLAUDE.md §"Not yet in scope" + spec 72c §9 + this session's discoveries:

| Piece | Size | Status | Why deferred |
|---|---|---|---|
| **Synthetic-deliberate-injection per-persona fixtures** | M ~200L | Spec 72c §7 gating | Precondition "first-3-src-slice retain/drop confirms the 4-partition holds" unmet; first src/ slice still deferred |
| **JSON Schema integration into auto-review-parse.sh** | S-M ~50-100L | D2 follow-up | This session shipped schema + standalone validator; wiring into parse pipeline is a separate AC with graceful-degradation choices |
| **During-work review subagents** (commit-msg / WHY-vs-WHAT / spec-quote / etc.) | M-L | CLAUDE.md §"Not yet in scope" | Possible mitigation for Lesson 2 (anti-pattern self-application) |
| **Live persona drift detection** (quarterly cron) | M | Spec 72c §9 | Recurring API budget |
| **Multi-provider 3rd-agent reviewer** (GPT/Gemini) | L | Spec 72c §"Out of scope" | Cross-provider diversity; future session |
| **Stryker mutation testing on persona prompts** | M-L | Spec 72c §9 | |
| **Pair-programming PostToolUse hook** | M | CLAUDE.md §"Not yet in scope" | |
| **Plan-review subagent default-spawn flip** | S-M | CLAUDE.md §"Not yet in scope" | Currently `EXIT_PLAN_REVIEW_SPAWN=1`-gated |
| **S-F1 first src/ slice** | L ~400-600L | Strategically deferred | Activates AC-4 retain/drop measurement clock; prerequisite for synthetic-fixtures gating |

## Persona findings recorded

Per-PR specialist findings count (security / architecture / correctness / style):

| PR | Round 1 | Round 2 | Main missed (Y/N) |
|---|---|---|---|
| #67 P2 | 0/0/0/0 | — | clean |
| #68 P1 | 0/0/0/0 | — | clean |
| #69 P3 | 0/0/1/1 | 0/0/0/0 (clean) | Y for both round-1 findings |
| #70 C | 0/0/0/0 | — | clean |
| #71 D2 | 0/0/2/2 | 0/0/0/0 (clean) | Y for all 4 round-1 findings |

**Specialist findings frequency (session 58):**
- security: 0 findings across 7 reviews
- architecture: 0 findings across 7 reviews
- correctness: 3 findings (1 real bug — jq portability; 2 suggestions — test naming + missing label)
- style: 3 findings (all WHAT-narration anti-pattern catches in script/spec headers)

**Retain/drop measurement clock:** still pre-S-F1; AC-4 retain/drop activation deferred until first 3 src/ slices ship. Current dataset is infra-PR (not src/) so doesn't count toward the 3-src-slice trigger.

## Branch state at session-58 wrap

- **Current branch:** `claude/decouple-session-58-ghiWv` (reused for wrap PR opening).
- **main tip:** `4b71b34` (PR #71 D2 merge). Prior: `cded969` (#70 C), `981fd6a` (#69 P3), `cc79da9` (#68 P1), `2115229` (#67 P2), `8e9d22b` (#66 session-57 wrap).
- **Open PRs:** wrap PR opens after this commit. No carry-over open PRs.
- **Closed/merged this session:** #67 + #68 + #69 + #70 + #71 (all merged). Wrap PR #72 expected.
- **Parked:** `claude/S-F7-beta-impl` @ `a3f67ec` · 8 ahead. Strategically deferred again; resumption is a session-59+ user call.

**Live rigour gates (post-session-58):**
- `auto-review.yml` — multi-agent 4-specialist matrix at k=2 default + differential mode + **per-specialist prior-findings filter (NEW post-P3 PR #69)**
- `eslint-no-disable.yml` — count-based ratchet (HEAD vs origin/main)
- `coverage-threshold.yml` — vitest threshold ratchet
- `pr-dod.yml` — slice-verification reference required on `src/` PRs
- `persona-fixtures.yml` — path-filtered golden-PR replay CI
- `.github/CODEOWNERS` — control-plane gate
- `pre-push` hook (opt-in) — local pre-flight 4-specialist review
- `shellspec.yml` — auto-discovers `tests/shellspec/*.spec.sh` (D2 added 17 new cases this session; P3 added 11)

**New artifacts on main post-session-58:**
- `scripts/auto-review-filter-prior.sh` — per-specialist prior-findings filter
- `tests/shellspec/auto-review-filter-prior.spec.sh` — 11 cases
- `schemas/finding-envelope.schema.json` — canonical JSON Schema for per-specialist envelope (NEW top-level `schemas/` directory)
- `scripts/validate-finding-envelope.sh` — jq validator
- `tests/shellspec/validate-finding-envelope.spec.sh` — 17 cases

## Next-session priority recommendations

Ranked from highest near-term value to lowest:

1. **S-F1 first src/ slice (UNBLOCKING).** Activates AC-4 retain/drop measurement clock + first ux-polish-reviewer exercise + collects n>=1 src/ calibration data point. Synthetic-fixtures gating (P0 of session 58) is downstream of this. ~400-600L · 5-8 ACs.

2. **JSON Schema integration into auto-review-parse.sh.** D2 follow-up; wires the schema validator into the parse pipeline so brief-job specialist invocations are gated on schema validity. Choices to make: parse-failed cascade vs warn + accept on schema mismatch. S-M ~50-100L · 1-2 rounds.

3. **During-work review subagent for WHY-vs-WHAT comment lint** at PostToolUse Write/Edit time. Empirical mitigation for Lesson 2 (recurring author-time anti-pattern blindness; PR #69 + PR #71 both surfaced WHAT-narration in script headers). M ~150L · 2-3 rounds.

4. **Plan-review subagent default-spawn flip.** Flip `EXIT_PLAN_REVIEW_SPAWN=1` gate to default-on. S-M · careful CODEOWNERS bypass + rationale needed.

5. **Synthetic-deliberate-injection per-persona fixtures.** STILL gated on first-3-src-slice retain/drop confirmation. S-F1 unblocks (eventually).

## Session 58 wrap-pattern observations

- **5-PR sequential single-branch worked cleanly.** No drift, no force-push, no resync friction. Pattern robust at 5+ PRs per session.
- **Plan-vs-spec cross-check at turn-0 caught the P0 spec-gating issue before any code.** Saved an admin-bypass override and resulted in pivoting from P0 to P3 (cleaner shipping path). Second consecutive session where this discipline saved a wrong override (session 57 F5c was the first; that one was caught at PR review post-push, not pre-code).
- **4 of 5 PRs touched CODEOWNERS-protected paths.** Admin-bypass merge for each — solo-operator pattern (#25) is now routine, not exceptional.
- **Pre-flight skipped silently on every push** (no local API key) — current pre-flight ROI for this environment is zero. Auto-review at PR open caught everything that mattered.
- **Two PRs (#69 P3 + #71 D2) had the SAME author-time anti-pattern blindspot caught at round 1** (WHAT-narration in script/spec headers). The repetition is itself the lesson — codifying the catalogue in CLAUDE.md doesn't fix author-time blindness; needs a different intervention (during-work subagent listed as next-session candidate).
