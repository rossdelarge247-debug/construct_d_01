# Session 90 Pre-flight Context Block (carrying session 89 wrap delta)

## Session 89 wrap delta — read this first

Session 89 shipped two slices: O5 (A3+B1+C2 after mid-PR variant switch) and O6 (A1+B1+C1 multi-select chip grid).

**PR #158 — `S-PROTO-o5-canvas-as-source · impl (AC-1..AC-4) (#158)`** — squash-merged to main as `0d94459`. Four commits across three auto-review rounds + one user-driven variant switch (A1 → A3 after preview pre-flight). State rename `PartnerAwareness` to match canvas keys. 11 unit tests.

**PR #159 — `S-PROTO-o6-canvas-as-source · impl (AC-1..AC-4) (#159)`** — squash-merged to main as `dcf3786`. Two commits across one auto-review round (5 findings → all addressed → round-2 approve with 0 findings). 11 unit tests.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-89.md`** — round-by-round narrative, the A1→A3 mid-PR switch flow, the canvas-paraphrase-rot lesson, persona-finding tracking.

## Important scoping correction carried into session 90

The session-89 kickoff treated "both O5 and O6 are A1-style chip-card layouts (same template as O3 + O4)". This was a paraphrase that didn't survive verification. **Reality:**

- **O5 = radio group, 4 options, single fieldset.** Same chassis as O4.
- **O6 = multi-select chip grid, 2 groups (priorities + worries), cap=3 per group, CTA always enabled.** Structurally distinct from O3-O5.

Per CLAUDE.md §"Distrust your own summaries": kickoff/SESSION-CONTEXT paraphrases of canvas content rot. Verify against `jsx/o{N}-frames.jsx` before treating the framing as authorised.

## Session 90 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Continue canvas-as-source migration: O7** | Frame source: `docs/design-source/pre-signup-interview/o7-your-plan-expressive.html`. **Scoping caveat:** O7 has 4 JSX files (`o7-page.jsx`, `o7-components.jsx`, `o7-plan-page.jsx`, `o7-plan-components.jsx`) — substantially larger than O6 was. May warrant its own session or staged into multiple slices. Verify scope at session-90 turn 1 before committing to single-slice. | Heavy | No |
| 2 | **Canvas-as-source migration: O8** | Frame source: `o8-whats-next-expressive.html`. Single JSX file (`o8-frames.jsx`). Smaller than O7; could ship same session if O7 fits. | Medium | No |
| 3 | **Desktop-enhanced graceful enhancement (deferred per constraint #41)** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. | Heavy | Yes — until all 8 screens canvas-as-source migrated (after P1 + P2) |
| 4 | **Production graduation backlog (parked across `verification.md` §"Architectural deferrals")** | AC-1 sticky CTA mechanism · 44×44 touch target on Back · 44×44 chip touch-targets (NEW from O6) · `100dvh` vs `100vh` sweep · unmapped hex literals tokenisation (#FFFFFF / #C9C5BD / #EAE7DF / #A8A29E / rgba(245,245,244,0.85)) · `aria-labelledby` redundancy sweep on fieldset/legend (O4 + O5). Bundle into a single production-graduation pass when the pre-signup flow exits `/dev/proto/`. | Medium | No, but premature until production graduation timing is decided |
| 5 | **(Inherited) spec-citation-quote-check author-time hook** | Mirror `.claude/hooks/comment-review.sh` PostToolUse Write\|Edit advisory exit-0 pattern. Catches "per spec X" without proximity quote at edit time, before CI cycle. | Light | No |
| 6 | **(Inherited) Comment-review hook §Status exemption fix** | Stub-mode hook flags "session X" provenance inside `## Status` blocks where CLAUDE.md `^## (§)?Status` exemption should apply. | Light | No |
| 7 | **(NEW session 89) Comment-review hook `round \d+` false-positive** | Regex matches "round" inside "back**ground** 120ms" (CSS transition lines), flagging "round 120" as provenance. Add word-boundary to the regex without weakening real provenance detection. | Light | No |
| 8 | **(Inherited) Spec 65 amendment for quantitative profiling data** | Still parked. | Heavy | No |

**Recommended sequence:** P1 first (O7). The scoping-caveat warrants turn-1 verification before committing to single-slice or staged-multi-slice. P2 (O8) follows if O7 fits in-session. P3 unblocks once all 8 ship. P4 bundles for production graduation. P5-P8 tractable side-quests off the critical path.

**Scoping-discipline observations carried as recurrence-watch (still not yet numbered constraints — but each held cleanly this session):**

- **Sibling-wrapper diff at impl-time** (session 88 origin) — when implementing a screen that's structurally a sibling of an established pattern, diff your top-level wrapper against the sibling's wrapper before pushing. Held cleanly on both O5 + O6 this session.
- **Shared-infrastructure audit at refactor-time** (session 87 origin) — when rewriting or extracting a shared component, enumerate the prior implementation's guarantees and carry each forward.
- **In-PR scope expansion confirmation gate** (session 87 origin) — when user authorises expanding a slice's scope mid-PR, document atomically in `acceptance.md` + `verification.md` with user-direction provenance verbatim. Exercised cleanly on O5's A1 → A3 switch.

## Authoritative reading order at session 90 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-89.md` (last session's retro — O5 cycle including A1→A3 switch + O6 cycle + persona findings).
3. **For P1 (when chosen):** scoping-caveat verification first — `wc -l docs/design-source/pre-signup-interview/jsx/o7-*.jsx` and the bundled HTML; decide single-slice vs staged before drafting acceptance.md. Per CLAUDE.md §"Pre-priority canvas-fidelity verification".
4. **For P1 (cross-screen pattern reference):** `src/app/dev/proto/pre-signup-interview/screens/O5.tsx` + `O6.tsx` + `components/{Arrow,BrandBar,ProgressPill}.tsx` — the established canvas-as-source pattern. New slices instantiate this template if visual shape matches; otherwise novel scope per canvas.

## Session 90 kickoff prompt (paste-ready)

```
Kick off session 90.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state (current branch +
  HEAD vs origin/main + ahead/behind + tree state).
- Branch convention: harness-suffixed (claude/<scope>-XXXXX).
- Session 89 shipped PRs #158 (O5, 0d94459) + #159 (O6, dcf3786)
  squash-merged to main. Session 89 wrap PR pending or just-merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-89.md.
3. CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype
   default)" — the 5-step adapt pattern.

Confirm priority with user. SESSION-CONTEXT recommends P1 (O7
canvas-as-source migration). Important scoping caveat: O7 has
4 JSX files; verify scope at turn 1 before committing to a
single-slice approach. May warrant staged multi-slice.

Frame sources:
- O7: docs/design-source/pre-signup-interview/o7-your-plan-expressive.html
  + jsx/{o7-page.jsx, o7-components.jsx, o7-plan-page.jsx, o7-plan-components.jsx}
- O8: o8-whats-next-expressive.html + jsx/o8-frames.jsx

Per CLAUDE.md §"Pre-priority canvas-fidelity verification": verify
decoded sibling exists at docs/design-source/pre-signup-interview/
decoded/ OR run scripts/decode-bundler-canvas.sh OR confirm sibling
jsx file exists (O7 + O8 both have parallel JSX).

Slice convention: no `Linked canvas:` field (canvas-fidelity persona
stays dormant per the prototype default). **Category:** prototype.
Per-AC evidence cites the canvas inline.

Cross-screen pattern (now established across O1-O6):
- Shared <BrandBar> + bespoke TopBar (Back + Arrow + ProgressPill
  + matched-width right spacer + bottom border)
- Hero (eyebrow with accent dot + serif H2 + optional helper)
- Body region varies per screen (radios / chip-grid / etc)
- Footer chassis (cream rgba(245,245,244,0.85) + blur(8px) + caption
  + dark pill button with right-arrow strokeWidth=2)
- O5.module.css / O6.module.css template: entry stagger via
  --stagger-index + chip / chip-card transitions 120ms ease-out
  + CTA bounce + reduced-motion fallback (opacity override scoped
  to .entry only, NOT .chip — per session-89 round-1 fix)
- <main> wrapper: width 100%, maxWidth 480, margin '0 auto',
  paddingTop 24, minHeight '100vh', flex column. NO background.

Definition of Done (CLAUDE.md §"Definition of Done", prototype
short-form items 1, 8, 12, 14 per spec 76 §3):
- Slice acceptance.md + verification.md
- Tests written + passing
- Auto-review verdict: approve / nit-only on impl PR (3 specialists)
- Preview-deploy verified per spec 72a 6+1 dimension rubric
- User feedback received + addressed (or explicitly deferred)

Scoping-discipline checks (recurrence-watch, not yet constraints):
1. Sibling-wrapper diff at impl-time. Held cleanly on O5 + O6.
2. Shared-infrastructure audit at refactor-time.
3. In-PR scope expansion confirmation gate. Exercised cleanly on
   O5's A1→A3 switch.

Workflow: scope-time audit (variant pick + scope-size check) →
build → preview-deploy → user feedback → iterate. Webhook-driven
iteration loop (subscribe to PR activity, no polling) — established
pattern from sessions 87 + 88 + 89.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens; magenta accent already present from prior session) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 90 branch: harness-suffixed off clean main. Session 89 shipped PRs #158 + #159 + the session-89 wrap PR. Session 89 working branches deletable post-merge (auto-deleted by squash-merge).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 89.** Three scoping-discipline observations on recurrence-watch (sibling-wrapper diff at impl-time; shared-infrastructure audit at refactor-time; in-PR scope expansion confirmation gate). All exercised cleanly this session.

## Scope ceiling

Session 90 is most likely P1 (O7 canvas-as-source migration), possibly P1 + P2 if O7 fits in single-slice + O8 has tractable scope. Out of scope unless explicitly added: P3 (desktop-enhanced graceful enhancement — needs all 8 screens migrated first) · P4 (production graduation backlog — premature) · P5-P8 (inherited tractable side-quests) · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
