import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHead } from '@/components/marketing/atoms/section-head'

describe('marketing/atoms/SectionHead', () => {
  it('renders an h2 with the children', () => {
    render(<SectionHead>The complete picture</SectionHead>)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.textContent).toBe('The complete picture')
  })

  it('renders eyebrow text when provided', () => {
    render(<SectionHead eyebrow="A subtitle">Big headline</SectionHead>)
    expect(screen.getByText('A subtitle')).toBeDefined()
    expect(screen.getByText('Big headline')).toBeDefined()
  })

  it('omits eyebrow node when not provided', () => {
    const { container } = render(<SectionHead>only headline</SectionHead>)
    const eyebrows = container.querySelectorAll('.label-xs')
    expect(eyebrows.length).toBe(0)
  })

  it('respects maxWidth prop on outer wrapper', () => {
    const { container } = render(<SectionHead maxWidth={600}>x</SectionHead>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.maxWidth).toBe('600px')
  })
})
