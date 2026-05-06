# HANDOFF-SESSION-70 — Session 70 retro

## What shipped this session

| PR | SHA | Description | Rounds |
|----|-----|-------------|--------|
| #111 | `cfe11e9` | P0 + P1 combined: spec 74 AI plan generation (305L final after round-2 substantive-intent amendment) + spec 65a sign-up + orientation reconciliation (90L). Both doc-only logic specs filling the explicit "needs spec" gaps from session-69 design-input audit. | 2 (clean approve both rounds; round 2 added §"Free-plan framing" + §"Output substance" + §"Bridge to post-signup" + flag split + canonical resource list + slice naming corrections) |
| #112 | `256014c` | P-ish: drop `reviewer-architecture` (4→3 specialists). Load-bearing changes (workflow + scripts + persona delete + 2 synthetic fixture deletes) + doc-drift cleanup (spec 72c §3-§9-§10 + CLAUDE.md Hard controls + slice acceptance §Status + synthetic README) + impl-side reviewer-correctness rubric absorption (criterion 7 hidden-effects + criterion 2 architectural-severity variant) + shellspec test alignment + style-finding fix. | 4 (1 correctness AC-gap caught by post-pivot suite + addressed in r3; 1 style provenance caught + addressed in r4; r4 clean approve 0 findings across all 3 specialists at all quorum thresholds) |

## KPI signals

- **n=2 PRs at 3-specialist k=2 review through session 70.** PR #111 ran on the 4-specialist suite (pre-drop); PR #112 ran on the 3-specialist suite from round 1 push (the workflow yml change is in the same PR — meta-bootstrapping the change-reviewing-itself path).
- **Mean rounds for PR #112: 4.** Higher than session-69's 1.0 mean per PR, but justified — the architecture-drop was a wider-blast-radius control-plane change than the kickoff XS sizing anticipated. Two rounds were substantive-finding-driven (correctness AC-gap + style provenance), validating the post-pivot suite still catches real drift.
- **Cumulative through session 70: n=36 PRs, mean ~1.7 rolling.** Slight uptick from session-69's ~1.6 attributed to PR #112's 4-round arc.
- The post-pivot 3-specialist suite **caught 2 substantive findings** in PR #112 — one from correctness (AC-gap on reviewer-correctness.md not actually carrying the spec-claimed absorption) + one from style (temporal provenance in a test comment I added). Both were issues the main conversation missed.

## Persona findings recorded (cumulative through session 70)

| Persona | Score | Verdict |
|---|---|---|
| `reviewer-correctness` | 12/10 (+1 session 70: PR #112 r2 `issue` on `ac-gap` — spec 72c §4 table claimed correctness absorbs criterion 7 hidden-effects, but `.claude/agents/reviewer-correctness.md` body wasn't updated; load-bearing AC-gap; addressed inline in r3) | **STRONG retain** (sustained; meta-bootstrap caught real drift introduced in the same PR) |
| `reviewer-style` | 14+/10 (+1 session 70: PR #112 r3 `issue` on `commenting` — test comment in `spawn-multi-reviewer.spec.sh` carried "session-70 drop" + "spec 72c §4 amendment" provenance that violates CLAUDE.md §"Comments: WHY not WHAT, no temporal provenance"; non-blocking but substantive; remediation gave the exact rewrite; addressed in r4) | **STRONG retain** (sustained; catch-rate well above the 0.33 retain bar) |
| `reviewer-security` | 5/10 (no new findings session 70) | **MODERATE retain** (cumulative below the watchlist threshold but above bare-minimum; AC-4 measurement formal track activates from S-F1 onwards) |
| `reviewer-architecture` | 2/14 = 0.143 final (+0 session 70 across PR #111 round-1 + #112 round-1 — the only PR rounds where it ran before retirement at #112's first push) | **DROPPED — verdict executed PR #112.** Persona file removed; auto-review.yml matrix reduced to `[security, correctness, style]`; spec 72c §3 + §4 + §5 + §7 + §8 + §9 + §10 + §Status updated; CLAUDE.md §"Hard controls" §"Auto-review on PR" + §"Subagent file locations" + §"Invocation conventions" updated; slice acceptance §Status amendment marker added; synthetic fixture + golden-replay seed retain architecture refs as historical record (the seed's `_notes` already documents drift-on-evolution per spec 72c §7). Drop verdict per CLAUDE.md §"Persona retain/drop metric" formal trigger met (cumulative well below 0.33 retain bar across the 14-PR cohort). |

## Lessons

### Lesson 1 — Spec amendments claiming impl facts MUST update impl files in the same PR

When PR #112 round 2 amended spec 72c §4 to claim *"reviewer-correctness... absorbs criteria 2 (logic-severity scope-creep + architectural-severity undeclared-scope variant), 3 (edge cases), 5 (regression), 6 (spec-citation discipline), 7 (hidden state + effects-behind-interfaces), 8 (AC-gap)"*, the persona file body at `.claude/agents/reviewer-correctness.md` was NOT updated to actually carry the criterion-7 + criterion-2-architectural sections. The post-pivot 3-specialist suite caught this in round 2 as an `ac-gap` issue (load-bearing per the AC-gap framing). Round 3 closed the loop by adding the missing sections + updating the Out-of-Scope list + the category enum.

**Pattern:** when a spec amendment makes a claim of the form "implementation X absorbs Y", the implementation file change MUST land in the same PR. The cost of a separate PR (the spec is then ahead-of-impl + reviewer-correctness flags an AC-gap) is higher than just doing both in one shot.

### Lesson 2 — Meta-bootstrap reviewing the change reviewing itself works

PR #112 dropped reviewer-architecture from the workflow's matrix. The PR's own auto-review fired with the NEW 3-specialist suite from round 1 push — meaning the change reviewed itself under the post-change configuration. This is a meta-bootstrap: the workflow yml that defines the matrix is part of the PR, so the PR's CI uses the new matrix immediately. The 3-specialist suite caught 2 substantive findings across the PR's life. **Architecture-of-the-architecture is sound** — the framework changes are reviewed by the framework as it will exist post-merge.

### Lesson 3 — Drop verdict execution validates the measurement framework

Per CLAUDE.md §"Persona retain/drop metric" verbatim: *"if the agent catches at least one issue the main conversation missed per 2-3 slices, retain. Otherwise drop — added friction without value."* Reviewer-architecture cumulative 2/14 = 0.143 across the 14-PR cohort, well below the 0.33 retain bar. **Dropping is a real outcome, not just an option.** The metric is meaningless if nothing ever gets dropped — this session validates by actually dropping. Future-session retain/drop verdicts on the remaining 3 personas (security at 5/10 watchlist; correctness + style firmly retained) gain credibility from this dogfooding.

### Lesson 4 — Control-plane changes have wider blast radius than initial estimate

The kickoff sized P-ish as XS. Actual surface was M (~250-350L) once `verify before planning` revealed all references:
- 1 persona file delete + 2 synthetic fixture deletes
- 2 workflow yamls (auto-review + persona-synthetic-fixtures matrix or path filters)
- 2 scripts (run-synthetic + run-replay)
- 2 orchestrator scripts (spawn-multi-reviewer + derive-verdict)
- spec 72c (~12 references across §3 + §4 + §5 + §7 + §8 + §9 + §10 + §Status)
- CLAUDE.md (~3 ref locations in Hard controls section)
- slice acceptance.md (1 §Status marker)
- synthetic README (file-layout block)
- reviewer-correctness.md (criterion-7 absorption + criterion-2 architectural variant + Out-of-Scope cleanup + category enum + label assignment table)
- shellspec test fixtures
- 1 reviewer-style finding fix

**Pattern:** control-plane changes (anything under `.claude/agents/`, `.github/workflows/`, `scripts/`, `CLAUDE.md` Hard controls, spec 72c) have a load-bearing impact across multiple files. Estimate at the catalogue level (grep for all references) before sizing.

### Lesson 5 — Two-commit structure for control-plane PRs (load-bearing first, doc-drift second)

PR #112 split into round 1 (load-bearing: workflow + scripts + deletes) + round 2 (doc-drift: spec + CLAUDE.md + slice + README). Round 1 puts the system in a coherent functional state; round 2 cleans the registry references. Splitting kept the commits reviewable individually and let the round-1 commit ship a working system even if round 2 had been deferred to a follow-up. **Useful pattern for any control-plane drop verdict.**

### Lesson 6 — Read-cap discipline forces honest pacing on long sessions

The read-cap.sh hook (300L combined per turn) blocked 3+ Reads several times during PR #112. Each block forced me to pause + commit + report progress to user before the next batch. This prevented the natural temptation to over-research. Combined with the line-count.sh hook surfacing cumulative session churn (459L at peak before wrap), I had ongoing visibility into pacing that prevented the session from sliding into the soft-note (1000) or warn (1500) thresholds.

## Branch state at session-70 wrap

- **Wrap branch:** `claude/resume-decouple-session-70-9QKfT` (sequential single-branch — 17 sessions in a row 54→…→70 on this pattern).
- **`main` tip:** `256014c` (post-PR-#112 merge — drop reviewer-architecture).
- **Open PRs at session-70 wrap:** wrap PR opens after this commit. None other open at wrap.
- **Closed/merged this session:** PR #111 (P0+P1) squash `cfe11e9`; PR #112 (P-ish) squash `256014c`.
- **Live rigour gates** updated this session: auto-review matrix reduced from 4 to 3 specialists `[security, correctness, style]`; reviewer-architecture persona file removed; spec 72c + CLAUDE.md §"Hard controls" reflect the new partition; reviewer-correctness rubric absorbed criterion 7 (hidden-effects) + criterion 2 architectural-severity variant.
- **Validator + filter scripts hardcoded list dead-code drift** (deferred): `scripts/validate-finding-envelope.sh` L29-32 + `scripts/auto-review-filter-prior.sh` L31 still hardcode the 4-specialist list. Permissive (still accept architecture); no test failure; not load-bearing. Recorded for follow-up. Two test files (`tests/shellspec/validate-finding-envelope.spec.sh`, `tests/shellspec/auto-review-filter-prior.spec.sh`, `tests/shellspec/derive-verdict.spec.sh` fixture data) similarly retain architecture refs as cosmetic doc drift.
- **Golden-replay seed (PR #30)** intentionally retains 4-specialist `reviewer-architecture` SHA entry per spec 72c §7 anti-flake clause: *"replay against the post session-70 3-specialist suite expects the architecture-dimension `seen_by[]` entries to register as drift but NOT verdict change (the session-70 drop was data-driven on cumulative low catch-rate)."*

## Next-session priorities (session 71)

Carry-overs from session 70 priority list:

- **P1 (was P2 in session-70 list)** — Respondent state machine spec — S (~100-150L). IS1-IS6 + IS-Plan + 14-day link-expiry rules per spec 67 §"Gap 7" (RESOLVED conceptually; detailed wireframes deferred). State transitions for Mark's invited-respondent journey. No canvas needed.
- **P2 (was P3)** — Thin V1 specs (settings / notifications / account profile) — XS-S each. Three short specs (~50-100L each) defining V1 minimum behaviour.
- **P3** (XS) — Validator + filter scripts hardcoded list cleanup. `scripts/validate-finding-envelope.sh` + `scripts/auto-review-filter-prior.sh` + 3 shellspec test files retain dead-code references to "reviewer-architecture" / "architecture" dimension. Permissive currently; tighten to enforce 3-specialist suite to prevent silent drift.
- **P4** — Mobile canvas integration (S-M1.0b) — gated on user-produced canvas at `docs/design-source/marketing-landing/{slug}/`.
- **P5** — Pre-signup interview canvases (S-O1 build) — gated on user-produced canvas at `docs/design-source/pre-signup-interview/{slug}/` + spec 74 (now LOCKED).

## What unblocked at session-70 ship

- **S-O1 logic** is now fully specced (spec 65 wireframes + spec 65a sign-up reconciliation + spec 74 AI plan generation). Buildable as soon as user-produced canvas at `docs/design-source/pre-signup-interview/{slug}/` lands.
- **3-specialist suite is the live + documented review framework**, eliminating the dead architecture specialist invocation cost on every PR going forward.
- **Reviewer-correctness rubric** now covers hidden-effects + architectural-severity scope, which was previously routed to the dead architecture specialist.
