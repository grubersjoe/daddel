module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx,js}'],
  coverageDirectory: '.coverage',
  coverageReporters: ['lcov', 'text'],
  rootDir: '.',
  resetMocks: false,
  setupFiles: ['jest-localstorage-mock'],
};
