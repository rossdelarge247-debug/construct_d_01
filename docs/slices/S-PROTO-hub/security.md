# S-PROTO-hub · security

Per spec 72 §11 13-item per-slice security checklist (DoD addition).

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | **Data classification per AC.** Each AC's data surface tier named (T0–T5); impl matches tier. | ✅ | Registry data is **T0** (design metadata, not user data). No user PII. |
| 2 | **New tables / columns.** RLS policies + tests + service-role-key-free path. | N/A | No DB changes. |
| 3 | **API routes.** Zod schema at entry; 400 on invalid; rate limits per §5. | N/A | No API routes. |
| 4 | **File upload surfaces.** Magic-byte MIME + allowlist + size limit + AV. | N/A | No upload surfaces. |
| 5 | **New env vars.** Added to spec 72 §2 inventory; Vercel scope verified; secret-prefix regex clean. | N/A | No env vars. |
| 6 | **Third-party data flows.** DPA + minimisation + webhook signatures + egress allowlist. | N/A | No third-party integration. |
| 7 | **Audit log entries.** T3+ read/write events recorded with actor + timestamp + resource. | N/A | T0 data only. |
| 8 | **Error handling.** Generic user-facing errors + reference IDs; no internals leaked. | ✅ | 404 stubs use Next.js standard `notFound()`. |
| 9 | **Dev/prod boundary.** New dev-only routes gate via `.dev.tsx` or `MODE === 'prod'` notFound. | ⚠️ Accepted risk (Option A) | Files use `page.tsx` not `.dev.tsx` (Option A — matches `/dev/heroes` pattern; user's workflow is Vercel-preview-driven, no local terminal for `npm run dev`). Routes intentionally compile in production bundles; accessible at `/dev/proto/*` on preview + production. Accepted-risk basis: T0 design metadata only (no PII, no user data, no T3+ surfaces). Reversible via middleware gate later if required. Dev-mode leak scan CI gate is N/A for Option A routes. |
| 10 | **Safeguarding impact.** Touches T4? If yes: review against §9 rules. | N/A | No T4 data; registry references safeguarding entries by name only (no surfacing of safeguarding content). |
| 11 | **Security headers + CSP.** New external scripts / origins → CSP allowlist + SCP test. | N/A | No external scripts. |
| 12 | **Adversarial review.** `/security-review` skill run on slice diff. | ⏳ | Run pre-PR. |
| 13 | **Dependency audit.** `npm audit` clean (high + critical); new deps justified. | ✅ | No new deps. |
| 14 | **Secrets hygiene.** No secrets in client bundle / commit history; `gitleaks` clean. | ✅ | No secrets introduced. |

## Exemption reasoning

Slice is a static-data + read-only-render hub at `src/app/dev/proto/`. Functionally equivalent to a documentation page. No DB, no API, no user data, no upload, no auth, no third-party, no env vars, no new deps. Items 2-7, 10, 11 marked N/A on this basis.

Item 9 carries accepted-risk status under Option A: routes intentionally compile in production bundles (matches `/dev/heroes` pattern). Risk profile is T0 design metadata only (no PII / user data); pre-launch with no real users, the URL is publicly addressable but contains no sensitive content. If post-launch the registry is desired private, add a middleware gate or IP allowlist as a follow-up slice — cheap to add.

Item 12 (adversarial review) to be completed pre-PR.
