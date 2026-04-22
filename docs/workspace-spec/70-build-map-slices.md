# Spec 70 — Build Map · Slice Index

**Parent:** spec 70 (hub) · siblings 70-build-map-{start,build,reconcile,settle,finalise}.md
**Scope:** Catalogue of deliverable end-to-end slices across the Complete Settlement Workspace. Slices are the unit of engineering work — each cuts through phases to ship user value.

---

## Purpose + convention

This is a **catalogue**, not a scope doc. Every slice in the product is listed so engineering planning at Phase C kickoff (first slice selection) and per-slice sprint setup (spikes, tactical scoping, MLP framing) has the full map to cut from.

**Slice ID convention:** `S-{Category}{N}` where Category = F (foundation) · O (onboarding) · B (build) · R (reconcile) · S (settle) · L (finalise-legal) · X (cross-cutting).

**Per-slice fields:**
- **Phases** — which phases the slice touches
- **User value** — one-line shippable outcome
- **Key components** — Anchors / Derived / Re-use / Preserve-with-reskin from the phase files
- **Depends on** — other slices this needs
- **Opens** — linked 68f/g entries that block or inform

---

## Foundation slices

*Cross-cutting prerequisites. Not user-visible on their own, but every user-facing slice needs them.*

### S-F1 · Design system foundation
- **Phases:** All
- **Value:** Token system + base primitives ready for anchor extraction.
- **Key components:** Phase colour system (C-V1), accent-tint washes (C-V13), typography scale, spacing tokens, shadow model, keyboard affordance pattern (C-V4), time-estimate affordance (C-V14).
- **Depends on:** none (true foundation).
- **Opens:** 68g C-V1 (token spec), C-V4 (convention), C-V13 (tint rules).

### S-F2 · Document-as-spine shell
- **Phases:** Build, Reconcile, Settle (Finalise inherits for consent-order render).
- **Value:** The three-column document shell that every one of the four workspace documents renders into.
- **Key components:** Document shell (middle §-numbered prose body), left-rail journey-map + chapter TOC, right-rail stacked panels, per-section §-header with completion icon.
- **Depends on:** S-F1, S-F3.
- **Opens:** 68f B-1 (per-section control set), 68f B-4 (ES2 section list), 68a C-U2 (sections vs chapters terminology).

### S-F3 · Phase nav / journey map (two surfaces)
- **Phases:** All.
- **Value:** Users always know where they are in the 5-phase journey, in both dashboard and in-doc contexts.
- **Key components:** 5-phase horizontal stepper (C-V6, dashboard), in-doc vertical journey-map rail (C-N1 amended), locked-section inline treatment (C-V12), unlock-when copy (68f C-N1c locked).
- **Depends on:** S-F1.
- **Opens:** 68f C-N1b (label pass), 68f C-N1d (locked-phase preview depth).

### S-F4 · Trust taxonomy + trust chip
- **Phases:** All documents.
- **Value:** Every evidenceable line carries a visible trust level, upgrading as evidence strengthens.
- **Key components:** Trust chip pattern (68f C-T1 locked = colour-by-level + label-by-source), 6-level taxonomy (68a C-T2), per-level visual treatments (amber self-declared + green bank-evidenced locked; four remaining levels open).
- **Depends on:** S-F1.
- **Opens:** 68g C-T1 (per-level visual detail for credit-verified / document-evidenced / both-party-agreed / court-sealed).

### S-F5 · AI coach pattern
- **Phases:** Build, Reconcile, Settle, Finalise.
- **Value:** Same AI coach shell appears cross-phase; internals differ.
- **Key components:** Coach card taxonomy (Court reasonableness / Fairness check / Coaching / On-this-comment / Jump-to), right-rail panel, footer disclaimer copy (68a C-A3 locked).
- **Depends on:** S-F1, S-F2.
- **Opens:** 68f R-4 (AI queue ordering weights), 68g C-T1 (trust-aware coach cards).

### S-F6 · Task taxonomy + task row
- **Phases:** Build (primary home), surfaces in all phases via dashboard.
- **Value:** Dashboard + in-doc Needs-your-attention render every actionable item consistently.
- **Key components:** Task row (C-V8: chip + label + status CTA), task taxonomy chips (C-V7: Evidence / Practical / Legal), `+ Add a task` link.
- **Depends on:** S-F1, S-F3.
- **Opens:** 68g B-11 (category completeness audit), 68g B-14 (user-added tasks V1/V1.5), 68f B-2 (snooze V1.5).

### S-F7 · Persistence + auth abstraction (dev/prod modes)
- **Phases:** All
- **Value:** Domain code reads/writes sessions + workspace state via interfaces (Session, WorkspaceStore, AuthGate). Dev mode runs end-to-end against `localStorage` fixtures — no signup, no Supabase. Prod mode flips to Supabase via `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` env var. Same domain code paths, different implementation. Engineering can build + test slices without auth shipping; real auth swaps in cleanly later. Full design in spec 71 §4.
- **Key components:**
  - `lib/auth/` — Session interface + dev-session (fixture user) + supabase-session + AuthGate
  - `lib/store/` — WorkspaceStore interface + dev-store (localStorage) + supabase-store (wraps existing `lib/supabase/workspace-store.ts`)
  - `/app/dev/` route group — dashboard, scenario picker, state inspector, reset, moved engine-workbench
  - `components/dev/` — scenario-picker, state-inspector, (moved hub debug panels)
  - Env banner reskin (Preserve-with-reskin) — mode chip + scenario dropdown + reset
  - Build-time + runtime assertions enforcing `MODE === 'prod'` in production build (spec 72 §7)
  - CI gate testing production build for dev-mode leaks (routes / imports / email domains / localStorage keys)
  - Fixture scenario library — 8 initial scenarios (cold-sarah through sarah-finalise)
- **Depends on:** S-F1 (design system for dev-banner reskin + dev-UI primitives)
- **Opens:**
  - Storage schema versioning convention (`decouple:dev:store:v1` → v2 migration pattern)
  - Real-Supabase migration playbook (separate spec when we ship first real-auth deploy)
  - Scenario JSON format + loader pattern
  - Dev-only API route convention (`/app/dev/api/*`)
- **Security:** spec 72 §3 (Session pattern) + §7 (Dev/prod boundary enforcement, multi-layer). Fixture users on reserved `@dev.decouple.local` domain; prod signup allowlist rejects.

---

## Marketing slices

*Public unauthed surfaces — landing, features, pricing. Rebuilt against Claude AI Design outputs per session 23 P0-2 decision.*

### S-M1 · Marketing site rewrite
- **Phases:** Pre-Phase-1 (unauthed public surface)
- **Value:** Every arrival lands on spec-42-aligned positioning — "complete settlement workspace" framing, not "financial disclosure tool." Public site is the first impression; current V1 pages violate positioning (app/page.tsx, app/features, app/pricing Discarded per spec 70 hub audit).
- **Key components:** New landing (`/`) · new features page (`/features`) · new pricing page (`/pricing`) · reskin of legal placeholders (`/privacy`, `/terms`, `/cookies` — Preserve-with-reskin shells pending legal review per spec 56 L2) · marketing-surface primitives from S-F1 design system · Claude AI Design outputs as canonical visual source · positioning copy from spec 42 (tagline, pillars, value proposition) · handoff to `/start` pre-signup interview.
- **Depends on:** S-F1 (design system tokens + primitives).
- **Opens:**
  - Marketing copy sourcing (direct from spec 42 + new positioning writing)
  - Responsive behaviour for marketing pages (mobile/tablet/desktop design variants)
  - SEO metadata + structured data per spec 56 L9.2
  - Analytics event allowlist for marketing surfaces (spec 72 §8 PostHog schema)
- **Security:** spec 72 §8 (PostHog event allowlist — no PII in marketing events) + §10 (CSP allowlist includes marketing third-party scripts if any).

---

## Onboarding slices

*Phase 1 Start, plus the respondent variant.*

### S-O1 · Primary onboarding
- **Phases:** 1 Start → hands off to 2 Build.
- **Value:** Public site → signup + tier → welcome tour → Moment 1 acknowledgement → Moment 2 pre-bank profiling → bank-connect ready.
- **Key components:** Welcome carousel shell (C-V2), persistent stepper (C-V3), phase demo cards (C-V5), trust band (C-V11), pre-signup interview question set (Preserve-with-reskin: spec 65), Moment 2 question set (Preserve-with-reskin: spec 67).
- **Depends on:** S-F1, S-F3.
- **Opens:** 68g C-V2 / C-V3 / C-V5 (anchor extraction), 68g B-10 (tour scope), 68g C-U4 (copy audit), AI plan output visual format.

### S-O2 · Respondent onboarding
- **Phases:** 1 Start (variant) → hands off to 2 Build (variant).
- **Value:** Mark clicks invite → tailored pre-signup with inherited context → IS1 confirm-or-correct per fact → IS2-6 → optional AI plan → enters his Build variant.
- **Key components:** Respondent welcome tour (Derived from C-V2), IS1 confirm-or-correct pattern (Derived from per-section confirmation Anchor), respondent-framed AI plan (Variant), invitation-link expiry (14 days per G7-3 locked).
- **Depends on:** S-O1, S-F1, S-F3.
- **Opens:** Respondent journey wireframes (deferred to Phase C per spec 67 Gap 7 resolution), G7-5 AI plan respondent framing detail.

### S-O3 · Safeguarding signposting
- **Phases:** 1 Start (for flagged users), footer across all phases.
- **Value:** Users with safeguarding flags see signposting screen before Moment 1; exit-this-page footer always available.
- **Key components:** Signposting screen (Women's Aid / NDAH / Men's Advice Line / Refuge / Surviving Economic Abuse / Samaritans), exit-this-page footer (68a C-X1 locked, behaviour open at 68f C-X1).
- **Depends on:** S-F1.
- **Opens:** 68f C-X1 (exit behaviour — safeguarding specialist input), safeguarding detection V1.5 vs signposting V1 (locked: V1 = signposting only).

---

## Build slices

*Phase 2 Build — Sarah's Picture + dashboard + bank-evidenced confirmation loops + share action.*

### S-B1 · Bank connection
- **Phases:** 2 Build (Sarah), also used in 2 Build variant (Mark).
- **Value:** User picks bank → Tink Link auth → callback → data syncs → first-time reveal.
- **Key components:** Bank picker grid (C-V10), Tink client (Re-use), connect + callback routes (Re-use), Tink transformer (Re-use), trust band (C-V11), time-estimate affordance (C-V14), manual-entry fallback strip.
- **Depends on:** S-F1, S-F4.
- **Opens:** 68g C-V10 (anchor extraction), 68g B-6 (first-time bank-panel placement).

### S-B2 · Sarah's Picture document
- **Phases:** 2 Build.
- **Value:** Private document renders with auto-populated sections from bank data + inline editing + per-section history log.
- **Key components:** Document-shell instance (from S-F2), provenance intro copy pattern (68b B-D5), §-numbered sections with Children as §1 (68b B-D6), per-section inline controls (68b B-E2), section change log (68b B-E3), last-updated stamp (no version chip per 68b B-V1).
- **Depends on:** S-F2, S-F3, S-F4, S-B1.
- **Opens:** 68f B-1 (per-section controls), 68f B-4 (ES2 section list), 68g B-5 (50:50 default), 68g B-9 (section totals).

### S-B3 · Dashboard (workspace home)
- **Phases:** 2 Build (primary home), shows progress/state across all phases.
- **Value:** Task-focused landing. User always knows what to do next and where they are in the journey.
- **Key components:** 5-phase stepper (C-V6), phase-grouped workbands (B-12 open), connected-data-source card (C-V9), task list using S-F6 task row component, locked-section inline treatment (C-V12), accent-tint card washes (C-V13).
- **Depends on:** S-F1, S-F3, S-F6.
- **Opens:** 68g B-12 (phase-grouping rationale), 68g B-13 (state machine), 68f B-3 (locked-for-shape; copy pending C-U4).

### S-B4 · Per-section confirmation loop
- **Phases:** 2 Build (all sections).
- **Value:** Bank signals drive confirm-or-correct questions per section; confirms upgrade trust level; corrections open edit surface.
- **Key components:** Confirmation Q&A pattern (Preserve-with-reskin: `confirmation-questions.ts` + spec 22 decision tree logic), signal rules engine (Re-use: 17 rules), trust chip upgrade (S-F4).
- **Depends on:** S-F4, S-B1, S-B2.
- **Opens:** 68f B-1 (per-section controls per section type), 68g C-U5 (empty-state verb family).

### S-B5 · Spending journey (estimates → bank-evidenced)
- **Phases:** 2 Build (Outgoings section).
- **Value:** User provides rough estimates up-front (amber chips), bank categorisation later replaces with green source-labelled chips. Full spending picture in under 10 minutes.
- **Key components:** Estimates form, categorisation logic (Preserve-with-reskin: `result-transformer.ts` + spec 13 trees + spec 19 keywords), per-category upgrade pattern, section total (68g B-9).
- **Depends on:** S-F4, S-B1, S-B2, S-B4.
- **Opens:** 68g B-9 (section totals rendering), 68g B-11 (taxonomy if spending tasks need own category).

### S-B6 · Evidence upload
- **Phases:** 2 Build primarily, also 5 Finalise (pre-flight remediation).
- **Value:** User uploads mortgage statement, property valuation, CETV letter, etc. → trust level bumps to document-evidenced.
- **Key components:** Upload control (per-section inline per 68b B-E2), evidence store, trust-level derivation rules, upload-now CTA pattern.
- **Depends on:** S-F4, S-B2.
- **Opens:** Trust chip per-level visual (68g C-T1), file-size / format rules, storage + retention (engineering spec).

### S-B7 · Share action
- **Phases:** 2 Build → triggers 3 Reconcile.
- **Value:** User sends picture to Mark; Our Household Picture V1.0 created; Reconcile unlocks; one-time post-share banner surfaces.
- **Key components:** Adaptive share CTA (C-S6), multi-step share modal (Who → What selective publish → Confirmation), party-type variants (ex locked via C-S1a; solicitor / mediator open via C-S1b), post-share unlock banner (B-8), invitation email + link (14-day expiry per G7-3).
- **Depends on:** S-F1, S-B2, S-R1 (joint-doc creation).
- **Opens:** 68g C-S5 (selective publish step), 68g C-S6 (adaptive CTA rendering), 68f C-S1b (solicitor/mediator fields), 68g B-8 (post-share banner pattern).

---

## Reconcile slices

*Phase 3 Reconcile — Our Household Picture + conflict mechanics + Mark status + waiting states.*

### S-R1 · Joint-doc creation + versioning
- **Phases:** 3 Reconcile.
- **Value:** On Share from Build, Our Household Picture V1.0 is created from Sarah's Picture; Mark's share back produces V2.0; each re-share produces Vx.y; AGREED suffix on reconciliation complete.
- **Key components:** Our Household Picture document shell (Derived from Sarah's Picture shell), joint-doc version chip (V1.0 / V2.0 / Vx.y / AGREED), first-visit welcome banner, activity log right-rail panel.
- **Depends on:** S-F2, S-B7.
- **Opens:** 68c R-V (version detail), 68f R-6 (Mark progress visibility privacy).

### S-R2 · Status quad + filtering
- **Phases:** 3 Reconcile.
- **Value:** User sees at-a-glance breakdown of Agreed / Differ / New to you / Gap to address with filtering.
- **Key components:** Status quad header component, per-section filter state, aggregate counts.
- **Depends on:** S-R1.
- **Opens:** 68f R-1 (tolerance rules — exact vs £X vs % vs category-dependent).

### S-R3 · Conflict resolution
- **Phases:** 3 Reconcile.
- **Value:** Every disagreement resolvable via structured actions; discussion thread per item; AI-ordered queue surfaces biggest-impact items first.
- **Key components:** Conflict card pattern (side-by-side + provenance + delta + non-judgemental CTA), resolution actions (Discuss · AI midpoint · Zoopla · Agree · Defer), AI deliberation queue (right-rail, biggest-impact-first), discuss-this thread per item, resolve-all walkthrough wizard.
- **Depends on:** S-F5 (AI coach), S-R1, S-R2.
- **Opens:** 68f R-2 (action UI: modal vs inline vs full-screen), 68f R-3 (thread mechanics), 68f R-4 (queue ordering weights), 68f R-5 (walkthrough flow).

### S-R4 · Mark status + waiting states + nudges
- **Phases:** 3 Reconcile (primary), also surfaces in 2 Build (Share affordance shows Mark status once shared).
- **Value:** Sarah always sees where Mark is (not-invited / invited-not-opened / opened / building-N-M / shared); nudges available; waiting states handled with emotional pacing.
- **Key components:** Mark status machine display, nudge affordance, resend affordance, waiting-state screens with emotional-pacing copy, overdue-invite detection.
- **Depends on:** S-R1.
- **Opens:** 68f R-6 (Mark progress visibility: full fraction vs bucketed vs binary — lean bucketed).

---

## Settle slices

*Phase 4 Settle — Settlement Proposal + negotiation + signature.*

### S-S1 · Proposal drafting
- **Phases:** 4 Settle.
- **Value:** Sarah drafts opening proposal using option cards per section; running split banner shows live Sarah%/Mark% + £ figures; AI coach advises on reasonableness + fairness.
- **Key components:** Settlement Proposal document shell (Derived from Sarah's Picture shell), proposal option cards per section (Sell / Sarah keeps / Mark keeps / Defer-until-18), running-split banner, AI coach right-rail with four card types (Court reasonableness / Fairness / Coaching / On-this-comment), fallback-positions surface.
- **Depends on:** S-F2, S-F5, S-R1 (needs AGREED Our Household Picture).
- **Opens:** 68f S-1 (pre-reconciliation drafting — lean: no V1), 68f S-2 (custom free-text option), 68f R-4 (queue / coach weights).

### S-S2 · Counter-proposal cycling
- **Phases:** 4 Settle.
- **Value:** Mark reviews Sarah's proposal; responds per section with Discuss / Counter / Accept; version increments preserve full history.
- **Key components:** Counter-proposal section view (split columns Sarah vs Mark), three-button response row, version-increment logic, per-section state tracking.
- **Depends on:** S-S1.
- **Opens:** Version-history granularity rules.

### S-S3 · Progress board + convergence chart
- **Phases:** 4 Settle.
- **Value:** Both parties see negotiation progress: items agreed, items still open, version history timeline, convergence chart of gap-between-positions over rounds.
- **Key components:** Settlement progress board, version history timeline, still-open card, agreed list, convergence chart (preserved into final agreement artefact per 68d S-B2).
- **Depends on:** S-S1, S-S2.
- **Opens:** Convergence-chart visual detail at Phase C anchor extraction.

### S-S4 · Signature (sign-to-lock)
- **Phases:** 4 Settle → triggers 5 Finalise.
- **Value:** When all items agreed, both parties explicitly sign; Settlement Agreement locks; Finalise unlocks.
- **Key components:** Signature capture (V1 = identity-verified account + explicit attestation per 68f S-3 lean; V1.5 = e-sign), Settlement Agreement artefact (SIGNED state), convergence chart preserved retrospectively.
- **Depends on:** S-S3.
- **Opens:** 68f S-3 (signature mechanism: attestation vs e-sign vs upload — lean: attestation V1, e-sign V1.5), 68f F-1..5 handoff readiness.

---

## Finalise slices

*Phase 5 Finalise — legal-doc generation + pre-flight + solicitor fork + submit + tracker.*

### S-L1 · Legal-document generation
- **Phases:** 5 Finalise.
- **Value:** Consent Order + D81 (with Section 10 reasoning) + Form P (if pension-sharing) + Settlement Summary PDF + optional Statement of Arrangements — all auto-produced from SIGNED Settlement Agreement.
- **Key components:** Generated-documents checklist, Consent Order renderer (legal-doc style, §-numbered clauses), D81 auto-populator, Form P template (conditional), Settlement Summary PDF.
- **Depends on:** S-S4.
- **Opens:** 68f F-1 (document inclusion rules), legal template library (future spec).

### S-L2 · Pre-flight quality check
- **Phases:** 5 Finalise.
- **Value:** Eight validation checks surface any issues before submission; print-report affordance for solicitor handoff; gate-keeping that prevents preventable rejections.
- **Key components:** Pre-flight validation cards, eight initial check rules, pass / fail / needs-input states, remediation links back to relevant sections.
- **Depends on:** S-L1.
- **Opens:** 68f F-2 (additional checks: tax / CGT / occupation order — post-V1 iteration).

### S-L3 · Solicitor fork (panel + recommendation)
- **Phases:** 5 Finalise.
- **Value:** User decides: £0 submit direct, £250 pensions-only review, or £450 full review. Case complexity detection surfaces Recommended badge.
- **Key components:** Three-tier fork UI, panel firm partner platform (engineering), case-complexity scoring (rules-based + AI-assisted), Recommended badge logic.
- **Depends on:** S-L1, S-L2.
- **Opens:** 68f F-3 (pricing + panel firm partnerships — commercial negotiation pre-V1).

### S-L4 · Submit to court
- **Phases:** 5 Finalise.
- **Value:** Four-confirmation page (identity / content accuracy / fee ready / authority) → fee payment → attestation → submission record created.
- **Key components:** Submit page with four confirmations, £53 court fee integration (current as of 2026), e-signed attestation (reuses S-S4 pattern), trust band reassurance (C-V11), submission channel (guided manual V1; MyHMCTS V1.5 per 68f F-4).
- **Depends on:** S-L1, S-L2, S-L3.
- **Opens:** 68f F-4 (submission mechanism — lean: guided manual V1 → MyHMCTS V1.5).

### S-L5 · Post-submit tracker (+ implementation for V1)
- **Phases:** 5 Finalise.
- **Value:** User tracks 6-10 week judicial review; on court-sealing, Settlement Agreement updates to SEALED; implementation tasks surface (transfer property, share pension, update records) — absorbs Move-on for V1.
- **Key components:** Tracker state machine (submitted / under-review / queried / sealed), implementation task list (derived from agreement clauses), telemetry source (V1 = self-report + email prompts; V1.5 = MyHMCTS API per 68f F-5).
- **Depends on:** S-L4.
- **Opens:** 68f F-5 (telemetry source), richer implementation guidance (V1.5+ backlog).

---

## Cross-cutting slices

*Slices that apply universally — escape hatches, safeguarding, exit-this-page.*

### S-X1 · Escape-hatch export (Form E / ES2)
- **Phases:** All documents (always available from document menu); triggered surfaces in Reconcile (stuck) + Build (Mark not engaged).
- **Value:** Product never traps the user. Anyone can export their picture into a legal-document format (Form E full disclosure / ES2 consent-order Statement of Information / plain-text summary PDF) for a mediator or court process.
- **Key components:** Always-available export from document menu (68a C-E3), triggered export CTA on stuck-state zero-state surfaces, 4-week Mark-non-engagement trigger (68f C-E1 locked), 5-round stuck-reconciliation trigger (68f C-E1 locked), Form E renderer, ES2 renderer, plain-text summary PDF.
- **Depends on:** S-F4 (trust chip provenance carried to export), S-B2 (source doc data), S-R1 (source joint-doc data).
- **Opens:** Form E template library, ES2 template library, export persistence (user returns — document continues in-platform).

### S-X2 · Exit-this-page footer (universal safeguarding)
- **Phases:** All phases, every surface.
- **Value:** Any user in a safety emergency can exit to BBC News instantly with local state cleared. Universal baseline per spec 67 Gap 11.
- **Key components:** Footer exit-this-page component (68a C-X1 locked), redirect target (BBC News per GOV.UK pattern), local-state clear-on-exit.
- **Depends on:** S-F1.
- **Opens:** 68f C-X1 (behaviour detail: instant redirect vs confirm-first vs clear-local-state-on-exit — safeguarding specialist input needed; lean: instant redirect + clear local state).

---

## Maintenance

When a slice is picked up for engineering work, detailed scope (MLP vs V1.5 vs V2, acceptance criteria, spikes) is produced as part of slice setup — not stored in this file. Move the slice ID into the active sprint tracker and reference the phase files for component-level detail. When a slice ships, flip its header marker to ✅ here.
