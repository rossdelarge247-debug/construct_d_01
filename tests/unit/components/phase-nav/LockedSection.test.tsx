import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LockedSection } from '@/components/phase-nav/LockedSection'

describe('<LockedSection> (S-F3 AC-3, C-V12)', () => {
  it('renders the locked-section header with 🔒 emoji + unlock-when copy', () => {
    const { container } = render(
      <LockedSection gate="reconcile" title="Reconcile your finances">
        <p>Section content</p>
      </LockedSection>,
    )
    const header = container.querySelector('[data-locked-header]')
    expect(header?.textContent).toContain('🔒')
    expect(header?.textContent).toContain('LOCKED')
    expect(header?.textContent).toContain('Unlocks when you share your picture with Mark')
  })

  it('renders children under a dimmed wrapper', () => {
    const { container, getByText } = render(
      <LockedSection gate="settle" title="Settle">
        <p>Should be dimmed</p>
      </LockedSection>,
    )
    expect(getByText('Should be dimmed')).toBeTruthy()
    const dimmed = container.querySelector('[data-locked-children]')
    expect(dimmed).toBeTruthy()
  })

  it('marks the section root with aria-disabled="true"', () => {
    const { container } = render(
      <LockedSection gate="settle" title="Settle">
        <p>x</p>
      </LockedSection>,
    )
    const section = container.querySelector('section')
    expect(section?.getAttribute('aria-disabled')).toBe('true')
  })

  it('uses dashboard-section unlock-when when gate prop = "preparation" or "reconciliation"', () => {
    const { getByText: prep } = render(
      <LockedSection gate="preparation" title="Disclosure">
        <p>x</p>
      </LockedSection>,
    )
    expect(prep('Disclosure')).toBeTruthy()
    const text = prep('Disclosure').closest('section')?.textContent
    expect(text).toContain('Unlocks when preparation is complete')

    const { getByText: rec } = render(
      <LockedSection gate="reconciliation" title="Settle">
        <p>x</p>
      </LockedSection>,
    )
    const text2 = rec('Settle').closest('section')?.textContent
    expect(text2).toContain('Unlocks when reconciliation is complete')
  })
})
