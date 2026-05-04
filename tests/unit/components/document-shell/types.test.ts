import { describe, it, expect } from 'vitest'
import type { DocumentState } from '@/components/document-shell/types'
import { STATE_LABELS } from '@/components/document-shell/types'

describe('DocumentState type union', () => {
  it('accepts the 5 document-state literal values', () => {
    const valid: DocumentState[] = [
      'draft',
      'ready-to-send',
      'counter-received',
      'in-progress',
      'agreed',
    ]
    expect(valid).toHaveLength(5)
  })
})

describe('STATE_LABELS', () => {
  it('maps every DocumentState to a non-empty uppercase chip label', () => {
    const states: DocumentState[] = [
      'draft',
      'ready-to-send',
      'counter-received',
      'in-progress',
      'agreed',
    ]
    for (const s of states) {
      const label = STATE_LABELS[s]
      expect(label).toBeTruthy()
      expect(label).toBe(label.toUpperCase())
    }
  })
})
