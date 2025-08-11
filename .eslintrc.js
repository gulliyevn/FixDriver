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
    '@typescript-eslint/no-explicit-any': 'warn', // Смягчаем для разработки
    '@typescript-eslint/no-unused-vars': 'warn', // Смягчаем для разработки
    'no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-no-undef': 'error',
    'no-undef': 'error',
    'no-unreachable': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  globals: {
    __DEV__: 'readonly',
  },
  ignorePatterns: [
    '.eslintrc.js', 
    'babel.config.js', 
    'app.config.js',
    'jest.config.js',
    'jest.setup.js',
    '**/__tests__/**',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
  ],
}; 