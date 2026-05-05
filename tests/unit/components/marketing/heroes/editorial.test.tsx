import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroEditorial } from '@/components/marketing/heroes/editorial'

describe('marketing/heroes/HeroEditorial', () => {
  it('renders the eyebrow + H1 + subhead verbatim', () => {
    render(<HeroEditorial />)
    expect(
      screen.getByText('The complete settlement workspace for separating couples')
    ).toBeDefined()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('Sort out your')
    expect(h1.textContent).toContain('complete separation')
    expect(h1.textContent).toContain('together')
    // subhead is in a sibling paragraph
    const subhead = screen.getByText(/for under £1,000 and in 3 months/)
    expect(subhead).toBeDefined()
    expect(subhead.textContent).toContain('£15,000 and 18 months')
  })

  it('renders the primary CTA + "How it works" secondary link', () => {
    render(<HeroEditorial />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
    const howItWorks = screen.getByText('How it works')
    expect(howItWorks.closest('a')?.getAttribute('href')).toBe('#journey')
  })

  it('renders the trust band signals', () => {
    render(<HeroEditorial />)
    expect(
      screen.getByText('FCA-regulated bank connection via TrueLayer')
    ).toBeDefined()
  })

  it('renders the editorial composition signature: central document spine with the four §-numbered areas', () => {
    const { container } = render(<HeroEditorial />)
    // Signature element: the "central document spine" with the §-prefixed area labels.
    expect(container.textContent).toContain('The Settlement')
    for (const area of ['Finances', 'Children', 'Housing', 'Future needs']) {
      // present at least once in the composition
      expect(container.textContent).toContain(area)
    }
    // EDITORIAL annotation
    expect(
      screen.getByText('EDITORIAL · not a literal screenshot')
    ).toBeDefined()
  })

  it('marks the section with id="hero" and aria-labelledby pointing at the h1', () => {
    const { container } = render(<HeroEditorial />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('hero')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H1')
    }
  })
})
