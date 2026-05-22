# Session 119 Pre-flight Context Block (carrying session 118 wrap delta)

## Session 118 wrap delta — read this first

Session 118 closed `S-PROTO-ai-coach` AC-1..AC-6 (impl complete; awaiting PR-merge for full DoD closure) on branch `claude/exciting-clarke-PjeRw` (2 ahead of main). Spec-only-not-canvas-port shape — decoded mobile-screens-v2 canvas had no M_AiCoach/M_Coach/M_Settle artboard; AC framing drove off spec 68d §S-A + 68a §C-A verbatim quotes. Registry L74 transitions `spec-only → prototype-built`; open Q resolved to `Invocation pattern locked: always-on rail, cards-only`.

**Phase 3 sequence still on track.** Next on-sequence is `S-PROTO-share-flow` (§7 Reconcile multi-actor) per HANDOFF-74 L80-82 verbatim — this is the last slice on the HANDOFF-74 sequence; after it, work shifts to off-sequence priorities or Phase C engineering.

### What shipped on branch `claude/exciting-clarke-PjeRw` (commits 36e37e6 + 6da61b5; 2 ahead of main)

| Surface | Change | AC |
|---|---|---|
| `docs/slices/S-PROTO-ai-coach/{acceptance,security,test-plan,verification}.md` | New slice docs (4 files, 298L → 306L after evidence fills) | scaffold |
| `src/app/dev/proto/ai-coach/page.tsx` | New page · composes RightRail with 4 CoachCards + SummaryBanner + CoachFooter | AC-1, AC-3, AC-5 |
| `src/app/dev/proto/ai-coach/_components/RightRail.tsx` | 3-tab container · AI coach default-open · aria-selected wiring | AC-1 |
| `src/app/dev/proto/ai-coach/_components/SummaryBanner.tsx` | S-A3 verbatim intro + FLAG/NOTICE count badges | AC-3 |
| `src/app/dev/proto/ai-coach/_components/CoachCard.tsx` | 4 type variants · SHOW REASONING toggle · FALLBACK POSITIONS subsection | AC-2, AC-4 |
| `src/app/dev/proto/ai-coach/_components/CoachFooter.tsx` | C-A3 verbatim disclaimer | AC-5 |
| `src/app/dev/proto/registry.ts` L74 | 1-row update (status · confidence · tags · openQ · lastTouched · links) | AC-6 |
| `tests/unit/app/dev/proto/registry.test.ts` | +2 new assertions (ai-coach block + regression-guard for untouched Settle rows) | tests |
| `tests/unit/proto-ai-coach/` (5 files) | 24 new test cases (page 7 · RightRail 7 · CoachCard 7 · SummaryBanner 4 · CoachFooter 1) | tests |

All 49 ai-coach + registry tests pass; 896/896 full unit suite (no regression); ESLint clean; typecheck clean.

### What did NOT ship this session

- **PR not opened** — code pushed to branch 2 ahead of main; PR creation is user-initiated.
- **Auto-review verdict not yet received** — fires on PR open.
- **Preview-deploy 6-dim verification** — runs at PR open; rubric placeholder in `verification.md`.
- **C-A2 Jump-to-link card type** — 5th cross-phase variant from 68a deferred to a future cross-cutting slice (host surfaces with sections to deep-link into don't exist yet).
- **Live AI wiring** — static prototype only; Anthropic SDK call deferred to a future slice paired with proposal-builder.
- **Adopt button handler wiring** — FALLBACK POSITIONS Adopt buttons are no-op stubs; wiring deferred to proposal-builder host.
- **Full Comments + Activity tab content** — placeholder stub copy under non-default tabs.

### Session 119 priorities table — user picks scope

Recommended P1: `S-PROTO-share-flow` (last slice on the HANDOFF-74 L80-82 sequence). After this slice, the sequence is exhausted; future sessions shift to off-sequence priorities or Phase C engineering.

**On-sequence (HANDOFF-74 L80-82 verbatim — ai-coach now shipped):**

| # | Priority | Phase | Scope | Effort | Blocked? |
|---|---|---|---|---|---|
| 1 | **`S-PROTO-share-flow`** | §7 Reconcile | Multi-actor share flow (Sarah/Mark joint). Registry L69 `share-flow` is `spec-only` / `tags: multi-actor, high-uncertainty`. Open Q: "Invite mechanics + real-time-vs-async?" | Large | Soft-blocked on Build state |

**Off-sequence (each carries `OFF-SEQUENCE because X` rationale):**

| # | Priority | OFF-SEQUENCE rationale | Scope | Effort |
|---|---|---|---|---|
| 2 | **Open PRs for sessions 117 + 118 work** | OFF-SEQUENCE because PR-management is admin not feature-work | Open PR from `claude/exciting-clarke-PjeRw` (this session's branch) + the prior `claude/hopeful-edison-bLX0N` if still present remote-side; auto-review verdict; preview-deploy 6-dim verification fills | Tiny |
| 3 | **Port 4 remaining `bank-rec-*` forms** | OFF-SEQUENCE because consolidation of L57-60 — each is its own canvas-drafted row | ManualEntry · Duplicate · Split · BalanceCheck under `/dev/proto/section-confirm/` | Small per form |
| 4 | **`S-PROTO-your-picture-private`** | OFF-SEQUENCE because Sarah's Picture container is the umbrella surface where confirm forms surface FROM | Port M_YourPicture (canvas L1844) — 3-col doc + left-rail TOC with 4 state icons across 8 sections + right-rail snapshot panels | Medium-Large |
| 5 | **`S-PROTO-proposal-builder`** | OFF-SEQUENCE because §8 Settle host for the ai-coach rail just built; Adopt-button no-op stubs from session 118 need their host | Settle proposal-builder page with right-rail AI coach (re-mounting the components from session 118) | Large |
| 6 | **`S-PROTO-todos`** | OFF-SEQUENCE because newly-surfaced canvas | Port M_Todos (sighted in mobile-screens-v2 decoded canvas session 118; not in registry yet — add row + canvas-port slice) | Medium |
| 7 | **AIMarginCard full feature surface** | OFF-SEQUENCE because UI-feature-surface carry-over from session 117 | Port tab UI + fallback expand from canvas L2334-2540 | Small-Medium |
| 8 | **Token consolidation for AI + status colours** | OFF-SEQUENCE because design-system infrastructure — DS-token cluster for AI_PURPLE + FLAG-red + NOTICE-amber + POSITIVE-green | Lift page-local constants into `tokens.color.ai.*` + `tokens.color.status.*` | Tiny |
| 9 | **`slice-verification` LABELS injection fix** | OFF-SEQUENCE because CI-infra carry-over from session 116 round-1 | Surgical infra fix in `pr-dod.yml` | Tiny |
| 10 | **Mobile responsive marketing-landing** | OFF-SEQUENCE because opportunistic carry-over | 6-breakpoint responsive pass on shipped marketing port | Medium |
| 11 | **Sign-up canvas port** | OFF-SEQUENCE because dep-of-AC3-from-session-116 carry-over | Port canvas at `docs/design-source/mobile-screens-v2/` per spec 65a | Medium |
| 12 | **Welcome-tour SignedInHeader migrate** | OFF-SEQUENCE because scope-add-on carry-over | Bespoke TopBar → `SignedInHeader mode='tour'` | Small |
| 13 | **A11y holistic pass** | OFF-SEQUENCE because cross-cutting infra carry-over | System-wide responsive a11y + NVDA/VoiceOver + roving-tabindex + Footer MUTE + PhaseStrip opacity-contrast | Medium-Large |
| 14 | **User-directed fresh work** | OFF-SEQUENCE — explicitly user-discretionary | Post-signup · authenticated screens beyond dashboard · etc. | Varies |

## Scoping-discipline observations carried as recurrence-watch

**Session 118 applied (existing observations):**

- **Kickoff-vs-live-source held** — kickoff stated PR #224 squash-merged to main as `b2677865`; SESSION-CONTEXT and HANDOFF-117 were written pre-merge and said the opposite. Verified via `git log --oneline origin/main`; kickoff matched live state. Acted on the kickoff.
- **Verify-before-planning held** — pre-priority verifications surfaced (a) AI-coach canvas absent in mobile-screens-v2 decoded HTML, locking spec-only-not-canvas-port shape; (b) registry schema uses `links.prototype` (not `links.proto`) — caught mid-impl before incorrect-field would have polluted the registry edit.
- **Quote, don't paraphrase** — `acceptance.md` carries verbatim quotes for 6 of the 6 ACs (S-A1..S-A6); HANDOFF-74 L80-82; spec 72d §3 test-pain threshold.
- **Plan-vs-spec cross-check** — re-read 68d §S-A L66-90 + 68a §C-A L107-119 before AC-freeze; clarified the 4-type vs 5-type taxonomy split (Settle-specific S-A2 has 4; cross-phase C-A2 has 5 including Jump-to-link).
- **AskUserQuestion frontloading** — 2 scoping rounds (priority + open-Q-resolution combined) before AC-freeze.
- **Snapshot before refactor** — slice-docs commit `36e37e6` as checkpoint before impl commit `6da61b5`.
- **TDD-guard OVERRIDE for atomic single-row registry update** — same pattern as sessions 116-117; used via `TDD_GUARD_REDGREEN_OVERRIDE=1` + Python sub.
- **Self-delta-audit (T1+T2 from session 116)** — N/A this session (no edits to CLAUDE.md or docs/workspace-spec/).

**New observations this session (one-session-observed; promote at second session if recurs):**

- **JSX-attribute parse error from escaped quotes** — `body="...\"...\""` in a JSX attribute breaks the parser. Caught at typecheck + lint rather than write time. Promotion target: lint-on-save or PostToolUse Write/Edit hook running basic JSX parse against `.tsx` files (would short-circuit one round-trip).
- **Verification-md "session-N" provenance round-trip** — wrote `(session-117 hatch pattern)` + `(Per session-117 precedent)` in `verification.md` AC-2 and AC-6; reviewer-comment hook flagged both as session-provenance anti-pattern; corrected via 2 Edits. CLAUDE.md §"Coding conduct" §"Comments" already names the anti-pattern; pattern is correct, the recall failure is at first-draft. Promotion target: pre-Write advisory on `(session-N|PR #N|round-N|slice S-N)` patterns in `docs/slices/*/verification.md`.

**Carried unchanged from session 117 (3 entries):** Vitest packages absent in fresh sandbox · Hook stub-mode noise on legitimate text (3rd session — promotion-eligible) · TDD-guard atomic-row OVERRIDE repeat use (3rd session of the same hatch use — pattern is intentional, not a failure).

**Carried unchanged from session 116 (4 entries):** Filename convention drift · AC Link-vs-router-push deviation · Auto-review caught security issue main missed · Self-violation of own session's discipline (preventionT1+T2 shipped).

**Carried unchanged from session 115 (5 entries):** Branch-checkout content inflates line-count budget · AC-write before canvas-read fabricates content · Surgical-edit identifier rename needs replace_all · npm ci works in sandbox · Subscription-onboarding split focus.

**Carried unchanged from sessions 113-114 (3 entries):** Canvas-decode eats line budget · TDD-guard untracked-file complaints · Hook session-churn resets across SessionStart fires.

**Carried unchanged from session 112 (3 entries):** Hook line-count attribution · `npx vitest` install gating · Agent batch-end API 529.

**Carried unchanged from session 111 (3 entries):** React shorthand+longhand diff · Sandbox blocks Vercel preview URL · `/dev/control` 404.

**Carried unchanged from session 110 (3 entries):** Multi-PR unmerged backlog · bundled-wrap-PR risk · audit-style slice line-count budget.

**Wrap-protocol skipping:** Session 118 inherits clean wrap from sessions 116-117. **Ninth session of clean inheritance** if this session wraps cleanly. Promotion-eligible to numbered negative constraint #42 if next session confirms tenth.

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md`.

## Authoritative reading order at session 119 start

1. This file.
2. `docs/HANDOFF-SESSION-118.md` (retro — ai-coach impl, spec-only-not-canvas-port shape evidence, TDD-guard atomic-row usage, JSX-attribute bug).
3. **If continuing P1 (S-PROTO-share-flow):** read `docs/workspace-spec/68c-decisions-reconcile.md` for Reconcile-phase locked decisions + check registry row L69 (`share-flow`) for current state. Also check the 68a C-cluster for cross-cutting share decisions if any are referenced from 68c.
4. **Always:** verify branch state via SessionStart hook; check whether `claude/exciting-clarke-PjeRw` was merged or remains 2-ahead.

## Session 119 kickoff prompt (paste-ready)

```
Kick off session 119.

Read docs/SESSION-CONTEXT.md first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Session 118 closed S-PROTO-ai-coach AC-1..AC-6 (impl
  complete); commits 36e37e6 + 6da61b5 on
  claude/exciting-clarke-PjeRw. PR not opened in-session.
- Per CLAUDE.md §"Phase 3 sequence" §Status, the on-sequence
  ladder advances to P1: S-PROTO-share-flow (§7 Reconcile).
  This is the LAST slice on the HANDOFF-74 L80-82 sequence;
  after it, work shifts to off-sequence priorities or Phase C.
- Off-sequence priorities #2-#14: open PRs · port 4 remaining
  bank-rec forms · Sarah's Picture container · proposal-builder
  (Settle host for ai-coach rail) · S-PROTO-todos (newly-sighted
  M_Todos artboard) · etc.

If the harness lands on session 118's branch
(claude/exciting-clarke-PjeRw, 2 ahead of main): user likely
wants PR opened first, OR new session-119-named branch (after
PR merge). Confirm before resync.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-118.md.
3. For P1: docs/workspace-spec/68c-decisions-reconcile.md +
   registry L69.

Pre-priority verifications (run BEFORE first edit, per CLAUDE.md
§"Planning conduct"):

For P1 (S-PROTO-share-flow):
- Confirm 68c §Reconcile is the right canonical source.
- Check for any canvas surface in mobile-screens-v2
  (M_Reconcile is catalogued; multi-actor share-flow likely
  has shape there OR is spec-only). Grep the decoded canvas
  for share/invite/multi-actor strings before deciding.
- Resolve registry row L69 open Q: "Invite mechanics +
  real-time-vs-async?" with user.

For other priorities: see SESSION-CONTEXT priorities table.

Confirm priority with the user. Recommended: P1 (S-PROTO-share-flow
— last on the HANDOFF-74 L80-82 sequence).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 16 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app` · React 19.2.4.

Prototype on main / branch now spans (post-session-118 impl, pre-merge):

- **Pre-signup-interview prototype** — 12 screens with shared chassis + 5 Help Rail variants.
- **Marketing landing prototype** — 8-section single-page scroll; Pricing + Start CTAs wired.
- **Welcome tour prototype** — canvas-as-source port.
- **Pre-auth-public route shells** — `/how-it-works` · `/pricing` · `/faq-trust` placeholder shells.
- **Sign-up route shell** — shell stub.
- **Signed-in shared chrome** — `signed-in-header.tsx`.
- **Post-connect dashboard prototype** — with `?variant=conservative|expressive`.
- **Section-confirm prototype** (session 117, on main as PR #224) — hub + 2 form routes (Categorise + ConfirmRecurring) at `/dev/proto/section-confirm/`.
- **AI coach prototype** (session 118, branch only) — standalone preview at `/dev/proto/ai-coach` with 3-tab right rail, 4 coach cards, summary banner, FALLBACK POSITIONS, advisory footer.

## Branch

Session 118 work on `claude/exciting-clarke-PjeRw` — 2 ahead of main, not yet merged. Session 119 likely needs PR open + merge, then either re-use this branch or open per-slice branch.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 118.** Two new scoping-discipline observations on recurrence-watch (JSX-attribute parse error · verification-md session-N provenance round-trip).

**Active pre-existing CI status (post-session-118 push):**

- 50 ESLint warnings repo-wide (all pre-existing baseline; non-blocking).
- 0 ESLint errors.
- Pre-existing `slice-verification` job LABELS shell-injection (carry-over to off-sequence priority #9).

## Scope ceiling

Session 119 P1 (S-PROTO-share-flow) is Large + soft-blocked on Build state. Out of scope unless explicitly added: post-signup work · authenticated screens beyond dashboard · Decouple.zip unpacking · Mobile Screens v2 broad port.

## Current prototype URLs

- Marketing landing: `/dev/proto/marketing-landing`
- Welcome tour: `/dev/proto/welcome-tour`
- Pre-auth-public shells: `/dev/proto/how-it-works` · `/dev/proto/pricing` · `/dev/proto/faq-trust`
- Sign-up shell: `/dev/proto/sign-up`
- Pre-signup interview: `/dev/proto/pre-signup-interview`
- Post-connect dashboard: `/dev/proto/post-connect-dashboard?variant=conservative|expressive`
- Section-confirm hub: `/dev/proto/section-confirm/`
- Section-confirm forms: `/dev/proto/section-confirm/categorise` · `/dev/proto/section-confirm/confirm-recurring`
- **AI coach (new this session — branch only, post-merge available on `construct-dev.vercel.app`):** `/dev/proto/ai-coach`
- Registry hub: `/dev/proto` (62 rows · 1 refreshed this session)
