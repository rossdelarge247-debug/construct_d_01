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

- [ ] Manual adversarial sweep run on slice diff (re-read each substitution against §2 + §2.4)
- [ ] Output reviewed; each concern either addressed or explicitly deferred with reasoning
- [ ] Deferrals recorded below with reason + planned follow-up
- [ ] `/security-review` skill — **deferred** per HANDOFF-29 reasoning above. Re-evaluate at session-30 wrap; if manual proves repeatedly fitter for T0 Public copy slices, lift into a CLAUDE.md rule.

**Review findings + disposition:**

| Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|
| | | Addressed · Deferred to V1.5 · Risk-accepted · Wont-fix | |

## 13. Dependency + secrets hygiene

- [ ] `npm audit` clean on slice branch (high + critical addressed)
- [ ] GitHub Dependabot: no new criticals introduced
- [ ] No new dependencies added (this slice is pure source edits — verify `package.json` / `pnpm-lock.yaml` unchanged)
- [ ] `gitleaks` clean on slice branch (no high-entropy strings / known patterns in diff — substituted strings are user-facing copy, no risk)
- [ ] No secrets introduced into client bundle
- [ ] No secrets in commit history

---

## Sign-off

- **Slice author:** Claude (session 30)
- **Date:** 2026-04-25
- **Reviewer (if T3+ data or new third-party):** N/A — T0 Public only
- **All boxes ticked or justifiably N/A:** {filled at wrap}
- **Pen-test readiness note:** No new attack surface introduced. The copy substitutions are content-only changes to existing string literals; no new code paths, no new inputs, no new outputs. Pen-test posture for this slice is identical to pre-slice.
