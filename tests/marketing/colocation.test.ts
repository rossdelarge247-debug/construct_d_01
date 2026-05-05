import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

describe('marketing colocation contract (AC-10)', () => {
  it('atoms live at src/components/marketing/atoms/', () => {
    const atoms = [
      'cta-primary',
      'eyebrow',
      'icons',
      'placeholder-tag',
      'section-head',
      'trust-band',
      'wordmark',
    ]
    for (const name of atoms) {
      const path = join(root, 'src/components/marketing/atoms', `${name}.tsx`)
      expect(existsSync(path), `expected ${path}`).toBe(true)
    }
  })

  it('sections live at src/components/marketing/sections/', () => {
    const sections = ['header', 'picture-band', 'journey', 'footer-minimal']
    for (const name of sections) {
      const path = join(root, 'src/components/marketing/sections', `${name}.tsx`)
      expect(existsSync(path), `expected ${path}`).toBe(true)
    }
  })

  it('heroes live at src/components/marketing/heroes/ with index barrel', () => {
    expect(
      existsSync(join(root, 'src/components/marketing/heroes/editorial.tsx'))
    ).toBe(true)
    expect(
      existsSync(join(root, 'src/components/marketing/heroes/index.ts'))
    ).toBe(true)
  })
})
