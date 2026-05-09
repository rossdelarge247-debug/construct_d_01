# S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates

**Category:** infrastructure

## Status

Authoring round (session 77 P0). Skeletal scope shipped at session 76 wrap (commit `7854977`). This round adds: literal spec quotes inline at each citation per AC-8 dogfooding; full architectural seams; companion `security.md` + `test-plan.md` + `verification.md`; six-control implementation following plan-time review.

## Authorisation

### Failure analysis the slice addresses

`docs/HANDOFF-SESSION-76.md` §"What went wrong (and the corrective protocol)" verbatim:

> *"Specs were never read in this session. Citations like 'per spec 65 §The 8 screens' appeared four times in slice docs without ever opening the spec file. The plan was built against CLAUDE.md's compressed summary, not the source."*

> *"Canvases were never decoded. The bundled-HTML format (5MB each, real markup inside `__bundler/template` JSON-encoded script tag) was treated as a colour-palette source via grep, not a visual-treatment authority. ~12 hex codes + the gradient + the F1 token map were extracted; everything else (type weights, button shape, card padding, radii, selected-state ring, header layout, spacing rhythm) was inline-style guesswork."*

> *"Plan-time review ratified the flawed framing. Both reviewers approved a plan that said 'extract design tokens via grep'. Neither persona's rubric asks 'have you actually READ the source artefacts, or just summaries?' Multi-agent review's blind spot."*

The corrective scope is six controls: a one-shot decoder script, a CI gate requiring decoded sibling for any slice citing bundled-HTML canvases, a PostToolUse hook scanning for `per spec N` citations missing literal-text quotes, a CI mirror that fuzzy-matches against the cited spec file, a Q6 amendment to the plan-architect rubric, and a sibling pre-priority verification rule in CLAUDE.md.

### CLAUDE.md rules the slice operationalises

CLAUDE.md §"Planning conduct" §"Distrust your own summaries" verbatim:

> *"A summary compressed earlier in the session is navigation, not source. When a decision is load-bearing, go back to the spec itself — even if the summary 'feels' right. Heavy context makes skim-recall tempting; resist it."*

CLAUDE.md §"Planning conduct" §"Quote, don't paraphrase, when invoking a spec" verbatim:

> *"Any claim of the form 'per spec X' or 'matches X exactly' must include the literal sentence from the spec in the same breath. Forces the re-read. If you can't quote it, you don't know it."*

CLAUDE.md §"Visual direction" verbatim:

> *"Canonical source: the Claude AI Design tool outputs from session 22 wire batches. Exact visual treatment — colour system, typography, component design, screen layouts — to preserve and rebuild. Copy in the outputs is NOT final; visual treatment IS."*

These three rules sit in always-loaded context every session. The prior failure happened despite the rules being in scope — the discipline was loaded and violated anyway. Hooks and CI gates close the prose-to-practice gap.

### Amendment site

Spec 72d §5 verbatim, on the current 5-question plan-architect rubric:

> *"Plan-architect rubric. The persona reviews the proposed plan against five questions: 1. What seams will this code need? Where do effects (storage, network, time, randomness) live? Are they behind swappable interfaces, or imported directly into pure logic? 2. What hides effects? Are there hidden state stores, module-level mutable globals, implicit ordering dependencies, or non-explicit IO? 3. What coupling will we regret? ... 4. What's the test-pain forecast? ... 5. Does the plan respect spec 71 §4 invariants?"*

This slice extends the rubric to six questions by adding **Q6 — Source-artefact verification**, addressing the failure mode this slice's authorisation describes.

### Gate calibration (slice category)

CLAUDE.md §"Slice categories" §"Per-category behaviour summary" verbatim:

> *"infrastructure — full production-grade rigour for control-plane changes (hooks · workflows · ESLint config · persona files); the surface that gates the rest of the rig."*

The canonical per-category gate matrix lives in spec 76 §3. All gates fire at production calibration for this slice. Full DoD-14 security checklist (no short-form). Synthetic-fixture regression coverage required because the slice ships a persona-file amendment.

## Scope

### In scope (six controls)

1. **`scripts/decode-bundler-canvas.sh`** — one-shot Node decoder. Reads a bundled-HTML canvas export, extracts the `<script type="__bundler/template">` JSON-encoded inner doc, emits readable HTML+CSS to a sibling `decoded/<file>.html`. Pure transform: input file path → output file path. Stdin pipe accepted via `-` argument.

2. **`.github/workflows/canvas-decode.yml`** — CI gate. PRs touching `docs/slices/S-*/acceptance.md` that cite a `docs/design-source/<slug>/` path with bundled-HTML format must ship the decoded sibling OR carry an explicit waiver line in `verification.md`. Path-filter: `docs/slices/S-*/**` + `docs/design-source/**`.

3. **`.claude/hooks/spec-citation-quote.sh`** — PostToolUse:Write|Edit on `docs/slices/S-*/*.md` and `docs/workspace-spec/*.md`. Regex-scans for `per spec N` and `spec NN §"..."` citations; requires fenced or block-quoted ≥20-char literal text within 5 lines following each citation. Stub-mode default: emit advisory `systemMessage` and exit 0. Live-mode (`SPEC_QUOTE_ENFORCE=1`): emit advisory + exit 2. §Status footer fence-aware exemption applied (content within `^## §?Status` heading until the next `^## ` heading or EOF excluded from scan). Blockquote-line exemption applied (lines starting with `>` are quoted source material, not author claims, and excluded from the trigger scan).

4. **`.github/workflows/spec-citation-quote.yml`** — CI mirror. Stricter than the hook: also fuzzy-matches the local quoted text against the cited spec file content via case-insensitive substring on whitespace-collapsed normalised form. Substring mismatch → workflow `failure`. Functions as the merge-time gate the author-time hook can be bypassed for. No `ANTHROPIC_API_KEY` required (pure file-read + regex).

5. **Spec 72d §5 amendment** — extend C-contract from 5 questions to 6 by adding **Q6 — Source-artefact verification**. Plan author must demonstrate (a) literal quotes from each cited spec section, (b) for canvas-driven slices, reference to the decoded readable canvas form, (c) for "matches X" claims, recent Read of X visible in session transcript. Persona file at `.claude/agents/plan-architect.md` extended with Q6 in the rubric and a new row in the default-blocking categories table; JSON output schema `category` enum gains `source-artefact-verification`.

6. **CLAUDE.md amendment** — add §"Pre-priority canvas-fidelity verification" sibling to existing §"Pre-priority spec-gate verification" + §"Pre-priority shipped-artifact verification" (currently L188 + L190). Authoritative source for the canvas-decode rule the hook + CI gate enforce.

### Out of scope (P1 follow-ups)

- PR-DoD checklist additions enumerating canvas-fidelity items — hooks + CI suffice as pre-prevention; PR-DoD already enforces slice-verification reference.
- SessionStart hook spec-read-status surfacing (e.g. announce which spec sections have been Read this session) — defer; current scope addresses the failure mode at write-time and merge-time, which is the more tractable pair.
- Discussion-turn-before-`src/`-writes enforcement — process commitment, not a control. Lives in HANDOFF-76 §"Sequence for the next session" P1 protocol.
- Multi-provider (non-Anthropic) plan-architect specialist for Q6 — already deferred in spec 72d §5.
- Live-mode `SPEC_QUOTE_ENFORCE=1` opt-in default flip at slice ship — defer to a follow-up control-change PR after 1-2 src/ slices have exercised stub-mode. Author-time hooks ship advisory-first; enforcement default-flip waits for calibration data on false-positive rates.

## Acceptance criteria

- **AC-1 · Decoder works on bundled-HTML canvases.** `scripts/decode-bundler-canvas.sh` produces a readable HTML+CSS form from a bundled-HTML input. Verification: (a) **primary** against synthetic bundled-HTML fixture under `tests/decoder-fixtures/` matching the structural pattern (one `<script type="__bundler/template">` containing JSON-encoded inner HTML); decoded output contains the literal inner-doc markup, not the bundler loader shell. (b) **End-to-end** check via `git show claude/proto-presignup-interview-Okucr:docs/design-source/pre-signup-interview/o1-stage-router-expressive.html | scripts/decode-bundler-canvas.sh - >| /tmp/decoded.html` recorded in `verification.md`; output contains real Tailwind classes + visible markup. The bundled-HTML canvases on the prototype branch are not on this rigour-v3d branch (they merge to main with the P1 prototype-refactor PR); the fixture-based primary keeps AC-1 verifiable on the rigour-v3d PR alone.

- **AC-2 · Canvas-decode CI gate fires on missing decoded sibling.** `.github/workflows/canvas-decode.yml` runs on PR `opened/synchronize` events with path-filter on `docs/slices/S-*/acceptance.md` + `docs/design-source/**`. For each slice acceptance.md modified by the PR, scan for `docs/design-source/<slug>/<file>.html` references; for each reference where `<file>.html` is bundled-format (contains `<script type="__bundler/template">`), require either a sibling `docs/design-source/<slug>/decoded/<file>.html` OR an explicit waiver line in the slice's `verification.md` matching `^- canvas-decode-waiver: docs/design-source/<slug>/<file>.html — <reason>`. Fails the workflow with diagnostic listing missing siblings.

- **AC-3 · Spec-citation-quote hook fires on missing-quote citations.** `.claude/hooks/spec-citation-quote.sh` runs as PostToolUse:Write|Edit. Path filter: `docs/slices/S-*/*.md` and `docs/workspace-spec/*.md` only (other paths exit 0 silently). Skip-list excludes lineage-purpose docs (`docs/HANDOFF-SESSION-*.md` and `docs/SESSION-CONTEXT.md`) where citation patterns are routinely informal. Regex catches: `per[[:space:]]+spec[[:space:]]+[0-9]+[a-z]?` (per-cite form, claim) and `spec[[:space:]]+[0-9]+[a-z]?[[:space:]]+§"[^"]+"` (sectioned-with-quoted-name form, claim). For each match, scan the next 5 lines for a blockquote starting `>` AND containing ≥20 chars between the first and last quote characters, OR a fenced code block opening with three-backticks and containing ≥20 chars. Stub-mode: emit `systemMessage` advisory naming the un-quoted citation; exit 0. Live-mode (`SPEC_QUOTE_ENFORCE=1`): emit advisory + exit 2. §Status footer exemption applied (fence-aware): content within a `^## §?Status` heading until the next `^## ` heading or EOF is excluded from the scan.

- **AC-4 · Spec-citation-quote CI mirror fuzzy-matches against cited spec.** `.github/workflows/spec-citation-quote.yml` runs on PR `opened/synchronize` events with path-filter on `docs/slices/S-*/*.md` + `docs/workspace-spec/*.md`. For each modified file, run the same regex as AC-3 to find citations + their locally-declared quotes. Then for each citation, read the cited spec file (e.g. `docs/workspace-spec/72d-architecture-review-additions.md`), extract the cited section by §-name match, and substring-search the locally-declared quoted text against the spec section's content. Normalisation: lowercase + collapse whitespace runs to single space + strip markdown italic/bold markers. Fail the workflow if any citation's local quote is not found in the cited spec's normalised text. No `ANTHROPIC_API_KEY` required.

- **AC-5 · Spec 72d §5 amended to 6-question rubric + plan-architect persona updated.** Amendment to `docs/workspace-spec/72d-architecture-review-additions.md` §5: add **Q6 — Source-artefact verification** as the sixth rubric question; add a row to the §5 table (or post-table prose) describing the new dimension. Persona file `.claude/agents/plan-architect.md`: add a sixth `### 6.` section under §"Authoritative review criteria" with the same fields as the existing five sections (description + verbatim CLAUDE.md quote + default `blocking` reasoning); add a row to the §"Default-blocking categories" table (`source-artefact-verification` | `issue` | `true` | "Plans built on summaries instead of source artefacts produce visually-basic prototypes — the failure mode Q6 addresses"); add `source-artefact-verification` to the JSON output schema's `category` enum. Sibling `.claude/subagent-prompts/exit-plan-review.md` keeps its 5-question rubric (different angle: git-state assertions · slice-sizing · simplicity-first · spec-citation discipline). Both personas continue to spawn alongside via the existing `exit-plan-review.sh` orchestration (spec 72d §5 already covers the hook-integration shape) — no orchestrator changes.

- **AC-6 · CLAUDE.md §"Pre-priority canvas-fidelity verification" added.** New paragraph immediately after §"Pre-priority shipped-artifact verification" (currently L190 in main). Pattern matches the two existing pre-priority sibling rules: bold rule name → 1-2 sentence rule statement → kicker referencing the surfacing failure mode. References `scripts/decode-bundler-canvas.sh` + `.github/workflows/canvas-decode.yml` by literal path. Rule statement: kickoff or SESSION-CONTEXT priorities labeled "extract from canvas X", "match canvas X", or any visual-fidelity claim must demonstrate either (a) decoded sibling readable form already in the repo, or (b) decoder-script invocation visible in session transcript. Cite the surfacing failure case in HANDOFF terms (the prototype slice that shipped at structural fidelity only because canvases were grep'd not decoded).

- **AC-7 · Synthetic-deliberate-injection fixture for plan-architect Q6.** Files added under existing infrastructure (per `tests/personas/synthetic/README.md` pattern):
  - `tests/personas/synthetic/plan-architect.plan` — plan-text fixture with deliberate Q6 violation: cites a spec without quoting, cites a canvas without decoded reference, makes a "matches X" claim without recent Read.
  - `tests/personas/synthetic/expected/plan-architect.json` — expected-finding signature with `category_pattern: "(?i)source-artefact-verification"`, `evidence_must_contain_any_of: ["spec", "canvas", "matches", "summary", "quote"]`, `remediation_must_contain_any_of: ["quote", "decode", "read", "verbatim"]`, `min_findings_count: 1`.
  - `tests/personas/run-synthetic.sh` extended to handle the plan-architect dimension with plan-text framing rather than diff-content framing (per-dimension brief composition forks on dimension name).
  - `.github/workflows/persona-synthetic-fixtures.yml` path-filter extended to include `.claude/agents/plan-architect.md` and the new fixture files.

- **AC-8 · Self-application proof.** This slice's own `acceptance.md`, `security.md`, `test-plan.md`, `verification.md` pass: (i) the new `spec-citation-quote.sh` hook in stub mode (no advisory triggered on the slice's own citations); (ii) the new `spec-citation-quote.yml` CI mirror with full strict matching against cited spec files. `verification.md` records the run output for both. The slice ships only after its own gates fire green on its own PR. Recursive validation: if the gates can't pass against the slice that defined them, the gates are wrong and the slice re-scopes (regex too strict, matcher too literal, or quote convention doesn't match the codebase's actual citation patterns).

## Architectural seams

1. **Decoder is a one-shot pure transform.** Input: file path or stdin → output: file path or stdout. No state, no network, no time-dependence. Single function in Node, swappable for any equivalent JSON-extraction implementation. Effects (file IO) are at the boundary; the inner extraction is pure.

2. **Hook + CI mirror share regex but diverge on enforcement layer.** The shared regex catalogue is canonical to both `spec-citation-quote.sh` (author-time advisory, proximity-only) and `spec-citation-quote.yml` (merge-time blocking, additionally fuzzy-matches quoted text against the cited spec file). The author-time path emits `systemMessage` advisory and exits 0; the merge-time path fails the workflow on any unmet citation. Two-layer design rationale: author-time stays out of the way of in-flight authoring (interrupts cost more than they save when the author is iterating); merge-time enforces unconditionally because the merge button is the right gate for a permanence claim.

3. **Spec 72d §5 amendment is a doc-only edit alongside a one-block extension to the persona file.** No new orchestrator code; `exit-plan-review.sh` already invokes plan-architect via `claude -p`. The rubric expansion is internal to the persona prompt. The default-blocking-categories table grows by one row; the JSON output schema's `category` enum gains one value.

4. **Synthetic-fixture for plan-architect requires runner extension** because the existing `run-synthetic.sh` invokes `claude -p` against PR-time specialists with `.diff` content; plan-architect is plan-time and reviews plan-text. The runner's per-dimension brief composition forks on dimension name (specialist vs plan-time persona): specialists get diff-content framing; plan-architect gets plan-text framing matching what `exit-plan-review.sh` produces (`plan-from-author-NONCE` fences). Both paths converge at the matcher.

5. **Self-application (AC-8) is the architectural test.** If the slice can't pass its own gates, the gates aren't right. Forces the regex + matcher to be tractable on real-world citation patterns rather than over-strict against legitimate-but-loose references.

## Spec citations

- `docs/HANDOFF-SESSION-76.md` §"What went wrong (and the corrective protocol)" — failure analysis motivating the slice (literal quotes inline at §Authorisation).
- CLAUDE.md §"Planning conduct" §"Distrust your own summaries" — rule the slice operationalises (literal quote inline at §Authorisation).
- CLAUDE.md §"Planning conduct" §"Quote, don't paraphrase, when invoking a spec" — rule the slice operationalises (literal quote inline at §Authorisation).
- CLAUDE.md §"Visual direction" — rule the slice operationalises (literal quote inline at §Authorisation).
- CLAUDE.md §"Slice categories" §"Per-category behaviour summary" — gate calibration (literal quote inline at §Authorisation; this slice is `infrastructure`).
- `docs/workspace-spec/72d-architecture-review-additions.md` §5 — amendment site (literal quote inline at §Authorisation; AC-5 amends).
- `docs/workspace-spec/72c-multi-agent-review-framework.md` §3 + §7 — multi-agent + synthetic-fixture pattern (referenced for AC-7 wiring; pattern documented in `tests/personas/synthetic/README.md`).
- `docs/workspace-spec/76-prototype-mode-rigour.md` §3 — canonical per-category gate matrix (referenced for `infrastructure` category gates).
- `docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md` AC-7 — exit-plan-review precedent (`.claude/hooks/exit-plan-review.sh` PreToolUse:ExitPlanMode pattern this slice extends with Q6 via plan-architect; the hook itself is unchanged).
- `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md` AC-1 + AC-5 — multi-agent + persona organisation precedent (`.claude/agents/*.md` placement convention; spawn via `claude -p`).

## Status

- 2026-05-08 (session 76 wrap): scoping shipped at skeletal level (commit `7854977`).
- 2026-05-08 (session 77 P0 authoring): full acceptance fill-in with literal spec quotes per AC-8 self-application; companion `security.md` + `test-plan.md` + `verification.md` authored alongside; six-control implementation begins after plan-time review.
