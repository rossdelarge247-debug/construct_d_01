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
2. Names matching `*_SECRET|*_TOKEN|*_PASSWORD|*_PRIVATE` prefixed with `NEXT_PUBLIC_` are **banned**. CI gate enforces via regex. _Narrowed session 24:_ `*_KEY` alone is **not** banned — some `NEXT_PUBLIC_*_KEY` names are legitimately public (see inventory below: `NEXT_PUBLIC_SUPABASE_ANON_KEY` RLS-gated, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` publishable, `NEXT_PUBLIC_POSTHOG_KEY` write-only). When introducing a new key-like env var, ask: "if this value ships in the client bundle, is that acceptable?" If no, drop `NEXT_PUBLIC_` and/or use `_SECRET` / `_TOKEN` / `_PRIVATE` suffix.
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
2. No references to `@dev.decouple.local` (fixture email domain) — **enforced by bundle grep**
3. No references to `decouple:dev:` (dev localStorage key prefix) — **enforced by bundle grep**
4. No imports from `src/lib/auth/dev-session.ts` or `src/lib/store/dev-store.ts` in non-dev routes — **enforced by ESLint rule** (not bundle grep — minified module paths produce false positives; see session-24 hotfix that removed `dev-session|dev-store|dev-auth-gate` from bundle scan)
5. `/dev/*` routes return 404 (integration test via Playwright, once S-F7 lands)

**Dev banner (always-on in dev/preview).**
Reskinned `src/components/layout/env-banner.tsx` (Re-use after audit confirms). Shows: current mode + active scenario + reset button. Persistent across all dev/preview surfaces. In prod build: returns null unconditionally.

**Why this matters:** one leaked dev-mode deployment to production = user signs up → writes real T3 data to localStorage → closes browser → data gone, or worse, data persists on a shared device. Multi-layer defence means no single misconfiguration can leak.

## 8. Third-party data flow

Every third-party integration is an expansion of our attack surface + a data-processor relationship under GDPR. Rules scale with what they see.

**Per-provider register (maintained alongside env-var inventory §2):**

| Provider | What they see | Tier | DPA | Access pattern | Credential |
|---|---|---|---|---|---|
| Supabase | All our stored data | T2–T5 | Required (§56 L1.5) | Auth + DB + storage | Service role (server) + anon (client, RLS-gated) |
| Vercel | Traffic, env vars, build artefacts | T2 (via request logs) | Required | Hosting | Via deploy integration |
| Tink | Bank credentials (at consent), transaction history | T3 | Required | OAuth-like consent; 90-day access window | `TINK_CLIENT_SECRET` |
| Anthropic | Prompts we choose to send (may contain T2+) | T2+ (if we send it) | Required | Per-request API | `ANTHROPIC_API_KEY` |
| Ntropy | Transaction descriptions + amounts | T3 | Required | Server-to-server enrichment | `NTROPY_API_KEY` |
| Stripe | Payment amount + user ID | T2 | Required | Stripe Elements (client) + server webhooks | `STRIPE_SECRET_KEY` + webhook signing secret |
| PostHog | Events we choose to emit (T1-only) | T1 | Required | Client + server SDK | `NEXT_PUBLIC_POSTHOG_KEY` (write-only) |

**Minimisation rules (applied per-provider):**

- **Anthropic:** AI prompts carrying user data use internal IDs not names; bank transaction descriptions sent, but payee names that look personal (e.g. "Transfer to John Smith") are flagged + user-confirmed before send; never send safeguarding flags, email addresses, passwords, account numbers. Anthropic-side retention: confirm no training-on-customer-data per their Data Usage Policy (verified annually).
- **Ntropy:** send only transaction description + amount + date; never names, IDs, context beyond what's needed for classification.
- **Stripe:** Stripe Elements renders the card form; card number / CVV / expiry never hit our servers. We store Stripe customer ID + subscription status only.
- **PostHog:** event payloads allowlisted at schema level — no free-text fields, no user-provided strings. Track only: button IDs, phase transitions, feature flags, performance metrics. Never: what the user typed, bank values, safeguarding flags.
- **Tink:** consent scoped to read-only account data; refresh tokens stored server-side only; access window tracked so we can alert users before expiry (spec 54 Risk 4g — 90-day consent expiry).
- **Supabase:** the primary store; minimisation via schema design (don't collect what you don't need) + retention policy §1.

**Webhook verification (mandatory):**
- Every webhook handler verifies signature before acting
- Stripe: `stripe-signature` header verified against `STRIPE_WEBHOOK_SECRET`
- Supabase database webhooks: HMAC via configured secret
- Tink webhooks (if adopted): per Tink's verification spec
- Unsigned / invalid-signature webhooks → 401 + log + alert

**Subprocessor changes:**
- Monitor each provider's subprocessor list quarterly
- Material changes (new region, new subprocessor) trigger DPIA review
- Breach notifications from a provider treated as our own (72-hour ICO clock starts)

**Egress allowlist:**
- Outbound HTTP from our servers goes only to a narrow allowlist (Supabase, Tink, Anthropic, Stripe, Ntropy, PostHog)
- Enforced at Vercel edge / deploy-platform level where possible
- Any new outbound destination = explicit security review + env var + DPA review

## 9. Safeguarding engineering

Spec 54 Risk 4b names safeguarding failure as existential. Spec 67 Gap 11 commits V1 to **signposting + baseline** (detection + decoy + adaptive pacing = V1.5). This section defines the engineering specifics that make even the baseline actually protective.

**Exit-this-page (spec 68a C-X1 locked):**
- Universal footer component on every page
- On click: `localStorage.clear()` + `sessionStorage.clear()` + `history.replaceState({}, '', '/')` + `window.location.replace('https://bbc.co.uk/news')`
- Note the sequence: clear first, replace history second, redirect third. A slow redirect leaves evidence if done out of order.
- No confirmation dialog on V1 (spec 68a lock: lean = instant redirect + clear local state)
- Server-side: same click should also invalidate the session (POST to `/api/auth/panic-exit` before redirect) — best-effort, not blocking
- Cookies: clear all Decouple cookies via same endpoint

**Device-privacy answer actual effect (spec 65 O3):**
When user answers "device is not private to me":
- Email linkback features disabled (no "resume where you left off" emails)
- Require 2FA + fresh login each session (no "remember this device")
- In-app suggestion: "Create your account when you're on a private device" — soft gate before any T3 data write
- Dashboard shows private-device prompt banner persistently until dismissed or until user re-answers

**Discreet-use mode (V1.5 — planned):**
- Tab title toggles between product name and a benign alternative ("Personal finance tracker" / "Household planning")
- Favicon swap
- Muted colour palette variant (no branded magenta / signature purples)
- Keyboard shortcut to flip modes instantly
- Note for V1: this is planned, not shipping V1 per spec 67 Gap 11 lock

**Safeguarding flags = T4 (§1) — no leaks:**
- Never included in email content, push notifications, SMS
- Never included in analytics events (PostHog allowlist excludes them)
- Never rendered client-side unless user is actively viewing their own safeguarding dashboard
- Admin access requires explicit review_reason logged in audit trail

**Account takeover by abusive ex (spec 54 Risk 4b):**
- Login anomaly detection (new IP/country/device) → notification to pre-registered alternate channel (backup email or SMS) BEFORE access granted
- Password reset requires 2FA code OR a 24-hour cooling-off + email confirmation from the current registered email
- Sensitive changes (email change, 2FA disable, share-to-new-ex) always have 24-hour cooling-off period
- "Freeze account" user-initiated action (V1.5) — lockout self-service + human-review unlock

**Coercion detection (V1.5 scoped):**
- Proposal acceptance has 24-hour cooling-off window (spec 54 Risk 4b)
- Unusual patterns (rapid acceptance of unfavourable terms, forced sign-off) flag for review
- Engineering baseline V1: rate-limit proposal state transitions to prevent forced rapid-acceptance

**What V1 engineering does NOT do (per spec 67 Gap 11 lock):**
- Active detection (sentiment analysis, coercive language detection) — V1.5
- Decoy mode / "fake dashboard" — V1.5+
- Panic button SOS → specialist services — signposting only V1
- Separate safeguarding specialist role with audit access to flagged accounts — V1.5

**V1 engineering does always do:**
- Everything above in this section
- Signposting to Women's Aid / NDAH / Men's Advice Line / Refuge / SEA / Samaritans (spec 70 S-O3)
- Exit-this-page footer universal
- Device-privacy answer with real effects
- T4 tier enforcement

## 10. Pen-test readiness checklist

Spec 56 L5.1 budgets £2,000–5,000 + 2–3 weeks for pen test (including remediation). Preparedness reduces findings, which reduces remediation time, which derisks launch date. This section is the pre-pen-test self-audit.

**Standard security headers** (Vercel `next.config.ts` or middleware — verify in production):

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: [tight — no unsafe-inline, no unsafe-eval; allowlist for Tink Link + Stripe Elements + PostHog]
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self)
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

**CSP allowlist for known third-party scripts** (update per integration):
- `script-src 'self' js.stripe.com *.tink.com <posthog-host>`
- `frame-src 'self' js.stripe.com *.tink.com` (for Stripe Elements + Tink Link iframe flows)
- `connect-src 'self' *.supabase.co api.anthropic.com api.ntropy.com api.stripe.com <posthog-host>`
- Inline scripts banned — if needed, use nonces via Next.js middleware

**OWASP ASVS Level 1 + 2 mapping** (target: L2 compliance pre-pen-test):

| ASVS area | How we satisfy |
|---|---|
| V1 Architecture + Threat Modeling | This spec + 54 + 71 |
| V2 Authentication | §3 |
| V3 Session Management | §3 (cookie flags, rotation, lifetime) |
| V4 Access Control | §4 (RLS primary, app check secondary) |
| V5 Validation, Sanitization, Encoding | §5 |
| V6 Cryptography at Rest | Supabase defaults + 2FA seed storage via secure KMS |
| V7 Error Handling and Logging | §6 |
| V8 Data Protection | §1 classification + retention |
| V9 Communication | TLS 1.3 (Vercel) |
| V10 Malicious Code | §5 file upload scanning |
| V11 Business Logic | RLS §4 + per-slice security DoD §11 |
| V12 Files and Resources | §5 upload handling + CSP |
| V13 API and Web Service | §5 rate limiting + schema validation |
| V14 Configuration | §2 env vars + §7 dev/prod boundary |

**Common pen-test findings — pre-addressed patterns:**

- **CSRF:** SameSite=Lax cookies (§3) + CSRF token for state-changing GETs (if any); Supabase auth session is cookie-based, pairs fine
- **IDOR (insecure direct object reference):** every resource access goes through RLS (§4); opaque UUIDs not autoincrementing ints
- **SSRF (server-side request forgery):** egress allowlist §8; never use user-supplied URLs for server-side fetches
- **Open redirects:** URL allowlist for any redirect destination §5
- **Clickjacking:** X-Frame-Options: DENY (above)
- **Session fixation:** session rotated on login
- **Timing attacks:** constant-time comparison for auth token + 2FA code checks
- **Auth timing leakage:** login endpoint returns same response + timing for "user not found" vs "wrong password" (both fail in constant time, generic error)
- **XSS:** JSX escaping §5; no `dangerouslySetInnerHTML` without DOMPurify; strict CSP
- **Stored XSS via user inputs:** no rich-text fields V1; if added later, HTML sanitisation required
- **Auth bypass via type juggling:** Zod schemas §5 reject wrong types at boundary

**Pre-pen-test internal audit (run 1 week before external test):**
- [ ] `npm audit` — address high + critical
- [ ] Snyk / GitHub Dependabot — zero critical open
- [ ] `gitleaks` full-history scan
- [ ] ZAP or Burp automated scan against preview deploy
- [ ] Browser console: zero CSP violations across smoke-test surfaces
- [ ] Every slice's DoD security checklist (§11) ticked
- [ ] RLS test scenarios pass for every table
- [ ] `DECOUPLE_AUTH_MODE=prod` enforced in production build (§7 CI gate)
- [ ] Production build smoke test: no `console.log` leaks, no dev-route access
- [ ] Third-party webhook signatures verified (§8)
- [ ] Security headers present + correct (`securityheaders.com` scan — target A+ grade)
- [ ] SSL Labs scan — target A+
- [ ] Mozilla Observatory — target A+

**Post-pen-test workflow:**
- Every finding triaged same-day
- Critical + high: remediate before launch (block-launch)
- Medium: remediate before launch if time; defer to V1.1 with risk-accept sign-off if not
- Low + informational: V1.1 backlog
- Re-test after remediation — budget for this in the £2-5k

**Ongoing post-launch:**
- Annual pen-test (ISO 27001 path per spec 54)
- Quarterly internal audit (this checklist)
- Bug bounty / vulnerability disclosure policy (spec 56 L5.8) — published at launch

## 11. Per-slice security checklist (DoD addition)

Extends the Definition of Done pattern drafted in `docs/engineering-phase-candidates.md` §B. Every slice that ships carries documented evidence for every box below, or explicit deferral with written reasoning in the slice wrap.

**Security checklist — applied per slice:**

- [ ] **Data classification per AC.** For each AC's data surface, the tier is named (T0–T5) and implementation matches tier requirements (encryption, logging, retention).
- [ ] **New tables / columns.** RLS policies written; policies tested with two-persona scenarios (cross-party leak check if applicable); service-role-key-free path exercised.
- [ ] **API routes.** Zod schema at entry for every route; 400 on invalid; rate limits applied per §5.
- [ ] **File upload surfaces.** Magic-byte MIME check, allowlist, size limit, AV scan verified.
- [ ] **New env vars.** Added to spec 72 inventory (§2); Vercel prod scope verified if secret; NEXT_PUBLIC_*_KEY|_SECRET|_TOKEN|_PASSWORD|_PRIVATE regex check clean.
- [ ] **Third-party data flows.** Any new integration: DPA in place (§8), minimisation check (what's necessary vs what's sent), webhook signature verified, egress allowlist updated.
- [ ] **Audit log entries.** T3+ read/write events recorded with actor, timestamp, resource, action; immutable storage confirmed.
- [ ] **Error handling.** Generic user-facing errors with reference ID; no stack traces / SQL / internals leaked; server-side detail logged with matching reference.
- [ ] **Dev/prod boundary.** Any new dev-only route / tool / fixture gates via `MODE === 'prod'` notFound or equivalent (§7). CI gate passes.
- [ ] **Safeguarding impact.** Does this slice touch T4? If yes: review against §9 rules (no leaks to email/push/analytics; access gated; device-privacy-aware). V1 = signposting baseline not broken.
- [ ] **Security headers + CSP.** If adding external scripts or new resource origins: CSP allowlist updated; SCP test passes on preview deploy.
- [ ] **Adversarial review.** `/security-review` skill run on slice diff. Output reviewed — concerns addressed or deferred with reasoning.
- [ ] **Dependency audit.** `npm audit` clean on the slice branch (high + critical); new dependencies justified; licenses checked.
- [ ] **Secrets hygiene.** No secrets introduced into client bundle; no secrets in commit history (`gitleaks` clean on slice branch).

**Exemption pattern.** A box may be skipped only with written reasoning in the slice wrap, e.g. *"Box 3 skipped — slice has no new API routes (UI-only)"*. Systematic skips (e.g. repeatedly marking "no T3 data" without justification) flag the DoD for review.

**Evidence location.** Each slice's DoD evidence lives in `docs/slices/S-XX-{name}/security.md` alongside the AC and test plan docs (per `docs/engineering-phase-candidates.md` §C–D).

**Who signs off.** The slice author for routine items; any T3+ data work or new third-party integration requires a second pair of eyes (for V1: the user reviews before PR merge; V1.5+: dedicated security reviewer role if team grows).

**Why this gate matters.** Pen-testers will sample slices and probe them systematically. A slice that skipped the checklist is a slice where the pen-tester will find a finding. Better to catch it here.

---

## Maintenance

This spec lives. When a security incident, near-miss, pen-test finding, or new threat surfaces in production: add a new section or amend an existing one with date + reasoning + mitigation. Each amendment increments a version note at the top. Don't silent-drift — the audit trail matters when proving practice to insurers / ICO / pen-testers.
