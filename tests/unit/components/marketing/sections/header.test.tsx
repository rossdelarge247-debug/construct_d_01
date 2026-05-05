import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/marketing/sections/header'

describe('marketing/sections/Header', () => {
  it('renders a banner landmark', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).not.toBeNull()
    expect(header?.getAttribute('role')).toBe('banner')
  })

  it('renders the four nav items with anchor hrefs', () => {
    const { container } = render(<Header />)
    const nav = container.querySelector('nav')
    expect(nav?.getAttribute('aria-label')).toBe('Primary')
    const items = [
      ['The picture', '#picture'],
      ['How it works', '#journey'],
      ['Why us', '#compare'],
      ['Pricing', '#pricing'],
    ]
    for (const [label, href] of items) {
      const a = screen.getByText(label).closest('a')
      expect(a?.getAttribute('href')).toBe(href)
    }
  })

  it('renders the wordmark and the start-CTA pointing at /start', () => {
    const { container } = render(<Header />)
    expect(container.textContent).toContain('decouple')
    expect(container.textContent).toContain('Start your free plan')
    const start = screen.getByText('Start your free plan').closest('a')
    expect(start?.getAttribute('href')).toBe('/start')
  })
})
