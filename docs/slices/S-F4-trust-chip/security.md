# S-F4 · Trust taxonomy + trust chip — Security DoD

**Slice:** S-F4-trust-chip
**Source:** `docs/workspace-spec/72-engineering-security.md` §11 (per-slice security checklist)
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

S-F4 is a foundation-component slice. Every artefact is **T0 Public** by classification — one React component, two TS modules (types + level constants/helper), four new CSS custom properties on the existing design-token sheet, plus a demo block on the placeholder landing page, tests + slice docs. No personal, financial, or safeguarding data is touched. The 13-item checklist is exercised in full; most items are correctly N/A with explicit reasoning.

---

## 1. Data classification per AC

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 | TSX component source: `src/components/trust/TrustChip.tsx` + 4 token additions to `src/app/globals.css` + corresponding entries in `src/styles/tokens.ts` | T0 Public | Component logic + design-system tokens; no data. |
| AC-2 | TS types + constants: `src/components/trust/{types,levels}.ts` | T0 Public | Spec-evidenced taxonomy + pure helper. |
| AC-3 | Parity test reading `docs/workspace-spec/68f-open-decisions-register.md` at runtime | T0 Public | Reads spec source (non-sensitive). |
| AC-4 | Test code + S-F1 token-parity test update | T0 Public | Pure test logic. |
| AC-5 | Slice docs + 68g register annotation | T0 Public | Documentation. |

## 2. New tables / columns

- [x] N/A · reason: **No schema changes — slice is UI/CSS only (component primitive + types + constants + token additions).**

## 3. API routes

- [x] N/A · reason: **No new API routes — slice ships UI primitive + types + token extensions only.**

## 4. File upload surfaces

- [x] N/A · reason: **No upload surfaces. The chip renders text labels + CSS-coloured backgrounds; no asset uploads.**

## 5. New env vars

- [x] N/A · reason: **No env var introduced or changed.** Existing `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` (per spec 72 §2 + §7) is consumed in the AC-4 build verification command but unchanged.

## 6. Third-party data flows

- [x] N/A · reason: **No new third-party integration. Trust chip is internal logic + four new CSS custom properties on the existing S-F1 token sheet. No fonts, no scripts, no remote assets introduced beyond what S-F1 already established.**

## 7. Audit log entries

- [x] N/A · reason: **No T3+ data operations — slice ships only T0 Public artefacts.**

## 8. Error handling

- [x] N/A · reason: **No new user-facing error surface. Chip renders deterministically per `level` prop; invalid prop values caught by TS at compile time. No runtime guards needed.**

## 9. Dev/prod boundary

- [x] N/A · reason: **No new dev-only routes / fixtures / tooling. Component is environment-agnostic. The placeholder landing demo (`src/app/page.tsx`) is an existing prod surface; demo block ships in prod alongside the component.**

Verified that the slice introduces zero references to `@dev.decouple.local` or any dev scenario ID — confirmed via `git diff origin/main..HEAD -- src/ tests/ docs/slices/S-F4-trust-chip/ | grep -E '@dev\.decouple\.local|cold-sarah|sarah-connected'` returning zero matches at slice wrap.

## 10. Safeguarding impact

- [x] **No T4 data touched** — slice ships a chip primitive + types + constants. No safeguarding-flag handling, no exit-page surface, no device-privacy logic, no free-text notes. The chip carries trust level metadata about evidence sources (e.g. "bank-evidenced") — surface-level provenance, not safeguarding-sensitive content. V1 signposting baseline (Women's Aid / NDAH / Samaritans references) untouched.

## 11. Security headers + CSP

- [x] N/A · reason: **No external scripts, no new resource origins, no inline event handlers introduced. Chip renders text + colour via CSS custom properties — no font binary loaded, no CSP allowlist additions needed.**

## 12. Adversarial review

- [x] Manual adversarial pass on slice diff during impl (per CLAUDE.md "Engineering conventions"). Concerns surfaced + dispositions recorded at wrap.
- [x] Auto-review at PR open (multi-agent · 4 specialists at k=2 default) — fires automatically on `pull_request:opened`; verdict + findings recorded in PR comment.
- [ ] `/security-review` skill — optional for this slice given T0-Public-only data classification + manual security-pass findings; will run if PR comments raise security flags.

**Review findings + disposition** *(populated at slice wrap):*

| # | Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|---|
| (filled at wrap) | | | | |

## 13. Dependency + secrets hygiene

- [x] `npm audit --omit=dev --audit-level=high` clean on slice branch — *to be confirmed at AC-4/5 wrap*
- [x] No new dependencies introduced (verify via `git diff origin/main..HEAD -- package.json package-lock.json` returning zero `+    "` matches at slice wrap)
- [x] `gitleaks` clean on slice branch (none of the diff contains high-entropy patterns — UI component code + LOCKED public taxonomy)
- [x] No secrets introduced into client bundle (no API keys, no tokens; only public design tokens + UI logic)
- [x] No secrets in commit history

---

## Sign-off

*Filled at slice wrap.*
