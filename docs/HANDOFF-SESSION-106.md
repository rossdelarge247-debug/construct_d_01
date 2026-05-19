# Session 106 retro — S-INFRA-rigour-hook-fixes-prototype-aware

## Pre-priority verifications cleared at turn 0

Per CLAUDE.md §"Planning conduct":

- Branch state verified by `.claude/hooks/session-start.sh`: landed on `claude/session-106-hook-fixes` cleanly from main `c0bea5a`.
- Spec-gate check for AC-1 (TDD-guard fix): re-read spec 76 §2 path-default-skip canonical pattern verbatim before AC freeze.
- Spec-gate check for AC-2 (§Status awk fix): re-read CLAUDE.md §"Hard controls" §"Comments: WHY not WHAT" §Status exemption rule verbatim.
- Shipped-artifact check: `ls docs/slices/ | grep hook-fixes` returned no prior slice — fresh scope.

## Slice deliverables

PR #207 squash-merged to main as `2a72185`. Combined P4 + P5 from session 105's priority list into one infrastructure slice; both fixes share the control-change-label gate and the same hook-script surface.

- `.claude/hooks/tdd-first-every-commit.sh` — prototype path-default skip via regex `^src/app/dev/proto/[^/[]+/.+\.(ts|tsx)$` (mirrors tdd-guard.sh L85 verbatim to prevent semantic drift).
- `.claude/hooks/comment-review.sh` — §Status awk regex changed from `/^## §?Status/` to `/^## (§)?Status/` (groups the multi-byte UTF-8 sequence so the `?` quantifier applies to the whole group rather than the trailing byte).
- `docs/workspace-spec/76-prototype-mode-rigour.md` §2 L41 + §6 L84 — implementation lists add `tdd-first-every-commit.sh` (constraint #38 sweep-discipline self-application).
- `CLAUDE.md` L281 — Sweep-discipline paragraph implementing-files list adds the hook.
- `tests/shellspec/tdd-first-every-commit.spec.sh` — +3 new It blocks (prototype-only stage, mixed stage, parametric route).
- `tests/shellspec/comment-review.spec.sh` — +2 new It blocks (no-§ form, fence-aware regression).
- `docs/slices/S-INFRA-rigour-hook-fixes-prototype-aware/{acceptance,verification,security}.md` — full slice docs.

## What went well

- **Combined P4 + P5 in one infrastructure slice** — both share control-change-label gate and hook-script surface area; bundling halved the wrap overhead.
- **Local shellspec install mirrored CI** — `curl ... shellspec/0.28.1/install.sh` exact version match meant local sanity = CI behaviour. The parametric stderr-warning failure was diagnosable in one round.
- **Auto-review verdict flipped approve in one fix-round** — 4 round-1 findings all tractable + small; addressed atomically in commit `5fce092`. Round 2 clean across all 3 specialists.
- **Spec-citation discipline observed** — verbatim quotes from spec 76 §2 + CLAUDE.md §"Hard controls" at AC scoping; no paraphrase drift.

## What could improve (3 new recurrence-watch entries)

- **Bracket-glob shellspec gotcha.** `The stderr should match pattern '*[slug]*'` interprets `[slug]` as a glob char class (matches 's'/'l'/'u'/'g' as single chars, not the literal string). Use `should include 'src/app/dev/proto/[slug]/page.tsx'` (literal substring match) when asserting on paths containing `[` or `]`. One-session-observed; promote if a second session repeats.
- **Indented-blockquote escape via doc-pointer.** `scripts/spec-citation-quote-check.sh` requires column-0 `^>` for the proximity-quote check. Indented blockquotes under list items (`  > ...`) fail. Fix per the script's own escape (line 118 suggestion): rephrase trigger as doc-pointer (e.g. "spec NN §X states:" not "per spec NN §X:") and keep verbatim italic quote inline. Caught at CI, not at the author-time hook. One-session-observed.
- **AC-vs-impl-path drift.** Naming a test file in AC §Evidence text *before* the file is actually written invites `ac-gap` auto-review findings if the actual file lands with a different name. Pattern: write AC evidence paths *after* the test file is created, or use generic phrasing ("the slice's shellspec extensions cover ...") until the file exists. One-session-observed.

## Persona findings recorded

| Persona | Findings this slice | Verdict | Notes |
|---|---|---|---|
| `reviewer-security` | 0 actionable | **Retain** | Cumulative 1 across 3 src/-slice sessions (104+105+106); coverage on infra slices light by design. |
| `reviewer-correctness` | 4 ac-gap findings, main missed all 4 | **Strong retain** | All 4 actionable: scenario 4 missing test, AC-1 path drift, In scope mis-reference, ac-gap re-naming. Best-performing persona this slice. |
| `reviewer-style` | 1 commenting finding, main missed it | **Retain** | WHAT-narration comment line — exactly the rule `comment-review.sh` enforces; ironically caught at PR time not at author-time hook (the file is `.sh` not `.md`; hook skip-list excludes `.claude/hooks/*.sh`). |
| `acceptance-gate` | n/a (informational at v3b ship) | **Retain** | Blocking enforcement v3c. |
| `ux-polish-reviewer` | n/a (no UI surface) | **Retain (dormant)** | Infrastructure slice. |
| `reviewer-prototype-readiness` | n/a (not a prototype slice) | **Retain (dormant)** | Infrastructure slice. |

Net: 4 active + 2 dormant. No drops session 106. `reviewer-correctness` upgraded from "retain provisionally" (session 105) → **strong retain** based on this slice's catch quality.

## Key decisions made

- **D-1: V1 honors path-default only.** Explicit `**Category:**` override (spec 76 §2 step 1) requires the hook to resolve the active slice from branch-name then read `acceptance.md`. Out of scope for V1; documented as known limitation. Refusal to over-engineer.
- **D-2: Awk regex grouping over rewrite.** `/^## (§)?Status/` minimally changes original `/^## §?Status/` — grouping the multi-byte char preserves documented semantics with a one-character delta.
- **D-3: Regex form re-used verbatim across both TDD-related hooks.** `^src/app/dev/proto/[^/[]+/.+\.(ts|tsx)$` shared verbatim with `tdd-guard.sh` L85 — prevents future spec-drift between two implementations of the same rule.
- **D-4 (impl-time refinement): AC-4 target re-scoped.** Original AC-4 named "CLAUDE.md §Hard controls gate-table TDD-first row parenthetical" — no such row exists in the gate-table. Re-scoped at impl-time to "Sweep-discipline paragraph implementing-files list" (matches actual structure). Documented in acceptance.md §Status.

## Bugs found + how fixed

- **CI-shellspec parametric test stderr-warning treated as suite-fail.** Initial fix used `should match pattern '*[slug]*'` — shellspec glob interpreted `[slug]` as char class. Fixed by switching to `should include 'src/app/dev/proto/[slug]/page.tsx'` literal substring match. → New recurrence-watch entry above.
- **CI-spec-citation-quote-check 3 hits in acceptance.md.** Indented blockquotes under list items don't satisfy the column-0 `^>` regex. Fixed via doc-pointer rephrasing per script's own escape hatch. → New recurrence-watch entry above.
- **Auto-review round-1 4 findings (all non-blocking).** Addressed atomically in one fix-commit; round-2 verdict: approve.

## Next session priorities

P4 + P5 closed. Remaining unblocked:

| # | Priority | Effort | Notes |
|---|---|---|---|
| 1 | **(Inherited from session 105)** Preview-deploy hands-on review of the quant screens | Light | DoD-12 + DoD-14 (4 rows of the 6-dim rubric) still pending in `docs/slices/S-PROTO-quantitative-screens/verification.md`. Mobile + keyboard-only + screen-reader spot-check on Vercel. |
| 2 | **(Inherited)** Desktop graceful enhancement — Help Rail integration + intermediate breakpoints | Heavy | Help Rail spec ref STILL pending (sessions 101→106 carry-over). Pre-condition: scope a design phase before AC freeze. |
| 3 | **(Inherited from session 105)** Quant-screens polish — focus-visible, roving tabindex, SkipScreenButton, useQuantitativeUpdate | Medium | Triggers naturally if a 4th quant screen ships; otherwise opportunistic. |

**Recommended:** P1 (preview-deploy hands-on review) — same recommendation as session 106 kickoff; still the lightest path forward.

## Session 106 metrics

- **Lines added (PR diff total):** ~95 across two commits (impl + fix-round).
- **Lines deleted:** ~50.
- **Tests added:** +5 shellspec It blocks (3 in tdd-first-every-commit.spec.sh; 2 in comment-review.spec.sh). 37/37 examples pass locally + at CI.
- **CI checks at merge:** 25 / 25 green.
- **Auto-review rounds:** 2 (round 1 request-changes with 4 non-blocking; round 2 approve).
- **AskUserQuestion rounds:** 0 (combined slice scope was unambiguous at kickoff).
- **PR shipped:** #207 (squash-merged as `2a72185`).
- **Context restarts during session:** 2 mid-impl — file-state re-read needed once each.

## Recurrence-watch (carried + new + resolved)

**RESOLVED session 106** (no longer on watch — both fixed by this slice's deliverables):

- ~~TDD-guard hook not category-aware~~ — fixed by AC-1.
- ~~§Status awk-strip works only with literal `## §Status`~~ — fixed by AC-2.

**New observations session 106 (one-session-observed; promote to numbered constraint if a second session repeats):**

- Bracket-glob shellspec gotcha (use `should include` over `should match pattern` for paths with `[`/`]`).
- Indented-blockquote escape via doc-pointer (column-0 `^>` requirement for `spec-citation-quote-check.sh`; rephrase as doc-pointer not "per spec NN").
- AC-vs-impl-path drift (write AC evidence paths after the test file is named, or use generic phrasing until it exists).

**Second-session-observed promotion eligible (carried from session 103, now repeated at session 106):**

- `spec-citation-quote` author-time stub vs CI gate strictness — DID recur this session (3 acceptance.md hits caught at CI not at author-time hook). Now **second-session-observed**; promote to numbered constraint if a third session demonstrates the same author-time-stub-misses pattern.

**Carried unchanged from session 105:**

- PR body edits don't re-run all CI workflows (one-session-observed; did not recur session 106 since no PR-body-only edits made).
- `spec-citation-quote` same-PR replacement edge case (from 104, no recurrence sessions 105 or 106).
- Sibling-spec-discrepancy batching at AC freeze (second-session-observed; sessions 104→105 demonstrated; **session 106 did not exercise the multi-screen AC freeze pattern, so neither promoted nor reset — carry to session 107**).
- Author-time comment-review stub doesn't catch AC refs in test `describe` strings (one-session-observed; did not surface session 106).
- All session-103 + 104 + 105 carries unchanged.
