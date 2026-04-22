# Spec 70 — Build Map · Phase 4 · Settle

**Parent:** spec 70 (hub) · **Phase spec:** 68d (Settle phase locked)
**Scope:** Agreed facts become agreed outcomes. Sarah drafts a proposal → Mark counters → negotiation until both sign → Finalise phase unlocks.

---

## Phase summary

**Purpose:** Turn a reconciled Our Household Picture into a Settlement Proposal that both parties sign. Option cards per section cover the common fair-split patterns; AI coach keeps proposals inside court-reasonableness; explicit signature locks the agreement.

**Entry gate:** All reconcile items resolved (Status quad "Gap to address" + "Values differ" both = 0) → Settle unlocks per 68c R-S1.
**Exit gate:** Both parties sign settlement (per 68d S-G2) → Settlement Agreement created → Finalise unlocks.
**Document in play:** **Settlement Proposal** — V1 (Sarah's opening) → V2 (Mark's counter) → V3 (Sarah's response) → Vn → SIGNED.

---

## Components by tag

### Anchor — new, extract from Claude AI Design outputs

| Component | Design ref | Notes |
|---|---|---|
| Settlement Proposal document shell | 68d S-D1..D4 · Claude AI Design settle wires | Same three-column shape; middle column is option cards per section |
| Proposal option card (per section) | 68d S-P1..P3 · Claude AI Design option cards | Title + Sarah £ impact + Mark £ impact + descriptor + radio. Common options: Sell / Sarah keeps / Mark keeps / Defer-until-18 |
| Running-split banner (top-of-doc) | 68d S-R1..R2 · Claude AI Design running split | Sarah% / Mark% with £ figure, live as options selected |
| AI coach right-rail panel | 68a C-A1/A2 · 68d S-A1..A4 · Claude AI Design settle wires | Four card types: Court reasonableness (red flag) / Fairness check (amber notice) / Coaching (green reinforcement) / On-this-comment |
| Fallback-positions surface | 68d S-A5 | AI-suggested alternative proposals |
| Counter-proposal section view | 68d S-C1..C3 · Claude AI Design counter wires | Split columns (Sarah's proposal vs Mark's counter) + three-button response row: Discuss / Counter / Accept |
| Settlement progress board | 68d S-B1..B3 · Claude AI Design progress wires | Convergence chart + version history timeline + still-open card + agreed list |
| Convergence chart | 68d S-B2 | Gap-between-positions over version axis — preserves "how you got here" |
| Final agreement artefact (V5 SIGNED) | 68d S-G1..G3 | Retrospective convergence chart preserved; both-signed state |
| Signature capture | 68d S-G2 · 68f S-3 (mechanism open) | V1 = identity-verified account + explicit attestation; V1.5 = e-sign integration |

### Derived — variant of an Anchor in a different phase

| Component | Derived from | Notes |
|---|---|---|
| Settlement Proposal document shell | Sarah's Picture document shell (Phase 2 Anchor) | Same shell; middle column morphs to option cards + counter-proposal views; right rail is AI coach |
| AI coach cards (shared pattern) | Cross-phase AI coach base component | Same component family across Build / Reconcile / Settle / Finalise |

### Variant — state variation

| Component | States |
|---|---|
| Proposal option card | Selected · Not-selected · Locked (after sign) |
| Counter-proposal response row | Pre-response · Discuss-open · Counter-in-progress · Accepted · Full-section-agreed |
| Running-split banner | Pre-proposal · Draft-changing · Counter-modifying · Settled |
| Settlement progress board | Mid-negotiation (items open) · Near-complete · All-agreed-awaiting-sign · Signed |

### Re-use — preserved legacy, unchanged

Limited. Settle mechanics are almost entirely new. The only carry-forward is:

| Library | Purpose in Phase 4 |
|---|---|
| Trust chip + HouseholdItem model | Each proposal option inherits trust context from Our Household Picture |

### Preserve-with-reskin — legacy logic, new UI

None meaningful. Proposal, counter, AI coach, and progress board are all new.

### Known-unknown — parked, linked to 68f

| Open | Ref | Blocks |
|---|---|---|
| Pre-reconciliation proposal drafting (can Sarah draft before reconcile is complete?) | 68f S-1 | Lock before Build Map finalises · lean = no (V1 gates hard to resolve-all) |
| Custom / free-text proposal option (vs structured-only) | 68f S-2 | Settle detail spec · lean = free-text with AI coaching |
| Signature capture mechanism (attestation vs e-sign vs upload) | 68f S-3 | Before V1 ship · lean = attestation V1, e-sign V1.5 |
| AI queue ordering weights (extends from Reconcile — same pattern) | 68f R-4 | AI coach pattern spec |

---

## Data model

### Types needed (new)

| Type | Purpose |
|---|---|
| `SettlementProposal` | Document instance, V1..SIGNED versioning |
| `ProposalOption` | Per-section option card (title, Sarah £, Mark £, descriptor, selectable) |
| `ProposalSelection` | Which option selected per section; open / counter-pending / accepted state |
| `RunningSplit` | Derived aggregate: Sarah%/Mark% + £ figure, live |
| `CounterProposal` | Mark's response per section: Discuss / Counter (with new option) / Accept |
| `AICoachCard` | Four types (Court reasonableness / Fairness / Coaching / On-this-comment) with flag state + linked section |
| `FallbackPosition` | AI-suggested alternative proposal for a section |
| `ConvergencePoint` | Version snapshot + gap-between-positions for progress chart |
| `Signature` | Per-party attestation (V1) or e-sign record (V1.5) with timestamp |

### Types re-used

- `HouseholdItem` (from Our Household Picture — both-party-agreed state)
- `TrustLevel`
- `JointDocVersion` pattern extended to proposal versioning

---

## Engine dependencies

| Dependency | Status |
|---|---|
| Option generation (per-section standard options like Sell / Sarah keeps / Mark keeps) | **New** — rules per section type |
| Running-split derivation | **New** — arithmetic over selected options + HouseholdItem values |
| AI court-reasonableness scoring | **New** — prompt + precedent context (matrimonial case law) |
| AI fairness-check heuristics | **New** — proportional lopsidedness flagging |
| Counter-proposal merge logic | **New** — preserves history across rounds |
| Convergence chart derivation | **New** — per-round gap calc |
| Signature / attestation flow | **New** — V1 pattern per 68f S-3 lean |
| AI coach card lifecycle | **New** — cross-phase shared with Reconcile |

---

## Slice membership

*Populated after slice index exists. Expected slices touching Phase 4:*
- Proposal drafting slice (option cards per section + running split)
- AI coach slice (four card types, cross-phase, anchored here)
- Counter-proposal slice (three-button response + version increment)
- Progress board + convergence chart slice
- Signature / sign-to-lock slice

---

## Open dependencies — full 68f/g link list

**Settle-specific:**
- 68f S-1, S-2, S-3

**Cross-cutting:**
- 68a C-A1..A3 (AI coach pattern — anchored here but cross-phase)
- 68a C-E1..E4 · 68f C-E1 (escape-hatch applies if stuck mid-negotiation — though 5-round threshold locked Reconcile-scoped; consider whether Settle has its own trigger)
- 68g C-T1 (trust chip visual detail)
- 68g C-U4 (disclosure-language audit)

**Legacy specs consulted:**
- spec 41 (consent order self-submission — research supporting V1 signature sufficiency)
- spec 61 (flow map proposal-negotiation)
