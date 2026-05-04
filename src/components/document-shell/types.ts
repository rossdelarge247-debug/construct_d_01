import type { ReactNode } from 'react'

export type DocumentState =
  | 'draft'
  | 'ready-to-send'
  | 'counter-received'
  | 'in-progress'
  | 'agreed'

export const STATE_LABELS: Record<DocumentState, string> = {
  draft: 'DRAFT',
  'ready-to-send': 'READY TO SEND',
  'counter-received': 'TO RESPOND',
  'in-progress': 'IN PROGRESS',
  agreed: 'AGREED',
}

export interface DocumentShellProps {
  title: string
  state: DocumentState
  autosaveStamp?: string
  leftRail?: ReactNode
  body: ReactNode
  rightRail?: ReactNode
}
