# {S-XX · slice name} — Security DoD

**Slice:** S-XX-{slug}
**Source:** `docs/workspace-spec/72-engineering-security.md` §11 (per-slice security checklist)
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

Every slice ships with this checklist filled. A box may be skipped only with written reasoning (e.g. *"no new API routes — UI-only"*). Systematic skips flag the DoD for review.

---

## 1. Data classification per AC

For each AC's data surface, name the tier (T0-T5) and confirm implementation matches tier requirements (encryption, logging, retention).

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 | | | |
| AC-2 | | | |

## 2. New tables / columns

RLS policies written; policies tested with two-persona scenarios (cross-party leak check if applicable); service-role-key-free path exercised.

- [ ] RLS enabled on every new table (migration gate enforces)
- [ ] Default-deny; no `USING (true)` policies
- [ ] Two-persona test: {Sarah writes → Mark reads → assert nothing returned}
- [ ] Selective-publish tested if joint-data pattern applies (Mark sees only published fields)
- [ ] Service-role-key revoked in test env; app still works for normal user ops
- [ ] N/A · reason: {if no schema changes}

## 3. API routes

- [ ] Zod schema at entry for every new route
- [ ] 400 on invalid; server-side log of specific validation failure with reference ID
- [ ] Rate limits applied per spec 72 §5 (auth 5/min IP · bank-connect/share 3/min session · general 60/min session)
- [ ] N/A · reason: {if no new API routes}

## 4. File upload surfaces

- [ ] Magic-byte MIME check (don't trust `Content-Type` header)
- [ ] Allowlist only: PDF, PNG, JPG, HEIC, DOCX
- [ ] Size limit 15MB per upload
- [ ] AV scan verified (Supabase storage)
- [ ] Content-addressed filenames; no user-controlled path fragments
- [ ] N/A · reason: {if no upload surfaces}

## 5. New env vars

- [ ] Added to spec 72 §2 inventory table
- [ ] Vercel Production scope verified if secret (server-only, not `NEXT_PUBLIC_*`)
- [ ] Regex check clean: no `NEXT_PUBLIC_*_KEY|_SECRET|_TOKEN|_PASSWORD|_PRIVATE`
- [ ] `.env.example` updated with placeholder + one-line docstring
- [ ] CI gate passes (regex scan)
- [ ] N/A · reason: {if no new env vars}

## 6. Third-party data flows

Any new integration or expanded use of an existing provider.

- [ ] DPA in place (spec 72 §8 per-provider register updated)
- [ ] Minimisation check: what's necessary vs what's sent — documented
- [ ] Webhook signature verified if applicable
- [ ] Egress allowlist updated (spec 72 §8)
- [ ] Data-tier of sent payload confirmed acceptable for the provider
- [ ] N/A · reason: {if no third-party changes}

## 7. Audit log entries

T3+ read/write events must be recorded with actor, timestamp, resource_type, resource_id, action; immutable append-only storage.

- [ ] Event schema matches spec 72 §6 structure
- [ ] Storage append-only (no DELETE, no UPDATE)
- [ ] Retention per spec 72 §1 table
- [ ] RLS: compliance role can read; actors cannot edit
- [ ] N/A · reason: {if no T3+ operations}

## 8. Error handling

- [ ] Generic user-facing errors with reference ID: `"Something went wrong. Reference: 7F3A-9B2C"`
- [ ] No stack traces / SQL / internal paths / third-party error bodies leaked to client
- [ ] Server-side detail logged with matching reference ID
- [ ] HTTP status codes honest (401 / 403 / 404 / 500); response bodies minimal

## 9. Dev/prod boundary

Any new dev-only route, tool, or fixture must gate via `MODE === 'prod'` notFound (spec 72 §7).

- [ ] Dev-only code lives under `/app/dev/` or `lib/auth/dev-*` / `lib/store/dev-*`
- [ ] Dev routes return 404 in prod build (Playwright integration test)
- [ ] No references to `@dev.decouple.local` or dev scenario IDs in prod bundle
- [ ] No imports from `dev-session.ts` / `dev-store.ts` in non-dev routes (ESLint rule)
- [ ] Dev-mode-leak CI scan passes
- [ ] N/A · reason: {if slice is prod-only with no dev surface}

## 10. Safeguarding impact

Does this slice touch T4 data (safety flags, coercion indicators, device-privacy, exit-page, free-text notes)?

- [ ] No T4 data touched — skip remaining boxes
- [ ] If yes: never included in email / push / SMS content
- [ ] If yes: never included in analytics events (PostHog allowlist enforced)
- [ ] If yes: never rendered client-side outside user's own safeguarding dashboard
- [ ] If yes: admin access requires explicit review_reason logged in audit trail
- [ ] V1 signposting baseline not broken (exit-this-page, device-privacy answer effects, Women's Aid / NDAH / Samaritans signposting intact)

## 11. Security headers + CSP

If adding external scripts or new resource origins.

- [ ] CSP allowlist updated in `next.config.ts` / middleware
- [ ] No `'unsafe-inline'` / `'unsafe-eval'` added
- [ ] CSP test passes on preview deploy (browser console: zero violations)
- [ ] `securityheaders.com` scan: A+ grade maintained
- [ ] N/A · reason: {if no external script/origin changes}

## 12. Adversarial review

- [ ] `/security-review` skill run on slice diff
- [ ] Output reviewed; each concern either addressed or explicitly deferred with reasoning
- [ ] Deferrals recorded below with reason + planned follow-up

**Review findings + disposition:**

| Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|
| | | Addressed · Deferred to V1.5 · Risk-accepted · Wont-fix | |

## 13. Dependency + secrets hygiene

- [ ] `npm audit` clean on slice branch (high + critical addressed)
- [ ] GitHub Dependabot: no new criticals introduced
- [ ] New dependencies justified; licences compatible with closed-source commercial use
- [ ] `gitleaks` clean on slice branch (no high-entropy strings / known patterns in diff)
- [ ] No secrets introduced into client bundle (all in Vercel Production env)
- [ ] No secrets in commit history (if introduced in-session, rotate before merge)

---

## Sign-off

- **Slice author:** {name / session ID}
- **Date:** {date}
- **Reviewer (if T3+ data or new third-party):** {user / dedicated reviewer}
- **All boxes ticked or justifiably N/A:** yes / no
- **Pen-test readiness note:** {any items that would likely surface in pen test — address before merge or document why deferred}
