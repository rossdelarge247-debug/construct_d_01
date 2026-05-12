# S-PROTO-o5-canvas-as-source

**Category:** prototype

## Scope

Port the O5 frame ("How much do you know about your partner's financial situation?") from the Claude AI Design canvas to `src/app/dev/proto/pre-signup-interview/screens/O5.tsx` via the 5-step canvas-as-source pattern (CLAUDE.md §"Visual direction" §"Canvas-as-source"). Replaces the current V1 placeholder (`ScreenShell` + `TallRow` flat list, divergent state literals).

Canvas source: `docs/design-source/pre-signup-interview/jsx/o5-frames.jsx`. The canvas exposes 9 variants (A1/A2/A3 × B1/B2/B3 × C1/C2/C3); user-confirmed pick at slice scoping is **A3 + B1 + C2** — `FrameC` with `variant="C2"` at `jsx/o5-frames.jsx` L369-L377, materialised by `C2()` at L379.

- **A1** — identical visual weight for all four options (no emphasis, no de-emphasis).
- **B1** — helper text: *"There's no wrong answer. Many people don't know everything."* (`jsx/o5-frames.jsx` L158).
- **C2** — split ordering: full / some / little visually grouped, with "suspect" set apart at the bottom via `mt-3` gap (`jsx/o5-frames.jsx` L302-L313, FormBody `ord.kind === "split"` branch).

## In scope

- `src/app/dev/proto/pre-signup-interview/screens/O5.tsx` — full rewrite (current 95-line V1 placeholder discarded).
- `src/app/dev/proto/pre-signup-interview/screens/O5.module.css` — new file: entry stagger, chip-card transitions, reduced-motion fallback (mirrors `O4.module.css`).
- `src/app/dev/proto/pre-signup-interview/lib/types.ts` — rename `PartnerAwareness` union literals to match canvas keys: `'good-idea' → 'full'`, `'some-things' → 'some'`, `'very-little' → 'little'`, `'hiding' → 'suspect'` (per `jsx/o5-frames.jsx` L96-L99 `OPT_*.key`).
- `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` — line 81 literal updates (`'very-little' → 'little'`, `'hiding' → 'suspect'`).
- `src/app/dev/proto/pre-signup-interview/lib/copy/o5.ts` — rewrite copy shape to match canvas (eyebrow + heading + helper + options-with-detail + captions + cta).
- `tests/unit/proto-pre-signup/o5-canvas-as-source.test.tsx` — new unit tests covering radio group + state shape + split layout + caption state machine.

## Out of scope

- Canvas variants A1, A2, B2, B3, C1, C3 — only A3+B1+C2 ships (user-confirmed pick after preview pre-flight; recorded in `verification.md` §"User-feedback iterations").
- Production-graduation backlog items (sticky-CTA hardening, 44×44 touch target on Back, `100dvh` vs `100vh` sweep) — bundle deferred to a single production-graduation pass when the pre-signup flow exits `/dev/proto/`.
- Shared component changes (`BrandBar`, `Arrow`, `ProgressPill`, `ScreenShell`) — already audited at sessions 87-88, no new requirements emerge from O5.
- O6 — separate slice (`S-PROTO-o6-canvas-as-source`).

## Acceptance criteria

### AC-1 — Visual structure mirrors canvas A3+B1+C2

The O5 page is the canvas-derived composition at `jsx/o5-frames.jsx` `FrameC variant="C2"` (L369-L377), with shared chassis matching O3/O4 siblings:

1. **Shared `<BrandBar>` + bespoke `<TopBar>`** — Back/Home link, Arrow, `<ProgressPill current={5} total={8} />`, matched-width right spacer, 1px bottom border. (Cross-screen pattern from session 87 AC-6.)
2. **Hero** at `jsx/o5-frames.jsx` L164-L182:
   - Eyebrow row: 5×5 indigo dot + `"Money · their side"` text (fontSize 9.5, color indigo, gap 1.5).
   - H2: *"How much do you know about your partner's financial situation?"* — serif, fontSize 21, lineHeight 1.18, letterSpacing -0.015em, fontWeight 600.
   - Helper paragraph (B1): *"There's no wrong answer. Many people don't know everything."* — fontSize 12, color SUB, lineHeight 1.45.
3. **Body fieldset** with single sr-only `<legend>` + four `<input type="radio" name="o5-partner-awareness">` rendered as chip-cards. Layout splits visually per canvas A3+C2 (`jsx/o5-frames.jsx` L281-L298 with `ord.kind === "split"`):
   - Primary group (three rows): full → some → little, vertical gap 8px.
   - 20px `marginTop` then a 1px `colors.border` top-divider (`aria-hidden`), then 12px `marginBottom`.
   - 11px serif-italic *"If you have concerns…"* header in `colors.sub`, 8px below before the secondary row.
   - Secondary group (one row): suspect, no de-emphasis (A3 keeps the chip identical-weight; only A2 mutes).
4. **Chip-card** per `OptionRow` (`jsx/o5-frames.jsx` L102-L154):
   - Padding 14px both axes, border-radius 14, 1px border (ink when selected, line otherwise).
   - Background ink when selected, white otherwise.
   - 18×18 outer dot (1.5px border) + 8×8 inner dot (white) when selected.
   - Primary text fontSize 14, fontWeight 600.
   - If `detail` present (only `little` per `OPT_LITTLE.detail = "they managed the money"`), render `<span className="serif italic">— they managed the money</span>` inline-suffix, fontWeight 400, marginLeft 6.
5. **Footer chassis** matches the cross-screen chassis established at O3/O4 ship (cream `rgba(245,245,244,0.85)` + `backdropFilter: blur(8px)` + 1px top border + caption row + dark pill CTA with right-arrow `strokeWidth=2`). The canvas footer at `jsx/o5-frames.jsx` L185-L211 uses `rgba(255,255,255,0.6)` + `blur(10px)`; the cross-screen chassis values supersede for sibling consistency across all pre-signup screens.
6. **`<main>` wrapper** — sibling-parity with O3/O4 per session-88 lesson: `width: '100%', maxWidth: 480, margin: '0 auto', paddingTop: 24, minHeight: '100vh'`, flex column, **NO background** (let the page-level `<BackgroundShell mode="expressive">` gradient show through).

### AC-2 — Colour treatment uses design tokens; indigo accent reused

- All hardcoded canvas constants from `jsx/o5-frames.jsx` L7-L18 (`INK`, `SUB`, `MUTE`, `FAINT`, `LINE`, `HAIR`, `SOFT`, `PAPER`, `DIS`, `VIOLET`, `INDIGO`, `MAGENTA`) — replaced with `tokens.color.*` refs from `src/styles/tokens.ts`. Indigo specifically uses `tokens.color.accent.indigo`.
- No new tokens added in this slice. If any colour in the canvas doesn't map to an existing token, raise it as a finding rather than inlining a hex literal.

### AC-3 — State + a11y: canvas-key rename + single radiogroup

- `PartnerAwareness` union (`lib/types.ts:59`) renamed to `'full' | 'some' | 'little' | 'suspect'` per canvas `OPT_*.key`. Update site: `lib/build-plan.ts:81` (`'very-little' | 'hiding'` → `'little' | 'suspect'`). No other production references.
- Single `<fieldset>` with sr-only `<legend>` (heading text) wraps all four `<input type="radio" name="o5-partner-awareness">`. The C2 visual split is via two `<div>` wrappers inside the fieldset, not two fieldsets — semantically one radiogroup, one answer.
- Each radio: `name="o5-partner-awareness"`, `value` matching the canvas key, `checked={selected}`, `onChange={() => onSelect(key)}`. Native radio is visually hidden (`className="sr-only"`); the wrapping `<label>` provides implicit association (no explicit `id`/`htmlFor` needed in the label-wrapping pattern, matching O4 sibling chassis).
- Continue CTA disabled until one option selected (`!partnerFinances.awareness`).

### AC-4 — Motion: transitions match canvas L113; entry stagger; reduced-motion fallback

- Chip-card transition list verbatim from canvas L113: `background 120ms ease-out, border-color 120ms ease-out`. No other transitions on the chip-card itself; the inner dot is conditional-rendered with no CSS transition.
- Entry stagger via `--stagger-index` CSS custom property on each chip-card (mirrors `O4.module.css`); the `mt-3`-gap secondary group continues the stagger sequence. Hero is `--stagger-index: 0` (matching O4 sibling chassis), so the chip indices are 1/2/3 (primary group) + 4 (secondary `suspect`).
- CTA enter-bounce when state flips from disabled → enabled (single keyframe, mirrors O4).
- `@media (prefers-reduced-motion: reduce)` fallback: all transitions + entry animations set to `none` / `0s`.

## Pre-flight

- Sibling-wrapper diff (per CLAUDE.md §"Scoping-discipline observations" recurrence-watch): before pushing, diff `<main>` style block against `O3.tsx` + `O4.tsx`. Must match exactly.
- Slice category = `prototype` (path `src/app/dev/proto/pre-signup-interview/screens/` per CLAUDE.md §"Slice categories"). DoD-14 short-form items 1, 8, 12, 14.

## Evidence pointers

- Canvas source: `docs/design-source/pre-signup-interview/jsx/o5-frames.jsx`
  - OPTIONS L95-L99 · OptionRow L102-L154 · HELPERS L156-L161 · Hero L163-L182 · Footer L185-L211
  - orderedOptions L216-L231 · FormBody L238-L325 (C2 split branch L302-L313)
  - FrameC L369-L377 · C2 export L379
- Pattern reference: `docs/slices/S-PROTO-o4-canvas-as-source/` + `src/app/dev/proto/pre-signup-interview/screens/O4.tsx` + `O4.module.css`.
