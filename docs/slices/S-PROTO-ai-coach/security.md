# S-PROTO-ai-coach — security

**Category:** prototype → short-form security checklist (items 1, 8, 12, 14 per CLAUDE.md §"Slice categories" + spec 76 §5).

## Short-form items

### Item 1: Secrets / credentials / sensitive defaults
✓ No secrets or credentials introduced. All card content is mock prose using the Sarah/Mark synthetic personas already in `/dev/proto/`; monetary values (`£36,082`, `54/46 split`) are demo literals from spec 68d §S-A examples.

### Item 8: Third-party dependencies
✓ No new dependencies. New components import `react` + `@/styles/tokens` (both pre-existing). No npm package additions, no AI SDK calls (per AC framing: static prototype, no live Anthropic API).

### Item 12: External surfaces
✓ No new external surfaces. Page is static markup with local `React.useState` for tab-switching + SHOW REASONING expand/collapse. No `fetch`, no API routes, no `localStorage`, no auth boundary, no analytics. The Adopt buttons in FALLBACK POSITIONS are no-op `<button>` elements per AC-4 (handler wiring deferred to proposal-builder slice).

### Item 14: PII handling
✓ No PII. All copy is spec-verbatim demo content (Sarah/Mark personas, demo monetary values, mock card titles drawn from 68d §S-A examples). No form submissions, no data persistence.

## N/A items (category: prototype)

- Items 2–7, 9–11, 13: `N/A — category: prototype, see spec 76 §5`.

## Adversarial review

Surface-by-surface:

- **`ai-coach/page.tsx`** — static page composition; mounts `RightRail` with mock card data; one back-link to `/dev/proto`. No inputs, no I/O.
- **`ai-coach/_components/RightRail.tsx`** — `React.useState<'comments'|'ai-coach'|'activity'>` for active tab. Renders panel based on active. No I/O.
- **`ai-coach/_components/SummaryBanner.tsx`** — pure presentational; receives intro paragraph + flag/notice counts as props. No input handling.
- **`ai-coach/_components/CoachCard.tsx`** — pure presentational; receives `type`, `title`, `body`, `reasoning`, `fallbacks?` props. Local `useState<boolean>` for SHOW REASONING expand. No I/O.
- **`ai-coach/_components/FallbackPositions.tsx`** — pure presentational; receives array of `{title, rationale}` props; renders Adopt buttons as no-op `<button>`. No state.
- **`ai-coach/_components/CoachFooter.tsx`** — pure presentational; renders C-A3 verbatim copy. No state, no input.
- **`src/app/dev/proto/registry.ts` row edit** — data-only; L74 status + confidence + lastTouched + links + openQuestions updates.

No injection surface, no auth boundary, no data flow change. Adversarial-review-equivalent: catalogued by surface above; concerns deferred = none.
