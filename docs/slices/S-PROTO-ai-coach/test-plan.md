# S-PROTO-ai-coach — test plan

## Approach

Vitest + Testing Library; rendered-DOM structural assertions per component. No mock setups required (no external collaborators, no I/O, no network) — every component receives data via props or local `useState`. Test-pain audit cleared trivially per acceptance §"Pre-flight notes".

TDD ordering:
1. Registry row test first (RED → GREEN via data edit).
2. Each component test before its impl (RED → GREEN via component file create).
3. Page test last (composition; depends on components existing).

## Tests

### `tests/unit/app/dev/proto/registry.test.ts` (extend)

Add an `S-PROTO-ai-coach` block asserting L74 row post-transition values:

- Row exists with `id === 'ai-coach'` and `section === 'settle'`.
- `status === 'prototype-built'`.
- `confidence === 'medium'`.
- `tags` includes `'ai-dependent'` (preserved); `'high-uncertainty'` may be retained or dropped — assert preservation.
- `lastTouched.session === 118`, `lastTouched.slice === 'S-PROTO-ai-coach'`.
- `links.proto === '/dev/proto/ai-coach'`.
- `openQuestions` contains the resolution string with `'Invocation pattern locked'` substring.

Regression-guard: other Settle rows (`proposal-builder`, `counter`, `settlement-redline`, `negotiation-history`) unchanged status.

### `tests/unit/proto-ai-coach/page.test.tsx` (new)

- Renders without throwing.
- Mounts the RightRail component (find element with rail's container test-id).
- Renders the back-link to `/dev/proto`.

### `tests/unit/proto-ai-coach/RightRail.test.tsx` (new)

- Renders 3 tab buttons in DOM order: `Comments`, `AI coach`, `Activity`.
- AI coach tab has `aria-selected="true"` on mount; other two have `aria-selected="false"`.
- AI coach panel is visible on mount; Comments + Activity panels are absent / hidden.
- Clicking the Comments tab switches `aria-selected`, hides the AI coach panel, renders the Comments stub.
- Clicking the Activity tab switches `aria-selected`, renders the Activity stub.
- Footer (CoachFooter) visible only when AI coach tab is active.

### `tests/unit/proto-ai-coach/SummaryBanner.test.tsx` (new)

- Renders the S-A3 verbatim intro paragraph as visible text.
- Renders two count badges with labels `FLAG` and `NOTICE`.
- Count values display the passed-in props (e.g. `2 FLAG`, `1 NOTICE`).

### `tests/unit/proto-ai-coach/CoachCard.test.tsx` (new)

- 4 type variants render with `data-card-type` attribute matching the type slug:
  - `court-reasonableness` (S-A2 verbatim title: *"No pension sharing is unusually weak"*)
  - `fairness-check` (S-A2 verbatim title: *"3-year spousal is on the longer end"*)
  - `coaching` (S-A2 verbatim title: *"Your home split is clean"*)
  - `on-this-comment` (threaded-response treatment)
- Each card shows a SHOW REASONING toggle; reasoning content is absent from DOM on mount (collapsed).
- Clicking SHOW REASONING expands the reasoning content into the DOM.
- Court-reasonableness card includes a FALLBACK POSITIONS subsection with 3 entries; each entry has rationale text + an Adopt `<button>`.
- Fairness-check, coaching, on-this-comment cards do NOT include FALLBACK POSITIONS.

### `tests/unit/proto-ai-coach/CoachFooter.test.tsx` (new)

- Renders the C-A3 verbatim copy: *"AI suggestions are guidance based on typical court outcomes for cases like yours. Not a substitute for legal advice."*.

## Test-pain audit

Per spec 72d §3 verbatim: *"If any unit test in a slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."*

Mock setups per test file: **0**. Every component is pure-presentational or carries local-only `useState`. No external dependencies to mock. Threshold (>2 mocks/test) cleared trivially.

## Run

```bash
npm test -- --reporter=basic tests/unit/proto-ai-coach
npm test -- --reporter=basic tests/unit/app/dev/proto/registry.test.ts
```
