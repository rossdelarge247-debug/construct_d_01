# Decouple — Decisions Log

Source-of-truth for locked product/design decisions. Organised by phase.
Updated as discussion progresses. Build waves consume from this.

---

## PHASE 1 · Onboard

### Screen 01 — Workspace Shell: split into two

**01a · Workspace · Home (signed-out)**
- Existing `Workspace Shell.html`, renamed.
- Pre-auth landing / marketing surface.

**01b · Workspace · Dashboard (signed-in) — NEW**
- Three-column layout.
- **Left:** Sarah's journey rail (sections list + inline journey router — same pattern used on inner screens).
- **Center:** hero-sized, single-focus **AI question wizard card**.
  - Source: Open Banking transaction data.
  - Example: "£4,387 · Acme Ltd · 25 Jan — Is this your salary?" with Yes / No / Edit / Ask-me-later.
  - Source chip (bank + date) visible on card.
  - Answering animates to the next question; stays on dashboard.
- **Right:** categorised to-do panel, **4–6 items**, two groups:
  - **Outside Decouple** (MIAM, gov.uk divorce application, etc.)
  - **In Decouple** (upload pension statements, confirm property title, etc.)
  - On completion → celebration state.
  - No Mark/collab items at this stage (pre-sharing).
- **Top nav:** signed-in variant — account menu, notifications, Sarah avatar.

### Stubs to add in Wave 1
- **Bank connection flow** — placeholder screen (design later).
- **Empty-dashboard / pre-connection state** — placeholder screen.
- **First-time walkthrough** — indicative placeholder.
- **Children's arrangements** — nav-only stub.
- **Evidence uploads** — nav-only stub.

Stub treatment = Option 3 (placeholder screens for journey-critical stubs;
nav-only for Children + Evidence).

---

## PHASE 2 · Disclose

### Screen 02 — Your Picture: dual-view versioned model

- **Remove "Needs your attention"** panel — superseded by dashboard to-do list.
- **Re-integrate Share with Mark modal** into journey.

**View dropdown in header** (built as dropdown for future lawyer/mediator expansion):
- Private (default landing)
- Shared with Mark

**Versioning & deltas:**
- First share → creates **v1 snapshot**.
- Each subsequent edit = **one delta at item level** (edits to same item collapse to final value).
- **Held-back deltas accumulate** until shared or discarded.
- Mark cannot see held-back items (no ghost indicator).
- **No version history UI here** — version history only relevant at proposal stage.

**Dynamic Share CTA states:**
- No share yet → `Share with Mark` (primary)
- In sync → muted `Shared — up to date · v2 · 14 Nov`
- Deltas pending → **accent-coloured** `Share updates with Mark (3)`

**Pending-deltas pill in header** — click to preview delta list without opening share modal.

**Share modal with per-delta checklist:**
- Lists every delta: item, old value, new value, source chip.
- Each delta has a checkbox (share these, hold those).
- Unchecked deltas stay in private state.
- Confirm → creates v2/v3/... containing only checked items.

**Subtle delta markers** on changed items in Private view (small dot/ring on row).

**Version stamps:**
- Private view: "Private · last updated 14 Nov"
- Shared view: "Shared with Mark · v2 · 14 Nov"

**Mark's notification:** email + in-app, showing only published deltas + link to updated household view.

**Invite mechanic:** sharing IS the invitation. No separate invite step.

---

## PHASE 3 · Reconcile

### Screens 03 (Initial merge) + 04 (Contested focus) — kept as two separate canonical screens. Different beats.

**Item states (6):**
1. Agreed
2. Contested
3. Estimated / Unverified → actions: Confirm / Add evidence
4. Gap (one side has nothing)
5. New (one side added after initial share)
6. Excluded from matrimonial pot (opt-in, per item, with reason)

**Per-item actions in Reconciliation phase:**
- Accept · Challenge · Request evidence · Add evidence
- Counter-propose is **NOT** available here — lives in Settlement.
- No "split the difference" here — this phase is about truth + evidence.

**Per-row comment thread:**
- Opens in a **side panel**.
- Two-way discussion between Sarah & Mark.
- Supports attaching evidence.
- Attached evidence appends to the item itself.

**Carryover from Your Picture:**
- Mark's picture = same dual-view model (symmetry).
- Household picture = shared items only; held-back items never appear.
- Promoting a held-back delta to household = **two-step flow**:
  1. Sarah shares it (Private → Shared).
  2. Sarah explicitly "merges into household" as second confirmation.
  3. Merged item flagged as **New** in Mark's household view.

**Handshake — partial household view:**
- Household view exists as soon as **first party** shares.
- Mark's side shows handshake states:
  - *Awaiting Mark's response*
  - *Mark has yet to open*
  - *Mark has started building his picture*
  - *Mark has shared his picture* → full reconciled view unlocks
- Trigger: email + in-app notification to Sarah when Mark shares.

**Attribution tone:** humanised — "Sarah said" / "Mark said", not "you/they".

**Chapters:** Property, Pensions, Income, Children.

**AI role in Reconciliation:**
- Cross-references, sanity checks, evidence age, parity checks, midpoint flagging.
- AI prioritises contested items by impact (biggest delta first).
- AI proposes resolutions inline (midpoints, swaps, evidence requests).
- Transparency surface: "why AI flagged this" reasoning log per item.
- Case law / strategy snippets surface on Proposal screens primarily.
- On Household/Reconciliation screens, AI is **flag-only mode** (no persistent rail; pings only when something looks off).

**Exclusion from matrimonial pot:**
- Two-sided. Same Accept / Challenge / Request-evidence machinery.

### Screen 04 — Contested items focus
- Separate page, different scenario example (not a filter of 03).
- "Rolling up sleeves" beat.

### Screen 10 — Reconciliation v2 (expanded card shell)

*Implemented in `Reconciliation.html` + `reconcile/rc_shell.jsx`, `rc_components.jsx`, `rc_data.jsx`.*

**Layout — three columns:**
- **Left rail:** chapter nav (All / Property / Pensions / Income / Children) + status-filter legend.
- **Center:** expanded card list (NOT list/detail). Each item is a full card showing both sides, evidence chips, AI flags, per-item actions.
- **Right rail:** contextual — default = reconciliation guide + activity feed; on row activation = conversation thread for that item, with back-arrow to restore default.

**Right-rail contextual pattern (locked):**
- Reconciliation screens: default rail content swaps to thread on activation (no persistent strategy rail in this phase — matches flag-only AI decision).
- Proposal/Settlement screens: persistent Strategy rail gains a `Strategy | Discussion` tab pair on row activation (no layout shift).
- Demo of both patterns shown in v2 for reference.

**Chapter navigation:**
- **Default landing view = All chapters** (not a single chapter).
- All view groups items by chapter with small uppercase label + count + rule above each group.
- Individual chapter selection collapses to that chapter only.
- "All" button sits at top of rail with summed totals + attention dot.

**Status filter:**
- Agreed / Contested / Gap / New pills in the summary strip.
- Filter applies **across all chapters** (works in both All and single-chapter views).
- Every chapter contains a mix of states in the data — filter is always meaningful.

**Handshake gating:** center + right content gated on `handshake === "shared"`. Pre-share = waiting state.

**Focused item = single source of truth:** card highlight + right-rail thread driven by one `focusedId`. Clicking card toggles; back-arrow in rail clears.

---

## PHASE 4 · Settle (screens 05–09) — TO DISCUSS

*(Wave 2)*

---

## PHASE 5 · Finalise (screens 10–14) — TO DISCUSS

*(Wave 3)*

---

## RECONCILIATION DECISIONS (Nov 2026 session)

Outcomes from reviewing `Design Inventory.html` against today's artefacts.

### Canonical screen set — 14 screens (was 12)
Added two previously-uncertain screens:
- **Screen 11 · Preview documents** (`Settlement - Preview.html`) — between Generate and Pre-flight. The beat where the user first reads the legal output.
- **Screen 13 · Review decision** (`Settlement - Decision.html`) — £0 / £250 / £450 choice between Pre-flight and Submit. Business-model beat.

Final numbering (Sarah's linear journey):
1. Workspace shell · Home
2. Your Picture · disclosure
3. Our Household Picture · initial merge
4. Reconciliation · contested focus (was screen 04; now `Reconciliation.html`, the v2 three-column shell)
5. Settlement · Build
6. Settlement · Review & send
7. Settlement · Redline (friction)
8. Settlement · Progress board
9. Settlement · Agreement reached
10. Settlement · Generate documents
11. Settlement · Preview documents *(added)*
12. Settlement · Pre-flight (friction)
13. Settlement · Review decision *(added)*
14. Settlement · Submitted

### Phase 3 · both screens kept
- Screen 03 = `Our Household Picture v3.html` — initial merge beat.
- Screen 04 = `Reconciliation.html` (v2 three-column shell in `reconcile/rc_*.jsx`) — contested focus / rolling-up-sleeves beat.
- Different beats, different affordances. Not a filter-state of each other.

### Stubs included in inventory (placeholders exist)
- Bank connection flow
- First-time walkthrough
- Empty-dashboard / pre-connection state
- Children's arrangements (nav-only)
- Evidence uploads (nav-only)

### System-wide decisions — CONFIRMED
- **A · Journey router placement** — inline in each screen's left column. Cut the floating lozenge variant.
- **B · Master switcher chrome** — thin top bar in `Decouple.html`: "Screen N of 14" + prev/next + dropdown jump. Separate from the in-product journey router.
- **C · Friction states as separate screens** — not tweak toggles. Story passes through them once.
- **D · Tweaks panel** — removed from the consolidated file. Canonical state baked in.
- **E · Shared libraries** — merge `phase4/` + `phase5/` into a single `/lib` folder. Each screen = one JSX file importing from `/lib`.

### Archive policy
Cut files are **archived, not deleted**. Mirrored structure under `archive/` preserves original paths (e.g. `archive/shell2/v1.jsx`, `archive/reconcile/v1_es2.jsx`).

---

## CROSS-CUTTING

### Persistent strategy rail
- **Proposal/Settlement screens:** persistent right rail with case law, reasonableness cues, strategy observations, counter-strategy awareness.
- **Household/Reconciliation screens:** flag-only, no rail.

### Deliverables
- `Design Inventory.html` — "what and why" artefact, kept updated.
- `Decouple.html` — clickable switcher prototype (master journey view).
- `components/` — master component file, single source of truth for shared primitives:
  - Journey rail
  - Share with Mark modal (with delta checklist)
  - Dynamic Share CTA
  - Delta markers
  - View dropdown (Private / Shared)
  - Pending-deltas pill
  - Dashboard to-do panel
  - Handshake state indicators
  - Per-row comment side panel
  - AI flag primitive
  - Strategy rail (for Proposal screens)

### Mark's mirror journey — out of scope for now
Design after main journey is locked.
