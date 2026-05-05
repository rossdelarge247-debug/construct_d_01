import { describe, it, expect } from 'vitest'
import { applyCategoryOverrides } from '@/app/dev/engine-workbench/page.dev'

describe('applyCategoryOverrides', () => {
  const makeItem = (id: string, autoCategory: string, confidence: number) => ({
    id,
    autoCategory,
    confidence,
  })

  it('returns a new array (different reference) even when no indices are updated', () => {
    const items = [makeItem('A', 'groceries', 0.8)]
    const result = applyCategoryOverrides(items, new Set(), 'dining')
    expect(result).not.toBe(items)
    expect(result).toEqual(items)
  })

  it('updates autoCategory + confidence at target indices', () => {
    const items = [
      makeItem('A', 'groceries', 0.8),
      makeItem('B', 'dining', 0.6),
    ]
    const result = applyCategoryOverrides(items, new Set([0]), 'utilities')
    expect(result[0]).toEqual({ id: 'A', autoCategory: 'utilities', confidence: 1.0 })
    expect(result[1]).toEqual({ id: 'B', autoCategory: 'dining', confidence: 0.6 })
  })

  it('preserves object references for non-updated items', () => {
    const items = [
      makeItem('A', 'groceries', 0.8),
      makeItem('B', 'dining', 0.6),
    ]
    const result = applyCategoryOverrides(items, new Set([0]), 'utilities')
    expect(result[1]).toBe(items[1])
    expect(result[0]).not.toBe(items[0])
  })

  it('does not mutate the input items', () => {
    const items = [makeItem('A', 'groceries', 0.8)]
    applyCategoryOverrides(items, new Set([0]), 'utilities')
    expect(items[0]).toEqual({ id: 'A', autoCategory: 'groceries', confidence: 0.8 })
  })

  it('updates all items at multiple target indices', () => {
    const items = [
      makeItem('A', 'groceries', 0.8),
      makeItem('B', 'dining', 0.6),
      makeItem('C', 'fuel', 0.9),
    ]
    const result = applyCategoryOverrides(items, new Set([0, 2]), 'utilities')
    expect(result[0].autoCategory).toBe('utilities')
    expect(result[1].autoCategory).toBe('dining')
    expect(result[2].autoCategory).toBe('utilities')
  })
})
