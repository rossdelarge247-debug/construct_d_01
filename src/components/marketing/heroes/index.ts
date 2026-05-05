export { HeroEditorial } from './editorial'
export { HeroDeclarative } from './declarative'
export { HeroTypographic } from './typographic'
export { HeroAtmospheric } from './atmospheric'
export { HeroDiagrammatic } from './diagrammatic'
export { HeroProductForward } from './product-forward'
export { HeroOutcomeLed } from './outcome-led'
export { HeroTwoColumn } from './two-column'
export { HeroEmpathetic } from './empathetic'

import { HeroEditorial } from './editorial'
import { HeroDeclarative } from './declarative'
import { HeroTypographic } from './typographic'
import { HeroAtmospheric } from './atmospheric'
import { HeroDiagrammatic } from './diagrammatic'
import { HeroProductForward } from './product-forward'
import { HeroOutcomeLed } from './outcome-led'
import { HeroTwoColumn } from './two-column'
import { HeroEmpathetic } from './empathetic'

export const SELECTED_HERO_VARIANT = 'declarative' as const

export const HERO_VARIANTS = {
  editorial: HeroEditorial,
  declarative: HeroDeclarative,
  typographic: HeroTypographic,
  atmospheric: HeroAtmospheric,
  diagrammatic: HeroDiagrammatic,
  'product-forward': HeroProductForward,
  'outcome-led': HeroOutcomeLed,
  'two-column': HeroTwoColumn,
  empathetic: HeroEmpathetic,
} as const

export type HeroVariantSlug = keyof typeof HERO_VARIANTS
