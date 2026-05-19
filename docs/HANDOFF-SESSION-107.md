# Session 107 retro — S-PROTO-quantitative-screens-polish

## Pre-priority verifications cleared at turn 0

Per CLAUDE.md §"Planning conduct":

- Branch state verified by `.claude/hooks/session-start.sh`: landed on `claude/session-107-preview-3s8EE` cleanly from main `1e3a172`. Kickoff's `2a72185` was the prior commit; session-106 wrap landed `1e3a172` on top — both already on main.
- PENDING-count check: `grep -c "PENDING" docs/slices/S-PROTO-quantitative-screens/verification.md` returned 4 — but the 4 hits all sit in the §Status retro section (lines 120-122 + 135), NOT in the rubric table itself. The actual rubric table rows say `N/A` (not `PENDING`). Surfacing this nuance saved a misdirected debug round.
- Vercel preview check: production URL returned HTTP 403 from outbound curl (likely sandbox auth gate; users see the page fine in their browsers).
- ARIA wiring check on the slice's interactive components confirmed strong from source-code inspection (role + aria-checked + aria-labelledby + aria-expanded + aria-controls + minHeight:44 throughout).

## Scope decisions (2 AskUserQuestion rounds, 3 + 1 sub-decisions locked)

**Round 1 (turn ~3): Which priority for session 107?**

User picked P1 (preview-deploy review, "you drive, I record"). Sub-questions caught a constraint mid-discussion: per-prototype-slice rubric exercises (DevTools reduced-motion + 375×667 + screen-reader) need a real browser and screen-reader, which the sandbox can't provide; "you drive" was the realistic path.

**Round 2 (turn ~5): Defer P1 to system-wide post-prototype-lock-down?**

User pivoted — declined P1 entirely with the reasoning: *"i want to defer this as it is meant to be a prototype at this point and i dont think this level of quality is required - i would like to do this later system wide when we have locked down and iterated the prototype journeys."* Locked-in scope decision; recorded in SESSION-CONTEXT (commit `f59aa3f`).

Sub-questions:

- Record P1 deferral where? → SESSION-CONTEXT only (lightweight; spec 76 amendment deferred).
- What's the rest of session 107? → Move to P3 (quant-screens polish).
- What's in P3's scope? → "All 4 (full P3 bundle)" — focus-visible + roving tabindex + SkipScreenButton + useQuantitativeUpdate.

## Slice deliverables

PR #209 opened against main (squash-merge pending auto-review verdict at wrap). Category `prototype` (path-default for `src/app/dev/proto/**`).

| AC | Deliverable | Commit |
|---|---|---|
| f59aa3f | SESSION-CONTEXT P1 deferral note | doc-only |
| 77e27bb | Scaffold: acceptance.md + security.md | docs |
| 6090aaf | AC-1 `SkipScreenButton` extraction · -48/+28 LOC · 3 new tests | impl |
| a42209f | AC-2 `useQuantitativeUpdate` hook · -12/+9 LOC · 4 new tests | impl |
| 669ff65 | AC-3 shared `:focus-visible.module.css` · 4-component className wiring | impl |
| cd50a28 | AC-4 roving tabindex on BucketPicker · WAI-ARIA radiogroup convention · 5 new tests | impl |
| 3640e73 | Verification.md final-state record | docs |

**Final tally:** 330/330 proto suite green (was 318; +12 new tests); tsc clean; lint clean on all touched files; 0 new eslint-disable; no regressions in adjacent slices.

## What went well

- **User-led deferral was the right call.** The "polish later, system-wide" framing crystallised a real principle that compounds forward: per-prototype-slice rubric exercises are interest-payment quality work whose value is best realised in a single comprehensive pass once journeys lock. Recorded in SESSION-CONTEXT as inheritable deferral.
- **Mid-impl AC-3 anti-DRY pivot.** Originally committed to 4 byte-identical per-component CSS modules at AC freeze. At impl time, the duplication was obvious — pivoted to 1 shared `focus-visible.module.css` and amended AC + D-5 + verification.md text in lockstep. Net 4 lines of CSS vs 16. CLAUDE.md §"Simplicity first" in action.
- **TDD-first cadence on extracts.** Each refactor (SkipScreenButton, useQuantitativeUpdate, roving tabindex) shipped with co-committed tests. Tests passed first run after impl. Existing 11 BucketPicker/MultiPicker/ExpansionToggle tests passed through the BucketPicker refactor without modification — behaviour preserved.
- **Native React 19 ref-as-prop / closure-based focus management.** Avoided `forwardRef` on Pill by routing keydown to the parent radiogroup div and using `event.currentTarget.querySelectorAll('button[role="radio"]')[next].focus()`. Minimum surface change to Pill (just added `tabIndex` prop); no ref plumbing needed.
- **Author-time hook caught both verification.md issues pre-commit.** Provenance "session 107" and `per spec 72d §3` without proximate quote were both surfaced via PostToolUse:Write hook with clear diagnostic stderr. Both fixed by 1-for-1 line replacement before commit. Stub-vs-CI strictness: equal here.

## What could improve (2 new recurrence-watch entries)

- **AC mid-impl amendment for anti-DRY refactor.** Pattern: when AC commits to file-count-driven structure that impl reveals as byte-identical duplication, amend the AC + design-decision + verification text in lockstep rather than ship the duplication. Sibling pattern to CLAUDE.md §"Simplicity first" but triggered at impl-time, not scoping-time. One-session-observed; promote if a second session repeats.
- **verification.md hook flags on session-N provenance + per-spec-N citation.** Two PostToolUse:Write hook flags surfaced at verification.md draft pre-commit:
  - Provenance "session 107" (temporal session-N reference outside §Status block).
  - "per spec 72d §3" (spec citation trigger without proximate verbatim quote).
  Both diagnosed via the hook's stderr messages and fixed by rephrasing to doc-pointers (drop the session attribution; cite CLAUDE.md §"Engineering conventions" instead of `per spec 72d §3`). 1-for-1 line replacements. Pattern: verification.md should be drafted with doc-pointers from the start; reserve `per spec NN` for §"Spec sources" sections where the verbatim quote is co-located. One-session-observed.

## Persona findings recorded

**PR #209 opened at session wrap; auto-review fan-out in flight.** Verdict + per-persona finding triage land in `docs/slices/S-PROTO-quantitative-screens-polish/verification.md` §"Auto-review responses" at PR-review time (typically within minutes of PR open).

| Persona | Findings this slice | Verdict | Notes |
|---|---|---|---|
| `reviewer-security` | PENDING | PENDING | UI-only refactor + a11y polish; expect 0 or 1 informational notes. |
| `reviewer-correctness` | PENDING (substituted by `reviewer-prototype-readiness` per prototype category) | PENDING | Prototype-readiness substitutes per spec 76 §3. |
| `reviewer-prototype-readiness` | PENDING | PENDING | Likely catches: 0 mocks in tests (clean); roving tabindex edge cases; AC mid-impl amendment surfacing. |
| `reviewer-style` | PENDING | PENDING | Likely catches: comment narration patterns (if any slip through); naming conventions on new component. |
| `acceptance-gate` | n/a (informational at v3b) | **Retain** | Blocking enforcement v3c. |
| `ux-polish-reviewer` | n/a (dormant per prototype substitution) | **Retain (dormant)** | Prototype-readiness covers UX polish in this calibration. |

Cumulative for retain/drop metric: this is the **5th** `src/` slice post-rigour-v3b ship (S-F1 · S-PROTO-copy-resolver-sweep · S-PROTO-O7-quantitative-hooks · S-PROTO-quantitative-screens · S-PROTO-quantitative-screens-polish). Persona retain/drop verdicts will refresh once auto-review verdict lands.

## Key decisions made

- **D-1: Hand-rolled roving tabindex over native `<input type="radio">` migration.** Native radio gives roving tabindex + SR-announce for free, but requires label-as-control CSS pattern (visually-hidden input + styled label) to preserve the current pill-button visual treatment — net larger diff + visual regression risk. Hand-rolled is smaller and visual-stable.
- **D-2: Minimal-touch focus-visible.** Add `className` for focus-visible only; existing inline `style={{}}` stays unchanged. Per CLAUDE.md §"Surgical changes". Migrating all per-pill styles to modules would expand the surface beyond the AC.
- **D-3: SkipScreenButton hardcoded copy.** All 3 call sites use the same "Skip this screen" label; YAGNI on configurability. Add an optional `label` prop later if a future call site needs different copy.
- **D-4: `useQuantitativeUpdate` returns the update function directly.** Closure over store setter; matches the existing inline-function pattern in the 3 screens; reduces refactor diff.
- **D-5: Focus-ring colour `var(--ds-color-ink, #1A1A1A)`.** Matches the existing `Footer.module.css:69-72` convention rather than introducing a second accent token. Clears WCAG 1.4.11 non-text contrast 3:1 against all relevant backgrounds with wide margin.
- **D-6 (impl-time pivot): AC-3 4 modules → 1 shared module.** Anti-DRY refactor at impl time. Detailed in §"What went well" above.

## Bugs found + how fixed

- **`tokens` import potentially orphaned in O6_5/6/7 after skip-button extraction.** Pre-emptively checked via `grep -c "tokens\."` post-edit — confirmed 3-5 remaining usages per file (typography in titles, borders, colours used elsewhere). Import stayed.
- **`vitest run` failed with "Cannot find module 'vitest/config'".** `node_modules/` was empty (clean sandbox). Fixed by `npm ci --no-audit --no-fund` — 625 packages installed in 18s. Subsequent test runs clean.
- **`O6_7.tsx` edit failed on `import { Footer } ...\nimport { TopBar } ...` pattern.** Imports list had `MultiPicker` between `Footer` and `TopBar` (alphabetical order). Caught by Edit tool's "String to replace not found"; re-located + retried successfully.
- **verification.md hook flags (2 patterns).** See §"What could improve" above for details + fixes.

## Next session priorities

P3 closed. Remaining unblocked:

| # | Priority | Effort | Notes |
|---|---|---|---|
| 1 | **(Inherited, sessions 101-107 carry)** Desktop graceful enhancement — Help Rail integration + intermediate breakpoints | Heavy | Help Rail spec ref STILL pending. Pre-condition: scope a design phase before AC freeze. |
| 2 | **(New from session 107 deferral)** System-wide preview-deploy + accessibility pass | Heavy | Pre-condition: prototype journeys locked down. Single comprehensive 6-dim rubric exercise + WCAG audit + responsive breakpoints + SR walk across the full pre-signup + dashboard surfaces. |
| 3 | **(New)** User-directed work | Varies | Both standing priorities remain blocked; recommend asking user for direction at session 108 start. |

**Recommended:** ask the user. Both P1 and P2 are blocked; P3 from the prior session is closed.

## Session 107 metrics

- **Lines added (PR diff total):** ~330 across 7 commits (1 deferral note + 1 scaffold + 4 AC commits + 1 verification).
- **Lines deleted:** ~78 (mostly from screen-inline blocks collapsing into the new component / hook).
- **Tests added:** 12 (3 SkipScreenButton + 4 useQuantitativeUpdate + 5 BucketPicker roving tabindex). 330/330 proto suite pass.
- **CI checks at merge:** TBD — PR #209 just opened at wrap.
- **Auto-review rounds:** TBD — fan-out fires at PR open / first synchronize.
- **AskUserQuestion rounds:** 2 (priority + P3 scope; sub-questions inside each).
- **PR shipped:** #209 (open at wrap).
- **Session churn:** ~828 lines tracked-or-untracked across 17 files. Well within budget.

## Recurrence-watch (carried + new + resolved)

**RESOLVED session 107:** None — all session-106 entries remain on watch (none exercised this session, none promoted).

**New observations session 107 (one-session-observed; promote to numbered constraint if a second session repeats):**

- AC mid-impl amendment for anti-DRY refactor (detail above).
- verification.md hook flags on session-N provenance + per-spec-N citation (detail above).

**Second-session-observed promotion eligible (carried from session 103, now repeated at session 106, did NOT recur session 107):**

- `spec-citation-quote` author-time stub vs CI gate strictness — author-time hook caught the verification.md hits before commit this session. Stays second-session-observed; promote at session 108+ if a third stub-vs-CI miss recurs.

**Second-session-observed promotion eligible (carried from session 104, repeated at session 105 in prevention shape; sessions 106 + 107 did not exercise):**

- Sibling-spec-discrepancy batching at AC freeze — single-AC-axis slice this session; not exercised. Stays second-session-observed.

**Carried unchanged from session 106:**

- Bracket-glob shellspec gotcha (no shellspec changes session 107).
- Indented-blockquote escape via doc-pointer (no blockquote-under-list patterns added session 107).
- AC-vs-impl-path drift (AC referenced files all landed at their expected paths; no drift session 107).

**Carried unchanged from session 105:**

- PR body edits don't re-run all CI workflows (one-session-observed; did not recur sessions 106 or 107).

**Carried unchanged from session 104:**

- `spec-citation-quote` same-PR replacement edge case (no recurrence).
- Author-time comment-review stub doesn't catch AC refs in test `describe` strings (no recurrence).
- AC-impl cross-check at impl-time.
- Sibling-wrapper diff at impl-time.
- Shared-infrastructure audit at refactor-time.
- In-PR scope-expansion confirmation gate.
- `git push --force` after amend.
- verification.md PARTIAL internal contradiction.
- Read-cap accumulation during sweep cycles.
- Single-lens audit framing.
- Pre-existing provenance opportunistic cleanup at paragraph rewrite.
- Audit findings need active-spec cross-reference at audit time.
- Pre-existing CI noise should be queued, not deferred indefinitely.
- Post-batch §Status sweep inline with finding-impl slice.
- Documentation-meta-loop on guard-rule prose.

**Older carries (sessions 100-103):** Skip-walk + structured retro; Test-description provenance anti-pattern; Severity-tier collapse with strict user; Per-batch test cascade; Audit-walk regex coverage; Mid-flight scope-expansion gate worked cleanly; Spec-only sessions don't increment v3b persona retain/drop counter.
