import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { UNLOCK_WHEN, UNLOCK_WHEN_DASHBOARD } from '@/components/phase-nav/copy'

const specPath = resolve(
  process.cwd(),
  'docs/workspace-spec/68f-open-decisions-register.md',
)
const spec = readFileSync(specPath, 'utf-8')

describe('phase-nav copy — 68f C-N1c LOCKED parity (S-F3 AC-3)', () => {
  it('UNLOCK_WHEN.reconcile matches spec verbatim', () => {
    expect(spec).toContain(UNLOCK_WHEN.reconcile!)
  })

  it('UNLOCK_WHEN.settle matches spec verbatim', () => {
    expect(spec).toContain(UNLOCK_WHEN.settle!)
  })

  it('UNLOCK_WHEN.finalise matches spec verbatim', () => {
    expect(spec).toContain(UNLOCK_WHEN.finalise!)
  })

  it('Build phase has no unlock-when copy (implicit per C-N1c)', () => {
    expect(UNLOCK_WHEN.build).toBeUndefined()
  })

  it('Start phase has no unlock-when copy (implicit per spec 42 5-phase)', () => {
    expect(UNLOCK_WHEN.start).toBeUndefined()
  })

  it('UNLOCK_WHEN_DASHBOARD.preparation matches spec verbatim', () => {
    expect(spec).toContain(UNLOCK_WHEN_DASHBOARD.preparation)
  })

  it('UNLOCK_WHEN_DASHBOARD.reconciliation matches spec verbatim', () => {
    expect(spec).toContain(UNLOCK_WHEN_DASHBOARD.reconciliation)
  })
})
