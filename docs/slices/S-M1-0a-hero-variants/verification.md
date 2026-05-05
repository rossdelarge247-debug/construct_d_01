# Verification — S-M1.0a hero variants + dev gallery

Final-state record at each PR's merge per CLAUDE.md Constraint #27. Round-by-round multi-agent audit detail lives in PR descriptions and HANDOFF docs.

## Status

**Slice ship state:** ✅ MET — 8 hero variants + gallery rendering all 9 heroes shipped across two PRs (P1a: 4 simpler variants + scaffold; P1b: 4 complex variants + gallery completion). Production hero unchanged (`SELECTED_HERO_VARIANT='editorial'`); the `HERO_VARIANTS` map shape now contains all 9 keys.

## Phase status

| Phase | AC ref | Surface | Status | Evidence |
|---|---|---|---|---|
| P1a-1 | AC-1 + AC-2 | 4 simpler variants + smoke tests (Declarative · Typographic · Atmospheric · Diagrammatic) | ✅ shipped | 16 tests across 4 files (4 tests per variant: text verbatim · CTA · signature · landmark) |
| P1a-2 | AC-3 | `HERO_VARIANTS` 1 → 5 keys + barrel test | ✅ shipped | 6 tests in `tests/unit/components/marketing/heroes/index.test.ts` |
| P1a-3 | AC-4 + AC-5 | Dev gallery scaffold (5 of 9 heroes) + page test | ✅ shipped | 5 tests in `tests/unit/app/dev/heroes/page.test.tsx` (round-2 unique-id test added) |
| P1b-1 | AC-1 + AC-2 | 4 complex variants + smoke tests (ProductForward · OutcomeLed · TwoColumn · Empathetic) | ✅ shipped | 16 tests across 4 files |
| P1b-2 | AC-3 | `HERO_VARIANTS` 5 → 9 keys + barrel test extension | ✅ shipped | barrel test extended with 4 new variant assertions per category (function-typed, map-registered, key-listed) |
| P1b-3 | AC-4 + AC-5 | Gallery extension to 9 heroes + page test extension | ✅ shipped | `GALLERY` table extended; page test subtitles list extended; dynamic-count assertions stable |

## Acceptance criteria status

| AC | Status | Evidence |
|---|---|---|
| AC-1 (8 variants) | ✅ MET | `src/components/marketing/heroes/{declarative,typographic,atmospheric,diagrammatic,product-forward,outcome-led,two-column,empathetic}.tsx`; each named-exported function component with optional `id?: string` prop (default `'hero'`) |
| AC-2 (8 smoke tests) | ✅ MET | `tests/unit/components/marketing/heroes/{...}.test.tsx`; 32/32 GREEN across the 8 new variant test files (4 tests each) |
| AC-3 (9-key map) | ✅ MET | `HERO_VARIANTS` contains 9 keys: editorial · declarative · typographic · atmospheric · diagrammatic · product-forward · outcome-led · two-column · empathetic. `HERO_VARIANTS[SELECTED_HERO_VARIANT]` resolves to HeroEditorial. Multi-word slugs use kebab-case (quoted keys). |
| AC-4 (gallery page) | ✅ MET | `src/app/dev/heroes/page.tsx` `GALLERY` table iterates all 9 heroes; each rendered with unique `id={`hero-${slug}`}` to avoid duplicate-id collision |
| AC-5 (gallery page test) | ✅ MET | 5 assertions in `tests/unit/app/dev/heroes/page.test.tsx` covering slug labels, design subtitles, h1 count, aria-labelled section count, unique inner section ids — all use `Object.keys(HERO_VARIANTS).length` for stability |

## Aggregate test commands

```bash
npx vitest run tests/unit/components/marketing/heroes/   # 41 tests across 10 files (9 variants × 4 + index barrel × 7)
npx vitest run tests/unit/app/dev/heroes/                # 5 tests (1 file, dynamic against HERO_VARIANTS)
npx vitest run                                           # full suite — clean
npx tsc --noEmit                                         # clean
```

## Sign-off

- P1b ships at this PR's merge — slice fully closed.
- 68f/g entries: none open against S-M1.0a.
- Mobile-viewport defects observed on the parent S-M1 slice unchanged — S-M1.0b (responsive design pass) remains the closure path for AC-9.

## Status footer

- Originated: P1a (PR #97 squash-merged at commit `5af33fed`; session 67)
- P1b — current PR (session 67; closes the slice)
