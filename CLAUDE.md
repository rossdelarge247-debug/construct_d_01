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

1. **Verify your working branch.** The canonical branch name is in `docs/SESSION-CONTEXT.md` (or your task description). If the harness landed you on a different base, resync before doing anything else — `git fetch origin <branch>` then `git checkout -B <branch> origin/<branch>`. Session 22→23 hit this exact snag; don't build on a stale base.

2. **Read `docs/SESSION-CONTEXT.md`** — this is the rolling context block. It contains: product vision, principles, what the last session accomplished, current state of the codebase, prioritised deliverables for this session, negative constraints (things NOT to do), and key file paths. Always read this before doing anything else.

3. **Confirm with the user** what they'd like to focus on. The SESSION-CONTEXT.md has suggested deliverables but the user may have different priorities.

## Session discipline

### Track your progress actively

- After every file edit, maintain a **running count of net lines added/modified**.
- Use the TodoWrite tool to track tasks. Mark each done as you complete it.
- At **~1,500 lines changed**, proactively tell the user: "Approaching session scope limit (~1,500 lines). Recommend wrapping up soon."
- At **~2,000 lines changed**, **stop writing code**. Tell the user you need to wrap up.

### Context window freshness

- Keep responses concise. Don't repeat large blocks of code back to the user.
- When context is getting long, summarise what you've done so far rather than re-reading files you've already read.
- If you notice the conversation is very long, proactively suggest: "We've covered a lot of ground. Want me to generate the handoff and start a fresh session?"

### Wrapping up a session

When the session is ending (user says wrap up, or you hit ~2,000 lines), do these in order:

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
docs/workspace-spec/71-rebuild-strategy.md          — Folder structure, stable-lib paths, S-F7 dev-mode, staged removal, Phase C sequencing, Phase-C-freeze topology
docs/workspace-spec/72-engineering-security.md      — Engineering security principles (data classification, env vars, auth/session, RLS, validation, logging, dev/prod boundary, third-party, safeguarding, pen-test readiness, per-slice security DoD)
docs/engineering-phase-candidates.md                — Parked CLAUDE.md additions for Phase C kickoff (Karpathy coding conduct, engineering conventions, per-slice AC + test plan templates)

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

## Coding conduct

These rules govern how Claude behaves when editing `src/`. Guardrails against over-engineering, silent decisions, and scope creep. Complementary to Product rules and Technical rules — doesn't replace either.

**Think before coding.** Surface confusion; name uncertainty. When more than one interpretation is possible, present both rather than silent-deciding. Mention simpler approaches and push back when appropriate. Stop and ask if a request is ambiguous — don't proceed on assumptions.

**Simplicity first.** Minimum code that solves the problem. No unrequested features, no speculative abstractions, no "configurability" unless asked, no error handling for scenarios that can't happen. If 200 lines could be 50, rewrite. Senior-engineer test: would they say this is overcomplicated?

**Surgical changes.** Touch only what the task requires. Don't improve adjacent code, don't refactor functioning code, don't reformat. Match existing style. If you notice unrelated dead code, mention it — don't delete it. Every changed line should trace directly to the requested task.

**Goal-driven execution.** Convert each task into verifiable success criteria before writing code. Test-first where tractable. Strong criteria enable independent looping; weak criteria require re-clarification and slow velocity.

## Engineering conventions

**TDD where tractable.** Write the test first, then the code to pass it. Applies to logic, rules, data transforms, API routes, signal/engine work. Not mandatory for pure-visual UI (visual regression covers that), but preferred wherever state or branching logic exists.

**Adversarial review gate (per slice).** Before committing any slice or significant change, run one adversarial review pass. Two options: (1) explicit prompt — "poke holes in this; find edge cases, security issues, regression risks"; (2) `/review` or `/security-review` skill. Output is a list of concerns. Either address or explicitly defer with reasoning. No slice ships without this gate.

**Snapshot before refactor.** Any refactor over ~50 lines or touching more than 2 files: commit a checkpoint on the branch first. Cheap rollback insurance, explicit before/after diff when reviewing.

**Deterministic over generative.** For repetitive scaffolding (new slice folder, codegen, boilerplate, branch setup), prefer bash/CLI over prompting Claude. Reserve Claude for reasoning tasks. Extends the "prefer dedicated tools over Bash when one fits" rule — the inverse is also true when deterministic is cheaper.

**Definition of Done (per slice).** A slice ships only when all six are true:
1. All acceptance criteria met, with evidence per AC
2. Tests written and passing (unit + integration + visual as applicable)
3. Adversarial review done; concerns addressed or explicitly deferred
4. Preview deploy verified in-browser if UI (golden path + edge cases + prefers-reduced-motion)
5. No regression in adjacent slices (smoke check + automated tests across the slice's affected surfaces)
6. Slice's open 68f/g entries resolved or explicitly deferred with reasoning in slice wrap

Plus the 13-item security checklist in spec 72 §11. No exceptions. A partially-done slice is not shipped; it's re-scoped and re-planned.

## Visual direction

**Canonical source:** the Claude AI Design tool outputs from session 22 wire batches. Exact visual treatment — colour system, typography, component design, screen layouts — to preserve and rebuild. Copy in the outputs is NOT final; visual treatment IS.

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
