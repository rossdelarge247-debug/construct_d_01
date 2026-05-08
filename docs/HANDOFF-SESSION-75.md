# HANDOFF — Session 75

**Working branch:** `claude/decouple-session-75-ZRcSX` (sequential single-branch — session-21-in-a-row of the pattern continuing from session 73).
**PRs merged:** #125 (P0 — spec 76 prototype-mode rigour). Wrap PR #126 follows this commit.

## What happened (in order)

1. **P0 plan drafted** to `/tmp/session-75-p0-plan.md` (~150L). Path B (slice-category metadata) per session-74 dialogue. Files inventoried: spec 76 NEW, CLAUDE.md amend, prototype-readiness persona NEW, vitest + tdd-guard + shellspec + auto-review.yml + PR template wiring, S-PROTO-hub override sweep. Estimated ~343L.

2. **Path-C manual plan-time review** — harness lacks plan-mode toggle (Shift+Tab does not work; `/plan` unavailable per session-74 dialogue). Spawned `.claude/agents/plan-architect.md` and `.claude/subagent-prompts/exit-plan-review.md` in parallel via `Agent` tool. Both 0 blocking. Real catches: F-PA3 (`[slug]` parametric-route disambiguation needed explicit regex + shellspec cases), F-EPR2 (full constraint #38 quote — my plan truncated trailing clause), F-EPR3 (13/14-item base-count drift across CLAUDE.md L136+L255 + PR template; spec 72 §11 always had 14 boxes), F-EPR4 (equivocation about `tests/shellspec/tdd-guard.spec.sh` existence — file does exist).

3. **Decision points to user via `AskUserQuestion`:** F-PA1 (substitute vs add reviewer-prototype-readiness for category=prototype) → user chose **substitute**. F-EPR3 (reconcile 13/14 in same PR or defer) → user chose **reconcile in same PR**.

4. **Authored** spec 76 (114L), CLAUDE.md amendment (NEW §"Slice categories" pointer + 13→14 reconcile), `reviewer-prototype-readiness.md` persona (119L mirroring `reviewer-correctness.md` with UI/UX lens — interaction patterns, accessibility-essential/visual, state coverage, copy clarity, motion + `prefers-reduced-motion`, mobile viewport, AC-gap inherited from correctness rubric).

5. **Wired** vitest `coverage.exclude` for literal-slug prototype paths (regex `[a-zA-Z0-9_-]*/**` excludes `[slug]` parametric route); `tdd-guard.sh` path-default skip with `[slug]` disambiguation via bash regex `^src/app/dev/proto/[^/[]+/.+\.(ts|tsx)$`; 3 new shellspec fixtures (12-14) verifying skip / enforce / enforce semantics; `auto-review.yml` brief-job category-detection with `dimensions` JSON output consumed by specialist matrix + aggregator via `fromJSON()`; PR template short-form note for category=prototype.

6. **Swept** `S-PROTO-hub/acceptance.md` with `**Category:** production` override (per spec 76 §1 hub override — calibration cohort row 1 keeps production rigour).

7. **Manual hook trace** verified all 3 new fixtures pass (12: exit 0 skip; 13: exit 2 enforce; 14: exit 2 enforce) + no regression on existing allowlist.

8. **Committed** `4bc93d7` (9 files, +360/-9). Pushed to `origin/claude/decouple-session-75-ZRcSX`. Opened PR #125 with full Path-C plan-time review trail in body.

9. **Post-PR auto-review** (3-specialist multi-agent) verdict: ✅ approve, 0 blocking, 2 advisory findings:
   - `style/commenting`: dropped `(F-PA3)` session-scoped suffix from shellspec Describe block (CLAUDE.md L215-222 anti-pattern — the very rule being amended in this PR).
   - `security/note`: defensive env-var pattern for aggregator step (mirrors brief job's `env: DIMENSIONS_JSON` mapping; future-proof against GitHub Actions script-injection vector if dimensions source ever widens).
   - First run hit `degraded mode` (correctness specialist inconclusive — likely transient LLM JSON malformation); second run after fixup all 3 specialists clean.

10. **Fixup commit** `69b6dd7` addressed both findings. Re-run auto-review verdict: ✅ approve, 0 findings. All 22 checks green. Squash-merged as `9346963`.

11. **Resync** branch `claude/decouple-session-75-ZRcSX` from post-merge `origin/main`. Wrap follows.

## What went well

- **Path-C manual plan-time review** caught real issues pre-impl. F-PA3 was the most substantive — `[slug]` parametric-route directory exists today and a naive glob would have matched both literal-slug and parametric paths. Without that catch, the path-default skip would have wrongly skipped `[slug]/page.tsx` enforcement.
- **`AskUserQuestion` for substitute-vs-add + 13/14 reconciliation** kept architectural decisions visible. User's "substitute" choice is consistent with friction-reduction goal; "reconcile" choice closed pre-existing drift in the canonical reference text.
- **Constraint #38 sweep discipline** — applied to spec 76 itself. The wiring landed atomically with the spec (no partial ship that would create internal inconsistency between matrix and implementing files).
- **Multi-agent suite earned its keep again.** Style specialist caught the very anti-pattern (session-scoped provenance) that the PR was reformulating in CLAUDE.md. Security specialist caught the script-injection-vector defensive pattern. Both real value-adds.
- **Single-shot fixup → green** (3min from finding-post to second auto-review approval). Differential mode worked as designed — both prior findings resolved + 0 new findings on the fixup diff.

## What could improve

- **I introduced the same anti-pattern I was reviewing.** `(F-PA3)` suffix in the shellspec Describe block was an instance of the rule (CLAUDE.md L215-222 "PR / session / slice provenance in persistent test descriptions") that this very PR was reformulating in spec 76. Should have caught at author-time. The author-time `comment-review.sh` hook is stub-mode by default; live-mode (`COMMENT_REVIEW_SPAWN=1`) would have flagged this pre-commit. Reinforces value of opting into live-mode for control-plane PRs that touch the comment-rule surface itself.
- **First-run degraded mode** (correctness inconclusive). One-off; second run clean. Not investigated further — the catch made by style specialist would have been correctness's catch as well, so signal was preserved. Worth tracking if it recurs.
- **My async sub-agent flag was implicit** — when spawning two parallel personas via `Agent`, the harness ran the second one async (background) without me setting `run_in_background: true`. Worked fine (notification arrived) but should have set the flag explicitly for clarity.

## Key decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Path B (slice-category metadata) over Path A (path-globs alone) or Path C (full framework) | Two-tier resolution gives sensible defaults + explicit override escape hatch; appropriate scale for current cohort |
| 2 | `**Category:** prototype \| production \| infrastructure` declaration in `acceptance.md` after slice title | Single literal-regex detection across all consumers; minimal authoring overhead |
| 3 | Substitute pattern (prototype-readiness REPLACES correctness for category=prototype) | Friction reduction is the goal; running both defeats it; plan-architect at plan-time still fires for ALL categories including prototype |
| 4 | 13→14 base-count reconciliation in same PR | Constraint #38 — drift like this rots forever if not swept when the surface is open |
| 5 | `S-PROTO-hub` keeps `**Category:** production` via override | Calibration cohort row 1 anchor; runs full DoD-14; future prototype slices use path-default |
| 6 | Matrix-consistency fitness function (F-PA2) deferred per spec 76 §8 | Current scale (5 implementing files) sweepable manually; revisit if matrix grows past 5 OR after first observed drift |
| 7 | DoD-14 short-form for prototypes: items 1, 8, 12, 14 only | Items match T0-data dev-mode static-data hubs; escalation pattern for prototypes that touch normally-N/A surfaces |
| 8 | Test-pain audit threshold raises >2 → >5 for prototype paths | Prototypes routinely mock data sources, store stubs, route params; >2 is normal fingerprint not a smell |

## New constraints discovered

| # | Constraint | Why it matters |
|---|---|---|
| #39 | **Sweep your own diff for the anti-pattern you're amending.** When a PR touches CLAUDE.md anti-pattern rules (or spec rules that propagate to enforcement), grep the same PR's diff for instances of the rule being amended. The (F-PA3) suffix this session was a clean instance: I was REVIEWING a spec against a session-scoped-provenance anti-pattern while INTRODUCING the anti-pattern in the same PR. Author-time `comment-review.sh` live-mode would catch; stub-mode regex in current setup did not flag the test-description case until post-PR. | First experience of authoring an anti-pattern instance in a PR amending the rule that anti-pattern. Pattern repeatable: spec 72 §X amendment + new test description; CLAUDE.md §Y rule + new comment in code. The `comment-review.sh` author-time hook is meant to catch this; live-mode adoption is worth considering. |

## Persona findings (informational; this slice is NOT part of the 3-src/-slice calibration cohort per spec 72c §9 — cohort row 1 = S-PROTO-hub stays locked, rows 2-3 pending P1 + P2)

| Persona | Phase | Findings | Real issue main missed (Y/N) | Notes |
|---|---|---|---|---|
| `plan-architect` (plan-time, Path-C manual) | plan | 4 (1 issue + 1 suggestion + 1 question + 1 note) | **Y** (F-PA3 `[slug]` regex was a real technical catch) | F-PA1 substitute decision deferred to user; F-PA4 confirmation only |
| `exit-plan-review` (plan-time, Path-C manual) | plan | 4 (3 suggestions + 1 nitpick) | **Y** (F-EPR2 truncated quote + F-EPR3 13/14 drift + F-EPR4 file-existence equivocation; all real catches) | Strong calibration signal across spec-citation discipline |
| `reviewer-security` (PR auto-review) | post-PR | 1 (note, non-blocking) | N (defensive future-proofing; no current vulnerability) | Worth implementing anyway for pattern hygiene |
| `reviewer-correctness` (PR auto-review) | post-PR | 0 | N | Run 1 degraded (envelope unparseable); run 2 clean |
| `reviewer-style` (PR auto-review) | post-PR | 1 (issue commenting, non-blocking) | **Y** (real CLAUDE.md L215-222 anti-pattern catch — the very rule being amended) | High signal — caught the rule-instance in the rule-amendment PR itself |

## Bugs found + how they were fixed

1. **(F-PA3) suffix in `tests/shellspec/tdd-guard.spec.sh` Describe block.** Session-scoped finding-ID in persistent test description = CLAUDE.md L215-222 anti-pattern. Fixed in fixup commit `69b6dd7`: `Describe 'spec 76 §2 — prototype-mode path-default skip (F-PA3)'` → `Describe 'spec 76 §2 — prototype-mode path-default skip'`.

2. **`${{ needs.brief.outputs.dimensions }}` interpolated directly into bash in `auto-review.yml` aggregator step.** Safe today (source is hardcoded `case` statement, not user-controlled), but the brief-job pattern uses `env:` mapping for defense-in-depth. Future-proofs against GitHub Actions script-injection vector if dimensions source ever widens to include PR body / branch name / label values. Fixed in `69b6dd7`: added `env: DIMENSIONS_JSON: ${{ needs.brief.outputs.dimensions }}` to the aggregator step + changed loop to read `"$DIMENSIONS_JSON"`.

## Next session priorities

**P0 (proposed):** `S-PROTO-pre-signup-interview` — Phase 3 P1 prototype slice, first slice to exercise `category: prototype` path-default + `reviewer-prototype-readiness` persona. 8 screens per spec 65 (pre-signup interview reconciled). Real spec 74 AI plan generation integration.

**Blocked on:** Claude AI Design canvas for the 8 pre-signup interview screens. Per per-prototype 4-step loop (dialogue → canvas-prompt → absorb → construct), session 76 START is at step 1 (dialogue: what we're trying to learn / what's uncertain). Step 2 (canvas-prompts) generates Claude AI Design prompts; step 3 absorbs the canvas output once delivered; step 4 builds the clickable prototype. Steps 1-2 are session 76 P0; steps 3-4 land in session 77+ once user has supplied canvas output to `docs/design-source/pre-signup-interview/`.

**Alternative if user wants to ship src/ slice work this session:** `S-PROTO-section-confirm` (P2) is less canvas-dependent (per-section confirmation pattern is a UI-only state-machine; less novel visual treatment than pre-signup-interview); could potentially run in parallel.

**Or smaller control-plane work:**
- F-PA2 deferred matrix-consistency fitness function (spec 76 §8) — shellspec or CI assertion that parses the §3 matrix and verifies each enforcement file's behaviour. Triggers when matrix grows past 5 enforcement points OR after first observed drift; neither has happened yet, but spec 76 itself is the surface to target.
- Live-mode opt-in for `comment-review.sh` (constraint #39 mitigation) — would have caught this session's (F-PA3) anti-pattern at author-time pre-commit.

See `docs/SESSION-CONTEXT.md` §"Session 76 priorities" for refreshed Phase 3 sequence + alternative ordering.
