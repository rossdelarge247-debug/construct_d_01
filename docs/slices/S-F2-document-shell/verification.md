# S-F2 · Document shell — Verification

**Slice:** S-F2-document-shell
**AC doc:** `./acceptance.md`
**Status:** *Draft — populated at slice ship.*

---

## AC sign-off table

| AC | Outcome | Evidence | Status |
|---|---|---|---|
| AC-1 | `<DocumentShell>` three-column layout + 4 named slots | _filled at wrap_ | ⏳ |
| AC-2 | Responsive collapse at three breakpoints | _filled at wrap_ | ⏳ |
| AC-3 | Keyboard nav + a11y + prefers-reduced-motion | _filled at wrap_ | ⏳ |
| AC-4 | Demo page wiring on `src/app/page.tsx` | _filled at wrap_ | ⏳ |
| AC-5 | Tests pass + lint/build clean | _filled at wrap_ | ⏳ |
| AC-6 | Slice documentation complete | _filled at wrap_ | ⏳ |

## Implements (LOCKED in spec — materialised by this slice)

- 68b **B-D1** — Three-column layout + legal-document styling.
- 68b **B-D2** — Left rail = chapter TOC + completion icons + title + % completion (slot interface; consumer renders).
- 68b **B-D3** — Middle = §-numbered sections + prose body (slot interface; consumer renders).
- 68b **B-D4** — Right rail = triple stack Snapshot / Data sources / Needs your attention (slot interface; consumer renders).
- 68b **B-T1** — Dashboard separation honoured: PhaseStepper sits above shell as page chrome (demo wires this).
- 68b **B-T3** — Right-rail filtered-view contract (slot interface; document slices supply filtered to-dos).
- 68d **S-D1** — Same shell across all 3 documents (Sarah's Picture · Our Household Picture · Settlement Proposal).
- 68d **S-D2** — Title + state chip + autosave stamp top-bar slot.
- 68d **S-D4** — Autosave stamp typed prop.

## Definition of Done (per CLAUDE.md §"Engineering conventions")

- [ ] All 6 AC met with evidence per AC sign-off table
- [ ] Tests written + passing (vitest unit + responsive + keyboard + preview-deploy smoke)
- [ ] Adversarial review done (manual at impl + multi-agent at PR open at k=2)
- [ ] Preview deploy verified in-browser per spec 72a 6-dim rubric
- [ ] No regression in adjacent slices (S-F1 token parity + S-F3 phase-nav + S-F4 trust-chip + S-F7-α/β tests stay GREEN)
- [ ] Open 68f/g entries resolved or explicitly deferred (none registered against S-F2 — structural primitive, not visual anchor)

## Preview-deploy verification (per spec 72a 6-dim rubric)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path (desktop 1280) | ⏳ | _preview-deploy URL + screenshot at wrap_ |
| Edge cases (state variants Draft/Ready/Counter/Agreed; missing optional rails) | ⏳ | _screenshots at wrap_ |
| `prefers-reduced-motion: reduce` | ⏳ | _DevTools emulation screenshot at wrap_ |
| Keyboard-only | ⏳ | _walk-through video or screenshot capture at wrap_ |
| Mobile viewport (375×667) | ⏳ | _preview screenshot at wrap_ |
| Screen-reader (VoiceOver / NVDA spot-check) | ⏳ | _landmark + slot-content traversal note at wrap_ |

## Security DoD (per spec 72 §11)

13-item checklist exercised in `./security.md`. Net at draft: 1 PASS-with-conditions (item 12 adversarial — auto-review at PR open) / 11 N/A with reasoning / 1 deferred to wrap (item 13 npm audit). No FAIL.

## Final-state notes

*Filled at slice wrap.* Per Constraint #27: this file is the final-state record at ship; round-by-round multi-agent audit detail lives in the session HANDOFF + PR description, not here.
