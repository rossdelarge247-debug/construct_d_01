import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { TOKEN_NAMES } from '@/styles/tokens'

const globalsPath = resolve(process.cwd(), 'src/app/globals.css')
const css = readFileSync(globalsPath, 'utf-8')
const cssNames = (css.match(/--ds-[a-z0-9-]+(?=\s*:)/g) ?? []) as string[]
const cssNameSet = new Set(cssNames)
const tokenNameSet = new Set<string>(TOKEN_NAMES)

describe('Design system tokens — globals.css ↔ tokens.ts parity (S-F1)', () => {
  it('every --ds-* name in globals.css has a TOKEN_NAMES entry', () => {
    const missing = cssNames.filter((n) => !tokenNameSet.has(n))
    expect(missing).toEqual([])
  })

  it('every TOKEN_NAMES entry exists in globals.css', () => {
    const missing = TOKEN_NAMES.filter((n) => !cssNameSet.has(n))
    expect(missing).toEqual([])
  })

  it('TOKEN_NAMES has 65 entries — locked count for S-F1', () => {
    expect(TOKEN_NAMES.length).toBe(65)
  })

  it('phase colour quartet matches spec 68g C-V1', () => {
    expect(TOKEN_NAMES).toContain('--ds-color-phase-build')
    expect(TOKEN_NAMES).toContain('--ds-color-phase-reconcile')
    expect(TOKEN_NAMES).toContain('--ds-color-phase-settle')
    expect(TOKEN_NAMES).toContain('--ds-color-phase-finalise')
    // Start phase implicit per spec 42 5-phase model + user direction
    expect(TOKEN_NAMES).not.toContain('--ds-color-phase-start')
  })
})
