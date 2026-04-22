# Session 22 Handoff

**Date:** 22 April 2026
**Branch:** `claude/session-22-design-planning-vkByL`
**Scope:** Design / planning only — wire reconciliation, 68f lock-through, spec 42/44 alignment, Build Map production. No code changes.

---

## What happened

### Session started on wrong base

Branch `claude/session-22-design-planning-vkByL` had been created off an old pre-pivot HEAD — none of session 21's work (CLAUDE.md, SESSION-CONTEXT, spec 68 suite) was visible. User flagged that session 21 lived on `origin/claude/decouple-financial-workspace-oXXQ7` at `cf5075c`. Ran `git fetch` + `git checkout -B` to reset session-22 branch to session 21's tip. All 68-suite context restored. Lesson: verify branch base early.

### P0 — Cleared the blocked wire batch (19 screens, 4 batches)

Walked every remaining wire from session 21's image-upload-blocked batch plus new wires produced in session 22. Reconciled against 68a-f as we went. Tracked decisions across three modes — Reconciler (conflicts with locked spec), UX enhancer (cheap high-value additions), Register updater (new opens logged inline).

**Batch 1 (5 screens):** Sarah's Picture post-bank-connection + share flow. Flagged disclosure-language leak back across ~12 surfaces (CTA, breadcrumb, sidebar heading, dropdown, empty states, footer) — load-bearing positioning violation. Missing selective-publish step in share modal. Trust chip rendered on one item only.

**Batch 2 (4 screens):** Post-share state, spending with estimates, spending bank-evidenced (trust chip upgrade pattern), children empty state. Trust chip colour-by-level + label-by-source pattern confirmed.

**Batch 3 (5 screens):** Welcome tour — Intro + 4 phase steps. Canonical visual source for Phase C extraction. Phase colour system (indigo/pink/blue/green), full-bleed serif display typography, persistent bottom stepper, keyboard affordance, per-phase demo cards previewing real product structure.

**Batch 4 (3 screens):** Dashboard first-time + 2 post-connection variants. Task taxonomy chip system (Evidence/Practical/Legal), 5-phase horizontal stepper, phase-grouped workbands, bank picker grid, connected-data-source card, trust band, locked-section inline treatment.

### Key amendment mid-session — C-N1 journey map

User flagged 68a C-N1 ("doc TOC only inside documents") was overly restrictive. Amended to **contextual journey map** across two surfaces: vertical left-rail (in-doc) + horizontal stepper (dashboard). Same 5-phase always-visible; current phase expands to doc TOC or task-grouped cards; locked phases dimmed with unlock-when hint + one level of sub-items previewed. Richer than pure doc-TOC, cleaner than split app-nav-plus-doc-TOC.

### P1 — Locked decidable 68f entries

Locked in batch:
- **C-N1** split into a/b/c/d (a/c/d 🟢 locked · b 🟠 open for copy pass)
- **C-N4** resolved (replaced by C-N1a)
- **C-S1** split into a (ex-modal fields locked) · b (solicitor/mediator open)
- **C-T1** trust chip pattern locked (colour-by-level + label-by-source)
- **B-3** dashboard shape locked

Then locked G7 + C-E1 (6 decisions in one round with user nuances):
- **G7-1** pre-signup placement with tailored respondent signup flow
- **G7-2** Mark answers fresh with opt-in/opt-out (default opt-in)
- **G7-3** 14 days default invitation expiry
- **G7-4** No silent merges, no trivial threshold — IS1 is ask-and-confirm per non-financial fact (user nuance — supersedes lean)
- **G7-5** Full parallel AI plan with respondent-role framing nuance
- **C-E1** Mark 4-week non-engagement / stuck reconciliation 5-round thresholds

Also surfaced 29 new 🟠 opens captured in new file `68g-*` trio.

### Swap P2/P3 mid-session

User's instinct was to do P3 (specs 42 + 44 alignment) before P2 (Build Map), on grounds that Build Map inherits from positioning specs and better to have them clean first. Agreed. Tiny P3 cleanup pass first, then P2.

### P3 — Specs 42 + 44 aligned to 5-phase model + 68 framing

**Spec 42:** Amendment note at top; six-phase journey rewritten as five-phase (Start / Build / Reconcile / Settle / Finalise); Share collapsed to action; Move-on folded into Finalise tracking. Repositioning summary table updated.

**Spec 44:** Amendment note; "one document" framing rewritten as four-document lifecycle (Sarah's Picture → Our Household Picture → Settlement Proposal → Generated legal docs); version pipeline (v0.x→v7.0) superseded by per-document versioning; edit-mode/document-mode toggle DROPPED per 68b B-E1; children moved to §1.

### Visual direction — Claude AI Design canonical

User reinforced that the Claude AI Design tool outputs are the canonical visual source — no legacy refs (Airbnb/Emma/Habito retired). Updated CLAUDE.md (new Visual direction section), SESSION-CONTEXT.md (negative constraint), spec 27 (SUPERSEDED notice at top). Extraction sequence locked to Phase C Step 1, anchor shortlist in 68g-visual-anchors.md.

### P2 — Complete Settlement Workspace Build Map

Produced seven files: hub (`70-build-map.md`) + one per phase + slice index.

Each phase file catalogues components by six tags (Anchor / Derived / Variant / Re-use / Preserve-with-reskin / Known-unknown), data model, engine dependencies, slice membership (forward ref), open dependencies.

Slice index: 31 slices across Foundation (6) / Onboarding (3) / Build (7) / Reconcile (4) / Settle (4) / Finalise (5) / Cross-cutting (2). Written skeleton-first + 7 small section Edits to dodge idle-timeout on large single-write operations.

### Strategic reframing moments

- **"Slice" as the label** for engineering work units. Distinct from Phase (journey), Document (artefact), Anchor (visual component). Agile-canonical.
- **MLP not MVP.** User reinforced this — frame scope decisions as "what the *loveable* version requires vs what can iterate post-launch." Added to CLAUDE.md north star. Matches existing quality-bar framing.
- **Scope slicing deferred** from Build Map to engineering-phase setup. Map is complete; cuts happen with real engineering signal.
- **P4 skipped** — user agreed to defer clean rebuild strategy + first slice selection to session 23 for a fresh head.

## Key decisions made

**Nav (C-N1 amended):** Contextual journey map across two surfaces (vertical rail in-doc, horizontal stepper on dashboard). All five phases always visible; current expands; locked preview one level deep. Supersedes original "doc TOC only" lock.

**Share modal (C-S1):** Ex-fields locked as First + Last name + Email (C-S1a). Solicitor + mediator fields deferred (C-S1b).

**Trust chip (C-T1):** Pattern locked — colour by taxonomy level, label by specific source (not abstract taxonomy word). E.g. amber "Estimated" = self-declared; green "Barclays Bank" = bank-evidenced. Per-level visual detail for remaining 4 levels still open.

**Dashboard (B-3):** Shape locked across 3 states (first-time zero / post-connection / refined with taxonomy chips + accent washes). Copy subject to C-U4 audit.

**Mark journey (G7-1..5):** Pre-signup IS1 · opt-in/out AI plan · 14-day invite expiry · no silent merges (ask-and-confirm pattern) · full parallel with respondent framing.

**Escape-hatch thresholds (C-E1):** Mark 4-week non-engagement → Form E export CTA; 5 stuck-reconciliation rounds → ES2 export CTA. Tune against telemetry post-V1.

**Positioning (spec 42, 44):** 5-phase model + four-document lifecycle now canonical in positioning specs. Children as §1 in all documents.

**Visual direction:** Claude AI Design tool outputs are canonical. Airbnb/Emma/Habito and spec 27 retired. Extraction sequence: Phase C Step 1.

**Build Map (spec 70):** Complete. 7 files, 31 slices catalogued. Tag system: Anchor / Derived / Variant / Re-use / Preserve-with-reskin / Known-unknown. Scope (MLP/V1.5/V2) deferred to engineering kickoff — map stays complete.

**"Slice" adopted** as label for deliverable engineering work unit cutting through phases.

**MLP not MVP** codified in CLAUDE.md north star.

**Session wrap protocol** updated with step 6: PR to main at session wrap to keep main canonical.

## What went well

- **Early branch check caught wrong base** before burning time building on the wrong HEAD.
- **Reconciler / UX-enhancer / Register-updater triple-mode walk-through** was productive across 19 screens. Caught load-bearing disclosure-language leak; surfaced 29 new opens without stopping the walk.
- **Amending C-N1 mid-session** instead of forcing wire to fit old lock. User's "no — it's a journey map" flag saved a reconciliation debt.
- **Small-file discipline held.** When user asked "smaller files?" we split new material across 68g trio; later split 70-build-map into 7 files; skeleton-first + Edit-per-section for the slice index. Avoided timeouts after the first one.
- **Swap P2/P3 when positioning specs needed updating first** — accepted the order change, specs 42/44 updated before Build Map built on them.
- **Scope discipline held.** Didn't let the Build Map bloat into slice-level scope specs. MLP not MVP framing reinforced. "Map is complete; cuts happen later."
- **P4 deferred to session 23** was the right call — wrap work needed time and P4 deserves a fresh head.

## What could improve

- **First reconciliation batch was long.** ~500 words per image, across 5 images. Context-heavy. Tightened successive batches but start was verbose. Future sessions: lead with a shorter default and expand only where the user asks.
- **Stream idle timeouts** started mid-session when writes got large. Should have proactively split large files at first signal rather than waiting for timeouts. Caught up with skeleton-first pattern but lost a few minutes to retries.
- **Ahead-of-planning temptation returned briefly** when I proposed scope slicing inside Build Map. User caught it ("defer scope to engineering setup"). Good save but the reflex is recurrent — explicit "no scope until engineering" guard-rail now in the hub.
- **CLAUDE.md staleness wasn't fully fixed until wrap.** Branch section and key-files list were stale from session 20 for most of the session. Should have refreshed mid-session when flagged. Session-context rewriting discipline needs to extend to CLAUDE.md more proactively.

## Bugs / issues encountered

**Stream idle timeouts during large file writes.** Platform-level idle-timeout fires when a single `Write` tool call emits a large-content file. Manifested twice:
1. Mid-slice-index attempt.
2. Near-repeat on retry.

**Fix applied:** skeleton-first (~20-line shell) committed, then Edit-per-section (~30-50 lines each). No further timeouts after pattern change.

**Takeaway for future sessions:** any Write over ~150 lines of content should be written as a skeleton + Edits. Same pattern works for new specs, handoff docs, and session-context rewrites.

## Open loops → session 23

### P0 for session 23 — Execution planning (deferred P4 from session 22)

1. **Clean rebuild strategy.** Same-repo restructure vs new top-level `/app` and `/components`. How the 5-phase model + four-document lifecycle maps to folder structure. Which stable libs (`src/lib/bank/*`, `src/lib/ai/*`, `src/types/hub.ts`) keep their paths, which move. The discarded-UI tree (`src/components/workspace/*`) removal plan.

2. **First deployable slice pick.** From the 31 slices in `70-build-map-slices.md`, pick one to ship end-to-end. Strongest candidates per the Map:
   - **S-O1 Primary onboarding** — lowest dependencies (only S-F1 + S-F3 foundation); demonstrates welcome carousel shell (C-V2) + stepper (C-V3) + phase colour system (C-V1).
   - **S-B1 Bank connection** — reuses a lot of stable libs; high user-visible impact; demonstrates bank picker grid (C-V10) + trust band (C-V11).
   - **S-B2 Sarah's Picture document** — the load-bearing anchor that Reconcile + Settle + Finalise all derive from. Biggest bang for Phase C effort but highest complexity.
   - **S-F1 + S-F2 Foundation stack** — not user-facing alone but unlocks everything else. Arguably the correct Phase C Step 1.

3. **Design system foundation work.** Token extraction from Claude AI Design outputs. Phase colour system hex values + gradient stops. Typography scale. Shadow model. Base primitives (button / chip / card / input).

4. **Engineering environment preparation.** User mentioned bringing MD-file updates for performance + code quality at engineering kickoff. Drop those in before Phase C code starts.

### P1 for session 23 — Copy audit (C-U4)

The disclosure-language audit is blocking Phase C anchor extraction — every anchor will be copy-carried and the wire language needs to be cleaned to phase-model labels first. ~12 surfaces identified in 68g-copy-share-opens.md. Output: one copy-pattern doc covering replacement vocabulary, banned words, empty-state verb family, confirmation/attention/success/error templates.

Also resolves C-U5 (empty-state CTAs) and C-U6 (stepper/nav labels) along the way.

### Open 68f/g decisions still 🟠

**Cross-cutting:** C-N1b (label pass, waits on C-U4) · C-T1 per-level visual for 4 remaining trust levels · C-S1b (solicitor + mediator modal fields) · C-X1 (exit-this-page behaviour — safeguarding specialist input) · C-S5 (selective-publish step) · C-S6 (adaptive CTA rendering) · C-V1..V14 (anchor extraction specs — resolved by Phase C) · C-N5 (two-surface nav family spec) · C-D1 (manual refresh for data sources).

**Build:** B-1 (per-section control sets) · B-4 (ES2 section list) · B-5 (50:50 default) · B-6 (bank panel placement) · B-7 (sidebar completion derivation) · B-8 (post-share banner) · B-9 (section totals) · B-10 (tour scope) · B-11 (task taxonomy completeness) · B-12 (dashboard phase-grouping rationale) · B-13 (dashboard state machine) · B-14 (user-added tasks V1/V1.5).

**Reconcile:** R-1 (tolerance rules) · R-2 (conflict action UI) · R-3 (thread mechanics) · R-4 (AI queue weights) · R-5 (resolve-all flow) · R-6 (Mark progress privacy).

**Settle:** S-1 (pre-reconcile drafting — lean: no V1) · S-2 (free-text proposal option) · S-3 (signature mechanism — attestation V1, e-sign V1.5).

**Finalise:** F-1 (doc inclusion rules) · F-2 (pre-flight additions) · F-3 (solicitor tier pricing + partners — commercial) · F-4 (submission mechanism — MyHMCTS V1.5) · F-5 (telemetry source).

None block session 23's P0. Most block specific slice work when that slice is picked up.

### Respondent journey detailed wireframes

G7-1..5 locked but detailed wireframes for Mark's IS1..IS6 + IS-Plan + Moment-1-Mark variant deferred to Phase C build work per spec 67 Gap 7 resolution. Not session-23-blocking unless Mark-side slice is picked first.

## Files created / modified this session

**Created (new specs):**
```
docs/workspace-spec/68g-visual-anchors.md          — C-V1..C-V14 extraction catalogue
docs/workspace-spec/68g-build-opens.md             — B-5..B-14 build opens
docs/workspace-spec/68g-copy-share-opens.md        — C-U4..6 + C-S5..6 opens
docs/workspace-spec/70-build-map.md                — Build Map hub
docs/workspace-spec/70-build-map-start.md          — Phase 1 map
docs/workspace-spec/70-build-map-build.md          — Phase 2 map
docs/workspace-spec/70-build-map-reconcile.md      — Phase 3 map
docs/workspace-spec/70-build-map-settle.md         — Phase 4 map
docs/workspace-spec/70-build-map-finalise.md       — Phase 5 map
docs/workspace-spec/70-build-map-slices.md         — 31-slice catalogue
docs/HANDOFF-SESSION-22.md                         — This file
```

**Modified (existing specs):**
```
CLAUDE.md                                          — Visual direction rewrite + branch + MLP + wrap protocol step 6 + key files refresh
docs/SESSION-CONTEXT.md                            — Negative constraint 7 (Claude AI Design canonical); rewritten for session 23 (separate commit)
docs/workspace-spec/27-visual-direction-session11.md — SUPERSEDED notice at top
docs/workspace-spec/42-strategic-synthesis.md      — 5-phase journey + positioning updates
docs/workspace-spec/44-the-document-structure.md   — Four-document lifecycle + versioning rewrite + edit-mode toggle dropped + Children as §1
docs/workspace-spec/67-post-signup-profiling-progress.md — Gap 7 PARKED → RESOLVED with G7 summary
docs/workspace-spec/68a-decisions-crosscutting.md  — C-N1 amended to journey map
docs/workspace-spec/68f-open-decisions-register.md — C-N1 split · C-T1 locked · C-S1 split · B-3 locked · G7-1..5 locked · C-E1 locked
```

## Commits (in order, all on `claude/session-22-design-planning-vkByL`)

```
2cd308f  session 22: amend 68a C-N1 to contextual journey map + update 68f status
ef6f4d1  session 22: add 68g trio — visual anchors + build opens + copy/share opens
9109913  session 22: lock G7-1..G7-5 + C-E1
5e84e84  session 22: visual direction → Claude AI Design outputs canonical
28e4081  session 22 P3: update specs 42 + 44 to reflect 5-phase model + 68 framing
e981cf1  session 22 P2: Build Map — hub + 5 phase files (slice index to follow)
1e81930  session 22 P2: Build Map slice index (31 slices)
{wrap}   session 22 wrap: handoff, context rewrite, CLAUDE.md refresh  (pending)
```
