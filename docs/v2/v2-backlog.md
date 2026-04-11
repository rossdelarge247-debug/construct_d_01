# V2 Feature Backlog — Complete Inventory

**Date:** 10 April 2026
**Purpose:** Single source of truth for everything V2 needs, beyond the build specs. Items are categorised by status: specced and ready to build, designed but not specced, identified but not designed, and future enhancements.

---

## 1. Specced and ready to build

These have design specs, decision trees, and/or wireframes. The build sequence is defined in `v2-design-pivot.md`.

| # | Feature | Spec | Notes |
|---|---------|------|-------|
| 1 | Hub page shell (layout, visual tokens) | 17, 18 | Single page, hero panel + section cards, off-white/white |
| 2 | Discovery/configuration dialogue | 15 | 4 core screens, inline progressive disclosure, personalised output |
| 3 | Hero panel: upload state | 16 | Drag-and-drop zone, evidence lozenges, file handling |
| 4 | Hero panel: processing states (2a–2c) | 16 | Classification, contextual messaging, lozenge spinners/ticks |
| 5 | Hero panel: ready for review (2d) | 16 | Decision point — review or upload more |
| 6 | Hero panel: auto-confirm (3a) | 16, 13 | Batch accept of high-confidence items with checkboxes |
| 7 | Hero panel: clarification Q&A (3b–3n) | 16, 13 | One question per screen, reasoning shown, decision trees drive questions |
| 8 | Hero panel: summary (4) | 16 | Achievements framed as capabilities, todo list, continue/finish |
| 9 | Section cards (all states) | 17 | Empty, estimate, partial evidence, fully evidenced, faded |
| 10 | Evidence lozenges (tri-state + flyout) | 16 | Empty → spinner → tick, chevron expands to show document list |
| 11 | Fidelity system | 17 | Labels: not ready → mediation ready → disclosure ready → complete |
| 12 | "Share & collaborate" CTA unlock | 17 | Appears in title bar at Draft fidelity |
| 13 | Hamburger nav + left panel (shell) | Pivot doc | Empty until full IA validated |
| 14 | Visual design system (tokens, components) | 18 | Colour, typography, spacing, all components defined |
| 15 | Bank statement extraction | 13 | Income detection, spending categories, account structure, gaps |
| 16 | Payslip extraction | 13 | Structured fields, cross-document validation with bank |
| 17 | Mortgage statement extraction | 13 | Balance, rate, payment, term, ERC |
| 18 | Pension CETV letter extraction | 13 | CETV value, DB/DC detection, education triggers |
| 19 | Savings/investment extraction | 13 | Balance, type, ownership |
| 20 | Credit card statement extraction | 13 | Balance, limit, rate, ownership |
| 21 | P60/SA302 extraction | 13 | Annual income validation, self-employment profit |
| 22 | Property wizard (manual input) | 14 | Per-property flow with equity calculation |
| 23 | Pensions wizard (manual input) | 14 | CETV education, request guidance, provider timelines |
| 24 | Debts wizard (manual input) | 14 | Per-debt flow |
| 25 | Other assets wizard (manual input) | 14 | Vehicles, crypto, valuables, life insurance, overseas |
| 26 | Business/self-employment wizard | 14 | Structure, DLA, valuation guidance |
| 27 | Spending review (AI categories or manual) | 14 | Category totals confirmation, or from-scratch estimates |
| 28 | "Manually input" on every section card | 17 | Bypass upload, enter data directly |
| 29 | "+ More to disclose" | 17 | Add sections missed in config |
| 30 | 70% section fade during hero panel activity | 16, 18 | Opacity transition, attention management |
| 31 | Progress bar (config + Q&A) | 15, 16 | Segmented stepper showing position in flow |
| 32 | Processing animation (non-sparkle) | 18 | Clean pulse/shimmer, contextual text, not whimsical |

---

## 2. Designed / discussed but not yet specced in detail

These have been discussed, are in the research or wireframes, but need deeper specification before building.

| # | Feature | Where discussed | What's needed |
|---|---------|----------------|---------------|
| 33 | Section card "Review details" flow | 17 (mentioned) | Full spec of what happens when user clicks into a section to review/edit confirmed items. Separate from initial Q&A — this is revisiting previously confirmed data. |
| 34 | Return visit experience | 15, 16, 17 (described) | Detailed wireframes for: returning user lands on hub, hero panel shows "still to upload", section cards show cumulative data. Edge cases: what if config needs updating? |
| 35 | Estimate supersession | Discussion | When evidence replaces an estimate, how is this communicated? Inline notification? Value updates with "(was: £3,200 estimated)" context? |
| 36 | Multi-document upload (mixed types) | 16 (described) | Detailed flow for: user drops bank statements + payslip + mortgage statement simultaneously. Classification routing, Q&A ordering across document types. |
| 37 | Statement completeness tracking | 13 (table), 16 (summary) | Per-account tracking of months provided (3 of 12). UI for prompting more months. Integration with fidelity system. |
| 38 | Side-by-side PDF review modal | Research implications (P1) | The Dext pattern: PDF viewer left, extracted data right, inline editing. Spec 09 has the concept but needs updating for new architecture. Requires document storage. |
| 39 | CETV request tracking (enhanced) | 14, research | Provider-specific guidance, chase reminders at 6/13/26 weeks, McCloud delay warnings, PD1/PD2/PD3 form dates. The existing CETV tracker component is a starting point. |
| 40 | Pension education moments | 14, research | Point-of-need education: "What is a CETV?", DB vs DC, income vs capital, PODE recommendation at £100k threshold, MoneyHelper appointment. Needs UX design for dosing. |
| 41 | State pension sub-section | 14, research | GOV.UK forecast link, "new State Pension can't be shared" education, DWP notification after divorce. |
| 42 | "Life after separation" section | 14, 17 | Standard of living narrative (Part 4) + income needs (Part 3). Gated until Draft fidelity. Guided prompts for holidays, housing, schools, lifestyle. |
| 43 | Children section ("Begin plan") | 17 (CTA shown) | Separated from financial sections. Arrangements, residence, contact. Optional depth (week planner, holidays, birthdays). Feeds V3/V4. |
| 44 | Info box (fidelity milestone messaging) | Wireframe screen 5 | Advisory message when fidelity threshold reached: "enough for first mediation", "recommend continuing to upload." Design and triggering logic. |

---

## 3. Identified in research but not yet designed

These emerged from the V2 desk research as important but have no wireframes or specs yet.

### AI pipeline enhancements

| # | Feature | Research source | Priority | Notes |
|---|---------|----------------|----------|-------|
| 45 | Anthropic structured outputs | Research implications P0 | High | Replace truncated-JSON-repair with schema-constrained generation. Eliminates the most fragile part of the current pipeline. |
| 46 | Two-step extraction (Haiku reads → Sonnet analyses) | Research implications P0 | High | Haiku extracts text from PDF via `type: 'document'`, Sonnet analyses with structured outputs. Resolves shallow extraction and hallucination. |
| 47 | Document-type-specific AI prompts | Research implications P0, spec 13 | High | After classification, route to tailored prompts per document type. Spec 13 defines what to extract; prompts need implementing. |
| 48 | Confidence threshold adjustment | Research implications P1 | High | Raise from auto ≥0.9/confirm 0.7 to auto ≥0.95/confirm 0.80. More items route through confirmation — correct for financial disclosure. |
| 49 | Cross-document intelligence | Research implications P2, spec 13 | Medium | Income matching (payslip ↔ bank deposits), payment verification (mortgage statement ↔ bank standing order), discrepancy flagging. |
| 50 | Data combination logic | Research implications, HANDOFF P0 | High | Multiple salary credits → one "Employment income" line. Transaction grouping into clean financial items. Monthly averages for spending categories. |

### Data model enhancements

| # | Feature | Research source | Priority | Notes |
|---|---------|----------------|----------|-------|
| 51 | Inheritance/pre-marital asset tracking | Research (Standish v Standish [2025]) | Medium | Per-item: when acquired, kept separate?, value changed? Feeds Part 4 narrative and V4 negotiation. |
| 52 | "As at" dates on all values | Vertical assessment principle 16 | Medium | Every financial item has a valuation date. System flags stale data (>3–6 months old). |
| 53 | Disputed values (yours vs partner's) | Vertical assessment principle 22 | Low (V4 dependency) | Data model supports two values per item. Not needed until collaboration phase. |
| 54 | Document versioning | Vertical assessment principle 17 | Low | Newer documents supersede older ones, history preserved. Not critical for V2 launch. |

### Commonly omitted item prompts

| # | Feature | Research source | Priority | Notes |
|---|---------|----------------|----------|-------|
| 55 | Director's loan account prompt | Research (most commonly omitted Form E item) | High | After business category: "Do you have a director's loan account?" |
| 56 | App-based accounts prompt | Research (frequently forgotten) | High | After bank accounts: "Do you have Monzo, Revolut, Starling, etc.?" |
| 57 | Closed accounts prompt | Research (Form E requires last 12 months) | Medium | "Have you closed any accounts in the last 12 months?" |
| 58 | Crypto/digital assets prompt | Research (Form E gap) | High | Explicit prompt where official form doesn't ask. Already in config flow. |
| 59 | State pension prompt | Research (widely unknown implications) | Medium | "Have you checked your State Pension forecast?" Already in wizard spec 14. |

### Export and output

| # | Feature | Research source | Priority | Notes |
|---|---------|----------------|----------|-------|
| 60 | Structured summary export (all fidelity levels) | Research implications, pivot doc | High | Plain language summary at Sketch/Draft level. Gaps clearly marked. Shareable with mediator/solicitor. |
| 61 | Form E equivalent export | Research (Express Pilot, digital submission) | Medium | Maps confirmed data to Form E sections. Court-ready PDF. Evidenced fidelity required. |
| 62 | D81 data export | Research (23-page new D81, Section 10) | Low (V3/V5) | V2 data feeds D81 but D81 is generated after agreement. Not V2 scope. |
| 63 | NFM Open Financial Statement format | Research (accepted for mediation) | Low | Alternative export format for mediation pathway. Same data, different presentation. |
| 64 | Document bundle for disclosure | Research (Form E requires supporting docs) | Low | List of all uploaded documents with labels, organised by Form E section. |

---

## 4. Infrastructure and technical

| # | Feature | Source | Priority | Notes |
|---|---------|--------|----------|-------|
| 65 | Supabase persistence (replace localStorage) | HANDOFF, pivot doc | High | Workspace state must persist server-side. Requires auth upgrade (anonymous → authenticated). |
| 66 | Document storage (Supabase Storage) | HANDOFF | High | Uploaded PDFs need persisting for later review, side-by-side modal, and disclosure bundle. Currently not stored. |
| 67 | Auth upgrade (anonymous → authenticated) | Sprint 0 decisions | High | Magic link + Google. Required for Supabase persistence and cross-device access. |
| 68 | V1 data import / wiring | HANDOFF, config flow | Medium | V1 Gentle Interview data flows into config replay and pre-populates estimates. Currently no cross-session persistence. |
| 69 | Structured outputs integration | Research | High | Anthropic structured outputs (November 2025) — schema-constrained JSON generation. Eliminates truncation. |
| 70 | Test suite | HANDOFF | Medium | Vitest + Testing Library installed, zero tests written. Core extraction logic and state management need tests. |
| 71 | PostHog analytics wiring | Sprint 0 decisions | Low | Event tracking for: first upload, extraction acceptance rate, fidelity progression, drop-off points. |
| 72 | Stripe billing integration | Sprint 0 decisions | Low (V1.5) | Paywall at workspace entry. Test mode only currently. |
| 73 | Error retry on AI failure | HANDOFF | Medium | Currently no retry — user sees error and must manually retry. Add automatic retry with backoff. |
| 74 | Streaming AI responses | HANDOFF | Low | Progressive reveal of results during processing. Nice-to-have, not critical. |

---

## 5. Future enhancements (post V2 launch)

| # | Feature | Source | Notes |
|---|---------|--------|-------|
| 75 | Open Banking integration (Armalytix or TrueLayer) | Research | Replace PDF upload with structured bank data. Requires FCA authorisation or regulated partner. |
| 76 | Pension Dashboard integration | Research | Public launch late 2026/early 2027. No public API planned yet. Monitor. |
| 77 | Post-separation budget projection | Vertical assessment | AI-guided budget building from captured spending data. Prompted at Draft fidelity. |
| 78 | Maintenance intelligence (CMS estimates) | Vertical assessment | Child Maintenance Service calculator estimates from income data. Spousal maintenance flags from income disparity. |
| 79 | Inconsistency detection | Vertical assessment | AI flags mismatches across documents (income vs deposits, outgoings vs income, duplicates). |
| 80 | Async document processing | Vertical assessment | Upload in bulk, leave, come back. Notifications when extraction complete. |
| 81 | Children detail path (full) | Vertical assessment | Week planner, holiday schedule, birthday tracking, special occasions. |
| 82 | Safeguarding continuity | V1 research, vertical assessment | Soft check-ins from V1 flags. Adjust workspace behaviour for coercive control indicators. |
| 83 | "Something wrong?" correction flow | HANDOFF, spec 10b | Make auto-confirmed items list editable when user clicks "Correct an item." |
| 84 | Celebration patterns | HANDOFF, spec 09 | Green flash, count-up on category cards, toast on confirmation. |
| 85 | Bulk document upload with consolidated review | V2 concept | "Got multiple documents? Drop them all here." Classify all, then consolidated review across categories. |
| 86 | Property valuation integration (Zoopla/Rightmove API) | Vertical assessment | Automated property value estimate. |
| 87 | Pension tracing service integration | Research | Help users find forgotten pensions from old employers. |
| 88 | Dark mode | Spec 18 | Palette designed to support it. Implementation deferred. |

---

## 6. Phase 2 and 3 features (Resolve + Formalise)

Not V2 scope but captured for completeness. These depend on V2 data.

| # | Feature | Phase | Notes |
|---|---------|-------|-------|
| 89 | Receive/view other party's disclosure | Resolve | Their Form E or equivalent. Comparison view. |
| 90 | Side-by-side position comparison | Resolve | Your values vs theirs, agreements vs disputes. |
| 91 | Proposals and counter-proposals | Resolve | Track what's been proposed, accepted, rejected. |
| 92 | Resolution Together workflow support | Resolve | One lawyer, two clients model. |
| 93 | Pension offsetting risk surfacing | Resolve | "Keep the house, give up pension" risk education. |
| 94 | Mediation session tracking | Resolve | Sessions, outcomes, action items. |
| 95 | Consent order generation | Formalise | From agreed terms. |
| 96 | D81 generation | Formalise | From both parties' data + agreed settlement. Section 10 guidance. |
| 97 | MyHMCTS submission tracking | Formalise | Court processing timeline (6–10 weeks). |
| 98 | Post-order actions | Formalise | PSO implementation, property transfer, DWP notification. |

---

## Summary counts

| Category | Count |
|----------|-------|
| Specced and ready to build | 32 |
| Designed/discussed, needs detailed spec | 12 |
| Identified in research, not yet designed | 20 |
| Infrastructure/technical | 10 |
| Future enhancements (post V2 launch) | 14 |
| Phase 2 and 3 (Resolve + Formalise) | 10 |
| **Total** | **98** |

Of these, the **build sequence** (items 1–32) is the immediate focus. Items 33–44 should be designed and specced as we build. Items 45–64 are enhancements that improve quality but aren't blockers for V2's core flow.
