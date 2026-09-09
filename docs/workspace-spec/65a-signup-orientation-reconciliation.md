# Spec 65a — Sign-Up + Orientation Reconciliation

**Date:** 6 May 2026
**Status:** Drafted. Reconciliation register documenting which spec 57 + 58 screens survive into the post-pivot architecture, which are absorbed by spec 65 + 67, and which are deferred / re-homed.
**Depends on:** spec 57 (source) · spec 58 (source) · spec 65 (post-pivot pre-signup; supersedes parts of 57 + 58 per its metadata) · spec 67 (post-signup profiling) · spec 60 (Mark's respondent flow) · spec 70-build-map-slices.md §"S-O3 · Safeguarding signposting"
**Supersedes:** None — register only. Spec 57 + 58 source documents remain canonical for their post-pivot subset; this register identifies what's superseded without deleting source.

---

## Context

Spec 65's metadata supersedes claim (§"Status" header L4-5) is verbatim: *"Supersedes: Relevant sections of specs 57, 58 (these will be updated once post-signup is locked)."*

Spec 67 (post-signup profiling) IS now locked. This register resolves the supersedes claim concretely: per-screen, what happens. The post-pivot canonical sources are:

- Spec 65 — pre-signup interview (8 screens O1-O8; before account creation)
- Spec 67 — post-signup profiling (Moment 1 acknowledgement → Moment 2 deeper questions → bridges to bank + Moment 3)
- Spec 60 — Mark's invited-respondent flow (separate state machine)
- Spec 70-build-map-slices.md §S-O3 — safeguarding signposting screen (separate slice)

This is a register, not a redesign.

## Spec 57 §1 — Public site + sign-up

| Screen | Status | Post-pivot home |
|---|---|---|
| 1.1 Landing page | SURVIVES | S-M1 marketing slice; copy + visual treatment per Claude AI Design canvas (live at `docs/design-source/marketing-landing/`); positioning per spec 42 |
| 1.2 Sign up | SURVIVES with simplification | Sign-up form (Google OAuth + email magic link — auth model superseded, see §Status); arrives via spec 65 O8 *"Create a free account and start building my picture"* CTA |
| 1.2a Magic link sent | SURVIVES | Standard transactional surface; copy per spec 73 |
| 1.3 Sign in | SURVIVES | Standard auth surface; returning-user fork preserved |
| 1.4 Invitation landing (from ex) | RE-HOMED | Spec 60 / S-O2 Mark's respondent flow; spec 67 §"Gap 7: Invited party (Mark) profiling variant" governs |
| 1.4a Information for invited party | RE-HOMED | S-O2 invited-party context per spec 67 §"Gap 7" five locked decisions |
| 1.5 Static content pages | SURVIVES | Marketing / SEO surfaces; subset selected at S-M1 scope; 1.5i safeguarding-resources page is DROPPED in favour of the dedicated S-O3 signposting screen |

## Spec 57 §2 — Orientation Flow (post-signup)

The orientation flow has been substantially restructured. The post-pivot model:

1. **Pre-signup** (spec 65): O1-O8 gathers stage + situation BEFORE account creation. The "where are you" router (was spec 57 §2.2) moves PRE-signup to spec 65 O1.
2. **Moment 1** (spec 67 §"Gap 1"): immediate post-signup acknowledgement of pre-signup state (*"Based on what you told us..."*). Replaces the old generic 2.1 welcome + wellbeing-check.
3. **Moment 2** (spec 67 §"Gap 1" L86): post-signup profiling — skips what's answered, goes direct to follow-ups.
4. **S-O3 signposting screen** (spec 70-build-map-slices.md §"S-O3"): triggered safeguarding pre-Moment 1 for flagged users. Replaces 2.1b + 2.1c.

| Screen | Status | Post-pivot home |
|---|---|---|
| 2.1 Welcome + wellbeing check | ABSORBED | Spec 67 §"Gap 1" Moment 1 (acknowledgement-led, not wellbeing-question-led; the *"how are you doing"* question is dropped — pre-signup already gathered tone signal via spec 65 O3 `relationship_quality`) |
| 2.1a Gentler pacing | ABSORBED | Implicit in spec 67 §"Gap 11" universal baseline + tone-aware pacing per spec 65 `stage` value; no dedicated screen |
| 2.1b Safety resources | RE-HOMED | S-O3 safeguarding signposting screen; resource list per spec 67 §"Gap 11" L825-830 verbatim |
| 2.1c Discreet mode setup | DEFERRED | Spec 67 §"Gap 11" V1.5 backlog L863 (*"decoy mode / alternate bookmark labels / favicon swap"*); universal-baseline equivalents at L801-807 (exit-this-page, neutral email subjects, non-descript browser tab titles) ship in V1 |
| 2.2 Stage router | ABSORBED | Spec 65 O1 (*"Where are you?"*) — moved PRE-signup; same 3-option set but different labels |
| 2.3 Exploration mode | PARTIALLY ABSORBED | Spec 65 `stage='thinking'` tone-gating (pre-signup); the exploration-specific lighter-profiling path is DROPPED — post-signup full profiling per spec 67 happens regardless of stage |
| 2.4 Import existing disclosure | DEFERRED | Out-of-scope for V1; v2-backlog candidate (Form E + bank-statement parsers are engine-grade work) |
| 2.5 Fast-track: already agreed | DEFERRED | Out-of-scope for V1; v2-backlog candidate. The post-pivot mental model is *build-the-picture-shared-with-ex*; already-agreed couples still benefit from an evidenced shared picture even with monetary terms settled, so there's no fast-track skip |

## Spec 58 — Profiling (Pre-Bank-Connection)

Spec 58 §"Profiling structure" defined Q1-Q6 covering housing / employment / vehicles / children / pensions / other-assets BEFORE bank connection. The post-pivot model defers depth to AFTER bank connection (Moment 3 per-section confirmation, where bank signals do most of the work — *"show, don't ask"* per CLAUDE.md §"Product rules"). Spec 65 keeps only what's needed pre-bank to drive the AI plan + tone gating + safety branching.

| Spec 58 screen | Status | Post-pivot home |
|---|---|---|
| 3.1 Q1 Housing | ABSORBED with simplification | Spec 65 O2 collects `property_status`; spec 67 §"Gap 2: Property details" + §"Gap 4: Housing transition" drive post-bank deeper questions |
| 3.2 Q2 Employment | ABSORBED with simplification | Spec 65 O4 collects `self_employment` flag; spec 67 §"Gap 6: Self-employed details" drives post-bank deeper questions |
| 3.3 Q3 Vehicles | ABSORBED | Spec 67 post-bank asset checklist; not pre-bank |
| 3.4 Q4 Children | ABSORBED with simplification | Spec 65 O2 collects `has_children` + `children_count`; spec 67 §"Gap 3: Children depth" drives post-bank deeper questions |
| 3.5 Q5 Pensions | ABSORBED | Spec 67 §"Gap 10: Pension depth — DB vs DC, CETV status" — post-bank, not pre-bank |
| 3.6 Q6 Other assets | ABSORBED | Spec 67 post-bank asset checklist |
| 3.7 Profiling complete transition | ABSORBED | Spec 67 Moment 2 → Moment 3 (per-section confirmation post-bank) transition |

## Forks summary

The 4 main routes from spec 57 §2.2 stage router (full / exploration / import / fast-track) compress to:

1. **Full journey** (any of the 3 `stage` values) → spec 65 → sign-up → spec 67 Moment 1 → Moment 2 → bank → Moment 3 per-section confirmation → build → share → reconcile → settle → finalise.
2. **Invited path** (ex-side) → spec 60 / S-O2 Mark's respondent variant; per spec 67 §"Gap 7" five locked decisions.

Exploration is now a TONE within the full journey (`stage='thinking'`), not a separate path. Import + fast-track defer to V2.

## What this register does NOT cover

- Post-pivot rendering of sign-up surfaces 1.2 / 1.2a / 1.3 — copy + visual treatment governed by spec 73 + canvas (gated on user-produced design); current state per the design-input audit at `docs/design-input-audit.md` §A.
- The S-O2 respondent flow detail — spec 60 + spec 67 §"Gap 7" govern.
- The S-O3 signposting screen detail — spec 70-build-map-slices.md §"S-O3" governs.
- Any change to spec 57 + 58 source text. Those documents remain canonical for their post-pivot subset.
- Spec 65 §"What this does NOT cover" L186 reference *"Post-signup profiling (next spec — 66)"* — vestigial numbering; the live post-signup spec is 67. This register is the right place to flag the inconsistency; updating spec 65's reference is a follow-on housekeeping task (low priority; not part of this PR).

---

## Status

Drafted at session 70 alongside spec 74 (P0). This register concretely resolves spec 65's open supersedes claim now that spec 67 is locked. It does not amend spec 57 + 58 source — those remain canonical for their post-pivot subset.

Session 125 (S-PROTO-sign-up): row 1.2's auth model is superseded by the canvas. The sign-up artboard (`#m-signup`, mobile-screens-v2 "05b · Mobile · Sign up") is full name · email · password (hint *"Min 12 characters"*) · terms checkbox · *"Create account"* — no Google OAuth, no magic link. Decision A follows the canvas, so 1.2a magic-link-sent leaves that slice's scope; the magic-link-vs-password question is logged for user testing rather than decided in this register. The built O8 CTA reads *"Create my account"*, not the copy quoted in row 1.2. Spec 57 §1.2/§1.2a source text is left intact; this note is the amendment of record.
