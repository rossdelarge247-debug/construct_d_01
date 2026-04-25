# S-B-2 · Recommendations copy-flip — Security DoD

**Slice:** S-B-2-recommendations-copy-flip
**Source:** `docs/workspace-spec/72-engineering-security.md` §11 (per-slice security checklist)
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

S-B-2 is a string-only logic-library edit, structurally identical to S-B-1. Four Cat-A copy-flips replace UI copy strings inside `src/lib/recommendations.ts`; nothing in the data path, schema, network, or auth surface is touched. Every checklist item below is therefore N/A bar §12 (adversarial review) and §13 (dependency hygiene), which are always-on per CLAUDE.md DoD.

---

## 1. Data classification per AC

Every AC operates on T0 Public — UI copy strings inside a logic library. No personal, financial, safeguarding, or legal data crosses any AC's surface.

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 | UI copy (recommendation `explanation` strings) | T0 | N/A — public copy, no encryption / retention requirements |
| AC-2 | UI copy (recommendation `explanation` + `serviceDescription` strings) | T0 | N/A — same |
| AC-3 | UI copy (legal-process `FinancialReaction.message` retained verbatim) | T0 | N/A — same |
| AC-4 | File-level regex audit gate (no data touched) | T0 | N/A |

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

- [x] N/A · reason: no new error paths; pure substring substitution within existing string literals. The `generateRecommendations` and `getFinancialReactions` exports continue to return the same shapes; only the text payload of certain `explanation` / `serviceDescription` fields changes.

## 9. Dev/prod boundary

- [x] N/A · reason: target file `src/lib/recommendations.ts` ships in production; same surface either side of the slice. No new dev-only code introduced.

## 10. Safeguarding impact

No T4 data touched. The flipped strings concern financial-picture building, children's arrangements detail, and mediation prep — generic process recommendations, no safety flags, coercion indicators, exit-page, device-privacy, or free-text safeguarding fields are in the substitution surface. Note the slice file does observe `hasSafeguardingConcerns` as a function parameter (used at `:206` to gate the mediation recommendation), but this slice does not modify that gating logic.

- [x] No T4 data touched — skip remaining boxes
- [x] V1 signposting baseline not broken — exit-this-page, device-privacy answer effects, Women's Aid / NDAH / Samaritans signposting are in separate components and routes, untouched by this slice. The mediation-recommendation gate `if (!hasSafeguardingConcerns)` is preserved verbatim.

## 11. Security headers + CSP

- [x] N/A · reason: no external scripts or new resource origins introduced; no `next.config.ts` / middleware changes.

## 12. Adversarial review

Per HANDOFF-29 + HANDOFF-30 obs (manual adversarial review fitter than `/security-review` skill for T0 Public string-only changes — skill is calibrated to UI / data / auth surfaces). Manual sweep approach: re-read each substitution row-by-row against spec 73 §2 + §2.4 exception conditions; cross-check none of the new strings introduce a banned term elsewhere; verify no string interpolation introduces an injection vector (no template-strings touched in the slice diff).

- [x] Manual adversarial sweep run on slice diff (re-read each substitution against §2 + §2.4)
- [x] Output reviewed; each concern either addressed or explicitly deferred with reasoning
- [x] Deferrals recorded below with reason + planned follow-up — none
- [x] `/security-review` skill — **deferred** per HANDOFF-29 + HANDOFF-30 reasoning. Twice-deferred for T0 Public copy slices; the manual sweep continues to surface signal at zero false-positive cost. If a third copy-flip slice (S-B-3 onward) repeats the pattern unchanged, lift "manual sweep is canonical for T0 copy-only slices" to a CLAUDE.md rule.

**Sweep findings (manual):**

1. **Diff is surgical.** 4 lines modified in `src/lib/recommendations.ts` + 1 doc line amended (audit-catalogue A19). Zero collateral changes (no whitespace drift, no comment reflow, no import re-ordering, no shape changes to exported types).
2. **Cat-B preservation verified.** Line 60 `'The formal disclosure process requires both parties to declare everything under a legal oath...'` byte-identical pre→post. Cross-validated by AC-3 baseline-fixture test (`tests/unit/fixtures/recommendations-cat-b-baseline.txt`).
3. **No injection vector introduced.** No template-string interpolations were touched. `serviceDescription` and `explanation` are static string literals before and after the slice; no new `${…}` expressions added.
4. **No banned terms introduced.** "foundation" / "submission" / "picture" / "Form E submission" are spec 73 §1 vocabulary or §2 legal-process exceptions. AC-4 audit-clean test confirms `\bposition\b = 0` and `disclos[a-z]* = 3` (Cat-B + boundary + Cat-D code key).
5. **A17 §2.4 boundary case judged.** The chosen reframe — single-word `'formal'` insertion producing `'thorough, formal disclosure'` — passes the §2.4 solicitor/judge test ("could a solicitor or judge say this exact sentence?"). The phrase `'thorough, formal disclosure'` echoes Cat-B line 60's `'formal disclosure process'`, anchoring the legal-process register without losing the original "thorough" emphasis. Heavier alternatives (full rewrite, `'full and frank disclosure'`) were considered and rejected as over-touching the disposition's "retain" instruction.
6. **A19 amendment audit-trail clean.** The post-freeze amendment ('stronger' adjective → 'strengthens' verb form) is captured in: (a) audit-catalogue row A19 amendment column; (b) acceptance.md review log; (c) standalone commit `05e87f1`. Tests written against the amended string. No silent expansion of scope.
7. **No T4 / safeguarding surface touched.** Recommendation strings concern picture-building, children's-arrangements detail, mediation prep — no safety, exit-page, or device-privacy fields in scope. The `hasSafeguardingConcerns` parameter is observed (mediation gate) but its logic is unchanged.
8. **Cat-D code key untouched.** `serviceLink: 'share_and_disclose'` at `:214` deliberately retained per §2.4 condition 4 (internal non-rendered routing key). Renaming would be a cross-cutting refactor — out of scope for a copy-flip.

**Review findings + disposition:**

| Concern | Severity | Disposition | Owner / follow-up |
|---|---|---|---|
| (none surfaced) | — | — | — |

## 13. Dependency + secrets hygiene

- [x] `npm audit --omit=dev --audit-level=high` clean on slice branch (2 moderate pre-existing — same as S-B-1, not slice-introduced; CI gate is high+critical)
- [x] GitHub Dependabot: no new criticals introduced (no dependency changes in slice)
- [x] No new dependencies added — `package.json` / `package-lock.json` byte-identical pre→post. Only `src/lib/recommendations.ts`, slice docs, audit-catalogue (A19 amendment), tests, and helper module changed.
- [x] `gitleaks` — CI workflow `.github/workflows/gitleaks.yml` runs on PR; substituted strings are user-facing copy with no high-entropy patterns
- [x] No secrets introduced into client bundle (no env-var changes; no `.env*` modifications)
- [x] No secrets in commit history (slice diff reviewed manually; pure copy strings)

---

## Sign-off

- **Slice author:** Claude (session 31)
- **Date:** 2026-04-25
- **Reviewer (if T3+ data or new third-party):** N/A — T0 Public only
- **All boxes ticked or justifiably N/A:** yes
- **Pen-test readiness note:** No new attack surface introduced. The copy substitutions are content-only changes to existing string literals; no new code paths, no new inputs, no new outputs. Pen-test posture for this slice is identical to pre-slice.
