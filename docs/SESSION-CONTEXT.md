# Session 81 Pre-flight Context Block (carrying session 80 wrap delta)

## Session 80 wrap delta — read this first

Session 80 shipped the canvas-canon refactor of `src/app/dev/proto/pre-signup-interview/`. PR #135 merged to main as squash `94007b6`. 20 atomic commits across F1 token extension + ScreenShell rebuild + 4-state BgToggle + per-screen reconstruction (O1 audit + O2-O6 full rebuild + O7+O8 polished placeholders) + auto-review nit cycles + a latent prototype-readiness bug fix in `scripts/auto-review-filter-prior.sh`.

**Final state on main:**
- F1 design system extended with 6 new tokens (violet · magenta · 4 surface gradients); CSS↔TS parity test 75/75 GREEN
- 5 nested state slices on Answers: situation · exAndSafety · employment · partnerFinances · whatMatters; flat fields fully pruned
- 4 atom families: RadioCard · RadioChips · CheckChips · SubQuestionCard; inline TallRow in O5
- Auto-review verdict on merged commit: success (approve) after 4 review rounds
- All 25 CI checks GREEN at merge
- Full vitest suite: 402/402 GREEN

Read `docs/HANDOFF-SESSION-80.md` for full retro.

## Session 81 priorities — user picks scope

Six candidates in the pipeline. Sessions typically take 1-3.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **O7 reconstruction** (Your plan) | Long-form plan render with timeline + conventional-path comparison + personalisation. Strategic apex per spec 42 — value-prop crystallisation moment. Assets preserved at `docs/design-source/pre-signup-interview/jsx/o7-{page,components,plan-page,plan-components}.jsx` + `o7-your-plan-expressive{,-source}.html`. | Heavy (~300-500L est.) | No |
| 2 | **O8 reconstruction** (What's next) | 4-route picker. Canvas authors instructed "do not lift from existing draft" — likely needs canon authors to lock framing first. | Medium (~150L est.) | Yes (canon authors) |
| 3 | **Inline-style proto consumption refactor** | Proto-wide change. Migrate all components from inline `style={{}}` consuming `tokens.color.*` to CSS-class consuming `var(--ds-color-*)` per F1 design intent at `tokens.ts` L7-9. Affects 12+ atoms (RadioCard · RadioChips · CheckChips · SubQuestionCard · ScreenShell · BackgroundShell · BgToggle · JourneyTimeline · PlanSection · PrimaryCTA · ProgressChip · inline TallRow in O5). | Heavy proto-wide (~400-600L est.) | No |
| 4 | **Per-screen bg defaults** | Canvas-overview L177-179: O2-O6 use canvasChrome, O1+O7+O8 use expressive. Currently global default is expressive with BgToggle override. Implementation: route BackgroundShell mode based on current screen. | Light (~50L est.) | No |
| 5 | **Stage-tone copy differentiation** per spec 65 §Principle 6 | Populate per-stage variants in `lib/copy/o{1-6}.ts` when canon authors specify per-stage tone. Resolver shape ships; just populate. | Medium per screen | Yes (canon authors) |
| 6 | **Auto-review script cleanup** | Extend `preflight-review.sh` · `validate-finding-envelope.sh` · `spawn-multi-reviewer.sh DIMENSIONS` to support `prototype-readiness` alongside production dimensions. Control-plane PR (`control-change` label). | Light (~30L est.) | No |

**Recommended pairing:** P3 + P6 (both unblocked, neither needs canon-author input, complementary control-plane improvements). Or P1 alone (heavy, single-focus, ships the strategic apex).

## Authoritative reading order at session 81 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-80.md` (last session's retro).
3. `docs/slices/S-PROTO-pre-signup-interview/` — `acceptance.md` (post session-80 amendments) + `verification.md` (architectural deferrals + preview-deploy 6-dim populated).
4. **Spec 65** `docs/workspace-spec/65-pre-signup-interview-reconciled.md` (190L) — already ingested session 80 but worth re-skimming for any session 81 priority.
5. **Spec 76** `docs/workspace-spec/76-prototype-mode-rigour.md` §3 — prototype-category gate calibration (still in calibration row 2; row 3 verdict pending).
6. **Spec 72c** `docs/workspace-spec/72c-multi-agent-review-framework.md` if working on P6 (auto-review script cleanup).

## Session 81 kickoff prompt (paste-ready)

```
Kick off session 81.

Pick scope from SESSION-CONTEXT.md "Session 81 priorities — user picks scope"
(P1-P6 candidates).

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- git log --oneline origin/main | head -3 — confirm 94007b6 is the
  session-80 squash + the wrap commit on top of it.
- Branch convention: harness-suffixed; if a non-suffixed canonical exists,
  follow CLAUDE.md §"Branch-resume check".

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-80.md.
3. docs/slices/S-PROTO-pre-signup-interview/acceptance.md +
   verification.md (post session-80 state — architectural deferrals
   listed at verification.md §"Architectural deferrals").
4. Specs per chosen priority (see "Authoritative reading order" above).

Definition of Done for the chosen priority:
- All ACs met with evidence per AC in verification.md (new slice if
  P3 or P6 — those aren't covered by the existing pre-signup slice's
  acceptance.md).
- Tests written + passing where tractable (TDD-guard skips for
  /dev/proto/<literal>/** but applies to scripts/* and src/app/**).
- Adversarial review done (auto-review.yml fires on PR open;
  request-changes/nit-only is advisory; block / parse-failed / pipeline-
  crash gate the merge).
- Preview-deploy verified in-browser if UI work.
- security.md item 12 stays Pending at PR open; closed Done post-verdict
  (per session-80 PR #131-F2 nit pattern).
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. The unique claim is "the only place where both parties build one evidence-backed, shared picture." Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind via CSS variables · S-F1 token system at `src/styles/tokens.ts` (75 entries post session 80) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 81 branch: harness-suffixed (e.g. `claude/session-81-…`). Confirm at turn-0 via SessionStart hook.

## Negative constraints (preserve)

#1-#39 from prior sessions. No new constraints session 80.

**Future-add candidate** (logged session 78, dormant since): "After decoding any bundled-HTML canvas, verify decoded sibling carries layout-bearing JSX (≈1000+ lines + 50+ `<div>` elements)." Not promoted in session 80 because session 80's canvases shipped in plain-HTML+JSX format (no decoder needed). Re-evaluate when next bundled-format canvas arrives.

## Scope ceiling

Session 81 is screen reconstruction (P1) OR proto-wide refactor (P3) OR control-plane cleanup (P6). Out of scope unless explicitly added: spec changes · CLAUDE.md constraint additions · auto-review persona retain/drop verdicts (calibration cohort still at row 2 — pre-signup-interview was row 2; row 3 verdict pending after the next prototype slice).

## Current pre-signup prototype URL

- Production (after session-80 squash deployed): `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR; pattern `https://construct-dev-git-claude-{hash}-rossdelarge247-debugs-projects.vercel.app/dev/proto/pre-signup-interview`
