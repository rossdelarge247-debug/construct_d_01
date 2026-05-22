# S-PROTO-journey-restore — verification

## Per-AC evidence

**AC-1 · Registry refresh.** *(Evidence filled at slice ship.)*

- `src/app/dev/proto/registry-schema.ts`: `statusSchema` enum extended with `'shell-built'` between `'canvas-drafted'` and `'prototype-built'`. Position verified by `statusSchema.options` ordering.
- `src/app/dev/proto/registry.ts`: six rows updated — `marketing-landing` (status + `lastTouched.session: 115` + `links.prototype`), `how-it-works` (status + `lastTouched` + `links.prototype`), `pricing` (status + `lastTouched` + `links.prototype`), `faq-trust` (status + `lastTouched` + `links.prototype`), `welcome-tour` (status + `lastTouched` + `links.prototype`), `hub-day-7-state-f` (status + `lastTouched` + `links.prototype` + `links.slice`).
- `tests/unit/app/dev/proto/registry.test.ts`: extension covers enum position + per-row assertions.
- No visual regression — `'shell-built'` rendered by existing `StatusBadge` switch (added arm covers the new value).

**AC-2 · Marketing-landing CTAs wired.** *(Evidence filled at slice ship.)*

- `src/app/dev/proto/marketing-landing/page.tsx`: Top-nav `Pricing` href swapped to `/dev/proto/pricing` (was `#pricing`). Top-nav `Start` href swapped to `/dev/proto/pre-signup-interview` (was `#start`). Top-nav `Sign in` retained as `#signin` with inline TODO comment.
- `next/link` used for the two new outbound links.
- All other `#hash` anchors preserved as documented in AC-2.
- `tests/unit/proto-marketing-landing/start-cta-href.test.tsx`: render-smoke covers the two swapped hrefs + the preserved `#signin`.

**AC-3 · Pre-signup-interview O8 outbound + sign-up shell stub.** *(Evidence filled at slice ship.)*

- `src/app/dev/proto/pre-signup-interview/screens/O8.tsx`: Final "Continue" CTA → `href="/dev/proto/sign-up"` via `next/link`.
- `src/app/dev/proto/sign-up/page.tsx`: new shell mirroring `faq-trust` pattern — H1 "Sign up", body paragraph, back-link to `/dev/proto`.
- `src/app/dev/proto/registry.ts` `sign-up` row updated to `status: 'shell-built'`, `lastTouched.session: 115`, `links.prototype`.
- `tests/unit/proto-sign-up/shell.test.tsx`: render-smoke covers H1 + body + back-link.

**AC-4 · DoD item 7 — registry-update gate.** *(Evidence filled at slice ship.)*

- `.github/PULL_REQUEST_TEMPLATE.md`: 7th DoD item added per AC text.
- `.github/workflows/pr-dod.yml`: new job `registry-update-check` added. Detects diff under `src/app/dev/proto/*/page.tsx` (excluding `[slug]/page.tsx`, the registry hub at `src/app/dev/proto/page.tsx`, and any `_components/` subdir). Requires `src/app/dev/proto/registry.ts` in diff OR `no-registry-update` label.

**AC-5 · `**Journey:**` field convention + author-time hook.** *(Evidence filled at slice ship.)*

- `CLAUDE.md` §"Visual direction" §"Journey wiring" sub-section added: convention text + format + orphan declaration + detection regex.
- `.claude/hooks/journey-declared.sh`: PostToolUse on `Write|Edit` of `docs/slices/S-PROTO-*/acceptance.md`; advisory (exits 0) when regex match absent; includes file path + rule citation + format example.
- `.claude/settings.json`: hook registered.
- `tests/shellspec/journey-declared_spec.sh`: 4 scenarios per `test-plan.md`.
- This slice's own `acceptance.md` L4 carries `**Journey:** infrastructure-meta — …` (sentinel: this slice satisfies its own convention).

**AC-6 · Phase 3 sequence anchored in CLAUDE.md.** *(Evidence filled at slice ship.)*

- `CLAUDE.md` new top-level §"Phase 3 sequence" added after §"North star":
  - Verbatim quote of `docs/HANDOFF-SESSION-74.md` L80-82.
  - Off-sequence-flagging rule.
  - §Status footer noting sessions 112-114 ran off-sequence and session 115 restored discipline via this slice.

## Preview-deploy verification

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending user-walk | Three surfaces user-walkable: `/dev/proto/marketing-landing` (Pricing + Start CTAs click through), `/dev/proto/pre-signup-interview` (O8 Continue → /sign-up), `/dev/proto/sign-up` (new shell). Sandbox can't reach Vercel preview. |
| Edge cases | N/A | Static href changes + shell page; no stateful UI introduced. |
| `prefers-reduced-motion` | N/A | No motion introduced. |
| Keyboard-only | Pending user-walk | Three new links: AC-2 nav (2), AC-3 O8 CTA + shell back-link (2). Tab order inherits surrounding shell. |
| Mobile viewport | Pending user-walk | No new layout chrome; shell mirrors faq-trust constraints. |
| Screen-reader | Pending user-walk | Sign-up shell uses `<h1>` + `<p>` + `<nav>`/`<Link>` semantic landmarks per faq-trust precedent. |

## Adversarial review

Surface-by-surface adversarial review in `security.md`. No concerns surfaced; no deferrals.

## Status

Pending implementation + tests + PR.
