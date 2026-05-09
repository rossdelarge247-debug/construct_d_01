# Session 79 retro — decoder bug fix + canvas-prompt suite for O2-O6

## What happened

Session 78 attributed the o7 canvas decode failure to "external script refs that didn't survive export." Wrong diagnosis. The actual bug was that `scripts/decode-bundler-canvas.sh` only extracted the JSON-encoded `<script type="__bundler/template">` body and skipped the manifest-substitution step the in-browser loader performs. Session 79 fixed the decoder, regenerated all 3 decoded siblings clean, deleted the wrong-diagnosis v2 prompt, amended HANDOFF-78, and authored canvas-prompts for the still-missing O2-O6 screens.

**Shipped (PR #132 merged to main, `dcfa1c8`):**
- `scripts/decode-bundler-canvas.sh` — manifest extraction · per-UUID base64 → optional gunzip → re-encode for data: URL · text/babel src tag → inline body replacement · integrity/crossorigin strip mirroring the loader · Python3 fallback for gzip step.
- 3 decoded siblings rebuilt: o1-expressive (1295L · 73 data: URLs), o1-standalone (1272L · 73 data: URLs), o7-expressive (922L → 2011L · 79 data: URLs · 127 `<div>` · 2 inline babel scripts).
- 5 new shellspec tests (16 examples, 0 failures) + new fixture `manifest-bundled.html`.
- HANDOFF-78 amended with corrected root cause.
- Deleted `o7-canvas-prompt.md` v2 (wrong-diagnosis artifact).

**Shipped in wrap (PR to follow this commit):**
- `docs/slices/S-PROTO-pre-signup-interview/o2-to-o6-canvas-prompts.md` — 5 paste-ready Claude-AI-Design prompts for O2-O6 with shared O1-inheritance + bundling-requirement boilerplate, plus 3 loveability decisions per screen and screen-specific negative constraints.

## What went well

- **The redirect from "refactor src/ now" to "fix the decoder" was correct.** Without the manifest-substitution path, every future src/ refactor would have been against a partially-broken decoded form. Catching it in the decoder is one fix; carrying the bug forward into 5+ refactor cycles would have been costly.
- **Loader-script-as-spec.** Lines 47-170 of any raw bundled canvas are the in-browser loader implementation; the bash decoder now mirrors it step-for-step. Future canvas-format changes will be visible in the loader and can be replicated in the same place.
- **Synthetic shellspec fixtures cover both happy paths.** Uncompressed (the new `manifest-bundled.html`) + compressed (built inline in the spec via `gzip | base64 -w0`) + no-UUID fallback (the existing `minimal-bundled.html`). All three branches exercised.

## What could improve

- **The session-78 wrap claim "No PR shipped" was stale by the time it was read.** PR #131 had merged after the HANDOFF was written. Future kickoffs that quote a previous HANDOFF as ground-truth on PR state should re-verify with `git log --oneline origin/main` first.
- **The user's frustration mid-session was a signal.** I delegated a long detour without surfacing the trade-off ("this fixes the decoder but pushes the refactor to a future session"). When a user-supplied redirect changes session scope, I should explicitly call out what's now in vs out before going deep.
- **`grep -c` on the decoded siblings is locale-fragile.** Default grep on UTF-8 text with very-long lines (data: URLs) returns 0 matches even when content is present; `-a` or `LC_ALL=C grep` gives the right counts. The verification step in `o2-to-o6-canvas-prompts.md` "After Claude AI Design exports each canvas" uses `grep -aEc` to dodge this.

## Key decisions

- **O2-O6 canvas prompts in a single file**, not 5 separate files. Reduces boilerplate duplication (style inheritance + bundling requirement quoted once) and makes review of the suite easier. Each screen has its own paste-ready section the user can copy independently.
- **Calmer `EXPRESSIVE_BG` for O2-O6** per o1 canvas footer verbatim quote: *"O2–O6 reuse this shell with the calmer EXPRESSIVE_BG (lilac → cream, no magenta stop) — the hero treatment is reserved for entry & exit screens."*. The hero treatment stays for O1, O7, O8 (entry + exit moments).
- **3 loveability decisions per screen, not 5+**. The canvas is a vehicle for committing to specific treatments; more decisions create paralysis. Three is enough to surface the design questions without bloating each prompt.

## Bugs found + how fixed

- **Decoder bug (the session theme):** root cause + fix above.
- **Substitution-order self-clobber:** initial implementation set `data-uuid="$uuid"` on inlined babel scripts for traceability; the subsequent generic UUID → data: URL substitution then clobbered that attribute (replacing the UUID with the data: URL). Fixed by dropping the data-uuid attribute — traceability isn't needed and the clobber created a confusing artifact.
- **Fixture-encoding bug:** initial test fixture embedded a literal `</script>` inside the JSON-encoded template body — the HTML parser closed the outer bundler/template tag prematurely. Real canvases use Unicode escape `</script>` (jq's JSON.parse handles both); the new fixture uses `<\/script>` (forward-slash escape — also valid JSON).

## Persona findings recorded (PR #132 multi-agent review)

`request-changes` verdict (informational at v3b ship; non-blocking). 7 findings across 3 specialists:

| Persona | Finding | Status |
|---|---|---|
| correctness | macOS `base64 -w0` portability shim missing | DEFERRED — only Linux dev/CI environments today; revisit if a macOS dev joins |
| correctness | Skip DATA_URL replacement for text/babel\|jsx mime after inlining (else residual UUID refs in non-script contexts get wrong mime) | DEFERRED — no observed regression on the 3 real canvases; revisit if a future canvas exposes the edge case |
| correctness | jq-missing stderr warning when MANIFEST present | DEFERRED — jq is a hard dependency; if missing, exit-1 path will surface elsewhere |
| style | Drop WHAT-narration first lines on 2 comments (`# Detect text/babel...` + `# Extract <script type=...`) | DEFERRED — borderline; first lines do narrate but also frame the WHY-context for the second lines |
| style | `TMPDIR_DEC` collides visually with `$TMPDIR` env var | DEFERRED — local var, scoped to the substitution block; rename if the file is read in isolation |
| style | `bin` is generic | DEFERRED — local var inside a tight loop; the surrounding context disambiguates |

All 6 deferrals recorded here, not in `verification.md` (this is an infrastructure slice — the slice's verification.md is for the prototype, not the decoder fix).

## Next session priorities (for session 80 kickoff in `SESSION-CONTEXT.md`)

**P1 · User generates 6 canvases** via Claude AI Design using `docs/slices/S-PROTO-pre-signup-interview/o2-to-o6-canvas-prompts.md` (5 prompts) + `docs/slices/S-PROTO-pre-signup-interview/o8-canvas-prompt.md` (1 prompt). Upload to `docs/design-source/pre-signup-interview/`.

**P2 · Decode all 6 newly-generated canvases** via `scripts/decode-bundler-canvas.sh`. Verification: `wc -l decoded/o{N}-…` ≥ 1000L AND `grep -aEc '<div'` ≥ 50 AND UUID count = 0.

**P3 · Refactor `src/app/dev/proto/pre-signup-interview/`** against the now-complete canvas set. Per-screen sign-off before any src/ write. Inherits o1 canon: RadioCard ring · ScreenShell type weights · spacing · radio-card pattern (entry/exit hero); calmer EXPRESSIVE_BG for O2-O6.

**P4 (parked from session 78):** F1 + F2 nits from PR #131 — F1 (`a: Answers` → `answers: Answers` in `build-plan.ts` compose functions); F2 (security.md item 12 count enumeration drop). Land naturally during refactor, or as drive-by commits.

## Constraints unchanged

#1-#39 preserved. No new constraints introduced this session.

**Future-add candidate** (logged session 78, not actioned this session): "After decoding any bundled-HTML canvas, verify decoded sibling carries layout-bearing JSX (≈1000+ lines + 50+ `<div>` elements) — not CSS only (≈900L + 0 `<div>`). Add to per-prototype 4-step loop §'Absorb' stage." This is now implicit in `o2-to-o6-canvas-prompts.md` §"After Claude AI Design exports each canvas" but isn't yet a CLAUDE.md constraint. Promote in session 80+ if the canvas-by-canvas verification gets repetitive.
