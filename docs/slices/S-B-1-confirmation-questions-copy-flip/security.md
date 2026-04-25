# S-B-1 · confirmation-questions copy-flip — Security DoD

**Slice:** S-B-1-confirmation-questions-copy-flip
**Source:** `docs/workspace-spec/72-engineering-security.md` §11 (per-slice security checklist)
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

S-B-1 is a string-only logic-library edit. The 12 Cat-A flips replace UI copy strings; nothing in the data path, schema, network, or auth surface is touched. Every checklist item below is therefore N/A bar §12 (adversarial review) and §13 (dependency hygiene), which are always-on per CLAUDE.md DoD.

---

## 1. Data classification per AC

Every AC operates on T0 Public — UI copy strings + an internal handoff doc. No personal, financial, safeguarding, or legal data crosses any AC's surface.

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 | UI copy (accordion-label + facts.label strings) | T0 | N/A — public copy, no encryption / retention requirements |
| AC-2 | UI copy (empty-state strings) | T0 | N/A — same |
| AC-3 | UI copy (legal-process references retained) | T0 | N/A — same |
| AC-4 | File-level grep gate (no data touched) | T0 | N/A |
| AC-5 | Internal context doc string | T0 | N/A — repo-internal doc |

## 2. New tables / columns

- [x] N/A · reason: no schema changes; logic-library edit only.

## 3. API routes

- [x] N/A · reason: no new or modified API routes; no route handlers touched.

## 4. File upload surfaces

- [x] N/A · reason: no upload surfaces touched.

## 5. New env vars

- [x] N/A · reason: no env vars introduced or modified.

## 6. Third-party data flows

- [x] N/A · reason: no third-party integration changes; nothing sent off-system.

## 7. Audit log entries

- [x] N/A · reason: no T3+ operations introduced; no audit-eligible events.

## 8. Error handling

- [x] N/A · reason: no new error paths; pure substring substitution within existing string literals. Existing error-handling paths in the surrounding decision-tree code are not modified.

## 9. Dev/prod boundary

- [x] N/A · reason: target file `src/lib/bank/confirmation-questions.ts` ships in production; same surface either side of the slice. No new dev-only code introduced.

## 10. Safeguarding impact

No T4 data touched. The flipped strings concern asset / income / debt confirmation — no safety flags, coercion indicators, exit-page, device-privacy, or free-text safeguarding fields are in the substitution surface.

- [x] No T4 data touched — skip remaining boxes
- [x] V1 signposting baseline not broken — exit-this-page, device-privacy answer effects, Women's Aid / NDAH / Samaritans signposting are in separate components and routes, untouched by this slice.

## 11. Security headers + CSP

- [x] N/A · reason: no external scripts or new resource origins introduced; no `next.config.ts` / middleware changes.

## 12. Adversarial review

Per HANDOFF-29 obs (manual adversarial review fitter than `/security-review` skill for T0 Public string-only changes — skill is calibrated to UI / data / auth surfaces). Manual sweep approach: re-read the 12 substitutions row-by-row against spec 73 §2.4 exception conditions; cross-check none of the new strings introduce a banned term elsewhere in the §2 list (`position`); verify no string interpolation introduces an injection vector (template-strings replace template-strings — no new `${}` expressions added).

- [x] Manual adversarial sweep run on slice diff (re-read each substitution against §2 + §2.4)
- [x] Output reviewed; each concern either addressed or explicitly deferred with reasoning
- [x] Deferrals recorded below with reason + planned follow-up — none
- [x] `/security-review` skill — **deferred** per HANDOFF-29 reasoning above. Re-evaluate at session-30 wrap; if manual proves repeatedly fitter for T0 Public copy slices, lift into a CLAUDE.md rule.

**Sweep findings (manual):**

1. **Diff is surgical.** 22 lines modified in `src/lib/bank/confirmation-questions.ts` + 4 lines in `docs/SESSION-CONTEXT.md`. Zero collateral changes (no whitespace drift, no comment reflow, no import re-ordering).
2. **Cat-B preservation verified.** All 5 `disclos*` legal-process lines (642, 667, 827, 1532, 1740) byte-identical pre→post. 2 "starting position" Cat-B lines (1328, 1422) byte-identical pre→post. AC-3 test cross-validates.
3. **No injection vector introduced.** Template-string interpolations `${valueLabel}` (A6 ×3), `${appLabel}` (A6 part 4), `${sourceLabel}` (A9) preserved verbatim. No new `${…}` expressions added; substitutions confined to literal-text portions.
4. **No banned terms introduced.** "captured" is spec 73 §1 vocabulary. "position" only remains in 2 legal-term lines (Cat-B). No "disclose" branded usages remain (AC-4 gate confirms).
5. **No T4 / safeguarding surface touched.** Confirmation-question strings concern asset / income / debt — no safety, exit-page, or device-privacy fields in scope.
6. **Pre-existing "captured" uses (2 outside slice scope) audited.** Both are spec-73-aligned uses of the word in adjacent code; no action required.

**Review findings + disposition:**

| Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|
| (none surfaced) | — | — | — |

## 13. Dependency + secrets hygiene

- [x] `npm audit --omit=dev --audit-level=high` clean on slice branch (2 moderate pre-existing — not slice-introduced; CI gate is high+critical)
- [x] GitHub Dependabot: no new criticals introduced (no dependency changes in slice)
- [x] No new dependencies added — `package.json` / `package-lock.json` byte-identical pre→post (verified by `git diff --stat`: only `confirmation-questions.ts` + `SESSION-CONTEXT.md` + slice docs + tests changed)
- [x] `gitleaks` — CI workflow `.github/workflows/gitleaks.yml` runs on PR; substituted strings are user-facing copy with no high-entropy patterns
- [x] No secrets introduced into client bundle (no env-var changes; no `.env*` modifications)
- [x] No secrets in commit history (slice diff reviewed manually; pure copy strings)

---

## Sign-off

- **Slice author:** Claude (session 30)
- **Date:** 2026-04-25
- **Reviewer (if T3+ data or new third-party):** N/A — T0 Public only
- **All boxes ticked or justifiably N/A:** yes
- **Pen-test readiness note:** No new attack surface introduced. The copy substitutions are content-only changes to existing string literals; no new code paths, no new inputs, no new outputs. Pen-test posture for this slice is identical to pre-slice.
