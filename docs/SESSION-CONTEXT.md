# Session 113 Pre-flight Context Block (carrying session 112 wrap delta)

## Session 112 wrap delta — read this first

Session 112 shipped the first marketing-landing prototype slice: `S-PROTO-marketing-landing-canvas-port`. Canvas-as-source port of an 8-section single-page vertical scroll landing page to `/dev/proto/marketing-landing`. Slice + wrap docs both on `claude/session-112-kickoff-gpWhH`; **no PR opened this session** — user opens when ready.

### Slice shipped — `S-PROTO-marketing-landing-canvas-port`

Category `prototype`. `src/app/dev/proto/marketing-landing/page.tsx` (1,457 lines, single file) ports the canvas with:
- 8 sections in source order: hero · picture · journey · compare · trust · pricing · faq · closing.
- Sticky header + nav + skip-link + main landmark + footer.
- 11 inline SVG icons via `Ic` factory + inline `Wordmark`.
- 7 canonical colour constants → `tokens.color.*`; 4 canvas-local one-offs inlined (SOFT, WARM, `#D6D3CC`, `#3F3F3F`).
- Phase tints declared as inline `PHASE` const at file head (canvas L758-764 verbatim).
- FAQ accordion: `useState<number | null>(null)` single-open behaviour, `aria-expanded` + `aria-controls`.

**Test:** `tests/unit/proto-marketing-landing/faq-accordion.test.tsx` written (4 cases). Execution deferred — agent container has no `node_modules`, vitest fresh-install path doesn't resolve `vitest/config`. User-side `npm test` or CI on push will run.

**No PR open.** Slice + wrap on `claude/session-112-kickoff-gpWhH`. Commit `ce0f246`.

**Detailed retro in `docs/HANDOFF-SESSION-112.md`.**

## Session 113 priorities — user picks scope

The marketing-landing slice needs preview-deploy + PR + merge before any responsive follow-up. Other prototype surfaces remain available.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Marketing-landing preview-deploy verification + PR + merge** | User walks `/dev/proto/marketing-landing` on Vercel preview, confirms 6-dim rubric, opens PR, squash-merges. Optional: promote registry row to `live`. | Trivial (review) + Small (PR) | No |
| 2 | **Mobile responsive pass for marketing-landing** | Add responsive breakpoints (375 · 480 · 768 · 1024 · 1280 · 1320+) on top of the shipped port. Answers registry's `Mobile-first vs desktop-first authoring order?` open question via the empirical adapt. Ships as separate slice `S-PROTO-marketing-landing-responsive-mobile`. | Medium | No (#1 should land first ideally) |
| 3 | **Next prototype surface — Welcome Tour** | Canvas at `docs/design-source/welcome-tour/`. Canvas-as-source pattern same as marketing-landing. | Medium | No |
| 4 | **Next prototype surface — Post-connect Dashboard** | Canvas at `docs/design-source/post-connect-dashboard/`. C-V11..C-V14 anchors per spec 68g. Heavier than marketing-landing if multi-state. | Medium-Large | No |
| 5 | **Adjacent pre-auth-public route** | Dedicated routes for `how-it-works`, `pricing`, `faq-trust` (registry §1 entries) — separate slice each. Currently the marketing-landing canvas folds them as scroll sections. Decision: ship dedicated routes or stay scroll? | Small-Medium per route | Product decision |
| 6 | **A11y holistic pass (deferred from session 112)** | System-wide responsive a11y + NVDA/VoiceOver + roving-tabindex + Footer MUTE. User framed for "once we've got all the screens"; revisit when that's true. | Medium-Large | Soft-blocked on prototype-phase completion |
| 7 | **User-directed fresh work** | Mobile Screens v2, Decouple.zip unpacking, authenticated-screens header, post-signup, etc. | Varies | n/a |

**Recommended:** P1 (preview-walk + PR + merge for the new slice) is the cleanest opening move — closes the loop on this session's work before scoping new. If user has reviewed already, P2 (responsive pass) is the natural follow-up; P3 (Welcome Tour) is the natural fresh-surface pick.

## Scoping-discipline observations carried as recurrence-watch

**Session 112 applied:**

- Pre-priority canvas-fidelity verification — `docs/design-source/marketing-landing/decoded/Landing Page - Standalone.html` already in repo. CLAUDE.md §"Planning conduct" §(a) satisfied.
- Quote, don't paraphrase — CLAUDE.md §"Canvas-as-source" 5-step quoted verbatim in acceptance.md plan-vs-spec cross-check. Author-time hook flagged 2 stub-mode false-positives at section headers (`## Test-pain audit (per spec 72d §3)`) where verbatim quote sat on the next line; live-mode persona would resolve.
- Pre-priority verification — `git log --oneline origin/main | head -5` at turn 0 confirmed session-111 squash-merges on main. No catch-up cost.
- Verify before planning — registry checked for marketing-landing row status; open questions (`Mobile-first vs desktop-first authoring order?`) carried to acceptance.md deferrals.

**New observations this session (one-session-observed; promote at second session if recurs):**

- **Hook line-count attribution on agent-written files surfaces full LoC against the parent session's first Edit.** Untracked file written by sub-agent → main session's first Edit on it computes diff baseline as empty → all the agent's lines counted as the parent's session churn. Pattern: false-positive line-budget alarm. Promotion target: line-count hook could distinguish agent-vs-main-session writes.
- **`npx vitest` blocked in agent sandbox without `npm install`.** Fresh-installed vitest doesn't resolve `vitest/config` from the local config. Tests can be written but execution defers to user/CI.
- **Agent task with batch-end report can fail with API 529 Overloaded.** Long-running general-purpose agent (~20 minutes) succeeded at file write + failed at report. Files on disk; main session recovered cleanly via `git status` + targeted greps. Pattern is recoverable but flags fragility of batch-end-only reports.

**Carried unchanged from session 111 (3 entries):**

- React inline-style shorthand+longhand diff edge case (not exercised session 112).
- Sandbox blocks Vercel preview URL (`x-deny-reason: host_not_allowed`) — re-exercised session 112; AC-12 preview-deploy evidence routes through user-side.
- `/dev/control` 404 on Vercel previews (not exercised session 112).

**Carried unchanged from session 110 (3 entries — multi-PR unmerged backlog, bundled-wrap-PR risk, audit-style slice line-count budget). Bundled-wrap-PR risk exercised this session (single-branch wrap-into-impl due to line budget); no merge conflict yet because PR isn't open.**

**Carried unchanged from session 109 (3 entries — none exercised session 112).**

**Wrap-protocol skipping (fourth-session-observed via session 112's pre-flight clean-main confirmation):** Sessions 108-110 paid turn-0 cost; sessions 111-112 paid none after prior session wrapped properly. Promotion-eligible to numbered negative constraint #42 if session 113+ confirms a fifth.

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md` for full list; entries unchanged.

## Authoritative reading order at session 113 start

1. This file.
2. `docs/HANDOFF-SESSION-112.md` (retro — marketing-landing port, agent delegation pattern, 529 recovery, hook-attribution observation).
3. For preview-deploy + PR + merge of the marketing-landing slice: `docs/slices/S-PROTO-marketing-landing-canvas-port/{acceptance,verification,test-plan,security}.md`.
4. For mobile responsive pass: same slice docs + canvas at `docs/design-source/marketing-landing/decoded/Landing Page - Standalone.html`.
5. For Welcome Tour: `docs/design-source/welcome-tour/` (canvas to-be-decoded; check `decoded/` subdir + `scripts/decode-bundler-canvas.sh` if missing).
6. For Post-connect Dashboard: `docs/design-source/post-connect-dashboard/` + spec 68g §"Visual anchors" C-V11..C-V14.

## Session 113 kickoff prompt (paste-ready)

```
Kick off session 113.

Read docs/SESSION-CONTEXT.md first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch.
- Session 112 left an UNMERGED slice on branch
  claude/session-112-kickoff-gpWhH (commit ce0f246 — marketing-landing
  canvas-as-source port + wrap). No PR opened. Verify via
  `git log --oneline claude/session-112-kickoff-gpWhH | head -3` if
  uncertain.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-112.md.
3. For marketing-landing PR review/merge: the slice's 4 docs at
   docs/slices/S-PROTO-marketing-landing-canvas-port/.

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For P1 (marketing-landing preview-deploy + PR + merge):
- Confirm session-112 branch tip ce0f246 still resolves
  (git fetch origin claude/session-112-kickoff-gpWhH).
- If user has preview-walked, fill out 6-dim rubric table in
  verification.md, run `npm test tests/unit/proto-marketing-landing/`,
  open PR if green.

For P2 (mobile responsive pass):
- Read canvas's only @media block (prefers-reduced-motion at L680);
  no responsive breakpoints in canvas. Mobile is add-work.
- Answer the registry's open question
  (Mobile-first vs desktop-first authoring order?) explicitly with
  user before scoping.

For P3 (Welcome Tour):
- ls docs/design-source/welcome-tour/decoded/ to check decoded sibling
  exists (CLAUDE.md §"Planning conduct" §"Pre-priority canvas-fidelity").
- If not, run scripts/decode-bundler-canvas.sh first.

Confirm priority with the user. Recommended: P1 (close the loop on
session 112's slice). P3 (Welcome Tour) is the natural next prototype
surface.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

Prototype on main now spans:
- **Pre-signup-interview prototype:** 12 screens (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) with shared chassis + 5 Help Rail variants. All Phase 1 a11y fixes (F-A11Y-01..18) shipped via session 111.
- **Marketing landing prototype:** 8-section single-page scroll at `/dev/proto/marketing-landing` (shipped session 112 on `claude/session-112-kickoff-gpWhH`, unmerged at session end).

## Branch

Session 112 work lives on `claude/session-112-kickoff-gpWhH` (1 commit ahead of `origin/main e9e1208`; not yet PR'd).

Session 113 branch: harness-suffixed off clean main (post P1 merge), OR scope-named sub-branch.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 112.** Thirty-nine scoping-discipline observations on recurrence-watch (3 new session 112 — hook line-count attribution on agent files; `npx vitest` blocked without `npm install`; agent batch-end-report 529 failure). Wrap-protocol skipping is **fourth-session-observed**, promotion-eligible if session 113+ confirms a fifth.

**Active pre-existing CI failures (carry forward):**

- 16 pre-existing ESLint warnings in O1.tsx / O2.tsx / O3.tsx / O8.tsx / o7.ts / o8.ts (unused-vars). All pre-existing; not regressions. Unchanged session 112.
- `Footer.module.css:33-36` `.captionDisabled` uses MUTE — adjacent observation carried forward to the deferred holistic a11y pass.

## Scope ceiling

Session 113 is most likely P1 (close session-112 loop) or P3 (Welcome Tour) — both bounded. P2 (mobile responsive) is also bounded but harder if the canvas has no responsive scaffolding. Out of scope unless explicitly added: post-signup work · authenticated-screens · Decouple.zip unpacking · Mobile Screens v2.

## Current prototype URLs

- Production landing: `https://construct-dev.vercel.app/dev/proto/marketing-landing` (after main-merge of session-112 slice)
- Pre-signup interview: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- Variant toggle for Help Rails: production + local only at `/dev/control`; on previews use `?variant.helpRail=v1|v2|v3|v4|v5`.
