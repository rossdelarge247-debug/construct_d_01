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
  // The `.dev.tsx` suffix marks workbench / scratch surfaces — engineering
  // tools that use intentional shortcuts (in-place state mutation for
  // immediate visual feedback) which trip react-hooks/immutability, a
  // rule oriented at production code. The suffix is the contract;
  // current files all live under src/app/dev/ but the glob is suffix-
  // anchored to keep the convention portable.
  {
    files: ["**/*.dev.tsx"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
