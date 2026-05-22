# S-PROTO-ai-coach

**Category:** prototype

**Journey:** orphan — pending wiring in slice S-PROTO-proposal-builder (registry L73, currently `spec-only`). The AI coach right rail is the right-third column of the future Settle-phase proposal-builder host page; this slice ports the rail shell + card taxonomy in isolation so the pattern can be reviewed before the host surface is built.

## Source spec

Phase 3 sequence position per HANDOFF-74 L80-82 verbatim: *"P2+: ... `S-PROTO-ai-coach` (Settle phase) ..."*. Session 117 closed `S-PROTO-section-confirm` (PR #224, squash-merged as `b2677865`); on-sequence advance lands here.

Locked decisions live in `docs/workspace-spec/68d-decisions-settle.md` §S-A L66-90. Cross-phase shell + card taxonomy reference live in `docs/workspace-spec/68a-decisions-crosscutting.md` §C-A L107-119.

Verbatim spec quotes used in AC framing below:

- **S-A1 (68d L68-69):** *"Three tabs: **Comments** · **AI coach** · **Activity**. AI coach default in Settle phase."*
- **S-A2 (68d L71-76):** *"Four card types (per 68a C-A2): **Court reasonableness** (red flag if risk — e.g. \"No pension sharing is unusually weak\") · **Fairness check** (amber notice — e.g. \"3-year spousal is on the longer end\") · **Coaching** (green positive — e.g. \"Your home split is clean\") · **On this comment** (contextual response to a thread)"*
- **S-A3 (68d L78-79):** *"Decouple-AI-styled intro paragraph framing the draft. Template: \"Your draft sits at 54/46 to you. That's within normal court range, but two items will likely be challenged — here's what to expect.\" + \"N FLAG · M NOTICE\" count badges."*
- **S-A4 (68d L81-82):** *"Each coach card has a collapsible \"SHOW REASONING\" affordance. Keeps the panel scannable; deep context on tap."*
- **S-A5 (68d L84-85):** *"Within a coach card, an \"FALLBACK POSITIONS\" sub-section offers 1-3 alternative proposals with one-line rationale each (e.g. \"Open with 20% share · £36,082 to Mark · likely middle ground\", \"Offset against home equity · Keep pension, Mark takes more of home\"). User can one-tap adopt."*
- **S-A6 / C-A3 (68d L87-88):** *"AI suggestions are guidance based on typical court outcomes for cases like yours. Not a substitute for legal advice."*

## Pre-flight notes

- **Spec-only-not-canvas-port shape.** Decoded `docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2 - Standalone.html` was surveyed at session 118 turn 0; no artboard named `M_AiCoach`, `M_Coach`, or `M_Settle` exists. The canvas inventory is M_Dashboard / M_FAQ / M_Form / M_HowItWorks / M_Landing / M_Preflight / M_Pricing / M_Reconcile / M_Redline / M_SignIn / M_SignUp / M_Todos / M_YourPicture. No `Linked canvas:` field on this slice; canvas-fidelity gate stays dormant. Per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)" §"When canvas-as-source isn't enough" — falls into the *"cross-screen design-system extraction work"* / *"multi-author production hand-off"* spirit but for a different reason: the source canvas itself is absent. AC framing drives off spec quotes (above) verbatim.
- **Registry L74 open Q resolved at session 118 turn 1.** *"Invocation pattern + conversational scope?"* → always-on rail (default-open in Settle), cards-only (no free-chat input). Aligns with S-A1 verbatim and the structured 4-type taxonomy from S-A2. User-selected during scoping.
- **Host surface scoping.** Standalone preview at `/dev/proto/ai-coach`. Coach-surface components extract under `_components/` so the future `S-PROTO-proposal-builder` slice can mount them in its right-third column without copying.
- **Static prototype content.** Per `prototype` category + registry L74 `confidence: low` + `tags: ['ai-dependent', 'high-uncertainty']`, the cards render realistic mock content with no live Anthropic API call. Mock content is the Sarah/Mark fixture used elsewhere in `/dev/proto/`.
- **Card taxonomy scoping.** S-A2 names 4 types; C-A2 (68a L112-117) names 5 (the additional 5th is *"Jump-to link — deep-link to the relevant section"*). This slice ships the 4 Settle-specific types from S-A2. C-A2 Jump-to-link is recorded under §"Architectural deferrals" — it's a cross-phase navigation primitive better extracted alongside the proposal-builder host that has sections to deep-link into.
- **Test-pain audit (spec 72d §3).** Verbatim: *"If any unit test in a slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."* No external collaborators needed for this slice; static-data prototype → unit tests assert rendered structure with zero mock setups required. Test-pain threshold cleared trivially.

## Acceptance criteria

### AC-1 · Route + 3-tab right rail shell (S-A1)

Route `/dev/proto/ai-coach` mounts a standalone preview of the Settle-phase right rail as a self-contained component. Rail header carries three tab affordances: `Comments` · `AI coach` · `Activity`. AI coach is the default-active tab on mount per S-A1 verbatim: *"AI coach default in Settle phase."*. Other two tabs are click-switchable to placeholder panels (single-line stub copy each; full Comments/Activity surfaces deferred). Standalone-preview layout: the rail renders centred at a representative max-width (≈720px) so reviewers can see the pattern in isolation; right-third positioning within a viewport is a proposal-builder host responsibility (deferred to `S-PROTO-proposal-builder`, registry L73, `spec-only`).

Tab/panel relationship follows the ARIA APG tabs pattern: each tab carries a stable `id`, `aria-controls` pointing at the panel id, and `tabindex` reflecting roving focus (active=0, inactive=-1); the panel carries `aria-labelledby` pointing at the active tab id. Arrow keys (ArrowLeft / ArrowRight) move focus along the tablist and activate the new tab; Tab exits to the panel.

**Done when:** Vitest assertion on rail render shows 3 tab buttons in DOM order [Comments, AI coach, Activity] with `aria-selected="true"` on AI coach + `id="tab-{slug}"` + `aria-controls="panel-{slug}"`. Panel carries matching `id="panel-{active}"` + `aria-labelledby="tab-{active}"`. Switching to Comments or Activity hides the AI coach panel and renders the stub.

### AC-2 · Four coach card variants (S-A2)

Four CoachCard component variants render under the AI coach tab, one per type from S-A2:

1. **Court reasonableness** — red-flag visual treatment. Example title text uses S-A2 verbatim phrasing: *"No pension sharing is unusually weak"*. Mock card.
2. **Fairness check** — amber notice. Example title: *"3-year spousal is on the longer end"*. Mock card.
3. **Coaching** — green positive. Example title: *"Your home split is clean"*. Mock card.
4. **On this comment** — neutral threaded-response treatment. Example title: *"On this comment"* with a one-line thread quote and a one-line response. Mock card.

Colour semantics map to the `tokens.color.*` system where available; page-local colour constants if no existing token covers the semantic (same precedent as session-117's `AI_PURPLE` family in section-confirm).

**Done when:** Vitest assertion finds 4 cards in DOM order matching the type sequence above, with each carrying a `data-card-type` attribute set to the type's slug (`court-reasonableness`, `fairness-check`, `coaching`, `on-this-comment`).

### AC-3 · Summary banner with count badges (S-A3)

Above the card stack, a SummaryBanner component renders the Decouple-AI-styled intro paragraph per S-A3 verbatim template: *"Your draft sits at 54/46 to you. That's within normal court range, but two items will likely be challenged — here's what to expect."* — followed by two count badges showing `2 FLAG` · `1 NOTICE` (derived from the AC-2 mock cards: 1 red flag from court-reasonableness, 1 amber notice from fairness-check; the *"2 FLAG"* in the example demonstrates the template arithmetic rather than the exact mock count — the AC mandates the verbatim template copy as the visible string).

**Done when:** Vitest assertion finds the summary banner element, asserts the intro paragraph text matches the S-A3 verbatim template, and asserts both count badges are rendered with labels `FLAG` and `NOTICE`.

### AC-4 · SHOW REASONING toggle + FALLBACK POSITIONS subsection (S-A4 + S-A5)

Each of the 4 coach cards carries a `SHOW REASONING` toggle that, when activated (click or Enter), expands an inline collapsible region with mock reasoning content (one paragraph of prose). Initial state is collapsed. The court-reasonableness card additionally carries a `FALLBACK POSITIONS` subsection with 3 alternative proposals per S-A5 verbatim example pattern: each proposal carries one-line rationale + a `Adopt` button (one-tap affordance; click handler is a no-op stub for prototype).

**Done when:** Vitest assertions: (a) each card's SHOW REASONING starts collapsed (reasoning content absent from DOM); (b) clicking the toggle expands it (reasoning content present); (c) court-reasonableness card carries 3 FALLBACK POSITIONS entries, each with rationale text + an Adopt button; (d) the other 3 cards do NOT carry a FALLBACK POSITIONS subsection.

### AC-5 · Advisory footer copy (S-A6 / C-A3)

The AI coach panel renders a footer disclaimer at the bottom with the C-A3 verbatim copy: *"AI suggestions are guidance based on typical court outcomes for cases like yours. Not a substitute for legal advice."*. Footer is part of the rail (not the page chrome) and only visible when the AI coach tab is active.

**Done when:** Vitest assertion finds the footer copy verbatim under the AI coach panel, and asserts it is hidden when Comments or Activity tabs are active.

### AC-6 · Registry update + journey + DoD-6 evidence

Registry row L74 (`ai-coach`) transitions `status: 'spec-only'` → `status: 'prototype-built'`. `lastTouched.session` set to `118` and `lastTouched.date` set to `'2026-05-22'`. `links.prototype` set to `'src/app/dev/proto/ai-coach/'`. `links.slice` set to `'docs/slices/S-PROTO-ai-coach/'`. `confidence` bumps `low` → `medium` (locked spec content now has a working prototype against it; AI-wiring uncertainty preserved as `ai-dependent` tag). `openQuestions` updated to record the resolution: `['Invocation pattern locked: always-on rail, cards-only']`.

Journey field declared as orphan (header above) per CLAUDE.md §"Journey wiring" — pending wiring in `S-PROTO-proposal-builder`. The journey-declared hook should pass without advisory fire.

DoD-6: this slice's open 68d/68f decisions touched are the registry L74 open Q. Resolved as recorded above. No new 68f opens introduced.

**Done when:** Vitest assertion against `registry.test.ts` verifies the L74 row's new status/confidence/lastTouched/links/openQuestions values. `acceptance.md` header carries the `**Journey:** orphan ...` line. `verification.md` records evidence per AC.

## Architectural deferrals

- **C-A2 Jump-to-link card type.** 68a C-A2 names 5 card types; S-A2 names the 4 Settle-specific ones. The Jump-to-link variant is a cross-phase navigation primitive (deep-link to a relevant section). Deferred to a future cross-cutting slice once host surfaces (proposal-builder, settlement-redline) exist to deep-link into. No structural debt — the CoachCard component contract supports an additional variant via the existing `type` prop discriminant.
- **Live AI wiring (Anthropic API).** Per the `ai-dependent` + `high-uncertainty` registry tags, this slice ships static mock cards only. A future slice will wire card generation to live AI responses against a real draft state — likely paired with `S-PROTO-proposal-builder` or its successor.
- **Full Comments + Activity tabs.** Stub placeholder panels render under the non-default tabs. Comments threading + Activity feed are full surfaces in their own right; deferred to dedicated slices.
- **Adopt button handler.** Per AC-4, the one-tap Adopt affordance on FALLBACK POSITIONS is a no-op stub. Wiring to actual proposal-builder state is deferred to the proposal-builder slice (since there's no draft state to mutate yet).

## §Status

Drafted session 118 turn 2 after spec-only-not-canvas-port shape confirmed via decoded canvas survey. Impl + tests + verification.md fills shipped session 118; commits `36e37e6` (slice docs) + `6da61b5` (impl + tests + registry) on branch `claude/exciting-clarke-PjeRw`. 49/49 ai-coach + registry tests · 896/896 full unit suite · typecheck + ESLint clean. PR not opened in-session.
