# Spec 72 — Engineering Security Principles

**Date:** 22 April 2026
**Session:** 23 P0-1
**Status:** LIVE. Engineering execution layer. Complements spec 54 (risk register — the WHAT) and spec 56 (launch readiness — the WHEN / HOW MUCH). This spec is the HOW for engineers.
**Related:** spec 54 risk register · spec 56 launch readiness · spec 71 rebuild strategy · CLAUDE.md technical rules + coding conduct (Phase C) · docs/engineering-phase-candidates.md (parked engineering conventions).

---

## Purpose

Codify the engineering practices that make Decouple defensible against breach, abuse, and pen-test scrutiny — given the data we will store: PII, bank transactions, financial disclosures, safeguarding flags, court-bound legal documents. Ground rule: **security is built in from the first line of code, not bolted on at launch.**

Spec 54 names the risks. Spec 56 lists the formal compliance items + cost + lead time. This spec defines the daily engineering practice that satisfies both.

Three orientating principles:

1. **Defence in depth.** Every sensitive operation has at least two independent gates (e.g. RLS at DB + auth check at API + UI guard).
2. **Least privilege everywhere.** Default deny; explicit allow. Applies to RLS policies, env scoping, third-party scopes, internal access.
3. **Sensitive by default classification.** When unsure what tier a piece of data is, treat it as the most sensitive plausible tier. Down-classify only with evidence.

---

## 1. Data classification model

Six tiers, low to high sensitivity. Every field, table, log line, and analytics event maps to one. Default classification when unsure: **T3**. A field's tier is the highest tier of any data it could plausibly contain (e.g. a free-text `notes` field is T4 because users may write safeguarding info into it).

| Tier | Examples | Storage requirements | Logging rules | Retention |
|---|---|---|---|---|
| **T0 Public** | Marketing copy, public docs, FAQ | None special | OK to log | Indefinite |
| **T1 Functional** | Feature flags, UI preferences, anonymous telemetry | Standard | OK to log | Indefinite |
| **T2 Personal** | Name, email, address, DOB, ex's name + email | Encrypted at rest + transit; RLS-gated | Never log values; OK to log keys/IDs | 90 days post-case close (spec 56); DSAR access + deletion |
| **T3 Financial** | Bank transactions, balances, CETV, salary, expenses, asset values, debts | T2 + every read logged with actor + timestamp | Never log values; access events form audit trail | 90 days post-case; selective field-level erasure on DSAR |
| **T4 Safeguarding-sensitive** | Safety flags, coercion indicators, device-privacy answer, exit-page invocations, free-text notes | T3 + restricted role-based access; no notifications/emails revealing existence | Never log values; access requires explicit review reason | Same as T3; never sent to analytics in any form |
| **T5 Legal-binding** | Signed Settlement Agreement, generated Consent Order, D81, Form P, court attestation, court correspondence | T3 + cryptographic integrity (hash chain) + immutable append-only storage | Full audit trail (every read + write) | **Indefinite** (legal record); separate retention pipeline from operational data |

**Composition rules:**
- A row's tier = max tier of any field
- A table's tier = max tier of any row
- A join / aggregation / view preserves max tier (no downgrade by aggregation)
- An export / PDF / API response carries the max tier of any included data
- Audit logs are T2 minimum (they reveal who-did-what to whom)

**Cross-party rule (load-bearing for the share/reconcile model):**
- Sarah's T2-T4 data is private to Sarah. Mark cannot read it, even at T2.
- The joint document (Our Household Picture) is a deliberate intersection — only fields explicitly published into the joint doc become readable by both parties. Selective publish is per-field, with provenance preserved.
- This is enforced at RLS layer (§4), not just UI layer.

## 2. Env vars + secrets conventions

**Naming format:**
- Server-only: `<SCOPE>_<KEY>` (e.g. `TINK_CLIENT_SECRET`, `ANTHROPIC_API_KEY`)
- Client-exposed: `NEXT_PUBLIC_<SCOPE>_<KEY>` (e.g. `NEXT_PUBLIC_SUPABASE_URL`)
- Mode / enum: `_MODE` suffix (e.g. `DECOUPLE_AUTH_MODE=dev|prod`)
- Boolean: `_ENABLED` suffix (e.g. `DECOUPLE_DEV_TOOLS_ENABLED=true|false`)

**Scope prefixes in use:**
`DECOUPLE` (app-internal config) · `TINK` · `SUPABASE` · `ANTHROPIC` · `STRIPE` · `POSTHOG` · `NTROPY` (third-party).

**Hard rules:**
1. `NEXT_PUBLIC_*` names ship in the client bundle. **Never** use for secrets. Assume every such var is public knowledge the moment it's set.
2. Names matching `*_KEY|*_SECRET|*_TOKEN|*_PASSWORD|*_PRIVATE` prefixed with `NEXT_PUBLIC_` are **banned**. CI gate enforces via regex.
3. Real `.env*` files gitignored (already configured); `.env.example` committed with placeholder values + 1-line docstring per var.
4. Production secrets only in Vercel env — encrypted at rest, scoped per environment (Development / Preview / Production).
5. Pre-commit hook runs `gitleaks` (or equivalent) scanning staged diff for high-entropy strings + known secret patterns. Blocks commit on detection.
6. Rotation: third-party tokens rotated every 90 days; immediately on suspected compromise or staff offboarding. Rotation calendar in `docs/ops/secret-rotation.md` (to be produced at Phase C).

**Environment scoping in Vercel:**
- **Production** — `DECOUPLE_AUTH_MODE=prod` required (CI asserts); real auth, real Supabase, no dev tools reachable.
- **Preview (PR branches)** — `DECOUPLE_AUTH_MODE=dev` allowed; enables dev-mode walkthroughs without real auth.
- **Development (local CLI)** — `DECOUPLE_AUTH_MODE=dev` default.

**Current + planned env var inventory:**

| Env var | Scope | Secret | Visibility | Environments |
|---|---|---|---|---|
| `TINK_CLIENT_ID` | Tink | Semi-secret | Server | All |
| `TINK_CLIENT_SECRET` | Tink | **Yes** | Server | All |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | No | Client | Prod + Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | No (RLS-gated) | Client | Prod + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | **Yes** | Server | Prod |
| `ANTHROPIC_API_KEY` | Anthropic | **Yes** | Server | All |
| `STRIPE_SECRET_KEY` | Stripe | **Yes** | Server | Prod |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | No | Client | Prod |
| `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` | Decouple | No | Client | dev/prod switch |
| `NEXT_PUBLIC_DECOUPLE_DEV_TOOLS_ENABLED` | Decouple | No | Client | true in dev + preview only |
| `DECOUPLE_AUDIT_LOG_DESTINATION` | Decouple | No | Server | Prod |
| `NTROPY_API_KEY` | Ntropy | **Yes** | Server | If in use |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog | No (write-only) | Client | Prod analytics |

Keep this table updated when env vars are added / removed. Commit alongside the change that introduces them.

## 3. Authentication + session pattern

[FILL]

## 4. Row Level Security + authorisation

[FILL]

## 5. Input / output validation at boundaries

[FILL]

## 6. Logging + observability + scrubbing

[FILL]

## 7. Dev / prod boundary enforcement

The dev-mode pattern (S-F7 slice) makes Decouple runnable end-to-end without real auth / storage. Precisely because that's powerful, it must be **impossible** to ship dev-mode behaviour to production. Enforcement is multi-layered.

**Single source of truth.** `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` is read once at app boot inside `src/lib/auth/index.ts`. Exports a constant `MODE: 'dev' | 'prod'`. All other code consults the exported constant, never the env var directly. Violations caught by ESLint rule (to be added: forbid `process.env.NEXT_PUBLIC_DECOUPLE_AUTH_MODE` outside the auth module).

**Runtime assertion at module load.**
```ts
// src/lib/auth/index.ts
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DECOUPLE_AUTH_MODE !== 'prod') {
  throw new Error('DECOUPLE_AUTH_MODE must be "prod" in production build');
}
```
Throws at build or boot — fails loudly, never silently.

**Vercel environment scoping.** Vercel Production environment has `DECOUPLE_AUTH_MODE=prod` fixed. Vercel env config audit checklist (ops doc at Phase C) confirms.

**`/dev/*` route group unreachable in prod.**
```ts
// src/app/dev/layout.tsx
import { MODE } from '@/lib/auth';
import { notFound } from 'next/navigation';
export default function DevLayout({ children }) {
  if (MODE === 'prod') notFound();
  return <>{children}</>;
}
```
Route-level gate, not middleware-only (defence in depth). Applies to engine-workbench, scenarios, state-inspector, reset.

**Fixture data isolation.**
- Dev fixtures use synthetic emails on reserved domain `@dev.decouple.local`
- Production signup endpoint validates domain allowlist; explicitly rejects `@dev.decouple.local`
- Prevents real users accidentally registering with a fixture email

**localStorage isolation.**
- Dev mode uses versioned key `decouple:dev:v1`
- Prod code paths never read this key (lint rule: `localStorage.getItem('decouple:dev:*')` forbidden outside `src/lib/store/dev-store.ts`)
- Reset affordance in dev banner wipes the key

**Telemetry separation.**
- Dev-mode events go to a separate PostHog project (or /dev/null) — never co-mingle with prod analytics
- CI check: production-built bundle doesn't contain references to synthetic-email domain or dev-only scenario IDs

**CI gate — production build smoke test.**
A CI job runs `NODE_ENV=production next build`, then greps the built output to assert:
1. No `console.log` in production-sensitive code paths (allowlist: nothing with PII logged)
2. No references to `@dev.decouple.local`
3. No imports from `src/lib/auth/dev-session.ts` or `src/lib/store/dev-store.ts` in non-dev routes
4. `/dev/*` routes return 404 (integration test via Playwright or similar)

**Dev banner (always-on in dev/preview).**
Reskinned `src/components/layout/env-banner.tsx` (Re-use after audit confirms). Shows: current mode + active scenario + reset button. Persistent across all dev/preview surfaces. In prod build: returns null unconditionally.

**Why this matters:** one leaked dev-mode deployment to production = user signs up → writes real T3 data to localStorage → closes browser → data gone, or worse, data persists on a shared device. Multi-layer defence means no single misconfiguration can leak.

## 8. Third-party data flow

[FILL]

## 9. Safeguarding engineering

[FILL]

## 10. Pen-test readiness checklist

[FILL]

## 11. Per-slice security checklist (DoD addition)

[FILL]

---

## Maintenance

This spec lives. When a security incident, near-miss, pen-test finding, or new threat surfaces in production: add a new section or amend an existing one with date + reasoning + mitigation. Each amendment increments a version note at the top. Don't silent-drift — the audit trail matters when proving practice to insurers / ICO / pen-testers.
