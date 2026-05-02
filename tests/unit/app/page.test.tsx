import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import LandingPage from '@/app/page'

describe('LandingPage', () => {
  it('renders the Decouple heading', () => {
    const { getByText } = render(<LandingPage />)
    expect(getByText('Decouple')).toBeTruthy()
  })

  it('renders the S-F3 phase nav demo block', () => {
    const { container } = render(<LandingPage />)
    expect(
      container.querySelector('[aria-label="Phase navigation demo (S-F3)"]'),
    ).toBeTruthy()
  })

  it('demos PhaseStepper + JourneyMapRail + LockedSection', () => {
    const { container } = render(<LandingPage />)
    expect(container.querySelector('nav[aria-label="Phase progress"]')).toBeTruthy()
    expect(container.querySelector('nav[aria-label="Journey map"]')).toBeTruthy()
    expect(container.querySelector('section[aria-disabled="true"]')).toBeTruthy()
  })

  it('renders the S-F4 trust chip demo block with all 6 levels', () => {
    const { container } = render(<LandingPage />)
    const section = container.querySelector('[aria-label="Trust chip demo (S-F4)"]')
    expect(section).toBeTruthy()
    const chips = section?.querySelectorAll('[data-trust-chip-level]') ?? []
    expect(chips.length).toBe(6)
  })
})
