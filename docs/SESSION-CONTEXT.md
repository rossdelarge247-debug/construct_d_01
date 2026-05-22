# Session 117 Pre-flight Context Block (carrying session 116 wrap delta)

## Session 116 wrap delta — read this first

Session 116 closed `S-PROTO-journey-restore` end-to-end. PR #222 merged to main as `3b30a06`. The slice that session 115 had scaffolded (acceptance.md only · `a35fd28`) is now complete: all 6 ACs shipped, auto-review approved on round 2, user-merged.

**Phase 3 sequence is back on track.** Per the new CLAUDE.md §"Phase 3 sequence" §Status footer (added by AC-6): sessions 112-114 ran off-sequence (canvas-ports against §1/§3/§5 surfaces); session 115's scaffold + session 116's impl of this slice restore discipline; **next planned is `S-PROTO-section-confirm` (§6 Build phase confirm pattern)** per HANDOFF-74 L80-82 verbatim.

### What shipped to main (squash-merged in #222 = `3b30a06`)

| Surface | Change | AC |
|---|---|---|
| `src/app/dev/proto/registry-schema.ts` | `'shell-built'` added to `statusSchema` between `canvas-drafted` + `prototype-built` | AC-1 |
| `src/app/dev/proto/registry.ts` | 7 row updates (marketing-landing + how-it-works + pricing + faq-trust + sign-up + welcome-tour + hub-day-7-state-f) | AC-1 + AC-3 |
| `src/app/dev/proto/_components/StatusBadge.tsx` | New `'shell-built'` arm (🔵 emoji) | AC-1 |
| `src/app/dev/proto/marketing-landing/page.tsx` | Top-nav Pricing + Start CTAs wired to real routes via `next/link`; Sign in kept with TODO | AC-2 |
| `src/app/dev/proto/pre-signup-interview/screens/O8.tsx` | Terminal Continue → `router.push('/dev/proto/sign-up')` | AC-3 |
| `src/app/dev/proto/sign-up/page.tsx` | New shell stub mirroring faq-trust chrome | AC-3 |
| `.github/PULL_REQUEST_TEMPLATE.md` | 7th DoD item (registry row updated) | AC-4 |
| `.github/workflows/pr-dod.yml` | New `registry-update-check` job + env-map LABELS interpolation | AC-4 + auto-review round 1 fix |
| `.claude/hooks/journey-declared.sh` + `settings.json` | New PostToolUse advisory hook for `**Journey:**` field | AC-5 |
| `tests/shellspec/journey-declared.spec.sh` | 9-example spec for the new hook | AC-5 |
| `CLAUDE.md` §"Visual direction" §"Journey wiring" | New sub-section codifying the convention | AC-5 |
| `CLAUDE.md` §"Phase 3 sequence" | New top-level section anchoring HANDOFF-74 L80-82 + off-sequence-flagging rule | AC-6 |

Plus slice docs (security · test-plan · verification) at `docs/slices/S-PROTO-journey-restore/`.

### What did NOT ship (deferred, carry-over)

- **Pre-existing `slice-verification` job LABELS shell-injection** in same `pr-dod.yml` file. Same vulnerability class auto-review flagged on my new job; surgical-changes discipline kept this PR out of fixing the existing one. Carry-over to a follow-up infra slice (priority #7).
- **Sign-up canvas port** — the shell is now `shell-built` in registry; canvas at `docs/design-source/mobile-screens-v2/` per spec 65a awaits porting. Includes prototype-readiness persona's round-1 finding about replacing dev-path metadata body copy with warm post-O8 holding message.
- **Mobile-responsive marketing-landing** — carried from session 115.
- **A11y holistic pass** — carried from sessions 111-115; still soft-blocked on prototype-phase completion.

### Session 116 priorities table — user picks scope

Recommended P1: `S-PROTO-section-confirm` (back on Phase 3 sequence). Per CLAUDE.md §"Phase 3 sequence" §Status (shipped AC-6 this session), the on-sequence ladder per HANDOFF-74 L80-82 verbatim is **P1: section-confirm (Build) · P2: ai-coach (Settle) · P3: share-flow (Reconcile multi-actor)**. Off-sequence work is permitted but must be flagged with `OFF-SEQUENCE because X` per the same §Status rule.

**On-sequence (HANDOFF-74 L80-82 verbatim):**

| # | Priority | Phase | Scope | Effort | Blocked? |
|---|---|---|---|---|---|
| 1 | **`S-PROTO-section-confirm`** | §6 Build | Build phase confirm pattern — next slice in Phase 3 sequence. Registry row L54 `per-section-confirm` is `spec-only` / `confidence: low` / `tags: high-uncertainty`. Open Q on row: "8 sections × multi-state — canvas-first vs prototype?" — resolve with user before AC-freeze. | Medium-Large | No |
| 2 | **`S-PROTO-ai-coach`** | §8 Settle | Settle phase AI coach surface. Registry row L74 `ai-coach` is `spec-only` / `confidence: low` / `tags: ai-dependent, high-uncertainty`. Open Q: "Invocation pattern + conversational scope?" Likely needs section-confirm shape decisions to anchor. | Large | Soft-blocked on section-confirm shape |
| 3 | **`S-PROTO-share-flow`** | §7 Reconcile | Multi-actor share flow (Sarah/Mark joint). Registry row L69 is `spec-only` / `confidence: low` / `tags: multi-actor, high-uncertainty`. Open Q: "Invite mechanics + real-time-vs-async?" | Large | Soft-blocked on Build state landing |

**Off-sequence (each carries `OFF-SEQUENCE because X` rationale per CLAUDE.md §"Phase 3 sequence" rule):**

| # | Priority | OFF-SEQUENCE rationale | Scope | Effort |
|---|---|---|---|---|
| 4 | **Mobile responsive marketing-landing** | OFF-SEQUENCE because opportunistic — answers registry row L19 open Q `Mobile-first vs desktop-first authoring order?` on the shipped marketing port; doesn't progress Build/Settle/Reconcile spine | 6-breakpoint responsive pass on the shipped port; ships as `S-PROTO-marketing-landing-responsive-mobile` | Medium |
| 5 | **Promote pre-auth-public shells to full canvases** | OFF-SEQUENCE because canvas-port readiness — the 3 routes now sit `shell-built` per AC-1 with canvases extant at `docs/design-source/mobile-screens-v2/`; advances marketing-launch readiness but not Build/Settle/Reconcile spine | `/how-it-works` · `/pricing` · `/faq-trust` shells → canvas-as-source ports | Small-Medium per route |
| 6 | **Sign-up canvas port** | OFF-SEQUENCE because dependency-of-AC-3 — the shell stub I just shipped points here; addresses prototype-readiness persona's round-1 copy-clarity finding (warm post-O8 holding message vs current dev-path metadata) | Port canvas at `docs/design-source/mobile-screens-v2/` per spec 65a; replace body copy per persona suggestion | Medium |
| 7 | **Welcome-tour migrate to SignedInHeader** | OFF-SEQUENCE because scope-add-on — surfaced in session 114 PR #221 as soft-blocked while dashboard validated `app` mode; now unblocked | Bespoke TopBar → `SignedInHeader mode='tour'`; `S-INFRA-welcome-tour-signedinheader-migrate` | Small |
| 8 | **A11y holistic pass** | OFF-SEQUENCE because cross-cutting infrastructure — not surface-progression; deferred from sessions 111-115 with `Soft-blocked on prototype-phase completion` rationale; the deferral itself is the off-sequence justification | System-wide responsive a11y + NVDA/VoiceOver + roving-tabindex + Footer MUTE + PhaseStrip opacity-contrast | Medium-Large |
| 9 | **`slice-verification` LABELS injection fix** | OFF-SEQUENCE because CI-infrastructure carry-over — same script-injection class auto-review flagged on this slice's new `registry-update-check` job, but in the pre-existing `slice-verification` job. Surgical infra fix | `.github/workflows/pr-dod.yml` `LABELS=...` → `env:` map | Tiny |
| 10 | **User-directed fresh work** | OFF-SEQUENCE — explicitly user-discretionary | Post-signup · authenticated screens beyond dashboard · Decouple.zip unpacking · Mobile Screens v2 · etc. | Varies |

## Scoping-discipline observations carried as recurrence-watch

**Session 116 applied (existing observations):**

- **Verify before planning** held — kickoff's stale claim about HANDOFF-115 existing caught pre-impl via `git ls-remote` + `git diff --stat`. Saved the embarrassment of building on a non-existent file.
- **AskUserQuestion frontloading** — priority confirmation asked before resync; user picked P1 cleanly.
- **TDD-guard OVERRIDE pattern for multi-symbol RED→GREEN transits** — documented hatch in `tdd-guard.sh` L241-251. Used via Bash + python sub for atomic multi-row registry updates. Worked cleanly.
- **Snapshot before refactor** — three checkpoint commits as ACs landed (`53c19fd` slice docs → `880a18f` AC-1+3 → `1ff4a55` AC-2+4+5+6 → `66f6fe6` auto-review fixes). Squash-merge collapsed them to a single main commit.

**New observations this session (one-session-observed; promote at second session if recurs):**

- **Filename convention drift in AC text.** AC-5 named the shellspec file `journey-declared_spec.sh` (underscore); repo convention is `.spec.sh` (dot). Caught at shellspec runtime (file pattern mismatch). Slice-scoping discipline: name-by-precedent (grep adjacent files) rather than name-from-memory.
- **AC-3 Link-vs-router.push deviation.** AC named `Next.js Link` but Footer's `<button>` CTA can't be `<a>`-wrapped (invalid HTML). Used `router.push` instead. Flagged in verification.md AC-3 §Impl note. Future ACs touching CTAs: prefer naming the navigation primitive generically ("Next.js navigation") unless `<Link>`'s `<a>` rendering is specifically required.
- **Comment-review hook fires on doc-content false positives.** Triggered on emoji in StatusBadge UI strings, "SESSION-74" as a literal filename citation required by AC-6, and "slice S-X" as the literal placeholder in the convention example. Each advisory-only so no gate hit, but noise-to-signal felt high. Promotion target: refine hook's skip-list for §Visual-direction-style spec text + filename-citation patterns.
- **Auto-review caught a security finding I would have missed.** The new `registry-update-check` job copied the existing `slice-verification` job's `LABELS='${{ ... }}'` pattern — which is itself vulnerable to script injection. The security persona flagged my new job; the existing one carries the same vuln but wasn't flagged because it was outside the diff. Promotion target: pattern-audit when copying CI workflow snippets, not just literal-text-copy.
- **Self-violation of own session's discipline (user-caught post-wrap).** AC-6 codified the off-sequence-flag rule; first wrap doc immediately violated it. Prevention shipped same wrap PR (T1: CLAUDE.md §"Apply your own deltas first" rule + T2: `wrap-check.sh` self-delta-audit step). **Tracking under this entry**: count recurrences of the meta-failure (codifying a rule then violating it in same session's wrap). 1st recurrence after T1+T2 lands = promote to numbered negative constraint. 2nd recurrence = escalate to T3 (per-rule author-time hook) or T4 (adversarial review subagent pass on wrap docs against current CLAUDE.md), pick based on whether failure is concentrated to one rule or diffuse across many. See CLAUDE.md §"Apply your own deltas first" §Status for escalation criteria detail.

**Carried unchanged from session 115 (5 entries):**

- Branch-checkout content inflates session line-count budget (~2,139L pre-existing in this session's branch-resume; surfaced earlier in session-114 work).
- AC-write before canvas-read fabricates AC content (not exercised this session — AC-3 deviation was different mode).
- Surgical-edit identifier renames need `replace_all: true`.
- `npm ci` works in agent sandbox; only fresh-installed vitest mis-resolves its config.
- Subscription-onboarding system-prompt fires concurrent with wrap → split focus.

**Carried unchanged from sessions 113-114 (3 entries):** Canvas-decode commits eat the session line budget · TDD-guard + stop-hook untracked-file complaints compound to force commits · Hook session-churn counter resets across SessionStart hook fires.

**Carried unchanged from session 112 (3 entries):** Hook line-count attribution on agent-written files · `npx vitest` blocked without install (refined session 114) · Agent task with batch-end report can fail with API 529 Overloaded.

**Carried unchanged from session 111 (3 entries):** React inline-style shorthand+longhand diff edge case · Sandbox blocks Vercel preview URL · `/dev/control` 404 on Vercel previews.

**Carried unchanged from session 110 (3 entries):** Multi-PR unmerged backlog · bundled-wrap-PR risk · audit-style slice line-count budget. None exercised session 116.

**Wrap-protocol skipping (seventh-session-eligible if session 117 inherits clean main):** Sessions 108-110 paid turn-0 cost; sessions 111-114 paid none after prior session wrapped properly; session 115 SKIPPED its wrap (no HANDOFF-115, no SESSION-CONTEXT refresh) and session 116 paid the cost — kickoff stale claims caught pre-impl but cost a frontloaded `AskUserQuestion` round + 3-batch verification. **Promotion-eligible to numbered negative constraint #42 if session 117 confirms a seventh AND session 117 inherits clean wrap from session 116.**

**Carried unchanged from earlier sessions (24 entries):** see `docs/HANDOFF-SESSION-109.md` for full list.

## Authoritative reading order at session 117 start

1. This file.
2. `docs/HANDOFF-SESSION-116.md` (retro — `S-PROTO-journey-restore` impl, auto-review 2-round cycle, persona findings, key decisions).
3. **If continuing P1 (S-PROTO-section-confirm):** read `docs/workspace-spec/68b-decisions-build.md` for the locked Build-phase mechanics + the existing `per-section-confirm` registry row L54 for status.
4. **Always:** verify branch state via SessionStart hook; check `origin/main` tip matches `3b30a06` or has advanced.

## Session 117 kickoff prompt (paste-ready)

```
Kick off session 117.

Read docs/SESSION-CONTEXT.md first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Session 116 closed S-PROTO-journey-restore: PR #222
  squash-merged to main as 3b30a06. All 6 ACs shipped.
- Per CLAUDE.md §"Phase 3 sequence" §Status (added in AC-6
  this session), the on-sequence ladder per HANDOFF-74
  L80-82 verbatim is:
    P1 (on-sequence next):  S-PROTO-section-confirm (§6 Build)
    P2 (on-sequence after): S-PROTO-ai-coach        (§8 Settle)
    P3 (on-sequence after): S-PROTO-share-flow      (§7 Reconcile)
  Any priority other than these three at session 117 start
  must carry `OFF-SEQUENCE because X` rationale per the same
  §Status rule.
- Harness-suffixed branch off clean main is the expected
  starting state.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-116.md.
3. For P1 (S-PROTO-section-confirm):
   - docs/workspace-spec/68b-decisions-build.md §Build phase
     locked decisions (Sarah's Picture mechanics).
   - docs/workspace-spec/70-build-map-build.md (Phase 2 in
     Build Map).
   - src/app/dev/proto/registry.ts L54 (existing
     `per-section-confirm` row, status `spec-only`,
     confidence `low`, tags `high-uncertainty`).

Pre-priority verifications (run BEFORE first edit, per
CLAUDE.md §"Planning conduct"):

For P1 (S-PROTO-section-confirm):
- Confirm 68b §Build is the right canonical source vs 68 hub
  for the confirm pattern's locked mechanics.
- Read 70-build-map-build for the section-confirm-flagged
  tagging (Anchor / Derived / Variant / Re-use / Preserve-
  with-reskin / Known-unknown).
- Check for any canvas at docs/design-source/ for the
  per-section confirm pattern. If bundled-canvas, decode via
  scripts/decode-bundler-canvas.sh first per CLAUDE.md
  §"Pre-priority canvas-fidelity verification".
- Acknowledge the open question on registry row L54: "8
  sections × multi-state — canvas-first vs prototype?" —
  resolve with user before AC-freeze.

For P2-P8 alternatives: see SESSION-CONTEXT priorities table.

Confirm priority with the user. Recommended: P1
(S-PROTO-section-confirm — back on Phase 3 sequence).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 16 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app` · React 19.2.4 (`react-hooks/static-components` + `react-hooks/set-state-in-effect` strict).

Prototype on main now spans (post-session-116 merge):

- **Pre-signup-interview prototype** — 12 screens with shared chassis + 5 Help Rail variants; O8 outbound now wired to `/dev/proto/sign-up`.
- **Marketing landing prototype** — 8-section single-page scroll at `/dev/proto/marketing-landing`; Pricing + Start CTAs wired to real routes.
- **Welcome tour prototype** — canvas-as-source port at `/dev/proto/welcome-tour`.
- **Pre-auth-public route shells** — `/how-it-works` · `/pricing` · `/faq-trust` placeholder routes (all `shell-built`).
- **Sign-up route shell** — new at `/dev/proto/sign-up` from session 116 (status `shell-built`).
- **Signed-in shared chrome** — `src/components/layout/signed-in-header.tsx` (session 113).
- **Post-connect dashboard prototype** — `src/app/dev/proto/post-connect-dashboard/page.tsx` with `?variant=conservative|expressive` query routing (session 114, merged in #221 session 115).

## Branch

Session 116 work merged to `main` as `3b30a06` via PR #222. This wrap doc + `HANDOFF-SESSION-116.md` to be PR'd separately from a `claude/session-116-wrap` branch (per CLAUDE.md §"Wrapping up a session" step 6).

Session 117 branch: harness-suffixed off clean main once this wrap PR merges. Or per-slice named branch (e.g. `claude/S-PROTO-section-confirm-XXXXX`) per the convention.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 116.** Four new scoping-discipline observations on recurrence-watch (filename-convention drift · AC Link-vs-router-push deviation · comment-review hook doc-content false positives · auto-review caught security issue main missed). Wrap-protocol skipping is **seventh-session-eligible** session 117 IF session 117 inherits clean wrap from session 116.

**Active pre-existing CI status (post-session-116 merge):**

- 50 ESLint warnings repo-wide (all pre-existing baseline; non-blocking).
- 0 ESLint errors.
- Pre-existing `slice-verification` job LABELS shell-injection (same class as round-1 finding, not fixed this PR per surgical-changes discipline). Carry-over to priority #7.

## Scope ceiling

Session 117 P1 (S-PROTO-section-confirm) is Medium-Large. Out of scope unless explicitly added: post-signup work · authenticated-screens beyond dashboard · Decouple.zip unpacking · Mobile Screens v2.

## Current prototype URLs

- Marketing landing: `https://construct-dev.vercel.app/dev/proto/marketing-landing` (Pricing + Start CTAs now routable)
- Welcome tour: `https://construct-dev.vercel.app/dev/proto/welcome-tour`
- Pre-auth-public shells: `/dev/proto/how-it-works` · `/dev/proto/pricing` · `/dev/proto/faq-trust`
- **Sign-up shell:** `/dev/proto/sign-up` (new this session)
- Pre-signup interview: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview` (O8 Continue now lands on /sign-up)
- Post-connect dashboard: `/dev/proto/post-connect-dashboard?variant=conservative|expressive`
- Registry hub: `/dev/proto` (62 rows · 7 refreshed this session)
