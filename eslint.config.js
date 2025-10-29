const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  js.configs.recommended,
  {
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      // Import rules
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: ['**/*.config.js', 'config/**/*.js'],
      }],
      'import/prefer-default-export': 'off',

      // Best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '_site/**',
      'assets/**',
      'dist/**',
    ],
  },
];
