import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroGalleryPage from '@/app/dev/heroes/page'
import { HERO_VARIANTS } from '@/components/marketing/heroes'

describe('app/dev/heroes/page (gallery)', () => {
  it('renders each hero variant slug as a label', () => {
    render(<HeroGalleryPage />)
    for (const slug of Object.keys(HERO_VARIANTS)) {
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
      'Product-forward · real UI fragment in the hero',
      'Outcome-led · the court-sealed agreement as anchor',
      'Two-column · "his and hers" picture metaphor',
      'Empathetic / human · testimonial-led, real voice',
    ]) {
      expect(screen.getByText(subtitle)).toBeDefined()
    }
  })

  it('renders one h1 per registered hero variant', () => {
    const { container } = render(<HeroGalleryPage />)
    const h1s = container.querySelectorAll('h1')
    expect(h1s.length).toBe(Object.keys(HERO_VARIANTS).length)
  })

  it('wraps each hero in an aria-labelled section', () => {
    const { container } = render(<HeroGalleryPage />)
    const wrappers = container.querySelectorAll('section[aria-label^="Hero variant:"]')
    expect(wrappers.length).toBe(Object.keys(HERO_VARIANTS).length)
  })

  it('passes a unique section id to each hero variant in the gallery', () => {
    const { container } = render(<HeroGalleryPage />)
    const innerSections = container.querySelectorAll(
      'section[aria-label^="Hero variant:"] > section'
    )
    const ids = Array.from(innerSections).map((s) => s.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(Object.keys(HERO_VARIANTS).length)
    expect(uniqueIds.size).toBe(ids.length)
    for (const id of ids) {
      expect(id).toMatch(/^hero-/)
    }
  })
})
