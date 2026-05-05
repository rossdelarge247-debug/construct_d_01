import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Eyebrow } from '@/components/marketing/atoms/eyebrow'

describe('marketing/atoms/Eyebrow', () => {
  it('renders children with the label-xs class', () => {
    const { container } = render(<Eyebrow>The complete picture</Eyebrow>)
    expect(screen.getByText('The complete picture')).toBeDefined()
    const node = container.firstChild as HTMLElement
    expect(node.className).toContain('label-xs')
  })

  it('honours color override', () => {
    const { container } = render(<Eyebrow color="#FF0000">accent</Eyebrow>)
    const node = container.firstChild as HTMLElement
    expect(node.style.color).toBe('rgb(255, 0, 0)')
  })

  it('omits color when prop absent', () => {
    const { container } = render(<Eyebrow>plain</Eyebrow>)
    const node = container.firstChild as HTMLElement
    expect(node.style.color).toBe('')
  })
})
