import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // AC-6 (v3a-foundation, acceptance.md L51): per-language coverage
    // thresholds. .ts/.tsx require lines >= 90; verify-slice.sh full-mode
    // parses coverage/lcov.info against the staged/PR diff and fails when
    // new src/ lines uncovered >= 10%. Activation requires CI to run
    // `vitest run --coverage` (needs @vitest/coverage-v8 dev-dep — wiring
    // tracked as v3b carry-over). Until then this block configures the
    // thresholds for any local coverage run; the verify-slice.sh gate
    // skip-allows when coverage/lcov.info is absent.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        lines: 90,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
