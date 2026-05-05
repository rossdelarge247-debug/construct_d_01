import { describe, it, expect } from 'vitest'
import {
  HERO_VARIANTS,
  SELECTED_HERO_VARIANT,
  HeroEditorial,
  HeroDeclarative,
  HeroTypographic,
  HeroAtmospheric,
  HeroDiagrammatic,
  HeroProductForward,
  HeroOutcomeLed,
  HeroTwoColumn,
  HeroEmpathetic,
} from '@/components/marketing/heroes'

describe('marketing/heroes barrel', () => {
  it('exports HeroEditorial as a function component', () => {
    expect(typeof HeroEditorial).toBe('function')
  })

  it('exports each additional variant as a function component', () => {
    expect(typeof HeroDeclarative).toBe('function')
    expect(typeof HeroTypographic).toBe('function')
    expect(typeof HeroAtmospheric).toBe('function')
    expect(typeof HeroDiagrammatic).toBe('function')
    expect(typeof HeroProductForward).toBe('function')
    expect(typeof HeroOutcomeLed).toBe('function')
    expect(typeof HeroTwoColumn).toBe('function')
    expect(typeof HeroEmpathetic).toBe('function')
  })

  it('exports SELECTED_HERO_VARIANT with default value "editorial"', () => {
    expect(SELECTED_HERO_VARIANT).toBe('editorial')
  })

  it('HERO_VARIANTS map registers HeroEditorial under "editorial"', () => {
    expect(HERO_VARIANTS).toHaveProperty('editorial')
    expect(HERO_VARIANTS.editorial).toBe(HeroEditorial)
  })

  it('HERO_VARIANTS map registers each additional variant under its slug', () => {
    expect(HERO_VARIANTS.declarative).toBe(HeroDeclarative)
    expect(HERO_VARIANTS.typographic).toBe(HeroTypographic)
    expect(HERO_VARIANTS.atmospheric).toBe(HeroAtmospheric)
    expect(HERO_VARIANTS.diagrammatic).toBe(HeroDiagrammatic)
    expect(HERO_VARIANTS['product-forward']).toBe(HeroProductForward)
    expect(HERO_VARIANTS['outcome-led']).toBe(HeroOutcomeLed)
    expect(HERO_VARIANTS['two-column']).toBe(HeroTwoColumn)
    expect(HERO_VARIANTS.empathetic).toBe(HeroEmpathetic)
  })

  it('HERO_VARIANTS contains the keys for all currently registered variants', () => {
    const keys = Object.keys(HERO_VARIANTS).sort()
    expect(keys).toContain('editorial')
    expect(keys).toContain('declarative')
    expect(keys).toContain('typographic')
    expect(keys).toContain('atmospheric')
    expect(keys).toContain('diagrammatic')
    expect(keys).toContain('product-forward')
    expect(keys).toContain('outcome-led')
    expect(keys).toContain('two-column')
    expect(keys).toContain('empathetic')
  })

  it('HERO_VARIANTS[SELECTED_HERO_VARIANT] resolves to HeroEditorial', () => {
    expect(HERO_VARIANTS[SELECTED_HERO_VARIANT]).toBe(HeroEditorial)
  })
})
