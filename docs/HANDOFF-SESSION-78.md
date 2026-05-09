# Session 78 retro — canvas-coverage diagnostic + canvas prompts authored

## What happened

Pivoted from straight P1 refactor (per session-77 wrap priority) to **canvas-coverage diagnostic** when investigation of decoded canvas content surfaced a gap. The kickoff plan assumed all 3 committed canvases under `docs/design-source/pre-signup-interview/` carried inlined React; only o1 did. P1 refactor would have reverse-engineered visual treatment for o7-o8 from spec text rather than from canvas-output — exactly the regression session-76 corrected and rigour-v3d now gates against. Session pivoted to canvas-prompt authoring so session 79 can decode-and-refactor against complete canvas coverage.

**No PR shipped.** Two commits on branch `claude/proto-presignup-interview-Okucr` (now 10 ahead of origin/main):

- `88b99d6` — decoded canvases committed: o1-stage-router-expressive (1295L; full React layout) · o1-stage-router-standalone (1272L; full React layout) · o7-your-plan-expressive (922L; CSS only — broken).
- `d833ce5` — canvas prompts: `o7-canvas-prompt.md` updated v1→v2 (explicit inline-React directive); `o8-canvas-prompt.md` NEW (exit-screen twin of O1, 4-option radio).

Plus a merge commit (`13d3691`) bringing rigour-v3d gates from origin/main onto this branch's CI.

## What went well

- **Investigation surfaced the bundling failure mode before refactor began.** The user asked "are the canvases enough to refactor against?" — the decoded sibling for o7 was 922 lines (suspiciously close to o1's 1295 but missing layout depth). `grep -c "<div"` on the two showed 0 vs 200+. Root cause: o7 v1 used external `<script type="text/babel" src="…sandbox-bundler-canvas/<uuid>.js">` references that don't survive export. Catching this BEFORE writing src/ saved a refactor based on guess-work.
- **Canvas-prompt template re-used cleanly.** The session-76 `o7-canvas-prompt.md` was a good structural template (paste-ready prompt · content sub-elements · loveability decisions · style anchors · negative constraints · output expectation). Adding the §"Bundling requirement" section to v2 and to the new o8 prompt re-used 80% of the structure. The o1 canvases provided the bundling reference: "match the o1 inlining pattern; runtime CDN OK; no sandbox-bundler-canvas src refs; offline-reload survival check."
- **User pivot decision was clean.** When the canvas-coverage gap surfaced, AskUserQuestion offered three options (continue with partial coverage / pause for canvases / canon-derive O2-O8 from O1). User chose pause-for-canvases + give-me-the-prompt — the right call given the rigour-v3d gates now require canvas fidelity.

## What could improve

- **Session-77 wrap framing implied "canvases ready to decode" but didn't verify decoded content quality.** SESSION-CONTEXT.md said "decode the three canvases at `docs/design-source/pre-signup-interview/`" — true but incomplete. After decode, the next discipline should be `wc -l decoded/*.html` + `grep -c "<div"` to confirm layout-bearing JSX, not just CSS bytes. Adding this verification step to the per-prototype 4-step loop §"Absorb" stage would have caught this at session-76 wrap rather than session-78 mid-session.
- **The line-count hook fired STOP at 3,498 lines after committing 3MB × 3 decoded canvases (3,492 derived).** The hook can't distinguish derived data from authored code. Worked-around by user-confirmed continue, but the threshold metric needs tuning — perhaps `git diff --numstat` excluding `docs/design-source/**/decoded/**` paths (the canonical decoded-output directory), or excluding files that match `*.html` under `docs/design-source/`. Logging this for future hook iteration; not actionable this session.
- **No formal plan-time review for the pivot.** The pivot from "P1 refactor" to "P1 = author canvas prompts first" was a multi-step plan change but didn't go through plan-architect / exit-plan-review (Path-C manual spawn). For pivots where the new plan touches docs/slices only (not src/), this is fine; for pivots that touch src/, plan-time review remains mandatory.

## Key decisions

- **Pivot to canvas-coverage first, refactor next session.** The alternative — refactor with O7-broken + O8-missing and reverse-engineer from spec text — would re-introduce the session-76 regression class that rigour-v3d explicitly gates against. The cost of one session of canvas-prompt authoring is small; the cost of refactor-on-incomplete-source is technical debt + canvas-decode-check waivers.
- **Re-use existing o7-canvas-prompt.md rather than start from scratch.** The session-76 prompt structure was good — only the bundling requirement was missing. v1 → v2 in-place edit + reference to the working o1 pattern is tighter than rewrite.
- **O8 modeled as O1 exit-twin, not as bespoke screen.** Per the o1 canon footer locking the EXPRESSIVE_HERO hero treatment to "entry & exit screens", O8 inherits the full hero treatment; same radio-card pattern; same single-question structure. This makes the o8 prompt 80% derivable from the o1 visual canon + 20% new content (4 next-action options, three exit-specific loveability decisions).
- **O2-O6 decision deferred to session 79 start.** Two viable paths: canon-derive from O1 (per its footer's calmer-EXPRESSIVE_BG inheritance) OR additional canvas prompts. Either is defensible; user can decide with full session-79 context (after P1 + P2 land the new canvases).
- **Did not commit a `verification.md` waiver for the v1 broken o7 canvas.** The waiver path (per `canvas-decode-check.sh`) exists but is the wrong instrument here — v2 will replace v1 entirely; waiving v1 would leave a "this canvas is acknowledged broken" comment in `verification.md` that rots when v2 ships. Cleaner to ship v2 and have the original v1 artifact stay un-cited from `acceptance.md`.

## Bugs found + how fixed

None. No src/ touched; no impl iterations.

## Persona findings recorded (informational — non-src/ session)

No personas spawned. No slice shipped. Calibration cohort row 1 (`S-PROTO-hub` session 74) remains the only src/ entry. Retain/drop verdicts continue to wait for the first 3 src/ slices.

## Next session priorities

**P1 · User generates O7-v2 + O8 canvases** via Claude AI Design tool using prompts at `docs/slices/S-PROTO-pre-signup-interview/o7-canvas-prompt.md` + `o8-canvas-prompt.md`. Upload outputs to `docs/design-source/pre-signup-interview/` (suggested: `o7-your-plan-expressive-v2.html`, `o8-whats-next-expressive.html`).

**P2 · Decode + verify** via `scripts/decode-bundler-canvas.sh`. Verification step (NEW, learned this session): after decode, run `wc -l decoded/<file>.html` + `grep -c "<div"` to confirm layout-bearing JSX, not CSS only. Reference: o1 decoded sibling has 1272-1295L + 200+ `<div>` elements; CSS-only sibling has 922L + 0 `<div>`.

**P3 · Resume P1 refactor** — refactor `src/app/dev/proto/pre-signup-interview/` to match decoded canvases (o1 + o7-v2 + o8). Per-screen sign-off before any src/ write. Inherits o1 canon: RadioCard ring · ScreenShell type weights · spacing · JourneyTimeline visual anchor (for o7) · radio-card pattern (for o1, o2, o6, o8).

**P4 · O2-O6 decision** — canon-derive from o1 (per its footer locking calmer EXPRESSIVE_BG for non-entry/exit) OR request additional canvas prompts. Discuss session 79 start.

**P5 (control-plane carry-over from session 77):** ship `.claude/settings.json` registration entry for the spec-citation-quote hook under a `control-change`-labelled PR. AC-3 of rigour-v3d explicitly deferred this.

## Constraints unchanged

#1-#39 preserved. No new constraints — session was a diagnostic + canvas-prompt authoring; existing constraints (#29 pre-priority spec-gate verification + #38 sweep all docs in same commit + spec 71 §7a single-branch-main) covered the work.

**Future-add candidate:** *"After decoding any bundled-HTML canvas, verify decoded sibling carries layout-bearing JSX (≈1000+ lines + 100+ `<div>` elements) — not CSS only (≈900L + 0 `<div>`). Add to per-prototype 4-step loop §'Absorb' stage."* Logging for session 79 evaluation; would land as constraint #40 if adopted.
