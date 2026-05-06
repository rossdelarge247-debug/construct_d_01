# Design-input audit: screen flows + spec coverage

**Date:** 6 May 2026
**Purpose:** Single inventory of every user-facing screen flow in Decouple v1, with current spec status, canvas status, slice status, and gaps. Working document to support design-input planning while engineering is paused pending canvases.
**Source specs scanned:** 17, 28, 42, 44, 56, 57, 58, 59, 60, 65, 67, 68 hub + 68a-e + 68f/g, 70 (Build Map suite), 73.

**Status legend:**
- ✅ Locked & complete · ⏳ Locked but unrendered · ⚠️ Drafted but pre-pivot or partial · ❌ Not specced
- Canvas: ✅ on disk · ⚠️ partial · ❌ missing
- Slice: ✅ shipped · ⏳ scaffolded · ❌ no slice yet

---

## Aggregate scorecard

| # | Section / flow | Spec | Canvas | Slice | Notes |
|---|----------------|------|--------|-------|-------|
| 1 | Marketing landing (desktop) | ✅ 28 + 42 | ✅ marketing-landing | ✅ S-M1 | Shipped sessions 65-67 |
| 2 | Marketing landing (mobile) | ✅ S-M1 AC-9 | ❌ | ⏳ S-M1.0b | Mobile canvas blocked |
| 3 | Static / legal pages | ⚠️ 56 §L2 + S-M1 placeholders | ❌ pending legal | ⏳ S-M1 | £2-3.5k legal review per 56 |
| 4 | Pre-signup interview (O1-O8) | ✅ 65 LOCKED | ❌ | ⏳ S-O1 | Spec 65 supersedes parts of 57 + 58 |
| 5 | Sign-up + magic link | ⚠️ 57 §1.2-1.2a (pre-pivot) | ❌ | ❌ | Auth model = magic link + Google (Sprint-0) |
| 6 | Sign-in | ⚠️ 57 §1.3 (pre-pivot) | ❌ | ❌ | |
| 7 | Invitation landing (Mark) | ⚠️ 57 §1.4 + 60 + 67 Gap 7 | ❌ | ⏳ S-O2 | 14-day link-expiry per G7-3 |
| 8 | Welcome tour (5 screens) | ⚠️ via canvas + Build Map | ✅ welcome-tour | ⏳ S-O1 | Spec absorbed into Build Map; canvas → C-V1..V5 (V1 LOCKED, V2-V5 OPEN) |
| 9 | Welcome + wellbeing check (Moment 1) | ⚠️ 67 §Gap 1 + 57 §2.1 | ❌ | ⏳ S-O1 + S-O3 | Conceptually locked; visual TBD |
| 10 | Discreet mode + safety resources | ⚠️ 57 §2.1a-2.1c + 67 Gap 11 | ❌ | ⏳ S-O3 | Safeguarding signposting v1; detection v1.5 |
| 11 | Stage router (Where are you?) | ⚠️ 57 §2.2 (likely pre-pivoted by 65) | ❌ | ⏳ | Reconciliation needed |
| 12 | Profiling Q1-Q6 (Moment 2) | ✅ 58 + 67 Gap-resolutions | ❌ | ⏳ S-B0? | Q1 Housing · Q2 Employment · Q3 Vehicles · Q4 Children · Q5 Pensions · Q6 Other-assets-checklist · transition |
| 13 | Bank picker | ✅ 59 + 68g C-V10 | ⚠️ partial (dashboard canvas) | ⏳ S-B1 | Code: Tink client + callback already shipped |
| 14 | Bank connect flow | ✅ 59 | ❌ direct flow canvas | ⏳ S-B1 | Tink iframe + post-message live; UI TBD |
| 15 | Bank callback + confirmation card | ⚠️ 59 + 68g C-V9 | ⚠️ partial (dashboard) | ⏳ S-B1 | C-V9 connected-data-source card OPEN |
| 16 | First-time dashboard | ✅ 17 + Build Map | ✅ post-connect-dashboard | ⏳ S-B3 | 5 wire states in canvas |
| 17 | Hub states A-F (return-visit, fully-evidenced, etc.) | ✅ 17 §Hub-page-states | ⚠️ partial (state E + F may need new) | ⏳ S-B3 | A: pre-config · B: post-config-no-evidence · C: active-upload · D: data-populated · E: return-partial · F: fully-evidenced |
| 18 | Per-section confirmation (Moment 3) | ⚠️ 67 §Distribution-map | ❌ | ⏳ S-B4 | Pattern repeats per section: Income, Spending, Property, Pensions, Children, Business, Other assets, Debts |
| 19 | Spending journey (estimates → bank-evidenced) | ⚠️ 67 + 68g C-T1 | ⚠️ partial (2/6 trust levels in dashboard) | ⏳ S-B5 | Trust upgrade flow detail TBD |
| 20 | Your Picture document | ⚠️ 17 + 44 (document-as-spine) | ❌ | ⏳ S-B2 | Single-party document; 4-doc lifecycle starts here |
| 21 | Share invitation (Sarah) | ✅ 60 §5.1-5.3b | ❌ | ⏳ S-R1? | Includes optional credit check |
| 22 | Mark's onboarding (read-only Sarah's picture) | ✅ 60 §M1-M6 + 67 Gap 7 | ❌ | ⏳ S-O2 | M1 invitation email · M2 onboarding · M2a decline · M3 sign-up · M4 welcome · M5 read Sarah · M5a early comments · M6 wellbeing |
| 23 | Mark's profiling variant (IS1-IS6 + IS-Plan) | ⚠️ 67 Gap 7 RESOLVED | ❌ wireframes deferred | ⏳ S-O2 | "Detailed wireframes deferred to Phase C" per 67 L884 |
| 24 | Shared Picture document | ⚠️ 44 (document-as-spine) | ❌ | ⏳ S-R* | Joint two-party document post-reconcile |
| 25 | Reconciliation Q&A (joint) | ⚠️ 60 + 68c | ❌ | ⏳ S-R* | Joint-document conflict-card pattern locked in 68c |
| 26 | Proposal (Settle phase) | ⚠️ 44 + 68d | ❌ | ⏳ S-S* | AI coach + counter-proposal locked in 68d |
| 27 | Consent Order generation (Finalise) | ⚠️ 41 + 56 §L7 + 68e | ❌ | ⏳ S-F* | Template library legal review £3-8k |
| 28 | D81 generation + court submission (Finalise) | ⚠️ 68e | ❌ | ⏳ S-F* | MyHMCTS submission tracking |
| 29 | Settings page | ❌ NOT SPECCED | ❌ | ❌ | Profile-edit / preferences shape TBD |
| 30 | Notifications page + delivery | ❌ NOT SPECCED | ❌ | ❌ | Linked to v2-backlog #71 PostHog (events) |
| 31 | Account profile | ❌ NOT SPECCED | ❌ | ❌ | Will follow auth upgrade (v2-backlog #67) |
| 32 | Billing / paywall | ⚠️ v2-backlog #72 (V1.5 deferred) | ❌ | ❌ | Stripe SDK pinned (S-INFRA-1); Stripe billing surface deferred V1.5 |

---

## A. Pre-paywall (free, public)

**Spec coverage strong** for the pre-signup interview itself (spec 65 is locked + reconciled). **Sign-up + sign-in + invitation-landing screens** are still in spec 57's pre-pivot framing — spec 65 explicitly supersedes parts of 57. Reconciliation work needed before building the auth surfaces.

**Canvases on disk:** marketing-landing only.
**Canvases needed:**
- Pre-signup interview (8 screens)
- Sign-up + magic-link-sent + sign-in (3 screens; small set)
- Invitation landing (Mark's entry from emailed link, 1-2 screens)

**Spec gaps to fill before building:**
- AI plan generation logic (O7's substantive output) — needs its own spec per 70-build-map-start.md L99-100
- Pre-signup → AI plan pipeline (deterministic rules + LLM composition)
- Spec 57 ↔ 65 reconciliation (which sign-up screens survive, which are absorbed)

---

## B. Post-signup orientation (Moment 1)

**Architecture per spec 67 §Distribution map:** Moment 1 = immediate post-signup, pre-bank. Acknowledges what we already know from pre-signup; offers safety/wellbeing resources; routes to welcome tour or fast-track.

**Spec coverage mostly via spec 67 Gap-resolutions.** Spec 57 §2.1 is partially superseded.

**Canvases on disk:** welcome-tour (the 5-screen carousel — Intro + 4 phase steps).
**Canvases needed:**
- Wellbeing + safety check screen (Moment 1 entry)
- Discreet mode setup
- Safety resources signposting

---

## C. Profiling (Moment 2 — pre-bank Q&A)

**Spec coverage strong** in spec 58 (Q1-Q6 screens) + spec 67 Gap-resolutions (which Gap resolves where, which pre-signup answers skip which Moment-2 questions).

**Q-list per spec 58:** Q1 Housing → Q2 Employment → Q3 Vehicles → Q4 Children → Q5 Pensions → Q6 Other-assets checklist → Q7 Profiling-complete-transition.

**Forks:** Self-employed sequencing (Gap 6), pension depth DB-vs-DC (Gap 10), partner-awareness reverse-framing (Gap 12).

**Canvases on disk:** None.
**Canvases needed:** All 7 Moment-2 screens (with branching states per fork).

---

## D. Bank connection

**Spec coverage strong** in spec 59 (276L; not deeply scanned this audit but headers indicate full coverage).

**Code partly shipped already:** `src/lib/bank/tink-client.ts`, `tink-transformer.ts`, callback route at `src/app/api/bank/callback/route.ts` (per CLAUDE.md §"Stable libraries"). Tink iframe + post-message flow operational. **No UI surface yet.**

**Canvases on disk:** Bank-picker (C-V10) + connected-data-source card (C-V9) in dashboard canvas — partial.
**Canvases needed:** Mid-flow Tink iframe wrapper + callback success state + multi-account selection.

---

## E. Per-section confirmation + reconciliation (Moment 3 — post-bank)

**This is the meatiest part of Build phase.** Spec coverage is structural (spec 67 distribution map specifies which Gap goes where; per-section pattern repeats). **Per-section visual treatment is undrawn.**

**Sections with their own profiling+confirmation loops:**
- Income (per Gap 6 + bank-detected salaries)
- Spending (per Gap-resolution + trust-chip upgrade flow)
- Property (Gap 2)
- Pensions (Gap 10 — DB vs DC fork)
- Children (Gap 3 — depth opt-in)
- Business (Gap 6 — self-employed only)
- Other assets (Gap-resolution per Q6 checklist)
- Debts (per Gap-resolution; covered in spec 67)

**Pattern (specced):** mini-profiling intro → AI-found items presented → per-row confirmation (auto/confirm/correct) → gap callouts → section-complete transition.

**Canvases on disk:** None for the section-confirmation pattern. Spending-journey trust-chip upgrade has 2/6 levels visually locked from dashboard canvas (C-T1).
**Canvases needed:** ~8 section-pattern variants (one per section) × multiple states. Probably the largest single canvas batch.

---

## F. Hub / dashboard / known-states framing

**Spec 17 (290L) is the canonical reference** — defines 6 hub states (A-F) including "known states, known-unknown, potential unknown-unknown" framing the user mentioned.

**6 hub states from spec 17 L62-122:**
- A: First time — pre-configuration
- B: Post-configuration — no evidence yet
- C: Active upload/review — hero panel working
- D: Post-upload — data populated
- E: Return visit — partial picture
- F: Fully evidenced — disclosure ready

**"Section card content by state"** (spec 17 L138-203) defines per-section card behaviour across each state — this is where "known / known-unknown / unknown-unknown" framing lives most explicitly.

**Canvas on disk:** post-connect-dashboard covers state C/D/(partial)E. **States A, B, F not yet canvas-evidenced.**
**Canvases needed:** Pre-config dashboard (A), post-config-no-evidence dashboard (B), fully-evidenced dashboard (F), and return-visit state (E).

---

## G. Document surfaces (Your Picture / Shared Picture / Proposal / Consent Order)

**The 4-document lifecycle is locked in spec 44 (document-as-spine).** Each document is a phase artefact:
1. **Your Picture** — single-party Build phase output
2. **Shared Picture** — joint two-party post-Reconcile output
3. **Proposal** — Settle phase artefact (with AI coach + counter-proposal mechanics, locked 68d)
4. **Consent Order + D81** — Finalise phase output (template library legal review pending — £3-8k)

**Spec coverage:** Document-as-spine framing locked. Per-document VISUAL treatment not yet drawn. Per-document content rules covered in 68b (Build), 68c (Reconcile), 68d (Settle), 68e (Finalise).

**Canvases on disk:** None for document surfaces directly. Some patterns live in the dashboard canvas's "Build → Reconcile → Settle → Finalise" demo cards (C-V5).
**Canvases needed:** All 4 document surfaces as standalone visual canvases.

---

## H. Reconcile phase (Phase 3)

**Spec coverage:** spec 60 (335L) covers the share + invitation + Mark's-side flow extensively. Spec 68c covers the joint-document + conflict-card + queue mechanics. Spec 67 Gap 7 covers Mark's profiling variant.

**Sarah's side (spec 60 §5.x):** Your-picture-is-ready → optional credit-check → document-mode-view → invitation-setup → invitation-preview-Mark's-view → invitation-sent.
**Mark's side (spec 60 §M1-M6+):** invitation email → onboarding landing → optional decline → sign-up → welcome → read Sarah's picture → early-comments → wellbeing-check → his own profiling variant (IS1-IS6).

**Canvases on disk:** None for Reconcile phase.
**Canvases needed:** Sarah-side share flow (~6 screens), Mark-side onboarding (~7-9 screens), reconciliation Q&A pattern, joint-doc conflict-card pattern.

---

## I. Settle phase (Phase 4)

**Spec coverage:** spec 68d locks proposal mechanics (AI coach + counter-proposal). 70-build-map-settle.md has slice-level structure.

**Canvases on disk:** Settle demo card in dashboard canvas (C-V5 — proposal capital-split slider, AI Legal-check) — partial signal only.
**Canvases needed:** Whole phase — proposal builder, counter-proposal flow, AI coach surface, locked-fields treatment.

---

## J. Finalise phase (Phase 5)

**Spec coverage:** spec 41 + 56 §L7 (template library legal review) + 68e + 70-build-map-finalise.md.

**Canvases on disk:** Finalise demo card in dashboard canvas (C-V5 — court-ready package + solicitor review + submit digitally) — partial signal only.
**Canvases needed:** Whole phase — consent-order generation surface, D81 generation surface, MyHMCTS submission tracking, post-order-actions surface.

---

## K. Account / settings / notifications / billing

**The big "❌ NOT SPECCED" cluster.** None of these have wireframes, content rules, or design canvases.

| Surface | Coverage | Notes |
|---|---|---|
| Settings page | ❌ Not in any active spec | Profile-edit / preferences / data-export / delete-account TBD |
| Notifications | ❌ Not specced | Email + in-product. Linked to v2-backlog #71 PostHog (events) |
| Account profile | ❌ Not specced | Auth upgrade (v2-backlog #67) is precondition |
| Billing | ⚠️ V1.5 deferred per v2-backlog #72 | Stripe SDK pinned (S-INFRA-1); paywall surface deferred |
| Static / legal pages | ⚠️ 56 §L2.1-L2.8 + S-M1 placeholders | Privacy, terms, cookies — `/privacy`, `/terms`, `/cookies` shipped as Preserve-with-reskin shells; £2-3.5k legal review pending |

**Recommendation:** these don't need to block V1 launch but a thin spec covering the V1 minimum (settings = email-change + delete-account; notifications = email-only; account profile = read-only; billing = post-V1) would be useful before building.

---

## Spec-coverage summary

**Strong coverage (LOCKED, ready to build once canvas exists):**
- Pre-signup interview (8 screens) — spec 65
- Profiling Q1-Q6 (Moment 2) — spec 58 + 67
- Bank connection — spec 59 (deep, not fully scanned this audit)
- Hub states A-F — spec 17
- Welcome tour structure + visual anchors — Build Map + canvas
- Share invitation flow (Sarah) — spec 60 §5.x
- Mark's onboarding (Sarah's picture, read-only) — spec 60 §M1-M6 + 67 Gap 7
- Document-as-spine 4-doc lifecycle — spec 44

**Partial / needs reconciliation:**
- Sign-up + sign-in + invitation-landing — spec 57 pre-pivot framing; needs reconciliation against spec 65
- Per-section confirmation pattern — structural in 67, visual TBD
- Spending journey trust-chip upgrade — pattern locked, 4/6 levels need extraction (C-T1 partial)

**Significant spec gaps (logic-level, not just canvas):**
- AI plan generation logic (the substantive output of pre-signup) — needs its own spec
- Pre-signup → AI plan pipeline — needs spec
- Respondent journey state machine (IS1-IS6 + IS-Plan + 14-day link expiry) — needs spec
- Settings / notifications / account-profile screens — not specced
- Billing surface — deferred to V1.5

**Canvas gaps in priority order:**
1. **Pre-signup interview (8 screens)** — public-facing front door; substantive AI output (O7) is the hardest screen
2. **Sign-up + sign-in + invitation landing** (3-4 screens) — small batch but blocks the auth bridge
3. **Marketing landing mobile responsive** (already known)
4. **Bank-connect flow + confirmation** (3-4 screens) — first Build phase artefact-bearing surface
5. **Per-section confirmation pattern** (~8 sections × multiple states) — meatiest single canvas batch
6. **Hub states A, B, F + return-visit (E)** (3-4 dashboard variants) — completes the dashboard set
7. **Your Picture document surface** (1-2 screens) — closes Build phase end-to-end
8. **Reconcile phase: share + Mark's onboarding** (~13-15 screens) — opens Phase 3
9. **Settle phase whole** (TBD count) — opens Phase 4
10. **Finalise phase whole** (TBD count) — opens Phase 5

---

## Recommendation for the next 2-3 design-input batches

**Batch 1 (highest leverage, smallest effort):**
- Marketing landing mobile responsive (1 canvas extending existing)
- Pre-signup interview O1-O8 (8 screens)
- AI plan generation spec (O7 content rules)

→ Closes S-M1 fully + unblocks S-O1 (the public-facing front door).

**Batch 2:**
- Sign-up + sign-in + invitation-landing reconciliation against spec 65
- Bank-connect mid-flow + confirmation screens (3-4 screens)
- Hub states A, B, F + return-visit (4 dashboard variants)

→ Unblocks the auth bridge + opens dashboard fully + first Build artefact.

**Batch 3:**
- Per-section confirmation pattern (1 reusable template, then variations)
- Spending journey trust-chip upgrade (4 OPEN levels)
- Your Picture document surface

→ Closes Build phase end-to-end (the "4-5 sessions to user-testable Build" milestone).

Reconcile / Settle / Finalise canvases come after Build is demoable.
Settings / notifications / account-profile / billing — write thin V1 specs before building, but don't block on them.
