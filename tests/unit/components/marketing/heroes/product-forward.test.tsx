import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroProductForward } from '@/components/marketing/heroes/product-forward'

describe('marketing/heroes/HeroProductForward', () => {
  it('renders the eyebrow + H1 + subhead verbatim', () => {
    render(<HeroProductForward />)
    expect(screen.getByText('What you actually get')).toBeDefined()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('Your full picture')
    expect(h1.textContent).toContain('In 15 minutes')
    expect(
      screen.getByText(/Connect your bank, confirm what we found/)
    ).toBeDefined()
  })

  it('renders the primary CTA', () => {
    render(<HeroProductForward />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
  })

  it('renders the product-forward signature: reconciliation row sample with 4 pension entries + state badges + footer', () => {
    render(<HeroProductForward />)
    expect(screen.getByText("Sarah's picture · Pensions")).toBeDefined()
    expect(screen.getByText('Private')).toBeDefined()
    for (const name of [
      'Aviva workplace pension',
      'NHS pension (10y)',
      'Nest auto-enrol',
      'Old Standard Life',
    ]) {
      expect(screen.getByText(name)).toBeDefined()
    }
    for (const label of ['Agreed', 'Add evidence', 'Gap', 'Ask later']) {
      expect(screen.getByText(label)).toBeDefined()
    }
    expect(screen.getByText('23 of 127 transactions reviewed')).toBeDefined()
  })

  it('marks the section with id="hero" and aria-labelledby pointing at the H1', () => {
    const { container } = render(<HeroProductForward />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('hero')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H1')
    }
  })
})
