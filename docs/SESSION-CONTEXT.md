# Session 116 Pre-flight Context Block (carrying session 115 wrap delta)

## Session 115 wrap delta — read this first

Session 115 closed three open items and opened one new slice scaffold:

1. **PR #221 merged** at commit `f2936d5` (squash). Brought session 113 + 114 wrap docs + `S-PROTO-post-connect-dashboard-canvas-port` slice (route + smoke test + 4 slice docs) onto main. All 25 CI checks passed pre-merge; auto-review verdict was advisory `request-changes` (5 non-blocking findings, none gating per CLAUDE.md §"Verdict vocabulary"). Variant pruning deferred — both `?variant=conservative|expressive` shipped side-by-side on main.

2. **Phase 3 plan audit + scope-lock.** User flagged that Phase 3 prototype work had lapsed two disciplines documented in HANDOFF-SESSION-74 L9-10 + L80-82 (registry-as-tracker · journey wiring · Phase 3 sequence: hub → pre-signup-interview → section-confirm → ai-coach → share-flow). Audit confirmed: 56 of 62 registry rows still on `lastTouched: session 74`; six shipped surfaces (marketing-landing #216, welcome-tour #217, three shells #218/#219/#220, dashboard #221) all stayed at `status: canvas-drafted`; no inter-surface navigation wired (marketing-landing CTAs all `#hash`); §6 Build / §8 Settle / §7 Reconcile spine never advanced after pre-signup-interview.

3. **Slice scaffold drafted: `S-PROTO-journey-restore`.** Branch `claude/S-PROTO-journey-restore` at commit `a35fd28`, pushed to origin. `docs/slices/S-PROTO-journey-restore/acceptance.md` (118L) lays out 6 ACs:
   - **AC-1** registry refresh — 6 rows to `prototype-built` / new `shell-built` status; `lastTouched: session 115`; `links.prototype` populated; status enum extended in `registry-schema.ts`.
   - **AC-2** marketing-landing CTAs to real routes — top-nav `#pricing` → `/dev/proto/pricing`; top-nav `Start` `#start` → `/dev/proto/pre-signup-interview`; `#signin` kept as hash with TODO; all in-page section anchors preserved.
   - **AC-3** pre-signup-interview O8 outbound + sign-up shell stub — final O8 CTA → `/dev/proto/sign-up`; new shell at that route (matches existing how-it-works/pricing/faq-trust shell pattern).
   - **AC-4** DoD item 7 — PR template + `pr-dod.yml` registry-update gate when `src/app/dev/proto/<dir>/page.tsx` touched.
   - **AC-5** `**Journey:**` acceptance.md field convention + `.claude/hooks/journey-declared.sh` author-time advisory hook + shellspec test + CLAUDE.md §"Visual direction" §"Journey wiring" sub-section.
   - **AC-6** Phase 3 sequence anchored as new always-loaded CLAUDE.md top-level section (quotes HANDOFF-74 L80-82 verbatim).

   Implementation deferred to session 116 — line-count hook STOPPED at turn 7 attributing PR #221's merge tree-state delta (+3416/-143 from the merge bringing in new files) to session churn, exceeding 2,000L threshold despite real session writes being a single 118L acceptance.md.

### What did NOT ship

- `S-PROTO-journey-restore` impl (AC-1 through AC-6) — scaffold-only.
- `verification.md` / `security.md` / `test-plan.md` for the new slice (planned next session as part of the same one-slice PR).
- The §"Phase 3 sequence" and §"Journey wiring" CLAUDE.md additions are described in acceptance.md, not yet applied.
- PR for `S-PROTO-journey-restore` not opened — slice incomplete.

## Session 116 priorities — user-locked

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **`S-PROTO-journey-restore` impl** | All 6 ACs per `docs/slices/S-PROTO-journey-restore/acceptance.md`. Continue on branch `claude/S-PROTO-journey-restore` (already has scaffold commit `a35fd28`). Write `verification.md` + `security.md` + `test-plan.md`; implement ACs in order AC-1 → AC-6; open PR. | Large (~600L impl + 150L docs across 8-10 files) | No — branch exists, scaffold landed |
| 2 | **`S-PROTO-section-confirm`** (the actual next Phase 3 slice per HANDOFF-74 L80-82) | §6 Build phase per-section confirmation pattern. The post-journey-restore re-anchored next step. | Medium-Large | Soft-blocked on P1 (journey-restore's §"Phase 3 sequence" anchor lands first) |
| 3 | **Mobile responsive marketing-landing** | Add responsive breakpoints. Ships as `S-PROTO-marketing-landing-responsive-mobile`. | Medium | Off-sequence per AC-6 anchor — flag as `OFF-SEQUENCE because <reason>` if picked |
| 4 | **User-directed fresh work** | Post-signup, authenticated-screens beyond dashboard, etc. | Varies | n/a |

**Recommended:** P1 (finish what session 115 scaffolded — the lapsed-discipline restoration is what the user explicitly asked for).

## Scoping-discipline observations carried as recurrence-watch

**Session 115 applied:**

- Pre-priority shipped-artifact verification — kickoff claimed PR #221 tip `24dbd53`; verified live as `b6c1497` (one commit stale). Pattern documented in CLAUDE.md §"Planning conduct" already; exercised cleanly.
- Pre-priority verification on a wrap-state assumption — kickoff assumed sessions 113 + 114 had wrapped to main; verified live that HANDOFF-113/114 lived on the PR branch (not main), surfacing the bundled-wrap-PR pattern. Resolved at merge time.
- Plan-vs-spec cross-check — restored Phase 3 sequence from HANDOFF-74 L80-82 verbatim before drafting the slice's AC-6.

**New observations this session (one-session-observed; promote at second session if recurs):**

- **Post-merge tree-state delta over-counts session churn.** After `mcp__github__merge_pull_request` + `git fetch` + `git checkout -B`, the line-count hook attributes the entire PR's `additions/deletions` to the current session's first subsequent Write. Session 115's real write was 118 lines (acceptance.md); hook reported 3,677 (+3416 from PR #221 merge + 118 + other). STOP fired prematurely. Distinct from the documented "branch-checkout line-count inflation" (session 114) — that was checkout adding pre-existing committed content; this is merge bringing new committed content. Same surface, different trigger.
- **Comment-review hook stub-mode false-positives on legitimate plan-history citations in slice docs.** `acceptance.md` §"Why" + §"References" cite HANDOFF-SESSION-74 by filename and quote-verbatim per CLAUDE.md §"Planning conduct" §"Quote, don't paraphrase". Hook regex matched "SESSION-74" and flagged "temporal provenance". CLAUDE.md exempts §Status footers ("lineage IS the section's purpose"); slice References sections are analogous but not in the hook's skip-list. Promotion target: either (a) skip-list extension for `docs/slices/**/acceptance.md` §"References" + §"Why" sections, or (b) more nuanced regex (skip on a citation-style path-reference).

**Carried unchanged from session 114 (5 entries):**

- Branch-checkout content inflates session line-count budget (now paired with new "post-merge tree-state delta" observation above).
- AC-write before canvas-read fabricates AC content.
- Surgical-edit identifier renames need `replace_all: true`.
- `npm ci` works in agent sandbox; only fresh-installed vitest mis-resolves config.
- Subscription-onboarding system-prompt fires concurrent with wrap → split focus.

**Carried unchanged from session 113 (3 entries):**

- Canvas-decode commits eat the session line budget.
- TDD-guard + stop-hook untracked-file complaints compound to force commits.
- Hook session-churn counter resets across SessionStart hook fires within a continuous conversation.

**Carried unchanged from session 112 (3 entries):** Hook line-count attribution on agent-written files · `npx vitest` blocked partial-supersede · Agent batch-end 529.

**Carried unchanged from session 111 (3 entries):** React inline-style shorthand+longhand · Sandbox blocks Vercel preview URL · `/dev/control` 404 on previews.

**Carried unchanged from session 110 (3 entries):** Multi-PR unmerged backlog · bundled-wrap-PR risk (exercised session 115 via PR #221 carrying sessions-113+114 wrap docs) · audit-style slice line-count budget.

**Wrap-protocol skipping (sixth-session-confirmed):** Sessions 108-114 paid no turn-0 cost. Session 115 started clean (kickoff branch == main); after PR #221 merged mid-session, the next session inherits clean main. Pattern now sixth-session-confirmed. Promotion-eligible to numbered negative constraint #42 — recommend session 116 makes the promotion call.

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md` for full list; entries unchanged.

## Authoritative reading order at session 116 start

1. This file.
2. `docs/HANDOFF-SESSION-115.md` (retro — Phase 3 plan audit, PR #221 merge, slice scaffold, hook attribution false-positive).
3. `docs/slices/S-PROTO-journey-restore/acceptance.md` (the 6-AC scope — locked at session 115 with user-approved recommendations).
4. For impl reference: existing shell pattern at `src/app/dev/proto/{how-it-works,pricing,faq-trust}/page.tsx`; registry schema at `src/app/dev/proto/registry-schema.ts`; PR DoD workflow at `.github/workflows/pr-dod.yml`.

## Session 116 kickoff prompt (paste-ready)

```
Kick off session 116.

Read docs/SESSION-CONTEXT.md first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Session 115 scaffolded S-PROTO-journey-restore: branch
  claude/S-PROTO-journey-restore at commit a35fd28 (1 ahead of
  main). docs/slices/S-PROTO-journey-restore/acceptance.md (118L)
  locked the 6-AC scope with the user.
- If continuing P1 (S-PROTO-journey-restore impl): check out the
  existing branch — git fetch origin claude/S-PROTO-journey-restore
  && git checkout claude/S-PROTO-journey-restore — and start with
  verification.md / security.md / test-plan.md before AC-1 code.
- If the harness landed you elsewhere, follow CLAUDE.md
  §"Branch-resume check".

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-115.md.
3. docs/slices/S-PROTO-journey-restore/acceptance.md (the locked
   6-AC scope).

Pre-priority verifications (run BEFORE first edit):
- Confirm acceptance.md ACs still hold against current main state
  (PR #221 already merged; no further main-side drift expected).
- Cross-check AC-2 hrefs to verify line numbers (the
  marketing-landing/page.tsx L260-279 references hold per session-115
  audit; reconfirm before editing).
- Cross-check AC-3 by reading an existing shell (e.g.
  src/app/dev/proto/faq-trust/page.tsx) for the back-link + heading
  pattern to mirror.

Implementation order (AC-1 → AC-6 per acceptance.md):
1. Slice docs first: verification.md + security.md + test-plan.md.
2. AC-1: registry-schema.ts (add 'shell-built' to status enum) +
   registry.ts (update 7 rows: 6 existing + new sign-up-row touch).
3. AC-3: new shell at src/app/dev/proto/sign-up/page.tsx + O8 CTA
   edit in pre-signup-interview.
4. AC-2: marketing-landing/page.tsx 2 href changes + TODO comment.
5. AC-4: .github/PULL_REQUEST_TEMPLATE.md + .github/workflows/
   pr-dod.yml extension.
6. AC-5: .claude/hooks/journey-declared.sh + .claude/settings.json
   + tests/shellspec/journey-declared_spec.sh + CLAUDE.md
   §"Visual direction" §"Journey wiring" sub-section.
7. AC-6: CLAUDE.md new top-level §"Phase 3 sequence".
8. Tests where tractable (registry-schema enum test +
   marketing-landing render test for Start CTA href).
9. Open PR with all 6 ACs + verification.md evidence rows.

Confirm priority with user at turn 1. Recommended: P1
(complete the slice that was scaffolded session 115).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 16 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app` · React 19.2.4.

Prototype on main now spans (post-#221-merge):

- **Pre-signup-interview prototype** — 12 screens with shared chassis + 5 Help Rail variants.
- **Marketing landing prototype** — 8-section single-page scroll at `/dev/proto/marketing-landing`.
- **Welcome tour prototype** — canvas-as-source port at `/dev/proto/welcome-tour`.
- **Pre-auth-public route shells** — `/how-it-works` · `/pricing` · `/faq-trust` placeholder routes.
- **Post-connect dashboard prototype** — `/dev/proto/post-connect-dashboard?variant=conservative|expressive` (both variants live on main; pruning deferred).
- **Signed-in shared chrome** — `src/components/layout/signed-in-header.tsx`.

## Branch

Session 115 work split across two branches:

- `claude/session-115-kickoff-Wa3Lf` (kickoff) — wrap docs only (this file + HANDOFF-115). At main + 1 wrap commit.
- `claude/S-PROTO-journey-restore` (slice scaffold) — acceptance.md only at commit `a35fd28`. Pushed to origin.

Session 116 branch: continue on `claude/S-PROTO-journey-restore` for P1 impl.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 115.** Forty-nine scoping-discipline observations on recurrence-watch (2 new session 115 — post-merge tree-state delta over-counts churn · comment-review false-positive on slice-doc lineage citations). Wrap-protocol skipping **sixth-session-confirmed** — recommend session 116 promotes to numbered #42.

**Active pre-existing CI status (post-#221 merge):**

- 50 ESLint warnings repo-wide (pre-existing baseline; non-blocking).
- 0 ESLint errors.
- `Footer.module.css:33-36` `.captionDisabled` uses MUTE — adjacent observation carried forward to deferred a11y pass.

## Scope ceiling

Session 116 is likely P1 (complete the slice) — large but bounded by the locked 6-AC scope. Out of scope unless explicitly added: post-signup work beyond the sign-up shell stub · authenticated-screens beyond dashboard · Decouple.zip unpacking · Mobile Screens v2 · variant pruning on dashboard.

## Current prototype URLs

- Marketing landing: `https://construct-dev.vercel.app/dev/proto/marketing-landing`
- Welcome tour: `https://construct-dev.vercel.app/dev/proto/welcome-tour`
- Pre-auth-public shells: `/dev/proto/how-it-works` · `/dev/proto/pricing` · `/dev/proto/faq-trust`
- Pre-signup interview: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Post-connect dashboard: `/dev/proto/post-connect-dashboard?variant=conservative|expressive` (production, post-#221 merge)
- Per-PR preview: surfaced as Vercel comment on each PR.
