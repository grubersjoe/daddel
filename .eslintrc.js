module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'arrow-body-style': 'error',
    'no-console': 'off',
    '@typescript-eslint/array-type': [
      1,
      {
        default: 'generic',
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  ignorePatterns: ['functions/lib/**/*'],
};
