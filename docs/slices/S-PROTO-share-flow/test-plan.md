# S-PROTO-share-flow — Test plan

**Category:** prototype → coverage threshold relaxed per CLAUDE.md §"Slice categories"; test-pain threshold raised from >2 to >5 mocks; TDD-guard skips on `src/app/dev/proto/share-flow/**` per `.claude/hooks/tdd-guard.sh`. Unit + integration tests still required for AC verification.

## Test files

```
tests/unit/proto-share-flow/
├── page.test.tsx                 — AC-1 state-1 destination + composition
├── JoinedAvatarsHero.test.tsx    — AC-1 hero structure
├── MarkStatusCard.test.tsx       — AC-1 card + AC-2 Share CTA wiring
├── ShareModal.test.tsx           — AC-3 modal shell + tabs + ARIA + AC-5 submit stub
├── SelectivePublishToggles.test.tsx — AC-4 toggle list
└── (shared fixtures inline; no shared fixture file)

tests/unit/app/dev/proto/
└── registry.test.ts              — AC-6 (+ 1 block for share-flow + regression-guard for untouched rows)
```

## Per-AC test coverage

### AC-1 · Reconcile state-1 destination view

- `page.test.tsx`:
  - Page renders the joined-avatars hero (assertion: `data-testid="joined-avatars-hero"` or equivalent semantic landmark).
  - Body copy renders verbatim: matches the exact `"Reconciliation opens as soon as Mark shares his picture. Until then, you can keep refining yours — nothing is locked, nothing is sent to him."` string.
  - Mark Status card renders with the "Mark · Not invited" label and the Share CTA.
  - Soft reminder caption renders verbatim: `"You'll get a notification when Mark shares."`.
- `JoinedAvatarsHero.test.tsx`:
  - Two avatar circles render with the expected order (Sarah left, Mark right).
  - Mark avatar carries a dashed-border treatment (placeholder semantics).

### AC-2 · C-S1 adaptive Share CTA + page copy

- `page.test.tsx`:
  - Page-level copy `"This is your private view. You choose what to share."` renders verbatim above the hero.
- `MarkStatusCard.test.tsx`:
  - Card renders a `<button>` with accessible name `"Share with Mark"`.
  - Clicking the button invokes a passed `onShareClick` callback (1 mock setup — within the test-pain threshold).

### AC-3 · C-S2 party-type-aware modal

- `ShareModal.test.tsx`:
  - Modal renders with `role="dialog"` + `aria-modal="true"` + `aria-labelledby` matching the heading id.
  - Three tab buttons render in DOM order [Ex, Solicitor, Mediator] with `aria-selected="true"` on Ex by default.
  - Each tab carries `aria-controls` pointing at a panel; the active panel carries `aria-labelledby` pointing back.
  - Ex panel renders two inputs: name (`aria-required` or `required`) + email (`type="email"` + `required`).
  - Solicitor panel renders the `"Form fields TBD per 68f S-1."` placeholder.
  - Mediator panel renders the same TBD placeholder.
  - Arrow-right from Ex tab moves focus + aria-selected to Solicitor; arrow-right again to Mediator; arrow-left reverses.
  - Escape key closes the modal (modal unmounts or `onClose` callback fires).

### AC-4 · C-S3 selective publish toggles

- `SelectivePublishToggles.test.tsx`:
  - "What to share" heading renders.
  - Supporting copy renders verbatim: `"By default, all sections share. Uncheck any you want to keep private for now."`.
  - 7 checkbox elements render with labels `["Property", "Pensions", "Investments", "Income", "Spending", "Children", "Other"]`.
  - All 7 default-CHECKED.
  - Clicking a checkbox toggles its `checked` state.

### AC-5 · Submit transition stub

- `ShareModal.test.tsx`:
  - Clicking "Send invite" (default Ex tab, name="Mark Hughes") replaces the modal body with the confirmation block `"Invite sent to Mark Hughes."`.
  - Confirmation block renders the stub note `"State-2 'Invited · hasn't opened' is a future slice; this prototype ends here."`.
  - Close button is interactive (button role + accessible name).
  - Clicking Close invokes the modal's `onClose` callback.
  - On Solicitor tab (no name input), submit shows `"Invite sent to Mark."` (fallback).

### AC-6 · Registry L70 row update + regression-guard

- `registry.test.ts`:
  - New block asserts: `share-flow` row has `status: 'prototype-built'`, `confidence: 'medium'`, `links.prototype === 'src/app/dev/proto/share-flow/'`, `links.slice === 'docs/slices/S-PROTO-share-flow/'`, `links.spec` populated, `links.canvas` absent.
  - `openQuestions` is the empty array.
  - `lastTouched.session === 119`, `lastTouched.date === '2026-05-22'`.
  - Regression-guard: every other registry row's `lastTouched.session` is `<= 118` (no other rows mutated by this slice's registry edit).

## Test execution

- Run via `npm run test -- proto-share-flow` (vitest filter) for the new tests.
- Run via `npm run test` for the full suite — must remain green; baseline pre-slice was 896/896 from prior wrap.
- ESLint + typecheck via `npm run lint && npm run typecheck` — must remain clean.

## Mock setup count audit (spec 72d §3)

| Test file | Mocks needed | Within threshold? |
|---|---|---|
| `page.test.tsx` | 0 (pure render assertions) | yes |
| `JoinedAvatarsHero.test.tsx` | 0 | yes |
| `MarkStatusCard.test.tsx` | 1 (`onShareClick` callback `vi.fn()`) | yes |
| `ShareModal.test.tsx` | 1-2 (`onClose` + `onSubmit` callbacks) | yes |
| `SelectivePublishToggles.test.tsx` | 0-1 (`onChange` callback if used) | yes |
| `registry.test.ts` | 0 (data assertions only) | yes |

All test files within the prototype threshold of >5 mocks (and the production threshold of >2 mocks). No architectural-deferral entries needed.

## Not in scope

- Visual regression / screenshot tests (relying on preview-deploy 6-dim rubric instead).
- Cross-browser tests (preview-deploy verification handles).
- Live API mocking (no API in scope).
- Storybook stories (not used in `/dev/proto/*`).
