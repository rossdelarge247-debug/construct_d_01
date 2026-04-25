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
- [ ] Vercel Production scope verified — N/A in α (γ owns CI/Vercel hardening; α only makes the read seam).
- [x] Regex check clean: `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` is an enum string (`'dev'|'prod'`), not a key/secret/token/password. Pattern check confirms no match against `_KEY|_SECRET|_TOKEN|_PASSWORD|_PRIVATE`.
- [ ] `.env.example` updated — TBD post-implementation.
- [ ] CI gate passes — TBD γ owns the production-build CI gate; α verifies the lint-equivalent locally.

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

- [x] **Dev-only code lives under** `lib/auth/dev-*` / `lib/store/dev-*` per spec 72 §7 line 88. Verified by file-naming convention in α.
- [ ] **Dev routes return 404 in prod** — N/A in α (no routes); β responsibility.
- [x] **No references to `@dev.decouple.local` in non-dev code** — α confines the synthetic email domain to `dev-session.ts` and the 2 scenario JSONs. No leakage into shared types / index modules. Verified by `grep` at adversarial review.
- [ ] **No imports from `dev-session.ts` / `dev-store.ts` in non-dev routes** — ESLint rule is γ. α relies on convention + reviewer eyes for now (single-import surface via `index.ts` makes accidental cross-imports unlikely).
- [ ] **Dev-mode-leak CI scan passes** — γ owns CI gate. α verifies locally: `pnpm build` with `DECOUPLE_AUTH_MODE=prod` succeeds and `getSession()` calls throw at module-level (covered by AC-2 + T-2).
- [x] **Storage key prefix `decouple:dev:v1`** matches spec 71 §4 line 240 + spec 72 §7 line 308. β's reset-button will wipe this prefix.
- [x] **Single source of truth**: `MODE` is read once in `lib/auth/index.ts`; everywhere else imports `MODE` from there. α verifies by grep at adversarial review.

## 10. Safeguarding impact

- [x] **No T4 data touched** — α has no safeguarding surface, no email / push / SMS, no analytics events, no admin paths. Spec 67 Gap 11 / spec 72 §9 do not bind in α.
- [x] V1 signposting baseline (exit-this-page, Women's Aid / NDAH / Samaritans) is untouched — α adds no surfaces that could regress existing safeguarding chrome.

## 11. Security headers + CSP

- [x] N/A · reason: α has no UI surface, no external scripts, no new origins. CSP / `next.config.ts` unchanged.

## 12. Adversarial review

- [ ] `/security-review` skill run on slice diff — TBD at slice end. **Required for α** as the first logic + auth slice (per CLAUDE.md "Adversarial review gate (per slice)" + the deferred-skill experiment from HANDOFF-29 / 30 / 31).
- [ ] Manual sweep with explicit "poke holes" prompt — TBD.
- [ ] Output reviewed; each concern either addressed or explicitly deferred with reasoning — TBD.

**Review findings + disposition:**

| Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|
| TBD | TBD | TBD | TBD |

## 13. Dependency + secrets hygiene

- [ ] `npm audit` clean — TBD at slice end. α adds no new deps; no expected change to audit surface.
- [ ] Dependabot: no new criticals introduced — TBD.
- [x] **No new dependencies** added in α. Implementation uses TypeScript stdlib + native browser APIs (`localStorage`, `URLSearchParams`, `JSON`) only. No npm install.
- [ ] `gitleaks` clean — TBD at slice end. α has no secret-shaped strings: fixture emails are on the reserved synthetic domain; no API keys, tokens, or PII.
- [x] **No secrets in client bundle** — α has no secrets at all. The synthetic fixture user is the only identity in α and lives in localStorage by design.
- [x] **No secrets in commit history** — α adds no secrets; no rotation needed.

---

## Sign-off

- **Slice author:** TBD (session 32)
- **Date:** TBD
- **Reviewer:** N/A — α handles T1 synthetic data only; no T3+ data and no new third-party introduces a mandatory reviewer.
- **All boxes ticked or justifiably N/A:** TBD at slice end
- **Pen-test readiness note:** α's primary pen-test surface is the dev/prod boundary (§9). A pen-test would specifically check: (1) can a user reach `/app/dev/*` in production? — N/A in α (no routes); (2) can dev fixture emails reach the prod signup endpoint? — N/A in α (no signup endpoint); (3) does the runtime assertion fire in a misconfigured production deploy? — covered by AC-3 + T-3. Items (1) and (2) bind on β/γ deploys, not α.
