# Spec 68e — Finalise Phase Decisions Locked

**Date:** 21 April 2026
**Parent:** spec 68 (synthesis hub)
**Scope:** Decisions for the Finalise phase — document generation, consent order rendering, pre-flight quality check, solicitor tier decision, and court submission. "Move-on" / implementation folds here for V1.

---

## F-D Document generation

**F-D1 Finalise entry screen is the document generation list — LOCKED.**
Heading: *"Generate your legal documents"*. Sub-copy: *"Everything you've agreed can now be turned into the documents the court needs. It takes about 30 seconds."*

**F-D2 Generated document set — LOCKED (core) / OPEN inclusion rules (see 68f F-1).**
- **Consent order** · REQUIRED · *"The legal settlement between you and {Mark}. Once sealed by a judge, it becomes binding on both of you."*
- **D81 Statement of Information** · REQUIRED · *"The form the judge reads alongside the consent order. Includes the Section 10 narrative — we'll compile that from your proposal reasoning across all {N} rounds."*
- **Pension sharing annex (Form P)** · REQUIRED *if pension sharing order in agreement* · *"The pension provider will need this."*
- **Settlement summary (PDF)** · REQUIRED · *"A plain-language summary for your own records. Includes all reasoning from your negotiation."*
- **Statement of arrangements (children)** · OPTIONAL · *"Some courts want a separate document for children arrangements. Optional for you — your consent order already covers the key points."* Checkbox: "Include this too."

**F-D3 Generation artefact format — LOCKED.**
- Consent order: formal court layout — IN THE FAMILY COURT AT {COURT} · Case No · BETWEEN Applicant + Respondent · CONSENT ORDER title · UPON/IT IS ORDERED BY CONSENT THAT clauses · numbered paragraphs per settlement area
- D81: official HMCTS format auto-populated with Section 10 narrative compiled from proposal reasoning (the most common reason courts reject consent orders is a weak Section 10 — we make it comprehensive by default)
- Form P: scheme name · CETV valuation date · percentage share, per WRPA 1999
- Settlement summary: plain-English recap of all agreed terms + reasoning

**F-D4 Previewable per document — LOCKED.**
After generation, top tabs: Consent order · D81 + Section 10 · Pension annex · Settlement summary. User can read each before progressing.

---

## F-P Pre-flight quality check

**F-P1 Pre-flight is a validation gate — LOCKED.**
Between generation and submission. Validates against the most common reasons courts reject consent orders. All checks must pass to progress to submit.

**F-P2 Validation card set — LOCKED (initial eight) / OPEN on additions (see 68f F-2).**
Each renders as a card with ✓ / × / ! icon + title + evidence text:
1. **All required clauses present** — property, pension, maintenance, dismissal of claims, costs
2. **Clean break wording correctly applied** — Clause N dismisses all future claims except ordered pension share + spousal maintenance (if any)
3. **Pension sharing order formatted per WRPA 1999** — percentage, scheme name, CETV valuation date all present; Form P attached
4. **D81 Section 10 completed** — narrative compiled from proposal reasoning
5. **Both parties' statements of truth included** — both signature blocks in D81
6. **Fairness check — within typical range** — overall split compared to typical court outcomes for case profile
7. **No unusual terms flagged** — no non-standard clauses or ambiguous wording detected
8. **Court fee calculated** — current HMCTS consent order fee shown (validate at submit time, fee changes periodically)

**F-P3 Pre-flight status chip — LOCKED.**
*"V{N} · PASSED"* or *"V{N} · ISSUES"* chip in top bar. On fail, relevant check card expands with remediation CTA.

**F-P4 Print report affordance — LOCKED.**
Pre-flight results exportable as a PDF report (*"Print report"*). Useful if taking to a solicitor for review.

---

## F-R Solicitor review decision

**F-R1 Review decision is a distinct phase step — LOCKED.**
After pre-flight passes: *"Do you want a solicitor to review before submitting?"* — three-path fork. This is NOT automatic routing; user chooses consciously.

**F-R2 Three options — LOCKED (structure) / OPEN on pricing (see 68f F-3).**
- **Submit directly · £0 · YOU DO IT YOURSELF** — *"Appropriate when your case is straightforward, both parties fully understand what they're signing, and pre-flight is clean."* No extra cost · Submit today · Court fee applies
- **Pensions-only review · £250 · FIXED FEE · PENSIONS EXPERT · RECOMMENDED** (highlighted card) — *"A pensions actuary reviews your sharing order for fairness and CETV arithmetic. Recommended if either pension is over £100k."* PSO & annex review · 48-hour turnaround · Changes included
- **Full document review · £450 · FIXED FEE · FAMILY SOLICITOR** — *"A family law solicitor reviews all documents, flags risks, and confirms compliance. Best if your estate includes a business, trust, or overseas assets."* All documents reviewed · Written advice · 72-hour turnaround

**F-R3 "RECOMMENDED" badge logic — LOCKED.**
AI applies rules: if either pension > £100k → Pensions-only recommended. If business / trust / overseas → Full recommended. Otherwise → Submit directly recommended. Default badge position shown, rationale available.

**F-R4 Footer reassurance — LOCKED.**
*"What courts look for. Judges approve consent orders when settlements look fair and both parties understood what they signed. Professional review doesn't change the legal effect — it's insurance, not necessity."*

---

## F-S Submit to Family Court

**F-S1 Submit page heading — LOCKED.**
*"Submit to Family Court"*. Sub-copy: *"Once submitted, the court typically responds within 6-12 weeks. You'll be notified at each stage."*

**F-S2 Package contents block — LOCKED.**
List of to-be-submitted documents with READY chip per row. Consent order · D81 · Form P (if applicable) · Settlement summary.

**F-S3 Confirmation checklist — LOCKED.**
Four confirmations, all required before submit activates:
- **Sarah's signature confirmed** — signed {date} · verified via identity check
- **Mark's signature confirmed** — signed {date} · verified via identity check
- **Court fee paid** · {current fee} · HMCTS
- **I confirm this represents our full agreement** — user-checkbox attestation

**F-S4 Adaptive submit CTA — LOCKED.**
Primary button disabled until all confirmations complete. Helper copy alongside: *"Complete all confirmations above"*. Becomes *"Submit to Family Court →"* when ready.

**F-S5 Submission mechanism — OPEN (see 68f F-4).**
MyHMCTS integration (programmatic submission) vs guided manual submission (user uploads to HMCTS portal themselves with our prep). MyHMCTS is the ambitious path; manual is the V1 fallback. Lock when legal research confirms MyHMCTS access model.

---

## F-T Post-submit tracking (absorbs Move-on for V1)

**F-T1 Post-submit tracking is the V1 Move-on surface — LOCKED.**
After submission, the Finalise phase doesn't end. User stays in Finalise for the 6-12 week court review + subsequent implementation. "Move-on" as a separate phase deferred beyond V1.

**F-T2 Tracker states — LOCKED (initial set) / OPEN on telemetry (see 68f F-5).**
- Submitted → Awaiting case number
- Case allocated → Awaiting judicial review
- Reviewed → Approved / Clarification requested / Rejected
- Sealed → Court-sealed order available for download
- Implementation phase (V1 minimum: checklist of post-order steps. V1.5+: richer guidance per spec 42 Move-on concept)

**F-T3 Court-sealed artefact — LOCKED.**
Once sealed, the consent order artefact (previewable in F-D4) updates to *"COURT-SEALED · FINAL"* state and becomes a downloadable binding document. Trust level for agreed items = Court-sealed (per 68a C-T2 taxonomy).

**F-T4 Implementation checklist (V1 minimum) — LOCKED as scope.**
Per-section post-order actions: *"Transfer the property title"* · *"Send Form P to NHS Pensions"* · *"Close joint Barclays account"* · *"Update Council Tax to single occupancy"* etc. One-line per action. Rich guidance per item is V1.5.

---

## Applicability

These decisions cover Finalise + post-submit tracking for V1. Downstream phase-detail spec (spec 73+ "Finalise flow") translates into interaction details. Integration with external systems (MyHMCTS, identity verification for sign, e-sign provider) is legal-research-dependent and tracked in the open register.
