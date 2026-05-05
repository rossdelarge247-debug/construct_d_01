import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FooterMinimal } from '@/components/marketing/sections/footer-minimal'

describe('marketing/sections/FooterMinimal', () => {
  it('renders a contentinfo landmark', () => {
    const { container } = render(<FooterMinimal />)
    const footer = container.querySelector('footer')
    expect(footer).not.toBeNull()
    expect(footer?.getAttribute('role')).toBe('contentinfo')
  })

  it('renders the wordmark, the company line, the FCA / TrueLayer line', () => {
    const { container } = render(<FooterMinimal />)
    expect(container.textContent).toContain('decouple')
    expect(container.textContent).toContain('Decouple Ltd · London')
    expect(container.textContent).toContain(
      'Open Banking via TrueLayer (FCA regulated)'
    )
  })

  it('renders the copyright and the legal disclaimer', () => {
    const { container } = render(<FooterMinimal />)
    expect(container.textContent).toContain(
      '© Decouple Ltd 2026 · All rights reserved'
    )
    expect(container.textContent).toContain(
      'Decouple is not a law firm and does not provide legal advice'
    )
  })

  it('links to existing /privacy /terms /cookies routes', () => {
    render(<FooterMinimal />)
    const expected = [
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
      ['Cookies', '/cookies'],
    ]
    for (const [label, href] of expected) {
      const a = screen.getByText(label).closest('a')
      expect(a?.getAttribute('href')).toBe(href)
    }
  })
})
