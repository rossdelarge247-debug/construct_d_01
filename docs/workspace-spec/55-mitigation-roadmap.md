# Spec 55 — Mitigation Roadmap: Backlog Items from Risk Register

**Date:** 17 April 2026
**Purpose:** Surface every mitigation from the risk register (spec 54) as an actionable backlog item. Prioritised, categorised, mapped to epics where applicable.

---

## Priority scale

- **🔴 BLOCKER** — must be in place before launch
- **🟠 MVP** — needed for V1 launch
- **🟡 V1.5** — near-term post-launch
- **🟢 V2+** — longer horizon
- **🔵 ONGOING** — continuous discipline, not one-off

## Category legend

- **DES** — Design (UX, copy, flows)
- **ENG** — Engineering (code, architecture, data)
- **LEG** — Legal (templates, counsel, regulatory)
- **OPS** — Operational (policies, partnerships, processes)
- **COM** — Commercial (pricing, partnerships, insurance)
- **MET** — Metrics (tracking, reporting, monitoring)

---

## 1. Evidence collection mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M1.1 | CSV/PDF upload fallback for unsupported banks | 🟠 MVP | ENG | R1 | E2.9 |
| M1.2 | Manual entry path (always available) | 🟠 MVP | ENG | R1 | E2.10 |
| M1.3 | 90-day Open Banking consent re-authentication flow | 🟠 MVP | ENG | R1, R4g | — |
| M1.4 | Cache classified data permanently (separate from raw transactions) | 🟠 MVP | ENG | R1, R4g | — |
| M1.5 | Classification feedback loop (user corrections improve engine) | 🟡 V1.5 | ENG | R1 | E2.3 |
| M1.6 | Multi-provider Open Banking strategy (research backup to Tink) | 🟢 V2+ | COM | R1 | — |
| M1.7 | Evidence badge system (self-declared / bank-evidenced / doc-evidenced / credit-verified) | 🟠 MVP | DES, ENG | R1 | E2 family |
| M1.8 | Audit trail per item (every classification link to source transaction) | 🟠 MVP | ENG | R1 | E2.15 |
| M1.9 | Credit check integration as anti-gaming layer | 🟡 V1.5 | ENG, COM | R1, R4b | E2.12 |
| M1.10 | "Do you deal in cash?" prompt for cash-heavy users | 🟠 MVP | DES | R1 | E2.1 |

---

## 2. AI guidance mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M2.1 | Launch with arithmetic only (no "typical ranges") | 🔴 BLOCKER | DES, ENG | R2, R4e | E4.4 |
| M2.2 | Legal review of every piece of system context before launch | 🔴 BLOCKER | LEG | R2, R4d | — |
| M2.3 | Per-context source attribution (no number without citation basis) | 🟠 MVP | DES | R2 | E4.4 |
| M2.4 | Framing: "information not advice" copy vetted by counsel | 🔴 BLOCKER | LEG, DES | R2, R4d | All screens |
| M2.5 | Always-visible "Get professional review" option at decision points | 🟠 MVP | DES | R2 | E5.8 |
| M2.6 | Confidence transparency — show how every number was calculated | 🟠 MVP | DES | R2 | E4.4 |
| M2.7 | Published-source context (Resolution, Duxbury, CMS) with citations | 🟡 V1.5 | DES, LEG | R2, R4e | E4.4 |
| M2.8 | Proprietary outcome data (requires scale — defer) | 🟢 V2+ | MET, OPS | R2, R4e | — |
| M2.9 | Emotional handoff paths — when system knows it's out of depth | 🟡 V1.5 | DES | R2 | E7 family |
| M2.10 | Context usefulness feedback (thumbs up/down per context shown) | 🟠 MVP | ENG, MET | R2 | E4.4 |
| M2.11 | Explicit limitations flags (e.g. "CMS rate indicative — actual has nuances") | 🟠 MVP | DES | R2 | E4.4 |

---

## 3. Document generation mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M3.1 | Commission family law firm to draft/vet consent order templates | 🔴 BLOCKER | LEG | R3 | E5.2 |
| M3.2 | Start with 5 most common settlement patterns (~70% coverage) | 🟠 MVP | LEG, ENG | R3 | E5.1 |
| M3.3 | AI-assisted D81 Section 10 enhancement from proposal reasoning | 🟠 MVP | ENG | R3 | E5.3 |
| M3.4 | Pension specialist partnership (PODE-accredited) for Form P templates | 🟠 MVP | COM, LEG | R3 | E5.4 |
| M3.5 | Launch Tier 2 (review recommended) as default | 🔴 BLOCKER | DES, COM | R3 | E5.8 |
| M3.6 | Approval rate tracking per template / per submission | 🟠 MVP | MET | R3 | E5.10 |
| M3.7 | Pre-flight quality check against known rejection reasons | 🟠 MVP | ENG | R3 | E5.7 |
| M3.8 | Court rejection feedback capture ("was your order approved?") | 🟡 V1.5 | ENG, DES | R3 | E5.10 |
| M3.9 | Rejection-reason database informing template improvements | 🟡 V1.5 | ENG, MET | R3 | — |
| M3.10 | Template versioning and changelog (respond to legal reform) | 🟠 MVP | LEG, ENG | R3, R4d | E5.2 |
| M3.11 | Professional indemnity insurance research and procurement | 🔴 BLOCKER | COM, LEG | R3 | — |
| M3.12 | Clear disclaimer model (templated documents, not bespoke advice) | 🔴 BLOCKER | LEG, DES | R3 | E5 family |
| M3.13 | Retained family law practitioner for template maintenance | 🟠 MVP | COM, LEG | R3 | — |
| M3.14 | Resolution-accredited reviewer marketplace | 🟡 V1.5 | COM | R3 | E5.8 |

---

## 4. Data security mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M4.1 | Encryption at rest (database, backups, logs) | 🔴 BLOCKER | ENG | R4a | — |
| M4.2 | Encryption in transit (TLS 1.3 everywhere) | 🔴 BLOCKER | ENG | R4a | — |
| M4.3 | Data segregation architecture (shared document as references, not duplicates) | 🔴 BLOCKER | ENG | R4a | — |
| M4.4 | Minimal retention policy (90 days post-case unless opted in) | 🟠 MVP | OPS, LEG | R4a, R4g | — |
| M4.5 | Penetration testing before launch | 🔴 BLOCKER | OPS | R4a | — |
| M4.6 | Annual penetration testing | 🔵 ONGOING | OPS | R4a | — |
| M4.7 | Data Protection Impact Assessment (GDPR Art 35 requirement) | 🔴 BLOCKER | LEG, OPS | R4a | — |
| M4.8 | Audit logging for every sensitive read/write | 🟠 MVP | ENG | R4a, R4b | — |
| M4.9 | Mandatory 2FA for all accounts | 🟠 MVP | ENG | R4a, R4b | — |
| M4.10 | Cyber insurance from day 1 | 🔴 BLOCKER | COM | R4a | — |
| M4.11 | ISO 27001 certification path | 🟢 V2+ | OPS | R4a | — |
| M4.12 | Employee access controls + training | 🟠 MVP | OPS | R4a | — |
| M4.13 | Data deletion + export policy (user-initiated) | 🟠 MVP | ENG, LEG | R4a | S4 |
| M4.14 | GDPR right-to-erasure with shared-data conflict resolution | 🟠 MVP | LEG, ENG | R4a | S4 |
| M4.15 | Secure account recovery (without compromising sensitive access) | 🟠 MVP | ENG | R4a | S4 |

---

## 5. Adversarial-use mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M5.1 | Ongoing coercive control signal detection (6 behavioural patterns) | 🟠 MVP | ENG | R4b | E7.2 |
| M5.2 | 3-level graduated safety response (prompt / nudge / intervention) | 🟠 MVP | DES, ENG | R4b | E7.3 |
| M5.3 | 24-hour cooling-off period on proposal acceptance | 🟠 MVP | ENG, DES | R4b | E4.7 |
| M5.4 | "Pause my account" — immediate lockdown, revokes ex access | 🟠 MVP | ENG | R4b | E7.5 |
| M5.5 | Discreet-use mode (alternative app name, hidden icon) | 🟡 V1.5 | DES, ENG | R4b | E7.6 |
| M5.6 | Session anomaly detection (new devices, geo-impossible logins) | 🟡 V1.5 | ENG | R4b | — |
| M5.7 | Cross-party device/IP detection (same device accessing both accounts) | 🟢 V2+ | ENG | R4b | — |
| M5.8 | Mandatory review trigger when coercive indicators present | 🟡 V1.5 | DES, ENG | R4b | E7.3 |
| M5.9 | Specialist service resources (Women's Aid, Men's Advice, DV helplines) | 🟠 MVP | DES | R4b | E7.4 |
| M5.10 | Statement of truth with clear consequences + post-settlement set-aside education | 🟠 MVP | DES, LEG | R4b | E5 family |
| M5.11 | Anti-gaming credit check (catches hidden accounts) | 🟡 V1.5 | ENG, COM | R4b | E2.12 |
| M5.12 | Fairness guardrails flagging extreme splits (>85%) | 🟡 V1.5 | ENG, DES | R4b | E4.11 |
| M5.13 | Entry safety screening | 🟠 MVP | DES | R4b | E7.1 |

---

## 6. Handoff to professionals mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M6.1 | Complexity detection at profiling (vehicles, overseas, trusts) | 🟠 MVP | ENG, DES | R4c | E2.16 |
| M6.2 | Signal-level complexity flags (mixed expenses, unusual patterns) | 🟡 V1.5 | ENG | R4c | E2.3 |
| M6.3 | Tier recommendation transparency with user override | 🟠 MVP | DES | R4c | E2.16 |
| M6.4 | "Export everything" structured data package for professionals | 🟢 V2+ | ENG | R4c | — |
| M6.5 | Mid-journey escape hatch ("Want to hand this off?") | 🟡 V1.5 | DES | R4c | — |
| M6.6 | Re-entry paths after professional handoff | 🟢 V2+ | ENG, DES | R4c | — |
| M6.7 | Pre-launch partnerships with 3-5 family law firms | 🔴 BLOCKER | COM | R4c | C3 |
| M6.8 | Honest limitations copy (e.g. "We can't handle offshore assets") | 🟠 MVP | DES | R4c | — |
| M6.9 | Handoff data quality for professional ingestion | 🟡 V1.5 | ENG | R4c | — |

---

## 7. Regulatory mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M7.1 | Pre-launch SRA engagement (informal conversation on file) | 🔴 BLOCKER | LEG | R4d | S1 |
| M7.2 | Regulatory-experienced legal counsel retained | 🔴 BLOCKER | LEG, COM | R4d | S1 |
| M7.3 | "Information tool, not advice" positioning across all copy | 🔴 BLOCKER | DES, LEG | R4d | All |
| M7.4 | Partnership with regulated law firm for Tier 2 review cover | 🟠 MVP | COM, LEG | R4d | E5.8 |
| M7.5 | Resolution membership (professional body alignment) | 🟠 MVP | COM | R4d | — |
| M7.6 | Law Commission reform monitoring and response | 🔵 ONGOING | LEG | R4d | — |
| M7.7 | Published outcome data for regulatory defence (needs scale) | 🟢 V2+ | MET | R4d | — |
| M7.8 | Judicial relationship-building (reform-minded judges) | 🔵 ONGOING | COM | R4d | — |
| M7.9 | FCA positioning review (Open Banking boundary) | 🔴 BLOCKER | LEG | R4d | S1 |
| M7.10 | Consumer rights compliance review | 🔴 BLOCKER | LEG | R4d | S1 |

---

## 8. Cold-start data mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M8.1 | Principle: never show a range without sourced basis | 🔴 BLOCKER | DES | R4e | — |
| M8.2 | Phase 1: arithmetic only at launch | 🔴 BLOCKER | DES, ENG | R4e | E4.4 |
| M8.3 | Phase 2: published-source context (Resolution, Duxbury, CMS) | 🟡 V1.5 | DES, LEG | R4e | — |
| M8.4 | Academic partnerships (Exeter, Warwick, UCL family law researchers) | 🟢 V2+ | COM | R4e | — |
| M8.5 | Anonymised outcome data pipeline (once at scale) | 🟢 V2+ | ENG, LEG | R4e | — |
| M8.6 | Methodology transparency when ranges are shown | 🟡 V1.5 | DES | R4e | E4.4 |

---

## 9. Accessibility and literacy mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M9.1 | Plain language principle — every legal term explained inline | 🔴 BLOCKER | DES | R4f | All screens |
| M9.2 | Contextual education (at point of need, not glossary pages) | 🟠 MVP | DES | R4f | — |
| M9.3 | "What does this mean for me?" plain-language translation per number | 🟠 MVP | DES | R4f | — |
| M9.4 | Progress saving at every step (stop and resume) | 🟠 MVP | ENG | R4f, R4g | — |
| M9.5 | WCAG 2.1 AA compliance | 🔴 BLOCKER | DES, ENG | R4f | All |
| M9.6 | Colour never the only indicator (icon + text always accompany) | 🔴 BLOCKER | DES | R4f | All |
| M9.7 | Keyboard navigation for all interactive elements | 🔴 BLOCKER | ENG | R4f | All |
| M9.8 | Screen reader compatibility (document view tested) | 🔴 BLOCKER | ENG | R4f | All |
| M9.9 | Large text / high contrast mode toggle | 🟠 MVP | DES, ENG | R4f | — |
| M9.10 | Phone / chat support for technical help (not advice) | 🟡 V1.5 | OPS | R4f | — |
| M9.11 | Welsh language support (Welsh courts requirement) | 🟢 V2+ | DES, ENG | R4f | E2.17 |
| M9.12 | Multi-language strategy (demand-driven) | 🟢 V2+ | DES, ENG | R4f | — |
| M9.13 | Usability testing with non-technical, stressed users in prototype phase | 🔴 BLOCKER | DES, OPS | R4f | — |

---

## 10. Long-running reliability mitigations

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M10.1 | Server-side state (Supabase) — no reliance on localStorage | 🔴 BLOCKER | ENG | R4g | — |
| M10.2 | Every action persisted immediately (no batched saves) | 🔴 BLOCKER | ENG | R4g | — |
| M10.3 | Staleness indicators per item ("as of [date]") | 🟡 V1.5 | DES, ENG | R4g | — |
| M10.4 | "Update your picture" flow on return after gap | 🟡 V1.5 | DES, ENG | R4g | — |
| M10.5 | Cross-device state sync (Supabase auth + state) | 🟠 MVP | ENG | R4g | — |
| M10.6 | Concurrent editing conflict resolution (optimistic locking) | 🟡 V1.5 | ENG | R4g | — |
| M10.7 | Notification cadence design (tiered frequency, user-adjustable) | 🟠 MVP | DES, ENG | R4g | — |
| M10.8 | External dependency monitoring (Tink, Experian, MyHMCTS) | 🟡 V1.5 | ENG, OPS | R4g | — |
| M10.9 | Graceful degradation on third-party failure | 🟡 V1.5 | ENG | R4g | — |
| M10.10 | Orphan cleanup policy (6 months inactive → purge) | 🟠 MVP | OPS, ENG | R4g | — |
| M10.11 | Idempotent operations (safe retries) | 🔴 BLOCKER | ENG | R4g | — |
| M10.12 | Session resumption with context (where did I leave off?) | 🟠 MVP | DES, ENG | R4g | — |

---

## 11. Second-party adoption mitigations (the most important)

| # | Item | Priority | Category | Linked risk | Linked epic |
|---|------|----------|----------|-------------|-------------|
| M11.1 | Neutral invitation framing ("our household document") | 🔴 BLOCKER | DES | R4h | E3.1 |
| M11.2 | Equal status architecture (not "her workspace, he joined") | 🔴 BLOCKER | ENG, DES | R4h | E3 family |
| M11.3 | Standalone value for invited party (review without full build) | 🟠 MVP | DES | R4h | E3.3 |
| M11.4 | Friction-free entry (30-sec magic link, no password) | 🟠 MVP | ENG, DES | R4h | E3.1 |
| M11.5 | Value-before-contribution (show Sarah's disclosure immediately) | 🟠 MVP | DES | R4h | E3.2 |
| M11.6 | Evidence-based "fairness" messaging to invitee | 🟠 MVP | DES | R4h | E3.1 |
| M11.7 | Solicitor-friendly guest invitation option | 🟡 V1.5 | ENG, DES | R4h, R4c | C3 |
| M11.8 | Second-party join rate tracking (weekly dashboard metric) | 🔴 BLOCKER | MET | R4h | S5 |
| M11.9 | Invitation A/B testing infrastructure | 🟠 MVP | ENG, MET | R4h | — |
| M11.10 | Follow-up/nudge cadence when invite unopened | 🟠 MVP | DES, ENG | R4h | E3.8 |
| M11.11 | Graceful solo mode (product still useful if invitee never joins) | 🟠 MVP | DES | R4h | E3.8 |

---

## Summary by priority

| Priority | Count | Scope |
|---|---|---|
| 🔴 BLOCKER | 28 | Cannot launch without these |
| 🟠 MVP | 49 | V1 launch (Q4 2026) |
| 🟡 V1.5 | 22 | Near-term post-launch (Q1 2027) |
| 🟢 V2+ | 14 | Mid-longer term |
| 🔵 ONGOING | 4 | Continuous discipline |

**Total mitigations: 117**

## The 28 launch blockers — critical path

Grouped for visibility:

### Legal and regulatory (must happen early — long lead time)
- M2.2, M2.4: Legal review of system context + copy
- M3.1, M3.11, M3.12: Template commissioning, PI insurance, disclaimer model
- M4.7: DPIA (GDPR requirement)
- M7.1, M7.2, M7.9, M7.10: SRA engagement, counsel retained, FCA + consumer rights review
- M8.1, M8.2: Arithmetic-only launch principle

### Security foundations
- M4.1, M4.2, M4.3, M4.5, M4.10: Encryption, segregation, pentesting, cyber insurance

### Accessibility and human-fit
- M9.1, M9.5, M9.6, M9.7, M9.8, M9.13: Plain language, WCAG, usability testing

### Engineering architecture
- M10.1, M10.2, M10.11: Server state, idempotent operations

### Partnerships
- M3.5 (Tier 2 default), M6.7 (law firm partnerships)

### Design critical
- M11.1, M11.2: Neutral framing, equal status architecture
- M3.5: Launch Tier 2 default

### Metric
- M11.8: Second-party join rate tracking infrastructure

---

## How this connects to the epics map (spec 53)

Many mitigations map directly to existing epics. Others surface new work that should be added to the epics map or integrated into existing epics:

| Mitigation cluster | Existing epic | New epic needed? |
|---|---|---|
| Evidence collection | E2 family | No — enhance existing |
| AI guidance | E4.4, E4.11 | Partially — see below |
| Document generation | E5 family | Yes — E5.2 (template library) needs dedicated spec |
| Data security | S4 (stub) | Yes — S4 needs dedicated spec |
| Adversarial use | E7 family | No — specs 47 cover it |
| Handoff | C3 (cross-cutting) | Partially — needs handoff-specific design |
| Regulatory | S1 (stub) | Yes — S1 is critical and undersigned |
| Cold-start | E4.4 | No — integrate into existing |
| Accessibility | (not currently) | Yes — new cross-cutting epic needed |
| Long-running reliability | (partially C4) | No — engineering discipline, not epic |
| Second-party adoption | E3.1 | No — but needs metric tracking surfaced |

### New/expanded epics implied by this roadmap

- **S1 Legal & Regulatory** — upgrade from stub to full spec (highest priority)
- **S4 Account, Data & Access** — upgrade from stub (security-critical)
- **S5 Success Metrics** — upgrade from stub (second-party join rate is critical)
- **S7 Adaptive Screens** — non-engagement, coercive control screen designs
- **New: Accessibility epic** — dedicated cross-cutting concern
- **New: Template Library epic** — E5.2 elevated to its own workstream
- **New: Professional Partnerships epic** — law firms, PI insurance, Resolution

---

## Next step

The 28 blockers form the critical path to launch. Before any code is written:

1. **Stub S1 filled (legal counsel engaged)** — unlocks 10 of 28 blockers
2. **Security foundations designed** — 5 blockers
3. **Design principles locked** (plain language, equal status, arithmetic-only) — 6 blockers
4. **Partnerships initiated** (law firm, Tier 2 reviewer, PI insurance quotes) — 4 blockers
5. **Engineering architecture decisions** (server state, idempotent ops) — 2 blockers
6. **Metrics infrastructure** (second-party join rate) — 1 blocker

Parallel to prototyping. Legal counsel engagement can happen in weeks 1-2 of the prototype phase.
