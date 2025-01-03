const auto = require('eslint-config-canonical/configurations/auto');
const ava = require('eslint-config-canonical/configurations/ava');
const node = require('eslint-config-canonical/configurations/node');

module.exports = [
  ...auto,
  ava.recommended,
  {
    files: ['**/*.cjs'],
    ...node.recommended,
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 0,
      'func-style': 0,
      'id-length': 0,
      'no-template-curly-in-string': 0,
      'regexp/no-unused-capturing-group': 0,
      'regexp/optimal-quantifier-concatenation': 0,
      'require-unicode-regexp': 0,
    },
  },
  {
    files: ['**/src/grammar.ts'],
    rules: {
      'no-useless-escape': 0,
    },
  },
  {
    ignores: [
      'package-lock.json',
      'dist',
      'node_modules',
      '*.log',
      '.*',
      '!.github',
      '!.gitignore',
      '!.husky',
      '!.releaserc',
    ],
  },
];
