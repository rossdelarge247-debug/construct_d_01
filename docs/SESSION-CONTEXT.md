# Session 112 Pre-flight Context Block (carrying session 111 wrap delta)

## Session 111 wrap delta — read this first

Session 111 shipped the full 18-fix combined a11y slice consuming the Phase 1 audit register. One PR; squash-merged.

### Slice shipped — `S-PROTO-a11y-phase-1-fixes`

Category `prototype`. All 18 `fix-this-slice` findings from `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` (F-A11Y-01..18) consumed in one combined slice. Original session-110 4-way sub-slice plan (focus-visible-sweep · aria-live-regions · contrast-mute · rail-specifics) re-partitioned to one combined slice on measured fix-impl effort + file-overlap synergy.

| AC group | Findings | Pattern |
|---|---|---|
| AC-1..8 | F-A11Y-01..08 | focus-visible coverage on 8 sites; `components/focus-visible.module.css` gains `:has(:focus-visible)` for label-wrapping-radio cases |
| AC-9..11 | F-A11Y-09..11 | ARIA live regions mount-unconditionally refactor (HelpRailLayout, Footer); O7.tsx L539 verified already-unconditional, no impl change |
| AC-12..15 | F-A11Y-12..15 | MUTE → SUB token swap on 9 lines across 4 files (rail-constants 5 · RailCoach 2 · RailGlossary 1 · RailWhy 1) |
| AC-16 | F-A11Y-16 | RailCoach suggested-buttons get `aria-disabled="true"`; `cursor: 'pointer'` removed |
| AC-17 | F-A11Y-17 | `optRowStyle` migrated to `rail-constants.module.css` with `:hover` + `:focus-visible`; RailHuman consumers updated |
| AC-18 | F-A11Y-18 | RailHybrid V5 tabs gain `ArrowLeft`/`ArrowRight` keyboard nav with wrap, per WAI-ARIA Tabs APG |

Plus a fix surfaced at preview-deploy: V5 inactive-tab underline persisting after switch (React inline-style shorthand+longhand diff edge case; `borderBottomColor: 'transparent'` declared explicitly in `tabButtonStyle` to force React to diff the longhand on every transition).

**Verification:** 769 unit tests passing (3 new describe blocks + 2 amended Footer tests). Lint clean (no new warnings in touched files). Typecheck clean. Auto-review verdict: `approve` (final), 3 prior actionable findings addressed via verification.md updates.

**PR + merge:** #214 squash-merged as `e96556f` on main.

**Detailed retro in `docs/HANDOFF-SESSION-111.md`.**

## Session 112 priorities — user picks scope

Phase 1 of the system-wide a11y pass is complete (audit register + 18 fixes shipped). Phase 2-4 remain.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Phase 2 a11y pass — responsive breakpoint audit** | 480-1280px intermediate + above-1320px utilisation across 12 pre-signup screens. Output: `docs/slices/S-PROTO-a11y-wcag-audit-phase-2/audit-register.md`. Audit-only ship per session 110's audit-vs-fix partition pattern. | Medium | No |
| 2 | **Phase 3 a11y pass — NVDA + VoiceOver walk** | Full screen-reader audit across 12 screens + 20 components + 5 rails. Output: `docs/slices/S-PROTO-a11y-wcag-audit-phase-3/audit-register.md`. Audit-only ship. | Medium-Large | No |
| 3 | **`S-PROTO-a11y-rail-tabs-roving-tabindex`** | Small follow-up slice for V5 tab roving tabindex (`tabIndex={isActive ? 0 : -1}` per WAI-ARIA APG). Auto-review prototype-readiness specialist's deferred finding from PR #214 commit 1. | Small | No |
| 4 | **Footer captionDisabled MUTE contrast** | Adjacent observation surfaced session 111 — `Footer.module.css:33-36` `.captionDisabled` uses `--ds-color-text-muted` at 10.5px; same concern as F-A11Y-12..15 but not in the Phase 1 audit register. Could fold into Phase 2 audit walk or fix-this-slice directly. | Trivial | No |
| 5 | **Anything fresh — user-directed** | Varies. Out-of-scope unless explicitly added: post-signup work, Welcome Tour, Marketing Landing, Post-connect Dashboard. | n/a | n/a |

**Recommended:** P1 (Phase 2 responsive audit) is the natural next step in the system-wide a11y pass. P3 (roving tabindex follow-up) is the smallest single-deliverable; could pair with P4 (Footer contrast) into a tiny combined "a11y-loose-ends" slice if a tight session is wanted. P2 (SR walk) is the most ambitious — requires good audio + screen-reader setup.

## Scoping-discipline observations carried as recurrence-watch

**Session 111 applied:**

- Verify before planning — turn 0 confirmed clean main via `git log --oneline origin/main | head -3`; no catch-up cost paid (session 110's wrap-properly fix worked).
- Quote, don't paraphrase — slice acceptance.md initially had two paraphrased spec citations that the hook caught; both rewritten with verbatim quotes per `quote-don't-paraphrase`.
- Plan-vs-spec cross-check — re-read audit register + parent slice deferrals before drafting AC list; 100% rule verified (18 fix-this-slice + 2 defer-out-of-scope = 20 rows ✓).
- Think before coding — re-partition (4-way → 1 combined) surfaced via `AskUserQuestion` rather than silent-deciding.

**New observations this session (one-session-observed; promote at second session if recurs):**

- **React inline-style shorthand+longhand diff leaks `currentcolor` on transition.** When a style object switches from `{borderBottom: shorthand, borderBottomColor: override}` → `{borderBottom: shorthand}`, React clears the longhand override but doesn't re-apply the shorthand; CSS cascade falls back to initial `currentcolor` (== text color). Pattern: always declare longhand explicitly in BOTH style objects, even when the value matches the shorthand. Promotion target: extend CLAUDE.md §"Coding conduct" with a "Inline-style diff pitfalls" paragraph if recurs.
- **Vercel preview URL host blocked from agent sandbox (`x-deny-reason: host_not_allowed`).** Preview-deploy in-browser verification (DoD item 4 for UI slices) cannot be performed by the agent. User-visual confirmation is the only path. Pattern: verification.md preview-deploy section should be explicit "user-confirmed" status for UI prototype slices.
- **`/dev/control` 404 on Vercel previews.** Dev routes (`*.dev.tsx`) excluded by `next.config.ts` when `NEXT_PUBLIC_DECOUPLE_AUTH_MODE === 'prod'` (Vercel preview default). URL-override path (`?variant.helpRail=v*`) is the only way to test variants on previews. Not in scope; flagged for follow-up if dev-tool access on previews is desired.

**Carried unchanged from session 110 (3 entries):**

- Multi-PR unmerged backlog at session start — session 111 paid no catch-up cost (main was clean). The session-110 wrap-properly intervention worked.
- Bundled wrap-into-impl PR creates merge-conflict risk — session 111 uses separate wrap PR.
- Audit-style slice line-count budget skews toward catalogue not fixes — session 111 confirmed inverse: fix-impl-only slices fit comfortably under 1,500L. Audit-vs-fix partition correct.

**Carried unchanged from session 109 (3 entries — none exercised session 111).**

**Third-session-observed promotion eligible:**

- **Wrap-protocol skipping** — Sessions 108-110 each paid a turn-0 reconciliation cost. Session 110 wrapped properly → session 111 paid no cost. Pattern intervention works. Promote to numbered negative constraint if session 112+ confirms.

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md` for the full list; entries unchanged.

## Authoritative reading order at session 112 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-111.md` (session 111 retro — 18-fix combined slice ship + auto-review iteration + V5 tab underline fix + 3 new recurrence-watch entries).
3. For Phase 2 a11y pass: `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` (Phase 1 finding pattern reference) + `docs/slices/S-PROTO-a11y-phase-1-fixes/{acceptance,verification}.md` (slice template + adjacent observation about Footer.module.css).
4. For Phase 3 SR walk: same Phase 1 audit-register as template; SR-specific findings + verbatim assistive-tech output evidence.
5. For roving-tabindex follow-up: `docs/slices/S-PROTO-a11y-phase-1-fixes/verification.md` §"Architectural deferrals" + WAI-ARIA Authoring Practices Tabs Pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

## Session 112 kickoff prompt (paste-ready)

```
Kick off session 112.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch.
- Session 111 wrap squash-merged S-PROTO-a11y-phase-1-fixes as e96556f;
  separate wrap-only PR for HANDOFF-111 + SESSION-CONTEXT refresh
  expected at session-112 turn 0 (verify via
  `git log --oneline origin/main | head -3` if uncertain).
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-111.md.
3. For Phase 2: docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md
   (template reference for finding catalogue structure).

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For Phase 2 a11y pass (responsive audit):
- Inputs check: confirm the responsive breakpoints are 480px / 768px /
  1024px / 1280px / 1320px+ (or whatever the current canvas spec
  defines). Cross-check against page.module.css media queries.
- Audit scope: 12 pre-signup screens + 20 shared components + 5 Help
  Rails. Same scope as Phase 1.
- Output: catalogued register at
  docs/slices/S-PROTO-a11y-wcag-audit-phase-2/audit-register.md
  following Phase 1's row format (ID · WCAG · file·line · severity ·
  disposition · pattern).

For the roving-tabindex follow-up:
- Read docs/slices/S-PROTO-a11y-phase-1-fixes/verification.md
  §"Architectural deferrals" §"Roving `tabIndex` for RailHybrid V5
  tabs".
- WAI-ARIA Tabs APG pattern reference at:
  https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

Confirm priority with user. SESSION-CONTEXT recommends P1 (Phase 2
audit) as the natural next step; P3+P4 combined would be the tightest
session; P2 (SR walk) is the most ambitious.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

Pre-signup-interview prototype: **12 screens** on main (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) with shared chassis primitives + density-entry + density-question + delight + output-reassurance + 4-categorical + 3-quantitative adaptive plan + tone-pass + 14-finding cross-screen tone audit Phase 1 + 42-string copy-resolver-completeness sweep + primaryCTA wire + invariant test + spec 65b + plan-engine hooks for 3 numeric-derived dimensions + UI for 3 new pre-signup screens + Q-bridge + 2 hook prototype-awareness fixes + SkipScreenButton + useQuantitativeUpdate + focus-visible + roving tabindex polish + Help Rail desktop variants infra + V1/V2/V3 rails + V4 RailHuman + V5 RailHybrid with `*Body` refactor. All five Help Rail canvas variants live behind the dev variant toggle. Session 110 added the WCAG 2.1 AA audit register at `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` — 20 findings catalogued. Session 111 shipped all 18 `fix-this-slice` resolutions in `S-PROTO-a11y-phase-1-fixes` (focus-visible · aria-live mount-unconditionally · MUTE→SUB contrast · RailCoach button semantics · optRowStyle CSS migration · RailHybrid V5 tab arrow-key nav).

## Branch

Session 112 branch: harness-suffixed off clean main, OR scope-named sub-branch.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 111.** Thirty-six scoping-discipline observations on recurrence-watch (3 new session 111 — React inline-style shorthand+longhand diff edge case; sandbox blocks Vercel preview URLs; `/dev/control` 404 on previews). Wrap-protocol skipping is **third-session-observed**, eligible for promotion if session 112 confirms (sessions 108-110 paid cost, session 111 paid none after session-110 wrap).

**Active pre-existing CI failures (carry forward):**

- 16 pre-existing ESLint warnings in O1.tsx / O2.tsx / O3.tsx / O8.tsx / o7.ts / o8.ts (unused-vars). All pre-existing; not regressions. Unchanged session 111.
- `Footer.module.css:33-36` `.captionDisabled` uses MUTE — adjacent observation, same WCAG concern as F-A11Y-12..15 but not in audit register. Carry to Phase 2 audit walk or fix-this-slice in P4.

## Scope ceiling

Session 112 is most likely Phase 2 (responsive audit) or a small follow-up combo (P3 roving-tabindex + P4 Footer contrast) or user-directed work. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 12 screens on main. 5 Help Rail variants live behind the dev variant toggle at `src/app/dev/control/page.dev.tsx` (production + local only; gated by `NEXT_PUBLIC_DECOUPLE_AUTH_MODE`). On Vercel previews use URL override: `?variant.helpRail=v1|v2|v3|v4|v5`. WCAG 2.1 AA Phase 1 audit register + all 18 fixes on main.
