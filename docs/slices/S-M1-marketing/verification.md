# S-M1 · Marketing landing — Verification

**Slice:** S-M1-marketing
**Status:** **PARTIAL** — phases 1-3 (foundation: atoms + sections + HeroEditorial) shipped to branch; phases 4-8 (page composition + layout/globals edits + `/start` placeholder + 8 remaining hero variants + `/dev/heroes` gallery + final-state evidence) pending.

This file is final-state-pending. Final-state evidence per AC + spec 72a 6-dimension preview-deploy table populates at slice ship (after phase 4-8 work completes).

---

## Phase status

| Phase | AC ref | Surface | Status | Evidence |
|---|---|---|---|---|
| 1 | partial AC-2 + AC-10 | `src/components/marketing/atoms/` (8 components + barrel) | ✅ shipped | 48 tests passing across 8 files; commit `406e333` |
| 2 | partial AC-1 + AC-5 + AC-7 + AC-10 | `src/components/marketing/sections/` (header + picture-band + journey + footer-minimal) | ✅ shipped | 16 tests passing across 4 files; commit `2e83f14` |
| 3 | AC-2 (single-variant initial; map shape extensible) | `src/components/marketing/heroes/{editorial,index}.tsx` | ✅ shipped | 9 tests passing across 2 files; commit `9508a43`; `SELECTED_HERO_VARIANT='editorial'` + `HERO_VARIANTS={editorial: HeroEditorial}` |
| 4 | AC-1 + AC-5 + AC-6 + AC-7 + AC-8 | `src/app/page.tsx` replacement (composition wiring) | ⏳ deferred | Pending |
| 5 | AC-8 | `src/app/layout.tsx` font additions + `src/app/globals.css` utility classes | ⏳ deferred | Pending |
| 6 | AC-4 | `src/app/start/page.tsx` + `not-found.tsx` (HTTP 404 native) | ⏳ deferred | Pending |
| 7 | AC-3 (extend AC-2 to 9-variant map) | 8 remaining hero variants + `src/app/dev/heroes/page.tsx` | ⏳ deferred | Pending |
| 8 | AC-9 + AC-10 | `## Preview-deploy verification` table + `tests/marketing/colocation.test.ts` | ⏳ deferred | Pending |

## Acceptance criteria status (per `acceptance.md`)

| AC | Status | Evidence (provisional) |
|---|---|---|
| AC-1 (production landing composition) | ⏳ partial — sections built, composition wiring pending | Sections rendered in isolation pass tests; `src/app/page.tsx` not yet wired |
| AC-2 (hero variant set) | ⏳ partial — 1 of 9 variants implemented; map shape extensible | `heroes/index.test.ts` asserts `'editorial'` key + `SELECTED_HERO_VARIANT='editorial'` |
| AC-3 (`/dev/heroes` comparison gallery) | ⏳ deferred to phase 7 | — |
| AC-4 (`/start` HTTP 404 route) | ⏳ deferred to phase 6 | — |
| AC-5 (required content) | ⏳ partial — content present in section components; not yet asserted via composed `page.tsx` test | Section-level tests pass; page-level test pending |
| AC-6 (forbidden framing) | ⏳ partial — section components do not contain "financial disclosure tool"; page-level + `/start` + `/dev/heroes` assertions pending | — |
| AC-7 (landmark + a11y) | ⏳ partial — sections carry `aria-labelledby` wiring; single-h1 + skip-link pending page composition | Section-level landmark tests pass |
| AC-8 (visual treatment) | ⏳ deferred to phase 5 | — |
| AC-9 (preview-deploy 6-dim verification) | ⏳ deferred to phase 8 | — |
| AC-10 (marketing colocation) | ⏳ partial — atoms + sections + heroes colocated under `src/components/marketing/`; colocation test pending | Directory layout matches surface map in `acceptance.md` |

## Aggregate test commands

Final-state run pending. Provisional state on the partial-ship branch:

```
$ npx vitest run tests/unit/components/marketing/
 Test Files  14 passed (14)
      Tests  73 passed (73)
```

`npx tsc --noEmit`, `npm run lint`, `npm run build`, and Vercel preview-deploy verification are pending phase 4-8 completion.

## Preview-deploy verification

⏳ Pending — populates after phase 4-5 wires the landing onto `src/app/page.tsx` and a Vercel preview deploy renders it.

---

## Sign-off

⏳ Pending — slice not yet at DoD #1 (all AC met). Sign-off populates at slice ship (after phase 4-8 work completes).
