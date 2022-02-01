module.exports = {
  extends: ['react-app', 'plugin:@typescript-eslint/recommended'],
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
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  ignorePatterns: ['functions/lib/**/*'],
};
