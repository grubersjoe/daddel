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
    '@typescript-eslint/array-type': [
      1,
      {
        default: 'generic',
      },
    ],
    '@typescript-eslint/ban-ts-comment': 0,
    'arrow-body-style': 1,
    'react/react-in-jsx-scope': 0,
  },
  ignorePatterns: ['functions/lib/**/*'],
};
