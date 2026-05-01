export type PhaseName = 'start' | 'build' | 'reconcile' | 'settle' | 'finalise'

export type PhaseStatus = 'complete' | 'current' | 'locked'

export interface SubItem {
  label: string
  href?: string
}

export interface PhaseEntry {
  name: PhaseName
  label: string
  status: PhaseStatus
}

export type PhasesData = readonly PhaseEntry[]
