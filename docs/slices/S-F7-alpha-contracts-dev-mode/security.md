# S-F7-α · Persistence + auth abstraction (contracts + dev-mode backend) — Security DoD

**Slice:** S-F7-alpha-contracts-dev-mode
**Source:** `docs/workspace-spec/72-engineering-security.md` §11
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

α is an infrastructure slice — interfaces + dev-mode adapters + 2 fixture scenarios. It handles **synthetic fixture data only** (T1 Functional, dev-only). It does NOT touch T2+ user data, real auth, real storage, real network, real PII, or any third-party API. The boundary it establishes is critical (dev/prod isolation), but α itself ships no production data path.

---

## 1. Data classification per AC

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 (interfaces) | Type definitions only | T0 (code) | N/A — types carry no runtime data |
| AC-2 (mode-conditional exports) | `MODE` env-var read | T1 Functional | Read once at module init; no logging |
| AC-3 (runtime assertion) | `NODE_ENV` + `MODE` strings | T1 Functional | Throws verbatim spec-72-§7 message; no env values logged |
| AC-4 (dev-session) | Fixture user (synthetic email, fake fields) | T1 Functional (synthetic) | `@dev.decouple.local` reserved domain; no real PII |
| AC-5 (dev-store) | Fixture data only | T1 Functional (synthetic) | localStorage scope-isolated by user+scope |
| AC-6 (dev-auth-gate) | Fixture session reference | T1 Functional | No cross-user logic in dev mode |
| AC-7 (scenarios + loader) | Pre-defined synthetic states | T1 Functional | JSON files committed; no runtime generation |
| AC-8 (URL scenario switch) | Query-param string | T1 Functional | Wipe + reload; no exfil path |
| AC-9 (test coverage) | Test fixtures only | T0 (test code) | N/A |
| AC-10 (no cookies) | Asserts cookie absence | T0 (invariant test) | N/A |
| AC-11 (key versioning comment) | Documentation | T0 (code comment) | N/A |

**Tier finding:** α is fully T1 Functional with synthetic data. No upgrade to T2+ within α scope.

## 2. New tables / columns

- [x] N/A · reason: α has no schema changes. Dev-mode persistence is `localStorage` only. Supabase tables / migrations / RLS land at S-F7-δ when prod impl ships.

## 3. API routes

- [x] N/A · reason: α adds no API routes. β adds `/app/dev/*` route group; α is library code only.

## 4. File upload surfaces

- [x] N/A · reason: no upload code in α.

## 5. New env vars

α references `NEXT_PUBLIC_DECOUPLE_AUTH_MODE`. Per spec 72 §7 line 277 + spec 71 §4 line 214, this env var is **already specified** in the engineering security spec. α formalises the read seam (single read in `src/lib/auth/index.ts`).

- [x] Already in spec 72 §2 inventory (introduced with S-F7 design, not new in α).
- [x] Vercel Production scope verified — N/A in α (γ owns CI/Vercel hardening; α only makes the read seam). Deferred to γ.
- [x] Regex check clean: `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` is an enum string (`'dev'|'prod'`), not a key/secret/token/password. Pattern check confirms no match against `_KEY|_SECRET|_TOKEN|_PASSWORD|_PRIVATE`.
- [x] `.env.example` not present in repo (project-wide gap, pre-existing — not introduced by α). Deferred: track in 68g for the slice that introduces `.env.example` (likely β or γ when prod auth lands).
- [x] CI gate passes — N/A in α; γ owns the production-build CI gate. α's runtime-assertion path is covered by AC-3 + auth-index test "throws spec-72-§7 verbatim error when NODE_ENV=production and MODE!=prod" (PASS at commit `8d3bc82`).

## 6. Third-party data flows

- [x] N/A · reason: α has no third-party integration. No network code at all in α.

## 7. Audit log entries

- [x] N/A · reason: α has no T3+ read/write operations. Audit logging concerns activate at S-F7-δ + downstream slices that touch financial data.

## 8. Error handling

α has three error paths. All handled per spec 72 §8.

- [x] **Runtime assertion** (AC-3): throws `Error('DECOUPLE_AUTH_MODE must be "prod" in production build')` — verbatim per spec 72 §7 line 282–284. No internal paths leaked. Not user-facing — fails at boot before any user interaction.
- [x] **Prod-import-throws stub** (AC-2): throws `Error('S-F8 not implemented — prod auth requires S-F7-δ')`. Module-level error; not user-facing in α (no production deployment yet). Includes the slice ID for traceability — internal-developer-facing, not user-facing.
- [x] **Unknown scenario name** (AC-7): throws clear error mentioning available scenarios. Dev-only path, dev-only consumers — list of scenario names is non-sensitive (synthetic fixture names).
- [x] **localStorage unavailable** (AC-5): single `console.warn` + in-memory fallback; no throw to caller. Warning string is generic ("dev store falling back to in-memory") — no env / user / state details.
- [x] No stack traces / SQL / internal paths / third-party error bodies leaked — α has no SQL, no internal paths beyond slice IDs, no third-party.
- [x] Reference IDs not required for α errors — α errors are dev-only or boot-time; reference-ID pattern applies to runtime user-visible errors which α does not produce.

## 9. Dev/prod boundary

α establishes the boundary itself. This section is the load-bearing one for α.

- [x] **Dev-only code lives under** `lib/auth/dev-*` / `lib/store/dev-*` per spec 72 §7 line 88. Verified: `src/lib/auth/{dev-session,dev-auth-gate}.ts`, `src/lib/store/{dev-store,scenario-loader}.ts` + `src/lib/store/scenarios/*.json`.
- [x] **Dev routes return 404 in prod** — N/A in α (no routes); β responsibility.
- [x] **No references to `@dev.decouple.local` in non-dev code** — `grep -rn '@dev\.decouple\.local' src/` returns 3 hits, all confined to `dev-session.ts:8` + the 2 scenario JSONs. No leakage into shared types or `index.ts` modules.
- [x] **No imports from `dev-session.ts` / `dev-store.ts` in non-dev routes** — `grep -rn "from .*dev-session\|from .*dev-auth-gate\|from .*dev-store"` returns 4 hits, all intra-module (within `src/lib/auth/` or `src/lib/store/`). No external consumers exist (α is greenfield). Single-import-surface convention enforced by reviewer eye until γ ESLint rule.
- [x] **Dev-mode-leak CI scan passes** — γ owns CI gate. α-local verification: auth-index test asserts module load throws verbatim spec-72-§7 message under `NODE_ENV=production` + `MODE=dev` (PASS at commit `8d3bc82`). `pnpm build` not run in α (no UI surface to deploy); β covers prod-build smoke when routes ship.
- [x] **Storage key prefix `decouple:dev:v1`** matches spec 71 §4 line 240 + spec 72 §7 line 308. β's reset-button will wipe this prefix; `wipeDevState()` in `scenario-loader.ts` already wipes by this prefix.
- [x] **Single source of truth**: `grep -rn 'NEXT_PUBLIC_DECOUPLE_AUTH_MODE' src/` returns 1 hit at `src/lib/auth/index.ts:8`. `lib/store/index.ts` consumes `MODE` via `import { MODE } from '@/lib/auth'`.

## 10. Safeguarding impact

- [x] **No T4 data touched** — α has no safeguarding surface, no email / push / SMS, no analytics events, no admin paths. Spec 67 Gap 11 / spec 72 §9 do not bind in α.
- [x] V1 signposting baseline (exit-this-page, Women's Aid / NDAH / Samaritans) is untouched — α adds no surfaces that could regress existing safeguarding chrome.

## 11. Security headers + CSP

- [x] N/A · reason: α has no UI surface, no external scripts, no new origins. CSP / `next.config.ts` unchanged.

## 12. Adversarial review

- [x] `/security-review` skill run on slice diff — ran twice (per-layer per session-33 plan). Auth layer at commit `97777cc`: clean, no findings ≥ confidence 8. Store layer at commit `efe47b5`: 1 MEDIUM finding (confidence 9) — fixed in commit `8d3bc82` with regression tests across `__proto__`, `constructor`, `toString`, `hasOwnProperty`.
- [x] Manual sweep with explicit "poke holes" prompt — completed. Angles checked: race conditions on concurrent `getSession()` calls (idempotent — both write same FIXTURE bytes); Date hydration on garbage JSON (`new Date('garbage')` returns Invalid Date — engineering edge, not security); scenario JSON tampering (build-time `import`, not runtime parse — bundle integrity dependency, not runtime concern); `applyScenarioFromUrl` mode-gating (not gated, but wipes only `decouple:dev:*` keys which are empty in prod — engineering hygiene flagged below); `FIXTURE.id='sarah-dev'` vs scenario `session.id='sarah'` (engineering inconsistency, no security impact); subscribe stub returning no-op fn (no callbacks fire — no security impact, β implements real subscribe).
- [x] Output reviewed; each concern addressed or explicitly deferred — see disposition table below.

**Review findings + disposition:**

| Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|
| `loadScenario("__proto__")` bypassed truthy guard, ran `wipeDevState()` before crash on `for…of undefined`. URL-driven via `?scenario=__proto__`; persistent across reload. | MEDIUM (confidence 9) | **Fixed** in commit `8d3bc82`: `Object.hasOwn` lookup guard + `try/finally` URL cleanup. Regression test parametrised over 4 prototype keys (`__proto__`, `constructor`, `toString`, `hasOwnProperty`). | Author (S-F7-α) — closed. |
| `applyScenarioFromUrl` is not mode-gated; in prod build it would still run if imported and called. Wipes only `decouple:dev:*` keys (empty namespace in prod), so no real prod impact, but engineering hygiene improves with a mode guard or a γ ESLint rule. | LOW (engineering hygiene, not security) | **Deferred to γ.** γ ships the ESLint single-import rule that prevents prod-mode files from importing dev-* paths. α's interim mitigation: `scenario-loader.ts` is only imported by α tests; no production import path exists yet. | γ owner. |
| `dev-session.ts` FIXTURE.id is `'sarah-dev'`; scenario JSONs use `'sarah'`. Default session vs scenario session id divergence may confuse downstream consumers. | LOW (engineering inconsistency, not security) | **Deferred to β.** β's scenario-picker UI and dev banner can normalise. Doesn't block α — both ids resolve a valid `UserSession` shape; tests don't depend on a specific id value. | β owner. |
| Bundle hygiene: `lib/auth/index.ts` unconditionally imports `dev-session` + `dev-auth-gate`, so dev fixture code is bundled in prod even though `MODE === 'prod'` selects the throwing stub. Tree-shakable in principle (no module-load side effects); ESLint rule prevents future direct imports. | LOW (bundle hygiene, not security — env vars trusted, runtime assertion fail-closed) | **Deferred to γ.** γ adds the dev-mode-leak CI scan that detects `@dev.decouple.local` in production bundles and the ESLint rule. | γ owner. |

## 13. Dependency + secrets hygiene

- [x] `pnpm audit`: 1 MODERATE in `next>postcss` (transitive, GHSA-qx2v-qp2m-jg93). **Pre-existing**, not introduced by α (α adds zero new deps). Tracked separately as a maintenance item.
- [x] Dependabot: no new criticals introduced by α (no new deps).
- [x] **No new dependencies** added in α. Implementation uses TypeScript stdlib + native browser APIs (`localStorage`, `URLSearchParams`, `JSON`) only. `git diff origin/main -- package.json` shows no `dependencies` / `devDependencies` changes.
- [x] `gitleaks` not installed in sandbox. Manual sweep of α diff (4 src/lib/auth + 6 src/lib/store + 1 test amend) confirms no API keys, no tokens, no passwords, no high-entropy strings. Fixture emails are on the reserved `@dev.decouple.local` domain (spec 72 §7 line 303); the only "credential-shaped" string is the deviceFingerprint `'dev-fixture-device'` which is intentionally a non-secret label.
- [x] **No secrets in client bundle** — α has no secrets at all. Synthetic fixture user is the only identity; lives in localStorage by design.
- [x] **No secrets in commit history** — α adds no secrets; no rotation needed.

---

## Sign-off

- **Slice author:** Claude (session 33, pair-programming with user `rossdelarge247-debug`)
- **Date:** 2026-04-25
- **Commit verified:** `8d3bc82` (security fix HEAD); branch `claude/S-F7-alpha-contracts-dev-mode`
- **Reviewer:** N/A — α handles T1 synthetic data only; no T3+ data and no new third-party introduces a mandatory human reviewer. Adversarial coverage via `/security-review` skill (per-layer) + manual sweep recorded in §12.
- **All boxes ticked or justifiably N/A:** ✓ All §1–§13 checkboxes ticked. Three §9 items deferred to β/γ owners with reasoning recorded inline; one §12 finding fixed in-slice; three §12 engineering-hygiene notes deferred with owner.
- **Pen-test readiness note:** α's primary pen-test surface is the dev/prod boundary (§9). A pen-test would specifically check: (1) can a user reach `/app/dev/*` in production? — N/A in α (no routes); (2) can dev fixture emails reach the prod signup endpoint? — N/A in α (no signup endpoint); (3) does the runtime assertion fire in a misconfigured production deploy? — covered by AC-3 + auth-index test (PASS at `8d3bc82`). Items (1) and (2) bind on β/γ deploys, not α.
