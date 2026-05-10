# Session 81 retro — canvas-fidelity gate (S-INFRA) + 5 new canvases decoded + 1 in-flight bug fix

## What happened

Session 81 reframed mid-session from the SESSION-CONTEXT-suggested P3+P6 pairing into a control-plane gate-shipping slice + canvas-content drop, after user surfaced visual-fidelity gaps in the deployed pre-signup-interview prototype that weren't being caught by any auto-review specialist.

**Shipped on `claude/canvas-refactor-session-81-I4X8l`** (PR #137, open at wrap):

- `S-INFRA-canvas-fidelity-gate` slice — new specialist persona `reviewer-canvas-fidelity.md` (146L, 6 categories) + auto-review.yml routing (Linked canvas: field detection + 4-dim matrix + per-canvas brief composition) + `spawn-multi-reviewer.sh --dimensions` flag + 3 supporting P6 script extensions + synthetic regression fixture pair (.diff + .canvas + expected.json) + 5-doc slice scaffolding + CLAUDE.md §"Visual direction" AC-as-canvas-quote discipline + §"Hard controls" canvas-fidelity row + spec 72c §4 personas table extension to 5 rows + §7 canvas-fidelity fixture paragraph
- 5 new bundled-HTML canvases dropped at `docs/design-source/`: 2 root-level files moved into slug subdirectories (`pre-signup-interview/desktop/` + `pre-signup-interview/`); all 5 decoded via `scripts/decode-bundler-canvas.sh` to readable siblings under `decoded/`
- Calibration report `docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` captures user feedback verbatim (turn-3 visual-fidelity observations) + 4 structured findings each with canvas L-refs + 6 speculative findings the gate's first-run is expected to surface + mapping to seeded ACs for the rebuild slice
- 1 in-flight aggregator-bug fix on auto-review.yml arg ordering (positional `<dir>` had to come before `--dimensions <csv>` flag); fix in `e7f1fdd`, CI re-fires on push

**Final state at wrap (`e7f1fdd` on PR #137):**

- 10 atomic commits across the branch
- Vercel preview READY · Lint · Typecheck · Tests · audit · build · synthetic-fixtures · golden-replay · all 3 specialist auto-review runs · Coverage · ESLint-no-disables — all GREEN
- Aggregator job: failed initially due to arg-order bug; re-fires after `e7f1fdd` push
- `spec-citation-quote-check`: failure on each push; UNRESOLVED at wrap; investigation deferred to session 82 turn 1
- PR description updated post-canvas-drop to reflect 9 commits + canvas-content additions
- User feedback durably preserved in calibration-report.md regardless of merge outcome

## What went well

- **User pushback caught the framing miss.** Session 81 opened with the SESSION-CONTEXT-suggested P3+P6 pairing (inline-style refactor + auto-review cleanup). User reviewed deployed prototype during turn 1 and surfaced visual-fidelity gaps that no automated check would have caught. Reframed mid-session to gate-shipping slice. Without the user's hands-on review, session 81 would have shipped P3+P6 against a hidden quality problem.
- **AC-as-canvas-quote rule discovered + ratified atomically with the gate.** The discipline rule ("UI ACs must quote canvas verbatim with file:line") is the prompt-discipline half; the canvas-fidelity persona is the mechanical half. They reinforce each other. Shipped together so they ship as a complete protocol.
- **Calibration report captures feedback durably.** User's specific observations (title bold/italic split missing · sub-Q label sans not serif · header chrome missing · step pill geometry) preserved verbatim in slice doc that survives across sessions. Independent of the gate's first-run outcome — feedback won't reset.
- **5 bundled-HTML canvases decoded systematically.** All 5 passed CLAUDE.md sanity check (≥1000L + 50+ divs); `scripts/decode-bundler-canvas.sh` ran clean on each; readable siblings now consumable by AC-as-canvas-quote at slice authoring time + the canvas-fidelity gate at PR review time.

## What could improve

- **Session line-count threshold tripped by content commits.** The 16k-line decoded-canvas commit pushed cumulative session churn past the 2000-line wrap threshold immediately on landing. The threshold is fit-for-purpose for code-only sessions but not for content-drops (decoded canvases are auto-generated readable artefacts, not authored code). Future: consider a hook exemption for content under `docs/design-source/*/decoded/**` or for commits matching `chore(canvas-decode):*` pattern. Workaround at session 81 wrap: respected the STOP, deferred remaining tasks (spec-citation-quote-check fix · preflight-review.sh same-bug-different-callsite fix · rebuild slice scoping) to session 82.
- **Aggregator arg-order bug shipped to CI before being caught.** I added the `--dimensions` flag to `scripts/spawn-multi-reviewer.sh` but called it `--dimensions <csv> <dir>` instead of `<dir> --dimensions <csv>` (matching the parser's existing positional-first convention). Bug only surfaced when the workflow ran on PR #137. Lesson: when adding a flag to an existing CLI, match the parser's established positional/flag ordering by reading the case-statement before the call site. Mitigation: 1-line fix shipped in `e7f1fdd`; same bug in `preflight-review.sh` not yet fixed (local-only, not CI-blocking).
- **`spec-citation-quote-check` failure not diagnosed pre-wrap.** The check has been failing on every push to PR #137. Likely cause: my CLAUDE.md amendments + slice docs make many "per spec X §Y" claims without verbatim quotes immediately following. The new AC-as-canvas-quote rule literally instructs verbatim-quoting; ironic that the slice introducing it doesn't yet comply. Investigation deferred to session 82 turn 1.

## Key decisions

- **Gate before rebuild (sequencing choice).** User offered ABCD options for sequencing the gate vs the rebuild; picked C+B = gate first, then rebuild benefits. Rationale: gate's first live run on the rebuild PR is the calibration moment. If we built rebuild first, gate calibration evidence couldn't be captured.
- **Bundled gate + P6 script cleanup into one PR.** Both control-plane (CODEOWNERS-protected). Single admin-bypass click at merge. Saves a PR.
- **Calibration report is author-time + post-merge.** Author-time: capture user feedback verbatim + structured findings. Post-merge: append the gate's first live-run output as evidence. Two-phase fill mirrors the §Status footer convention.
- **AC-as-canvas-quote ratified as CLAUDE.md rule + inserted at gate-shipping time.** Could have been a separate session's discipline-update slice; bundled here because the gate without the rule is half a protocol.
- **5 new canvases land on the gate PR (option a).** User offered (a) leave-them-here vs (b) move-to-separate-PR. Picked (a) for simplicity. Trade-off: PR description scope expands beyond gate-only; mitigation: PR description updated to acknowledge the canvas-content addition as additive.

## Bugs found + how fixed

- **`spawn-multi-reviewer.sh aggregate` arg-order bug** — `--dimensions <csv>` placed before positional `<dir>` in auto-review.yml call site; parser reads `<dir>` first then flags, so `--dimensions` got assigned as the directory. Fix: flip to `<dir> --dimensions <csv>` matching parser's established convention. Same bug in `preflight-review.sh` (local-only) — fix deferred.
- **`Mobile Screens v2 - Standalone (2).html` decode failure** — file is plain-HTML, not bundled (no `<script type="__bundler/template">`). Decoder correctly refused. No fix needed; the file is already directly grep-able.

## Persona findings recorded (PR #137 — pending at wrap)

PR #137 has not yet produced an aggregated auto-review verdict at wrap (aggregator failed on first push due to arg-order bug; re-fires after `e7f1fdd`). The 3 specialists each individually emitted `success` (no findings). Final verdict + retain/drop signal recorded at session 82 turn 1 once the aggregator runs clean.

## Next session priorities (for session 82 kickoff in `SESSION-CONTEXT.md`)

User picks scope from these candidates (any 1-3 plausibly fit a single session):

1. **Re-verify PR #137 CI + merge.** Aggregator fix in `e7f1fdd`. Confirm CI green on next run. Address `spec-citation-quote-check` failure (likely needs verbatim quotes added wherever "per spec X" appears in slice docs). Admin-bypass click + merge to main.
2. **Inspect decoded canvases + scope rebuild slice.** Read decoded canvases (grep first for structure) to map: which screens does each cover · does `Pre-signup Canvas` supersede the per-screen canvases · does `Mobile Screens v2` cover both viewports · is the Help Rail a separate component or built into desktop layout · what does Welcome Tour add. Output: rebuild slice's `Linked canvas:` field declared + draft AC list per AC-as-canvas-quote.
3. **Open rebuild slice PR (gate's first live run).** Branch off main; ship rebuild slice with `Linked canvas:` declared; canvas-fidelity gate fires for the first time = calibration evidence captured.
4. **`preflight-review.sh` arg-order fix.** 1-line fix; same bug as auto-review.yml had. Local-only, not CI-blocking.
5. **Decide on `Decouple.zip` unpacking.** Carries 17 sub-canvases including Master Components + Decisions Log. Defer unless rebuild scope expands beyond pre-signup.

## Constraints unchanged

#1-#39 preserved. No new constraints introduced session 81.
