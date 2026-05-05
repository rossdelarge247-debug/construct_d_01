import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroAtmospheric } from '@/components/marketing/heroes/atmospheric'

describe('marketing/heroes/HeroAtmospheric', () => {
  it('renders the eyebrow + H1 + subhead verbatim', () => {
    render(<HeroAtmospheric />)
    expect(screen.getByText('The complete settlement workspace')).toBeDefined()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('Untangle')
    expect(h1.textContent).toContain('everything')
    expect(h1.textContent).toContain('Move forward')
    expect(
      screen.getByText(/Finances, children, housing — and the agreement/)
    ).toBeDefined()
  })

  it('renders the primary CTA + the trust signals (FCA · Read-only · Free)', () => {
    render(<HeroAtmospheric />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
    expect(screen.getByText('FCA-regulated via TrueLayer')).toBeDefined()
    expect(screen.getByText('Read-only access')).toBeDefined()
    expect(screen.getByText('Free until you sign up')).toBeDefined()
  })

  it('renders the atmospheric signature: dark surface + radial-gradient backdrop', () => {
    const { container } = render(<HeroAtmospheric />)
    const section = container.querySelector('section')
    const sectionBg = section?.style.backgroundColor || ''
    expect(sectionBg.toLowerCase()).toMatch(/rgb\(15, 14, 12\)|#0f0e0c/)
    const backdrop = container.querySelector('[data-hero-backdrop]')
    expect(backdrop).toBeDefined()
    const backdropStyle = (backdrop as HTMLElement | null)?.style.backgroundImage || ''
    expect(backdropStyle).toContain('radial-gradient')
  })

  it('marks the section with id="hero" and aria-labelledby pointing at the H1', () => {
    const { container } = render(<HeroAtmospheric />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('hero')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H1')
    }
  })
})
