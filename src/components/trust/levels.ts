import type { TrustLevel } from './types'

export const TRUST_LEVELS: readonly TrustLevel[] = Object.freeze([
  'self-declared',
  'bank-evidenced',
  'credit-verified',
  'document-evidenced',
  'both-party-agreed',
  'court-sealed',
] as const)

export const DEFAULT_LEVEL: TrustLevel = 'self-declared'

export function humaniseLevel(level: TrustLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1)
}
