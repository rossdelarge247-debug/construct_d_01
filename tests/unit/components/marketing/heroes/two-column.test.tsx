import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroTwoColumn } from '@/components/marketing/heroes/two-column'

describe('marketing/heroes/HeroTwoColumn', () => {
  it('renders the eyebrow + H1 + subhead verbatim', () => {
    render(<HeroTwoColumn />)
    expect(screen.getByText('Two pictures, finally reconciled')).toBeDefined()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('You and them')
    expect(h1.textContent).toContain('One workspace')
    expect(
      screen.getByText(/You build privately\. They build privately/)
    ).toBeDefined()
  })

  it('renders the primary CTA', () => {
    render(<HeroTwoColumn />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
  })

  it('renders the two-column signature: Sarah vs Mark side-by-side reconciliation table + 4 reconciliation tags', () => {
    render(<HeroTwoColumn />)
    expect(screen.getByText('Sarah')).toBeDefined()
    expect(screen.getByText('Mark')).toBeDefined()
    expect(screen.getByText('Yours')).toBeDefined()
    expect(screen.getByText('Theirs')).toBeDefined()
    const familyHome = screen.getAllByText('Family home')
    expect(familyHome.length).toBe(2)
    const jointSavings = screen.getAllByText('Joint savings')
    expect(jointSavings.length).toBe(2)
    expect(screen.getByText('£510,000')).toBeDefined()
    expect(screen.getByText('£485,000')).toBeDefined()
    for (const tag of [
      /▲ Differs · Family home/,
      /✓ Agreed · Joint savings/,
      /◇ Mark missing · Aviva pension/,
      /▲ Differs · Debts/,
    ]) {
      expect(screen.getByText(tag)).toBeDefined()
    }
  })

  it('marks the section with id="hero" and aria-labelledby pointing at the H1', () => {
    const { container } = render(<HeroTwoColumn />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('hero')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H1')
    }
  })
})
