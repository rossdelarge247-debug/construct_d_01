import type { WorkspacePhase } from '@/types'

export const APP_NAME = 'Decouple'
export const APP_DESCRIPTION = 'A calm separation workspace'

export const WORKSPACE_PHASES: { key: WorkspacePhase; label: string; description: string }[] = [
  {
    key: 'build_your_picture',
    label: 'Build your picture',
    description: 'Bringing together your finances, children\'s arrangements, and supporting evidence.',
  },
  {
    key: 'share_and_disclose',
    label: 'Share & disclose',
    description: 'Preparing to share your picture and exchange disclosure with the other party.',
  },
  {
    key: 'work_through_it',
    label: 'Work through it',
    description: 'Proposals, counter-proposals, mediation, and negotiation.',
  },
  {
    key: 'reach_agreement',
    label: 'Reach agreement',
    description: 'Resolving remaining disputes and capturing the final agreed position.',
  },
  {
    key: 'make_it_official',
    label: 'Make it official',
    description: 'Drafting court documents, submission, and formalisation.',
  },
]

export const CONFIDENCE_STATES = [
  { key: 'known' as const, label: 'Known', description: 'I have this information' },
  { key: 'estimated' as const, label: 'Estimated', description: 'I have a rough idea' },
  { key: 'unsure' as const, label: 'Unsure', description: 'I think I know, but not confident' },
  { key: 'unknown' as const, label: 'Unknown', description: 'I don\'t have this information' },
]

export const FOLLOW_UP_STATES = [
  { key: 'fine_for_now' as const, label: 'Fine for now' },
  { key: 'confirm_later' as const, label: 'Confirm later' },
  { key: 'priority_to_confirm' as const, label: 'Priority to confirm' },
  { key: 'resolved' as const, label: 'Resolved' },
]

export const SUPPORT_RESOURCES = {
  national_da_helpline: { name: 'National Domestic Abuse Helpline', phone: '0808 2000 247', hours: '24/7' },
  mens_advice_line: { name: "Men's Advice Line", phone: '0808 8010 327', hours: 'Mon-Fri 10am-8pm' },
  galop: { name: 'Galop (LGBT+)', phone: '0800 999 5428', hours: 'Various' },
  victim_support: { name: 'Victim Support', phone: '0808 168 9111', hours: '24/7' },
  samaritans: { name: 'Samaritans', phone: '116 123', hours: '24/7' },
  childline: { name: 'Childline', phone: '0800 1111', hours: '24/7' },
}

export const EXIT_PAGE_URL = 'https://www.bbc.co.uk/weather'
