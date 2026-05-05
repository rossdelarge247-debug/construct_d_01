import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroDeclarative } from '@/components/marketing/heroes/declarative'

describe('marketing/heroes/HeroDeclarative', () => {
  it('renders the eyebrow + H1 fragments + sub-CTA italic line', () => {
    render(<HeroDeclarative />)
    expect(screen.getByText('Decouple · for separating couples')).toBeDefined()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('The complete')
    expect(h1.textContent).toContain('separation')
    expect(h1.textContent).toContain('finally settled')
    expect(
      screen.getByText('Under £1,000. Three months. One workspace.')
    ).toBeDefined()
  })

  it('renders the primary CTA', () => {
    render(<HeroDeclarative />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
  })

  it('renders the declarative signature: large serif H1 with italic accent on "separation"', () => {
    render(<HeroDeclarative />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.className).toContain('serif')
    const italicSpan = h1.querySelector('span')
    expect(italicSpan?.style.fontStyle).toBe('italic')
    expect(italicSpan?.textContent).toBe('separation')
  })

  it('marks the section with id="hero" and aria-labelledby pointing at the H1', () => {
    const { container } = render(<HeroDeclarative />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('hero')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H1')
    }
  })
})
