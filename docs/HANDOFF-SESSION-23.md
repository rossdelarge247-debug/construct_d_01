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

[FILL]

## What could improve

[FILL]

## Bugs / issues encountered

[FILL]

## Open loops → session 24

[FILL]

## Files created / modified

[FILL]

## Commits

[FILL]
