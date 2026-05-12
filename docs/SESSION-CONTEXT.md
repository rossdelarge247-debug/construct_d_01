# Session 92 Pre-flight Context Block (carrying session 91 wrap delta)

## Session 91 wrap delta — read this first

Session 91 shipped the **cross-screen homogenisation programme's Phase 1 (audit) + Phase 2 (joint review decisions) + Phase 4 (spec pressure-test workstream captured) + 3 of 5 Phase 3 impl batches.**

**Audit slice `S-PROTO-cross-screen-homogenisation-audit/acceptance.md`** — 40-finding register across 9 categories: chassis-component sharing (CH), naming (NM), typography (TY), semantic/a11y (SM), spacing (SP), mobile-cap (LM), Footer (FT), CSS-module (CM), off-palette tokens (TK). Phase 2 outcomes (decisions locked) + Phase 3 batch design + Phase 4 follow-on workstream all captured in the same slice.

**Three Phase 3 batches merged:**
- **`9ffd2bb` Batch A — TopBar harmonisation** (PR #164). Shared `components/TopBar.tsx` + `TopBar.module.css` + 7-test suite. All 8 screens swapped from local TopBar functions. 8 local TopBar + StepRail (O8) + 2 local ArrowSvg (O7, O8) + inline progress markup deleted; 4 non-TopBar ArrowSvg call-sites migrated to shared Arrow with `sw` → `strokeWidth`. Net +185/-360 lines. User-directed "let's just merge" cadence (no auto-review).
- **`92bc92f` Batch E — Dead-code cleanup** (PR #165). Deleted 7 unused primitives (~557L): ScreenShell + RadioCard + RadioChips + CheckChips + SubQuestionCard + JourneyTimeline + PlanSection. Also deleted orphan `screen-shell-title.test.tsx` + cleaned up `brand-bar.test.tsx`'s "via ScreenShell" describe block + updated stale comment in o2 test. `components/` now contains 5 used primitives + the shared TopBar.
- **`bbe9093` Batch D — `<main>` sweep on O1+O2** (PR #166). Pure structural fix: swap root `<div>` → `<main>`; Tailwind className preserved. Banner-role recovery (move TopBar before `<main>`) deferred as architectural-deferral note.

**Two Phase 3 batches remaining:** Batch B (Hero harmonisation) + Batch C (Footer + O7 PlanFooter rebuild).

**Phase 4 captured but not yet started.** User-flagged concern mid-session: *"i want to pressure test the journey against the specs.. it feels so basic at the moment.. particularly in comparison to our original principles and even our V1 interview we built as a test originally."* Sequencing per user direction: get all consistent first (Phase 3 complete), then pressure-test. Phase 4 = new audit slice (`S-PROTO-pre-signup-spec-pressure-test` or similar) once B + C land.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-91.md`** — read for the round-by-round narrative, Phase 2 decision rationale, the bugs caught (O8 Back-element-type, TopBar spacer-selector, O8 StepRail Edit-ordering, verification.md emoji-strip + amend-rule violation logged), and the cumulative scoping-discipline observations on recurrence-watch.

## Session 92 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Batch B — Hero harmonisation** | Extract `components/Hero.tsx` shared primitive replacing 8 local `function Hero` / `MobileHero` declarations. Collapse 5 H1/H2 sizes to 21px serif/1.18 canonical; `<h1>` on all 8 screens (resolves SM-01 a11y must-fix); drop leading-dot eyebrow decoration; canonical eyebrow 9.5px / 0.04em letter-spacing; canonical Hero padding 16px 20px 12px + H1 top-margin 8px. Add `O2.module.css` (only screen without one) + `.entry` stagger class on O2 + O8 modules. Per audit slice §"Phase 3 batches (locked)" Batch B. | Medium-heavy | No |
| 2 | **Batch C — Footer harmonisation + O7 PlanFooter rebuild** | Extract `components/Footer.tsx` sticky-cream primitive replacing 6 local Footer functions + O1's inline-in-body footer. O7's in-flow `PlanFooter` `<section>` removed; Download-PDF + Email-link CTAs move to sticky chrome (user-directed rebuild per Phase 2 FT-04). O8 keeps its lighter `rgba(255,255,255,0.62)` blur(10px) background (intentional canvas variance preserved). Canonical wrapper padding `12px 20px 16px`; canonical CTA-enabled animation = force-reflow re-add (O4/O5 pattern); canonical caption typography = italic-when-enabled serif (O4/O5 pattern). | Medium-heavy | No |
| 3 | **Phase 4 — spec pressure-test workstream** | Open new scope-only audit slice (`S-PROTO-pre-signup-spec-pressure-test` or similar). Compare homogenised 8-screen surface against (a) CLAUDE.md §"Product positioning" + §"North star" + §"Product rules", (b) `docs/workspace-spec/65-pre-signup-interview-reconciled.md` (190L, authoritative pre-signup spec), (c) `docs/v1/v1-wireframes.md` (543L, V1 baseline). Likely candidate findings: information density per screen, cold-start vs bank-signal-driven ordering, adaptive output/decision flow, gentle-interview tone, micro-interaction density, delight surface area. Follow same scope-only-audit → joint-review → batch-impl workflow as session 91. | Heavy (Phase 4 is a programme, not a slice) | Blocked until Batch B + C land |
| 4 | **O7 visual-issues enumeration** | User-flagged "few small visual issues" on O7 at PR #161 merge (session 90), never written down. Surface during Batch B + C preview-deploy walks — these touch O7 visual treatment directly. Risk if skipped: issues survive the harmonisation undetected. | Light (in-flow with B/C) | No |
| 5 | **Desktop graceful enhancement** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Mobile chassis now stable (Batch A + D landed). | Heavy | No |
| 6 | **Production graduation backlog** | Bundle when pre-signup exits `/dev/proto/`: Batch F (token promotion — VIOLET_SOFT / MAGENTA_SOFT / PAPER_WARM / SOFT / SOFTMUTE / ICON_BG_UNSELECTED + INDIGO `#4338CA` vs `#4F46E5` reconciliation + FONT_SERIF/FONT_MONO consolidation + 8 `colors` consts centralisation via `lib/colors.ts`) · 44×44 tap-target sweep · `100vh` → `100dvh` · sticky CTA mechanism hardening · banner-role recovery (TopBar before `<main>` restructure) · `styles.backLink` orphan cleanup in O4-O6 module CSS. | Heavy | No, but premature until graduation timing decided |
| 7 | **(Inherited)** spec-citation-quote-check author-time hook | Mirror `.claude/hooks/comment-review.sh` PostToolUse Write\|Edit advisory exit-0 pattern. Catches "per spec X" without proximity quote at edit time, before CI cycle. | Light (~50L bash + shellspec) | No |
| 8 | **(Inherited)** Comment-review hook §Status exemption fix | Stub-mode hook flags "session X" provenance inside `## Status` blocks where CLAUDE.md `^## (§)?Status` exemption should apply. | Light (~20-30L bash) | No |
| 9 | **(Inherited)** Comment-review hook CSS-files regex tightening | "round N" provenance regex matched `140ms` CSS transition values false-positive in session 90. Either skip `*.css` files OR require enclosing context like "round X of". | Light (~10-20L bash) | No |
| 10 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Still parked. | Heavy | No |

**Recommended sequence:** P1 (Batch B) → P2 (Batch C) → P3 (Phase 4 spec pressure-test). P4 (O7 visual-issues enumeration) folds into B/C preview-deploy walks. P5+ are tractable side-quests off the critical path.

**Scoping-discipline observations carried as recurrence-watch (not yet numbered constraints):**

- **AC-impl cross-check at impl-time** (introduced session 90) — applied session 91 with one minor deviation surfaced (Batch A test path). Discipline holding.
- **Sibling-wrapper diff at impl-time** (carried session 88) — not surfaced session 91.
- **Shared-infrastructure audit at refactor-time** (carried session 87) — partially surfaced session 91: ScreenShell test-file importers undercounted in audit because grep pattern only checked relative-path imports. **Audit-pattern improvement noted**: also grep absolute-path imports via `@/` prefix when cataloguing "unused" components.
- **In-PR scope-expansion confirmation gate** (carried session 87) — not surfaced session 91.
- **NEW session 91 — `git push --force` after amend** — single occurrence (verification.md emoji-strip via `git commit --amend` + `git push -f`). Per CLAUDE.md: amend without explicit user request violates the "Always create NEW commits" rule; force-push compounds it. Both flagged for next-session discipline. Will promote to numbered constraint if a second session surfaces a similar incident.

## Authoritative reading order at session 92 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-91.md` (session 91's retro — audit + Phase 2 decisions + 3 batches shipped + bugs found).
3. `docs/slices/S-PROTO-cross-screen-homogenisation-audit/acceptance.md` (the master audit slice — Phase 2 outcomes + Phase 3 batches locked).
4. **For P1 (Batch B) when chosen:** read the spec template at `docs/slices/S-PROTO-batch-A-topbar-harmonisation/acceptance.md` for the established shared-primitive pattern. Then walk the 8 screens' Hero functions (line ranges in the audit slice §"F-CH-03").
5. **For P2 (Batch C) when chosen:** Hero pattern from B applies; plus the O7 PlanFooter rebuild requires understanding the in-flow `<section>` (at `O7.tsx` ~L523 pre-Batch-A; rebase against latest main).

## Session 92 kickoff prompt (paste-ready)

```
Kick off session 92.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed (claude/<scope>-XXXXX) OR
  per-batch sub-branch off latest main per session 91 pattern.
- Session 91 shipped PRs #164 (Batch A · 9ffd2bb) + #165 (Batch E ·
  92bc92f) + #166 (Batch D · bbe9093) squash-merged to main. Session-91
  wrap PR may be pending or just-merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-91.md.
3. docs/slices/S-PROTO-cross-screen-homogenisation-audit/acceptance.md
   (the master audit slice with Phase 2 outcomes + Phase 3 batches
   locked).
4. CLAUDE.md §"Visual direction" + §"Coding conduct" (homogenisation
   spans both — visual treatment + name-carries-the-design).

Confirm priority with user. SESSION-CONTEXT recommends P1
(Batch B — Hero harmonisation).

Phase 3 has 2 batches remaining (B + C); Phase 4 (spec pressure-test)
opens once they land. Established session-91 pattern: per-batch sub-
branches off latest main, slice acceptance.md + verification.md per
batch, "let's just merge" cadence (skip auto-review for prototype
slices).

Per CLAUDE.md §"AC-impl cross-check at impl-time" (recurrence-watch
session 90): before pushing impl, re-read each AC's verbatim wording
and grep impl for the structural elements named in AC.

Definition of Done (CLAUDE.md §"Definition of Done", prototype short-
form items 1, 8, 12, 14 from spec 76 §3):
- Slice acceptance.md + verification.md
- Tests written + passing
- Preview-deploy verified across the spec 72a 6+1 dimensions
- User feedback received + addressed (or explicitly deferred)

Workflow: per-batch scope (acceptance.md) → impl + tests + verification
.md → PR + merge → repeat. Webhook-driven iteration when auto-review
fires; otherwise direct merge.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Shared chassis primitives now landed: `components/TopBar.tsx` (Batch A); `components/Hero.tsx` + `components/Footer.tsx` to follow in Batches B + C.

## Branch

Session 92 branch: harness-suffixed off clean main. Session 91 shipped PRs #164 + #165 + #166. Per-batch sub-branches are an established session-91 pattern — each batch gets its own branch + PR + squash merge.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new constraints surfaced session 91.** Five scoping-discipline observations on recurrence-watch (AC-impl cross-check at impl-time · sibling-wrapper diff · shared-infra audit + abs-path-import gap · in-PR scope expansion · NEW session-91 `git push --force` after amend). Promote to numbered constraint if a third session surfaces similar recurrence for any one of them.

## Scope ceiling

Session 92 is most likely **P1 (Batch B — Hero harmonisation)** followed by **P2 (Batch C — Footer + O7 PlanFooter rebuild)** if budget permits. Out of scope unless explicitly added: P3 Phase 4 spec pressure-test (premature until B + C land) · P5 desktop · P6 production graduation · P7-10 inherited side-quests · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) are canvas-as-source on main, with shared TopBar primitive landed (Batch A) + dead-code cleaned (Batch E) + O1/O2 root `<main>` (Batch D).
