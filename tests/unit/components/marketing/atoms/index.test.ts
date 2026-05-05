import { describe, it, expect } from 'vitest'
import * as atoms from '@/components/marketing/atoms'

const expectedExports = [
  'CTAPrimary',
  'Eyebrow',
  'PlaceholderTag',
  'SectionHead',
  'TrustBand',
  'Wordmark',
  'ArrowDown',
  'ArrowRight',
  'ArrowUpRight',
  'Check',
  'ChildrenIcon',
  'Coins',
  'Compass',
  'Home',
  'Lock',
  'Plus',
  'Shield',
]

describe('marketing/atoms barrel', () => {
  it.each(expectedExports)('exports %s', (name) => {
    expect(atoms).toHaveProperty(name)
    expect(typeof (atoms as Record<string, unknown>)[name]).toBe('function')
  })
})
