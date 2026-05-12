# S-PROTO-o6-canvas-as-source — verification

Final-state evidence per AC. Statuses flip from Pending → Pass on slice ship (after auto-review approve + user pre-flight).

## Per-AC evidence

### AC-1 — Visual structure mirrors canvas A1+B1+C1

**Status:** Pending

Evidence locations once impl lands:
- `src/app/dev/proto/pre-signup-interview/screens/O6.tsx` — top-level composition: `<BrandBar>` + bespoke `<TopBar>` (Back + Arrow + `<ProgressPill current={6} total={8} />` + right spacer + bottom border) + `<Hero>` (magenta eyebrow row + serif H2; no helper) + body wrapper with two `<CardPlate>` containing groups + `<Footer>` (caption + always-enabled "Build my plan" CTA).
- `<main>` wrapper style matches O3.tsx / O4.tsx / O5.tsx exactly: `width: '100%', maxWidth: 480, margin: '0 auto', paddingTop: 24, minHeight: '100vh'`, flex column, no background.
- CardPlate styles per canvas L306-L319: white + 1px `colors.border` + radius 18 + padding 16 + soft shadow.
- Chip styles per canvas L138-L171: pill 12.5px medium, 8×12 padding, ink-when-selected, 14×14 outer dot + SVG checkmark inner.
- CTA: always enabled; label "Build my plan".

### AC-2 — Tokens; magenta accent

**Status:** Pending

Evidence:
- `O6.tsx` imports `tokens` from `@/styles/tokens` and uses `tokens.color.ink`, `tokens.color.text.sub`, `tokens.color.text.muted`, `tokens.color.text.faint` (or equivalent for FAINT), `tokens.color.border`, `tokens.color.accent.magenta`.
- No inline hex literals for canvas constants that map to existing tokens. Deferred unmapped values listed in §"Architectural deferrals".
- `TOKEN_NAMES` parity test count unchanged from baseline (no new tokens added in this slice).

### AC-3 — Cap=3 multi-select + a11y

**Status:** Pending

Evidence:
- `lib/types.ts` `Priority` + `Worry` union literals unchanged (already match canvas option keys; verified at scoping via `grep`).
- `O6.tsx` toggle: `if (current.includes(value)) remove; else if (current.length < CAP) append; else no-op`. B1 disabled-at-cap renders chips with `disabled={true}` when `selectedCount >= CAP && !isSelected`.
- Each chip: `<button type="button" aria-pressed={selected} disabled={disabled}>`.
- Each group wrapper: `<div role="group" aria-labelledby="o6-priorities-heading">` (and similar for worries).
- Each group heading: `<h3 id="o6-priorities-heading">` (or `o6-worries-heading`) with the group title.
- Continue CTA always enabled (`disabled={false}`).

### AC-4 — Motion; reduced-motion fallback

**Status:** Pending

Evidence:
- `O6.module.css`:
  - Chip transition list `background-color 120ms ease-out, border-color 120ms ease-out, opacity 160ms ease-out` (canvas L153 verbatim).
  - Entry stagger via `--stagger-index` on Hero (0) + CardPlate (1) + CardPlate (2). Chips inside cards are not individually staggered.
  - CTA bounce keyframe on mount (CTA always enabled).
  - `@media (prefers-reduced-motion: reduce)` fallback: all transitions + animations set to `none` / `0s`.

## Preview-deploy verification (spec 72a 6+1-dimension rubric)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending | Vercel preview URL — pick up to 3 priorities + up to 3 worries → 4th of either greys out → click Continue ("Build my plan") → routes to next screen |
| Edge cases | Pending | All 8 priorities + all 8 worries can be picked + un-picked within cap; switching pick within cap works; Back returns to O5 |
| `prefers-reduced-motion` | Pending | DevTools rendering tab → emulate reduce-motion → no chip transitions; no entry stagger; no CTA bounce |
| Keyboard-only | Pending | Tab through Back → Continue → 8 priority chips → 8 worry chips; Enter / Space toggles each chip; Tab order matches DOM order |
| Mobile viewport (375×667) | Pending | DevTools device emulation → no horizontal overflow; chip rows wrap correctly; CardPlate visible without scroll for top group |
| Screen-reader | Pending | VoiceOver: Hero magenta eyebrow + serif H2 read; each `role="group"` announced with heading label; each chip's pressed state announced; disabled chips announced as unavailable |
| Trust band / footer caption state | Pending | Caption flips from *"You can continue without picking — your plan adapts either way."* to *"N thing(s) noted — your plan will weight these."* on first pick |

## Adversarial review

- 3-specialist auto-review (`reviewer-security`, `reviewer-prototype-readiness`, `reviewer-style`) on impl PR per `.github/workflows/auto-review.yml`. Pending verdict.
- Findings addressed or deferred with reasoning recorded against the relevant AC above.

## Definition of Done (spec 76 §3 prototype short-form)

DoD-14 short-form items applicable for `category: prototype`:

- [ ] 1. Auth/session: N/A (prototype, no auth surface)
- [ ] 8. Logging: no PII logged from the new code paths
- [ ] 12. Dev/prod boundary: route stays under `src/app/dev/proto/`
- [ ] 14. Test coverage for the slice's new logic

Full DoD per CLAUDE.md:
- [ ] AC-1 Pass
- [ ] AC-2 Pass
- [ ] AC-3 Pass
- [ ] AC-4 Pass
- [ ] Tests written + passing (`tests/unit/proto-pre-signup/o6-canvas-as-source.test.tsx`)
- [ ] Auto-review verdict: approve / nit-only on impl PR
- [ ] Preview-deploy 6+1 rubric: all dimensions Pass
- [ ] User feedback received + addressed (or explicitly deferred)
- [ ] No regression in O3 / O4 / O5 / O7 / O8 (smoke check)

## Architectural deferrals

Findings deferred with reasoning (carried forward from O5 sibling-pattern):

- **Continue CTA ~40px below 44×44 touch-target floor** (mobile-viewport). Matches O3/O4/O5 chassis (`padding: '13px 18px'`). Covered by the production-graduation bundle when the pre-signup flow exits `/dev/proto/`.
- **Chip touch-targets ~29px tall** (mobile-viewport). Canvas chip `padding: '8px 12px'` + `fontSize 12.5` per `jsx/o6-frames.jsx` L147-L149. Below the 44×44 floor; matches canvas verbatim. Covered by the same production-graduation pass — a chip-height bump touches every chip across the flow (O6 here, O7/O8 likely) and any future chip-bearing surface.
- **Unmapped hex literals in chip + footer** (ac-gap): `#FFFFFF` (chip bg, inner checkmark), `#C9C5BD` (outer dot border), `#EAE7DF` (disabled chip border), `#A8A29E` (disabled chip text — canvas FAINT; no `tokens.color.text.faint` exists, only `sub` + `muted`), `rgba(245,245,244,0.85)` (footer backdrop). All sibling-pattern values. A dedicated tokenisation slice would map across O3-O6 chassis atomically (plus add `tokens.color.text.faint` for the disabled-text case), not introduce divergence here.
