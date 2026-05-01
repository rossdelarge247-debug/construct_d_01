import { describe, it, expect } from 'vitest'
import {
  PHASES,
  PHASE_LABELS,
  derivePhaseStatus,
  buildPhasesData,
} from '@/components/phase-nav/state'

describe('phase-nav state — derivePhaseStatus (S-F3 AC-4)', () => {
  it('returns "complete" for phases in completed array', () => {
    expect(derivePhaseStatus('start', 'build', ['start'])).toBe('complete')
  })

  it('returns "current" for the current phase', () => {
    expect(derivePhaseStatus('build', 'build', ['start'])).toBe('current')
  })

  it('returns "locked" for non-current, non-complete phases', () => {
    expect(derivePhaseStatus('reconcile', 'build', ['start'])).toBe('locked')
    expect(derivePhaseStatus('settle', 'build', ['start'])).toBe('locked')
    expect(derivePhaseStatus('finalise', 'build', ['start'])).toBe('locked')
  })

  it('honours empty completed array (all non-current → locked)', () => {
    expect(derivePhaseStatus('start', 'build', [])).toBe('locked')
    expect(derivePhaseStatus('reconcile', 'build', [])).toBe('locked')
  })

  it('does not mutate frozen completed array', () => {
    const completed = Object.freeze(['start' as const])
    expect(() => derivePhaseStatus('build', 'build', completed)).not.toThrow()
    expect(completed).toEqual(['start'])
  })
})

describe('phase-nav state — PHASES + PHASE_LABELS constants', () => {
  it('PHASES has 5 entries in spec-42 order', () => {
    expect(PHASES).toEqual(['start', 'build', 'reconcile', 'settle', 'finalise'])
  })

  it('PHASE_LABELS provides labels for all 5 phases', () => {
    expect(PHASE_LABELS).toEqual({
      start: 'Start',
      build: 'Build',
      reconcile: 'Reconcile',
      settle: 'Settle',
      finalise: 'Finalise',
    })
  })
})

describe('phase-nav state — buildPhasesData', () => {
  it('builds 5-entry PhasesData with correct status mapping', () => {
    const data = buildPhasesData('build', ['start'])
    expect(data).toHaveLength(5)
    expect(data[0]).toEqual({ name: 'start', label: 'Start', status: 'complete' })
    expect(data[1]).toEqual({ name: 'build', label: 'Build', status: 'current' })
    expect(data[2]).toEqual({ name: 'reconcile', label: 'Reconcile', status: 'locked' })
    expect(data[3]).toEqual({ name: 'settle', label: 'Settle', status: 'locked' })
    expect(data[4]).toEqual({ name: 'finalise', label: 'Finalise', status: 'locked' })
  })

  it('handles all-complete state', () => {
    const data = buildPhasesData('finalise', ['start', 'build', 'reconcile', 'settle'])
    expect(data.map((p) => p.status)).toEqual([
      'complete',
      'complete',
      'complete',
      'complete',
      'current',
    ])
  })
})
