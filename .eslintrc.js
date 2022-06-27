module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    '@react-native-community',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'import/order': ['error', { 'newlines-between': 'always' }],
    'react-native/no-inline-styles': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
    // ESLint doesn't find React Native components
    // Remove this setting when this issue is fixed.
    // https://github.com/facebook/react-native/issues/28549
    'import/ignore': ['react-native'],
    'import/resolver': {
      'babel-module': {},
    },
  },
  globals: {
    crypto: true,
  },
  env: {
    'jest/globals': true,
  },
}
