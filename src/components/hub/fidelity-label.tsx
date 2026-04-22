import { FIDELITY_LABELS, type FidelityLevel } from '@/types/hub'

interface FidelityLabelProps {
  level: FidelityLevel
}

const LEVEL_STYLES: Record<FidelityLevel, string> = {
  sketch: 'bg-grey-50 text-ink-tertiary',
  draft: 'bg-green-50 text-green-600',
  evidenced: 'bg-blue-50 text-blue-600',
  locked: 'bg-green-50 text-green-600',
}

export function FidelityLabel({ level }: FidelityLabelProps) {
  const fidelity = FIDELITY_LABELS[level]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-sm ${LEVEL_STYLES[level]}`}
    >
      {fidelity.label}
    </span>
  )
}
