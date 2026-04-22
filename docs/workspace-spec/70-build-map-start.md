# Spec 70 — Build Map · Phase 1 · Start

**Parent:** spec 70 (hub) · **Phase spec:** see 68 (synthesis hub) + 68a (cross-cutting locked)
**Scope:** Public site → orientation → pre-signup interview → AI plan → signup + tier → welcome tour → Moment 1 acknowledgement → Moment 2 pre-bank profiling. Respondent (Mark) signup variant per G7-1..G7-5 (locked session 22).

---

## Phase summary

**Purpose:** Take a stressed individual from "I'm getting divorced" to ready-for-Build — oriented, signed up, emotionally paced, safeguarding-flagged, with their AI plan in hand. For the respondent (Mark), the variant path: arrive via invitation, confirm-or-correct Sarah's inherited context (G7-4), generate their own plan (G7-5 with opt-out per G7-2).

**Entry gate:** User arrives at public site (primary) or invitation link (respondent).
**Exit gate:** Moment 2 pre-bank profiling complete → user transitions into Phase 2 Build (bank connection).
**Documents in play:** None yet. Sarah's Picture begins to form from Moment 2 data once Build starts.

---

## Components by tag

### Anchor — new, extract from Claude AI Design outputs at Phase C

| Component | Design ref | Notes |
|---|---|---|
| Phase colour system (indigo/pink/blue/green + gradient wash) | 68g C-V1 | Cross-phase token; anchored here because Start is where the user first encounters it |
| Welcome carousel shell (full-bleed, serif display, italic accents, demo card offset, stepper) | 68g C-V2 · Claude AI Design welcome tour | First-deployable-slice candidate |
| Persistent bottom stepper (numbered, ticks on complete, outlined current) | 68g C-V3 · Claude AI Design welcome tour | Reusable downstream (confirmation flows, pre-flight) |
| Keyboard affordance ("Press → to continue") | 68g C-V4 | Tour + any multi-step flow |
| Phase demo cards (Build / Reconcile / Settle / Finalise) | 68g C-V5 · Claude AI Design welcome tour | One per destination phase, previews real pattern |
| Trust band component | 68g C-V11 · Claude AI Design first-time dashboard | Re-used across Start (bank-connect reassurance) and Finalise (submit reassurance) |
| Exit-this-page footer (safeguarding) | 68a C-X1 · spec 67 Gap 11 | Universal baseline |

### Derived — variant of an Anchor in a different context

| Component | Derived from | Notes |
|---|---|---|
| Respondent welcome tour | Welcome carousel shell (Anchor) | G7-5 full-parallel-with-respondent-nuance — same shell, tone/framing adapted |
| Respondent IS1 confirm-or-correct flow | Per-section confirmation pattern (Build phase Anchor — see 70-build-map-build.md) | G7-4 — confirm-or-correct questions per inherited non-financial attribute |

### Variant — state variation within a surface

| Component | States | Notes |
|---|---|---|
| Welcome tour entry | Primary user (Sarah) · respondent (Mark) | Different default destination after tour: Sarah → bank connection; Mark → IS1 correction flow |
| Safeguarding signposting screen | Not-flagged (skip) · flagged (show before Moment 1) | spec 67 Gap 11 — Women's Aid / NDAH / Men's Advice Line / Refuge / Surviving Economic Abuse / Samaritans |
| AI plan output | Sarah (full O7) · Mark (full parallel with respondent framing) · Mark-opt-out (skip) | G7-5 + G7-2 opt-in/out |

### Re-use — legacy library, unchanged

None in Phase 1 — this phase is entirely pre-bank and entirely new UX. No prior Start implementation to carry forward.

### Preserve-with-reskin — legacy logic, new UI

| Logic | Source | New UI driven by |
|---|---|---|
| Pre-signup interview question set | spec 65 (locked) | Welcome carousel shell + per-question Anchor component (Phase C) |
| Moment 2 pre-bank profiling questions (P1-P6) | spec 67 (12 gaps resolved, Gap 7 resolved) | Per-question Anchor component (Phase C) |
| Public site messaging (positioning pillars, tagline, value prop by audience) | spec 42 (amended session 22) | New public site per C-V1 visual system |

### Known-unknown — parked decision, blocks build

| Open | Linked | Notes |
|---|---|---|
| Public site detailed design | spec 28 superseded; no session 22 wires produced | Needs a design pass before Phase C if public site is in first slice |
| AI plan output visual format | spec 67 Gap 7 resolved in principle; detailed wireframes deferred | Needs Phase C-kickoff design for Sarah's O7 and Mark's respondent variant (G7-5) |
| Respondent journey wireframes (full IS1..IS6 + IS-Plan + Moment-1-Mark variant) | spec 67 Gap 7 resolution notes "deferred to Phase C build work" | Needs design pass at Phase C kickoff |
| Welcome tour scope (Intro + 4 steps vs add 5th) | 68g B-10 | Lock during copy pass |
| Phase colour tokens (hex values, gradient stops, application rules) | 68g C-V1 | Token spec during Phase C Step 1 |
| Welcome carousel shell production spec | 68g C-V2 | Anchor extraction during Phase C Step 1 |
| Stepper component reuse scope | 68g C-V3 | Tour-only vs any multi-step flow — decide during Build Map finalise |
| Keyboard affordance convention | 68g C-V4 | Lock during Phase C |
| Phase demo card production specs (×4) | 68g C-V5 | Anchor extraction during Phase C |
| Trust band slot model | 68g C-V11 | Anchor extraction during Phase C |
| Exit-this-page behaviour detail | 68f C-X1 | Safeguarding specialist input before V1 ship |

---

## Data model

### Types needed (new)

| Type | Purpose | Source |
|---|---|---|
| `UserProfile` | Pre-signup + Moment 2 answers, tier selection, safeguarding flags | spec 67 distribution map |
| `AIPlan` | O7 output — personalised journey preview | spec 67 |
| `InvitationContext` | Inherited facts Sarah captured about Mark, surfaced in his IS1 | G7-1, G7-4 |
| `SafeguardingFlags` | Per-party safety concerns, device privacy, relationship quality | spec 67 Gap 11 |
| `PhaseState` | Which phase user is in, which gates have been met | spec 68 phase model |

### Types re-used

None from pre-pivot code. `src/types/hub.ts` workspace-types section (post-pivot) has partial coverage; prune during rebuild.

---

## Engine dependencies

| Dependency | Status | Notes |
|---|---|---|
| AI plan generation | **New** — needs spec | Prompt design, structured output schema per CLAUDE.md rules (`additionalProperties: false`) |
| Pre-signup answer → AI plan pipeline | **New** — needs spec | Deterministic rules + LLM composition |
| Safeguarding flag detection | **Preserve-with-reskin** — spec 67 Gap 11 signposting logic V1, detection V1.5 | Pass-through at V1 |
| Respondent journey state machine | **New** — needs spec | IS1..IS6 flow + IS-Plan + link-expiry (14 days per G7-3) |

No bank engine in this phase (all pre-bank).

---

## Slice membership

*Populated after slice index (70-build-map-slices.md) exists. Expected slices touching Phase 1:*
- Onboarding slice (public site → signup → welcome tour → Moment 2 → bank-connect handoff)
- Respondent onboarding slice (invite link → IS1 confirm-or-correct → Mark's Moment 2 → bank-connect handoff)
- Safeguarding signposting slice

---

## Open dependencies — full 68f/g link list

**Cross-cutting (visual / nav / copy):**
- 68g C-V1, C-V2, C-V3, C-V4, C-V5, C-V11 (anchor extraction specs)
- 68f C-N1b (phase + document label pass)
- 68g C-U4 (disclosure-language audit — impacts all Start surface copy)
- 68g C-U5 (empty-state verb family)
- 68g C-U6 (stepper / nav label unification)
- 68f C-X1 (exit-this-page behaviour detail)

**Build-phase relevant (for flow handoff into Phase 2):**
- 68g B-10 (first-time tour scope — Intro + 4 vs 5)

**Gap 7 / respondent journey:**
- All G7-1..G7-5 locked session 22; detailed respondent wireframes are deferred — tracked in spec 67 Gap 7 notes.

**Other:**
- spec 65 (pre-signup interview locked — question set fixed)
- spec 67 (post-signup profiling resolved — distribution map fixed)
