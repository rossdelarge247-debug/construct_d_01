import type { PhaseName, PhaseStatus, PhasesData } from './types'

export const PHASES = ['start', 'build', 'reconcile', 'settle', 'finalise'] as const satisfies readonly PhaseName[]

export const PHASE_LABELS: Record<PhaseName, string> = {
  start: 'Start',
  build: 'Build',
  reconcile: 'Reconcile',
  settle: 'Settle',
  finalise: 'Finalise',
}

export function derivePhaseStatus(
  phase: PhaseName,
  current: PhaseName,
  completed: readonly PhaseName[],
): PhaseStatus {
  if (completed.includes(phase)) return 'complete'
  if (phase === current) return 'current'
  return 'locked'
}

export function buildPhasesData(
  current: PhaseName,
  completed: readonly PhaseName[],
): PhasesData {
  return PHASES.map((name) => ({
    name,
    label: PHASE_LABELS[name],
    status: derivePhaseStatus(name, current, completed),
  }))
}
