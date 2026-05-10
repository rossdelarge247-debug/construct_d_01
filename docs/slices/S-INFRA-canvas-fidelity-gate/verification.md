# S-INFRA-canvas-fidelity-gate — Verification

Final-state record of evidence per AC. Skeleton at slice setup; full fill-in at slice ship.

## Acceptance-criteria evidence

### AC-1 · Persona file `.claude/agents/reviewer-canvas-fidelity.md`

| Verification | Evidence |
|---|---|
| File exists | `ls .claude/agents/reviewer-canvas-fidelity.md` |
| Size ≤300L (target ≤200L) | `wc -l .claude/agents/reviewer-canvas-fidelity.md` |
| Names six categories | `grep -oE "^- \*\*\d+\." .claude/agents/reviewer-canvas-fidelity.md \| wc -l` (≥6) and individual category names verifiable via grep |
| Per-invocation context fences | `grep "<linked-canvas-NONCE>" .claude/agents/reviewer-canvas-fidelity.md` (new fence) + existing fences |
| Strict-JSON envelope per spec 72c §5 | `grep '"specialist": "reviewer-canvas-fidelity"' .claude/agents/reviewer-canvas-fidelity.md` + envelope schema visible |
| ≥1 example invocation | `grep -c "^### Example" .claude/agents/reviewer-canvas-fidelity.md` (≥1) |

### AC-2 · auto-review.yml routes canvas-fidelity dimension

| Verification | Evidence |
|---|---|
| `Linked canvas:` field parsed | `grep "Linked canvas:" .github/workflows/auto-review.yml` (the parse step) |
| 4-dim matrix when field+prototype | ShellSpec fixture `tests/shellspec/auto-review-dimensions.spec.sh` asserts `["security", "prototype-readiness", "style", "canvas-fidelity"]` |
| 3-dim matrix when field-absent | Same ShellSpec asserts unchanged matrix output |
| Per-canvas brief composed | Workflow's `compose-brief-canvas-fidelity` step writes `/tmp/briefs/canvas-fidelity.md`; verifiable via dry-run lint |
| Conditional logic exercised | ShellSpec fixture mocks `acceptance.md` with + without field |

### AC-3 · 4 P6 scripts accept new dimensions

| Script | Change | Verification path |
|---|---|---|
| `scripts/preflight-review.sh` | Category-aware: detects `Category:` in slice acceptance.md; iterates `[security, prototype-readiness, style]` for prototype, `[security, correctness, style]` for production. Canvas-fidelity CI-only. | Bash syntax check (`bash -n`) + auto-review pipeline integration on this PR |
| `scripts/validate-finding-envelope.sh` | Specialist allowlist extended to `reviewer-prototype-readiness` + `reviewer-canvas-fidelity` | Bash syntax + auto-review pipeline integration |
| `scripts/spawn-multi-reviewer.sh` | `--dimensions <csv>` flag added; default unchanged; auto-review.yml updated to pass dimensions explicitly | Bash syntax + auto-review pipeline integration on this PR |
| `scripts/auto-review-filter-prior.sh` | Case statement accepts `canvas-fidelity` | Bash syntax + auto-review pipeline integration |

The auto-review pipeline running on this PR exercises every script path (brief.compose calls validate-envelope on each specialist's output; spawn-multi-reviewer's aggregate iterates via the new --dimensions flag; filter-prior fires when differential-mode is active). Standalone ShellSpec fixtures for each script deferred per AC-3 §Out of scope.

### AC-4 · Synthetic fixture covers canvas-fidelity regression

| Verification | Evidence |
|---|---|
| Fixture pair exists | `ls tests/personas/synthetic/canvas-fidelity.diff tests/personas/synthetic/expected/canvas-fidelity.json` |
| run-synthetic.sh invokes persona | `grep canvas-fidelity tests/personas/run-synthetic.sh` |
| match-synthetic.sh confirms flag | `grep canvas-fidelity tests/personas/match-synthetic.sh` |
| Workflow path-filter extended | `grep canvas-fidelity .github/workflows/persona-synthetic-fixtures.yml` |
| ANTHROPIC_API_KEY-absent skip | Workflow exits 0 with neutral when secret absent (forks unaffected) |

### AC-5 · Calibration report captures user feedback

| Verification | Evidence |
|---|---|
| File exists | `ls docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` |
| §"User feedback verbatim" section present | `grep "## User feedback verbatim" docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` |
| 4 structured findings with canvas L-refs | `grep -c "^### Finding" docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` (≥4) |
| Speculative findings section present | `grep "## Speculative findings" docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` |
| Mapping table present | `grep "## Mapping to rebuild-slice ACs" docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` |
| §Status footer present | `grep "^## Status" docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` |

### AC-6 · CLAUDE.md + spec 72c updates

| Verification | Evidence |
|---|---|
| CLAUDE.md §"Visual direction" AC-as-canvas-quote rule | `grep "AC-as-canvas-quote" CLAUDE.md` |
| CLAUDE.md §"Hard controls" canvas-fidelity row | `grep "canvas-fidelity" CLAUDE.md` (in Hard controls table) |
| Spec 72c §4 personas table extended | `grep "canvas-fidelity" docs/workspace-spec/72c-multi-agent-review-framework.md` (in §4) |
| Spec 72c §7 synthetic-fixtures section extended | `grep canvas-fidelity docs/workspace-spec/72c-multi-agent-review-framework.md` (in §7) |

## Preview-deploy verification (spec 72a)

Not applicable — this slice is `category: infrastructure`, no UI surface. Six-dim rubric does not fire. No deployed preview to verify.

## Architectural deferrals

- **Persona ROI verdict deferred to first 3 prototype-with-canvas slices.** Per CLAUDE.md §"Persona retain/drop metric": *"if the agent catches at least one issue the main conversation missed per 2-3 slices, retain. Otherwise drop."* Calibration evidence at this slice's ship validates the persona works against current main; sustained ROI verdict requires 3 prototype slices to elapse with the gate active. Tracked.
- **Visual fidelity rebuild on pre-signup-interview.** This slice's calibration-report.md seeds the rebuild slice's AC list. The rebuild ships separately (`S-PROTO-canvas-fidelity-rebuild` next slice in sequence).
- **Cross-canvas pattern lifting.** The persona compares slice diff against linked canvas only — does not detect when one screen's canvas pattern (e.g. ScreenShell chrome from O2) should be applied to other canvases (e.g. O1, O3). Pattern-application discipline lives at AC-as-canvas-quote (each AC quotes its specific canvas; rebuild slice authors quote each canvas's chrome separately). The gate surfaces drift on the canvas of record for the slice; cross-canvas consistency is an AC-authoring concern, not a gate concern.

## Loveability decisions committed

(None at this slice — purely additive infrastructure with no UI surface.)

## Status
- 2026-05-10: skeleton authored at slice setup; ACs 1-6 evidence-recipe scoped.
