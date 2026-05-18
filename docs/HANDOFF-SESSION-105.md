# Handoff — Session 105

**Branch shipped:** `S-PROTO-quantitative-screens` impl + auto-review responses on `claude/session-105-O6-quantitative-screens`, squash-merged to main as `64918d9` via PR #204.

**Scope shipped:** UI for the 3 new pre-signup quantitative screens (O6.5 / O6.6 / O6.7) plus a Q-bridge transition screen between O6 and O6.5. 4 new screens + 3 shared components (`BucketPicker` / `MultiPicker` / `ExpansionToggle`) + dispatcher wire + 11 component tests. Wires the existing `Quantitative` state shape on main (shipped session 104) to user-facing input. Canvas-as-source pattern — no canvases for these screens; spec 65b is the sole source.

## What happened

Session 105 picked up the recommended P1 from session 104's carry-forward — UI for the 3 new pre-signup screens. P2 (desktop graceful enhancement) stayed on board; Help Rail spec ref still pending.

**Pre-priority verifications cleared at turn 0** per CLAUDE.md §"Planning conduct":

- Shipped-artifact check: no `S-PROTO-O6.5` / `O6.6` / `O6.7` / `quantitative-screens` slice existed.
- Spec-gate check: spec 65b §"The 3 new screens" L60-208 has no gating IF-clause; §"What this does NOT cover" L333-345 listed scope exclusions confirmed respected.
- Canvas-fidelity check: `docs/design-source/pre-signup-interview/` confirmed has no canvases for O6.5/O6.6/O6.7 — only O1-O8 expressive HTMLs.

**3 explicit AskUserQuestion rounds, 4 decisions locked:**

| Round | Decision |
|---|---|
| Priority | P1 (UI slice) over P2 (desktop graceful enhancement — blocked) |
| Partition | 1 combined slice (vs 3 per-screen vs 2-slice mix) |
| Transition copy location | New dedicated bridge screen between O6 and O6.5 (vs modify O6 footer vs O6.5 preamble) |
| Progress-pill behavior | Frozen at 6/8 through new screens (vs renumber to /12 vs hide pill) |

**Sibling-spec-discrepancy batching applied (per session-104 retro lesson).** When the partition + transition copy decisions surfaced ambiguities, scanned for siblings before AC freeze:

- D-5: `hasChildren=undefined` → strict 'yes' trigger (treat undefined as no-children).
- D-6: `childrenCount=undefined` when hasChildren='yes' → fall through to Youngest+Oldest pair.
- D-7: Spec L133 `property_status=rent` maps to `situation.home === 'rent'` (types.ts authoritative).
- D-8 + D-9: Skip-section / Skip-screen leave state undefined (equivalent to null per spec L217).

All 4 captured as silent-decided named uncertainties in acceptance.md §"Design decisions" with rationale.

**Slice scaffold + AC + impl + tests + verification shipped across 4 commits on the session branch:**

| # | Commit | Description |
|---|---|---|
| 1 | `76d51f8` | scaffold acceptance.md (11 ACs, 9 design decisions) |
| 2 | `ecf2d43` | impl + 11 tests (4 screens + 3 shared components + dispatcher wire) |
| 3 | `d4d89bb` | verification.md (final-state record) |
| 4 | `87be154` | fix 3 auto-review accessibility findings + 6 deferred-with-reasoning |

**1 CI failure, diagnosed + fixed via PR body update.** `src/ changes reference slice verification` failed because PR body referenced `acceptance.md` but the workflow regex (`docs/slices/S-[A-Za-z0-9-]+/verification\.md`) requires the literal verification.md path. Fixed by updating PR body to add an explicit `Evidence: docs/slices/S-PROTO-quantitative-screens/verification.md` line. The next `pull_request:edited` event re-ran the check and it passed.

**1 hook block during audit-response commit.** `.claude/hooks/tdd-first-every-commit.sh` blocked the src/-only commit because the staged diff had no tests/ co-commit. Resolved by adding an `aria-controls` assertion to the existing ExpansionToggle test (which also strengthened test coverage of fix #2). No bypass used.

**2 auto-review rounds on PR #204:**

| Round | Head SHA | Verdict | Findings | Resolution |
|---|---|---|---|---|
| 1 | `d4d89bb` | request-changes (9 findings, all advisory `blocking: false`) | 5 issues + 2 nitpicks + 1 suggestion + 1 note | 3 fixed in `87be154`, 6 deferred-with-reasoning in verification.md |
| 2 | `87be154` | nit-only (7 findings — 3 praise + 2 notes + 2 nitpicks) | All non-actionable; deferred-items carried | Merged via admin-bypass (solo-operator self-approval rule) |

Merged via squash to main as `64918d9`.

## What went well

- **Sibling-spec-discrepancy batching worked.** Session-104's retro lesson applied successfully — 4 sibling discrepancies (D-5/D-6/D-7/D-9 group) surfaced at AC scoping rather than at PR-review time. Saved one round of auto-review fan-out.
- **AC sign-off before code.** 11 ACs + 9 design decisions confirmed before any impl turn. No silent decisions slipped through.
- **Test infrastructure worked first-try.** `@testing-library/react` + jsdom + vitest had no setup issues; 11 component tests passed on first run.
- **Auto-review caught 5 real accessibility issues main missed.** WCAG 1.4.11 (contrast 1.57:1), WCAG 2.5.5 (touch targets <44px), aria-controls void when collapsed, focus-visible inline-style limitation, ARIA radiogroup roving-tabindex pattern. The 3 immediately-fixable + 2 deferred-with-reasoning all carry concrete WCAG-citable rationale.
- **TDD-guard prompted a better test, not a workaround.** The hook block forced adding an `aria-controls` assertion — which improved the test suite's coverage of fix #2 (the aria-controls conditional). Rigour gate produced a real-quality improvement, not just box-ticking.
- **Author-time + CI-time spec-citation gates both clean.** No round-trip drift between stub and CI strict-mode. Session-104 recurrence-watch entry on stub-vs-CI strictness DID NOT repeat this session.

## What could improve

- **TDD-guard hook not category-aware.** `.claude/hooks/tdd-first-every-commit.sh` blocks any src/ commit without tests/ co-commit, regardless of slice category. CLAUDE.md §"Slice categories" §"prototype" matrix explicitly states "TDD-guard skips" for prototype, but the hook doesn't honor that. Workaround this session: added a test assertion to unblock (which was a net positive, but the gate should still be category-aware so prototype slices don't have to invent boilerplate co-commits when changes are pure-visual).
- **`§Status` awk-strip works only with `## §Status` literal, not `## Status`.** CLAUDE.md documents the exemption pattern as `^## §?Status` (§ optional). My initial verification.md used `## Status` and the comment-review hook still flagged "session 105" provenance inside the footer. Diagnosis: awk's `§?` quantifier on the multi-byte § character doesn't function as ERE-spec optional — testing confirmed `## Status` does NOT match `^## §?Status` whereas `## §Status` does. Workaround: use `## §Status` (with § prefix) for the footer header. CLAUDE.md exemption pattern is documented one way; impl honors a stricter subset.
- **PR body edits don't re-run all workflows.** `pr-dod.yml` triggers on `pull_request:opened/synchronize`, not `:edited`. After fixing the PR body to reference verification.md, the old failure entry stays in the check-runs list — only a new run on PR-body-edit event passes. Cosmetic but the merge-button summary still shows the stale failure alongside the new success. One-session-observed.
- **Inline-style components prevent `:focus-visible` polish.** All 3 new shared components use inline CSS-in-JS styles, which can't express pseudo-class selectors. Browser-default focus rings preserve baseline keyboard accessibility, but custom focus-visible polish requires a `.module.css` file. Deferred for this prototype slice; flagged for production-promotion.

## Key decisions

The 9 design decisions in acceptance.md §"Design decisions (named uncertainties)":

1. **D-1.** Progress-pill behavior: frozen at `step=6 total=8` through new screens; advances to 7/8 at O7. User-decided at scoping.
2. **D-2.** `SCREEN_COUNT=12` (internal step counter, dispatcher clamp); `TOTAL_STEPS=8` preserved (pill display max). Avoids touching all existing O1-O8 screens.
3. **D-3.** Transition screen filename `QuantBridge.tsx` at numeric step 7. User-decided at scoping.
4. **D-4.** 1 combined slice (vs 3 per-screen vs 2-slice). User-decided at scoping.
5. **D-5.** Children-section trigger: `hasChildren === 'yes'` strict; undefined or 'no' → skip section.
6. **D-6.** Single-child relabel: `childrenCount === 1` shows "Your child"; undefined OR ≥2 → Youngest+Oldest pair.
7. **D-7.** Spec L133 `property_status=rent` → `situation.home === 'rent'`. types.ts authoritative.
8. **D-8.** "Skip the quantitative section" from Q-bridge: `goTo(11)` directly; leave Quantitative undefined.
9. **D-9.** "Skip this screen" from O6.5/O6.6/O6.7: advance step without writing; partial values persist (per spec L217 equivalence — plan-engine treats null/undefined identically).

Plus the auto-review-response triage matrix recorded in verification.md §"Auto-review responses":

| Finding | Action | Reasoning |
|---|---|---|
| #1 focus-visible | Defer | Browser-default rings apply; custom polish for canvas pass |
| #2 aria-controls void | Fix | Trivial: `aria-controls={open ? contentId : undefined}` |
| #3 contrast 1.57:1 | Fix | `#C9C5BD` → `#767676` (WCAG 1.4.11) |
| #4 roving tabindex | Defer | Each pill keyboard-accessible via Tab; ARIA pattern polish deferred |
| #5 touch <44px | Fix | `minHeight: 44` on Pill / CheckPill / ExpansionToggle / Skip buttons |
| #6 SkipScreenButton dup | Defer | CLAUDE.md §"Simplicity first" — 3 instances is the threshold |
| #7 update helper dup | Defer | Same reasoning |
| #8 security note | Ack | Informational; flag for production-promotion |
| #9 D-9 ac-gap | Defer-with-reasoning | Spec L217 equivalence holds |

## Persona findings recorded

**Auto-review round 1 on `d4d89bb`** (verdict: request-changes; 9 findings):

| Persona | Findings | Issues main missed? |
|---|---|---|
| `reviewer-prototype-readiness` | 6 (5 issues + 1 suggestion) | Y · Y · Y · Y · Y · Y |
| `reviewer-style` | 2 (2 nitpicks) | Y · Y |
| `reviewer-security` | 1 (1 note) | Y (informational; not a gap but a production-promotion flag main hadn't surfaced) |
| `reviewer-correctness` | 0 | N/A |

**Auto-review round 2 on `87be154`**: nit-only verdict (7 findings — 3 praise + 2 notes + 2 carried nitpicks). All non-actionable.

**Retain/drop verdict (per CLAUDE.md §"Persona retain/drop metric").** This is the **4th** `src/` slice post-rigour-v3b ship (after S-F1 via PR #23 + S-PROTO-copy-resolver-sweep via PR #200 + S-PROTO-O7-quantitative-hooks via PR #202).

| Persona | Session 105 hits | Verdict | Rationale |
|---|---|---|---|
| `reviewer-prototype-readiness` | 6 actionable issues main missed | **Retain — strong** | Highest-value persona this slice. Caught 5 WCAG-citable accessibility issues + 1 spec-ambiguity edge. Pattern matches session 104 (2 actionable) → trending positive across UI-surface slices. |
| `reviewer-style` | 2 issues main missed | **Retain** | Consistent value across 2 src/ slices (4 hits session 104, 2 hits session 105). Catches both visible anti-patterns and structural duplication. |
| `reviewer-security` | 1 informational note | **Retain (provisionally)** | Single note about data-classification — useful flag for production-promotion review but not an actionable finding this slice. Cumulative: 1 finding across sessions 104+105. Re-evaluate at session 107 if no actionable hits surface. |
| `reviewer-correctness` | 0 actionable | **Retain (provisionally)** | Same logic — small sample. Session-103's PR #201 (spec-only) caught 2 fabrications; sessions 104+105 src/ slices have 0 hits each. Bias the retention because correctness coverage tends to shine on logic-heavy slices, not UI. |
| `acceptance-gate` | n/a (informational at v3b ship) | **Retain** | Persona file ships at v3b but blocking enforcement is v3c. |
| `ux-polish-reviewer` | n/a (dormant — auto-fired as part of `prototype-readiness` accessibility flagging) | **Retain (dormant in current arrangement)** | Functionally, the prototype-readiness persona is doing UX-polish work too — preview-deploy rubric and accessibility findings overlap. Reconsider whether `ux-polish-reviewer` is redundant when prototype-readiness fires. |

Net: retain all 4 active personas; 2 dormant retained pending re-evaluation. No drops at session 105.

## Next session priorities

P1 closed. Remaining + new:

| # | Priority | Effort | Notes |
|---|---|---|---|
| 1 | **(Inherited)** Desktop graceful enhancement — Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px | Heavy | Help Rail spec ref STILL pending (session 101→102→103→104→105 carry-over). Pre-condition: scope a design phase before AC freeze. |
| 2 | **(New from session 105)** Preview-deploy hands-on review of the new quant screens | Light | DoD-12 + DoD-14 (4 rows of the 6-dim rubric) marked pending. Mobile viewport + keyboard-only + screen-reader spot-check on the Vercel preview. |
| 3 | **(New from session 105)** Address deferred items if they accumulate further | Medium | focus-visible CSS module, roving tabindex on BucketPicker, SkipScreenButton extraction, update-helper hook extraction — would group naturally into a "quantitative-screens-polish" slice if a 4th quant screen ships. |
| 4 | **(New from session 105)** TDD-guard category-awareness fix | Light | Hook should honor CLAUDE.md §"Slice categories" matrix and skip on prototype paths. Worth a control-change-label slice. |
| 5 | **(New from session 105)** §Status awk-strip pattern fix | Light | Either fix the awk regex to actually accept `§?` as optional, or update CLAUDE.md to document `## §Status` as the required literal. Worth a control-change-label slice. |

**Recommended:** P2 (preview-deploy hands-on review) — lightest follow-on; closes DoD-12 + DoD-14 properly. P1 (desktop) and P4/P5 (rigour hook fixes) are medium-effort options.

## Session 105 metrics

- **Lines added:** ~1,549 (PR diff total).
- **Lines deleted:** ~5.
- **Tests added:** 11 component tests (29/318 → 29/329 total in proto-pre-signup suite).
- **CI checks at merge:** ~24 / 25 green (1 stale failure entry from pre-body-update run).
- **Auto-review rounds:** 2 (round 1 request-changes, round 2 nit-only).
- **Findings addressed:** 3 fixed in-PR + 6 deferred-with-reasoning.
- **AskUserQuestion rounds:** 3 (priority + partition+transition + pill-behavior).
- **Session churn (this CLAUDE.md session):** ~1,580L author time across kickoff + audit cycle.
- **PR shipped:** #204 (squash-merged as `64918d9`).

## Recurrence-watch (carried + new)

Carried 22 items from session 104. New observations this session:

- **TDD-guard hook not category-aware.** `.claude/hooks/tdd-first-every-commit.sh` blocks any src/ commit without tests/ co-commit regardless of slice category. CLAUDE.md §"Slice categories" §"prototype" matrix says "TDD-guard skips" for prototype, but the hook doesn't honor that. Workaround: add a meaningful test assertion alongside the src/ change. One-session-observed; promote to numbered constraint if a second session confirms.
- **`§Status` awk-strip works only with literal `## §Status`, not `## Status`.** CLAUDE.md documents the exemption pattern as `^## §?Status` (§ optional). Testing in this session confirmed `## Status` does NOT match `^## §?Status` due to awk's multi-byte-char `?` quantifier quirk. Workaround: use `## §Status` (with § prefix) explicitly. Doc-vs-impl mismatch; one-session-observed.
- **PR body edits don't re-run all CI workflows.** Workflows triggered on `pull_request:opened/synchronize` (e.g. pr-dod.yml) don't fire on `pull_request:edited`. Body-only fixes for CI-readable PR-body checks create a misleading state where the stale failure stays in the check-runs list alongside the new success. One-session-observed.

Carried as still-active recurrence-watch from session 104:

- `spec-citation-quote` same-PR replacement edge case (one-session-observed → no recurrence this session; stays one-session)
- Sibling spec discrepancy batching at AC freeze (one-session-observed → repeated this session as the prevention pattern; **promote to numbered constraint at session 107 if a third session demonstrates the prevention pattern**)
- Author-time comment-review stub missing AC refs in test `describe` strings (one-session-observed → did not surface this session because session-104 retro lesson "test descriptions are behavioural, not AC-numbered" applied)

Second-session-observed (carried from session 103, repeated session 104):

- `spec-citation-quote` author-time stub vs CI gate strictness — **DID NOT recur this session**. Stub and CI both clean. Stays second-session-observed; could be downgraded if session 106 also stays clean.
