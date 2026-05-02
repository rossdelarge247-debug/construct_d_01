import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TrustChip } from '@/components/trust/TrustChip'
import { TRUST_LEVELS } from '@/components/trust/levels'

describe('<TrustChip /> — renders all 6 levels (S-F4 AC-1)', () => {
  it.each([...TRUST_LEVELS])('renders an inline element with aria-label for %s', (level) => {
    const { container } = render(<TrustChip level={level} />)
    const chip = container.firstElementChild as HTMLElement | null
    expect(chip).toBeTruthy()
    expect(chip?.getAttribute('aria-label')).toMatch(/^Trust:/)
  })

  it('self-declared chip carries the trust-self-declared token (amber, 68f L43)', () => {
    const { container } = render(<TrustChip level="self-declared" />)
    const chip = container.firstElementChild as HTMLElement | null
    expect(chip?.className).toMatch(/--ds-color-trust-self-declared/)
  })

  it('bank-evidenced chip carries the trust-bank-evidenced token (green, 68f L44)', () => {
    const { container } = render(<TrustChip level="bank-evidenced" />)
    const chip = container.firstElementChild as HTMLElement | null
    expect(chip?.className).toMatch(/--ds-color-trust-bank-evidenced/)
  })

  it('the four OPEN levels do NOT carry trust tokens (neutral utilities only, 68f L45)', () => {
    const openLevels = [
      'credit-verified',
      'document-evidenced',
      'both-party-agreed',
      'court-sealed',
    ] as const
    for (const level of openLevels) {
      const { container } = render(<TrustChip level={level} />)
      const chip = container.firstElementChild as HTMLElement | null
      expect(chip?.className).not.toMatch(/--ds-color-trust-/)
    }
  })

  it('default label for self-declared is "Estimated" per 68f L43 wire evidence', () => {
    const { container } = render(<TrustChip level="self-declared" />)
    expect(container.textContent).toContain('Estimated')
  })

  it('default label for bank-evidenced is "Bank" when no source supplied', () => {
    const { container } = render(<TrustChip level="bank-evidenced" />)
    expect(container.textContent).toContain('Bank')
  })

  it('sourceLabel prop overrides default label per 68f L44 ("Verified from Barclays …")', () => {
    const { container } = render(
      <TrustChip level="bank-evidenced" sourceLabel="Verified from Barclays xxxx2323" />,
    )
    expect(container.textContent).toContain('Verified from Barclays xxxx2323')
  })

  it('chip element is span (display: inline) not block per C-T1 placement LOCKED', () => {
    const { container } = render(<TrustChip level="self-declared" />)
    const chip = container.firstElementChild as HTMLElement | null
    expect(chip?.tagName.toLowerCase()).toBe('span')
  })
})
