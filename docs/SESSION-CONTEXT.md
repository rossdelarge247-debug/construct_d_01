# Session 94 Pre-flight Context Block (carrying session 93 wrap delta)

## Session 93 wrap delta — read this first

Session 93 resumed and **completed Phase 3 Batch C** (footer harmonisation), shipping the shared `Footer` primitive end-to-end across the pre-signup interview's 8 screens. The cross-screen homogenisation programme's Phase 3 is now **fully complete** (Batches A · B · C · D · E all merged); **Phase 4 (spec pressure-test) is unblocked**.

**Shipped this session:** PR #169 squash-merged to main as **`c3c5f88` — `S-PROTO-batch-C-footer-harmonisation · shared Footer primitive (AC-1..AC-6)`**. Resumption from session 92's PARTIAL state: O4 + O5 + O6 mechanical sweeps + O8 sweep (`variant="light"` + conditional caption + UX-shift to "both prompt + disabled CTA" rather than either/or) + O7 PlanFooter rebuild (AC-3, -100L deletion + sticky-cream chassis with Download-PDF + Email-link secondary actions alongside "What's next" primary) + 5 deferred AC-4 tests (12/12 final) + 2 `o7-canvas-as-source.test.tsx` updates for the AC-3 surface change + verification.md rewritten to full-state.

**Net diff vs main:** +351 / -416 lines across 13 files. Tests + typecheck both clean (526/526 across 79 files; +5 from session 92).

**Architectural deferrals captured in verification.md:** O6 always-on mount-fire animation NOT preserved · per-screen module-CSS `.cta` orphans in O4/O5/O6 (defer to Batch F production graduation) · `<footer>` banner-role recovery (carried from Batch D).

**AC-5 preview-deploy 6+1 walk deferred** per user-directed "let's just merge" cadence — sits in verification.md as a known carry-over for session 94.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-93.md`** — read for the round-by-round narrative, the comment-review hook catch on "PR #169" provenance (caught at author-time, pre-commit), and the two new scoping-discipline observations on recurrence-watch (verification.md PARTIAL internal contradiction + read-cap accumulation during sweep cycles).

## Session 94 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **AC-5 preview-deploy 6+1 walk for Batch C** | Closes Batch C DoD. Walk all 8 screens on the merged main's Vercel preview (golden path · edge cases · prefers-reduced-motion · keyboard-only · 375×667 mobile viewport · screen reader · visual diff against pre-batch). Update `docs/slices/S-PROTO-batch-C-footer-harmonisation/verification.md` §"Preview-deploy verification" table from "pending" → evidenced rows. | Light | No |
| 2 | **Phase 4 spec pressure-test workstream** | The user-flagged concern from session 91 mid-session: *"i want to pressure test the journey against the specs.. it feels so basic at the moment.."*. Open new scope-only audit slice comparing the homogenised 8-screen surface against (a) CLAUDE.md §"Product positioning" + §"North star" + §"Product rules", (b) `docs/workspace-spec/65-pre-signup-interview-reconciled.md`, (c) `docs/v1/v1-wireframes.md`. Likely findings: information density · cold-start vs bank-signal-driven ordering · adaptive output/decision flow · gentle-interview tone · micro-interaction density · delight surface area. Same workflow as session 91: scope-only-audit → joint-review → batch-impl. | Heavy (programme, not slice) | No |
| 3 | **Desktop graceful enhancement** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Mobile chassis fully stable post-Batches A/B/C/D. | Heavy | No |
| 4 | **Production graduation backlog** | Bundle when pre-signup exits `/dev/proto/`: Batch F (token promotion + `lib/colors.ts` palette centralisation + FONT_SERIF/FONT_MONO consolidation + off-palette token promotion + 44×44 tap-target sweep + `100vh` → `100dvh` + sticky CTA hardening + banner-role recovery + per-screen module-CSS `.cta` orphan cleanup from Batch C deferrals). | Heavy | No, but premature until graduation timing decided |
| 5 | **(Inherited)** spec-citation-quote-check author-time hook | Mirror `.claude/hooks/comment-review.sh` PostToolUse Write\|Edit advisory exit-0 pattern. Catches "per spec X" without proximity quote at edit time, before CI cycle. | Light (~50L bash + shellspec) | No |
| 6 | **(Inherited)** Comment-review hook §Status exemption fix | Stub-mode hook flags "session X" provenance inside `## Status` blocks where CLAUDE.md `^## (§)?Status` exemption should apply. | Light (~20-30L bash) | No |
| 7 | **(Inherited)** Comment-review hook CSS-files regex tightening | "round N" provenance regex matched `140ms` CSS transition values false-positive (session 90 sighting). Skip `*.css` files OR require enclosing context like "round X of". | Light (~10-20L bash) | No |
| 8 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Still parked. | Heavy | No |

**Recommended sequence:** P1 (preview-deploy walk — closes Batch C DoD; 30-45 min) → P2 (Phase 4 audit, scope-only) → P3+ as time allows.

**Scoping-discipline observations carried as recurrence-watch (not yet numbered constraints):**

- **AC-impl cross-check at impl-time** (introduced session 90) — applied session 93 without deviation. Discipline holding.
- **Sibling-wrapper diff at impl-time** (carried session 88) — not surfaced session 93.
- **Shared-infrastructure audit at refactor-time** (carried session 87) — not surfaced session 93.
- **In-PR scope-expansion confirmation gate** (carried session 87) — not surfaced session 93.
- **`git push --force` after amend** (carried session 91) — single occurrence at session 91; not triggered session 93. Promote to numbered constraint if a second session surfaces a similar incident.
- **NEW session 93 — verification.md PARTIAL internal contradiction.** L41 ↔ L43 inconsistency in session 92's wrap-drafted PARTIAL verification.md (caught at full-state rewrite). Single occurrence. Promotion threshold: third PARTIAL-shipment with similar drafting bug. Mitigation in the meantime: walk PARTIAL verification.md end-to-end once before commit.
- **NEW session 93 — read-cap accumulation during sweep cycles.** Slice-context reads (primitive 67 + acceptance 176 + verification 70 ≈ 313L) ate the 300L turn budget before screen reads landed; one O6 read was denied mid-flight. Mitigation candidates: line-range hints next to AC sweep targets in acceptance.md; defer acceptance re-read to per-AC impl-time; tighten grep-first habit. Promotion threshold: a second slice's sweep work significantly slowed by read-cap budget management.

## Authoritative reading order at session 94 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-93.md` (session 93's retro — Batch C resumption + full-slice ship + bugs caught + 2 new recurrence-watch observations).
3. `docs/HANDOFF-SESSION-92.md` (session 92's retro — Batch B ship + Batch C PARTIAL ship + wrap-at-warn rationale).
4. **For P1 (preview-deploy walk):** read `docs/slices/S-PROTO-batch-C-footer-harmonisation/verification.md` §"Preview-deploy verification" + `docs/workspace-spec/72a-preview-deploy-rubric.md` (the 6-dim contract).
5. **For P2 (Phase 4 audit):** read `docs/workspace-spec/65-pre-signup-interview-reconciled.md` (190L pre-signup spec, authoritative) + `docs/v1/v1-wireframes.md` (543L V1 baseline) selectively per section.

## Session 94 kickoff prompt (paste-ready)

```
Kick off session 94.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed (claude/<scope>-XXXXX) OR
  per-batch sub-branch off latest main.
- Session 93 shipped PR #169 (Batch C · c3c5f88) squash-merged to main
  + session-93 wrap PR pending or just-merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-93.md.
3. docs/HANDOFF-SESSION-92.md.
4. For P1 (preview-deploy walk): docs/slices/S-PROTO-batch-C-
   footer-harmonisation/verification.md §"Preview-deploy verification"
   + docs/workspace-spec/72a-preview-deploy-rubric.md.
5. For P2 (Phase 4): docs/workspace-spec/65-pre-signup-interview-
   reconciled.md + selected sections of docs/v1/v1-wireframes.md.

Confirm priority with user. SESSION-CONTEXT recommends P1
(preview-deploy 6+1 walk — closes Batch C DoD; 30-45 min) followed
by P2 (Phase 4 spec pressure-test, scope-only audit).

Per CLAUDE.md §"AC-impl cross-check at impl-time" (recurrence-watch
session 90): before pushing impl, re-read each AC's verbatim wording
and grep impl for the structural elements named in AC.

Definition of Done (CLAUDE.md §"Definition of Done", prototype short-
form items 1, 8, 12, 14 from spec 76 §3):
- Slice acceptance.md + verification.md
- Tests written + passing
- Preview-deploy verified across the spec 72a 6+1 dimensions
- User feedback received + addressed (or explicitly deferred)
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Shared chassis primitives all landed: `components/TopBar.tsx` (Batch A) · `components/Hero.tsx` (Batch B) · `components/Footer.tsx` (Batch C).

## Branch

Session 94 branch: harness-suffixed off clean main, OR scope-named sub-branch per the established Phase 3 pattern. Session 93 shipped PR #169 (`c3c5f88`) + session-93 wrap PR bundling HANDOFF-92 + HANDOFF-93 + this SESSION-CONTEXT refresh.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 93.** Seven scoping-discipline observations on recurrence-watch (5 carried + 2 new). Promote to numbered constraint if a third session surfaces similar recurrence for any one of them.

## Scope ceiling

Session 94 is most likely **P1 (preview-deploy walk — closes Batch C DoD)** followed by **P2 (Phase 4 scope-only audit)** if budget permits. Out of scope unless explicitly added: P3 desktop · P4 production graduation · P5-8 inherited side-quests · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) are canvas-as-source on main, with three shared chassis primitives landed (TopBar + Hero + Footer) + dead-code cleaned + O1/O2 root `<main>` + O7 PlanFooter `<section>` removed.
