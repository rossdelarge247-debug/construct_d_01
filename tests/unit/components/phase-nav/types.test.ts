import { describe, it, expect } from 'vitest'
import type {
  PhaseName,
  PhaseStatus,
  PhaseEntry,
  PhasesData,
  SubItem,
} from '@/components/phase-nav/types'

describe('phase-nav types (S-F3 AC-4)', () => {
  it('PhaseName accepts valid 5-phase names', () => {
    const phases: PhaseName[] = ['start', 'build', 'reconcile', 'settle', 'finalise']
    expect(phases).toHaveLength(5)
  })

  it('PhaseStatus accepts the 3 spec-locked states', () => {
    const statuses: PhaseStatus[] = ['complete', 'current', 'locked']
    expect(statuses).toHaveLength(3)
  })

  it('PhaseEntry has the expected shape', () => {
    const entry: PhaseEntry = { name: 'build', label: 'Build', status: 'current' }
    expect(entry.name).toBe('build')
    expect(entry.status).toBe('current')
  })

  it('SubItem accepts label-only and label+href forms', () => {
    const a: SubItem = { label: 'Section 1' }
    const b: SubItem = { label: 'Section 2', href: '#section-2' }
    expect(a.href).toBeUndefined()
    expect(b.href).toBe('#section-2')
  })

  it('PhasesData is a readonly array', () => {
    const data: PhasesData = [{ name: 'start', label: 'Start', status: 'complete' }]
    expect(data).toHaveLength(1)
  })
})
