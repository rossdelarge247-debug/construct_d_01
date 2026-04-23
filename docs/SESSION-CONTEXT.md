# Session 24 Context Block

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. NOT a financial disclosure tool. NOT a better Form E. A divorce process disrupter: £800-1,100 vs £14,561, 2-3 months vs 12-18. Consumer-first, bank-evidenced, collaborative, end-to-end.

**Pillars (spec 42):**
- Shared, not adversarial
- Evidenced, not asserted
- End-to-end, not hand-off

**Tagline:** "Decouple — the complete picture."

Spec 42 (amended session 22) is authoritative for positioning. Spec 68 (synthesis hub) + 68a-e (locked phase decisions) + 68f (session-21 register with session-22 locks applied) + 68g trio (visual anchors, build opens, copy/share opens) carry reconciled wire-level framing. Spec 70 Build Map suite (session-23 audit-integrated) is the Phase C input. Spec 71 (rebuild strategy) + spec 72 (engineering security) are the Phase C execution layer.

## Stack

Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`. **Single-branch-main workflow** (spec 71 §7a amended Option 4, session 24): no `phase-c` integration branch, no cutover event; slice work on short-lived feature branches → PR → main. Prod rebuilds on main merges; may show placeholder / partially-built state during rebuild — acceptable given no users yet.
Tink credentials in Vercel env.

## What session 23 accomplished

**Design / planning session — execution-phase preparation. P0-1 rebuild strategy + security + classification audit + Phase C sequencing. P0-2 first-slice decision locked. No `src/` code changes.**

- **Spec 71 rebuild strategy produced** (520 lines) — same-repo in-place restructure, hybrid folder layout (`app/(marketing)` + `app/(authed)` route groups, `app/dev/` namespace, `components/design-system` + `anchors` + `documents` + `features` + `layout` + `dev`, `lib/auth` + `lib/store` abstraction), stable-lib paths kept unchanged, staged discard-tree removal per slice DoD, S-F7 dev-mode slice card, Phase C sequencing C.0 → C.4, §7a Phase-C-freeze deployment topology.
- **Spec 72 engineering security principles produced** (542 lines, 11 sections) — data classification T0-T5 with composition + cross-party rules, env-var + secrets conventions, auth + session pattern (2FA mandatory, NIST password policy, magic-link invitation, cookie flags, anomaly detection), RLS + authorisation (primary gate, default-deny, private-data + joint-data + selective-publish patterns), input/output validation (Zod + magic-byte MIME + rate limits), logging + scrubbing (tier-based, never-log list, reference-ID errors), dev/prod boundary enforcement (multi-layer), third-party data flow, safeguarding engineering, pen-test readiness, 13-item per-slice security DoD.
- **P0-1a audit via Explore agent** — 59-file classification of previously-unclassified middle zone. Key corrections: marketing pages (`app/page.tsx`, `app/features`, `app/pricing`) → Discarded (positioning violation); `lib/supabase/workspace-store.ts` → Preserve-with-reskin (feeds S-F7 prod impl); `types/interview.ts` → Discarded; `types/hub.ts` → Re-use with pruning; hub components split 5/1/1/2; constants need 4-phase → 5-phase update; legal placeholders Preserve-with-reskin pending legal review.
- **Spec 70 hub inventory rewritten** with audit findings (229 lines) — Bank · AI · Auth+persistence · Payments+analytics+documents · Types · Hooks · Constants+utilities · UI primitives+layout · Hub components · API routes · Dev tools (Re-use + Move to `/app/dev/`) · Discarded · Known-unknowns · Audit trail.
- **S-F7 dev-mode slice added** (32nd) — Session + WorkspaceStore + AuthGate interfaces, `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=dev|prod` switch, localStorage-backed fixture user on reserved `@dev.decouple.local` domain, 8-scenario fixture library (cold-sarah through sarah-finalise), `/app/dev/*` route group gated by `MODE === 'prod'` notFound, env-banner reskin as dev-mode surface, multi-layer boundary enforcement per spec 72 §7.
- **S-M1 marketing-site slice added** (33rd) — new Marketing slices category in spec 70 slice index; covers `/`, `/features`, `/pricing` rebuild against spec 42 positioning + Claude AI Design outputs; legal placeholders stay Preserve-with-reskin.
- **Phase-C-freeze deployment topology locked** (spec 71 §7a) — prod `construct-dev.vercel.app` frozen on V1 during rebuild; `phase-c` long-lived integration branch from main; per-slice branches off `phase-c`; three testable URLs (prod / phase-c integration Preview / per-slice Preview); atomic cutover = fast-forward `main` ← `phase-c`; cherry-pick hotfix protocol.
- **Phase C sequencing locked** — C.0 ops · C.1 foundation (S-F1 → S-F7 → S-F3 → S-F2 → S-F4 → S-F6) · **C.2 S-M1 + S-O1** (public + onboarding together) · **C.3 S-B1 + thin-S-B4** first post-auth then Build remainder · C.4 Reconcile / Settle / Finalise.
- **Spec 67 slice-ownership map appended** — 6-layer table mapping profiling question types to owning slices (S-O1 / S-B1 / S-B4 / S-O2 / S-B3 / S-B7) as single source of truth; protects against content/code drift + duplicate implementations.
- **Engineering-phase CLAUDE.md additions parked** at `docs/engineering-phase-candidates.md` — Karpathy-derived Coding conduct section (A), Engineering conventions (TDD, adversarial review, snapshot, deterministic, 6-item DoD) (B), per-slice AC template (C), per-slice test plan template (D), `.claude/agents/*` experiment (E), explicit rejections with reasoning (F: 4-phase ritual / 4-agent naming / duplicate plan.md / 60% context clear-and-restart / backlog MCP tools), open questions for Phase C kickoff (G).
- **Housekeeping** — CLAUDE.md stale startup-branch ref removed; key files list extended with 71, 72, engineering-phase-candidates.md; slice count 31 → 32 → 33.

See `docs/HANDOFF-SESSION-23.md` for detailed retro.

## Current state

### Locked (through session 23)

**Session 21 (foundational):**
- **Phase model** — 5 phases (Start / Build / Reconcile / Settle / Finalise). Share-as-action. Move-on absorbed into Finalise tracking.
- **Document lifecycle** — four documents (Sarah's Picture → Our Household Picture → Settlement Proposal → Generated legal docs).
- **68a** Cross-cutting · **68b** Build · **68c** Reconcile · **68d** Settle · **68e** Finalise.

**Session 22:**
- 68a C-N1 amended (contextual journey map), 68f C-T1 / C-S1a / B-3 / G7-1..5 / C-E1 locked.
- Spec 42 amended to 5-phase + four-document lifecycle; spec 44 amended to four-document lifecycle; spec 67 Gap 7 resolved.
- Spec 70 Build Map suite (7 files, 31 slices).
- Visual direction canonical = Claude AI Design outputs; spec 18 palette + spec 27 superseded.

**Session 23:**
- **Spec 71 rebuild strategy** — 4 decisions locked (same-repo in-place · hybrid layout · stable-lib paths kept · staged removal) + folder structure + dev-mode S-F7 pattern + Phase-C-freeze topology §7a + migration sequencing C.0-C.4.
- **Spec 72 engineering security principles** — data classification T0-T5 + env-vars + auth + RLS + validation + logging + dev/prod boundary + third-party + safeguarding + pen-test readiness + per-slice security DoD.
- **Slice catalogue expanded** — S-F7 dev-mode foundation (32nd), S-M1 marketing rewrite (33rd). Slice count 31 → 33.
- **Phase C sequencing** — C.0 ops · C.1 foundation · C.2 S-M1+S-O1 · C.3 S-B1+S-B4-thin then Build · C.4 Reconcile/Settle/Finalise.
- **Spec 67 slice-ownership map** — 6 layers mapped to owning slices.
- **Spec 70 hub** — audit-integrated inventory with evidence per file; Known-unknowns resolved; session 22 → 23 audit trail recorded.

### Open (see 68f + 68g trio for full register)

- 68f: 10 🟢 locked (session 22); 17 🟠 still open (downstream R-1..6, S-1..3, F-1..5, C-X1, C-N1b, C-S1b, etc.).
- 68g-visual-anchors: 14 open (C-V1..C-V14) — resolved by Phase C anchor extraction as slices encounter each.
- 68g-build-opens: 10 open (B-5..B-14).
- 68g-copy-share-opens: 5 open (C-U4..C-U6, C-S5, C-S6). **C-U4 disclosure-language copy audit = session 24 P1** — blocks anchor extraction copy.

**None block session 24's P0 Track A (ops) or Track B (CLAUDE.md additions).** Track C (design tokens, S-F1) depends on Claude AI Design tool source files being located / shared.

### Specced but NOT built
- Everything in spec 68 suite (design-only)
- Everything in spec 70 Build Map (design-only — the map, not the code)
- Everything in spec 71 rebuild strategy (the plan, not the rebuilt code)
- Everything in spec 72 engineering security (the rules, not the enforcement code)
- Pre-signup interview (spec 65 — Preserve-with-reskin: question set kept, UI rebuilds via S-O1)
- Post-signup profiling distribution (spec 67 — distribution via S-O1 / S-B1 / S-B4 / S-O2 / S-B3 / S-B7 per ownership map)
- Children / Housing transition / Business sections (spec 68b)
- Reconciliation / Proposal / Finalise flows (spec 68c / d / e)
- Consent order generation, D81 auto-population, Form P (S-L1)
- Respondent journey detailed wireframes (spec 67 Gap 7 deferred — resolved via S-O2)
- Design system foundation (C-V1..C-V14 anchor extraction = Phase C Step 1 / S-F1)
- Dev/prod abstraction layer (S-F7)
- Marketing rewrite (S-M1)

### Built (legacy — reconciled via Build Map session-23 audit)
- **Re-use (preserve as-is per 70-build-map.md hub):** `src/lib/bank/*` (Tink client, transformer, signal rules 17, data-utils, CSV parser, Ntropy client, user corrections, test-scenarios, bank-connect + callback API routes) · `src/lib/ai/*` (extraction-schemas, result-transformer, document-analysis, extraction-prompts, pipeline, plan-narrative, provider) · `src/lib/supabase/{client,middleware,server}.ts` · `src/lib/stripe/*` · `src/lib/analytics/posthog.ts` · `src/lib/documents/processor.ts` · `src/lib/recommendations.ts` · `src/types/hub.ts` (with pruning) · `src/types/index.ts` · most hooks · `src/utils/cn.ts` · document-extract / ntropy-enrich / plan-generate API routes · health API route · `src/components/hub/{category-selector, discovery-flow, evidence-lozenge, hero-panel, section-cards}.tsx` · `src/components/ui/exit-page.tsx`.
- **Preserve-with-reskin (logic kept, UI rebuilds):** `src/lib/bank/confirmation-questions.ts` (spec 22 trees, drives S-B4) · `src/lib/supabase/workspace-store.ts` (wrapped by S-F7 prod impl) · `src/types/workspace.ts` · `src/hooks/{use-interview, use-workspace}.ts` · `src/constants/index.ts` (4-phase → 5-phase update in S-F3) · `src/components/ui/{button, card, badge}.tsx` · `src/components/layout/{header, footer, env-banner}.tsx` · `src/components/hub/fidelity-label.tsx` · legal placeholders (`privacy`, `terms`, `cookies` pending legal review).
- **Dev-only (Re-use + Move to `/app/dev/` via S-F7):** engine-workbench, `hub/debug-panel.tsx`, `hub/tink-debug-panel.tsx`, test-pipeline API, bank-test API.
- **Discarded (do NOT port):** `src/components/workspace/*` (32 files, ~7,132 lines) · `src/app/workspace/{page.tsx, layout.tsx, agree, build, disclose, finalise, negotiate}/*` (all resolved Discarded session 23 §6) · `src/app/start/*` + `src/components/interview/*` (14 pages + 5 files — V1 Gentle Interview superseded by spec 65 / S-O1) · `src/app/{page, features, pricing}/page.tsx` (marketing — positioning violation) · `src/components/hub/title-bar.tsx` · `src/types/interview.ts`.

## Session 24 priorities

Phase C Step 1 kickoff (design system foundation + ops setup). Per spec 71 §7 Phase C.0 + C.1, three parallel tracks for P0, then P1 copy audit, then P2 conditional wireframes.

### P0 — Phase C Step 1 kickoff

**Track A — Ops setup (spec 71 §7 Phase C.0)** — runs first; unblocks everything else.
- Create `phase-c` long-lived integration branch from `main` (per spec 71 §7a Phase-C-freeze topology).
- Vercel env-vars configured per spec 72 §2 — `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` fixed in Production, `=dev` default in Preview + Development; secrets scoped per environment; `NEXT_PUBLIC_*` regex audited.
- Main-branch CI gates wired: lint, type-check, `next build`, `npm audit`, `gitleaks`, security-headers smoke test, dev-mode-leak production-build scan (spec 72 §7), env-var regex ban (no `NEXT_PUBLIC_*_KEY|_SECRET|_TOKEN|_PASSWORD|_PRIVATE`).
- Supabase project provisioned with RLS enabled on all tables from day one (spec 72 §4 default-deny).
- `docs/slices/` directory created with per-slice template (acceptance.md + test-plan.md + security.md + verification.md per spec 72 §11 + engineering-phase-candidates §C-D).

**Track B — Apply engineering CLAUDE.md additions** — doc-only; runs in parallel with Track A.
- Lift Karpathy-derived Coding conduct section + Engineering conventions section from `docs/engineering-phase-candidates.md` into `CLAUDE.md` proper (insert after Technical rules, before Visual direction).
- Coding conduct: think-before-code, simplicity-first, surgical-changes, goal-driven-execution.
- Engineering conventions: TDD where tractable, adversarial review gate per slice, snapshot before refactor, deterministic over generative, 6-item Definition of Done.
- Flip engineering-phase-candidates.md headers to ✅ applied for A and B; leave C (AC template), D (test plan template), E (`.claude/agents/*` experiment) for when first slice begins.

**Track C — Design system token extraction (spec 71 §7 C.1 slice S-F1)** — blocked pending asset location.
- Source: Claude AI Design tool outputs from session 22 wire batches. User to share / confirm location.
- Extract: phase colour system (5-phase palette hex + gradients per C-V1), typography scale, spacing tokens, shadow model, radii, keyboard affordance pattern (C-V4), accent-tint washes (C-V13), time-estimate affordance (C-V14).
- Build: `components/design-system/tokens/` CSS custom properties + Tailwind config · `components/design-system/primitives/` (button, card, chip, input, badge rebuilt against tokens) · `components/design-system/index.ts`.
- Sets foundation that S-F2..S-F7 build on. Once S-F1 ships to `phase-c` Preview, S-F7 (dev-mode) unblocks.

**Order:** Track A first (unblocks Tracks B + C + all slice work) · Track B parallel (doc-only, no dependency) · Track C once Claude AI Design tool source files located.

### P1 — C-U4 disclosure-language copy audit (deferred from session 23)

~12 surfaces identified in 68g-copy-share-opens.md where "disclosure" language appears or could slip in. Output: one copy-pattern doc covering:
- Replacement vocabulary (picture / shared / build / reconcile / settle / finalise)
- Banned words (disclose / disclosure / position)
- Empty-state verb family (resolves C-U5)
- Stepper / nav label unification (resolves C-U6)
- Confirmation / attention / success / error tone templates

Blocks Phase C anchor extraction — every anchor carries copy. Can run in parallel with Track A or after Track B; not on critical path for Track C token extraction.

### P2 — Conditional: respondent-journey wireframes

Spec 67 Gap 7 detailed wireframes (IS1..IS6 + IS-Plan + Moment-1-Mark variant) → S-O2 respondent onboarding. Only needed if user wants to run Claude AI Design tool on the respondent side before S-O2 implementation. If yes: frame the design brief. Otherwise parks until S-O2 is scheduled.

### Scope ceiling

~2,000-line session limit (CLAUDE.md session discipline). Earlier wrap trigger adopted per session-23 retro: target ~1,200 lines not 1,500 to leave margin for wrap docs. If Track A + Track B finish and Track C is blocked on assets, wrap cleanly and hand off rather than force progress.

## Negative constraints

1. **Do NOT** write "financial disclosure tool" or imply Decouple is scoped to finances. Spec 42 complete-settlement-workspace framing is load-bearing.
2. **Do NOT** extend `/src/components/workspace/*` or `/src/app/workspace/*` — the Build Map is in place and the action is **replace** (via slices), not extend. Staged removal per spec 71 §5 (slice-by-slice, not big-bang).
3. **Do NOT** re-open 68a-e locked decisions unless new evidence surfaces — treat them as load-bearing.
4. **Do NOT** re-read pre-pivot specs (03-06, 11, 12). Active reconciled framing lives in 42 / 44 / 65 / 67 / 68 / 68a-g / 70 / 71 / 72.
5. **Do NOT** let a "quick code extraction" jump ahead of the ops setup. Phase C.0 (Track A) unblocks everything; slice work begins only after ops is green.
6. **Phase-C-freeze model RETIRED** (session 24, Option 4). No `phase-c` integration branch, no frozen main, no cutover event. Slice work merges to main via short-lived feature-branch PRs. If user traffic arrives before Phase C completes, re-introduce a freeze via a new spec 71 §7a amendment — do not retrofit from the pre-Option-4 text.
7. **`NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` is mandatory in Production** — spec 72 §2 + §7. CI gate enforces; runtime assertion throws on mismatch; `/app/dev/*` routes return 404 in prod build.
8. **Staged removal, not big-bang** — every slice that replaces a surface deletes the old tree as part of its DoD; no sweeping cleanup PRs. Spec 71 §5 has the per-slice removal table; spec 70 hub flips removed rows to audit-archive.
9. **No parallel large reads / writes** — any single turn with >300 lines of combined tool-result content must split into sequential smaller operations. Session 22 + 23 both hit stream timeouts from this; session 24 already hit it on P0 prep. Skeleton-first + Edit-per-section remains the Write pattern for files >150 lines.
10. **V1 legacy palette is gone** — no warmth / cream / sage. Visual canonical = Claude AI Design tool outputs (session 22 wire batches). Airbnb / Emma / Habito retired; spec 18 palette + spec 27 visual direction superseded.
11. **Shadow-based card separation** — no borders on cards.
12. **Safeguarding for V1 is signposting + baseline** (spec 67 Gap 11, spec 72 §9). Detection / decoy / adaptive pacing = V1.5.
13. **Identity verification waits until consent-order stage** — not V1 signup, not Settle signature (V1 = explicit attestation per 68f S-3).
14. **MLP not MVP** — scope decisions per slice framed as "what the *loveable* version requires vs what can iterate post-launch." Users are in crisis; loveable is the floor.
15. **AI extracts facts, app generates questions** — never put reasoning / clarification / gap analysis in AI extraction schemas. Result-transformer.ts generates these via spec 13 trees.
16. **Anthropic SDK uses `output_config.format`** (not `response_format`). All JSON schemas need `additionalProperties: false`. SDK timeout 90s, route maxDuration 300s.

## Information tiers — what to read when

- **Tier 1 (always loaded):** CLAUDE.md (positioning, rules, startup).
- **Tier 2 (read at session start):** this file.
- **Tier 3 (read when building / planning a specific area):** spec 42 (positioning) · spec 44 (document-as-spine) · spec 68 hub + 68a-e phase locks · spec 70 Build Map suite · spec 71 rebuild strategy · spec 72 engineering security · `docs/engineering-phase-candidates.md` (when Phase C code begins).
- **Tier 4 (reference only, don't read proactively):** 68f / 68g trio (open registers — consult per open) · spec 67 profiling · spec 65 pre-signup · older flow specs 60-64 · HANDOFF-SESSION-{N}.md · docs/v2/v2-backlog.md. Consult before proposing new work to check it's not already planned or deprioritised.

## Branch

**Single-branch-main workflow** (spec 71 §7a amended Option 4, session 24). `main` is the canonical rebuild home; no integration branch; no cutover event.

**Per-slice branch pattern:**
- Short-lived feature branch off `main`: `claude/S-XX-{slug}` (e.g. `claude/S-F1-design-system`)
- Work → commit → push → PR → review → merge to main → delete feature branch
- Preview URL per feature branch: `construct-dev-git-{branch}-*.vercel.app`

**Pre-flight before starting slice work:**
```
git fetch origin main
git checkout main
git pull --ff-only origin main
git checkout -b claude/S-XX-{slug}
```
Confirm `main` tip matches the latest merged PR (session-24 Option 4 foundation merge should be present).

## Key files

```
Session orientation
CLAUDE.md                                                      — Positioning + rules (preserve)
docs/SESSION-CONTEXT.md                                        — THIS FILE — start here
docs/HANDOFF-SESSION-23.md                                     — Session 23 retro (latest)
docs/HANDOFF-SESSION-22.md                                     — Session 22 retro
docs/HANDOFF-SESSION-21.md                                     — Session 21 retro

Rebuild + engineering (Phase C execution layer — session 23)
docs/workspace-spec/71-rebuild-strategy.md                     — Folder structure, stable-lib paths, S-F7 dev-mode, staged removal, Phase C sequencing, §7a Phase-C-freeze
docs/workspace-spec/72-engineering-security.md                 — Engineering security principles (T0-T5 classification, env vars, auth, RLS, validation, logging, dev/prod boundary, third-party, safeguarding, pen-test readiness, per-slice security DoD)
docs/engineering-phase-candidates.md                           — Parked CLAUDE.md additions: Coding conduct (A), Engineering conventions (B), AC template (C), test plan template (D), agents experiment (E), rejected-with-reasoning (F), open questions (G). Apply at Phase C kickoff.

Reconciled framing (spec 68 suite — read when relevant)
docs/workspace-spec/68-synthesis-hub.md                        — Wire reconciliation hub
docs/workspace-spec/68a-decisions-crosscutting.md              — Cross-cutting locked (C-N1 amended session 22)
docs/workspace-spec/68b-decisions-build.md                     — Build phase locked
docs/workspace-spec/68c-decisions-reconcile.md                 — Reconcile phase locked
docs/workspace-spec/68d-decisions-settle.md                    — Settle phase locked
docs/workspace-spec/68e-decisions-finalise.md                  — Finalise phase locked
docs/workspace-spec/68f-open-decisions-register.md             — Session-21 register (session-22 locks applied)
docs/workspace-spec/68g-visual-anchors.md                      — C-V1..C-V14 extraction catalogue (Phase C S-F1)
docs/workspace-spec/68g-build-opens.md                         — B-5..B-14 build opens
docs/workspace-spec/68g-copy-share-opens.md                    — C-U4..U6 + C-S5..S6 opens (C-U4 = session 24 P1)

Build Map suite (spec 70 — Phase B deliverable, audit-integrated session 23)
docs/workspace-spec/70-build-map.md                            — Hub: tagging, preserved-legacy inventory (session-23 audit), Discarded, Known-unknowns, audit trail
docs/workspace-spec/70-build-map-start.md                      — Phase 1 map
docs/workspace-spec/70-build-map-build.md                      — Phase 2 map
docs/workspace-spec/70-build-map-reconcile.md                  — Phase 3 map
docs/workspace-spec/70-build-map-settle.md                     — Phase 4 map
docs/workspace-spec/70-build-map-finalise.md                   — Phase 5 map
docs/workspace-spec/70-build-map-slices.md                     — 33-slice catalogue (Foundation S-F1..S-F7, Marketing S-M1, Onboarding S-O1..S-O3, Build S-B1..S-B7, Reconcile S-R1..S-R4, Settle S-S1..S-S4, Finalise S-L1..S-L5, Cross-cutting S-X1..S-X2)

Positioning + architecture
docs/workspace-spec/42-strategic-synthesis.md                  — Authoritative positioning (5-phase, amended session 22)
docs/workspace-spec/44-the-document-structure.md               — Four-document lifecycle (amended session 22)
docs/workspace-spec/51-product-vision.md
docs/workspace-spec/52-product-canvas.md

Flow model
docs/workspace-spec/65-pre-signup-interview-reconciled.md      — Pre-signup locked → S-O1
docs/workspace-spec/67-post-signup-profiling-progress.md       — All gaps resolved; slice-ownership map session 23 P0-2
docs/workspace-spec/45-screens-phase-1-to-3.md                 — Reference (partially superseded by 70)
docs/workspace-spec/46-screens-phase-4-to-6.md                 — Reference (partially superseded by 70)

Engine + legal specs (relevant to Phase C Re-use tags)
docs/workspace-spec/13-extraction-decision-tree-documents.md
docs/workspace-spec/19-intelligent-categorisation.md
docs/workspace-spec/22-confirmation-flow-tree.md               — Preserve-with-reskin source (drives S-B4)
docs/workspace-spec/30-signal-detection-engine.md
docs/workspace-spec/31-large-payment-detection.md
docs/workspace-spec/32-engine-audit.md
docs/workspace-spec/41-consent-order-self-submission.md
docs/workspace-spec/54-risk-register.md                        — WHAT (risks, policies)
docs/workspace-spec/56-launch-readiness.md                     — WHEN / HOW MUCH (compliance items, budgets, lead times)

Stable libraries (Re-use per 70-build-map.md hub audit)
src/lib/bank/*                                                 — Tink client + transformer, signal rules, CSV parser, Ntropy, test-scenarios, user corrections, connect + callback APIs
src/lib/ai/*                                                   — Extraction schemas + result-transformer + document-analysis + extraction-prompts + pipeline + plan-narrative + provider
src/lib/supabase/{client,middleware,server}.ts                 — Re-use; wrapped by S-F7 prod impl
src/lib/supabase/workspace-store.ts                            — Preserve-with-reskin (S-F7 prod impl)
src/lib/stripe/* · src/lib/analytics/posthog.ts · src/lib/documents/processor.ts · src/lib/recommendations.ts
src/types/hub.ts                                               — Re-use with pruning (legacy interview types removed at S-F7)
src/types/workspace.ts                                         — Preserve-with-reskin
src/hooks/{use-count-up, use-hub, use-staggered-reveal}.ts     — Re-use
src/hooks/{use-interview, use-workspace}.ts                    — Preserve-with-reskin
src/constants/index.ts                                         — Preserve-with-reskin (4-phase → 5-phase in S-F3)
src/utils/cn.ts                                                — Re-use
src/components/ui/exit-page.tsx                                — Re-use (moves to components/layout/ at S-X2)
src/components/ui/{button, card, badge}.tsx                    — Preserve-with-reskin (token swap at S-F1)
src/components/layout/{header, footer, env-banner}.tsx         — Preserve-with-reskin (env-banner becomes S-F7 dev surface)
src/components/hub/{category-selector, discovery-flow, evidence-lozenge, hero-panel, section-cards}.tsx — Re-use
src/components/hub/fidelity-label.tsx                          — Preserve-with-reskin
src/app/api/bank/{connect,callback}/route.ts                   — Re-use
src/app/api/documents/extract/route.ts                         — Re-use
src/app/api/ntropy/enrich/route.ts                             — Re-use
src/app/api/plan/generate/route.ts                             — Re-use
src/app/api/health/route.ts                                    — Re-use (prod monitoring)

Dev tools (Re-use + Move to /app/dev/ via S-F7)
src/app/workspace/engine-workbench/page.tsx                    — Move to src/app/dev/engine-workbench/page.tsx
src/components/hub/{debug-panel, tink-debug-panel}.tsx         — Move to src/components/dev/
src/app/api/test-pipeline/route.ts                             — Move to src/app/dev/api/test-pipeline/ or delete
src/app/api/bank/test/route.ts                                 — Move to src/app/dev/api/bank/test/

Discarded — do NOT port
src/components/workspace/* (32 files)                          — V2 components, spec 18 palette / pre-pivot flow
src/app/workspace/{page, layout, agree, build, disclose, finalise, negotiate}/* — V2 orchestrator + phase pages; all resolved Discarded spec 71 §6
src/app/start/* + src/components/interview/*                   — V1 Gentle Interview; replaced by S-O1 (spec 65)
src/app/{page, features, pricing}/page.tsx                     — Marketing pages; positioning violation; replaced by S-M1
src/components/hub/title-bar.tsx                               — V1 palette; replaced by C-V6 dashboard stepper
src/types/interview.ts                                         — V1 session types; replaced by spec 65 shape

Reference only
docs/v1/v1-desk-research.md
docs/v2/v2-backlog.md
```

## Session 24 pre-flight

1. Claude loads CLAUDE.md + this file. Tier 3 reads as each track begins, not upfront.
2. **Verify branch base.** Harness may land on a fresh working branch. Confirm `main` is up to date with origin (post-PR-#3 merge) before branching `phase-c`:
   ```
   git fetch origin main
   git checkout main
   git pull --ff-only origin main
   ```
3. **Confirm with user** session focus:
   - P0 Track A (ops) — ready to start; user confirms Vercel + Supabase access if needed.
   - P0 Track B (CLAUDE.md additions) — doc-only; can proceed independently.
   - P0 Track C (design tokens, S-F1) — **blocked pending Claude AI Design tool source files** from session 22 wire batches. User to share / link / confirm location.
   - P1 C-U4 copy audit — ready when user wants it; parallelisable with Track A.
   - P2 respondent-journey wireframes — conditional on user direction.
4. Begin. Suggested order: Track A first (branch + Vercel + CI + Supabase + `docs/slices/` template) → Track B parallel → Track C once assets located → P1 copy audit.

**Session-discipline reminders from session 23 retro:**
- Earlier wrap trigger: target ~1,200 lines changed (not 1,500) to leave margin for wrap docs.
- Split-batch rule: any single turn with >300 lines of combined tool-result content → sequential smaller operations. Already hit this at session-24 startup while reading prep docs.
- Audit verdicts: default-bias to CLAUDE.md / existing classification when conflicts surface; verify before flipping.
- Lead with recommendation + 3-bullet reasoning; expand only if asked.
