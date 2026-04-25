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
| 1 | `import { getSession, getStore, getAuthGate } from '@/lib/auth' (or '@/lib/store')` from a test file | All three resolve to dev impls under `MODE='dev'` | PASS — `tests/unit/auth-index.test.ts` (lines 34–50) + `tests/unit/store-index.test.ts` (lines 18–26) assert each surface returns the dev impl with the expected method shape. |
| 2 | Call `loadScenario('sarah-mid-build')` | Storage populated with scenario state | PASS — `tests/unit/store-scenario-loader.test.ts` (lines 31–41) asserts session key truthy + ≥1 store key under `decouple:dev:store:v1:` prefix. |
| 3 | Call `getSession()` then `getStore().read(session.id, 'profile')` | Returns scenario-defined data (no profile scope in fixtures; equivalent: `bank` / `confirmations` / `evidence` scopes) | PASS — store round-trip covered by `store-dev-store.test.ts` (lines 20–26 + 28–34); scenario-loader populates the keys per `sarah-mid-build.json`. |
| 4 | Call `getAuthGate().requireUser()` | Resolves to fixture session (no throw, no redirect) | PASS — `tests/unit/auth-dev-auth-gate.test.ts` (lines 22–27) + `auth-index.test.ts` (lines 42–50). |

**Pass / fail:** PASS — full automated equivalent of consumer-smoke. 81/81 tests GREEN at HEAD `8d3bc82`.

## Edge cases

| Scenario | Trigger | Expected outcome | Evidence |
|---|---|---|---|
| Empty state | First import with empty localStorage, no scenario loaded | `getStore().read(...)` returns `null`; `getSession()` returns a default fixture | PASS — `store-dev-store.test.ts:52-55` (read returns null) + `auth-dev-session.test.ts:46-56` (default FIXTURE returned). |
| localStorage unavailable | `localStorage.setItem` throws (jsdom stub) | One `console.warn`; in-memory fallback used; no throw to caller | PASS — `store-dev-store.test.ts:64-85` (mocks both setItem + getItem to throw; asserts no rethrow + in-memory round-trip + ≥1 warn). |
| Unknown scenario name | `loadScenario('not-a-scenario')` | Throws clear error mentioning available scenarios | PASS — `store-scenario-loader.test.ts:59-64`. |
| Prototype-key bypass attempt | `loadScenario('__proto__')` (and `'constructor'`, `'toString'`, `'hasOwnProperty'`) | Throws unknown-scenario error WITHOUT wiping prior state | PASS — regression test `store-scenario-loader.test.ts:66-86`, parametrised via `it.each` over 4 prototype keys. (Caught by per-layer `/security-review`; fixed `8d3bc82`.) |
| URL scenario param + reload-loop guard | `?scenario=cold-sarah` triggers loader | Param consumed via `replaceState`; post-replaceState URL has no `scenario=` | PASS — `store-scenario-loader.test.ts:66-98`. |
| URL scenario param failure path | `?scenario=__proto__` would otherwise persist | `try/finally` consumes the param even on throw — no reload-loop amplification | Covered structurally by `applyScenarioFromUrl` `try/finally` in `scenario-loader.ts:52-65`; URL-cleanup-on-throw integration test deferred to β when end-to-end browser context exists. |
| Prod mode + dev export call | `MODE='prod'` + `getSession()` | Throws `Error('S-F8 not implemented — prod auth requires S-F7-δ')` | PASS — `auth-index.test.ts:52-65` (getSession + getAuthGate.requireUser) + `store-index.test.ts:28-34` (store.read). |
| Production-build runtime assertion | `NODE_ENV='production'` + `MODE='dev'` | Module load throws spec-72-§7 verbatim error `'DECOUPLE_AUTH_MODE must be "prod" in production build'` | PASS — `auth-index.test.ts:67-73` (asserts the literal string verbatim). |

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
| Existing `src/lib/supabase/workspace-store.ts` (Re-use) | α does NOT import or modify | PASS | `git diff origin/main -- src/lib/supabase/` empty. |
| Existing `src/lib/bank/test-scenarios.ts` (Re-use) | α does NOT import or modify | PASS | `git diff origin/main -- src/lib/bank/` empty. |
| Tooling: vitest config | α adds tests; smoke = `pnpm test` runs without config error | PASS | Full suite 81/81 GREEN (11 files: auth + store + 5 pre-existing). |
| Tooling: tsc | α adds types; smoke = `pnpm tsc --noEmit` clean for α surface | PASS for α surface. **Pre-existing failure** in `src/lib/stripe/client.ts:25` (Stripe SDK API version mismatch introduced in commit `573d63a` "mega footer", unrelated to S-F7-α). Tracked separately; does not block α DoD because the error is not introduced by α and does not affect any α-touched file. |

## Dev-mode sanity (substantively applies — α is the dev-mode foundation)

The full dev-mode banner / route gating is β scope, but α must not block β from succeeding:

- [x] α's `MODE` constant is the single source of truth — `grep` confirms 1 read at `src/lib/auth/index.ts:8`. β's banner can read from `import { MODE } from '@/lib/auth'`.
- [x] α's localStorage key prefix `decouple:dev:` matches the prefix β's reset-button wipes — `wipeDevState()` in `scenario-loader.ts:23-27` already wipes by this prefix.
- [x] α's fixture email format `*@dev.decouple.local` is contained — `grep -rn '@dev\.decouple\.local' src/` returns 3 hits, all in dev-* files / scenario JSONs. γ's CI gate searches for this pattern in production bundles.
- [x] Production-build behaviour covered by `auth-index.test.ts:67-73` (NODE_ENV=production + MODE=dev → throws verbatim) + `auth-index.test.ts:52-65` + `store-index.test.ts:28-34` (MODE=prod → consumer call throws S-F8-not-implemented). Full `next build` smoke deferred to β when routes ship.

## Adversarial run

- [x] **Manual sweep** completed — angles documented in `security.md` §12. No security findings beyond what `/security-review` caught; 3 engineering-hygiene notes (LOW severity) deferred to β/γ owners with reasoning.
- [x] **`/security-review` skill** run twice (per-layer): auth at `97777cc` (clean, no findings ≥ confidence 8); store at `efe47b5` (1 MEDIUM finding — fixed in `8d3bc82` with parametrised regression tests).
- [ ] **`/review` skill** — deferred. Optional second-opinion pass; security review + manual sweep already covered code quality angles. Run if reviewer requests.

---

## Sign-off

- **Verified by:** Claude (session 33), pair-programming with `rossdelarge247-debug`
- **Date:** 2026-04-25
- **Commit SHA verified:** `8d3bc82` (HEAD of `claude/S-F7-alpha-contracts-dev-mode` at sign-off)
- **Preview URL:** N/A (α has no UI surface)
- **Outstanding issues:**
  - 3 LOW engineering-hygiene notes (mode-gating of `applyScenarioFromUrl`, FIXTURE.id/scenario-id divergence, bundle hygiene) deferred to β/γ with owner — see `security.md` §12.
  - Pre-existing typecheck error in `src/lib/stripe/client.ts:25` (Stripe SDK API version), unrelated to α scope, tracked separately.
  - `/review` skill deferred — optional, can run if reviewer requests a second-opinion code-quality pass.
- **DoD item 4 status:** PASS — α maps "in-browser verification" to "consumer-smoke + automated test pass" since there is no browser surface in α. Justified: AC sub-slice table puts all routes/UI in β. β verification will cover the in-browser path when `/app/dev/*` ships.
