import { defineConfig, globalIgnores } from 'eslint/config'
import react from 'eslint-plugin-react'
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
      'react/prop-types': 'warn',
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
    },
  },
])
