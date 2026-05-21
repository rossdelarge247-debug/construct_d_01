# Session 114 Pre-flight Context Block (carrying session 113 wrap delta)

## Session 113 wrap delta — read this first

Session 113 opened the `S-PROTO-post-connect-dashboard-canvas-port` slice (P4 from session 112's priority list). Three load-bearing design decisions captured via `AskUserQuestion`; decoded canvas + chrome shipped; dashboard route + slice docs deferred. Branch `claude/S-PROTO-post-connect-dashboard-canvas-port` ahead-2 of main (`34f87d7`); no PR opened.

### What shipped on the branch

- **`a273514`** — decoded bundled-form canvas to `docs/design-source/post-connect-dashboard/decoded/Post-connect Dashboard - Standalone.html` (1,750L readable HTML).
- **`c80b070`** — `src/components/layout/signed-in-header.tsx` (148L) + 10 passing specs at `tests/unit/components/layout/signed-in-header.test.tsx`. Mobile-first responsive; `mode='app' | 'tour'` prop. Welcome-tour intentionally untouched.

### Decisions captured in conversation (NOT in slice docs — re-surface to next session)

1. **Header architecture** — one shared `SignedInHeader` with `mode` prop. (Already shipped at `c80b070`.)
2. **Variant strategy** — ship BOTH Conservative + Expressive side-by-side at `/dev/proto/post-connect-dashboard?variant=conservative|expressive` (defaults to conservative). User picks after preview.
3. **Slice scope** — bundle SignedInHeader + dashboard route in one slice + one PR.

### What did NOT ship

- `src/app/dev/proto/post-connect-dashboard/page.tsx` (dashboard route + variant query routing + 5 supporting components).
- `docs/slices/S-PROTO-post-connect-dashboard-canvas-port/{acceptance,verification,security,test-plan}.md`.
- Adversarial review · PR · merge.

**Detailed retro in `docs/HANDOFF-SESSION-113.md`.**

## Session 114 priorities — user picks scope

Most natural continuation: P1 (continue the in-flight dashboard slice). Other prototype work remains available.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Continue `S-PROTO-post-connect-dashboard-canvas-port` slice** | Write 4 slice docs · port dashboard route with `?variant=` query routing · ship Conservative + Expressive side-by-side · 5 supporting components (PhaseStrip, ConnectedBanner, DisclosureCard, PrepTasksCard, LockedSection×2) · add route smoke test · adversarial review · PR · merge | Medium-Large (full session) | No |
| 2 | **Mobile responsive pass for marketing-landing** | Add responsive breakpoints (375 · 480 · 768 · 1024 · 1280 · 1320+) on top of the shipped port. Answers registry's `Mobile-first vs desktop-first authoring order?` open question via the empirical adapt. Ships as separate slice `S-PROTO-marketing-landing-responsive-mobile`. | Medium | No |
| 3 | **Promote pre-auth-public shells to full canvases** | `S-PROTO-how-it-works-shell` + `S-PROTO-pricing-shell` + `S-PROTO-faq-trust-shell` merged as placeholders (PRs #218/219/220). Replace each with a full canvas-as-source port. | Small-Medium per route | No |
| 4 | **Welcome-tour migrate to SignedInHeader** | Session 113 deliberately left welcome-tour on its bespoke TopBar. Future migration: replace welcome-tour's TopBar with `SignedInHeader mode='tour' rightSlot={…}`. Ships as `S-INFRA-welcome-tour-signedinheader-migrate`. | Small | Soft-blocked on P1 (dashboard validates the `app` mode first) |
| 5 | **A11y holistic pass (deferred from sessions 111-113)** | System-wide responsive a11y + NVDA/VoiceOver + roving-tabindex + Footer MUTE. User framed for "once we've got all the screens"; revisit when that's true. | Medium-Large | Soft-blocked on prototype-phase completion |
| 6 | **User-directed fresh work** | Post-signup, authenticated-screens beyond dashboard, Decouple.zip unpacking, Mobile Screens v2, etc. | Varies | n/a |

**Recommended:** P1 (close the loop on session 113's in-flight slice — chrome is shipped, route + docs are scoped, decisions are captured). Otherwise P3 (promote placeholder shells to full canvases) is a natural batch.

## Scoping-discipline observations carried as recurrence-watch

**Session 113 applied:**

- Pre-priority canvas-fidelity verification — bundled-form canvas detected at turn 0 via `head -c 200`; `scripts/decode-bundler-canvas.sh` invoked before any port work. CLAUDE.md §"Planning conduct" §"Pre-priority canvas-fidelity verification" honoured.
- Verify before planning — `git log --oneline origin/main` confirmed 4 slices merged since session 112 wrap; priority table refreshed accordingly.
- AskUserQuestion frontloading — 3 design decisions settled before any code; no mid-impl re-scoping required.

**New observations this session (one-session-observed; promote at second session if recurs):**

- **Canvas-decode commits eat the session line budget.** Decoded canvas alone = 1,750L tracked. With 1,500L soft-warn and 2,000L STOP, the impl + slice docs window was effectively zero. Future canvas-port sessions should account for decode-output line counts BEFORE planning impl scope (or split into two sessions: decode + scope · impl). Promotion target: SESSION-CONTEXT priority table could carry "decode-and-scope only" / "impl-only" framing for canvas-port priorities >1,500L.
- **TDD-guard + stop-hook untracked-file complaint compound to force commits.** Wrote test file before component, `tdd-guard` blocked the component Write, stop-hook fired on the untracked test — only clean exit was finishing the component (test imports it; committing just the test fails CI). Pattern: TDD-first sequencing locks in component-completion as non-optional once the test is uncommitted on disk. Promotion target: TDD-guard error message could note the compound risk explicitly.
- **Hook session-churn counter resets across SessionStart hook fires within a continuous conversation.** Three SessionStart hooks fired this session; line-count counter reset to 0 each time. Useful for budget recovery; misleading for honest budget reporting (the in-conversation work IS continuous from user's standpoint). Promotion target: clarify the reset behaviour in the hook's status message.

**Carried unchanged from session 112 (3 entries):**

- Hook line-count attribution on agent-written files surfaces full LoC against the parent session's first Edit.
- `npx vitest` blocked in agent sandbox without `npm install`.
- Agent task with batch-end report can fail with API 529 Overloaded.

**Carried unchanged from session 111 (3 entries):**

- React inline-style shorthand+longhand diff edge case (not exercised session 113).
- Sandbox blocks Vercel preview URL (`x-deny-reason: host_not_allowed`) — not exercised session 113 (no PR opened).
- `/dev/control` 404 on Vercel previews (not exercised session 113).

**Carried unchanged from session 110 (3 entries — multi-PR unmerged backlog, bundled-wrap-PR risk, audit-style slice line-count budget). None exercised session 113.**

**Wrap-protocol skipping (fifth-session-observed if session 114 inherits clean main):** Sessions 108-110 paid turn-0 cost; sessions 111-113 paid none after prior session wrapped properly. Session 113 inherited clean main + 4 newly-merged slices — confirms session-112 wrap was effective. Promotion-eligible to numbered negative constraint #42 if session 114 confirms a fifth.

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md` for full list; entries unchanged.

## Authoritative reading order at session 114 start

1. This file.
2. `docs/HANDOFF-SESSION-113.md` (retro — dashboard slice opening, 3 captured decisions, stop-hook + TDD-guard compound observation).
3. For P1 (continue dashboard slice):
   - Decoded canvas at `docs/design-source/post-connect-dashboard/decoded/Post-connect Dashboard - Standalone.html` (1,750L; Dashboard JSX at L1184-1738, sub-components at L1184-1734, TopBar at L1231-1290, Wordmark at L1218-1229).
   - Shipped chrome at `src/components/layout/signed-in-header.tsx` + tests.
   - Spec 68g §"Visual anchors" C-V11..C-V14 (Phase C extraction shortlist for dashboard components).
4. For P3 (promote shells): existing shell routes at `src/app/dev/proto/{how-it-works,pricing,faq-trust}/` + canvases under `docs/design-source/`.

## Session 114 kickoff prompt (paste-ready)

```
Kick off session 114.

Read docs/SESSION-CONTEXT.md first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Session 113 left an UNMERGED in-flight slice on branch
  claude/S-PROTO-post-connect-dashboard-canvas-port (commits
  a273514 + c80b070 — decoded canvas + SignedInHeader chrome
  only). No PR opened. Dashboard route + 4 slice docs deferred.
- If continuing P1: resume on
  claude/S-PROTO-post-connect-dashboard-canvas-port
  (git fetch + git checkout -B if not already on it).
- If switching to P2-6: harness-suffixed branch off clean main.
- If the harness landed you on a different base, follow
  CLAUDE.md §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-113.md.
3. For P1 (dashboard slice continuation): decoded canvas at
   docs/design-source/post-connect-dashboard/decoded/
   Post-connect Dashboard - Standalone.html
   + shipped chrome at src/components/layout/signed-in-header.tsx.

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For P1 (continue dashboard slice):
- Confirm session-113 branch tip c80b070 still resolves
  (git fetch origin claude/S-PROTO-post-connect-dashboard-canvas-port).
- Re-surface the 3 captured decisions to user (header architecture
  · variant strategy · slice scope — all in
  docs/HANDOFF-SESSION-113.md §"Decisions captured").
- Confirm dashboard slice docs still missing
  (ls docs/slices/ | grep -i dashboard expects nothing).
- Estimate: 4 slice docs (~300L) + dashboard route + 5 components
  (~600-800L) + route smoke test (~50L) + adversarial review
  + PR. Full session budget.

For P2 (mobile responsive marketing-landing):
- Read canvas's only @media block (prefers-reduced-motion at L680);
  no responsive breakpoints in canvas. Mobile is add-work.
- Answer the registry's open question
  (Mobile-first vs desktop-first authoring order?) explicitly with
  user before scoping.

For P3 (promote shells to full canvases):
- Confirm shell route shape via cat
  src/app/dev/proto/how-it-works/page.tsx (placeholder pattern).
- Confirm each canvas exists (ls docs/design-source/how-it-works/
  etc.). Decode if bundled-form.

Confirm priority with the user. Recommended: P1 (close the loop
on session 113's in-flight dashboard slice).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

Prototype on main now spans:
- **Pre-signup-interview prototype** — 12 screens (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) with shared chassis + 5 Help Rail variants. All Phase 1 a11y fixes shipped via session 111.
- **Marketing landing prototype** — 8-section single-page scroll at `/dev/proto/marketing-landing` (shipped session 112, merged session 113 inheritance).
- **Welcome tour prototype** — canvas-as-source port (shipped session 113 inheritance, PR #217).
- **Pre-auth-public route shells** — `/how-it-works` · `/pricing` · `/faq-trust` placeholder routes (shipped session 113 inheritance, PRs #218/219/220).
- **Signed-in shared chrome** — `src/components/layout/signed-in-header.tsx` (shipped session 113 on `claude/S-PROTO-post-connect-dashboard-canvas-port`, unmerged at session end).

## Branch

Session 113 work lives on `claude/S-PROTO-post-connect-dashboard-canvas-port` (2 commits ahead of `origin/main 34f87d7`; not yet PR'd). Slice in flight.

Session 114 branch: continue on the same branch for P1, OR harness-suffixed off clean main for P2-6.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 113.** Forty-two scoping-discipline observations on recurrence-watch (3 new session 113 — canvas-decode budget burn; TDD-guard + stop-hook compound; hook session-churn counter resets). Wrap-protocol skipping is **fifth-session-eligible** session 114 if main is clean at turn 0.

**Active pre-existing CI failures (carry forward):**

- 16 pre-existing ESLint warnings in O1.tsx / O2.tsx / O3.tsx / O8.tsx / o7.ts / o8.ts (unused-vars). All pre-existing; not regressions. Unchanged session 113.
- `Footer.module.css:33-36` `.captionDisabled` uses MUTE — adjacent observation carried forward to the deferred holistic a11y pass.

## Scope ceiling

Session 114 is most likely P1 (continue dashboard slice) — bounded but substantial (full session). Out of scope unless explicitly added: post-signup work · authenticated-screens beyond dashboard · Decouple.zip unpacking · Mobile Screens v2.

## Current prototype URLs

- Marketing landing: `https://construct-dev.vercel.app/dev/proto/marketing-landing`
- Welcome tour: `https://construct-dev.vercel.app/dev/proto/welcome-tour`
- Pre-auth-public shells: `/dev/proto/how-it-works` · `/dev/proto/pricing` · `/dev/proto/faq-trust`
- Pre-signup interview: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Post-connect dashboard: TBD (lands when P1 ships in session 114)
- Per-PR preview: surfaced as Vercel comment on each PR.
- Variant toggle for Help Rails: production + local only at `/dev/control`; on previews use `?variant.helpRail=v1|v2|v3|v4|v5`.
