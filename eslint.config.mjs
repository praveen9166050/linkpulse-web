// ESLint flat config. Run: npm run lint
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

    // Next.js rules: React, hooks, accessibility (jsx-a11y), Core Web Vitals.
    ...nextVitals,
    ...nextTs,

    // Type-aware rules, as in the backend: they read the TypeScript types, so
    // they catch a forgotten `await` (no-floating-promises), a promise passed
    // where a plain callback is expected (no-misused-promises), and more.
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    // Rules that flag the anti-patterns in the learning plan (same as the backend).
    {
        rules: {
            complexity: ["warn", 10], // god functions
            "max-depth": ["warn", 3], // deeply nested code
            "max-params": ["warn", 4], // too many arguments: pass an object
            "no-console": "warn",
            eqeqeq: "error", // always === and !==
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
        },
    },

    // Config files are plain JS, outside the TypeScript project.
    { files: ["*.mjs", "*.js"], ...tseslint.configs.disableTypeChecked },

    // Last: turn off any rule that would fight the formatter.
    prettier,
]);
