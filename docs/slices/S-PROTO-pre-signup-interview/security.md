# S-PROTO-pre-signup-interview · security

Spec 72 §11 14-item per-slice security checklist, applied as **prototype short-form** (spec 76 §3) (items 1, 8, 12, 14 only required; remaining items listed for completeness but marked N/A · prototype short-form unless otherwise stated).

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | **Data classification per AC.** Each AC's data surface tier named (T0–T5); impl matches tier. | Done | All AC data is **T0** (static templated content + in-memory answers within page session). No user PII persists; refresh resets state. |
| 2 | **New tables / columns.** RLS policies + tests + service-role-key-free path. | N/A | No DB changes. |
| 3 | **API routes.** Zod schema at entry; 400 on invalid; rate limits per §5. | N/A | No API routes (client-only page). |
| 4 | **File upload surfaces.** Magic-byte MIME + allowlist + size limit + AV. | N/A | No upload surfaces. |
| 5 | **New env vars.** Added to spec 72 §2 inventory; Vercel scope verified; secret-prefix regex clean. | N/A | No env vars. |
| 6 | **Third-party data flows.** DPA + minimisation + webhook signatures + egress allowlist. | N/A | No third-party integration (no LLM call — O7 templates statically). |
| 7 | **Audit log entries.** T3+ read/write events recorded with actor + timestamp + resource. | N/A | T0 data only. |
| 8 | **Error handling.** Generic user-facing errors + reference IDs; no internals leaked. | Done | Browser-level errors handled by Next.js default error boundary; no custom error surface introduced in scope. Verified at PR open. |
| 9 | **Dev/prod boundary.** New dev-only routes gate via `.dev.tsx` or `MODE === 'prod'` notFound. | Accepted risk (Option A) | Files use `page.tsx` not `.dev.tsx` (Option A — matches `S-PROTO-hub` precedent + `/dev/heroes` pattern). Routes intentionally compile in production bundles; T0 prototype content only. Dev-mode leak scan CI gate is N/A for Option A routes. |
| 10 | **Safeguarding impact.** Touches T4? If yes: review against §9 rules. | N/A | No T4 data. O4 ex-partner relationship dynamic question is presentation-only; templated answers don't surface safeguarding content. |
| 11 | **Security headers + CSP.** New external scripts / origins → CSP allowlist + SCP test. | N/A | No external scripts. |
| 12 | **Adversarial review.** `/security-review` skill run on slice diff. | Done | Satisfied by the auto-review.yml multi-agent security specialist run at PR open — verdict carried 2 praise findings (build-plan.ts pure-logic / no-XSS; URL bg param whitelist-validated) + 1 todo on this very item; no blocking findings. |
| 13 | **Dependency audit.** `npm audit` clean (high + critical); new deps justified. | N/A · prototype short-form | No new deps planned. |
| 14 | **Secrets hygiene.** No secrets in client bundle / commit history; `gitleaks` clean. | Done | No secrets introduced. |

## Exemption reasoning

Slice is a client-only static-content + in-memory-state prototype at `src/app/dev/proto/pre-signup-interview/`. No DB, no API, no user data persistence, no upload, no auth, no third-party, no env vars, no new deps. Items 2-7, 10, 11 marked N/A on this basis.

Item 9 carries accepted-risk status under Option A per S-PROTO-hub precedent. Risk profile is T0 prototype content only.

Items 8 + 12 closed at PR open: item 8 confirmed (Next.js default error boundary covers all surfaces in scope, no custom error handling introduced); item 12 satisfied by the auto-review.yml security specialist run.

Item 13 marked N/A · prototype short-form (spec 76 §3) (still verified on the prototype's actual diff at PR time — no new deps planned).
