# Session 82 Pre-flight Context Block (carrying session 81 wrap delta)

## Session 81 wrap delta — read this first

Session 81 shipped the canvas-fidelity gate as PR #137 (open at wrap, awaiting auto-review re-run after a 1-line aggregator arg-order fix). 10 atomic commits across persona authoring + workflow wire-up + P6 script cleanup + synthetic regression fixture + slice scaffolding + CLAUDE.md/spec-72c amendments + 5 new bundled-HTML canvases (decoded into readable siblings) + 1 in-flight bug fix on the aggregator arg ordering.

**Final state on the PR branch (`claude/canvas-refactor-session-81-I4X8l` @ `e7f1fdd`):**
- New specialist persona: `.claude/agents/reviewer-canvas-fidelity.md` (146L, 6 categories, conditional invocation when slice has `Linked canvas:` field)
- `auto-review.yml` extended: `Linked canvas:` field detection · 4-dim matrix routing · per-canvas brief composition · `--dimensions <csv>` flag passed to aggregator
- `spawn-multi-reviewer.sh`: `--dimensions` flag with default fallback
- 3 supporting P6 script extensions (`validate-finding-envelope.sh` · `auto-review-filter-prior.sh` · `preflight-review.sh` category-aware)
- Synthetic fixture pair: `tests/personas/synthetic/canvas-fidelity.{diff,canvas}` + `expected/canvas-fidelity.json` + `run-synthetic.sh` extended
- Slice docs: `docs/slices/S-INFRA-canvas-fidelity-gate/{acceptance,verification,security,test-plan,calibration-report}.md`
- CLAUDE.md §"Visual direction" extended with AC-as-canvas-quote discipline + Linked canvas field convention; §"Hard controls" canvas-fidelity row added
- Spec 72c §4 personas table extended to 5 rows; §7 synthetic-fixtures section extended
- 5 new bundled-HTML canvases decoded: `Pre-signup Canvas` (5133L) · `Desktop Help Rail` (2235L) · `Mobile Screens v2` (5233L) · `Landing Page` (2026L) · `Welcome Tour` (1497L); two root files moved into slug subdirectories

**PR #137 status at wrap:**
- Vercel preview READY · Lint · Typecheck · Tests · audit · build · synthetic-fixtures · golden-replay · all GREEN
- 3 individual specialists (security · correctness · style) all GREEN
- **Aggregator failed initially** — arg-order bug in `auto-review.yml` invocation (`--dimensions` placed before positional `<dir>` but parser expects `<dir>` first). Fixed in `e7f1fdd`; CI will re-fire on push
- **`spec-citation-quote-check` failure** — UNRESOLVED at wrap. Workflow checks "per spec X §Y" claims have a verbatim quote in the same context; my CLAUDE.md / slice doc edits have many "per spec" references. Investigation deferred to session 82 turn 1.

Read `docs/HANDOFF-SESSION-81.md` for full retro.

## Session 82 priorities — user picks scope

Five candidates in the pipeline. Sessions typically take 1-3.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Re-verify PR #137 CI + merge** | Aggregator fix is in `e7f1fdd`. Confirm CI green on next run. Address `spec-citation-quote-check` failure (likely needs verbatim quotes added wherever "per spec X" appears in slice docs). Admin-bypass click + merge to main. | Light (~30L if quote-check needs a few additions) | No |
| 2 | **Inspect decoded canvases + scope rebuild slice** | Read decoded canvases to map: which screens does each cover · does `Pre-signup Canvas` supersede the per-screen canvases at `pre-signup-interview/jsx/o{2-6}-frames.jsx` · does `Mobile Screens v2` cover both mobile + desktop · is the Help Rail a separate component or built into the desktop layout · what does Welcome Tour add. Output: rebuild slice's `Linked canvas:` field + draft AC list per AC-as-canvas-quote. | Medium (read-heavy; ~100L of slice scaffolding output) | Yes — wait for #137 merge so rebuild slice branches off main with the gate active |
| 3 | **Open rebuild slice PR (gate's first live run)** | Branch off main; ship rebuild slice with `Linked canvas:` declared; canvas-fidelity gate fires for the first time = calibration evidence captured in PR's auto-review verdict. | Heavy (~400-600L impl + slice docs) | Yes — depends on P1 + P2 |
| 4 | **`preflight-review.sh` arg-order fix** | Same bug as auto-review.yml had — `--dimensions` placed before positional. Local-only script (not CI-blocking). 1-line fix. | Trivial | No |
| 5 | **Decide on `Decouple.zip` unpacking** | The `marketing-landing/Decouple.zip` carries 17 sub-canvases including Master Components (design system) + Decisions Log (rationale). Decision deferred at session 81 — leave packed unless rebuild scope expands beyond pre-signup. | Light if needed | No |

**Recommended sequence:** P1 (~30 min) → P2 (read-heavy, prep for P3) → P3 (the heavy slice). P4 + P5 fold in opportunistically.

## Authoritative reading order at session 82 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-81.md` (last session's retro).
3. `docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` (durable record of user feedback feeding the rebuild AC list).
4. PR #137 check-runs status (re-verify CI greens; address `spec-citation-quote-check` if still failing).
5. **Decoded canvases** (when scoping rebuild slice): grep first for `<title>`, `<h1>`, `<h2>` to map structure; targeted reads only (each canvas 1500-5200L; full reads exceed 300L cap).

## Session 82 kickoff prompt (paste-ready)

```
Kick off session 82.

Read this file (SESSION-CONTEXT.md) first; check PR #137 CI state.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- gh / mcp__github__pull_request_read get_check_runs on PR #137 to
  confirm: aggregator fix worked, spec-citation-quote-check status.
- Branch convention: harness-suffixed; if non-suffixed canonical
  exists, follow CLAUDE.md §"Branch-resume check".

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-81.md.
3. docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md.

Definition of Done for the chosen priority:
- All ACs met with evidence per AC in verification.md.
- Tests written + passing where tractable.
- Auto-review verdict: approve / nit-only on the new PR.
- Preview-deploy verified in-browser if UI work.
- security.md item 12 stays Pending at PR open; closes Done post-verdict.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind via CSS variables · S-F1 token system at `src/styles/tokens.ts` (75 entries) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 82 branch: harness-suffixed. If session 82 starts before PR #137 merges, work continues on `claude/canvas-refactor-session-81-I4X8l`. After merge, new branch off main.

## Negative constraints (preserve)

#1-#39 from prior sessions. No new constraints session 81.

## Scope ceiling

Session 82 is most likely P1 + P2 + start of P3 (rebuild scoping inspection, then begin AC drafting). Out of scope unless explicitly added: the public-pages nav-bar reconciliation (separate concern flagged session 81 turn 3) · `Decouple.zip` unpacking · spec 65 amendments to capture quantitative profiling data.

## Current pre-signup prototype URL

- Production (after session-80 squash deployed): `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
