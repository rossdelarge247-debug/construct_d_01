# S-PROTO-section-confirm — verification

Final-state evidence per AC. Updated at slice ship.

## AC-1 · Two confirm-form routes + hub index page ported from canvas

**Status:** PENDING

Routes created:
- `src/app/dev/proto/section-confirm/page.tsx`
- `src/app/dev/proto/section-confirm/categorise/page.tsx`
- `src/app/dev/proto/section-confirm/confirm-recurring/page.tsx`

Canvas adapt rules per CLAUDE.md §"Canvas-as-source" 5-step (evidence per step at ship):

1. **Tokenise hardcoded colours:** PENDING — `INK`/`SUB`/`MUTE`/`LINE`/`BG`/`PAPER` mapped to `tokens.color.*` where the design system has matching entries.
2. **Replace placeholder data:** N/A — canvas literals preserved as demo content.
3. **Wire state:** PENDING — Categorise has `React.useState<'joint_life'|...>`; ConfirmRecurring has no state.
4. **Add Next.js wrapping:** PENDING — `'use client'` + default-exported component on each page.
5. **Inline canvas-local helpers OR adapt:** PENDING — extracted to `_components/` per AC-2.

## AC-2 · Shared canvas components extracted to co-located `_components/`

**Status:** PENDING

Components created at `src/app/dev/proto/section-confirm/_components/`:
- `FormTop.tsx`
- `TxnRow.tsx`
- `RadioRow.tsx`
- `AIMarginCard.tsx`
- `BackArrow.tsx`
- `SectionLabel.tsx`
- `SparkGlyph.tsx`

## AC-3 · Token alias additions for canvas AI colours

**Status:** PENDING

Page-local `AI_PURPLE` / `AI_PURPLE_TINT` / `AI_PURPLE_DEEP` constants in `_components/AIMarginCard.tsx` + `_components/RadioRow.tsx` + `_components/SparkGlyph.tsx`. Values cite canvas literal hex.

## AC-4 · Registry rows L54 + L55 + L56 updated

**Status:** PENDING

Three rows in `src/app/dev/proto/registry.ts` updated. `tests/unit/app/dev/proto/registry.test.ts` extended with row-shape assertions.

## Tests

**Status:** PENDING

| File | Cases | Status |
|---|---|---|
| `tests/unit/app/dev/proto/registry.test.ts` (extend) | 5 | PENDING |
| `tests/unit/proto-section-confirm/hub.test.tsx` | 3 | PENDING |
| `tests/unit/proto-section-confirm/categorise.test.tsx` | 8 | PENDING |
| `tests/unit/proto-section-confirm/confirm-recurring.test.tsx` | 6 | PENDING |
| `tests/unit/proto-section-confirm/RadioRow.test.tsx` | 4 | PENDING |

## Preview-deploy verification

Per spec 72a 6-dimension rubric. Recorded at slice ship.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | PENDING | |
| Edge cases | PENDING | |
| `prefers-reduced-motion` | PENDING | |
| Keyboard-only | PENDING | |
| Mobile viewport (375×667) | PENDING | |
| Screen-reader | PENDING | |

## Auto-review

**Status:** PENDING

Recorded at PR creation. 3-specialist multi-agent review per CLAUDE.md §"Hard controls".

## Slice DoD (6-item per CLAUDE.md §"Engineering conventions" §"Definition of Done")

- [ ] 1. All ACs met with evidence above
- [ ] 2. Tests written + passing
- [ ] 3. Adversarial review done; concerns addressed or deferred
- [ ] 4. Preview deploy verified (golden + edge + reduced-motion)
- [ ] 5. No regression in adjacent slices
- [ ] 6. Open 68f/g entries resolved or explicitly deferred (registry L54 open-Q drops per AC-4)
- [ ] 7. Registry row updated (per AC-4)

Plus security checklist short-form per `security.md`.
