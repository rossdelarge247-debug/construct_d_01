# S-F3 · Phase nav / journey map — Security DoD

**Slice:** S-F3-phase-nav
**Source:** `docs/workspace-spec/72-engineering-security.md` §11 (per-slice security checklist)
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

S-F3 is a foundation-component slice. Every artefact is **T0 Public** by classification — three React components, one pure-function state-derivation module, one constants file holding LOCKED unlock-when copy, one demo block on the placeholder landing page, plus tests + slice docs. No personal, financial, or safeguarding data is touched. The 13-item checklist is exercised in full; most items are correctly N/A with explicit reasoning.

---

## 1. Data classification per AC

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 | TSX component source: `src/components/phase-nav/PhaseStepper.tsx` | T0 Public | Component logic, no data. |
| AC-2 | TSX component source: `src/components/phase-nav/JourneyMapRail.tsx` | T0 Public | Same as AC-1. |
| AC-3 | TSX + TS constants (LOCKED unlock-when copy): `src/components/phase-nav/{LockedSection.tsx,copy.ts}` | T0 Public | Copy constants are spec-evidenced, public-by-spec. |
| AC-4 | TS pure function: `src/components/phase-nav/state.ts` | T0 Public | No data — pure derivation. |
| AC-5 | Test code reading `docs/workspace-spec/68f-...` at runtime | T0 Public | Reads spec source (non-sensitive). |
| AC-6 | Slice docs + 68g register edits | T0 Public | Documentation. |

## 2. New tables / columns

- [x] N/A · reason: **No schema changes — slice is UI/CSS only (component primitives + state-derivation function).**

## 3. API routes

- [x] N/A · reason: **No new API routes — slice ships UI components + a pure derivation function only.**

## 4. File upload surfaces

- [x] N/A · reason: **No upload surfaces. Components render a fixed lock emoji (🔒, unicode) for `LockedSection`; no asset uploads.**

## 5. New env vars

- [x] N/A · reason: **No env var introduced or changed.** Existing `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` (per spec 72 §2 + §7) is consumed in the AC-5 build verification command but unchanged.

## 6. Third-party data flows

- [x] N/A · reason: **No new third-party integration. Phase-nav components are internal logic. The `🔒` lock emoji + LOCKED unlock-when copy come from spec text, not external sources. No fonts, no scripts, no remote assets introduced beyond what S-F1 already established.**

## 7. Audit log entries

- [x] N/A · reason: **No T3+ data operations — slice ships only T0 Public artefacts.**

## 8. Error handling

- [x] N/A · reason: **No new user-facing error surface. `derivePhaseStatus()` returns `'locked'` as the default (non-current, non-complete) — well-defined behaviour per spec C-N1a, not an error path. Component prop-validation handled via TS types, not runtime guards.**

## 9. Dev/prod boundary

- [x] N/A · reason: **No new dev-only routes / fixtures / tooling. Components are environment-agnostic. The placeholder landing demo (`src/app/page.tsx`) is an existing prod surface; demo block ships in prod alongside the components — components ARE the foundation, not dev-only previews.**

Verified that the slice introduces zero references to `@dev.decouple.local` or any dev scenario ID — confirmed via `git diff origin/main..HEAD -- src/ tests/ docs/slices/S-F3-phase-nav/ | grep -E '@dev\.decouple\.local|cold-sarah|sarah-connected'` returning zero matches at slice wrap.

## 10. Safeguarding impact

- [x] **No T4 data touched** — slice ships nav components, a derivation function, copy constants, and a demo block. No safeguarding-flag handling, no exit-page surface, no device-privacy logic, no free-text notes. Unlock-when copy is spec-LOCKED + non-sensitive ("Unlocks when you share your picture with Mark" etc — relationship-aware but not safeguarding-relevant). V1 signposting baseline (Women's Aid / NDAH / Samaritans references) untouched.

## 11. Security headers + CSP

- [x] N/A · reason: **No external scripts, no new resource origins, no inline event handlers introduced. The lock emoji `🔒` is a unicode codepoint (U+1F512) rendered via the OS font stack — no font binary loaded, no CSP allowlist additions needed.**

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
- [x] `gitleaks` clean on slice branch (none of the diff contains high-entropy patterns — UI component code + LOCKED public copy)
- [x] No secrets introduced into client bundle (no API keys, no tokens; only public copy constants + UI logic)
- [x] No secrets in commit history

---

## Sign-off

*Filled at slice wrap.*
