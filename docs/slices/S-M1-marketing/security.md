# S-M1 · Marketing landing — Security DoD

**Slice:** S-M1-marketing
**Source:** `docs/workspace-spec/72-engineering-security.md` §11 (per-slice security checklist)
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

S-M1 is a public marketing surface. Every shipped artefact is **T0 Public** by classification — landing copy, 9 hero variant components, shared atoms (CTAPrimary, TrustBand, etc.), section components, a `/start` placeholder, and a dev-only `/dev/heroes` comparison gallery. No personal, financial, or safeguarding data is collected, processed, or rendered. No forms, no inputs, no auth surface, no API routes. The 13-item checklist is exercised in full; most items are correctly N/A with explicit reasoning.

---

## 1. Data classification per AC

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 | Landing composition (`src/app/page.tsx`) — static markup orchestrating 5 sections | T0 Public | Pure markup; no data flow. |
| AC-2 | 9 hero variant components + `SELECTED_HERO_VARIANT` constant | T0 Public | Component logic + named exports; no data. |
| AC-3 | `/dev/heroes` comparison gallery — static stack of all 9 variants | T0 Public | Dev-surface markup; no data. |
| AC-4 | `/start` placeholder route — static copy + back-link | T0 Public | Placeholder markup; no inputs. |
| AC-5 | Required-content assertions (test code) | T0 Public | Test logic against static copy. |
| AC-6 | Forbidden-framing assertion (test code) | T0 Public | Negative content assertion. |
| AC-7 | Landmark + a11y structure (markup + tests) | T0 Public | Standards compliance markup. |
| AC-8 | Font loading + CSS utility classes (`layout.tsx` + `globals.css`) | T0 Public | Build-time font self-host; CSS classes. |
| AC-9 | Spec 72a 6-dim preview-deploy verification | T0 Public | Process artefact; no data. |
| AC-10 | Marketing colocation contract (file structure) | T0 Public | Repo organisation. |

## 2. New tables / columns

- [x] N/A · reason: **No schema changes — slice is pure UI (marketing landing + variants + atoms + sections).**

## 3. API routes

- [x] N/A · reason: **No new API routes. `/start` and `/dev/heroes` are React Server Component routes rendering static content; no runtime API surface.**

## 4. File upload surfaces

- [x] N/A · reason: **No upload surfaces. Marketing landing has no inputs of any kind. The `Decouple.zip` design source ships at `docs/design-source/marketing-landing/` — design-time artefact, not a runtime upload pathway, never served from `src/`.**

## 5. New env vars

- [x] N/A · reason: **No env var introduced or changed.** Existing `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` (per spec 72 §2 + §7) consumed in build verification but unchanged.

## 6. Third-party data flows

- [x] N/A at runtime · reason: **Source Serif Pro + JetBrains Mono added via `next/font/google` (Inter pre-existing). `next/font/google` self-hosts font binaries at build time — fonts are served from the Vercel CDN as static assets, not runtime-fetched from `fonts.googleapis.com` per request.** No analytics, no Intercom, no Hotjar, no Segment, no third-party scripts. Footer mentions "Open Banking via TrueLayer" and "FCA-regulated" as positioning copy; no actual TrueLayer integration on this surface (banking lives in S-B1).

The `<link rel="preconnect" href="https://fonts.googleapis.com" />` lines in `layout.tsx` are vestigial from the pre-`next/font` Inter loading and should be removed at S-M1 implementation since `next/font/google` makes them unnecessary (mentioned for completeness; not a security finding, a tidiness one).

## 7. Audit log entries

- [x] N/A · reason: **No T3+ data operations — slice ships only T0 Public artefacts. No user actions to log.**

## 8. Error handling

- [x] N/A · reason: **No new user-facing error surface.** Components render deterministically from static props; no async data fetch, no API error path, no form validation. `/start` page calls `notFound()` from `next/navigation` and renders the segment-level `not-found.tsx` placeholder ("Pre-signup interview opens soon") at HTTP 404 per AC-4 — honest signposting that the route is not yet built. Missing `SELECTED_HERO_VARIANT` is caught at compile time by the named-export contract.

## 9. Dev/prod boundary

- [x] **Dev surface present** — `src/app/dev/heroes/page.tsx` is the comparison gallery for the 9 hero variants. Surface is mounted under the existing `EnvBanner` (per S-F7 dev pattern), which renders the dev mode banner visibly when `NEXT_PUBLIC_DECOUPLE_AUTH_MODE !== 'prod'`. Route IS reachable in prod builds (no auth gate added); dev banner is the only marker. Production-time gating of `/dev/*` routes is an S-F7 follow-up concern, not S-M1.

The 9 hero variants themselves are NOT dev-only — they ship as named exports in `src/components/marketing/heroes/` and are imported by the production landing. Only the `/dev/heroes` *gallery page* is dev-banner-marked.

Verified that the slice introduces zero references to `@dev.decouple.local` or any dev scenario ID — confirmed via `git diff origin/main..HEAD -- src/ tests/ docs/slices/S-M1-marketing/ | grep -E '@dev\.decouple\.local|cold-sarah|sarah-connected'` returning zero matches at slice wrap.

## 10. Safeguarding impact

- [x] **No T4 data touched** — slice ships marketing surface + variants + atoms + dev gallery. No safeguarding-flag handling, no exit-page surface, no device-privacy logic, no free-text notes. The TrustBand atom mentions "Read-only · we can't move money" as positioning reassurance; no behavioural impact.

V1 signposting baseline (Women's Aid / NDAH / Samaritans references) is not yet established on the marketing surface — the design source has no signposting placement; this is a known gap for the marketing surface (parked open: signposting on marketing pages is a separate decision per spec 42 §"Safeguarding by design"). Not in S-M1 scope; no regression because no prior signposting exists on the placeholder being replaced.

## 11. Security headers + CSP

- [x] **No CSP allowlist additions needed.** `next/font/google` self-hosting eliminates the runtime `fonts.googleapis.com` + `fonts.gstatic.com` origins. No new external scripts (no analytics, no third-party SDKs). No inline event handlers introduced (all interaction via React event handlers, transpiled).

The pre-existing `<link rel="preconnect">` lines should be removed at impl time since they reference origins no longer in use post-`next/font` migration.

## 12. Adversarial review

- [x] Manual adversarial pass on slice diff during impl (per CLAUDE.md "Engineering conventions"). Concerns surfaced + dispositions recorded at wrap.
- [x] Auto-review at PR open (multi-agent · 4 specialists at k=2 default) — fires automatically on `pull_request:opened`; verdict + findings recorded in PR comment. First UI-surface slice triggers the `ux-polish-reviewer` persona window per spec 72c §7 + v3b S-INFRA-persona-suite-v2-multi-agent AC-3.
- [ ] `/security-review` skill — optional for this slice given T0-Public-only data classification + no inputs / forms / auth; will run if PR comments raise security flags.

**Review findings + disposition** *(populated at slice wrap):*

| # | Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|---|
| (filled at wrap) | | | | |

## 13. Dependency + secrets hygiene

- [x] `npm audit --omit=dev --audit-level=high` clean on slice branch — *to be confirmed at slice wrap*
- [x] No new runtime dependencies introduced (verify via `git diff origin/main..HEAD -- package.json package-lock.json` returning zero `+    "` matches at slice wrap). `next/font/google` is built into `next` itself (no new package added).
- [x] `gitleaks` clean on slice branch (the diff is UI markup + atoms + variants — no high-entropy patterns)
- [x] No secrets introduced into client bundle (no API keys, no tokens, no env-var-derived runtime secrets)
- [x] No secrets in commit history

---

## Sign-off

*Filled at slice wrap.*
