import type { PhaseName } from './types'

// Strings LOCKED in spec 68f C-N1c. Byte-equality enforced by the
// parity test which reads the spec source at runtime.

export const UNLOCK_WHEN: Partial<Record<PhaseName, string>> = {
  reconcile: 'Unlocks when you share your picture with Mark',
  settle: 'Unlocks when you and Mark agree on your shared picture',
  finalise: 'Unlocks when your settlement is signed by both of you',
}

export const UNLOCK_WHEN_DASHBOARD: Record<'preparation' | 'reconciliation', string> = {
  preparation: 'Unlocks when preparation is complete',
  reconciliation: 'Unlocks when reconciliation is complete',
}
