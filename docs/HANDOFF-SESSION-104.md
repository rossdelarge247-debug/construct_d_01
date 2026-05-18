# Handoff — Session 104

**Branch shipped:** `S-PROTO-O7-quantitative-hooks` impl + paired spec patch on `claude/session-104-O7-quantitative-hooks`, squash-merged to main as `464b943` via PR #202.
**Scope shipped:** Extends `build-plan.ts` with 3 numeric-derived adaptivity dimensions (D5 sharing-principle weighting · D6 consent-tier complexity · D7 timeline-pressure framing) composing alongside the existing 4 categorical hooks; logic-only, prototype category. Paired spec patch on spec 65b §AI-coach §Ex-partner row removed promise-without-delivery wording.

## What happened

Session 104 picked up P2 from session-103's "user picks scope" — recommended path, the lightest follow-on from session 103's spec-65b draft. P3 (UI for O6.5/O6.6/O6.7) deferred to session 105 by user call ("I don't think there are canvases for this; let's wrap and start fresh"). P1 (desktop graceful enhancement) stayed on board, untouched.

**Pre-priority verifications cleared at turn 0** per CLAUDE.md §"Planning conduct" §"Pre-priority shipped-artifact verification" + §"Pre-priority spec-gate verification": no existing `S-PROTO-O7-quantitative-hooks` directory; no commits referencing the slice name (beyond the session-103 spec drafting); §"What this does NOT cover" exclusions don't gate this slice; canvas-fidelity N/A.

**Two AskUserQuestion rounds, 2 decisions locked.** Spec 65b §"Plan-output usage" L261 listed D5 as "derived from `relationship_length` + ages" but the actual trigger rules only referenced `relationship_length`. Cap rule L279 didn't specify tie-break ordering when all 3 dimensions fire. Surfaced both before AC freeze:

| Question | Decision |
|---|---|
| D5 scope ambiguity | A: Literal triggers only — `relationship_length`. "+ ages" treated as draft artifact; `ex_age_relative` + `your_age` stay captured-but-unused. |
| Tie-break on >2 firings | A: First-firing in D5 → D6 → D7 spec order. Deterministic. |

**Slice scaffold + AC + impl + tests + verification + paired spec patch shipped across 4 commits on the session branch:**

| # | Commit | Description |
|---|---|---|
| 1 | `63858e8` | scaffold acceptance.md (9 ACs, 5 design decisions) |
| 2 | `dd0f4ac` | impl + tests + paired spec 65b patch |
| 3 | `1b9783e` | verification.md (DoD evidence) |
| 4 | `9ec06ff` | fix CI spec-citation gate + address auto-review findings |

**1 CI failure, diagnosed + fixed.** `spec-citation-quote-check` failed on `1b9783e` despite author-time stub passing per-file. Root cause: the merge-time CI gate ALSO fuzzy-matches the local blockquote text against the cited spec's current content. AC-9 blockquoted the OLD `ex_age_relative` row text being replaced — but the same PR's paired patch removed that text from spec 65b, so the fuzzy match failed. Fix in `9ec06ff`: reorder AC-9 to put the NEW (in-spec) text as the proximity blockquote; move OLD text to inline prose.

**1 auto-review round on PR #202 with 8 findings** (verdict: request-changes; advisory at v3b ship — 1 finding had `blocking: true` flag but below k=2 quorum so didn't gate merge). All 6 actionable findings addressed in `9ec06ff`. Auto-review on `9ec06ff` came back clean (approve verdict); all 25 CI checks green; merged via squash.

## What went well

- **AC sign-off before code.** User confirmed 9-AC scope + 2 named-uncertainty decisions before any impl turn. No silent decisions; no rework when reviewers flagged the AC text.
- **TDD via test-first within the same impl turn.** Test file written alongside impl in one batched edit; vitest ran immediately; all assertions passed first time. Pragmatic compromise on pure-TDD ordering ("test before impl" within the same turn) that preserves the TDD spirit (test file describes the contract; impl satisfies it).
- **Spec-citation-quote gate triaged at author-time AND merge-time.** Local author-time runs caught most issues before push. The merge-time-only stricter check (fuzzy-match against cited spec content) caught one edge case I'd missed — and the diagnosis was fast because the gate's deny message names both the local quote AND the cited spec it failed to find. Self-documenting gates pay off.
- **Auto-review fan-out caught 6 issues main missed.** Bundled all fixes in one commit; one CI re-run got everything green. The persona suite is doing its job.

## What could improve

- **Same-PR spec-replacement quoting is a real edge case.** Author-time stub didn't catch it; only the merge-time fuzzy-match did. Pattern: any slice with a paired spec patch that REMOVES text the AC quotes verbatim will fail this rule. Future slice authors should preview which spec text the AC blockquotes, and ensure that text survives the slice's own spec patches — OR put the NEW text as the proximity quote and demote OLD to prose.
- **D6 property_equity AC silently-decided despite Q1 precedent.** Spec 65b D6 header names `total_assets + pension_value + property_equity` but only the first two have trigger rules. I asked the user about D5's "+ ages" ambiguity (Q1) but silently dropped `property_equity` in AC-3 under the same precedent. Reviewer-prototype-readiness flagged this as a `suggestion`; the AC sign-off would have been cleaner if I'd batched D5 + D6 in the same question round. Lesson: when one spec discrepancy surfaces, scan for siblings before AC freeze, not after PR open.
- **AC-numbered test description leaked into the test file.** `describe('body copy (AC-7)', ...)` is the exact anti-pattern CLAUDE.md §"Comments: WHY not WHAT, no temporal provenance" calls out ("PR / session / slice provenance in persistent comments or test descriptions ... rot fast"). The author-time `comment-review.sh` hook didn't catch it (the regex tractable in stub mode doesn't include AC refs in test `describe` strings); reviewer-style flagged it as `issue` at PR review. Worth extending the stub hook's regex catalogue.
- **Defensive dead-guard slipped through.** First `if (notes.length >= 2) return notes` after D5 push was unreachable (D5 contributes at most 1 note). Reviewer-style flagged correctly. Lesson: when defensively coding a cap-loop, verify each guard is REACHABLE under the contributing function's range, not just SAFE.

## Key decisions

The 5 design decisions in slice acceptance.md §"Design decisions (named uncertainties)":

1. **D-1.** D5 trigger scope: `relationship_length` only (literal trigger reading; "+ ages" treated as draft artifact; `ex_age_relative` + `your_age` stay captured-but-unused in plan-engine for this slice).
2. **D-2.** Paired spec patch on spec 65b §AI-coach §Ex-partner row drops the "Used locally by plan-engine for relative-age sharing-principle framing only" wording — promise-without-delivery per D-1.
3. **D-3.** Tie-break on >2 quantitative triggers: first-firing in D5 → D6 → D7 spec order. Deterministic.
4. **D-4.** Type extension: `Quantitative` interface added to `lib/types.ts`; optional `quantitative?: Quantitative` field on `Answers`. Lowest blast radius on existing call sites.
5. **D-5.** New test file `build-plan-quantitative.test.ts`; existing `build-plan.test.ts` unchanged.

Plus 1 reviewer-driven amendment (AC-4 clarification + 2 covering tests): mid-range `target_timeline ∈ {'6m', '12m'}` without `deadline` driver return `null` (no D7 note emitted). Spec L273-277 has no rule for these mid-range values; falling through to no note is the documented behaviour.

## Persona findings recorded

**Auto-review round 1 on `1b9783e`** (verdict: request-changes; 8 findings):

| Persona | Findings | Missed by main? |
|---|---|---|
| `reviewer-prototype-readiness` | 3 (1 blocking-flag `ac-gap` D7 mid-range · 1 `suggestion` D6 property_equity · 1 informational `note` re DoD-4) | Y · Y · N (correctly-scoped declaration) |
| `reviewer-style` | 4 (1 `issue` AC ref in describe string · 2 `nitpick` short var names · 1 `nitpick` dead guard) | Y · Y · Y · Y |
| `reviewer-security` | 1 (`praise` re GDPR posture on `ex_age_relative` spec patch) | N (non-actionable) |
| `reviewer-correctness` | 0 actionable | N/A |

**Auto-review round 2 on `9ec06ff`**: approve verdict (no findings). 25/25 CI checks green; merged.

**Retain/drop verdict (per CLAUDE.md §"Persona retain/drop metric").** This is the 3rd `src/` slice post-rigour-v3b ship (after S-F1 via PR #23 + S-PROTO-copy-resolver-sweep via PR #200). Per the retain criteria (*"if the agent catches at least one issue the main conversation missed per 2-3 slices, retain. Otherwise drop"*):

| Persona | Session 104 hits | Verdict | Rationale |
|---|---|---|---|
| `reviewer-prototype-readiness` | 2 actionable issues main missed | **Retain** | Caught a blocking-flag AC gap + a sibling AC gap not surfaced in main's planning round. Clear value. |
| `reviewer-style` | 4 issues main missed | **Retain** | Highest hit rate this slice. AC ref in test description (semantically prohibited by CLAUDE.md) + 2 naming nitpicks + 1 reachability bug all caught. |
| `reviewer-security` | 0 actionable; 1 praise | **Retain (provisionally)** | Single slice with 0 hits is insufficient to drop a security persona — surfaces tend to come irregularly. Re-evaluate after 2 more `src/` slices. |
| `reviewer-correctness` | 0 actionable | **Retain (provisionally)** | Same logic — small sample. The 3-finding history from session-103's spec-only PR #201 (where correctness DID catch 2 fabrications) supports keeping. |
| `acceptance-gate` | n/a (informational at v3b ship; auto-blocking deferred to v3c) | **Retain** | Not yet wired to block PR merge; persona file ships at v3b but blocking enforcement is v3c. |
| `ux-polish-reviewer` | n/a (dormant — no UI surface this slice) | **Retain (dormant)** | Logic-only slice; rubric only fires for UI-surface slices. Will fire on P3 (session 105). |

Net: retain all 4 active personas + 2 dormant. No drops at v3b ship. The first 3 `src/` slices have demonstrated value; the retain/drop metric continues but as a multi-session trailing assessment rather than a 3-slice cliff.

## Next session priorities

P2 closed. Remaining:

| # | Priority | Effort | Notes |
|---|---|---|---|
| 1 | **(Carried + re-prioritised)** UI slice for 3 new pre-signup screens (O6.5 / O6.6 / O6.7) | Heavy | User confirmed no canvases at session-104 wrap; build is spec-only from spec 65b §"The 3 new screens" L60-208. Now that P2 shipped, `Quantitative` type + state shape are on main. |
| 2 | **(Inherited)** Desktop graceful enhancement — Help Rail integration + intermediate breakpoints | Heavy | Help Rail spec ref still pending per session-101 note. |

**Recommended for session 105:** P3 (UI slice). The state shape + plan-engine hooks landed in session 104; the UI is the final piece to make spec 65b user-visible.

## Session 104 metrics

- **Lines added:** ~510 across 6 files (acceptance 128 + verification 93 + impl 97 + tests 142 + spec 65b +1 + iterations +49).
- **Lines deleted:** ~30 (refactor iterations).
- **Tests added:** 29 (71 total in `build-plan-quantitative.test.ts` + `build-plan.test.ts`).
- **CI checks at merge:** 25 / 25 green.
- **Auto-review rounds:** 2 (round 1 request-changes, round 2 approve).
- **Findings addressed:** 6 actionable + 1 same-PR-spec-patch CI failure.
- **Session churn (this CLAUDE.md session):** ~459L author time at handoff start.
- **PR shipped:** #202 (squash-merged as `464b943`).

## Recurrence-watch (carried + new)

Carried 19 items from session 103. New observations this session:

- **`spec-citation-quote` gate's same-PR replacement edge case.** When a paired spec patch in the SAME PR removes the OLD text being quoted, the gate's fuzzy-match against the (now-patched) spec content fails — the OLD text is no longer in the spec. Fix: blockquote the NEW (in-spec) text as the proximity quote; move OLD text to inline prose. Author-time stub passes per-file but doesn't catch this; merge-time CI gate does. One-session-observed; promote to numbered constraint if a second session confirms.
- **Sibling spec discrepancies should be batched at AC freeze.** When one ambiguity surfaces (e.g. D5 "+ ages"), scan for siblings before AC freeze — D6's `property_equity` had the same pattern but was silently-decided in AC text. Reviewer-prototype-readiness caught it at PR time. Lesson: a single AskUserQuestion round per slice may be too tight; offer the user a "scan-for-siblings" round when one spec ambiguity surfaces.
- **Author-time comment-review stub doesn't catch AC refs in test `describe` strings.** Regex catalogue covers persistent prose anti-patterns but not slice-ID/AC-ID in test names. Reviewer-style catches at PR time. Could extend the stub regex with `describe\(['"][^'"]*(AC-\d|S-[A-Z])` pattern. Tracked as a stub-extension candidate.

Second-session-observed (carried from session 103, repeated session 104 in a different shape):

- **`spec-citation-quote` author-time stub vs CI gate strictness.** Session 103 found inline-italic vs blockquote markup. Session 104 found same-PR spec patch removing the OLD quoted text. Both show: the author-time stub is more permissive than the CI gate. Slice authors should run `bash scripts/spec-citation-quote-check.sh` locally before push (NOT relying on hook-stub feedback alone). Worth promoting to numbered constraint after a third repetition.
