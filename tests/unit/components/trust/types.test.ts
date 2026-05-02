import { describe, it, expect } from 'vitest'
import type { TrustLevel } from '@/components/trust/types'

describe('TrustLevel type union (S-F4)', () => {
  it('accepts the 6 C-T2 LOCKED literal values', () => {
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
