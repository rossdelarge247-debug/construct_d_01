import { describe, it, expect } from 'vitest'
import { TRUST_LEVELS, DEFAULT_LEVEL, humaniseLevel } from '@/components/trust/levels'
import type { TrustLevel } from '@/components/trust/types'

describe('Trust taxonomy — levels + helper', () => {
  it('TRUST_LEVELS has 6 entries', () => {
    expect(TRUST_LEVELS).toHaveLength(6)
  })

  it('TRUST_LEVELS ordering matches the canonical sequence', () => {
    expect([...TRUST_LEVELS]).toEqual([
      'self-declared',
      'bank-evidenced',
      'credit-verified',
      'document-evidenced',
      'both-party-agreed',
      'court-sealed',
    ])
  })

  it('DEFAULT_LEVEL is self-declared', () => {
    expect(DEFAULT_LEVEL).toBe('self-declared')
  })

  it('humaniseLevel returns capitalised hyphenated form', () => {
    expect(humaniseLevel('self-declared')).toBe('Self-declared')
    expect(humaniseLevel('bank-evidenced')).toBe('Bank-evidenced')
    expect(humaniseLevel('credit-verified')).toBe('Credit-verified')
    expect(humaniseLevel('document-evidenced')).toBe('Document-evidenced')
    expect(humaniseLevel('both-party-agreed')).toBe('Both-party-agreed')
    expect(humaniseLevel('court-sealed')).toBe('Court-sealed')
  })

  it('TRUST_LEVELS is frozen (immutable export)', () => {
    expect(Object.isFrozen(TRUST_LEVELS)).toBe(true)
  })

  it('TrustLevel union is exhaustive across TRUST_LEVELS', () => {
    const allLevels: TrustLevel[] = [...TRUST_LEVELS]
    const set = new Set<TrustLevel>(allLevels)
    expect(set.size).toBe(6)
  })
})
