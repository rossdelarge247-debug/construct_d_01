import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import LandingPage from '@/app/page'

describe('LandingPage', () => {
  it('renders skip link + main landmark + the five composition sections', () => {
    const { container } = render(<LandingPage />)

    const skip = container.querySelector('a.skip')
    expect(skip).not.toBeNull()
    expect(skip?.getAttribute('href')).toBe('#main')

    expect(container.querySelector('main#main')).not.toBeNull()
    expect(container.querySelector('header')).not.toBeNull()
    expect(container.querySelector('section#hero')).not.toBeNull()
    expect(container.querySelector('section#picture')).not.toBeNull()
    expect(container.querySelector('section#journey')).not.toBeNull()
    expect(container.querySelector('footer')).not.toBeNull()
  })
})
