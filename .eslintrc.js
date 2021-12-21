module.exports = {
  extends: ['react-app', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'arrow-body-style': 'error',
    'no-console': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  ignorePatterns: ['functions/lib/**/*'],
};
