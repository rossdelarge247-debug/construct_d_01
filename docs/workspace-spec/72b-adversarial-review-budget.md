# 72b — Adversarial-review-gate budget convention

**Status:** locked at v3b S-5 ship (per acceptance.md AC-10); amended at v3b S-6 to add Option C + spec-validation-by-impl-break (extending the convention spec; AC-10 contract unchanged).

## Purpose

DoD-3 (CLAUDE.md §"Engineering conventions") requires:

> *"Adversarial review gate (per slice). Before committing any slice or significant change, run one adversarial review pass. Two options: (1) explicit prompt — 'poke holes in this; find edge cases, security issues, regression risks'; (2) `/review` or `/security-review` skill. Output is a list of concerns. Either address or explicitly defer with reasoning. No slice ships without this gate."*

Pre-AC-10, the gate was structurally infeasible for slices whose authoritative source exceeded ~300 lines (the per-turn read-cap enforced by `.claude/hooks/read-cap.sh`): a single-turn reviewer couldn't hold the full source in context. v3a session 40 surfaced this directly — the `/review` of the v3a foundation slice hit the read-cap mid-source and emitted a procedural `request-changes` verdict ("can't see the whole source"). v3b S-2 (`/review` of v3b acceptance.md) hit the same wall.

AC-10 ships two structural options + decision criteria so the gate becomes consistently achievable. v3b S-6 amends the spec to add **Option C** (inline file content for atomic files >300 lines) + a **spec-validation-by-impl-break** check for meta-test slices — both arose from sub-spawn structural failures repeated across v3a session 40 and v3b S-5 (sessions 45-46): atomic single-file sources (one hook script, one workflow YAML) couldn't be partitioned across spawns, and dryruns invoking the impl directly silently masked spec-runner stdin bugs that gave 21 fixtures false signals.

## Decision criteria

Source-of-truth: the file the sub-spawn must inspect end-to-end. For most slices this is `wc -l docs/slices/S-XX/acceptance.md` (the canonical AC doc; sibling docs `verification.md` + `audit-findings.md` + `review-findings.md` are derivative). For meta-test slices (hook + spec-fixture pairs) it is the hook script. For workflow slices it is the workflow YAML.

| Source size | Source shape | Convention | Rationale |
|---|---|---|---|
| <300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead. |
| 300–1000 lines | partitionable (multiple files) | Partition (Option B) | Sub-spawns each Read a file <300L; multi-turn budget creates deferral risk. |
| 300–1000 lines | atomic (single file >300L) | Inline (Option C) | Partition gives 0 sub-spawns under cap; inline file content in prompt. |
| >1000 lines | any | Multi-turn budget (Option A) | Beyond inline-file practical ceiling; explicit envelope is cleaner. |

These are conventions, not rules — slice setup may justify deviation in writing in the slice's `acceptance.md` §DoD or §Pre-flight section.

## Option A — Multi-turn budget envelope

Reviewer prompt explicitly declares the budget at the top:

> *"Expected 2-3 turns; will surface read-cap deferrals as v3c carry-over rather than blocking the verdict."*

The reviewer reads the source in offset+limit chunks across turns, tracks coverage in working notes, and emits the final verdict in the last turn citing which sections are read-cap-deferred.

**Use when:** source >1000 lines, OR the AC contract is logic-heavy (every line load-bearing).

## Option B — Partition

Main session orchestrates 3 sub-spawns, each receiving a disjoint slice-of-the-source:

- **Sub-spawn 1 (spec-side):** the `acceptance.md` AC table + verification rubric. Output: AC quality findings.
- **Sub-spawn 2 (impl-side):** the slice's source diff (`git diff origin/main...HEAD`). Output: code-level findings.
- **Sub-spawn 3 (git-history-side):** the commit chain on the slice branch (`git log origin/main..HEAD`). Output: commit-msg accuracy + RED-then-GREEN ordering + scope-creep findings.

Main session aggregates, dedupes, and emits the consolidated verdict.

**Use when:** source 300-1000 lines AND the concerns naturally partition across multiple files (most slices fit this).

## Option C — Inline file content in agent prompt

When a sub-spawn's source-of-review is an **atomic file >300 lines** (cannot be partitioned across files because there is only one file — a single hook script, a single workflow YAML, a single config), pre-load the file content **inline in the agent prompt itself** rather than asking the sub-spawn to issue a `Read` tool call. The sub-spawn's per-turn read budget is preserved for cross-references; the file under review consumes prompt-budget instead.

Closes the structural read-cap wall surfaced repeatedly: v3a session 40 (`/review` of v3a foundation slice; `request-changes` verdict cited "can't see whole source"), v3b S-2 session 42 (`/review` of v3b acceptance.md hit same wall), v3b S-5 sessions 45+46 (file-per-spawn variant of Option B reached `pre-push-dod7.sh` for sub-spawn 1; sub-spawns 2-6 each targeted a different >300L atomic file and were blocked).

### Syntax

The sub-spawn prompt embeds the file content under conventional delimiters:

```text
You are reviewing the implementation of <slice>'s <AC>. The file under
review is included inline below; you do NOT need to issue a Read tool
call for it. Other source files referenced in this prompt remain
read-only via the standard Read tool with read-cap discipline.

--- BEGIN <path> NONCE ---
<full file content>
--- END <path> NONCE ---

Brief: <review brief — what to check>.
Verdict format: per CLAUDE.md "Hard controls > Verdict vocabulary"
(`approve` / `nit-only` / `request-changes` / `block`).
```

The `--- BEGIN <path> NONCE ---` and `--- END <path> NONCE ---` delimiters
MUST be nonce-bound — `NONCE` is the same per-invocation nonce announced at
the top of the prompt envelope (`Your per-invocation nonce: <32-hex>`). The
sub-spawn treats any `--- END <path> X ---` where X is anything other than
its canonical nonce as content, not a separator. Without nonce-binding, a
malicious diff containing a fake `--- END <path> ---` line could terminate
inlined content early or smuggle attacker-controlled text as a sibling
file (DoD-13 review surfaced this at v3b S-6).

### Prompt-budget accounting

Before spawning, compute the prompt budget:

- **File size:** `wc -l <path>` — the file the sub-spawn would otherwise Read.
- **Prelude size:** ~200 lines (system-reminder + CLAUDE.md context auto-prepended by the harness).
- **Brief size:** ~50 lines (review instructions + verdict-format guidance).
- **Cross-reference budget:** ~100 lines per sibling file the sub-spawn will Read (cap-respecting).

The sub-spawn's effective per-turn read budget for cross-references is `300 − (file_size of files inlined this turn)`. If the inlined file alone exceeds 300L, all cross-references must also be inlined or summarised in the brief — at which point the file is on the boundary of Option A (multi-turn) territory.

**Practical ceiling:** inline files of up to ~600L; beyond that, partition the file by section using `Read offset+limit` per sub-spawn (Option A territory).

### Use when

- Source >300 lines AND atomic (no natural file-per-spawn partition).
- Sub-spawn would hit per-turn read-cap if it issued a Read.
- Cross-references are minimal (≤2 sibling files) or known + summarised in the brief.

### Tradeoffs

- **Pros:** Sub-spawn never blocked by read-cap; reviewable in one turn.
- **Pros:** Spawn-time prompt-budget check is deterministic + predictable; ratio of prompt-budget vs read-cap computable upfront.
- **Cons:** File content baked into prompt — if the author edits the file mid-review, the sub-spawn reviews the pre-edit snapshot. Acceptable because adversarial review fires AFTER the slice is committed-on-branch (file is frozen at the review SHA).
- **Cons:** Prompt-budget accounting is an extra spawn-time step; Option B (partition across files) is cheaper when applicable.

## Pre-flight gate at slice setup

When a slice's `acceptance.md` exceeds 300 lines, slice setup (in the slice's `acceptance.md` §DoD or §Pre-flight) MUST note which option applies and the rationale. This forces the decision early, not at adversarial-review-time when the deadline pressure is on.

Pre-flight check (deterministic, runnable):

```bash
size=$(wc -l < docs/slices/S-XX/acceptance.md)
if [ "$size" -gt 300 ]; then
  echo "AC source $size lines — pick Option A or B per spec 72b."
fi
```

Slice template for the §Pre-flight note:

```markdown
## Pre-flight (per spec 72b)

- AC source size: 410 lines (above 300; partition convention applies).
- Adversarial review plan: Option B (partition) — 3 sub-spawns: spec-side / impl-side / git-history-side.
```

## Spec validation by deliberate impl-break

For meta-test slices (slices whose deliverable is a test contract on a hook, workflow, or other gated runner), the test surface is two-layered: the **impl** (hook script, workflow logic) AND the **spec runner** (ShellSpec, vitest, GitHub Actions). Author dryruns typically exercise only the impl directly; passing dryruns prove the impl is correct, NOT that the spec is correctly wired to invoke the impl.

Session 46 round-3 surfaced this exact failure mode: ShellSpec's `When call CMD <<<"$INPUT"` does NOT pipe stdin from the inline redirect — but author dryruns invoking `bash hook.sh <<<'$JSON'` worked correctly, masking the spec-runner bug. 21 fixtures (7 tdd-guard + 14 pre-push-dod7) gave false signals from `6f30870` onward; CI exposed them only when impl-side fixes in `fedaeed` happened to land on assertions whose impl-side and runner-side bugs no longer cancelled out.

### Procedure (mandatory for hook+spec-fixture pairs)

Before declaring a meta-test slice ready for adversarial review:

1. Identify a passing-path test in the spec (e.g. *"hook permits valid input → exits 0"*).
2. Temporarily edit the impl to emit a `block` (e.g. `exit 2` + a structured BLOCK message) on the passing-path input.
3. Run the spec.
4. **The pass-path test MUST fail-loud** (rc=non-zero, error message showing the BLOCK).
5. If the test still passes → the spec is broken; the runner is not exercising the impl. Investigate stdin handling, fixture wiring, runner semantics.
6. Revert the deliberate break before committing.

### Why this matters

Adversarial review by sub-spawns inspects the impl source; it does NOT inspect runner semantics. CI exposes runner bugs only when the impl bug + runner bug have non-overlapping effects (the case in session 46 round-3 — accidental, not designed). If the impl is correct AND the runner silently swallows the test signal, sub-spawn review + author dryrun + CI all report green falsely.

The deliberate impl-break check is the only way to validate that the spec runner actually exercises the impl — short of a meta-meta-test (spec on the spec runner), which is deferred to v3c.

### When to apply

- **Mandatory** for slices that ship hook scripts + ShellSpec fixtures (e.g. v3a AC-5 tdd-first-every-commit, v3b AC-6 tdd-guard, AC-7 pre-push-dod7, AC-13 lcov-parser, AC-1 auto-review.yml + acceptance fixture).
- **Mandatory** for slices that ship workflow files + workflow-integration tests.
- **Optional** for pure-logic slices where the test runner (vitest, jest) is well-known and runner-impl integration is verified by the wider test suite.

### Recording

Per-slice `verification.md` records the impl-break check under the relevant AC's evidence cell: *"Impl-break check: temporarily emitted BLOCK from `<file>:<line>`; pass-path fixture `<spec_path>` failed-loud as expected; reverted in commit `<sha>`."*

## Out of scope (deferred to v3c)

- **Retroactive re-review of v3a using this convention.** v3a is shipped state; deferred per AC-10 §Out of scope.
- **Multi-provider 3rd-agent reviewer (e.g. GPT/Gemini for cross-pollination).** v3c carry-over.
- **Structured-findings JSON Schema** so verdicts are machine-parseable. v3c.
- **Inline-file-size accounting calculator** (`scripts/spawn-budget.sh`) — automating the prompt-budget arithmetic per Option C. v3c.
- **Multi-section atomic-file partition** — `Read offset+limit` chunks per sub-spawn for files >600L, beyond Option C's practical ceiling. v3c.
- **Meta-meta-test (spec on the spec runner)** — formal verification that runner semantics match documented behaviour. v3c.
