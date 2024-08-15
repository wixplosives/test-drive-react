import pluginJs from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginNoOnlyTests from 'eslint-plugin-no-only-tests';
import pluginReact from 'eslint-plugin-react';
import pluginTypescript from 'typescript-eslint';

for (const config of pluginTypescript.configs.recommendedTypeChecked) {
  config.files = ['**/*.{ts,tsx,mts,cts}']; // ensure config only targets TypeScript files
}

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['dist/', 'cjs/', 'esm/'] },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  // pluginReact.configs.flat["jsx-runtime"],
  { settings: { react: { version: 'detect' } } },
  { plugins: { 'no-only-tests': pluginNoOnlyTests } },
  {
    rules: {
      'no-console': 'error',
      'no-only-tests/no-only-tests': 'error',
      'no-undef': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'react/no-deprecated': 'off',
      'react/prop-types': 'off',
    },
  },
  ...pluginTypescript.configs.recommendedTypeChecked,
  { languageOptions: { parserOptions: { projectService: true } } },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  configPrettier,
];
