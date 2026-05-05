import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PictureBand } from '@/components/marketing/sections/picture-band'

describe('marketing/sections/PictureBand', () => {
  it('renders the eyebrow and the h2 with both the literal and italic accent', () => {
    render(<PictureBand />)
    expect(screen.getByText('The complete picture')).toBeDefined()
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2.textContent).toContain(
      'A divorce settlement covers four interdependent areas'
    )
    expect(h2.textContent).toContain('Decouple covers all of them')
  })

  it('renders the four pillar labels', () => {
    render(<PictureBand />)
    for (const label of ['Finances', 'Children', 'Housing', 'Future needs']) {
      expect(screen.getByText(label)).toBeDefined()
    }
  })

  it('renders four icon SVGs (one per pillar)', () => {
    const { container } = render(<PictureBand />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(4)
  })

  it('marks the section with id="picture" and aria-labelledby on the h2', () => {
    const { container } = render(<PictureBand />)
    const section = container.querySelector('section')
    expect(section?.id).toBe('picture')
    const ariaLabelledBy = section?.getAttribute('aria-labelledby')
    expect(ariaLabelledBy).toBeTruthy()
    if (ariaLabelledBy) {
      expect(container.querySelector(`#${ariaLabelledBy}`)?.tagName).toBe('H2')
    }
  })
})
