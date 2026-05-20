# Session 108 retro — S-PROTO-help-rail-desktop-variants

## Pre-priority verifications cleared at turn 0

Per CLAUDE.md §"Planning conduct":

- Branch state verified by `.claude/hooks/session-start.sh`: landed on `claude/session-108-kickoff-5RqYD` cleanly from main `ef6ea66`.
- P1 spec-gate check: `grep -rln "help.rail\|HelpRail" docs/workspace-spec/` returned 0 — Help Rail spec ref still pending (carried sessions 101→107).
- P2 prototype-journey-lockdown check: confirmed no scope changes shipped session 107; standing deferral unchanged.

P3 (last session's polish bundle) was already closed; standing P1 + P2 both blocked. SESSION-CONTEXT recommended asking user for direction.

## Scope decisions (4 AskUserQuestion rounds)

**Round 1 — Session direction.** First-attempt 4-option question (P1 design phase / triage PR #209 / quick orientation read / user-directed) was dismissed. User asked instead to "expand in detail on our priority list and the blocked items" — opening a discovery exchange that surfaced the genuine P1 unblock path.

**Round 2 — Spec only?** User pushed back on my "spec only first" framing with the direct question "why spec only?" That dismissal exposed an inherited-from-SESSION-CONTEXT framing that was wrong for prototype canvas-as-source: the carry-forward "Help Rail spec ref pending" gate predated the canvas-as-source default and didn't actually apply. Re-framed; user picked Path A (ship all 5 variants as toggleable) directly.

**Round 3 — Canvas variations + public-site framework.** User added two strategic dimensions mid-scoping: (i) the 5 canvas variants are deliberate takes (not options to pick between) — ship as variations for testing; (ii) public-site (non-form) pages should be treated separately from the form-surface graceful-enhancement framework. Both folded into the slice scope or noted as parked workstreams.

**Round 4 — Pacing at warn threshold.** At 1489-line session churn (right at the 1500 warn), surfaced three pacing options. User picked "Ship 3 rails + integration this session". V4 (RailHuman) + V5 (RailHybrid) deferred to a follow-up slice; manifest declares all 5 IDs with V4/V5 rendering `RailDeferred` placeholder.

## Slice deliverables

PR #210 squash-merged to main as `7cea128`. Category `prototype` (override; primary surface is the prototype rail variants).

| Commit | Scope | LOC |
|---|---|---|
| `0f31f46` | Slice scaffold (acceptance.md + security.md) | +227 |
| `229f859` | AC-1 + AC-2 · variant infrastructure (manifest + context + 18 tests) | +511 |
| `b07ff62` | AC-3 · `/dev/control` dev surface (+ 5 tests) | +273 |
| `dca95f6` | AC-4 + AC-5 + AC-6 · 3 rails + integration + 11 tests | +970 / -20 |
| `1734ba0` | CI fix (useSyncExternalStore refactor) + 4 auto-review actionables | +62 / -166 |
| `7cea128` | Squash-merge to main | n/a |

**Verification:** 34 new tests across 5 files; full suite 758/758 green; tsc clean; 0 new eslint-disable; lint clean.

## What went well

- **User-driven scope challenges.** Two dismissed AskUserQuestion rounds (the "expand in detail" + "why spec only?") delivered better outcomes than the initial framings. Both pushed back on inherited-from-SESSION-CONTEXT framings that were no longer accurate (Help Rail "needs a spec" carry-forward; "spec-only this session" over-conservative). Pattern: dismissals are signal, not just non-answers.
- **Canvas-as-source applied cleanly to a new surface.** The 5-step light adapt worked end-to-end on the desktop-only graceful-enhancement surface. No canvas-fidelity gate fired (prototype default); the canvas's own constants tokenised + className-based styles inlined pragmatically; no separate written spec needed. Time to first working rail: ~one canvas read + ~140 lines of TSX.
- **CI-driven refactor → architectural improvement.** The `react-hooks/set-state-in-effect` lint failure forced a `useSyncExternalStore` rewrite of `VariantProvider`. The new pattern is actually cleaner — module-level subscriber set + per-hook snapshot; no shared `active` state object; hydration-safe by construction. Public hook API unchanged → all 34 tests passed without modification.
- **Mid-impl scope renegotiation at warn threshold.** At 1489 churn, surfaced the pacing question rather than push to stop. User chose to defer V4/V5 with `RailDeferred` placeholders in the manifest — both honest about scope and a clean follow-up surface.
- **Auto-review triage at v3b.** 10 findings landed; addressed 4 directly (2 nitpicks + 2 suggestions), deferred 4 to the system-wide a11y pass with explicit `verification.md §"Architectural deferrals"` note, skipped 2 informational. Verdict moved from `request-changes (informational)` to `neutral` advisory — no `block` ever.

## What could improve (new recurrence-watch entries)

- **Dismissed AskUserQuestion rounds carry signal.** Two rounds were dismissed in session 108; both led to better outcomes after the user's free-form direction. Pattern: when the user dismisses a multi-option question, treat the dismissal as "your framing is wrong" rather than "no answer yet" — re-read the framing for inherited assumptions before re-asking. One-session-observed; promote if repeated.

- **CI-driven mid-flight refactor.** New React 19 / react-hooks-plugin rule (`react-hooks/set-state-in-effect`) fired post-push on `useEffect → setState` patterns that pre-rule were idiomatic. Resolution: refactor to `useSyncExternalStore`. Pattern: when a CI lint rule blocks a known-good pattern, default to the React-canonical fix (e.g. external-state hooks) rather than disabling the rule. One-session-observed.

- **AC mid-impl scope renegotiation at warn threshold.** Sibling to session-107's "AC mid-impl amendment for anti-DRY refactor" but triggered by session-churn budget rather than impl discovery. AC-4 originally specified 5 rails; renegotiated to 3 + 2-as-deferred-placeholder at the 1489-line warn. Pattern: the warn threshold (not the stop) is the natural trigger for AC renegotiation. Two-session-observed (107: anti-DRY; 108: budget) — promote to numbered constraint at session 109+ if a third session repeats.

- **Inherited SESSION-CONTEXT framings can rot.** P1's "Help Rail spec ref pending" gate predated the canvas-as-source default; for 7 sessions the gate carried unchanged. Once a canvas-as-source pattern landed (sessions 76+), the "needs a spec" framing for prototype surfaces became inaccurate but wasn't updated. Pattern: at session start, sanity-check carry-forward priorities against the active patterns + specs, not just verify they're still blocked. One-session-observed.

## Persona findings recorded

| Persona | Findings this slice | Verdict | Notes |
|---|---|---|---|
| `reviewer-security` | 2 (1 note + 1 praise; non-actionable) | **Retain (dormant for actionables)** | Both informational this slice. Cumulative across sessions: still strong-retain on the v3b counter. |
| `reviewer-correctness` | n/a (substituted by `reviewer-prototype-readiness` per prototype category) | **Retain (substituted)** | |
| `reviewer-prototype-readiness` | 6 findings (4 a11y issues + 2 suggestions, all advisory) | **Strong retain** | Caught: aria-live mount, focus-visible inline-style limitation, MUTE contrast, cursor-without-onClick, AC-4 evidence gap, href="#" scroll behaviour. 4 of 6 main missed; high catch quality. |
| `reviewer-style` | 2 nitpicks (unused exports) | **Retain** | Caught the speculative-abstraction exports (MAGENTA + 4 Icons + useVariantRegistry). Both addressed. |
| `acceptance-gate` | n/a (informational at v3b ship) | **Retain** | Blocking v3c. |
| `ux-polish-reviewer` | n/a (dormant per prototype substitution) | **Retain (dormant)** | |

Cumulative for retain/drop metric: this is the **6th** `src/` slice post-v3b ship (S-F1 · S-PROTO-copy-resolver-sweep · S-PROTO-O7-quantitative-hooks · S-PROTO-quantitative-screens · S-PROTO-quantitative-screens-polish · S-PROTO-help-rail-desktop-variants). All active personas retained.

## Key decisions made

- **D-1: Combined slice (infrastructure + Help Rail consumer)** — YAGNI on partitioning until a second prototype needs variants.
- **D-2: Dev control at `src/app/dev/control/page.dev.tsx`** — sibling to existing dev tools; avoids mixing planning registry hub with runtime control.
- **D-3: 1280px (xl) breakpoint** — matches canvas's "Desktop" framing (1320×880); comfortable rail width; industry convention.
- **D-4: CSS media query, not JS viewport detection** — avoids hydration mismatch + SSR-vs-client divergence.
- **D-5: Default variant `off`** — preserves existing mobile behaviour as the unsurprised default.
- **D-6: URL searchParam > localStorage > manifest default** — URL override enables shareable review links.
- **D-7: Hybrid (V5) tabs other rails as-is, not re-renders** (deferred in this slice; carries to follow-up).
- **D-8: No `Linked canvas:` field** — canvas-fidelity persona stays dormant per prototype default.
- **D-9: No copy-resolver wiring** — canvas literals carry through; deferred until a chosen variant graduates.
- **D-10 (impl-time pivot): `useSyncExternalStore` over `useEffect+setState`** — CI lint rule forced the canonical pattern; net architectural improvement.
- **D-11 (impl-time pivot): 3 rails + 2 deferred placeholders, not 5 rails** — session-budget renegotiation; manifest declares all 5 IDs to keep V4/V5 wiring trivial in follow-up.

## Bugs found + how fixed

- **`@testing-library/user-event` not installed.** Refactored variant-context tests to use `fireEvent` from `@testing-library/react` (already in `package.json`). No scope expansion.
- **Registry row count tests asserted exact 61.** Adding the `dev-variant-control` row bumped to 62. Updated `tests/unit/app/dev/proto/{registry.test.ts, page.test.tsx}` count assertions in lockstep.
- **CI Lint + Fitness-functions failed on `react-hooks/set-state-in-effect`.** Variant-context's `useEffect → setActive` pattern triggered the new rule. Refactored to `useSyncExternalStore` (React-canonical for external state). 34/34 tests passed post-refactor without modification.
- **Verification.md hook flag — "session-107" provenance.** Caught at PostToolUse:Write; rephrased to doc-pointer ("the inherited deferral recorded in SESSION-CONTEXT").
- **Acceptance.md hook flag — "session-108" provenance + "session 107" in evidence text.** Both caught at PostToolUse:Write; both replaced with doc-pointers.

## Next session priorities

| # | Priority | Effort | Notes |
|---|---|---|---|
| 1 | **(New)** S-PROTO-help-rail-V4-V5-rails — RailHuman + RailHybrid (tabbed) | Medium | Manifest already declares both IDs; placeholder components already render. Read RailHuman (canvas L1925-1982) + RailHybrid (canvas L1983-2090); 5-step light adapt; replace placeholders; add smoke tests. Likely 1 session. |
| 2 | **(Inherited)** Desktop graceful enhancement — Help Rail integration broader breakpoints | Medium-Heavy | Initial graceful enhancement landed at 1280px. Intermediate breakpoints (480-1280px) + extra-space utilisation above 1320px still pending. P1 unblock pivot: the framework now exists; broader breakpoint work is concrete refinement, not new design. |
| 3 | **(Inherited)** Public-site / marketing pages framework | Heavy | Strategic question surfaced session 108: form-surface rail-enhancement framework vs content-surface responsive-first framework. Multi-session workstream (extract design tokens from marketing-landing canvas, audit overlap with S-F1, scope responsive framework). |
| 4 | **(Inherited)** System-wide a11y pass | Heavy | Pre-condition: prototype journeys locked down. 4 new a11y findings from S-PROTO-help-rail-desktop-variants added to the system-wide-pass scope (aria-live mount, focus-visible on inline-styled buttons, MUTE contrast, cursor-without-onClick). |
| 5 | **(New)** User-directed work | Varies | Default fallback. |

**Recommended:** P1 (V4 + V5 rails) — closes the canvas-author's "5 deliberate takes" intent; single-session-sized; infrastructure already shipped.

## Session 108 metrics

- **Lines added (across 5 commits):** ~2050 across all slice work + CI fixes
- **Lines deleted:** ~190 (most in the useSyncExternalStore refactor)
- **Net commit lineage:** scaffold (0f31f46) → AC-1+2 (229f859) → AC-3 (b07ff62) → AC-4+5+6 (dca95f6) → CI fix + auto-review (1734ba0) → squash-merge (7cea128)
- **Tests added:** 34 (6 manifest + 9 context + 3 registry + 5 control + 11 rails/layout). Full suite 758/758 green at merge.
- **CI checks at merge:** 24 success + 1 neutral (auto-review advisory verdict). All blocking gates green.
- **Auto-review rounds:** 2 (round 1: 10 findings, request-changes informational; round 2: post-fix, neutral advisory — no `block` ever).
- **AskUserQuestion rounds:** 4 (2 dismissed → free-form direction; 2 answered cleanly).
- **PR shipped:** #210 squash-merged as `7cea128`.
- **Session churn at wrap-start:** ~2050 (over the 2000 stop signalled; actual stop didn't fire because the line-count hook was reset after the squash-merge / wrap branch creation).

## Recurrence-watch (carried + new + resolved)

**RESOLVED session 108:** None resolved — all session-107 entries remain on watch.

**New observations session 108 (one-session-observed; promote to numbered constraint if a second session repeats):**

- Dismissed AskUserQuestion rounds carry signal (re-frame, don't re-ask).
- CI-driven mid-flight refactor → React-canonical pattern (useSyncExternalStore over disable-the-rule).
- Inherited SESSION-CONTEXT framings can rot (Help Rail "spec pending" gate carried 7 sessions past its expiry).

**Second-session-observed promotion eligible (session 107 + session 108):**

- **AC mid-impl renegotiation at warn threshold.** Session 107: anti-DRY refactor at impl time amended AC-3 (4 modules → 1 shared). Session 108: budget renegotiation at warn amended AC-4 (5 rails → 3 + 2 deferred placeholder). Both share the "AC mid-impl amendment" shape but for different triggers (discovery vs budget). Promote to numbered constraint at session 109+ if a third session repeats.

**Carried unchanged (28 entries):** session 107's 2 one-session-observed (AC mid-impl anti-DRY; verification.md hook flags on session-N + per-spec-N) plus the 25 older carries from sessions 100-106 documented in HANDOFF-SESSION-107.md §"Recurrence-watch".

**Promotion-eligible (still pending session 109+):**
- Sibling-spec-discrepancy batching at AC freeze (carried 104→107; session 108 did not exercise multi-spec AC freeze).
- `spec-citation-quote` author-time stub vs CI gate strictness (carried 103+106; session 108 author-time hook caught the verification.md flags before commit — equal strictness this session).
