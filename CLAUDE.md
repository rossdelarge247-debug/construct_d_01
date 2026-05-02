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
.github/PULL_REQUEST_TEMPLATE.md                    — 6-item DoD + 13-item security checklist on every PR (session 27 P0.4)

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

**Path options carry spec refs.** When offering A / B / C alternatives, each option must name which spec justifies it or conflicts with it. Prevents abstract-tradeoff reasoning from sneaking in.

**Distrust your own summaries.** A summary compressed earlier in the session is navigation, not source. When a decision is load-bearing, go back to the spec itself — even if the summary "feels" right. Heavy context makes skim-recall tempting; resist it.

**Read discipline.** Enforced by `.claude/hooks/read-cap.sh` (PreToolUse on Read): blocks full-file Reads of >400-line files without offset+limit, and blocks Reads that would push this turn's total past 300 lines. Deny messages quote the rule and suggest offset/limit or grep-first alternatives. Habits the hook doesn't catch — `grep` / `ls` / `wc -l` before committing to a Read, announcing expected combined size before a parallel batch — remain in you.

**Branch-resume check.** Enforced by `.claude/hooks/session-start.sh` (SessionStart): at turn 0, when the current branch matches the harness suffix pattern `^claude/.+-[A-Za-z0-9]{5}$` AND the non-suffixed canonical branch exists on origin, the context block surfaces a `### Branch-resume check` section with the literal `git fetch / git checkout -B / git branch -D` resync recipe. The hook auto-detects; the discipline is to act on the warning rather than dismiss it. Sessions 33 + 34 each landed on a suffixed orphan when canonical work was on the non-suffixed branch — both lost ~5 minutes to manual `mcp__github__list_branches` diagnosis before the hook existed.

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

**Snapshot before refactor.** Any refactor over ~50 lines or touching more than 2 files: commit a checkpoint on the branch first. Cheap rollback insurance, explicit before/after diff when reviewing. Mirrors the [Mikado method](https://understandlegacycode.com/blog/a-process-to-do-safe-changes-in-a-complex-codebase/) prepare-and-revert-on-failure discipline — scoped here to single-PR refactors rather than legacy-system overhauls.

**100% rule (AC arithmetic).** When slicing AC against an audit-catalogue or numbered list, verify `Σ in-scope rows = total rows` before freezing. Catches scope omissions and off-by-one errors that hide behind narrative AC text. Per the [PMI WBS 100% rule](https://www.workbreakdownstructure.com/100-percent-rule-work-breakdown-structure) — every WBS element accounts for 100% of the work, not 90%, not 110%; AC slicing inherits the same constraint.

**Deterministic over generative.** For repetitive scaffolding (new slice folder, codegen, boilerplate, branch setup), prefer bash/CLI over prompting Claude. Reserve Claude for reasoning tasks. Extends the "prefer dedicated tools over Bash when one fits" rule — the inverse is also true when deterministic is cheaper.

**Definition of Done (per slice).** A slice ships only when all six are true:
1. All acceptance criteria met, with evidence per AC in `verification.md` (final-state record assembled at slice ship; round-by-round multi-agent audit detail belongs in HANDOFF or PR description, not in `verification.md` itself — append-as-you-go creates internal-consistency findings round-over-round)
2. Tests written and passing (unit + integration + visual as applicable)
3. Adversarial review done; concerns addressed or explicitly deferred
4. Preview deploy verified in-browser if UI (golden path + edge cases + prefers-reduced-motion)
5. No regression in adjacent slices (smoke check + automated tests across the slice's affected surfaces)
6. Slice's open 68f/g entries resolved or explicitly deferred with reasoning in slice wrap

Plus the 13-item security checklist in spec 72 §11. No exceptions. A partially-done slice is not shipped; it's re-scoped and re-planned.

Enforcement: `.github/PULL_REQUEST_TEMPLATE.md` reproduces this checklist; `.github/workflows/pr-dod.yml` fails any PR that touches `src/` without a `docs/slices/S-*/verification.md` reference in the body (escape hatch: `no-slice-required` label for truly trivial src/ touches).

## Hard controls (in development)

**Status:** in development. This stub catalogues gates landed by `S-INFRA-rigour-v3a-foundation` only. v3b adds the adversarial subagent suite; v3c rewrites this section as a consolidating reference. Canonical source for AC text + rationale is `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md`.

### Gates this slice ships

| Gate | File(s) | Fires on | AC | Bypass |
|---|---|---|---|---|
| CODEOWNERS code-owner review | `.github/CODEOWNERS` + GitHub branch-protection (`required_pull_request_reviews.require_code_owner_reviews=true`) | every PR touching CODEOWNERS-listed paths; enforces via GitHub Reviewers panel | v3c P0b-structural AC-1 | conscious admin-bypass click ("Merge without waiting for required review") in solo-operator context (sole code-owner = PR author; GitHub hard rule prevents self-approval); rigour gate = auto-review.yml + admin-click-as-conscious-act |
| ESLint zero-new-disables (count ratchet) | `scripts/eslint-no-disable.sh` + `.github/workflows/eslint-no-disable.yml` | every push + PR | AC-3 | ship via CODEOWNERS admin-bypass |
| ESLint function-size + max-lines | `eslint.config.mjs` | `npm run lint` + CI `Lint` job | AC-3 | edit thresholds under `control-change` label (full origin/main-anchored ratchet lands v3c per F5c) |
| Coverage threshold ratchet | `scripts/coverage-threshold-ratchet.sh` + `.github/workflows/coverage-threshold.yml` | every push + PR | AC-3 | ship via CODEOWNERS admin-bypass |
| Plan-time review | `.claude/hooks/exit-plan-review.sh` + `.claude/subagent-prompts/exit-plan-review.md` + `scripts/git-state-verifier.sh` | `ExitPlanMode` (PreToolUse) | AC-7 | address findings + re-attempt; full subagent default-spawn deferred to v3b |
| Slice-verification PR-body | `.github/workflows/pr-dod.yml` | every PR touching `src/` | pre-S-37 (P0.4) | reference slice's `verification.md` in body, or apply `no-slice-required` label |
| Auto-review on PR (multi-agent · 4 specialists) | `.claude/agents/reviewer-{security,architecture,correctness,style}.md` + `scripts/spawn-multi-reviewer.sh` + `.github/workflows/auto-review.yml` | `pull_request:opened/synchronize` | v3b AC-1 + S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate (session 52) + S-INFRA-persona-suite-v2-multi-agent AC-1 + AC-5 (session 55) + spec 72c §5 default flip (session 56) | partially merge-gating: `block` (≥`k_block`=2 specialist votes on a blocking finding at `k=2` default per spec 72c §5 session-56 amendment; opt-in `k=1` first-fault-blocks via explicit `--multi k=1`) + `parse-failed` (all 4 specialists unparseable) + pipeline-crash → `failure` (the rigour-malfunction paths gate the merge); `request-changes` + `nit-only` → `neutral` (advisory only); `approve` → `success`; skip on missing `ANTHROPIC_API_KEY` → `neutral` (forks unaffected); degraded mode (≥1 specialist inconclusive but ≥1 present) reports verdict + `inconclusive_dimensions` warning per spec 72c §3 (no fallback to single-agent re-run; `slice-reviewer.md` retired session 55) |
| Author-time comment review | `.claude/hooks/comment-review.sh` + `.claude/agents/reviewer-comment.md` | PostToolUse:Write\|Edit (advisory) | S-INFRA-reviewer-comment AC-1+2 | advisory-only — no formal bypass; stub-mode default emits `systemMessage` on flagged anti-patterns; live-mode (`COMMENT_REVIEW_SPAWN=1`) opt-in spawns persona via `claude -p`; both modes exit 0 always |

Each gate emits a useful-message exit body on failure: what failed, why per spec, concrete remediation.

The author-time comment-review hook surfaces; PR-time `reviewer-style.md` `commenting`-category findings block. The hook runs the four regex-tractable catalogue items at L215-220 (provenance · sibling-step · lineage · historical-count); WHAT-narration is non-tractable in stub mode and only checked when live mode is enabled. Skip-list at the hook covers `.claude/agents/**`, `.claude/subagent-prompts/**`, `tests/shellspec/**`, `tests/**/fixtures/**`, structural data formats (`*.json`, `*.yaml`, `*.lock`), and binaries.

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

v3b persona shipments land under `.claude/agents/`: PR-review fan-out via 4 specialists at `reviewer-{security,architecture,correctness,style}.md` (per S-INFRA-persona-suite-v2-multi-agent AC-2; `slice-reviewer.md` retired atomically with the workflow flip at session 55 per AC-5); slice-completion AC verifier `acceptance-gate.md` and UI-surface review `ux-polish-reviewer.md` are unchanged orthogonal personas. v3a's `exit-plan-review.md` stays under `.claude/subagent-prompts/` — it's a hook-spawned template, not a session-spawned persona.

**Invocation conventions** (per v3b S-6 ship; AC-1/2/3):

- **`reviewer-{security,architecture,correctness,style}.md` (S-INFRA-persona-suite-v2-multi-agent AC-1 + AC-2)** — auto-spawned by `.github/workflows/auto-review.yml` on `pull_request:opened/synchronize` under matrix strategy (4 parallel specialist runners per spec 72c §3). Each specialist receives the same per-invocation inputs (PR diff + linked slice `acceptance.md` via PR-body path or `claude/S-XX-...` branch heuristic + CLAUDE.md §"Coding conduct") composed inline by the workflow's `brief` job; specialists fan out under `specialist` matrix job; aggregator job `aggregate` runs `scripts/spawn-multi-reviewer.sh aggregate /tmp/envelopes` to dedupe findings (SHA-256-equivalent over `label|category|first-64-chars-evidence` per spec 72c §5 rule 2; preserves `seen_by[]`) and derive verdict via `scripts/derive-verdict.sh --multi k=2` (default post session-56 amendment; shadow `would_have_been_k1` / `_k3` emitted alongside per spec 72c §5; opt-in `k=1` first-fault-blocks via explicit flag override). Verdict posts as a single unified check-run + PR comment. Degraded mode (≥1 specialist inconclusive) is the failure response per spec 72c §3 — no fallback to a single-agent re-run; `slice-reviewer.md` is retired (session 55). Specialists may also be spawned manually via the `Agent` tool for ad-hoc review of an in-progress diff (one-at-a-time; aggregator only matters for the workflow path).
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

Per `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md` L201:

> if v3a infrastructure causes operational pain post-merge, rollback is: (a) revert merge commit on main via `git revert -m 1 <merge-sha>` in a new PR carrying the `control-change` label; (b) `.claude/hooks/{pre-commit-verify,tdd-first-every-commit,exit-plan-review}.sh` remain on disk locally but become inert because their `settings.json` registration is reverted; (c) `hooks-checksums.txt` is reverted; (d) the revert PR documents WHY in body so v3a-2 can address the root cause. **No `--no-verify` bypass needed** — harness-level hooks don't intercept `git revert` of unregistered settings.

### Not yet in scope (v3b / v3c carry-over)

Canonical sources: `docs/HANDOFF-SESSION-55.md` §"v3c carry-overs" + spec 72c §9 §"Out of scope" + `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md`. Ranked picks for the next session live in the most recent HANDOFF §"Next session priorities".

**Review-flow completion:**
- During-work review subagents — commit-msg accuracy, spec-quote enforcement, AskUserQuestion framing, periodic on-track audit, doc-honesty
- Pair-programming PostToolUse hook with intent file + finding-response loop
- Plan-review subagent default-spawn flip — currently `EXIT_PLAN_REVIEW_SPAWN=1`-gated

**Drift / regression detection:**
- Synthetic-deliberate-injection per-persona fixtures — deferred to v3c per spec 72c §7; gated on first-3-src-slice retain/drop confirming the 4-partition holds. Catches per-persona regressions that golden-replay alone can't isolate.
- Live persona drift detection — quarterly cron re-invocation against golden seeds (recurring API budget; spec 72c §9)

**External integrations:**
- Multi-provider 3rd-agent reviewer (GPT/Gemini for cross-provider diversity; spec 72c §"Out of scope")
- Stryker mutation testing on persona prompts

**Other:**
- Structured-findings JSON Schema validation (spec 72c §9)

## Visual direction

**Canonical source:** the Claude AI Design tool outputs from session 22 wire batches. Exact visual treatment — colour system, typography, component design, screen layouts — to preserve and rebuild. Copy in the outputs is NOT final; visual treatment IS.

**Source files repo-committed, not URL-fetched.** Claude AI Design outputs must live at `docs/design-source/{slug}/`. The Anthropic-hosted URLs are auth-gated and unreachable from the agent sandbox; WebFetch on them returns nothing useful.

**Not reference points:** Airbnb, Emma, Habito. Legacy in-house visual language (spec 18 colour palette, spec 27 visual direction) is superseded.

**Anchor components:** catalogued in `docs/workspace-spec/68g-visual-anchors.md` (C-V1 through C-V14) — the Phase C extraction shortlist. Includes phase colour system, welcome-carousel shell, stepper, keyboard affordance, demo cards per phase, dashboard components (5-phase stepper, task taxonomy chips, task rows, connected-data-source card, bank picker, trust band, locked-section treatment, accent-tint washes, time-estimate affordance).

**Extraction sequence:** Phase B (Build Map) tags each component per phase with Anchor / Derived / Variant / Re-use / Preserve-with-reskin / Known-unknown. Phase C Step 1 extracts from the Claude AI Design outputs, builds the design system foundation, ships the first deployable slice.

**Token inheritance:** Spec 18 tokens (spacing, typography, shadows) remain valid only where the Claude AI Design outputs have not superseded them. Colour palette + component designs come from Claude AI Design outputs exclusively.

## Product rules

- **"A warm hand on a cold day"** — compassionate, professional, never patronising
- **Every question must map to a Form E field** — if the answer doesn't fill a disclosure value, don't ask it
- **One thing at a time** — one question per screen, one decision per moment
- **Connect-first, confirm-by-exception** — bank data does 70%, user confirms the rest, uploads 3-4 specific gap documents
- **Show, don't ask** — never ask a cold-start question when a bank signal exists. Show what was found, ask for confirmation.
- **Delight matters** — transitions, animations, and micro-interactions are not optional. See spec 26.
