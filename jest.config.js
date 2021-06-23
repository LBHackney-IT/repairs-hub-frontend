let reporterRules = require('./reporter-rules.json')

module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  clearMocks: true,
  testMatch: ['<rootDir>/**/*.test.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleDirectories: ['node_modules', '.'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': '<rootDir>/src/styles/__mocks__/styleMock.js',
  },
  reporters: [
    ['jest-clean-console-reporter', { rules: reporterRules }],
    '@jest/reporters/build/SummaryReporter',
  ],
}
