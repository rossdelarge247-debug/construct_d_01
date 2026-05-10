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
    // docs/** holds documentation including design-source canvas .jsx
    // assets authored externally (Claude AI Design tool exports). Not src.
    "docs/**",
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
  // Fitness functions per spec 72d §4 — encoding spec 71 §4 §"Switch mechanism"
  // hexagonal invariants as runnable assertions. Five rules total: 1-4 here as
  // ESLint rules; rule 5 (no circular deps in src/lib) is enforced by `madge`
  // via npm script `madge:circular` + `.github/workflows/fitness-functions.yml`.
  {
    // Rules 1 + 2: domain code (src/lib/bank, src/lib/ai) doesn't depend on UI.
    files: ["src/lib/bank/**/*.{ts,tsx,js,jsx}", "src/lib/ai/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/components", "@/components/*", "@/components/**"],
            message: "Spec 72d §4 rule 1+2 (operationalising spec 71 §4 §'Switch mechanism'): domain code (src/lib/bank, src/lib/ai) does not import UI (src/components). Refactor by inverting the dependency or extracting shared types to src/types.",
          },
        ],
      }],
    },
  },
  {
    // Rule 3: slice code goes via @/lib/auth or @/lib/store; never imports
    // @supabase/* directly. Spec 71 §4 §"Switch mechanism" verbatim.
    files: ["src/app/**/*.{ts,tsx,js,jsx}", "src/components/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@supabase", "@supabase/*", "@supabase/**"],
            message: "Spec 72d §4 rule 3 (operationalising spec 71 §4 §'Switch mechanism'): slice code (src/app, src/components) does not import @supabase/* directly. Use the abstractions from @/lib/auth (getSession, getAuthGate) or @/lib/store (getStore).",
          },
        ],
      }],
    },
  },
  {
    // Rule 4: only src/lib/auth/index.ts reads the env var that picks the
    // auth/store implementation. Spec 71 §4 §"Switch mechanism" verbatim.
    // Three selectors close the bypass surface: dot access, bracket access,
    // and destructuring from process.env.
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-syntax": ["error",
        {
          selector: "MemberExpression[object.object.name='process'][object.property.name='env'][property.name='NEXT_PUBLIC_DECOUPLE_AUTH_MODE']",
          message: "Spec 72d §4 rule 4 (operationalising spec 71 §4 §'Switch mechanism'): only src/lib/auth/index.ts reads NEXT_PUBLIC_DECOUPLE_AUTH_MODE (dot access). Consumers go via getSession / getAuthGate / getStore from @/lib/auth.",
        },
        {
          selector: "MemberExpression[computed=true][object.object.name='process'][object.property.name='env'][property.value='NEXT_PUBLIC_DECOUPLE_AUTH_MODE']",
          message: "Spec 72d §4 rule 4 (operationalising spec 71 §4 §'Switch mechanism'): only src/lib/auth/index.ts reads NEXT_PUBLIC_DECOUPLE_AUTH_MODE (bracket access). Consumers go via getSession / getAuthGate / getStore from @/lib/auth.",
        },
        {
          selector: "VariableDeclarator[init.object.name='process'][init.property.name='env'] ObjectPattern Property[key.name='NEXT_PUBLIC_DECOUPLE_AUTH_MODE']",
          message: "Spec 72d §4 rule 4 (operationalising spec 71 §4 §'Switch mechanism'): only src/lib/auth/index.ts reads NEXT_PUBLIC_DECOUPLE_AUTH_MODE (destructuring). Consumers go via getSession / getAuthGate / getStore from @/lib/auth.",
        },
      ],
    },
  },
  {
    // Rule 4 carve-out: src/lib/auth/index.ts is the single legitimate reader.
    files: ["src/lib/auth/index.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
]);

export default eslintConfig;
