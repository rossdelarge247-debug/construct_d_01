import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PhaseStepper } from '@/components/phase-nav/PhaseStepper'
import { buildPhasesData } from '@/components/phase-nav/state'

describe('<PhaseStepper> (S-F3 AC-1, C-V6)', () => {
  it('renders all 5 phases in spec-42 order', () => {
    const phases = buildPhasesData('build', ['start'])
    const { container } = render(<PhaseStepper currentPhase="build" phases={phases} />)
    const items = container.querySelectorAll('[data-phase-name]')
    expect(items).toHaveLength(5)
    expect(items[0].getAttribute('data-phase-name')).toBe('start')
    expect(items[1].getAttribute('data-phase-name')).toBe('build')
    expect(items[2].getAttribute('data-phase-name')).toBe('reconcile')
    expect(items[3].getAttribute('data-phase-name')).toBe('settle')
    expect(items[4].getAttribute('data-phase-name')).toBe('finalise')
  })

  it('marks current phase with aria-current="step"', () => {
    const phases = buildPhasesData('build', ['start'])
    const { container } = render(<PhaseStepper currentPhase="build" phases={phases} />)
    const current = container.querySelector('[aria-current="step"]')
    expect(current?.getAttribute('data-phase-name')).toBe('build')
  })

  it('applies data-phase-stepper-current attribute on current phase', () => {
    const phases = buildPhasesData('build', ['start'])
    const { container } = render(<PhaseStepper currentPhase="build" phases={phases} />)
    const target = container.querySelector('[data-phase-stepper-current]')
    expect(target?.getAttribute('data-phase-name')).toBe('build')
  })

  it('renders nav role with accessible label', () => {
    const phases = buildPhasesData('build', ['start'])
    const { container } = render(<PhaseStepper currentPhase="build" phases={phases} />)
    const nav = container.querySelector('nav')
    expect(nav?.getAttribute('aria-label')).toBe('Phase progress')
  })

  it('reflects status per phase (complete/current/locked)', () => {
    const phases = buildPhasesData('build', ['start'])
    const { container } = render(<PhaseStepper currentPhase="build" phases={phases} />)
    expect(container.querySelector('[data-phase-name="start"]')?.getAttribute('data-phase-status')).toBe('complete')
    expect(container.querySelector('[data-phase-name="build"]')?.getAttribute('data-phase-status')).toBe('current')
    expect(container.querySelector('[data-phase-name="reconcile"]')?.getAttribute('data-phase-status')).toBe('locked')
  })
})
