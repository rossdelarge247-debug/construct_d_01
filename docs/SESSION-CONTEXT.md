# Session 91 Pre-flight Context Block (carrying session 90 wrap delta)

## Session 90 wrap delta — read this first

Session 90 shipped two slices, completing the canvas-as-source migration for all 8 pre-signup interview screens. **The full canvas-as-source surface is now on main — O1 through O8.**

**PR #161 — `S-PROTO-o7-canvas-as-source · impl (AC-1..AC-5)` — squash-merged as `0dca636`.** Heavier slice than O5/O6: two sub-states (MobileGenerating with BreathingHalo + 5-step progressive disclosure + literal CLAUDE.md "warm hand on a cold day" attribution → MobileReady with TopBar + Hero + 6 content sections data-bound to `buildPlanFromAnswers` + sticky dual-CTA PlanFooter). Canonical canvas decision: `o7-plan-page.jsx` (not `o7-page.jsx`) because the MobileGenerating state literally invokes the product positioning phrase. Auto-review trajectory: round-1 `request-changes` → round-2 `approve` → round-3 `approve` (unanimous across k=1/k=2/k=3 after populated-notes test added in round-2).

**PR #162 — `S-PROTO-o8-canvas-as-source · impl (AC-1..AC-6)` — squash-merged as `a24f5880`.** Exit screen with 4 legitimate exit paths under A1·B2·C1 (equal weight · plan-recall chip · no empty-state default). Round-1 was a real `block` — 3 unanimous-across-quorums blocking findings, all AC-impl gaps I wrote myself: `<button>` Back vs AC-1's `<a>` link; `<div role="radiogroup">` + `<button role="radio">` vs AC-4's native `<fieldset>` + `<input type="radio">`; missing keyboard arrow-key handler that AC-6 promised as "native behaviour". All three fixed in round-1 response — native radios resolve the keyboard issue automatically — plus contrast + naming nits. Round-2 verdict `approve` (4 findings: 3 praise confirming fixes, 1 deferred tap-target).

**Mid-session strategy pivot (user-directed):** after O7 merged with "a few small visual issues" deferred, the user proposed *"how 'BOUT WE JUST GET THE CANVASES built, and then we can reconcile feedback together?"* That switched the workflow from per-screen visual-fidelity feedback loops to batch-feedback-after-full-surface. Session 91 P1 is the homogenisation reconciliation pass.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-90.md`** — read for the round-by-round narrative, the canvas decision for O7, the O8 round-1 AC-impl-gap diagnosis, and the cumulative persona retain/drop verdict (all 5 retained, prototype-readiness most active).

## Session 91 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Cross-screen homogenisation audit + reconciliation pass** | Two-phase. **Phase 1 (Claude-solo, P0 of session 91):** pre-walk the 8 screens at `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`, catalogue inconsistencies as a scope-only audit slice (`S-PROTO-cross-screen-homogenisation-audit` — acceptance.md only, no impl) covering TopBar / Hero / Footer chassis · BrandBar usage · ProgressPill vs MobileTopBar mixed patterns · spacing / typography drift · cross-screen colour palette uses. **Phase 2 (joint, user-led):** user reviews the punch list, re-prioritises, drops false positives, adds items I missed. **Phase 3 (impl batches):** ship the agreed-on changes in batches scoped by chassis surface (e.g., one PR for TopBar harmonisation, one for Footer, etc.). Re-walk O7 first under Phase 1 to surface the "few small visual issues" the user flagged at PR #161 merge but batched. | Phase 1 medium (one focused session); Phase 2 light; Phase 3 medium-heavy depending on punch-list size | No |
| 2 | **Desktop-enhanced graceful enhancement** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Constraint #41 unblocked (all 8 mobile screens migrated). Order against homogenisation TBD — homogenisation likely first to stabilise the mobile surface that desktop will extend. | Heavy | No (now unblocked) |
| 3 | **Production graduation backlog** | Items parked across `verification.md §"Architectural deferrals"`: 44×44 tap targets (TopBar Back · Save · PlanFooter Back · TopBar Home · PlanRecall chip) · `100vh` → `100dvh` sweep · sticky CTA mechanism hardening · pending-disclosure contrast lift · INDIGO token reconciliation (canvas `#4338CA` vs existing `#4F46E5`) · token promotions for VIOLET_SOFT / MAGENTA_SOFT / SOFTMUTE / PAPER_WARM / ICON_BG_UNSELECTED. Bundle into a single production-graduation slice when pre-signup exits `/dev/proto/`. | Heavy | No, but premature until graduation timing decided |
| 4 | **(Inherited)** spec-citation-quote-check author-time hook | Mirror `.claude/hooks/comment-review.sh` PostToolUse Write\|Edit advisory exit-0 pattern. Catches "per spec X" without proximity quote at edit time, before CI cycle. | Light (~50L bash + shellspec) | No |
| 5 | **(Inherited)** Comment-review hook §Status exemption fix | Stub-mode hook flags "session X" provenance inside `## Status` blocks where CLAUDE.md `^## (§)?Status` exemption should apply. | Light (~20-30L bash) | No |
| 6 | **(NEW session 90)** Comment-review hook CSS-files regex tightening | The "round N" provenance regex matched `140ms` in CSS transition values twice this session (false positive in O7.module.css + O8.module.css). Either skip `*.css` files at the hook OR require enclosing context like "round X of" / "round X·" to fire. | Light (~10-20L bash + 1 shellspec case) | No |
| 7 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Still parked. | Heavy | No |

**Recommended sequence:** P1 first (homogenisation, user-driven). P2 (desktop) likely follows once homogenisation stabilises the mobile chassis. P3 (production graduation) bundles for the `/dev/proto/` exit moment. P4-P7 are tractable side-quests off the critical path.

**Scoping-discipline observations carried as recurrence-watch (not yet numbered constraints):**

- **AC-impl cross-check at impl-time** (NEW session 90) — re-read each AC's verbatim wording before pushing impl; grep impl for the structural elements named in AC. O8 round-1 shipped with 3 blocking findings that were direct AC-impl gaps written by me at scope-time. Promote to numbered constraint if a second slice surfaces a similar gap-class.
- **Sibling-wrapper diff at impl-time** (carried from session 88, two-session recurrence) — diff `<main>` style against sibling screen's wrapper before push. Not surfaced session 90.
- **Shared-infrastructure audit at refactor-time** (carried from session 87) — enumerate prior guarantees before extracting shared components. Not surfaced session 90.
- **In-PR scope-expansion confirmation gate** (carried from session 87) — document scope expansions atomically in slice docs. Not surfaced session 90.

## Authoritative reading order at session 91 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-90.md` (last session's retro — O7 + O8 ship + the user's strategy-pivot moment + O8 round-1 AC-impl-gap diagnosis).
3. **For P1 (when chosen):** walk all 8 screens on the Vercel preview deploy at `https://construct-dev.vercel.app/dev/proto/pre-signup-interview` (or per-PR preview if a homogenisation branch is open). User joint review — name the inconsistencies; I make the punch list.
4. **For P1 (cross-screen pattern reference):** `src/app/dev/proto/pre-signup-interview/screens/{O1,O2,O3,O4,O5,O6,O7,O8}.tsx` + `components/{Arrow,BrandBar,ProgressPill,ScreenShell}.tsx` — the canvas-as-source surface as it stands at session-91 start.

## Session 91 kickoff prompt (paste-ready)

```
Kick off session 91.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state (current branch +
  HEAD vs origin/main + ahead/behind + tree state).
- Branch convention: harness-suffixed (claude/<scope>-XXXXX).
- Session 90 shipped PRs #161 (O7, 0dca636) + #162 (O8, a24f5880)
  squash-merged to main. Session-90 wrap PR may be pending or
  just-merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-90.md.
3. CLAUDE.md §"Visual direction" + §"Coding conduct" (homogenisation
   work spans both — visual treatment + name-carries-the-design).

Confirm priority with user. SESSION-CONTEXT recommends P1 (cross-
screen homogenisation audit + reconciliation pass).

**Phase 1 — Claude-solo pre-walk audit (start here, no user prompt
needed):** walk the 8 screens at the preview URL below, catalogue
inconsistencies in a scope-only audit slice
(S-PROTO-cross-screen-homogenisation-audit — acceptance.md only,
no impl). Cover: TopBar / Hero / Footer chassis · BrandBar usage ·
ProgressPill vs MobileTopBar mixed patterns · spacing / typography
drift · cross-screen colour palette uses. Re-walk O7 first to
surface the "few small visual issues" the user flagged at PR #161
merge but batched.

**Phase 2 — joint review (user-led):** user reviews the punch list,
re-prioritises, drops false positives, adds items missed.

**Phase 3 — impl batches:** ship the agreed-on changes in batches
scoped by chassis surface.

All 8 screens live at:
  https://construct-dev.vercel.app/dev/proto/pre-signup-interview
  (navigate steps 1-8 via the in-flow CTAs)

Per CLAUDE.md §"AC-impl cross-check at impl-time" (NEW recurrence-
watch from session 90): before pushing any homogenisation impl, re-
read each AC's verbatim wording and grep impl for the structural
elements named in AC. O8 round-1 shipped with 3 blocking AC-impl
gaps I wrote myself; the discipline is to cross-check at impl-time
not review-time.

Definition of Done (CLAUDE.md §"Definition of Done", prototype
short-form items 1, 8, 12, 14 from spec 76 §3):
- Slice acceptance.md + verification.md
- Tests written + passing
- Auto-review verdict: approve / nit-only on impl PR (3 specialists)
- Preview-deploy verified across the spec 72a 6+1 dimensions
- User feedback received + addressed (or explicitly deferred)

Workflow: scope-time audit → user joint review → punch list → patch
batches → preview-deploy → user re-review → iterate. Webhook-driven
iteration loop (subscribe to PR activity, no polling) — established
pattern from sessions 87-90.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens; `tokens.color.accent.indigo` = `#4F46E5` added session 88 — note O7 canvas uses `#4338CA`, reconcile in production graduation) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 91 branch: harness-suffixed off clean main. Session 90 shipped PRs #161 + #162. The session-90 wrap PR (this commit's parent) is pending or just-merged. Session 90 working branches deletable post-wrap.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new constraints surfaced session 90.** Four scoping-discipline observations on recurrence-watch (AC-impl cross-check at impl-time — NEW session 90; sibling-wrapper diff — two-session recurrence; shared-infra audit; in-PR scope expansion confirmation). They earn numbered-constraint status if a third session surfaces a similar regression for any one of them.

## Scope ceiling

Session 91 is most likely P1 (cross-screen homogenisation reconciliation pass — user joint review of all 8 canvas-as-source screens). Out of scope unless explicitly added: P2 (desktop graceful enhancement — natural next after homogenisation lands) · P3 (production graduation backlog — premature) · P4-P7 (inherited tractable side-quests) · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) are canvas-as-source as of session 90 close.
