import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroGalleryPage from '@/app/dev/heroes/page'

describe('app/dev/heroes/page (gallery)', () => {
  it('renders each hero variant slug as a label', () => {
    render(<HeroGalleryPage />)
    for (const slug of [
      'editorial',
      'declarative',
      'typographic',
      'atmospheric',
      'diagrammatic',
    ]) {
      expect(screen.getByText(slug)).toBeDefined()
    }
  })

  it('renders each hero design subtitle alongside its slug', () => {
    render(<HeroGalleryPage />)
    for (const subtitle of [
      'Calm editorial (close to current)',
      'Confident / declarative · big type, minimal furniture',
      'Typographic · let the headline carry it',
      'Atmospheric · soft orb, dark background, ambient',
      'Diagrammatic · journey-as-system illustration',
    ]) {
      expect(screen.getByText(subtitle)).toBeDefined()
    }
  })

  it('renders one h1 per hero variant (5 in P1a; will reach 9 at P1b)', () => {
    const { container } = render(<HeroGalleryPage />)
    const h1s = container.querySelectorAll('h1')
    expect(h1s.length).toBe(5)
  })

  it('wraps each hero in an aria-labelled section', () => {
    const { container } = render(<HeroGalleryPage />)
    const wrappers = container.querySelectorAll('section[aria-label^="Hero variant:"]')
    expect(wrappers.length).toBe(5)
  })
})
