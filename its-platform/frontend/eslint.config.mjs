import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

/**
 * Layer boundaries are lint rules, not conventions (`frontend-its` skill:
 * `presentation → application → core`, `infrastructure` implements `core` ports).
 * A convention that only lives in a skill file is a convention that erodes; these
 * rules fail the pipeline instead.
 *
 * The one permitted `presentation → infrastructure` edge is
 * `@/infrastructure/composition/*` — the composition root, which by definition knows
 * every layer. `src/app/**` is the composition zone and is deliberately not
 * constrained: it is where a page wires a use case to a component.
 */
const disallowOuterLayers = (group, message) => ({
  rules: {
    'no-restricted-imports': ['error', { patterns: [{ group, message }] }],
  },
});

const FRAMEWORK = ['react', 'react-dom', 'next', 'next/*'];

const config = [
  ...nextCoreWebVitals,

  {
    ignores: [
      '.next/**',
      'out/**',
      'coverage/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      // Generated from the OpenAPI contract by `npm run api:types`.
      'src/infrastructure/api/generated/**',
    ],
  },

  {
    files: ['**/*.mjs'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
  },

  {
    // `@typescript-eslint` is registered by `eslint-config-next` only for these two
    // globs, so the rule that needs it must be scoped to the same set.
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['src/core/**/*.{ts,tsx}'],
    ...disallowOuterLayers(
      ['@/application/*', '@/infrastructure/*', '@/presentation/*', ...FRAMEWORK],
      'core/ must stay pure: no framework imports, no outer-layer imports, and testable without a DOM.',
    ),
  },

  {
    files: ['src/application/**/*.{ts,tsx}'],
    ...disallowOuterLayers(
      ['@/infrastructure/*', '@/presentation/*', ...FRAMEWORK],
      'application/ orchestrates core/ through its ports. It must not know about HTTP clients, React or Next.js.',
    ),
  },

  {
    files: ['src/infrastructure/**/*.{ts,tsx}'],
    ...disallowOuterLayers(['@/presentation/*'], 'infrastructure/ adapts the outside world to core/ ports.'),
  },

  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    ...disallowOuterLayers(
      ['@/infrastructure/*', '!@/infrastructure/composition', '!@/infrastructure/composition/*'],
      'presentation/ reaches the domain through application/ and core/. The only exception is the composition root.',
    ),
  },

  {
    files: ['tests/**/*.{ts,tsx}', '**/*.config.{ts,mts}', 'e2e/**/*.ts', 'scripts/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },

  prettier,
];

export default config;
