import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrustBand } from '@/components/marketing/atoms/trust-band'

describe('marketing/atoms/TrustBand', () => {
  it('renders the three load-bearing trust signals verbatim', () => {
    render(<TrustBand />)
    expect(
      screen.getByText('FCA-regulated bank connection via TrueLayer')
    ).toBeDefined()
    expect(screen.getByText("Read-only · we can't move money")).toBeDefined()
    expect(
      screen.getByText('Free until you choose to sign up')
    ).toBeDefined()
  })

  it('renders three SVG icons (Shield, Lock, Check)', () => {
    const { container } = render(<TrustBand />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(3)
  })
})
