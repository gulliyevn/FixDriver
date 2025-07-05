module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-no-undef': 'error',
    'no-undef': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    node: true,
    es6: true,
  },
  globals: {
    __DEV__: 'readonly',
  },
}; 