# Session 109 Pre-flight Context Block (carrying session 108 wrap delta)

## Session 108 wrap delta — read this first

Session 108 shipped **S-PROTO-help-rail-desktop-variants** via PR #210 (squash-merged as `7cea128`). This is the long-blocked P1 (desktop graceful enhancement) — partially unblocked.

| AC | Deliverable | Net LOC |
|---|---|---|
| AC-1 | Variant manifest types + helpers under `src/lib/dev/variant-manifest.ts` + per-prototype manifest at `src/app/dev/proto/pre-signup-interview/variants.ts` | +60 |
| AC-2 | `VariantProvider` + `useVariant` / `useSetVariant` / `useResetVariant` hooks at `src/lib/dev/variant-context.tsx`; `useSyncExternalStore` pattern (CI-forced refactor mid-flight); URL > localStorage > default resolution | +143 |
| AC-3 | `/dev/control` dev surface at `src/app/dev/control/page.dev.tsx`; sibling to existing dev tools; mode-gated via `MODE !== 'dev'` early return | +204 |
| AC-4 | Three rail components extracted from canvas: RailGlossary (V1) · RailCoach (V2) · RailWhy (V3); V4 (RailHuman) + V5 (RailHybrid) render `RailDeferred` placeholders pending follow-up slice | +570 |
| AC-5 | `HelpRailLayout` wrapper + page.module.css `@media (min-width: 1280px)` rule; CSS-only breakpoint, no JS-side viewport detection | +101 |
| AC-6 | 34 new tests across 5 files; full suite 758/758 green; tsc clean | +250 |

**Detailed retro captured in `docs/HANDOFF-SESSION-108.md`** — 4 AskUserQuestion rounds (2 dismissed → re-framed; 2 answered); 1 mid-impl AC amendment (5 rails → 3 + 2 deferred placeholder at warn threshold); 1 CI-driven refactor (useSyncExternalStore); 2 auto-review rounds (10 findings → 4 actionables addressed + 4 deferred + 2 skipped).

**Scope decision — P1 partial unblock pivot.** Pre-session 108, P1 was carried 7 sessions as "Help Rail spec ref pending" — inherited framing from before the canvas-as-source pattern existed. Session 108 surfaced this: for prototype canvas-as-source, the canvas IS the spec. No separate written spec was needed; the slice shipped directly with `acceptance.md` citing the canvas path inline.

**4 a11y findings explicitly deferred** to the system-wide a11y pass (P4 below) — captured in `docs/slices/S-PROTO-help-rail-desktop-variants/verification.md §"Architectural deferrals"`.

## Session 109 priorities — user picks scope

P1 partially unblocked (V1/V2/V3 shipped; V4/V5 pending). P2 + P3 + P4 (renumbered) carry forward.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **(New from session 108)** S-PROTO-help-rail-V4-V5-rails — `RailHuman` + `RailHybrid` (tabbed across V1-V4) | Medium | No |
| 2 | **(Inherited from session 108)** Help Rail broader breakpoints — 480-1280px intermediate + extra-space above 1320px | Medium-Heavy | No |
| 3 | **(Inherited from session 108)** Public-site / marketing pages framework — extract design tokens from marketing-landing canvas, audit overlap with S-F1, scope responsive framework | Heavy | No (genuinely scopable) |
| 4 | **(Inherited)** System-wide a11y pass | Heavy | Yes (gated on prototype-journey lockdown) |
| 5 | **(New)** User-directed work | Varies | n/a |

**Recommended:** P1 (V4 + V5 rails) — closes the canvas-author's "5 deliberate takes" intent; single-session-sized; infrastructure already shipped; manifest already declares both IDs with placeholders that just need swapping for real components.

### P1 detail — S-PROTO-help-rail-V4-V5-rails (Medium, unblocked)

**Slice candidate:** `S-PROTO-help-rail-v4-v5-rails` (or similar)

**What's already in place:**
- Variant manifest declares `v4` (Talk to a human) + `v5` (Hybrid tabbed) options
- `HelpRailLayout` already routes both to `<RailDeferred label="...">` placeholders
- Canvas content + rail-constants module + 5-step light-adapt pattern all established
- Tests exist for V4/V5 placeholder rendering — will need updating to assert real components

**First actions at session start:**
1. Read canvas lines 1925-2090 (RailHuman + RailHybrid) — combined ~165 lines (under read cap)
2. Extract RailHuman + RailHybrid components following 5-step canvas-as-source per established pattern
3. Update `HelpRailLayout` to route to real components instead of placeholders
4. Update `help-rail.test.tsx` smoke tests
5. Ship

**Spec anchors:**
- `docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html` L1925-1982 (RailHuman) + L1983-2090 (RailHybrid)
- Pattern already established by `RailGlossary.tsx` / `RailCoach.tsx` / `RailWhy.tsx` (canvas-source-ref comment at file top + inline-style adaptation)

### P2 detail — Help Rail broader breakpoints (Medium-Heavy, unblocked)

**Scope:** Address the responsive viewport range below 1280px and above 1320px. Currently the rail appears at ≥1280px as a hard switch; below 1280px the form stays mobile-shaped. Decisions needed:
- 480-1280px range: does the form column stretch / centre / stay mobile-width? Does the rail "fold" into a bottom-sheet or collapsible drawer below the breakpoint?
- Above 1320px: extra-space utilisation (centre everything? widen the rail? widen the form?)

**First actions:** UX scoping AskUserQuestion round on intermediate-breakpoint behaviour shape; then AC-freeze + impl.

### P3 detail — Public-site / marketing pages framework (Heavy, unblocked)

**Scope from session 108 strategy discussion:** Form-surface (interview, dashboard) uses Help-Rail-style desktop-graceful-enhancement; content-surface (marketing, policy, FAQ) needs a separate responsive-first framework. This priority scopes that framework.

**Surfaces:**
- `docs/design-source/marketing-landing/` (2026 decoded lines) — landing canvas
- `docs/design-source/welcome-tour/` (1497 decoded lines)
- Existing routes: `src/app/page.tsx` (26-line placeholder) · `terms` · `cookies` · `privacy`

**First actions when picked up:** Extract design tokens from marketing-landing canvas; audit overlap with S-F1's 76 tokens; decide responsive framework (hero + sections + footer pattern, no rail); ship landing page slice.

### P4 detail — System-wide a11y pass (Heavy, blocked)

**Pre-condition unchanged:** prototype journeys locked down (no pending scope changes to O1-O8 / Q-bridge / O6.5/6.6/6.7 / Help Rail). Session 108 added a new graceful-enhancement layer that's still iterating; lockdown not confirmed.

**Scope additions from session 108 (deferred from S-PROTO-help-rail-desktop-variants):**
- `aria-live="polite"` region unconditional mount (currently conditionally rendered when `showRail`)
- `:focus-visible` outline for inline-styled buttons (sendButton, suggestButton, resetButton)
- MUTE colour contrast at 10.5px (#78716C borderline vs WCAG 4.5:1)
- `cursor: 'pointer'` on suggested-buttons without `onClick` handlers

## Scoping-discipline observations carried as recurrence-watch (31 items)

**Session 108 applied:**

- Verify before planning — pre-priority verifications (Help Rail spec grep, prototype-journey-lockdown check, branch state) all cleared at turn 0.
- Quote, don't paraphrase — spec citations (CLAUDE.md §"Visual direction" §"Canvas-as-source") verbatim at scoping; the canvas designer's own "Suggested next step" quoted verbatim when justifying Path A.
- Plan-vs-spec cross-check — re-read CLAUDE.md §"Canvas-as-source" before AC freeze; uncovered that prototype canvas-as-source has NO `Linked canvas:` field requirement (vs production preserve-and-rebuild).
- Distrust your own summaries — the SESSION-CONTEXT P1 carry-forward ("Help Rail spec ref pending") was the literal example: 7-session carry of an inherited framing that the user dismissed as the active gate.

**New observations this session (one-session-observed; promote to numbered constraint if a second session repeats):**

- **Dismissed AskUserQuestion rounds carry signal.** Two rounds dismissed in session 108; both led to better outcomes after free-form direction. Pattern: when dismissed, treat as "your framing is wrong" not "no answer yet" — re-read for inherited assumptions before re-asking. One-session-observed.
- **CI-driven mid-flight refactor honouring a new lint rule.** `react-hooks/set-state-in-effect` blocked `useEffect → setState` pattern; canonical fix was `useSyncExternalStore`. Net architectural improvement. One-session-observed.
- **Inherited SESSION-CONTEXT framings can rot.** P1's "Help Rail spec ref pending" carried 7 sessions past the canvas-as-source default that obsoleted it. Pattern: at session start, sanity-check carry-forward priorities against active patterns + specs, not just verify they're still blocked. One-session-observed.

**RESOLVED session 108** (no longer on watch):

- ~~None resolved this session — all prior-session entries remain on watch (none exercised this session).~~

**Second-session-observed promotion eligible (carried session 107, now repeated session 108 in different trigger shape):**

- **AC mid-impl renegotiation.** Session 107: anti-DRY refactor at impl time amended AC-3 (4 modules → 1 shared); discovery trigger. Session 108: budget renegotiation at warn threshold amended AC-4 (5 rails → 3 + 2 deferred placeholder); session-churn trigger. Shared shape (AC amended mid-impl); different triggers. Promote to numbered constraint at session 109+ if a third session repeats.

**Carried unchanged from session 107 (2 entries):**

- AC mid-impl amendment for anti-DRY refactor (did not exercise this session in the anti-DRY shape specifically; the broader-shape recurrence is captured above).
- verification.md hook flags on session-N provenance + per-spec-N citation (DID recur this session — 2 flags caught at verification.md draft + 1 flag on acceptance.md; all fixed at author-time hook via doc-pointer rephrasing).

**Second-session-observed (carried session 104→107; session 108 did not exercise multi-spec AC freeze):**

- Sibling-spec-discrepancy batching at AC freeze.

**Second-session-observed (sessions 103 + 106; session 108: author-time hook caught all 3 flags — equal strictness):**

- `spec-citation-quote` author-time stub vs CI gate strictness — session 108 stub matched CI strictness; promotion threshold unchanged.

**Carried unchanged from session 106 (3 entries):**

- Bracket-glob shellspec gotcha (no shellspec changes session 108).
- Indented-blockquote escape via doc-pointer (no blockquote-under-list patterns added).
- AC-vs-impl-path drift (AC referenced files all landed at their expected paths).

**Carried unchanged from sessions 100-105 (~20 entries):** All as documented in HANDOFF-SESSION-107.md §"Recurrence-watch".

## Authoritative reading order at session 109 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-108.md` (session 108's retro — P1 partial unblock + 3 new recurrence-watch entries).
3. `docs/HANDOFF-SESSION-107.md` (session 107's retro — P3 ship + P1 deferral; useful for prototype-rigour calibration).
4. **For P1 (V4 + V5 rails):** canvas at `docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html` L1925-2090; pattern reference at `src/app/dev/proto/pre-signup-interview/components/rails/{RailGlossary,RailCoach,RailWhy}.tsx`.
5. **For P2 (broader breakpoints):** existing `src/app/dev/proto/pre-signup-interview/page.module.css` `.helpRailWrapper` / `.helpRailContent` / `.helpRailColumn` classes; current `@media (min-width: 1280px)` rule.
6. **For P3 (public-site framework):** `docs/design-source/marketing-landing/` + `docs/design-source/welcome-tour/` + `src/styles/tokens.ts`.

## Session 109 kickoff prompt (paste-ready)

```
Kick off session 109.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch.
- Session 108 wrap squash-merged S-PROTO-help-rail-desktop-variants via
  PR #210 as `7cea128`. Verify state via `git log --oneline origin/main | head -3`
  if uncertain.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-108.md.
3. docs/HANDOFF-SESSION-107.md (for prototype-rigour calibration context).

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For P1 (V4 + V5 rails, unblocked):
- Shipped-artifact check: `ls src/app/dev/proto/pre-signup-interview/components/rails/`
  should show RailGlossary.tsx + RailCoach.tsx + RailWhy.tsx + rail-constants.tsx.
  V4/V5 placeholder routing lives in HelpRailLayout.tsx.
- Canvas access: confirm
  `docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html`
  is present.

For P4 (system-wide a11y pass, still blocked):
- Prototype-journey-lockdown check: confirm no pending scope changes to
  O1-O8 / Q-bridge / O6.5/6.6/6.7 / Help Rail. If any pending, P4 stays
  blocked.

Confirm priority with user. SESSION-CONTEXT recommends P1 (V4 + V5
rails) — single-session-sized, infrastructure already shipped.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

**Pre-signup-interview prototype state:** 12 screens (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) + shared chassis primitives + cross-screen tone audit Phase 1 + copy-resolver-completeness sweep + plan-engine hooks + 3 quantitative screens UI + cross-component a11y polish (focus-visible + roving tabindex + SkipScreenButton + useQuantitativeUpdate) — all on main.

**Session 108 added:** Variant control infrastructure under `src/lib/dev/` (manifest + context + hooks; useSyncExternalStore-based); `/dev/control` dev surface; three Help Rail desktop variants (V1 Glossary / V2 AI Coach / V3 Why we ask) with V4/V5 placeholders; 1280px CSS-only graceful-enhancement breakpoint; registry row for the new dev tool.

## Branch

Session 109 branch: harness-suffixed off clean main, OR scope-named sub-branch.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 108.** Thirty-one scoping-discipline observations on recurrence-watch (3 new session 108: dismissed-AskUserQuestion-as-signal; CI-driven mid-flight refactor; inherited-SESSION-CONTEXT-framings-rot — all one-session-observed). AC mid-impl renegotiation (sessions 107 anti-DRY + 108 budget) eligible for promotion at session 109+.

**Active pre-existing CI failures (carry forward):**

- 50 pre-existing ESLint warnings across O1-O8 / o7.ts / o8.ts / dev-store / supabase / workspace types / unused vars in test files. All pre-existing from prior sessions; not regressions from session 108. Per CLAUDE.md §"Surgical changes" — left untouched.

## Scope ceiling

Session 109 is most likely **P1 (V4 + V5 rails — Medium, unblocked), P2 (broader breakpoints — Medium-Heavy, unblocked), P3 (public-site framework — Heavy, unblocked), or P4 (system-wide a11y pass — Heavy, blocked)**. Out of scope unless explicitly added: post-signup work · Welcome Tour · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 12 screens on main + variant infrastructure + dev control surface + 3 Help Rail variants live at ≥1280px viewport.
- Variant control: `/dev/control` (dev mode); toggle between off / V1 Glossary / V2 AI Coach / V3 Why we ask / V4 deferred / V5 deferred.
- URL override: `?variant.helpRail=v2` shareable.
