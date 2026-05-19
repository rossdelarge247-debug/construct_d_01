# S-PROTO-help-rail-desktop-variants — Security checklist

**Slice:** S-PROTO-help-rail-desktop-variants
**Spec ref:** `docs/workspace-spec/72-engineering-security.md` §11 (14-item per-slice security checklist; prototype short-form per CLAUDE.md §"Slice categories")

This slice is `category: prototype`. Surface touched:

- New library: `src/lib/dev/variant-context.tsx`, `src/lib/dev/variant-manifest.ts`, `src/lib/dev/variants-registry.ts`
- New dev-only route: `src/app/dev/control/page.dev.tsx`
- New per-prototype manifest: `src/app/dev/proto/pre-signup-interview/variants.ts`
- 5 new rail components under `src/app/dev/proto/pre-signup-interview/components/rails/`
- 1 layout-wrapper edit at the pre-signup-interview prototype to render the rail at ≥1280px
- 1 CSS-module edit for the `@media (min-width: 1280px)` rule
- 1 registry edit (new dev-tools row)
- Tests across the variant context + rail components + integration

No new data flow on the user/PII side, no auth surface, no DB writes, no API routes, no env vars, no third-party integration. Variant selection state lives in `localStorage` keyed under a `dev:variant:` namespace. Rail components render canvas-extracted UI text only (no user-input flow into rail rendering).

## 14-item checklist (prototype short-form: items 1, 8, 12, 14 only)

| # | Item (spec 72 §11) | Status | Notes |
|---|---|---|---|
| 1 | Data classification per AC | T0 | Variant selection state in localStorage is dev-tooling preference (no PII; not synced server-side). Rail components render static UI text from canvas; no PII surface. |
| 8 | Error handling (no leaks) | N/A | No error surface added. Variant context falls back to manifest default on any read failure; no error rethrow. |
| 12 | Adversarial review | PENDING | Persona suite spawns at PR via `auto-review.yml`; `reviewer-prototype-readiness` + `reviewer-style` + `reviewer-security` run. |
| 14 | Secrets hygiene | PENDING | No secrets introduced; CI `Gitleaks scan` workflow gates independently — expected GREEN. |

Items 2-7, 9-11, 13 are N/A per prototype short-form (paths are `src/app/dev/proto/**` and `src/app/dev/control/**` `.dev.tsx`; no production-runtime surface; no API routes; no DB; no third-party).

**Tally (at slice ship):** 2 PENDING · 1 T0 · 1 N/A · 0 FAIL.

## Adversarial review notes

- **localStorage injection / poisoning.** Variant ids are used only as switch/case branch keys to render fixed components from a closed manifest. No `eval`, no dynamic component lookup by string name, no DOM injection. An attacker-injected unknown variant id falls back to the manifest default (closed-set resolution). LocalStorage key namespace `dev:variant:*` is well-scoped; no collision with app data. Dev-tooling preference only — not shipped or synced.

- **URL searchParam injection (`?variant.helpRail=…`).** Same closed-set resolution as localStorage. The searchParam value is parsed via Next.js's standard URL handling (no manual parsing). Unknown values fall back to default; no `decodeURIComponent` of executable strings; no string-to-component-name lookup.

- **`.dev.tsx` runtime gate.** Relies on the existing dev-mode mechanism (S-F7 `dev-auth-gate.ts` + `.dev.tsx` file convention) that excludes dev-only routes from production builds. New dev control route `src/app/dev/control/page.dev.tsx` follows the same naming convention used by `src/app/dev/scenarios/page.dev.tsx` and siblings; it inherits the same production-exclusion.

- **CSS Modules + `@media` query.** Standard Next.js CSS Modules pipeline (compile-time scoped class names); the `@media (min-width: 1280px)` rule is a pure CSS feature — no JS-side viewport detection, no client/server divergence, no hydration-mismatch surface.

- **Rail component rendering.** Each rail component (`RailGlossary` / `RailCoach` / `RailWhy` / `RailHuman` / `RailHybrid`) renders canvas-extracted static UI text. No user-input flow into rendering — the rails are presentational. No `dangerouslySetInnerHTML`. No external content fetching this slice.

- **Variant context provider side-effects.** The provider's only effects are `localStorage.getItem` / `setItem` (scoped key namespace) and `URL.searchParams.get`. Both are read-only on first render; setter is opt-in via `useSetVariant` hook. No mutation of global state, no timer, no network call.

- **Hybrid (V5) tab state.** Tab selection within `RailHybrid` is component-local React state (`useState`). No persistence, no cross-component leakage; resets on remount.

## Sign-off

- **Reviewed by:** PENDING (slice author + persona suite at PR)
- **Date:** PENDING
- **Verdict:** PENDING
