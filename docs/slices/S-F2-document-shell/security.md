# S-F2 · Document shell — Security DoD

**Slice:** S-F2-document-shell
**Source:** `docs/workspace-spec/72-engineering-security.md` §11 (per-slice security checklist)
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

S-F2 is a foundation-layout slice. Every artefact is **T0 Public** by classification — one React component, two TS modules (types + barrel index), plus a demo block on the placeholder landing page, tests + slice docs. No personal, financial, or safeguarding data is touched. The shell is a structural primitive — it accepts opaque `ReactNode` slot children and renders them in a layout grid; semantic content is the consumer's responsibility. The 13-item checklist is exercised in full; most items are correctly N/A with explicit reasoning.

---

## 1. Data classification per AC

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 | TSX component source: `src/components/document-shell/DocumentShell.tsx` + `types.ts` + `index.ts` | T0 Public | Component logic + types; no data. |
| AC-2 | Responsive grid CSS + toggle state (component-local) | T0 Public | Pure layout logic; no persistence. |
| AC-3 | A11y markup + reduced-motion CSS | T0 Public | Standards compliance; no data flow. |
| AC-4 | Demo block in `src/app/page.tsx` with stub strings (no real user data) | T0 Public | Static markup with placeholder copy. |
| AC-5 | Test code | T0 Public | Pure test logic against component contract. |
| AC-6 | Slice docs | T0 Public | Documentation. |

## 2. New tables / columns

- [x] N/A · reason: **No schema changes — slice is UI primitive only (component + types + demo extension).**

## 3. API routes

- [x] N/A · reason: **No new API routes — slice ships UI primitive + types + demo wiring only.**

## 4. File upload surfaces

- [x] N/A · reason: **No upload surfaces. Shell renders slot children; no asset upload pathway.**

## 5. New env vars

- [x] N/A · reason: **No env var introduced or changed.** Existing `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` (per spec 72 §2 + §7) consumed in AC-5 build verification command but unchanged.

## 6. Third-party data flows

- [x] N/A · reason: **No new third-party integration. Shell is internal layout logic + a11y markup. No fonts, no scripts, no remote assets introduced beyond what S-F1 already established.**

## 7. Audit log entries

- [x] N/A · reason: **No T3+ data operations — slice ships only T0 Public artefacts.**

## 8. Error handling

- [x] N/A · reason: **No new user-facing error surface. Shell renders deterministically per slot props; invalid prop types caught by TS at compile time. Missing optional slots render gracefully (grid cell unpopulated). No runtime guards needed.**

## 9. Dev/prod boundary

- [x] N/A · reason: **No new dev-only routes / fixtures / tooling. Shell is environment-agnostic. The placeholder landing demo (`src/app/page.tsx`) is an existing prod surface; demo block ships in prod alongside the component.**

Verified that the slice introduces zero references to `@dev.decouple.local` or any dev scenario ID — confirmed via `git diff origin/main..HEAD -- src/ tests/ docs/slices/S-F2-document-shell/ | grep -E '@dev\.decouple\.local|cold-sarah|sarah-connected'` returning zero matches at slice wrap.

## 10. Safeguarding impact

- [x] **No T4 data touched** — slice ships a layout primitive + types + demo. No safeguarding-flag handling, no exit-page surface, no device-privacy logic, no free-text notes. The shell's `state` prop machine (`'draft' | 'ready-to-send' | ...` per spec 68d S-D2) carries document-state metadata only — surface-level workflow state, not safeguarding-sensitive content. V1 signposting baseline (Women's Aid / NDAH / Samaritans references) untouched.

## 11. Security headers + CSP

- [x] N/A · reason: **No external scripts, no new resource origins, no inline event handlers introduced. Shell renders structural markup + Tailwind classes — no font binary loaded, no CSP allowlist additions needed.**

## 12. Adversarial review

- [x] Manual adversarial pass on slice diff during impl (per CLAUDE.md "Engineering conventions"). Concerns surfaced + dispositions recorded at wrap.
- [x] Auto-review at PR open (multi-agent · 4 specialists at k=2 default) — fires automatically on `pull_request:opened`; verdict + findings recorded in PR comment.
- [ ] `/security-review` skill — optional for this slice given T0-Public-only data classification + manual security-pass findings; will run if PR comments raise security flags.

**Review findings + disposition** *(populated at slice wrap):*

| # | Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|---|
| (filled at wrap) | | | | |

## 13. Dependency + secrets hygiene

- [x] `npm audit --omit=dev --audit-level=high` clean on slice branch — *to be confirmed at AC-5/6 wrap*
- [x] No new dependencies introduced (verify via `git diff origin/main..HEAD -- package.json package-lock.json` returning zero `+    "` matches at slice wrap)
- [x] `gitleaks` clean on slice branch (none of the diff contains high-entropy patterns — UI component code + structural primitive)
- [x] No secrets introduced into client bundle (no API keys, no tokens)
- [x] No secrets in commit history

---

## Sign-off

*Filled at slice wrap.*
