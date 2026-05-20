# Session 111 Pre-flight Context Block (carrying session 110 wrap delta)

## Session 110 wrap delta — read this first

Session 110 shipped the audit register for Phase 1 of the system-wide a11y pass, plus paid the turn-0 catch-up cost for two open PRs from earlier sessions.

### Pre-session catch-up (turn 0)

The session-110 kickoff prompt assumed sessions 108 + 109 had wrapped and merged. They hadn't:

- PR #211 (Session 108 wrap docs) — was open, green, unmerged
- PR #212 (S-PROTO-help-rail-V4-V5 ship + bundled session-109 wrap docs) — was open, green, unmerged

Via `AskUserQuestion`, user chose catch-up. Squash-merged PR #211 (`5e30f96`), then PR #212 (`591b195`) with local conflict-resolve on the two wrap docs both PRs touched (kept main's contemporaneous HANDOFF-108; kept PR #212's session-110 SESSION-CONTEXT). Rebased session-110 branch onto the resulting main.

### Slice shipped — `S-PROTO-a11y-wcag-audit-phase-1`

Category `prototype`. Audit-register-only ship — fixes route to 4 named follow-up sub-slices.

| AC | Deliverable |
|---|---|
| AC-1 | `audit-register.md` — 20 findings (18 a11y · 2 defer-out-of-scope) across 12 screens + 20 components + 5 rails. All 8 inherited deferrals carry explicit register rows with verbatim source-quotes + WCAG criterion + severity + disposition. |

**Verification:** AC-1 closed. No `src/` change so tests + preview-deploy items N/A. DoD-14 short-form (prototype) cleared. Adversarial review fires at PR open.

**Detailed retro in `docs/HANDOFF-SESSION-110.md`.**

### Mid-session re-scope (D-1)

Original session scope was "WCAG audit + targeted a11y fixes" (the user-chosen P1 partition). At ~1435L churn, before any fix-impl started, the session presented a re-scope choice via `AskUserQuestion` per CLAUDE.md §"Engineering conventions" §"Definition of Done" (*"A partially-done slice is not shipped; it's re-scoped and re-planned"*). User picked audit-only ship; fixes route to 4 named follow-up sub-slices documented in the slice's `acceptance.md` §"Follow-up slices".

## Session 111 priorities — user picks scope

The Phase 1 audit catalogue is on main. Each follow-up sub-slice has unambiguous inputs from the register.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **`S-PROTO-a11y-focus-visible-sweep`** | F-A11Y-01..08 — 8 sites get `components/focus-visible.module.css` className wiring; per-site verification + tests | Medium | No |
| 2 | **`S-PROTO-a11y-aria-live-regions`** | F-A11Y-09..11 — refactor 3 conditional-rendered regions to mount-unconditionally-with-conditional-child + tests | Small | No |
| 3 | **`S-PROTO-a11y-contrast-mute`** | F-A11Y-12..15 — per-site decision between font-bump and colour-shift across ~7 rail sites + verification | Medium | No |
| 4 | **`S-PROTO-a11y-rail-specifics`** | F-A11Y-16..18 — RailCoach button semantics + opt-row CSS migration + V5 tab arrow nav + tests | Medium | No |
| 5 | **Anything fresh — user-directed** | Varies | n/a | n/a |

**Recommended:** P2 (`aria-live-regions`) is the smallest scope — 3 sites, one refactor pattern, well-suited to a tight session that includes wrap. P1 (`focus-visible-sweep`) is the next-tightest. P3 (`contrast-mute`) and P4 (`rail-specifics`) have more decision variety per site.

### Audit register location

`docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` — every follow-up sub-slice should cite the specific F-A11Y-NN findings it addresses verbatim from this register's table.

## Scoping-discipline observations carried as recurrence-watch (33 items)

**Session 110 applied:**

- Verify before planning — turn-0 catch-up surfaced two unmerged PRs the kickoff assumed merged. Per CLAUDE.md §"Planning conduct" §"Verify before planning", verified via git log + GitHub PR list before authorising priority work.
- Quote, don't paraphrase — verbatim source-quotes carried into the audit register for all 8 inherited deferrals; spec 72b table quote re-verified by grep against the spec text (initial fabricated quote replaced with verbatim table row).
- Plan-vs-spec cross-check — re-read parent slices' verification.md §"Architectural deferrals" before audit-register draft.
- Think before coding — surfaced the mid-session re-scope via `AskUserQuestion` rather than silent-deciding or pushing to partial-state.

**New observations this session (one-session-observed; promote at second session if recurs):**

- **Multi-PR unmerged backlog at session start.** Two consecutive sessions shipped impl-or-wrap PRs without merging; each subsequent session paid a turn-0 reconciliation cost. Possible enforcement: SessionStart hook detects stale main vs open-PR backlog and surfaces the gap.
- **Bundled wrap-into-impl PR creates merge-conflict risk on contemporaneous wrap-only PR.** PR #211 (wrap-only) + PR #212 (impl + bundled wrap) conflicted on wrap docs because both touched them. Pattern: separate wrap-only and impl-only PRs is safer than bundling wrap into impl.
- **Audit-style slice line-count budget skews toward catalogue, not fixes.** Catalogue-quality work (verbatim quotes, file + line refs, WCAG criterion mapping) ate 1400+L. Pattern: audit-style slices need their own session, not a session-shared budget with fix-impl.

**Carried unchanged from session 109 (4 entries — none exercised session 110):**

- D-7-style locked decisions sometimes don't survive impl
- Author-time hook regex coverage on sibling-step patterns
- Stop hook + WIP-broken-state interaction
- Wrap-protocol skipping costs next session a doc-vs-truth reconciliation turn (now **second-session-observed** — session 110 paid the same cost; promotion-eligible at session 111+)

**Second-session-observed promotion eligible (carried from session 107):**

- AC mid-impl amendment for anti-DRY refactor (sessions 107 + 109)
- Wrap-protocol skipping (sessions 109 + 110) — newly promoted

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md` § "Carried unchanged from earlier sessions" for the full list; entries unchanged.

## Authoritative reading order at session 111 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-110.md` (session 110's retro — audit register ship + 2 PR merges + 3 new recurrence-watch entries).
3. `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` — the canonical finding catalogue for any follow-up a11y sub-slice.
4. **For any P1-P4 follow-up:** read the slice's relevant register rows + `acceptance.md` §"Follow-up slices" detail.

## Session 111 kickoff prompt (paste-ready)

```
Kick off session 111.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch.
- Session 110 wrap squash-merged S-PROTO-a11y-wcag-audit-phase-1 (verify
  via `git log --oneline origin/main | head -3` if uncertain).
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-110.md.
3. docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md (target
   findings for any chosen follow-up).

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For any P1-P4 follow-up a11y sub-slice:
- Inputs check: confirm the specific F-A11Y-NN findings the slice targets
  are still listed in audit-register.md with disposition `fix-this-slice`.
  If the disposition shifted (e.g., a finding was independently resolved
  in an adjacent slice), update the slice's AC list to reflect reality.
- Pre-impl architectural skeleton: per the session-109 recurrence-watch
  entry, render a quick skeleton check if the fix involves layout or
  cross-component coupling (focus-visible sweep + rail-specifics most
  likely candidates).

Confirm priority with user. SESSION-CONTEXT recommends P2 (aria-live-
regions) as the smallest scope; user may pick any.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

Pre-signup-interview prototype: **12 screens** on main (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) with shared chassis primitives + density-entry + density-question + delight + output-reassurance + 4-categorical + 3-quantitative adaptive plan + tone-pass + 14-finding cross-screen tone audit Phase 1 + 42-string copy-resolver-completeness sweep + primaryCTA wire + invariant test + spec 65b + plan-engine hooks for 3 numeric-derived dimensions + UI for 3 new pre-signup screens + Q-bridge + 2 hook prototype-awareness fixes + SkipScreenButton + useQuantitativeUpdate + focus-visible + roving tabindex polish + Help Rail desktop variants infra + V1/V2/V3 rails + V4 RailHuman + V5 RailHybrid with `*Body` refactor. All five Help Rail canvas variants live behind the dev variant toggle. Session 110 adds the WCAG 2.1 AA audit register at `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` — 20 findings catalogued, 4 follow-up sub-slices named.

## Branch

Session 111 branch: harness-suffixed off clean main, OR scope-named sub-branch.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 110.** Thirty-three scoping-discipline observations on recurrence-watch (3 new session 110 — multi-PR unmerged backlog at session start; bundled wrap-into-impl PR conflict risk; audit-style slice line-count budget skew). Wrap-protocol skipping is now **second-session-observed**, eligible for promotion at session 111+.

**Active pre-existing CI failures (carry forward):**

- Auto-review on PR for `S-PROTO-a11y-wcag-audit-phase-1` fires at PR open. Verdict + finding triage land in `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/verification.md` §"Auto-review responses" at PR-review time.
- 16 pre-existing ESLint warnings in O1.tsx / O2.tsx / O3.tsx / O8.tsx / o7.ts / o8.ts (unused-vars). All pre-existing; not regressions. Untouched session 110 per §"Surgical changes".

## Scope ceiling

Session 111 is most likely one of the 4 a11y follow-up sub-slices (focus-visible sweep · aria-live-regions · contrast-mute · rail-specifics) or user-directed work. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 12 screens on main. 5 Help Rail variants live behind the dev variant toggle at `src/app/dev/control/page.dev.tsx`. WCAG 2.1 AA audit register on main; fixes pending in 4 named follow-up sub-slices.
