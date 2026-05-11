# Session 87 Pre-flight Context Block (carrying session 86 wrap delta)

## Session 86 wrap delta — read this first

Session 86 shipped one slice (with a gap surfaced at preview-deploy) and is wrapping with a clear next-session priority.

**PR #150 — `S-PROTO-o2-canvas-as-source · impl (AC-1..AC-4)`** — first src/ slice demonstrating the canvas-as-source pattern. Three commits across the rounds:
- `fddfda1` slice impl — O2 rewritten from canvas frame A1 via the 5-step adapt pattern (tokens · copy resolver · useProto wiring · Next.js wrap · inline helpers). `MobileFrame` + status bar dropped. 8 unit tests.
- `07812db` round-1 — auto-review's 7-finding fan-out addressed (`prefers-reduced-motion` via Tailwind `motion-reduce:!transition-none` · `aria-hidden` on decorative Arrow SVGs · `:focus-visible` outline on Chip + back + Continue · `C` → `colors` + `sw` → `strokeWidth` · 3 paraphrased spec citations rephrased to doc-pointer form to unblock the merge gate). 10 tests. Auto-review verdict moved `request-changes` → `approve`.
- `de99334` round-2 — desktop width cap. Preview-deploy user feedback caught a regression: canvas-as-source rewrite dropped `MobileFrame`'s 375px width without substituting a CSS cap, so O2 was full-width on desktop while O1/O3-O8 (still on `ScreenShell`) cap at 480px. Outer div now `w-full max-w-[480px] mx-auto` matching `ScreenShell.tsx:33`. 11 tests. Auto-review stayed `approve`.

**Header gap surfaced at preview-deploy.** User-flagged: the "Decouple." word stamp expected from `docs/design-source/pre-signup-interview/decoded/Pre-signup Canvas - Standalone.html` (the kickoff-named header source) is absent. Diagnosed: at scope-time I substituted `o2-frames.jsx`'s internal `TopBar` because the Standalone HTML is 5133L / 2.8MB inline-styled CSS and reading verbatim was awkward inside the 300-line read cap. Substitution documented in slice docs §"Out of scope" but the kickoff's design expectation went unflagged until preview review. Deferred to session 87 P1 because the header is cross-screen scope (touches `ScreenShell.tsx` for O1/O3-O8 + O2's inline `TopBar` for canvas-as-source) and an O2-only fix would create new cross-screen inconsistency.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-86.md`** — read for the round-by-round narrative, persona findings calibration, the cross-canvas scoping discipline observation, and the new known-gap class around shared-infrastructure decisions (width cap was a `ScreenShell:33` decision the canvas-as-source rewrite lost track of).

## Session 87 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Standalone header consistency across all 8 screens** | New slice `S-PROTO-header-standalone-consistency`. Apply Decouple. word stamp + cross-screen un-authenticated header treatment from `docs/design-source/pre-signup-interview/decoded/Pre-signup Canvas - Standalone.html` (decoded sibling already in repo — no decode-step needed). Touches `ScreenShell.tsx` for O1, O3-O8 (still on rebuild pattern) + O2's inline `TopBar` (canvas-as-source). Read budget at scope-time: grep for header markers in the 5133L decoded HTML, targeted offset+limit reads to extract just the header structure. Cross-screen consistency is the AC. | Medium (~150-250L est across ScreenShell + O2.tsx + acceptance/verification + tests) | No |
| 2 | **Continue canvas-as-source migration of O1, O3-O8** | One slice per screen, or batch where the canvas frames are similar (O3-O6 are all A1-style chip-card layouts). Order: O1 (entry screen, introduces the new header) → O3, O4, O5, O6 → O7 (your plan — different shape) → O8 (what's next — different shape). Each slice follows the S-PROTO-o2-canvas-as-source template. Note: P1 should land first because the header decision affects every migrated screen. | Heavy (~250-500L per screen) | Yes — wait for P1 to ship the canonical header treatment |
| 3 | **Desktop-enhanced graceful enhancement (deferred per constraint #41)** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html` is the cross-canvas reconciliation target. Help Rail integration + intermediate breakpoints + extra-space utilisation above the 480px mobile cap. Opens once mobile header consistency lands (P1). | Heavy | Yes — wait for P1 |
| 4 | **(Inherited) spec-citation-quote-check author-time hook** | Mirror `.claude/hooks/comment-review.sh` PostToolUse Write\|Edit advisory exit-0 pattern. Catches "per spec X" without proximity quote at edit time, before the CI cycle. Small standalone PR. | Light (~50L bash + shellspec) | No |
| 5 | **(Inherited) Comment-review hook §Status exemption fix** | Stub-mode hook flags "session X" provenance inside `## Status` blocks where CLAUDE.md `^## (§)?Status` exemption should apply. | Light (~20-30L bash) | No |
| 6 | **(Inherited) Spec 65 amendment for quantitative profiling data** | Still parked. | Heavy | No |

**Recommended sequence:** P1 alone. The header is the user-flagged gap from session 86's preview review; it's also the prerequisite for P2 (O3-O8 migrations would otherwise re-do the header decision inconsistently). P3 unlocks once P1 lands. P4-P6 are tractable side-quests but not on the critical path.

**Scoping-discipline observation for P1.** Session-86 retro surfaced that shared-infrastructure decisions baked into rebuild components (e.g. `ScreenShell:33`'s `maxWidth: 480`) need explicit audit at scope-time, not discovery at preview-deploy. For P1, when scoping the header treatment touching `ScreenShell.tsx`, audit what other shared-chrome decisions live there (progress rail position, eyebrow placement, back-affordance shape) and explicitly carry the ones that remain valid into both `ScreenShell` and O2's inline `TopBar` so the two stay consistent.

## Authoritative reading order at session 87 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-86.md` (last session's retro — three rounds + header gap diagnosis).
3. **For P1 (when chosen):** `docs/design-source/pre-signup-interview/decoded/Pre-signup Canvas - Standalone.html` — large (5133L / 2.8MB CSS-heavy); grep first for header markers (e.g. `Decouple`, `<header`, top-of-body markup patterns), then targeted offset+limit reads of the header section.
4. **For P1 (when scoping the consistency target):** `src/app/dev/proto/pre-signup-interview/components/ScreenShell.tsx` — the rebuild-pattern shared shell that currently chromes O1, O3-O8. The O2 canvas-as-source inline `TopBar` is the second integration surface. Spec 76 §3 + CLAUDE.md §"Visual direction" remain authoritative for category-mechanics.

## Session 87 kickoff prompt (paste-ready)

```
Kick off session 87.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state (current branch +
  HEAD vs origin/main + ahead/behind + tree state).
- Branch convention: harness-suffixed (claude/<scope>-XXXXX).
  Session 86 shipped PR #150 (S-PROTO-o2-canvas-as-source impl +
  rounds 1-2 a11y/width-cap) + PR #??? (session-86 wrap docs).
  Session 87 starts from clean main if both have merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-86.md.
3. CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype
   default)" — the 5-step adapt pattern is the template for any
   canvas-as-source work touching `ScreenShell` chrome.

Confirm priority with user. SESSION-CONTEXT recommends P1
(S-PROTO-header-standalone-consistency) — user already flagged
the Decouple. word stamp gap at preview-deploy review of session 86's
O2 pilot. Touches ScreenShell.tsx (O1, O3-O8) + O2's inline TopBar
(canvas-as-source). Cross-screen consistency is the AC.

Header source: docs/design-source/pre-signup-interview/decoded/
Pre-signup Canvas - Standalone.html. Decoded sibling already in
repo. Read discipline: grep for header markers first (Decouple,
<header, top-of-body markup), then targeted offset+limit reads to
extract just the header section. The full file is 5133L /
2.8MB CSS-heavy — full reads will blow the 300-line cap.

Slice convention: rebuild + canvas-as-source surfaces both updated
in one slice for cross-screen consistency. ScreenShell.tsx +
O2.tsx changes co-located. No `Linked canvas:` field (canvas-
fidelity persona stays dormant per the prototype policy unless
the slice opts in). **Category:** prototype.

Definition of Done (per CLAUDE.md §"Definition of Done"):
- Slice acceptance.md + verification.md per the prototype category.
- Tests written + passing where tractable (logic units + class
  presence assertions for the header DOM).
- Auto-review verdict: approve / nit-only on the impl PR.
- Preview-deploy verified in-browser per spec 72a 6-dim rubric.
  Cross-screen navigation visual consistency (O1 → O2 → O3) is
  the new dimension to walk this session.
- User feedback received + addressed (or explicitly deferred).

Scoping-discipline note (carried from session 86): audit
shared-infrastructure decisions in ScreenShell.tsx at scope-time.
The maxWidth: 480 cap was missed by O2's canvas-as-source rewrite
in session 86 and surfaced as a regression at preview-deploy.
Cross-list ScreenShell's chrome decisions (progress rail position,
eyebrow placement, back-affordance shape, header-divider treatment,
any width caps) and explicitly carry the ones that remain valid
into both ScreenShell and O2's inline TopBar.

Workflow: scope-time audit → build → preview-deploy → user
feedback → iterate. Don't pre-spec visual treatment for prototype
screens (constraint #40).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 87 branch: harness-suffixed off clean main. Session 86 shipped PR #150 (slice impl) + the session-86 wrap PR. Session 86 working branches deletable post-merge.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new constraints surfaced session 86** — the cross-canvas scoping discipline observation (audit shared-infrastructure decisions before dropping a rebuild wrapper) is documented in HANDOFF-86 as a recurrence-watch, not yet promoted to a numbered constraint.

## Scope ceiling

Session 87 is most likely P1 (standalone header consistency) alone. Out of scope unless explicitly added: P2 (continue migrating O1, O3-O8 to canvas-as-source — needs P1 first) · P3 (desktop-enhanced graceful enhancement — needs P1 first) · P4-P6 (inherited tractable side-quests) · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work (separate logged-in header out of scope for the un-authenticated header work).

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
