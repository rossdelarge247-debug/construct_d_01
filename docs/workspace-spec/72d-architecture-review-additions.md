# 72d — Architecture review additions (B+C+D)

**Status:** SPEC LANDED (session 72). Programme: pre-implementation rigour additions complementing spec 72c's post-PR multi-agent suite. Three contracts — **B fitness functions** · **C plan-architect persona** · **D test-pain gate** — addressing the architecture-review gap acknowledged after session-70's `reviewer-architecture` drop.

**Adjacent specs:** spec 72c (post-PR multi-agent review) · spec 72 §7 (boundary enforcement) · spec 71 §4 (hexagonal reference shape) · CLAUDE.md §"Engineering conventions" + §"Coding conduct" §"Effects behind interfaces" + §"Hard controls" §"Subagent file locations" + §"Verdict vocabulary".

**Lineage.** Architecture-review gap surfaced session 71 (HANDOFF-71 §"Lessons" #2). Session 70 dropped `reviewer-architecture` from the multi-agent suite at 2/14 = 0.143 catch-rate (well below the CLAUDE.md 0.33 retain bar). The drop was data-driven and correct, but left a gap: post-PR architectural review is now distributed across `reviewer-correctness` (criterion 7 hidden-effects + criterion 2 architectural-severity per spec 72c §4 absorption) which is **unproven** on `src/` slices because session-70 + session-71 PRs were logic-spec doc work, not implementation. Three additions close the gap at three different lifecycle stages.

## §1 — Why these additions

The architecture-review gap is **lifecycle-staged**, not a single missing review. Three different moments need three different lenses:

1. **At plan time** (before any code is written) — what seams will this need? what hides effects? what coupling will we regret? → **C plan-architect persona**.
2. **At test-write time** (during TDD) — am I mocking the world to test this unit? if so, the seam is wrong. → **D test-pain gate**.
3. **At commit / CI time** (after code is written) — does the diff respect the hexagonal invariants from spec 71 §4? → **B fitness functions**.

Each is cheaper to address at its own lifecycle stage than to defer downstream. Pre-impl review (C) catches design defects at plan time, before code exists to refactor. Test-pain (D) surfaces seam smells at the moment they matter, when the alternative is to paper them over with another mock and create legacy. Fitness functions (B) provide the mechanical floor — the rules a `reviewer-architecture` specialist would have asserted, but as runnable assertions that fire on every PR without per-PR LLM cost.

The three are complementary, not redundant. C is judgement-driven (an LLM-spawned persona); D is judgement-driven (the author's own pain-signal during TDD); B is mechanical (deterministic assertions). Layering them at three lifecycle stages gives layered defence without double-counting any single stage.

## §2 — Three contracts at a glance

| Contract | Lifecycle stage | Mechanism | Cost per slice | Source rule |
|---|---|---|---|---|
| **D test-pain gate** | TDD (test-write time) | Author judgement; per-slice DoD-2 sub-check | Zero; pure discipline | CLAUDE.md §"Coding conduct" §"Effects behind interfaces" |
| **B fitness functions** | CI (post-code, pre-merge) | ESLint custom rules + `madge` (or `dependency-cruiser`) CI step | Zero per PR (CI-only) | Spec 71 §4 hexagonal reference shape + spec 72 §7 |
| **C plan-architect persona** | Plan-mode exit (pre-code) | LLM-spawned `.claude/agents/plan-architect.md`; extends `.claude/hooks/exit-plan-review.sh` | ~£0.10-0.30 per spawn | Spec 72c §4 specialist personas pattern + CLAUDE.md §"Hard controls" §"Subagent file locations" |

**Sequencing rationale:** D first (cheapest, accumulates pain-signal immediately), B second (mechanical, runs on every PR from then on), C last (most cost per spawn, benefits from B+D already running so the persona doesn't redundantly check what fitness functions enforce mechanically).

## §3 — D contract: test-pain gate

**Source rule.** CLAUDE.md §"Coding conduct" §"Effects behind interfaces" verbatim:

> *"Pure logic doesn't import side-effecty modules; effects (storage, network, time, randomness) live behind interfaces consumers can swap. **If a unit can't be tested without mocking the world, the seam is wrong.** Hexagonal-architecture style — see spec 71 §4 for the reference shape applied to S-F7."*

**Operationalisation.** Per-slice Definition of Done — DoD-2 ("Tests written and passing") gains a sub-check:

> **Test-pain audit.** If any unit test in this slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation. The pain is the signal. Address by extracting effects behind interfaces (per CLAUDE.md §"Coding conduct" §"Effects behind interfaces") OR explicitly defer with reasoning recorded in `verification.md` §"Architectural deferrals".

**Rule shape.** Judgement-driven, not automated. The author counts mock setups during TDD; >2 is the trigger. Three is not a hard ceiling — `vi.fn()` for a callback signature is not the same kind of mock as `vi.mock('@/lib/storage')` swapping a whole module. The author judges. The discipline is to **notice** the pain and react, not paper over it with another mock.

**Why not automated count?** A hard automated count incentivises gaming (split a test into two halves to dodge the trigger; rename a mock to a "stub"). Vitest doesn't ship a built-in mock-count assertion. Bespoke linting on test files would add maintenance burden for marginal value. Judgement at the per-slice DoD gate is sufficient at V1.

**Research grounding.**

- Beck, *Test-Driven Development by Example* — TDD as a design tool, not just a testing technique. Hard tests teach the seams.
- Freeman + Pryce, *Growing Object-Oriented Software, Guided by Tests* — mock-pain as a design signal. When mocks proliferate, the abstraction is wrong.
- Hillel Wayne, [*"I have complicated feelings about TDD"*](https://buttondown.com/hillelwayne/archive/i-have-complicated-feelings-about-tdd-8403/) — TDD is a calibration tool, not a universal mandate. Bail-out categories in CLAUDE.md §"Engineering conventions" §"TDD where tractable" reflect Wayne's framing.

**Out of scope at D ship.**

- Hard automated mock-count enforcement (judgement-only at V1; revisit if the qualitative signal proves unreliable across the first 5 src/ slices).
- Property-based fuzz coverage of seam swaps (carry-over per spec 72c §9 Stryker mutation testing).

**Shipped (Session 72 P1).** D contract operationalised. Touch points:

- CLAUDE.md §"Engineering conventions" — new named convention `**Test-pain audit (per spec 72d §3).**` (positioned adjacent to `**Architectural-smell trigger**` — early-warning during TDD vs late-warning during multi-round patch-iteration).
- CLAUDE.md DoD-2 — extends to cross-reference the test-pain audit.
- `.github/PULL_REQUEST_TEMPLATE.md` DoD-2 checkbox — extends to cross-reference the test-pain audit.

## §4 — B contract: fitness functions

**Source rule.** Spec 71 §4 §"Switch mechanism" verbatim:

> *"All slice code consumes `import { getSession, getAuthGate, getStore } from '@/lib/auth'` (or `'@/lib/store'`). Never touches Supabase directly, never touches the env var directly. ESLint rule enforces (spec 72 §7)."*

Spec 71 §4 lead-in (before §"Three abstractions") verbatim:

> *"Dev mode is a first-class implementation behind a real interface, not a special case sprinkled through the code. Same domain code paths run in dev and prod; only the implementation behind the interface swaps. Hexagonal-architecture style. Boundary enforcement is multi-layered per spec 72 §7."*

Spec 71 §4's "ESLint rule enforces" claim is a forward-reference. Spec 72d operationalises it as a runnable suite of fitness functions in a dedicated CI step.

**Initial rule set (V1).** ESLint `no-restricted-imports` + custom rules + `madge` circular-dependency detection:

| # | Invariant | Tooling | Source spec |
|---|---|---|---|
| 1 | `src/lib/bank/**` does NOT import from `src/components/**` (domain doesn't depend on UI) | ESLint `no-restricted-imports` | Spec 71 §4 + general hexagonal principle |
| 2 | `src/lib/ai/**` does NOT import from `src/components/**` (same) | ESLint `no-restricted-imports` | Spec 71 §4 + general hexagonal principle |
| 3 | Slice code (`src/app/**`, `src/components/**`) does NOT import `@supabase/*` directly — must go via `@/lib/auth` or `@/lib/store` | ESLint `no-restricted-imports` | Spec 71 §4 §"Switch mechanism" verbatim |
| 4 | No file other than `src/lib/auth/index.ts` reads `process.env.NEXT_PUBLIC_DECOUPLE_AUTH_MODE` directly | ESLint custom rule (regex on `process.env.NEXT_PUBLIC_DECOUPLE_AUTH_MODE`) | Spec 71 §4 §"Switch mechanism" |
| 5 | No circular dependencies in `src/lib/**` (`madge --circular`) | `madge` | General hygiene; spec 71 §4 implies a clean DAG |

Rules 1-4 are **layer rules** (who-may-import-whom). Rule 5 is a **shape rule** (no cycles). All five are runnable assertions on every PR; failure mode is fail-loud with a useful exit message naming the violating file + the broken invariant.

**CI integration.** New GitHub Actions workflow `.github/workflows/fitness-functions.yml` runs on `pull_request:opened/synchronize` + `push:main`. Steps:

```yaml
- run: npm run lint                    # ESLint rules 1-4 enforced inline
- run: npx madge --circular src/lib    # rule 5
```

Failure → workflow `failure` → merge gate per CODEOWNERS branch protection. Useful-message exit body per spec 71 §4's "ESLint rule enforces" pattern.

**Tooling decision.** ESLint over `dependency-cruiser` for V1 — already in the stack (`eslint.config.mjs` exists; `eslint ^9` in deps), zero new dep for rules 1-4. Add `madge` as new dev dep for rule 5. `dependency-cruiser` (or biome) reconsidered if the rule set grows past ~10 rules and ESLint + madge become awkward.

**Research grounding.**

- Neal Ford et al., *Building Evolutionary Architectures* — fitness-function concept verbatim. Architectural rules encoded as automated tests that fire on every change.
- Sam Newman, *Building Microservices* §3.4 — same pattern at microservice scale.

**Out of scope at B ship.**

- Test-coverage fitness functions (separate; covered by `coverage-threshold-ratchet.sh` per CLAUDE.md §"Hard controls").
- Performance fitness functions (Lighthouse CI · bundle-size budgets — Phase C+ once user-facing surfaces ship).
- Spec-citation fitness functions (regex-on-spec-references — too noisy; deferred indefinitely).

**Shipped (Session 72 P2).** B contract operationalised. Touch points:

- `eslint.config.mjs` — four new flat-config blocks. Rules 1+2 (one combined block: `src/lib/bank/**` + `src/lib/ai/**` don't import `@/components/**`). Rule 3 (`src/app/**` + `src/components/**` don't import `@supabase/*`). Rule 4 (only `src/lib/auth/index.ts` may read `NEXT_PUBLIC_DECOUPLE_AUTH_MODE`) — global `no-restricted-syntax` rule + per-file carve-out for `src/lib/auth/index.ts`.
- `package.json` — adds `madge` devDep + `madge:circular` npm script holding the TypeScript flags (`--ts-config tsconfig.json --extensions ts,tsx`); spec contract said `npx madge --circular src/lib` verbatim, but the bare invocation processes 0 TypeScript files without the flags.
- `.github/workflows/fitness-functions.yml` — new workflow on `pull_request` (branches: main) + `push` (main). Two steps: `npm run lint` (rules 1-4) + `npm run madge:circular` (rule 5). Failure → workflow `failure` → merge gate per CODEOWNERS branch protection. Job-level `permissions: contents: read` block enforces principle of least privilege.

**Known V1 limitations (deferred):**

- Rule 4 carve-out scope. The per-file override `{ files: ["src/lib/auth/index.ts"], rules: { "no-restricted-syntax": "off" } }` disables the entire `no-restricted-syntax` rule family for that file, not just the `NEXT_PUBLIC_DECOUPLE_AUTH_MODE` selectors. Acceptable at V1 because no other `no-restricted-syntax` rule exists in `eslint.config.mjs`; the canonical fix (inline `eslint-disable-next-line` comment at the env-var read site in `src/lib/auth/index.ts`) is deferred to keep this PR scoped to no-src/-touch. Re-evaluate if/when another `no-restricted-syntax` rule is added that should apply to `src/lib/auth/index.ts`.
- GitHub Actions pinned to mutable tags (`@v4`) rather than full-length commit SHAs. Matches the dominant pattern across 6 of 7 existing workflows (`ci.yml`, `gitleaks.yml`, `shellspec.yml`, `eslint-no-disable.yml`, etc.); pinning only the new workflow creates inconsistency without addressing the broader supply-chain surface. Cross-cutting SHA-pinning across all workflows is tracked as a separate concern.

## §5 — C contract: plan-architect persona

**Source pattern.** Spec 72c §4 L69 verbatim:

> *"Each persona file: max 300L (target ≤200L via include-by-reference for verdict vocab + JSON schema); verbatim Option C nonced delimiters per spec 72b §"Scope: session-spawned personas only"; explicit JSON output schema; verdict vocabulary per CLAUDE.md §"Hard controls (in development)" §"Verdict vocabulary"."*

CLAUDE.md §"Hard controls" §"Subagent file locations" verbatim:

> *"`.claude/agents/` — review personas spawned by the main session via `Agent` tool calls or `/review`-class skills. Filename = persona name; file body = persona rubric."*

**File location.** `.claude/agents/plan-architect.md` (session-spawned; sibling to `reviewer-{security,correctness,style}`, `acceptance-gate`, `ux-polish-reviewer`, `reviewer-comment`).

**Spawn integration.** Extends `.claude/hooks/exit-plan-review.sh` (PreToolUse on `ExitPlanMode`). The existing hook spawns `.claude/subagent-prompts/exit-plan-review.md` for plan-time-review (git-state assertions + slice-sizing + simplicity-first + spec-citation discipline). Plan-architect spawns alongside (in parallel where the harness supports it; sequentially otherwise). Two distinct concerns:

| Persona | Concern | Source rubric |
|---|---|---|
| `exit-plan-review.md` (existing) | Git-state assertions · slice-sizing · simplicity-first · spec-citation discipline | `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md` AC-7 |
| `plan-architect.md` (new) | Architectural seams · effects boundaries · coupling forecasts · test-pain forecast · hexagonal-invariant respect | This spec §5 |

**Plan-architect rubric.** The persona reviews the proposed plan against six questions:

1. **What seams will this code need?** Where do effects (storage, network, time, randomness) live? Are they behind swappable interfaces, or imported directly into pure logic?
2. **What hides effects?** Are there hidden state stores, module-level mutable globals, implicit ordering dependencies, or non-explicit IO?
3. **What coupling will we regret?** Does the plan have domain code (`src/lib/**`) depending on UI (`src/components/**`)? Does it bypass `@/lib/auth` or `@/lib/store` to touch infra directly?
4. **What's the test-pain forecast?** Reading the plan, will the unit tests need >2 mock setups? If yes, the seam is wrong before any code is written (D contract triggered at plan time).
5. **Does the plan respect spec 71 §4 invariants?** Specifically B contract rules 1-5; if the plan implies a violation, reject at plan-mode-exit.
6. **What source artefacts has the plan verified?** Are cited specs backed by literal quotes (not paraphrases or summary-recall)? For canvas-driven slices, are the canvases decoded to readable form before any visual-treatment claim? For "matches X" claims, is X visible as a recent Read in the session transcript? Default `blocking: true`.

**Output format.** Strict JSON per CLAUDE.md §"Hard controls" §"Verdict vocabulary" (Conventional Comments labels + `blocking` boolean):

```
{
  "findings": [
    { "label": "issue|suggestion|todo|nitpick|chore|note|question|thought|praise",
      "blocking": true | false,
      "category": "seam-boundary|hidden-effects|coupling|test-pain-forecast|hexagonal-invariant",
      "evidence": "<quote from plan>",
      "remediation": "..." }
  ]
}
```

Verdict derived deterministically by the orchestrator per CLAUDE.md §"Hard controls" §"Verdict derivation rules". Architectural-class concerns (categories `seam-boundary`, `hidden-effects`, `hexagonal-invariant`) default to `blocking: true` unless the plan explicitly addresses the concern with reasoning.

**Hook integration.** `.claude/hooks/exit-plan-review.sh` extension — spawn plan-architect alongside the existing exit-plan-review template. Aggregation: union of `findings[]` from both personas via `jq -s '{findings: (map(.findings // []) | flatten)}'`. Block plan exit if any aggregated finding has `blocking: true` (single-format Conventional Comments per spec 72c §4 L69 mandate; both personas use the same schema since session 73 P0).

**Output-format unified at C ship.** Both personas emit Conventional Comments per spec 72c §4 L69 mandate. The dual-format transition originally contemplated for V1 was collapsed to single-format atomically with the C ship: `exit-plan-review.md` migrated alongside plan-architect's debut (session 73 P0, path-D scope decision). Hook orchestrator parses a single schema; aggregation is union of `findings[]` from both personas; block on any `blocking: true`.

**Research grounding.**

- aider `--architect` mode — separates the planning model from the coding model on the principle that architectural reasoning is a different cognitive task from code-generation. https://aider.chat/docs/usage/modes.html
- Cline Plan/Act mode — explicit plan-then-execute separation. https://docs.cline.bot/features/plan-and-act
- Armin Ronacher, [*"What is Plan Mode?"*](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/) — plan-mode rationale.
- Williams + Kessler, *Pair Programming Illuminated* — empirical pair-programming research: real-time pair catches design defects 4-6× faster than solo + post-hoc review. The plan-architect persona is the asynchronous proxy for the pair partner at plan time.

**Out of scope at C ship.**

- Multi-provider (non-Anthropic) plan-architect specialist (cross-provider diversity carry-over; spec 72c §9).
- Mid-implementation pair-programming hook (PostToolUse on `Edit`/`Write` — too noisy at V1; revisit if the plan-time gate misses architectural defects that emerge mid-impl).

**Shipped (Session 73 P0).** `.claude/agents/plan-architect.md` (NEW; ~100L) + `.claude/hooks/exit-plan-review.sh` extension (dual-template loading; `frame_prompt()` helper; spawn-or-stub block; `jq -s` union aggregator; `[.findings[] | select(.blocking == true)] | length` blocking gate) + `.claude/subagent-prompts/exit-plan-review.md` migration to Conventional Comments (atomic with C ship per session-73 path-D scope decision; previously carved out at L177 above) + `tests/shellspec/exit-plan-review.spec.sh` extension (dual-persona orchestration coverage via `EXIT_PLAN_REVIEW_DEBUG_VERDICT_EXIT` + `EXIT_PLAN_REVIEW_DEBUG_VERDICT_PLAN_ARCH` env-var injection) + `CLAUDE.md` §"Hard controls" gates table row update (Plan-time-review row extended with `plan-architect.md` file path + spec 72d §5 reference). The originally-planned dual-format orchestrator was collapsed to single-format atomically with the C ship.

## §6 — Sequencing

Ship order: **D → B → C**.

| Order | Contract | Why this position |
|---|---|---|
| 1 | D test-pain gate | Cheapest infra (zero new code; CLAUDE.md amendment + DoD checklist add). Pain-signal accumulates immediately on the first src/ slice that ships post-D. Validates whether qualitative judgement holds before adding mechanical layers. |
| 2 | B fitness functions | Mechanical floor. Encodes spec 71 §4 invariants as runnable assertions. Independent of D — runs on every PR regardless of how the slice was tested. |
| 3 | C plan-architect persona | Highest cost per spawn. Benefits from B+D already running — the persona doesn't redundantly check what fitness functions enforce mechanically; it checks higher-order architectural questions B + D can't (seam design, coupling forecasts). |

Each ship is a separate PR with paired-spec amendment per the **paired-spec invariant** (Constraint #33 in `docs/SESSION-CONTEXT.md` §"Negative constraints" — *"spec amendments claiming impl facts must update impl files in same PR"*): this spec's §Status footer gains a "shipped at <SHA>" line in the same PR as the impl files. P1 (D) updates CLAUDE.md §"Engineering conventions" + spec 72d §3 §Status. P2 (B) lands ESLint config + CI workflow + spec 72d §4 §Status. P3 (C) lands the persona file + hook extension + spec 72d §5 §Status.

## §7 — Out of scope at programme V1

- **Mid-implementation review hooks.** PostToolUse review on every `Edit`/`Write` — too noisy. The author-time `comment-review.sh` advisory hook is the only PostToolUse review at programme V1.
- **Replacement of `reviewer-architecture`.** B+C+D add NEW pre-impl layers; they don't restore the dropped post-PR architecture specialist. Spec 72c §9 still tracks the option to re-introduce a dedicated post-PR architecture specialist if cumulative `reviewer-correctness` criterion-7 catch-rate falls below the retain bar in the first 3 src/ slices post-B+C+D.
- **Property-based fuzz of seam swaps.** Carry-over from spec 72c §9 (Stryker mutation testing parallel).
- **Performance fitness functions.** Out of scope until Phase C+ user-facing surfaces ship; Lighthouse CI / bundle-size budgets land then.

## §8 — Pattern lineage + further reading

- Beck, *Test-Driven Development by Example* (D)
- Freeman + Pryce, *Growing Object-Oriented Software, Guided by Tests* (D)
- Hillel Wayne, [*"I have complicated feelings about TDD"*](https://buttondown.com/hillelwayne/archive/i-have-complicated-feelings-about-tdd-8403/) (D)
- Neal Ford et al., *Building Evolutionary Architectures* (B)
- Sam Newman, *Building Microservices* §3.4 (B)
- aider `--architect` mode (C)
- Cline Plan/Act mode (C)
- Armin Ronacher, [*"What is Plan Mode?"*](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/) (C)
- Williams + Kessler, *Pair Programming Illuminated* (C)
- Spec 71 §4 — hexagonal reference shape (B + D source)
- Spec 72 §7 — boundary enforcement (B upstream)
- Spec 72c §4 — specialist personas pattern (C upstream)
- Spec 72c §9 — open questions / v3c carry-overs (B+C+D adjacent; architecture-drop carry-over context)
- CLAUDE.md §"Engineering conventions" — DoD checklist (D landing site)
- CLAUDE.md §"Coding conduct" §"Effects behind interfaces" (D source rule)
- CLAUDE.md §"Hard controls" §"Subagent file locations" (C location convention)
- CLAUDE.md §"Hard controls" §"Verdict vocabulary" (C output format)

## §Status

**Session 72** — spec landed. Three contracts (D test-pain gate · B fitness functions · C plan-architect persona) freeze. Implementation ships separately per the sequencing in §6: P1 D · P2 B · P3 C, each in its own PR with paired §Status footer amendment per the paired-spec invariant (Constraint #33; defined inline in §6).

Cross-references updated in same-PR companions:
- CLAUDE.md §"Key files" — adds `docs/workspace-spec/72d-architecture-review-additions.md` entry under the spec 72-suite cluster.
- Spec 72c §9 — adds note that B+C+D pre-impl rigour is now contracted in spec 72d (moves out of "queued" framing in SESSION-CONTEXT §"Rigour-suite completeness").

P1/P2/P3 will append shipped-at SHAs to the relevant subsection (§3 D · §4 B · §5 C) at impl-PR time.
