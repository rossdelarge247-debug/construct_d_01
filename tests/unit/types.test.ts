import { describe, it, expect } from 'vitest'
import { WORKSPACE_PHASES, CONFIDENCE_STATES, FOLLOW_UP_STATES, SUPPORT_RESOURCES } from '@/constants'

describe('Constants', () => {
  it('defines 5 workspace phases', () => {
    expect(WORKSPACE_PHASES).toHaveLength(5)
    expect(WORKSPACE_PHASES.map(p => p.key)).toEqual([
      'build_your_picture',
      'share_and_disclose',
      'work_through_it',
      'reach_agreement',
      'make_it_official',
    ])
  })

  it('defines 3 confidence states', () => {
    expect(CONFIDENCE_STATES).toHaveLength(3)
    expect(CONFIDENCE_STATES.map(c => c.key)).toEqual([
      'known',
      'estimated',
      'unknown',
    ])
  })

  it('defines 4 follow-up states', () => {
    expect(FOLLOW_UP_STATES).toHaveLength(4)
  })

  it('includes the national DA helpline in support resources', () => {
    expect(SUPPORT_RESOURCES.national_da_helpline.phone).toBe('0808 2000 247')
    expect(SUPPORT_RESOURCES.national_da_helpline.hours).toBe('24/7')
  })
})
