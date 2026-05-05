import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CTAPrimary } from '@/components/marketing/atoms/cta-primary'

describe('marketing/atoms/CTAPrimary', () => {
  it('renders an anchor with default href "/start"', () => {
    const { container } = render(<CTAPrimary />)
    const a = container.querySelector('a')
    expect(a).not.toBeNull()
    expect(a?.getAttribute('href')).toBe('/start')
  })

  it('renders default label and time copy', () => {
    render(<CTAPrimary />)
    expect(screen.getByText('Start your free plan')).toBeDefined()
    expect(
      screen.getByText('~3 minutes · no account needed')
    ).toBeDefined()
  })

  it('honours custom href + label + time props', () => {
    const { container } = render(
      <CTAPrimary href="/foo" label="Go" time="~1 minute" />
    )
    const a = container.querySelector('a')
    expect(a?.getAttribute('href')).toBe('/foo')
    expect(screen.getByText('Go')).toBeDefined()
    expect(screen.getByText('~1 minute')).toBeDefined()
  })

  it('renders the Enter keybind hint', () => {
    const { container } = render(<CTAPrimary />)
    const kbd = container.querySelector('.kbd')
    expect(kbd).not.toBeNull()
    expect(kbd?.textContent).toBe('↵')
  })

  it('inverse variant flips background to white and text to ink', () => {
    const { container } = render(<CTAPrimary inverse />)
    const a = container.querySelector('a') as HTMLElement
    expect(a.style.background).toMatch(/^(rgb\(255,\s*255,\s*255\)|#fff(fff)?)$/i)
  })
})
