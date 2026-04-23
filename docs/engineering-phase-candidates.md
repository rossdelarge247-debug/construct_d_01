# Engineering-phase CLAUDE.md candidates

**Status:** PARKED. Apply at Phase C kickoff (first code-touching session on `src/`), not before. Review order before applying; reject anything that no longer fits.
**Source session:** 23 pre-work B.
**Related:** CLAUDE.md (target for additions), docs/SESSION-CONTEXT.md (rewrite entry point for Phase C session), spec 70 Build Map suite (where slice setup will happen).

---

## Purpose

Capture engineering-phase additions to `CLAUDE.md` and supporting patterns so they're ready to apply at Phase C kickoff without re-thinking. Reviewed against Karpathy's minimalist CLAUDE.md + the Medium/Reddit "4-phase Claude Code workflow" literature + our existing session discipline. Only additions that raise the quality ceiling made it in. Rejected candidates are called out explicitly with reasoning to prevent re-litigating.

## What we reviewed

- **Karpathy's CLAUDE.md** (https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md) — four coding-conduct principles: Think before coding, Simplicity first, Surgical changes, Goal-driven execution. Minimalist, opinionated, orthogonal to our product-level CLAUDE.md.
- **Medium "I mastered the Claude Code workflow"** (the article the images summarise) — 4-phase ritual (Research→Plan→Implement→Validate), 60% context cap, `.claude/agents/` directory, 4-agent architecture naming, `plan.md` as permanent memory.
- **Secondary sources** (Reddit ClaudeCode plan-mode-handoff, ClaudeAI run-sessions-like-youre, ranthebuilder best-practices, fastcompany, mcpmarket backlog-manager tools) — pattern-overlap with the Medium article, skimmed not fetched individually.
- **Our existing discipline** — CLAUDE.md (positioning + rules + info tiers + session startup + wrap protocol), SESSION-CONTEXT.md (rolling context block), HANDOFF-SESSION-{N}.md (retros), spec 70 Build Map suite (research + roadmap + slice catalogue), MLP floor, north star quality bar.

The Karpathy file is orthogonal (coding conduct); the Medium workflow is largely either redundant with what we have, or ritual without mechanical value, or actively harmful to our session-continuity model. Filtering below.

## A. New CLAUDE.md section — Coding conduct ✅ applied (session 24)

Lift the Karpathy principles near-verbatim. These are guardrails against Claude over-engineering, silent-deciding, or scope-creeping inside `src/`. Complementary to our existing Product rules and Technical rules — doesn't replace either.

Insert after `## Technical rules` and before `## Visual direction`:

```markdown
## Coding conduct

These rules govern how Claude behaves when editing `src/`. Guardrails against over-engineering, silent decisions, and scope creep.

**Think before coding.** Surface confusion; name uncertainty. When more than one interpretation is possible, present both rather than silent-deciding. Mention simpler approaches and push back when appropriate. Stop and ask if a request is ambiguous — don't proceed on assumptions.

**Simplicity first.** Minimum code that solves the problem. No unrequested features, no speculative abstractions, no "configurability" unless asked, no error handling for scenarios that can't happen. If 200 lines could be 50, rewrite. Senior-engineer test: would they say this is overcomplicated?

**Surgical changes.** Touch only what the task requires. Don't improve adjacent code, don't refactor functioning code, don't reformat. Match existing style. If you notice unrelated dead code, mention it — don't delete it. Every changed line should trace directly to the requested task.

**Goal-driven execution.** Convert each task into verifiable success criteria before writing code. Test-first where tractable. Strong criteria enable independent looping; weak criteria require re-clarification and slow velocity.
```

~20 lines added to CLAUDE.md. No conflict with existing sections.

## B. New CLAUDE.md section — Engineering conventions ✅ applied (session 24)

Operational rules that turn conventions into mechanical gates. Insert after the new Coding conduct section.

```markdown
## Engineering conventions

**TDD where tractable.** Write the test first, then the code to pass it. Applies to logic, rules, data transforms, API routes, signal/engine work. Not mandatory for pure-visual UI (visual regression covers that), but preferred wherever state or branching logic exists.

**Adversarial review gate (per slice).** Before committing any slice or significant change, run one adversarial review pass. Two options: (1) explicit prompt — "poke holes in this; find edge cases, security issues, regression risks"; (2) `/review` or `/security-review` skill. Output is a list of concerns. Either address or explicitly defer with reasoning. No slice ships without this gate.

**Snapshot before refactor.** Any refactor over ~50 lines or touching more than 2 files: commit a checkpoint on the branch first. Cheap rollback insurance, explicit before/after diff when reviewing.

**Deterministic over generative.** For repetitive scaffolding (new slice folder, codegen, boilerplate, branch setup), prefer bash/CLI over prompting Claude. Reserve Claude for reasoning tasks. Extends the existing "prefer dedicated tools over Bash when one fits" rule — the inverse is also true when deterministic is cheaper.

**Definition of Done (per slice).** A slice ships only when all six are true:
1. All acceptance criteria met, with evidence per AC
2. Tests written and passing (unit + integration + visual as applicable)
3. Adversarial review done; concerns addressed or explicitly deferred
4. Preview deploy verified in-browser if UI (golden path + edge cases + prefers-reduced-motion)
5. No regression in adjacent slices (smoke check + automated tests across the slice's affected surfaces)
6. Slice's open 68f/g entries resolved or explicitly deferred with reasoning in slice wrap

No exceptions. A partially-done slice is not shipped; it's re-scoped and re-planned.
```

~25 lines. Final three conventions (snapshot, deterministic, DoD) can tighten if too prescriptive in practice — review after first 2 slices ship.

## C. Per-slice acceptance criteria template

Produced at slice setup (not in the Build Map — the Map stays complete, scope lives in slice setup). Storage convention: `docs/slices/S-XX-{name}/acceptance.md` — one folder per slice, survives across sessions, cross-references from spec 70 slice index.

Template per AC item:

```markdown
### AC-N · [short name]

- **Outcome:** [one sentence, user-visible]
- **Verification:** [exact observable behaviour or test that confirms it — no ambiguity]
- **In scope:** [what this AC does cover]
- **Out of scope:** [what it explicitly does not — pushes to a later AC or future slice]
- **Opens blocked:** [any 68f/g entries this AC cannot be met without resolving — list IDs]
- **Loveable check:** [one sentence: does meeting this AC make the user feel delighted or merely served? If merely served, re-draft the AC.]
```

**Quantity guidance:** minimum 3 AC per slice; ideally 5-7. More than 10 = slice is too big; reconsider the cut.

**Review:** acceptance doc is reviewed by user before slice implementation starts. Change requests roll into re-drafting AC, not into mid-slice scope shifts.

**MLP floor check:** every slice's AC set, taken together, should satisfy "the loveable version of this slice." Cuts happen by deferring specific AC to a later slice (re-slicing), not by shipping a slice with lukewarm AC met.

## D. Per-slice test plan template

One test per AC at minimum. Storage: `docs/slices/S-XX-{name}/test-plan.md` alongside the AC doc.

Template per test:

```markdown
### T-N · [references AC-N]

- **Given:** [initial state — user role, data seeded, feature flags]
- **When:** [action — user interaction, API call, event]
- **Then:** [observable outcome exactly matching AC-N verification]
- **Type:** unit / integration / E2E / visual regression / manual
- **Automated:** yes/no · **If manual:** reason (e.g. visual-only, accessibility sweep, Tink-sandbox round-trip)
- **Fixture:** [test scenario or synthetic data source — prefer `src/lib/bank/test-scenarios.ts` for bank flows]
```

**Manual tests allowed but flagged.** Claude Code must execute manual tests in-browser on the preview deploy before declaring a slice done per DoD item 4. Manual test list is part of the slice's DoD evidence.

**Visual regression placeholder.** Until we pick a tool (Chromatic / Playwright screenshots / Storybook), manual visual check against Claude AI Design source is the gate. Decide at Phase C kickoff — see G below.

**Test framework.** `vitest` already in the repo per `package.json`. Confirm still current and standardise. Integration / E2E tool choice deferred to Phase C kickoff.

## E. Experiment — .claude/agents/ sub-agent prompts

Thin formalisation of patterns we already use via Claude Code's Agent tool (Explore, Plan, general-purpose, code-reviewer). Canonicalising specific review personas into `.claude/agents/*.md` gives them a stable prompt that doesn't drift session-to-session.

**Try for first 2-3 slices, retain only if they catch real issues.**

Candidate sub-agents:

- `.claude/agents/slice-reviewer.md` — adversarial pre-commit review persona. Takes a slice diff + AC doc + test plan. Outputs: edge cases missed, security concerns, regression risks, AC gaps, scope creep within the diff.
- `.claude/agents/acceptance-gate.md` — runs through the slice's AC list, verifies evidence per AC (test result, screenshot, preview deploy URL), outputs pass/fail per AC with specific gap if fail.
- `.claude/agents/ux-polish-reviewer.md` — micro-interaction, animation, prefers-reduced-motion, keyboard-only, screen-reader sanity. North star demands polish; this agent's job is to catch where it's missing.

**Retain criteria:** if the agent catches at least one issue the main conversation missed per 2-3 slices, retain. Otherwise drop — added friction without value.

**Storage:** repo-level `.claude/agents/` (committed, travels with the project). Not user-home (`~/.claude/`) — those are personal and don't version with the codebase.

**Re-evaluate after first 3 slices.** Record the retention/drop decision in that session's handoff.

## F. Rejected — do NOT adopt

Called out explicitly with reasoning to prevent re-litigation when these resurface. Each rejection is defensible on our specific shape-of-work, not dogma — if evidence changes, re-open with the new data.

**4-phase ritual per feature (Research → Plan → Implement → Validate, each with own `.md`).**
Reason: Research is already done at Phase B (spec 70 Build Map IS research). Plan is already in spec 70 slice files + slice setup docs (C + D above). Implement + Validate are the engineering work itself, already covered by DoD. Adding parallel `research.md` + `plan.md` + `notes.md` per slice duplicates source of truth. File sprawl, dual canonical docs, no added signal. Our existing flow (spec 70 → slice setup → implementation → wrap retro) already IS the 4-phase equivalent; ritual on top dilutes it.

**"4-Agent Architecture" labelling (Human Brain / Architect / Executor / Validator).**
Reason: post-hoc pattern-naming for what every non-trivial task already does (plan → execute → check). No mechanical enforcement — just labels. Ritual without benefit, risk of cargo-culting. Keep the underlying practice; skip the named roles. The sub-agents experiment (E) is different — those are actual prompt files with mechanical enforcement, not labels.

**Mandatory `plan.md` at repo root.**
Reason: duplicates `docs/SESSION-CONTEXT.md`. Two canonical "where are we" docs drift. Our SESSION-CONTEXT.md already serves as the rolling plan + state + priorities + branch. Skip the second file.

**60% context cap with mid-session clear-and-restart.**
Reason: actively breaks our session-continuity model. Our sessions are coherent design arcs (~1,500-2,000 lines changed, 3-6 hours of work). Mid-session wipe-and-restart would lose the reconciliation thread we rely on. The Medium/Reddit workflow is written for ticket-sized tasks (~1 hour, one feature), not our shape. Our existing line-count discipline (1,500 warn / 2,000 stop) + explicit wrap protocol is the right model for our work shape. If individual engineering sessions end up shorter (likely once Phase C is steady-state), revisit — a 60% context cap might become appropriate for single-slice sessions.

**Backlog/project MCP tools (mcpmarket product-backlog-manager, project-backlog-manager).**
Reason: spec 70 slice index is already the backlog — version-controlled, grep-able, survives context wipes, integrated with our handoff model. Adding an MCP tool would either duplicate or replace it, both with drift risk and no visible upside. The value of markdown-as-backlog in this repo is precisely that it's inspectable without tools.

**`/snapshot` command as a distinct concept from `git`.**
Reason: the Medium article treats `/snapshot` as a special ritual. `git` already does this — a pre-refactor commit with a clear message is a snapshot. Convention B already captures the discipline ("commit a checkpoint on the branch first"); no need to invent a new word for what `git commit` already does.

## G. Open questions for Phase C kickoff

These need decision before first slice ships, not before first slice starts.

1. **Slice docs location.** `docs/slices/S-XX-{name}/` flat vs nested under a `docs/slices/active|shipped/` structure. Lean: flat until we have >5 shipped, then introduce `archive/`.
2. **Visual regression tool.** Playwright screenshots vs Chromatic vs Storybook visual tests vs manual-only V1. Constraint: real Tink data can't be in fixtures (PII) — synthetic scenarios from `src/lib/bank/test-scenarios.ts` are the test surface. Lean: manual-only V1 with explicit in-browser sign-off against Claude AI Design source; automate at V1.5 when cadence demands it.
3. **Integration / E2E test framework.** Playwright most likely (React 19 + Next 16 compatible, supports Tink iframe flows). Confirm at Phase C kickoff; `vitest` remains for unit + logic tests.
4. **`.claude/agents/` location.** Repo-committed per E above. Confirm no conflict with existing Claude Code agent conventions when we actually create the files.
5. **Preview deploy protocol.** Vercel preview per branch already set up. DoD item 4 requires in-browser verification — define the exact checklist (golden path, edge cases, prefers-reduced-motion, keyboard-only, mobile viewport) and where it's recorded per slice (lean: `docs/slices/S-XX/verification.md`).
6. **AC doc reviewer.** Does the user review every slice's AC doc before implementation, or only for the first 3-5 slices until the pattern stabilises? Lean: every slice — AC is the contract and deserves user sign-off.
7. **Definition of "adjacent slices" for DoD regression check.** Not every slice affects every other; we need the dependency graph from spec 70 + shipped-slices registry to scope regression testing. Lean: any slice that shares a component/library with the current slice is in-scope for smoke check.
8. **TDD bail-out criteria.** When is TDD not tractable and explicit-manual-test-after-code acceptable? Lean: pure-visual UI, visual-regression-only covered surfaces. Everything else: test first.

## Maintenance

When any candidate is applied: move it out of this file into its target location (CLAUDE.md section, slice template, etc.) and flip the header here to ✅ applied. When a rejected candidate resurfaces in a future session, check this file first — the reasoning may still hold, or evidence may warrant a re-open.
