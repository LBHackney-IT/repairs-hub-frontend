import { defineConfig, globalIgnores } from 'eslint/config'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores([
    '**/next-env.d.ts',
    '**/node_modules/',
    '**/.next/',
    '**/node_modules',
    '**/.next',
    '**/build/',
    '**/public/',
    '**/db/',
    'cypress/plugins/*',
  ]),
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:prettier/recommended',
      'plugin:cypress/recommended',
      'plugin:jest/recommended'
    ),

    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.commonjs,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'linebreak-style': ['error', 'unix'],
      'require-atomic-updates': 'off',
      'react/jsx-uses-vars': 2,
      '@typescript-eslint/no-unused-expressions': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      'react/no-children-prop': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/jsx-key': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'react/jsx-no-duplicate-props': 'warn',
      'jest/no-identical-title': 'warn',
      'jest/valid-expect': 'warn',
      'cypress/unsafe-to-chain-command': 'warn',
      'react/display-name': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'jest/no-focused-tests': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    // Requests are defined once, in src/utils/requests. Components, hooks and
    // other utils call those functions instead of using the client directly.
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    ignores: [
      'src/utils/requests/**',
      'src/utils/frontEndApiClient/**',
      'src/pages/api/**',
      '**/*.test.*',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/frontEndApiClient/requests'],
              importNames: ['frontEndApiRequest'],
              message:
                'Define requests in src/utils/requests and import them from there (@/requests/...) instead of calling frontEndApiRequest directly.',
            },
          ],
        },
      ],
    },
  },
])
