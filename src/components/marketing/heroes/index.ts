export { HeroEditorial } from './editorial'
export { HeroDeclarative } from './declarative'
export { HeroTypographic } from './typographic'
export { HeroAtmospheric } from './atmospheric'
export { HeroDiagrammatic } from './diagrammatic'

import { HeroEditorial } from './editorial'
import { HeroDeclarative } from './declarative'
import { HeroTypographic } from './typographic'
import { HeroAtmospheric } from './atmospheric'
import { HeroDiagrammatic } from './diagrammatic'

export const SELECTED_HERO_VARIANT = 'editorial' as const

export const HERO_VARIANTS = {
  editorial: HeroEditorial,
  declarative: HeroDeclarative,
  typographic: HeroTypographic,
  atmospheric: HeroAtmospheric,
  diagrammatic: HeroDiagrammatic,
} as const

export type HeroVariantSlug = keyof typeof HERO_VARIANTS
