import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Plus,
  Shield,
  Lock,
  Check,
  Coins,
  ChildrenIcon,
  Home,
  Compass,
} from '@/components/marketing/atoms/icons'

const icons = [
  ['ArrowRight', ArrowRight],
  ['ArrowDown', ArrowDown],
  ['ArrowUpRight', ArrowUpRight],
  ['Plus', Plus],
  ['Shield', Shield],
  ['Lock', Lock],
  ['Check', Check],
  ['Coins', Coins],
  ['ChildrenIcon', ChildrenIcon],
  ['Home', Home],
  ['Compass', Compass],
] as const

describe('marketing/atoms/icons', () => {
  it.each(icons)('%s renders an SVG with default size 16', (_name, Icon) => {
    const { container } = render(<Icon />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('width')).toBe('16')
    expect(svg?.getAttribute('height')).toBe('16')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('honours size prop', () => {
    const { container } = render(<ArrowRight size={24} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('24')
  })

  it('honours stroke-width prop', () => {
    const { container } = render(<Check sw={3} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('stroke-width')).toBe('3')
  })
})
