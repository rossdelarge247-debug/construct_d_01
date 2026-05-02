import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TrustChip } from '@/components/trust/TrustChip'
import { TRUST_LEVELS } from '@/components/trust/levels'

describe('<TrustChip />', () => {
  it.each([...TRUST_LEVELS])('renders an inline element with aria-label for %s', (level) => {
    const { container } = render(<TrustChip level={level} />)
    const chip = container.firstElementChild as HTMLElement | null
    expect(chip).toBeTruthy()
    expect(chip?.getAttribute('aria-label')).toMatch(/^Trust:/)
  })

  it('self-declared chip carries the trust-self-declared token', () => {
    const { container } = render(<TrustChip level="self-declared" />)
    const chip = container.firstElementChild as HTMLElement | null
    expect(chip?.className).toMatch(/--ds-color-trust-self-declared/)
  })

  it('bank-evidenced chip carries the trust-bank-evidenced token', () => {
    const { container } = render(<TrustChip level="bank-evidenced" />)
    const chip = container.firstElementChild as HTMLElement | null
    expect(chip?.className).toMatch(/--ds-color-trust-bank-evidenced/)
  })

  it('OPEN levels carry no trust tokens (neutral utility classes only)', () => {
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

  it('default label for self-declared is "Estimated"', () => {
    const { container } = render(<TrustChip level="self-declared" />)
    expect(container.textContent).toContain('Estimated')
  })

  it('default label for bank-evidenced is "Bank" when no source supplied', () => {
    const { container } = render(<TrustChip level="bank-evidenced" />)
    expect(container.textContent).toContain('Bank')
  })

  it('sourceLabel prop overrides default label', () => {
    const { container } = render(
      <TrustChip level="bank-evidenced" sourceLabel="Verified from Barclays xxxx2323" />,
    )
    expect(container.textContent).toContain('Verified from Barclays xxxx2323')
  })

  it('empty-string sourceLabel falls back to the default label', () => {
    const { container } = render(<TrustChip level="self-declared" sourceLabel="" />)
    expect(container.textContent).toContain('Estimated')
  })

  it('chip element is a span (inline display)', () => {
    const { container } = render(<TrustChip level="self-declared" />)
    const chip = container.firstElementChild as HTMLElement | null
    expect(chip?.tagName.toLowerCase()).toBe('span')
  })
})
