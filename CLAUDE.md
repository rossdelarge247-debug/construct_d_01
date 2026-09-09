# Claude Code — Decouple

## Product positioning (preserve this across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. It is NOT a financial disclosure tool. Not a better Form E. It is a divorce process disrupter aiming to replace the £14,561-average-cost solicitor-led journey with a £800-1,100 consumer-first, bank-evidenced, collaborative alternative, end-to-end.

**Unique claim:** The only place where both parties build one evidence-backed, shared picture of their complete settlement — finances, children, housing, future needs — negotiate proposals on it, and generate legally binding documents from their agreement.

**Three positioning pillars (spec 42):**
- Shared, not adversarial
- Evidenced, not asserted
- End-to-end, not hand-off

**Tagline:** "Decouple — the complete picture."

When drafting any user-facing copy, engine messaging, or session output: never frame Decouple as "a financial disclosure tool." The complete settlement workspace framing is load-bearing — it shapes scope, tone, and what the product promises to do. Spec 42 is the authoritative source.

## North star (quality bar)

The experience should feel like having a brilliant, patient analyst sitting beside you through the whole separation — finances, children, housing, future needs. They come back saying: "Here's what I found. Your salary is £3,218/month from ACME Ltd. You've got a mortgage at £1,150/month to Halifax. Amelia and Jack are with you during the week. Here's the picture taking shape." They do the heavy lifting. You confirm, correct, or fill gaps. In 15 minutes, not 15 hours.

**Quality bar:** This should feel like it was built in 2026. No shortcuts, no MVPs. The users are stressed, often alone, often late at night. Every interaction must be compassionate, professional, and empowering.

**MLP, not MVP.** When engineering phases open and scope conversations happen per slice, the frame is "what the *loveable* version requires vs what can iterate post-launch" — not "what's the minimum viable." Minimum Loveable Product. This matters because users are in crisis; a barely-functional product would do more harm than no product. Loveable is the floor.

## Phase 3 sequence

The post-audit 3-phase plan, restored to `SESSION-CONTEXT.md` via commit `780fa6c`, is verbatim from `docs/HANDOFF-SESSION-74.md` L80-82:

> **P1 (after P0):** `S-PROTO-pre-signup-interview` — Phase 3 prototype P1 per refreshed Phase 3 sequence. 4-step loop: dialogue → canvas-prompt → absorb → construct.
>
> **P2+:** `S-PROTO-section-confirm` (Build phase confirm pattern) · `S-PROTO-ai-coach` (Settle phase) · `S-PROTO-share-flow` (Reconcile multi-actor).

**Rule:** any off-sequence Phase 3 work must be flagged in `SESSION-CONTEXT.md`'s session priorities table with an explicit `OFF-SEQUENCE because X` note (where X names the reason — opportunistic canvas-port readiness, infra dependency, scope-add-on from prior PR, etc.). Off-sequence work is not forbidden; it must be visible.

### §Status

Sessions 112-114 ran off-sequence — marketing-landing, welcome-tour, and post-connect-dashboard canvas-ports shipped against §1/§3/§5 surfaces while the sequence's §6 (Build) `S-PROTO-section-confirm` remained unstarted. Session 115 restores discipline via `S-PROTO-journey-restore` (this slice). The next planned slice per the sequence is `S-PROTO-section-confirm` (§6 Build phase confirm pattern).

## Apply your own deltas first

Before committing wrap docs at session end, re-read this session's diff to `CLAUDE.md` and `docs/workspace-spec/**.md`. Audit `SESSION-CONTEXT.md` + `HANDOFF-N.md` against every rule added or modified this session — rules you just authored apply retroactively to your own wrap output. The discipline starts in the same PR that codifies it.

**Failure mode this prevents:** a session adds a rule (e.g. a new flagging convention, a new checklist item, a new constraint), then later in the same session writes wrap docs that violate the rule it just authored. The recall-failure root cause: rules are typically added mid-session; wrap docs are written under wrap-time load when the new rule is no longer top-of-mind. The result is a meta-failure where the very PR that codifies the discipline immediately violates it.

**Mechanism (T1 + T2; current):**
- T1 — this CLAUDE.md rule; recall-prompt at the moment of risk; lives next to the wrap protocol.
- T2 — `.claude/hooks/wrap-check.sh` self-delta-audit step; `/wrap` checklist surfaces a `[ ] Self-delta audit` item when `git diff origin/main...HEAD -- CLAUDE.md docs/workspace-spec/` is non-empty.

**Escalation triggers:** self-violations track via SESSION-CONTEXT.md recurrence-watch (existing mechanism). On **second recurrence after this rule lands**, escalate to one of:
- **T3** — author-time hook for the specific recurring rule (mirrors `.claude/hooks/journey-declared.sh` pattern — PostToolUse:Write|Edit on the relevant doc; advisory when rule-content marker absent). Use when failure is concentrated to one specific rule.
- **T4** — adversarial review subagent pass on wrap docs against current CLAUDE.md before commit (one-shot `claude -p` invocation; finds any rule the wrap docs violate). Use when failure is diffuse across multiple different rules.

Pick T3 vs T4 based on the recurrence pattern; record the choice in the session's HANDOFF + amend this section to drop the "current" / "escalation triggers" framing once stabilised.

### §Status

T1 + T2 shipped after a self-violation surfaced where a §"Phase 3 sequence" off-sequence-flagging rule was codified and then immediately violated in the same session's `SESSION-CONTEXT.md` priorities table; meta-failure caught by user post-wrap. Recurrence count under this rule: 0 (rule just landed). Promotion targets per existing recurrence-watch mechanism.

## Session startup (do this FIRST)

1. **Verify your working branch.** `.claude/hooks/session-start.sh` surfaces live branch state at turn 0 (current branch, HEAD vs origin/main, ahead/behind, tree state). Canonical branch name is in `docs/SESSION-CONTEXT.md` or the task description. If the harness landed you on a different base, resync: `git fetch origin <branch>` → `git checkout -B <branch> origin/<branch>`.

2. **Read `docs/SESSION-CONTEXT.md`** — rolling context block. Vision, principles, last session's accomplishments, current state, prioritised deliverables, negative constraints, key file paths. Always before anything else.

3. **Confirm with the user** what they want to focus on. SESSION-CONTEXT has suggested deliverables; user may have different priorities.

## Session discipline

### Track your progress actively

- Line-count tracking is automated: `.claude/hooks/line-count.sh` fires on every Write/Edit and surfaces delta + cumulative session churn. Soft-note at 1,000; warn at 1,500 ("approaching session scope limit — recommend wrapping up"); stop at 2,000 ("stop writing code and wrap"). When the hook surfaces a warn, relay it to the user.
- Use the TodoWrite tool to track tasks. Mark each done as you complete it.

### Context window freshness

- Keep responses concise. Don't repeat large blocks of code back to the user.
- When context is getting long, summarise what you've done so far rather than re-reading files you've already read.
- If you notice the conversation is very long, proactively suggest: "We've covered a lot of ground. Want me to generate the handoff and start a fresh session?"

### Wrapping up a session

Run `/wrap` for an auto-generated checklist (tree clean · HANDOFF-SESSION-N · SESSION-CONTEXT refreshed · PR status). Then, when the session is ending (user says wrap up, or you hit ~2,000 lines), do these in order:

1. **Commit and push** all uncommitted work
2. **Update `docs/SESSION-CONTEXT.md`** — rewrite it for the NEXT session:
   - What was accomplished this session (brief)
   - Current state of the codebase
   - Prioritised deliverables for next session
   - Any new negative constraints discovered
   - Updated key files list
   - Current branch name
3. **Write `docs/HANDOFF-SESSION-{N}.md`** — detailed retro:
   - What happened (with specifics)
   - What went well / what could improve
   - Key decisions made
   - Bugs found and how they were fixed
4. **Update this file (`CLAUDE.md`)** if branch conventions, key files, or rules changed
5. **Commit and push** the handoff docs
6. **Open PR to `main`** from the session branch (optional per session — currently recommended at session wrap to keep main as canonical source of latest locked specs and avoid long-running branch drift). Use `gh pr create` or the GitHub MCP tools.

## Branch

Current branch is always specified in `docs/SESSION-CONTEXT.md`. Each design session runs on its own branch (e.g. `claude/session-{N}-{scope}-{hash}`). Check SESSION-CONTEXT at session start. Engineering sessions (Phase C onward) may open dedicated slice-named branches per `docs/workspace-spec/70-build-map-slices.md`.

## Deployment

Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.
Tink credentials (`TINK_CLIENT_ID`, `TINK_CLIENT_SECRET`) must be set in Vercel env vars.
Tink Console must whitelist `https://construct-dev.vercel.app/api/bank/callback` as redirect URI.

## Key files

```
Session orientation
docs/SESSION-CONTEXT.md                             — START HERE every session
docs/HANDOFF-SESSION-{N}.md                         — Most recent session retro

Reconciled framing (spec 68 suite — read when relevant)
docs/workspace-spec/68-synthesis-hub.md             — Wire reconciliation hub
docs/workspace-spec/68a-decisions-crosscutting.md   — Cross-cutting locked (nav, trust, share, exit, AI coach)
docs/workspace-spec/68b-decisions-build.md          — Build phase locked (Sarah's Picture mechanics)
docs/workspace-spec/68c-decisions-reconcile.md      — Reconcile phase locked (joint doc, conflict card, queue)
docs/workspace-spec/68d-decisions-settle.md         — Settle phase locked (proposal, AI coach, counter)
docs/workspace-spec/68e-decisions-finalise.md       — Finalise phase locked (generation, pre-flight, fork, submit)
docs/workspace-spec/68f-open-decisions-register.md  — Session-21 register (LIVE, session-22 locks applied)
docs/workspace-spec/68g-visual-anchors.md           — C-V1..C-V14 extraction shortlist (Phase C)
docs/workspace-spec/68g-build-opens.md              — B-5..B-14 build-phase opens
docs/workspace-spec/68g-copy-share-opens.md         — C-U4-6 + C-S5-6 opens

Positioning + architecture
docs/workspace-spec/42-strategic-synthesis.md       — Authoritative positioning (5-phase amended session 22)
docs/workspace-spec/44-the-document-structure.md    — Document-as-spine (four-document lifecycle, amended)
docs/workspace-spec/65-pre-signup-interview-reconciled.md  — Pre-signup locked
docs/workspace-spec/65b-pre-signup-quantitative-layer.md   — Quantitative extension (3 new screens O6.5/O6.6/O6.7; buckets; Replace bridge to spec 67; AI-coach full access)
docs/workspace-spec/67-post-signup-profiling-progress.md   — 12 gaps resolved + Gap 7 resolved session 22

Build Map (spec 70 suite — the Phase B deliverable)
docs/workspace-spec/70-build-map.md                 — Hub: tagging, preserved-legacy, how-to-read (audit-integrated inventory, session 23)
docs/workspace-spec/70-build-map-start.md           — Phase 1
docs/workspace-spec/70-build-map-build.md           — Phase 2
docs/workspace-spec/70-build-map-reconcile.md       — Phase 3
docs/workspace-spec/70-build-map-settle.md          — Phase 4
docs/workspace-spec/70-build-map-finalise.md        — Phase 5
docs/workspace-spec/70-build-map-slices.md          — 33-slice catalogue (engineering work units)

Rebuild + engineering (Phase C preparation — session 23)
docs/workspace-spec/71-rebuild-strategy.md          — Folder structure, stable-lib paths, S-F7 dev-mode, Phase C sequencing. §5 + §7a amended session 24 (Option 4): bulk V1 removal, single-branch-main workflow, no integration branch, no cutover event
docs/workspace-spec/72-engineering-security.md      — Engineering security principles (data classification, env vars, auth/session, RLS, validation, logging, dev/prod boundary, third-party, safeguarding, pen-test readiness, per-slice security DoD)
docs/workspace-spec/72a-preview-deploy-rubric.md    — 6-dimension preview-deploy verification rubric (golden path · edge cases · prefers-reduced-motion · keyboard-only · mobile viewport · screen-reader); reviewed by ux-polish-reviewer persona from S-F1
docs/workspace-spec/72b-adversarial-review-budget.md — Adversarial review budget (Option A/B/C; spec-validation-by-impl-break check)
docs/workspace-spec/72c-multi-agent-review-framework.md — Multi-agent review framework (§1-§9; orchestrator + 7 dimension specialists + verdict aggregation + differential mode + test-fixture seeding + measurement); session 48
docs/workspace-spec/72d-architecture-review-additions.md — Architecture review additions (B+C+D pre-impl rigour: D test-pain gate · B fitness functions · C plan-architect persona); spec contracts session 72; D/B/C ship sequenced separately
docs/slices/S-INFRA-arch-smell-trigger/{acceptance,verification}.md — v3b S-7 sibling slice (CLAUDE.md §Architectural-smell-trigger paragraph; PR #32 merged session 48)
docs/slices/S-INFRA-persona-suite-v2-multi-agent/acceptance.md — v3b S-8 setup (6 ACs; spec 72c contract; impl deferred to session 49+; PR #33 merged session 48)
docs/engineering-phase-candidates.md                — Parked CLAUDE.md additions for Phase C kickoff (Karpathy coding conduct, engineering conventions, per-slice AC + test plan templates)

Phase C foundation slices (shipped to main during rebuild)
docs/slices/S-F1-design-tokens/{acceptance,verification,security,test-plan}.md  — Phase C.1 order #1; AC + impl session 29 (Apr 24); merged via session-35 wrap (PR #23, `92f77d7`); 65 `--ds-*` tokens + TS mirror + Button reskin + imagery convention + CSS↔TS parity test; 68g C-V1 + C-V13 locked 🟢
docs/slices/S-F7-alpha-contracts-dev-mode/{acceptance,verification,security,test-plan}.md  — Phase C.1 order #2-α; shipped (PR #20); auth + store interfaces + dev-session + dev-store + scenario-loader
docs/slices/S-F7-beta-dev-surface/{acceptance,verification,security}.md  — Phase C.1 order #2-β; scaffold on main (session-35 wrap PR #23); 7-AC impl PARKED at `claude/S-F7-beta-impl @ a3f67ec`, 8 ahead / 49 behind main (rigour-suite v3a+v3b+v3c landed in the gap); rebase planned session 60+

Hook + CI enforcement (sessions 25 + 27)
.claude/settings.json                               — Hook registrations (SessionStart · PostToolUse · PreToolUse)
.claude/hooks/session-start.sh                      — Turn-0 branch state + read-discipline reminder (session 25)
.claude/hooks/line-count.sh                         — PostToolUse Write/Edit: session-churn delta + wrap thresholds (session 27 P0.1)
.claude/hooks/read-cap.sh                           — PreToolUse Read: block >400-line full reads + >300-line turn batch (session 27 P0.2)
.claude/hooks/wrap-check.sh                         — /wrap helper: wrap-protocol checklist (session 27 P0.3)
.claude/commands/wrap.md                            — /wrap slash command (invokes wrap-check.sh)
.github/workflows/pr-dod.yml                        — CI: src/ PRs must reference docs/slices/S-*/verification.md (session 27 P0.4)
.github/PULL_REQUEST_TEMPLATE.md                    — 6-item DoD + 14-item security checklist on every PR (session 27 P0.4; base count reconciled session 75 — spec 72 §11 always had 14 boxes)

Loop harness + sign-up (session 125)
playwright.config.ts                                — Chromium pinned to the sandbox build; :3000 app + :3100 decoded-canvas servers
tests/e2e/sign-up.journey.e2e.ts                    — behaviour + a11y bar (Playwright + axe); CI runs vitest, not this — keep unit coverage too
tests/e2e/sign-up.visual-bar.e2e.ts                 — bare 402×874 captures: canvas screen (window.M_SignUp mounted standalone) + app, fonts shared
docs/slices/S-PROTO-sign-up/{acceptance,progress}.md — Template-2 loop card (objective · metric · boundary) + round log + drift escalations
AGENTS.md                                           — hosts Next 16's managed nextjs-agent-rules block so `next dev` leaves this file alone

Stable libraries (preserve across rebuild — Re-use per Build Map)
src/lib/bank/tink-client.ts                         — Tink API client
src/lib/bank/tink-transformer.ts                    — Tink → BankStatementExtraction
src/lib/bank/bank-data-utils.ts                     — Extraction → UI types + transaction search
src/lib/bank/signal-rules/                          — 17 rules (session 18)
src/lib/bank/confirmation-questions.ts              — Spec 22 decision trees (Preserve-with-reskin)
src/lib/bank/test-scenarios.ts                      — 5 synthetic scenarios
src/lib/ai/extraction-schemas.ts                    — Anthropic structured-output schemas
src/lib/ai/result-transformer.ts                    — Spec 13 trees + spec 19 keyword lookup
src/types/hub.ts                                    — Types (prune legacy during rebuild)
src/app/api/bank/connect/route.ts                   — Tink Link URL generation
src/app/api/bank/callback/route.ts                  — Tink callback (iframe postMessage + redirect)
src/app/workspace/engine-workbench/page.tsx         — Engine workbench dev tool

Discarded — do NOT port (superseded by 68 + 70)
src/components/workspace/*                          — V2 components (spec 18 palette / pre-pivot flow)
src/app/workspace/page.tsx                          — V2 flow orchestrator (replaced by new architecture)
```

## Information tiers — what to read and when

- **Tier 1 (always loaded):** This file. North star, rules, startup checklist.
- **Tier 2 (read at session start):** `docs/SESSION-CONTEXT.md` — current state and priorities.
- **Tier 3 (read when building a feature):** `docs/workspace-spec/{N}-*.md` — only the spec relevant to the current task. Don't read all specs.
- **Tier 4 (reference only, don't read proactively):** `docs/HANDOFF-SESSION-*.md`, `docs/v2/v2-backlog.md`, `docs/v2/v2-desk-research-*.md`. Consult these only if you need historical context or are planning a large piece of work.

The backlog lives at `docs/v2/v2-backlog.md` (98 items, prioritised). Don't read it every session — but consult it before proposing new work to check it's not already planned or deprioritised.

## Technical rules

- **Diagnose before fixing** — read logs/errors before changing code. Don't guess.
- **Design before code** — check `docs/workspace-spec/` for a spec before building a feature
- **AI extracts facts, app generates questions** — never put reasoning, clarification questions, or gap analysis in AI extraction schemas. The result-transformer.ts generates these using spec 13 decision trees.
- **Anthropic SDK uses `output_config.format`** — NOT `response_format` (that's OpenAI's API)
- **All JSON schema objects need `additionalProperties: false`** — Anthropic structured outputs require this
- **SDK timeout: 90s per call. Route maxDuration: 300s** — real PDFs need this headroom. Don't reduce.
- **Do not reference pre-pivot specs (03-06, 11, 12)** — the architecture changed. Active specs are 13-26.
- **Wireframes are definitive** — implement screens 1a–3a and 2a–2j exactly as wireframed in specs 24-25. Do not reinterpret or simplify. When in doubt, re-read the spec or ask the user to reshare the wireframe.
- **Transitions and animations are specced** — see spec 26. Every state change must have the specified animation. Provide `prefers-reduced-motion` fallbacks.

## Planning conduct

These rules govern how Claude makes decisions and builds plans. Guardrails against confident-but-wrong recommendations when the source material is available but not re-read. Derived from a session-24 failure where Path A was endorsed as "matching spec 71 §7a exactly" while actually contradicting it.

**Verify before planning.** When a task description, handoff, or prior summary states a fact about repo state (branch tips, PR status, merged/open, env vars set, file contents), verify against the actual source (git, GitHub API, Vercel, the file) before building a plan on it. Briefs are plans written at a past moment; they rot. Don't treat them as ground truth.

**Quote, don't paraphrase, when invoking a spec.** Any claim of the form "per spec X" or "matches X exactly" must include the literal sentence from the spec in the same breath. Forces the re-read. If you can't quote it, you don't know it.

**Plan-vs-spec cross-check before executing.** When the user approves a multi-step plan, re-read the most relevant spec section before the first actionable step. Explicitly confirm the plan still holds against the source. 30 seconds; catches drift between summary-recall and the actual text. Mirrors the explicit plan-then-execute separation in [Cline Plan/Act mode](https://docs.cline.bot/features/plan-and-act) and [Armin Ronacher, "What is Plan Mode?"](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/) — paired with the Hard-controls Plan-time-review gate (L249), this is the prompt-discipline half of the same idea.

**Pre-priority spec-gate verification.** Before treating a kickoff or SESSION-CONTEXT priority labeled "per spec X §Y" as authorized, grep that section's gating IF-clauses verbatim. Paraphrases routinely collapse gating IF-clauses with post-trigger conclusions; quote the gating, not the conclusion. Sessions 57 (F5c → v3a-foundation OOS, caught at PR review post-push, admin-bypass override needed) and 58 (spec 72c §7 synthetic-fixtures "first-3-src-slice retain/drop" precondition, caught pre-code at plan-vs-spec cross-check) each had kickoff paraphrases shipping or attempting work against unmet preconditions.

**Pre-priority shipped-artifact verification.** Sibling to the spec-gate rule for the kickoff-omission failure mode. Before treating a kickoff priority labeled "first src/ slice", "build X from scratch", or any fresh-build framing as authorized, `grep -r "S-XX" docs/slices/` (or `ls docs/slices/`) and `git log --grep="<slice-name>"` for shipped-artifact evidence. Kickoffs are written before they ship; subsequent sessions ship the work; the next kickoff routinely omits the shipped status. Session 59 turn-0 surfaced S-F1 already shipped (session 29 via session-35 wrap) despite the kickoff treating it as next-up — a separate failure mode from spec-gate paraphrase (constraint above) since the kickoff didn't paraphrase a spec, it omitted a build-state fact.

**Pre-priority canvas-fidelity verification.** Sibling to the spec-gate + shipped-artifact rules. Before treating a kickoff or SESSION-CONTEXT priority labeled "extract from canvas X", "match canvas X", or any visual-fidelity framing as authorized, demonstrate either (a) the decoded sibling readable form is already in the repo at `docs/design-source/<slug>/decoded/<file>.html`, or (b) a `scripts/decode-bundler-canvas.sh` invocation is visible in the session transcript. Bundled-HTML canvases (~5MB Claude AI Design exports) wrap the inner doc as a JSON-encoded string inside `<script type="__bundler/template">…</script>`; grep on the bundled form reads loader-shell CSS, not the visual treatment. Session 76 surfaced this as the failure mode behind a structurally-correct-but-visually-basic prototype; merge-time gate `.github/workflows/canvas-decode.yml` + author-time hook `.claude/hooks/spec-citation-quote.sh` (paired with `.github/workflows/spec-citation-quote.yml`) operationalise the rule.

**Path options carry spec refs.** When offering A / B / C alternatives, each option must name which spec justifies it or conflicts with it. Prevents abstract-tradeoff reasoning from sneaking in.

**Distrust your own summaries.** A summary compressed earlier in the session is navigation, not source. When a decision is load-bearing, go back to the spec itself — even if the summary "feels" right. Heavy context makes skim-recall tempting; resist it.

**Read discipline.** Enforced by `.claude/hooks/read-cap.sh` (PreToolUse on Read): blocks full-file Reads of >400-line files without offset+limit, and blocks Reads that would push this turn's total past 300 lines. Deny messages quote the rule and suggest offset/limit or grep-first alternatives. Habits the hook doesn't catch — `grep` / `ls` / `wc -l` before committing to a Read, announcing expected combined size before a parallel batch — remain in you.

**Branch-resume check.** Enforced by `.claude/hooks/session-start.sh` (SessionStart): at turn 0, when the current branch matches the harness suffix pattern `^claude/.+-[A-Za-z0-9]{5}$` AND the non-suffixed canonical branch exists on origin, the context block surfaces a `### Branch-resume check` section with the literal `git fetch / git checkout -B / git branch -D` resync recipe. The hook auto-detects; the discipline is to act on the warning rather than dismiss it. Sessions 33 + 34 each landed on a suffixed orphan when canonical work was on the non-suffixed branch — both lost ~5 minutes to manual `mcp__github__list_branches` diagnosis before the hook existed.

**`origin/HEAD` set.** Enforced by `.claude/hooks/session-start.sh` (SessionStart): the hook runs `git remote set-head origin main 2>/dev/null || true` near the top, before any consumer can hit `fatal: ambiguous argument 'origin/HEAD'`. The `/security-review` skill + several spec-72 CI invocations resolve `origin/HEAD...` and fail noisily without it. Idempotent + offline-safe; no behaviour beyond ensuring the symbolic ref exists.

## Coding conduct

These rules govern how Claude behaves when editing `src/`. Guardrails against over-engineering, silent decisions, and scope creep. Complementary to Product rules and Technical rules — doesn't replace either.

**Think before coding.** Surface confusion; name uncertainty. When more than one interpretation is possible, present both rather than silent-deciding. Mention simpler approaches and push back when appropriate. Stop and ask if a request is ambiguous — don't proceed on assumptions.

**Simplicity first.** Minimum code that solves the problem. No unrequested features, no speculative abstractions, no "configurability" unless asked, no error handling for scenarios that can't happen. If 200 lines could be 50, rewrite. Senior-engineer test: would they say this is overcomplicated?

**Surgical changes.** Touch only what the task requires. Don't improve adjacent code, don't refactor functioning code, don't reformat. Match existing style. If you notice unrelated dead code, mention it — don't delete it. Every changed line should trace directly to the requested task.

**Names carry the design.** A reader should infer purpose from the name alone. If a name needs a comment to clarify, rename it. Functions are verbs; types and modules are nouns; booleans answer questions.

**Small, single-purpose functions.** Functions do one thing. If you reach for "and" in the function name, split it. No fixed line ceiling — readability is the test, not line count — but a function that needs scrolling is a smell.

**Effects behind interfaces.** Pure logic doesn't import side-effecty modules; effects (storage, network, time, randomness) live behind interfaces consumers can swap. If a unit can't be tested without mocking the world, the seam is wrong. Hexagonal-architecture style — see spec 71 §4 for the reference shape applied to S-F7.

**Goal-driven execution.** Convert each task into verifiable success criteria before writing code. Test-first where tractable. Strong criteria enable independent looping; weak criteria require re-clarification and slow velocity.

**Comments: WHY not WHAT, no temporal provenance.** Reinforces the system-prompt rule with concrete anti-patterns the multi-agent style specialist flags repeatedly (session-55 + session-56 empirics; enforced by `.claude/agents/reviewer-style.md`):
- **PR / session / slice provenance** in persistent comments or test descriptions ("PR #56 round 7", "session-56 amendment", "slice S-F1 AC-3") — rot fast; live in PR description.
- **Sibling-step references** ("Mirrors the aggregate fallback", "same as Y above") — break when one side moves; describe the local invariant directly instead.
- **Narration of WHAT** — file/type enumerations the surrounding code structure already shows; well-named identifiers already convey purpose.
- **Hard-coded counts that describe historical state** ("14 findings actioned across rounds 1-9") in general-purpose code — replace with `length()` or a named constant if relevant; otherwise drop.
- **Code lineage** ("added for the Y flow", "handles issue #123", "used by X") — PR description, not code.

Spec §Status footers ARE the right place for lineage tracking (lineage IS the section's purpose); code comments and persistent test descriptions are not.

## Engineering conventions

**TDD where tractable.** Write the test first, then the code to pass it. Applies to logic, rules, data transforms, API routes, signal/engine work. Not mandatory for pure-visual UI (visual regression covers that), but preferred wherever state or branching logic exists. Bail-out criteria are documented as the rubric in `docs/tdd-exemption-allowlist.txt` header (per v3b AC-8) — entries must carry a `category:glob` tag matching one of three categories (`pure-visual-ui`, `pure-rename`, `pure-config`); untagged entries fail-loud at `verify-slice.sh` Gate 3b (runs in both incremental + full modes). Per [Hillel Wayne, "I have complicated feelings about TDD"](https://buttondown.com/hillelwayne/archive/i-have-complicated-feelings-about-tdd-8403/) — TDD is a calibration tool for your sense of code, not a universal mandate; the bail-out categories above match Wayne's "good for some code, bad for others" framing.

**Don't write file-content assertions for logic slices.** If the unit under test is a function with branching/computation, exercise it with inputs and assert outputs. File-content / regex assertions are reserved for pure-string slices (copy-flips) and structural-parity invariants (e.g. CSS↔TS token alignment per S-F1). Refactor-fragility is the smell.

**Adversarial review gate (per slice).** Before committing any slice or significant change, run one adversarial review pass. Two options: (1) explicit prompt — "poke holes in this; find edge cases, security issues, regression risks"; (2) `/review` or `/security-review` skill. Output is a list of concerns. Either address or explicitly defer with reasoning. No slice ships without this gate. When `wc -l docs/slices/S-XX/acceptance.md` >300, follow the budget convention at `docs/workspace-spec/72b-adversarial-review-budget.md` (per v3b AC-10): partition into 3 sub-spawns (300-1000L) or declare a multi-turn budget envelope (>1000L); slice setup §Pre-flight notes which option applies.

**Architectural-smell trigger** (v3b-introduced, session 47 lesson; reframed v3c P0b-structural session 53 per Cunningham/Fowler). If adversarial review surfaces clustered findings in a single file — multiple findings across different concerns landing in the same file — flag it as a candidate architectural smell and step-back-review whether the abstraction is wrong before continuing patch-iteration. The reviewer's judgement is the gate: if patches feel like interest payment rather than principal — the same file keeps surfacing problems across unrelated concerns — the abstraction is wrong; the cheaper move is usually to split the file (extract logic to a tested unit, leave the original as a thin orchestrator) rather than keep patching. Worked example: v3b S-6 `auto-review.yml` took 6 rounds (parse-default → ac-gap → sed-strip → sentinel → doc-drift → timeout) because parsing + diagnostic + check-run posting + skip + failure-fallback were all inline with no test surface. A mid-iteration step-back would have extracted parsing to `scripts/auto-review-parse.sh` with shellspec tests; later rounds would have been pre-caught at test time. Per Cunningham/Fowler: smell is judgement, not metric — the v3a numeric "≥3 rounds" trigger was deprecated session 53 because round-counting incentivises gaming (delay the third round to dodge the trigger) rather than addressing the underlying coupling.

**Test-pain audit (per spec 72d §3).** During TDD, count mock setups per unit test. If any unit test in a slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation. The pain is the signal — `vi.fn()` for a callback signature is not the same kind of mock as `vi.mock('@/lib/storage')` swapping a whole module, and three is not a hard ceiling, but the discipline is to NOTICE proliferating mocks and react. Address by extracting effects behind interfaces (CLAUDE.md §"Coding conduct" §"Effects behind interfaces" — *"effects (storage, network, time, randomness) live behind interfaces consumers can swap"*) or explicitly defer with reasoning recorded in `verification.md` §"Architectural deferrals". Per Beck (TDD as design tool); Freeman + Pryce, *Growing Object-Oriented Software, Guided by Tests* (mock-pain surfaces bad seams); Hillel Wayne, ["I have complicated feelings about TDD"](https://buttondown.com/hillelwayne/archive/i-have-complicated-feelings-about-tdd-8403/) (calibration tool, not universal mandate). Sibling to **Architectural-smell trigger** — early-warning during TDD vs late-warning during multi-round patch-iteration; both convention paragraphs sit in this §"Engineering conventions" section.

**Snapshot before refactor.** Any refactor over ~50 lines or touching more than 2 files: commit a checkpoint on the branch first. Cheap rollback insurance, explicit before/after diff when reviewing. Mirrors the [Mikado method](https://understandlegacycode.com/blog/a-process-to-do-safe-changes-in-a-complex-codebase/) prepare-and-revert-on-failure discipline — scoped here to single-PR refactors rather than legacy-system overhauls.

**100% rule (AC arithmetic).** When slicing AC against an audit-catalogue or numbered list, verify `Σ in-scope rows = total rows` before freezing. Catches scope omissions and off-by-one errors that hide behind narrative AC text. Per the [PMI WBS 100% rule](https://www.workbreakdownstructure.com/100-percent-rule-work-breakdown-structure) — every WBS element accounts for 100% of the work, not 90%, not 110%; AC slicing inherits the same constraint.

**Deterministic over generative.** For repetitive scaffolding (new slice folder, codegen, boilerplate, branch setup), prefer bash/CLI over prompting Claude. Reserve Claude for reasoning tasks. Extends the "prefer dedicated tools over Bash when one fits" rule — the inverse is also true when deterministic is cheaper.

**Definition of Done (per slice).** A slice ships only when all six are true:
1. All acceptance criteria met, with evidence per AC in `verification.md` (final-state record assembled at slice ship; round-by-round multi-agent audit detail belongs in HANDOFF or PR description, not in `verification.md` itself — append-as-you-go creates internal-consistency findings round-over-round)
2. Tests written and passing (unit + integration + visual as applicable; test-pain audit per spec 72d §3 cleared)
3. Adversarial review done; concerns addressed or explicitly deferred
4. Preview deploy verified in-browser if UI (golden path + edge cases + prefers-reduced-motion)
5. No regression in adjacent slices (smoke check + automated tests across the slice's affected surfaces)
6. Slice's open 68f/g entries resolved or explicitly deferred with reasoning in slice wrap

Plus the 14-item security checklist in spec 72 §11 (short-form for `category: prototype` slices — see §"Slice categories" + spec 76 §5). No exceptions for `production` or `infrastructure` categories. A partially-done slice is not shipped; it's re-scoped and re-planned.

Enforcement: `.github/PULL_REQUEST_TEMPLATE.md` reproduces this checklist; `.github/workflows/pr-dod.yml` fails any PR that touches `src/` without a `docs/slices/S-*/verification.md` reference in the body (escape hatch: `no-slice-required` label for truly trivial src/ touches).

## Slice categories

Every slice carries a category — `production` · `prototype` · `infrastructure` — that determines which gates fire with what calibration. Canonical mechanism + per-category gate-behaviour matrix in `docs/workspace-spec/76-prototype-mode-rigour.md` §3. This section is the always-loaded summary.

**Defaults by path:**

- `src/app/dev/proto/<literal-slug>/**` where `<literal-slug>` is a directory whose name does NOT begin with `[` → `prototype`
- `.claude/**` · `.github/**` · `scripts/**` · `*.config.*` · `CODEOWNERS` → `infrastructure`
- All other `src/**` → `production`
- `src/app/dev/proto/page.tsx` (the registry hub itself) and `src/app/dev/proto/[slug]/**` (parametric stub-routes) default to `production`; only literal-slug subroutes default to `prototype`.

**Override** (when path-default is wrong for a slice's primary surface): a line `**Category:** prototype | production | infrastructure` immediately after the slice's `# S-XX-NAME` title in `docs/slices/S-XX/acceptance.md`. Detection regex: `^\*\*Category:\*\*[[:space:]]+(prototype|production|infrastructure)$`. Override takes precedence over path default. Hub case: `S-PROTO-hub` declares `**Category:** production` because it's calibration cohort row 1 and runs full production rigour despite living under `src/app/dev/proto/`.

**Per-category behaviour summary** (full matrix in spec 76 §3):

- `production` — all gates at production calibration. Default for the bulk of `src/**` work.
- `prototype` — UI/UX rigour preserved (preview-deploy 6-dim runs in full · `reviewer-prototype-readiness` post-PR persona **substitutes** `reviewer-correctness`); code rigour relaxed (TDD-guard skips · coverage excludes · test-pain audit threshold raises from >2 to >5 mocks · DoD-14 short-form to items 1, 8, 12, 14 only). Used for `/dev/proto/*` static-data dev-mode UI; T0 metadata only.
- `infrastructure` — full production-grade rigour for control-plane changes (hooks · workflows · ESLint config · persona files); the surface that gates the rest of the rig.

**Sweep discipline (spec 76 §6).** Constraint #38 applies recursively: any amendment to spec 76 §3 matrix that changes a per-category rule MUST sweep all implementing files in the same PR (`vitest.config.ts` · `.claude/hooks/tdd-guard.sh` · `.claude/hooks/tdd-first-every-commit.sh` · `.github/workflows/auto-review.yml` · `.github/PULL_REQUEST_TEMPLATE.md` · any slice's overriding `acceptance.md`).

## Hard controls (in development)

**Status:** in development. This stub catalogues gates landed by `S-INFRA-rigour-v3a-foundation` only. v3b adds the adversarial subagent suite; v3c rewrites this section as a consolidating reference. Canonical source for AC text + rationale is `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md`.

### Gates this slice ships

| Gate | File(s) | Fires on | AC | Bypass |
|---|---|---|---|---|
| CODEOWNERS code-owner review | `.github/CODEOWNERS` + GitHub branch-protection (`required_pull_request_reviews.require_code_owner_reviews=true`) | every PR touching CODEOWNERS-listed paths; enforces via GitHub Reviewers panel | v3c P0b-structural AC-1 | conscious admin-bypass click ("Merge without waiting for required review") in solo-operator context (sole code-owner = PR author; GitHub hard rule prevents self-approval); rigour gate = auto-review.yml + admin-click-as-conscious-act |
| ESLint zero-new-disables (count ratchet) | `scripts/eslint-no-disable.sh` + `.github/workflows/eslint-no-disable.yml` | every push + PR | AC-3 | ship via CODEOWNERS admin-bypass |
| ESLint function-size + max-lines | `eslint.config.mjs` | `npm run lint` + CI `Lint` job | AC-3 | edit thresholds under `control-change` label (full origin/main-anchored ratchet lands v3c per F5c) |
| Coverage threshold ratchet | `scripts/coverage-threshold-ratchet.sh` + `.github/workflows/coverage-threshold.yml` | every push + PR | AC-3 | ship via CODEOWNERS admin-bypass |
| Plan-time review | `.claude/hooks/exit-plan-review.sh` + `.claude/subagent-prompts/exit-plan-review.md` + `.claude/agents/plan-architect.md` + `scripts/git-state-verifier.sh` | `ExitPlanMode` (PreToolUse) | AC-7 + spec 72d §5 | address findings + re-attempt; opt-out via `EXIT_PLAN_REVIEW_SPAWN=0` (degrades to stub-mode verdict from `git-state-verifier.sh` only); both personas use Conventional Comments per spec 72c §4 L69 (single-format aggregation; block on any `blocking: true` across union of `findings[]`) |
| Slice-verification PR-body | `.github/workflows/pr-dod.yml` | every PR touching `src/` | pre-S-37 (P0.4) | reference slice's `verification.md` in body, or apply `no-slice-required` label |
| Auto-review on PR (multi-agent · 3 specialists) | `.claude/agents/reviewer-{security,correctness,style}.md` + `scripts/spawn-multi-reviewer.sh` + `.github/workflows/auto-review.yml` | `pull_request:opened/synchronize` | v3b AC-1 + S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate (session 52) + S-INFRA-persona-suite-v2-multi-agent AC-1 + AC-5 (session 55) + spec 72c §5 default flip (session 56) + spec 72c §4 architecture-drop (session 70) | partially merge-gating: `block` (≥`k_block`=2 specialist votes on a blocking finding at `k=2` default per spec 72c §5 session-56 amendment — now majority across 3 specialists post session-70; opt-in `k=1` first-fault-blocks via explicit `--multi k=1`) + `parse-failed` (all 3 specialists unparseable) + pipeline-crash → `failure` (the rigour-malfunction paths gate the merge); `request-changes` + `nit-only` → `neutral` (advisory only); `approve` → `success`; skip on missing `ANTHROPIC_API_KEY` → `neutral` (forks unaffected); degraded mode (≥1 specialist inconclusive but ≥1 present) reports verdict + `inconclusive_dimensions` warning per spec 72c §3 (no fallback to single-agent re-run; `slice-reviewer.md` retired session 55) |
| Canvas-fidelity dimension (additive, conditional) | `.claude/agents/reviewer-canvas-fidelity.md` + `.github/workflows/auto-review.yml` (brief.compose extension) | `pull_request:opened/synchronize` for prototype slices whose `acceptance.md` carries a `Linked canvas:` field | S-INFRA-canvas-fidelity-gate AC-1 + AC-2 | advisory by default — defaults to `issue` with `blocking: false` per persona category × default-label/blocking matrix; `blocking: true` only on `missing-element` for AC-mandated elements OR when the slice AC explicitly quotes the canvas rule via AC-as-canvas-quote. Field-absent slices skip the dimension (3-dim review unchanged); production slices skip (canvas-fidelity is prototype-only). |
| Synthetic-deliberate-injection per-persona regression | `tests/personas/synthetic/{security,correctness,style,canvas-fidelity}.diff` + `tests/personas/synthetic/canvas-fidelity.canvas` + `tests/personas/synthetic/expected/*.json` + `tests/personas/run-synthetic.sh` + `tests/personas/match-synthetic.sh` + `.github/workflows/persona-synthetic-fixtures.yml` | `pull_request:opened/synchronize` + `push:main` (path-filtered: persona prompts, orchestrator scripts, parser, synthetic content, runner, matcher, workflow) | spec 72c §7 first-3-src-slice synthetic-deliberate-injection deliverable + S-INFRA-synthetic-fixtures + S-INFRA-canvas-fidelity-gate AC-4 | merge-gating per-persona-regression: harness invokes each specialist via `claude -p` against its own deliberate-injection diff and asserts the planted defect is flagged by signature predicates (label set, blocking set, category-pattern matching enum, evidence-keyword any-of, remediation-keyword any-of, min-count); canvas-fidelity persona additionally receives `<linked-canvas-NONCE>` fence with `.canvas` fixture content; any persona that doesn't flag its planted defect → workflow `failure`; skip on missing `ANTHROPIC_API_KEY` → exit 0 with neutral (forks unaffected); CLI version pinned in lockstep with `auto-review.yml` — drift between the two pins is its own regression class |
| Author-time comment review | `.claude/hooks/comment-review.sh` + `.claude/agents/reviewer-comment.md` | PostToolUse:Write\|Edit (advisory) | S-INFRA-reviewer-comment AC-1+2 | advisory-only — no formal bypass; stub-mode default emits `systemMessage` on flagged anti-patterns; live-mode (`COMMENT_REVIEW_SPAWN=1`) opt-in spawns persona via `claude -p`; both modes exit 0 always |

Each gate emits a useful-message exit body on failure: what failed, why per spec, concrete remediation.

The author-time comment-review hook surfaces; PR-time `reviewer-style.md` `commenting`-category findings block. The hook runs the regex-tractable catalogue items from §"Coding conduct" §"Comments: WHY not WHAT, no temporal provenance" (provenance · finding-ID · sibling-step · lineage · historical-count · emoji); WHAT-narration is non-tractable in stub mode and only checked when live mode is enabled. The §Status footer exemption is honoured — content inside `^## §?Status` blocks is excluded from the regex scan. Skip-list at the hook covers `tests/shellspec/**`, `tests/**/fixtures/**`, `tests/personas/synthetic/**`, `docs/HANDOFF-SESSION-*.md`, `docs/SESSION-CONTEXT.md`, structural data formats (`*.json`, `*.yaml`, `*.lock`), stylesheets (`*.css`, covering `.module.css` — CSS comments are typically structural section markers, vendor-prefix shims, or descriptive labels rather than the prose-level anti-patterns the hook protects against), and binaries. Persona files under `.claude/agents/**` and `.claude/subagent-prompts/**` are NOT skipped — they're a high-frequency drift surface for the same anti-patterns.

Slice-DoD enforcement is CI-only via `.github/workflows/pr-dod.yml` — no pre-commit hook gates DoD (per v3c P0b-structural AC-2 deprecation; pre-commit is wrong layer for completeness checks per session-49 prior-art audit verdict).

### Verdict vocabulary (per G23 + AC-5 Conventional Comments adoption)

Subagent reviews emit findings using the [Conventional Comments](https://conventionalcomments.org/) vocabulary verbatim. Each finding carries a `label` (the comment intent) and a `blocking` boolean (the merge-gate decoration). The top-level `verdict` is derived deterministically from the findings array — no separate severity scale.

**Labels (verbatim from conventionalcomments.org):**

- `praise` — highlight something positive; never blocking.
- `nitpick` — trivial preference (whitespace, naming-style); non-blocking by default.
- `suggestion` — proposed improvement; blocking only with explicit `(blocking)` decoration.
- `issue` — problem found; blocking by default unless author explicitly marks `(non-blocking)`.
- `todo` — small needed action before merge; blocking by default.
- `question` — clarification request; never blocking.
- `thought` — idea worth sharing; never blocking.
- `chore` — housekeeping (rebase, update changelog); non-blocking by default.
- `note` — point to highlight without recommending action; never blocking.

**Verdict derivation rules** (deterministic; computed by the orchestrator from findings, NOT emitted by personas):

- `block` — at least one finding has `blocking: true`.
- `request-changes` — at least one non-blocking finding with `label ∈ {issue, suggestion, todo}`.
- `nit-only` — at least one finding with `label ∈ {nitpick, chore}` and no findings above.
- `approve` — empty findings, OR only `label ∈ {praise, question, thought, note}` findings.

**Check-run conclusion mapping** (auto-review.yml posts to GitHub):

- `failure` ← `block` (gate refuses; `architectural` finding equivalent).
- `neutral` ← `request-changes` or `nit-only` (informational; author should address but not blocking the merge button at v3b ship).
- `success` ← `approve`.

This vocabulary supersedes the prior `verdict × severity` matrix (`approve / nit-only / request-changes / block × architectural / logic / style / none`). Personas SHOULD NOT emit a top-level `severity` field; the workflow derives the check-run conclusion from the findings array itself.

### Subagent file locations (per v3b AC-5)

Two `.claude/` directories carry subagent files; the distinction is by spawn pattern, not by content category:

- **`.claude/subagent-prompts/`** — hook-spawned prompt templates. Loaded by hook scripts via explicit path read (e.g. `.claude/hooks/exit-plan-review.sh` reads `.claude/subagent-prompts/exit-plan-review.md`). Filename is referenced from the hook script directly.
- **`.claude/agents/`** — review personas spawned by the main session via `Agent` tool calls or `/review`-class skills. Filename = persona name; file body = persona rubric.

Both locations are committed (versioned with the codebase). Per `docs/engineering-phase-candidates.md` §E L132: *"Storage: repo-level `.claude/agents/` (committed, travels with the project). Not user-home (`~/.claude/`) — those are personal and don't version with the codebase."* Same principle applies to `subagent-prompts/`.

v3b persona shipments land under `.claude/agents/`: PR-review fan-out via 3 specialists at `reviewer-{security,correctness,style}.md` (per S-INFRA-persona-suite-v2-multi-agent AC-2 + spec 72c §4 session-70 architecture-drop; `slice-reviewer.md` retired atomically with the workflow flip at session 55 per AC-5; `reviewer-architecture.md` retired session 70 per CLAUDE.md retain/drop metric drop verdict); slice-completion AC verifier `acceptance-gate.md` and UI-surface review `ux-polish-reviewer.md` are unchanged orthogonal personas. v3a's `exit-plan-review.md` stays under `.claude/subagent-prompts/` — it's a hook-spawned template, not a session-spawned persona.

**Invocation conventions** (per v3b S-6 ship; AC-1/2/3):

- **`reviewer-{security,correctness,style}.md` (S-INFRA-persona-suite-v2-multi-agent AC-1 + AC-2; reduced from 4 to 3 specialists at session 70 per spec 72c §4 architecture-drop)** — auto-spawned by `.github/workflows/auto-review.yml` on `pull_request:opened/synchronize` under matrix strategy (3 parallel specialist runners per spec 72c §3). Each specialist receives the same per-invocation inputs (PR diff + linked slice `acceptance.md` via PR-body path or `claude/S-XX-...` branch heuristic + CLAUDE.md §"Coding conduct") composed inline by the workflow's `brief` job; specialists fan out under `specialist` matrix job; aggregator job `aggregate` runs `scripts/spawn-multi-reviewer.sh aggregate /tmp/envelopes` to dedupe findings (SHA-256-equivalent over `label|category|first-64-chars-evidence` per spec 72c §5 rule 2; preserves `seen_by[]`) and derive verdict via `scripts/derive-verdict.sh --multi k=2` (default post session-56 amendment; shadow `would_have_been_k1` / `_k3` emitted alongside per spec 72c §5; opt-in `k=1` first-fault-blocks via explicit flag override). Verdict posts as a single unified check-run + PR comment. Degraded mode (≥1 specialist inconclusive) is the failure response per spec 72c §3 — no fallback to a single-agent re-run; `slice-reviewer.md` is retired (session 55). Specialists may also be spawned manually via the `Agent` tool for ad-hoc review of an in-progress diff (one-at-a-time; aggregator only matters for the workflow path).
- **`acceptance-gate.md` (AC-2)** — persona file ships at v3b S-6; **invocation wiring lands at S-F1** (the first src/ slice). Spawned at slice-completion time by `/wrap` or main-session call. Inputs: slice `acceptance.md` + slice `verification.md` + CLAUDE.md "Engineering conventions §Definition of Done". Verdict is informational at v3b ship; auto-blocking PR merge deferred to v3c per AC-2 §Out of scope.
- **`ux-polish-reviewer.md` (AC-3)** — dormant at v3b ship (no `src/` UI surface in v3a/v3b infra slices). Active from S-F1 onwards. Spawned during slice-completion for any AC whose `In scope` mentions UI surface (`src/app/**`, `src/components/**`, or any `*.tsx` rendered to the browser). Inputs: slice diff + slice `acceptance.md` + spec 72a six-dim rubric + slice `verification.md` `## Preview-deploy verification` section.

All three personas emit strict-JSON output per the `Verdict vocabulary` above. Persona prompts include nonced fenced delimiters for each input, and accept spec 72b Option C inline-file content (`--- BEGIN <path> NONCE --- ... --- END <path> NONCE ---`) for atomic files >300 lines.

### Preview-deploy verification rubric (per v3b AC-9)

DoD item 4 ("Preview deploy verified in-browser if UI") gains a six-dimension contract at `docs/workspace-spec/72a-preview-deploy-rubric.md`: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport (375×667) · screen-reader. Each `src/`-touching slice's `verification.md` MUST include a `## Preview-deploy verification` section with one row per dimension + Status + Evidence. The AC-3 `ux-polish-reviewer` persona reviews this section once active (S-F1 onwards). Dormant at v3a/v3b — those slices have no UI surface.

### Persona retain/drop metric (per v3b AC-4)

After the first 3 src/ slices ship (S-F1 onwards), each `.claude/agents/*.md` persona is re-evaluated against an explicit retain-or-drop verdict. The metric is verbatim per `docs/engineering-phase-candidates.md` §E L129:

> *"**Retain criteria:** if the agent catches at least one issue the main conversation missed per 2-3 slices, retain. Otherwise drop — added friction without value."*

And L133:

> *"**Re-evaluate after first 3 slices.** Record the retention/drop decision in that session's handoff."*

**HANDOFF template extension.** Each `docs/HANDOFF-SESSION-N.md` for a session that ships an `src/` slice gains a `## Persona findings recorded` section, with one row per active persona logging:

- Persona name (filename in `.claude/agents/`)
- Findings count for that slice (count + brief one-line summary each)
- Whether any finding was an issue the main conversation missed (Y/N)

After three `src/` slices, the third slice's HANDOFF renders an explicit retain-or-drop verdict per persona; the verdict is committed as part of that slice's wrap docs (HANDOFF + SESSION-CONTEXT). Personas dropped at that point have their files removed from `.claude/agents/` (control-plane change → ship under `control-change` label).

### Rollback procedure (per G19)

If rigour infrastructure causes operational pain post-merge, rollback is: (a) revert the merge commit on `main` via `git revert -m 1 <merge-sha>` in a new PR carrying the `control-change` label; (b) the hook scripts under `.claude/hooks/` (e.g. `tdd-first-every-commit.sh`, `tdd-guard.sh`, `exit-plan-review.sh`, `comment-review.sh`) remain on disk locally but become inert because their `.claude/settings.json` registration is reverted; (c) the revert PR documents WHY in body so a follow-up can address the root cause. **No `--no-verify` bypass needed** — harness-level hooks don't intercept `git revert` of unregistered settings.

The `control-change` label remains the gate for control-plane changes (hook scripts, persona files, CI workflow files, eslint config, CODEOWNERS). The v3a-era hooks-checksums + control-change-label.yml file-integrity mechanism described in earlier rigour docs has been decommissioned via P0b-structural; the label itself is enforced via branch-protection + reviewer discipline rather than a workflow check.

### Not yet in scope (v3b / v3c carry-over)

Canonical sources: `docs/HANDOFF-SESSION-55.md` §"v3c carry-overs" + spec 72c §9 §"Out of scope" + `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md`. Ranked picks for the next session live in the most recent HANDOFF §"Next session priorities".

**Review-flow completion:**
- During-work review subagents — commit-msg accuracy, spec-quote enforcement, AskUserQuestion framing, periodic on-track audit, doc-honesty
- Pair-programming PostToolUse hook with intent file + finding-response loop

**Drift / regression detection:**
- Live persona drift detection — quarterly cron re-invocation against golden seeds (recurring API budget; spec 72c §9)

**External integrations:**
- Multi-provider 3rd-agent reviewer (GPT/Gemini for cross-provider diversity; spec 72c §"Out of scope")
- Stryker mutation testing on persona prompts

## Visual direction

**Phase scoping.** Two patterns, applied per phase:

- **Canvas-as-source (prototype default).** Used for screens under `src/app/dev/proto/<slug>/**`. Canvas JSX is the page with light adaptation. No canvas-fidelity gate; no per-AC verbatim quoting. Feedback via preview-deploy + user iteration.
- **Preserve-and-rebuild (Phase C+ production).** Used for screens under `src/app/**` outside the proto namespace. Synthesise a design system from canvases per Build Map; audit drift via canvas-fidelity persona at PR review; lock per-AC verbatim canvas quotes.

The original framing treated all canvas work as preserve-and-rebuild. The split emerged after the reconciliation overhead — slice-resolve plumbing, workflow gating, persona iteration, per-AC verbatim quoting — proved disproportionate to prototype-phase value, where the canvas JSX is already valid React and the user is the sole consumer until production hand-off. Canvas-as-source avoids the rebuild step's drift class entirely (per-screen typography variance, SVG shape mismatches, layout-chrome divergence) because the page IS the canvas.

**Canonical source:** the Claude AI Design tool outputs from session 22 wire batches onward. Exact visual treatment — colour system, typography, component design, screen layouts — captured for both patterns. Copy in the outputs is NOT final; visual treatment IS.

**Source files repo-committed, not URL-fetched.** Claude AI Design outputs must live at `docs/design-source/{slug}/`. The Anthropic-hosted URLs are auth-gated and unreachable from the agent sandbox.

**Not reference points:** Airbnb, Emma, Habito. Legacy in-house visual language (spec 18 colour palette, spec 27 visual direction) is superseded.

### Journey wiring

Every prototype slice's `acceptance.md` declares a `**Journey:**` field immediately after `**Category:**`, naming inbound (where the user arrives from) and outbound (where the user goes next). Forces inter-surface wiring to be an explicit decision at slice-scope time, not an after-thought.

Format:

> `**Journey:** inbound from = <surface-id | "external/marketing"> · outbound to = <surface-id | "completion-stub">`

Orphan surfaces declare:

> `**Journey:** orphan — pending wiring in slice S-X` with reason

Detection regex (used by author-time hook + future CI lint): `^\*\*Journey:\*\*[[:space:]]+`.

Enforcement: `.claude/hooks/journey-declared.sh` (PostToolUse:Write|Edit) emits an advisory when a `docs/slices/S-PROTO-*/acceptance.md` is authored without the field. Advisory only (exits 0). Convention is enforced by author + reviewer discipline; the hook keeps the rule top-of-mind during authoring.

### Canvas-as-source (prototype default)

The canvas JSX (`docs/design-source/<slug>/jsx/*.jsx`) or decoded HTML is real React/JSX. It becomes the page with a 5-step light adapt:

1. **Tokenise hardcoded colours.** Canvas-top constants (`const INK = "#1A1A1A"` etc) → `tokens.color.ink` refs. Add `import { tokens } from '@/styles/tokens'`.
2. **Replace placeholder data.** Canvas literals (`"Your situation"`, `current={2}`) → copy-resolver calls + real props.
3. **Wire state.** Dummy values → context hooks (`useProto().step`, `setAnswer()` etc).
4. **Add Next.js wrapping.** `'use client'` directive; page wrapper at `src/app/dev/proto/<slug>/screens/<screen>.tsx`.
5. **Inline canvas-local helpers OR adapt.** Helpers like Arrow, StepRail can stay inline in the screen, become local components under `components/`, or replace with existing shared components — judgement call per screen.

Feedback loop: build the screen → preview-deploy → user reviews → iterate. **No canvas-fidelity gate fires by default**; no AC-as-canvas-quote requirement; no rebuild reconciliation. The canvas-fidelity persona at `.claude/agents/reviewer-canvas-fidelity.md` stays in the rig but does NOT fire on prototype slices unless they explicitly opt in (see Linked canvas: field convention below).

**Slice convention for canvas-as-source:** `acceptance.md` does NOT carry the `Linked canvas:` field (so canvas-fidelity stays dormant per CLAUDE.md §"Hard controls"). Per-AC evidence cites the source canvas path inline without verbatim quoting requirements. `**Category:** prototype` declared as usual.

**Cross-canvas reconciliation (deferred per-instance to user).** Two concerns surface when more than one canvas variant exists for the same surface (e.g., mobile + desktop graceful enhancement; v1 + v2):

- **Variant reconciliation** — which canvas wins for the build, or do both ship under a responsive switch? Decision is per-screen at scoping time.
- **Mobile-to-desktop responsiveness** — canvases ship for specific viewports; intermediate breakpoints are not wired in the canvases themselves. Reconcile at preview-deploy feedback time, not at build time.

**When canvas-as-source isn't enough.** Three cases promote a prototype screen to preserve-and-rebuild (below): cross-screen design-system extraction work · multi-author production hand-off · graceful-enhancement responsive variants requiring abstracted typography/layout primitives.

### Preserve-and-rebuild (Phase C+ production)

Phase C deliverables under `src/app/**` (outside the proto namespace) use the heavier pattern: extract design tokens + components from canvases per spec 70's Build Map (Anchor / Derived / Variant / Re-use / Preserve-with-reskin / Known-unknown tagging), audit drift via canvas-fidelity persona at PR review, lock per-AC verbatim canvas quotes via the AC-as-canvas-quote discipline.

**Anchor components:** catalogued in `docs/workspace-spec/68g-visual-anchors.md` (C-V1 through C-V14) — the Phase C extraction shortlist. Includes phase colour system, welcome-carousel shell, stepper, keyboard affordance, demo cards per phase, dashboard components (5-phase stepper, task taxonomy chips, task rows, connected-data-source card, bank picker, trust band, locked-section treatment, accent-tint washes, time-estimate affordance).

**Extraction sequence:** Phase B (Build Map) tags each component per phase with Anchor / Derived / Variant / Re-use / Preserve-with-reskin / Known-unknown. Phase C Step 1 extracts from the Claude AI Design outputs, builds the design system foundation, ships the first deployable slice.

**Token inheritance:** Spec 18 tokens (spacing, typography, shadows) remain valid only where the Claude AI Design outputs have not superseded them. Colour palette + component designs come from Claude AI Design outputs exclusively.

**AC-as-canvas-quote (per S-INFRA-canvas-fidelity-gate).** Every UI AC for a Phase C+ slice that names a `Linked canvas:` field must quote the canvas verbatim with `file:line` refs for any visual-treatment claim. Same discipline as §"Planning conduct" §"Quote, don't paraphrase" — extended to UI ACs. Worked example for an O2 title-typography AC:

> *"H1: serif 26px lh 1.05 letterSpacing -0.02em fw 600. Pattern: `Your <span italic 400>situation</span>.` (canvas: `docs/design-source/pre-signup-interview/jsx/o2-frames.jsx` L171-172, verbatim)"*

When the AC quotes the canvas line, the build can't ignore it; the canvas-fidelity gate (Hard controls table row) flags drift at PR review. Slice authors discover treatment-level claims at AC-freeze time, not after deploy.

**Linked canvas: field convention.** Phase C+ slices (or prototype slices explicitly opting in) that ship UI surface against canonical canvases declare canvas paths via `**Linked canvas:** <path1>, <path2>, ...` in `acceptance.md` immediately after the slice header. Comma-separated; paths may contain spaces but must not contain commas (the field's only delimiter); paths are consumed verbatim. Single canvas = one-element list (e.g. `**Linked canvas:** path/foo.html`). Multi-canvas is the default for slices spanning multiple screens — large per-screen files concatenated under per-canvas `--- BEGIN/END <path> NONCE ---` delimiters fit within Anthropic API request limits where a single combined-canvas file (10MB+ inline-styled HTML) does not. Field-absent slices (including all prototype slices using canvas-as-source by default) skip the canvas-fidelity dimension. Detection regex (auto-review.yml + persona harness): `^\*\*Linked canvas:\*\*[[:space:]]+`.

## Product rules

- **"A warm hand on a cold day"** — compassionate, professional, never patronising
- **Every question must map to a Form E field** — if the answer doesn't fill a disclosure value, don't ask it
- **One thing at a time** — one question per screen, one decision per moment
- **Connect-first, confirm-by-exception** — bank data does 70%, user confirms the rest, uploads 3-4 specific gap documents
- **Show, don't ask** — never ask a cold-start question when a bank signal exists. Show what was found, ask for confirmation.
- **Delight matters** — transitions, animations, and micro-interactions are not optional. See spec 26.
