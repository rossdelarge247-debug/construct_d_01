# Spec 70 — Build Map · Phase 2 · Build

**Parent:** spec 70 (hub) · **Phase spec:** 68b (Build phase locked)
**Scope:** Bank connection → first-time reveal → Sarah's Picture (§-numbered document) → per-section confirmation + editing → share action → handoff to Reconcile. Dashboard sits above Sarah's Picture, task-focused.

---

## Phase summary

**Purpose:** Take a freshly-oriented user from "my bank is connected" to "I have a complete, evidence-backed private picture of my finances, children, housing, future needs — ready to share with Mark." Do the 70% of work automatically; user confirms the rest.

**Entry gate:** Moment 2 pre-bank profiling complete → bank connection flow fires.
**Exit gate:** User presses Share → modal confirms → Our Household Picture is created → Reconcile phase unlocks.
**Document in play:** **Sarah's Picture** — private document, §-numbered, last-updated stamp + per-section history log (no version chip per 68b B-V1).

---

## Components by tag

### Anchor — new, extract from Claude AI Design outputs

| Component | Design ref | Notes |
|---|---|---|
| Sarah's Picture document shell | 68b B-D1..D4 · Claude AI Design wires | Three-column: left rail journey map + chapter TOC / middle §-numbered prose body / right rail stacked panels. Renders as document, not dashboard. |
| Left rail journey map (in-doc variant) | 68a C-N1 (amended) · 68g C-N5 · Claude AI Design wires | 5-phase always-visible; current phase expands to doc TOC; locked phases dimmed with unlock hint |
| Snapshot right-rail panel | 68b B-D4 · 68b B-M1/M2 · Claude AI Design wires | Net position / Assets / Debts / Monthly gap |
| Data sources right-rail panel | 68b B-D4 · 68g C-V9 · Claude AI Design wires | Connected institutions with freshness timestamps + pending states |
| Needs-your-attention right-rail panel | 68b B-D4 · 68b B-T3 | Filtered view of global to-do, scoped to current doc |
| Connected-data-source card (collapsed + expanded) | 68g C-V9 · Claude AI Design dashboard | Sits in Data sources panel + dashboard post-connection state |
| Per-section §-numbered header with completion icon | 68b B-D2 · 68b B-E3 | ✓ / ! / • / ○ icons; clickable history affordance |
| Per-section inline controls | 68b B-E2 | Edit / Upload evidence / Delete + section-specific extensions |
| Trust chip (colour + source label) | 68a C-T1/T2 · 68g C-V7 | 6-level taxonomy; amber Estimated + green Barclays Bank patterns locked 68f C-T1 |
| Provenance-first intro copy pattern | 68b B-D5 | "A structured record of what you own, owe, earn and spend, as of {DATE}. Based on {N} transactions..." |
| Confirmation Q&A pattern (confirm-or-correct) | 68b B-E2 · spec 22 · G7-4 pattern mirror | Ask-don't-assume per bank signal |
| Share-with-Mark CTA (adaptive) | 68a C-S1 · 68b B-S1 · 68g C-S6 | Pre-share / Shared / Share-update / in-flight / error states |
| Share modal (multi-step) | 68a C-S1..C-S3 · 68g C-S5 | Step 1 Who (party type + fields per C-S1a/b) · Step 2 What (selective publish per C-S5) · Step 3 Confirmation |
| Post-share unlock banner | 68g B-8 | One-time dismissable acknowledgement; links to newly-unlocked Reconcile |
| Dashboard — workspace home | 68b B-T1 · 68f B-3 (locked-for-shape) · Claude AI Design dashboard wires | Sits above Sarah's Picture; task-focused |
| Dashboard 5-phase horizontal stepper | 68g C-V6 · Claude AI Design dashboard | Mirrors in-doc journey map, different render |
| Dashboard phase-grouped sections | 68g B-12 · Claude AI Design dashboard | 5 phases in stepper → 3 workbands in body (Preparation / Disclosure & reconcile / Settle & finalise) |
| Task row component | 68g C-V8 · Claude AI Design dashboard | Taxonomy chip + label + status CTA (Done / Outline now / Upload now / Locked) |
| Task taxonomy chip system | 68g C-V7 · Claude AI Design dashboard | Evidence (blue) / Practical (pink) / Legal (lavender); category audit open at 68g B-11 |
| Bank picker grid | 68g C-V10 · Claude AI Design first-time dashboard | 2×4 bank cards + search + manual-entry fallback |
| Locked-section inline treatment | 68g C-V12 · Claude AI Design dashboard | 🔒 LOCKED + unlock hint + dimmed children |
| Phase accent-tint card washes | 68g C-V13 | Ties to C-V1 phase colour system |
| Time-estimate affordance | 68g C-V14 · Claude AI Design first-time dashboard | "Est. time ~60s" |

### Derived — variant of a Phase 2 Anchor

| Component | Derived from | Living in |
|---|---|---|
| Our Household Picture document shell | Sarah's Picture document shell | Phase 3 Reconcile |
| Settlement Proposal document shell | Sarah's Picture document shell | Phase 4 Settle |
| Respondent IS1 confirm-or-correct | Confirmation Q&A pattern | Phase 1 Start (respondent variant) |

### Variant — state variation

| Component | States |
|---|---|
| Dashboard | First-time-zero / first-time-return post-connection / mid-phase with tasks / phase-complete / with-locked-future (68g B-13 state machine open) |
| Sarah's Picture | First-visit (bank panel expanded in middle column — 68g B-6) · Return (bank panel collapsed / moved to right-rail Data sources) |
| Trust chip | Self-declared amber · Bank-evidenced green · Document-evidenced · Credit-verified · Both-party-agreed · Court-sealed (C-T2 taxonomy; visuals per C-T1 lock) |
| Per-section empty state | Never-touched ("Nothing added yet" + "Tell us about…" CTA per 68g C-U5) · Partial · Complete |

### Re-use — preserved legacy, unchanged

| Library | Purpose in Phase 2 |
|---|---|
| `src/lib/bank/tink-client.ts` | Bank connection auth |
| `src/app/api/bank/connect/route.ts` + `callback/route.ts` | Tink flow |
| `src/lib/bank/tink-transformer.ts` | Payload → BankStatementExtraction |
| `src/lib/bank/bank-data-utils.ts` | Extraction → UI types, transaction search |
| `src/lib/bank/signal-rules/` (17 rules) | Surface as tasks in new taxonomy (Preserve-with-reskin — see below) |
| `src/lib/ai/extraction-schemas.ts` | Facts-only structured outputs |
| `src/lib/ai/result-transformer.ts` | Decision trees + keyword lookup |
| `src/lib/bank/test-scenarios.ts` | Dev scenarios for Build phase work |

### Preserve-with-reskin — legacy logic, new UI

| Logic | Source | New UI |
|---|---|---|
| Per-section confirmation question generation | `src/lib/bank/confirmation-questions.ts` · spec 22 decision trees | New confirmation Q&A Anchor (per-section inline, not modal) |
| Spending categorisation + keyword lookup | `src/lib/ai/result-transformer.ts` · spec 13 + 19 | New Outgoings section UI with trust chip upgrade (Estimated → Barclays Bank pattern) |
| Signal rules → task surfacing | 17 rules from session 18 | New Task row + taxonomy chip (C-V7, C-V8); taxonomy category audit at 68g B-11 |
| Large payment detection (spec 31) | Existing logic | Surfaces into Needs-your-attention right rail + task list |

### Known-unknown — parked, linked to 68f/g

| Open | Ref | Blocks |
|---|---|---|
| Per-section control set per section type | 68f B-1 | Build detail spec before Phase C |
| Exact ES2 section list + conditional sections | 68f B-4 | Document structure lock |
| Solicitor + mediator modal field sets | 68f C-S1b | Share modal anchor completeness |
| Selective publish step in share modal | 68g C-S5 | Share modal anchor completeness |
| Share CTA adaptive-state visual rendering | 68g C-S6 | Build anchor completeness |
| 50:50 default split assumption | 68g B-5 | Build detail spec |
| Post-bank-connection bank panel placement | 68g B-6 | Build anchor design |
| Sidebar completion state derivation | 68g B-7 | Implementation-level, tracked only |
| Post-share unlock banner pattern | 68g B-8 | Lock during Build anchor design |
| Section totals rendering | 68g B-9 | Build detail spec |
| Task taxonomy category completeness | 68g B-11 | Before Build Map finalises |
| Dashboard phase grouping rationale | 68g B-12 | Dashboard spec |
| Dashboard state machine | 68g B-13 | Dashboard detail spec |
| User-added tasks V1/V1.5 | 68g B-14 | Lock during Build Map |
| Trust chip visual treatment detail | 68g C-T1 (now locked in pattern; per-level visual detail open) | Phase C anchor extraction |
| Disclosure-language audit | 68g C-U4 | Before Phase C anchor extraction |
| Empty-state CTA verb family | 68g C-U5 | Part of C-U4 audit |
| To-do snooze | 68f B-2 (deferred V1.5) | Backlog only |

---

## Data model

### Types needed (new or extended)

| Type | Purpose | Source |
|---|---|---|
| `SarahsPicture` | Document instance with §-ordered sections | spec 44 (amended), 68b |
| `DocumentSection` | §-numbered section with header, body, controls, history | 68b B-D3, B-E3 |
| `HouseholdItem` | Per-item metadata (value, trust level, ownership, status) | spec 35, 44, 68a C-T2 |
| `TrustLevel` | 6-level enum (self-declared / bank-evidenced / credit-verified / document-evidenced / both-party-agreed / court-sealed) | 68a C-T2 |
| `Task` | Task row data (taxonomy chip, label, status, CTA) | 68g C-V7/V8 |
| `TaskTaxonomy` | Evidence / Practical / Legal + any additions from B-11 audit | 68g B-11 |
| `SnapshotMetrics` | Net position / Assets / Debts / Monthly gap | 68b B-M1/M2 |
| `DataSourceConnection` | Bank + account list + freshness timestamp + pending states | 68b B-D4, 68g C-V9 |
| `ShareIntent` | Party type + fields + selective-publish section list + adaptive CTA state | 68a C-S1..S3, 68g C-S5/S6 |
| `SectionChangeLogEntry` | Who / when / what-changed (edit, upload, delete, auto-override) | 68b B-E3 |

### Types re-used

- `BankStatementExtraction` (from `src/lib/bank/tink-transformer.ts`)
- Engine rule types from `src/lib/bank/signal-rules/`
- AI extraction schema types from `src/lib/ai/extraction-schemas.ts`

---

## Engine dependencies

| Dependency | Status |
|---|---|
| Bank connection (Tink Link + callback) | Re-use |
| Transaction categorisation (spec 13 trees + spec 19 keywords) | Re-use |
| Signal rules (17 rules from session 18) | Re-use, surface logic updated for taxonomy chips |
| Confirmation question generation (spec 22 decision tree) | Preserve-with-reskin (logic kept, UI rebuilds) |
| Large payment detection (spec 31) | Re-use |
| Trust level derivation (per-item, based on evidence type) | **New** — rules spec needed per 68a C-T2 taxonomy |
| Task state machine (new task / done / snoozed / dismissed / auto-updated) | **New** — spec needed |
| Adaptive share CTA state machine | **New** — per 68a C-S1 states |

---

## Slice membership

*Populated after slice index exists. Expected slices touching Phase 2:*
- Bank-connection slice (entry from Phase 1 → picker grid → Tink → reveal)
- Per-section confirmation slice (signals → Q&A → trust uplift)
- Spending categorisation slice (estimates → bank-evidenced)
- Sarah's Picture document slice (render + edit-in-place + history log)
- Dashboard slice (task taxonomy + 5-phase stepper + state transitions)
- Share slice (CTA → multi-step modal → Our Household Picture creation → Reconcile unlock)
- Evidence upload slice (document upload → trust uplift)

---

## Open dependencies — full 68f/g link list

All open entries from 68f Build + 68g B-\* + C-V\* + C-S\* + C-U4-6 listed under Known-unknowns above. No additional dependencies in 68a-e beyond what's pulled into the table.

**Legacy specs consulted:**
- spec 13 (extraction decision trees)
- spec 19 (intelligent categorisation)
- spec 20 (bank-first journey)
- spec 22 (confirmation flow tree — Preserve-with-reskin source)
- spec 23 (post-confirm gap summary)
- spec 30-32 (signal engine + large payment + engine audit)
- spec 44 (document-as-spine, amended session 22)
- spec 67 (profiling distribution — gaps 1-12 resolved)
