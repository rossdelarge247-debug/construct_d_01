// S-INFRA-rigour-v3b-subagent-suite · AC-14 — @vitest/coverage-v8 activation wiring.
//
// AC-14 (acceptance.md L106-110, post-S-2 with R-8 resolved at ≥90% to match v3a):
// activates v3a's dormant Gate 5 coverage parser (verify-slice.sh L160-206) by wiring
// the three sibling artefacts the parser depends on:
//   1. @vitest/coverage-v8 dev-dep (vitest v8 coverage provider; matches vitest@^4.1.3)
//   2. CI test job invokes vitest with --coverage so coverage/lcov.info is generated
//   3. vitest.config.ts coverage block (already in place per v3a session-40 commit 95481e5)
//
// These assertions exercise the wiring, not the parser. Parser behaviour is AC-13's
// scope (separate slice).
//
// File-content assertions are CLAUDE.md-defensible here per the structural-parity-
// invariant exception in Engineering conventions §"Don't write file-content assertions
// for logic slices": AC-14 IS a wiring/structural-parity slice, not logic. Three
// sibling files must each carry their piece; if any drifts, the gate goes dormant.

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const PACKAGE_JSON = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')
) as { devDependencies?: Record<string, string> }

const CI_YAML = readFileSync(
  resolve(process.cwd(), '.github/workflows/ci.yml'),
  'utf-8'
)

describe('S-INFRA-rigour-v3b · AC-14 — @vitest/coverage-v8 activation wiring', () => {
  it('package.json devDependencies declare @vitest/coverage-v8 (Gate 5 activation pre-req)', () => {
    expect(PACKAGE_JSON.devDependencies?.['@vitest/coverage-v8']).toBeTruthy()
  })

  it('CI workflow invokes vitest with --coverage flag so coverage/lcov.info is generated', () => {
    expect(CI_YAML).toMatch(/--coverage/)
  })
})
