# S-PROTO-o6-canvas-as-source

**Category:** prototype

## Scope

Port the O6 frame ("A few words on what matters to you, and what's worrying you.") from the Claude AI Design canvas to `src/app/dev/proto/pre-signup-interview/screens/O6.tsx` via the 5-step canvas-as-source pattern (CLAUDE.md §"Visual direction" §"Canvas-as-source"). Replaces the current V1 placeholder (`ScreenShell` + `CheckChips` + `SubQuestionCard` abstractions).

Canvas source: `docs/design-source/pre-signup-interview/jsx/o6-frames.jsx`. The canvas exposes 9 variants across three orthogonal axes (A × B × C); user-confirmed pick at scoping is **A1 + B1 + C1** — `StaticFrame` with `aTreatment="A1" bVariant="B1" cVariant="C1"` (canvas L491-L495 + FormBody A1 branch L411-L417).

- **A1** — group separation as two stacked `CardPlate` cards (priorities + worries), each in its own white-border 18px-radius card.
- **B1** — cap feedback "disabled at cap": unselected chips disabled when 3 selected per group.
- **C1** — empty-state guidance terse: single-line *"Pick up to 3."* caption below each group header.

O6 is structurally distinct from O3/O4/O5: it's a multi-select chip grid (not a radio group). Two semantic groups, each with up to 3 selections. The CTA is **always enabled** — there is no min-pick gate (canvas comment L450 verbatim: *"No min-1 enforcement — Continue is always enabled."*). CTA label is **"Build my plan"** (last step before the plan; not "Continue").

## In scope

- `src/app/dev/proto/pre-signup-interview/screens/O6.tsx` — full rewrite (current 60-line V1 placeholder discarded).
- `src/app/dev/proto/pre-signup-interview/screens/O6.module.css` — new file: entry stagger, chip transitions, CTA bounce, reduced-motion fallback (mirrors O5).
- `src/app/dev/proto/pre-signup-interview/lib/copy/o6.ts` — rewrite copy shape to match canvas (eyebrow + heading + group titles + chip labels + captions + CTA).
- `tests/unit/proto-pre-signup/o6-canvas-as-source.test.tsx` — new unit tests covering chip groups, cap=3 disabled-at-cap, caption state machine, CTA-always-enabled, decorative SVG a11y.
- No state-rename: `Priority` + `Worry` union literals in `lib/types.ts` already match canvas option keys (verified at scoping). `WhatMattersAnswers.priorities`/`worries` arrays stay as-is.

## Out of scope

- Canvas variants A2 (hairline switch), A3 (tabbed · gated), B2 (oldest rolls out), B3 (calm hint below), C2 (acknowledging), C3 (inline counter) — only A1+B1+C1 ships (user-confirmed pick at scoping).
- Production-graduation backlog items (sticky-CTA hardening, 44×44 touch target on Back, `100dvh` vs `100vh` sweep) — bundle deferred to a single production-graduation pass when the pre-signup flow exits `/dev/proto/`.
- Shared component refactors — no changes to `BrandBar`, `Arrow`, `ProgressPill`, `tokens.ts` (magenta already at `tokens.color.accent.magenta = '#BE185D'`).
- O5 — already merged at `0d94459`.

## Acceptance criteria

### AC-1 — Visual structure mirrors canvas A1+B1+C1

The O6 page is the canvas-derived composition at `jsx/o6-frames.jsx` `StaticFrame` (L464-L487), with shared chassis matching O3/O4/O5 siblings:

1. **Shared `<BrandBar>` + bespoke `<TopBar>`** — Back/Home link, Arrow, `<ProgressPill current={6} total={8} />`, matched-width right spacer, 1px bottom border (cross-screen chassis).
2. **Hero** at `jsx/o6-frames.jsx` L121-L133:
   - Eyebrow row: 5×5 `tokens.color.accent.magenta` dot + *"What matters · last step before your plan"* text (fontSize 9.5).
   - H2: *"A few words on what matters to you, and what's worrying you."* — serif, fontSize 19, lineHeight 1.2, letterSpacing -0.015em, fontWeight 600.
   - No helper sub-stem (Hero is just eyebrow + H2).
3. **Body** — two stacked `CardPlate` containers (canvas FormBody A1 branch L411-L417), wrapped in `<div>` with `padding: 8px 16px 12px` + `gap: 12px` between cards:
   - Each `CardPlate`: white background, 1px `colors.border`, borderRadius 18, padding 16, `boxShadow: '0 1px 0 rgba(0,0,0,0.02)'`.
   - First card holds the priorities group; second card holds the worries group.
4. **Group** (per `jsx/o6-frames.jsx` L265-L278) inside each card:
   - GroupHeader: serif 15.5px, fontWeight 600, lineHeight 1.25, color `colors.ink`. Titles: *"What's most important to you right now?"* (priorities) and *"What worries you most?"* (worries).
   - GroupCaption (C1): 11.5px in `colors.muted`, `marginTop: 4`, lineHeight 1.4. Text: *"Pick up to 3."*.
   - ChipGrid: `flex-wrap` row with `gap: 6` (`gap-1.5`), `marginTop: 10`.
5. **Chip** (per `jsx/o6-frames.jsx` L138-L171):
   - `<button type="button" aria-pressed={selected} disabled={disabled}>`.
   - Border-radius 999 (pill), padding `8px 12px`, fontSize 12.5, fontWeight 500, lineHeight 1.2.
   - Background ink-when-selected / white otherwise; border `1px solid` ink-when-selected, `#EAE7DF`-when-disabled, `colors.border` otherwise.
   - Color: white-when-selected / `#A8A29E`-when-disabled (FAINT) / `colors.ink` otherwise.
   - Opacity 0.3 when disabled.
   - 14×14 outer dot (1.5px border) + 8×8 SVG checkmark (white stroke 1.6, path `M2 5.2 L4.2 7.4 L8 3.2`) when selected.
6. **Group a11y wrapper:** each group's chip-grid wrapped in `<div role="group" aria-labelledby="o6-{key}-heading">` (with the group heading carrying the matching `id`). Chips are toggle buttons with `aria-pressed`; not radios in a fieldset.
7. **Footer chassis** matches the cross-screen chassis (cream `rgba(245,245,244,0.85)` + `blur(8px)` + 1px top border) — see O5 sibling reference. **CTA always enabled**; CTA label *"Build my plan"* (canvas L442 verbatim).
8. **`<main>` wrapper** — sibling-parity with O3/O4/O5: `width: '100%', maxWidth: 480, margin: '0 auto', paddingTop: 24, minHeight: '100vh'`, flex column, no background.

### AC-2 — Colour treatment uses design tokens; magenta accent

- Canvas constants from `jsx/o6-frames.jsx` L12-L24 (`INK`, `SUB`, `MUTE`, `FAINT`, `LINE`, `HAIR`, `SOFT`, `PAPER`, `DIS`, `VIOLET`, `INDIGO`, `MAGENTA`, `TEAL`) — replaced with `tokens.color.*` refs from `src/styles/tokens.ts`. Magenta uses existing `tokens.color.accent.magenta`.
- Same sibling-pattern unmapped hex literals carry forward from O5 chassis (`#FFFFFF` chip bg / `#C9C5BD` outer-dot border / `#EAE7DF` disabled border / `rgba(245,245,244,0.85)` footer bg). Recorded in verification.md §"Architectural deferrals" alongside O5's same list.

### AC-3 — Cap=3 multi-select state + a11y

- State lives in `useProto().answers.whatMatters.priorities` (`ReadonlyArray<Priority>`) + `worries` (`ReadonlyArray<Worry>`). No rename: existing typed union literals match canvas option keys (verified at scoping).
- Toggle behaviour per canvas `useGroupState` B1 branch (L284-L298): if already selected → remove; if `len < cap` → append; else (B1) → no-op (chip is disabled anyway at the input level).
- Per-group `<div role="group" aria-labelledby="o6-{priorities|worries}-heading">` wraps each chip-grid; the matching `<h3 id="o6-{...}-heading">` carries the group label.
- Chip is `<button type="button" aria-pressed={selected} disabled={disabled}>`. B1 disabled logic: `disabled === (capReached && !selected)`.
- Continue CTA: **always enabled** (no min-pick gate, per canvas L450 comment).

### AC-4 — Motion: chip transitions; entry stagger; reduced-motion

- Chip transition list verbatim from canvas L153: `background 120ms ease-out, border-color 120ms ease-out, opacity 160ms ease-out`.
- Entry stagger via `--stagger-index` on Hero (0) + each CardPlate (1, 2) (mirrors O5 chassis; chips themselves are not staggered individually since they're inside the card-plate).
- CTA enter-bounce on enable-state-flip → since CTA is always enabled in O6, the bounce fires once on mount (per canvas's `enabled={true}` baseline). Acceptable behaviour; matches O5 chassis.
- `@media (prefers-reduced-motion: reduce)` fallback: all transitions + animations set to `none` / `0s`.

## Pre-flight

- Sibling-wrapper diff (recurrence-watch from O5): before pushing, diff `<main>` style block against `O3.tsx` + `O4.tsx` + `O5.tsx`. Must match exactly.
- Slice category = `prototype` (path `src/app/dev/proto/pre-signup-interview/screens/`). DoD-14 short-form items 1, 8, 12, 14.

## Evidence pointers

- Canvas source: `docs/design-source/pre-signup-interview/jsx/o6-frames.jsx`
  - PRIORITIES L41-L50 · WORRIES L51-L60 · Hero L121-L133 · Chip L138-L171
  - GroupHeader L176-L191 · GroupCaption L193-L212 · CapCaption L215-L223 · CapHint L226-L238 · ChipGrid L240-L259
  - Group L265-L278 · useGroupState L284-L298 · CardPlate L306-L319
  - FormBody A1 branch L411-L417 · Footer L421-L447 · defaultCaption L449-L457
  - StaticFrame L464-L487 · A1 export L491-L495
- Pattern reference (sibling chassis): `docs/slices/S-PROTO-o5-canvas-as-source/` + `src/app/dev/proto/pre-signup-interview/screens/O5.tsx`.
