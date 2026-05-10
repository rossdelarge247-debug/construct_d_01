# Session 83 retro — canvas-fidelity orchestrator fix · single-canvas attempt · multi-canvas restoration after live calibration

## What happened

Session 83 opened with PR #140 (S-PROTO-canvas-fidelity-rebuild scaffold) carrying one explicit deferred item in `verification.md` §"Architectural deferrals": the canvas-fidelity orchestrator's `brief.compose` step word-split `$CANVAS_PATHS` on whitespace, fragmenting any canvas path containing a space. PR #140's `Pre-signup Canvas - Standalone.html` (3 spaces) became 4 fragments → empty `<linked-canvas>` fence → persona surfaced a `question · missing-element` finding instead of evaluating against canvas content. The kickoff named this as P1.

**Two PRs shipped this session, both addressing the same root concept (orchestrator handling of canvas paths) but with opposing convention calls:**

### PR #142 — `fix(auto-review): canvas-fidelity orchestrator handles paths-with-spaces`

Single-canvas-per-slice convention. After offering 3 routes (single-canvas only · comma-separated multi-path · quote-aware multi-path) the user picked single-canvas only as the simplest fix. Three surfaces aligned:
- `.github/workflows/auto-review.yml` — drop the loop, rename `CANVAS_PATHS` → `CANVAS_PATH`, quote at every consumer site
- `CLAUDE.md` §"Linked canvas: field convention" — `<path>` instead of `<path1> <path2> ...`
- `.claude/agents/reviewer-canvas-fidelity.md` — input description: canvas (singular)

CI: 25/25 success. Auto-review verdict: `approve` (3 specialists, no findings). Merged at `2f8bc48`.

### PR #143 — `fix(auto-review): restore multi-canvas support with comma-separator`

Same-session reversal. After PR #142 merged, the user updated PR #140's branch from main and the canvas-fidelity gate ran for the first time against a fixed orchestrator. **The orchestrator fix worked** (`compose briefs` succeeded; aggregator's `praise · ac-gap` cited the variable rename verbatim). But the canvas-fidelity specialist itself crashed at 11s — exit code 1, no stderr in the log.

Diagnosis trail:
1. Initial hypothesis: API request-too-large from the 10.8MB combined `Pre-signup Canvas - Standalone.html`.
2. User shared the failed step's log; lines 2-19 were the workflow definition (not runtime output) — actual runtime stream between `set -euo pipefail` and exit code 1 was completely empty.
3. The signature reads as: `claude -p` with `--output-format=json` writes errors as JSON to **stdout** → stdout redirected to `/tmp/raw-${DIM}.json` → the diagnostic block at workflow L290-292 (`head -50 "/tmp/raw-${DIM}.json"`) **never ran** because `set -e` killed the shell at L287 before the diagnostic.
4. Synthetic-deliberate-injection (914-byte fixture) keeps passing → the persona, schema, and parser all work. The differential is purely input size.

Per-screen decoded HTML files exist alongside the combined canvas: `o2-your-situation-expressive.html` (10KB) through `o6-what-matters-to-you-expressive.html` (24KB). Total for O2-O6 = ~107KB. Comfortably fits in a brief.

User picked route 2 from a 6-row option matrix: restore multi-canvas with comma-separator + per-screen files. Three surfaces re-aligned (mirroring #142 in reverse):
- `.github/workflows/auto-review.yml` — `CANVAS_PATHS` (plural) parsed via comma-split into bash array (`IFS=',' read -ra`); per-path canonicalisation + workspace guard inside the loop; whitespace within paths preserved by the comma-only delimiter
- `CLAUDE.md` §"Linked canvas: field convention" — `<path1>, <path2>, ...` syntax; single canvas = degenerate one-element list; explicit "must not contain commas" constraint added round-2
- `.claude/agents/reviewer-canvas-fidelity.md` — restore "multiple canvases concatenated... per canvas" persona input description

**Round-1 auto-review on PR #143:** `request-changes` (informational at v3b ship) — 3 findings:
- `issue · edge-case` (correctness): CLAUDE.md says "paths may contain spaces" but doesn't prohibit commas — addressed by adding "must not contain commas" constraint to the convention text
- `praise · security` (security): per-iteration path-traversal guard correctly preserved — no action
- `suggestion · edge-case` (correctness): silently skipped missing files mask multi-canvas typos — addressed by adding `::warning::` echo in the `else` branch of `[ -f "$canvas_path" ]`, mirroring the out-of-workspace warning

**Round-2 auto-review on PR #143:** `approve` — 1 finding (the same `praise · security` repeated). 25/25 CI checks green. Ready to merge at session wrap.

### PR #140 status at wrap

Open draft. The slice-author update (change `Linked canvas:` from the 10.8MB combined file to comma-separated per-screen files; re-quote 4 ACs at per-screen line numbers — currently citing combined-canvas L941, L990, L1063-1066, L1079-1080) is queued for next session post-#143 merge. Calibration data for canvas-fidelity persona findings 1-4 still unavailable.

## What went well

- **Diagnosis trail held under uncertainty.** The 11s runtime + clean exit code 1 + zero stderr could have been any of: API rejection, rate limit, auth blip, claude-code CLI bug, OOM. Triangulating the actual cause came from comparing the synthetic fixture's success (914B → passes) against PR #140's failure (11MB → fails) and noticing that the workflow's diagnostic block was gated behind the very failure it was meant to diagnose.
- **Same-session reversal handled honestly.** PR #143's commit message and PR description explicitly acknowledged that PR #142's single-canvas convention was a guess invalidated within the hour. Two consecutive PRs flipping the same convention is normally a smell; the data justified it. The PR description named the trade-off rather than soft-pedalling it.
- **Round-1 findings on #143 were both small + tractable.** No architectural pushback; just two unambiguous correctness improvements (comma prohibition + missing-file warning). Round-2 verdict flipped to `approve` cleanly.
- **The user's "investigate logs" instruction unlocked the diagnosis.** I had a strong hypothesis (canvas-too-large) but only direct log inspection confirmed the empty-runtime-stream signature. Without that confirmation, I might have jumped to a fix that addressed the wrong layer.

## What could improve

- **Initial route call (single-canvas only) was made without the data point that real canvases are 10MB+.** I presented the 3 routes as if they were equivalent on data-cost; in reality the data was already in the repo (`ls docs/design-source/pre-signup-interview/decoded/`) and I could have surfaced the file-size constraint at decision time. Lesson: when offering routes for a workflow that handles real-world artefacts, check the size distribution of those artefacts in-repo before framing options.
- **Diagnostic block gated behind the failure.** Workflow L290-292 (`head -50 "/tmp/raw-${DIM}.json"`) only runs if `claude -p` exits zero. With `set -e`, the very output that would tell us why claude-p failed never reaches the log. This is a separate workflow improvement that didn't ship this session — recorded in next-session priorities below.
- **Same-session flip-flop carries spec-amendment cost.** PR #142 amended CLAUDE.md L420 to "single canvas per slice"; PR #143 amended it back to comma-separated multi-canvas. Each amendment requires a `Status` footer update on the spec section (forthcoming) and breaks any in-flight reader's mental model. Future: when proposing a constrained-then-relaxed convention, prefer the more general form on first ship if the data isn't conclusive.

## Key decisions

- **PR #142 single-canvas convention vs multi-path retention (turn-3 trade-off).** Picked single-canvas based on "no slice on main currently uses multi-path" + "smallest diff." Reversed within an hour when PR #140's re-fire surfaced the multi-path real-world need. Decision-level retro: the data was available pre-decision; the framing of options was the gap, not the user's pick.
- **Route 2 (multi-canvas with per-screen files) over route 1 (strip inline `<style>`).** Strip-style would have preserved the single-canvas convention but lost CSS-treatment fidelity in the comparison (the persona could no longer verify token values from canvas itself, only structure). Route 2 keeps full fidelity at the cost of restoring multi-path support.
- **Comma-separator over space-separator (multi-canvas restoration).** Comma is unlikely in filenames; space is common. The original session-81 convention used space → broke on PR #140. Comma fixes both the original word-split bug AND the multi-path requirement in one stroke.
- **Wrap docs on a separate branch off main, not bundled with PR #143.** Session 81 bundled wrap docs with the slice PR. Session 83 has TWO PRs — bundling docs with one muddles its scope. Separate handoff PR keeps each PR's review focus tight.

## Bugs found + how fixed

- **`brief.compose` word-split on canvas paths-with-spaces** — `for CANVAS_PATH in $CANVAS_PATHS` (unquoted) at workflow L184 fragmented `Pre-signup Canvas - Standalone.html` into 4 word-tokens. Fixed in PR #142 (drop loop, single-canvas convention) + corrected to multi-canvas with comma-separator in PR #143 (`IFS=',' read -ra` preserves whitespace within each comma-delimited entry).
- **Canvas-fidelity persona crash on 10.8MB combined canvas** — Anthropic API request-too-large rejection (most likely; not directly verifiable due to gated diagnostic). Architectural fix: switch slice's `Linked canvas:` to per-screen files (10-30KB each) instead of the combined 10.8MB monolith. Workflow now supports this via PR #143's comma-separator. Slice-author work to actually update PR #140 deferred to next session.
- **Workflow diagnostic block gated behind the failure it diagnoses** — L290-292 (`head -50 /tmp/raw-${DIM}.json`) sits AFTER the `claude -p` call but `set -euo pipefail` exits the shell on the first non-zero. Result: when claude-p fails, we never see its stdout (the JSON-error envelope). NOT FIXED this session; recorded as next-session candidate.
- **Round-1 #143 finding: missing-file silent skip** — when a multi-canvas list has a typo'd path, the loop silently emitted no BEGIN/END block for that entry. Fixed: added `::warning::` echo in the `else` branch of `[ -f "$canvas_path" ]`, mirroring the existing out-of-workspace warning at the same call site.

## Persona findings recorded

PR #142 (3 specialists, post-flip): single round, `approve` verdict, 0 findings. Specialists were aligned; nothing to retain/drop.

PR #143 round-1 (3 specialists): `request-changes` verdict, 3 findings:
- `correctness` flagged 2 (issue · comma-ambiguity, suggestion · missing-file silent-skip) — both actionable + addressed
- `security` praised 1 (per-iteration path-traversal guard correctly preserved) — informational
- `style` no findings

PR #143 round-2 (3 specialists, differential mode): `approve`, 1 finding (the same `security` praise repeated). The two correctness findings closed cleanly via the round-1 fix-up.

**Retain/drop signal:** retain all 3 specialists (security · correctness · style). Each surfaced ≥1 actionable issue across PR #142 + PR #143. Canvas-fidelity persona's first-real-fire calibration data still pending — blocked on PR #140's slice-author update post-#143 merge.

## Next session priorities (for session 84 kickoff in `SESSION-CONTEXT.md`)

1. **Verify PR #143 merge state at session start.** If still open, surface for user to merge. If merged, proceed to P2.
2. **Update PR #140's `Linked canvas:` field to comma-separated per-screen files.** Replace the single 10.8MB `Pre-signup Canvas - Standalone.html` with `o2-your-situation-expressive.html, o3-your-ex-and-safety-expressive.html, o4-employment-complexity-expressive.html, o5-partner-finances-expressive.html, o6-what-matters-to-you-expressive.html` (covering AC scope O2-O6). Re-quote the 4 ACs against per-screen line numbers — currently citing combined-canvas L941, L990, L1063-1066, L1079-1080. Effort: medium (read-heavy; line numbers differ per per-screen file).
3. **Re-fire PR #140 auto-review post-update.** Capture canvas-fidelity persona's first real verdict against per-screen content. The 4 ACs map to S-INFRA-canvas-fidelity-gate's calibration findings 1-4; this is the calibration moment session 81 promised.
4. **Workflow diagnostic-gate fix (small workflow-only PR).** Either (a) put `|| true` on the npx call so the diagnostic always runs, or (b) also upload `/tmp/raw-${DIM}.json` as a debug artifact (regardless of envelope status). Without this, the next time a specialist's `claude -p` invocation fails, we'll be back to inferring from absence.
5. **(Inherited) Spec 65 amendment to capture quantitative profiling data** — still parked from earlier sessions. Out of scope unless explicitly added.

## Constraints

#1-#39 from prior sessions preserved. No new constraints introduced session 83.
