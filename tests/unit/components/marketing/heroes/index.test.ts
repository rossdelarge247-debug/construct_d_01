import { describe, it, expect } from 'vitest'
import {
  HERO_VARIANTS,
  SELECTED_HERO_VARIANT,
  HeroEditorial,
} from '@/components/marketing/heroes'

describe('marketing/heroes barrel', () => {
  it('exports HeroEditorial as a function component', () => {
    expect(typeof HeroEditorial).toBe('function')
  })

  it('exports SELECTED_HERO_VARIANT with default value "editorial"', () => {
    expect(SELECTED_HERO_VARIANT).toBe('editorial')
  })

  it('HERO_VARIANTS map registers HeroEditorial under "editorial"', () => {
    expect(HERO_VARIANTS).toHaveProperty('editorial')
    expect(HERO_VARIANTS.editorial).toBe(HeroEditorial)
  })

  it('HERO_VARIANTS[SELECTED_HERO_VARIANT] resolves to HeroEditorial', () => {
    expect(HERO_VARIANTS[SELECTED_HERO_VARIANT]).toBe(HeroEditorial)
  })
})
