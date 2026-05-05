import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // AC-3 (v3a-foundation): function-size thresholds. General cap 40 lines;
  // *.tsx React-component override 80 lines per acceptance.md L48.
  // Ignored paths:
  //   src/**           β paths exempt for v3a per L48 ("β offenders captured
  //                    when β resumes"); rescope at β-resume.
  //   tests/**         test files (describe/it blocks naturally exceed 40
  //                    lines; rule targets production-shape code).
  //   **/*.config.*    framework config files (next/vitest/tailwind/postcss)
  //                    have framework-defined call-site shapes.
  {
    files: ["**/*.{ts,js,jsx}"],
    ignores: ["src/**", "tests/**", "**/*.config.*"],
    rules: {
      "max-lines-per-function": ["error", { max: 40, IIFEs: true }],
    },
  },
  {
    files: ["**/*.tsx"],
    ignores: ["src/**", "tests/**"],
    rules: {
      "max-lines-per-function": ["error", { max: 80 }],
    },
  },
  // Dev-tooling files (`.dev.tsx` suffix; collected under `src/app/dev/`)
  // are workbench / scratch surfaces. They use intentional shortcuts
  // (in-place state mutation for immediate visual feedback in
  // engineering tools) that are flagged by react-hooks/immutability,
  // a rule oriented at production code. Disable that rule for the
  // dev-tooling subset only; it remains active for all other tsx.
  {
    files: ["**/*.dev.tsx"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
