import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlaceholderTag } from '@/components/marketing/atoms/placeholder-tag'

describe('marketing/atoms/PlaceholderTag', () => {
  it('renders children inside a span with the mono class', () => {
    const { container } = render(
      <PlaceholderTag>EDITORIAL · not a literal screenshot</PlaceholderTag>
    )
    expect(
      screen.getByText('EDITORIAL · not a literal screenshot')
    ).toBeDefined()
    const span = container.firstChild as HTMLElement
    expect(span.tagName).toBe('SPAN')
    expect(span.className).toContain('mono')
  })
})
