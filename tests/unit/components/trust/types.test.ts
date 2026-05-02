import { describe, it, expect } from 'vitest'
import type { TrustLevel } from '@/components/trust/types'

describe('TrustLevel type union', () => {
  it('accepts the 6 trust-level literal values', () => {
    const valid: TrustLevel[] = [
      'self-declared',
      'bank-evidenced',
      'credit-verified',
      'document-evidenced',
      'both-party-agreed',
      'court-sealed',
    ]
    expect(valid).toHaveLength(6)
  })
})
