import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // v3a AC-6 (acceptance.md L51 + L178) + v3b AC-14 (S-INFRA-rigour-v3b-
    // subagent-suite/acceptance.md L106-110): coverage instrumentation.
    // Gate-of-record is scripts/verify-slice.sh Gate 5 (L160-): parses
    // coverage/lcov.info against the PR diff and fails when new .ts/.tsx
    // src/ lines uncovered >= 10% (i.e. ≥90% per-PR-diff floor matching
    // v3a L178 ".ts ≥90% via vitest"). Activated by v3b S-3: @vitest/
    // coverage-v8 dev-dep + ci.yml `npm test -- --coverage` produce
    // coverage/lcov.info on every CI run. reportsDirectory pinned to
    // ./coverage to match the hardcoded path in scripts/verify-slice.sh L166.
    //
    // No `thresholds.lines` here — v3a's planning carried a global 90%
    // threshold but at activation time real coverage is ~2% (Out-of-scope
    // per AC-14: "hitting the 90% floor (data-driven; reflects state of
    // v3a tests + onwards)"). A global gate would block every CI run.
    // The PR-diff gate (verify-slice.sh) is the right granularity: only
    // newly-introduced .ts/.tsx lines must be tested, ratcheting coverage
    // up over time without retroactively gating untested legacy code.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
