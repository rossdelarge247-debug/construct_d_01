# S-PROTO-marketing-landing-canvas-port — Security DoD

**Category:** prototype — DoD-14 short-form (items 1, 8, 12, 14 only) per CLAUDE.md §"Slice categories" + spec 76 §3.

## Threat-model review (item 1)

Scope: port of marketing landing canvas to a static prototype route at `/dev/proto/marketing-landing`. No new data flows, no auth surface, no external IO.

- **Inputs:** none — page is purely static React render
- **Outputs:** static DOM tree; in-page anchor links (`href="#hero"` etc.) and SVG illustrations
- **Trust boundaries:** none crossed — no API calls, no `fetch`, no `useEffect` with external side-effects
- **New attack vectors:** none
  - FAQ accordion `useState` toggles boolean — no XSS / injection path
  - CTAs are static `<button>` or `<a href="#...">` (or hash-only for prototype; real handlers deferred)
  - Inline SVG patterns + icons hardcoded in source; no user-controlled SVG content

Verdict: no change to threat model. Prototype route is gated by `next.config.ts` `pageExtensions` filter (only includes `.dev.tsx` when `NEXT_PUBLIC_DECOUPLE_AUTH_MODE !== 'prod'`) — but `page.tsx` (not `.dev.tsx`) compiles unconditionally. This matches how `src/app/dev/proto/pre-signup-interview/page.tsx` ships on production preview at `construct-dev.vercel.app/dev/proto/pre-signup-interview`. The `/dev/proto/*` namespace is intentionally public during prototype phase (no PII, no auth surface, no settlement data).

## Secrets handling (item 8)

No secrets touched. No environment-variable reads. No API calls. No third-party SDK initialisation.

## Dependency review (item 12)

No new dependencies. All imports resolve to existing modules:
- `@/styles/tokens` — existing S-F1 token module
- `react` (`useState`) — already in `package.json`
- Optional Next.js `<Link>` — already in dependencies if used; falls back to in-page `<a href="#...">` if not

No new `npm install` lines.

## PR security checklist (item 14)

Will be signed at PR open via `.github/PULL_REQUEST_TEMPLATE.md` 14-item checklist (short-form items 1, 8, 12, 14 ticked; items 2-7, 9-11, 13 marked N/A per prototype category).
