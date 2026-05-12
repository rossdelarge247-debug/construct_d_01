# Session 93 Pre-flight Context Block (carrying session 92 wrap delta)

## Session 92 wrap delta — read this first

Session 92 shipped **Phase 3 Batch B (Hero harmonisation, full) + Phase 3 Batch C (Footer harmonisation, PARTIAL — primitive + 3 of 7 screens + 7 of 12 tests).**

**Batch B merged:** PR #168 squash-merged to main as `d49da6e`. Net +540/-399 across 20 files. Shared `components/Hero.tsx` (73L) + `Hero.module.css` (3L) extracted; all 8 screens flip `<h2>` → `<h1>` (F-SM-01 a11y must-fix); 5 H1/H2 sizes (19/21/26/30/38) collapse to canonical 21px serif/1.18/-0.02em/600; eyebrow 9.5px sans / 0.04em; leading-dot dropped on O4/O5/O6/O8; canonical Hero padding `16px 20px 12px` + H1 top-margin 8px; O2.module.css created (`.entry` stagger + reduced-motion fallback); 9 new Hero unit tests; 514/514 cross-suite pass. O7 mood-band wrapper retained around shared Hero (canvas-distinctive preservation honoured).

**Batch C open as draft PR #169 (PARTIAL):** branch `claude/S-PROTO-batch-C-footer-harmonisation`. Net +500/-207 across 8 files. Shared `components/Footer.tsx` (67L) + `Footer.module.css` (93L) extracted with sticky `<footer>` landmark, canonical padding `12px 20px 16px`, cream + light variants (variant="light" preserves O8 lighter blur), italic-when-enabled / sans-when-disabled caption typography, force-reflow CTA-bounce on `false → true` transition, optional secondaryActions slot for the O7 rebuild, prefers-reduced-motion fallback. O1 (inline-in-body footer markup) + O2 + O3 swept to shared Footer. 7 of 12 AC-4 unit tests shipped. 521/521 cross-suite pass.

**Wrap reason:** session churn warn surfaced at 1,500; rather than push past the 2,000 hard-stop, partial state shipped clean. Resumption checklist in PR #169's `verification.md`.

## Session 93 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Resume Batch C — sweep O4/O5/O6/O8 + rebuild O7 PlanFooter + finish AC-4 tests** | Mechanical sweep on O4/O5/O6 (call-site shape mostly matches Footer API; O6 loses always-on mount-fire animation per canonical). O8 needs `variant="light"` + conditional caption/CTA-label per `selected` state. O7 PlanFooter rebuild: delete in-flow `<section>` (heading + helper + Find-out-more + pricing links all gone) + delete sticky `<div>` + replace `<PlanFooter/>` call-site with `<Footer ctaLabel="What's next" onContinue={onNext} secondaryActions={<Download-PDF + Email-link>}/>`. 5 remaining AC-4 tests. Full preview-deploy 6-dim walk. Then update PR #169 (or close + open fresh PR if cleaner) and merge. Session-locked sub-decisions captured in PR #169 body + Batch C acceptance.md. | Medium | No — fresh churn budget |
| 2 | **Phase 4 — spec pressure-test workstream** | Open `S-PROTO-pre-signup-spec-pressure-test` audit slice once Batch C fully lands. Compare homogenised 8-screen surface against CLAUDE.md §"Product positioning" + §"North star" + §"Product rules", `docs/workspace-spec/65-pre-signup-interview-reconciled.md` (190L), `docs/v1/v1-wireframes.md` (543L). User-flagged: *"feels basic"* relative to V1 baseline. Same scope-only-audit → joint-review → batch-impl workflow as the homogenisation programme. | Heavy (Phase 4 is a programme, not a slice) | Blocked until Batch C fully lands |
| 3 | **O7 visual-issues enumeration** | Inherited from session 90: user-flagged "few small visual issues" on O7 at PR #161 merge, never written down. Surface during Batch C resumption preview-deploy walk — that walk touches O7 visual treatment directly (mood-band Hero + rebuilt Footer). | Light (in-flow with Batch C preview-deploy) | No |
| 4 | **Desktop graceful enhancement** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Mobile chassis fully stable post-Batch-C (TopBar + Hero + Footer + `<main>` all canonical). | Heavy | Blocked until Batch C fully lands |
| 5 | **Production graduation backlog** | Bundle when pre-signup exits `/dev/proto/`: Batch F (token promotion — VIOLET_SOFT / MAGENTA_SOFT / PAPER_WARM / SOFT / SOFTMUTE / ICON_BG_UNSELECTED + INDIGO `#4338CA` vs `#4F46E5` reconciliation + FONT_SERIF/FONT_MONO consolidation + 8 `colors` consts centralisation via `lib/colors.ts`) · 44×44 tap-target sweep · `100vh` → `100dvh` · sticky CTA mechanism hardening · banner-role recovery (TopBar before `<main>` restructure) · `styles.backLink` orphan cleanup in O4-O6 module CSS. | Heavy | Not blocked but premature until graduation timing decided |
| 6 | **(Inherited)** spec-citation-quote-check author-time hook | Mirror `.claude/hooks/comment-review.sh` PostToolUse Write\|Edit advisory exit-0 pattern. Catches "per spec X" without proximity quote at edit time. | Light (~50L bash + shellspec) | No |
| 7 | **(Inherited)** Comment-review hook §Status exemption fix | Stub-mode hook flags "session X" provenance inside `## Status` blocks where CLAUDE.md `^## (§)?Status` exemption should apply. | Light (~20-30L bash) | No |
| 8 | **(Inherited)** Comment-review hook CSS-files regex tightening | "round N" provenance regex matched `140ms` CSS transition values false-positive in session 90. Either skip `*.css` files OR require enclosing context like "round X of". | Light (~10-20L bash) | No |
| 9 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Still parked. | Heavy | No |

**Recommended sequence:** P1 (resume + finish Batch C) → P2 (Phase 4 spec pressure-test workstream). P3 (O7 visual-issues enumeration) folds into P1 preview-deploy walk. P4+ are tractable side-quests off the critical path.

**Scoping-discipline observations carried as recurrence-watch (not yet numbered constraints):**

- **AC-impl cross-check at impl-time** (introduced session 90) — applied this session; discipline holding.
- **Sibling-wrapper diff at impl-time** (carried session 88) — not surfaced this session.
- **Shared-infrastructure audit at refactor-time** (carried session 87 + 91) — pattern improvement noted in session 91 (abs-path imports) not surfaced this session.
- **In-PR scope-expansion confirmation gate** (carried session 87) — not surfaced this session.
- **`git push --force` after amend** (logged session 91) — not surfaced this session.
- **NEW this session — Wrap at the warn threshold rather than push to hard-stop.** When the line-count hook surfaced the 1,500 warn mid-batch, the right call was to checkpoint as a PARTIAL PR + wrap, not push to 2,000. Cleaner state on resume than half-built work in working memory.
- **NEW this session — Read-cap discipline holding under sustained sweep.** Two hits on the 300-line read-cap during the Batch B + Batch C surveys (both during O5/O7 inspection where the 8-screen survey lookups stacked up). Both worked-around via grep + remembered-from-survey patterns; no need to re-Read full files. The cap is doing its job.

## Authoritative reading order at session 93 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-92.md` (session 92's retro — Batch B full + Batch C partial + wrap rationale).
3. `docs/slices/S-PROTO-batch-C-footer-harmonisation/acceptance.md` (full slice scope, including the AC-3 O7 rebuild deferred this session + the 4 remaining screen sweeps).
4. `docs/slices/S-PROTO-batch-C-footer-harmonisation/verification.md` (current PARTIAL state + resumption checklist).
5. **For P1 (Batch C resume) when chosen:** read the Footer primitive at `src/app/dev/proto/pre-signup-interview/components/Footer.tsx` to internalise the API; then sweep O4/O5/O6/O8 + rebuild O7 PlanFooter.

## Session 93 kickoff prompt (paste-ready)

```
Kick off session 93.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Session 92 shipped PR #168 (Batch B · d49da6e) squash-merged to main.
- PR #169 (Batch C PARTIAL) open as draft on branch
  claude/S-PROTO-batch-C-footer-harmonisation.
- Session-92 wrap PR pending or just-merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin <branch> → git checkout -B
  <branch> origin/<branch>.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-92.md.
3. docs/slices/S-PROTO-batch-C-footer-harmonisation/acceptance.md
   (full slice scope).
4. docs/slices/S-PROTO-batch-C-footer-harmonisation/verification.md
   (PARTIAL state + resumption checklist).
5. src/app/dev/proto/pre-signup-interview/components/Footer.tsx
   (the primitive to consume).

Confirm priority with user. SESSION-CONTEXT recommends P1
(resume Batch C: sweep O4/O5/O6/O8 + rebuild O7 PlanFooter +
finish AC-4 tests + preview-deploy walk + merge PR #169).

Resumption mechanics: branch is already open at
claude/S-PROTO-batch-C-footer-harmonisation; pull latest;
continue committing on that branch + push back to PR #169;
flip PR from draft to ready when AC-3 + remaining sweeps land.

Per CLAUDE.md §"AC-impl cross-check at impl-time"
(recurrence-watch session 90): before pushing impl, re-read
each AC's verbatim wording and grep impl for the structural
elements named in AC.

Definition of Done (CLAUDE.md §"Definition of Done", prototype
short-form items 1, 8, 12, 14 from spec 76 §3):
- Slice acceptance.md + verification.md (acceptance already
  drafted; verification.md updates from PARTIAL → full)
- Tests written + passing (AC-4: 7 done, 5 deferred)
- Preview-deploy verified across the spec 72a 6+1 dimensions
- User feedback received + addressed (or explicitly deferred)
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 16 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Shared chassis primitives landed: `components/TopBar.tsx` (Batch A) + `components/Hero.tsx` (Batch B) + `components/Footer.tsx` (Batch C, primitive shipped + 3 of 7 screens swept).

## Branch

Session 93 branch: harness-suffixed off latest main, OR (recommended) continue on `claude/S-PROTO-batch-C-footer-harmonisation` to finish PR #169. Per-batch sub-branches off main remains the established pattern.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new constraints surfaced session 92.** Five scoping-discipline observations on recurrence-watch (AC-impl cross-check at impl-time · sibling-wrapper diff · shared-infra audit + abs-path-import gap · in-PR scope expansion · `git push --force` after amend) plus 2 NEW session-92 observations (wrap-at-warn-not-hard-stop · read-cap holding under sustained sweep).

## Scope ceiling

Session 93 is most likely **P1 (resume + finish Batch C)** followed by **P2 (Phase 4 spec pressure-test workstream)** if budget permits. Out of scope unless explicitly added: P4 desktop · P5 production graduation · P6-9 inherited side-quests · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) are canvas-as-source on main, with shared TopBar (Batch A) + shared Hero (Batch B) + partial shared Footer (Batch C — primitive shipped, 3 of 7 screens swept on PR #169).
