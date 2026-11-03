// Configure recommended JavaScript checks for browser modules and Node tooling.
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      '.test-build/**',
      'node_modules/**',
      '.husky/_/**',
      '.npm-cache/**',
      '.browser-profile/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: { ecmaVersion: 'latest', globals: { ...globals.node } },
    rules: { eqeqeq: 'error', 'no-var': 'error', 'prefer-const': 'error' },
  },
  {
    files: ['src/**/*.js', 'tests/ui.test.js'],
    languageOptions: { globals: globals.browser },
  },
];
