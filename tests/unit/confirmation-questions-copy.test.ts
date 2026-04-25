// S-B-1 — Acceptance gates for the 12-row Cat-A copy-flip in
// src/lib/bank/confirmation-questions.ts per spec 73 §1/§2/§3 and
// audit-catalogue rows A1–A12.
//
// AC-1: §1 captured/share substitutions on accordion + status labels
// AC-2: §3 empty-state add substitutions on list-section facts
// AC-3: Cat-B legal-process references preserved (fixture-driven)
// AC-4: §2 banned-word audit gate (disclos* count = 5, cross-validated against Cat-B fixture)

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SOURCE_PATH = resolve(process.cwd(), 'src/lib/bank/confirmation-questions.ts')
const FIXTURE_PATH = resolve(
  process.cwd(),
  'tests/unit/fixtures/confirmation-questions-cat-b-baseline.txt'
)

const source = readFileSync(SOURCE_PATH, 'utf-8')
const catBBaseline = readFileSync(FIXTURE_PATH, 'utf-8')

// Boolean wrapper so vitest failure messages stay small ("expected false to be true")
// rather than dumping the 1998-line source file on every failed `.toContain` assertion.
const has = (needle: string): boolean => source.includes(needle)

describe('S-B-1 · AC-1 §1 captured/share', () => {
  it('A1 line 46 type comment uses captured/share pattern', () => {
    expect(has('"Income captured, ready to share"')).toBe(true)
  })
  it('A2 line 1250: Income captured, ready to share', () => {
    expect(has("'Income captured, ready to share'")).toBe(true)
  })
  it('A6 lines 1433-1435/1449: account labels use captured (template-preserving)', () => {
    expect(has('Savings account captured${valueLabel}')).toBe(true)
    expect(has('ISA captured${valueLabel}')).toBe(true)
    expect(has('Investment account captured${valueLabel}')).toBe(true)
    expect(has('App-based bank account(s) captured${appLabel}')).toBe(true)
  })
  it('A7 line 1474: Accounts captured, ready to share', () => {
    expect(has("'Accounts captured, ready to share'")).toBe(true)
  })
  it('A9 line 1547: ${sourceLabel} captured, ready to share', () => {
    expect(has('${sourceLabel} captured, ready to share')).toBe(true)
  })
  it('A5 line 1401 §1-portion: Property captured, ready to share', () => {
    expect(has("'Property captured, ready to share'")).toBe(true)
  })
  it('A10 line 1637 §1-portion: Debts captured, ready to share', () => {
    expect(has("'Debts captured, ready to share'")).toBe(true)
  })
  it('A11 line 1809 §1-portion: Business interests captured, ready to share', () => {
    expect(has("'Business interests captured, ready to share'")).toBe(true)
  })
  it('A12 line 1996 §1-portion: Other assets captured, ready to share', () => {
    expect(has("'Other assets captured, ready to share'")).toBe(true)
  })
  it('no occurrences of the banned "disclosed, ready for sharing & collaboration" branded phrase remain', () => {
    expect(has('disclosed, ready for sharing & collaboration')).toBe(false)
  })
})

describe('S-B-1 · AC-2 §3 empty-state add', () => {
  it('A4 lines 1288/1303/1304: No property to add (×3)', () => {
    const matches = source.match(/'No property to add'/g) ?? []
    expect(matches.length).toBeGreaterThanOrEqual(3)
  })
  it('A8 lines 1492/1499: No pensions to add', () => {
    expect(has("'No pensions to add'")).toBe(true)
  })
  it('A8 line 1514: Pension(s) to add', () => {
    expect(has("'Pension(s) to add'")).toBe(true)
  })
  it('A3 line 1282: You rent your home — no property to add', () => {
    expect(has('You rent your home — no property to add')).toBe(true)
  })
  it('A10 line 1629 §3-portion: No debts to add', () => {
    expect(has("'No debts to add'")).toBe(true)
  })
  it('A11 line 1801 §3-portion: No business interests to add', () => {
    expect(has("'No business interests to add'")).toBe(true)
  })
  it('A12 line 1954 §3-portion: No other assets to add', () => {
    expect(has("'No other assets to add'")).toBe(true)
  })
  it('no occurrences of the banned "no X to disclose" / "X to disclose" branded phrasing remain', () => {
    const branded = source.match(/(?:no )?[a-z()]+ to disclose/gi) ?? []
    expect(branded).toEqual([])
  })
})

describe('S-B-1 · AC-3 Cat-B legal-process preserved', () => {
  it('every Cat-B baseline line (7 total) appears verbatim in source post-edit', () => {
    const baselineLines = catBBaseline.split('\n').filter((l) => l.trim().length > 0)
    expect(baselineLines.length).toBe(7)
    const missing = baselineLines.filter((line) => !source.includes(line))
    expect(missing).toEqual([])
  })
})

describe('S-B-1 · AC-4 §2 banned-word audit gate', () => {
  it('exactly 5 disclos* matches remain — and each is one of the Cat-B baseline lines (cross-validated)', () => {
    const matches = source.split('\n').filter((text) => /disclos/i.test(text))
    expect(matches.length).toBe(5)

    const catBDisclosLines = catBBaseline
      .split('\n')
      .filter((l) => /disclos/i.test(l))
    expect(catBDisclosLines.length).toBe(5)

    const orphan = matches.filter((m) => !catBDisclosLines.includes(m))
    expect(orphan).toEqual([])
  })
})
