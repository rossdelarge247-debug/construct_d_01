# Verification — S-M1.0a hero variants + dev gallery

Final-state record at each PR's merge per CLAUDE.md Constraint #27. Round-by-round multi-agent audit detail lives in PR descriptions and HANDOFF docs.

## Status

**Slice ship state:** ⏳ in-progress — P1a ships 4 of 8 variants (Declarative · Typographic · Atmospheric · Diagrammatic) + gallery scaffold rendering 5 of 9 heroes; P1b will ship the remaining 4 complex variants (ProductForward · OutcomeLed · TwoColumn · Empathetic) + gallery completion to 9.

## Phase status

| Phase | AC ref | Surface | Status | Evidence |
|---|---|---|---|---|
| P1a-1 | AC-1 + AC-2 | 4 simpler variants + smoke tests | ✅ shipped | 16 tests across 4 files (4 tests per variant: text verbatim · CTA · signature · landmark) |
| P1a-2 | AC-3 | `HERO_VARIANTS` 1 → 5 keys + barrel test | ✅ shipped | 6 tests in `tests/unit/components/marketing/heroes/index.test.ts` |
| P1a-3 | AC-4 + AC-5 | Dev gallery scaffold (5 of 9 heroes) + page test | ✅ shipped | 4 tests in `tests/unit/app/dev/heroes/page.test.tsx` |
| P1b-1 | AC-1 + AC-2 | 4 complex variants + smoke tests | ⏳ pending P1b | |
| P1b-2 | AC-3 | `HERO_VARIANTS` 5 → 9 keys + barrel test extension | ⏳ pending P1b | |
| P1b-3 | AC-4 + AC-5 | Gallery extension to 9 heroes + page test extension | ⏳ pending P1b | |

## Acceptance criteria status

| AC | Status | Evidence |
|---|---|---|
| AC-1 (8 variants) | ⏳ partial (4 of 8 shipped) | `src/components/marketing/heroes/{declarative,typographic,atmospheric,diagrammatic}.tsx`; remaining 4 owned by P1b |
| AC-2 (8 smoke tests) | ⏳ partial (4 of 8 shipped) | `tests/unit/components/marketing/heroes/{declarative,typographic,atmospheric,diagrammatic}.test.tsx`; 16/16 GREEN |
| AC-3 (9-key map) | ⏳ partial (5 of 9 keys) | `HERO_VARIANTS` extended; barrel test asserts 5-key shape; `HERO_VARIANTS[SELECTED_HERO_VARIANT]` still resolves to HeroEditorial |
| AC-4 (gallery page) | ⏳ partial (5 of 9 heroes rendered) | `src/app/dev/heroes/page.tsx`; uses `GALLERY` table for slug + Component + designTitle; map iteration over the 5 currently registered heroes |
| AC-5 (gallery page test) | ⏳ partial (5 of 9 in coverage) | 4 assertions in `tests/unit/app/dev/heroes/page.test.tsx` |

## Aggregate test commands

```bash
npx vitest run tests/unit/components/marketing/heroes/   # 25 tests across 6 files at P1a; will be 41 across 10 files at P1b
npx vitest run tests/unit/app/dev/heroes/                # 4 tests at P1a; will be 4 (extended) at P1b
npx vitest run                                           # full suite — 302 tests at P1a; ~318 at P1b
npx tsc --noEmit                                         # clean
```

## Sign-off

- P1a ships at this PR's merge.
- P1b closes AC-1 (full 8 variants) + AC-2 (full 8 tests) + AC-3 (full 9 map keys) + AC-4 (full gallery to 9) + AC-5 (extended page test).
- 68f/g entries: none open against S-M1.0a.

## Status footer

- Originated PR: P1a (current PR; session 67)
