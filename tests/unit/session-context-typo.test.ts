// S-B-1 — AC-5: docs/SESSION-CONTEXT.md path-typo correction (durable invariant).
//
// The count-of-corrected-path assertion was AC-5-specific verification at PR #16
// commit time; SESSION-CONTEXT evolves session-by-session (e.g. session-30 wrap
// flipped P0 / pre-flight sections forward to S-B-2 → src/lib/recommendations.ts,
// dropping the per-PR-#16 count from 4 → 1). The "no wrong path" assertion
// remains as the durable gate: the legacy typo src/lib/ai/recommendations.ts
// must never reappear in branding usage.

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SESSION_CONTEXT = readFileSync(
  resolve(process.cwd(), 'docs/SESSION-CONTEXT.md'),
  'utf-8'
)

describe('S-B-1 · AC-5 SESSION-CONTEXT.md typo invariant', () => {
  it('no occurrences of the wrong path src/lib/ai/recommendations.ts remain', () => {
    expect(SESSION_CONTEXT.includes('src/lib/ai/recommendations.ts')).toBe(false)
  })
})
