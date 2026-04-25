// S-B-1 — AC-5: docs/SESSION-CONTEXT.md path-typo correction.
// Pre-edit, the wrong path src/lib/ai/recommendations.ts appears 4×
// (lines 45, 64, 232, 235 — kickoff identification).
// Post-edit, those occurrences are replaced with src/lib/bank/confirmation-questions.ts.

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SESSION_CONTEXT = readFileSync(
  resolve(process.cwd(), 'docs/SESSION-CONTEXT.md'),
  'utf-8'
)

describe('S-B-1 · AC-5 SESSION-CONTEXT.md typo correction', () => {
  it('no occurrences of the wrong path src/lib/ai/recommendations.ts remain', () => {
    expect(SESSION_CONTEXT.includes('src/lib/ai/recommendations.ts')).toBe(false)
  })

  it('at least 4 occurrences of the corrected path src/lib/bank/confirmation-questions.ts present', () => {
    const matches = SESSION_CONTEXT.match(
      /src\/lib\/bank\/confirmation-questions\.ts/g
    ) ?? []
    expect(matches.length).toBeGreaterThanOrEqual(4)
  })
})
