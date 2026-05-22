# S-PROTO-ai-coach — verification

Final-state record per CLAUDE.md §"Engineering conventions" §"Definition of Done" item 1. AC-by-AC evidence; preview-deploy 6-dim per spec 72a; auto-review verdict + DoD checklist.

## AC-1 · Route + 3-tab right rail shell (S-A1)

**Status:** PENDING

Evidence to record at impl complete:
- `src/app/dev/proto/ai-coach/page.tsx` mounts `RightRail`.
- `src/app/dev/proto/ai-coach/_components/RightRail.tsx` renders 3 tab buttons in order `Comments` · `AI coach` · `Activity`.
- AI coach default-open per S-A1 verbatim (*"AI coach default in Settle phase."*).
- Tab-switching verified via Vitest assertions on `aria-selected` + panel render.

## AC-2 · Four coach card variants (S-A2)

**Status:** PENDING

Evidence to record:
- `CoachCard.tsx` renders 4 type variants with `data-card-type` attributes set to type slugs.
- Visual treatment per spec semantics: red flag (court-reasonableness) · amber notice (fairness-check) · green positive (coaching) · neutral threaded (on-this-comment).
- S-A2 verbatim mock titles wired in page composition.

## AC-3 · Summary banner with count badges (S-A3)

**Status:** PENDING

Evidence to record:
- `SummaryBanner.tsx` renders S-A3 verbatim intro paragraph.
- Two count badges with `FLAG` and `NOTICE` labels.
- Mock count values reflect the AC-2 card composition.

## AC-4 · SHOW REASONING toggle + FALLBACK POSITIONS subsection (S-A4 + S-A5)

**Status:** PENDING

Evidence to record:
- Each card carries SHOW REASONING affordance; collapsed by default per S-A4.
- Click expands inline reasoning content.
- Court-reasonableness card carries 3 FALLBACK POSITIONS entries per S-A5; each with rationale + Adopt button (no-op stub).
- Other 3 cards have no FALLBACK POSITIONS subsection.

## AC-5 · Advisory footer copy (S-A6 / C-A3)

**Status:** PENDING

Evidence to record:
- `CoachFooter.tsx` renders the C-A3 verbatim copy.
- Footer only visible when AI coach tab is active.

## AC-6 · Registry update + journey + DoD-6 evidence

**Status:** PENDING

Evidence to record:
- `src/app/dev/proto/registry.ts` L74 row diff: `status` · `confidence` · `lastTouched` · `links.proto` · `openQuestions` updates.
- Journey field present in `acceptance.md` header.
- No new 68f open decisions introduced.

## Tests

**Status:** PENDING — to record at impl complete.

Expected: 6 test files; ~30-40 test cases. Test-pain audit cleared (0 mock setups). Run:

```
npx vitest run tests/unit/proto-ai-coach tests/unit/app/dev/proto/registry.test.ts
```

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
