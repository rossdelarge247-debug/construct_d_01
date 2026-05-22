# S-PROTO-section-confirm — test plan

## Approach

This slice ports canvas content to React + extracts shared components. The surfaces are presentational with one stateful component (`RadioRow` selection in the Categorise form). Tests cover:

- Schema-stable assertions for the 3 updated registry rows (extend existing `registry.test.ts`).
- Render-smoke tests for each new route (existence + key copy + back-link href).
- One stateful test for the Categorise form's radio-selection behaviour (the only non-trivial state in scope).
- One shared-component test for `RadioRow` (selected vs unselected vs recommended-badge variants).

`AIMarginCard` is presentational and complex enough that visual diff would be valuable; the slice ships render-smoke only and defers visual-diff coverage to a Phase C+ visual-regression infrastructure slice.

## Tests

### `tests/unit/app/dev/proto/registry.test.ts` (extend)

| Assertion | AC |
|---|---|
| `per-section-confirm` row carries `status: 'prototype-built'`, `lastTouched.session === 117`, `links.prototype === 'src/app/dev/proto/section-confirm/'`, `links.canvas === 'docs/design-source/mobile-screens-v2/'`, `links.slice === 'docs/slices/S-PROTO-section-confirm/'` | AC-4 |
| `bank-rec-categorise` row carries `status: 'prototype-built'`, `lastTouched.session === 117`, `links.prototype === 'src/app/dev/proto/section-confirm/categorise/'`, canvas link retained | AC-4 |
| `bank-rec-confirm-recurring` row carries `status: 'prototype-built'`, `lastTouched.session === 117`, `links.prototype === 'src/app/dev/proto/section-confirm/confirm-recurring/'`, canvas link retained | AC-4 |
| `per-section-confirm` row's `tags` no longer contains `'high-uncertainty'` | AC-4 |
| Remaining 4 `bank-rec-*` rows (manual-entry, resolve-duplicate, split, balance-check) still `canvas-drafted` (regression check — out-of-scope deferral) | AC-4 §Out-of-scope |

### `tests/unit/proto-section-confirm/hub.test.tsx` (new)

| Assertion | AC |
|---|---|
| H1 "Per-section confirmation" (or canvas-equivalent header) renders | AC-1 |
| Two demo route links render with `href="/dev/proto/section-confirm/categorise"` and `href="/dev/proto/section-confirm/confirm-recurring"` | AC-1 |
| Back-link with `href="/dev/proto"` renders | AC-1 |

### `tests/unit/proto-section-confirm/categorise.test.tsx` (new)

| Assertion | AC |
|---|---|
| FormTop title "Categorise" + step "Q20 of 22" render (canvas L3096 verbatim) | AC-1 |
| Anchor TxnRow rendering "Aviva Life Insurance" + "£1,250.00" (canvas L3101 verbatim) | AC-1 |
| Heading "What kind of policy is this?" renders (canvas L3106 verbatim) | AC-1 |
| 4 RadioRow options render with labels matching canvas L3115-3119 verbatim | AC-1 |
| Default-selected RadioRow is "Joint life cover (you + Mark)" (`v === "joint_life"` initial state per canvas L3093) | AC-1 |
| Clicking a different RadioRow shifts selection state (e.g. click "Just my life cover" → that row becomes checked; previous unchecks) | AC-1 |
| AIMarginCard renders with title containing "Aviva typically bundles" (canvas L3124 verbatim) | AC-1 |
| Save/Skip buttons render (no-op confirm — clicks don't navigate; just assert they're in the DOM) | AC-1 |

### `tests/unit/proto-section-confirm/confirm-recurring.test.tsx` (new)

| Assertion | AC |
|---|---|
| FormTop title "Confirm fixed expense" + step "3 to confirm" render (canvas L3153 verbatim) | AC-1 |
| Anchor TxnRow rendering "Octopus Energy" + "£178/mo avg" (canvas L3158 verbatim) | AC-1 |
| Heading "Add to your fixed monthly expenses?" renders (canvas L3163 verbatim) | AC-1 |
| Suggested-entry card renders with 4 fields: Category=Utilities · Energy, Whose=Joint household, Monthly=£178.00, Frequency=Monthly DD (canvas L3179-3193 verbatim) | AC-1 |
| AIMarginCard renders with title "Average across 12 months — winter months are higher." (canvas L3200 verbatim) | AC-1 |
| Two CTA buttons "Not a fixed expense" + "Add to expenses" render | AC-1 |

### `tests/unit/proto-section-confirm/RadioRow.test.tsx` (new)

| Assertion | AC |
|---|---|
| Unchecked variant: radio dot empty, label renders, no AI-badge | AC-2 |
| Checked variant: radio dot filled with AI_PURPLE, label renders | AC-2 |
| `recommended={true}` variant: "AI suggests" badge renders alongside label | AC-2 |
| Sub-text renders when `sub` prop provided; absent when omitted | AC-2 |

## Test-pain audit

Per spec 72d §3:

> *"If any unit test in this slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."*

Per spec 76 §3 (L51 table row):

> *">5 mocks triggers step-back"*

For `category: prototype` slices the threshold raises per the row above. All planned tests are static-render or local-state — zero mocks needed. Threshold not approached.

## Run

```bash
npm test -- tests/unit/app/dev/proto/registry.test.ts \
            tests/unit/proto-section-confirm/hub.test.tsx \
            tests/unit/proto-section-confirm/categorise.test.tsx \
            tests/unit/proto-section-confirm/confirm-recurring.test.tsx \
            tests/unit/proto-section-confirm/RadioRow.test.tsx
```
