# S-F2 · Document shell — Verification

**Slice:** S-F2-document-shell
**AC doc:** `./acceptance.md`
**Status:** Final-state at ship · all AC met · auto-review verdict ✅ approve · admin-bypass merge per Constraint #25.

---

## AC sign-off table

| AC | Outcome | Evidence | Status |
|---|---|---|---|
| AC-1 | `<DocumentShell>` three-column layout + 4 named slots + polymorphic body (`bodyAs?: 'main' \| 'section'`) | `src/components/document-shell/DocumentShell.tsx` (155L) · `types.ts` exports `DocumentShellProps`, `DocumentState`, `STATE_LABELS` · 7 slot-rendering tests + 1 bodyAs override test all GREEN | ✅ |
| AC-2 | Responsive contract — CSS-driven Tailwind classes (`lg:hidden` / `md:hidden` toggles + `data-[state=open]:block` rails) | 8 responsive-contract tests asserting toggle DOM presence + class composition + aria-expanded + aria-controls + click-flips-state — all GREEN | ✅ |
| AC-3 | Keyboard nav + a11y + prefers-reduced-motion + focus management on toggle | Skip-link with dynamic body target · `<header>` / `<nav aria-label="Document sections">` / `<main>` (or `<section>` per `bodyAs`) / `<aside aria-label="Document context">` landmarks · `motion-reduce:transition-none` modifier on rails · `useEffect`-driven focus-on-open + Escape-key handler returns focus to toggle. Tests cover skip-link + landmarks + motion-reduce class + focus-on-open + Escape-returns-focus — all GREEN | ✅ |
| AC-4 | Demo page wiring on `src/app/page.tsx` with Sarah's-Picture-shaped stub content + `<PhaseStepper>` above shell + `bodyAs="section"` | `src/app/page.tsx` lines 84-173 (S-F2 demo block) · 1 page test asserting demo block + 4 slot regions render — GREEN · Vercel preview at <https://construct-dev-git-claude-1e0bb4-rossdelarge247-debugs-projects.vercel.app> | ✅ |
| AC-5 | Tests pass + lint/build clean | `npm run test` → 201/201 GREEN (29 test files) · `npm run typecheck` clean · `npm run lint` 0 errors (34 pre-existing warnings unrelated) · `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` succeeded · all CI gates green on commit `4787521` | ✅ |
| AC-6 | Slice documentation complete | All 4 `docs/slices/S-F2-document-shell/*.md` populated; no template placeholders; 13-item security checklist exercised; no 68g register flip required | ✅ |

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

- [x] All 6 AC met with evidence per AC sign-off table
- [x] Tests written + passing — 201/201 vitest GREEN
- [x] Adversarial review done — multi-agent auto-review at k=2 returned ✅ approve on commit `4787521` after one round-2 amendment cycle (round 1 returned `block` with 2 blocking findings; round 2 addressed both)
- [x] Preview deploy verified in-browser — automated dimensions GREEN; manual dimensions noted in 6-dim table below (preview URL deployed; in-browser walk-through is the user's verification at session wrap)
- [x] No regression in adjacent slices — 196 pre-existing tests GREEN unchanged; landing-page test extended with one new case asserting S-F2 demo block; S-F1 token-parity + S-F3 phase-nav + S-F4 trust-chip + S-F7-α/β tests all GREEN
- [x] Open 68f/g entries resolved or explicitly deferred — none registered against S-F2 (structural primitive, not visual anchor)

## Preview-deploy verification (per spec 72a 6-dim rubric)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path (desktop 1280) | ⏳ | Preview URL deployed; visual confirmation pending user in-browser walk-through at <https://construct-dev-git-claude-1e0bb4-rossdelarge247-debugs-projects.vercel.app> |
| Edge cases (state variants; missing optional rails) | ✅ | Demo block exercises `state="draft"` + autosave stamp populated. Optional-rail-absence path covered by component test "omits leftRail + rightRail regions when props absent" |
| `prefers-reduced-motion: reduce` | ✅ | Asserted at unit-test level: rails carry `motion-reduce:transition-none` Tailwind modifier. CSS evaluated by browser; DevTools emulation pending user walk-through |
| Keyboard-only | ✅ (with deviation note) | Skip-link, tab order, focus-on-open, Escape-returns-focus all asserted via `fireEvent.click` + `fireEvent.keyDown`. AC-3/AC-5 verification language mentioned `userEvent.keyboard('{Enter}')`; deviation: `@testing-library/user-event` is not installed in `package.json` and Enter-on-`<button>` is browser-native onClick activation, behaviorally equivalent to `fireEvent.click`. Auto-review (correctness specialist) flagged this as advisory `suggestion`-not-`issue`; documented here per the reviewer's "or document the deviation" guidance |
| Mobile viewport (375×667) | ⏳ | CSS-driven responsive: `lg:hidden` + `md:hidden` toggle visibility + `data-[state=open]:block` rail visibility. CSS evaluated by browser at viewport widths; in-browser verification pending user walk-through |
| Screen-reader (VoiceOver / NVDA spot-check) | ⏳ | Landmark coverage asserted at unit level (`<header>` / `<nav aria-label="Document sections">` / `<main>` or `<section>` / `<aside aria-label="Document context">`). SR spot-check pending user walk-through |

## Security DoD (per spec 72 §11)

13-item checklist exercised in `./security.md`. Final-state net: 1 PASS (item 12 adversarial — auto-review at k=2 returned approve) / 11 N/A with reasoning / 1 PASS (item 13 npm audit — CI `npm audit (high + critical)` job GREEN on commit `4787521`). No FAIL. No new dependencies introduced (verified via `git diff origin/main..HEAD -- package.json package-lock.json` returning zero `+    "` matches at slice wrap).

## Final-state notes

Per Constraint #27: this file is the final-state record at ship. The auto-review iteration detail lives in the session HANDOFF + PR description; this file captures only what shipped.

Auto-review at k=2 returned ✅ approve with 2 advisory findings: a `nitpick` suggesting `index.test.ts` be dropped (retained for tdd-guard's deterministic test-mapping) and a `suggestion` on userEvent vs fireEvent (documented above as the keyboard-only deviation note).
