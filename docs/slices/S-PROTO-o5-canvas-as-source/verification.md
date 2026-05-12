# S-PROTO-o5-canvas-as-source — verification

Final-state evidence per AC. Statuses flip from Pending → Pass on slice ship (after auto-review approve + user pre-flight).

## Per-AC evidence

### AC-1 — Visual structure mirrors canvas A1+B1+C2

**Status:** Pending

Evidence locations once impl lands:
- `src/app/dev/proto/pre-signup-interview/screens/O5.tsx` — top-level composition: `<BrandBar>` + bespoke `<TopBar>` (Back + Arrow + `<ProgressPill current={5} total={8} />` + right spacer + bottom border) + `<Hero>` (eyebrow row + serif H2 + B1 helper) + `<fieldset>` (sr-only legend + primary group + `mt-3` gap + secondary group) + `<Footer>` (caption + dark pill CTA).
- `<main>` wrapper style matches O3.tsx + O4.tsx exactly: `width: '100%', maxWidth: 480, margin: '0 auto', paddingTop: 24, minHeight: '100vh'`, flex column, no background.
- Chip-card padding 14×14, border-radius 14, 1px border (ink selected / line otherwise). 18×18 outer dot + 8×8 inner dot when selected.
- `"little"` option renders `<span className="serif italic">— they managed the money</span>` inline-suffix; other options have no detail.

### AC-2 — Tokens; indigo accent reused

**Status:** Pending

Evidence:
- `O5.tsx` imports `import { tokens } from '@/styles/tokens'` and uses `tokens.color.ink`, `tokens.color.text.sub`, `tokens.color.text.muted`, `tokens.color.border`, `tokens.color.surface.panel`, `tokens.color.accent.indigo` (and any others needed).
- No inline hex literals in `O5.tsx` or `O5.module.css` for colours that correspond to existing tokens.
- `TOKEN_NAMES` parity test count unchanged from current baseline (no new tokens added).

### AC-3 — State + a11y rename

**Status:** Pending

Evidence:
- `lib/types.ts:59` — `PartnerAwareness` union literals: `'full' | 'some' | 'little' | 'suspect'`.
- `lib/build-plan.ts:81` — comparison updated: `'little' || 'suspect'` (replaces `'very-little' || 'hiding'`).
- `lib/copy/o5.ts` — option `value`s match canvas keys.
- `O5.tsx` — single `<fieldset aria-labelledby="o5-awareness-legend">` (or sr-only `<legend>`); four `<input type="radio" name="o5-partner-awareness">`; each `value` matches the canvas key; `checked={selected}` + `onChange`. Native radio visually hidden; chip-card label receives focus + click.
- Continue CTA `disabled={!partnerFinances.awareness}`.

### AC-4 — Motion; entry stagger; reduced-motion

**Status:** Pending

Evidence:
- `O5.module.css`:
  - Chip-card class with `transition: background 120ms ease-out, border-color 120ms ease-out` (canvas L113 verbatim).
  - Entry stagger via `--stagger-index` custom property (mirrors `O4.module.css`); secondary group continues sequence (suspect = index 3).
  - CTA enter-bounce keyframe on state flip disabled → enabled.
  - `@media (prefers-reduced-motion: reduce)` fallback: all transitions + animations set to `none` / `0s`.

## Preview-deploy verification (spec 72a 6+1-dimension rubric)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending | Vercel preview URL — pick "I have a good idea of everything" → Continue enables → click → routes to next screen |
| Edge cases | Pending | All four options can be picked + un-picked; switching pick updates checked state; Back returns to O4 |
| `prefers-reduced-motion` | Pending | DevTools rendering tab → emulate reduce-motion → no transitions on chip-card; no entry stagger; no CTA bounce |
| Keyboard-only | Pending | Tab through Back → Continue (disabled) → 4 radios → arrow keys move within group → Space selects → CTA reachable |
| Mobile viewport (375×667) | Pending | DevTools device emulation → no horizontal overflow; chip-cards stack vertically; footer pill full-width |
| Screen-reader | Pending | VoiceOver: fieldset legend read as "How much do you know about your partner's financial situation?" — radio group of 4; each option announces label + state |
| Trust band / footer caption state | Pending | Caption flips from *"Pick the answer closest to what's true today."* to *"Answer recorded — continue when ready."* on pick |

## Adversarial review

- 3-specialist auto-review (`reviewer-security`, `reviewer-prototype-readiness`, `reviewer-style`) on impl PR per `.github/workflows/auto-review.yml`. Pending verdict.
- Findings addressed or deferred with reasoning recorded against the relevant AC above.

## Definition of Done (spec 76 §3 prototype short-form)

DoD-14 short-form items applicable for `category: prototype`:

- [ ] 1. Auth/session: N/A (prototype, no auth surface)
- [ ] 8. Logging: no PII logged from the new code paths
- [ ] 12. Dev/prod boundary: the route stays under `src/app/dev/proto/`
- [ ] 14. Test coverage for the slice's new logic

Full DoD per CLAUDE.md:
- [ ] AC-1 Pass
- [ ] AC-2 Pass
- [ ] AC-3 Pass
- [ ] AC-4 Pass
- [ ] Tests written + passing (`tests/proto/o5-canvas.test.tsx`)
- [ ] Auto-review verdict: approve / nit-only on impl PR
- [ ] Preview-deploy 6+1 rubric: all dimensions Pass
- [ ] User feedback received + addressed (or explicitly deferred)
- [ ] No regression in O3 / O4 / O7 / O8 (smoke check)

## User-feedback iterations

In-PR visual iterations on the preview deploy, recorded atomically per CLAUDE.md §"Scoping-discipline observations" recurrence-watch (in-PR scope-expansion confirmation gate):

- **Variant pick switched from A1+B1+C2 to A3+B1+C2 after preview pre-flight.** User direction verbatim from preview pre-flight: *"i suspect they might be hiding something isnt separated by a thin line"*; clarification follow-up: *"doent c2 have that in canvas"*. After confirming canvas A1+C2 has only a gap and the thin line + framing header live in A3, user picked the full A3 treatment from a three-option clarification (canvas-pure C2, hybrid line-only, full A3). Implementation now mirrors canvas FormBody A3 branch at `jsx/o5-frames.jsx` L281-L298 with `ord.kind === "split"`: 20px gap + 1px `borderTop` divider in `colors.border` + 12px gap + 11px serif-italic *"If you have concerns…"* header in `colors.sub` + 8px gap before the suspect chip-card. The chip retains identical visual weight (A3 doesn't de-emphasise; only A2 does). AC-1 item 3 + §Scope variant pick + §Out of scope variant list amended atomically.

## Architectural deferrals

Findings from auto-review that are explicitly deferred with reasoning:

- **`aria-labelledby` redundant when `<legend>` is present** (flagged by `prototype-readiness`, accessibility-essential, non-blocking). The `<fieldset aria-labelledby="o5-partner-legend">` + child `<legend id="o5-partner-legend">` pattern is sibling-identical to O4's `o4-emp-legend` chassis. Removing only on O5 introduces O4↔O5 divergence in the cross-screen radio chassis. Defer to a future sibling-sweep slice that touches both `O4.tsx` + `O5.tsx` (and any subsequent fieldset-bearing screens) atomically.
- **Continue CTA ~40px below 44×44 touch-target floor** (flagged by `prototype-readiness`, mobile-viewport, non-blocking). Matches O3/O4 CTA dimensions (`padding: '13px 18px'`). Already covered in scope by acceptance.md §"Out of scope" production-graduation bundle (originally framed for Back; extending to Continue is consistent with the same sweep premise). Bundled with the sticky-CTA + safe-area-inset + 44×44 Back work when the pre-signup flow exits `/dev/proto/`.
- **Unmapped hex literals in chip-card + footer** (flagged by `prototype-readiness`, ac-gap, non-blocking). Inlined values: `#FFFFFF` (chip-card background when unselected, inner dot when selected, selected primary text), `rgba(255,255,255,0.7)` (selected detail-suffix tint), `#C9C5BD` (unselected outer dot border), `rgba(245,245,244,0.85)` (footer backdrop). All four are sibling-pattern values present in O4's `OptionRow` + `Footer`. AC-2 in this slice forbids adding new tokens. A dedicated tokenisation slice would map all four across O3/O4/O5/O6 atomically (cross-screen chassis hygiene), not introduce divergence here.

