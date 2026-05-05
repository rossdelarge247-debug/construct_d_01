import { describe, it, expect } from 'vitest'
import {
  HERO_VARIANTS,
  SELECTED_HERO_VARIANT,
  HeroEditorial,
  HeroDeclarative,
  HeroTypographic,
  HeroAtmospheric,
  HeroDiagrammatic,
} from '@/components/marketing/heroes'

describe('marketing/heroes barrel', () => {
  it('exports HeroEditorial as a function component', () => {
    expect(typeof HeroEditorial).toBe('function')
  })

  it('exports each S-M1.0a variant as a function component', () => {
    expect(typeof HeroDeclarative).toBe('function')
    expect(typeof HeroTypographic).toBe('function')
    expect(typeof HeroAtmospheric).toBe('function')
    expect(typeof HeroDiagrammatic).toBe('function')
  })

  it('exports SELECTED_HERO_VARIANT with default value "editorial"', () => {
    expect(SELECTED_HERO_VARIANT).toBe('editorial')
  })

  it('HERO_VARIANTS map registers HeroEditorial under "editorial"', () => {
    expect(HERO_VARIANTS).toHaveProperty('editorial')
    expect(HERO_VARIANTS.editorial).toBe(HeroEditorial)
  })

  it('HERO_VARIANTS map registers each S-M1.0a variant under its slug', () => {
    expect(HERO_VARIANTS.declarative).toBe(HeroDeclarative)
    expect(HERO_VARIANTS.typographic).toBe(HeroTypographic)
    expect(HERO_VARIANTS.atmospheric).toBe(HeroAtmospheric)
    expect(HERO_VARIANTS.diagrammatic).toBe(HeroDiagrammatic)
  })

  it('HERO_VARIANTS contains exactly the 5 keys shipped at S-M1.0a (4 of 8 follow-up variants)', () => {
    expect(Object.keys(HERO_VARIANTS).sort()).toEqual([
      'atmospheric',
      'declarative',
      'diagrammatic',
      'editorial',
      'typographic',
    ])
  })

  it('HERO_VARIANTS[SELECTED_HERO_VARIANT] resolves to HeroEditorial', () => {
    expect(HERO_VARIANTS[SELECTED_HERO_VARIANT]).toBe(HeroEditorial)
  })
})
