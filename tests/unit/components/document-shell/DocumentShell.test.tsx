import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { DocumentShell } from '@/components/document-shell/DocumentShell'
import { STATE_LABELS } from '@/components/document-shell/types'

const baseProps = {
  title: 'Sarah’s Picture',
  state: 'draft' as const,
  body: <div data-testid="body">BODY</div>,
}

describe('<DocumentShell /> — slot rendering + DOM order', () => {
  it('renders the title in the top bar', () => {
    const { container } = render(<DocumentShell {...baseProps} />)
    const header = container.querySelector('header')
    expect(header?.textContent).toContain('Sarah’s Picture')
  })

  it('renders the state chip with the matching state label', () => {
    const { container } = render(<DocumentShell {...baseProps} />)
    const header = container.querySelector('header')
    expect(header?.textContent).toContain(STATE_LABELS.draft)
  })

  it('renders the autosave stamp when prop provided', () => {
    const { container } = render(
      <DocumentShell {...baseProps} autosaveStamp="Autosaved · 2 min ago" />,
    )
    expect(container.querySelector('header')?.textContent).toContain('Autosaved · 2 min ago')
  })

  it('omits the autosave stamp when prop absent', () => {
    const { container } = render(<DocumentShell {...baseProps} />)
    expect(container.querySelector('header')?.textContent).not.toContain('Autosaved')
  })

  it('renders header, leftRail, body, rightRail in DOM order', () => {
    const { container } = render(
      <DocumentShell
        {...baseProps}
        leftRail={<div data-testid="left">LEFT</div>}
        rightRail={<div data-testid="right">RIGHT</div>}
      />,
    )
    const order = Array.from(container.querySelectorAll('[data-shell-region]')).map((el) =>
      el.getAttribute('data-shell-region'),
    )
    expect(order).toEqual(['header', 'leftRail', 'body', 'rightRail'])
  })

  it('omits leftRail + rightRail regions when props absent', () => {
    const { container } = render(<DocumentShell {...baseProps} />)
    expect(container.querySelector('[data-shell-region="leftRail"]')).toBeNull()
    expect(container.querySelector('[data-shell-region="rightRail"]')).toBeNull()
    expect(container.querySelector('[data-shell-region="body"]')).not.toBeNull()
    expect(container.querySelector('[data-shell-region="header"]')).not.toBeNull()
  })

  it('renders body slot content', () => {
    const { container } = render(<DocumentShell {...baseProps} />)
    expect(container.querySelector('[data-testid="body"]')?.textContent).toBe('BODY')
  })
})

describe('<DocumentShell /> — responsive DOM contract (CSS-driven)', () => {
  const responsiveProps = {
    ...baseProps,
    leftRail: <div>LEFT</div>,
    rightRail: <div>RIGHT</div>,
  }

  it('renders both toggle buttons in the DOM', () => {
    const { container } = render(<DocumentShell {...responsiveProps} />)
    expect(container.querySelector('[data-shell-toggle="leftRail"]')).not.toBeNull()
    expect(container.querySelector('[data-shell-toggle="rightRail"]')).not.toBeNull()
  })

  it('left toggle carries the lg:hidden class', () => {
    const { container } = render(<DocumentShell {...responsiveProps} />)
    const leftToggle = container.querySelector('[data-shell-toggle="leftRail"]')
    expect(leftToggle?.className).toContain('lg:hidden')
  })

  it('right toggle carries the md:hidden class', () => {
    const { container } = render(<DocumentShell {...responsiveProps} />)
    const rightToggle = container.querySelector('[data-shell-toggle="rightRail"]')
    expect(rightToggle?.className).toContain('md:hidden')
  })

  it('toggles have aria-expanded="false" by default', () => {
    const { container } = render(<DocumentShell {...responsiveProps} />)
    expect(
      container.querySelector('[data-shell-toggle="leftRail"]')?.getAttribute('aria-expanded'),
    ).toBe('false')
    expect(
      container.querySelector('[data-shell-toggle="rightRail"]')?.getAttribute('aria-expanded'),
    ).toBe('false')
  })

  it('toggles have aria-controls referencing rail ids', () => {
    const { container } = render(<DocumentShell {...responsiveProps} />)
    const leftToggle = container.querySelector('[data-shell-toggle="leftRail"]')
    const rightToggle = container.querySelector('[data-shell-toggle="rightRail"]')
    const leftRailId = leftToggle?.getAttribute('aria-controls')
    const rightRailId = rightToggle?.getAttribute('aria-controls')
    expect(leftRailId).toBeTruthy()
    expect(rightRailId).toBeTruthy()
    expect(container.querySelector(`#${leftRailId}`)).not.toBeNull()
    expect(container.querySelector(`#${rightRailId}`)).not.toBeNull()
  })

  it('rails have data-state="closed" by default', () => {
    const { container } = render(<DocumentShell {...responsiveProps} />)
    expect(
      container.querySelector('[data-shell-region="leftRail"]')?.getAttribute('data-state'),
    ).toBe('closed')
    expect(
      container.querySelector('[data-shell-region="rightRail"]')?.getAttribute('data-state'),
    ).toBe('closed')
  })

  it('clicking left toggle flips aria-expanded and data-state to open', () => {
    const { container } = render(<DocumentShell {...responsiveProps} />)
    const leftToggle = container.querySelector(
      '[data-shell-toggle="leftRail"]',
    ) as HTMLButtonElement
    fireEvent.click(leftToggle)
    expect(leftToggle.getAttribute('aria-expanded')).toBe('true')
    expect(
      container.querySelector('[data-shell-region="leftRail"]')?.getAttribute('data-state'),
    ).toBe('open')
  })

  it('clicking right toggle flips aria-expanded and data-state to open', () => {
    const { container } = render(<DocumentShell {...responsiveProps} />)
    const rightToggle = container.querySelector(
      '[data-shell-toggle="rightRail"]',
    ) as HTMLButtonElement
    fireEvent.click(rightToggle)
    expect(rightToggle.getAttribute('aria-expanded')).toBe('true')
    expect(
      container.querySelector('[data-shell-region="rightRail"]')?.getAttribute('data-state'),
    ).toBe('open')
  })
})

describe('<DocumentShell /> — keyboard nav + a11y + motion preference', () => {
  it('renders a skip-link as the first focusable element with body target', () => {
    const { container } = render(
      <DocumentShell {...baseProps} body={<a href="#first-body">first</a>} />,
    )
    const skipLink = container.querySelector('[data-shell-skip-link]')
    expect(skipLink?.tagName.toLowerCase()).toBe('a')
    expect(skipLink?.getAttribute('href')).toBe('#document-shell-body')
    expect(container.querySelector('#document-shell-body')).not.toBeNull()
  })

  it('left rail uses a nav landmark with aria-label', () => {
    const { container } = render(
      <DocumentShell {...baseProps} leftRail={<div>TOC</div>} />,
    )
    const nav = container.querySelector('nav[aria-label="Document sections"]')
    expect(nav).not.toBeNull()
  })

  it('body uses a main landmark', () => {
    const { container } = render(<DocumentShell {...baseProps} />)
    expect(container.querySelector('main')).not.toBeNull()
  })

  it('right rail uses an aside landmark with aria-label', () => {
    const { container } = render(
      <DocumentShell {...baseProps} rightRail={<div>CTX</div>} />,
    )
    const aside = container.querySelector('aside[aria-label="Document context"]')
    expect(aside).not.toBeNull()
  })

  it('rails carry the motion-reduce:transition-none modifier', () => {
    const { container } = render(
      <DocumentShell
        {...baseProps}
        leftRail={<div>L</div>}
        rightRail={<div>R</div>}
      />,
    )
    const leftRail = container.querySelector('[data-shell-region="leftRail"]')
    const rightRail = container.querySelector('[data-shell-region="rightRail"]')
    expect(leftRail?.className).toContain('motion-reduce:transition-none')
    expect(rightRail?.className).toContain('motion-reduce:transition-none')
  })
})
