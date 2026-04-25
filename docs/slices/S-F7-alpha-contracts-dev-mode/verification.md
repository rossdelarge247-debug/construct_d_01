# S-F7-α · Persistence + auth abstraction (contracts + dev-mode backend) — Verification

**Slice:** S-F7-alpha-contracts-dev-mode
**Source:** CLAUDE.md DoD item 4 + engineering-phase-candidates.md §G.5
**Preview deploy URL:** N/A — α has no UI surface; not user-visible.
**Branch:** `claude/S-F7-alpha-contracts-dev-mode`

α is an infrastructure slice — three TypeScript interfaces + dev-mode backend impls + 2 fixture scenarios + scenario loader. No routes, no components, no visual treatment. The verification template's UI-focused sections (golden path, accessibility, responsive viewport, cross-browser) are not applicable here. Verification reduces to: tests pass, adversarial review clean, dev-mode sanity check via a downstream consumer, and sign-off.

---

## Golden path

α has no end-user flow. Substituted by **consumer-smoke**: a temporary downstream import in a test or scratch file proves a downstream slice author can use α as designed.

| Step | Action | Expected outcome | Evidence |
|---|---|---|---|
| 1 | `import { getSession, getStore, getAuthGate } from '@/lib/auth' (or '@/lib/store')` from a test file | All three resolve to dev impls under `MODE='dev'` | TBD |
| 2 | Call `loadScenario('sarah-mid-build')` | Storage populated with scenario state | TBD |
| 3 | Call `getSession()` then `getStore().read(session.id, 'profile')` | Returns scenario-defined profile data | TBD |
| 4 | Call `getAuthGate().requireUser()` | Resolves to fixture session (no throw, no redirect) | TBD |

**Pass / fail:** TBD.

## Edge cases

| Scenario | Trigger | Expected outcome | Evidence |
|---|---|---|---|
| Empty state | First import with empty localStorage, no scenario loaded | `getStore().read(...)` returns `null`; `getSession()` returns a default fixture | TBD |
| localStorage unavailable | `localStorage.setItem` throws (jsdom stub) | One `console.warn`; in-memory fallback used; no throw to caller | TBD |
| Unknown scenario name | `loadScenario('not-a-scenario')` | Throws clear error mentioning available scenarios | TBD |
| URL scenario param + reload-loop guard | `?scenario=cold-sarah` triggers loader | Param consumed before reload; post-reload URL has no `scenario=` | TBD |
| Prod mode + dev export call | `MODE='prod'` + `getSession()` | Throws `Error('S-F8 not implemented — prod auth requires S-F7-δ')` | TBD |
| Production-build runtime assertion | `NODE_ENV='production'` + `MODE='dev'` | Module load throws spec-72-§7 verbatim error | TBD |

## Accessibility

N/A — no UI surface in α. Accessibility binds at β (env banner) and onward.

## Responsive viewport

N/A — no UI surface in α.

## Cross-browser

N/A — α is logic only. Cross-browser binds at β when routes ship.

Note: α's `localStorage` access is feature-detected per AC-5 (graceful degradation) — that's the only browser-behaviour seam in α and it's covered by T-5.

## Regression surfaces

α is greenfield (`src/lib/auth/*` and `src/lib/store/*` are new directories). No existing slice consumes these paths yet, so no slice-level regression risk in α itself.

| Adjacent slice / surface | Smoke check | Pass / fail | Evidence |
|---|---|---|---|
| Existing `src/lib/supabase/workspace-store.ts` (Re-use) | α does NOT import or modify; smoke = `grep` confirms no edits | TBD | TBD |
| Existing `src/lib/bank/test-scenarios.ts` (Re-use) | α does NOT import or modify | TBD | TBD |
| Tooling: vitest config | α adds tests; smoke = `pnpm test` runs without config error | TBD | TBD |
| Tooling: tsc | α adds types; smoke = `pnpm tsc --noEmit` clean | TBD | TBD |

## Dev-mode sanity (substantively applies — α is the dev-mode foundation)

The full dev-mode banner / route gating is β scope, but α must not block β from succeeding:

- [ ] α's `MODE` constant is the single source of truth — β's banner reads from it without touching env vars directly. Verified at β kickoff.
- [ ] α's localStorage key prefix `decouple:dev:` matches the prefix β's reset-button wipes.
- [ ] α's fixture email format `*@dev.decouple.local` matches the domain γ's CI gate searches for in production bundles.
- [ ] Production build (`next build` with `DECOUPLE_AUTH_MODE=prod`): α's index modules throw on consumer call, never silently succeed.

## Adversarial run

- [ ] **Manual sweep** — author re-reads the slice diff with the explicit prompt *"poke holes in this; find edge cases, security issues, regression risks"*. Output recorded as concerns either addressed or explicitly deferred.
- [ ] **`/security-review` skill** run on slice diff — α is the first logic + auth slice; this exercises the experiment per CLAUDE.md "Adversarial review gate (per slice)" + spec 72 §11. Findings recorded in `security.md` §12.
- [ ] **`/review` skill** — optional. Defer unless the author wants a second-opinion code-quality pass.

---

## Sign-off

- **Verified by:** TBD (session 32 author)
- **Date:** TBD
- **Commit SHA verified:** TBD
- **Preview URL:** N/A (no UI)
- **Outstanding issues:** TBD
- **DoD item 4 status:** TBD — α maps "in-browser verification" to "consumer-smoke + automated test pass" since there is no browser-surface to verify.
