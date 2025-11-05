import '@testing-library/jest-dom'
import { jest } from '@jest/globals'
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

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

import { useRouter } from 'next/router'

useRouter.mockReturnValue({
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
})
