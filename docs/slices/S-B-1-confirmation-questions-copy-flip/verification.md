# S-B-1 · confirmation-questions copy-flip — In-browser verification

**Slice:** S-B-1-confirmation-questions-copy-flip
**Source:** CLAUDE.md DoD item 4 + engineering-phase-candidates.md §G.5
**Preview deploy URL:** N/A — no UI surface in this slice (logic-library + doc-string edit only)
**Integration URL (for regression check):** N/A — same reason

S-B-1 has no rendered surface — the file under edit (`src/lib/bank/confirmation-questions.ts`) is a logic library whose outputs are consumed by future UI components. No browser flow exercises the changed strings until a downstream slice wires the consumers. CLAUDE.md DoD item 4 (preview-deploy in-browser) is therefore N/A; verification is via vitest unit + file-level grep gates per `./test-plan.md`. Adjacent-slice smoke checks (regression surfaces section below) are the substitute discipline.

---

## Golden path

N/A — no UI flow in this slice.

| Step | Action | Expected outcome | Evidence |
|---|---|---|---|
| 1 | N/A | UI consumer slice (future) will exercise these strings | — |

**Pass / fail:** N/A — see vitest output in `./test-plan.md` T-1..T-5 evidence.

## Edge cases

N/A — string substitutions are deterministic. Edge cases live in the upstream catalogue (boundary §2.4 exception cases — Cat-B preservation), and are covered by AC-3 + T-3.

| Scenario | Trigger | Expected outcome | Evidence |
|---|---|---|---|
| N/A | — | — | — |

## Accessibility

N/A — no rendered surface. Accessibility verification will be done by the UI consumer slices that render these strings. Spec 73 §1 vocabulary itself is screen-reader-clean (plain English, no symbols, no ambiguous abbreviations).

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

The decision-tree functions in `src/lib/bank/confirmation-questions.ts` are consumed by surfaces that render the accordion-label and facts.label strings. Adjacent slices / surfaces that may break if the substitutions are applied incorrectly:

| Adjacent slice / surface | Smoke check | Pass / fail | Evidence |
|---|---|---|---|
| `src/components/hub/discovery-flow.tsx` (V2-discarded per CLAUDE.md Key files — do not port) | Confirm file is not imported into any active route; if unexpectedly live, confirm rendered strings still parse | {filled at wrap} | grep call-site search |
| `src/app/workspace/engine-workbench/page.tsx` (engine workbench dev tool) | Dev preview: load workbench, drive a synthetic Sarah scenario, confirm accordion labels render the new vocabulary | {filled at wrap} | dev-mode screenshot |
| Any future slice consuming `confirmation-questions.ts` decision-tree exports | Listed for traceability — none yet shipped | N/A | — |

Use `grep -rn "from .*confirmation-questions" src/` to enumerate consumers at implementation time and update this table.

## Dev-mode sanity (if slice surface varies by MODE)

N/A — slice surface is identical in dev and prod (same file, same exports). The engine-workbench dev tool may render the strings, in which case its smoke check above covers dev-mode rendering.

- [x] N/A · reason: no MODE-conditional surface

## Adversarial run

- [x] Manual adversarial review run on slice diff per `./security.md` §12 reasoning (HANDOFF-29 obs: manual fitter than skill for T0 Public copy slices) — 6 sweep findings recorded; no concerns surfaced
- [x] `/review` skill — deferred to wrap; manual sweep covered the diff (26-line surface, fully reviewable inline)
- [x] `/security-review` skill — deferred per HANDOFF-29 reasoning; manual sweep covered
- [x] Optional: `.claude/agents/slice-reviewer.md` sub-agent — N/A this session; experiment retention TBD per engineering-phase-candidates §E

---

## Sign-off

- **Verified by:** Claude (session 30)
- **Date:** 2026-04-25
- **Commit SHA verified:** {filled at commit}
- **Preview URL:** N/A — no UI surface
- **Outstanding issues:** none
- **DoD item 4 status:** N/A · reason: no UI surface — verification via vitest (30/30 green) per `./test-plan.md`
