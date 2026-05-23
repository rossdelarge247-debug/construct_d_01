# Session 120 Pre-flight Context Block (carrying session 119 wrap delta)

## Session 119 wrap delta — read this first

Session 119 closed `S-PROTO-share-flow` AC-1..AC-6 on branch `claude/cool-maxwell-jKu6e` (4 ahead of main; PR #226 open). Spec-only-not-canvas-port shape — decoded mobile-screens-v2 canvas had no M_Share/M_Invite/M_Waiting artboard; the 5 existing M_Reconcile* variants all depict post-share contested-focus joint-doc views (belong to future `joint-document-view` slice at registry L67). AC framing drove off 68a §C-S (Share modal + CTA) + 68c §R-M (Mark status machine + waiting states) verbatim quotes.

**Phase 3 sequence exhausted.** `S-PROTO-share-flow` was the last slice on the HANDOFF-74 L80-82 sequence. Future sessions shift to off-sequence priorities or Phase C engineering.

### What shipped on branch `claude/cool-maxwell-jKu6e` (4 commits; PR #226)

| Surface | Change | AC |
|---|---|---|
| `docs/slices/S-PROTO-share-flow/{acceptance,security,test-plan,verification}.md` | Slice docs (4 files) | scaffold + evidence |
| `src/app/dev/proto/share-flow/page.tsx` | State-1 "Not invited" destination with header, hero, body copy, Mark Status card, soft reminder | AC-1, AC-2 |
| `src/app/dev/proto/share-flow/_components/JoinedAvatarsHero.tsx` | Overlapping Sarah (filled) + Mark (dashed placeholder) avatars | AC-1 |
| `src/app/dev/proto/share-flow/_components/MarkStatusCard.tsx` | "Mark · Not invited" card with "Share with Mark" CTA | AC-1, AC-2 |
| `src/app/dev/proto/share-flow/_components/ShareModal.tsx` | Party-type-aware modal (Ex/Solicitor/Mediator tabs), ARIA tabs, focus trap, submit stub | AC-3, AC-5 |
| `src/app/dev/proto/share-flow/_components/SelectivePublishToggles.tsx` | 7-section checkbox list, default-checked | AC-4 |
| `src/app/dev/proto/registry.ts` L70 | status spec-only → prototype-built, confidence low → medium, openQ cleared | AC-6 |
| `tests/unit/proto-share-flow/` (5 files) + `registry.test.ts` | 39 new assertions (page 8 · hero 3 · card 4 · modal 16 · toggles 5 · registry 2 + regression-guard) | tests |

937/937 full unit suite (no regression); ESLint clean; typecheck clean.

### What did NOT ship this session

- **Preview-deploy 6-dim verification** — pending Vercel build on PR #226.
- **R-M1 states 2-5** — Mark status machine waiting states beyond state-1 "Not invited" deferred to future `S-PROTO-reconcile-waiting`.
- **C-S1 pending-state CTA + change-while-shared banner** — require a previously-shared state.
- **C-S2 Solicitor + Mediator functional wiring** — UI-only per phase-1; deferred to C-S4 resolution (68f S-1).
- **aria-live on confirmation transition** — deferred to production-host slice per adversarial review.
- **Backend submit wiring** — static prototype only.

### Session 120 priorities table — user picks scope

**Phase 3 sequence is exhausted.** All priorities below are OFF-SEQUENCE.

| # | Priority | OFF-SEQUENCE rationale | Scope | Effort |
|---|---|---|---|---|
| 1 | **Merge PR #226 (share-flow)** | OFF-SEQUENCE because PR-management is admin not feature-work | Review auto-review verdict; preview-deploy 6-dim verification fills; merge | Tiny |
| 2 | **Port 4 remaining `bank-rec-*` forms** | OFF-SEQUENCE because consolidation of L57-60 | ManualEntry · Duplicate · Split · BalanceCheck under `/dev/proto/section-confirm/` | Small per form |
| 3 | **`S-PROTO-your-picture-private`** | OFF-SEQUENCE because Sarah's Picture container is the umbrella surface | Port M_YourPicture (canvas L1844) — 3-col doc + left-rail TOC | Medium-Large |
| 4 | **`S-PROTO-proposal-builder`** | OFF-SEQUENCE because Settle host for ai-coach rail | Settle proposal-builder with right-rail AI coach remount | Large |
| 5 | **`S-PROTO-reconcile-waiting`** | OFF-SEQUENCE because natural sequel to share-flow | R-M1 states 2-4 waiting-state UI (Invited / Opened / Building) | Medium |
| 6 | **`S-PROTO-todos`** | OFF-SEQUENCE because newly-catalogued canvas | Port M_Todos (5 variants tagged) | Medium |
| 7 | **Token consolidation (AI + status colours)** | OFF-SEQUENCE because design-system infra | Lift page-local constants into `tokens.color.ai.*` + `tokens.color.status.*` | Tiny |
| 8 | **A11y holistic pass** | OFF-SEQUENCE because cross-cutting infra | System-wide responsive a11y + NVDA/VoiceOver + roving-tabindex | Medium-Large |
| 9 | **Phase C engineering kickoff** | OFF-SEQUENCE because architectural — shifts from prototype to production | Rebase S-F7-beta, first production slice planning | Large |
| 10 | **User-directed fresh work** | OFF-SEQUENCE — explicitly user-discretionary | Varies | Varies |

## Scoping-discipline observations carried as recurrence-watch

**Session 119 applied (existing observations):**

- **Kickoff-vs-live-source held** — kickoff stated PR #225 squash-merged to main as `8c49f93`; verified via SessionStart hook; matched.
- **Verify-before-planning held** — pre-priority verifications surfaced (a) share-flow canvas absent in mobile-screens-v2 decoded HTML; (b) 5 M_Reconcile variants are all post-share contested-focus (NOT waiting states); (c) registry row L70 (not L69 per SESSION-CONTEXT typo). Corrected scoping from "5 waiting-state canvas variants" to "fully spec-only-not-canvas-port."
- **Quote, don't paraphrase** — `acceptance.md` carries verbatim quotes for C-S1, C-S2, C-S3, R-M1, R-M2.
- **Plan-vs-spec cross-check** — re-read 68a §C-S L57-72 + 68c §R-M L102-118 before AC-freeze.
- **AskUserQuestion frontloading** — 3 scoping rounds (priority + scope shape + re-scope after canvas discovery) before AC-freeze.
- **Snapshot before refactor** — slice-docs commit `c8ce521` as checkpoint before impl commit `073b342`.
- **Self-delta-audit (T1+T2)** — N/A this session (no edits to CLAUDE.md or docs/workspace-spec/).
- **Hook catches** — reviewer-comment hook flagged "Session 118" provenance in acceptance.md (corrected); spec-citation-quote hook flagged "per spec 71 §5" without verbatim (corrected by dropping unverified citation).

**Carried unchanged from session 118 (2 entries):** JSX-attribute parse error · Verification-md session-N provenance round-trip.

**Carried unchanged from session 117 (3 entries):** Vitest packages absent in fresh sandbox · Hook stub-mode noise on legitimate text · TDD-guard atomic-row OVERRIDE repeat use.

**Carried unchanged from earlier sessions:** see `docs/HANDOFF-SESSION-118.md`.

**Wrap-protocol skipping:** Tenth session of clean wrap inheritance. Promoted to numbered negative constraint #42: "Session wrap-protocol discipline is stable — do not add additional wrap-protocol enforcement mechanisms."

## Authoritative reading order at session 120 start

1. This file.
2. `docs/HANDOFF-SESSION-119.md` (retro — share-flow impl, M_Reconcile variant reframe, adversarial review a11y fixes).
3. **Check PR #226 status** — if merged, main tip advances past `8c49f93`; if open, auto-review verdict may need attention.
4. **For any priority:** all are off-sequence; read relevant specs on demand.

## Session 120 kickoff prompt (paste-ready)

```
Kick off session 120.

Read docs/SESSION-CONTEXT.md first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Session 119 closed S-PROTO-share-flow AC-1..AC-6 on branch
  claude/cool-maxwell-jKu6e (4 ahead of main). PR #226 open.
- Phase 3 sequence (HANDOFF-74 L80-82) is now EXHAUSTED.
  All future work is off-sequence or Phase C engineering.
- Off-sequence priorities #1-#10 in SESSION-CONTEXT table.

Read at session start:
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-119.md.
3. For chosen priority: relevant specs on demand.

Confirm priority with the user. No recommended P1 — sequence
is exhausted; all options are equally valid off-sequence choices.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 16 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app` · React 19.2.4.

Prototype on main / branch now spans:

- **Pre-signup-interview prototype** — 12 screens with shared chassis + 5 Help Rail variants.
- **Marketing landing prototype** — 8-section single-page scroll; Pricing + Start CTAs wired.
- **Welcome tour prototype** — canvas-as-source port.
- **Pre-auth-public route shells** — `/how-it-works` · `/pricing` · `/faq-trust` placeholder shells.
- **Sign-up route shell** — shell stub.
- **Signed-in shared chrome** — `signed-in-header.tsx`.
- **Post-connect dashboard prototype** — with `?variant=conservative|expressive`.
- **Section-confirm prototype** — hub + 2 form routes (Categorise + ConfirmRecurring) at `/dev/proto/section-confirm/`.
- **AI coach prototype** — standalone preview at `/dev/proto/ai-coach` with 3-tab right rail, 4 coach cards, FALLBACK POSITIONS.
- **Share-flow prototype (PR #226, branch only)** — standalone preview at `/dev/proto/share-flow` with state-1 "Not invited" destination + party-type-aware share modal + selective publish toggles.

## Branch

Session 119 work on `claude/cool-maxwell-jKu6e` — 4 ahead of main, PR #226 open.

## Negative constraints (preserve)

#1-#41 from prior sessions. **#42 added this session:** Session wrap-protocol discipline is stable — tenth consecutive clean wrap; do not add additional wrap-protocol enforcement mechanisms.

**Active CI status (post-push):**

- 50 ESLint warnings repo-wide (all pre-existing baseline; non-blocking).
- 0 ESLint errors.
- Pre-existing `slice-verification` job LABELS shell-injection (carry-over).

## Scope ceiling

Session 120 — all priorities are off-sequence. No single recommended P1. Scope ceiling per chosen priority.

## Current prototype URLs

- Marketing landing: `/dev/proto/marketing-landing`
- Welcome tour: `/dev/proto/welcome-tour`
- Pre-auth-public shells: `/dev/proto/how-it-works` · `/dev/proto/pricing` · `/dev/proto/faq-trust`
- Sign-up shell: `/dev/proto/sign-up`
- Pre-signup interview: `/dev/proto/pre-signup-interview`
- Post-connect dashboard: `/dev/proto/post-connect-dashboard?variant=conservative|expressive`
- Section-confirm hub: `/dev/proto/section-confirm/`
- Section-confirm forms: `/dev/proto/section-confirm/categorise` · `/dev/proto/section-confirm/confirm-recurring`
- AI coach: `/dev/proto/ai-coach`
- **Share-flow (new, branch only):** `/dev/proto/share-flow`
- Registry hub: `/dev/proto` (63 rows · 1 refreshed this session)
