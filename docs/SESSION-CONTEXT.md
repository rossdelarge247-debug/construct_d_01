# Session 88 Pre-flight Context Block (carrying session 87 wrap delta)

## Session 87 wrap delta — read this first

Session 87 shipped one slice driving the largest single-PR cross-screen refactor of the canvas-as-source migration so far.

**PR #153 — `S-PROTO-o1-canvas-as-source · impl (AC-1..AC-6) (#153)`** — squash-merged to main as `2a2a971`. Seven commits across five auto-review rounds, ending on `approve`:

- `e39e4ae` slice impl (AC-1..AC-5) — O1 page IS the canvas: BrandBar + bespoke TopBar (Home + ProgressPill) + Hero + native `<fieldset>` + radio cards + sticky-CTA footer. Stage union rename `'considering'|'starting'|'in-process'` → `'thinking'|'decided'|'in_process'` across `lib/types.ts` + `lib/build-plan.ts` + `lib/copy/o1.ts` + O2 fallback default. 13 unit tests.
- `f8cf27b` round-1 — auto-review's 8 findings addressed: AC-2 heading wired through `getCopy` via `O1Heading { pre, italic, tail }` split-struct; AC-5 stagger unified via `--stagger-index` custom property; motion-fragile inline transition moved to `.cta` CSS class; AC-1 sticky CTA deferred (canvas uses flex-col, not `position: sticky`); WHAT-narration CSS comments stripped; nitpick fixes.
- `b5f733e` — `ProgressPill` visual re-skinned `STEP X / Y` (mono uppercase 0.08em letter-spacing); DOM textContent + aria-label preserved.
- `8ae2dab` AC-6 in-PR cross-screen chassis unification (user-authorised mid-PR scope expansion). Four sub-ACs: shared `Arrow.tsx` extracted (canvas-faithful shaft+arrowhead); `ProgressPill` canonical step indicator across all 8 screens (O2's local `StepRail` deleted); `ScreenShell` footer chassis matches O1 (cream `rgba(245,245,244,0.85)` + `blur(8px)` + trust band default + inline arrow button); `ScreenShell` outer per-section padding. `PrimaryCTA` deleted. 158 insertions / 148 deletions across 7 files.
- `62bdb97` + `3ba66c2` — touch-target a11y back-and-forth: restored 44×44 on ScreenShell Back, then reverted to match O1/O2 visual after user preview-deploy observation ("03 still different"). 44×44 deferred to production graduation with resolution recipe in `verification.md` §"Architectural deferrals". `3ba66c2` also updated O2 footer chassis to match O1's cream background (was white-ish 0.6 alpha).
- `ae803c1` — preview-deploy 6-dim rubric filled with evidence: 5 code-derived (RTL tests + CSS @media + native semantics) + 2 visual eyeball.

**Auto-review trajectory.** `request-changes` (round-1, 8 findings, 0 blocking) → `approve` (round-2 onward, advisory findings only). Five `approve` verdicts in a row across the iteration; `block` never reached.

**Cross-screen visual unification verified at preview-deploy.** User eyeball confirmed: BrandBar identical · same outer 480 cap · same px-5 pt-4 pb-3 header rhythm · ProgressPill in `STEP X / Y` mono uppercase across all 8 screens · same right-spacer width · footer chassis identical (cream + blur + trust band or caption + dark pill button with right-arrow strokeWidth=2).

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-87.md`** — read for the round-by-round narrative, the AC-6 scope-expansion rationale, the first 3-src-slice cohort persona retain/drop verdict (all 5 reviewer personas retained), and the two scoping-discipline observations on shared-infrastructure audit-at-refactor-time + in-PR scope-expansion confirmation gate.

## Session 88 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Continue canvas-as-source migration of O3-O8** | Six screens remaining. Order suggestion: batch O3+O4+O5+O6 if frames are sufficiently similar at scope-time (all A1-style chip-card layouts per session-86 retro framing), then O7 (your plan — different shape) and O8 (what's next — different shape) as separate slices. Each slice follows the S-PROTO-o1 + AC-6 template now established: canvas-as-source screen drops `ScreenShell` wrap; uses shared `Arrow` + `ProgressPill` + footer chassis (cream `rgba(245,245,244,0.85)` + `blur(8px)` + trust band or caption + dark pill button with right-arrow strokeWidth=2); canvas-fidelity persona stays dormant (no `Linked canvas:` field). | Medium per slice (~150-300L per screen) — possibly heavier if batched. | No |
| 2 | **Desktop-enhanced graceful enhancement (still deferred per constraint #41)** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html` is the cross-canvas reconciliation target. Help Rail integration + intermediate breakpoints + extra-space utilisation above the 480px mobile cap. | Heavy | Yes — open per constraint #41 once all 8 screens are canvas-as-source migrated (i.e. after P1) |
| 3 | **Production graduation backlog (parked across `verification.md` §"Architectural deferrals")** | Two items so far: AC-1 sticky CTA mechanism (true `position: sticky` + safe-area-inset + shorter-than-667 viewport hardening) · 44×44 touch target on `ScreenShell` Back (negative-margin or invisible hit-area extender to maintain canvas-faithful visual + meet AAA). Bundle into a single production-graduation pass when the pre-signup flow exits `/dev/proto/`. | Medium | No, but premature until production graduation timing is decided |
| 4 | **(Inherited) spec-citation-quote-check author-time hook** | Mirror `.claude/hooks/comment-review.sh` PostToolUse Write\|Edit advisory exit-0 pattern. Catches "per spec X" without proximity quote at edit time, before the CI cycle. Small standalone PR. | Light (~50L bash + shellspec) | No |
| 5 | **(Inherited) Comment-review hook §Status exemption fix** | Stub-mode hook flags "session X" provenance inside `## Status` blocks where CLAUDE.md `^## (§)?Status` exemption should apply. | Light (~20-30L bash) | No |
| 6 | **(Inherited) Spec 65 amendment for quantitative profiling data** | Still parked. | Heavy | No |

**Recommended sequence:** P1 first — the cross-screen chassis pattern is established (AC-6 from session 87), so each O3-O8 slice is now a known template-instantiation effort rather than a novel design decision. P1 unblocks P2 (desktop enhancement). P3 bundles for production graduation, no urgency. P4-P6 are tractable side-quests but not on the critical path.

**Scoping-discipline observations carried from session 87 (not yet numbered constraints, watch for recurrence):**

- **Shared-infrastructure audit at refactor-time.** When rewriting a shared component (`ScreenShell` session 86 + session 87) or extracting one (`Arrow.tsx` session 87), enumerate the prior implementation's guarantees (a11y minimums, focus-visible behaviour, width caps, semantic-attribute coverage) and carry each forward or document the deferral. Both sessions hit a regression-class via this gap.
- **In-PR scope expansion confirmation gate.** When user authorises expanding a slice's scope mid-PR (AC-6 in session 87), document the expansion atomically in `acceptance.md` + `verification.md` with the user-direction provenance verbatim so reviewer personas see the rationale at the same time as the diff. Worked well in session 87 (`8ae2dab` provenance line); worth preserving as a routine.

## Authoritative reading order at session 88 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-87.md` (last session's retro — O1 canvas-as-source + AC-6 cross-screen unification + persona cohort verdict).
3. **For P1 (when chosen):** `docs/design-source/pre-signup-interview/decoded/o3-your-ex-and-safety-expressive.html` (and the equivalent `o4`/`o5`/`o6`/`o7`/`o8` files) — large decoded canvas HTML, grep first for `MobileFrame` def + targeted offset+limit reads of the mobile-frame state.
4. **For P1 (cross-screen pattern reference):** `src/app/dev/proto/pre-signup-interview/screens/O1.tsx` + `src/app/dev/proto/pre-signup-interview/components/{Arrow,ProgressPill,ScreenShell}.tsx` — the established canvas-as-source + cross-screen chassis pattern from PR #153. New slices instantiate this template.

## Session 88 kickoff prompt (paste-ready)

```
Kick off session 88.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state (current branch +
  HEAD vs origin/main + ahead/behind + tree state).
- Branch convention: harness-suffixed (claude/<scope>-XXXXX).
  Session 87 shipped PR #153 (S-PROTO-o1-canvas-as-source +
  AC-6 cross-screen chassis unification) squash-merged to main as
  2a2a971. Session 87 wrap PR pending or just-merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-87.md.
3. CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype
   default)" — the 5-step adapt pattern. Plus §"Visual direction"
   §"Preserve-and-rebuild" for context on which dimensions to
   carry into the canvas-as-source rewrites (post session-87
   AC-6, the cross-screen chassis is the canvas-as-source
   reference, not ScreenShell).

Confirm priority with user. SESSION-CONTEXT recommends P1
(continue canvas-as-source migration of O3-O8). The cross-screen
chassis pattern is established (AC-6 in PR #153): shared Arrow +
ProgressPill + footer chassis (cream rgba(245,245,244,0.85) +
blur(8px) + trust band or caption + dark pill button). Each O3-O8
slice instantiates this template against its own canvas frame.

Frame source per screen:
- O3: docs/design-source/pre-signup-interview/decoded/
  o3-your-ex-and-safety-expressive.html (MobileFrame state).
- O4: o4-employment-complexity-expressive.html.
- O5: o5-partner-finances-expressive.html.
- O6: o6-what-matters-to-you-expressive.html.
- O7: o7-your-plan-expressive.html.
- O8: o8-whats-next-expressive.html.

Each large + CSS-heavy — grep for MobileFrame def first, then
targeted offset+limit reads of just the mobile-frame state.

Batching consideration: O3+O4+O5+O6 are all A1-style chip-card
layouts per session-86 retro framing. If frames are sufficiently
similar at scope-time, consider batching as one slice
(S-PROTO-o3-to-o6-canvas-as-source). O7 (your plan) and O8 (what's
next) have different visual shapes and warrant separate slices.

Slice convention: no `Linked canvas:` field (canvas-fidelity
persona stays dormant per the prototype default). **Category:**
prototype. Per-AC evidence cites the canvas inline. State rename
pattern from session 87 is locked in `lib/types.ts` already —
new screens just consume the existing Stage / SituationAnswers /
etc. unions.

Definition of Done (per CLAUDE.md §"Definition of Done"):
- Slice acceptance.md + verification.md per the prototype category
  short-form (items 1, 8, 12, 14 of the 14-item checklist).
- Tests written + passing where tractable.
- Auto-review verdict: approve / nit-only on the impl PR (3
  specialist personas: security, prototype-readiness, style).
- Preview-deploy verified in-browser per spec 72a 6+1 dimension
  rubric (golden path · edge cases · prefers-reduced-motion ·
  keyboard-only · mobile viewport 375×667 · screen-reader · cross-
  screen consistency).
- User feedback received + addressed (or explicitly deferred).

Scoping-discipline carried from session 87:
1. Shared-infrastructure audit at refactor-time. If a slice
   touches ScreenShell, Arrow, ProgressPill, BrandBar, or any
   other shared chrome, enumerate the prior implementation's
   guarantees (a11y minimums, focus-visible, width caps, semantic
   attributes) and carry forward or document the deferral.
2. In-PR scope expansion confirmation gate. If user authorises
   expanding a slice's scope mid-PR, document atomically in
   acceptance.md + verification.md with user-direction provenance
   verbatim.

Workflow: scope-time audit → build → preview-deploy → user
feedback → iterate. Don't pre-spec visual treatment for prototype
screens (constraint #40). Webhook-driven iteration loop (subscribe
to PR activity, no polling) worked well in session 87 — preferred
pattern for review-cycle management.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 88 branch: harness-suffixed off clean main. Session 87 shipped PR #153 (slice impl + AC-6 cross-screen unification) + the session-87 wrap PR. Session 87 working branches deletable post-merge.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new constraints surfaced session 87.** Two scoping-discipline observations (shared-infrastructure audit at refactor-time + in-PR scope-expansion confirmation gate) carried forward as recurrence-watch — see "Scoping-discipline observations" above. They earn numbered-constraint status if a third session surfaces a similar regression.

## Scope ceiling

Session 88 is most likely P1 (continue canvas-as-source migration of O3-O8) alone, possibly batched (O3+O4+O5+O6 as one slice if frames support). Out of scope unless explicitly added: P2 (desktop-enhanced graceful enhancement — needs all 8 screens migrated first) · P3 (production graduation backlog — premature) · P4-P6 (inherited tractable side-quests) · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
