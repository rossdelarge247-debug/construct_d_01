# S-PROTO-ai-coach — verification

Final-state record per CLAUDE.md §"Engineering conventions" §"Definition of Done" item 1. AC-by-AC evidence; preview-deploy 6-dim per spec 72a; auto-review verdict + DoD checklist.

## AC-1 · Route + 3-tab right rail shell (S-A1)

**Status:** DONE

Evidence:
- `src/app/dev/proto/ai-coach/page.tsx` mounts `<RightRail aiCoachPanel={<AiCoachPanel />} />`.
- `src/app/dev/proto/ai-coach/_components/RightRail.tsx` renders 3 `role="tab"` buttons in DOM order `Comments` · `AI coach` · `Activity` (driven by const `TABS` array).
- `useState<Tab>('ai-coach')` defaults the active tab per S-A1 verbatim. RightRail.test.tsx tests `'AI coach tab is default-active on mount (aria-selected=true)'` + `'AI coach panel content is visible on mount; other panels are hidden'` both GREEN.
- Tab-switching: 2 dedicated tests cover Comments + Activity transitions; both GREEN. Comments/Activity stubs default to placeholder copy when no panel props supplied.

## AC-2 · Four coach card variants (S-A2)

**Status:** DONE

Evidence:
- `CoachCard.tsx` exports `CardType = 'court-reasonableness' | 'fairness-check' | 'coaching' | 'on-this-comment'`. Each variant renders an `<article data-card-type="..."` element with the type slug verbatim.
- `TYPE_STYLE` const drives per-variant colour + tint + label: red flag (`#DC2626`) · amber notice (`#D97706`) · green positive (`#16A34A`) · neutral threaded (`#57534E`). Border-left accent + uppercase pill-label per type. Page-local colour constants (cross-cutting DS-token consolidation deferred per `acceptance.md` §"Architectural deferrals").
- `page.tsx` wires S-A2 verbatim mock titles ("No pension sharing is unusually weak" / "3-year spousal is on the longer end" / "Your home split is clean" / "On this comment: ...").
- CoachCard.test.tsx parametric test `'renders %s card with data-card-type attribute'` covers all 4 variants; GREEN.

## AC-3 · Summary banner with count badges (S-A3)

**Status:** DONE

Evidence:
- `SummaryBanner.tsx` renders the S-A3 verbatim intro paragraph verbatim ("Your draft sits at 54/46 to you. That's within normal court range, but two items will likely be challenged — here's what to expect.").
- Two count badges in a flex row below the intro: `{flagCount} FLAG` (red, danger-coloured border) + `{noticeCount} NOTICE` (amber `#D97706`).
- Page passes `flagCount={1}` + `noticeCount={1}` reflecting the AC-2 card composition (1 court-reasonableness + 1 fairness-check).
- SummaryBanner.test.tsx has 4 tests covering verbatim intro + FLAG badge + NOTICE badge + zero-count edge case; all GREEN.

## AC-4 · SHOW REASONING toggle + FALLBACK POSITIONS subsection (S-A4 + S-A5)

**Status:** DONE

Evidence:
- Every `CoachCard` carries a `<button aria-expanded={expanded}>` with the literal `SHOW REASONING` / `HIDE REASONING` label, driven by local `useState<boolean>(false)`. Collapsed state on mount per S-A4 verbatim ("Each coach card has a collapsible \"SHOW REASONING\" affordance").
- Click expands inline reasoning content (`<p>` rendered conditionally on `expanded === true`); second click collapses.
- Court-reasonableness card receives `fallbacks={COURT_FALLBACKS}` (3 entries) from `page.tsx`; FALLBACK POSITIONS subsection renders the 3 entries with `{title}`, `{rationale}`, and an `Adopt` `<button type="button">` (no-op stub per AC-4 + `acceptance.md` §"Architectural deferrals").
- Fairness-check / coaching / on-this-comment cards omit `fallbacks` prop → subsection absent from DOM.
- CoachCard.test.tsx has 7 tests covering collapsed-default + expand-on-click + collapse-on-second-click + FALLBACK POSITIONS label + 3-entry rendering + omits-when-absent; all GREEN.

## AC-5 · Advisory footer copy (S-A6 / C-A3)

**Status:** DONE

Evidence:
- `CoachFooter.tsx` renders the C-A3 verbatim copy as a single `<p>` element with muted-text styling.
- The footer renders inside `AiCoachPanel` (composed by `page.tsx`); since `RightRail` conditionally renders the AI coach panel only when its tab is active, the footer is naturally absent from DOM under Comments or Activity tabs. RightRail.test.tsx `'AI coach panel content is visible on mount; other panels are hidden'` exercises the conditional path.
- CoachFooter.test.tsx asserts the C-A3 verbatim copy; GREEN.

## AC-6 · Registry update + journey + DoD-6 evidence

**Status:** DONE

Evidence:
- `src/app/dev/proto/registry.ts` L74 row updated atomically via `TDD_GUARD_REDGREEN_OVERRIDE=1` Python sub (atomic-row hatch documented in CLAUDE.md §"Engineering conventions"): `status: 'spec-only' → 'prototype-built'`, `confidence: 'low' → 'medium'`, `tags: ['ai-dependent', 'high-uncertainty'] → ['ai-dependent']`, `openQuestions: ['Invocation pattern + conversational scope?'] → ['Invocation pattern locked: always-on rail, cards-only']`, `lastTouched: {session:74,date:'2026-05-08'} → {session:118,date:'2026-05-22'}`, `links: {} → {prototype:'src/app/dev/proto/ai-coach/',slice:'docs/slices/S-PROTO-ai-coach/'}`.
- Journey field declared in `acceptance.md` header: `Journey: orphan — pending wiring in slice S-PROTO-proposal-builder ...`.
- registry.test.ts has 2 new assertions for the L74 transition + a regression guard for the other 4 Settle rows (proposal-builder, counter, settlement-redline, negotiation-history); all GREEN.
- No new 68f open decisions introduced. C-A2 Jump-to-link card type deferred per `acceptance.md` §"Architectural deferrals" — that's a pre-existing 68a decision, not a new 68f open.

## Tests

**Status:** DONE — 49/49 passing across 6 test files for this slice; 896/896 across the full unit suite (no regression).

```
npx vitest run tests/unit/proto-ai-coach tests/unit/app/dev/proto/registry.test.ts
# 6 files · 49 tests · all GREEN
npx vitest run
# 119 files · 896 tests · all GREEN
```

Test-pain audit cleared: 0 mock setups across all 6 test files.

## Preview-deploy verification

**Status:** PENDING — auto-deploy on PR open. Per spec 72a §6-dim rubric:

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | PENDING | Visit `/dev/proto/ai-coach` on Vercel preview; verify rail renders with AI coach tab default-open, 4 cards visible, summary banner above, footer below. |
| Edge cases | PENDING | Click SHOW REASONING on each card; click each tab; click Adopt button (no-op confirmed). |
| `prefers-reduced-motion` | PENDING | Browser-emulate reduced-motion; assert no animation on tab-switch or reasoning-expand. |
| Keyboard-only | PENDING | Tab through rail; Enter-activate tabs; Enter-activate SHOW REASONING; Enter-activate Adopt. |
| Mobile viewport (375×667) | PENDING | Resize; rail stacks below main; tab strip remains horizontal; cards remain readable. |
| Screen-reader | PENDING | NVDA/VoiceOver smoke: tab `aria-selected` announced; card titles announced; reasoning announced on expand. |

## Auto-review

**Status:** PENDING — recorded at PR creation.

Multi-agent (3 specialists per CLAUDE.md §"Hard controls" auto-review row): `reviewer-security` · `reviewer-correctness` · `reviewer-style`. Canvas-fidelity stays dormant (no `Linked canvas:` field per acceptance §"Pre-flight notes" spec-only-not-canvas-port shape).

## Slice DoD (per CLAUDE.md §"Engineering conventions" §"Definition of Done")

1. **All ACs met.** PENDING.
2. **Tests written and passing.** PENDING — TDD ordering per `test-plan.md`.
3. **Adversarial review done.** PENDING — see `security.md` §"Adversarial review" surface-by-surface catalogue.
4. **Preview deploy verified in-browser.** PENDING — 6-dim table above.
5. **No regression in adjacent slices.** PENDING — `npx vitest run` over the full unit suite at slice ship.
6. **68d/68f open decisions resolved or deferred.** Registry L74 open Q resolved at scoping (recorded in `acceptance.md` §"Pre-flight notes"). C-A2 Jump-to-link card type deferred per `acceptance.md` §"Architectural deferrals". No new 68f opens.

Security checklist (short-form prototype): see `security.md` items 1, 8, 12, 14.
