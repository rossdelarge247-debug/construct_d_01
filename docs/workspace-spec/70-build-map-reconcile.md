# Spec 70 — Build Map · Phase 3 · Reconcile

**Parent:** spec 70 (hub) · **Phase spec:** 68c (Reconcile phase locked)
**Scope:** Share action creates V1.0 of Our Household Picture → Mark builds his side → joint document emerges with conflicts surfaced → AI-ordered deliberation → all items resolved → Settle phase unlocks.

---

## Phase summary

**Purpose:** Two private pictures (Sarah's + Mark's) become one shared, reconciled household picture. Surface differences non-judgementally, provide tools to resolve each one, track Mark's engagement, preserve emotional pacing. The hardest phase to design because it's where most divorces turn conflictual.

**Entry gate:** Sarah presses Share from Build → Our Household Picture V1.0 created → Mark receives invite email → Mark completes Phase 1 (respondent variant) → Mark builds his side in Phase 2 Build variant → Our Household Picture V2.0 created on Mark's first share back.
**Exit gate:** All reconcile items resolved (status quad "Gap to address" = 0 and "Values differ" = 0) → Settle phase unlocks per 68c R-S1.
**Document in play:** **Our Household Picture** — joint document, V1.0 → V2.0 → Vx.y on re-shares → AGREED suffix on completion.

---

## Components by tag

### Anchor — new, extract from Claude AI Design outputs

| Component | Design ref | Notes |
|---|---|---|
| Our Household Picture document shell | 68c · Claude AI Design reconcile wires | Mirrors Sarah's Picture three-column shape (Derived, see below) |
| Status quad header | 68c R-Q1..Q4 · Claude AI Design reconcile V2 unified | Four buckets: Agreed by both / Values differ / New to you / Gap to address — filterable |
| Conflict card pattern | 68c R-C1..C4 · Claude AI Design contested-focus variant | Side-by-side values + provenance + delta + non-judgemental framing |
| Conflict card resolution actions | 68c R-C2 · 68f R-2 (UI detail open) | Discuss · AI midpoint · Zoopla (property) · Agree · Defer |
| AI deliberation queue right-rail panel | 68c R-A1..A3 · 68f R-4 (weights open) | Biggest-impact-first ordering |
| Resolve-all walkthrough wizard | 68c R-A5 · 68f R-5 (flow open) | Linear wizard affordance, one item at a time with "back to overview" |
| Discuss-this per-item thread | 68c R-C3 · 68f R-3 (mechanics open) | Async comments + quick-action chips |
| First-visit welcome banner | 68c R-W1..W2 | Dismissable emotional pacing; attention banner takes the slot post-dismiss |
| Mark status machine display | 68c R-M1..M5 · 68f R-6 (privacy open) | not-invited / invited-not-opened / opened-not-started / building-N-M / shared |
| Nudge / resend affordances | 68c R-M4 | On Mark status card in right rail |
| Activity log / recent activity right-rail panel | 68c R-AL1 | |
| AI coach cards (cross-phase base component) | 68a C-A1/A2 | Court reasonableness / Fairness check / Coaching / On-this-comment / Jump-to — shared Build/Reconcile/Settle/Finalise |
| Escape-hatch export CTA (ES2) | 68a C-E1..C-E4 · 68f C-E1 locked (5 rounds) | Surfaces after 5 stuck-reconciliation rounds |
| Joint-doc version chip (V1.0 / V2.0 / Vx.y / AGREED) | 68c R-V1..V3 | Top-of-document, legally-meaningful snapshots |
| Waiting-state screens (Mark not engaged) | 68c R-W3..W4 · 68f R-6 | Emotional-pacing copy + export CTA after 4 weeks (68f C-E1 locked) |

### Derived — variant of an Anchor in a different phase

| Component | Derived from | Notes |
|---|---|---|
| Our Household Picture document shell | Sarah's Picture document shell (Phase 2 Anchor) | Same three-column shape; middle column shows conflict cards inline per section; right rail morphs: Status quad / Deliberation queue / Activity log |
| Respondent variant pages (Phase 1 entry + Phase 2 build) | Phase 1 + Phase 2 Anchors, respectively | See 70-build-map-start.md and 70-build-map-build.md |

### Variant — state variation

| Component | States |
|---|---|
| Status quad bucket | Per section status: Agreed / Differ / New / Gap (with tolerance rules open at 68f R-1) |
| Mark status machine render | Five states (above) + derived states: overdue-invite · nudge-sent · resend-available |
| Conflict card | Pre-action · Discuss-open (inline expansion per 68f R-2 lean) · Modal-action (Zoopla, Agree) · Full-screen (AI midpoint walkthrough) · Resolved |
| Joint-doc version | DRAFT (Sarah's private initial) · SHARED (V1.0+) · AGREED (reconcile complete) |

### Re-use — preserved legacy, unchanged

| Library | Purpose in Phase 3 |
|---|---|
| `src/lib/bank/*` (full set) | Mark's own bank connection + transformation (his Phase 2 Build variant) |
| `src/lib/ai/extraction-schemas.ts` | Facts-only AI extraction applied to Mark's data |
| `src/lib/ai/result-transformer.ts` | Categorisation applied to Mark's data |

### Preserve-with-reskin — legacy logic, new UI

| Logic | Source | New UI |
|---|---|---|
| Per-item matching (Sarah item ↔ Mark item) | spec 35 HouseholdItem tier-based matching | New conflict card presentation |
| Joint-account recognition | spec 20 + spec 35 — sort code + account number match | Merge, don't duplicate; surface as single line with both parties' signals |

### Known-unknown — parked, linked to 68f

| Open | Ref | Blocks |
|---|---|---|
| Status quad tolerance rules (exact match vs £X vs X% vs category-dependent) | 68f R-1 | Reconcile detail spec before Phase C |
| Conflict card resolution actions UI (modal vs inline vs full-screen per action) | 68f R-2 | Reconcile anchor design |
| Discuss-this thread mechanics (chat vs linear comments vs hybrid) | 68f R-3 | Reconcile anchor design |
| AI queue ordering weights (£ only vs £ × stakes vs easiest-first) | 68f R-4 | AI coach pattern spec |
| Resolve-all walkthrough flow (full-screen vs modal chain vs inline overlay) | 68f R-5 | Reconcile anchor design |
| Mark's progress visibility privacy (full fraction vs bucketed vs binary) | 68f R-6 | Before V1 ship |
| Trust chip visual detail (remaining four levels beyond self-declared + bank-evidenced) | 68g C-T1 | Phase C anchor extraction |
| Sections vs chapters terminology normalisation | 68a C-U2 | Reconcile detail spec |

---

## Data model

### Types needed (new)

| Type | Purpose |
|---|---|
| `OurHouseholdPicture` | Joint document instance, versioned V1.0..AGREED |
| `JointDocVersion` | Version label + timestamp + which party shared + change summary |
| `ConflictCard` | Item + Sarah value + Mark value + delta + provenance + action state |
| `StatusQuad` | Aggregate counts per bucket + per-section breakdown |
| `MarkStatus` | State machine (5 states) + derived indicators |
| `DiscussionThread` | Per-item async comments + quick-action chips + state |
| `DeliberationQueueItem` | Conflict + AI-ordered priority + suggested action |
| `ActivityLogEntry` | Who / when / what across the joint doc |

### Types re-used

- `HouseholdItem` (from Phase 2 data model) — now carries dual-party claims
- `TrustLevel` — with addition of `both-party-agreed` transitions
- All bank / AI types from preserved libraries

---

## Engine dependencies

| Dependency | Status |
|---|---|
| Item-matching (Sarah ↔ Mark) with tolerance rules | **New** — logic spec per 68f R-1 |
| Conflict detection + delta calculation | **New** — derived from matched pairs |
| AI queue ordering | **New** — weights per 68f R-4 |
| Mark status state machine | **New** — driven by account / activity events |
| Joint-doc versioning machinery | **New** — per 68c R-V |
| Activity-log aggregation | **New** — event sourcing pattern |
| Escape-hatch export trigger (5 rounds stuck threshold) | **New** — per 68f C-E1 locked |
| AI coach cards (cross-phase) | **New** — pattern shared with Build/Settle/Finalise |

---

## Slice membership

*Populated after slice index exists. Expected slices touching Phase 3:*
- Respondent onboarding + build slice (covers Phase 1 + Phase 2 variants for Mark)
- Joint-doc creation + versioning slice (V1.0 on share → V2.0 on Mark's first share back)
- Status quad + filter slice
- Conflict-resolution slice (card UI + resolution actions + discussion thread)
- AI deliberation queue slice
- Mark status + waiting states + nudge slice
- Escape-hatch export slice (ES2 / Form E from stuck state)

---

## Open dependencies — full 68f/g link list

**Reconcile-specific:**
- 68f R-1, R-2, R-3, R-4, R-5, R-6

**Cross-cutting:**
- 68a C-A1..A3 (AI coach pattern — cross-phase)
- 68a C-E1..E4 · 68f C-E1 (escape-hatch)
- 68a C-U2 (sections vs chapters terminology)
- 68g C-T1 (trust chip visual detail for remaining levels)
- 68g C-U4 (disclosure-language audit)
- 68g C-V7/V8 (task taxonomy + row — extends into Reconcile tasks too)

**Legacy specs consulted:**
- spec 35 (collaboration workspace vision — HouseholdItem enriched)
- spec 36 (collaboration task flow)
- spec 37 (collaboration design patterns)
- spec 60 (flow map share-reconciliation)
- spec 63 (flow map adaptive)
