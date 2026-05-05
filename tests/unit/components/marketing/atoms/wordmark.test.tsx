import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Wordmark } from '@/components/marketing/atoms/wordmark'

describe('marketing/atoms/Wordmark', () => {
  it('renders the wordmark text "decouple"', () => {
    render(<Wordmark />)
    expect(screen.getByText('decouple')).toBeDefined()
  })

  it('exposes aria-label "Decouple" on the wrapper', () => {
    const { container } = render(<Wordmark />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.getAttribute('aria-label')).toBe('Decouple')
  })

  it('honours size prop on the text', () => {
    const { container } = render(<Wordmark size={24} />)
    const text = container.querySelector('span') as HTMLElement
    expect(text.style.fontSize).toBe('24px')
  })
})
