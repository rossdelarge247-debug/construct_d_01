# S-PROTO-share-flow

**Category:** prototype

**Journey:** orphan — pending wiring in slice `S-PROTO-your-picture-private` (registry L63, currently `canvas-drafted`). The share-flow surface is the destination Sarah lands on AFTER pressing "Share" from her Build-phase Your Picture container; this slice ports the share modal + the Reconcile state-1 "Not invited" entry view in isolation so the pattern can be reviewed before the Build host is built. Outbound stub: state-2 "Invited · hasn't opened" deferred to a future `S-PROTO-reconcile-waiting` slice.

## Source spec

Phase 3 sequence position per HANDOFF-74 L80-82 verbatim: *"P2+: ... `S-PROTO-share-flow` (Reconcile multi-actor)."* Last slice on the HANDOFF-74 L80-82 sequence — after this slice the sequence is exhausted; subsequent work shifts to off-sequence priorities or Phase C engineering.

Locked decisions live in `docs/workspace-spec/68a-decisions-crosscutting.md` §C-S L57-72 (Share modal + CTA) and `docs/workspace-spec/68c-decisions-reconcile.md` §R-M L102-118 (Mark status machine + waiting states).

Verbatim spec quotes used in AC framing below:

- **C-S1 (68a L59-63):** *"Share CTA is adaptive — LOCKED. Default (no unsent changes): 'Share with Mark' (or party name). Pending changes after prior share: 'Share update'. Dismissable banner on change-while-shared: 'You've updated your picture. Share the update with Mark?'. Copy on the page must communicate: 'This is your private view. You choose what to share.'"*
- **C-S2 (68a L65-66):** *"Share modal is party-type-aware — LOCKED. Select party type: Ex · Solicitor · Mediator. Each collects required info (name, email, TBD per party type). Phase-1 UI supports all three; phase-1 functionality wires up Ex only."*
- **C-S3 (68a L68-69):** *"Selective publish toggles — LOCKED. Inside the share modal, Sarah can checkbox which fields / sections go into the shared view. Not all-or-nothing. She retains the rest in her private picture; can push them in a later share."*
- **R-M1 state-1 (68c L106):** *"Not invited — Sarah hasn't pressed Share yet"*. (Full 5-state machine listed in spec; only state-1 in scope here.)
- **R-M2 (68c L113):** *"While Mark's state is anything other than Shared, the middle column shows a waiting state: joined-avatars hero, headline per state, body copy per state ('Reconciliation opens as soon as Mark shares his picture. Until then, you can keep refining yours — nothing is locked, nothing is sent to him.'), Mark's Status card with actions (Nudge Mark / Resend invite if applicable), soft reminder copy ('You'll get a notification when Mark shares.')."*

## Pre-flight notes

- **Fully spec-only-not-canvas-port shape.** Decoded `docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2 - Standalone.html` surveyed at scoping. There is no `M_Share`, `M_Invite`, or `M_Waiting` artboard, and the 5 existing `M_Reconcile*` variants all depict post-share contested-focus joint-doc views (status filter strip with `5 Contested · 12 Agreed · 3 Gap · 1 New` with Contested active on all 5; contested-card UI; none show waiting-state joined-avatars hero or "Mark hasn't opened" copy). The 5 M_Reconcile variants therefore belong to the future `joint-document-view` slice (registry L67, `canvas-drafted`), not this slice. No `Linked canvas:` field on this slice; canvas-fidelity gate stays dormant. AC framing drives off C-S + R-M spec quotes verbatim.
- **Registry L70 open Q resolved at scoping.** *"Invite mechanics + real-time-vs-async?"* → invite mechanics are party-type-aware tab selector (Ex/Solicitor/Mediator) per C-S2 verbatim; async per R-M3 — *"You'll get a notification when Mark shares"* + Nudge/Resend affordances on Mark Status card (no real-time polling, no chat).
- **Host surface scoping.** Standalone preview at `/dev/proto/share-flow`. The page hosts the Reconcile state-1 "Not invited" view (entry point that surfaces the Share CTA); pressing the CTA opens the Share modal; submitting the modal lands on a stubbed confirmation (deferred state-2 wiring). Share-modal components extract under `_components/` so they can be mounted from the future `S-PROTO-your-picture-private` Build host without duplication.
- **State-1 only in scope.** R-M1 names 5 Mark states. This slice ships only state-1 "Not invited" — the pre-share entry point. States 2-4 (Invited · hasn't opened / Opened · hasn't started / Building) are deferred to a future `S-PROTO-reconcile-waiting` slice; state 5 (Shared · unified) belongs to the existing `joint-document-view` slice (registry L67, `canvas-drafted`).
- **Party-type form fields.** C-S2 supports all 3 party-type UI tabs; only Ex functional in phase 1. C-S4 explicitly OPEN per 68f S-1 (*"Ex = name + email. Solicitor = firm + reference + email? Mediator = firm + case ref? To be designed when the share modal anchor is generated."*). Solicitor + Mediator tabs render placeholder copy in this slice. Ex form fields ship functional: name + email.
- **Static prototype content.** Per `prototype` category + registry L70 `confidence: low` + `tags: ['multi-actor', 'high-uncertainty']`, the surface renders realistic mock content with no submit-to-backend wiring. Mock content uses the Sarah/Mark fixture used elsewhere in `/dev/proto/`.
- **Test-pain audit (spec 72d §3).** Verbatim: *"If any unit test in a slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."* No external collaborators (no API call, no router-push beyond stub); unit tests assert rendered structure with zero mock setups required. Test-pain threshold cleared trivially.

## Acceptance criteria

### AC-1 · Reconcile state-1 "Not invited" destination view (R-M1, R-M2)

Route `/dev/proto/share-flow` mounts the Sarah-side Reconcile destination in its state-1 "Not invited" rendering. Page chrome: lightweight header with title "Reconcile" + back-arrow stub. Middle column shows the waiting-state layout per R-M2 verbatim:

- **Joined-avatars hero** — circular Sarah avatar (filled, initial "S") + circular Mark avatar (placeholder silhouette, dashed border) overlapping; centred above the headline.
- **Headline per state-1** — *"Share your picture with Mark to begin."* (state-1 derivation; R-M2 names *"headline per state"* without locking state-1 copy; copy aligns with the 68a/68c tone of *"Reconciliation opens as soon as Mark shares his picture"*).
- **Body copy** — R-M2 verbatim: *"Reconciliation opens as soon as Mark shares his picture. Until then, you can keep refining yours — nothing is locked, nothing is sent to him."*
- **Mark's Status card** — bordered card containing avatar placeholder, "Mark · Not invited" label, primary CTA "Share with Mark" (the C-S1 adaptive button — see AC-2). Per R-M2 *"Nudge Mark / Resend invite if applicable"* — neither applies in state-1 (Mark hasn't been invited yet), so neither button renders.
- **Soft reminder caption** — small line below the card per R-M2 verbatim: *"You'll get a notification when Mark shares."*

Right rail (R-M3) and any phase navigation chrome are out of scope; the middle-column waiting layout is the entire deliverable for this AC.

**Done when:** Vitest assertion on page render finds the joined-avatars hero element, the verbatim body-copy paragraph, the Mark Status card containing the Share CTA, and the soft-reminder caption — each as testable text content.

### AC-2 · C-S1 adaptive Share CTA + page copy (C-S1)

The primary CTA on the Mark Status card carries the default-state copy from C-S1 verbatim: **"Share with Mark"**. In the page header area (above the joined-avatars hero), the C-S1 page-level copy appears verbatim: *"This is your private view. You choose what to share."*

Pending-state CTA (*"Share update"*) and the dismissable banner (*"You've updated your picture. Share the update with Mark?"*) are OUT OF SCOPE for this slice — both require a previously-shared state that doesn't exist yet (no Mark-shared snapshot to diff against). Deferral note in `verification.md`.

**Done when:** Vitest assertion finds an interactive button with accessible name "Share with Mark" and the verbatim "This is your private view. You choose what to share." copy in the rendered DOM. Click handler opens the modal (see AC-3).

### AC-3 · C-S2 party-type-aware modal — 3 tabs, Ex functional (C-S2)

Clicking the Share CTA opens a modal dialog (`role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing at the modal heading). Modal carries:

- **Modal heading** — "Share with Mark" (echoes the CTA).
- **Tab affordances** — three pills/tabs in DOM order: `Ex` (active default) · `Solicitor` · `Mediator`. ARIA tabs pattern (same as session-118 ai-coach AC-1): each tab carries `id`, `aria-controls` pointing at the panel id, `aria-selected` on active, roving `tabindex` (active=0, inactive=-1). Arrow keys (ArrowLeft / ArrowRight) move focus along the tablist and activate the new tab.
- **Ex panel (functional)** — two text input fields: `name` (label "Mark's name") + `email` (label "Mark's email", `type="email"`). Both `required`.
- **Solicitor panel (UI-only)** — placeholder copy: *"Form fields TBD per 68f S-1."* (Matches the C-S4 OPEN deferral.)
- **Mediator panel (UI-only)** — same placeholder copy as Solicitor.
- **Modal footer** — primary action button "Send invite" + secondary "Cancel". Per C-S2 verbatim *"phase-1 functionality wires up Ex only"*; clicking "Send invite" on any tab transitions to the confirmation stub since no backend exists (per prototype static-content convention). Cancel + Escape close the modal.

**Done when:** Vitest assertions verify 3 tab buttons in DOM order, AC-3-correct aria wiring, Ex panel rendering both required inputs, Solicitor + Mediator panels rendering the TBD placeholder, arrow-key focus traversal of the tablist, and Escape closing the modal.

### AC-4 · C-S3 selective publish toggles (C-S3)

Inside the Ex panel of the modal (below the name + email inputs), a "What to share" subsection lists checkbox toggles for the Sarah-side picture's sections. Section list is the static fixture set used elsewhere in `/dev/proto/`: **Property** · **Pensions** · **Investments** · **Income** · **Spending** · **Children** · **Other**.

Per C-S3 verbatim: *"Not all-or-nothing. She retains the rest in her private picture; can push them in a later share."* All toggles default-CHECKED (Sarah's typical intent is full share on first share; she can opt OUT of specific sections). Header copy above the toggles: *"By default, all sections share. Uncheck any you want to keep private for now."*

Solicitor and Mediator panels do NOT render the selective-publish toggles (form-fields-TBD covers them; no separate UI to design until C-S4 closes).

**Done when:** Vitest assertion verifies 7 checkbox elements in the Ex panel under a "What to share" heading, each default-CHECKED, each clickable to toggle, and the supporting header copy rendered verbatim.

### AC-5 · Submit transition stub

Clicking "Send invite" on the modal (any tab) replaces the modal body with a single-line confirmation block "Invite sent to {name}." (using the Ex-panel name field value, falling back to "Mark" if empty or on Solicitor/Mediator tabs). Below the confirmation, a stub note: *"State-2 'Invited · hasn't opened' is a future slice; this prototype ends here."* and a "Close" button that closes the modal and returns to the state-1 page (Mark Status card unchanged — no live state transition).

Per CLAUDE.md §"Visual direction" §"Journey wiring" `outbound to = completion-stub` convention, this is the explicit stub point.

**Done when:** Vitest assertion verifies that submit replaces the modal body with the confirmation block, the stub note renders, the Close button is interactive, and clicking Close returns the modal to closed state without state-1 page changes.

### AC-6 · Registry L70 row update + regression-guard

The L70 row for `share-flow` updates atomically: `status: 'spec-only' → 'prototype-built'`; `confidence: 'low' → 'medium'` (tags `multi-actor, high-uncertainty` remain because 4 of 5 R-M1 states + the C-S4 form fields remain spec-only); `openQuestions` cleared (resolution documented in `verification.md` AC-6); `lastTouched: { session: 119, date: '2026-05-22' }`; `links: { spec, prototype, slice }` populated (canvas remains absent — no canvas-port; matches L74 ai-coach precedent).

Regression-guard: an assertion in `tests/unit/app/dev/proto/registry.test.ts` confirms (a) the share-flow row has the new status + confidence + links; (b) no other registry row's `lastTouched.session` changed (paranoia-guard against accidental cross-row edits).

**Done when:** Updated registry row renders correctly in the `/dev/proto/` hub at session-119 deploy; unit tests pass for both the share-flow assertion and the regression-guard.

## In scope

`docs/slices/S-PROTO-share-flow/{acceptance,security,test-plan,verification}.md` · `src/app/dev/proto/share-flow/page.tsx` · `src/app/dev/proto/share-flow/_components/*.tsx` (component breakdown determined at impl time) · `src/app/dev/proto/registry.ts` L70 row update · `tests/unit/app/dev/proto/registry.test.ts` (+1 block + regression-guard) · `tests/unit/proto-share-flow/*.test.tsx` (per-component).

## Out of scope

- M_Reconcile post-share variants (belong to `joint-document-view` slice, registry L67).
- R-M1 states 2-5 (deferred to future `S-PROTO-reconcile-waiting` for states 2-4; `joint-document-view` for state 5).
- C-S1 pending-state CTA + change-while-shared banner (require previously-shared state).
- C-S2 Solicitor + Mediator functional wiring (UI-only per phase-1; functional wires deferred to C-S4 resolution).
- C-S4 Solicitor + Mediator form fields (OPEN per 68f S-1).
- Backend submit wiring (no API call; static prototype).
- AI coach right rail (lives on different host pages; built session 118).
- Activity timeline + carried-over contested items (R-M3 right-rail content).
