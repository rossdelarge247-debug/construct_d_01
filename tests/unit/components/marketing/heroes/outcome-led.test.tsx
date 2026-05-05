import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroOutcomeLed } from '@/components/marketing/heroes/outcome-led'

describe('marketing/heroes/HeroOutcomeLed', () => {
  it('renders the eyebrow + H1 + subhead verbatim', () => {
    render(<HeroOutcomeLed />)
    expect(screen.getByText("The end you're working toward")).toBeDefined()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('A consent order')
    expect(h1.textContent).toContain('sealed')
    expect(h1.textContent).toContain('by the court')
    expect(
      screen.getByText(/Decouple takes you the whole way/)
    ).toBeDefined()
  })

  it('renders the primary CTA', () => {
    render(<HeroOutcomeLed />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
  })

  it('renders the outcome-led signature: Form A consent-order doc mock + SEALED stamp + 5 numbered order lines', () => {
    const { container } = render(<HeroOutcomeLed />)
    expect(screen.getByText('FORM A · CONSENT ORDER')).toBeDefined()
    expect(screen.getByText('In the Family Court at London')).toBeDefined()
    expect(screen.getByText(/Between Sarah Hayes/)).toBeDefined()
    expect(screen.getByText('SEALED')).toBeDefined()
    expect(screen.getByText('14 · APR · 2026')).toBeDefined()
    expect(screen.getByText('FAMILY COURT')).toBeDefined()
    expect(screen.getByText('Issued via Decouple')).toBeDefined()
    expect(screen.getByText('Case No. FA-26-0418')).toBeDefined()
    for (const fragment of [
      /claims for financial provision are dismissed/,
      /property at 14 Linden Road/,
      /Pension sharing order/,
      /Periodical payments/,
      /Lump sum of £24,000/,
    ]) {
      expect(container.textContent).toMatch(fragment)
    }
  })

  it('marks the section with id="hero" and aria-labelledby pointing at the H1', () => {
    const { container } = render(<HeroOutcomeLed />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('hero')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H1')
    }
  })
})
