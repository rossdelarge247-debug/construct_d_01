# Session 108 Pre-flight Context Block (carrying session 107 wrap delta)

## Session 107 wrap delta — read this first

Session 107 made two scope decisions and shipped one slice.

**Scope decision 1 — P1 deferred to system-wide post-prototype-lock-down.** Per-prototype-slice 6-dim preview-deploy rubric exercises (reduced-motion · mobile viewport · screen-reader · console-error check) defer to a single system-wide accessibility + responsive + screen-reader pass once the prototype journeys lock down. Reasoning: prototype journeys still in flux; interest-payment quality work compounds badly when applied per-slice across an iterating prototype. Future prototype slices' DoD-4 + DoD-14 inherit this deferral by reference. Recorded in commit `f59aa3f`.

**Scope decision 2 — P3 active (all-4 bundle).** User chose the full P3 bundle (4 deferred items from session-105 auto-review) over #3+#4-only or two-slice partition.

**Slice shipped — `S-PROTO-quantitative-screens-polish`** via PR #209 (open at wrap; will squash-merge to main pending auto-review verdict). Category `prototype` (path-default for `src/app/dev/proto/**`).

| AC | Deliverable | Net LOC |
|---|---|---|
| AC-1 | `SkipScreenButton` extraction + 3-screen integration | -48 / +28 |
| AC-2 | `useQuantitativeUpdate` hook extraction + 3-screen integration | -12 / +9 |
| AC-3 | Shared `:focus-visible` CSS module (1 file, anti-DRY pivot from 4) + 4-component className wiring | +5 |
| AC-4 | Roving tabindex on `BucketPicker` (WAI-ARIA radiogroup convention) | +63 / -18 |
| AC-5 | 12 new tests + 11 prior tests regression-clean | +147 / -18 |

**Verification:** 330/330 proto suite green; tsc clean; lint clean on touched files (16 pre-existing warnings in O1-O8 / o7.ts / o8.ts untouched per surgical-changes discipline); 0 new eslint-disable comments; security checklist short-form per prototype category.

**Detailed retro captured in `docs/HANDOFF-SESSION-107.md`** — 1 mid-impl AC amendment (AC-3 4 modules → 1 shared, anti-DRY pivot); 2 verification.md hook flags caught + fixed pre-commit (session-N provenance + per-spec-N citation without proximate quote); commit lineage f59aa3f → 77e27bb → 6090aaf → a42209f → 669ff65 → cd50a28 → 3640e73.

## Session 108 priorities — user picks scope

P3 closed; P1 deferred-but-active (until system-wide pass); P2 still blocked.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **(Inherited from sessions 101-107)** Desktop graceful enhancement — Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px | Heavy | Yes (Help Rail spec ref still pending — would need a scoping design phase before AC freeze) |
| 2 | **(Deferred long-form from session 107)** System-wide preview-deploy + accessibility pass | Single comprehensive sweep covering all prototype slices once journeys lock: 6-dim rubric exercises across O1-O8 + Q-bridge + O6.5/6.6/6.7 + dashboard surfaces; WCAG audit; responsive breakpoints; screen-reader walk | Heavy | Yes (gated on prototype-journey lock-down; not actionable yet) |
| 3 | **(New)** Anything fresh — user-directed work | Varies | n/a |

**Recommended:** P1 only becomes actionable if the user scopes a Help Rail spec at session start. Otherwise pick P3 (user-directed). The recurring backlog of "quant-screens polish" items is now closed; the next polish bundle would surface from a new auto-review at PR #209 review or from a future src/ slice.

### P1 detail — Desktop graceful enhancement (Heavy, blocked)

**Slice candidate:** TBD — Help Rail integration is the headline; spec ref still pending per sessions 101→107 carry-over.

**Spec anchors:**

- *(pending)* — locate or scope a Help Rail spec at session start.
- `src/components/document-shell/` — existing scaffold (3 files: DocumentShell.tsx + index.ts + types.ts).
- `docs/workspace-spec/71-rebuild-strategy.md` §4 — hexagonal architecture reference shape.

**First actions at session start:**

1. `grep -rn "help.rail\|HelpRail" docs/workspace-spec/` — locate Help Rail spec.
2. If no Help Rail spec, scope a design phase first before AC freeze (AskUserQuestion round on visual + interaction shape).

**Spec-gate check:** Help Rail spec absent at session-107 wrap; pre-condition unchanged from sessions 101-107 carry-forward.

### P2 detail — System-wide preview-deploy + accessibility pass (Heavy, blocked)

**Slice candidate:** `S-INFRA-system-wide-a11y-pass` or `S-PROTO-system-wide-rubric-sweep` (name TBD).

**Pre-condition (the P1 deferral note from session 107):** prototype journeys locked down. Until lockdown, this work would create churn against shifting surfaces.

**Scope when actionable:** single comprehensive 6-dim rubric exercise covering all prototype slices' preview-deploys; WCAG audit on all interactive components; responsive breakpoint review (intermediate breakpoints + extra-space above 480px); screen-reader walk (NVDA + VoiceOver) across the full pre-signup-interview flow + dashboard surfaces.

**First actions when picked up:**

1. Confirm prototype journeys are locked down (no pending scope changes to O1-O8 / Q-bridge / O6.5/6.6/6.7).
2. Decide partition: single mega-slice vs phased (e.g. accessibility-only → responsive-only → SR-only).
3. Scope per spec 72a + spec 72 §11.

## Scoping-discipline observations carried as recurrence-watch (27 items)

**Session 107 applied:**

- Verify before planning — pre-priority verifications (Vercel preview URL, PENDING grep count, shipped-artifact ls) all cleared at turn 0; the 4 PENDING hits turned out to be in §Status retro section, not the rubric rows themselves — surfacing this nuance saved a misdirected debug round.
- Quote, don't paraphrase — spec-citation triggers caught at author-time hook (verification.md draft pre-commit); rephrased to doc-pointers (CLAUDE.md §"Engineering conventions") rather than fabricating a quote.
- Plan-vs-spec cross-check — re-read CLAUDE.md §"Coding conduct" before each AC commit; mid-impl AC-3 pivot from 4 modules → 1 shared was a direct application (DRY trumps the AC's literal file-count when impl reveals the duplication).

**New observations this session (one-session-observed; promote to numbered constraint if a second session repeats):**

- **AC mid-impl amendment for anti-DRY refactor.** AC-3 originally committed to 4 byte-identical per-component CSS modules (BucketPicker / MultiPicker / ExpansionToggle / SkipScreenButton, each with the same `.focusable:focus-visible` rule). At impl time, the duplication became obvious — pivoted to 1 shared `focus-visible.module.css` and amended the AC + D-5 + verification.md text in lockstep. Pattern: when AC commits to file-count-driven structure that impl reveals as byte-identical duplication, the amendment is cheaper than the duplication. One-session-observed.
- **verification.md hook flags on session-N provenance + per-spec-N citation.** Two PostToolUse:Write hook flags surfaced at the verification.md draft pre-commit:
  - Provenance "session 107" (temporal session-N reference outside §Status block)
  - "per spec 72d §3" (spec citation trigger without proximate verbatim quote)
  Both were diagnosed via the hook's stderr messages and fixed by rephrasing to doc-pointers (drop the session attribution; cite CLAUDE.md §"Engineering conventions" instead of `per spec 72d §3`). Both fixes were 1-for-1 line replacements. Pattern: verification.md should be drafted with doc-pointers from the start; reserve `per spec NN` for §"Spec sources" sections where the verbatim quote is co-located. One-session-observed.

**RESOLVED session 107** (no longer on watch — exercised this session and the prevention pattern held; OR did not exercise but the new observation supersedes):

- ~~None resolved this session — all session-106 entries remain on watch.~~

**Second-session-observed (carried from session 104, repeated session 105 in the prevention shape; sessions 106 + 107 did not exercise the multi-spec AC freeze pattern, so neither promoted nor reset; promote to numbered constraint at session 108+ if a third session demonstrates the prevention shape):**

- **Sibling-spec-discrepancy batching at AC freeze.** Session 104 surfaced as a missed-opportunity (D-6 property_equity silently-decided); session 105 applied as prevention (D-5/D-6/D-7/D-9 group surfaced and silent-decided at AC scoping, before any PR-review round); sessions 106 + 107 did not exercise (single-spec slices).

**Second-session-observed promotion eligible (carried from session 103, now repeated at session 106; sessions 107 did not exercise):**

- **`spec-citation-quote` author-time stub vs CI gate strictness.** Session 103 surfaced this; session 106 confirmed it again (3 acceptance.md hits caught at CI not at author-time hook). Session 107: author-time hook caught the verification.md hits before commit (stub matched CI strictness on this specific surface). Stays second-session-observed; promote at session 108+ if a third stub-vs-CI miss recurs.

**Carried unchanged from session 106 (3 entries):**

- **Bracket-glob shellspec gotcha.** Did not exercise (no shellspec changes session 107).
- **Indented-blockquote escape via doc-pointer.** Did not exercise (no blockquote-under-list patterns added).
- **AC-vs-impl-path drift.** Did not exercise (AC referenced files that all landed at their expected paths).

**Carried unchanged from session 105:**

- PR body edits don't re-run all CI workflows (one-session-observed; did not recur session 106 or 107)

**Carried unchanged from session 104:**

- `spec-citation-quote` same-PR replacement edge case (one-session-observed → no recurrence; stays one-session)
- Author-time comment-review stub doesn't catch AC refs in test `describe` strings (one-session-observed → did not surface sessions 105/106/107)
- AC-impl cross-check at impl-time
- Sibling-wrapper diff at impl-time
- Shared-infrastructure audit at refactor-time
- In-PR scope-expansion confirmation gate
- `git push --force` after amend
- verification.md PARTIAL internal contradiction
- Read-cap accumulation during sweep cycles
- Single-lens audit framing
- Pre-existing provenance opportunistic cleanup at paragraph rewrite
- Audit findings need active-spec cross-reference at audit time
- Pre-existing CI noise should be queued, not deferred indefinitely
- Post-batch §Status sweep inline with finding-impl slice
- Documentation-meta-loop on guard-rule prose
- Skip-walk + structured retro pattern (from session 100)
- Test-description provenance anti-pattern (from session 101)
- Severity-tier collapse with strict user (from session 101)
- Per-batch test cascade pattern (from session 101)
- Audit-walk regex coverage (from session 102; one-session-observed)
- Mid-flight scope-expansion gate worked cleanly (from session 102; one-session-observed)
- Spec-only sessions don't increment v3b persona retain/drop counter (from session 103; one-session-observed)

## Authoritative reading order at session 108 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-107.md` (session 107's retro — P3 ship + P1 deferral + 2 new recurrence-watch entries).
3. `docs/HANDOFF-SESSION-106.md` (session 106's retro — hook-fixes slice; useful context for prototype-rigour calibration).
4. **For P1 (desktop graceful enhancement):** Help Rail spec ref pending — locate or scope at session start.
5. **For P2 (system-wide a11y pass):** confirm prototype journey lockdown precondition; scope per spec 72a + spec 72 §11.

## Session 108 kickoff prompt (paste-ready)

```
Kick off session 108.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch.
- Session 107 wrap squash-merged P3 (S-PROTO-quantitative-screens-polish)
  via PR #209. Verify state via `git log --oneline origin/main | head -3`
  if uncertain.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-107.md.
3. docs/HANDOFF-SESSION-106.md (for prototype-rigour calibration context).

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For P1 (desktop graceful enhancement, still blocked):
- Spec-gate check:
  `grep -rn "help.rail\|HelpRail" docs/workspace-spec/` → Help Rail
  spec ref still pending. If no spec exists, scope a design phase
  BEFORE AC freeze.

For P2 (system-wide a11y pass, still blocked):
- Prototype-journey-lockdown check: confirm no pending scope changes
  to O1-O8 / Q-bridge / O6.5/6.6/6.7. If any pending, P2 stays blocked.

Confirm priority with user. SESSION-CONTEXT recommends asking the
user for direction — both standing priorities remain blocked; P3 is
closed.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Pre-signup-interview prototype: **12 screens** on main (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) with shared chassis primitives (TopBar / Hero / Footer) + density-entry + density-question + delight (spec-26 compliance) + output-reassurance + 4-categorical-dim + 3-quantitative-dim adaptive plan + tone-pass + 14-finding cross-screen tone audit Phase 1 + 42-string copy-resolver-completeness sweep + primaryCTA wire + invariant test (session 102, PR #200) + spec 65b drafted (session 103, PR #201) + plan-engine hooks for 3 numeric-derived dimensions (session 104, PR #202) + UI for the 3 new pre-signup screens + Q-bridge (session 105, PR #204 merged as `64918d9`). Two existing hooks prototype-awareness-fixed session 106 (PR #207 merged as `2a72185`). P3 polish bundle landed session 107 via PR #209 — `SkipScreenButton` extraction + `useQuantitativeUpdate` hook + shared `:focus-visible` CSS module + roving tabindex on BucketPicker. The user-visible flow + the cross-component a11y polish for the 3 quant screens are now complete on main; full system-wide a11y/responsive/SR pass deferred to post-prototype-lock-down.

## Branch

Session 108 branch: harness-suffixed off clean main, OR scope-named sub-branch.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 107.** Twenty-seven scoping-discipline observations on recurrence-watch (2 new session 107 — AC mid-impl amendment for anti-DRY refactor; verification.md hook flags on session-N provenance + per-spec-N citation; both one-session-observed). Sibling-spec-discrepancy batching (carried session-104→107) eligible for promotion at session 108+ if confirmed.

**Active pre-existing CI failures (carry forward):**

- Session 107 wrap state TBD — auto-review on PR #209 fires at PR open + first synchronize. Verdict + finding triage land in `docs/slices/S-PROTO-quantitative-screens-polish/verification.md` §"Auto-review responses" at PR-review time.
- 16 pre-existing ESLint warnings in O1.tsx / O2.tsx / O3.tsx / O8.tsx / o7.ts / o8.ts (unused-vars). All pre-existing from prior sessions; not regressions from session 107. Per CLAUDE.md §"Surgical changes" — left untouched this session.

## Scope ceiling

Session 108 is most likely **P1 (desktop graceful enhancement — Heavy + blocked), P2 (system-wide a11y pass — Heavy + blocked), or P3 (user-directed)**. Both standing priorities remain blocked at session 107 wrap. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 12 screens (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) on main. Shared chassis primitives + density-entry + density-question + delight compliance + output-reassurance + 4-categorical + 3-quantitative adaptive plan all merged. Density + delight + output-reassurance audit findings closed (10 of 10). Cross-screen tone audit Phase 1 closed (14 of 14, session 101). Copy-resolver-completeness sweep + primaryCTA wire + invariant test merged (session 102, PR #200). Spec 65b drafted (session 103, PR #201). Spec 65b plan-engine layer landed (session 104, PR #202). UI for the 3 new pre-signup screens + Q-bridge merged session 105, PR #204 as `64918d9`. Two hook fixes (prototype path-default + §Status awk) merged session 106, PR #207 as `2a72185`. P3 polish bundle (SkipScreenButton + useQuantitativeUpdate + focus-visible + roving tabindex) shipped session 107 via PR #209.
