# S-PROTO-density-entry-O1 — Entry-scaffold primitive on O1

**Category:** prototype

## What this slice ships

A new shared `<EntryScaffold/>` primitive at `src/app/dev/proto/pre-signup-interview/components/EntryScaffold.tsx`, wired into `screens/O1.tsx` between `<TopBar>` and `<Hero>`. Carries three pieces of supportive framing: a time-commitment cue, three outcome bullets, and a reassurance line. Closes density-audit findings F-DEN-02, F-DEN-03, F-DEN-04 (see `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md`).

The primitive sits above the stage question so the user reads "what they'll get + that it's OK not to know everything" before the first commitment moment. Visual weight is secondary to the Hero question (the user's primary task is to answer); typography + spacing keep the scaffold scannable, not demanding.

## Acceptance criteria

**AC-1 — `<EntryScaffold/>` primitive shape.**
- File at `src/app/dev/proto/pre-signup-interview/components/EntryScaffold.tsx` + sibling `.module.css`.
- Props interface:
  ```ts
  interface EntryScaffoldProps {
    timeIntro: string;        // e.g. "In the next ~3 minutes, you'll:"
    outcomes: ReadonlyArray<string>;  // 3 short outcome strings
    reassurance: string;      // e.g. "You don't need to know everything. You just need to start."
    className?: string;       // Stagger animation hook
    staggerIndex?: number;
  }
  ```
- Renders: time intro (small caps sans, eyebrow weight) + outcomes (3 `<li>` items with checkmark glyphs, sans 13px) + reassurance (italic-serif 13px, matching `Hero` helperVariant pattern).
- No hardcoded colours — uses `tokens.color.*` and `tokens.font.*` exclusively (per S-F1 design-token discipline + chassis precedent).

**AC-2 — O1 wiring + copy resolver extension.**
- `screens/O1.tsx` renders `<EntryScaffold>` between `<TopBar>` and `<Hero>`.
- New copy block in `lib/copy/o1.ts` under a `entry: { timeIntro, outcomes, reassurance }` field on `O1Copy`.
- `getCopy()` returns the same entry block across all three stage variants (entry framing doesn't branch on stage selection).

**AC-3 — F-DEN-02 outcome scaffolding (3 bullets visible).**
- Three concrete outcome bullets render on O1, verbatim from V1 Welcome (`docs/v1/v1-wireframes.md` L164-170):
  - "See the likely process for your specific situation"
  - "Shape a starting plan for children, housing, and finances"
  - "Know exactly what to focus on next"
- Each bullet prefixed by a checkmark glyph (✓ U+2713 or visual equivalent).
- Note: V1's surrounding "20-30 minutes" time framing is NOT carried — AC-4 uses spec 65's "~3 minutes" since pre-signup scope is the 8-screen interview, not the full Construct journey V1 was scoping. The outcome bullets themselves remain accurate at 3-min scope (O7 produces a starting plan, O8 sets next steps).
- Negative grep audit-finding inverted: `grep -niE "you'll|in the next" src/app/dev/proto/pre-signup-interview/screens/O1.tsx` returns ≥1 match post-impl.

**AC-4 — F-DEN-03 time-commitment surfaced.**
- "~3 minutes" framing visible to the user in the EntryScaffold time intro.
- Matches spec 65 L21 ("~3 minutes, 8 screens max"); does NOT use V1's "20-30 minutes" framing (different scope).
- Negative grep audit-finding inverted: `grep -niE "minute|3 min" src/app/dev/proto/pre-signup-interview/screens/O1.tsx` returns ≥1 match post-impl.

**AC-5 — F-DEN-04 reassurance copy.**
- Verbatim from V1 (`docs/v1/v1-wireframes.md` L173-174): *"You don't need to know everything. You just need to start."*
- Renders below the outcome bullets in italic-serif 13-14px (matches Hero `helperVariant="italic-serif"` typography for visual coherence with the existing chassis).
- Negative grep audit-finding inverted: `grep -niE "don't need|just need" src/app/dev/proto/pre-signup-interview/screens/O1.tsx` returns ≥1 match post-impl.

**AC-6 — Preview-deploy 6+1 walk passes O1.**
- Spec 72a 6-dim rubric on the Vercel preview for the slice's PR: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · 375×667 mobile · screen-reader. Plus +1 visual diff (N/A per spec 72a §Out of scope — no baseline tooling).
- No regression on adjacent screens O2-O8 (smoke-walk).

## In scope

- `src/app/dev/proto/pre-signup-interview/components/EntryScaffold.tsx` (new)
- `src/app/dev/proto/pre-signup-interview/components/EntryScaffold.module.css` (new)
- `src/app/dev/proto/pre-signup-interview/screens/O1.tsx` (insert EntryScaffold render)
- `src/app/dev/proto/pre-signup-interview/lib/copy/o1.ts` (extend with `entry` block)
- `tests/components/entry-scaffold.test.tsx` (new unit tests — props rendering + accessibility)

## Out of scope

- F-DEN-01 (Why-we-ask callouts across O1-O6) — separate slice (P2 density-question batch).
- F-DEL-01..03 (delight gaps) — separate slice (P4 delight batch).
- F-OUT-01..03 (plan output gaps) — separate slice (P5 output batch).
- EntryScaffold reuse on other screens (O2-O8 do not get this primitive in this slice — the audit's scope is entry-specific to O1).
- Animation choreography beyond inherited stagger token (no per-bullet stagger, no shimmer on outcomes).
- Visual regression tooling baseline (spec 72a §Out of scope until v3c).

## References

- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-DEN-02..04 — audit findings driving this slice.
- `docs/v1/v1-wireframes.md` L150-181 — V1 Welcome baseline (outcome bullets + reassurance copy source).
- `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §O1 (L33-46) — Spec 65 O1 question that EntryScaffold sits above; L21 "~3 minutes, 8 screens max" principle anchoring AC-4.
- `CLAUDE.md` §"Product positioning" (warm-hand-on-a-cold-day) + §"North star" (stressed user, late at night).
- `docs/workspace-spec/72a-preview-deploy-rubric.md` — 6+1 rubric for AC-6.

## Definition of Done (prototype short-form per spec 76 §3)

- [ ] Item 1: acceptance.md + verification.md present and accurate
- [ ] Item 8: tests written + passing (unit; integration where applicable)
- [ ] Item 12: preview-deploy 6+1 walk evidenced in verification.md
- [ ] Item 14: user feedback received + addressed (or explicitly deferred)
- [ ] Security checklist short-form (items 1, 8, 12, 14 from spec 72 §11)
