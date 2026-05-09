# Session 77 retro — S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates SHIPPED

## What happened

Single substantive PR merged. **PR #129** (P0 ship rigour-v3d, squash `af919fb`) — six controls operationalising the corrective discipline scoped after the session-76 prototype regression where structural fidelity shipped without canvas fidelity (canvases grep'd not decoded; spec citations paraphrased not quoted).

Six controls in 25 files / +1586 / -37:

- `scripts/decode-bundler-canvas.sh` — bundled-HTML → readable inner HTML+CSS via `jq -r .` on the JSON-encoded `<script type="__bundler/template">` content. Author-time tool; outputs to sibling `decoded/<file>.html` (or stdout). Fails-loud on existing output unless `--force`.
- `scripts/canvas-decode-check.sh` + `.github/workflows/canvas-decode.yml` — merge-time gate. Slice `acceptance.md` files citing `docs/design-source/<slug>/<file>.html` must ship the decoded sibling OR carry an explicit `- canvas-decode-waiver: <ref> — <reason>` line in the slice's `verification.md`. Files absent from the tree are skipped.
- `.claude/hooks/spec-citation-quote.sh` — PostToolUse:Write|Edit author-time advisory. Catches `per spec NN[a]` and `spec NN[a] §"section"` citation forms (claim, not doc-pointer) lacking a literal-text proximity quote within 5 lines. Stub-mode: emits `systemMessage`. Live-mode (`SPEC_QUOTE_ENFORCE=1`): exit 2.
- `scripts/spec-citation-quote-check.sh` + `.github/workflows/spec-citation-quote.yml` — merge-time CI mirror. Stricter than the author-time hook: additionally fuzzy-matches the local quoted text against the cited spec file's content (50-char substring slide; whitespace-normalised). Catches fabricated quotes.
- `scripts/spec-citation-patterns.sh` — single-source-of-truth shared catalogue (regex + path-scope + skip-list + §Status fence-aware stripper) sourced by both the hook and the CI mirror. Drift between the two would suppress real findings or fire false positives.
- `.claude/agents/plan-architect.md` Q6 amendment — extends the 5-question rubric to 6, adding source-artefact verification (Have you decoded any cited bundled-HTML canvases? Have you read each cited spec section in full?). Synthetic-deliberate-injection fixture + expected JSON ship alongside.
- **AC-8 self-application proof.** The slice's own `acceptance.md` + `security.md` + `test-plan.md` + `verification.md` pass both the AC-3 hook and AC-4 CI mirror. The dogfood is the first acceptance criterion of the criterion's enforcement.

4 shellspec specs / 38 examples / 0 failures.

## Round-by-round

**Round-1 auto-review on `a187848`:** verdict `request-changes`, 9 findings (all non-blocking).

| # | Label | Category | Disposition |
|---|---|---|---|
| F1 (×11) | issue | commenting | Removed `Per docs/slices/...` provenance lines from 11 new files |
| F2 | issue | commenting | Removed `Sourced by:` caller-list block from `spec-citation-patterns.sh` |
| F3 | issue | commenting | Dropped `# jq -r .` WHAT-narrating comment |
| F4 | issue | edge-case | Switched `grep -qE` to `awk index($0, prefix) == 1` fixed-string match (real adversarial-path: `file.html` ref matching `fileXhtml` waiver via ERE-dot wildcard) |
| F5 | nitpick | simplicity | Deferred — checkmark-emoji→Done changes came from cherry-picked wrap-check fixes (`fc8272b`), not this slice's authoring |
| F6 | question | ac-gap | AC-7 wording clarified — `tests/personas/synthetic/**` wildcard already covers fixtures |
| F7 | suggestion | ac-gap | AC-1 fixture path corrected to actual shipped path |
| F8 | suggestion | ac-gap | AC-3 wording: explicit settings.json-registration deferral |
| F9 | suggestion | security | `security.md` AC-1 threat-model rewritten — dropped overstated realpath claim; corrected `fs.readFileSync` → bash `cat`; honest author-time-trusted-content framing |

**Round-2 patch (`a021dc2`):** 8 of 9 addressed; F5 deferred-with-reasoning in commit message.

**Round-2 auto-review:** verdict `approve`, 1 finding (F5 nitpick). Shadow monitor confirmed `k=1 = nit-only`, `k=3 = approve` — deferral robust across quorum thresholds. All 27 check-runs green.

Squash-merged at `af919fb`.

## What went well

- **AC-8 self-application caught the failure mode it was designed for at impl time.** When authoring `acceptance.md` I initially typed `per spec 72d §5 Q6` without a proximity quote; the dogfood run flagged it; added the literal quote; passed. The slice that ships the rule is the slice the rule first finds bugs in.
- **Plan-time review's fabricated 500L finding was overridden with documented reasoning rather than blindly addressed.** Plan-architect persona claimed the slice was structured with a 500-line acceptance.md without budget-partition; the actual file was 311 lines at the time. Override + commit-message documentation preserved the planned structure rather than applying a fix to a non-existent problem.
- **Three substantive bugs caught during impl, not at review:** (a) mawk multi-byte `§?` regex incompatibility — switched to `(§)?`; (b) bash `nullglob` ls fallback when no matching files; (c) GLOB-string vs separate-args arg parsing in shellspec setup.
- **Round-2 verdict flipped from `request-changes` to `approve` cleanly.** 8 of 9 findings addressed; the deferred 1 was a true nitpick (cosmetic substitution from a separate commit's enforcement) not a quality issue.

## What could improve

- **The kickoff treated rigour-v3d as a fresh-build P0 but the cherry-picked `fc8272b` brought along checkmark-emoji→Done cleanup on SESSION-CONTEXT.md from session 76's wrap.** This created auto-review noise (F5 nitpick) that took explanation rather than being caught at the cherry-pick time. Lesson: when cherry-picking commits across branches, audit the diff for non-related changes that will read as scope creep on the receiving branch.
- **Plan-architect's fabricated 500L finding was a reminder that persona output is suggestion not source-of-truth.** Verifying via `wc -l` before acting was the discipline that saved a wasted refactor. Author-time read-discipline (CLAUDE.md §"Distrust your own summaries") generalises to subagent output: distrust the persona summary; verify against the source.
- **Round-1 had 11 commenting findings.** The "Per docs/slices/..." header convention was widespread in pre-existing repo code, but per CLAUDE.md §"Comments: WHY not WHAT" it's an anti-pattern in persistent code. Sweep on adjacent files (existing .claude/hooks/* and .github/workflows/*) is a future cleanup PR — not bundled into rigour-v3d to keep the slice scope tight.

## Key decisions

- **Squash-merge over plain merge.** PR #129 had 6 atomic commits (docs · impl · AC-5/6/7 · round-2 fixes · 2 wrap-fix cherry-picks); squash kept main linear per repo convention. The atomic history is preserved in the PR diff.
- **Bundled the AC-8 self-application proof into the slice rather than a follow-up PR.** Dogfood-as-first-AC made the slice prove its own correctness at land time. A follow-up PR would have shipped infrastructure that nothing actually used until later.
- **Settings.json registration of the spec-citation-quote hook is deferred to a follow-up `control-change`-labelled PR.** The hook ships, is executable, has shellspec proving correctness — but harness wiring is a control-plane change separate from the slice's contract. AC-3 wording made this explicit in round-2 patch.
- **F5 nitpick deferred-with-reasoning rather than reverted.** The checkmark-emoji→Done substitutions in SESSION-CONTEXT.md came from `fc8272b` (session-76 wrap-check fixes); reverting on this PR would undo legitimate prior cleanup and would not benefit this slice's scope.

## Bugs found + how fixed

1. **mawk multi-byte regex.** `[[:space:]]§?[[:space:]]` worked under gawk but mawk dropped the literal `§?` (treating multi-byte char + `?` quantifier oddly). Fix: `[[:space:]](§)?[[:space:]]` (group then optional).
2. **`ls fixtures/*.html` fails when nullglob unset + no match.** Workaround: explicit `compgen -G "fixtures/*.html"` check before iteration.
3. **GLOB-string passed as single arg vs separate args in shellspec test setup.** Test was passing `"$TMP/docs/slices/S-*/*.md $TMP/docs/workspace-spec/*.md"` (single string) but the script expected separate args. Fixed by passing as separate `"$TMP/...slices/..." "$TMP/...workspace-spec/..."`.

## Persona findings recorded (informational — slice is `infrastructure`, not `src/`)

| Persona | Round 1 | Round 2 | Issue main missed (Y/N) |
|---|---|---|---|
| reviewer-security | 1 (F9 realpath claim) | 0 | Y — overstated security claim wouldn't have surfaced from main-conv self-review |
| reviewer-correctness | 4 (F4, F6, F7, F8) | 0 | Y — adversarial-path edge case (F4) was non-obvious; AC-doc drift (F6/F7/F8) easy to miss |
| reviewer-style | 4 (F1, F2, F3, F5) | 1 (F5 only — deferred) | Y — provenance comments + WHAT-narration were widespread habits, persona caught them |
| plan-architect | 1 fabricated finding (500L threshold) | n/a | N — false positive; verified via `wc -l` |
| reviewer-prototype-readiness | n/a (infrastructure slice; not invoked) | n/a | n/a |

Calibration cohort row 1 (`S-PROTO-hub` session 74) remains the only src/ entry; rigour-v3d is infrastructure-category. Retain/drop persona verdicts continue to wait for first 3 src/ slices.

## Next session priorities

**P1 · Refactor `S-PROTO-pre-signup-interview` against decoded canvases + literal spec re-reads.** Now unblocked by rigour-v3d landing on main. Branch: `claude/proto-presignup-interview-Okucr` (resync from main first). Per per-prototype 4-step loop, this session covers steps 3 (absorb canvas) + 4 (construct).

Order of operations:
1. Resync prototype branch from main: `git fetch origin main && git checkout claude/proto-presignup-interview-Okucr && git rebase origin/main` (or merge if rebase touches too much).
2. Decode the three canvases at `docs/design-source/pre-signup-interview/` via `scripts/decode-bundler-canvas.sh`. Decoded siblings ship under `decoded/`.
3. Read in full (offset+limit batches): spec 65 (pre-signup-interview-reconciled) + spec 42 (strategic synthesis §"Phase 1") + spec 76 (prototype-mode-rigour §3 + §6).
4. Pre-construction discussion: confirm with user the 8-screen treatment + RadioCard ring + ScreenShell type-weights + PlanSection card style + JourneyTimeline visual anchor — explicit per-screen sign-off before any src/ edits.
5. Construct: refactor each component to match decoded canvas. Each src/ touch fires the spec-citation-quote hook + the canvas-decode-check CI gate now that rigour-v3d is live.

**P2 (alternative if P1 blocks on canvas absorption):** F-PA2 deferred matrix-consistency fitness function (spec 76 §8 — verify the per-category gate-behaviour matrix matches the implementing files' behaviour at each amendment).

## Constraints unchanged

#1-#39 preserved. No new constraints from session 77 — the rigour-v3d slice operationalised existing constraints (#39 sweep-your-own-diff, #29 pre-priority spec-gate verification) into automation rather than introducing new ones.
