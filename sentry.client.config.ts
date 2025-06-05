// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT
const SENTRY_RELEASE = process.env.NEXT_PUBLIC_SENTRY_RELEASE
const SENTRY_DEBUG = process.env.NEXT_PUBLIC_SENTRY_DEBUG
const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: SENTRY_ENVIRONMENT,
  release: SENTRY_RELEASE,
  debug: SENTRY_DEBUG === 'true',
  enabled: NODE_ENV === 'production',
})
