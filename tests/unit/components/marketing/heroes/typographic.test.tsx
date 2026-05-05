import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroTypographic } from '@/components/marketing/heroes/typographic'

describe('marketing/heroes/HeroTypographic', () => {
  it('renders the eyebrow + H1 + subhead verbatim', () => {
    render(<HeroTypographic />)
    expect(screen.getByText('The complete settlement workspace')).toBeDefined()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('Decouple')
    expect(h1.textContent).toContain('together')
    expect(
      screen.getByText(/A single workspace for finances, children, housing/)
    ).toBeDefined()
  })

  it('renders the primary CTA', () => {
    render(<HeroTypographic />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
  })

  it('renders the typographic signature: centered serif H1 with italic accent on "together"', () => {
    render(<HeroTypographic />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.className).toContain('serif')
    expect(h1.className).toContain('text-center')
    const italicSpan = h1.querySelector('span')
    expect(italicSpan?.style.fontStyle).toBe('italic')
    expect(italicSpan?.textContent).toBe('together')
  })

  it('marks the section with id="hero" and aria-labelledby pointing at the H1', () => {
    const { container } = render(<HeroTypographic />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('hero')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H1')
    }
  })
})
