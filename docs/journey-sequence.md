# Journey Sequence — left-to-right build checklist

The canonical user journey through Decouple, ordered by what the user experiences. Build left-to-right: earlier flows before later ones, critical path before enhancement.

## Process for each flow

Before building any flow, answer these four questions in order:

1. **Canvas material?** Check `docs/design-source/` for artboards. If the decoded canvas has a substantial artboard → canvas-as-source port. If none → spec-only build from `docs/workspace-spec/`.
2. **Spec coverage?** Which spec sections govern this flow? Quote the relevant sections in `acceptance.md`.
3. **Inbound/outbound wiring?** What screen does the user arrive FROM, and what do they navigate TO? Declare `**Journey:**` field in `acceptance.md`.
4. **Gaps?** What canvas, copy, or spec material is missing? What decisions are unresolved? Record in `openQuestions` on the registry row.

Build only when questions 1-3 are answered. If canvas or spec is insufficient, flag as blocked and move right to the next buildable flow.

## Status legend

- `DONE` — prototype-built, clickable, tested
- `SHELL` — route exists, content is placeholder
- `READY` — canvas-drafted or spec-ready, can be built next
- `BLOCKED` — missing canvas, spec, or decision; cannot build yet
- `N/A` — not prototypable (backend-dependent, legal, etc.)

## The journey

### Stage 1 — Acquisition (pre-auth, public)

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 1 | Marketing landing | `marketing-landing` | DONE | Own canvas at `docs/design-source/marketing-landing/` | Needs CTA → #5 or #7 |
| 2 | How it works | `how-it-works` | SHELL | Artboard in mobile-screens-v2 | Canvas-port needed |
| 3 | Pricing | `pricing` | BLOCKED | Artboard in mobile-screens-v2 | Pricing decision unresolved (spec 56 L8.2) |
| 4 | FAQ & Trust | `faq-trust` | SHELL | Artboard in mobile-screens-v2 | Canvas-port needed |

**Stage 1 verdict:** Marketing landing is built. 2 shells need canvas-ports; Pricing is blocked on a business decision. These are non-blocking for the journey — user can reach interview from marketing CTA directly.

### Stage 2 — Engagement (pre-auth, pre-signup)

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 5 | Pre-signup interview (O1-O8) | `pre-signup-interview` | DONE | Rich per-screen canvas + JSX at `docs/design-source/pre-signup-interview/` | O7+O8 deferred; exit → #7 |
| 6 | AI plan preview | `ai-plan-preview` | BLOCKED | Spec 74 only; no canvas; AI-dependent | Requires AI extraction pipeline |

**Stage 2 verdict:** Interview is built. AI plan preview is blocked on backend — skip for now; wire interview exit directly to sign-up.

### Stage 3 — Auth boundary

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 7 | Sign up | `sign-up` | SHELL | Artboard in mobile-screens-v2 | Canvas-port needed; spec 65a |
| 8 | Sign in | `sign-in` | READY | Artboard in mobile-screens-v2 | Canvas-port needed |
| 9 | Magic-link sent | `magic-link-sent` | BLOCKED | No canvas, no spec | UX design needed |

**Stage 3 verdict:** Sign-up shell exists but needs canvas-port. Sign-in has canvas material. Magic-link is blocked. For journey walkthrough: build sign-up as pass-through to welcome-tour.

### Stage 4 — Onboarding (post-signup)

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 10 | Welcome tour | `welcome-tour` | DONE | Own canvas at `docs/design-source/welcome-tour/` | Exit → #11 or #15 |
| 11 | Moment 1 acknowledgement | `moment-1-ack` | DONE | Spec 67 L86-121 | Built — recap bullets, safety-flag toggle, Exit this page |
| 12 | Moment 2 pre-bank profiling | `moment-2-profiling` | DONE | Spec 67 L128-560 | Built — P1 property, P2 self-employed (3), P4 pensions (3), P6 heads-up |
| 13 | Safeguarding signposting | `safeguarding-signposting` | DONE | Spec 67 L813-845 | Built — crisis helplines, 3 CTAs, Exit this page component |

**Stage 4 verdict:** COMPLETE. Welcome tour, safeguarding signposting, Moment 1 acknowledgement, and Moment 2 pre-bank profiling all built.

### Stage 5 — Bank connection

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 14 | Bank picker | `bank-picker` | DONE | Tink Link IS the picker; `/api/bank/connect` route generates URL; `tink-client.ts` (321L) | Built — Open Banking CTA + 5 dev-mode scenarios |
| 15 | Tink iframe mid-flow | `tink-mid-flow` | DONE | Popup mode in callback route; handles popup/iframe/redirect | Built — connecting spinner + popup launch |
| 16 | Callback success | `callback-success` | DONE | Full pipeline at `/api/bank/callback` (133L): auth exchange → accounts → transactions → transform → postMessage | Built — provider, account type, transaction count, date range |
| 17 | Callback error/retry | `callback-error-retry` | DONE | `redirectWithError()` exists in callback route | Built — error message + retry CTA |
| 18 | Manual entry fallback | `manual-entry-fallback` | PARTIALLY READY | `test-scenarios.ts` (644L) provides data shape; no entry UI yet | Entry form + scenario loader needed |

**Stage 5 verdict:** NOT blocked. 3,801 lines of existing Tink integration + 5 synthetic test scenarios exist from V2 foundational work. The heavy backend is done. Prototype work: build a bank-connect screen that launches Tink Link (live) or loads test scenarios (dev mode), shows success/error states, wires to hub. Biggest opportunity in the journey for reuse.

### Stage 6 — Hub + Build (Sarah's Picture)

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 19 | Hub Day 1 (empty state) | `hub-day-1` | BLOCKED | No canvas | Empty-state UX needed |
| 20 | Hub state A (mid-build) | `hub-state-a-mid-build` | BLOCKED | No canvas | Section-completion ordering needed |
| 21 | Section-confirm pattern | `per-section-confirm` | DONE | Artboard in mobile-screens-v2 | Built (hub + categorise + confirm-recurring) |
| 22 | Bank-rec: Categorise | `bank-rec-categorise` | DONE | Artboard in mobile-screens-v2 | Built |
| 23 | Bank-rec: Confirm recurring | `bank-rec-confirm-recurring` | DONE | Artboard in mobile-screens-v2 | Built |
| 24 | Bank-rec: Manual entry | `bank-rec-manual-entry` | READY | Artboard in mobile-screens-v2 | Canvas-port needed |
| 25 | Bank-rec: Resolve duplicate | `bank-rec-resolve-duplicate` | READY | Artboard in mobile-screens-v2 | Canvas-port needed |
| 26 | Bank-rec: Split | `bank-rec-split` | READY | Artboard in mobile-screens-v2 | Canvas-port needed |
| 27 | Bank-rec: Balance check | `bank-rec-balance-check` | READY | Artboard in mobile-screens-v2 | Canvas-port needed |
| 28 | Hidden-asset prompts | `hidden-asset-prompts` | BLOCKED | Spec only | Trigger criteria needed |
| 29 | Your Picture (private) | `your-picture-private` | READY | Artboard in mobile-screens-v2 ("Your Picture" + "Build your picture") | Canvas-port needed — umbrella container for forms |
| 30 | Document picker | `document-picker` | BLOCKED | No canvas, no spec | Upload UX needed |
| 31 | Hub state B (review) | `hub-state-b-review` | BLOCKED | No canvas | Trigger criteria needed |
| 32 | Hub Day 7 (state F) | `hub-day-7-state-f` | DONE | Own canvas at `docs/design-source/post-connect-dashboard/` | Built (post-connect dashboard) |
| 33 | Todos | `todos` | READY | 5 variants in mobile-screens-v2 | Canvas-port needed; variant choice unresolved |

**Stage 6 verdict:** Section-confirm hub + 2 forms + dashboard are built. 4 bank-rec forms + Your Picture + Todos are READY (canvas exists). Hub Day 1 + mid-build states are blocked. For journey walkthrough: Your Picture is the highest-priority build — it's the container that houses the bank-rec forms and represents "Sarah's Picture" in the product narrative.

### Stage 7 — Reconcile (multi-actor)

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 34 | Share flow | `share-flow` | DONE | Spec-driven (68a §C-S + 68c §R-M) | Built |
| 35 | Joint document view | `joint-document-view` | READY | 5 M_Reconcile variants in mobile-screens-v2 | Canvas-port needed; permissions UX unresolved |
| 36 | Conflict card | `conflict-card` | BLOCKED | Spec 68c only; no canvas | Tone + resolution-path UX needed |
| 37 | Reconciliation queue | `reconciliation-queue` | BLOCKED | Spec 68c only | Ordering + status display needed |
| 38 | Counter-proposal request | `counter-proposal-request` | BLOCKED | Spec only | Respondent-path UX needed |

**Stage 7 verdict:** Share flow is built. Joint document view is READY (canvas exists). Remaining are blocked on spec/canvas.

### Stage 8 — Settle

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 39 | Proposal builder | `proposal-builder` | BLOCKED | Spec 68d only; no canvas | Anchor visualisation + what-if explorer UX needed |
| 40 | AI coach | `ai-coach` | DONE | Spec-driven (68d §S-A + 68a §C-A) | Built; needs host (proposal-builder) |
| 41 | Counter | `counter` | BLOCKED | Spec only | Suggestion-quality threshold needed |
| 42 | Settlement redline | `settlement-redline` | READY | Artboard in mobile-screens-v2 | Canvas-port needed |
| 43 | Negotiation history | `negotiation-history` | BLOCKED | No canvas, no spec | Timeline UX needed |

**Stage 8 verdict:** AI coach is built but needs its host (proposal-builder). Proposal-builder is spec-only — needs canvas or a spec-driven build. Settlement redline is READY.

### Stage 9 — Finalise

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 44 | Consent order generation | `consent-order-generation` | BLOCKED | Spec 68e only | Doc template + field mapping needed |
| 45 | Pre-flight advisory | `preflight-advisory` | READY | Artboard in mobile-screens-v2 ("Pre-flight") | Canvas-port needed |
| 46 | Fork flow | `fork-flow` | BLOCKED | Spec 68e only | Trigger criteria + split mechanics needed |
| 47 | Court submit | `court-submit` | BLOCKED | No canvas, no spec detail | Legal + e-submission research needed |
| 48 | Post-order implementation | `post-order-implementation` | BLOCKED | No canvas, no spec detail | Scope + reminders needed |

**Stage 9 verdict:** Pre-flight advisory is READY. Everything else is blocked on spec/legal.

### Cross-cutting (not journey-ordered)

| # | Flow | Registry ID | Status | Source material | Wiring gap |
|---|------|------------|--------|-----------------|------------|
| 49 | Trust band | `trust-band` | READY | Artboard in mobile-screens-v2 | Position discipline unresolved |
| 50 | Exit-this-page footer | `exit-this-page-footer` | BLOCKED | Spec only | Behaviour spec needed |
| 51 | Account admin | `account-admin` | BLOCKED | Spec 75 only | V1 minimum scope needed |
| 52 | Invitation landing | `invitation-landing` | BLOCKED | Spec 67a only | Inherited-context display needed |
| 53 | Legal trio | `legal-trio` | BLOCKED | Spec 56; legal review pending | Legal content needed |
| 54 | Global AI coach surface | `global-ai-coach-surface` | BLOCKED | No canvas | Invocation pattern needed |
| 55 | Notifications | `notifications` | BLOCKED | No canvas, no spec | Channel set needed |

## Critical path for testable end-to-end journey

The minimum set of screens needed for a user to walk through the complete Decouple experience. Build these first, left to right.

```
Marketing  →  Interview  →  Sign-up  →  Welcome  →  [Hub]  →  Build forms  →  Your Picture  →  Dashboard  →  Share  →  [Proposal]  →  AI Coach  →  [Finalise]
  DONE          DONE        SHELL       DONE       STUB       4 READY        READY           DONE         DONE      BLOCKED        DONE        STUB
```

### Build order for critical-path gaps

| Priority | Flow | What's needed | Effort |
|----------|------|---------------|--------|
| CP-1 | Sign-up (#7) canvas-port | Port artboard from mobile-screens-v2; wire interview exit → sign-up → welcome-tour | Small |
| CP-2 | Hub stub (#19) | Minimal hub landing that shows "Your sections" with links to build forms + Your Picture | Small |
| CP-3 | 4 remaining bank-rec forms (#24-27) | Canvas-port from mobile-screens-v2; add to section-confirm hub | Small each |
| CP-4 | Your Picture container (#29) | Canvas-port from mobile-screens-v2; umbrella for all section-confirm forms | Medium |
| CP-5 | Proposal builder stub (#39) | Spec-driven; host for AI coach rail; wire Share → Proposal → AI Coach | Medium |
| CP-6 | Finalise stub (#44-48) | Minimal "Your consent order is ready" completion screen | Tiny |

### Enhancement flows (build after critical path)

| Priority | Flow | Effort |
|----------|------|--------|
| E-1 | How it works canvas-port (#2) | Small |
| E-2 | FAQ & Trust canvas-port (#4) | Small |
| E-3 | Sign-in canvas-port (#8) | Small |
| E-4 | Todos canvas-port (#33) | Medium |
| E-5 | Joint document view (#35) | Medium |
| E-6 | Settlement redline (#42) | Medium |
| E-7 | Pre-flight advisory (#45) | Small |
| E-8 | Trust band (#49) | Small |
| E-9 | Reconcile waiting states (#5 in SESSION-CONTEXT) | Medium |

## Rules

1. **Build left to right.** Don't build flow #29 before #7 is at least a shell. Earlier journey stages take priority.
2. **Critical path before enhancement.** CP-1 through CP-6 before E-1 through E-9.
3. **Canvas-port when available.** If a decoded artboard exists in mobile-screens-v2, use canvas-as-source. Don't spec-invent what's already designed.
4. **Stub when blocked.** If a flow is BLOCKED (no canvas, no spec, unresolved decision), build a minimal stub screen that acknowledges the step and wires to the next flow. Don't skip it — the journey must be walkable even if some screens are stubs.
5. **Wire every build.** Every new flow must declare `**Journey:**` inbound/outbound in its `acceptance.md`. After building, verify you can click from the previous flow TO this flow AND from this flow to the NEXT flow.
6. **Update this doc.** When a flow moves from READY/SHELL/BLOCKED → DONE, update this checklist in the same PR.
