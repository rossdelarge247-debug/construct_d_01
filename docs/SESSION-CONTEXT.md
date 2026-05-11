# Session 89 Pre-flight Context Block (carrying session 88 wrap delta)

## Session 88 wrap delta — read this first

Session 88 shipped two slices: closed out the previous session's O3 PR and ran a full O4 cycle from scope to ship.

**PR #155 — `S-PROTO-o3-canvas-as-source · impl (AC-1..AC-4) (#155)`** — squash-merged to main as `67f28dd`. Single squash commit; the heavy lifting was done in the prior session, this session ran the final user pre-flight + merge.

**PR #156 — `S-PROTO-o4-canvas-as-source · impl (AC-1..AC-4) (#156)`** — squash-merged to main as `d954b6c`. Five commits across three auto-review rounds + one user-flagged visual regression:

- `4328ab7` slice impl (AC-1..AC-4) — O4 page IS the canvas (`docs/design-source/pre-signup-interview/o4-employment-complexity-expressive.html` L125-220 ResolvedFrame). Single `<fieldset>` with 4 native `<input type="radio">`; `'no'` option emphasised per canvas C3 (padV 18 vs 14, fontS 15 vs 14, soft box-shadow). State rename `SelfEmployment 'neither' → 'no'` to match canvas key (`jsx/o4-frames.jsx` L99). 9 unit tests.
- `878fe31` round-1 (`nit-only` advisory) — 5 fixes: `indigo` promoted to `tokens.color.accent.indigo` design token across `tokens.ts` + `globals.css` + `TOKEN_NAMES` parity (count 75 → 76); `O4Copy.eyebrow.accent` union narrowed to literal `'indigo'`; duplicate `O4Copy.question` field dropped; stray `className={styles.footer}` removed; redundant TopBar Arrow `aria-hidden`. Plus AC-4 amendment in `acceptance.md` dropping "dot-fill 120ms" (canvas L99 transition list covers `background, border-color, padding` only).
- `04a1f57` visual regression fix — user pre-flight: *"there's a lot off with it, notably now has a white background"*. Root cause: `<main>` style had `background: '#FFFFFF'` overriding page-level `BackgroundShell mode="expressive"` gradient. O1-O3 don't set `<main>` background; they inherit the page shell. Three-line fix: drop background, add `width: '100%'`, add `paddingTop: 24`, switch `'100dvh'` → `'100vh'` for sibling parity.
- `16410a4` verification.md statuses → Pass + DoD-14 short-form ticked.
- `4297700` round-3 nit: `padV` → `verticalPad` rename. Round-3 declined nit (`100vh` → `100dvh`) for cross-screen parity with O1-O3; mobile-viewport sweep is a future cleanup slice if pursued.

**Auto-review trajectory.** `nit-only` (round 1) → `approve` (round 2) → `nit-only` (round 3) → `approve` (round 4 on `4297700`). Three approve verdicts in the trajectory; `block` never reached.

**Visual-regression lesson (session 88's main scoping-discipline observation).** When implementing a screen that's structurally a sibling of an established pattern, diff your top-level wrapper (`<main>` style here) against the sibling's wrapper before pushing. Session 88 + session 87 both hit this class (session 87 with `ScreenShell` Back button at refactor-time). Two-session recurrence; promote to a numbered constraint if it surfaces in O5/O6.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-88.md`** — read for the round-by-round narrative, the bg-override root-cause investigation, persona finding-rate tracking post-cohort, and the sibling-wrapper diff observation.

## Session 89 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Continue canvas-as-source migration: O5 + O6** | Both are A1-style chip-card layouts (same template as O3 + O4). Each ships as its own slice. Frame sources: `docs/design-source/pre-signup-interview/o5-partner-finances-expressive.html` + `o6-what-matters-to-you-expressive.html`. Per CLAUDE.md §"Pre-priority canvas-fidelity verification", verify decoded sibling exists at `docs/design-source/pre-signup-interview/decoded/<slug>/decoded/*.html` OR run `scripts/decode-bundler-canvas.sh` before visual-fidelity work. | Medium per slice (~150-300L per screen) | No |
| 2 | **Canvas-as-source migration: O7 + O8** | Different visual shapes per session-87 framing ("your plan" + "what's next"). Lower batch synergy with O5/O6; warrant separate slice consideration at scope-time. Frame sources: `o7-your-plan-expressive.html` + `o8-whats-next-expressive.html`. | Heavy per slice (novel shape) | No |
| 3 | **Desktop-enhanced graceful enhancement (deferred per constraint #41)** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html` is the cross-canvas reconciliation target. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. | Heavy | Yes — once all 8 screens canvas-as-source migrated (after P1 + P2) |
| 4 | **Production graduation backlog (parked across `verification.md` §"Architectural deferrals")** | AC-1 sticky CTA mechanism (true `position: sticky` + safe-area-inset + shorter-than-667 viewport hardening) · 44×44 touch target on `ScreenShell` Back (negative-margin or invisible hit-area extender) · `100dvh` vs `100vh` sweep for mobile-address-bar handling. Bundle into a single production-graduation pass when the pre-signup flow exits `/dev/proto/`. | Medium | No, but premature until production graduation timing is decided |
| 5 | **(Inherited) spec-citation-quote-check author-time hook** | Mirror `.claude/hooks/comment-review.sh` PostToolUse Write\|Edit advisory exit-0 pattern. Catches "per spec X" without proximity quote at edit time, before CI cycle. | Light (~50L bash + shellspec) | No |
| 6 | **(Inherited) Comment-review hook §Status exemption fix** | Stub-mode hook flags "session X" provenance inside `## Status` blocks where CLAUDE.md `^## (§)?Status` exemption should apply. | Light (~20-30L bash) | No |
| 7 | **(Inherited) Spec 65 amendment for quantitative profiling data** | Still parked. | Heavy | No |

**Recommended sequence:** P1 first (O5 + O6) — the canvas-as-source pattern is well-grooved after O3 + O4. Each is now a known template-instantiation effort. P2 (O7 + O8) follows but warrants scope-time review since the visual shapes differ. P3 unblocks once all 8 ship. P4 bundles for production graduation. P5-P7 tractable side-quests off the critical path.

**Scoping-discipline observations carried as recurrence-watch (not yet numbered constraints):**

- **Sibling-wrapper diff at impl-time** (NEW session 88) — when implementing a screen that's structurally a sibling of an established pattern, diff your top-level wrapper against the sibling's wrapper before pushing. Two-session recurrence (session 87 `ScreenShell` Back, session 88 O4 `<main>` bg). Promote to numbered constraint if it surfaces in O5/O6.
- **Shared-infrastructure audit at refactor-time** (carried from session 87) — when rewriting or extracting a shared component, enumerate the prior implementation's guarantees (a11y minimums, focus-visible, width caps, semantic attributes) and carry each forward or document the deferral.
- **In-PR scope expansion confirmation gate** (carried from session 87) — when user authorises expanding a slice's scope mid-PR, document atomically in `acceptance.md` + `verification.md` with user-direction provenance verbatim.

## Authoritative reading order at session 89 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-88.md` (last session's retro — O3 merge + O4 cycle + visual regression diagnosis + persona findings post-cohort).
3. **For P1 (when chosen):** `docs/design-source/pre-signup-interview/o5-partner-finances-expressive.html` + `o6-what-matters-to-you-expressive.html` — large bundled-HTML canvases. Per CLAUDE.md §"Pre-priority canvas-fidelity verification", verify the decoded sibling at `docs/design-source/pre-signup-interview/decoded/` OR run `scripts/decode-bundler-canvas.sh` before visual-fidelity work. Grep for `MobileFrame`/`ResolvedFrame` def first, then targeted offset+limit reads of the mobile-frame state.
4. **For P1 (cross-screen pattern reference):** `src/app/dev/proto/pre-signup-interview/screens/O3.tsx` + `O4.tsx` + `components/{Arrow,BrandBar,ProgressPill,ScreenShell}.tsx` — the established canvas-as-source pattern. New slices instantiate this template.

## Session 89 kickoff prompt (paste-ready)

```
Kick off session 89.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state (current branch +
  HEAD vs origin/main + ahead/behind + tree state).
- Branch convention: harness-suffixed (claude/<scope>-XXXXX).
- Session 88 shipped PRs #155 (O3, 67f28dd) + #156 (O4, d954b6c)
  squash-merged to main. Session 88 wrap PR pending or just-merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-88.md.
3. CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype
   default)" — the 5-step adapt pattern.

Confirm priority with user. SESSION-CONTEXT recommends P1 (O5 + O6
canvas-as-source migration). Each is its own slice; pattern is
well-grooved after O3 + O4 ship.

Frame sources:
- O5: docs/design-source/pre-signup-interview/
  o5-partner-finances-expressive.html
- O6: o6-what-matters-to-you-expressive.html

Per CLAUDE.md §"Pre-priority canvas-fidelity verification": verify
decoded sibling exists at docs/design-source/pre-signup-interview/
decoded/ OR run scripts/decode-bundler-canvas.sh before any visual-
fidelity work. Bundled-HTML canvases hide the visual treatment in a
JSON-encoded <script type="__bundler/template"> block.

Slice convention: no `Linked canvas:` field (canvas-fidelity persona
stays dormant per the prototype default). **Category:** prototype.
Per-AC evidence cites the canvas inline.

Cross-screen pattern (now established across O1-O4):
- Shared <BrandBar> + bespoke TopBar (Back/Home link + Arrow +
  ProgressPill + matched-width right spacer + bottom border)
- Hero (eyebrow with optional accent dot + serif H2 + optional
  sub-stem helper)
- Body fieldset(s) with native <input type="radio">
- Footer chassis (cream rgba(245,245,244,0.85) + blur(8px) + caption
  or trust band + dark pill button with right-arrow strokeWidth=2)
- O4.module.css template: entry stagger via --stagger-index +
  chip-card transitions 160ms ease + CTA bounce + reduced-motion
  fallback

Definition of Done (per CLAUDE.md §"Definition of Done", prototype
short-form items 1, 8, 12, 14 per spec 76 §3):
- Slice acceptance.md + verification.md
- Tests written + passing
- Auto-review verdict: approve / nit-only on impl PR (3 specialists)
- Preview-deploy verified per spec 72a 6+1 dimension rubric
- User feedback received + addressed (or explicitly deferred)

Scoping-discipline checks (recurrence-watch, not yet constraints):
1. Sibling-wrapper diff at impl-time. Before pushing, diff your
   <main> wrapper style against the sibling screen's wrapper. Both
   session 87 (ScreenShell Back) and session 88 (O4 <main> bg) hit
   this class. Promote to numbered constraint if it surfaces.
2. Shared-infrastructure audit at refactor-time. If a slice touches
   shared chrome, enumerate prior guarantees and carry forward.
3. In-PR scope expansion confirmation gate. If user authorises
   scope expansion mid-PR, document atomically in slice docs with
   user-direction provenance verbatim.

Workflow: scope-time audit → build → preview-deploy → user feedback
→ iterate. Webhook-driven iteration loop (subscribe to PR activity,
no polling) — established pattern from sessions 87 + 88.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens post-session-88; `tokens.color.accent.indigo` added) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 89 branch: harness-suffixed off clean main. Session 88 shipped PRs #155 + #156 + the session-88 wrap PR. Session 88 working branches deletable post-merge.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new constraints surfaced session 88.** Three scoping-discipline observations on recurrence-watch (sibling-wrapper diff at impl-time — NEW session 88; shared-infrastructure audit at refactor-time; in-PR scope expansion confirmation gate). See "Scoping-discipline observations" above. They earn numbered-constraint status if a third session surfaces a similar regression.

## Scope ceiling

Session 89 is most likely P1 (O5 + O6 canvas-as-source migration), possibly P1 + P2 if frames support same-session shipping. Out of scope unless explicitly added: P3 (desktop-enhanced graceful enhancement — needs all 8 screens migrated first) · P4 (production graduation backlog — premature) · P5-P7 (inherited tractable side-quests) · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
