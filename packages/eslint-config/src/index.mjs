import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { jsRules, reactRules } from './rules.mjs';

export default tseslint.config(
  {
    name: 'frameless/ignores',
    ignores: ['**/build/', '**/coverage/', '**/dist/', '**/tmp/'],
  },
  {
    name: 'frameless/settings',
    // https://eslint.org/docs/latest/use/configure/configuration-files#configuring-linter-options
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    // https://eslint.org/docs/latest/use/configure/configuration-files#configuring-shared-settings
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
  {
    name: 'frameless/rules',
    plugins: {
      import: eslintPluginImport,
    },
    rules: jsRules,
  },
  ...tseslint.configs.recommended,
  {
    name: 'frameless/tooling',
    files: ['**/*.cjs', '**/vite.config.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    name: 'frameless/test-files',
    files: ['**/*.test.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
  {
    name: 'frameless/source-code',
    files: ['**/src/*.{js,mjs,ts}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    name: 'frameless/react-jsx',
    files: ['**/*.{jsx,tsx}'],
    ignores: ['**/web-components-stencil/**/*.{jsx,tsx}'],
    plugins: {
      react: eslintPluginReact,
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReact.configs['jsx-runtime'].rules,
      ...reactRules,
    },
  },
  {
    name: 'eslint-config-prettier',
    ...eslintConfigPrettier,
  },
);
