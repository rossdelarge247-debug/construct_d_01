# Session 118 Pre-flight Context Block (carrying session 117 wrap delta)

## Session 117 wrap delta — read this first

Session 117 closed `S-PROTO-section-confirm` AC-1..AC-4 (impl complete; awaiting PR-merge for full DoD closure). Two of six confirm forms ported from `mobile-screens-v2` canvas (Categorise + ConfirmRecurring) as the per-section-confirm pattern foundation. Registry rows L54 + L55 + L56 transitioned to `prototype-built`.

**Phase 3 sequence still on track.** Next on-sequence is `S-PROTO-ai-coach` (§8 Settle phase) per HANDOFF-74 L80-82 verbatim.

### What shipped on branch `claude/hopeful-edison-bLX0N` (commits b56caae + a12cfad; 2 ahead of main)

| Surface | Change | AC |
|---|---|---|
| `docs/slices/S-PROTO-section-confirm/{acceptance,security,test-plan,verification}.md` | New slice docs (4 files, 449L) | scaffold |
| `src/app/dev/proto/section-confirm/page.tsx` | New hub index — links to 2 demo routes | AC-1 |
| `src/app/dev/proto/section-confirm/categorise/page.tsx` | Canvas-port of `M_Form_Categorise` (L3092-3145) | AC-1 |
| `src/app/dev/proto/section-confirm/confirm-recurring/page.tsx` | Canvas-port of `M_Form_ConfirmRecurring` (L3150-3219) | AC-1 |
| `src/app/dev/proto/section-confirm/_components/` (7 files) | FormTop · TxnRow · RadioRow · AIMarginCard · BackArrow · SectionLabel · SparkGlyph extracted | AC-2 |
| `src/app/dev/proto/registry.ts` L54-56 | 3-row update (status + lastTouched + links) | AC-4 |
| `tests/unit/app/dev/proto/registry.test.ts` | +5 new assertions (section-confirm block + regression-guard for untouched bank-rec) | tests |
| `tests/unit/proto-section-confirm/` (4 files) | 24 new test cases (hub 4 + categorise 8 + confirm-recurring 6 + RadioRow 6) | tests |

All 42 tests pass; ESLint clean on new code; typecheck clean.

### What did NOT ship this session

- **PR not opened** — code pushed to branch `claude/hopeful-edison-bLX0N` 2 ahead of main; PR creation is user-initiated per CLAUDE.md (no `gh pr create` without explicit ask).
- **Auto-review verdict not yet received** — fires on PR open.
- **Preview-deploy 6-dim verification** — runs at PR open; rubric placeholder in `verification.md`.
- **4 remaining confirm forms** (ManualEntry / Duplicate / Split / BalanceCheck at canvas L3225-3531) — out-of-scope per slice AC; follow-up slices.
- **AIMarginCard full feature surface** — comments / activity / fallbacks deferred per AC-2.
- **Token consolidation for AI colours** — page-local consts only this slice (per AC-3); cross-cutting Phase C consolidation deferred.

### Session 118 priorities table — user picks scope

Recommended P1: `S-PROTO-ai-coach` (back on Phase 3 sequence; HANDOFF-74 L80-82 verbatim names it as P2 after section-confirm). Off-sequence work permitted but must carry `OFF-SEQUENCE because X` per CLAUDE.md §"Phase 3 sequence".

**On-sequence (HANDOFF-74 L80-82 verbatim — section-confirm now shipped so the sequence advances):**

| # | Priority | Phase | Scope | Effort | Blocked? |
|---|---|---|---|---|---|
| 1 | **`S-PROTO-ai-coach`** | §8 Settle | Settle phase AI coach. Registry L74 `ai-coach` is `spec-only` / `confidence: low` / `tags: ai-dependent, high-uncertainty`. Open Q: "Invocation pattern + conversational scope?" Canvas content for this surface unclear — may need spec-only prototype rather than canvas-port. | Large | No (section-confirm shape now landed) |
| 2 | **`S-PROTO-share-flow`** | §7 Reconcile | Multi-actor share flow. Registry L69 `share-flow` is `spec-only` / `tags: multi-actor, high-uncertainty`. Open Q: "Invite mechanics + real-time-vs-async?" | Large | Soft-blocked on Build state |

**Off-sequence (each carries `OFF-SEQUENCE because X` rationale):**

| # | Priority | OFF-SEQUENCE rationale | Scope | Effort |
|---|---|---|---|---|
| 3 | **Open PR for session 117 work** | OFF-SEQUENCE because PR-management is admin not feature-work | Open PR from `claude/hopeful-edison-bLX0N`; auto-review verdict; preview-deploy 6-dim verification fills | Tiny |
| 4 | **Port 4 remaining `bank-rec-*` forms** | OFF-SEQUENCE because consolidation of L57-60 — each is its own canvas-drafted row; each is a small follow-up slice; same shared components apply | ManualEntry (L3225) · Duplicate (L3302) · Split (L3370) · BalanceCheck (L3454) → all under `/dev/proto/section-confirm/` | Small per form (~150L each) |
| 5 | **`S-PROTO-your-picture-private`** | OFF-SEQUENCE because Sarah's Picture container is the umbrella surface where the confirm forms surface FROM; ports L62 row | Port `M_YourPicture` (canvas L1844) — 3-column doc, left-rail TOC with 4 state icons across 8 sections, right-rail snapshot panels | Medium-Large |
| 6 | **Mobile responsive marketing-landing** | OFF-SEQUENCE because opportunistic — carried from session 115 | 6-breakpoint responsive pass on shipped marketing port | Medium |
| 7 | **Sign-up canvas port** | OFF-SEQUENCE because dependency-of-AC3 — addresses session-116 prototype-readiness finding | Port canvas at `docs/design-source/mobile-screens-v2/` per spec 65a | Medium |
| 8 | **AIMarginCard full feature surface** | OFF-SEQUENCE because UI-feature-surface — comments/activity/fallbacks deferred from AC-2 | Port tab UI + fallback expand from canvas L2334-2540 | Small-Medium |
| 9 | **Token consolidation for AI colours** | OFF-SEQUENCE because design-system infrastructure — DS-token cluster for `AI_PURPLE` family | Lift page-local AI_PURPLE/AI_PURPLE_DEEP/AI_PURPLE_TINT/AI_PURPLE_EDGE into `tokens.color.ai.*` | Tiny |
| 10 | **`slice-verification` LABELS injection fix** | OFF-SEQUENCE because CI-infra carry-over from session 116 round-1 | Surgical infra fix in `pr-dod.yml` | Tiny |
| 11 | **Welcome-tour migrate to SignedInHeader** | OFF-SEQUENCE because scope-add-on — carried from session 114 | Bespoke TopBar → `SignedInHeader mode='tour'` | Small |
| 12 | **A11y holistic pass** | OFF-SEQUENCE because cross-cutting infra — carried from sessions 111-117 | System-wide responsive a11y + NVDA/VoiceOver + roving-tabindex + Footer MUTE + PhaseStrip opacity-contrast | Medium-Large |
| 13 | **User-directed fresh work** | OFF-SEQUENCE — explicitly user-discretionary | Post-signup · authenticated screens beyond dashboard · Decouple.zip unpacking · Mobile Screens v2 · etc. | Varies |

## Scoping-discipline observations carried as recurrence-watch

**Session 117 applied (existing observations):**

- **Verify before planning** held — pre-priority verifications surfaced (a) canvas content split between forms L55-60 and container L62, clarifying the registry's poorly-framed open Q; (b) tokens.ts mapping for INK/BG/PAPER/WARM exact vs SUB/MUTE/LINE semantic.
- **Quote, don't paraphrase** — `acceptance.md` carries verbatim quotes for HANDOFF-74 L80-82, spec 72d §3 test-pain threshold, canvas L-line refs for each AC.
- **Plan-vs-spec cross-check** — re-read 68b + 70-build-map-build before first impl edit; clarified the L34 Anchor vs L82 Preserve-with-reskin distinction informing AC framing.
- **AskUserQuestion frontloading** — 3 scoping rounds before impl (priority confirm · scope-D/canvas-treatment · form-count refinement).
- **Snapshot before refactor** — slice-docs commit `b56caae` as checkpoint before impl commit `a12cfad`.
- **TDD-guard OVERRIDE for atomic multi-row registry update** — same pattern as session 116; used via `TDD_GUARD_REDGREEN_OVERRIDE=1` + Python sub.
- **Self-delta-audit (T1+T2 from session 116)** — pending; will run during wrap commit per CLAUDE.md §"Apply your own deltas first".

**New observations this session (one-session-observed; promote at second session if recurs):**

- **Vitest packages absent in fresh sandbox** — `npx vitest` fails with "missing packages and no YES option" on fresh clone. Fix: `npm install --silent` once at session start; persists for rest of session. New constraint relative to session 116 which had vitest pre-installed.
- **Hook stub-mode noise on legitimate text** — spec-citation-quote hook fires on `spec 72a 6-dim rubric` and similar even when the rubric IS quoted via a verbatim-named table immediately below; reviewer-comment hook fires on `session 117` literal text in registry data and verification text (both are legitimate session-tracking, not provenance). Same pattern as session 116 observation. Promotion target: refine hook skip-lists to honour `^## §?Status` block exclusion AND verification.md §lastTouched.session refs.
- **TDD-guard test-RED at multi-row registry update** — same atomic-pattern observation as session 116 ("RED test for registry.ts because new rows expected but old in src"). Documented hatch (`TDD_GUARD_REDGREEN_OVERRIDE=1` via Bash subshell) works reliably. Not a new failure mode, but a repeat use of the same hatch — confirms it's intentional.

**Carried unchanged from session 116 (4 entries):** Filename convention drift · AC Link-vs-router-push deviation · Auto-review caught security issue main missed · Self-violation of own session's discipline (preventionT1+T2 shipped).

**Carried unchanged from session 115 (5 entries):** Branch-checkout content inflates line-count budget · AC-write before canvas-read fabricates content · Surgical-edit identifier rename needs replace_all · npm ci works in sandbox · Subscription-onboarding split focus.

**Carried unchanged from sessions 113-114 (3 entries):** Canvas-decode eats line budget · TDD-guard untracked-file complaints · Hook session-churn resets across SessionStart fires.

**Carried unchanged from session 112 (3 entries):** Hook line-count attribution · `npx vitest` install gating · Agent batch-end API 529.

**Carried unchanged from session 111 (3 entries):** React shorthand+longhand diff · Sandbox blocks Vercel preview URL · `/dev/control` 404.

**Carried unchanged from session 110 (3 entries):** Multi-PR unmerged backlog · bundled-wrap-PR risk · audit-style slice line-count budget.

**Wrap-protocol skipping:** Session 117 inherits clean wrap from session 116. **Eighth session of clean inheritance** if this session wraps cleanly. Promotion-eligible to numbered negative constraint #42 if next session confirms ninth.

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md`.

## Authoritative reading order at session 118 start

1. This file.
2. `docs/HANDOFF-SESSION-117.md` (retro — section-confirm impl, canvas-as-source 5-step adapt evidence, TDD-guard usage).
3. **If continuing P1 (S-PROTO-ai-coach):** read `docs/workspace-spec/68d-decisions-settle.md` for Settle-phase locked decisions + check registry row L74 for current state.
4. **Always:** verify branch state via SessionStart hook; check whether `claude/hopeful-edison-bLX0N` was merged or remains 2-ahead.

## Session 118 kickoff prompt (paste-ready)

```
Kick off session 118.

Read docs/SESSION-CONTEXT.md first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Session 117 closed S-PROTO-section-confirm AC-1..AC-4 (impl
  complete); commits b56caae + a12cfad on
  claude/hopeful-edison-bLX0N. PR not opened in-session.
- Per CLAUDE.md §"Phase 3 sequence" §Status, the on-sequence
  ladder advances to P1: S-PROTO-ai-coach (§8 Settle), P2:
  S-PROTO-share-flow (§7 Reconcile).
- Off-sequence priorities #3-#13: open PR · port 4 remaining
  bank-rec forms · Sarah's Picture container · mobile-responsive
  marketing · etc.

If the harness lands on session 117's branch
(claude/hopeful-edison-bLX0N, 2 ahead of main): user likely
wants PR opened first, OR new session-118-named branch (after
PR merge). Confirm before resync.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-117.md.
3. For P1: docs/workspace-spec/68d-decisions-settle.md +
   registry L74.

Pre-priority verifications (run BEFORE first edit, per CLAUDE.md
§"Planning conduct"):

For P1 (S-PROTO-ai-coach):
- Confirm 68d §Settle is the right canonical source.
- Check for any canvas surface in mobile-screens-v2 (canvas has
  many surfaces — see HANDOFF-117 §"Canvas survey"). Likely
  needs spec-only prototype rather than canvas-port if no
  matching artboard exists.
- Resolve registry row L74 open Q: "Invocation pattern +
  conversational scope?"

For other priorities: see SESSION-CONTEXT priorities table.

Confirm priority with the user. Recommended: P1 (S-PROTO-ai-coach
— back on Phase 3 sequence).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 16 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app` · React 19.2.4.

Prototype on main / branch now spans (post-session-117 impl, pre-merge):

- **Pre-signup-interview prototype** — 12 screens with shared chassis + 5 Help Rail variants.
- **Marketing landing prototype** — 8-section single-page scroll; Pricing + Start CTAs wired.
- **Welcome tour prototype** — canvas-as-source port.
- **Pre-auth-public route shells** — `/how-it-works` · `/pricing` · `/faq-trust` placeholder shells.
- **Sign-up route shell** — shell stub.
- **Signed-in shared chrome** — `signed-in-header.tsx`.
- **Post-connect dashboard prototype** — with `?variant=conservative|expressive`.
- **Section-confirm prototype** (session 117, branch only) — hub + 2 form routes (Categorise + ConfirmRecurring) at `/dev/proto/section-confirm/`.

## Branch

Session 117 work on `claude/hopeful-edison-bLX0N` — 2 ahead of main, not yet merged. Session 118 likely needs PR open + merge, then either re-use this branch or open per-slice branch.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 117.** Three new scoping-discipline observations on recurrence-watch (vitest packages absent in fresh sandbox · hook stub-mode noise on legitimate text · TDD-guard atomic-row OVERRIDE repeat use).

**Active pre-existing CI status (post-session-117 push):**

- 50 ESLint warnings repo-wide (all pre-existing baseline; non-blocking).
- 0 ESLint errors.
- Pre-existing `slice-verification` job LABELS shell-injection (carry-over to off-sequence priority #10).

## Scope ceiling

Session 118 P1 (S-PROTO-ai-coach) is Large. Out of scope unless explicitly added: post-signup work · authenticated screens beyond dashboard · Decouple.zip unpacking · Mobile Screens v2 broad port.

## Current prototype URLs

- Marketing landing: `/dev/proto/marketing-landing`
- Welcome tour: `/dev/proto/welcome-tour`
- Pre-auth-public shells: `/dev/proto/how-it-works` · `/dev/proto/pricing` · `/dev/proto/faq-trust`
- Sign-up shell: `/dev/proto/sign-up`
- Pre-signup interview: `/dev/proto/pre-signup-interview`
- Post-connect dashboard: `/dev/proto/post-connect-dashboard?variant=conservative|expressive`
- **Section-confirm hub:** `/dev/proto/section-confirm/` (new this session — branch only, post-merge available on `construct-dev.vercel.app`)
- **Section-confirm forms:** `/dev/proto/section-confirm/categorise` · `/dev/proto/section-confirm/confirm-recurring`
- Registry hub: `/dev/proto` (62 rows · 3 refreshed this session)
