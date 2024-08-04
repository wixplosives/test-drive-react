import { fixupPluginRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginNoOnlyTests from 'eslint-plugin-no-only-tests';
import pluginReact from 'eslint-plugin-react';
import pluginTypescript from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['dist/', 'cjs/', 'esm/', '**/*.{js,mjs,cjs}'] },
  pluginJs.configs.recommended,

  ...pluginTypescript.configs.recommendedTypeChecked,
  { languageOptions: { parserOptions: { projectService: true } } },

  pluginReact.configs.flat.recommended,
  // pluginReact.configs.flat["jsx-runtime"],
  { settings: { react: { version: 'detect' } } },

  { plugins: { 'no-only-tests': fixupPluginRules(pluginNoOnlyTests) } },
  configPrettier,

  {
    rules: {
      'no-console': 'error',
      'react/no-deprecated': 'off',
      'react/prop-types': 'off',
      'no-only-tests/no-only-tests': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }], // allow unused _ variables
      '@typescript-eslint/unbound-method': 'off',
    },
  },
];
