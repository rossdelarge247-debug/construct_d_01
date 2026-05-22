# Session 115 Pre-flight Context Block (carrying session 114 wrap delta)

## Session 114 wrap delta — read this first

Session 114 closed the `S-PROTO-post-connect-dashboard-canvas-port` slice that session 113 had opened. PR [#221](https://github.com/rossdelarge247-debug/construct_d_01/pull/221) is open. Branch tip `24dbd53`, ahead-7 of main `34f87d7`. Decoded canvas + `SignedInHeader` chrome (session 113) plus slice docs + dashboard route + smoke test + 2 rounds of PR-feedback fixes (session 114) all sit on the branch.

### What shipped on the branch (7 commits ahead)

- `a273514` — decoded bundled canvas (session 113)
- `c80b070` — `SignedInHeader` chrome + 10 specs (session 113)
- `7244332` — Session 113 wrap docs (session 113)
- `0cc5e07` — Slice docs (4 files · 225L): acceptance · verification · security · test-plan (session 114)
- `0c13b0b` — Dashboard route + smoke test (912 insertions): `src/app/dev/proto/post-connect-dashboard/page.tsx` (800L · 5 components + Dashboard wrapper) + `tests/unit/proto-post-connect-dashboard/dashboard.test.tsx` (10 cases) (session 114)
- `f0d63d4` — PR-review fix batch (17/-18): `prefers-reduced-motion` via Tailwind `motion-reduce:` variant, `disabled` on LockedSection CTAs, `UploadIc`→`UploadIcon`, `pageBg`→`mainBg`, AC-7 reworded to match canvas reality, spec-citation paraphrases dropped (session 114)
- `24dbd53` — Scope add-on for pre-existing Lint failures (49/-50): hoisted `const Card` out of `HeroComposition()` to module scope in `marketing-landing/page.tsx`; converted on-mount rehydrate-effect to `useState` lazy initializer in `welcome-tour/page.tsx`. User-authorised scope add-on per `AskUserQuestion`. Local lint post-fix: 0 errors / 50 pre-existing warnings (session 114)

### What did NOT ship

- PR #221 merge (awaiting user preview-walk + reviewer approve + final-CI-green confirm)
- 6-dim preview-deploy rubric in `verification.md` filled (user-side)
- Variant pruning (Conservative or Expressive — to be picked after user walks both)

### What's open for session 115

- Confirm CI green on PR #221 after the `24dbd53` lint cleanup
- User preview-walks both `?variant=conservative` and `?variant=expressive` URLs
- Pick variant; prune the loser
- Merge PR #221
- Move to next-up priority

## Session 115 priorities — user picks scope

Most natural continuation: P1 (close PR #221 — preview walk + merge). Other prototype work remains available.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Close PR #221** | Confirm CI green; user preview-walk Conservative + Expressive at preview URL; pick variant; prune loser; reviewer approve; merge | Small (user walk + small prune + merge) | No |
| 2 | **Mobile responsive marketing-landing** | Add responsive breakpoints (375 · 480 · 768 · 1024 · 1280 · 1320+) on top of the shipped port. Answers registry's `Mobile-first vs desktop-first authoring order?` open question. Ships as separate slice `S-PROTO-marketing-landing-responsive-mobile`. | Medium | No |
| 3 | **Promote pre-auth-public shells to full canvases** | `/how-it-works` · `/pricing` · `/faq-trust` are placeholder routes. Replace each with a full canvas-as-source port. | Small-Medium per route | No |
| 4 | **Welcome-tour migrate to SignedInHeader** | Replace welcome-tour's bespoke TopBar with `SignedInHeader mode='tour' rightSlot={…}`. Ships as `S-INFRA-welcome-tour-signedinheader-migrate`. | Small | Soft-blocked on P1 (dashboard validates `app` mode first; needs PR #221 merged) |
| 5 | **A11y holistic pass (deferred from sessions 111-114)** | System-wide responsive a11y + NVDA/VoiceOver + roving-tabindex + Footer MUTE + the PhaseStrip opacity-contrast (logged session 114). Revisit "once we've got all the screens". | Medium-Large | Soft-blocked on prototype-phase completion |
| 6 | **User-directed fresh work** | Post-signup, authenticated-screens beyond dashboard, Decouple.zip unpacking, Mobile Screens v2, etc. | Varies | n/a |

**Recommended:** P1 (close PR #221 — merge first, take the win, then choose next surface).

## Scoping-discipline observations carried as recurrence-watch

**Session 114 applied:**

- Pre-priority verification — branch tip + slice-shipped-state confirmed via `git log --oneline` before treating session 113's in-flight work as resumable.
- Verify before planning — confirmed session-113 captured decisions still held with user before resuming impl.
- AskUserQuestion frontloading — scope-add-on decision (fix lint in PR vs separate slice vs admin-bypass) settled via question, not by silently deciding.

**New observations this session (one-session-observed; promote at second session if recurs):**

- **Branch-checkout content inflates session line-count budget.** Switching to session 113's branch added ~2,139L pre-existing committed content to working-tree state; line-count hook attributed all of it against session 114's first-Edit baseline. STOP fired at 2,442L before any real code was written. User-authorised override needed. Promotion target: extend the existing "Hook line-count attribution on agent-written files" observation to cover branch-checkout surfacing.
- **AC-write before canvas-read fabricates AC content.** AC-7 was authored asserting "three rows (canvas's 'Pages built', 'Disclosure', 'Reconcile')" without reading the canvas section first; the canvas has a single-section card. Auto-review's `ac-gap` finding caught it. Promotion target: anchor each AC's claim to a canvas line-range only AFTER reading that range.
- **Surgical-edit identifier renames need `replace_all: true`.** `pageBg`→`mainBg` const-side edit succeeded but JSX-usage at L667 was untouched; caught only via grep sweep before push. Promotion target: when renaming an identifier with >1 usage, prefer `Edit replace_all: true` over surgical Edits.
- **`npm ci` works in agent sandbox.** Earlier observation "`npx vitest` blocked without `npm install`" is incomplete — `npm ci` itself works; only fresh-installed vitest mis-resolves its config. For CI-failure diagnosis, `npm ci && npm run lint` should be the FIRST step, not a fallback after guessing. Caching `node_modules` between sessions would speed it up. Promotion target: refine the existing observation, AND add "CI-log-fetch needs local-equivalent first" as method.
- **Subscription-onboarding system-prompt fires concurrent with wrap → split focus.** `subscribe_pr_activity` confirmation system-injects an "investigate now" directive that runs in parallel with whatever the session is mid-doing. Tractable if PR-review fixes are completed before resuming wrap. Promotion target: the subscription tool's onboarding message could honour session-state context.

**Carried unchanged from session 113 (3 entries):**

- Canvas-decode commits eat the session line budget (1,750L tracked for dashboard's decode alone).
- TDD-guard + stop-hook untracked-file complaints compound to force commits.
- Hook session-churn counter resets across SessionStart hook fires within a continuous conversation (5 SessionStart fires in session 114 again).

**Carried unchanged from session 112 (3 entries):**

- Hook line-count attribution on agent-written files surfaces full LoC against the parent session's first Edit.
- `npx vitest` blocked in agent sandbox without `npm install` — partially superseded by session-114's finding above.
- Agent task with batch-end report can fail with API 529 Overloaded.

**Carried unchanged from session 111 (3 entries):**

- React inline-style shorthand+longhand diff edge case (not exercised session 114).
- Sandbox blocks Vercel preview URL (`x-deny-reason: host_not_allowed`) — exercised this session via PR-side preview walk routing through user.
- `/dev/control` 404 on Vercel previews (not exercised session 114).

**Carried unchanged from session 110 (3 entries — multi-PR unmerged backlog, bundled-wrap-PR risk, audit-style slice line-count budget). None exercised session 114.**

**Wrap-protocol skipping (sixth-session-eligible if session 115 inherits clean main):** Sessions 108-110 paid turn-0 cost; sessions 111-114 paid none after prior session wrapped properly. Session 114 inherited clean session-113 wrap (in-flight slice cleanly documented). Promotion-eligible to numbered negative constraint #42 if session 115 confirms a sixth.

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md` for full list; entries unchanged.

## Authoritative reading order at session 115 start

1. This file.
2. `docs/HANDOFF-SESSION-114.md` (retro — dashboard slice closure, PR-review fixes, scope add-on lint cleanup, persona findings).
3. **If PR #221 still open at turn 0:** check PR status via `mcp__github__pull_request_read` (`get_check_runs` + `get_review_comments` + `get_comments`); confirm tip `24dbd53` is the head.
4. **If PR #221 merged before turn 0:** move to next-priority deliberation; session-114 dashboard slice is on main.

## Session 115 kickoff prompt (paste-ready)

```
Kick off session 115.

Read docs/SESSION-CONTEXT.md first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Session 114 closed S-PROTO-post-connect-dashboard-canvas-port:
  PR #221 open at tip 24dbd53 (after PR-review fixes + scope
  add-on pre-existing-Lint cleanup).
- If continuing P1 (close PR #221): work proceeds either on the
  branch claude/S-PROTO-post-connect-dashboard-canvas-port (if
  the PR is still open) or off clean main (if user merged before
  kickoff).
- If switching to P2-6: harness-suffixed branch off clean main.
- If the harness landed you on a different base, follow
  CLAUDE.md §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-114.md.
3. For P1 (close PR #221): check PR status via
   mcp__github__pull_request_read (get_check_runs +
   get_review_comments + get_comments).

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For P1 (close PR #221):
- Confirm PR #221 still open + tip 24dbd53.
- Confirm CI checks green (Lint + Fitness functions + spec-
  citation-quote-check + auto-review aggregate).
- Confirm whether user has walked the preview yet.
- If preview-walk done + variant picked + reviewer ok: prune the
  loser variant + merge.
- If preview-walk pending: nudge user.

For P2 (mobile responsive marketing-landing):
- Read canvas's only @media block (prefers-reduced-motion at
  L680); no responsive breakpoints in canvas. Mobile is add-work.
- Answer the registry's open question (Mobile-first vs desktop-
  first authoring order?) explicitly with user before scoping.

For P3 (promote shells to full canvases):
- Confirm shell route shape via cat src/app/dev/proto/{how-it-
  works,pricing,faq-trust}/page.tsx (placeholder pattern).
- Confirm each canvas exists. Decode if bundled-form.

Confirm priority with the user. Recommended: P1 (close PR #221 —
merge first, then choose next surface).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 16 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app` · React 19.2.4 (eslint-plugin-react-hooks 5+ rules `react-hooks/static-components` + `react-hooks/set-state-in-effect` strict as of session 114).

Prototype on main now spans (post-session-114 close-out, pending PR #221 merge):
- **Pre-signup-interview prototype** — 12 screens with shared chassis + 5 Help Rail variants.
- **Marketing landing prototype** — 8-section single-page scroll at `/dev/proto/marketing-landing`.
- **Welcome tour prototype** — canvas-as-source port at `/dev/proto/welcome-tour`.
- **Pre-auth-public route shells** — `/how-it-works` · `/pricing` · `/faq-trust` placeholder routes.
- **Signed-in shared chrome** — `src/components/layout/signed-in-header.tsx` (session 113).
- **Post-connect dashboard prototype** — `src/app/dev/proto/post-connect-dashboard/page.tsx` with `?variant=conservative|expressive` query routing (session 114, pending merge via PR #221).

## Branch

Session 114 work lives on `claude/S-PROTO-post-connect-dashboard-canvas-port` (7 commits ahead of `origin/main 34f87d7` plus the session-114 wrap commit; PR #221 open). Slice closed; awaiting merge.

Session 115 branch: continue on the same branch for P1 (until PR merges); harness-suffixed off clean main for P2-6.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 114.** Forty-seven scoping-discipline observations on recurrence-watch (5 new session 114 — branch-checkout line-count inflation · AC-write-before-canvas-read · partial-rename without replace_all · `npm ci` works in sandbox · subscription-onboarding split focus). Wrap-protocol skipping is **sixth-session-eligible** session 115 if main is clean at turn 0.

**Active pre-existing CI status (post-session-114 cleanup):**

- 50 ESLint warnings repo-wide (all pre-existing baseline; non-blocking — CI tolerates warnings, only errors fail).
- 0 ESLint errors (cleaned session 114 via scope add-on).
- `Footer.module.css:33-36` `.captionDisabled` uses MUTE — adjacent observation carried forward to the deferred holistic a11y pass.

## Scope ceiling

Session 115 is most likely P1 (close PR #221) — small + bounded (preview walk + variant pick + merge). Out of scope unless explicitly added: post-signup work · authenticated-screens beyond dashboard · Decouple.zip unpacking · Mobile Screens v2.

## Current prototype URLs

- Marketing landing: `https://construct-dev.vercel.app/dev/proto/marketing-landing`
- Welcome tour: `https://construct-dev.vercel.app/dev/proto/welcome-tour`
- Pre-auth-public shells: `/dev/proto/how-it-works` · `/dev/proto/pricing` · `/dev/proto/faq-trust`
- Pre-signup interview: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- **Post-connect dashboard:** preview URL on PR #221 (surfaced as Vercel comment); production `/dev/proto/post-connect-dashboard?variant=conservative|expressive` post-merge.
- Per-PR preview: surfaced as Vercel comment on each PR.
