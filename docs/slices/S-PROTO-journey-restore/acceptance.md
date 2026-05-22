# S-PROTO-journey-restore

**Category:** prototype
**Journey:** infrastructure-meta — codifies the journey-declaration convention itself; touches multiple prototype surfaces (marketing-landing nav · pre-signup-interview O8 outbound · new sign-up shell) plus control-plane gates that govern future Phase 3 slices.

## Why

Phase 3 prototype building lapsed two disciplines from `HANDOFF-SESSION-74.md` L9-10 (the post-audit 3-phase plan, restored to SESSION-CONTEXT via commit `780fa6c`):

> *"Their plan was: Phase 1 (logic gaps, complete sessions 70-71) → Phase 2 (Claude AI Design canvases, ongoing) → Phase 3 (`/dev/proto/*` prototypes, starting session 74)."*

And L80-82:

> *"P1 (after P0): `S-PROTO-pre-signup-interview` — Phase 3 prototype P1 per refreshed Phase 3 sequence. … P2+: `S-PROTO-section-confirm` (Build phase confirm pattern) · `S-PROTO-ai-coach` (Settle phase) · `S-PROTO-share-flow` (Reconcile multi-actor)."*

Audit at session 115 start (this slice's diagnostic):

1. **Registry not maintained.** 56 of 62 rows still carry `lastTouched: { session: 74 }`. Rows for marketing-landing (#216), welcome-tour (#217), how-it-works/pricing/faq-trust shells (#218/#219/#220), and hub-day-7-state-f (#221 = post-connect-dashboard) all stayed at `status: 'canvas-drafted'` despite shipping as prototype-built or shell-only. Only `pre-signup-interview` row was refreshed (HANDOFF-80 L23).
2. **Journey not wired.** Surfaces ship as standalone canvas-ports with no inter-surface navigation. Marketing-landing CTAs are all `#hash` anchors (verified L260-279 of `src/app/dev/proto/marketing-landing/page.tsx`). Pre-signup-interview O8 completion goes nowhere. Welcome-tour exits nowhere. Post-connect-dashboard has no inbound link.
3. **Phase 3 sequence drifted.** Per HANDOFF-74 L80-82 the planned post-P1 order was `section-confirm → ai-coach → share-flow`. Sessions 112-114 instead canvas-ported §1/§3/§5 surfaces (marketing-landing, welcome-tour, dashboard) without advancing the §6/§8/§7 spine.

This slice restores the discipline (rows + wiring), stubs the missing intermediate destination (sign-up shell so O8 has an outbound target), and codifies three process gates to prevent recurrence (DoD item 7 · `**Journey:**` field + hook · Phase 3 sequence anchor).

## Acceptance criteria

### AC-1 · Registry refresh

- Six existing rows in `src/app/dev/proto/registry.ts` updated to reflect shipped state:

  | Row id | Status change | `links.prototype` |
  |---|---|---|
  | `marketing-landing` | `canvas-drafted → prototype-built` | `src/app/dev/proto/marketing-landing/` |
  | `welcome-tour` | `canvas-drafted → prototype-built` | `src/app/dev/proto/welcome-tour/` |
  | `how-it-works` | `canvas-drafted → shell-built` | `src/app/dev/proto/how-it-works/` |
  | `pricing` | `canvas-drafted → shell-built` | `src/app/dev/proto/pricing/` |
  | `faq-trust` | `canvas-drafted → shell-built` | `src/app/dev/proto/faq-trust/` |
  | `hub-day-7-state-f` | `canvas-drafted → prototype-built` | `src/app/dev/proto/post-connect-dashboard/` |

  Additionally `hub-day-7-state-f` adds `links.slice: docs/slices/S-PROTO-post-connect-dashboard-canvas-port/`.

- All six rows get `lastTouched: { session: 115, date: '2026-05-22' }`.
- New status value `'shell-built'` added to `statusSchema` in `src/app/dev/proto/registry-schema.ts` (between `'canvas-drafted'` and `'prototype-built'`).
- `FlowRow` / `StatusBadge` render correctly for the new status; no visual regression.

### AC-2 · Marketing-landing CTAs wired to real routes

In `src/app/dev/proto/marketing-landing/page.tsx`:

- Top-nav `Pricing` `href="#pricing"` (verified at L269) → `href="/dev/proto/pricing"`. The dedicated pricing route exists (`src/app/dev/proto/pricing/page.tsx`).
- Top-nav `Start` CTA `href="#start"` (verified at L279) → `href="/dev/proto/pre-signup-interview"`.
- Top-nav `Sign in` `href="#signin"` (verified at L275): kept as hash; inline TODO comment added: `{/* TODO(journey): route to /dev/proto/sign-in once that surface ships. */}`.
- All other `#hash` anchors preserved as intra-page scroll targets (`#picture` L260, `#journey` L263+L351, `#compare` L266, `#pricing-detail` L1147, `#invited` L1338, `#top` L251, `#main` L1438 skip-link, footer placeholders L1406).
- `Link` component from `next/link` used for the two new outbound links (avoids full reload).

### AC-3 · Pre-signup-interview O8 outbound + sign-up shell stub

- Final O8 "Continue" CTA in the pre-signup-interview prototype → `href="/dev/proto/sign-up"` (Next.js `Link`).
- New route `src/app/dev/proto/sign-up/page.tsx` shipped as a shell, matching the existing shell pattern (`how-it-works`, `pricing`, `faq-trust`):
  - Title: "Sign up"
  - Body: "Sign-up canvas pending — registry row §2 `sign-up` is `canvas-drafted` at `docs/design-source/mobile-screens-v2/`. This shell is the journey-target placeholder until the canvas is ported."
  - Back-link: `<Link href="/dev/proto">← Back to registry</Link>`.
- Existing `sign-up` registry row (§2 auth-boundary) updated to `canvas-drafted → shell-built`, `lastTouched: { session: 115, date: '2026-05-22' }`, `links.prototype: src/app/dev/proto/sign-up/`.

### AC-4 · DoD item 7 — registry-update gate

- `.github/PULL_REQUEST_TEMPLATE.md` Definition of Done section gains a 7th item:

  > `[ ]` **Registry row updated** — if PR touches `src/app/dev/proto/<surface>/page.tsx`, the corresponding row in `src/app/dev/proto/registry.ts` has `lastTouched.session` bumped and `status` reflects ship state; new surfaces add a row in the same PR.

- `.github/workflows/pr-dod.yml` extended with a new step `registry-update-check`:
  - Detects diff under `src/app/dev/proto/*/page.tsx` (excluding `[slug]/page.tsx`, the registry hub itself at `page.tsx`, and `_components/`).
  - Requires `src/app/dev/proto/registry.ts` to also be in the diff, OR the PR carries the `no-registry-update` label.
  - On failure, prints the rule, the rationale (links to CLAUDE.md §"Engineering conventions" §"Definition of Done"), and the fix.

### AC-5 · `**Journey:**` field convention + author-time hook

- CLAUDE.md §"Visual direction" gains a new sub-section §"Journey wiring":
  - Convention: every prototype slice's `acceptance.md` declares `**Journey:**` immediately after `**Category:**`, naming inbound (where the user arrives from) and outbound (where the user goes next). Format:

    > `**Journey:** inbound from = <surface-id | "external/marketing"> · outbound to = <surface-id | "completion-stub">`

  - Orphan surfaces declare: `**Journey:** orphan — pending wiring in slice S-X` with reason.
  - Detection regex: `^\*\*Journey:\*\*[[:space:]]+`.

- New hook `.claude/hooks/journey-declared.sh`:
  - PostToolUse on `Write|Edit` of `docs/slices/S-PROTO-*/acceptance.md`.
  - Warns (advisory; exits 0) if regex match absent.
  - Includes file path + rule citation + format example in the message.

- `.claude/settings.json` registers the hook.

- `tests/shellspec/journey-declared_spec.sh` covers: present field → silent; absent field → advisory message; non-PROTO slice → silent.

### AC-6 · Phase 3 sequence anchored in always-loaded CLAUDE.md

- CLAUDE.md gains a new top-level section §"Phase 3 sequence" positioned after §"North star" (always-loaded Tier 1):
  - Quotes `HANDOFF-SESSION-74.md` L80-82 verbatim (sequence + 4-step loop).
  - States the rule: any off-sequence work must be flagged in SESSION-CONTEXT.md's session priorities table with an explicit `OFF-SEQUENCE because X` note.
  - §Status footer notes: sessions 112-114 ran off-sequence (marketing-landing, welcome-tour, dashboard ports); session 115 restores discipline via this slice; next planned slice per the sequence is `S-PROTO-section-confirm` (§6 Build).

## Out of scope

- Porting `S-PROTO-section-confirm` itself (the next slice after journey-restore).
- Canvas-porting sign-up / sign-in / bank-picker / welcome-tour-completion-target (those are future slices; this slice only stubs the immediate orphan-end at sign-up).
- Mobile-responsive pass on marketing-landing.
- Holistic a11y sweep (deferred per SESSION-CONTEXT carry-over).
- Inbound link from welcome-tour to its next surface (no §3 next-step route exists; declare orphan in the welcome-tour row, don't fabricate destinations).

## References

- `docs/HANDOFF-SESSION-74.md` L9-10, L80-82 (the planned 3-phase + Phase 3 sequence)
- `docs/HANDOFF-SESSION-80.md` L23 (registry-row-refresh discipline first applied; not repeated since)
- `src/app/dev/proto/registry.ts` (62 rows; 56 carry stale `lastTouched: session 74`)
- `src/app/dev/proto/marketing-landing/page.tsx` L260-279 (current hash CTA wiring)
- `src/app/dev/proto/registry-schema.ts` L17-23 (status enum to extend)
- `.github/workflows/pr-dod.yml` (existing slice-verification gate; pattern to extend)
- CLAUDE.md §"Engineering conventions" §"Definition of Done" (where item 7 lands)
- CLAUDE.md §"Visual direction" (where §"Journey wiring" sub-section lands)
