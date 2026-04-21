# Spec 68a — Cross-Cutting Decisions Locked

**Date:** 21 April 2026
**Parent:** spec 68 (synthesis hub)
**Status:** Frozen — these decisions apply across phases. Open items sit in 68f register.

---

## C-N Navigation

**C-N1 Nav is contextual — LOCKED.**
When the user is inside a document, the left rail is that document's chapter TOC (not the app nav). App-level phase nav surfaces via breadcrumb + a dedicated nav wireframe to be designed next.

**C-N2 Locked phases are dimmed + tooltipped — LOCKED.**
Phases the user has not yet unlocked render in nav with reduced opacity and a "Unlocks when…" tooltip on hover. Signals the path ahead without enabling premature clicks.

**C-N3 Phase labels — LOCKED.**
Start · Build · Reconcile · Settle · Finalise. "Share" is an action button, not a nav destination. Reconcile's destination copy is "Our Household Picture" or equivalent — not "Agreeing the facts" (the Claude AI Design wires used that phrase, but the phase label stays "Reconcile").

**C-N4 Dedicated nav wireframe — OPEN (see 68f N-1).**
Needs a separate design pass before Build Map: icon-rail-plus-doc-TOC vs breadcrumb-as-nav vs collapsible three-layer.

---

## C-T Trust badges

**C-T1 Trust badges render per line item — LOCKED.**
Every evidenceable assertion in any document (private, joint, proposal, finalise) carries a trust level visible as a small inline badge. Not in a callout, not in prose — on the line.

**C-T2 Taxonomy (per spec 42, applied here) — LOCKED.**
Self-declared → Bank-evidenced → Credit-verified → Document-evidenced → Both-party-agreed → Court-sealed. Six levels, ascending. Default for new items = Self-declared.

**C-T3 Visual treatment — OPEN (see 68f T-1).**
Icon? colour-dot? text-chip? Shadow-only-on-card per visual direction. Design pass needed when we extract the two key screens.

---

## C-S Share modal + share CTA

**C-S1 Share CTA is adaptive — LOCKED.**
- Default (no unsent changes): "Share with Mark" (or party name)
- Pending changes after prior share: "Share update"
- Dismissable banner on change-while-shared: "You've updated your picture. Share the update with Mark?"
- Copy on the page must communicate: "This is your private view. You choose what to share."

**C-S2 Share modal is party-type-aware — LOCKED.**
Select party type: Ex · Solicitor · Mediator. Each collects required info (name, email, TBD per party type). Phase-1 UI supports all three; phase-1 functionality wires up Ex only.

**C-S3 Selective publish toggles — LOCKED.**
Inside the share modal, Sarah can checkbox which fields / sections go into the shared view. Not all-or-nothing. She retains the rest in her private picture; can push them in a later share.

**C-S4 Party-type form fields — OPEN (see 68f S-1).**
Ex = name + email. Solicitor = firm + reference + email? Mediator = firm + case ref? To be designed when the share modal anchor is generated.

---

## C-E Escape-hatch export (Form E / ES2)

**C-E1 Export is a first-class escape hatch from any stuck state — LOCKED.**
The product never traps the user. If Mark disengages or reconciliation stalls, Sarah can export her picture into the legal-document format a mediator or court process can consume.

**C-E2 Triggers for export CTA — LOCKED (behaviour) / OPEN (thresholds).**
- Waiting-for-Mark zero state: after N weeks with no engagement → zero-state CTA "export your picture as Form E for a mediator"
- Stuck reconciliation: after X rounds without progress → "sometimes you need extra help — export ES2 and take to a mediator"
- Thresholds for N and X: 68f E-1.

**C-E3 Always-available export from document menu — LOCKED.**
User can export without being prompted. Download options: Form E (full disclosure), ES2 (consent-order Statement of Information), plain-text summary PDF.

**C-E4 Export affects phase flow — LOCKED.**
Exporting does NOT lock the user out of continuing in-platform. The export is an artefact they can take elsewhere; the product persists for when they return.

---

## C-X Exit / safeguarding

**C-X1 Exit this page lives in the footer — LOCKED.**
Universal baseline per spec 67 Gap 11. Always accessible. Redirects to BBC News per the GOV.UK pattern.

**C-X2 Exit behaviour — OPEN (see 68f X-1).**
Instant redirect vs confirm-first vs clear-local-state-on-exit. Safeguarding specialist input may be needed.

**C-X3 Safeguarding signposting screen placement — LOCKED (copy) / OPEN (visual).**
Per spec 67 Gap 11: for flagged users (safety_concerns / device_private=not_sure), a dedicated signposting screen fires before Moment 1 acknowledgement with resources (Women's Aid, NDAH, Men's Advice Line, Refuge, Surviving Economic Abuse, Samaritans). Autonomy preserved — user may proceed. Visual treatment designed when the onboarding anchors are generated.

---

## C-A AI coach right rail

**C-A1 AI coach is a cross-phase pattern — LOCKED.**
Same visual component appears in Build (Needs your attention), Reconcile (Deliberation queue), Settle (AI coach with flags / notices / fallback positions), Finalise (Pre-flight / Activity log). Internals differ; shell is the same.

**C-A2 Coach card taxonomy — LOCKED (initial set).**
- Court reasonableness — red-flag risk scoring against typical court outcomes
- Fairness check — amber notice on lopsided items
- Coaching — green-positive reinforcement / advice
- On this comment — contextual response to a discussion thread
- Jump-to link — deep-link to the relevant section

**C-A3 "AI suggestions are guidance based on typical court outcomes for cases like yours. Not a substitute for legal advice." — LOCKED as footer copy for the coach panel.**

---

## C-D Data source / freshness

**C-D1 Bank data refresh on login — LOCKED.**
Automatic. Freshness timestamps shown in Data sources right-rail card ("8 min ago / 1 day ago / pending").

**C-D2 Manual refresh button — OPEN (see 68f D-1).**
Present in Data sources card or hidden unless stale (>24h)?

---

## C-U User-facing language

**C-U1 Always "complete settlement workspace" — LOCKED.**
Never "financial disclosure tool." Per CLAUDE.md positioning section. Applies to every piece of copy — UI, emails, help content, marketing.

**C-U2 Reconcile terminology split — TO NORMALISE.**
Sarah's Picture uses "sections"; Reconcile wires used "chapters." Pick one. Lean: **sections** (matches the §-notation and legal-doc styling). Lock in 68c.

**C-U3 "Warm hand on a cold day" tone — LOCKED (from CLAUDE.md).**
Compassionate, professional, never patronising. Applies to every emotional pacing moment (welcome banners, exit copy, stuck-reconciliation messaging, waiting-state copy).

---

## Applicability

These decisions apply to every downstream phase-detail spec. Reference 68a directly rather than re-deriving. If a downstream spec proposes a conflicting pattern, update 68a with a version bump and note the change — don't let drift happen silently.
