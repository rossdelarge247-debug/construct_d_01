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
  // Scoped to ignore src/** (β paths) — β offenders captured when β resumes
  // per acceptance.md L48 ("β offenders captured when β resumes"). New v3a
  // TypeScript code lands outside src/** (e.g. scripts/) and is enforced.
  {
    files: ["**/*.{ts,js,jsx}"],
    ignores: ["src/**"],
    rules: {
      "max-lines-per-function": ["error", { max: 40, IIFEs: true }],
    },
  },
  {
    files: ["**/*.tsx"],
    ignores: ["src/**"],
    rules: {
      "max-lines-per-function": ["error", { max: 80 }],
    },
  },
]);

export default eslintConfig;
