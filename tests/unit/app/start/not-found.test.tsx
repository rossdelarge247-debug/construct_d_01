import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StartNotFound from '@/app/start/not-found'

describe('StartNotFound', () => {
  it('renders heading "Pre-signup interview opens soon"', () => {
    render(<StartNotFound />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('Pre-signup interview opens soon')
  })

  it('renders an explainer paragraph', () => {
    const { container } = render(<StartNotFound />)
    const p = container.querySelector('p')
    expect(p).not.toBeNull()
    expect(p?.textContent?.length).toBeGreaterThan(40)
  })

  it('renders a "Back to home" link pointing at "/"', () => {
    render(<StartNotFound />)
    const backLink = screen.getByText(/Back to home/)
    const a = backLink.closest('a')
    expect(a).not.toBeNull()
    expect(a?.getAttribute('href')).toBe('/')
  })

  it('renders a main landmark with id="main"', () => {
    const { container } = render(<StartNotFound />)
    const main = container.querySelector('main#main')
    expect(main).not.toBeNull()
  })
})
