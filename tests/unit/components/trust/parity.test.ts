import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const specPath = resolve(process.cwd(), 'docs/workspace-spec/68f-open-decisions-register.md')
const spec = readFileSync(specPath, 'utf-8')

describe('S-F4 parity vs 68f C-T1 wire evidence (AC-3)', () => {
  it('68f contains the C-T1 LOCKED resolution entry', () => {
    expect(spec).toContain('C-T1 · Trust badge visual treatment — LOCKED')
  })

  it('amber "Estimated" wire callout present for self-declared', () => {
    expect(spec).toMatch(/Amber\s+"Estimated"\s+chip\s+=\s+self-declared/)
  })

  it('green Barclays wire callout present for bank-evidenced', () => {
    expect(spec).toMatch(/Green\s+"Barclays Bank"\s+\/\s+"Verified from Barclays/)
  })

  it('four OPEN levels noted as pending Phase C anchor extraction', () => {
    expect(spec).toMatch(/credit-verified[\s\S]*document-evidenced[\s\S]*both-party-agreed[\s\S]*court-sealed/)
    expect(spec).toContain(
      'visual treatment to be finalised during Phase C anchor extraction but pattern is locked',
    )
  })

  it('chip pattern locked as colour-by-level + label-by-source', () => {
    expect(spec).toMatch(/colour\s+=\s+taxonomy level,\s+label\s+=\s+specific source/)
  })
})
