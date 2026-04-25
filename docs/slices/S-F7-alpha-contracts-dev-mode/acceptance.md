# S-F7-α · Persistence + auth abstraction (contracts + dev-mode backend) — Acceptance criteria

**Slice:** S-F7-alpha-contracts-dev-mode
**Spec ref:** `docs/workspace-spec/71-rebuild-strategy.md` §4 + §8 (S-F7 slice card) · `docs/workspace-spec/72-engineering-security.md` §3 + §7
**Phase(s):** All (foundation)
**Status:** Approved · AC frozen at session 32 kickoff

---

## Context

S-F7 is the persistence + auth abstraction. Per spec 71 §4: *"Dev mode is a first-class implementation behind a real interface, not a special case sprinkled through the code. Same domain code paths run in dev and prod; only the implementation behind the interface swaps. Hexagonal-architecture style."* This α sub-slice ships the **contracts** (Session, WorkspaceStore, AuthGate interfaces) plus a **minimal dev-mode backend** (localStorage adapters + 2 fixture scenarios + URL scenario switching). It does NOT ship dev surface routes (β), production hardening (γ), or Supabase prod implementations (δ / S-F8).

α exists so that downstream foundation slices (S-F2, S-F3, S-F4, S-F6) have a stable contract to consume during their build, without forcing the full S-F7 surface to ship in one session. Spec 71 §8 line 488: *"Engineering can build + test slices without auth shipping; real auth swaps in cleanly later."*

## Dependencies

- **Upstream slices:** S-F1 (design system) — only for any future dev banner reskin (β); α has no UI surface.
- **Open decisions required:** none. Spec 71 §4 + §8 + spec 72 §3 + §7 lock all interface shapes and security constraints.
- **Re-use / Preserve-with-reskin paths touched:** none. α is greenfield (`src/lib/auth/*` and `src/lib/store/*` are new).
- **Discarded paths deleted at DoD:** none in α. Existing `src/lib/supabase/workspace-store.ts` (Re-use) is untouched in α; S-F7-δ wraps it.

## Sub-slice scope

S-F7 is split four ways. α covers contracts + dev-mode backend only.

| S-F7 area | α | β | γ | δ |
|---|---|---|---|---|
| Three interfaces (Session, WorkspaceStore, AuthGate) | ✓ | | | |
| Dev implementations (dev-session, dev-store, dev-auth-gate) | ✓ | | | |
| `/app/dev/*` route group | | ✓ | | |
| Env banner reskin | | ✓ | | |
| Fixture scenarios (8 total per spec 71 line 268–283) | 2/8 | 6/8 | | |
| Supabase prod implementations | | | | ✓ (S-F8) |
| Runtime assertion (`NODE_ENV=prod && MODE!=prod` throws) | ✓ | | | |
| Build-time assertion | | | ✓ | |
| ESLint single-import rule | | | ✓ | |
| CI gate (production-build dev-mode-leak detector) | | | ✓ | |

## MLP framing

The loveable floor for α is: a downstream slice author can `import { getSession, getStore, getAuthGate } from '@/lib/auth' (or '@/lib/store')` and build their slice end-to-end against fixture state, switch between two scenarios via URL, and never touch storage internals or worry about prod accidentally shipping. Cuts to β/γ/δ are deferred AC, not lukewarm AC.

---

## AC-1 · Three interface contracts shipped

- **Outcome:** Domain code can import `UserSession`, `WorkspaceStore`, `AuthGate` types and consume them without reaching for impl details.
- **Verification:** `src/lib/auth/types.ts` exports `UserSession` and `AuthGate`; `src/lib/store/types.ts` exports `WorkspaceStore`. Type shapes match spec 71 §4 lines 182–210 + spec 72 §3 lines 99–107 byte-for-byte. `WorkspaceStore.subscribe()` is declared in interface (impl deferred to β).
- **In scope:** Type definitions only. Module surface (index.ts) covered separately in AC-2.
- **Out of scope:** Any concrete implementation; impl lives in dev-* files.
- **Opens blocked:** none.
- **Loveable check:** A downstream consumer reads the type and knows exactly what they get — no surprises later.
- **Evidence at wrap:** TBD — `tsc --noEmit` passes; spec line-by-line diff against committed types.

## AC-2 · Module entry points with mode-conditional exports

- **Outcome:** Single import surface (`@/lib/auth`, `@/lib/store`) selects dev or prod impl based on `MODE` constant; never touches env var directly.
- **Verification:** `src/lib/auth/index.ts` reads `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` once at module init and exports `MODE: 'dev' | 'prod'`. Exports `getSession`, `getAuthGate` selecting dev impl when `MODE === 'dev'`. When `MODE === 'prod'`, exports stub functions that throw `Error('S-F8 not implemented — prod auth requires S-F7-δ')`. Symmetric for `src/lib/store/index.ts` (`getStore`).
- **In scope:** α dev path + prod-throws stub.
- **Out of scope:** Real Supabase prod impl (δ); ESLint rule forbidding direct env-var read (γ); build-time assertion (γ).
- **Opens blocked:** none.
- **Loveable check:** A consumer never thinks about modes — they import and use.
- **Evidence at wrap:** TBD — unit test asserting prod stub throws with the correct error.

## AC-3 · Runtime assertion at module load

- **Outcome:** A production build with `MODE !== 'prod'` fails loudly at boot, never silently.
- **Verification:** `src/lib/auth/index.ts` throws `Error('DECOUPLE_AUTH_MODE must be "prod" in production build')` if `process.env.NODE_ENV === 'production' && MODE !== 'prod'`. Wording verbatim per spec 72 §7 line 282–284.
- **In scope:** Runtime assertion only.
- **Out of scope:** Build-time assertion (γ); CI gate (γ).
- **Opens blocked:** none.
- **Loveable check:** An accidental misconfiguration in CI/Vercel can't silently leak dev mode to users.
- **Evidence at wrap:** TBD — unit test simulating `NODE_ENV=production` + `MODE='dev'` asserts throw with verbatim message.

## AC-4 · Dev session implementation

- **Outcome:** Dev mode resolves a fixture user with 2FA pre-verified, on the reserved synthetic email domain, with state in a versioned localStorage key.
- **Verification:** `src/lib/auth/dev-session.ts` exports a `getSession()` returning a `UserSession` where:
  - `email` ends with `@dev.decouple.local` (spec 72 §7 line 303)
  - `twoFactorVerified === true` (spec 72 §3 line 129 dev bypass)
  - State persisted under localStorage key `decouple:dev:session:v1` (spec 71 §4 line 240)
  - **Never sets cookies** (spec 72 §3 line 129)
- **In scope:** Dev session resolution from current scenario.
- **Out of scope:** Real auth flow; magic link; 2FA enrolment; cookie-based session.
- **Opens blocked:** none.
- **Loveable check:** No signup friction in dev — open the app and you're Sarah.
- **Evidence at wrap:** TBD — unit tests asserting all four invariants above + cookie absence.

## AC-5 · Dev store implementation

- **Outcome:** Read/write user-scoped state to localStorage with versioned, user-isolated, scope-isolated keys; degrade gracefully if localStorage unavailable.
- **Verification:** `src/lib/store/dev-store.ts` exports `read<T>(userId, scope)`, `write<T>(userId, scope, data)`, `subscribe<T>(userId, scope, cb)`. Storage key pattern: `decouple:dev:store:v1:{userId}:{scope}` (spec 71 §4 line 242). When localStorage unavailable: log a single warning, fall back to in-memory map, never throw. `subscribe()` returns a no-op unsubscribe (impl deferred to β).
- **In scope:** Synchronous read/write; in-memory degradation; subscribe stub.
- **Out of scope:** Cross-tab sync (β `storage` event); real subscribe impl (β); reset() — call site uses dev banner (β) or direct localStorage wipe in tests.
- **Opens blocked:** none.
- **Loveable check:** A downstream slice reads/writes state and never thinks about the storage backend.
- **Evidence at wrap:** TBD — unit tests for round-trip, scope isolation, user isolation, degradation path.

## AC-6 · Dev auth gate

- **Outcome:** Route guards in dev mode never block; downstream code can call `requireUser()` and always get the fixture session.
- **Verification:** `src/lib/auth/dev-auth-gate.ts` exports an `AuthGate` impl where:
  - `requireUser()` returns the current fixture session, never throws (always-on in dev)
  - `redirectIfAuthed()` is a no-op
  - `currentSession()` returns the fixture session (or `null` only if scenario is explicitly logged-out — out of scope for α; default returns session)
- **In scope:** All three method behaviours per spec 71 §4 line 244.
- **Out of scope:** Prod auth gate (δ); 2FA enforcement at route layer (a separate slice when 2FA UI lands).
- **Opens blocked:** none.
- **Loveable check:** A page renders in dev without redirect detours.
- **Evidence at wrap:** TBD — unit test per method.

## AC-7 · Two fixture scenarios + scenario loader

- **Outcome:** Scenario JSON files capture deterministic state snapshots; loading a scenario installs that state into the dev store and session.
- **Verification:**
  - `src/lib/store/scenarios/cold-sarah.json` — blank workspace, no bank, no data (spec 71 §4 line 272)
  - `src/lib/store/scenarios/sarah-mid-build.json` — confirmations ~50% complete, some estimates, some evidence (spec 71 §4 line 274)
  - `src/lib/store/scenario-loader.ts` exports `loadScenario(name: string)` which: wipes all `decouple:dev:*` keys, reads scenario JSON, writes session + store entries per scenario.
  - JSON shape evolves from the two examples — no formal zod schema in α (premature abstraction; lock formal schema in β when 8 scenarios reveal the shared pattern).
- **In scope:** 2 scenarios + loader.
- **Out of scope:** 6 remaining scenarios (β); zod schema validation (β); UI scenario picker (β).
- **Opens blocked:** none.
- **Loveable check:** A test or dev tour can pick a state and start there — no manual seeding.
- **Evidence at wrap:** TBD — unit test asserting load-then-read round-trip on each scenario.

## AC-8 · URL query-param scenario switching

- **Outcome:** A developer building S-F2/F3/F6 can switch scenarios mid-session by editing the URL.
- **Verification:** Module init in `src/lib/store/scenario-loader.ts` checks `URLSearchParams` for `?scenario={name}`. When present in dev mode: wipe `decouple:dev:*` keys, install scenario, reload (single function, ~20 lines). No-op in prod.
- **In scope:** Query-param detection + reload-with-scenario flow.
- **Out of scope:** Scenario picker UI (β); persistent scenario state independent of URL (β); URL after reload — query param is consumed and removed before reload to prevent infinite-loop.
- **Opens blocked:** none.
- **Loveable check:** Switching scenarios takes one URL edit, not five clicks.
- **Evidence at wrap:** TBD — unit test simulating query-param presence + storage state after.

## AC-9 · Behavioural test coverage per unit

- **Outcome:** Every unit (dev-session, dev-store, dev-auth-gate, scenario-loader) has behavioural tests that exercise the interface with synthetic inputs and assert observable outputs. No file-content assertions per CLAUDE.md "Don't write file-content assertions for logic slices."
- **Verification:** Four `*.test.ts` files under `src/lib/{auth,store}/__tests__/`, each TDD-RED-then-GREEN. Min assertion counts per file:
  - `dev-session.test.ts` — 5+ assertions (fixture init, scenario-driven email, 2FA flag, no-cookies invariant, localStorage key shape)
  - `dev-store.test.ts` — 6+ assertions (round-trip, scope isolation, user isolation, missing-localStorage degradation, key versioning, JSON serialization)
  - `dev-auth-gate.test.ts` — 3+ assertions (requireUser, redirectIfAuthed, currentSession)
  - `scenario-loader.test.ts` — 4+ assertions (load applies state, wipe clears state, both scenarios load, query-param trigger)
- **In scope:** Unit-level behavioural tests in vitest.
- **Out of scope:** Integration / E2E tests (β when routes exist).
- **Opens blocked:** none.
- **Loveable check:** A future maintainer reading the test file understands the contract without reading the impl.
- **Evidence at wrap:** TBD — vitest run output; final assertion count per file.

## AC-10 · No-cookies invariant test

- **Outcome:** Dev mode is provably cookie-free; impossible to leak a fixture session via cookie.
- **Verification:** `dev-session.test.ts` includes an assertion that after `getSession()` is invoked (and any associated module init), `document.cookie` is unchanged (or empty in jsdom test env). Verifies spec 72 §3 line 129: *"Dev mode NEVER issues real cookies — dev session state lives only in memory + localStorage."*
- **In scope:** One specific assertion in dev-session.test.ts.
- **Out of scope:** Browser-level cookie audit (β when /app/dev/* exists for end-to-end test).
- **Opens blocked:** none.
- **Loveable check:** Security-conscious reviewer sees the test name and is satisfied without reading impl.
- **Evidence at wrap:** TBD — passing test.

## AC-11 · Storage key versioning documented

- **Outcome:** A future migration to v2 storage schema knows what v1 was for.
- **Verification:** `src/lib/store/dev-store.ts` and `src/lib/auth/dev-session.ts` each carry one short comment line above their key constant: the WHY of v1 + intent that v2 will require migration. Per CLAUDE.md "Default to writing no comments" exception ("Only add one when the WHY is non-obvious").
- **In scope:** One comment line per file.
- **Out of scope:** Migration tooling (β / γ); schema-version-detection at boot (γ).
- **Opens blocked:** none.
- **Loveable check:** A maintainer in 2027 reads the line and understands the constraint without archaeology.
- **Evidence at wrap:** TBD — comment present in both files.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-25 | User | Approved · AC frozen | Session 32 kickoff. AC arithmetic check: α + β + γ + δ = 100% of S-F7 scope per sub-slice table above. Two judgement calls baked: no formal zod schema in α; prod-import-throws strategy. |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
