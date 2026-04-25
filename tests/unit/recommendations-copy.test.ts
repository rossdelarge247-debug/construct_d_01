/**
 * S-B-2 · Recommendations copy-flip — file-content tests.
 *
 * Asserts spec 73 vocabulary lands in `src/lib/recommendations.ts` per
 * audit-catalogue rows A17–A20 (S-C-U4 lines 82–85, A19 amended S-B-2).
 *
 * Test shape mirrors S-B-1 (boolean-wrapper, no `.toContain` on long
 * source); helper lifted to `tests/helpers/source-assertions.ts` per
 * HANDOFF-30 candidate #4.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { makeSourceAssertions } from '../helpers/source-assertions'

const SOURCE_PATH = resolve(process.cwd(), 'src/lib/recommendations.ts')
const FIXTURE_PATH = resolve(
  process.cwd(),
  'tests/unit/fixtures/recommendations-cat-b-baseline.txt',
)

const source = readFileSync(SOURCE_PATH, 'utf-8')
const catBBaseline = readFileSync(FIXTURE_PATH, 'utf-8').trimEnd()

const { has, lacks, matches } = makeSourceAssertions(source)

describe('S-B-2 · AC-1 §1 vocabulary substitutions (A18 + A19)', () => {
  it('A18 line 166: "stronger foundation for any negotiation or submission" lands', () => {
    expect(has('stronger foundation for any negotiation or submission')).toBe(true)
  })

  it('A18 line 166: original "stronger position for any negotiation or disclosure" is gone', () => {
    expect(lacks('stronger position for any negotiation or disclosure')).toBe(true)
  })

  it('A19 line 196 (amended): "the more it strengthens your picture going into" lands', () => {
    expect(
      has('the more it strengthens your picture going into any discussion or mediation'),
    ).toBe(true)
  })

  it('A19 line 196: original "the stronger your position in any discussion or mediation" is gone', () => {
    expect(lacks('the stronger your position in any discussion or mediation')).toBe(true)
  })
})

describe('S-B-2 · AC-2 §2 exception substitutions (A17 boundary + A20)', () => {
  it('A17 line 163 (boundary): "thorough, formal disclosure" lands (frozen AC text)', () => {
    expect(has('thorough, formal disclosure')).toBe(true)
  })

  it('A17 line 163: pre-amendment "is thorough disclosure —" (without formal) is gone', () => {
    expect(lacks('is thorough disclosure —')).toBe(true)
  })

  it('A20 line 215: "organising your Form E submission" lands', () => {
    expect(has('organising your Form E submission')).toBe(true)
  })

  it('A20 line 215: original "organising your disclosure" is gone', () => {
    expect(lacks('organising your disclosure')).toBe(true)
  })
})

describe('S-B-2 · AC-3 Cat-B legal-process reference preserved verbatim', () => {
  it('line 60: full Cat-B baseline string present byte-for-byte', () => {
    expect(has(catBBaseline)).toBe(true)
  })
})

describe('S-B-2 · AC-4 §2 banned-word audit clean', () => {
  it('zero \\bposition\\b matches anywhere in the file (full §2.2 ban)', () => {
    const positionMatches = matches(/\bposition\b/gi)
    expect(positionMatches.length).toBe(0)
  })

  it('disclos[a-z]* matches exactly the 3-allowlist set (Cat-B + boundary + Cat-D code key)', () => {
    const disclosMatches = matches(/disclos[a-z]*/g)
    expect(disclosMatches.length).toBe(3)
  })

  it('the 3 disclos* matches map to: "disclosure process" (line 60 Cat-B), "thorough, formal disclosure" (line 163 boundary), "share_and_disclose" (line 214 Cat-D code key)', () => {
    expect(has('formal disclosure process')).toBe(true)
    expect(has('thorough, formal disclosure')).toBe(true)
    expect(has("'share_and_disclose'")).toBe(true)
  })
})
