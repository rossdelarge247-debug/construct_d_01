import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Journey } from '@/components/marketing/sections/journey'

describe('marketing/sections/Journey', () => {
  it('renders the eyebrow "How it works" and the headline halves', () => {
    render(<Journey />)
    expect(screen.getByText('How it works')).toBeDefined()
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2.textContent).toContain('One workspace. Four documents.')
    expect(h2.textContent).toContain(
      'Five phases — from first question to court-sealed agreement'
    )
  })

  it('renders the five phase names in order', () => {
    const { container } = render(<Journey />)
    const phases = ['Start', 'Build', 'Reconcile', 'Settle', 'Finalise']
    for (const name of phases) {
      expect(container.textContent).toContain(name)
    }
    // assert ordered: Start before Build before Reconcile etc.
    const text = container.textContent || ''
    let lastIndex = -1
    for (const name of phases) {
      const idx = text.indexOf(name)
      expect(idx).toBeGreaterThan(lastIndex)
      lastIndex = idx
    }
  })

  it('renders the four document names per phase', () => {
    const { container } = render(<Journey />)
    for (const doc of [
      'Free orientation',
      "Sarah's Picture",
      'Our Household Picture',
      'The Settlement Proposal',
      'Court-ready package',
    ]) {
      expect(container.textContent).toContain(doc)
    }
  })

  it('renders the keyboard affordance hint', () => {
    const { container } = render(<Journey />)
    expect(container.textContent).toContain('Press')
    expect(container.textContent).toContain('to walk through each phase')
    expect(container.querySelector('.kbd')).not.toBeNull()
  })

  it('marks the section with id="journey" and aria-labelledby', () => {
    const { container } = render(<Journey />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('journey')
    expect(section?.getAttribute('aria-labelledby')).toBeTruthy()
  })
})
