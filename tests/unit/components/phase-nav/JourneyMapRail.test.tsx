import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { JourneyMapRail } from '@/components/phase-nav/JourneyMapRail'
import { buildPhasesData } from '@/components/phase-nav/state'

const sampleSubitems = [
  { label: 'Section 1: About you' },
  { label: 'Section 2: Your finances' },
]

describe('<JourneyMapRail> (S-F3 AC-2, C-N1a + C-N1d)', () => {
  it('renders all 5 phases vertically', () => {
    const phases = buildPhasesData('build', ['start'])
    const { container } = render(
      <JourneyMapRail currentPhase="build" phases={phases} currentSubitems={sampleSubitems} />,
    )
    const items = container.querySelectorAll('[data-phase-name]')
    expect(items).toHaveLength(5)
  })

  it('shows currentSubitems expanded under the current phase', () => {
    const phases = buildPhasesData('build', ['start'])
    const { getByText } = render(
      <JourneyMapRail currentPhase="build" phases={phases} currentSubitems={sampleSubitems} />,
    )
    expect(getByText('Section 1: About you')).toBeTruthy()
    expect(getByText('Section 2: Your finances')).toBeTruthy()
  })

  it('renders unlock-when hint on locked phases (per C-N1c)', () => {
    const phases = buildPhasesData('build', ['start'])
    const { getByText } = render(
      <JourneyMapRail currentPhase="build" phases={phases} />,
    )
    expect(getByText('Unlocks when you share your picture with Mark')).toBeTruthy()
    expect(getByText('Unlocks when you and Mark agree on your shared picture')).toBeTruthy()
    expect(getByText('Unlocks when your settlement is signed by both of you')).toBeTruthy()
  })

  it('renders nav role with accessible label', () => {
    const phases = buildPhasesData('build', ['start'])
    const { container } = render(
      <JourneyMapRail currentPhase="build" phases={phases} />,
    )
    const nav = container.querySelector('nav')
    expect(nav?.getAttribute('aria-label')).toBe('Journey map')
  })

  it('marks current phase with aria-current="step"', () => {
    const phases = buildPhasesData('build', ['start'])
    const { container } = render(
      <JourneyMapRail currentPhase="build" phases={phases} />,
    )
    const current = container.querySelector('[aria-current="step"]')
    expect(current?.getAttribute('data-phase-name')).toBe('build')
  })
})
