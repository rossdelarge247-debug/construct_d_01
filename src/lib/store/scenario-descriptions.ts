// Static scenario metadata — separated from scenario-loader so /dev/* pages
// can import descriptions without dragging the loader's runtime literals.
// Names + descriptions only; no localStorage keys, no `decouple:dev:` strings.

export interface ScenarioMeta {
  name: string
  description: string
}

export const SCENARIO_META: ScenarioMeta[] = [
  {
    name: 'cold-sarah',
    description: 'Blank workspace. No bank, no data. Day-zero starting state.',
  },
  {
    name: 'sarah-connected',
    description: 'Bank connected, extractions loaded. Confirmations not started yet.',
  },
  {
    name: 'sarah-mid-build',
    description: 'Confirmations roughly half complete. Some estimates, some evidence uploaded.',
  },
  {
    name: 'sarah-complete',
    description: "Build complete. Sarah's Picture generated and ready to share.",
  },
  {
    name: 'sarah-shared-mark-invited',
    description: 'Picture shared. Mark invited but not yet signed in.',
  },
  {
    name: 'sarah-reconcile-in-progress',
    description: 'Both built. Joint document open. Two conflicts pending resolution.',
  },
  {
    name: 'sarah-settle',
    description: 'Conflicts resolved. Settlement proposal in drafting.',
  },
  {
    name: 'sarah-finalise',
    description: 'Settlement agreed. Pre-flight passed. Consent order ready to file.',
  },
]
