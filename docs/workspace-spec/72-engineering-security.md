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

Auth flows through the Session abstraction defined in S-F7 (rebuild strategy spec 71) — domain code consumes `getCurrentSession()` and never touches Supabase auth directly. The prod implementation wraps Supabase; the dev implementation returns a synthetic fixture session.

**Session interface (stable contract):**
```ts
interface UserSession {
  id: string;                  // stable internal ID
  email: string;               // T2
  role: 'participant' | 'admin' | 'support';
  twoFactorVerified: boolean;
  createdAt: Date;
  lastActiveAt: Date;
  deviceFingerprint: string;   // for anomaly detection
}
```

**Authentication requirements:**

- **2FA mandatory** for every participant account before touching any T3+ data (spec 54 Risk 4b). Enforced at route-guard layer: if `!session.twoFactorVerified && route requires T3 access`, redirect to 2FA enrolment.
- **Password policy** follows NIST 800-63B: min 12 characters, no arbitrary complexity rules (no forced symbols), passwords checked against Have I Been Pwned API at creation + change, no periodic rotation requirement.
- **Magic link for second-party invitation** (Mark) — friction-free 30-second entry per spec 54 Risk 4h. 14-day invite expiry per session-22 G7-3 lock. Link single-use; rotates on use.
- **Session lifetime:** 24h access token; 30-day refresh token; refresh rotation on every use. Idle timeout 4h (re-auth required). Absolute max 30 days without re-auth.
- **Cookie flags:** `HttpOnly`, `Secure`, `SameSite=Lax`, `__Host-` prefix for session cookies. Never accessible to client JS.

**Anomaly detection (spec 54 Risk 4b):**
- Login from new device/country → email notification to user + in-app banner
- 5+ failed auth attempts from one IP → rate-limit block (1 hour)
- Sensitive changes (password, email, 2FA disable, share to new ex) → 24-hour cooling-off window + email confirmation
- Failed 2FA attempts → progressive lockout (1min, 5min, 15min, 1hr)

**Account takeover protection:**
- 2FA cannot be disabled without re-entering current 2FA code + 24h delay
- Password reset emails come from a reserved address (`security@decouple.co.uk` — never the general noreply) with signed links
- Recovery codes generated at 2FA setup, downloadable once

**Session state handling in dev mode:** fixture user Sarah (or scenario-selected persona) loaded into `UserSession` at module init; `twoFactorVerified: true` by default (dev bypass). Dev mode NEVER issues real cookies — dev session state lives only in memory + localStorage per S-F7 pattern.

## 4. Row Level Security + authorisation

Supabase RLS is the **primary authorisation layer** — never relied on application-level checks alone. Application code adds a second layer, but RLS is the thing pen-testers will probe first and the thing that must be right.

**Hard rules:**
1. **Every table has RLS enabled** before any data lands. No exceptions. Migration CI check rejects any `CREATE TABLE` without an immediately-following `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and at least one policy.
2. **Default deny.** No table gets a broad `USING (true)` policy. Every policy names its actor and its scope.
3. **Service role key NEVER ships to client.** Server-side use only, specifically bypassing RLS for migrations and admin operations that are individually audited.
4. **Admin reads are audited.** A separate `admin_access_log` table records: admin user, resource table + ID, timestamp, reason (free-text), legitimate business reason (enum). Policy on that table: only admins write, only admins (or compliance role) read.

**Private-data pattern (Sarah's Picture, private sections, notes):**
```sql
CREATE POLICY "own_data_only" ON sarahs_picture_fields
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "own_data_only_write" ON sarahs_picture_fields
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_data_only_update" ON sarahs_picture_fields
  FOR UPDATE USING (user_id = auth.uid());
```

**Joint-data pattern (Our Household Picture, reconciled fields):**
- `joint_documents` table has `sarah_id`, `mark_id` columns
- Policy: `auth.uid() IN (sarah_id, mark_id)` gates SELECT
- WRITES restricted to field-level mechanics (see selective-publish below)

**Selective-publish (Sarah publishes one field at a time into joint doc):**
- `joint_published_fields` table: `joint_doc_id, field_key, source_user_id, published_value, published_at, provenance_json`
- Write policy: only the source-user can publish their own field (`source_user_id = auth.uid()`)
- Read policy: members of the joint doc can SELECT
- This enforces the cross-party rule (§1): Mark cannot read Sarah's raw data, only the published intersection.

**Derived views respect tier composition (§1):** a view joining T2 + T3 tables is T3; RLS policies on the view enforce the more restrictive access.

**Testing RLS (part of DoD for any schema change):**
- Two-persona test scenarios: Sarah writes → Mark reads → assert nothing returned
- Sarah publishes field → Mark reads → assert only that field visible
- Admin reads without logging reason → assert rejected
- Service key revoked in test environment → app still works for normal operations (means RLS policies are sufficient, not leaning on service key)

**Pen-test red-flag patterns to avoid:**
- `USING (true)` policies (broad access)
- Policies referencing columns the requesting user controls directly
- Server code using service role key for operations that could use user-scoped keys
- Missing RLS on any table that holds T2+ data (migration gate enforces)

## 5. Input / output validation at boundaries

**Principle:** trust is earned at the boundary — not inherited from TypeScript types. Every piece of data that crosses a trust boundary gets runtime validation.

**Trust boundaries (validation required at each):**
- Client → API route (every POST/PUT/PATCH body; every query param)
- Third-party webhook → our handler (Tink, Stripe, Supabase webhooks)
- File upload → storage
- External API response → our code (treat Tink, Ntropy, Anthropic responses as untrusted input)
- Database read → application code (types defined in schema, runtime-asserted at ORM layer)

**Implementation pattern:**
- **Zod schemas** at every API route entry. Reject on invalid with 400 + generic error ("invalid request"); log the specific validation failure server-side.
- TypeScript types generated from Zod schemas (`z.infer<>`) — single source of truth.
- No `any` or `unknown` coming out of API handlers.

**Output encoding:**
- React's JSX escapes by default — this is the primary XSS defence.
- **Never** use `dangerouslySetInnerHTML` with user-controlled content. If unavoidable for legal-doc rendering (consent order, D81): HTML via DOMPurify with strict allowlist (no `<script>`, no `<iframe>`, no inline event handlers); allowlist audited per release.
- User-generated HTML is not allowed anywhere in the product at V1 (no rich-text fields for users); if added at V1.5+, requires new security review.

**SQL:** all queries through Supabase client (parameterised). Raw SQL banned except in migrations.

**File uploads:**
- MIME type verified via magic-byte inspection (don't trust `Content-Type` header)
- Allowlist only: PDF, PNG, JPG, HEIC, DOCX (and only where the feature needs it)
- Size limit per upload: 15MB
- Antivirus scan before storage (Supabase storage has this; verify enabled)
- Stored under content-addressed filenames (hash-based) — never user-controlled path fragments
- Served with `Content-Disposition: attachment` where possible; never inline-render uncontrolled PDFs

**URL validation:**
- Redirects to user-controlled URLs go through an allowlist (only our domain + known partner domains)
- External-link warning pattern for user-embedded URLs (when that feature exists)

**Email / phone validation:**
- Permissive regex at form-time (don't reject unusual-but-valid inputs like `+` in email or `.co.uk`)
- Real validation via verification link (email) or SMS code (phone — later)

**Rate limiting at API boundaries:**
- Auth endpoints: 5 req/min per IP
- Bank connect / share endpoints: 3 req/min per session
- General API: 60 req/min per session
- Implementation: Supabase Edge Functions + upstash/ratelimit or Vercel Edge Middleware

## 6. Logging + observability + scrubbing

**Principle:** logs are useful when they help diagnose problems; dangerous when they leak what they're supposed to protect. Every log line classified per data-tier rules (§1).

**Log destinations:**
- Operational logs (errors, timing, requests) → standard structured-JSON pipeline (Vercel logs + external aggregator TBD at Phase C)
- Audit logs (T3+ access events) → separate append-only store (Supabase table with RLS + retention; or dedicated log service)
- Analytics events → PostHog with strict event-schema allowlist (§8 third-party)

**Hard scrubbing rules:**

| Tier | Log value? | What's loggable | Scrubbing |
|---|---|---|---|
| T0 Public | ✅ | Everything | None |
| T1 Functional | ✅ | Everything | None |
| T2 Personal | ❌ values | Keys, IDs, presence-flags | Names/emails replaced with hashed token `sha256(value)[:8]` |
| T3 Financial | ❌ values | Access events (actor, timestamp, resource_id, action) | All values scrubbed; aggregates (e.g. `amount_bucket: "£100-500"`) OK if genuinely useful |
| T4 Safeguarding | ❌ values | Access events with explicit review_reason | All values scrubbed; even presence-flags require review reason to log |
| T5 Legal | ✅ full audit | Full audit trail by regulation | Document hash, never content, in logs — full content in legal-binding immutable storage |

**What is NEVER logged:**
- Auth tokens, session keys, 2FA codes, recovery codes
- Passwords (even hashed) — never in logs regardless of form
- Full bank transaction descriptions, amounts, dates (T3)
- Safeguarding answers, safety flags, exit-page invocations (T4)
- AI prompt content sent to Anthropic containing T2+ data — log only prompt ID + metadata

**Error messages to client:**
- Always generic + unique reference ID: `"Something went wrong. Reference: 7F3A-9B2C"`
- Detailed error context server-side only (reference ID correlates)
- Never leak stack traces, SQL, internal paths, third-party error bodies
- HTTP status codes are honest (401/403/404/500) but response bodies are minimal

**Audit log requirements (T3+ access):**
- Structure: `{ actor_id, action, resource_type, resource_id, timestamp, request_id, reason? }`
- Immutable: append-only, no DELETE, no UPDATE
- Retention: indefinite for T5; T3/T4 per §1 retention table
- Reviewable: compliance role can query with RLS access; exported on DSAR

**Alerts:**
- Failed auth > 20/min from one IP → immediate notify
- T3 read volume > 10x baseline from single actor → review queue
- RLS policy violation attempt → immediate alert (shouldn't happen; if does, investigate)
- Dev-mode attempted in prod (`DECOUPLE_AUTH_MODE != 'prod'` at prod module load) → pager-level alert + block
- Service role key used from non-allowlisted path → alert + block

**What we DO want logged (useful for defending + operating):**
- Every auth event (login, logout, 2FA, password change) — T2 scrubbed
- Every T3+ read event (for audit trail + anomaly detection)
- Every share action, publish action, proposal signature — full event log per party
- Every external integration call (Tink, Stripe, Anthropic) — metadata only, never payload

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
