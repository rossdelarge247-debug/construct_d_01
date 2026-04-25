# S-B-2 · Recommendations copy-flip — In-browser verification

**Slice:** S-B-2-recommendations-copy-flip
**Source:** CLAUDE.md DoD item 4 + engineering-phase-candidates.md §G.5
**Preview deploy URL:** N/A — no UI surface in this slice (logic-library copy-flip only)
**Integration URL (for regression check):** N/A — same reason

S-B-2 has no rendered surface — the file under edit (`src/lib/recommendations.ts`) is a logic library whose `Recommendation` and `FinancialReaction` output objects are consumed by future hub UI components. No browser flow exercises the changed strings until a downstream slice wires the consumers. CLAUDE.md DoD item 4 (preview-deploy in-browser) is therefore N/A; verification is via vitest unit + regex audit gates per `./test-plan.md`. Adjacent-slice smoke checks (regression surfaces section below) are the substitute discipline. Pattern matches S-B-1 verbatim — both slices ship into Re-use stable libraries ahead of UI consumer slices.

---

## Golden path

N/A — no UI flow in this slice.

| Step | Action | Expected outcome | Evidence |
|---|---|---|---|
| 1 | N/A | UI consumer slice (future) will exercise these strings | — |

**Pass / fail:** N/A — see vitest output in `./test-plan.md` evidence.

## Edge cases

N/A — string substitutions are deterministic. The §2.4 boundary case (A17) is the substantive judgment call; it's covered by AC-2 (frozen text assertion) and the Cat-B preservation invariant by AC-3 + the baseline-fixture test.

| Scenario | Trigger | Expected outcome | Evidence |
|---|---|---|---|
| N/A | — | — | — |

## Accessibility

N/A — no rendered surface. Accessibility verification will be done by the UI consumer slices that render these strings (hub recommendation card, hero panel, discovery flow). Spec 73 §1 vocabulary is screen-reader-clean (plain English, no symbols, no ambiguous abbreviations).

- [x] N/A · reason: no rendered surface in this slice

## Responsive viewport

N/A — same reason.

| Viewport | Width | Expected behaviour | Evidence |
|---|---|---|---|
| N/A | — | — | — |

## Cross-browser

N/A — same reason.

- [x] N/A · reason: no rendered surface in this slice

## Regression surfaces

The `generateRecommendations` and `getFinancialReactions` exports in `src/lib/recommendations.ts` are consumed by surfaces that render the recommendation cards and financial-reaction messages. Adjacent slices / surfaces that may break if the substitutions are applied incorrectly:

| Adjacent slice / surface | Smoke check | Pass / fail | Evidence |
|---|---|---|---|
| Future hub recommendation-card slice | Confirm `Recommendation.explanation` strings render without truncation in card layout (some new strings are slightly longer than originals — A19 +37 chars, A18 -2 chars, A20 +13 chars, A17 +9 chars) | N/A — slice not yet built | — |
| `src/components/hub/discovery-flow.tsx` (V2-discarded per CLAUDE.md Key files — do not port) | Confirm file is not imported into any active route; behaviour unchanged | not-imported by active routes (verified `grep -rn "from .*discovery-flow" src/app`) | — |
| `src/lib/recommendations.ts` consumer enumeration | `grep -rn "from .*lib/recommendations" src/` returns only test files + future hub callers | verified — no current rendering callers in `src/app/` | — |
| Test suite | `npm test` full run | pass — 41/41 across 5 files | commit `c0114a2` |

Use `grep -rn "from .*lib/recommendations" src/` to enumerate consumers at implementation time and update this table when downstream slices wire UI.

## Dev-mode sanity (if slice surface varies by MODE)

N/A — slice surface is identical in dev and prod (same file, same exports). No `MODE`-conditional code paths added.

- [x] N/A · reason: no MODE-conditional surface

## Adversarial run

- [x] Manual adversarial review run on slice diff per `./security.md` §12 reasoning (HANDOFF-29 + HANDOFF-30 obs: manual fitter than skill for T0 Public copy slices) — 8 sweep findings recorded; no concerns surfaced
- [x] `/review` skill — deferred to wrap; manual sweep covered the diff (4 src lines + 2 test lines, fully reviewable inline)
- [x] `/security-review` skill — deferred per HANDOFF-29 + HANDOFF-30 reasoning; twice-deferred for T0 Public copy slices
- [x] Optional: `.claude/agents/slice-reviewer.md` sub-agent — N/A this session

---

## Sign-off

- **Verified by:** Claude (session 31)
- **Date:** 2026-04-25
- **Commit SHA verified:** `c0114a2` (GREEN implementation) on top of `d47dfc7` (RED) on top of `05e87f1` (A19 amendment) on top of `7aed00c` (scaffold + AC freeze)
- **Preview URL:** N/A — no UI surface
- **Outstanding issues:** none
- **DoD item 4 status:** N/A · reason: no UI surface — verification via vitest (12/12 S-B-2 + 41/41 full suite green) per `./test-plan.md`
