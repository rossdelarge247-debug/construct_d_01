import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()

describe('marketing colocation contract', () => {
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

describe('marketing import-boundary contract', () => {
  function walk(dir: string, files: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        if (entry === 'node_modules' || entry === '.next') continue
        walk(full, files)
      } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
        files.push(full)
      }
    }
    return files
  }

  it('no file outside src/components/marketing/ imports from marketing/atoms/* or marketing/sections/* private paths', () => {
    const srcDir = join(root, 'src')
    const marketingPrefix = join(srcDir, 'components/marketing')
    const offenders: string[] = []
    const importPattern =
      /from\s+['"](?:@\/components\/marketing\/(?:atoms|sections)\/[^'"\s]+|\.\.?\/[^'"\s]*marketing\/(?:atoms|sections)\/[^'"\s]+)['"]/g

    for (const file of walk(srcDir)) {
      if (file.startsWith(marketingPrefix)) continue
      const body = readFileSync(file, 'utf8')
      if (importPattern.test(body)) {
        offenders.push(relative(root, file))
      }
    }

    expect(
      offenders,
      `Files outside src/components/marketing/ are reaching into atoms/* or sections/* private paths: ${offenders.join(', ')}`
    ).toEqual([])
  })
})
