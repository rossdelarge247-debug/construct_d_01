# Spec 70 — Build Map · Phase 5 · Finalise

**Parent:** spec 70 (hub) · **Phase spec:** 68e (Finalise phase locked)
**Scope:** Signed settlement → auto-generated legal documents → pre-flight quality gate → three-tier solicitor fork → submit to court → post-submit tracker (absorbs Move-on for V1) → court-sealed state updates agreement artefact.

---

## Phase summary

**Purpose:** Turn a signed Settlement Proposal into court-ready documents with minimal human legal labour. Guard against preventable rejections with a quality gate. Offer optional professional review (three tiers) for reassurance. Track the 6-10 week judicial review and update the agreement artefact when the order is sealed. V1 folds "Move-on" implementation into the same tracker screen; richer implementation guidance is V1.5+.

**Entry gate:** Settlement Proposal SIGNED by both parties per 68d S-G2.
**Exit gate (soft):** Court-sealed court order received → agreement artefact updated to SEALED state. Tracker continues to surface implementation actions (transfer property, share pension, update records) for V1.
**Documents in play:** **Generated legal docs** — auto-produced artefacts:
- Consent Order (required)
- D81 + Section 10 (required)
- Form P pension annex (conditional on pension-sharing order)
- Settlement summary PDF (required)
- Statement of Arrangements for Children (optional if children section exists)

---

## Components by tag

### Anchor — new, extract from Claude AI Design outputs

| Component | Design ref | Notes |
|---|---|---|
| Generated-documents checklist | 68e F-D1..D2 · Claude AI Design finalise wires | Required vs optional badges; Ready / In-progress / Needs-attention states |
| Consent order legal-doc renderer | 68e F-D3 · Claude AI Design preview wire | Formal court style; §-numbered clauses; print-ready layout |
| Pre-flight quality check | 68e F-P1..P3 · Claude AI Design pre-flight wire · 68f F-2 (additions open) | Eight initial checks as validation cards; pass / fail / needs-input states |
| Print-report affordance | 68e F-P4 | PDF export of pre-flight results for solicitor handoff |
| Three-tier solicitor review fork | 68e F-R1..R3 · 68f F-3 (pricing / partners open) | £0 direct / £250 pensions-only / £450 full; Recommended badge logic per case |
| Submit-to-court page | 68e F-S1..S4 · Claude AI Design submit wire | Four confirmations required: identity · content accuracy · fee ready · authority to submit |
| Fee + attestation pattern | 68e F-S5 | £53 (current court fee, 2026) + e-signed attestation |
| Post-submit tracker | 68e F-T1..T3 · Claude AI Design tracker wire · 68f F-5 (telemetry source open) | Judicial review progress (6-10 weeks) + implementation actions; absorbs Move-on for V1 |
| Court-sealed state on agreement artefact | 68e F-T4 | Updates Settlement Agreement doc to SEALED; convergence chart + history preserved |
| Trust band on submit page | 68g C-V11 (reused from Phase 1) | Reassurance before high-stakes action |

### Derived — variant of an Anchor in a different phase

| Component | Derived from | Notes |
|---|---|---|
| Consent order document shell | Sarah's Picture document shell (Phase 2 Anchor) | Legal-doc style variant; §-numbered clauses; no editable surface (read-only) |
| Document-list cards (Generated docs) | Connected-data-source card shape (Phase 2 Anchor · 68g C-V9) | Similar card with icon + title + status chip; see Claude AI Design tour Finalise demo |

### Variant — state variation

| Component | States |
|---|---|
| Generated-documents checklist | Generating / Ready / Needs attention / Downloaded |
| Pre-flight check card | Not-run / Passed / Failed-blocking / Needs-input |
| Solicitor review fork card | Recommended (per case detection) / Available / Declined (user chose £0) |
| Submit confirmation row | Unchecked / Checked / In-flight / Submitted |
| Post-submit tracker | Submitted (awaiting review) / Review in progress / Queried by court / Sealed / Post-sealed implementation |

### Re-use — preserved legacy, unchanged

Limited. Finalise is almost entirely new. Carry-forward:

| Library | Purpose in Phase 5 |
|---|---|
| Trust chip + HouseholdItem | Each clause in consent order carries its trust provenance |
| Signature / attestation pattern from Settle (V1) | Reused on submit page's final attestation |

### Preserve-with-reskin

None. All Finalise mechanics are new for V1.

### Known-unknown — parked, linked to 68f

| Open | Ref | Blocks |
|---|---|---|
| Document inclusion rules (when Form P, when Statement of Arrangements) | 68f F-1 | Finalise detail spec |
| Pre-flight check additions beyond the 8 (tax implications, CGT, occupation order) | 68f F-2 | Post-V1 iteration |
| Solicitor tier pricing + panel firm partners | 68f F-3 | Before V1 launch — commercial negotiation |
| Submission mechanism (MyHMCTS integration vs guided manual vs fallback) | 68f F-4 · lean = guided manual V1 → MyHMCTS V1.5 | Before V1 build |
| Post-submit tracker telemetry source (self-report vs API vs OCR) | 68f F-5 · lean = self-report V1, MyHMCTS API V1.5 | V1 ship fallback is self-report |

---

## Data model

### Types needed (new)

| Type | Purpose |
|---|---|
| `GeneratedDocument` | Per-doc instance (type, version, status, file ref, trust provenance) |
| `ConsentOrder` | Structured clauses auto-populated from Settlement Agreement |
| `D81` + `Section10` | D81 with Section 10 reasoning populated from agreed proposal trail |
| `FormP` | Pension sharing annex (conditional) |
| `SettlementSummaryPDF` | Human-readable summary artefact |
| `StatementOfArrangements` | Optional children-only document |
| `PreFlightCheck` | Per-check result (id, pass/fail, detail, remediation link) |
| `SolicitorTier` | Tier choice + firm partner + fee + status |
| `SubmitPackage` | All docs + confirmations + fee + attestation |
| `SubmissionRecord` | Submission timestamp + court reference + channel (MyHMCTS or manual) |
| `CourtReviewStatus` | State machine: submitted / under-review / queried / sealed |
| `ImplementationTask` | Post-sealed actions (transfer property, share pension, update records) |

### Types re-used

- `SettlementProposal` → `ConsentOrder` transformation (same data, different render)
- `HouseholdItem` with trust provenance carried through to clauses
- `Signature` pattern from Settle

---

## Engine dependencies

| Dependency | Status |
|---|---|
| Consent-order clause generation from Settlement Agreement | **New** — legal template library (future spec) |
| D81 auto-population (Section 10 from reasoning trails) | **New** — reasoning-trail extraction logic |
| Form P generation (conditional on pension sharing) | **New** — pension-specific template |
| Settlement summary PDF render | **New** — using existing HouseholdItem + SettlementProposal data |
| Pre-flight check validators (8 initial checks) | **New** — each check is a rule against the settlement data |
| Solicitor tier recommendation logic | **New** — per-case complexity detection |
| Submit package assembly | **New** — pulls all required + conditional docs |
| MyHMCTS integration (V1.5 target) | **New** — research required (68f F-4) |
| Court review status telemetry | **New** — V1 self-report + email prompts; V1.5 API |
| Implementation task list (post-sealed) | **New** — derived from agreement clauses |

---

## Slice membership

*Populated after slice index exists. Expected slices touching Phase 5:*
- Document generation slice (Consent Order + D81 + Form P + summary + arrangements)
- Pre-flight quality-check slice
- Solicitor fork slice (panel partner platform)
- Submit-to-court slice (four confirmations + fee + attestation)
- Post-submit tracker slice (V1 — self-report basis)
- Post-sealed implementation slice (absorbs Move-on for V1)

---

## Open dependencies — full 68f/g link list

**Finalise-specific:**
- 68f F-1, F-2, F-3, F-4, F-5

**Cross-cutting:**
- 68a C-E3 (always-available export from document menu — applies to Generated docs too)
- 68g C-T1 (trust chip visual detail)
- 68g C-V11 (trust band reuse for submit reassurance)
- 68g C-U4 (disclosure-language audit — Finalise has formal legal copy; audit still relevant for supporting UI copy)

**Legacy specs consulted:**
- spec 41 (consent order self-submission research — the V1 unlock)
- spec 62 (flow map finalise-submit)
- spec 46 (screens phase-4-to-6 — some content carries, most superseded by 68e)
