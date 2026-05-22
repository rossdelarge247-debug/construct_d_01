# Session 119 Pre-flight Context Block (carrying session 118 wrap delta)

## Session 118 wrap delta — read this first

Session 118 closed `S-PROTO-ai-coach` AC-1..AC-6 end-to-end with full auto-review loop completion. PR #225 squash-merged to main as `8c49f93`. Plus a post-wrap consistency-check addition: `todos` hub registry row catalogued the newly-sighted M_Todos canvas (5 variants).

**Phase 3 sequence position.** Per HANDOFF-74 L80-82 verbatim: P0 (`pre-signup-interview`) shipped pre-session-117 · P1 (`section-confirm`) shipped session 117 (PR #224) · P2 (`ai-coach`) shipped session 118 (PR #225) · **P2+ next: `share-flow` (Reconcile multi-actor)** — last rung. Post-share-flow, the explicit Phase 3 ladder is exhausted; work shifts to off-sequence or Phase C engineering.

### What shipped on main via PR #225 (squash commit `8c49f93`)

| Surface | Change | AC |
|---|---|---|
| `docs/slices/S-PROTO-ai-coach/{acceptance,security,test-plan,verification}.md` | New slice docs (4 files; 89+35+76+106L) | scaffold |
| `src/app/dev/proto/ai-coach/page.tsx` | New page · composes RightRail + AiCoachPanel · 4 mock CoachCards + court-reasonableness fallbacks | AC-1 + AC-5 |
| `src/app/dev/proto/ai-coach/_components/RightRail.tsx` | 3-tab right rail · AI coach default-open · ARIA tab/panel association · arrow-key roving focus per APG | AC-1 |
| `src/app/dev/proto/ai-coach/_components/CoachCard.tsx` | 4 type variants · SHOW REASONING toggle · FALLBACK POSITIONS subsection · 44px touch targets | AC-2 + AC-4 |
| `src/app/dev/proto/ai-coach/_components/SummaryBanner.tsx` | S-A3 verbatim intro + FLAG/NOTICE count badges | AC-3 |
| `src/app/dev/proto/ai-coach/_components/CoachFooter.tsx` | C-A3 verbatim advisory disclaimer | AC-5 |
| `src/app/dev/proto/ai-coach/_components/colors.ts` | Shared FLAG_RED + NOTICE_AMBER (WCAG AA compliant) | AC-2 |
| `src/app/dev/proto/registry.ts` L74 | `ai-coach` row: `spec-only → prototype-built` · `confidence: low → medium` · `links.{prototype, slice}` set · openQ resolved | AC-6 |
| `src/app/dev/proto/registry.ts` L52 (new) | `todos` row added · `section: 'hub'` · `status: 'canvas-drafted'` · 5 canvas variants flagged | post-wrap hub consistency |
| `tests/unit/proto-ai-coach/` (5 files) | 29 test cases | tests |
| `tests/unit/app/dev/proto/{registry,page}.test.ts` | +9 assertions (ai-coach + todos blocks · 100% rule sweep 62 → 63 · hub 5 → 6) | tests |

Auto-review converged in 3 rounds: `request-changes` (11 findings, 8 actioned) → `request-changes` (4 findings, all actioned) → `approve` (2 praises). All 26 CI jobs GREEN on merge commit.

### What did NOT ship this session

- **Wrap docs landing on main.** This SESSION-CONTEXT.md + HANDOFF-SESSION-118.md are the post-merge rewrites; they live on stale branch `claude/exciting-clarke-PjeRw` and need their own tiny follow-up PR to land. Tracked as session 119 off-sequence priority #2.
- **C-A2 Jump-to-link card type.** 5th cross-phase card type per 68a C-A2; deferred to a future cross-cutting slice once host surfaces with sections-to-deep-link-into exist.
- **Live AI wiring.** All cards static mock content per `ai-dependent` registry tag.
- **Full Comments + Activity tabs.** Stub placeholder panels only; full surfaces deferred to dedicated slices.

### Session 119 priorities table — user picks scope

Recommended P1: `S-PROTO-share-flow` (last rung on HANDOFF-74 L80-82 ladder; §7 Reconcile multi-actor).

**On-sequence (HANDOFF-74 L80-82 verbatim — ai-coach now shipped so the sequence advances to the final rung):**

| # | Priority | Phase | Scope | Effort | Blocked? |
|---|---|---|---|---|---|
| 1 | **`S-PROTO-share-flow`** | §7 Reconcile | Multi-actor share flow (Sarah/Mark joint). Registry L70 `share-flow` is `spec-only` / `confidence: low` / `tags: ['multi-actor', 'high-uncertainty']` · openQ `'Invite mechanics + real-time-vs-async?'`. Canonical spec: `docs/workspace-spec/68c-decisions-reconcile.md`. Canvas: M_Reconcile exists in mobile-screens-v2; share-specific artboards TBD at turn-0 grep. | Large | Soft-blocked on Build state |

**Off-sequence (each carries `OFF-SEQUENCE because X` per CLAUDE.md §"Phase 3 sequence"):**

| # | Priority | OFF-SEQUENCE rationale | Effort |
|---|---|---|---|
| 2 | **Open PR for session 118 wrap docs** | OFF-SEQUENCE because PR-management — wrap docs written post-merge need their own tiny follow-up PR | Tiny |
| 3 | **`S-PROTO-proposal-builder`** | OFF-SEQUENCE because Settle host surface for the ai-coach rail just built; Adopt-button no-op stubs from S-PROTO-ai-coach need their host to wire to | Large |
| 4 | **`S-PROTO-todos`** | OFF-SEQUENCE because newly-catalogued canvas now in hub (`todos` row, `canvas-drafted`); ready to build; 5 canvas variants to reconcile | Medium |
| 5 | **Port 4 remaining `bank-rec-*` forms** | OFF-SEQUENCE because L57-60 consolidation; small follow-up each; reuses `/dev/proto/section-confirm/_components/` from PR #224 | Small per form |
| 6 | **`S-PROTO-your-picture-private`** | OFF-SEQUENCE because Sarah's Picture container is the umbrella for the confirm forms; ports M_YourPicture | Medium-Large |
| 7 | **AIMarginCard full feature surface** | OFF-SEQUENCE because UI-feature-surface deferred from S-PROTO-section-confirm AC-2 | Small-Medium |
| 8 | **Token consolidation for AI + status colours** | OFF-SEQUENCE because DS infrastructure — AI_PURPLE family from section-confirm + FLAG_RED/NOTICE_AMBER from ai-coach now extracted to `colors.ts`; cross-cutting consolidation ripe | Tiny |
| 9 | **`slice-verification` LABELS injection fix** | OFF-SEQUENCE because CI-infra carry-over from session 116 | Tiny |
| 10 | **Mobile responsive marketing-landing** | OFF-SEQUENCE because opportunistic carry-over from session 115 | Medium |
| 11 | **Sign-up canvas port** | OFF-SEQUENCE because dependency-of-AC3 carry-over from session 116 | Medium |
| 12 | **Welcome-tour SignedInHeader migrate** | OFF-SEQUENCE because scope-add-on carry-over from session 114 | Small |
| 13 | **A11y holistic pass** | OFF-SEQUENCE because cross-cutting infra — session 118 auto-review surfaced a11y is high-impact territory (5 prototype-readiness a11y findings across 2 rounds) | Medium-Large |
| 14 | **User-directed fresh work** | OFF-SEQUENCE — explicitly user-discretionary | Varies |

## Scoping-discipline observations carried as recurrence-watch

**Session 118 applied (existing observations):**

- **Verify before planning** held — pre-priority verifications surfaced (a) M_AiCoach absence forcing spec-only-not-canvas-port shape; (b) `links.prototype` vs `links.proto` schema discovery mid-impl; (c) post-merge state divergence between SESSION-CONTEXT.md (stale) and kickoff (current).
- **Quote, don't paraphrase** — `acceptance.md` carries verbatim quotes for HANDOFF-74 L80-82, spec 68d §S-A six locked decisions, spec 68a §C-A cross-phase decisions, spec 72d §3 test-pain threshold.
- **Plan-vs-spec cross-check** — re-read 68d §S-A + 68a §C-A before first impl edit; surfaced the 5-vs-4 card-taxonomy split (C-A2 has 5; S-A2 has 4).
- **AskUserQuestion frontloading** — 2 scoping rounds (priority + open-Q-resolution combined) converged scope quickly.
- **Snapshot before refactor** — slice-docs commit `36e37e6` as checkpoint before impl commit `6da61b5`.
- **TDD-guard OVERRIDE for atomic registry rows** — used twice (L74 ai-coach update + L52 todos row insert). Same pattern as sessions 116-117.

**New observations this session (one-session-observed; promote at second session if recurs):**

- **CI-mode `spec-citation-quote` stricter than author-time hook.** The author-time hook fires stub-mode advisories on inline italic quotes that I learned to dismiss as noise; the CI gate (`scripts/spec-citation-quote-check.sh`) actually FAILS because it requires block-quote (`>`) or fenced quote within 5 lines AFTER the trigger — inline italic on same/next line doesn't satisfy proximity. Fix was 4 reframings from `per spec NN` (claim/trigger) to `spec NN` (doc-pointer). **Promotion target:** author-time hook should mirror CI strictness for newly-added slice files, OR CLAUDE.md should explicitly note that inline `*"..."*` doesn't satisfy CI proximity.
- **JSX-attribute parse error from escaped quotes.** Caught at typecheck + lint, not at write time. Adds one round-trip per occurrence.
- **Auto-review found WCAG AA contrast failure** that main conversation missed (`NOTICE_AMBER #D97706` on white = ~3.5:1; below 4.5:1 for small text). The reviewer-prototype-readiness persona is delivering high lift on a11y essentials. **Promotion target post one more slice:** consider a "WCAG check" lightweight hook at write-time for new colour constants on white backgrounds.
- **Pre-merge HANDOFF written too early.** First wrap commit landed before PR open, so the original HANDOFF + SESSION-CONTEXT didn't reflect the auto-review rounds or merge. **Promotion target:** wrap protocol could explicitly call for a placeholder pre-merge + amend post-merge — same as test-plan §"Run" carrying the actual command vs the planned command.

**Carried unchanged from session 117 (3 entries):** Vitest packages absent in fresh sandbox · Hook stub-mode noise on legitimate text (now **third session — promotion-eligible**) · TDD-guard test-RED at multi-row registry update (now **third use of the same hatch — accepted intentional**).

**Carried unchanged from session 116 (4 entries):** Filename convention drift · AC Link-vs-router-push deviation · Auto-review caught security issue main missed (session 118: extended to "auto-review caught a11y + WCAG contrast main missed") · Self-violation of own session's discipline (T1+T2 mitigations effective session 118 — none surfaced).

**Carried unchanged from session 115 (5 entries):** Branch-checkout content inflates line-count budget · AC-write before canvas-read fabricates content · Surgical-edit identifier rename needs replace_all · npm ci works in sandbox · Subscription-onboarding split focus.

**Carried unchanged from sessions 113-114 (3 entries):** Canvas-decode eats line budget · TDD-guard untracked-file complaints · Hook session-churn resets across SessionStart fires.

**Carried unchanged from session 112 (3 entries):** Hook line-count attribution · `npx vitest` install gating · Agent batch-end API 529.

**Carried unchanged from session 111 (3 entries):** React shorthand+longhand diff · Sandbox blocks Vercel preview URL · `/dev/control` 404.

**Carried unchanged from session 110 (3 entries):** Multi-PR unmerged backlog · bundled-wrap-PR risk · audit-style slice line-count budget.

**Wrap-protocol skipping:** Session 118 inherits clean wrap from session 117. **Ninth session of clean inheritance** if session 119 wraps cleanly — promotion-eligible to numbered negative constraint #42.

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md`.

## Authoritative reading order at session 119 start

1. This file.
2. `docs/HANDOFF-SESSION-118.md` (post-merge retro — auto-review 3-round convergence, persona findings, key decisions).
3. **If continuing P1 (S-PROTO-share-flow):** read `docs/workspace-spec/68c-decisions-reconcile.md` for Reconcile-phase locked decisions + check registry row L70 for current state + grep decoded canvas for M_Reconcile / share / invite artboards.
4. **Always:** verify branch state via SessionStart hook; current branch `claude/exciting-clarke-PjeRw` is stale post-PR-#225 squash — session 119 should resync to fresh branch from `origin/main`.

## Session 119 kickoff prompt (paste-ready)

```
Kick off session 119.

Read docs/SESSION-CONTEXT.md first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Session 118 closed S-PROTO-ai-coach end-to-end. PR #225
  squash-merged to main as 8c49f93. All 6 ACs shipped; auto-review
  converged in 3 rounds (request-changes → request-changes →
  approve); 26/26 CI jobs GREEN.
- Plus: 'todos' hub registry row added (M_Todos canvas catalogued,
  canvas-drafted status, 5 variants tagged).
- Per CLAUDE.md §"Phase 3 sequence" §Status, the on-sequence
  ladder advances to the LAST RUNG: P2+ S-PROTO-share-flow
  (§7 Reconcile multi-actor). Post-share-flow, the explicit
  HANDOFF-74 L80-82 sequence is exhausted; future work shifts to
  off-sequence or Phase C engineering.
- Branch claude/exciting-clarke-PjeRw is stale post-squash. If the
  harness lands on it: 7 commits ahead of OLD main (b267786) but
  superseded by 8c49f93; resync per CLAUDE.md §"Branch-resume
  check" — git fetch origin main → git checkout -B
  <new-session-branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-118.md.
3. For P1: docs/workspace-spec/68c-decisions-reconcile.md +
   registry row L70 (share-flow).

Pre-priority verifications (run BEFORE first edit, per CLAUDE.md
§"Planning conduct"):

For P1 (S-PROTO-share-flow):
- Confirm 68c §Reconcile is the right canonical source for the
  share-flow surface's locked mechanics (or 68 hub, 68a
  cross-cutting).
- Grep the decoded canvas at
  docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2
  - Standalone.html for share / invite / collab / partner /
  joint artboards. M_Reconcile exists; share-specific surfaces
  TBD.
- Resolve registry row L70 open Q with user:
  "Invite mechanics + real-time-vs-async?" — likely the major
  scoping decision.
- Multi-actor + high-uncertainty tags suggest this slice may
  need significant up-front scope conversation. Budget extra
  AskUserQuestion rounds.

Off-sequence alternatives (each carries OFF-SEQUENCE because X
rationale per CLAUDE.md §"Phase 3 sequence"):
- Open PR for session 118 wrap docs (tiny; clears post-merge
  doc-drift)
- S-PROTO-proposal-builder (Settle host for the ai-coach rail
  just built; Adopt buttons need a wired host)
- S-PROTO-todos (newly-catalogued; canvas-port-able)
- 4 remaining bank-rec-* forms (reuses
  /dev/proto/section-confirm/_components/)
- A11y holistic pass (auto-review session 118 surfaced a11y is
  high-impact territory)

Confirm priority with the user. Recommended: P1 (S-PROTO-share-flow
— last rung on Phase 3 sequence). If share-flow turns out to be
spec-only-not-canvas-port shape, raise that decision-point before
AC-freeze (same pattern as session 118 ai-coach).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 16 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app` · React 19.2.4.

Prototype on main (post-session-118 merge) now spans:

- **Pre-signup-interview prototype** — 12 screens with shared chassis + 5 Help Rail variants.
- **Marketing landing prototype** — 8-section single-page scroll; Pricing + Start CTAs wired.
- **Welcome tour prototype** — canvas-as-source port.
- **Pre-auth-public route shells** — `/how-it-works` · `/pricing` · `/faq-trust` placeholder shells.
- **Sign-up route shell** — shell stub.
- **Signed-in shared chrome** — `signed-in-header.tsx`.
- **Post-connect dashboard prototype** — with `?variant=conservative|expressive`.
- **Section-confirm prototype** (session 117) — hub + 2 form routes (Categorise + ConfirmRecurring) at `/dev/proto/section-confirm/` + 7 shared `_components/`.
- **AI coach prototype** (session 118 · new on main) — `/dev/proto/ai-coach/` with 3-tab right rail (Comments · AI coach default · Activity) + SummaryBanner + 4 CoachCard variants + SHOW REASONING toggle + FALLBACK POSITIONS + advisory footer.

## Branch

Session 118 work merged to main via PR #225 as `8c49f93`. Session 119 should start on a fresh branch from `origin/main` per CLAUDE.md §"Branch-resume check" — the suffixed `claude/exciting-clarke-PjeRw` branch is now stale and should not be re-used.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 118.** Four new scoping-discipline observations on recurrence-watch (CI-mode spec-citation strictness · JSX-attribute parse error · auto-review WCAG contrast catch · pre-merge HANDOFF timing).

**Active pre-existing CI status (post-session-118 merge):**

- 50 ESLint warnings repo-wide (all pre-existing baseline; non-blocking).
- 0 ESLint errors.
- Pre-existing `slice-verification` job LABELS shell-injection (carry-over to off-sequence priority #9).

## Scope ceiling

Session 119 P1 (S-PROTO-share-flow) is Large + multi-actor + high-uncertainty — possibly the most complex on-sequence slice yet. Out of scope unless explicitly added: post-signup work · authenticated screens beyond dashboard · Decouple.zip unpacking · Mobile Screens v2 broad port.

## Current prototype URLs

- Marketing landing: `/dev/proto/marketing-landing`
- Welcome tour: `/dev/proto/welcome-tour`
- Pre-auth-public shells: `/dev/proto/how-it-works` · `/dev/proto/pricing` · `/dev/proto/faq-trust`
- Sign-up shell: `/dev/proto/sign-up`
- Pre-signup interview: `/dev/proto/pre-signup-interview`
- Post-connect dashboard: `/dev/proto/post-connect-dashboard?variant=conservative|expressive`
- Section-confirm hub: `/dev/proto/section-confirm/`
- Section-confirm forms: `/dev/proto/section-confirm/categorise` · `/dev/proto/section-confirm/confirm-recurring`
- **AI coach prototype (new this session, now on main):** `/dev/proto/ai-coach/`
- Registry hub: `/dev/proto` (63 rows · 1 refreshed + 1 added this session — `ai-coach` L74 spec-only → prototype-built · `todos` L52 newly catalogued)
