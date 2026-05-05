import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroEmpathetic } from '@/components/marketing/heroes/empathetic'

describe('marketing/heroes/HeroEmpathetic', () => {
  it('renders the eyebrow + H1 + subhead verbatim', () => {
    render(<HeroEmpathetic />)
    expect(screen.getByText("You don't have to figure this out alone")).toBeDefined()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('A calmer way to')
    expect(h1.textContent).toContain('separate')
    expect(
      screen.getByText(/Built with people who've been through it/)
    ).toBeDefined()
  })

  it('renders the primary CTA', () => {
    render(<HeroEmpathetic />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
  })

  it('renders the empathetic signature: Rachel testimonial card + R avatar + 2 compact bylines', () => {
    render(<HeroEmpathetic />)
    expect(
      screen.getByText(/We spent two months avoiding the conversation/)
    ).toBeDefined()
    expect(screen.getByText('Rachel · Manchester')).toBeDefined()
    expect(
      screen.getByText('Settled in 11 weeks · saved an estimated £11,800')
    ).toBeDefined()
    expect(screen.getByText("Mar '26")).toBeDefined()
    expect(screen.getByText('R')).toBeDefined()
    expect(screen.getByText('James, Bristol')).toBeDefined()
    expect(screen.getByText('Settled in 9 weeks · 2 children')).toBeDefined()
    expect(screen.getByText('Priya, London')).toBeDefined()
    expect(screen.getByText('Pension share, no court hearing')).toBeDefined()
  })

  it('marks the section with id="hero" and aria-labelledby pointing at the H1', () => {
    const { container } = render(<HeroEmpathetic />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('hero')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H1')
    }
  })
})
