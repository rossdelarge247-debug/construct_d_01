# S-F7-α · Persistence + auth abstraction (contracts + dev-mode backend) — Test plan

**Slice:** S-F7-alpha-contracts-dev-mode
**AC doc:** `./acceptance.md`
**Framework:** `vitest` (unit + logic) — α has no UI surface, no Playwright, no manual steps.

---

## Test inventory

One test per AC. All α tests are unit-level + behavioural — exercise the interface with synthetic inputs, assert observable outputs. No file-content assertions per CLAUDE.md "Don't write file-content assertions for logic slices."

Test files map to source files 1:1, located at `tests/unit/` per project convention (verified against existing tests `recommendations-copy.test.ts`, `confirmation-questions-copy.test.ts`, etc.). Vitest env: `jsdom` with globals enabled (no need to import `describe`/`it`/`expect`); `@` alias maps to `./src`.

| Test file | Source under test | AC coverage |
|---|---|---|
| `tests/unit/auth-index.test.ts` | `src/lib/auth/index.ts` | AC-1 (auth types via inline `@ts-expect-error`), AC-2, AC-3 |
| `tests/unit/auth-dev-session.test.ts` | `src/lib/auth/dev-session.ts` | AC-4, AC-10, AC-11 |
| `tests/unit/auth-dev-auth-gate.test.ts` | `src/lib/auth/dev-auth-gate.ts` | AC-6 |
| `tests/unit/store-index.test.ts` | `src/lib/store/index.ts` | AC-1 (store types via inline `@ts-expect-error`), AC-2 |
| `tests/unit/store-dev-store.test.ts` | `src/lib/store/dev-store.ts` | AC-5, AC-11 |
| `tests/unit/store-scenario-loader.test.ts` | `src/lib/store/scenario-loader.ts` | AC-7, AC-8 |

Type-shape verification (AC-1) folded into the index test files via inline `// @ts-expect-error` assertions on deliberate mismatches. Avoids redundant runtime "type smoke" files; `pnpm tsc --noEmit` is the canonical type gate.

---

## T-1 · references AC-1 (interface contracts)

- **Given:** TypeScript compilation environment with α types committed.
- **When:** Test files import `UserSession`, `AuthGate`, `WorkspaceStore` and reference each declared field.
- **Then:** `tsc --noEmit` passes; deliberate-mismatch type-test (assigning a wrong-shape literal) fails compilation.
- **Type:** unit (compile-time + runtime smoke)
- **Automated:** yes
- **Fixture:** none — pure type tests
- **Evidence at wrap:** TBD — `pnpm tsc --noEmit` clean output.

## T-2 · references AC-2 (mode-conditional exports)

- **Given:** `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` set to `'dev'` then to `'prod'` in test env (vitest's `vi.stubEnv`).
- **When:** Module is dynamically imported under each setting.
- **Then:**
  - dev: `getSession`, `getAuthGate`, `getStore` resolve to dev impls.
  - prod: invoking any of `getSession`, `getAuthGate`, `getStore` throws `Error('S-F8 not implemented — prod auth requires S-F7-δ')`.
- **Type:** unit
- **Automated:** yes
- **Fixture:** stubbed env var; no scenario load needed.
- **Evidence at wrap:** TBD.

## T-3 · references AC-3 (runtime assertion)

- **Given:** `NODE_ENV` stubbed to `'production'`, `MODE` resolved to `'dev'`.
- **When:** `src/lib/auth/index.ts` is loaded.
- **Then:** Throws `Error('DECOUPLE_AUTH_MODE must be "prod" in production build')` — message verbatim per spec 72 §7 line 282–284.
- **Type:** unit
- **Automated:** yes
- **Fixture:** stubbed env vars.
- **Evidence at wrap:** TBD.

## T-4 · references AC-4 (dev session)

- **Given:** Default scenario applied (`cold-sarah` or `sarah-mid-build`).
- **When:** `getSession()` called.
- **Then:**
  - Returned `UserSession.email` matches `/@dev\.decouple\.local$/`.
  - `twoFactorVerified === true`.
  - `localStorage.getItem('decouple:dev:session:v1')` resolves to a JSON-parseable session object.
  - Spec-required fields present (`id`, `role`, `createdAt`, `lastActiveAt`, `deviceFingerprint`).
- **Type:** unit
- **Automated:** yes
- **Fixture:** scenarios via `scenario-loader.loadScenario`.
- **Evidence at wrap:** TBD.

## T-5 · references AC-5 (dev store)

- **Given:** Empty localStorage; valid `userId` + `scope` strings.
- **When:** `write(userId, scope, data)` then `read(userId, scope)`.
- **Then:**
  - Round-trip returns deeply-equal data.
  - Storage key matches pattern `decouple:dev:store:v1:{userId}:{scope}`.
  - Different `(userId, scope)` pairs do not cross-contaminate (write A; read B returns null).
  - `subscribe(userId, scope, cb)` returns a function; calling that function does not throw (no-op stub for α).
  - Stubbing `localStorage` to throw on every access: `read` returns `null`, `write` does not throw, single console.warn issued, in-memory map used as fallback.
- **Type:** unit
- **Automated:** yes
- **Fixture:** in-test data; no scenario file needed.
- **Evidence at wrap:** TBD.

## T-6 · references AC-6 (dev auth gate)

- **Given:** A loaded fixture session.
- **When:** `requireUser()`, `redirectIfAuthed('/elsewhere')`, `currentSession()` invoked.
- **Then:**
  - `requireUser()` resolves to the fixture session, never throws.
  - `redirectIfAuthed()` resolves with no observable side effect (no navigation API called — verified by spying on `window.location` setters).
  - `currentSession()` resolves to the fixture session (matches `getSession()`).
- **Type:** unit
- **Automated:** yes
- **Fixture:** scenario-driven session.
- **Evidence at wrap:** TBD.

## T-7 · references AC-7 (scenarios + loader)

- **Given:** Empty localStorage.
- **When:** `loadScenario('cold-sarah')` then `loadScenario('sarah-mid-build')`.
- **Then:**
  - After cold-sarah: session resolves; store reads return scenario-defined values; non-scenario keys return null.
  - After mid-build (loaded second): cold-sarah keys are wiped; mid-build state is present.
  - Loader rejects unknown scenario name with a clear error.
- **Type:** unit
- **Automated:** yes
- **Fixture:** the 2 JSON scenario files committed in α.
- **Evidence at wrap:** TBD.

## T-8 · references AC-8 (URL scenario switching)

- **Given:** `window.location.search` stubbed to `?scenario=sarah-mid-build`.
- **When:** scenario-loader module init runs.
- **Then:**
  - Detects param.
  - Wipes existing `decouple:dev:*` keys.
  - Installs sarah-mid-build scenario.
  - Reload-equivalent invoked (in test: stubbed `window.location.reload`, asserted called once).
  - Query param is consumed (URL after-trigger does NOT contain `?scenario=...` — prevents reload loop).
- **Type:** unit
- **Automated:** yes
- **Fixture:** stubbed `window.location`.
- **Evidence at wrap:** TBD.

## T-9 · references AC-9 (test coverage gate)

- **Outcome:** AC-9 is met by virtue of T-1..T-8 + T-10 + T-11 existing and passing. No standalone test.
- **Verification at wrap:** vitest run reports >= 18 assertions across the four primary test files (5 + 6 + 3 + 4 minimum).
- **Evidence at wrap:** TBD — vitest output assertion count.

## T-10 · references AC-10 (no cookies invariant)

- **Given:** Empty `document.cookie` at test start.
- **When:** `getSession()` invoked + any module init that runs in dev mode.
- **Then:** `document.cookie` is exactly `''` (unchanged). Spec 72 §3 line 129 invariant.
- **Type:** unit
- **Automated:** yes
- **Fixture:** vitest jsdom environment.
- **Evidence at wrap:** TBD.

## T-11 · references AC-11 (key versioning comment)

- **Verification:** `dev-store.ts` and `dev-session.ts` each carry a one-line comment above the storage key constant explaining the WHY of v1.
- **Mechanism:** This is the lone exception to the "no file-content assertions for logic slices" rule — it's a documentation invariant, not a logic invariant. Verified manually at adversarial review, NOT via test. Recorded as a code-review-checklist item, not a vitest test.
- **Type:** manual (reviewer check during adversarial pass)
- **Automated:** no
- **Reason for manual:** Documentation invariants don't merit a brittle file-regex test; reviewer scan is sufficient.
- **Evidence at wrap:** TBD — confirmed at adversarial review.

---

## Fixture + scenario references

- **Bank scenarios:** `src/lib/bank/test-scenarios.ts` (Re-use, untouched in α).
- **WorkspaceStore scenarios shipped in α:** `cold-sarah.json`, `sarah-mid-build.json`. Remaining 6 deferred to β.
- **Dev fixture user:** synthetic email on `@dev.decouple.local` per spec 72 §7.
- **No real user data in fixtures.** α is contract + plumbing only — no T2/T3 data shapes appear in fixtures yet.

## Visual regression placeholder

N/A — α has no UI surface. Visual concerns kick in at β (env banner reskin) and beyond.

## Manual test discipline

α is fully automated. The single manual check is T-11 (comment presence), executed as part of the adversarial review pass at slice-end.

## Test count summary

Minimum assertions per file:
- `dev-session.test.ts` — 5
- `dev-store.test.ts` — 6
- `dev-auth-gate.test.ts` — 3
- `scenario-loader.test.ts` — 4
- `auth/index.test.ts` — 3 (mode-conditional + runtime assertion)
- `store/index.test.ts` — 1 (mode-conditional)
- `types.test.ts` (×2) — type-only smoke (compile-time)

**Total floor:** ≥ 22 assertions. Likely actual: 25–30.
