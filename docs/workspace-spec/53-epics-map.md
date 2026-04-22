# Spec 53 — Epics Map

**Date:** 17 April 2026
**Status:** The full inventory. Every capability we've designed, grouped by job-to-be-done, mapped to lifecycle phase.
**Audience:** Roadmappers, developers, PMs, anyone planning the build.

---

## How to read this

Each epic has:
- **Name** — what to call this capability
- **Description** — 1-2 lines on what it does
- **Maturity** — where in the build lifecycle it sits
- **Status** — how complete the design is
- **Spec refs** — which specs describe it
- **Dependencies** — what must exist first

### Maturity scale
- **P** — Prototype (validate the hypothesis with users first)
- **MVP** — Minimum viable product (V1 launch)
- **V1.5** — Near-term post-launch (Q1 2027)
- **V2** — Mid-term (Q2-Q3 2027)
- **V3** — Long-term (2028+)

### Status
- ✓ **Designed** — spec is comprehensive, ready for build
- ⚠ **Partial** — spec exists but gaps remain
- ▢ **Stub** — placeholder, needs dedicated design work

---

## J1 — Help me understand what I'm dealing with

| Epic | Description | Maturity | Status | Spec | Depends |
|---|---|---|---|---|---|
| **E1.1 Arrival router** | Route users by stage: decided / thinking / in process / already agreed | MVP | ✓ | 48 | — |
| **E1.2 Wellbeing & safety check-in** | Brief emotional check, route to support if needed | MVP | ✓ | 45, 47 | — |
| **E1.3 Orientation / education module** | "What is divorce financially" — exploration mode | V1.5 | ⚠ | 48 | E1.1 |
| **E1.4 Interim arrangements module** | Urgent pre-settlement (mortgage now, kids this weekend) | V1.5 | ✓ | 48 | — |

---

## J2 — Build my financial picture

| Epic | Description | Maturity | Status | Spec | Depends |
|---|---|---|---|---|---|
| **E2.1 Profiling engine** | 6 questions with follow-ups, gates journey behaviour | MVP | ✓ | 34 | E1.1 |
| **E2.2 Bank connection (Open Banking)** | Tink integration, 12-month pull, auto-classification | MVP | ✓ | existing V2 | E2.1 |
| **E2.3 Signal detection engine** | 17 rules detecting income/property/pensions/debt patterns | MVP | ✓ | 30, 34 | E2.2 |
| **E2.4 Tier-based confirmation** | Matched (auto) / Expected (disambiguate) / Unknown (ask) | MVP | ✓ | 34, 45 | E2.3 |
| **E2.5 Spending review** | 6 Form E 3.1 categories, per-category walk-through | MVP | ✓ | existing V2 | E2.2 |
| **E2.6 Children section** | Count, ages, current arrangements, school/childcare | MVP | ✓ | 45, 48 | E2.1 |
| **E2.7 Housing section** | Current home, transition intent, future needs | MVP | ✓ | 45, 48 | — |
| **E2.8 Future needs section** | Post-separation budget, income projection, retirement | V1.5 | ⚠ | 45 | E2.5 |
| **E2.9 CSV/PDF upload fallback** | Alternative to Open Banking — document extraction | V1.5 | ⚠ | 49 | E2.2 |
| **E2.10 Manual entry path** | Self-declared path when bank connection refused | MVP | ✓ | 49 | — |
| **E2.11 Document evidence upload** | Attach supporting docs (statements, CETVs, valuations) | MVP | ✓ | 44 | E2.1 |
| **E2.12 Credit check verification** | Opt-in Experian/Equifax cross-reference | V1.5 | ⚠ | 49 | E2.2 |
| **E2.13 Property valuation integration** | Zoopla/Rightmove indicative values | V2 | ⚠ | 42 | E2.7 |
| **E2.14 CETV tracking** | Request-to-receipt tracking with provider nudges | V2 | ⚠ | 42 | — |
| **E2.15 Document generation (ES2 format)** | Produce the shareable financial picture document | MVP | ✓ | 44, 45 | E2.1-E2.11 |
| **E2.16 Complexity detection & routing** | Flag business/overseas/trusts for Tier 2/3 | V1.5 | ✓ | 48 | E2.1 |
| **E2.17 Jurisdictional adaptation** | Scotland/NI variants (different law, different docs) | V2 | ⚠ | 48 | E2.15 |
| **E2.18 Edit/view mode toggle** | App mode vs document mode of same underlying data | MVP | ✓ | 44, 45 | E2.15 |

---

## J3 — Share and align with my ex

| Epic | Description | Maturity | Status | Spec | Depends |
|---|---|---|---|---|---|
| **E3.1 Invitation & onboarding** | Email invite, Party B creates account, sees document | MVP | ✓ | 36, 45 | E2.15 |
| **E3.2 Party B's build journey** | Same V2 journey, contextualised as "your half" | MVP | ✓ | 36, 45 | E2.1-E2.18 |
| **E3.3 Reconciliation pass** | Party B reviews A's items (confirm / different / unknown) | MVP | ✓ | 36, 45 | E3.2 |
| **E3.4 Unified household document** | One list with ownership tags, status per item | MVP | ✓ | 35, 44 | E3.3 |
| **E3.5 Item-level discussion threads** | Juro-style comments attached to specific items | MVP | ✓ | 36, 45 | E3.4 |
| **E3.6 Version pipeline** | v0.x → v7.x immutable snapshots, diff views | V1.5 | ✓ | 44 | E3.4 |
| **E3.7 Progress board** | Persistent convergence tracker (agreed/contested/gaps) | MVP | ✓ | 36, 46 | E3.4 |
| **E3.8 Non-engagement handling** | 7/14/30 day escalation, solo-mode value | V1.5 | ✓ | 47 | E3.1 |
| **E3.9 Mediated collaboration mode** | Invite mediator as participant when stuck | V2 | ⚠ | 47, 49 | E3.4 |
| **E3.10 Parallel collaboration mode** | Arms-length mode for high-conflict cases | V2 | ⚠ | 47 | E3.9 |
| **E3.11 Timeline as evidence** | Activity trail formatted for court use | V2 | ⚠ | 47 | E3.6 |

---

## J4 — Negotiate a fair settlement

| Epic | Description | Maturity | Status | Spec | Depends |
|---|---|---|---|---|---|
| **E4.1 Private workspace** | Notes, draft positions, solicitor comments (private) | V1.5 | ✓ | 43, 46 | E3.1 |
| **E4.2 Fallback positions module** | Private preferred/fallback/walk-away per item | V1.5 | ✓ | 36 | E4.1 |
| **E4.3 Structured proposal builder** | Per-item proposals with reasoning | V1.5 | ✓ | 36, 46 | E3.4 |
| **E4.4 System context engine (playbook)** | Auto-generated arithmetic/range alongside each item | V1.5 | ✓ | 35, 36 | E4.3 |
| **E4.5 Children arrangements proposal** | Contact schedule, maintenance, school decisions, holidays | V1.5 | ✓ | 48 | E4.3 |
| **E4.6 Review-before-send** | Preview-what-ex-sees before committing | V1.5 | ✓ | 37, 46 | E4.3 |
| **E4.7 Redline counter-proposal model** | Accept/counter per item, diff-based | V1.5 | ✓ | 37, 46 | E4.3 |
| **E4.8 Convergence tracking** | Version-over-version gap narrowing visible | V1.5 | ✓ | 46 | E3.6 |
| **E4.9 Narrowing support** | System help when 1-2 items remain (split difference, etc.) | V2 | ✓ | 46 | E4.8 |
| **E4.10 Fallback-position nudge** | Private reminder when own fallback could close gap | V2 | ✓ | 46 | E4.2 |
| **E4.11 Fairness guardrails** | Flag extreme splits, recommend review | V2 | ⚠ | 46, 49 | E4.3 |
| **E4.12 Copilot response suggestions** | Private AI suggestions on received counter-proposals | V2 | ⚠ | 37 | E4.7 |

---

## J5 — Generate legally valid documents

| Epic | Description | Maturity | Status | Spec | Depends |
|---|---|---|---|---|---|
| **E5.1 Consent order generation** | Structured agreement → legal clauses from template library | V2 | ⚠ | 41, 46 | E4 |
| **E5.2 Legal template library** | Court-approved clause templates vetted by counsel | V2 | ▢ | — | — |
| **E5.3 D81 auto-population** | Full form + Section 10 from reasoning trail | V2 | ✓ | 41, 46 | E5.1 |
| **E5.4 Pension sharing annex (Form P)** | Generate per WRPA requirements when applicable | V2 | ⚠ | 41, 46 | E5.1 |
| **E5.5 Parenting plan / Statement of Arrangements** | Children arrangements as separate document if needed | V2 | ⚠ | 48 | E4.5 |
| **E5.6 MoU generation** | Mediation-style agreement for pre-consent-order use | V2 | ⚠ | 39 | E4 |
| **E5.7 Pre-flight quality check** | Validate against known rejection reasons before submit | V2 | ✓ | 41, 46 | E5.1 |
| **E5.8 Professional review marketplace** | On-demand solicitor review at fixed fee | V2 | ⚠ | 46, 49 | E5.1 |
| **E5.9 Court submission guidance** | Step-through for MyHMCTS upload | V2 | ✓ | 46 | E5.1 |
| **E5.10 Submission tracking** | 6-10 week processing status, judge query handling | V2 | ✓ | 46 | E5.9 |

---

## J6 — Implement what we agreed

| Epic | Description | Maturity | Status | Spec | Depends |
|---|---|---|---|---|---|
| **E6.1 Implementation checklist** | All agreed actions as tracked tasks | V2 | ✓ | 46 | E5.10 |
| **E6.2 Template letters library** | Pre-drafted communications to providers | V2 | ⚠ | 46 | E6.1 |
| **E6.3 Long-running task tracking** | Property sale, pension sharing (months) | V3 | ▢ | — | E6.1 |
| **E6.4 Payment tracking** | Monthly maintenance, CMS collection | V3 | ▢ | — | E6.1 |
| **E6.5 Records update guidance** | DVLA, HMRC, employer, pensions, insurance | V2 | ⚠ | 46 | E6.1 |

---

## J7 — Stay safe throughout

| Epic | Description | Maturity | Status | Spec | Depends |
|---|---|---|---|---|---|
| **E7.1 Entry safety screening** | Wellbeing + coercive control check at arrival | MVP | ✓ | 45, 47 | E1.2 |
| **E7.2 Ongoing coercive control detection** | 6 behavioural signal patterns monitored | V1.5 | ✓ | 47 | E3 |
| **E7.3 Layered safety response** | 3-level graduated response (prompt / nudge / intervention) | V1.5 | ✓ | 47 | E7.2 |
| **E7.4 Safety resources & escalation** | Women's Aid, Men's Advice Line, specialist services | MVP | ✓ | 47 | E1.2 |
| **E7.5 Account lockdown** | "Pause my account" locks document, revokes ex access | V1.5 | ⚠ | 47 | E3.1 |
| **E7.6 Safeguarded journey variant** | Adapted experience for coercive control indicators | V2 | ⚠ | 47 | E7.2 |

---

## Cross-cutting concerns

| Epic | Description | Maturity | Status | Spec | Depends |
|---|---|---|---|---|---|
| **C1 Commercial model** | Pricing, billing, revenue flows | MVP | ⚠ | 49 | — |
| **C2 Mobile experience** | Responsive design, mobile-first for 1-2 | MVP | ⚠ | 49 | — |
| **C3 Professional integration** | Mediator participant + solicitor reviewer flows | V2 | ⚠ | 49 | E3-E5 |
| **C4 Design system** | Tokens, components, visual direction | MVP | ✓ | 18, 27 | — |

---

## ⚠ STUB epics — 7 missing items flagged in pressure test

These are placeholder stubs. Each needs a dedicated spec before build.

| Epic | Description | Maturity | Status | Spec needed |
|---|---|---|---|---|
| **S1 Legal & regulatory design** | FCA, SRA, ICO positioning. Liability model. Professional indemnity. Disclaimers. | Blocks MVP | ▢ | **Critical — engage legal counsel** |
| **S2 Failure modes & error states** | Bank connection failures, Tink timeouts, unsupported banks, consent expiry, upload failures, credit check rejections | MVP | ▢ | **Needed before launch** |
| **S3 Post-agreement implementation depth** | Long-running tasks (property sale over months), payment tracking, ongoing compliance, partial completion | V2 | ▢ | **Needed for V2** |
| **S4 Account, data & access model** | Auth, password reset, 2FA, data deletion, retention policy, data export, post-sealing access | MVP | ▢ | **Needed before launch** |
| **S5 Success metrics framework** | What does success look like? Consent order approval rate, time to agreement, NPS, cost saved, case-type coverage | MVP | ▢ | **Needed for launch planning** |
| **S6 Discovery & go-to-market** | SEO, content strategy, Mumsnet presence, Law Society relations, partner networks, influencer strategy | Ongoing | ▢ | **Separate from product build** |
| **S7 Adaptive screen designs** | Specific screens for non-engagement escalation, coercive control response, mediated mode — currently pattern-only | V1.5 | ▢ | **Needed before V1.5** |

---

## Summary

**Total epics:** ~70 across 7 jobs + cross-cutting
**Status breakdown:**
- ✓ Designed: ~45 epics (ready to prototype or build)
- ⚠ Partial: ~18 epics (spec exists, gaps remain)
- ▢ Stub: 7 epics (placeholder, needs dedicated design)

**MVP epics:** ~25 — Phases 1-2 + basic Phase 3
**V1.5 epics:** ~20 — Full reconciliation + proposals
**V2 epics:** ~18 — Legal generation + implementation
**V3 epics:** ~5 — Long-running implementation, advanced features

**Next step:** Prototype validation of the MVP epics (especially E2.15, E2.18, E3.3, E4.3 — the hypothesis-critical ones) before committing to story-level detail.
