export { HeroEditorial } from './editorial'

import { HeroEditorial } from './editorial'

export const SELECTED_HERO_VARIANT = 'editorial' as const

export const HERO_VARIANTS = {
  editorial: HeroEditorial,
} as const

export type HeroVariantSlug = keyof typeof HERO_VARIANTS
