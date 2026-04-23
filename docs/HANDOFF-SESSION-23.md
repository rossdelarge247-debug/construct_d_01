# Session 23 Handoff

**Date:** 22 April 2026
**Branch:** `claude/execution-planning-copy-audit-Il2WK`
**Scope:** Design / planning — execution-phase preparation. P0-1 rebuild strategy + security + classification audit + Phase C sequencing. P0-2 first-slice decision locked. P0-3 (design tokens) + P1 (copy audit) deferred to session 24. No `src/` code changes.

---

## What happened

### Session started with wrong branch base (again — but recovered fast)

Harness assigned branch `claude/execution-planning-copy-audit-Il2WK` but base was pre-session-20 (`2fc0a2f`). None of sessions 19-22's work visible. Session 22 had hit the identical snag and had resolved by resetting to its proper base. This time: flagged the mismatch up-front, drafted a prompt for session 22 to either merge PR #2 or force-push its tip, user relayed, PR #2 was squash-merged to main as `dbab16a`. Then reset session-23 branch to origin/main cleanly. Confirmation recorded: CLAUDE.md's stale startup-branch reference was also fixed as a small housekeeping commit to prevent future sessions from hitting the same issue.

### Pre-work A integrated (session-ops improvements, now)

User brought a "ways-of-working audit" set of inputs based on external research: Karpathy's CLAUDE.md + Medium "4-phase Claude Code workflow" + Reddit threads + MCP backlog-manager tools. Rather than wholesale adopting, synthesised into `docs/engineering-phase-candidates.md` — parked doc with 7 sections:
- A. Karpathy-derived Coding conduct section (near-verbatim — think-before-code, simplicity-first, surgical-changes, goal-driven-execution)
- B. Engineering conventions (TDD, adversarial review gate, snapshot-before-refactor, deterministic-over-generative, 6-item DoD)
- C. Per-slice AC template
- D. Per-slice test plan template
- E. `.claude/agents/*` experiment for slice-reviewer / acceptance-gate / ux-polish-reviewer
- F. Explicit rejected-with-reasoning list (4-phase ritual, 4-agent naming, duplicate plan.md, 60% context clear-and-restart, backlog MCP tools)
- G. Open questions for Phase C kickoff
Parked at docs/ root until Phase C code work begins; captures the synthesis without polluting live CLAUDE.md.

### Pre-work B engineering security principles deserved its own spec

User flagged pen-test readiness + security-mindset engineering as a pre-P0 concern alongside (A). Proposed fitting into the existing risk register (54) + launch readiness (56) didn't satisfy — those cover the WHAT and WHEN, not the engineering HOW. Produced **spec 72 · Engineering security principles** as the execution layer: 11 sections, 542 lines total, covering data classification (6-tier T0-T5 with composition + cross-party rules), env-var + secrets conventions (naming format, scope prefixes, NEXT_PUBLIC_ bans, inventory table), auth + session pattern (2FA mandatory, NIST password policy, magic-link second-party, cookie flags, anomaly detection, account takeover), RLS + authorisation (RLS mandatory from day one, default-deny, private-data pattern, joint-data pattern for Our Household Picture, selective-publish mechanics), input/output validation (Zod at every boundary, file upload magic-byte MIME check, URL allowlist, rate limiting), logging + scrubbing (tier-based, never-log list, reference-ID errors, immutable audit log), dev/prod boundary enforcement (multi-layer — single source of truth, runtime assertion, Vercel scoping, route-level gate, fixture isolation, CI gate), third-party data flow (per-provider register, minimisation rules, webhook signing, egress allowlist), safeguarding engineering (exit-this-page implementation sequence, device-privacy O3 actual effect, T4 leak prevention), pen-test readiness (security headers + CSP + OWASP ASVS L1+L2 mapping + common-findings pre-addressed), per-slice security DoD addition (13-item checklist).

### P0-1a classification audit via Explore agent

Session 22's Build Map hub had classified headline items (bank + AI libs, engine workbench, hub types, components/workspace/* as Discarded). Large middle zone — ~50 files — unclassified. Launched Explore agent in background with a self-contained prompt; came back in ~2m with 59-file audit. Key findings:
- **Marketing pages** (`app/page.tsx`, `app/features`, `app/pricing`) → **Discarded**, not Preserve-with-reskin. Violate spec 42 positioning ("Financial disclosure, sorted" / "28-page Form E nightmare"). This was a material correction.
- **Hub components** — split: 5 Re-use, 1 Preserve-with-reskin, 1 Discarded (title-bar — V1 palette), 2 Dev-only+Move (debug-panel, tink-debug-panel)
- **Most `src/lib/*`** → Re-use cleanly (AI pipeline, analytics, documents, recommendations, stripe, supabase except workspace-store)
- **`lib/supabase/workspace-store.ts`** → Preserve-with-reskin (feeds S-F7 WorkspaceStore prod impl)
- **UI primitives + layout** → Preserve-with-reskin (V1 palette tokens, shells reusable)
- **`types/interview.ts`** → Discarded; **`types/workspace.ts`** → Preserve-with-reskin; **`types/hub.ts`** → Re-use with pruning
- **`constants/index.ts`** → Preserve-with-reskin (hardcodes 4-phase `WORKSPACE_PHASES`, needs update to spec 42 five-phase)
- **Legal placeholders** (`privacy`, `terms`, `cookies`) → Preserve-with-reskin shells pending legal review (spec 56 L2)

### P0-1d spec 70 hub inventory rewrite

Replaced the hub's Preserved legacy inventory + Discarded sections with audit-integrated version (229 lines total). New subsections added: Auth + persistence · Payments + analytics + documents · Hooks · Constants + utilities · UI primitives + layout · Hub components · API routes · Known-unknowns. Dev tools subsection now flagged with Move-to-/app/dev/ per spec 71 S-F7 pattern + spec 72 §7 boundary enforcement. Audit trail footer recorded session 22 → session 23 corrections.

### P0-1c spec 71 rebuild strategy produced

Eight sections, 517 lines: purpose · §1 decision recap (4 locks: same-repo in-place, hybrid layout, stable-lib paths kept, staged removal) · §2 target folder structure (app/(marketing) + app/(authed) route groups, app/dev/ namespace, components/design-system + anchors + documents + features + layout + dev, lib/auth + lib/store abstraction layer) · §3 stable-lib preservation (paths unchanged, explicit move table for 6 files) · §4 dev-mode pattern (three abstractions Session + WorkspaceStore + AuthGate, switch mechanism, dev/prod implementations, dev surface routes, env-banner reskin, 8-scenario fixture library, real-Supabase migration playbook parked) · §5 staged discard removal (12-row table mapping slices to deletions) · §6 known-unknowns resolved (all 4 spec-70-hub flags resolved via targeted workspace/* file inspection — all Discarded; state-machine pattern captured at design-level in S-F7, not code-ported) · §7 migration sequencing (C.0 ops setup, C.1 foundation 6 slices, C.2 public+onboarding, C.3 first post-auth + Build remainder, C.4 Reconcile/Settle/Finalise) · §8 S-F7 slice card · §7a Deployment model Phase-C-freeze topology.

### P0-2 first-slice decision locked

User pressed on two underexplored questions mid-P0-2:
1. "Where does the public site + neo interview come?" — exposed a gap in my original sequencing that buried marketing + interview inside a single S-O1 slice without clear positioning. Revised: **Phase C.2 = S-M1 marketing rewrite + S-O1 primary onboarding** (built together for coherent public journey), **Phase C.3 = S-B1 bank connection + thin S-B4 taster** (first post-auth).
2. "Does S-B4 incorporate spec 67 profiling?" — exposed gap that spec 67 didn't have a clear slice-ownership map. Added one: Layer 1 pre-signup interview (spec 65) → S-O1; Layer 2 Moment 2 pre-bank → S-O1; Layer 3 Moment 3 post-bank → S-B1 + S-B4; Layer 4 per-section confirm-or-correct (spec 22 trees) → S-B4; Layer 5 respondent journey → S-O2; Layer 6 ongoing progressive disclosure → S-B3 + S-B7.

Then user asked about browser testing during Phase-C-freeze — surfaced the Phase-C-freeze topology properly: three URLs (prod frozen / phase-c integration / per-slice Preview), branch flow, hotfix protocol. Committed decisions to spec 71 §7a.

### Context-pressure hang midway

Around the transition from spec 54/56 reads into spec 72 writing, combined parallel large reads (spec 54 273 lines + spec 56 284 lines) + bash enumeration hit stream timeout. User prompted to check in. Recovered by pausing, proposing smaller chunks, then executing spec 72 in three batches of 3-4 sections each with commit between. Same session-22 lesson: big operations should be split. Will tighten further in session 24.

## Key decisions made

**Rebuild strategy (4 decisions locked):**
- Same-repo in-place restructure (not parallel `src2/`, not new repo)
- Hybrid folder layout — phases for routes, concerns for components
- Stable-lib paths kept unchanged (zero import-churn on Re-use items)
- Staged discard-tree removal per slice DoD (not big-bang)

**Dev-mode pattern (S-F7 added as new foundation slice — 32nd):**
- Single master env var `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=dev|prod` (locked over alternatives)
- Three abstractions: `Session` + `WorkspaceStore` + `AuthGate` interfaces in `src/lib/auth/` + `src/lib/store/`
- Dev implementation = localStorage-backed fixture user (`@dev.decouple.local` synthetic email)
- Prod implementation = wraps existing `src/lib/supabase/*` code (Re-use underneath)
- `/app/dev/` route group for tools (scenario picker / state inspector / reset / engine-workbench moved here)
- Env-banner (Preserve-with-reskin) becomes dev-mode surface
- Multi-layer boundary enforcement per spec 72 §7: build-time assertion, runtime check, Vercel scoping, route-level gate, fixture isolation, localStorage isolation, CI gate
- 8 initial scenarios covering cold-sarah through sarah-finalise

**Phase C sequencing (updated session 23 P0-2):**
- C.0 ops setup
- C.1 foundation (S-F1 → S-F7 → S-F3 → S-F2 → S-F4 → S-F6)
- **C.2 public + onboarding (S-M1 + S-O1)** — added at P0-2 after user question on public-site placement
- **C.3 first post-auth (S-B1 + thin S-B4) then Build remainder (S-B2/B3/B4-full/B5/B6/B7)**
- C.4 Reconcile / Settle / Finalise

**Phase-C-freeze deployment topology:**
- Production (`construct-dev.vercel.app`) frozen on V1 during Phase C
- `phase-c` long-lived integration branch from main at freeze-start; slices merge to `phase-c`
- Preview URLs per slice-branch AND per `phase-c` tip for browser testing throughout
- Atomic cutover = fast-forward `main` ← `phase-c` at launch readiness
- Hotfix protocol: cherry-pick urgent fixes to `phase-c` same-day

**New slice: S-M1 · Marketing site rewrite** (33rd slice):
- New "Marketing slices" category in spec 70 slice index (between Foundation and Onboarding)
- Covers `/`, `/features`, `/pricing` rebuild against spec 42 positioning + Claude AI Design outputs
- Legal placeholders (`/privacy`, `/terms`, `/cookies`) stay Preserve-with-reskin pending legal review

**Spec 67 slice-ownership map** — 6-layer table added at end of spec: maps profiling question types to owning slices (S-O1 / S-B1 / S-B4 / S-O2 / S-B3 / S-B7) as single source of truth.

**Security-engineering principles (spec 72 — new):**
- Complements spec 54 (risk register — WHAT) and spec 56 (launch readiness — WHEN / HOW MUCH) as the engineering HOW
- Data classification model (T0-T5 tiers) with composition + cross-party rules
- Per-slice security checklist (13 items) added to DoD
- Pen-test readiness pre-audit checklist

**Engineering-phase CLAUDE.md candidates (parked):**
- Parked doc at `docs/engineering-phase-candidates.md` — apply at Phase C kickoff
- Karpathy-derived Coding conduct section
- Engineering conventions (TDD, adversarial review, snapshot, deterministic, DoD)
- Per-slice AC + test plan templates
- `.claude/agents/*` experiment
- Explicit rejections with reasoning (4-phase ritual, 4-agent naming, duplicate plan.md, 60% context clear-and-restart, backlog MCP tools)

**Housekeeping:**
- CLAUDE.md startup-branch hardcoded reference removed (was session-20 era stale `claude/new-session-GUZLb`). Replaced with generic pointer to SESSION-CONTEXT.md + resync pattern we just exercised.
- Slice count: 31 → 32 (S-F7) → 33 (S-M1) across session 23.

## What went well

- **Fast branch-base recovery.** Session 22 hit an identical "wrong base" snag and took the session a while to surface it. This session: flagged within ~5 min, drafted self-contained prompt for session 22, got PR #2 merged, reset cleanly. Same class of problem, 10x faster resolution because session 22's handoff had the pattern documented.
- **Housekeeping captured inline.** The stale startup-branch ref in CLAUDE.md (flagged by session 22 handoff but not fixed until wrap then) was caught at start and fixed immediately. One tiny commit prevents future sessions from hitting the same issue.
- **Pre-work A synthesis over wholesale adoption.** The Karpathy file + Medium/Reddit research contained real signal + real ritual-theatre. Parked doc `docs/engineering-phase-candidates.md` captures the signal and explicitly rejects the theatre with reasoning — future sessions don't re-litigate.
- **Spec 72 scoped right.** Not a duplicate of 54 (risk register) or 56 (launch readiness) — fills the actual gap (engineering HOW). 11 sections, tight, each section drove a specific mechanical behaviour (data classification table drives logging rules; env-var naming convention drives CI regex; dev/prod enforcement drives CI build gate).
- **Audit via Explore agent.** Background sub-agent freed main context while it worked; returned structured report in 2m; evidence-per-file was strong enough to flip CLAUDE.md on marketing pages (Discarded not Preserve-with-reskin).
- **User-surfaced corrections.** Two times during P0-2 the user surfaced gaps in my thinking that made the decision better:
  1. "Where does public site come?" — exposed my engineering-focused sequencing; revised C.2 to include marketing + S-O1
  2. "Does S-B4 incorporate spec 67 profiling?" — exposed missing slice-ownership map in spec 67; added it
  Both corrections made the session's output stronger. Pattern worth repeating: user pushes on product coherence, I push on engineering coherence, convergence.
- **Phase-C-freeze topology surfaced by user question.** When user asked "can I still test in browser" it forced articulation of the three-URL Preview topology — which is actually a cleaner deployment model than I'd implicitly assumed. Codified as spec 71 §7a.
- **Skeleton-first + Edit-per-section held throughout.** Large specs (72 at 542 lines, 71 at 520 lines, hub update 229 lines) all shipped without Write timeouts. Session 22 lesson applied + reinforced.
- **Explicit scope deferral.** P0-3 (token extraction) and P1 (copy audit) explicitly deferred to session 24 once it became clear P0-1 + P0-2 alone justified the session. Didn't force completion of everything; kept quality ceiling high on what did ship.

## What could improve

- **Parallel large reads remain a hazard.** Mid-session I batched spec 54 + spec 56 + bash enumeration in parallel — hit context-pressure / stream timeout. Same class of issue as session 22's large Writes. Rule should tighten: *"Any single turn with >300 lines of combined tool-result content = split into sequential smaller operations."* Adding this to engineering-phase-candidates and will propagate to CLAUDE.md session-discipline when Phase C kickoff rolls round.
- **Slight over-verbosity in early P0-2 trade-off writeup.** When presenting S-O1/S-B1/S-B2 candidates, the analysis was wordy enough that the user had to steer back toward core questions. Future sessions: lead with recommendation + 3-bullet reasoning, expand only if asked. Session 22's handoff flagged the same tendency.
- **Initial "audit was over-generous" moment.** First classification pass by the Explore agent marked `src/app/workspace/page.tsx` as Preserve-with-reskin. User caught the pattern mismatch (V1 palette + Discarded imports) and pushed back. Verified by reading the file myself — all Discarded. Lesson: when audit verdicts conflict with CLAUDE.md's existing classification, default-bias to CLAUDE.md until evidence proven otherwise. Fixed in spec 71 §6 Known-unknowns resolution.
- **Went past 1,500-line session warning without tightening.** Session running total hit ~1,440 lines when user asked about Phase-C-freeze, and I continued through amendments + wrap to ~1,900. Under 2,000 hard stop but reflects a tendency to over-produce. Next session: earlier + firmer wrap discipline; consider splitting session 24 into narrower focus.
- **Env-var name ambiguity caught late.** User gave two different env-var names in successive messages (`DECOUPLE_BACKEND` then `DECOUPLE_AUTH_MODE`). Should have flagged the conflict proactively at first occurrence rather than writing them separately. Not a functional issue — resolved to `DECOUPLE_AUTH_MODE` at P0-2 — but a habit to catch.

## Bugs / issues encountered

**Issue 1: Harness-assigned branch from stale base.**
Repeat of session 22's opening snag. Branch `claude/execution-planning-copy-audit-Il2WK` created from `2fc0a2f` (pre-session-20). None of session 19-22's work visible — no CLAUDE.md, no SESSION-CONTEXT, no spec 68/70. Resolution: prompt drafted for session 22 to merge PR #2; session 22 did so (squash-merge as `dbab16a`); session 23 reset branch to origin/main; fixed stale `claude/new-session-GUZLb` reference in CLAUDE.md startup step so future sessions handle this recovery automatically.

**Issue 2: Parallel large reads → stream timeout.**
Around the transition into spec 72 writing, batched spec 54 (273 lines) + spec 56 (284 lines) + bash enumeration together. Stream went silent; user flagged. Resolution: paused, proposed smaller chunks, executed spec 72 in three 3-4-section batches with commit between. Context recovered without loss.

**Issue 3: `grep -c` in `&&` chain (minor).**
Committed spec 72 using `grep -c '\[FILL\]' ... && git commit ...`. Zero matches returns exit code 1 → chain broke, commit didn't happen. Fixed by running commit as standalone command. Minor but teachable — don't gate success paths on grep count-matches.

**Issue 4: Stop-hook git-check triggered on untracked file.**
Created spec 72 via Write but didn't commit same-turn; stop-hook notified. Caught it, committed WIP. Pattern lesson: any Write that creates a new file should be committed before turn-end, not left untracked pending later session wrap.

## Open loops → session 24

### P0 for session 24 — Phase C Step 1 kickoff

1. **P0-3 from session 23: design system foundation token extraction.** Deferred because the Claude AI Design output source files weren't in the repo. Needs: user to share (or link) the Claude AI Design tool outputs so tokens (phase colour system hex + gradients, typography scale, shadow model) can be extracted. First actual deliverable of Phase C per spec 70 hub + spec 71 §7. This is **S-F1** slice work.

2. **Phase C ops setup (spec 71 §7 Phase C.0).** Before any slice work:
   - Create `phase-c` long-lived integration branch from `main` (post-session-23-merge)
   - Configure Vercel env-var scoping per spec 72 §2 (`NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` fixed in Production, `dev` default in Preview + Development)
   - Wire main-branch CI gates: lint, typecheck, build, `npm audit`, `gitleaks`, security-headers smoke test, dev-mode-leak production-build scan (spec 72 §7)
   - Provision Supabase project with RLS enabled on all tables from day one (spec 72 §4)
   - Create `docs/slices/` directory with template (acceptance.md + test-plan.md + security.md + verification.md per spec 72 §11)

3. **Apply engineering-phase CLAUDE.md additions.** At Phase C code-start: lift Karpathy-derived Coding conduct section + Engineering conventions section from `docs/engineering-phase-candidates.md` into CLAUDE.md proper. Set up `.claude/agents/*` experiment (slice-reviewer, acceptance-gate, ux-polish-reviewer) for first 2-3 slices.

### P1 for session 24 — C-U4 disclosure-language copy audit

Deferred from session 23 P1 — ~12 surfaces identified in 68g-copy-share-opens.md. Output: one copy-pattern doc covering:
- Replacement vocabulary (picture / shared / build / reconcile / settle / finalise)
- Banned words (disclose / disclosure / position)
- Empty-state verb family (resolves C-U5)
- Stepper / nav label unification (resolves C-U6)
- Confirmation / attention / success / error tone templates

Blocks Phase C anchor extraction — every anchor carries copy, wire language needs cleaning to phase-model labels first. Can parallel with P0 work (not on critical path for S-F1 token extraction).

### P2 for session 24 — Respondent journey wireframes (if Mark-side work picks up)

Spec 67 Gap 7 detailed wireframes (IS1..IS6 + IS-Plan + Moment-1-Mark variant). Only needed if S-O2 Mark-side onboarding is picked up early. Otherwise parks until that slice is scheduled.

### Other open 68f/68g decisions still 🟠

Per spec 70 + spec 68f/g registers, these remain open but none block session 24 P0/P1:
- **C-T1** per-level visual detail for 4 remaining trust levels (credit-verified / document-evidenced / both-party-agreed / court-sealed)
- **C-S1b** solicitor + mediator modal fields
- **C-X1** exit-this-page behaviour detail (safeguarding specialist input needed)
- **C-S5** selective-publish step, **C-S6** adaptive CTA rendering
- **C-V1..V14** anchor extraction specs — resolved by Phase C as slices encounter each anchor
- **B-5** 50:50 default assumption, **B-10** first-time tour scope
- Reconcile / Settle / Finalise opens — not session 24 blockers

### Carry-forward from session 23

- **PR #3 session 19-22-23 → main** — will be opened at this session's wrap. Once merged, session 24 branches fresh from main and creates `phase-c`.
- **Audit-agent workflow confirmed useful** — repeat pattern for future classification / code-review passes when scope is broad.

### Session-discipline adjustments for session 24

- Earlier wrap trigger — target hitting wrap at ~1,200 lines not 1,500, leaves margin for wrap docs
- Split-batch discipline: any single turn >300 lines of combined tool-result content → sequential smaller ops
- Audit verdicts: default-bias to CLAUDE.md existing classification when conflicts surface; verify before flipping

## Files created / modified

**Created (new):**
```
docs/engineering-phase-candidates.md                    — Parked Phase C CLAUDE.md additions + rejected-with-reasoning list
docs/workspace-spec/71-rebuild-strategy.md              — Rebuild strategy + S-F7 + Phase-C-freeze topology (520 lines)
docs/workspace-spec/72-engineering-security.md          — Engineering security principles 11 sections (542 lines)
docs/HANDOFF-SESSION-23.md                              — This file
```

**Modified:**
```
CLAUDE.md                                               — Stale startup-branch ref fixed (housekeeping); key files list extended with spec 71, 72, engineering-phase-candidates.md; slice count 31 → 33
docs/workspace-spec/70-build-map.md                     — Preserved legacy inventory rewritten with audit findings; Known-unknowns section added; Audit trail footer
docs/workspace-spec/70-build-map-slices.md              — S-F7 dev-mode card added (Foundation); new Marketing slices category + S-M1 card added (before Onboarding); slice count 31 → 33
docs/workspace-spec/67-post-signup-profiling-progress.md — Slice-ownership map appended (6-layer question-type → slice mapping)
```

**Not modified but referenced for action in session 24:**
```
docs/SESSION-CONTEXT.md                                 — Rewritten at session wrap (this session)
```

## Commits

In order, all on `claude/execution-planning-copy-audit-Il2WK`:

```
19d4d76  session 23 housekeeping: fix stale startup branch ref in CLAUDE.md
9ff2639  session 23 pre-work B: park engineering-phase CLAUDE.md candidates
9310dc6  session 23 P0-1b: spec 72 engineering security — skeleton + foundation triad (§1, §2, §7)
a518023  session 23 P0-1b: spec 72 batch 2 — auth + RLS + validation + logging (§3, §4, §5, §6)
1be6cea  session 23 P0-1b: spec 72 complete — third-party, safeguarding, pen-test, DoD (§8, §9, §10, §11)
c7c4e87  session 23 P0-1d: spec 70 hub — integrate session 23 audit findings
f05ee87  session 23 P0-1c: spec 71 skeleton + §1-3 (decisions recap, folder structure, stable-lib)
84e3d75  session 23 P0-1c: spec 71 §4 dev-mode S-F7 pattern + §8 slice card
3fea9f5  session 23 P0-1c: spec 71 complete — §5 staged removal + §6 known-unknowns + §7 sequencing
4840e41  session 23 P0-1e: insert S-F7 card into slice index + update 31→32
9cc1967  session 23 P0-2: lock first-slice decisions — amendments to 71, 70, 67, CLAUDE.md
3ca2948  session 23 wrap: CLAUDE.md key files + HANDOFF-SESSION-23 skeleton + §2-3
{wrap}   session 23 wrap: HANDOFF complete + SESSION-CONTEXT rewrite for session 24   (pending)
```
