# Spec 68 — Wire Reconciliation Synthesis (Hub)

**Date:** 21 April 2026
**Session:** 21
**Status:** Frozen snapshot of what the Claude AI Design wires taught us about the complete settlement workspace. All session-21 decisions below are locked; open decisions live in the sibling register (68f).
**Related:** spec 42 (strategic synthesis, phase model), spec 44 (document-as-spine), spec 65 (pre-signup locked), spec 67 (post-signup profiling — gaps 1-12).

---

## Purpose

This spec consolidates what a batch of Claude AI Design prototype wires — covering Build → Reconcile → Settle → Finalise — taught us about the product, and reconciles those learnings against the existing spec set. It does three things:

1. Freezes the design concepts that survive from the wires (the "locked" layer).
2. Captures new concepts surfaced in the wires that need their own detail specs later.
3. Records the areas the wires did NOT cover (gap register) so they are not forgotten.

Detailed per-phase decisions live in companion files 68a–68e. Parked decisions awaiting a session to lock them live in 68f (live document).

---

## Scope of wires reviewed

**Covered by the wires (disclosure → submission):**
- Build: Sarah's Picture (private doc) — V0.8 DRAFT
- Reconcile: Our Household Picture V2.0 UNIFIED + 5 variants (initial merge, contested focus, Mark hasn't opened / opened hasn't started / building)
- Settle: My opening position → Review draft → Mark's counter-proposal → Settlement progress (V4 · 6 of 7 agreed) → Settlement agreement (V5 signed)
- Finalise: Generate legal documents → Consent order preview → Pre-flight quality check → Review decision (solicitor tier) → Submit to Family Court

**Not covered (captured in the gap register below):**
Public site, pre-signup interview, AI plan, signup / tier selection, welcome tour, first-time dashboard, Moment 1 post-signup acknowledgement, Moment 2 pre-bank profiling (P1-P6), bank connection + reveal, Moment 3 post-bank section-by-section flows (children, housing transition, business, spending), pre-share verification moment, completeness checklist, share modal, Mark's full invited-party journey, export-to-mediator escape hatches, post-order implementation tracking, safeguarding signposting screens.

---

## Phase model reconciled

Five phases replacing the prior six. **Share collapses from a phase into an action** — you press Share from Build, and the destination is Reconcile. Move-on folds into Finalise tracking.

| # | Phase | Destination | Triggered by |
|---|---|---|---|
| 1 | **Start** | Public site → orientate → AI plan → signup → tier | User arrives |
| 2 | **Build** | Sarah's Picture (private document view + dashboard) | Signup complete |
| 3 | **Reconcile** | Our Household Picture (joint document) | Share action from Build |
| 4 | **Settle** | Settlement proposal (built from agreed picture) | All reconciliation items resolved (see 68c R-S1) |
| 5 | **Finalise** | Legal documents generated → pre-flight → solicitor decision → submit → track | Settlement agreed & signed by both |

**Share is an action, not a destination.** The share modal is party-type-aware (ex / solicitor / mediator — phase-1 UI supports all three, phase-1 functionality wires up ex only).

**"Move-on" / implementation is folded into Finalise tracking** for V1 scope. A deeper treatment may surface as V2 when we revisit.

**Nav model:** contextual. When inside a document, the left rail is the document's chapter TOC. App-level phase nav surfaces via breadcrumb + dedicated nav wireframe (to be designed separately — see 68a and next steps).

---

## Document-as-spine realised

The wires made spec 44's document-as-spine concept concrete. Four documents, one lifecycle:

| Document | Owned by | Created when | Versioned |
|---|---|---|---|
| **Sarah's Picture** | Sarah (private) | Build starts | Timestamp + simple history log (no version chip) |
| **Our Household Picture** | Both | First Share action | V1.0 → V2.0 (Mark shares) → Vx.y (each re-share) → AGREED chip when reconciled |
| **Settlement Proposal** | Drafted by one, countered by other | All reconcile items resolved | V1 → V2 counter → V3 response → Vn until both accept |
| **Generated legal docs** | Auto-produced | Settlement agreed | V5 AGREED basis → court-ready artefacts (Consent order, D81 + Section 10, Form P pension annex, Settlement summary PDF, optional Statement of arrangements) |

Each document renders in the same three-column shape:
- **Left rail:** chapter TOC with completion iconography (✓ / ! / state dots)
- **Middle:** §-numbered prose sections (legal-doc styling)
- **Right rail:** contextual panel whose content morphs by phase (Snapshot + Data sources + Needs your attention in Build; Status quad + Deliberation queue in Reconcile; AI coach with Court reasonableness / Fairness check / Coaching / On this comment in Settle; Pre-flight / Activity log in Finalise)

**Target legal artefact: ES2 (Statement of Information) structure** — not Form E. Lighter, matches the consent-order self-submission path. Sarah's Picture = her half of the equivalent ES2.

---

## Where the locked decisions live

This hub intentionally does not repeat per-phase detail. Go to the companion file for the area you're working in:

- **68a-decisions-crosscutting.md** — nav, trust badges, share modal, export escape hatches, exit/footer, universal patterns
- **68b-decisions-build.md** — Sarah's Picture, dashboard-above-picture, section edit controls, adaptive share CTA, version model (lightweight), selective publish
- **68c-decisions-reconcile.md** — joint doc V-model, status quad, conflict card, AI queue, resolve-all walkthrough, Mark status machine, waiting states
- **68d-decisions-settle.md** — proposal draft, AI coach right rail, running split, counter-proposal response, settlement progress board, version history graph, convergence chart
- **68e-decisions-finalise.md** — generated document list, consent order rendering, pre-flight check pattern, solicitor tier fork, submit-to-court package + signatures + fee + attestation

Open decisions (not yet locked): **68f-open-decisions-register.md** — the ~25 parked items with context, options, lean, and status. Gets ticked off over the coming sessions.

---

## New concepts surfaced (need detail specs later)

Each of these was either absent from the spec set or only sketched. The wires made them concrete. They will become phase-detail specs in the next planning pass.

**Cross-cutting:**
- Trust badge taxonomy (per line item: self-declared / bank-evidenced / credit-verified / document-evidenced / both-party-agreed / court-sealed)
- AI coach right-rail component (flags / notices / fallback positions / jump-to, shared across Build, Reconcile, Settle, Finalise)
- Adaptive share CTA state machine (idle → pending changes → "Share update" → sent)
- Escape-hatch export (Form E from stuck-share waits; ES2 from stuck reconciliation rounds)
- Selective publish-to-shared toggles (checkbox per field at share time)
- Party-type share modal (ex / solicitor / mediator dispatch)
- Locked-nav-item pattern (dimmed + "unlocks when…" tooltip)
- Dashboard-above-document pattern (to-do focused, sits above Sarah's Picture)
- Exit-this-page footer component (universal per spec 67 Gap 11 baseline)

**Build:**
- Document view as primary artefact (not a dashboard of cards)
- Section-level completion iconography (✓ / !) in left TOC
- Snapshot right rail (Net position / Assets / Debts / Monthly gap)
- Data sources transparency card with freshness + pending states
- Global to-do ↔ per-doc Needs-your-attention relationship
- Monthly-gap metric (income vs outgoings — doubles as future-needs input)
- Section inline edit controls (edit / upload evidence / delete) with change log

**Reconcile:**
- Status quad header (Agreed / Differ / New to you / Gap to address)
- Conflict card (side-by-side with provenance + delta + non-judgemental framing)
- AI-ordered deliberation queue (biggest-impact-first)
- Resolve-all walkthrough wizard
- Discuss-this per-item thread (async comments + quick actions)
- First-visit welcome pattern (dismissable emotional pacing)
- Joint-doc version model (V1.0 Sarah share → V2.0 Mark share → Vn re-shares → AGREED)
- Mark status machine (not-invited / invited-not-opened / opened / building N/M / shared) with nudge + resend affordances
- Activity log / recent activity right-rail pattern
- Chapter-terminology split (Sarah's "sections" vs Reconcile's "chapters" — to normalise)

**Settle:**
- Proposal option cards per section (Sell / Sarah keeps / Mark keeps / Defer-until-18)
- Running split dashboard (X% / Y% with £ figure)
- AI coach flag vs notice taxonomy
- Fallback-positions surface (alternative proposals the coach suggests)
- Counter-proposal response controls (Discuss / Counter / Accept per-section)
- Settlement progress board (version history + gap-between-positions chart)
- "How you got here" convergence chart in final agreement artefact

**Finalise:**
- Generated-documents checklist pattern (required vs optional)
- Consent-order legal-doc rendering (formal court style)
- Pre-flight quality check (validation cards, 8 checks observed)
- Solicitor decision three-tier fork (£0 DIY / £250 pensions-only / £450 full)
- Submit-to-Family-Court package + signature + fee + attestation pattern

---

## Specs impacted

| Spec | Action |
|---|---|
| 42 strategic synthesis | **Update** — phase model (6 → 5, Share as action, Move-on folded into Finalise) |
| 44 document-as-spine | **Enrich** — with the four-document lifecycle and three-column realisation |
| 04 dashboard | **Pressure-test** — dashboard sits above Sarah's Picture, to-do focused, not the financial summary. Needed before Build detail spec. |
| 67 post-signup profiling | **Supersede by spec 69+** — once Gap 7 decisions lock (see 68f) |
| 22 / 25 confirmation & summary | **Update** — summaries are sections OF the document, not separate screens |
| **New specs needed:** | document view, reconcile flow, settle flow, finalise flow, dashboard, share modal, AI coach pattern, trust badge taxonomy, export escape hatches, Mark status machine, waiting states, version models |

These new specs come *after* the Build Map (Phase B). Don't write them yet — the Build Map sequences them.

---

## Gap areas (not in wires, not yet designed)

Not urgent to design now, but logged so they're not forgotten when the Build Map sequences them:

1. Public site + orientation
2. Pre-signup interview (spec 65 locked — wires not needed)
3. AI plan output (O7)
4. Signup / tier selection
5. Welcome tour (4-panel carousel)
6. First-time dashboard
7. Moment 1 post-signup acknowledgement
8. Moment 2 pre-bank profiling (P1-P6 per spec 67)
9. Bank connection flow + reveal
10. Moment 3 post-bank section-by-section (most Build sub-flows)
11. Children / housing transition / business / spending sub-flows
12. Pre-share verification moment
13. Completeness checklist
14. Share modal (spec'd, not wired)
15. Mark's full invited-party journey
16. Export-to-mediator screens
17. Post-order tracking / implementation
18. Safeguarding signposting screens
19. Exit-this-page footer real behaviour (redirect per spec 67 Gap 11 universal baseline)

---

## Next steps (Phase A remaining)

In priority order:

1. **Lock nav + phase model.** Design a dedicated nav wireframe (contextual app-nav + document chapter-nav combined). Answers 68a C-N1/N2/N3.
2. **Tick off 68f open-decisions register.** ~25 decisions. Some lock inline, some need a mini-design pass, some defer to V1.5 consciously.
3. **Pressure-test dashboard spec 04** against 6-phase model + doc-as-spine. Dashboard sits ABOVE Sarah's Picture, to-do focused.
4. **Update specs 42 and 44** with the phase model and document-spine realisation.
5. **Write phase-detail specs** for document view, reconcile flow, settle flow, finalise flow, dashboard, share modal, AI coach, trust taxonomy, export hatches — sequenced by Build Map.
6. **Produce the Build Map** (Phase B) — every screen tagged Anchor / Derived / Variant / Re-use, mapped to phase, with component + data model + engine dependencies, MVP / V1.5 / V2 scope.
7. **Identify the first deployable slice** and "done" criteria.

Only then (Phase C): extract code from 2 key screens → build design system foundation → ship first slice.
