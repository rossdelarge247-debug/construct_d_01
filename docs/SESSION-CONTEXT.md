# Session 110 Pre-flight Context Block (carrying session 108 + 109 wrap deltas)

## Session 109 wrap delta — read this first

Session 109 closed the V4 + V5 Help Rail deferral the parent slice left behind.

**Slice shipped — `S-PROTO-help-rail-V4-V5`** via PR #212 (open at wrap; will squash-merge to main pending auto-review verdict). Category `prototype`.

| AC | Deliverable |
|---|---|
| AC-1 | `RailHuman.tsx` (V4) — three contact options + founder note + safety footer (999/REFUGE/Relate verbatim) |
| AC-2 | `RailHybrid.tsx` (V5) — tabbed wrapper; D-8 mid-impl amendment: V1/V2/V3/V4 each expose a `*Body` named export so V5 composes content inside its own rail container (parent-slice D-7 honoured in spirit; no nested-aside double-wrap) |
| AC-3 | `rail-constants.tsx` additive extensions (MAGENTA + tint + pill-green; ChatIcon/PhoneIcon/HeartIcon; option-row + tab-row + founder-note styles) |
| AC-4 | `HelpRailLayout.tsx` routes v4/v5 to live components; `RailDeferred` helper removed |
| AC-5 | +3 new smoke tests (RailHuman content; RailHybrid default tab; RailHybrid tab-switch); 2 amended integration tests for v4/v5 |

**Verification:** 14/14 on `help-rail.test.tsx`; 362/362 on proto + lib/dev suite; tsc clean; eslint clean on touched files. DoD-14 short-form cleared (prototype). Preview-deploy 6-dim rubric inherited deferral. Four architectural deferrals captured (opt-row hover · V5 tab arrow-key nav · V4 onClick wiring · D-2 canvas-literal compact V5).

**Detailed retro in `docs/HANDOFF-SESSION-109.md`.** Session 108 retro (back-filled at session 109 wrap) in `docs/HANDOFF-SESSION-108.md`.

## Session 108 wrap delta (back-filled at session 109 wrap)

Session 108 shipped `S-PROTO-help-rail-desktop-variants` via PR #210 (merged as `7cea128`) but skipped the wrap protocol — no `HANDOFF-SESSION-108.md` written, SESSION-CONTEXT.md not refreshed. Session 109 noticed at turn 0, reconciled against kickoff + git log, and back-filled `HANDOFF-SESSION-108.md` at this session's wrap. Pattern: wrap-protocol skipping is silent at the moment but costs the next session a doc-vs-truth reconciliation turn (recurrence-watch).

## Session 110 priorities — user picks scope

V4 + V5 was the last pending Help Rail scope change. P4 (system-wide a11y pass) is now UNBLOCKED.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **System-wide preview-deploy + accessibility pass** | Single comprehensive 6-dim rubric exercise across all prototype slices (O1-O8 + Q-bridge + O6.5/6.6/6.7 + 5 Help Rails + dashboard surfaces); WCAG audit on interactive components; responsive breakpoint review; screen-reader walk; absorbs the 4 session-109 architectural deferrals + 4 prototype-readiness deferrals from session 108 | Heavy | No (newly unblocked) |
| 2 | **Anything fresh — user-directed** | Varies | n/a | n/a |

**Recommended:** confirm at session 110 start that no new pending scope changes have landed (no pending O1-O8 / Q-bridge / O6.5-6.7 / Help Rail edits). If the prototype is still locked, P1 partition decision (single mega-slice vs phased: a11y-only → responsive-only → SR-only) is the first scope choice. If the user prefers smaller bites in session 110, do user-directed work and queue P1 for a dedicated session.

### P1 detail — System-wide preview-deploy + accessibility pass

**Slice candidate:** `S-INFRA-system-wide-a11y-pass` or `S-PROTO-system-wide-rubric-sweep` (name TBD).

**Pre-condition:** prototype journeys locked down. As of session 109 wrap, no pending edits to O1-O8 / Q-bridge / O6.5-6.7 / Help Rail are known. Confirm at session 110 start before treating P1 as authorized.

**Scope when actioned:**

1. 6-dim rubric exercise on each prototype slice's preview-deploy: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport · screen-reader. Per `docs/workspace-spec/72a-preview-deploy-rubric.md`.
2. WCAG 2.1 AA audit on all interactive components (focus indicators, color contrast, ARIA semantics).
3. Responsive breakpoint review — intermediate breakpoints + extra-space utilisation above 480px (the desktop-graceful-enhancement opens that were carried sessions 101-107).
4. Screen-reader walk — NVDA + VoiceOver — across the full pre-signup-interview flow + 5 Help Rail variants + Q-bridge + dashboard surfaces.

**Inputs (session-109 deferrals to absorb):**

- `opt-row` hover state (canvas L966) — inline-style limitation; needs CSS-module migration or React mouse handlers
- V5 (`RailHybrid`) tab keyboard arrow navigation — WAI-ARIA recommends arrow-key focus shift between tabs
- V4 option-row `onClick` handlers — three contact buttons are visual placeholders
- D-2 canvas-literal compact V5 tab content — held open for post-deploy team review

**Inputs (session-108 deferrals to absorb):**

- `aria-live="polite"` region conditional rendering (parent slice's prototype-readiness finding)
- Inline-style buttons without `:focus-visible` outline
- MUTE colour at 10.5px borderline against WCAG 4.5:1
- Suggested-buttons in `RailCoach` with `cursor: 'pointer'` without `onClick`

## Scoping-discipline observations carried as recurrence-watch (30 items)

**Session 109 applied:**

- Verify before planning — pre-priority verifications (rails directory ls, HelpRailLayout grep for V4/V5 routing, canvas access check, git log for session-108 wrap state) all cleared at turn 0.
- Quote, don't paraphrase — D-7 verbatim quoted before invoking it as a locked decision; B-extract design decision (D-8) added with full quoted D-7 context.
- Plan-vs-spec cross-check — re-read parent-slice D-7 + canvas literal before AC freeze; surfaced D-7-vs-canvas tension to user before drafting AC.
- Think before coding — surfaced the nested-aside double-wrap issue at impl time via AskUserQuestion rather than silent-deciding.

**New observations this session (one-session-observed; promote to numbered constraint if a second session repeats):**

- **D-7-style locked decisions sometimes don't survive impl.** Parent-slice D-7 ("V5 imports... as-is") didn't anticipate the nested-aside problem; required mid-impl Body-refactor amendment + AskUserQuestion. Pattern: locked-decision text written without impl-time validation has a non-zero chance of breaking. If a slice can run an architectural skeleton render before AC freeze, similar surprises shrink. One-session-observed.
- **Author-time hook regex coverage on sibling-step patterns.** The hook caught literal `Mirrors the parent` but not `Matches the parent slice's` / `Same disposition as the parent slice`. Two additional patterns slipped past the regex; rephrased proactively. The hook is a useful warning surface but is regex-tractable. One-session-observed; record as candidate for hook-regex expansion if recurs.
- **Stop hook + WIP-broken-state interaction.** Mid-refactor stop hook fired when only 4 of 5 rails had Body extraction done; committing then would have pushed broken state. Resolution: completed the atomic refactor first. Pattern: stop-hook prompts to commit are not absolute — finish the atomic refactor when WIP state is incoherent. One-session-observed.
- **Wrap-protocol skipping is silent at the moment but costs the next session a doc-vs-truth reconciliation turn.** Session 108 skipped wrap; session 109 turn 0 reconciled SESSION-CONTEXT-vs-kickoff before authorizing P1. Cost ~1 turn. One-session-observed; if recurs, promote to a numbered constraint or hook-enforced gate (e.g. SessionStart hook detects a stale-SESSION-CONTEXT scenario).

**Carried unchanged from session 107 (2 entries):**

- **AC mid-impl amendment for anti-DRY refactor.** Session 107 applied for the focus-visible 4→1 module pivot. Session 109 applied for the Body-extract D-8 amendment — second session-observed for this pattern, **eligible for promotion to numbered constraint at session 110+ if a third session demonstrates the prevention/application shape**.
- **verification.md hook flags on session-N provenance + per-spec-N citation.** Session 107 caught both at draft. Session 109 did not exercise the same patterns (verification.md drafted with doc-pointers from the start, no temporal provenance, no spec-N-without-quote). Stays one-session-observed.

**Second-session-observed (carried from session 104, repeated session 105 in the prevention shape; sessions 106 + 107 + 108 + 109 did not exercise the multi-spec AC freeze pattern, so neither promoted nor reset):**

- **Sibling-spec-discrepancy batching at AC freeze.**

**Second-session-observed promotion eligible (carried from session 103, now repeated at session 106; sessions 107 + 108 + 109 did not exercise):**

- **`spec-citation-quote` author-time stub vs CI gate strictness.**

**Carried unchanged from earlier sessions:**

- Bracket-glob shellspec gotcha (session 106)
- Indented-blockquote escape via doc-pointer (session 106)
- AC-vs-impl-path drift (session 106)
- PR body edits don't re-run all CI workflows (session 105)
- `spec-citation-quote` same-PR replacement edge case (session 104)
- Author-time comment-review stub doesn't catch AC refs in test `describe` strings (session 104)
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

## Authoritative reading order at session 110 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-109.md` (session 109's retro — V4+V5 ship + Body refactor + 4 new architectural deferrals + 4 new recurrence-watch entries).
3. `docs/HANDOFF-SESSION-108.md` (session 108's back-filled retro — parent Help Rail slice).
4. **For P1 (system-wide a11y pass):** confirm prototype-journey lockdown precondition; scope per `docs/workspace-spec/72a-preview-deploy-rubric.md` + spec 72 §11.

## Session 110 kickoff prompt (paste-ready)

```
Kick off session 110.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch.
- Session 109 wrap squash-merged S-PROTO-help-rail-V4-V5 via PR #212
  (or check `git log --oneline origin/main | head -3` if uncertain).
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-109.md.
3. docs/HANDOFF-SESSION-108.md (if calibration context useful).

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For P1 (system-wide a11y pass, newly unblocked):
- Prototype-journey-lockdown check: confirm no new pending scope changes
  to O1-O8 / Q-bridge / O6.5/6.6/6.7 / Help Rail (V1-V5) have landed
  since session 109 wrap. If any pending, P1 stays blocked.
- Inputs check: confirm the 4 session-109 architectural deferrals + 4
  session-108 prototype-readiness deferrals are listed in this file's
  P1 §"Inputs". If a deferral was independently addressed, drop it.

Confirm priority with user. SESSION-CONTEXT recommends P1 if the lockdown
holds; otherwise user-directed work.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

Pre-signup-interview prototype: **12 screens** on main (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) with shared chassis primitives (TopBar / Hero / Footer) + density-entry + density-question + delight (spec-26 compliance) + output-reassurance + 4-categorical-dim + 3-quantitative-dim adaptive plan + tone-pass + 14-finding cross-screen tone audit Phase 1 + 42-string copy-resolver-completeness sweep + primaryCTA wire + invariant test (session 102, PR #200) + spec 65b drafted (session 103, PR #201) + plan-engine hooks for 3 numeric-derived dimensions (session 104, PR #202) + UI for the 3 new pre-signup screens + Q-bridge (session 105, PR #204 as `64918d9`) + 2 hook prototype-awareness fixes (session 106, PR #207 as `2a72185`) + SkipScreenButton + useQuantitativeUpdate + focus-visible + roving tabindex polish bundle (session 107, PR #209 as `ef6ea66`) + Help Rail desktop variants infra + V1/V2/V3 rails (session 108, PR #210 as `7cea128`) + V4 RailHuman + V5 RailHybrid with `*Body` refactor (session 109, PR #212 pending). All five Help Rail canvas variants now live behind the dev variant toggle.

## Branch

Session 110 branch: harness-suffixed off clean main, OR scope-named sub-branch.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 109.** Thirty scoping-discipline observations on recurrence-watch (4 new session 109 — D-7-style locked decisions sometimes don't survive impl; author-time hook regex coverage on sibling-step patterns; stop hook + WIP-broken-state interaction; wrap-protocol skipping costs next session). AC mid-impl amendment for anti-DRY refactor now **second-session-observed**, eligible for promotion at session 110+.

**Active pre-existing CI failures (carry forward):**

- Session 109 wrap state: auto-review on PR #212 fires at PR open + first synchronize. Verdict + finding triage land in `docs/slices/S-PROTO-help-rail-V4-V5/verification.md` §"DoD" item 3 at PR-review time.
- 16 pre-existing ESLint warnings in O1.tsx / O2.tsx / O3.tsx / O8.tsx / o7.ts / o8.ts (unused-vars). All pre-existing from prior sessions; not regressions. Untouched this session per §"Surgical changes".

## Scope ceiling

Session 110 is most likely **P1 (system-wide a11y pass — Heavy + newly unblocked) or P2 (user-directed)**. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR (session 109's preview at PR #212).
- All 12 screens (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) on main. Shared chassis primitives + density-entry + density-question + delight compliance + output-reassurance + 4-categorical + 3-quantitative adaptive plan all merged. Help Rail desktop variants infrastructure + V1-V3 rails merged session 108 (PR #210 as `7cea128`). V4 RailHuman + V5 RailHybrid (with Body refactor of V1-V4) shipped session 109 via PR #212. All five Help Rail variants now live behind the dev variant toggle at `src/app/dev/control/page.dev.tsx`.
