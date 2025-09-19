// import '@testing-library/jest-dom'

import dotenvFlow from 'dotenv-flow'
dotenvFlow.config({ silent: true })

// Mock Sentry module so tests can load API routes
jest.mock('@sentry/nextjs', () => {
  const mockScope = {
    setTag: jest.fn(),
    setContext: jest.fn(),
    setFingerprint: jest.fn(),
    addEventProcessor: jest.fn(),
  }

  return {
    __esModule: true,
    init: jest.fn(() => 'Sentry.init'),
    captureException: jest.fn(() => 'Sentry.captureException'),
    configureScope: jest.fn(() => 'Sentry.configureScope'),
    setUser: jest.fn(() => 'Sentry.setUser'),
    setTag: jest.fn(() => 'Sentry.setTag'),
    withScope: jest.fn((callback) => {
      callback(mockScope)
      return 'Sentry.withScope'
    }),
    getCurrentScope: jest.fn(() => mockScope),
  }
})
