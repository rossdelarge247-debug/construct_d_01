# S-PROTO-section-confirm — verification

Final-state evidence per AC.

## AC-1 · Two confirm-form routes + hub index page ported from canvas

**Status:** DONE

Routes at commit `a12cfad`:
- `src/app/dev/proto/section-confirm/page.tsx` (hub index)
- `src/app/dev/proto/section-confirm/categorise/page.tsx` (canvas L3092-3145)
- `src/app/dev/proto/section-confirm/confirm-recurring/page.tsx` (canvas L3150-3219)

Adapt-step evidence:
1. **Tokenise hardcoded colours:** `INK / BG / PAPER / WARM` → `tokens.color.ink / .surface.page / .surface.panel / .surface.canvas` (exact-hex matches); `SUB / MUTE / LINE` → `tokens.color.text.sub / .text.muted / .border` (semantic match, slight hex drift documented in acceptance.md AC-1).
2. **Replace placeholder data:** canvas literals preserved (Aviva £1,250 · Octopus £178 · all radio labels).
3. **Wire state:** Categorise has `React.useState<CategoriseChoice>('joint_life')` (canvas L3093 ported); ConfirmRecurring has no state (canvas L3150 unchanged).
4. **Add Next.js wrapping:** `'use client'` + default-exported component on each page.
5. **Inline canvas-local helpers OR adapt:** all helpers extracted per AC-2; BackArrow further lifted to `next/link` for genuine navigation rather than static glyph.

## AC-2 · Shared canvas components extracted to co-located `_components/`

**Status:** DONE

7 components at `src/app/dev/proto/section-confirm/_components/`:
- `FormTop.tsx` (canvas L3037-3042 ported; BackArrow wrapped in Next.js Link)
- `TxnRow.tsx` (canvas L3045-3056 ported)
- `RadioRow.tsx` (canvas L3058-3087 ported; added `role="radio"` + `aria-checked` + typed `onClick`)
- `AIMarginCard.tsx` (canvas L2334+ — simplified per AC-2; comments / activity / fallbacks deferred)
- `BackArrow.tsx` (canvas L1421-1423 ported)
- `SectionLabel.tsx` (canvas L1366-1368 ported)
- `SparkGlyph.tsx` + `AIBadge` (canvas L2287-2300 ported)

All `'use client'`. All typed via TypeScript interfaces. No `any`.

## AC-3 · Token alias additions for canvas AI colours

**Status:** DONE (page-local approach)

`AI_PURPLE = '#6D5BD0'` · `AI_PURPLE_DEEP = '#4C3FB8'` · `AI_PURPLE_TINT = '#F5F3FF'` · `AI_PURPLE_EDGE = '#E4DEFD'` exported from `_components/SparkGlyph.tsx` (canvas L2265-2268 verbatim). Consumed in `AIMarginCard.tsx` + `RadioRow.tsx` + `confirm-recurring/page.tsx`. No `src/styles/tokens.ts` additions this slice — consolidation deferred per AC-3.

## AC-4 · Registry rows L54 + L55 + L56 updated

**Status:** DONE

`src/app/dev/proto/registry.ts` L54-56:
- `per-section-confirm`: status `spec-only → prototype-built`; tags drops `high-uncertainty`; openQuestions replaced with state-icon-TOC deferral; lastTouched session 117; links populated (canvas + prototype + slice).
- `bank-rec-categorise`: status `canvas-drafted → prototype-built`; lastTouched session 117; links.prototype added; canvas link retained.
- `bank-rec-confirm-recurring`: status `canvas-drafted → prototype-built`; lastTouched session 117; links.prototype added; canvas link retained.

Remaining 4 `bank-rec-*` rows (L57-60) unchanged — explicit regression-guard test added.

## Tests

**Status:** DONE — 42/42 passing (`npx vitest run tests/unit/app/dev/proto/registry.test.ts tests/unit/proto-section-confirm/`)

| File | Cases | Status |
|---|---|---|
| `tests/unit/app/dev/proto/registry.test.ts` (extended) | 5 new (18 total) | PASS |
| `tests/unit/proto-section-confirm/hub.test.tsx` | 4 | PASS |
| `tests/unit/proto-section-confirm/categorise.test.tsx` | 8 | PASS |
| `tests/unit/proto-section-confirm/confirm-recurring.test.tsx` | 6 | PASS |
| `tests/unit/proto-section-confirm/RadioRow.test.tsx` | 6 | PASS |

ESLint clean on new code (`npx eslint src/app/dev/proto/section-confirm/ tests/unit/proto-section-confirm/`). Typecheck clean (`npx tsc --noEmit`).

## Preview-deploy verification

**Status:** PENDING — auto-deploy on PR open. To verify on Vercel preview:
- `/dev/proto/section-confirm/` (hub)
- `/dev/proto/section-confirm/categorise` (8 assertions)
- `/dev/proto/section-confirm/confirm-recurring` (6 assertions)

Six dimensions per `docs/workspace-spec/72a-preview-deploy-rubric.md` §"The six dimensions" — recorded post-merge:

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | PENDING | |
| Edge cases | PENDING | |
| `prefers-reduced-motion` | PENDING | (no motion this slice — only `transform` rotate on reasoning-expand chevron) |
| Keyboard-only | PENDING | RadioRow is `<button role="radio">`; Skip/Save are `<button>`; should tab cleanly |
| Mobile viewport (375×667) | PENDING | (canvas is mobile-first; `maxWidth: 420` cap on flex column) |
| Screen-reader | PENDING | (`role="radiogroup"` + `aria-label` on group; `aria-checked` on each radio; `aria-expanded` on reasoning expand) |

## Auto-review

**Status:** PENDING — recorded at PR creation.

## Slice DoD (per CLAUDE.md §"Engineering conventions" §"Definition of Done")

- [x] 1. All ACs met with evidence above
- [x] 2. Tests written + passing (42/42)
- [ ] 3. Adversarial review done; concerns addressed or deferred (PR auto-review pending)
- [ ] 4. Preview deploy verified (golden + edge + reduced-motion) — PR open
- [x] 5. No regression in adjacent slices — registry tests cover regression on 4 untouched bank-rec rows
- [x] 6. Open 68f/g entries resolved or explicitly deferred (registry L54 open-Q dropped/replaced per AC-4)
- [x] 7. Registry row updated (per AC-4 + new DoD item 7 from journey-restore slice)
