import { describe, it, expect } from 'vitest'
import * as documentShellIndex from '@/components/document-shell'

describe('@/components/document-shell barrel exports', () => {
  it('exposes the public API of the document-shell module', () => {
    expect(documentShellIndex.DocumentShell).toBeDefined()
    expect(documentShellIndex.STATE_LABELS).toBeDefined()
  })
})
