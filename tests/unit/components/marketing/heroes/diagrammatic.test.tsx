import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroDiagrammatic } from '@/components/marketing/heroes/diagrammatic'

describe('marketing/heroes/HeroDiagrammatic', () => {
  it('renders the eyebrow + H1 + subhead verbatim', () => {
    render(<HeroDiagrammatic />)
    expect(screen.getByText('From first question to court-sealed')).toBeDefined()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('One workspace')
    expect(h1.textContent).toContain('Five phases')
    expect(
      screen.getByText(/the agreement\s+sealed by a court/)
    ).toBeDefined()
  })

  it('renders the primary CTA + the "Free until phase 2" sub-CTA line', () => {
    render(<HeroDiagrammatic />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
    expect(screen.getByText('Free until phase 2 · pay once.')).toBeDefined()
  })

  it('renders the diagrammatic signature: 5 numbered phases with key + subtitle each', () => {
    const { container } = render(<HeroDiagrammatic />)
    for (const n of ['1', '2', '3', '4', '5']) {
      expect(container.textContent).toContain(n)
    }
    for (const k of ['Start', 'Build', 'Reconcile', 'Settle', 'Finalise']) {
      expect(container.textContent).toContain(k)
    }
    for (const subtitle of [
      'Free orientation',
      "Sarah's Picture",
      'Household Picture',
      'Settlement Proposal',
      'Court-ready package',
    ]) {
      expect(container.textContent).toContain(subtitle)
    }
  })

  it('marks the section with id="hero" and aria-labelledby pointing at the H1', () => {
    const { container } = render(<HeroDiagrammatic />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('hero')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H1')
    }
  })
})
