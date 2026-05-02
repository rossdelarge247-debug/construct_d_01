import { describe, it, expect } from 'vitest'
import * as trustIndex from '@/components/trust'

describe('@/components/trust barrel exports', () => {
  it('exposes the public API of the trust module', () => {
    expect(trustIndex.TrustChip).toBeDefined()
    expect(trustIndex.TRUST_LEVELS).toBeDefined()
    expect(trustIndex.DEFAULT_LEVEL).toBeDefined()
    expect(typeof trustIndex.humaniseLevel).toBe('function')
  })
})
